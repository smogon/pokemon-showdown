/*
* Pokemon Showdown
* Enhanced Experience System with Rewards & Perks
* Features:
* - Level-based rewards (currency, items, perks)
* - Unlockable features at milestone levels
* - Daily login bonuses
* - Achievement system
* - Prestige system for max level players
* - Level-based permissions/badges
*/

import { ImpulseDB } from '../../impulse/impulse-db';
import '../utils';

const DEFAULT_EXP = 0;
const EXP_UNIT = `EXP`;
Impulse.expUnit = EXP_UNIT;

const MIN_LEVEL_EXP = 10;
const MULTIPLIER = 1.5;
const MAX_LEVEL = 100; // Add a max level for prestige system
let DOUBLE_EXP = false;
let DOUBLE_EXP_END_TIME: number | null = null;
const EXP_COOLDOWN = 30000;

// Reward Configuration
const LEVEL_REWARDS = {
  5: { currency: 100, message: "Welcome bonus!" },
  10: { currency: 250, badge: "novice", message: "Novice badge unlocked!" },
  15: { currency: 500, perk: "customcolor", message: "Custom color unlocked! Use /customcolor" },
  20: { currency: 750, badge: "intermediate", message: "Intermediate badge unlocked!" },
  25: { currency: 1000, perk: "customavatar", message: "Custom avatar unlocked! Use /customavatar" },
  30: { currency: 1500, badge: "advanced", message: "Advanced badge unlocked!" },
  40: { currency: 2500, perk: "symbolcolor", message: "Symbol color unlocked!" },
  50: { currency: 5000, badge: "expert", perk: "icon", message: "Expert badge + Icon unlocked!" },
  75: { currency: 10000, badge: "master", message: "Master badge unlocked!" },
  100: { currency: 25000, badge: "legend", perk: "prestige", message: "Legend status! Prestige available!" },
};

const DAILY_LOGIN_REWARDS = {
  1: { exp: 50, currency: 25 },
  3: { exp: 100, currency: 50 },
  7: { exp: 250, currency: 150 },
  14: { exp: 500, currency: 300 },
  30: { exp: 1000, currency: 750 },
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: (stats: UserStats) => boolean;
  reward: { exp?: number; currency?: number; badge?: string };
  icon: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_message",
    name: "First Steps",
    description: "Send your first message",
    requirement: (stats) => stats.messagesSent >= 1,
    reward: { exp: 10, currency: 10 },
    icon: "💬"
  },
  {
    id: "chatterbox",
    name: "Chatterbox",
    description: "Send 1,000 messages",
    requirement: (stats) => stats.messagesSent >= 1000,
    reward: { exp: 500, currency: 250, badge: "chatterbox" },
    icon: "🗣️"
  },
  {
    id: "level_speedrun",
    name: "Speed Leveler",
    description: "Reach level 10 within 7 days of registration",
    requirement: (stats) => stats.level >= 10 && stats.daysSinceRegistration <= 7,
    reward: { exp: 300, currency: 200 },
    icon: "⚡"
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Log in for 7 consecutive days",
    requirement: (stats) => stats.consecutiveDays >= 7,
    reward: { exp: 200, currency: 150 },
    icon: "📅"
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Chat in 10 different rooms",
    requirement: (stats) => stats.roomsVisited >= 10,
    reward: { exp: 150, currency: 100 },
    icon: "🦋"
  }
];

interface UserStats {
  messagesSent: number;
  level: number;
  daysSinceRegistration: number;
  consecutiveDays: number;
  roomsVisited: number;
  lastSeen: Date;
}

interface ExpDocument {
  _id: string;
  exp: number;
  level: number;
  prestige: number;
  currency: number;
  unlockedPerks: string[];
  badges: string[];
  achievements: string[];
  lastDailyLogin: Date | null;
  consecutiveLoginDays: number;
  stats: UserStats;
  lastUpdated: Date;
}

interface ExpConfigDocument {
  _id: string;
  doubleExp: boolean;
  doubleExpEndTime: number | null;
  lastUpdated: Date;
}

const ExpDB = ImpulseDB<ExpDocument>('expdata');
const ExpConfigDB = ImpulseDB<ExpConfigDocument>('expconfig');

interface CooldownData {
  [userid: string]: number;
}

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

  // Initialize user with default values
  static async initializeUser(userid: string): Promise<void> {
    const id = toID(userid);
    const exists = await ExpDB.exists({ _id: id });
    if (!exists) {
      await ExpDB.insertOne({
        _id: id,
        exp: DEFAULT_EXP,
        level: 0,
        prestige: 0,
        currency: 0,
        unlockedPerks: [],
        badges: [],
        achievements: [],
        lastDailyLogin: null,
        consecutiveLoginDays: 0,
        stats: {
          messagesSent: 0,
          level: 0,
          daysSinceRegistration: 0,
          consecutiveDays: 0,
          roomsVisited: 0,
          lastSeen: new Date()
        },
        lastUpdated: new Date()
      });
    }
  }

  static async writeExp(userid: string, amount: number): Promise<void> {
    const id = toID(userid);
    const level = this.getLevel(amount);
    
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

  static async getUserProfile(userid: string): Promise<ExpDocument | null> {
    const id = toID(userid);
    await this.initializeUser(id);
    return await ExpDB.findOne({ _id: id });
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

  static async hasPerk(userid: string, perk: string): Promise<boolean> {
    const id = toID(userid);
    const doc = await ExpDB.findOne({ _id: id, unlockedPerks: perk });
    return doc !== null;
  }

  static async addCurrency(userid: string, amount: number): Promise<void> {
    const id = toID(userid);
    await this.initializeUser(id);
    await ExpDB.updateOne(
      { _id: id },
      { $inc: { currency: amount } }
    );
  }

  static async getCurrency(userid: string): Promise<number> {
    const id = toID(userid);
    const doc = await ExpDB.findOne({ _id: id });
    return doc?.currency || 0;
  }

  static async addExp(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
    const id = toID(userid);
    await this.initializeUser(id);
    
    if (!by && this.isOnCooldown(id)) {
      return await this.readExp(id);
    }

    const currentDoc = await ExpDB.findOne({ _id: id });
    const currentExp = currentDoc?.exp || DEFAULT_EXP;
    const currentLevel = this.getLevel(currentExp);
    
    const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
    const newExp = currentExp + gainedAmount;
    const newLevel = this.getLevel(newExp);
    
    // Update message count stats
    await ExpDB.updateOne(
      { _id: id },
      { $inc: { 'stats.messagesSent': 1 } }
    );
    
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
    
    if (newLevel > currentLevel) {
      await this.handleLevelUp(id, newLevel, currentLevel);
    }

    // Check achievements
    await this.checkAchievements(id);
    
    return newExp;
  }

  // Handle level up rewards and notifications
  private static async handleLevelUp(userid: string, newLevel: number, oldLevel: number): Promise<void> {
    const user = Users.get(userid);
    
    // Process rewards for all levels between oldLevel and newLevel
    let rewardMessages: string[] = [];
    let totalCurrency = 0;
    const newPerks: string[] = [];
    const newBadges: string[] = [];
    
    for (let level = oldLevel + 1; level <= newLevel; level++) {
      const reward = LEVEL_REWARDS[level as keyof typeof LEVEL_REWARDS];
      if (reward) {
        if (reward.currency) {
          totalCurrency += reward.currency;
        }
        if (reward.perk) {
          newPerks.push(reward.perk);
          await ExpDB.updateOne(
            { _id: userid },
            { $addToSet: { unlockedPerks: reward.perk } }
          );
        }
        if (reward.badge) {
          newBadges.push(reward.badge);
          await ExpDB.updateOne(
            { _id: userid },
            { $addToSet: { badges: reward.badge } }
          );
        }
        rewardMessages.push(`Level ${level}: ${reward.message}`);
      }
    }
    
    // Add currency rewards
    if (totalCurrency > 0) {
      await this.addCurrency(userid, totalCurrency);
    }
    
    // Build notification message
    let rewardsHtml = '';
    if (totalCurrency > 0) {
      rewardsHtml += `<div style="color: #f39c12;">💰 +${totalCurrency} Currency</div>`;
    }
    if (newPerks.length > 0) {
      rewardsHtml += `<div style="color: #9b59b6;">🎁 Unlocked: ${newPerks.join(', ')}</div>`;
    }
    if (newBadges.length > 0) {
      rewardsHtml += `<div style="color: #3498db;">🏅 New Badges: ${newBadges.join(', ')}</div>`;
    }
    if (rewardMessages.length > 0) {
      rewardsHtml += `<div style="margin-top: 10px; font-size: 0.9em;">${rewardMessages.join('<br>')}</div>`;
    }
    
    if (user?.connected) {
      user.popup(
        `|html|<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">` +
        `<h2 style="color: #fff; margin: 0;">🎉 LEVEL UP! 🎉</h2>` +
        `<div style="font-size: 2em; color: #ffd700; margin: 15px 0;">` +
        `Level ${oldLevel} ➜ Level ${newLevel}` +
        `</div>` +
        rewardsHtml +
        `<div style="margin-top: 15px; color: #ecf0f1; font-size: 0.9em;">` +
        `Keep chatting to earn more rewards!` +
        `</div>` +
        `</div>`
      );
    }
    
    // Announce milestone levels
    if (newLevel % 25 === 0 || newLevel === 100) {
      const mainRoom = Rooms.get('lobby');
      if (mainRoom) {
        mainRoom.add(
          `|html|<div class="broadcast-blue" style="text-align: center;">` +
          `<strong>🌟 ${Impulse.nameColor(userid, true, true)}</strong> has reached ` +
          `<strong style="color: #f39c12;">Level ${newLevel}</strong>! 🌟` +
          `</div>`
        ).update();
      }
    }
  }

  // Daily login system
  static async claimDailyLogin(userid: string): Promise<{ success: boolean; message: string; rewards?: any }> {
    const id = toID(userid);
    await this.initializeUser(id);
    
    const user = await ExpDB.findOne({ _id: id });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    
    const now = new Date();
    const lastLogin = user.lastDailyLogin;
    
    // Check if already claimed today
    if (lastLogin) {
      const hoursSinceLastLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastLogin < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastLogin);
        return { 
          success: false, 
          message: `You've already claimed your daily login! Come back in ${hoursRemaining} hour(s).` 
        };
      }
    }
    
    // Calculate consecutive days
    let consecutiveDays = user.consecutiveLoginDays || 0;
    if (lastLogin) {
      const daysSinceLastLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastLogin <= 1.5) { // Grace period
        consecutiveDays++;
      } else {
        consecutiveDays = 1; // Reset streak
      }
    } else {
      consecutiveDays = 1;
    }
    
    // Find applicable reward
    let reward = { exp: 50, currency: 25 }; // Default
    for (const [days, rewardData] of Object.entries(DAILY_LOGIN_REWARDS).reverse()) {
      if (consecutiveDays >= parseInt(days)) {
        reward = rewardData;
        break;
      }
    }
    
    // Apply rewards
    await this.addExpRewards(id, reward.exp, "Daily Login");
    await this.addCurrency(id, reward.currency);
    
    // Update login data
    await ExpDB.updateOne(
      { _id: id },
      { 
        $set: { 
          lastDailyLogin: now,
          consecutiveLoginDays: consecutiveDays,
          'stats.consecutiveDays': consecutiveDays
        }
      }
    );
    
    return {
      success: true,
      message: `Daily login claimed! Day ${consecutiveDays} streak!`,
      rewards: { ...reward, consecutiveDays }
    };
  }

  // Achievement system
  static async checkAchievements(userid: string): Promise<void> {
    const id = toID(userid);
    const profile = await this.getUserProfile(id);
    if (!profile) return;
    
    const user = Users.get(id);
    
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already earned
      if (profile.achievements.includes(achievement.id)) continue;
      
      // Check if requirement is met
      if (achievement.requirement(profile.stats)) {
        // Grant achievement
        await ExpDB.updateOne(
          { _id: id },
          { $addToSet: { achievements: achievement.id } }
        );
        
        // Grant rewards
        if (achievement.reward.exp) {
          await this.addExpRewards(id, achievement.reward.exp, `Achievement: ${achievement.name}`);
        }
        if (achievement.reward.currency) {
          await this.addCurrency(id, achievement.reward.currency);
        }
        if (achievement.reward.badge) {
          await ExpDB.updateOne(
            { _id: id },
            { $addToSet: { badges: achievement.reward.badge } }
          );
        }
        
        // Notify user
        if (user?.connected) {
          user.popup(
            `|html|<div style="text-align: center; padding: 15px; background: #2ecc71; border-radius: 10px;">` +
            `<h3 style="color: #fff; margin: 0;">🏆 Achievement Unlocked! 🏆</h3>` +
            `<div style="font-size: 1.5em; margin: 10px 0;">${achievement.icon}</div>` +
            `<div style="color: #fff; font-size: 1.2em; font-weight: bold;">${achievement.name}</div>` +
            `<div style="color: #ecf0f1; font-style: italic; margin: 5px 0;">${achievement.description}</div>` +
            `<div style="margin-top: 10px; color: #fff;">` +
            `Rewards: ${achievement.reward.exp ? `${achievement.reward.exp} EXP` : ''} ` +
            `${achievement.reward.currency ? `${achievement.reward.currency} Currency` : ''}` +
            `</div>` +
            `</div>`
          );
        }
      }
    }
  }

  // Prestige system
  static async prestige(userid: string): Promise<{ success: boolean; message: string }> {
    const id = toID(userid);
    const profile = await this.getUserProfile(id);
    
    if (!profile) {
      return { success: false, message: "Profile not found" };
    }
    
    if (profile.level < MAX_LEVEL) {
      return { 
        success: false, 
        message: `You must reach level ${MAX_LEVEL} before you can prestige!` 
      };
    }
    
    const newPrestige = (profile.prestige || 0) + 1;
    const prestigeBonus = newPrestige * 1000; // Currency bonus per prestige
    
    // Reset level and exp, but keep perks and badges
    await ExpDB.updateOne(
      { _id: id },
      { 
        $set: {
          exp: DEFAULT_EXP,
          level: 0,
          prestige: newPrestige
        },
        $inc: {
          currency: prestigeBonus
        }
      }
    );
    
    const user = Users.get(id);
    if (user?.connected) {
      user.popup(
        `|html|<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px;">` +
        `<h2 style="color: #fff; margin: 0;">⭐ PRESTIGE ${newPrestige}! ⭐</h2>` +
        `<div style="font-size: 1.2em; color: #fff; margin: 15px 0;">` +
        `You've reset to level 0 but gained:<br>` +
        `💰 ${prestigeBonus} Currency<br>` +
        `🌟 Prestige ${newPrestige} Badge<br>` +
        `✨ All perks and badges kept!` +
        `</div>` +
        `</div>`
      );
    }
    
    return { 
      success: true, 
      message: `Prestiged to level ${newPrestige}! Gained ${prestigeBonus} currency.` 
    };
  }

  static async addExpRewards(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
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
        $setOnInsert: { _id: id }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    if (newLevel > currentLevel) {
      await this.handleLevelUp(id, newLevel, currentLevel);
    }
    
    return newExp;
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
    
    const result = await ExpDB.findOneAndUpdate(
      { _id: id, exp: { $gte: amount } },
      { 
        $inc: { exp: -amount },
        $set: { lastUpdated: new Date() }
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

  static async getRichestUsers(limit: number = 100): Promise<[string, number, number, number][]> {
    const docs = await ExpDB.find({}, { sort: { prestige: -1, exp: -1 }, limit });
    return docs.map(doc => [doc._id, doc.exp, doc.level, doc.prestige || 0]);
  }

  static getLevel(exp: number): number {
    if (exp < MIN_LEVEL_EXP) return 0;
    let level = 1;
    let totalExp = MIN_LEVEL_EXP;
    
    while (exp >= totalExp && level < MAX_LEVEL) {
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
  }

  static async init(): Promise<void> {
    await this.loadExpConfig();
  }
}

ExpSystem.init();
Impulse.ExpSystem = ExpSystem;

export const pages: Chat.PageTable = {
  async expladder(args, user) {
    const richest = await ExpSystem.getRichestUsers(100);
    if (!richest.length) {
      return `<div class="pad"><h2>No users have any ${EXP_UNIT} yet.</h2></div>`;
    }

    const data = richest.map(([userid, exp, level, prestige], index) => {
      const expForNext = ExpSystem.getExpForNextLevel(level + 1);
      const prestigeDisplay = prestige > 0 ? `⭐${prestige}` : '';
      return [
        (index + 1).toString(),
        Impulse.nameColor(userid, true, true) + ` ${prestigeDisplay}`,
        `Level ${level}`,
        `${exp} ${EXP_UNIT}`,
        `${expForNext} ${EXP_UNIT}`,
      ];
    });

    const output = Impulse.generateThemedTable(
      `Exp Ladder`,
      ['Rank', 'User', 'Level', 'EXP', 'Next Level'],
      data
    );
    return `${output}`;
  },
  
  async profile(args, user) {
    const targetId = args[0] ? toID(args[0]) : user.id;
    const profile = await ExpSystem.getUserProfile(targetId);
    
    if (!profile) {
      return `<div class="pad"><h2>Profile not found</h2></div>`;
    }
    
    const expForNext = ExpSystem.getExpForNextLevel(profile.level + 1);
    const expProgress = ((profile.exp / expForNext) * 100).toFixed(1);
    
    let output = `<div class="ladder pad" style="max-width: 800px; margin: 0 auto;">`;
    output += `<h2 style="text-align: center;">${Impulse.nameColor(targetId, true, true)}'s Profile</h2>`;
    
    // Main Stats
    output += `<div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 15px 0;">`;
    output += `<h3>📊 Statistics</h3>`;
    output += `<p><strong>Level:</strong> ${profile.level} ${profile.prestige > 0 ? `(Prestige ⭐${profile.prestige})` : ''}</p>`;
    output += `<p><strong>EXP:</strong> ${profile.exp} / ${expForNext} (${expProgress}%)</p>`;
    output += `<div style="background: #e9ecef; border-radius: 5px; height: 20px; overflow: hidden;">`;
    output += `<div style="background: linear-gradient(90deg, #667eea, #764ba2); width: ${expProgress}%; height: 100%;"></div>`;
    output += `</div></div>`;
    output += `<p><strong>Currency:</strong> 💰 ${profile.currency}</p>`;
    output += `<p><strong>Messages Sent:</strong> ${profile.stats.messagesSent}</p>`;
    output += `<p><strong>Login Streak:</strong> ${profile.consecutiveLoginDays} days 🔥</p>`;
    output += `</div>`;
    
    // Badges
    if (profile.badges.length > 0) {
      output += `<div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 15px 0;">`;
      output += `<h3>🏅 Badges</h3>`;
      output += `<p>${profile.badges.map(b => `<span style="background: #ffc107; padding: 5px 10px; border-radius: 5px; margin: 5px; display: inline-block;">${b}</span>`).join('')}</p>`;
      output += `</div>`;
    }
    
    // Achievements
    if (profile.achievements.length > 0) {
      output += `<div style="background: #d1ecf1; padding: 15px; border-radius: 10px; margin: 15px 0;">`;
      output += `<h3>🏆 Achievements (${profile.achievements.length}/${ACHIEVEMENTS.length})</h3>`;
      const achievementsList = ACHIEVEMENTS.filter(a => profile.achievements.includes(a.id))
        .map(a => `<div style="margin: 10px 0;"><strong>${a.icon} ${a.name}</strong><br><em>${a.description}</em></div>`).join('');
      output += achievementsList || '<p>No achievements yet!</p>';
      output += `</div>`;
    }
    
    // Unlocked Perks
    if (profile.unlockedPerks.length > 0) {
      output += `<div style="background: #d4edda; padding: 15px; border-radius: 10px; margin: 15px 0;">`;
      output += `<h3>🎁 Unlocked Perks</h3>`;
      output += `<p>${profile.unlockedPerks.map(p => `<span style="background: #28a745; color: white; padding: 5px 10px; border-radius: 5px; margin: 5px; display: inline-block;">${p}</span>`).join('')}</p>`;
      output += `</div>`;
    }
    
    output += `</div>`;
    return output;
  }
};

export const commands: Chat.ChatCommands = {
  exp: {
    '': 'level',
    async level(target, room, user) {
      if (!target) target = user.name;
      if (!this.runBroadcast()) return;    
      const userid = toID(target);
      const profile = await ExpSystem.getUserProfile(userid);
      
      if (!profile) {
        return this.errorReply("Profile not found");
      }
      
      const expForNext = ExpSystem.getExpForNextLevel(profile.level + 1);
      const expNeeded = expForNext - profile.exp;
      const prestigeDisplay = profile.prestige > 0 ? ` ⭐${profile.prestige}` : '';
      
      this.sendReplyBox(
        `<b>${Impulse.nameColor(userid, true, true)}${prestigeDisplay}</b> - Level ${profile.level}<br>` +
        `Current EXP: ${profile.exp} ${EXP_UNIT}<br>` +
        `EXP needed for Level ${profile.level + 1}: ${expNeeded} ${EXP_UNIT}<br>` +
        `💰 Currency: ${profile.currency}<br>` +
        `<a href="/view-profile-${userid}">View Full Profile</a>`
      );
    },
    
    async profile(target, room, user) {
      const targetId = target ? toID(target) : user.id;
      return this.parse(`/join view-profile-${targetId}`);
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
    
    async givecurrency(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply(`Usage: /exp givecurrency [user], [amount], [reason]`);
      const parts = target.split(',').map(p => p.trim());
      if (parts.length < 2) return this.sendReply(`Usage: /exp givecurrency [user], [amount], [reason]`);

      const targetUser = Users.get(parts[0]);
      const amount = parseInt(parts[1], 10);
      const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

      if (!targetUser) {
        return this.errorReply(`User "${parts[0]}" not found.`);
      }
      if (isNaN(amount) || amount <= 0) {
        return this.errorReply(`Please specify a valid positive amount.`);
      }

      await ExpSystem.addCurrency(targetUser.id, amount);
      const newCurrency = await ExpSystem.getCurrency(targetUser.id);
      
      this.sendReplyBox(
        `${Impulse.nameColor(user.name, true, true)} gave ${amount} currency to ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
        `New balance: ${newCurrency}`
      );
      
      this.modlog('GIVECURRENCY', targetUser, `${amount}`, { by: user.id, reason });
      if (targetUser.connected) {
        targetUser.popup(
          `|html|You received <b>💰 ${amount} currency</b> from <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
          `Reason: ${reason}<br>` +
          `New balance: ${newCurrency}`
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
    
    async daily(target, room, user) {
      const result = await ExpSystem.claimDailyLogin(user.id);
      
      if (!result.success) {
        return this.errorReply(result.message);
      }
      
      const rewards = result.rewards;
      this.sendReplyBox(
        `<div style="text-align: center;">` +
        `<h3 style="color: #3498db;">🎁 Daily Login Claimed! 🎁</h3>` +
        `<p><strong>Streak:</strong> ${rewards.consecutiveDays} day(s) 🔥</p>` +
        `<p><strong>Rewards:</strong></p>` +
        `<p>+${rewards.exp} ${EXP_UNIT}<br>+${rewards.currency} Currency 💰</p>` +
        `<p style="font-size: 0.9em; color: #7f8c8d;">Come back tomorrow to keep your streak!</p>` +
        `</div>`
      );
    },
    
    async prestige(target, room, user) {
      const result = await ExpSystem.prestige(user.id);
      
      if (!result.success) {
        return this.errorReply(result.message);
      }
      
      this.sendReply(result.message);
      this.modlog('PRESTIGE', user, 'prestiged');
      
      if (room) {
        room.add(
          `|html|<div class="broadcast-blue" style="text-align: center;">` +
          `<strong>🌟 ${Impulse.nameColor(user.name, true, true)}</strong> has prestiged! 🌟` +
          `</div>`
        ).update();
      }
    },
    
    async achievements(target, room, user) {
      const targetId = target ? toID(target) : user.id;
      const profile = await ExpSystem.getUserProfile(targetId);
      
      if (!profile) {
        return this.errorReply("Profile not found");
      }
      
      const earned = profile.achievements.length;
      const total = ACHIEVEMENTS.length;
      
      let output = `<div class="ladder pad"><h2>🏆 Achievements for ${Impulse.nameColor(targetId, true, true)} (${earned}/${total})</h2>`;
      
      for (const achievement of ACHIEVEMENTS) {
        const isEarned = profile.achievements.includes(achievement.id);
        const style = isEarned ? 'background: #d4edda; border-left: 4px solid #28a745;' : 'background: #f8f9fa; opacity: 0.6;';
        
        output += `<div style="padding: 10px; margin: 10px 0; border-radius: 5px; ${style}">`;
        output += `<div style="font-size: 1.5em;">${achievement.icon} <strong>${achievement.name}</strong> ${isEarned ? '✅' : ''}</div>`;
        output += `<div style="font-style: italic; margin: 5px 0;">${achievement.description}</div>`;
        output += `<div style="font-size: 0.9em; color: #7f8c8d;">`;
        output += `Rewards: `;
        if (achievement.reward.exp) output += `${achievement.reward.exp} EXP `;
        if (achievement.reward.currency) output += `${achievement.reward.currency} Currency `;
        if (achievement.reward.badge) output += `Badge: ${achievement.reward.badge}`;
        output += `</div></div>`;
      }
      
      output += `</div>`;
      this.sendReply(`|raw|${output}`);
    },
    
    async rewards(target, room, user) {
      if (!this.runBroadcast()) return;
      
      let output = `<div class="ladder pad"><h2>🎁 Level Rewards</h2>`;
      output += `<table style="width: 100%; border-collapse: collapse;"><tr><th>Level</th><th>Rewards</th></tr>`;
      
      for (const [level, reward] of Object.entries(LEVEL_REWARDS)) {
        output += `<tr style="border-bottom: 1px solid #ddd;"><td style="padding: 10px; text-align: center;"><strong>Level ${level}</strong></td><td style="padding: 10px;">`;
        const rewards = [];
        if (reward.currency) rewards.push(`💰 ${reward.currency} Currency`);
        if (reward.badge) rewards.push(`🏅 ${reward.badge} Badge`);
        if (reward.perk) rewards.push(`🎁 ${reward.perk} Perk`);
        output += rewards.join(', ');
        output += `<br><em style="color: #7f8c8d;">${reward.message}</em>`;
        output += `</td></tr>`;
      }
      
      output += `</table></div>`;
      this.sendReplyBox(output);
    },

    async ladder(target, room, user) {
      if (!this.runBroadcast()) return;
      return this.parse(`/join view-expladder`);
    },

    async help(target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReplyBox(
        `<div><b><center>Enhanced EXP System Commands</center></b><br>` +
        `<ul>` +
        `<li><code>/exp level [user]</code> - Check EXP, level, and currency</li>` +
        `<li><code>/exp profile [user]</code> - View detailed profile with badges, achievements, and perks</li>` +
        `<li><code>/exp daily</code> - Claim daily login rewards (24h cooldown)</li>` +
        `<li><code>/exp prestige</code> - Reset to level 0 at max level for currency and prestige badge</li>` +
        `<li><code>/exp achievements [user]</code> - View all achievements and progress</li>` +
        `<li><code>/exp rewards</code> - View all level rewards</li>` +
        `<li><code>/exp ladder</code> - View top 100 users by EXP</li>` +
        `<li><code>/exp give [user], [amount], [reason]</code> - Give EXP to a user</li>` +
        `<li><code>/exp givecurrency [user], [amount], [reason]</code> - Give currency to a user</li>` +
        `<li><code>/exp take [user], [amount], [reason]</code> - Take EXP from a user</li>` +
        `<li><code>/exp reset [user], [reason]</code> - Reset a user's EXP</li>` +
        `<li><code>/exp resetall [reason]</code> - Reset all users' EXP</li>` +
        `<li><code>/exp toggledouble [duration]</code> - Toggle double EXP</li>` +
        `</ul>` +
        `<small>Commands give, givecurrency, take, reset, and toggledouble require @ or higher. Command resetall requires ~.</small>` +
        `</div>`
      );
    },
  },
};