

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
	switch (window.location.href.match(/https:\/\/ionisx\.com\/courses\/[a-z0-9]{24}\/([a-z0-9\-]*)/)[1]) {
		case "epita-maths-s1":
			addDates("epita_maths_s1")
			break;
		case 'epita-algorithmique-s1-et-s1':
			addDates("epita_algorithmique_s1_et_s1")
			break;
		default:
			break;
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

		}

	}



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
				let titleRegex = /<h4 class="subsection-title"> [\s]* ([\w \u00C0-\u00FF \-:,’\&#39;]*)<\/h4>[\s]*(<span class="complete-checkmark fa fa-check"><\/span>)?/g

				// let titleRegex = / <h4 class=\"subsection-title\"> [\s]* ([\w \u00C0-\u00FF \-\&#39;]*) <\/h4> [\s]* (<span )? /g;
				let titles = res3.matchAll(titleRegex);
				let response = [];
				for (const title of titles) {
					let nameValid = title[0].replace(/<h4 class="subsection-title"> [\s]* ([\w \u00C0-\u00FF \-:,’\&#39;]*) <\/h4> [\s]* /, '$1')
					.replace(/[\s]{2,}/g," ")
					.replace("&#39;", "'");
					let valid = false;
					if( nameValid.includes('<span class="complete-checkmark fa fa-check"></span>')) valid = true

					response.push({
						name: nameValid.replace(/([\w \u00C0-\u00FF \-:,’']*).*/, "$1").slice(0,-1),
						valid: valid,
						link:""
					})
				}

				let linkRegex = /https:\/\/courses\.ionisx\.com\/courses[a-z0-9\/_:]*/g;
				let links = res3.matchAll(linkRegex);
				let k = 0;
				for (const link of links) {
					response[k].link = link[0]
					k++
				}
	
				resolve(response);
			})
		})
	}
}



