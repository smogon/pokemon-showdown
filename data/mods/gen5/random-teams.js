'use strict';

const RandomGen6Teams = require('../../mods/gen6/random-teams');

class RandomGen5Teams extends RandomGen6Teams {
	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {RandomTeamsTypes.TeamDetails} [teamDetails]
	 * @return {RandomTeamsTypes.RandomSet}
	 */
	randomSet(template, slot = 1, teamDetails = {}) {
		let baseTemplate = (template = this.getTemplate(template));
		let species = template.species;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			Monitor.crashlog(err, 'The gen 5 randbat set generator');
		}

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}

		let movePool = (template.randomBattleMoves ? template.randomBattleMoves.slice() : template.learnset ? Object.keys(template.learnset) : []);
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
		let SetupException = ['closecombat', 'extremespeed', 'suckerpunch', 'superpower', 'dracometeor', 'leafstorm', 'overheat'];

		let counterAbilities = ['Adaptability', 'Contrary', 'Hustle', 'Iron Fist', 'Skill Link'];

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

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [i, setMoveid] of moves.entries()) {
				let move = this.getMove(setMoveid);
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
					if (!counter.setupType && !hasMove['cosmicpower']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical + counter['physicalpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'nastyplot': case 'quiverdance': case 'tailglow':
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
					if (counter.damagingMoves.length < 2 && !counter.setupType && !hasMove['batonpass']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;

				// Bad after setup
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) rejected = true;
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'fakeout':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'haze': case 'knockoff': case 'magiccoat': case 'pursuit': case 'spikes': case 'waterspout':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'healingwish':
					if (counter.setupType || !!counter['recovery'] || hasMove['substitute']) rejected = true;
					break;
				case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang':
					if (counter.damagingMoves.length > 1 || counter.setupType) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && (hasAbility['Guts'] || hasAbility['Speed Boost']) && !hasMove['batonpass']) rejected = true;
					if (hasMove['rest'] || hasMove['lightscreen'] && hasMove['reflect']) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect'] || hasMove['suckerpunch'] || hasMove['trickroom']) rejected = true;
					break;
				case 'toxicspikes':
					if (counter.setupType || teamDetails.toxicSpikes) rejected = true;
					break;
				case 'trickroom':
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['batonpass']) rejected = true;
					break;
				case 'voltswitch':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['batonpass'] || hasMove['magnetrise'] || hasMove['uturn']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite':
					if (hasMove['uturn']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['dragontail'] || hasMove['outrage']) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage']) rejected = true;
					break;
				case 'boltstrike':
					if (!counter.setupType && hasMove['fusionbolt']) rejected = true;
					break;
				case 'discharge': case 'thunder':
					if (hasMove['voltswitch']) rejected = true;
					break;
				case 'fusionbolt':
					if (counter.setupType && hasMove['boltstrike']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || hasMove['thunder'] || hasMove['voltswitch']) rejected = true;
					break;
				case 'crosschop': case 'highjumpkick':
					if (hasMove['closecombat']) rejected = true;
					break;
				case 'drainpunch':
					if (hasMove['closecombat'] || hasMove['crosschop'] || hasMove['highjumpkick']) rejected = true;
					break;
				case 'flareblitz': case 'fierydance': case 'flamethrower': case 'lavaplume':
					if (hasMove['blueflare'] || hasMove['fireblast'] || hasMove['overheat']) rejected = true;
					break;
				case 'firepunch':
					if (hasMove['flareblitz']) rejected = true;
					break;
				case 'overheat':
					if (counter.setupType === 'Special' || hasMove['fireblast']) rejected = true;
					break;
				case 'airslash': case 'bravebird': case 'drillpeck': case 'pluck':
					if (hasMove['acrobatics'] || hasMove['hurricane']) rejected = true;
					break;
				case 'gigadrain':
					if ((!counter.setupType && hasMove['leafstorm']) || hasMove['petaldance'] || hasMove['powerwhip']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'leafstorm':
					if (counter.setupType && hasMove['gigadrain']) rejected = true;
					break;
				case 'bonemerang': case 'earthpower':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard']) rejected = true;
					break;
				case 'endeavor':
					if (slot > 0) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam'] || hasMove['facade'] || hasMove['doubleedge'] || hasMove['tailslap']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['sunnyday']) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'psychic':
					if (hasMove['psyshock']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if (hasMove['headsmash'] || hasMove['stoneedge']) rejected = true;
					break;
				case 'stoneedge':
					if (hasMove['headsmash']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['razorshell'] || hasMove['scald']) rejected = true;
					break;
				case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				case 'waterfall':
					if (hasMove['aquatail']) rejected = true;
					break;

				// Status:
				case 'encore': case 'iceshard': case 'suckerpunch':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
					if (hasMove['leechseed'] || hasMove['rest'] || hasMove['wish']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['pursuit'] || hasMove['rest'] || hasMove['uturn'] || hasMove['voltswitch']) rejected = true;
					break;
				case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['discharge'] || hasMove['trickroom']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['lavaplume'] || hasMove['scald']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && !!counter['speedsetup']) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					if (!SetupException.includes(moveid) && (!hasType[move.type] || counter.stab > 1 || counter[move.category] < 2)) rejected = true;
				}
				// @ts-ignore
				if (counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType && counter[counter.setupType] < 2 && !hasMove['batonpass'] && moveid !== 'rest' && moveid !== 'sleeptalk') {
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
					((counter.damagingMoves.length === 0 && !hasMove['metalburst']) ||
					(!counter.stab && (template.types.length > 1 || (template.types[0] !== 'Normal' && template.types[0] !== 'Psychic') || !hasMove['icebeam'] || template.baseStats.spa >= template.baseStats.spd) && (!!counter['physicalpool'] || !!counter['specialpool'])) ||
					(hasType['Dark'] && !counter['Dark']) ||
					(hasType['Dragon'] && !counter['Dragon']) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice']) ||
					(hasType['Rock'] && !counter['Rock'] && counter.setupType === 'Physical') ||
					(hasType['Steel'] && hasAbility['Technician'] && !counter['Steel']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab)) ||
					// @ts-ignore
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					(hasAbility['Bad Dreams'] && movePool.includes('darkvoid')) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
					(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(!counter.recovery && (movePool.includes('softboiled') || template.nfe && !!counter['Status'] && (movePool.includes('recover') || movePool.includes('roost')))) ||
					(template.requiredMove && movePool.includes(toId(template.requiredMove)))))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && !move.damage && !move.heal && moveid !== 'judgment' && moveid !== 'rest' && moveid !== 'sleeptalk') {
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
					moves.splice(i, 1);
					break;
				}

				// Handle Hidden Power IVs
				if (moveid === 'hiddenpower') {
					let HPivs = this.getType(move.type).HPivs;
					for (let iv in HPivs) {
						// @ts-ignore
						ivs[iv] = HPivs[iv];
					}
				}
			}
		} while (moves.length < 4 && movePool.length);

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
					// Adaptability, Contrary, Hustle, Iron Fist, Skill Link
					// @ts-ignore
					rejectAbility = !counter[toId(ability)];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = !hasMove['sunnyday'] && !teamDetails['sun'];
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = !counter['Physical'] && !hasMove['batonpass'];
				} else if (ability === 'Gluttony' || ability === 'Inner Focus' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Ice Body' || ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.indexOf('Ground') >= 0;
				} else if (ability === 'Limber') {
					rejectAbility = template.types.indexOf('Electric') >= 0;
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = abilities.includes('Technician') && !!counter['technician'];
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Regenerator') {
					rejectAbility = abilities.includes('Magic Guard');
				} else if (ability === 'Sand Force' || ability === 'Sand Rush' || ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || template.species === 'Blissey' || template.species === 'Togetic';
				} else if (ability === 'Sheer Force') {
					rejectAbility = !counter['sheerforce'] || (abilities.includes('Iron Fist') && counter['ironfist'] > counter['sheerforce']);
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['flamecharge'] && !hasMove['stockpile'];
				} else if (ability === 'Sturdy') {
					rejectAbility = !!counter['recoil'] && !counter['recovery'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || (abilities.includes('Skill Link') && counter['skilllink'] >= counter['technician']);
				} else if (ability === 'Tinted Lens') {
					rejectAbility = counter['damage'] >= counter.damagingMoves.length || (counter.Status > 2 && !counter.setupType);
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				} else if (ability === 'Unburden') {
					rejectAbility = template.baseStats.spe > 100;
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
						// @ts-ignore
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.indexOf('Guts') >= 0 && ability !== 'Quick Feet' && hasMove['facade']) {
				ability = 'Guts';
			} else if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
			} else if (abilities.indexOf('Swift Swim') >= 0 && hasMove['raindance']) {
				ability = 'Swift Swim';
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
		} else if (template.species === 'Deoxys-Attack') {
			item = (slot === 0 && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Pikachu') {
			item = 'Light Ball';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wobbuffet' && hasMove['destinybond'] && this.randomChance(1, 2)) {
			item = 'Custap Berry';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (hasMove['trick'] && hasMove['gyroball']) {
			item = (ability === 'Levitate' || hasType['Flying']) ? 'Macho Brace' : 'Iron Ball';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (template.baseStats.spe >= 60 && template.baseStats.spe <= 108) {
				item = 'Choice Scarf';
			} else {
				item = (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		} else if (template.evos.length) {
			item = 'Eviolite';
		} else if (hasMove['shellsmash']) {
			item = 'White Herb';
		} else if (ability === 'Harvest') {
			item = 'Sitrus Berry';
		} else if ((ability === 'Magic Guard' || ability === 'Sheer Force') && counter.damagingMoves.length > 1) {
			item = 'Life Orb';
		} else if (hasMove['facade'] || ability === 'Poison Heal' || ability === 'Toxic Boost') {
			item = 'Toxic Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = 'Chesto Berry';
		} else if (hasMove['raindance']) {
			item = 'Damp Rock';
		} else if (hasMove['sunnyday']) {
			item = 'Heat Rock';
		} else if (hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (hasMove['acrobatics']) {
			item = 'Flying Gem';
		} else if (hasMove['psychoshift'] || (ability === 'Guts' && !hasMove['sleeptalk'])) {
			item = hasMove['drainpunch'] ? 'Flame Orb' : 'Toxic Orb';
		} else if (ability === 'Unburden' && (counter['Physical'] || counter['Special'])) {
			// Give Unburden mons a random Gem of the type of one of their damaging moves
			let eligibleTypes = [];
			for (const setMoveid of moves) {
				let move = this.getMove(setMoveid);
				if (!move.basePower && !move.basePowerCallback) continue;
				eligibleTypes.push(move.type);
			}
			item = this.sample(eligibleTypes) + ' Gem';

		// Medium priority
		} else if (counter.Physical >= 4 && !hasMove['fakeout'] && !hasMove['suckerpunch'] && !hasMove['flamecharge'] && !hasMove['rapidspin']) {
			item = !counter['Normal'] && this.randomChance(1, 3) ? 'Expert Belt' : 'Choice Band';
		} else if (counter.Special >= 4) {
			item = this.randomChance(1, 3) ? 'Expert Belt' : 'Choice Specs';
		} else if (ability === 'Speed Boost' && !hasMove['substitute'] && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if ((hasMove['eruption'] || hasMove['waterspout']) && !counter['Status']) {
			item = 'Choice Scarf';
		} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (hasMove['substitute'] && hasMove['reversal']) {
			let eligibleTypes = [];
			for (const setMoveid of moves) {
				let move = this.getMove(setMoveid);
				if (!move.basePower && !move.basePowerCallback) continue;
				eligibleTypes.push(move.type);
			}
			item = this.sample(eligibleTypes) + ' Gem';
		} else if ((hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = 'Focus Sash';
		} else if (ability === 'Slow Start' || hasMove['detect'] || hasMove['protect'] || hasMove['sleeptalk'] || hasMove['substitute']) {
			item = 'Leftovers';
		} else if (ability === 'Iron Barbs') {
			item = 'Rocky Helmet';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (template.baseStats.hp + template.baseStats.def + template.baseStats.spd > 275) {
			item = 'Leftovers';
		} else if (counter.Physical + counter.Special >= 3 && counter.setupType) {
			item = hasMove['outrage'] ? 'Lum Berry' : 'Life Orb';
		} else if (counter.Physical + counter.Special >= 4) {
			item = counter['Normal'] ? 'Life Orb' : 'Expert Belt';
		} else if (slot === 0 && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd <= 275) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (this.getEffectiveness('Rock', template) >= 1 || hasMove['dragontail']) {
			item = 'Leftovers';
		} else if (counter.Status <= 1 && ability !== 'Sturdy' && !hasMove['rapidspin']) {
			item = 'Life Orb';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		let levelScale = {
			Uber: 78,
			OU: 80,
			UUBL: 81,
			UU: 82,
			RUBL: 83,
			RU: 84,
			NUBL: 85,
			NU: 86,
		};
		let customScale = {
			Blaziken: 79, 'Deoxys-Defense': 79, Landorus: 79, Manaphy: 79, Thundurus: 79, 'Tornadus-Therian': 79, Unown: 100,
		};
		// @ts-ignore
		let level = levelScale[template.tier] || 80;
		// @ts-ignore
		if (customScale[template.name]) level = customScale[template.name];

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = hasMove['hiddenpower'] ? ivs.atk - 28 : 0;
		}

		if (hasMove['gyroball'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = hasMove['hiddenpower'] ? ivs.spe - 28 : 0;
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

	randomTeam() {
		let pokemon = [];

		const allowedNFE = ['Porygon2', 'Scyther'];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (template.gen <= this.gen && (!template.nfe || allowedNFE.includes(template.species)) && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		/**@type {{[k: string]: number}} */
		let baseFormes = {};
		/**@type {{[k: string]: number}} */
		let tierCount = {};
		/**@type {{[k: string]: number}} */
		let typeCount = {};
		/**@type {{[k: string]: number}} */
		let typeComboCount = {};
		/**@type {RandomTeamsTypes.TeamDetails} */
		let teamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus':
				if (this.randomChance(16, 17)) continue;
				break;
			case 'Rotom':
				if (this.randomChance(5, 6)) continue;
				break;
			case 'Deoxys':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Castform': case 'Kyurem': case 'Wormadam':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Basculin': case 'Cherrim': case 'Giratina': case 'Landorus': case 'Meloetta': case 'Shaymin': case 'Thundurus': case 'Tornadus':
				if (this.randomChance(1, 2)) continue;
				break;
			}

			let tier = template.tier;

			// Limit two Pokemon per tier
			if (!tierCount[tier]) {
				tierCount[tier] = 1;
			} else if (tierCount[tier] > 1 && this.gen === 5) {
				continue;
			}

			let types = template.types;

			// Limit 2 of any type
			let skip = false;
			for (const type of template.types) {
				if (typeCount[type] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			let set = this.randomSet(template, pokemon.length, teamDetails);

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			// Limit 1 of any type combination
			let typeCombo = template.types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= 1) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === 6) {
				// Set Zoroark's level to be the same as the last Pokemon
				let illusion = teamDetails['illusion'];
				if (illusion) pokemon[illusion - 1].level = pokemon[5].level;
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;
			tierCount[tier]++;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Team details
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;

			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails['illusion'] = pokemon.length;
		}
		return pokemon;
	}
}

module.exports = RandomGen5Teams;
