/*
* Pokemon Showdown
* Custom Symbol Commands
* @author PrinceSky-Git
*/

import { ImpulseDB } from '../../impulse-db';
import { FLO_UTILS } from '../../flo-utils';

const STAFF_ROOM_ID = 'staff';
const BLOCKED_SYMBOLS = ['➦', '~', '&', '@', '%', '*', '+'];

interface CustomSymbolDocument {
	_id: string;
	symbol: string;
	setBy: string;
}

const CustomSymbolDB = ImpulseDB<CustomSymbolDocument>('customsymbols');

const parseArgs = (target: string) => {
	const [name, symbol] = target.split(',').map(s => s.trim());
	return { name, userId: toID(name), symbol };
};

const validateSymbol = (symbol: string): { valid: boolean; error?: string } => {
	if (!symbol || symbol.length !== 1) {
		return { valid: false, error: 'Symbol must be a single character.' };
	}
	if (BLOCKED_SYMBOLS.includes(symbol)) {
		return { valid: false, error: `The following symbols are blocked: ${BLOCKED_SYMBOLS.join(' ')}` };
	}
	return { valid: true };
};

const applyCustomSymbol = async (userid: string): Promise<void> => {
	const user = Users.get(userid) as any;
	if (!user) return;

	const symbolDoc = await CustomSymbolDB.findOne(
		{ _id: userid },
		{ projection: { symbol: 1 } }
	);

	if (symbolDoc) {
		if (!user.originalGroup) user.originalGroup = user.tempGroup;
		user.customSymbol = symbolDoc.symbol;
		user.updateIdentity();
	}
};

const removeCustomSymbol = (userid: string): void => {
	const user = Users.get(userid) as any;
	if (!user) return;

	delete user.customSymbol;
	if (user.originalGroup) delete user.originalGroup;
	user.updateIdentity();
};

const sendSymbolNotifications = (
	staffUser: User,
	targetName: string,
	symbol: string,
	action: 'set' | 'updated' | 'removed'
): void => {
	const userId = toID(targetName);
	const staffHtml = FLO_UTILS.nameColor(staffUser.name, true, true);
	const targetHtml = FLO_UTILS.nameColor(targetName, true, false);
	const user = Users.get(userId);
	const room = Rooms.get(STAFF_ROOM_ID);

	if (action === 'removed') {
		if (user?.connected) {
			user.popup(`|html|${staffHtml} has removed your custom symbol.<br /><center>Refresh to see changes.</center>`);
		}
		if (room) {
			room.add(`|html|<div class="infobox">${staffHtml} removed custom symbol for ${targetHtml}.</div>`).update();
		}
		return;
	}

	if (user?.connected) {
		const msg = `${staffHtml} has ${action} your custom symbol to: <strong>${symbol}</strong><br /><center>Refresh to see changes.</center>`;
		user.popup(`|html|${msg}`);
	}

	if (room) {
		const msg = `${staffHtml} ${action} custom symbol for ${targetHtml}: <strong>${symbol}</strong>`;
		room.add(`|html|<div class="infobox">${msg}</div>`).update();
	}
};

export const commands: Chat.ChatCommands = {
	customsymbol: 'symbol',
	cs: 'symbol',
	symbol: {
		''(target) {
			this.parse('/symbolhelp');
		},

		async set(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, symbol } = parseArgs(target);

			if (!name || !symbol) return this.parse('/cs help');
			if (userId.length > 19) {
        throw new Chat.ErrorMessage('Usernames are not this long...');
      }

			const validation = validateSymbol(symbol);
			if (!validation.valid) {
        throw new Chat.ErrorMessage(validation.error!);
      }

			if (await CustomSymbolDB.exists({ _id: userId })) {
				throw new Chat.ErrorMessage('User already has symbol. Use /symbol update or /symbol delete.');
			}

			const now = new Date();
			await CustomSymbolDB.insertOne({
				_id: userId,
				symbol,
				setBy: user.name,
			});

			await applyCustomSymbol(userId);

			const targetHtml = FLO_UTILS.nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetHtml} the custom symbol: ${symbol}`);
			sendSymbolNotifications(user, name, symbol, 'set');
		},

		async update(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, symbol } = parseArgs(target);

			if (!name || !symbol) return this.parse('/sc help');

			const validation = validateSymbol(symbol);
			if (!validation.valid) {
        throw new Chat.ErrorMessage(validation.error!);
      }

			if (!await CustomSymbolDB.exists({ _id: userId })) {
				throw new Chat.ErrorMessage('User does not have symbol. Use /symbol set.');
			}

			await CustomSymbolDB.updateOne(
				{ _id: userId },
				{ $set: { symbol } }
			);
			await applyCustomSymbol(userId);

			const targetHtml = FLO_UTILS.nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetHtml}'s custom symbol to: ${symbol}`);
			sendSymbolNotifications(user, name, symbol, 'updated');
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!await CustomSymbolDB.exists({ _id: userId })) {
				throw new Chat.ErrorMessage(`${target} does not have a custom symbol.`);
			}

			await CustomSymbolDB.deleteOne({ _id: userId });
			removeCustomSymbol(userId);

			this.sendReply(`You removed ${target}'s custom symbol.`);
			sendSymbolNotifications(user, target, '', 'removed');
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/symbol set [user], [symbol]", desc: "Set custom symbol. Requires: &." },
				{ cmd: "/symbol update [user], [symbol]", desc: "Update symbol. Requires: &." },
				{ cmd: "/symbol delete [user]", desc: "Remove custom symbol. Requires: &." },
			];
			
			const listHtml = helpList.map(({ cmd, desc }) => 
				`<li><b>${cmd}</b> - ${desc}</li>`
			).join('<hr>');

			const html = [
				`<center><strong>Custom Symbol Commands:</strong><br>Alias: /cs</center>`,
				`<hr><ul style="list-style-type:none;padding-left:0;">`,
				listHtml,
				`</ul><small>Blocked symbols: ${BLOCKED_SYMBOLS.join(' ')}</small>`
			].join('');
			
			this.sendReplyBox(html);
		},
	},

	symbolhelp: 'symbol.help',
};

export const loginfilter: Chat.LoginFilter = user => {
	void applyCustomSymbol(user.id);
};

// Monkey Patching
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
