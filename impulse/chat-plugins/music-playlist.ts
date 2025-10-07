/*
* Pokemon Showdown
* Music Playlist - Refactored with Atomic Operations
* @author ClarkJ338
* @license MIT
*/

import { Utils } from '../../lib';
import { MongoDB } from '../../impulse/mongodb_module';

interface PlaylistEntry {
  url: string;
  title: string;
  type: 'youtube' | 'youtube-music' | 'spotify' | 'apple-music' | 'soundcloud';
  addedAt: number;
}

interface PlaylistDocument {
  _id: string; // userid
  songs: PlaylistEntry[];
  lastUpdated: Date;
}

interface RateLimitData {
  [userid: string]: {
    requests: number;
    resetTime: number;
  };
}

// Get typed MongoDB collection
const PlaylistDB = MongoDB<PlaylistDocument>('playlists');

export class MusicPlaylist {
  private static rateLimits: RateLimitData = {};
  private static readonly MAX_PLAYLIST_SIZE = 20;
  private static readonly RATE_LIMIT_REQUESTS = 10;
  private static readonly RATE_LIMIT_WINDOW = 60000; // 1 minute

  static async addSong(userid: string, url: string, title: string, type: PlaylistEntry['type']): Promise<{success: boolean, error?: string}> {
    const id = toID(userid);
    
    // Get current playlist
    const doc = await PlaylistDB.findById(id);
    const currentSongs = doc?.songs || [];

    // Check playlist size limit
    if (currentSongs.length >= this.MAX_PLAYLIST_SIZE) {
      return {success: false, error: `Playlist limit reached (${this.MAX_PLAYLIST_SIZE} songs maximum)`};
    }

    // Check for duplicate URL
    const isDuplicate = currentSongs.some(entry => entry.url === url);
    if (isDuplicate) {
      return {success: false, error: "This URL is already in your playlist"};
    }

    const newSong: PlaylistEntry = {
      url,
      title,
      type,
      addedAt: Date.now()
    };

    // Use atomic $push to add song
    await PlaylistDB.findOneAndUpdate(
      { _id: id },
      { 
        $push: { songs: newSong },
        $set: { lastUpdated: new Date() },
        $setOnInsert: { _id: id }
      },
      { upsert: true }
    );

    return {success: true};
  }

  static async removeSong(userid: string, index: number): Promise<boolean> {
    const id = toID(userid);
    
    // Get current playlist
    const doc = await PlaylistDB.findById(id);
    if (!doc || !doc.songs || index < 1 || index > doc.songs.length) {
      return false;
    }

    // Create new array without the removed song
    const newSongs = [...doc.songs];
    newSongs.splice(index - 1, 1);

    // Use atomic update to replace songs array
    await PlaylistDB.updateOne(
      { _id: id },
      { 
        $set: { 
          songs: newSongs,
          lastUpdated: new Date()
        }
      }
    );

    return true;
  }

  static async getPlaylist(userid: string): Promise<PlaylistEntry[]> {
    const id = toID(userid);
    const doc = await PlaylistDB.findById(id);
    return doc?.songs || [];
  }

  static checkRateLimit(userid: string): boolean {
    const id = toID(userid);
    const now = Date.now();

    if (!this.rateLimits[id]) {
      this.rateLimits[id] = {requests: 0, resetTime: now + this.RATE_LIMIT_WINDOW};
    }

    // Reset if window has passed
    if (now > this.rateLimits[id].resetTime) {
      this.rateLimits[id] = {requests: 0, resetTime: now + this.RATE_LIMIT_WINDOW};
    }

    // Check if over limit
    if (this.rateLimits[id].requests >= this.RATE_LIMIT_REQUESTS) {
      return false;
    }

    this.rateLimits[id].requests++;
    return true;
  }

  static async clearPlaylist(userid: string): Promise<void> {
    const id = toID(userid);
    // Use atomic deleteOne to remove entire playlist
    await PlaylistDB.deleteOne({ _id: id });
  }

  static async getPlaylistCount(userid: string): Promise<number> {
    const id = toID(userid);
    const doc = await PlaylistDB.findById(id);
    return doc?.songs?.length || 0;
  }

  static async hasPlaylist(userid: string): Promise<boolean> {
    const id = toID(userid);
    return await PlaylistDB.exists({ _id: id });
  }

  static async removeSongByUrl(userid: string, url: string): Promise<boolean> {
    const id = toID(userid);
    
    // Use atomic $pull to remove song by URL
    const result = await PlaylistDB.updateOne(
      { _id: id },
      { 
        $pull: { songs: { url } },
        $set: { lastUpdated: new Date() }
      }
    );

    return result > 0;
  }

  static async reorderSong(userid: string, fromIndex: number, toIndex: number): Promise<boolean> {
    const id = toID(userid);
    const doc = await PlaylistDB.findById(id);
    
    if (!doc || !doc.songs || fromIndex < 1 || toIndex < 1 || 
        fromIndex > doc.songs.length || toIndex > doc.songs.length) {
      return false;
    }

    const newSongs = [...doc.songs];
    const [movedSong] = newSongs.splice(fromIndex - 1, 1);
    newSongs.splice(toIndex - 1, 0, movedSong);

    await PlaylistDB.updateOne(
      { _id: id },
      { 
        $set: { 
          songs: newSongs,
          lastUpdated: new Date()
        }
      }
    );

    return true;
  }

  static async getTopPlaylists(limit: number = 10): Promise<{userid: string, songCount: number}[]> {
    // Use aggregation to get users with most songs
    const results = await PlaylistDB.aggregate([
      {
        $project: {
          _id: 1,
          songCount: { $size: { $ifNull: ["$songs", []] } }
        }
      },
      { $match: { songCount: { $gt: 0 } } },
      { $sort: { songCount: -1 } },
      { $limit: limit }
    ]);

    return results.map(r => ({
      userid: r._id,
      songCount: r.songCount
    }));
  }

  static async getAllPlaylists(): Promise<PlaylistDocument[]> {
    // Get all playlists sorted by last updated
    return await PlaylistDB.findSorted({}, { lastUpdated: -1 });
  }

  static async searchPlaylists(query: string): Promise<{userid: string, songs: PlaylistEntry[]}[]> {
    // Search for playlists containing songs with titles matching query
    const allPlaylists = await PlaylistDB.find({});
    
    return allPlaylists
      .map(doc => ({
        userid: doc._id,
        songs: doc.songs.filter(song => 
          song.title.toLowerCase().includes(query.toLowerCase())
        )
      }))
      .filter(result => result.songs.length > 0);
  }

  static async getPlaylistsByPlatform(platform: PlaylistEntry['type']): Promise<{userid: string, count: number}[]> {
    // Use aggregation to count songs by platform
    const results = await PlaylistDB.aggregate([
      { $unwind: "$songs" },
      { $match: { "songs.type": platform } },
      { 
        $group: {
          _id: "$_id",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return results.map(r => ({
      userid: r._id,
      count: r.count
    }));
  }

  static async getTotalStats(): Promise<{totalPlaylists: number, totalSongs: number, avgSongsPerPlaylist: number}> {
    const stats = await PlaylistDB.aggregate([
      {
        $group: {
          _id: null,
          totalPlaylists: { $sum: 1 },
          totalSongs: { $sum: { $size: { $ifNull: ["$songs", []] } } }
        }
      }
    ]);

    if (stats.length === 0) {
      return { totalPlaylists: 0, totalSongs: 0, avgSongsPerPlaylist: 0 };
    }

    const result = stats[0];
    return {
      totalPlaylists: result.totalPlaylists,
      totalSongs: result.totalSongs,
      avgSongsPerPlaylist: result.totalPlaylists > 0 ? 
        Math.round((result.totalSongs / result.totalPlaylists) * 10) / 10 : 0
    };
  }
}

function detectPlatform(url: string): {type: PlaylistEntry['type'], id: string} | null {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch) {
    return {type: 'youtube', id: youtubeMatch[1]};
  }

  // YouTube Music
  const ytMusicMatch = url.match(/music\.youtube\.com\/watch\?v=([^"&?\/\s]{11})/);
  if (ytMusicMatch) {
    return {type: 'youtube-music', id: ytMusicMatch[1]};
  }

  // Spotify
  const spotifyMatch = url.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return {type: 'spotify', id: spotifyMatch[2]};
  }

  // Apple Music
  const appleMusicMatch = url.match(/music\.apple\.com\/[a-z]{2}\/(album|song|playlist)\/[^\/]+\/(\d+)/);
  if (appleMusicMatch) {
    return {type: 'apple-music', id: appleMusicMatch[2]};
  }

  // SoundCloud
  const soundcloudMatch = url.match(/soundcloud\.com\/[^\/]+\/[^\/]+/);
  if (soundcloudMatch) {
    return {type: 'soundcloud', id: url.split('/').pop() || ''};
  }

  return null;
}

function getYouTubeTitle(videoId: string): Promise<string> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve('Unknown Title'), 5000);
    
    const options = {
      hostname: 'noembed.com',
      path: `/embed?url=https://www.youtube.com/watch?v=${videoId}`,
      headers: {'User-Agent': 'PSMusicPlaylist/1.0'},
      timeout: 5000,
    };
    
    require('https').get(options, (res: any) => {
      let data = '';
      res.on('data', (chunk: string) => {
        data += chunk;
      });
      res.on('end', () => {
        clearTimeout(timeout);
        try {
          const json = JSON.parse(data);
          resolve(json.title || 'Unknown Title');
        } catch (e) {
          resolve('Unknown Title');
        }
      });
    }).on('error', () => {
      clearTimeout(timeout);
      resolve('Unknown Title');
    });
  });
}

export const pages: Chat.PageTable = {
  async playliststats(args, user) {
    const stats = await MusicPlaylist.getTotalStats();
    const topPlaylists = await MusicPlaylist.getTopPlaylists(10);

    let topPlaylistsHTML = '';
    if (topPlaylists.length > 0) {
      topPlaylistsHTML = topPlaylists.map((p, i) => 
        `<tr><td>${i + 1}</td><td>${Impulse.nameColor(p.userid, true, true)}</td><td>${p.songCount}</td></tr>`
      ).join('');
    } else {
      topPlaylistsHTML = '<tr><td colspan="3"><em>No playlists yet</em></td></tr>';
    }

    let buf = ``;
    buf += `<div class="pad">`;
    buf += `<h2>Playlist Statistics</h2>`;
    buf += `<div class="infobox">`;
    buf += `<h3>Overall Stats</h3>`;
    buf += `<ul>`;
    buf += `<li><strong>Total Playlists:</strong> ${stats.totalPlaylists}</li>`;
    buf += `<li><strong>Total Songs:</strong> ${stats.totalSongs}</li>`;
    buf += `<li><strong>Average Songs per Playlist:</strong> ${stats.avgSongsPerPlaylist}</li>`;
    buf += `</ul>`;
    buf += `</div>`;
    buf += `<h3>Top 10 Playlists</h3>`;
    buf += `<table class="ladder" style="width: 100%;">`;
    buf += `<thead>`;
    buf += `<tr>`;
    buf += `<th>Rank</th>`;
    buf += `<th>User</th>`;
    buf += `<th>Songs</th>`;
    buf += `</tr>`;
    buf += `</thead>`;
    buf += `<tbody>`;
    buf += topPlaylistsHTML;
    buf += `</tbody>`;
    buf += `</table>`;
    buf += `</div>`;
    return buf;
  },
};

export const commands: Chat.ChatCommands = {
  playlist: {
    ''(target, room, user) {
      this.parse(`/playlisthelp`);
    },
    
    async add(target, room, user) {
      if (!target) {
        return this.errorReply("Usage: /playlist add <URL> or /playlist add <URL>, <title> for non-YouTube platforms");
      }
      
      // Rate limiting
      if (!MusicPlaylist.checkRateLimit(user.id)) {
        return this.errorReply("Rate limit exceeded. Please wait before adding more songs.");
      }

      const parts = target.split(',').map(part => part.trim());
      const urlStr = parts[0];
      const providedTitle = parts[1];

      let url: URL;
      try {
        url = new URL(urlStr);
      } catch {
        return this.errorReply("Invalid URL format.");
      }

      const platform = detectPlatform(urlStr);
      if (!platform) {
        return this.errorReply("Unsupported platform. Only YouTube, YouTube Music, Spotify, Apple Music, and SoundCloud URLs are allowed.");
      }

      let title: string;
      if (platform.type === 'youtube' || platform.type === 'youtube-music') {
        title = await getYouTubeTitle(platform.id);
      } else {
        if (!providedTitle) {
          return this.errorReply("For Spotify, Apple Music, and SoundCloud, please provide a title: /playlist add <URL>, <title>");
        }
        title = providedTitle;
      }

      const result = await MusicPlaylist.addSong(user.id, urlStr, title, platform.type);
      if (!result.success) {
        return this.errorReply(result.error!);
      }

      const count = await MusicPlaylist.getPlaylistCount(user.id);
      this.sendReply(`Added "${title}" to your personal playlist. (${count}/${MusicPlaylist['MAX_PLAYLIST_SIZE']})`);
    },

    async remove(target, room, user) {
      if (!target || isNaN(parseInt(target))) return this.errorReply("Usage: /playlist remove <index>");
      const index = parseInt(target);
      const success = await MusicPlaylist.removeSong(user.id, index);
      if (success) {
        const count = await MusicPlaylist.getPlaylistCount(user.id);
        this.sendReply(`Removed song at index ${index} from your personal playlist. (${count} songs remaining)`);
      } else {
        this.errorReply(`Invalid index or no playlist.`);
      }
    },

    async share(target, room, user) {
      if (!this.runBroadcast()) return;
      const playlist = await MusicPlaylist.getPlaylist(user.id);
      if (playlist.length === 0) {
        return this.sendReply(`Your personal playlist is empty.`);
      }
      
      let buf = ``;
      buf += `<b>${Utils.escapeHTML(user.name)}'s personal playlist (${playlist.length} songs):</b><br />`;
      playlist.forEach((entry, idx) => {
        const platformIcon = this.getPlatformIcon(entry.type);
        buf += `${idx + 1}. ${platformIcon} <a href="${Utils.escapeHTML(entry.url)}" target="_blank">${Utils.escapeHTML(entry.title)}</a><br />`;
      });
      this.sendReplyBox(buf);
    },

    async clear(target, room, user) {
      await MusicPlaylist.clearPlaylist(user.id);
      this.sendReply(`Cleared your personal playlist.`);
    },

    async view(target, room, user) {
      if (!this.runBroadcast()) return;
      if (!target) return this.errorReply("Usage: /playlist view <username>");
      const targetUser = Users.get(target);
      if (!targetUser) return this.errorReply("User not found.");
      const targetId = toID(targetUser.id);
      const playlist = await MusicPlaylist.getPlaylist(targetId);
      if (playlist.length === 0) {
        return this.sendReply(`${targetUser.name}'s playlist is empty.`);
      }
      
      let buf = ``;
      buf += `<b>${Utils.escapeHTML(targetUser.name)}'s Playlist (${playlist.length} songs):</b><br />`;
      playlist.forEach((entry, idx) => {
        const platformIcon = this.getPlatformIcon(entry.type);
        buf += `${idx + 1}. ${platformIcon} <a href="${Utils.escapeHTML(entry.url)}" target="_blank">${Utils.escapeHTML(entry.title)}</a><br />`;
      });
      this.sendReplyBox(buf);
    },

    async reorder(target, room, user) {
      if (!target) return this.errorReply("Usage: /playlist reorder <from index>, <to index>");
      const parts = target.split(',').map(p => p.trim());
      if (parts.length !== 2) return this.errorReply("Usage: /playlist reorder <from index>, <to index>");
      
      const fromIndex = parseInt(parts[0]);
      const toIndex = parseInt(parts[1]);
      
      if (isNaN(fromIndex) || isNaN(toIndex)) {
        return this.errorReply("Both indexes must be numbers.");
      }

      const success = await MusicPlaylist.reorderSong(user.id, fromIndex, toIndex);
      if (success) {
        this.sendReply(`Moved song from position ${fromIndex} to ${toIndex}.`);
      } else {
        this.errorReply(`Invalid indexes or no playlist.`);
      }
    },

    async search(target, room, user) {
      if (!this.runBroadcast()) return;
      if (!target) return this.errorReply("Usage: /playlist search <query>");
      
      const results = await MusicPlaylist.searchPlaylists(target);
      if (results.length === 0) {
        return this.sendReply(`No playlists found containing songs matching "${target}".`);
      }

      let buf = ``;
      buf += `<b>Playlists containing "${Utils.escapeHTML(target)}":</b><br />`;
      results.slice(0, 10).forEach(result => {
        buf += `<b>${Impulse.nameColor(result.userid, true, true)}</b>: ${result.songs.length} matching song(s)<br />`;
      });
      if (results.length > 10) {
        buf += `<em>...and ${results.length - 10} more</em>`;
      }
      this.sendReplyBox(buf);
    },

    async stats(target, room, user) {
      if (!this.runBroadcast()) return;
      return this.parse('/join view-playliststats');
    },

    async count(target, room, user) {
      const count = await MusicPlaylist.getPlaylistCount(user.id);
      this.sendReply(`You have ${count} song(s) in your playlist (max: ${MusicPlaylist['MAX_PLAYLIST_SIZE']}).`);
    },

    getPlatformIcon(type: PlaylistEntry['type']): string {
      const icons: {[key in PlaylistEntry['type']]: string} = {
        'youtube': '▶️',
        'youtube-music': '🎵',
        'spotify': '🟢',
        'apple-music': '🍎',
        'soundcloud': '🔊'
      };
      return icons[type] || '🎵';
    },
  },

  playlisthelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Music Playlist Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/playlist add URL</code> - Add a YouTube or YouTube Music URL to your playlist (title auto-fetched)</li>` +
      `<li><code>/playlist add URL, Title</code> - Add a Spotify, Apple Music, or SoundCloud URL with a custom title</li>` +
      `<li><code>/playlist remove Index</code> - Remove a song from your playlist by its position number</li>` +
      `<li><code>/playlist reorder from, to</code> - Move a song from one position to another</li>` +
      `<li><code>/playlist share</code> - Display your personal playlist to the room</li>` +
      `<li><code>/playlist view username</code> - View another user's playlist</li>` +
      `<li><code>/playlist search query</code> - Search for playlists containing specific songs</li>` +
      `<li><code>/playlist clear</code> - Remove all songs from your playlist</li>` +
      `<li><code>/playlist count</code> - Check how many songs you have in your playlist</li>` +
      `<li><code>/playlist stats</code> - View overall playlist statistics</li>` +
      `</ul>` +
      `<b>Supported Platforms:</b> YouTube (▶️), YouTube Music (🎵), Spotify (🟢), Apple Music (🍎), SoundCloud (🔊)<br>` +
      `<b>Limit:</b> 20 songs per user` +
      `</div>`
    );
  },
};
