/*
* Pokemon Showdown
* Clans Commands
*/
import {
	Clans,
	UserClans,
	ClanLogs,
	ClanBans,
	ClanPointsLogs,
	ClanWars,
	ClanBattleLogs,
	type ClanDoc,
} from './database';
import type { Clan, ClanPermissions, CustomClanRank, ClanStats } from './interface';
import { generateThemedTable } from
	'../../utils';
import { K_FACTOR, getExpectedScore, calculateElo, to,
	toDurationString, logClanActivity, hasClanPermission } from './utils';
import { FS } from '../../../lib';
import { warCommands } from './war-commands';

export const ALL_PERMISSIONS: ClanPermissions = {
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
	canEditRanks: true,
	canAnnounce: true,
	canWar: true,
};

export const DEFAULT_RANKS: { [rankId: string]: CustomClanRank } = {
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
			canAnnounce: true,
			canWar: true,
		},
	},
	officer: {
		id: 'officer' as ID,
		name: 'Officer',
		permissionLevel: 25,
		permissions: {
			canInvite: true,
			canDeinvite: true,
		},
	},
	member: {
		id: 'member' as ID,
		name: 'Member',
		permissionLevel: 10,
		permissions: {},
	},
};

export const DEFAULT_STATS: ClanStats = {
	tourWins: 0,
	eventWins: 0,
	totalPointsEarned: 0,
	clanBattleWins: 0,
	clanBattleLosses: 0,
	elo: 1000,
	lastWarChallenge: 0,
};

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
			const chatRoomId = toID(`${clanId}`) as RoomID;

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
				chatRoom: chatRoomId,
				icon: '',
				lastActive: now,
				stats: DEFAULT_STATS,
			};

			try {
				await Clans.insertOne(newClan);
				await UserClans.upsert({ _id: ownerId }, { $set: { memberOf: clanId } });
				await logClanActivity(clanId, user.id, 'CREATE', {
					target: ownerId,
					note: `Clan ${clanName} created for owner ${ownerId}.`,
				});

				const chatRoomTitle = `${clanName}`;
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
			const chatRoomId = (clan.chatRoom);
			const chatRoom = Rooms.get(chatRoomId);

			try {
				if (chatRoom) {
					chatRoom.add(`|html|<div class="broadcast-red"><b>This clan chatroom is being permanently deleted by ${user.name}.</b></div>`).update();
					await new Promise<void>(resolve => {
						setTimeout(resolve, 1000);
					});
					for (const userid in chatRoom.users) {
						const roomUser = chatRoom.users[userid];
						roomUser.leaveRoom(chatRoom);
					}
					Rooms.global.deregisterChatRoom(chatRoom.roomid);
					Rooms.global.delistChatRoom(chatRoom.roomid);
					chatRoom.destroy();
					FS('config/chatrooms.json').writeUpdate(() =>
						JSON.stringify(Rooms.global.settingsList)
							.replace(/\{"title":/g, '\n{"title":')
							.replace(/\]$/, '\n]'));
				}

				// Delete clan document
				await Clans.deleteOne({ _id: clanId });

				// Remove clan membership from all users
				await UserClans.updateMany(
					{ memberOf: clanId },
					{ $unset: { memberOf: 1 } }
				);

				// Remove invites to this clan from all users
				await UserClans.updateMany(
					{ invites: clanId },
					{ $pull: { invites: clanId } }
				);

				// Delete all logs for the clan
				await ClanLogs.deleteMany({ clanId });
				await ClanPointsLogs.deleteMany({ clanId });

				// Delete all battle logs involving this clan (winner or loser)
				await ClanBattleLogs.deleteMany({
					$or: [
						{ winningClan: clanId },
						{ losingClan: clanId },
					],
				});
				// Delete all wars involving this clan
				await ClanWars.deleteMany({
					clans: clanId,
				});

				if (ownerUser?.connected) {
					ownerUser.popup(
						`|html|<div class="broadcast-red">` +
						`<b>Your clan "${clan.name}" has been permanently deleted by ${user.name}.</b><br />` +
						`All clan data, members, logs, and the chatroom ${chatRoomId} have been removed from the server.` +
						`</div>`
					);
				}

				const memberIds = Object.keys(clan.members);
				for (const memberId of memberIds) {
					if (memberId === ownerId) continue;
					const member = Users.getExact(memberId);
					if (member?.connected) {
						member.popup(
							`|html|<div class="broadcast-red">` +
							`<b>The clan "${clan.name}" has been permanently deleted by ${user.name}.</b>` +
							`</div>`
						);
					}
				}
				this.sendReply(`Clan "${clan.name}" (${clanId}) has been successfully deleted.`);
				Monitor.log(`[Clans] ${user.name} deleted clan: ${clan.name} (${clanId}) with ${memberIds.length} members`);
			} catch (e) {
				this.errorReply("An error occurred while deleting the clan. The deletion may have been partially completed.");
				Monitor.crashlog(e as Error, "Clan deletion command", {
					clanId,
					clanName: clan.name,
					user: user.name,
				});
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

			await logClanActivity(clanId, userId, 'JOIN', {
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

			await logClanActivity(clanId, userId, 'LEAVE', {
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

			await logClanActivity(clanId, kickerId, 'KICK', {
				target: targetId,
				note: `User was kicked from the clan.`,
			});

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				clanRoom.auth.delete(targetId);
				clanRoom.saveSettings();
				const kickedUser = Users.get(targetId);
				if (kickedUser?.inRooms.has(clan.chatRoom)) {
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

			await logClanActivity(clanId, inviterId, 'INVITE', {
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

			await logClanActivity(clanId, actorId, 'DEINVITE', {
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
									to(new Date(invite.timestamp), { date: true, time: true }),
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
							`<button class="button" name="send" value="/clan join ${clan._id}">Accept</button>`,
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

			let newInviteOnlyStatus: boolean;
			if (value === 'on' || value === 'true' || value === '1') {
				newInviteOnlyStatus = true;
			} else if (value === 'off' || value === 'false' || value === '0') {
				newInviteOnlyStatus = false;
			} else if (value === 'toggle') {
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

			if (newInviteOnlyStatus === null) {
				newInviteOnlyStatus = !clan.inviteOnly;
			}

			if (clan.inviteOnly === newInviteOnlyStatus) {
				const currentStatus = newInviteOnlyStatus ? 'already invite-only' : 'already open to all users';
				return this.errorReply(`The clan is ${currentStatus}.`);
			}

			const oldValue = clan.inviteOnly;

			await Clans.updateOne(
				{ _id: clanId },
				{ $set: { inviteOnly: newInviteOnlyStatus } }
			);

			await logClanActivity(clanId, actorId, 'SET_INVITEONLY', {
				oldValue,
				newValue: newInviteOnlyStatus,
				note: `${newInviteOnlyStatus ? 'Enabled' : 'Disabled'} invite-only mode.`,
			});

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				const statusText = newInviteOnlyStatus ? 'is now invite-only' : 'is now open to all users';
				clanRoom.add(`|html|<div class="infobox"><center>${user.name} changed the clan setting: The clan ${statusText}.</center></div>`).update();
			}

			const statusText = newInviteOnlyStatus ? 'enabled' : 'disabled';
			this.sendReply(`You have successfully ${statusText} invite-only mode for ${clan.name}.`);
		},

		async announce(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to announce to your clan.");

			const message = target.trim();
			if (!message) return this.errorReply("You must specify a message to announce.");

			const actorId = user.id;
			const actorClanInfo = await UserClans.findOne({ _id: actorId });
			const clanId = actorClanInfo?.memberOf;

			if (!clanId) return this.errorReply("You are not currently a member of any clan.");

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

			if (!hasClanPermission(clan, actorId, 'canAnnounce')) {
				return this.errorReply(`Your rank (${clan.members[actorId]?.rank}) does not have permission to send announcements.`);
			}

			const memberIds = Object.keys(clan.members);

			let sentTo = 0;
			for (const memberId of memberIds) {
				const memberUser = Users.getExact(memberId);
				if (memberUser?.connected) {
					memberUser.popup(`|html|<div class="infobox"><b>Clan Announcement</b><br /><hr />${message}<br /><hr /><small>Sent by ${user.name} (${clan.name})</small></div>`);
					sentTo++;
				}
			}

			await logClanActivity(clanId, actorId, 'ANNOUNCE', {
				note: `Announcement sent to ${sentTo} member(s): "${message}"`,
			});

			this.sendReply(`Announcement sent to ${sentTo} online member(s) of your clan.`);
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

			await logClanActivity(clanId, actorId, 'RANK_CREATE', {
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

			await logClanActivity(clanId, actorId, 'RANK_DELETE', {
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

			await logClanActivity(clanId, actorId, 'RANK_EDIT', {
				target: rankIdFormatted as ID,
				oldValue,
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

		permissionlist(target, room, user) {
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

			await logClanActivity(clanId, actorId, 'PROMOTE', {
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
					'member': '+',
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

			await logClanActivity(clanId, actorId, 'DEMOTE', {
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
					'member': '+',
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

			await logClanActivity(clanId, actorId, 'PROMOTE', {
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
				const memberOf = userClanInfo?.memberOf;
				if (!memberOf) {
					return this.errorReply(
						"You are not currently a member of any clan. Specify a clan ID to view its members."
					);
				}
				clanId = memberOf;
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
					toDurationString(Date.now() - memberData.joinDate, { precision: 2 }) + ' ago',
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

			await logClanActivity(clanId, actorId, 'SET_DESC', {
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
				{ $set: { tag } }
			);

			await logClanActivity(clanId, actorId, 'SET_TAG', {
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

			if (clan.memberOfTheWeek === targetId) {
				return this.errorReply(`'${targetId}' is already the Member of the Week for ${clan.name}.`);
			}

			const oldMotw = clan.memberOfTheWeek;
			const HOST_RANK = '^';

			await Clans.updateOne(
				{ _id: clanId },
				{ $set: { memberOfTheWeek: targetId } }
			);

			await logClanActivity(clanId, actorId, 'SET_MOTW', {
				target: targetId,
				oldValue: oldMotw,
				newValue: targetId,
				note: `Set member of the week.`,
			});

			const clanRoom = Rooms.get(clan.chatRoom);
			if (clanRoom) {
				if (oldMotw && oldMotw !== targetId && clan.members[oldMotw]) {
					const oldMotwMember = clan.members[oldMotw];

					const roomRanks: { [key: string]: string } = {
						'owner': '#',
						'leader': '@',
						'officer': '%',
						'member': '+',
					};
					const newRoomRank = roomRanks[oldMotwMember.rank] || '+';
					clanRoom.auth.set(oldMotw, newRoomRank);
				}

				clanRoom.auth.set(targetId, HOST_RANK);
				clanRoom.saveSettings();

				clanRoom.add(`|html|<div class="infobox"><center>${user.name} set <b>${targetId}</b> as the Member of the Week!</center></div>`).update();
			}

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

			await logClanActivity(clanId, actorId, 'SET_ICON', {
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

			const [pageStr, sortBy] = target.split(',').map(s => s.trim());
			const page = parseInt(pageStr) || 1;
			const limit = 20;
			const skip = (page - 1) * limit;

			let sortKey: 'elo' | 'points' = 'elo';
			if (toID(sortBy) === 'points') {
				sortKey = 'points';
			}

			const sortField = sortKey === 'elo' ? 'stats.elo' : 'points';
			const headerName = sortKey === 'elo' ? 'ELO' : 'Points';

			const [clans, total] = await Promise.all([
				Clans.find({}, { skip, limit, sort: { [sortField]: -1 } }),
				Clans.countDocuments({}),
			]);

			if (clans.length === 0) {
				return this.errorReply("No clans found.");
			}

			const totalPages = Math.ceil(total / limit);
			const dataRows: string[][] = [];
			const headerRow = ['Rank', 'Clan', 'Tag', 'Members', headerName];
			const title = `All Clans (Page ${page}/${totalPages}) - Sorted by ${headerName}`;

			clans.forEach((clan, i) => {
				const memberCount = Object.keys(clan.members).length;
				const sortValue = sortKey === 'elo' ?
					Math.floor(clan.stats.elo || 1000) :
					clan.points;

				dataRows.push([
					`<strong>${(skip + i + 1)}</strong>`,
					clan.name,
					clan.tag,
					memberCount.toString(),
					`<strong>${sortValue}</strong>`,
				]);
			});

			let output = generateThemedTable(title, headerRow, dataRows);

			const cmd = `/clan list`;
			if (page > 1 || page < totalPages) {
				output += '<center>';
				if (page > 1) {
					output += `<button class="button" name="send" value="${cmd} ${page - 1}, ${sortKey}">Previous</button> `;
				}
				if (page < totalPages) {
					output += `<button class="button" name="send" value="${cmd} ${page + 1}, ${sortKey}">Next</button>`;
				}
				output += '</center>';
			}
			// Add buttons to change sort
			output += `<br /><center><small>Sort by: ` +
				`<button class="button" name="send" value="${cmd} 1, elo">ELO</button> ` +
				`<button class="button" name="send" value="${cmd} 1, points">Points</button>` +
				`</small></center>`;
			this.sendReply(`|html|${output}`);
		},

		async logs(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to view clan logs.");

			const parts = target.split(',').map(s => s.trim());
			let clanId: ID | undefined;
			let limit = 50;

			if (parts.length === 2) {
				clanId = toID(parts[0]);
				limit = parseInt(parts[1]) || 50;
			} else if (parts.length === 1 && parts[0]) {
				const parsed = parseInt(parts[0]);
				if (!isNaN(parsed)) {
					limit = parsed;
				} else {
					clanId = toID(parts[0]);
				}
			}

			if (limit < 1 || limit > 100) {
				return this.errorReply("Limit must be between 1 and 100.");
			}

			if (clanId) {
				this.checkCan('roomowner');
			} else {
				const actorClanInfo = await UserClans.findOne({ _id: user.id });
				clanId = actorClanInfo?.memberOf;
				if (!clanId) {
					return this.errorReply(
						"You are not currently a member of any clan. Usage: /clan logs [clan id], [limit] (admin only)"
					);
				}
			}

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			const logs = await ClanLogs.find(
				{ clanId },
				{ limit, sort: { timestamp: -1 } }
			);

			if (logs.length === 0) {
				return user.popup(`|html|<div class="infobox"><center>No activity logs found for ${clan.name}.</center></div>`);
			}

			let html = `<div class="infobox" style="max-width:600px; max-height: 400px; overflow-y: auto;"><center><strong>${clan.name} Activity Logs (Latest ${logs.length})</strong></center><br>`;
			for (const log of logs) {
				const date = to(new Date(log.timestamp), { date: true, time: true });
				const details = log.note ||
					(log.oldValue !== undefined && log.newValue !== undefined ?
						`${log.oldValue} → ${log.newValue}` : '');
				html += `<div>` +
					`<strong>Date:</strong> ${date}<br />` +
					`<strong>Actor:</strong> ${log.actor}<br />` +
					`<strong>Action:</strong> ${log.action}<br />` +
					`<strong>Target:</strong> ${log.target || '-'}<br />` +
					`<strong>Details:</strong> ${details}` +
					`</div><hr>`;
			}
			html += `</div>`;
			user.popup(`|html|${html}`);
		},

		async pointslog(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to view clan points logs.");

			const limit = parseInt(target.trim()) || 50;
			if (limit < 1 || limit > 100) {
				return this.errorReply("Limit must be between 1 and 100.");
			}

			const userClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = userClanInfo?.memberOf;

			if (!clanId) return this.errorReply("You are not currently a member of any clan.");

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Error: Your clan '${clanId}' was not found in the database.`);

			const logs = await ClanPointsLogs.find(
				{ clanId },
				{ limit, sort: { timestamp: -1 } }
			);

			if (!logs.length) {
				return user.popup(`|html|<div class="infobox"><center>No points log entries found for ${clan.name}.</center></div>`);
			}

			let html = `<div class="infobox" style="max-width:600px; max-height: 400px;"><center><strong>${clan.name} Points Logs (Latest ${logs.length})</strong></center><br>`;
			for (const log of logs) {
				html += `<div>` +
					`<strong>Date:</strong> ${new Date(log.timestamp).toLocaleString()}<br />` +
					`<strong>User:</strong> ${log.userid}<br />` +
					`<strong>Actor:</strong> ${log.actor}<br />` +
					`<strong>Amount:</strong> <span style="color:${log.amount > 0 ? 'green' : 'red'};">${log.amount > 0 ? '+' : ''}${log.amount}</span><br />` +
					`<strong>Reason:</strong> ${log.reason || '-'}` +
					`</div><hr>`;
			}
			html += `</div>`;
			user.popup(`|html|${html}`);
		},

		async profile(target, room, user) {
			this.runBroadcast();
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to view clan profiles.");

			let clanId: ID;

			if (target) {
				clanId = toID(target);
			} else {
				const userClanInfo = await UserClans.findOne({ _id: user.id });
				const memberOf = userClanInfo?.memberOf;
				if (!memberOf) {
					return this.errorReply(
						"You are not currently a member of any clan. Specify a clan ID to view its profile."
					);
				}
				clanId = memberOf;
			}

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			const totalMembers = Object.keys(clan.members).length;
			const clanAge = toDurationString(Date.now() - clan.created);
			const ownerUser = Users.getExact(clan.owner);
			const ownerName = ownerUser?.name || clan.owner;
			const motwUser = clan.memberOfTheWeek ? Users.getExact(clan.memberOfTheWeek) : null;
			const motwName = motwUser?.name || clan.memberOfTheWeek || 'None';

			const w = 160, h = 222;

			let html = `<div class="infobox" style="display: flex; align-items: stretch; padding: 15px; min-height: ${h + 30}px;">`;
			html += `<div style="flex: 0 0 ${w + 20}px; padding-right: 20px; border-right: 1px solid #ccc; overflow-y: hidden; text-align: center;">`;

			if (clan.icon) {
				html += `<img src="${clan.icon}" width="${w}" alt="${clan.name} Icon" style="border-radius: 8px; display: block; margin: 0 auto;" />`;
				html += `<div style="font-size: 0.85em; margin-top: 10px; font-weight: bold;">${clan.name}</div>`;
				html += `<div style="font-size: 0.75em; color: #666;">[${clan.tag}]</div>`;
			} else {
				html += `<div style="color: #888; text-align: center; padding-top: 50px; font-size: 0.9em; white-space: pre-wrap; width: ${w}px;">`;
				html += `<div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">${clan.name}</div>`;
				html += `<div style="font-size: 0.9em; color: #666; margin-bottom: 20px;">[${clan.tag}]</div>`;
				html += `No clan icon set.`;
				html += `</div>`;
			}

			html += `</div>`;
			html += `<div style="flex: 1; line-height: 1.7; margin-left: 20px; max-height: ${h + 30}px; overflow-y: auto;">`;
			html += `<strong style="font-size: 22px;">${clan.name}</strong><br />`;
			html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
			html += `<strong>Owner:</strong> ${ownerName}<br />`;
			html += `<strong>Members:</strong> ${totalMembers}<br />`;
			html += `<strong>Level:</strong> ${clan.level}<br />`;
			html += `<strong>Points:</strong> ${clan.points}<br />`;
			html += `<strong>Clan ELO:</strong> ${Math.floor(clan.stats.elo || 1000)}<br />`;
			html += `<strong>War Battles:</strong> ${clan.stats.clanBattleWins || 0} W / ${clan.stats.clanBattleLosses || 0} L<br />`;
			html += `<strong>Tour Wins:</strong> ${clan.stats.tourWins}<br />`;
			html += `<strong>Event Wins:</strong> ${clan.stats.eventWins}<br />`;
			html += `<strong>Member of the Week:</strong> ${motwName}<br />`;
			// html += `<strong>Invite Only:</strong> ${clan.inviteOnly ? 'Yes' : 'No'}<br />`;
			html += `<strong>Created:</strong> ${clanAge} ago<br />`;
			html += `</div></div></div>`;
			this.sendReply(`|html|${html}`);
		},

		async battlelogs(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in.");
			this.runBroadcast();

			let clanId: ID;
			if (target) {
				clanId = toID(target);
			} else {
				const userClanInfo = await UserClans.findOne({ _id: user.id });
				if (!userClanInfo?.memberOf) {
					return this.errorReply("You are not in a clan. Specify a clan ID to view its logs (e.g., /clan battlelogs [clanid]).");
				}
				clanId = userClanInfo.memberOf;
			}

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			const logs = await ClanBattleLogs.find(
				{ $or: [{ winningClan: clanId }, { losingClan: clanId }] },
				{ limit: 50, sort: { timestamp: -1 } }
			);

			if (!logs.length) {
				return this.sendReplyBox(`No clan battle logs found for ${clan.name}.`);
			}

			const headerRow = ['Date', 'Outcome', 'ELO Change', 'Winner', 'Loser', 'Format'];
			const dataRows: string[][] = [];
			const title = `${clan.name} Battle Logs (Last ${logs.length})`;

			for (const log of logs) {
				const isWin = log.winningClan === clanId;
				const eloChange = log.eloChangeWinner || 0;
				let eloChangeStr = '';
				if (log.isWarWinningBattle) {
					if (isWin) {
						eloChangeStr = `<strong style="color:green;">+${eloChange}</strong>`;
					} else {
						eloChangeStr = `<strong style="color:red;">${log.eloChangeLoser || -eloChange}</strong>`;
					}
				} else {
					eloChangeStr = `<em>-</em>`;
				}

				dataRows.push([
					to(new Date(log.timestamp), { date: true, time: true }),
					isWin ? `<strong style="color:green;">Win</strong>` : `<strong style="color:red;">Loss</strong>`,
					eloChangeStr,
					`${log.winner} (${log.winningClan})`,
					`${log.loser} (${log.losingClan})`,
					log.format,
				]);
			}

			const output = generateThemedTable(title, headerRow, dataRows);
			this.sendReply(`|html|${output}`);
		},

		async addpoints(target, room, user) {
			this.checkCan('roomowner');
			const [amountStr, ...reasonArr] = target.split(',').map(s => s.trim());
			const amount = parseInt(amountStr);
			const reason = reasonArr.join(',') || 'Admin adjustment';

			if (isNaN(amount) || amount <= 0) {
				return this.errorReply(
					"Usage: /clan addpoints [amount], [reason] (amount must be a positive number)"
				);
			}
			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			await Clans.updateOne({ _id: clanId }, { $inc: { points: amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: 'ADMIN_POINTS',
				oldValue: clan.points,
				newValue: clan.points + amount,
				note: `[ADMIN] Added ${amount} points. Reason: ${reason}`,
			});
			this.sendReply(`Added ${amount} points to clan '${clan.name}'. Reason: ${reason}`);
		},

		async removepoints(target, room, user) {
			this.checkCan('roomowner');
			const [amountStr, ...reasonArr] = target.split(',').map(s => s.trim());
			const amount = parseInt(amountStr);
			const reason = reasonArr.join(',') || 'Admin adjustment';

			if (isNaN(amount) || amount <= 0) {
				return this.errorReply(
					"Usage: /clan removepoints [amount], [reason] (amount must be a positive number)"
				);
			}
			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			await Clans.updateOne({ _id: clanId }, { $inc: { points: -amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: 'ADMIN_POINTS',
				oldValue: clan.points,
				newValue: clan.points - amount,
				note: `[ADMIN] Removed ${amount} points. Reason: ${reason}`,
			});
			this.sendReply(`Removed ${amount} points from clan '${clan.name}'. Reason: ${reason}`);
		},

		async addtourwins(target, room, user) {
			this.checkCan('roomowner');
			const amount = parseInt(target.trim()) || 1;
			if (amount <= 0) return this.errorReply("Amount must be a positive number.");

			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			await Clans.updateOne({ _id: clanId }, { $inc: { 'stats.tourWins': amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: 'ADMIN_TOURWIN',
				oldValue: clan.stats.tourWins,
				newValue: clan.stats.tourWins + amount,
				note: `[ADMIN] Added ${amount} tour win(s)`,
			});
			this.sendReply(`Added ${amount} tour win(s) to clan '${clan.name}'.`);
		},

		async removetourwins(target, room, user) {
			this.checkCan('roomowner');
			const amount = parseInt(target.trim()) || 1;
			if (amount <= 0) return this.errorReply("Amount must be a positive number.");

			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			await Clans.updateOne({ _id: clanId }, { $inc: { 'stats.tourWins': -amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: 'ADMIN_TOURWIN',
				oldValue: clan.stats.tourWins,
				newValue: clan.stats.tourWins - amount,
				note: `[ADMIN] Removed ${amount} tour win(s)`,
			});
			this.sendReply(`Removed ${amount} tour win(s) from clan '${clan.name}'.`);
		},

		async addeventwins(target, room, user) {
			this.checkCan('roomowner');
			const amount = parseInt(target.trim()) || 1;
			if (amount <= 0) return this.errorReply("Amount must be a positive number.");

			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			await Clans.updateOne({ _id: clanId }, { $inc: { 'stats.eventWins': amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: 'ADMIN_EVENTWIN',
				oldValue: clan.stats.eventWins,
				newValue: clan.stats.eventWins + amount,
				note: `[ADMIN] Added ${amount} event win(s)`,
			});
			this.sendReply(`Added ${amount} event win(s) to clan '${clan.name}'.`);
		},

		async removeeventwins(target, room, user) {
			this.checkCan('roomowner');
			const amount = parseInt(target.trim()) || 1;
			if (amount <= 0) return this.errorReply("Amount must be a positive number.");

			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

			await Clans.updateOne({ _id: clanId }, { $inc: { 'stats.eventWins': -amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: 'ADMIN_EVENTWIN',
				oldValue: clan.stats.eventWins,
				newValue: clan.stats.eventWins - amount,
				note: `[ADMIN] Removed ${amount} event win(s)`,
			});
			this.sendReply(`Removed ${amount} event win(s) from clan '${clan.name}'.`);
		},

		async setlevel(target, room, user) {
			this.checkCan('roomowner');
			const level = parseInt(target.trim());
			if (isNaN(level) || level < 1) {
				return this.errorReply(
					"Usage: /clan setlevel [level] (level must be a positive integer)"
				);
			}
			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			await Clans.updateOne({ _id: clanId }, { $set: { level } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_SETLEVEL",
				oldValue: clan.level,
				newValue: level,
				note: `[ADMIN] Set clan level to ${level}`,
			});
			this.sendReply(`Set clan '${clan.name}' level to ${level}.`);
		},

		async addlevel(target, room, user) {
			this.checkCan('roomowner');
			const amount = parseInt(target.trim());
			if (isNaN(amount) || amount <= 0) return this.errorReply("Usage: /clan addlevel [amount] (must be positive integer)");
			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			await Clans.updateOne({ _id: clanId }, { $inc: { level: amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_ADDLEVEL",
				oldValue: clan.level,
				newValue: clan.level + amount,
				note: `[ADMIN] Added ${amount} level(s)`,
			});
			this.sendReply(`Added ${amount} level(s) to clan '${clan.name}'.`);
		},

		async removelevel(target, room, user) {
			this.checkCan('roomowner');
			const amount = parseInt(target.trim());
			if (isNaN(amount) || amount <= 0) {
				return this.errorReply(
					"Usage: /clan removelevel [amount] (must be positive integer)"
				);
			}
			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			await Clans.updateOne({ _id: clanId }, { $inc: { level: -amount } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_REMOVELEVEL",
				oldValue: clan.level,
				newValue: clan.level - amount,
				note: `[ADMIN] Removed ${amount} level(s)`,
			});
			this.sendReply(`Removed ${amount} level(s) from clan '${clan.name}'.`);
		},

		async resetstats(target, room, user) {
			this.checkCan('roomowner');
			const actorClanInfo = await UserClans.findOne({ _id: user.id });
			const clanId = actorClanInfo?.memberOf;
			if (!clanId) return this.errorReply("You are not currently a member of any clan.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			const oldStats = clan.stats;
			await Clans.updateOne(
				{ _id: clanId },
				{ $set: { "stats.tourWins": 0, "stats.eventWins": 0, "stats.totalPointsEarned": 0 } }
			);
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_RESETSTATS",
				oldValue: oldStats,
				newValue: { tourWins: 0, eventWins: 0, totalPointsEarned: 0 },
				note: `[ADMIN] Reset clan stats`,
			});
			this.sendReply(`Reset all stats for clan '${clan.name}'.`);
		},

		async setdescadmin(target, room, user) {
			this.checkCan('roomowner');
			const [clanIdRaw, ...descArr] = target.split(',').map(s => s.trim());
			const clanId = toID(clanIdRaw);
			const desc = descArr.join(',') || '';
			if (!clanId || !desc) return this.errorReply("Usage: /clan setdescadmin [clan id], [desc]");
			if (desc.length > 80) return this.errorReply("Description must be 80 characters or less.");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			await Clans.updateOne({ _id: clanId }, { $set: { desc } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_SETDESC",
				oldValue: clan.desc,
				newValue: desc,
				note: `[ADMIN] Set clan description`,
			});
			this.sendReply(`Set description for clan '${clan.name}'.`);
		},

		async settagadmin(target, room, user) {
			this.checkCan('roomowner');
			const [clanIdRaw, tagRaw] = target.split(',').map(s => s.trim());
			const clanId = toID(clanIdRaw);
			const tag = tagRaw?.toUpperCase();
			if (!clanId || !tag) return this.errorReply("Usage: /clan settagadmin [clan id], [tag]");
			if (tag.length > 4 || !/^[A-Z]+$/.test(tag)) {
				return this.errorReply("Tag must be 3 characters or less and only uppercase letters.");
			}
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			await Clans.updateOne({ _id: clanId }, { $set: { tag } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_SETTAG",
				oldValue: clan.tag,
				newValue: tag,
				note: `[ADMIN] Set clan tag`,
			});
			this.sendReply(`Set tag for clan '${clan.name}'.`);
		},

		async seticonadmin(target, room, user) {
			this.checkCan('roomowner');
			const [clanIdRaw, ...iconArr] = target.split(',').map(s => s.trim());
			const clanId = toID(clanIdRaw);
			const iconUrl = iconArr.join(',') || '';
			if (!clanId || !iconUrl) return this.errorReply("Usage: /clan seticonadmin [clan id], [icon url]");
			if (iconUrl.length > 1000 || !/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i.test(iconUrl)) {
				return this.errorReply("Icon URL must be a valid HTTP(S) image url (png/jpg/jpeg/gif/webp) and 1000 chars or less.");
			}
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			await Clans.updateOne({ _id: clanId }, { $set: { icon: iconUrl } });
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_SETICON",
				oldValue: clan.icon,
				newValue: iconUrl,
				note: `[ADMIN] Set clan icon`,
			});
			this.sendReply(`Set icon for clan '${clan.name}'.`);
		},

		async kickall(target, room, user) {
			this.checkCan('roomowner');
			const clanId = toID(target.trim());
			if (!clanId) return this.errorReply("Usage: /clan kickall [clan id]");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			const ownerId = clan.owner;
			const membersToKick = Object.keys(clan.members).filter(uid => uid !== ownerId);
			if (!membersToKick.length) return this.sendReply(`No members to kick in clan '${clan.name}'.`);
			await Clans.updateOne({ _id: clanId }, {
				$unset: Object.fromEntries(membersToKick.map(uid => [`members.${uid}`, ""])),
			});
			await UserClans.updateMany(
				{ memberOf: clanId, _id: { $in: membersToKick } },
				{ $unset: { memberOf: 1 } }
			);
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_KICKALL",
				note: `[ADMIN] Kicked all members except owner.`,
			});
			this.sendReply(`Kicked all members except owner from clan '${clan.name}'.`);
		},

		async clearinvites(target, room, user) {
			this.checkCan('roomowner');
			const clanId = toID(target.trim());
			if (!clanId) return this.errorReply("Usage: /clan clearinvites [clan id]");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			const invitedUserIds = clan.invites.map(i => i.userid);
			await Clans.updateOne({ _id: clanId }, { $set: { invites: [] } });
			if (invitedUserIds.length) {
				await UserClans.updateMany(
					{ _id: { $in: invitedUserIds } },
					{ $pull: { invites: clanId } }
				);
			}
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_CLEARINVITES",
				note: `[ADMIN] Cleared all clan invites.`,
			});
			this.sendReply(`Cleared all invites from clan '${clan.name}'.`);
		},

		async export(target, room, user) {
			this.checkCan('roomowner');
			const clanId = toID(target.trim());
			if (!clanId) return this.errorReply("Usage: /clan export [clan id]");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			const members = Object.keys(clan.members);
			const logs = await ClanLogs.find({ clanId }, {});
			const pointsLogs = await ClanPointsLogs.find({ clanId }, {});
			const exportObj = {
				clan,
				members,
				logs,
				pointsLogs,
			};
			const exportStr = `<details><summary>Export data for clan '${clan.name}'</summary><pre>${JSON.stringify(exportObj, null, 2)}</pre></details>`;
			this.sendReply(`|html|${exportStr}`);
		},

		async transferadmin(target, room, user) {
			this.checkCan('roomowner');
			const [clanIdRaw, newOwnerRaw] = target.split(',').map(s => s.trim());
			const clanId = toID(clanIdRaw);
			const newOwnerId = toID(newOwnerRaw);
			if (!clanId || !newOwnerId) return this.errorReply("Usage: /clan transferadmin [clan id], [new owner]");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			if (!clan.members[newOwnerId]) return this.errorReply(`User '${newOwnerId}' is not a member of the clan.`);
			const oldOwnerId = clan.owner;
			await Clans.updateOne({ _id: clanId }, {
				$set: {
					owner: newOwnerId,
					[`members.${newOwnerId}.rank`]: "owner",
					[`members.${oldOwnerId}.rank`]: "leader",
				},
			});
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_TRANSFEROWNER",
				oldValue: oldOwnerId,
				newValue: newOwnerId,
				note: `[ADMIN] Ownership transferred.`,
			});
			this.sendReply(`Transferred ownership of clan '${clan.name}' to '${newOwnerId}'.`);
		},

		async banuser(target, room, user) {
			this.checkCan('roomowner');
			const bannedId = toID(target.trim());
			if (!bannedId) return this.errorReply("Usage: /clan banuser [username]");
			await ClanBans.upsert({ _id: bannedId }, { $set: { banned: true } });
			this.sendReply(`User '${bannedId}' is now banned from joining clans.`);
		},

		async unbanuser(target, room, user) {
			this.checkCan('roomowner');
			const bannedId = toID(target.trim());
			if (!bannedId) return this.errorReply("Usage: /clan unbanuser [username]");
			await ClanBans.deleteOne({ _id: bannedId });
			this.sendReply(`User '${bannedId}' is unbanned and may join clans.`);
		},

		async clearlogs(target, room, user) {
			this.checkCan('roomowner');
			const clanId = toID(target.trim());
			if (!clanId) return this.errorReply("Usage: /clan clearlogs [clan id]");
			await ClanLogs.deleteMany({ clanId });
			await ClanPointsLogs.deleteMany({ clanId });
			this.sendReply(`Cleared all logs for clan '${clanId}'.`);
		},

		async clearmembers(target, room, user) {
			this.checkCan('roomowner');
			const clanId = toID(target.trim());
			if (!clanId) return this.errorReply("Usage: /clan clearmembers [clan id]");
			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);
			const ownerId = clan.owner;
			const membersToRemove = Object.keys(clan.members).filter(uid => uid !== ownerId);
			if (!membersToRemove.length) return this.sendReply(`No members to remove in clan '${clan.name}'.`);
			await Clans.updateOne({ _id: clanId }, {
				$unset: Object.fromEntries(membersToRemove.map(uid => [`members.${uid}`, ""])),
			});
			await UserClans.updateMany(
				{ memberOf: clanId, _id: { $in: membersToRemove } },
				{ $unset: { memberOf: 1 } }
			);
			await ClanLogs.insertOne({
				clanId,
				timestamp: Date.now(),
				actor: user.id,
				action: "ADMIN_CLEARMEMBERS",
				note: `[ADMIN] Removed all members except owner.`,
			});
			this.sendReply(`Removed all members except owner from clan '${clan.name}'.`);
		},

		war: {
			...warCommands,
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/clan create [Clan Name], [Owner ID]", desc: "Create a new clan. Requires: &." },
				{ cmd: "/clan delete [Clan ID]", desc: "Delete a clan. Requires: &." },
				{ cmd: "/clan join [Clan ID]", desc: "Join a clan." },
				{ cmd: "/clan leave", desc: "Leave your current clan." },
				{ cmd: "/clan kick [user]", desc: "Remove a member from the clan." },
				{ cmd: "/clan invite [user]", desc: "Invite a user to your clan." },
				{ cmd: "/clan deinvite [user]", desc: "Revoke a user's invite." },
				{ cmd: "/clan invites", desc: "View clan invites." },
				{ cmd: "/clan inviteonly [on/off/toggle]", desc: "Toggle invite-only mode." },
				{ cmd: "/clan announce [message]", desc: "Send announcement to all members." },
				{ cmd: "/clan createrank [id], [name], [level]", desc: "Create a custom rank." },
				{ cmd: "/clan deleterank [id]", desc: "Delete a custom rank." },
				{ cmd: "/clan editrank [id], [permission], [true/false]", desc: "Edit rank permissions." },
				{ cmd: "/clan ranks", desc: "View all ranks and permissions." },
				{ cmd: "/clan permissionlist", desc: "View available permissions." },
				{ cmd: "/clan promote [user], [rank]", desc: "Promote a member." },
				{ cmd: "/clan demote [user], [rank]", desc: "Demote a member." },
				{ cmd: "/clan transfer [user]", desc: "Transfer clan ownership." },
				{ cmd: "/clan members [Clan ID]", desc: "View member list." },
				{ cmd: "/clan setdesc [description]", desc: "Set clan description." },
				{ cmd: "/clan settag [tag]", desc: "Set clan tag." },
				{ cmd: "/clan setmotw [user]", desc: "Set member of the week." },
				{ cmd: "/clan seticon [URL]", desc: "Set clan icon." },
				{ cmd: "/clan list [page], [sortby]", desc: "View all clans. Sort by elo or points." },
				{ cmd: "/clan logs [Clan ID], [limit]", desc: "View activity logs." },
				{ cmd: "/clan pointslog [limit]", desc: "View points logs." },
				{ cmd: "/clan profile [Clan ID]", desc: "View clan profile." },
				{ cmd: "/clan war help", desc: "View all clan war commands." },
				{ cmd: "/clan battlelogs [clanid]", desc: "View a clan's recent war battle logs." },
				{ cmd: "/clan addpoints [amount], [reason]", desc: "Add points to clan. Requires: &." },
				{ cmd: "/clan removepoints [amount], [reason]", desc: "Remove points from clan. Requires: &." },
				{ cmd: "/clan addtourwins [amount]", desc: "Add tour wins. Requires: &." },
				{ cmd: "/clan removetourwins [amount]", desc: "Remove tour wins. Requires: &." },
				{ cmd: "/clan addeventwins [amount]", desc: "Add event wins. Requires: &." },
				{ cmd: "/clan removeeventwins [amount]", desc: "Remove event wins. Requires: &." },
				{ cmd: "/clan setlevel [level]", desc: "Set clan level. Requires: &." },
				{ cmd: "/clan addlevel [amount]", desc: "Add levels. Requires: &." },
				{ cmd: "/clan removelevel [amount]", desc: "Remove levels. Requires: &." },
				{ cmd: "/clan resetstats", desc: "Reset clan stats. Requires: &." },
				{ cmd: "/clan setdescadmin [clan id], [desc]", desc: "Set description for any clan. Requires: &." },
				{ cmd: "/clan settagadmin [clan id], [tag]", desc: "Set tag for any clan. Requires: &." },
				{ cmd: "/clan seticonadmin [clan id], [icon url]", desc: "Set icon for any clan. Requires: &." },
				{ cmd: "/clan kickall [clan id]", desc: "Kick all members except owner. Requires: &." },
				{ cmd: "/clan clearinvites [clan id]", desc: "Clear all clan invites. Requires: &." },
				{ cmd: "/clan export [clan id]", desc: "Export clan data. Requires: &." },
				{ cmd: "/clan transferadmin [clan id], [new owner]", desc: "Transfer ownership. Requires: &." },
				{ cmd: "/clan banuser [username]", desc: "Ban user from joining clans. Requires: &." },
				{ cmd: "/clan unbanuser [username]", desc: "Unban user. Requires: &." },
				{ cmd: "/clan clearlogs [clan id]", desc: "Clear all logs for clan. Requires: &." },
				{ cmd: "/clan clearmembers [clan id]", desc: "Remove all members except owner. Requires: &." },
			];
			const html = `<center><strong>Clan Commands</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(`<div style="max-height: 380px; overflow-y: auto;">${html}</div>`);
		},
	},
};
