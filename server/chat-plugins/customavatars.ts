/** Original plugin from https://github.com/CreaturePhil/Showdown-Boilerplate/blob/master/chat-plugins/customavatar.js.
Credits to CreaturePhil and the other listed contributors.
Rewritten, revamped, and typescripted by mia-pi.
*/

import {FS} from '../../lib/fs';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import * as url from 'url';


const avatarManager = new class {
	dir: string;
	constructor() {
		this.dir = 'config/avatars/';
	}
	download(image_url: string, name: string): Promise<boolean> {
		const request = (secure = true) => {
			if (!secure) return http;
			return https;
		};
		const secure = toID(url.parse(image_url).protocol) === 'https';
		return new Promise((resolve) => {
			request(secure).get(image_url, (response: http.IncomingMessage) => {
				if (response.statusCode !== 200 || response.headers['content-type']!.split('/')[0] !== 'image') {
					return resolve(false);
				}
				// weird bug with FSPath that doesn't like this, so normal fs is required.
				const stream = fs.createWriteStream(`${this.dir}${name}.png`);
				response.pipe(stream);
				stream.on('finish', () => {
					resolve(true);
				});
			});
		});
	}

	async add(image: string, user: string) {
		const avatar = await this.download(image, user);
		if (!avatar) return new Error(`Error in downloading image.`);
		const ext = path.extname(image);
		Config.customavatars[user] = user + ext;
		return;
	}

	remove(user: string) {
		const image = Config.customavatars[user];
		if (!image) return false;
		delete Config.customavatars[user];
		if (!FS(`config/avatars/${image}`).existsSync()) {
			return false;
		}
		void FS(`${this.dir}${image}`).unlinkIfExistsSync();
		return true;
	}

	load() {
		const avatars: string[] = [];
		const files = FS(this.dir).readdirSync();
		// passing over non-avatar files
		for (const file of files) {
			if (!file.endsWith('.png')) {
				continue;
			} else {
				avatars.push(file);
			}
		}
		for (const file of avatars) {
			const name = path.basename(file, path.extname(file));
			Config.customavatars[name] = file;
		}
	}
};

avatarManager.load();

export const commands: ChatCommands = {
	ca: 'customavatar',
	customavatar: {
		set: 'add',
		add(target, room, user, connection) {
			if (!user.hasConsoleAccess(connection)) return false;
			let [name, avatarUrl] = target.split(',');
			const targetUser = Users.get(name);
			name = toID(name);
			if (!/^https?:\/\//i.test(avatarUrl) && !/^http?:\/\//i.test(avatarUrl)) {
				avatarUrl = 'https://' + avatarUrl;
			}
			const ext = path.extname(avatarUrl);
			if (!ext.includes('.png')) {
				return this.errorReply("Image url must be a .png extension.");
			}

			try {
				void avatarManager.add(avatarUrl, name);
			} catch (e) {
				return this.errorReply(
					`There was an error in downloading the image. Please try another link.`
				);
			}
			this.sendReply(
				`|raw|${name}${name.endsWith('s') ? "'" : "'s"} avatar was successfully set.` +
				`<details><summary>Avatar:</summary><img src="${avatarUrl}" width="80" height="80"></details>`
			);
			this.globalModlog('CUSTOMAVATAR SET', targetUser, avatarUrl);
			Rooms.global.notifyRooms(
				['staff'],
				`|c|${user.getIdentity()}|/log ${user} has set ${name}${name.endsWith('s') ? "'" : "'s"} avatar to ${avatarUrl}.`
			);
			if (targetUser) {
				 targetUser.popup(
					 `|html|Upper staff have set your custom avatar.<br /><img src='${avatarUrl}' width='80' height='80'><br /> Refresh your page if you don't see it.`
				);
			}
		},

		delete: 'remove',
		remove(target, room, user, connection) {
			if (!user.hasConsoleAccess(connection)) return false;
			const targetUser = Users.get(target);
			const image = Config.customavatars[toID(target)];

			if (!image) return this.errorReply(target + " does not have a custom avatar.");

			if (avatarManager.remove(target)) {
				if (targetUser) targetUser.popup("Upper staff have removed your custom avatar.");
				this.sendReply(`${target}${toID(target).endsWith('s') ? "'" : "'s"} avatar has been successfully removed.`);
				this.globalModlog('CUSTOMAVATAR REMOVE', targetUser, 'success');
				Rooms.global.notifyRooms(
					['staff'],
					`|c|${user.getIdentity()}|/log ${user} has removed ${target}${toID(target).endsWith('s') ? "'" : "'s"} avatar.`
				);
			} else {
				return this.errorReply("That custom avatar does not exist - try again?");
			}
		},

		customavatarhelp: 'help',
		'': 'help',
		help(target, room, user) {
			this.parse('/help customavatar');
		},
	},

	customavatarhelp: [
		"Commands for /customavatar are:",
		"/customavatar add [username], [image link] - Set a user's custom avatar. Requires: ~",
		"/customavatar remove [username] - Delete a user's custom avatar. Requires: ~",
	],
};
