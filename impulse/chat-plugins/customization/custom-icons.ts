/*
* Pokemon Showdown
* Custom Icons Commands
* @author MusaddikTemkar
*/

import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { nameColor } from '../../colors';

const CONFIG_PATH = 'config/custom.css';
const STAFF_ROOM_ID = 'staff';
const ICONS_START_TAG = '/* ICONS START */';
const ICONS_END_TAG = '/* ICONS END */';
const DEFAULT_ICON_SIZE = 24;
const MIN_SIZE = 1;
const MAX_SIZE = 100;

interface IconDocument {
	_id: string;
	url: string;
	size: number;
	setBy: string;
	createdAt: Date;
	updatedAt: Date;
}

const IconsDB = ImpulseDB<IconDocument>('usericons');

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

const updateIcons = async () => {
	try {
		const iconDocs = await IconsDB.find({}, { projection: { _id: 1, url: 1, size: 1 } });
		const bust = cacheBuster();

		const cssRules = iconDocs.map(doc => {
			const size = doc.size || DEFAULT_ICON_SIZE;
			return `[id$="-userlist-user-${doc._id}"] { background: url("${doc.url}${bust}") right no-repeat !important; background-size: ${size}px!important;}`;
		}).join('\n');

		const cssBlock = `${ICONS_START_TAG}\n${cssRules}\n${ICONS_END_TAG}\n`;

		const fileContent = FS(CONFIG_PATH).readIfExistsSync().split('\n');
		const startIndex = fileContent.indexOf(ICONS_START_TAG);
		const endIndex = fileContent.indexOf(ICONS_END_TAG);

		if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
			fileContent.splice(startIndex, (endIndex - startIndex + 1), ...cssBlock.split('\n'));
			FS(CONFIG_PATH).writeUpdate(() => fileContent.join('\n'));
		} else {
			FS(CONFIG_PATH).writeUpdate(() => fileContent.join('\n') + '\n' + cssBlock);
		}
		
		Impulse.reloadCSS();
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
		const staffHtml = nameColor(staffUser.name, true, true);
		const msg = `${staffHtml} ${action}${sizeDisplay}${iconDisplay}<br /><center>Refresh if you don't see it.</center>`;
		user.popup(`|html|${msg}`);
	}
	
	const room = Rooms.get(STAFF_ROOM_ID);
	if (room) {
		const staffHtml = nameColor(staffUser.name, true, true);
		const targetHtml = nameColor(targetName, true, false);
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

		async set(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, url, sizeStr } = parseArgs(target);
			
			if (!name || !url) return this.parse('/icon help');
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');

			if (await IconsDB.exists({ _id: userId })) {
				return this.errorReply('User already has icon. Remove with /icon delete [user].');
			}

			const { valid, size, error } = validateSize(sizeStr);
			if (!valid) return this.errorReply(error!);

			const now = new Date();
			await IconsDB.insertOne({
				_id: userId,
				url: url,
				size: size,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			});

			await updateIcons();

			const targetHtml = nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetHtml} an icon${formatSizeDisplay(size)}.`);
			sendIconNotifications(user, name, 'has set your userlist icon', url, size);
		},

		async update(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, url, sizeStr } = parseArgs(target);

			if (!name) return this.parse('/icon help');

			const existingDoc = await IconsDB.findOne({ _id: userId }, { projection: { url: 1, size: 1 } });
			if (!existingDoc) {
				return this.errorReply('User does not have icon. Use /icon set.');
			}

			const updateFields: Partial<IconDocument> = { updatedAt: new Date() };
			if (url) updateFields.url = url;
			
			if (sizeStr) {
				const { valid, size, error } = validateSize(sizeStr);
				if (!valid) return this.errorReply(error!);
				updateFields.size = size;
			}

			await IconsDB.updateOne({ _id: userId }, { $set: updateFields });
			await updateIcons();

			const newSize = updateFields.size || existingDoc.size;
			const newUrl = updateFields.url || existingDoc.url;

			const targetHtml = nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetHtml}'s icon${formatSizeDisplay(newSize)}.`);
			sendIconNotifications(user, name, 'has updated your userlist icon', newUrl, newSize);
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!await IconsDB.exists({ _id: userId })) {
				return this.errorReply(`${target} does not have an icon.`);
			}

			await IconsDB.deleteOne({ _id: userId });
			await updateIcons();

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
