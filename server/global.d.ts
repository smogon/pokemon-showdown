import child_process = require('child_process');

import RoomsType = require('./rooms');
import RoomlogsType = require('./roomlogs');
import LadderStoreType = require('./ladders-remote');
import LaddersType = require('./ladders');
import UsersType = require('./users');
import PunishmentsType = require('./punishments');
import ChatType = require('./chat');

import * as StreamsType from './../lib/streams';

declare global {
	namespace NodeJS {
		interface Global {
			Dnsbl: any
			Config: any
			Chat: any
			__version: string
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
	const Users: typeof UsersType
	const User: typeof UsersType.User
	const Connection: typeof UsersType.Connection

	// chat
	const Chat: typeof ChatType
	const CommandContext: typeof ChatType.CommandContext
	const PageContext: typeof ChatType.PageContext
}
