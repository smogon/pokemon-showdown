/* eslint max-len: ["error", 240] */

import RandomGen6Teams from '../gen6/random-teams';
import {toID} from '../../../sim/dex';

export class RandomGen5Teams extends RandomGen6Teams {
	randomSet(species: string | Species, teamDetails: RandomTeamsTypes.TeamDetails = {}, isLead = false): RandomTeamsTypes.RandomSet {
		species = this.dex.getSpecies(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}
		if (species.cosmeticFormes) {
			forme = this.sample([species.name].concat(species.cosmeticFormes));
		}

		const movePool = (species.randomBattleMoves || Object.keys(this.dex.data.Learnsets[species.id]!.learnset!)).slice();
		const rejectedPool = [];
		const moves: string[] = [];
		let ability = '';
		let item = '';
		const evs = {
			hp: 85,
			atk: 85,
			def: 85,
			spa: 85,
			spd: 85,
			spe: 85,
		};
		let ivs: SparseStatsTable = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31,
		};
		const hasType: {[k: string]: true} = {};
		hasType[species.types[0]] = true;
		if (species.types[1]) {
			hasType[species.types[1]] = true;
		}
		const hasAbility: {[k: string]: true} = {};
		hasAbility[species.abilities[0]] = true;
		if (species.abilities[1]) {
			hasAbility[species.abilities[1]] = true;
		}
		if (species.abilities['H']) {
			hasAbility[species.abilities['H']] = true;
		}
		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		const SetupException = ['closecombat', 'dracometeor', 'extremespeed', 'suckerpunch', 'superpower'];

		const counterAbilities = ['Adaptability', 'Contrary', 'Iron Fist', 'Skill Link'];

		let hasMove: {[k: string]: boolean} = {};
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
				const moveid = this.sampleNoReplace(movePool);
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
				const moveid = this.sampleNoReplace(rejectedPool);
				hasMove[moveid] = true;
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [i, setMoveid] of moves.entries()) {
				const move = this.dex.getMove(setMoveid);
				const moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Not very useful without their supporting moves
				case 'batonpass':
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['substitute'] && !hasMove['wish'] && !hasAbility['Speed Boost']) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2 || hasMove['swordsdance']) rejected = true;
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
						const rest = movePool.indexOf('rest');
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
				case 'bulletpunch':
					if (counter['speedsetup']) rejected = true;
					break;
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) rejected = true;
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'fakeout':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'haze': case 'magiccoat': case 'pursuit': case 'selfdestruct': case 'spikes': case 'waterspout':
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
				case 'rapidspin':
					if (hasMove['shellsmash'] || counter.setupType && counter.Status >= 2) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || !!counter['priority'] || hasMove['rapidspin']) rejected = true;
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
				case 'crunch':
					if (!hasType['Dark'] && hasMove['suckerpunch']) rejected = true;
					break;
				case 'closecombat':
					if (counter.setupType && (hasMove['aurasphere'])) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['wildcharge']) rejected = true;
					break;
				case 'aurasphere': case 'highjumpkick':
					if (hasMove['closecombat'] && !counter.setupType) rejected = true;
					break;
				case 'drainpunch': case 'focusblast':
					if (hasMove['closecombat'] || hasMove['crosschop'] || hasMove['highjumpkick'] || hasMove['lowkick']) rejected = true;
					break;
				case 'blueflare': case 'flareblitz': case 'fierydance': case 'flamethrower': case 'lavaplume':
					if (hasMove['fireblast'] || hasMove['overheat'] || hasMove['vcreate']) rejected = true;
					break;
				case 'airslash': case 'bravebird': case 'pluck':
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
				case 'endeavor':
					if (!isLead) rejected = true;
					break;
				case 'facade':
					if (hasMove['suckerpunch'] && !hasType['Normal']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam'] || hasMove['doubleedge']) rejected = true;
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
				case 'scald': case 'surf':
					if (hasMove['hydropump']) rejected = true;
					break;
				case 'waterfall':
					if (hasMove['scald'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;

				// Status:
				case 'encore': case 'iceshard': case 'suckerpunch':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'healbell':
					if (hasMove['magiccoat']) rejected = true;
					break;
				case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
					if (hasMove['leechseed'] || hasMove['rest'] || hasMove['wish']) rejected = true;
					break;
				case 'substitute':
					if ((hasMove['doubleedge'] && !hasAbility['rockhead']) || hasMove['pursuit'] || hasMove['rest'] || hasMove['superpower'] || hasMove['uturn'] || hasMove['voltswitch']) rejected = true;
					break;
				case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['discharge'] || hasMove['trickroom']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['lavaplume'] || hasMove['scald'] && !hasType['Ghost']) rejected = true;
					break;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					const stabs = counter[species.types[0]] + (counter[species.types[1]] || 0);
					if (!SetupException.includes(moveid) && (!hasType[move.type] || stabs > 1 || counter[move.category] < 2)) rejected = true;
				}
				if (
					counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType &&
					counter[counter.setupType] < 2 && !hasMove['batonpass'] &&
					(move.category !== 'Status' || !move.flags.heal) && moveid !== 'sleeptalk'
				) {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && species.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				if (!rejected && (
					counter['physicalsetup'] + counter['specialsetup'] < 2 &&
					(!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3)
				) && (
					(!counter.stab && !counter['damage'] && (species.types.length > 1 || (species.types[0] !== 'Normal' && species.types[0] !== 'Psychic') || !hasMove['icebeam'] || species.baseStats.spa >= species.baseStats.spd)) ||
					(hasType['Dark'] && !counter['Dark']) ||
					(hasType['Dragon'] && !counter['Dragon']) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (species.baseStats.atk >= 110 || hasAbility['Justified'] || hasAbility['Pure Power'] || counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Flying'] && hasType['Normal'] && !counter['Flying']) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice']) ||
					(hasType['Rock'] && !counter['Rock'] && species.baseStats.atk >= 80) ||
					(hasType['Steel'] && hasAbility['Technician'] && !counter['Steel']) ||
					(hasType['Water'] && !counter['Water']) ||
					((hasAbility['Adaptability'] && !counter.setupType && species.types.length > 1 && (!counter[species.types[0]] || !counter[species.types[1]])) ||
					(hasAbility['Bad Dreams'] && movePool.includes('darkvoid')) ||
					(hasAbility['Contrary'] && !counter['contrary'] && species.name !== 'Shuckle') ||
					(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(!counter.recovery && !counter.setupType && !hasMove['healingwish'] && (
						movePool.includes('recover') || movePool.includes('roost') || movePool.includes('softboiled')
					) && (counter.Status > 1 || (species.nfe && !!counter['Status']))) ||
					(species.requiredMove && movePool.includes(toID(species.requiredMove))))
				)) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && !move.damage && (move.category !== 'Status' || !move.flags.heal) && moveid !== 'judgment' && moveid !== 'sleeptalk') {
						if (move.category === 'Status' || !hasType[move.type] || move.selfSwitch || move.basePower && move.basePower < 40 && !move.multihit) {
							rejected = true;
						}
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && rejected) {
					const sleeptalk = movePool.indexOf('sleeptalk');
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
					const HPivs = this.dex.getType(move.type).HPivs;
					let iv: StatName;
					for (iv in HPivs) {
						ivs[iv] = HPivs[iv];
					}
				}
			}
		} while (moves.length < 4 && (movePool.length || rejectedPool.length));

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}

		const abilities = Object.values(species.abilities);
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

			let rejectAbility: boolean;
			do {
				rejectAbility = false;
				if (counterAbilities.includes(ability)) {
					// Adaptability, Contrary, Iron Fist, Skill Link
					rejectAbility = !counter[toID(ability)];
				} else if (ability === 'Anger Point' || ability === 'Gluttony' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Chlorophyll') {
					rejectAbility = (!hasMove['sunnyday'] && !teamDetails['sun']);
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = (!counter['Physical'] && !hasMove['batonpass']);
				} else if (ability === 'Flash Fire') {
					rejectAbility = abilities.includes('Drought');
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = (!hasMove['raindance'] && !teamDetails['rain']);
				} else if (ability === 'Hustle') {
					rejectAbility = counter.Physical < 2;
				} else if (ability === 'Ice Body' || ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Immunity') {
					rejectAbility = abilities.includes('Toxic Boost');
				} else if (ability === 'Lightning Rod') {
					rejectAbility = species.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = species.types.includes('Electric');
				} else if (ability === 'Mold Breaker') {
					rejectAbility = abilities.includes('Adaptability');
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = (abilities.includes('Technician') && !!counter['technician']);
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Regenerator') {
					rejectAbility = abilities.includes('Magic Guard');
				} else if (ability === 'Sand Force' || ability === 'Sand Rush' || ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Serene Grace') {
					rejectAbility = (!counter['serenegrace'] || species.name === 'Blissey' || species.name === 'Togetic');
				} else if (ability === 'Sheer Force') {
					rejectAbility = (!counter['sheerforce'] || hasMove['fakeout'] || abilities.includes('Iron Fist') && counter['ironfist'] > counter['sheerforce']);
				} else if (ability === 'Simple' || ability === 'Weak Armor') {
					rejectAbility = !counter.setupType;
				} else if (ability === 'Sturdy') {
					rejectAbility = (!!counter['recoil'] && !counter['recovery']);
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Technician') {
					rejectAbility = (!counter['technician'] || abilities.includes('Skill Link') && counter['skilllink'] >= counter['technician']);
				} else if (ability === 'Tinted Lens') {
					rejectAbility = (counter['damage'] >= counter.damagingMoves.length || counter.Status > 2 && !counter.setupType);
				} else if (ability === 'Unaware') {
					rejectAbility = (abilities.includes('Magic Guard') && counter.Status < 2);
				} else if (ability === 'Unburden') {
					rejectAbility = species.baseStats.spe > 100;
				} else if (ability === 'Water Absorb') {
					rejectAbility = (abilities.includes('Drizzle') || abilities.includes('Volt Absorb'));
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

			if (abilities.includes('Guts') && ability !== 'Quick Feet' && hasMove['facade']) {
				ability = 'Guts';
			} else if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
			} else if (abilities.includes('Quick Feet') && hasMove['facade']) {
				ability = 'Quick Feet';
			} else if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
		} else {
			ability = ability0.name;
		}

		item = 'Leftovers';
		if (species.requiredItem) {
			item = species.requiredItem;

		// First, the extra high-priority items
		} else if (species.name === 'Marowak') {
			item = 'Thick Club';
		} else if (species.name === 'Deoxys-Attack') {
			item = (isLead && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (species.name === 'Farfetch\u2019d') {
			item = 'Stick';
		} else if (species.name === 'Pikachu') {
			item = 'Light Ball';
		} else if (species.name === 'Shedinja' || species.name === 'Smeargle') {
			item = 'Focus Sash';
		} else if (species.name === 'Unown') {
			item = 'Choice Specs';
		} else if (species.name === 'Wobbuffet' && hasMove['destinybond'] && this.randomChance(1, 2)) {
			item = 'Custap Berry';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (hasMove['trick'] && hasMove['gyroball']) {
			item = (ability === 'Levitate' || hasType['Flying']) ? 'Macho Brace' : 'Iron Ball';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108) {
				item = 'Choice Scarf';
			} else {
				item = (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		} else if (species.evos.length) {
			item = 'Eviolite';
		} else if (hasMove['shellsmash']) {
			item = 'White Herb';
		} else if (ability === 'Harvest' || hasMove['bellydrum']) {
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
			const eligibleTypes = [];
			for (const setMoveid of moves) {
				const move = this.dex.getMove(setMoveid);
				if (!move.basePower && !move.basePowerCallback) continue;
				eligibleTypes.push(move.type);
			}
			item = this.sample(eligibleTypes) + ' Gem';

		// Medium priority
		} else if ((hasMove['eruption'] || hasMove['waterspout']) && !counter['Status']) {
			item = 'Choice Scarf';
		} else if (ability === 'Speed Boost' && !hasMove['substitute'] && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (counter.Physical >= 4 && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['suckerpunch'] && (!hasMove['rapidspin'] || this.dex.getEffectiveness('Rock', species) < 1)) {
			item = (species.baseStats.atk >= 100 || hasAbility['Huge Power']) && species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['clearsmog'] && !hasMove['fierydance']) {
			item = species.baseStats.spa >= 100 && species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (counter.Special >= 3 && hasMove['uturn']) {
			item = 'Choice Specs';
		} else if (this.dex.getEffectiveness('Ground', species) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (hasMove['substitute'] && hasMove['reversal']) {
			const eligibleTypes = [];
			for (const setMoveid of moves) {
				const move = this.dex.getMove(setMoveid);
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
		} else if (species.name === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (species.baseStats.hp + species.baseStats.def + species.baseStats.spd > 275) {
			item = 'Leftovers';
		} else if (counter.Physical + counter.Special >= 3 && counter.setupType && ability !== 'Sturdy' && !hasMove['rapidspin']) {
			item = hasMove['outrage'] ? 'Lum Berry' : 'Life Orb';
		} else if (counter.Physical + counter.Special >= 4) {
			item = counter['Normal'] ? 'Life Orb' : 'Expert Belt';
		} else if (isLead && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 275) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (this.dex.getEffectiveness('Rock', species) >= 1 || hasMove['dragontail']) {
			item = 'Leftovers';
		} else if (counter.Status <= 1 && ability !== 'Sturdy' && !hasMove['rapidspin'] && !hasMove['uturn']) {
			item = 'Life Orb';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		const levelScale: {[tier: string]: number} = {
			Uber: 78,
			OU: 80,
			UUBL: 81,
			UU: 82,
			RUBL: 83,
			RU: 84,
			NUBL: 85,
			NU: 86,
			'(NU)': 87,
			NFE: 88,
		};
		const customScale: {[forme: string]: number} = {
			Blaziken: 79, 'Deoxys-Defense': 79, Landorus: 79, Manaphy: 79, Thundurus: 79, 'Tornadus-Therian': 79, Unown: 100,
		};
		let level = levelScale[species.tier] || 80;
		if (customScale[forme]) level = customScale[forme];

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = hasMove['hiddenpower'] ? (ivs.atk || 31) - 28 : 0;
		}

		if (hasMove['gyroball'] || hasMove['metalburst'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = hasMove['hiddenpower'] ? (ivs.spe || 31) - 28 : 0;
		}

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
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
		const seed = this.prng.seed;
		const ruleTable = this.dex.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = ruleTable.has('sametypeclause');
		const typePool = Object.keys(this.dex.data.TypeChart);
		const type = this.sample(typePool);

		const baseFormes: {[k: string]: number} = {};
		const tierCount: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		const pokemonPool = this.getPokemonPool(type, pokemon, isMonotype);

		while (pokemonPool.length && pokemon.length < 6) {
			const species = this.dex.getSpecies(this.sampleNoReplace(pokemonPool));
			if (!species.exists || !species.randomBattleMoves) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Adjust rate for species with multiple sets
			switch (species.baseSpecies) {
			case 'Arceus':
				if (this.randomChance(16, 17)) continue;
				break;
			case 'Rotom':
				if (this.gen < 5 && this.randomChance(5, 6)) continue;
				break;
			case 'Castform':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Basculin': case 'Cherrim': case 'Giratina': case 'Meloetta':
				if (this.randomChance(1, 2)) continue;
				break;
			}

			// Illusion shouldn't be in the last slot
			if (species.name === 'Zoroark' && pokemon.length > 4) continue;

			const tier = species.tier;

			// Limit two Pokemon per tier
			if (this.gen === 5 && tierCount[tier] > 1) continue;

			const set = this.randomSet(species, teamDetails, pokemon.length === 0);

			const types = species.types;

			if (!isMonotype) {
				// Limit two of any type
				let skip = false;
				for (const typeName of types) {
					if (typeCount[typeName] > 1) {
						skip = true;
						break;
					}
				}
				if (skip) continue;
			}

			// Limit one of any type combination, two in Monotype
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= (isMonotype ? 2 : 1)) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === 6) {
				// Set Zoroark's level to be the same as the last Pokemon
				const illusion = teamDetails['illusion'];
				if (illusion) pokemon[illusion - 1].level = pokemon[5].level;
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment tier counter
			if (tierCount[tier]) {
				tierCount[tier]++;
			} else {
				tierCount[tier] = 1;
			}

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
		if (pokemon.length < 6) throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);

		return pokemon;
	}
}

export default RandomGen5Teams;
