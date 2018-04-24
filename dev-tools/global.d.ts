import * as BattleType from './../sim/battle'
import * as BattleStreamType from './../sim/battle-stream'
import * as DataType from './../sim/dex-data'
import * as DexType from './../sim/dex'
import * as SimType from './../sim/index'
import * as PokemonType from './../sim/pokemon'
import * as PRNGType from './../sim/prng'
import * as SideType from './../sim/side'
import * as TeamValidatorType from './../sim/team-validator'
import * as RoomsType from './../rooms'
import * as RoomlogsType from './../roomlogs'
import * as LadderStoreType from './../ladders-remote'
import * as LaddersType from './../ladders'
import * as UsersType from './../users'
import * as PunishmentsType from './../punishments'
import * as StreamsType from './../lib/streams'
import * as child_process from 'child_process'
import * as ChatType from './../chat'

declare global {
	// modules
	const Dex: typeof DexType
	const Punishments: typeof PunishmentsType
	const Ladders: typeof LaddersType
	const LadderStoreT: typeof LadderStoreType

	const WriteStream: typeof StreamsType.WriteStream
	const ReadStream: typeof StreamsType.ReadStream
	const ReadWriteStream: typeof StreamsType.ReadWriteStream
	const ObjectWriteStream: typeof StreamsType.ObjectWriteStream
	const ObjectReadStream: typeof StreamsType.ObjectReadStream
	const ObjectReadWriteStream: typeof StreamsType.ObjectReadWriteStream

	type ChildProcess = child_process.ChildProcess

	// sim
	type PlayerSlot = 'p1' | 'p2'
	type PRNGSeed = [number, number, number, number]
	const Battle: typeof BattleType
	const ModdedDex: typeof DexType
	const Pokemon: typeof PokemonType
	const PRNG: typeof PRNGType
	const Side: typeof SideType
	const Sim: typeof SimType
	const TeamValidator: typeof TeamValidatorType
	const Validator: typeof TeamValidatorType.Validator
	const BattleStream: typeof BattleStreamType.BattleStream

	// dex data
	const Ability: typeof DataType.Ability
	const Effect: typeof DataType.Effect
	const Format: typeof DataType.Format
	const Item: typeof DataType.Item
	const Move: typeof DataType.Move
	const TypeInfo: typeof DataType.TypeInfo
	const PureEffect: typeof DataType.PureEffect
	const RuleTable: typeof DataType.RuleTable
	const Template: typeof DataType.Template
	const toId: typeof DataType.Tools.getId
	const Tools: typeof DataType.Tools

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
}
