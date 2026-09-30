import test from 'node:test';
import assert from 'node:assert/strict';
import {TABLES} from '../src/classroom/layout.js';
test('four independent desks form exactly two non-overlapping pairs',()=>{
  assert.equal(TABLES.length,4);assert.equal(new Set(TABLES.map(t=>t.id)).size,4);
  assert.equal(new Set(TABLES.map(t=>t.pair)).size,2);
  for(const pair of [1,2]){const [a,b]=TABLES.filter(t=>t.pair===pair);assert.equal(a.z,b.z);assert.equal(a.height,b.height);const seam=b.x-b.width/2-(a.x+a.width/2);assert.ok(seam>0&&seam<.04);assert.ok(a.width<1.2&&b.width<1.2);}
});
