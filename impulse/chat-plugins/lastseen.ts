/**
 * Pokemon Showdown - Seen System
 * Tracks when users were last online using MongoDB
 * Now also includes clearall/globalclearall
 * Instructions:
 * 1. Add to server/users.ts in onDisconnect():
 *    if (this.named) Impulse.Seen(this.id);
 * 
 * @license MIT
 */

import { MongoDB } from '../../impulse/mongodb_module';

interface SeenDocument {
	_id?: any;
	userid: string;
	lastSeen: Date;
}

/**
 * Update user's last seen timestamp
 * Uses atomic upsert for race-condition safety
 */
export function trackSeen(userid: string): void {
	if (!MongoDB.isConnected()) return;
	
	const SeenDB = MongoDB<SeenDocument>('seen');
	
	// Atomic upsert - no race conditions, single database operation
	void SeenDB.upsert(
		{ userid: userid },
		{
			userid: userid,
			lastSeen: new Date(),
		}
	).catch(err => {
		console.error('Error tracking seen data:', err);
	});
}

Impulse.Seen = trackSeen;

/**
 * Get user's last seen timestamp
 */
async function getLastSeen(userid: string): Promise<Date | null> {
	if (!MongoDB.isConnected()) return null;
	
	const SeenDB = MongoDB<SeenDocument>('seen');
	const doc = await SeenDB.findOne({ userid: userid });
	
	return doc?.lastSeen || null;
}

/**
 * Check if user has any seen data
 */
async function hasSeen(userid: string): Promise<boolean> {
	if (!MongoDB.isConnected()) return false;
	
	const SeenDB = MongoDB<SeenDocument>('seen');
	return SeenDB.exists({ userid: userid });
}

/**
 * Get recently seen users (for leaderboards, etc.)
 */
async function getRecentUsers(limit: number = 50): Promise<SeenDocument[]> {
	if (!MongoDB.isConnected()) return [];
	
	const SeenDB = MongoDB<SeenDocument>('seen');
	return SeenDB.findSorted({}, { lastSeen: -1 }, limit);
}

/**
 * Clean up old seen data (users not seen in X days)
 */
async function cleanupOldSeen(daysOld: number = 365): Promise<number> {
	if (!MongoDB.isConnected()) return 0;
	
	const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
	const SeenDB = MongoDB<SeenDocument>('seen');
	
	return SeenDB.deleteMany({ lastSeen: { $lt: cutoffDate } });
}

function clearRooms(rooms: Room[], user: User): string[] {
  const clearedRooms: string[] = [];
  for (const room of rooms) {
    if (!room) continue;
    if (room.log.log) {
      room.log.log.length = 0;
    }
    const userIds = Object.keys(room.users) as ID[];
    for (const userId of userIds) {
      const userObj = Users.get(userId);
      if (userObj?.connections?.length) {
        for (const connection of userObj.connections) {
          userObj.leaveRoom(room, connection);
        }
      }
    }
    
    clearedRooms.push(room.id);
    setTimeout(() => {
      for (const userId of userIds) {
        const userObj = Users.get(userId);
        if (userObj?.connections?.length) {
          for (const connection of userObj.connections) {
            userObj.joinRoom(room, connection);
          }
        }
      }
    }, 1000);
  }
  return clearedRooms;
}

export const commands: Chat.ChatCommands = {
	async seen(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help seen');
		
		if (!MongoDB.isConnected()) {
			return this.errorReply('Seen system is not available (MongoDB not connected).');
		}
		
		const targetUser = Users.get(target);
		if (targetUser?.connected) {
			return this.sendReplyBox(
				`${Impulse.nameColor(targetUser.name, true, true)} is ` +
				`<b><font color='limegreen'>Currently Online</font></b>.`
			);
		}
		
		const targetId = toID(target);
		
		try {
			const lastSeen = await getLastSeen(targetId);
			
			if (!lastSeen) {
				return this.sendReplyBox(
					`${Impulse.nameColor(target, true, true)} has ` +
					`<b><font color='red'>never been online</font></b> on this server.`
				);
			}
			
			const duration = Chat.toDurationString(Date.now() - lastSeen.getTime(), { precision: true });
			this.sendReplyBox(
				`${Impulse.nameColor(target, true, true)} was last seen ` +
				`<b>${duration}</b> ago.`
			);
		} catch (err: any) {
			this.errorReply('Error retrieving seen data: ' + err.message);
		}
	},
	
	seenhelp: [`/seen [user] - Shows when the user last connected on the server.`],
	
	// Admin commands
	async recentseen(target, room, user) {
		this.checkCan('globalban');
		
		if (!MongoDB.isConnected()) {
			return this.errorReply('Seen system is not available (MongoDB not connected).');
		}
		
		const limit = parseInt(target) || 25;
		if (limit > 100) return this.errorReply('Maximum limit is 100 users.');
		
		try {
			const recent = await getRecentUsers(limit);
			
			if (recent.length === 0) {
				return this.sendReply('No seen data available.');
			}
			
			this.sendReplyBox(
				`<strong>Recently Seen Users (${recent.length}):</strong><br/>` +
				recent.map((doc, i) => {
					const duration = Chat.toDurationString(Date.now() - doc.lastSeen.getTime());
					return `${i + 1}. ${doc.userid} - ${duration} ago`;
				}).join('<br/>')
			);
		} catch (err: any) {
			this.errorReply('Error retrieving recent seen data: ' + err.message);
		}
	},
	
	recentseenhelp: [`/recentseen [limit] - Shows recently seen users. Requires: @`],
	
	async cleanupseen(target, room, user) {
		this.checkCan('globalban');
		
		if (!MongoDB.isConnected()) {
			return this.errorReply('Seen system is not available (MongoDB not connected).');
		}
		
		const days = parseInt(target) || 365;
		if (days < 30) {
			return this.errorReply('Minimum cleanup period is 30 days.');
		}
		
		try {
			const deleted = await cleanupOldSeen(days);
			this.sendReply(`Deleted ${deleted} seen records older than ${days} days.`);
		} catch (err: any) {
			this.errorReply('Error cleaning up seen data: ' + err.message);
		}
	},
	
	cleanupseenhelp: [`/cleanupseen [days] - Delete seen records older than X days (default: 365). Requires: &`],

   clearall(target, room, user) {
      if (room?.battle) {
         return this.sendReply("You cannot clearall in battle rooms.");
      }
      if (!room) {
         return this.errorReply("This command requires a room.");
      }
      this.checkCan('roommod', null, room);
      clearRooms([room], user);
   },

   globalclearall(target, room, user) {
      this.checkCan('bypassall');
      const roomsToClear = Rooms.global.chatRooms.filter((chatRoom): chatRoom is Room => !!chatRoom && !chatRoom.battle);
      const clearedRooms = clearRooms(roomsToClear, user);
   },

   clearallhelp(target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReplyBox(
         `<div><b><center>Clearall Commands</center></b><br>` +
         `<ul>` +
         `<li><code>/clearall </code> - Clear all messages from a chatroom (Requires: # and higher)</li><br>` +
         `<li><code>/globalclearall </code> - clear all messages from all chatrooms (Requires: ~)</li>` +
         `</ul></div>`
      );
   },
};
