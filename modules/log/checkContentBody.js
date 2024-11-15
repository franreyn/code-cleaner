import { logError } from "./utilities/logError.js"

export function checkContentBody(document, filePath, errors) {
  // List of invalid nested elements
  const nestedElements = ['.content-body', 'header'];

  // Get all elements with the class 'content-body' from the document
  const contentBodies = Array.from(document.querySelectorAll('.content-body'));

  // Valid parent IDs
  const validParents = ['content-wrapper', 'second-column', 'third-column'];

  // Function to check for invalid nested elements
  const checkNestedElements = (contentBody) => {
    nestedElements.forEach(nestedElement => {
      const invalidNestedElements = contentBody.querySelectorAll(nestedElement);
      invalidNestedElements.forEach(() => {
        logError(contentBody, `An invalid '${nestedElement}' is nested within a '.content-body'`, filePath, errors);
      });
    });
  };

  // Function to check if content-body is inside a valid parent
  const checkValidParent = (contentBody) => {
    let parent = contentBody.parentElement;
    while (parent !== null) {
      if (parent.tagName.toLowerCase() === 'div' && validParents.includes(parent.getAttribute('id'))) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  };

  // Check each content body
  contentBodies.forEach(contentBody => {
    // Check for invalid nested elements
    checkNestedElements(contentBody);

    // Check if the content body is inside a valid parent
    if (!checkValidParent(contentBody)) {
      logError(contentBody, `A 'content-body' is not inside #content-wrapper, #second-column, or #third-column`, filePath, errors);
    }
  });
}
