import {moments,metrics,profiles,progress} from './content.mjs';
import {createMotion} from './motion.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
document.documentElement.classList.add('js-enabled');
let motion,opener,selectedProfile=0;
function selectProfile(i){
 selectedProfile=i;$('.profile-track').style.transform=`translateX(-${i*100}%)`;
 $$('.profile-tabs button').forEach((b,index)=>b.setAttribute('aria-pressed',String(i===index)));
 $$('.profile-slide').forEach((el,index)=>{el.inert=index!==i;el.setAttribute('aria-hidden',String(index!==i))});
}
function selectSession(i){
 $('#progress-value').innerHTML=`${progress[i]}<small>/100</small>`;
 $('#progress-insight').textContent=['A starting point. Something to build on.','A clearer example. A specific action.','Less setup. More substance.','A clearer result. A more focused answer.'][i];
 $$('.session-selector button').forEach((b,index)=>b.setAttribute('aria-pressed',String(i===index)));
 $$('.progress-chart circle').forEach((c,index)=>c.setAttribute('fill',index===i?'#2359e8':'#f5f5f1'));
}
$$('.profile-tabs button').forEach((button,i)=>button.addEventListener('click',()=>{selectProfile(i);motion?.goProfile(i)}));
$('.profile-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=e.key==='Home'?0:e.key==='End'?2:(selectedProfile+(e.key==='ArrowRight'?1:2))%3;$$('.profile-tabs button')[i].focus();selectProfile(i);motion?.goProfile(i)});
let touchX;
$('.profile-window').addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});
$('.profile-window').addEventListener('touchend',e=>{if(touchX===undefined)return;const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>45)selectProfile((selectedProfile+(delta<0?1:2))%3);touchX=undefined},{passive:true});
$$('.session-selector button').forEach((button,i)=>button.addEventListener('click',()=>selectSession(i)));
function selectSignal(name){
 $('.camera-pane').dataset.signal=name;
 $$('.mobile-signals button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.signal===name)));
}
$$('.mobile-signals button').forEach(b=>b.addEventListener('click',()=>selectSignal(b.dataset.signal)));
selectSignal('eye');
$$('[data-report-moment]').forEach(button=>button.addEventListener('click',()=>{
 const i=Number(button.dataset.reportMoment),m=moments[i];
 $$('[data-report-moment]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 $('.report-moment .micro').textContent=m.type.toUpperCase();$('.report-moment p').textContent=m.copy;
 $('.moment-thumbnail>span').textContent=formatTime(m.time);$('.report-moment .explore-trigger').dataset.initialMoment=i;
}));
$$('[data-metric]').forEach((button,i)=>button.addEventListener('click',()=>{const m=metrics[i];$('#metric-detail').textContent=`${m.detail} Demo change from the previous session: ${m.trend}.`;$$( '[data-metric]').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));$('.report-moment .micro').textContent=m.name.toUpperCase();$('.report-moment p').textContent=moments[m.moment].copy;$('.moment-thumbnail>span').textContent=formatTime(moments[m.moment].time);$('.report-moment .explore-trigger').dataset.initialMoment=m.moment}));
function formatTime(t){return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`}
const dialog=$('.session-explorer');
function setMoment(index,time=moments[index].time){
 const moment=moments[index];$('#explorer-kind').textContent=moment.type;$('#explorer-moment-title').textContent=moment.title;$('#explorer-moment-copy').textContent=moment.copy;
 $('#demo-scrub').value=time;$('#scrub-output').textContent=`${formatTime(time)} / 01:30`;$('.explorer-time').textContent=formatTime(time);
 $$('[data-moment]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
}
$$('.explore-trigger').forEach(button=>button.addEventListener('click',()=>{opener=button;setMoment(Number(button.dataset.initialMoment??1));dialog.showModal();$('.close-explorer').focus()}));
$('.close-explorer').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
$$('[data-moment]').forEach(button=>button.addEventListener('click',()=>setMoment(Number(button.dataset.moment))));
$('#demo-scrub').addEventListener('input',e=>{const time=Number(e.target.value);setMoment(time<30?0:time<57?1:2,time)});
$('#explorer-question').addEventListener('change',e=>{
 const index=Number(e.target.value);const questions=['Tell me about a time you turned a difficult problem into a better experience.','Tell me about a time you helped a team move forward.','Tell me about a time feedback changed your approach.'];
 $('#demo-question').textContent=questions[index];$('#demo-question-number').textContent=String(index+2).padStart(2,'0');
 $('#explorer-moment-copy').textContent=['Your example has substance. Lead with what changed, then explain the process.','Name your own contribution, then explain how it helped the team.','Make the feedback concrete, and show what you changed afterward.'][index];
});
$('.menu-toggle').addEventListener('click',()=>{const button=$('.menu-toggle'),open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));$('#site-nav').classList.toggle('is-open',open)});
$$('#site-nav a').forEach(a=>a.addEventListener('click',()=>{$('#site-nav').classList.remove('is-open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#site-nav').classList.contains('is-open')){$('#site-nav').classList.remove('is-open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').focus()}});
$('#cohort-size').addEventListener('change',e=>{const n=Number(e.target.value);$('#cohort-description').textContent=`${n.toLocaleString()} illustrative learners · sample activity`;$('#cohort-count').textContent=n.toLocaleString()});
selectProfile(0);selectSession(3);
// Wait for deferred local GSAP scripts; the static page remains complete if they fail.
if(document.readyState==='complete')motion=createMotion({selectProfile,selectSession});
else window.addEventListener('load',()=>{motion=createMotion({selectProfile,selectSession})},{once:true});
window.addEventListener('pageshow',()=>motion?.refresh());
