'use strict';

const RandomTeams = require('../../random-teams');

/** @typedef {import('../../random-teams').TeamData} TeamData */

class RandomGen7Teams extends RandomTeams {
	/**
	 * @param {Format | string} format
	 * @param {?PRNG | [number, number, number, number]} [prng]
	 */
	constructor(format, prng) {
		super(format, prng);
		/**@type {AnyObject} */
		// @ts-ignore
		this.randomFactorySets = require('./factory-sets.json');
		/**@type {AnyObject} */
		// @ts-ignore
		this.randomBSSFactorySets = require('./bss-factory-sets.json');
	}

	/**
	 * @param {string | Template} template
	 * @param {RandomTeamsTypes.TeamDetails} [teamDetails]
	 * @param {boolean} [isLead]
	 * @param {boolean} [isDoubles]
	 * @return {RandomTeamsTypes.RandomSet}
	 */
	randomSet(template, teamDetails = {}, isLead = false, isDoubles = false) {
		template = this.dex.getTemplate(template);
		let baseTemplate = template;
		let species = template.species;

		if (!template.exists || ((!isDoubles || !template.randomDoubleBattleMoves) && !template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.dex.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			Monitor.crashlog(err, 'The gen 7 randbat set generator');
		}

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}
		let battleForme = this.checkBattleForme(template);
		if (battleForme && battleForme.randomBattleMoves && template.otherFormes && (battleForme.isMega ? !teamDetails.megaStone : this.random(2))) {
			template = this.dex.getTemplate(template.otherFormes.length >= 2 ? this.sample(template.otherFormes) : template.otherFormes[0]);
		}

		const randMoves = !isDoubles ? template.randomBattleMoves : template.randomDoubleBattleMoves || template.randomBattleMoves;
		let movePool = (randMoves ? randMoves.slice() : template.learnset ? Object.keys(template.learnset) : []);
		let rejectedPool = [];
		/**@type {string[]} */
		let moves = [];
		let ability = '';
		let item = '';
		let evs = {
			hp: 85,
			atk: 85,
			def: 85,
			spa: 85,
			spd: 85,
			spe: 85,
		};
		let ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31,
		};
		/**@type {{[k: string]: true}} */
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		/**@type {{[k: string]: true}} */
		let hasAbility = {};
		hasAbility[template.abilities[0]] = true;
		if (template.abilities[1]) {
			// @ts-ignore
			hasAbility[template.abilities[1]] = true;
		}
		if (template.abilities['H']) {
			// @ts-ignore
			hasAbility[template.abilities['H']] = true;
		}
		let availableHP = 0;
		for (const moveid of movePool) {
			if (moveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = ['closecombat', 'diamondstorm', 'extremespeed', 'superpower', 'clangingscales', 'dracometeor'];

		let counterAbilities = ['Adaptability', 'Contrary', 'Iron Fist', 'Skill Link', 'Strong Jaw'];
		let ateAbilities = ['Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate'];

		/**@type {{[k: string]: boolean}} */
		let hasMove = {};
		let counter;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const moveid of moves) {
				if (moveid.startsWith('hiddenpower')) {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}
			while (moves.length < 4 && rejectedPool.length) {
				let moveid = this.sampleNoReplace(rejectedPool);
				hasMove[moveid] = true;
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				let move = this.dex.getMove(moveId);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Not very useful without their supporting moves
				case 'clangingscales': case 'electricterrain': case 'happyhour': case 'holdhands': case 'mindblown':
					if (teamDetails.zMove || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'cottonguard': case 'defendorder':
					if (!counter['recovery'] && !hasMove['rest']) rejected = true;
					break;
				case 'bounce': case 'dig': case 'fly':
					if (teamDetails.zMove || counter.setupType !== 'Physical') rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'icebeam':
					if (hasAbility['Tinted Lens'] && !!counter['Status']) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['protect']) rejected = true;
					break;
				case 'reflect':
					if (!hasMove['calmmind'] && !hasMove['lightscreen']) rejected = true;
					if (movePool.length > 1) {
						let screen = movePool.indexOf('lightscreen');
						if (screen >= 0) this.fastPop(movePool, screen);
					}
					break;
				case 'rest':
					if (movePool.includes('sleeptalk')) rejected = true;
					break;
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						let rest = movePool.indexOf('rest');
						if (rest >= 0) this.fastPop(movePool, rest);
					}
					break;
				case 'storedpower':
					if (!counter.setupType) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || hasMove['suckerpunch']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) {
						if (!hasMove['growth'] || hasMove['sunnyday']) rejected = true;
					}
					if (counter.Physical + counter['physicalpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					if (moveid === 'bellydrum' && !hasAbility['Unburden'] && !counter['priority']) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					if (hasType['Dark'] && hasMove['darkpulse']) {
						counter.setupType = 'Special';
						rejected = false;
					}
					isSetup = true;
					break;
				case 'growth': case 'shellsmash': case 'workup':
					if (counter.setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (counter.damagingMoves.length + counter['physicalpool'] + counter['specialpool'] < 2) rejected = true;
					if (moveid === 'growth' && !hasMove['sunnyday']) rejected = true;
					isSetup = true;
					break;
				case 'agility': case 'autotomize': case 'rockpolish': case 'shiftgear':
					if (counter.damagingMoves.length < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;
				case 'flamecharge':
					if (counter.damagingMoves.length < 3 && !counter.setupType) rejected = true;
					if (hasMove['dracometeor'] || hasMove['overheat']) rejected = true;
					break;

				// Bad after setup
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) rejected = true;
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['raindance'] || hasMove['roar'] || hasMove['trickroom'] || hasMove['whirlwind']) rejected = true;
					// @ts-ignore
					if ((counter[move.type] > 1 && counter.Status > 1) || (hasAbility['Sheer Force'] && !!counter['sheerforce'])) rejected = true;
					break;
				case 'defog':
					if (counter.setupType || hasMove['spikes'] || hasMove['stealthrock'] || teamDetails.defog) rejected = true;
					break;
				case 'fakeout': case 'tailwind':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'foulplay':
					if (counter.setupType || !!counter['speedsetup'] || counter['Dark'] > 2 || hasMove['clearsmog'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (counter.damagingMoves.length - 1 === counter['priority']) rejected = true;
					break;
				case 'haze': case 'spikes':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['trickroom']) rejected = true;
					break;
				case 'healbell': case 'technoblast':
					if (counter['speedsetup']) rejected = true;
					break;
				case 'healingwish': case 'memento':
					if (counter.setupType || !!counter['recovery'] || hasMove['substitute']) rejected = true;
					break;
				case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang':
					if (!hasAbility['Parental Bond'] && (counter.damagingMoves.length > 1 || counter.setupType)) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && !hasMove['wish']) rejected = true;
					if (hasMove['rest'] || hasMove['lightscreen'] && hasMove['reflect']) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || counter.Status > 1 || counter['Dark'] > 2 || hasMove['knockoff'] && !hasType['Dark']) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || teamDetails.rapidSpin) rejected = true;
					break;
				case 'reversal':
					if (hasMove['substitute'] && teamDetails.zMove) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || hasMove['substitute'] || hasMove['trickroom'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'stickyweb':
					if (teamDetails.stickyWeb) rejected = true;
					break;
				case 'toxicspikes':
					if (counter.setupType || teamDetails.toxicSpikes) rejected = true;
					break;
				case 'trickroom':
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasType['Bug'] && counter.stab < 2 && counter.damagingMoves.length > 2 && !hasAbility['Adaptability'] && !hasAbility['Download']) rejected = true;
					if ((hasAbility['Speed Boost'] && hasMove['protect']) || (hasAbility['Protean'] && counter.Status > 2)) rejected = true;
					break;
				case 'voltswitch':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['electricterrain'] || hasMove['raindance'] || hasMove['uturn']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite': case 'bugbuzz': case 'infestation': case 'signalbeam':
					if (hasMove['uturn'] && !counter.setupType && !hasAbility['Tinted Lens']) rejected = true;
					break;
				case 'darkestlariat': case 'nightslash':
					if (hasMove['knockoff'] || hasMove['pursuit']) rejected = true;
					break;
				case 'darkpulse':
					if ((hasMove['crunch'] || hasMove['knockoff'] || hasMove['hyperspacefury']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'suckerpunch':
					if (counter.damagingMoves.length < 2 || hasMove['glare'] || !hasType['Dark'] && counter['Dark'] > 1) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['dragontail'] || hasMove['outrage']) rejected = true;
					break;
				case 'dracometeor':
					if (hasMove['swordsdance'] || counter.setupType === 'Physical' && counter['Dragon'] > 1) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage'] || hasMove['dragontail'] && !counter.setupType) rejected = true;
					break;
				case 'outrage':
					if (hasMove['dracometeor'] && counter.damagingMoves.length < 3) rejected = true;
					if (hasMove['clangingscales'] && !teamDetails.zMove) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					break;
				case 'thunderpunch':
					if (hasAbility['Galvanize'] && !!counter['Normal']) rejected = true;
					break;
				case 'moonblast':
					if (isDoubles && hasMove['dazzlinggleam']) rejected = true;
					break;
				case 'aurasphere': case 'focusblast':
					if ((hasMove['closecombat'] || hasMove['superpower']) && counter.setupType !== 'Special') rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'drainpunch':
					if (!hasMove['bulkup'] && (hasMove['closecombat'] || hasMove['highjumpkick'])) rejected = true;
					if ((hasMove['focusblast'] || hasMove['superpower']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'closecombat': case 'highjumpkick':
					if ((hasMove['aurasphere'] || hasMove['focusblast'] || movePool.includes('aurasphere') || movePool.includes('focusblast')) && counter.setupType === 'Special') rejected = true;
					if (hasMove['bulkup'] && hasMove['drainpunch']) rejected = true;
					break;
				case 'stormthrow':
					if (hasMove['circlethrow'] && hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'superpower':
					if (counter['Fighting'] > 1 && counter.setupType) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk'] && !hasAbility['Contrary']) rejected = true;
					if (hasAbility['Contrary']) isSetup = true;
					break;
				case 'vacuumwave':
					if ((hasMove['closecombat'] || hasMove['machpunch']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'fierydance': case 'firefang': case 'firepunch': case 'flamethrower':
					if (hasMove['blazekick'] || hasMove['heatwave'] || hasMove['overheat']) rejected = true;
					if ((hasMove['fireblast'] || hasMove['lavaplume']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'fireblast': case 'magmastorm':
					if (hasMove['flareblitz'] && counter.setupType !== 'Special') rejected = true;
					if (hasMove['lavaplume'] && !counter.setupType && !counter['speedsetup']) rejected = true;
					if (hasMove['mindblown'] && !teamDetails.zMove) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['firepunch'] || hasMove['fireblast'] && (counter.setupType || !!counter['speedsetup'])) rejected = true;
					break;
				case 'overheat':
					if (hasMove['fireblast'] || hasMove['flareblitz'] || hasMove['lavaplume']) rejected = true;
					break;
				case 'hurricane':
					if (hasMove['bravebird']) rejected = true;
					break;
				case 'hex':
					if (!hasMove['willowisp']) rejected = true;
					break;
				case 'shadowball':
					if (hasMove['darkpulse'] || hasMove['hex'] && hasMove['willowisp']) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['shadowforce'] || hasMove['shadowsneak']) rejected = true;
					if (hasMove['shadowball'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'shadowsneak':
					if (hasType['Ghost'] && template.types.length > 1 && counter.stab < 2) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['petaldance'] || hasMove['powerwhip'] || (hasMove['seedbomb'] && !isDoubles)) rejected = true;
					if (hasMove['leafstorm'] && counter.Special < 4 && !counter.setupType && !hasMove['trickroom']) rejected = true;
					break;
				case 'leafblade': case 'woodhammer':
					if (hasMove['gigadrain'] && counter.setupType !== 'Physical') rejected = true;
					if (hasMove['hornleech'] && counter.Physical < 4) rejected = true;
					break;
				case 'leafstorm':
					if (hasMove['trickroom'] || counter['Grass'] > 1 && counter.setupType) rejected = true;
					break;
				case 'seedbomb':
					if (isDoubles && hasMove['gigadrain']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'bonemerang': case 'precipiceblades':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'earthpower':
					if (hasMove['earthquake'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'freezedry':
					if (hasMove['icebeam'] || hasMove['icywind'] || counter.stab < 2) rejected = true;
					break;
				case 'bodyslam': case 'return':
					if (hasMove['doubleedge'] || hasMove['glare'] && hasMove['headbutt']) rejected = true;
					if (moveid === 'return' && hasMove['bodyslam']) rejected = true;
					break;
				case 'endeavor':
					if (!isLead && !hasAbility['Defeatist']) rejected = true;
					break;
				case 'explosion':
					if (counter.setupType || (hasAbility['Refrigerate'] && hasMove['freezedry']) || hasMove['wish']) rejected = true;
					break;
				case 'extremespeed':
					if (counter.setupType !== 'Physical' && hasMove['vacuumwave']) rejected = true;
					break;
				case 'facade':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'hiddenpower':
					if (hasMove['rest'] || !counter.stab && counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'hypervoice':
					if (hasMove['blizzard'] || hasMove['return']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'quickattack':
					if (hasType['Normal'] && (!counter.stab || counter['Normal'] > 2)) rejected = true;
					if (hasMove['feint'] || hasType['Rock'] && !!counter.Status) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['raindance'] && !hasMove['sunnyday']) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'acidspray': case 'sludgewave':
					if (hasMove['poisonjab'] || hasMove['sludgebomb']) rejected = true;
					break;
				case 'psychic':
					if (hasMove['psyshock']) rejected = true;
					break;
				case 'psychocut': case 'zenheadbutt':
					if ((hasMove['psychic'] || hasMove['psyshock']) && counter.setupType !== 'Physical') rejected = true;
					if (hasAbility['Contrary'] && !counter.setupType && !!counter['physicalpool']) rejected = true;
					break;
				case 'psyshock':
					let psychic = movePool.indexOf('psychic');
					if (psychic >= 0) this.fastPop(movePool, psychic);
					break;
				case 'headsmash':
					if (hasMove['stoneedge'] || isDoubles && hasMove['rockslide']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if ((hasMove['headsmash'] || hasMove['stoneedge']) && !isDoubles) rejected = true;
					break;
				case 'stoneedge':
					if (isDoubles && hasMove['rockslide']) rejected = true;
					break;
				case 'bulletpunch':
					if (hasType['Steel'] && counter.stab < 2 && !hasAbility['Adaptability'] && !hasAbility['Technician']) rejected = true;
					break;
				case 'flashcannon':
					if ((hasMove['ironhead'] || hasMove['meteormash']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'hydropump':
					if (hasMove['liquidation'] || hasMove['razorshell'] || hasMove['waterfall'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['scald'] && ((counter.Special < 4 && !hasMove['uturn']) || (template.types.length > 1 && counter.stab < 3))) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				case 'scald':
					if (hasMove['liquidation'] || hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;

				// Status:
				case 'electroweb': case 'stunspore': case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['discharge'] || hasMove['spore'] || hasMove['toxic'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
					break;
				case 'glare': case 'headbutt':
					if (hasMove['bodyslam'] || !hasMove['glare']) rejected = true;
					break;
				case 'toxic':
					if (hasMove['hypnosis'] || hasMove['sleeppowder'] || hasMove['willowisp'] || hasMove['yawn']) rejected = true;
					if (counter.setupType || hasMove['flamecharge'] || hasMove['raindance']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['scald']) rejected = true;
					break;
				case 'raindance':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasType['Water'] && !counter['Water']) rejected = true;
					break;
				case 'sunnyday':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Chlorophyll'] && !hasAbility['Flower Gift'] && !hasMove['solarbeam']) rejected = true;
					if (rejected && movePool.length > 1) {
						let solarbeam = movePool.indexOf('solarbeam');
						if (solarbeam >= 0) this.fastPop(movePool, solarbeam);
						if (movePool.length > 1) {
							let weatherball = movePool.indexOf('weatherball');
							if (weatherball >= 0) this.fastPop(movePool, weatherball);
						}
					}
					break;
				case 'milkdrink': case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'synthesis':
					if (hasMove['leechseed'] || hasMove['rest'] || hasMove['wish']) rejected = true;
					break;
				case 'safeguard':
					if (hasMove['destinybond']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['dracometeor'] || hasMove['leafstorm'] && !hasAbility['Contrary']) rejected = true;
					if (hasMove['pursuit'] || hasMove['rest'] || hasMove['taunt'] || hasMove['uturn'] || hasMove['voltswitch'] || hasMove['whirlwind']) rejected = true;
					if (movePool.includes('copycat')) rejected = true;
					break;
				case 'powersplit':
					if (hasMove['guardsplit']) rejected = true;
					break;
				case 'wideguard':
					if (hasMove['protect']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && !!counter['speedsetup']) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					// @ts-ignore
					let stabs = counter[template.types[0]] + (counter[template.types[1]] || 0);
					if (!SetupException.includes(moveid) && (!hasType[move.type] || stabs > 1 || counter[move.category] < 2)) rejected = true;
				}
				// @ts-ignore
				if (counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType && counter[counter.setupType] < 2 && (move.category !== 'Status' || !move.flags.heal) && moveid !== 'sleeptalk' && !hasType['Dark'] && !hasMove['darkpulse']) {
					// Reject Status moves only if there is nothing else to reject
					// @ts-ignore
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && template.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				// @ts-ignore
				if (!rejected && (counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3)) &&
					((!counter.stab && !hasMove['nightshade'] && !hasMove['seismictoss'] && (template.types.length > 1 || (template.types[0] !== 'Normal' && template.types[0] !== 'Psychic') || !hasMove['icebeam'] || template.baseStats.spa >= template.baseStats.spd)) ||
					(hasType['Bug'] && (movePool.includes('megahorn') || movePool.includes('pinmissile'))) ||
					((hasType['Dark'] && !counter['Dark'] && !hasAbility['Protean']) || hasMove['suckerpunch'] && !hasAbility['Contrary'] && counter.stab < template.types.length) ||
					(hasType['Dragon'] && !counter['Dragon'] && !hasAbility['Aerilate'] && !hasAbility['Pixilate'] && !hasMove['fly'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Electric'] && (!counter['Electric'] || (hasMove['voltswitch'] && counter.stab < 2)) && !hasAbility['Galvanize']) ||
					(hasType['Fairy'] && !counter['Fairy'] && !hasAbility['Pixilate'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fighting'] && !counter['Fighting'] && (template.baseStats.atk >= 110 || hasAbility['Justified'] || hasAbility['Unburden'] || counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Flying'] && !counter['Flying'] && (hasAbility['Gale Wings'] || hasAbility['Serene Grace'] || (hasType['Normal'] && (movePool.includes('beakblast') || movePool.includes('bravebird'))))) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost'] && !hasAbility['Steelworker']) ||
					(hasType['Grass'] && !counter['Grass'] && !hasType['Fairy'] && !hasType['Poison'] && !hasType['Steel']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice'] && !hasAbility['Refrigerate']) ||
					(hasType['Normal'] && (movePool.includes('boomburst') || hasAbility['Guts'] && movePool.includes('facade'))) ||
					(hasType['Psychic'] && !!counter['Psychic'] && (movePool.includes('psychicfangs') || !hasType['Flying'] && !hasAbility['Pixilate'] && counter.stab < template.types.length)) ||
					(hasType['Rock'] && !counter['Rock'] && !hasType['Fairy'] && (template.baseStats.atk >= 105 || hasAbility['Rock Head'] || counter.setupType === 'Physical')) ||
					(((hasType['Steel'] && (hasAbility['Technician'] || hasMove['trickroom'])) || hasAbility['Steelworker']) && !counter['Steel']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab) && !hasAbility['Protean']) ||
					// @ts-ignore
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					((hasAbility['Aerilate'] || (hasAbility['Galvanize'] && !counter['Electric']) || hasAbility['Pixilate'] || (hasAbility['Refrigerate'] && !hasMove['blizzard'])) && !counter['Normal']) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
					(hasAbility['Psychic Surge'] && !counter['Psychic']) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(hasAbility['Stance Change'] && !counter.setupType && movePool.includes('kingsshield')) ||
					(!counter.recovery && !counter.setupType && !hasMove['healingwish'] && (movePool.includes('recover') || movePool.includes('roost') || movePool.includes('softboiled')) && (counter.Status > 1 || (template.nfe && !!counter['Status']))) ||
					(movePool.includes('stickyweb') && !counter.setupType && !teamDetails.stickyWeb) ||
					(template.requiredMove && movePool.includes(toID(template.requiredMove)))))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && !move.damage && (move.category !== 'Status' || !move.flags.heal) && moveid !== 'judgment' && moveid !== 'sleeptalk') {
						if (move.category === 'Status' || !hasType[move.type] || move.selfSwitch || move.basePower && move.basePower < 40 && !move.multihit) rejected = true;
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && rejected) {
					let sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							rejected = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				if (rejected && (movePool.length - availableHP || availableHP && (moveid === 'hiddenpower' || !hasMove['hiddenpower']))) {
					if (move.category !== 'Status' && !move.damage && !move.flags.charge && (moveid !== 'hiddenpower' || !availableHP)) rejectedPool.push(moves[k]);
					moves.splice(k, 1);
					break;
				}
				if (rejected && rejectedPool.length) {
					moves.splice(k, 1);
					break;
				}
			}
		} while (moves.length < 4 && (movePool.length || rejectedPool.length));

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			if (template.id === 'celesteela') {
				moves[moves.indexOf('heavyslam')] = 'flashcannon';
			} else {
				moves[moves.indexOf('autotomize')] = 'rockpolish';
			}
		}
		if (hasMove['raindance'] && hasMove['thunderbolt'] && !isDoubles) {
			moves[moves.indexOf('thunderbolt')] = 'thunder';
		}
		if (hasMove['workup'] && !counter['Special'] && template.id === 'zeraora') {
			moves[moves.indexOf('workup')] = 'bulkup';
		}

		/**@type {[string, string | undefined, string | undefined]} */
		// @ts-ignore
		let abilities = Object.values(baseTemplate.abilities);
		abilities.sort((a, b) => this.dex.getAbility(b).rating - this.dex.getAbility(a).rating);
		let ability0 = this.dex.getAbility(abilities[0]);
		let ability1 = this.dex.getAbility(abilities[1]);
		let ability2 = this.dex.getAbility(abilities[2]);
		if (abilities[1]) {
			if (abilities[2] && ability1.rating <= ability2.rating && this.randomChance(1, 2)) {
				[ability1, ability2] = [ability2, ability1];
			}
			if (ability0.rating <= ability1.rating && this.randomChance(1, 2)) {
				[ability0, ability1] = [ability1, ability0];
			} else if (ability0.rating - 0.6 <= ability1.rating && this.randomChance(2, 3)) {
				[ability0, ability1] = [ability1, ability0];
			}
			ability = ability0.name;

			let rejectAbility;
			do {
				rejectAbility = false;
				if (counterAbilities.includes(ability)) {
					// Adaptability, Contrary, Iron Fist, Skill Link, Strong Jaw
					// @ts-ignore
					rejectAbility = !counter[toID(ability)];
				} else if (ateAbilities.includes(ability)) {
					rejectAbility = !counter['Normal'];
				} else if (ability === 'Battle Armor' || ability === 'Sturdy') {
					rejectAbility = !!counter['recoil'] && !counter['recovery'];
				} else if (ability === 'Battle Bond' || ability === 'Flare Boost' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Chlorophyll' || ability === 'Leaf Guard') {
					rejectAbility = template.baseStats.spe > 100 || abilities.includes('Harvest') || (!hasMove['sunnyday'] && !teamDetails['sun']);
				} else if (ability === 'Competitive') {
					rejectAbility = !counter['Special'] || (hasMove['rest'] && hasMove['sleeptalk']);
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = !counter['Physical'] || hasMove['dragontail'];
				} else if (ability === 'Download' || ability === 'Hyper Cutter') {
					rejectAbility = template.nfe;
				} else if (ability === 'Gluttony') {
					rejectAbility = !hasMove['bellydrum'];
				} else if (ability === 'Harvest') {
					rejectAbility = abilities.includes('Frisk');
				} else if (ability === 'Hustle') {
					rejectAbility = counter.Physical < 2;
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = template.baseStats.spe > 100 || !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Ice Body' || ability === 'Slush Rush' || ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Immunity' || ability === 'Snow Warning') {
					rejectAbility = hasMove['facade'] || hasMove['hypervoice'];
				} else if (ability === 'Intimidate') {
					rejectAbility = hasMove['bodyslam'] || hasMove['rest'] || abilities.includes('Reckless') && counter['recoil'] > 1;
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Liquid Voice') {
					rejectAbility = !counter['sound'];
				} else if (ability === 'Magic Guard' || ability === 'Speed Boost') {
					rejectAbility = hasAbility['Tinted Lens'] && (!counter['Status'] || hasMove['uturn']);
				} else if (ability === 'Magician') {
					rejectAbility = hasMove['switcheroo'];
				} else if (ability === 'Magnet Pull') {
					rejectAbility = !!counter['Normal'] || !hasType['Electric'] && !hasMove['earthpower'];
				} else if (ability === 'Mold Breaker') {
					rejectAbility = hasMove['acrobatics'] || abilities.includes('Adaptability') || abilities.includes('Sheer Force') && !!counter['sheerforce'];
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = abilities.includes('Technician') && !!counter['technician'];
				} else if (ability === 'Power Construct') {
					rejectAbility = template.forme === '10%' && !hasMove['substitute'];
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Pressure' || ability === 'Synchronize') {
					rejectAbility = counter.Status < 2 || !!counter['recoil'] || template.isMega;
				} else if (ability === 'Regenerator') {
					rejectAbility = abilities.includes('Magic Guard');
				} else if (ability === 'Quick Feet') {
					rejectAbility = hasMove['bellydrum'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'] || template.isMega;
				} else if (ability === 'Sand Force' || ability === 'Sand Rush' || ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Scrappy') {
					rejectAbility = !template.types.includes('Normal');
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || template.species === 'Blissey';
				} else if (ability === 'Sheer Force') {
					rejectAbility = !counter['sheerforce'] || abilities.includes('Guts') || hasMove['doubleedge'] || template.isMega;
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['flamecharge'];
				} else if (ability === 'Solar Power') {
					rejectAbility = !counter['Special'] || !teamDetails['sun'] || template.isMega;
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'] || template.isMega;
				} else if (ability === 'Sweet Veil') {
					rejectAbility = hasType['Grass'];
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || hasMove['tailslap'] || template.isMega;
				} else if (ability === 'Tinted Lens') {
					rejectAbility = (abilities.includes('Magic Guard') && !!counter['Status']) || abilities.includes('Prankster') || hasMove['protect'] || counter['damage'] >= counter.damagingMoves.length || (counter.Status > 2 && !counter.setupType);
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'] || template.isMega;
				} else if (ability === 'Unaware') {
					rejectAbility = hasMove['stealthrock'];
				} else if (ability === 'Unburden') {
					rejectAbility = abilities.includes('Prankster') || (!counter.setupType && !hasMove['acrobatics']) || template.isMega;
				} else if (ability === 'Water Absorb') {
					rejectAbility = abilities.includes('Volt Absorb') || hasMove['raindance'];
				} else if (ability === 'Weak Armor') {
					rejectAbility = counter.setupType !== 'Physical';
				}

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating >= 1) {
						ability = ability1.name;
					} else if (ability === ability1.name && abilities[2] && ability2.rating >= 1) {
						ability = ability2.name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Guts') && ability !== 'Quick Feet' && (hasMove['facade'] || (hasMove['protect'] && !isDoubles) || (hasMove['rest'] && hasMove['sleeptalk']))) {
				ability = 'Guts';
			} else if (abilities.includes('Triage') && !!counter['drain']) {
				ability = 'Triage';
			} else if (isDoubles && abilities.includes('Intimidate')) {
				ability = 'Intimidate';
			}
			if (template.species === 'Ambipom' && !counter['technician']) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				ability = 'Pickup';
			} else if (template.species === 'Lopunny' && hasMove['switcheroo'] && this.randomChance(2, 3)) {
				ability = 'Klutz';
			}
		} else {
			ability = ability0.name;
		}

		item = !isDoubles ? 'Leftovers' : 'Sitrus Berry';
		if (template.requiredItems) {
			// @ts-ignore
			if (template.baseSpecies === 'Arceus' && (hasMove['judgment'] || !counter[template.types[0]] || teamDetails.zMove)) {
				// Judgment doesn't change type with Z-Crystals
				item = template.requiredItems[0];
			} else {
				item = this.sample(template.requiredItems);
			}

		// First, the extra high-priority items
		} else if (template.baseSpecies === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Decidueye' && hasMove['spiritshackle'] && counter.setupType && !teamDetails.zMove) {
			item = 'Decidium Z';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (template.species === 'Deoxys-Attack') {
			item = (isLead && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Genesect' && hasMove['technoblast']) {
			item = 'Douse Drive';
			species = 'Genesect-Douse';
		} else if (template.species === 'Kommo-o' && !teamDetails.zMove) {
			item = hasMove['clangingscales'] ? 'Kommonium Z' : 'Dragonium Z';
		} else if (template.species === 'Lycanroc' && hasMove['stoneedge'] && counter.setupType && !teamDetails.zMove) {
			item = 'Lycanium Z';
		} else if (template.species === 'Marshadow' && hasMove['spectralthief'] && counter.setupType && !teamDetails.zMove) {
			item = 'Marshadium Z';
		} else if (template.species === 'Mimikyu' && hasMove['playrough'] && counter.setupType && !teamDetails.zMove) {
			item = 'Mimikium Z';
		} else if ((template.species === 'Necrozma-Dusk-Mane' || template.species === 'Necrozma-Dawn-Wings') && !teamDetails.zMove) {
			if (hasMove['autotomize'] && hasMove['sunsteelstrike']) {
				item = 'Solganium Z';
			} else if (hasMove['trickroom'] && hasMove['moongeistbeam']) {
				item = 'Lunalium Z';
			} else {
				item = 'Ultranecrozium Z';
				if (!hasMove['photongeyser']) {
					for (const moveid of moves) {
						let move = this.dex.getMove(moveid);
						if (move.category === 'Status' || hasType[move.type]) continue;
						moves[moves.indexOf(moveid)] = 'photongeyser';
						break;
					}
				}
			}
		} else if (template.species === 'Pikachu') {
			if (!isDoubles) species = 'Pikachu' + this.sample(['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner']);
			if (species !== 'Pikachu') ability = 'Static';
			item = 'Light Ball';
		} else if (template.species === 'Porygon-Z' && hasMove['nastyplot'] && !hasMove['trick'] && !['nastyplot', 'icebeam', 'triattack'].includes(moves[0]) && !teamDetails.zMove && !isDoubles) {
			moves[moves.indexOf('nastyplot')] = 'conversion';
			moves[moves.indexOf('triattack')] = 'recover';
			item = 'Normalium Z';
		} else if (template.species === 'Raichu-Alola' && hasMove['thunderbolt'] && counter.setupType && !teamDetails.zMove) {
			item = 'Aloraichium Z';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unfezant' && counter['Physical'] >= 2) {
			item = 'Scope Lens';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wobbuffet') {
			if (hasMove['destinybond']) {
				item = 'Custap Berry';
			} else {
				item = isDoubles || this.randomChance(1, 2) ? 'Sitrus Berry' : 'Leftovers';
			}
		} else if (ability === 'Harvest' || ability === 'Emergency Exit' && !!counter['Status']) {
			item = 'Sitrus Berry';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (ability === 'Klutz') {
				item = 'Assault Vest';
			} else if (template.baseStats.spe >= 60 && template.baseStats.spe <= 108) {
				item = 'Choice Scarf';
			} else {
				item = (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		} else if (template.evos.length) {
			item = (ability === 'Technician' && counter.Physical >= 4) ? 'Choice Band' : 'Eviolite';
		} else if (hasMove['bellydrum']) {
			if (ability === 'Gluttony') {
				item = this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
			} else if (template.baseStats.spe <= 50 && !teamDetails.zMove && this.randomChance(1, 2)) {
				item = 'Normalium Z';
			} else {
				item = 'Sitrus Berry';
			}
		} else if (hasMove['copycat'] && counter.Physical >= 3) {
			item = 'Choice Band';
		} else if (hasMove['geomancy']) {
			item = 'Power Herb';
		} else if (hasMove['shellsmash']) {
			item = (ability === 'Solid Rock' && !!counter['priority']) ? 'Weakness Policy' : 'White Herb';
		} else if ((ability === 'Guts' || hasMove['facade']) && !hasMove['sleeptalk']) {
			item = (hasType['Fire'] || ability === 'Quick Feet' || ability === 'Toxic Boost') ? 'Toxic Orb' : 'Flame Orb';
		} else if ((ability === 'Magic Guard' && counter.damagingMoves.length > 1) || (ability === 'Sheer Force' && !!counter['sheerforce'])) {
			item = 'Life Orb';
		} else if (ability === 'Poison Heal') {
			item = 'Toxic Orb';
		} else if (ability === 'Unburden') {
			item = hasMove['fakeout'] ? 'Normal Gem' : 'Sitrus Berry';
		} else if (hasMove['acrobatics']) {
			item = '';
		} else if (((hasMove['darkpulse'] && ability === 'Fur Coat' && counter.setupType) || (hasMove['suckerpunch'] && ability === 'Moxie' && counter['Dark'] < 2)) && !teamDetails.zMove) {
			item = 'Darkinium Z';
		} else if (hasMove['outrage'] && counter.setupType && !hasMove['fly'] && !teamDetails.zMove) {
			item = 'Dragonium Z';
		} else if (hasMove['electricterrain'] || ability === 'Electric Surge' && hasMove['thunderbolt']) {
			item = 'Electrium Z';
		} else if (hasMove['fleurcannon'] && !!counter['speedsetup'] && !teamDetails.zMove) {
			item = 'Fairium Z';
		} else if (((hasMove['focusblast'] && hasMove['nastyplot'] && hasType['Fighting']) || (hasMove['reversal'] && hasMove['substitute'])) && !teamDetails.zMove) {
			item = 'Fightinium Z';
		} else if ((hasMove['magmastorm'] || hasMove['mindblown'] && !!counter['Status']) && !teamDetails.zMove) {
			item = 'Firium Z';
		} else if (!teamDetails.zMove && (hasMove['fly'] || (hasMove['hurricane'] && template.baseStats.spa >= 125 && (!!counter.Status || hasMove['superpower'])) || ((hasMove['bounce'] || hasMove['bravebird']) && counter.setupType))) {
			item = 'Flyinium Z';
		} else if (hasMove['sleeppowder'] && hasType['Grass'] && counter.setupType && template.baseStats.spe <= 70 && !teamDetails.zMove) {
			item = 'Grassium Z';
		} else if (hasMove['dig'] && !teamDetails.zMove) {
			item = 'Groundium Z';
		} else if (hasMove['happyhour'] || hasMove['holdhands'] || hasMove['encore'] && ability === 'Contrary') {
			item = 'Normalium Z';
		} else if (hasMove['photongeyser'] && counter.setupType && !teamDetails.zMove) {
			item = 'Psychium Z';
		} else if (hasMove['hydropump'] && ability === 'Battle Bond' && hasMove['uturn'] && !teamDetails.zMove) {
			item = 'Waterium Z';
		} else if (hasMove['solarbeam'] && ability !== 'Drought' && !hasMove['sunnyday'] && !teamDetails['sun']) {
			item = !teamDetails.zMove ? 'Grassium Z' : 'Power Herb';
		} else if ((hasMove['hail'] || (hasMove['blizzard'] && ability !== 'Snow Warning')) && !teamDetails.zMove) {
			item = 'Icium Z';
		} else if (hasMove['raindance']) {
			if (template.baseSpecies === 'Castform' && !teamDetails.zMove) {
				item = 'Waterium Z';
			} else {
				item = (ability === 'Forecast') ? 'Damp Rock' : 'Life Orb';
			}
		} else if (hasMove['sunnyday']) {
			if ((template.baseSpecies === 'Castform' || template.baseSpecies === 'Cherrim') && !teamDetails.zMove) {
				item = 'Firium Z';
			} else {
				item = (ability === 'Forecast') ? 'Heat Rock' : 'Life Orb';
			}
		} else if (hasMove['auroraveil'] || hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin' && ability !== 'Shadow Tag') {
			item = 'Chesto Berry';

		// Medium priority
		} else if ((ability === 'Speed Boost' || ability === 'Stance Change' || template.species === 'Pheromosa') && counter.Physical + counter.Special > 2 && !hasMove['uturn']) {
			item = 'Life Orb';
		} else if (counter.Physical >= 4 && !hasMove['bodyslam'] && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch'] && !isDoubles) {
			item = (template.baseStats.atk >= 100 || ability === 'Huge Power') && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['clearsmog'] && !hasMove['fierydance'] && !isDoubles) {
			item = template.baseStats.spa >= 100 && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && ability !== 'Tinted Lens' && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (counter.Physical >= 3 && hasMove['defog'] && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && !hasMove['foulplay'] && !isDoubles) {
			item = 'Choice Scarf';
		} else if (counter.Special >= 3 && hasMove['uturn'] && !hasMove['acidspray'] && !isDoubles) {
			item = 'Choice Specs';
		} else if ((ability === 'Drizzle' || ability === 'Slow Start' || hasMove['bite'] || hasMove['clearsmog'] || hasMove['curse'] || hasMove['protect'] || hasMove['sleeptalk'] || template.species.includes('Rotom-')) && !isDoubles) {
			item = 'Leftovers';
		} else if ((hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = (ability === 'Defeatist') ? 'Expert Belt' : 'Focus Sash';
		} else if (hasMove['outrage'] && counter.setupType) {
			item = 'Lum Berry';
		} else if (isDoubles && counter.damagingMoves.length >= 4 && template.baseStats.spe >= 60 && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['suckerpunch'] && ability !== 'Multiscale' && ability !== 'Sturdy') {
			item = 'Life Orb';
		} else if (isDoubles && this.dex.getEffectiveness('Ice', template) >= 2) {
			item = 'Yache Berry';
		} else if (isDoubles && this.dex.getEffectiveness('Rock', template) >= 2) {
			item = 'Charti Berry';
		} else if (isDoubles && this.dex.getEffectiveness('Fire', template) >= 2) {
			item = 'Occa Berry';
		} else if (isDoubles && this.dex.getImmunity('Fighting', template) && this.dex.getEffectiveness('Fighting', template) >= 2) {
			item = 'Chople Berry';
		} else if (hasMove['substitute']) {
			item = counter.damagingMoves.length > 2 && !!counter['drain'] ? 'Life Orb' : 'Leftovers';
		} else if (this.dex.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.randomChance(1, 2)) {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.spd >= 50 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 235) {
			item = 'Assault Vest';
		} else if ((template.species === 'Latias' || template.species === 'Latios') && !!counter['Dragon'] && !!counter['Psychic']) {
			item = 'Soul Dew';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 4) {
			item = (!!counter['Dragon'] || !!counter['Dark'] || !!counter['Normal']) ? 'Life Orb' : 'Expert Belt';
		} else if (counter.damagingMoves.length >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 300) {
			item = 'Weakness Policy';
		} else if (isLead && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd <= 275) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (hasMove['stickyweb'] && ability === 'Sturdy') {
			item = 'Mental Herb';
		} else if (ability === 'Serene Grace' && hasMove['airslash'] && template.baseStats.spe > 100) {
			item = 'Metronome';
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		} else if (counter.damagingMoves.length >= 3 && ability !== 'Sturdy' && !hasMove['acidspray'] && !hasMove['dragontail'] && !hasMove['foulplay'] && !hasMove['rapidspin'] && !hasMove['superfang'] && !hasMove['uturn']) {
			if (!!counter['speedsetup'] || hasMove['trickroom'] || template.baseStats.spe > 40 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd <= 275) item = 'Life Orb';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		let level;

		if (!isDoubles) {
			/** @type {{[tier: string]: number}} */
			let levelScale = {
				'(PU)': 89,
				PU: 88,
				PUBL: 87,
				NU: 86,
				NUBL: 85,
				RU: 84,
				RUBL: 83,
				UU: 82,
				UUBL: 81,
				'(OU)': 80,
				OU: 80,
				Uber: 78,
			};
			/** @type {{[species: string]: number}} */
			let customScale = {
				// Banned Ability
				Dugtrio: 82, Gothitelle: 82, Pelipper: 84, Politoed: 84, Wobbuffet: 82,

				// Holistic judgement
				'Floette-Eternal': 80, 'Genesect-Douse': 80,
				Castform: 100, Delibird: 100, Spinda: 100, Unown: 100,
			};
			level = levelScale[template.tier] || 90;
			if (customScale[species]) level = customScale[species];

			// Custom level based on moveset
			if (template.species === 'Zygarde-10%' && ability === 'Power Construct') level = 80;
		} else {
			// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
			// Every 10.34 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
			let baseStats = template.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (template.baseSpecies === 'Wishiwashi') baseStats = this.dex.getTemplate('wishiwashischool').baseStats;

			let bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			// Adjust levels of mons based on abilities (Pure Power, Sheer Force, etc.) and also Eviolite
			// For the stat boosted, treat the Pokemon's base stat as if it were multiplied by the boost. (Actual effective base stats are higher.)
			let templateAbility = (baseTemplate === template ? ability : template.abilities[0]);
			if (templateAbility === 'Huge Power' || templateAbility === 'Pure Power') {
				bst += baseStats.atk;
			} else if (templateAbility === 'Parental Bond') {
				bst += 0.25 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Protean') {
				bst += 0.3 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Fur Coat') {
				bst += baseStats.def;
			} else if (templateAbility === 'Slow Start') {
				bst -= baseStats.atk / 2 + baseStats.spe / 2;
			} else if (templateAbility === 'Truant') {
				bst *= 2 / 3;
			}
			if (item === 'Eviolite') {
				bst += 0.5 * (baseStats.def + baseStats.spd);
			} else if (item === 'Light Ball') {
				bst += baseStats.atk + baseStats.spa;
			}
			level = 70 + Math.floor(((600 - this.dex.clampIntRange(bst, 300, 600)) / 10.34));
		}

		// Prepare optimal HP
		let srWeakness = this.dex.getEffectiveness('Rock', template);
		while (evs.hp > 1) {
			let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hasMove['substitute'] && hasMove['reversal']) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (hasMove['substitute'] && (item === 'Petaya Berry' || item === 'Sitrus Berry' || ability === 'Power Construct' && item !== 'Leftovers')) {
				// Three Substitutes should activate Petaya Berry for Dedenne
				// Two Substitutes should activate Sitrus Berry or Power Construct
				if (hp % 4 === 0) break;
			} else if (hasMove['bellydrum'] && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['copycat'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (ability === 'Beast Boost' && counter.Special < 1) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		if (hasMove['gyroball'] || hasMove['metalburst'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		return {
			name: template.baseSpecies,
			species: species,
			gender: template.gender,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: this.randomChance(1, 1024),
		};
	}

	/**
	 * @param {Template} template
	 * @param {number} slot
	 * @param {RandomTeamsTypes.FactoryTeamDetails} teamData
	 * @param {string} tier
	 * @return {RandomTeamsTypes.RandomFactorySet | false}
	 */
	randomFactorySet(template, slot, teamData, tier) {
		let speciesId = toID(template.species);
		// let flags = this.randomFactorySets[tier][speciesId].flags;
		let setList = this.randomFactorySets[tier][speciesId].sets;

		/**@type {{[k: string]: number}} */
		let itemsMax = {'choicespecs': 1, 'choiceband': 1, 'choicescarf': 1};
		/**@type {{[k: string]: number}} */
		let movesMax = {'rapidspin': 1, 'batonpass': 1, 'stealthrock': 1, 'defog': 1, 'spikes': 1, 'toxicspikes': 1};
		let requiredMoves = {'stealthrock': 'hazardSet', 'rapidspin': 'hazardClear', 'defog': 'hazardClear'};
		let weatherAbilitiesRequire = {
			'hydration': 'raindance', 'swiftswim': 'raindance',
			'leafguard': 'sunnyday', 'solarpower': 'sunnyday', 'chlorophyll': 'sunnyday',
			'sandforce': 'sandstorm', 'sandrush': 'sandstorm', 'sandveil': 'sandstorm',
			'slushrush': 'hail', 'snowcloak': 'hail',
		};
		let weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		/**@type {{set: AnyObject, moveVariants?: number[]}[]} */
		let effectivePool = [];
		let priorityPool = [];
		for (const curSet of setList) {
			let item = this.dex.getItem(curSet.item);
			if (teamData.megaCount > 0 && item.megaStone) continue; // reject 2+ mega stones
			if (teamData.zCount && teamData.zCount > 0 && item.zMove) continue; // reject 2+ Z stones
			if (itemsMax[item.id] && teamData.has[item.id] >= itemsMax[item.id]) continue;

			let ability = this.dex.getAbility(curSet.ability);
			// @ts-ignore
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			let reject = false;
			let hasRequiredMove = false;
			let curSetVariants = [];
			for (const move of curSet.moves) {
				let variantIndex = this.random(move.length);
				let moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				// @ts-ignore
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return false;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		let setData = this.sample(effectivePool);
		let moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		let item = Array.isArray(setData.set.item) ? this.sample(setData.set.item) : setData.set.item;
		let ability = Array.isArray(setData.set.ability) ? this.sample(setData.set.ability) : setData.set.ability;
		let nature = Array.isArray(setData.set.nature) ? this.sample(setData.set.nature) : setData.set.nature;

		return {
			name: setData.set.name || template.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || template.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: item || '',
			ability: ability || template.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level ? setData.set.level : tier === "LC" ? 5 : 100,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: Object.assign({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, setData.set.evs),
			ivs: Object.assign({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, setData.set.ivs),
			nature: nature || 'Serious',
			moves: moves,
		};
	}

	/**
	 * @param {PlayerOptions} [side]
	 * @param {number} [depth]
	 * @return {RandomTeamsTypes.RandomFactorySet[]}
	 */
	randomFactoryTeam(side, depth = 0) {
		let forceResult = (depth >= 4);

		// The teams generated depend on the tier choice in such a way that
		// no exploitable information is leaked from rolling the tier in getTeam(p1).
		let availableTiers = ['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC', 'Mono'];
		if (!this.FactoryTier) this.FactoryTier = this.sample(availableTiers);
		const chosenTier = this.FactoryTier;

		/**@type {{[k: string]: number}} */
		const tierValues = {
			'Uber': 5,
			'OU': 4, 'UUBL': 4,
			'UU': 3, 'RUBL': 3,
			'RU': 2, 'NUBL': 2,
			'NU': 1, 'PUBL': 1,
			'PU': 0,
		};

		let pokemon = [];
		let pokemonPool = Object.keys(this.randomFactorySets[chosenTier]);

		let typePool = Object.keys(this.dex.data.TypeChart);
		const type = this.sample(typePool);

		/**@type {TeamData} */
		let teamData = {typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {}};
		let requiredMoveFamilies = ['hazardSet', 'hazardClear'];
		/**@type {{[k: string]: string}} */
		let requiredMoves = {'stealthrock': 'hazardSet', 'rapidspin': 'hazardClear', 'defog': 'hazardClear'};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesSet = {'drizzle': 'raindance', 'drought': 'sunnyday', 'snowwarning': 'hail', 'sandstream': 'sandstorm'};
		/**@type {{[k: string]: string[]}} */
		let resistanceAbilities = {
			'dryskin': ['Water'], 'waterabsorb': ['Water'], 'stormdrain': ['Water'],
			'flashfire': ['Fire'], 'heatproof': ['Fire'],
			'lightningrod': ['Electric'], 'motordrive': ['Electric'], 'voltabsorb': ['Electric'],
			'sapsipper': ['Grass'],
			'thickfat': ['Ice', 'Fire'],
			'levitate': ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.dex.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Lessen the need of deleting sets of Pokemon after tier shifts
			if (chosenTier in tierValues && template.tier in tierValues && tierValues[template.tier] > tierValues[chosenTier]) continue;

			let speciesFlags = this.randomFactorySets[chosenTier][template.speciesid].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[template.baseSpecies]) continue;

			// Limit the number of Megas to one
			if (teamData.megaCount >= 1 && speciesFlags.megaOnly) continue;

			let set = this.randomFactorySet(template, pokemon.length, teamData, chosenTier);
			if (!set) continue;

			let itemData = this.dex.getItem(set.item);

			// Actually limit the number of Megas to one
			if (teamData.megaCount >= 1 && itemData.megaStone) continue;

			// Limit the number of Z moves to one
			if (teamData.zCount >= 1 && itemData.zMove) continue;

			let types = template.types;

			// Enforce Monotype
			if (chosenTier === 'Mono') {
				// Prevents Mega Evolutions from breaking the type limits
				if (itemData.megaStone) {
					let megaTemplate = this.dex.getTemplate(itemData.megaStone);
					if (types.length > megaTemplate.types.length) types = [template.types[0]];
					// Only check the second type because a Mega Evolution should always share the first type with its base forme.
					if (megaTemplate.types[1] && types[1] && megaTemplate.types[1] !== types[1]) {
						types = [megaTemplate.types[0]];
					}
				}
				if (!types.includes(type)) continue;
			} else {
			// If not Monotype, limit to two of each type
				let skip = false;
				for (const type of types) {
					if (teamData.typeCount[type] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit 1 of any type combination
				let typeCombo = types.slice().sort().join();
				if (set.ability + '' === 'Drought' || set.ability + '' === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
					typeCombo = set.ability + '';
				}
				if (typeCombo in teamData.typeComboCount) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);
			let typeCombo = types.slice().sort().join();
			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[template.baseSpecies] = 1;

			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) teamData.zCount++;
			if (itemData.id in teamData.has) {
				teamData.has[itemData.id]++;
			} else {
				teamData.has[itemData.id] = 1;
			}

			let abilityData = this.dex.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				let moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (let typeName in this.dex.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id] && resistanceAbilities[abilityData.id].includes(typeName) || !this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				let typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomFactoryTeam(side, ++depth);
			}
			for (let type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}

	/**
	 * @param {Template} template
	 * @param {number} slot
	 * @param {RandomTeamsTypes.FactoryTeamDetails} teamData
	 * @return {RandomTeamsTypes.RandomFactorySet | false}
	 */
	randomBSSFactorySet(template, slot, teamData) {
		let speciesId = toID(template.species);
		// let flags = this.randomBSSFactorySets[tier][speciesId].flags;
		let setList = this.randomBSSFactorySets[speciesId].sets;

		/**@type {{[k: string]: number}} */
		let movesMax = {'batonpass': 1, 'stealthrock': 1, 'spikes': 1, 'toxicspikes': 1, 'doubleedge': 1, 'trickroom': 1};
		/**@type {{[k: string]: string}} */
		let requiredMoves = {};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesRequire = {
			'swiftswim': 'raindance',
			'sandrush': 'sandstorm', 'sandveil': 'sandstorm',
		};
		let weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		/**@type {{set: AnyObject, moveVariants?: number[], itemVariants?: number, abilityVariants?: number}[]} */
		let effectivePool = [];
		let priorityPool = [];
		for (const curSet of setList) {
			let item = this.dex.getItem(curSet.item);
			if (teamData.megaCount > 1 && item.megaStone) continue; // reject 3+ mega stones
			if (teamData.zCount && teamData.zCount > 1 && item.zMove) continue; // reject 3+ Z stones
			if (teamData.has[item.id]) continue; // Item clause

			let ability = this.dex.getAbility(curSet.ability);
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			if (curSet.species === 'Aron' && teamData.weather !== 'sandstorm') continue; // reject Aron without a Sand Stream user

			let reject = false;
			let hasRequiredMove = false;
			let curSetVariants = [];
			for (const move of curSet.moves) {
				let variantIndex = this.random(move.length);
				let moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return false;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		let setData = this.sample(effectivePool);
		let moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.nickname || setData.set.name || template.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || template.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: setData.set.item || '',
			ability: setData.set.ability || template.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level || 50,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: Object.assign({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, setData.set.evs),
			ivs: Object.assign({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, setData.set.ivs),
			nature: setData.set.nature || 'Serious',
			moves: moves,
		};
	}

	/**
	 * @param {PlayerOptions} [side]
	 * @param {number} [depth]
	 * @return {RandomTeamsTypes.RandomFactorySet[]}
	 */
	randomBSSFactoryTeam(side, depth = 0) {
		let forceResult = (depth >= 4);

		let pokemon = [];

		let pokemonPool = Object.keys(this.randomBSSFactorySets);

		/**@type {TeamData} */
		let teamData = {typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0, eeveeLimCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {}};
		/**@type {string[]} */
		let requiredMoveFamilies = [];
		/**@type {{[k: string]: string}} */
		let requiredMoves = {};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesSet = {'drizzle': 'raindance', 'drought': 'sunnyday', 'snowwarning': 'hail', 'sandstream': 'sandstorm'};
		/**@type {{[k: string]: string[]}} */
		let resistanceAbilities = {
			'waterabsorb': ['Water'],
			'flashfire': ['Fire'],
			'lightningrod': ['Electric'], 'voltabsorb': ['Electric'],
			'thickfat': ['Ice', 'Fire'],
			'levitate': ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.dex.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			let speciesFlags = this.randomBSSFactorySets[template.speciesid].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[template.baseSpecies]) continue;

			// Limit the number of Megas + Z-moves to 3
			if (teamData.megaCount + teamData.zCount >= 3 && speciesFlags.megaOnly) continue;

			// Limit 2 of any type
			let types = template.types;
			let skip = false;
			for (const type of types) {
				if (teamData.typeCount[type] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Restrict Eevee with certain Pokemon
			if (speciesFlags.limEevee) teamData.eeveeLimCount++;
			if (teamData.eeveeLimCount >= 1 && speciesFlags.limEevee) continue;

			let set = this.randomBSSFactorySet(template, pokemon.length, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in teamData.typeComboCount) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[template.baseSpecies] = 1;

			// Limit Mega and Z-move
			let itemData = this.dex.getItem(set.item);
			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) teamData.zCount++;
			teamData.has[itemData.id] = 1;

			let abilityData = this.dex.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				let moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (let typeName in this.dex.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id] && resistanceAbilities[abilityData.id].includes(typeName) || !this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				let typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomBSSFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomBSSFactoryTeam(side, ++depth);
			}
			for (let type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomBSSFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}
}

module.exports = RandomGen7Teams;
