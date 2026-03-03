/*
* Pokemon Showdown - Impulse Server
* Custom Avatars chat-plugin.
* Refactored By @PrinceSky-Git
*/

import { FS } from '../../../lib';
import { toID } from '../../../sim/dex';

const CONFIG = {
	path: 'config/avatars/',
	staffRoom: 'staff',
	maxSize: 5 * 1024 * 1024, // 5MB
	timeout: 10000,
	baseUrl: Config.avatarUrl || 'impulse-ps.mooo.com/avatars/',
};

const IMAGE_FORMATS: { [ext: string]: number[] } = {
	'.png': [0x89, 0x50, 0x4E, 0x47],
	'.jpg': [0xFF, 0xD8, 0xFF],
	'.gif': [0x47, 0x49, 0x46],
};

const VALID_EXTENSIONS = Object.keys(IMAGE_FORMATS);

const getExtension = (url: string) => {
	const match = url.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
	return match ? `.${match[1].toLowerCase()}` : '';
};

const isValidImageSignature = (buffer: Uint8Array, ext: string) => {
	const sig = IMAGE_FORMATS[ext];
	return sig && buffer.length >= sig.length && sig.every((byte, i) => buffer[i] === byte);
};

const displayAvatar = (filename: string) => {
	// Adding timestamp (v=Date.now()) is crucial here to force the browser to reload the image
	// after we overwrote it, otherwise it shows the cached old version.
	const url = `${CONFIG.baseUrl}${filename}?v=${Date.now()}`;
	return `<img src='${url}' width='80' height='80'>`;
};

const notifyChanges = (
	user: string, 
	targetId: string, 
	action: 'set' | 'delete', 
	filename?: string
) => {
	const setterColor = Impulse.nameColor(user.name, true, true);
	const targetColor = Impulse.nameColor(targetId, true, true);
	const targetUser = Users.get(targetId);
	
	let staffMsg = '';
	let userMsg = '';

	if (action === 'set' && filename) {
		const imgHtml = displayAvatar(filename);
		userMsg = `${setterColor} set your custom avatar.<p>${imgHtml}</p><p>Use <code>/avatars</code> to see it!</p>`;
		staffMsg = `<center><strong>${setterColor} set custom avatar for ${targetColor}:</strong><br>${imgHtml}</center>`;
		if (targetUser) targetUser.avatar = filename;
	} else {
		userMsg = `${setterColor} has deleted your custom avatar.`;
		staffMsg = `<strong>${setterColor} deleted custom avatar for ${targetColor}.</strong>`;
		if (targetUser) targetUser.avatar = 1;
	}

	Rooms.get(CONFIG.staffRoom)?.add(`|html|<div class="infobox">${staffMsg}</div>`).update();
	if (targetUser?.connected) targetUser.popup(`|html|${userMsg}`);
};

const deleteUserFiles = async (userId: string) => {
	await Promise.all(VALID_EXTENSIONS.map(ext => 
		FS(CONFIG.path + userId + ext).unlinkIfExists()
	));
};

const downloadImage = async (urlStr: string, name: string, ext: string) => {
	try {
		const url = new URL(urlStr);
		if (!['http:', 'https:'].includes(url.protocol)) return { error: 'Invalid protocol' };

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
		
		const res = await fetch(urlStr, { signal: controller.signal }).catch(err => {
			throw new Error(err.name === 'AbortError' ? 'Request timed out' : 'Failed to fetch');
		});
		clearTimeout(timeoutId);

		if (!res.ok) return { error: `HTTP error ${res.status}` };
		if (!res.headers.get('content-type')?.startsWith('image/')) return { error: 'Not an image' };

		const buffer = await res.arrayBuffer();
		if (buffer.byteLength > CONFIG.maxSize) return { error: 'File too large (max 5MB)' };

		const uint8 = new Uint8Array(buffer);
		if (!isValidImageSignature(uint8, ext)) return { error: 'Corrupted or mismatched file type' };

		await FS(CONFIG.path).parentDir().mkdirp();
		await FS(CONFIG.path + name + ext).write(Buffer.from(buffer));
		
		return { success: true };
	} catch (err: any) {
		return { error: err.message || 'Unknown error' };
	}
};

export const commands: Chat.ChatCommands = {
	customavatar: {
		async set(target, room, user) {
			this.checkCan('roomowner');
			const [targetName, url] = target.split(',').map(s => s.trim());
			if (!targetName || !url) return this.parse('/ca help');

			const userId = toID(targetName);
			if (!userId) return this.errorReply('Invalid username.');

			const ext = getExtension(url);
			if (!VALID_EXTENSIONS.includes(ext)) {
				return this.errorReply(`URL must end with ${VALID_EXTENSIONS.join(', ')}`);
			}

			const processedUrl = url.startsWith('http') ? url : `https://${url}`;
			this.sendReply(`Downloading avatar for ${userId}...`);

			const result = await downloadImage(processedUrl, userId, ext);
			if (result.error) return this.errorReply(`Failed: ${result.error}`);

			const filename = userId + ext;
			
			for (const validExt of VALID_EXTENSIONS) {
				if (validExt !== ext) await FS(CONFIG.path + userId + validExt).unlinkIfExists();
			}
			
			const userAvatars = Users.Avatars.avatars[userId];
			const alreadyHasAvatar = userAvatars?.allowed.includes(filename);

			if (!Users.Avatars.addPersonal(userId, filename) && !alreadyHasAvatar) {
				await FS(CONFIG.path + filename).unlinkIfExists();
				return this.errorReply('Failed to register avatar. User may be banned from avatars.');
			}

			Users.Avatars.save(true);
			this.sendReply(`|raw|${targetName}'s avatar set successfully.`);
			notifyChanges(user, userId, 'set', filename);
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			const userId = toID(target);
			if (!userId) return this.errorReply('Invalid username.');

			const userAvatars = Users.Avatars.avatars[userId];
			const filename = userAvatars?.allowed[0];

			if (!filename || filename.startsWith('#')) {
				return this.errorReply(`${target} does not have a custom avatar set.`);
			}

			try {
				Users.Avatars.removeAllowed(userId, filename);
				Users.Avatars.save(true);
				
				await deleteUserFiles(userId);

				this.sendReply(`${target}'s avatar removed.`);
				notifyChanges(user, userId, 'delete');
			} catch (e) {
				this.errorReply('Error deleting avatar.');
			}
		},

		help() {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				`<center><strong>Custom Avatar Commands</strong><br>Alias: /cc</center><hr>` +
				`<code>/ca set [user], [url]</code> - Set a user's avatar (&).<br>` +
				`<code>/ca delete [user]</code> - Remove a user's avatar (&).<br>` +
				`<small>Formats: JPG, PNG, GIF. Max 5MB.</small>`
			);
		},
	},
	ca: 'customavatar',
	customavatarhelp: 'customavatar.help',
	cahelp: 'customavatar.help',
};
