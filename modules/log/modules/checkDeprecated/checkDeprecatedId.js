export function checkDeprecatedId(document, filePath, errors) {
  const deprecatedIds = ["main", "main-two-column", "sidebar", "video-container"];

  deprecatedIds.forEach(deprecatedId => {
    if (document.getElementById(deprecatedId)) {
      errors[filePath].push(`Contains deprecated id (${deprecatedId})`);
    }
  });
}
