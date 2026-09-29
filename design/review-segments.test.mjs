import test from 'node:test';
import assert from 'node:assert/strict';
import {segmentEvidence} from './review-segments.mjs';
test('sample timestamps and utterance receipt times align with the recording',()=>{
 const samples=[0,1,2,11,12,13].map(time=>({time,gazeDeviation:time<10?10:60,paceWpm:145}));
 const segments=segmentEvidence(samples,[{timestamp:105000,text:'First sentence.'},{timestamp:115000,text:'Second sentence.'}],20,100000);
 assert.deepEqual(segments.map(s=>[s.start,s.end,s.features.gazeDeviation]),[[0,10,10],[10,20,60]]);assert.equal(segments[1].transcript,'Second sentence.');assert.equal(segments[0].timingApproximate,true);
});
test('absent measurements are not replaced by zeros or false positives',()=>{
 assert.deepEqual(segmentEvidence([{time:1},{time:2}],[],10,0),[]);
 const segment=segmentEvidence([{time:1,paceWpm:NaN}], [{timestamp:2000,text:'Hello.'}],5,0)[0];assert.deepEqual(segment.features,{});
});
