/**
 * Random team generator for the Fakemon system.
 *
 * `sim/teams.ts#getGenerator` resolves `data/random-battles/<mod>/teams` for any
 * format whose `team` is `random`, so simply living at this path makes the
 * `[Fakemon] Random Battle` formats work - and the bot uses the same generator.
 *
 * Sets are built from a role that is derived from the species' own base stats,
 * typing and ability, so a fast special attacker gets special STAB and a bulky
 * Pokemon gets recovery and support - never six random moves.
 */

import { Dex } from '../../../sim/dex';
import { PRNG, type PRNGSeed } from '../../../sim/prng';
import type { Format } from '../../../sim/dex-formats';
import { FakemonIndex } from '../../mods/fakemon/generated/index';
import { FOOD_ITEMS } from '../../mods/fakemon/items';

/** What a Pokemon is built to do, decided from its base stats. */
type Role = 'Physical Attacker' | 'Special Attacker' | 'Mixed Attacker' |
	'Fast Pivot' | 'Physical Wall' | 'Special Wall' | 'Support';

const ROLE_SPREADS: { [role in Role]: { nature: string, evs: SparseStatsTable } } = {
	'Physical Attacker': { nature: 'Adamant', evs: { atk: 252, spe: 252, hp: 4 } },
	'Special Attacker': { nature: 'Modest', evs: { spa: 252, spe: 252, hp: 4 } },
	'Mixed Attacker': { nature: 'Naive', evs: { atk: 128, spa: 128, spe: 252 } },
	'Fast Pivot': { nature: 'Jolly', evs: { spe: 252, atk: 252, hp: 4 } },
	'Physical Wall': { nature: 'Impish', evs: { hp: 252, def: 252, spd: 4 } },
	'Special Wall': { nature: 'Calm', evs: { hp: 252, spd: 252, def: 4 } },
	'Support': { nature: 'Bold', evs: { hp: 252, def: 128, spd: 128 } },
};

/** Items that suit each role, in preference order. */
const ROLE_ITEMS: { [role in Role]: string[] } = {
	'Physical Attacker': ['braceband', 'survivorband', 'spicywrap'],
	'Special Attacker': ['focuslens', 'survivorband', 'frostcone'],
	'Mixed Attacker': ['survivorband', 'fieldprism', 'guardplate'],
	'Fast Pivot': ['swiftsash', 'nectarvial', 'survivorband'],
	'Physical Wall': ['guardplate', 'roastednut', 'jellycup'],
	'Special Wall': ['guardplate', 'roastednut', 'sugarberry'],
	'Support': ['roastednut', 'honeydrop', 'jellycup'],
};

export class RandomFakemonTeams {
	dex: ModdedDex;
	gen: number;
	format: Format;
	prng: PRNG;
	maxTeamSize: number;
	maxMoveCount: number;
	adjustLevel: number | null;
	/** Cached so a long series of battles does not rebuild the pools each time. */
	private speciesPool?: string[];

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.gen = this.dex.gen;
		this.format = format;
		this.prng = PRNG.get(prng);
		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize || 6;
		this.maxMoveCount = ruleTable.maxMoveCount || 4;
		this.adjustLevel = ruleTable.adjustLevel;
	}

	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = PRNG.get(prng);
	}

	getTeam(options: PlayerOptions | null = null): PokemonSet[] {
		if (options?.seed) this.setSeed(options.seed);
		return this.randomTeam();
	}

	random(m?: number, n?: number) {
		return this.prng.random(m, n);
	}

	sample<T>(items: readonly T[]): T {
		return this.prng.sample(items);
	}

	randomChance(numerator: number, denominator: number) {
		return this.prng.randomChance(numerator, denominator);
	}

	/** Fully evolved, non-Mega Fakemon - the ones worth building sets for. */
	getSpeciesPool(): string[] {
		if (this.speciesPool) return this.speciesPool;
		const pool: string[] = [];
		for (const name of FakemonIndex.baseSpecies) {
			const species = this.dex.species.get(name);
			if (!species.exists || species.isMega || species.battleOnly) continue;
			if (species.evos?.length) continue; // only final stages
			if (!Object.keys(this.dex.species.getLearnsetData(species.id).learnset || {}).length) {
				continue;
			}
			pool.push(species.name);
		}
		this.speciesPool = pool;
		return pool;
	}

	/** Decide what this Pokemon is for, from its own base stats. */
	getRole(species: Species): Role {
		const s = species.baseStats;
		const offense = Math.max(s.atk, s.spa);
		const defense = (s.def + s.spd) / 2 + s.hp / 2;
		if (defense > offense + 15) {
			if (s.def > s.spd + 15) return 'Physical Wall';
			if (s.spd > s.def + 15) return 'Special Wall';
			return 'Support';
		}
		if (Math.abs(s.atk - s.spa) <= 12 && offense >= 90) return 'Mixed Attacker';
		if (s.spe >= 100 && offense >= 90) {
			return s.atk >= s.spa ? 'Fast Pivot' : 'Special Attacker';
		}
		return s.atk >= s.spa ? 'Physical Attacker' : 'Special Attacker';
	}

	/**
	 * Pick four moves that actually work together: STAB of the right category
	 * first, then coverage, then whatever support the role calls for.
	 */
	buildMoveset(species: Species, role: Role, ability: string): string[] {
		const learnset = Object.keys(this.dex.species.getLearnsetData(species.id).learnset || {});
		const legal = learnset
			.map(id => this.dex.moves.get(id))
			.filter(move => move.exists && !move.isNonstandard);

		const wantsPhysical = ['Physical Attacker', 'Fast Pivot'].includes(role);
		const wantsSpecial = role === 'Special Attacker';
		const attackCategory = wantsPhysical ? 'Physical' : wantsSpecial ? 'Special' : null;

		const scoreAttack = (move: Move) => {
			let score = move.basePower;
			if (species.types.includes(move.type)) score *= 1.5; // STAB
			if (attackCategory && move.category !== attackCategory) score *= 0.35;
			if (role === 'Mixed Attacker') score *= 1;
			if (move.category === 'Physical') {
				score *= species.baseStats.atk / Math.max(1, species.baseStats.spa);
			} else {
				score *= species.baseStats.spa / Math.max(1, species.baseStats.atk);
			}
			if (typeof move.accuracy === 'number') score *= move.accuracy / 100;
			if (move.priority > 0) score *= 1.15;
			if (move.multihit) score *= 1.5; // base power is per hit
			// a little noise so every set of a species is not identical
			score *= 0.9 + 0.2 * this.random(0, 100) / 100;
			return score;
		};

		const attacks = legal.filter(m => m.category !== 'Status' &&
			(m.basePower > 0 || m.damageCallback || m.basePowerCallback));
		attacks.sort((a, b) => scoreAttack(b) - scoreAttack(a));

		const chosen: string[] = [];
		const coveredTypes = new Set<string>();
		const attacksWanted = ['Physical Wall', 'Special Wall', 'Support'].includes(role) ? 2 : 3;
		for (const move of attacks) {
			if (chosen.length >= attacksWanted) break;
			// no more than one move per type, so coverage is real coverage
			if (coveredTypes.has(move.type)) continue;
			coveredTypes.add(move.type);
			chosen.push(move.id);
		}

		// Support: recovery first, then setup, then anything else useful.
		const status = legal.filter(m => m.category === 'Status' && !chosen.includes(m.id));
		const healing = status.filter(m => m.heal || m.drain || m.flags['heal']);
		const setup = status.filter(m => m.boosts &&
			Object.values(m.boosts).some(v => (v) > 0));
		const hazards = status.filter(m => m.sideCondition || m.pseudoWeather || m.weather);
		const pickFrom = (list: Move[]) => {
			const options = list.filter(m => !chosen.includes(m.id));
			if (!options.length) return false;
			chosen.push(this.sample(options).id);
			return true;
		};

		if (['Physical Wall', 'Special Wall', 'Support'].includes(role)) {
			if (!pickFrom(healing)) pickFrom(hazards);
			if (!pickFrom(hazards)) pickFrom(setup);
		} else if (this.randomChance(1, 2)) {
			if (!pickFrom(setup)) pickFrom(healing);
		}

		// Top up with the best remaining attacks, then any legal move at all.
		for (const move of attacks) {
			if (chosen.length >= this.maxMoveCount) break;
			if (!chosen.includes(move.id)) chosen.push(move.id);
		}
		for (const move of legal) {
			if (chosen.length >= this.maxMoveCount) break;
			if (!chosen.includes(move.id)) chosen.push(move.id);
		}
		return chosen.slice(0, this.maxMoveCount);
	}

	/** Mega Stone if this species has one and the team has no Mega yet. */
	pickItem(species: Species, role: Role, teamHasMega: boolean): string {
		const mega = (FakemonIndex.megas as Record<string, { stoneId: string }>)[species.id];
		if (mega && !teamHasMega && this.randomChance(3, 4)) return mega.stoneId;

		const preferred = ROLE_ITEMS[role].filter(id => this.dex.items.get(id).exists);
		if (preferred.length && this.randomChance(4, 5)) return this.sample(preferred);
		const food = FOOD_ITEMS.filter(id => this.dex.items.get(id).exists);
		return food.length ? this.sample(food) : 'roastednut';
	}

	randomTeam(): PokemonSet[] {
		const pool = this.getSpeciesPool().slice();
		const team: PokemonSet[] = [];
		let teamHasMega = false;

		while (team.length < this.maxTeamSize && pool.length) {
			const name = this.sample(pool);
			pool.splice(pool.indexOf(name), 1); // Species Clause
			const species = this.dex.species.get(name);
			const role = this.getRole(species);

			const abilityPool = Object.values(species.abilities)
				.filter(a => a && this.dex.abilities.get(a).exists);
			const ability = abilityPool.length ? this.sample(abilityPool) : 'No Ability';

			const moves = this.buildMoveset(species, role, ability);
			if (moves.length < 1) continue;

			const item = this.pickItem(species, role, teamHasMega);
			if (this.dex.items.get(item).megaStone) teamHasMega = true;

			const spread = ROLE_SPREADS[role];
			const evs: StatsTable = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			for (const [stat, value] of Object.entries(spread.evs)) {
				evs[stat as StatID] = value;
			}
			const ivs: StatsTable = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
			// Don't take avoidable confusion damage on a purely special set.
			if (!moves.some(id => this.dex.moves.get(id).category === 'Physical')) ivs.atk = 0;

			team.push({
				name: species.name,
				species: species.name,
				gender: species.gender || '',
				item,
				ability,
				moves: moves.map(id => this.dex.moves.get(id).name),
				evs,
				ivs,
				nature: spread.nature,
				level: this.adjustLevel || 100,
				shiny: this.randomChance(1, 512),
			});
		}
		return team;
	}
}

export default RandomFakemonTeams;
