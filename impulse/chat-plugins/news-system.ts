/*
* Pokemon Showdown
* News System
* Instructions:
* Add this code inside server/users.ts
* handleRename function
Impulse.NewsManager.onUserConnect(user);
*/

import { FS } from '../../lib';
import { ImpulseDB } from '../../impulse/impulse-db';

const NEWS_LOG_PATH = 'logs/news.txt';

interface NewsEntry {
  _id?: any; // MongoDB automatically generates this
  title: string;
  postedBy: string;
  desc: string;
  postTime: string;
  timestamp: number;
}

// Get typed MongoDB collection
const NewsDB = ImpulseDB<NewsEntry>('news');

async function logNewsAction(action: string, staff: string, target: string, details?: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} | Staff: ${staff} | Target: ${target}${details ? ` | ${details}` : ''}\n`;
    await FS(NEWS_LOG_PATH).append(logEntry);
  } catch (err) {
    console.error('Error writing to news log:', err);
  }
}

class NewsManager {
  static async generateNewsDisplay(): Promise<string[]> {
    // Use find with sort and limit options for efficient sorted queries
    const news = await NewsDB.find(
      {},
      {
        sort: { timestamp: -1 },
        limit: 3,
        projection: { title: 1, desc: 1, postedBy: 1, postTime: 1 }
      }
    );
    
    return news.map(entry =>
      `<center><strong>${entry.title}</strong></center><br>` +
      `${entry.desc}<br><br>` +
      `<small>-<em> ${Impulse.nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
    );
  }
  
  static async onUserConnect(user: User): Promise<void> {
    // More efficient: check if any news exists first before fetching
    const hasNews = await NewsDB.exists({});
    if (!hasNews) {
      return; // Don't send anything if no news exists
    }
    
    const news = await this.generateNewsDisplay();
    if (news.length) {
      user.send(`|pm| ${Impulse.serverName} News|${user.getIdentity()}|/raw ${news.join('<hr>')}`);
    }
  }
  
  static async addNews(title: string, desc: string, user: User): Promise<string> {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    const newsEntry: NewsEntry = {
      title,
      postedBy: user.name,
      desc,
      postTime: `${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`,
      timestamp: now.getTime()
    };
    
    // Use insertOne for atomic insert
    await NewsDB.insertOne(newsEntry);
    return `Added Server News: ${title}`;
  }
  
  static async deleteNews(title: string): Promise<string | null> {
    // Use atomic deleteOne and check deletedCount
    const result = await NewsDB.deleteOne({ title });
    
    if (result.deletedCount === 0) {
      return `News with this title doesn't exist.`;
    }
    
    return `Deleted Server News titled: ${title}.`;
  }
  
  static async updateNews(title: string, newDesc: string): Promise<string | null> {
    // Atomic update operation with $set and check modifiedCount
    const result = await NewsDB.updateOne(
      { title },
      { $set: { desc: newDesc } }
    );
    
    if (result.matchedCount === 0) {
      return `News with this title doesn't exist.`;
    }
    
    return `Updated news titled: ${title}.`;
  }
  
  static async getAllNews(): Promise<NewsEntry[]> {
    // Fetch all news sorted by timestamp descending
    return await NewsDB.find(
      {},
      { sort: { timestamp: -1 } }
    );
  }
  
  static async getNewsByTitle(title: string): Promise<NewsEntry | null> {
    // Efficient single document lookup
    return await NewsDB.findOne({ title });
  }
  
  static async getRecentNews(limit: number = 5): Promise<NewsEntry[]> {
    // Get most recent N news items
    return await NewsDB.find(
      {},
      {
        sort: { timestamp: -1 },
        limit
      }
    );
  }
  
  static async deleteOldNews(daysOld: number = 90): Promise<number> {
    // Delete news older than specified days and return deletedCount
    const cutoffTimestamp = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    const result = await NewsDB.deleteMany({ timestamp: { $lt: cutoffTimestamp } });
    return result.deletedCount || 0;
  }
  
  static async getNewsCount(): Promise<number> {
    // Efficient count operation
    return await NewsDB.countDocuments({});
  }
}

Impulse.NewsManager = NewsManager;

export const commands: Chat.ChatCommands = {
  servernews: {
    '': 'view',
    display: 'view',
    async view(target, room, user) {
      const newsDisplay = await NewsManager.generateNewsDisplay();
      const output = newsDisplay.length 
        ? `<center><strong>Server News:</strong></center>${newsDisplay.join('<hr>')}`
        : `<center><strong>Server News:</strong></center><center><em>No news available.</em></center>`;
      
      if (this.broadcasting) {
        return this.sendReplyBox(`<div class="infobox-limited">${output}</div>`);
      }
      user.send(`|popup||wide||html|<div class="infobox">${output}</div>`);
    },
    
    async add(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.parse('/help servernewshelp');
      const [title, ...descParts] = target.split(',');
      if (!descParts.length) return this.errorReply("Usage: /news add [title], [desc]");
      
      const trimmedTitle = title.trim();
      const trimmedDesc = descParts.join(',').trim();
      
      // Check if news with this title already exists using exists()
      const existing = await NewsDB.exists({ title: trimmedTitle });
      if (existing) {
        return this.errorReply(`News with title "${trimmedTitle}" already exists. Use /servernews update to modify it.`);
      }
      
      await NewsManager.addNews(trimmedTitle, trimmedDesc, user);
      
      // Log the action
      await logNewsAction('ADD', user.name, trimmedTitle, `Description: ${trimmedDesc.substring(0, 100)}${trimmedDesc.length > 100 ? '...' : ''}`);
      
      this.sendReply(`You have added news with title "${trimmedTitle}"`);
    },
    
    async update(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.parse('/help servernewshelp');
      const [title, ...descParts] = target.split(',');
      if (!descParts.length) return this.errorReply("Usage: /news update [title], [new desc]");
      
      const trimmedTitle = title.trim();
      const newDesc = descParts.join(',').trim();
      
      // Get old description before updating for logging
      const oldNews = await NewsManager.getNewsByTitle(trimmedTitle);
      
      const result = await NewsManager.updateNews(trimmedTitle, newDesc);
      if (result?.includes("doesn't exist")) {
        return this.errorReply(result);
      }
      
      // Log the action
      const oldDescPreview = oldNews?.desc ? oldNews.desc.substring(0, 50) : 'N/A';
      const newDescPreview = newDesc.substring(0, 50);
      await logNewsAction('UPDATE', user.name, trimmedTitle, `Old: ${oldDescPreview}..., New: ${newDescPreview}...`);
      
      this.sendReply(`You've updated news with title "${trimmedTitle}"`);
    },
    
    remove: 'delete',
    async delete(target, room, user) {
      this.checkCan('globalban');
      if (!target) return this.parse('/help servernewshelp');
      
      const trimmedTitle = target.trim();
      
      // Get news details before deletion for logging
      const newsItem = await NewsManager.getNewsByTitle(trimmedTitle);
      
      const result = await NewsManager.deleteNews(trimmedTitle);
      
      if (result?.includes("doesn't exist")) {
        return this.errorReply(result);
      }
      
      // Log the action
      const details = newsItem ? `Posted by: ${newsItem.postedBy}, Date: ${newsItem.postTime}` : 'Details unavailable';
      await logNewsAction('DELETE', user.name, trimmedTitle, details);
      
      this.sendReply(`You've removed news with title "${trimmedTitle}"`);
    },
    
    async count(target, room, user) {
      const count = await NewsManager.getNewsCount();
      this.sendReplyBox(`There ${count === 1 ? 'is' : 'are'} currently <strong>${count}</strong> news ${count === 1 ? 'item' : 'items'}.`);
    },
    
    async cleanup(target, room, user) {
      this.checkCan('bypassall');
      const days = parseInt(target) || 90;
      
      if (days < 1) {
        return this.errorReply('Days must be a positive number.');
      }
      
      const deletedCount = await NewsManager.deleteOldNews(days);
      
      // Log the action
      await logNewsAction('CLEANUP', user.name, `${deletedCount} items`, `Removed news older than ${days} days`);
      
      this.sendReply(`Deleted ${deletedCount} news item(s) older than ${days} days.`);
    },

    async logs(target, room, user) {
      this.checkCan('globalban');
      
      try {
        const logContent = await FS(NEWS_LOG_PATH).readIfExists();
        
        if (!logContent) {
          return this.sendReply('No news logs found.');
        }
        
        const lines = logContent.trim().split('\n');
        const numLines = parseInt(target) || 50;
        
        if (numLines < 1 || numLines > 500) {
          return this.errorReply('Please specify a number between 1 and 500.');
        }
        
        // Get the last N lines and reverse to show latest first
        const recentLines = lines.slice(-numLines).reverse();
        
        let output = `<div class="ladder pad"><h2>News Logs (Last ${recentLines.length} entries - Latest First)</h2>`;
        output += `<div style="max-height: 370px; overflow: auto; font-family: monospace; font-size: 11px;">`;
        
        // Add each log entry with a horizontal line separator
        for (let i = 0; i < recentLines.length; i++) {
          output += `<div style="padding: 8px 0;">${Chat.escapeHTML(recentLines[i])}</div>`;
          if (i < recentLines.length - 1) {
            output += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 0;">`;
          }
        }
        
        output += `</div></div>`;
        
        this.sendReply(`|raw|${output}`);
      } catch (err) {
        console.error('Error reading news logs:', err);
        return this.errorReply('Failed to read news logs.');
      }
    },
  },

  servernewshelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Server News Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/servernews view</code> - Views current server news (latest 3 items)</li>` +
      `<li><code>/servernews add [title], [desc]</code> - Adds news</li>` +
      `<li><code>/servernews update [title], [new desc]</code> - Updates existing news</li>` +
      `<li><code>/servernews delete [title]</code> - Deletes news with [title]</li>` +
      `<li><code>/servernews count</code> - Shows total number of news items</li>` +
      `<li><code>/servernews cleanup [days]</code> - Delete news older than [days] (default: 90)</li>` +
      `<li><code>/servernews logs [number]</code> - View recent news log entries (default: 50, max: 500)</li>` +
      `</ul>` +
      `<small>Commands add, update, delete, and logs require @ or higher permission. Command cleanup requires ~ permission.</small>` +
      `</div>`
    );
  },
};
