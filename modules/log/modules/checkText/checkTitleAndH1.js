import { config, errorMessages } from '../../../../config.js';

export function checkTitleAndH1(document, filePath, errors) {
  // Get the <title> and <h1> elements
  let title = document.querySelector(config.titleSelector);
  let h1 = document.querySelector(config.h1Selector);

  if (title && h1) {
    // Check if the text content of <title> and <h1> match
    if (title.textContent.trim() !== h1.textContent.trim()) {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push(errorMessages.titleAndH1MismatchErrorMessage);
    }
  } else if (!title) {
		if (!errors[filePath]) {
			errors[filePath] = [];
		}
		errors[filePath].push(errorMessages.missingTitleErrorMessage);
    
  }
}
