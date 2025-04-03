export function checkScriptTagsLocation(document, filePath, errors) {
  // Get all <script> elements in the document
  const scriptElements = document.querySelectorAll("script");

  scriptElements.forEach((script) => {
    // Check if the parent of the script is the <head> element
    if (script.parentElement.tagName.toLowerCase() !== 'head') {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push("Invalid JS placement (a <script> element is located outside the <head> section)");
    }
  });
}
