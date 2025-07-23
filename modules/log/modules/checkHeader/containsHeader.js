import { config, errorMessages } from "../../../../config.js";

export function containsHeader(document, filePath, errors) {
	// Convert filePath to lowercase and check if it contains 'syllabus'
	if (filePath.toLowerCase().includes(config.syllabusSelector)) {
		return;
	}

	// Check if the document contains a header with the class 'header'
	let header = document.querySelector(config.headerClassSelector);
	if (!header) {
		// Initialize the errors array for the file path if it doesn't exist
		if (!errors[filePath]) {
			errors[filePath] = [];
		}
		// Add the error message to the errors array for the file path
		errors[filePath].push(errorMessages.missingHeaderClassErrorMessage);
	}
}
