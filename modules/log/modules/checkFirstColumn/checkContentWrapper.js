import { config, errorMessages } from "../../../../config.js";

export function checkContentWrapper(document, filePath, errors) {
  // Check if the document contains a div with the id 'content-wrapper'
  let contentWrapper = document.querySelector(config.contentWrapperSelector);
  // Check if document contains #first-column
  let firstColumn = document.querySelector(config.firstColumnSelector);
  // If neither contentWrapper nor firstColumn exists, it will log the error
  if (!contentWrapper && !firstColumn) {
    // Initialize the errors array for the file path if it doesn't exist
    if (!errors[filePath]) {
      errors[filePath] = [];
    }
    // Add the error message to the errors array for the file path
    errors[filePath].push(errorMessages.missingContentWrappperFirstColumnErrorMessage);
  }
}
