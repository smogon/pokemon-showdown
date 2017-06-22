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

let battleProtoCache = new Map();
exports.construct = function (format, rated, send, prng) {
	format = Dex.getFormat(format);
	const mod = format.mod || 'base';
	if (!battleProtoCache.has(mod)) {
		// Scripts overrides Battle overrides Dex
		const dex = Dex.mod(mod);
		const proto = Object.create(Battle.prototype);
		Object.assign(proto, dex);

		for (let i in dex.data.Scripts) {
			proto[i] = dex.data.Scripts[i];
		}

		battleProtoCache.set(mod, proto);
	}
	const battle = Object.create(battleProtoCache.get(mod));
	Battle.prototype.init.call(battle, format, rated, send, prng);
	return battle;
};

exports.Pokemon = Pokemon;
exports.Side = Side;
exports.Battle = Battle;
exports.PRNG = PRNG;
