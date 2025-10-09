/*
* Pokemon Showdown
* Custom Colors
* @license MIT
*/

import * as crypto from 'crypto';
import https from 'https';
import { FS } from '../../lib';
import '../utils';

interface RGB {
  R: number;
  G: number;
  B: number;
}

interface CustomColors {
  [userid: string]: string;
}

const COLOR_LOG_PATH = 'logs/colors.txt';

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

let customColors: CustomColors = {};
try {
  const customColorsData = FS('impulse-db/customcolors.json').readIfExistsSync();
  if (customColorsData) {
    customColors = JSON.parse(customColorsData);
  }
} catch (e: any) {
  console.error('Error loading customcolors.json:', e);
}

const colorCache: Record<string, string> = {};
const STAFF_ROOM_ID = 'staff';

async function logColorAction(action: string, staff: string, target: string, details?: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} | Staff: ${staff} | Target: ${target}${details ? ` | ${details}` : ''}\n`;
    await FS(COLOR_LOG_PATH).append(logEntry);
  } catch (err) {
    console.error('Error writing to color log:', err);
  }
}

function nameColor(name: string): string {
  const id = toID(name);
  if (customColors[id]) return customColors[id];
  if (colorCache[id]) return colorCache[id];
  // Generate MD5 hash of the username
  const hash: string = crypto.createHash('md5').update(id).digest('hex');
  const H: number = parseInt(hash.substr(4, 4), 16) % 360; // Hue: 0 to 360
  const S: number = (parseInt(hash.substr(0, 4), 16) % 50) + 40; // Saturation: 40 to 89
  let L: number = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30); // Lightness: 30 to 49
  // Initial HSL to RGB conversion
  let { R, G, B } = HSLToRGB(H, S, L);
  // Luminance adjustments
  const lum: number = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722;
  let HLmod: number = (lum - 0.2) * -150;
  if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
  else if (HLmod < 0) HLmod /= 3;

  const Hdist: number = Math.min(Math.abs(180 - H), Math.abs(240 - H));
  if (Hdist < 15) {
    HLmod += (15 - Hdist) / 3;
  }
  L += HLmod;
  // Final HSL to RGB conversion
  let { R: r, G: g, B: b } = HSLToRGB(H, S, L);
  // Convert RGB to HEX format
  const toHex = (x: number): string => {
    const hex: string = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const finalColor: string = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  colorCache[id] = finalColor;
  return finalColor;
}

Impulse.hashColor = nameColor;

function HSLToRGB(H: number, S: number, L: number): RGB {
  let C: number = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
  let X: number = C * (1 - Math.abs((H / 60) % 2 - 1));
  let m: number = L / 100 - C / 2;
  let R1: number = 0, G1: number = 0, B1: number = 0;
  switch (Math.floor(H / 60)) {
    case 0: R1 = C; G1 = X; break;
    case 1: R1 = X; G1 = C; break;
    case 2: G1 = C; B1 = X; break;
    case 3: G1 = X; B1 = C; break;
    case 4: R1 = X; B1 = C; break;
    case 5: R1 = C; B1 = X; break;
  }
  return { R: R1 + m, G: G1 + m, B: B1 + m };
}

async function updateColor(): Promise<void> {
  try {
    // Write custom colors to JSON
    FS('impulse-db/customcolors.json').writeUpdate(() => JSON.stringify(customColors));
    
    // Generate new CSS
    let newCss: string = '/* COLORS START */\n';
    for (const name in customColors) {
      newCss += generateCSS(name, customColors[name]);
    }
    newCss += '/* COLORS END */\n';

    // Read existing CSS file
    const fileContent = await FS('config/custom.css').readIfExists();
    const file: string[] = fileContent ? fileContent.split('\n') : [];
    
    // Remove old color section if it exists
    const start: number = file.indexOf('/* COLORS START */');
    const end: number = file.indexOf('/* COLORS END */');
    if (start !== -1 && end !== -1) {
      file.splice(start, (end - start) + 1);
    }
    
    // Write updated CSS
    FS('config/custom.css').writeUpdate(() => file.join('\n') + newCss);
    
    // Trigger CSS reload on the server
    Impulse.reloadCSS();
  } catch (e: any) {
    console.error('Error updating colors:', e);
  }
}

function generateCSS(name: string, color: string): string {
  const id: string = toID(name);
  let css: string = `[class$="chatmessage-${id}"] strong, [class$="chatmessage-${id} mine"] strong, [class$="chatmessage-${id} highlighted"] strong, [id$="-userlist-user-${id}"] strong em, [id$="-userlist-user-${id}"] strong, [id$="-userlist-user-${id}"] span`;
  css += `{\n  color: ${color} !important;\n}\n`;
  return css;
}

function validateHexColor(color: string): boolean {
  // Check if color is a valid hex format (#XXX or #XXXXXX)
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
}

export const commands: Chat.ChatCommands = {
  customcolor: {
    ''(target, room, user) {
      this.parse(`/customcolorhelp`);
    },
    
    async set(target: string, room: ChatRoom, user: User): Promise<void> {
      this.checkCan('globalban');
      const targets: string[] = target.split(',').map(t => t.trim());
      if (!targets[1]) return this.parse('/customcolorhelp');
      
      const targetId = toID(targets[0]);
      if (targetId.length > 19) return this.errorReply("Usernames are not this long...");
      
      const color = targets[1];
      if (!validateHexColor(color)) {
        return this.errorReply("Invalid hex color format. Use #RGB or #RRGGBB format.");
      }
      
      customColors[targetId] = color;
      await updateColor();
      
      // Log the action
      await logColorAction('SET', user.name, targetId, `Color: ${color}`);
      
      this.sendReply(`|raw|You have given <b><font color="${color}">${Chat.escapeHTML(targets[0])}</font></b> a custom color.`);

      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} set custom color for ${Impulse.nameColor(targets[0], true, false)} to ${color}.</div>`).update();
      }
    },

    async delete(target, room, user): Promise<void> {
      this.checkCan('globalban');
      if (!target) return this.parse('/customcolorhelp');
      const targetId: string = toID(target);
      if (!customColors[targetId]) return this.errorReply(`/customcolor - ${target} does not have a custom color.`);
      
      const oldColor = customColors[targetId];
      delete customColors[targetId];
      await updateColor();
      
      // Log the action
      await logColorAction('DELETE', user.name, targetId, `Removed color: ${oldColor}`);
      
      this.sendReply(`You removed ${target}'s custom color.`);
      const targetUser: User | null = Users.get(target);
      if (targetUser && targetUser.connected) {
        targetUser.popup(`${user.name} removed your custom color.`);
      }

      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed custom color for ${Impulse.nameColor(target, true, false)}.</div>`).update();
      }
    },

    preview(target, room, user) {
      if (!this.runBroadcast()) return;
      const targets: string[] = target.split(',').map(t => t.trim());
      if (!targets[1]) return this.parse('/customcolorhelp');
      
      const color = targets[1];
      if (!validateHexColor(color)) {
        return this.errorReply("Invalid hex color format. Use #RGB or #RRGGBB format.");
      }
      
      return this.sendReplyBox(`<b><font size="3" color="${color}">${Chat.escapeHTML(targets[0])}</font></b>`);
    },

    async reload(target: string, room: ChatRoom, user: User): Promise<void> {
      this.checkCan('globalban');
      await updateColor();
      
      // Log the reload action
      await logColorAction('RELOAD', user.name, 'N/A', 'CSS reloaded');
      
      this.privateModAction(`(${user.name} has reloaded custom colours.)`);
    },

    async logs(target, room, user) {
      this.checkCan('globalban');
      
      try {
        const logContent = await FS(COLOR_LOG_PATH).readIfExists();
        
        if (!logContent) {
          return this.sendReply('No color logs found.');
        }
        
        const lines = logContent.trim().split('\n');
        const numLines = parseInt(target) || 50;
        
        if (numLines < 1 || numLines > 500) {
          return this.errorReply('Please specify a number between 1 and 500.');
        }
        
        // Get the last N lines and reverse to show latest first
        const recentLines = lines.slice(-numLines).reverse();
        
        let output = `<div class="ladder pad"><h2>Color Logs (Last ${recentLines.length} entries - Latest First)</h2>`;
        output += `<div style="max-height: 370px; overflow: auto; font-family: monospace; font-size: 11px;">`;
        
        // Add each log entry with a horizontal line separator
        for (let i = 0; i < recentLines.length; i++) {
          output += `<div style="padding: 8px 0;">${Chat.escapeHTML(recentLines[i])}</div>`;
          if (i < recentLines.length - 1) {
            output += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 0;">`;
          }
        }
        
        output += `</div></div>`;
        
        this.sendReply(`|raw|${output}`);
      } catch (err) {
        console.error('Error reading color logs:', err);
        return this.errorReply('Failed to read color logs.');
      }
    },
  },

   customcolorhelp(target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReplyBox(
         `<div><b><center>Custom Color Commands</center></b><br>` +
         `<ul>` +
         `<li><code>/customcolor set [user], [hex]</code> - Gives [user] a custom color of [hex]</li>` +
         `<li><code>/customcolor delete [user]</code> - Deletes a user's custom color</li>` +
         `<li><code>/customcolor reload</code> - Reloads colors</li>` +
         `<li><code>/customcolor preview [user], [hex]</code> - Previews what that username looks like with [hex] as the color</li>` +
         `<li><code>/customcolor logs [number]</code> - View recent color log entries (default: 50, max: 500)</li>` +
         `</ul>` +
         `<small>All commands except preview require @ or higher permission.</small>` +
         `</div>`
      );
   },
  
   '!hex': true,
   hex(target, room, user) {
      if (!this.runBroadcast()) return;
      const targetUser: string = target ? target : user.name;
      const color: string = nameColor(targetUser);
      this.sendReplyBox(`The hex code of ${Impulse.nameColor(targetUser, true, true)} is: <font color="${color}"><b>${color}</b></font>`);
   },
};
