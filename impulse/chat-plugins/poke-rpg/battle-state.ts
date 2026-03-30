/**
 * Battle State Management
 *
 * This module contains shared state and utility functions that are used across battle-related modules.
 * It's separated to avoid circular dependencies between commands.ts,
 * battle-commands.ts, battle-flow.ts, battle-core.ts, and battle-tower.ts.
 */

import { Dex, toID } from '../../../sim/dex';
import type { RPGPokemon, ActivePokemonSlot, BattleState } from './interface';
import { TYPE_CHART, getActiveSlots, applyStatChange } from './utils';
import { RPGAbilities } from './abilities';
import { ITEMS_DATABASE } from './items';

/**
 * Tracks the Terastallization toggle state for each user during battle.
 * Key: userId, Value: whether Tera toggle is active
 */
export const teraToggleState = new Map<string, boolean>();

/**
 * Tracks active scripted events for each user.
 * Key: userId, Value: eventId
 */
export const activeScriptedEvents = new Map<string, string>();

/**
 * Get the stat multiplier based on the stat stage.
 * This is used throughout battle calculations.
 */
export function getStatMultiplier(stage: number): number {
	if (stage >= 0) {
		return (2 + stage) / 2;
	} else {
		return 2 / (2 + Math.abs(stage));
	}
}

/**
 * Get the Pokemon's types, accounting for Terastallization.
 */
export function getPokemonTypes(pokemon: RPGPokemon, slot?: ActivePokemonSlot): string[] {
	if (slot?.terastallized) {
		return [slot.terastallized];
	}
	const species = Dex.species.get(pokemon.species);
	return species.types;
}

/**
 * Calculate type effectiveness for a move against defender types.
 * Handles special cases like Flying Press, Freeze-Dry, Strong Winds, etc.
 */
export function getCustomEffectiveness(
	moveType: string,
	defenderTypes: string[],
	defender: RPGPokemon,
	battle: BattleState,
	attacker?: RPGPokemon,
	moveId?: string
): number {
	let effectiveness = 1;

	if (moveId === 'flyingpress') {
		let fightingEff = 1;
		let flyingEff = 1;

		const fightingChart = TYPE_CHART['Fighting'];
		const flyingChart = TYPE_CHART['Flying'];

		for (const type of defenderTypes) {
			if (fightingChart.superEffective.includes(type)) fightingEff *= 2;
			else if (fightingChart.notVeryEffective.includes(type)) fightingEff *= 0.5;
			else if (fightingChart.noEffect.includes(type)) fightingEff *= 0;

			if (flyingChart.superEffective.includes(type)) flyingEff *= 2;
			else if (flyingChart.notVeryEffective.includes(type)) flyingEff *= 0.5;
			else if (flyingChart.noEffect.includes(type)) flyingEff *= 0;
		}

		return fightingEff * flyingEff;
	}

	const chartEntry = TYPE_CHART[moveType];
	if (!chartEntry) return 1;

	const hasStrongWinds = battle.weather?.type === 'strong-winds';
	const isFlyingType = defenderTypes.includes('Flying');

	const attackerAbility = attacker ? toID(attacker.ability || '') : '';
	const hasMindEye = attackerAbility === 'mindseye';
	const hasScrappy = attackerAbility === 'scrappy';

	for (const defenderType of defenderTypes) {
		if (moveId === 'freezedry' && defenderType === 'Water') {
			effectiveness *= 2;
			continue;
		}

		if (chartEntry.superEffective.includes(defenderType)) {
			if (hasStrongWinds && isFlyingType && defenderType === 'Flying' &&
				['Rock', 'Electric', 'Ice'].includes(moveType)) {
				effectiveness *= 1;
			} else {
				effectiveness *= 2;
			}
		} else if (chartEntry.notVeryEffective.includes(defenderType)) {
			effectiveness *= 0.5;
		} else if (chartEntry.noEffect.includes(defenderType)) {
			if (hasMindEye && defenderType === 'Ghost' && ['Normal', 'Fighting'].includes(moveType)) {
				effectiveness *= 1;
			} else if (hasScrappy && defenderType === 'Ghost' && ['Normal', 'Fighting'].includes(moveType)) {
				effectiveness *= 1;
			} else {
				effectiveness *= 0;
			}
		}
	}
	return effectiveness;
}

/**
 * Apply hazard effects when a Pokemon switches in.
 * Returns true if the Pokemon fainted from hazard damage.
 */
export function applyHazardEffectsOnSwitchIn(slot: ActivePokemonSlot, battle: BattleState, isPlayerSwitchIn: boolean, messageLog: string[]): boolean {
	const pokemon = slot.pokemon;
	const ability = toID(pokemon.ability || '');

	const runSwitchInAbilities = () => {
		RPGAbilities.applySwitchInAbilities(slot, battle, isPlayerSwitchIn, messageLog);

		const opponentSlots = isPlayerSwitchIn ? getActiveSlots(battle.opponentSide.slots) : getActiveSlots(battle.playerSide.slots);
		if (ability === 'frisk') {
			for (const opponentSlot of opponentSlots) {
				if (opponentSlot && opponentSlot.pokemon.hp > 0 && opponentSlot.pokemon.item) {
					const itemName = ITEMS_DATABASE[opponentSlot.pokemon.item]?.name || opponentSlot.pokemon.item;
					messageLog.push(`${pokemon.species} frisked ${opponentSlot.pokemon.species} and found its ${itemName}!`);
				}
			}
		}

		if (ability === 'download' && opponentSlots.length > 0) {
			let totalDef = 0;
			let totalSpd = 0;
			for (const oppSlot of opponentSlots) {
				totalDef += oppSlot.pokemon.def * getStatMultiplier(oppSlot.statStages.def);
				totalSpd += oppSlot.pokemon.spd * getStatMultiplier(oppSlot.statStages.spd);
			}
			if (totalDef < totalSpd) {
				applyStatChange(slot, 'atk', 1, battle, messageLog, slot);
			} else {
				applyStatChange(slot, 'spa', 1, battle, messageLog, slot);
			}
		}
	};

	if (battle.magicRoomTurns === 0 && pokemon.item === 'heavydutyboots') {
		runSwitchInAbilities();
		return false;
	}

	const hazards = isPlayerSwitchIn ? battle.playerSide.hazards : battle.opponentSide.hazards;
	if (hazards.length === 0) {
		runSwitchInAbilities();
		return false;
	}

	const species = Dex.species.get(pokemon.species);
	const isGrounded = RPGAbilities.isGrounded(pokemon, battle);
	const hasAirBalloon = battle.magicRoomTurns === 0 && pokemon.item === 'airballoon';
	let totalDamage = 0;

	if (isGrounded) {
		if (hazards.includes('stickyweb')) {
			applyStatChange(slot, 'spe', -1, battle, messageLog, null);
		}

		const toxicSpikeLayers = hazards.filter(h => h === 'toxicspikes').length;
		if (toxicSpikeLayers > 0) {
			if (species.types.includes('Poison')) {
				if (isPlayerSwitchIn) battle.playerSide.hazards = battle.playerSide.hazards.filter(h => h !== 'toxicspikes');
				else battle.opponentSide.hazards = battle.opponentSide.hazards.filter(h => h !== 'toxicspikes');
				messageLog.push(`The Toxic Spikes were absorbed by ${pokemon.species}!`);
			} else {
				const isImmune = species.types.includes('Steel');
				if (!isImmune && !slot.status) {
					const newStatus = toxicSpikeLayers >= 2 ? 'tox' : 'psn';
					slot.status = newStatus;
					if (newStatus === 'tox') {
						slot.toxicCounter = 1;
						messageLog.push(`${pokemon.species} was badly poisoned by the Toxic Spikes!`);
					} else {
						messageLog.push(`${pokemon.species} was poisoned by the Toxic Spikes!`);
					}
				}
			}
		}

		const spikeLayers = hazards.filter(h => h === 'spikes').length;
		if (spikeLayers > 0) {
			const damageFraction = [0, 1 / 8, 1 / 6, 1 / 4][spikeLayers];
			totalDamage += Math.floor(pokemon.maxHp * damageFraction);
		}
	}

	if (hazards.includes('stealthrock')) {
		if (hasAirBalloon) {
			messageLog.push(`${pokemon.species}'s Air Balloon popped from the pointed stones!`);
			pokemon.item = undefined;
		}
		const effectiveness = getCustomEffectiveness('Rock', species.types, pokemon, battle);
		totalDamage += Math.floor(pokemon.maxHp * (1 / 8) * effectiveness);
	}

	if (totalDamage > 0) {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			if (hazards.includes('stealthrock')) messageLog.push(`Pointed stones dug into ${pokemon.species}!`);
			else if (hazards.includes('spikes')) messageLog.push(`${pokemon.species} was hurt by the spikes!`);

			pokemon.hp = Math.max(0, pokemon.hp - totalDamage);
			if (pokemon.hp <= 0) return true;
		} else {
			messageLog.push(`${pokemon.species}'s Magic Guard prevents hazard damage!`);
		}
	}

	runSwitchInAbilities();
	return false;
}
