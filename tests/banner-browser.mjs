import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const port=Number(process.env.PORT||43213),origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore',env:{...process.env,PORT:String(port)}});
for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
const args=['--no-sandbox'];if(process.env.BROWSER_SOFTWARE_GL==='1')args.push('--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader');
const browser=await chromium.launch({headless:true,args,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined});
const page=await browser.newPage(),errors=[],evidence=[];
page.on('pageerror',e=>errors.push(e.message));await mkdir('artifacts',{recursive:true});
async function settle(){await page.waitForTimeout(130);}
async function checkFrame(label){
  await settle();
  const data=await page.evaluate(()=>{
    const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};
    const visible=el=>el.getClientRects().length>0;
    return {bounds:JSON.parse(document.querySelector('#scene').dataset.apparatusBounds),top:rect(document.querySelector('#top')),lesson:rect(document.querySelector('#lesson')),width:innerWidth,height:innerHeight,scroll:document.documentElement.scrollWidth,
      tags:[...document.querySelectorAll('.part-tag')].filter(visible).map(rect),buttons:[...document.querySelectorAll('#top button')].filter(visible).map(el=>({id:el.id||el.textContent,...rect(el)})),groups:[...document.querySelectorAll('.banner-controls>nav')].filter(visible).map(rect)};
  });
  assert.equal(data.scroll,data.width,`${label}: no horizontal overflow`);
  const b=data.bounds;
  assert.ok(b.left>=10&&b.right<=data.width-10,`${label}: complete beam clears screen edges ${JSON.stringify(b)}`);
  if(data.width===320)assert.ok(b.right-b.left>=160,`${label}: narrow-screen apparatus remains large enough to use`);
  assert.ok(b.top>=data.top.bottom+8&&b.bottom<=data.lesson.top-8,`${label}: complete base and beam clear banner and lesson ${JSON.stringify(data)}`);
  for(const t of data.tags){assert.ok(t.top>=data.top.bottom&&t.bottom<=b.top+1,`${label}: labels remain above the apparatus`);}
  for(const r of data.buttons){assert.ok(r.left>=0&&r.right<=data.width&&r.top>=0&&r.bottom<=data.top.bottom,`${label}: ${r.id} stays in banner`);}
  for(let i=0;i<data.buttons.length;i++)for(let j=i+1;j<data.buttons.length;j++){
    const a=data.buttons[i],b=data.buttons[j];assert.ok(a.right<=b.left+.5||b.right<=a.left+.5||a.bottom<=b.top+.5||b.bottom<=a.top+.5,`${label}: ${a.id} and ${b.id} do not overlap`);
  }
  evidence.push({label,...data});return data;
}
try{
  await page.goto(origin);await page.waitForFunction(()=>document.querySelector('#app').dataset.ready==='true');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('#top #apply').count(),1,'simulation control moved into banner');
  assert.equal(await page.locator('#lesson button#apply').count(),0);
  const manifest=await (await fetch(origin+'/build-manifest.json')).json();
  for(const [width,height] of [[320,568],[1366,768],[1024,768],[768,1024],[390,844],[844,390]]){
    await page.setViewportSize({width,height});
    for(const cls of [1,2,3]){
      await page.locator(`[data-preset="${cls}"]`).click();
      for(const view of ['fit','side']){
        await page.locator(`#${view}`).click();const data=await checkFrame(`${width}x${height} class ${cls} ${view} level`);
        assert.equal(data.groups.length,3,'three distinct groups in Play');
        await page.locator('#apply').click();await page.waitForTimeout(1600);await checkFrame(`${width}x${height} class ${cls} ${view} lifted`);
        await page.locator('#apply').click();await page.waitForTimeout(1300);
      }
      await page.locator('#fit').click();await settle();
      if(width===1366||width===320)await page.screenshot({path:`artifacts/banner-${width}x${height}-class-${cls}.png`});
    }
    for(let repeat=0;repeat<2;repeat++){
      await page.locator('#room-view').click();await settle();
      for(const mode of ['learn','quiz','play']){
        await page.locator(`[data-mode-choice="${mode}"]`).click();await settle();
        assert.ok(await page.locator('#scene').evaluate(el=>{const b=JSON.parse(el.dataset.apparatusBounds);return b.right-b.left<150;}),'changing mode preserves Room View/free camera');
      }
      await page.locator('#fit').click();await page.locator('#orbit').click();await settle();
      const orbited=await page.locator('#scene').getAttribute('data-apparatus-bounds');
      await page.locator('#fit').click();await settle();assert.notEqual(await page.locator('#scene').getAttribute('data-apparatus-bounds'),orbited,'Fit restores framing after Orbit');
      await page.locator('#reset-play').click();assert.equal(await page.locator('#app').getAttribute('data-class'),'1');await checkFrame(`${width}x${height} reset ${repeat}`);
    }
    for(const mode of ['learn','quiz']){
      await page.locator(`[data-mode-choice="${mode}"]`).click();await page.locator('#fit').click();await checkFrame(`${width}x${height} ${mode}`);
      assert.equal(await page.locator('.class-choices').isVisible(),false,'assessment class answer stays concealed');
      if(width===320)await page.screenshot({path:`artifacts/banner-${width}x${height}-${mode}.png`});
    }
    await page.locator('[data-mode-choice="play"]').click();
    const vocab=page.locator('.try-motion [data-term="effort"]');await vocab.hover();
    assert.equal(await page.locator('#vocabulary-tooltip').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
    await page.locator('#apply').click();assert.equal(await page.locator('#app').getAttribute('data-lifted'),'true','tooltip does not block simulation');await page.locator('#apply').click();
    await vocab.click();assert.equal(await page.locator('#reference-dialog').isVisible(),true);await page.locator('#reference-dialog [data-term="fulcrum"]').click();assert.equal(await page.locator('#reference-dialog h2').innerText(),'Fulcrum');await page.locator('#close-reference').click();
  }
  assert.deepEqual(errors,[]);
  await writeFile('artifacts/banner-check.json',JSON.stringify({fullId:manifest.fullId,sourceRevision:manifest.sourceRevision,checks:evidence},null,2));
  console.log(`PASS: ${evidence.length} complete apparatus bounds checks; six desktop/phone viewports; all classes, level/lifted, Fit/Side, repeated mode/reset/view, retained free camera, grouped controls and nested references. ${manifest.fullId}`);
}catch(error){await page.screenshot({path:'artifacts/banner-failure.png'});throw error;}finally{await browser.close();server.kill();}
