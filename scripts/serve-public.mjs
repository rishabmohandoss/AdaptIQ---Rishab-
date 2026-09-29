import express from 'express';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../data/review-public/',import.meta.url));
const app=express();
app.get(['/','/app','/app/'],(_req,res)=>res.sendFile(root+'index.html'));
app.get(['/interview','/interview/'],(_req,res)=>res.sendFile(root+'interview.html'));
app.use(express.static(root,{dotfiles:'deny',index:false}));
app.use((_req,res)=>res.status(404).send('Not found'));
app.listen(4175,'127.0.0.1',()=>console.log('AdaptIQ preview: http://127.0.0.1:4175'));
