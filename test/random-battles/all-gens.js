/**
 * Miscellaneous Random Battle-related tests not associated with a particular generation.
 */

'use strict';

const assert = require('../assert');
const {Utils} = require('../../lib');
const {testTeam, isValidSet, validateLearnset} = require('./tools');

const ALL_GENS = [1, 2, 3, 4, 5, 6, 7, 8];

describe('value rule support', () => {
	it('should generate teams of the proper length for the format (i.e. support Max Team Size)', () => {
		testTeam({format: 'gen8randombattle', rounds: 100}, team => assert.equal(team.length, 6));
		testTeam({format: 'gen8challengecup1v1', rounds: 100}, team => assert.equal(team.length, 6));
		testTeam({format: 'gen8hackmonscup', rounds: 100}, team => assert.equal(team.length, 6));

		testTeam({format: 'gen8multirandombattle', rounds: 100}, team => assert.equal(team.length, 3));
		testTeam({format: 'gen8cap1v1', rounds: 100}, team => assert.equal(team.length, 3));
	});
});

describe(`random teams should be valid (slow)`, () => {
	for (const gen of ALL_GENS) {
		for (const format of ['Random Battle', 'Challenge Cup', 'Hackmons Cup']) {
			it(`should create valid [Gen ${gen}] ${format} teams`, function () {
				this.timeout(0);
				const formatID = `gen${gen}${toID(format)}`;
				if (Teams.getGenerator(format).gen !== gen) return; // format doesn't exist for this gen

				testTeam({format: formatID}, team => {
					assert.equal(team.length, 6, `Team with less than 6 Pokémon: ${JSON.stringify(team)}`);

					const badSet = team.find(set => !isValidSet(gen, set));
					assert(!badSet, `Invalid set: ${JSON.stringify(badSet)}`);
				});
			});
		}
	}

	it(`should create valid gen8monotyperandombattle teams`, function () {
		this.timeout(0);
		testTeam({format: 'gen8monotyperandombattle'}, team => {
			if (team.length < 6) throw new Error(`Team with less than 6 Pokemon: ${JSON.stringify(team)}`);

			let types;
			for (const set of team) {
				if (!isValidSet(8, set)) throw new Error(`Invalid set: ${JSON.stringify(set)}`);
				const species = Dex.species.get(set.species || set.name);
				if (types) {
					assert(types.some(t => species.types.includes(t)), `Not a monotype team: ${JSON.stringify(team)}`);
					if (types.length > 1) {
						types = types.filter(type => species.types.includes(type));
					}
				} else {
					types = species.types;
				}
			}
		});
	});
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
