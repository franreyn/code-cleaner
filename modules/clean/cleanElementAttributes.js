import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

// remove 'style' attribute from given elements
export function cleanElementAttributes() {
  return domTransform((document) => {
    const discardElemAttributes = (element, ...attributes) =>
      attributes.forEach((attribute) => element.removeAttribute(attribute));
    return document.querySelectorAll(config.noStyleElements).forEach((elem) =>
      discardElemAttributes(elem, config.styleRemoval[0])
    );
  });
}