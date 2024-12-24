/**
 * Miscellaneous Random Battle-related tests not associated with a particular generation.
 */

'use strict';

const assert = require('../assert');
const common = require('../common');
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
			if ([2, 3, 4, 5, 6, 7, 9].includes(gen)) {
				// Due to frontloading of moveset generation, formats with the new set format do not support
				// Max Move Counts less than 4
				if (count < 4) continue;
				const setsJSON = require(`../../dist/data/random-battles/gen${gen}/sets.json`);

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
				const dataJSON = require(`../../dist/data/random-battles/gen${gen}/data.json`);

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
		if (Dex.formats.getRuleTable(format).has('adjustleveldown') || Dex.formats.getRuleTable(format).has('adjustlevel')) continue; // already adjusts level

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

describe("New set format (slow)", () => {
	// formatInfo lists filenames and roles for each format
	const formatInfo = {
		"gen2randombattle": {
			filename: "gen2/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Bulky Attacker", "Bulky Setup", "Bulky Support", "Generalist", "Thief user"],
		},
		"gen3randombattle": {
			filename: "gen3/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Bulky Attacker", "Bulky Setup", "Staller", "Bulky Support", "Generalist", "Berry Sweeper"],
		},
		"gen4randombattle": {
			filename: "gen4/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Bulky Attacker", "Bulky Setup", "Staller", "Bulky Support", "Fast Support", "Spinner"],
		},
		"gen5randombattle": {
			filename: "gen5/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Bulky Attacker", "Bulky Setup", "Staller", "Bulky Support", "Fast Support", "Spinner"],
		},
		"gen6randombattle": {
			filename: "gen6/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Bulky Attacker", "Bulky Setup", "Staller", "Bulky Support", "Fast Support", "AV Pivot"],
		},
		"gen7randombattle": {
			filename: "gen7/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Z-Move user", "Bulky Attacker", "Bulky Setup", "Staller", "Bulky Support", "Fast Support", "AV Pivot"],
		},
		"gen9randombattle": {
			filename: "gen9/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Tera Blast user", "Bulky Attacker", "Bulky Setup", "Fast Bulky Setup", "Bulky Support", "Fast Support", "AV Pivot"],
		},
		"gen9randomdoublesbattle": {
			filename: "gen9/doubles-sets",
			roles: ["Doubles Fast Attacker", "Doubles Setup Sweeper", "Doubles Wallbreaker", "Tera Blast user", "Doubles Bulky Attacker", "Doubles Bulky Setup", "Offensive Protect", "Bulky Protect", "Doubles Support", "Choice Item user"],
		},
		"gen9babyrandombattle": {
			filename: "gen9baby/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Tera Blast user", "Bulky Attacker", "Bulky Setup", "Bulky Support", "Fast Support"],
		},
		"gen9randombattle@@@+cap": {
			filename: "gen9cap/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Tera Blast user", "Bulky Attacker", "Bulky Setup", "Fast Bulky Setup", "Bulky Support", "Fast Support", "AV Pivot"],
		},
	};
	for (const format of Object.keys(formatInfo)) {
		const filename = formatInfo[format].filename;
		const setsJSON = require(`../../dist/data/random-battles/${filename}.json`);
		const dex = common.mod(common.getFormat({formatid: format}).mod).dex; // verifies format exists
		const genNum = dex.gen;
		const rounds = 100;
		it(`${filename}.json should have valid set data`, () => {
			const validRoles = formatInfo[format].roles;
			for (const [id, sets] of Object.entries(setsJSON)) {
				const species = dex.species.get(id);
				assert(species.exists, `In ${format}, misspelled species ID: ${id}`);
				assert(Array.isArray(sets.sets));
				for (const set of sets.sets) {
					assert(validRoles.includes(set.role), `In ${format}, set for ${species.name} has invalid role: ${set.role}`);
					for (const move of set.movepool) {
						const dexMove = dex.moves.get(move);
						assert(dexMove.exists, `In ${format}, ${species.name} has invalid move: ${move}`);
						// Old gens have moves in id form, currently.
						if (genNum === 9) {
							assert.equal(move, dexMove.name, `In ${format}, ${species.name} has misformatted move: ${move}`);
						} else {
							assert(move === dexMove.id || move.startsWith('hiddenpower'), `In ${format}, ${species.name} has misformatted move: ${move}`);
						}
						assert(validateLearnset(dexMove, {species}, 'ubers', `gen${genNum}`), `In ${format}, ${species.name} can't learn ${move}`);
					}
					for (let i = 0; i < set.movepool.length - 1; i++) {
						assert(set.movepool[i + 1] > set.movepool[i], `In ${format}, ${species.name} movepool should be sorted alphabetically`);
					}
					if (genNum >= 3) {
						assert(set.abilities, `In ${format}, ${set.abilities} has no abilities`);
						for (const ability of set.abilities) {
							const dexAbility = dex.abilities.get(ability);
							assert(dexAbility.exists, `In ${format}, ${species.name} has invalid ability: ${ability}`);
							// Mega/Primal Pokemon have abilities from their base formes
							const allowedAbilities = new Set(Object.values((species.battleOnly && !species.requiredAbility) ? dex.species.get(species.battleOnly).abilities : species.abilities));
							if (species.unreleasedHidden) allowedAbilities.delete(species.abilities.H);
							assert(allowedAbilities.has(ability), `In ${format}, ${species.name} can't have ${ability}`);
						}
						for (let i = 0; i < set.abilities.length - 1; i++) {
							assert(set.abilities[i + 1] > set.abilities[i], `In ${format}, ${species.name} abilities should be sorted alphabetically`);
						}
					}
					if (genNum === 9) {
						assert(set.teraTypes, `In ${format}, ${species.name} has no Tera Types`);
						for (const type of set.teraTypes) {
							const dexType = dex.types.get(type);
							assert(dexType.exists, `In ${format}, ${species.name} has invalid Tera Type: ${type}`);
							assert.equal(type, dexType.name, `In ${format}, ${species.name} has misformatted Tera Type: ${type}`);
						}
						for (let i = 0; i < set.teraTypes.length - 1; i++) {
							assert(set.teraTypes[i + 1] > set.teraTypes[i], `In ${format}, ${species.name} teraTypes should be sorted alphabetically`);
						}
					}
					if (set.preferredTypes) {
						for (const type of set.preferredTypes) {
							const dexType = dex.types.get(type);
							assert(dexType.exists, `In ${format}, ${species.name} has invalid Preferred Type: ${type}`);
							assert.equal(type, dexType.name, `In ${format}, ${species.name} has misformatted Preferred Type: ${type}`);
						}
						for (let i = 0; i < set.preferredTypes.length - 1; i++) {
							assert(set.preferredTypes[i + 1] > set.preferredTypes[i], `In ${format}, ${species.name} preferredTypes should be sorted alphabetically`);
						}
					}
				}
			}
		});
		it('all Pokemon should have 4 moves, except for Ditto and Unown', function () {
			testTeam({format, rounds}, team => {
				for (const pokemon of team) assert(pokemon.name === 'Ditto' || pokemon.name === 'Unown' || pokemon.moves.length === 4, `In ${format}, ${pokemon.name} can generate with ${pokemon.moves.length} moves`);
			});
		});
		it('all moves on all sets should exist and be obtainable', function () {
			const generator = Teams.getGenerator(format);
			for (const pokemon of Object.keys(setsJSON)) {
				const species = dex.species.get(pokemon);
				assert(species.exists, `In ${format}, Pokemon ${species} does not exist`);
				const sets = setsJSON[pokemon]["sets"];
				const types = species.types;
				for (const set of sets) {
					assert(set.movepool.every(m => dex.moves.get(m).exists), `In ${format}, for Pokemon ${species}, one of ${set.movepool} does not exist.`);
					const role = set.role;
					const moves = new Set(set.movepool.map(m => (m.startsWith('hiddenpower') ? m : dex.moves.get(m).id)));
					const abilities = set.abilities || [];
					const specialTypes = genNum === 9 ? set.teraTypes : set.preferredTypes;
					// Go through all possible teamDetails combinations, if necessary
					for (let j = 0; j < rounds; j++) {
						// In Gens 2-3, if a set has multiple preferred types, we enforce moves of all the types.
						const specialType = specialTypes ? (genNum > 3 ? specialTypes[j % specialTypes.length] : specialTypes.join()) : '';
						// Generate a moveset for each combination of relevant teamDetails. Spikes is relevant for Gen 2.
						for (let i = 0; i < 16; i++) {
							const rapidSpin = i % 2;
							const stealthRock = Math.floor(i / 2) % 2;
							const stickyWeb = Math.floor(i / 4) % 2;
							const spikes = Math.floor(i / 8) % 2;
							const screens = Math.floor(i / 2) % 2;
							const teamDetails = {rapidSpin, stealthRock, stickyWeb, spikes, screens};
							// randomMoveset() deletes moves from the movepool, so recreate it every time
							const movePool = set.movepool.map(m => (m.startsWith('hiddenpower') ? m : dex.moves.get(m).id));
							let moveSet;
							if (genNum === 9) {
								moveSet = generator.randomMoveset(types, abilities, teamDetails, species, false, format.includes('doubles'), movePool, specialType, role);
							} else {
								moveSet = generator.randomMoveset(types, abilities, teamDetails, species, false, movePool, specialType, role);
							}
							for (const move of moveSet) moves.delete(move);
							if (!moves.size) break;
						}
						if (!moves.size) break;
					}
					assert.false(moves.size, `In ${format}, the following moves on ${species.name} are unused: ${[...moves].join(', ')}`);
				}
			}
		});
	}
});

describe('randomly generated teams should be valid (slow)', () => {
	for (const format of Dex.formats.all()) {
		if (!format.team) continue; // format doesn't use randomly generated teams
		if (format.mod === 'gen9ssb') continue; // Temporary

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
	for (const filename of ['gen9/factory-sets', 'gen8/factory-sets', 'gen8/bss-factory-sets', 'gen7/bss-factory-sets', 'gen7/factory-sets', 'gen6/factory-sets']) {
		it(`${filename}.json should contain valid sets`, function () {
			this.timeout(0);
			const setsJSON = require(`../../dist/data/random-battles/${filename}.json`);
			const mod = filename.split('/')[0] || 'gen' + Dex.gen;
			const genNum = isNaN(mod[3]) ? Dex.gen : parseInt(mod[3]);
			const dex = Dex.mod(mod);

			for (const type in setsJSON) {
				const typeTable = filename.includes('bss-factory-sets') ? setsJSON : setsJSON[type];
				let vType;
				if (filename.includes('bss-factory-sets')) {
					vType = `battle${genNum === 8 ? 'stadium' : 'spot'}singles`;
				} else if (type === 'Mono') {
					vType = 'monotype';
				} else if (type === 'Uber') {
					vType = 'ubers';
				} else {
					vType = type.toLowerCase();
				}
				for (const species in typeTable) {
					const speciesData = typeTable[species];
					for (const set of speciesData.sets) {
						const species = dex.species.get(set.species);
						assert(species.exists, `invalid species "${set.species}" of ${species}`);
						assert.equal(species.name, set.species, `miscapitalized species "${set.species}" of ${species}`);

						assert(species.id.startsWith(toID(species.baseSpecies)), `non-matching species "${set.species}" of ${species}`);

						for (const itemName of [].concat(set.item)) {
							if (!itemName) continue;
							const item = dex.items.get(itemName);
							assert(item.exists, `invalid item "${itemName}" of ${species}`);
							assert.equal(item.name, itemName, `miscapitalized item "${itemName}" of ${species}`);
						}

						for (const abilityName of [].concat(set.ability)) {
							const ability = dex.abilities.get(abilityName);
							assert(ability.exists, `invalid ability "${abilityName}" of ${species}`);
							assert.equal(ability.name, abilityName, `miscapitalized ability "${abilityName}" of ${species}`);
							const allowedAbilities = new Set(Object.values((species.battleOnly && !species.requiredAbility) ? dex.species.get(species.battleOnly).abilities : species.abilities));
							if (species.unreleasedHidden) allowedAbilities.delete(species.abilities.H);
							assert(allowedAbilities.has(abilityName), `${species.name} can't have ${abilityName}`);
						}

						for (const natureName of [].concat(set.nature)) {
							const nature = dex.natures.get(natureName);
							assert(nature.exists, `invalid nature "${natureName}" of ${species}`);
							assert.equal(nature.name, natureName, `miscapitalized nature "${natureName}" of ${species}`);
						}

						for (const moveSpec of set.moves) {
							for (const moveName of [].concat(moveSpec)) {
								const move = dex.moves.get(moveName);
								assert(move.exists, `invalid move "${moveName}" of ${species}`);
								assert.equal(move.name, moveName, `miscapitalized move "${moveName}" ≠ "${move.name}" of ${species}`);
								if (species.id === 'zacian' && [].concat(set.item).includes('Rusted Sword') && moveName === 'Behemoth Blade') continue;
								assert(validateLearnset(move, set, vType, mod), `illegal move "${moveName}" of ${species}`);
							}
						}


						// Check that no moves appear more than once in a set
						assert.equal(set.moves.flat(1).length, new Set(set.moves.flat(1)).size, `${species} has repeat moves`);

						assert(!!set.evs, `Set of ${species} has no EVs specified`);
						const keys = Object.keys(set.evs);
						let totalEVs = 0;
						for (const ev of keys) {
							assert(dex.stats.ids().includes(ev), `Invalid EV key (${ev}) on set of ${species}`);
							totalEVs += set.evs[ev];
							assert.equal(set.evs[ev] % 4, 0, `EVs of ${ev} not divisible by 4 on ${species}`);
						}
						const sortedKeys = Utils.sortBy([...keys], ev => dex.stats.ids().indexOf(ev));
						assert.deepEqual(keys, sortedKeys, `EVs out of order on set of ${species}, possibly because one of them is for the wrong stat`);
						assert(totalEVs <= 510, `more than 510 EVs on set of ${species}`);

						if (genNum === 9) {
							assert(set.teraType, `missing Tera Types on set of ${species}`);
							for (const type of set.teraType) {
								const dexType = dex.types.get(type);
								assert(dexType.exists, `${species} has invalid Tera Type: ${type}`);
								assert.equal(type, dexType.name, `${species.name} has misformatted Tera Type: ${type}`);
							}
						}
					}
					if (filename === 'gen9/factory-sets') {
						// Set weights should add up to 100
						let totalWeight = 0;
						for (const set of speciesData.sets) {
							totalWeight += set.weight;
						}
						assert.equal(totalWeight, 100, `Total set weight for ${species} is ${totalWeight < 100 ? 'less' : 'greater'} than 100%`);
					}
				}
			}
		});
	}
});

describe('[Gen 9] BSS Factory data should be valid (slow)', () => {
	it(`gen9/bss-factory-sets.json should contain valid sets`, function () {
		this.timeout(0);
		const setsJSON = require(`../../dist/data/random-battles/gen9/bss-factory-sets.json`);
		const mod = 'gen9';
		const genNum = 9;

		for (const speciesid in setsJSON) {
			const vType = 'bssregh';
			let totalWeight = 0;
			for (const set of setsJSON[speciesid].sets) {
				totalWeight += set.weight;
				const species = Dex.species.get(set.species);
				assert(species.exists, `invalid species "${set.species}" of ${speciesid}`);
				assert(!species.isNonstandard, `illegal species "${set.species}" of ${speciesid}`);
				assert.equal(species.name, set.species, `miscapitalized species "${set.species}" of ${speciesid}`);

				assert(species.id.startsWith(toID(species.baseSpecies)), `non-matching species "${set.species}" of ${speciesid}`);

				assert(!species.battleOnly, `invalid battle-only forme "${set.species}" of ${speciesid}`);

				for (const itemName of [].concat(set.item)) {
					if (!itemName && [].concat(...set.moves).includes("Acrobatics")) continue;
					const item = Dex.forGen(genNum).items.get(itemName);
					assert(item.exists, `invalid item "${itemName}" of ${speciesid}`);
					assert.equal(item.name, itemName, `miscapitalized item "${itemName}" of ${speciesid}`);
				}

				for (const abilityName of [].concat(set.ability)) {
					const ability = Dex.forGen(genNum).abilities.get(abilityName);
					assert(ability.exists, `invalid ability "${abilityName}" of ${speciesid}`);
					assert.equal(ability.name, abilityName, `miscapitalized ability "${abilityName}" of ${speciesid}`);
				}

				for (const natureName of [].concat(set.nature)) {
					const nature = Dex.forGen(genNum).natures.get(natureName);
					assert(nature.exists, `invalid nature "${natureName}" of ${speciesid}`);
					assert.equal(nature.name, natureName, `miscapitalized nature "${natureName}" of ${speciesid}`);
				}

				for (const moveSpec of set.moves) {
					for (const moveName of [].concat(moveSpec)) {
						const move = Dex.forGen(genNum).moves.get(moveName);
						assert(move.exists, `invalid move "${moveName}" of ${speciesid}`);
						assert.equal(move.name, moveName, `miscapitalized move "${moveName}" ≠ "${move.name}" of ${speciesid}`);
						assert(validateLearnset(move, set, vType, mod), `illegal move "${moveName}" of ${speciesid}`);
					}
				}

				assert(!!set.evs, `Set of ${speciesid} has no EVs specified`);
				const keys = Object.keys(set.evs);
				let totalEVs = 0;
				for (const ev of keys) {
					assert(Dex.stats.ids().includes(ev), `Invalid EV key (${ev}) on set of ${speciesid}`);
					totalEVs += set.evs[ev];
					assert.equal(set.evs[ev] % 4, 0, `EVs of ${ev} not divisible by 4 on ${speciesid}`);
				}
				const sortedKeys = Utils.sortBy([...keys], ev => Dex.stats.ids().indexOf(ev));
				assert.deepEqual(keys, sortedKeys, `EVs out of order on set of ${speciesid}, possibly because one of them is for the wrong stat`);
				assert(totalEVs <= 510, `more than 510 EVs on set of ${speciesid}`);
			}
			// Some species have 1/3 probability for each set
			if (totalWeight === 99) totalWeight += 1;
			assert.equal(totalWeight, 100, `Total set weight for ${speciesid} is ${totalWeight < 100 ? 'less' : 'greater'} than 100%`);
		}
	});
});
