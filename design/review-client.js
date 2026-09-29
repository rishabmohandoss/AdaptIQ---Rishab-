let basePromise;
async function base(){
  basePromise ||= fetch(new URL('./review-settings.json',import.meta.url)).then(r=>r.json()).then(settings=>{
    if(!settings.apiOrigin)return '';
    const url=new URL(settings.apiOrigin);
    if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('Invalid review service configuration');
    return url.origin;
  });return basePromise;
}
export async function reviewConfiguration(){const r=await fetch((await base())+'/api/review/config',{signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('Review service unavailable');return r.json()}
export async function submitReview(input,signal){
  const token=await window.AdaptIQReviewAuth?.getToken();
  if(!token)throw Error('Sign in to analyze this answer.');
  const response=await fetch((await base())+'/api/review',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({...input,consent:true}),signal:AbortSignal.any([signal,AbortSignal.timeout(70000)])});
  if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Coaching is unavailable. You can continue reviewing without highlights.');
  const result=await response.json();if(!response.ok)throw Error(result.error||'Analysis failed. Please retry.');
  if(result.source!=='jev'||!Array.isArray(result.highlights)||!Array.isArray(result.scores))throw Error('Invalid analysis response.');
  return result;
}
