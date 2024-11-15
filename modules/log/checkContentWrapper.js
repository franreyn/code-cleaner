import { logError } from "./utilities/logError.js"

export function checkContentWrapper(document, filePath, errors) {
  // Check if the document contains a div with the id 'content-wrapper'
  let contentWrapper = document.querySelector('div#content-wrapper');

  if (!contentWrapper) {
    // Log the error using the logError function
    logError(document, "Missing '#content-wrapper'", filePath, errors);
  }
}
