/*
* Pokemon Showdown
* Economy Commands
*/

import { Economy, CURRENCY } from '../../economy';
import { nameColor } from '../../colors';
import { generateThemedTable } from '../../utils';

const CURRENCYNAME = CURRENCY.name;

export const commands: Chat.ChatCommands = {
	bal: 'balance',
	money: 'balance',
	atm: 'balance',
	async balance(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;

		const targetUserid = toID(target) || user.id;
		
		const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
		const targetNameColor = nameColor(targetDisplayName, true, false);

		const targetUser = await Economy.getUser(targetUserid);

		const moneyDisplay = Economy.formatMoney(targetUser.balance);
		this.sendReplyBox(`${targetNameColor} has ${moneyDisplay} ${CURRENCYNAME}.`);
	},

	eco: {
		async transfer(target, room, user): Promise<void> {
			if (!target) return this.parse('/help eco');
	
			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);
	
			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}
			
			if (targetUserid === user.id) {
				return this.errorReply("You cannot transfer money to yourself.");
			}
	
			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}
			
			const fromUser = await Economy.getUser(user.id);
			if (fromUser.balance < amount) {
				return this.errorReply(`You do not have enough money to transfer ${Economy.formatMoney(amount)}. You have ${Economy.formatMoney(fromUser.balance)}.`);
			}
			
			const result = await Economy.transferMoney(user.id, targetUserid, amount);
	
			if (!result.success) {
				return this.errorReply(`Transfer failed: ${result.error}`);
			}
	
			this.sendReplyBox(`You successfully transferred ${Economy.formatMoney(amount)} ${CURRENCYNAME} to ${targetUserid}. Your new balance is ${Economy.formatMoney(result.fromBalance!)} ${CURRENCYNAME}.`);
			
			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const fromNameColor = nameColor(user.name, false, true);
				const toBalanceDisplay = Economy.formatMoney(result.toBalance!);
				targetSocket.popup(`|html|You received a transfer of ${Economy.formatMoney(amount)} from ${fromNameColor}. Your new balance is ${toBalanceDisplay} ${CURRENCYNAME}.`);
			}
		},

		async give(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr, ...reasonArr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);
			const reason = reasonArr.join(',').trim() || `Given by ${user.name}`;

			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}

			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}

			const updatedUser = await Economy.updateBalance(targetUserid, amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			this.sendReplyBox(`You have given ${Economy.formatMoney(amount)} ${CURRENCYNAME} to ${targetNameColor}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const giverNameColor = nameColor(user.name, false, true);
				const newBalanceDisplay = Economy.formatMoney(updatedUser.balance);
				targetSocket.popup(`|html|You have been given ${Economy.formatMoney(amount)} by ${giverNameColor} ${CURRENCYNAME}. Your new balance is ${newBalanceDisplay} ${CURRENCYNAME}.`);
			}
		},

		async take(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr, ...reasonArr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);
			const reason = reasonArr.join(',').trim() || `Taken by ${user.name}`;

			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}

			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}

			const targetUser = await Economy.getUser(targetUserid);
			if (targetUser.balance < amount) {
				return this.errorReply(`${targetUserid} only has ${Economy.formatMoney(targetUser.balance)} and cannot have ${Economy.formatMoney(amount)} taken.`);
			}

			const updatedUser = await Economy.updateBalance(targetUserid, -amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			this.sendReplyBox(`You have taken ${Economy.formatMoney(amount)} ${CURRENCYNAME} from ${targetNameColor}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const takerNameColor = nameColor(user.name, false, true);
				const newBalanceDisplay = Economy.formatMoney(updatedUser.balance);
				targetSocket.popup(`|html|${takerNameColor} has taken ${Economy.formatMoney(amount)} ${CURRENCYNAME} from you.`);
			}
		},

		async history(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			let targetUserid = toID(target);
			const staffCheck = user.can('roomowner'); 

			if (targetUserid && !staffCheck) {
				return this.errorReply("You can only view your own transaction history. Use `/eco history`.");
			}
	
			targetUserid = targetUserid || user.id;
	
			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);

			const history = await Economy.getTransactionHistory(targetUserid);
			if (!history.length) {
				return this.sendReplyBox(`<h3><center>Transaction History for ${targetNameColor}</center></h3><hr />No transactions found for ${targetUserid}.`)
			}

			const headerRow = ["Type", "Amount", "Details", "Date"];
			const dataRows = history.map(t => {
				const date = new Date(t.timestamp).toLocaleString();
				let typeColor = '';
				let details = '';
				let amountDisplay = Economy.formatMoney(t.amount);

				const fromDisplayName = Users.getExact(t.from)?.name || t.from;
				const toDisplayName = Users.getExact(t.to)?.name || t.to;

				const fromColor = nameColor(fromDisplayName);
				const toColor = nameColor(toDisplayName);

				switch (t.type) {
					case 'transfer':
						typeColor = t.from === targetUserid ? 'red' : 'green';
						details = t.from === targetUserid ? `Sent to ${toColor}` : `Received from ${fromColor}`;
						amountDisplay = t.from === targetUserid ? `- ${amountDisplay}` : `+ ${amountDisplay}`;
						break;
					case 'give':
						typeColor = 'green';
						amountDisplay = `+ ${amountDisplay}`;
						break;
					case 'take':
						typeColor = 'red';
						amountDisplay = `- ${amountDisplay}`;
						break;
					case 'shop':
						typeColor = 'red';
						details = `Spent on shop item`;
						amountDisplay = `- ${amountDisplay}`;
						break;
					case 'reward':
						typeColor = 'green';
						details = `Reward`;
						amountDisplay = `+ ${amountDisplay}`;
						break;
				}

				const reason = t.reason ? ` (${t.reason})` : '';

				return [
					t.type.toUpperCase(),
					`<span style="color: ${typeColor};">${amountDisplay}</span>`,
					`${details}${reason}`,
					date,
				];
			});

			const tableHtml = generateThemedTable(
				`Transaction History for ${targetNameColor}`,
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},
		
		async stats(): Promise<void> {
			if (!this.runBroadcast()) return;

			const stats = await Economy.getStats();
			const { totalMoney, totalUsers } = stats;

			const headerRow = ["Total Users", "Total Money in Circulation"];
			const dataRows = [[
				totalUsers.toString(),
				Economy.formatMoney(totalMoney.totalBalance)
			]];

			const tableHtml = generateThemedTable(
				"Economy Statistics",
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},

		async ladder(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			let [pageStr, limitStr] = target.split(',').map(s => s.trim());
	
			let page = parseInt(pageStr);
			if (isNaN(page) || page < 1) page = 1;

			let limit = parseInt(limitStr);
			if (isNaN(limit) || limit < 1 || limit > 50) limit = 50;
	
			const { docs, totalPages } = await Economy.getLeaderboard(page, limit);

			const headerRow = ["Rank", "User", "" + CURRENCYNAME + ""];
			const dataRows = docs.map((u, i) => {
				const rank = (page - 1) * limit + i + 1;
				const userName = Users.getExact(u._id)?.name || u._id;
				const userNameColor = nameColor(userName);
				return [
					rank.toString(),
					userNameColor,
					Economy.formatMoney(u.balance),
				];
			});

			const tableHtml = generateThemedTable(
				`Economy Leaderboard - Page ${page} of ${totalPages}`,
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},

		async reset(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const targetUserid = toID(target);
			if (!targetUserid) {
				return this.parse('/help eco');
			}

			const targetUser = await Economy.getUser(targetUserid);
			if (targetUser.balance === Economy.CONFIG.startingBalance) {
				return this.errorReply(`${targetUserid} already has the starting balance, so there is nothing to reset.`);
			}

			await Economy.resetUser(targetUserid);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			this.sendReplyBox(`Economy data for ${targetNameColor} has been reset. They now have a starting balance of ${Economy.formatMoney(Economy.CONFIG.startingBalance)} ${CURRENCYNAME}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const resetterNameColor = nameColor(user.name, false, true);
				const startingBalanceDisplay = Economy.formatMoney(Economy.CONFIG.startingBalance);
				targetSocket.popup(`|html|Your economy data has been reset by ${resetterNameColor}. Your new balance is ${startingBalanceDisplay} ${CURRENCYNAME}.`);
			}
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{cmd: "/balance [user]", desc: "Shows a user's " + CURRENCYNAME + " balance. Aliases: <b>/bal</b>, <b>/money</b>, <b>/atm</b>"},
				{cmd: "/eco history [user]", desc: "Shows the last 50 transactions for a user. Staff & can view other users' history. (Default: yourself)"},
				{cmd: "/eco stats", desc: "Shows global economy statistics and total " + CURRENCYNAME + " in circulation."},
				{cmd: "/eco ladder [page], [limit]", desc: "Shows the economy leaderboard. Max limit is 50."},
				{cmd: "/eco transfer [user], [amount]", desc: "Transfers " + CURRENCYNAME + " to another user."},
				{cmd: "/eco give [user], [amount], [reason]", desc: "Gives a user " + CURRENCYNAME + ". Requires: &."},
				{cmd: "/eco take [user], [amount], [reason]", desc: "Takes " + CURRENCYNAME + " from a user. Requires: &."},
				{cmd: "/eco reset [user]", desc: "Resets a user's economy data (" + CURRENCYNAME + " and transactions). Requires: &."}
			];
			const html = `<center><strong>Economy Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({cmd, desc}, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
								).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},
	economy: 'eco',
};
