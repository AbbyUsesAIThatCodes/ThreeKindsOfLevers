import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {reserveBuild,finishBuild} from '../scripts/build-identity.mjs';
test('durable allocator serializes concurrent attempts and never recycles failure ordinals',async()=>{
  const root=await mkdtemp(path.join(tmpdir(),'levers-identity-'));
  try{const attempts=await Promise.all(Array.from({length:5},()=>reserveBuild(root,'pr-9')));assert.deepEqual(attempts.map(a=>a.ordinal).sort(),[1,2,3,4,5]);await finishBuild(root,attempts[0],{status:'failed'});assert.equal((await reserveBuild(root,'pr-9')).ordinal,6);assert.equal((await reserveBuild(root,'pr-10')).ordinal,1);await rm(path.join(root,'.build-state'),{recursive:true});assert.equal((await reserveBuild(root,'pr-9')).ordinal,7,'committed ledger restores a new checkout');assert.equal(JSON.parse(await readFile(path.join(root,'build/ledger.json'))).attempts.find(a=>a.key===attempts[0].key).status,'failed');}finally{await rm(root,{recursive:true,force:true});}
});
