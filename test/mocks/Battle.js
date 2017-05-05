'use strict';

const {Battle} = require('../../sim');

const battleProtoCache = new Map();
// HACK Copy pasted from sim
// The ultimate idea obviously being to remove this from being necessary.
function construct(format, rated, send, prng) {
	format = Dex.getFormat(format);
	const mod = format.mod || 'base';
	if (!battleProtoCache.has(mod)) {
		const tools = Dex.mod(mod);
		const proto = Object.create(Battle.prototype);
		Object.assign(proto, tools);
		tools.install(proto);
		battleProtoCache.set(mod, proto);
	}
	const battle = Object.create(battleProtoCache.get(mod));
	Battle.prototype.init.call(battle, format, rated, send, prng);
	return battle;
}

module.exports = {
	MockBattle: Battle,
	construct,
};
