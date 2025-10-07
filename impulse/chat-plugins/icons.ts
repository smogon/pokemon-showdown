/*
* Pokemon Showdown
* Custom Icons
* @license MIT
*/

import { FS } from '../../lib';
import { MongoDB } from '../../impulse/mongodb_module';

// Change this to match your server's userlist color.
//const backgroundColor = 'rgba(248, 187, 217, 0.3)';
const STAFF_ROOM_ID = 'staff';
const DEFAULT_ICON_SIZE = 24;

interface IconData {
  url: string;
  size?: number;
}

interface IconDocument {
  _id: string; // userid
  url: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

// Get typed MongoDB collection for icons
const IconsDB = MongoDB<IconDocument>('usericons');

async function updateIcons(): Promise<void> {
  try {
    // Fetch all icon documents from MongoDB - using find() for all documents
    const iconDocs = await IconsDB.find({});
    
    let newCss = '/* ICONS START */\n';
    
    for (const doc of iconDocs) {
      const url = doc.url;
      const size = doc.size || DEFAULT_ICON_SIZE;
      const userid = doc._id;
      
      newCss += `[id$="-userlist-user-${userid}"] { background: url("${url}") right no-repeat !important; background-size: ${size}px!important;}\n`;
    }
    
    newCss += '/* ICONS END */\n';
    
    const file = FS('config/custom.css').readIfExistsSync().split('\n');
    const start = file.indexOf('/* ICONS START */');
    const end = file.indexOf('/* ICONS END */');
    
    if (start !== -1 && end !== -1) {
      file.splice(start, (end - start) + 1);
    }
    
    await FS('config/custom.css').writeUpdate(() => file.join('\n') + newCss);
    Impulse.reloadCSS();
  } catch (err) {
    console.error('Error updating icons:', err);
  }
}

export const commands: Chat.ChatCommands = {
  usericon: 'icon',
  icon: {
    ''(target, room, user) {
      this.parse(`/iconhelp`);
    },
    
    async set(target, room, user) {
      this.checkCan('globalban');
      const parts = target.split(',').map(s => s.trim());
      const [name, imageUrl, sizeStr] = parts;
      
      if (!name || !imageUrl) return this.parse('/help icon');
      
      const userId = toID(name);
      if (userId.length > 19) return this.errorReply('Usernames are not this long...');
      
      // Use exists() - most efficient way to check existence
      if (await IconsDB.exists({ _id: userId })) {
        return this.errorReply('This user already has an icon. Remove it first with /icon delete [user].');
      }
      
      // Parse size parameter
      let size = DEFAULT_ICON_SIZE;
      if (sizeStr) {
        const parsedSize = parseInt(sizeStr);
        if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 100) {
          return this.errorReply('Invalid size. Please use a number between 1 and 100 pixels.');
        }
        size = parsedSize;
      }
      
      const now = new Date();
      
      // Use insertOne() for single document insert
      await IconsDB.insertOne({
        _id: userId,
        url: imageUrl,
        size,
        createdAt: now,
        updatedAt: now,
      } as any);
      
      await updateIcons();
      
      const sizeDisplay = size !== DEFAULT_ICON_SIZE ? ` (${size}px)` : '';
      this.sendReply(`|raw|You have given ${Impulse.nameColor(name, true, false)} an icon${sizeDisplay}.`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has set your userlist icon to: <img src="${imageUrl}" width="32" height="32">${sizeDisplay}<br /><center>Refresh, If you don't see it.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} set icon for ${Impulse.nameColor(name, true, false)}: <img src="${imageUrl}" width="32" height="32">${sizeDisplay}</div>`).update();
      }
    },
    
    async update(target, room, user) {
      this.checkCan('globalban');
      const parts = target.split(',').map(s => s.trim());
      const [name, imageUrl, sizeStr] = parts;
      
      if (!name) return this.parse('/help icon');
      
      const userId = toID(name);
      
      // Use findById() - most efficient for _id lookups
      const existingIcon = await IconsDB.findById(userId);
      if (!existingIcon) {
        return this.errorReply('This user does not have an icon. Use /icon set to create one.');
      }
      
      // Build update object
      const updateFields: Partial<IconDocument> = {
        updatedAt: new Date(),
      };
      
      if (imageUrl) updateFields.url = imageUrl;
      if (sizeStr) {
        const parsedSize = parseInt(sizeStr);
        if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 100) {
          return this.errorReply('Invalid size. Please use a number between 1 and 100 pixels.');
        }
        updateFields.size = parsedSize;
      }
      
      // Use updateOne() with $set operator
      await IconsDB.updateOne(
        { _id: userId },
        { $set: updateFields }
      );
      
      await updateIcons();
      
      // Fetch updated document using findById()
      const updatedIcon = await IconsDB.findById(userId);
      const size = updatedIcon?.size || DEFAULT_ICON_SIZE;
      const url = updatedIcon?.url || imageUrl;
      const sizeDisplay = size !== DEFAULT_ICON_SIZE ? ` (${size}px)` : '';
      
      this.sendReply(`|raw|You have updated ${Impulse.nameColor(name, true, false)}'s icon${sizeDisplay}.`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has updated your userlist icon${url ? `: <img src="${url}" width="32" height="32">` : ''}${sizeDisplay}<br /><center>Refresh, If you don't see it.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} updated icon for ${Impulse.nameColor(name, true, false)}${url ? `: <img src="${url}" width="32" height="32">` : ''}${sizeDisplay}</div>`).update();
      }
    },
    
    async delete(target, room, user) {
      this.checkCan('globalban');
      const userId = toID(target);
      
      // Use exists() for efficient check before delete
      if (!await IconsDB.exists({ _id: userId })) {
        return this.errorReply(`${target} does not have an icon.`);
      }
      
      // Use deleteOne() for single document deletion
      await IconsDB.deleteOne({ _id: userId });
      await updateIcons();
      
      this.sendReply(`You removed ${target}'s icon.`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has removed your userlist icon.`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed icon for ${Impulse.nameColor(target, true, false)}.</div>`).update();
      }
    },
    
    async list(target, room, user) {
      this.checkCan('globalban');
      
      const page = parseInt(target) || 1;
      
      // Use findWithPagination() - optimized for paginated results
      const result = await IconsDB.findWithPagination({}, {
        page,
        limit: 20,
        sort: { _id: 1 }
      });
      
      if (result.total === 0) {
        return this.sendReply('No custom icons have been set.');
      }
      
      let output = `<div class="ladder pad"><h2>Custom Icons (Page ${result.page}/${result.pages})</h2><table style="width: 100%"><tr><th>User</th><th>Icon</th><th>Size</th><th>Created</th></tr>`;
      
      for (const icon of result.data) {
        const created = icon.createdAt ? icon.createdAt.toLocaleDateString() : 'Unknown';
        const size = icon.size || DEFAULT_ICON_SIZE;
        output += `<tr><td>${icon._id}</td><td><img src="${icon.url}" width="32" height="32"></td><td>${size}px</td><td>${created}</td></tr>`;
      }
      
      output += `</table></div>`;
      
      if (result.pages > 1) {
        output += `<div class="pad"><center>`;
        if (result.page > 1) {
          output += `<button class="button" name="send" value="/icon list ${result.page - 1}">Previous</button> `;
        }
        if (result.page < result.pages) {
          output += `<button class="button" name="send" value="/icon list ${result.page + 1}">Next</button>`;
        }
        output += `</center></div>`;
      }
      
      this.sendReply(`|raw|${output}`);
    },
    
    async view(target, room, user) {
      const userId = toID(target);
      if (!userId) return this.parse('/help icon');
      
      // Use findById() - most efficient for _id lookups
      const icon = await IconsDB.findById(userId);
      if (!icon) {
        return this.sendReply(`${target} does not have a custom icon.`);
      }
      
      const size = icon.size || DEFAULT_ICON_SIZE;
      const created = icon.createdAt ? icon.createdAt.toLocaleString() : 'Unknown';
      const updated = icon.updatedAt ? icon.updatedAt.toLocaleString() : 'Unknown';
      
      this.sendReplyBox(
        `<strong>Icon for ${target}:</strong><br />` +
        `<img src="${icon.url}" width="64" height="64"><br />` +
        `<strong>URL:</strong> ${icon.url}<br />` +
        `<strong>Size:</strong> ${size}px<br />` +
        `<strong>Created:</strong> ${created}<br />` +
        `<strong>Last Updated:</strong> ${updated}`
      );
    },
    
    async setmany(target, room, user) {
      this.checkCan('globalban');
      
      // Parse bulk input: userid1:url1:size1, userid2:url2:size2, ...
      const entries = target.split(',').map(s => s.trim()).filter(Boolean);
      if (entries.length === 0) return this.errorReply('No icons to set. Format: /icon setmany user1:url1:size1, user2:url2:size2');
      
      const documents: any[] = [];
      const now = new Date();
      
      for (const entry of entries) {
        const [name, url, sizeStr] = entry.split(':').map(s => s.trim());
        if (!name || !url) continue;
        
        const userId = toID(name);
        if (userId.length > 19) continue;
        
        let size = DEFAULT_ICON_SIZE;
        if (sizeStr) {
          const parsedSize = parseInt(sizeStr);
          if (!isNaN(parsedSize) && parsedSize >= 1 && parsedSize <= 100) {
            size = parsedSize;
          }
        }
        
        documents.push({
          _id: userId,
          url,
          size,
          createdAt: now,
          updatedAt: now,
        });
      }
      
      if (documents.length === 0) {
        return this.errorReply('No valid icons to set.');
      }
      
      // Use insertMany() for bulk inserts - much more efficient than multiple insertOne()
      try {
        await IconsDB.insertMany(documents);
        await updateIcons();
        this.sendReply(`|raw|Successfully set ${documents.length} custom icon(s).`);
        
        const staffRoom = Rooms.get(STAFF_ROOM_ID);
        if (staffRoom) {
          staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} bulk set ${documents.length} custom icons.</div>`).update();
        }
      } catch (err) {
        this.errorReply(`Error setting icons: ${err}`);
      }
    },
    
    async search(target, room, user) {
      this.checkCan('globalban');
      
      if (!target) return this.errorReply('Please provide a search term.');
      
      const searchTerm = toID(target);
      
      // Use find() with regex filter for searching
      const icons = await IconsDB.find({
        _id: { $regex: searchTerm, $options: 'i' } as any
      });
      
      if (icons.length === 0) {
        return this.sendReply(`No icons found matching "${target}".`);
      }
      
      let output = `<div class="ladder pad"><h2>Search Results for "${target}"</h2><table style="width: 100%"><tr><th>User</th><th>Icon</th><th>Size</th></tr>`;
      
      for (const icon of icons) {
        const size = icon.size || DEFAULT_ICON_SIZE;
        output += `<tr><td>${icon._id}</td><td><img src="${icon.url}" width="32" height="32"></td><td>${size}px</td></tr>`;
      }
      
      output += `</table></div>`;
      this.sendReply(`|raw|${output}`);
    },
    
    async count(target, room, user) {
      this.checkCan('globalban');
      
      // Use count() - most efficient way to get document count
      const total = await IconsDB.count({});
      this.sendReply(`There are currently ${total} custom icon(s) set.`);
    },
  },
  
  iconhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Custom Icon Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/icon set [username], [image url], [size in px]</code> - Gives [user] an icon with optional size (default: ${DEFAULT_ICON_SIZE}px, max: 100px)</li>` +
      `<li><code>/icon update [username], [image url], [size in px]</code> - Updates an existing icon's URL and/or size</li>` +
      `<li><code>/icon delete [username]</code> - Removes a user's icon</li>` +
      `<li><code>/icon setmany [user1:url1:size1, user2:url2:size2, ...]</code> - Bulk set multiple icons</li>` +
      `<li><code>/icon list [page]</code> - Lists all custom icons with pagination</li>` +
      `<li><code>/icon view [username]</code> - View details about a user's icon</li>` +
      `<li><code>/icon search [term]</code> - Search for icons by username</li>` +
      `<li><code>/icon count</code> - Show total number of custom icons</li>` +
      `</ul>` +
      `<small>All commands except view require @ or higher permission.</small>` +
      `</div>`
    );
  },
};
