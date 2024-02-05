import RandomGen4Teams from '../gen4/random-teams';
import {Utils} from '../../../lib';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import type {MoveCounter} from '../gen8/random-teams';

// Moves that restore HP:
const RECOVERY_MOVES = [
	'milkdrink', 'moonlight', 'morningsun', 'recover', 'slackoff', 'softboiled', 'synthesis',
];
// Conglomerate for ease of access
const SETUP = [
	'acidarmor', 'agility', 'bellydrum', 'bulkup', 'calmmind', 'curse', 'dragondance', 'growth', 'howl', 'irondefense',
	'meditate', 'raindance', 'sunnyday', 'swordsdance', 'tailglow',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'eruption', 'explosion', 'fakeout', 'focuspunch', 'futuresight', 'icywind', 'knockoff', 'machpunch', 'pursuit',
	'quickattack', 'rapidspin', 'selfdestruct', 'skyattack', 'waterspout',
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	['leechseed', 'substitute'],
	['focuspunch', 'substitute'],
	['batonpass', 'spiderweb'],
];

export class RandomGen3Teams extends RandomGen4Teams {
	battleHasDitto: boolean;
	battleHasWobbuffet: boolean;

	randomSets: {[species: string]: RandomTeamsTypes.RandomSpeciesData} = require('./random-sets.json');

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.noStab = NO_STAB;
		this.battleHasDitto = false;
		this.battleHasWobbuffet = false;
		this.moveEnforcementCheckers = {
			Bug: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Bug') && ['armaldo', 'heracross', 'parasect'].includes(species.id)
			),
			Dark: (movePool, moves, abilities, types, counter) => !counter.get('Dark'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting'),
			Fire: (movePool, moves, abilities, types, counter) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter, species) => (!counter.get('Flying') && species.id !== 'crobat'),
			Ghost: (movePool, moves, abilities, types, counter) => !counter.get('Ghost'),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => !counter.get('Ice'),
			Normal: (movePool, moves, abilities, types, counter, species) => !counter.get('Normal'),
			Poison: (movePool, moves, abilities, types, counter) => !counter.get('Poison') && !counter.get('Bug'),
			Psychic: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Psychic') && species.baseStats.spa >= 100
			),
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock'),
			Steel: (movePool, moves, abilities, types, counter, species) => (!counter.get('Steel') && species.id !== 'forretress'),
			Water: (movePool, moves, abilities, types, counter, species) => !counter.get('Water'),
		};
	}

	cullMovePool(
		types: string[],
		moves: Set<string>,
		abilities: Set<string>,
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
		if (teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		// Develop additional move lists
		const badWithSetup = ['knockoff', 'rapidspin', 'toxic'];
		const statusMoves = this.dex.moves.all()
			.filter(move => move.category === 'Status')
			.map(move => move.id);

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, 'trick'],
			[SETUP, badWithSetup],
			['rest', ['protect', 'substitute']],
			[['selfdestruct', 'explosion'], ['destinybond', 'painsplit', 'rest']],

			// These attacks are redundant with each other
			['surf', 'hydropump'],
			[['bodyslam', 'return'], ['bodyslam', 'doubleedge']],
			['fireblast', 'flamethrower'],

			// Assorted hardcodes go here:
			// Granbull
			['bulkup', 'overheat'],
			// Heracross
			['endure', 'substitute'],
		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		const statusInflictingMoves = ['stunspore', 'thunderwave', 'toxic', 'willowisp', 'yawn'];
		if (role !== 'Staller') {
			this.incompatibleMoves(moves, movePool, statusInflictingMoves, statusInflictingMoves);
		}
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

		// Enforce Seismic Toss and Spore
		for (const moveid of ['seismictoss', 'spore']) {
			if (movePool.includes(moveid)) {
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Substitute on non-Setup sets with Baton Pass
		if (!role.includes('Setup')) {
			if (movePool.includes('batonpass') && movePool.includes('substitute')) {
				counter = this.addMove('substitute', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
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
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup', 'Staller'].includes(role)) {
			const recoveryMoves = movePool.filter(moveid => RECOVERY_MOVES.includes(moveid));
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Staller moves
		if (role === 'Staller') {
			const enforcedMoves = ['protect', 'toxic', 'wish'];
			for (const move of enforcedMoves) {
				if (movePool.includes(move)) {
					counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Enforce setup
		if (role.includes('Setup') || role === 'Berry Sweeper') {
			const setupMoves = movePool.filter(moveid => SETUP.includes(moveid));
			if (setupMoves.length) {
				const moveid = this.sample(setupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Berry Sweeper moves
		if (role === 'Berry Sweeper') {
			// Enforce Flail/Reversal
			for (const move of ['flail', 'reversal']) {
				if (movePool.includes(move)) {
					counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
			// Enforce one of Endure and Substitute, but not both
			const hpControlMoves = [];
			for (const moveid of movePool) {
				if (['endure', 'substitute'].includes(moveid)) hpControlMoves.push(moveid);
			}
			if (hpControlMoves.length) {
				const moveid = this.sample(hpControlMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size) {
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
		if (['Fast Attacker', 'Setup Sweeper', 'Bulky Attacker', 'Wallbreaker', 'Berry Sweeper'].includes(role)) {
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

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		preferredType: string,
		role: RandomTeamsTypes.Role
	) {
		switch (ability) {
		case 'Rain Dish': case 'Sand Veil': case 'Soundproof': case 'Sticky Hold':
			return true;
		case 'Chlorophyll':
			return !moves.has('sunnyday') && !teamDetails.sun;
		case 'Hustle':
			return !counter.get('Physical');
		case 'Rock Head':
			return !counter.get('recoil');
		case 'Swarm':
			return !counter.get('Bug');
		case 'Swift Swim':
			return (
				// Relicanth always wants Swift Swim if it doesn't have Double-Edge
				!moves.has('raindance') && !teamDetails.rain && !(species.id === 'relicanth' && !counter.get('recoil')) ||
				!moves.has('raindance') && abilities.has('Water Absorb')
			);
		case 'Thick Fat':
			return (species.id === 'snorlax' || (species.id === 'hariyama' && moves.has('sleeptalk')));
		case 'Water Absorb':
			return (species.id === 'mantine' && moves.has('raindance'));
		}

		return false;
	}


	getAbility(
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const abilityData = Array.from(abilities).map(a => this.dex.abilities.get(a));
		Utils.sortBy(abilityData, abil => -abil.rating);

		if (abilityData.length <= 1) return abilityData[0].name;

		// Hard-code abilities here
		if (species.id === 'yanma' && counter.get('inaccurate')) return 'Compound Eyes';
		if (species.id === 'arcanine') return 'Intimidate';
		if (species.id === 'blissey') return 'Natural Cure';
		if (species.id === 'heracross' && role === 'Berry Sweeper') return 'Swarm';
		if (species.id === 'gardevoir') return 'Trace';

		let abilityAllowed: Ability[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilityData) {
			if (ability.rating >= 1 && !this.shouldCullAbility(
				ability.name, types, moves, abilities, counter, movePool, teamDetails, species, preferredType, role
			)) {
				abilityAllowed.push(ability);
			}
		}

		// If all abilities are rejected, re-allow all abilities
		if (!abilityAllowed.length) {
			for (const ability of abilityData) {
				if (ability.rating > 0) abilityAllowed.push(ability);
			}
			if (!abilityAllowed.length) abilityAllowed = abilityData;
		}

		if (abilityAllowed.length === 1) return abilityAllowed[0].name;
		// Sort abilities by rating with an element of randomness
		if (abilityAllowed[0].rating <= abilityAllowed[1].rating) {
			if (this.randomChance(1, 2)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
		} else if (abilityAllowed[0].rating - 0.5 <= abilityAllowed[1].rating) {
			if (this.randomChance(1, 3)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
		}

		// After sorting, choose the first ability
		return abilityAllowed[0].name;
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
		if (species.id === 'farfetchd') return 'Stick';
		if (species.id === 'latias' || species.id === 'latios') return 'Soul Dew';
		if (species.id === 'linoone' && role === 'Setup Sweeper') return 'Silk Scarf';
		if (species.id === 'marowak') return 'Thick Club';
		if (species.id === 'pikachu') return 'Light Ball';
		if (species.id === 'shedinja') return 'Lum Berry';
		if (species.id === 'unown') return counter.get('Physical') ? 'Choice Band' : 'Twisted Spoon';

		if (moves.has('trick')) return 'Choice Band';
		if (
			moves.has('rest') && !moves.has('sleeptalk') &&
			// Altaria wants Chesto Berry on Dragon Dance + Rest
			(moves.has('dragondance') || !['Early Bird', 'Natural Cure', 'Shed Skin'].includes(ability))
		) return 'Chesto Berry';

		// Medium priority items
		if (counter.get('Physical') >= 4) return 'Choice Band';
		if (counter.get('Physical') >= 3 && (moves.has('batonpass') || (role === 'Wallbreaker' && counter.get('Special')))) {
			return 'Choice Band';
		}

		if (
			moves.has('dragondance') && ability !== 'Natural Cure' &&
			!moves.has('healbell') && !moves.has('substitute')
		) return 'Lum Berry';
		if (moves.has('bellydrum')) return moves.has('substitute') ? 'Salac Berry' : 'Lum Berry';

		if (moves.has('raindance') && counter.get('Special') >= 3) return 'Petaya Berry';

		if (role === 'Berry Sweeper') {
			if (moves.has('endure')) return 'Salac Berry';
			if (moves.has('flail') || moves.has('reversal')) return (species.baseStats.spe >= 90) ? 'Liechi Berry' : 'Salac Berry';
			if (moves.has('substitute') && counter.get('Physical') >= 3) return 'Liechi Berry';
			if (moves.has('substitute') && counter.get('Special') >= 3) return 'Petaya Berry';
		}

		const salacReqs = species.baseStats.spe >= 60 && species.baseStats.spe <= 100 && !counter.get('priority');

		if (moves.has('bulkup') && moves.has('substitute') && counter.get('Status') === 2 && salacReqs) return 'Salac Berry';

		if (moves.has('swordsdance') && moves.has('substitute') && counter.get('Status') === 2) {
			if (salacReqs) return 'Salac Berry';
			if (species.baseStats.spe > 100 && counter.get('Physical') >= 2) return 'Liechi Berry';
		}

		if (moves.has('swordsdance') && counter.get('Status') === 1) {
			if (salacReqs) return 'Salac Berry';
			if (species.baseStats.spe > 100) {
				return (counter.get('Physical') >= 3 && this.randomChance(1, 2)) ? 'Liechi Berry' : 'Lum Berry';
			}
		}

		if (species.id === 'deoxys' || species.id === 'deoxysattack') return 'White Herb';

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
		// In Gen 3, if a set has multiple preferred types, enforce all of them.
		const preferredType = preferredTypes ? preferredTypes.join() : '';

		let ability = '';
		let item = undefined;

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		const types = species.types;
		const abilities = new Set(Object.values(species.abilities));

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, movePool,
			preferredType, role);
		const counter = this.newQueryMoves(moves, species, preferredType, abilities);

		// Get ability
		ability = this.getAbility(new Set(types), moves, abilities, counter, movePool, teamDetails, species,
			preferredType, role);

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
			const HPivs = this.dex.types.get(hpType).HPivs;
			let iv: StatID;
			for (iv in HPivs) {
				ivs[iv] = HPivs[iv]!;
			}
		}

		// Prepare optimal HP
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (moves.has('substitute') && ['flail', 'reversal'].some(m => moves.has(m))) {
				// Flail/Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (moves.has('substitute') && (item === 'Salac Berry' || item === 'Petaya Berry' || item === 'Liechi Berry')) {
				// Other pinch berry holders should have berries activate after three Substitutes
				if (hp % 4 === 0) break;
			} else if (moves.has('bellydrum')) {
				// Belly Drum users should be able to use Belly Drum twice
				if (hp % 2 > 0) break;
			} else {
				break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter.get('Physical') && !moves.has('transform')) {
			evs.atk = 0;
			ivs.atk = hasHiddenPower ? (ivs.atk || 31) - 28 : 0;
		}

		// Prepare optimal HP
		let hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
		if (moves.has('substitute') && ['endeavor', 'flail', 'reversal'].some(m => moves.has(m))) {
			// Endeavor/Flail/Reversal users should be able to use four Substitutes
			if (hp % 4 === 0) evs.hp -= 4;
		} else if (moves.has('substitute') && (item === 'Salac Berry' || item === 'Petaya Berry' || item === 'Liechi Berry')) {
			// Other pinch berry holders should have berries activate after three Substitutes
			while (hp % 4 > 0) {
				evs.hp -= 4;
				hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			}
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 1024),
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			role,
		};
	}

	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.seed;
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		const baseFormes: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeWeaknesses: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let numMaxLevelPokemon = 0;

		const pokemonList = (this.gen === 3) ? Object.keys(this.randomSets) : Object.keys(this.randomData);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			const species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Limit to one Wobbuffet per battle (not just per team)
			if (species.name === 'Wobbuffet' && this.battleHasWobbuffet) continue;
			// Limit to one Ditto per battle in Gen 2
			if (this.dex.gen < 3 && species.name === 'Ditto' && this.battleHasDitto) continue;

			const types = species.types;

			if (!isMonotype && !this.forceMonotype) {
				// Dynamically scale limits for different team sizes. The default and minimum value is 1.
				const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

				// Limit two of any type
				let skip = false;
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Limit one level 100 Pokemon
				if (!this.adjustLevel && (this.getLevel(species) === 100) && numMaxLevelPokemon >= limitFactor) {
					continue;
				}
			}

			// Okay, the set passes, add it to our team
			const set = this.randomSet(species, teamDetails);
			pokemon.push(set);

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}

			// Increment weakness counter
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					typeWeaknesses[typeName]++;
				}
			}

			// Increment level 100 counter
			if (set.level === 100) numMaxLevelPokemon++;

			// Update team details
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.moves.includes('sunnyday')) teamDetails.sun = 1;
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.moves.includes('spikes')) teamDetails.spikes = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;

			// In Gen 3, Shadow Tag users can prevent each other from switching out, possibly causing and endless battle or at least causing a long stall war
			// To prevent this, we prevent more than one Wobbuffet in a single battle.
			if (species.id === 'wobbuffet') this.battleHasWobbuffet = true;
			if (species.id === 'ditto') this.battleHasDitto = true;
		}

		if (pokemon.length < this.maxTeamSize && !isMonotype && !this.forceMonotype && pokemon.length < 12) {
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}
}

export default RandomGen3Teams;
