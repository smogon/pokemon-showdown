import * as child_process from 'child_process';

import RoomsType = require('./rooms');
import RoomlogsType = require('./roomlogs');
import {LadderStore as LadderStoreType} from './ladders-remote';
import LaddersType = require('./ladders');
import PunishmentsType = require('./punishments');
import ChatType = require('./chat');

import * as StreamsType from './../lib/streams';
import * as UsersType from './users';

declare global {
	namespace NodeJS {
		interface Global {
			IPTools: any
			Config: any
			Chat: any
			__version: {head: string, origin?: string}
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
	const ChatRoom: typeof RoomsType.ChatRoomTypeForTS
	const GameRoom: typeof RoomsType.GameRoom
	const BasicRoom: typeof RoomsType.BasicRoom
	const BasicChatRoom: typeof RoomsType.ChatRoom
	const RoomGame: typeof RoomsType.RoomGame
	const RoomBattle: typeof RoomsType.RoomBattle
	const Rooms: typeof RoomsType
	const Roomlogs: typeof RoomlogsType
	const Roomlog: typeof RoomlogsType.Roomlog

	// users
	const Users: typeof UsersType.Users
	const User: typeof UsersType.Users.User
	const Connection: typeof UsersType.Users.Connection
	// chat
	const Chat: typeof ChatType
	const CommandContext: typeof ChatType.CommandContext
	const PageContext: typeof ChatType.PageContext
}
