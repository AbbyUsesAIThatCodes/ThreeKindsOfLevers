import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const port=Number(process.env.PORT||4178), origin=`http://127.0.0.1:${port}`,url=origin+'/ThreeKindsOfLevers/';
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore',env:{...process.env,PORT:String(port)}});
for(let i=0;i<60;i++){try{const r=await fetch(url);if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
const args=['--no-sandbox'];if(process.env.BROWSER_SOFTWARE_GL==='1')args.push('--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader');
const browser=await chromium.launch({headless:true,args,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined});
const errors=[],external=[];await mkdir('artifacts',{recursive:true});
const page=await browser.newPage({viewport:{width:1366,height:768}});
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('blob:')&&!r.url().startsWith('data:'))external.push(r.url());});
const cls=async()=>Number(await page.locator('#app').getAttribute('data-class'));
async function layout(){
  const data=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    return {tags:[...document.querySelectorAll('.part-tag')].map(rect),top:rect(document.querySelector('#top')),lesson:rect(document.querySelector('#lesson')),width:innerWidth,height:innerHeight,scroll:document.documentElement.scrollWidth,canvas:rect(document.querySelector('canvas'))};
  });
  assert.equal(data.scroll,data.width,'no horizontal page overflow');
  assert.equal(data.canvas.w,data.width);assert.equal(data.canvas.h,data.height);
  for(const r of data.tags){assert.ok(r.x>=0&&r.right<=data.width+1,'labels stay in viewport');assert.ok(r.y>=data.top.bottom-1,'labels clear toolbar');assert.ok(r.bottom<data.lesson.y,'labels clear lesson');}
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){const a=data.tags[i],b=data.tags[j];assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'labels do not overlap');}
}
try{
  await page.goto(url);await page.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');await page.evaluate(()=>document.fonts.ready);
  await layout();await page.screenshot({path:'artifacts/first-class.png'});
  for(const n of [1,2,3]){
    await page.locator(`[data-preset="${n}"]`).click();assert.equal(await cls(),n);
    await page.locator('#side').click();
    const before=Number(await page.locator('#leaders circle[fill="#89500b"]').getAttribute('cy'));
    await page.locator('#apply').click();
    await page.waitForFunction(y=>Number(document.querySelector('#leaders circle[fill="#89500b"]').getAttribute('cy'))<y-8,before);
    assert.match(await page.locator('#motion-note').innerText(),n===1?/Effort moves down/:/Effort moves up/);
    if(n===3){await page.waitForTimeout(1200);await layout();await page.screenshot({path:'artifacts/third-class-lift.png'});}
    await page.locator('#apply').click();
    await page.locator('#arrange').click();const original=await page.locator('#order').getAttribute('aria-label');
    const canvas=await page.locator('canvas').boundingBox();await page.locator('#mirror').click();assert.equal(await cls(),n);
    assert.notEqual(await page.locator('#order').getAttribute('aria-label'),original);
    assert.deepEqual(await page.locator('canvas').boundingBox(),canvas,'panels do not resize canvas');
    await page.locator('#mirror').click();await page.locator('#close-positions').click();
    await page.locator('#fit').click();await layout();await page.screenshot({path:`artifacts/class-${n}.png`});
  }
  await page.locator('[data-preset="1"]').click();await page.locator('#side').click();
  // Raycast the actual fulcrum axle, independently of the floating-label path.
  const pivot=page.locator('#leaders circle[fill="#714896"]');
  const px=Number(await pivot.getAttribute('cx')),py=Number(await pivot.getAttribute('cy'));
  await page.mouse.move(px,py);await page.mouse.down();await page.mouse.move(px+45,py,{steps:5});await page.mouse.up();
  assert.equal(await page.locator('[data-tag="fulcrum"]').getAttribute('aria-pressed'),'true','3D support is pickable');
  assert.ok(Number(await page.locator('#position').inputValue())>10,'dragging 3D support moves pivot');
  await page.locator('[data-preset="1"]').click();
  await page.locator('[data-tag="effort"]').focus();
  for(let i=0;i<7;i++)await page.keyboard.press('ArrowRight');
  assert.equal(await cls(),3,'keyboard can carry effort past fulcrum');
  // Drag the effort label back across the fulcrum.
  const tag=await page.locator('[data-tag="effort"]').boundingBox();
  await page.mouse.move(tag.x+tag.width/2,tag.y+tag.height/2);await page.mouse.down();await page.mouse.move(tag.x+tag.width/2-200,tag.y+tag.height/2,{steps:8});await page.mouse.up();
  assert.equal(await cls(),1,'label dragging updates class');
  const originalOrder=await page.locator('#order').getAttribute('aria-label');
  const drag=await page.locator('[data-tag="effort"]').boundingBox();await page.mouse.move(drag.x+drag.width/2,drag.y+drag.height/2);await page.mouse.down();await page.mouse.move(drag.x+drag.width/2+270,drag.y+drag.height/2,{steps:5});await page.keyboard.press('Escape');await page.mouse.up();
  assert.equal(await page.locator('#order').getAttribute('aria-label'),originalOrder,'Escape restores drag start');
  await page.locator('[data-preset="2"]').click();await page.locator('#orbit').click();await page.locator('#orbit').click();await layout();await page.screenshot({path:'artifacts/rear-view.png'});
  await page.locator('#help').click();await page.locator('#reduced').check();await page.getByRole('button',{name:'Back to the workbench'}).click();
  await page.locator('#apply').click();assert.equal(await page.locator('#app').getAttribute('data-lifted'),'true');
  await page.reload();await page.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');assert.equal(await cls(),2,'saved arrangement persists');
  for(const [width,height] of [[1024,768],[1366,768],[390,844],[844,390]]){
    await page.setViewportSize({width,height});await page.locator('#fit').click();
    for(const n of [1,2,3]){await page.locator(`[data-preset="${n}"]`).click();await layout();}
    await page.screenshot({path:`artifacts/viewport-${width}x${height}.png`});
  }
  // Root hosting and repository-prefix hosting both use only bundled assets.
  await page.goto(origin+'/');await page.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');assert.match(await page.title(),/Three Kinds of Levers/);
  const fallback=await browser.newPage({viewport:{width:1024,height:768}});fallback.on('pageerror',e=>errors.push(e.message));
  await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...rest){return kind.startsWith('webgl')?null:get.call(this,kind,...rest);};Object.defineProperty(window,'localStorage',{get(){throw Error('Storage unavailable');}});});
  await fallback.goto(url);await fallback.waitForFunction(()=>document.querySelector('#app').dataset.ready==='fallback');
  await fallback.locator('#close-positions').click();await fallback.locator('[data-preset="3"]').click();await fallback.locator('#apply').click();
  assert.equal(await fallback.locator('#app').getAttribute('data-class'),'3');assert.equal(await fallback.locator('#fallback-svg text').count(),3);
  await fallback.locator('#arrange').click();await fallback.locator('#mirror').click();assert.equal(await fallback.locator('#app').getAttribute('data-class'),'3');await fallback.locator('#close-positions').click();await fallback.screenshot({path:'artifacts/fallback.png'});await fallback.close();
  assert.deepEqual(errors,[],'no unhandled page errors');assert.deepEqual(external,[],'all runtime assets are local');
  console.log('PASS: three classes, lift directions, labels, drag and keyboard movement, mirror, camera, stable viewport, desktop/mobile, persistence, reduced motion, WebGL/storage fallback, and local assets.');
}catch(error){await page.screenshot({path:'artifacts/browser-failure.png'});throw error;}finally{await browser.close();server.kill();}
