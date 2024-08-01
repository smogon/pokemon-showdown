import type {PRNG} from '../../../sim';
import {MoveCounter, RandomGen8Teams, OldRandomBattleSpecies} from '../gen8/teams';

export class RandomLetsGoTeams extends RandomGen8Teams {
	randomData: {[species: string]: OldRandomBattleSpecies} = require('./data.json');

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.moveEnforcementCheckers = {
			Dark: (movePool, moves, abilities, types, counter) => !counter.get('Dark'),
			Dragon: (movePool, moves, abilities, types, counter) => !counter.get('Dragon'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fighting: (movePool, moves, abilities, types, counter) => (
				!counter.get('Fighting') && (!!counter.setupType || !counter.get('Status'))
			),
			Fire: (movePool, moves, abilities, types, counter) => !counter.get('Fire'),
			Ghost: (movePool, moves, abilities, types, counter) => !types.has('Dark') && !counter.get('Ghost'),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => !counter.get('Ice'),
			Water: (movePool, moves, abilities, types, counter) => !counter.get('Water') || !counter.get('stab'),
		};
	}
	shouldCullMove(
		move: Move,
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
	): {cull: boolean, isSetup?: boolean} {
		switch (move.id) {
		// Set up once and only if we have the moves for it
		case 'bulkup': case 'swordsdance':
			return {
				cull: (
					counter.setupType !== 'Physical' ||
					counter.get('physicalsetup') > 1 ||
					counter.get('Physical') + counter.get('physicalpool') < 2
				),
				isSetup: true,
			};
		case 'calmmind': case 'nastyplot': case 'quiverdance':
			return {
				cull: (
					counter.setupType !== 'Special' ||
					counter.get('specialsetup') > 1 ||
					counter.get('Special') + counter.get('specialpool') < 2
				),
				isSetup: true,
			};
		case 'growth': case 'shellsmash':
			return {
				cull: (
					counter.setupType !== 'Mixed' ||
					(counter.damagingMoves.size + counter.get('physicalpool') + counter.get('specialpool')) < 2
				),
				isSetup: true,
			};
		case 'agility':
			return {
				cull: counter.damagingMoves.size < 2 && !counter.setupType,
				isSetup: !counter.setupType,
			};

		// Bad after setup
		case 'dragontail':
			return {cull: (
				!!counter.setupType || !!counter.get('speedsetup') || ['encore', 'roar', 'whirlwind'].some(m => moves.has(m))
			)};
		case 'fakeout': case 'uturn': case 'teleport':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('substitute')};
		case 'haze': case 'leechseed': case 'roar': case 'whirlwind':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('dragontail')};
		case 'protect':
			return {cull: !!counter.setupType || ['rest', 'lightscreen', 'reflect'].some(m => moves.has(m))};
		case 'seismictoss':
			return {cull: counter.damagingMoves.size > 1 || !!counter.setupType};
		case 'stealthrock':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || !!teamDetails.stealthRock};

		// Bit redundant to have both
		case 'leechlife': case 'substitute':
			return {cull: moves.has('uturn')};
		case 'dragonpulse':
			return {cull: moves.has('dragontail') || moves.has('outrage')};
		case 'thunderbolt':
			return {cull: moves.has('thunder')};
		case 'flareblitz': case 'flamethrower':
			return {cull: moves.has('fireblast') || moves.has('firepunch')};
		case 'megadrain':
			return {cull: moves.has('petaldance') || moves.has('powerwhip')};
		case 'bonemerang':
			return {cull: moves.has('earthquake')};
		case 'icebeam':
			return {cull: moves.has('blizzard')};
		case 'rockslide':
			return {cull: moves.has('stoneedge')};
		case 'hydropump': case 'willowisp':
			return {cull: moves.has('scald')};
		case 'surf':
			return {cull: moves.has('hydropump') || moves.has('scald')};
		}

		// Increased/decreased priority moves are unneeded with moves that boost only speed
		if (move.priority !== 0 && !!counter.get('speedsetup')) return {cull: true};

		// This move doesn't satisfy our setup requirements:
		if (
			(move.category === 'Physical' && counter.setupType === 'Special') ||
			(move.category === 'Special' && counter.setupType === 'Physical')
		) {
			// Reject STABs last in case the setup type changes later on
			if (!types.has(move.type) || counter.get('stab') > 1 || counter.get(move.category) < 2) return {cull: true};
		}

		return {cull: false};
	}
	randomSet(species: string | Species, teamDetails: RandomTeamsTypes.TeamDetails = {}): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}

		const data = this.randomData[species.id];

		const movePool: string[] = [...(data.moves || this.dex.species.getMovePool(species.id))];
		const types = new Set(species.types);

		const moves = new Set<string>();
		let counter;

		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.size < this.maxMoveCount && movePool.length) {
				const moveid = this.sampleNoReplace(movePool);
				moves.add(moveid);
			}

			counter = this.queryMoves(moves, species.types, [], movePool);

			// Iterate through the moves again, this time to cull them:
			for (const moveid of moves) {
				const move = this.dex.moves.get(moveid);

				let {cull, isSetup} = this.shouldCullMove(move, types, moves, [], counter, movePool, teamDetails);

				if (
					!isSetup &&
					counter.setupType && counter.setupType !== 'Mixed' &&
					move.category !== counter.setupType &&
					counter.get(counter.setupType) < 2 && (
						// Mono-attacking with setup and RestTalk is allowed
						// Reject Status moves only if there is nothing else to reject
						move.category !== 'Status' || (
							counter.get(counter.setupType) + counter.get('Status') > 3 &&
							counter.get('physicalsetup') + counter.get('specialsetup') < 2
						)
					)
				) {
					cull = true;
				}

				const moveIsRejectable = !move.damage && (move.category !== 'Status' || !move.flags.heal) && (
					move.category === 'Status' ||
					!types.has(move.type) ||
					move.selfSwitch ||
					move.basePower && move.basePower < 40 && !move.multihit
				);

				// Pokemon should have moves that benefit their Type, as well as moves required by its forme
				if (moveIsRejectable && !cull && !isSetup && counter.get('physicalsetup') + counter.get('specialsetup') < 2 && (
					!counter.setupType || counter.setupType === 'Mixed' ||
					(move.category !== counter.setupType && move.category !== 'Status') ||
					counter.get(counter.setupType) + counter.get('Status') > 3
				)) {
					if (
						(counter.damagingMoves.size === 0 || !counter.get('stab')) &&
						(counter.get('physicalpool') || counter.get('specialpool'))
					) {
						cull = true;
					} else {
						for (const type of types) {
							if (this.moveEnforcementCheckers[type]?.(movePool, moves, [], types, counter, species, teamDetails)) cull = true;
						}
					}
				}

				// Remove rejected moves from the move list
				if (cull && movePool.length) {
					moves.delete(moveid);
					break;
				}
			}
		} while (moves.size < this.maxMoveCount && movePool.length);

		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		// Minimize confusion damage
		if (!counter.get('Physical') && !moves.has('transform')) ivs.atk = 0;

		const requiredItem = species.requiredItem || (species.requiredItems ? this.sample(species.requiredItems) : null);
		return {
			name: species.baseSpecies,
			species: forme,
			level: this.adjustLevel || 100,
			gender: species.gender,
			happiness: 70,
			shiny: this.randomChance(1, 1024),
			item: (requiredItem || ''),
			ability: 'No Ability',
			evs: {hp: 20, atk: 20, def: 20, spa: 20, spd: 20, spe: 20},
			moves: Array.from(moves),
			ivs,
		};
	}

	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		const pokemonPool: string[] = [];
		for (const id in this.dex.data.FormatsData) {
			const species = this.dex.species.get(id);
			if (
				species.num < 1 ||
				(species.num > 151 && ![808, 809].includes(species.num)) ||
				species.gen > 7 ||
				species.nfe ||
				!this.randomData[species.id]?.moves ||
				(this.forceMonotype && !species.types.includes(this.forceMonotype))
			) {
				continue;
			}
			pokemonPool.push(id);
		}

		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const baseFormes: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		while (pokemonPool.length && pokemon.length < this.maxTeamSize) {
			const species = this.dex.species.get(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			const types = species.types;

			// Once we have 2 Pokémon of a given type we reject more Pokémon of that type 80% of the time
			let skip = false;
			for (const type of species.types) {
				if (typeCount[type] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Limit 1 of any type combination
			const typeCombo = types.slice().sort().join();
			if (!this.forceMonotype && typeComboCount[typeCombo] >= 1) continue;

			// Okay, the set passes, add it to our team
			const set = this.randomSet(species, teamDetails);
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
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

			// Team details
			if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;
		}
		return pokemon;
	}
}

export default RandomLetsGoTeams;
