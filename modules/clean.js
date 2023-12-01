import gulp from "gulp";
import dom from "gulp-dom";
import beautify from "gulp-jsbeautifier";

export function clean() {
	gulp.task("clean", async () => {
		gulp
			.src("_input/**/*.{html,htm}")

			// remove empty elements and those that only contain &nbsp;
			.pipe(
				dom(function () {

					// create array with all the listed elements
					let elements = Array.from(this.querySelectorAll("span, h1, h2, h3, h4, h5, h6, p, strong, em, a, iframe, ul, li, div, ol, img"));

					// hasChanges boolean is to make sure the while loop runs at least once
					let hasChanges = true;

					// use while loop to keep checking if changes need to be made until there are no more changes to be made
					while (hasChanges) {
						hasChanges = false;

						// run elements through forEach, if element is an iframe or img and doesn't have an existing src attr, remove it
						elements.forEach((elem) => {
							if (elem.tagName.toLowerCase() === "iframe" || elem.tagName.toLowerCase() === "img") {
								if (!elem.hasAttribute("src") || elem.getAttribute("src").trim() === "") {
									elem.remove();
								}
							} else {

								// if element has a child that's an iframe or img without a src attr, remove it
									const child = elem.querySelector("iframe, img");
									if (child) {
										if (!child.hasAttribute("src") || child.getAttribute("src").trim() === "") {
											child.remove();
										} 

										// if an element's child is an iframe or img and has a src, replace the parent with the iframe or img (i.e. delete the parent but keep the child)
										else if (elem.childNodes.length === 1 && elem.innerHTML.trim() === child.outerHTML) {
											elem.replaceWith(child.cloneNode(true));
												hasChanges = true;
										}
									}

									// if element doesn't have a child that's an iframe or img and has no text content or there are only spaces inside remove it
									else if ((elem.textContent.trim() === "" || elem.textContent.trim() === "\xa0" || elem.textContent.trim() === " ") && !elem.querySelector("iframe, img")) {
										elem.remove();
									}
							}
						});
						elements = Array.from(this.querySelectorAll("span, h1, h2, h3, h4, h5, h6, p, strong, em, iframe, ul, li, div, ol, img"));
					}
				})
			)

      // remove 'width' and 'style' attributes from text elements
			.pipe(
				dom(function () {
					const discardTextAttributes = (textElement, ...attributes) => attributes.forEach((attribute) => textElement.removeAttribute(attribute));
					return this.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol, li, dl, dt, dd").forEach((elem) => discardTextAttributes(elem, "width", "style"));
				})
			)

      // remove 'style' attributes from elements
			.pipe(
				dom(function () {
					const discardElemAttributes = (element, ...attributes) => attributes.forEach((attribute) => element.removeAttribute(attribute));
					return this.querySelectorAll("body, div, span, bold, em").forEach((elem) => discardElemAttributes(elem, "style"));
				})
			)

      // remove "cellspacing", "cellpadding", "width", "style" attributes from table elements
			.pipe(
				dom(function () {
					const discardTableAttributes = (tableElement, ...tableAttributes) => tableAttributes.forEach((tableAttribute) => tableElement.removeAttribute(tableAttribute));
					return this.querySelectorAll("table, thead, tbody, tfoot, tr, th, td").forEach((tableElem) => discardTableAttributes(tableElem, "cellspacing", "cellpadding", "width", "style"));
				})
			)

      // remove '[target="_self"], [target="_new"]' from any element
			.pipe(
				dom(function () {
					const discardTargetSelf = (element, ...attributes) => attributes.forEach((attribute) => element.removeAttribute(attribute));
					return this.querySelectorAll('[target="_self"], [target="_new"]').forEach((tableElem) => discardTargetSelf(tableElem, "target"));
				})
			)

      // remove '[role="presentation"]' from any element
			.pipe(
				dom(function () {
					const discardRolePres = (element, ...attributes) => attributes.forEach((attribute) => element.removeAttribute(attribute));
					return this.querySelectorAll('[role="presentation"]').forEach((tableElem) => discardRolePres(tableElem, "role"));
				})
			)

			// remove script tags not in <head>
			.pipe(
				dom(function () {
					const scripts = Array.from(this.querySelectorAll("body script"));
					scripts.forEach((script) => {
						script.remove();
					});
				})
			)

      // beautify code
			.pipe(
				beautify({
					indent_size: 2,
					wrap_attributes: false,
					extra_liners: [],
					preserve_newlines: false,
				})
			)

      // report what was beautified
			.pipe(beautify.reporter())

      // output files
			.pipe(gulp.dest("_output"));
	});

  gulp.task("copy", async () => {
    gulp.src(["_input/**/*", "!_input/**/*.{html,htm}"])
      .pipe(gulp.dest("_output"));
  });

  gulp.task("clean-copy", gulp.series("clean", "copy"));

}
