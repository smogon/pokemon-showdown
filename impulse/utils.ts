/*
* Pokemon Showdown
* Utilities
* @license MIT
*/

// Usage Impulse.serverName
Impulse.serverName = 'Impulse';

// Usage: Impulse.nameColor("username", true, true, room);
function nameColor(name: string, bold: boolean = false, userGroup: boolean = false, room: Room | null = null): string {
  const userId = toID(name);
  let userGroupSymbol = Users.globalAuth.get(userId) ? `<font color=#948A88>${Users.globalAuth.get(userId)}</font>` : "";
  const userName = Users.getExact(name) ? Chat.escapeHTML(Users.getExact(name).name) : Chat.escapeHTML(name);
  return (userGroup ? userGroupSymbol : "") + (bold ? "<b>" : "") + `<font color=${Impulse.hashColor(name)}>${userName}</font>` + (bold ? "</b>" : "");
}

Impulse.nameColor = nameColor;

// Usage Impulse.generateRandomString(10);
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

Impulse.generateRandomString = generateRandomString;

/**
 * Generates a themed HTML table for Pokemon Showdown
 * Note: Requires table-styles.css to be loaded
 * 
 * @param title - The title/heading for the table
 * @param headerRow - Array of header column names
 * @param dataRows - 2D array of table data rows
 * @returns HTML string of the complete table
 */
// Example usage:
// const tableHTML = generateThemedTable(
//   "Battle Statistics",
//   ["Pokemon", "Type", "Win Rate", "Usage"],
//   [
//     ["Garchomp", "Dragon/Ground", "68%", "High"],
//     ["Ferrothorn", "Grass/Steel", "72%", "Medium"],
//     ["Toxapex", "Poison/Water", "64%", "High"],
//     ["Landorus-T", "Ground/Flying", "71%", "Very High"]
//   ]
// );
function generateThemedTable(
  title: string,
  headerRow: string[],
  dataRows: string[][]
): string {
  let output = `<div class="themed-table-container">`;
  output += `<h3 class="themed-table-title">${title}</h3>`;
  output += `<table class="themed-table">`;
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
}

Impulse.generateThemedTable = generateThemedTable;
