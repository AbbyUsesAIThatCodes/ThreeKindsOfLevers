import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const port=4184,origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore',env:{...process.env,PORT:String(port)}});
let browser;
try{
  for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);await page.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');
  const room=await page.locator('#scene').evaluate(el=>({...el.dataset}));
  assert.equal(room.desks,'4');assert.equal(room.deskPairs,'2');assert.equal(room.pushBar,'true');assert.equal(room.extinguisher,'true');
  await mkdir('artifacts',{recursive:true});
  await page.locator('#room-view').click();await page.waitForTimeout(300);await page.screenshot({path:'artifacts/classroom-overview.png'});
  await page.locator('#fit').click();await page.screenshot({path:'artifacts/classroom-workbench.png'});
  await page.locator('[data-mode-choice="learn"]').click();
  for(let i=7;i<13;i++){await page.locator('#guide-picker').selectOption(String(i));await page.screenshot({path:`artifacts/example-${i-7}.png`});}
  assert.deepEqual(errors,[]);console.log('PASS: four independent desks in two pairs, exit-bar/extinguisher groups, classroom camera and original example diagrams rendered.');
}finally{await browser?.close();server.kill();}
