import { logError } from "./utilities/logError.js"
import { config } from "../../config.js";

const titlesToCheck = config.titlesToCheck;
const iframesToExclude = config.iframesToExclude;

export function checkIframeTitles(document, filePath, errors) {
  // Get all iframes from the document
  let iframes = Array.from(document.querySelectorAll('iframe'));

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
      logError(iframe, 'Invalid iframe detected (not wrapped by \'.media-container\' and/or \'.media-object\').', filePath, errors);
    }

    // If 'media-container' does not have a 'media-info' sibling, check the iframe's title attribute
    if (!hasMediaInfoSibling && title) {
      titlesToCheck.forEach(str => {
        // Exclude Youtube placeholder iframes from log since those have the default title attr
        if (!iframesToExclude.some(url => src && src.includes(url)) && title.includes(str)) {
          logError(iframe, `Invalid iframe detected (incorrect title attribute: "${str}".)`, filePath, errors);
        }
      });
    }
  });
}
