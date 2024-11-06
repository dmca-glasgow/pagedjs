import Handler from "./handler.js";
import { cleanPseudoContent } from "../utils/css.js";

class StringSets extends Handler {
	constructor(chunker, caller) {
		super(chunker, caller);

		this.stringSetSelectors = {};
		this.type;
		// pageLastString = last string variable defined on the page
		this.pageLastString;

	}

	afterPageLayout(fragment) {
		if ( this.pageLastString === undefined )
		{
			this.pageLastString = {};
		}

    const stringSetSelectors = {
      title: {identifier: 'title', func: 'content', value: 'text', selector: 'h2'}
    }

		for (let name of Object.keys(stringSetSelectors)) {

			let set = stringSetSelectors[name];
			// let value = set.value;
			let func = set.func;
			let selected = fragment.querySelectorAll(set.selector);

      // console.log({set, value, func, selected})

			// Get the last found string for the current identifier
			let stringPrevPage = ( name in this.pageLastString ) ? this.pageLastString[name] : "";

			let varFirst, varLast, varStart, varFirstExcept;

			if(selected.length == 0){
				// if there is no sel. on the page
				varFirst = stringPrevPage;
				// varLast = stringPrevPage;
				// varStart = stringPrevPage;
				// varFirstExcept = stringPrevPage;
			}else{

				selected.forEach((sel) => {
					// push each content into the array to define in the variable the first and the last element of the page.
					if (func === "content") {
						this.pageLastString[name] = selected[selected.length - 1].textContent;
					}

					// if (func === "attr") {
					// 	this.pageLastString[name] = selected[selected.length - 1].getAttribute(value) || "";
					// }

				});

				/* FIRST */

				if (func === "content") {
					varFirst = selected[0].textContent;
				}

				// if (func === "attr") {
				// 	varFirst = selected[0].getAttribute(value) || "";
				// }


				// /* LAST */

				// if (func === "content") {
				// 	varLast = selected[selected.length - 1].textContent;
				// }

				// if (func === "attr") {
				// 	varLast = selected[selected.length - 1].getAttribute(value) || "";
				// }


				/* START */

				// Hack to find if the sel. is the first elem of the page / find a better way
				// let selTop = selected[0].getBoundingClientRect().top;
				// let pageContent = selected[0].closest(".pagedjs_page_content");
				// let pageContentTop = pageContent.getBoundingClientRect().top;

				// if(selTop == pageContentTop){
				// 	varStart = varFirst;
				// }else{
				// 	varStart = stringPrevPage;
				// }

				// // /* FIRST EXCEPT */

				// varFirstExcept = "";

			}

			fragment.style.setProperty(`--pagedjs-string-first-${name}`, `"${cleanPseudoContent(varFirst)}`);
			// fragment.style.setProperty(`--pagedjs-string-last-${name}`, `"${cleanPseudoContent(varLast)}`);
			// fragment.style.setProperty(`--pagedjs-string-start-${name}`, `"${cleanPseudoContent(varStart)}`);
			// fragment.style.setProperty(`--pagedjs-string-first-except-${name}`, `"${cleanPseudoContent(varFirstExcept)}`);


		}
	}


}



export default StringSets;
