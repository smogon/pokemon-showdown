import RandomGen2Teams from '../gen2/teams';
import {Utils} from '../../../lib';

interface HackmonsCupEntry {
	types: string[];
	baseStats: StatsTable;
}

interface Gen1RandomBattleSpecies {
	level?: number;
	moves?: ID[];
	essentialMoves?: ID[];
	exclusiveMoves?: ID[];
	comboMoves?: ID[];
}

export class RandomGen1Teams extends RandomGen2Teams {
	randomData: {[species: IDEntry]: Gen1RandomBattleSpecies} = require('./data.json');

	// Challenge Cup or CC teams are basically fully random teams.
	randomCCTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const team = [];

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype);

		for (const pokemon of randomN) {
			const species = this.dex.species.get(pokemon);

			// Level balance: calculate directly from stats rather than using some silly lookup table.
			const mbstmin = 1307;
			const stats = species.baseStats;

			// Modified base stat total assumes 15 DVs, 255 EVs in every stat
			let mbst = (stats["hp"] * 2 + 30 + 63 + 100) + 10;
			mbst += (stats["atk"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["def"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spa"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spd"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spe"] * 2 + 30 + 63 + 100) + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

				while (level < 100) {
					mbst = Math.floor((stats["hp"] * 2 + 30 + 63 + 100) * level / 100 + 10);
					// Since damage is roughly proportional to lvl
					mbst += Math.floor(((stats["atk"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["def"] * 2 + 30 + 63 + 100) * level / 100 + 5);
					mbst += Math.floor(((stats["spa"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["spd"] * 2 + 30 + 63 + 100) * level / 100 + 5);
					mbst += Math.floor((stats["spe"] * 2 + 30 + 63 + 100) * level / 100 + 5);

					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random DVs.
			const ivs = {
				hp: 0,
				atk: this.random(16),
				def: this.random(16),
				spa: this.random(16),
				spd: 0,
				spe: this.random(16),
			};
			ivs["hp"] = (ivs["atk"] % 2) * 16 + (ivs["def"] % 2) * 8 + (ivs["spe"] % 2) * 4 + (ivs["spa"] % 2) * 2;
			ivs["atk"] *= 2;
			ivs["def"] *= 2;
			ivs["spa"] *= 2;
			ivs["spd"] = ivs["spa"];
			ivs["spe"] *= 2;

			// Maxed EVs.
			const evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255};

			// Four random unique moves from movepool. don't worry about "attacking" or "viable".
			// Since Gens 1 and 2 learnsets are shared, we need to weed out Gen 2 moves.
			const pool = [...this.dex.species.getMovePool(species.id)];

			team.push({
				name: species.baseSpecies,
				species: species.name,
				moves: this.multipleSamplesNoReplace(pool, 4),
				gender: false,
				ability: 'No Ability',
				evs: evs,
				ivs: ivs,
				item: '',
				level,
				happiness: 0,
				shiny: false,
				nature: 'Serious',
			});
		}

		return team;
	}

	// Random team generation for Gen 1 Random Battles.
	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		// Get what we need ready.
		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		/** Pokémon that are not wholly incompatible with the team, but still pretty bad */
		const rejectedButNotInvalidPool: string[] = [];

		// Now let's store what we are getting.
		const typeCount: {[k: string]: number} = {};
		const weaknessCount: {[k: string]: number} = {Electric: 0, Psychic: 0, Water: 0, Ice: 0, Ground: 0, Fire: 0};
		let numMaxLevelPokemon = 0;

		const pokemonPool = Object.keys(this.getPokemonPool(type, pokemon, isMonotype, Object.keys(this.randomData))[0]);
		while (pokemonPool.length && pokemon.length < this.maxTeamSize) {
			const species = this.dex.species.get(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			// Only one Ditto is allowed per battle in Generation 1,
			// as it can cause an endless battle if two Dittos are forced
			// to face each other.
			if (species.id === 'ditto' && this.battleHasDitto) continue;

			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			let skip = false;

			if (!isMonotype && !this.forceMonotype) {
				// Limit two of any type
				for (const typeName of species.types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}

				if (skip) {
					rejectedButNotInvalidPool.push(species.id);
					continue;
				}
			}

			// We need a weakness count of spammable attacks to avoid being swept by those.
			// Spammable attacks are: Thunderbolt, Psychic, Surf, Blizzard, Earthquake, Fire Blast.
			const pokemonWeaknesses = [];
			for (const typeName in weaknessCount) {
				const increaseCount = this.dex.getImmunity(typeName, species) && this.dex.getEffectiveness(typeName, species) > 0;
				if (!increaseCount) continue;
				if (weaknessCount[typeName] >= 2 * limitFactor) {
					skip = true;
					break;
				}
				pokemonWeaknesses.push(typeName);
			}

			if (skip) {
				rejectedButNotInvalidPool.push(species.id);
				continue;
			}

			// Limit one level 100 Pokemon
			if (!this.adjustLevel && (this.getLevel(species) === 100) && numMaxLevelPokemon >= limitFactor) {
				rejectedButNotInvalidPool.push(species.id);
				continue;
			}

			// The set passes the limitations.
			pokemon.push(this.randomSet(species));

			// Now let's increase the counters.
			// Type counter.
			for (const typeName of species.types) {
				if (typeCount[typeName]) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}

			// Weakness counter.
			for (const weakness of pokemonWeaknesses) {
				weaknessCount[weakness]++;
			}

			// Increment level 100 counter
			if (this.getLevel(species) === 100) numMaxLevelPokemon++;

			// Ditto check
			if (species.id === 'ditto') this.battleHasDitto = true;
		}

		// if we don't have enough Pokémon, go back to rejects, which are already known to not be invalid.
		while (pokemon.length < this.maxTeamSize && rejectedButNotInvalidPool.length) {
			const species = this.sampleNoReplace(rejectedButNotInvalidPool);
			pokemon.push(this.randomSet(species));
		}

		if (pokemon.length < this.maxTeamSize && pokemon.length < 12 && !isMonotype) {
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}

	/**
	 * Random set generation for Gen 1 Random Battles.
	 */
	randomSet(species: string | Species): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		if (!species.exists) species = this.dex.species.get('pikachu'); // Because Gen 1.

		const data = this.randomData[species.id];
		const movePool = data.moves?.slice() || [];
		const moves = new Set<string>();

		// Either add all moves or add none
		if (data.comboMoves && data.comboMoves.length <= this.maxMoveCount && this.randomChance(1, 2)) {
			for (const m of data.comboMoves) moves.add(m);
		}

		// Add one of the semi-mandatory moves
		// Often, these are used so that the Pokemon only gets one of the less useful moves
		// This is added before the essential moves so that combos containing three moves can roll an exclusive move
		if (moves.size < this.maxMoveCount && data.exclusiveMoves) {
			moves.add(this.sample(data.exclusiveMoves));
		}

		// Add the mandatory moves.
		if (moves.size < this.maxMoveCount && data.essentialMoves) {
			for (const moveid of data.essentialMoves) {
				moves.add(moveid);
				if (moves.size === this.maxMoveCount) break;
			}
		}

		while (moves.size < this.maxMoveCount && movePool.length) {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.size < this.maxMoveCount && movePool.length) {
				const moveid = this.sampleNoReplace(movePool);
				moves.add(moveid);
			}
		}

		const level = this.getLevel(species);

		const evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255};
		const ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};

		// Should be able to use Substitute four times from full HP without fainting
		if (moves.has('substitute')) {
			while (evs.hp > 3) {
				const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
				if (hp % 4 !== 0) break;
				evs.hp -= 4;
			}
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			return move.category !== 'Physical';
		});
		if (noAttackStatMoves && !moves.has('mimic') && !moves.has('transform')) {
			evs.atk = 0;
			// We don't want to lower the HP DV/IV
			ivs.atk = 2;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);

		return {
			name: species.name,
			species: species.name,
			moves: shuffledMoves,
			ability: 'No Ability',
			evs,
			ivs,
			item: '',
			level,
			shiny: false,
			gender: false,
		};
	}

	randomHCTeam(): PokemonSet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const team = [];

		const movePool = [...this.dex.moves.all()];
		const typesPool = ['Bird', ...this.dex.types.names()];

		const randomN = this.randomNPokemon(this.maxTeamSize);
		const hackmonsCup: {[k: string]: HackmonsCupEntry} = {};

		for (const forme of randomN) {
			// Choose forme
			const species = this.dex.species.get(forme);
			if (!hackmonsCup[species.id]) {
				hackmonsCup[species.id] = {
					types: [this.sample(typesPool), this.sample(typesPool)],
					baseStats: {
						hp: Utils.clampIntRange(this.random(256), 1),
						atk: Utils.clampIntRange(this.random(256), 1),
						def: Utils.clampIntRange(this.random(256), 1),
						spa: Utils.clampIntRange(this.random(256), 1),
						spd: 0,
						spe: Utils.clampIntRange(this.random(256), 1),
					},
				};
				if (this.forceMonotype && !hackmonsCup[species.id].types.includes(this.forceMonotype)) {
					hackmonsCup[species.id].types[1] = this.forceMonotype;
				}
				hackmonsCup[species.id].baseStats.spd = hackmonsCup[species.id].baseStats.spa;
			}
			if (hackmonsCup[species.id].types[0] === hackmonsCup[species.id].types[1]) {
				hackmonsCup[species.id].types.splice(1, 1);
			}

			// Random unique moves
			const moves = [];
			do {
				const move = this.sampleNoReplace(movePool);
				if (move.gen <= this.gen && !move.isNonstandard && !move.name.startsWith('Hidden Power ')) {
					moves.push(move.id);
				}
			} while (moves.length < this.maxMoveCount);

			// Random EVs
			const evs = {
				hp: this.random(256),
				atk: this.random(256),
				def: this.random(256),
				spa: this.random(256),
				spd: 0,
				spe: this.random(256),
			};
			evs['spd'] = evs['spa'];

			// Random DVs
			const ivs: StatsTable = {
				hp: 0,
				atk: this.random(16),
				def: this.random(16),
				spa: this.random(16),
				spd: 0,
				spe: this.random(16),
			};
			ivs["hp"] = (ivs["atk"] % 2) * 16 + (ivs["def"] % 2) * 8 + (ivs["spe"] % 2) * 4 + (ivs["spa"] % 2) * 2;
			for (const iv in ivs) {
				if (iv === 'hp' || iv === 'spd') continue;
				ivs[iv as keyof StatsTable] *= 2;
			}
			ivs['spd'] = ivs['spa'];

			// Level balance
			const mbstmin = 425;
			const baseStats = hackmonsCup[species.id].baseStats;
			const calcStat = (statName: StatID, lvl?: number) => {
				if (lvl) {
					return Math.floor(Math.floor(2 * baseStats[statName] + ivs[statName] + Math.floor(evs[statName] / 4)) * lvl / 100 + 5);
				}
				return Math.floor(2 * baseStats[statName] + ivs[statName] + Math.floor(evs[statName] / 4)) + 5;
			};
			let mbst = 0;
			for (const statName of Object.keys(baseStats)) {
				mbst += calcStat(statName as StatID);
				if (statName === 'hp') mbst += 5;
			}
			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst);
				while (level < 100) {
					for (const statName of Object.keys(baseStats)) {
						mbst += calcStat(statName as StatID, level);
						if (statName === 'hp') mbst += 5;
					}
					if (mbst >= mbstmin) break;
					level++;
				}
				if (level > 100) level = 100;
			}

			team.push({
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				item: '',
				ability: 'No Ability',
				moves,
				evs,
				ivs,
				nature: '',
				level,
				shiny: false,
				// Hacky but the only way to communicate stats/level generation properly
				hc: hackmonsCup[species.id],
			});
		}

		return team;
	}
}

export default RandomGen1Teams;
