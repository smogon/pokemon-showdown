/* Economy System Commands
 * Credits: Unknown
 * Updates & Typescript Conversion:
 * Prince Sky
 */

import { FS } from '../lib/fs';

const MONEY_FILE_PATH = 'impulse-db/money.json';
const DEFAULT_AMOUNT = 0;
const CURRENCY = `coins`;
Impulse.currency = CURRENCY;

interface EconomyData {
  [userid: string]: number;
}

export class Economy {
  private static data: EconomyData = Economy.loadMoneyData();

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

  static addMoney(userid: string, amount: number): number {
    const id = toID(userid);
    this.data[id] = (this.data[id] || 0) + amount;
    this.saveMoneyData();
    return this.data[id];
  }

  static takeMoney(userid: string, amount: number): number {
    const id = toID(userid);
    const currentMoney = this.data[id] || 0;
    if (currentMoney >= amount) {
      this.data[id] = currentMoney - amount;
      this.saveMoneyData();
      return this.data[id];
    }
    return currentMoney;
  }

 static resetAllMoney(): void {
    this.data = {};
    this.saveMoneyData();
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

    Economy.addMoney(targetUser.id, amount);
    this.sendReplyBox(`${Impulse.nameColor(user.name, true, true)} gave ${amount} ${CURRENCY} to ${Impulse.nameColor(targetUser.name, true, true)} (${reason}). ${Impulse.nameColor(targetUser.name, true, true)} now has ${Economy.readMoney(targetUser.id)} ${CURRENCY}.`);
    this.modlog('GIVEMONEY', targetUser, `${amount} ${CURRENCY}`, { by: user.id, reason });
    if (targetUser.connected) {
      targetUser.popup(`|html|You received <b>${amount} ${CURRENCY}</b> from <b>${Impulse.nameColor(user.name, true, true)}</b>.<br>Reason: ${reason}`);
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

    Economy.takeMoney(targetUser.id, amount);
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

    Economy.takeMoney(user.id, amount);
    Economy.addMoney(recipient.id, amount);
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
    this.sendReplyBox(`All user balances have been reset to ${DEFAULT_AMOUNT} ${CURRENCY} (${reason}).`);
    this.modlog('RESETMONEYALL', null, `all balances to ${DEFAULT_AMOUNT} ${CURRENCY}`, { by: user.id, reason });
    room?.add(`|html|<center><div class="broadcast-blue"><b>${Impulse.nameColor(user.name, true, true)}</b> has reset all ${CURRENCY} balances to <b>${DEFAULT_AMOUNT}</b>.<br>Reason: ${reason}</div></center>`);
  },

  economyhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<b>Economy System Commands:</b><br>` +
      `/balance (or /atm) - Check your or another user's ${CURRENCY} balance.<br>` +
      `/givemoney [user], [amount] [, reason] - Give a specified amount of ${CURRENCY} to a user. ( Requires: @ and higher ).<br>` +
      `/takemoney [user], [amount] [, reason] - Take a specified amount of ${CURRENCY} from a user. ( Requires: @ and higher ).<br>` +
      `/transfermoney [user], [amount] [, reason] - Transfer a specified amount of your ${CURRENCY} to another user.<br>` +
      `/resetmoney [user] [, reason] - Reset a user's ${CURRENCY} balance to ${DEFAULT_AMOUNT}. ( Requires: @ and higher ).<br>` +
      `/resetmoneyall [, reason] - Reset all users' ${CURRENCY} balances to ${DEFAULT_AMOUNT}. ( Requires: @ and higher ).`
    );
  },
};
