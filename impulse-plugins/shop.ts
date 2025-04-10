/* Shop Commands
 * Credits: Prince Sky, Turbo Rx
 */

import { FS } from '../lib/fs';

const SHOP_FILE_PATH = 'impulse-db/shop.json';
const RECEIPTS_FILE_PATH = 'impulse-db/receipts.json';

interface ShopItem {
  name: string;
  price: number;
  description: string;
}

interface ShopData {
  items: ShopItem[];
}

interface Receipt {
  receiptId: string;
  userId: string;
  timestamp: number;
  itemName: string;
  amount: number;
}

interface ReceiptsData {
  [userId: string]: Receipt[];
}

class Shop {
  private static shopData: ShopData = Shop.loadShopData();
  private static receiptsData: ReceiptsData = Shop.loadReceiptsData();

  private static loadShopData(): ShopData {
    try {
      const rawData = FS(SHOP_FILE_PATH).readIfExistsSync();
      return rawData ? (JSON.parse(rawData) as ShopData) : { items: [] };
    } catch (error) {
      console.error(`Error reading shop data:\t${error}`);
      return { items: [] };
    }
  }

  static saveShopData(): void {
    try {
      FS(SHOP_FILE_PATH).writeUpdate(() => JSON.stringify(this.shopData, null, 2));
    } catch (error) {
      console.error(`Error saving shop data:\t${error}`);
    }
  }

  private static loadReceiptsData(): ReceiptsData {
    try {
      const rawData = FS(RECEIPTS_FILE_PATH).readIfExistsSync();
      return rawData ? (JSON.parse(rawData) as ReceiptsData) : {};
    } catch (error) {
      console.error(`Error reading receipts data:\t${error}`);
      return {};
    }
  }

  private static saveReceiptsData(): void {
    try {
      FS(RECEIPTS_FILE_PATH).writeUpdate(() => JSON.stringify(this.receiptsData, null, 2));
    } catch (error) {
      console.error(`Error saving receipts data:\t${error}`);
    }
  }

  static getShopItems(): ShopItem[] {
    return this.shopData.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  static addItem(name: string, price: number, description: string): void {
    this.shopData.items.push({ name, price, description });
    this.saveShopData();
  }

  static deleteItem(itemName: string): string {
    const initialLength = this.shopData.items.length;
    this.shopData.items = this.shopData.items.filter(item => item.name !== itemName);
    if (this.shopData.items.length < initialLength) {
      this.saveShopData();
      return `Item "${itemName}" has been removed from the shop.`;
    } else {
      return `Item "${itemName}" not found in the shop.`;
    }
  }

  static buyItem(userid: string, itemName: string): string {
    const item = this.shopData.items.find(item => item.name === itemName);
    if (!item) {
      return `Item "${itemName}" not found in the shop.`;
    }

    const userBalance = Economy.readMoney(userid);
    if (userBalance < item.price) {
      return `You do not have enough ${Impulse.currency} to buy "${itemName}".`;
    }

    Economy.takeMoney(userid, item.price, `Purchase of "${itemName}"`);

    const receiptId = Impulse.generateRandomString(10);
    const newReceipt: Receipt = {
      receiptId,
      userId: userid,
      timestamp: Date.now(),
      itemName: item.name,
      amount: item.price,
    };

    if (!this.receiptsData[userid]) {
      this.receiptsData[userid] = [];
    }
    this.receiptsData[userid].unshift(newReceipt);
    this.saveReceiptsData();

    return `You successfully purchased "${itemName}" for ${item.price} ${Impulse.currency}. Your receipt ID is: ${receiptId}`;
  }

  static getUserReceipts(userid: string): Receipt[] {
    return this.receiptsData[userid] || [];
  }

  static getAllReceipts(filterUserid?: string): Receipt[] {
    const allReceipts: Receipt[] = [];
    for (const userId in this.receiptsData) {
      if (!filterUserid || userId === filterUserid) {
        allReceipts.push(...this.receiptsData[userId]);
      }
    }
    return allReceipts.sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const commands: ChatCommands = {
  shop(target, room, user) {
    if (!this.runBroadcast()) return;
    const items = Shop.getShopItems();
    if (!items.length) {
      return this.sendReplyBox(`<b>The shop is currently empty.</b>`);
    }

    const header = ['Item', 'Description', 'Price', 'Buy'];
    const data = items.map(item => [
      item.name,
      item.description,
      item.price.toString(),
      `<button name="send" value="/buyitem ${item.name}" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Buy</button>`,
    ]);

    this.ImpulseReplyBox(Impulse.generateThemedTable('Impulse Shop', header, data));
  },

  buyitem(target, room, user) {
    if (!target) {
      return this.sendReply(`Usage: /buyitem [item name]`);
    }

    const result = Shop.buyItem(user.id, target);
    this.sendReply(result);
  },

  additem(target, room, user) {
    this.checkCan('globalban');
    const [name, priceString, ...descriptionParts] = target.split(',').map(part => part.trim());
    if (!name || !priceString || !descriptionParts.length) {
      return this.sendReply(`Usage: /additem [item name], [price], [description]`);
    }

    const price = parseInt(priceString, 10);
    if (isNaN(price) || price <= 0) {
      return this.sendReply(`Please specify a valid positive price.`);
    }

    const description = descriptionParts.join(', ');
    Shop.addItem(name, price, description);
    this.sendReplyBox(`Item "${name}" added to the shop for ${price} ${Impulse.currency}.`);
  },

  deleteitem(target, room, user) {
    this.checkCan('globalban');
    if (!target) {
      return this.sendReply(`Usage: /deleteitem [item name]`);
    }
    const result = Shop.deleteItem(target);
    this.sendReplyBox(result);
  },

  receipts(target, room, user) {
    if (!this.runBroadcast()) return;
    const userReceipts = Shop.getUserReceipts(user.id);
    if (!userReceipts.length) {
      return this.sendReplyBox(Impulse.generateThemedTable('Your Purchase Receipts', ['Receipt ID', 'Time of Purchase', 'Item Name', `Amount (${Impulse.currency})`], []));
    }

    const header = ['Receipt ID', 'Time of Purchase', 'Item Name', `Amount (${Impulse.currency})`];
    const dateFormatter = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const data = userReceipts.map(receipt => [
      receipt.receiptId,
      dateFormatter.format(receipt.timestamp),
      receipt.itemName,
      receipt.amount.toString(),
    ]);

    this.sendReplyBox(Impulse.generateThemedTable('Your Purchase Receipts', header, data));
  },

  receiptlogs(target, room, user) {
    this.checkCan('globalban');
    if (!this.runBroadcast()) return;
    const filterUserid = toID(target);
    const allReceipts = Shop.getAllReceipts(filterUserid);

    if (!allReceipts.length) {
      return this.sendReplyBox(Impulse.generateThemedTable(`Purchase Logs ${filterUserid ? `for ${filterUserid}` : ''}`, ['Receipt ID', 'User ID', 'Time of Purchase', 'Item Name', `Amount (${Impulse.currency})`], []));
    }

    const header = ['Receipt ID', 'User ID', 'Time of Purchase', 'Item Name', `Amount (${Impulse.currency})`];
    const dateFormatter = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const data = allReceipts.map(receipt => [
      receipt.receiptId,
      receipt.userId,
      dateFormatter.format(receipt.timestamp),
      receipt.itemName,
      receipt.amount.toString(),
    ]);

    this.sendReplyBox(Impulse.generateThemedTable(`Purchase Logs ${filterUserid ? `for ${filterUserid}` : ''}`, header, data));
  },

  shophelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<b><center>Shop Commands</center></b><br>` +
      `<b>User Commands</b><br>` +
      `<ul>` +
      `<li><b>/shop</b> - View available items in the shop.</li>` +
      `<li><b>/buyitem [item name]</b> - Purchase an item from the shop.</li>` +
      `<li><b>/receipts</b> - View your purchase receipts.</li>` +
      `<li><b>/shophelp</b> - Shows this help message.</li>` +
      `</ul><br>` +
      `<b>Admin Commands</b> (Requires: @ and higher)<br>` +
      `<ul>` +
        `<li><b>/additem [item name], [price], [description]</b> - Add an item to the shop.</li>` +
        `<li><b>/deleteitem [item name]</b> - Remove an item from the shop.</li>` +
        `<li><b>/receiptlogs [userid]</b> - View purchase logs, optionally filtered by [userid].</li>` +
      `</ul>`
    );
  },
};
