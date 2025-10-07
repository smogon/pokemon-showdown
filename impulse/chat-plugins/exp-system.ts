/*
* Pokemon Showdown
* Experience System
* Instructions:
* Add this code in server/chat.ts
* In parse function//Output the message
if (this.user.registered) Impulse.ExpSystem.addExp(this.user.id, 1);
*/

import { ImpulseDB } from '../../impulse/impulse-db';

const DEFAULT_EXP = 0;
const EXP_UNIT = `EXP`;
Impulse.expUnit = EXP_UNIT;

const MIN_LEVEL_EXP = 10;
const MULTIPLIER = 1.5;
let DOUBLE_EXP = false;
let DOUBLE_EXP_END_TIME: number | null = null;
const EXP_COOLDOWN = 30000;

const formatTime = (date: Date) => {
  return date.toISOString().replace('T', ' ').slice(0, 19);
};

const getDurationMs = (value: number, unit: string): number => {
  const units: { [key: string]: number } = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000
  };
  return value * (units[unit] || 0);
};

interface CooldownData {
  [userid: string]: number;
}

// MongoDB Document Interfaces
interface ExpDocument {
  _id: string; // userid
  exp: number;
  level: number;
  lastUpdated: Date;
}

interface ExpConfigDocument {
  _id: string; // 'config'
  doubleExp: boolean;
  doubleExpEndTime: number | null;
  lastUpdated: Date;
}

// Get typed MongoDB collections
const ExpDB = ImpulseDB<ExpDocument>('expdata');
const ExpConfigDB = ImpulseDB<ExpConfigDocument>('expconfig');

export class ExpSystem {
  private static cooldowns: CooldownData = {};

  private static async loadExpConfig(): Promise<void> {
    try {
      const config = await ExpConfigDB.findOne({ _id: 'config' });
      if (config) {
        DOUBLE_EXP = config.doubleExp;
        DOUBLE_EXP_END_TIME = config.doubleExpEndTime;
      }
    } catch (error) {
      console.error(`Error reading EXP config: ${error}`);
    }
  }

  private static async saveExpConfig(): Promise<void> {
    try {
      // Use atomic upsert
      await ExpConfigDB.upsert(
        { _id: 'config' },
        {
          _id: 'config',
          doubleExp: DOUBLE_EXP,
          doubleExpEndTime: DOUBLE_EXP_END_TIME,
          lastUpdated: new Date(),
        }
      );
    } catch (error) {
      console.error(`Error saving EXP config: ${error}`);
    }
  }

  private static isOnCooldown(userid: string): boolean {
    const lastExp = this.cooldowns[userid] || 0;
    return Date.now() - lastExp < EXP_COOLDOWN;
  }

  static async writeExp(userid: string, amount: number): Promise<void> {
    const id = toID(userid);
    const level = this.getLevel(amount);
    
    // Use atomic upsert instead of manual insert/update logic
    await ExpDB.upsert(
      { _id: id },
      {
        _id: id,
        exp: amount,
        level: level,
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
    // More efficient: query directly instead of fetching full document
    const doc = await ExpDB.findOne({ _id: id, exp: { $gte: amount } });
    return doc !== null;
  }

  static async hasLevel(userid: string, level: number): Promise<boolean> {
    const id = toID(userid);
    // More efficient: query directly instead of fetching and calculating
    const doc = await ExpDB.findOne({ _id: id, level: { $gte: level } });
    return doc !== null;
  }
  
  static async addExp(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
    const id = toID(userid);
    
    if (!by && this.isOnCooldown(id)) {
      return await this.readExp(id);
    }

    // Get current exp and level for level-up detection
    const currentDoc = await ExpDB.findOne({ _id: id });
    const currentExp = currentDoc ? currentDoc.exp : DEFAULT_EXP;
    const currentLevel = this.getLevel(currentExp);
    
    const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
    const newExp = currentExp + gainedAmount;
    const newLevel = this.getLevel(newExp);
    
    // Use atomic findOneAndUpdate with upsert for race-condition safety
    // This ensures the operation is atomic even with concurrent requests
    await ExpDB.findOneAndUpdate(
      { _id: id },
      { 
        $inc: { exp: gainedAmount },
        $set: { level: newLevel, lastUpdated: new Date() },
        $setOnInsert: { _id: id }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    if (!by) {
      this.cooldowns[id] = Date.now();
    }
    
    // Check if user leveled up
    if (newLevel > currentLevel) {
      await this.notifyLevelUp(id, newLevel, currentLevel);
    }
    
    return newExp;
  }

  static async addExpRewards(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
    const id = toID(userid);
    
    // Get current exp and level for level-up detection
    const currentDoc = await ExpDB.findOne({ _id: id });
    const currentExp = currentDoc ? currentDoc.exp : DEFAULT_EXP;
    const currentLevel = this.getLevel(currentExp);
    
    const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
    const newExp = currentExp + gainedAmount;
    const newLevel = this.getLevel(newExp);
    
    // Use atomic operation
    await ExpDB.findOneAndUpdate(
      { _id: id },
      { 
        $inc: { exp: gainedAmount },
        $set: { level: newLevel, lastUpdated: new Date() },
        $setOnInsert: { _id: id }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    // Check if user leveled up
    if (newLevel > currentLevel) {
      await this.notifyLevelUp(id, newLevel, currentLevel);
    }
    
    return newExp;
  }

  // New method to handle level-up notifications
  static async notifyLevelUp(userid: string, newLevel: number, oldLevel: number): Promise<void> {
    const user = Users.get(userid);
    if (!user || !user.connected) return;
    
    // Calculate rewards if any (optional)
    let rewards = '';
    
    // For milestone levels, we could give special rewards
    /*if (newLevel % 5 === 0) {
      // Example: Give bonus EXP for milestone levels
      const bonusExp = newLevel * 5;
      await this.addExpRewards(userid, bonusExp, 'Level milestone bonus');
      rewards = `You received a bonus of ${bonusExp} ${EXP_UNIT} for reaching a milestone level!`;
    }*/
    
    // Send popup notification to user
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
    
    // For significant levels, we could announce in a room
    /*if (newLevel % 10 === 0) {
      const mainRoom = Rooms.get('lobby');
      if (mainRoom) {
        mainRoom.add(
          `|html|<div class="broadcast-blue">` +
          `<b>${Impulse.nameColor(userid, true, true)}</b> has reached <b>Level ${newLevel}</b>!` +
          `</div>`
        ).update();
      }
    }*/
  }

  static async checkDoubleExpStatus(room?: Room | null, user?: User) {
    if (DOUBLE_EXP && DOUBLE_EXP_END_TIME && Date.now() >= DOUBLE_EXP_END_TIME) {
      DOUBLE_EXP = false;
      DOUBLE_EXP_END_TIME = null;
      await this.saveExpConfig();
    }
    if (!room) return;
    let message;
    if (DOUBLE_EXP) {
      const durationText = DOUBLE_EXP_END_TIME 
        ? `until ${formatTime(new Date(DOUBLE_EXP_END_TIME))} UTC`
        : 'No duration specified';
          
      message = 
        `<div class="broadcast-blue">` +
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
    
    if (user) {
      const status = DOUBLE_EXP ? 'enabled' : 'disabled';
      const duration = DOUBLE_EXP_END_TIME 
        ? `until ${formatTime(new Date(DOUBLE_EXP_END_TIME))} UTC`
        : 'No duration specified';
      //this.modlog('TOGGLEDOUBLEEXP', null, `${status} - ${duration}`, { by: user.id });
    }
  }

  static async grantExp() {
    Users.users.forEach(async user => {
      if (!user || !user.named || !user.connected || !user.lastPublicMessage) return;
      if (Date.now() - user.lastPublicMessage > 300000) return;
      await this.addExp(user.id, 1);
    });
  }

  static async takeExp(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
    const id = toID(userid);
    
    // Use atomic $inc with negative value for safe decrement
    const result = await ExpDB.findOneAndUpdate(
      { _id: id, exp: { $gte: amount } }, // Only decrement if user has enough exp
      { 
        $inc: { exp: -amount },
        $set: { lastUpdated: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    if (result) {
      // Update level after exp change
      const newLevel = this.getLevel(result.exp);
      if (result.level !== newLevel) {
        await ExpDB.updateOne(
          { _id: id },
          { $set: { level: newLevel } }
        );
      }
      return result.exp;
    }
    
    // User doesn't have enough exp or doesn't exist
    const doc = await ExpDB.findOne({ _id: id });
    return doc ? doc.exp : DEFAULT_EXP;
  }

  static async resetAllExp(): Promise<void> {
    // Efficient bulk delete operation
    await ExpDB.deleteMany({});
  }

  static async getRichestUsers(limit: number = 100): Promise<[string, number][]> {
    // Use MongoDB sort and limit
    const docs = await ExpDB.find({}, { sort: { exp: -1 }, limit });
    return docs.map(doc => [doc._id, doc.exp]);
  }

  static getLevel(exp: number): number {
    if (exp < MIN_LEVEL_EXP) return 0;
    let level = 1;
    let totalExp = MIN_LEVEL_EXP;
    
    while (exp >= totalExp) {
      totalExp += Math.floor(MIN_LEVEL_EXP * Math.pow(MULTIPLIER, level));
      level++;
    }
    return level - 1;
  }

  static getExpForNextLevel(level: number): number {
    if (level <= 0) return MIN_LEVEL_EXP;
    let totalExp = MIN_LEVEL_EXP;
    for (let i = 1; i < level; i++) {
      totalExp += Math.floor(MIN_LEVEL_EXP * Math.pow(MULTIPLIER, i));
    }
    return totalExp;
  }

  // Initialize config on startup
  static async init(): Promise<void> {
    await this.loadExpConfig();
  }
}

// Initialize the ExpSystem
ExpSystem.init();

Impulse.ExpSystem = ExpSystem;

export const pages: Chat.PageTable = {
  async expladder(args, user) {
    const richest = await ExpSystem.getRichestUsers(100);
    if (!richest.length) {
      return `<div class="pad"><h2>No users have any ${EXP_UNIT} yet.</h2></div>`;
    }

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

    const output = Impulse.generateThemedTable(
      `Exp Ladder`,
      ['Rank', 'User', 'EXP', 'Level', 'Next Level At'],
      data
    );
    return `${output}`;
  },
};


export const commands: Chat.ChatCommands = {
  exp: {
    '': 'level',
    async level(target, room, user) {
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

    async give(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply(`Usage: /exp give [user], [amount], [reason]`);
      const parts = target.split(',').map(p => p.trim());
      if (parts.length < 2) return this.sendReply(`Usage: /exp give [user], [amount], [reason]`);

      const targetUser = Users.get(parts[0]);
      const amount = parseInt(parts[1], 10);
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

    async take(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply(`Usage: /exp take [user], [amount], [reason]`);
      const parts = target.split(',').map(p => p.trim());
      if (parts.length < 2) return this.sendReply(`Usage: /exp take [user], [amount], [reason]`);

      const targetUser = Users.get(parts[0]);
      const amount = parseInt(parts[1], 10);
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

    async reset(target, room, user) {
      this.checkCan('globalban');
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

    async resetall(target, room, user) {
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

    async toggledouble(target, room, user) {
      this.checkCan('globalban');
      
      if (!target) {
        DOUBLE_EXP = !DOUBLE_EXP;
        DOUBLE_EXP_END_TIME = null;
        await ExpSystem.saveExpConfig();
        await ExpSystem.checkDoubleExpStatus(room, user);
        return;
      }

      if (target.toLowerCase() === 'off') {
        DOUBLE_EXP = false;
        DOUBLE_EXP_END_TIME = null;
        await ExpSystem.saveExpConfig();
        await ExpSystem.checkDoubleExpStatus(room, user);
        return;
      }

      const match = target.match(/^(\d+)\s*(minute|hour|day)s?$/i);
      if (!match) {
        return this.errorReply('Invalid format. Use: number + unit (minutes/hours/days)');
      }

      const [, amount, unit] = match;
      const duration = getDurationMs(parseInt(amount), unit.toLowerCase());
      const endTime = Date.now() + duration;

      DOUBLE_EXP = true;
      DOUBLE_EXP_END_TIME = endTime;
      
      await ExpSystem.saveExpConfig();
      await ExpSystem.checkDoubleExpStatus(room, user);
      setTimeout(async () => await ExpSystem.checkDoubleExpStatus(), duration);
    },

    async ladder(target, room, user) {
      if (!this.runBroadcast()) return;
      return this.parse(`/join view-expladder`);
    },

	  async help(target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReplyBox(
        `<div><b><center>EXP System Commands By ${Impulse.nameColor('Prince Sky', true, false)}</center></b><br>` +
        `<ul>` +
        `<li><code>/exp level [user]</code> (Or <code>/exp</code>) - Check your or another user's EXP, current level, and EXP needed for the next level</li>` +
        `<li><code>/exp give [user], [amount], [reason]</code> - Give a specified amount of EXP to a user</li>` +
        `<li><code>/exp take [user], [amount], [reason]</code> - Take a specified amount of EXP from a user</li>` +
        `<li><code>/exp reset [user], [reason]</code> - Reset a user's EXP to ${DEFAULT_EXP}</li>` +
        `<li><code>/exp resetall [reason]</code> - Reset all users' EXP to ${DEFAULT_EXP}</li>` +
        `<li><code>/exp ladder</code> - View the top 100 users with the most EXP and their levels</li>` +
        `<li><code>/exp toggledouble [duration]</code> - Toggle double EXP with optional duration (e.g., "2 hours", "1 day", "30 minutes"). Use "off" to disable</li>` +
        `</ul>` +
        `<small>Commands give, take, reset, and toggledouble require @ or higher permission. Command resetall requires ~ permission.</small>` +
        `</div>`
      );
    },
  },
};
