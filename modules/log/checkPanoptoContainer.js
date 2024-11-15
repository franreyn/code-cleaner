import { logError } from "./utilities/logError.js"

export function checkPanoptoWrapper(document, filePath, errors) {
  // Get all Panopto videos from the document - this uses the "rcode=PIMA" parameter in the URL
  const panoptoVideos = Array.from(document.querySelectorAll('iframe[src*="rcode=PIMA"]'));

  // Check each Panopto video
  panoptoVideos.forEach(panoptoVideo => {
    let mediaObject = panoptoVideo.parentElement;

    // Check if the iframe is contained within a div with the class 'media-object'
    if (mediaObject && mediaObject.tagName.toLowerCase() === 'div' && mediaObject.classList.contains('media-object')) {
      let mediaContainer = mediaObject.parentElement;

      // Check if the div with the class 'media-object' is contained within a div with the class 'media-container'
      if (mediaContainer && mediaContainer.tagName.toLowerCase() === 'div' && mediaContainer.classList.contains('media-container')) {
        // No errors, continue
      } else {
        // Log error if not wrapped by '.media-container' and/or '.media-object'
        logError(panoptoVideo, 'Invalid iframes detected (Panopto iframe not wrapped by \'.media-container\' and/or \'.media-object\')', filePath, errors);
      }
    } else {
      // Log error if the iframe is not wrapped by '.media-object'
      logError(panoptoVideo, 'Invalid iframes detected (Panopto iframe not wrapped by \'.media-container\' and/or \'.media-object\')', filePath, errors);
    }
  });
}
