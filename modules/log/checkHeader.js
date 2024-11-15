import { logError } from "./utilities/logError.js"

export function checkHeader(document, filePath, errors) {
	// Convert filePath to lowercase and check if it contains 'syllabus'
	if (filePath.toLowerCase().includes("syllabus")) {
		return;
	}

	// Check if the document contains a header with the class 'header'
	let header = document.querySelector("header.header");
	if (!header) {
		// Log the error using the logError function
		logError(document, "Missing <header class='header'></div>", filePath, errors);
	}
}
