import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

export function cleanImageAttributes() {
	return domTransform((document) => {
    // Define the attributes to remove from each image tag
    const attributesToRemove = config.imageAttributesToRemove

    // Select all <img> elements in the document
    const images = document.querySelectorAll(config.imageSelector);

    images.forEach((img) => {
      // Remove specified attributes from the <img> tag
      attributesToRemove.forEach(attr => img.removeAttribute(attr));

      // Ensure each <img> not in a <figure> with <figcaption> has an alt attribute
      const figure = img.closest(config.figureSelector);
      const figcaption = figure ? figure.querySelector(config.figcaptionSelector) : null;
      if (!figcaption && !img.hasAttribute(config.altSelector)) {
        img.setAttribute(config.altSelector, "");
      }

      // Check if the parent is a <p> and replace it with a <div>
      const parent = img.parentNode;
      if (parent && parent.tagName.toLowerCase() === config.paragraphSelector) {
        const div = document.createElement(config.divSelector);
        parent.replaceWith(div);
        div.appendChild(img);
      }
    });
  });
}
