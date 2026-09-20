/**
 * Set Up Position (docs/analysis/plan.md, Phase 4).
 *
 * A setup tab skips Team Preview and opens at turn 1 with a placeholder Pokémon in each active slot, which
 * the user then edits into the position they wanted. So all this file has to produce is a team the *engine*
 * accepts, not one the validator accepts: nothing in `sim/` checks team size, Species Clause, EVs, levels or
 * banlists — those live entirely in `TeamValidator`, which a setup tab skips (`sandbox` on the request).
 * That is the same call the tool already makes for mid-battle team edits, which are never validated either.
 *
 * The one engine constraint that does bite is `Pokemon`'s constructor, which throws on a set with no moves
 * and rolls a random gender (consuming RNG, which would break replay determinism) when a set omits one.
 */

import { Dex, Teams } from '../sim';
import type { RuleTable } from '../sim/dex-formats';
import type { ModdedDex } from '../sim/dex';

export interface AnalysisPlaceholderTeams {
	format: string;
	gameType: string;
	/** how many placeholders each side gets: one per active slot */
	count: number;
	/** one species per active slot, all different (see getPlaceholderSpeciesList) */
	species: string[];
	/** the nickname each placeholder carries, one per active slot (see getPlaceholderName) */
	names: string[];
	level: number;
	team1: string;
	team2: string;
}

/**
 * The first `count` species the format's own rule table doesn't ban, which needs no per-format table: gen 9
 * formats start at Bulbasaur, a Champions VGC format at Venusaur (Flat Rules bans the unevolved ones), and a
 * FNAF format at Freddy Fazbear, because every vanilla Pokémon is banned there.
 *
 * **They have to be different species.** The renderer resolves a `switch` line against its own roster, so
 * two entries that match on both nickname and species collapse into one and only half the field is drawn
 * (user report, 2026-09-19). Giving each active slot the next legal species keeps them distinguishable; the
 * user replaces them immediately anyway. The per-slot nicknames (`getPlaceholderName`) now separate them
 * too, but this stays as it is — it is the half that was actually verified against the renderer.
 */
export function getPlaceholderSpeciesList(dex: ModdedDex, ruleTable: RuleTable, count: number) {
	const picked = [];
	for (const species of dex.species.all()) {
		// alternate and battle-only formes aren't sensible starting points, and can't always be sent out
		if (!species.exists || species.forme || species.battleOnly) continue;
		if (ruleTable.isBannedSpecies(species)) continue;
		picked.push(species);
		if (picked.length >= count) return picked;
	}
	if (!picked.length) picked.push(dex.species.get('bulbasaur'));
	// a format with fewer legal species than active slots has to repeat one, collapsed sprites and all
	while (picked.length < count) picked.push(picked[picked.length - 1]);
	return picked;
}

/**
 * What a placeholder is called (user request, 2026-09-19). Nicknaming them says on the field itself that
 * these Pokémon are scaffolding to be replaced, rather than leaving the user to infer it from a Bulbasaur.
 *
 * Numbered only when a side has more than one, so singles reads "Placeholder" rather than "Placeholder 1".
 *
 * **This is a real nickname, and the teambuilder keeps real nicknames across a species change** — so the
 * client drops it when the placeholder is replaced (`collect` in analysis-teambuilder.tsx), or you would
 * end up with a Garchomp still called Placeholder.
 */
export function getPlaceholderName(index: number, count: number) {
	return count > 1 ? `Placeholder ${index + 1}` : 'Placeholder';
}

/** What the validator would have adjusted the level to, since a setup team never reaches it. */
export function getPlaceholderLevel(ruleTable: RuleTable) {
	let level = ruleTable.defaultLevel || 100;
	if (ruleTable.adjustLevel) {
		level = ruleTable.adjustLevel;
	} else if (ruleTable.adjustLevelDown && level >= ruleTable.adjustLevelDown) {
		level = ruleTable.adjustLevelDown;
	}
	return Math.max(ruleTable.minLevel || 1, Math.min(ruleTable.maxLevel || 100, level));
}

export function getPlaceholderTeams(formatid: string): AnalysisPlaceholderTeams {
	const format = Dex.formats.get(formatid);
	if (!format.exists) throw new Error(`Unknown format: ${formatid}`);
	const dex = Dex.forFormat(format).includeData();
	const ruleTable = dex.formats.getRuleTable(format);
	const level = getPlaceholderLevel(ruleTable);
	const count = format.gameType === 'triples' ? 3 :
		(format.playerCount > 2 || format.gameType === 'doubles') ? 2 :
		1;
	const speciesList = getPlaceholderSpeciesList(dex, ruleTable, count);

	const names = speciesList.map((_species, index) => getPlaceholderName(index, count));

	const sets = speciesList.map((species, index) => ({
		name: names[index],
		species: species.name,
		item: '',
		ability: species.abilities[0] || 'No Ability',
		// no moves, so the placeholder can only Struggle until the user gives it some. `Teams.pack`
		// writes this as an empty moves field, which unpacks to `['']` — enough to get past the
		// constructor's "has no moves" throw, and skipped when it builds `moveSlots`.
		moves: [],
		nature: 'Serious',
		// never leave this empty: the `Pokemon` constructor would roll one with `battle.sample`
		gender: species.gender || 'N',
		evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		level,
		teraType: species.requiredTeraType || species.types[0],
	}));
	const packed = Teams.pack(sets);

	return {
		format: format.id,
		gameType: format.gameType,
		count,
		species: speciesList.map(species => species.name),
		names,
		level,
		team1: packed,
		team2: packed,
	};
}
