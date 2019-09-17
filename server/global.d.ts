import * as child_process from 'child_process';

import * as RoomsType from './rooms';
import * as RoomlogsType from './roomlogs';
import * as RoomGameType from './room-game';
import * as RoomBattleType from './room-battle';
import {LadderStore as LadderStoreType} from './ladders-remote';
import {Ladders as LaddersType} from './ladders';
import {Punishments as PunishmentsType} from './punishments';

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

	namespace Streams {
		export type WriteStream = StreamsType.WriteStream
		export type ReadStream = StreamsType.ReadStream
		export type ReadWriteStream = StreamsType.ReadWriteStream
		export type ObjectWriteStream<T> = StreamsType.ObjectWriteStream<T>
		export type ObjectReadStream<T> = StreamsType.ObjectReadStream<T>
		export type ObjectReadWriteStream<T> = StreamsType.ObjectReadWriteStream<T>
	}

	type ChildProcess = child_process.ChildProcess

	// rooms
	type GlobalRoom = RoomsType.GlobalRoom
	type ChatRoom = RoomsType.ChatRoom
	type GameRoom = RoomsType.GameRoom
	type BasicRoom = RoomsType.BasicRoom
	type BasicChatRoom = RoomsType.BasicChatRoom
	type RoomGame = RoomGameType.RoomGame
	type RoomBattle = RoomBattleType.RoomBattle
	const Rooms: typeof RoomsType.Rooms
	const Roomlogs: typeof RoomlogsType.Roomlogs
	type Roomlog = RoomlogsType.Roomlog
	type Room = RoomsType.Room
	type RoomID = string & {__isRoomID: true};
	namespace Rooms {
		export type GlobalRoom = RoomsType.GlobalRoom
		export type ChatRoom = RoomsType.ChatRoom
		export type GameRoom = RoomsType.GameRoom
		export type BasicRoom = RoomsType.BasicRoom
		export type BasicChatRoom = RoomsType.BasicChatRoom
		export type RoomGame = RoomGameType.RoomGame
		export type RoomBattle = RoomBattleType.RoomBattle
		export type Roomlog = RoomlogsType.Roomlog
		export type Room = RoomsType.Room
	}

	// users
	const Users: typeof UsersType.Users
	type User = UsersType.User
	type Connection = UsersType.Connection
	namespace Users {
		export type User = UsersType.User
		export type Connection = UsersType.Connection
	}

	// chat
	const Chat: typeof ChatType.Chat
	type CommandContext = ChatType.CommandContext
	type PageContext = ChatType.PageContext
	type PageTable = ChatType.PageTable
	type ChatCommands = ChatType.ChatCommands
	type ChatFilter = ChatType.ChatFilter
	type NameFilter = ChatType.NameFilter
	type StatusFilter = ChatType.StatusFilter
	type LoginFilter = ChatType.LoginFilter
	namespace Chat {
		export type CommandContext = ChatType.CommandContext
		export type PageContext = ChatType.PageContext
		export type PageTable = ChatType.PageTable
		export type ChatCommands = ChatType.ChatCommands
		export type ChatFilter = ChatType.ChatFilter
		export type NameFilter = ChatType.NameFilter
		export type StatusFilter = ChatType.StatusFilter
		export type LoginFilter = ChatType.LoginFilter
	}
}
