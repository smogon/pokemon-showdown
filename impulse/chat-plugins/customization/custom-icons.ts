/*
* Pokemon Showdown
* Custom Icons Commands
* @author MusaddikTemkar
*/

import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';
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

const validateSize = (sizeStr: string | undefined): {
	valid: boolean,
	size: number,
	error?: string
} => {
	if (!sizeStr) return { valid: true, size: DEFAULT_ICON_SIZE };
	const size = parseInt(sizeStr);
	if (isNaN(size) || size < MIN_SIZE || size > MAX_SIZE) {
		return { valid: false, size: 0, error: `Invalid size. Use 1-${MAX_SIZE} pixels.` };
	}
	return { valid: true, size };
};

const updateIcons = async () => {
	try {
		const iconDocs = await IconsDB.find({}, { projection: { _id: 1, url: 1, size: 1 } });
		let css = '/* ICONS START */\n';
		const bust = cacheBuster();

		iconDocs.forEach(doc => {
			const size = doc.size || DEFAULT_ICON_SIZE;
			css += `[id$="-userlist-user-${doc._id}"] { background: url("${doc.url}${bust}") `;
			css += `right no-repeat !important; background-size: ${size}px!important;}\n`;
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
		const staffNameColor = nameColor(staffName, true, true);
		const iconDisplay = icon ? `: ${icon}` : '';
		const msg = `${staffNameColor} ${message}${iconDisplay}` +
			`<br /><center>Refresh if you don't see it.</center>`;
		user.popup(`|html|${msg}`);
	}
};

const notifyStaff = (staffName: string, targetName: string, action: string, icon?: string) => {
	const room = Rooms.get(STAFF_ROOM_ID);
	if (room) {
		const staffNameColor = nameColor(staffName, true, true);
		const targetNameColor = nameColor(targetName, true, false);
		const iconDisplay = icon ? `: ${icon}` : '';
		const msg = `${staffNameColor} ${action} ${targetNameColor}${iconDisplay}`;
		room.add(`|html|<div class="infobox">${msg}</div>`).update();
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
			if (!name || !imageUrl) return this.parse('/icon help');

			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');

			if (await IconsDB.exists({ _id: userId })) {
				return this.errorReply('User already has icon. Remove with /icon delete [user].');
			}

			const sizeCheck = validateSize(sizeStr);
			if (!sizeCheck.valid) return this.errorReply(sizeCheck.error);

			const now = new Date();
			await IconsDB.insertOne({
				_id: userId,
				url: imageUrl,
				size: sizeCheck.size,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			});

			await updateIcons();

			const sizeDisplay = sizeCheck.size !== DEFAULT_ICON_SIZE ?
				` (${sizeCheck.size}px)` :
				'';
			const targetNameColor = nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetNameColor} an icon${sizeDisplay}.`);

			const icon = displayIcon(imageUrl, sizeCheck.size);
			notifyUser(userId, user.name, `has set your userlist icon${sizeDisplay}`, icon);
			notifyStaff(user.name, name, `set icon for`, icon);
		},

		async update(target, room, user) {
			this.checkCan('roomowner');
			const [name, imageUrl, sizeStr] = target.split(',').map(s => s.trim());
			if (!name) return this.parse('/icon help');

			const userId = toID(name);
			if (!await IconsDB.exists({ _id: userId })) {
				return this.errorReply('User does not have icon. Use /icon set.');
			}

			const updateFields: any = { updatedAt: new Date() };

			if (imageUrl) {
				updateFields.url = imageUrl;
			}
			if (sizeStr) {
				const sizeCheck = validateSize(sizeStr);
				if (!sizeCheck.valid) return this.errorReply(sizeCheck.error);
				updateFields.size = sizeCheck.size;
			}

			await IconsDB.updateOne({ _id: userId }, { $set: updateFields });
			await updateIcons();

			const updatedIcon = await IconsDB.findOne(
				{ _id: userId },
				{ projection: { url: 1, size: 1 } }
			);
			const size = updatedIcon?.size || DEFAULT_ICON_SIZE;
			const url = updatedIcon?.url || imageUrl;
			const sizeDisplay = size !== DEFAULT_ICON_SIZE ? ` (${size}px)` : '';

			const targetNameColor = nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetNameColor}'s icon${sizeDisplay}.`);

			const icon = url ? displayIcon(url, size) : '';
			notifyUser(userId, user.name, `has updated your userlist icon${sizeDisplay}`, icon);
			notifyStaff(user.name, name, `updated icon for`, icon);
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
			notifyUser(userId, user.name, 'has removed your userlist icon.');
			notifyStaff(user.name, target, 'removed icon for');
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/icon set [user], [url], [size]",
					desc: `Set icon (${DEFAULT_ICON_SIZE}-${MAX_SIZE}px). Requires: &.`,
				},
				{
					cmd: "/icon update [user], [url], [size]",
					desc: "Update icon. Requires: &.",
				},
				{
					cmd: "/icon delete [user]",
					desc: "Remove icon. Requires: &.",
				},
			];
			const html = `<center><strong>Custom Icon Commands:</strong><br>Alias: /ic</center>` +
				`<hr><ul style="list-style-type:none;padding-left:0;">` +
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
