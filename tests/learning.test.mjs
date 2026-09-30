import test from 'node:test';
import assert from 'node:assert/strict';
import {QUIZ, assess, recordAttempt, summarize} from '../src/learning.js';
import {leverClass,order,mirror} from '../src/model.js';

test('quiz covers all six orderings and requires both class and middle role',()=>{
  const qs=QUIZ.filter(q=>q.kind==='classify');
  assert.equal(new Set(qs.map(q=>order(q.state).join('-'))).size,6);
  for(const q of qs){const cls=leverClass(q.state),middle=order(q.state)[1];
    assert.equal(assess(q,{class:cls,middle}),true);
    assert.equal(assess(q,{class:cls,middle:'wrong'}),false);
    assert.equal(assess(q,{class:cls%3+1,middle}),false);
    assert.equal(assess(q,{class:cls,middle},mirror(q.state)),true);
  }
});
test('feedback retry never overwrites first response evidence',()=>{
  let r=recordAttempt({},'a',false);r=recordAttempt(r,'a',true);r=recordAttempt(r,'b',true);
  assert.deepEqual(summarize(r,3),{total:3,answered:2,firstCorrect:1,corrected:1});
  assert.equal(r.a.attempts,2);assert.equal(r.a.firstCorrect,false);
});
test('motion and model-limit items reject force measurement and mastery claims',()=>{
  for(const q of QUIZ.filter(q=>q.kind==='choice'))for(let i=0;i<q.options.length;i++)assert.equal(assess(q,{choice:i}),i===q.answer);
});
