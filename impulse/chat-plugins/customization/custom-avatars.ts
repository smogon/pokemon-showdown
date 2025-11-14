/*
 * Pokemon Showdown
 * Custom Avatars Commands
 */

import { FS } from '../../../lib';
import { nameColor } from '../../colors';

const AVATAR_PATH = 'config/avatars/';
const STAFF_ROOM_ID = 'staff';
const AVATAR_DIMENSIONS = {
	width: 80,
	height: 80,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FETCH_TIMEOUT = 10000;

const getAvatarBaseUrl = () => Config.avatarUrl || 'https://impulse-server.fun/avatars/';

const getExtension = (filename: string): string => {
	const lastDot = filename.lastIndexOf('.');
	if (lastDot === -1) return '';
	const questionMark = filename.indexOf('?', lastDot);
	const ext = questionMark !== -1 ? filename.slice(lastDot, questionMark) : filename.slice(lastDot);
	return ext.toLowerCase();
};

const deleteAllUserAvatarFiles = async (userId: string) => {
	const possibleExts = ['.jpg', '.png', '.gif'];
	for (const ext of possibleExts) {
		try {
			await FS(AVATAR_PATH + userId + ext).unlinkIfExists();
		} catch {
			// Ignore errors when unlinking
		}
	}
};

const downloadImage = async (
	imageUrl: string, name: string, ext: string
): Promise<{ success: boolean; error?: string }> => {
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
			return {
				success: false,
				error: err?.name === 'AbortError' ? 'Request timed out' : 'Failed to fetch image',
			};
		}
		clearTimeout(timeout);

		if (!response.ok) return { success: false, error: `HTTP error ${response.status}` };

		const buffer = await response.arrayBuffer();
		if (buffer.byteLength > MAX_FILE_SIZE) {
			return {
				success: false,
				error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`,
			};
		}

		await FS(AVATAR_PATH).parentDir().mkdirp();
		await FS(AVATAR_PATH + name + ext).write(Buffer.from(buffer));
		return { success: true };
	} catch {
		return { success: false, error: 'An unexpected error occurred' };
	}
};

const displayAvatar = (filename: string) => {
	const url = `${getAvatarBaseUrl()}${filename}?v=${Date.now()}`;
	return `<img src='${url}' width='${AVATAR_DIMENSIONS.width}' height='${AVATAR_DIMENSIONS.height}'>`;
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

			const avatar = displayAvatar(avatarFilename);
			const replyHtml = `<div class="infobox"><center><strong>${Chat.escapeHTML(name)}'s avatar ` +
				`was successfully set.</strong><br>${avatar}</center></div>`;
			this.sendReply(`|raw|${replyHtml}`);

			const targetUser = Users.get(userId);
			if (targetUser) {
				const popupHtml = `${nameColor(user.name, true, true)} set your custom avatar.` +
					`<p>${avatar}</p><p>Use <code>/avatars</code> to see your custom avatars!</p>`;
				targetUser.popup(`|html|${popupHtml}`);
				targetUser.avatar = avatarFilename;
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(
					`|html|<div class="infobox"><center><strong>${nameColor(user.name, true, true)} ` +
					`set custom avatar for ${nameColor(userId, true, true)}:</strong><br>${avatar}` +
					`</center></div>`
				).update();
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

		async preview(target, room, user) {
			if (!this.runBroadcast()) return;
			this.checkCan('roomowner');
			const arg = target.trim();
			if (!arg) return this.parse('/help customavatar');

			// If it's a URL, show a preview of that URL.
			if (/^https?:\/\//i.test(arg) || arg.includes('/')) {
				const processedUrl = /^https?:\/\//i.test(arg) ? arg : `https://${arg}`;
				const html = `<center><strong>Avatar preview:</strong><br>` +
					`<img src="${Chat.escapeHTML(processedUrl)}" width="${AVATAR_DIMENSIONS.width}" ` +
					`height="${AVATAR_DIMENSIONS.height}"></center>`;
				return this.sendReply(`|raw|${html}`);
			}

			// Otherwise treat as username and preview their current custom avatar.
			const userId = toID(arg);
			if (!userId) return this.errorReply('Invalid username.');

			const userAvatars = Users.Avatars.avatars[userId];
			const personalAvatar = userAvatars?.allowed?.[0];
			if (!personalAvatar || personalAvatar.startsWith('#')) {
				return this.errorReply(`${arg} does not have a personal custom avatar to preview.`);
			}

			const avatarHtml = displayAvatar(personalAvatar);
			this.sendReply(`|raw|<center><strong>${Chat.escapeHTML(arg)}'s avatar preview:</strong><br>${avatarHtml}</center>`);
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: '/customavatar set [user], [url]', desc: 'Set avatar for a user. Requires: &.' },
				{ cmd: '/customavatar delete [user]', desc: 'Remove avatar from a user. Requires: &.' },
				{ cmd: '/customavatar preview [user|url]', desc: 'Preview a user avatar or an image URL. Requires: &.' },
			];
			const html = `<center><strong>Custom Avatar Commands:</strong><br>Alias: /ca</center><hr>` +
				`<ul style="list-style-type:none;padding-left:0;">${
					helpList.map(({ cmd, desc }, i) =>
						`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
					).join('')
				}</ul><small>Max 5MB. Formats: JPG, PNG, GIF</small>`;
			this.sendReplyBox(html);
		},
	},
	ca: 'customavatar',
	customavatarhelp: 'customavatar.help',
	cahelp: 'customavatar.help',
};
