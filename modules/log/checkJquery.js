import { logError } from "./utilities/logError.js"

export function checkJquery(document, filePath, errors) {
	// Check if the document contains the jquery script
	let jqueryScript = document.querySelector('script[type="text/javascript"][src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"][defer]');
	if (jqueryScript) {
		// Log the error with the path and message
		logError(jqueryScript, "Head contains deprecated jquery script", filePath, errors);
	}
}
