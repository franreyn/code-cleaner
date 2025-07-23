import { config } from '../../../../config.js';

export function checkValidParent(contentBody, validParents) {
  let parent = contentBody.parentElement;
  while (parent !== null) {
    if (parent.tagName.toLowerCase() === config.divSelector && validParents.includes(parent.getAttribute(config.idSelector))) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}
