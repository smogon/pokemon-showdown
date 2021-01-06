/* eslint max-len: ["error", 240] */

import RandomGen5Teams from '../gen5/random-teams';
import {toID} from '../../../sim/dex';

export class RandomGen4Teams extends RandomGen5Teams {
	randomSet(species: string | Species, teamDetails: RandomTeamsTypes.TeamDetails = {}, isLead = false): RandomTeamsTypes.RandomSet {
		species = this.dex.getSpecies(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') forme = species.battleOnly;

		if (species.cosmeticFormes) {
			forme = this.sample([species.name].concat(species.cosmeticFormes));
		}

		const movePool = (species.randomBattleMoves || Object.keys(this.dex.data.Learnsets[species.id].learnset!)).slice();
		const rejectedPool: string[] = [];
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
		let ivs = {
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
		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		const SetupException = ['suckerpunch', 'dracometeor', 'overheat'];
		const counterAbilities = ['Adaptability', 'Hustle', 'Iron Fist', 'Skill Link'];

		// Give recovery moves priority over certain other defensive status moves
		const recoveryMoves = ['healorder', 'milkdrink', 'moonlight', 'morningsun', 'painsplit', 'recover', 'rest', 'roost', 'slackoff', 'softboiled', 'synthesis', 'wish'];
		const defensiveStatusMoves = ['aromatherapy', 'haze', 'healbell', 'roar', 'whirlwind', 'willowisp', 'yawn'];

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
			if (hasType['Dark'] && hasMove['suckerpunch'] && species.types.length === 1) {
				counter['stab']++;
			}

			// Iterate through the moves again, this time to cull them:
			for (const [i, setMoveid] of moves.entries()) {
				const move = this.dex.getMove(setMoveid);
				const moveid = move.id;
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
					if (hasAbility['Hydration'] && !hasMove['rest']) rejected = true;
					if (!hasAbility['Hydration'] && counter.Physical + counter.Special < 2) rejected = true;
					break;
				case 'refresh':
					if (!(hasMove['calmmind'] && (hasMove['recover'] || hasMove['roost']))) rejected = true;
					break;
				case 'rest':
					if (movePool.includes('sleeptalk') || hasAbility['Hydration'] && !hasMove['raindance']) rejected = true;
					break;
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						const rest = movePool.indexOf('rest');
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
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1 || hasMove['sunnyday']) rejected = true;
					if (counter.Physical + counter['physicalpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'nastyplot': case 'tailglow':
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
					if (counter.setupType === 'Special') rejected = true;
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
					if (hasMove['rest'] || hasMove['softboiled']) rejected = true;
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
					if (counter.setupType || !!counter['speedsetup'] || hasMove['substitute']) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || hasMove['substitute'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType) rejected = true;
					if (hasMove['fakeout'] || hasMove['lightscreen'] || hasMove['reflect'] || hasMove['suckerpunch'] || hasMove['trickroom']) rejected = true;
					break;
				case 'toxic': case 'toxicspikes':
					if (counter.setupType || !!counter['speedsetup'] || teamDetails.toxicSpikes || hasMove['willowisp']) rejected = true;
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
				case 'endeavor':
					if (!isLead) rejected = true;
					break;
				case 'headbutt':
					if (!hasMove['bodyslam'] && !hasMove['thunderwave']) rejected = true;
					break;
				case 'judgment': case 'swift':
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
					if (hasMove['dragondance'] || (hasMove['waterfall'] && counter.Physical < 3)) rejected = true;
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
					if (hasMove['leafstorm'] && counter.Physical + counter.Special < 4) rejected = true;
					break;
				case 'grassknot': case 'leafblade': case 'seedbomb':
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
					if (counter.damagingMoves.length <= counter['Fighting']) rejected = true;
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
					if (hasMove['shadowforce'] || hasMove['suckerpunch'] && !hasType['Ghost']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['outrage']) rejected = true;
					break;
				case 'dracometeor':
					if (hasMove['calmmind'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (counter.setupType && counter.stab < 2) rejected = true;
					break;
				case 'crunch': case 'nightslash':
					if (hasMove['suckerpunch']) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || hasMove['payback']) rejected = true;
					break;
				case 'flashcannon':
					if ((hasMove['ironhead'] || movePool.includes('ironhead')) && counter.setupType !== 'Special') rejected = true;
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
					if (hasMove['pursuit'] || hasMove['rapidspin'] || hasMove['rest'] || hasMove['taunt']) rejected = true;
					break;
				case 'thunderwave':
					if (counter.setupType || hasMove['toxic'] || hasMove['trickroom'] || hasMove['bodyslam'] && hasAbility['Serene Grace']) rejected = true;
					break;
				case 'yawn':
					if (hasMove['thunderwave'] || hasMove['toxic']) rejected = true;
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
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && species.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					if (!(hasType['Ghost'] && move.type === 'Fighting' || hasType['Electric'] && move.type === 'Ice')) rejected = true;
				}

				// Reject defensive status moves if a reliable recovery move is available but not selected.
				// Toxic is only defensive if used with another status move other than Protect (Toxic + 3 attacks and Toxic + Protect are ok).
				if ((defensiveStatusMoves.includes(moveid) || moveid === 'toxic' && ((counter.Status > 1 && !hasMove['protect']) || counter.Status > 2)) &&
					!moves.some(id => recoveryMoves.includes(id)) && movePool.some(id => recoveryMoves.includes(id))) {
					rejected = true;
				}

				// Pokemon should have moves that benefit their Ability/Type/Weather, as well as moves required by its forme
				if ((hasType['Bug'] && !counter['Bug'] && (movePool.includes('bugbuzz') || movePool.includes('megahorn'))) ||
					(hasType['Dark'] && (!counter['Dark'] || (counter['Dark'] === 1 && hasMove['pursuit'])) && movePool.includes('suckerpunch') && counter.setupType !== 'Special') ||
					(hasType['Dragon'] && !counter['Dragon']) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'] || movePool.includes('closecombat') || movePool.includes('highjumpkick'))) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Flying'] && !counter['Flying'] && (counter.setupType !== 'Special' && movePool.includes('bravebird'))) ||
					(hasType['Grass'] && !counter['Grass'] && (movePool.includes('leafblade') || movePool.includes('leafstorm') || movePool.includes('seedflare') || movePool.includes('woodhammer'))) ||
					(hasType['Ground'] && !counter['Ground']) ||
					(hasType['Ice'] && !counter['Ice'] && (!hasType['Water'] || !counter['Water'])) ||
					(hasType['Rock'] && !counter['Rock'] && (movePool.includes('headsmash') || movePool.includes('stoneedge'))) ||
					(hasType['Steel'] && !counter['Steel'] && movePool.includes('meteormash')) ||
					(hasType['Water'] && !counter['Water'] && (hasMove['raindance'] || !hasType['Ice'] || !counter['Ice'])) ||
					((hasAbility['Adaptability'] && !counter.setupType && species.types.length > 1 && (!counter[species.types[0]] || !counter[species.types[1]])) ||
					(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(counter['defensesetup'] && !counter.recovery && !hasMove['rest']) ||
					(movePool.includes('spore') || (!moves.some(id => recoveryMoves.includes(id)) && (movePool.includes('softboiled') || (species.baseSpecies === 'Arceus' && movePool.includes('recover'))))) ||
					(species.requiredMove && movePool.includes(toID(species.requiredMove)))) &&
					(counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && moveid !== 'judgment' && !recoveryMoves.includes(moveid) && moveid !== 'sleeptalk') {
						if (move.category === 'Status' || !hasType[move.type] || (move.basePower && move.basePower < 40 && !move.multihit)) rejected = true;
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
					if (move.category !== 'Status' && (moveid !== 'hiddenpower' || !availableHP)) rejectedPool.push(moves[i]);
					moves.splice(i, 1);
					break;
				}
				if (rejected && rejectedPool.length) {
					moves.splice(i, 1);
					break;
				}
			}
			if (moves.length === 4 && !counter.stab && !hasMove['metalburst'] && (counter['physicalpool'] || counter['specialpool']) && species.name !== 'Shuckle' && species.name !== 'Smeargle') {
				// Move post-processing:
				if (counter.damagingMoves.length === 0) {
					// A set shouldn't have no attacking moves
					moves.splice(this.random(moves.length), 1);
				} else if (counter.damagingMoves.length === 1) {
					// In most cases, a set shouldn't have no STAB
					const damagingid = counter.damagingMoves[0].id;
					if (movePool.length - availableHP || availableHP && (damagingid === 'hiddenpower' || !hasMove['hiddenpower'])) {
						let replace = false;
						if (!counter.damagingMoves[0].damage && species.name !== 'Blissey' && species.name !== 'Porygon2') {
							replace = true;
						}
						if (replace) moves.splice(counter.damagingMoveIndex[damagingid], 1);
					}
				} else if (!counter.damagingMoves[0].damage && !counter.damagingMoves[1].damage && species.name !== 'Blissey' && species.name !== 'Clefable' && species.name !== 'Porygon2') {
					// If you have three or more attacks, and none of them are STAB, reject one of them at random.
					const rejectableMoves = [];
					const baseDiff = movePool.length - availableHP;
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
		} while (moves.length < 4 && (movePool.length || rejectedPool.length));

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}

		const abilities = Object.values(species.abilities);
		abilities.sort((a, b) => this.dex.getAbility(b).rating - this.dex.getAbility(a).rating);
		let ability0 = this.dex.getAbility(abilities[0]);
		let ability1 = this.dex.getAbility(abilities[1]);
		if (abilities[1]) {
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
					// Adaptability, Hustle, Iron Fist, Skill Link
					rejectAbility = !counter[toID(ability)];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = !hasMove['sunnyday'] && !teamDetails['sun'];
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Early Bird') {
					rejectAbility = !hasMove['rest'];
				} else if (ability === 'Gluttony') {
					rejectAbility = !hasMove['bellydrum'];
				} else if (ability === 'Mold Breaker') {
					rejectAbility = !hasMove['earthquake'];
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || species.id === 'chansey' || species.id === 'blissey';
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['cosmicpower'];
				} else if (ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Solar Power') {
					rejectAbility = !counter['Special'] || !hasMove['sunnyday'] && !teamDetails['sun'];
				} else if (ability === 'Speed Boost') {
					rejectAbility = hasMove['uturn'];
				} else if (ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Synchronize') {
					rejectAbility = counter.Status < 2;
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || hasMove['toxic'];
				} else if (ability === 'Tinted Lens') {
					rejectAbility = counter['damage'] >= counter.damagingMoves.length;
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				}

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating >= 1) {
						ability = ability1.name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Hydration') && hasMove['raindance'] && hasMove['rest']) {
				ability = 'Hydration';
			} else if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			} else if (abilities.includes('Technician') && hasMove['machpunch'] && hasType['Fighting'] && counter.stab < 2) {
				ability = 'Technician';
			}
		} else {
			ability = ability0.name;
		}

		if (species.requiredItem) {
			item = species.requiredItem;

		// First, the extra high-priority items
		} else if (species.name === 'Farfetch\u2019d') {
			item = 'Stick';
		} else if (species.name === 'Marowak') {
			item = 'Thick Club';
		} else if (species.name === 'Shedinja' || species.name === 'Smeargle') {
			item = 'Focus Sash';
		} else if (species.name === 'Unown') {
			item = 'Choice Specs';
		} else if (species.name === 'Wobbuffet') {
			item = hasMove['destinybond'] ? 'Custap Berry' : this.sample(['Leftovers', 'Sitrus Berry']);
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3)) {
				item = 'Choice Scarf';
			} else {
				item = (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		} else if (hasMove['bellydrum']) {
			item = 'Sitrus Berry';
		} else if (ability === 'Magic Guard' || ability === 'Speed Boost' && counter.Status < 2) {
			item = 'Life Orb';
		} else if (ability === 'Poison Heal' || ability === 'Toxic Boost') {
			item = 'Toxic Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = (hasMove['raindance'] && ability === 'Hydration') ? 'Damp Rock' : 'Chesto Berry';
		} else if (hasMove['raindance'] && ability === 'Swift Swim' && counter.Status < 2) {
			item = 'Life Orb';
		} else if (hasMove['sunnyday']) {
			item = (ability === 'Chlorophyll' && counter.Status < 2) ? 'Life Orb' : 'Heat Rock';
		} else if (hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if ((ability === 'Guts' || ability === 'Quick Feet') && hasMove['facade']) {
			item = 'Toxic Orb';
		} else if (ability === 'Unburden') {
			item = 'Sitrus Berry';
		} else if (species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 150) {
			item = isLead ? 'Focus Sash' : 'Life Orb';
		} else if (hasMove['endeavor']) {
			item = 'Focus Sash';

		// Medium priority
		} else if (ability === 'Slow Start' || hasMove['curse'] || hasMove['leechseed'] || hasMove['protect'] || hasMove['roar'] || hasMove['sleeptalk'] || hasMove['whirlwind'] ||
			(ability === 'Serene Grace' && (hasMove['bodyslam'] || hasMove['headbutt'] || hasMove['ironhead']))) {
			item = 'Leftovers';
		} else if (counter.Physical >= 4 && !hasMove['fakeout'] && !hasMove['rapidspin'] && !hasMove['suckerpunch']) {
			item = species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter['priority'] && !hasMove['bodyslam'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Band';
		} else if ((counter.Special >= 4 || (counter.Special >= 3 && (hasMove['batonpass'] || hasMove['uturn'] || hasMove['waterspout'] && hasMove['selfdestruct']))) && !hasMove['chargebeam']) {
			item = species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && ability !== 'Speed Boost' && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (hasMove['outrage'] && counter.setupType) {
			item = 'Lum Berry';
		} else if (hasMove['substitute']) {
			item = counter.damagingMoves.length < 2 ||
				!counter['drain'] && (counter.damagingMoves.length < 3 || species.baseStats.hp >= 60 || species.baseStats.def + species.baseStats.spd >= 180) ? 'Leftovers' : 'Life Orb';
		} else if (ability === 'Guts') {
			item = 'Toxic Orb';
		} else if (isLead && !counter['recoil'] && !moves.some(id => !!recoveryMoves.includes(id)) && species.baseStats.hp + species.baseStats.def + species.baseStats.spd < 225) {
			item = 'Focus Sash';
		} else if (counter.damagingMoves.length >= 4) {
			item = (!!counter['Normal'] || counter['Dragon'] > 1 || hasMove['chargebeam'] || hasMove['suckerpunch']) ? 'Life Orb' : 'Expert Belt';
		} else if (counter.damagingMoves.length >= 3 && !hasMove['superfang'] && !hasMove['metalburst']) {
			const totalBulk = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;
			item = (!!counter['speedsetup'] || !!counter['priority'] || hasMove['dragondance'] || hasMove['trickroom'] ||
				totalBulk < 235 || (species.baseStats.spe >= 70 && (totalBulk < 260 || (!!counter['recovery'] && totalBulk < 285)))) ? 'Life Orb' : 'Leftovers';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (this.dex.getEffectiveness('Rock', species) >= 1 || hasMove['roar']) {
			item = 'Leftovers';
		} else if (counter.Status <= 1 && !hasMove['metalburst'] && !hasMove['rapidspin'] && !hasMove['superfang']) {
			item = 'Life Orb';
		} else {
			item = 'Leftovers';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		const levelScale: {[k: string]: number} = {
			LC: 87,
			NFE: 85,
			NU: 83,
			NUBL: 81,
			UU: 79,
			UUBL: 77,
			OU: 75,
			Uber: 71,
			AG: 71,
		};
		const customScale: {[k: string]: number} = {
			Delibird: 99, Ditto: 99, 'Farfetch\u2019d': 99, Unown: 99,
		};
		const tier = species.tier;
		let level = levelScale[tier] || 75;
		if (customScale[species.name]) level = customScale[species.name];

		// Prepare optimal HP
		let hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
		if (hasMove['substitute'] && item === 'Sitrus Berry') {
			// Two Substitutes should activate Sitrus Berry
			while (hp % 4 > 0) {
				evs.hp -= 4;
				hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			}
		} else if (hasMove['bellydrum'] && item === 'Sitrus Berry') {
			// Belly Drum should activate Sitrus Berry
			if (hp % 2 > 0) evs.hp -= 4;
		} else if (hasMove['substitute'] && hasMove['reversal']) {
			// Reversal users should be able to use four Substitutes
			if (hp % 4 === 0) evs.hp -= 4;
		} else {
			// Maximize number of Stealth Rock switch-ins
			const srWeakness = this.dex.getEffectiveness('Rock', species);
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
}

export default RandomGen4Teams;
