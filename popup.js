/*
* Add keys for ionisx's requests
*/
document.getElementById('addIonisx_sid').addEventListener('click', function(){addTextLocalStorage('ionisx_sid')});
document.getElementById('addIonisx_edxlms').addEventListener('click', function(){addTextLocalStorage('ionisx_edxlms')});

function addTextLocalStorage(nameKey){
    let input = document.getElementById('textToAdd');
    if(input.value == ''){
        input.focus();
    }else{
        chrome.storage.local.set({[nameKey]: input.value}, function() {});//set local
        input.value = '';
    }
}

//listener link
for(let k = 0; k < document.getElementsByClassName("link").length; k++){
    document.getElementsByClassName("link")[k].addEventListener('click', function(e) {
        chrome.tabs.create({active: true, url: e.target.href});
    })
}

//switch video player
const activeVideoPlayerElt = "activeVideoPlayer"
chrome.storage.local.get([activeVideoPlayerState], function(result){
    document.getElementById(activeVideoPlayerElt).checked = result[activeVideoPlayerState] ?? false;
})
document.getElementById(activeVideoPlayerElt).addEventListener("click", function(){
    let switchState = document.getElementById(activeVideoPlayerElt).checked
    updateStorage(activeVideoPlayerState, switchState)
    chrome.runtime.sendMessage({type:"reloadVideoPlayer"}, function(){}) //reload background to block request
})

//init component
chrome.storage.local.get([INSTANCE_VIDEO], function(result){
    document.getElementById("instanceVideoPlayer").value = result[INSTANCE_VIDEO] || ""
})

document.getElementById("instanceVideoPlayer").placeholder = `${DEFAULT_VIDEO_PLAYER} (default)`; 


function updateStorage(nameKey, value){
    chrome.storage.local.set({[nameKey]: value}, function() {});//set local
}

function deleteStorage(nameKey){
    chrome.storage.local.remove([nameKey], function() {});
}

//change server video player
document.getElementById('instanceVideoPlayer').addEventListener("input", function(){
    let instance = document.getElementById('instanceVideoPlayer').value;
    console.log(instance)
    if(/^([a-zA-Z0-9]{1,61}\.)?[a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(instance)){
        updateStorage(INSTANCE_VIDEO, instance);
    }else if(!instance){
        deleteStorage(INSTANCE_VIDEO);
    }
});
