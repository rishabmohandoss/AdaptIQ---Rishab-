import {writeFile,mkdir,copyFile} from 'node:fs/promises';
import {navigation,story,workflow,progressSection,industry,organizations,privacy,closing,explorer} from '../marketing/components.mjs';
const root=new URL('../',import.meta.url);
await mkdir(new URL('marketing/vendor/',root),{recursive:true});
for(const name of ['gsap.min.js','ScrollTrigger.min.js'])await copyFile(new URL('node_modules/gsap/dist/'+name,root),new URL('marketing/vendor/'+name,root));
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f5f5f1"><meta name="description" content="Practice your interview answers. Watch your presence, listen to your delivery, and find one useful thing to try next with AdaptIQ."><title>AdaptIQ — Interview practice. Built around you.</title><link rel="canonical" href="https://adaptiq.study/app"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="/marketing/site.css"><link rel="preload" as="image" href="/marketing/assets/interview-demo.jpg"></head><body>${navigation()}<main id="main">${story()}${progressSection()}${workflow()}${industry()}${organizations()}${privacy()}${closing()}</main>${explorer()}<script defer src="/marketing/vendor/gsap.min.js"></script><script defer src="/marketing/vendor/ScrollTrigger.min.js"></script><script type="module" src="/marketing/main.js"></script></body></html>`;
await writeFile(new URL('index.html',root),html);
console.log('Built AdaptIQ public homepage and local GSAP assets.');
