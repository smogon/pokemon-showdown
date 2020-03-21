'use strict';

const assert = require('./../../assert');
const TeamValidator = require('./../../../.sim-dist/team-validator').TeamValidator;

const TOTAL_TEAMS = 10;
const ALL_GENS = [1, 2, 3, 4, 5, 6, 7];

function isValidSet(gen, set) {
	const dex = Dex.mod(`gen${gen}`);
	const template = dex.getTemplate(set.species || set.name);
	if (!template.exists || template.gen > gen) return false;
	if (set.item) {
		const item = dex.getItem(set.item);
		if (!item.exists || item.gen > gen) {
			return false;
		}
	}
	if (set.ability && set.ability !== 'None') {
		const ability = dex.getAbility(set.ability);
		if (!ability.exists || ability.gen > gen) {
			return false;
		}
	} else if (gen >= 3) {
		return false;
	}
	return true;
}

function validLearnset(move, set, tier) {
	const validator = TeamValidator.get(`gen7${tier}`);
	const template = validator.dex.getTemplate(set.species || set.name);
	return !validator.checkLearnset(move, template);
}

describe(`Random Team generator (slow)`, function () {
	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			const generator = Dex.getTeamGenerator(`gen${gen}randombattle`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = generator.prng.seed;
				try {
					let team = generator.getTeam();
					let invalidSet = team.find(set => !isValidSet(gen, set));
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
		const generator = Dex.getTeamGenerator('gen8monotyperandombattle', [46, 41716, 23878, 52950]);

		let teamCount = 1000;
		while (teamCount--) {
			let seed = generator.prng.seed;
			try {
				let team = generator.getTeam();
				if (team.length < 6) throw new Error(`Team with less than 6 Pokemon: ${JSON.stringify(team)}`);

				let types;
				for (const set of team) {
					if (!isValidSet(8, set)) throw new Error(`Invalid set: ${JSON.stringify(set)}`);
					const template = Dex.getTemplate(set.species || set.name);
					if (types) {
						if (!types.filter(t => template.types.includes(t)).length) {
							throw new Error(`Team is not monotype: ${JSON.stringify(team)}`);
						}
					} else {
						types = template.types;
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
			const generator = Dex.getTeamGenerator(`gen${gen}challengecup`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = generator.prng.seed;
				try {
					let team = generator.getTeam();
					let invalidSet = team.find(set => !isValidSet(gen, set));
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
			const generator = Dex.getTeamGenerator(`gen${gen}hackmonscup`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = generator.prng.seed;
				try {
					let team = generator.getTeam();
					let invalidSet = team.find(set => !isValidSet(gen, set));
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
	for (const filename of ['bss-factory-sets', 'factory-sets']) {
		it(`should have valid sets in ${filename}.json (slow)`, function () {
			this.timeout(0);
			const setsJSON = require(`../../../data/mods/gen7/${filename}.json`);

			for (const type in setsJSON) {
				const typeTable = filename === 'bss-factory-sets' ? setsJSON : setsJSON[type];
				const vType = filename === 'bss-factory-sets' ? 'battlespotsingles' : type === 'Mono' ? 'monotype' : type.toLowerCase();
				for (const species in typeTable) {
					const speciesData = typeTable[species];
					for (const set of speciesData.sets) {
						const template = Dex.getTemplate(set.species);
						assert(template.exists, `invalid species "${set.species}" of ${species}`);
						assert(template.name === set.species, `miscapitalized species "${set.species}" of ${species}`);

						// currently failing due to a Piloswine labeled as a Mamoswine set
						// assert(species.startsWith(toID(template.baseSpecies)), `non-matching species "${set.species}" of ${species}`);

						assert(!template.battleOnly, `invalid battle-only forme "${set.species}" of ${species}`);

						for (const itemName of [].concat(set.item)) {
							if (!itemName && [].concat(...set.moves).includes("Acrobatics")) continue;
							const item = Dex.getItem(itemName);
							assert(item.exists, `invalid item "${itemName}" of ${species}`);
							assert(item.name === itemName, `miscapitalized item "${itemName}" of ${species}`);
						}

						for (const abilityName of [].concat(set.ability)) {
							const ability = Dex.getAbility(abilityName);
							assert(ability.exists, `invalid ability "${abilityName}" of ${species}`);
							assert(ability.name === abilityName, `miscapitalized ability "${abilityName}" of ${species}`);
						}

						for (const natureName of [].concat(set.nature)) {
							const nature = Dex.getNature(natureName);
							assert(nature.exists, `invalid nature "${natureName}" of ${species}`);
							assert(nature.name === natureName, `miscapitalized nature "${natureName}" of ${species}`);
						}

						for (const moveSpec of set.moves) {
							for (const moveName of [].concat(moveSpec)) {
								const move = Dex.getMove(moveName);
								assert(move.exists, `invalid move "${moveName}" of ${species}`);
								assert(move.name === moveName, `miscapitalized move "${moveName}" of ${species}`);
								assert(validLearnset(move, set, vType), `illegal move "${moveName}" of ${species}`);
							}
						}

						let totalEVs = 0;
						for (const ev in set.evs) {
							totalEVs += set.evs[ev];
							assert((set.evs[ev] / 4) === Math.floor(set.evs[ev] / 4), `EVs of ${ev} not divisible by 4 on ${species}`);
						}
						assert(totalEVs <= 510, `more than 510 EVs on set of ${species}`);
					}
				}
			}
		});
	}
});
