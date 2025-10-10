/*
* Pokemon Showdown
* Custom Symbol
* @author PrinceSky-Git
*/

import { FS } from '../../lib';
import { ImpulseDB } from '../../impulse/impulse-db';

const STAFF_ROOM_ID = 'staff';
const SYMBOL_LOG_PATH = 'logs/customsymbol.txt';

interface CustomSymbolDocument {
  _id: string;
  symbol: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomSymbolDB = ImpulseDB<CustomSymbolDocument>('customsymbols');

async function logSymbolAction(action: string, staff: string, target: string, details?: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} | Staff: ${staff} | Target: ${target}${details ? ` | ${details}` : ''}\n`;
    await FS(SYMBOL_LOG_PATH).append(logEntry);
  } catch (err) {
    console.error('Error writing to custom symbol log:', err);
  }
}

async function applyCustomSymbol(userid: string): Promise<void> {
  const user = Users.get(userid);
  if (!user) return;
  
  const symbolDoc = await CustomSymbolDB.findOne(
    { _id: userid },
    { projection: { symbol: 1 } }
  );
  
  if (symbolDoc) {
    if (!(user as any).originalGroup) {
      (user as any).originalGroup = user.tempGroup;
    }
    (user as any).customSymbol = symbolDoc.symbol;
    user.updateIdentity();
  }
}

async function removeCustomSymbol(userid: string): Promise<void> {
  const user = Users.get(userid);
  if (!user) return;
  
  delete (user as any).customSymbol;
  if ((user as any).originalGroup) {
    delete (user as any).originalGroup;
  }
  user.updateIdentity();
}

export const commands: Chat.ChatCommands = {
  customsymbol: 'symbol',
  cs: 'symbol',
  symbol: {
    ''(target, room, user) {
      this.parse(`/symbolhelp`);
    },
    
    async set(target, room, user) {
      this.checkCan('globalban');
      const parts = target.split(',').map(s => s.trim());
      const [name, symbol] = parts;
      
      if (!name || !symbol) return this.parse('/help symbol');
      
      const userId = toID(name);
      if (userId.length > 19) return this.errorReply('Usernames are not this long...');
      
      if (symbol.length !== 1) {
        return this.errorReply('Symbol must be a single character.');
      }
      
      if (await CustomSymbolDB.exists({ _id: userId })) {
        return this.errorReply('This user already has a custom symbol. Remove it first with /symbol delete [user] or use /symbol update [user], [symbol].');
      }
      
      const now = new Date();
      
      await CustomSymbolDB.insertOne({
        _id: userId,
        symbol,
        createdAt: now,
        updatedAt: now,
      });
      
      await applyCustomSymbol(userId);
      
      await logSymbolAction('SET', user.name, userId, `Symbol: ${symbol}`);
      
      this.sendReply(`|raw|You have given ${Impulse.nameColor(name, true, false)} the custom symbol: ${symbol}`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has set your custom symbol to: <strong>${symbol}</strong><br /><center>Refresh to see the changes.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} set custom symbol for ${Impulse.nameColor(name, true, false)}: <strong>${symbol}</strong></div>`).update();
      }
    },
    
    async update(target, room, user) {
      this.checkCan('globalban');
      const parts = target.split(',').map(s => s.trim());
      const [name, symbol] = parts;
      
      if (!name || !symbol) return this.parse('/help symbol');
      
      const userId = toID(name);
      
      if (!await CustomSymbolDB.exists({ _id: userId })) {
        return this.errorReply('This user does not have a custom symbol. Use /symbol set to create one.');
      }
      
      if (symbol.length !== 1) {
        return this.errorReply('Symbol must be a single character.');
      }
      
      await CustomSymbolDB.updateOne(
        { _id: userId },
        { $set: { symbol, updatedAt: new Date() } }
      );
      
      await applyCustomSymbol(userId);
      
      await logSymbolAction('UPDATE', user.name, userId, `New Symbol: ${symbol}`);
      
      this.sendReply(`|raw|You have updated ${Impulse.nameColor(name, true, false)}'s custom symbol to: ${symbol}`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has updated your custom symbol to: <strong>${symbol}</strong><br /><center>Refresh to see the changes.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} updated custom symbol for ${Impulse.nameColor(name, true, false)} to: <strong>${symbol}</strong></div>`).update();
      }
    },
    
    async delete(target, room, user) {
      this.checkCan('globalban');
      const userId = toID(target);
      
      if (!await CustomSymbolDB.exists({ _id: userId })) {
        return this.errorReply(`${target} does not have a custom symbol.`);
      }
      
      const symbolDoc = await CustomSymbolDB.findOne(
        { _id: userId },
        { projection: { symbol: 1 } }
      );
      
      await CustomSymbolDB.deleteOne({ _id: userId });
      
      await removeCustomSymbol(userId);
      
      const symbolDetails = symbolDoc ? `Removed Symbol: ${symbolDoc.symbol}` : 'Symbol removed';
      await logSymbolAction('DELETE', user.name, userId, symbolDetails);
      
      this.sendReply(`You removed ${target}'s custom symbol.`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has removed your custom symbol.<br /><center>Refresh to see the changes.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed custom symbol for ${Impulse.nameColor(target, true, false)}.</div>`).update();
      }
    },
    
    async list(target, room, user) {
      this.checkCan('globalban');
      
      const page = parseInt(target) || 1;
      
      const result = await CustomSymbolDB.findPaginated({}, {
        page,
        limit: 20,
        sort: { _id: 1 }
      });
      
      if (result.total === 0) {
        return this.sendReply('No custom symbols have been set.');
      }
      
      let output = `<div class="ladder pad"><h2>Custom Symbols (Page ${result.page}/${result.totalPages})</h2><table style="width: 100%"><tr><th>User</th><th>Symbol</th><th>Created</th></tr>`;
      
      for (const doc of result.docs) {
        const created = doc.createdAt ? doc.createdAt.toLocaleDateString() : 'Unknown';
        output += `<tr><td>${doc._id}</td><td><strong style="font-size: 16px;">${doc.symbol}</strong></td><td>${created}</td></tr>`;
      }
      
      output += `</table></div>`;
      
      if (result.totalPages > 1) {
        output += `<div class="pad"><center>`;
        if (result.hasPrev) {
          output += `<button class="button" name="send" value="/symbol list ${result.page - 1}">Previous</button> `;
        }
        if (result.hasNext) {
          output += `<button class="button" name="send" value="/symbol list ${result.page + 1}">Next</button>`;
        }
        output += `</center></div>`;
      }
      
      this.sendReply(`|raw|${output}`);
    },
    
    async view(target, room, user) {
      const userId = toID(target);
      if (!userId) return this.parse('/help symbol');
      
      const symbolDoc = await CustomSymbolDB.findOne(
        { _id: userId },
        { projection: { symbol: 1, createdAt: 1, updatedAt: 1 } }
      );
      
      if (!symbolDoc) {
        return this.sendReply(`${target} does not have a custom symbol.`);
      }
      
      const created = symbolDoc.createdAt ? symbolDoc.createdAt.toLocaleString() : 'Unknown';
      const updated = symbolDoc.updatedAt ? symbolDoc.updatedAt.toLocaleString() : 'Unknown';
      
      this.sendReplyBox(
        `<strong>Custom Symbol for ${target}:</strong><br />` +
        `<strong>Symbol:</strong> <span style="font-size: 24px;">${symbolDoc.symbol}</span><br />` +
        `<strong>Created:</strong> ${created}<br />` +
        `<strong>Last Updated:</strong> ${updated}`
      );
    },
    
    async search(target, room, user) {
      this.checkCan('globalban');
      
      if (!target) return this.errorReply('Please provide a search term.');
      
      const searchTerm = toID(target);
      
      const symbols = await CustomSymbolDB.find(
        { _id: { $regex: searchTerm, $options: 'i' } as any },
        { projection: { _id: 1, symbol: 1 } }
      );
      
      if (symbols.length === 0) {
        return this.sendReply(`No custom symbols found matching "${target}".`);
      }
      
      let output = `<div class="ladder pad"><h2>Search Results for "${target}"</h2><table style="width: 100%"><tr><th>User</th><th>Symbol</th></tr>`;
      
      for (const doc of symbols) {
        output += `<tr><td>${doc._id}</td><td><strong style="font-size: 16px;">${doc.symbol}</strong></td></tr>`;
      }
      
      output += `</table></div>`;
      this.sendReply(`|raw|${output}`);
    },
    
    async count(target, room, user) {
      this.checkCan('globalban');
      
      const total = await CustomSymbolDB.countDocuments({});
      this.sendReply(`There are currently ${total} custom symbol(s) set.`);
    },
    
    async logs(target, room, user) {
      this.checkCan('globalban');
      
      try {
        const logContent = await FS(SYMBOL_LOG_PATH).readIfExists();
        
        if (!logContent) {
          return this.sendReply('No custom symbol logs found.');
        }
        
        const lines = logContent.trim().split('\n');
        const numLines = parseInt(target) || 50;
        
        if (numLines < 1 || numLines > 500) {
          return this.errorReply('Please specify a number between 1 and 500.');
        }
        
        const recentLines = lines.slice(-numLines).reverse();
        
        let output = `<div class="ladder pad"><h2>Custom Symbol Logs (Last ${recentLines.length} entries - Latest First)</h2>`;
        output += `<div style="max-height: 370px; overflow: auto; font-family: monospace; font-size: 11px;">`;
        
        for (let i = 0; i < recentLines.length; i++) {
          output += `<div style="padding: 8px 0;">${Chat.escapeHTML(recentLines[i])}</div>`;
          if (i < recentLines.length - 1) {
            output += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 0;">`;
          }
        }
        
        output += `</div></div>`;
        
        this.sendReply(`|raw|${output}`);
      } catch (err) {
        console.error('Error reading custom symbol logs:', err);
        return this.errorReply('Failed to read custom symbol logs.');
      }
    },
  },
  
  symbolhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Custom Symbol Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/symbol set [username], [symbol]</code> - Gives [user] a custom group symbol</li>` +
      `<li><code>/symbol update [username], [symbol]</code> - Updates an existing custom symbol</li>` +
      `<li><code>/symbol delete [username]</code> - Removes a user's custom symbol</li>` +
      `<li><code>/symbol list [page]</code> - Lists all custom symbols with pagination</li>` +
      `<li><code>/symbol view [username]</code> - View details about a user's custom symbol</li>` +
      `<li><code>/symbol search [term]</code> - Search for custom symbols by username</li>` +
      `<li><code>/symbol count</code> - Show total number of custom symbols</li>` +
      `<li><code>/symbol logs [number]</code> - View recent custom symbol log entries (default: 50, max: 500)</li>` +
      `</ul>` +
      `<small>All commands except view require @ or higher permission.<br>` +
      `Aliases: /customsymbol, /cs</small>` +
      `</div>`
    );
  },
};

export const loginfilter: Chat.LoginFilter = user => {
  applyCustomSymbol(user.id);
};

const originalGetIdentity = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function(room: BasicRoom | null = null) {
  const customSymbol = (this as any).customSymbol;
  
  if (customSymbol) {
    const punishgroups = Config.punishgroups || { locked: null, muted: null };
    if (this.locked || this.namelocked) {
      const lockedSymbol = (punishgroups.locked?.symbol || '\u203d');
      return lockedSymbol + this.name;
    }
    if (room) {
      if (room.isMuted(this)) {
        const mutedSymbol = (punishgroups.muted?.symbol || '!');
        return mutedSymbol + this.name;
      }
      const roomGroup = room.auth.get(this);
      if (roomGroup === this.tempGroup || roomGroup === ' ') {
        return customSymbol + this.name;
      }
      return roomGroup + this.name;
    }
    if (this.semilocked) {
      const mutedSymbol = (punishgroups.muted?.symbol || '!');
      return mutedSymbol + this.name;
    }
    return customSymbol + this.name;
  }
  
  return originalGetIdentity.call(this, room);
};
