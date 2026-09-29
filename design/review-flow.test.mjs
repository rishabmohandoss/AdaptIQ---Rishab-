import test from 'node:test';
import assert from 'node:assert/strict';
import {ReviewFlow} from './review-flow.mjs';

for (const [mode,ends] of [['silent video',[.21,.53,.85]],['audio',[.22,.56,.91]]]) {
  test(`${mode}: each moment blocks progress until explicitly acknowledged`,()=>{
    const flow=new ReviewFlow(ends.map(end=>['','','',0,end]),100);
    assert.equal(flow.acknowledge(),false);
    for(let i=0;i<ends.length;i++){
      assert.equal(flow.tick(ends[i]*100-.01),null);
      assert.equal(flow.tick(ends[i]*100),i);
      assert.equal(flow.tick(100),i,'time advancing cannot dismiss pending feedback');
      assert.equal(flow.complete,false);
      assert.equal(flow.acknowledge(),true);
      assert.equal(flow.tick(ends[i]*100),null,'the same moment must not pause twice');
    }
    assert.equal(flow.complete,true);
    assert.equal(flow.tick(100),null);
  });
}
test('delayed media events still expose every unacknowledged moment in order',()=>{
  const flow=new ReviewFlow([['','','',0,.2],['','','',0,.6]],10);
  assert.equal(flow.tick(9),0);
  flow.acknowledge();
  assert.equal(flow.tick(9),1);
});
test('a new review starts with no progress from the previous review',()=>{
  const moments=[['','','',0,.5]];
  const first=new ReviewFlow(moments,10);first.tick(5);first.acknowledge();
  const second=new ReviewFlow(moments,10);
  assert.equal(second.complete,false);assert.equal(second.tick(5),0);
});
