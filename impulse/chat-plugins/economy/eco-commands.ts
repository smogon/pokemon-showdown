/*
* Pokemon Showdown
* Economy Commands
* @author PrinceSky-Git
*/

import { Economy, CURRENCY } from '../../economy';
import { nameColor } from '../../colors';
import { Table } from '../../utils';

const CURRENCYNAME = CURRENCY.name;

const notifyUser = (userId: string, message: string): void => {
	const targetSocket = Users.get(userId);
	if (targetSocket) {
		targetSocket.popup(`|html|${message}`);
	}
};

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
				const msg = `You do not have enough money to transfer ` +
					`${Economy.formatMoney(amount)}. You have ${Economy.formatMoney(fromUser.balance)}.`;
				return this.errorReply(msg);
			}

			const result = await Economy.transferMoney(user.id, targetUserid, amount);

			if (!result.success) {
				return this.errorReply(`Transfer failed: ${result.error}`);
			}

			const successMsg = `You successfully transferred ${Economy.formatMoney(amount)} ` +
				`${CURRENCYNAME} to ${targetUserid}. Your new balance is ` +
				`${Economy.formatMoney(result.fromBalance)} ${CURRENCYNAME}.`;
			this.sendReplyBox(successMsg);

			const fromNameColor = nameColor(user.name, false, true);
			const toBalanceDisplay = Economy.formatMoney(result.toBalance);
			const notifyMsg = `You received a transfer of ${Economy.formatMoney(amount)} from ` +
				`${fromNameColor}. Your new balance is ${toBalanceDisplay} ${CURRENCYNAME}.`;
			notifyUser(targetUserid, notifyMsg);
		},

		async give(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}

			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}

			const updatedUser = await Economy.updateBalance(targetUserid, amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			const msg = `You have given ${Economy.formatMoney(amount)} ${CURRENCYNAME} to ` +
				`${targetNameColor}.`;
			this.sendReplyBox(msg);

			const giverNameColor = nameColor(user.name, false, true);
			const newBalanceDisplay = Economy.formatMoney(updatedUser.balance);
			const notifyMsg = `You have been given ${Economy.formatMoney(amount)} by ` +
				`${giverNameColor} ${CURRENCYNAME}. Your new balance is ` +
				`${newBalanceDisplay} ${CURRENCYNAME}.`;
			notifyUser(targetUserid, notifyMsg);
		},

		async take(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}

			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}

			const targetUser = await Economy.getUser(targetUserid);
			if (targetUser.balance < amount) {
				const msg = `${targetUserid} only has ${Economy.formatMoney(targetUser.balance)} ` +
					`and cannot have ${Economy.formatMoney(amount)} taken.`;
				return this.errorReply(msg);
			}

			await Economy.updateBalance(targetUserid, -amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			const msg = `You have taken ${Economy.formatMoney(amount)} ${CURRENCYNAME} from ` +
				`${targetNameColor}.`;
			this.sendReplyBox(msg);

			const takerNameColor = nameColor(user.name, false, true);
			const notifyMsg = `${takerNameColor} has taken ${Economy.formatMoney(amount)} ` +
				`${CURRENCYNAME} from you.`;
			notifyUser(targetUserid, notifyMsg);
		},

		async stats(): Promise<void> {
			if (!this.runBroadcast()) return;

			const stats = await Economy.getStats();
			const { totalMoney, totalUsers } = stats;

			const headerRow = ["Total Users", "Total Money in Circulation"];
			const dataRows = [[
				totalUsers.toString(),
				Economy.formatMoney(totalMoney.totalBalance),
			]];

			const tableHtml = Table(
				"Economy Statistics",
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},

		async ladder(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const [pageStr, limitStr] = target.split(',').map(s => s.trim());

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

			const tableHtml = Table(
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
				const msg = `${targetUserid} already has the starting balance, ` +
					`so there is nothing to reset.`;
				return this.errorReply(msg);
			}

			await Economy.resetUser(targetUserid);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			const startingBalance = Economy.formatMoney(Economy.CONFIG.startingBalance);
			const msg = `Economy data for ${targetNameColor} has been reset. They now have a ` +
				`starting balance of ${startingBalance} ${CURRENCYNAME}.`;
			this.sendReplyBox(msg);

			const resetterNameColor = nameColor(user.name, false, true);
			const startingBalanceDisplay = Economy.formatMoney(Economy.CONFIG.startingBalance);
			const notifyMsg = `Your economy data has been reset by ${resetterNameColor}. ` +
				`Your new balance is ${startingBalanceDisplay} ${CURRENCYNAME}.`;
			notifyUser(targetUserid, notifyMsg);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/balance [user]",
					desc: `Shows a user's ${CURRENCYNAME} balance. ` +
						`Aliases: <b>/bal</b>, <b>/money</b>, <b>/atm</b>`,
				},
				{
					cmd: "/eco stats",
					desc: `Shows global economy statistics and total ${CURRENCYNAME} in circulation.`,
				},
				{
					cmd: "/eco ladder [page], [limit]",
					desc: "Shows the economy leaderboard. Max limit is 50.",
				},
				{
					cmd: "/eco transfer [user], [amount]",
					desc: `Transfers ${CURRENCYNAME} to another user.`,
				},
				{
					cmd: "/eco give [user], [amount], [reason]",
					desc: `Gives a user ${CURRENCYNAME}. Requires: &.`,
				},
				{
					cmd: "/eco take [user], [amount], [reason]",
					desc: `Takes ${CURRENCYNAME} from a user. Requires: &.`,
				},
				{
					cmd: "/eco reset [user]",
					desc: `Resets a user's economy data (${CURRENCYNAME} and transactions). Requires: &.`,
				},
			];
			const html = `<center><strong>Economy Commands:</strong></center>` +
				`<hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},
	economy: 'eco',
};
