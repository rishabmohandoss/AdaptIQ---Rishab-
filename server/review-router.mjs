import express from 'express';
import rateLimit from 'express-rate-limit';
import {analyzeReview} from './jev.mjs';
import {verifyFirebaseReviewToken} from './firebase-review-auth.mjs';

export function reviewRouter({env=process.env,verifyToken=verifyFirebaseReviewToken,analyze=analyzeReview}={}){
  const router=express.Router();
  router.use((req,res,next)=>{
    res.set('Cache-Control','no-store');
    const origin=req.get('origin');
    if(origin&&origin!==env.APP_ORIGIN)return res.status(403).json({error:'Invalid request origin.'});
    if(origin===env.APP_ORIGIN){res.set('Access-Control-Allow-Origin',origin);res.vary('Origin');res.set('Access-Control-Allow-Headers','Authorization, Content-Type');res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS')}
    if(req.method==='OPTIONS')return res.sendStatus(204);
    next();
  });
  router.get('/config',(_req,res)=>res.json({enabled:Boolean(env.TYPESAFE_API_KEY||env.JEV_API_KEY),firebaseProjectId:env.FIREBASE_PROJECT_ID||'adaptiq-fa584'}));
  router.use(rateLimit({windowMs:60000,limit:20}));
  router.use(async(req,res,next)=>{
    const token=req.get('authorization')?.match(/^Bearer ([^\s]+)$/)?.[1];
    if(!token||token.length>10000)return res.status(401).json({error:'Sign in to analyze this answer.'});
    try{req.reviewUser=await verifyToken(token,env.FIREBASE_PROJECT_ID||'adaptiq-fa584');next()}
    catch{return res.status(401).json({error:'Please sign in again before analyzing.'})}
  });
  router.use(rateLimit({windowMs:60000,limit:6,keyGenerator:req=>req.reviewUser.sub}));
  const active=new Set();
  router.post('/',express.json({limit:'100kb'}),async(req,res)=>{
    if(req.body?.consent!==true)return res.status(400).json({error:'Choose analysis consent before sending this answer.'});
    const user=req.reviewUser.sub;
    if(active.has(user))return res.status(409).json({error:'An answer is already being analyzed. Please wait.'});
    active.add(user);
    try{res.json(await analyze(req.body,env))}finally{active.delete(user)}
  });
  router.use((err,_req,res,_next)=>res.status(err.status||500).json({error:err.status&&err.status<600?err.message:'Analysis could not finish. Please try again.'}));
  return router;
}
