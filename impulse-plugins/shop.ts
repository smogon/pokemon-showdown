import { FS } from '../lib/fs';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface ShopData {
    [itemId: string]: ShopItem;
}

const SHOP_FILE_PATH = 'impulse-db/shop.json';
// Relies solely on Impulse.currency being defined globally
const CURRENCY = Impulse.currency;

export class Shop {
    private static items: ShopData = Shop.loadShopData();

    private static loadShopData(): ShopData {
        try {
            const rawData = FS(SHOP_FILE_PATH).readIfExistsSync();
            // Added safety check for null/empty data after parsing
            const parsedData = rawData ? JSON.parse(rawData) : {};
            return parsedData || {};
        } catch (error) {
            console.error(`Error reading or parsing shop data: ${error}`);
            try {
                // Ensure the file exists even after an error reading/parsing
                if (!FS(SHOP_FILE_PATH).existsSync()) {
                   FS(SHOP_FILE_PATH).safeWriteSync('{}');
                }
            } catch (writeError) {
                console.error(`Failed to create shop data file after read error: ${writeError}`);
            }
            return {}; // Return empty object on error
        }
    }


    private static saveShopData(): void {
        try {
            FS(SHOP_FILE_PATH).safeWriteUpdate(() => JSON.stringify(this.items, null, 2));
        } catch (error) {
            console.error(`Error saving shop data: ${error}`);
        }
    }

    static addItem(item: ShopItem): boolean {
        const itemId = item.id;
        if (this.items[itemId]) {
            return false;
        }
        this.items[itemId] = item;
        this.saveShopData();
        return true;
    }

    static deleteItem(itemId: string): boolean {
        const id = toID(itemId);
        if (!this.items[id]) {
            return false;
        }
        delete this.items[id];
        this.saveShopData();
        return true;
    }

    static getItem(itemId: string): ShopItem | undefined {
        return this.items[toID(itemId)];
    }

    static getAllItems(): ShopItem[] {
        return Object.values(this.items).sort((a, b) => a.name.localeCompare(b.name));
    }
}

export const commands: ChatCommands = {
    shop: 'viewshop',
    viewshop(target, room, user) {
        if (!this.runBroadcast()) return;
        const items = Shop.getAllItems();

        if (!items.length) {
            // Use ImpulseReplyBox directly, assuming it exists
            return this.ImpulseReplyBox(`The shop is currently empty. Items can be added by administrators.`);
        }

        const title = `Available Shop Items`;
        const header = ['Item Name', 'Description', 'Price', 'Buy'];
        const data = items.map(item => {
            const buyButton = `<button class="button" name="send" value="/buyitem ${item.name}">Buy</button>`;
            return [
                Chat.escapeHTML(item.name),
                Chat.escapeHTML(item.description),
                `${item.price} ${CURRENCY}`, // Assumes CURRENCY is defined
                buyButton
            ];
        });

        const styleBy = Impulse.nameColor('Your Server Name', true, true);

        // Assumes Impulse.generateThemedTable exists
        const output = Impulse.generateThemedTable(title, header, data, styleBy);
        // Use ImpulseReplyBox directly, assuming it exists
        this.ImpulseReplyBox(output);
    },

    additem(target, room, user) {
        this.checkCan('globalban');
        if (!target) return this.sendReply(`Usage: /additem [item name], [price], [description]`);

        const parts = target.split(',').map(p => p.trim());
        if (parts.length < 3) return this.sendReply(`Usage: /additem [item name], [price], [description]. Ensure commas separate the parts.`);

        const name = parts[0];
        const price = parseInt(parts[1], 10);
        const description = parts.slice(2).join(',').trim();

        if (!name) {
            return this.errorReply(`Item name cannot be empty.`);
        }
        if (isNaN(price) || price <= 0) {
            return this.errorReply(`Please specify a valid positive number for the price.`);
        }
        if (!description) {
            return this.errorReply(`Please provide a description for the item.`);
        }
        if (name.length > 50) return this.errorReply("Item name is too long (max 50 characters).");
        if (description.length > 200) return this.errorReply("Item description is too long (max 200 characters).");

        const newItem: ShopItem = {
            id: toID(name),
            name: name,
            price: price,
            description: description,
        };

        if (Shop.addItem(newItem)) {
             // Use ImpulseReplyBox directly, assuming it exists
            this.ImpulseReplyBox(`Item "${Chat.escapeHTML(name)}" has been added to the shop for ${price} ${CURRENCY}.`);
            this.modlog('ADDSHOPITEM', null, `"${Chat.escapeHTML(name)}" (Price: ${price} ${CURRENCY})`, { by: user.id });
        } else {
            this.errorReply(`An item with the name/ID "${Chat.escapeHTML(name)}" already exists. Use a different name or delete the existing item first.`);
        }
    },

    deleteitem: 'removeitem',
    removeitem(target, room, user) {
        this.checkCan('globalban');
        if (!target) return this.sendReply(`Usage: /deleteitem [item name]`);

        const itemId = toID(target);
        const item = Shop.getItem(itemId);

        if (!item) {
            return this.errorReply(`Item "${Chat.escapeHTML(target)}" not found in the shop.`);
        }

        if (Shop.deleteItem(itemId)) {
             // Use ImpulseReplyBox directly, assuming it exists
            this.ImpulseReplyBox(`Item "${Chat.escapeHTML(item.name)}" has been removed from the shop.`);
            this.modlog('REMOVESHOPITEM', null, `"${Chat.escapeHTML(item.name)}" (ID: ${itemId})`, { by: user.id });
        } else {
            this.errorReply(`Failed to remove item "${Chat.escapeHTML(target)}". It might have been deleted by someone else.`);
        }
    },

    buyitem(target, room, user) {
        if (!target) return this.sendReply(`Usage: /buyitem [item name]`);
        const itemId = toID(target);
        const item = Shop.getItem(itemId);

        if (!item) {
            return this.errorReply(`Item "${Chat.escapeHTML(target)}" not found in the shop. Check the spelling or use /shop to see available items.`);
        }

        // Assumes Economy object and methods are globally available
        const userBalance = Economy.readMoney(user.id);
        if (userBalance < item.price) {
             return this.errorReply(`You don't have enough ${CURRENCY} to buy "${Chat.escapeHTML(item.name)}". You need ${item.price} ${CURRENCY}, but you only have ${userBalance} ${CURRENCY}.`);
        }

        const newBalance = Economy.takeMoney(user.id, item.price, `Bought item: ${item.name}`, user.id, item.name);

        if (newBalance !== undefined && newBalance === userBalance - item.price) {
             // Use ImpulseReplyBox directly, assuming it exists
            this.ImpulseReplyBox(`You have successfully purchased "${Chat.escapeHTML(item.name)}" for ${item.price} ${CURRENCY}. Your new balance is ${newBalance} ${CURRENCY}.`);

            // Add item effect logic here based on item.id or item.name

        } else {
            this.errorReply(`There was an error processing your purchase for "${Chat.escapeHTML(item.name)}". Your balance has not been changed. Please contact staff if this issue persists.`);
             console.error(`Purchase failed for ${user.id} buying ${item.id}. Economy.takeMoney returned: ${newBalance}, expected ${userBalance - item.price}.`);
        }
    },

     shophelp(target, room, user) {
        if (!this.runBroadcast()) return;

        // Use ImpulseReplyBox directly, assuming it exists
        this.ImpulseReplyBox(
         `<div><b><center>Shop Commands</center></b>` +
         `<details open><summary><b>User Commands</b></summary>` +
         `<ul><li><code>/shop</code> (or <code>/viewshop</code>) - View available items in the shop.</li>` +
         `<li><code>/buyitem [item name]</code> - Purchase an item from the shop.</li>` +
         `<li><code>/shophelp</code> - Shows this help message.</li>` +
         `<li><code>/economyhelp</code> - Shows commands related to ${CURRENCY} balance and transfers.</li>`+
         `</ul></details>` +
         `<details><summary><b>Admin Shop Commands</b> (Requires: Server Administrator access)</summary>` +
         `<ul><li><code>/additem [item name], [price], [description]</code> - Add an item to the shop.</li>` +
         `<li><code>/deleteitem [item name]</code> (or <code>/removeitem</code>) - Remove an item from the shop.</li>` +
         `</ul></details></div>`);
    },
};
