import RandomGen6Teams from '../gen6/random-teams';
import {toID} from '../../../sim/dex';

export class RandomGen5Teams extends RandomGen6Teams {
	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false
	): RandomTeamsTypes.RandomSet {
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
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['substitute'] && !hasMove['wish']) rejected = true;
					break;
				case 'endeavor':
					if (!isLead) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2 || hasMove['swordsdance']) rejected = true;
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
				case 'weatherball':
					if (!hasMove['sunnyday']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (
						counter.Physical + counter['physicalpool'] < 2 &&
						!hasMove['batonpass'] &&
						!(hasMove['rest'] && hasMove['sleeptalk'])
					) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'nastyplot': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (
						counter.Special + counter['specialpool'] < 2 &&
						!hasMove['batonpass'] &&
						!(hasMove['rest'] && hasMove['sleeptalk'])
					) rejected = true;
					isSetup = true;
					break;
				case 'growth': case 'shellsmash': case 'workup':
					if (counter.setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (counter.damagingMoves.length + counter['physicalpool'] + counter['specialpool'] < 2) rejected = true;
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
					if (hasMove['substitute'] || counter.setupType && !hasMove['rest'] && !hasMove['sleeptalk']) rejected = true;
					break;
				case 'fakeout': case 'healingwish':
					if (counter.setupType || !!counter['recovery'] || hasMove['substitute']) rejected = true;
					break;
				case 'haze': case 'magiccoat': case 'pursuit': case 'spikes':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || hasMove['trickroom']) rejected = true;
					break;
				case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang':
					if (counter.setupType || counter.damagingMoves.length > 1) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && !hasAbility['Speed Boost'] && !hasMove['wish']) rejected = true;
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
				case 'toxic':
					if (counter.setupType || counter['speedsetup'] || hasMove['trickroom']) rejected = true;
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
					if (counter.setupType || counter['speedsetup'] || ['batonpass', 'magnetrise', 'uturn'].some(m => hasMove[m])) {
						rejected = true;
					}
					break;

				// Ineffective having both
				// Attacks:
				case 'bugbite':
					if (hasMove['uturn']) rejected = true;
					break;
				case 'crunch':
					if (!hasType['Dark'] && hasMove['suckerpunch']) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['wildcharge']) rejected = true;
					break;
				case 'drainpunch': case 'focusblast':
					if (hasMove['closecombat'] || hasMove['lowkick']) rejected = true;
					break;
				case 'blueflare': case 'flareblitz': case 'fierydance': case 'flamethrower': case 'lavaplume':
					if (['fireblast', 'overheat', 'vcreate'].some(m => hasMove[m])) rejected = true;
					break;
				case 'bravebird': case 'pluck':
					if (hasMove['acrobatics'] || hasMove['hurricane']) rejected = true;
					break;
				case 'gigadrain':
					if ((!counter.setupType && hasMove['leafstorm']) || hasMove['petaldance'] || hasMove['powerwhip']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain']) rejected = true;
					break;
				case 'leafstorm':
					if (counter.setupType && hasMove['gigadrain']) rejected = true;
					break;
				case 'bonemerang': case 'earthpower':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'extremespeed': case 'headsmash':
					if (hasMove['roost']) rejected = true;
					break;
				case 'facade':
					if (hasMove['suckerpunch'] && !hasType['Normal']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'return':
					if (hasMove['doubleedge']) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'psychic':
					if (hasMove['psyshock']) rejected = true;
					break;
				case 'scald': case 'surf':
					if (hasMove['hydropump'] || hasMove['waterfall']) rejected = true;
					break;
				case 'waterspout':
					if (counter.Status) rejected = true;
					break;

				// Status:
				case 'encore': case 'icepunch': case 'raindance': case 'suckerpunch':
					if (hasMove['thunderwave'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'glare': case 'headbutt':
					if (hasMove['bodyslam']) rejected = true;
					break;
				case 'healbell':
					if (hasMove['magiccoat']) rejected = true;
					break;
				case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
					if (['leechseed', 'rest', 'wish'].some(m => hasMove[m])) rejected = true;
					break;
				case 'substitute':
					if (['pursuit', 'rest', 'superpower', 'uturn', 'voltswitch'].some(m => hasMove[m])) rejected = true;
					if (hasMove['doubleedge'] && !hasAbility['rockhead']) rejected = true;
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
				if (
					(move.category === 'Physical' && counter.setupType === 'Special') ||
					(move.category === 'Special' && counter.setupType === 'Physical')
				) {
					// Reject STABs last in case the setup type changes later on
					const stabs = counter[species.types[0]] + (counter[species.types[1]] || 0);
					if (!hasType[move.type] || stabs > 1 || counter[move.category] < 2) rejected = true;
				}
				if (
					counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType &&
					counter[counter.setupType] < 2 && !hasMove['batonpass'] &&
					(move.category !== 'Status' || !move.flags.heal) && moveid !== 'sleeptalk'
				) {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					if (
						move.category !== 'Status' ||
						counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2
					) rejected = true;
				}
				if (
					counter.setupType === 'Special' &&
					moveid === 'hiddenpower' &&
					species.types.length > 1 &&
					counter['Special'] <= 2 &&
					!hasType[move.type] &&
					!counter['Physical'] &&
					counter['specialpool']
				) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				if (
					!rejected &&
					!['judgment', 'quiverdance', 'sleeptalk'].includes(moveid) &&
					(counter['physicalsetup'] + counter['specialsetup'] < 2 && (
						!counter.setupType ||
						counter.setupType === 'Mixed' ||
						(move.category !== counter.setupType && move.category !== 'Status') ||
						counter[counter.setupType] + counter.Status > 3
					)) && (
						(
							!counter.stab &&
							!counter['damage'] &&
							(
								species.types.length > 1 ||
								(species.types[0] !== 'Normal' && species.types[0] !== 'Psychic') ||
								!hasMove['icebeam'] ||
								species.baseStats.spa >= species.baseStats.spd
							)
						) || (hasType['Dark'] && !counter['Dark']) ||
						(hasType['Dragon'] && !counter['Dragon']) ||
						(hasType['Electric'] && (!counter['Electric'] || movePool.includes('thunder'))) || (
							hasType['Fighting'] &&
							!counter['Fighting'] &&
							(species.baseStats.atk >= 90 || hasAbility['Pure Power'] || counter.setupType || !counter['Status'])
						) || (hasType['Fire'] && !counter['Fire']) ||
						(hasType['Flying'] && !counter['Flying'] && (hasType['Normal'] || hasAbility['Serene Grace'])) ||
						(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost']) ||
						(hasType['Grass'] && (movePool.includes('hornleech') || movePool.includes('seedflare'))) ||
						(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
						(hasType['Ice'] && !counter['Ice']) ||
						(hasType['Rock'] && !counter['Rock'] && species.baseStats.atk >= 80) ||
						(hasType['Steel'] && hasAbility['Technician'] && !counter['Steel']) ||
						(hasType['Water'] && (!counter['Water'] || (hasAbility['Adaptability'] && movePool.includes('waterfall')))) ||
						(hasAbility['Contrary'] && !counter['contrary'] && forme !== 'Shuckle') ||
						(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
						(hasAbility['Slow Start'] && movePool.includes('substitute')) || (
							!counter.recovery &&
							!counter.setupType &&
							!hasMove['healingwish'] &&
							(counter.Status > 1 || (species.nfe && !!counter['Status'])) &&
							(movePool.includes('recover') || movePool.includes('roost') || movePool.includes('softboiled'))
						) || (
							movePool.includes('darkvoid') ||
							movePool.includes('quiverdance') ||
							(species.requiredMove && movePool.includes(toID(species.requiredMove)))
						) || (
							isLead &&
							movePool.includes('stealthrock') &&
							counter.Status &&
							!counter.setupType &&
							!counter['speedsetup'] &&
							!hasMove['substitute']
						)
					)
				) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && !move.damage && (move.category !== 'Status' || !move.flags.heal)) {
						if (
							move.category === 'Status' ||
							!hasType[move.type] ||
							move.basePower && move.basePower < 40 && !move.multihit
						) rejected = true;
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
				if (
					rejected &&
					(movePool.length - availableHP || availableHP && (moveid === 'hiddenpower' || !hasMove['hiddenpower']))
				) {
					if (
						move.category !== 'Status' && !move.damage && !move.flags.charge &&
						(moveid !== 'hiddenpower' || !availableHP)
					) rejectedPool.push(moves[i]);
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
				if (['Anger Point', 'Gluttony', 'Keen Eye', 'Moody', 'Sand Veil', 'Snow Cloak', 'Steadfast'].includes(ability)) {
					rejectAbility = true;
				} else if (['Analytic', 'Download', 'Hyper Cutter'].includes(ability)) {
					rejectAbility = species.nfe;
				} else if (ability === 'Chlorophyll' || ability === 'Solar Power') {
					rejectAbility = (!hasMove['sunnyday'] && !teamDetails['sun']);
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (['Contrary', 'Iron Fist', 'Skill Link'].includes(ability)) {
					rejectAbility = !counter[toID(ability)];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = (!counter['Physical'] && !hasMove['batonpass']);
				} else if (ability === 'Flash Fire') {
					rejectAbility = hasAbility['Drought'];
				} else if (['Hydration', 'Rain Dish', 'Swift Swim'].includes(ability)) {
					rejectAbility = (!hasMove['raindance'] && !teamDetails['rain']);
				} else if (ability === 'Hustle') {
					rejectAbility = counter.Physical < 2;
				} else if (ability === 'Ice Body') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Immunity') {
					rejectAbility = hasAbility['Toxic Boost'];
				} else if (ability === 'Intimidate') {
					rejectAbility = hasMove['rest'];
				} else if (ability === 'Lightning Rod') {
					rejectAbility = species.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = species.types.includes('Electric');
				} else if (ability === 'Mold Breaker') {
					rejectAbility = (hasAbility['Adaptability'] || hasMove['rest'] && hasMove['sleeptalk']);
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = (hasAbility['Technician'] && !!counter['technician']);
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Pressure' || ability === 'Synchronize') {
					rejectAbility = (counter.Status < 2 || hasAbility['Trace']);
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = (!counter['recoil'] || hasAbility['Sap Sipper']);
				} else if (ability === 'Regenerator') {
					rejectAbility = hasAbility['Magic Guard'];
				} else if (ability === 'Sand Force' || ability === 'Sand Rush') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Serene Grace') {
					rejectAbility = (!counter['serenegrace'] || forme === 'Blissey');
				} else if (ability === 'Sheer Force') {
					rejectAbility = (!counter['sheerforce'] || hasAbility['Guts']);
				} else if (ability === 'Sturdy') {
					rejectAbility = (!!counter['recoil'] && !counter['recovery']);
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Technician') {
					rejectAbility = (!counter['technician'] || hasMove['tailslap']);
				} else if (ability === 'Tinted Lens') {
					rejectAbility = (hasAbility['Insomnia'] || hasAbility['Magic Guard'] || hasMove['protect']);
				} else if (ability === 'Unaware') {
					rejectAbility = (counter.setupType || hasAbility['Magic Guard']);
				} else if (ability === 'Unburden') {
					rejectAbility = species.baseStats.spe > 100;
				} else if (ability === 'Water Absorb') {
					rejectAbility = (hasAbility['Drizzle'] || hasAbility['Unaware'] || hasAbility['Volt Absorb']);
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

			if (abilities.includes('Guts') && hasMove['facade'] && (ability !== 'Quick Feet' || !counter.setupType)) {
				ability = 'Guts';
			} else if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
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
		} else if (forme === 'Marowak') {
			item = 'Thick Club';
		} else if (forme === 'Farfetch\u2019d') {
			item = 'Stick';
		} else if (forme === 'Pikachu') {
			item = 'Light Ball';
		} else if (forme === 'Shedinja' || forme === 'Smeargle') {
			item = 'Focus Sash';
		} else if (species.name === 'Unown') {
			item = 'Choice Specs';
		} else if (forme === 'Wobbuffet' && hasMove['destinybond'] && this.randomChance(1, 2)) {
			item = 'Custap Berry';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter['priority']) {
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
		} else if (
			ability === 'Poison Heal' ||
			ability === 'Toxic Boost' ||
			(ability === 'Quick Feet' && hasMove['facade']) ||
			hasMove['psychoshift']
		) {
			item = 'Toxic Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = 'Chesto Berry';
		} else if (ability === 'Guts' && hasMove['facade']) {
			item = (hasType['Fire'] || hasMove['uturn'] || hasMove['voltswitch']) ? 'Toxic Orb' : 'Flame Orb';
		} else if (hasMove['raindance']) {
			item = (ability === 'Forecast') ? 'Damp Rock' : 'Life Orb';
		} else if (hasMove['sunnyday']) {
			item = (ability === 'Forecast' || ability === 'Flower Gift') ? 'Heat Rock' : 'Life Orb';
		} else if (hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (hasMove['acrobatics']) {
			item = 'Flying Gem';
		} else if (ability === 'Unburden') {
			item = hasMove['fakeout'] ? 'Normal Gem' : species.types[0] + ' Gem';

		// Medium priority
		} else if (ability === 'Speed Boost' && !hasMove['substitute'] && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (
			counter.Physical >= 4 &&
			['dragontail', 'fakeout', 'flamecharge'].every(m => !hasMove[m]) &&
			!hasMove['suckerpunch'] &&
			(!hasMove['rapidspin'] || this.dex.getEffectiveness('Rock', species) < 1)
		) {
			item = (
				(species.baseStats.atk >= 100 || hasAbility['Huge Power']) &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!counter['priority'] &&
				this.randomChance(2, 3)
			) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 || (counter.Special >= 3 && hasMove['uturn'])) {
			item = (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!hasMove['uturn'] &&
				(ability === 'Download' || hasMove['eruption'] || hasMove['waterspout'] || this.randomChance(2, 3))
			) ? 'Choice Scarf' : 'Choice Specs';
		} else if (counter.setupType && hasMove['outrage']) {
			item = 'Lum Berry';
		} else if (this.dex.getEffectiveness('Ground', species) >= 2 && ability !== 'Levitate') {
			item = 'Air Balloon';
		} else if (
			hasType['Poison'] ||
			['bodyslam', 'dragontail', 'protect', 'scald', 'sleeptalk', 'substitute'].some(m => hasMove[m])
		) {
			item = 'Leftovers';
		} else if (forme === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 4) {
			item = (forme === 'Deoxys-Attack' || counter['Normal'] || !!counter['priority']) ? 'Life Orb' : 'Expert Belt';
		} else if (
			isLead &&
			counter['hazards'] &&
			!counter['recovery'] &&
			ability !== 'Regenerator' &&
			species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 275
		) {
			item = ability === 'Sturdy' ? 'Custap Berry' : 'Focus Sash';
		} else if (
			counter.damagingMoves.length >= 3 &&
			species.baseStats.spe >= 40 &&
			ability !== 'Sturdy' &&
			!hasMove['rapidspin'] && !hasMove['uturn']
		) {
			item = 'Life Orb';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		const levelScale: {[tier: string]: number} = {
			Uber: 76,
			OU: 80,
			'(OU)': 82,
			UUBL: 82,
			UU: 82,
			RUBL: 84,
			RU: 84,
			NUBL: 86,
			NU: 86,
			'(NU)': 88,
		};
		const customScale: {[forme: string]: number} = {
			Delibird: 100, 'Farfetch\u2019d': 100, Luvdisc: 100, Unown: 100,
		};
		let level = levelScale[species.tier] || (species.nfe ? 90 : 80);
		if (customScale[species.name]) level = customScale[species.name];

		// Prepare optimal HP
		const srWeakness = this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(
				Math.floor(
					2 * species.baseStats.hp + (ivs.hp || 31) + Math.floor(evs.hp / 4) + 100
				) * level / 100 + 10
			);
			if (hasMove['bellydrum'] && item === 'Sitrus Berry') {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = hasMove['hiddenpower'] ? (ivs.atk || 31) - 28 : 0;
		}

		if (['gyroball', 'metalburst', 'trickroom'].some(m => hasMove[m])) {
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
				if (this.randomChance(16, 17) && !isMonotype) continue;
				break;
			case 'Rotom':
				if (this.gen < 5 && this.randomChance(5, 6) && !isMonotype) continue;
				break;
			case 'Basculin': case 'Castform': case 'Cherrim': case 'Meloetta':
				if (this.randomChance(1, 2)) continue;
				break;
			}

			// Illusion shouldn't be in the last slot
			if (species.name === 'Zoroark' && pokemon.length > 4) continue;

			const tier = species.tier;

			// Limit two Pokemon per tier
			if (this.gen === 5 && !isMonotype && tierCount[tier] > 1) continue;

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
