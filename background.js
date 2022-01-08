/*
* BLOCK REQUEST TO YOUTUBE IF ALTERNATIVE VIDEO PLAYER IS ACTIVATED
*/
const filter = {
    urls: ["*://www.youtube.com/*"]
};
const webRequestFlags = ["blocking"];


function blockYoutube (){
    chrome.storage.local.get([activeVideoPlayerState], function(result){
        console.log("blocking")

        chrome.storage.local.get([INSTANCE_VIDEO], function(result2){
            const instance = result2[INSTANCE_VIDEO] || DEFAULT_VIDEO_PLAYER;


            function blockYt (){
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                    const isIonisX = tabs[0].url.includes("ionisx.com");
                    const isInstanceYt = instance.includes("www.youtube.com")
                    return { cancel: isIonisX && !isInstanceYt };//if is on ionisx and instance isn't youtube
                });
            }
            
            if(result[activeVideoPlayerState]){ //is alternative video player active
                chrome.webRequest.onBeforeRequest.addListener(
                    blockYt,
                    filter,
                    webRequestFlags)
            }
            else{ //stop listener is there is (case where setting changes)
                chrome.webRequest.onBeforeRequest.removeListener(blockYt)
            }
            
        })
    })
}
blockYoutube();


//wait for message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
    if (request.type == "reloadVideoPlayer") {//message coming from popup that video player state has changed
            blockYoutube ();
    }
    sendResponse({status: true});
})