import { LeverScene } from './scene.js';
import { ROLES, PRESETS, LESSONS, order, leverClass, move, step, mirror, measures, valid } from './model.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const cap=s=>s[0].toUpperCase()+s.slice(1), storageKey='three-kinds-of-levers-v1';
const colors={effort:'#176b61',fulcrum:'#714896',load:'#89500b'};
let state={...PRESETS[1]}, selected='effort', lifted=false, scene=null, ready=false, fallback=false;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches, lastClass=null, latestPositions=null;
try{const saved=JSON.parse(localStorage.getItem(storageKey));if(valid(saved?.state))state={...saved.state};reduced=reduced||saved?.reduced===true;}catch{}
function save(){try{localStorage.setItem(storageKey,JSON.stringify({state,reduced}));}catch{}}
function notice(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(notice.timer);notice.timer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
function select(role){selected=role;if(ready)scene.select(role);renderSelection();}
function renderSelection(){
  for(const role of ROLES)for(const b of $$(`[data-select="${role}"]`))b.setAttribute('aria-pressed',String(selected===role));
  $('#position-label').textContent=`${cap(selected)} position`;
  $('#position').value=(state[selected]+250)/25;
  $('#position').setAttribute('aria-valuetext',`${cap(selected)} at position ${(state[selected]+250)/25+1} of 21`);
  const sign=ready?scene.screenSign():1;
  $('#move-left').disabled=step(state,selected,-sign)[selected]===state[selected];
  $('#move-right').disabled=step(state,selected,sign)[selected]===state[selected];
}
function setState(next){state={...next};lifted=false;if(ready)scene.setState(state);render();save();}
function setLifted(value){lifted=value;if(ready)scene.setLifted(value);renderMotion();if(fallback)drawFallback();}
function renderMotion(){
  const direction=measures(state).effortDirection===1?'up':'down';
  $('#apply').textContent=lifted?'Return to level':'Apply effort · lift the load';$('#apply').setAttribute('aria-pressed',String(lifted));
  $('#motion-note').innerHTML=`Effort moves <b>${direction}</b>.<br>Load moves <b>up</b>.`;
  $('[data-tag="effort"] small').textContent=direction==='up'?'↑ Pull up here':'↓ Push down here';
  $('#app').dataset.lifted=String(lifted);
}
function render(){
  const cls=leverClass(state),lesson=LESSONS[cls];
  $('#class-name').textContent=lesson.name;$('#class-rule').innerHTML=lesson.explanation.replace(lesson.middle,`<b>${lesson.middle}</b>`);
  $('#example-name').textContent=lesson.example;$('#example-text').textContent=lesson.connection;
  for(const b of $$('[data-preset]'))b.setAttribute('aria-pressed',String(Number(b.dataset.preset)===cls));
  $('#order').innerHTML=order(state).map(p=>`<span class="order-part ${p} ${p===lesson.middle?'middle':''}">${cap(p)}</span>`).join('<span class="order-line" aria-hidden="true"></span>');
  $('#order').setAttribute('aria-label',`Along the beam: ${order(state).map(cap).join(', ')}. ${cap(lesson.middle)} is in the middle.`);
  $('#app').dataset.class=cls;
  if(lastClass!==cls){$('#announcement').textContent=`${lesson.name}. ${lesson.explanation}`;lastClass=cls;}
  renderSelection();renderMotion();if(fallback)drawFallback();
}
for(const role of ROLES){
  const tag=document.createElement('button');tag.className=`part-tag ${role}`;tag.dataset.select=role;tag.dataset.tag=role;
  tag.innerHTML=`${cap(role)}<small>${role==='fulcrum'?'Pivot point':role==='load'?'The object to move':'↓ Push down here'}</small>`;
  tag.setAttribute('aria-label',`Select or drag ${cap(role)}`);$('#tags').append(tag);
  const choice=document.createElement('button');choice.dataset.select=role;choice.textContent=cap(role);$('#role-choices').append(choice);
  choice.addEventListener('click',()=>select(role));
  tag.addEventListener('click',()=>select(role));
  tag.addEventListener('pointerdown',e=>{if(ready)scene.beginDrag(e,role);});
  tag.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();select(role);setState(step(state,role,(e.key==='ArrowRight'?1:-1)*(ready?scene.screenSign():1)));}});
}
function onFrame({positions}){
  if(!positions.effort)return;latestPositions=positions;
  const width=innerWidth,top=$('#top').getBoundingClientRect().bottom,bottom=$('#lesson').getBoundingClientRect().top;
  const tagWidth=$('[data-tag="effort"]').getBoundingClientRect().width;
  const margin=tagWidth/2+12,gap=tagWidth+10;
  const parts=[...ROLES].sort((a,b)=>positions[a].x-positions[b].x);
  let xs=parts.map(p=>Math.max(margin,Math.min(width-margin,positions[p].x)));
  for(let i=1;i<3;i++)xs[i]=Math.max(xs[i],xs[i-1]+gap);
  if(xs[2]>width-margin){xs[2]=width-margin;for(let i=1;i>=0;i--)xs[i]=Math.min(xs[i],xs[i+1]-gap);}
  if(xs[0]<margin){xs=parts.map((_,i)=>margin+i*(width-2*margin)/2);}
  const tagHeight=Math.max(...$$('.part-tag').map(tag=>tag.getBoundingClientRect().height));
  const y=Math.max(top+tagHeight+8,Math.min(bottom-85,Math.min(...ROLES.map(p=>positions[p].y))-70));
  const lines=[];
  parts.forEach((p,i)=>{
    const tag=$(`[data-tag="${p}"]`),point=positions[p];tag.style.left=`${xs[i]}px`;tag.style.top=`${y}px`;
    lines.push(`<path d="M ${xs[i]} ${y+3} L ${point.x} ${point.y}" stroke="${colors[p]}" stroke-width="1.6" fill="none" opacity=".75"/><circle cx="${point.x}" cy="${point.y}" r="4" fill="${colors[p]}" stroke="#fffce9" stroke-width="1.5"/>`);
  });
  $('#leaders').innerHTML=lines.join('');renderSelection();
}
function drawFallback(){
  const m=measures(state),angle=lifted?m.liftAngle:0,px=400+state.fulcrum;
  const x=p=>px+(state[p]-state.fulcrum)*Math.cos(angle),y=p=>205-(state[p]-state.fulcrum)*Math.sin(angle);
  const ex=x('effort'),ey=y('effort'),lx=x('load'),ly=y('load'),d=m.effortDirection;
  $('#fallback-svg').innerHTML=`<defs><marker id="arrow-e" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="${colors.effort}"/></marker><marker id="arrow-l" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="${colors.load}"/></marker></defs><path d="M ${px-20} 270 L ${px} 205 L ${px+20} 270 Z" fill="${colors.fulcrum}"/><path d="M ${px+(-300-state.fulcrum)*Math.cos(angle)} ${205-(-300-state.fulcrum)*Math.sin(angle)} L ${px+(300-state.fulcrum)*Math.cos(angle)} ${205-(300-state.fulcrum)*Math.sin(angle)}" stroke="#708e8b" stroke-width="13"/><path d="M ${ex} ${ey-100} L ${ex} ${ey-100-d*50}" stroke="${colors.effort}" stroke-width="5" marker-end="url(#arrow-e)"/><path d="M ${lx} ${ly+5} L ${lx} ${ly+60}" stroke="${colors.load}" stroke-width="4" marker-end="url(#arrow-l)"/><rect x="${lx-17}" y="${ly+62}" width="34" height="30" rx="5" fill="${colors.load}"/>${ROLES.map(p=>`<circle cx="${x(p)}" cy="${y(p)}" r="8" fill="${colors[p]}"/><text x="${x(p)}" y="${p==='fulcrum'?305:y(p)-25}" text-anchor="middle" font-family="Comic Neue, sans-serif" font-weight="bold" font-size="25" fill="${colors[p]}">${cap(p)}</text>`).join('')}`;
}
function unavailable(){
  ready=false;fallback=true;if(scene)scene.active=false;$('#scene').hidden=true;$('#tags').hidden=true;$('#leaders').hidden=true;$('#fallback').hidden=false;
  $$('.camera-controls button').forEach(b=>b.disabled=true);$('#fallback > p').hidden=true;$('.view-tools > p').textContent='Diagram view · use Move parts to explore.';$('#position-panel').hidden=false;$('#arrange').setAttribute('aria-expanded','true');
  $('#app').dataset.ready='fallback';drawFallback();
}
for(const b of $$('[data-preset]'))b.addEventListener('click',()=>setState(PRESETS[b.dataset.preset]));
$('#apply').addEventListener('click',()=>setLifted(!lifted));
$('#mirror').addEventListener('click',()=>setState(mirror(state)));
$('#position').addEventListener('input',e=>setState(move(state,selected,Number(e.target.value)*25-250)));
for(const [id,d] of [['move-left',-1],['move-right',1]])$(`#${id}`).addEventListener('click',()=>setState(step(state,selected,d*(ready?scene.screenSign():1))));
function showPositions(value){$('#position-panel').hidden=!value;$('#arrange').setAttribute('aria-expanded',String(value));}
$('#arrange').addEventListener('click',()=>showPositions($('#position-panel').hidden));$('#close-positions').addEventListener('click',()=>{showPositions(false);$('#arrange').focus();});
$('#side').addEventListener('click',()=>scene?.sideCamera());$('#fit').addEventListener('click',()=>scene?.resetCamera());$('#orbit').addEventListener('click',()=>scene?.turn());
$('#help').addEventListener('click',()=>{$('#help-dialog').showModal();});for(const b of $$('.dialog-close'))b.addEventListener('click',()=>$('#help-dialog').close());
$('#reduced').checked=reduced;$('#reduced').addEventListener('change',e=>{reduced=e.target.checked;if(scene){scene.reduced=reduced;scene.dirty=true;}save();});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notice('Full screen is unavailable in this browser.');}});if(!document.fullscreenEnabled)$('#fullscreen').hidden=true;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#position-panel').hidden)showPositions(false);});
const layoutObserver=new ResizeObserver(()=>{if(latestPositions&&ready)onFrame({positions:scene.screenPositions()});});layoutObserver.observe($('#top'));layoutObserver.observe($('#lesson'));
render();
try{scene=new LeverScene($('#scene'),{onChange:setState,onSelect:p=>{selected=p;renderSelection();},onFrame,onNotice:notice,onUnavailable:unavailable,onDrag:()=>setLifted(false)});await scene.init();ready=true;scene.reduced=reduced;scene.setState(state);scene.select(selected);$('#app').dataset.ready='true';}catch(error){console.warn('3D unavailable; using diagram.',error.message);unavailable();}
