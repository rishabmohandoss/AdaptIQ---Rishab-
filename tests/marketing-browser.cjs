const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_ORIGIN||'http://127.0.0.1:4175';
const out=path.join(__dirname,'../data/marketing-qa');
const cached=path.join(require('node:os').homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE_PATH||(fs.existsSync(cached)?cached:undefined);
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({headless:true,executablePath});
 const results=[];
 for(const width of [1440,1024,768,430,390,375]){
  const page=await browser.newPage({viewport:{width,height:width>1000?960:844},deviceScaleFactor:1});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/app',{waitUntil:'networkidle'});await page.waitForTimeout(800);
  assert.match(await page.title(),/Interview practice/);
  assert.equal(await page.locator('h1').count(),1);
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,motion:document.documentElement.classList.contains('motion-active'),height:document.documentElement.scrollHeight}));
  assert.equal(layout.overflow,false,`Horizontal overflow at ${width}`);
  await page.screenshot({path:path.join(out,`${width}-hero.png`)});
  if(width===1440){
   for(const [label,progress] of [['signals',.30],['reasoning',.43],['coaching',.52],['profiles',.68],['report',.95]]){
    await page.evaluate(p=>{const t=ScrollTrigger.getById('adaptiq-story');window.scrollTo({top:t.start+p*(t.end-t.start),behavior:'instant'})},progress);await page.waitForTimeout(1000);await page.screenshot({path:path.join(out,`desktop-${label}.png`)});
   }
   await page.locator('[data-metric="0"]').click();assert.match(await page.locator('#metric-detail').textContent(),/gaze estimate/);
   await page.locator('.report-moment .explore-trigger').click();await page.locator('dialog[open]').waitFor();
   await page.locator('[data-moment="2"]').click();assert.match(await page.locator('#scrub-output').textContent(),/01:07/);
   await page.locator('#demo-scrub').fill('22');assert.match(await page.locator('#explorer-moment-title').textContent(),/clear beginning/);
   await page.screenshot({path:path.join(out,'desktop-explorer.png')});await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
  }
  if(width===1440||width===390||width===768){
   for(const [name,selector] of [['workflow','.workflow'],['progress','.progress-section'],['industry','.industry'],['organization','.organizations'],['privacy','.privacy-demo'],['closing','.closing']]){
    await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(700);await page.screenshot({path:path.join(out,`${width}-${name}.png`)});
   }
  }
  if(width<1000){
   await page.locator('[data-profile="2"]').click();assert.equal(await page.locator('[data-profile="2"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-profile="2"]').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('[data-profile="1"]').getAttribute('aria-pressed'),'true');
   await page.locator('.profile-layer').scrollIntoViewIfNeeded();await page.waitForTimeout(450);await page.screenshot({path:path.join(out,`${width}-profiles.png`)});
   await page.locator('[data-signal="voice"]').click();assert.equal(await page.locator('.signal-voice').isVisible(),true);assert.equal(await page.locator('.signal-eye').isVisible(),false);
   await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');
  }
  await page.locator('#cohort-size').selectOption('1000');assert.match(await page.locator('#cohort-description').textContent(),/1,000/);
  await page.goto(base+'/interview');await page.locator('header .brand').click();await page.waitForURL('**/app');assert.match(await page.title(),/Interview practice/);
  assert.deepEqual(errors,[],`Browser errors at ${width}`);results.push({width,...layout,errors});await page.close();
 }
 for(const mode of ['reduce','no-js']){
  const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});const page=await context.newPage();
  await page.goto(base+'/app',{waitUntil:'networkidle'});assert.equal(await page.locator('html.motion-active').count(),0);assert.equal(await page.locator('.profile-layer').isVisible(),true);assert.equal(await page.locator('.report-layer').isVisible(),true);
  await page.screenshot({path:path.join(out,`${mode}-hero.png`)});results.push({mode,staticContent:true});await context.close();
 }
 await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
