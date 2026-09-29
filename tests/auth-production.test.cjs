const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const marker=html.indexOf('// FIREBASE GOOGLE SIGN-IN');
const start=html.indexOf('(() => {',marker);
const source=html.slice(start,html.indexOf('</script>',start));
function setup(code){
 const elements=new Map();let listener,popupCalls=0;
 for(const id of ['nav-signin-btn','hero-signin-btn','final-signin-btn','auth-status-note'])elements.set(id,{disabled:false,textContent:'',addEventListener(event,fn){this.click=fn}});
 const auth={onAuthStateChanged(fn){listener=fn},getRedirectResult(){return Promise.resolve(null)},async signInWithPopup(){popupCalls++;if(code)throw {code};listener({uid:'test-user'})}};
 const authFactory=()=>auth;authFactory.GoogleAuthProvider=function(){};
 const window={location:{href:''}};
 vm.runInNewContext(source,{firebase:{initializeApp(){},auth:authFactory},document:{getElementById:id=>elements.get(id)},window,console:{warn(){}}});
 return {elements,window,get popupCalls(){return popupCalls}};
}
test('every landing button can complete popup login and open the product',async()=>{
 for(const id of ['nav-signin-btn','hero-signin-btn','final-signin-btn']){
  const state=setup();await state.elements.get(id).click();
  assert.equal(state.popupCalls,1);assert.equal(state.window.location.href,'app.html');
 }
});
for(const [code,message] of [['auth/popup-blocked','Allow pop-ups'],['auth/popup-closed-by-user','cancelled'],['auth/unauthorized-domain','not enabled']]){
 test(`${code} explains the issue and restores buttons`,async()=>{
  const state=setup(code);await state.elements.get('hero-signin-btn').click();
  assert.ok(state.elements.get('auth-status-note').textContent.includes(message));
  assert.equal(state.window.location.href,'');
  for(const id of ['nav-signin-btn','hero-signin-btn','final-signin-btn'])assert.equal(state.elements.get(id).disabled,false);
 });
}
test('all inline scripts in both production pages parse',()=>{
 for(const file of ['index.html','app.html']){
  const content=fs.readFileSync(path.join(root,file),'utf8');
  for(const match of content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(match[1],{filename:file});
 }
});
