/*
* Pokemon Showdown
* RPG Battle Shared Utilities
*
* This file contains shared helper functions used by battle-core,
* battle-effects, and battle-moves to prevent circular dependencies.
*/

import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { NATURES, BERRY_FLAVORS, NATURE_FLAVOR_PREFERENCES } from './data';
import { ITEMS_DATABASE } from './items';
import type { ActivePokemonSlot, BattleState, Stats, Status } from './interface';

// --- CONSTANTS ---

export const INITIAL_STAT_STAGES = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

// --- HELPER FUNCTIONS ---

export function applyStatChange(
	slot: ActivePokemonSlot,
	stat: keyof ActivePokemonSlot['statStages'],
	value: number,
	battle: BattleState,
	messageLog: string[],
	source: ActivePokemonSlot | null = null
): boolean {
	const pokemon = slot.pokemon;
	const ability = toID(pokemon.ability || '');
	const actualValue = RPGAbilities.applyStatChangeModifier(value, ability);

	const currentStage = slot.statStages[stat];
	const isSelf = !source || source.pokemon.id === pokemon.id;

	if (actualValue > 0) {
		if (currentStage >= 6) {
			messageLog.push(`${pokemon.species}'s ${stat.toUpperCase()} won't go any higher!`);
			return false;
		}
		const newStage = Math.min(6, currentStage + actualValue);
		slot.statStages[stat] = newStage as any;
		const msg = `${pokemon.species}'s ${stat.toUpperCase()} ${actualValue > 1 ? 'sharply ' : ''}rose!`;
		messageLog.push(msg);
		return true;
	} else if (actualValue < 0) {
		if (!isSelf) {
			if (battle.magicRoomTurns === 0 && pokemon.item === 'clearamulet') {
				messageLog.push(`${pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
				return false;
			}
			const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
			if (blockAbilities.includes(ability)) {
				messageLog.push(`${pokemon.species}'s ${ability} prevents its stats from being lowered!`);
				return false;
			}
			if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(ability)) {
				messageLog.push(`${pokemon.species}'s ${ability} prevents its Attack from being lowered!`);
				return false;
			}
		}

		if (currentStage <= -6) {
			messageLog.push(`${pokemon.species}'s ${stat.toUpperCase()} won't go any lower!`);
			return false;
		}
		const newStage = Math.max(-6, currentStage + actualValue);
		slot.statStages[stat] = newStage as any;
		const msg = `${pokemon.species}'s ${stat.toUpperCase()} ${actualValue < -1 ? 'sharply ' : ''}fell!`;
		messageLog.push(msg);

		checkStatDropAbilities(slot, source, battle, messageLog);
		return true;
	}

	return false;
}

export function checkStatDropAbilities(
	targetSlot: ActivePokemonSlot,
	sourceSlot: ActivePokemonSlot | null,
	battle: BattleState,
	messageLog: string[]
) {
	RPGAbilities.applyStatDropResponse(targetSlot, battle, messageLog, sourceSlot);
}

export function activateUnburden(slot: ActivePokemonSlot, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	if (ability === 'unburden' && !slot.unburdenActive) {
		slot.unburdenActive = true;
		messageLog.push(`${slot.pokemon.species}'s Unburden activated!`);
	}
}

export function applySynchronize(
	status: Status,
	defenderSlot: ActivePokemonSlot,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState,
	messageLog: string[]
): void {
	const attacker = attackerSlot.pokemon;
	if (!attacker || attacker.hp <= 0) return;

	const attackerSpecies = Dex.species.get(attacker.species);
	let canBeAfflicted = !attackerSlot.status;

	if (!canBeAfflicted) return;

	if ((status === 'brn' && attackerSpecies.types.includes('Fire')) ||
		(status === 'par' && attackerSpecies.types.includes('Electric')) ||
		(status === 'psn' && (attackerSpecies.types.includes('Poison') || attackerSpecies.types.includes('Steel'))) ||
		(status === 'frz' && attackerSpecies.types.includes('Ice'))) {
		canBeAfflicted = false;
	}

	if (canBeAfflicted && RPGAbilities.preventsStatus(attacker, status)) {
		canBeAfflicted = false;
	}

	const attackerIsGrounded = RPGAbilities.isGrounded(attacker, battle);
	if (canBeAfflicted && battle.terrain?.type === 'misty' && attackerIsGrounded) {
		canBeAfflicted = false;
	}
	if (canBeAfflicted && battle.terrain?.type === 'electric' && status === 'slp' && attackerIsGrounded) {
		canBeAfflicted = false;
	}

	if (canBeAfflicted) {
		attackerSlot.status = status;
		if (status === 'slp') {
			attackerSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
		}
		messageLog.push(`${defenderSlot.pokemon.species}'s Synchronize afflicted ${attacker.species} with ${status}!`);
	}
}

export function checkMentalHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mentalherb') return false;

	const hasBindingEffect =
		slot.tauntTurns > 0 ||
		slot.encoreMove !== undefined ||
		slot.disabledMove !== undefined ||
		slot.tormentActive ||
		(slot.healBlockTurns || 0) > 0;

	if (hasBindingEffect) {
		slot.tauntTurns = 0;
		slot.encoreMove = undefined;
		slot.disabledMove = undefined;
		slot.tormentActive = false;
		slot.healBlockTurns = 0;

		messageLog.push(`${slot.pokemon.species}'s Mental Herb snapped it out of its confusion!`);
		slot.pokemon.item = undefined;
		activateUnburden(slot, messageLog);
		return true;
	}

	return false;
}

export function handleHPDropEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (battle.magicRoomTurns > 0) return;

	const pokemon = slot.pokemon;

	if (pokemon.hp <= 0 || !pokemon.item) return;

	let itemConsumed = false;
	let consumedItemName = '';
	const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);

	const halfHP = pokemon.maxHp / 2;
	const quarterHP = pokemon.maxHp / 4;

	if (pokemon.hp <= halfHP && !itemConsumed) {
		let healAmount = 0;
		if (pokemon.item === 'berryjuice') {
			healAmount = 20;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} drank its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'oranberry') {
			healAmount = 10;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'goldberry') {
			healAmount = 30;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'sitrusberry') {
			healAmount = Math.floor(pokemon.maxHp / 4);
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		}

		if (healAmount > 0) {
			const oldHp = pokemon.hp;
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
		}
	}

	if (!itemConsumed && pokemon.hp <= quarterHP) {
		const pinchBerryHP = ['figyberry', 'wikiberry', 'magoberry', 'aguavberry', 'iapapaberry'];
		const pinchBerryStat: Record<string, keyof Omit<Stats, 'maxHp'>> = {
			'liechiberry': 'atk', 'ganlonberry': 'def', 'salacberry': 'spe',
			'petayaberry': 'spa', 'apicotberry': 'spd',
		};

		if (pinchBerryHP.includes(pokemon.item)) {
			const oldHp = pokemon.hp;
			const healAmount = Math.floor(pokemon.maxHp / 2);
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${pokemon.hp - oldHp} HP!`);

			const berryData = BERRY_FLAVORS[pokemon.item];
			const natureData = NATURES[pokemon.nature];
			if (natureData && berryData) {
				const dislikedFlavor = natureData.minus ? NATURE_FLAVOR_PREFERENCES[natureData.minus] : null;
				if (dislikedFlavor && berryData.flavor === dislikedFlavor) {
					if (!slot.isConfused) {
						slot.isConfused = true;
						slot.confusionCounter = Math.floor(Math.random() * 3) + 2;
						messageLog.push(`${pokemon.species} became confused due to the berry's flavor!`);
					}
				}
			}
			itemConsumed = true;
		} else if (pokemon.item in pinchBerryStat) {
			const statToBoost = pinchBerryStat[pokemon.item] as keyof ActivePokemonSlot['statStages'];

			if (applyStatChange(slot, statToBoost, 1, battle, messageLog, slot)) {
				consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
				messageLog[messageLog.length - 1] += ` (from ${consumedItemName})!`;
				itemConsumed = true;
			}
		} else if (pokemon.item === 'starfberry') {
			const targetStages = slot.statStages;
			const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;
			const availableStats = stats.filter(stat => targetStages[stat] < 6);

			if (availableStats.length > 0) {
				const randomStat = availableStats[Math.floor(Math.random() * availableStats.length)];

				if (applyStatChange(slot, randomStat, 2, battle, messageLog, slot)) {
					consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
					messageLog[messageLog.length - 1] += ` (from ${consumedItemName})!`;
					itemConsumed = true;
				}
			}
		}
	}

	if (itemConsumed) {
		pokemon.item = undefined;
		activateUnburden(slot, messageLog);
	}
}
