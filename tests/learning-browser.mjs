import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { QUIZ, GUIDES } from '../src/learning.js';
import { leverClass, order } from '../src/model.js';
const port=4182, origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore',env:{...process.env,PORT:String(port)}});
let browser;
try {
  for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);await page.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');
  await page.locator('[data-preset="2"]').click();
  await page.locator('[data-mode-choice="learn"]').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#activity').innerText(),/Find the Three Roles/);
  assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H2');
  await page.keyboard.press('Tab');await page.keyboard.press('Tab');await page.keyboard.press('Enter');
  assert.match(await page.locator('#activity h2').innerText(),/Meet a First Class/);
  assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H2');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('ArrowDown');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'guide-picker');
  await page.locator('#guide-picker').selectOption('4');
  await page.locator('[data-tag="fulcrum"]').focus();
  for(let n=0;n<20&&await page.locator('#app').getAttribute('data-class')!=='1';n++)await page.keyboard.press('ArrowRight');
  await page.locator('#build-form select').selectOption('fulcrum');await page.locator('#build-form button').click();
  assert.equal(await page.locator('#build-feedback').getAttribute('data-correct'),'true');
  await page.locator('#build-form select').selectOption('effort');
  assert.equal(await page.locator('#build-feedback').getAttribute('data-correct'),null);
  await page.locator('#build-form button').click();assert.equal(await page.locator('#build-feedback').getAttribute('data-correct'),'false');
  await page.locator('#guide-picker').selectOption(String(GUIDES.length-1));
  assert.match(await page.locator('#activity').innerText(),/12-degree/);
  await page.locator('[data-mode-choice="play"]').click();
  assert.equal(await page.locator('#app').getAttribute('data-class'),'2','Play arrangement survives other modes');
  await page.locator('[data-mode-choice="quiz"]').click();
  assert.equal(await page.locator('.class-summary').isVisible(),false);
  assert.equal(await page.locator('.class-choices').isVisible(),false);
  assert.equal(await page.locator('#announcement').innerText(),'');
  for(let i=0;i<QUIZ.length;i++){
    const q=QUIZ[i];
    if(q.id==='motion'){
      assert.equal(await page.locator('#arrange').isDisabled(),true);
      await page.locator('canvas').focus();for(let n=0;n<15;n++)await page.keyboard.press('ArrowRight');
      await page.locator('#position').evaluate(el=>{el.value='13';el.dispatchEvent(new Event('input',{bubbles:true}));});
      assert.equal(await page.locator('#app').getAttribute('data-class'),'3');
      await page.locator('#apply').click();assert.match(await page.locator('#motion-note').innerText(),/Effort moves up/);
    }
    if(q.kind==='choice')await page.locator('select[name="choice"]').selectOption(String(q.answer));
    else if(q.kind==='build'){
      const role={1:'fulcrum',2:'load',3:'effort'}[q.target];
      await page.locator(`[data-tag="${role}"]`).focus();
      for(let step=0;step<20&&Number(await page.locator('#app').getAttribute('data-class'))!==q.target;step++)await page.keyboard.press(q.target===2?'ArrowLeft':'ArrowRight');
      assert.equal(Number(await page.locator('#app').getAttribute('data-class')),q.target,'learner constructs target by moving an actual part');
      await page.locator('select[name="middle"]').selectOption({1:'fulcrum',2:'load',3:'effort'}[q.target]);
    }
    else if(q.kind==='example'){
      await page.locator('select[name="class"]').selectOption(String(q.example.class));
      await page.locator('select[name="middle"]').selectOption({1:'fulcrum',2:'load',3:'effort'}[q.example.class]);
      for(const [role,location] of Object.entries(q.example.roles))await page.locator(`select[name="${role}"]`).selectOption(location);
    }
    else{
      await page.locator('select[name="class"]').selectOption(String(i===0?2:leverClass(q.state)));
      await page.locator('select[name="middle"]').selectOption(order(q.state)[1]);
    }
    await page.locator('#quiz-form button').click();
    if(i===0){assert.match(await page.locator('#quiz-feedback').innerText(),/Not yet/);await page.locator('select[name="class"]').selectOption('1');await page.locator('#quiz-form button').click();}
    assert.match(await page.locator('#quiz-feedback').innerText(),/^Correct/);
    if(i===1){
      await page.locator('select[name="class"]').selectOption('2');
      assert.match(await page.locator('#quiz-feedback').innerText(),/^Response changed/);
      assert.equal(await page.locator('#quiz-feedback').getAttribute('data-correct'),null);
      assert.equal(await page.locator('#quiz-form button').isEnabled(),true);
      await page.locator('#quiz-form button').click();assert.match(await page.locator('#quiz-feedback').innerText(),/^Not yet/);
      await page.locator('select[name="class"]').selectOption('1');await page.locator('#quiz-form button').click();
      assert.match(await page.locator('#quiz-feedback').innerText(),/^Correct/);
    }
    await page.locator('#next-question').focus();await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H2','question navigation restores heading focus');
  }
  assert.ok((await page.locator('#activity').innerText()).includes(`${QUIZ.length-1} / ${QUIZ.length} correct on the first attempt`));
  assert.match(await page.locator('#activity').innerText(),/1 corrected/);
  await page.locator('#restart-quiz').click();await page.locator('#reset-quiz').click();
  assert.match(await page.locator('#activity').innerText(),/Quiz · 1 of/);
  await page.locator('[data-term="effort"]').hover();
  assert.equal(await page.locator('#vocabulary-tooltip').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
  await page.locator('[data-term="effort"]').click();await page.locator('#reference-dialog [data-term="fulcrum"]').click();
  assert.equal(await page.locator('#reference-dialog h2').innerText(),'Fulcrum');await page.locator('#close-reference').click();
  await mkdir('artifacts',{recursive:true});
  for(const [width,height] of [[1366,900],[390,844],[844,390],[320,568]]){
    await page.setViewportSize({width,height});
    for(const mode of ['play','learn','quiz']){
      await page.locator(`[data-mode-choice="${mode}"]`).click();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      const canvas=await page.locator('canvas').boundingBox();assert.equal(canvas.width,width);assert.equal(canvas.height,height);
      await page.screenshot({path:`artifacts/${mode}-${width}x${height}.png`});
    }
  }
  const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});touch.on('pageerror',e=>errors.push(e.message));
  await touch.goto(origin);await touch.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');
  await touch.locator('#side').tap();const tag=await touch.locator('[data-tag="effort"]').boundingBox();
  const client=await touch.context().newCDPSession(touch),x=tag.x+tag.width/2,y=tag.y+tag.height/2;
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let n=1;n<=6;n++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+n*28,y}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await touch.locator('#app').getAttribute('data-class'),'3','emulated touch drag moves actual role across fulcrum');
  const before=await touch.locator('#order').getAttribute('aria-label'),moved=await touch.locator('[data-tag="effort"]').boundingBox();
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:moved.x+20,y:moved.y+20}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:30,y:moved.y+20}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  assert.equal(await touch.locator('#order').getAttribute('aria-label'),before,'touch cancellation restores arrangement');
  await touch.locator('[data-mode-choice="learn"]').tap();assert.equal(await touch.locator('#app').getAttribute('data-mode'),'learn');
  await touch.screenshot({path:'artifacts/touch-learn.png'});await touch.close();
  assert.deepEqual(errors,[]);console.log('PASS: modes, guided steps, quiz concealment, correct/incorrect replies, first attempt vs retry, reset, Play restoration, responsive full-window canvas.');
} finally {await browser?.close();server.kill();}
