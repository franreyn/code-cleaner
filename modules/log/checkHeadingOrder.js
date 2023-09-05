// This new function will traverse the DOM of the document, checking the order of the headings (h1, h2, h3, etc.). If it finds a heading that is out of order (for example, an h2 directly following an h4), it will log an error.

export function checkHeadingOrder(document, filePath, errors) {
  let headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let currentLevel = 1;

  for (let i = 0; i < headings.length; i++) {
    let headingLevel = parseInt(headings[i].nodeName.substring(1));

    if (headingLevel > currentLevel + 1) {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push(`Heading out of order (${headings[i].nodeName.toLowerCase()} found after h${currentLevel})`);
    } else {
      currentLevel = headingLevel;
    }
  }
}