import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import {reviewRouter} from '../server/review-router.mjs';
const origin='https://adaptiq.study';
function setup(analyze=async()=>({source:'jev',highlights:[],scores:[],overall:null})){
 const app=express();app.use('/api/review',reviewRouter({env:{APP_ORIGIN:origin,JEV_API_KEY:'secret'},verifyToken:async token=>{if(token!=='valid')throw Error();return {sub:'user-a'}},analyze}));return app;
}
test('unauthenticated and cross-origin review requests never reach Jev',async()=>{
 let called=false;const app=setup(async()=>{called=true});
 await request(app).post('/api/review').set('Origin',origin).send({consent:true}).expect(401);
 await request(app).post('/api/review').set('Origin','https://untrusted.example').set('Authorization','Bearer valid').send({consent:true}).expect(403);
 await request(app).post('/api/review').set('Origin',origin).set('Authorization','Bearer expired').send({consent:true}).expect(401);assert.equal(called,false);
});
test('authorized review requires consent and returns no credential in config',async()=>{
 const app=setup();
 const config=await request(app).get('/api/review/config').expect(200);assert.equal(config.body.enabled,true);assert.ok(!JSON.stringify(config.body).includes('secret'));
 await request(app).post('/api/review').set('Origin',origin).set('Authorization','Bearer valid').send({consent:false}).expect(400);
 const result=await request(app).post('/api/review').set('Origin',origin).set('Authorization','Bearer valid').send({consent:true}).expect(200);assert.equal(result.body.source,'jev');
});
test('preflight accepts only configured origin; concurrent requests are bounded',async()=>{
 let finish;const app=setup(()=>new Promise(resolve=>{finish=resolve}));
 await request(app).options('/api/review').set('Origin',origin).expect(204).expect('Access-Control-Allow-Origin',origin);
 const first=request(app).post('/api/review').set('Origin',origin).set('Authorization','Bearer valid').send({consent:true}).then(r=>r);
 while(!finish)await new Promise(resolve=>setTimeout(resolve,5));
 await request(app).post('/api/review').set('Origin',origin).set('Authorization','Bearer valid').send({consent:true}).expect(409);
 finish({source:'jev'});assert.equal((await first).status,200);
});
