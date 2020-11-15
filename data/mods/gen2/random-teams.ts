/* eslint max-len: ["error", 240] */

import RandomGen3Teams from '../gen3/random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';

export class RandomGen2Teams extends RandomGen3Teams {
	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
	}

	randomSet(species: string | Species, teamDetails: RandomTeamsTypes.TeamDetails = {}): RandomTeamsTypes.RandomSet {
		species = this.dex.getSpecies(species);

		const movePool = (species.randomBattleMoves || Object.keys(this.dex.data.Learnsets[species.id]!.learnset!)).slice();
		const rejectedPool: string[] = [];
		const moves: string[] = [];
		let item = '';
		const ivs = {
			hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30,
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

			counter = this.queryMoves(moves, hasType, {}, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				const move = this.dex.getMove(moveId);
				const moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'curse': case 'meditate': case 'screech': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (!counter['Physical'] || counter.damagingMoves.length < 2 && !hasMove['batonpass'] && !hasMove['sleeptalk']) rejected = true;
					if (moveid === 'curse' && hasMove['icebeam'] && hasMove['sleeptalk']) rejected = true;
					isSetup = true;
					break;

				// Not very useful without their supporting moves
				case 'batonpass':
					if (!counter.setupType && !counter['speedsetup'] && !hasMove['meanlook']) rejected = true;
					break;
				case 'meanlook':
					if (movePool.includes('perishsong')) rejected = true;
					break;
				case 'nightmare':
					if (!hasMove['lovelykiss'] && !hasMove['sleeppowder']) rejected = true;
					break;
				case 'swagger':
					if (!hasMove['substitute']) rejected = true;
					break;

				// Bad after setup
				case 'charm': case 'counter':
					if (counter.setupType) rejected = true;
					break;
				case 'haze':
					if (counter.setupType || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'reflect': case 'lightscreen':
					if (counter.setupType || hasMove['rest']) rejected = true;
					break;

				// Ineffective to have both
				case 'doubleedge':
					if (hasMove['bodyslam'] || hasMove['return']) rejected = true;
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
				case 'quickattack': case 'selfdestruct':
					if (hasMove['rest'] || hasMove['sleeptalk']) rejected = true;
					break;
				case 'rapidspin':
					if (teamDetails['rapidSpin'] || hasMove['sleeptalk']) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam']) rejected = true;
					break;
				case 'surf':
					if (hasMove['hydropump']) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt']) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['razorleaf'] || hasMove['swordsdance'] && movePool.includes('sludgebomb')) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['dragonbreath']) rejected = true;
					break;
				case 'seismictoss':
					if (hasMove['rest'] || hasMove['sleeptalk']) rejected = true;
					break;
				case 'destinybond':
					if (hasMove['explosion']) rejected = true;
					break;
				case 'pursuit':
					if (hasMove['crunch'] && movePool.includes('sunnyday')) rejected = true;
					break;
				case 'thief':
					if (hasMove['rest'] || hasMove['substitute']) rejected = true;
					break;

				// Status and illegal move rejections
				case 'confuseray': case 'roar': case 'whirlwind':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'encore':
					if (hasMove['bodyslam'] || hasMove['surf'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'lovelykiss':
					if (hasMove['healbell'] || hasMove['moonlight'] || hasMove['morningsun'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'softboiled':
					if (movePool.includes('swordsdance')) rejected = true;
					break;
				case 'spikes':
					if (teamDetails['spikes'] || hasType['Ice'] && hasMove['rapidspin']) rejected = true;
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
				if (counter.setupType === 'Physical' && move.category === 'Special' && !counter.Physical) {
					rejected = true;
				}

				if ((!rejected && !isSetup && (move.category !== 'Status' || !move.flags.heal) && (counter.setupType || !move.stallingMove) && !['batonpass', 'sleeptalk', 'spikes'].includes(moveid)) &&
				(
					// Pokemon should have moves that benefit their attributes
					(!counter['stab'] && !counter['damage'] && !hasType['Ghost'] && counter['physicalpool'] + counter['specialpool'] > 0) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ground'] && !counter['Ground']) ||
					(hasType['Ice'] && !counter['Ice']) ||
					(hasType['Normal'] && !counter['Normal'] && counter.setupType === 'Physical') ||
					(hasType['Psychic'] && hasType['Grass'] && !counter['Psychic']) ||
					(hasType['Rock'] && !counter['Rock'] && species.baseStats.atk > 60) ||
					(hasType['Water'] && !counter['Water']) ||
					(movePool.includes('megahorn') || hasMove['present'] && movePool.includes('softboiled')) ||
					(hasMove['rest'] && movePool.includes('sleeptalk') || (hasMove['sleeptalk'] && movePool.includes('rest'))) ||
					(hasMove['sunnyday'] && movePool.includes('solarbeam') || (hasMove['solarbeam'] && movePool.includes('sunnyday'))) ||
					(movePool.includes('milkdrink') || movePool.includes('recover') || movePool.includes('spore'))
				)) {
					// Reject Status, non-STAB, or low basepower moves
					if (move.category === 'Status' || !hasType[move.type] || move.basePower && move.basePower < 40) {
						rejected = true;
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

		// Adjust IVs for Hidden Power
		for (const setMoveid of moves) {
			if (!setMoveid.startsWith('hiddenpower')) continue;
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
			item = this.sample(['Metal Powder', 'Quick Claw']);
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
		} else if ((hasMove['bellydrum'] || hasMove['swordsdance']) && species.baseStats.spe >= 60 && !hasType['Ground'] && !hasMove['sleeptalk'] && !hasMove['substitute'] && this.randomChance(1, 2)) {
			item = 'Miracle Berry';

		// Default to Leftovers
		} else {
			item = 'Leftovers';
		}

		const levelScale: {[k: string]: number} = {
			NU: 77,
			NUBL: 73,
			UU: 71,
			UUBL: 67,
			OU: 65,
			Uber: 61,
		};
		const customScale: {[k: string]: number} = {
			Ditto: 83, Unown: 87, Wobbuffet: 83,
		};
		let level = levelScale[species.tier] || 80;
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
}

export default RandomGen2Teams;
