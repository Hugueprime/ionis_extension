
//getting ionisx's key from file or localstorage
if(ionisx_sid == ""){
	browser.storage.local.get(['ionisx_sid'], function(res) {
		ionisx_sid = res.ionisx_sid ?? "";
	});
	browser.storage.local.get(['ionisx_edxlms'], function(res) {
		ionisx_edxlms = res.ionisx_edxlms ?? "";
	});
}




let coursesList = new RegExp(/https:\/\/ionisx\.com\/courses\/[a-z0-9]{24}/);
if(coursesList.test(window.location.href)){

	/*
	* REDUCTION DU HEADER IONISX
	*/
	document.getElementsByClassName("header-second-infos")[0].prepend(document.getElementsByClassName("cursus-header-title")[0])

	/*
	* DATES MODULES
	*/
	const options = { month: 'short', day: 'numeric'};
	let coursesList = window.location.href.match(/https:\/\/ionisx\.com\/courses\/[a-z0-9]{24}\/([a-z0-9\-]*)/)[1].replaceAll('-', '_');
	console.log(coursesList)
	if(dates[coursesList]){
		addDates(coursesList)
	}

	function addDates(section){
		for(let k in dates[section]){
			let module = document.getElementsByClassName("module-number")[k].parentElement;
			let span = document.createElement("span");
			let date = dates[section][k];
			span.classList.add("dateToDo");
			span.innerHTML = `${date.start.toLocaleDateString('fr-FR', options)} to ${date.end.toLocaleDateString('fr-FR', options)}`;
			let today = new Date;
			if(module.parentElement.parentElement.classList.contains("course-component-module-finished")){ //done
				span.classList.add("customDoneWeek")
			}else{
				if (today.getTime() > date.end.getTime()) { //past week
					span.classList.add("customPastWeek")
				}else if (date.start.getTime() < today.getTime() && today.getTime() < date.end.getTime()){ //current week
					span.classList.add("customActualWeek")
				}else{
					today.setDate(today.getDate() + 7);//next week
					if(date.start.getTime() < today.getTime() && today.getTime() < date.end.getTime()){//next week
						span.classList.add("customNextWeek")
					}else{ //futur week
						span.classList.add("customFuturWeek")
					}
				}
			}
			module.appendChild(span);
		}
	}

}

let inCourse = new RegExp(/https:\/\/courses\.ionisx\.com\/courses\/ref/);
if(inCourse.test(window.location.href)){
	/*
	* SHOW SUMMARY ON HOVER
	*/
	let summaryButton = document.getElementById('expand-collapse-outline-all-button');
	

	summaryButton.addEventListener('mouseover', function(e){
		mouseSummaryButton(e);
	});
	summaryButton.addEventListener('mouseout', function(e){
		mouseSummaryButton(e);
	});


	function mouseSummaryButton(e){
			let hoverSummary = document.getElementById("hover-summary");
			if(hoverSummary){
				if(!hoverSummary.classList.contains("activeCust") && e.type == "mouseover"){
					hoverSummary.classList.add("activeCust");
				}else if(hoverSummary.classList.contains("activeCust") && e.type == "mouseout"){
					hoverSummary.classList.remove("activeCust");
				}
			}else{
				let div = document.createElement('div');
				div.id = "hover-summary";
				div.classList.add("activeCust");
				let summaryList = "<ol>";
				summaryButton.parentElement.append(div);
				if(ionisx_edxlms != "" && ionisx_sid != ""){
					fetchSummary().then(liste => {
						for(let k in liste){
							console.log(liste)
							let valid = '<span class="custom fa-uncheck"></span>'
							if (liste[k].valid) valid = '<span class="custom fa fa-check"></span>';
							summaryList += `<li class="summary"><a href="${liste[k].link}">${liste[k].name}</a>${valid}</li>`;
						}
						summaryList += "</ol>";
						div.innerHTML = summaryList;
					})
				}else{
					div.innerHTML = '<label style="font-size: 12px;margin: 2px;">error with ionisx_edxlms and ionis_sid keys</label>';
				}
	
			}

	}


	//fetch summary and getting title, links and complete mark
	function fetchSummary(){
		//referer cookie fetch
		return new Promise(function(resolve, reject){
			let course = window.location.href.match(/https:\/\/courses\.ionisx\.com\/courses\/ref\/(m[0-9]{1,5})\//)[1];
			fetch(`https://courses.ionisx.com/courses/ref/${course}/x/course/`, {
				"headers": {
					"Cookie": `ionisx-sid=${ionisx_sid}; ionisx.edxlms="${ionisx_edxlms}"`
				}
			}) .then(res => res.text())
			.then (res2 => {
					
				let res3 = res2.replace(/(\r\n|\n|\r)/gm," ");
				let response = [];

				if(/You must be enrolled in the course to see course content/.test(res3)){
					response.push({
						name: "It seems that your cookies have expired",
						valid: false,
						link: ""
					})
				}else{
					let titleRegex = /<h4 class="subsection-title">[\s]*(.*?)[\s]*<\/h4>.*?(<span class="complete-checkmark fa fa-check"><\/span>|div).*?(https:\/\/courses\.ionisx\.com\/courses[a-z0-9\/_:]*)/g
			
					let datas = [...res3.matchAll(titleRegex)];
					datas.forEach(elt => {
						  response.push({
							name: elt[1].replace("&#39;", "'"),
							valid: (elt[2] == "div" ? false : true),
							link:elt[3].replace("&#39;", "'")
						  });
					});
				}
	
				resolve(response);
			})
		})
	}
}


/*
* CHANGE MEDIA PLAYER IN IONISX
*/
const removeElements = (elms) => elms.forEach(el => el.remove()); //delete all elements


function waitForIFrame(i, callBack) { //wait for the iframe to load
    window.setTimeout(() => {
        let element = document.getElementsByTagName("iframe")[i];
        if (element) {
            callBack(i, element);
        } else {
            waitForIFrame(i, callBack);
        }
    }, 100)
}

browser.storage.local.get([activeVideoPlayerState], function(active){
	if(active[activeVideoPlayerState]){
		console.log("is active")
		browser.storage.local.get([INSTANCE_VIDEO], function(result){
			const instance = result[INSTANCE_VIDEO] ?? DEFAULT_VIDEO_PLAYER;
			
			let n = document.getElementsByTagName("iframe").length; //number of iframe
			console.log(n)
			for (let i = 0; i < n; i++) {
				waitForIFrame(i, function () {
					try {
						let el = document.getElementsByTagName("iframe")[i];
						console.log(el)
						let video = el.src;
						console.log(video)
						if (video.includes("www.youtube.com")) {
							let newvideo = video.substring(0, video.indexOf('?')).replace("www.youtube.com", instance) || video.replace("www.youtube.com", instance);
							el.src = newvideo;
							console.log(newvideo)
							let size = document.getElementsByClassName("video-player")[i].scrollWidth;
							el.width = size;
							el.height = size / 16 * 9;
							
							//remove things from old iframe
							removeElements(document.querySelectorAll(".video-controls"));
							removeElements(document.querySelectorAll(".spinner"));
						}
					} catch (e) {
						console.log(e)
					}
				});
			}
		})
	}else{
		console.log(active[activeVideoPlayerState])
	}

})

