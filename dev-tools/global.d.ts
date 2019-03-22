import child_process = require('child_process');

import {Battle as BattleType} from './../sim/battle';
import * as BattleStreamType from './../sim/battle-stream';
import * as DataType from './../sim/dex-data';
import DexType = require('./../sim/dex');
import SimType = require('./../sim/index');
import {Field as FieldType} from './../sim/field';
import {Pokemon as PokemonType} from './../sim/pokemon';
import {PRNG as PRNGType, PRNGSeed as PRNGSeedType} from './../sim/prng';
import {Side as SideType} from './../sim/side';
import {TeamValidator as TeamValidatorType} from'./../sim/team-validator';

import RoomsType = require('./../server/rooms');
import RoomlogsType = require('./../server/roomlogs');
import LadderStoreType = require('./../server/ladders-remote');
import LaddersType = require('./../server/ladders');
import UsersType = require('./../server/users');
import PunishmentsType = require('./../server/punishments');
import ChatType = require('./../server/chat');

import * as StreamsType from './../lib/streams';

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
	type PRNGSeed = PRNGSeedType
	const Battle: BattleType
	const Field: FieldType
	const ModdedDex: typeof DexType
	const Pokemon: PokemonType
	const PRNG: PRNGType
	const Side: SideType
	const Sim: typeof SimType
	const TeamValidator: typeof TeamValidatorType
	const Validator: typeof TeamValidatorType.Validator
	const BattleStream: BattleStreamType.BattleStream

	// dex data
	const Ability: DataType.Ability
	const BasicEffect: DataType.BasicEffect
	const Format: DataType.Format
	const Item: DataType.Item
	const Move: DataType.Move
	const TypeInfo: DataType.TypeInfo
	const PureEffect: DataType.PureEffect
	const RuleTable: DataType.RuleTable
	const Template: DataType.Template
	const toId: typeof DataType.Tools.getId
	const Tools: DataType.Tools

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
