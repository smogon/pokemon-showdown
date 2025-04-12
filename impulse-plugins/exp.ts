/***************************************
* Pokemon Showdown EXP Commands        *
* Original Code By: Volco & Insist     *
* Updated To Typescript By: Prince Sky *
***************************************/

import { FS } from '../lib/fs';

const EXP_SETTINGS = {
	FILE_PATH: 'impulse-db/exp.json',
	DEFAULT_EXP: 0,
	EXP_UNIT: 'EXP',
	MIN_LEVEL_EXP: 15,
	MULTIPLIER: 1.4,
	EXP_COOLDOWN: 30000
};

let DOUBLE_EXP = false;
Impulse.expUnit = EXP_SETTINGS.EXP_UNIT;

type ExpData = Record<string, number>;
type CooldownData = Record<string, number>;

export class ExpSystem {
	private static data: ExpData = ExpSystem.loadExpData();
	private static cooldowns: CooldownData = {};

	private static loadExpData(): ExpData {
		try {
			const rawData = FS(EXP_SETTINGS.FILE_PATH).readIfExistsSync();
			return rawData ? JSON.parse(rawData) : {};
		} catch (error) {
			console.error(`Error reading EXP data: ${error}`);
			return {};
		}
	}
	
	private static saveExpData(): void {
		try {
			const dataToWrite = Object.fromEntries(
				Object.entries(this.data).map(([id, amount]) => [toID(id), amount])
			);
			FS(EXP_SETTINGS.FILE_PATH).writeUpdate(() => JSON.stringify(dataToWrite, null, 2));
		} catch (error) {
			console.error(`Error saving EXP data: ${error}`);
		}
	}
	
	private static isOnCooldown(userid: string): boolean {
		return Date.now() - (this.cooldowns[userid] || 0) < EXP_SETTINGS.EXP_COOLDOWN;
	}
	
	static writeExp(userid: string, amount: number): void {
		this.data[toID(userid)] = amount;
		this.saveExpData();
	}
	
	static readExp(userid: string): number {
		return this.data[toID(userid)] || EXP_SETTINGS.DEFAULT_EXP;
	}
	
	static hasExp(userid: string, amount: number): boolean {
		return this.readExp(userid) >= amount;
	}
	
	static addExp(userid: string, amount: number, reason?: string, by?: string): number {
		const id = toID(userid);
		if (!by && this.isOnCooldown(id)) {
			return this.readExp(id);
		}
		const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
		this.data[id] = (this.data[id] || 0) + gainedAmount;
		if (!by) this.cooldowns[id] = Date.now();
		this.saveExpData();
		return this.data[id];
	}
	
	static takeExp(userid: string, amount: number, reason?: string, by?: string): number {
		const id = toID(userid);
		const currentExp = this.readExp(id);
		if (currentExp >= amount) {
			this.data[id] = currentExp - amount;
			this.saveExpData();
		}
		return this.readExp(id);
	}
	
	static resetAllExp(): void {
		this.data = {};
		this.saveExpData();
	}
	
	static getRichestUsers(limit: number = 100): [string, number][] {
		return Object.entries(this.data)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit);
	}
	
	static getLevel(exp: number): number {
		if (exp < EXP_SETTINGS.MIN_LEVEL_EXP) return 0;
		let level = 1;
		let totalExp = EXP_SETTINGS.MIN_LEVEL_EXP;
		while (exp >= totalExp) {
			totalExp += Math.floor(EXP_SETTINGS.MIN_LEVEL_EXP * Math.pow(EXP_SETTINGS.MULTIPLIER, level));
			level++;
		}
		return level - 1;
	}
	
	static getExpForNextLevel(level: number): number {
		if (level <= 0) return EXP_SETTINGS.MIN_LEVEL_EXP;
		let totalExp = EXP_SETTINGS.MIN_LEVEL_EXP;
		for (let i = 1; i < level; i++) {
			totalExp += Math.floor(EXP_SETTINGS.MIN_LEVEL_EXP * Math.pow(EXP_SETTINGS.MULTIPLIER, i));
		}
		return totalExp;
	}
}

Impulse.ExpSystem = ExpSystem;

const generateProgressBar = (percentage: number, width = 200): string => {
	return `<div style="width: ${width}px; height: 15px; background: #e0e0e0; border-radius: 10px; overflow: hidden; display: inline-block;">` +
		`<div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #2ecc71, #27ae60); transition: width 0.3s ease;"></div>` +
		`</div> ${percentage}%`;
};

const createExpInfo = (userid: string, executedBy: string, currentExp: number, currentLevel: number, progressPercentage: number, expNeeded: number): string => {
	return `<div class="infobox"><strong>${Impulse.nameColor(userid, true, true)}</strong>${executedBy}<br>` +
		`<strong>Level:</strong> ${currentLevel}<br>` +
		`<strong>Progress:</strong> ${generateProgressBar(progressPercentage)}<br>` +
		`<strong>Current EXP:</strong> ${currentExp} ${EXP_SETTINGS.EXP_UNIT}<br>` +
		`<strong>EXP needed:</strong> ${expNeeded} more for Level ${currentLevel + 1}<br>` +
		`</div>`;
};

export const commands: Chat.Commands = {
	level: 'exp',
	exp(target, room, user) {
		if (!this.runBroadcast()) return;
		const userid = toID(target || user.name);
		const currentExp = ExpSystem.readExp(userid);
		const currentLevel = ExpSystem.getLevel(currentExp);
		const nextLevelExp = ExpSystem.getExpForNextLevel(currentLevel + 1);
		const previousLevelExp = ExpSystem.getExpForNextLevel(currentLevel);
		
		const expInCurrentLevel = currentExp - previousLevelExp;
		const expNeededForNextLevel = nextLevelExp - previousLevelExp;
		const progressPercentage = Math.floor((expInCurrentLevel / expNeededForNextLevel) * 100);
		const expNeeded = nextLevelExp - currentExp;
		const executedBy = user.name === target ? '' : ` (Checked by ${Impulse.nameColor(user.name, true, true)})`;
		
		this.sendReplyBox(createExpInfo(userid, executedBy, currentExp, currentLevel, progressPercentage, expNeeded));
	},
	
	giveexp(target, room, user) {
		this.checkCan('globalban');
		if (!target || !target.includes(',')) return this.sendReply(`Usage: /giveexp [user], [amount], [reason]`);
		const [targetName, amountStr, ...reasonArr] = target.split(',').map(p => p.trim());
		const targetUser = Users.get(targetName);
		const amount = parseInt(amountStr, 10);
		const reason = reasonArr.join(',').trim() || 'No reason specified.';
		if (!targetUser) return this.errorReply(`User "${targetName}" not found.`);
		if (isNaN(amount) || amount <= 0) return this.errorReply(`Please specify a valid positive amount.`);
		
		ExpSystem.addExp(targetUser.id, amount, reason, user.id);
		const newExp = ExpSystem.readExp(targetUser.id);
		const newLevel = ExpSystem.getLevel(newExp);
		const expForNext = ExpSystem.getExpForNextLevel(newLevel + 1);
		this.sendReplyBox(
			`${Impulse.nameColor(user.name, true, true)} gave ${amount} ${EXP_SETTINGS.EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''} to ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
			`New Level: ${newLevel} (${newExp}/${expForNext} ${EXP_SETTINGS.EXP_UNIT})`
		);
		
		this.modlog('GIVEEXP', targetUser, `${amount} ${EXP_SETTINGS.EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''}`, { by: user.id, reason });
		if (targetUser.connected) {
			targetUser.popup(
				`|html|You received <b>${amount} ${EXP_SETTINGS.EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''}</b> from <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
				`Reason: ${reason}<br>` +
				`You are now Level ${newLevel} (${newExp}/${expForNext} ${EXP_SETTINGS.EXP_UNIT})`
			);
		}
	},
	
	takeexp(target, room, user) {
		this.checkCan('globalban');
		if (!target || !target.includes(',')) return this.sendReply(`Usage: /takeexp [user], [amount], [reason]`);
		const [targetName, amountStr, ...reasonArr] = target.split(',').map(p => p.trim());
		const targetUser = Users.get(targetName);
		const amount = parseInt(amountStr, 10);
		const reason = reasonArr.join(',').trim() || 'No reason specified.';
		if (!targetUser) return this.errorReply(`User "${targetName}" not found.`);
		if (isNaN(amount) || amount <= 0) return this.errorReply(`Please specify a valid positive amount.`);
		
		ExpSystem.takeExp(targetUser.id, amount, reason, user.id);
		const newExp = ExpSystem.readExp(targetUser.id);
		const newLevel = ExpSystem.getLevel(newExp);
		const expForNext = ExpSystem.getExpForNextLevel(newLevel + 1);
		this.sendReplyBox(
			`${Impulse.nameColor(user.name, true, true)} took ${amount} ${EXP_SETTINGS.EXP_UNIT} from ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
			`New Level: ${newLevel} (${newExp}/${expForNext} ${EXP_SETTINGS.EXP_UNIT})`
		);
		this.modlog('TAKEEXP', targetUser, `${amount} ${EXP_SETTINGS.EXP_UNIT}`, { by: user.id, reason });
		if (targetUser.connected) {
			targetUser.popup(
				`|html|<b>${Impulse.nameColor(user.name, true, true)}</b> took <b>${amount} ${EXP_SETTINGS.EXP_UNIT}</b> from you.<br>` +
				`Reason: ${reason}<br>` +
				`You are now Level ${newLevel} (${newExp}/${expForNext} ${EXP_SETTINGS.EXP_UNIT})`
			);
		}
	},
	
	resetexp(target, room, user) {
		this.checkCan('globalban');
		if (!target) return this.sendReply(`Usage: /resetexp [user], [reason]`);
		const [targetName, ...reasonArr] = target.split(',').map(p => p.trim());
		const targetUser = Users.get(targetName);
		const reason = reasonArr.join(',').trim() || 'No reason specified.';
		if (!targetUser) return this.errorReply(`User "${targetName}" not found.`);
		
		ExpSystem.writeExp(targetUser.id, EXP_SETTINGS.DEFAULT_EXP);
		this.sendReplyBox(
			`${Impulse.nameColor(user.name, true, true)} reset ${Impulse.nameColor(targetUser.name, true, true)}'s EXP to ${EXP_SETTINGS.DEFAULT_EXP} ${EXP_SETTINGS.EXP_UNIT} (Level 0) (${reason}).`
		);
		this.modlog('RESETEXP', targetUser, `${EXP_SETTINGS.DEFAULT_EXP} ${EXP_SETTINGS.EXP_UNIT}`, { by: user.id, reason });
		if (targetUser.connected) {
			targetUser.popup(
				`|html|Your ${EXP_SETTINGS.EXP_UNIT} has been reset to <b>${EXP_SETTINGS.DEFAULT_EXP}</b> (Level 0) by <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
				`Reason: ${reason}`
			);
		}
	},
	
	resetexpall(target, room, user) {
		this.checkCan('globalban');
		const reason = target.trim() || 'No reason specified.';
		ExpSystem.resetAllExp();
		this.sendReplyBox(
			`All user EXP has been reset to ${EXP_SETTINGS.DEFAULT_EXP} ${EXP_SETTINGS.EXP_UNIT} (Level 0) (${reason}).`
		);
		this.modlog('RESETEXPALL', null, `all EXP to ${EXP_SETTINGS.DEFAULT_EXP} ${EXP_SETTINGS.EXP_UNIT}`, { by: user.id, reason });
		if (room) {
			room.add(
				`|html|<center><div class="broadcast-blue">` +
				`<b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${EXP_SETTINGS.EXP_UNIT} to <b>${EXP_SETTINGS.DEFAULT_EXP}</b> (Level 0).<br>` +
				`Reason: ${reason}` +
				`</div></center>`
			);
			room.update();
		}
	},
	
	expladder(target, room, user) {
		if (!this.runBroadcast()) return;
		const richest = ExpSystem.getRichestUsers(100);
		if (!richest.length) return this.sendReplyBox(`No users have any ${EXP_SETTINGS.EXP_UNIT} yet.`);
		const data = richest.map(([userid, exp], index) => {
			const level = ExpSystem.getLevel(exp);
			return [
				(index + 1).toString(),
				Impulse.nameColor(userid, true, true),
				`${exp} ${EXP_SETTINGS.EXP_UNIT}`,
				level.toString(),
				`${ExpSystem.getExpForNextLevel(level + 1)} ${EXP_SETTINGS.EXP_UNIT}`,
			];
		});
		const output = Impulse.generateThemedTable(
			`Top ${richest.length} Users by ${EXP_SETTINGS.EXP_UNIT}`,
			['Rank', 'User', 'EXP', 'Level', 'Next Level At'],
			data,
			Impulse.nameColor('TurboRx', true, true)
		);
		this.ImpulseReplyBox(output);
	},
	
	exphelp(target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<div><b><center>EXP System Commands</center></b>` +
			`<ul>` +
			`<li><code>/level [user]</code> (Or <code>/exp</code>) - Check your or another user's EXP, current level, and EXP needed for the next level.</li>` +
			`<li><code>/giveexp [user], [amount], [reason]</code> - Give a specified amount of EXP to a user. (Requires: @ and higher)</li>` +
			`<li><code>/takeexp [user], [amount], [reason]</code> - Take a specified amount of EXP from a user. (Requires: @ and higher)</li>` +
			`<li><code>/resetexp [user], [reason]</code> - Reset a user's EXP to ${EXP_SETTINGS.DEFAULT_EXP}. (Requires: @ and higher)</li>` +
			`<li><code>/resetexpall [reason]</code> - Reset all users' EXP to ${EXP_SETTINGS.DEFAULT_EXP}. (Requires: @ and higher)</li>` +
			`<li><code>/expladder</code> - View the top 100 users with the most EXP and their levels.</li>` +
			`</ul></div>`
		);
	},
};
