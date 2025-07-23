import { config, errorMessages } from '../../../../config.js';

export function checkDeprecatedClass(document, filePath, errors) {
  const deprecatedClasses = config.deprecatedClasses;

  deprecatedClasses.forEach(deprecatedClass => {
    const elements = document.getElementsByClassName(deprecatedClass);
    if (elements.length > 0) {
      errors[filePath].push(errorMessages.deprecatedClassErrorMessage.replace('{deprecatedClass}', deprecatedClass));
    }
  });
}
