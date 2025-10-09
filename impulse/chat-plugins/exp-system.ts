/**
 * Pokemon Showdown - Experience System
 * 
 * A comprehensive leveling and progression system for Pokemon Showdown servers.
 * Users earn experience points (EXP) through chat activity and progress through levels.
 * 
 * Features:
 * - Automatic EXP earning through chat messages (with cooldown)
 * - Progressive leveling system with exponential scaling
 * - Leaderboard system showing top users
 * - Double EXP events with configurable duration
 * - Admin moderation tools (give/take/reset EXP)
 * - Level-up notifications with popup alerts
 * - MongoDB-based persistent storage
 * 
 * Integration:
 * This system is automatically integrated with the chat system.
 * See server/chat.ts line 693 for the integration point:
 *   if (this.user.registered) Impulse.ExpSystem.addExp(this.user.id, 1);
 * 
 * Database Collections:
 * - expdata: Stores user EXP and level data
 * - expconfig: Stores system configuration (double EXP settings)
 * 
 * Configuration:
 * - DEFAULT_EXP: Starting experience (0)
 * - MIN_LEVEL_EXP: Experience required for level 1 (10)
 * - MULTIPLIER: Level difficulty scaling factor (1.5)
 * - EXP_COOLDOWN: Cooldown between EXP gains in ms (30000 = 30 seconds)
 * 
 * @author Prince Sky
 * @license MIT
 */

import { ImpulseDB } from '../../impulse/impulse-db';
import '../utils';

// EXP System Configuration
const DEFAULT_EXP = 0;
const EXP_UNIT = `EXP`;
Impulse.expUnit = EXP_UNIT;

const MIN_LEVEL_EXP = 10;
const MULTIPLIER = 1.5;
let DOUBLE_EXP = false;
let DOUBLE_EXP_END_TIME: number | null = null;
const EXP_COOLDOWN = 30000;

// Currency System Configuration
const DEFAULT_CURRENCY = 0;
let CURRENCY_UNIT = `Coins`; // Easily changeable currency name
Impulse.currencyUnit = CURRENCY_UNIT;

const CURRENCY_EARN_RATE = 5; // How much currency earned per chat message (with cooldown)
const CURRENCY_COOLDOWN = 60000; // 1 minute cooldown for earning currency

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

/**
 * MongoDB Document Interfaces
 */

/** User experience data document */
interface ExpDocument {
  _id: string; // userid
  exp: number; // Total experience points
  level: number; // Current level (derived from exp)
  lastUpdated: Date; // Last time exp was modified
}

/** System configuration document */
interface ExpConfigDocument {
  _id: string; // Always 'config'
  doubleExp: boolean; // Whether double EXP is currently active
  doubleExpEndTime: number | null; // Timestamp when double EXP ends (null if indefinite)
  lastUpdated: Date; // Last time config was modified
}

/** EXP history tracking document */
interface ExpHistoryDocument {
  _id?: string;
  userid: string;
  amount: number; // Amount of EXP added/removed (negative for removal)
  reason: string;
  by: string; // Staff member who performed the action
  timestamp: Date;
}

/** User currency data document */
interface CurrencyDocument {
  _id: string; // userid
  currency: number; // Total currency amount
  lastUpdated: Date; // Last time currency was modified
}

/** Currency history tracking document */
interface CurrencyHistoryDocument {
  _id?: string;
  userid: string;
  amount: number; // Amount of currency added/removed (negative for removal)
  reason: string;
  by: string; // Staff member who performed the action or 'system' for auto-earn
  timestamp: Date;
}

/** Currency configuration document */
interface CurrencyConfigDocument {
  _id: string; // Always 'config'
  currencyName: string; // The display name for the currency
  lastUpdated: Date;
}

// Get typed MongoDB collections
const ExpDB = ImpulseDB<ExpDocument>('expdata');
const ExpConfigDB = ImpulseDB<ExpConfigDocument>('expconfig');
const ExpHistoryDB = ImpulseDB<ExpHistoryDocument>('exphistory');
const CurrencyDB = ImpulseDB<CurrencyDocument>('currencydata');
const CurrencyHistoryDB = ImpulseDB<CurrencyHistoryDocument>('currencyhistory');
const CurrencyConfigDB = ImpulseDB<CurrencyConfigDocument>('currencyconfig');

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

  /**
   * Write (set) a user's EXP to a specific amount
   * @param userid - User ID
   * @param amount - Amount of EXP to set
   */
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

  /**
   * Read a user's current EXP
   * @param userid - User ID
   * @returns Current EXP amount (defaults to 0 if user not found)
   */
  static async readExp(userid: string): Promise<number> {
    const id = toID(userid);
    const doc = await ExpDB.findOne({ _id: id });
    return doc ? doc.exp : DEFAULT_EXP;
  }

  /**
   * Check if a user has at least a certain amount of EXP
   * @param userid - User ID
   * @param amount - Minimum EXP amount to check for
   * @returns True if user has at least the specified amount
   */
  static async hasExp(userid: string, amount: number): Promise<boolean> {
    const id = toID(userid);
    // More efficient: query directly instead of fetching full document
    const doc = await ExpDB.findOne({ _id: id, exp: { $gte: amount } });
    return doc !== null;
  }

  /**
   * Check if a user has at least a certain level
   * @param userid - User ID
   * @param level - Minimum level to check for
   * @returns True if user has at least the specified level
   */
  static async hasLevel(userid: string, level: number): Promise<boolean> {
    const id = toID(userid);
    // More efficient: query directly instead of fetching and calculating
    const doc = await ExpDB.findOne({ _id: id, level: { $gte: level } });
    return doc !== null;
  }
  
  /**
   * Add EXP to a user (with cooldown protection)
   * Uses atomic MongoDB operations to handle concurrent requests safely.
   * @param userid - User ID
   * @param amount - Amount of EXP to add (will be doubled if DOUBLE_EXP is active)
   * @param reason - Optional reason for the EXP gain
   * @param by - Optional staff member ID (bypasses cooldown if provided)
   * @returns Final EXP amount after addition
   */
  static async addExp(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
    const id = toID(userid);
    
    if (!by && this.isOnCooldown(id)) {
      return await this.readExp(id);
    }

    // Get old level for notification comparison
    const oldDoc = await ExpDB.findOne({ _id: id });
    const oldLevel = oldDoc ? oldDoc.level : 0;
    
    const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
    
    // Atomic increment - MongoDB handles concurrent $inc operations correctly
    const result = await ExpDB.findOneAndUpdate(
      { _id: id },
      { 
        $inc: { exp: gainedAmount },
        $setOnInsert: { _id: id, level: 0 },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    if (!result) throw new Error('Failed to update exp');
    
    // Calculate level from the ACTUAL final exp value (after atomic update)
    const actualLevel = this.getLevel(result.exp);
    
    // Update level if it changed
    if (actualLevel !== result.level) {
      await ExpDB.updateOne(
        { _id: id },
        { $set: { level: actualLevel } }
      );
      
      // Notify if leveled up
      if (actualLevel > oldLevel) {
        await this.notifyLevelUp(id, actualLevel, oldLevel);
      }
    }
    
    if (!by) {
      this.cooldowns[id] = Date.now();
    }
    
    return result.exp; // Return actual value from DB
  }

  /**
   * Add EXP rewards to a user (no cooldown)
   * Similar to addExp but intended for reward systems.
   * @param userid - User ID
   * @param amount - Amount of EXP to add (will be doubled if DOUBLE_EXP is active)
   * @param reason - Optional reason for the reward
   * @param by - Optional staff member ID
   * @returns Final EXP amount after addition
   */
  static async addExpRewards(userid: string, amount: number, reason?: string, by?: string): Promise<number> {
    const id = toID(userid);
    
    // Get old level for notification comparison
    const oldDoc = await ExpDB.findOne({ _id: id });
    const oldLevel = oldDoc ? oldDoc.level : 0;
    
    const gainedAmount = DOUBLE_EXP ? amount * 2 : amount;
    
    // Atomic increment - MongoDB handles concurrent $inc operations correctly
    const result = await ExpDB.findOneAndUpdate(
      { _id: id },
      { 
        $inc: { exp: gainedAmount },
        $setOnInsert: { _id: id, level: 0 },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    if (!result) throw new Error('Failed to update exp');
    
    // Calculate level from the ACTUAL final exp value (after atomic update)
    const actualLevel = this.getLevel(result.exp);
    
    // Update level if it changed
    if (actualLevel !== result.level) {
      await ExpDB.updateOne(
        { _id: id },
        { $set: { level: actualLevel } }
      );
      
      // Notify if leveled up
      if (actualLevel > oldLevel) {
        await this.notifyLevelUp(id, actualLevel, oldLevel);
      }
    }
    
    return result.exp; // Return actual value from DB
  }

  /**
   * Send level-up notification to user
   * Displays a popup with the new level and optional rewards.
   * @param userid - User ID
   * @param newLevel - The level the user just reached
   * @param oldLevel - The user's previous level
   */
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

  /**
   * Remove EXP from a user
   * Uses atomic operations and only removes if user has enough EXP.
   * @param userid - User ID
   * @param amount - Amount of EXP to remove
   * @param reason - Optional reason for removal
   * @param by - Optional staff member ID
   * @returns Final EXP amount after removal
   */
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

  /**
   * Reset all users' EXP to 0
   * WARNING: This deletes all EXP data. Use with extreme caution.
   */
  static async resetAllExp(): Promise<void> {
    // Efficient bulk delete operation
    await ExpDB.deleteMany({});
  }

  static async getRichestUsers(limit: number = 100): Promise<[string, number][]> {
    // Use MongoDB sort and limit
    const docs = await ExpDB.find({}, { sort: { exp: -1 }, limit });
    return docs.map(doc => [doc._id, doc.exp]);
  }

  /**
   * Get user's rank on the leaderboard
   * @param userid - User ID to get rank for
   * @returns Rank number (1-based, 1 = highest EXP)
   */
  static async getUserRank(userid: string): Promise<number> {
    const id = toID(userid);
    const userDoc = await ExpDB.findOne({ _id: id });
    if (!userDoc) return 0;
    
    // Count how many users have more exp
    const higherRanked = await ExpDB.countDocuments({ exp: { $gt: userDoc.exp } });
    return higherRanked + 1;
  }

  /**
   * Log EXP change to history
   * @param userid - User who received/lost EXP
   * @param amount - Amount of EXP (negative for removal)
   * @param reason - Reason for the change
   * @param by - Staff member who performed the action
   */
  static async logExpChange(userid: string, amount: number, reason: string, by: string): Promise<void> {
    try {
      await ExpHistoryDB.insertOne({
        userid: toID(userid),
        amount,
        reason,
        by: toID(by),
        timestamp: new Date()
      });
    } catch (error) {
      console.error('[ExpSystem] Error logging exp change:', error);
    }
  }

  /**
   * Get user's EXP history
   * @param userid - User ID to get history for
   * @param limit - Maximum number of entries to return
   * @returns Array of history entries
   */
  static async getExpHistory(userid: string, limit: number = 10): Promise<ExpHistoryDocument[]> {
    const id = toID(userid);
    return await ExpHistoryDB.find(
      { userid: id },
      { sort: { timestamp: -1 }, limit }
    );
  }

  /**
   * Calculate level from EXP amount
   * Uses exponential scaling based on MULTIPLIER constant.
   * @param exp - Experience points
   * @returns Calculated level (0 if below MIN_LEVEL_EXP)
   */
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

  /**
   * Calculate total EXP required to reach a specific level
   * @param level - Target level
   * @returns Total EXP needed to reach that level
   */
  static getExpForNextLevel(level: number): number {
    if (level <= 0) return MIN_LEVEL_EXP;
    let totalExp = MIN_LEVEL_EXP;
    for (let i = 1; i < level; i++) {
      totalExp += Math.floor(MIN_LEVEL_EXP * Math.pow(MULTIPLIER, i));
    }
    return totalExp;
  }

  /**
   * Initialize the EXP system on server startup
   * Loads configuration from database.
   */
  static async init(): Promise<void> {
    await this.loadExpConfig();
  }
}

// Initialize the ExpSystem
ExpSystem.init();

Impulse.ExpSystem = ExpSystem;

/**
 * Currency System Class
 * Manages user currency (coins, credits, etc.)
 */
export class CurrencySystem {
  private static currencyCooldowns: CooldownData = {};

  /**
   * Load currency configuration from database
   */
  private static async loadCurrencyConfig(): Promise<void> {
    try {
      const config = await CurrencyConfigDB.findOne({ _id: 'config' });
      if (config) {
        CURRENCY_UNIT = config.currencyName;
        Impulse.currencyUnit = CURRENCY_UNIT;
      }
    } catch (error) {
      console.error('[CurrencySystem] Error loading currency config:', error);
    }
  }

  /**
   * Save currency configuration to database
   */
  private static async saveCurrencyConfig(): Promise<void> {
    try {
      await CurrencyConfigDB.upsert(
        { _id: 'config' },
        {
          _id: 'config',
          currencyName: CURRENCY_UNIT,
          lastUpdated: new Date(),
        }
      );
    } catch (error) {
      console.error('[CurrencySystem] Error saving currency config:', error);
    }
  }

  /**
   * Check if user is on cooldown for earning currency
   */
  private static isOnCooldown(userid: string): boolean {
    const lastEarn = this.currencyCooldowns[userid] || 0;
    return Date.now() - lastEarn < CURRENCY_COOLDOWN;
  }

  /**
   * Read a user's current currency amount
   */
  static async readCurrency(userid: string): Promise<number> {
    const id = toID(userid);
    const doc = await CurrencyDB.findOne({ _id: id });
    return doc ? doc.currency : DEFAULT_CURRENCY;
  }

  /**
   * Write (set) a user's currency to a specific amount
   */
  static async writeCurrency(userid: string, amount: number): Promise<void> {
    const id = toID(userid);
    await CurrencyDB.upsert(
      { _id: id },
      {
        _id: id,
        currency: amount,
        lastUpdated: new Date(),
      }
    );
  }

  /**
   * Check if a user has at least a certain amount of currency
   */
  static async hasCurrency(userid: string, amount: number): Promise<boolean> {
    const id = toID(userid);
    const doc = await CurrencyDB.findOne({ _id: id, currency: { $gte: amount } });
    return doc !== null;
  }

  /**
   * Add currency to a user (with optional cooldown)
   * @param userid - User ID
   * @param amount - Amount of currency to add
   * @param reason - Reason for the addition
   * @param by - Staff member ID or 'system' for auto-earn (bypasses cooldown if not system)
   * @returns Final currency amount
   */
  static async addCurrency(userid: string, amount: number, reason: string = 'Auto-earn', by: string = 'system'): Promise<number> {
    const id = toID(userid);
    
    // Check cooldown only for system auto-earn
    if (by === 'system' && this.isOnCooldown(id)) {
      return await this.readCurrency(id);
    }

    // Atomic increment
    const result = await CurrencyDB.findOneAndUpdate(
      { _id: id },
      { 
        $inc: { currency: amount },
        $setOnInsert: { _id: id },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    if (!result) throw new Error('Failed to update currency');
    
    // Update cooldown
    if (by === 'system') {
      this.currencyCooldowns[id] = Date.now();
    }
    
    return result.currency;
  }

  /**
   * Remove currency from a user
   * @param userid - User ID
   * @param amount - Amount to remove
   * @param reason - Reason for removal
   * @param by - Staff member ID or 'system'
   * @returns Final currency amount (or current amount if insufficient funds)
   */
  static async takeCurrency(userid: string, amount: number, reason: string = 'Purchase', by: string = 'system'): Promise<number> {
    const id = toID(userid);
    
    // Atomic decrement only if user has enough
    const result = await CurrencyDB.findOneAndUpdate(
      { _id: id, currency: { $gte: amount } },
      { 
        $inc: { currency: -amount },
        $set: { lastUpdated: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    if (result) {
      return result.currency;
    }
    
    // User doesn't have enough currency
    const doc = await CurrencyDB.findOne({ _id: id });
    return doc ? doc.currency : DEFAULT_CURRENCY;
  }

  /**
   * Log currency change to history
   */
  static async logCurrencyChange(userid: string, amount: number, reason: string, by: string): Promise<void> {
    try {
      await CurrencyHistoryDB.insertOne({
        userid: toID(userid),
        amount,
        reason,
        by: toID(by),
        timestamp: new Date()
      });
    } catch (error) {
      console.error('[CurrencySystem] Error logging currency change:', error);
    }
  }

  /**
   * Get user's currency history
   */
  static async getCurrencyHistory(userid: string, limit: number = 10): Promise<CurrencyHistoryDocument[]> {
    const id = toID(userid);
    return await CurrencyHistoryDB.find(
      { userid: id },
      { sort: { timestamp: -1 }, limit }
    );
  }

  /**
   * Get richest users by currency
   */
  static async getRichestUsers(limit: number = 100): Promise<[string, number][]> {
    const docs = await CurrencyDB.find({}, { sort: { currency: -1 }, limit });
    return docs.map(doc => [doc._id, doc.currency]);
  }

  /**
   * Get user's rank on the currency leaderboard
   */
  static async getUserRank(userid: string): Promise<number> {
    const id = toID(userid);
    const userDoc = await CurrencyDB.findOne({ _id: id });
    if (!userDoc) return 0;
    
    const higherRanked = await CurrencyDB.countDocuments({ currency: { $gt: userDoc.currency } });
    return higherRanked + 1;
  }

  /**
   * Reset all users' currency to 0
   */
  static async resetAllCurrency(): Promise<void> {
    await CurrencyDB.deleteMany({});
  }

  /**
   * Set the currency name
   */
  static async setCurrencyName(name: string): Promise<void> {
    CURRENCY_UNIT = name;
    Impulse.currencyUnit = name;
    await this.saveCurrencyConfig();
  }

  /**
   * Get the current currency name
   */
  static getCurrencyName(): string {
    return CURRENCY_UNIT;
  }

  /**
   * Initialize the currency system
   */
  static async init(): Promise<void> {
    await this.loadCurrencyConfig();
  }
}

// Initialize the CurrencySystem
CurrencySystem.init();

Impulse.CurrencySystem = CurrencySystem;

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

  async currencyladder(args, user) {
    const richest = await CurrencySystem.getRichestUsers(100);
    if (!richest.length) {
      return `<div class="pad"><h2>No users have any ${CURRENCY_UNIT} yet.</h2></div>`;
    }

    const data = richest.map(([userid, currency], index) => {
      return [
        (index + 1).toString(),
        Impulse.nameColor(userid, true, true),
        `${currency} ${CURRENCY_UNIT}`,
      ];
    });

    const output = Impulse.generateThemedTable(
      `${CURRENCY_UNIT} Ladder`,
      ['Rank', 'User', CURRENCY_UNIT],
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

    async stats(target, room, user) {
      if (!this.runBroadcast()) return;
      const userid = target ? toID(target) : user.id;
      const targetName = target || user.name;
      
      const currentExp = await ExpSystem.readExp(userid);
      const currentLevel = ExpSystem.getLevel(currentExp);
      const nextLevelExp = ExpSystem.getExpForNextLevel(currentLevel + 1);
      const expNeeded = nextLevelExp - currentExp;
      const expProgress = currentExp - ExpSystem.getExpForNextLevel(currentLevel);
      const expForCurrentLevel = nextLevelExp - ExpSystem.getExpForNextLevel(currentLevel);
      const progressPercent = Math.floor((expProgress / expForCurrentLevel) * 100);
      
      // Get rank and total users
      const rank = await ExpSystem.getUserRank(userid);
      const totalUsers = await ExpDB.countDocuments({});
      const percentile = rank > 0 ? Math.floor((1 - rank / totalUsers) * 100) : 0;
      
      this.sendReplyBox(
        `<div class="ladder" style="max-width: 400px;">` +
        `<h3 style="margin: 5px 0;">${Impulse.nameColor(targetName, true, true)}'s Statistics</h3>` +
        `<table style="width: 100%; border-collapse: collapse;">` +
        `<tr><td style="padding: 4px;"><b>Level:</b></td><td style="padding: 4px; text-align: right;">${currentLevel}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Total EXP:</b></td><td style="padding: 4px; text-align: right;">${currentExp} ${EXP_UNIT}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>Progress:</b></td><td style="padding: 4px; text-align: right;">${progressPercent}% to Level ${currentLevel + 1}</td></tr>` +
        `<tr><td style="padding: 4px;"><b>EXP Needed:</b></td><td style="padding: 4px; text-align: right;">${expNeeded} ${EXP_UNIT}</td></tr>` +
        (rank > 0 ? 
          `<tr><td style="padding: 4px;"><b>Rank:</b></td><td style="padding: 4px; text-align: right;">#${rank} / ${totalUsers}</td></tr>` +
          `<tr><td style="padding: 4px;"><b>Percentile:</b></td><td style="padding: 4px; text-align: right;">Top ${percentile}%</td></tr>` 
          : ''
        ) +
        `</table>` +
        `</div>`
      );
    },

    async history(target, room, user) {
      const userid = target ? toID(target) : user.id;
      const targetName = target || user.name;
      
      const history = await ExpSystem.getExpHistory(userid, 15);
      
      if (!history.length) {
        return this.sendReply(`No EXP history found for ${targetName}.`);
      }
      
      let output = `<div class="ladder pad" style="max-width: 600px;">`;
      output += `<h3>${Impulse.nameColor(targetName, true, true)}'s EXP History (Last ${history.length} changes)</h3>`;
      output += `<div style="max-height: 300px; overflow-y: auto;">`;
      output += `<table style="width: 100%; border-collapse: collapse;">`;
      output += `<tr style="background: #f0f0f0;"><th>Date</th><th>Amount</th><th>Reason</th><th>By</th></tr>`;
      
      for (const entry of history) {
        const date = new Date(entry.timestamp).toLocaleString();
        const amountColor = entry.amount >= 0 ? 'green' : 'red';
        const amountText = entry.amount >= 0 ? `+${entry.amount}` : entry.amount;
        
        output += `<tr style="border-bottom: 1px solid #ddd;">`;
        output += `<td style="padding: 5px; font-size: 0.9em;">${date}</td>`;
        output += `<td style="padding: 5px; color: ${amountColor}; font-weight: bold;">${amountText} ${EXP_UNIT}</td>`;
        output += `<td style="padding: 5px;">${Chat.escapeHTML(entry.reason)}</td>`;
        output += `<td style="padding: 5px;">${Impulse.nameColor(entry.by, false, true)}</td>`;
        output += `</tr>`;
      }
      
      output += `</table></div></div>`;
      this.sendReply(`|raw|${output}`);
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
      
      // Log the change to history
      const actualAmount = DOUBLE_EXP ? amount * 2 : amount;
      await ExpSystem.logExpChange(targetUser.id, actualAmount, reason, user.id);
      
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
      
      // Log the change to history (negative amount)
      await ExpSystem.logExpChange(targetUser.id, -amount, reason, user.id);
      
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
        `<h4 style="margin: 8px 0;">User Commands:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>/exp level [user]</code> (or <code>/exp</code>) - Check your or another user's EXP, current level, and EXP needed for the next level</li>` +
        `<li><code>/exp stats [user]</code> - View detailed statistics including rank, percentile, and progress to next level</li>` +
        `<li><code>/exp history [user]</code> - View your EXP change history (admin actions, rewards, etc.)</li>` +
        `<li><code>/exp ladder</code> - View the top 100 users with the most EXP and their levels</li>` +
        `</ul>` +
        `<h4 style="margin: 8px 0;">Staff Commands:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>/exp give [user], [amount], [reason]</code> - Give a specified amount of EXP to a user (requires @)</li>` +
        `<li><code>/exp take [user], [amount], [reason]</code> - Take a specified amount of EXP from a user (requires @)</li>` +
        `<li><code>/exp reset [user], [reason]</code> - Reset a user's EXP to ${DEFAULT_EXP} (requires @)</li>` +
        `<li><code>/exp resetall [reason]</code> - Reset all users' EXP to ${DEFAULT_EXP} (requires ~)</li>` +
        `<li><code>/exp toggledouble [duration]</code> - Toggle double EXP with optional duration (e.g., "2 hours", "1 day", "30 minutes"). Use "off" to disable (requires @)</li>` +
        `</ul>` +
        `<small style="opacity: 0.8;">Note: All staff actions are logged to EXP history and modlog.</small>` +
        `</div>`
      );
    },
  },
};
