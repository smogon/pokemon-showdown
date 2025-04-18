/**
 * Emoticons chat plugin
 * This plugin allows users to use emoticons in chat messages
 * Created by: impulseserver
 * Created at: 2025-04-18 11:38:43 UTC 
 */

import {FS} from '../lib/fs';
import {Utils} from '../lib/utils';

const EMOTICONS_FILE = 'config/emoticons.json';

type Emoticon = {
    name: string;
    url: string;
    addedBy: string;
    addedAt: number;
    category?: string;
};

function saveEmoticons() {
    void FS(EMOTICONS_FILE).write(JSON.stringify([...Chat.emoticons], null, 2));
}

function loadEmoticons() {
    try {
        const content = FS(EMOTICONS_FILE).readIfExistsSync();
        if (!content) return new Map<string, Emoticon>();
        return new Map(JSON.parse(content));
    } catch (e) {
        if (e.code !== 'ENOENT') console.error(e);
        return new Map<string, Emoticon>();
    }
}

function parseEmoticons(message: string, room: Room) {
    if (!room?.settings.allowEmoticons) return message;
    
    // Replace emoticons in the message
    for (const [name, emoticon] of Chat.emoticons) {
        const regex = new RegExp(Utils.escapeRegex(name), 'g');
        message = message.replace(regex, 
            `<img src="${emoticon.url}" title="${name}" height="32" width="32" alt="${name}" style="vertical-align: middle;" />`
        );
    }
    return message;
}

export const commands: Chat.ChatCommands = {
    emoticons: {
        '': 'list',
        async list(target, room, user) {
            if (!this.runBroadcast()) return;
            
            if (!Chat.emoticons.size) {
                return this.errorReply("There are no emoticons added yet.");
            }

            // Group emoticons by category
            const categories = new Map<string, Emoticon[]>();
            for (const emoticon of Chat.emoticons.values()) {
                const category = emoticon.category || 'Uncategorized';
                if (!categories.has(category)) categories.set(category, []);
                categories.get(category)!.push(emoticon);
            }

            let buff = '<strong>Emoticons (' + Chat.emoticons.size + ')</strong><br />';
            buff += '<div class="infobox infobox-limited">';
            
            for (const [category, emoticons] of categories) {
                buff += `<details class="readmore"><summary><strong>${category} (${emoticons.length})</strong></summary>`;
                buff += emoticons.map(emoticon => 
                    `<img src="${emoticon.url}" title="${emoticon.name}" height="32" width="32" alt="${emoticon.name}" style="vertical-align: middle;" /> ${emoticon.name}`
                ).join(' ');
                buff += '</details>';
            }
            
            buff += '</div>';

            this.sendReply(`|raw|${buff}`);
        },

        add: 'set',
        set(target, room, user) {
            if (!this.can('emoticons')) return false;

            const [name, url, category = 'Uncategorized'] = target.split(',').map(p => p.trim());
            if (!name || !url) return this.errorReply("Usage: /emoticons add [name], [url], [category]");

            // Validate name
            if (name.length < 2) return this.errorReply("Emoticon names must be at least 2 characters long.");
            if (name.length > 15) return this.errorReply("Emoticon names must not exceed 15 characters.");
            if (Chat.emoticons.has(name)) return this.errorReply("This emoticon already exists.");

            // Validate URL
            if (!Chat.isLink(url)) return this.errorReply("Please provide a valid URL for the emoticon.");

            // Add emoticon
            const emoticon: Emoticon = {
                name,
                url,
                addedBy: user.id,
                addedAt: Date.now(),
                category,
            };
            
            Chat.emoticons.set(name, emoticon);
            saveEmoticons();
            
            this.globalModlog('EMOTICON', null, `ADD: ${name} - ${url} (${category}) by ${user.name}`);
            return this.sendReply(`The emoticon "${name}" has been added to the ${category} category.`);
        },

        delete: 'remove',
        remove(target, room, user) {
            if (!this.can('emoticons')) return false;
            if (!target) return this.errorReply("Usage: /emoticons remove [name]");

            const emoticon = Chat.emoticons.get(target);
            if (!emoticon) return this.errorReply("This emoticon does not exist.");

            Chat.emoticons.delete(target);
            saveEmoticons();
            
            this.globalModlog('EMOTICON', null, `REMOVE: ${target} by ${user.name}`);
            return this.sendReply(`The emoticon "${target}" has been removed.`);
        },

        toggle(target, room, user) {
            if (!this.can('emoticons')) return false;
            if (!room) return this.errorReply("This command must be used in a room.");

            const state = room.settings.allowEmoticons = !room.settings.allowEmoticons;
            room.saveSettings();

            this.modlog('EMOTICONS', null, state ? 'ON' : 'OFF');
            return this.sendReply(
                `Emoticons have been ${state ? 'enabled' : 'disabled'} in this room.`
            );
        },

        preview(target, room, user) {
            if (!this.runBroadcast()) return;
            if (!target) return this.errorReply("Usage: /emoticons preview [name]");

            const emoticon = Chat.emoticons.get(target);
            if (!emoticon) return this.errorReply("This emoticon does not exist.");

            let buff = '<strong>Emoticon Preview</strong><br />';
            buff += `<div class="infobox">`;
            buff += `Name: ${emoticon.name}<br />`;
            buff += `Category: ${emoticon.category || 'Uncategorized'}<br />`;
            buff += `Added by: ${emoticon.addedBy}<br />`;
            buff += `Added at: ${Chat.toTimestamp(new Date(emoticon.addedAt))}<br />`;
            buff += `Preview: <img src="${emoticon.url}" title="${emoticon.name}" height="32" width="32" alt="${emoticon.name}" style="vertical-align: middle;" />`;
            buff += '</div>';

            this.sendReply(`|raw|${buff}`);
        },

        clearroom(target, room, user) {
            if (!this.can('emoticons')) return false;
            if (!room) return this.errorReply("This command must be used in a room.");

            delete room.settings.allowEmoticons;
            room.saveSettings();

            this.modlog('EMOTICONS', null, `CLEAR`);
            return this.sendReply(`Emoticon settings have been cleared for this room.`);
        },

        help() {
            this.sendReply(
                `|html|<details class="readmore"><summary>Emoticons Help</summary>` +
                `<code>/emoticons</code> or <code>/emoticons list</code> - Shows the list of emoticons.<br />` +
                `<code>/emoticons add [name], [url], [category]</code> - Adds an emoticon. Requires: &<br />` +
                `<code>/emoticons remove [name]</code> - Removes an emoticon. Requires: &<br />` +
                `<code>/emoticons toggle</code> - Toggles emoticons on/off in the current room. Requires: &<br />` +
                `<code>/emoticons preview [name]</code> - Shows details about an emoticon.<br />` +
                `<code>/emoticons clearroom</code> - Clears emoticon settings for the current room. Requires: &<br />` +
                `</details>`
            );
        },
    },
};

// Initialize the emoticons system
void (() => {
    // Load emoticons from file
    Chat.emoticons = loadEmoticons();

    // Add some default emoticons if the file is empty
    if (!Chat.emoticons.size) {
        const defaults: [string, string, string][] = [
            [':smile:', 'https://i.imgur.com/O9m4pNQ.png', 'Basic'],
            [':heart:', 'https://i.imgur.com/5Y5dQMX.png', 'Basic'],
            [':lol:', 'https://i.imgur.com/mUVz9Af.png', 'Basic'],
            [':think:', 'https://i.imgur.com/CNpJ1AE.png', 'Basic'],
            [':sad:', 'https://i.imgur.com/BfJnPWX.png', 'Basic'],
            [':cool:', 'https://i.imgur.com/V5dKV1m.png', 'Basic'],
        ];

        for (const [name, url, category] of defaults) {
            Chat.emoticons.set(name, {
                name,
                url,
                category,
                addedBy: 'impulseserver',
                addedAt: 1681820323000, // 2025-04-18 11:38:43 UTC
            });
        }
        saveEmoticons();
    }

    // Register chat filter
    Chat.filters.push((message, user, room) => {
        if (room?.settings.allowEmoticons) {
            return parseEmoticons(message, room);
        }
        return message;
    });
})();

// Add types to the Chat namespace
declare global {
    namespace Chat {
        let emoticons: Map<string, Emoticon>;
    }
}
