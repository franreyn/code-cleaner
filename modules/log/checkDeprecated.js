import { checkDeprecatedClass } from "./modules/checkDeprecated/checkDeprecatedClass.js";
import { checkDeprecatedId } from "./modules/checkDeprecated/checkDeprecatedId.js";
import { checkScriptTagsLocation } from "./modules/checkDeprecated/checkJsScripts.js";

export function checkDeprecated(document, filePath, errors) {
  if (!errors[filePath]) {
    errors[filePath] = [];
  }

  checkDeprecatedClass(document, filePath, errors);
  checkDeprecatedId(document, filePath, errors);
  checkScriptTagsLocation(document, filePath, errors);
}
