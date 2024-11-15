import { logError } from "./utilities/logError.js"

export function checkHtmlLang(document, filePath, errors) {
  // Check if the HTML element has a 'lang' attribute and if it's 'en'
  let html = document.querySelector('html');
  if (!html || html.getAttribute('lang') !== 'en') {
    // Log the error using logError
    logError(document, "Missing <html lang='en'>", filePath, errors);
  }
}
