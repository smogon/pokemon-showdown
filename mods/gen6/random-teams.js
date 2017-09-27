'use strict';

const RandomTeams = require('../../data/random-teams');

class RandomGen6Teams extends RandomTeams {
	randomSet(template, slot, teamDetails) {
		if (slot === undefined) slot = 1;
		let baseTemplate = (template = this.getTemplate(template));
		let species = template.species;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			require('../../crashlogger')(err, 'The randbat set generator');
		}

		if (typeof teamDetails !== 'object') teamDetails = {megaStone: teamDetails};

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}
		let battleForme = this.checkBattleForme(template);
		if (battleForme && battleForme.tier !== 'AG' && (battleForme.isMega ? !teamDetails.megaStone : this.random(2))) {
			template = this.getTemplate(template.otherFormes.length >= 2 ? template.otherFormes[this.random(template.otherFormes.length)] : template.otherFormes[0]);
		}

		let movePool = (template.randomBattleMoves ? template.randomBattleMoves.slice() : Object.keys(template.learnset));
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
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		let hasAbility = {};
		hasAbility[template.abilities[0]] = true;
		if (template.abilities[1]) {
			hasAbility[template.abilities[1]] = true;
		}
		if (template.abilities['H']) {
			hasAbility[template.abilities['H']] = true;
		}
		let availableHP = 0;
		for (let i = 0, len = movePool.length; i < len; i++) {
			if (movePool[i].substr(0, 11) === 'hiddenpower') availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = {
			closecombat:1, extremespeed:1, suckerpunch:1, superpower:1,
			dracometeor:1, leafstorm:1, overheat:1,
		};
		let counterAbilities = {
			'Adaptability':1, 'Contrary':1, 'Hustle':1, 'Iron Fist':1, 'Skill Link':1,
		};
		let ateAbilities = {
			'Aerilate':1, 'Pixilate':1, 'Refrigerate':1,
		};

		let hasMove, counter;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (let k = 0; k < moves.length; k++) {
				if (moves[k].substr(0, 11) === 'hiddenpower') {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moves[k]] = true;
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

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (let k = 0; k < moves.length; k++) {
				let move = this.getMove(moves[k]);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Not very useful without their supporting moves
				case 'batonpass':
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['substitute'] && !hasMove['wish'] && !hasAbility['Speed Boost']) rejected = true;
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
				case 'rest': {
					if (movePool.includes('sleeptalk')) rejected = true;
					break;
				}
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						let rest = movePool.indexOf('rest');
						if (rest >= 0) this.fastPop(movePool, rest);
					}
					break;
				case 'storedpower':
					if (!counter.setupType && !hasMove['cosmicpower']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) {
						if (!hasMove['growth'] || hasMove['sunnyday']) rejected = true;
					}
					if (counter.Physical + counter['physicalpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'growth': case 'shellsmash': case 'workup':
					if (counter.setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (counter.damagingMoves.length + counter['physicalpool'] + counter['specialpool'] < 2 && !hasMove['batonpass']) rejected = true;
					if (moveid === 'growth' && !hasMove['sunnyday']) rejected = true;
					isSetup = true;
					break;
				case 'agility': case 'autotomize': case 'rockpolish':
					if (counter.damagingMoves.length < 2 && !hasMove['batonpass']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;
				case 'flamecharge':
					if (counter.damagingMoves.length < 3 && !counter.setupType && !hasMove['batonpass']) rejected = true;
					if (hasMove['dracometeor'] || hasMove['overheat']) rejected = true;
					break;

				// Bad after setup
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) rejected = true;
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['raindance'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'defog':
					if (counter.setupType || hasMove['spikes'] || (hasMove['rest'] && hasMove['sleeptalk']) || teamDetails.hazardClear) rejected = true;
					break;
				case 'fakeout': case 'superfang':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'foulplay':
					if (counter.setupType || !!counter['speedsetup'] || counter['Dark'] > 2 || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (counter.damagingMoves.length - 1 === counter['priority']) rejected = true;
					break;
				case 'haze': case 'spikes': case 'waterspout':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'healbell':
					if (counter['speedsetup']) rejected = true;
					break;
				case 'healingwish': case 'memento':
					if (counter.setupType || !!counter['recovery'] || hasMove['substitute']) rejected = true;
					break;
				case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss':
					if (counter.stab || counter.setupType || counter.damagingMoves.length > 2) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && (hasAbility['Guts'] || hasAbility['Speed Boost']) && !hasMove['batonpass']) rejected = true;
					if ((hasMove['lightscreen'] && hasMove['reflect']) || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || (hasMove['rest'] && hasMove['sleeptalk']) || (hasMove['knockoff'] && !hasType['Dark'])) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || teamDetails.hazardClear) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType) rejected = true;
					if (hasMove['acrobatics'] || hasMove['lightscreen'] || hasMove['reflect'] || hasMove['suckerpunch'] || hasMove['trickroom']) rejected = true;
					break;
				case 'toxicspikes':
					if (counter.setupType || teamDetails.toxicSpikes) rejected = true;
					break;
				case 'trickroom':
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['batonpass'] || hasAbility['Protean'] && counter.Status > 2) rejected = true;
					if (hasType['Bug'] && counter.stab < 2 && counter.damagingMoves.length > 2 && !hasAbility['Adaptability'] && !hasMove['technoblast']) rejected = true;
					break;
				case 'voltswitch':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['batonpass'] || hasMove['magnetrise'] || hasMove['uturn']) rejected = true;
					if (hasMove['nuzzle'] && hasMove['thunderbolt']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite': case 'bugbuzz': case 'signalbeam':
					if (hasMove['uturn'] && !counter.setupType) rejected = true;
					break;
				case 'darkpulse':
					if (hasMove['shadowball']) rejected = true;
					if ((hasMove['crunch'] || hasMove['hyperspacefury']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'suckerpunch':
					if (counter['Dark'] > 2 || (counter.setupType === 'Special' && hasType['Dark'] && counter.stab < 2)) rejected = true;
					if (counter['Dark'] > 1 && !hasType['Dark']) rejected = true;
					if (counter.damagingMoves.length < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['dragontail'] || hasMove['outrage'] && counter.Status >= 1) rejected = true;
					break;
				case 'dracometeor':
					if (hasMove['swordsdance'] || counter.setupType === 'Physical' && hasMove['outrage']) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage']) rejected = true;
					break;
				case 'outrage':
					if (hasMove['dracometeor'] && counter.damagingMoves.length < 3) rejected = true;
					break;
				case 'chargebeam':
					if (hasMove['thunderbolt'] && counter.Special < 3) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt'] && !hasMove['raindance']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || (hasMove['raindance'] && hasMove['thunder']) || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					if (!counter.setupType && !counter['speedsetup'] && hasMove['voltswitch'] && template.types.length > 1 && !counter[template.types.find(type => type !== 'Electric')]) rejected = true;
					break;
				case 'dazzlinggleam':
					if (hasMove['playrough'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'drainingkiss':
					if (hasMove['dazzlinggleam'] || counter.setupType !== 'Special') rejected = true;
					break;
				case 'aurasphere': case 'focusblast':
					if ((hasMove['closecombat'] || hasMove['superpower']) && counter.setupType !== 'Special') rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'drainpunch':
					if (!hasMove['bulkup'] && (hasMove['closecombat'] || hasMove['highjumpkick'])) rejected = true;
					if (hasMove['focusblast'] || hasMove['superpower']) rejected = true;
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
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'vacuumwave':
					if ((hasMove['closecombat'] || hasMove['machpunch']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'blazekick':
					if (hasMove['flamethrower'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'fierydance': case 'firefang': case 'flamethrower':
					if ((hasMove['fireblast'] && counter.setupType !== 'Physical') || hasMove['overheat']) rejected = true;
					break;
				case 'fireblast':
					if (hasMove['lavaplume'] && !counter.setupType && !counter['speedsetup']) rejected = true;
					if (hasMove['flareblitz'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'firepunch': case 'sacredfire':
					if (hasMove['fireblast'] || hasMove['flareblitz']) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['fireblast'] && (counter.setupType || !!counter['speedsetup'])) rejected = true;
					break;
				case 'overheat':
					if (hasMove['lavaplume'] || counter.setupType === 'Special') rejected = true;
					break;
				case 'acrobatics':
					if (hasMove['hurricane'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'airslash': case 'oblivionwing':
					if (hasMove['acrobatics'] || hasMove['bravebird'] || hasMove['hurricane']) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['phantomforce'] || (hasMove['shadowball'] && counter.setupType !== 'Physical') || hasMove['shadowsneak']) rejected = true;
					break;
				case 'shadowsneak':
					if (hasType['Ghost'] && template.types.length > 1 && counter.stab < 2) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['petaldance'] || counter.Special < 4 && !counter.setupType && hasMove['leafstorm']) rejected = true;
					break;
				case 'leafblade': case 'seedbomb': case 'woodhammer':
					if (hasMove['gigadrain'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'leafstorm':
					if (counter['Grass'] > 1 && counter.setupType) rejected = true;
					break;
				case 'bonemerang': case 'precipiceblades':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'earthpower':
					if (hasMove['earthquake'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard'] || hasMove['freezedry']) rejected = true;
					break;
				case 'iceshard':
					if (hasMove['freezedry']) rejected = true;
					break;
				case 'bodyslam':
					if (hasMove['glare'] || hasMove['headbutt']) rejected = true;
					break;
				case 'endeavor':
					if (slot > 0) rejected = true;
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
					if (hasMove['blizzard'] || hasMove['naturepower'] || hasMove['return']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'quickattack':
					if (hasType['Normal'] && counter['Normal'] > 1 && template.types.length > 1 && counter.stab < 2) rejected = true;
					break;
				case 'return': case 'rockclimb':
					if (hasMove['bodyslam'] || hasMove['doubleedge']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['raindance'] && !hasMove['sunnyday']) rejected = true;
					break;
				case 'acidspray':
					if (hasMove['sludgebomb'] || counter.Special < 2) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'sludgewave':
					if (hasMove['poisonjab']) rejected = true;
					break;
				case 'psychic':
					if (hasMove['psyshock'] || hasMove['storedpower']) rejected = true;
					break;
				case 'psychocut': case 'zenheadbutt':
					if ((hasMove['psychic'] || hasMove['psyshock']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'psyshock':
					if (movePool.length > 1) {
						let psychic = movePool.indexOf('psychic');
						if (psychic >= 0) this.fastPop(movePool, psychic);
					}
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
					if (hasMove['ironhead']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['razorshell'] || hasMove['waterfall'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['scald'] && counter.Special < 4) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				case 'scald':
					if (hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;

				// Status:
				case 'raindance':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasType['Water'] && !hasMove['thunder']) rejected = true;
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
				case 'stunspore': case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['discharge'] || hasMove['gyroball'] || hasMove['spore'] || hasMove['toxic'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
					break;
				case 'toxic':
					if (counter.setupType || hasMove['flamecharge'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['hypnosis'] || hasMove['sleeppowder'] || hasMove['willowisp'] || hasMove['yawn']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['scald']) rejected = true;
					break;
				case 'milkdrink': case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
					if (hasMove['leechseed'] || hasMove['rest'] || hasMove['wish']) rejected = true;
					break;
				case 'safeguard':
					if (hasMove['destinybond']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['dracometeor'] || (hasMove['leafstorm'] && !hasAbility['Contrary']) || hasMove['pursuit'] || hasMove['rest'] || hasMove['taunt'] || hasMove['uturn'] || hasMove['voltswitch']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && (!!counter['speedsetup'] || hasMove['copycat'])) {
					rejected = true;
				}

				// Certain Pokemon should always have a recovery move
				if (!counter.recovery && template.baseStats.hp >= 165 && movePool.includes('wish')) {
					if (move.category === 'Status' || !hasType[move.type] && !move.damage) rejected = true;
				}
				if (template.nfe && !isSetup && !counter.recovery && !!counter['Status'] && (movePool.includes('recover') || movePool.includes('roost'))) {
					if (move.category === 'Status' || !hasType[move.type]) rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					if (!SetupException[moveid] && (!hasType[move.type] || counter.stab > 1 || counter[move.category] < 2)) rejected = true;
				}
				if (counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType && counter[counter.setupType] < 2 && !hasMove['batonpass'] && moveid !== 'rest' && moveid !== 'sleeptalk') {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && template.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Pokemon should have moves that benefit their Ability/Type/Weather, as well as moves required by its forme
				if ((hasType['Bug'] && !hasMove['batonpass'] && (movePool.includes('megahorn') || movePool.includes('pinmissile') || (hasType['Flying'] && !hasMove['hurricane'] && movePool.includes('bugbuzz')))) ||
					(hasType['Dark'] && hasMove['suckerpunch'] && counter.stab < template.types.length) ||
					(hasType['Dragon'] && !counter['Dragon'] && !hasAbility['Aerilate'] && !hasAbility['Pixilate'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice'] && !hasAbility['Refrigerate']) ||
					(hasType['Psychic'] && !!counter['Psychic'] && !hasType['Flying'] && !hasAbility['Pixilate'] && template.types.length > 1 && counter.stab < 2) ||
					(hasType['Water'] && !counter['Water'] && (!hasType['Ice'] || !counter['Ice']) && !hasAbility['Protean']) ||
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					((hasAbility['Aerilate'] || hasAbility['Pixilate'] || hasAbility['Refrigerate'] && !hasMove['blizzard']) && !counter['Normal']) ||
					(hasAbility['Bad Dreams'] && movePool.includes('darkvoid')) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
					(hasAbility['Dark Aura'] && !counter['Dark']) ||
					(hasAbility['Gale Wings'] && !counter['Flying']) ||
					(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(hasAbility['Stance Change'] && !counter.setupType && movePool.includes('kingsshield')) ||
					(counter['defensesetup'] && !counter.recovery && !hasMove['rest']) ||
					(movePool.includes('technoblast') || template.requiredMove && movePool.includes(toId(template.requiredMove)))) &&
					(counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && moveid !== 'judgment' && moveid !== 'rest' && moveid !== 'sleeptalk') {
						if (move.category === 'Status' || !hasType[move.type] || (move.basePower && move.basePower < 40 && !move.multihit)) rejected = true;
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
					moves.splice(k, 1);
					break;
				}

				// Handle Hidden Power IVs
				if (moveid === 'hiddenpower') {
					let HPivs = this.getType(move.type).HPivs;
					for (let iv in HPivs) {
						ivs[iv] = HPivs[iv];
					}
				}
			}
			if (moves.length === 4 && !counter.stab && !hasMove['metalburst'] && (counter['physicalpool'] || counter['specialpool'])) {
				// Move post-processing:
				if (counter.damagingMoves.length === 0) {
					// A set shouldn't have no attacking moves
					moves.splice(this.random(moves.length), 1);
				} else if (counter.damagingMoves.length === 1) {
					// In most cases, a set shouldn't have no STAB
					let damagingid = counter.damagingMoves[0].id;
					if (movePool.length - availableHP || availableHP && (damagingid === 'hiddenpower' || !hasMove['hiddenpower'])) {
						let replace = false;
						if (!counter.damagingMoves[0].damage && template.species !== 'Porygon2') {
							let damagingType = counter.damagingMoves[0].type;
							if (damagingType === 'Fairy') {
								// Mono-Fairy is acceptable for Psychic types
								if (counter.setupType !== 'Special' || template.types.length > 1 || !hasType['Psychic']) replace = true;
							} else {
								replace = true;
							}
						}
						if (replace) moves.splice(counter.damagingMoveIndex[damagingid], 1);
					}
				} else if (!counter.damagingMoves[0].damage && !counter.damagingMoves[1].damage && template.species !== 'Porygon2') {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					let rejectableMoves = [];
					let baseDiff = movePool.length - availableHP;
					for (let l = 0; l < counter.damagingMoves.length; l++) {
						if (counter.damagingMoves[l].id === 'technoblast') continue;
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || counter.damagingMoves[l].id === 'hiddenpower')) {
							rejectableMoves.push(counter.damagingMoveIndex[counter.damagingMoves[l].id]);
						}
					}
					if (rejectableMoves.length) {
						moves.splice(rejectableMoves[this.random(rejectableMoves.length)], 1);
					}
				}
			}
		} while (moves.length < 4 && movePool.length);

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			moves[moves.indexOf('autotomize')] = 'rockpolish';
		}

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}

		let abilities = Object.values(baseTemplate.abilities);
		abilities.sort((a, b) => this.getAbility(b).rating - this.getAbility(a).rating);
		let ability0 = this.getAbility(abilities[0]);
		let ability1 = this.getAbility(abilities[1]);
		let ability2 = this.getAbility(abilities[2]);
		if (abilities[1]) {
			if (abilities[2] && ability1.rating <= ability2.rating && this.random(2)) {
				[ability1, ability2] = [ability2, ability1];
			}
			if (ability0.rating <= ability1.rating && this.random(2)) {
				[ability0, ability1] = [ability1, ability0];
			} else if (ability0.rating - 0.6 <= ability1.rating && this.random(3)) {
				[ability0, ability1] = [ability1, ability0];
			}
			ability = ability0.name;

			let rejectAbility;
			do {
				rejectAbility = false;
				if (ability in counterAbilities) {
					// Adaptability, Contrary, Hustle, Iron Fist, Skill Link
					rejectAbility = !counter[toId(ability)];
				} else if (ability in ateAbilities) {
					rejectAbility = !counter['Normal'];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = !hasMove['sunnyday'] && !teamDetails['sun'];
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = !counter['Physical'] && !hasMove['batonpass'];
				} else if (ability === 'Flare Boost' || ability === 'Gluttony' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Ice Body' || ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = abilities.includes('Technician') && !!counter['technician'];
				} else if (ability === 'Prankster' || ability === 'Pressure') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Sand Force' || ability === 'Sand Rush' || ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Scrappy') {
					rejectAbility = !template.types.includes('Normal');
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || template.species === 'Blissey' || template.species === 'Togetic';
				} else if (ability === 'Sheer Force') {
					rejectAbility = !counter['sheerforce'] || template.isMega || (abilities.includes('Iron Fist') && counter['ironfist'] > counter['sheerforce']);
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['cosmicpower'] && !hasMove['flamecharge'];
				} else if (ability === 'Snow Warning') {
					rejectAbility = hasMove['hypervoice'];
				} else if (ability === 'Solar Power') {
					rejectAbility = !counter['Special'] || template.isMega;
				} else if (ability === 'Strong Jaw') {
					rejectAbility = !counter['bite'];
				} else if (ability === 'Sturdy') {
					rejectAbility = !!counter['recoil'] && !counter['recovery'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Synchronize') {
					rejectAbility = counter.Status < 2;
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || (abilities.includes('Skill Link') && counter['skilllink'] >= counter['technician']);
				} else if (ability === 'Tinted Lens') {
					rejectAbility = counter['damage'] >= counter.damagingMoves.length || (counter.Status > 2 && !counter.setupType);
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				} else if (ability === 'Unburden') {
					rejectAbility = template.isMega || (!counter.setupType && !hasMove['acrobatics']);
				} else if (ability === 'Water Absorb') {
					rejectAbility = abilities.includes('Volt Absorb');
				}

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating > 1) {
						ability = ability1.name;
					} else if (ability === ability1.name && abilities[2] && ability2.rating > 1) {
						ability = ability2.name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Guts') && ability !== 'Quick Feet' && (hasMove['facade'] || hasMove['protect'] || (hasMove['rest'] && hasMove['sleeptalk']))) {
				ability = 'Guts';
			}
			if (abilities.includes('Marvel Scale') && hasMove['rest'] && hasMove['sleeptalk']) {
				ability = 'Marvel Scale';
			}
			if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
			}
			if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
			if (abilities.includes('Unburden') && hasMove['acrobatics']) {
				ability = 'Unburden';
			}
			if (template.species === 'Ambipom' && !counter['technician']) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				ability = 'Pickup';
			} else if (template.baseSpecies === 'Basculin') {
				ability = 'Adaptability';
			} else if (template.species === 'Lopunny' && hasMove['switcheroo'] && this.random(3)) {
				ability = 'Klutz';
			} else if ((template.species === 'Rampardos' && !hasMove['headsmash']) || hasMove['rockclimb']) {
				ability = 'Sheer Force';
			} else if (template.species === 'Reuniclus') {
				ability = 'Magic Guard';
			} else if (template.species === 'Umbreon') {
				ability = 'Synchronize';
			} else if (template.id === 'venusaurmega') {
				ability = 'Chlorophyll';
			}
		} else {
			ability = ability0.name;
		}

		item = 'Leftovers';
		if (template.requiredItems) {
			item = template.requiredItems[this.random(template.requiredItems.length)];

		// First, the extra high-priority items
		} else if (template.species === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (template.species === 'Deoxys-Attack') {
			item = (slot === 0 && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.baseSpecies === 'Pikachu') {
			item = 'Light Ball';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unfezant' && counter['Physical'] >= 2) {
			item = 'Scope Lens';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wobbuffet') {
			item = hasMove['destinybond'] ? 'Custap Berry' : ['Leftovers', 'Sitrus Berry'][this.random(2)];
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (ability === 'Klutz' && hasMove['switcheroo']) {
			// To perma-taunt a Pokemon by giving it Assault Vest
			item = 'Assault Vest';
		} else if (hasMove['geomancy'] || hasMove['solarbeam'] && !hasAbility['Drought'] && !hasMove['sunnyday'] && !teamDetails['sun']) {
			item = 'Power Herb';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			let randomNum = this.random(3);
			if (counter.Physical >= 3 && (template.baseStats.spe < 60 || template.baseStats.spe > 108 || randomNum)) {
				item = 'Choice Band';
			} else if (counter.Special >= 3 && (template.baseStats.spe < 60 || template.baseStats.spe > 108 || randomNum)) {
				item = 'Choice Specs';
			} else {
				item = 'Choice Scarf';
			}
		} else if (template.evos.length) {
			item = (ability === 'Technician' && counter.Physical >= 4) ? 'Choice Band' : 'Eviolite';
		} else if (hasMove['bellydrum']) {
			item = 'Sitrus Berry';
		} else if (hasMove['shellsmash']) {
			item = (ability === 'Solid Rock' && counter['priority']) ? 'Weakness Policy' : 'White Herb';
		} else if (ability === 'Harvest') {
			item = hasMove['rest'] ? 'Lum Berry' : 'Sitrus Berry';
		} else if (ability === 'Magic Guard' || ability === 'Sheer Force') {
			item = hasMove['psychoshift'] ? 'Flame Orb' : 'Life Orb';
		} else if (ability === 'Poison Heal' || ability === 'Toxic Boost') {
			item = 'Toxic Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = (hasMove['raindance'] && ability === 'Hydration') ? 'Damp Rock' : 'Chesto Berry';
		} else if (hasMove['raindance']) {
			item = (ability === 'Swift Swim' && counter.Status < 2) ? 'Life Orb' : 'Damp Rock';
		} else if (hasMove['sunnyday']) {
			item = (ability === 'Chlorophyll' && counter.Status < 2) ? 'Life Orb' : 'Heat Rock';
		} else if (hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (hasMove['acrobatics']) {
			item = 'Flying Gem';
		} else if ((ability === 'Guts' || hasMove['facade']) && !hasMove['sleeptalk']) {
			item = hasMove['drainpunch'] ? 'Flame Orb' : 'Toxic Orb';
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
					let move = this.getMove(moves[m]);
					if (hasType[move.type] && move.basePower >= 90) {
						item = move.type + ' Gem';
						break;
					}
				}
			}

		// Medium priority
		} else if (((ability === 'Speed Boost' && !hasMove['substitute']) || (ability === 'Stance Change')) && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (counter.Physical >= 4 && !hasMove['bodyslam'] && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch']) {
			item = template.baseStats.atk >= 100 && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.random(3) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['chargebeam'] && !hasMove['clearsmog'] && !hasMove['fierydance']) {
			item = template.baseStats.spa >= 100 && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.random(3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (((counter.Physical >= 3 && hasMove['defog']) || (counter.Special >= 3 && hasMove['uturn'])) && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.random(3)) {
			item = 'Choice Scarf';
		} else if (ability === 'Defeatist' || hasMove['eruption'] || hasMove['waterspout']) {
			item = counter.Status <= 1 ? 'Expert Belt' : 'Leftovers';
		} else if ((hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = 'Focus Sash';
		} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (hasMove['outrage'] && (counter.setupType || ability === 'Multiscale')) {
			item = 'Lum Berry';
		} else if (ability === 'Slow Start' || hasMove['clearsmog'] || hasMove['curse'] || hasMove['detect'] || hasMove['protect'] || hasMove['sleeptalk']) {
			item = 'Leftovers';
		} else if (hasMove['substitute']) {
			item = !counter['drain'] || counter.damagingMoves.length < 2 ? 'Leftovers' : 'Life Orb';
		} else if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.random(2)) {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.spd >= 65 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 235) {
			item = 'Assault Vest';
		} else if (counter.damagingMoves.length >= 4) {
			item = (!!counter['Normal'] || (hasMove['suckerpunch'] && !hasType['Dark'])) ? 'Life Orb' : 'Expert Belt';
		} else if (counter.damagingMoves.length >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 300) {
			item = 'Weakness Policy';
		} else if (counter.damagingMoves.length >= 3 && ability !== 'Sturdy' && !hasMove['clearsmog'] && !hasMove['dragontail'] && !hasMove['foulplay'] && !hasMove['superfang']) {
			item = (template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 285 || !!counter['speedsetup'] || hasMove['trickroom']) ? 'Life Orb' : 'Leftovers';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (slot === 0 && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 285) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (ability === 'Gale Wings' && hasMove['bravebird']) {
			item = 'Sharp Beak';
		} else if (this.getEffectiveness('Rock', template) >= 1 || hasMove['dragontail']) {
			item = 'Leftovers';
		} else if (this.getImmunity('Ground', template) && this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate' && ability !== 'Solid Rock' && !hasMove['magnetrise'] && !hasMove['sleeptalk']) {
			item = 'Air Balloon';
		} else if (counter.Status <= 1 && ability !== 'Sturdy' && !hasMove['rapidspin']) {
			item = 'Life Orb';
		} else {
			item = 'Leftovers';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		let levelScale = {
			LC: 87,
			'LC Uber': 86,
			NFE: 84,
			PU: 83,
			BL4: 82,
			NU: 81,
			BL3: 80,
			RU: 79,
			BL2: 78,
			UU: 77,
			BL: 76,
			OU: 75,
			Unreleased: 75,
			CAP: 75,
			Uber: 73,
			AG: 71,
		};
		let customScale = {
			// Between OU and Uber
			Aegislash: 74, Blaziken: 74, 'Blaziken-Mega': 74, Genesect: 74, 'Genesect-Burn': 74, 'Genesect-Chill': 74, 'Genesect-Douse': 74, 'Genesect-Shock': 74, Greninja: 74, 'Lucario-Mega': 74, 'Mawile-Mega': 74,

			// Banned Ability
			Gothitelle: 74, Ninetales: 77, Politoed: 77, Wobbuffet: 74,

			// Holistic judgement
			Unown: 100,
		};
		let tier = template.tier;
		if (tier.charAt(0) === '(') {
			tier = tier.slice(1, -1);
		}
		let level = levelScale[tier] || 75;
		if (customScale[template.name]) level = customScale[template.name];

		if (template.name === 'Slurpuff' && !counter.setupType) level = 81;
		if (template.name === 'Xerneas' && hasMove['geomancy']) level = 71;

		// Prepare optimal HP
		let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
		if (hasMove['substitute'] && item === 'Sitrus Berry') {
			// Two Substitutes should activate Sitrus Berry
			while (hp % 4 > 0) {
				evs.hp -= 4;
				hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			}
		} else if (hasMove['bellydrum'] && item === 'Sitrus Berry') {
			// Belly Drum should activate Sitrus Berry
			if (hp % 2 > 0) evs.hp -= 4;
		} else if (hasMove['substitute'] && hasMove['reversal']) {
			// Reversal users should be able to use four Substitutes
			if (hp % 4 === 0) evs.hp -= 4;
		} else {
			// Maximize number of Stealth Rock switch-ins
			let srWeakness = this.getEffectiveness('Rock', template);
			if (srWeakness > 0 && hp % (4 / srWeakness) === 0) evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['copycat'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = hasMove['hiddenpower'] ? ivs.atk - 30 : 0;
		}

		if (hasMove['gyroball'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = hasMove['hiddenpower'] ? ivs.spe - 30 : 0;
		}

		return {
			name: template.baseSpecies,
			species: species,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: !this.random(1024),
		};
	}
}

module.exports = RandomGen6Teams;
