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

//switch
document.getElementById("activeVideoPlayer").addEventListener("click", function(){
    
})
