import RandomGen3Teams from '../gen3/random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import type {MoveCounter} from '../gen8/random-teams';

// Moves that restore HP:
const RECOVERY_MOVES = [
	'milkdrink', 'moonlight', 'morningsun', 'painsplit', 'recover', 'softboiled', 'synthesis',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'curse', 'meditate', 'swordsdance',
];
// Conglomerate for ease of access
const SETUP = [
	'agility', 'bellydrum', 'curse', 'growth', 'meditate', 'raindance', 'sunnyday', 'swordsdance',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'explosion', 'icywind', 'machpunch', 'pursuit', 'quickattack', 'rapidspin', 'selfdestruct', 'skyattack', 'thief',
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['sleeptalk', 'rest'],
	['meanlook', 'perishsong'],
];

export class RandomGen2Teams extends RandomGen3Teams {
	randomSets: {[species: string]: RandomTeamsTypes.RandomSpeciesData} = require('./random-sets.json');

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.noStab = NO_STAB;
		this.moveEnforcementCheckers = {
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fire: (movePool, moves, abilities, types, counter) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Flying') && ['gligar', 'murkrow', 'xatu'].includes(species.id)
			),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => !counter.get('Ice'),
			Normal: (movePool, moves, abilities, types, counter) => !counter.get('Normal'),
			Poison: (movePool, moves, abilities, types, counter) => !counter.get('Poison'),
			Psychic: (movePool, moves, abilities, types, counter, species) => !counter.get('Psychic') && species.id !== 'starmie',
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.id !== 'magcargo',
			Water: (movePool, moves, abilities, types, counter) => !counter.get('Water'),
		};
	}

	cullMovePool(
		types: string[],
		moves: Set<string>,
		abilities = {},
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): void {
		// Pokemon cannot have multiple Hidden Powers in any circumstance
		let hasHiddenPower = false;
		for (const move of moves) {
			if (move.startsWith('hiddenpower')) hasHiddenPower = true;
		}
		if (hasHiddenPower) {
			let movePoolHasHiddenPower = true;
			while (movePoolHasHiddenPower) {
				movePoolHasHiddenPower = false;
				for (const moveid of movePool) {
					if (moveid.startsWith('hiddenpower')) {
						this.fastPop(movePool, movePool.indexOf(moveid));
						movePoolHasHiddenPower = true;
						break;
					}
				}
			}
		}

		if (moves.size + movePool.length <= this.maxMoveCount) return;
		// If we have two unfilled moves and only one unpaired move, cull the unpaired move.
		if (moves.size === this.maxMoveCount - 2) {
			const unpairedMoves = [...movePool];
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
				}
			}
			if (unpairedMoves.length === 1) {
				this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
			}
		}

		// These moves are paired, and shouldn't appear if there is not room for them both.
		if (moves.size === this.maxMoveCount - 1) {
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(movePool, movePool.indexOf(pair[0]));
					this.fastPop(movePool, movePool.indexOf(pair[1]));
				}
			}
		}

		// Team-based move culls
		if (teamDetails.spikes) {
			if (movePool.includes('spikes')) this.fastPop(movePool, movePool.indexOf('spikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[SETUP, 'haze'],
			['bodyslam', 'thunderwave'],
			[['stunspore', 'thunderwave'], 'toxic'],

			// These attacks are redundant with each other
			['surf', 'hydropump'],
			[['bodyslam', 'return'], ['bodyslam', 'doubleedge']],
			['fireblast', 'flamethrower'],
			['thunder', 'thunderbolt'],
		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		if (!role.includes('Bulky')) this.incompatibleMoves(moves, movePool, ['rest', 'sleeptalk'], 'roar');
	}

	// Generate random moveset for a given species, role, preferred type.
	randomMoveset(
		types: string[],
		abilities: Set<string>,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		movePool: string[],
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): Set<string> {
		const preferredTypes = preferredType ? preferredType.split(',') : [];
		const moves = new Set<string>();
		let counter = this.newQueryMoves(moves, species, preferredType, abilities);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead,
			preferredType, role);

		// If there are only four moves, add all moves and return early
		if (movePool.length <= this.maxMoveCount) {
			// Still need to ensure that multiple Hidden Powers are not added (if maxMoveCount is increased)
			while (movePool.length) {
				const moveid = this.sample(movePool);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
			return moves;
		}

		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool, moves, abilities, new Set(types), counter, species, teamDetails
			);
		};

		// Add required move (e.g. Relic Song for Meloetta-P)
		if (species.requiredMove) {
			const move = this.dex.moves.get(species.requiredMove).id;
			counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role);
		}

		// Add other moves you really want to have, e.g. STAB, recovery, setup.

		// Enforce Destiny Bond, Explosion, Present, Spikes and Spore
		for (const moveid of ['destinybond', 'explosion', 'present', 'spikes', 'spore']) {
			if (movePool.includes(moveid)) {
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Baton Pass on Smeargle
		if (movePool.includes('batonpass') && species.id === 'smeargle') {
			counter = this.addMove('batonpass', moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role);
		}

		// Enforce moves of all Preferred Types
		for (const type of preferredTypes) {
			if (!counter.get(type)) {
				const stabMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(move, species, abilities, preferredType);
					if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
						stabMoves.push(moveid);
					}
				}
				if (stabMoves.length) {
					const moveid = this.sample(stabMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Check if a STAB move of that type should be required
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// If no STAB move was added, add a STAB move
		if (!counter.get('stab')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.includes(moveType)) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce recovery
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup'].includes(role)) {
			const recoveryMoves = movePool.filter(moveid => RECOVERY_MOVES.includes(moveid));
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
			// Rest/Sleep Talk count as recovery in Gen 2
			if (movePool.includes('rest')) {
				counter = this.addMove('rest', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
			if (movePool.includes('sleeptalk')) {
				counter = this.addMove('sleeptalk', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce setup
		if (role.includes('Setup')) {
			// First, try to add a non-Speed setup move
			const nonSpeedSetupMoves = movePool.filter(moveid => SETUP.includes(moveid) && moveid !== 'agility');
			if (nonSpeedSetupMoves.length) {
				const moveid = this.sample(nonSpeedSetupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			} else {
				if (movePool.includes('agility')) {
					counter = this.addMove('agility', moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Enforce Thief
		if (role === 'Thief user') {
			if (movePool.includes('thief')) {
				counter = this.addMove('thief', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size && !moves.has('present')) {
			// Choose an attacking move
			const attackingMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				if (!this.noStab.includes(moveid) && (move.category !== 'Status')) attackingMoves.push(moveid);
			}
			if (attackingMoves.length) {
				const moveid = this.sample(attackingMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce coverage move
		if (['Fast Attacker', 'Setup Sweeper', 'Bulky Attacker'].includes(role)) {
			if (counter.damagingMoves.size === 1) {
				// Find the type of the current attacking move
				const currentAttackType = counter.damagingMoves.values().next().value.type;
				// Choose an attacking move that is of different type to the current single attack
				const coverageMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(move, species, abilities, preferredType);
					if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
						if (currentAttackType !== moveType) coverageMoves.push(moveid);
					}
				}
				if (coverageMoves.length) {
					const moveid = this.sample(coverageMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Choose remaining moves randomly from movepool and add them to moves list:
		while (moves.size < this.maxMoveCount && movePool.length) {
			const moveid = this.sample(movePool);
			counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role);
			for (const pair of MOVE_PAIRS) {
				if (moveid === pair[0] && movePool.includes(pair[1])) {
					counter = this.addMove(pair[1], moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
				if (moveid === pair[1] && movePool.includes(pair[0])) {
					counter = this.addMove(pair[0], moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}
		return moves;
	}

	getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string {
		// First, the high-priority items
		if (species.id === 'ditto') return 'Metal Powder';
		if (species.id === 'farfetchd') return 'Stick';
		if (species.id === 'marowak') return 'Thick Club';
		if (species.id === 'pikachu') return 'Light Ball';

		if (moves.has('thief')) return '';

		if (moves.has('flail')) return 'Pink Bow';
		if (moves.has('reversal')) return 'Black Belt';

		if (moves.has('rest') && !moves.has('sleeptalk') && !role.includes('Bulky')) return 'Mint Berry';

		if (moves.has('bellydrum') && !counter.get('recovery') && this.randomChance(1, 2)) return 'Miracle Berry';

		// Default to Leftovers
		return 'Leftovers';
	}

	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false
	): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		const forme = this.getForme(species);
		const sets = this.randomSets[species.id]["sets"];

		const set = this.sampleIfArray(sets);
		const role = set.role;
		const movePool: string[] = Array.from(set.movepool);
		const preferredTypes = set.preferredTypes;
		// In Gen 2, if a set has multiple preferred types, enforce all of them.
		const preferredType = preferredTypes ? preferredTypes.join() : '';

		const ability = '';
		let item = undefined;

		const evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255};
		const ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};

		const types = species.types;
		const abilities = new Set(Object.values(species.abilities));

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, movePool,
			preferredType, role);
		const counter = this.newQueryMoves(moves, species, preferredType, abilities);

		// Get items
		item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);

		const level = this.getLevel(species);

		// We use a special variable to track Hidden Power
		// so that we can check for all Hidden Powers at once
		let hasHiddenPower = false;
		for (const move of moves) {
			if (move.startsWith('hiddenpower')) hasHiddenPower = true;
		}

		if (hasHiddenPower) {
			let hpType;
			for (const move of moves) {
				if (move.startsWith('hiddenpower')) hpType = move.substr(11);
			}
			if (!hpType) throw new Error(`hasHiddenPower is true, but no Hidden Power move was found.`);
			const hpIVs: {[k: string]: Partial<typeof ivs>} = {
				dragon: {def: 28},
				ice: {def: 26},
				psychic: {def: 24},
				electric: {atk: 28},
				grass: {atk: 28, def: 28},
				water: {atk: 28, def: 26},
				fire: {atk: 28, def: 24},
				steel: {atk: 26},
				ghost: {atk: 26, def: 28},
				bug: {atk: 26, def: 26},
				rock: {atk: 26, def: 24},
				ground: {atk: 24},
				poison: {atk: 24, def: 28},
				flying: {atk: 24, def: 26},
				fighting: {atk: 24, def: 24},
			};
			let iv: StatID;
			for (iv in hpIVs[hpType]) {
				ivs[iv] = hpIVs[hpType][iv]!;
			}
			if (ivs.atk === 28 || ivs.atk === 24) ivs.hp = 14;
			if (ivs.def === 28 || ivs.def === 24) ivs.hp -= 8;
		}

		// Prepare optimal HP
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (moves.has('substitute') && item !== 'Leftovers') {
				// Should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (moves.has('bellydrum') && item !== 'Leftovers') {
				// Belly Drum users without Leftovers should reach exactly 50% HP
				if (hp % 2 === 0) break;
			} else {
				break;
			}
			evs.hp -= 4;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);

		return {
			name: species.baseSpecies,
			species: forme,
			level,
			moves: shuffledMoves,
			ability: 'No Ability',
			evs,
			ivs,
			item,
			role,
			// No shiny chance because Gen 2 shinies have bad IVs
			shiny: false,
			gender: species.gender ? species.gender : 'M',
		};
	}
}

export default RandomGen2Teams;
