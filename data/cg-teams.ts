/**
 * Computer-Generated Teams
 *
 * Generates teams based on heuristics, most of which carry over across generations.
 * Teams generated will not always be competitively great, but they will have variety
 * and be fun to play (i.e., tries to avoid awful sets).
 *
 * The [Gen 9] Computer-Generated Teams format is personally maintained by Annika,
 * and is not part of any official Smogon or PS format selection. If you enjoy playing
 * with teams you didn't make yourself, you may want to check out Random Battles, Battle Factory,
 * and/or the sample teams for usage-based formats like OU.
 *
 * The core of the generator is the weightedRandomPick function, which chooses from an array
 * of options based on a weight associated with each option. This way, better/stronger/more useful options
 * are more likely to be chosen, but there's still an opportunity for weaker, more situational,
 * or higher-risk/higher-reward options to be chosen. However, for moves, the 'worst' moves are excluded
 * altogether, both to reduce the likelihood of a bad moveset and improve generator performance.
 *
 * Certain less-relevant aspects of the set are not randomized at all, such as:
 *   - IVs (all 31s, with 0 Attack IV if the Pokémon has no Physical moves in case of Confusion)
 *   - EVs (84 per stat, for +21 to each)
 *   - Nature (always Quirky, which has no effect)
 *   - Happiness (there are no Happiness-based moves in Gen IX)
 *
 * Currently, leveling is based on a Pokémon's position within Smogon's usage-based tiers,
 * but an automatic leveling system is planned for the future. This would involve storing win and loss
 * data by Pokémon species in a database, and increasing and decreasing the levels of Pokémon species
 * each day based on their win/loss ratio. For example, if 60% of matches with a Pokémon species are wins,
 * the species is probably overleveled!
 *
 * Other aspects of the team generator that may be worth implementing in the future include:
 *   - Explicit support for weather-oriented teams (boosting moves and typings that synergize with that weather)
 *   - Tracking type coverage to make it more likely that a moveset can hit every type
 */

import type { SQLDatabaseManager } from '../lib/sql';
import { Dex, PRNG, SQL } from '../sim';
import type { EventMethods } from '../sim/dex-conditions';
import {
	ABILITY_MOVE_BONUSES,
	ABILITY_MOVE_TYPE_BONUSES,
	HARDCODED_MOVE_WEIGHTS,
	MOVE_PAIRINGS,
	TARGET_HP_BASED_MOVES,
	WEIGHT_BASED_MOVES,
} from './cg-team-data';

interface TeamStats {
	hazardSetters: { [moveid: string]: number };
	typeWeaknesses: { [type: string]: number };
	hazardRemovers: number;
}
interface MovesStats {
	attackTypes: { [type: string]: number };
	setup: { atk: number, def: number, spa: number, spd: number, spe: number };
	noSleepTalk: number;
	hazards: number;
	stallingMoves: number;
	nonStatusMoves: number;
	healing: number;
}

// We put a limit on the number of Pokémon on a team that can be weak to a given type.
const MAX_WEAK_TO_SAME_TYPE = 3;
/** An estimate of the highest raw speed in the metagame */
const TOP_SPEED = 300;

const levelOverride: { [speciesID: string]: number } = {};
export let levelUpdateInterval: NodeJS.Timeout | null = null;

// can't import the function cg-teams-leveling.ts uses to this context for some reason
const useBaseSpecies = [
	'Pikachu',
	'Gastrodon',
	'Magearna',
	'Dudunsparce',
	'Maushold',
	'Keldeo',
	'Zarude',
	'Polteageist',
	'Sinistcha',
	'Sawsbuck',
	'Vivillon',
	'Florges',
	'Minior',
	'Toxtricity',
	'Tatsugiri',
	'Alcremie',
];

async function updateLevels(database: SQL.DatabaseManager) {
	const updateSpecies = await database.prepare(
		'UPDATE gen9computergeneratedteams SET wins = 0, losses = 0, level = ? WHERE species_id = ?'
	);
	const updateHistory = await database.prepare(
		`INSERT INTO gen9_historical_levels (level, species_id, timestamp) VALUES (?, ?, ${Date.now()})`
	);
	const data: { species_id: ID, wins: number, losses: number, level: number }[] = await database.all(
		'SELECT species_id, wins, losses, level FROM gen9computergeneratedteams'
	);
	for (let { species_id, wins, losses, level } of data) {
		const total = wins + losses;

		if (total > 10) {
			if (wins / total >= 0.55) level--;
			if (wins / total <= 0.45) level++;
			level = Math.max(1, Math.min(100, level));
			await updateSpecies?.run([level, species_id]);
			await updateHistory?.run([level, species_id]);
		}

		levelOverride[species_id] = level;
	}
}

export let cgtDatabase: SQLDatabaseManager;
if (global.Config && Config.usesqlite && Config.usesqliteleveling) {
	cgtDatabase = SQL(module, { file: './databases/battlestats.db' });

	// update every 2 hours
	void updateLevels(cgtDatabase);
	levelUpdateInterval = setInterval(() => void updateLevels(cgtDatabase), 1000 * 60 * 60 * 2);
}

export default class TeamGenerator {
	dex: ModdedDex;
	format: Format;
	teamSize: number;
	forceLevel?: number;
	prng: PRNG;
	itemPool: Item[];
	specialItems: { [pokemon: string]: string };

	constructor(format: Format | string, seed: PRNG | PRNGSeed | null) {
		this.dex = Dex.forFormat(format);
		this.format = Dex.formats.get(format);
		this.teamSize = this.format.ruleTable?.maxTeamSize || 6;
		this.prng = PRNG.get(seed);
		this.itemPool = this.dex.items.all().filter(i => i.exists && i.isNonstandard !== 'Past' && !i.isPokeball);
		this.specialItems = {};
		for (const i of this.itemPool) {
			if (i.itemUser && !i.isNonstandard) {
				for (const user of i.itemUser) {
					if (Dex.species.get(user).requiredItems?.[0] !== i.name) this.specialItems[user] = i.id;
				}
			}
		}

		const rules = Dex.formats.getRuleTable(this.format);
		if (rules.adjustLevel) this.forceLevel = rules.adjustLevel;
	}

	getTeam(): PokemonSet[] {
		let speciesPool = this.dex.species.all().filter(s => {
			if (!s.exists) return false;
			if (s.isNonstandard || s.isNonstandard === 'Unobtainable') return false;
			if (s.nfe) return false;
			if (s.battleOnly && (!s.requiredItems?.length || s.name.endsWith('-Tera'))) return false;

			return true;
		});
		const teamStats: TeamStats = {
			hazardSetters: {},
			typeWeaknesses: {},
			hazardRemovers: 0,
		};

		const team: PokemonSet[] = [];
		while (team.length < this.teamSize && speciesPool.length) {
			const species = this.prng.sample(speciesPool);

			const haveRoomToReject = speciesPool.length >= (this.teamSize - team.length);
			const isGoodFit = this.speciesIsGoodFit(species, teamStats);
			if (haveRoomToReject && !isGoodFit) continue;

			speciesPool = speciesPool.filter(s => s.baseSpecies !== species.baseSpecies);
			team.push(this.makeSet(species, teamStats));
		}

		return team;
	}

	protected makeSet(species: Species, teamStats: TeamStats): PokemonSet {
		const abilityPool: string[] = Object.values(species.abilities);
		const abilityWeights = abilityPool.map(a => this.getAbilityWeight(this.dex.abilities.get(a)));
		const ability = this.weightedRandomPick(abilityPool, abilityWeights);
		const level = this.forceLevel || TeamGenerator.getLevel(species);

		const moves: Move[] = [];
		let movesStats: MovesStats = {
			setup: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
			attackTypes: {},
			noSleepTalk: 0,
			hazards: 0,
			stallingMoves: 0,
			healing: 0,
			nonStatusMoves: 0,
		};

		let movePool: IDEntry[] = [...this.dex.species.getMovePool(species.id)];
		if (!movePool.length) throw new Error(`No moves for ${species.id}`);

		// Consider either the top 15 moves or top 30% of moves, whichever is greater.
		const numberOfMovesToConsider = Math.min(movePool.length, Math.max(15, Math.trunc(movePool.length * 0.3)));
		let movePoolIsTrimmed = false;
		// Many moves' weights, such as Swords Dance, are dependent on having other moves in the moveset already
		// and end up very low when calculated with no moves chosen. This makes it difficult to add these moves without
		// weighing every move 4 times, and trimming once after the initial weighing makes them impossible for most Pokemon.
		// To get around this, after weighing against an empty moveset, trimming, and adding three moves, we weigh ALL
		// moves again against the populated moveset, then put the chosen 3 moves back into the pool with their
		// original empty-set weights, trim the pool again, and start over. This process results in about 15% fewer calls
		// to getMoveWeight than considering every move every time does.
		let isRound2 = false;
		// this is just a second reference the array because movePool gets set to point to a new array before the old one
		// gets mutated
		const movePoolCopy = movePool;
		let interimMovePool: { move: IDEntry, weight: number }[] = [];
		while (moves.length < 4 && movePool.length) {
			let weights;
			if (!movePoolIsTrimmed) {
				if (!isRound2) {
					for (const moveID of movePool) {
						const move = this.dex.moves.get(moveID);
						const weight = this.getMoveWeight(move, teamStats, species, moves, movesStats, ability, level);
						interimMovePool.push({ move: moveID, weight });
					}

					interimMovePool.sort((a, b) => b.weight - a.weight);
				} else {
					const originalWeights: typeof interimMovePool = [];
					for (const move of moves) {
						originalWeights.push(interimMovePool.find(m => m.move === move.id)!);
					}
					interimMovePool = originalWeights;

					for (const moveID of movePoolCopy) {
						const move = this.dex.moves.get(moveID);
						if (moves.includes(move)) continue;
						const weight = this.getMoveWeight(move, teamStats, species, moves, movesStats, ability, level);
						interimMovePool.push({ move: moveID, weight });
					}

					interimMovePool.sort((a, b) => b.weight - a.weight);
					moves.splice(0);
					movesStats = {
						setup: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
						attackTypes: {},
						noSleepTalk: 0,
						hazards: 0,
						stallingMoves: 0,
						healing: 0,
						nonStatusMoves: 0,
					};
				}
				movePool = [];
				weights = [];

				for (let i = 0; i < numberOfMovesToConsider; i++) {
					movePool.push(interimMovePool[i].move);
					weights.push(interimMovePool[i].weight);
				}
				movePoolIsTrimmed = true;
			} else {
				weights = movePool.map(
					m => this.getMoveWeight(this.dex.moves.get(m), teamStats, species, moves, movesStats, ability, level)
				);
			}

			const moveID = this.weightedRandomPick(movePool, weights, { remove: true });

			const move = this.dex.moves.get(moveID);
			moves.push(move);
			if (TeamGenerator.moveIsHazard(moves[moves.length - 1])) {
				teamStats.hazardSetters[moveID] = (teamStats.hazardSetters[moveID] || 0) + 1;
				movesStats.hazards++;
			}
			if (['defog', 'courtchange', 'tidyup', 'rapidspin', 'mortalspin'].includes(moveID)) teamStats.hazardRemovers++;
			const boosts = move.boosts || move.self?.boosts || move.selfBoost?.boosts ||
				ability !== 'Sheer Force' && move.secondary?.self?.boosts;
			if (move.category === 'Status') {
				if (boosts) {
					for (const stat in boosts) {
						const chance = Math.min(100, move.secondary?.chance || 100 * (ability === 'Serene Grace' ? 2 : 1));
						const boost = (boosts[stat as StatIDExceptHP] || 0) * chance / 100;
						if (boost) {
							if (movesStats.setup[stat as StatIDExceptHP] < 0 && boost > 0) {
								movesStats.setup[stat as StatIDExceptHP] = boost;
							} else {
								movesStats.setup[stat as StatIDExceptHP] += boost;
							}
							if (boost > 1) movesStats.noSleepTalk++;
						}
					}
				} else {
					movesStats.noSleepTalk++;
				}
				if (move.heal) movesStats.healing++;
				if (move.stallingMove) movesStats.stallingMoves++;
			} else {
				movesStats.nonStatusMoves++;
				const bp = +move.basePower;
				const moveType = TeamGenerator.moveType(move, species);
				if ((movesStats.attackTypes[moveType] || 0) < bp) movesStats.attackTypes[moveType] = bp;
			}

			if (!isRound2 && moves.length === 3) {
				isRound2 = true;
				movePoolIsTrimmed = false;
				continue;
			}

			// add paired moves, like RestTalk
			const pairedMove = MOVE_PAIRINGS[moveID];
			const alreadyHavePairedMove = moves.some(m => m.id === pairedMove);
			if (
				moves.length < 4 &&
				pairedMove &&
				!(pairedMove === 'sleeptalk' && movesStats.noSleepTalk) &&
				!alreadyHavePairedMove &&
				// We don't check movePool because sometimes paired moves are bad.
				this.dex.species.getLearnsetData(species.id).learnset?.[pairedMove]
			) {
				moves.push(this.dex.moves.get(pairedMove));
				const pairedMoveIndex = movePool.indexOf(pairedMove);
				if (pairedMoveIndex > -1) movePool.splice(pairedMoveIndex, 1);
			}
		}

		let item = '';
		const nonStatusMoves = moves.filter(m => this.dex.moves.get(m).category !== 'Status');
		if (species.requiredItem) {
			item = species.requiredItem;
		} else if (species.requiredItems) {
			item = this.prng.sample(species.requiredItems.filter(i => !this.dex.items.get(i).isNonstandard));
		} else if (this.specialItems[species.name] && nonStatusMoves.length) {
			// If the species has a special item, we should use it.
			item = this.specialItems[species.name];
		} else if (moves.every(m => m.id !== 'acrobatics')) { // Don't assign an item if the set includes Acrobatics...
			const weights = [];
			const items = [];
			for (const i of this.itemPool) {
				const weight = this.getItemWeight(i, teamStats, species, moves, ability, level);
				if (weight !== 0) {
					weights.push(weight);
					items.push(i.name);
				}
			}
			if (!item) item = this.weightedRandomPick(items, weights);
		} else if (['Quark Drive', 'Protosynthesis'].includes(ability)) {
			// ...unless the Pokemon can use Booster Energy
			item = 'Booster Energy';
		}

		const ivs: PokemonSet['ivs'] = {
			hp: 31,
			atk: moves.some(move => this.dex.moves.get(move).category === 'Physical') ? 31 : 0,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31,
		};

		// For Tera Type, we just pick a random type if it's got Tera Blast, Revelation Dance, or no attacking moves
		// In the latter case, we avoid picking a type the Pokemon already is, and in the other two we avoid picking a
		// type that matches the Pokemon's other moves
		// Otherwise, we pick the type of one of its attacking moves
		// Pokemon with 3 or more attack types and Pokemon with both Tera Blast and Contrary can also get Stellar type
		// but Pokemon with Adaptability never get Stellar because Tera Stellar makes Adaptability have no effect
		// Ogerpon's formes are forced to the Tera type that matches their forme
		// Terapagos is forced to Stellar type
		// Pokemon with Black Sludge don't generally want to tera to a type other than Poison
		const hasTeraBlast = moves.some(m => m.id === 'terablast');
		const hasRevelationDance = moves.some(m => m.id === 'revelationdance');
		let attackingTypes = nonStatusMoves.map(m => TeamGenerator.moveType(this.dex.moves.get(m), species));
		let teraType;
		if (species.forceTeraType) {
			teraType = species.forceTeraType;
		} else if (item === 'blacksludge' && this.prng.randomChance(2, 3)) {
			teraType = 'Poison';
		} else if (hasTeraBlast && ability === 'Contrary' && this.prng.randomChance(2, 3)) {
			teraType = 'Stellar';
		} else {
			const noStellar = ability === 'Adaptability' || new Set(attackingTypes).size < 3;
			const noAttacks = !nonStatusMoves.length;
			if (hasTeraBlast || hasRevelationDance || noAttacks) {
				attackingTypes = [...this.dex.types.names().filter(t => !(noAttacks ? species.types : attackingTypes).includes(t))];
				if (noStellar) attackingTypes.splice(attackingTypes.indexOf('Stellar'));
			} else {
				if (!noStellar) attackingTypes.push('Stellar');
			}
			teraType = this.prng.sample(attackingTypes);
		}

		return {
			name: species.name,
			species: species.name,
			item,
			ability,
			moves: moves.map(m => m.name),
			nature: 'Quirky',
			gender: species.gender,
			evs: { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
			ivs,
			level,
			teraType,
			shiny: this.prng.randomChance(1, 1024),
			happiness: 255,
		};
	}

	/**
	 * @returns true if the Pokémon is a good fit for the team so far, and no otherwise
	 */
	protected speciesIsGoodFit(species: Species, stats: TeamStats): boolean {
		// type check
		for (const typeName of this.dex.types.names()) {
			const effectiveness = this.dex.getEffectiveness(typeName, species.types);
			if (effectiveness === 1) { // WEAKNESS!
				if (stats.typeWeaknesses[typeName] === undefined) {
					stats.typeWeaknesses[typeName] = 0;
				}
				if (stats.typeWeaknesses[typeName] >= MAX_WEAK_TO_SAME_TYPE) {
					// too many weaknesses to this type
					return false;
				}
			}
		}
		// species passes; increment counters
		for (const typeName of this.dex.types.names()) {
			const effectiveness = this.dex.getEffectiveness(typeName, species.types);
			if (effectiveness === 1) {
				stats.typeWeaknesses[typeName]++;
			}
		}
		return true;
	}

	/**
	 * @returns A weighting for the Pokémon's ability.
	 */
	protected getAbilityWeight(ability: Ability): number {
		return ability.rating + 1; // Some ability ratings are -1
	}

	protected static moveIsHazard(move: Move): boolean {
		return !!(move.sideCondition && move.target === 'foeSide') || ['stoneaxe', 'ceaselessedge'].includes(move.id);
	}

	/**
	 * @returns A weight for a given move on a given Pokémon.
	 */
	protected getMoveWeight(
		move: Move,
		teamStats: TeamStats,
		species: Species,
		movesSoFar: Move[],
		movesStats: MovesStats,
		ability: string,
		level: number,
	): number {
		if (!move.exists) return 0;
		// this is NOT doubles, so there will be no adjacent ally
		if (move.target === 'adjacentAlly') return 0;

		// There's an argument to be made for using Terapagos-Stellar's stats instead
		// but the important thing is to not use Terapagos-Base's stats since it never battles in that forme
		if (ability === 'Tera Shift') species = this.dex.species.get('Terapagos-Terastal');

		// Attack and Special Attack are scaled by level^2 because in addition to stats themselves being scaled by level,
		// damage dealt by attacks is also scaled by the user's level
		const adjustedStats: StatsTable = {
			hp: species.baseStats.hp * level / 100 + level,
			atk: species.baseStats.atk * level * level / 10000,
			def: species.baseStats.def * level / 100,
			spa: species.baseStats.spa * level * level / 10000,
			spd: species.baseStats.spd * level / 100,
			spe: species.baseStats.spe * level / 100,
		};

		if (move.category === 'Status') {
			// The initial value of this weight determines how valuable status moves are vs. attacking moves.
			// You can raise it to make random status moves more valuable or lower it and increase multipliers
			// to make only CERTAIN status moves valuable.
			let weight = 2400;

			// inflicts status
			if (move.status) weight *= TeamGenerator.statusWeight(move.status) * 2;

			// hazard setters: very important, but we don't need 2 pokemon to set the same hazard on a team
			if (TeamGenerator.moveIsHazard(move) && (teamStats.hazardSetters[move.id] || 0) < 1) {
				weight *= move.id === 'spikes' ? 12 : 16;

				// if we are ALREADY setting hazards, setting MORE is really good
				if (movesStats.hazards) weight *= 2;
			}

			// hazard removers: even more important than hazard setters, since they remove everything at once
			// we still don't need too many on one team, though
			if (['defog', 'courtchange', 'tidyup'].includes(move.id) && !teamStats.hazardRemovers) {
				weight *= 32;

				// these moves can also lessen the effectiveness of the user's team's own hazards
				weight *= 0.8 ** Object.values(teamStats.hazardSetters).reduce((total, num) => total + num, 0);
			}

			// boosts
			weight *= this.boostWeight(move, movesSoFar, species, ability, level);
			weight *= this.opponentDebuffWeight(move);

			// nonstandard boosting moves
			if (move.id === 'focusenergy' && ability !== 'Super Luck') {
				const highCritMoves = movesSoFar.filter(m => m.critRatio && m.critRatio > 1);
				weight *= 1 + highCritMoves.length * (ability === 'Sniper' ? 2 : 1);
			} else if (move.id === 'tailwind' && ability === 'Wind Rider' && movesSoFar.some(m => m.category === 'Physical')) {
				weight *= 2.5; // grants +1 attack, but isn't spammable
			}

			// protection moves - useful for bulky/stally pokemon
			if (!movesStats.stallingMoves) {
				if (adjustedStats.def >= 80 || adjustedStats.spd >= 80 || adjustedStats.hp >= 80) {
					switch (move.volatileStatus) {
					case 'endure':
						weight *= 2;
						break;
					case 'protect':
						weight *= 3;
						break;
					case 'kingsshield': case 'silktrap':
						weight *= 4;
						break;
					case 'banefulbunker': case 'burningbulwark': case 'spikyshield':
						weight *= 5;
						break;
					default:
						break;
					}
				}
			}

			// Hardcoded boosts
			if (move.id in HARDCODED_MOVE_WEIGHTS) weight *= HARDCODED_MOVE_WEIGHTS[move.id];

			// Rest and Sleep Talk are pretty bad on Pokemon that can't fall asleep
			const sleepImmunities = [
				'Comatose',
				'Purifying Salt',
				'Shields Down',
				'Insomnia',
				'Vital Spirit',
				'Sweet Veil',
				'Misty Surge',
				'Electric Surge',
				'Hadron Engine',
			];
			if (['sleeptalk', 'rest'].includes(move.id) && sleepImmunities.includes(ability)) return 0;

			// Sleep Talk is bad with moves that can't be used repeatedly, a.k.a. most status moves
			// the exceptions allowed here are moves which boost a stat by exactly 1 and moves that wake the user up
			if (move.id === 'sleeptalk') {
				if (movesStats.noSleepTalk) weight *= 0.1;
			} else if (movesSoFar.some(m => m.id === 'sleeptalk')) {
				let sleepTalkSpammable = ['takeheart', 'junglehealing', 'healbell'].includes(move.id);
				if (move.boosts) {
					for (const stat in move.boosts) {
						if (move.boosts[stat as StatIDExceptHP] === 1) {
							sleepTalkSpammable = true;
							break;
						}
					}
				}
				if (!sleepTalkSpammable) weight *= 0.1;
			}

			// Pokémon with high Attack and Special Attack stats shouldn't have too many status moves,
			// but on bulkier Pokémon it's more likely to be worth it.
			const goodAttacker = adjustedStats.atk > 65 || adjustedStats.spa > 65;
			if (goodAttacker && movesStats.nonStatusMoves < 2) {
				weight *= 0.3;
			}

			if (movesSoFar.length === 3 && movesStats.nonStatusMoves === 0) {
				// uh oh
				weight *= 0.6;
				for (const stat in movesStats.setup) {
					if (movesStats.setup[stat as StatIDExceptHP] > 0) {
						// having no attacks is bad; having setup but no attacks is REALLY bad
						weight *= 0.6;
					}
				}
			}

			// don't need 2 healing moves
			if (move.heal && movesStats.healing) weight *= 0.5;

			return weight;
		}

		let basePower = move.basePower;
		// For Grass Knot and friends, let's just assume they average out to around 60 base power.
		// Same with Crush Grip and Hard Press
		if (WEIGHT_BASED_MOVES.includes(move.id) || TARGET_HP_BASED_MOVES.includes(move.id)) basePower = 60;
		/** A value from 0 to 1, where 0 is the fastest and 1 is the slowest */
		const slownessRating = Math.max(0, TOP_SPEED - adjustedStats.spe) / TOP_SPEED;
		// not how this calc works but it should be close enough
		if (move.id === 'gyroball') basePower = 150 * slownessRating * slownessRating;
		if (move.id === 'electroball') basePower = 150 * (1 - slownessRating) * (1 - slownessRating);

		let baseStat = move.category === 'Physical' ? adjustedStats.atk : adjustedStats.spa;
		if (move.id === 'foulplay') baseStat = adjustedStats.spe * level / 100;
		if (move.id === 'bodypress') baseStat = adjustedStats.def * level / 100;
		// 10% bonus for never-miss moves
		let accuracy = move.accuracy === true || ability === 'No Guard' ? 110 : move.accuracy;
		if (accuracy < 100) {
			if (ability === 'Compound Eyes') accuracy = Math.min(100, Math.round(accuracy * 1.3));
			if (ability === 'Victory Star') accuracy = Math.min(100, Math.round(accuracy * 1.1));
		}
		accuracy /= 100;

		const moveType = TeamGenerator.moveType(move, species);

		let powerEstimate = basePower * baseStat * accuracy;
		// STAB
		if (species.types.includes(moveType)) powerEstimate *= ability === 'Adaptability' ? 2 : 1.5;
		if (ability === 'Technician' && move.basePower <= 60) powerEstimate *= 1.5;
		if (ability === 'Sheer Force' && (move.secondary || move.secondaries)) powerEstimate *= 1.3;
		const numberOfHits = Array.isArray(move.multihit) ?
			(ability === 'Skill Link' ? move.multihit[1] : (move.multihit[0] + move.multihit[1]) / 2) :
			move.multihit || 1;
		powerEstimate *= numberOfHits;

		if (species.requiredItems) {
			const item: Item & EventMethods = this.dex.items.get(this.specialItems[species.name]);
			if (item.onBasePower && (species.types.includes(moveType) || item.name.endsWith('Mask'))) powerEstimate *= 1.2;
		} else if (this.specialItems[species.name]) {
			const item: Item & EventMethods = this.dex.items.get(this.specialItems[species.name]);
			if (item.onBasePower && species.types.includes(moveType)) powerEstimate *= 1.2;
			if (item.id === 'lightball') powerEstimate *= 2;
		}

		// If it uses the attacking stat that we don't boost, it's less useful!
		const specialSetup = movesStats.setup.spa;
		const physicalSetup = movesStats.setup.atk;
		if (move.category === 'Physical' && !['bodypress', 'foulplay'].includes(move.id)) {
			powerEstimate *= Math.max(0.5, 1 + physicalSetup) / Math.max(0.5, 1 + specialSetup);
		}
		if (move.category === 'Special') powerEstimate *= Math.max(0.5, 1 + specialSetup) / Math.max(0.5, 1 + physicalSetup);

		let abilityBonus = (
			(ABILITY_MOVE_BONUSES[this.dex.toID(ability)]?.[move.id] || 1) *
			(ABILITY_MOVE_TYPE_BONUSES[this.dex.toID(ability)]?.[moveType] || 1)
		);

		const missilePrimers = ['surf', 'dive'];
		if (ability === 'Gulp Missile' && missilePrimers.includes(move.id)) {
			// we want exactly one move that activates gulp missile
			if (!movesSoFar.find(m => m.id === (missilePrimers.find(p => p !== move.id)))) {
				abilityBonus = 3;
			} else {
				abilityBonus = 0.75;
			}
		}

		let weight = powerEstimate * abilityBonus;
		if (move.id in HARDCODED_MOVE_WEIGHTS) weight *= HARDCODED_MOVE_WEIGHTS[move.id];
		// semi-hardcoded move weights that depend on having control over the item
		if (!this.specialItems[species.name] && !species.requiredItem) {
			if (move.id === 'acrobatics') weight *= 1.75;
			if (move.id === 'facade') {
				if (!['Comatose', 'Purifying Salt', 'Shields Down', 'Natural Cure', 'Misty Surge'].includes(ability)) weight *= 1.5;
			}
		}

		// priority is more useful when you're slower
		// except Upper Hand, which is anti-priority and thus better on faster Pokemon
		// TODO: make weight scale with priority
		if (move.priority > 0 && move.id !== 'upperhand') weight *= (Math.max(105 - adjustedStats.spe, 0) / 105) * 0.5 + 1;
		if (move.priority < 0 || move.id === 'upperhand') weight *= Math.min((1 / adjustedStats.spe) * 25, 1);

		// flags
		if (move.flags.charge || (move.flags.recharge && ability !== 'Truant')) weight *= 0.5;
		if (move.flags.contact) {
			if (ability === 'Tough Claws') weight *= 1.3;
			if (ability === 'Unseen Fist') weight *= 1.1;
			if (ability === 'Poison Touch') weight *= TeamGenerator.statusWeight('psn', 1 - (0.7 ** numberOfHits));
		}
		if (move.flags.bite && ability === 'Strong Jaw') weight *= 1.5;
		// 5% boost for ability to bypass subs
		if (move.flags.bypasssub) weight *= 1.05;
		if (move.flags.pulse && ability === 'Mega Launcher') weight *= 1.5;
		if (move.flags.punch && ability === 'Iron Fist') weight *= 1.2;
		if (!move.flags.protect) weight *= 1.05;
		if (move.flags.slicing && ability === 'Sharpness') weight *= 1.5;
		if (move.flags.sound && ability === 'Punk Rock') weight *= 1.3;

		// boosts/secondaries
		// TODO: consider more possible secondaries
		weight *= this.boostWeight(move, movesSoFar, species, ability, level);
		const secondaryChance = Math.min((move.secondary?.chance || 100) * (ability === 'Serene Grace' ? 2 : 1) / 100, 100);
		if (move.secondary || move.secondaries) {
			if (ability === 'Sheer Force') {
				weight *= 1.3;
			} else {
				const secondaries = move.secondaries || [move.secondary!];
				for (const secondary of secondaries) {
					if (secondary.status) {
						weight *= TeamGenerator.statusWeight(secondary.status, secondaryChance, slownessRating);
						if (ability === 'Poison Puppeteer' && ['psn', 'tox'].includes(secondary.status)) {
							weight *= TeamGenerator.statusWeight('confusion', secondaryChance);
						}
					}
					if (secondary.volatileStatus) {
						weight *= TeamGenerator.statusWeight(secondary.volatileStatus, secondaryChance, slownessRating);
					}
				}
			}
		}
		if (ability === 'Toxic Chain') weight *= TeamGenerator.statusWeight('tox', 1 - (0.7 ** numberOfHits));

		// Special effect if something special happened earlier in the turn
		// More useful on slower Pokemon
		if (move.id === 'lashout') weight *= 1 + 0.2 * slownessRating;
		if (move.id === 'burningjealousy') weight *= TeamGenerator.statusWeight('brn', 0.2 * slownessRating);
		if (move.id === 'alluringvoice') weight *= TeamGenerator.statusWeight('confusion', 0.2 * slownessRating);

		// self-inflicted confusion or locking yourself in
		if (move.self?.volatileStatus) weight *= 0.8;

		// downweight moves if we already have an attacking move of the same type
		if ((movesStats.attackTypes[moveType] || 0) > 60) weight *= 0.5;

		if (move.selfdestruct) weight *= 0.3;
		if (move.recoil && ability !== 'Rock Head' && ability !== 'Magic Guard') {
			weight *= 1 - (move.recoil[0] / move.recoil[1]);
			if (ability === 'Reckless') weight *= 1.2;
		}
		if (move.hasCrashDamage && ability !== 'Magic Guard') {
			weight *= 1 - 0.75 * (1.2 - accuracy);
			if (ability === 'Reckless') weight *= 1.2;
		}
		if (move.mindBlownRecoil) weight *= 0.25;
		if (move.flags['futuremove']) weight *= 0.3;

		let critRate = move.willCrit ? 4 : move.critRatio || 1;
		if (ability === 'Super Luck') critRate++;
		if (movesSoFar.some(m => m.id === 'focusenergy')) {
			critRate += 2;
			weight *= 0.9; // a penalty the extra turn of setup
		}
		if (critRate > 4) critRate = 4;
		weight *= 1 + [0, 1 / 24, 1 / 8, 1 / 2, 1][critRate] * (ability === 'Sniper' ? 1 : 0.5);

		// these two hazard removers don't clear hazards on the opponent's field, but can be blocked by type immunities
		if (['rapidspin', 'mortalspin'].includes(move.id)) {
			weight *= 1 + 20 * (0.25 ** teamStats.hazardRemovers);
		}

		// these moves have a hard-coded 16x bonus
		if (move.id === 'stoneaxe' && teamStats.hazardSetters.stealthrock) weight /= 4;
		if (move.id === 'ceaselessedge' && teamStats.hazardSetters.spikes) weight /= 2;

		if (move.drain) {
			const drainedFraction = move.drain[0] / move.drain[1];
			weight *= 1 + (drainedFraction * 0.5);
		}

		// Oricorio should rarely get Tera Blast, as Revelation Dance is strictly better
		// Tera Blast is also bad on species with forced Tera types, a.k.a. Ogerpon and Terapagos
		if (move.id === 'terablast' && (species.baseSpecies === 'Oricorio' || species.forceTeraType)) weight *= 0.5;

		return weight;
	}

	/**
	 * @returns The effective type of moves with variable types such as Judgment
	 */
	protected static moveType(move: Move, species: Species) {
		switch (move.id) {
		case 'ivycudgel':
		case 'ragingbull':
			if (species.types.length > 1) return species.types[1];
			// falls through for Ogerpon and Tauros's respective base formes
		case 'judgment':
		case 'revelationdance':
			return species.types[0];
		}
		return move.type;
	}

	protected static moveIsPhysical(move: Move, species: Species) {
		if (move.category === 'Physical') {
			return !(move.damageCallback || move.damage);
		} else if (['terablast', 'terastarstorm', 'photongeyser', 'shellsidearm'].includes(move.id)) {
			return species.baseStats.atk > species.baseStats.spa;
		} else {
			return false;
		}
	}

	protected static moveIsSpecial(move: Move, species: Species) {
		if (move.category === 'Special') {
			return !(move.damageCallback || move.damage);
		} else if (['terablast', 'terastarstorm', 'photongeyser', 'shellsidearm'].includes(move.id)) {
			return species.baseStats.atk <= species.baseStats.spa;
		} else {
			return false;
		}
	}

	/**
	 * @returns A multiplier to a move weighting based on the status it inflicts.
	 */
	protected static statusWeight(status: string, chance = 1, slownessRating?: number): number {
		if (chance !== 1) return 1 + (TeamGenerator.statusWeight(status) - 1) * chance;

		switch (status) {
		case 'brn': return 2;
		case 'frz': return 5;
		// paralysis is especially valuable on slow pokemon that can become faster than an opponent by paralyzing it
		// but some pokemon are so slow that most paralyzed pokemon would still outspeed them anyway
		case 'par': return slownessRating && slownessRating > 0.25 ? 2 + slownessRating : 2;
		case 'psn': return 1.75;
		case 'tox': return 4;
		case 'slp': return 4;
		case 'confusion': return 1.5;
		case 'healblock': return 1.75;
		case 'flinch': return slownessRating ? slownessRating * 3 : 1;
		case 'saltcure': return 2;
		case 'sparklingaria': return 0.95;
		case 'syrupbomb': return 1.5;
		}
		return 1;
	}

	/**
	 * @returns A multiplier to a move weighting based on the boosts it produces for the user.
	 */
	protected boostWeight(move: Move, movesSoFar: Move[], species: Species, ability: string, level: number): number {
		const physicalIsRelevant = (
			TeamGenerator.moveIsPhysical(move, species) ||
			movesSoFar.some(
				m => TeamGenerator.moveIsPhysical(m, species) && !m.overrideOffensiveStat && !m.overrideOffensivePokemon
			)
		);
		const specialIsRelevant = (
			TeamGenerator.moveIsSpecial(move, species) ||
			movesSoFar.some(m => TeamGenerator.moveIsSpecial(m, species))
		);

		const adjustedStats: StatsTable = {
			hp: species.baseStats.hp * level / 100 + level,
			atk: species.baseStats.atk * level * level / 10000,
			def: species.baseStats.def * level / 100,
			spa: species.baseStats.spa * level * level / 10000,
			spd: species.baseStats.spd * level / 100,
			spe: species.baseStats.spe * level / 100,
		};

		let weight = 0;
		const accuracy = move.accuracy === true ? 100 : move.accuracy / 100;
		const secondaryChance = move.secondary && ability !== 'Sheer Force' ?
			Math.min(((move.secondary.chance || 100) * (ability === 'Serene Grace' ? 2 : 1) / 100), 100) * accuracy : 0;
		const abilityMod = ability === 'Simple' ? 2 : ability === 'Contrary' ? -1 : 1;
		const bodyPressMod = movesSoFar.some(m => m.id === 'bodyPress') ? 2 : 1;
		const electroBallMod = movesSoFar.some(m => m.id === 'electroball') ? 2 : 1;
		for (const { chance, boosts } of [
			{ chance: 1, boosts: move.boosts },
			{ chance: 1, boosts: move.self?.boosts },
			{ chance: 1, boosts: move.selfBoost?.boosts },
			{
				chance: secondaryChance,
				boosts: move.secondary?.self?.boosts,
			},
		]) {
			if (!boosts || chance === 0) continue;
			const statusMod = move.category === 'Status' ? 1 : 0.5;

			if (boosts.atk && physicalIsRelevant) weight += chance * boosts.atk * abilityMod * 2 * statusMod;
			if (boosts.spa && specialIsRelevant) weight += chance * boosts.spa * abilityMod * 2 * statusMod;

			// TODO: should these scale by base stat magnitude instead of using ternaries?
			// defense/special defense boost is less useful if we have some bulk to start with
			if (boosts.def) {
				weight += chance * boosts.def * abilityMod * bodyPressMod * (adjustedStats.def > 60 ? 0.5 : 1) * statusMod;
			}
			if (boosts.spd) weight += chance * boosts.spd * abilityMod * (adjustedStats.spd > 60 ? 0.5 : 1) * statusMod;

			// speed boost is less useful for fast pokemon
			if (boosts.spe) {
				weight += chance * boosts.spe * abilityMod * electroBallMod * (adjustedStats.spe > 95 ? 0.5 : 1) * statusMod;
			}
		}

		return weight >= 0 ? 1 + weight : 1 / (1 - weight);
	}

	/**
	 * @returns A weight for a move based on how much it will reduce the opponent's stats.
	 */
	protected opponentDebuffWeight(move: Move): number {
		if (!['allAdjacentFoes', 'allAdjacent', 'foeSide', 'normal'].includes(move.target)) return 1;

		let averageNumberOfDebuffs = 0;
		for (const { chance, boosts } of [
			{ chance: 1, boosts: move.boosts },
			{
				chance: move.secondary ? ((move.secondary.chance || 100) / 100) : 0,
				boosts: move.secondary?.boosts,
			},
		]) {
			if (!boosts || chance === 0) continue;

			const numBoosts = Object.values(boosts).filter(x => x < 0).length;
			averageNumberOfDebuffs += chance * numBoosts;
		}

		return 1 + (0.5 * averageNumberOfDebuffs);
	}

	/**
	 * @returns A weight for an item.
	 */
	protected getItemWeight(
		item: Item, teamStats: TeamStats, species: Species, moves: Move[], ability: string, level: number
	): number {
		const adjustedStats: StatsTable = {
			hp: species.baseStats.hp * level / 100 + level,
			atk: species.baseStats.atk * level * level / 10000,
			def: species.baseStats.def * level / 100,
			spa: species.baseStats.spa * level * level / 10000,
			spd: species.baseStats.spd * level / 100,
			spe: species.baseStats.spe * level / 100,
		};
		const statusImmunities = ['Comatose', 'Purifying Salt', 'Shields Down', 'Natural Cure', 'Misty Surge'];

		let weight;
		switch (item.id) {
		// Choice Items
		case 'choiceband':
			return moves.every(x => TeamGenerator.moveIsPhysical(x, species) && x.priority < 3) ? 50 : 0;
		case 'choicespecs':
			return moves.every(x => TeamGenerator.moveIsSpecial(x, species)) ? 50 : 0;
		case 'choicescarf':
			if (moves.some(x => x.category === 'Status' || x.secondary?.self?.boosts?.spe || x.priority > 1)) return 0;
			if (adjustedStats.spe > 50 && adjustedStats.spe < 120) return 50;
			return 10;

		// Generally Decent Items
		case 'lifeorb':
			return moves.filter(x => x.category !== 'Status' && !x.damage && !x.damageCallback).length * 8;
		case 'focussash':
			if (ability === 'Sturdy') return 0;
			// frail
			if (adjustedStats.hp < 65 && adjustedStats.def < 65 && adjustedStats.spd < 65) return 35;
			return 10;
		case 'heavydutyboots':
			switch (this.dex.getEffectiveness('Rock', species)) {
			case 2: return 50; // double super effective
			case 1: return 30; // super effective
			case 0: return 10; // neutral
			}
			return 5; // not very effective/other
		case 'assaultvest':
			if (moves.some(x => x.category === 'Status')) return 0;
			return 30;
		case 'scopelens':
			const attacks = moves.filter(x => x.category !== 'Status' && !x.damage && !x.damageCallback && !x.willCrit);
			if (moves.some(m => m.id === 'focusenergy')) {
				if (ability === 'Super Luck') return 0; // we're already lucky enough, thank you
				return attacks.length * (ability === 'Sniper' ? 16 : 12);
			} else if (attacks.filter(x => (x.critRatio || 1) > 1).length || ability === 'Super Luck') {
				return attacks.reduce((total, x) => {
					let ratio = ability === 'Super Luck' ? 2 : 1;
					if ((x.critRatio || 1) > 1) ratio++;
					return total + [0, 3, 6, 12][ratio] * (ability === 'Sniper' ? 4 / 3 : 1);
				}, 0);
			}
			return 0;
		case 'eviolite':
			return species.nfe || species.id === 'dipplin' ? 100 : 0;

		// status
		case 'flameorb':
			if (species.types.includes('Fire')) return 0;
			if (statusImmunities.includes(ability)) return 0;
			if (['Thermal Exchange', 'Water Bubble', 'Water Veil'].includes(ability)) return 0;
			weight = ['Guts', 'Flare Boost'].includes(ability) ? 30 : 0;
			if (moves.some(m => m.id === 'facade')) {
				if (!weight && !moves.some(m => TeamGenerator.moveIsPhysical(m, species) && m.id !== 'facade')) {
					weight = 30;
				} else {
					weight *= 2;
				}
			}
			return weight;
		case 'toxicorb':
			if (species.types.includes('Poison') || species.types.includes('Steel')) return 0;
			if (statusImmunities.includes(ability)) return 0;
			if (ability === 'Immunity') return 0;
			// If facade is our only physical attack, Flame Orb is preferred
			if (!moves.some(m => TeamGenerator.moveIsPhysical(m, species) && m.id !== 'facade') &&
				!species.types.includes('Fire') && ['Thermal Exchange', 'Water Bubble', 'Water Veil'].includes(ability)
			) return 0;

			weight = 0;
			if (['Poison Heal', 'Toxic Boost'].includes('ability')) weight += 25;
			if (moves.some(m => m.id === 'facade')) weight += 25;

			return weight;

		// Healing
		case 'leftovers':
			return moves.some(m => m.stallingMove) ? 40 : 20;
		case 'blacksludge':
			// Even poison types don't really like Black Sludge in Gen 9 because it discourages them from terastallizing
			// to a type other than Poison, and thus reveals their Tera type when it activates
			return species.types.includes('Poison') ? moves.some(m => m.stallingMove) ? 20 : 10 : 0;

		// berries
		case 'sitrusberry': case 'magoberry':
			return 20;

		case 'throatspray':
			if (moves.some(m => m.flags.sound) && moves.some(m => m.category === 'Special')) return 30;
			return 0;

		default:
			// probably not a very good item
			return 0;
		}
	}

	/**
	 * @returns The level a Pokémon should be.
	 */
	protected static getLevel(species: Species): number {
		if (['Zacian', 'Zamazenta'].includes(species.name)) {
			species = Dex.species.get(species.otherFormes![0]);
		} else if (species.baseSpecies === 'Squawkabilly') {
			if (['Yellow', 'White'].includes(species.forme)) {
				species = Dex.species.get('Squawkabilly-Yellow');
			} else {
				species = Dex.species.get('Squawkabilly');
			}
		} else if (useBaseSpecies.includes(species.baseSpecies)) {
			species = Dex.species.get(species.baseSpecies);
		}
		if (levelOverride[species.id]) return levelOverride[species.id];

		switch (species.tier) {
		case 'AG': return 60;
		case 'Uber': return 70;
		case 'OU': case 'Unreleased': return 80;
		case 'UU': return 90;
		case 'LC': case 'NFE': return 100;
		}

		return 100;
	}

	/**
	 * Picks a choice from `choices` based on the weights in `weights`.
	 * `weights` must be the same length as `choices`.
	 */
	weightedRandomPick<T>(
		choices: T[],
		weights: number[],
		options?: { remove?: boolean }
	) {
		if (!choices.length) throw new Error(`Can't pick from an empty list`);
		if (choices.length !== weights.length) throw new Error(`Choices and weights must be the same length`);

		/* console.log(choices.reduce((acc, element, index) => {
			return {
				 ...acc,
				 [element as string]: weights[index],
			};
	  }, {})) */

		const totalWeight = weights.reduce((a, b) => a + b, 0);

		let randomWeight = this.prng.random(0, totalWeight);
		for (let i = 0; i < choices.length; i++) {
			randomWeight -= weights[i];
			if (randomWeight < 0) {
				const choice = choices[i];
				if (options?.remove) choices.splice(i, 1);
				return choice;
			}
		}

		if (options?.remove && choices.length) return choices.pop()!;
		return choices[choices.length - 1];
	}

	setSeed(seed: PRNGSeed) {
		this.prng.setSeed(seed);
	}
}
