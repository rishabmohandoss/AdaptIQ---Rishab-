import {ReviewFlow} from './review-flow.mjs';
import {buildPracticeQuestions} from './questions.mjs';
const $=id=>document.getElementById(id);
let questions=[];
let questionIndex=0;
let stage=0,stream,recorder,recordedURL,duration=90,elapsed=0,playing=false,recordStarted=0,recordTimer,flow=null;
const video=$('video'),shell=$('video-shell'),originalHome=shell.parentElement;
const moments={
 1:[['A steady connection','Your gaze stays near the camera as you open your answer.','Keep doing this',.12,.21],['Give yourself a reset','Try bringing your eyes back to the lens after gathering your thoughts.','Try this next time',.43,.53],['A natural smile','Your expression softens as you talk about the outcome.','Keep doing this',.74,.85]],
 2:[['You set the scene','The context makes it easy to understand the challenge.','Keep doing this',.08,.22],['Let that point land','Try a short pause here so your key idea has room to breathe.','Try this next time',.42,.56],['A clear outcome','You finish by explaining what changed because of your work.','Keep doing this',.76,.91]]
};
const time=value=>`${Math.floor(value/60).toString().padStart(2,'0')}:${Math.floor(value%60).toString().padStart(2,'0')}`;
function status(message=''){$('status').textContent=message}
function halt(){playing=false;video.pause();$('play').textContent='Play answer';$('audio-surface').classList.remove('is-playing')}
function releaseCamera(){stream?.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null}
function releaseRecording(){if(recordedURL)URL.revokeObjectURL(recordedURL);recordedURL=null;video.removeAttribute('src');video.load()}
function updateTime(){
 const current=recordedURL?video.currentTime:elapsed;
 $('seek').value=current;$('position').textContent=`${time(current)} / ${time(duration)}`;
 if(flow && flow.pending===null && (playing || video.ended)){
  const index=flow.tick(current);
  if(index!==null){halt();showFeedback(index);return}
 }
 if(flow?.complete && current>=duration-.15){$('continue').disabled=false;$('guide-message').textContent='Review complete. Take your next step when you’re ready.'}
}
async function play(){
 if(flow?.pending!==null && flow?.pending!==undefined)return;
 const requestedStage=stage;
 try{if(recordedURL)await video.play();if(stage!==requestedStage){video.pause();return}playing=true;$('play').textContent='Pause';$('audio-surface').classList.add('is-playing')}
 catch{status('Playback could not start. Try playing again.')}
}
function showFeedback(index){
 const m=moments[stage][index];
 $('highlights').hidden=false;
 $('highlights').innerHTML=`<article class="feedback ${index===1?'improve':''}" aria-labelledby="feedback-title"><div class="feedback-icon" aria-hidden="true">${index===1?'↗':'✓'}</div><div class="feedback-copy"><p class="eyebrow">PAUSED · MOMENT ${index+1} OF ${moments[stage].length} · ${time(m[4]*duration)}</p><span class="kind">${m[2]}</span><h3 id="feedback-title">${m[0]}</h3><p>${m[1]}</p></div><button id="resume-highlight" class="primary">Continue →</button></article>`;
 $('play').disabled=true;$('seek').disabled=true;
 $('guide-message').textContent='Take a moment to reflect. Continue when you’re ready.';
 $('resume-highlight').onclick=()=>{
  flow.acknowledge();$('highlights').hidden=true;$('play').disabled=false;
  $('guide-message').textContent=flow.complete?'Let’s hear the rest of your answer.':`Watching for moment ${flow.next+1} of ${moments[stage].length}…`;
  if(stage===1&&flow.complete)$('guide-message').textContent='Let’s watch the rest of your answer.';
  $('play').focus();play();
 };
 $('resume-highlight').focus();
}
function renderHighlights(){
 $('highlights').replaceChildren();$('highlights').hidden=true;
 $('guide-message').hidden=!flow;
 $('guide-message').textContent='Press play. We’ll pause at each moment so you can reflect, then continue.';
 $('seek').disabled=Boolean(flow);$('play').disabled=false;
 $('continue').disabled=Boolean(flow);
}
function renderScore(){const categories=[['Visual presence',8.4,'Steady connection, with room for a more relaxed gaze.'],['Pace & clarity',7.2,'Clear delivery. Give your main points a little more space.'],['Answer structure',8.6,'A strong setup and a clear outcome.'],['Specificity',7.8,'One concrete result would make the story stronger.']];$('scorecard').innerHTML=`<div><p class="eyebrow">EXAMPLE REFLECTION</p><div class="score">8.0<small> / 10</small></div><p>A clear story.<br>A little more breathing room.</p><p class="small">Sample coaching scores, not a hiring assessment.</p></div><div>${categories.map(([label,score,note])=>`<div class="category"><div><span>${label}</span><strong>${score} / 10</strong></div><progress value="${score}" max="10" aria-label="${label}"></progress><p>${note}</p></div>`).join('')}</div>`}
function showStage(next){halt();status();stage=next;flow=moments[stage]?new ReviewFlow(moments[stage],duration):null;elapsed=0;if(recordedURL)video.currentTime=0;
 document.querySelectorAll('#stages button').forEach((button,i)=>{button.classList.toggle('active',i===stage);button.setAttribute('aria-current',i===stage?'step':'false')});
 $('workspace').hidden=stage!==0;$('review').hidden=stage===0;$('complete').hidden=true;
 if(stage===0){originalHome.prepend(shell);shell.hidden=false;video.muted=true;$('empty').hidden=false;$('media-badge').hidden=true;$('record').disabled=true;$('record').textContent='Start answer';$('camera').disabled=false;$('clock').textContent='00:00';$('heading').textContent='A little practice. A little more confidence.';return}
 releaseCamera();$('heading').textContent='Meet your answer from a new perspective.';$('review-media').append(shell);shell.hidden=stage===2;video.muted=stage===1;video.controls=false;$('empty').hidden=Boolean(recordedURL);$('media-badge').hidden=false;$('media-badge').textContent=stage===1?'SILENT REVIEW · AUDIO OFF':'FULL PLAYBACK';
 if(!recordedURL){$('empty').innerHTML='<span class="camera-icon" aria-hidden="true">▶</span><h2>Example review</h2><p>No recording loaded. Press play to try the guided pauses.</p>'}
 $('audio-surface').hidden=stage!==2;$('scorecard').hidden=stage!==3;
 const copy={1:['01 / PRESENCE','Notice how you show up.','Set the words aside. Watch your expression, posture, and connection.'],2:['02 / VOICE','Hear the story you’re telling.','No picture this time. Just your voice, and the moments that matter.'],3:['03 / REFLECTION','Bring it all together.','Watch your full answer, then reflect on what to try next.']}[stage];
 $('review-label').textContent=copy[0];$('review-title').textContent=copy[1];$('review-description').textContent=copy[2];$('seek').max=duration;$('continue').textContent=stage===1?'Continue to voice →':stage===2?'See full reflection →':questionIndex===questions.length-1?'Finish practice →':'Next question →';
 renderHighlights();if(stage===3)renderScore();updateTime();
}
const initialEmpty=$('empty').innerHTML;
async function enableCamera(){status();$('camera').disabled=true;try{if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('unsupported');stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});video.srcObject=stream;video.muted=true;await video.play();$('empty').hidden=true;$('record').disabled=false;status('Camera ready. Start your answer when you’re comfortable.')}catch{releaseCamera();$('camera').disabled=false;status('Camera or microphone unavailable. Check browser permissions, or explore the example review.')}}
function bindCamera(){$('camera').onclick=enableCamera}
bindCamera();
$('record').onclick=()=>{if(recorder?.state==='recording'){$('record').disabled=true;recorder.stop();return}try{const chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)};recorder.onerror=()=>{clearInterval(recordTimer);releaseCamera();status('Recording failed. Please reload to try again.');$('record').disabled=true};recorder.onstop=()=>{clearInterval(recordTimer);duration=Math.max(.1,(performance.now()-recordStarted)/1000);releaseCamera();recordedURL=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType}));video.src=recordedURL;$('demo').disabled=false;showStage(1)};recorder.start();recordStarted=performance.now();$('record').textContent='Finish answer';$('demo').disabled=true;$('media-badge').hidden=false;$('media-badge').textContent='RECORDING';recordTimer=setInterval(()=>{const secs=(performance.now()-recordStarted)/1000;$('clock').textContent=time(secs);if(secs>=180&&recorder.state==='recording')recorder.stop()},200)}catch{status('Recording could not start in this browser. Try the example review.')}};
$('demo').onclick=()=>{duration=90;showStage(1)};
$('play').onclick=()=>{if(playing)halt();else{if((recordedURL?video.currentTime:elapsed)>=duration){elapsed=0;if(recordedURL)video.currentTime=0;if(flow){flow=new ReviewFlow(moments[stage],duration);renderHighlights()}}play()}};
$('seek').oninput=()=>{if(flow)return;if(recordedURL)video.currentTime=Number($('seek').value);else elapsed=Number($('seek').value);updateTime()};
function advance(){if(stage<3){showStage(stage+1);return}halt();releaseRecording();if(questionIndex===questions.length-1){$('review').hidden=true;$('complete').hidden=false;$('stages').hidden=true;$('session-heading').hidden=true;status();return}questionIndex++;$('question').textContent=questions[questionIndex];$('question-count').textContent=`Question ${questionIndex+1} of ${questions.length}`;$('empty').innerHTML=initialEmpty;bindCamera();showStage(0)}
$('continue').onclick=advance;$('skip').onclick=advance;
$('restart').onclick=()=>{halt();flow=null;releaseCamera();releaseRecording();questionIndex=0;questions=[];$('setup-form').reset();$('question-preview').hidden=true;$('question-list').replaceChildren();$('complete').hidden=true;$('setup').hidden=false;$('empty').innerHTML=initialEmpty;bindCamera();$('company').focus();window.scrollTo({top:0})};
video.ontimeupdate=updateTime;video.onended=()=>{updateTime();halt()};
setInterval(()=>{if(playing&&!recordedURL){elapsed=Math.min(duration,elapsed+.1);updateTime();if(elapsed>=duration)halt()}},100);
for(let i=0;i<65;i++){const bar=document.createElement('i');bar.style.height=`${12+Math.abs(Math.sin(i*1.7)*Math.cos(i*.3))*80}px`;$('audio-surface').querySelector('.wave').append(bar)}
window.addEventListener('pagehide',()=>{clearInterval(recordTimer);releaseCamera();if(recordedURL)URL.revokeObjectURL(recordedURL)});
$('setup-form').onsubmit=event=>{
 event.preventDefault();$('setup-error').textContent='';
 if($('setup-fields').disabled||!$('setup-form').reportValidity())return;
 const inputs={company:$('company').value.trim(),role:$('role').value.trim(),description:$('description').value.trim(),resumeText:$('resume-text').value.trim()};
 if(!inputs.company||!inputs.role||inputs.description.length<30||inputs.resumeText.length<20){$('setup-error').textContent='Add a company, role, job description, and resume text to prepare your questions.';return}
 questions=buildPracticeQuestions(inputs);$('question-list').replaceChildren();
 questions.forEach((question,index)=>{const label=document.createElement('label');label.textContent=`Question ${index+1}`;const input=document.createElement('textarea');input.value=question;input.rows=2;input.required=true;input.maxLength=1000;input.dataset.questionIndex=index;label.append(input);$('question-list').append(label)});
 $('question-preview').hidden=false;$('generate').textContent='Regenerate questions →';$('question-list').querySelector('textarea').focus();
 $('question-preview').scrollIntoView({block:'start',behavior:'smooth'});
};
$('start-interview').onclick=()=>{
 const fields=[...$('question-list').querySelectorAll('textarea')];
 if($('setup-fields').disabled||!fields.length)return;
 for(const field of fields){if(!field.value.trim()){field.setCustomValidity('Add a question before starting.');field.reportValidity();field.oninput=()=>field.setCustomValidity('');return}field.setCustomValidity('')}
 questions=fields.map(field=>field.value.trim());questionIndex=0;
 $('session-role').textContent=`${$('company').value.trim()} · ${$('role').value.trim()}`;
 $('setup').hidden=true;$('session-heading').hidden=false;$('stages').hidden=false;
 $('question').textContent=questions[0];$('question-count').textContent=`Question 1 of ${questions.length}`;
 $('empty').innerHTML=initialEmpty;bindCamera();showStage(0);window.scrollTo({top:0});$('camera').focus();
};
['Answer','Presence','Voice','Reflection'].forEach((name,i)=>{const button=document.createElement('button');button.innerHTML=`<b>${i+1}</b>${name}`;button.className=i===0?'active':'';button.disabled=true;$('stages').append(button)});
