import test from 'node:test';
import assert from 'node:assert/strict';
import {ROLES, PRESETS, LESSONS, valid, leverClass, order, move, step, mirror, measures, GAP} from '../src/model.js';

test('all three class presets identify the correct middle role',()=>{
  for(const cls of [1,2,3]) {
    assert.ok(valid(PRESETS[cls]));assert.equal(leverClass(PRESETS[cls]),cls);
    assert.equal(order(PRESETS[cls])[1],LESSONS[cls].middle);
  }
});
test('mirror preserves the class and effort direction while reversing rotation',()=>{
  for(const state of Object.values(PRESETS)){
    const other=mirror(state);assert.ok(valid(other));assert.equal(leverClass(other),leverClass(state));
    assert.deepEqual(order(other),order(state).reverse());
    assert.equal(measures(other).effortDirection,measures(state).effortDirection);
    assert.equal(measures(other).liftAngle,-measures(state).liftAngle);assert.deepEqual(mirror(other),state);
  }
});
test('effort opposes gravity torque and raises the load in every legal arrangement',()=>{
  let count=0;
  for(let e=-250;e<=250;e+=25)for(let f=-250;f<=250;f+=25)for(let l=-250;l<=250;l+=25){
    const s={effort:e,fulcrum:f,load:l};if(!valid(s))continue;count++;
    const m=measures(s),effortForce=m.loadArm/m.effortArm;
    assert.ok(Math.abs((e-f)*effortForce*m.effortDirection-(l-f))<1e-9,'torques cancel');
    assert.ok((l-f)*Math.sin(m.liftAngle)>0,'load rises');
    assert.equal(Math.sign((e-f)*Math.sin(m.liftAngle)),m.effortDirection,'effort follows its force arrow');
    const cls=leverClass(s);if(cls===2)assert.ok(m.ima>1);if(cls===3)assert.ok(m.ima<1);
    assert.equal(m.effortDirection,cls===1?-1:1);
  }
  assert.ok(count>1000);
});
test('dragging each role can cross the others without coincident mountings',()=>{
  for(const original of Object.values(PRESETS))for(const role of ROLES){
    let reached=new Set();for(let target=-400;target<=400;target+=5){
      const s=move(original,role,target);assert.ok(valid(s));reached.add(leverClass(s));
      for(const other of ROLES.filter(p=>p!==role))assert.equal(s[other],original[other]);
    }
    assert.ok(reached.size>=1);
  }
  // With room on both sides, each movable role can pass both other roles.
  const compact={effort:-75,fulcrum:0,load:75};
  for(const role of ROLES){
    assert.equal(order(move(compact,role,-250))[0],role);
    assert.equal(order(move(compact,role,250))[2],role);
  }
});
test('keyboard steps cross occupied mounting intervals and remain reversible',()=>{
  const first=PRESETS[1],next=step({...first,effort:-GAP},'effort',1);
  assert.equal(next.effort,GAP);assert.equal(leverClass(next),3);
  assert.equal(step(next,'effort',-1).effort,-GAP);
  for(const original of Object.values(PRESETS))for(const role of ROLES)for(const dir of [-1,1]){
    let s=original;for(let i=0;i<30;i++){const n=step(s,role,dir);assert.ok(valid(n));assert.ok((n[role]-s[role])*dir>=0);s=n;}
  }
});
test('saved data and nonfinite inputs cannot corrupt geometry',()=>{
  for(const s of [null,{}, {effort:0,fulcrum:0,load:25},{effort:NaN,fulcrum:0,load:225},{effort:-251,fulcrum:0,load:225}])assert.equal(valid(s),false);
  for(const value of [NaN,Infinity,'oops'])assert.deepEqual(move(PRESETS[1],'effort',value),PRESETS[1]);
  assert.deepEqual(move(PRESETS[1],'unknown',125),PRESETS[1]);
});
