export function checkJquery(document, filePath, errors) {
	// Check if the document contains the jquery script
	let jqueryScript = document.querySelector('script[type="text/javascript"][src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"][defer]');
	if (jqueryScript) {
		// Initialize the errors array for the file path if it exist
		if (!errors[filePath]) {
			errors[filePath] = [];
		}
		// Add the error message to the errors array for the file path
		errors[filePath].push("Head contains deprecated jquery script");
	}
}
