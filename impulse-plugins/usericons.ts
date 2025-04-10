/* User Icons Commands
 * Credits: Lord Haji, panpawn
 * Updates & Typescript Conversion:
 * Prince Sky
 */

import { FS } from '../lib/fs';

// Change this to match your own userlist background color.
const backgroundColor = `rgba(17, 72, 79, 0.6)`;

interface Icons {
  [userid: string]: string;
}

let iconsData = FS('impulse-db/usericons.json').readIfExistsSync();
let icons: Icons = {};

const STAFF_ROOM_ID = 'staff';

if (iconsData) {
  try {
    icons = JSON.parse(iconsData);
  } catch (e: any) {
    console.error(`Failed to parse impulse-db/usericons.json: ${e.message}`);
    icons = {};
  }
}

function updateIcons() {
  FS('impulse-db/usericons.json').writeUpdate(() => (
    JSON.stringify(icons)
  ));

  let newCss = '/* ICONS START */\n';

  for (const name in icons) {
    newCss += generateCSS(name, icons[name]);
  }
  newCss += '/* ICONS END */\n';

  let file = FS('config/custom.css').readIfExistsSync().split('\n');
  const start = file.indexOf('/* ICONS START */');
  const end = file.indexOf('/* ICONS END */');
  if (start !== -1 && end !== -1) {
    file.splice(start, (end - start) + 1);
  }
  FS('config/custom.css').writeUpdate(() => (
    file.join('\n') + newCss
  ));
  Impulse.reloadCSS();
}

function generateCSS(name: string, icon: string): string {
  const id = toID(name);
  return `[id$="-userlist-user-${id}"] {\n\tbackground: ${backgroundColor} url("${icon}") right no-repeat !important;\n}\n`;
}

export const commands: ChatCommands = {
  usericon: 'icon',
  icon: {
    set(target: string, room: Room, user: User) {
      this.checkCan('globalban');
      const parts = target.split(',').map(p => p.trim());
      if (parts.length !== 2) return this.parse('/help icon');
      const targetUser = toID(parts[0]);
      const imageUrl = parts[1];
      if (targetUser.length > 19) return this.errorReply('Usernames are not this long...');
      if (icons[targetUser]) return this.errorReply('This user already has a custom userlist icon. Do /icon delete [user] and then set their new icon.');
      this.sendReply(`|raw|You have given ${Impulse.nameColor(parts[0], true, false)} an icon.`);
      const targetUserObj = Users.get(targetUser);
      if (targetUserObj?.connected) {
        targetUserObj.popup(`|html|${Impulse.nameColor(user.name, true, true)} has set your userlist icon to: <img src="${imageUrl}" width="32" height="32"><br /><center>Refresh, If you don't see it.</center>`);
      }
      icons[targetUser] = imageUrl;
      updateIcons();

      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} set icon for ${Impulse.nameColor(parts[0], true, false)}: <img src="${imageUrl}" width="32" height="32"></div>`).update();
      }
    },

    remove: 'delete',
    delete(target: string, room: Room, user: User) {
      this.checkCan('globalban');
      const targetUser = toID(target);
      if (!icons[targetUser]) return this.errorReply(`/icon - ${target} does not have an icon.`);
      const originalName = Object.keys(icons).find(key => toID(key) === targetUser) || targetUser;
      delete icons[targetUser];
      updateIcons();
      this.sendReply(`You removed ${originalName}'s icon.`);
      const targetUserObj = Users.get(targetUser);
      if (targetUserObj?.connected) {
        targetUserObj.popup(`|html|${Impulse.nameColor(user.name, true, true)} has removed your userlist icon.`);
      }

      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed icon for ${Impulse.nameColor(originalName, true, false)}.</div>`).update();
      }
    },

    '': 'help',
    help(target, room, user) {
      this.parse('/iconhelp');
    },
  },

  iconhelp: [
    `Commands for /icon are:`,
    `/icon set [user],\t[image url] - Gives [user] an icon of [image url] ( Requires: @ and higher ).`,
    `/icon delete [user] - Deletes a user's icon ( Requires: @ and higher ).`,
  ],
};
