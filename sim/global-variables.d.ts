import {Battle as BattleType} from './battle';
import * as BattleStreamType from './battle-stream';
import * as DataType from './dex-data';
import {Dex as DexType} from './dex';
import * as SimType from './index';
import {Field as FieldType} from './field';
import {Pokemon as PokemonType} from './pokemon';
import {PRNG as PRNGType} from './prng';
import {Side as SideType} from './side';
import {TeamValidator as TeamValidatorType} from'./team-validator';

declare global {
	namespace NodeJS {
		interface Global {
			Dex: any
			toID(input: any): string
			TeamValidator: any
			__version: {head: string, origin?: string, tree?: string}
		}
	}
	const Battle: BattleType
	const BattleStream: BattleStreamType.BattleStream
	const Dex: typeof DexType
	const Field: FieldType
	const ModdedDex: typeof DexType
	const PRNG: PRNGType
	const Pokemon: PokemonType
	const Side: SideType
	const Sim: typeof SimType
	const TeamValidator: typeof TeamValidatorType

	const Ability: DataType.Ability
	const BasicEffect: DataType.BasicEffect
	const Format: DataType.Format
	const Item: DataType.Item
	const Move: DataType.Move
	const PureEffect: DataType.PureEffect
	const RuleTable: DataType.RuleTable
	const Template: DataType.Template
	const Tools: DataType.Tools
	const TypeInfo: DataType.TypeInfo
	const toID: typeof DataType.Tools.getId
}
