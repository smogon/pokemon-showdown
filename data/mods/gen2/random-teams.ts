import RandomGen3Teams from '../gen3/random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import type {MoveCounter, OldRandomBattleSpecies} from '../gen8/random-teams';

export class RandomGen2Teams extends RandomGen3Teams {
	randomData: {[species: string]: OldRandomBattleSpecies} = require('./random-data.json');

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.moveEnforcementCheckers = {
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fire: (movePool, moves, abilities, types, counter) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter) => !counter.get('Flying') && types.has('Ground'),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => !counter.get('Ice'),
			Normal: (movePool, moves, abilities, types, counter) => !counter.get('Normal') && counter.setupType === 'Physical',
			Psychic: (movePool, moves, abilities, types, counter) => !counter.get('Psychic') && types.has('Grass'),
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk > 60,
			Water: (movePool, moves, abilities, types, counter) => !counter.get('Water'),
		};
	}

	shouldCullMove(
		move: Move,
		types: Set<string>,
		moves: Set<string>,
		abilities = {},
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
	): {cull: boolean, isSetup?: boolean} {
		const restTalk = moves.has('rest') && moves.has('sleeptalk');

		switch (move.id) {
		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'curse': case 'meditate': case 'screech': case 'swordsdance':
			return {
				cull: (
					(counter.setupType !== 'Physical' || counter.get('physicalsetup') > 1) ||
					(!counter.get('Physical') || counter.damagingMoves.size < 2 && !moves.has('batonpass') && !moves.has('sleeptalk'))
				),
				isSetup: true,
			};

		// Not very useful without their supporting moves
		case 'batonpass':
			return {cull: !counter.setupType && !counter.get('speedsetup') && !moves.has('meanlook')};
		case 'meanlook':
			return {cull: movePool.includes('perishsong')};
		case 'nightmare':
			return {cull: !moves.has('lovelykiss') && !moves.has('sleeppowder')};
		case 'swagger':
			return {cull: !moves.has('substitute')};

		// Bad after setup
		case 'charm': case 'counter':
			return {cull: !!counter.setupType};
		case 'haze':
			return {cull: !!counter.setupType || restTalk};
		case 'reflect': case 'lightscreen':
			return {cull: !!counter.setupType || moves.has('rest')};

		// Ineffective to have both
		case 'doubleedge':
			return {cull: moves.has('bodyslam') || moves.has('return')};
		case 'explosion': case 'selfdestruct':
			return {cull: moves.has('softboiled') || restTalk};
		case 'extremespeed':
			return {cull: moves.has('bodyslam') || restTalk};
		case 'hyperbeam':
			return {cull: moves.has('rockslide')};
		case 'rapidspin':
			return {cull: !!teamDetails.rapidSpin || !!counter.setupType || moves.has('sleeptalk')};
		case 'return':
			return {cull: moves.has('bodyslam')};
		case 'surf':
			return {cull: moves.has('hydropump')};
		case 'thunder':
			return {cull: moves.has('thunderbolt')};
		case 'razorleaf':
			return {cull: moves.has('swordsdance') && movePool.includes('sludgebomb')};
		case 'icebeam':
			return {cull: moves.has('dragonbreath')};
		case 'seismictoss':
			return {cull: moves.has('rest') || moves.has('sleeptalk')};
		case 'destinybond':
			return {cull: moves.has('explosion')};
		case 'pursuit':
			return {cull: moves.has('crunch') && moves.has('solarbeam')};
		case 'thief':
			return {cull: moves.has('rest') || moves.has('substitute')};
		case 'irontail':
			return {cull: types.has('Ground') && movePool.includes('earthquake')};

		// Status and illegal move rejections
		case 'confuseray': case 'encore': case 'roar': case 'whirlwind':
			return {cull: restTalk};
		case 'lovelykiss':
			return {cull: ['healbell', 'moonlight', 'morningsun', 'sleeptalk'].some(m => moves.has(m))};
		case 'sleeptalk':
			return {cull: moves.has('curse') && counter.get('stab') >= 2};
		case 'softboiled':
			return {cull: movePool.includes('swordsdance')};
		case 'spikes':
			return {cull: !!teamDetails.spikes};
		case 'substitute':
			return {cull: moves.has('agility') || moves.has('rest')};
		case 'synthesis':
			return {cull: moves.has('explosion')};
		case 'thunderwave':
			return {cull: moves.has('thunder') || moves.has('toxic')};
		}

		return {cull: false};
	}

	getItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		species: Species,
	) {
		// First, the high-priority items
		if (species.name === 'Ditto') return 'Metal Powder';
		if (species.name === 'Farfetch\u2019d') return 'Stick';
		if (species.name === 'Marowak') return 'Thick Club';
		if (species.name === 'Pikachu') return 'Light Ball';
		if (species.name === 'Unown') return 'Twisted Spoon';
		if (moves.has('thief')) return '';

		// Medium priority
		if (moves.has('rest') && !moves.has('sleeptalk')) return 'Mint Berry';
		if (
			(moves.has('bellydrum') || moves.has('swordsdance')) &&
			species.baseStats.spe >= 60 && !types.has('Ground') &&
			!moves.has('sleeptalk') && !moves.has('substitute') &&
			this.randomChance(1, 2)
		) {
			return 'Miracle Berry';
		}

		// Default to Leftovers
		return 'Leftovers';
	}

	randomSet(species: string | Species, teamDetails: RandomTeamsTypes.TeamDetails = {}): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);

		const data = this.randomData[species.id];
		const movePool = (data.moves || Object.keys(this.dex.species.getLearnset(species.id)!)).slice();
		const rejectedPool: string[] = [];
		const moves = new Set<string>();

		let ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		const types = new Set(species.types);

		let counter;
		// We use a special variable to track Hidden Power
		// so that we can check for all Hidden Powers at once
		let hasHiddenPower = false;

		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.size < this.maxMoveCount && movePool.length) {
				const moveid = this.sampleNoReplace(movePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasHiddenPower) continue;
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}
			while (moves.size < this.maxMoveCount && rejectedPool.length) {
				const moveid = this.sampleNoReplace(rejectedPool);
				if (moveid.startsWith('hiddenpower')) {
					if (hasHiddenPower) continue;
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}

			counter = this.queryMoves(moves, species.types, new Set(), movePool);

			// Iterate through the moves again, this time to cull them:
			for (const moveid of moves) {
				const move = this.dex.moves.get(moveid);
				let {cull, isSetup} = this.shouldCullMove(move, types, moves, {}, counter, movePool, teamDetails);

				// This move doesn't satisfy our setup requirements:
				if (counter.setupType === 'Physical' && move.category === 'Special' && !counter.get('Physical')) {
					cull = true;
				}


				// Reject Status, non-STAB, or low basepower moves
				const moveIsRejectable = (
					(move.category !== 'Status' || !move.flags.heal) &&
					// These moves cannot be rejected in favor of a forced move
					!['batonpass', 'sleeptalk', 'spikes', 'sunnyday'].includes(move.id) &&
					(move.category === 'Status' || !types.has(move.type) || (move.basePower && move.basePower < 40))
				);

				if (!cull && !isSetup && moveIsRejectable && (counter.setupType || !move.stallingMove)) {
					// There may be more important moves that this Pokemon needs
					if (
						// Pokemon should usually have at least one STAB move
						(
							!counter.get('stab') &&
							!counter.get('damage') &&
							!types.has('Ghost') &&
							counter.get('physicalpool') + counter.get('specialpool') > 0
						) || (movePool.includes('megahorn') || (movePool.includes('softboiled') && moves.has('present'))) ||
						// Rest + Sleep Talk should be selected together
						((moves.has('rest') && movePool.includes('sleeptalk')) || (moves.has('sleeptalk') && movePool.includes('rest'))) ||
						// Sunny Day + Solar Beam should be selected together
						(moves.has('sunnyday') && movePool.includes('solarbeam') ||
						(moves.has('solarbeam') && movePool.includes('sunnyday'))) ||
						['milkdrink', 'recover', 'spore'].some(m => movePool.includes(m))
					) {
						cull = true;
					} else {
						// Pokemon should have moves that benefit their typing
						for (const type of types) {
							if (this.moveEnforcementCheckers[type]?.(movePool, moves, new Set(), types, counter, species, teamDetails)) cull = true;
						}
					}
				}

				// Remove rejected moves from the move list
				if (
					cull &&
					(movePool.length - availableHP || availableHP && (move.id === 'hiddenpower' || !hasHiddenPower))
				) {
					if (move.category !== 'Status' && !move.damage && (move.id !== 'hiddenpower' || !availableHP)) {
						rejectedPool.push(moveid);
					}
					moves.delete(moveid);
					if (moveid.startsWith('hiddenpower')) hasHiddenPower = false;
					break;
				}

				if (cull && rejectedPool.length) {
					moves.delete(moveid);
					if (moveid.startsWith('hiddenpower')) hasHiddenPower = false;
					break;
				}
			}
		} while (moves.size < this.maxMoveCount && (movePool.length || rejectedPool.length));

		// Adjust IVs for Hidden Power
		for (const setMoveid of moves) {
			if (!setMoveid.startsWith('hiddenpower')) continue;
			const hpType = setMoveid.substr(11, setMoveid.length);

			const hpIVs: {[k: string]: Partial<typeof ivs>} = {
				dragon: {def: 28},
				ice: {def: 26},
				psychic: {def: 24},
				electric: {atk: 28},
				grass: {atk: 28, def: 28},
				water: {atk: 28, def: 26},
				fire: {atk: 28, def: 24},
				steel: {atk: 26},
				ghost: {atk: 26, def: 28},
				bug: {atk: 26, def: 26},
				rock: {atk: 26, def: 24},
				ground: {atk: 24},
				poison: {atk: 24, def: 28},
				flying: {atk: 24, def: 26},
				fighting: {atk: 24, def: 24},
			};
			if (hpIVs[hpType]) {
				ivs = {...ivs, ...hpIVs[hpType]};
			}

			if (ivs.atk === 28 || ivs.atk === 24) ivs.hp = 14;
			if (ivs.def === 28 || ivs.def === 24) ivs.hp -= 8;
		}

		const levelScale: {[k: string]: number} = {
			NU: 73,
			NUBL: 71,
			UU: 69,
			UUBL: 67,
			OU: 65,
			Uber: 61,
		};

		const level = this.adjustLevel || data.level || levelScale[species.tier] || 80;

		return {
			name: species.name,
			species: species.name,
			moves: Array.from(moves),
			ability: 'No Ability',
			evs: {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255},
			ivs,
			item: this.getItem('None', types, moves, counter, species),
			level,
			// No shiny chance because Gen 2 shinies have bad IVs
			shiny: false,
			gender: species.gender ? species.gender : 'M',
		};
	}
}

export default RandomGen2Teams;
