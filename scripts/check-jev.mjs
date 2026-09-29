import {analyzeReview} from '../server/jev.mjs';
// Synthetic data only: this opt-in check makes a real provider call without user recordings.
try{
 const result=await analyzeReview({question:'Tell me about a problem you solved.',duration:20,segments:[{start:0,end:10,samples:32,features:{gazeDeviation:12,paceWpm:140},transcript:'Our nightly import failed repeatedly. I added validation and automatic retries.'},{start:10,end:20,samples:32,features:{gazeDeviation:15,paceWpm:145},transcript:'This reduced failed imports from ten each week to one.'}]});
 console.log(JSON.stringify({ok:true,model:result.model,highlightCount:result.highlights.length,categories:result.scores.map(s=>s.label)},null,2));
}catch(error){console.error(error.message);process.exitCode=1}
