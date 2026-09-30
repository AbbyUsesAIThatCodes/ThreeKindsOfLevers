import { PRESETS, LESSONS, leverClass, order, valid, mirror } from './model.js';
import { EXAMPLES } from './examples.js';

// Gxx identifiers are local targets in the approved EES 2.2.1 R01 audit.
export const SOURCE = 'EES 2.2.1 R01';
export const GUIDES = [
  { title: 'Find the Three Roles', goals: ['G01','G02','G23'], state: PRESETS[1], text: 'The effort is your applied push or pull. The load is the object you want to move; its weight supplies resistance here. The fulcrum is the pivot. A role depends on what a part does, not its color or shape.', action: 'Select each role on the beam. Try Apply Effort and watch the two force locations.' },
  ...[1,2,3].map(n => ({ title: `Meet a ${LESSONS[n].name} Lever`, goals: ['G54','G60','G61'], state: PRESETS[n], text: LESSONS[n].explanation, action: 'Move a part, then use Reverse Arrangement. Class depends on the middle role, not left versus right. Try the lift and compare motion.' })),
  ...[1,2,3].map(n=>({kind:'build',target:n,title:`Build a ${LESSONS[n].name} Lever`,goals:['G21','G26','G27','G54'],state:PRESETS[n%3+1],text:`Rearrange the actual beam into ${LESSONS[n].name.toLowerCase()}. ${LESSONS[n].explanation}`,action:'Drag the labeled parts, or open Move Parts and select a role before moving it. Choose the middle role and check your construction. This is digital design rehearsal, not a physical assembly test.'})),
  ...EXAMPLES.map(example=>({kind:'example',example,title:example.title,goals:example.id==='forearm'?['G01','G23','G54','G58']:['G01','G23','G54','G60'],state:PRESETS[example.class],text:example.text,action:'Find all three roles on the object and compare their order with the beam. Follow the pictured operating configuration.'})),
  { title: 'Know the Model’s Limits', goals: ['G52','G64','G68'], state: PRESETS[3], text: 'Apply Effort demonstrates a controlled 12-degree lift. The beam and attachments are treated as massless and the pivot as frictionless. This game does not measure force or calculate acceleration.', action: 'Watch the load rise while its gold gravitational-force arrow stays downward. First-class effort and load locations move oppositely; second and third move together in this lifting setup.' },
];
export const QUIZ = [
  ...[1,2,3].flatMap(n => [false,true].map(reversed => ({id:`class-${n}-${reversed?'mirror':'normal'}`, kind:'classify', title:'Read the Arrangement', prompt:'Name this lever’s class and the role between the other two. Use the actual labeled arrangement.', state: reversed?mirror(PRESETS[n]):PRESETS[n], goals:['G01','G54']}))),
  ...[1,2,3].map(n=>({id:`build-${n}`,kind:'build',target:n,title:`Construct a ${LESSONS[n].name} Lever`,prompt:'Rearrange the actual beam, then identify its middle role. The starting arrangement is deliberately a different class. Use Move Parts or drag a label.',state:PRESETS[n%3+1],goals:['G21','G26','G27','G54']})),
  ...EXAMPLES.map(example=>({id:`example-${example.id}`,kind:'example',example,title:example.title,prompt:'Follow the pictured operating configuration. Identify all three role locations, the class, and its middle role.',state:PRESETS[example.class],goals:['G01','G23','G54']})),
  {id:'motion',kind:'choice',title:'Motion and Force',prompt:'During this third-class lifting demonstration, what happens to the effort location and the load’s gravitational force?',state:PRESETS[3],options:['Effort moves up; gravity on the load stays downward.','Effort moves down; gravity on the load points upward.','Both arrows reverse when the load rises.'],answer:0,explanation:'The effort and load move up together. The gold arrow represents gravity, which remains downward.',goals:['G52']},
  {id:'limits',kind:'choice',title:'What Does This Model Show?',prompt:'What can you conclude from clicking Apply Effort?',state:PRESETS[1],options:['The exact effort force has been measured.','The class and motion relationship are demonstrated; real force and acceleration still need investigation.','A digital arrangement proves that a physical VEX assembly will work.'],answer:1,explanation:'This is an ideal controlled-motion demonstration, not a force measurement, acceleration calculation, or physical construction test.',goals:['G64','G68']},
];
export function assess(question, response, state=question.state) {
  if(question.kind==='choice') return (question.id!=='motion'||(valid(state)&&leverClass(state)===3))&&response.choice!==''&&response.choice!==undefined&&Number(response.choice)===question.answer;
  if(question.kind==='build')return valid(state)&&leverClass(state)===question.target&&response.middle===order(state)[1];
  if(question.kind==='example')return Number(response.class)===question.example.class&&response.middle===LESSONS[question.example.class].middle&&Object.entries(question.example.roles).every(([role,location])=>response[role]===location);
  return valid(state) && Number(response.class)===leverClass(state) && response.middle===order(state)[1];
}
export function explain(question, state=question.state) {
  if(question.kind==='choice')return question.explanation;
  if(question.kind==='example')return `${LESSONS[question.example.class].name}. ${question.example.text} ${LESSONS[question.example.class].explanation}`;
  if(question.kind==='build'&&leverClass(state)!==question.target)return `Your actual arrangement is ${LESSONS[leverClass(state)].name.toLowerCase()}. To build ${LESSONS[question.target].name.toLowerCase()}, ${LESSONS[question.target].middle} must be between the other two roles.`;
  const lesson=LESSONS[leverClass(state)];
  return `${lesson.name}: ${lesson.explanation} Follow the roles, even when the arrangement is mirrored.`;
}
export function recordAttempt(records, id, correct) {
  const prior=records[id];
  return {...records,[id]:{firstCorrect:prior?prior.firstCorrect:correct,attempts:(prior?.attempts||0)+1,correct:!!correct}};
}
export function summarize(records, total) {
  const items=Object.values(records);
  return {total,answered:items.length,firstCorrect:items.filter(r=>r.firstCorrect).length,corrected:items.filter(r=>!r.firstCorrect&&r.correct).length};
}
