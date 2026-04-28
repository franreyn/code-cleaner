import { config, errorMessages } from "../../../config.js";

const titlesToCheck = config.titlesToCheck;

export function checkIframeTitles(document, filePath, errors) {
  const fileErrors = [];
  // Get all iframes from the document
  let iframes = Array.from(document.querySelectorAll(config.iframeSelector));

  // Check each iframe
		iframes.forEach((iframe) => {
			const src = iframe.getAttribute(config.sourceSelector) || "";
			const aria = (iframe.getAttribute("aria-label") || "").trim().toLowerCase();
			const title = iframe.getAttribute(config.titleSelector);
	
			const isH5P =
				(src && src.startsWith(config.h5pUrlStarting)) ||
				(Array.isArray(config.h5pUrlSelector) &&
					config.h5pUrlSelector.some(url => src.includes(url)));
	
			const isPanopto =
				(Array.isArray(config.panoptoIframeSelector) &&
					config.panoptoIframeSelector.some(url => src.includes(url))) ||
				aria === "panopto embedded video player";
	
			if (isH5P || isPanopto) {
				return; // skip this iframe entirely
			}

    if (title) {
      titlesToCheck.forEach(str => {
        if (title.toLowerCase().includes(str.toLowerCase())) {
          fileErrors.push({
            message: errorMessages.iframeTitleErrorMessage.replace("{str}", str),
            node: iframe,
          });
        }
      });
    }
  });

  if (fileErrors.length > 0) {
    if (!errors[filePath]) {
      errors[filePath] = [];
    }
    errors[filePath].push(...fileErrors);
  }
}
