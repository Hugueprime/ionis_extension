/*
* BLOCK REQUEST TO YOUTUBE IF ALTERNATIVE VIDEO PLAYER IS ACTIVATED
*/
const filter = {
    urls: ["*://www.youtube.com/*"]
};
let webRequestFlags = ["blocking"];


function blockYoutube (){
    chrome.storage.local.get([activeVideoPlayerState], function(result){
        console.log("blocking")

        chrome.storage.local.get([INSTANCE_VIDEO], function(result2){
            let instance = result2[INSTANCE_VIDEO] || DEFAULT_VIDEO_PLAYER;

            function blockYt(){
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                    let isIonisX = tabs[0].url.includes("https://courses.ionisx.com");
                    let isInstanceYt = instance.includes("www.youtube.com")

                    if(isIonisX && !isInstanceYt){ //if is on ionisx and instance isn't youtube
                            return {cancel: true};
                    }else{
                            return {cancel: false};
                    }
                });
            }
            
            if(result[activeVideoPlayerState]){ //is alternative video player active
                chrome.webRequest.onBeforeRequest.addListener(
                    blockYt,
                    filter,
                    webRequestFlags)
            }
            else if(chrome.webRequest.onBeforeRequest.hasListener(blockYt)){ //stop listener is there is (case where setting changes)
                chrome.webRequest.onBeforeRequest.removeListener(blockYt)
            }
            
        })
    })
}
blockYoutube();


//wait for message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
    switch (request.type) {
        case "reloadVideoPlayer": //message coming from popup that video player state has changed
            blockYoutube ();
            break;
    
        default:
            break;
    }
    sendResponse({status: true});
})


change firefow