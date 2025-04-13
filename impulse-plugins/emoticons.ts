/******************************************
 * Pokemon Showdown Emoticons Commands    *
 * Author: @musaddiktemkar                *
 ******************************************/

import { FS } from '../lib/fs';

interface Emoticons {
    [key: string]: string;
}

let emoticons: Emoticons = {};

try {
    const emoticonsData = FS('impulse-db/emoticons.json').readIfExistsSync();
    if (emoticonsData) {
        emoticons = JSON.parse(emoticonsData);
    }
} catch (err) {
    console.error(`Failed to parse emoticons.json:`, err);
}

async function updateEmoticons(): Promise<void> {
    try {
        await FS('impulse-db/emoticons.json').writeUpdate(() => JSON.stringify(emoticons));
    } catch (err) {
        console.error('Error updating emoticons:', err);
    }
}

export function parseEmoticons(message: string): string {
    let parsedMessage = message;
    for (const code in emoticons) {
        const regex = new RegExp(Utils.escapeRegex(code), 'g');
        parsedMessage = parsedMessage.replace(regex, 
            `<img src="${emoticons[code]}" title="${code}" height="30" width="30" />`
        );
    }
    return parsedMessage;
}

Impulse.parseEmoticons = parseEmoticons;

export const commands: Chat.ChatCommands = {
    emoticon: 'emote',
    emote: {
        async add(this: CommandContext, target: string, room: Room, user: User) {
            this.checkCan('globalban');
            const [code, imageUrl] = target.split(',').map(s => s.trim());
            
            if (!code || !imageUrl) return this.parse('/help emote');
            if (code.length < 2) return this.errorReply("Emoticon code must be at least 2 characters long.");
            if (code.length > 15) return this.errorReply("Emoticon code is too long.");
            
            // Check if emoticon already exists
            if (emoticons[code]) {
                return this.errorReply(`The emoticon ${code} already exists. Remove it first with /emote delete [code]`);
            }

            // Add new emoticon
            emoticons[code] = imageUrl;
            await updateEmoticons();
            
            this.sendReply(`|raw|Added emoticon: ${code} <img src="${imageUrl}" height="30" width="30" />`);
            
            // Log to staff room
            const staffRoom = Rooms.get('staff');
            if (staffRoom) {
                staffRoom.add(
                    `|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} added emoticon ${code}: ` +
                    `<img src="${imageUrl}" height="30" width="30" /></div>`
                ).update();
            }
        },

        async delete(this: CommandContext, target: string, room: Room, user: User) {
            this.checkCan('globalban');
            const code = target.trim();
            
            if (!code) return this.parse('/help emote');
            if (!emoticons[code]) return this.errorReply(`The emoticon ${code} does not exist.`);
            
            delete emoticons[code];
            await updateEmoticons();
            
            this.sendReply(`Removed emoticon ${code}.`);
            
            // Log to staff room
            const staffRoom = Rooms.get('staff');
            if (staffRoom) {
                staffRoom.add(
                    `|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed emoticon ${code}.</div>`
                ).update();
            }
        },

        list(target, room, user) {
            if (!this.runBroadcast()) return;
            if (Object.keys(emoticons).length < 1) return this.sendReply("There are no emoticons.");
            
            let buff = '<strong>Emoticons (' + Object.keys(emoticons).length + ')</strong><br />';
            
            for (const code in emoticons) {
                buff += `${code}: <img src="${emoticons[code]}" title="${code}" height="30" width="30" /> `;
            }
            
            this.sendReplyBox(buff);
        },

        '': 'help',
        help(target, room, user) {
            if (!this.runBroadcast()) return;
            this.sendReplyBox(
                '<b>Emoticon Commands:</b><br />' +
                '- /emote add [code], [image url] - Adds an emoticon (Requires: @ and higher)<br />' +
                '- /emote delete [code] - Removes an emoticon (Requires: @ and higher)<br />' +
                '- /emote list - Shows all emoticons<br />' +
                '<b>Example:</b> /emote add :heart:, https://example.com/heart.png'
            );
        },
    },
};
