import { config, errorMessages } from "../../../../config.js";

export function checkDeprecatedId(document, filePath, errors) {
  const deprecatedIds = config.deprecatedClasses;

  deprecatedIds.forEach(deprecatedId => {
    if (document.getElementById(deprecatedId)) {
      errors[filePath].push(errorMessages.deprecatedIdErrorMessage.replace('{deprecatedId}', deprecatedId));
    }
  });
}
