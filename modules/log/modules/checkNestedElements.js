export function checkNestedElements(contentBody, nestedElements, errors, filePath) {
  nestedElements.forEach(nestedElement => {
    const invalidNestedElements = contentBody.querySelectorAll(nestedElement);
    invalidNestedElements.forEach(() => {
      errors[filePath].push(`An invalid '${nestedElement}' is nested within a '.content-body'`);
    });
  });
}
