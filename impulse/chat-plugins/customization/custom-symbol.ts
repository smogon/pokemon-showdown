/*
* Pokemon Showdown
* Custom Symbol Commands
* @author PrinceSky-Git
*/

import { ImpulseDB } from '../../impulse-db';
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

	const symbolDoc = await CustomSymbolDB.findOne(
		{ _id: userid },
		{ projection: { symbol: 1 } }
	);
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

const sendSymbolNotifications = (
	staffUser: User,
	targetName: string,
	symbol: string,
	action: 'set' | 'updated' | 'removed'
): void => {
	const userId = toID(targetName);
	const staffNameColor = nameColor(staffUser.name, true, true);
	const targetNameColor = nameColor(targetName, true, false);

	if (action !== 'removed') {
		const user = Users.get(userId);
		if (user?.connected) {
			const msg = `${staffNameColor} has ${action} your custom symbol to: <strong>${symbol}</strong>` +
				`<br /><center>Refresh to see changes.</center>`;
			user.popup(`|html|${msg}`);
		}

		const room = Rooms.get(STAFF_ROOM_ID);
		if (room) {
			const msg = `${staffNameColor} ${action} custom symbol for ${targetNameColor}: ` +
				`<strong>${symbol}</strong>`;
			room.add(`|html|<div class="infobox">${msg}</div>`).update();
		}
	} else {
		const user = Users.get(userId);
		if (user?.connected) {
			const msg = `${staffNameColor} has removed your custom symbol.` +
				`<br /><center>Refresh to see changes.</center>`;
			user.popup(`|html|${msg}`);
		}

		const room = Rooms.get(STAFF_ROOM_ID);
		if (room) {
			const msg = `${staffNameColor} removed custom symbol for ${targetNameColor}.`;
			room.add(`|html|<div class="infobox">${msg}</div>`).update();
		}
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
			if (!name || !symbol) return this.parse('/cs help');

			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');
			if (symbol.length !== 1) return this.errorReply('Symbol must be a single character.');

			if (await CustomSymbolDB.exists({ _id: userId })) {
				return this.errorReply(
					'User already has symbol. Use /symbol update or /symbol delete.'
				);
			}

			const now = new Date();
			await CustomSymbolDB.insertOne({
				_id: userId,
				symbol,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			});

			await applyCustomSymbol(userId);

			const targetNameColor = nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetNameColor} the custom symbol: ${symbol}`);
			
			sendSymbolNotifications(user, name, symbol, 'set');
		},

		async update(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const [name, symbol] = target.split(',').map(s => s.trim());
			if (!name || !symbol) return this.parse('/sc help');

			const userId = toID(name);

			if (!await CustomSymbolDB.exists({ _id: userId })) {
				return this.errorReply('User does not have symbol. Use /symbol set.');
			}

			if (symbol.length !== 1) return this.errorReply('Symbol must be a single character.');

			await CustomSymbolDB.updateOne(
				{ _id: userId },
				{ $set: { symbol, updatedAt: new Date() } }
			);
			await applyCustomSymbol(userId);

			const targetNameColor = nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetNameColor}'s custom symbol to: ${symbol}`);
			
			sendSymbolNotifications(user, name, symbol, 'updated');
		},

		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!await CustomSymbolDB.exists({ _id: userId })) {
				return this.errorReply(`${target} does not have a custom symbol.`);
			}

			await CustomSymbolDB.deleteOne({ _id: userId });
			removeCustomSymbol(userId);

			this.sendReply(`You removed ${target}'s custom symbol.`);

			sendSymbolNotifications(user, target, '', 'removed');
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/symbol set [user], [symbol]",
					desc: "Set custom symbol. Requires: &.",
				},
				{
					cmd: "/symbol update [user], [symbol]",
					desc: "Update symbol. Requires: &.",
				},
				{
					cmd: "/symbol delete [user]",
					desc: "Remove custom symbol. Requires: &.",
				},
			];
			const html = `<center><strong>Custom Symbol Commands:</strong><br>Alias: /cs</center>` +
				`<hr><ul style="list-style-type:none;padding-left:0;">` +
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
	void applyCustomSymbol(user.id);
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
