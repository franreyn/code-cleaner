/**
 * @file Removes empty HTML tags from the document
 * 
 */
import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

export function removeEmptyTags() {
  return domTransform((document) => {
    let foundEmpty;
    
    // Run multiple passes to catch parents that become empty after children are removed
    do {
        console.log("Running pass to remove empty tags...");
      foundEmpty = false;
      const emptyHtmlTags = document.querySelectorAll(config.emptyTagSelector);
      
      emptyHtmlTags.forEach((emptyHtmlTag) => {
        // Regex to check if content is only whitespace, &nbsp;, or Unicode NBSP
        // This is more robust than simple string comparison
        const content = emptyHtmlTag.innerHTML.trim();
        const isEmpty = /^(\s|&nbsp;|\u00A0)*$/.test(content);

        if (isEmpty) {
          console.log(`Removing empty tag: <${emptyHtmlTag.tagName.toLowerCase()}>`);
          emptyHtmlTag.remove();
          foundEmpty = true;
        }
      });
    } while (foundEmpty);
  });
}
