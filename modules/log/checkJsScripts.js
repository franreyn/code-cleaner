import { logError } from "./utilities/logError.js"

export function checkScriptTagsLocation(document, filePath, errors) {
  // Get all <script> elements in the document
  const scriptElements = document.querySelectorAll("script");

  scriptElements.forEach((script) => {
    // Check if the parent of the script is the <head> element
    if (script.parentElement.tagName.toLowerCase() !== 'head') {
      // Log the error with the path and message
      logError(script, "Invalid JS placement (a <script> element is located outside the <head> section)", filePath, errors);
    }
  });
}
