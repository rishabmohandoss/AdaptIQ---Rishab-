import {segmentEvidence} from './review-segments.mjs';
let loaded,active=false,startedAt=0,timer,samples=[],ready={face:false,gaze:false,audio:false};
const latest={};
window.Bus ||= (()=>{const events={};return {on:(name,fn)=>(events[name]||=[]).push(fn),emit:(name,data)=>(events[name]||[]).forEach(fn=>fn(data))}})();
for(const type of ['face','gaze','audio'])window.Bus.on(`signal:${type}`,data=>{latest[type]={data,at:Date.now()}});
function script(src){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=()=>reject(Error('Analysis library unavailable'));document.head.append(el)})}
export async function prepareCapture(video,stream){
  stopCapture();
  loaded ||= (async()=>{
    await script('/metrics-math.js');
    await script('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js');
    await script('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
    await script('https://cdn.jsdelivr.net/npm/meyda/dist/web/meyda.min.js');
    await script('/career-sensors.js');
  })().catch(error=>{loaded=null;throw error});
  await loaded;
  const results=await Promise.allSettled([window.FaceEngine.init(video),window.GazeEngine.init(video),window.AudioEngine.init(stream)]);
  ready={face:results[0].status==='fulfilled',gaze:results[1].status==='fulfilled',audio:results[2].status==='fulfilled'};
  if(ready.gaze){await window.GazeEngine.startCalibration();ready.gaze=window.GazeEngine.hasCalibration()}
  return {...ready};
}
export function startCapture(){
  samples=[];for(const key of Object.keys(latest))delete latest[key];startedAt=Date.now();active=true;
  if(ready.face)window.FaceEngine.start();if(ready.gaze)window.GazeEngine.start();if(ready.audio){window.AudioEngine.reset();window.AudioEngine.start()}
  timer=setInterval(()=>{
    if(!active)return;
    const now=Date.now(),s={time:(now-startedAt)/1000};
    const face=latest.face?.data,faceValid=ready.face&&latest.face&&now-latest.face.at<1500&&face?.bbox;
    if(faceValid){s.headDeviation=face.hpd;if(Number.isFinite(face.expressions?.happy))s.smileEstimate=face.expressions.happy}
    if(faceValid&&ready.gaze&&latest.gaze&&now-latest.gaze.at<1500){s.gazeDeviation=latest.gaze.data.gds;s.offscreenPercent=latest.gaze.data.osr}
    const wpm=latest.audio?.data.wpm;if(ready.audio&&latest.audio&&now-latest.audio.at<2500&&Number.isFinite(wpm)&&wpm>0&&wpm<=500)s.paceWpm=wpm;
    samples.push(s);
  },250);
}
export function finishCapture(duration){
  const utterances=ready.audio?window.AudioEngine.getTranscriptSegments():[];
  const segments=segmentEvidence(samples,utterances,duration,startedAt);stopCapture();return segments;
}
export function stopCapture(){
  active=false;clearInterval(timer);window.FaceEngine?.stop();window.GazeEngine?.pause();window.AudioEngine?.stop();samples=[];
}
export function disposeCapture(){stopCapture();window.GazeEngine?.dispose();window.AudioEngine?.dispose();ready={face:false,gaze:false,audio:false}}
