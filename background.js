/*
* BLOCK REQUEST TO YOUTUBE IF ALTERNATIVE VIDEO PLAYER IS ACTIVATED
*/
const filter = {
    urls: ["*://www.youtube.com/*"]
};
let webRequestFlags = ["blocking"];


function blockYoutube (){
    browser.storage.local.get([activeVideoPlayerState], function(result){
        console.log("blocking")

        browser.storage.local.get([INSTANCE_VIDEO], function(result2){
            let instance = result2[INSTANCE_VIDEO] || DEFAULT_VIDEO_PLAYER;


            function blockYt(page){
                browser.tabs.query({ active: true, currentWindow: true }, function(tabs){
                    let isIonisX = tabs[0].url.includes("ionisx.com");
                    let isInstanceYt = instance.includes("www.youtube.com")

                    
                    if(isIonisX && !isInstanceYt){ //if is on ionisx and instance isn't youtube
                            return {cancel: true};
                    }else{
                            return {cancel: false};
                    }
                });
            }
      
            if(result[activeVideoPlayerState]){ //is alternative video player active
                browser.webRequest.onBeforeRequest.addListener(
                    blockYt,
                    filter,
                    webRequestFlags)
            }
            else{ //stop listener is there is (case where setting changes)
                browser.webRequest.onBeforeRequest.removeListener(blockYt)
            }
            
        })
    })
}
blockYoutube();


//wait for message
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
    switch (request.type) {
        case "reloadVideoPlayer": //message coming from popup that video player state has changed
            blockYoutube ();
            break;
    
        default:
            break;
    }
    sendResponse({status: true});
})