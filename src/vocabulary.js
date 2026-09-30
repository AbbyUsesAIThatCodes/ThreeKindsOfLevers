// Small glossary layer: definitions never intercept a neighboring control.
const TERMS={
  effort:{title:'Effort',text:'The push or pull applied to a lever. Also called input or applied force.',related:['load','fulcrum']},
  load:{title:'Load',text:'The object or resistance the lever acts on. In this model, the hanging object’s weight provides the resistance force.',related:['effort','fulcrum']},
  fulcrum:{title:'Fulcrum',text:'The fixed pivot about which the lever turns during the motion demonstration.',related:['effort','load']},
};
export function setupVocabulary(){
  const tip=document.createElement('div');tip.id='vocabulary-tooltip';tip.role='tooltip';tip.hidden=true;document.body.append(tip);
  const dialog=document.createElement('dialog');dialog.id='reference-dialog';document.body.append(dialog);
  let current=null;
  function hide(){tip.hidden=true;current?.removeAttribute('aria-describedby');current=null;}
  function reference(key){hide();const t=TERMS[key];dialog.innerHTML=`<h2>${t.title}</h2><p>${t.text}</p><p>Related: ${t.related.map(r=>`<button class="vocab" data-term="${r}">${TERMS[r].title}</button>`).join(' · ')}</p><p class="reference-source">EES 2.2.1 R01 local targets G01–G02; source A p. 5. See the teacher coverage map.</p><button id="close-reference">Back to the Activity</button>`;dialog.querySelector('#close-reference').onclick=()=>dialog.close();if(!dialog.open)dialog.showModal();}
  function show(button){hide();current=button;const t=TERMS[button.dataset.term];tip.textContent=`${t.text} Select the word to open its reference.`;tip.hidden=false;button.setAttribute('aria-describedby',tip.id);const r=button.getBoundingClientRect(),w=Math.min(290,innerWidth-24);tip.style.width=`${w}px`;tip.style.left=`${Math.max(12,Math.min(innerWidth-w-12,r.left))}px`;tip.style.top=`${Math.max(8,r.top-tip.offsetHeight-8)}px`;}
  document.addEventListener('pointerover',e=>{const b=e.target.closest('.vocab');if(b)show(b);});
  document.addEventListener('pointerout',e=>{if(e.target.closest('.vocab'))hide();});
  document.addEventListener('focusin',e=>{const b=e.target.closest('.vocab');if(b)show(b);});
  document.addEventListener('focusout',hide);
  document.addEventListener('click',e=>{const b=e.target.closest('.vocab');if(b)reference(b.dataset.term);else hide();});
  window.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);
  dialog.addEventListener('close',hide);
}
