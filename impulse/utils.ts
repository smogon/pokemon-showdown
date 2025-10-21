// Pokemon Showdown
// Utils Modules

// Reusable Table Function
export const generateThemedTable = (
  title: string,
  headerRow: string[],
  dataRows: string[][]
): string => {
  let output = '';
  output += `<div class="themed-table-container" style="max-width: 100%; max-height: 380px; overflow-y: auto;">\n`;
  output += `<h3 class="themed-table-title">${title}</h3>\n`;
  output += `<table class="themed-table" style="width: 100%; border-collapse: collapse;">\n`;
  output += `<tr class="themed-table-header">\n`;
  headerRow.forEach(header => {
    output += `<th>${header}</th>\n`;
  });
  output += `</tr>\n`;
  dataRows.forEach(row => {
    output += `<tr class="themed-table-row">\n`;
    row.forEach(cell => {
      output += `<td>${cell}</td>\n`;
    });
    output += `</tr>\n`;
  });
  output += `</table></div>\n`;
  return output;
};
