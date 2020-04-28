'use strict';

const assert = require('./../assert');

describe('Pokedex', function () {
	it('should make sure every Pokemon name is correct', function () {
		const Pokedex = Dex.data.Pokedex;
		for (const pokemonid in Pokedex) {
			const entry = Pokedex[pokemonid];
			assert.equal(toID(entry.name), pokemonid, `Mismatched Pokemon key "${pokemonid}" of ${entry.name}`);
			if (entry.prevo) {
				const prevoEntry = Pokedex[toID(entry.prevo)] || {};
				assert.equal(entry.prevo, prevoEntry.name, `Misspelled/nonexistent prevo "${entry.prevo}" of ${entry.name}`);
				assert.notEqual(entry.num, prevoEntry.num, `Prevo ${entry.prevo} of ${entry.name} should have a different dex number`);
				assert(prevoEntry.evos.includes(entry.name), `Prevo ${entry.prevo} should have ${entry.name} listed as an evo`);
			}
			if (entry.evos) {
				for (const evo of entry.evos) {
					const evoEntry = Pokedex[toID(evo)] || {};
					assert.equal(evo, evoEntry.name, `Misspelled/nonexistent evo "${evo}" of ${entry.name}`);
					assert.notEqual(entry.num, evoEntry.num, `Evo ${evo} of ${entry.name} should have a different dex number`);
					assert.equal(evoEntry.prevo, entry.name, `Evo ${evo} should have ${entry.name} listed as a prevo`);
				}
			}
			if (entry.otherFormes) {
				for (const forme of entry.otherFormes) {
					const formeEntry = Pokedex[toID(forme)] || {};
					assert.equal(forme, formeEntry.name, `Misspelled/nonexistent forme "${forme}" of ${entry.name}`);
					assert.equal(entry.num, formeEntry.num, `Forme ${formeEntry.name} of ${entry.name} should have the same dex number`);
				}
			}
			if (entry.battleOnly) {
				const battleOnly = Array.isArray(entry.battleOnly) ? entry.battleOnly : [entry.battleOnly];
				for (const battleForme of battleOnly) {
					const battleEntry = Pokedex[toID(battleForme)] || {};
					assert.equal(battleForme, battleEntry.name, `Misspelled/nonexistent battle-only forme "${battleForme}" of ${entry.name}`);
					assert.equal(entry.num, battleEntry.num, `Battle-only forme ${battleEntry.name} of ${entry.name} should have the same dex number`);
				}
			}
			if (entry.changesFrom) {
				const formeEntry = Pokedex[toID(entry.changesFrom)] || {};
				assert.equal(entry.changesFrom, formeEntry.name, `Misspelled/nonexistent changesFrom value "${entry.changesFrom}" of ${entry.name}`);
				assert.equal(entry.num, formeEntry.num, `changesFrom value ${formeEntry.name} of ${entry.name} should have the same dex number`);
			}
			if (entry.cosmeticFormes) {
				for (const forme of entry.cosmeticFormes) {
					assert(forme.startsWith(entry.name + "-"), `Misspelled/nonexistent beginning of cosmetic forme name "${forme}" of ${entry.name}`);
				}
			}
		}
	});
});
