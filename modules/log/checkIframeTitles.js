export function checkIframeTitles(document, filePath, errors, stringsToCheck) {
  // Get all iframes from the document
  let iframes = Array.from(document.querySelectorAll('iframe'));
  stringsToCheck = ["YouTube video player"];

  // Check each iframe
  iframes.forEach(iframe => {
    let src = iframe.getAttribute('src');
    let title = iframe.getAttribute('title');

    // If the iframe's src starts with "https://pima.h5p.com", skip it completely
    if (src && (src.startsWith("https://pima.h5p.com") || src.includes("/d2l/common/dialogs/quickLink/quickLink") || src.includes("h5p"))) {
      return;
    }

    let parent = iframe.parentElement;
    let foundMediaObject = false;
    let foundMediaContainer = false;
    let hasMediaInfoSibling = false;

    // Check if the iframe is contained within a div with the class 'media-object'
    if (parent && parent.tagName.toLowerCase() === 'div' && parent.getAttribute('class') === 'media-object') {
      foundMediaObject = true;

      // Check if the 'media-object' is wrapped by 'media-container'
      let grandParent = parent.parentElement;
      if (grandParent && grandParent.tagName.toLowerCase() === 'div' && grandParent.classList.contains('media-container')) {
        foundMediaContainer = true;

        // Check if 'media-container' has a sibling with the class 'media-info'
        let siblings = Array.from(grandParent.children);
        hasMediaInfoSibling = siblings.some(sibling => sibling.getAttribute('class') === 'media-info');
      }
    }

    // Log errors based on the checks
    if (!foundMediaObject || !foundMediaContainer) {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push('Invalid iframe detected (not wrapped by \'.media-container\' and/or \'.media-object\').');
    }

    // If 'media-container' does not have a 'media-info' sibling, check the iframe's title attribute
    if (!hasMediaInfoSibling && title) {
      stringsToCheck.forEach(str => {
        if (title.includes(str)) {
          if (!errors[filePath]) {
            errors[filePath] = [];
          }
          errors[filePath].push(`Invalid iframes detected (incorrect title attribute: "${str}".)`);
        }
      });
    }
  });
}
