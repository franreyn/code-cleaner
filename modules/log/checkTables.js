export function checkTables(document, filePath, errors) {
  // Get all tables from the document
  let tables = document.querySelectorAll('table');

  // Check each table
  tables.forEach(table => {

    // Check the structure of the table
    let thead = table.querySelector('thead');
    if (thead) {
      let tr = thead.querySelector('tr');
      if (tr) {
        if (tr.querySelectorAll('th[scope=\'col\']').length === 0) {
          if (!errors[filePath]) {
            errors[filePath] = [];
          }
          errors[filePath].push('A table does not contain the correct structure (missing <th scope=\'col\'> within <thead>)');
        }
      } else {
        if (!errors[filePath]) {
          errors[filePath] = [];
        }
        errors[filePath].push('A table does not contain the correct structure (missing <tr> within <thead>)');
      }
    } else {
      if (!errors[filePath]) {
        errors[filePath] = [];
      }
      errors[filePath].push('A table does not contain the correct structure (missing <thead>)');
    }
  });
}
