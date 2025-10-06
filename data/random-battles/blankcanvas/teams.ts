import { RandomTeams, type MoveCounter } from "../gen9/teams";

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'poweruppunch', 'swordsdance', 'tidyup', 'victorydance',
	'filletaway',
];
// Moves which boost Special Attack:
const SPECIAL_SETUP = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow', 'takeheart', 'torchsong', 'filletaway',
];
// Some moves that only boost Speed:
const SPEED_SETUP = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish', 'trailblaze',
];
// Conglomerate for ease of access
const SETUP = [
	'acidarmor', 'agility', 'autotomize', 'bellydrum', 'bulkup', 'calmmind', 'clangoroussoul', 'coil', 'cosmicpower', 'curse', 'dragondance',
	'filletaway', 'flamecharge', 'growth', 'honeclaws', 'howl', 'irondefense', 'meditate', 'nastyplot', 'noretreat', 'poweruppunch', 'quiverdance',
	'rockpolish', 'shellsmash', 'shiftgear', 'swordsdance', 'tailglow', 'takeheart', 'tidyup', 'trailblaze', 'trickroom', 'workup', 'victorydance',
];
const SPEED_CONTROL = [
	'electroweb', 'glare', 'icywind', 'lowsweep', 'quash', 'stringshot', 'tailwind', 'thunderwave', 'trickroom',
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

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['lightscreen', 'reflect'],
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	['leechseed', 'protect'],
	['leechseed', 'substitute'],
	['leechseed', 'burningbulwark'],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	'breloom', 'brutebonnet', 'cacturne', 'honchkrow', 'mimikyu', 'ragingbolt', 'scizor',
];

/** Pokemon who should never be in the lead slot */
const NO_LEAD_POKEMON = [
	'Zacian', 'Zamazenta',
];
const DOUBLES_NO_LEAD_POKEMON = [
	'Basculegion', 'Houndstone', 'Iron Bundle', 'Roaring Moon', 'Zacian', 'Zamazenta',
];
export class RandomBLCTeams extends RandomTeams {
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

		// Develop additional move lists
		const statusMoves = this.cachedStatusMoves;

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
		if (teamDetails.toxicSpikes) {
			if (movePool.includes('toxicspikes')) this.fastPop(movePool, movePool.indexOf('toxicspikes'));
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

		if (isDoubles) {
			const doublesIncompatiblePairs = [
				// In order of decreasing generalizability
				[SPEED_CONTROL, SPEED_CONTROL],
				[HAZARDS, HAZARDS],
				['rockslide', 'stoneedge'],
				[SETUP, ['fakeout', 'helpinghand']],
				[PROTECT_MOVES, 'wideguard'],
				[['fierydance', 'fireblast'], 'heatwave'],
				['dazzlinggleam', ['fleurcannon', 'moonblast']],
				['poisongas', ['toxicspikes', 'willowisp']],
				[RECOVERY_MOVES, ['healpulse', 'lifedew']],
				['healpulse', 'lifedew'],
				['haze', 'icywind'],
				[['hydropump', 'muddywater'], ['muddywater', 'scald']],
				['disable', 'encore'],
				['freezedry', 'icebeam'],
				['energyball', 'leafstorm'],
				['earthpower', 'sandsearstorm'],
				['coaching', ['helpinghand', 'howl']],
			];

			for (const pair of doublesIncompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

			if (role !== 'Offensive Protect') this.incompatibleMoves(moves, movePool, PROTECT_MOVES, ['flipturn', 'uturn']);
		}

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, ['healingwish', 'switcheroo', 'trick']],
			[SETUP, PIVOT_MOVES],
			[SETUP, HAZARDS],
			[SETUP, ['defog', 'nuzzle', 'toxic', 'yawn', 'haze']],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[SPECIAL_SETUP, 'thunderwave'],
			['substitute', PIVOT_MOVES],
			[SPEED_SETUP, ['aquajet', 'rest', 'trickroom']],
			['curse', ['irondefense', 'rapidspin']],
			['dragondance', 'dracometeor'],
			['yawn', 'roar'],
			['trick', 'uturn'],

			// These attacks are redundant with each other
			[['psychic', 'psychicnoise'], ['psyshock', 'psychicnoise']],
			['surf', ['hydropump', 'scald']],
			['liquidation', 'wavecrash'],
			['aquajet', 'flipturn'],
			['gigadrain', 'leafstorm'],
			['powerwhip', 'hornleech'],
			['airslash', 'hurricane'],
			['knockoff', 'foulplay'],
			['throatchop', ['crunch', 'lashout']],
			['doubleedge', ['bodyslam', 'headbutt']],
			[['fireblast', 'magmastorm'], ['fierydance', 'flamethrower', 'lavaplume']],
			['thunderpunch', 'wildcharge'],
			['thunderbolt', 'discharge'],
			['gunkshot', ['direclaw', 'poisonjab', 'sludgebomb']],
			['aurasphere', 'focusblast'],
			['closecombat', 'drainpunch'],
			[['dragonpulse', 'spacialrend'], 'dracometeor'],
			['heavyslam', 'flashcannon'],
			['alluringvoice', 'dazzlinggleam'],
			['defog', 'rapidspin'],

			// These status moves are redundant with each other
			['taunt', 'disable'],
			[['thunderwave', 'toxic'], ['thunderwave', 'willowisp']],
			[['thunderwave', 'toxic', 'willowisp'], 'toxicspikes'],

			// This space reserved for assorted hardcodes that otherwise make little sense out of context
			// Landorus and Thundurus
			['nastyplot', ['rockslide', 'knockoff']],
			// Persian
			['switcheroo', 'fakeout'],
			// Amoonguss, though this can work well as a general rule later
			['toxic', 'clearsmog'],
			// Chansey and Blissey
			['healbell', 'stealthrock'],
			// Araquanid and Magnezone
			['mirrorcoat', ['hydropump', 'bodypress']],
			// Plasmage
			['electroshot', 'psychoboost'],
			// Seaode
			['stoneedge', 'stoneaxe'],
			// Geigeramp
			['willowisp', 'nuzzle'],
			// Martorse
			['willowisp', 'encore'],
			// Faeruin
			['substitute', 'rapidspin'],
			// Geoporka
			['toxic', 'stunspore'],
			// Blobbiam
			['spiritbreak', 'playrough'],
		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		if (!types.includes('Ice')) this.incompatibleMoves(moves, movePool, 'icebeam', 'icywind');

		if (!isDoubles) this.incompatibleMoves(moves, movePool, 'taunt', 'encore');

		if (!types.includes('Dark') && teraType !== 'Dark') this.incompatibleMoves(moves, movePool, 'knockoff', 'suckerpunch');

		if (!abilities.includes('Prankster')) this.incompatibleMoves(moves, movePool, 'thunderwave', 'yawn');

		// This space reserved for assorted hardcodes that otherwise make little sense out of context:
		// To force Close Combat on Barraskewda without locking it to Tera Fighting
		if (species.id === 'barraskewda') {
			this.incompatibleMoves(moves, movePool, ['psychicfangs', 'throatchop'], ['poisonjab', 'throatchop']);
		}
		// To force Toxic on Quagsire
		if (species.id === 'quagsire') this.incompatibleMoves(moves, movePool, 'spikes', 'icebeam');
		// Taunt/Knock should be Cyclizar's flex moveslot
		if (species.id === 'cyclizar') this.incompatibleMoves(moves, movePool, 'taunt', 'knockoff');
		// To force Stealth Rock on Camerupt
		if (species.id === 'camerupt') this.incompatibleMoves(moves, movePool, 'roar', 'willowisp');
		// nothing else rolls these lol
		if (species.id === 'coalossal') this.incompatibleMoves(moves, movePool, 'flamethrower', 'overheat');
	}

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

		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, teraType, role
			);
		};

		if (role === 'Tera Blast user') {
			counter = this.addMove('terablast', moves, types, abilities, teamDetails, species, isLead, isDoubles,
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

		// Enforce Night Shade, Revelation Dance, Revival Blessing, and Sticky Web
		for (const moveid of ['nightshade', 'revelationdance', 'revivalblessing', 'stickyweb']) {
			if (movePool.includes(moveid)) {
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Trick Room on Doubles Wallbreaker
		if (movePool.includes('trickroom') && role === 'Doubles Wallbreaker') {
			counter = this.addMove('trickroom', moves, types, abilities, teamDetails, species, isLead, isDoubles,
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

		// Enforce Knock Off on pure Normal- and Fighting-types in singles
		if (!isDoubles && types.length === 1 && (types.includes('Normal') || types.includes('Fighting'))) {
			if (movePool.includes('knockoff')) {
				counter = this.addMove('knockoff', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Flip Turn on pure Water-type Wallbreakers
		if (types.length === 1 && types.includes('Water') &&
			role === 'Wallbreaker' && movePool.includes('flipturn')) {
			counter = this.addMove('flipturn', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce Spore on Smeargle
		if (species.id === 'smeargle') {
			if (movePool.includes('spore')) {
				counter = this.addMove('spore', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Roost on Fausteil
		if (species.id === 'fausteil') {
			if (movePool.includes('roost')) {
				counter = this.addMove('roost', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Sunny Day on Wallbreaker Cottentration
		if (species.id === 'cottentration') {
			if (movePool.includes('sunnyday')) {
				counter = this.addMove('sunnyday', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Superpower on Reversadusa
		if (species.id === 'reversadusa') {
			if (movePool.includes('superpower')) {
				counter = this.addMove('superpower', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Close Combat on Iron Crest
		if (species.id === 'ironcrest') {
			if (movePool.includes('closecombat')) {
				counter = this.addMove('closecombat', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce moves in doubles
		if (isDoubles) {
			const doublesEnforcedMoves = ['auroraveil', 'mortalspin', 'spore'];
			for (const moveid of doublesEnforcedMoves) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
			// Enforce Fake Out on slow Pokemon
			if (movePool.includes('fakeout') && species.baseStats.spe <= 50) {
				counter = this.addMove('fakeout', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			// Enforce Tailwind on Prankster and Gale Wings users
			if (movePool.includes('tailwind') && (abilities.includes('Prankster') || abilities.includes('Gale Wings'))) {
				counter = this.addMove('tailwind', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			// Enforce Thunder Wave on Prankster users as well
			if (movePool.includes('thunderwave') && abilities.includes('Prankster')) {
				counter = this.addMove('thunderwave', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB priority
		if (
			['Bulky Attacker', 'Bulky Setup', 'Wallbreaker', 'Doubles Wallbreaker'].includes(role) ||
			PRIORITY_POKEMON.includes(species.id)
		) {
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

		// Enforce a single STAB for Moltres
		if (species.id === 'moltres') {
			const typeToEnforce = this.randomChance(1, 2) ? 'Fire' : 'Flying';

			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && typeToEnforce === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(typeToEnforce)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Moltres already has STAB, so ignore this block
			if (species.id === 'moltres') break;
			// prevents Meowscarada from being enforced stab moves
			if (species.id === 'meowscarada') break;
			// Check if a STAB move of that type should be required
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Tera STAB
		// prevents Meowscarada from being enforced stab moves (since it has Protean and doesn't care)
		if (!counter.get('stabtera') && !['Bulky Support', 'Doubles Support'].includes(role) &&
			!abilities.includes('Protean')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && teraType === moveType) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// If no STAB move was added, add a STAB move
		// prevents Meowscarada from being enforced stab moves (since it has Protean and doesn't care)
		if (!counter.get('stab') && !abilities.includes('Protean')) {
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

		// Enforce recovery
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup'].includes(role)) {
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

		// Enforce redirecting moves and Fake Out on Doubles Support
		if (role === 'Doubles Support') {
			for (const moveid of ['fakeout', 'followme', 'ragepowder']) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}

		// Enforce Protect
		if (role.includes('Protect')) {
			const protectMoves = movePool.filter(moveid => PROTECT_MOVES.includes(moveid));
			if (protectMoves.length) {
				const moveid = this.sample(protectMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
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

		// Enforce coverage move
		if (!['AV Pivot', 'Fast Support', 'Bulky Support', 'Bulky Protect', 'Doubles Support'].includes(role)) {
			if (counter.damagingMoves.size === 1) {
				// Find the type of the current attacking move
				const currentAttackType = counter.damagingMoves.values().next().value!.type;
				// Choose an attacking move that is of different type to the current single attack
				const coverageMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(move, species, abilities, teraType);
					if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
						if (currentAttackType !== moveType) coverageMoves.push(moveid);
					}
				}
				if (coverageMoves.length) {
					const moveid = this.sample(coverageMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
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
		}
		return moves;
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
		if (!isDoubles) {
			if (role === 'Fast Bulky Setup' && (ability === 'Quark Drive' || ability === 'Protosynthesis')) {
				return 'Booster Energy';
			}
			if (species.id === 'lokix') {
				return (role === 'Fast Attacker') ? 'Silver Powder' : 'Life Orb';
			}
		}
		if (species.requiredItems) {
			// Z-Crystals aren't available in Gen 9, so require Plates
			if (species.baseSpecies === 'Arceus') {
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (role === 'AV Pivot') return 'Assault Vest';
		// buncha BC specific hardcodes
		if (species.id === 'badjur') return 'Toxic Orb';
		if (species.id === 'vipult' && role === 'Bulky Support') return this.sample(['Black Sludge', 'Heavy-Duty Boots']);
		if (
			(species.id === 'lundicare' && role === 'Fast Bulky Setup' && moves.has('stuffcheeks')) ||
			(species.id === 'devestial' && role === 'Bulky Setup')
		) {
			return 'Petaya Berry';
		}
		if (
			[
				'goblantern', 'lavalisk', 'eolikopter', 'scarachnid', 'bugswarm', 'leechmonner',
				'hebicikuga', 'socknbuskn', 'fausteil', 'deadward', 'borealis', 'flarenheit',
			].includes(species.id) ||
			(species.id === 'searytch' && role === 'Bulky Attacker') ||
			(species.id === 'monmothra' && role === 'Bulky Support') ||
			(['crystuit', 'pinaturbo'].includes(species.id) && role === 'Fast Support')
		) {
			return 'Heavy-Duty Boots';
		}
		if (
			['dastard', 'geigeramp', 'arsenstorm', 'jokerpent', 'geoporka'].includes(species.id) ||
			(species.id === 'maldractice' && role === 'Bulky Support')
		) {
			return 'Black Sludge';
		}
		if (counter.get('skilllink') && ability !== 'Skill Link') return 'Loaded Dice';
		if (ability === 'Sand Stream') return 'Smooth Rock';
		if (ability === 'Drought' && role !== 'Setup Sweeper') return 'Heat Rock';
		if (moves.has('meteorbeam') || (moves.has('electroshot') && !teamDetails.rain)) return 'Power Herb';
		if (moves.has('sunnyday') || ['piss', 'sculptera'].includes(species.id)) return 'Life Orb';
		if (species.id === 'plasmage' && moves.has('psychoboost') && role === 'Setup Sweeper') return 'Eject Pack';
		if (['craggon', 'jackoswarm'].includes(species.id)) return this.sample(['Rocky Helmet', 'Leftovers']);
		if (species.id === 'thaumaton') return (moves.has('steelbeam')) ? 'Sitrus Berry' : 'Air Balloon';
		if (species.id === 'kadraoke' && role === 'Setup Sweeper') return 'Throat Spray';
		if (species.id === 'sylravage') return this.sample(['Choice Band', 'Choice Scarf']);
		if (species.id === 'capricorrie') return this.sample(['Heavy-Duty Boots', 'Life Orb']);
		if (species.id === 'maldractice' && role === 'Wallbreaker') {
			return (moves.has('dragondance')) ? 'Black Sludge' : 'Choice Band';
		}
		if (species.id === 'snabterra' && role === 'Wallbreaker') return 'Choice Band';
		if (species.id === 'snabterra' && role === 'Bulky Attacker') return 'Heavy-Duty Boots';
		if (species.id === 'snabterra' && role === 'Bulky Setup') return this.sample(['Leftovers', 'Sitrus Berry']);
		if (species.id === 'searytch') return (role === 'Bulky Support') ? 'Leftovers' : 'Heavy-Duty Boots';
		if (species.id === 'lundicare' && role === 'Fast Attacker') return this.sample(['Leftovers', 'Earth Plate']);
		if (species.id === 'tryonite' && ability === 'Sturdy') return 'Leftovers';
		if (species.id === 'tryonite' && role === 'Setup Sweeper') return this.sample(['Heavy-Duty Boots', 'Life Orb']);
		if (species.id === 'ironcrest' && role === 'Setup Sweeper') return 'White Herb';
		if (species.id === 'seaode') return this.sample(['Heavy-Duty Boots', 'Life Orb', 'Choice Band', 'Choice Scarf']);
		if (['serpvoltidae', 'twinkaton', 'devestial'].includes(species.id) && role === 'Bulky Support') return 'Leftovers';
		if (species.id === 'serpvoltidae' && role === 'Bulky Attacker' && !moves.has('shoreup')) {
			return this.sample(['Choice Specs', 'Life Orb']);
		}
		if (species.id === 'serpvoltidae' && role === 'Bulky Attacker' && moves.has('shoreup')) return 'Life Orb';
		if (species.id === 'sheepquake') return this.sample(['Leftovers', 'Life Orb']);
		if (ability === 'Flare Boost') return 'Flame Orb';
		if (species.id === 'sorrowcean' && ability !== 'Flare Boost') return 'Leftovers';
		if (species.id === 'blobbiam' && role === 'Bulky Attacker') {
			return this.sample(['Heavy-Duty Boots', 'Choice Band', 'Choice Scarf']);
		}
		if (
			(['blobbiam', 'massassin', 'martorse'].includes(species.id) && role === 'Bulky Support') ||
			['mohawtter', 'arachnode', 'porcupyre', 'bazhigangquan', 'actaniathan'].includes(species.id)
		) {
			return this.sample(['Heavy-Duty Boots', 'Leftovers']);
		}
		if (species.id === 'hippaint' && !moves.has('calmmind')) return this.sample(['Choice Specs', 'Life Orb']);
		if (species.id === 'hippaint' && moves.has('calmmind')) return 'Life Orb';
		if (species.id === 'parasike') return this.sample(['Heavy-Duty Boots', 'Choice Band', 'Silver Powder']);
		if (species.id === 'llanfairwyrm' && role === 'Bulky Support') return this.sample(['Rocky Helmet', 'Leftovers']);
		if (species.id === 'llanfairwyrm' && role === 'Bulky Setup') return this.sample(['Heavy-Duty Boots', 'Life Orb']);
		if (species.id === 'karmalice') {
			return (moves.has('fakeout') || role === 'Fast Support') ? 'Heavy-Duty Boots' : 'Choice Specs';
		}
		if (species.id === 'reversadusa' && !moves.has('substitute')) return this.sample(['Heavy-Duty Boots', 'Life Orb']);
		if (species.id === 'reversadusa' && moves.has('substitute')) return 'Leftovers';
		if (species.id === 'primordialith' && ability === 'Vital Spirit') return 'Leftovers';
		if (['frostengu', 'monmothra', 'drakkannon'].includes(species.id) && role === 'Fast Attacker') {
			return this.sample(['Choice Specs', 'Choice Scarf']);
		}
		if (species.id === 'frostengu' && role === 'Wallbreaker') return this.sample(['Choice Band', 'Choice Scarf']);
		if (species.id === 'sleetshell' && role === 'Fast Attacker') return this.sample(['Choice Band', 'Choice Scarf']);
		if (['martorse', 'faeruin'].includes(species.id) && role === 'Fast Support') {
			return this.sample(['Heavy-Duty Boots', 'Leftovers']);
		}
		if (species.id === 'martorse' && role === 'Fast Attacker') return this.sample(['Heavy-Duty Boots', 'Life Orb']);
		if (species.id === 'freightmare') return (role === 'Fast Support') ? 'Leftovers' : 'Life Orb';
		if (species.id === 'faeruin' && role === 'Setup Sweeper' && !moves.has('substitute')) {
			return this.sample(['Heavy-Duty Boots', 'Life Orb']);
		}
		if (species.id === 'faeruin' && role === 'Setup Sweeper' && moves.has('substitute')) return 'Leftovers';
		if (species.id === 'haarstorm') {
			if (role === 'Fast Attacker') return 'Choice Scarf';
			if (role === 'Bulky Support') return 'Leftovers';
			if (role === 'Fast Support') return 'Life Orb';
		}
		if (species.id === 'bulionage') return this.sample(['Leftovers', 'Clear Amulet']);
		if (['fettogre', 'copperhead', 'psyllapse', 'obaki'].includes(species.id)) return 'Leftovers';
		if (species.id === 'crystuit' && role === 'Fast Attacker') return this.sample(['Choice Specs', 'Choice Scarf']);
		if (species.id === 'odonata') return this.sample(['Heavy-Duty Boots', 'Lum Berry']);
		if (species.id === 'yamateraph') return this.sample(['Leftovers', 'Lum Berry']);
		if (species.id === 'wizhazard') {
			if (role === 'Wallbreaker') return 'Choice Specs';
			if (role === 'Bulky Setup') return 'Leftovers';
		}
		if (species.id === 'groundead') return (role === 'Wallbreaker') ? 'Choice Band' : 'Leftovers';
		if (species.id === 'bellolysk') {
			if (role === 'Bulky Setup' || role === 'Bulky Support') return 'Leftovers';
			if (role === 'Wallbreaker') return 'Life Orb';
		}
		if (species.id === 'bufferfly' && role === 'Bulky Setup') return 'Leftovers';
		if (species.id === 'versalyre') return 'Choice Scarf';
		if (species.id === 'pinaturbo' && role === 'Wallbreaker') return 'Life Orb';
		if (species.id === 'brasspecter') {
			if (role === 'Bulky Attacker') return 'Choice Band';
			if (role === 'Bulky Setup') return 'Leftovers';
		}
		if (species.id === 'cottentration' && role !== 'Wallbreaker') return 'Leftovers';

		// backups to catch stuff that falls through the cracks
		if ((ability === 'Guts' || moves.has('facade')) && !moves.has('sleeptalk')) {
			return (types.includes('Fire') || ability === 'Toxic Boost' || ability === 'Poison Heal') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Magic Guard' || (ability === 'Sheer Force' && counter.get('sheerforce'))) return 'Life Orb';
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				role !== 'Wallbreaker' && role !== 'Doubles Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (
			role === 'Wallbreaker' && (counter.get('Physical') > counter.get('Special')) && !counter.get('Status')
		) {
			return 'Choice Band';
		}
		if (
			role === 'Wallbreaker' && (counter.get('Physical') < counter.get('Special')) && !counter.get('Status')
		) {
			return 'Choice Specs';
		}
		if (ability === 'Poison Heal' || ability === 'Quick Feet') return 'Toxic Orb';
		if (moves.has('acrobatics') && ability !== 'Quark Drive' && ability !== 'Protosynthesis') return '';
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (ability === 'Gluttony') return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
		if (
			['Cheek Pouch', 'Cud Chew', 'Harvest', 'Ripen'].some(m => ability === m) ||
			moves.has('bellydrum') || moves.has('filletaway')
		) {
			return 'Sitrus Berry';
		}
		if (this.dex.getEffectiveness('Rock', species) >= 2) return 'Heavy-Duty Boots';
		if (species.nfe) return 'Eviolite';
	}

	override randomSet(
		s: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		const species = this.dex.species.get(s);
		const forme = this.getForme(species);
		const sets = this.randomSets[species.id]["sets"];
		const possibleSets: RandomTeamsTypes.RandomSetData[] = [];

		const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Fast Bulky Setup on lead Paradox Pokemon, since it generates Booster Energy.
			const abilities = set.abilities!;
			if (
				isLead && (abilities.includes('Protosynthesis') || abilities.includes('Quark Drive')) &&
				set.role === 'Fast Bulky Setup'
			) continue;
			// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
			if ((teamDetails.teraBlast || ruleTable.has('terastalclause')) && set.role === 'Tera Blast user') {
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
		const teraTypes = set.teraTypes!;
		let teraType = this.sampleIfArray(teraTypes);

		let ability = '';
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = species.types;
		const abilities = set.abilities!;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
		const counter = this.queryMoves(moves, species, teraType, abilities);

		// Get ability
		ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);

		// Get items
		// First, the priority items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
		if (item === undefined) {
			if (isDoubles) {
				item = this.getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
			} else {
				item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
			}
		}

		// Get level
		const level = this.getLevel(species, isDoubles);

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard' || item === 'Heavy-Duty Boots';
		let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		// Crash damage move users want an odd HP to survive two misses
		if (['axekick', 'highjumpkick', 'jumpkick'].some(m => moves.has(m))) srWeakness = 2;
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if ((moves.has('substitute') && ['Sitrus Berry', 'Salac Berry'].includes(item))) {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if ((moves.has('bellydrum') || moves.has('filletaway')) && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (moves.has('substitute') && moves.has('endeavor')) {
				// Luvdisc should be able to Substitute down to very low HP
				if (hp % 4 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || ability === 'Regenerator' || ['Leftovers', 'Life Orb', 'Eviolite'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === 'shellsidearm') return false;
			// Magearna and doubles Dragonite, though these can work well as a general rule
			if (move.id === 'terablast' && (
				species.id === 'porygon2' || moves.has('shiftgear') || species.baseStats.atk > species.baseStats.spa)
			) return false;
			return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		});
		// prevents Illumise (who can turn into Volbeat with Physical moves) from having 0 Atk EVs
		if (noAttackStatMoves && !moves.has('transform') && this.format.mod !== 'partnersincrime' &&
			species.id !== 'illumise') {
			evs.atk = 0;
			ivs.atk = 0;
		}

		// Enforce Tera Type after all set generation is done to prevent infinite generation
		if (this.forceTeraType) teraType = this.forceTeraType;

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);
		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.baseSpecies === 'Greninja' ? 'M' : (species.gender || (this.random(2) ? 'F' : 'M')),
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

	override randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./random-sets.json');

	randomBLCTeam() {
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
		// const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		// const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let numMaxLevelPokemon = 0;

		const pokemonList = Object.keys(this.randomSets);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		let leadsRemaining = this.format.gameType === 'doubles' ? 2 : 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			const species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Treat Ogerpon formes and Terapagos like the Tera Blast user role; reject if team has one already
			if (['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id) && teamDetails.teraBlast) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Sorrowcean' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			// TEMPORARILY ADJUSTING BALANCE OF THIS BLOCK -- TOO FEW POKEMON TO GENERATE TEAMS
			// update: reverting these changes, but leaving just in case
			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 /* 6 */ * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type, and one double weak to any type
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 /* 6 */ * limitFactor) {
							skip = true;
							break;
						}
					}
					if (this.dex.getEffectiveness(typeName, species) > 1) {
						if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
						if (typeDoubleWeaknesses[typeName] >= 1 /* 6 */ * Number(limitFactor)) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
					if (typeWeaknesses['Fire'] >= 3 /* 6 */ * limitFactor) continue;
				}

				// Limit four weak to Freeze-Dry
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				if (weakToFreezeDry) {
					if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
					if (typeWeaknesses['Freeze-Dry'] >= 4 /* 6 */ * limitFactor) continue;
				}

				// Limit one level 100 Pokemon
				if (!this.adjustLevel && (this.getLevel(species, isDoubles) === 100) && numMaxLevelPokemon >= limitFactor) {
					continue;
				}
			}

			// Limit three of any type combination in Monotype
			if (!this.forceMonotype && isMonotype && (typeComboCount[typeCombo] >= 3 * limitFactor)) continue;

			// The Pokemon of the Day
			// if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			// testing code
			// if (pokemon.length === 0 || this.maxTeamSize === 1) species = this.dex.species.get('Terapagos');

			let set: RandomTeamsTypes.RandomSet;

			if (leadsRemaining) {
				if (
					isDoubles && DOUBLES_NO_LEAD_POKEMON.includes(species.baseSpecies) ||
					!isDoubles && NO_LEAD_POKEMON.includes(species.baseSpecies)
				) {
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
			if (set.role === 'Tera Blast user' || species.baseSpecies === "Ogerpon" || species.baseSpecies === "Terapagos") {
				teamDetails.teraBlast = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}
}

export default RandomBLCTeams;
