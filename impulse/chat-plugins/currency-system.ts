/**
 * Pokemon Showdown - Currency System
 * 
 * A comprehensive economy system for Pokemon Showdown servers.
 * Users earn currency through chat activity and can use it for various features.
 * 
 * Currency System Features:
 * - Customizable currency name (easily changeable)
 * - Automatic currency earning through chat activity
 * - Currency leaderboard
 * - Admin moderation tools (give/take/reset currency)
 * - Transaction history tracking
 * - Persistent currency name stored in database
 * 
 * Integration:
 * This system can be integrated with the chat system.
 * See server/chat.ts for integration points:
 *   if (this.user.registered) Impulse.CurrencySystem.addCurrency(this.user.id, CURRENCY_EARN_RATE);
 * 
 * Database Collections:
 * - currencydata: Stores user currency balances
 * - currencyconfig: Stores currency configuration (currency name)
 * - currencyhistory: Stores currency transaction history
 * 
 * Configuration:
 * Currency System:
 *   - DEFAULT_CURRENCY: Starting currency amount (0)
 *   - CURRENCY_UNIT: Currency name (default: "Coins", easily changeable via /currency setname)
 *   - CURRENCY_EARN_RATE: How much currency earned per message (5)
 *   - CURRENCY_COOLDOWN: Cooldown between currency gains in ms (60000 = 1 minute)
 * 
 * @author Prince Sky
 * @license MIT
 */

import { ImpulseDB } from '../../impulse/impulse-db';

// Currency System Configuration
const DEFAULT_CURRENCY = 0;
let CURRENCY_UNIT = `Coins`; // Easily changeable currency name
Impulse.currencyUnit = CURRENCY_UNIT;

const CURRENCY_EARN_RATE = 5; // How much currency earned per chat message (with cooldown)
const CURRENCY_COOLDOWN = 60000; // 1 minute cooldown for earning currency

interface CooldownData {
  [userid: string]: number;
}

/**
 * MongoDB Document Interfaces
 */

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
const CurrencyDB = ImpulseDB<CurrencyDocument>('currencydata');
const CurrencyHistoryDB = ImpulseDB<CurrencyHistoryDocument>('currencyhistory');
const CurrencyConfigDB = ImpulseDB<CurrencyConfigDocument>('currencyconfig');

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
  currency: {
    '': 'balance',
    async balance(target, room, user) {
      if (!target) target = user.name;
      if (!this.runBroadcast()) return;
      const userid = toID(target);
      const currency = await CurrencySystem.readCurrency(userid);
      
      this.sendReplyBox(
        `<b>${Impulse.nameColor(target, true, true)}</b> has <b>${currency} ${CurrencySystem.getCurrencyName()}</b>`
      );
    },

    async stats(target, room, user) {
      if (!this.runBroadcast()) return;
      const userid = target ? toID(target) : user.id;
      const targetName = target || user.name;
      
      const currency = await CurrencySystem.readCurrency(userid);
      const rank = await CurrencySystem.getUserRank(userid);
      const totalUsers = await CurrencyDB.countDocuments({});
      const percentile = rank > 0 ? Math.floor((1 - rank / totalUsers) * 100) : 0;
      
      this.sendReplyBox(
        `<div class="ladder" style="max-width: 400px;">` +
        `<h3 style="margin: 5px 0;">${Impulse.nameColor(targetName, true, true)}'s ${CurrencySystem.getCurrencyName()} Statistics</h3>` +
        `<table style="width: 100%; border-collapse: collapse;">` +
        `<tr><td style="padding: 4px;"><b>Balance:</b></td><td style="padding: 4px; text-align: right;">${currency} ${CurrencySystem.getCurrencyName()}</td></tr>` +
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
      
      const history = await CurrencySystem.getCurrencyHistory(userid, 15);
      
      if (!history.length) {
        return this.sendReply(`No ${CurrencySystem.getCurrencyName()} history found for ${targetName}.`);
      }
      
      let output = `<div class="ladder pad" style="max-width: 600px;">`;
      output += `<h3>${Impulse.nameColor(targetName, true, true)}'s ${CurrencySystem.getCurrencyName()} History (Last ${history.length} changes)</h3>`;
      output += `<div style="max-height: 300px; overflow-y: auto;">`;
      output += `<table style="width: 100%; border-collapse: collapse;">`;
      output += `<tr style="background: #f0f0f0;"><th>Date</th><th>Amount</th><th>Reason</th><th>By</th></tr>`;
      
      for (const entry of history) {
        const date = new Date(entry.timestamp).toLocaleString();
        const amountColor = entry.amount >= 0 ? 'green' : 'red';
        const amountText = entry.amount >= 0 ? `+${entry.amount}` : entry.amount;
        
        output += `<tr style="border-bottom: 1px solid #ddd;">`;
        output += `<td style="padding: 5px; font-size: 0.9em;">${date}</td>`;
        output += `<td style="padding: 5px; color: ${amountColor}; font-weight: bold;">${amountText} ${CurrencySystem.getCurrencyName()}</td>`;
        output += `<td style="padding: 5px;">${Chat.escapeHTML(entry.reason)}</td>`;
        output += `<td style="padding: 5px;">${Impulse.nameColor(entry.by, false, true)}</td>`;
        output += `</tr>`;
      }
      
      output += `</table></div></div>`;
      this.sendReply(`|raw|${output}`);
    },

    async give(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply(`Usage: /currency give [user], [amount], [reason]`);
      const parts = target.split(',').map(p => p.trim());
      if (parts.length < 2) return this.sendReply(`Usage: /currency give [user], [amount], [reason]`);

      const targetUser = Users.get(parts[0]);
      const amount = parseInt(parts[1], 10);
      const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

      if (!targetUser) {
        return this.errorReply(`User "${parts[0]}" not found.`);
      }
      if (isNaN(amount) || amount <= 0) {
        return this.errorReply(`Please specify a valid positive amount.`);
      }

      await CurrencySystem.addCurrency(targetUser.id, amount, reason, user.id);
      const newCurrency = await CurrencySystem.readCurrency(targetUser.id);
      
      // Log to history
      await CurrencySystem.logCurrencyChange(targetUser.id, amount, reason, user.id);
      
      this.sendReplyBox(
        `${Impulse.nameColor(user.name, true, true)} gave ${amount} ${CurrencySystem.getCurrencyName()} to ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
        `New Balance: ${newCurrency} ${CurrencySystem.getCurrencyName()}`
      );
      if (targetUser.connected) {
        targetUser.popup(
          `|html|You received <b>${amount} ${CurrencySystem.getCurrencyName()}</b> from <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
          `Reason: ${reason}<br>` +
          `New Balance: ${newCurrency} ${CurrencySystem.getCurrencyName()}`
        );
      }
    },

    async take(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply(`Usage: /currency take [user], [amount], [reason]`);
      const parts = target.split(',').map(p => p.trim());
      if (parts.length < 2) return this.sendReply(`Usage: /currency take [user], [amount], [reason]`);

      const targetUser = Users.get(parts[0]);
      const amount = parseInt(parts[1], 10);
      const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

      if (!targetUser) {
        return this.errorReply(`User "${parts[0]}" not found.`);
      }
      if (isNaN(amount) || amount <= 0) {
        return this.errorReply(`Please specify a valid positive amount.`);
      }

      const oldCurrency = await CurrencySystem.readCurrency(targetUser.id);
      await CurrencySystem.takeCurrency(targetUser.id, amount, reason, user.id);
      const newCurrency = await CurrencySystem.readCurrency(targetUser.id);
      
      if (oldCurrency === newCurrency && oldCurrency < amount) {
        return this.errorReply(`${targetUser.name} doesn't have enough ${CurrencySystem.getCurrencyName()} (has ${oldCurrency}, needs ${amount}).`);
      }
      
      // Log to history (negative amount)
      await CurrencySystem.logCurrencyChange(targetUser.id, -amount, reason, user.id);
      
      this.sendReplyBox(
        `${Impulse.nameColor(user.name, true, true)} took ${amount} ${CurrencySystem.getCurrencyName()} from ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
        `New Balance: ${newCurrency} ${CurrencySystem.getCurrencyName()}`
      );
      if (targetUser.connected) {
        targetUser.popup(
          `|html|<b>${Impulse.nameColor(user.name, true, true)}</b> took <b>${amount} ${CurrencySystem.getCurrencyName()}</b> from you.<br>` +
          `Reason: ${reason}<br>` +
          `New Balance: ${newCurrency} ${CurrencySystem.getCurrencyName()}`
        );
      }
    },

    async reset(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.sendReply(`Usage: /currency reset [user], [reason]`);
      const parts = target.split(',').map(p => p.trim());
      const targetUser = Users.get(parts[0]);
      const reason = parts.slice(1).join(',').trim() || 'No reason specified.';

      if (!targetUser) {
        return this.errorReply(`User "${parts[0]}" not found.`);
      }

      await CurrencySystem.writeCurrency(targetUser.id, DEFAULT_CURRENCY);
      this.sendReplyBox(
        `${Impulse.nameColor(user.name, true, true)} reset ${Impulse.nameColor(targetUser.name, true, true)}'s ${CurrencySystem.getCurrencyName()} to ${DEFAULT_CURRENCY} (${reason}).`
      );
      if (targetUser.connected) {
        targetUser.popup(
          `|html|Your ${CurrencySystem.getCurrencyName()} has been reset to <b>${DEFAULT_CURRENCY}</b> by <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
          `Reason: ${reason}`
        );
      }
    },

    async resetall(target, room, user) {
      this.checkCan('bypassall');
      const reason = target.trim() || 'No reason specified.';

      await CurrencySystem.resetAllCurrency();
      this.sendReplyBox(
        `All user ${CurrencySystem.getCurrencyName()} has been reset to ${DEFAULT_CURRENCY} (${reason}).`
      );
      if (room) {
        room.add(
          `|html|<center><div class="broadcast-blue">` +
          `<b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${CurrencySystem.getCurrencyName()} to <b>${DEFAULT_CURRENCY}</b>.<br>` +
          `Reason: ${reason}` +
          `</div></center>`
        );
        room.update();
      }
    },

    async setname(target, room, user) {
      this.checkCan('bypassall');
      if (!target) return this.sendReply(`Usage: /currency setname [new name]`);
      
      const newName = target.trim();
      if (newName.length < 1 || newName.length > 20) {
        return this.errorReply('Currency name must be between 1 and 20 characters.');
      }

      const oldName = CurrencySystem.getCurrencyName();
      await CurrencySystem.setCurrencyName(newName);
      
      this.sendReplyBox(
        `${Impulse.nameColor(user.name, true, true)} changed the currency name from "${oldName}" to "${newName}".`
      );
      if (room) {
        room.add(
          `|html|<div class="broadcast-green">` +
          `Currency name has been changed from <b>${oldName}</b> to <b>${newName}</b> by ${Impulse.nameColor(user.name, true, true)}.` +
          `</div>`
        );
        room.update();
      }
    },

    async ladder(target, room, user) {
      if (!this.runBroadcast()) return;
      return this.parse(`/join view-currencyladder`);
    },

    async help(target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReplyBox(
        `<div><b><center>Currency System Commands By ${Impulse.nameColor('Prince Sky', true, false)}</center></b><br>` +
        `<h4 style="margin: 8px 0;">User Commands:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>/currency balance [user]</code> (or <code>/currency</code>) - Check your or another user's currency balance</li>` +
        `<li><code>/currency stats [user]</code> - View detailed currency statistics including rank and percentile</li>` +
        `<li><code>/currency history [user]</code> - View your currency transaction history</li>` +
        `<li><code>/currency ladder</code> - View the top 100 users with the most currency</li>` +
        `</ul>` +
        `<h4 style="margin: 8px 0;">Staff Commands:</h4>` +
        `<ul style="margin: 5px 0;">` +
        `<li><code>/currency give [user], [amount], [reason]</code> - Give currency to a user (requires @)</li>` +
        `<li><code>/currency take [user], [amount], [reason]</code> - Take currency from a user (requires @)</li>` +
        `<li><code>/currency reset [user], [reason]</code> - Reset a user's currency to ${DEFAULT_CURRENCY} (requires @)</li>` +
        `<li><code>/currency resetall [reason]</code> - Reset all users' currency to ${DEFAULT_CURRENCY} (requires ~)</li>` +
        `<li><code>/currency setname [new name]</code> - Change the currency name (requires ~)</li>` +
        `</ul>` +
        `<small style="opacity: 0.8;">Current currency name: <b>${CurrencySystem.getCurrencyName()}</b> | All staff actions are logged to history.<br>` +
        `<b>Aliases:</b> /bal, /balance, /money, /givemoney, /takemoney, /currencystats, /currencyhistory, /currencyladder, /setcurrencyname</small>` +
        `</div>`
      );
    },
  },

  // Short aliases for currency commands
  bal: 'currency balance',
  balance: 'currency balance',
  money: 'currency balance',
  coins: 'currency balance',
  currencystats: 'currency stats',
  moneystats: 'currency stats',
  currencyhistory: 'currency history',
  moneyhistory: 'currency history',
  currencyladder: 'currency ladder',
  moneyladder: 'currency ladder',
  balladder: 'currency ladder',
  givemoney: 'currency give',
  givecurrency: 'currency give',
  takemoney: 'currency take',
  takecurrency: 'currency take',
  resetmoney: 'currency reset',
  resetcurrency: 'currency reset',
  setcurrencyname: 'currency setname',
};
