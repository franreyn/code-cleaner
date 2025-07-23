import { config, errorMessages } from "../../../config.js";

export function checkIframes(document, filePath, errors) {
  // Get all iframes from the document
  let iframes = Array.from(document.querySelectorAll(config.iframeSelector));

  // Check each iframe
  iframes.forEach(iframe => {
    let src = iframe.getAttribute(config.sourceSelector);

    // Check if the iframe uses h5p and if it does, ensure it is wrapped in a div
    if (src && config.h5pUrlSelector.some(url => src.includes(url))) {
      let parent = iframe.parentElement;

      // Check if the iframe is contained within a div with the class 'media-object'
      while (parent !== null) {
        if (parent.tagName.toLowerCase() === config.divSelector) {
          return;
        }
        parent = parent.parentElement;
      }

      // If the iframe is not contained within a div with the class 'media-object', add an error
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push(errorMessages.h5pIframeErrorMessage);
    }

    // Check if the iframe's src attribute includes specific URLs
    if (src && (config.iframeUrlCheck.some(url => src.includes(url)))) {

      let parent = iframe.parentElement;

      // Check if the iframe is contained within a div with the class 'media-object'
      while (parent !== null) {
        if (parent.tagName.toLowerCase() === config.divSelector && parent.getAttribute("class") === config.mediaObjectSelector) {
          return;
        }
        parent = parent.parentElement;
      }

      // If the iframe is not contained within a div with the class 'media-object', add an error
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push(errorMessages.iframeErrorMessage);
    }
  });
}