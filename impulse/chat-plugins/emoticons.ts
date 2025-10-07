/*
* Pokemon Showdown
* Emoticons
* Instructions:
* Replace sendChatMessage in server/chat.ts with this
sendChatMessage(message: string) {
		const emoticons = Impulse.parseEmoticons(message, this.room);
		if (this.pmTarget) {
			const blockInvites = this.pmTarget.settings.blockInvites;
			if (blockInvites && /^<<.*>>$/.test(message.trim())) {
				if (
					!this.user.can('lock') && blockInvites === true ||
					!Users.globalAuth.atLeast(this.user, blockInvites as GroupSymbol)
				) {
					Chat.maybeNotifyBlocked(`invite`, this.pmTarget, this.user);
					return this.errorReply(`${this.pmTarget.name} is blocking room invites.`);
				}
			}
			Chat.PrivateMessages.send((emoticons ? `/html ${emoticons}` : `${message}`), this.user, this.pmTarget);
		} else if (this.room) {
			if (emoticons && !this.room.disableEmoticons) {
				for (const u in this.room.users) {
					const curUser = Users.get(u);
					if (!curUser || !curUser.connected) continue;
					if (Impulse.ignoreEmotes[curUser.user.id]) {
						curUser.sendTo(this.room, `${(this.room.type === 'chat' ? `|c:|${(~~(Date.now() / 1000))}|` : `|c|`)}${this.user.getIdentity(this.room)}|${message}`);
						continue;
					}
					curUser.sendTo(this.room, `${(this.room.type === 'chat' ? `|c:|${(~~(Date.now() / 1000))}|` : `|c|`)}${this.user.getIdentity(this.room)}|/html ${emoticons}`);
	  			}
				this.room.log.log.push(`${(this.room.type === 'chat' ? `|c:|${(~~(Date.now() / 1000))}|` : `|c|`)}${this.user.getIdentity(this.room)}|${message}`);
				this.room.game?.onLogMessage?.(message, this.user);
			}
			else {
				this.room.add(`|c|${this.user.getIdentity(this.room)}|${message}`);
			}

		} else {
			this.connection.popup(`Your message could not be sent:\n\n${message}\n\nIt needs to be sent to a user or room.`);
		}
	}
* @license MIT
*/

import Autolinker from 'autolinker';
import { ImpulseDB } from '../../impulse/impulse-db';
import '../utils';

interface EmoticonEntry {
  _id: string; // emoticon name
  url: string;
  addedBy: string;
  addedAt: Date;
}

interface EmoticonConfigDocument {
  _id: string; // 'config'
  emoteSize: number;
  lastUpdated: Date;
}

interface IgnoreEmotesDocument {
  _id: string; // userid
  ignored: boolean;
  lastUpdated: Date;
}

interface IgnoreEmotesData {
  [userId: string]: boolean;
}

// Get typed MongoDB collections
const EmoticonDB = ImpulseDB<EmoticonEntry>('emoticons');
const EmoticonConfigDB = ImpulseDB<EmoticonConfigDocument>('emoticonconfig');
const IgnoreEmotesDB = ImpulseDB<IgnoreEmotesDocument>('ignoreemotes');

let emoticons: { [key: string]: string } = { "spGun": "https://i.ibb.co/78y8mKv/spGun.jpg" };
let emoteRegex: RegExp = new RegExp("spGun", "g");
let emoteSize: number = 32;
Impulse.ignoreEmotes = {} as IgnoreEmotesData;

function getEmoteSize(): string {
  return emoteSize.toString();
}

function parseMessage(message: string): string {
  if (message.substr(0, 5) === "/html") {
    message = message.substr(5);
    message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>'); // italics
    message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>'); // bold
    message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>'); // strikethrough
    message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;'); // <<roomid>>
    message = Autolinker.link(message.replace(/&#x2f;/g, '/'), { stripPrefix: false, phone: false, twitter: false });
    return message;
  }
  message = Chat.escapeHTML(message).replace(/&#x2f;/g, '/');
  message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>'); // italics
  message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>'); // bold
  message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>'); // strikethrough
  message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;'); // <<roomid>>
  message = Autolinker.link(message, { stripPrefix: false, phone: false, twitter: false });
  return message;
}
Impulse.parseMessage = parseMessage;

function escapeRegExp(str: string): string {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); // eslint-disable-line no-useless-escape
}

function buildEmoteRegex(): void {
  const emoteArray = Object.keys(emoticons).map(emote => escapeRegExp(emote));
  if (emoteArray.length > 0) {
    emoteRegex = new RegExp(`(${emoteArray.join('|')})`, 'g');
  } else {
    emoteRegex = new RegExp("^$", "g"); // Never matches
  }
}

async function loadEmoticons(): Promise<void> {
  try {
    // Load emoticons from MongoDB - use projection to only get needed fields
    const emoticonDocs = await EmoticonDB.find({}, { projection: { _id: 1, url: 1 } });
    if (emoticonDocs.length > 0) {
      emoticons = {};
      for (const doc of emoticonDocs) {
        emoticons[doc._id] = doc.url;
      }
    }

    // Load config (emote size) - use findOne directly
    const config = await EmoticonConfigDB.findOne({ _id: 'config' });
    if (config) {
      emoteSize = config.emoteSize;
    }

    // Load ignore emotes - use projection to only get _id field
    const ignoreEmotesDocs = await IgnoreEmotesDB.find(
      { ignored: true },
      { projection: { _id: 1 } }
    );
    Impulse.ignoreEmotes = {};
    for (const doc of ignoreEmotesDocs) {
      Impulse.ignoreEmotes[doc._id] = true;
    }

    // Build regex once
    buildEmoteRegex();
  } catch (e) {
    console.error('Error loading emoticons:', e);
  }
}

async function saveEmoteSize(size: number): Promise<void> {
  try {
    await EmoticonConfigDB.upsert(
      { _id: 'config' },
      {
        $set: {
          emoteSize: size,
          lastUpdated: new Date(),
        }
      }
    );
    emoteSize = size;
  } catch (e) {
    console.error('Error saving emote size:', e);
  }
}

async function addEmoticon(name: string, url: string, user: User): Promise<void> {
  await EmoticonDB.insertOne({
    _id: name,
    url: url,
    addedBy: user.name,
    addedAt: new Date(),
  });

  emoticons[name] = url;
  buildEmoteRegex();
}

async function deleteEmoticon(name: string): Promise<void> {
  await EmoticonDB.deleteOne({ _id: name });
  delete emoticons[name];
  buildEmoteRegex();
}

function parseEmoticons(message: string, room?: Room): string | false {
  if (emoteRegex.test(message)) {
    const size = getEmoteSize();
    message = Impulse.parseMessage(message).replace(emoteRegex, (match: string): string => {
      return `<img src="${emoticons[match]}" title="${match}" height="${size}" width="${size}">`;
    });
    return message;
  }
  return false;
}
Impulse.parseEmoticons = parseEmoticons;

// Initialize emoticons on startup
loadEmoticons();

export const commands: Chat.ChatCommands = {
  blockemote: "ignoreemotes",
  blockemotes: "ignoreemotes",
  blockemoticon: "ignoreemotes",
  blockemoticons: "ignoreemotes",
  ignoreemotes() {
    this.parse('/emoticons ignore');
  },

  unblockemote: "unignoreemotes",
  unblockemotes: "unignoreemotes",
  unblockemoticon: "unignoreemotes",
  unblockemoticons: "unignoreemotes",
  unignoreemotes() {
    this.parse('/emoticons unignore');
  },

  emoticons: "emoticon",
  emote: "emoticon",
  emotes: "emoticon",
  emoticon: {
    async add(target, room, user) {
      room = this.requireRoom();
      this.checkCan('globalban');
      if (!target) return this.parse("/emoticonshelp");

      const targetSplit: string[] = target.split(",");
      for (let u = 0; u < targetSplit.length; u++) {
        targetSplit[u] = targetSplit[u].trim();
      }

      if (!targetSplit[1]) return this.parse("/emoticonshelp");
      if (targetSplit[0].length > 10) return this.errorReply("Emoticons may not be longer than 10 characters.");
      
      // Check if emoticon already exists using atomic exists check
      const exists = await EmoticonDB.exists({ _id: targetSplit[0] });
      if (exists) return this.errorReply(`${targetSplit[0]} is already an emoticon.`);

      await addEmoticon(targetSplit[0], targetSplit[1], user);

      this.sendReply(`|raw|The emoticon ${Chat.escapeHTML(targetSplit[0])} has been added: <img src="${targetSplit[1]}" width="40" height="40">`);
      this.modlog('ADDEMOTICON', null, targetSplit[0]);
    },

    delete: "del",
    remove: "del",
    rem: "del",
    async del(target, room, user) {
      room = this.requireRoom();
      this.checkCan('globalban');
      if (!target) return this.parse("/emoticonshelp");
      
      // Check if emoticon exists using atomic exists check
      const exists = await EmoticonDB.exists({ _id: target });
      if (!exists) return this.errorReply("That emoticon does not exist.");

      await deleteEmoticon(target);

      this.sendReply("That emoticon has been removed.");
      this.modlog('DELETEEMOTICON', null, target);
    },

    toggle(target, room, user) {
      room = this.requireRoom();
      this.checkCan('roommod');
      if (!room.disableEmoticons) {
        room.disableEmoticons = true;
        Rooms.global.writeChatRoomData();
        this.modlog('EMOTES', null, 'disabled emoticons');
        this.privateModAction(`(${user.name} disabled emoticons in this room.)`);
      } else {
        room.disableEmoticons = false;
        Rooms.global.writeChatRoomData();
        this.modlog('EMOTES', null, 'enabled emoticons');
        this.privateModAction(`(${user.name} enabled emoticons in this room.)`);
      }
    },

    async ''(target, room, user) {
      if (!this.runBroadcast()) return;
      const emoteKeys = Object.keys(emoticons);
      
      let buf = ``;
      buf += `<center><details><summary>Click to view emoticons</summary>`;
      buf += `<table style="border-collapse: collapse;">`;
      
      for (let i = 0; i < emoteKeys.length; i += 5) {
        buf += `<tr>`;
        for (let j = i; j < i + 5 && j < emoteKeys.length; j++) {
          const emote = emoteKeys[j];
          buf += `<td style="text-align: center; padding: 10px; vertical-align: top; border: 1px solid #ccc; border-radius: 8px;">`;
          buf += `<img src="${emoticons[emote]}" height="40" width="40" style="display: block; margin: 0 auto;"><br>`;
          buf += `<small>${Chat.escapeHTML(emote)}</small>`;
          buf += `</td>`;
        }
        buf += `</tr>`;
      }
      buf += `</table>`;
      buf += `</details></center>`;
      this.sendReplyBox(`<div class="infobox infobox-limited">${buf}</div>`);
    },

    async ignore(target, room, user) {
      if (Impulse.ignoreEmotes[user.id]) return this.errorReply('You are already ignoring emoticons.');
      
      // Use atomic upsert with $set operator
      await IgnoreEmotesDB.upsert(
        { _id: user.id },
        {
          $set: {
            ignored: true,
            lastUpdated: new Date(),
          }
        }
      );
      
      Impulse.ignoreEmotes[user.id] = true;
      this.sendReply('You are now ignoring emoticons.');
    },

    async unignore(target, room, user) {
      if (!Impulse.ignoreEmotes[user.id]) return this.errorReply('You aren\'t ignoring emoticons.');
      
      // Use atomic delete
      await IgnoreEmotesDB.deleteOne({ _id: user.id });
      
      delete Impulse.ignoreEmotes[user.id];
      this.sendReply('You are no longer ignoring emoticons.');
    },

    async size(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.errorReply('Please specify a size (e.g., 32, 64, 128).');
      
      const size = parseInt(target);
      if (isNaN(size) || size < 16 || size > 256) {
        return this.errorReply('Size must be a number between 16 and 256.');
      }

      await saveEmoteSize(size);
      this.sendReply(`Emoticon size has been set to ${size}px.`);
      this.modlog('EMOTESIZE', null, `${size}px`);
    },

    async list(target, room, user) {
      if (!this.runBroadcast()) return;
      const emoteKeys = Object.keys(emoticons);
      
      let buf = ``;
      buf += `<b>Available Emoticons (${emoteKeys.length} total):</b><br>`;
      buf += emoteKeys.map(e => Chat.escapeHTML(e)).join(', ');
      this.sendReplyBox(buf);
    },

    async count(target, room, user) {
      // Use countDocuments instead of find().length
      const count = await EmoticonDB.countDocuments({});
      this.sendReply(`There are currently ${count} emoticon(s) available.`);
    },

    async search(target, room, user) {
      if (!target) return this.errorReply('Usage: /emoticon search <query>');
      
      const query = target.toLowerCase();
      const results = Object.keys(emoticons).filter(e => e.toLowerCase().includes(query));
      
      if (results.length === 0) {
        return this.sendReply(`No emoticons found matching "${target}".`);
      }
      
      let buf = ``;
      buf += `<b>Emoticons matching "${Chat.escapeHTML(target)}" (${results.length} found):</b><br>`;
      buf += results.map(e => Chat.escapeHTML(e)).join(', ');
      this.sendReplyBox(buf);
    },

    async info(target, room, user) {
      if (!target) return this.errorReply('Usage: /emoticon info <name>');
      
      // Use findOne instead of findById for consistency
      const emote = await EmoticonDB.findOne({ _id: target });
      if (!emote) return this.errorReply(`Emoticon "${target}" does not exist.`);
      
      let buf = ``;
      buf += `<b>Emoticon Info: ${Chat.escapeHTML(target)}</b><br>`;
      buf += `<img src="${emote.url}" height="40" width="40"><br>`;
      buf += `<b>URL:</b> ${Chat.escapeHTML(emote.url)}<br>`;
      buf += `<b>Added by:</b> ${Impulse.nameColor(emote.addedBy, true, true)}<br>`;
      buf += `<b>Added on:</b> ${emote.addedAt.toUTCString()}<br>`;
      this.sendReplyBox(buf);
    },

    randemote() {
      const emoteKeys = Object.keys(emoticons);
      if (emoteKeys.length === 0) return this.errorReply('No emoticons available.');
      const randomEmote = emoteKeys[Math.floor(Math.random() * emoteKeys.length)];
      this.parse(randomEmote);
    },

	  help(target, room, user) {
		  if (!this.runBroadcast()) return;
		  this.sendReplyBox(
			  `<div><b><center>Emoticon Commands</center></b><br>` +
			  `<ul>` +
			  `<li><code>/emoticon</code> may be substituted with <code>/emoticons</code>, <code>/emotes</code>, or <code>/emote</code></li>` +
			  `<li><code>/emoticon add [name], [url]</code> - Adds an emoticon</li>` +
			  `<li><code>/emoticon del/delete/remove/rem [name]</code> - Removes an emoticon</li>` +
			  `<li><code>/emoticon toggle</code> - Enables or disables emoticons in the current room depending on if they are already active</li>` +
			  `<li><code>/emoticon view/list</code> - Displays the list of emoticons</li>` +
			  `<li><code>/emoticon ignore</code> - Ignores emoticons in chat messages</li>` +
			  `<li><code>/emoticon unignore</code> - Unignores emoticons in chat messages</li>` +
			  `<li><code>/emoticon size [size]</code> - Sets the size of emoticons (16-256px)</li>` +
			  `<li><code>/emoticon search [query]</code> - Search for emoticons by name</li>` +
			  `<li><code>/emoticon info [name]</code> - View detailed information about an emoticon</li>` +
			  `<li><code>/emoticon count</code> - Shows total number of emoticons</li>` +
			  `<li><code>/randemote</code> - Randomly sends an emote from the emoticon list</li>` +
			  `<li><code>/emoticon help</code> - Displays this help command</li>` +
			  `</ul>` +
			  `<small>Commands add, del, toggle, and size require appropriate permissions (@ for add/del/size, # for toggle).</small>` +
			  `</div>`
		  );
	  },
  },
};
