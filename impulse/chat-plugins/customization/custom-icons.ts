/*
* Pokemon Showdown
* Custom Icons Commands
* Refactored By @MusaddikTemkar
*/
import { FS } from '../../../lib';
import { toID } from '../../../sim/dex';

const DATA_FILE = 'impulse/db/custom-icons.json';
const CONFIG_PATH = 'config/custom.css';
const STAFF_ROOM_ID = 'staff';
const ICONS_START_TAG = '/* ICONS START */';
const ICONS_END_TAG = '/* ICONS END */';
const DEFAULT_ICON_SIZE = 24;
const MIN_SIZE = 1;
const MAX_SIZE = 100;

interface IconEntry {
	url: string;
	size: number;
	setBy: string;
	createdAt: number;
	updatedAt: number;
}

interface IconData {
	[userid: string]: IconEntry;
}

let data: IconData = {};

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(data));
};

const loadData = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			data = JSON.parse(raw);
		}
	} catch (e) {
		console.error('Failed to load custom icons:', e);
		data = {};
	}
};

void loadData();

const cacheBuster = () => `?v=${Date.now()}`;

const validateSize = (sizeStr?: string): { valid: boolean; size: number; error?: string } => {
	if (!sizeStr) return { valid: true, size: DEFAULT_ICON_SIZE };
	
	const size = parseInt(sizeStr);
	if (isNaN(size) || size < MIN_SIZE || size > MAX_SIZE) {
		return { valid: false, size: 0, error: `Invalid size. Use ${MIN_SIZE}-${MAX_SIZE} pixels.` };
	}
	return { valid: true, size };
};

const parseArgs = (target: string) => {
	const [name, url, sizeStr] = target.split(',').map(s => s.trim());
	return { name, userId: toID(name), url, sizeStr };
};

const formatSizeDisplay = (size: number) => (size !== DEFAULT_ICON_SIZE ? ` (${size}px)` : '');

const updateIcons = (): void => {
	try {
		const bust = cacheBuster();

		const cssRules = Object.entries(data).map(([userId, entry]) => {
			const size = entry.size || DEFAULT_ICON_SIZE;
			return `[id$="-userlist-user-${userId}"] { background: url("${entry.url}${bust}") right no-repeat !important; background-size: ${size}px!important;}`;
		}).join('\n');

		const cssBlock = `${ICONS_START_TAG}\n${cssRules}\n${ICONS_END_TAG}`;

		FS(CONFIG_PATH).writeUpdate(() => {
			const fileContent = FS(CONFIG_PATH).readIfExistsSync();

			if (!fileContent.trim()) return cssBlock + '\n';

			const startIndex = fileContent.indexOf(ICONS_START_TAG);
			const endIndex = fileContent.indexOf(ICONS_END_TAG);

			if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
				const pre = fileContent.substring(0, startIndex);
				const post = fileContent.substring(endIndex + ICONS_END_TAG.length);
				return pre + cssBlock + post;
			} else {
				return fileContent + '\n' + cssBlock + '\n';
			}
		});
		
		if (typeof Impulse !== 'undefined' && Impulse.reloadCSS) {
			Impulse.reloadCSS();
		}
	} catch (err) {
		console.error("Error updating icons CSS:", err);
	}
};

const sendIconNotifications = (
	staffUser: User,
	targetName: string,
	action: string,
	url?: string,
	size: number = DEFAULT_ICON_SIZE
) => {
	const userId = toID(targetName);
	const sizeDisplay = formatSizeDisplay(size);
	const iconHtml = url ? `<img src="${url}${cacheBuster()}" width="32" height="32">` : '';
	const iconDisplay = iconHtml ? `: ${iconHtml}` : '';
	
	const user = Users.get(userId);
	if (user?.connected) {
		const staffHtml = Impulse.nameColor(staffUser.name, true, true);
		const msg = `${staffHtml} ${action}${sizeDisplay}${iconDisplay}<br /><center>Refresh if you don't see it.</center>`;
		user.popup(`|html|${msg}`);
	}
	
	const room = Rooms.get(STAFF_ROOM_ID);
	if (room) {
		const staffHtml = Impulse.nameColor(staffUser.name, true, true);
		const targetHtml = Impulse.nameColor(targetName, true, false);
		const logAction = action.replace('has ', '').replace('your userlist icon', `icon for ${targetHtml}`);
		const msg = `${staffHtml} ${logAction}${iconDisplay}`;
		room.add(`|html|<div class="infobox">${msg}</div>`).update();
	}
};

export const commands: Chat.ChatCommands = {
	usericon: 'icon',
	ic: 'icon',
	icon: {
		''(target) {
			this.parse('/iconhelp');
		},

		set(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, url, sizeStr } = parseArgs(target);
			
			if (!name || !url) return this.parse('/icon help');
			if (userId.length > 19) throw new Chat.ErrorMessage('Usernames are not this long...');

			if (data[userId]) {
				throw new Chat.ErrorMessage('User already has icon. Remove with /icon delete [user].');
			}

			const { valid, size, error } = validateSize(sizeStr);
			if (!valid) throw new Chat.ErrorMessage(error!);

			const now = Date.now();
			data[userId] = {
				url: url,
				size: size,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			};
			saveData();
			updateIcons();

			const targetHtml = Impulse.nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetHtml} an icon${formatSizeDisplay(size)}.`);
			sendIconNotifications(user, name, 'has set your userlist icon', url, size);
		},

		update(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, url, sizeStr } = parseArgs(target);

			if (!name) return this.parse('/icon help');

			if (!data[userId]) {
				throw new Chat.ErrorMessage('User does not have icon. Use /icon set.');
			}

			const updateFields: Partial<IconEntry> = { updatedAt: Date.now() };
			if (url) updateFields.url = url;
			
			if (sizeStr) {
				const { valid, size, error } = validateSize(sizeStr);
				if (!valid) throw new Chat.ErrorMessage(error!);
				updateFields.size = size;
			}

			// Merge updates into existing data
			Object.assign(data[userId], updateFields);
			saveData();
			updateIcons();

			const newSize = data[userId].size;
			const newUrl = data[userId].url;

			const targetHtml = Impulse.nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetHtml}'s icon${formatSizeDisplay(newSize)}.`);
			sendIconNotifications(user, name, 'has updated your userlist icon', newUrl, newSize);
		},

		delete(target, room, user) {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!data[userId]) {
				throw new Chat.ErrorMessage(`${target} does not have an icon.`);
			}

			delete data[userId];
			saveData();
			updateIcons();

			this.sendReply(`You removed ${target}'s icon.`);
			sendIconNotifications(user, target, 'has removed your userlist icon');
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/icon set [user], [url], [size]", desc: `Set icon (${DEFAULT_ICON_SIZE}-${MAX_SIZE}px). Requires: &.` },
				{ cmd: "/icon update [user], [url], [size]", desc: "Update icon. Requires: &." },
				{ cmd: "/icon delete [user]", desc: "Remove icon. Requires: &." },
			];
			
			const listHtml = helpList.map(({ cmd, desc }) => 
				`<li><b>${cmd}</b> - ${desc}</li>`
			).join('<hr>');

			const html = [
				`<center><strong>Custom Icon Commands:</strong><br>Alias: /ic</center>`,
				`<hr><ul style="list-style-type:none;padding-left:0;">`,
				listHtml,
				`</ul>`
			].join('');
			
			this.sendReplyBox(html);
		},
	},

	iconhelp: 'icon.help',
	ichelp: 'icon.help',
};
