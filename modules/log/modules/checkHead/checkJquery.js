import { config, errorMessages } from "../../../../config.js";

export function checkJquery(document, filePath, errors) {
	// Check if the document contains the jquery script
	let jqueryScript = document.querySelector(config.jQueryScriptSelector);
	if (jqueryScript) {
		// Initialize the errors array for the file path if it exist
		if (!errors[filePath]) {
			errors[filePath] = [];
		}
		// Add the error message to the errors array for the file path
		errors[filePath].push(errorMessages.missingJQueryScriptErrorMessage);
	}
}
