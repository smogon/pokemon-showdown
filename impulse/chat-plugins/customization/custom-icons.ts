/*
* Pokemon Showdown
* Custom Icons Commands
*/

import { FS } from '../../../lib/fs';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';
const ICONS_FILE = 'impulse/db/custom-icons.json';
const DEFAULT_ICON_SIZE = 24;
const MIN_SIZE = 1;
const MAX_SIZE = 64;

interface IconDocument {
	_id: string;
	url: string;
	size: number;
	setBy: string;
	createdAt: string;
	updatedAt: string;
}

interface IconsData {
	[userId: string]: IconDocument;
}

let customIcons: IconsData = {};

const loadIcons = async (): Promise<void> => {
	const data = await FS(ICONS_FILE).readIfExists();
	customIcons = data ? JSON.parse(data) : {};
};

const saveIcons = async (): Promise<void> => {
	await FS(ICONS_FILE).safeWrite(JSON.stringify(customIcons, null, 2));
};

const cacheBuster = () => `?v=${Date.now()}`;

const validateSize = (sizeStr: string | undefined): { valid: boolean, size: number, error?: string } => {
	if (!sizeStr) return { valid: true, size: DEFAULT_ICON_SIZE };
	const size = parseInt(sizeStr);
	if (isNaN(size) || size < MIN_SIZE || size > MAX_SIZE) {
		return { valid: false, size: 0, error: `Invalid size. Use 1-${MAX_SIZE} pixels.` };
	}
	return { valid: true, size };
};

const updateIcons = async () => {
	try {
		let css = '/* ICONS START */\n';
		const bust = cacheBuster();

		Object.values(customIcons).forEach(doc => {
			const size = doc.size || DEFAULT_ICON_SIZE;
			css += `[id$="-userlist-user-${doc._id}"] { background: url("${doc.url}${bust}") right no-repeat !important; background-size: ${size}px!important;}\n`;
		});

		css += '/* ICONS END */\n';

		const file = FS('config/custom.css').readIfExistsSync().split('\n');
		const start = file.indexOf('/* ICONS START */');
		const end = file.indexOf('/* ICONS END */');

		if (start !== -1 && end !== -1 && start < end) {
			file.splice(start, (end - start + 1), ...css.split('\n'));
			FS('config/custom.css').writeUpdate(() => file.join('\n'));
		} else {
			FS('config/custom.css').writeUpdate(() => file.join('\n') + '\n' + css);
		}
		Impulse.reloadCSS();
	} catch {
		// Ignore errors during initialization
	}
};

const displayIcon = (url: string, size: number = DEFAULT_ICON_SIZE) =>
	`<img src="${url}${cacheBuster()}" width="32" height="32">`;

const notifyUser = (userId: string, staffName: string, message: string, icon?: string) => {
	const user = Users.get(userId);
	if (user?.connected) {
		user.popup(`|html|${nameColor(staffName, true, true)} ${message}${icon ? `: ${icon}` : ''}<br /><center>Refresh if you don't see it.</center>`);
	}
};

const notifyStaff = (staffName: string, targetName: string, action: string, icon?: string) => {
	const room = Rooms.get(STAFF_ROOM_ID);
	if (room) {
		room.add(`|html|<div class="infobox">${nameColor(staffName, true, true)} ${action} ${nameColor(targetName, true, false)}${icon ? `: ${icon}` : ''}</div>`).update();
	}
};

export const commands: Chat.ChatCommands = {
	usericon: 'icon',
	ic: 'icon',
	icon: {
		''(target, room, user) {
			this.parse('/iconhelp');
		},

		async set(target, room, user) {
			this.checkCan('roomowner');
			const [name, imageUrl, sizeStr] = target.split(',').map(s => s.trim());
			if (!name || !imageUrl) return this.parse('/help icon');

			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');

			if (customIcons[userId]) {
				return this.errorReply('User already has icon. Remove with /icon delete [user].');
			}

			const sizeCheck = validateSize(sizeStr);
			if (!sizeCheck.valid) return this.errorReply(sizeCheck.error);

			const now = new Date().toISOString();
			customIcons[userId] = {
				_id: userId,
				url: imageUrl,
				size: sizeCheck.size,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			};
			await saveIcons();

			await updateIcons();

			const sizeDisplay = sizeCheck.size !== DEFAULT_ICON_SIZE ? ` (${sizeCheck.size}px)` : '';
			this.sendReply(`|raw|You have given ${nameColor(name, true, false)} an icon${sizeDisplay}.`);

			const icon = displayIcon(imageUrl, sizeCheck.size);
			notifyUser(userId, user.name, `has set your userlist icon${sizeDisplay}`, icon);
			notifyStaff(user.name, name, `set icon for`, icon);
		},

		async update(target, room, user) {
			this.checkCan('roomowner');
			const [name, imageUrl, sizeStr] = target.split(',').map(s => s.trim());
			if (!name) return this.parse('/help icon');

			const userId = toID(name);
			if (!customIcons[userId]) {
				return this.errorReply('User does not have icon. Use /icon set.');
			}

			if (imageUrl) {
				customIcons[userId].url = imageUrl;
			}
			if (sizeStr) {
				const sizeCheck = validateSize(sizeStr);
				if (!sizeCheck.valid) return this.errorReply(sizeCheck.error);
				customIcons[userId].size = sizeCheck.size;
			}

			customIcons[userId].updatedAt = new Date().toISOString();
			await saveIcons();

			await updateIcons();

			const size = customIcons[userId].size || DEFAULT_ICON_SIZE;
			const url = customIcons[userId].url;
			const sizeDisplay = size !== DEFAULT_ICON_SIZE ? ` (${size}px)` : '';

			this.sendReply(`|raw|You have updated ${nameColor(name, true, false)}'s icon${sizeDisplay}.`);

			const icon = displayIcon(url, size);
			notifyUser(userId, user.name, `has updated your userlist icon${sizeDisplay}`, icon);
			notifyStaff(user.name, name, `updated icon for`, icon);
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!customIcons[userId]) {
				return this.errorReply(`${target} does not have an icon.`);
			}

			delete customIcons[userId];
			await saveIcons();

			await updateIcons();

			this.sendReply(`You removed ${target}'s icon.`);
			notifyUser(userId, user.name, 'has removed your userlist icon.');
			notifyStaff(user.name, target, 'removed icon for');
		},

		async list(target, room, user) {
			this.checkCan('roomowner');

			const allIcons = Object.values(customIcons).sort((a, b) => a._id.localeCompare(b._id));
			const total = allIcons.length;

			if (total === 0) return this.sendReply('No custom icons have been set.');

			const page = parseInt(target) || 1;
			const limit = 20;
			const totalPages = Math.ceil(total / limit);
			const startIdx = (page - 1) * limit;
			const endIdx = startIdx + limit;
			const pageIcons = allIcons.slice(startIdx, endIdx);

			const rows: string[][] = pageIcons.map(icon => [
				icon._id,
				`<img src="${icon.url}" width="32" height="32">`,
				`${icon.size || DEFAULT_ICON_SIZE}px`,
				Chat.escapeHTML(icon.setBy || 'Unknown'),
			]);

			let output = generateThemedTable(
				`Custom Icons (Page ${page}/${totalPages})`,
				['User', 'Icon', 'Size', 'Set By'],
				rows,
			);

			if (totalPages > 1) {
				output += `<div class="pad"><center>`;
				if (page > 1) {
					output += `<button class="button" name="send" value="/icon list ${page - 1}">Previous</button> `;
				}
				if (page < totalPages) {
					output += `<button class="button" name="send" value="/icon list ${page + 1}">Next</button>`;
				}
				output += `</center></div>`;
			}

			this.sendReply(`|raw|${output}`);
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/icon set [user], [url], [size]", desc: `Set icon (${DEFAULT_ICON_SIZE}-${MAX_SIZE}px). Requires: &.` },
				{ cmd: "/icon update [user], [url], [size]", desc: "Update icon. Requires: &." },
				{ cmd: "/icon delete [user]", desc: "Remove icon. Requires: &." },
				{ cmd: "/icon list [page]", desc: "List icons. Requires: &." },
			];
			const html = `<center><strong>Custom Icon Commands:</strong><br>Alias: /ic</center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},

	iconhelp: 'icon.help',
	ichelp: 'icon.help',
};

void loadIcons();
