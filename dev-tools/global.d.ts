import BattleType = require('./../sim/battle');
import BattleStreamType = require('./../sim/battle-stream');
import DataType = require('./../sim/dex-data');
import DexType = require('./../sim/dex');
import SimType = require('./../sim/index');
import PokemonType = require('./../sim/pokemon');
import PRNGType = require('./../sim/prng');
import SideType = require('./../sim/side');
import TeamValidatorType = require('./../sim/team-validator');
import RoomsType = require('./../rooms');
import RoomlogsType = require('./../roomlogs');
import LadderStoreType = require('./../ladders-remote');
import LaddersType = require('./../ladders');
import UsersType = require('./../users');
import PunishmentsType = require('./../punishments');
import StreamsType = require('./../lib/streams');
import child_process = require('child_process');
import ChatType = require('./../chat');

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
	const BasicEffect: typeof DataType.BasicEffect
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
