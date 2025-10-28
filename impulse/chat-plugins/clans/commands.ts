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
	ClanPermissions,
	CustomClanRank,
	ClanStats,
} from './interface';

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
			canSetMotw: true,
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

export const commands: Chat.ChatCommands = {
	clan: {
		create: async function (target, room, user) {
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
					actor: user.id, // The admin running the command is the actor
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
					// Ensure owner is set even if room pre-exists
					newRoom.auth.set(ownerId, '#');
					newRoom.saveSettings();
				}

				// The owner joins the room if they are connected
				if (ownerUser.connected) {
					ownerUser.joinRoom(newRoom.roomid);
				}

				this.privateGlobalModAction(`${user.name} created the clan ${clanName} (${clanId}) for owner ${ownerId}.`);
				this.sendReply(`Clan "${clanName}" has been successfully created! Owner: ${ownerId}.`);
				this.sendReply(`Persistent chatroom: #${chatRoomId} created/updated. Owner was set as room owner (#).`);
			} catch (e) {
				this.errorReply("An error occurred while creating the clan.");
				await Clans.deleteOne({ _id: clanId });
				await UserClans.updateOne({ _id: ownerId }, { $unset: { memberOf: 1 } });
				Monitor.crashlog(e as Error, "Clan creation command");
			}
		},

		delete: async function (target, room, user) {
			this.checkCan('bypassall');

			const clanId = toID(target);
			if (!clanId) {
				return this.errorReply("You must specify a clan ID.");
			}

			const clan = await Clans.findOne({ _id: clanId });
			if (!clan) {
				return this.errorReply(`Clan '${clanId}' not found.`);
			}

			const chatRoomId = clan.chatRoom;
			const chatRoom = Rooms.get(chatRoomId);

			try {
				// 1. Delete the chatroom
				if (chatRoom) {
					Rooms.global.deregisterChatRoom(chatRoom.roomid);
					Rooms.global.delistChatRoom(chatRoom.roomid);
					chatRoom.destroy();
				}

				// 2. Delete all clan data from DB
				await Clans.deleteOne({ _id: clanId });
				await UserClans.updateMany({ memberOf: clanId }, { $unset: { memberOf: 1 } });
				await ClanLogs.deleteMany({ clanId: clanId });
				await ClanPointsLogs.deleteMany({ clanId: clanId });
				await ClanBankLogs.deleteMany({ clanId: clanId });

				this.privateGlobalModAction(`${user.name} deleted the clan ${clan.name} (${clanId}).`);
				this.sendReply(`Clan ${clan.name} (${clanId}) has been successfully deleted.`);
			} catch (e) {
				this.errorReply("An error occurred while deleting the clan.");
				Monitor.crashlog(e as Error, "Clan deletion command");
			}
		},
	},
};
