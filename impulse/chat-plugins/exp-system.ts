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
 * @author PrinceSky-Git
 * @license MIT
 */

import { ImpulseDB } from '../../impulse/impulse-db';
import { FS } from '../../lib';

// Configuration
const CONFIG = {
  EXP_PER_MESSAGE: 1,
  COOLDOWN_MS: 30000, // 30 seconds
  BASE_LEVEL_EXP: 20,
  LEVEL_MULTIPLIER: 1.2,
  MAX_LEVEL: 1000,
  REWARD_COOLDOWN_DAYS: 30, // 30 days between reward requests
} as const;

// Reward configuration - easily customizable
const REWARD_CONFIG = {
  customsymbol: {
    name: 'Custom Symbol',
    description: 'Set a custom group symbol',
    levelRequired: 5,
    command: 'customsymbol',
    adminCommand: 'setsymbol',
  },
  symbolcolor: {
    name: 'Symbol Color',
    description: 'Set a custom symbol color',
    levelRequired: 10,
    command: 'symbolcolor',
    adminCommand: 'setsymbolcolor',
  },
  customicon: {
    name: 'Custom Icon',
    description: 'Set a custom icon',
    levelRequired: 15,
    command: 'customicon',
    adminCommand: 'seticon',
  },
  customavatar: {
    name: 'Custom Avatar',
    description: 'Set a custom avatar image',
    levelRequired: 20,
    command: 'customavatar',
    adminCommand: 'setavatar',
  },
  customcolor: {
    name: 'Custom Color',
    description: 'Set a custom username color',
    levelRequired: 25,
    command: 'customcolor',
    adminCommand: 'setcolor',
  },
} as const;

// Global state
let cooldowns = new Map<string, number>();

// Logging
const REWARD_LOG_PATH = 'logs/rewards.txt';
const STAFF_ROOM_ID = 'staff';

async function logRewardAction(action: string, staff: string, target: string, details?: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} | Staff: ${staff} | Target: ${target}${details ? ` | ${details}` : ''}\n`;
    await FS(REWARD_LOG_PATH).append(logEntry);
  } catch (err) {
    console.error('Error writing to reward log:', err);
  }
}

/**
 * Validation functions
 */
function validateImageUrl(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return { valid: false, error: 'Only HTTP/HTTPS URLs are allowed' };
    }
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = validExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      return { valid: false, error: 'Image URL must end with .jpg, .jpeg, .png, .gif, or .webp' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

function validateHexColor(color: string): { valid: boolean; error?: string } {
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (!hexPattern.test(color)) {
    return { valid: false, error: 'Invalid hex color format. Use #RGB or #RRGGBB format' };
  }
  return { valid: true };
}

function validateCustomSymbol(symbol: string): { valid: boolean; error?: string } {
  if (symbol.length !== 1) {
    return { valid: false, error: 'Custom symbol must be a single character' };
  }
  
  // Check for potentially problematic characters
  const forbiddenChars = ['@', '#', '!', '~', '&', '%', '+', '^', '`', '|', '\\', '/', '?', '=', '<', '>', ':', ';', '"', "'", ' ', '\t', '\n', '\r'];
  if (forbiddenChars.includes(symbol)) {
    return { valid: false, error: 'Symbol contains forbidden characters. Use letters, numbers, or safe symbols' };
  }
  
  return { valid: true };
}

function validateCustomAnimation(animation: string): { valid: boolean; error?: string } {
  const validAnimations = ['pulse', 'bounce', 'glow', 'shake', 'rotate', 'fade', 'slide', 'rainbow'];
  
  if (!validAnimations.includes(animation.toLowerCase())) {
    return { 
      valid: false, 
      error: `Invalid animation. Available: ${validAnimations.join(', ')}` 
    };
  }
  
  return { valid: true };
}

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
 * Reward request tracking
 */
interface RewardRequest {
  _id: string; // userid
  lastRequest: Date;
  availableRewards: string[]; // Array of reward types available to user
  pendingRequests: Array<{
    rewardType: string;
    value: string; // Image URL or hex color
    requestedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
    processedBy?: string;
    processedAt?: Date;
    reason?: string;
  }>;
}

/**
 * Experience System Class
 */
export class ExpSystem {
  private static db = ImpulseDB<UserExp>('userexp');
  private static rewardDb = ImpulseDB<RewardRequest>('rewardrequests');

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

    // Check if user exists first
    const existingUser = await this.db.findOne({ _id: id });
    
    let result;
    if (existingUser) {
      // User exists - increment exp and totalMessages
      result = await this.db.findOneAndUpdate(
        { _id: id },
        {
          $inc: { 
            exp: amount,
            totalMessages: 1
          },
          $set: { lastUpdated: new Date() }
        },
        { returnDocument: 'after' }
      );
    } else {
      // User doesn't exist - create new document
      result = await this.db.findOneAndUpdate(
        { _id: id },
        {
          $setOnInsert: {
            _id: id,
            exp: amount,
            level: 0,
            totalMessages: 1,
            lastUpdated: new Date()
          }
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

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
    
    // Check if user exists first
    const existingUser = await this.db.findOne({ _id: id });
    
    let result;
    if (existingUser) {
      // User exists - increment exp
      result = await this.db.findOneAndUpdate(
        { _id: id },
        {
          $inc: { exp: amount },
          $set: { lastUpdated: new Date() }
        },
        { returnDocument: 'after' }
      );
    } else {
      // User doesn't exist - create new document
      result = await this.db.findOneAndUpdate(
        { _id: id },
        {
          $setOnInsert: {
            _id: id,
            exp: amount,
            level: 0,
            totalMessages: 0,
            lastUpdated: new Date()
          }
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

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

  /**
   * Get available rewards for a user based on their level
   */
  static async getAvailableRewards(userid: string): Promise<string[]> {
    const level = await this.getLevel(userid);
    const availableRewards: string[] = [];
    
    for (const [rewardType, config] of Object.entries(REWARD_CONFIG)) {
      if (level >= config.levelRequired) {
        availableRewards.push(rewardType);
      }
    }
    
    return availableRewards;
  }

  /**
   * Check if user can request a reward (cooldown check)
   */
  static async canRequestReward(userid: string): Promise<{ canRequest: boolean; nextAvailable?: Date }> {
    const id = toID(userid);
    const rewardData = await this.rewardDb.findOne({ _id: id });
    
    if (!rewardData) {
      return { canRequest: true };
    }
    
    const lastRequest = new Date(rewardData.lastRequest);
    const cooldownMs = CONFIG.REWARD_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    const nextAvailable = new Date(lastRequest.getTime() + cooldownMs);
    
    if (Date.now() >= nextAvailable.getTime()) {
      return { canRequest: true };
    }
    
    return { canRequest: false, nextAvailable };
  }

  /**
   * Request a reward (user command)
   */
  static async requestReward(userid: string, rewardType: string, value?: string): Promise<{
    success: boolean;
    message: string;
    nextAvailable?: Date;
  }> {
    const id = toID(userid);
    
    // Check if reward type exists
    if (!REWARD_CONFIG[rewardType as keyof typeof REWARD_CONFIG]) {
      return { success: false, message: 'Invalid reward type.' };
    }
    
    const config = REWARD_CONFIG[rewardType as keyof typeof REWARD_CONFIG];
    
    // Validate value based on reward type
    if (value) {
      if (rewardType === 'customavatar' || rewardType === 'customicon') {
        const validation = validateImageUrl(value);
        if (!validation.valid) {
          return { success: false, message: validation.error! };
        }
      } else if (rewardType === 'customcolor' || rewardType === 'symbolcolor') {
        const validation = validateHexColor(value);
        if (!validation.valid) {
          return { success: false, message: validation.error! };
        }
      } else if (rewardType === 'customsymbol') {
        const validation = validateCustomSymbol(value);
        if (!validation.valid) {
          return { success: false, message: validation.error! };
        }
      } else if (rewardType === 'customanimation') {
        const validation = validateCustomAnimation(value);
        if (!validation.valid) {
          return { success: false, message: validation.error! };
        }
      }
    } else {
      return { 
        success: false, 
        message: `Please provide a value for ${config.name}. Use /exp request ${rewardType} [value]` 
      };
    }
    
    // Check cooldown
    const cooldownCheck = await this.canRequestReward(id);
    if (!cooldownCheck.canRequest) {
      const daysLeft = Math.ceil((cooldownCheck.nextAvailable!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return { 
        success: false, 
        message: `You can request another reward in ${daysLeft} days.`,
        nextAvailable: cooldownCheck.nextAvailable
      };
    }
    
    // Check level requirement
    const level = await this.getLevel(id);
    if (level < config.levelRequired) {
      return { 
        success: false, 
        message: `You need to be level ${config.levelRequired} to request ${config.name}. You are currently level ${level}.` 
      };
    }
    
    // Add to pending requests
    const rewardData = await this.rewardDb.findOne({ _id: id });
    const pendingRequests = rewardData?.pendingRequests || [];
    
    // Check if user already has a pending request for this reward type
    const hasPending = pendingRequests.some(req => 
      req.rewardType === rewardType && req.status === 'pending'
    );
    
    if (hasPending) {
      return { 
        success: false, 
        message: `You already have a pending request for ${config.name}.` 
      };
    }
    
    // Add new request
    pendingRequests.push({
      rewardType,
      value: value!,
      requestedAt: new Date(),
      status: 'pending'
    });
    
    // Update reward request data
    await this.rewardDb.upsert(
      { _id: id },
      {
        _id: id,
        lastRequest: new Date(),
        availableRewards: await this.getAvailableRewards(id),
        pendingRequests
      }
    );
    
    return { 
      success: true, 
      message: `Your request for ${config.name} has been submitted! An admin will process it shortly.` 
    };
  }

  /**
   * Get user's reward request history
   */
  static async getRewardHistory(userid: string): Promise<RewardRequest | null> {
    const id = toID(userid);
    return await this.rewardDb.findOne({ _id: id });
  }

  /**
   * Admin: Reset user's reward cooldown
   */
  static async resetRewardCooldown(userid: string, by: string): Promise<void> {
    const id = toID(userid);
    await this.rewardDb.updateOne(
      { _id: id },
      {
        $set: {
          lastRequest: new Date(0), // Set to epoch to allow immediate request
          availableRewards: await this.getAvailableRewards(id)
        }
      },
      { upsert: true }
    );
  }

  /**
   * Admin: Get all pending reward requests
   */
  static async getPendingRewards(): Promise<Array<{
    userid: string;
    lastRequest: Date;
    availableRewards: string[];
    level: number;
    pendingRequests: Array<{
      rewardType: string;
      value: string;
      requestedAt: Date;
      status: string;
    }>;
  }>> {
    const requests = await this.rewardDb.find({});
    const results = [];
    
    for (const request of requests) {
      const level = await this.getLevel(request._id);
      const pendingRequests = request.pendingRequests?.filter(req => req.status === 'pending') || [];
      
      if (pendingRequests.length > 0) {
        results.push({
          userid: request._id,
          lastRequest: request.lastRequest,
          availableRewards: request.availableRewards,
          level,
          pendingRequests
        });
      }
    }
    
    return results.sort((a, b) => b.lastRequest.getTime() - a.lastRequest.getTime());
  }

  /**
   * Admin: Process a reward request (approve/reject)
   */
  static async processRewardRequest(
    userid: string, 
    rewardType: string, 
    action: 'approve' | 'reject', 
    by: string, 
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    const id = toID(userid);
    const rewardData = await this.rewardDb.findOne({ _id: id });
    
    if (!rewardData || !rewardData.pendingRequests) {
      return { success: false, message: 'No pending requests found for this user.' };
    }
    
    const requestIndex = rewardData.pendingRequests.findIndex(req => 
      req.rewardType === rewardType && req.status === 'pending'
    );
    
    if (requestIndex === -1) {
      return { success: false, message: 'No pending request found for this reward type.' };
    }
    
    const request = rewardData.pendingRequests[requestIndex];
    
    // Update request status
    rewardData.pendingRequests[requestIndex] = {
      ...request,
      status: action === 'approve' ? 'approved' : 'rejected',
      processedBy: by,
      processedAt: new Date(),
      reason: reason || (action === 'approve' ? 'Approved by staff' : 'Rejected by staff')
    };
    
    // If approved, apply the reward
    if (action === 'approve') {
      try {
        await this.applyReward(id, rewardType, request.value, by);
        await logRewardAction('APPROVE', by, id, `${rewardType}: ${request.value} | Reason: ${reason || 'No reason specified'}`);
      } catch (error) {
        await logRewardAction('APPROVE FAILED', by, id, `${rewardType}: ${request.value} | Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { 
          success: false, 
          message: `Failed to apply reward: ${error instanceof Error ? error.message : 'Unknown error'}` 
        };
      }
    } else {
      await logRewardAction('REJECT', by, id, `${rewardType}: ${request.value} | Reason: ${reason || 'No reason specified'}`);
    }
    
    // Update database
    await this.rewardDb.updateOne(
      { _id: id },
      { $set: { pendingRequests: rewardData.pendingRequests } }
    );
    
    const config = REWARD_CONFIG[rewardType as keyof typeof REWARD_CONFIG];
    return { 
      success: true, 
      message: `Reward request ${action}d successfully.` 
    };
  }

  /**
   * Apply a reward to a user
   */
  private static async applyReward(userid: string, rewardType: string, value: string, by: string): Promise<void> {
    const id = toID(userid);
    
    switch (rewardType) {
      case 'customavatar':
        // Use the existing customavatar system
        await this.callCommand('customavatar', 'set', `${id}, ${value}`, by);
        break;
        
      case 'customicon':
        // Use the existing icon system
        await this.callCommand('icon', 'set', `${id}, ${value}`, by);
        break;
        
      case 'customcolor':
        // Use the existing customcolor system
        await this.callCommand('customcolor', 'set', `${id}, ${value}`, by);
        break;
        
      case 'symbolcolor':
        // Use the existing symbolcolor system
        await this.callCommand('symbolcolor', 'set', `${id}, ${value}`, by);
        break;
        
      case 'customsymbol':
        // Use the existing customsymbol system
        await this.callCommand('customsymbol', 'set', `${id}, ${value}`, by);
        break;
        
      case 'customanimation':
        // Use the existing customanimation system
        await this.callCommand('customanimation', 'set', `${id}, ${value}`, by);
        break;
        
      default:
        throw new Error(`Unknown reward type: ${rewardType}`);
    }
  }

  /**
   * Helper to call existing commands
   */
  private static async callCommand(command: string, subcommand: string, args: string, by: string): Promise<void> {
    // This is a simplified version - in practice, you'd need to properly integrate
    // with the existing command systems. For now, we'll just log the action.
    console.log(`[Reward System] ${by} applied ${command} ${subcommand} ${args}`);
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
        `<li><code>/exp rewards</code> - View available rewards and cooldown status</li>` +
        `<li><code>/exp request [reward] [value]</code> - Request a reward with value (30-day cooldown)</li>` +
        `</ul>` +
        `<h4 style="margin: 8px 0;">Staff Commands:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>/exp give [user], [amount]</code> - Give experience to a user (requires @)</li>` +
        `<li><code>/exp take [user], [amount]</code> - Take experience from a user (requires @)</li>` +
        `<li><code>/exp reset [user]</code> - Reset a user's experience to 0 (requires @)</li>` +
        `<li><code>/exp pending</code> - View pending reward requests with action buttons (requires @)</li>` +
        `<li><code>/exp approve [user], [reward] [reason]</code> - Approve a reward request (requires @)</li>` +
        `<li><code>/exp reject [user], [reward] [reason]</code> - Reject a reward request (requires @)</li>` +
        `<li><code>/exp viewrequest [user], [reward]</code> - View detailed reward request (requires @)</li>` +
        `<li><code>/exp resetcooldown [user]</code> - Reset user's reward cooldown (requires @)</li>` +
        `<li><code>/exp logs [number]</code> - View reward system logs (requires @)</li>` +
        `</ul>` +
        `<h4 style="margin: 8px 0;">Reward Types:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>customsymbol [symbol]</code> - Custom group symbol (Level 5+)</li>` +
        `<li><code>symbolcolor [hex_color]</code> - Custom symbol color (Level 10+)</li>` +
        `<li><code>customicon [image_url]</code> - Custom icon (Level 15+)</li>` +
        `<li><code>customavatar [image_url]</code> - Custom avatar (Level 20+)</li>` +
        `<li><code>customcolor [hex_color]</code> - Custom username color (Level 25+)</li>` +
        `</ul>` +
        `<small style="opacity: 0.8;">Earn experience by chatting! 1 EXP per message with a 30-second cooldown.</small>` +
        `</div>`
      );
    },

    async rewards(target, room, user) {
      if (!this.runBroadcast()) return;
      
      const userid = target ? toID(target) : user.id;
      const targetName = target || user.name;
      
      const level = await ExpSystem.getLevel(userid);
      const availableRewards = await ExpSystem.getAvailableRewards(userid);
      const cooldownCheck = await ExpSystem.canRequestReward(userid);
      
      let cooldownText = '';
      if (cooldownCheck.canRequest) {
        cooldownText = '<span style="color: #27ae60;">Available now!</span>';
      } else {
        const daysLeft = Math.ceil((cooldownCheck.nextAvailable!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        cooldownText = `<span style="color: #e74c3c;">${daysLeft} days remaining</span>`;
      }
      
      let rewardsList = '';
      for (const [rewardType, config] of Object.entries(REWARD_CONFIG)) {
        const isAvailable = availableRewards.includes(rewardType);
        const status = isAvailable ? 
          (level >= config.levelRequired ? '<span style="color: #27ae60;">✓ Available</span>' : '<span style="color: #e74c3c;">✗ Level too low</span>') :
          '<span style="color: #95a5a6;">✗ Not available</span>';
        
        rewardsList += `<tr><td style="padding: 4px;">${config.name}</td><td style="padding: 4px;">Level ${config.levelRequired}</td><td style="padding: 4px;">${status}</td></tr>`;
      }
      
      this.sendReplyBox(
        `<div class="ladder" style="max-width: 500px;">` +
        `<h3 style="margin: 5px 0;">${Impulse.nameColor(targetName, true, true)}'s Rewards</h3>` +
        `<div style="margin: 10px 0;"><b>Current Level:</b> ${level} | <b>Next Request:</b> ${cooldownText}</div>` +
        `<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">` +
        `<tr style="background: #f0f0f0;"><th style="padding: 4px;">Reward</th><th style="padding: 4px;">Level Required</th><th style="padding: 4px;">Status</th></tr>` +
        rewardsList +
        `</table>` +
        `<div style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">` +
        `Use <code>/exp request [reward]</code> to request a reward. 30-day cooldown between requests.` +
        `</div>` +
        `</div>`
      );
    },

    async request(target, room, user) {
      if (!target) return this.sendReply('Usage: /exp request [reward] [value]. Use /exp rewards to see available rewards.');
      
      const parts = target.split(' ').map(p => p.trim());
      const rewardType = parts[0].toLowerCase();
      const value = parts.slice(1).join(' ');
      
      if (!value) {
        return this.sendReply(`Please provide a value for ${rewardType}. For avatars/icons: image URL, for colors: hex code.`);
      }
      
      const result = await ExpSystem.requestReward(user.id, rewardType, value);
      
      if (result.success) {
        this.sendReply(`|html|<div class="broadcast-green">${result.message}</div>`);
      } else {
        this.sendReply(`|html|<div class="broadcast-red">${result.message}</div>`);
      }
    },

    async pending(target, room, user) {
      this.checkCan('globalban');
      if (!this.runBroadcast()) return;
      
      const pendingRewards = await ExpSystem.getPendingRewards();
      
      if (!pendingRewards.length) {
        return this.sendReply('No pending reward requests.');
      }
      
      let output = `<div class="ladder" style="max-width: 800px;">`;
      output += `<h3 style="margin: 5px 0;">Pending Reward Requests (${pendingRewards.length})</h3>`;
      output += `<div style="max-height: 500px; overflow-y: auto;">`;
      
      for (const request of pendingRewards.slice(0, 20)) { // Limit to 20 for performance
        const date = new Date(request.lastRequest).toLocaleString();
        
        output += `<div style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px;">`;
        output += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">`;
        output += `<div><strong>${Impulse.nameColor(request.userid, true, true)}</strong> (Level ${request.level})</div>`;
        output += `<div style="font-size: 0.9em; color: #666;">${date}</div>`;
        output += `</div>`;
        
        for (const pendingReq of request.pendingRequests) {
          const config = REWARD_CONFIG[pendingReq.rewardType as keyof typeof REWARD_CONFIG];
          const requestDate = new Date(pendingReq.requestedAt).toLocaleString();
          
          output += `<div style="background: #f9f9f9; padding: 10px; margin: 5px 0; border-radius: 3px;">`;
          output += `<div style="font-weight: bold; margin-bottom: 5px;">${config?.name || pendingReq.rewardType}</div>`;
          
          if (pendingReq.rewardType === 'customavatar' || pendingReq.rewardType === 'customicon') {
            output += `<div style="margin: 5px 0;"><img src="${pendingReq.value}" width="64" height="64" style="border: 1px solid #ccc; border-radius: 3px;"></div>`;
            output += `<div style="font-size: 0.8em; color: #666; word-break: break-all;">${pendingReq.value}</div>`;
          } else if (pendingReq.rewardType === 'customsymbol') {
            output += `<div style="margin: 5px 0;">`;
            output += `<span style="font-size: 32px; font-weight: bold; background: #f0f0f0; padding: 5px 10px; border-radius: 3px; display: inline-block;">${pendingReq.value}</span>`;
            output += `</div>`;
          } else {
            output += `<div style="margin: 5px 0;">`;
            output += `<span style="color: ${pendingReq.value}; font-size: 24px; font-weight: bold;">■</span> `;
            output += `<span style="font-family: monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 3px;">${pendingReq.value}</span>`;
            output += `</div>`;
          }
          
          output += `<div style="font-size: 0.8em; color: #666; margin-top: 5px;">Requested: ${requestDate}</div>`;
          
          // Action buttons
          output += `<div style="margin-top: 10px;">`;
          output += `<button class="button" name="send" value="/exp approve ${request.userid}, ${pendingReq.rewardType}" style="background: #27ae60; color: white; margin-right: 5px;">✓ Approve</button>`;
          output += `<button class="button" name="send" value="/exp reject ${request.userid}, ${pendingReq.rewardType}" style="background: #e74c3c; color: white; margin-right: 5px;">✗ Reject</button>`;
          output += `<button class="button" name="send" value="/exp viewrequest ${request.userid}, ${pendingReq.rewardType}" style="background: #3498db; color: white;">👁 View Details</button>`;
          output += `</div>`;
          output += `</div>`;
        }
        
        output += `</div>`;
      }
      
      output += `</div></div>`;
      this.sendReply(`|raw|${output}`);
    },

    async approve(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply('Usage: /exp approve [user], [reward] [reason]');
      
      const parts = target.split(',').map(p => p.trim());
      const userid = parts[0];
      const rewardType = parts[1];
      const reason = parts.slice(2).join(',').trim() || 'Approved by staff';
      
      const result = await ExpSystem.processRewardRequest(userid, rewardType, 'approve', user.id, reason);
      
      if (result.success) {
        this.sendReply(`|html|<div class="broadcast-green">${result.message}</div>`);
        this.modlog('APPROVEREWARD', userid, `${rewardType} approved`, { by: user.id, reason });
      } else {
        this.sendReply(`|html|<div class="broadcast-red">${result.message}</div>`);
      }
    },

    async reject(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply('Usage: /exp reject [user], [reward] [reason]');
      
      const parts = target.split(',').map(p => p.trim());
      const userid = parts[0];
      const rewardType = parts[1];
      const reason = parts.slice(2).join(',').trim() || 'Rejected by staff';
      
      const result = await ExpSystem.processRewardRequest(userid, rewardType, 'reject', user.id, reason);
      
      if (result.success) {
        this.sendReply(`|html|<div class="broadcast-green">${result.message}</div>`);
        this.modlog('REJECTREWARD', userid, `${rewardType} rejected`, { by: user.id, reason });
      } else {
        this.sendReply(`|html|<div class="broadcast-red">${result.message}</div>`);
      }
    },

    async viewrequest(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply('Usage: /exp viewrequest [user], [reward]');
      
      const parts = target.split(',').map(p => p.trim());
      const userid = parts[0];
      const rewardType = parts[1];
      
      const rewardData = await ExpSystem.getRewardHistory(userid);
      if (!rewardData || !rewardData.pendingRequests) {
        return this.sendReply('No reward data found for this user.');
      }
      
      const request = rewardData.pendingRequests.find(req => 
        req.rewardType === rewardType && req.status === 'pending'
      );
      
      if (!request) {
        return this.sendReply('No pending request found for this reward type.');
      }
      
      const config = REWARD_CONFIG[rewardType as keyof typeof REWARD_CONFIG];
      const requestDate = new Date(request.requestedAt).toLocaleString();
      
      let output = `<div class="ladder" style="max-width: 500px;">`;
      output += `<h3 style="margin: 5px 0;">Reward Request Details</h3>`;
      output += `<div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">`;
      output += `<div><strong>User:</strong> ${Impulse.nameColor(userid, true, true)}</div>`;
      output += `<div><strong>Reward:</strong> ${config?.name || rewardType}</div>`;
      output += `<div><strong>Requested:</strong> ${requestDate}</div>`;
      output += `<div><strong>Status:</strong> <span style="color: #f39c12;">Pending</span></div>`;
      
      if (rewardType === 'customavatar' || rewardType === 'customicon') {
        output += `<div style="margin: 10px 0;"><strong>Image:</strong></div>`;
        output += `<div><img src="${request.value}" width="128" height="128" style="border: 1px solid #ccc; border-radius: 5px;"></div>`;
        output += `<div style="font-size: 0.8em; color: #666; word-break: break-all; margin-top: 5px;">${request.value}</div>`;
      } else if (rewardType === 'customsymbol') {
        output += `<div style="margin: 10px 0;"><strong>Symbol:</strong></div>`;
        output += `<div style="display: flex; align-items: center; gap: 10px;">`;
        output += `<span style="font-size: 48px; font-weight: bold; background: #f0f0f0; padding: 10px 15px; border-radius: 5px; display: inline-block;">${request.value}</span>`;
        output += `<span style="font-family: monospace; background: #e0e0e0; padding: 5px 10px; border-radius: 3px;">${request.value}</span>`;
        output += `</div>`;
      } else {
        output += `<div style="margin: 10px 0;"><strong>Color:</strong></div>`;
        output += `<div style="display: flex; align-items: center; gap: 10px;">`;
        output += `<span style="color: ${request.value}; font-size: 32px; font-weight: bold;">■</span>`;
        output += `<span style="font-family: monospace; background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">${request.value}</span>`;
        output += `</div>`;
      }
      
      output += `</div></div>`;
      this.sendReply(`|raw|${output}`);
    },

    async resetcooldown(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply('Usage: /exp resetcooldown [user]');
      
      const targetUser = Users.get(target);
      if (!targetUser) return this.errorReply(`User "${target}" not found.`);
      
      await ExpSystem.resetRewardCooldown(targetUser.id, user.id);
      
      this.sendReplyBox(
        `Reset ${Impulse.nameColor(targetUser.name, true, true)}'s reward cooldown. They can now request rewards immediately.`
      );
      
      this.modlog('RESETREWARDCOOLDOWN', targetUser, 'cooldown reset', { by: user.id });
    },

    async logs(target, room, user) {
      this.checkCan('globalban');
      
      try {
        const logContent = await FS(REWARD_LOG_PATH).readIfExists();
        
        if (!logContent) {
          return this.sendReply('No reward logs found.');
        }
        
        const lines = logContent.trim().split('\n');
        const numLines = parseInt(target) || 50;
        
        if (numLines < 1 || numLines > 500) {
          return this.errorReply('Please specify a number between 1 and 500.');
        }
        
        // Get the last N lines and reverse to show latest first
        const recentLines = lines.slice(-numLines).reverse();
        
        let output = `<div class="ladder pad"><h2>Reward System Logs (Last ${recentLines.length} entries - Latest First)</h2>`;
        output += `<div style="max-height: 370px; overflow: auto; font-family: monospace; font-size: 11px;">`;
        
        // Add each log entry with a horizontal line separator
        for (let i = 0; i < recentLines.length; i++) {
          output += `<div style="padding: 8px 0;">${Chat.escapeHTML(recentLines[i])}</div>`;
          if (i < recentLines.length - 1) {
            output += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 0;">`;
          }
        }
        
        output += `</div></div>`;
        
        this.sendReply(`|raw|${output}`);
      } catch (err) {
        console.error('Error reading reward logs:', err);
        return this.errorReply('Failed to read reward logs.');
      }
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
