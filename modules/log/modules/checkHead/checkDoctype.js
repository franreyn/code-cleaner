import { config, errorMessages } from "../../../../config.js";

export function checkDoctype(document, filePath, errors) {
  // Check if the document has a doctype and if it's HTML
  if (!document.doctype || document.doctype.name.toLowerCase() !== config.htmlSelector) {
    // Initialize the errors array for the file path if it doesn't exist
    if (!errors[filePath]) {
      errors[filePath] = [];
    }
    // Add the error message to the errors array for the file path
    errors[filePath].push(errorMessages.missingDoctypeErrorMessage);
  }
}
