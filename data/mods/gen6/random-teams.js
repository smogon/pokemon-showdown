'use strict';

const RandomGen7Teams = require('../gen7/random-teams');

class RandomGen6Teams extends RandomGen7Teams {
	/**
	 * @param {Format | string} format
	 * @param {?PRNG | [number, number, number, number]} [prng]
	 */
	constructor(format, prng) {
		super(format, prng);
		/**@type {AnyObject} */
		// @ts-ignore
		this.randomFactorySets = require('./factory-sets.json');
	}

	/**
	 * @param {string | Template} template
	 * @param {RandomTeamsTypes.TeamDetails} [teamDetails]
	 * @param {boolean} [isLead]
	 * @return {RandomTeamsTypes.RandomSet}
	 */
	randomSet(template, teamDetails = {}, isLead = false) {
		let baseTemplate = (template = this.dex.getTemplate(template));
		let species = template.species;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.dex.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			Monitor.crashlog(err, 'The gen 6 randbat set generator');
		}

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}
		let battleForme = this.checkBattleForme(template);
		if (battleForme && battleForme.randomBattleMoves && template.otherFormes && (battleForme.isMega ? !teamDetails.megaStone : this.random(2))) {
			template = this.dex.getTemplate(template.otherFormes.length >= 2 ? this.sample(template.otherFormes) : template.otherFormes[0]);
		}

		let movePool = (template.randomBattleMoves ? template.randomBattleMoves.slice() : template.learnset ? Object.keys(template.learnset) : []);
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
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = ['closecombat', 'diamondstorm', 'extremespeed', 'suckerpunch', 'superpower', 'dracometeor'];

		let counterAbilities = ['Adaptability', 'Contrary', 'Iron Fist', 'Skill Link', 'Strong Jaw'];
		let ateAbilities = ['Aerilate', 'Pixilate', 'Refrigerate'];

		/**@type {{[k: string]: boolean}} */
		let hasMove = {};
		let counter;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const setMoveid of moves) {
				if (setMoveid.startsWith('hiddenpower')) {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[setMoveid] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				if (moveid.substr(0, 11) === 'hiddenpower') {
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
			for (const [i, setMoveid] of moves.entries()) {
				let move = this.dex.getMove(setMoveid);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Not very useful without their supporting moves
				case 'cottonguard': case 'defendorder':
					if (!counter['recovery'] && !hasMove['rest']) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
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
					if (counter.setupType || hasMove['spikes'] || hasMove['stealthrock'] || (hasMove['rest'] && hasMove['sleeptalk']) || teamDetails.defog) rejected = true;
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
					if (counter.damagingMoves.length > 1 || counter.setupType) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && !hasMove['wish']) rejected = true;
					if (hasMove['rest'] || hasMove['lightscreen'] && hasMove['reflect']) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || counter.Status > 1 || counter['Dark'] > 2 || hasMove['knockoff'] && !hasType['Dark']) rejected = true;
					if (hasMove['nightslash']) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || teamDetails.rapidSpin) rejected = true;
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
					if (counter.setupType || !!counter['speedsetup'] || hasMove['raindance'] || hasMove['uturn']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite': case 'bugbuzz': case 'infestation': case 'signalbeam':
					if (hasMove['uturn'] && !counter.setupType && !hasAbility['Tinted Lens']) rejected = true;
					break;
				case 'darkpulse':
					if ((hasMove['crunch'] || hasMove['knockoff'] || hasMove['hyperspacefury']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'suckerpunch':
					if (counter.damagingMoves.length < 2 || hasMove['glare'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (counter['Dark'] > 1 && !hasType['Dark']) rejected = true;
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
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					break;
				case 'dazzlinggleam':
					if (hasMove['playrough'] && counter.setupType !== 'Special') rejected = true;
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
					if ((hasMove['aurasphere'] || hasMove['focusblast'] || movePool.includes('aurasphere')) && counter.setupType === 'Special') rejected = true;
					if (hasMove['bulkup'] && hasMove['drainpunch']) rejected = true;
					break;
				case 'machpunch':
					if (hasType['Fighting'] && counter.stab < 2 && !hasAbility['Technician']) rejected = true;
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
				case 'fierydance': case 'firefang': case 'flamethrower':
					if (hasMove['blazekick'] || hasMove['overheat']) rejected = true;
					if ((hasMove['fireblast'] || hasMove['lavaplume']) && counter.setupType !== 'Physical') rejected = true;
					if (moveid === 'flamethrower' && hasMove['drainpunch'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'fireblast':
					if (hasMove['flareblitz'] && counter.setupType !== 'Special') rejected = true;
					if (hasMove['lavaplume'] && !counter.setupType && !counter['speedsetup']) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['firepunch'] || hasMove['fireblast'] && (counter.setupType || !!counter['speedsetup'])) rejected = true;
					break;
				case 'airslash': case 'hurricane':
					if (hasMove['bravebird']) rejected = true;
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
				case 'gigadrain': case 'powerwhip':
					if (hasMove['seedbomb'] || hasMove['petaldance'] || hasMove['sunnyday'] && hasMove['solarbeam']) rejected = true;
					if (counter.Special < 4 && !counter.setupType && hasMove['leafstorm']) rejected = true;
					break;
				case 'leafblade': case 'woodhammer':
					if (hasMove['gigadrain'] && counter.setupType !== 'Physical') rejected = true;
					if (hasMove['hornleech'] && counter.Physical < 4) rejected = true;
					break;
				case 'leafstorm':
					if (counter['Grass'] > 1 && counter.setupType) rejected = true;
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
					if (hasType['Rock'] && !!counter.Status) rejected = true;
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
					break;
				case 'psyshock':
					let psychic = movePool.indexOf('psychic');
					if (psychic >= 0) this.fastPop(movePool, psychic);
					break;
				case 'headsmash':
					if (hasMove['stoneedge']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if (hasMove['headsmash'] || hasMove['stoneedge']) rejected = true;
					break;
				case 'bulletpunch':
					if (hasType['Steel'] && counter.stab < 2 && !hasAbility['Adaptability'] && !hasAbility['Technician']) rejected = true;
					break;
				case 'flashcannon':
					if ((hasMove['ironhead'] || hasMove['meteormash']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'hydropump':
					if (hasMove['razorshell'] || hasMove['waterfall'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['scald'] && (counter.Special < 4 || template.types.length > 1 && counter.stab < 3)) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				case 'scald':
					if (hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;

				// Status:
				case 'glare': case 'headbutt':
					if (hasMove['bodyslam'] || !hasMove['glare']) rejected = true;
					break;
				case 'stunspore': case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['discharge'] || hasMove['spore'] || hasMove['toxic'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
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
					// Mono-attacking with setup and RestTalk is allowed
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
					((hasType['Dark'] && !counter['Dark'] && !hasAbility['Protean']) || hasMove['suckerpunch'] && counter.stab < template.types.length) ||
					(hasType['Dragon'] && !counter['Dragon'] && !hasAbility['Aerilate'] && !hasAbility['Pixilate'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fairy'] && !counter['Fairy'] && !hasAbility['Pixilate'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fighting'] && !counter['Fighting'] && (template.baseStats.atk >= 110 || hasAbility['Justified'] || hasAbility['Unburden'] || counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Flying'] && !counter['Flying'] && (hasAbility['Gale Wings'] || hasAbility['Serene Grace'] || hasType['Normal'] && movePool.includes('bravebird'))) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost']) ||
					(hasType['Grass'] && !counter['Grass'] && !hasType['Fairy'] && !hasType['Poison'] && !hasType['Steel']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice'] && !hasAbility['Refrigerate']) ||
					(hasType['Normal'] && (movePool.includes('boomburst') || hasAbility['Guts'] && movePool.includes('facade'))) ||
					(hasType['Psychic'] && !!counter['Psychic'] && !hasType['Flying'] && !hasAbility['Pixilate'] && counter.stab < template.types.length) ||
					(hasType['Rock'] && !counter['Rock'] && !hasType['Fairy'] && (hasAbility['Rock Head'] || counter.setupType === 'Physical')) ||
					(hasType['Steel'] && !counter['Steel'] && hasAbility['Technician']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab) && !hasAbility['Protean']) ||
					// @ts-ignore
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					((hasAbility['Aerilate'] || hasAbility['Pixilate'] || hasAbility['Refrigerate'] && !hasMove['blizzard']) && !counter['Normal']) ||
					(hasAbility['Bad Dreams'] && movePool.includes('darkvoid')) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
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
					if (move.category !== 'Status' && !move.damage && !move.flags.charge && (moveid !== 'hiddenpower' || !availableHP)) rejectedPool.push(moves[i]);
					moves.splice(i, 1);
					break;
				}
				if (rejected && rejectedPool.length) {
					moves.splice(i, 1);
					break;
				}

				// Handle Hidden Power IVs
				if (moveid === 'hiddenpower') {
					let HPivs = this.dex.getType(move.type).HPivs;
					for (let iv in HPivs) {
						// @ts-ignore
						ivs[iv] = HPivs[iv];
					}
				}
			}
		} while (moves.length < 4 && (movePool.length || rejectedPool.length));

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			moves[moves.indexOf('autotomize')] = 'rockpolish';
		}
		if (hasMove['raindance'] && hasMove['thunderbolt']) {
			moves[moves.indexOf('thunderbolt')] = 'thunder';
		}

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}

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
				} else if (ability === 'Flare Boost' || ability === 'Gluttony' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Harvest') {
					rejectAbility = abilities.includes('Frisk');
				} else if (ability === 'Hustle') {
					rejectAbility = counter.Physical < 2;
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = template.baseStats.spe > 100 || !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Ice Body' || ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Immunity' || ability === 'Snow Warning') {
					rejectAbility = hasMove['facade'] || hasMove['hypervoice'];
				} else if (ability === 'Intimidate') {
					rejectAbility = hasMove['bodyslam'] || hasMove['rest'] || abilities.includes('Reckless') && counter['recoil'] > 1;
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Magnet Pull') {
					rejectAbility = !hasType['Electric'] && !hasMove['earthpower'];
				} else if (ability === 'Mold Breaker') {
					rejectAbility = hasMove['acrobatics'] || abilities.includes('Adaptability') || abilities.includes('Sheer Force') && !!counter['sheerforce'];
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = abilities.includes('Technician') && !!counter['technician'];
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Pressure' || ability === 'Synchronize') {
					rejectAbility = counter.Status < 2 || !!counter['recoil'] || template.isMega;
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'] || template.isMega;
				} else if (ability === 'Regenerator') {
					rejectAbility = abilities.includes('Magic Guard');
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
				} else if (ability === 'Speed Boost') {
					rejectAbility = hasMove['uturn'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'] || template.isMega;
				} else if (ability === 'Sweet Veil') {
					rejectAbility = hasType['Grass'];
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || hasMove['tailslap'] || template.isMega;
				} else if (ability === 'Tinted Lens') {
					rejectAbility = abilities.includes('Prankster') || hasMove['protect'] || counter['damage'] >= counter.damagingMoves.length || (counter.Status > 2 && !counter.setupType);
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
						// @ts-ignore
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Guts') && ability !== 'Quick Feet' && (hasMove['facade'] || hasMove['protect'] || (hasMove['rest'] && hasMove['sleeptalk']))) {
				ability = 'Guts';
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

		item = 'Leftovers';
		if (template.requiredItems) {
			item = this.sample(template.requiredItems);

		// First, the extra high-priority items
		} else if (template.species === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (template.species === 'Deoxys-Attack') {
			item = (isLead && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Genesect' && hasMove['technoblast']) {
			item = 'Douse Drive';
		} else if (template.baseSpecies === 'Pikachu') {
			item = 'Light Ball';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unfezant' && counter['Physical'] >= 2) {
			item = 'Scope Lens';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wobbuffet') {
			item = hasMove['destinybond'] ? 'Custap Berry' : this.sample(['Leftovers', 'Sitrus Berry']);
		} else if (ability === 'Harvest') {
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
		} else if (hasMove['copycat'] && counter.Physical >= 3) {
			item = 'Choice Band';
		} else if (hasMove['bellydrum']) {
			item = 'Sitrus Berry';
		} else if (hasMove['geomancy'] || hasMove['solarbeam'] && ability !== 'Drought' && !hasMove['sunnyday'] && !teamDetails['sun']) {
			item = 'Power Herb';
		} else if (hasMove['shellsmash']) {
			item = (ability === 'Solid Rock' && !!counter['priority']) ? 'Weakness Policy' : 'White Herb';
		} else if ((ability === 'Guts' || hasMove['facade'] || hasMove['psychoshift']) && !hasMove['sleeptalk']) {
			item = hasMove['drainpunch'] ? 'Flame Orb' : 'Toxic Orb';
		} else if ((ability === 'Magic Guard' && counter.damagingMoves.length > 1) || (ability === 'Sheer Force' && !!counter['sheerforce'])) {
			item = 'Life Orb';
		} else if (ability === 'Poison Heal') {
			item = 'Toxic Orb';
		} else if (hasMove['acrobatics']) {
			item = 'Flying Gem';
		} else if (ability === 'Unburden') {
			if (hasMove['fakeout']) {
				item = 'Normal Gem';
			} else if (hasMove['dracometeor'] || hasMove['leafstorm'] || hasMove['overheat']) {
				item = 'White Herb';
			} else if (hasMove['substitute'] || counter.setupType) {
				item = 'Sitrus Berry';
			} else {
				item = 'Red Card';
				for (let m in moves) {
					let move = this.dex.getMove(moves[m]);
					if (hasType[move.type] && move.basePower >= 90) {
						item = move.type + ' Gem';
						break;
					}
				}
			}
		} else if (hasMove['raindance']) {
			item = (ability === 'Forecast') ? 'Damp Rock' : 'Life Orb';
		} else if (hasMove['sunnyday']) {
			item = (ability === 'Forecast') ? 'Heat Rock' : 'Life Orb';
		} else if (hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = 'Chesto Berry';

		// Medium priority
		} else if ((ability === 'Speed Boost' || ability === 'Stance Change') && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (counter.Physical >= 4 && !hasMove['bodyslam'] && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch']) {
			item = (template.baseStats.atk >= 100 || ability === 'Huge Power') && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['clearsmog'] && !hasMove['fierydance']) {
			item = template.baseStats.spa >= 100 && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (counter.Physical >= 3 && hasMove['defog'] && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && !hasMove['foulplay']) {
			item = 'Choice Scarf';
		} else if (counter.Special >= 3 && hasMove['uturn'] && !hasMove['acidspray']) {
			item = 'Choice Specs';
		} else if (ability === 'Slow Start' || hasMove['bite'] || hasMove['clearsmog'] || hasMove['curse'] || hasMove['protect'] || hasMove['sleeptalk'] || template.species.includes('Rotom-')) {
			item = 'Leftovers';
		} else if ((hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = (ability === 'Defeatist') ? 'Expert Belt' : 'Focus Sash';
		} else if (hasMove['outrage'] && counter.setupType) {
			item = 'Lum Berry';
		} else if (hasMove['substitute']) {
			item = counter.damagingMoves.length > 2 && !!counter['drain'] ? 'Life Orb' : 'Leftovers';
		} else if (this.dex.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.randomChance(1, 2)) {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.spd >= 50 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 235) {
			item = 'Assault Vest';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 4) {
			item = (!!counter['Dragon'] || !!counter['Dark'] || !!counter['Normal']) ? 'Life Orb' : 'Expert Belt';
		} else if (counter.damagingMoves.length >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 300) {
			item = 'Weakness Policy';
		} else if (isLead && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd <= 275) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (ability === 'Gale Wings' && hasMove['bravebird']) {
			item = 'Sharp Beak';
		} else if (hasMove['stickyweb'] && ability === 'Sturdy') {
			item = 'Mental Herb';
		} else if (ability === 'Serene Grace' && hasMove['airslash'] && template.baseStats.spe > 100) {
			item = 'Metronome';
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		} else if (counter.damagingMoves.length >= 3 && ability !== 'Sturdy' && !hasMove['acidspray'] && !hasMove['dragontail'] && !hasMove['foulplay'] && !hasMove['rapidspin'] && !hasMove['superfang'] && !hasMove['uturn']) {
			item = (!!counter['speedsetup'] || hasMove['trickroom'] || template.baseStats.spe > 40 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd <= 275) ? 'Life Orb' : 'Leftovers';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

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
			Unreleased: 80,
			Uber: 78,
		};
		/** @type {{[species: string]: number}} */
		let customScale = {
			// Banned Ability
			Dugtrio: 82, Gothitelle: 82, Ninetales: 84, Politoed: 84, Wobbuffet: 82,

			// Holistic judgement
			'Genesect-Douse': 80,
			Castform: 100, Delibird: 100, Spinda: 100, Unown: 100,
		};
		let level = levelScale[template.tier] || 90;
		if (customScale[species]) level = customScale[species];

		// Prepare optimal HP
		let srWeakness = this.dex.getEffectiveness('Rock', template);
		while (evs.hp > 1) {
			let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hasMove['substitute'] && hasMove['reversal']) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (hasMove['substitute'] && (item === 'Petaya Berry' || item === 'Sitrus Berry')) {
				// Three Substitutes should activate Petaya Berry for Dedenne
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if (hasMove['bellydrum'] && item === 'Sitrus Berry') {
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
			ivs.atk = hasMove['hiddenpower'] ? ivs.atk - 30 : 0;
		}

		if (hasMove['gyroball'] || hasMove['metalburst'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = hasMove['hiddenpower'] ? ivs.spe - 30 : 0;
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
		/**@type {{[k: string]: string}} */
		let requiredMoves = {'stealthrock': 'hazardSet', 'rapidspin': 'hazardClear', 'defog': 'hazardClear'};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesRequire = {
			'hydration': 'raindance', 'swiftswim': 'raindance',
			'leafguard': 'sunnyday', 'solarpower': 'sunnyday', 'chlorophyll': 'sunnyday',
			'sandforce': 'sandstorm', 'sandrush': 'sandstorm', 'sandveil': 'sandstorm',
			'snowcloak': 'hail',
		};
		let weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		/**@type {{set: AnyObject, moveVariants?: number[], itemVariants?: number, abilityVariants?: number}[]} */
		let effectivePool = [];
		let priorityPool = [];
		for (const curSet of setList) {
			let itemData = this.dex.getItem(curSet.item);
			if (teamData.megaCount > 0 && itemData.megaStone) continue; // reject 2+ mega stones
			if (itemsMax[itemData.id] && teamData.has[itemData.id] >= itemsMax[itemData.id]) continue;

			let abilityData = this.dex.getAbility(curSet.ability);
			if (weatherAbilitiesRequire[abilityData.id] && teamData.weather !== weatherAbilitiesRequire[abilityData.id]) continue;
			if (teamData.weather && weatherAbilities.includes(abilityData.id)) continue; // reject 2+ weather setters

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
			name: setData.set.name || template.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || template.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: setData.set.item || '',
			ability: setData.set.ability || template.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: 100,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: setData.set.evs || {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
			ivs: setData.set.ivs || {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
			nature: setData.set.nature || 'Serious',
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
		if (!this.FactoryTier) this.FactoryTier = this.sample(['Uber', 'OU', 'UU', 'RU', 'NU', 'PU']);
		const chosenTier = this.FactoryTier;

		let pokemon = [];

		let pokemonPool = Object.keys(this.randomFactorySets[chosenTier]);

		/**@type {import('../../random-teams').TeamData} */
		let teamData = {typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {}};
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

			let speciesFlags = this.randomFactorySets[chosenTier][template.speciesid].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[template.baseSpecies]) continue;

			// Limit the number of Megas to one
			if (teamData.megaCount >= 1 && speciesFlags.megaOnly) continue;

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

			let set = this.randomFactorySet(template, pokemon.length, teamData, chosenTier);
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

			let itemData = this.dex.getItem(set.item);
			if (itemData.megaStone) teamData.megaCount++;
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
					// Heuristic: assume that Pokemon with these abilities don't have (too) negative typing.
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
}

module.exports = RandomGen6Teams;
