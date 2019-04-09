'use strict';

const RandomGen4Teams = require('../../mods/gen4/random-teams');

class RandomGen3Teams extends RandomGen4Teams {
	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {RandomTeamsTypes.TeamDetails} [teamDetails]
	 * @return {RandomTeamsTypes.RandomSet}
	 */
	randomSet(template, slot, teamDetails = {}) {
		let baseTemplate = (template = this.getTemplate(template));
		let species = template.species;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			Monitor.crashlog(err, 'The gen 3 randbat set generator');
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
			// @ts-ignore TypeScript bug
			hasAbility[template.abilities[1]] = true;
		}
		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		let recoveryMoves = [
			'milkdrink', 'moonlight', 'morningsun', 'painsplit', 'recover', 'rest', 'slackoff', 'softboiled',
			'synthesis', 'wish',
		];

		// these Pokemon always want recovery
		let requiresRecovery = [
			'Clefable', 'Lickitung', 'Blissey', 'Umbreon', 'Porygon2', 'Meganium', 'Miltank', 'Lugia',
			'Ho-Oh', 'Sableye', 'Cradily', 'Milotic', 'Dusclops', 'Latias', 'Deoxys-Defense',
		];

		// these Pokemon don't always want a STAB move
		let noStab = [
			'Clefable', 'Gengar', 'Kingler', 'Blissey', 'Porygon2', 'Umbreon', 'Dragonite', 'Feraligatr',
			'Noctowl', 'Azumarill', 'Misdreavus', 'Sneasel', 'Mightyena', 'Masquerain', 'Nosepass', 'Delcatty',
			'Volbeat', 'Illumise', 'Castform', 'Absol',
		];

		// these Pokemon don't need any damaging attacks
		let noAttacks = [
			'Smeargle', 'Shuckle',
		];

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
				let setMoveid = this.sampleNoReplace(movePool);
				if (setMoveid.substr(0, 11) === 'hiddenpower') {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[setMoveid] = true;
				}
				moves.push(setMoveid);
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
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['substitute'] && !hasMove['meanlook'] && !hasMove['spiderweb']) rejected = true;
					break;
				case 'eruption': case 'waterspout':
					if (counter.Physical + counter.Special < 4) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] && (counter.Physical < 4 || hasMove['fakeout'] || hasMove['rapidspin'])) rejected = true;
					if (counter.setupType || counter.damagingMoves.length < 2 || hasMove['sleeptalk']) rejected = true;
					break;
				case 'meanlook': case 'spiderweb':
					if (!hasMove['batonpass'] && !hasMove['perishsong']) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['meanlook'] && !hasMove['spiderweb']) rejected = true;
					if (!hasMove['protect'] && !hasMove['substitute']) rejected = true;
					if (counter.setupType || hasMove['batonpass']) rejected = true;
					break;
				case 'raindance':
					if (hasMove['rest'] || counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'rest':
					if (hasMove['painsplit'] || hasMove['recover'] || hasMove['wish']) rejected = true;
					if (movePool.includes('sleeptalk')) rejected = true;
					break;
				case 'sleeptalk':
					if (hasMove['painsplit'] || hasMove['recover'] || hasMove['wish']) rejected = true;
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						let rest = movePool.indexOf('rest');
						if (rest >= 0) this.fastPop(movePool, rest);
					}
					break;
				case 'sunnyday':
					if (!hasMove['solarbeam']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'curse': case 'dragondance': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical + counter['physicalpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					if (moveid === 'bellydrum' && !hasMove['substitute'] && !hasMove['extremespeed'] && !hasMove['softboiled']) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'growth': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'agility':
					if (counter.damagingMoves.length < 2 && !hasMove['batonpass']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;
				case 'endeavor': case 'flail': case 'reversal':
					if (!hasMove['substitute'] && !hasMove['endure']) rejected = true;
					if (moveid === 'flail' && hasMove['extremespeed']) rejected = true;
					break;

				// Bad after setup
				case 'destinybond': case 'explosion': case 'memento': case 'selfdestruct':
					if (counter.setupType || recoveryMoves.some(recoveryMove => hasMove[recoveryMove]) || hasMove['substitute']) rejected = true;
					if (moveid === 'destinybond' && (hasMove['explosion'] || hasMove['selfdestruct'])) rejected = true;
					if (moveid === 'memento' && hasMove['destinybond']) rejected = true;
					break;
				case 'fakeout':
					if (counter.setupType || hasMove['substitute'] || hasMove['sunnyday'] || counter.damagingMoves.length < 3) rejected = true;
					break;
				case 'haze': case 'knockoff':
					if (counter.setupType || !!counter['speedsetup']) rejected = true;
					break;
				case 'protect':
					if (!hasAbility['Speed Boost'] && !hasAbility['Wonder Guard'] && !hasMove['perishsong'] && !hasMove['toxic'] && !hasMove['wish']) rejected = true;
					if (hasMove['sleeptalk']) rejected = true;
					break;
				case 'roar': case 'whirlwind':
					if (counter.setupType || hasMove['encore'] || hasMove['substitute'] || hasMove['yawn']) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || teamDetails.rapidSpin) rejected = true;
					break;
				case 'spikes':
					if (counter.setupType || teamDetails.spikes) rejected = true;
					break;
				case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'toxic':
					if (counter.setupType) rejected = true;
					break;
				case 'endure':
					if (counter.Status >= 3 || counter.recoil || hasMove['substitute']) rejected = true;
					break;
				case 'counter': case 'mirrorcoat':
					if (counter.setupType || hasMove['rest'] || hasMove['substitute']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bodyslam': case 'doubleedge':
					if (hasMove['return'] || hasMove['flail'] || hasMove['endure'] && movePool.includes('flail')) rejected = true;
					if (moveid === 'doubleedge' && hasMove['bodyslam']) rejected = true;
					break;
				case 'headbutt':
					if (!hasMove['bodyslam'] && !hasMove['thunderwave']) rejected = true;
					break;
				case 'return': case 'slash':
					if (hasMove['flail'] || hasMove['endure'] && movePool.includes('flail')) rejected = true;
					break;
				case 'quickattack':
					if (hasMove['thunderwave'] || counter.damagingMoves.length < 3 || hasType['Normal'] && counter['Normal'] < 2) rejected = true;
					break;
				case 'superfang':
					if (hasMove['endeavor']) rejected = true;
					break;
				case 'flamethrower':
					if (hasMove['fireblast']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['surf']) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['magicalleaf'] || hasMove['razorleaf'] || hasMove['solarbeam'] && hasMove['sunnyday']) rejected = true;
					break;
				case 'hiddenpowergrass': case 'magicalleaf': case 'razorleaf':
					if (hasMove['solarbeam'] && hasMove['sunnyday']) rejected = true;
					break;
				case 'solarbeam':
					if (counter.setupType === 'Physical' || !hasMove['sunnyday']) rejected = true;
					break;
				case 'brickbreak': case 'crosschop': case 'hiddenpowerfighting': case 'highjumpkick': case 'skyuppercut':
					if (hasMove['reversal'] || hasMove['endure'] && movePool.includes('reversal') || hasMove['substitute'] && hasMove['focuspunch']) rejected = true;
					if (moveid === 'brickbreak' && hasMove['skyuppercut']) rejected = true;
					if (moveid === 'highjumpkick' && hasMove['brickbreak']) rejected = true;
					break;
				case 'machpunch':
					if (hasType['Fighting'] && counter.stab < 2 || counter.damagingMoves.length < 3) rejected = true;
					break;
				case 'seismictoss': case 'nightshade':
					if (counter.Physical + counter.Special >= 1) rejected = true;
					break;
				case 'superpower':
					if (counter.setupType === 'Physical') rejected = true;
					break;
				case 'shadowball':
					if (hasMove['feintattack'] && counter.Physical < 3) rejected = true;
					break;
				case 'feintattack':
					if (hasMove['shadowball'] && counter.Physical >= 3) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType) rejected = true;
					break;
				case 'bonemerang':
					if (hasMove['earthquake']) rejected = true;
					break;

				// Status:
				case 'leechseed':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['raindance'] || hasMove['rest']) rejected = true;
					break;
				case 'painsplit': case 'wish':
					if (hasMove['moonlight'] || hasMove['morningsun'] || hasMove['rest'] || hasMove['softboiled']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['healbell'] || hasMove['pursuit'] || hasMove['rest']) rejected = true;
					if (counter.damagingMoves.length < 2 && !hasMove['batonpass'] && !hasMove['perishsong']) rejected = true;
					break;
				case 'taunt':
					if (hasMove['hypnosis'] || hasMove['substitute']) rejected = true;
					break;
				case 'thunderwave': case 'stunspore':
					if (!!counter['speedsetup'] || hasMove['dragondance'] || hasMove['toxic'] || hasMove['willowisp'] || movePool.includes('sleeppowder') || hasMove['bodyslam'] && hasAbility['Serene Grace']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && !!counter['speedsetup']) {
					rejected = true;
				}

				// @ts-ignore
				if (counter.setupType && !isSetup && move.category !== counter.setupType && counter[counter.setupType] < 2 && !hasMove['batonpass'] && moveid !== 'rest' && moveid !== 'sleeptalk') {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					// @ts-ignore
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}

				// Pokemon should have moves that benefit their type
				if ((hasType['Bug'] && !counter['Bug'] && movePool.includes('megahorn')) ||
					(hasType['Fighting'] && !counter['Fighting']) ||
					(hasType['Fire'] && !counter['Fire'] && counter.setupType !== 'Physical') ||
					(hasType['Ground'] && !counter['Ground']) ||
					(hasType['Rock'] && !counter['Rock'] && template.baseStats.atk >= 90) ||
					(hasType['Steel'] && !counter['Steel'] && movePool.includes('meteormash')) ||
					(hasType['Water'] && !counter['Water'] && (movePool.includes('surf') || movePool.includes('hydropump')) && counter.setupType !== 'Physical' && !hasAbility['Huge Power'] && (!hasType['Ice'] || !counter['Ice'])) ||
					(movePool.includes('spore')) ||
					(movePool.includes('earthquake') && !counter['Ground'] && !counter['Fighting'] && counter.Physical > 1 && (hasType['Bug'] || hasType['Flying'] || hasType['Normal'] || hasType['Poison'] || hasType['Rock'] || hasType['Steel'])) ||
					(movePool.includes('rockslide') && !counter['Rock'] && counter.Physical > 1 && hasType['Ground']) ||
					(movePool.includes('thunderbolt') && !counter['Electric'] && counter.Special > 1 && (hasType['Ice'] || hasType['Water'])) ||
					(requiresRecovery.includes(template.species) && !recoveryMoves.some(recoveryMove => hasMove[recoveryMove]) && recoveryMoves.some(recoveryMove => movePool.includes(recoveryMove)))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && !recoveryMoves.includes(moveid) && !['sleeptalk', 'substitute'].includes(moveid)) {
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
			if (species === 'Castform' && moves.length === 4) {
				// Make sure castforms alternate formes have their required moves
				let reqMove = '';
				if (template.species === 'Castform-Sunny' && !hasMove['sunnyday']) {
					reqMove = 'sunnyday';
				} else if (template.species === 'Castform-Rainy' && !hasMove['raindance']) {
					reqMove = 'raindance';
				} else if (template.species === 'Castform-Snowy' && !hasMove['hail']) {
					reqMove = 'hail';
				}
				if (reqMove) {
					// reject a move
					for (let [i, move] of moves.entries()) {
						if (move === 'weatherball' || this.getMove(move).type in hasType) continue;
						moves[i] = reqMove;
						let reqMoveIndex = movePool.indexOf(reqMove);
						if (reqMoveIndex !== -1) this.fastPop(movePool, reqMoveIndex);
						break;
					}
				}
			}
			if (moves.length === 4 && !noAttacks.includes(template.species) && (counter['physicalpool'] || counter['specialpool'])) {
				// Move post-processing:
				if (counter.damagingMoves.length === 0) {
					// A set shouldn't have zero attacking moves
					moves.splice(this.random(moves.length), 1);
				} else if (!counter.stab && !noStab.includes(template.species) &&
					!(hasType['Bug'] && moves.indexOf('hiddenpowerbug') > -1) &&
					!(hasType['Flying'] && moves.indexOf('hiddenpowerflying') > -1) &&
					!(hasType['Grass'] && moves.indexOf('hiddenpowergrass') > -1) &&
					!(hasType['Steel'] && moves.indexOf('hiddenpowersteel') > -1)) {
					// In most cases, a set shouldn't have zero STABs
					if (counter.damagingMoves.length === 1) {
						let damagingid = counter.damagingMoves[0].id;
						if (movePool.length - availableHP || availableHP && (damagingid === 'hiddenpower' || !hasMove['hiddenpower'])) {
							if (!counter.damagingMoves[0].damage) {
								moves.splice(counter.damagingMoveIndex[damagingid], 1);
							}
						}
					} else if (!counter.damagingMoves[0].damage && !counter.damagingMoves[1].damage) {
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
			}
			if (moves.length === 4 && !hasMove['hiddenpower']) {
				// if Hidden Power is available, use it to replace a worse attack of the same type
				if (hasMove['razorleaf']) {
					moves.splice(moves.indexOf('razorleaf'), 1, 'hiddenpowergrass');
				} else if (hasMove['mudshot']) {
					moves.splice(moves.indexOf('mudshot'), 1, 'hiddenpowerground');
				} else if (hasMove['silverwind'] && !hasMove['batonpass']) {
					moves.splice(moves.indexOf('silverwind'), 1, 'hiddenpowerbug');
				} else if (hasMove['aerialace'] && !hasAbility['Hustle']) {
					moves.splice(moves.indexOf('aerialace'), 1, 'hiddenpowerflying');
				} else if (hasMove['feintattack']) {
					moves.splice(moves.indexOf('feintattack'), 1, 'hiddenpowerdark');
				} else if (hasMove['magicalleaf']) {
					moves.splice(moves.indexOf('magicalleaf'), 1, 'hiddenpowergrass');
				} else if (hasMove['shadowpunch']) {
					moves.splice(moves.indexOf('shadowpunch'), 1, 'hiddenpowerghost');
				} else if (hasMove['gigadrain'] && hasType['Grass'] && counter.stab < 2 && recoveryMoves.some(recoveryMove => hasMove[recoveryMove])) {
					moves.splice(moves.indexOf('gigadrain'), 1, 'hiddenpowergrass');
				} else if (hasMove['steelwing']) {
					moves.splice(moves.indexOf('steelwing'), 1, 'hiddenpowersteel');
				} else if (hasMove['rockslide'] && !hasMove['thunderwave'] && !(hasAbility['Serene Grace'] && hasMove['bodyslam']) && (template.baseStats.spe < 50 || hasMove['curse'])) {
					moves.splice(moves.indexOf('rockslide'), 1, 'hiddenpowerrock');
				}
			}
		} while (moves.length < 4 && movePool.length);

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}

		let abilities = Object.values(baseTemplate.abilities).filter(a => this.getAbility(a).gen === 3);
		abilities.sort((a, b) => this.getAbility(b).rating - this.getAbility(a).rating);
		let ability0 = this.getAbility(abilities[0]);
		let ability1 = this.getAbility(abilities[1]);
		if (abilities[1]) {
			if (ability0.rating <= ability1.rating && this.randomChance(1, 2)) {
				[ability0, ability1] = [ability1, ability0];
			} else if (ability0.rating - 0.6 <= ability1.rating && this.randomChance(2, 3)) {
				[ability0, ability1] = [ability1, ability0];
			}
			ability = ability0.name;

			let rejectAbility;
			do {
				rejectAbility = false;

				if (ability === 'Hustle') {
					// Counter ability (hustle)
					rejectAbility = !counter['hustle'];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = !hasMove['sunnyday'];
				} else if (ability === 'Compound Eyes') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || template.id === 'blissey';
				} else if (ability === 'Sturdy') {
					rejectAbility = true; // Strudy only blocks OHKO moves in gen3, which arent in our movepools.
				} else if (ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Synchronize') {
					rejectAbility = counter.Status < 2;
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				} else if (ability === 'Insomnia') {
					rejectAbility = hasMove['rest'];
				}

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating > 1) {
						ability = ability1.name;
					} else {
						// Default to the highest rated ability if all are rejected
						// @ts-ignore
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
			if (abilities.includes('Chlorophyll') && hasMove['sunnyday']) {
				ability = 'Chlorophyll';
			}
		} else {
			ability = ability0.name;
		}

		if (template.requiredItems) {
			item = this.sample(template.requiredItems);

		// First, the extra high-priority items
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Shedinja') {
			item = 'Lum Berry';
		} else if (template.species === 'Slaking') {
			item = 'Choice Band';
		} else if (template.species === 'Unown') {
			item = 'Twisted Spoon';
		} else if (hasMove['trick']) {
			item = 'Choice Band';
		} else if (hasMove['bellydrum']) {
			item = 'Salac Berry';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = 'Chesto Berry';

		// Medium priority
		} else if (hasMove['leechseed']) {
			item = 'Leftovers';
		} else if (hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal'] || hasMove['endure'] ||
			hasMove['substitute'] && counter.Status < 3 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 250 && this.randomChance(1, 2)) {
			if (template.baseStats.spe <= 90 && !counter['speedsetup'] && !hasMove['focuspunch']) {
				item = 'Salac Berry';
			} else if (counter.Physical > counter.Special || counter.Physical === counter.Special && this.randomChance(1, 2)) {
				item = 'Liechi Berry';
			} else {
				item = 'Petaya Berry';
			}
		} else if ((counter.Physical >= 4 || counter.Physical >= 3 && counter.Special === 1 && this.randomChance(1, 2)) && !(hasMove['bodyslam'] && hasAbility['Serene Grace']) && !hasMove['fakeout'] && !hasMove['rapidspin']) {
			item = 'Choice Band';
		} else if (hasMove['curse'] || hasMove['protect'] || hasMove['sleeptalk'] || hasMove['substitute']) {
			item = 'Leftovers';
		// This is the "REALLY can't think of a good item" cutoff
		} else {
			item = 'Leftovers';
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
		// @ts-ignore
		let level = levelScale[tier] || 75;
		// @ts-ignore
		if (customScale[template.name]) level = customScale[template.name];

		// Prepare optimal HP
		let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
		if (hasMove['substitute'] && (hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal'])) {
			// Endeavor/Flail/Reversal users should be able to use four Substitutes
			if (hp % 4 === 0) evs.hp -= 4;
		} else if (hasMove['substitute'] && (item === 'Salac Berry' || item === 'Petaya Berry' || item === 'Liechi Berry')) {
			// Other pinch berry holders should have berries activate after three Substitutes
			while (hp % 4 > 0) {
				evs.hp -= 4;
				hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			}
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = hasMove['hiddenpower'] ? ivs.atk - 28 : 0;
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

		let allowedNFE = ['Scyther', 'Vigoroth'];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (template.gen > 3 || template.isNonstandard || !template.randomBattleMoves) continue;
			if (template.evos && !allowedNFE.includes(template.species)) {
				let invalid = false;
				for (const evo of template.evos) {
					if (this.getTemplate(evo).gen <= 3) {
						invalid = true;
						break;
					}
				}
				if (invalid) continue;
			}
			pokemonPool.push(id);
		}

		/**@type {{[k: string]: number}} */
		let typeCount = {};
		/**@type {{[k: string]: number}} */
		let typeComboCount = {};
		/**@type {{[k: string]: number}} */
		let baseFormes = {};
		let uberCount = 0;
		let nuCount = 0;
		/**@type {RandomTeamsTypes.TeamDetails} */
		let teamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Limit to one Wobbuffet per battle (not just per team)
			if (template.species === 'Wobbuffet' && this.hasWobbuffet) continue;

			let tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.randomChance(4, 5)) continue;
				break;
			case 'NU':
				// NUs are limited to 2 but have a 20% chance of being added anyway.
				if (nuCount > 1 && this.randomChance(4, 5)) continue;
			}

			// Adjust rate for castform
			if (template.baseSpecies === 'Castform' && this.randomChance(3, 4)) continue;

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

			// In Gen 3, Shadow Tag users can prevent each other from switching out, possibly causing and endless battle or at least causing a long stall war
			// To prevent this, we prevent more than one Wobbuffet in a single battle.
			if (template.species === 'Wobbuffet') this.hasWobbuffet = true;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of template.types) {
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

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'NU') {
				nuCount++;
			}

			// Team has
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('spikes')) teamDetails['spikes'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
		}
		return pokemon;
	}
}

module.exports = RandomGen3Teams;
