/* Shop Commands
* Credits: Prince Sky
*/

import { FS } from '../lib/fs';
interface ShopItem {
  name: string;
  cost: number;
  description?: string;
  itemid: string;
}

const SHOP_ITEMS: { [itemid: string]: Omit<ShopItem, 'itemid'> } = Shop.loadShopItems();

function saveShopItems(): void {
  try {
    FS('impulse-db/shop_items.json').writeUpdate(() => JSON.stringify(SHOP_ITEMS, null, 2));
  } catch (error) {
    console.error(`Error saving shop items: ${error}`);
  }
}

function loadShopItems(): { [itemid: string]: Omit<ShopItem, 'itemid'> } {
  try {
    const rawData = FS('impulse-db/shop_items.json').readIfExistsSync();
    return rawData ? (JSON.parse(rawData) as { [itemid: string]: Omit<ShopItem, 'itemid'> }) : {};
  } catch (error) {
    console.error(`Error reading shop items data: ${error}`);
    return {};
  }
}

class Shop {
  static getItem(itemid: string): ShopItem | undefined {
    const itemData = SHOP_ITEMS[itemid];
    if (itemData) {
      return { ...itemData, itemid };
    }
    return undefined;
  }

  static buyItem(userid: string, itemid: string, quantity: number = 1): string | boolean {
    const item = this.getItem(itemid);
    if (!item) {
      return `The item "${itemid}" does not exist in the shop. Use /shop to see available items.`;
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return `Please specify a valid positive integer quantity.`;
    }

    const totalCost = item.cost * quantity;
    if (!Economy.hasMoney(userid, totalCost)) {
      return `You do not have enough ${Impulse.currency} to buy ${quantity} ${item.name}(s). You need ${totalCost} ${Impulse.currency}.`;
    }

    Economy.takeMoney(userid, totalCost);
    return `You have successfully bought ${quantity} ${item.name}(s) for ${totalCost} ${Impulse.currency}.`;
  }

  static viewShop(): string {
    const title = '${Impulse.serverName} Shop';
    const header = ['Item', 'Description', 'Cost', 'Buy'];
    const sortedItems = Object.entries(SHOP_ITEMS)
      .sort(([, a], [, b]) => a.name.localeCompare(b.name)); // Sort by name (A-Z)

    const data: string[][] = [];
    for (const [itemid, item] of sortedItems) {
      data.push([
        item.name,
        item.description || '',
        `${item.cost} ${Impulse.currency}`,
        `<button name="send" value="/buy ${itemid}, 1">Buy</button>`,
      ]);
    }
    return Impulse.generateThemedTable(title, header, data);
  }

  static addItem(itemid: string, name: string, cost: number, description?: string): string {
    if (SHOP_ITEMS[itemid]) {
      return `An item with the ID "${itemid}" already exists. Use /edititem to modify it.`;
    }
    if (isNaN(cost) || cost <= 0 || !Number.isInteger(cost)) {
      return `Please specify a valid positive integer cost for the item.`;
    }
    SHOP_ITEMS[itemid] = { name, cost, description };
    saveShopItems();
    return `Item "${name}" (ID: ${itemid}) has been added to the shop for ${cost} ${Impulse.currency}.`;
  }

  static deleteItem(itemid: string): string {
    if (!SHOP_ITEMS[itemid]) {
      return `An item with the ID "${itemid}" does not exist in the shop.`;
    }
    const itemName = SHOP_ITEMS[itemid].name;
    delete SHOP_ITEMS[itemid];
    saveShopItems();
    return `Item "${itemName}" (ID: ${itemid}) has been removed from the shop.`;
  }

  static editItem(itemid: string, property: string, value: string): string {
    const item = SHOP_ITEMS[itemid];
    if (!item) {
      return `An item with the ID "${itemid}" does not exist in the shop.`;
    }

    switch (property.toLowerCase()) {
      case 'name':
        item.name = value.trim();
        break;
      case 'cost':
        const newCost = parseInt(value, 10);
        if (isNaN(newCost) || newCost <= 0 || !Number.isInteger(newCost)) {
          return `Please specify a valid positive integer cost.`;
        }
        item.cost = newCost;
        break;
      case 'description':
        item.description = value.trim();
        break;
      default:
        return `Invalid property "${property}". Available properties: name, cost, description.`;
    }
    saveShopItems();
    return `Item "${itemid}"'s ${property} has been updated to "${value}".`;
  }
}

global.Shop = Shop;

export const commands: Chat.Commands = {
  shop(target, room, user) {
    if (!this.runBroadcast()) return;
    this.ImpulseReplyBox(Shop.viewShop());
  },

  buy(target, room, user) {
    if (!target) return this.sendReply(`Usage: /buy [itemid], [quantity]`);
    const parts = target.split(',').map(p => p.trim());
    const itemid = toID(parts[0]);
    const quantity = parts[1] ? parseInt(parts[1], 10) : 1;

    const result = Shop.buyItem(user.id, itemid, quantity);
    if (typeof result === 'string') {
      return this.errorReply(result);
    }
    this.sendReply(result);
  },

  additem(target, room, user) {
    this.checkCan('globalban'); // Or a more specific permission
    if (!target) return this.sendReply(`Usage: /additem [itemid], [name], [cost] [, description]`);
    const parts = target.split(',').map(p => p.trim());
    if (parts.length < 3) return this.sendReply(`Usage: /additem [itemid], [name], [cost] [, description]`);

    const itemid = toID(parts[0]);
    const name = parts[1].trim();
    const cost = parseInt(parts[2], 10);
    const description = parts.slice(3).join(',').trim() || undefined;

    const result = Shop.addItem(itemid, name, cost, description);
    this.sendReply(result);
    this.modlog('ADDITEM', itemid, name, { by: user.id, cost: cost, description: description });
  },

  deleteitem(target, room, user) {
    this.checkCan('globalban'); // Or a more specific permission
    if (!target) return this.sendReply(`Usage: /deleteitem [itemid]`);
    const itemid = toID(target);
    const result = Shop.deleteItem(itemid);
    this.sendReply(result);
    this.modlog('DELETEITEM', itemid, { by: user.id });
  },

  edititem(target, room, user) {
    this.checkCan('globalban'); // Or a more specific permission
    if (!target) return this.sendReply(`Usage: /edititem [itemid], [property], [value]`);
    const parts = target.split(',').map(p => p.trim());
    if (parts.length !== 3) return this.sendReply(`Usage: /edititem [itemid], [property], [value]`);

    const itemid = toID(parts[0]);
    const property = parts[1].trim();
    const value = parts[2].trim();

    const result = Shop.editItem(itemid, property, value);
    this.sendReply(result);
    this.modlog('EDITITEM', itemid, `${property} to ${value}`, { by: user.id });
  },

  shophelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Shop Commands By ${Impulse.nameColor('Prince Sky', true, true)}</center></b>` +
      `<ul><li><code>/shop</code> - View the list of available items in the shop, sorted alphabetically, with buy buttons.</li>` +
      `<li><code>/buy [itemid], [quantity]</code> - Buy a specified quantity of an item from the shop using its item ID. (Default quantity is 1).</li>` +
      `</ul><br>` +
      `<b><center>Shop Management Commands (Requires: @ and higher)</center></b>` +
      `<ul><li><code>/additem [itemid], [name], [cost] [, description]</code> - Add a new item to the shop. Item ID should be unique (lowercase, no spaces). Description is optional.</li>` +
      `<li><code>/deleteitem [itemid]</code> - Remove an item from the shop using its item ID.</li>` +
      `<li><code>/edititem [itemid], [property], [value]</code> - Edit a property of an existing shop item using its item ID. Available properties: name, cost, description.</li>` +
      `</ul></div>`
    );
  },
};
