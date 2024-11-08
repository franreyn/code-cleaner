export function checkImgAlt(document, filePath, errors) {

  // Helper function to log errors
  const logError = (message) => {
    if (!errors[filePath]) {
      errors[filePath] = [];
    }
    errors[filePath].push(message);
  };

  // Get all <img> elements
  let imgElements = document.querySelectorAll('img');

  imgElements.forEach((img) => {
    // Check if alt attribute is missing
    if (!img.hasAttribute('alt')) {
      // Check if the <img> is within a <header>
      const isInHeader = img.closest('header') !== null;
  
      if (isInHeader) {
        // If in a <header>, log a specific error for a missing alt attribute only
        logError('A header <img> element is missing its alt attribute');
      } else {
        // If not in a <header>, check if the <img> is inside a <figure> with a <figcaption>
        const parent = img.parentElement;
        if (!parent || parent.tagName !== 'FIGURE' || !parent.querySelector('figcaption')) {
          logError('An <img> element is missing its alt attribute and is not inside a <figure> with a <figcaption>');
        } else {
          // <img> is inside a <figure> with a <figcaption> but missing alt attribute
          logError('An <img> within a <figure> element is missing its alt attribute');
        }
      }
    }

    // Check if <img> is inside a <p> tag
    if (img.parentElement && img.parentElement.tagName === 'P') {
      logError('An <img> element is inside a <p> tag');
    }

    // Check for unnecessary attributes
    const attributes = ['decoding', 'fetchpriority', 'height', 'loading', 'srcset', 'style', 'sizes', 'width'];
    attributes.forEach((attribute) => {
      if (img.hasAttribute(attribute)) {
        logError(`An <img> element contains the attribute: ${attribute}`);
      }
    });
  });
}
