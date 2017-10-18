'use strict';

const RandomGen4Teams = require('../../mods/gen4/random-teams');

class RandomGen3Teams extends RandomGen4Teams {
	randomSet(template, slot, teamDetails) {
		if (slot === undefined) slot = 1;
		let baseTemplate = (template = this.getTemplate(template));
		let species = template.species;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			require('../../crashlogger')(err, 'The gen 3 randbat set generator');
		}

		if (template.battleOnly) species = template.baseSpecies;

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
		let availableHP = 0;
		for (let i = 0, len = movePool.length; i < len; i++) {
			if (movePool[i].substr(0, 11) === 'hiddenpower') availableHP++;
		}

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
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['substitute']) rejected = true;
					break;
				case 'eruption': case 'waterspout':
					if (counter.Physical + counter.Special < 4) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'meanlook': case 'spiderweb':
					if (!hasMove['batonpass'] && !hasMove['perishsong']) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['meanlook']) rejected = true;
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

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'curse': case 'dragondance': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical + counter['physicalpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
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
					break;

				// Bad after setup
				case 'destinybond': case 'explosion': case 'memento': case 'selfdestruct':
					if (counter.setupType || !!counter['recovery'] || hasMove['rest']) rejected = true;
					if (moveid === 'destinybond' && (hasMove['explosion'] || hasMove['selfdestruct'])) rejected = true;
					if (moveid === 'memento' && hasMove['destinybond']) rejected = true;
					break;
				case 'protect':
					if (!hasAbility['Speed Boost'] && !hasMove['perishsong'] && !hasMove['toxic'] && !hasMove['wish']) rejected = true;
					break;
				case 'roar': case 'whirlwind':
					if (counter.setupType) rejected = true;
					break;
				case 'rapidspin':
					if (teamDetails.rapidSpin) rejected = true;
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
				case 'counter':
					if (hasMove['swordsdance']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bodyslam': case 'doubleedge':
					if (hasMove['return']) rejected = true;
					if (moveid === 'doubleedge' && hasMove['bodyslam']) rejected = true;
					break;
				case 'quickattack':
					if (hasMove['thunderwave']) rejected = true;
					break;
				case 'flamethrower': case 'fireblast': case 'overheat':
					if ((moveid === 'flamethrower' && (hasMove['fireblast'] || hasMove['overheat'])) || (moveid === 'fireblast' && (hasMove['flamethrower'] || hasMove['overheat'])) || (moveid === 'overheat' && (hasMove['fireblast'] || hasMove['flamethrower']))) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['surf']) rejected = true;
					break;
				case 'gigadrain': case 'razorleaf':
					if (moves.indexOf('hiddenpowergrass') > -1 || hasMove['solarbeam'] && hasMove['sunnyday']) rejected = true;
					if (moveid === 'gigadrain' && hasMove['razorleaf']) rejected = true;
					break;
				case 'hiddenpowergrass':
					if (hasMove['solarbeam'] && hasMove['sunnyday']) rejected = true;
					break;
				case 'solarbeam':
					if (counter.setupType === 'Physical' || !hasMove['sunnyday']) rejected = true;
					break;
				case 'brickbreak':
					if (hasMove['reversal'] || hasMove['substitute'] && hasMove['focuspunch']) rejected = true;
					break;
				case 'highjumpkick': case 'crosschop':
					if (hasMove['brickbreak']) rejected = true;
					break;
				case 'seismictoss':
					if (hasMove['nightshade'] || counter.Physical + counter.Special >= 1) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType) rejected = true;
					break;
				case 'aerialace':
					if (moves.indexOf('hiddenpowerflying') > -1) rejected = true;
					break;
				case 'hiddenpowerrock':
					if (hasMove['rockslide']) rejected = true;
					break;
				case 'bonemerang':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt']) rejected = true;
					break;
				case 'silverwind':
					if (moves.indexOf('hiddenpowerbug') > -1) rejected = true;
					break;

				// Status:
				case 'leechseed': case 'painsplit': case 'wish':
					if (hasMove['moonlight'] || hasMove['morningsun'] || hasMove['rest'] || hasMove['synthesis'] || hasMove['recover']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['pursuit'] || hasMove['rest'] || hasMove['taunt']) rejected = true;
					break;
				case 'thunderwave': case 'stunspore':
					if (hasMove['toxic'] || hasMove['willowisp'] || hasMove['sleeppowder'] || hasMove['spore']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && !!counter['speedsetup']) {
					rejected = true;
				}

				if (counter.setupType && !isSetup && move.category !== counter.setupType && counter[counter.setupType] < 2 && !hasMove['batonpass'] && moveid !== 'rest' && moveid !== 'sleeptalk') {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
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
					for (let m = 0; m < moves.length; m++) {
						if (moves[m] === 'weatherball' || this.getMove(moves[m]).type in hasType) continue;
						moves[m] = reqMove;
						let reqMoveIndex = movePool.indexOf(reqMove);
						if (reqMoveIndex !== -1) this.fastPop(movePool, reqMoveIndex);
						break;
					}
				}
			}
			if (moves.length === 4 && !counter.stab && (counter['physicalpool'] || counter['specialpool'])) {
				// Move post-processing:
				if (counter.damagingMoves.length === 0) {
					// A set shouldn't have zero attacking moves
					moves.splice(this.random(moves.length), 1);
				} else if (counter.damagingMoves.length === 1) {
					// In most cases, a set shouldn't have zero STABs
					let damagingid = counter.damagingMoves[0].id;
					if (movePool.length - availableHP || availableHP && (damagingid === 'hiddenpower' || !hasMove['hiddenpower'])) {
						let replace = false;
						if (!counter.damagingMoves[0].damage && template.species !== 'Porygon2' && template.species !== 'Unown') {
							replace = true;
						}
						if (replace) moves.splice(counter.damagingMoveIndex[damagingid], 1);
					}
				} else if (!counter.damagingMoves[0].damage && !counter.damagingMoves[1].damage && template.species !== 'Porygon2') {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					let rejectableMoves = [];
					let baseDiff = movePool.length - availableHP;
					for (let l = 0; l < counter.damagingMoves.length; l++) {
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

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}

		let abilities = Object.values(baseTemplate.abilities);
		abilities.sort((a, b) => this.getAbility(b).rating - this.getAbility(a).rating);
		let ability0 = this.getAbility(abilities[0]);
		let ability1 = this.getAbility(abilities[1]);
		ability = ability0.name;
		if (ability0.gen !== 3) ability = ability1.name;
		if (ability0.gen === 3 && ability1.gen === 3) {
			if (ability0.rating <= ability1.rating) {
				if (this.random(2)) ability = ability1.name;
			} else if (ability0.rating - 0.6 <= ability1.rating) {
				if (!this.random(3)) ability = ability1.name;
			}

			let rejectAbility = false;
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
				if (ability === ability1.name) { // or not
					ability = ability0.name;
				} else if (ability1.rating > 1) { // only switch if the alternative doesn't suck
					ability = ability1.name;
				}
			}
			if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
			if (abilities.includes('Chlorophyll') && hasMove['sunnyday']) {
				ability = 'Chlorophyll';
			}
		}

		item = 'Leftovers';
		if (template.requiredItems) {
			item = template.requiredItems[this.random(template.requiredItems.length)];

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
			hasMove['substitute'] && counter.Status < 3 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 250 && this.random(2)) {
			if (template.baseStats.spe <= 90 && !counter['speedsetup']) {
				item = 'Salac Berry';
			} else if (counter.Physical >= counter.Special) {
				item = 'Liechi Berry';
			} else {
				item = 'Petaya Berry';
			}
		} else if ((counter.Physical >= 4 || counter.Physical >= 3 && counter.Special === 1 && this.random(2)) && !hasMove['bodyslam'] && !hasMove['fakeout'] && !hasMove['rapidspin']) {
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
			BL2: 81,
			UU: 79,
			BL: 77,
			OU: 75,
			Uber: 71,
		};
		let tier = template.tier;
		let level = levelScale[tier] || 75;

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
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: !this.random(1024),
		};
	}
	randomTeam(side) {
		let pokemon = [];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (template.gen > 3 || template.isNonstandard || !template.randomBattleMoves || template.species === 'Unown' || template.species === 'Castform') continue;
			if (template.evos) {
				let invalid = false;
				for (let i = 0; i < template.evos.length; i++) {
					if (this.getTemplate(template.evos[i]).gen <= 3) {
						invalid = true;
						break;
					}
				}
				if (invalid) continue;
			}
			pokemonPool.push(id);
		}

		let typeCount = {};
		let typeComboCount = {};
		let baseFormes = {};
		let uberCount = 0;
		let nuCount = 0;
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
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'NU':
				// NUs are limited to 2 but have a 20% chance of being added anyway.
				if (nuCount > 1 && this.random(5) >= 1) continue;
			}

			// Adjust rate for castform
			if (template.baseSpecies === 'Castform' && this.random(3) >= 1) continue; // Castform normal forme dosent have random battle moves

			// Limit 2 of any type
			let types = template.types;
			let skip = false;
			for (let t = 0; t < types.length; t++) {
				if (typeCount[types[t]] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			let set = this.randomSet(template, pokemon.length, teamDetails);

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
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
			for (let t = 0; t < types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
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
