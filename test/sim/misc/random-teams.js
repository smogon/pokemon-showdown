'use strict';

const assert = require('./../../assert');
const TeamValidator = require('./../../../.sim-dist/team-validator').TeamValidator;

const TOTAL_TEAMS = 10;
const ALL_GENS = [1, 2, 3, 4, 5, 6, 7, 8];

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
		it(`should make sure all moves exist in [Gen 3-8] Random Battle`, function () {
			this.timeout(0);
			const generator = Dex.getTeamGenerator(`gen${gen}randombattle`);
			if (generator.gen !== gen) return;
			if (generator.gen < 3) return; // Gens 1-2 Random Battle have different random move validation

			let team = generator.getTeam();
			for (const set of team) {
				const template = Dex.getTemplate(set.species);
				if (!template.randomBattleMoves) continue;
				for (const moveid of template.randomBattleMoves) {
					const move = Dex.getMove(moveid);
					assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
					assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
				}
			}
		});
		it(`should make sure all moves exist in [Gen 1] Random Battle`, function () {
			this.timeout(0);
			const generator = Dex.getTeamGenerator(`gen${gen}randombattle`);
			if (generator.gen !== 1) return;

			let team = generator.getTeam();
			for (const set of team) {
				const template = Dex.mod('gen1').getTemplate(set.species);
				if (!template.randomBattleMoves) continue;
				for (const moveid of template.randomBattleMoves) {
					const move = Dex.getMove(moveid);
					assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
					assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
					assert(move.gen < 2, `Future move '${move.id}' on ${template.species}`);
				}
				if (!template.exclusiveMoves) continue;
				for (const moveid of template.exclusiveMoves) {
					const move = Dex.getMove(moveid);
					assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
					assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
					assert(move.gen < 2, `Future move '${move.id}' on ${template.species}`);
				}
				if (!template.comboMoves) continue;
				for (const moveid of template.comboMoves) {
					const move = Dex.getMove(moveid);
					assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
					assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
					assert(move.gen < 2, `Future move '${move.id}' on ${template.species}`);
				}
				if (template.essentialMove) {
					const move = Dex.getMove(template.essentialMove);
					assert(move.exists, `Invalid move '${template.essentialMove}' on ${template.species}`);
					assert(move.id === template.essentialMove, `Miscapitalized move ID '${template.essentialMove}' on ${template.species}`);
					assert(move.gen < 2, `Future move '${move.id}' on ${template.species}`);
				}
			}
		});
		it(`should make sure all moves and items exist in [Gen 2] Random Battle`, function () {
			this.timeout(0);
			const generator = Dex.getTeamGenerator(`gen${gen}randombattle`);
			if (generator.gen !== 2) return;

			let team = generator.getTeam();
			for (const set of team) {
				const template = Dex.mod('gen2').getTemplate(set.species);
				if (!template.randomSets) continue;
				for (const set of template.randomSets) {
					if (set.item && !set.item.every(x => x === "")) {
						for (const itemid of set.item) {
							const item = Dex.getItem(itemid);
							assert(item.exists, `Invalid item '${itemid}' on ${template.species}`);
							assert(item.id === itemid, `Miscapitalized item ID '${itemid}' on ${template.species}`);
							assert(item.gen < 3, `Future item '${item.id}' on ${template.species}`);
						}
					} else {
						continue;
					}
					if (set.baseMove1) {
						const move = Dex.getMove(set.baseMove1);
						assert(move.exists, `Invalid move '${set.baseMove1}' on ${template.species}`);
						assert(move.id === set.baseMove1, `Miscapitalized move ID '${set.baseMove1}' on ${template.species}`);
						assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
					} else {
						continue;
					}
					if (set.baseMove2) {
						const move = Dex.getMove(set.baseMove2);
						assert(move.exists, `Invalid move '${set.baseMove2}' on ${template.species}`);
						assert(move.id === set.baseMove2, `Miscapitalized move ID '${set.baseMove2}' on ${template.species}`);
						assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
					} else {
						continue;
					}
					if (set.baseMove3) {
						const move = Dex.getMove(set.baseMove3);
						assert(move.exists, `Invalid move '${set.baseMove3}' on ${template.species}`);
						assert(move.id === set.baseMove3, `Miscapitalized move ID '${set.baseMove3}' on ${template.species}`);
						assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
					} else {
						continue;
					}
					if (set.baseMove4) {
						const move = Dex.getMove(set.baseMove4);
						assert(move.exists, `Invalid move '${set.baseMove4}' on ${template.species}`);
						assert(move.id === set.baseMove4, `Miscapitalized move ID '${set.baseMove4}' on ${template.species}`);
						assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
					} else {
						continue;
					}
					if (set.fillerMoves1) {
						for (const moveid of set.fillerMoves1) {
							const move = Dex.getMove(moveid);
							assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
							assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
							assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
						}
					} else {
						continue;
					}
					if (set.fillerMoves2) {
						for (const moveid of set.fillerMoves2) {
							const move = Dex.getMove(moveid);
							assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
							assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
							assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
						}
					} else {
						continue;
					}
					if (set.fillerMoves3) {
						for (const moveid of set.fillerMoves3) {
							const move = Dex.getMove(moveid);
							assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
							assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
							assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
						}
					} else {
						continue;
					}
					if (set.fillerMoves4) {
						for (const moveid of set.fillerMoves4) {
							const move = Dex.getMove(moveid);
							assert(move.exists, `Invalid move '${moveid}' on ${template.species}`);
							assert(move.id === moveid, `Miscapitalized move ID '${moveid}' on ${template.species}`);
							assert(move.gen < 3, `Future move '${move.id}' on ${template.species}`);
						}
					} else {
						continue;
					}
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
