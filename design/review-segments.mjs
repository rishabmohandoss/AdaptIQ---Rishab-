export function segmentEvidence(samples,utterances,duration,startedAt){
  const size=10,segments=[];
  for(let start=0;start<duration;start+=size){
    const end=Math.min(duration,start+size);
    const slice=samples.filter(s=>s.time>=start&&s.time<end);
    const features={};
    for(const key of ['gazeDeviation','offscreenPercent','headDeviation','smileEstimate','paceWpm']){
      const values=slice.map(s=>s[key]).filter(Number.isFinite);
      if(values.length>=3)features[key]=Math.round(values.reduce((a,b)=>a+b,0)/values.length*100)/100;
    }
    // Browser speech recognition supplies final-result receipt times, not word alignment.
    const transcript=utterances.filter(u=>{const t=(u.timestamp-startedAt)/1000;return t>=start&&(t<end||(end===duration&&t<=duration+.5))}).map(u=>u.text).join(' ').slice(0,2500);
    if(Object.keys(features).length||transcript)segments.push({start,end,samples:slice.length,features,transcript,timingApproximate:true});
  }
  // Bound request size without manufacturing observations for missing samples.
  let remaining=16000;return segments.slice(0,36).map(s=>{s.transcript=s.transcript.slice(0,remaining);remaining-=s.transcript.length;return s});
}
