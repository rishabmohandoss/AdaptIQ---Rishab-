import http from 'node:http';
import {readFile} from 'node:fs/promises';
const routes={'/':['index.html','text/html'],'/style.css':['style.css','text/css'],'/setup.css':['setup.css','text/css'],'/studio.js':['studio.js','text/javascript'],'/review-flow.mjs':['review-flow.mjs','text/javascript'],'/questions.mjs':['questions.mjs','text/javascript'],'/session-auth.js':['session-auth.js','text/javascript']};
for(const name of ['review-capture.js','review-client.js','review-segments.mjs'])routes['/'+name]=[name,'text/javascript'];
routes['/review-settings.json']=['review-settings.json','application/json'];
for(const name of ['career-sensors.js','metrics-math.js'])routes['/'+name]=['../'+name,'text/javascript'];
http.createServer(async(req,res)=>{const item=routes[new URL(req.url,'http://localhost').pathname];if(!item){res.writeHead(404).end();return}try{const body=await readFile(new URL(item[0],import.meta.url));res.writeHead(200,{'Content-Type':item[1],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}).end(body)}catch{res.writeHead(500).end('Preview unavailable')}}).listen(4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173'));
