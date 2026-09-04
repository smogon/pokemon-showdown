/**
 * Fakemon rules.
 *
 * `Fakemon Standard` is the rule every Fakemon format runs. It does two jobs:
 *
 *  1. VALIDATION - it is the server-side guarantee that nothing from the
 *     original Pokemon Showdown can reach a battle. scripts.ts already deletes
 *     the original data from this mod, so an original name simply does not
 *     resolve; this rule turns that into a clear error message and also
 *     re-checks every species, move, ability and item against the generated
 *     inventory, so a hand-edited team, an import or a hacked client request is
 *     rejected before the battle starts.
 *
 *  2. MECHANICS BOOKKEEPING - a handful of custom abilities and moves need to
 *     know things the engine does not track on its own (the move a Pokemon used
 *     before its current one, whether it used a status move last turn, which
 *     boosts it gained this turn, the ability it started the battle with). This
 *     rule maintains that state on `pokemon.m` for all of them in one place.
 */

import { FakemonIndex } from './generated/index';
import { toID } from '../../../sim/dex-data';

const LEGAL_SPECIES = new Set<string>(FakemonIndex.species.map(toID));
const LEGAL_MOVES = new Set<string>([
	...FakemonIndex.genericMoves,
	...Object.keys(FakemonIndex.signatureMoves),
]);
const LEGAL_ABILITIES = new Set<string>([
	...Object.keys(FakemonIndex.abilities),
	...Object.keys(FakemonIndex.megaAbilities),
]);
/** Mega abilities may only be reached by Mega Evolving, never chosen directly. */
const MEGA_ONLY_ABILITIES = new Set<string>(Object.keys(FakemonIndex.megaAbilities));

export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	// Sleep Clause Mod's banlist mentions original Showdown data ("Hypnosis +
	// Gengarite"), which no longer exists here, so the clause is re-declared
	// without it. The mechanic itself is inherited unchanged.
	sleepclausemod: {
		inherit: true,
		banlist: [],
	},

	standardfakemon: {
		effectType: 'ValidatorRule',
		name: 'Standard Fakemon',
		desc: "The standard ruleset for the custom Fakemon system.",
		// `+tag:custom` re-allows the custom items (they are all tagged Custom so
		// that scripts.ts can tell them from the original ones); the original
		// moves kept for their mechanics stay unusable because no Fakemon learns
		// them and Obtainable Moves enforces learnsets.
		ruleset: [
			'Obtainable', '+tag:custom', 'Team Preview', 'Species Clause', 'Nickname Clause',
			'OHKO Clause', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',
			'Sleep Clause Mod',
		],
	},

	fakemonstandard: {
		effectType: 'ValidatorRule',
		name: 'Fakemon Standard',
		desc: "Only Pok&eacute;mon, moves, abilities and items from the custom Fakemon dex are legal.",

		onValidateSet(set, format, setHas, teamHas) {
			const problems: string[] = [];
			const speciesId = toID(set.species || set.name);
			const species = this.dex.species.get(speciesId);

			if (!species.exists || !LEGAL_SPECIES.has(species.id)) {
				return [
					`${set.species || set.name} is not a Pokémon in this game.`,
					`This format only allows the custom Fakemon dex - original Pokémon Showdown Pokémon cannot be used.`,
				];
			}
			if (species.battleOnly) {
				problems.push(
					`${species.name} is a Mega forme and cannot be put on a team directly.`,
					`Add ${species.baseSpecies} holding ${species.requiredItem} instead.`
				);
			}

			const ability = this.dex.abilities.get(set.ability);
			if (!ability.exists || !LEGAL_ABILITIES.has(ability.id)) {
				problems.push(`${species.name}'s ability ${set.ability} does not exist in this game.`);
			} else if (MEGA_ONLY_ABILITIES.has(ability.id) && !species.isMega) {
				problems.push(
					`${ability.name} is a Mega Ability: ${species.name} only gets it after Mega Evolving.`
				);
			}

			const item = this.dex.items.get(set.item);
			if (set.item && (!item.exists || item.isNonstandard !== 'Custom')) {
				problems.push(`${species.name}'s item ${set.item} does not exist in this game.`);
			}
			if (item.megaStone && !item.megaStone[species.baseSpecies]) {
				problems.push(
					`${species.name} cannot hold ${item.name} - that Mega Stone belongs to ` +
					`${Object.keys(item.megaStone).join('/')}.`
				);
			}

			for (const moveName of set.moves) {
				const move = this.dex.moves.get(moveName);
				if (!move.exists || !LEGAL_MOVES.has(move.id)) {
					problems.push(
						`${species.name}'s move ${moveName} does not exist in this game.`,
						`Only moves from the custom Fakemon move list are allowed.`
					);
				}
			}
			return problems;
		},
	},

	fakemonmechanics: {
		effectType: 'Rule',
		name: 'Fakemon Mechanics',
		desc: "Bookkeeping the custom abilities and moves rely on.",

		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.startingAbility = pokemon.ability;
				pokemon.m.boostsThisTurn = {};
			}
			this.add('rule', 'Fakemon Mechanics: this battle uses the custom Fakemon system');
		},

		onSwitchIn(pokemon) {
			pokemon.m.boostsThisTurn = {};
			pokemon.m.trunkReady = true;
		},

		// Power Grid needs to know what the Mega was before it Mega Evolved.
		onBeforeSwitchIn(pokemon) {
			pokemon.m.preMegaAbility = pokemon.ability;
		},

		onAfterMove(source, target, move) {
			if (move.category === 'Status') {
				source.m.usedStatusMoveThisTurn = true;
			} else {
				// Puppet Show repeats the attack before the current one.
				source.m.previousAttack = source.m.currentAttack;
				source.m.currentAttack = move.id;
			}
		},

		onAnyAfterBoost(boost, target, source, effect) {
			if (!target) return;
			const seen = (target.m.boostsThisTurn ||= {}) as SparseBoostsTable;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! > 0) seen[i] = (seen[i] || 0) + boost[i]!;
			}
		},

		onResidualOrder: 100,
		onResidual(pokemon) {
			pokemon.m.lastTurnStatusMove = !!pokemon.m.usedStatusMoveThisTurn;
			pokemon.m.usedStatusMoveThisTurn = false;
			pokemon.m.boostsThisTurn = {};
		},
	},
};
