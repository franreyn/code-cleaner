export function checkDeprecatedClass(document, filePath, errors) {
  const deprecatedClasses = ["main", "main-two-column", "sidebar", "video-container"];

  deprecatedClasses.forEach(deprecatedClass => {
    const elements = document.getElementsByClassName(deprecatedClass);
    if (elements.length > 0) {
      errors[filePath].push(`Contains deprecated class (${deprecatedClass})`);
    }
  });
}
