import type { PRNG, PRNGSeed } from "../../../sim/prng";
import { RandomTeams, type MoveCounter } from "../gen9/teams";

// First, some lists of moves that can be used for rules throughout set generation. Taken from regular gen9.

// Moves that shouldn't be the only STAB moves:
// (bulldoze added)
const NO_STAB = [
	'accelerock', 'aquajet', 'bounce', 'breakingswipe', 'bulldoze', 'bulletpunch', 'chatter', 'chloroblast', 'clearsmog', 'covet',
	'dragontail', 'doomdesire', 'electroweb', 'eruption', 'explosion', 'fakeout', 'feint', 'flamecharge', 'flipturn', 'futuresight',
	'grassyglide', 'iceshard', 'icywind', 'incinerate', 'infestation', 'machpunch', 'meteorbeam', 'mortalspin', 'nuzzle', 'pluck', 'pursuit',
	'quickattack', 'rapidspin', 'reversal', 'selfdestruct', 'shadowsneak', 'skydrop', 'snarl', 'strugglebug', 'suckerpunch', 'thunderclap', 'trailblaze',
	'uturn', 'vacuumwave', 'voltswitch', 'watershuriken', 'waterspout',
];

// Hazard-setting moves
const HAZARDS = [
	'spikes', 'stealthrock', 'stickyweb', 'toxicspikes',
];

// Protect and its variants
const PROTECT_MOVES = [
	'banefulbunker', 'burningbulwark', 'protect', 'silktrap', 'spikyshield',
];

// Moves that switch the user out
const PIVOT_MOVES = [
	'chillyreception', 'flipturn', 'partingshot', 'shedtail', 'teleport', 'uturn', 'voltswitch',
];

// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'poweruppunch', 'swordsdance', 'tidyup', 'victorydance',
];

// Moves which boost Special Attack:
const SPECIAL_SETUP = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow', 'takeheart', 'torchsong',
];

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
];

// Setup (stat-boosting) moves
const SETUP = [
	'acidarmor', 'agility', 'autotomize', 'bellydrum', 'bulkup', 'calmmind', 'clangoroussoul', 'coil', 'cosmicpower', 'curse', 'defensecurl',
	'dragondance', 'flamecharge', 'growth', 'honeclaws', 'howl', 'irondefense', 'meditate', 'nastyplot', 'noretreat', 'poweruppunch',
	'quiverdance', 'raindance', 'rockpolish', 'shellsmash', 'shiftgear', 'snowscape', 'sunnyday', 'swordsdance', 'tailglow', 'tidyup',
	'trailblaze', 'workup', 'victorydance',
];

// Some moves that only boost Speed:
const SPEED_SETUP = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish', 'trailblaze',
];

// Moves that would want to generate together
const MOVE_PAIRS = [
	['lightscreen', 'reflect'],
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	// FFA:
	['protect', 'leechseed'],
	['spikyshield', 'leechseed'],
	['icebeam', 'thunderbolt'],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	'breloom', 'brutebonnet', 'cacturne', 'honchkrow', 'kingambit', 'palafin', 'rillaboom', 'scizor',
];

/** Pokemon who should never be in the lead slot */
const NO_LEAD_POKEMON = [
	'Roaring Moon', 'Zacian', 'Zamazenta',
];

// Specific to FFA
// Spread moves are only enforced as STABs when a non-spread STAB of that type is unavailable
const SPREAD = [
	"Acid", "Air Cutter", "Astral Barrage", "Bleakwind Storm", "Blizzard", "Breaking Swipe", "Brutal Swing",
	"Bulldoze", "Burning Jealousy", "Clanging Scales", "Dazzling Gleam", "Diamond Storm", "Disarming Voice", "Discharge",
	"Dragon Energy", "Earthquake", "Electroweb", "Eruption", "Explosion", "Fiery Wrath", "Glacial Lance", "Glaciate",
	"Heat Wave", "Hyper Voice", "Icy Wind", "Incinerate", "Lava Plume", "Make It Rain", "Matcha Gotcha", "Misty Explosion",
	"Mortal Spin", "Muddy Water", "Origin Pulse", "Overdrive", "Parabolic Charge", "Petal Blizzard", "Powder Snow",
	"Precipice Blades", "Razor Leaf", "Relic Song", "Rock Slide", "Sandsear Storm", "Self-Destruct", "Sludge Wave", "Snarl",
	"Sparkling Aria", "Springtide Storm", "Struggle Bug", "Surf", "Swift", "Twister", "Water Spout", "Wildbolt Storm",
];

export class RandomFFATeams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);

		this.noStab = NO_STAB;

		// Overwrite enforcementcheckers where needed here
		this.moveEnforcementCheckers['Grass'] = (movePool, moves, abilities, types, counter, species) => (
			!counter.get('Grass') && (
				movePool.includes('leafstorm') || species.baseStats.atk >= 100 ||
				types.includes('Electric') || abilities.includes('Seed Sower') ||
				species.id === 'ludicolo'
			)
		);
		this.moveEnforcementCheckers['Steel'] = (movePool, moves, abilities, types, counter, species) => (
			!counter.get('Steel') && !(['Empoleon', 'Magearna', 'Bronzong'].includes(species.baseSpecies))
		);
	}

	override cullMovePool(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): void {
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
		if (teamDetails.screens) {
			if (movePool.includes('auroraveil')) this.fastPop(movePool, movePool.indexOf('auroraveil'));
			if (movePool.length >= this.maxMoveCount + 2) {
				if (movePool.includes('reflect')) this.fastPop(movePool, movePool.indexOf('reflect'));
				if (movePool.includes('lightscreen')) this.fastPop(movePool, movePool.indexOf('lightscreen'));
			}
		}
		if (teamDetails.stickyWeb) {
			if (movePool.includes('stickyweb')) this.fastPop(movePool, movePool.indexOf('stickyweb'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stealthRock) {
			if (movePool.includes('stealthrock')) this.fastPop(movePool, movePool.indexOf('stealthrock'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.defog || teamDetails.rapidSpin) {
			if (movePool.includes('defog')) this.fastPop(movePool, movePool.indexOf('defog'));
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.spikes && teamDetails.spikes >= 2) {
			if (movePool.includes('spikes')) this.fastPop(movePool, movePool.indexOf('spikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.statusCure) {
			if (movePool.includes('healbell')) this.fastPop(movePool, movePool.indexOf('healbell'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			// [statusMoves, ['healingwish', 'switcheroo', 'trick']], // does nothing
			[SETUP, PIVOT_MOVES],

			[SETUP, ['defog', 'haze']],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[SPECIAL_SETUP, SPECIAL_SETUP],
			['substitute', PIVOT_MOVES],
			[SPEED_SETUP, ['aquajet', 'rest', 'trickroom']],
			[['icywind', 'thunderwave', 'futuresight'], 'trickroom'],

			// These attacks are redundant with each other
			[['psychic', 'psychicnoise'], ['psyshock', 'psychicnoise']],
			[['liquidation', 'scald'], ['wavecrash', 'hydropump']],
			[['gigadrain', 'leafstorm'], ['leafstorm', 'energyball']],
			['powerwhip', 'hornleech'],
			['airslash', 'hurricane'],
			['knockoff', ['jawlock', 'foulplay']],
			['throatchop', ['crunch', 'foulplay']],
			['doubleedge', ['bodyslam', 'headbutt']],
			['fireblast', ['fierydance', 'flamethrower']],
			['thunderpunch', 'wildcharge'],
			['thunderbolt', 'thundercage'],
			['gunkshot', 'poisonjab'],
			['aurasphere', 'focusblast'],
			['closecombat', 'drainpunch'],
			[['dragonpulse', 'spacialrend'], 'dracometeor'],
			['alluringvoice', 'dazzlinggleam'],
			['surf', 'muddywater'],
			['nuzzle', 'discharge'],
			['phantomforce', ['poltergeist', 'shadowball']],
			['bugbite', 'pounce'],

			// These status moves are redundant with each other
			['taunt', ['disable', 'encore']],
			['thunderwave', 'willowisp'],
			['lifedew', 'wish'],
			['rest', 'protect'],
			['bulkup', 'irondefense'],

			// This space reserved for assorted hardcodes that otherwise make little sense out of context
			// Chansey and Blissey
			['healbell', 'stealthrock'],
			// Smeargle
			[PROTECT_MOVES, PROTECT_MOVES],
			// Slaking
			['roar', 'slackoff'],
			// Shiftry
			['lowkick', 'petalblizzard'],
		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		if (!types.includes('Ice')) this.incompatibleMoves(moves, movePool, 'icebeam', 'icywind');

		if (!types.includes('Dark') && teraType !== 'Dark') this.incompatibleMoves(moves, movePool, 'knockoff', 'suckerpunch');

		if (!types.includes('Rock')) this.incompatibleMoves(moves, movePool, 'rockslide', 'stoneedge');

		if (!types.includes('Ground')) this.incompatibleMoves(moves, movePool, 'earthquake', 'stompingtantrum');

		// This space reserved for assorted hardcodes that otherwise make little sense out of context:
		// To force Close Combat on Barraskewda without locking it to Tera Fighting
		if (species.id === 'barraskewda') {
			this.incompatibleMoves(moves, movePool, ['psychicfangs', 'throatchop'], ['poisonjab', 'throatchop']);
		}

		// Defense Curl Blissey makes this complicated
		if (species.id !== 'blissey') this.incompatibleMoves(moves, movePool, SETUP, HAZARDS);
		// Band-aid fix to enforce Mortal Spin on Glimmora
		if (species.id === 'glimmora') this.incompatibleMoves(moves, movePool, 'spikes', 'stealthrock');
	}

	// Generate random moveset for a given species, role, tera type.
	override randomMoveset(
		types: string[],
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		movePool: string[],
		teraType: string,
		role: RandomTeamsTypes.Role,
	): Set<string> {
		const moves = new Set<string>();
		let counter = this.queryMoves(moves, species, teraType, abilities);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);

		// If there are only four moves, add all moves and return early
		if (movePool.length <= this.maxMoveCount) {
			for (const moveid of movePool) {
				moves.add(moveid);
			}
			return moves;
		}

		// Helper function for (STAB-)move enforcement later on
		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, teraType, role
			);
		};

		// Helper function for paired move enforcement
		const addPairedMove = (moveid: string) => {
			for (const pair of MOVE_PAIRS) {
				if (moveid === pair[0] && movePool.includes(pair[1])) {
					counter = this.addMove(pair[1], moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
				if (moveid === pair[1] && movePool.includes(pair[0])) {
					counter = this.addMove(pair[0], moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		};

		if (role === 'Tera Blast user') {
			counter = this.addMove('terablast', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		if (role === 'Imprisoner') {
			counter = this.addMove('imprison', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Add required move (e.g. Relic Song for Meloetta-P)
		if (species.requiredMove) {
			const move = this.dex.moves.get(species.requiredMove).id;
			counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Add other moves you really want to have, e.g. STAB, recovery, setup.

		// Enforce Facade if Guts is a possible ability
		if (movePool.includes('facade') && abilities.includes('Guts')) {
			counter = this.addMove('facade', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce Sticky Web
		if (movePool.includes('stickyweb')) {
			counter = this.addMove('stickyweb', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce Aurora Veil
		if (movePool.includes('auroraveil')) {
			counter = this.addMove('auroraveil', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce hazard removal on Bulky Support if the team doesn't already have it
		if (role === 'Bulky Support' && !teamDetails.defog && !teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) {
				counter = this.addMove('rapidspin', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			if (movePool.includes('defog')) {
				counter = this.addMove('defog', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Knock Off on pure Normal- and Fighting-types
		if (types.length === 1 && (types.includes('Normal') || types.includes('Fighting'))) {
			if (movePool.includes('knockoff')) {
				counter = this.addMove('knockoff', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Rock Slide on Wallbreaker Rock types
		if (types.includes('Rock') && role === 'Wallbreaker') {
			if (movePool.includes('rockslide')) {
				counter = this.addMove('rockslide', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB priority
		if (role === 'Wallbreaker' || PRIORITY_POKEMON.includes(species.id)) {
			const priorityMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (
					types.includes(moveType) && (move.priority > 0 || (moveid === 'grassyglide' && abilities.includes('Grassy Surge'))) &&
					(move.basePower || move.basePowerCallback)
				) {
					priorityMoves.push(moveid);
				}
			}
			if (priorityMoves.length) {
				const moveid = this.sample(priorityMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Check if a STAB move of that type should be required
			let stabMoves: string[] = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
					stabMoves.push(moveid);
				}
			}
			// Don't enforce spread STAB if non-spread STAB is available
			const nonSpreadSTAB = stabMoves.filter(s => !SPREAD.includes(s));
			if (nonSpreadSTAB.length) stabMoves = nonSpreadSTAB;
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
				// Enforce Thunderbolt on Regice
				addPairedMove(moveid);
			}
		}

		// Enforce Tera STAB on all roles
		if (!counter.get('stabtera')) {
			let stabMoves: string[] = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && teraType === moveType) {
					stabMoves.push(moveid);
				}
			}
			// Don't enforce spread STAB if non-spread STAB is available
			const nonSpreadSTAB = stabMoves.filter(s => !SPREAD.includes(s));
			if (nonSpreadSTAB.length) stabMoves = nonSpreadSTAB;
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
				// Enforce Ice Beam on Tera Electric Porygon-Z
				addPairedMove(moveid);
			}
		}

		// If no STAB move was added, add a STAB move
		if (!counter.get('stab')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.includes(moveType)) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce pivoting moves on AV Pivot
		if (role === 'AV Pivot') {
			const pivotMoves = movePool.filter(moveid => ['uturn', 'voltswitch'].includes(moveid));
			if (pivotMoves.length) {
				const moveid = this.sample(pivotMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce recovery
		if (['Bulky Support'].includes(role) || ['blissey', 'dudunsparce'].includes(species.id)) {
			const recoveryMoves = movePool.filter(moveid => RECOVERY_MOVES.includes(moveid));
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce setup
		if (role.includes('Setup') || role === 'Tera Blast user') {
			// First, try to add a non-Speed setup move
			const nonSpeedSetupMoves = movePool.filter(moveid => SETUP.includes(moveid) && !SPEED_SETUP.includes(moveid));
			if (nonSpeedSetupMoves.length) {
				const moveid = this.sample(nonSpeedSetupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			} else {
				// No non-Speed setup moves, so add any (Speed) setup move
				const setupMoves = movePool.filter(moveid => SETUP.includes(moveid));
				if (setupMoves.length) {
					const moveid = this.sample(setupMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}

		// Enforce Protect
		if (!['Bulky Setup', 'Bulky Support', 'Wallbreaker'].includes(role)) {
			const protectMoves = movePool.filter(moveid => PROTECT_MOVES.includes(moveid));
			if (protectMoves.length) {
				const moveid = this.sample(protectMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
				// Enforce Wish and Leech Seed with Protect/Spiky Shield
				addPairedMove(moveid);
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
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Add (moves.size < this.maxMoveCount) as a condition if moves is getting larger than 4 moves.
		// If you want moves to be favored but not required, add something like && this.randomChance(1, 2) to your condition.

		// Choose remaining moves randomly from movepool and add them to moves list:
		while (moves.size < this.maxMoveCount && movePool.length) {
			if (moves.size + movePool.length <= this.maxMoveCount) {
				for (const moveid of movePool) {
					moves.add(moveid);
				}
				break;
			}
			const moveid = this.sample(movePool);
			counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
			addPairedMove(moveid);
		}
		return moves;
	}

	override shouldCullAbility(
		ability: string,
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): boolean {
		switch (ability) {
		// Abilities which are primarily useful for certain moves or with team support
		case 'Chlorophyll': case 'Solar Power':
			return !teamDetails.sun;
		case 'Defiant':
			return (species.id === 'thundurus' && !!counter.get('Status'));
		case 'Hydration': case 'Swift Swim':
			return !teamDetails.rain;
		case 'Iron Fist': case 'Skill Link':
			return !counter.get(this.dex.toID(ability));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Prankster':
			return !counter.get('Status');
		case 'Sand Force': case 'Sand Rush':
			return !teamDetails.sand;
		case 'Slush Rush':
			return !teamDetails.snow;
		case 'Swarm':
			return !counter.get('Bug');
		case 'Torrent':
			return (!counter.get('Water') && !moves.has('flipturn'));
		case 'Serene Grace':
			return (!counter.get('serenegrace'));
		}

		return false;
	}

	override getAbility(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (abilities.length <= 1) return abilities[0];

		const abilityAllowed: string[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilities) {
			if (!this.shouldCullAbility(
				ability, types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role
			)) {
				abilityAllowed.push(ability);
			}
		}

		// Pick a random allowed ability
		if (abilityAllowed.length >= 1) return this.sample(abilityAllowed);

		// If all abilities are rejected, prioritize weather abilities over non-weather abilities
		if (!abilityAllowed.length) {
			const weatherAbilities = abilities.filter(
				a => ['Chlorophyll', 'Hydration', 'Sand Force', 'Sand Rush', 'Slush Rush', 'Solar Power', 'Swift Swim'].includes(a)
			);
			if (weatherAbilities.length) return this.sample(weatherAbilities);
		}

		// Pick a random ability
		return this.sample(abilities);
	}

	override getPriorityItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	) {
		if (species.requiredItems) {
			// Z-Crystals aren't available in Gen 9, so require Plates
			if (species.baseSpecies === 'Arceus') {
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (role === 'AV Pivot') return 'Assault Vest';
		if (species.id === 'pikachu') return 'Light Ball';
		if (species.id === 'regieleki') return 'Magnet';
		if (species.id === 'blaziken') return 'Life Orb';
		if (species.id === 'lokix') {
			return (role === 'Fast Attacker') ? 'Silver Powder' : 'Life Orb';
		}
		if (species.id === 'pawmot') return 'Leppa Berry';
		if (species.id === 'slaking' || (species.id === 'persian' && !!counter.get('Status'))) return 'Silk Scarf';
		if (species.id === 'luvdisc') return 'Binding Band';
		if ((species.name === 'Latias' || species.name === 'Latios')) return 'Soul Dew';
		if (
			['froslass', 'ambipom'].includes(species.id) || moves.has('populationbomb') ||
			(ability === 'Hustle' && counter.get('setup') && this.randomChance(1, 2))
		) return 'Wide Lens';
		if (moves.has('clangoroussoul') || (species.id === 'toxtricity' && moves.has('shiftgear'))) return 'Throat Spray';
		if (species.id === 'necrozmaduskmane' || species.id === 'rhyperior') return 'Weakness Policy';
		if (
			['dragonenergy', 'waterspout'].some(m => moves.has(m)) ||
			(species.id === 'rampardos' && role === 'Choice Item user')
		) return 'Choice Scarf';
		if (species.id === 'mabosstiff' && moves.has('jawlock')) return 'Shed Shell';
		if ((species.id === 'terapagos' && moves.has('rapidspin'))) return 'Heavy-Duty Boots';
		if (
			['Cheek Pouch', 'Cud Chew', 'Harvest', 'Ripen'].some(m => ability === m) ||
			moves.has('bellydrum')
		) {
			return 'Sitrus Berry';
		}
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				role !== 'Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (species.id === 'scyther') return (isLead && !moves.has('uturn')) ? 'Eviolite' : 'Heavy-Duty Boots';
		// belt on electivire if it has 2 moves that aren't electric or protect
		if (species.id === 'electivire' && counter.get('Electric') < 3 - +moves.has('protect')) return 'Expert Belt';
		if (ability === 'Poison Heal') return 'Toxic Orb';
		if (species.nfe) return 'Eviolite';
		if (moves.has('facade')) {
			return (types.includes('Fire') || ability === 'Toxic Boost') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Magic Guard' || (ability === 'Sheer Force' && counter.get('sheerforce'))) return 'Life Orb';
		if (moves.has('dragondance')) return 'Clear Amulet';
		if (counter.get('skilllink') && ability !== 'Skill Link' && species.id !== 'breloom') return 'Loaded Dice';
		if (ability === 'Unburden') {
			return (moves.has('closecombat') || moves.has('leafstorm')) ? 'White Herb' : 'Sitrus Berry';
		}
		if (moves.has('shellsmash') && ability !== 'Weak Armor') return 'White Herb';
		if (moves.has('meteorbeam') || (moves.has('electroshot') && !teamDetails.rain)) return 'Power Herb';
		if (moves.has('acrobatics')) {
			return (ability === 'Protosynthesis') ? 'Booster Energy' : '';
		}
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (ability === 'Gluttony') return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
		if (
			moves.has('rest') && !moves.has('sleeptalk') &&
			ability !== 'Natural Cure' && ability !== 'Shed Skin'
		) {
			return 'Chesto Berry';
		}
		if (
			species.id !== 'yanmega' &&
			this.dex.getEffectiveness('Rock', species) >= 2 && (!types.includes('Flying'))
		) return 'Heavy-Duty Boots';
	}

	override getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	) {
		const scarfReqs = species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter.get('priority');
		if (role === 'Choice Item user') {
			if (counter.get('Physical') > counter.get('Special')) {
				return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Band';
			} else {
				return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Specs';
			}
		}
		if (
			role === 'Wallbreaker' &&
			(
				counter.get('Physical') >= moves.size || counter.get('Special') >= moves.size ||
				(counter.get('Special') === (moves.size - 1) && ['flipturn', 'uturn'].some(m => moves.has(m)))
			)
		) {
			return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
		}
		if (['blizzard', 'originpulse', 'precipiceblades'].some(m => moves.has(m))) return 'Blunder Policy';
		if (!counter.get('Status') && role !== 'Wallbreaker') {
			return 'Assault Vest';
		}
		if (this.dex.getEffectiveness('Rock', species) >= 1 || (
			(moves.has('defog') || moves.has('rapidspin')) &&
			(counter.get('recovery') || ['flipturn', 'partingshot', 'shedtail', 'uturn', 'voltswitch'].some(m => moves.has(m)))
		)) {
			return 'Heavy-Duty Boots';
		}
		if (['Wallbreaker', 'Fast Attacker'].includes(role) || species.id === 'golduck' && this.prng.randomChance(1, 2)) {
			const damagingTypes = [...counter.basePowerMoves].map(m => m.type);
			if (counter.basePowerMoves.size >= 2 && (new Set(damagingTypes)).size === 1) {
				if (damagingTypes[0] === 'Normal') return 'Silk Scarf';
				return this.dex.species.get('arceus' + damagingTypes[0]).requiredItems![0];
			}
		}
		if (['Bulky Attacker', 'Bulky Setup', 'Bulky Support'].includes(role) || moves.has('substitute')) return 'Leftovers';
		if (
			(ability === 'Protosynthesis' || ability === 'Quark Drive') && !isLead && !counter.get('hazards') &&
			species.id !== 'screamtail' && (species.id !== 'ironvaliant' || role !== 'Wallbreaker') &&
			['flipturn', 'uturn', 'voltswitch'].every(m => !moves.has(m))
		) {
			return 'Booster Energy';
		}
		if (role === 'Imprisoner') return 'Leftovers';
		if (role === 'Wallbreaker') return 'Life Orb';
		return 'Sitrus Berry';
	}

	override getLevel(
		species: Species,
	): number {
		if (this.adjustLevel) return this.adjustLevel;
		return this.randomSets[species.id].level!;
	}

	override randomSet(
		s: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		const species = this.dex.species.get(s);
		const forme = species.baseSpecies === 'Basculin' ? species.name : this.getForme(species);
		const sets = this.randomSets[species.id]["sets"];
		const possibleSets = [];

		const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
			if ((teamDetails.teraBlast || ruleTable.has('terastalclause')) && set.role === 'Tera Blast user') {
				continue;
			}
			// Prevent Imprisoner if the team already has two
			if (!!teamDetails.imprison && teamDetails.imprison >= 2 && set.role === 'Imprisoner') {
				continue;
			}
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			movePool.push(this.dex.moves.get(movename).id);
		}
		const teraTypes = set.teraTypes;
		let teraType = this.sampleIfArray(teraTypes);

		let ability = '';
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = species.types;
		const abilities = set.abilities!;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType!, role);
		const counter = this.queryMoves(moves, species, teraType!, abilities);

		// Get ability
		ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType!, role);

		// Get items
		// First, the priority items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType!, role);
		if (item === undefined) {
			item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType!, role);
		}

		// Get level
		const level = this.getLevel(species);

		// Prepare optimal HP for Belly Drum and Life Orb
		let hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
		let targetHP = hp;
		const minimumHP = Math.floor(Math.floor(2 * species.baseStats.hp + 100) * level / 100 + 10);
		if (item === "Life Orb") {
			targetHP = Math.floor(hp / 10) * 10 - 1;
		} else if (moves.has("bellydrum")) {
			targetHP = Math.floor(hp / 2) * 2;
		}
		// If the difference is too extreme, don't adjust HP
		if (hp > targetHP && hp - targetHP <= 3 && targetHP >= minimumHP) {
			// If setting evs to 0 is sufficient, decrement evs, otherwise decrement ivs with evs set to 0
			if (Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + 100) * level / 100 + 10) >= targetHP) {
				evs.hp = 0;
				hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
				while (hp > targetHP) {
					ivs.hp -= 1;
					hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
				}
			} else {
				while (hp > targetHP) {
					evs.hp -= 4;
					hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
				}
			}
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === 'shellsidearm' && item !== 'Choice Specs') return false;
			if (move.id === 'terablast' && (
				species.id === 'porygon' || species.baseStats.atk > species.baseStats.spa)
			) return false;
			return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		});

		if (noAttackStatMoves) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (moves.has('gyroball') || moves.has('trickroom')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// Enforce Tera Type after all set generation is done to prevent infinite generation
		if (this.forceTeraType) teraType = this.forceTeraType;

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
			teraType,
			role,
		};
	}

	randomFFATeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const isDoubles = this.format.gameType !== 'singles';
		const typePool = this.dex.types.names().filter(name => name !== "Stellar");
		const type = this.forceMonotype || this.sample(typePool);

		// PotD stuff
		const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let numMaxLevelPokemon = 0;

		const pokemonList = Object.keys(this.randomSets);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		let leadsRemaining = 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			let species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Treat Ogerpon formes and Terapagos like the Tera Blast user role; reject if team has one already
			if (['ogerponhearthflame', 'terapagos'].includes(species.id) && teamDetails.teraBlast) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type, and one double weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
					if (this.dex.getEffectiveness(typeName, species) > 1) {
						if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
						if (typeDoubleWeaknesses[typeName] >= limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
					if (typeWeaknesses['Fire'] >= 3 * limitFactor) continue;
				}

				// Limit four weak to Freeze-Dry
				if (weakToFreezeDry) {
					if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
					if (typeWeaknesses['Freeze-Dry'] >= 4 * limitFactor) continue;
				}

				// Limit one level 100 Pokemon
				if (!this.adjustLevel && (this.getLevel(species) === 100) && numMaxLevelPokemon >= limitFactor) {
					continue;
				}
			}

			// Limit three of any type combination in Monotype
			if (!this.forceMonotype && isMonotype && (typeComboCount[typeCombo] >= 3 * limitFactor)) continue;

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			let set: RandomTeamsTypes.RandomSet;

			if (leadsRemaining) {
				if (NO_LEAD_POKEMON.includes(species.baseSpecies)) {
					if (pokemon.length + leadsRemaining === this.maxTeamSize) continue;
					set = this.randomSet(species, teamDetails, false, isDoubles);
					pokemon.push(set);
				} else {
					set = this.randomSet(species, teamDetails, true, isDoubles);
					pokemon.unshift(set);
					leadsRemaining--;
				}
			} else {
				set = this.randomSet(species, teamDetails, false, isDoubles);
				pokemon.push(set);
			}

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
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment weakness counter
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					typeWeaknesses[typeName]++;
				}
				if (this.dex.getEffectiveness(typeName, species) > 1) {
					typeDoubleWeaknesses[typeName]++;
				}
			}
			// Count Dry Skin/Fluffy as Fire weaknesses
			if (['Dry Skin', 'Fluffy'].includes(set.ability) && this.dex.getEffectiveness('Fire', species) === 0) {
				typeWeaknesses['Fire']++;
			}
			if (weakToFreezeDry) typeWeaknesses['Freeze-Dry']++;

			// Increment level 100 counter
			if (set.level === 100) numMaxLevelPokemon++;

			// Track what the team has
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.ability === 'Orichalcum Pulse' || set.moves.includes('sunnyday')) {
				teamDetails.sun = 1;
			}
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('snowscape') || set.moves.includes('chillyreception')) {
				teamDetails.snow = 1;
			}
			if (set.moves.includes('healbell')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes') || set.moves.includes('ceaselessedge')) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (set.moves.includes('toxicspikes') || set.ability === 'Toxic Debris') teamDetails.toxicSpikes = 1;
			if (set.moves.includes('stealthrock') || set.moves.includes('stoneaxe')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin') || set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
			if (set.role === 'Tera Blast user' || ['ogerponhearthflame', 'terapagos'].includes(species.id)) {
				teamDetails.teraBlast = 1;
			}
			if (set.role === 'Imprisoner') teamDetails.imprison = (teamDetails.imprison || 0) + 1;
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}

	override randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');
}

export default RandomFFATeams;
