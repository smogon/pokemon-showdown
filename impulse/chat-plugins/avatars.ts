/*
* Pokemon Showdown
* Custom Avatars
* @license MIT
*/

import { FS } from '../../lib';

const AVATAR_PATH = 'config/avatars/';
const STAFF_ROOM_ID = 'staff';
const VALID_EXTENSIONS = ['.jpg', '.png', '.gif'];

async function downloadImage(imageUrl: string, name: string, extension: string): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return;

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) return;
    
    const buffer = await response.arrayBuffer();
    await FS(AVATAR_PATH + name + extension).write(Buffer.from(buffer));
  } catch (err) {
    console.error('Error downloading avatar:', err);
  }
}

function getExtension(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.'));
  return ext || '';
}

export const commands: Chat.ChatCommands = {
  customavatar: {
    async set(target, room, user) {
      this.checkCan('bypassall');
      const [name, avatarUrl] = target.split(',').map(s => s.trim());
      if (!name || !avatarUrl) return this.parse('/help customavatar');
      
      const userId = toID(name);
      const processedUrl = /^https?:\/\//i.test(avatarUrl) ? avatarUrl : `http://${avatarUrl}`;
      const ext = getExtension(processedUrl);
      if (!VALID_EXTENSIONS.includes(ext)) {
        return this.errorReply('Image must have .jpg, .png, or .gif extension.');
      }

      // Check if user already has a personal avatar and remove the old file
      const userAvatars = Users.Avatars.avatars[userId];
      if (userAvatars && userAvatars.allowed[0]) {
        const oldPersonalAvatar = userAvatars.allowed[0];
        // Only delete if it's a local file (not starting with #)
        if (oldPersonalAvatar && !oldPersonalAvatar.startsWith('#')) {
          try {
            await FS(AVATAR_PATH + oldPersonalAvatar).unlinkIfExists();
          } catch (err) {
            console.error('Error deleting old avatar file:', err);
          }
        }
      }

      // Download the new image to config/avatars/
      const avatarFilename = userId + ext;
      await downloadImage(processedUrl, userId, ext);

      // Use the new avatar system API to add the personal avatar
      const avatar = avatarFilename;
      if (!Users.Avatars.addPersonal(userId, avatar)) {
        return this.errorReply(`Failed to set avatar. User may already have this avatar.`);
      }

      // Save the avatars immediately
      Users.Avatars.save(true);

      this.sendReply(`|raw|${name}'s avatar was successfully set. Avatar:<p><img src='${processedUrl}' width='80' height='80'></p>`);
      
      const targetUser = Users.get(userId);
      if (targetUser) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} set your custom avatar.<p><img src='${processedUrl}' width='80' height='80'></p><p>Use <code>/avatars</code> to see your custom avatars!</p>`);
        // Update the user's current avatar
        targetUser.avatar = avatar;
      }
      
      let staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"><center><strong>${Impulse.nameColor(user.name, true, true)} set custom avatar for ${Impulse.nameColor(userId, true, true)}:</strong><br><img src='${processedUrl}' width='80' height='80'></center></div>`).update();
      }
    },
    
    async delete(target, room, user) {
      this.checkCan('bypassall');
      const userId = toID(target);
      
      // Check if user has any custom avatars
      const userAvatars = Users.Avatars.avatars[userId];
      if (!userAvatars || !userAvatars.allowed.length) {
        return this.errorReply(`${target} does not have a custom avatar.`);
      }

      // Get the personal avatar (first in the allowed array)
      const personalAvatar = userAvatars.allowed[0];
      if (!personalAvatar) {
        return this.errorReply(`${target} does not have a personal avatar.`);
      }

      try {
        // Delete the physical file
        await FS(AVATAR_PATH + personalAvatar).unlinkIfExists();
        
        // Remove from the avatar system
        Users.Avatars.removeAllowed(userId, personalAvatar);
        Users.Avatars.save(true);
        
        const targetUser = Users.get(userId);
        if (targetUser) {
          targetUser.popup(`|html|${Impulse.nameColor(this.user.name, true, true)} has deleted your custom avatar.`);
          // Reset to default avatar
          targetUser.avatar = 1;
        }
        
        this.sendReply(`${target}'s avatar has been removed.`);
        
        let staffRoom = Rooms.get(STAFF_ROOM_ID);
        if (staffRoom) {
          staffRoom.add(`|html|<div class="infobox"><strong>${Impulse.nameColor(this.user.name, true, true)} deleted custom avatar for ${Impulse.nameColor(userId, true, true)}.</strong></div>`).update(); 
        }
      } catch (err) {
        console.error('Error deleting avatar:', err);
        return this.errorReply('An error occurred while deleting the avatar.');
      }
    },
    
    async list(target, room, user) {
      this.checkCan('bypassall');
      
      const avatarsData = Users.Avatars.avatars;
      const customAvatars: [string, string][] = [];
      
      // Filter users with custom avatars (personal avatars that aren't default #IDs)
      for (const userid in avatarsData) {
        const userAvatar = avatarsData[userid];
        if (userAvatar.allowed.length && userAvatar.allowed[0] && !userAvatar.allowed[0].startsWith('#')) {
          customAvatars.push([userid, userAvatar.allowed[0]]);
        }
      }
      
      if (customAvatars.length === 0) {
        return this.sendReply('No custom avatars have been set.');
      }
      
      // Sort alphabetically
      customAvatars.sort((a, b) => a[0].localeCompare(b[0]));
      
      const page = parseInt(target) || 1;
      const itemsPerPage = 20;
      const totalPages = Math.ceil(customAvatars.length / itemsPerPage);
      
      if (page < 1 || page > totalPages) {
        return this.errorReply(`Invalid page number. Please use a page between 1 and ${totalPages}.`);
      }
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageEntries = customAvatars.slice(startIndex, endIndex);
      
      let output = `<div class="ladder pad"><h2>Custom Avatars (Page ${page}/${totalPages})</h2><table style="width: 100%"><tr><th>User</th><th>Avatar</th><th>Filename</th></tr>`;
      
      for (const [userid, filename] of pageEntries) {
        const avatarPath = `https://impulse-server.fun/avatars/${filename}`;
        output += `<tr><td>${Impulse.nameColor(userid, true, true)}</td><td><img src="${avatarPath}" width="80" height="80"></td><td>${filename}</td></tr>`;
      }
      
      output += `</table></div>`;
      
      if (totalPages > 1) {
        output += `<div class="pad"><center>`;
        if (page > 1) {
          output += `<button class="button" name="send" value="/customavatar list ${page - 1}">Previous</button> `;
        }
        if (page < totalPages) {
          output += `<button class="button" name="send" value="/customavatar list ${page + 1}">Next</button>`;
        }
        output += `</center></div>`;
      }
      
      this.sendReply(`|raw|${output}`);
    },
    
    async view(target, room, user) {
      const userId = toID(target);
      if (!userId) return this.parse('/help customavatar');
      
      const userAvatars = Users.Avatars.avatars[userId];
      if (!userAvatars || !userAvatars.allowed.length || !userAvatars.allowed[0] || userAvatars.allowed[0].startsWith('#')) {
        return this.sendReply(`${target} does not have a custom avatar.`);
      }
      
      const avatarFilename = userAvatars.allowed[0];
      const avatarPath = `https://impulse-server.fun/avatars/${avatarFilename}`;
      
      this.sendReplyBox(
        `<strong>Custom Avatar for ${target}:</strong><br />` +
        `<img src="${avatarPath}" width="80" height="80"><br />` +
        `<strong>Filename:</strong> ${avatarFilename}`
      );
    },
    
    async search(target, room, user) {
      this.checkCan('bypassall');
      
      if (!target) return this.errorReply('Please provide a search term.');
      
      const searchTerm = toID(target);
      const avatarsData = Users.Avatars.avatars;
      const results: [string, string][] = [];
      
      for (const userid in avatarsData) {
        if (userid.includes(searchTerm)) {
          const userAvatar = avatarsData[userid];
          if (userAvatar.allowed.length && userAvatar.allowed[0] && !userAvatar.allowed[0].startsWith('#')) {
            results.push([userid, userAvatar.allowed[0]]);
          }
        }
      }
      
      if (results.length === 0) {
        return this.sendReply(`No custom avatars found matching "${target}".`);
      }
      
      let output = `<div class="ladder pad"><h2>Search Results for "${target}"</h2><table style="width: 100%"><tr><th>User</th><th>Avatar</th></tr>`;
      
      for (const [userid, filename] of results) {
        const avatarPath = `https://impulse-server.fun/avatars/${filename}`;
        output += `<tr><td>${Impulse.nameColor(userid, true, true)}</td><td><img src="${avatarPath}" width="80" height="80"></td></tr>`;
      }
      
      output += `</table></div>`;
      this.sendReply(`|raw|${output}`);
    },
    
    async count(target, room, user) {
      this.checkCan('bypassall');
      
      const avatarsData = Users.Avatars.avatars;
      let count = 0;
      
      for (const userid in avatarsData) {
        const userAvatar = avatarsData[userid];
        if (userAvatar.allowed.length && userAvatar.allowed[0] && !userAvatar.allowed[0].startsWith('#')) {
          count++;
        }
      }
      
      this.sendReply(`There are currently ${count} custom avatar(s) set.`);
    },
  },
   
  customavatarhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Custom Avatar Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/customavatar set [username], [image url]</code> - Sets a user's personal avatar</li>` +
      `<li><code>/customavatar delete [username]</code> - Removes a user's personal avatar</li>` +
      `<li><code>/customavatar list [page]</code> - Lists all custom avatars with pagination</li>` +
      `<li><code>/customavatar view [username]</code> - View details about a user's custom avatar</li>` +
      `<li><code>/customavatar search [term]</code> - Search for custom avatars by username</li>` +
      `<li><code>/customavatar count</code> - Show total number of custom avatars</li>` +
      `</ul>` +
      `<small>All commands except view require ~ or higher permission.</small>` +
      `<br><small>Note: This integrates with the main avatar system. Users can view their avatars with <code>/avatars</code>.</small>` +
      `</div>`
    );
  },	
};
