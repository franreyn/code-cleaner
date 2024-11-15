import { logError } from "./utilities/logError.js"

export function checkDoctype(document, filePath, errors) {
  // Check if the document has a doctype and if it's HTML
  if (!document.doctype || document.doctype.name.toLowerCase() !== 'html') {
    // Log the error using the logError function
    logError(document, 'Missing <!DOCTYPE html>', filePath, errors);
  }
}
