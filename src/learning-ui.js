import { GUIDES, QUIZ, assess, explain, recordAttempt, summarize } from './learning.js';
import { PRESETS } from './model.js';
import { exampleGraphic } from './examples.js';

export function setupLearning({getState,setState,setLifted,showPositions}) {
  const $=s=>document.querySelector(s), activity=$('#activity');
  let mode='play', guide=0, question=0, records={}, playState={...getState()}, complete=false;
  const option=(value,label)=>`<option value="${value}">${label}</option>`;
  const classOptions=()=>option('','Choose a Class')+[1,2,3].map((n)=>option(n,['First Class','Second Class','Third Class'][n-1])).join('');
  const middleOptions=()=>option('','Choose a Role')+['effort','fulcrum','load'].map(x=>option(x,x[0].toUpperCase()+x.slice(1))).join('');
  function render() {
    $('#app').dataset.mode=mode;
    document.querySelectorAll('[data-mode-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modeChoice===mode)));
    activity.hidden=mode==='play';
    if(mode==='play')return;
    if(mode==='learn'){
      const g=GUIDES[guide];
      activity.innerHTML=`<label class="lesson-picker">Learn · ${guide+1} of ${GUIDES.length}<select id="guide-picker" aria-label="Choose a Lesson">${GUIDES.map((x,i)=>`<option value="${i}" ${i===guide?'selected':''}>${x.title}</option>`).join('')}</select></label><h2>${g.title}</h2>${g.example?exampleGraphic(g.example):''}<p>${g.text}</p><p class="task-hint">${g.action}</p>${g.kind==='build'?`<form id="build-form"><label>Middle Role <select name="middle" required>${middleOptions()}</select></label><button class="primary">Check Construction</button></form><p id="build-feedback" role="status"></p>`:''}<div class="activity-actions"><button id="previous-guide" ${guide===0?'disabled':''}>Previous</button><button id="reset-guide">Reset This Lesson</button><button id="next-guide">${guide===GUIDES.length-1?'Try Quiz':'Next Lesson'}</button></div>`;
      $('#guide-picker').onchange=e=>{guide=Number(e.target.value);load();};
      if(g.kind==='build')$('#build-form').onsubmit=e=>{e.preventDefault();const correct=assess(g,Object.fromEntries(new FormData(e.currentTarget)),getState());$('#build-feedback').dataset.correct=String(correct);$('#build-feedback').textContent=`${correct?'✓ Construction Matches.':'✕ Keep Building.'} ${explain(g,getState())}`;};
      $('#previous-guide').onclick=()=>{guide--;load();};
      $('#reset-guide').onclick=load;
      $('#next-guide').onclick=()=>{if(guide===GUIDES.length-1)changeMode('quiz');else{guide++;load();}};
      return;
    }
    const score=summarize(records,QUIZ.length);
    if(complete){
      activity.innerHTML=`<p class="eyebrow">Quiz Review</p><h2>What Did You Learn?</h2><p><strong>${score.firstCorrect} / ${score.total} correct on the first attempt.</strong> ${score.corrected} corrected after feedback. ${score.total-score.answered} not attempted.</p><p>Use Learn to revisit the roles and middle-position rule. This checks a small part of the lesson, not physical-build mastery.</p><div class="activity-actions"><button id="restart-quiz">Start a New Quiz</button><button id="review-learn">Return to Learn</button></div>`;
      $('#restart-quiz').onclick=resetQuiz;$('#review-learn').onclick=()=>changeMode('learn');return;
    }
    const q=QUIZ[question];
    $('#app').dataset.activityKind=q.kind;
    const locations=q.kind==='example'?['effort','fulcrum','load'].map(role=>`<label>${role[0].toUpperCase()+role.slice(1)} Location<select name="${role}" required>${option('','Choose a Location')}${q.example.locations.map((s,i)=>option('ABC'[i],`${'ABC'[i]}: ${s}`)).join('')}</select></label>`).join(''):'';
    const inputs=q.kind==='choice'?`<label>Choose Your Answer<select name="choice" required>${option('','Choose an Answer')}${q.options.map((x,i)=>option(i,x)).join('')}</select></label>`:`${locations}${q.kind==='build'?'':`<label>Lever Class<select name="class" required>${classOptions()}</select></label>`}<label>Middle Role<select name="middle" required>${middleOptions()}</select></label>`;
    activity.innerHTML=`<p class="eyebrow">Quiz · ${question+1} of ${QUIZ.length}</p><h2>${q.title}</h2>${q.example?exampleGraphic(q.example,false):''}<p>${q.prompt}</p><form id="quiz-form">${inputs}<button class="primary" type="submit">Check Answer</button></form><p id="quiz-feedback" role="status" aria-live="polite"></p><div class="activity-actions"><button id="next-question">Skip Question</button><button id="reset-quiz">Restart Quiz</button></div>`;
    $('#quiz-form').onsubmit=e=>{e.preventDefault();const form=new FormData(e.currentTarget),response=Object.fromEntries(form);const correct=assess(q,response,getState());records=recordAttempt(records,q.id,correct);$('#quiz-feedback').dataset.correct=String(correct);$('#quiz-feedback').textContent=`${correct?'Correct.':'Not yet.'} ${explain(q,getState())}${!correct?' Try again; your first response is already recorded.':''}`;$('#next-question').textContent=question===QUIZ.length-1?'See Results':'Next Question';if(correct)e.currentTarget.querySelector('button').disabled=true;};
    $('#next-question').onclick=()=>{question++;if(question===QUIZ.length){complete=true;render();}else load();};
    $('#reset-quiz').onclick=resetQuiz;
  }
  function resetQuiz(){records={};question=0;complete=false;load();}
  function load(){setLifted(false);showPositions(false);$('#app').dataset.activityKind='';if(mode==='learn')setState(GUIDES[guide].state);if(mode==='quiz'&&!complete)setState(QUIZ[question].state);render();activity.scrollTop=0;}
  function changeMode(next){if(next===mode)return;if(mode==='play')playState={...getState()};mode=next;$('#app').dataset.mode=mode;$('#announcement').textContent='';if(mode==='play')setState(playState);load();}
  document.querySelectorAll('[data-mode-choice]').forEach(b=>b.onclick=()=>changeMode(b.dataset.modeChoice));
  $('#reset-play').onclick=()=>{setState(PRESETS[1]);setLifted(false);};
  document.addEventListener('arrangement-change',()=>{const feedback=mode==='learn'?$('#build-feedback'):$('#quiz-feedback');if(feedback){feedback.textContent='Arrangement changed. Check this arrangement when you are ready.';delete feedback.dataset.correct;const button=$('#quiz-form button');if(button)button.disabled=false;}});
  render();
  return { get mode(){return mode;} };
}
