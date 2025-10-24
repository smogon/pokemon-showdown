/*
* Pokemon Showdown
* Utility Module
*/

/**
 * Generates a themed HTML table with title and data
 * @param title - Table title to display
 * @param headerRow - Array of header column names
 * @param dataRows - 2D array of data cells
 * @returns HTML string containing the themed table
 */
export const generateThemedTable = (
  title: string,
  headerRow: string[],
  dataRows: string[][]
): string => {
  let output = '';
  output += `<div class="themed-table-container" style="max-width: 100%; max-height: 380px; overflow-y: auto;">`;
  output += `<h3 class="themed-table-title">${title}</h3>`;
  output += `<table class="themed-table" style="width: 100%; border-collapse: collapse;">`;
  output += `<tr class="themed-table-header">`;
  headerRow.forEach(header => {
    output += `<th>${header}</th>`;
  });
  output += `</tr>`;
  dataRows.forEach(row => {
    output += `<tr class="themed-table-row">`;
    row.forEach(cell => {
      output += `<td>${cell}</td>`;
    });
    output += `</tr>`;
  });
  output += `</table></div>`;
  return output;
};
