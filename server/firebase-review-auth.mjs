import {OAuth2Client} from 'google-auth-library';
const verifier=new OAuth2Client();
let cached,expires=0;
export async function verifyFirebaseReviewToken(token,projectId,request=fetch){
  if(!projectId)throw new Error('Firebase authentication is not configured');
  let header;try{header=JSON.parse(Buffer.from(token.split('.')[0],'base64url').toString())}catch{throw new Error('Invalid token header')}
  if(header.alg!=='RS256'||typeof header.kid!=='string')throw new Error('Invalid token algorithm');
  if(!cached||Date.now()>=expires){
    const response=await request('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',{signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw new Error('Authentication keys unavailable');
    const certs=await response.json();
    if(!certs||typeof certs!=='object'||!Object.values(certs).every(c=>typeof c==='string'&&c.includes('BEGIN CERTIFICATE')))throw new Error('Invalid authentication keys');
    cached=certs;const seconds=Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]||300);
    expires=Date.now()+Math.min(seconds,3600)*1000;
  }
  const ticket=await verifier.verifySignedJwtWithCertsAsync(token,cached,projectId,[`https://securetoken.google.com/${projectId}`],86400);
  const payload=ticket.getPayload();
  if(typeof payload?.sub!=='string'||!payload.sub||payload.sub.length>128||payload.email_verified!==true||!Number.isFinite(payload.auth_time)||payload.auth_time>Date.now()/1000+300)throw new Error('Invalid user');
  return payload;
}
