// Configuration for Code Cleaner
export const config = {

	// Array of tags to remove, leaving content intact when located inside a content body
	innerContentBodyTagsToRemove : ["header", "footer"],

	// Array of nested elements that 
	elementsShouldNotBeNested: [".content-body", "header"],

	// Array of content sections 
	contentSections: ["content-wrapper", "first-column", "second-column", "third-column"],

	// Array of the classes that should be applied to vertical tables
	vertTableClasses: ["vert-table", "display-vertical", "display-vert"],

  // Array of iframe titles that should be logged
  titlesToCheck: ["YouTube video player"],

  // Array of urls to skip when found within an iframe - this is a common placeholder for YouTube videos and should not be logged
  iframesToExclude: ["https://www.youtube.com/embed/NpEaa2P7qZI?si=DFcFec4auMcyTLXX"],

	// Array of elements that should have their 'style' attributes removed
	noStyleElements: ["body, div, span, bold, em"],

	// Remove 'style' attributes from specified elements
	styleRemoval: "style",

	// Array of elements to remove from the image tags
	imageAttributesToRemove: [
		"decoding",
		"fetchpriority",
		"height",
		"loading",
		"srcset",
		"style",
		"sizes",
		"width"
	], 

	// Table elements to clean
	tableElementsSelector: "table, thead, tbody, tfoot, tr, th, td",

	// Table
	tableSelector: "table",

	// thead selector
	theadSelector: "thead",

	// table row selector
	trSelector: "tr",

	// th scope selector
	scopeSelector: "th[scope=\'col\']",

	// Array of table attributes to remove
	tableAttributesToRemove: ["cellspacing", "cellpadding", "width", "style"],

	// Text elements to clean
	textElementsSelector: "h1, h2, h3, h4, h5, h6, p, ul, ol, li, dl, dt, dd", 

	// Heading elements to clean
	headingSelectors: "h1, h2, h3, h4, h5, h6",
	
	// Array of text attributes to remove
	textAttributesToRemove: ["width", "style"],

	// JQuery script to remove
	jQueryScriptSelector: "script[src='https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js']",

	// Selector for elements with role="presentation"
	rolePresentationSelector: "[role='presentation']",

	// Remove role attribute
	roleAttributeToRemove: "role",

	// html selector
	htmlSelector: "html",

	// lang selector
	langSelector: "lang",

	// en value for lang attribute selector
	langEnValue: "en",

	// Content body selector
	contentBodySelector: ".content-body",

	// Script selector
	scriptSelector: "script",

	// Content wrapper selector
	contentWrapperSelector: "div#content-wrapper",

	// First column selector
	firstColumnSelector: "div#first-column",

	// h1 selector
	h1Selector: "h1",

	// title selector
	titleSelector: "title",

	// target selectors
	targetSelectors: "[target='_self'], [target='_new']",

	// Remove target attribute 
	targetAttributeToRemove: "target",

	// Image selector
	imageSelector: "img",

	// Figure selector
	figureSelector: "figure",

	// Figcaption selector
	figcaptionSelector: "figcaption",

	// Alt selector
	altSelector: "alt",

	// Paragraph selector
	paragraphSelector: "p",

	// Div selector 
	divSelector: "div",

	// ID selector
	idSelector: "id",

	// iframe selectr
	iframeSelector: "iframe",

	// source selector
	sourceSelector: "src",

	// media selector
	mediaObjectSelector: "media-object",

	// media container selector
	mediaContainerSelector: "media-container",

	// media info selector
	mediaInfoSelector: "media-info",

	// header selector
	headerSelector: "header",

	// header class selector
	headerClassSelector: "header.header",

	// head selector
	headSelector: "head",

	// Syllabus selector
	syllabusSelector: "syllabus",

	// h5p video selector
	h5pUrlSelector: [
		"/d2l/common/dialogs/quickLink",
		"https://pima.h5p.com/content",
		"h5p"
	], 

	// iframe checks for youtube and panopto
	iframeUrlCheck: [
		"https://www.youtube.com",
		"https://pima-cc.hosted.panopto.com",
	],

  // h5p url
	h5pUrlStarting: "https://pima.h5p.com",

	// Panopto iframe selector
	panoptoIframeSelector: "iframe[src*='rcode=PIMA']",

	// Depricated classes
	deprecatedClasses: ["main", "main-two-column", "sidebar", "video-container"],

	// Display lg class
	displayLgClass: "display-lg",

};

export const errorMessages = {

	// Panopto iframe 
  invalidPanoptoIframe: "Invalid iframes detected (panopto iframe not wrapped by '.media-container' and/or '.media-object')",

	// invalid iframe title message
	iframeTitleErrorMessage: `Invalid iframes detected (incorrect title attribute: "{str}".)`,

	// header alt title message
	headerAltTitleErrorMessage: "Invalid header <img> element (missing alt attribute).",

	// Alt text error message for non-figure images
	nonFigureAltErrorMessage: "An <img> element is missing its alt attribute (and is not part of a <figure> with a <figcaption>)",

	// Alt text error message for figure images
	figureAltTextErrorMesage: "An <img> within a <figure> element is missing its alt attribute",

	// Unnecessary attribute error message
	unnecessaryAttributeErrorMessage: `An <img> element contains the unnecessary attribute: {attribute}`,

	// Paragraph wrapper error message
	paragraphWrapperErrorMessage: "An <img> element is wrapped in a <p> tag.",

	// iframe error message
	h5pIframeErrorMessage: "Invalid iframes detected (h5p iframe not contained within \'div\' tag)",

	// iframe errr message
	iframeErrorMessage: "Invalid iframes detected (not contained within \'.media-container\')",

	// iframe media wrapper message
	iframeWrapperErrorMessage: "Invalid iframe detected (not wrapped by \'.media-container\' and/or \'.media-object\').",

	// invalid panopto iframe message
	invalidPanoptoIframeWrapperErrorMessage: "Invalid iframes detected (panopto iframe not wrapped by '.media-container' and/or '.media-object').",

	// nested elements error message
	nestedContentBodyElement: "An invalid '{nestedElement}' is nested within a '.content-body'",

	// Deprecated class error message
	deprecatedClassErrorMessage: "Contains deprecated class ({deprecatedClass})",

	// Deprecated id error message
	deprecatedIdErrorMessage: "Contains deprecated id ({deprecatedId})",

	// Invalid JS placement error message
	invalidJsPlacementErrorMessage: "Invalid JS placement (a <script> element is located outside the <head> section)",

	// Missing content wrapper error message
	missingContentWrappperFirstColumnErrorMessage: "Missing '#content-wrapper' or '#first-column'",

	// Missing doctype error message
  missingDoctypeErrorMessage: "Missing <!DOCTYPE html>",

	// Missing html lang error message
	missingLangAttributeErrorMessage: "Missing <html lang='en'>",

	// Missing jQuery script error message
	missingJQueryScriptErrorMessage: "Head contains deprecated jquery script",

	// Missing header error message
	missingHeaderClassErrorMessage: "Missing <header class='header'></div>",

	// Document must start with an <h1> heading error message
	missingH1ErrorMessage: "Invalid heading structure (document must start with an <h1> heading).",

	// No headings found error message
	noHeadingsFoundErrorMessage: "Invalid heading structure (no headings found).",

	// No h1 heading found error message
	noH1HeadingFoundErrorMessage: "Invalid heading structure (no <h1> heading found).",

	// Multiple h1 headings found error message
	multipleH1HeadingsErrorMessage: "Invalid heading structure (more than one <h1> heading found).",

	// Table does not contain .display-lg class error message
	displayLgClassErrorMessage: "A table does not contain \'.display-lg\'", 

	// Table does not container 
  misssingScopeErrorMessage: "A table does not contain the correct structure (missing <th scope=\'col\'> within <thead>)",

	// Table missing tr
	missingTrErrorMessage: "A table does not contain the correct structure (missing <tr> within <thead>)",

	// Missing thead error message
	missingTheadErrorMessage: "A table does not contain the correct structure (missing <thead>)",

	// Title and h1 do not match error message
	titleAndH1MismatchErrorMessage: "<title> and <h1> do not match",

	// Missing title element error message
	missingTitleErrorMessage: "Missing <title> element",

	// Not valid content body error message
	contentBodyNotValidErrorMessage: "A 'content-body' is not inside #content-wrapper, #second-column, or #third-column",
}
