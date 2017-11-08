import * as BattleType from './../sim/battle'
import * as DataType from './../sim/dex-data'
import * as DexType from './../sim/dex'
import * as PokemonType from './../sim/pokemon'
import * as PRNGType from './../sim/prng'
import * as SideType from './../sim/side'
import * as TeamValidatorType from './../sim/team-validator'
import * as RoomsType from './../rooms'

declare global {
	// modules
	const Dex: typeof DexType
	const Chat: any
	const Punishments: any

	// sim
	const Battle: typeof BattleType
	const ModdedDex: typeof DexType
	const Pokemon: typeof PokemonType
	const PRNG: typeof PRNGType
	const Side: typeof SideType
	const Validator: typeof TeamValidatorType.Validator

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
	const ChatRoom: typeof RoomsType.ChatRoom
	const GameRoom: typeof RoomsType.GameRoom
	const Room: typeof RoomsType.GlobalRoom | typeof RoomsType.ChatRoom | typeof RoomsType.GameRoom;
	const RoomGame: typeof RoomsType.RoomGame
	const RoomBattle: typeof RoomsType.RoomBattle
	const Rooms: typeof RoomsType
}
