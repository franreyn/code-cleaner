import { logError } from "./utilities/logError.js"

export function checkTitleAndH1(document, filePath, errors) {
  // Get the <title> and <h1> elements
  let title = document.querySelector('title');
  let h1 = document.querySelector('h1');

  // Check if <title> and <h1> are both present
  if (!title) {
    logError(document, 'Missing <title> element', filePath, errors);
  } else if (h1) {
    // Check if <title> and <h1> text content match
    if (title.textContent.trim() !== h1.textContent.trim()) {
      logError(document, '<title> and <h1> do not match', filePath, errors);
    }
  }
}
