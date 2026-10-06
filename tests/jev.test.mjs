import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeReview,validateReview,buildJevRequest,parseJevResponse} from '../server/jev.mjs';
export const fixture={question:'Describe a problem you solved.',duration:20,segments:[
 {start:0,end:10,samples:32,features:{gazeDeviation:10,smileEstimate:.7,paceWpm:145},transcript:'Our team had a broken import system. I wrote a validator.'},
 {start:10,end:20,samples:32,features:{gazeDeviation:65,paceWpm:195},transcript:'The validator reduced import failures by half.'}
]};
export function answer(payload,{low=false}={}){
 const answers={};for(const [id,q] of Object.entries(payload.questions)){
  if(q.type==='choice'){
   const keys=Object.keys(q.criteria);const choice=id==='audio_1'?'clear_result':keys[1];
   answers[id]={type:'choice',choice,confidence:low?.3:.9,probabilities:Object.fromEntries(keys.map(k=>[k,k===choice?(low?.4:.9):(low?.6:.1)/(keys.length-1)]))};
  }else answers[id]={type:'score',score:2.9,confidence:low?.2:.9,probabilities:{0:0,1:0,2:.1,3:.9},legend:Object.fromEntries(q.criteria.map((v,i)=>[i,v]))};
 }
 return {model:'jev-1.13.0',answers,usage:{input_tokens:100,output_tokens:50}};
}
test('official endpoint uses only server key and structured evidence; returns chronological real moments',async()=>{
 let calls=0;const result=await analyzeReview(fixture,{TYPESAFE_API_KEY:'private-test-key'},async(url,options)=>{
  calls++;assert.equal(url,'https://api.typesafe.ai/v1/systemone');assert.equal(options.headers.Authorization,'Bearer private-test-key');
  const payload=JSON.parse(options.body);assert.equal(payload.model,'jev-1.13.0');assert.equal(payload.state.segments[0].start,0);assert.ok(payload.questions.video_0.instructions.includes('segments[0]'));
  return Response.json(answer(payload));
 });
 assert.equal(calls,1);assert.ok(result.highlights.some(h=>h.label==='clear_result'&&h.end===20));assert.equal(result.scores[0].score,9.7);assert.equal(result.model,'jev-1.13.0');assert.ok(!JSON.stringify(result).includes('private-test-key'));
});
test('missing samples do not turn into gaze or vocal scores',()=>{
 const input=validateReview({question:'Example?',duration:5,segments:[{start:0,end:5,samples:0,features:{},transcript:'A relevant result in words.'}]});
 const payload=buildJevRequest(input,'jev-1.13.0');assert.equal(payload.questions.video_0,undefined);assert.equal(payload.questions.score_presence,undefined);assert.equal(payload.questions.score_pace,undefined);assert.ok(payload.questions.audio_0);
});
test('no evidence returns no fabricated results or paid request',async()=>{
 const result=await analyzeReview({question:'Example?',duration:3,segments:[]},{JEV_API_KEY:'test'},()=>{throw Error('must not call')});assert.deepEqual(result.highlights.map(h=>h.label),['answer_short']);assert.equal(result.highlights[0].source,'rule');assert.equal(result.overall,null);
});
test('uncertain observations and scores are withheld',()=>{
 const input=validateReview(fixture),payload=buildJevRequest(input,'jev-1.13.0');const result=parseJevResponse(answer(payload,{low:true}),payload,input);assert.deepEqual(result.highlights.map(h=>h.label),['practice_effort']);assert.equal(result.highlights[0].source,'rule');assert.equal(result.overall,null);assert.deepEqual(result.scores,[]);
});
test('invalid times, overlapping clips and unknown features are rejected before inference',()=>{
 for(const edit of [s=>s.end=25,s=>s.start=-1,s=>s.features.emotion='nervous',s=>s.features.paceWpm=NaN]){const body=structuredClone(fixture);edit(body.segments[0]);assert.throws(()=>validateReview(body),{status:400})}
 const body=structuredClone(fixture);body.segments[1].start=5;assert.throws(()=>validateReview(body),{status:400});
});
test('unknown labels, missing answers and invalid distributions fail closed',()=>{
 const input=validateReview(fixture),payload=buildJevRequest(input,'jev-1.13.0');
 for(const edit of [a=>a.answers.video_0.choice='invented',a=>delete a.answers.video_0,a=>a.answers.video_0.probabilities.none=5,a=>a.answers.score_pace.score=11]){const a=answer(payload);edit(a);assert.throws(()=>parseJevResponse(a,payload,input),{status:502})}
});
test('rate limits retry with bounded backoff; secrets and provider details stay out of errors',async()=>{
 let count=0;const waits=[];await analyzeReview(fixture,{JEV_API_KEY:'secret'},async(_url,options)=>++count<3?new Response('{}',{status:429,headers:{'Retry-After':'999'}}):Response.json(answer(JSON.parse(options.body))),async ms=>waits.push(ms));assert.equal(count,3);assert.deepEqual(waits,[3000,3000]);
 await assert.rejects(()=>analyzeReview(fixture,{JEV_API_KEY:'secret'},async()=>new Response('secret diagnostic',{status:401})),e=>e.status===502&&!e.message.includes('secret'));
 await assert.rejects(()=>analyzeReview(fixture,{}),{status:503});
});
