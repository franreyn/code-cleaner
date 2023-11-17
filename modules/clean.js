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
					let elements = Array.from(this.querySelectorAll("span, h1, h2, h3, h4, h5, h6, p, strong, em, a, iframe"));
					let hasChanges = true;
					while (hasChanges) {
						hasChanges = false;
						elements.forEach((elem) => {
							if (elem.tagName.toLowerCase() === "iframe") {
								if (!elem.hasAttribute("src") || elem.getAttribute("src").trim() === "") {
									elem.remove();
								}
							} else {
									const iframe = elem.querySelector("iframe");
									if (iframe) {
										if (!iframe.hasAttribute("src") || iframe.getAttribute("src").trim() === "") {
											iframe.remove();
										} else if (elem.childNodes.length === 1 && elem.innerHTML.trim() === iframe.outerHTML) {
												elem.replaceWith(iframe.cloneNode(true));
													hasChanges = true;
										}
									} else if ((elem.textContent.trim() === "" || elem.textContent.trim() === "\xa0") && !elem.querySelector("iframe")) {
											elem.remove();
									}
							}
						});
						elements = Array.from(this.querySelectorAll("span, h1, h2, h3, h4, h5, h6, p, strong, em, iframe"));
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

			// add '.display-lg' to tables
			.pipe(
				dom(function () {
					const tables = this.querySelectorAll("table");
					return tables.forEach((table) => {
						if (!table.classList.contains("display-lg")) {
							table.classList.add("display-lg");
						}
					})
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
