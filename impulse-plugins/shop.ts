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

interface ShopLogEntry {
    timestamp: number;
    action: 'add' | 'delete' | 'save' | 'buy';
    userid: string;
    ip?: string;
    itemId?: string;
    itemName?: string;
    price?: number;
    description?: string;
    details?: string;
}

interface ShopLogs {
    logs: ShopLogEntry[];
}


const SHOP_FILE_PATH = 'impulse-db/shop.json';
const SHOP_LOGS_FILE_PATH = 'impulse-db/shoplogs.json';
const CURRENCY = Impulse.currency;
const MAX_SHOP_LOG_SIZE = 5000;


export class Shop {
    // --- Eager Loading: Load data immediately when module loads/reloads ---
    private static items: ShopData = Shop.loadShopData();
    private static logs: ShopLogs = Shop.loadShopLogs();
    // --- End Eager Loading ---

    // Removed ensureDataLoaded and ensureLogsLoaded as they are no longer needed

    // loadShopData now just performs the load, doesn't need complex return handling for null state
    private static loadShopData(): ShopData {
        try {
            const rawData = FS(SHOP_FILE_PATH).readIfExistsSync();
            const parsedData = rawData ? JSON.parse(rawData) : {};
            // Basic validation: ensure it's an object
            return (typeof parsedData === 'object' && parsedData !== null && !Array.isArray(parsedData)) ? parsedData : {};
        } catch (error) {
            console.error(`Error reading or parsing shop data: ${error}`);
            try {
                // Attempt to create file only if it doesn't exist after error
                if (!FS(SHOP_FILE_PATH).existsSync()) {
                   FS(SHOP_FILE_PATH).safeWriteSync('{}');
                   console.log(`Created empty shop data file at ${SHOP_FILE_PATH}`);
                   return {}; // Return empty object if we just created the file
                }
            } catch (writeError) {
                console.error(`Failed to create shop data file after read error: ${writeError}`);
            }
             // If file exists but is corrupt/unreadable, return empty object to prevent crash,
             // but log the error. Data loss might occur on next save if corruption wasn't fixed.
            console.error(`Returning empty shop data due to load error. File might be corrupt: ${SHOP_FILE_PATH}`);
            return {};
        }
    }

    // loadShopLogs now just performs the load
    private static loadShopLogs(): ShopLogs {
        try {
            const rawData = FS(SHOP_LOGS_FILE_PATH).readIfExistsSync();
            const parsedData = rawData ? JSON.parse(rawData) : { logs: [] };
            // Basic validation: ensure it has a 'logs' array
            return (parsedData && Array.isArray(parsedData.logs)) ? parsedData : { logs: [] };
        } catch (error) {
            console.error(`Error reading or parsing shop logs: ${error}`);
             try {
                 // Attempt to create file only if it doesn't exist after error
                if (!FS(SHOP_LOGS_FILE_PATH).existsSync()) {
                   FS(SHOP_LOGS_FILE_PATH).safeWriteSync('{"logs":[]}');
                    console.log(`Created empty shop log file at ${SHOP_LOGS_FILE_PATH}`);
                   return { logs: [] }; // Return empty if we just created it
                }
            } catch (writeError) {
                console.error(`Failed to create shop log file after read error: ${writeError}`);
            }
            console.error(`Returning empty shop logs due to load error. File might be corrupt: ${SHOP_LOGS_FILE_PATH}`);
            return { logs: [] };
        }
    }

    // Save methods no longer need ensureDataLoaded/ensureLogsLoaded
    static saveShopData(): void {
        try {
            // Directly stringify the current items object
            FS(SHOP_FILE_PATH).safeWriteUpdate(() => JSON.stringify(this.items, null, 2));
        } catch (error) {
            console.error(`Error saving shop data: ${error}`);
        }
    }

    private static saveShopLogs(): void {
        try {
             // Directly stringify the current logs object
            FS(SHOP_LOGS_FILE_PATH).safeWriteUpdate(() => JSON.stringify(this.logs, null, 2));
        } catch (error) {
            console.error(`Error saving shop logs: ${error}`);
        }
    }

    // logShopAction no longer needs ensureLogsLoaded, directly accesses this.logs
    static logShopAction(entry: Omit<ShopLogEntry, 'timestamp'>): void {
        if (this.logs.logs.length > MAX_SHOP_LOG_SIZE) {
            this.logs.logs = this.logs.logs.slice(this.logs.logs.length - MAX_SHOP_LOG_SIZE);
        }
        this.logs.logs.push({ timestamp: Date.now(), ...entry });
        this.saveShopLogs(); // Save after adding
    }

    // Log retrieval no longer needs ensureLogsLoaded
    static getShopLogs(page: number = 1, entriesPerPage: number = 100): ShopLogEntry[] {
        const reversedLogs = [...this.logs.logs].reverse(); // Access this.logs directly
        const startIndex = (page - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        return reversedLogs.slice(startIndex, endIndex);
    }

    static getTotalShopLogPages(entriesPerPage: number = 100): number {
        return Math.ceil(this.logs.logs.length / entriesPerPage) || 1; // Access this.logs directly
    }

    // Item methods no longer need ensureDataLoaded
    static addItem(item: ShopItem): boolean {
        const itemId = item.id;
        if (this.items[itemId]) { // Access this.items directly
            return false;
        }
        this.items[itemId] = item; // Access this.items directly
        this.saveShopData();
        return true;
    }

    static deleteItem(itemId: string): boolean {
        const id = toID(itemId);
        if (!this.items[id]) { // Access this.items directly
            return false;
        }
        delete this.items[id]; // Access this.items directly
        this.saveShopData();
        return true;
    }

    static getItem(itemId: string): ShopItem | undefined {
        return this.items[toID(itemId)]; // Access this.items directly
    }

    static getAllItems(): ShopItem[] {
        // Access this.items directly
        return Object.values(this.items).sort((a, b) => a.name.localeCompare(b.name));
    }
}


// --- Commands Section (No changes needed here) ---
export const commands: ChatCommands = {
    shop: 'viewshop',
    viewshop(target, room, user) {
        if (!this.runBroadcast()) return;
        const items = Shop.getAllItems(); // Will use already loaded data

        if (!items.length) {
            return this.ImpulseReplyBox(`The shop is currently empty. Items can be added by administrators.`);
        }

        const title = `Available Shop Items`;
        const header = ['Item Name', 'Description', 'Price', 'Buy'];
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

        if (!name) return this.errorReply(`Item name cannot be empty.`);
        if (isNaN(price) || price <= 0) return this.errorReply(`Please specify a valid positive number for the price.`);
        if (!description) return this.errorReply(`Please provide a description for the item.`);
        if (name.length > 50) return this.errorReply("Item name is too long (max 50 characters).");
        if (description.length > 200) return this.errorReply("Item description is too long (max 200 characters).");

        const newItem: ShopItem = { id: toID(name), name, price, description };

        if (Shop.addItem(newItem)) { // Uses already loaded data
            this.ImpulseReplyBox(`Item "${Chat.escapeHTML(name)}" has been added to the shop for ${price} ${CURRENCY}.`);
            this.modlog('ADDSHOPITEM', null, `"${Chat.escapeHTML(name)}" (Price: ${price} ${CURRENCY})`, { by: user.id });
            Shop.logShopAction({ // Uses already loaded logs
                action: 'add',
                userid: user.id,
                ip: user.latestIp,
                itemId: newItem.id,
                itemName: newItem.name,
                price: newItem.price,
                description: newItem.description,
            });
        } else {
            this.errorReply(`An item with the name/ID "${Chat.escapeHTML(name)}" already exists. Use a different name or delete the existing item first.`);
        }
    },

    deleteitem: 'removeitem',
    removeitem(target, room, user) {
        this.checkCan('globalban');
        if (!target) return this.sendReply(`Usage: /deleteitem [item name]`);

        const itemId = toID(target);
        const item = Shop.getItem(itemId); // Uses already loaded data

        if (!item) {
            return this.errorReply(`Item "${Chat.escapeHTML(target)}" not found in the shop.`);
        }

        if (Shop.deleteItem(itemId)) { // Uses already loaded data
            this.ImpulseReplyBox(`Item "${Chat.escapeHTML(item.name)}" has been removed from the shop.`);
            this.modlog('REMOVESHOPITEM', null, `"${Chat.escapeHTML(item.name)}" (ID: ${itemId})`, { by: user.id });
            Shop.logShopAction({ // Uses already loaded logs
                action: 'delete',
                userid: user.id,
                ip: user.latestIp,
                itemId: item.id,
                itemName: item.name,
            });
        } else {
            this.errorReply(`Failed to remove item "${Chat.escapeHTML(target)}". It might have already been deleted.`);
        }
    },

    buyitem(target, room, user) {
        if (!target) return this.sendReply(`Usage: /buyitem [item name]`);
        const itemId = toID(target);
        const item = Shop.getItem(itemId); // Uses already loaded data

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

            Shop.logShopAction({ // Uses already loaded logs
                action: 'buy',
                userid: user.id,
                ip: user.latestIp,
                itemId: item.id,
                itemName: item.name,
                price: item.price,
            });

        } else {
            this.errorReply(`There was an error processing your purchase for "${Chat.escapeHTML(item.name)}". Your balance has not been changed. Please contact staff if this issue persists.`);
             console.error(`Purchase failed for ${user.id} buying ${item.id}. Economy.takeMoney returned: ${newBalance}, expected ${userBalance - item.price}.`);
        }
    },

    shopsave(target, room, user) {
        this.checkCan('globalban');
        try {
            Shop.saveShopData(); // Uses already loaded data
            this.sendReply("Shop item data saved successfully.");
            this.modlog('SHOPSAVE', null, `manually saved shop item data`, { by: user.id });
            Shop.logShopAction({ // Uses already loaded logs
                action: 'save',
                userid: user.id,
                ip: user.latestIp,
                details: 'Manually triggered shop item save',
            });
        } catch (e) {
            this.errorReply(`Failed to save shop item data. Check console for errors.`);
            console.error(`Error during /shopsave: ${e}`);
        }
    },


    shoplogs(target, room, user) {
        this.checkCan('globalban');

        const page = parseInt(target) || 1;
        const entriesPerPage = 50;

        const logs = Shop.getShopLogs(page, entriesPerPage); // Uses already loaded logs
        const totalPages = Shop.getTotalShopLogPages(entriesPerPage); // Uses already loaded logs
        const totalLogCount = Shop['logs'].logs.length; // Access directly


        if (!logs.length && page === 1) {
            return this.ImpulseReplyBox(`No shop logs found.`);
        } else if (!logs.length) {
             return this.errorReply(`Invalid page number. Page ${page} does not exist (Total pages: ${totalPages}).`);
        }

        const title = `Shop Logs (${totalLogCount} total entries) - Page ${page} of ${totalPages}`;
        const header = ['Time', 'Action', 'User', 'Item ID', 'Item Name', 'Price', 'Details'];

        const data = logs.map(log => {
            const timestamp = new Date(log.timestamp).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
            });
            const userName = Impulse.nameColor(log.userid, true, true);
            const action = log.action.toUpperCase();
            const itemId = log.itemId || '-';
            const itemName = log.itemName ? Chat.escapeHTML(log.itemName) : '-';
            const price = ((log.action === 'add' || log.action === 'buy') && log.price !== undefined) ? `${log.price} ${CURRENCY}` : '-';

            let details = '-';
            if (log.action === 'add' && log.description) {
                details = Chat.escapeHTML(log.description);
            } else if (log.action === 'save' && log.details) {
                 details = Chat.escapeHTML(log.details);
            }

            if (details.length > 100) details = details.substring(0, 97) + '...';

            return [timestamp, action, userName, itemId, itemName, price, details];
        });

        const tableHTML = Impulse.generateThemedTable(title, header, data);
        let paginationHTML = '';

        if (totalPages > 1) {
            paginationHTML += `<div style="text-align: center; margin-top: 5px;">Page: ${page} / ${totalPages}`;
            const cmd = `/shoplogs`;
            if (page > 1) paginationHTML += ` | <button name="send" value="${cmd} ${page - 1}">Previous</button>`;
            if (page < totalPages) paginationHTML += ` | <button name="send" value="${cmd} ${page + 1}">Next</button>`;
            paginationHTML += `</div>`;
        }

        const uhtmlID = `shoplogs-${page}`;
        const fullOutput = `<div style="max-height: 400px; overflow-y: auto;" data-uhtml="${uhtmlID}">${tableHTML}</div>${paginationHTML}`;
        this.ImpulseReplyBox(fullOutput);
    },


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
         `<details><summary><b>Admin Shop Commands</b> (Requires: Server Administrator access)</summary>` +
         `<ul><li><code>/additem [item name], [price], [description]</code> - Add an item to the shop.</li>` +
         `<li><code>/deleteitem [item name]</code> (or <code>/removeitem</code>) - Remove an item from the shop.</li>` +
         `<li><code>/shopsave</code> - Manually save the current shop items to file.</li>` +
         `<li><code>/shoplogs [page]</code> - View logs of item purchases and administrative shop actions.</li>` +
         `</ul></details></div>`);
    },
};
