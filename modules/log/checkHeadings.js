import { logError } from "./utilities/logError.js"

export function checkHeadings(document, filePath, errors) {
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let previousLevel = 0;
  let h1Count = 0;
  const h1Check = document.querySelector("h1");

  // Check if <h1> is present as the document title and <h2> follows
  if (headings.length && h1Check && headings[0].tagName !== "H1") {
    logError(document, "Invalid heading structure (document must start with an <h1> heading).", filePath, errors);
  } else if (!headings.length) {
    logError(document, "Invalid heading structure (no headings found).", filePath, errors);
  } else if (headings.length && !h1Check) {
    logError(document, "Invalid heading structure (no <h1> heading found).", filePath, errors);
  }

  // Loop through each heading and check for errors
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);

    // Check if there are more than two <h1> headings
    if (level === 1) {
      h1Count++;
      if (h1Count > 1) {
        logError(document, "Invalid heading structure (more than one <h1> heading found).", filePath, errors);
      }
    }

    // Check if heading levels skip (e.g., <h2> followed directly by <h4>)
    if (level > previousLevel + 1 && previousLevel !== 0) {
      logError(document, `Invalid heading structure (<${heading.tagName.toLowerCase()}> found after <h${previousLevel}>).`, filePath, errors);
    }

    // Update previousLevel to current heading level
    previousLevel = level;
  });
}
