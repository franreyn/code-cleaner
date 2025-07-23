import { errorMessages } from '../../../../config.js';


export function checkNestedElements(contentBody, nestedElements, errors, filePath) {
  nestedElements.forEach(nestedElement => {
    const invalidNestedElements = contentBody.querySelectorAll(nestedElement);
    invalidNestedElements.forEach(() => {
      errors[filePath].push(errorMessages.nestedContentBodyElement.replace('{nestedElement}', nestedElement));
    });
  });
}
