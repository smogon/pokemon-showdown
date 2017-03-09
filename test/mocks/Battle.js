'use strict';

const {Battle} = require('../../battle-engine');

class MockBattle extends Battle {
	init(format, rated, send, maybePrng) {
		super.init(format, rated, send, maybePrng);
		this.initialPrng = this.prng.clone();
	}

	// Intentionally left empty.
	receive() {}

	/**
	 * Resets the random number generator of this battle to the state it was in
	 * when it was created, including resetting its seed to its initial seed.
	 */
	resetRNG() {
		this.prng = this.initialPrng.clone();
	}
}

const battleProtoCache = new Map();
// HACK Copy pasted from battle-engine
// The ultimate idea obviously being to remove this from being necessary.
function construct(format, rated, send, prng) {
	format = Tools.getFormat(format);
	const mod = format.mod || 'base';
	if (!battleProtoCache.has(mod)) {
		const tools = Tools.mod(mod);
		const proto = Object.create(MockBattle.prototype);
		Object.assign(proto, tools);
		tools.install(proto);
		battleProtoCache.set(mod, proto);
	}
	const battle = Object.create(battleProtoCache.get(mod));
	MockBattle.prototype.init.call(battle, format, rated, send, prng);
	return battle;
}

module.exports = {
	MockBattle,
	construct,
};
