import {reviewConfiguration} from './review-client.js';
const signIn=document.getElementById('studio-signin');
const note=document.getElementById('auth-note');
const setup=document.getElementById('setup-fields');
const logout=document.getElementById('studio-signout');
const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
function loadScript(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.append(script)})}
let service;
try{service=await reviewConfiguration()}catch{}
if(local&&!service?.enabled){setup.disabled=false;note.textContent='Local preview · no sign-in needed. Jev analysis is not configured.';document.getElementById('access-label').textContent='INTERACTIVE PREVIEW'}
else {
  try {
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js');
    const response=await fetch(local?'https://adaptiq-fa584.web.app/__/firebase/init.json':'/__/firebase/init.json');
    if(!response.ok)throw Error('Authentication configuration unavailable');
    const config=await response.json();
    if(config.projectId!=='adaptiq-fa584')throw Error('Unexpected authentication project');
    firebase.initializeApp(config);
    const auth=firebase.auth();
    window.AdaptIQReviewAuth={getToken:()=>auth.currentUser?.getIdToken()};
    auth.onAuthStateChanged(user=>{
      setup.disabled=!user;signIn.hidden=Boolean(user);logout.hidden=!user;
      note.textContent=user?`Signed in as ${user.displayName||user.email}`:'Sign in to prepare your interview.';
    });
    signIn.onclick=async()=>{
      signIn.disabled=true;
      try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}
      catch(error){note.textContent=error.code==='auth/popup-blocked'?'Allow pop-ups for adaptiq.study, then try again.':error.code==='auth/popup-closed-by-user'?'Sign-in cancelled. Try again when you’re ready.':'Sign-in failed. Please try again.'}
      finally{signIn.disabled=false}
    };
    logout.onclick=async()=>{
      if(!confirm('Sign out? Any unsaved practice in this tab will be deleted.'))return;
      try{await auth.signOut();location.replace('/app')}
      catch{note.textContent='Could not sign out. Please try again.'}
    };
  } catch {note.textContent='Sign-in could not load. Reload this page to try again.';}
}
