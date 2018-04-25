'use strict';

const RandomGen5Teams = require('../../mods/gen5/random-teams');

class RandomGen4Teams extends RandomGen5Teams {
	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {RandomTeamsTypes["TeamDetails"]} [teamDetails]
	 * @return {RandomTeamsTypes["RandomSet"]}
	 */
	randomSet(template, slot, teamDetails = {}) {
		if (slot === undefined) slot = 1;
		let baseTemplate = (template = this.getTemplate(template));
		let species = template.species;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			require('../../lib/crashlogger')(err, 'The gen 4 randbat set generator');
		}

		if (template.battleOnly) species = template.baseSpecies;

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
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		let hasAbility = {};
		hasAbility[template.abilities[0]] = true;
		if (template.abilities[1]) {
			// @ts-ignore
			hasAbility[template.abilities[1]] = true;
		}
		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = ['suckerpunch', 'dracometeor', 'overheat'];
		let counterAbilities = ['Adaptability', 'Hustle', 'Iron Fist', 'Skill Link'];

		// Give recovery moves priority over certain other defensive status moves
		let recoveryMoves = ['healorder', 'milkdrink', 'moonlight', 'morningsun', 'painsplit', 'recover', 'rest', 'roost', 'slackoff', 'softboiled', 'synthesis', 'wish'];
		let defensiveStatusMoves = ['aromatherapy', 'haze', 'healbell', 'roar', 'whirlwind', 'willowisp', 'yawn'];

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
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['substitute']) rejected = true;
					break;
				case 'eruption': case 'waterspout':
					if (counter.Physical + counter.Special < 4) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['hammerarm']) rejected = true;
					break;
				case 'raindance':
					if (counter.Physical + counter.Special < 2 && !(hasAbility['Hydration'] && hasMove['rest'])) rejected = true;
					break;
				case 'refresh':
					if (!(hasMove['calmmind'] && (hasMove['recover'] || hasMove['roost']))) rejected = true;
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
				case 'sunnyday':
					if (!hasMove['solarbeam']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['raindance'] && !hasMove['sunnyday']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'curse': case 'dragondance': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) {
						if (!hasMove['growth'] || hasMove['sunnyday']) rejected = true;
					}
					if (counter.Physical + counter['physicalpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'growth': case 'nastyplot': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'agility': case 'rockpolish':
					if (counter.damagingMoves.length < 2 && !hasMove['batonpass']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;

				// Bad after setup
				case 'destinybond':
					if (counter.setupType || hasMove['explosion']) rejected = true;
					break;
				case 'explosion': case 'selfdestruct':
					if (hasType['Normal'] && counter.stab < 2 || counter.setupType === 'Special') rejected = true;
					if (moves.some(id => recoveryMoves.includes(id) || defensiveStatusMoves.includes(id)) || hasMove['batonpass'] || hasMove['protect'] || hasMove['substitute']) rejected = true;
					break;
				case 'foresight': case 'roar': case 'whirlwind':
					if (counter.setupType && !hasAbility['Speed Boost']) rejected = true;
					break;
				case 'healingwish': case 'lunardance':
					if (counter.setupType || hasMove['rest'] || hasMove['substitute']) rejected = true;
					break;
				case 'protect':
					if (!(hasAbility['Guts'] || hasAbility['Quick Feet'] || hasAbility['Speed Boost'] || hasMove['toxic'] || hasMove['wish'])) rejected = true;
					break;
				case 'wish':
					if (!(hasMove['batonpass'] || hasMove['protect'] || hasMove['uturn'])) rejected = true;
					if (hasMove['rest'] || !!counter['speedsetup']) rejected = true;
					break;
				case 'rapidspin':
					if (teamDetails.rapidSpin || counter.setupType && counter.Physical + counter.Special < 2) rejected = true;
					break;
				case 'reflect': case 'lightscreen': case 'fakeout':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['substitute']) rejected = true;
					break;
				case 'spikes':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || hasMove['substitute']) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || hasMove['substitute'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect'] || hasMove['suckerpunch'] || hasMove['trickroom']) rejected = true;
					break;
				case 'toxic': case 'toxicspikes':
					if (counter.setupType || !!counter['speedsetup'] || teamDetails.toxicSpikes) rejected = true;
					break;
				case 'trickroom':
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['batonpass'] || hasMove['substitute'] || hasAbility['Speed Boost'] && hasMove['protect']) rejected = true;
					if (hasType['Bug'] && counter.stab < 2 && counter.damagingMoves.length > 1) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bodyslam': case 'slash':
					if (hasMove['facade'] || hasMove['return']) rejected = true;
					break;
				case 'doubleedge':
					if (hasMove['bodyslam'] || hasMove['facade'] || hasMove['return']) rejected = true;
					break;
				case 'headbutt':
					if (!hasMove['bodyslam'] && !hasMove['thunderwave']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'quickattack':
					if (hasMove['thunderwave']) rejected = true;
					break;
				case 'firepunch': case 'flamethrower':
					if (hasMove['fireblast'] || hasMove['overheat'] && !counter.setupType) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['fireblast'] && !!counter['speedsetup']) rejected = true;
					if (hasMove['flareblitz'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'fireblast':
					if (hasMove['lavaplume'] && !counter['speedsetup']) rejected = true;
					if (hasMove['flareblitz'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'overheat':
					if (counter.setupType === 'Special' || hasMove['batonpass'] || hasMove['fireblast'] || hasMove['flareblitz']) rejected = true;
					break;
				case 'aquajet':
					if (hasMove['waterfall'] && counter.Physical < 3) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['surf']) rejected = true;
					break;
				case 'waterfall':
					if (hasMove['aquatail']) rejected = true;
					if ((hasMove['hydropump'] || hasMove['surf']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'chargebeam':
					if (hasMove['thunderbolt'] && counter.Special < 3) rejected = true;
					break;
				case 'discharge':
					if (hasMove['thunderbolt']) rejected = true;
					break;
				case 'energyball':
					if (hasMove['leafblade'] || hasMove['woodhammer'] || (hasMove['sunnyday'] && hasMove['solarbeam'])) rejected = true;
					break;
				case 'grassknot': case 'seedbomb':
					if (hasMove['woodhammer'] || (hasMove['sunnyday'] && hasMove['solarbeam'])) rejected = true;
					break;
				case 'leafstorm':
					if (counter.setupType || hasMove['batonpass'] || hasMove['powerwhip'] || (hasMove['sunnyday'] && hasMove['solarbeam'])) rejected = true;
					break;
				case 'solarbeam':
					if (counter.setupType === 'Physical' || !hasMove['sunnyday']) rejected = true;
					break;
				case 'icepunch':
					if (!counter.setupType && hasMove['icebeam']) rejected = true;
					break;
				case 'aurasphere': case 'drainpunch': case 'focusblast':
					if (hasMove['closecombat'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'brickbreak': case 'closecombat': case 'crosschop': case 'lowkick':
					if (hasMove['substitute'] && hasMove['focuspunch']) rejected = true;
					break;
				case 'machpunch':
					if (hasType['Fighting'] && counter.stab < 2 && !hasAbility['Technician']) rejected = true;
					if (hasMove['vacuumwave'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'seismictoss':
					if (hasMove['nightshade'] || counter.Physical + counter.Special >= 1) rejected = true;
					break;
				case 'superpower':
					if (hasMove['dragondance'] || !!counter['speedsetup']) rejected = true;
					break;
				case 'gunkshot':
					if (hasMove['poisonjab']) rejected = true;
					break;
				case 'earthpower':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'airslash':
					if (!counter.setupType && hasMove['bravebird']) rejected = true;
					break;
				case 'zenheadbutt':
					if (hasMove['psychocut']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if (hasMove['stoneedge']) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['shadowforce']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['outrage']) rejected = true;
					break;
				case 'dracometeor':
					if (hasMove['calmmind'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'crunch': case 'nightslash':
					if (hasMove['suckerpunch']) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || hasMove['payback']) rejected = true;
					break;
				case 'gyroball': case 'flashcannon':
					if (hasMove['ironhead'] && counter.setupType !== 'Special') rejected = true;
					break;

				// Status:
				case 'encore':
					if (hasMove['roar'] || hasMove['taunt'] || hasMove['whirlwind'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'haze': case 'taunt':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'leechseed': case 'painsplit':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest']) rejected = true;
					break;
				case 'recover': case 'slackoff':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'stunspore':
					if (counter.setupType || hasMove['toxic'] || movePool.includes('sleeppowder') || movePool.includes('spore')) rejected = true;
					break;
				case 'substitute':
					if (hasMove['pursuit'] || hasMove['rest'] || hasMove['taunt']) rejected = true;
					break;
				case 'thunderwave':
					if (counter.setupType || hasMove['toxic'] || hasMove['trickroom'] || hasMove['bodyslam'] && hasAbility['Serene Grace']) rejected = true;
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
				if (counter.setupType && !isSetup && move.category !== counter.setupType && counter[counter.setupType] < 2 && !hasMove['batonpass']) {
					// Mono-attacking with setup and RestTalk or recovery + status healing is allowed
					if (moveid !== 'rest' && moveid !== 'sleeptalk' &&
						!(recoveryMoves.includes(moveid) && (hasMove['healbell'] || hasMove['refresh'])) &&
						!((moveid === 'healbell' || moveid === 'refresh') && moves.some(id => !!recoveryMoves.includes(id)))) {
						// Reject Status moves only if there is nothing else to reject
						if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
					}
				}
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && template.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Reject defensive status moves if a reliable recovery move is available but not selected.
				// Toxic is only defensive if used with another status move other than Protect (Toxic + 3 attacks and Toxic + Protect are ok).
				if ((defensiveStatusMoves.includes(moveid) || moveid === 'toxic' && ((counter.Status > 1 && !hasMove['protect']) || counter.Status > 2)) &&
					!moves.some(id => recoveryMoves.includes(id)) && movePool.some(id => recoveryMoves.includes(id))) {
					rejected = true;
				}

				// Pokemon should have moves that benefit their Ability/Type/Weather, as well as moves required by its forme
				if ((hasType['Dragon'] && !counter['Dragon']) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Flying'] && !counter['Flying'] && movePool.includes('bravebird')) ||
					(hasType['Grass'] && !counter['Grass'] && (movePool.includes('leafblade') || movePool.includes('leafstorm') || movePool.includes('seedflare') || movePool.includes('woodhammer'))) ||
					(hasType['Ground'] && !counter['Ground']) ||
					(hasType['Ice'] && !counter['Ice'] && (!hasType['Water'] || !counter['Water'])) ||
					(hasType['Psychic'] && !!counter['Psychic'] && !hasType['Flying'] && template.types.length > 1 && counter.stab < 2) ||
					(hasType['Rock'] && !counter['Rock'] && movePool.includes('headsmash')) ||
					(hasType['Water'] && !counter['Water'] && (!hasType['Ice'] || !counter['Ice'])) ||
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(counter['defensesetup'] && !counter.recovery && !hasMove['rest']) ||
					(template.requiredMove && movePool.includes(toId(template.requiredMove)))) &&
					(counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && moveid !== 'judgment' && !recoveryMoves.includes(moveid) && moveid !== 'sleeptalk') {
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
					moves.splice(i, 1);
					break;
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
							replace = true;
						}
						if (replace) moves.splice(counter.damagingMoveIndex[damagingid], 1);
					}
				} else if (!counter.damagingMoves[0].damage && !counter.damagingMoves[1].damage && template.species !== 'Clefable' && template.species !== 'Porygon2') {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					let rejectableMoves = [];
					let baseDiff = movePool.length - availableHP;
					for (const move of counter.damagingMoves) {
						if (baseDiff || availableHP && (!hasMove['hiddenpower'] || move.id === 'hiddenpower')) {
							rejectableMoves.push(counter.damagingMoveIndex[move.id]);
						}
					}
					if (rejectableMoves.length) {
						moves.splice(this.sample(rejectableMoves), 1);
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
		ability = ability0.name;
		if (abilities[1]) {
			if (ability0.rating <= ability1.rating) {
				if (this.randomChance(1, 2)) ability = ability1.name;
			} else if (ability0.rating - 0.6 <= ability1.rating) {
				if (this.randomChance(1, 3)) ability = ability1.name;
			}

			let rejectAbility = false;
			if (counterAbilities.includes(ability)) {
				// Adaptability, Hustle, Iron Fist, Skill Link
				rejectAbility = !counter[toId(ability)];
			} else if (ability === 'Blaze') {
				rejectAbility = !counter['Fire'];
			} else if (ability === 'Chlorophyll') {
				rejectAbility = !hasMove['sunnyday'];
			} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
				rejectAbility = !counter['inaccurate'];
			} else if (ability === 'Early Bird') {
				rejectAbility = !hasMove['rest'];
			} else if (ability === 'Gluttony') {
				rejectAbility = !hasMove['bellydrum'];
			} else if (ability === 'Lightning Rod') {
				rejectAbility = template.types.includes('Ground');
			} else if (ability === 'Limber') {
				rejectAbility = template.types.includes('Electric');
			} else if (ability === 'Mold Breaker') {
				rejectAbility = !hasMove['earthquake'];
			} else if (ability === 'Overgrow') {
				rejectAbility = !counter['Grass'];
			} else if (ability === 'Poison Heal') {
				rejectAbility = abilities.includes('Technician') && !!counter['technician'];
			} else if (ability === 'Reckless' || ability === 'Rock Head') {
				rejectAbility = !counter['recoil'];
			} else if (ability === 'Sand Veil') {
				rejectAbility = !teamDetails['sand'];
			} else if (ability === 'Serene Grace') {
				rejectAbility = !counter['serenegrace'] || template.id === 'chansey' || template.id === 'blissey';
			} else if (ability === 'Simple') {
				rejectAbility = !counter.setupType && !hasMove['cosmicpower'] && !hasMove['flamecharge'];
			} else if (ability === 'Snow Cloak') {
				rejectAbility = !teamDetails['hail'];
			} else if (ability === 'Solar Power') {
				rejectAbility = !counter['Special'];
			} else if (ability === 'Speed Boost') {
				rejectAbility = hasMove['uturn'];
			} else if (ability === 'Sturdy') {
				rejectAbility = !!counter['recoil'] && !counter['recovery'];
			} else if (ability === 'Swift Swim') {
				rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
			} else if (ability === 'Swarm') {
				rejectAbility = !counter['Bug'];
			} else if (ability === 'Synchronize') {
				rejectAbility = counter.Status < 2;
			} else if (ability === 'Tinted Lens') {
				rejectAbility = counter['damage'] >= counter.damagingMoves.length;
			} else if (ability === 'Torrent') {
				rejectAbility = !counter['Water'];
			}

			if (rejectAbility) {
				if (ability === ability1.name) { // or not
					ability = ability0.name;
				} else if (ability1.rating > 1) { // only switch if the alternative doesn't suck
					ability = ability1.name;
				}
			}
			if (abilities.includes('Hydration') && hasMove['raindance'] && hasMove['rest']) {
				ability = 'Hydration';
			} else if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
		}

		item = 'Leftovers';
		if (template.requiredItems) {
			item = this.sample(template.requiredItems);

		// First, the extra high-priority items
		} else if (template.species === 'Deoxys-Attack') {
			item = (slot === 0 && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wobbuffet') {
			item = hasMove['destinybond'] ? 'Custap Berry' : this.sample(['Leftovers', 'Sitrus Berry']);
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			let randomBool = this.randomChance(1, 3);
			if (counter.Physical >= 3 && (template.baseStats.spe < 60 || template.baseStats.spe > 108 || randomBool)) {
				item = 'Choice Band';
			} else if (counter.Special >= 3 && (template.baseStats.spe < 60 || template.baseStats.spe > 108 || randomBool)) {
				item = 'Choice Specs';
			} else {
				item = 'Choice Scarf';
			}
		} else if (hasMove['bellydrum']) {
			item = 'Sitrus Berry';
		} else if (ability === 'Magic Guard' || ability === 'Speed Boost' && counter.Status < 2) {
			item = 'Life Orb';
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
		} else if ((ability === 'Guts' || ability === 'Quick Feet') && hasMove['facade']) {
			item = 'Toxic Orb';
		} else if (ability === 'Unburden') {
			item = 'Sitrus Berry';

		// Medium priority
		} else if (counter.Physical >= 4 && !(hasMove['bodyslam'] && hasAbility['Serene Grace']) && !hasMove['fakeout'] && !hasMove['rapidspin'] && !hasMove['suckerpunch']) {
			item = template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && !hasMove['bodyslam'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Band';
		} else if ((counter.Special >= 4 || (counter.Special >= 3 && (hasMove['batonpass'] || hasMove['uturn'] || hasMove['waterspout'] && hasMove['selfdestruct']))) && !hasMove['chargebeam']) {
			item = template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && ability !== 'Speed Boost' && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) {
			item = 'Focus Sash';
		} else if (ability === 'Slow Start' || hasMove['curse'] || hasMove['detect'] || hasMove['leechseed'] || hasMove['protect'] || hasMove['roar'] || hasMove['sleeptalk'] || hasMove['whirlwind']) {
			item = 'Leftovers';
		} else if (hasMove['outrage'] && counter.setupType) {
			item = 'Lum Berry';
		} else if (hasMove['substitute']) {
			item = counter.damagingMoves.length < 2 ||
				!counter['drain'] && (counter.damagingMoves.length < 3 || template.baseStats.hp >= 60 || template.baseStats.def + template.baseStats.spd >= 180) ? 'Leftovers' : 'Life Orb';
		} else if (hasMove['lightscreen'] || hasMove['reflect']) {
			item = 'Light Clay';
		} else if (template.species === 'Palkia' && !!counter['Dragon'] && !!counter['Water']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 4) {
			item = (!!counter['Normal'] || hasMove['chargebeam'] || hasMove['suckerpunch']) ? 'Life Orb' : 'Expert Belt';
		} else if (counter.damagingMoves.length >= 3 && !hasMove['superfang'] && !hasMove['metalburst']) {
			let totalBulk = template.baseStats.hp + template.baseStats.def + template.baseStats.spd;
			item = (!!counter['speedsetup'] || !!counter['priority'] || hasMove['dragondance'] || hasMove['trickroom'] ||
				totalBulk < 235 || (template.baseStats.spe >= 70 && (totalBulk < 260 || (!!counter['recovery'] && totalBulk < 285)))) ? 'Life Orb' : 'Leftovers';
		} else if (slot === 0 && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 260) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (this.getEffectiveness('Rock', template) >= 1 || hasMove['roar']) {
			item = 'Leftovers';
		} else if (counter.Status <= 1 && !hasMove['rapidspin'] && !hasMove['superfang']) {
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
			NFE: 85,
			NU: 83,
			NUBL: 81,
			UU: 79,
			UUBL: 77,
			OU: 75,
			Uber: 71,
		};
		let customScale = {
			Ditto: 99, Unown: 99,
		};
		let tier = template.tier;
		let level = levelScale[tier] || 75;
		if (customScale[template.name]) level = customScale[template.name];

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
}

module.exports = RandomGen4Teams;
