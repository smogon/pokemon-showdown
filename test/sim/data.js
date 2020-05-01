'use strict';

const assert = require('./../assert');

describe('Dex data', function () {
	it('should have valid Pokedex entries', function () {
		const Pokedex = Dex.data.Pokedex;
		for (const pokemonid in Pokedex) {
			const entry = Pokedex[pokemonid];
			assert.equal(toID(entry.name), pokemonid, `Mismatched Pokemon key "${pokemonid}" of ${entry.name}`);
			assert(!entry.name.startsWith("-") && !entry.name.endsWith("-"), `Pokemon name "${entry.name}" should not start or end with a hyphen`);
			assert.equal(entry.name, entry.name.trim(), `Pokemon name "${entry.name}" should not start or end with whitespace`);

			assert(entry.color, `Pokemon ${entry.name} must have a color.`);
			assert(entry.heightm, `Pokemon ${entry.name} must have a heightm.`);

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

			const battleOnly = ['Mega', 'Mega-X', 'Mega-Y', 'Primal'].includes(entry.forme) ? entry.baseSpecies : entry.battleOnly;
			if (entry.requiredAbility) {
				assert(entry.battleOnly, `Forme ${entry.name} with requiredAbility must have battleOnly`);
			}
			if (entry.requiredItem) {
				assert(battleOnly || entry.changesFrom, `Forme ${entry.name} with requiredAbility must have battleOnly or changesFrom`);
			}
			if (entry.requiredMove) {
				assert(battleOnly || entry.changesFrom, `Forme ${entry.name} with requiredAbility must have battleOnly or changesFrom`);
			}
		}
	});

	it('should have valid Items entries', function () {
		const Items = Dex.data.Items;
		for (const itemid in Items) {
			const entry = Items[itemid];
			assert.equal(toID(entry.name), itemid, `Mismatched Item key "${itemid}" of "${entry.name}"`);
			assert.equal(typeof entry.num, 'number', `Item ${entry.name} should have a number`);
		}
	});

	it('should have valid Movedex entries', function () {
		const Movedex = Dex.data.Movedex;
		for (const moveid in Movedex) {
			const entry = Movedex[moveid];
			assert.equal(toID(entry.name), moveid, `Mismatched Move key "${moveid}" of "${entry.name}"`);
			assert.equal(typeof entry.num, 'number', `Move ${entry.name} should have a number`);
			assert.false(entry.infiltrates, `Move ${entry.name} should not have an 'infiltrates' property (no real move has it)`);
		}
	});

	it('should have valid Abilities entries', function () {
		const Abilities = Dex.data.Abilities;
		for (const abilityid in Abilities) {
			const entry = Abilities[abilityid];
			assert.equal(toID(entry.name), abilityid, `Mismatched Ability key "${abilityid}" of "${entry.name}"`);
			assert.equal(typeof entry.num, 'number', `Ability ${entry.name} should have a number`);
			assert.equal(typeof entry.rating, 'number', `Ability ${entry.name} should have a rating`);
		}
	});

	it('should have valid Formats entries', function () {
		const Formats = Dex.data.Formats;
		for (const formatid in Formats) {
			const entry = Formats[formatid];
			assert.equal(toID(entry.name), formatid, `Mismatched Format/Ruleset key "${formatid}" of "${entry.name}"`);
		}
	});
});
