/**
 * Fakemon bot.
 *
 * A self-contained battle AI: it is fed the same information a human player
 * gets (the request JSON plus the public battle log) and returns a choice
 * string. `server/chat-plugins/fakemon.ts` drives it for bot battles, and
 * `test/sim/fakemon.js` drives it headlessly.
 *
 * It is deliberately a heuristic AI rather than a search: it estimates the
 * damage of every legal move, notices KOs, respects type immunities, uses
 * Protect and switches when outmatched, picks targets in doubles, prefers
 * spread moves when they hit two Pokemon, and Mega Evolves when that helps.
 */

import { Dex } from '../../../sim/dex';
import { PRNG, type PRNGSeed } from '../../../sim/prng';

export type BotDifficulty = 'easy' | 'normal' | 'hard';

/** Targets a player may pick explicitly; mirrors `CHOOSABLE_TARGETS` in the sim. */
const CHOOSABLE_TARGETS = new Set(['normal', 'any', 'adjacentAlly', 'adjacentAllyOrSelf', 'adjacentFoe']);

/** How much noise is added to every score, and how often the bot plans ahead. */
const DIFFICULTY: { [d in BotDifficulty]: { noise: number, switching: boolean, mega: boolean } } = {
	easy: { noise: 0.6, switching: false, mega: false },
	normal: { noise: 0.25, switching: true, mega: true },
	hard: { noise: 0.05, switching: true, mega: true },
};

interface FoeInfo {
	species: string;
	hpPercent: number;
	status: string;
	fainted: boolean;
}

export class FakemonBot {
	readonly name: string;
	readonly difficulty: BotDifficulty;
	private readonly dex: ModdedDex;
	private readonly prng: PRNG;
	/** What the bot has seen of the opponent, keyed by position ("p2a"). */
	private readonly foes = new Map<string, FoeInfo>();
	private mySide: SideID = 'p2';
	private megaUsed = false;
	private lastMoveWasProtect = false;

	constructor(options: {
		name?: string, difficulty?: BotDifficulty, seed?: PRNG | PRNGSeed | null, mod?: string,
	} = {}) {
		this.name = options.name || 'Fakemon Bot';
		this.difficulty = options.difficulty || 'normal';
		this.dex = Dex.mod(options.mod || 'fakemon');
		this.prng = PRNG.get(options.seed ?? null);
	}

	/** Feed the bot one line of the public battle log. */
	observe(line: string) {
		if (!line.startsWith('|')) return;
		const parts = line.slice(1).split('|');
		const [cmd] = parts;
		switch (cmd) {
		case 'player': {
			// |player|p1|Name|avatar|rating
			break;
		}
		case 'switch': case 'drag': case 'replace': case 'detailschange': {
			// |switch|p2a: Nickname|Species, L100, F|100/100
			const position = parts[1]?.split(':')[0];
			if (!position) return;
			const species = parts[2]?.split(',')[0]?.trim() || '';
			if (position.startsWith(this.mySide)) return;
			this.foes.set(position, {
				species, hpPercent: 100, status: '', fainted: false,
			});
			break;
		}
		case '-damage': case '-heal': case '-sethp': {
			const position = parts[1]?.split(':')[0];
			const foe = position && this.foes.get(position);
			if (!foe) return;
			const condition = parts[2] || '';
			if (condition.includes('fnt')) {
				foe.fainted = true;
				foe.hpPercent = 0;
			} else {
				const [hp] = condition.split(' ');
				const [cur, max] = hp.split('/').map(Number);
				if (!isNaN(cur) && !isNaN(max) && max) foe.hpPercent = cur * 100 / max;
			}
			break;
		}
		case '-status': {
			const position = parts[1]?.split(':')[0];
			const foe = position && this.foes.get(position);
			if (foe) foe.status = parts[2] || '';
			break;
		}
		case 'faint': {
			const position = parts[1]?.split(':')[0];
			const foe = position && this.foes.get(position);
			if (foe) {
				foe.fainted = true;
				foe.hpPercent = 0;
			}
			break;
		}
		}
	}

	setSide(side: SideID) {
		this.mySide = side;
	}

	/** Turn a request into a choice string. Never throws: falls back to `default`. */
	decide(request: AnyObject): string {
		try {
			if (request.wait) return '';
			if (request.teamPreview) return this.chooseTeamPreview(request);
			if (request.forceSwitch) return this.chooseForceSwitch(request);
			if (request.active) return this.chooseMoves(request);
		} catch {
			// A bot that crashes would freeze the battle; a legal default never does.
		}
		return 'default';
	}

	// =====================================================================
	// Team preview and switching
	// =====================================================================

	private chooseTeamPreview(request: AnyObject): string {
		const count = request.maxChosenTeamSize || request.side.pokemon.length;
		const order = request.side.pokemon
			.map((set: AnyObject, i: number) => ({ i: i + 1, score: this.leadScore(set) }))
			.sort((a: AnyObject, b: AnyObject) => b.score - a.score)
			.map((entry: AnyObject) => entry.i);
		return `team ${order.slice(0, count).join('')}`;
	}

	/** A good lead is fast and hits hard. */
	private leadScore(set: AnyObject): number {
		const species = this.dex.species.get(set.details?.split(',')[0] || set.speciesForme);
		if (!species.exists) return 0;
		const stats = species.baseStats;
		return stats.spe + Math.max(stats.atk, stats.spa) + this.noise() * 40;
	}

	private chooseForceSwitch(request: AnyObject): string {
		const pokemon: AnyObject[] = request.side.pokemon;
		const chosen: number[] = [];
		const choices = request.forceSwitch.map((mustSwitch: boolean, i: number) => {
			if (!mustSwitch) return 'pass';
			const options: { slot: number, score: number }[] = [];
			for (let j = 0; j < pokemon.length; j++) {
				if (j < request.forceSwitch.length) continue; // already active
				if (pokemon[j].condition.endsWith(' fnt')) continue;
				if (chosen.includes(j + 1)) continue;
				options.push({ slot: j + 1, score: this.switchInScore(pokemon[j]) });
			}
			if (!options.length) return 'pass';
			options.sort((a, b) => b.score - a.score);
			chosen.push(options[0].slot);
			return `switch ${options[0].slot}`;
		});
		return choices.join(', ');
	}

	/** Prefer a healthy Pokemon that resists what the opponent is showing. */
	private switchInScore(set: AnyObject): number {
		const species = this.dex.species.get(set.details?.split(',')[0] || set.speciesForme);
		if (!species.exists) return 0;
		let score = this.hpFraction(set.condition) * 60;
		for (const foe of this.foes.values()) {
			if (foe.fainted) continue;
			const foeSpecies = this.dex.species.get(foe.species);
			if (!foeSpecies.exists) continue;
			// How badly the foe's STAB hurts this Pokemon, and vice versa.
			for (const type of foeSpecies.types) {
				score -= this.typeEffectiveness(type, species.types) * 12;
			}
			for (const type of species.types) {
				score += this.typeEffectiveness(type, foeSpecies.types) * 12;
			}
		}
		return score + this.noise() * 20;
	}

	// =====================================================================
	// Move selection
	// =====================================================================

	private chooseMoves(request: AnyObject): string {
		const actives: AnyObject[] = request.active;
		const pokemon: AnyObject[] = request.side.pokemon;
		const isDoubles = actives.length > 1;
		const foePositions = [...this.foes.entries()].filter(([, f]) => !f.fainted);
		const switchesUsed: number[] = [];
		let megaThisTurn = false;

		const choices = actives.map((active: AnyObject, i: number) => {
			const self = pokemon[i];
			if (!self || self.condition.endsWith(' fnt') || self.commanding) return 'pass';

			// --- consider switching out of a bad matchup ---------------------
			if (DIFFICULTY[this.difficulty].switching && !active.trapped && !active.maybeTrapped) {
				const staying = this.matchupScore(self);
				const better = this.bestBenchOption(pokemon, actives.length, switchesUsed);
				if (better && better.score > staying + 45) {
					switchesUsed.push(better.slot);
					return `switch ${better.slot}`;
				}
			}

			// --- score every legal move -------------------------------------
			const scored = (active.moves as AnyObject[])
				.map((move, index) => ({
					index: index + 1,
					id: move.id,
					disabled: move.disabled,
					score: this.moveScore(move, self, foePositions, isDoubles),
				}))
				.filter(entry => !entry.disabled);
			if (!scored.length) return 'move 1';
			scored.sort((a, b) => b.score - a.score);
			const best = scored[0];

			// --- Mega Evolution ---------------------------------------------
			let suffix = '';
			if (active.canMegaEvo && !this.megaUsed && !megaThisTurn &&
				DIFFICULTY[this.difficulty].mega) {
				this.megaUsed = true;
				megaThisTurn = true;
				suffix = ' mega';
			}

			this.lastMoveWasProtect = this.dex.moves.get(best.id).stallingMove || false;

			// --- targeting ---------------------------------------------------
			// The request's own target field is authoritative: a Pokemon locked
			// into a move gets `scripted`, and passing a target then is illegal.
			const requestTarget = (active.moves as AnyObject[])[best.index - 1]?.target;
			if (isDoubles && CHOOSABLE_TARGETS.has(requestTarget)) {
				const target = this.bestTarget(this.dex.moves.get(best.id), self, foePositions);
				if (target) return `move ${best.index} ${target}${suffix}`;
			}
			return `move ${best.index}${suffix}`;
		});
		return choices.join(', ');
	}

	private bestBenchOption(pokemon: AnyObject[], activeCount: number, used: number[]) {
		let best: { slot: number, score: number } | null = null;
		for (let j = activeCount; j < pokemon.length; j++) {
			if (pokemon[j].condition.endsWith(' fnt') || used.includes(j + 1)) continue;
			const score = this.switchInScore(pokemon[j]);
			if (!best || score > best.score) best = { slot: j + 1, score };
		}
		return best;
	}

	/** Positive when this Pokemon is doing well against what is out. */
	private matchupScore(set: AnyObject): number {
		const score = this.switchInScore(set);
		// Being at low HP is a much bigger deal for the Pokemon already out.
		return score - (1 - this.hpFraction(set.condition)) * 40;
	}

	private moveScore(move: AnyObject, self: AnyObject, foes: [string, FoeInfo][], isDoubles: boolean): number {
		const data = this.dex.moves.get(move.id);
		if (!data.exists) return 0;
		const species = this.dex.species.get(self.details?.split(',')[0] || self.speciesForme);
		const myHp = this.hpFraction(self.condition);

		// Protecting: useful when hurt, never twice in a row.
		if (data.stallingMove) {
			if (this.lastMoveWasProtect) return 1;
			return (myHp < 0.5 ? 55 : 20) + this.noise() * 15;
		}

		if (data.category === 'Status') {
			let score = 22;
			// Status moves are for healthy Pokemon with time to spare.
			if (myHp > 0.6) score += 10;
			if (data.heal && myHp < 0.55) score += 45;
			if (data.status) {
				const targetsAlreadyStatused = foes.every(([, f]) => f.status);
				score += targetsAlreadyStatused ? -20 : 20;
			}
			if (data.boosts && Object.values(data.boosts).some(v => (v) > 0)) {
				score += myHp > 0.75 ? 18 : -10;
			}
			if (data.sideCondition || data.pseudoWeather || data.weather) score += 12;
			return score + this.noise() * 20;
		}

		// Damaging move: estimate what it actually does.
		let best = 0;
		let targetsHit = 0;
		for (const [, foe] of foes) {
			const damage = this.estimateDamagePercent(data, species, foe);
			if (damage <= 0) continue;
			targetsHit++;
			let score = damage;
			if (damage >= foe.hpPercent) score += 60; // this is a KO
			best = Math.max(best, score);
		}
		if (!targetsHit) return 1; // immune to everything out there

		let score = best;
		// A spread move that hits two Pokemon is worth more than its best hit.
		if (isDoubles && ['allAdjacentFoes', 'allAdjacent'].includes(data.target) && targetsHit > 1) {
			score *= 1.5;
		}
		if (data.priority > 0) score += 8;
		return score + this.noise() * 20;
	}

	/** Rough % of the target's max HP this move deals. */
	private estimateDamagePercent(move: Move, attacker: Species, foe: FoeInfo): number {
		const defender = this.dex.species.get(foe.species);
		if (!defender.exists || !attacker.exists) return 0;

		const effectiveness = this.typeEffectiveness(move.type, defender.types);
		if (effectiveness === 0 && !move.ignoreImmunity) return 0;

		let power = move.basePower;
		// Callback-driven moves have no fixed power; assume something average.
		if (!power && (move.basePowerCallback || move.damageCallback)) power = 70;
		if (!power) return 0;
		if (move.multihit) {
			const hits = Array.isArray(move.multihit) ? (move.multihit[0] + move.multihit[1]) / 2 :
				move.multihit;
			power *= hits;
		}

		const offence = move.category === 'Physical' ? attacker.baseStats.atk : attacker.baseStats.spa;
		const defence = move.category === 'Physical' ? defender.baseStats.def : defender.baseStats.spd;
		const stab = attacker.types.includes(move.type) ? 1.5 : 1;
		const accuracy = typeof move.accuracy === 'number' ? move.accuracy / 100 : 1;

		// Level-100 damage formula, then expressed as a share of the target's HP.
		const raw = ((2 * 100 / 5 + 2) * power * offence / Math.max(1, defence)) / 50 + 2;
		const damage = raw * stab * effectiveness * accuracy;
		return Math.min(100, damage * 100 / Math.max(1, defender.baseStats.hp * 2 + 110));
	}

	/** Multiplier of `type` against `defenderTypes` (0, 0.25, 0.5, 1, 2, 4). */
	private typeEffectiveness(type: string, defenderTypes: string[]): number {
		let multiplier = 1;
		for (const defType of defenderTypes) {
			if (!this.dex.getImmunity(type, defType)) return 0;
			multiplier *= 2 ** this.dex.getEffectiveness(type, defType);
		}
		return multiplier;
	}

	private bestTarget(move: Move, self: AnyObject, foes: [string, FoeInfo][]): string | null {
		const species = this.dex.species.get(self.details?.split(',')[0] || self.speciesForme);
		let best: { slot: string, score: number } | null = null;
		for (const [position, foe] of foes) {
			const damage = this.estimateDamagePercent(move, species, foe);
			const score = damage + (damage >= foe.hpPercent ? 50 : 0);
			// "p2a" -> slot 1, "p2b" -> slot 2, as seen from the opposing side.
			const slot = position.charCodeAt(position.length - 1) - 96;
			if (!best || score > best.score) best = { slot: `${slot}`, score };
		}
		return best?.slot ?? null;
	}

	private hpFraction(condition: string): number {
		if (!condition || condition.endsWith(' fnt')) return 0;
		const [hp] = condition.split(' ');
		const [cur, max] = hp.split('/').map(Number);
		if (isNaN(cur)) return 1;
		return isNaN(max) ? cur / 100 : cur / Math.max(1, max);
	}

	private noise(): number {
		return this.prng.random() * DIFFICULTY[this.difficulty].noise * 100 / 100;
	}
}

export default FakemonBot;
