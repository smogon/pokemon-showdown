/***************************************
* Pokemon Showdown Economy System      *
* Credits: Unknown                     *
* Updated By: Prince Sky              *
***************************************/

import { FS } from '../lib/fs';

// ================ Configuration ================
const MONEY_FILE_PATH = 'impulse-db/money.json';
const MONEY_LOGS_PATH = 'impulse-db/moneylogs.json';
const DEFAULT_AMOUNT = 0;
const CURRENCY = `coins`;
Impulse.currency = CURRENCY;

// ================ Helper Functions ================
function formatUTCTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// ================ Interfaces ================
interface EconomyData {
  [userid: string]: number;
}

interface EconomyLogEntry {
  timestamp: number;
  action: 'give' | 'take' | 'transfer' | 'reset';
  from?: string;
  to: string;
  amount: number;
  by?: string;
}

interface EconomyLogs {
  logs: EconomyLogEntry[];
}

// ================ Economy Class ================
export class Economy {
  private static data: EconomyData = Economy.loadMoneyData();
  private static logs: EconomyLogs = Economy.loadMoneyLogs();

  // Data Loading & Saving Methods
  private static loadMoneyData(): EconomyData {
    try {
      const rawData = FS(MONEY_FILE_PATH).readIfExistsSync();
      return rawData ? (JSON.parse(rawData) as EconomyData) : {};
    } catch (error) {
      console.error(`Error reading economy data: ${error}`);
      return {};
    }
  }

  private static saveMoneyData(): void {
    try {
      const dataToWrite: EconomyData = {};
      for (const id in this.data) {
        if (Object.prototype.hasOwnProperty.call(this.data, id)) {
          dataToWrite[toID(id)] = this.data[id];
        }
      }
      FS(MONEY_FILE_PATH).writeUpdate(() => JSON.stringify(dataToWrite, null, 2));
    } catch (error) {
      console.error(`Error saving economy data: ${error}`);
    }
  }

  private static loadMoneyLogs(): EconomyLogs {
    try {
      const rawLogs = FS(MONEY_LOGS_PATH).readIfExistsSync();
      return rawLogs ? (JSON.parse(rawLogs) as EconomyLogs) : { logs: [] };
    } catch (error) {
      console.error(`Error reading economy logs: ${error}`);
      return { logs: [] };
    }
  }

  private static saveMoneyLogs(): void {
    try {
      FS(MONEY_LOGS_PATH).writeUpdate(() => JSON.stringify(this.logs, null, 2));
    } catch (error) {
      console.error(`Error saving economy logs: ${error}`);
    }
  }

  private static logMoneyAction(entry: Omit<EconomyLogEntry, 'timestamp'>): void {
    this.logs.logs.push({ timestamp: Date.now(), ...entry });
    this.saveMoneyLogs();
  }

  // Core Economy Functions
  static writeMoney(userid: string, amount: number): void {
    this.data[toID(userid)] = amount;
    this.saveMoneyData();
  }

  static readMoney(userid: string): number {
    return this.data[toID(userid)] || DEFAULT_AMOUNT;
  }

  static hasMoney(userid: string, amount: number): boolean {
    return this.readMoney(userid) >= amount;
  }

  static addMoney(userid: string, amount: number, reason?: string, by?: string): number {
    const id = toID(userid);
    this.data[id] = (this.data[id] || 0) + amount;
    this.saveMoneyData();
    this.logMoneyAction({ action: 'give', to: id, amount, by });
    return this.data[id];
  }

  static takeMoney(userid: string, amount: number, reason?: string, by?: string): number {
    const id = toID(userid);
    const currentMoney = this.data[id] || 0;
    if (currentMoney >= amount) {
      this.data[id] = currentMoney - amount;
      this.saveMoneyData();
      this.logMoneyAction({ action: 'take', to: id, amount, by });
      return this.data[id];
    }
    return currentMoney;
  }

  static resetAllMoney(): void {
    this.data = {};
    this.saveMoneyData();
    this.logMoneyAction({ action: 'reset', to: 'all', amount: 0 });
  }

  // Query Functions
  static getRichestUsers(limit: number = 100): [string, number][] {
    return Object.entries(this.data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  }

  static getEconomyLogs(userid?: string, page: number = 1, entriesPerPage: number = 100): EconomyLogEntry[] {
    let filteredLogs = this.logs.logs;
    if (userid) {
      const id = toID(userid);
      filteredLogs = filteredLogs.filter(log => log.to === id || log.from === id || log.by === id);
    }
    const reversedLogs = [...filteredLogs].reverse();
    const startIndex = (page - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return reversedLogs.slice(startIndex, endIndex);
  }

  static getTotalLogPages(userid?: string, entriesPerPage: number = 100): number {
    let filteredLogs = this.logs.logs;
    if (userid) {
      const id = toID(userid);
      filteredLogs = filteredLogs.filter(log => log.to === id || log.from === id || log.by === id);
    }
    return Math.ceil(filteredLogs.length / entriesPerPage) || 1;
  }
}

global.Economy = Economy;

// ================ Pages ================
export const pages: Chat.PageTable = {
  economylogs(args, user) {
    // Check permissions
    if (!user.can('globalban')) {
      return `<div class="pad"><h2>Access denied.</h2></div>`;
    }

    // Parse arguments
    const [targetUser, pageStr] = args;
    const page = parseInt(pageStr) || 1;
    const useridFilter = targetUser ? toID(targetUser) : null;

    // Get logs and page info
    const logs = Economy.getEconomyLogs(useridFilter, page);
    const totalPages = Economy.getTotalLogPages(useridFilter);
    const allLogsCount = Economy['logs'].logs.length;

    // If no logs found
    if (!logs.length) {
      return `<div class="pad">` +
        `<h2>No economy logs found${useridFilter ? ` for ${Impulse.nameColor(useridFilter, true, true)}` : ''} ` +
        `(${allLogsCount} total logs).</h2>` +
        `</div>`;
    }

    // Generate log count message
    let logCountMessage = '';
    if (useridFilter) {
      const filteredLogsCount = Economy['logs'].logs.filter(
        log => log.to === useridFilter || log.from === useridFilter || log.by === useridFilter
      ).length;
      logCountMessage = ` (${filteredLogsCount} logs for ${Impulse.nameColor(useridFilter, true, true)})`;
    } else {
      logCountMessage = ` (${allLogsCount} total logs)`;
    }

    // Generate table data
    const data = logs.map(log => {
      const timestamp = formatUTCTimestamp(new Date(log.timestamp));
      const from = log.from ? Impulse.nameColor(log.from, false, false) : '-';
      const to = Impulse.nameColor(log.to, false, false);
      const amount = `${log.amount} ${CURRENCY}`;
      const by = log.by ? Impulse.nameColor(log.by, false, false) : '-';
      return [timestamp, log.action, by, from, to, amount];
    });

    // Generate table HTML
    const title = `${useridFilter ? `Economy Logs for ${Impulse.nameColor(useridFilter, true, true)}` : 'Recent Economy Logs'}` +
      `${logCountMessage} (Page ${page} of ${totalPages})`;
    const header = ['Time (UTC)', 'Action', 'By', 'From', 'To', 'Amount'];
    const tableHTML = Impulse.generateThemedTable(title, header, data);

    // Generate pagination links
    const up = page > 1;
    const down = page < totalPages;

    // Current timestamp for refresh link
    const currentTimestamp = formatUTCTimestamp(new Date());
    
    return `<div class="pad">` +
      `<div style="float: right">` +
      `<small>Last Updated: ${currentTimestamp} UTC</small> ` +
      `<button class="button" name="send" value="/join view-economylogs-${useridFilter || ''}-${page}">` +
      `<i class="fa fa-refresh"></i> Refresh</button>` +
      `</div>` +
      `<div style="clear: both"></div>` +
      `<div class="ladder">` +
      `${tableHTML}` +
      `</div>` +
      `<br />` +
      `<div class="spacer">` +
      `<div class="buttonbar" style="text-align: center">` +
      `${up ? `<button class="button" name="send" value="/join view-economylogs-${useridFilter || ''}-${page - 1}">` +
        `<i class="fa fa-chevron-left"></i> Previous</button> ` : ''}` +
      `<button class="button" name="send" value="/join view-economylogs-${useridFilter || ''}-1">` +
        `<i class="fa fa-angle-double-left"></i> First</button> ` +
      `<span style="border: 1px solid #6688AA; padding: 2px 8px; border-radius: 4px;">` +
        `Page ${page} of ${totalPages}</span> ` +
      `<button class="button" name="send" value="/join view-economylogs-${useridFilter || ''}-${totalPages}">` +
        `Last <i class="fa fa-angle-double-right"></i></button>` +
      `${down ? ` <button class="button" name="send" value="/join view-economylogs-${useridFilter || ''}-${page + 1}">` +
        `Next <i class="fa fa-chevron-right"></i></button>` : ''}` +
      `</div>` +
      `</div>` +
      `</div>`;
  },
};

// ================ Chat Commands ================
export const commands: Chat.Commands = {
  // User Commands
  atm: 'balance',
  balance(target, room, user) {
    if (!target) target = user.name;
    if (!this.runBroadcast()) return;
    const userid = toID(target);
    const balance = Economy.readMoney(userid);
    this.sendReplyBox(`${Impulse.nameColor(userid, true, true)} has ${balance} ${CURRENCY}.`);
  },

  transfermoney(target, room, user) {
    if (!target) return this.sendReply(`Usage: /transfermoney [user], [amount], [reason]`);
    const parts = target.split(',').map(p => p.trim());
    if (parts.length < 2) return this.sendReply(`Usage: /transfermoney [user], [amount], [reason]`);

    const recipient = Users.get(parts[0]);
    const amount = parseInt(parts[1], 10);
    const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

    if (!recipient) {
      return this.errorReply(`User "${parts[0]}" not found.`);
    }
    if (recipient.id === user.id) {
      return this.errorReply(`You cannot transfer money to yourself.`);
    }
    if (isNaN(amount) || amount <= 0) {
      return this.errorReply(`Please specify a valid positive amount.`);
    }

    if (!Economy.hasMoney(user.id, amount)) {
      return this.errorReply(`You do not have enough ${CURRENCY} to transfer ${amount}.`);
    }

    Economy.takeMoney(user.id, amount, undefined, user.id);
    Economy.addMoney(recipient.id, amount, reason, user.id);
    Economy.logMoneyAction({ action: 'transfer', from: user.id, to: recipient.id, amount, by: user.id });

    this.sendReplyBox(
      `${Impulse.nameColor(user.name, true, true)} transferred ${amount} ${CURRENCY} to ` +
      `${Impulse.nameColor(recipient.name, true, true)} (${reason}). ` +
      `Your new balance is ${Economy.readMoney(user.id)} ${CURRENCY}.`
    );

    if (recipient.connected) {
      recipient.popup(
        `|html|<b>${Impulse.nameColor(user.name, true, true)}</b> transferred <b>${amount} ${CURRENCY}</b> to you.<br>` +
        `Reason: ${reason}<br>` +
        `Your new balance is ${Economy.readMoney(recipient.id)} ${CURRENCY}.`
      );
    }
  },

  richestusers(target, room, user) {
    if (!this.runBroadcast()) return;
    const richest = Economy.getRichestUsers(100);
    if (!richest.length) {
      return this.sendReplyBox(`No users have any ${CURRENCY} yet.`);
    }

    const title = `Top ${richest.length} Richest Users`;
    const header = ['Rank', 'User', 'Balance'];
    const data = richest.map(([userid, balance], index) => [
      (index + 1).toString(),
      Impulse.nameColor(userid, true, true),
      `${balance} ${CURRENCY}`,
    ]);
    const styleBy = Impulse.nameColor('TurboRx', true, true);

    const output = Impulse.generateThemedTable(title, header, data, styleBy);
    this.ImpulseReplyBox(output);
  },

  // Admin Commands
  givemoney(target, room, user) {
    this.checkCan('globalban');
    if (!target) return this.sendReply(`Usage: /givemoney [user], [amount], [reason]`);
    const parts = target.split(',').map(p => p.trim());
    if (parts.length < 2) return this.sendReply(`Usage: /givemoney [user], [amount], [reason]`);

    const targetUser = Users.get(parts[0]);
    const amount = parseInt(parts[1], 10);
    const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

    if (!targetUser) {
      return this.errorReply(`User "${parts[0]}" not found.`);
    }
    if (isNaN(amount) || amount <= 0) {
      return this.errorReply(`Please specify a valid positive amount.`);
    }

    Economy.addMoney(targetUser.id, amount, reason, user.id);
    const newBalance = Economy.readMoney(targetUser.id);

    this.sendReplyBox(
      `${Impulse.nameColor(user.name, true, true)} gave ${amount} ${CURRENCY} to ` +
      `${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
      `New balance: ${newBalance} ${CURRENCY}.`
    );

    this.modlog('GIVEMONEY', targetUser, `${amount} ${CURRENCY}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(
        `|html|You received <b>${amount} ${CURRENCY}</b> from <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
        `Reason: ${reason}<br>` +
        `Your new balance is ${newBalance} ${CURRENCY}.`
      );
    }
  },

  takemoney(target, room, user) {
    this.checkCan('globalban');
    if (!target) return this.sendReply(`Usage: /takemoney [user], [amount], [reason]`);
    const parts = target.split(',').map(p => p.trim());
    if (parts.length < 2) return this.sendReply(`Usage: /takemoney [user], [amount], [reason]`);

    const targetUser = Users.get(parts[0]);
    const amount = parseInt(parts[1], 10);
    const reason = parts.slice(2).join(',').trim() || 'No reason specified.';

    if (!targetUser) {
      return this.errorReply(`User "${parts[0]}" not found.`);
    }
    if (isNaN(amount) || amount <= 0) {
      return this.errorReply(`Please specify a valid positive amount.`);
    }

    Economy.takeMoney(targetUser.id, amount, reason, user.id);
    const newBalance = Economy.readMoney(targetUser.id);

    this.sendReplyBox(
      `${Impulse.nameColor(user.name, true, true)} took ${amount} ${CURRENCY} from ` +
      `${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ` +
      `New balance: ${newBalance} ${CURRENCY}.`
    );

    this.modlog('TAKEMONEY', targetUser, `${amount} ${CURRENCY}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(
        `|html|<b>${Impulse.nameColor(user.name, true, true)}</b> took <b>${amount} ${CURRENCY}</b> from you.<br>` +
        `Reason: ${reason}<br>` +
        `Your new balance is ${newBalance} ${CURRENCY}.`
      );
    }
  },

  resetmoney(target, room, user) {
    this.checkCan('globalban');
    if (!target) return this.sendReply(`Usage: /resetmoney [user], [reason]`);
    const parts = target.split(',').map(p => p.trim());
    const targetUser = Users.get(parts[0]);
    const reason = parts.slice(1).join(',').trim() || 'No reason specified.';

    if (!targetUser) {
      return this.errorReply(`User "${parts[0]}" not found.`);
    }

    Economy.writeMoney(targetUser.id, DEFAULT_AMOUNT);
    Economy.logMoneyAction({ action: 'reset', to: targetUser.id, amount: DEFAULT_AMOUNT, by: user.id });

    this.sendReplyBox(
      `${Impulse.nameColor(user.name, true, true)} reset ${Impulse.nameColor(targetUser.name, true, true)}'s ` +
      `balance to ${DEFAULT_AMOUNT} ${CURRENCY} (${reason}).`
    );

    this.modlog('RESETMONEY', targetUser, `${DEFAULT_AMOUNT} ${CURRENCY}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(
        `|html|Your ${CURRENCY} balance has been reset to <b>${DEFAULT_AMOUNT}</b> by ` +
        `<b>${Impulse.nameColor(user.name, true, true)}</b>.<br>` +
        `Reason: ${reason}`
      );
    }
  },

  resetmoneyall(target, room, user) {
    this.checkCan('globalban');
    const reason = target.trim() || 'No reason specified.';

    Economy.resetAllMoney();
    Economy.logMoneyAction({ action: 'reset', to: 'all', amount: DEFAULT_AMOUNT, by: user.id });

    this.sendReplyBox(
      `All user balances have been reset to ${DEFAULT_AMOUNT} ${CURRENCY} (${reason}).`
    );

    this.modlog('RESETMONEYALL', null, `all balances to ${DEFAULT_AMOUNT} ${CURRENCY}`, { by: user.id, reason });
    if (room) {
      room.add(
        `|html|<center><div class="broadcast-blue">` +
        `<b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${CURRENCY} balances to <b>${DEFAULT_AMOUNT}</b>.<br>` +
        `Reason: ${reason}` +
        `</div></center>`
      );
      room.update();
    }
  },

  economylogs(target, room, user) {
    this.checkCan('globalban');
    if (!this.runBroadcast()) return;
    
    const parts = target.split(',').map(p => p.trim());
    const targetUser = parts[0] || '';
    const page = parseInt(parts[1]) || 1;
    
    return this.parse(`/join view-economylogs-${toID(targetUser)}-${page}`);
  },

  economyhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<details><summary><b><center>Economy Commands By ${Impulse.nameColor('Prince Sky', true, true)}</center></b></summary>` +
      `<ul>` +
      `<li><code>/balance</code> (or <code>/atm</code>) - Check your or another user's ${CURRENCY} balance.</li>` +
      `<li><code>/givemoney [user], [amount], [reason]</code> - Give a specified amount of ${CURRENCY} to a user. (Requires: @ and higher)</li>` +
      `<li><code>/takemoney [user], [amount], [reason]</code> - Take a specified amount of ${CURRENCY} from a user. (Requires: @ and higher)</li>` +
      `<li><code>/transfermoney [user], [amount], [reason]</code> - Transfer a specified amount of your ${CURRENCY} to another user.</li>` +
      `<li><code>/resetmoney [user], [reason]</code> - Reset a user's ${CURRENCY} balance to ${DEFAULT_AMOUNT}. (Requires: @ and higher)</li>` +
      `<li><code>/resetmoneyall [reason]</code> - Reset all users' ${CURRENCY} balances to ${DEFAULT_AMOUNT}. (Requires: @ and higher)</li>` +
      `<li><code>/richestusers</code> - View the top 100 users with the most ${CURRENCY}.</li>` +
      `<li><code>/economylogs [user], [page]</code> - View economy logs, optionally filtered by user and page number.</li>` +
      `</ul></details>`
    );
  },
};
