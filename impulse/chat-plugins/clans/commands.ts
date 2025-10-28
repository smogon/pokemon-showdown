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
import { Rooms } from '../rooms';
import type { RoomSettings } from '../rooms';

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
		async create(target, room, user) {
			this.checkCan('bypassall');

			if (!user.named) {
				return this.errorReply("You must be logged in to create a clan.");
			}

			const clanName = target;
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

			const [existingClan, userClanInfo] = await Promise.all([
				Clans.findOne({ _id: clanId }),
				UserClans.findOne({ _id: user.id }),
			]);

			if (existingClan) {
				return this.errorReply(`A clan with the ID '${clanId}' already exists.`);
			}
			if (userClanInfo?.memberOf) {
				return this.errorReply("You are already a member of a clan.");
			}

			const now = Date.now();
			const chatRoomId = `clans-${clanId}` as RoomID;

			const newClan: ClanDoc = {
				_id: clanId,
				name: clanName,
				tag: clanId.slice(0, 5).toUpperCase(),
				owner: user.id,
				members: {
					[user.id]: {
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
				await UserClans.upsert({ _id: user.id }, { $set: { memberOf: clanId } });
				await ClanLogs.insertOne({
					clanId: clanId,
					timestamp: now,
					actor: user.id,
					action: 'CREATE',
					note: `Clan ${clanName} created.`,
				});

				const chatRoomTitle = `[Clan] ${clanName}`;
				if (Rooms.get(chatRoomId)) {
					this.sendReply(`Clan "${clanName}" created. The chatroom #${chatRoomId} already exists.`);
					user.joinRoom(chatRoomId, this.connection);
					return;
				}

				const roomSettings: RoomSettings = {
					title: chatRoomTitle,
					auth: {},
					creationTime: Date.now(),
					modjoin: '+',
					isPrivate: 'hidden',
				};

				const newRoom = Rooms.createChatRoom(chatRoomId, chatRoomTitle, roomSettings);

				Rooms.global.settingsList.push(roomSettings);
				Rooms.global.chatRooms.push(newRoom);
				Rooms.global.writeChatRoomData();

				user.joinRoom(newRoom.roomid, this.connection);

				this.privateGlobalModAction(`${user.name} created the clan ${clanName} (${clanId}).`);
				this.sendReply(`Clan "${clanName}" has been successfully created!`);
				this.sendReply(`Created persistent chatroom: #${chatRoomId}. It has been set to modjoin (+).`);
			} catch (e) {
				this.errorReply("An error occurred while creating the clan.");
				await Clans.deleteOne({ _id: clanId });
				await UserClans.updateOne({ _id: user.id }, { $unset: { memberOf: 1 } });
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

			const chatRoomId = clan.chatRoom;
			const chatRoom = Rooms.get(chatRoomId);

			try {
				// 1. Delete the chatroom
				if (chatRoom) {
					// Make it non-persistent
					Rooms.global.deregisterChatRoom(chatRoom.roomid);
					// Remove from active chat room list
					Rooms.global.delistChatRoom(chatRoom.roomid);
					// Kick all users, clear timers, and remove from Rooms.rooms
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
