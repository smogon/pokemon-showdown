/*
* Pokemon Showdown
* Economy Commands
* @author PrinceSky-Git
*/
import { Economy } from '../../economy';

export const commands: Chat.ChatCommands = {
	bal: 'balance',
	money: 'balance',
	atm: 'balance',
	async balance(target, room, user) {
		if (!this.runBroadcast()) return;

		const targetUserid = toID(target) || user.id;
		const targetUser = await Economy.getUser(targetUserid);

		const moneyDisplay = Economy.formatMoney(targetUser.balance);
    this.sendReplyBox(`${targetUserid} has ${moneyDisplay}`);
	},

	eco: {
		transfer: 'transfermoney',
		async transfermoney(target, room, user) {
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
	
			this.sendReplyBox(`You successfully transferred ${Economy.formatMoney(amount)} to ${targetUserid}. Your new balance is ${Economy.formatMoney(result.fromBalance!)}.`);
			
			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`You received a transfer of ${Economy.formatMoney(amount)} from ${user.name}. Your new balance is ${Economy.formatMoney(result.toBalance!)}.`);
			}
		},

		give: 'givemoney',
		async givemoney(target, room, user) {
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

			this.sendReplyBox(`You have given ${Economy.formatMoney(amount)} to ${targetUserid}. ${targetUserid}'s new balance is ${Economy.formatMoney(updatedUser.balance)}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`You have been given ${Economy.formatMoney(amount)} by ${user.name}. Your new balance is ${Economy.formatMoney(updatedUser.balance)}. (Reason: ${reason})`);
			}
		},

		take: 'takemoney',
		async takemoney(target, room, user) {
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

			this.sendReplyBox(`You have taken ${Economy.formatMoney(amount)} from ${targetUserid}. ${targetUserid}'s new balance is ${Economy.formatMoney(updatedUser.balance)}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`${user.name} has taken ${Economy.formatMoney(amount)} from you. Your new balance is ${Economy.formatMoney(updatedUser.balance)}. (Reason: ${reason})`);
			}
		},

		history: 'transactionhistory',
		async transactionhistory(target, room, user) {
			if (!this.runBroadcast()) return;

			let targetUserid = toID(target);
			const staffCheck = user.can('roomowner'); 

			if (targetUserid && !staffCheck) {
				return this.errorReply("You can only view your own transaction history. Use `/eco history`.");
			}
			
			targetUserid = targetUserid || user.id;

			const history = await Economy.getTransactionHistory(targetUserid);

			let buf = `<h3><center>Transaction History for ${targetUserid}</center></h3>`;
			
			if (!history.length) {
				buf += `<hr />No transactions found for ${targetUserid}.`;
				return this.sendReplyBox(buf);
			}

			buf += `<div class="ladder-table" style="max-height: 480px; overflow-y: auto;"><table style="width: 100%; max-width: 100%;"><tr><th style="width: 10%">Type</th><th style="width: 20%">Amount</th><th style="width: 45%">Details/Reason</th><th style="width: 25%">Date</th></tr>`;

			history.forEach(t => {
				const date = new Date(t.timestamp).toLocaleString();
				let typeColor = '';
				let details = '';
				let amountDisplay = Economy.formatMoney(t.amount);

				switch (t.type) {
					case 'transfer':
						typeColor = t.from === targetUserid ? 'red' : 'green';
						details = t.from === targetUserid ? `Sent to ${t.to}` : `Received from ${t.from}`;
						amountDisplay = t.from === targetUserid ? `- ${amountDisplay}` : `+ ${amountDisplay}`;
						break;
					case 'give':
						typeColor = 'green';
						details = `Given by ${t.from}`;
						amountDisplay = `+ ${amountDisplay}`;
						break;
					case 'take':
						typeColor = 'red';
						details = `Taken by ${t.from}`;
						amountDisplay = `- ${amountDisplay}`;
						break;
					case 'shop':
						typeColor = 'red';
						details = `Spent on shop item: ${t.reason}`;
						amountDisplay = `- ${amountDisplay}`;
						break;
					case 'reward':
						typeColor = 'green';
						details = `Reward: ${t.reason}`;
						amountDisplay = `+ ${amountDisplay}`;
						break;
				}

				const reason = t.reason ? `(${t.reason})` : '';

				buf += `<tr><td>${t.type.toUpperCase()}</td><td style="color: ${typeColor};">${amountDisplay}</td><td>${details} ${reason}</td><td>${date}</td></tr>`;
			});

			buf += `</table></div>`;

			this.sendReplyBox(buf);
		},

		logs: 'recentlogs',
		async recentlogs(target, room, user) {
			this.checkCan('roomowner');

			const recentTransactions = await Economy.TransactionDB.find({}, { sort: { timestamp: -1 }, limit: 50 });

			let buf = `<h3><center>Recent Economy Logs (Last 50)</center></h3>`;
			
			if (!recentTransactions.length) {
				buf += `<hr />No recent transactions found.`;
				return this.sendReplyBox(buf);
			}

			const formatTime = (date: Date) => {
				const h = date.getHours().toString().padStart(2, '0');
				const m = date.getMinutes().toString().padStart(2, '0');
				const s = date.getSeconds().toString().padStart(2, '0');
				return `${h}:${m}:${s}`;
			};

			recentTransactions.forEach(t => {
				const time = formatTime(t.timestamp);
				const date = t.timestamp.toLocaleDateString();
				const amountDisplay = Economy.formatMoney(t.amount);
				const reason = t.reason ? ` (Reason: ${t.reason})` : '';
				let log = ``;

				switch (t.type) {
					case 'transfer':
						log = `[${date} ${time}] TRANSFER: ${t.from} sent ${amountDisplay} to ${t.to}.`;
						break;
					case 'give':
						log = `[${date} ${time}] GIVE: ${t.from} gave ${amountDisplay} to ${t.to}.${reason}`;
						break;
					case 'take':
						log = `[${date} ${time}] TAKE: ${t.from} took ${amountDisplay} from ${t.to}.${reason}`;
						break;
					case 'shop':
						log = `[${date} ${time}] SHOP: ${t.from} spent ${amountDisplay}.${reason}`;
						break;
					case 'reward':
						log = `[${date} ${time}] REWARD: ${t.to} received ${amountDisplay}.${reason}`;
						break;
				}

				buf += log + `<hr>`;
			});

			this.sendReplyBox(buf);
		},

		clearlogs: 'clearlogs',
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

		stats: 'economystats',
		async economystats() {
			if (!this.runBroadcast()) return;

			const stats = await Economy.getStats();
			const { totalMoney, totalUsers } = stats;

			let buf = `<h3><center>Economy Statistics</center></h3>`;
			buf += `<hr />`;
			buf += `<strong>Total Users:</strong> ${totalUsers}<br />`;
			buf += `<strong>Total Money in Circulation:</strong> ${Economy.formatMoney(totalMoney.totalBalance)}`;
			
			this.sendReplyBox(buf);
		},

		ladder: 'leaderboard',
		async leaderboard(target, room, user) {
			if (!this.runBroadcast()) return;

			let [pageStr, limitStr] = target.split(',').map(s => s.trim());
			
			let page = parseInt(pageStr);
			if (isNaN(page) || page < 1) page = 1;

			let limit = parseInt(limitStr);
			if (isNaN(limit) || limit < 1 || limit > 50) limit = 50;
			
			const { results, totalPages } = await Economy.getLeaderboard(page, limit);

			let buf = `<div class="ladder-table" style="max-height: 480px; overflow-y: auto;"><table style="width: 100%; max-width: 100%;"><tr><th colspan="3">Economy Leaderboard - Page ${page} of ${totalPages}</th></tr>`;
			buf += `<tr><th style="width: 10%">#</th><th style="width: 40%">User</th><th style="width: 50%">Balance</th></tr>`;

			results.forEach((u, i) => {
				const rank = (page - 1) * limit + i + 1;
				buf += `<tr><td>${rank}</td><td>${u._id}</td><td>${Economy.formatMoney(u.balance)}</td></tr>`;
			});

			buf += `</table></div>`;

			this.sendReplyBox(buf);
		},

		reset: 'reseteconomy',
		async reseteconomy(target, room, user) {
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

			this.sendReplyBox(`Economy data for ${targetUserid} has been reset. They now have a starting balance of ${Economy.formatMoney(Economy.CONFIG.startingBalance)}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`Your economy data has been reset by ${user.name}. Your new balance is ${Economy.formatMoney(Economy.CONFIG.startingBalance)}.`);
			}
		},

		'': 'help',
		help() {
			if (!this.runBroadcast()) return;
			
			this.sendReplyBox(`
				<strong>Economy Commands: (alias: economy)</strong><br />
				/balance [user] - Shows a user's current balance. Aliases: /bal, /money, /atm<br />
				/eco history [user] - Shows the last 50 transactions for a user. Staff (# or higher) can view other users' history. (Default: yourself)<br />
				/eco logs - Shows the last 50 global economy transactions. Requires: # (Room Owner or higher)<br />
				/eco clearlogs [days] - Clears transaction logs older than the specified number of days. Requires: # (Room Owner or higher)<br />
				/eco stats - Shows global economy statistics and total money in circulation.<br />
				/eco ladder [page], [limit] - Shows the economy leaderboard. Max limit is 50.<br />
				/eco transfer [user], [amount] - Transfers money to another user. Use /help eco for details.<br />
				/eco give [user], [amount], [reason] - Gives a user money. Requires: # (Room Owner or higher). Use /help eco for details.<br />
				/eco take [user], [amount], [reason] - Takes money from a user. Requires: # (Room Owner or higher). Use /help eco for details.<br />
				/eco reset [user] - Resets a user's economy data (balance and transactions). Requires: # (Room Owner or higher). Use /help eco for details.
			`);
		}
	},
};
