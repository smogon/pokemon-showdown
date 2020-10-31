import RandomGen3Teams from '../gen3/random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';

export class RandomGen2Teams extends RandomGen3Teams {
	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
	}

	randomSet(species: string | Species, teamDetails: RandomTeamsTypes.TeamDetails = {}): RandomTeamsTypes.RandomSet {
		species = this.dex.getSpecies(species);
		const forme = species.name;

		const movePool = (species.randomBattleMoves || Object.keys(this.dex.data.Learnsets[species.id]!.learnset!)).slice();
		const rejectedPool: string[] = [];
		const moves: string[] = [];
		let item = '';
		const ivs = {
			hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30
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
		let hasMove: {[k: string]: boolean} = {};
		const hasAbility: {[k: string]: boolean} = {};
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
				case 'bellydrum': case 'bulkup': case 'curse': case 'dragondance': case 'meditate': case 'screech': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.damagingMoves.length < 2 && !hasMove['batonpass'] && !hasMove['sleeptalk']) rejected = true;
					if (counter.Physical < 1) rejected = true;
					isSetup = true;
					break; 
				
				
				// Not very useful without their supporting moves
				case 'batonpass':
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['meanlook']) rejected = true;
					break;
				case 'nightmare':
					if (!hasMove['lovelykiss'] && !hasMove['sleeppowder']) rejected = true;
					break;
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						const rest = movePool.indexOf('rest');
						if (rest >= 0) this.fastPop(movePool, rest);
					}
					break;
				case 'swagger':
					if (!hasMove['substitute']) rejected = true;
					break;

				// Bad after setup
				case 'charm':
					if (hasMove['curse']) rejected = true;
					break;
				case 'haze':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'reflect': case 'lightscreen':
					if (counter.setupType || hasMove['rest']) rejected = true;
					break;

				// Ineffective to have both
				case 'doubleedge':
					if (hasMove['bodyslam'] || hasMove['return']) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam']) rejected = true;
					break;
				case 'explosion':
					if (hasMove['softboiled']) rejected = true;
					break;
				case 'extremespeed':
					if (hasMove['bodyslam'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'hyperbeam':
					if (hasMove['rockslide']) rejected = true;
					break;
				case 'rapidspin':
					if (teamDetails['rapidSpin'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'selfdestruct':
					if (hasMove['rest']) rejected = true;
					break;
				case 'quickattack':
					if (hasMove['rest']) rejected = true;
					break;
				case 'surf':
					if (hasMove['hydropump']) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['razorleaf'] || movePool.includes('sludgebomb') && hasMove['swordsdance']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['dragonbreath']) rejected = true;
					break;
				case 'counter':
					if (hasMove['curse']) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt']) rejected = true;
					break;
				case 'destinybond':
					if (hasMove['explosion']) rejected = true;
					break;
				case 'thief':
					if (hasMove['rest'] || hasMove['substitute']) rejected = true;
					break;
				case 'pursuit':
					if (hasMove['crunch'] && movePool.includes('sunnyday')) rejected = true;
					break;

				// Status and illegal move rejections
				case 'confuseray':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'encore':
					if (hasMove['bodyslam'] || (hasMove['rest'] && hasMove['sleeptalk']) || hasMove['surf']) rejected = true;
					break;
				case 'lovelykiss':
					if (hasMove['healbell'] || hasMove['moonlight'] || hasMove['morningsun'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'roar': case 'whirlwind':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'softboiled':
					if (movePool.includes('swordsdance')) rejected = true;
					break;
				case 'spikes':
					if (teamDetails['spikes'] || (hasMove['rapidspin'] && hasType['Ice'])) rejected = true;
					break;
				case 'substitute':
					if (hasMove['agility'] || hasMove['rest']) rejected = true;
					break;
				case 'synthesis':
					if (hasMove['explosion']) rejected = true;
					break;
				case 'thunderwave':
					if (hasMove['thunder'] || hasMove['toxic']) rejected = true;
					break;
				}

				// This move doesn't satisfy our setup requirements:
				if (counter.setupType === 'Physical' && move.category === 'Special' && counter.Physical === 0) {
					rejected = true;
				}

				if ((!rejected && !isSetup && !move.weather && (move.category !== 'Status' || !move.flags.heal) && (counter.setupType || !move.stallingMove) && !['batonpass', 'sleeptalk'].includes(moveid)) &&
				(
					// Pokemon should have moves that benefit their attributes
					(!counter['stab'] && !counter['damage'] && !hasType['Ghost'] && counter['physicalpool'] + counter['specialpool'] > 0) ||
					(counter.setupType && counter[counter.setupType] < 2) ||
					(hasType['Bug'] && movePool.includes('megahorn')) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ground'] && !counter['Ground']) ||
					(hasType['Ice'] && !counter['Ice']) ||
					(hasType['Normal'] && !counter['Normal'] && counter.setupType === 'Physical') ||
					(hasType['Psychic'] && hasType['Grass'] && !counter['Psychic']) ||
					(hasType['Rock'] && !counter['Rock'] && species.baseStats.atk > 60) ||
					(hasType['Water'] && !counter['Water']) ||
					(movePool.includes('spore') || movePool.includes('meanlook')) ||
					(movePool.includes('milkdrink') || movePool.includes('recover') || (movePool.includes('softboiled') && hasMove['present'])) ||
					(hasMove['rest'] && movePool.includes('sleeptalk')) ||
					(hasMove['sunnyday'] && movePool.includes('solarbeam')) ||
					(hasMove['solarbeam'] && movePool.includes('sunnyday'))
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
		
		// Adjust ivs for hiddenpower
		for (const setMoveid of moves) {
			if (hasMove['hiddenpower']) continue;
			const hpType = setMoveid.substr(11, setMoveid.length);
			switch (hpType) {
			case 'dragon': ivs.def = 28; break;
			case 'ice': ivs.def = 26; break;
			case 'psychic': ivs.def = 24; break;
			case 'electric': ivs.atk = 28; break;
			case 'grass': ivs.atk = 28; ivs.def = 28; break;
			case 'water': ivs.atk = 28; ivs.def = 26; break;
			case 'fire': ivs.atk = 28; ivs.def = 24; break;
			case 'steel': ivs.atk = 26; break;
			case 'ghost': ivs.atk = 26; ivs.def = 28; break;
			case 'bug': ivs.atk = 26; ivs.def = 26; break;
			case 'rock': ivs.atk = 26; ivs.def = 24; break;
			case 'ground': ivs.atk = 24; break;
			case 'poison': ivs.atk = 24; ivs.def = 28; break;
			case 'flying': ivs.atk = 24; ivs.def = 26; break;
			case 'fighting': ivs.atk = 24; ivs.def = 24; break;
			}
			if (ivs.atk === 28 || ivs.atk === 24) ivs.hp = 14;
			if (ivs.def === 28 || ivs.def === 24) ivs.hp -= 8;
		}

		// First, the high-priority items
		if (species.name === 'Ditto') {
			item = this.randomChance(1, 2) ? 'Metal Powder' : 'Quick Claw';
		} else if (species.name === 'Farfetch\u2019d') {
			item = 'Stick';
		} else if (species.name === 'Marowak') {
			item = 'Thick Club';
		} else if (species.name === 'Pikachu') {
			item = 'Light Ball';
		} else if (species.name === 'Unown') {
			item = 'Twisted Spoon';
		} else if (hasMove['thief']) {
			item = '';

		// Medium priority

		} else if (hasMove['rest'] && !hasMove['sleeptalk']) {
			item = 'Mint Berry';
		} else if ((hasMove['bellydrum'] || hasMove['swordsdance']) && species.baseStats.spe >= 60 &&
			!hasType['Ground'] && !hasMove['sleeptalk'] && !hasMove['substitute'] && this.randomChance(1, 2)
		) {
			item = 'Miracle Berry';

		// Default to Leftovers
		} else {
			item = 'Leftovers';
		}

		const levelScale: {[k: string]: number} = { // adjust?
			LC: 90, // unused
			NFE: 84, // unused
			NU: 80,
			NUBL: 76,
			UU: 74,
			UUBL: 70,
			OU: 68,
			Uber: 64,
		};
		const customScale: {[k: string]: number} = {
			Caterpie: 99, Kakuna: 99, Magikarp: 99, Metapod: 99, Weedle: 99, // unused
			Unown: 99, Wobbuffet: 82, Ditto: 82,
			Snorlax: 66, Nidoqueen: 70,
		};
		let level = levelScale[species.tier] || 90;
		if (customScale[species.name]) level = customScale[species.name];
		
		return {
			name: species.name,
			species: species.name,
			moves: moves,
			ability: 'None',
			evs: {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255},
			ivs: ivs,
			item: item,
			level: level,
			shiny: false,
			gender: species.gender ? species.gender : 'M',
		};
	}

	randomTeam(): RandomTeamsTypes.RandomSet[] {
		const pokemon = [];

		const pokemonPool = [];
		for (const id in this.dex.data.FormatsData) {
			const species = this.dex.getSpecies(id);
			if (species.gen <= this.gen && species.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		const tierCount: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const baseFormes: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			const species = this.dex.getSpecies(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			const tier = species.tier;
			const types = species.types;
			const typeCombo = types.slice().sort().join();

			// Limit 2 Pokemon per tier
			if (tierCount[tier] >= 2 && this.randomChance(4, 5)) {
				continue;
			}

			// Limit 2 of any type
			let skip = false;
			for (const type of species.types) {
				if (typeCount[type] >= 2) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Limit 1 of any type combination
			if (typeComboCount[typeCombo] >= 1 && this.randomChance(4, 5)) continue;

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
			for (const type of species.types) {
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

			// Team has
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
			if (set.moves.includes('spikes')) teamDetails['spikes'] = 1;
			
			
		}
		return pokemon;
	}
}

export default RandomGen2Teams;
