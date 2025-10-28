/*
* Pokemon Showdown
* Custom Symbol Commands
* @author PrinceSky-Git
*/

import { ImpulseDB } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';

interface CustomSymbolDocument {
	_id: string;
	symbol: string;
	setBy: string;
	createdAt: Date;
	updatedAt: Date;
}

const CustomSymbolDB = ImpulseDB<CustomSymbolDocument>('customsymbols');

const applyCustomSymbol = async (userid: string): Promise<void> => {
	const user = Users.get(userid);
	if (!user) return;

	const symbolDoc = await CustomSymbolDB.findOne({ _id: userid }, { projection: { symbol: 1 } });
	if (symbolDoc) {
		if (!(user as any).originalGroup) (user as any).originalGroup = user.tempGroup;
		(user as any).customSymbol = symbolDoc.symbol;
		user.updateIdentity();
	}
};

const removeCustomSymbol = async (userid: string): Promise<void> => {
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

			if (await CustomSymbolDB.exists({ _id: userId })) {
				return this.errorReply('User already has symbol. Use /symbol update or /symbol delete.');
			}

			const now = new Date();
			await CustomSymbolDB.insertOne({ _id: userId, symbol, setBy: user.id, createdAt: now, updatedAt: now });

			await applyCustomSymbol(userId);

			this.sendReply(`|raw|You have given ${nameColor(name, true, false)} the custom symbol: ${symbol}`);
			notifyUser(userId, user.name, symbol, 'has set');
			notifyStaff(user.name, name, symbol, 'set');
		},

		async update(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const [name, symbol] = target.split(',').map(s => s.trim());
			if (!name || !symbol) return this.parse('/help symbol');

			const userId = toID(name);

			if (!await CustomSymbolDB.exists({ _id: userId })) {
				return this.errorReply('User does not have symbol. Use /symbol set.');
			}

			if (symbol.length !== 1) return this.errorReply('Symbol must be a single character.');

			await CustomSymbolDB.updateOne({ _id: userId }, { $set: { symbol, updatedAt: new Date() } });
			await applyCustomSymbol(userId);

			this.sendReply(`|raw|You have updated ${nameColor(name, true, false)}'s custom symbol to: ${symbol}`);
			notifyUser(userId, user.name, symbol, 'has updated');
			notifyStaff(user.name, name, symbol, 'updated');
		},

		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!await CustomSymbolDB.exists({ _id: userId })) {
				return this.errorReply(`${target} does not have a custom symbol.`);
			}

			const symbolDoc = await CustomSymbolDB.findOne({ _id: userId }, { projection: { symbol: 1 } });
			await CustomSymbolDB.deleteOne({ _id: userId });
			await removeCustomSymbol(userId);

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

		async list(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const result = await CustomSymbolDB.findPaginated({}, { page: parseInt(target) || 1, limit: 20, sort: { _id: 1 } });

			if (result.total === 0) return this.sendReply('No custom symbols have been set.');

			const rows: string[][] = result.docs.map(doc => [
				doc._id,
				`<strong style="font-size: 16px;">${doc.symbol}</strong>`,
				Chat.escapeHTML(doc.setBy || 'Unknown'),
			]);

			let output = generateThemedTable(
				`Custom Symbols (Page ${result.page}/${result.totalPages})`,
				['User', 'Symbol', 'Set By'],
				rows,
			);

			if (result.totalPages > 1) {
				output += `<div class="pad"><center>`;
				if (result.hasPrev) output += `<button class="button" name="send" value="/symbol list ${result.page - 1}">Previous</button> `;
				if (result.hasNext) output += `<button class="button" name="send" value="/symbol list ${result.page + 1}">Next</button>`;
				output += `</center></div>`;
			}

			this.sendReply(`|raw|${output}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{cmd: "/symbol set [user], [symbol]", desc: "Set custom symbol. Requires: &."},
				{cmd: "/symbol update [user], [symbol]", desc: "Update symbol. Requires: &."},
				{cmd: "/symbol delete [user]", desc: "Remove custom symbol. Requires: &."},
				{cmd: "/symbol list [page]", desc: "List custom symbols. Requires: &."},
				];
			const html = `<center><strong>Custom Symbol Commands:</strong><br>Alias: /cs</center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({cmd, desc}, i) =>
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
	const clanTag = (this as any).clanTag;

	if (!customSymbol) return originalGetIdentity.call(this, room);

	const punishgroups = Config.punishgroups || { locked: null, muted: null };
	if (this.locked || this.namelocked) {
		return (punishgroups.locked?.symbol || '\u203d') + this.name + (clanTag ? ` [${clanTag}]` : '');
	}

	if (room) {
		if (room.isMuted(this)) {
			return (punishgroups.muted?.symbol || '!') + this.name + (clanTag ? ` [${clanTag}]` : '');
		}
		const roomGroup = room.auth.get(this);
		if (roomGroup === this.tempGroup || roomGroup === ' ') {
			return customSymbol + this.name + (clanTag ? ` [${clanTag}]` : '');
		}
		return roomGroup + this.name + (clanTag ? ` [${clanTag}]` : '');
	}

	if (this.semilocked) {
		return (punishgroups.muted?.symbol || '!') + this.name + (clanTag ? ` [${clanTag}]` : '');
	}

	return customSymbol + this.name + (clanTag ? ` [${clanTag}]` : '');
};
