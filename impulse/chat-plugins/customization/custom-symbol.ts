/*
* Pokemon Showdown
* Custom Symbol Commands
* @author PrinceSky-Git
*/

import { FS } from '../../../lib/fs';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';
const SYMBOLS_FILE = 'config/custom-symbols.json';

interface CustomSymbolDocument {
	_id: string;
	symbol: string;
	setBy: string;
	createdAt: string;
	updatedAt: string;
}

interface CustomSymbolsData {
	[userId: string]: CustomSymbolDocument;
}

let customSymbols: CustomSymbolsData = {};

const loadSymbols = async (): Promise<void> => {
	const data = await FS(SYMBOLS_FILE).readIfExists();
	customSymbols = data ? JSON.parse(data) : {};
};

const saveSymbols = async (): Promise<void> => {
	await FS(SYMBOLS_FILE).safeWrite(JSON.stringify(customSymbols, null, 2));
};

const applyCustomSymbol = (userid: string): void => {
	const user = Users.get(userid);
	if (!user) return;

	const symbolDoc = customSymbols[userid];
	if (symbolDoc) {
		if (!(user as any).originalGroup) (user as any).originalGroup = user.tempGroup;
		(user as any).customSymbol = symbolDoc.symbol;
		user.updateIdentity();
	}
};

const removeCustomSymbol = (userid: string): void => {
	const user = Users.get(userid);
	if (!user) return;

	delete (user as any).customSymbol;
	if ((user as any).originalGroup) delete (user as any).originalGroup;
	user.updateIdentity();
};

const notifyUser = (userId: string, staffName: string, symbol: string, action: string): void => {
	const user = Users.get(userId);
	if (user?.connected) {
		user.popup(`|html|${nameColor(staffName, true, true)} ${action} your custom symbol to: <strong>${symbol}</strong><br /><center>Refresh to see changes.</center>`);
	}
};

const notifyStaff = (staffName: string, targetName: string, symbol: string, action: string): void => {
	const room = Rooms.get(STAFF_ROOM_ID);
	if (room) {
		room.add(`|html|<div class="infobox">${nameColor(staffName, true, true)} ${action} custom symbol for ${nameColor(targetName, true, false)}: <strong>${symbol}</strong></div>`).update();
	}
};

export const commands: Chat.ChatCommands = {
	customsymbol: 'symbol',
	cs: 'symbol',
	symbol: {
		''(target, room, user): void {
			this.parse('/symbolhelp');
		},

		async set(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const [name, symbol] = target.split(',').map(s => s.trim());
			if (!name || !symbol) return this.parse('/help symbol');

			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');
			if (symbol.length !== 1) return this.errorReply('Symbol must be a single character.');

			if (customSymbols[userId]) {
				return this.errorReply('User already has symbol. Use /symbol update or /symbol delete.');
			}

			const now = new Date().toISOString();
			customSymbols[userId] = { _id: userId, symbol, setBy: user.id, createdAt: now, updatedAt: now };
			await saveSymbols();

			applyCustomSymbol(userId);

			this.sendReply(`|raw|You have given ${nameColor(name, true, false)} the custom symbol: ${symbol}`);
			notifyUser(userId, user.name, symbol, 'has set');
			notifyStaff(user.name, name, symbol, 'set');
		},

		async update(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const [name, symbol] = target.split(',').map(s => s.trim());
			if (!name || !symbol) return this.parse('/help symbol');

			const userId = toID(name);

			if (!customSymbols[userId]) {
				return this.errorReply('User does not have symbol. Use /symbol set.');
			}

			if (symbol.length !== 1) return this.errorReply('Symbol must be a single character.');

			customSymbols[userId].symbol = symbol;
			customSymbols[userId].updatedAt = new Date().toISOString();
			await saveSymbols();

			applyCustomSymbol(userId);

			this.sendReply(`|raw|You have updated ${nameColor(name, true, false)}'s custom symbol to: ${symbol}`);
			notifyUser(userId, user.name, symbol, 'has updated');
			notifyStaff(user.name, name, symbol, 'updated');
		},

		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!customSymbols[userId]) {
				return this.errorReply(`${target} does not have a custom symbol.`);
			}

			delete customSymbols[userId];
			await saveSymbols();

			removeCustomSymbol(userId);

			this.sendReply(`You removed ${target}'s custom symbol.`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${nameColor(user.name, true, true)} has removed your custom symbol.<br /><center>Refresh to see changes.</center>`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${nameColor(user.name, true, true)} removed custom symbol for ${nameColor(target, true, false)}.</div>`).update();
			}
		},

		list(target, room, user): void {
			this.checkCan('roomowner');

			const allSymbols = Object.values(customSymbols).sort((a, b) => a._id.localeCompare(b._id));
			const total = allSymbols.length;

			if (total === 0) return this.sendReply('No custom symbols have been set.');

			const page = parseInt(target) || 1;
			const limit = 20;
			const totalPages = Math.ceil(total / limit);
			const startIdx = (page - 1) * limit;
			const endIdx = startIdx + limit;
			const pageSymbols = allSymbols.slice(startIdx, endIdx);

			const rows: string[][] = pageSymbols.map(doc => [
				doc._id,
				`<strong style="font-size: 16px;">${doc.symbol}</strong>`,
				Chat.escapeHTML(doc.setBy || 'Unknown'),
			]);

			let output = generateThemedTable(
				`Custom Symbols (Page ${page}/${totalPages})`,
				['User', 'Symbol', 'Set By'],
				rows,
			);

			if (totalPages > 1) {
				output += `<div class="pad"><center>`;
				if (page > 1) {
					output += `<button class="button" name="send" value="/symbol list ${page - 1}">Previous</button> `;
				}
				if (page < totalPages) {
					output += `<button class="button" name="send" value="/symbol list ${page + 1}">Next</button>`;
				}
				output += `</center></div>`;
			}

			this.sendReply(`|raw|${output}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/symbol set [user], [symbol]", desc: "Set custom symbol. Requires: &." },
				{ cmd: "/symbol update [user], [symbol]", desc: "Update symbol. Requires: &." },
				{ cmd: "/symbol delete [user]", desc: "Remove custom symbol. Requires: &." },
				{ cmd: "/symbol list [page]", desc: "List custom symbols. Requires: &." },
			];
			const html = `<center><strong>Custom Symbol Commands:</strong><br>Alias: /cs</center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},

	symbolhelp: 'symbol.help',
};

export const loginfilter: Chat.LoginFilter = user => {
	applyCustomSymbol(user.id);
};

const originalGetIdentity = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function (room: BasicRoom | null = null): string {
	const customSymbol = (this as any).customSymbol;

	if (!customSymbol) return originalGetIdentity.call(this, room);

	const punishgroups = Config.punishgroups || { locked: null, muted: null };
	if (this.locked || this.namelocked) {
		return (punishgroups.locked?.symbol || '\u203d') + this.name;
	}

	if (room) {
		if (room.isMuted(this)) {
			return (punishgroups.muted?.symbol || '!') + this.name;
		}
		const roomGroup = room.auth.get(this);
		if (roomGroup === this.tempGroup || roomGroup === ' ') {
			return customSymbol + this.name;
		}
		return roomGroup + this.name;
	}

	if (this.semilocked) {
		return (punishgroups.muted?.symbol || '!') + this.name;
	}

	return customSymbol + this.name;
};

void loadSymbols();
