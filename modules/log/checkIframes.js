export function checkIframes(document, filePath, errors) {
  // Get all iframes from the document
  let iframes = Array.from(document.querySelectorAll('iframe'));

  // Check each iframe
  iframes.forEach(iframe => {
    let src = iframe.getAttribute('src');

    // Check if the iframe uses h5p and if it does, ensure it is wrapped in a div
    if (src && src.includes("/d2l/common/dialogs/quickLink") || src.includes("https://pima.h5p.com/content") || src.includes("h5p")) {
      let parent = iframe.parentElement;

      // Check if the iframe is contained within a div with the class 'media-object'
      while (parent !== null) {
        if (parent.tagName.toLowerCase() === 'div') {
          return;
        }
        parent = parent.parentElement;
      }

      // If the iframe is not contained within a div with the class 'media-object', add an error
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push('Invalid iframes detected (h5p iframe not contained within \'div\' tag)');
    }

    // Check if the iframe's src attribute includes specific URLs
    if (src && (src.includes('https://www.youtube.com') || src.includes('https://pima-cc.hosted.panopto.com'))) {

      let parent = iframe.parentElement;

      // Check if the iframe is contained within a div with the class 'media-object'
      while (parent !== null) {
        if (parent.tagName.toLowerCase() === 'div' && parent.getAttribute('class') === 'media-object') {
          return;
        }
        parent = parent.parentElement;
      }

      // If the iframe is not contained within a div with the class 'media-object', add an error
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push('Invalid iframes detected (not contained within \'.media-container\')');
    }
  });
}