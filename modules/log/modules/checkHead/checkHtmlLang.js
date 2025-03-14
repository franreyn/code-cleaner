export function checkHtmlLang(document, filePath, errors) {
  // Check if the HTML element has a 'lang' attribute and if it's 'en'
  let html = document.querySelector('html');
  if (!html || html.getAttribute('lang') !== 'en') {
    // Initialize the errors array for the file path if it doesn't exist
    if (!errors[filePath]) {
      errors[filePath] = [];
    }
    // Add the error message to the errors array for the file path
    errors[filePath].push("Missing <html lang='en'>");
  }
}
