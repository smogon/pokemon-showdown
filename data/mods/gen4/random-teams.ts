import RandomGen5Teams from '../gen5/random-teams';
import {Utils} from '../../../lib';
import {PRNG} from '../../../sim';
import type {MoveCounter} from '../gen8/random-teams';

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'slackoff', 'softboiled', 'synthesis',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'curse', 'dragondance', 'howl', 'meditate', 'screech', 'swordsdance',
];
// Conglomerate for ease of access
const SETUP = [
	'acidarmor', 'agility', 'bellydrum', 'bulkup', 'calmmind', 'curse', 'dragondance', 'growth', 'howl', 'irondefense',
	'meditate', 'nastyplot', 'raindance', 'rockpolish', 'sunnyday', 'swordsdance', 'tailglow',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'aquajet', 'bulletpunch', 'chatter', 'eruption', 'explosion', 'fakeout', 'focuspunch', 'futuresight', 'iceshard',
	'icywind', 'knockoff', 'machpunch', 'pluck', 'pursuit', 'quickattack', 'rapidspin', 'reversal', 'selfdestruct',
	'shadowsneak', 'skyattack', 'suckerpunch', 'uturn', 'vacuumwave', 'waterspout',
];
// Hazard-setting moves
const HAZARDS = [
	'spikes', 'stealthrock', 'toxicspikes',
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['lightscreen', 'reflect'],
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	['leechseed', 'substitute'],
	['focuspunch', 'substitute'],
	['raindance', 'rest'],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	'cacturne', 'dusknoir', 'honchkrow', 'mamoswine', 'scizor', 'shedinja', 'shiftry',
];

export class RandomGen4Teams extends RandomGen5Teams {
	randomSets: {[species: string]: RandomTeamsTypes.RandomSpeciesData} = require('./random-sets.json');

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.noStab = NO_STAB;
		this.priorityPokemon = PRIORITY_POKEMON;

		this.moveEnforcementCheckers = {
			Bug: (movePool, moves, abilities, types, counter) => (
				!counter.get('Bug') && (movePool.includes('megahorn') || abilities.has('Tinted Lens'))
			),
			Dark: (movePool, moves, abilities, types, counter) => !counter.get('Dark'),
			Dragon: (movePool, moves, abilities, types, counter) => !counter.get('Dragon'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting'),
			Fire: (movePool, moves, abilities, types, counter) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter, species) => (!counter.get('Flying') && species.id !== 'mantine'),
			Ghost: (movePool, moves, abilities, types, counter) => !counter.get('Ghost'),
			Grass: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Grass') &&
				(species.baseStats.atk >= 100 || movePool.includes('leafstorm') || movePool.includes('solarbeam'))
			),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => !counter.get('Ice'),
			Poison: (movePool, moves, abilities, types, counter) => (!counter.get('Poison') && types.has('Grass')),
			Psychic: (movePool, moves, abilities, types, counter) => (
				!counter.get('Psychic') && (types.has('Fighting') || movePool.includes('calmmind'))
			),
			Rock: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Rock') && (species.baseStats.atk >= 95 || abilities.has('Rock Head'))
			),
			Steel: (movePool, moves, abilities, types, counter, species) => (!counter.get('Steel') && species.id === 'metagross'),
			Water: (movePool, moves, abilities, types, counter) => !counter.get('Water'),
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
		if (teamDetails.screens && movePool.length >= this.maxMoveCount + 2) {
			if (movePool.includes('reflect')) this.fastPop(movePool, movePool.indexOf('reflect'));
			if (movePool.includes('lightscreen')) this.fastPop(movePool, movePool.indexOf('lightscreen'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stealthRock) {
			if (movePool.includes('stealthrock')) this.fastPop(movePool, movePool.indexOf('stealthrock'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.toxicSpikes) {
			if (movePool.includes('toxicspikes')) this.fastPop(movePool, movePool.indexOf('toxicspikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.spikes && teamDetails.spikes >= 2) {
			if (movePool.includes('spikes')) this.fastPop(movePool, movePool.indexOf('spikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		// Develop additional move lists
		const badWithSetup = ['healbell', 'pursuit', 'toxic'];
		const statusMoves = this.dex.moves.all()
			.filter(move => move.category === 'Status')
			.map(move => move.id);

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, ['healingwish', 'switcheroo', 'trick']],
			[SETUP, 'uturn'],
			[SETUP, HAZARDS],
			[SETUP, badWithSetup],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[['fakeout', 'uturn'], ['switcheroo', 'trick']],
			['substitute', 'uturn'],
			['rest', 'substitute'],
			['explosion', ['destinybond', 'painsplit', 'rest', 'trick']],

			// These attacks are redundant with each other
			['surf', 'hydropump'],
			[['bodyslam', 'return'], ['bodyslam', 'doubleedge']],
			[['energyball', 'leafstorm'], ['leafblade', 'leafstorm', 'powerwhip']],
			['lavaplume', 'fireblast'],
			['closecombat', 'drainpunch'],
			['discharge', 'thunderbolt'],
			['gunkshot', 'poisonjab'],
			['payback', 'pursuit'],
			['protect', 'swordsdance'],

			// Assorted hardcodes go here:
			// Manectric
			['flamethrower', 'overheat'],
			// Walrein
			['encore', 'roar'],
			// Smeargle
			['explosion', 'whirlwind'],
			// Seviper
			['switcheroo', 'suckerpunch'],
			// Jirachi
			['bodyslam', 'healingwish'],
			// Blaziken
			['agility', 'vacuumwave'],
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

		// Enforce Facade if Guts is a possible ability
		if (movePool.includes('facade') && abilities.has('Guts')) {
			counter = this.addMove('facade', moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role);
		}

		// Enforce Seismic Toss, Spore, and Volt Tackle
		for (const moveid of ['seismictoss', 'spore', 'volttackle']) {
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

		// Enforce hazard removal on Bulky Support and Spinner if the team doesn't already have it
		if (['Bulky Support', 'Spinner'].includes(role) && !teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) {
				counter = this.addMove('rapidspin', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce STAB priority
		if (['Bulky Attacker', 'Bulky Setup'].includes(role) || this.priorityPokemon.includes(species.id)) {
			const priorityMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (types.includes(moveType) && move.priority > 0 && (move.basePower || move.basePowerCallback)) {
					priorityMoves.push(moveid);
				}
			}
			if (priorityMoves.length) {
				const moveid = this.sample(priorityMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
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

		// Enforce Preferred Type
		if (!counter.get('preferred')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && preferredType === moveType) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
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
			} else {
				// If they have no regular STAB move, enforce U-turn on Bug types.
				if (movePool.includes('uturn') && types.includes('Bug')) {
					counter = this.addMove('uturn', moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Enforce recovery
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup', 'Spinner', 'Staller'].includes(role)) {
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
		if (role.includes('Setup')) {
			const setupMoves = movePool.filter(moveid => SETUP.includes(moveid));
			if (setupMoves.length) {
				const moveid = this.sample(setupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size && !(moves.has('uturn') && types.includes('Bug'))) {
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
		if (['Fast Attacker', 'Setup Sweeper', 'Bulky Attacker', 'Wallbreaker'].includes(role)) {
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
	): boolean {
		switch (ability) {
		case 'Hustle': case 'Ice Body': case 'Rain Dish': case 'Sand Veil': case 'Sniper': case 'Snow Cloak':
		case 'Solar Power': case 'Steadfast': case 'Sticky Hold': case 'Unaware':
			return true;
		case 'Chlorophyll':
			return !moves.has('sunnyday') && !teamDetails.sun;
		case 'Guts':
			return !moves.has('facade') && species.id !== 'heracross';
		case 'Hydration': case 'Swift Swim':
			return (
				!moves.has('raindance') && !teamDetails.rain ||
				!moves.has('raindance') && ['Rock Head', 'Water Absorb'].some(abil => abilities.has(abil))
			);
		case 'Reckless': case 'Rock Head':
			return !counter.get('recoil');
		case 'Shed Skin':
			return !moves.has('rest');
		case 'Skill Link':
			return !counter.get('skilllink');
		case 'Swarm':
			return !counter.get('Bug') && !moves.has('uturn');
		case 'Technician':
			return !counter.get('technician');
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
		if (species.id === 'jynx') return 'Forewarn';
		if (species.id === 'arcanine') return 'Intimidate';
		if (species.id === 'blissey') return 'Natural Cure';
		if (species.id === 'octillery') return 'Sniper';
		if (species.id === 'yanmega') return (role === 'Fast Attacker') ? 'Speed Boost' : 'Tinted Lens';
		if (species.id === 'absol') return 'Super Luck';
		if (species.id === 'lanturn') return 'Volt Absorb';

		if (abilities.has('Guts') && !abilities.has('Quick Feet') && moves.has('facade')) return 'Guts';
		if (abilities.has('Hydration') && moves.has('raindance') && moves.has('rest')) return 'Hydration';

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

	getPriorityItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string | undefined {
		if (species.requiredItems) return this.sample(species.requiredItems);
		if (species.id === 'latias' || species.id === 'latios') return 'Soul Dew';
		if (species.id === 'marowak') return 'Thick Club';
		if (species.id === 'pikachu') return 'Light Ball';
		if (species.id === 'shedinja' || species.id === 'smeargle') return 'Focus Sash';
		if (species.id === 'unown') return 'Choice Specs';
		if (species.id === 'wobbuffet') return 'Custap Berry';
		if (species.id === 'ditto' || (species.id === 'rampardos' && role === 'Fast Attacker')) return 'Choice Scarf';
		if (ability === 'Poison Heal' || moves.has('facade')) return 'Toxic Orb';
		if (ability === 'Speed Boost' && species.id === 'yanmega') return 'Life Orb';
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && role !== 'Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (moves.has('bellydrum')) return 'Sitrus Berry';
		if (moves.has('waterspout')) return 'Choice Scarf';
		if (ability === 'Magic Guard') return 'Life Orb';
		if (moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (moves.has('rest') && !moves.has('sleeptalk') && !['Natural Cure', 'Shed Skin'].includes(ability)) {
			return (moves.has('raindance') && ability === 'Hydration') ? 'Damp Rock' : 'Chesto Berry';
		}
		if (ability === 'Unburden') return 'Sitrus Berry';
		if (role === 'Staller') return 'Leftovers';
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
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		const scarfReqs = (
			role !== 'Wallbreaker' &&
			species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
			!counter.get('priority') && !moves.has('pursuit')
		);

		if (
			moves.has('pursuit') && moves.has('suckerpunch') && counter.get('Dark') &&
			(!this.priorityPokemon.includes(species.id) || counter.get('Dark') >= 2)
		) return 'Black Glasses';
		if (counter.get('Special') === 4) {
			return (
				scarfReqs && species.baseStats.spa >= 90 && this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			counter.get('Special') === 3 && role === 'Fast Attacker' && (moves.has('explosion') || moves.has('selfdestruct'))
		) return 'Choice Scarf';
		if (counter.get('Special') === 3 && moves.has('uturn')) return 'Choice Specs';
		if (counter.get('Physical') === 4 && species.id !== 'jirachi' &&
			['fakeout', 'rapidspin'].every(m => !moves.has(m))
		) {
			return (
				scarfReqs && (species.baseStats.atk >= 100 || ability === 'Pure Power' || ability === 'Huge Power') &&
				this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Band';
		}

		if (types.includes('Normal') && moves.has('fakeout') && !!counter.get('Normal')) return 'Silk Scarf';
		if (species.id === 'palkia') return 'Lustrous Orb';
		if (species.id === 'farfetchd') return 'Stick';
		if (moves.has('outrage') && counter.get('setup') && !moves.has('sleeptalk')) return 'Lum Berry';
		if (['batonpass', 'protect', 'substitute'].some(m => moves.has(m))) return 'Leftovers';
		if (
			role === 'Fast Support' && isLead && defensiveStatTotal < 255 && !counter.get('recovery') &&
			(!counter.get('recoil') || ability === 'Rock Head') &&
			(counter.get('hazards') || !moves.has('uturn'))
		) return 'Focus Sash';

		// Default Items
		if (role === 'Fast Support') {
			return (
				counter.get('Physical') + counter.get('Special') >= 3 &&
				['rapidspin', 'uturn'].every(m => !moves.has(m)) &&
				this.dex.getEffectiveness('Rock', species) < 2
			) ? 'Life Orb' : 'Leftovers';
		}
		// noStab moves that should reject Expert Belt
		const noExpertBeltMoves = this.noStab.filter(
			moveid => ['Dragon', 'Normal', 'Poison'].includes(this.dex.moves.get(moveid).type)
		);
		const expertBeltReqs = (
			!counter.get('Dragon') && !counter.get('Normal') && !counter.get('Poison') &&
			noExpertBeltMoves.every(m => !moves.has(m))
		);
		if (!counter.get('Status') && expertBeltReqs && (moves.has('uturn') || role === 'Fast Attacker')) return 'Expert Belt';
		if (
			['Fast Attacker', 'Setup Sweeper', 'Wallbreaker'].some(m => role === m) &&
			this.dex.getEffectiveness('Rock', species) < 2 && !moves.has('rapidspin')
		) return 'Life Orb';
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
		const possibleSets = [];
		// Check if the Pokemon has a Spinner set
		let canSpinner = false;
		for (const set of sets) {
			if (!teamDetails.rapidSpin && set.role === 'Spinner') canSpinner = true;
		}
		for (const set of sets) {
			// Prevent Spinner if the team already has removal
			if (teamDetails.rapidSpin && set.role === 'Spinner') continue;
			// Enforce Spinner if the team does not have removal
			if (canSpinner && set.role !== 'Spinner') continue;
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = Array.from(set.movepool);
		const preferredTypes = set.preferredTypes;
		const preferredType = this.sampleIfArray(preferredTypes) || '';

		let ability = '';
		let item = undefined;

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		const types = species.types;
		const abilities = new Set(Object.values(species.abilities));
		if (species.unreleasedHidden) abilities.delete(species.abilities.H);

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, movePool,
			preferredType, role);
		const counter = this.newQueryMoves(moves, species, preferredType, abilities);

		// Get ability
		ability = this.getAbility(new Set(types), moves, abilities, counter, movePool, teamDetails, species,
			preferredType, role);

		// Get items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
		if (item === undefined) {
			item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && types.includes('Poison')) {
			item = 'Black Sludge';
		}

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
		const srImmunity = ability === 'Magic Guard';
		const srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (moves.has('substitute') && item === 'Sitrus Berry') {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if (moves.has('bellydrum') && item === 'Sitrus Berry') {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || ['Black Sludge', 'Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter.get('Physical') && !moves.has('transform')) {
			evs.atk = 0;
			ivs.atk = hasHiddenPower ? (ivs.atk || 31) - 28 : 0;
		}

		if (['gyroball', 'metalburst', 'trickroom'].some(m => moves.has(m))) {
			evs.spe = 0;
			ivs.spe = hasHiddenPower ? (ivs.spe || 31) - 28 : 0;
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
}

export default RandomGen4Teams;
