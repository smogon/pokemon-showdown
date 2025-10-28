import {
	Clans,
	UserClans,
	ClanLogs,
	ClanPointsLogs,
	ClanBankLogs,
	ClanDoc,
	UserClanDoc,
} from './database';
import type {
	Clan,
	ClanPermissions,
	CustomClanRank,
	ClanStats,
} from './interface';
import { generateThemedTable } from
	'../../utils';
import { FS } from '../../../lib';

const ALL_PERMISSIONS: ClanPermissions = {
	canInvite: true,
	canDeinvite: true,
	canKick: true,
	canPromote: true,
	canDemote: true,
	canEditDesc: true,
	canEditIcon: true,
	canEditTag: true,
	canSetMotw: true,
	canManageChat: true,
	canBankWithdraw: true,
	canManageAllies: true,
	canManageRivals: true,
	canEditRanks: true,
	canAddPoints: true,
	canRemovePoints: true,
};

const DEFAULT_RANKS: { [rankId: string]: CustomClanRank } = {
	owner: {
		id: 'owner' as ID,
		name: 'Owner',
		permissionLevel: 100,
		permissions: ALL_PERMISSIONS,
	},
	leader: {
		id: 'leader' as ID,
		name: 'Leader',
		permissionLevel: 50,
		permissions: {
			canInvite: true,
			canDeinvite: true,
			canKick: true,
			canPromote: true,
			canDemote: true,
			canEditDesc: true,
			canSetMotd: true,
			canManageChat: true,
			canManageAllies: true,
			canManageRivals: true,
			canAddPoints: true,
		},
	},
	officer: {
		id: 'officer' as ID,
		name: 'Officer',
		permissionLevel: 25,
		permissions: {
			canInvite: true,
			canAddPoints: true,
		},
	},
	member: {
		id: 'member' as ID,
		name: 'Member',
		permissionLevel: 10,
		permissions: {},
	},
};

const DEFAULT_STATS: ClanStats = {
	tourWins: 0,
	eventWins: 0,
	totalPointsEarned: 0,
};

/**
 * Formats a Date object into a string representation.
 * @param date The Date object to format
 * @param options Formatting options:
 *   - date: if true, includes the date (YYYY-MM-DD format)
 *   - time: if true, includes the time (HH:MM:SS format)
 * @returns Formatted date/time string
 */
function to(date: Date, options: { date?: boolean; time?: boolean } = {}): string {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		return '';
	}

	const { date: showDate = false, time: showTime = false } = options;
	
	if (!showDate && !showTime) {
		return date.toISOString();
	}

	let result = '';

	if (showDate) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		result += `${year}-${month}-${day}`;
	}

	if (showTime) {
		if (showDate) result += ' ';
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		result += `${hours}:${minutes}:${seconds}`;
	}

	return result;
}

function toDurationString(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years > 0) {
		const remainingMonths = Math.floor((days % 365) / 30);
		return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
	}
	if (months > 0) {
		const remainingDays = days % 30;
		return remainingDays > 0 ? `${months}mo ${remainingDays}d` : `${months}mo`;
	}
	if (days > 0) {
		const remainingHours = hours % 24;
		return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
	}
	if (hours > 0) {
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
	}
	if (minutes > 0) {
		const remainingSeconds = seconds % 60;
		return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	}
	return `${seconds}s`;
}

function hasClanPermission(clan: Clan, userId: ID, permission: keyof ClanPermissions): boolean {
	if (clan.owner === userId) return true;

	const memberData = clan.members[userId];
	if (!memberData) return false;

	const rank = clan.ranks[memberData.rank];
	if (!rank) return false;

	return !!rank.permissions[permission];
}

export const commands: Chat.ChatCommands = {
	clan: {
		async create(target, room, user) {
			this.checkCan('roomowner');

			const [name, ownerUsername] = target.split(',').map(s => s.trim());
			const clanName = name || '';
			const ownerId = toID(ownerUsername);

			if (!ownerId) {
				return this.errorReply("You must specify the clan name and the owner's ID in the format: /clan create [Clan Name], [Owner ID]");
			}

			const clanId = toID(clanName);

			if (!clanId) {
				return this.errorReply("You must specify a clan name.");
			}
			if (clanId.length < 3 || clanId.length > 20) {
				return this.errorReply("Clan ID must be between 3 and 20 characters long.");
			}
			if (clanName.length > 30) {
				return this.errorReply("Clan name must be 30 characters or less.");
			}

			const ownerUser = Users.getExact(ownerId);
			if (!ownerUser) {
				return this.errorReply(`Owner '${ownerId}' not found. The user must be logged in.`);
			}

			const [existingClan, ownerClanInfo] = await Promise.all([
				Clans.findOne({ _id: clanId }),
				UserClans.findOne({ _id: ownerId }),
			]);

			if (existingClan) {
				return this.errorReply(`A clan with the ID '${clanId}' already exists.`);
			}
			if (ownerClanInfo?.memberOf) {
				return this.errorReply(`User '${ownerId}' is already a member of a clan.`);
			}

			const now = Date.now();
			const chatRoomId = `clans-${clanId}` as RoomID;

			const newClan: ClanDoc = {
				_id: clanId,
				name: clanName,
				tag: clanId.slice(0, 5).toUpperCase(),
				owner: ownerId,
				members: {
					[ownerId]: {
						rank: 'owner' as ID,
						joinDate: now,
						totalPointsContributed: 0,
					},
				},
				ranks: DEFAULT_RANKS,
				created: now,
				desc: `Welcome to ${clanName}!`,
				memberOfTheWeek: '' as ID,
				inviteOnly: false,
				invites: [],
				points: 0,
				level: 1,
				bank: 0,
				chatRoom: chatRoomId,
				icon: '',
				lastActive: now,
				allies: [],
				rivals: [],
				stats: DEFAULT_STATS,
			};

			try {
				await Clans.insertOne(newClan);
				await UserClans.upsert({ _id: ownerId }, { $set: { memberOf: clanId } });
				await ClanLogs.insertOne({
					clanId: clanId,
					timestamp: now,
					actor: user.id,
					action: 'CREATE',
					target: ownerId,
					note: `Clan ${clanName} created for owner ${ownerId}.`,
				});

				const chatRoomTitle = `[Clan] ${clanName}`;
				let newRoom = Rooms.get(chatRoomId);

				if (!newRoom) {
					const roomSettings: RoomSettings = {
						title: chatRoomTitle,
						auth: {},
						creationTime: Date.now(),
						modjoin: '+',
						desc: newClan.desc,
					};

					newRoom = Rooms.createChatRoom(chatRoomId, chatRoomTitle, roomSettings);

					newRoom.auth.set(ownerId, '#');

					Rooms.global.settingsList.push(roomSettings);
					Rooms.global.chatRooms.push(newRoom);
					Rooms.global.writeChatRoomData();
				} else {
					newRoom.auth.set(ownerId, '#');
					newRoom.saveSettings();
				}

				if (ownerUser.connected) {
					ownerUser.joinRoom(newRoom.roomid);
					const popupMessage = `|html|<div class="infobox"><div class="infobox-message">${user.name} has created the clan <b>${clanName}</b> for you! You are the clan owner (#).</div><br /><center><button class="button" name="join" value="${newRoom.roomid}">Go to Clan Room: #${newRoom.roomid}</button></center></div>`;
					ownerUser.popup(popupMessage);
				}

				this.sendReply(`Clan "${clanName}" has been successfully created! Owner: ${ownerId}.`);
				this.room.add(`|html|<div class="infobox"><center>Clan "${clanName}" has been successfully created! Owner: ${ownerId}.</center></div>`);
			} catch (e) {
				this.errorReply("An error occurred while creating the clan.");
				await Clans.deleteOne({ _id: clanId });
				await UserClans.updateOne({ _id: ownerId }, { $unset: { memberOf: 1 } });
				Monitor.crashlog(e as Error, "Clan creation command");
			}
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');

			const clanId = toID(target);
			if (!clanId) {
				return this.errorReply("You must specify a clan ID.");
			}

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) {
				return this.errorReply(`Clan '${clanId}' not found.`);
			}

			const ownerId = clan.owner;
			const ownerUser = Users.getExact(ownerId);
			const chatRoomId = clan.chatRoom;
			const chatRoom = Rooms.get(chatRoomId);

			try {
				// Step 1: Destroy the chatroom first (if it exists)
				if (chatRoom) {
					// Notify all users in the room before destruction
					chatRoom.add(`|html|<div class="broadcast-red"><b>This clan chatroom is being permanently deleted by ${user.name}.</b></div>`).update();
			
					// Give users a moment to see the message
					await new Promise(resolve => setTimeout(resolve, 1000));
			
					// Kick all users from the room
					for (const userid in chatRoom.users) {
						const roomUser = chatRoom.users[userid];
						roomUser.leaveRoom(chatRoom);
					}
			
					// Deregister from persistent storage
					Rooms.global.deregisterChatRoom(chatRoom.roomid);
			
					// Delist from active rooms
					Rooms.global.delistChatRoom(chatRoom.roomid);
			
					// Destroy the room instance
					chatRoom.destroy();
		
					// Force immediate write to config file (bypass throttle)
					await FS('config/chatrooms.json').writeUpdate(() => 
						JSON.stringify(Rooms.global.settingsList)
						.replace(/\{"title":/g, '\n{"title":')
						.replace(/\]$/, '\n]'));
				}

				// Step 2: Delete all clan-related database entries
				await Clans.deleteOne({ _id: clanId });
		
				// Step 3: Remove clan membership from all users
				await UserClans.updateMany(
					{ memberOf: clanId }, 
					{ $unset: { memberOf: 1 } }
				);
		
				// Step 4: Delete all clan logs
				await ClanLogs.deleteMany({ clanId: clanId });
				await ClanPointsLogs.deleteMany({ clanId: clanId });
				await ClanBankLogs.deleteMany({ clanId: clanId });

				// Step 5: Notify the owner (if online)
				if (ownerUser?.connected) {
					ownerUser.popup(
						`|html|<div class="broadcast-red">` +
						`<b>Your clan "${clan.name}" has been permanently deleted by ${user.name}.</b><br />` +
						`All clan data, members, logs, and the chatroom ${chatRoomId} have been removed from the server.` +
						`</div>`
					);
				}

				// Step 6: Notify all former clan members (if online)
				const memberIds = Object.keys(clan.members);
				for (const memberId of memberIds) {
					if (memberId === ownerId) continue; // Already notified owner
					const member = Users.getExact(memberId);
					if (member?.connected) {
						member.popup(
							`|html|<div class="broadcast-red">` +
							`<b>The clan "${clan.name}" has been permanently deleted by ${user.name}.</b>` +
							`</div>`
						);
					}
				}
				// Step 8: Success confirmation
				this.sendReply(`Clan "${clan.name}" (${clanId}) has been successfully deleted.`);
				Monitor.log(`[Clans] ${user.name} deleted clan: ${clan.name} (${clanId}) with ${memberIds.length} members`);
		
			} catch (e) {
				this.errorReply("An error occurred while deleting the clan. The deletion may have been partially completed.");
				Monitor.crashlog(e as Error, "Clan deletion command", {
					clanId,
					clanName: clan.name,
					user: user.name,
				});
		
				// Attempt rollback notification
				this.privateModAction(`(CRITICAL: Clan deletion failed for ${clanId}. Manual verification required.)`);
			}
		},
		
		async join(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to join a clan.");

			const clanId = toID(target);
			const userId = user.id;

			if (!clanId) return this.errorReply("Specify the ID of the clan you wish to join.");

			const [clan, userClanInfo] = await Promise.all([
				Clans.findOne({ _id: clanId }),
				UserClans.findOne({ _id: userId }),
			]);

			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			if (userClanInfo?.memberOf) return this.errorReply(`You are already a member of the clan '${userClanInfo.memberOf}'.`);

			const isInvited = clan.invites.some(invite => invite.userid === userId);

			if (clan.inviteOnly && !isInvited) {
				return this.errorReply(`The clan '${clan.name}' is invite-only. You must be invited to join.`);
			}

			if (!clan.inviteOnly && userClanInfo?.invites?.includes(clanId)) {
				await UserClans.updateOne({ _id: userId }, { $pull: { invites: clanId } });
			}

			await Clans.updateOne(
				{ _id: clanId },
				{ $pull: { invites: { userid: userId } } }
			);

			await Clans.updateOne(
				{ _id: clanId },
				{
					$set: {
						[`members.${userId}`]: {
							rank: 'member' as ID,
							joinDate: Date.now(),
							totalPointsContributed: 0,
						},
					},
				}
			);

			await UserClans.upsert({ _id: userId }, {
				$set: { memberOf: clanId },
				$pull: { invites: clanId },
			});

			await ClanLogs.insertOne({
				clanId: clanId,
				timestamp: Date.now(),
				actor: userId,
				action: 'JOIN',
				target: userId,
				note: `User joined the clan.`,
			});

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				clanRoom.auth.set(userId, '+');
				clanRoom.saveSettings();

				user.joinRoom(clanRoom.roomid, this.connection);
				clanRoom.add(`|html|<div class="infobox">${user.name} joined the clan and was granted Room Voice.</div>`).update();
			}

			this.sendReply(`You have successfully joined the clan '${clan.name}'!`);
			if (clanRoom) this.sendReply(`You have been automatically joined to the clan chatroom: #${clanRoom.roomid}`);
		},

		async leave(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to leave a clan.");
			
			const userId = user.id;

			const userClanInfo = await UserClans.findOne({ _id: userId });
			const clanId = userClanInfo?.memberOf;

			if (!clanId) return this.errorReply("You are not currently a member of any clan.");

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Error: Clan '${clanId}' was not found in the database.`);

			if (clan.owner === userId) {
				return this.errorReply("You are the owner of this clan. Transfer ownership before leaving or delete the clan.");
			}

			await Clans.updateOne(
				{ _id: clanId },
				{ $unset: { [`members.${userId}`]: "" } }
			);

			await UserClans.updateOne(
				{ _id: userId },
				{ $unset: { memberOf: 1 } }
			);

			await ClanLogs.insertOne({
				clanId: clanId,
				timestamp: Date.now(),
				actor: userId,
				action: 'LEAVE',
				target: userId,
				note: `User left the clan.`,
			});

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				clanRoom.auth.delete(userId);
				clanRoom.saveSettings();
				clanRoom.add(`|html|<div class="infobox"><center>${user.name} left the clan.</center></div>`).update();
			}
			user.leaveRoom(clanRoom.roomid, this.connection);
			this.sendReply(`You have successfully left the clan '${clan.name}'.`);
		},

		async kick(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to kick users.");

			const targetId = toID(target);
			const kickerId = user.id;

			if (!targetId) return this.errorReply("Specify the user you wish to kick.");
			if (targetId === kickerId) return this.errorReply("You cannot kick yourself.");

			const kickerClanInfo = await UserClans.findOne({ _id: kickerId });
			const clanId = kickerClanInfo?.memberOf;
			
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

			if (!hasClanPermission(clan, kickerId, 'canKick')) {
				return this.errorReply(`Your rank (${clan.members[kickerId]?.rank}) does not have permission to kick users.`);
			}

			if (!clan.members[targetId]) {
				return this.errorReply(`'${targetId}' is not a member of ${clan.name}.`);
			}

			if (clan.owner === targetId) {
				return this.errorReply("You cannot kick the clan owner.");
			}

			const kickerRank = clan.ranks[clan.members[kickerId].rank];
			const targetRank = clan.ranks[clan.members[targetId].rank];

			if (targetRank.permissionLevel >= kickerRank.permissionLevel) {
				return this.errorReply("You cannot kick users with equal or higher rank than yours.");
			}

			await Clans.updateOne(
				{ _id: clanId },
				{ $unset: { [`members.${targetId}`]: "" } }
			);

			await UserClans.updateOne(
				{ _id: targetId },
				{ $unset: { memberOf: 1 } }
			);

			await ClanLogs.insertOne({
				clanId: clanId,
				timestamp: Date.now(),
				actor: kickerId,
				action: 'KICK',
				target: targetId,
				note: `User was kicked from the clan.`,
			});

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				clanRoom.auth.delete(targetId);
				clanRoom.saveSettings();
				const kickedUser = Users.get(targetId);
				if (kickedUser && kickedUser.inRooms.has(clan.chatRoom)) {
					kickedUser.leaveRoom(clanRoom);
				}
				clanRoom.add(`|html|<div class="infobox"><center>${targetId} was kicked from the clan by ${user.name}.</center></div>`).update();
			}
			const targetUser = Users.getExact(targetId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|<div class="infobox">You have been kicked from the clan <b>${clan.name}</b> by ${user.name}.</div>`);
			}
			this.sendReply(`You kicked '${targetId}' from ${clan.name}.`);
		},

		async invite(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to send invites.");

			const targetId = toID(target);
			const inviterId = user.id;

			if (!targetId) return this.errorReply("Specify the user you wish to invite.");
			if (targetId === inviterId) return this.errorReply("You cannot invite yourself.");

			const [inviterClanInfo, targetClanInfo] = await Promise.all([
				UserClans.findOne({ _id: inviterId }),
				UserClans.findOne({ _id: targetId }),
			]);

			const clanId = inviterClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");

			if (targetClanInfo?.memberOf) {
				return this.errorReply(`'${targetId}' is already a member of the clan '${targetClanInfo.memberOf}'.`);
			}

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

			if (!hasClanPermission(clan, inviterId, 'canInvite')) {
				return this.errorReply(`Your rank (${clan.members[inviterId]?.rank}) does not have permission to invite users.`);
			}

			const targetUser = Users.getExact(targetId);

			if (clan.invites.some(invite => invite.userid === targetId)) {
				return this.errorReply(`'${targetId}' has already been invited to ${clan.name}.`);
			}

			const newInvite = {
				userid: targetId,
				actor: inviterId,
				timestamp: Date.now(),
			};

			await Clans.updateOne(
				{ _id: clanId },
				{ $push: { invites: newInvite } }
			);

			await UserClans.upsert(
				{ _id: targetId },
				{ $addToSet: { invites: clanId } }
			);

			await ClanLogs.insertOne({
				clanId: clanId,
				timestamp: Date.now(),
				actor: inviterId,
				action: 'INVITE',
				target: targetId,
				note: `Invited user to the clan.`,
			});

			this.sendReply(`You invited '${targetId}' to join ${clan.name}.`);

			if (targetUser?.connected) {
				const buttonHtml = `<button class="button" name="send" value="/clan join ${clanId}">Join ${clan.name}</button>`;
				targetUser.popup(`|html|<div class="infobox"><div class="infobox-message">You have been invited to join the clan <b>${clan.name}</b> by ${user.name}.</div><br /><center>${buttonHtml}</center></div>`);
			} else {
				this.sendReply(`'${targetId}' is offline and will see the invite when they log in.`);
			}

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				clanRoom.add(`|html|<div class="infobox"><center>${user.name} invited ${targetId} to the clan.</center></div>`).update();
			}
		},

		async deinvite(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to revoke invites.");

			const targetId = toID(target);
			const actorId = user.id;
			
			if (!targetId) return this.errorReply("Specify the user whose invite you wish to revoke.");

			const actorClanInfo = await UserClans.findOne({ _id: actorId });
			const clanId = actorClanInfo?.memberOf;

			if (!clanId) return this.errorReply("You are not currently a member of any clan.");

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

			if (!hasClanPermission(clan, actorId, 'canDeinvite')) {
				return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to revoke invites.`);
			}

			const inviteExists = clan.invites.some(invite => invite.userid === targetId);
			if (!inviteExists) {
				return this.errorReply(`'${targetId}' does not have a pending invite to ${clan.name}.`);
			}

			await Clans.updateOne(
				{ _id: clanId },
				{ $pull: { invites: { userid: targetId } } }
			);

			await UserClans.updateOne(
				{ _id: targetId },
				{ $pull: { invites: clanId } }
			);

			await ClanLogs.insertOne({
				clanId: clanId,
				timestamp: Date.now(),
				actor: actorId,
				action: 'DEINVITE',
				target: targetId,
				note: `Revoked user's invite to the clan.`,
			});

			this.sendReply(`You revoked ${targetId}'s invite to ${clan.name}.`);

			const targetUser = Users.getExact(targetId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|<div class="infobox">Your invite to join the clan <b>${clan.name}</b> has been revoked by ${user.name}.</div>`);
			}

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				clanRoom.add(`|html|<div class="infobox"><center>${user.name} revoked ${targetId}'s invite to the clan.</center></div>`).update();
			}
		},

		async invites(target, room, user) {
			this.runBroadcast();
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to check invites.");

			const userId = user.id;

			const userClanInfo = await UserClans.findOne({ _id: userId });
			const memberOfClanId = userClanInfo?.memberOf;

			let output = '';
			const dataRows: string[][] = [];
			
			let isClanManager = false;
			
			if (memberOfClanId) {
				const clan = await Clans.findOne({ _id: memberOfClanId });
				if (clan) {
					isClanManager = hasClanPermission(clan, userId, 'canInvite');
					
					if (isClanManager) {
						const sentInvites = clan.invites;

						if (sentInvites.length) {
							const sentDataRows: string[][] = [];
							const sentHeaderRow = ['User', 'Invited By', 'Date'];
							const sentTitle = `Invites Sent by ${clan.name}`;
							
							sentInvites.forEach(invite => {
								sentDataRows.push([
									invite.userid,
									invite.actor,
									to(new Date(invite.timestamp), {date: true, time: true})
								]);
							});
							
							output += generateThemedTable(sentTitle, sentHeaderRow, sentDataRows);
						} else {
							output += `<div class="infobox">${clan.name} has no pending outgoing invitations.</div>`;
						}
					}
				}
			}
			if (!isClanManager) {
				const receivedInvites = userClanInfo?.invites || [];

				if (receivedInvites.length) {
					const invitedClans = await Clans.find({ _id: { $in: receivedInvites } });
					
					const headerRow = ['Clan', 'ID', 'Action'];
					const title = 'Your Pending Clan Invites';
					
					invitedClans.forEach(clan => {
						dataRows.push([
							clan.name,
							clan._id,
							`<button class="button" name="send" value="/clan join ${clan._id}">Accept</button>`
						]);
					});
					
					if (output) output += '<hr />';
					output += generateThemedTable(title, headerRow, dataRows);
				} else if (!output) {
					return this.errorReply("You have no pending clan invitations.");
				}
			}

			if (!output) {
				return this.errorReply("You are not currently a member of a clan and have no pending invites.");
			}
			
			this.sendReply(`|html|${output}`);
		},

	async inviteonly(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to toggle invite-only mode.");

		const value = target.trim().toLowerCase();
		const actorId = user.id;

		// Parse the input value
		let newInviteOnlyStatus: boolean;
		if (value === 'on' || value === 'true' || value === '1') {
			newInviteOnlyStatus = true;
		} else if (value === 'off' || value === 'false' || value === '0') {
			newInviteOnlyStatus = false;
		} else if (value === 'toggle') {
			// Will be determined after fetching the clan
			newInviteOnlyStatus = null as any;
		} else {
			return this.errorReply("Usage: /clan inviteonly [on/off/toggle]");
		}

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canManageChat')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to change invite-only mode.`);
		}

		// Handle toggle case
		if (newInviteOnlyStatus === null) {
			newInviteOnlyStatus = !clan.inviteOnly;
		}

		// Check if status is already in desired state
		if (clan.inviteOnly === newInviteOnlyStatus) {
			const currentStatus = newInviteOnlyStatus ? 'already invite-only' : 'already open to all users';
			return this.errorReply(`The clan is ${currentStatus}.`);
		}

		const oldValue = clan.inviteOnly;

		// Update the clan in database
		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { inviteOnly: newInviteOnlyStatus } }
		);

		// Log the change
		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'SET_INVITEONLY',
			oldValue: oldValue,
			newValue: newInviteOnlyStatus,
			note: `${newInviteOnlyStatus ? 'Enabled' : 'Disabled'} invite-only mode.`,
		});

		// Announce to the clan room
		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			const statusText = newInviteOnlyStatus ? 'is now invite-only' : 'is now open to all users';
			clanRoom.add(`|html|<div class="infobox"><center>${user.name} changed the clan setting: The clan ${statusText}.</center></div>`).update();
		}

		// Send confirmation to the user
		const statusText = newInviteOnlyStatus ? 'enabled' : 'disabled';
		this.sendReply(`You have successfully ${statusText} invite-only mode for ${clan.name}.`);
	},

	async createrank(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to create ranks.");

		const [rankId, rankName, permissionLevel] = target.split(',').map(s => s.trim());
		const actorId = user.id;

		if (!rankId || !rankName || !permissionLevel) {
			return this.errorReply("Usage: /clan createrank [rank id], [rank name], [permission level]");
		}

		const rankIdFormatted = toID(rankId);
		const permLevel = parseInt(permissionLevel);

		if (!rankIdFormatted) return this.errorReply("Invalid rank ID.");
		if (isNaN(permLevel) || permLevel < 0 || permLevel > 99) {
			return this.errorReply("Permission level must be a number between 0 and 99.");
		}
		if (rankName.length > 20) return this.errorReply("Rank name must be 20 characters or less.");

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canEditRanks')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to create ranks.`);
		}

		if (clan.ranks[rankIdFormatted]) {
			return this.errorReply(`A rank with ID '${rankIdFormatted}' already exists.`);
		}

		const actorRank = clan.ranks[clan.members[actorId].rank];
		if (permLevel >= actorRank.permissionLevel) {
			return this.errorReply("You cannot create ranks with permission level equal to or higher than your own.");
		}

		const newRank: CustomClanRank = {
			id: rankIdFormatted as ID,
			name: rankName,
			permissionLevel: permLevel,
			permissions: {},
		};

		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { [`ranks.${rankIdFormatted}`]: newRank } }
		);

		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'RANK_CREATE',
			target: rankIdFormatted as ID,
			note: `Created rank '${rankName}' with permission level ${permLevel}.`,
		});

		this.sendReply(`You created the rank '${rankName}' (${rankIdFormatted}) with permission level ${permLevel}.`);

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			clanRoom.add(`|html|<div class="infobox"><center>${user.name} created rank '${rankName}' with permission level ${permLevel}.</center></div>`).update();
		}
	},

	async deleterank(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to delete ranks.");

		const rankId = toID(target);
		const actorId = user.id;

		if (!rankId) return this.errorReply("Specify the rank ID you wish to delete.");

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canEditRanks')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to delete ranks.`);
		}

		if (!clan.ranks[rankId]) {
			return this.errorReply(`Rank '${rankId}' does not exist.`);
		}

		if (['owner', 'leader', 'officer', 'member'].includes(rankId)) {
			return this.errorReply("You cannot delete default ranks.");
		}

		const rankToDelete = clan.ranks[rankId];
		const actorRank = clan.ranks[clan.members[actorId].rank];

		if (rankToDelete.permissionLevel >= actorRank.permissionLevel) {
			return this.errorReply("You cannot delete ranks with permission level equal to or higher than your own.");
		}

		const membersWithRank = Object.entries(clan.members).filter(([, member]) => member.rank === rankId);
		if (membersWithRank.length > 0) {
			return this.errorReply(`Cannot delete rank '${rankId}' because ${membersWithRank.length} member(s) currently have this rank. Reassign them first.`);
		}

		await Clans.updateOne(
			{ _id: clanId },
			{ $unset: { [`ranks.${rankId}`]: "" } }
		);
		
		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'RANK_DELETE',
			target: rankId as ID,
			note: `Deleted rank '${rankToDelete.name}'.`,
		});

		this.sendReply(`You deleted the rank '${rankToDelete.name}' (${rankId}).`);

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			clanRoom.add(`|html|<div class="infobox"><center>${user.name} deleted rank '${rankToDelete.name}'.</center></div>`).update();
		}
	},

	async editrank(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to edit ranks.");

		const [rankId, permission, value] = target.split(',').map(s => s.trim());
		const actorId = user.id;

		if (!rankId || !permission || !value) {
			return this.errorReply("Usage: /claneditrank [rank id], [permission], [true/false]");
		}

		const rankIdFormatted = toID(rankId);
		const permValue = value.toLowerCase() === 'true';

		if (!rankIdFormatted) return this.errorReply("Invalid rank ID.");
		if (!['true', 'false'].includes(value.toLowerCase())) {
			return this.errorReply("Permission value must be 'true' or 'false'.");
		}

		const validPermissions = Object.keys(ALL_PERMISSIONS);
		if (!validPermissions.includes(permission)) {
			return this.errorReply(`Invalid permission. Valid permissions: ${validPermissions.join(', ')}`);
		}

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canEditRanks')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to edit ranks.`);
		}

		if (!clan.ranks[rankIdFormatted]) {
			return this.errorReply(`Rank '${rankIdFormatted}' does not exist.`);
		}

		if (rankIdFormatted === 'owner') {
			return this.errorReply("You cannot edit the owner rank permissions.");
		}

		const rankToEdit = clan.ranks[rankIdFormatted];
		const actorRank = clan.ranks[clan.members[actorId].rank];

		if (rankToEdit.permissionLevel >= actorRank.permissionLevel) {
			return this.errorReply("You cannot edit ranks with permission level equal to or higher than your own.");
		}
		
		const oldValue = rankToEdit.permissions[permission as keyof ClanPermissions] || false;

		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { [`ranks.${rankIdFormatted}.permissions.${permission}`]: permValue } }
		);

		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'RANK_EDIT',
			target: rankIdFormatted as ID,
			oldValue: oldValue,
			newValue: permValue,
			note: `Edited rank '${rankToEdit.name}': ${permission} set to ${permValue}.`,
		});

		this.sendReply(`You edited rank '${rankToEdit.name}': ${permission} is now ${permValue}.`);

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			clanRoom.add(`|html|<div class="infobox"><center>${user.name} edited rank '${rankToEdit.name}': ${permission} set to ${permValue}.</center></div>`).update();
		}
	},

	async ranks(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to view ranks.");

		const actorId = user.id;

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		const sortedRanks = Object.values(clan.ranks).sort((a, b) => b.permissionLevel - a.permissionLevel);

		const dataRows: string[][] = [];
		const headerRow = ['Rank', 'ID', 'Level', 'Permissions'];
		const title = `${clan.name} Ranks`;

		sortedRanks.forEach(rank => {
			const permissions = Object.entries(rank.permissions)
				.filter(([, value]) => value)
				.map(([key]) => key)
				.join(', ') || 'None';

			dataRows.push([
				rank.name,
				rank.id,
				rank.permissionLevel.toString(),
				permissions,
			]);
		});

		const output = generateThemedTable(title, headerRow, dataRows);
		this.sendReply(`|html|${output}`);
	},

	async permissionlist(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		const permissions = Object.keys(ALL_PERMISSIONS);

		const dataRows: string[][] = permissions.map(perm => [perm]);
		const headerRow = ['Permission'];
		const title = 'Available Clan Permissions';

		const output = generateThemedTable(title, headerRow, dataRows);
		this.sendReply(`|html|${output}`);
	},

	async promote(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to promote users.");

		const [targetUsername, newRankId] = target.split(',').map(s => s.trim());
		const targetId = toID(targetUsername);
		const actorId = user.id;
		const newRank = toID(newRankId);

		if (!targetId || !newRank) {
			return this.errorReply("Usage: /clan promote [username], [rank id]");
		}

		if (targetId === actorId) return this.errorReply("You cannot promote yourself.");

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canPromote')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to promote users.`);
		}

		if (!clan.members[targetId]) {
			return this.errorReply(`'${targetId}' is not a member of ${clan.name}.`);
		}

		if (clan.owner === targetId) {
			return this.errorReply("You cannot promote the clan owner.");
		}

		if (!clan.ranks[newRank]) {
			return this.errorReply(`Rank '${newRank}' does not exist.`);
		}

		if (newRank === 'owner') {
			return this.errorReply("Use /clan transfer to transfer ownership.");
		}

		const actorRank = clan.ranks[clan.members[actorId].rank];
		const targetCurrentRank = clan.ranks[clan.members[targetId].rank];
		const targetNewRank = clan.ranks[newRank];

		if (targetNewRank.permissionLevel >= actorRank.permissionLevel) {
			return this.errorReply("You cannot promote users to a rank equal to or higher than your own.");
		}

		if (targetCurrentRank.permissionLevel >= actorRank.permissionLevel) {
			return this.errorReply("You cannot promote users with a rank equal to or higher than your own.");
		}

		if (targetNewRank.permissionLevel <= targetCurrentRank.permissionLevel) {
			return this.errorReply("The new rank must have a higher permission level than the current rank. Use /clan demote to lower rank.");
		}

		const oldRank = clan.members[targetId].rank;

		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { [`members.${targetId}.rank`]: newRank as ID } }
		);

		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'PROMOTE',
			target: targetId,
			oldValue: oldRank,
			newValue: newRank,
			note: `Promoted from ${targetCurrentRank.name} to ${targetNewRank.name}.`,
		});

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			const roomRanks: { [key: string]: string } = {
				'leader': '@',
				'officer': '%',
				'member': '+'
			};
			const newRoomRank = roomRanks[newRank] || '+';
			clanRoom.auth.set(targetId, newRoomRank);
			clanRoom.saveSettings();

			clanRoom.add(`|html|<div class="infobox"><center>${targetId} was promoted from ${targetCurrentRank.name} to ${targetNewRank.name} by ${user.name}.</center></div>`).update();
		}

		const targetUser = Users.getExact(targetId);
		if (targetUser?.connected) {
			targetUser.popup(`|html|<div class="infobox">You have been promoted to <b>${targetNewRank.name}</b> in ${clan.name} by ${user.name}.</div>`);
		}

		this.sendReply(`You promoted '${targetId}' from ${targetCurrentRank.name} to ${targetNewRank.name}.`);
	},

	async demote(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to demote users.");

		const [targetUsername, newRankId] = target.split(',').map(s => s.trim());
		const targetId = toID(targetUsername);
		const actorId = user.id;
		const newRank = toID(newRankId);

		if (!targetId || !newRank) {
			return this.errorReply("Usage: /clan demote [username], [rank id]");
		}

		if (targetId === actorId) return this.errorReply("You cannot demote yourself.");

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canDemote')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to demote users.`);
		}

		if (!clan.members[targetId]) {
			return this.errorReply(`'${targetId}' is not a member of ${clan.name}.`);
		}

		if (clan.owner === targetId) {
			return this.errorReply("You cannot demote the clan owner.");
		}

		if (!clan.ranks[newRank]) {
			return this.errorReply(`Rank '${newRank}' does not exist.`);
		}

		if (newRank === 'owner') {
			return this.errorReply("Use /clan transfer to transfer ownership.");
		}

		const actorRank = clan.ranks[clan.members[actorId].rank];
		const targetCurrentRank = clan.ranks[clan.members[targetId].rank];
		const targetNewRank = clan.ranks[newRank];

		if (targetNewRank.permissionLevel >= actorRank.permissionLevel) {
			return this.errorReply("You cannot demote users to a rank equal to or higher than your own.");
		}

		if (targetCurrentRank.permissionLevel >= actorRank.permissionLevel) {
			return this.errorReply("You cannot demote users with a rank equal to or higher than your own.");
		}

		if (targetNewRank.permissionLevel >= targetCurrentRank.permissionLevel) {
			return this.errorReply("The new rank must have a lower permission level than the current rank. Use /clan promote to raise rank.");
		}

		const oldRank = clan.members[targetId].rank;

		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { [`members.${targetId}.rank`]: newRank as ID } }
		);

		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'DEMOTE',
			target: targetId,
			oldValue: oldRank,
			newValue: newRank,
			note: `Demoted from ${targetCurrentRank.name} to ${targetNewRank.name}.`,
		});

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			const roomRanks: { [key: string]: string } = {
				'leader': '@',
				'officer': '%',
				'member': '+'
			};
			const newRoomRank = roomRanks[newRank] || '+';
			clanRoom.auth.set(targetId, newRoomRank);
			clanRoom.saveSettings();

			clanRoom.add(`|html|<div class="infobox"><center>${targetId} was demoted from ${targetCurrentRank.name} to ${targetNewRank.name} by ${user.name}.</center></div>`).update();
		}

		const targetUser = Users.getExact(targetId);
		if (targetUser?.connected) {
			targetUser.popup(`|html|<div class="infobox">You have been demoted to <b>${targetNewRank.name}</b> in ${clan.name} by ${user.name}.</div>`);
		}
		this.sendReply(`You demoted '${targetId}' from ${targetCurrentRank.name} to ${targetNewRank.name}.`);
	},

	async transfer(target, room, user) {
	this.checkChat();
	if (!user.named) return this.errorReply("You must be logged in to transfer ownership.");

	const targetId = toID(target);
	const actorId = user.id;

	if (!targetId) return this.errorReply("Specify the user you wish to transfer ownership to.");
	if (targetId === actorId) return this.errorReply("You are already the owner.");

	const actorClanInfo = await UserClans.findOne({ _id: actorId });
	const clanId = actorClanInfo?.memberOf;

	if (!clanId) return this.errorReply("You are not currently a member of any clan.");

	const clan = await Clans.findOne({ _id: clanId });
	if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

	if (clan.owner !== actorId) {
		return this.errorReply("Only the clan owner can transfer ownership.");
	}

	if (!clan.members[targetId]) {
		return this.errorReply(`'${targetId}' is not a member of ${clan.name}.`);
	}

	const oldOwnerRank = clan.members[targetId].rank;

	await Clans.updateOne(
		{ _id: clanId },
		{
			$set: {
				owner: targetId,
				[`members.${targetId}.rank`]: 'owner' as ID,
				[`members.${actorId}.rank`]: 'leader' as ID,
			},
		}
	);

	await ClanLogs.insertOne({
		clanId: clanId,
		timestamp: Date.now(),
		actor: actorId,
		action: 'PROMOTE',
		target: targetId,
		oldValue: oldOwnerRank,
		newValue: 'owner',
		note: `Ownership transferred from ${actorId} to ${targetId}.`,
	});
	const clanRoom = Rooms.get(clan.chatRoom);
	if (clanRoom) {
		clanRoom.auth.set(targetId, '#');
		clanRoom.auth.set(actorId, '@');
		clanRoom.saveSettings();
		clanRoom.add(`|html|<div class="infobox"><center>Clan ownership has been transferred from ${user.name} to ${targetId}.</center></div>`).update();
	}

	const targetUser = Users.getExact(targetId);
	if (targetUser?.connected) {
		targetUser.popup(`|html|<div class="infobox">You are now the owner of <b>${clan.name}</b>! Ownership was transferred to you by ${user.name}.</div>`);
	}
	this.sendReply(`You transferred ownership of ${clan.name} to '${targetId}'. You are now a Leader.`);
	},

	async members(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to view clan members.");

		let clanId: ID;
	
		if (target) {
			clanId = toID(target);
		} else {
			const userClanInfo = await UserClans.findOne({ _id: user.id });
			clanId = userClanInfo?.memberOf as ID;
			if (!clanId) return this.errorReply("You are not currently a member of any clan. Specify a clan ID to view its members.");
		}

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
		
		const memberEntries = Object.entries(clan.members);
		if (memberEntries.length === 0) {
			return this.errorReply(`Clan '${clan.name}' has no members.`);
		}

		const sortedMembers = memberEntries.sort((a, b) => {
			const rankA = clan.ranks[a[1].rank];
			const rankB = clan.ranks[b[1].rank];
			return rankB.permissionLevel - rankA.permissionLevel;
		});

		const dataRows: string[][] = [];
		const headerRow = ['Username', 'Rank', 'Join Date', 'Points Contributed'];
		const title = `${clan.name} Members (${memberEntries.length})`;

		sortedMembers.forEach(([userId, memberData]) => {
			const rank = clan.ranks[memberData.rank];
			dataRows.push([
				userId,
				rank.name,
				toDurationString(Date.now() - memberData.joinDate, {precision: 2}) + ' ago',
				memberData.totalPointsContributed.toString(),
			]);
		});

		const output = generateThemedTable(title, headerRow, dataRows);
		this.sendReply(`|html|${output}`);
	},
	
	async setdesc(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to set clan description.");

		const description = target.trim();
		const actorId = user.id;

		if (!description) return this.errorReply("You must specify a description.");
		if (description.length > 80) return this.errorReply("Clan description must be 80 characters or less.");

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canEditDesc')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to edit the clan description.`);
		}
		
		const oldDesc = clan.desc;

		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { desc: description } }
		);

		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'SET_DESC',
			oldValue: oldDesc,
			newValue: description,
			note: `Updated clan description.`,
		});

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			clanRoom.settings.desc = description;
			clanRoom.saveSettings();
			clanRoom.add(`|html|<div class="infobox"><center>${user.name} updated the clan description.</center></div>`).update();
		}
		this.sendReply(`You updated the clan description to: "${description}"`);
	},

	async settag(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to set clan tag.");

		const tag = target.trim().toUpperCase();
		const actorId = user.id;

		if (!tag) return this.errorReply("You must specify a tag.");
		if (tag.length > 4) return this.errorReply("Clan tag must be 3 characters or less.");
		if (!/^[A-Z]+$/.test(tag)) return this.errorReply("Clan tag must contain only uppercase letters.");

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canEditTag')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to edit the clan tag.`);
		}

		const oldTag = clan.tag;

		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { tag: tag } }
		);

		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'SET_TAG',
			oldValue: oldTag,
			newValue: tag,
			note: `Updated clan tag.`,
		});

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			clanRoom.add(`|html|<div class="infobox"><center>${user.name} updated the clan tag from "${oldTag}" to "${tag}".</center></div>`).update();
		}
		this.sendReply(`You updated the clan tag from "${oldTag}" to "${tag}".`);
	},

	async setmotw(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to set member of the week.");
		
	const targetId = toID(target);
	const actorId = user.id;

	if (!targetId) return this.errorReply("You must specify a user.");
	
	const actorClanInfo = await UserClans.findOne({ _id: actorId });
	const clanId = actorClanInfo?.memberOf;

	if (!clanId) return this.errorReply("You are not currently a member of any clan.");

	const clan = await Clans.findOne({ _id: clanId });
	if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

	if (!hasClanPermission(clan, actorId, 'canSetMotw')) {
		return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to set member of the week.`);
	}

	if (!clan.members[targetId]) {
		return this.errorReply(`'${targetId}' is not a member of ${clan.name}.`);
	}
	
	// Prevent setting same user as MOTW again
	if (clan.memberOfTheWeek === targetId) {
		return this.errorReply(`'${targetId}' is already the Member of the Week for ${clan.name}.`);
	}
	
	const oldMotw = clan.memberOfTheWeek;
	const HOST_RANK = '^';

	// Update database
	await Clans.updateOne(
		{ _id: clanId },
		{ $set: { memberOfTheWeek: targetId } }
	);

	// Log the action
	await ClanLogs.insertOne({
		clanId: clanId,
		timestamp: Date.now(),
		actor: actorId,
		action: 'SET_MOTW',
		target: targetId,
		oldValue: oldMotw,
		newValue: targetId,
		note: `Set member of the week.`,
	});

	// Update room auth
	const clanRoom = Rooms.get(clan.chatRoom);
	if (clanRoom) {
		// Demote previous MOTW if exists and is still connected
		if (oldMotw && oldMotw !== targetId && clan.members[oldMotw]) {
			const oldMotwMember = clan.members[oldMotw];
			const oldMotwRank = clan.ranks[oldMotwMember.rank];
			
			// Map clan rank back to room rank
			const roomRanks: { [key: string]: string } = {
				'owner': '#',
				'leader': '@',
				'officer': '%',
				'member': '+'
			};
			const newRoomRank = roomRanks[oldMotwMember.rank] || '+';
			clanRoom.auth.set(oldMotw, newRoomRank);
		}

		// Promote new MOTW to host rank
		clanRoom.auth.set(targetId, HOST_RANK);
		clanRoom.saveSettings();

		// Announce in room
		clanRoom.add(`|html|<div class="infobox"><center>${user.name} set <b>${targetId}</b> as the Member of the Week!</center></div>`).update();
	}

	// Notify the new MOTW
	const targetUser = Users.getExact(targetId);
	if (targetUser?.connected) {
		targetUser.popup(`|html|<div class="infobox">Congratulations! You have been named <b>Member of the Week</b> in ${clan.name} by ${user.name}!</div>`);
	}

	this.sendReply(`You set '${targetId}' as the Member of the Week for ${clan.name}.`);
},
	
	async seticon(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to set clan icon.");

		const iconUrl = target.trim();
		const actorId = user.id;

		if (!iconUrl) return this.errorReply("You must specify an icon URL.");
		if (iconUrl.length > 1000) return this.errorReply("Icon URL must be 1000 characters or less.");
		if (!/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i.test(iconUrl)) {
			return this.errorReply("Invalid image URL. Must be a valid HTTP(S) URL ending in .png, .jpg, .jpeg, .gif, or .webp");
		}

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;
		
		if (!clanId) return this.errorReply("You are not currently a member of any clan.");
		
		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		if (!hasClanPermission(clan, actorId, 'canEditIcon')) {
			return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to edit the clan icon.`);
		}

		const oldIcon = clan.icon;

		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { icon: iconUrl } }
		);
		
		await ClanLogs.insertOne({
			clanId: clanId,
			timestamp: Date.now(),
			actor: actorId,
			action: 'SET_ICON',
			oldValue: oldIcon,
			newValue: iconUrl,
			note: `Updated clan icon.`,
		});

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			clanRoom.add(`|html|<div class="infobox"><center>${user.name} updated the clan icon.</center></div>`).update();
		}
		this.sendReply(`You updated the clan icon.`);
	},
		
	async list(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		const page = parseInt(target) || 1;
		const limit = 20;
		const skip = (page - 1) * limit;

		const [clans, total] = await Promise.all([
			Clans.find({}, { skip, limit, sort: { points: -1 } }),
			Clans.countDocuments({}),
		]);
	
		if (clans.length === 0) {
			return this.errorReply("No clans found.");
		}

		const totalPages = Math.ceil(total / limit);
		const dataRows: string[][] = [];
		const headerRow = ['Clan', 'Tag', 'Owner', 'Members', 'Points'];
		const title = `All Clans (Page ${page}/${totalPages})`;

		clans.forEach(clan => {
			const memberCount = Object.keys(clan.members).length;
			dataRows.push([
				clan.name,
				clan.tag,
				clan.owner,
				memberCount.toString(),
				clan.points.toString(),
			]);
		});

		let output = generateThemedTable(title, headerRow, dataRows);

		if (page > 1 || page < totalPages) {
			output += '<center>';
			if (page > 1) {
				output += `<button class="button" name="send" value="/clan list ${page - 1}">Previous</button> `;
			}
			if (page < totalPages) {
				output += `<button class="button" name="send" value="/clan list ${page + 1}">Next</button>`;
			}
			output += '</center>';
		}
		this.sendReply(`|html|${output}`);
	},

		
	async logs(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in to view clan logs.");

		const limit = parseInt(target) || 20;
		const actorId = user.id;
		
		if (limit < 1 || limit > 100) {
			return this.errorReply("Limit must be between 1 and 100.");
		}

		const actorClanInfo = await UserClans.findOne({ _id: actorId });
		const clanId = actorClanInfo?.memberOf;

		if (!clanId) return this.errorReply("You are not currently a member of any clan.");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

		const logs = await ClanLogs.find(
			{ clanId: clanId },
			{ limit, sort: { timestamp: -1 } }
		);

		if (logs.length === 0) {
			return this.errorReply(`${clan.name} has no activity logs.`);
		}
		
		const dataRows: string[][] = [];
		const headerRow = ['Date', 'Actor', 'Action', 'Target', 'Details'];
		const title = `${clan.name} Activity Logs (Last ${logs.length})`;

		logs.forEach(log => {
			const date = new Date(log.timestamp).toLocaleString();
			const details = log.note || 
				(log.oldValue !== undefined && log.newValue !== undefined ? 
				 `${log.oldValue} → ${log.newValue}` : '');
		
			dataRows.push([
				date,
				log.actor,
				log.action,
				log.target || '-',
				details,
			]);
		});
		const output = generateThemedTable(title, headerRow, dataRows);
		this.sendReply(`|html|${output}`);
	},
  },
};
