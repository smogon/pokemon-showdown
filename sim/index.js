/**
 * Simulator process
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file is where the battle simulation itself happens.
 *
 * The most important part of the simulation happens in runEvent -
 * see that function's definition for details.
 *
 * @license MIT license
 */
'use strict';

const Dex = require('./dex');
const Battle = require('./battle');
const Side = require('./side');
const Pokemon = require('./pokemon');
const PRNG = require('./prng');
const {BattleStream} = require('./battle-stream');
const Validator = require('./team-validator').Validator; // eslint-disable-line no-unused-vars

module.exports = {
	Pokemon,
	Side,
	Battle,
	PRNG,
	Dex,

	BattleStream,

	// typescript hacks

	/**@type {Battle} */
	// @ts-ignore
	nullBattle: null,
	/**@type {Pokemon} */
	// @ts-ignore
	nullPokemon: null,
	/**@type {Side} */
	// @ts-ignore
	nullSide: null,
	/**@type {Validator} */
	// @ts-ignore
	nullValidator: null,
};
