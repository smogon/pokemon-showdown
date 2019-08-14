import * as child_process from 'child_process';

import * as RoomsType from './rooms';
import {Roomlogs as RoomlogsType} from './roomlogs';
import {LadderStore as LadderStoreType} from './ladders-remote';
import {Ladders as LaddersType} from './ladders';
import PunishmentsType = require('./punishments');

import * as StreamsType from './../lib/streams';
import * as UsersType from './users';
import * as ChatType from './chat'

declare global {
	namespace NodeJS {
		interface Global {
			IPTools: any
			Config: any
			Chat: any
			__version: {head: string, origin?: string, tree?: string}
		}
	}
	// modules
	const Punishments: typeof PunishmentsType
	const Ladders: typeof LaddersType
	const LadderStoreT: typeof LadderStoreType

	const WriteStream: typeof StreamsType.WriteStream

	type ChildProcess = child_process.ChildProcess

	// rooms
	const GlobalRoom: typeof RoomsType.GlobalRoom
	const ChatRoom: typeof RoomsType.Rooms.ChatRoomTypeForTS
	const GameRoom: typeof RoomsType.GameRoom
	const BasicRoom: typeof RoomsType.BasicRoom
	const BasicChatRoom: typeof RoomsType.ChatRoom
	const RoomGame: typeof RoomsType.Rooms.RoomGame
	const RoomBattle: typeof RoomsType.Rooms.RoomBattle
	const Rooms: typeof RoomsType.Rooms
	const Roomlogs: typeof RoomlogsType
	const Roomlog: typeof RoomlogsType.Roomlog

	// users
	const Users: typeof UsersType.Users
	const User: typeof UsersType.Users.User
	const Connection: typeof UsersType.Users.Connection
	// chat
	const Chat: typeof ChatType.Chat
	const CommandContext: typeof ChatType.Chat.CommandContext
	const PageContext: typeof ChatType.Chat.PageContext
}
