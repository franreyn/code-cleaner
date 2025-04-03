export function checkValidParent(contentBody, validParents) {
  let parent = contentBody.parentElement;
  while (parent !== null) {
    if (parent.tagName.toLowerCase() === "div" && validParents.includes(parent.getAttribute("id"))) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}
