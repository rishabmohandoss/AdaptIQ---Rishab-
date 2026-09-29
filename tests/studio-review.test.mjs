import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {ReviewFlow} from '../design/review-flow.mjs';
import {buildPracticeQuestions} from '../design/questions.mjs';
const code=(await readFile(new URL('../design/studio.js',import.meta.url),'utf8')).replace(/^import .*;\n/gm,'');
const html=await readFile(new URL('../design/index.html',import.meta.url),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function studio({fail=false}={}){
 const nodes=new Map();let now=0,calls=0;
 class Element{
  constructor(){this.style={};this.hidden=false;this.disabled=false;this.checked=false;this.children=[];this.value='';this.currentTime=0;this.ended=false;this.dataset={};this.classList={add(){},remove(){},toggle(){}};this.parentElement=null;this.selectors={}}
  append(...children){for(const child of children){child.parentElement=this;this.children.push(child)}}
  prepend(child){this.append(child)} replaceChildren(){this.children=[]}setAttribute(){}removeAttribute(){}focus(){}scrollIntoView(){}setCustomValidity(){}reportValidity(){return true}reset(){}load(){this.currentTime=0}pause(){}async play(){}
  querySelectorAll(selector){if(selector==='textarea')return this.children.flatMap(child=>child.tag==='textarea'?[child]:child.querySelectorAll(selector));return this.children}
  querySelector(selector){return this.querySelectorAll(selector)[0]||(this.selectors[selector]||=new Element())}
 }
 for(const match of html.matchAll(/id="([^"]+)"/g))nodes.set(match[1],new Element());
 const get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};
 get('video-shell').parentElement=new Element();
 const document={getElementById:get,createElement:tag=>{const el=new Element();el.tag=tag;return el},querySelectorAll:()=>get('stages').children};
 class Recorder{constructor(){this.mimeType='video/webm';this.state='inactive'}start(){this.state='recording'}stop(){this.state='inactive';this.ondataavailable({data:new Blob(['video'])});this.onstop()}}
 const sandbox={document,window:{MediaRecorder:Recorder,scrollTo(){},addEventListener(){}},navigator:{mediaDevices:{getUserMedia:async()=>({getTracks:()=>[{stop(){}}]})}},MediaRecorder:Recorder,Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},AbortController,performance:{now:()=>now},setInterval:()=>1,clearInterval(){},console,ReviewFlow,buildPracticeQuestions,prepareCapture:async()=>({face:true,gaze:true,audio:true}),startCapture(){},finishCapture:()=>[{start:0,end:10,samples:30,features:{gazeDeviation:10},transcript:'I made a validator.'}],disposeCapture(){},submitReview:async()=>{
  calls++;if(fail)throw Error('Provider unavailable');return {source:'jev',model:'jev-1.13.0',highlights:[{start:0,end:5,mode:'video',type:'strength',title:'Observed gaze',message:'Evidence-based test observation'},{start:5,end:8,mode:'audio',type:'improvement',title:'Pace',message:'Pause here'}],scores:[{label:'Speaking pace',score:7}],overall:7,notice:'Measured evidence'};
 }};
 vm.runInNewContext(code,sandbox);
 async function record(){
  get('company').value='Example';get('role').value='Engineer';get('description').value='Develop Python tools for analyzing customer data.';get('resume-text').value='I developed Python software and wrote unit tests.';get('analysis-consent').checked=true;
  get('setup-form').onsubmit({preventDefault(){}});get('start-interview').onclick();await get('camera').onclick();get('record').onclick();now=10000;get('record').onclick();await flush();
 }
 return {get,record,get calls(){return calls}};
}
test('recording uses Jev moments, pauses at evidence time, waits for Continue, and isolates audio review',async()=>{
 const s=studio();await s.record();assert.equal(s.calls,1);assert.equal(s.get('video').muted,true);assert.equal(s.get('analysis-wait').hidden,true);
 s.get('play').onclick();await flush();s.get('video').currentTime=5.1;s.get('video').ontimeupdate();assert.equal(s.get('highlights').hidden,false);assert.equal(s.get('feedback-title').textContent,'Observed gaze');assert.equal(s.get('play').disabled,true);
 s.get('resume-highlight').onclick();await flush();assert.equal(s.get('highlights').hidden,true);assert.equal(s.get('play').disabled,false);
 s.get('skip').onclick();assert.equal(s.get('video-shell').hidden,true);assert.equal(s.get('audio-surface').hidden,false);assert.equal(s.get('video').muted,false);
 s.get('play').onclick();await flush();s.get('video').currentTime=8.1;s.get('video').ontimeupdate();assert.equal(s.get('feedback-title').textContent,'Pace');
 s.get('skip').onclick();assert.equal(s.get('video-shell').hidden,false);assert.equal(s.get('scorecard').children[0].children[1].textContent,'7.0 / 10');
});
test('provider failures keep playback and never substitute example highlights or scores',async()=>{
 const s=studio({fail:true});await s.record();assert.equal(s.get('retry-analysis').hidden,false);assert.match(s.get('status').textContent,/Provider unavailable/);assert.equal(s.get('continue').disabled,false);
 s.get('skip').onclick();s.get('skip').onclick();assert.equal(s.get('scorecard').children[0].children[1].textContent,'Not scored');
});
