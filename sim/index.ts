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

export { Battle, BattleOptions } from './battle';
export { BattleStream, BattlePlayer, getPlayerStreams } from './battle-stream';
export { Pokemon } from './pokemon';
export { PRNG, PRNGSeed } from './prng';
export { Side, ChoiceRequest, PokemonSwitchRequestData } from './side';
export { RandomPlayerAI } from './tools/random-player-ai';
export { StrongHeuristicsAI } from './tools/strategic-player-ai';

// dex API

export { Dex, toID } from './dex';
export { MoveTarget, MoveData } from './dex-moves';
export { Species, SpeciesData } from './dex-species';
export { Format } from './dex-formats';

// teams API

export { Teams, PokemonSet } from './teams';
export { TeamValidator } from './team-validator';

// misc data

export { Moves } from '../data/moves';
export { Pokedex } from '../data/pokedex';
export { Learnsets } from '../data/learnsets';

// misc texts

export { MovesText } from '../data/text/moves';
export { DefaultText } from '../data/text/default';
export { AbilitiesText } from '../data/text/abilities';
export { ItemsText } from '../data/text/items';

// misc libraries

export * from '../lib';
