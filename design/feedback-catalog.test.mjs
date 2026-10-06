import test from 'node:test';
import assert from 'node:assert/strict';
import {catalogHighlight,withPracticeFeedback} from './feedback-catalog.mjs';
test('duration boundaries are deterministic and do not claim a universal attention limit',()=>{
 for(const duration of [.1,14.99,15]){const result=withPracticeFeedback([],duration);assert.deepEqual(result.map(h=>h.label),['answer_short']);assert.equal(result[0].end,duration);assert.match(result[0].message,/30 seconds and 1.5 minutes/)}
 for(const duration of [15.01,30,90,120])assert.deepEqual(withPracticeFeedback([],duration).map(h=>h.label),['practice_effort']);
 for(const duration of [120.01,121,180,305]){const result=withPracticeFeedback([],duration);assert.deepEqual(result.map(h=>h.label),['practice_effort','answer_long']);assert.ok(result.every(h=>h.start<h.end&&h.end<=duration));assert.match(result[1].message,/can be harder to follow/)}
});
test('supported strengths replace generic encouragement; rules are idempotent and never invent scores',()=>{
 const result=withPracticeFeedback([catalogHighlight('steady_gaze',0,10,'jev')],125);
 assert.deepEqual(result.map(h=>h.label),['steady_gaze','answer_long']);assert.deepEqual(withPracticeFeedback(result,125),result);
 const fallback=withPracticeFeedback([catalogHighlight('slow_down',10,20,'jev')],25);assert.ok(fallback.some(h=>h.type==='strength'&&h.source==='rule'));assert.ok(!fallback.some(h=>h.label==='steady_gaze'));
});
