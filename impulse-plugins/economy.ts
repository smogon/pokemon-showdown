/* Economy System Commands
 * Credits: Unknown
 * Updates & Typescript Conversion:
 * Prince Sky
 */

import { FS } from '../lib/fs';

const MONEY_FILE_PATH = 'impulse-db/money.json';
const MONEY_LOGS_PATH = 'impulse-db/moneylogs.json';
const DEFAULT_AMOUNT = 0;
const CURRENCY = `coins`;
Impulse.currency = CURRENCY;

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

export class Economy {
  private static data: EconomyData = Economy.loadMoneyData();
  private static logs: EconomyLogs = Economy.loadMoneyLogs();

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
    this.logs.logs.push({ timestamp: Date.now(), ...entry }); // Append to the end
    this.saveMoneyLogs();
  }

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

    // Reverse the filtered logs to show the newest first
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

export const commands: ChatCommands = {
  atm: 'balance',
  balance(target, room, user) {
    if (!target) target = user.name;
    if (!this.runBroadcast()) return;
    const userid = toID(target);
    const balance = Economy.readMoney(userid);
    this.sendReplyBox(`${Impulse.nameColor(userid, true, true)} has ${balance} ${CURRENCY}.`);
  },

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
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} gave ${amount} ${CURRENCY} to ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ${Impulse.nameColor(targetUser.name, true, true)} now has ${Economy.readMoney(targetUser.id)} ${CURRENCY}.`);
    this.modlog('GIVEMONEY', targetUser, `${amount} ${CURRENCY}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(`|html|You received <b>${amount} ${CURRENCY}</b> from <b> ${Impulse.nameColor(user.name, true, true)}</b>.<br>Reason: ${reason}`);
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
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} took ${amount} ${CURRENCY} from ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ${Impulse.nameColor(targetUser.name, true, true)} now has ${Economy.readMoney(targetUser.id)} ${CURRENCY}.`);
    this.modlog('TAKEMONEY', targetUser, `${amount} ${CURRENCY}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(`|html|<b>${Impulse.nameColor(user.name, true, true)}</b> took <b>${amount} ${CURRENCY}</b> from you.<br>Reason: ${reason}`);
    }
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
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} transferred ${amount} ${CURRENCY} to ${Impulse.nameColor(recipient.name, true, true)} (${reason}). Your new balance is ${Economy.readMoney(user.id)} ${CURRENCY}, and ${Impulse.nameColor(recipient.name, true, true)}'s new balance is ${Economy.readMoney(recipient.id)} ${CURRENCY}.`);
    if (recipient.connected) {
      recipient.popup(`|html|<b>${Impulse.nameColor(user.name, true, true)}</b> transferred <b>${amount} ${CURRENCY}</b> to you.<br>Reason: ${reason}`);
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
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} reset ${Impulse.nameColor(targetUser.name, true, true)}'s balance to ${DEFAULT_AMOUNT} ${CURRENCY} (${reason}).`);
    this.modlog('RESETMONEY', targetUser, `${DEFAULT_AMOUNT} ${CURRENCY}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(`|html|Your ${CURRENCY} balance has been reset to <b>${DEFAULT_AMOUNT}</b> by <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>Reason: ${reason}`);
    }
  },

  resetmoneyall(target, room, user) {
    this.checkCan('globalban');
    const reason = target.trim() || 'No reason specified.';

    Economy.resetAllMoney();
    Economy.logMoneyAction({ action: 'reset', to: 'all', amount: DEFAULT_AMOUNT, by: user.id });
    this.sendReplyBox(`All user balances have been reset to ${DEFAULT_AMOUNT} <span class="math-inline">\{CURRENCY\} \(</span>{reason}).`);
    this.modlog('RESETMONEYALL', null, `all balances to ${DEFAULT_AMOUNT} ${CURRENCY}`, { by: user.id, reason });
    room?.add(`|html|<center><div class="broadcast-blue"><b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${CURRENCY} balances to <b>${DEFAULT_AMOUNT}</b>.<br>Reason: ${reason}</div></center>`);
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

	economylogs(target, room, user) {
    if (!this.runBroadcast()) return;
	 this.checkCan('globalban');
    const parts = target.split(',').map(p => p.trim());
    const targetUser = parts[0] ? Users.get(parts[0]) : null;
    const page = parseInt(parts[1], 10) || 1;
    const useridFilter = targetUser?.id;

    const logs = Economy.getEconomyLogs(useridFilter, page);
    const totalPages = Economy.getTotalLogPages(useridFilter);
    const allLogsCount = Economy['logs'].logs.length;

    let logCountMessage = ``;
    if (useridFilter) {
      const filteredLogsCount = Economy['logs'].logs.filter(log => log.to === useridFilter || log.from === useridFilter || log.by === useridFilter).length;
      logCountMessage = ` (${filteredLogsCount} logs for ${Impulse.nameColor(useridFilter, true, true)})`;
    } else {
      logCountMessage = ` (${allLogsCount} total logs)`;
    }

    if (!logs.length) {
      return this.sendReplyBox(`No economy logs found${useridFilter ? ` for ${Impulse.nameColor(useridFilter, true, true)}` : ''}${logCountMessage}.`);
    }

    const title = `${useridFilter ? `Economy Logs for ${Impulse.nameColor(useridFilter, true, true)}` : 'Recent Economy Logs'} ${logCountMessage} (Page ${page} of ${totalPages})`;
    const header = ['Time', 'Action', 'By', 'From', 'To', 'Amount'];
    const data = logs.map (log => {
      const timestamp = new Date(log.timestamp).toLocaleString();
      const from = log.from ? Impulse.nameColor(log.from, false, false) : '-';
      const to = Impulse.nameColor(log.to, false, false);
      const amount = `${log.amount} ${CURRENCY}`;
      const by = log.by ? Impulse.nameColor(log.by, false, false) : '-';
      return [timestamp, log.action, by, from, to, amount];
    });

    const tableHTML = Impulse.generateThemedTable(title, header, data);
    let paginationHTML = '';

    if (totalPages > 1) {
      paginationHTML += `<div style="text-align: center; margin-top: 5px;">Page: ${page} / ${totalPages}`;
      if (page > 1) {
        paginationHTML += ` | <button name="send" value="/economylogs ${useridFilter ? ` ${targetUser.name}` : ''}, ${page - 1}">Previous</button>`;
      }
      if (page < totalPages) {
        paginationHTML += ` | <button name="send" value="/economylogs ${useridFilter ? ` ${targetUser.name}` : ''}, ${page + 1}">Next</button>`;
      }
      paginationHTML += `</div>`;
    }

    const fullOutput = `<div style="max-height: 400px; overflow: auto;" data-uhtml="${useridFilter}-${page}">${tableHTML}</div>${paginationHTML}`;
    this.ImpulseReplyBox(fullOutput);
  },

  economyhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
		 `<div><b><center>Economy Commands By ${Impulse.nameColor('Prince Sky', true, true)}</center></b>` +
		 `<ul><li><code>/balance</code> (or <code>/atm</code>) - Check your or another user's ${CURRENCY} balance.</li>` +
		 `<li><code>/givemoney [user], [amount] ,[reason]</code> - Give a specified amount of ${CURRENCY} to a user. (Requires: @ and higher).</li>` +
		 `<li><code>/takemoney [user], [amount] ,[reason]</code> - Take a specified amount of ${CURRENCY} from a user. (Requires: @ and higher).</li>` +
		 `<li><code>/transfermoney [user], [amount] , [reason]</code> - Transfer a specified amount of your ${CURRENCY} to another user.</li>` +
		 `<li><code>/resetmoney [user], [reason]</code> - Reset a user's ${CURRENCY} balance to ${DEFAULT_AMOUNT}. (Requires: @ and higher).</li>` +
		 `<li><code>/resetmoneyall [reason]</code> - Reset all users' ${CURRENCY} balances to ${DEFAULT_AMOUNT}. (Requires: @ and higher).</li>` +
		 `<li><code>/richestusers</code> - View the top 100 users with the most ${CURRENCY}.</li>` +
		 `<li><code>/economylogs [user], [page]</code> - View economy logs, optionally filtered by user and page number.</li>` +
		 `</ul></div>`);
  },
};
