/* Experience (EXP) System Commands
 * Credits: Unknown (for the base economy system)
 * Updates & Typescript Conversion & EXP System:
 * Prince Sky
 */

import { FS } from '../lib/fs';

const EXP_FILE_PATH = 'impulse-db/exp.json';
const DEFAULT_EXP = 0;
const EXP_UNIT = `EXP`;
Impulse.expUnit = EXP_UNIT;

const MIN_LEVEL_EXP = 15;
const MULTIPLIER = 1.9;
let DOUBLE_EXP = false;

interface ExpData {
  [userid: string]: number;
}

export class ExpSystem {
  private static data: ExpData = ExpSystem.loadExpData();

  private static loadExpData(): ExpData {
    try {
      const rawData = FS(EXP_FILE_PATH).readIfExistsSync();
      return rawData ? (JSON.parse(rawData) as ExpData) : {};
    } catch (error) {
      console.error(`Error reading EXP data: ${error}`);
      return {};
    }
  }

  private static saveExpData(): void {
    try {
      const dataToWrite: ExpData = {};
      for (const id in this.data) {
        if (Object.prototype.hasOwnProperty.call(this.data, id)) {
          dataToWrite[toID(id)] = this.data[id];
        }
      }
      FS(EXP_FILE_PATH).writeUpdate(() => JSON.stringify(dataToWrite, null, 2));
    } catch (error) {
      console.error(`Error saving EXP data: ${error}`);
    }
  }

  static writeExp(userid: string, amount: number): void {
    this.data[toID(userid)] = amount;
    this.saveExpData();
  }

  static readExp(userid: string): number {
    return this.data[toID(userid)] || DEFAULT_EXP;
  }

  static hasExp(userid: string, amount: number): boolean {
    return this.readExp(userid) >= amount;
  }

  static addExp(userid: string, amount: number, reason?: string, by?: string): number {
    const id = toID(userid);
    const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
    this.data[id] = (this.data[id] || 0) + gainedAmount;
    this.saveExpData();
    return this.data[id];
  }

  static takeExp(userid: string, amount: number, reason?: string, by?: string): number {
    const id = toID(userid);
    const currentExp = this.data[id] || 0;
    if (currentExp >= amount) {
      this.data[id] = currentExp - amount;
      this.saveExpData();
      return this.data[id];
    }
    return currentExp;
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
    if (exp < MIN_LEVEL_EXP) return 0;
    let level = 1;
    let requiredExp = MIN_LEVEL_EXP;
    let remainingExp = exp - requiredExp;
    while (remainingExp >= Math.floor(requiredExp * MULTIPLIER)) {
      requiredExp = Math.floor(requiredExp * MULTIPLIER);
      remainingExp -= requiredExp;
      level++;
    }
    return level;
  }

  static getExpForNextLevel(level: number): number {
    if (level < 0) return MIN_LEVEL_EXP;
    let requiredExp = MIN_LEVEL_EXP;
    for (let i = 1; i < level; i++) {
      requiredExp = Math.floor(requiredExp * MULTIPLIER);
    }
    return requiredExp;
  }
}

Impulse.ExpSystem = ExpSystem;

function generateThemedTable(
  title: string,
  headerRow: string[],
  dataRows: string[][],
  styleBy?: string
): string {
  let output = `<div class="themed-table-container" style="max-width: 100%; overflow-x: auto;">`; // Added overflow-x: auto here
  output += `<h3 class="themed-table-title">${title}</h3>`;
  if (styleBy) {
    output += `<p class="themed-table-by">Style By ${styleBy}</p>`;
  }
  output += `<table class="themed-table" style="width: 100%; border-collapse: collapse;">`; // Added border-collapse for better visual
  output += `<tr class="themed-table-header">`;
  headerRow.forEach(header => {
    output += `<th>${header}</th>`;
  });
  output += `</tr>`;

  dataRows.forEach(row => {
    output += `<tr class="themed-table-row">`;
    row.forEach(cell => {
      output += `<td>${cell}</td>`;
    });
    output += `</tr>`;
  });

  output += `</table></div>`;
  return output;
}

Impulse.generateThemedTable = generateThemedTable;

export const commands: ChatCommands = {
  level(target, room, user) {
    if (!target) target = user.name;
    if (!this.runBroadcast()) return;
    const userid = toID(target);
    const exp = ExpSystem.readExp(userid);
    const level = ExpSystem.getLevel(exp);
    const expForNext = ExpSystem.getExpForNextLevel(level + 1);
    this.sendReplyBox(`${Impulse.nameColor(userid, true, true)} is Level ${level} with ${exp} ${EXP_UNIT}. Needs ${expForNext - exp} more ${EXP_UNIT} to reach Level ${level + 1}.`);
  },

  giveexp(target, room, user) {
    this.checkCan('globalban');
    if (!target) return this.sendReply(`Usage: /giveexp [user], [amount], [reason]`);
    const parts = target.split(',').map(p => p.trim());
    if (parts.length < 2) return this.sendReply(`Usage: /giveexp [user], [amount], [reason]`);

    const targetUser = Users.get(parts[0]);
    const amount = parseInt(parts[1], 10);
    const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

    if (!targetUser) {
      return this.errorReply(`User "${parts[0]}" not found.`);
    }
    if (isNaN(amount) || amount <= 0) {
      return this.errorReply(`Please specify a valid positive amount.`);
    }

    ExpSystem.addExp(targetUser.id, amount, reason, user.id);
    const newExp = ExpSystem.readExp(targetUser.id);
    const newLevel = ExpSystem.getLevel(newExp);
    const expForNext = ExpSystem.getExpForNextLevel(newLevel + 1);
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} gave ${amount} ${EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''} to ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ${Impulse.nameColor(targetUser.name, true, true)} is now Level ${newLevel} with ${newExp} ${EXP_UNIT}. Needs ${expForNext - newExp} more ${EXP_UNIT} to reach Level ${newLevel + 1}.`);
    this.modlog('GIVEEXP', targetUser, `${amount} ${EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(`|html|You received <b>${amount} ${EXP_UNIT}${DOUBLE_EXP ? ' (Double EXP)' : ''}</b> from <b> ${Impulse.nameColor(user.name, true, true)}</b>.<br>Reason: ${reason}<br>You are now Level ${newLevel} with ${newExp} ${EXP_UNIT}.`);
    }
  },

  takeexp(target, room, user) {
    this.checkCan('globalban');
    if (!target) return this.sendReply(`Usage: /takeexp [user], [amount], [reason]`);
    const parts = target.split(',').map(p => p.trim());
    if (parts.length < 2) return this.sendReply(`Usage: /takeexp [user], [amount], [reason]`);

    const targetUser = Users.get(parts[0]);
    const amount = parseInt(parts[1], 10);
    const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

    if (!targetUser) {
      return this.errorReply(`User "${parts[0]}" not found.`);
    }
    if (isNaN(amount) || amount <= 0) {
      return this.errorReply(`Please specify a valid positive amount.`);
    }

    ExpSystem.takeExp(targetUser.id, amount, reason, user.id);
    const newExp = ExpSystem.readExp(targetUser.id);
    const newLevel = ExpSystem.getLevel(newExp);
    const expForNext = ExpSystem.getExpForNextLevel(newLevel + 1);
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} took ${amount} ${EXP_UNIT} from ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ${Impulse.nameColor(targetUser.name, true, true)} is now Level ${newLevel} with ${newExp} ${EXP_UNIT}. Needs ${expForNext - newExp} more ${EXP_UNIT} to reach Level ${newLevel + 1}.`);
    this.modlog('TAKEEXP', targetUser, `${amount} ${EXP_UNIT}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(`|html|<b>${Impulse.nameColor(user.name, true, true)}</b> took <b>${amount} ${EXP_UNIT}</b> from you.<br>Reason: ${reason}<br>You are now Level ${newLevel} with ${newExp} ${EXP_UNIT}.`);
    }
  },

  resetexp(target, room, user) {
    this.checkCan('globalban');
    if (!target) return this.sendReply(`Usage: /resetexp [user], [reason]`);
    const parts = target.split(',').map(p => p.trim());
    const targetUser = Users.get(parts[0]);
    const reason = parts.slice(1).join(',').trim() || 'No reason specified.';

    if (!targetUser) {
      return this.errorReply(`User "${parts[0]}" not found.`);
    }

    ExpSystem.writeExp(targetUser.id, DEFAULT_EXP);
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} reset ${Impulse.nameColor(targetUser.name, true, true)}'s EXP to ${DEFAULT_EXP} ${EXP_UNIT} (Level 0) (${reason}).`);
    this.modlog('RESETEXP', targetUser, `${DEFAULT_EXP} ${EXP_UNIT}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(`|html|Your ${EXP_UNIT} has been reset to <b>${DEFAULT_EXP}</b> (Level 0) by <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>Reason: ${reason}`);
    }
  },

  resetexpall(target, room, user) {
    this.checkCan('globalban');
    const reason = target.trim() || 'No reason specified.';

    ExpSystem.resetAllExp();
    this.sendReplyBox(`All user EXP has been reset to ${DEFAULT_EXP} ${EXP_UNIT} (Level 0) (${reason}).`);
    this.modlog('RESETEXPALL', null, `all EXP to ${DEFAULT_EXP} ${EXP_UNIT}`, { by: user.id, reason });
    room?.add(`|html|<center><div class="broadcast-blue"><b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${EXP_UNIT} to <b>${DEFAULT_EXP}</b> (Level 0).<br>Reason: ${reason}</div></center>`);
  },

  richestusers(target, room, user) {
    if (!this.runBroadcast()) return;
    const richest = ExpSystem.getRichestUsers(100);
    if (!richest.length) {
      return this.sendReplyBox(`No users have any ${EXP_UNIT} yet.`);
    }

    const title = `Top ${richest.length} Users by ${EXP_UNIT}`;
    const header = ['Rank', 'User', 'EXP', 'Level', 'Next Level'];
    const data = richest.map(([userid, exp], index) => {
      const level = ExpSystem.getLevel(exp);
      const expForNext = ExpSystem.getExpForNextLevel(level + 1);
      return [
        (index + 1).toString(),
        Impulse.nameColor(userid, true, true),
        `${exp} ${EXP_UNIT}`,
        level.toString(),
        `${expForNext} ${EXP_UNIT}`,
      ];
    });
    const styleBy = Impulse.nameColor('TurboRx', true, true);

    const output = generateThemedTable(title, header, data, styleBy);
    this.ImpulseReplyBox(output);
  },

  explogs(target, room, user) {
    if (!this.runBroadcast()) return;
	 this.checkCan('globalban');
    this.sendReplyBox(`The EXP logs feature has been removed.`);
  },

  exphelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
		 `<div><b><center>EXP System Commands By ${Impulse.nameColor('Prince Sky', true, true)}</center></b>` +
		 `<ul><li><code>/level [user]</code> - Check your or another user's EXP, current level, and EXP needed for the next level.</li>` +
		 `<li><code>/giveexp [user], [amount] ,[reason]</code> - Give a specified amount of EXP to a user. (Requires: @ and higher).</li>` +
		 `<li><code>/takeexp [user], [amount] ,[reason]</code> - Take a specified amount of EXP from a user. (Requires: @ and higher).</li>` +
		 `<li><code>/resetexp [user], [reason]</code> - Reset a user's EXP to ${DEFAULT_EXP}. (Requires: @ and higher).</li>` +
		 `<li><code>/resetexpall [reason]</code> - Reset all users' EXP to ${DEFAULT_EXP}. (Requires: @ and higher).</li>` +
		 `<li><code>/richestusers</code> - View the top 100 users with the most EXP and their levels.</li>` +
		 `</ul></div>`);
  },
};
