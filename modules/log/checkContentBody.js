import { checkNestedElements } from "./modules/checkNestedElements.js";
import { checkValidParent } from "./modules/checkValidParent.js";

export function checkContentBody(document, filePath, errors) {
  const nestedElements = [".content-body", "header"];

  if (!errors[filePath]) {
    errors[filePath] = [];
  }

  const contentBodies = Array.from(document.querySelectorAll(".content-body"));
  const validParents = ["content-wrapper", "second-column", "third-column"];

  contentBodies.forEach(contentBody => {
    checkNestedElements(contentBody, nestedElements, errors, filePath);

    if (!checkValidParent(contentBody, validParents)) {
      errors[filePath].push("A 'content-body' is not inside #content-wrapper, #second-column, or #third-column");
    }
  });
}
