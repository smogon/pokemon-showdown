/* Utility Functions
* Credits: Unknown
* Updates & Typescript Conversion:
* Prince Sky.
*/

import https from 'https';

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

// Usage: Impulse.reloadCSS();
function reloadCSS(): void {
  const cssPath = 'impulse'; // Default value if Config.serverid is not provided.
  const serverId = Config.serverid || cssPath; // Use Config.serverid if available.
  const url = `https://play.pokemonshowdown.com/customcss.php?server=${serverId}`;
  const req = https.get(url, (res) => {
    console.log(`CSS reload response: ${res.statusCode}`);
  });
  req.on('error', (err) => {
    console.error(`Error reloading CSS: ${err.message}`);
  });
  req.end();
}

Impulse.reloadCSS = reloadCSS;

// Used by /clearall & /globalclearall - do not use manually.
function clearRooms(rooms: Room[], user: User): string[] {
  const clearedRooms: string[] = [];
  for (const room of rooms) {
    if (!room) continue;
    if (room.log.log) {
      room.log.log.length = 0;
    }
    const userIds = Object.keys(room.users) as ID[];
    for (const userId of userIds) {
      const userObj = Users.get(userId);
      if (userObj?.connections?.length) {
        for (const connection of userObj.connections) {
          userObj.leaveRoom(room, connection);
        }
      }
    }
    clearedRooms.push(room.id);
    setTimeout(() => {
      for (const userId of userIds) {
        const userObj = Users.get(userId);
        if (userObj?.connections?.length) {
          for (const connection of userObj.connections) {
            userObj.joinRoom(room, connection);
          }
        }
      }
    }, 1000);
  }
  return clearedRooms;
}

Impulse.clearRooms = clearRooms;

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

// Used By Rank Ladders, Shop And More: /shop /richestusers, /expladder, /economylogs
function generateThemedTable(
  title: string,
  headerRow: string[],
  dataRows: string[][],
  styleBy?: string
): string {
  let output = `<div class="themed-table-container" style="max-width: 100%; overflow-x: auto;">`; // Added overflow-x: auto here
  output += `<h3 class="themed-table-title">${title}</h3>`;
  if (styleBy) {
    output += `<p class="themed-table-by">Style By ${styleBy}</p>`;
  }
  output += `<table class="themed-table" style="width: 100%; border-collapse: collapse;">`; // Added border-collapse for better visual
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
