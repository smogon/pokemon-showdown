/***************************************
* Pokemon Showdown Shop System         *
* Credits: Prince Sky, Turbo Rx       *
***************************************/

import { FS } from '../lib/fs';

// ================ Configuration ================
const SHOP_FILE_PATH = 'impulse-db/shop.json';
const RECEIPTS_FILE_PATH = 'impulse-db/receipts.json';

// ================ Helper Functions ================
function formatUTCTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// ================ Interfaces ================
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

// ================ Shop Class ================
class Shop {
  private static shopData: ShopData = Shop.loadShopData();
  private static receiptsData: ReceiptsData = Shop.loadReceiptsData();

  // Data Loading & Saving Methods
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

  // Shop Item Management
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

  // Purchase & Receipts Management
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

  // Receipt Query Methods
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

export const pages: Chat.PageTable = {
  shop(args, user) {
    const items = Shop.getShopItems();
    if (!items.length) {
      return `<div class="pad"><h2>The shop is currently empty.</h2></div>`;
    }

    const header = ['Item', 'Description', 'Price', 'Buy'];
    const data = items.map(item => [
      item.name,
      item.description,
      `${item.price} ${Impulse.currency}`,
      `<button class="button" name="send" value="/buyitem ${item.name}">` +
        `<i class="fa fa-shopping-cart"></i> Buy</button>`,
    ]);

    return `<div class="pad">` +
      `<div style="float: right">` +
      `<small>Last Updated: ${formatUTCTimestamp(new Date())} UTC</small> ` +
      `<button class="button" name="send" value="/viewpage shop">` +
      `<i class="fa fa-refresh"></i> Refresh</button>` +
      `</div>` +
      `<div style="clear: both"></div>` +
      `<div class="ladder">` +
      `${Impulse.generateThemedTable('Impulse Shop', header, data)}` +
      `</div>` +
      `</div>`;
  },

  receiptlogs(args, user) {
    // Check permissions
    if (!user.can('globalban')) {
      return `<div class="pad"><h2>Access denied.</h2></div>`;
    }

    // Parse arguments
    const [targetUser, pageStr] = args;
    const page = parseInt(pageStr) || 1;
    const entriesPerPage = 50;
    const filterUserid = targetUser ? toID(targetUser) : null;

    // Get all receipts
    const allReceipts = Shop.getAllReceipts(filterUserid);
    const totalPages = Math.ceil(allReceipts.length / entriesPerPage);
    const startIndex = (page - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const receiptsToShow = allReceipts.slice(startIndex, endIndex);

    if (!allReceipts.length) {
      return `<div class="pad">` +
        `<h2>No purchase logs found${filterUserid ? ` for ${Impulse.nameColor(filterUserid, true, true)}` : ''}.</h2>` +
        `</div>`;
    }

    // Generate table data
    const header = ['Receipt ID', 'User ID', 'Time of Purchase', 'Item Name', `Amount (${Impulse.currency})`];
    const data = receiptsToShow.map(receipt => [
      receipt.receiptId,
      Impulse.nameColor(receipt.userId, true, true),
      formatUTCTimestamp(new Date(receipt.timestamp)),
      receipt.itemName,
      receipt.amount.toString(),
    ]);

    // Generate table HTML
    const title = `Purchase Logs${filterUserid ? ` for ${Impulse.nameColor(filterUserid, true, true)}` : ''} ` +
      `(Page ${page} of ${totalPages})`;
    const tableHTML = Impulse.generateThemedTable(title, header, data);

    // Generate pagination links
    const up = page > 1;
    const down = page < totalPages;

    return `<div class="pad">` +
      `<div style="float: right">` +
      `<small>Last Updated: ${formatUTCTimestamp(new Date())} UTC</small> ` +
      `<button class="button" name="send" value="/viewpage receiptlogs-${filterUserid || ''}-${page}">` +
      `<i class="fa fa-refresh"></i> Refresh</button>` +
      `</div>` +
      `<div style="clear: both"></div>` +
      `<div class="ladder">` +
      `${tableHTML}` +
      `</div>` +
      `<br />` +
      `<div class="spacer">` +
      `<div class="buttonbar" style="text-align: center">` +
      `${up ? `<button class="button" name="send" value="/viewpage receiptlogs-${filterUserid || ''}-${page - 1}">` +
        `<i class="fa fa-chevron-left"></i> Previous</button> ` : ''}` +
      `<button class="button" name="send" value="/viewpage receiptlogs-${filterUserid || ''}-1">` +
        `<i class="fa fa-angle-double-left"></i> First</button> ` +
      `<span style="border: 1px solid #6688AA; padding: 2px 8px; border-radius: 4px;">` +
        `Page ${page} of ${totalPages}</span> ` +
      `<button class="button" name="send" value="/viewpage receiptlogs-${filterUserid || ''}-${totalPages}">` +
        `Last <i class="fa fa-angle-double-right"></i></button>` +
      `${down ? ` <button class="button" name="send" value="/viewpage receiptlogs-${filterUserid || ''}-${page + 1}">` +
        `Next <i class="fa fa-chevron-right"></i></button>` : ''}` +
      `</div>` +
      `</div>` +
      `</div>`;
  },
};

// ================ Chat Commands ================
export const commands: ChatCommands = {
	shop(target, room, user) {
    if (!this.runBroadcast()) return;
    return this.parse(`/viewpage shop`);
  },

  buyitem(target, room, user) {
    if (!target) {
      return this.sendReply(`Usage: /buyitem [item name]`);
    }

    const result = Shop.buyItem(user.id, target);
    this.sendReply(result);

    // Refresh shop room if purchase was successful
    if (result.includes('successfully purchased')) {
      const shopRoom = Rooms.get('shop');
      if (shopRoom) {
        const pageContent = pages.shop([], user);
        if (typeof pageContent === 'string') {
          shopRoom.add(`|uhtmlchange|shop|${pageContent}`);
          shopRoom.add(`|uhtml|shop|${pageContent}`);
          shopRoom.update();
        }
      }
    }
  },

  receipts(target, room, user) {
    if (!this.runBroadcast()) return;
    const userReceipts = Shop.getUserReceipts(user.id);
    if (!userReceipts.length) {
      return this.sendReplyBox(
        Impulse.generateThemedTable(
          'Your Purchase Receipts',
          ['Receipt ID', 'Time of Purchase', 'Item Name', `Amount (${Impulse.currency})`],
          []
        )
      );
    }

    const header = ['Receipt ID', 'Time of Purchase', 'Item Name', `Amount (${Impulse.currency})`];
    const data = userReceipts.map(receipt => [
      receipt.receiptId,
      formatUTCTimestamp(new Date(receipt.timestamp)),
      receipt.itemName,
      receipt.amount.toString(),
    ]);

    const tableHTML = Impulse.generateThemedTable('Your Purchase Receipts', header, data);
    this.ImpulseReplyBox(`<div style="max-height: 400px; overflow-y: auto;">${tableHTML}</div>`);
  },

  // Admin Commands
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
    this.sendReply(`Item "${name}" added to the shop for ${price} ${Impulse.currency}.`);

    // Refresh shop room
    const shopRoom = Rooms.get('shop');
    if (shopRoom) {
      const pageContent = pages.shop([], user);
      if (typeof pageContent === 'string') {
        shopRoom.add(`|uhtmlchange|shop|${pageContent}`);
        shopRoom.add(`|uhtml|shop|${pageContent}`);
        shopRoom.update();
      }
    }
  },

  deleteitem(target, room, user) {
    this.checkCan('globalban');
    if (!target) {
      return this.sendReply(`Usage: /deleteitem [item name]`);
    }
    const result = Shop.deleteItem(target);
    this.sendReply(result);

    // Refresh shop room
    const shopRoom = Rooms.get('shop');
    if (shopRoom) {
      const pageContent = pages.shop([], user);
      if (typeof pageContent === 'string') {
        shopRoom.add(`|uhtmlchange|shop|${pageContent}`);
        shopRoom.add(`|uhtml|shop|${pageContent}`);
        shopRoom.update();
      }
    }
  },

	receiptlogs(target, room, user) {
    this.checkCan('globalban');
    if (!this.runBroadcast()) return;
    
    const parts = target.split(',').map(p => p.trim());
    const targetUser = parts[0] || '';
    const page = parseInt(parts[1]) || 1;
    
    return this.parse(`/viewpage receiptlogs-${toID(targetUser)}-${page}`);
  },

  // Help Command
  shophelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<details><summary><b><center>Shop Commands By ${Impulse.nameColor('Prince Sky', true, true)}</center></b></summary>` +
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
      `</ul></details>`
    );
  },
};
