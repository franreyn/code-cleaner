import { config, errorMessages } from "../../../config.js";

const titlesToCheck = config.titlesToCheck;
const iframesToExclude = config.iframesToExclude;

export function checkIframeTitles(document, filePath, errors) {
  // Get all iframes from the document
  let iframes = Array.from(document.querySelectorAll(config.iframeSelector));

  // Check each iframe
  iframes.forEach(iframe => {
    let src = iframe.getAttribute(config.sourceSelector);
    let title = iframe.getAttribute(config.titleSelector);

    // If the iframe's src starts with "https://pima.h5p.com", skip it completely
    if (src && (src.startsWith(config.h5pUrlStarting) || (src.includes((url => url.contains(config.h5pUrlSelector)))))) {
      return;
    }

    let parent = iframe.parentElement;
    let foundMediaObject = false;
    let foundMediaContainer = false;
    let hasMediaInfoSibling = false;

    // Check if the iframe is contained within a div with the class 'media-object'
    if (parent && parent.tagName.toLowerCase() === config.divSelector && parent.getAttribute("class") === config.mediaObjectSelector) {
      foundMediaObject = true;

      // Check if the 'media-object' is wrapped by 'media-container'
      let grandParent = parent.parentElement;
      if (grandParent && grandParent.tagName.toLowerCase() === config.divSelector && grandParent.classList.contains(config.mediaContainerSelector)) {
        foundMediaContainer = true;

        // Check if 'media-container' has a sibling with the class 'media-info'
        let siblings = Array.from(grandParent.children);
        hasMediaInfoSibling = siblings.some(sibling => sibling.getAttribute("class") === config.mediaInfoSelector);
      }
    }

    // Log errors based on the checks
    if (!foundMediaObject || !foundMediaContainer) {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push(errorMessages.iframeWrapperErrorMessage);
    }

    // If 'media-container' does not have a 'media-info' sibling, check the iframe's title attribute
    if (!hasMediaInfoSibling && title) {
      titlesToCheck.forEach(str => {
        // Exclude Youtube placeholder iframes from log since those have the default title attr
        if (!iframesToExclude.some(url => src && src.includes(url)) && title.includes(str)) {
          if (!errors[filePath]) {
            errors[filePath] = [];
          }
          errors[filePath].push(errorMessages.iframeTitleErrorMessage.replace("{str}", str));
        }
      });
    }
  });
}
