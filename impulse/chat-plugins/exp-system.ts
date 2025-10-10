/**
 * Pokemon Showdown - Modern Experience System
 * 
 * A streamlined and efficient leveling system for Pokemon Showdown servers.
 * Features a clean API, atomic operations, and modern database integration.
 * 
 * Key Features:
 * - Simple leveling system with configurable scaling
 * - Atomic MongoDB operations for data consistency
 * - Clean command interface
 * - Efficient leaderboard system
 * - Admin moderation tools
 * 
 * Integration:
 * This system integrates with server/chat.ts at line 693:
 *   if (this.user.registered) Impulse.ExpSystem.addExp(this.user.id, 1);
 * 
 * @author Modern Implementation
 * @license MIT
 */

import { ImpulseDB } from '../../impulse/impulse-db';
import '../utils';

// Configuration
const CONFIG = {
  EXP_PER_MESSAGE: 1,
  COOLDOWN_MS: 30000, // 30 seconds
  BASE_LEVEL_EXP: 100,
  LEVEL_MULTIPLIER: 1.2,
  MAX_LEVEL: 1000,
} as const;

// Global state
let cooldowns = new Map<string, number>();

/**
 * User experience data structure
 */
interface UserExp {
  _id: string; // userid
  exp: number;
  level: number;
  lastUpdated: Date;
  totalMessages: number;
}

/**
 * Experience System Class
 */
export class ExpSystem {
  private static db = ImpulseDB<UserExp>('userexp');

  /**
   * Add experience to a user
   * @param userid - User ID
   * @param amount - Amount of EXP to add
   * @param bypassCooldown - Skip cooldown check (for admin actions)
   * @returns Final EXP amount
   */
  static async addExp(userid: string, amount: number = CONFIG.EXP_PER_MESSAGE, bypassCooldown: boolean = false): Promise<number> {
    const id = toID(userid);
    
    // Check cooldown unless bypassed
    if (!bypassCooldown && this.isOnCooldown(id)) {
      return await this.getExp(id);
    }

    // Atomic update with upsert
    const result = await this.db.findOneAndUpdate(
      { _id: id },
      {
        $inc: { 
          exp: amount,
          totalMessages: 1
        },
        $setOnInsert: {
          _id: id,
          exp: 0,
          level: 0,
          totalMessages: 0,
          lastUpdated: new Date()
        },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result) throw new Error('Failed to update user experience');

    // Calculate and update level if needed
    const newLevel = this.calculateLevel(result.exp);
    if (newLevel !== result.level) {
      await this.db.updateOne(
        { _id: id },
        { $set: { level: newLevel } }
      );
      
      // Notify level up
      if (newLevel > result.level) {
        await this.notifyLevelUp(id, newLevel, result.level);
      }
    }

    // Update cooldown
    if (!bypassCooldown) {
      cooldowns.set(id, Date.now());
    }

    return result.exp;
  }

  /**
   * Get user's current experience
   */
  static async getExp(userid: string): Promise<number> {
    const id = toID(userid);
    const user = await this.db.findOne({ _id: id });
    return user?.exp || 0;
  }

  /**
   * Get user's current level
   */
  static async getLevel(userid: string): Promise<number> {
    const exp = await this.getExp(userid);
    return this.calculateLevel(exp);
  }

  /**
   * Get user's total messages
   */
  static async getTotalMessages(userid: string): Promise<number> {
    const id = toID(userid);
    const user = await this.db.findOne({ _id: id });
    return user?.totalMessages || 0;
  }

  /**
   * Calculate level from experience points
   */
  static calculateLevel(exp: number): number {
    if (exp < CONFIG.BASE_LEVEL_EXP) return 0;
    
    let level = 1;
    let requiredExp = CONFIG.BASE_LEVEL_EXP;
    let totalExp = CONFIG.BASE_LEVEL_EXP;
    
    while (exp >= totalExp && level < CONFIG.MAX_LEVEL) {
      requiredExp = Math.floor(requiredExp * CONFIG.LEVEL_MULTIPLIER);
      totalExp += requiredExp;
      level++;
    }
    
    return Math.min(level - 1, CONFIG.MAX_LEVEL);
  }

  /**
   * Calculate experience needed for next level
   */
  static getExpForNextLevel(currentLevel: number): number {
    if (currentLevel < 0) return CONFIG.BASE_LEVEL_EXP;
    
    let totalExp = CONFIG.BASE_LEVEL_EXP;
    let requiredExp = CONFIG.BASE_LEVEL_EXP;
    
    for (let i = 1; i <= currentLevel; i++) {
      totalExp += requiredExp;
      requiredExp = Math.floor(requiredExp * CONFIG.LEVEL_MULTIPLIER);
    }
    
    return totalExp;
  }

  /**
   * Check if user is on cooldown
   */
  private static isOnCooldown(userid: string): boolean {
    const lastExp = cooldowns.get(userid) || 0;
    return Date.now() - lastExp < CONFIG.COOLDOWN_MS;
  }

  /**
   * Notify user of level up
   */
  private static async notifyLevelUp(userid: string, newLevel: number, oldLevel: number): Promise<void> {
    const user = Users.get(userid);
    if (!user || !user.connected) return;

    user.popup(
      `|html|<div style="text-align: center; padding: 15px;">` +
      `<h2 style="color: #2ecc71; margin: 0 0 10px 0;">🎉 Level Up! 🎉</h2>` +
      `<div style="font-size: 1.3em; margin: 10px 0;">` +
      `<b style="color: #e74c3c;">Level ${oldLevel}</b> → <b style="color: #e74c3c;">Level ${newLevel}</b>` +
      `</div>` +
      `<div style="margin: 10px 0; font-style: italic; color: #7f8c8d;">` +
      `Keep chatting to reach even higher levels!` +
      `</div>` +
      `</div>`
    );
  }

  /**
   * Get leaderboard data
   */
  static async getLeaderboard(limit: number = 50): Promise<Array<{userid: string, exp: number, level: number}>> {
    const users = await this.db.find(
      {},
      { 
        sort: { exp: -1 }, 
        limit,
        projection: { _id: 1, exp: 1, level: 1 }
      }
    );
    
    return users.map(user => ({
      userid: user._id,
      exp: user.exp,
      level: user.level
    }));
  }

  /**
   * Get user rank
   */
  static async getUserRank(userid: string): Promise<number> {
    const id = toID(userid);
    const user = await this.db.findOne({ _id: id });
    if (!user) return 0;
    
    const higherRanked = await this.db.countDocuments({ exp: { $gt: user.exp } });
    return higherRanked + 1;
  }

  /**
   * Admin: Give experience to user
   */
  static async giveExp(userid: string, amount: number, by: string): Promise<number> {
    const id = toID(userid);
    const result = await this.db.findOneAndUpdate(
      { _id: id },
      {
        $inc: { exp: amount },
        $setOnInsert: {
          _id: id,
          exp: 0,
          level: 0,
          totalMessages: 0,
          lastUpdated: new Date()
        },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result) throw new Error('Failed to give experience');

    // Update level
    const newLevel = this.calculateLevel(result.exp);
    if (newLevel !== result.level) {
      await this.db.updateOne(
        { _id: id },
        { $set: { level: newLevel } }
      );
    }

    return result.exp;
  }

  /**
   * Admin: Take experience from user
   */
  static async takeExp(userid: string, amount: number, by: string): Promise<number> {
    const id = toID(userid);
    const result = await this.db.findOneAndUpdate(
      { _id: id, exp: { $gte: amount } },
      {
        $inc: { exp: -amount },
        $set: { lastUpdated: new Date() }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      const user = await this.db.findOne({ _id: id });
      return user?.exp || 0;
    }

    // Update level
    const newLevel = this.calculateLevel(result.exp);
    if (newLevel !== result.level) {
      await this.db.updateOne(
        { _id: id },
        { $set: { level: newLevel } }
      );
    }

    return result.exp;
  }

  /**
   * Admin: Reset user experience
   */
  static async resetExp(userid: string, by: string): Promise<void> {
    const id = toID(userid);
    await this.db.updateOne(
      { _id: id },
      {
        $set: {
          exp: 0,
          level: 0,
          lastUpdated: new Date()
        }
      },
      { upsert: true }
    );
  }

  /**
   * Get system statistics
   */
  static async getStats(): Promise<{
    totalUsers: number;
    totalExp: number;
    averageLevel: number;
    topLevel: number;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalExp: { $sum: '$exp' },
          averageLevel: { $avg: '$level' },
          topLevel: { $max: '$level' }
        }
      }
    ];

    const result = await this.db.aggregate(pipeline);
    const stats = result[0] || { totalUsers: 0, totalExp: 0, averageLevel: 0, topLevel: 0 };

    return {
      totalUsers: stats.totalUsers,
      totalExp: stats.totalExp,
      averageLevel: Math.round(stats.averageLevel * 100) / 100,
      topLevel: stats.topLevel
    };
  }
}

// Initialize the system
ExpSystem.addExp = ExpSystem.addExp.bind(ExpSystem);

// Export for global access
Impulse.ExpSystem = ExpSystem;

/**
 * Chat Commands
 */
export const commands: Chat.ChatCommands = {
  exp: {
    '': 'level',
    
    async level(target, room, user) {
      if (!this.runBroadcast()) return;
      
      const userid = target ? toID(target) : user.id;
      const targetName = target || user.name;
      
      const exp = await ExpSystem.getExp(userid);
      const level = await ExpSystem.getLevel(userid);
      const nextLevelExp = ExpSystem.getExpForNextLevel(level + 1);
      const expNeeded = nextLevelExp - exp;
      const totalMessages = await ExpSystem.getTotalMessages(userid);
      
      this.sendReplyBox(
        `<div class="ladder" style="max-width: 400px;">` +
        `<h3 style="margin: 5px 0;">${Impulse.nameColor(targetName, true, true)}'s Stats</h3>` +
        `<table style="width: 100%; border-collapse: collapse;">` +
        `<tr><td style="padding: 4px;"><b>Level:</b></td><td style="padding: 4px; text-align: right;">${level}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Experience:</b></td><td style="padding: 4px; text-align: right;">${exp.toLocaleString()}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Next Level:</b></td><td style="padding: 4px; text-align: right;">${expNeeded.toLocaleString()} EXP</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Messages:</b></td><td style="padding: 4px; text-align: right;">${totalMessages.toLocaleString()}</td></tr>` +
        `</table>` +
        `</div>`
      );
    },

    async leaderboard(target, room, user) {
      if (!this.runBroadcast()) return;
      
      const limit = parseInt(target) || 20;
      const leaderboard = await ExpSystem.getLeaderboard(Math.min(limit, 100));
      
      if (!leaderboard.length) {
        return this.sendReply('No users found on the leaderboard.');
      }

      const data = leaderboard.map((user, index) => [
        (index + 1).toString(),
        Impulse.nameColor(user.userid, true, true),
        user.level.toString(),
        user.exp.toLocaleString()
      ]);

      const output = Impulse.generateThemedTable(
        `Experience Leaderboard`,
        ['Rank', 'User', 'Level', 'EXP'],
        data
      );
      
      this.sendReply(`|raw|${output}`);
    },

    async stats(target, room, user) {
      if (!this.runBroadcast()) return;
      
      const stats = await ExpSystem.getStats();
      
      this.sendReplyBox(
        `<div class="ladder" style="max-width: 400px;">` +
        `<h3 style="margin: 5px 0;">System Statistics</h3>` +
        `<table style="width: 100%; border-collapse: collapse;">` +
        `<tr><td style="padding: 4px;"><b>Total Users:</b></td><td style="padding: 4px; text-align: right;">${stats.totalUsers.toLocaleString()}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Total EXP:</b></td><td style="padding: 4px; text-align: right;">${stats.totalExp.toLocaleString()}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Average Level:</b></td><td style="padding: 4px; text-align: right;">${stats.averageLevel}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Highest Level:</b></td><td style="padding: 4px; text-align: right;">${stats.topLevel}</td></tr>` +
        `</table>` +
        `</div>`
      );
    },

    async give(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply('Usage: /exp give [user], [amount]');
      
      const parts = target.split(',').map(p => p.trim());
      if (parts.length < 2) return this.sendReply('Usage: /exp give [user], [amount]');
      
      const targetUser = Users.get(parts[0]);
      const amount = parseInt(parts[1], 10);
      
      if (!targetUser) return this.errorReply(`User "${parts[0]}" not found.`);
      if (isNaN(amount) || amount <= 0) return this.errorReply('Please specify a valid positive amount.');
      
      const newExp = await ExpSystem.giveExp(targetUser.id, amount, user.id);
      const newLevel = ExpSystem.calculateLevel(newExp);
      
      this.sendReplyBox(
        `Gave ${amount} EXP to ${Impulse.nameColor(targetUser.name, true, true)}. ` +
        `New Level: ${newLevel} (${newExp.toLocaleString()} EXP)`
      );
      
      this.modlog('GIVEEXP', targetUser, `${amount} EXP`, { by: user.id });
    },

    async take(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply('Usage: /exp take [user], [amount]');
      
      const parts = target.split(',').map(p => p.trim());
      if (parts.length < 2) return this.sendReply('Usage: /exp take [user], [amount]');
      
      const targetUser = Users.get(parts[0]);
      const amount = parseInt(parts[1], 10);
      
      if (!targetUser) return this.errorReply(`User "${parts[0]}" not found.`);
      if (isNaN(amount) || amount <= 0) return this.errorReply('Please specify a valid positive amount.');
      
      const newExp = await ExpSystem.takeExp(targetUser.id, amount, user.id);
      const newLevel = ExpSystem.calculateLevel(newExp);
      
      this.sendReplyBox(
        `Took ${amount} EXP from ${Impulse.nameColor(targetUser.name, true, true)}. ` +
        `New Level: ${newLevel} (${newExp.toLocaleString()} EXP)`
      );
      
      this.modlog('TAKEEXP', targetUser, `${amount} EXP`, { by: user.id });
    },

    async reset(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply('Usage: /exp reset [user]');
      
      const targetUser = Users.get(target);
      if (!targetUser) return this.errorReply(`User "${target}" not found.`);
      
      await ExpSystem.resetExp(targetUser.id, user.id);
      
      this.sendReplyBox(
        `Reset ${Impulse.nameColor(targetUser.name, true, true)}'s experience to 0.`
      );
      
      this.modlog('RESETEXP', targetUser, '0 EXP', { by: user.id });
    },

    async help(target, room, user) {
      if (!this.runBroadcast()) return;
      
      this.sendReplyBox(
        `<div><b><center>Experience System Commands</center></b><br>` +
        `<h4 style="margin: 8px 0;">User Commands:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>/exp</code> or <code>/exp level [user]</code> - Check your or another user's level and experience</li>` +
        `<li><code>/exp leaderboard [limit]</code> - View the experience leaderboard (default: 20, max: 100)</li>` +
        `<li><code>/exp stats</code> - View system statistics</li>` +
        `</ul>` +
        `<h4 style="margin: 8px 0;">Staff Commands:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>/exp give [user], [amount]</code> - Give experience to a user (requires @)</li>` +
        `<li><code>/exp take [user], [amount]</code> - Take experience from a user (requires @)</li>` +
        `<li><code>/exp reset [user]</code> - Reset a user's experience to 0 (requires @)</li>` +
        `</ul>` +
        `<small style="opacity: 0.8;">Earn experience by chatting! 1 EXP per message with a 30-second cooldown.</small>` +
        `</div>`
      );
    },
  },
};

/**
 * Pages
 */
export const pages: Chat.PageTable = {
  async expladder(args, user) {
    const leaderboard = await ExpSystem.getLeaderboard(100);
    
    if (!leaderboard.length) {
      return `<div class="pad"><h2>No users have any experience yet.</h2></div>`;
    }

    const data = leaderboard.map((user, index) => [
      (index + 1).toString(),
      Impulse.nameColor(user.userid, true, true),
      user.level.toString(),
      user.exp.toLocaleString()
    ]);

    const output = Impulse.generateThemedTable(
      `Experience Leaderboard`,
      ['Rank', 'User', 'Level', 'EXP'],
      data
    );
    
    return output;
  },
};