'use strict';

const assert = require('./../assert');

describe('Pokedex', function () {
	it('should make sure every Pokemon name is correct', function () {
		for (const pokemonid in Dex.data.Pokedex) {
			const name = Dex.data.Pokedex[pokemonid].name;
			const id = toID(name);
			assert(pokemonid === id, `Mismatched Pokemon key "${pokemonid}" of ${name}`);
		}
	});
});
