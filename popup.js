document.getElementById('addIonisx_sid').addEventListener('click', function(){addTextLocalStorage('ionisx_sid')});
document.getElementById('addIonisx_edxlms').addEventListener('click', function(){addTextLocalStorage('ionisx_edxlms')});

function addTextLocalStorage(nameKey){
    console.log()
    let input = document.getElementById('textToAdd');
    if(input.value == ''){
        console.log("clear")
        input.focus();
    }else{
        // localStorage.setItem(nameKey,input.value);
        chrome.storage.local.set({[nameKey]: input.value}, function() {});//set local
          
        input.value = '';
    }
}

console.log("ok")