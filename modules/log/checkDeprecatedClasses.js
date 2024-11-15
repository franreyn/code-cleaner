import { logError } from "./utilities/logError.js"

export function checkDeprecatedClasses(document, filePath, errors) {
  // Define the deprecated classes
  let deprecatedClasses = ['main', 'main-two-column', 'sidebar', 'video-container'];

  // Check each deprecated class
  deprecatedClasses.forEach(deprecatedClass => {
    // Get all elements with the deprecated class from the document
    let elementsWithDeprecatedClass = document.getElementsByClassName(deprecatedClass);

    // Get the element with the deprecated class as id from the document
    let elementWithDeprecatedId = document.getElementById(deprecatedClass);

    // If there are elements with the deprecated class or id, add an error
    if (elementsWithDeprecatedClass.length > 0 || elementWithDeprecatedId) {
      logError(document, `Contains deprecated class or id (${deprecatedClass})`, filePath, errors);
    }
  });
}
