import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const root=process.cwd();
const data=JSON.parse(fs.readFileSync(path.join(root,'automation/data.json'),'utf8'));
let tpl=fs.readFileSync(path.join(root,'automation/template.html'),'utf8');
tpl=tpl.replace('__DATA__', JSON.stringify(data).replace(/</g,'\\u003c'));
const outDir=path.join(root,'pick/auto-promo');
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'index.html'),tpl);

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1200,height:1600},deviceScaleFactor:1});
await page.goto('file://'+path.join(outDir,'index.html'),{waitUntil:'networkidle'});
await page.locator('#promo').screenshot({path:path.join(outDir,'promo.jpg'),type:'jpeg',quality:94});
await page.locator('#og').screenshot({path:path.join(outDir,'og.jpg'),type:'jpeg',quality:94});
await browser.close();

let html=fs.readFileSync(path.join(outDir,'index.html'),'utf8');
html=html.replace('</head>', '<meta property="og:type" content="website"><meta property="og:title" content="'+data.title.replace(/"/g,'&quot;')+'"><meta property="og:description" content="'+data.subtitle.replace(/"/g,'&quot;')+'"><meta property="og:url" content="https://36onepasslounge.github.io/pick/auto-promo/"><meta property="og:image" content="https://36onepasslounge.github.io/pick/auto-promo/og.jpg?v='+Date.now()+'"></head>');
fs.writeFileSync(path.join(outDir,'index.html'),html);
