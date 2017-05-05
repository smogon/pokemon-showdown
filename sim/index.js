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
const PRNG = require('./prng');
const Battle = require('./battle');
const Side = require('./side');
const Pokemon = require('./pokemon');

let battleProtoCache = new Map();
exports.construct = function (format, rated, send) {
	format = Dex.getFormat(format);
	let mod = format.mod || 'base';
	if (!battleProtoCache.has(mod)) {
		// Scripts overrides Battle overrides Dex
		let dex = Dex.mod(mod);
		let proto = Object.create(Battle.prototype);
		Object.assign(proto, dex);
		dex.install(proto);
		battleProtoCache.set(mod, proto);
	}
	let battle = Object.create(battleProtoCache.get(mod));
	Battle.prototype.init.call(battle, format, rated, send);
	return battle;
};

exports.Pokemon = Pokemon;
exports.Side = Side;
exports.Battle = Battle;
