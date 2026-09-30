const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.PREVIEW_ORIGIN||'http://127.0.0.1:4175';
const out=path.join(__dirname,'../data/studio-qa');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH||path.join(require('node:os').homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell')});
 for(const width of [1440,768,430,390,375]){
  const page=await browser.newPage({viewport:{width,height:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/interview',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>!document.querySelector('#setup-fields').disabled);
  async function shot(name){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${width} ${name} overflow`);await page.screenshot({path:path.join(out,`${width}-${name}.png`),fullPage:true})}
  await shot('setup');
  await page.locator('#company').fill('Example company');await page.locator('#role').fill('Product designer');
  await page.locator('#description').fill('Design accessible digital products and collaborate with engineering teams to improve customer experiences.');
  await page.locator('#resume-text').fill('Product designer with experience leading research, building prototypes, and measuring customer outcomes.');
  await page.locator('#generate').click();await page.locator('#question-preview').waitFor();
  await page.locator('#question-list textarea').first().fill('Tell me about a difficult problem you turned into a better experience.');
  await page.locator('#start-interview').click();await shot('record');
  await page.locator('#demo').click();await shot('presence');
  await page.locator('#play').click();await page.locator('#resume-highlight').waitFor({timeout:30000});await shot('pause');await page.locator('#resume-highlight').click();
  await page.locator('#skip').click();assert.equal(await page.locator('#audio-surface').isVisible(),true);await shot('voice');
  await page.locator('#skip').click();assert.equal(await page.locator('#scorecard').isVisible(),true);await shot('reflection');
  await page.locator('#continue').click();assert.equal(await page.locator('#workspace').isVisible(),true);
  await page.locator('header .brand').click();await page.waitForURL('**/app');assert.deepEqual(errors,[]);console.log(JSON.stringify({width,flow:'passed',errors}));await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
