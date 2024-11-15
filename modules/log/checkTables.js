import { config } from '../../config.js';
import { logError } from "./utilities/logError.js"

const vertTableClasses = config.vertTableClasses;

export function checkTables(document, filePath, errors) {
  // Get all tables from the document
  let tables = document.querySelectorAll('table');

  // Check each table
  tables.forEach(table => {
    // Check if the table has the 'display-lg' class and is missing a vertical table class
    if (!table.classList.contains('display-lg') && !vertTableClasses.some(className => table.classList.contains(className))) {
      logError(table, 'A table does not contain \'.display-lg\' or any vertical table class', filePath, errors);
    }

    // Check the structure of the table
    let thead = table.querySelector('thead');
    if (thead) {
      let tr = thead.querySelector('tr');
      if (tr && tr.querySelectorAll('th[scope="col"]').length === 0) {
        logError(table, 'A table does not contain the correct structure (missing <th scope="col"> within <thead>)', filePath, errors);
      }
    } else if (vertTableClasses.some(className => table.classList.contains(className))) {
      // Skip this check for vertical tables as they might not require a <thead>
    } else {
      logError(table, 'A table does not contain the correct structure (missing <thead>)', filePath, errors);
    }
  });
}
