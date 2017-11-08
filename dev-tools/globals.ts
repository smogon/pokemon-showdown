interface AnyObject {[k: string]: any}

let Config = require('../config/config');

let Monitor = require('../monitor');

let LoginServer = require('../loginserver');
let Ladders = require(Config.remoteladder ? '../ladders-remote' : '../ladders');
let Users = require('../users');
type Connection = any;
type User = any;

type RoomBattle = any;

let Verifier = require('../verifier');
let Dnsbl = require('../dnsbl');
let Sockets = require('../sockets');
let TeamValidator = require('../sim/team-validator');
let TeamValidatorAsync = require('../team-validator-async');

type GenderName = 'M' | 'F' | 'N' | '';
type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
type StatsTable = {hp: number, atk: number, def: number, spa: number, spd: number, spe: number};
type SparseStatsTable = {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
type PokemonSet = {
	name: string,
	species: string,
	item: string,
	ability: string,
	moves: string[],
	nature: string,
	evs?: SparseStatsTable,
	gender?: string,
	ivs?: SparseStatsTable,
	shiny?: boolean,
	level?: number,
	happiness?: number,
	pokeball?: string,
	hpType?: string,
};
/**
 * Describes a possible way to get a move onto a pokemon.
 *
 * First character is a generation number, 1-7.
 * Second character is a source ID, one of:
 *
 * - L = start or level-up, 3rd char+ is the level
 * - M = TM/HM
 * - T = tutor
 * - E = egg
 * - S = event, 3rd char+ is the index in .eventPokemon
 * - D = Dream World, only 5D is valid
 * - V = Virtual Console transfer, only 7V is valid
 * - C = NOT A REAL SOURCE, see note, only 3C/4C is valid
 *
 * C marks certain moves learned by a pokemon's prevo. It's used to
 * work around the chainbreeding checker's shortcuts for performance;
 * it lets the pokemon be a valid father for teaching the move, but
 * is otherwise ignored by the learnset checker (which will actually
 * check prevos for compatibility).
 */
type MoveSource = string;

/**
 * Describes a possible way to get a pokemon. Is not exhaustive!
 * sourcesBefore covers all sources that do not have exclusive
 * moves (like catching wild pokemon).
 *
 * First character is a generation number, 1-7.
 * Second character is a source ID, one of:
 *
 * - E = egg, 3rd char+ is the father in gen 2-5, empty in gen 6-7
 *   because egg moves aren't restricted to fathers anymore
 * - S = event, 3rd char+ is the index in .eventPokemon
 * - D = Dream World, only 5D is valid
 * - V = Virtual Console transfer, only 7V is valid
 *
 * Designed to match MoveSource where possible.
 */
type PokemonSource = string;

type EventInfo = {
	generation: number,
	level?: number,
	shiny?: true | 1,
	gender?: GenderName,
	nature?: string,
	ivs?: SparseStatsTable,
	perfectIVs?: number,
	isHidden?: boolean,
	abilities?: string[],
	moves?: string[],
	pokeball?: string,
	from: string,
};
