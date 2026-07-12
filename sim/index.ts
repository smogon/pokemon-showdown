/**
 * Simulator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Here's where all the simulator APIs get exported for general use.
 * `require('pokemon-showdown')` imports from here.
 *
 * @license MIT
 */

// battle simulation

export { Battle } from './battle';
export {
	decodeGen9RandomBattleAction,
	encodeBattleState,
	encodeOmniscientBattleState,
	encodePlayerBattleState,
	GEN9_RANDOM_BATTLE_ACTION_LABELS,
	GEN9_RANDOM_BATTLE_TENSOR_MANIFEST,
	GEN9_SINGLES_ACTION_LABELS,
	type EncodedBattleState,
	type EncodedTensor,
	type Gen9RandomBattleTensorManifest,
} from './battle-tensors';
export { BattleStream, getPlayerStreams } from './battle-stream';
export { Gen9RandomBattleObservationTracker } from './battle-observation';
export { Pokemon } from './pokemon';
export { PRNG } from './prng';
export { Side } from './side';

// dex API

export { Dex, toID } from './dex';

// teams API

export { Teams } from './teams';
export { TeamValidator } from './team-validator';

// misc libraries

export * from '../lib';
