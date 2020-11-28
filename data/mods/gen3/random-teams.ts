/* eslint max-len: ["error", 240] */

import RandomGen4Teams from '../gen4/random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';

export class RandomGen3Teams extends RandomGen4Teams {
	hasWobbuffet: boolean;

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.hasWobbuffet = false;
	}

	randomSet(species: string | Species, teamDetails: RandomTeamsTypes.TeamDetails = {}): RandomTeamsTypes.RandomSet {
		species = this.dex.getSpecies(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') forme = species.battleOnly;

		const movePool = (species.randomBattleMoves || Object.keys(this.dex.data.Learnsets[species.id]!.learnset!)).slice();
		const rejectedPool = [];
		const moves: string[] = [];
		let ability = '';
		let item = '';
		const evs = {
			hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85,
		};
		let ivs = {
			hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31,
		};
		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

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
		let hasMove: {[k: string]: boolean} = {};
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
				const moveid = this.sampleNoReplace(movePool);
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
				const moveid = this.sampleNoReplace(rejectedPool);
				hasMove[moveid] = true;
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				const move = this.dex.getMove(moveId);
				const moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Set up once and only if we have the moves for it
				case 'bulkup': case 'curse': case 'dragondance': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical + counter['physicalpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind':
					if (counter.setupType !== 'Special') rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && !hasMove['batonpass'] && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'agility':
					if (counter.damagingMoves.length < 2 && !hasMove['batonpass']) rejected = true;
					if (hasMove['substitute'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;

				// Not very useful without their supporting moves
				case 'amnesia': case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						const rest = movePool.indexOf('rest');
						if (rest >= 0) this.fastPop(movePool, rest);
					}
					break;
				case 'barrier':
					if (!hasMove['calmmind'] && !hasMove['batonpass'] && !hasMove['mirrorcoat']) rejected = true;
					break;
				case 'batonpass':
					if (!counter.setupType && !counter['speedsetup']) rejected = true;
					if (!hasMove['meanlook'] && !hasMove['spiderweb'] && !hasMove['substitute'] && !hasMove['wish']) rejected = true;
					break;
				case 'endeavor': case 'flail': case 'reversal':
					if (!hasMove['endure'] && !hasMove['substitute']) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'endure':
					if (movePool.includes('destinybond')) rejected = true;
					break;
				case 'extremespeed': case 'raindance': case 'sunnyday':
					if (counter.damagingMoves.length < 2 || hasMove['rest']) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] && (counter.Physical < 4 || hasMove['fakeout'])) rejected = true;
					if (counter.damagingMoves.length < 2 || hasMove['rest'] || counter.setupType && !hasMove['spore']) rejected = true;
					break;
				case 'moonlight':
					if (hasMove['wish'] || hasMove['protect']) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['meanlook'] && !hasMove['spiderweb']) rejected = true;
					break;
				case 'protect':
					if (!hasAbility['Speed Boost'] && !hasMove['perishsong'] && !hasMove['toxic'] && !hasMove['wish']) rejected = true;
					break;
				case 'refresh':
					if (!counter.setupType) rejected = true;
					break;
				case 'rest':
					if (movePool.includes('sleeptalk')) rejected = true;
					if (!hasMove['sleeptalk'] && (!!counter['recovery'] || movePool.includes('curse'))) rejected = true;
					break;
				case 'solarbeam':
					if (!hasMove['sunnyday']) rejected = true;
					if (movePool.length > 1) {
						const sunnyday = movePool.indexOf('sunnyday');
						if (sunnyday >= 0) this.fastPop(movePool, sunnyday);
					}
					break;

				// Bad after setup
				case 'aromatherapy': case 'healbell':
					if (hasMove['rest'] || teamDetails['statusCure']) rejected = true;
					break;
				case 'confuseray':
					if (counter.setupType || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'counter': case 'mirrorcoat':
					if (counter.setupType || hasMove['rest'] || hasMove['substitute'] || hasMove['toxic']) rejected = true;
					break;
				case 'destinybond':
					if (counter.setupType || hasMove['explosion'] || hasMove['selfdestruct']) rejected = true;
					break;
				case 'doubleedge': case 'facade': case 'fakeout': case 'waterspout':
					if (counter.Status >= 1 || moveid === 'doubleedge' && hasMove['return']) rejected = true;
					break;
				case 'encore': case 'painsplit': case 'recover': case 'yawn':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'explosion': case 'machpunch': case 'selfdestruct':
					if (hasMove['rest'] || hasMove['substitute'] || !!counter['recovery']) rejected = true;
					break;
				case 'haze':
					if (counter.setupType || hasMove['raindance'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'icywind': case 'pursuit': case 'superpower': case 'transform':
					if (counter.setupType || hasMove['rest']) rejected = true;
					break;
				case 'leechseed':
					if (counter.setupType || hasMove['explosion']) rejected = true;
					break;
				case 'stunspore':
					if (hasMove['sunnyday'] || hasMove['toxic']) rejected = true;
					break;
				case 'lightscreen':
					if (counter.setupType || !!counter['speedsetup']) rejected = true;
					break;
				case 'meanlook': case 'spiderweb':
					if (!!counter['speedsetup'] || !hasMove['batonpass'] && !hasMove['perishsong']) rejected = true;
					break;
				case 'morningsun':
					if (counter['speedsetup'] >= 1) rejected = true;
					break;
				case 'quickattack':
					if (!!counter['speedsetup'] || hasMove['substitute'] || !hasType['Normal'] && !!counter.Status) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || hasMove['rest'] || teamDetails.rapidSpin) rejected = true;
					break;
				case 'reflect':
					if (counter.setupType || !!counter['speedsetup']) rejected = true;
					break;
				case 'seismictoss':
					if (counter.setupType || hasMove['thunderbolt']) rejected = true;
					break;
				case 'spikes':
					if (counter.setupType || hasMove['substitute'] || (hasMove['rest'] && hasMove['sleeptalk']) || teamDetails.spikes) rejected = true;
					break;
				case 'substitute':
					if (hasMove['rest'] || hasMove['dragondance'] && !hasMove['bellydrum']) rejected = true;
					if (!hasMove['batonpass'] && movePool.includes('calmmind')) rejected = true;
					break;
				case 'thunderwave':
					if (counter.setupType || hasMove['bodyslam'] || hasMove['substitute'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'toxic':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['endure'] || hasMove['raindance'] || hasMove['substitute']) rejected = true;
					if (hasMove['hypnosis'] || hasMove['yawn']) rejected = true;
					break;
				case 'trick':
					if (counter.Status > 1) rejected = true;
					break;
				case 'willowisp':
					if (counter.setupType || hasMove['hypnosis'] || hasMove['toxic']) rejected = true;
					break;

				// Bit redundant to have both
				case 'bodyslam':
					if (hasMove['return'] && !!counter.Status) rejected = true;
					break;
				case 'headbutt':
					if (hasMove['bodyslam'] && !hasMove['thunderwave']) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam'] && !counter.Status) rejected = true;
					if (hasMove['endure'] || hasMove['substitute'] && hasMove['flail']) rejected = true;
					break;
				case 'fireblast':
					if (hasMove['flamethrower'] && !!counter.Status) rejected = true;
					break;
				case 'flamethrower':
					if (hasMove['fireblast'] && !counter.Status) rejected = true;
					break;
				case 'overheat':
					if (hasMove['flamethrower'] || hasMove['substitute']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['surf'] && !!counter.Status) rejected = true;
					break;
				case 'surf':
					if (hasMove['hydropump'] && !counter.Status) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['morningsun'] || hasMove['toxic']) rejected = true;
					break;
				case 'hiddenpower':
					if (move.type === 'Grass' && hasMove['sunnyday'] && hasMove['solarbeam']) rejected = true;
					if (!hasType[move.type] && (hasMove['substitute'] || hasMove['toxic'] || hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'brickbreak': case 'crosschop': case 'highjumpkick': case 'skyuppercut':
					if (hasMove['substitute'] && (hasMove['focuspunch'] || movePool.includes('focuspunch'))) rejected = true;
					if ((hasMove['endure'] || hasMove['substitute']) && hasMove['reversal']) rejected = true;
					break;
				case 'earthquake':
					if (hasMove['bonemerang']) rejected = true;
					break;
				}

				// This move doesn't satisfy our setup requirements:
				if (counter.setupType === 'Physical' && move.category === 'Special' && !hasType[move.type] && move.type !== 'Fire') {
					rejected = true;
				}
				if (counter.setupType === 'Special' && move.category === 'Physical' && moveid !== 'superpower') {
					rejected = true;
				}

				if ((!rejected && !isSetup && !move.weather && (move.category !== 'Status' || !move.flags.heal) && (counter.setupType || !move.stallingMove) && !['batonpass', 'sleeptalk', 'substitute'].includes(moveid)) &&
				(
					// Pokemon should have moves that benefit their attributes
					(!counter['stab'] && !counter['damage'] && !counter['Ice'] && !counter.setupType && counter['physicalpool'] + counter['specialpool'] > 0) ||
					(counter.setupType && counter[counter.setupType] < 2) ||
					(hasType['Bug'] && (movePool.includes('megahorn') || (!species.types[1] && movePool.includes('hiddenpowerbug')))) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fighting'] && !counter['Fighting']) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ground'] && !counter['Ground']) ||
					(hasType['Normal'] && !counter['Normal'] && counter.setupType === 'Physical') ||
					(hasType['Psychic'] && (movePool.includes('psychic') || movePool.includes('psychoboost')) && species.baseStats.spa >= 100) ||
					(hasType['Rock'] && !counter['Rock'] && species.baseStats.atk >= 100) ||
					(hasType['Water'] && !counter['Water'] && counter.setupType !== 'Physical' && species.baseStats.spa >= 60) ||
					(movePool.includes('meteormash') || movePool.includes('spore')) ||
					(hasMove['protect'] && movePool.includes('wish')) ||
					(hasMove['substitute'] && movePool.includes('morningsun')) ||
					(hasMove['sunnyday'] && movePool.includes('solarbeam'))
				)) {
					// Reject Status, non-STAB, or low basepower moves
					if (move.category === 'Status' || !hasType[move.type] || (move.basePower && move.basePower < 40 && !move.multihit)) {
						rejected = true;
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
					if (move.category !== 'Status' && !move.damage && (moveid !== 'hiddenpower' || !availableHP)) {
						rejectedPool.push(moves[k]);
					}
					moves.splice(k, 1);
					break;
				}
				if (rejected && rejectedPool.length) {
					moves.splice(k, 1);
					break;
				}
			}
		} while (moves.length < 4 && (movePool.length || rejectedPool.length));

		// If Hidden Power has been removed, reset the IVs
		if (!hasMove['hiddenpower']) {
			ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		}

		const abilities = Object.values(species.abilities).filter(a => this.dex.getAbility(a).gen === 3);
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

				if (ability === 'Chlorophyll') {
					rejectAbility = (!hasMove['sunnyday'] && !teamDetails['sun']);
				} else if (ability === 'Compound Eyes') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Hustle') {
					rejectAbility = (counter.Physical < 2);
				} else if (ability === 'Lightning Rod') {
					rejectAbility = species.types.includes('Ground');
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Serene Grace') {
					rejectAbility = (species.id === 'blissey');
				} else if (ability === 'Sturdy') {
					rejectAbility = true;
				} else if (ability === 'Swift Swim') {
					rejectAbility = (!hasMove['raindance'] && !teamDetails['rain']);
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				} else if (ability === 'Water Absorb') {
					rejectAbility = abilities.includes('Swift Swim');
				}

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating > 1) {
						ability = ability1.name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);
		} else {
			ability = ability0.name;
		}

		// First, the high-priority items
		if (species.name === 'Ditto') {
			item = this.sample(['Metal Powder', 'Quick Claw']);
		} else if (species.name === 'Farfetch\u2019d') {
			item = 'Stick';
		} else if (species.name === 'Marowak') {
			item = 'Thick Club';
		} else if (species.name === 'Pikachu') {
			item = 'Light Ball';
		} else if (species.name === 'Shedinja') {
			item = 'Lum Berry';
		} else if (species.name === 'Unown') {
			item = 'Twisted Spoon';
		} else if (hasMove['trick']) {
			item = 'Choice Band';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && !['Early Bird', 'Natural Cure', 'Shed Skin'].includes(ability)) {
			item = 'Chesto Berry';

		// Medium priority
		} else if ((hasMove['bellydrum'] && counter.Physical - counter['priority'] > 1) || (hasMove['swordsdance'] && counter.Status < 2)) {
			item = 'Salac Berry';
		} else if (hasMove['endure'] || (hasMove['substitute'] && (hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']))) {
			item = (species.baseStats.spe <= 100 && ability !== 'Speed Boost' && !counter['speedsetup'] && !hasMove['focuspunch']) ? 'Salac Berry' : 'Liechi Berry';
		} else if (hasMove['substitute'] && counter.Physical >= 3 && species.baseStats.spe >= 120) {
			item = 'Liechi Berry';
		} else if ((hasMove['substitute'] || hasMove['raindance']) && counter.Special >= 3) {
			item = 'Petaya Berry';
		} else if (counter.Physical >= 4) {
			item = 'Choice Band';
		} else if (counter.Physical >= 3 && (hasMove['firepunch'] || hasMove['icebeam'] || hasMove['overheat'] || moves.filter(m => this.dex.data.Moves[m].category === 'Special' && hasType[this.dex.data.Moves[m].type]).length)) {
			item = 'Choice Band';

		// Default to Leftovers
		} else {
			item = 'Leftovers';
		}

		const levelScale: {[k: string]: number} = {
			Uber: 76,
			OU: 80,
			UUBL: 82,
			UU: 84,
			NUBL: 86,
			NU: 88,
			NFE: 90,
		};
		const customScale: {[k: string]: number} = {
			Ditto: 99, Unown: 99,
		};
		const tier = species.tier;
		let level = levelScale[tier] || (species.nfe ? 90 : 80);
		if (customScale[species.name]) level = customScale[species.name];

		// Prepare optimal HP
		let hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
		if (hasMove['substitute'] && (hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal'])) {
			// Endeavor/Flail/Reversal users should be able to use four Substitutes
			if (hp % 4 === 0) evs.hp -= 4;
		} else if (hasMove['substitute'] && (item === 'Salac Berry' || item === 'Petaya Berry' || item === 'Liechi Berry')) {
			// Other pinch berry holders should have berries activate after three Substitutes
			while (hp % 4 > 0) {
				evs.hp -= 4;
				hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			}
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = hasMove['hiddenpower'] ? ivs.atk - 28 : 0;
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

			// Limit to one Wobbuffet per battle (not just per team)
			if (species.name === 'Wobbuffet' && this.hasWobbuffet) continue;

			const tier = species.tier;
			const types = species.types;
			const typeCombo = types.slice().sort().join();

			if (!isMonotype) {
				// Limit two Pokemon per tier
				if (tierCount[tier] >= 2) continue;

				// Limit two of any type
				let skip = false;
				for (const typeName of types) {
					if (typeCount[typeName] > 1) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit one of any type combination
				if (typeComboCount[typeCombo] >= 1) continue;
			}

			const set = this.randomSet(species, teamDetails);

			// Okay, the set passes, add it to our team
			pokemon.push(set);

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

			// Team has
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('spikes')) teamDetails['spikes'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
			if (set.moves.includes('aromatherapy') || set.moves.includes('healbell')) teamDetails['statusCure'] = 1;

			// In Gen 3, Shadow Tag users can prevent each other from switching out, possibly causing and endless battle or at least causing a long stall war
			// To prevent this, we prevent more than one Wobbuffet in a single battle.
			if (set.ability === 'Shadow Tag') this.hasWobbuffet = true;
		}
		if (pokemon.length < 6 && !isMonotype) throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);

		return pokemon;
	}
}

export default RandomGen3Teams;
