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
global.toId = Dex.getId;
const Battle = require('./battle');
const Side = require('./side');
const Pokemon = require('./pokemon');
const PRNG = require('./prng');

exports.construct = function (format, rated, send, prng) {
	return new Battle(format, rated, send, prng);
};

exports.Pokemon = Pokemon;
exports.Side = Side;
exports.Battle = Battle;
exports.PRNG = PRNG;
