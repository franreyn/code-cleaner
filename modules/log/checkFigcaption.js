export function checkFigcaptions(document, filePath, errors) {
  // Get all figcaptions from the document
  let figcaptions = document.querySelectorAll('figcaption');

  figcaptions.forEach((figcaption) => {
    if (figcaption.parentNode.nodeName !== "FIGURE") {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push('A figcaption is not nested within a figure element.');
    }
  });
}
