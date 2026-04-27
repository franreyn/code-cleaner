/**
 * @file Removes empty HTML tags from the document. It uses two remove methods to remove empty tags and empty text nodes. 
 *  During development, many of the empty text nodes left behind &nbsp; and white space characters that needed to be removed.
 *  
 */
import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

// Helper function to specifically target empty text nodes using a TreeWalker vs query selector
function removeEmptyTextNodes(root) {
  const htmlDocToParse = root.ownerDocument || root;
  // Use the document's createTreeWalker. 4 is the bitmask for NodeFilter.SHOW_TEXT.
  const treeWalkerForTextNodes = htmlDocToParse.createTreeWalker(root, 4, null);
  const emptyTextNodes = [];
  let currentNode;

  while ((currentNode = treeWalkerForTextNodes.nextNode())) {
    // Clean text by removing whitespace, non-breaking spaces, etc.
    const cleanedTextNode = currentNode.nodeValue.replace(/[\s\u00A0\u2007\u202F\uFEFF\u200B]/g, '');
    if (cleanedTextNode.length === 0) {
      emptyTextNodes.push(currentNode);
    }
  }

  emptyTextNodes.forEach(emptyNode => emptyNode.remove());
}

// Main function to remove empty tags. It uses a loop to ensure that if removing empty tags causes parent tags to become empty, those are also removed in subsequent iterations.
export function removeEmptyTags() {
  return domTransform((document) => {

    // First, remove stray whitespace / &nbsp; text nodes so element checks are accurate.
    removeEmptyTextNodes(document);

    const allPotentiallyEmptyTags = Array.from(document.querySelectorAll(config.emptyTagSelector));
    if (allPotentiallyEmptyTags.length === 0) return;

    // Bottom-up pass: iterate in reverse so children are processed before parents.
    for (let tagCheckerIndex = allPotentiallyEmptyTags.length - 1; tagCheckerIndex >= 0; tagCheckerIndex--) {
      const currentTag = allPotentiallyEmptyTags[tagCheckerIndex];
      if (!currentTag.isConnected) continue; // may have been removed already

      const cleanedTag = currentTag.textContent.replace(/[\s\u00A0\u2007\u202F\uFEFF\u200B]/g, '');
      const hasNoText = cleanedTag.length === 0;
      const hasNoChildren = currentTag.children.length === 0;

      if (hasNoText && hasNoChildren) currentTag.remove();
    }

    // Clean up any text nodes left after removals.
    removeEmptyTextNodes(document);
  });
}