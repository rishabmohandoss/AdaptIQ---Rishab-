import {mkdir,readFile,copyFile,writeFile,cp} from 'node:fs/promises';
import './build-marketing.mjs';
const root=new URL('../',import.meta.url),output=new URL('data/review-public/',root);
await mkdir(new URL('studio/',output),{recursive:true});
const files=['style.css','setup.css','studio.js','session-auth.js','questions.mjs','review-flow.mjs','review-capture.js','review-segments.mjs','review-client.js','review-settings.json','feedback-catalog.mjs'];
let html=await readFile(new URL('design/index.html',root),'utf8');
for(const name of ['style.css','setup.css','studio.js','session-auth.js'])html=html.replaceAll(`"${name}"`,`"/studio/${name}"`);
html=html.replace('href="/"','href="/app"');
await writeFile(new URL('interview.html',output),html);
await writeFile(new URL('app.html',output),await readFile(new URL('index.html',root),'utf8'));
await copyFile(new URL('index.html',root),new URL('index.html',output));
await cp(new URL('marketing/',root),new URL('marketing/',output),{recursive:true,filter:src=>!src.endsWith('components.mjs')&&!src.endsWith('.md')});
for(const file of files)await copyFile(new URL('design/'+file,root),new URL('studio/'+file,output));
if(process.env.REVIEW_API_ORIGIN){
  const origin=new URL(process.env.REVIEW_API_ORIGIN);
  if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw Error('REVIEW_API_ORIGIN must be an HTTPS origin');
  await writeFile(new URL('studio/review-settings.json',output),JSON.stringify({apiOrigin:origin.origin})+'\n');
}
for(const file of ['career-sensors.js','metrics-math.js'])await copyFile(new URL(file,root),new URL(file,output));
console.log('Prepared app.html (home), interview.html (studio), and 12 explicitly selected public assets in data/review-public.');
