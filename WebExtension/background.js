/*
 * Pdm WebExtension (forked from uget-chrome-wrapper ) is an extension to integrate Persepolis Download manager
 * with Google Chrome, Chromium, Firefox and Vivaldi in Linux, Windows and OSX.
 *
 * Modified copyright (C) 2017  Jafar Akhondali
 * Copyright (C) 2016  Gobinath
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


const DEBUG = true;
const VERSION = "4.0.0"; // TODO: Does it work?
const hostName = 'com.persepolis.pdmchromewrapper';


function getBrowserApi(){
    let isChrome=false,isFF=false, isVivaldi=false;

    // isSafari
    let BrowserNameSpace;
    if(typeof browser !== 'undefined' ){
        BrowserNameSpace = browser;
        isFF=true;
    }
    else if(typeof chrome !== 'undefined' ){
        BrowserNameSpace = chrome;
        isChrome=true;
        if(navigator.userAgent.includes('Vivaldi/'))
            isVivaldi = true; // Vivaldi is a subbrowser of chrome :|
    }

    return {
        BrowserNameSpace,
        isFF,
        isVivaldi,
        isChrome,
    };
}



function UrlMessage() {
    this.url= '';
    this.cookies= '';
    this.useragent= navigator.userAgent;
    this.referrer= '';
    this.postdata= '';
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

//if str was encoded, return it. otherwise return encoded str
function denCode(str){
    //return encodeURIComponent(decodeURIComponent(str));
    return decodeURIComponent(str) !== str ? str : encodeURI(str);
}


function L(msg) {
    console.log(msg);
}



function getDomain(url){

    var TLDs = ["ac", "ad", "ae", "aero", "af", "ag", "ai", "al", "am", "an", "ao", "aq", "ar", "arpa", "as", "asia", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "biz", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cat", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "com", "coop", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "edu", "ee", "eg", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gov", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "info", "int", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jobs", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mil", "mk", "ml", "mm", "mn", "mo", "mobi", "mp", "mq", "mr", "ms", "mt", "mu", "museum", "mv", "mw", "mx", "my", "mz", "na", "name", "nc", "ne", "net", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "org", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "pro", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "st", "su", "sv", "sy", "sz", "tc", "td", "tel", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "travel", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "xn--0zwm56d", "xn--11b5bs3a9aj6g", "xn--3e0b707e", "xn--45brj9c", "xn--80akhbyknj4f", "xn--90a3ac", "xn--9t4b11yi5a", "xn--clchc0ea0b2g2a9gcd", "xn--deba0ad", "xn--fiqs8s", "xn--fiqz9s", "xn--fpcrj9c3d", "xn--fzc2c9e2c", "xn--g6w251d", "xn--gecrj9c", "xn--h2brj9c", "xn--hgbk6aj7f53bba", "xn--hlcj6aya9esc7a", "xn--j6w193g", "xn--jxalpdlp", "xn--kgbechtv", "xn--kprw13d", "xn--kpry57d", "xn--lgbbat1ad8j", "xn--mgbaam7a8h", "xn--mgbayh7gpa", "xn--mgbbh1a71e", "xn--mgbc0a9azcg", "xn--mgberp4a5d4ar", "xn--o3cw4h", "xn--ogbpf8fl", "xn--p1ai", "xn--pgbs0dh", "xn--s9brj9c", "xn--wgbh1c", "xn--wgbl6a", "xn--xkc2al3hye2a", "xn--xkc2dl3a5ee0h", "xn--yfro4i67o", "xn--ygbi2ammx", "xn--zckzah", "xxx", "ye", "yt", "za", "zm", "zw"].join()

    url = url.replace(/.*?:\/\//g, "");
    url = url.replace(/www./g, "");
    var parts = url.split('/');
    url = parts[0];
    var parts = url.split('.');
    if (parts[0] === 'www' && parts[1] !== 'com'){
        parts.shift()
    }
    var ln = parts.length
        , i = ln
        , minLength = parts[parts.length-1].length
        , part;

    // iterate backwards
    while(part = parts[--i]){
        // stop when we find a non-TLD part
        if (i === 0                    // 'asia.com' (last remaining must be the SLD)
            || i < ln-2                // TLDs only span 2 levels
            || part.length < minLength // 'www.cn.com' (valid TLD as second-level domain)
            || TLDs.indexOf(part) < 0  // officialy not a TLD
        ){
            var actual_domain = part;
            break;
            //return part
        }
    }
    //console.log(actual_domain);
    var tid ;
    if(typeof parts[ln-1] != 'undefined' && TLDs.indexOf(parts[ln-1]) >= 0)
    {
        tid = '.'+parts[ln-1];
    }
    if(typeof parts[ln-2] != 'undefined' && TLDs.indexOf(parts[ln-2]) >= 0)
    {
        tid = '.'+parts[ln-2]+tid;
    }
    if(typeof tid != 'undefined')
        actual_domain = actual_domain+tid;
    else
        actual_domain = actual_domain+'.com';


    return actual_domain;
}


function getCookies(url,callback) {
    let domain = getDomain(url);// This function was one of the best functions i've ever seen, but now it's useless. I'll not delete it because i love it... I want to spread it to world using persepolis ... RIP my friend
    //let domainQuery= {domain:domain};
    let urlQuery = {url:url};

    let blacklistDecode = [
        "mycdn.me"
    ];
    const {isChrome, BrowserNameSpace, isFF} = getBrowserApi();
    if(isChrome){
        BrowserNameSpace.cookies.getAll(urlQuery,(urlcookies)=>{
            let cookieArray = [];
            if (blacklistDecode.indexOf(domain)  == -1)
                cookieArray = urlcookies.map((cookie)=>denCode(cookie.name)+ "=" + denCode(cookie.value));
            else
                cookieArray = urlcookies.map((cookie)=>cookie.name+ "=" + cookie.value);
            callback(cookieArray);
        });
    }else if(isFF){
        BrowserNameSpace.cookies.getAll(urlQuery).then((urlcookies)=>{
            let cookieArray = [];
            if (blacklistDecode.indexOf(domain)  == -1)
                cookieArray = urlcookies.map((cookie)=>{return denCode(cookie.name)+ "=" + denCode(cookie.value);});
            else
                cookieArray = urlcookies.map((cookie)=>{return cookie.name+ "=" + cookie.value});
            L(cookieArray);
            callback(cookieArray);
        });
    }
}


function setCookies(message) {

    return new Promise(function(ok, fuck) {
        message.useragent = navigator.userAgent;
        try{
            getCookies(message.url, urlCookie=> {

                message.cookies = urlCookie;
                // if (false && message.referrer != null && message.referrer != "") {
                //I know it's always false, at first it looked good but not now. So i saved the code for future jobless source code viewers like you
                //     getCookies(message.referrer, refererCookies=> {
                //         //if(message.cookies != refererCookies)
                //         //message.cookies += "; "+refererCookies;//(message.cookies == refererCookies) ? "" : ("; "+refererCookies);
                //         message.cookies = arrayUnique(message.cookies.concat(refererCookies)).join("; ");
                //         L("final cookies With referer:");
                //         L(message.cookies);
                //         ok(message);
                //     });
                // } else {
                message.cookies = arrayUnique(message.cookies).join("; ");
            });
        }catch (errors){
            L("Cookies are failed to load");
            L(errors);
            // fuck(errors); // :) Ignore cookie errors ( for cases that users disabled cookie access for extensions.
        }finally {
            ok(message);
        }
    });



}

function getFileNameFromUrl(link) {
    return link.split('/').pop().split('#')[0].split('?')[0];
}


//Send cookie and send data to SendToPDM function
function setCookieAndSendToPDM(message) {
    setCookies(message).then((cookie_with_message) => {
        L("Cookies set...");
        SendToPDM(cookie_with_message);
    });
}

/**
 *
 *
 */
function SendToPDM(data,callback){
    SendCustomMessage({
        url_links:data.constructor === Array ? data : [data],
        version: VERSION
    })
}


function SendInitMessage(payload){
    return new Promise(function(resolve, reject) {
        //Try to connect to persepolis, if failed after timeout, disable extension
        let timeOutPersepolisId = setTimeout(()=>{
            return reject({PDMNotFound: true});
        }, 5 * 1000);

        try {
            // Connecting to the native host
            const port = BrowserNameSpace.runtime.connectNative(hostName);

            // Listening for messages from the native host
            port.onMessage.addListener((response) => {
                console.log('Received response:', response);
                clearInterval(timeOutPersepolisId);
                setTimeout(()=>{resolve({PDMNotFound: false})}, 5*1000);
            });

            // Handling disconnection
            port.onDisconnect.addListener(() => {
                if (chrome.runtime.lastError) {
                    console.error('Disconnected due to an error:', chrome.runtime.lastError);
                    resolve({PDMNotFound: false});
                } else {
                    console.log('Disconnected from the native host.');
                }
            });

            // Sending a message to the native host
            console.log('Sending message to native host:', payload);
            port.postMessage(payload);
        } catch (error) {
            console.error('Error communicating with the native host:', error);
            clearInterval(timeOutPersepolisId);
            return reject(error);
        }
    });
    //
    // const PersepolisConnection = BrowserNameSpace.runtime.connectNative(hostName);
    // PersepolisConnection

    //
    // BrowserNameSpace.runtime.sendNativeMessage(hostName, data, (response) =>{
    //     L(`Got data: ${JSON.stringify(response)}`);
    //     if(callback){
    //         callback(response); //Call the callback with response if it's available
    //     }
    //
    // });

    //
    // SendCustomMessage(payload, (response)=>{
    //         if (response) {
    //             L("Connection to Persepolis was successful :)");
    //             L(response)
    //             ok({PDMNotFound: false})
    //             clearTimeout(timeOutPersepolisId);
    //             return;
    //         }
    //
    //         L("Init message failed :(")
    //         ok({PDMNotFound: true})
    //     }
    // );
    //


}

//Crafter for sending message to PDM
function SendCustomMessage(data){
    return new Promise(function(resolve, reject) {
        // L(`Sening NHM message:`)
        // L(data)
        // BrowserNameSpace.runtime.sendNativeMessage(hostName, data, (response) =>{
        //     L(`Got data: ${JSON.stringify(response)}`);
        //     if(callback){
        //         callback(response); //Call the callback with response if it's available
        //     }
        //
        // });
        //Try to connect to persepolis, if failed after timeout, disable extension
        try {
            // Connecting to the native host
            const port = BrowserNameSpace.runtime.connectNative(hostName);


            let disconnectTimout = setTimeout(()=>{
                port.disconnect();
            }, 5 * 1000);


            // Listening for messages from the native host
            port.onMessage.addListener((response) => {
                clearInterval(disconnectTimout);
                port.disconnect();
                resolve(response);
            });

            // Handling disconnection
            port.onDisconnect.addListener(() => {
                resolve();
            });
            port.postMessage(data);
        } catch (error) {
            console.error('Error communicating with the native host:', error);
            clearInterval(disconnectTimout);
            return reject(error);
        }
    });
}

async function updateKeywords(data) {
    const keywords = data.toLowerCase()
        .split(/[\s,]+/)
        .filter(keyword => keyword.trim() !== "");
    await chromeStorageSetter('keywords', keywords.join());
}

async function isBlackListed(url) {
    /*if (url.includes("//docs.google.com/") || url.includes("googleusercontent.com/docs")) { // Cannot download from Google Docs
     return true;
     }*/
    if (url.startsWith("blob://")) // TODO: Persepolis currently can't handle blob type
        return true;
    const keywords = (await ConfigGetVal('keywords', ''))
        .split(/[\s,]+/)
        .filter(keyword => keyword.trim() !== "")

    return keywords.some(keyword => url.includes(keyword));
}

async function setInterruptDownload(interrupt) {
    L("Interrupts:" + interrupt);
    await chromeStorageSetter('pdmInterrupt', interrupt);
    if (interrupt) {
        BrowserNameSpace.action.setIcon({path: "./icons/icon_32.png"});
    } else {
        BrowserNameSpace.action.setIcon({path: "./icons/icon_disabled_32.png"});
    }
}



async function getExtensionConfig() {
    return {
        'pdmInterrupt': await ConfigGetVal('pdmInterrupt'),
        'contextMenu':  await ConfigGetVal('contextMenu'),
        'keywords': await ConfigGetVal('keywords', '')
    }
}

async function chromeStorageGetter(key) {
    return new Promise(resolve => {
        chrome.storage.local.get(key, (obj)=> {
            return resolve(obj[key] || '');
        })
    });
}

async function chromeStorageSetter(key, value) {
    return new Promise(resolve => {
        chrome.storage.local.set({[key]: value}, resolve);
    });
}

async function ConfigGetVal(key, default_value='') {
    let configValue = default_value;
    try {
        configValue = await chromeStorageGetter(key);
    } catch {}
    L("Getting Key:" + key + " ::  " + configValue)
    if (["true", "false"].includes(configValue))
        return configValue == "true"; // Converts string Boolean to Boolean
    return configValue;
}


async function setContextMenu(newState) {
    if (!newState) {
        BrowserNameSpace.contextMenus.removeAll();
        return
    }
    try {
        //Add download with persepolis to context menu
        BrowserNameSpace.contextMenus.create({
                title: 'Download with Persepolis',
                id: "download_with_pdm",
                contexts: ['link']
            }
            , () => void chrome.runtime.lastError
        );

        //Add download selected text to context menu
        BrowserNameSpace.contextMenus.create({
                title: 'Download Selected links with Persepolis',
                id: "download_links_with_pdm",
                contexts: ['selection']
            }
            , () => void chrome.runtime.lastError
        );

        //Add download ALL LINKS to context menu
        BrowserNameSpace.contextMenus.create({
                title: 'Download All Links with Persepolis',
                id: "download_all_links_with_pdm",
                contexts: ['page']
            }
            , () => void chrome.runtime.lastError);
    } catch (e) {
        //Who cares?
    }

    await chromeStorageSetter('contextMenu', newState);
}


async function setConfig() {
    //TODO: This function should be removed I think, at least global part
    let {
        pdmInterrupt,
        contextMenu,
        keywords,
    } = await getExtensionConfig();

    await setInterruptDownload(pdmInterrupt);

    await setContextMenu(contextMenu);
}



/**
 * @param {Object} params
 * @param {boolean} params.pdmInterrupt
 * @param {boolean} params.contextMenu
 * @param {string} params.keywords
 */
async function setExtensionConfig({ pdmInterrupt, contextMenu, keywords }) {

    if (pdmInterrupt !== undefined) await setInterruptDownload(pdmInterrupt);
    if (keywords !== undefined) await chromeStorageSetter('keywords', keywords);
    if (contextMenu !== undefined) {
        await chromeStorageSetter('contextMenu', contextMenu);
        setContextMenu(contextMenu)
    }
}



const {BrowserNameSpace, isChrome, isFF, isVivaldi} = getBrowserApi();
BrowserNameSpace.runtime.onInstalled.addListener(async () => {
    let PDMNotFound = false;
    try {
        PDMNotFound = (await SendInitMessage({version: VERSION})).PDMNotFound;
        await setConfig();
    } catch(e) {
        PDMNotFound = true;
    }
    await setExtensionConfig({pdmInterrupt: PDMNotFound})
});

BrowserNameSpace.runtime.onMessage.addListener((request, sender, sendResponse) => {
    L("Inside runtime on message")

    if (["getAll", "getSelected"].includes(request.type)) {

        let links = request.message;

        L("enterted " + request.type);

        let promiseQueue = [];
        for (let link of links) {
            //Check if we already didnt send this link
            if (link !== "") {
                let msg = new UrlMessage();
                msg.url = link;
                msg.referrer = sender.url;
                promiseQueue.push(setCookies(msg));
            }
        }
        Promise.all(promiseQueue).then(allPromises => {
            SendToPDM(allPromises);
        }, function (err) {
            L("Some error :) " + err)
        });
        return
    }

    switch (request.type) {
        case "keyPress": {
            // https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
            // TODO Has issues? interrupt doesn't get reset sometimes
            (async () => {
                let interruptDownloads = !!(await chromeStorageGetter('pdmInterrupt'));

                let msg = request.message;
                if (msg === 'enable') {
                    // Temporarily enable
                    setInterruptDownload(true);
                } else if (msg === 'disable') {
                    // Temporarily disable
                    setInterruptDownload(false);
                } else {
                    // Toggle
                    setInterruptDownload(!interruptDownloads);
                }
            })();
            break
        }

        case "getExtensionConfig": {
            getExtensionConfig().then(sendResponse)
            return true;
        }

        case "setExtensionConfig": {
            setExtensionConfig({...request.data})
            break
        }

    }

});


BrowserNameSpace.contextMenus.onClicked.addListener(function (info, tab) {
    const { BrowserNameSpace, isChrome, isFF, isVivaldi } = getBrowserApi();
    "use strict";
    switch (info.menuItemId) {
        case "download_with_pdm":
            L(info['linkUrl']);
            let msg = new UrlMessage();
            msg.url = info['linkUrl'];
            msg.referrer = info['pageUrl'];
            setCookieAndSendToPDM(msg);
            break;

        case "download_links_with_pdm":
            BrowserNameSpace.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["/scripts/injector.js"]
            }, () => {
                BrowserNameSpace.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["/scripts/getselected.js"]
                });
            });
            break;


        case "download_all_links_with_pdm":
            BrowserNameSpace.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["/scripts/injector.js"]
            }, () => {
                BrowserNameSpace.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["/scripts/getall.js"]
                });
            })
    }
});


// This api is called before onCreated
// So maybe a flag and use existing method??
// Firefox interrupt has issues and 
//https://github.com/ugetdm/uget-integrator/issues/108

//Finding files types in chrome is not like firefox
//Cause firefox first find file type then start download but chrome uses another event
//Vivaldi uses Chrome engine, But saves files like firefox :|

// BrowserNameSpace.downloads.onDeterminingFilename.addListener(handleDownloadIterrupts)

// This works for chrome, chromium, brave 
BrowserNameSpace.downloads.onCreated.addListener(handleDownloadIterrupts)

/**
 *
 * @param {object} downloadItem
 * @param {function | undefined} suggest
 */
async function handleDownloadIterrupts(downloadItem, suggest) {
    const { BrowserNameSpace } = getBrowserApi();
    let { pdmInterrupt } = await getExtensionConfig()
    if (!pdmInterrupt) return suggest?.call();

    let url = downloadItem['finalUrl'] || downloadItem['url'];
    if (!url) return suggest?.call();
    if (await isBlackListed(url)) return suggest?.call();


    let fileName = downloadItem['filename'];
    const MIN_FILE_SIZE_INTERRUPT = 5 * (1024 * 1024); // Don't interrupt downloads less that 1 mg
    let extension = fileName.split(".").pop();

    if (
        (fileName !== "" && await isBlackListed(extension)) ||
        (0 < downloadItem.fileSize && downloadItem.fileSize < MIN_FILE_SIZE_INTERRUPT) // File size is determined and is less than MIN_FILE_SIZE
    )
        return suggest?.call();


    setTimeout(() => {
        console.log(downloadItem.fileSize);
    }, 2000);


    BrowserNameSpace.downloads.cancel(downloadItem.id); // Cancel the download
    BrowserNameSpace.downloads.erase({ id: downloadItem.id }); // Erase the download from list
    let msg = new UrlMessage();
    msg.url = url;
    msg.referrer = downloadItem['referrer'];
    setCookieAndSendToPDM(msg);

}