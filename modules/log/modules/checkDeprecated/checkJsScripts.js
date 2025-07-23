import { config, errorMessages } from "../../../../config.js";

export function checkScriptTagsLocation(document, filePath, errors) {
  // Get all <script> elements in the document
  const scriptElements = document.querySelectorAll(config.scriptSelector);

  scriptElements.forEach((script) => {
    // Check if the parent of the script is the <head> element
    if (script.parentElement.tagName.toLowerCase() !== config.headSelector ) {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push(errorMessages.invalidJsPlacementErrorMessage);
    }
  });
}
