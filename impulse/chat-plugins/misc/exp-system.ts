/*
* Pokemon Showdown - Impulse Server
* Exp System Commands
* Instructions: Add this line in chat.ts output message.
* Note: You need to import ExpSystem in chat.ts
* if (this.user.registered) voidnExpSystem.addExp(this.user.id, 1);
* @author PrinceSky-Git
*/

import { ImpulseDB } from '../../impulse-db';
import { Table } from '../../utils';
import { toID } from '../../../sim/dex';

const DEFAULT_EXP = 0;
const EXP_UNIT = `EXP`;

const MIN_LEVEL_EXP = 10;
const MULTIPLIER = 1.2;
let DOUBLE_EXP = false;
let DOUBLE_EXP_END_TIME: number | null = null;
const EXP_COOLDOWN = 30000;

const formatTime = (date: Date): string => {
	return date.toISOString().replace('T', ' ').slice(0, 19);
};

const getDurationMs = (value: number, unit: string): number => {
	const units: { [key: string]: number } = {
		minute: 60 * 1000,
		hour: 60 * 60 * 1000,
		day: 24 * 60 * 60 * 1000,
	};
	return value * (units[unit] || 0);
};

interface CooldownData {
	[userid: string]: number;
}

interface ExpDocument {
	_id: string;
	exp: number;
	level: number;
	lastUpdated: Date;
}

const ExpDB = ImpulseDB<ExpDocument>('expdata');

export class ExpSystem {
	private static cooldowns: CooldownData = {};

	private static isOnCooldown(userid: string): boolean {
		const lastExp = this.cooldowns[userid] || 0;
		return Date.now() - lastExp < EXP_COOLDOWN;
	}

	static async writeExp(userid: string, amount: number): Promise<void> {
		const id = toID(userid);
		const level = this.getLevel(amount);

		await ExpDB.upsert(
			{ _id: id },
			{
				_id: id,
				exp: amount,
				level,
				lastUpdated: new Date(),
			}
		);
	}

	static async readExp(userid: string): Promise<number> {
		const id = toID(userid);
		const doc = await ExpDB.findOne({ _id: id });
		return doc ? doc.exp : DEFAULT_EXP;
	}

	static async hasExp(userid: string, amount: number): Promise<boolean> {
		const id = toID(userid);
		const doc = await ExpDB.findOne({ _id: id, exp: { $gte: amount } });
		return doc !== null;
	}

	static async hasLevel(userid: string, level: number): Promise<boolean> {
		const id = toID(userid);
		const doc = await ExpDB.findOne({ _id: id, level: { $gte: level } });
		return doc !== null;
	}

	private static async updateExpInDB(
		userid: string,
		amount: number,
		skipCooldown: boolean
	): Promise<{ currentExp: number, currentLevel: number, newExp: number, newLevel: number }> {
		const id = toID(userid);
		const currentDoc = await ExpDB.findOne({ _id: id });
		const currentExp = currentDoc ? currentDoc.exp : DEFAULT_EXP;
		const currentLevel = this.getLevel(currentExp);

		const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
		const newExp = currentExp + gainedAmount;
		const newLevel = this.getLevel(newExp);

		await ExpDB.findOneAndUpdate(
			{ _id: id },
			{
				$inc: { exp: gainedAmount },
				$set: { level: newLevel, lastUpdated: new Date() },
				$setOnInsert: { _id: id },
			},
			{ upsert: true, returnDocument: 'after' }
		);

		if (!skipCooldown) {
			this.cooldowns[id] = Date.now();
		}

		if (newLevel > currentLevel) {
			this.notifyLevelUp(id, newLevel, currentLevel);
		}

		return { currentExp, currentLevel, newExp, newLevel };
	}

	static async addExp(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
		const id = toID(userid);

		if (!by && this.isOnCooldown(id)) {
			return await this.readExp(id);
		}

		const result = await this.updateExpInDB(id, amount, !!by);
		return result.newExp;
	}

	static async addExpRewards(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
		const id = toID(userid);
		const result = await this.updateExpInDB(id, amount, true);
		return result.newExp;
	}

	static notifyLevelUp(userid: string, newLevel: number, oldLevel: number): void {
		const user = Users.get(userid);
		if (!user?.connected) return;

		const rewards = '';

		user.popup(
			`|html|<div style="text-align: center;">` +
			`<h3 style="color: #3498DB;">Level Up!</h3>` +
			`<div style="font-size: 1.2em; margin: 10px 0;">` +
			`You are now <b style="color: #e74c3c;">Level ${newLevel}</b>!` +
			`</div>` +
			`<div style="margin: 10px 0; font-style: italic;">` +
			`You advanced from Level ${oldLevel} to Level ${newLevel}` +
			`</div>` +
			(rewards ? `<div style="margin-top: 10px; color: #27ae60;">${rewards}</div>` : '') +
			`<div style="margin-top: 15px; font-size: 0.9em; opacity: 0.8;">` +
			`Keep chatting and participating to earn more ${EXP_UNIT}!` +
			`</div>` +
			`</div>`
		);
	}

	static checkDoubleExpStatus(room?: Room | null, user?: User): void {
		if (DOUBLE_EXP && DOUBLE_EXP_END_TIME && Date.now() >= DOUBLE_EXP_END_TIME) {
			DOUBLE_EXP = false;
			DOUBLE_EXP_END_TIME = null;
		}
		if (!room) return;
		let message;
		if (DOUBLE_EXP) {
			const durationText = DOUBLE_EXP_END_TIME ?
				`until ${formatTime(new Date(DOUBLE_EXP_END_TIME))} UTC` :
				'No duration specified';

			message =
				`<div class="broadcast-green">` +
				`<b>Double EXP has been enabled${user ? ` by ${Impulse.nameColor(user.name, true, true)}` : ''}!</b><br>` +
				`Duration: ${durationText}<br>` +
				`All EXP gains will now be doubled.` +
				`</div>`;
		} else {
			message =
				`<div class="broadcast-green">` +
				`<b>Double EXP has been ${DOUBLE_EXP_END_TIME ? 'ended' : 'disabled'}${user ? ` by ${Impulse.nameColor(user.name, true, true)}` : ''}!</b><br>` +
				`All EXP gains will now be normal.` +
				`</div>`;
		}

		room.add(`|html|${message}`).update();
	}

	static grantExp(): void {
		Users.users.forEach(user => {
			if (!user || !user.named || !user.connected || !user.lastPublicMessage) return;
			if (Date.now() - user.lastPublicMessage > 300000) return;
			void this.addExp(user.id, 1);
		});
	}

	static async takeExp(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
		const id = toID(userid);

		const result = await ExpDB.findOneAndUpdate(
			{ _id: id, exp: { $gte: amount } },
			{
				$inc: { exp: -amount },
				$set: { lastUpdated: new Date() },
			},
			{ returnDocument: 'after' }
		);

		if (result) {
			const newLevel = this.getLevel(result.exp);
			if (result.level !== newLevel) {
				await ExpDB.updateOne(
					{ _id: id },
					{ $set: { level: newLevel } }
				);
			}
			return result.exp;
		}

		const doc = await ExpDB.findOne({ _id: id });
		return doc ? doc.exp : DEFAULT_EXP;
	}

	static async resetAllExp(): Promise<void> {
		await ExpDB.deleteMany({});
	}

	static async getRichestUsers(limit = 100): Promise<[string, number][]> {
		const docs = await ExpDB.find({}, { sort: { exp: -1 }, limit });
		return docs.map(doc => [doc._id, doc.exp]);
	}

	static getLevel(exp: number): number {
		if (exp < MIN_LEVEL_EXP) return 0;
		let level = 1;
		let totalExp = MIN_LEVEL_EXP;

		while (exp >= totalExp) {
			totalExp += Math.floor(MIN_LEVEL_EXP * MULTIPLIER ** level);
			level++;
		}
		return level - 1;
	}

	static getExpForNextLevel(level: number): number {
		if (level <= 0) return MIN_LEVEL_EXP;
		let totalExp = MIN_LEVEL_EXP;
		for (let i = 1; i < level; i++) {
			totalExp += Math.floor(MIN_LEVEL_EXP * MULTIPLIER ** i);
		}
		return totalExp;
	}
}

export const pages: Chat.PageTable = {
	async expladder(args, user): Promise<string> {
		const richest = await ExpSystem.getRichestUsers(100);
		if (!richest.length) {
			return `<div class="pad"><h2>No users have any ${EXP_UNIT} yet.</h2></div>`;
		}

		const data = richest.map(([userid, exp], index) => {
			const level = ExpSystem.getLevel(exp);
			return [
				(index + 1).toString(),
				Impulse.nameColor(userid, true, true),
				level.toString(),
			];
		});

		const output = Table(
			`Exp Ladder`,
			['Rank', 'User', 'Level'],
			data
		);
		return `${output}`;
	},
};

export const commands: Chat.ChatCommands = {
	exp: {
		'': 'level',
		async level(target, room, user): Promise<void> {
			if (!target) target = user.name;
			if (!this.runBroadcast()) return;
			const userid = toID(target);
			const currentExp = await ExpSystem.readExp(userid);
			const currentLevel = ExpSystem.getLevel(currentExp);
			const nextLevelExp = ExpSystem.getExpForNextLevel(currentLevel + 1);
			const expNeeded = nextLevelExp - currentExp;

			this.sendReplyBox(
				`<b>${Impulse.nameColor(userid, true, true)}</b> - Level ${currentLevel}<br>` +
				`Current EXP: ${currentExp} ${EXP_UNIT}<br>` +
				`EXP needed for Level ${currentLevel + 1}: ${expNeeded} ${EXP_UNIT}`
			);
		},

		async give(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.sendReply(`Usage: /exp give [user], [amount], [reason]`);
			const parts = target.split(',').map(p => p.trim());
			if (parts.length < 2) return this.sendReply(`Usage: /exp give [user], [amount], [reason]`);

			const targetUser = Users.get(parts[0]);
			const amount = parseInt(parts[1]);
			const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

			if (!targetUser) {
				return this.errorReply(`User "${parts[0]}" not found.`);
			}
			if (isNaN(amount) || amount <= 0) {
				return this.errorReply(`Please specify a valid positive amount.`);
			}

			await ExpSystem.addExp(targetUser.id, amount, reason, user.id);
			const newExp = await ExpSystem.readExp(targetUser.id);
			const newLevel = ExpSystem.getLevel(newExp);
			const expForNext = ExpSystem.getExpForNextLevel(newLevel + 1);

			this.sendReplyBox(
				`${Impulse.nameColor(user.name, true, true)} gave ${amount} ${EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''} to ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
				`New Level: ${newLevel} (${newExp}/${expForNext} ${EXP_UNIT})`
			);

			this.modlog('GIVEEXP', targetUser, `${amount} ${EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''}`, { by: user.id, reason });
			if (targetUser.connected) {
				targetUser.popup(
					`|html|You received <b>${amount} ${EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''}</b> from <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
					`Reason: ${reason}<br>` +
					`You are now Level ${newLevel} (${newExp}/${expForNext} ${EXP_UNIT})`
				);
			}
		},

		async take(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.sendReply(`Usage: /exp take [user], [amount], [reason]`);
			const parts = target.split(',').map(p => p.trim());
			if (parts.length < 2) return this.sendReply(`Usage: /exp take [user], [amount], [reason]`);

			const targetUser = Users.get(parts[0]);
			const amount = parseInt(parts[1]);
			const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

			if (!targetUser) {
				return this.errorReply(`User "${parts[0]}" not found.`);
			}
			if (isNaN(amount) || amount <= 0) {
				return this.errorReply(`Please specify a valid positive amount.`);
			}

			await ExpSystem.takeExp(targetUser.id, amount, reason, user.id);
			const newExp = await ExpSystem.readExp(targetUser.id);
			const newLevel = ExpSystem.getLevel(newExp);
			const expForNext = ExpSystem.getExpForNextLevel(newLevel + 1);

			this.sendReplyBox(
				`${Impulse.nameColor(user.name, true, true)} took ${amount} ${EXP_UNIT} from ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
				`New Level: ${newLevel} (${newExp}/${expForNext} ${EXP_UNIT})`
			);

			this.modlog('TAKEEXP', targetUser, `${amount} ${EXP_UNIT}`, { by: user.id, reason });
			if (targetUser.connected) {
				targetUser.popup(
					`|html|<b>${Impulse.nameColor(user.name, true, true)}</b> took <b>${amount} ${EXP_UNIT}</b> from you.<br>` +
					`Reason: ${reason}<br>` +
					`You are now Level ${newLevel} (${newExp}/${expForNext} ${EXP_UNIT})`
				);
			}
		},

		async reset(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.sendReply(`Usage: /exp reset [user], [reason]`);
			const parts = target.split(',').map(p => p.trim());
			const targetUser = Users.get(parts[0]);
			const reason = parts.slice(1).join(',').trim() || 'No reason specified.';

			if (!targetUser) {
				return this.errorReply(`User "${parts[0]}" not found.`);
			}

			await ExpSystem.writeExp(targetUser.id, DEFAULT_EXP);
			this.sendReplyBox(
				`${Impulse.nameColor(user.name, true, true)} reset ${Impulse.nameColor(targetUser.name, true, true)}'s EXP to ${DEFAULT_EXP} ${EXP_UNIT} (Level 0) (${reason}).`
			);

			this.modlog('RESETEXP', targetUser, `${DEFAULT_EXP} ${EXP_UNIT}`, { by: user.id, reason });
			if (targetUser.connected) {
				targetUser.popup(
					`|html|Your ${EXP_UNIT} has been reset to <b>${DEFAULT_EXP}</b> (Level 0) by <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
					`Reason: ${reason}`
				);
			}
		},

		async resetall(target, room, user): Promise<void> {
			this.checkCan('bypassall');
			const reason = target.trim() || 'No reason specified.';

			await ExpSystem.resetAllExp();
			this.sendReplyBox(
				`All user EXP has been reset to ${DEFAULT_EXP} ${EXP_UNIT} (Level 0) (${reason}).`
			);

			this.modlog('RESETEXPALL', null, `all EXP to ${DEFAULT_EXP} ${EXP_UNIT}`, { by: user.id, reason });
			if (room) {
				room.add(
					`|html|<center><div class="broadcast-blue">` +
					`<b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${EXP_UNIT} to <b>${DEFAULT_EXP}</b> (Level 0).<br>` +
					`Reason: ${reason}` +
					`</div></center>`
				);
				room.update();
			}
		},

		toggledouble(target, room, user): void {
			this.checkCan('roomowner');

			if (!target) {
				DOUBLE_EXP = !DOUBLE_EXP;
				DOUBLE_EXP_END_TIME = null;
				ExpSystem.checkDoubleExpStatus(room, user);
				return;
			}

			if (target.toLowerCase() === 'off') {
				DOUBLE_EXP = false;
				DOUBLE_EXP_END_TIME = null;
				ExpSystem.checkDoubleExpStatus(room, user);
				return;
			}

			const match = /^(\d+)\s*(minute|hour|day)s?$/i.exec(target);
			if (!match) {
				return this.errorReply('Invalid format. Use: number + unit (minutes/hours/days)');
			}

			const [, amount, unit] = match;
			const duration = getDurationMs(parseInt(amount), unit.toLowerCase());
			const endTime = Date.now() + duration;

			DOUBLE_EXP = true;
			DOUBLE_EXP_END_TIME = endTime;

			ExpSystem.checkDoubleExpStatus(room, user);
			setTimeout(() => ExpSystem.checkDoubleExpStatus(), duration);
		},

		ladder(target, room, user): void {
			if (!this.runBroadcast()) return;
			return this.parse(`/join view-expladder`);
		},

		help(target, room, user): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/exp level [user]",
					desc: "Check a user's EXP, level, and EXP needed for the next level. (Default: yourself)",
				},
				{
					cmd: "/exp give [user], [amount], [reason]",
					desc: `Give a specified amount of ${EXP_UNIT} to a user. Requires: &.`,
				},
				{
					cmd: "/exp take [user], [amount], [reason]",
					desc: `Take a specified amount of ${EXP_UNIT} from a user. Requires: &.`,
				},
				{
					cmd: "/exp reset [user], [reason]",
					desc: `Reset a user's ${EXP_UNIT} to ${DEFAULT_EXP}. Requires: &.`,
				},
				{
					cmd: "/exp resetall [reason]",
					desc: `Reset all users' ${EXP_UNIT} to ${DEFAULT_EXP}. Requires: ~.`,
				},
				{
					cmd: "/exp ladder",
					desc: `View the top 100 users with the most ${EXP_UNIT} and their levels.`,
				},
				{
					cmd: "/exp toggledouble [duration|off]",
					desc: "Toggle double EXP with optional duration (e.g. 2 hours, 1 day, 30 minutes). Use off to disable. Requires: &.",
				},
			];
			const html = `<center><strong>EXP System Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},
};
