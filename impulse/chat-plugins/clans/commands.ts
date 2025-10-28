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
	'../../utils.ts';

const ALL_PERMISSIONS: ClanPermissions = {
	canInvite: true,
	canDeinvite: true,
	canKick: true,
	canPromote: true,
	canDemote: true,
	canEditDesc: true,
	canEditIcon: true,
	canEditTag: true,
	canSetMotd: true,
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
			this.checkCan('bypassall');

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
						isPrivate: 'hidden',
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
					const popupMessage = `|html|<div class="infobox"><div class="infobox-message">${user.name} has created the clan <b>${clanName}</b> for you! You are the Room Owner (#).</div><br /><center><button class="button" name="join" value="${newRoom.roomid}">Go to Clan Room: #${newRoom.roomid}</button></center></div>`;
					ownerUser.popup(popupMessage);
				}

				this.sendReply(`Clan "${clanName}" has been successfully created! Owner: ${ownerId}.`);
				this.sendReply(`Persistent chatroom: #${chatRoomId} created/updated. Owner was set as room owner (#).`);
			} catch (e) {
				this.errorReply("An error occurred while creating the clan.");
				await Clans.deleteOne({ _id: clanId });
				await UserClans.updateOne({ _id: ownerId }, { $unset: { memberOf: 1 } });
				Monitor.crashlog(e as Error, "Clan creation command");
			}
		},

		async delete(target, room, user) {
			this.checkCan('bypassall');

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
				if (chatRoom) {
					Rooms.global.deregisterChatRoom(chatRoom.roomid);
					Rooms.global.delistChatRoom(chatRoom.roomid);
					chatRoom.destroy();
				}

				await Clans.deleteOne({ _id: clanId });
				await UserClans.updateMany({ memberOf: clanId }, { $unset: { memberOf: 1 } });
				await ClanLogs.deleteMany({ clanId: clanId });
				await ClanPointsLogs.deleteMany({ clanId: clanId });
				await ClanBankLogs.deleteMany({ clanId: clanId });

				if (ownerUser?.connected) {
					ownerUser.popup(`|html|Your clan <b>${clan.name}</b> was deleted by ${user.name}. All related data and the chatroom (#${chatRoomId}) have been removed.`);
				}

				this.sendReply(`Clan ${clan.name} (${clanId}) has been successfully deleted.`);
			} catch (e) {
				this.errorReply("An error occurred while deleting the clan.");
				Monitor.crashlog(e as Error, "Clan deletion command");
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
				clanRoom.add(`|c|${user.getIdentity(clanRoom)}|/log ${user.name} invited ${targetId} to the clan.`).update();
			}
		},

		async invites(target, room, user) {
			this.checkChat();
			if (!user.named) return this.errorReply("You must be logged in to check invites.");

			const userId = user.id;

			const userClanInfo = await UserClans.findOne({ _id: userId });
			const memberOfClanId = userClanInfo?.memberOf;

			let output = '';
			const dataRows: string[][] = [];
			
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
				
				output += generateThemedTable(title, headerRow, dataRows);
				output += '<hr />';
			} else {
				output += `<div class="infobox">You have no pending clan invitations.</div><hr />`;
			}

			if (memberOfClanId) {
				const clan = await Clans.findOne({ _id: memberOfClanId });
				if (clan && hasClanPermission(clan, userId, 'canInvite')) {
					const sentInvites = clan.invites;

					if (sentInvites.length) {
						const sentDataRows: string[][] = [];
						const sentHeaderRow = ['User', 'Invited By', 'Date'];
						const sentTitle = `Invites Sent by ${clan.name}`;
						
						sentInvites.forEach(invite => {
							sentDataRows.push([
								invite.userid,
								invite.actor,
								Utils.to(new Date(invite.timestamp), {date: true, time: true})
							]);
						});
						
						output += generateThemedTable(sentTitle, sentHeaderRow, sentDataRows);
					} else {
						output += `<div class="infobox">${clan.name} has no pending outgoing invitations.</div>`;
					}
				}
			}

			if (!output) {
				return this.errorReply("You are not currently a member of a clan and have no pending invites.");
			}
			
			this.sendReply(`|html|${output}`);
		},
	},
};
