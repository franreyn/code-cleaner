import { domTransform } from "../hooks/domTransform.js";
import { config } from "../../config.js";

export function removeJQueryScript() {
	return domTransform((document) => {
		const elements = document.querySelectorAll(config.jQueryScriptSelector);
		elements.forEach((el) => el.remove());
	});
}
