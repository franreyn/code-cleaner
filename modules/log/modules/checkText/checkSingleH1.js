import { config, errorMessages }	from "../../../../config.js";

export function checkSingleH1(document, filePath, errors) {
	const h1Elements = document.querySelectorAll(config.h1Selector);
	
	if(h1Elements.length > 1) {
		if (!errors[filePath]) {
			errors[filePath] = [];
		}
		errors[filePath].push(errorMessages.multipleH1HeadingsErrorMessage);
	}


}