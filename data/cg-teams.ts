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

import {Dex, PRNG, SQL} from '../sim';
import {
	ABILITY_MOVE_BONUSES,
	ABILITY_MOVE_TYPE_BONUSES,
	HARDCODED_MOVE_WEIGHTS,
	MOVE_PAIRINGS,
	SPEED_BASED_MOVES,
	WEIGHT_BASED_MOVES,
} from './cg-team-data';

interface TeamStats {
	hazardSetters: {[moveid: string]: number};
	typeWeaknesses: {[type: string]: number};
}

// We put a limit on the number of Pokémon on a team that can be weak to a given type.
const MAX_WEAK_TO_SAME_TYPE = 3;

const levelOverride: {[speciesID: string]: number} = {};
export let levelUpdateInterval: NodeJS.Timeout | null = null;

async function updateLevels(database: SQL.DatabaseManager) {
	const updateSpecies = await database.prepare(
		'UPDATE gen9computergeneratedteams SET wins = 0, losses = 0, level = ? WHERE species_id = ?'
	);
	const updateHistory = await database.prepare(
		`INSERT INTO gen9_historical_levels (level, species_id, timestamp) VALUES (?, ?, ${Date.now()})`
	);
	const data = await database.all('SELECT species_id, wins, losses, level FROM gen9computergeneratedteams');
	for (let {species_id, wins, losses, level} of data) {
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

if (global.Config && Config.usesqlite && Config.usesqliteleveling) {
	const database = SQL(module, {file: './databases/battlestats.db'});

	// update every 2 hours
	void updateLevels(database);
	levelUpdateInterval = setInterval(() => void updateLevels(database), 1000 * 60 * 60 * 2);
}

export default class TeamGenerator {
	dex: ModdedDex;
	format: Format;
	teamSize: number;
	forceLevel?: number;
	prng: PRNG;
	itemPool: Item[];

	constructor(format: Format | string, seed: PRNG | PRNGSeed | null) {
		this.dex = Dex.forFormat(format);
		this.format = Dex.formats.get(format);
		this.teamSize = this.format.ruleTable?.maxTeamSize || 6;
		this.prng = seed instanceof PRNG ? seed : new PRNG(seed);
		this.itemPool = this.dex.items.all().filter(i => i.exists && i.isNonstandard !== 'Past' && !i.isPokeball);

		const rules = Dex.formats.getRuleTable(this.format);
		if (rules.adjustLevel) this.forceLevel = rules.adjustLevel;
	}

	getTeam(): PokemonSet[] {
		let speciesPool = this.dex.species.all().filter(s => {
			if (!s.exists) return false;
			if (s.isNonstandard || s.isNonstandard === 'Unobtainable') return false;
			if (s.nfe) return false;
			if (s.battleOnly && !s.requiredItems?.length) return false;

			return true;
		});
		const teamStats: TeamStats = {
			hazardSetters: {},
			typeWeaknesses: {},
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
		const abilityPool = Object.values(species.abilities);
		const abilityWeights = abilityPool.map(a => this.getAbilityWeight(this.dex.abilities.get(a)));
		const ability = this.weightedRandomPick(abilityPool, abilityWeights);

		const moves: Move[] = [];

		let learnset = this.dex.species.getLearnset(species.id);
		let movePool: string[] = [];
		let learnsetSpecies = species;
		if (!learnset || species.id === 'gastrodoneast') {
			learnsetSpecies = this.dex.species.get(species.baseSpecies);
			learnset = this.dex.species.getLearnset(learnsetSpecies.id);
		}
		if (learnset) {
			movePool = Object.keys(learnset).filter(
				moveid => learnset![moveid].find(learned => learned.startsWith('9'))
			);
		}
		if (learnset && learnsetSpecies === species && species.changesFrom) {
			const changesFrom = this.dex.species.get(species.changesFrom);
			learnset = this.dex.species.getLearnset(changesFrom.id);
			for (const moveid in learnset) {
				if (!movePool.includes(moveid) && learnset[moveid].some(source => source.startsWith('9'))) {
					movePool.push(moveid);
				}
			}
		}
		const evoRegion = learnsetSpecies.evoRegion;
		while (learnsetSpecies.prevo) {
			learnsetSpecies = this.dex.species.get(learnsetSpecies.prevo);
			for (const moveid in learnset) {
				if (!movePool.includes(moveid) &&
					learnset[moveid].some(source => source.startsWith('9') && !evoRegion)) {
					movePool.push(moveid);
				}
			}
		}
		if (!movePool.length) throw new Error(`No moves for ${species.id}`);

		// Consider either the top 15 moves or top 30% of moves, whichever is greater.
		const numberOfMovesToConsider = Math.min(movePool.length, Math.max(15, Math.trunc(movePool.length * 0.3)));
		let movePoolIsTrimmed = false;
		while (moves.length < 4 && movePool.length) {
			let weights;
			if (!movePoolIsTrimmed) {
				const interimMovePool = [];
				for (const move of movePool) {
					const weight = this.getMoveWeight(this.dex.moves.get(move), teamStats, species, moves, ability);
					interimMovePool.push({move, weight});
				}

				interimMovePool.sort((a, b) => b.weight - a.weight);

				movePool = [];
				weights = [];

				for (let i = 0; i < numberOfMovesToConsider; i++) {
					movePool.push(interimMovePool[i].move);
					weights.push(interimMovePool[i].weight);
				}
				movePoolIsTrimmed = true;
			} else {
				weights = movePool.map(m => this.getMoveWeight(this.dex.moves.get(m), teamStats, species, moves, ability));
			}

			const moveID = this.weightedRandomPick(movePool, weights, {remove: true});

			// add paired moves, like RestTalk
			const pairedMove = MOVE_PAIRINGS[moveID];
			const alreadyHavePairedMove = moves.some(m => m.id === pairedMove);
			if (
				moves.length < 3 &&
				pairedMove &&
				!alreadyHavePairedMove &&
				// We don't check movePool because sometimes paired moves are bad.
				this.dex.species.getLearnset(species.id)?.[pairedMove]
			) {
				moves.push(this.dex.moves.get(pairedMove));
				movePool.splice(movePool.indexOf(pairedMove), 1);
			}

			moves.push(this.dex.moves.get(moveID));
		}

		let item = '';
		if (species.requiredItem) {
			item = species.requiredItem;
		} else if (species.requiredItems) {
			item = this.prng.sample(species.requiredItems.filter(i => !this.dex.items.get(i).isNonstandard));
		} else if (moves.every(m => m.id !== 'acrobatics')) { // Don't assign an item if the set includes Acrobatics...
			const weights = [];
			const items = [];
			for (const i of this.itemPool) {
				// If the species has a special item, we should use it.
				if (i.itemUser?.includes(species.name)) {
					item = i.name;
					break;
				}

				const weight = this.getItemWeight(i, teamStats, species, moves, ability);
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

		const level = this.forceLevel || TeamGenerator.getLevel(species);

		// For Tera Type, we just pick a random type if it's got Tera Blast or no attacking moves,
		// and the type of one of its attacking moves otherwise (so it can take advantage of the boosts).
		let teraType;
		const nonStatusMoves = moves.filter(move => this.dex.moves.get(move).category !== 'Status');
		if (!moves.some(m => m.id === 'terablast') && nonStatusMoves.length) {
			teraType = this.prng.sample(nonStatusMoves.map(move => this.dex.moves.get(move).type));
		} else {
			teraType = this.prng.sample([...this.dex.types.all()]).name;
		}

		return {
			name: species.name,
			species: species.name,
			item,
			ability,
			moves: moves.map(m => m.name),
			nature: 'Quirky',
			gender: species.gender,
			evs: {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
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
		for (const type of this.dex.types.all()) {
			const effectiveness = this.dex.getEffectiveness(type.name, species.types);
			if (effectiveness === 1) { // WEAKNESS!
				if (stats.typeWeaknesses[type.name] === undefined) {
					stats.typeWeaknesses[type.name] = 0;
				}
				if (stats.typeWeaknesses[type.name] >= MAX_WEAK_TO_SAME_TYPE) {
					// too many weaknesses to this type
					return false;
				}
			}
		}
		// species passes; increment counters
		for (const type of this.dex.types.all()) {
			const effectiveness = this.dex.getEffectiveness(type.name, species.types);
			if (effectiveness === 1) {
				stats.typeWeaknesses[type.name]++;
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

	/**
	 * @returns A weight for a given move on a given Pokémon.
	 */
	protected getMoveWeight(
		move: Move,
		teamStats: TeamStats,
		species: Species,
		movesSoFar: Move[],
		ability: string
	): number {
		if (!move.exists) return 0;
		// this is NOT doubles, so there will be no adjacent ally
		if (move.target === 'adjacentAlly') return 0;

		if (move.category === 'Status') {
			// The initial value of this weight determines how valuable status moves are vs. attacking moves.
			// You can raise it to make random status moves more valuable or lower it and increase multipliers
			// to make only CERTAIN status moves valuable.
			let weight = 2500;

			// inflicts status
			if (move.status) weight *= TeamGenerator.statusWeight(move.status) * 2;

			// hazard setters: very important, but we don't need 2 pokemon to set the same hazard on a team
			const isHazard = (m: Move) => m.sideCondition && m.target === 'foeSide';
			if (isHazard(move) && (teamStats.hazardSetters[move.id] || 0) < 1) {
				weight *= move.id === 'spikes' ? 12 : 16;

				// if we are ALREADY setting hazards, setting MORE is really good
				if (movesSoFar.some(m => isHazard(m))) weight *= 2;
				teamStats.hazardSetters[move.id]++;
			}

			// boosts
			weight *= this.boostWeight(move, movesSoFar, species) * 2;
			weight *= this.opponentDebuffWeight(move) * 2;

			// protection moves - useful for bulky/stally pokemon
			if (species.baseStats.def >= 100 || species.baseStats.spd >= 100 || species.baseStats.hp >= 100) {
				switch (move.volatileStatus) {
				case 'endure':
					weight *= 3;
					break;
				case 'protect': case 'kingsshield': case 'silktrap':
					weight *= 4;
					break;
				case 'banefulbunker': case 'spikyshield':
					weight *= 5;
					break;
				default:
					break;
				}
			}

			// Hardcoded boosts
			if (move.id in HARDCODED_MOVE_WEIGHTS) weight *= HARDCODED_MOVE_WEIGHTS[move.id];

			// Pokémon with high Attack and Special Attack stats shouldn't have too many status moves,
			// but on bulkier Pokémon it's more likely to be worth it.
			const goodAttacker = species.baseStats.atk > 80 || species.baseStats.spa > 80;
			if (goodAttacker && movesSoFar.filter(m => m.category !== 'Status').length < 2) {
				weight *= 0.3;
			}

			return weight;
		}

		// For Grass Knot and friends, let's just assume they average out to around 60 base power.
		const isWeirdPowerMove = WEIGHT_BASED_MOVES.includes(move.id);
		let basePower = isWeirdPowerMove ? 60 : move.basePower;
		// not how this calc works but it should be close enough
		if (SPEED_BASED_MOVES.includes(move.id)) basePower = species.baseStats.spe / 2;

		const baseStat = move.category === 'Physical' ? species.baseStats.atk : species.baseStats.spa;
		// 10% bonus for never-miss moves
		const accuracy = move.accuracy === true ? 1.1 : move.accuracy / 100;

		let powerEstimate = basePower * baseStat * accuracy;
		// STAB
		if (species.types.includes(move.type)) powerEstimate *= ability === 'Adaptability' ? 2 : 1.5;
		if (ability === 'Technician' && move.basePower <= 60) powerEstimate *= 1.5;
		if (ability === 'Steely Spirit' && move.type === 'Steel') powerEstimate *= 1.5;
		if (move.multihit) {
			const numberOfHits = Array.isArray(move.multihit) ?
				(ability === 'Skill Link' ? move.multihit[1] : (move.multihit[0] + move.multihit[1]) / 2) :
				move.multihit;

			powerEstimate *= numberOfHits;
		}

		// If it uses the attacking stat that we don't boost, it's less useful!
		const hasSpecialSetup = movesSoFar.some(m => m.boosts?.spa || m.self?.boosts?.spa || m.selfBoost?.boosts?.spa);
		const hasPhysicalSetup = movesSoFar.some(m => m.boosts?.atk || m.self?.boosts?.atk || m.selfBoost?.boosts?.atk);
		if (move.category === 'Physical' && hasSpecialSetup) powerEstimate *= 0.7;
		if (move.category === 'Special' && hasPhysicalSetup) powerEstimate *= 0.7;

		const abilityBonus = (
			((ABILITY_MOVE_BONUSES[ability] || {})[move.id] || 1) *
			((ABILITY_MOVE_TYPE_BONUSES[ability] || {})[move.type] || 1)
		);

		let weight = powerEstimate * abilityBonus;
		if (move.id in HARDCODED_MOVE_WEIGHTS) weight *= HARDCODED_MOVE_WEIGHTS[move.id];

		// priority is more useful when you're slower
		if (move.priority > 0) weight *= (Math.max(130 - species.baseStats.spe, 0) / 130) * 0.5 + 1;
		if (move.priority < 0) weight *= Math.min((1 / species.baseStats.spe) * 30, 1);

		// flags
		if (move.flags.charge || (move.flags.recharge && ability !== 'Truant')) weight *= 0.5;
		if (move.flags.contact) {
			if (ability === 'Tough Claws') weight *= 1.3;
			if (ability === 'Unseen Fist') weight *= 1.1;
		}
		if (move.flags.bite && ability === 'Strong Jaw') weight *= 1.5;
		// 10% boost for ability to break subs
		if (move.flags.bypasssub) weight *= 1.1;
		if (move.flags.pulse && ability === 'Mega Launcher') weight *= 1.5;
		if (move.flags.punch && ability === 'Iron Fist') weight *= 1.2;
		if (!move.flags.protect) weight *= 1.1;
		if (move.flags.slicing && ability === 'Sharpness') weight *= 1.5;

		// boosts/secondaries
		// TODO: consider more possible secondaries
		weight *= this.boostWeight(move, movesSoFar, species);
		if (move.secondary?.status) {
			weight *= TeamGenerator.statusWeight(move.secondary.status, (move.secondary.chance || 100) / 100);
		}

		// self-inflicted confusion or locking yourself in
		if (move.self?.volatileStatus) weight *= 0.8;

		// downweight moves if we already have an attacking move of the same type
		if (movesSoFar.some(m => m.category !== 'Status' && m.type === move.type && m.basePower >= 60)) weight *= 0.3;

		if (move.selfdestruct) weight *= 0.3;
		if (move.recoil) weight *= 1 - (move.recoil[0] / move.recoil[1]);
		if (move.mindBlownRecoil) weight *= 0.25;
		if (move.flags['futuremove']) weight *= 0.3;
		// TODO: account for normal higher-crit-chance moves
		if (move.willCrit) weight *= 1.45;

		if (move.drain) {
			const drainedFraction = move.drain[0] / move.drain[1];
			weight *= 1 + (drainedFraction * 0.5);
		}

		// don't need 2 healing moves
		if (move.heal && movesSoFar.some(m => m.heal)) weight *= 0.5;

		return weight;
	}

	/**
	 * @returns A multiplier to a move weighting based on the status it inflicts.
	 */
	protected static statusWeight(status: string, chance = 1): number {
		if (chance !== 1) return 1 + (TeamGenerator.statusWeight(status) - 1) * chance;

		switch (status) {
		case 'brn': return 1.5;
		case 'frz': return 5;
		case 'par': return 1.5;
		case 'psn': return 1.5;
		case 'tox': return 4;
		case 'slp': return 4;
		}
		return 1;
	}

	/**
	 * @returns A multiplier to a move weighting based on the boosts it produces for the user.
	 */
	protected boostWeight(move: Move, movesSoFar: Move[], species: Species): number {
		const physicalIsRelevant = (
			move.category === 'Physical' ||
			movesSoFar.some(m => m.category === 'Physical')
		);
		const specialIsRelevant = (
			move.category === 'Special' ||
			movesSoFar.some(m => m.category === 'Special')
		);

		let weight = 1;
		for (const {chance, boosts} of [
			{chance: 1, boosts: move.boosts},
			{chance: 1, boosts: move.self?.boosts},
			{chance: 1, boosts: move.selfBoost?.boosts},
			{
				chance: move.secondary ? ((move.secondary.chance || 100) / 100) : 0,
				boosts: move.target === 'self' ? move.secondary?.boosts : move.secondary?.self?.boosts,
			},
		]) {
			if (!boosts || chance === 0) continue;

			if (boosts.atk && physicalIsRelevant) weight += (chance || 1) * 0.5 * boosts.atk;
			if (boosts.spa && specialIsRelevant) weight += (chance || 1) * 0.5 * boosts.spa;

			// TODO: should these scale by base stat magnitude instead of using ternaries?
			// defense/special defense boost is less useful if we have some bulk to start with
			if (boosts.def) weight += (chance || 1) * 0.5 * boosts.def * (species.baseStats.def > 75 ? 1 : 0.5);
			if (boosts.spd) weight += (chance || 1) * 0.5 * boosts.spd * (species.baseStats.spd > 75 ? 1 : 0.5);

			// speed boost is less useful for fast pokemon
			if (boosts.spe) weight += (chance || 1) * 0.5 * boosts.spe * (species.baseStats.spe > 120 ? 0.5 : 1);
		}

		return weight;
	}

	/**
	 * @returns A weight for a move based on how much it will reduce the opponent's stats.
	 */
	protected opponentDebuffWeight(move: Move): number {
		if (!['allAdjacentFoes', 'allAdjacent', 'foeSide', 'normal'].includes(move.target)) return 1;

		let averageNumberOfDebuffs = 0;
		for (const {chance, boosts} of [
			{chance: 1, boosts: move.boosts},
			{
				chance: move.secondary ? ((move.secondary.chance || 100) / 100) : 0,
				boosts: move.secondary?.boosts,
			},
		]) {
			if (!boosts || chance === 0) continue;

			const numBoosts = Object.values(boosts).filter(x => x < 0).length;
			averageNumberOfDebuffs += chance * numBoosts;
		}

		return 1 + (0.25 * averageNumberOfDebuffs);
	}

	/**
	 * @returns A weight for an item.
	 */
	protected getItemWeight(item: Item, teamStats: TeamStats, species: Species, moves: Move[], ability: string): number {
		let weight;
		switch (item.id) {
		// Choice Items
		case 'choiceband':
			return moves.every(x => x.category === 'Physical') ? 50 : 0;
		case 'choicespecs':
			return moves.every(x => x.category === 'Special') ? 50 : 0;
		case 'choicescarf':
			if (moves.some(x => x.category === 'Status')) return 0;
			if (species.baseStats.spe > 65 && species.baseStats.spe < 120) return 50;
			return 10;

		// Generally Decent Items
		case 'lifeorb':
			return moves.filter(x => x.category !== 'Status').length * 8;
		case 'focussash':
			if (ability === 'Sturdy') return 0;
			// frail
			if (species.baseStats.hp < 80 && species.baseStats.def < 80 && species.baseStats.spd < 80) return 35;
			return 10;
		case 'heavydutyboots':
			switch (this.dex.getEffectiveness('Rock', species)) {
			case 1: return 30; // super effective
			case 0: return 10; // neutral
			}
			return 5; // not very effective/other
		case 'assaultvest':
			if (moves.some(x => x.category === 'Status')) return 0;
			return 30;

		// status
		case 'flameorb':
			weight = ability === 'Guts' && !species.types.includes('Fire') ? 30 : 0;
			if (moves.some(m => m.id === 'facade')) weight *= 2;
			return weight;
		case 'toxicorb':
			if (species.types.includes('Poison')) return 0;

			weight = 0;
			if (ability === 'Poison Heal') weight += 25;
			if (moves.some(m => m.id === 'facade')) weight += 25;

			return weight;

		// Healing
		case 'leftovers':
			return 20;
		case 'blacksludge':
			return species.types.includes('Poison') ? 40 : 0;

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
		if (levelOverride[species.id]) return levelOverride[species.id];

		switch (species.tier) {
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
		options?: {remove?: boolean}
	) {
		if (!choices.length) throw new Error(`Can't pick from an empty list`);
		if (choices.length !== weights.length) throw new Error(`Choices and weights must be the same length`);

		const totalWeight = weights.reduce((a, b) => a + b, 0);

		let randomWeight = this.prng.next(0, totalWeight);
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
		this.prng.seed = seed;
	}
}
