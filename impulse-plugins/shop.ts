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
const SHOP_LOGS_FILE_PATH = 'impulse-logs/shop_transactions.log';

const CURRENCY = Impulse.currency;

interface ShopLogEntry {
    timestamp: number;
    action: string; // e.g., 'buy'
    user: string; // User ID
    itemName: string;
    price: number;
    currency: string;
    // Add other relevant details you want to log
}
 
interface ShopLogs {
    logs: ShopLogEntry[];
}
 
// Helper function to parse a single log line (adjust based on your logging format)
function parseShopLogLine(line: string): ShopLogEntry | null {
    try {
        const parts = line.split(' - '); // Adjust the delimiter if your log format is different
        if (parts.length >= 2) {
            const timestampPart = parts[0];
            const dataPart = parts[1];
            const dataRegex = /User: ([^ ]+) \(([^)]+)\) bought "([^"]+)" for (\d+) ([^ ]+)/; // Adjust regex to match your log format
            const match = dataRegex.exec(dataPart);
            if (match) {
                return {
                    timestamp: new Date(timestampPart).getTime(),
                    action: 'buy', // Assuming your log indicates a 'buy' action
                    user: match[1], // User ID
                    itemName: match[3],
                    price: parseInt(match[4], 10),
                    currency: match[5],
                };
            }
        }
        return null;
    } catch (error) {
        console.error(`Error parsing shop log line: ${line}`, error);
        return null;
    }
}
 
function loadShopLogs(): ShopLogs {
    try {
        if (!FS(SHOP_LOGS_FILE_PATH).existsSync()) {
            return { logs: [] };
        }
        const rawLogs = FS(SHOP_LOGS_FILE_PATH).readIfExistsSync();
        if (!rawLogs) {
            return { logs: [] };
        }
        const logLines = rawLogs.split('\n').filter(line => line.trim() !== '');
        const parsedLogs = logLines.map(parseShopLogLine).filter((log): log is ShopLogEntry => log !== null);
        return { logs: parsedLogs };
    } catch (error) {
        console.error(`Error loading shop logs: ${error}`);
        return { logs: [] };
    }
}

export class Shop {
    private static items: ShopData = Shop.loadShopData();

    private static loadShopData(): ShopData {
        try {
            const rawData = FS(SHOP_FILE_PATH).readIfExistsSync();
            const parsedData = rawData ? JSON.parse(rawData) : {};
            return parsedData || {};
        } catch (error) {
            console.error(`Error reading or parsing shop data: ${error}`);
            try {
                if (!FS(SHOP_FILE_PATH).existsSync()) {
                   FS(SHOP_FILE_PATH).safeWriteSync('{}');
                }
            } catch (writeError) {
                console.error(`Failed to create shop data file after read error: ${writeError}`);
            }
            return {};
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
            return this.ImpulseReplyBox(`The shop is currently empty. Items can be added by administrators.`);
        }

        const title = `${Impulse.serverName} Shop`;
        const header = ['Item', 'Description', 'Price', 'Buy'];
        const data = items.map(item => {
            const buyButton = `<button class="button" name="send" value="/buyitem ${item.name}">Buy</button>`;
            return [
                Chat.escapeHTML(item.name),
                Chat.escapeHTML(item.description),
                `${item.price} ${CURRENCY}`,
                buyButton
            ];
        });

        const output = Impulse.generateThemedTable(title, header, data);
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
            this.sendReply(`Item "${Chat.escapeHTML(name)}" has been added to the shop for ${price} ${CURRENCY}.`);
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
            this.sendReply(`Item "${Chat.escapeHTML(item.name)}" has been removed from the shop.`);
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

        const userBalance = Economy.readMoney(user.id);
        if (userBalance < item.price) {
             return this.errorReply(`You don't have enough ${CURRENCY} to buy "${Chat.escapeHTML(item.name)}". You need ${item.price} ${CURRENCY}, but you only have ${userBalance} ${CURRENCY}.`);
        }

        const newBalance = Economy.takeMoney(user.id, item.price, `Bought item: ${item.name}`, user.id, item.name);

        if (newBalance !== undefined && newBalance === userBalance - item.price) {
            this.sendReply(`You have successfully purchased "${Chat.escapeHTML(item.name)}" for ${item.price} ${CURRENCY}. Your new balance is ${newBalance} ${CURRENCY}.`);

        } else {
            this.errorReply(`There was an error processing your purchase for "${Chat.escapeHTML(item.name)}". Your balance has not been changed. Please contact staff if this issue persists.`);
             console.error(`Purchase failed for ${user.id} buying ${item.id}. Economy.takeMoney returned: ${newBalance}, expected ${userBalance - item.price}.`);
        }
    },

	shoplogs: function (target, room, user) {
        this.checkCan('globalban'); // Adjust permission as needed
 
        const parts = target.split(',').map(p => p.trim());
        const targetUser = parts[0] ? Users.get(parts[0]) : null;
        const page = parseInt(parts[1], 10) || 1;
        const useridFilter = targetUser?.id;
        const entriesPerPage = 10; // You can adjust this
 
        const allShopLogs = loadShopLogs().logs;
        let filteredLogs = allShopLogs;
 
        if (useridFilter) {
            filteredLogs = filteredLogs.filter(log => log.user === useridFilter);
        }
 
        // Sort by timestamp, newest first
        filteredLogs.sort((a, b) => b.timestamp - a.timestamp);
 
        const startIndex = (page - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredLogs.length / entriesPerPage) || 1;
 
        if (!paginatedLogs.length) {
            return this.sendReplyBox(`No shop logs found${useridFilter ? ` for ${Impulse.nameColor(useridFilter, true, true)}` : ''}.`);
        }
 
        const title = `${useridFilter ? `Shop Logs for ${Impulse.nameColor(useridFilter, true, true)}` : 'Recent Shop Logs'} (Page ${page} of ${totalPages})`;
        const header = ['Time', 'User', 'Item', 'Price'];
        const data = paginatedLogs.map(log => {
            const timestamp = new Date(log.timestamp).toLocaleString();
            const userName = Impulse.nameColor(log.user, false, false);
            return [timestamp, userName, Chat.escapeHTML(log.itemName), `${log.price} ${log.currency}`];
        });
 
        const tableHTML = Impulse.generateThemedTable(title, header, data);
        let paginationHTML = '';
 
        if (totalPages > 1) {
            paginationHTML += `<div style="text-align: center; margin-top: 5px;">Page: ${page} / ${totalPages}`;
            if (page > 1) {
                paginationHTML += ` | <button name="send" value="/shoplogs ${useridFilter ? ` ${targetUser.name}` : ''}, ${page - 1}">Previous</button>`;
            }
            if (page < totalPages) {
                paginationHTML += ` | <button name="send" value="/shoplogs ${useridFilter ? ` ${targetUser.name}` : ''}, ${page + 1}">Next</button>`;
            }
            paginationHTML += `</div>`;
        }
 
        const fullOutput = `<div style="max-height: 400px; overflow: auto;" data-uhtml="shoplogs-${useridFilter}-${page}">${tableHTML}</div>${paginationHTML}`;
        this.sendReplyBox(fullOutput);
    },
    shoplogshelp: [
        `/shoplogs [user], [page] - View shop transaction logs, optionally filtered by user and page number. Requires # or higher permission.`,
    ],

     shophelp(target, room, user) {
        if (!this.runBroadcast()) return;
        this.sendReplyBox(
         `<div><b><center>Shop Commands</center></b>` +
         `<details open><summary><b>User Commands</b></summary>` +
         `<ul><li><code>/shop</code> (or <code>/viewshop</code>) - View available items in the shop.</li>` +
         `<li><code>/buyitem [item name]</code> - Purchase an item from the shop.</li>` +
         `<li><code>/shophelp</code> - Shows this help message.</li>` +
         `<li><code>/economyhelp</code> - Shows commands related to ${CURRENCY} balance and transfers.</li>`+
         `</ul></details>` +
         `<details><summary><b>Admin Shop Commands</b> (Requires: @ and higher )</summary>` +
         `<ul><li><code>/additem [item name], [price], [description]</code> - Add an item to the shop.</li>` +
         `<li><code>/deleteitem [item name]</code> (or <code>/removeitem</code>) - Remove an item from the shop.</li>` +
			`<li><code>/shoplogs [user], [page]</code> - View shop transaction logs.</li>` +
         `</ul></details></div>`);
    },
};
