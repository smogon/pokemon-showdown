/*
* Pokemon Showdown
* Custom Avatars Commands
*/

import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const AVATAR_PATH = 'config/avatars/';
const STAFF_ROOM_ID = 'staff';
const VALID_EXTENSIONS = ['.jpg', '.png', '.gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FETCH_TIMEOUT = 10000;
const PNG_SIG = [0x89, 0x50, 0x4E, 0x47];
const JPG_SIG = [0xFF, 0xD8, 0xFF];
const GIF_SIG = [0x47, 0x49, 0x46];

const IMAGE_SIGS: { [key: string]: number[] } = {
	'.png': PNG_SIG,
	'.jpg': JPG_SIG,
	'.gif': GIF_SIG,
};

const getAvatarBaseUrl = () => Config.avatarUrl || 'https://impulse-server.fun/avatars/';

const isValidImage = (bytes: Uint8Array, ext: string): boolean => {
	const sig = IMAGE_SIGS[ext];
	if (!sig || bytes.length < sig.length) return false;
	return sig.every((byte, i) => bytes[i] === byte);
};

const getExtension = (filename: string): string => {
	const lastDot = filename.lastIndexOf('.');
	if (lastDot === -1) return '';
	const questionMark = filename.indexOf('?', lastDot);
	const ext = questionMark !== -1 ? filename.slice(lastDot, questionMark) : filename.slice(lastDot);
	return ext.toLowerCase();
};

const deleteAllUserAvatarFiles = async (userId: string) => {
	for (const ext of VALID_EXTENSIONS) {
		try {
			await FS(AVATAR_PATH + userId + ext).unlinkIfExists();
		} catch {
			// Ignore errors when unlinking
		}
	}
};

const downloadImage = async (
	imageUrl: string, name: string, ext: string
): Promise<{ success: boolean, error?: string }> => {
	try {
		let url: URL;
		try {
			url = new URL(imageUrl);
		} catch {
			return { success: false, error: 'Invalid URL format' };
		}

		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			return { success: false, error: 'Only HTTP/HTTPS URLs are allowed' };
		}

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

		let response;
		try {
			response = await fetch(imageUrl, { signal: controller.signal });
		} catch (err: any) {
			clearTimeout(timeout);
			return { success: false, error: err.name === 'AbortError' ? 'Request timed out' : 'Failed to fetch image' };
		}
		clearTimeout(timeout);

		if (!response.ok) return { success: false, error: `HTTP error ${response.status}` };

		const contentType = response.headers.get('content-type');
		if (!contentType?.startsWith('image/')) return { success: false, error: 'URL does not point to an image' };

		const contentLength = response.headers.get('content-length');
		if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
			return { success: false, error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` };
		}

		const buffer = await response.arrayBuffer();
		if (buffer.byteLength > MAX_FILE_SIZE) {
			return { success: false, error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` };
		}

		const uint8 = new Uint8Array(buffer);
		if (!isValidImage(uint8, ext)) {
			return { success: false, error: 'File content does not match extension or is corrupted' };
		}

		await FS(AVATAR_PATH).parentDir().mkdirp();
		await FS(AVATAR_PATH + name + ext).write(Buffer.from(buffer));
		return { success: true };
	} catch {
		return { success: false, error: 'An unexpected error occurred' };
	}
};

const saveAvatarMetadata = async (userId: string, filename: string, setBy: string, sourceUrl: string) => {
	await ImpulseDB('customavatars').upsert({ userid: userId }, {
		$set: { userid: userId, filename, setBy, sourceUrl, updatedAt: new Date() },
	});
};

const removeAvatarMetadata = async (userId: string) => {
	await ImpulseDB('customavatars').deleteOne({ userid: userId });
};

const displayAvatar = (filename: string) => {
	const url = `${getAvatarBaseUrl()}${filename}?v=${Date.now()}`;
	return `<img src='${url}' width='80' height='80'>`;
};

export const commands: Chat.ChatCommands = {
	customavatar: {
		async set(target, room, user) {
			this.checkCan('roomowner');
			const [name, avatarUrl] = target.split(',').map(s => s.trim());
			if (!name || !avatarUrl) return this.parse('/help customavatar');

			const userId = toID(name);
			if (!userId) return this.errorReply('Invalid username.');

			const processedUrl = /^https?:\/\//i.test(avatarUrl) ? avatarUrl : `https://${avatarUrl}`;
			const ext = getExtension(processedUrl);

			if (!VALID_EXTENSIONS.includes(ext)) {
				return this.errorReply('Image URL must end with .jpg, .png, or .gif extension.');
			}

			await deleteAllUserAvatarFiles(userId);
			this.sendReply('Downloading avatar...');

			const avatarFilename = userId + ext;
			const result = await downloadImage(processedUrl, userId, ext);

			if (!result.success) {
				return this.errorReply(`Failed to download avatar: ${result.error}`);
			}

			if (!Users.Avatars.addPersonal(userId, avatarFilename)) {
				await FS(AVATAR_PATH + avatarFilename).unlinkIfExists();
				return this.errorReply('Failed to set avatar in the system. User may already have this avatar.');
			}

			Users.Avatars.save(true);
			await saveAvatarMetadata(userId, avatarFilename, user.id, processedUrl);

			const avatar = displayAvatar(avatarFilename);
			this.sendReply(`|raw|${name}'s avatar was successfully set. Avatar:<p>${avatar}</p>`);

			const targetUser = Users.get(userId);
			if (targetUser) {
				targetUser.popup(`|html|${nameColor(user.name, true, true)} set your custom avatar.<p>${avatar}</p><p>Use <code>/avatars</code> to see your custom avatars!</p>`);
				targetUser.avatar = avatarFilename;
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox"><center><strong>${nameColor(user.name, true, true)} set custom avatar for ${nameColor(userId, true, true)}:</strong><br>${avatar}</center></div>`).update();
			}
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			const userId = toID(target);
			if (!userId) return this.errorReply('Invalid username.');

			const userAvatars = Users.Avatars.avatars[userId];
			if (!userAvatars?.allowed.length) return this.errorReply(`${target} does not have a custom avatar.`);

			const personalAvatar = userAvatars.allowed[0];
			if (!personalAvatar || personalAvatar.startsWith('#')) {
				return this.errorReply(`${target} does not have a personal avatar.`);
			}

			try {
				Users.Avatars.removeAllowed(userId, personalAvatar);
				Users.Avatars.save(true);
				await deleteAllUserAvatarFiles(userId);
				await removeAvatarMetadata(userId);

				const targetUser = Users.get(userId);
				if (targetUser) {
					targetUser.popup(`|html|${nameColor(user.name, true, true)} has deleted your custom avatar.`);
					targetUser.avatar = 1;
				}

				this.sendReply(`${target}'s avatar has been removed.`);

				const staffRoom = Rooms.get(STAFF_ROOM_ID);
				if (staffRoom) {
					staffRoom.add(
						`|html|<div class="infobox"><strong>` +
						`${nameColor(user.name, true, true)} deleted custom avatar for ` +
						`${nameColor(userId, true, true)}.</strong></div>`
					).update();
				}
			} catch {
				return this.errorReply('An error occurred while deleting the avatar.');
			}
		},

		async list(target, room, user) {
			this.checkCan('roomowner');

			const page = parseInt(target) || 1;
			const result = await ImpulseDB('customavatars').findPaginated({}, { page, limit: 20, sort: { userid: 1 } });

			if (result.total === 0) return this.sendReply('No custom avatars have been set.');
			if (page < 1 || page > result.totalPages) {
				return this.errorReply(`Invalid page number. Please use a page between 1 and ${result.totalPages}.`);
			}

			const baseUrl = getAvatarBaseUrl();
			const rows: string[][] = result.docs.map(doc => [
				nameColor(doc.userid, true, true),
				`<img src="${baseUrl}${doc.filename}" width="40" height="40">`,
				Chat.escapeHTML(doc.setBy || 'Unknown'),
			]);

			let output = generateThemedTable(
				`Custom Avatars (Page ${page}/${result.totalPages})`,
				['User', 'Avatar', 'Set By'],
				rows,
			);

			if (result.totalPages > 1) {
				output += `<div class="pad"><center>`;
				if (result.hasPrev) {
					output += `<button class="button" name="send" value="/customavatar list ${page - 1}">Previous</button> `;
				}
				if (result.hasNext) {
					output += `<button class="button" name="send" value="/customavatar list ${page + 1}">Next</button>`;
				}
				output += `</center></div>`;
			}

			this.sendReply(`|raw|${output}`);
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/customavatar set [user], [url]", desc: "Set avatar for a user. Requires: &." },
				{ cmd: "/customavatar delete [user]", desc: "Remove avatar from a user. Requires: &." },
				{ cmd: "/customavatar list [page]", desc: "List all avatars. Requires: &." },
			];
			const html = `<center><strong>Custom Avatar Commands:</strong><br>Alias: /cc</center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul><small>Max 5MB. Formats: JPG, PNG, GIF</small>`;
			this.sendReplyBox(html);
		},
	},
	ca: 'customavatar',
	customavatarhelp: 'customavatar.help',
	cahelp: 'customavatar.help',
};
