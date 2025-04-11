/**
 * EXP SYSTEM FOR POKEMON SHOWDOWN
 * By Volco, modified by Insist
 * Updates & Typescript Conversion
 * Prince Sky
 */

const DEFAULT_AMOUNT = 0;
let DOUBLE_XP = false;

const minLevelExp = 15;
const multiply = 1.9;

function isExp(exp: any): number | string {
	const numExp = Number(exp);
	if (isNaN(exp)) return "Must be a number.";
	if (String(exp).includes('.')) return "Cannot contain a decimal.";
	if (numExp < 1) return "Cannot be less than one EXP.";
	return numExp;
}

Impulse.isExp = isExp;

interface EXPInterface {
	readExp: (userid: string, callback?: (amount: number) => any) => number | void;
	writeExp: (userid: string, amount: number, callback?: (newTotal: number) => any) => void;
}

let EXP: EXPInterface = Impulse.EXP = {
	readExp: function (userid: string, callback?: (amount: number) => any) {
		userid = toID(userid);

		const amount = Db.exp.get(userid, DEFAULT_AMOUNT) as number;
		if (typeof callback !== 'function') {
			return amount;
		} else {
			return callback(amount);
		}
	},

	writeExp: function (userid: string, amount: number, callback?: (newTotal: number) => any) {
		// In case someone forgot to turn `userid` into an actual ID...
		userid = toID(userid);

		// In case someone forgot to make sure `amount` was a Number...
		amount = Number(amount);
		if (isNaN(amount)) {
			throw new Error(`EXP.writeExp: Expected amount parameter to be a Number, instead received ${typeof amount}`);
		}
		const curTotal = Db.exp.get(userid, DEFAULT_AMOUNT) as number;
		Db.exp.set(userid, curTotal + amount);
		const newTotal = Db.exp.get(userid) as number;
		if (callback && typeof callback === 'function') {
			// If a callback is specified, return `newTotal` through the callback.
			return callback(newTotal);
		}
	},
};

class ExpFunctions {
	granting: NodeJS.Timeout | null = null;

	constructor() {
		this.start();
	}

	grantExp() {
		for (const user of Users.users.values()) {
			if (!user?.named || !user.connected || !user.lastPublicMessage) continue;
			if (Date.now() - user.lastPublicMessage > 300000) continue;
			this.addExp(user, null, 1);
		}
	}

	level(userid: string): number {
		userid = toID(userid);
		const curExp = (Db.exp.get(userid, 0) as number) || 0;
		return Math.floor(Math.pow(curExp / minLevelExp, 1 / multiply) + 1);
	}

	nextLevel(user: User | string): number {
		const userid = toID(user);
		const curExp = (Db.exp.get(userid, 0) as number) || 0;
		const lvl = this.level(userid);
		return Math.ceil(Math.pow(lvl, multiply) * minLevelExp) - curExp;
	}

	addExp(user: User | string | null, room: Room | null, amount: number): boolean | undefined {
		if (!user) return;
		if (!room) room = Rooms('lobby');
		const targetUser = Users(toID(user));
		if (!targetUser?.registered) return false;
		if (Db.expoff.has(targetUser.userid)) return false;
		let actualAmount = amount;
		if (DOUBLE_XP || targetUser.doubleExp) actualAmount *= 2;
		EXP.readExp(targetUser.userid, totalExp => {
			const oldLevel = this.level(targetUser.userid);
			EXP.writeExp(targetUser.userid, actualAmount, newTotal => {
				const level = this.level(targetUser.userid);
				if (oldLevel < level) {
					let reward = '';
					switch (level) {
					case 35:
						Economy.addMoney(targetUser.userid, 50);
						reward = `50 ${Impulse.currency}.`;
						break;
					default:
						const moneyReward = Math.ceil(level * 0.7);
						Economy.addMoney(targetUser.userid, moneyReward);
						reward = `${moneyReward} ${Impulse.currency}.`;
					}
					targetUser.sendTo(room, `|html|<center><font size=4><strong><i>Level Up!</i></strong></font><br />You have reached level ${level}, and have earned ${reward}</strong></center>`);
				}
			});
		});
		return true;
	}

	start() {
		this.granting = setInterval(() => this.grantExp(), 30000);
	}

	end() {
		if (this.granting) {
			clearInterval(this.granting);
			this.granting = null;
		}
	}
}

if (Impulse.ExpControl) {
	Impulse.ExpControl.end();
	delete Impulse.ExpControl;
}

Impulse.ExpControl = new ExpFunctions();

export const commands: ChatCommands = {
	'!exp': true,
	level: 'exp',
	xp: 'exp',
	exp: function (this: CommandContext, target: string | undefined, room: Room | null, user: User) {
		if (!this.runBroadcast()) return;
		let targetId = toID(target);
		if (target || (!target && this.broadcasting)) {
			if (!target) targetId = user.userid;
			EXP.readExp(targetId, exp => {
				this.sendReplyBox(`${(Impulse.nameColor(targetId, true, true)} has ${exp} exp and is level ${Impulse.ExpControl.level(targetId)} and needs ${Impulse.ExpControl.nextLevel(targetId)} to reach the next level.`);
			});
		} else {
			EXP.readExp(user.userid, exp => {
				this.sendReplyBox(
					`Name: ${Impulse.nameColor(user.userid, true, true)}<br />Current level: ${Impulse.ExpControl.level(user.userid)}<br />Current Exp: ${exp}<br />Exp Needed for Next level: ${Impulse.ExpControl.nextLevel(user.userid)}` +
					`<br />All rewards have a 1 time use! <br /><br />` +
					`Level 35 unlocks 50 ${Impulse.currency}. <br /><br />`
				);
			});
		}
	},

	givexp: 'givexp',
	givexp: function (this: CommandContext, target: string, room: Room | null, user: User) {
		this.checkCan('globalban');
		if (!target || !target.includes(',')) return this.parse('/help givexp');

		const parts = target.split(',');
		const username = parts[0].trim();
		const uid = toID(username);
		const amount = isExp(parts[1].trim());

		if (typeof amount === 'number' && amount > 1000) return this.sendReply("You cannot give more than 1,000 exp at a time.");
		if (username.length >= 19) return this.sendReply("Usernames are required to be less than 19 characters long.");
		if (typeof amount === 'string') return this.errorReply(amount);
		if (!Users.get(username)) return this.errorReply("The target user could not be found");

		Impulse.ExpControl.addExp(uid, room, amount);
		this.sendReply(`${uid} has received ${amount} ${(amount === 1 ? " exp." : " exp.")}`);
	},
	givexphelp: ["/givexp [user], [amount] - Give a user a certain amount of exp."],

	resetexp: 'resetxp',
	confirmresetexp: 'resetxp',
	resetxp: function (this: CommandContext, target: string, room: Room | null, user: User, connection: Connection, cmd: string) {
    this.checkCan('globalban');
		if (!target) return this.errorReply('USAGE: /resetxp (USER)');
		const parts = target.split(',');
		const targetUser = parts[0].toLowerCase().trim();
		if (cmd !== "confirmresetexp") {
			return this.popupReply(`|html|<center><button name="send" value="/confirmresetexp ${targetUser}" style="background-color: red; height: 300px; width: 150px"><strong><font color= "white" size= 3>Confirm XP reset of ${Impulse.nameColor(targetUser, true, true)}; this is only to be used in emergencies, cannot be undone!</font></strong></button>`);
		}
		Db.exp.set(toID(target), 0);
		const targetUserObj = Users.get(target);
		if (targetUserObj) targetUserObj.popup('Your XP was reset by an Administrator. This cannot be undone and nobody below the rank of Administrator can assist you or answer questions about this.');
		user.popup(`|html|You have reset the XP of ${Impulse.nameColor(targetUser, true, true)}.`);
		Monitor.adminlog(`[EXP Monitor] ${user.name} has reset the XP of ${target}`);
		if (room) room.update();
	},

	doublexp: "doublexp",
	doublexp: function (this: CommandContext, target: string, room: Room | null, user: User) {
		this.checkCan('globalban');
		DOUBLE_XP = !DOUBLE_XP;
		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.roomid !== "global") curRoom.addRaw(`<div class="broadcast-${(DOUBLE_XP ? "green" : "red")}"><strong>Double XP is turned ${(DOUBLE_XP ? "on! You will now " : "off! You will no longer ")} receive double XP.</strong></div>`).update();
		}
		return this.sendReply(`Double XP was turned ${(DOUBLE_XP ? "ON" : "OFF")}.`);
	},

	expunban: function (this: CommandContext, target: string, room: Room | null, user: User) {
		this.checkCan('globalban');
		if (!target) return this.parse('/help expunban');
		const targetId = toID(target);
		if (!Db.expoff.has(targetId)) return this.errorReply(`${target} is not currently exp banned.`);
		Db.expoff.delete(targetId);
		this.globalModlog(`EXPUNBAN`, targetId, ` by ${user.name}`);
		this.addModAction(`${target} was exp unbanned by ${user.name}.`);
		this.sendReply(`${target} is no longer banned from exp.`);
	},
	expunbanhelp: ['/expunban target - allows a user to gain exp if they were exp banned'],

	expban: function (this: CommandContext, target: string, room: Room | null, user: User) {
		this.checkCan('globalban');
		if (!target) return this.parse('/help expban');
		const targetId = toID(target);
		if (Db.expoff.has(targetId)) return this.errorReply(`${target} is not currently exp banned.`);
		Db.expoff.set(targetId, true);
		this.globalModlog(`EXPBAN`, targetId, ` by ${user.name}`);
		this.addModAction(`${target} was exp banned by ${user.name}.`);
		this.sendReply(`${target} is now banned from exp.`);
	},
	expbanhelp: ['/expban target - bans a user from gaining exp until removed'],

	'!xpladder': true,
	expladder: 'xpladder',
	xpladder: function (this: CommandContext, target: string | undefined, room: Room | null, user: User) {
		if (!target) target = '100';
		const targetNum = parseInt(target, 10);
		if (isNaN(targetNum) || targetNum <= 0) {
			return this.sendReply("Usage: /xpladder [number]");
		}
		if (!this.runBroadcast()) return;
		const keys = Db.exp.keys().map(name => ({name: name, exp: Db.exp.get(name) as number}));
		if (!keys.length) return this.sendReplyBox("EXP ladder is empty.");
		keys.sort((a, b) => b.exp - a.exp);
		const header = ["Rank", "Name", "EXP", "Level"];
		const data = keys.slice(0, targetNum).map((entry, index) => [
			`${index + 1}`,
			`${Impulse.nameColor(entry.name, true)}`,
			`${entry.exp}`,
			`${Impulse.ExpControl.level(entry.name)}`,
		]);
		this.sendReplyBox(Impulse.generateThemedTable("EXP Ladder", header, data, "EXP"));
	},
};
