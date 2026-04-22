/**
 * @file Removes empty HTML tags from the document. It uses two remove methods to remove empty tags and empty text nodes. 
 *  During development, many of the empty text nodes left behind &nbsp; and white space characters that needed to be removed.
 *  
 */
import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

// Helper function to remove empty text nodes, which can cause tags to appear non-empty (especially &nbsp;)
function removeEmptyTextNodes(root) {
  // Using ownerDocument to ensure we get the correct document context, especially if root is a DocumentFragment or an Element
  const htmlDocToParse = root && (root.ownerDocument || root);

  // NodeFilter may not be available in all environments, so we check for it and fall back to global node filter if possible
  const NodeFilterObj = (htmlDocToParse && htmlDocToParse.defaultView && htmlDocToParse.defaultView.NodeFilter) || global.NodeFilter;

  // Create a TreeWalker to traverse text nodes. If NodeFilter is not available, we can still use SHOW_TEXT (4) directly.
  const treeWalkerForTextNodes = (htmlDocToParse || global).createTreeWalker(
    root,
    NodeFilterObj ? NodeFilterObj.SHOW_TEXT : 4, // 4 is a bitmask to show only text nodes, so we only traverse text nodes
    null
  );

  // Initialize an array to hold text nodes that are empty and should be removed
  const emptyTextNodes = [];

  // Create placeholder node to prevent issues with live node lists when removing nodes during traversal
  let currentNode;

  // Traverse the text nodes in the document
  while ((currentNode = treeWalkerForTextNodes.nextNode())) {

    // Clean the text content by removing all whitespace characters, including non-breaking spaces and zero-width spaces
    const cleanedTextNode = currentNode.nodeValue
      .replace(/[\s\u00A0\u2007\u202F\uFEFF\u200B]/g, '');

    // If the cleaned text is empty, we mark this node for removal
    if (cleanedTextNode.length === 0) {
      emptyTextNodes.push(currentNode);
    }
  }

  // After traversal, we remove all the nodes that were marked for removal
  emptyTextNodes.forEach(emptyNode => emptyNode.remove());
}

// Main function to remove empty tags. It uses a loop to ensure that if removing empty tags causes parent tags to become empty, those are also removed in subsequent iterations.
export function removeEmptyTags() {
  return domTransform((document) => {

    // Intialize a flag to track if we found and removed any empty tags in the current iteration
    let foundEmpty;

    do {
      // Set it to false so that the while loop will exit if we don't find any empty tags to remove in this iteration
      foundEmpty = false;

      const emptyHtmlTags = document.querySelectorAll(config.emptyTagSelector);

      emptyHtmlTags.forEach((emptyTag) => {
        const cleanedEmptyTags = emptyTag.textContent
          .replace(/[\s\u00A0\u2007\u202F\uFEFF\u200B]/g, '');

        // Ensure that the tag has no text content (after cleaning)
        const hasNoText = cleanedEmptyTags.length === 0;
        const hasNoChildren = emptyTag.children.length === 0;

        if (hasNoText && hasNoChildren) {
          // Remove empty tags
          emptyTag.remove();
          foundEmpty = true;
        }
      });

      // Remove empty text nodes
      removeEmptyTextNodes(document);

    } while (foundEmpty);
  });
}
