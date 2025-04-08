/* Custom Avatars Commands
 * Credits: CreaturePhil And Others
 * Updates & Typescript Conversion: Prince Sky
 */

import { FS } from '../lib/fs';

const AVATAR_PATH: string = 'config/avatars/';
const STAFF_ROOM_ID = 'staff'; // Replace 'staff' with your staff room ID
const VALID_EXTENSIONS: string[] = ['.jpg', '.png', '.gif'];

async function downloadImage(image_url: string, name: string, extension: string): Promise<void> {
  try {
    const response: Response = await fetch(image_url);
    if (!response.ok) return;
    const contentType: string | null = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) return;
    const buffer: ArrayBuffer = await response.arrayBuffer();
    await FS(AVATAR_PATH + name + extension).write(Buffer.from(buffer));
  } catch (err: any) {
    console.error(err);
  }
}

function getExtension(filename: string): string {
  const lastDotIndex: number = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return filename.slice(lastDotIndex);
}

function loadCustomAvatars(): void {
  FS(AVATAR_PATH).readdir().then((files: string[] | null) => {
    if (!files) files = [];
    files
      .filter((file: string) => VALID_EXTENSIONS.includes(getExtension(file)))
      .forEach((file: string) => {
        const ext: string = getExtension(file);
        const name: string = file.slice(0, file.length - ext.length);
        if (!Config.customavatars) Config.customavatars = {};
        Config.customavatars[name] = file;
      });
  }).catch((err: any) => {
    console.log(`Error loading custom avatars: ${err}`);
  });
}

loadCustomAvatars();

export const commands: Chat.ChatCommands = {
  customavatar: {
    set: async function (this: CommandContext, target: string, room: ChatRoom | null, user: User): Promise<void> {
      this.checkCan('bypassall');
      const parts: string[] = target.split(',').map((param: string) => param.trim());
      if (parts.length < 2) return this.parse(`/help customavatar`);
      const name: string = toID(parts[0]);
      let avatarUrl: string = parts[1];
      if (!/^https?:\/\//i.test(avatarUrl)) avatarUrl = `http://${avatarUrl}`;
      const ext: string = getExtension(avatarUrl);
      if (!VALID_EXTENSIONS.includes(ext)) {
        return this.errorReply(`Image url must have .jpg, .png, or .gif extension.`);
      }
      if (!Config.customavatars) Config.customavatars = {};
      Config.customavatars[name] = name + ext;
      await downloadImage(avatarUrl, name, ext);
      this.sendReply(`|raw|${name}'s avatar was successfully set. Avatar:<br /><img src='${avatarUrl}' width='80' height='80'>`);
      const targetUser: User | null = Users.get(name);
      if (targetUser) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} set your custom avatar.<br /><center><img src='${avatarUrl}' width='80' height='80'></center><br /> Refresh your page if you don't see it.`);
      }
      this.parse(`/personalavatar ${name},${Config.customavatars[name]}`);

      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} set custom avatar for ${Impulse.nameColor(name, true, false)}: <img src='${avatarUrl}' width='80' height='80'></div>`).update();
      }
    },

    remove: 'delete',
    delete: function (this: CommandContext, target: string, room: ChatRoom | null, user: User): void {
      this.checkCan('bypassall');
      const userid: string = toID(target);
      const image: string | undefined = Config.customavatars?.[userid];
      if (!image) return this.errorReply(`${target} does not have a custom avatar.`);
      const originalName = Object.keys(Config.customavatars || {}).find(key => toID(key) === userid) || target;
      if (Config.customavatars) delete Config.customavatars[userid];
      FS(AVATAR_PATH + image).unlinkIfExists().then(() => {
        const targetUser: User | null = Users.get(userid);
        if (targetUser) {
          targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has deleted your custom avatar.`);
        }
        this.sendReply(`${originalName}'s avatar has been successfully removed.`);

        const staffRoom = Rooms.get(STAFF_ROOM_ID);
        if (staffRoom) {
          staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} deleted custom avatar for ${Impulse.nameColor(originalName, true, false)}.</div>`).update();
        }
      }).catch((err: any) => {
        console.error(err);
      });
      this.parse(`/removeavatar ${userid}`);
    },

    '': 'help',
    help: function (this: CommandContext): void {
      this.parse(`/help customavatar`);
    },
  },

  customavatarhelp: [
    `Commands for /customavatar are:`,
    `/customavatar set [username], [image link] - Set a user's avatar. (Requires: ~)`,
    `/customavatar delete [username] - Delete a user's avatar. (Requires: ~)`,
  ],
};
