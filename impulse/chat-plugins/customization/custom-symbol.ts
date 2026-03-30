/*
* Pokemon Showdown - Impulse Server
* Custom Symbol Commands
* @author PrinceSky-Git
* Refactored By @PrinceSky-Git
*/
import { FS } from '../../../lib';
import { toID } from '../../../sim/dex';

const DATA_FILE = 'impulse/db/custom-symbol.json';
const STAFF_ROOM_ID = 'staff';
const BLOCKED_SYMBOLS = ['➦', '~', '&', '#', '@', '%', '*', '+'];

interface CustomSymbolEntry {
	symbol: string;
	setBy: string;
	createdAt: number;
	updatedAt: number;
}

interface CustomSymbolData {
	[userid: string]: CustomSymbolEntry;
}

let data: CustomSymbolData = {};

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
		console.error('Failed to load custom symbols:', e);
		data = {};
	}
};

void loadData();

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

const applyCustomSymbol = (userid: string): void => {
	const user = Users.get(userid) as any;
	if (!user) return;

	const symbolEntry = data[userid];

	if (symbolEntry) {
		if (!user.originalGroup) user.originalGroup = user.tempGroup;
		user.customSymbol = symbolEntry.symbol;
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
	const staffHtml = Impulse.nameColor(staffUser.name, true, true);
	const targetHtml = Impulse.nameColor(targetName, true, false);
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

		set(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, symbol } = parseArgs(target);

			if (!name || !symbol) return this.parse('/cs help');
			if (userId.length > 19) throw new Chat.ErrorMessage('Usernames are not this long...');

			const validation = validateSymbol(symbol);
			if (!validation.valid) throw new Chat.ErrorMessage(validation.error!);

			if (data[userId]) {
				throw new Chat.ErrorMessage('User already has symbol. Use /symbol update or /symbol delete.');
			}

			const now = Date.now();
			data[userId] = {
				symbol,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			};
			saveData();

			applyCustomSymbol(userId);

			const targetHtml = Impulse.nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetHtml} the custom symbol: ${symbol}`);
			sendSymbolNotifications(user, name, symbol, 'set');
		},

		update(target, room, user) {
			this.checkCan('roomowner');
			const { name, userId, symbol } = parseArgs(target);

			if (!name || !symbol) return this.parse('/sc help');

			const validation = validateSymbol(symbol);
			if (!validation.valid) throw new Chat.ErrorMessage(validation.error!);

			if (!data[userId]) {
				throw new Chat.ErrorMessage('User does not have symbol. Use /symbol set.');
			}

			data[userId].symbol = symbol;
			data[userId].updatedAt = Date.now();
			saveData();

			applyCustomSymbol(userId);

			const targetHtml = Impulse.nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetHtml}'s custom symbol to: ${symbol}`);
			sendSymbolNotifications(user, name, symbol, 'updated');
		},

		delete(target, room, user) {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!data[userId]) {
				throw new Chat.ErrorMessage(`${target} does not have a custom symbol.`);
			}

			delete data[userId];
			saveData();
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
	applyCustomSymbol(user.id);
};

const originalGetIdentity = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function(room: BasicRoom | null = null): string {
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
