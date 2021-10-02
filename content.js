

let coursesList = new RegExp(/https:\/\/ionisx\.com\/courses\/[a-z0-9]{24}/);
if(coursesList.test(window.location.href)){

	/*
	* REDUCTION DU HEADER IONISX
	*/
	document.getElementsByClassName("header-second-infos")[0].prepend(document.getElementsByClassName("cursus-header-title")[0])





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
			if(!hoverSummary.classList.contains("active") && e.type == "mouseover"){
				hoverSummary.classList.add("active");
			}else if(hoverSummary.classList.contains("active") && e.type == "mouseout"){
				hoverSummary.classList.remove("active");
			}
		}else{
			let div = document.createElement('div');
			div.id = "hover-summary";
			div.classList.add("active");
			let summaryList = "<ol>";
			summaryButton.parentElement.append(div);
			fetchSummary().then(liste => {
				for(let k in liste){
					console.log(liste)
					let valid = ""
					if (liste[k].valid) valid = '<span class="custom fa fa-check"></span>';
					summaryList += `<li class="summary"><a href="${liste[k].link}" target="_blank">${liste[k].name}</a>${valid}</li>`;
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
			let referer = window.location.href;
			fetch(`https://courses.ionisx.com/courses/ref/${course}/x/course/`, {
				"headers": {
					"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
					"cache-control": "max-age=0",
					"sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": "\"Windows\"",
					"sec-fetch-dest": "document",
					"sec-fetch-mode": "navigate",
					"sec-fetch-site": "same-origin",
					"sec-fetch-user": "?1",
					"upgrade-insecure-requests": "1",
					"Cookie": `ionisx-sid=${ionisx_sid}; ionisx.edxlms="${ionisx_edxlms}"`
				},
				"referrer": `${referer}`,
				"referrerPolicy": "strict-origin-when-cross-origin",
				"body": null,
				"method": "GET",
				"mode": "cors",
				"credentials": "include"
			}) .then(res => res.text())
			.then (res2 => {
					
				let res3 = res2.replace(/(\r\n|\n|\r)/gm," ");
				let titleRegex = /<h4 class="subsection-title"> [\s]* ([\w \u00C0-\u00FF \-:\&#39;]*)<\/h4>[\s]*(<span class="complete-checkmark fa fa-check"><\/span>)?/g

				// let titleRegex = / <h4 class=\"subsection-title\"> [\s]* ([\w \u00C0-\u00FF \-\&#39;]*) <\/h4> [\s]* (<span )? /g;
				let titles = res3.matchAll(titleRegex);
				let response = [];
				for (const title of titles) {
					let nameValid = title[0].replace(/<h4 class="subsection-title"> [\s]* ([\w \u00C0-\u00FF \-:\&#39;]*) <\/h4> [\s]* /, '$1')
					.replace(/[\s]{2,}/g," ")
					.replace("&#39;", "'");
					let valid = false;
					if( nameValid.includes('<span class="complete-checkmark fa fa-check"></span>')) valid = true

					response.push({
						name: nameValid.replace(/([\w \u00C0-\u00FF \-:']*).*/, "$1").slice(0,-1),
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

