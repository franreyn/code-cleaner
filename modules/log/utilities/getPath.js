export const getPath = (node) => {
  let path = [];
  let parentNode = node.parentElement;  

  while (parentNode && parentNode.nodeType === 1) {  // Only traverse element nodes
    let tagName = parentNode.tagName.toLowerCase();
    let id = parentNode.id ? `#${parentNode.id}` : '';  // Check if there's an id
    let classes = parentNode.classList.length ? `.${parentNode.classList[0]}` : '';  // Use only the first class

    // Prioritize id, then class, then tag name
    let nodePath = id || classes || tagName;

    path.unshift(nodePath);  // Add the node to the front of the array (top to bottom)
    parentNode = parentNode.parentElement;  // Move up to the parent element
  }

  // Remove 'html' from the base of the path if it's present
  if (path[0] === 'html') {
    path.shift(); 
  }

  // Return the path as a string
  return path.join(' > ');
};
