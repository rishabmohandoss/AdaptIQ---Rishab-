const {chromium}=require('@playwright/test');const assert=require('node:assert/strict');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},permissions:['camera','microphone']});const page=await context.newPage();let requests=0;const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/studio/review-capture.js',r=>r.fulfill({contentType:'text/javascript',body:'export async function prepareCapture(){return {face:true}};export function startCapture(){};export function finishCapture(){return []};export function disposeCapture(){};'}));
  await page.route('**/api/review',r=>{requests++;const body=r.request().postDataJSON();assert.equal(body.consent,true);return r.fulfill({json:{source:'jev',model:'jev-test',highlights:[{label:'steady_gaze',start:0,end:.5,mode:'video',type:'strength',title:'This text must never be displayed',message:'Never generated prose'}],scores:[],overall:null}})});
  await page.goto('http://127.0.0.1:4175/interview',{waitUntil:'networkidle'});await page.waitForFunction(()=>!document.querySelector('#setup-fields').disabled);
  assert.equal(await page.locator('#analysis-consent').count(),0);
  await page.evaluate(()=>window.AdaptIQReviewAuth={getToken:async()=> 'synthetic-browser-test'});
  await page.locator('#company').fill('Example');await page.locator('#role').fill('Engineer');await page.locator('#description').fill('Build accessible tools and collaborate with product teams.');await page.locator('#resume-text').fill('I build software and test user experiences with customers.');await page.locator('#generate').click();await page.locator('#start-interview').click();await page.locator('#camera').click();await page.locator('#record').click();await page.waitForTimeout(2100);await page.locator('#record').click();await page.locator('#review').waitFor();assert.equal(requests,1);
  await page.locator('#play').click();await page.locator('#resume-highlight').waitFor();assert.equal(await page.locator('#feedback-title').textContent(),'Good eye contact');await page.locator('#resume-highlight').click();await page.locator('#skip').click();assert.equal(await page.locator('#video-shell').isVisible(),false);
  await page.locator('#play').click();await page.locator('#resume-highlight').waitFor();assert.equal(await page.locator('#feedback-title').textContent(),'Give your answer a little more time');await page.screenshot({path:path.join(__dirname,`../data/studio-qa/automatic-${width}.png`),fullPage:true});await page.locator('#resume-highlight').click();await page.locator('#continue').click();assert.equal(await page.locator('#scorecard').isVisible(),true);assert.deepEqual(errors,[]);console.log(`${width}: real browser recorder, automatic request, saved phrase, both pause modes passed`);await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
