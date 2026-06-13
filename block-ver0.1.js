// ==UserScript==
// @name         B站秒赞机器人自动拉黑
// @namespace    https://bilibili.com/
// @version      Alpha-0.1
// @match        *://*.bilibili.com/*
// @grant        GM_notification
// @connect      api.bilibili.com
// ==/UserScript==

(function()
{
    'use strict';

    /*  自己查到的秒赞机器人UID列表，欢迎补充  */
    /*  补充UID请发到fm7dgg1q9@mozmail.com 邮件标题请写：秒赞机器人uid补充 */
    const BLOCK_UID_LIST=[
        3546735202797957,//友利奈绪
        244909134,//疯狂的秃鸽
        3546737497082078,//甜狐为你点赞
        3546733604768632,//绯芜的牢屑
        3546861807864438,//够赞
        1697445692,//瞎赞
        1858,//那个叫“初音未来”的
        3690998737668771,//美女
        3546743205530186,//星野爱
        42//叫“周杰伦”的
    ];



    function getCookie(name){
        const v=`; ${document.cookie}`;
        const p=v.split(`; ${name}=`);
        if(p.length===2) return p.pop().split(';').shift();
        return null;
    }

    async function blockUser(uid){
        const csrf =getCookie('bili_jct');
        if(!csrf) throw new Error('你没登录B站账号你拉黑个鸡毛啊');

        const res = await fetch('https://api.bilibili.com/x/relation/modify',{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                fid: uid,
                act: 5,
                re_src: 11,
                csrf
            })
        });

        const data = await res.json();
        if(data.code !== 0) throw new Error(data.message);
        return true; }

    (async () => {
        console.log('[BAN] 开始自动拉黑');

        let success = 0, fail = 0;

        for(let fuckkk = 0; fuckkk < BLOCK_UID_LIST.length; fuckkk++){
            const uid = BLOCK_UID_LIST[fuckkk];
            try{
                await blockUser(uid);
                success++;
                console.log(`[BAN] ✅ ${uid}`);
            }catch(e){
                fail++;
                console.log(`[BAN] ❌ ${uid} | ${e.message}`);
            }
            await new Promise(r => setTimeout(r, 1000)); // 1000ms的延迟防风控
        }
        GM_notification({
            text: `拉黑完成 ✅${success} ❌${fail}`,
            title: 'B站秒赞机器人自动拉黑'
        });
    })();
})();
