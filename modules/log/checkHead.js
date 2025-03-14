import "./modules/checkHead/checkDoctype.js";
import "./modules/checkHead/checkHtmlLang.js";
import "./modules/checkHead/checkJquery.js";

// Functions
export const checkHead = (document, filePath, errors) => {
	checkDoctype(document, filePath, errors);
	checkHtmlLang(document, filePath, errors);
	checkJquery(document, filePath, errors);
}