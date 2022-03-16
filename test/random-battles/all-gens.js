/**
 * Miscellaneous Random Battle-related tests not associated with a particular generation.
 */

'use strict';

const assert = require('../assert');
const {Utils} = require('../../lib');
const {testTeam, assertSetValidity, validateLearnset} = require('./tools');
const {default: Dex} = require('../../sim/dex');

describe('value rule support', () => {
	it('should generate teams of the proper length for the format (i.e. support Max Team Size)', () => {
		testTeam({format: 'gen8randombattle', rounds: 100}, team => assert.equal(team.length, 6));
		testTeam({format: 'gen8challengecup1v1', rounds: 100}, team => assert.equal(team.length, 6));
		testTeam({format: 'gen8hackmonscup', rounds: 100}, team => assert.equal(team.length, 6));

		testTeam({format: 'gen8multirandombattle', rounds: 100}, team => assert.equal(team.length, 3));
		testTeam({format: 'gen8cap1v1', rounds: 100}, team => assert.equal(team.length, 3));
	});
});

describe(`randomly generated teams should be valid (slow)`, () => {
	for (const format of Dex.formats.all()) {
		if (!format.team) continue; // format doesn't use randomly generated teams

		it(`should generate valid ${format} teams`, function () {
			this.timeout(0);

			const targetTeamSize = Dex.formats.getRuleTable(format).maxTeamSize;
			testTeam({format: format.id}, team => {
				assert.equal(team.length, targetTeamSize, `Team of incorrect size (should have ${targetTeamSize} Pokémon but actually has ${team.length} Pokémon): ${JSON.stringify(team)}`);

				for (const set of team) {
					assertSetValidity(format, set);
				}
			});
		});
	}
});

describe('Battle Factory and BSS Factory data should be valid (slow)', () => {
	for (const filename of ['bss-factory-sets', 'mods/gen7/bss-factory-sets', 'mods/gen7/factory-sets', 'mods/gen6/factory-sets']) {
		it(`${filename}.json should contain valid sets (slow)`, function () {
			this.timeout(0);
			const setsJSON = require(`../../data/${filename}.json`);
			const mod = filename.split('/')[1] || 'gen' + Dex.gen;
			const genNum = isNaN(mod[3]) ? Dex.gen : mod[3];

			for (const type in setsJSON) {
				const typeTable = filename.includes('bss-factory-sets') ? setsJSON : setsJSON[type];
				const vType = filename === 'bss-factory-sets' ? `battle${genNum === 8 ? 'stadium' : 'spot'}singles` :
					type === 'Mono' ? 'monotype' : type.toLowerCase();
				for (const species in typeTable) {
					const speciesData = typeTable[species];
					for (const set of speciesData.sets) {
						const species = Dex.species.get(set.species);
						assert(species.exists, `invalid species "${set.species}" of ${species}`);
						assert.equal(species.name, set.species, `miscapitalized species "${set.species}" of ${species}`);

						// currently failing due to a Piloswine labeled as a Mamoswine set
						assert(species.id.startsWith(toID(species.baseSpecies)), `non-matching species "${set.species}" of ${species}`);

						assert(!species.battleOnly, `invalid battle-only forme "${set.species}" of ${species}`);

						for (const itemName of [].concat(set.item)) {
							if (!itemName && [].concat(...set.moves).includes("Acrobatics")) continue;
							const item = Dex.items.get(itemName);
							assert(item.exists, `invalid item "${itemName}" of ${species}`);
							assert.equal(item.name, itemName, `miscapitalized item "${itemName}" of ${species}`);
						}

						for (const abilityName of [].concat(set.ability)) {
							const ability = Dex.abilities.get(abilityName);
							assert(ability.exists, `invalid ability "${abilityName}" of ${species}`);
							assert.equal(ability.name, abilityName, `miscapitalized ability "${abilityName}" of ${species}`);
						}

						for (const natureName of [].concat(set.nature)) {
							const nature = Dex.natures.get(natureName);
							assert(nature.exists, `invalid nature "${natureName}" of ${species}`);
							assert.equal(nature.name, natureName, `miscapitalized nature "${natureName}" of ${species}`);
						}

						for (const moveSpec of set.moves) {
							for (const moveName of [].concat(moveSpec)) {
								const move = Dex.moves.get(moveName);
								assert(move.exists, `invalid move "${moveName}" of ${species}`);
								assert.equal(move.name, moveName, `miscapitalized move "${moveName}" ≠ "${move.name}" of ${species}`);
								assert(validateLearnset(move, set, vType, mod), `illegal move "${moveName}" of ${species}`);
							}
						}

						assert(!!set.evs, `Set of ${species} has no EVs specified`);
						const keys = Object.keys(set.evs);
						let totalEVs = 0;
						for (const ev of keys) {
							assert(Dex.stats.ids().includes(ev), `Invalid EV key (${ev}) on set of ${species}`);
							totalEVs += set.evs[ev];
							assert.equal(set.evs[ev] % 4, 0, `EVs of ${ev} not divisible by 4 on ${species}`);
						}
						const sortedKeys = Utils.sortBy([...keys], ev => Dex.stats.ids().indexOf(ev));
						assert.deepEqual(keys, sortedKeys, `EVs out of order on set of ${species}, possibly because one of them is for the wrong stat`);
						assert(totalEVs <= 510, `more than 510 EVs on set of ${species}`);
					}
				}
			}
		});
	}
});
