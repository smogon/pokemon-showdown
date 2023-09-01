/**
 * Miscellaneous Random Battle-related tests not associated with a particular generation.
 */

'use strict';

const assert = require('../assert');
const {Utils} = require('../../dist/lib');
const {testTeam, assertSetValidity, validateLearnset} = require('./tools');
const {default: Dex} = require('../../dist/sim/dex');

describe('value rule support (slow)', () => {
	it('should generate teams of the proper length for the format (i.e. support Max Team Size)', () => {
		testTeam({format: 'gen9randombattle', rounds: 100}, team => assert.equal(team.length, 6));
		testTeam({format: 'gen9challengecup1v1', rounds: 100}, team => assert.equal(team.length, 6));
		testTeam({format: 'gen9hackmonscup', rounds: 100}, team => assert.equal(team.length, 6));

		testTeam({format: 'gen8multirandombattle', rounds: 100}, team => assert.equal(team.length, 3));
		testTeam({format: 'gen8cap1v1', rounds: 100}, team => assert.equal(team.length, 3));

		testTeam({format: 'gen7randombattle', rounds: 100}, team => assert.equal(team.length, 6));
	});

	for (let gen = 1; gen <= 9; gen++) {
		const formatID = `gen${gen}randombattle`;
		const dex = Dex.forFormat(formatID);
		for (const count of [1, 3, 24]) {
			// This is tough to test in Gen 1 because we don't know how many moves a Pokémon ought to have,
			// so we only test 'Max Move Count = 1' in Gen 1.
			if (gen === 1 && count !== 1) continue;
			const format = Dex.formats.get(`${formatID}@@@Max Move Count = ${count}`);
			// New set format
			if ([6, 7, 9].includes(gen)) {
				// Due to frontloading of moveset generation, formats with the new set format do not support
				// Max Move Counts less than 4
				if (count < 4) continue;
				const setsJSON = require(`../../dist/data/${gen === 9 ? '' : `mods/gen${gen}/`}random-sets.json`);

				it(`${format.name} should support Max Move Count = ${count}`, () => {
					testTeam({format, rounds: 50}, team => {
						for (const set of team) {
							let species = set.species;
							// Formes make this test code really complicated, so we skip them
							// (This is because info about formes isn't passed through)
							if (dex.species.get(species).otherFormes?.length || dex.species.get(species).forme) continue;
							if (set.gigantamax && !set.species.endsWith('max')) species += '-Gmax';

							// This is an array because the new set format can have multiple sets, and hence multiple possible
							// set lengths.
							const expectedMoves = [];
							for (const s of setsJSON[dex.species.get(species).id].sets) {
								let seenHP = false;
								let totalMoves = 0;
								for (const move of s.movepool) {
									if (move.startsWith('hiddenpower')) {
										if (seenHP) continue;
										seenHP = true;
									}
									totalMoves++;
								}
								expectedMoves.push(Math.min(totalMoves, count));
							}

							assert(expectedMoves.includes(set.moves.length), `${species} should have ${expectedMoves.toString()} moves (moves=${set.moves})`);
						}
					});
				});
			} else {
				const dataJSON = require(`../../dist/data/mods/gen${gen}/random-data.json`);

				it(`${format.name} should support Max Move Count = ${count}`, () => {
					testTeam({format, rounds: 50}, team => {
						for (const set of team) {
							let species = set.species;
							// Formes make this test code really complicated, so we skip them
							// (This is because info about formes isn't passed through)
							if (dex.species.get(species).otherFormes?.length || dex.species.get(species).forme) continue;
							if (set.gigantamax && !set.species.endsWith('max')) species += '-Gmax';

							// If the Pokémon has less than the max in its movepool, we should
							// just see all those moves.
							let totalMoves = 0;
							let seenHP = false;
							for (const move of dataJSON[dex.species.get(species).id].moves) {
								if (move.startsWith('hiddenpower')) {
									if (seenHP) continue;
									seenHP = true;
								}
								totalMoves++;
							}
							const expected = Math.min(totalMoves, count);
							assert.equal(set.moves.length, expected, `${species} should have ${expected} moves (moves=${set.moves})`);
						}
					});
				});
			}
		}
	}

	for (const format of Dex.formats.all()) {
		if (!format.team) continue;
		if (Dex.formats.getRuleTable(format).has('adjustleveldown')) continue; // already adjusts level

		for (const level of [1, 99999]) {
			it(`${format.name} should support Adjust Level = ${level}`, () => {
				testTeam({format: `${format.id}@@@Adjust Level = ${level}`, rounds: 50}, team => {
					for (const set of team) {
						assert.equal(set.level, level);
					}
				});
			});
		}
	}
});

describe("New set format", () => {
	const files = ['../../data/random-sets.json', '../../data/random-doubles-sets.json'];
	for (const filename of files) {
		it(`${filename} should have valid set data`, () => {
			const setsJSON = require(filename);
			let validRoles = [];
			if (filename === '../../data/random-sets.json') {
				validRoles = ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Tera Blast user",
					"Bulky Attacker", "Bulky Setup", "Fast Bulky Setup", "Bulky Support", "Fast Support", "AV Pivot"];
			} else {
				validRoles = ["Doubles Fast Attacker", "Doubles Setup Sweeper", "Doubles Wallbreaker", "Tera Blast user",
					"Doubles Bulky Attacker", "Doubles Bulky Setup", "Offensive Protect", "Bulky Protect", "Doubles Support", "Choice Item user"];
			}
			for (const [id, sets] of Object.entries(setsJSON)) {
				const species = Dex.species.get(id);
				assert(species.exists, `Misspelled species ID: ${id}`);
				assert(Array.isArray(sets.sets));
				for (const set of sets.sets) {
					assert(validRoles.includes(set.role), `Set for ${species.name} has invalid role: ${set.role}`);
					assert.equal(set.role === "Tera Blast user", set.movepool.includes("Tera Blast"),
						`Set for ${species.name} has inconsistent Tera Blast user status`);
					for (const move of set.movepool) {
						const dexMove = Dex.moves.get(move);
						assert(dexMove.exists, `${species.name} has invalid move: ${move}`);
						assert.equal(move, dexMove.name, `${species.name} has misformatted move: ${move}`);
						assert(validateLearnset(dexMove, {species}, 'anythinggoes', 'gen9'), `${species.name} can't learn ${move}`);
					}
					for (let i = 0; i < set.movepool.length - 1; i++) {
						assert(set.movepool[i + 1] > set.movepool[i], `${species} movepool should be sorted alphabetically`);
					}
					for (const type of set.teraTypes) {
						const dexType = Dex.types.get(type);
						assert(dexType.exists, `${species.name} has invalid Tera Type: ${type}`);
						assert.equal(type, dexType.name, `${species.name} has misformatted Tera Type: ${type}`);
					}
					for (let i = 0; i < set.teraTypes.length - 1; i++) {
						assert(set.teraTypes[i + 1] > set.teraTypes[i], `${species} teraTypes should be sorted alphabetically`);
					}
				}
			}
		});
	}
});

describe('randomly generated teams should be valid (slow)', () => {
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
	for (const filename of ['mods/gen8/bss-factory-sets', 'mods/gen7/bss-factory-sets', 'mods/gen7/factory-sets', 'mods/gen6/factory-sets']) {
		it(`${filename}.json should contain valid sets`, function () {
			this.timeout(0);
			const setsJSON = require(`../../dist/data/${filename}.json`);
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
