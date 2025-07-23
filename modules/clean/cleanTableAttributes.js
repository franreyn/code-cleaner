import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

// remove given attributes from table elements
export function cleanTableAttributes() {
  return domTransform((document) => {
    const discardTableAttributes = (tableElement, ...tableAttributes) =>
      tableAttributes.forEach((tableAttribute) => tableElement.removeAttribute(tableAttribute));
    return document.querySelectorAll(config.tableElementsSelector).forEach((tableElem) =>
      discardTableAttributes(tableElem, config.tableAttributesToRemove)
    );
  });
}