import { checkNestedElements } from "./modules/checkContentBody/checkNestedElements.js";
import { checkValidParent } from "./modules/checkContentBody/checkValidParent.js";
import { config, errorMessages } from '../../config.js';

export function checkContentBody(document, filePath, errors) {
  const nestedElements = config.elementsShouldNotBeNested;
  const contentBodies = Array.from(document.querySelectorAll(config.contentBodySelector));
  const validParents = config.contentSections;

  if (!errors[filePath]) {
    errors[filePath] = [];
  }

  contentBodies.forEach(contentBody => {
    checkNestedElements(contentBody, nestedElements, errors, filePath);

    if (!checkValidParent(contentBody, validParents)) {
      errors[filePath].push(errorMessages.contentBodyNotValidErrorMessage);
    }
  });
}
