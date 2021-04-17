'use strict';

const assert = require('./../../assert');
const TeamValidator = require('./../../../.sim-dist/team-validator').TeamValidator;
const Teams = require('./../../../.sim-dist/teams').Teams;
const Utils = require('./../../../.lib-dist/utils').Utils;

const TOTAL_TEAMS = 10;
const ALL_GENS = [1, 2, 3, 4, 5, 6, 7];

function isValidSet(gen, set) {
	const dex = Dex.mod(`gen${gen}`);
	const species = dex.species.get(set.species || set.name);
	if (!species.exists || species.gen > gen) return false;
	if (set.item) {
		const item = dex.items.get(set.item);
		if (!item.exists || item.gen > gen) {
			return false;
		}
	}
	if (set.ability && set.ability !== 'None') {
		const ability = dex.abilities.get(set.ability);
		if (!ability.exists || ability.gen > gen) {
			return false;
		}
	} else if (gen >= 3) {
		return false;
	}
	return true;
}

function validLearnset(move, set, tier, mod = 'gen7') {
	const validator = TeamValidator.get(`${mod}${tier}`);
	const species = validator.dex.species.get(set.species || set.name);
	return !validator.checkCanLearn(move, species);
}

describe(`Random Team generator (slow)`, function () {
	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			const generator = Teams.getGenerator(`gen${gen}randombattle`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				const seed = generator.prng.seed;
				try {
					const team = generator.getTeam();
					const invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)}`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}

	it(`should successfully create valid gen8monotyperandombattle teams`, function () {
		this.timeout(0);
		const generator = Teams.getGenerator('gen8monotyperandombattle', [46, 41716, 23878, 52950]);

		let teamCount = 1000;
		while (teamCount--) {
			const seed = generator.prng.seed;
			try {
				const team = generator.getTeam();
				if (team.length < 6) throw new Error(`Team with less than 6 Pokemon: ${JSON.stringify(team)}`);

				let types;
				for (const set of team) {
					if (!isValidSet(8, set)) throw new Error(`Invalid set: ${JSON.stringify(set)}`);
					const species = Dex.species.get(set.species || set.name);
					if (types) {
						if (!types.filter(t => species.types.includes(t)).length) {
							throw new Error(`Team is not monotype: ${JSON.stringify(team)}`);
						}
					} else {
						types = species.types;
					}
				}
			} catch (err) {
				err.message += ` (seed ${seed})`;
				throw err;
			}
		}
	});
});

describe(`Challenge Cup Team generator`, function () {
	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			const generator = Teams.getGenerator(`gen${gen}challengecup`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				const seed = generator.prng.seed;
				try {
					const team = generator.getTeam();
					const invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)}`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});

describe(`Hackmons Cup Team generator`, function () {
	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			const generator = Teams.getGenerator(`gen${gen}hackmonscup`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				const seed = generator.prng.seed;
				try {
					const team = generator.getTeam();
					const invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)}`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});

describe(`Factory sets`, function () {
	const filenames = ['bss-factory-sets', 'mods/gen7/bss-factory-sets', 'mods/gen7/factory-sets', 'mods/gen6/factory-sets'];
	for (const filename of filenames) {
		it(`should have valid sets in ${filename}.json (slow)`, function () {
			this.timeout(0);
			const setsJSON = require(`../../../.data-dist/${filename}.json`);
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
						assert(species.name === set.species, `miscapitalized species "${set.species}" of ${species}`);

						// currently failing due to a Piloswine labeled as a Mamoswine set
						// assert(species.startsWith(toID(species.baseSpecies)), `non-matching species "${set.species}" of ${species}`);

						assert(!species.battleOnly, `invalid battle-only forme "${set.species}" of ${species}`);

						for (const itemName of [].concat(set.item)) {
							if (!itemName && [].concat(...set.moves).includes("Acrobatics")) continue;
							const item = Dex.items.get(itemName);
							assert(item.exists, `invalid item "${itemName}" of ${species}`);
							assert(item.name === itemName, `miscapitalized item "${itemName}" of ${species}`);
						}

						for (const abilityName of [].concat(set.ability)) {
							const ability = Dex.abilities.get(abilityName);
							assert(ability.exists, `invalid ability "${abilityName}" of ${species}`);
							assert(ability.name === abilityName, `miscapitalized ability "${abilityName}" of ${species}`);
						}

						for (const natureName of [].concat(set.nature)) {
							const nature = Dex.natures.get(natureName);
							assert(nature.exists, `invalid nature "${natureName}" of ${species}`);
							assert(nature.name === natureName, `miscapitalized nature "${natureName}" of ${species}`);
						}

						for (const moveSpec of set.moves) {
							for (const moveName of [].concat(moveSpec)) {
								const move = Dex.moves.get(moveName);
								assert(move.exists, `invalid move "${moveName}" of ${species}`);
								assert(move.name === moveName, `miscapitalized move "${moveName}" ≠ "${move.name}" of ${species}`);
								assert(validLearnset(move, set, vType, mod), `illegal move "${moveName}" of ${species}`);
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
