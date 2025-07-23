import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

export function removeRolePresentation() {
  return domTransform((document) => {
    const elements = document.querySelectorAll(config.rolePresentationSelector);
    elements.forEach((el) => el.removeAttribute(config.roleAttributeToRemove));
  });
}
