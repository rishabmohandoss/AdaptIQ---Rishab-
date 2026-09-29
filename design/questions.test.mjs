import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPracticeQuestions} from './questions.mjs';
test('job and resume inputs inform the practice questions',()=>{
 const questions=buildPracticeQuestions({company:'Example Co',role:'Data engineer',description:'Build data pipelines using Python, SQL and AWS.',resumeText:'I used Python to process experimental data.'});
 assert.equal(questions.length,5);
 assert.match(questions[0],/Data engineer.*Example Co/);
 assert.match(questions[1],/Python/);
 assert.match(questions[3],/SQL/);
});
test('skill matching does not confuse Java with JavaScript',()=>{
 const questions=buildPracticeQuestions({company:'Example',role:'Engineer',description:'Develop interfaces with JavaScript',resumeText:'Experience building JavaScript applications.'});
 assert.match(questions[1],/JavaScript/);
 assert.doesNotMatch(questions[3],/Java/);
});
test('unrecognized requirements still produce answerable questions',()=>{
 const questions=buildPracticeQuestions({company:'Museum',role:'Curator',description:'Care for historical collections and develop exhibitions.',resumeText:'I managed a collection of artifacts.'});
 assert.equal(questions.length,5);
 assert.ok(questions.every(q=>typeof q==='string'&&q.length>20));
 assert.match(questions[1],/experience from your resume/);
});
