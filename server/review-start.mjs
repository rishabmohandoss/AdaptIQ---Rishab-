// Standalone stateless service: deploy alongside the Firebase frontend before RDS migration.
import express from 'express';
import {fileURLToPath} from 'node:url';
import {reviewRouter} from './review-router.mjs';
if(!process.env.APP_ORIGIN)throw new Error('APP_ORIGIN is required');
const app=express();app.disable('x-powered-by');app.set('trust proxy','loopback');
app.use('/api/review',reviewRouter());
app.get('/health',(_req,res)=>res.json({ok:true}));
// Explicit public files only, useful for an authenticated local integration check.
for(const name of ['index.html','style.css','setup.css','studio.js','session-auth.js','questions.mjs','review-flow.mjs','review-capture.js','review-segments.mjs','review-client.js','review-settings.json'])app.get(name==='index.html'?'/':'/'+name,(_req,res)=>res.sendFile(fileURLToPath(new URL('../design/'+name,import.meta.url))));
for(const name of ['career-sensors.js','metrics-math.js'])app.get('/'+name,(_req,res)=>res.sendFile(fileURLToPath(new URL('../'+name,import.meta.url))));
app.use((_req,res)=>res.status(404).json({error:'Not found.'}));
const server=app.listen(Number(process.env.REVIEW_PORT||3001),'127.0.0.1',()=>console.log(`Review service: http://localhost:${process.env.REVIEW_PORT||3001}`));
process.on('SIGTERM',()=>server.close());
