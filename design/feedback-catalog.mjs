// All user-facing coaching is authored here. Jev selects labels, never prose.
export const feedbackCatalog = Object.freeze({
  steady_gaze: ['video','strength','Good eye contact','Your gaze estimate stayed near the camera here. Keep that connection while allowing yourself natural glances away.'],
  gaze_reset: ['video','improvement','Bring your eyes back to the camera','Your gaze estimate moved away for a while. When you are ready, try returning to the lens.'],
  smile: ['video','strength','A natural moment of expression','The camera detected a smile-like expression here. Notice this moment; there is no need to force a smile.'],
  comfortable_pace: ['audio','strength','Good speaking pace','Your estimated pace gives the listener room to follow. Keep that space between your ideas.'],
  slow_down: ['audio','improvement','Watch your pace here','Your estimated pace picked up. Try a short pause before your next point.'],
  scene_setup: ['audio','strength','Good job setting the scene','You give the listener concrete context for your example. Keep this setup focused.'],
  clear_result: ['audio','strength','A clear result','You explain a concrete outcome of your actions. Keep that impact in your next answer.'],
  specific_action: ['audio','strength','Your contribution is clear','You describe a specific action you took. Keep that detail in your next attempt.'],
  unclear_action: ['audio','improvement','Make your contribution clearer','Try naming the specific action you took in this part of the story.'],
  practice_effort: ['audio','strength','Good job putting in the practice','You made time to record a practice attempt. Use this replay to choose one thing to keep and one thing to improve.'],
  answer_short: ['audio','improvement','Give your answer a little more time','Try an answer between 30 seconds and 1.5 minutes. Add a specific example, what you did, and the result.'],
  answer_long: ['audio','improvement','Try cutting this answer down','This answer is over 2 minutes. Longer answers can be harder to follow. Aim for 30 seconds to 1.5 minutes: keep the key example, your action, and the outcome.'],
});
export function catalogHighlight(label,start,end,source='rule') {
  const entry=feedbackCatalog[label];
  if(!entry)throw new Error('Unknown feedback label');
  const [mode,type,title,message]=entry;
  return {label,mode,type,title,message,start,end,source};
}
// Duration is a recording measurement, not an AI judgment. Exactly 15 seconds
// uses the short-answer guidance; exactly 120 seconds does not trigger long.
export function withPracticeFeedback(highlights,duration) {
  const result=highlights.filter(h=>!['practice_effort','answer_short','answer_long'].includes(h.label));
  if(!Number.isFinite(duration)||duration<=0)return result;
  if(duration<=15)result.push(catalogHighlight('answer_short',0,duration));
  else if(!result.some(h=>h.type==='strength'))result.push(catalogHighlight('practice_effort',0,Math.min(duration,15)));
  if(duration>120)result.push(catalogHighlight('answer_long',120,Math.min(duration,121)));
  return result.sort((a,b)=>a.end-b.end);
}
