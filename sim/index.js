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
const TeamValidator = require('./team-validator');

module.exports = {
	Pokemon,
	Side,
	Battle,
	PRNG,
	Dex,
	TeamValidator,

	BattleStream,
};
