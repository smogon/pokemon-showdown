'use strict';

const assert = require('./../assert');

describe('Pokedex', function () {
	it('should make sure every Pokemon name is correct', function () {
		const Pokedex = Dex.data.Pokedex;
		for (const pokemonid in Pokedex) {
			const entry = Pokedex[pokemonid];
			assert.equal(toID(entry.name), pokemonid, `Mismatched Pokemon key "${pokemonid}" of ${entry.name}`);
			if (entry.prevo) {
				assert.equal(entry.prevo, (Pokedex[toID(entry.prevo)] || {}).name, `Mismatched prevo "${entry.prevo}" of ${entry.name}`);
			}
			if (entry.evos) {
				for (const evo of entry.evos) {
					assert.equal(evo, (Pokedex[toID(evo)] || {}).name, `Mismatched evo "${evo}" of ${entry.name}`);
				}
			}
			if (entry.otherFormes) {
				for (const forme of entry.otherFormes) {
					assert.equal(forme, (Pokedex[toID(forme)] || {}).name, `Mismatched forme "${forme}" of ${entry.name}`);
				}
			}
			if (entry.battleOnly) {
				if (Array.isArray(entry.battleOnly)) {
					for (const battleForme of entry.battleOnly) {
						assert.equal(battleForme, (Pokedex[toID(battleForme)] || {}).name, `Mismatched battle-only forme "${battleForme}" of ${entry.name}`);
					}
				} else {
					assert.equal(entry.battleOnly, (Pokedex[toID(entry.battleOnly)] || {}).name, `Mismatched battle-only forme "${entry.battleOnly}" of ${entry.name}`);
				}
			}
			if (entry.changesFrom) {
				assert.equal(entry.changesFrom, (Pokedex[toID(entry.changesFrom)] || {}).name, `Mismatched changesFrom value "${entry.changesFrom}" of ${entry.name}`);
			}
		}
	});
});
