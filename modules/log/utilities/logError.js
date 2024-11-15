import { getPath } from './getPath.js';

// Error handler that automatically appends the path
export const logError = (node, message, filePath, errors) => {
  const path = getPath(node);  // Get the path of the node
  let errorMessage = message;

  // Only append the path if it's not empty
  if (path) {
    errorMessage += ` \n   (${path})`;  // Append path if it's not an empty string
  }

  // Ensure errors[filePath] exists
  if (!errors[filePath]) {
    errors[filePath] = [];
  }

  errors[filePath].push(errorMessage);
};
