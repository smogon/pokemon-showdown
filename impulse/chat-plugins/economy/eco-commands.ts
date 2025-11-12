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
		const targetUser = await Economy.getUser(targetUserid);

		this.sendReplyBox(`${nameColor(targetDisplayName, true, false)} has ${Economy.formatMoney(targetUser.balance)} ${CURRENCYNAME}.`);
	},

	eco: {
		async transfer(target, room, user): Promise<void> {
			if (!target) return this.parse('/help eco');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) return this.parse('/help eco');
			if (targetUserid === user.id) return this.errorReply("You cannot transfer money to yourself.");
			if (amount <= 0 || isNaN(amount)) return this.errorReply(`Amount must be a positive number.`);

			const fromUser = await Economy.getUser(user.id);
			if (fromUser.balance < amount) {
				return this.errorReply(`You do not have enough money to transfer ${Economy.formatMoney(amount)}. You have ${Economy.formatMoney(fromUser.balance)}.`);
			}

			const result = await Economy.transferMoney(user.id, targetUserid, amount);
			if (!result.success) return this.errorReply(`Transfer failed: ${result.error}`);

			this.sendReplyBox(`You successfully transferred ${Economy.formatMoney(amount)} ${CURRENCYNAME} to ${targetUserid}. Your new balance is ${Economy.formatMoney(result.fromBalance)} ${CURRENCYNAME}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`|html|You received a transfer of ${Economy.formatMoney(amount)} from ${nameColor(user.name, false, true)}. Your new balance is ${Economy.formatMoney(result.toBalance)} ${CURRENCYNAME}.`);
			}
		},

		async give(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) return this.parse('/help eco');
			if (amount <= 0 || isNaN(amount)) return this.errorReply(`Amount must be a positive number.`);

			const updatedUser = await Economy.updateBalance(targetUserid, amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			this.sendReplyBox(`You have given ${Economy.formatMoney(amount)} ${CURRENCYNAME} to ${nameColor(targetDisplayName)}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`|html|You have been given ${Economy.formatMoney(amount)} by ${nameColor(user.name, false, true)} ${CURRENCYNAME}. Your new balance is ${Economy.formatMoney(updatedUser.balance)} ${CURRENCYNAME}.`);
			}
		},

		async take(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) return this.parse('/help eco');
			if (amount <= 0 || isNaN(amount)) return this.errorReply(`Amount must be a positive number.`);

			const targetUser = await Economy.getUser(targetUserid);
			if (targetUser.balance < amount) {
				return this.errorReply(`${targetUserid} only has ${Economy.formatMoney(targetUser.balance)} and cannot have ${Economy.formatMoney(amount)} taken.`);
			}

			await Economy.updateBalance(targetUserid, -amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			this.sendReplyBox(`You have taken ${Economy.formatMoney(amount)} ${CURRENCYNAME} from ${nameColor(targetDisplayName)}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`|html|${nameColor(user.name, false, true)} has taken ${Economy.formatMoney(amount)} ${CURRENCYNAME} from you.`);
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
				return this.sendReplyBox(`<h3><center>Transaction History for ${targetNameColor}</center></h3><hr />No transactions found for ${targetUserid}.`);
			}

			const dataRows = history.map(t => {
				const date = new Date(t.timestamp).toLocaleString();
				let typeColor = '', details = '', amountDisplay = Economy.formatMoney(t.amount);

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

				return [
					t.type.toUpperCase(),
					`<span style="color: ${typeColor};">${amountDisplay}</span>`,
					`${details}${t.reason ? ` (${t.reason})` : ''}`,
					date,
				];
			});

			this.sendReply(`|html|${generateThemedTable(`Transaction History for ${targetNameColor}`, ["Type", "Amount", "Details", "Date"], dataRows)}`);
		},

		async stats(): Promise<void> {
			if (!this.runBroadcast()) return;

			const stats = await Economy.getStats();
			const dataRows = [[stats.totalUsers.toString(), Economy.formatMoney(stats.totalMoney.totalBalance)]];

			this.sendReply(`|html|${generateThemedTable("Economy Statistics", ["Total Users", "Total Money in Circulation"], dataRows)}`);
		},

		async ladder(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const [pageStr, limitStr] = target.split(',').map(s => s.trim());

			let page = parseInt(pageStr);
			if (isNaN(page) || page < 1) page = 1;

			let limit = parseInt(limitStr);
			if (isNaN(limit) || limit < 1 || limit > 50) limit = 50;

			const { docs, totalPages } = await Economy.getLeaderboard(page, limit);

			const dataRows = docs.map((u, i) => {
				const rank = (page - 1) * limit + i + 1;
				const userName = Users.getExact(u._id)?.name || u._id;
				return [rank.toString(), nameColor(userName), Economy.formatMoney(u.balance)];
			});

			this.sendReply(`|html|${generateThemedTable(`Economy Leaderboard - Page ${page} of ${totalPages}`, ["Rank", "User", CURRENCYNAME], dataRows)}`);
		},

		async reset(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const targetUserid = toID(target);
			if (!targetUserid) return this.parse('/help eco');

			const targetUser = await Economy.getUser(targetUserid);
			if (targetUser.balance === Economy.CONFIG.startingBalance) {
				return this.errorReply(`${targetUserid} already has the starting balance, so there is nothing to reset.`);
			}

			await Economy.resetUser(targetUserid);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			this.sendReplyBox(`Economy data for ${nameColor(targetDisplayName)} has been reset. They now have a starting balance of ${Economy.formatMoney(Economy.CONFIG.startingBalance)} ${CURRENCYNAME}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				targetSocket.popup(`|html|Your economy data has been reset by ${nameColor(user.name, false, true)}. Your new balance is ${Economy.formatMoney(Economy.CONFIG.startingBalance)} ${CURRENCYNAME}.`);
			}
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const cmds = [
				["/balance [user]", `Shows a user's ${CURRENCYNAME} balance. Aliases: <b>/bal</b>, <b>/money</b>, <b>/atm</b>`],
				["/eco history [user]", "Shows the last 50 transactions for a user. Staff & can view other users' history. (Default: yourself)"],
				["/eco stats", `Shows global economy statistics and total ${CURRENCYNAME} in circulation.`],
				["/eco ladder [page], [limit]", "Shows the economy leaderboard. Max limit is 50."],
				["/eco transfer [user], [amount]", `Transfers ${CURRENCYNAME} to another user.`],
				["/eco give [user], [amount], [reason]", `Gives a user ${CURRENCYNAME}. Requires: &.`],
				["/eco take [user], [amount], [reason]", `Takes ${CURRENCYNAME} from a user. Requires: &.`],
				["/eco reset [user]", `Resets a user's economy data (${CURRENCYNAME} and transactions). Requires: &.`],
			];
			this.sendReplyBox(
				`<center><strong>Economy Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				cmds.map(([c, d], i) => `<li><b>${c}</b> - ${d}</li>${i < cmds.length - 1 ? '<hr>' : ''}`).join('') +
				`</ul>`
			);
		},
	},
	economy: 'eco',
};
