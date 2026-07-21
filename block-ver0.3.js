// ==UserScript==
// @name         b站批量拉黑
// @version      0.3
// @match       *://space.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(async()=>{
const yaml=await import('https://cdn.jsdelivr.net/npm/js-yaml@4/dist/js-yaml.min.js');
const LIST_URL='https://raw.githubusercontent.com/Doupher/BilibiliLikeBotBlock/main/block_list.yaml';
const DELAY=a=>new Promise(r=>setTimeout(r,a|0));
const rand=()=>Math.random();
let ua=`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/${118+rand()*5|0}.0.0.0 Safari/537.36`;

GM_xmlhttpRequest({
 url:LIST_URL,headers:{'User-Agent':ua},
 onload:async r=>{
  if(r.status!==200){console.error('名单拉取失败');return;}
  const list=yaml.load(r.responseText)?.block_list||[];
  console.log('加载',list.length,'个uid');
  for(const uid of list){
   let ok=false;
   for(let i=1;i<=5;i++){
    await DELAY(1500+rand()*2500);
    try{
     await fetch('https://api.bilibili.com/x/relation/black',{
      method:'POST',
      credentials:'include',
      headers:{'Content-Type':'application/x-www-form-urlencoded','Referer':'https://space.bilibili.com/','User-Agent':ua},
      body:`fid=${uid}&jsonp=jsonp`
     }).then(r=>r.json()).then(d=>{
      if(d.code!==0)throw new Error(d.message);
      console.log(uid,'拉黑成功');
      ok=true;
     });
     if(ok) break;
    }catch(e){console.warn(uid,'第'+i+'次失败:',e.message);}
   }
   if(!ok)console.error(uid,'跳过');
  }
  console.log('完事');
 }

}
);
}
)
(
);