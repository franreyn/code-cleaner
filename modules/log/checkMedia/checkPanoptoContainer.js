// This requires a check for media container and media object even though it is found in checkIframeTitles.js because Panopto videos are lumped together with h5p videos in the same check. This is a separate check for Panopto videos only.

import { config, errorMessages } from '../../../config.js';

export function checkPanoptoContainer(document, filePath, errors) {
	// Get all panopto videos from the document - this uses the "rcode=PIMA" parameter in the URL
	const panoptoVideos = Array.from(document.querySelectorAll(config.panoptoIframeSelector));

	// Check each panopto video
	panoptoVideos.forEach(panoptoVideo => {
		let mediaObject = panoptoVideo.parentElement;

		// Check if the iframe is contained within a div with the class 'media-object'
		if (mediaObject && mediaObject.tagName.toLowerCase() === config.divSelector && mediaObject.classList.contains(config.mediaObjectSelector)) {

			let mediaContainer = mediaObject.parentElement;

			// Check if the div with the class 'media-object' is contained within a div with the class 'media-container'
			if(mediaContainer && mediaContainer.tagName.toLowerCase() === config.divSelector && mediaContainer.classList.contains(config.mediaContainerSelector)) {
			} else {
				if (!errors[filePath]) {
					errors[filePath] = [];
				}
				// If the div with the class 'media-object' is not contained within a div with the class 'media-container', add an error
				errors[filePath].push(errorMessages.invalidPanoptoIframe);
			}
		} else {
			// No errors array for this file yet, create one
			if (!errors[filePath]) {
				errors[filePath] = [];
			}
			// If the iframe is not contained within a div with the class 'media-object', add an error
			errors[filePath].push(errorMessages.invalidPanoptoIframeWrapperErrorMessage);
		}
	});
}