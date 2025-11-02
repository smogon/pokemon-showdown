// Pokemon RPG Battle Helper Functions
import type { BattleState, ActivePokemonSlot, RPGPokemon } from './types';
import { TYPE_CHART } from './constants';
import { MANUAL_CATCH_RATES } from './MANUAL_CATCH_RATES';
import { isCustomMove, getCustomMove } from './CUSTOM_MOVES';

/**
 * Calculate type effectiveness for a move against a defender
 */
export function getCustomEffectiveness(moveType: string, defenderTypes: string[], defender: RPGPokemon, battle: BattleState): number {
	let effectiveness = 1;
	const chartEntry = TYPE_CHART[moveType];
	if (!chartEntry) return 1;
	for (const defenderType of defenderTypes) {
		if (chartEntry.superEffective.includes(defenderType)) {
			effectiveness *= 2;
		} else if (chartEntry.notVeryEffective.includes(defenderType)) {
			effectiveness *= 0.5;
		} else if (chartEntry.noEffect.includes(defenderType)) {
			effectiveness *= 0;
		}
	}
	return effectiveness;
}

/**
 * Get the stat multiplier for a given stat stage (-6 to +6)
 */
export function getStatMultiplier(stage: number): number {
	if (stage >= 0) {
		return (2 + stage) / 2;
	} else {
		return 2 / (2 + Math.abs(stage));
	}
}

/**
 * Calculate critical hit chance based on attacker's state and move
 */
export function getCriticalHitChance(attackerSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	let critStage = 0;
	const attacker = attackerSlot.pokemon;

	// Focus Energy boosts crit stage
	if (attackerSlot.focusEnergy) {
		critStage += 2;
	}

	// Base critical hit stages for certain moves
	if (['slash', 'razorleaf', 'crabhammer', 'karatechop', 'attackorder', 'blazekick', 'crosschop', 'crosspoison', 'nightslash', 'poisontail', 'psychocut', 'shadowclaw', 'spacialrend', 'stoneedge'].includes(move.id)) {
		critStage += 1;
	}

	// Scope Lens and Razor Claw boost
	if (battle.magicRoomTurns === 0 && (attacker.item === 'scopelens' || attacker.item === 'razorclaw')) {
		critStage += 1;
	}

	// Critical hit chances by stage
	const critChances = [1 / 24, 1 / 8, 1 / 2, 1 / 1]; // stages 0, 1, 2, 3+
	return critChances[Math.min(critStage, 3)];
}

/**
 * Get a move from either Dex or Custom Moves
 * This wrapper function checks custom moves first, then falls back to Dex
 */
export function getMove(moveId: string): any {
	// Check if it's a custom move
	if (isCustomMove(moveId)) {
		const customMove = getCustomMove(moveId);
		// Add exists property for compatibility
		return { ...customMove, exists: true };
	}

	// Otherwise get from Dex
	return Dex.moves.get(moveId);
}

/**
 * Get active (non-null, alive) slots from a slot array
 */
export function getActiveSlots(slots: [ActivePokemonSlot | null, ActivePokemonSlot | null]): ActivePokemonSlot[] {
	return slots.filter((s): s is ActivePokemonSlot => s !== null && s.pokemon.hp > 0);
}

/**
 * Get a slot from its index (0-3: 0-1 player, 2-3 opponent)
 */
export function getSlotFromIndex(battle: BattleState, slotIndex: number): ActivePokemonSlot | null {
	if (slotIndex === 0 || slotIndex === 1) {
		return battle.playerSlots[slotIndex];
	} else if (slotIndex === 2 || slotIndex === 3) {
		return battle.opponentSlots[slotIndex - 2];
	}
	return null;
}

/**
 * Calculate ball bonus for catch attempts
 */
export function getBallBonus(ballId: string, battle: BattleState, targetSlot: ActivePokemonSlot): number {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;
	// Get the player's *first* active Pokemon for level/stat comparisons
	// This is a simplification for doubles, but necessary.
	const playerSlot = getActiveSlots(battle.playerSlots)[0];
	if (!playerSlot) return 1; // No player pokemon?
	const activePokemon = playerSlot.pokemon;
	const turn = battle.turn;

	const opponentSpecies = Dex.species.get(opponentActivePokemon.species);

	switch (ballId) {
	case 'greatball': return 1.5;
	case 'ultraball': return 2;
	case 'masterball': return 255;
	case 'fastball':
		return opponentSpecies.baseStats.spe >= 100 ? 4 : 1;
	case 'levelball':
		if (activePokemon.level >= opponentActivePokemon.level * 4) return 8;
		if (activePokemon.level >= opponentActivePokemon.level * 2) return 4;
		if (activePokemon.level > opponentActivePokemon.level) return 2;
		return 1;
	case 'nestball':
		return opponentActivePokemon.level <= 30 ? Math.max(1, (41 - opponentActivePokemon.level) / 10) : 1;
	case 'netball':
		return opponentSpecies.types.includes('Bug') || opponentSpecies.types.includes('Water') ? 3.5 : 1;
	case 'quickball':
		return turn === 0 ? 5 : 1;
	case 'timerball':
		return Math.min(4, 1 + turn * (1229 / 4096));
	case 'dreamball':
		return opponentStatus === 'slp' ? 4 : 1;
	default:
		return 1; // pokeball, premierball, luxuryball, healball, etc.
	}
}

/**
 * Perform a catch attempt and return success/shake count
 */
export function performCatchAttempt(battle: BattleState, ballId: string, targetSlot: ActivePokemonSlot): { success: boolean, shakes: number } {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;

	const speciesId = toID(opponentActivePokemon.species);
	// Updated fallback catch rate from 45 to 150
	const catchRate = MANUAL_CATCH_RATES[speciesId] || 150;

	const ballBonus = getBallBonus(ballId, battle, targetSlot);
	if (ballBonus === 255) return { success: true, shakes: 4 }; // Master Ball

	let statusBonus = 1;
	if (opponentStatus === 'slp' || opponentStatus === 'frz') {
		statusBonus = 2.5;
	} else if (opponentStatus === 'par' || opponentStatus === 'psn' || opponentStatus === 'brn') {
		statusBonus = 1.5;
	}

	const { maxHp, hp } = opponentActivePokemon;
	const modifiedCatchRate = catchRate;

	const a = Math.floor(
		(((3 * maxHp - 2 * hp) * modifiedCatchRate * ballBonus) / (3 * maxHp)) * statusBonus
	);

	if (a >= 255) return { success: true, shakes: 4 }; // Automatic catch

	const b = Math.floor(65536 / (255 / a) ** 0.1875);

	let shakes = 0;
	for (let i = 0; i < 4; i++) {
		const rand = Math.floor(Math.random() * 65536);
		if (rand >= b) {
			return { success: false, shakes };
		}
		shakes++;
	}

	return { success: true, shakes: 4 };
}
