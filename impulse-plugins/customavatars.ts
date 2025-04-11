/******************************************
* Pokemon Showdown Custom Avatar Commands *
* Original Code By: CreatePhil And Others *
* Updated To Typescript By: Prince Sky    *
*******************************************/

import { FS } from '../lib/fs';

const AVATAR_PATH = 'config/avatars/';
const STAFF_ROOM_ID = 'staff';
const VALID_EXTENSIONS = ['.jpg', '.png', '.gif'];

async function downloadImage(imageUrl: string, name: string, extension: string): Promise<void> {
	try {
		const response = await fetch(imageUrl);
		if (!response.ok) return;

	  const contentType = response.headers.get('content-type');
	  if (!contentType?.startsWith('image/')) return;
	  
	  const buffer = await response.arrayBuffer();
	  await FS(AVATAR_PATH + name + extension).write(Buffer.from(buffer));
	} catch (err) {
	  console.error('Error downloading avatar:', err);
  }
}

function getExtension(filename: string): string {
	const ext = filename.slice(filename.lastIndexOf('.'));
	return ext || '';
}

async function initializeAvatars(): Promise<void> {
	try {
		const files = await FS(AVATAR_PATH).readdir();
		if (!files) return;
		files
			.filter(file => VALID_EXTENSIONS.includes(getExtension(file)))
			.forEach(file => {
				const ext = getExtension(file);
				const name = file.slice(0, -ext.length);
				Config.customavatars = Config.customavatars || {};
				Config.customavatars[name] = file;
			});
	} catch (err) {
		console.log('Error loading avatars:', err);
	}
}

initializeAvatars();

export const commands: Chat.ChatCommands = {
	customavatar: {
		async set(this: CommandContext, target: string, room: ChatRoom | null, user: User) {
			this.checkCan('bypassall');
			const [name, avatarUrl] = target.split(',').map(s => s.trim());
			if (!name || !avatarUrl) return this.parse('/help customavatar');
			
			const userId = toID(name);
			const processedUrl = /^https?:\/\//i.test(avatarUrl) ? avatarUrl : `http://${avatarUrl}`;
			const ext = getExtension(processedUrl);
			if (!VALID_EXTENSIONS.includes(ext)) {
				return this.errorReply('Image must have .jpg, .png, or .gif extension.');
			}
			Config.customavatars = Config.customavatars || {};
			Config.customavatars[userId] = userId + ext;
			await downloadImage(processedUrl, userId, ext);
			this.sendReply(`|raw|${name}'s avatar was successfully set. Avatar:<br /><img src='${processedUrl}' width='80' height='80'>`);
			
			const targetUser = Users.get(userId);
			if (targetUser) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} set your custom avatar.<br /><center><img src='${processedUrl}' width='80' height='80'></center>`);
			}
			this.parse(`/personalavatar ${userId},${Config.customavatars[userId]}`);
			
			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} set custom avatar for ${Impulse.nameColor(name, true, false)}: <img src='${processedUrl}' width='80' height='80'></div>`).update();
			}
		},
		
		async delete(this: CommandContext, target: string) {
			this.checkCan('bypassall');
			const userId = toID(target);
			const image = Config.customavatars?.[userId];
			if (!image) {
				return this.errorReply(`${target} does not have a custom avatar.`);
			}
			if (Config.customavatars) delete Config.customavatars[userId];
			try {
				await FS(AVATAR_PATH + image).unlinkIfExists();
				
				const targetUser = Users.get(userId);
				if (targetUser) {
					targetUser.popup(`|html|${Impulse.nameColor(this.user.name, true, true)} has deleted your custom avatar.`);
				}
				this.sendReply(`${target}'s avatar has been removed.`);
				
				const staffRoom = Rooms.get(STAFF_ROOM_ID);
				if (staffRoom) {
					staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(this.user.name, true, true)} deleted custom avatar for ${Impulse.nameColor(target, true, false)}.</div>`).update(); 
				}
				this.parse(`/removeavatar ${userId}`);
			} catch (err) {
				console.error('Error deleting avatar:', err);
			}
		},

		''(target, room, user) {
			this.parse('/customavatarhelp');
		},
	},
	
	customavatarhelp(target: string, room: ChatRoom | null, user: User) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<b>Custom Avatar Commands:</b><br>` +
			`• <code>/customavatar set [username], [image url]</code> - Sets a user's avatar (Requires ~)<br>` +
			`• <code>/customavatar delete [username]</code> - Removes a user's avatar (Requires ~)`
		);
	},
};
