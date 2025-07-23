import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

export function cleanTextElements() {
	return domTransform((document) => {
		const discardTextAttributes = (textElement, ...attributes) =>
      attributes.forEach((attribute) => textElement.removeAttribute(attribute));
    return document.querySelectorAll(config.textElementsSelector).forEach((elem) =>
      discardTextAttributes(elem, config.textAttributesToRemove)
    );
	})
}