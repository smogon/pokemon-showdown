/*
* Pokemon Showdown
* Economy Commands
*/

import { Economy } from '../../economy';
import { nameColor } from '../../colors';
import { generateThemedTable } from '../../utils';
Impulse.nameColor = nameColor;

export const commands: Chat.ChatCommands = {
	bal: 'balance',
	money: 'balance',
	atm: 'balance',
	async balance(target, room, user) {
		if (!this.runBroadcast()) return;

		const targetUserid = toID(target) || user.id;
		
		const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
		const targetNameColor = Impulse.nameColor(targetDisplayName, true, false);

		const targetUser = await Economy.getUser(targetUserid);

		const moneyDisplay = Economy.formatMoney(targetUser.balance);
		this.sendReplyBox(`${targetNameColor} has ${moneyDisplay} ${Economy.CURRENCY.name}.`);
	},

	eco: {
		async transfer(target, room, user) {
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
	
			this.sendReplyBox(`You successfully transferred ${Economy.formatMoney(amount)} ${Economy.CURRENCY.name} to ${targetUserid}. Your new balance is ${Economy.formatMoney(result.fromBalance!)} ${Economy.CURRENCY.name}.`);
			
			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const fromNameColor = Impulse.nameColor(user.name, false, true);
				const toBalanceDisplay = Economy.formatMoney(result.toBalance!);
				targetSocket.popup(`|html|You received a transfer of ${Economy.formatMoney(amount)} from ${fromNameColor}. Your new balance is ${toBalanceDisplay} ${Economy.CURRENCY.name}.`);
			}
		},

		async give(target, room, user) {
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
			await Economy.logTransaction({
				from: user.id,
				to: targetUserid,
				amount: amount,
				type: 'give',
				reason: reason,
				timestamp: new Date(),
			});

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = Impulse.nameColor(targetDisplayName);
			this.sendReplyBox(`You have given ${Economy.formatMoney(amount)} ${Economy.CURRENCY.name} to ${targetNameColor}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const giverNameColor = Impulse.nameColor(user.name, false, true);
				const newBalanceDisplay = Economy.formatMoney(updatedUser.balance);
				targetSocket.popup(`|html|You have been given ${Economy.formatMoney(amount)} by ${giverNameColor} ${Economy.CURRENCY.name}. Your new balance is ${newBalanceDisplay} ${Economy.CURRENCY.name}. (Reason: ${reason})`);
			}
		},

		async take(target, room, user) {
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
			await Economy.logTransaction({
				from: user.id,
				to: targetUserid,
				amount: amount,
				type: 'take',
				reason: reason,
				timestamp: new Date(),
			});

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = Impulse.nameColor(targetDisplayName);
			this.sendReplyBox(`You have taken ${Economy.formatMoney(amount)} ${Economy.CURRENCY.name} from ${targetNameColor}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const takerNameColor = Impulse.nameColor(user.name, false, true);
				const newBalanceDisplay = Economy.formatMoney(updatedUser.balance);
				targetSocket.popup(`|html|${takerNameColor} has taken ${Economy.formatMoney(amount)} ${Economy.CURRENCY.name} from you. (Reason: ${reason})`);
			}
		},

		async history(target, room, user) {
			if (!this.runBroadcast()) return;

			let targetUserid = toID(target);
			const staffCheck = user.can('roomowner'); 

			if (targetUserid && !staffCheck) {
				return this.errorReply("You can only view your own transaction history. Use `/eco history`.");
			}
	
			targetUserid = targetUserid || user.id;
	
			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = Impulse.nameColor(targetDisplayName);

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

				const fromColor = Impulse.nameColor(fromDisplayName);
				const toColor = Impulse.nameColor(toDisplayName);

				switch (t.type) {
					case 'transfer':
						typeColor = t.from === targetUserid ? 'red' : 'green';
						details = t.from === targetUserid ? `Sent to ${toColor}` : `Received from ${fromColor}`;
						amountDisplay = t.from === targetUserid ? `- ${amountDisplay}` : `+ ${amountDisplay}`;
						break;
					case 'give':
						typeColor = 'green';
						details = `Given by ${fromColor}`;
						amountDisplay = `+ ${amountDisplay}`;
						break;
					case 'take':
						typeColor = 'red';
						details = `Taken by ${fromColor}`;
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
					`${reason}`,
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

		async logs(target, room, user) {
			this.checkCan('roomowner');
			
			const recentTransactions = await Economy.getTransactionHistory('', 50);

			if (!recentTransactions.length) {
				return this.sendReplyBox(`<h3><center>Recent Economy Logs (Last 50)</center></h3><hr />No recent transactions found.`);
			}

			const headerRow = ["Type", "Amount", "Details", "Date"];
			const dataRows = recentTransactions.map(t => {
				const date = new Date(t.timestamp).toLocaleString();
				let typeColor = '';
				let details = '';
				let amountDisplay = Economy.formatMoney(t.amount);

				const fromDisplayName = Users.getExact(t.from)?.name || t.from;
				const toDisplayName = Users.getExact(t.to)?.name || t.to;

				const fromColor = Impulse.nameColor(fromDisplayName);
				const toColor = Impulse.nameColor(toDisplayName);

				switch (t.type) {
					case 'transfer':
						typeColor = 'blue';
						details = `TRANSFER: ${fromColor} sent to ${toColor}`;
						break;
					case 'give':
						typeColor = 'green';
						details = `GIVE: ${fromColor} gave to ${toColor}`;
						break;
					case 'take':
						typeColor = 'red';
						details = `TAKE: ${fromColor} took from ${toColor}`;
						break;
					case 'shop':
						typeColor = 'orange';
						details = `SHOP: ${fromColor} spent`;
						break;
					case 'reward':
						typeColor = 'purple';
						details = `REWARD: ${toColor} received`;
						break;
				}

				const reason = t.reason ? ` (${t.reason})` : '';
				let amountSign = '';
				switch (t.type) {
					case 'transfer':
						amountSign = '';
						break;
					case 'give':
					case 'reward':
						amountSign = '+ ';
						break;
					case 'take':
					case 'shop':
						amountSign = '- ';
						break;
				}

				return [
					t.type.toUpperCase(),
					`<span style="color: ${typeColor};">${amountSign}${amountDisplay}</span>`,
					`$${reason}`,
					date,
				];
			});

			const tableHtml = generateThemedTable(
				"Recent Economy Logs (Last 50)",
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},
		
		async clearlogs(target, room, user) {
			this.checkCan('roomowner');

			const days = parseInt(target.trim());
			if (isNaN(days) || days < 1) {
				return this.errorReply("The number of days must be a positive integer.");
			}

			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - days);

			const { deletedCount } = await Economy.TransactionDB.deleteMany({
				timestamp: { $lt: cutoffDate },
			});

			this.sendReplyBox(`Successfully cleared ${deletedCount} transaction log entries older than ${days} day(s).`);
		},

		async stats() {
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

			this.sendReplyBox(`|html|${tableHtml}`);
		},

		async ladder(target, room, user) {
			if (!this.runBroadcast()) return;

			let [pageStr, limitStr] = target.split(',').map(s => s.trim());
	
			let page = parseInt(pageStr);
			if (isNaN(page) || page < 1) page = 1;

			let limit = parseInt(limitStr);
			if (isNaN(limit) || limit < 1 || limit > 50) limit = 50;
	
			const { docs, totalPages } = await Economy.getLeaderboard(page, limit);

			const headerRow = ["Rank", "User", "Balance"];
			const dataRows = docs.map((u, i) => {
				const rank = (page - 1) * limit + i + 1;
				const userName = Users.getExact(u._id)?.name || u._id;
				const userNameColor = Impulse.nameColor(userName);
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

		async reset(target, room, user) {
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
			const targetNameColor = Impulse.nameColor(targetDisplayName);
			this.sendReplyBox(`Economy data for ${targetNameColor} has been reset. They now have a starting balance of ${Economy.formatMoney(Economy.CONFIG.startingBalance)} ${Economy.CURRENCY.name}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const resetterNameColor = Impulse.nameColor(user.name, false, true);
				const startingBalanceDisplay = Economy.formatMoney(Economy.CONFIG.startingBalance);
				targetSocket.popup(`|html|Your economy data has been reset by ${resetterNameColor}. Your new balance is ${startingBalanceDisplay} ${Economy.CURRENCY.name}.`);
			}
		},

		'': 'help',
		help() {
			if (!this.runBroadcast()) return;			
			this.sendReplyBox(`<strong>Economy Commands: (alias: economy)</strong><br />` +
				`/balance [user] - Shows a user's current balance. Aliases: /bal, /money, /atm<br />` +
				`/eco history [user] - Shows the last 50 transactions for a user. Staff (# or higher) can view other users' history. (Default: yourself)<br />` +
				`/eco logs - Shows the last 50 global economy transactions. Requires: # (Room Owner or higher)<br />` +
				`/eco clearlogs [days] - Clears transaction logs older than the specified number of days. Requires: # (Room Owner or higher)<br />` +
				`/eco stats - Shows global economy statistics and total money in circulation.<br />` +
				`/eco ladder [page], [limit] - Shows the economy leaderboard. Max limit is 50.<br />` +
				`/eco transfer [user], [amount] - Transfers money to another user. Use /help eco for details.<br />` +
				`/eco give [user], [amount], [reason] - Gives a user money. Requires: # (Room Owner or higher). Use /help eco for details.<br />` +
				`/eco take [user], [amount], [reason] - Takes money from a user. Requires: # (Room Owner or higher). Use /help eco for details.<br />` +
				`/eco reset [user] - Resets a user's economy data (balance and transactions). Requires: # (Room Owner or higher). Use /help eco for details.`);
		}
	},
	economy: 'eco',
};
