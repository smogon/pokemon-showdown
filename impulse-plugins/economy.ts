/*************************************
* Pokemon Showdown Economy Commands  *
* author: @PrinceSky                 *
**************************************/

import { FS } from '../lib/fs';

const ECONOMY_SETTINGS = {
	MONEY_FILE: 'impulse-db/money.json',
	LOGS_FILE: 'impulse-db/moneylogs.json',
	DEFAULT_AMOUNT: 0,
	CURRENCY: 'coins'
} as const;

Impulse.currency = ECONOMY_SETTINGS.CURRENCY;

type MoneyAction = 'give' | 'take' | 'transfer' | 'reset';

interface EconomyData {
	[userid: string]: number;
}

interface EconomyLogEntry {
	timestamp: number;
	action: MoneyAction;
	from?: string;
	to: string;
	amount: number;
	by?: string;
}

interface EconomyLogs {
	logs: EconomyLogEntry[];
}

export class Economy {
	private static data: EconomyData = Economy.loadData();
	private static logs: EconomyLogs = Economy.loadLogs();
	
	private static loadData(): EconomyData {
		try {
			const rawData = FS(ECONOMY_SETTINGS.MONEY_FILE).readIfExistsSync();
			return rawData ? JSON.parse(rawData) : {};
		} catch (error) {
			console.error(`Error reading economy data: ${error}`);
			return {};
		}
	}
	
	private static saveData(): void {
		try {
			const dataToWrite = Object.fromEntries(
				Object.entries(this.data).map(([id, amount]) => [toID(id), amount])
			);
			FS(ECONOMY_SETTINGS.MONEY_FILE).writeUpdate(() => JSON.stringify(dataToWrite, null, 2));
		} catch (error) {
			console.error(`Error saving economy data: ${error}`);
		}
	}
	
	private static loadLogs(): EconomyLogs {
		try {
			const rawLogs = FS(ECONOMY_SETTINGS.LOGS_FILE).readIfExistsSync();
			return rawLogs ? JSON.parse(rawLogs) : { logs: [] };
		} catch (error) {
			console.error(`Error reading economy logs: ${error}`);
			return { logs: [] };
		}
	}
	
	private static saveLogs(): void {
		try {
			FS(ECONOMY_SETTINGS.LOGS_FILE).writeUpdate(() => JSON.stringify(this.logs, null, 2));
		} catch (error) {
			console.error(`Error saving economy logs: ${error}`);
		}
	}
	
	private static logAction(entry: Omit<EconomyLogEntry, 'timestamp'>): void {
		this.logs.logs.push({ timestamp: Date.now(), ...entry });
		this.saveLogs();
	}
	
	static writeMoney(userid: string, amount: number): void {
		this.data[toID(userid)] = amount;
		this.saveData();
	}
	
	static readMoney(userid: string): number {
		return this.data[toID(userid)] || ECONOMY_SETTINGS.DEFAULT_AMOUNT;
	}
	
	static hasMoney(userid: string, amount: number): boolean {
		return this.readMoney(userid) >= amount;
	}
	
	static addMoney(userid: string, amount: number, reason?: string, by?: string): number {
		const id = toID(userid);
		this.data[id] = (this.data[id] || 0) + amount;
		this.saveData();
		this.logAction({ action: 'give', to: id, amount, by });
		return this.data[id];
	}
	
	static takeMoney(userid: string, amount: number, reason?: string, by?: string): number {
		const id = toID(userid);
		const currentMoney = this.data[id] || 0;
		if (currentMoney >= amount) {
			this.data[id] = currentMoney - amount;
			this.saveData();
			this.logAction({ action: 'take', to: id, amount, by });
		}
		return this.data[id] || currentMoney;
	}
	
	static resetAllMoney(): void {
		this.data = {};
		this.saveData();
		this.logAction({ action: 'reset', to: 'all', amount: 0 });
	}
	
	static getRichestUsers(limit: number = 100): [string, number][] {
		return Object.entries(this.data)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit);
	}
	
	static getEconomyLogs(userid?: string, page: number = 1, entriesPerPage: number = 100): EconomyLogEntry[] {
		let logs = this.logs.logs;
		if (userid) {
			const id = toID(userid);
			logs = logs.filter(log => log.to === id || log.from === id || log.by === id);
		}
		const startIndex = (page - 1) * entriesPerPage;
		return [...logs].reverse().slice(startIndex, startIndex + entriesPerPage);
	}
	
	static getTotalLogPages(userid?: string, entriesPerPage: number = 100): number {
		let logsCount = this.logs.logs.length;
		if (userid) {
			const id = toID(userid);
			logsCount = this.logs.logs.filter(
				log => log.to === id || log.from === id || log.by === id
			).length;
		}
		return Math.ceil(logsCount / entriesPerPage) || 1;
	}
}

global.Economy = Economy;

const createPopup = (user: any, message: string) => {
	if (user.connected) {
		user.popup(`|html|${message}`);
	}
};

const formatMoneyMessage = (user: string, target: string, amount: number, reason: string) => {
	return `${Impulse.nameColor(user, true, true)} ${amount} ${ECONOMY_SETTINGS.CURRENCY} ${target} ${Impulse.nameColor(target, true, true)} (${reason})`;
};

export const commands: ChatCommands = {
	atm: 'balance',
	balance(target, room, user) {
		if (!this.runBroadcast()) return;
		const userid = toID(target || user.name);
		const balance = Economy.readMoney(userid);
		this.sendReplyBox(`${Impulse.nameColor(userid, true, true)} has ${balance} ${ECONOMY_SETTINGS.CURRENCY}.`);
	},
	
	givemoney(target, room, user) {
		this.checkCan('globalban');
		const [targetUser, amount, ...reasonParts] = target.split(',').map(p => p.trim());
		const reason = reasonParts.join(',') || 'No reason specified.';
		if (!targetUser || !amount) {
			return this.sendReply(`Usage: /givemoney [user], [amount], [reason]`);
		}
		const recipient = Users.get(targetUser);
		const parsedAmount = parseInt(amount);
		if (!recipient) return this.errorReply(`User "${targetUser}" not found.`);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return this.errorReply(`Please specify a valid positive amount.`);
		}
		Economy.addMoney(recipient.id, parsedAmount, reason, user.id);
		this.sendReplyBox(formatMoneyMessage(user.name, 'gave to', parsedAmount, reason));
		this.modlog('GIVEMONEY', recipient, `${parsedAmount} ${ECONOMY_SETTINGS.CURRENCY}`, { by: user.id, reason });
		createPopup(recipient, `You received <b>${parsedAmount} ${ECONOMY_SETTINGS.CURRENCY}</b> from <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>Reason: ${reason}`);
	},
	
	takemoney(target, room, user) {
		this.checkCan('globalban');
		const [targetUser, amount, ...reasonParts] = target.split(',').map(p => p.trim());
		const reason = reasonParts.join(',') || 'No reason specified.';
		if (!targetUser || !amount) {
			return this.sendReply(`Usage: /takemoney [user], [amount], [reason]`);
		}
		const recipient = Users.get(targetUser);
		const parsedAmount = parseInt(amount);
		if (!recipient) return this.errorReply(`User "${targetUser}" not found.`);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return this.errorReply(`Please specify a valid positive amount.`);
		}
		Economy.takeMoney(recipient.id, parsedAmount, reason, user.id);
		this.sendReplyBox(formatMoneyMessage(user.name, 'took from', parsedAmount, reason));
		this.modlog('TAKEMONEY', recipient, `${parsedAmount} ${ECONOMY_SETTINGS.CURRENCY}`, { by: user.id, reason });
		createPopup(recipient, `<b>${Impulse.nameColor(user.name, true, true)}</b> took <b>${parsedAmount} ${ECONOMY_SETTINGS.CURRENCY}</b> from you.<br>Reason: ${reason}`);
	},
	
	transfermoney(target, room, user) {
		const [recipient, amount, ...reasonParts] = target.split(',').map(p => p.trim());
		const reason = reasonParts.join(',') || 'No reason specified.';
		if (!recipient || !amount) {
			return this.sendReply(`Usage: /transfermoney [user], [amount], [reason]`);
		}
		const targetUser = Users.get(recipient);
		const parsedAmount = parseInt(amount);
		if (!targetUser) return this.errorReply(`User "${recipient}" not found.`);
		if (targetUser.id === user.id) {
			return this.errorReply(`You cannot transfer money to yourself.`);
		}
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return this.errorReply(`Please specify a valid positive amount.`);
		}
		if (!Economy.hasMoney(user.id, parsedAmount)) {
			return this.errorReply(`You do not have enough ${ECONOMY_SETTINGS.CURRENCY} to transfer ${parsedAmount}.`);
		}
		Economy.takeMoney(user.id, parsedAmount);
		Economy.addMoney(targetUser.id, parsedAmount, reason, user.id);
		Economy.logAction({ action: 'transfer', from: user.id, to: targetUser.id, amount: parsedAmount, by: user.id });
		this.sendReplyBox(`${formatMoneyMessage(user.name, 'transferred to', parsedAmount, reason)}<br/>Your new balance is ${Economy.readMoney(user.id)} ${ECONOMY_SETTINGS.CURRENCY}.`);
		createPopup(targetUser, `<b>${Impulse.nameColor(user.name, true, true)}</b> transferred <b>${parsedAmount} ${ECONOMY_SETTINGS.CURRENCY}</b> to you.<br>Reason: ${reason}`);
	},
	
	resetmoney(target, room, user) {
		this.checkCan('globalban');
		const [targetUser, ...reasonParts] = target.split(',').map(p => p.trim());
		const reason = reasonParts.join(',') || 'No reason specified.';
		if (!targetUser) return this.sendReply(`Usage: /resetmoney [user], [reason]`);
		const recipient = Users.get(targetUser);
		if (!recipient) return this.errorReply(`User "${targetUser}" not found.`);
		Economy.writeMoney(recipient.id, ECONOMY_SETTINGS.DEFAULT_AMOUNT);
		Economy.logAction({ action: 'reset', to: recipient.id, amount: ECONOMY_SETTINGS.DEFAULT_AMOUNT, by: user.id });
		this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} reset ${Impulse.nameColor(recipient.name, true, true)}'s balance to ${ECONOMY_SETTINGS.DEFAULT_AMOUNT} ${ECONOMY_SETTINGS.CURRENCY} (${reason}).`);
		this.modlog('RESETMONEY', recipient, `${ECONOMY_SETTINGS.DEFAULT_AMOUNT} ${ECONOMY_SETTINGS.CURRENCY}`, { by: user.id, reason });
		createPopup(recipient, `Your ${ECONOMY_SETTINGS.CURRENCY} balance has been reset to <b>${ECONOMY_SETTINGS.DEFAULT_AMOUNT}</b> by <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>Reason: ${reason}`);
	},
	
	resetmoneyall(target, room, user) {
		this.checkCan('globalban');
		const reason = target.trim() || 'No reason specified.';
		Economy.resetAllMoney();
		this.sendReplyBox(`All user balances have been reset to ${ECONOMY_SETTINGS.DEFAULT_AMOUNT} ${ECONOMY_SETTINGS.CURRENCY} (${reason}).`);
		this.modlog('RESETMONEYALL', null, `all balances to ${ECONOMY_SETTINGS.DEFAULT_AMOUNT} ${ECONOMY_SETTINGS.CURRENCY}`, { by: user.id, reason });
		if (room) {
			room.add(`|html|<center><div class="broadcast-blue"><b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${ECONOMY_SETTINGS.CURRENCY} balances to <b>${ECONOMY_SETTINGS.DEFAULT_AMOUNT}</b>.<br>Reason: ${reason}</div></center>`);
			room.update();
		}
	},
	
	richestusers(target, room, user) {
		if (!this.runBroadcast()) return;
		const richest = Economy.getRichestUsers(100);
		if (!richest.length) {
			return this.sendReplyBox(`No users have any ${ECONOMY_SETTINGS.CURRENCY} yet.`);
		}
		
		const data = richest.map(([userid, balance], index) => [
			(index + 1).toString(),
			Impulse.nameColor(userid, true, true),
			`${balance} ${ECONOMY_SETTINGS.CURRENCY}`,
		]);
		const output = Impulse.generateThemedTable(
			`Top ${richest.length} Richest Users`,
			['Rank', 'User', 'Balance'],
			data,
			Impulse.nameColor('TurboRx', true, true)
		);
		this.ImpulseReplyBox(output);
	},
	
	economylogs(target, room, user) {
		if (!this.runBroadcast()) return;
		this.checkCan('globalban');
		const [targetUser, page = '1'] = target.split(',').map(p => p.trim());
		const parsedPage = parseInt(page) || 1;
		const useridFilter = targetUser ? Users.get(targetUser)?.id : null;
		const logs = Economy.getEconomyLogs(useridFilter, parsedPage);
		const totalPages = Economy.getTotalLogPages(useridFilter);
		if (!logs.length) {
			return this.sendReplyBox(`No economy logs found${useridFilter ? ` for ${Impulse.nameColor(useridFilter, true, true)}` : ''}.`);
		}
		const totalLogs = useridFilter
			? Economy.logs.logs.filter(log => log.to === useridFilter || log.from === useridFilter || log.by === useridFilter).length
			: Economy.logs.logs.length;
		const data = logs.map(log => [
			new Date(log.timestamp).toLocaleString(),
			log.action,
			log.by ? Impulse.nameColor(log.by, false, false) : '-',
			log.from ? Impulse.nameColor(log.from, false, false) : '-',
			Impulse.nameColor(log.to, false, false),
			`${log.amount} ${ECONOMY_SETTINGS.CURRENCY}`
		]);
		const tableHTML = Impulse.generateThemedTable(
			`${useridFilter ? `Economy Logs for ${Impulse.nameColor(useridFilter, true, true)}` : 'Recent Economy Logs'} (${totalLogs} total logs) (Page ${parsedPage} of ${totalPages})`,
			['Time', 'Action', 'By', 'From', 'To', 'Amount'],
			data
		);
		const paginationHTML = totalPages > 1
			? `<div style="text-align: center; margin-top: 5px;">Page: ${parsedPage} / ${totalPages}${
				parsedPage > 1 
				? ` <button class="button" name="send" value="/economylogs ${targetUser || ''}, ${parsedPage - 1}">Previous</button>` 
				: ''
			}${
				parsedPage < totalPages 
				? ` <button class="button" name="send" value="/economylogs ${targetUser || ''}, ${parsedPage + 1}">Next</button>` 
				: ''
			}</div>`
			: '';
		this.ImpulseReplyBox(`<div style="max-height: 400px; overflow: auto;" data-uhtml="${useridFilter}-${parsedPage}">${tableHTML}</div>${paginationHTML}`);
	},
	
	economyhelp(target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<div><b><center>Economy Commands By ${Impulse.nameColor('Prince Sky', true, true)}</center></b>` +
			`<ul>` +
			`<li><code>/balance</code> (or <code>/atm</code>) - Check your or another user's ${ECONOMY_SETTINGS.CURRENCY} balance.</li>` +
         `<li><code>/givemoney [user], [amount], [reason]</code> - Give a specified amount of ${ECONOMY_SETTINGS.CURRENCY} to a user. (Requires: @ and higher)</li>` +
         `<li><code>/takemoney [user], [amount], [reason]</code> - Take a specified amount of ${ECONOMY_SETTINGS.CURRENCY} from a user. (Requires: @ and higher)</li>` +
         `<li><code>/transfermoney [user], [amount], [reason]</code> - Transfer a specified amount of your ${ECONOMY_SETTINGS.CURRENCY} to another user.</li>` +
         `<li><code>/resetmoney [user], [reason]</code> - Reset a user's ${ECONOMY_SETTINGS.CURRENCY} balance to ${ECONOMY_SETTINGS.DEFAULT_AMOUNT}. (Requires: @ and higher)</li>` +
         `<li><code>/resetmoneyall [reason]</code> - Reset all users' ${ECONOMY_SETTINGS.CURRENCY} balances to ${ECONOMY_SETTINGS.DEFAULT_AMOUNT}. (Requires: @ and higher)</li>` +
         `<li><code>/richestusers</code> - View the top 100 users with the most ${ECONOMY_SETTINGS.CURRENCY}.</li>` +
         `<li><code>/economylogs [user], [page]</code> - View economy logs, optionally filtered by user and page number.</li>` +
       `</ul></div>`
    );
  },
};
