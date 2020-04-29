'use strict';

const assert = require('./../assert');

describe('Pokedex', function () {
	it('should make sure every Pokemon name is correct', function () {
		const Pokedex = Dex.data.Pokedex;
		for (const pokemonid in Pokedex) {
			const entry = Pokedex[pokemonid];
			assert.equal(toID(entry.name), pokemonid, `Mismatched Pokemon key "${pokemonid}" of ${entry.name}`);
			assert(!entry.name.startsWith("-") && !entry.name.endsWith("-"), `Pokemon name "${entry.name}" should not start or end with a hyphen`);
			assert.equal(entry.name, entry.name.trim(), `Pokemon name "${entry.name}" should not start or end with whitespace`);

			if (entry.forme) {
				// entry is a forme of a base species
				const baseEntry = Pokedex[toID(entry.baseSpecies)];
				assert(baseEntry && !baseEntry.forme, `Forme ${entry.name} should have a valid baseSpecies`);
				assert((baseEntry.otherFormes || []).includes(entry.name), `Base species ${entry.baseSpecies} should have ${entry.name} listed as an otherForme`);
				assert(!entry.otherFormes, `Forme ${entry.baseSpecies} should not have a forme list (the list goes in baseSpecies).`);
				assert(!entry.cosmeticFormes, `Forme ${entry.baseSpecies} should not have a cosmetic forme list (the list goes in baseSpecies).`);
				assert(!entry.baseForme, `Forme ${entry.baseSpecies} should not have a baseForme (its forme name goes in forme) (did you mean baseSpecies?).`);
			} else {
				// entry should be a base species
				assert(!entry.baseSpecies, `Base species ${entry.name} should not have its own baseSpecies.`);
				assert(!entry.changesFrom, `Base species ${entry.name} should not change from anything (its changesFrom forme should be base).`);
				assert(!entry.battleOnly, `Base species ${entry.name} should not be battle-only (its out-of-battle forme should be base).`);
			}

			if (entry.prevo) {
				const prevoEntry = Pokedex[toID(entry.prevo)] || {};
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
					assert.equal(formeEntry.baseSpecies, entry.name, `Forme ${forme} of ${entry.name} should have it as a baseSpecies`);
				}
			}
			if (entry.battleOnly) {
				const battleOnly = Array.isArray(entry.battleOnly) ? entry.battleOnly : [entry.battleOnly];
				for (const battleForme of battleOnly) {
					const battleEntry = Pokedex[toID(battleForme)] || {};
					assert.equal(battleForme, battleEntry.name, `Misspelled/nonexistent battle-only forme "${battleForme}" of ${entry.name}`);
					assert.equal(battleEntry.baseSpecies || battleEntry.name, entry.baseSpecies, `Battle-only forme ${entry.name} of ${battleEntry.name} should have the same baseSpecies`);
					assert(!battleEntry.battleOnly, `Out-of-battle forme ${battleEntry.name} of ${entry.name} should not be battle-only`);
				}
			}
			if (entry.changesFrom) {
				const formeEntry = Pokedex[toID(entry.changesFrom)] || {};
				assert.equal(entry.changesFrom, formeEntry.name, `Misspelled/nonexistent changesFrom value "${entry.changesFrom}" of ${entry.name}`);
				assert.equal(formeEntry.baseSpecies || formeEntry.name, entry.baseSpecies, `Original forme ${formeEntry.name} of ${entry.name} should have the same baseSpecies`);
				assert(!formeEntry.changesFrom, `Original forme ${formeEntry.name} of ${entry.name} should not also have chagesFrom`);
				assert(!formeEntry.battleOnly, `Original forme ${formeEntry.name} of ${entry.name} should not also have battleOnly`);
			}
			if (entry.cosmeticFormes) {
				for (const forme of entry.cosmeticFormes) {
					assert(forme.startsWith(`${entry.name}-`), `Misspelled/nonexistent beginning of cosmetic forme name "${forme}" of ${entry.name}`);
					assert(!forme.endsWith("-"), `Cosmetic forme name "${forme}" of ${entry.name} should not end with a hyphen`);
					assert.equal(forme, forme.trim(), `Cosmetic forme name "${forme}" of ${entry.name} should not start or end with whitespace`);
				}
			}
		}
	});
});
