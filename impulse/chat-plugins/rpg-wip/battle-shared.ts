/*
* Pokemon Showdown
* RPG Battle Shared Utilities
*
* This file contains shared helper functions used by battle-core,
* battle-effects, and battle-moves to prevent circular dependencies.
*/

import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { BERRY_FLAVORS, NATURE_FLAVOR_PREFERENCES } from './data';
import { ITEMS_DATABASE } from './items';
import type { ActivePokemonSlot, BattleState, Stats, Status, Move, RPGPokemon } from './interface';
import { getActiveSlots, NATURES } from './utils';

export const INITIAL_STAT_STAGES = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

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
		// Clear Amulet only blocks drops from others
		if (!isSelf && battle.magicRoomTurns === 0 && pokemon.item === 'clearamulet') {
			messageLog.push(`${pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
			return false;
		}

		// Abilities like Clear Body block all drops, including self-inflicted ones
		const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
		if (blockAbilities.includes(ability)) {
			messageLog.push(`${pokemon.species}'s ${pokemon.ability} prevents its stats from being lowered!`);
			return false;
		}
		if (stat === 'atk' && ability === 'hypercutter') {
			messageLog.push(`${pokemon.species}'s ${pokemon.ability} prevents its Attack from being lowered!`);
			return false;
		}
		// Flower Veil protects Grass-types from stat drops
		if (ability === 'flowerveil') {
			const species = Dex.species.get(pokemon.species);
			if (species.types.includes('Grass')) {
				messageLog.push(`${pokemon.species}'s ${pokemon.ability} prevents its stats from being lowered!`);
				return false;
			}
		}
		// Check if any ally has Flower Veil that would protect this Grass-type
		const species = Dex.species.get(pokemon.species);
		if (species.types.includes('Grass')) {
			const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
			const allies = isPlayerPokemon ? battle.playerSlots : battle.opponentSlots;
			if (allies.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'flowerveil' && s.pokemon.id !== pokemon.id)) {
				messageLog.push(`Flower Veil protects ${pokemon.species} from stat drops!`);
				return false;
			}
		}
		// Big Pecks prevents Defense from being lowered
		if (stat === 'def' && ability === 'bigpecks') {
			messageLog.push(`${pokemon.species}'s ${pokemon.ability} prevents its Defense from being lowered!`);
			return false;
		}
		// Keen Eye prevents accuracy from being lowered
		if (stat === 'accuracy' && ability === 'keeneye') {
			messageLog.push(`${pokemon.species}'s ${pokemon.ability} prevents its accuracy from being lowered!`);
			return false;
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

// Phase 1: Handle berry consumption with Cheek Pouch and Harvest tracking
export function consumeBerry(slot: ActivePokemonSlot, berryId: string, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	
	// Track for Harvest
	slot.consumedBerry = berryId;
	slot.harvestUsedThisTurn = false; // Reset for next turn
	
	// Remove the berry
	slot.pokemon.item = undefined;
	
	// Activate Unburden
	activateUnburden(slot, messageLog);
	
	// Phase 1: Cheek Pouch - Restores 1/3 HP when consuming a Berry
	if (ability === 'cheekpouch' && slot.pokemon.hp < slot.pokemon.maxHp) {
		const healAmount = Math.floor(slot.pokemon.maxHp / 3);
		slot.pokemon.hp = Math.min(slot.pokemon.maxHp, slot.pokemon.hp + healAmount);
		messageLog.push(`${slot.pokemon.species}'s Cheek Pouch restored its HP!`);
	}
}

export function applySynchronize(
	statusToInflict: Status,
	sourceSlot: ActivePokemonSlot,
	targetSlot: ActivePokemonSlot,
	battle: BattleState,
	messageLog: string[]
) {
	if (!targetSlot || targetSlot.pokemon.hp <= 0) return;

	const targetPokemon = targetSlot.pokemon;
	const targetAbility = toID(targetPokemon.ability || '');
	if (targetAbility === 'synchronize') {
		if (['psn', 'par', 'brn', 'tox'].includes(statusToInflict)) {
			// Check if the source can be afflicted
			if (!sourceSlot.status) {
				const sourceSpecies = Dex.species.get(sourceSlot.pokemon.species);
				let canBeAfflicted = true;

				if ((statusToInflict === 'brn' && sourceSpecies.types.includes('Fire')) ||
					(statusToInflict === 'par' && sourceSpecies.types.includes('Electric')) ||
					((statusToInflict === 'psn' || statusToInflict === 'tox') &&
						(sourceSpecies.types.includes('Poison') || sourceSpecies.types.includes('Steel')))) {
					canBeAfflicted = false;
				}

				if (canBeAfflicted && RPGAbilities.preventsStatus(sourceSlot.pokemon, statusToInflict, battle)) {
					canBeAfflicted = false;
				}

				if (canBeAfflicted) {
					sourceSlot.status = statusToInflict;
					if (statusToInflict === 'tox') {
						sourceSlot.toxicCounter = 1;
					}
					messageLog.push(`${targetPokemon.species}'s Synchronize afflicted ${sourceSlot.pokemon.species} with ${statusToInflict}!`);
				}
			}
		}
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
	const pokemon = slot.pokemon;

	// Phase 2: Emergency Exit and Wimp Out - check for auto-switch at low HP
	if (pokemon.hp > 0 && pokemon.hp <= pokemon.maxHp / 2) {
		const ability = toID(pokemon.ability || '');
		if (ability === 'emergencyexit' || ability === 'wimpout') {
			// Mark for switching (this would need to be handled by the battle flow)
			// For now, just add a message
			messageLog.push(`${pokemon.species}'s ${pokemon.ability} wants to switch out!`);
			// Note: Actual switching would require battle flow changes
		}
	}

	if (battle.magicRoomTurns > 0) return;

	if (pokemon.hp <= 0 || !pokemon.item) return;

	// Phase 1: Unnerve - Prevents opponents from eating berries
	const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
	const opponents = isPlayer ? battle.opponentSlots : battle.playerSlots;
	const hasUnnerve = opponents.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'unnerve');
	if (hasUnnerve && pokemon.item?.toLowerCase().includes('berry')) {
		return; // Cannot consume berries when opponent has Unnerve
	}

	let itemConsumed = false;
	let consumedItemName = '';

	const halfHP = pokemon.maxHp / 2;
	// Phase 1: Gluttony - Activates pinch berries at 50% HP instead of 25%
	const hasGluttony = toID(pokemon.ability || '') === 'gluttony';
	const quarterHP = hasGluttony ? halfHP : pokemon.maxHp / 4;

	if (pokemon.hp <= halfHP && !itemConsumed) {
		// Phase 3: Ripen - Doubles the effect of berries
		const hasRipen = toID(pokemon.ability || '') === 'ripen';
		const ripenMultiplier = hasRipen ? 2 : 1;

		let healAmount = 0;
		if (pokemon.item === 'berryjuice') {
			healAmount = 20 * ripenMultiplier;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} drank its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'oranberry') {
			healAmount = 10 * ripenMultiplier;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'goldberry') {
			healAmount = 30 * ripenMultiplier;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'sitrusberry') {
			healAmount = Math.floor(pokemon.maxHp / 4) * ripenMultiplier;
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
			// Phase 3: Ripen - Doubles the effect of berries
			const hasRipen = toID(pokemon.ability || '') === 'ripen';
			const ripenMultiplier = hasRipen ? 2 : 1;

			const oldHp = pokemon.hp;
			const healAmount = Math.floor(pokemon.maxHp / 2) * ripenMultiplier;
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${pokemon.hp - oldHp} HP!`);

			const berryData = BERRY_FLAVORS[pokemon.item];
			const natureData = NATURES[pokemon.nature];
			if (natureData && berryData) {
				const dislikedFlavor = natureData.minus ? NATURE_FLAVOR_PREFERENCES[natureData.minus] : null;
				if (dislikedFlavor && berryData.flavor === dislikedFlavor) {
					if (!slot.isConfused) {
						const ability = toID(pokemon.ability || '');
						// Own Tempo prevents confusion
						if (ability !== 'owntempo') {
							slot.isConfused = true;
							slot.confusionCounter = Math.floor(Math.random() * 3) + 2;
							messageLog.push(`${pokemon.species} became confused due to the berry's flavor!`);
						}
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

	if (itemConsumed && pokemon.item) {
		consumeBerry(slot, pokemon.item, messageLog);
	}
}

export function getAccuracyEvasionMultiplier(stage: number): number {
	if (stage > 0) {
		return (3 + stage) / 3;
	} else if (stage < 0) {
		return 3 / (3 - stage);
	}
	return 1;
}

export function createActivePokemonSlot(pokemon: RPGPokemon): ActivePokemonSlot {
	const ability = toID(pokemon.ability || '');
	return {
		pokemon,
		statStages: { ...INITIAL_STAT_STAGES },
		status: pokemon.status,
		sleepCounter: 0,
		isConfused: false,
		confusionCounter: 0,
		isProtected: false,
		protectSuccessCounter: 0,
		willFlinch: false,
		isLoafing: false,
		isTrapped: null,
		tauntTurns: 0,
		isSeeded: false,
		hasNightmare: false,
		isCursed: false,
		chargingMove: undefined,
		activeTurns: 1,
		lockedMove: undefined,
		lockedMoveCounter: 0,
		mustRecharge: false,
		uproarTurns: 0,
		lastDamageTaken: undefined,
		yawnCounter: undefined,
		substitute: undefined,
		disabledMove: undefined,
		encoreMove: undefined,
		isIngrained: false,
		hasAquaRing: false,
		focusEnergy: false,
		magnetRiseTurns: 0,
		telekinesisCounter: 0,
		isSmackedDown: false,
		lastMoveUsed: undefined,
		tormentActive: false,
		embargoTurns: 0,
		healBlockTurns: 0,
		isCharged: false,
		stockpileCount: 0,
		flashFireBoost: false,
		unburdenActive: false,
		analyticBoost: false,
		slowStartTurns: undefined,
		volatileTypes: undefined,
		isDisguised: ability === 'disguise' && pokemon.species.includes('Mimikyu'),
		lastMoveThatHitMe: undefined,
		terastallized: undefined,
		toxicCounter: pokemon.status === 'tox' ? 1 : undefined, // Initialize toxic counter for pre-existing badly poisoned status
	};
}

export function checkTrappingAbility(
	slotToSwitch: ActivePokemonSlot,
	battle: BattleState
): ActivePokemonSlot | null {
	const isPlayer = battle.playerSlots.includes(slotToSwitch);
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);
	const userPokemon = slotToSwitch.pokemon;
	const userAbility = toID(userPokemon.ability || '');
	const userTypes = Dex.species.get(userPokemon.species).types;

	// User's own Shadow Tag allows switching
	if (userAbility === 'shadowtag') return null;

	for (const oppSlot of opponentSlots) {
		const oppAbility = toID(oppSlot.pokemon.ability || '');
		if (!oppAbility) continue;

		switch (oppAbility) {
		case 'shadowtag':
			return oppSlot;

		case 'arenatrap':
			// Ghost-types are immune to Arena Trap
			if (RPGAbilities.isGrounded(userPokemon, battle) && !userTypes.includes('Ghost')) {
				return oppSlot;
			}
			break;

		case 'magnetpull':
			// Ghost-types are immune to Magnet Pull
			if (userTypes.includes('Steel') && !userTypes.includes('Ghost')) {
				return oppSlot;
			}
			break;
		}
	}

	return null;
}

export function getSlotFromIndex(battle: BattleState, slotIndex: number): ActivePokemonSlot | null {
	let slot: ActivePokemonSlot | null = null;
	if (slotIndex === 0) slot = battle.playerSlots[0];
	else if (slotIndex === 1) slot = battle.playerSlots[1];
	else if (slotIndex === 2) slot = battle.opponentSlots[0];
	else if (slotIndex === 3) slot = battle.opponentSlots[1];

	if (slot && slot.pokemon.hp > 0) {
		return slot;
	}
	return null;
}

export function getMoveTargets(attackerSlotIndex: number, targetSlotIndex: number, move: Move, battle: BattleState): ActivePokemonSlot[] {
	const targets: ActivePokemonSlot[] = [];
	const attackerSlot = getSlotFromIndex(battle, attackerSlotIndex);
	if (!attackerSlot) return [];

	const isPlayerAttacker = attackerSlotIndex <= 1;

	const pSlot0 = getSlotFromIndex(battle, 0);
	const pSlot1 = getSlotFromIndex(battle, 1);
	const oSlot0 = getSlotFromIndex(battle, 2);
	const oSlot1 = getSlotFromIndex(battle, 3);

	const allFoes = isPlayerAttacker ? [oSlot0, oSlot1] : [pSlot0, pSlot1];
	const allOthers = [pSlot0, pSlot1, oSlot0, oSlot1];

	const addTarget = (slot: ActivePokemonSlot | null) => {
		if (slot && slot.pokemon.hp > 0) {
			targets.push(slot);
		}
	};

	switch (move.target) {
	case 'normal':
	case 'any':
	case 'ally':
		const chosenTarget = getSlotFromIndex(battle, targetSlotIndex);
		addTarget(chosenTarget);
		break;

	case 'self':
		addTarget(attackerSlot);
		break;

	case 'allAdjacentFoes':
		allFoes.forEach(addTarget);
		break;

	case 'allAdjacent':
	case 'scripted':
		allOthers.forEach(slot => {
			if (slot && slot.pokemon.id !== attackerSlot.pokemon.id) {
				addTarget(slot);
			}
		});
		break;

	case 'randomNormal':
		const validFoes = allFoes.filter(s => s && s.pokemon.hp > 0) as ActivePokemonSlot[];
		if (validFoes.length > 0) {
			const randomFoe = validFoes[Math.floor(Math.random() * validFoes.length)];
			addTarget(randomFoe);
		}
		break;

	case 'foeSide':
		const primaryFoe = getSlotFromIndex(battle, isPlayerAttacker ? 2 : 0);
		if (primaryFoe) addTarget(primaryFoe);
		else addTarget(getSlotFromIndex(battle, isPlayerAttacker ? 3 : 1));
		break;

	case 'allySide':
		const primaryAlly = getSlotFromIndex(battle, isPlayerAttacker ? 0 : 2);
		if (primaryAlly) addTarget(primaryAlly);
		else addTarget(getSlotFromIndex(battle, isPlayerAttacker ? 1 : 3));
		break;

	case 'all':
		allOthers.forEach(addTarget);
		break;

	default:
		const defaultTarget = getSlotFromIndex(battle, targetSlotIndex);
		addTarget(defaultTarget);
		break;
	}

	return [...new Set(targets)];
}

export function handleMirrorHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mirrorherb') return;

	const isPlayer = battle.playerSlots.includes(slot);
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);

	let copiedAnyBoost = false;

	for (const oppSlot of opponentSlots) {
		const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;
		for (const stat of stats) {
			const oppStage = oppSlot.statStages[stat];
			if (oppStage > 0 && slot.statStages[stat] < 6) {
				const stagesToCopy = Math.min(oppStage, 6 - slot.statStages[stat]);
				slot.statStages[stat] = Math.min(6, slot.statStages[stat] + stagesToCopy);
				copiedAnyBoost = true;
			}
		}
	}

	if (copiedAnyBoost) {
		messageLog.push(`${slot.pokemon.species}'s Mirror Herb copied the stat boosts!`);
		slot.pokemon.item = undefined;
		activateUnburden(slot, messageLog);
	}
}
