import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const roots=process.argv.slice(2);assert.ok(roots.length,'Pass one or more exact package directories.');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  for(const [index,arg] of roots.entries()){
    const root=path.resolve(arg),manifest=JSON.parse(await readFile(path.join(root,'site/build-manifest.json'),'utf8'));
    assert.equal(path.basename(root),manifest.fullId);assert.equal(manifest.sourceDirty,false);
    const report=await readFile(path.join(root,'site/BUILD-REPORT.txt'),'utf8');
    for(const value of [manifest.fullId,manifest.builtAtUtc,manifest.sourceRevision,manifest.sourceFingerprint,manifest.packagerRevision])assert.ok(report.includes(value));
    const port=43166+index,origin=`http://127.0.0.1:${port}`;
    const server=spawn(process.execPath,[path.join(root,'serve-review.mjs')],{env:{...process.env,PORT:String(port),OPEN_BROWSER:'0'},windowsHide:true});let output='';
    server.stdout.on('data',chunk=>output+=chunk);server.stderr.on('data',chunk=>output+=chunk);
    const context=await browser.newContext({viewport:{width:1366,height:900}}),page=await context.newPage(),errors=[],external=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('request',req=>{if(!req.url().startsWith(origin))external.push(req.url());});
    try{
      let ready=false;for(let n=0;n<60;n++){if(server.exitCode!==null)throw Error(output);try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'package launcher serves the game');
      await page.goto(origin);await page.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');
      assert.equal(await page.locator('#build-identity').innerText(),`Review Build · ${manifest.fullId}`);assert.ok(output.includes(manifest.fullId));
      assert.equal((await (await fetch(origin+'/build-manifest.json')).json()).fullId,manifest.fullId);
      for(const mode of ['learn','quiz','play']){await page.locator(`[data-mode-choice="${mode}"]`).click();assert.equal(await page.locator('#app').getAttribute('data-mode'),mode);}
      assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
      const evidence=path.join(root,'evidence');await mkdir(evidence,{recursive:true});await page.screenshot({path:path.join(evidence,'snapshot.png')});
      await writeFile(path.join(evidence,'package-check.json'),JSON.stringify({fullId:manifest.fullId,sourceRevision:manifest.sourceRevision,checkedAtUtc:new Date().toISOString(),browser:await browser.version(),port,checks:['launcher HTTP','UI/console/manifest/report identity','clean game source','Play/Learn/Quiz navigation','no page errors','no external runtime requests'],result:'passed'},null,2));
      console.log(`PASS PACKAGE ${manifest.fullId}`);
    }finally{await context.close();server.kill();}
  }
}finally{await browser.close();}
