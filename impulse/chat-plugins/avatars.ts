/*
* Pokemon Showdown
* Custom Avatars
* @license MIT
*/

import { FS } from '../../lib';
import '../utils';

const AVATAR_PATH = 'config/avatars/';
const AVATAR_LOG_PATH = 'logs/avatars.txt';
const STAFF_ROOM_ID = 'staff';
const VALID_EXTENSIONS = ['.jpg', '.png', '.gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const FETCH_TIMEOUT = 10000; // 10 seconds

// Get avatar base URL from config or use default
function getAvatarBaseUrl(): string {
  return Config.avatarurl || 'https://impulse-server.fun/avatars/';
}

async function logAvatarAction(action: string, staff: string, target: string, details?: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} | Staff: ${staff} | Target: ${target}${details ? ` | ${details}` : ''}\n`;
    await FS(AVATAR_LOG_PATH).append(logEntry);
  } catch (err) {
    console.error('Error writing to avatar log:', err);
  }
}

async function downloadImage(imageUrl: string, name: string, extension: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate URL format
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      return { success: false, error: 'Invalid URL format' };
    }

    // Only allow http/https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { success: false, error: 'Only HTTP/HTTPS URLs are allowed' };
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    let response;
    try {
      response = await fetch(imageUrl, { signal: controller.signal });
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        return { success: false, error: 'Request timed out' };
      }
      return { success: false, error: 'Failed to fetch image' };
    }
    clearTimeout(timeout);
    
    if (!response.ok) {
      return { success: false, error: `HTTP error ${response.status}` };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return { success: false, error: 'URL does not point to an image' };
    }
    
    // Check content length header
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return { success: false, error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` };
    }
    
    const buffer = await response.arrayBuffer();
    
    // Double-check actual size
    if (buffer.byteLength > MAX_FILE_SIZE) {
      return { success: false, error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` };
    }
    
    // Validate image magic bytes
    const uint8 = new Uint8Array(buffer);
    if (!isValidImage(uint8, extension)) {
      return { success: false, error: 'File content does not match extension or is corrupted' };
    }
    
    // Ensure directory exists
    await FS(AVATAR_PATH).parentDir().mkdirp();
    
    // Write file
    await FS(AVATAR_PATH + name + extension).write(Buffer.from(buffer));
    return { success: true };
  } catch (err) {
    console.error('Error downloading avatar:', err instanceof Error ? err.message : err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function isValidImage(bytes: Uint8Array, extension: string): boolean {
  if (bytes.length < 4) return false;
  
  if (extension === '.png') {
    // PNG magic bytes: 89 50 4E 47
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  } else if (extension === '.jpg') {
    // JPEG magic bytes: FF D8 FF
    return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  } else if (extension === '.gif') {
    // GIF magic bytes: 47 49 46 (GIF)
    return bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  }
  return false;
}

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  
  // Only get extension from the last part (ignore query parameters)
  const questionMark = filename.indexOf('?', lastDot);
  const ext = questionMark !== -1 
    ? filename.slice(lastDot, questionMark).toLowerCase()
    : filename.slice(lastDot).toLowerCase();
  
  return ext || '';
}

async function deleteAllUserAvatarFiles(userId: string): Promise<void> {
  // Delete all possible extensions for this user
  for (const ext of VALID_EXTENSIONS) {
    try {
      await FS(AVATAR_PATH + userId + ext).unlinkIfExists();
    } catch (err) {
      console.error(`Error deleting avatar file ${userId}${ext}:`, err);
    }
  }
}

export const commands: Chat.ChatCommands = {
  customavatar: {
    async set(target, room, user) {
      this.checkCan('bypassall');
      const [name, avatarUrl] = target.split(',').map(s => s.trim());
      if (!name || !avatarUrl) return this.parse('/help customavatar');
      
      const userId = toID(name);
      if (!userId) return this.errorReply('Invalid username.');
      
      const processedUrl = /^https?:\/\//i.test(avatarUrl) ? avatarUrl : `https://${avatarUrl}`;
      const ext = getExtension(processedUrl);
      
      if (!VALID_EXTENSIONS.includes(ext)) {
        return this.errorReply('Image URL must end with .jpg, .png, or .gif extension.');
      }

      // Delete all existing avatar files for this user (any extension)
      await deleteAllUserAvatarFiles(userId);

      // Download the new image
      this.sendReply('Downloading avatar...');
      const avatarFilename = userId + ext;
      const result = await downloadImage(processedUrl, userId, ext);
      
      if (!result.success) {
        await logAvatarAction('SET FAILED', user.name, userId, result.error);
        return this.errorReply(`Failed to download avatar: ${result.error}`);
      }

      // Use the new avatar system API to add the personal avatar
      if (!Users.Avatars.addPersonal(userId, avatarFilename)) {
        // Clean up the downloaded file if avatar system fails
        await FS(AVATAR_PATH + avatarFilename).unlinkIfExists();
        await logAvatarAction('SET FAILED', user.name, userId, 'Avatar system rejected');
        return this.errorReply(`Failed to set avatar in the system. User may already have this avatar.`);
      }

      // Save the avatars immediately
      Users.Avatars.save(true);

      // Log the successful action
      await logAvatarAction('SET', user.name, userId, `Filename: ${avatarFilename}, URL: ${processedUrl}`);

      this.sendReply(`|raw|${name}'s avatar was successfully set. Avatar:<p><img src='${getAvatarBaseUrl()}${avatarFilename}' width='80' height='80'></p>`);
      
      const targetUser = Users.get(userId);
      if (targetUser) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} set your custom avatar.<p><img src='${getAvatarBaseUrl()}${avatarFilename}' width='80' height='80'></p><p>Use <code>/avatars</code> to see your custom avatars!</p>`);
        // Update the user's current avatar
        targetUser.avatar = avatarFilename;
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"><center><strong>${Impulse.nameColor(user.name, true, true)} set custom avatar for ${Impulse.nameColor(userId, true, true)}:</strong><br><img src='${getAvatarBaseUrl()}${avatarFilename}' width='80' height='80'></center></div>`).update();
      }
    },
    
    async delete(target, room, user) {
      this.checkCan('bypassall');
      const userId = toID(target);
      
      if (!userId) return this.errorReply('Invalid username.');
      
      // Check if user has any custom avatars
      const userAvatars = Users.Avatars.avatars[userId];
      if (!userAvatars || !userAvatars.allowed.length) {
        return this.errorReply(`${target} does not have a custom avatar.`);
      }

      // Get the personal avatar (first in the allowed array)
      const personalAvatar = userAvatars.allowed[0];
      if (!personalAvatar || personalAvatar.startsWith('#')) {
        return this.errorReply(`${target} does not have a personal avatar.`);
      }

      try {
        // Remove from the avatar system first
        Users.Avatars.removeAllowed(userId, personalAvatar);
        Users.Avatars.save(true);
        
        // Delete all avatar files for this user
        await deleteAllUserAvatarFiles(userId);
        
        // Log the action
        await logAvatarAction('DELETE', user.name, userId, `Removed: ${personalAvatar}`);
        
        const targetUser = Users.get(userId);
        if (targetUser) {
          targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has deleted your custom avatar.`);
          // Reset to default avatar
          targetUser.avatar = 1;
        }
        
        this.sendReply(`${target}'s avatar has been removed.`);
        
        const staffRoom = Rooms.get(STAFF_ROOM_ID);
        if (staffRoom) {
          staffRoom.add(`|html|<div class="infobox"><strong>${Impulse.nameColor(user.name, true, true)} deleted custom avatar for ${Impulse.nameColor(userId, true, true)}.</strong></div>`).update(); 
        }
      } catch (err) {
        console.error('Error deleting avatar:', err);
        await logAvatarAction('DELETE FAILED', user.name, userId, err instanceof Error ? err.message : 'Unknown error');
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
      
      const baseUrl = getAvatarBaseUrl();
      let output = `<div class="ladder pad"><h2>Custom Avatars (Page ${page}/${totalPages})</h2><table style="width: 100%"><tr><th>User</th><th>Avatar</th><th>Filename</th></tr>`;
      
      for (const [userid, filename] of pageEntries) {
        const avatarPath = `${baseUrl}${filename}`;
        output += `<tr><td>${Impulse.nameColor(userid, true, true)}</td><td><img src="${avatarPath}" width="80" height="80"></td><td>${Chat.escapeHTML(filename)}</td></tr>`;
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
      const avatarPath = `${getAvatarBaseUrl()}${avatarFilename}`;
      
      this.sendReplyBox(
        `<strong>Custom Avatar for ${Chat.escapeHTML(target)}:</strong><br />` +
        `<img src="${avatarPath}" width="80" height="80"><br />` +
        `<strong>Filename:</strong> ${Chat.escapeHTML(avatarFilename)}`
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
      
      const baseUrl = getAvatarBaseUrl();
      let output = `<div class="ladder pad"><h2>Search Results for "${Chat.escapeHTML(target)}"</h2><table style="width: 100%"><tr><th>User</th><th>Avatar</th></tr>`;
      
      for (const [userid, filename] of results) {
        const avatarPath = `${baseUrl}${filename}`;
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

    async logs(target, room, user) {
      this.checkCan('bypassall');
      
      try {
        const logContent = await FS(AVATAR_LOG_PATH).readIfExists();
        
        if (!logContent) {
          return this.sendReply('No avatar logs found.');
        }
        
        const lines = logContent.trim().split('\n');
        const numLines = parseInt(target) || 50;
        
        if (numLines < 1 || numLines > 500) {
          return this.errorReply('Please specify a number between 1 and 500.');
        }
        
        // Get the last N lines
        const recentLines = lines.slice(-numLines);
        
        let output = `<div class="ladder pad"><h2>Avatar Logs (Last ${recentLines.length} entries)</h2>`;
        output += `<div style="max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 11px; white-space: pre-wrap;">`;
        output += Chat.escapeHTML(recentLines.join('\n'));
        output += `</div></div>`;
        
        this.sendReply(`|raw|${output}`);
      } catch (err) {
        console.error('Error reading avatar logs:', err);
        return this.errorReply('Failed to read avatar logs.');
      }
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
      `<li><code>/customavatar logs [number]</code> - View recent avatar log entries (default: 50, max: 500)</li>` +
      `</ul>` +
      `<small>All commands except view require ~ or higher permission.</small>` +
      `<br><small>Note: This integrates with the main avatar system. Users can view their avatars with <code>/avatars</code>.</small>` +
      `<br><small>Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.</small>` +
      `</div>`
    );
  },	
};
