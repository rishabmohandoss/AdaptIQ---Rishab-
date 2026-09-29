// Presentation-only timelines. No auth, recorder, sensor, or account state.
export function createMotion({selectProfile,selectSession,onReady}){
 const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let simple=false;try{simple=localStorage.getItem('adaptiq-simple-view')==='true'}catch{}
 let media,storyTimeline,storyTrigger,profileIndex=-1;
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const layers=['.reasoning-layer','.coaching-layer','.profile-layer','.report-layer'];
 const captions=[
  ['01 / STEP INTO YOUR ANSWER','A little practice. A clearer picture.','Your question on the left. Space to be yourself on the right.','PERCEIVE'],
  ['02 / PERCEIVE','Notice the moments you might miss.','Camera connection. Pace. Structure. Evidence you can revisit.','PERCEIVE'],
  ['03 / UNDERSTAND','The details only matter in context.','A pause, a glance, a strong example. One signal is never the whole story.','UNDERSTAND'],
  ['04 / ADAPT','One useful next step.','Feedback should give you something specific to try in your next answer.','ADAPT'],
  ['05 / PERSONALIZE · CONCEPT PREVIEW','Different people. Different kinds of helpful.','Explore optional coaching preferences. Never a diagnosis inferred from a camera.','YOUR WAY'],
  ['06 / REFLECT','The moment becomes your next step.','A report that points back to the answer, with evidence you can explore.','REFLECT']
 ];
 function reset(){
  media?.revert();media=null;storyTimeline=null;storyTrigger=null;profileIndex=-1;
  document.documentElement.classList.remove('motion-active');
  layers.forEach(s=>{$(s).inert=false;$(s).removeAttribute('aria-hidden')});
  $('.hero-copy').inert=false;$('.interview-layout').inert=false;$('.product-bottom').inert=false;
  $$('.story-motion-toggle').forEach(b=>{b.setAttribute('aria-pressed',String(simple));b.textContent=simple?'Use scroll story':'Use simple view'});
 }
 function build(){
  reset();
  if(!gsap||!ScrollTrigger||reduced.matches||simple){onReady?.();return}
  gsap.registerPlugin(ScrollTrigger);media=gsap.matchMedia();
  media.add('(min-width: 1000px) and (min-height: 680px)',()=>{
   document.documentElement.classList.add('motion-active');
   const wrap=$('.product-wrap'),shell=$('.product-shell');
   const centerScale=()=>Math.min(1,(innerHeight-80-205)/shell.offsetHeight);
   const centerX=()=>-(innerWidth-wrap.offsetWidth*centerScale())/2-30;
   gsap.set(wrap,{scale:.76,x:80,y:0});
   gsap.set(['.signal','.gaze-guide',...layers],{autoAlpha:0});
   gsap.set('.story-copy',{autoAlpha:0});gsap.set('.story-footer',{autoAlpha:0});
   let lastPhase=-1;
   const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{id:'adaptiq-story',trigger:'.story',pin:'.story-stage',start:'top 80px',end:()=>'+='+innerHeight*6.2,scrub:.65,anticipatePin:1,invalidateOnRefresh:true}});
   storyTimeline=timeline;storyTrigger=timeline.scrollTrigger;
   timeline.to('.hero-copy',{autoAlpha:0,y:-25,duration:.7},.15)
    .to('.hero-foot',{autoAlpha:0,duration:.5},.1)
    .to(wrap,{scale:centerScale,x:centerX,duration:1.1},.15)
    .to('.story-copy',{autoAlpha:1,duration:.4},.85)
    .to('.story-footer',{autoAlpha:1,duration:.4},.85)
    .fromTo('.editorial-word',{autoAlpha:0,x:40},{autoAlpha:1,x:-30,duration:1.4},1.1)
    .fromTo('.signal-eye',{y:16},{autoAlpha:1,y:0,duration:.4},1.4)
    .to('.gaze-guide',{autoAlpha:1,duration:.4},1.4)
    .fromTo('.signal-voice',{y:16},{autoAlpha:1,y:0,duration:.4},2.05)
    .fromTo('.signal-answer',{y:16},{autoAlpha:1,y:0,duration:.4},2.7)
    .to('.camera-caption',{autoAlpha:0,duration:.35},2.85)
    .to('.signal-eye',{x:110,y:40,scale:.85,autoAlpha:0,duration:.7},3.3)
    .to('.signal-voice',{x:-90,y:-30,scale:.85,autoAlpha:0,duration:.7},3.35)
    .to('.signal-answer',{x:-70,y:50,scale:.85,autoAlpha:0,duration:.7},3.4)
    .to('.gaze-guide',{autoAlpha:0,duration:.5},3.5)
    .to('.reasoning-layer',{autoAlpha:1,duration:.45},3.7)
    .fromTo('.reasoning-inputs span',{y:15},{y:0,stagger:.05,duration:.4},3.8)
    .to('.reasoning-layer',{autoAlpha:0,duration:.4},4.55)
    .fromTo('.coaching-layer',{y:22},{autoAlpha:1,y:0,duration:.5},4.65)
    .to('.camera-caption',{autoAlpha:1,duration:.3},4.7)
    .to('.coaching-layer',{autoAlpha:0,y:-12,duration:.35},5.55)
    .fromTo('.profile-layer',{x:70},{autoAlpha:1,x:0,duration:.5},5.65)
    .to({}, {duration:2.5},6.15)
    .to('.profile-layer',{autoAlpha:0,x:-45,duration:.45},8.5)
    .fromTo('.report-layer',{y:35},{autoAlpha:1,y:0,duration:.5},8.65)
    .to({}, {duration:.8},9.15);
   timeline.eventCallback('onUpdate',()=>{
    const t=timeline.time();const phase=t<1.35?0:t<3.3?1:t<4.6?2:t<5.65?3:t<8.65?4:5;
    if(phase!==lastPhase){
     lastPhase=phase;const c=captions[phase];$('#chapter-label').textContent=c[0];$('#chapter-title').textContent=c[1];$('#chapter-description').textContent=c[2];$('.editorial-word').textContent=c[3];
     $('#story-state').textContent=phase===4?'Coaching preferences · select a profile':phase===5?'Reflection · select a metric':'Interview → signals → coaching';
     $$('.story-dots i').forEach((e,i)=>e.classList.toggle('active',i===Math.min(phase,4)));
    }
    $('.hero-copy').inert=t>.8;
    const profile=t>=5.85&&t<8.55,report=t>=8.95;
    $('.profile-layer').inert=!profile;$('.profile-layer').setAttribute('aria-hidden',String(!profile));
    $('.report-layer').inert=!report;$('.report-layer').setAttribute('aria-hidden',String(!report));
    $('.reasoning-layer').setAttribute('aria-hidden',String(t<3.9||t>4.7));
    $('.coaching-layer').setAttribute('aria-hidden',String(t<4.8||t>5.65));
    $('.interview-layout').inert=profile||report;$('.product-bottom').inert=profile||report;
    if(profile){const i=Math.min(2,Math.max(0,Math.floor((t-6.05)/.8)));if(i!==profileIndex){profileIndex=i;selectProfile(i)}}
   });
   return()=>{document.documentElement.classList.remove('motion-active');layers.forEach(s=>{$(s).inert=false;$(s).removeAttribute('aria-hidden')});$('.hero-copy').inert=false;$('.interview-layout').inert=false;$('.product-bottom').inert=false};
  });
  media.add('(max-width: 999px), (max-height: 679px)',()=>{
   // Native scrolling on small screens: no long pins or sideways viewport movement.
   for(const selector of ['.coaching-layer','.profile-layer','.report-layer'])gsap.from(selector,{y:18,duration:.55,ease:'power2.out',scrollTrigger:{trigger:selector,start:'top 88%',once:true}});
  });
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   gsap.to('.reading-progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:'body',start:'top top',end:'bottom bottom',scrub:true}});
   const line=$('.chart-line'),length=line.getTotalLength();
   gsap.fromTo(line,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.progress-board',start:'top 83%',end:'bottom 55%',scrub:.4}});
   let previous=-1;ScrollTrigger.create({trigger:'.progress-board',start:'top 80%',end:'bottom 45%',onUpdate:self=>{const i=Math.min(3,Math.floor(self.progress*4));if(i!==previous){previous=i;selectSession(i)}}});
   gsap.from('.cohort-focus i',{scaleX:0,transformOrigin:'left',stagger:.12,duration:.55,ease:'power2.out',scrollTrigger:{trigger:'.org-board',start:'top 78%',once:true}});
   gsap.from('.industry-numbers',{y:24,scale:.97,ease:'none',scrollTrigger:{trigger:'.industry',start:'top 90%',end:'center 60%',scrub:.4}});
   const p=gsap.timeline({scrollTrigger:{trigger:'.privacy-demo',start:'top 83%',end:'bottom 50%',scrub:.4}});
   p.from('.privacy-audio',{y:-12,duration:.4}).from('.boundary-line',{scaleX:0,duration:.4},.3).from('.evidence-row',{x:-22,stagger:.15,duration:.5},.6).from('.privacy-result',{y:12,duration:.4},1);
   gsap.from('.closing-product',{y:35,scale:.93,ease:'none',scrollTrigger:{trigger:'.closing',start:'top 85%',end:'center 65%',scrub:.4}});
  });
  document.fonts.ready.then(()=>ScrollTrigger.refresh());onReady?.();
 }
 reduced.addEventListener('change',build);
 $$('.story-motion-toggle').forEach(button=>button.addEventListener('click',()=>{
  const top=scrollY;simple=!simple;try{localStorage.setItem('adaptiq-simple-view',String(simple))}catch{}build();
  if(top<$('.workflow').offsetTop)document.querySelector('#product').scrollIntoView({behavior:'instant'});
 }));
 build();
 return {goProfile(index){if(storyTrigger&&storyTimeline){const time=6.2+index*.8;window.scrollTo({top:storyTrigger.start+time/storyTimeline.duration()*(storyTrigger.end-storyTrigger.start),behavior:'instant'});return true}return false},refresh(){ScrollTrigger?.refresh()}};
}
