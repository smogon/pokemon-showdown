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

function updateColor(): void {
  FS('impulse-db/customcolors.json').writeUpdate(() => JSON.stringify(customColors));
  let newCss: string = '/* COLORS START */\n';
  for (const name in customColors) {
    newCss += generateCSS(name, customColors[name]);
  }
  newCss += '/* COLORS END */\n';

  const file: string[] = FS('config/custom.css').readIfExistsSync().split('\n');
  const start: number = file.indexOf('/* COLORS START */');
  const end: number = file.indexOf('/* COLORS END */');
  if (start !== -1 && end !== -1) {
    file.splice(start, (end - start) + 1);
  }
  FS('config/custom.css').writeUpdate(() => file.join('\n') + newCss);
  Impulse.reloadCSS();
}

function generateCSS(name: string, color: string): string {
  const id: string = toID(name);
  let css: string = `[class$="chatmessage-${id}"] strong, [class$="chatmessage-${id} mine"] strong, [class$="chatmessage-${id} highlighted"] strong, [id$="-userlist-user-${id}"] strong em, [id$="-userlist-user-${id}"] strong, [id$="-userlist-user-${id}"] span`;
  css += `{\n  color: ${color} !important;\n}\n`;
  return css;
}

export const commands: Chat.ChatCommands = {
  customcolor: {
    ''(target, room, user) {
      this.parse(`/customcolorhelp`);
    },
    
    set(target: string, room: ChatRoom, user: User): void {
      this.checkCan('globalban');
      const targets: string[] = target.split(',').map(t => t.trim());
      if (!targets[1]) return this.parse('/customcolorhelp');
      const targetId = toID(targets[0]);
      if (targetId.length > 19) return this.errorReply("Usernames are not this long...");
      this.sendReply(`|raw|You have given <b><font color="${targets[1]}">${Chat.escapeHTML(targets[0])}</font></b> a custom color.`);
      this.modlog(`CUSTOMCOLOR`, targets[0], `gave color ${targets[1]}`);
      customColors[targetId] = targets[1];
      updateColor();

      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} set custom color for ${Impulse.nameColor(targets[0], true, false)} to ${targets[1]}.</div>`).update();
      }
    },

    delete(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.parse('/customcolorhelp');
      const targetId: string = toID(target);
      if (!customColors[targetId]) return this.errorReply(`/customcolor - ${target} does not have a custom color.`);
      delete customColors[targetId];
      updateColor();
      this.sendReply(`You removed ${target}'s custom color.`);
      this.modlog(`CUSTOMCOLOR`, target, `removed custom color`);
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
      return this.sendReplyBox(`<b><font size="3" color="${targets[1]}">${Chat.escapeHTML(targets[0])}</font></b>`);
    },

    reload(target: string, room: ChatRoom, user: User): void {
      this.checkCan('globalban');
      updateColor();
      this.privateModAction(`(${user.name} has reloaded custom colours.)`);
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
