import { Dex, toID } from '../../../sim/dex';
import { FS } from '../../../lib';
import { createPokemon, getPlayerData } from './core';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import { MANUAL_EVOLUTIONS } from './data-exp-evs-catch-rates';
import type { RPGPokemon, PlayerData, Stats, ActivePokemonSlot, Move, BattleState, Status, SideState } from './interface';
import { createSideState } from './interface';
import { VIABLE_HELD_ITEMS, BERRY_FLAVORS, NATURE_FLAVOR_PREFERENCES, ITEMS_DATABASE } from './items';
import { RPGAbilities } from './abilities';

export const INITIAL_STAT_STAGES = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

export const TYPE_CHART: { [type: string]: { superEffective: string[], notVeryEffective: string[], noEffect: string[] } } = {
	Normal: { superEffective: [], notVeryEffective: ['Rock', 'Steel'], noEffect: ['Ghost'] },
	Fire: { superEffective: ['Grass', 'Ice', 'Bug', 'Steel'], notVeryEffective: ['Fire', 'Water', 'Rock', 'Dragon'], noEffect: [] },
	Water: { superEffective: ['Fire', 'Ground', 'Rock'], notVeryEffective: ['Water', 'Grass', 'Dragon'], noEffect: [] },
	Grass: { superEffective: ['Water', 'Ground', 'Rock'], notVeryEffective: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], noEffect: [] },
	Electric: { superEffective: ['Water', 'Flying'], notVeryEffective: ['Grass', 'Electric', 'Dragon'], noEffect: ['Ground'] },
	Ice: { superEffective: ['Grass', 'Ground', 'Flying', 'Dragon'], notVeryEffective: ['Fire', 'Water', 'Ice', 'Steel'], noEffect: [] },
	Fighting: { superEffective: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], notVeryEffective: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], noEffect: ['Ghost'] },
	Poison: { superEffective: ['Grass', 'Fairy'], notVeryEffective: ['Poison', 'Ground', 'Rock', 'Ghost'], noEffect: ['Steel'] },
	Ground: { superEffective: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], notVeryEffective: ['Grass', 'Bug'], noEffect: ['Flying'] },
	Flying: { superEffective: ['Grass', 'Fighting', 'Bug'], notVeryEffective: ['Electric', 'Rock', 'Steel'], noEffect: [] },
	Psychic: { superEffective: ['Fighting', 'Poison'], notVeryEffective: ['Psychic', 'Steel'], noEffect: ['Dark'] },
	Bug: { superEffective: ['Grass', 'Psychic', 'Dark'], notVeryEffective: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], noEffect: [] },
	Rock: { superEffective: ['Fire', 'Ice', 'Flying', 'Bug'], notVeryEffective: ['Fighting', 'Ground', 'Steel'], noEffect: [] },
	Ghost: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Dark'], noEffect: ['Normal'] },
	Dragon: { superEffective: ['Dragon'], notVeryEffective: ['Steel'], noEffect: ['Fairy'] },
	Dark: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Fighting', 'Dark', 'Fairy'], noEffect: [] },
	Steel: { superEffective: ['Ice', 'Rock', 'Fairy'], notVeryEffective: ['Fire', 'Water', 'Electric', 'Steel'], noEffect: [] },
	Fairy: { superEffective: ['Fighting', 'Dragon', 'Dark'], notVeryEffective: ['Fire', 'Poison', 'Steel'], noEffect: [] },
};

export function getActiveSlots(
	slots: [ActivePokemonSlot | null, ActivePokemonSlot | null] | undefined
): ActivePokemonSlot[] {
	if (!slots) return [];
	return slots.filter(slot => slot && slot.pokemon.hp > 0) as ActivePokemonSlot[];
}

export function getActiveParty(battle: BattleState, player: PlayerData): RPGPokemon[] {
	return battle.overridePlayerParty || player.party;
}

export function createActivePokemonSlot(
	pokemon: RPGPokemon,
	savedState?: { terastallized?: string, sleepCounter?: number, toxicCounter?: number }
): ActivePokemonSlot {
	const ability = toID(pokemon.ability || '');
	return {
		pokemon,
		statStages: { ...INITIAL_STAT_STAGES },
		status: pokemon.status,
		sleepCounter: savedState?.sleepCounter || 0,
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
		terastallized: savedState?.terastallized || undefined,
		toxicCounter: savedState?.toxicCounter || (pokemon.status === 'tox' ? 1 : undefined),
		// Tier 1 move additions
		isAttracted: false,
		destinyBondActive: false,
		grudgeActive: false,
		sleepTalkMove: undefined,
	};
}

/**
 * Centralized function to set or remove an item.
 * Handles Unburden, Sticky Hold, and Symbiosis triggers automatically.
 */
export function setItem(
	slot: ActivePokemonSlot,
	newItem: string | undefined,
	sourceSlot?: ActivePokemonSlot,
	battle?: BattleState,
	messageLog?: string[]
): boolean {
	const pokemon = slot.pokemon;
	const oldItem = pokemon.item;
	const ability = toID(pokemon.ability || '');

	// Check Sticky Hold (Prevention)
	// Only applies if an item is being removed or swapped by another pokemon
	if (oldItem && newItem !== oldItem && sourceSlot && sourceSlot.pokemon.id !== pokemon.id) {
		// Mold Breaker can ignore Sticky Hold
		const effectiveAbility = RPGAbilities.getActiveAbility(pokemon, sourceSlot.pokemon);
		if (effectiveAbility === 'stickyhold') {
			if (messageLog) messageLog.push(`${pokemon.species}'s Sticky Hold prevents item theft!`);
			return false;
		}
	}

	// Apply the item change
	pokemon.item = newItem;

	// Trigger Unburden
	// Condition: Had an item, now doesn't, and ability is Unburden
	if (oldItem && !newItem && ability === 'unburden' && !slot.unburdenActive) {
		slot.unburdenActive = true;
		if (messageLog) messageLog.push(`${pokemon.species}'s Unburden activated!`);
	}

	// Reset Unburden if gaining an item
	if (!oldItem && newItem && slot.unburdenActive) {
		slot.unburdenActive = false;
	}

	// TODO: Add Symbiosis check here later (checks ally slot for item pass)

	return true;
}

export function applyStatChange(
	slot: ActivePokemonSlot,
	stat: keyof ActivePokemonSlot['statStages'],
	value: number,
	battle: BattleState,
	messageLog: string[],
	source: ActivePokemonSlot | null = null
): boolean {
	const pokemon = slot.pokemon;
	// Use getActiveAbility to allow Mold Breaker to ignore immunity abilities (like Clear Body)
	const ability = RPGAbilities.getActiveAbility(pokemon, source?.pokemon);
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
		// Mirror Armor: Reflects stat drops from opponents
		if (!isSelf && ability === 'mirrorarmor') {
			messageLog.push(`${pokemon.species}'s Mirror Armor reflected the stat drop!`);
			if (source) {
				// Pass null as source to prevent infinite reflection if both have Mirror Armor
				applyStatChange(source, stat, actualValue, battle, messageLog, null);
			}
			return false;
		}

		// Mist protection
		if (!isSelf) {
			const isPlayer = battle.playerSide.slots.some(s => s?.pokemon.id === pokemon.id);
			const sideMist = isPlayer ? battle.playerSide.mistTurns : battle.opponentSide.mistTurns;

			if (sideMist > 0) {
				messageLog.push(`${pokemon.species} is protected by the mist!`);
				return false;
			}
		}

		if (!isSelf && battle.magicRoomTurns === 0 && pokemon.item === 'clearamulet') {
			messageLog.push(`${pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
			return false;
		}

		const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
		if (blockAbilities.includes(ability)) {
			messageLog.push(`${pokemon.species}'s ${ability} prevents its stats from being lowered!`);
			return false;
		}
		if (stat === 'atk' && ability === 'hypercutter') {
			messageLog.push(`${pokemon.species}'s ${ability} prevents its Attack from being lowered!`);
			return false;
		}
		if (ability === 'flowerveil') {
			const species = Dex.species.get(pokemon.species);
			if (species.types.includes('Grass')) {
				messageLog.push(`${pokemon.species}'s ${ability} prevents its stats from being lowered!`);
				return false;
			}
		}
		const species = Dex.species.get(pokemon.species);
		if (species.types.includes('Grass')) {
			const isPlayerPokemon = battle.playerSide.slots.some(s => s?.pokemon.id === pokemon.id);
			const allies = isPlayerPokemon ? battle.playerSide.slots : battle.opponentSide.slots;
			if (allies.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'flowerveil' && s.pokemon.id !== pokemon.id)) {
				const ignoresFlowerVeil = source && ['moldbreaker', 'teravolt', 'turboblaze'].includes(toID(source.pokemon.ability || ''));
				if (!ignoresFlowerVeil) {
					messageLog.push(`Flower Veil protects ${pokemon.species} from stat drops!`);
					return false;
				}
			}
		}
		if (stat === 'def' && ability === 'bigpecks') {
			messageLog.push(`${pokemon.species}'s ${ability} prevents its Defense from being lowered!`);
			return false;
		}
		if (stat === 'accuracy' && ability === 'keeneye') {
			messageLog.push(`${pokemon.species}'s ${ability} prevents its accuracy from being lowered!`);
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

		// Eject Pack Logic
		if (battle.magicRoomTurns === 0 && pokemon.item === 'ejectpack' && !battle.pendingPivot && !battle.aiPendingPivot) {
			let slotIndex = battle.playerSide.slots.indexOf(slot);
			let isPlayer = true;
			if (slotIndex === -1) {
				slotIndex = battle.opponentSide.slots.indexOf(slot);
				isPlayer = false;
			}

			if (slotIndex !== -1) {
				// Check if there are available replacements before setting up pivot
				const party = isPlayer ? (battle.overridePlayerParty || getPlayerData(battle.playerId).party) : battle.opponentParty;
				const slots = isPlayer ? battle.playerSide.slots : battle.opponentSide.slots;

				const availableReplacements = party.filter(p =>
					p.hp > 0 && !slots.some(s => s?.pokemon.id === p.id)
				);

				if (availableReplacements.length === 0) {
					messageLog.push(`But it failed! (No Pokémon to switch to!)`);
				} else {
					messageLog.push(`${pokemon.species} is being sent back due to its Eject Pack!`);
					setItem(slot, undefined, undefined, battle, messageLog);

					if (isPlayer) {
						battle.pendingPivot = { slotIndex, slot, isBatonPass: false };
						battle.playerSide.slots[slotIndex as 0 | 1] = null;
					} else {
						battle.aiPendingPivot = { slotIndex, slot, isBatonPass: false };
						battle.opponentSide.slots[slotIndex as 0 | 1] = null;
					}
				}
			}
		}

		// Handle White Herb
		if (battle.magicRoomTurns === 0 && pokemon.item === 'whiteherb') {
			let restored = false;
			const stats = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'] as const;
			for (const s of stats) {
				if (slot.statStages[s] < 0) {
					slot.statStages[s] = 0;
					restored = true;
				}
			}
			if (restored) {
				messageLog.push(`${pokemon.species} returned its status to normal using its White Herb!`);
				setItem(slot, undefined, undefined, battle, messageLog);
			}
		}

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

export function getAccuracyEvasionMultiplier(stage: number): number {
	if (stage > 0) {
		return (3 + stage) / 3;
	} else if (stage < 0) {
		return 3 / (3 - stage);
	}
	return 1;
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

export function getSlotFromIndex(battle: BattleState, slotIndex: number): ActivePokemonSlot | null {
	let slot: ActivePokemonSlot | null = null;
	if (slotIndex === 0) slot = battle.playerSide.slots[0];
	else if (slotIndex === 1) slot = battle.playerSide.slots[1];
	else if (slotIndex === 2) slot = battle.opponentSide.slots[0];
	else if (slotIndex === 3) slot = battle.opponentSide.slots[1];

	if (slot && slot.pokemon.hp > 0) {
		return slot;
	}
	return null;
}

export function checkTrappingAbility(
	slotToSwitch: ActivePokemonSlot,
	battle: BattleState
): ActivePokemonSlot | null {
	const isPlayer = battle.playerSide.slots.includes(slotToSwitch);
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSide.slots : battle.playerSide.slots);
	const userPokemon = slotToSwitch.pokemon;
	const userAbility = toID(userPokemon.ability || '');
	const userTypes = Dex.species.get(userPokemon.species).types;

	if (userAbility === 'shadowtag') return null;

	for (const oppSlot of opponentSlots) {
		const oppAbility = toID(oppSlot.pokemon.ability || '');
		if (!oppAbility) continue;

		switch (oppAbility) {
		case 'shadowtag':
			return oppSlot;

		case 'arenatrap':
			if (RPGAbilities.isGrounded(userPokemon, battle) && !userTypes.includes('Ghost')) {
				return oppSlot;
			}
			break;

		case 'magnetpull':
			if (userTypes.includes('Steel') && !userTypes.includes('Ghost')) {
				return oppSlot;
			}
			break;
		}
	}

	return null;
}

export function handleHPDropEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	const pokemon = slot.pokemon;

	if (pokemon.hp > 0 && pokemon.hp <= pokemon.maxHp / 2) {
		const ability = toID(pokemon.ability || '');
		if (ability === 'emergencyexit' || ability === 'wimpout') {
			messageLog.push(`${pokemon.species}'s ${pokemon.ability} wants to switch out!`);
		}
	}

	if (battle.magicRoomTurns > 0) return;

	if (pokemon.hp <= 0 || !pokemon.item) return;

	// Handle status items immediately in case damage triggered them
	checkStatusHealBerries(slot, battle, messageLog);

	const isPlayer = battle.playerSide.slots.some(s => s?.pokemon.id === pokemon.id);
	const opponents = isPlayer ? battle.opponentSide.slots : battle.playerSide.slots;
	const hasUnnerve = opponents.some(s => s && s.pokemon.hp > 0 &&
		['unnerve', 'asoneglastrier', 'asonespectrier'].includes(toID(s.pokemon.ability || '')));
	if (hasUnnerve && pokemon.item?.toLowerCase().includes('berry')) {
		return;
	}

	let itemConsumed = false;
	let consumedItemName = '';

	const halfHP = pokemon.maxHp / 2;
	const hasGluttony = toID(pokemon.ability || '') === 'gluttony';
	const quarterHP = hasGluttony ? halfHP : pokemon.maxHp / 4;

	if (pokemon.hp <= halfHP && !itemConsumed) {
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

export function checkStatusHealBerries(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (!slot.pokemon.item || battle.magicRoomTurns > 0) return;

	const pokemon = slot.pokemon;
	const item = pokemon.item;

	// Check Unnerve
	const isPlayer = battle.playerSide.slots.some(s => s?.pokemon.id === pokemon.id);
	const opponents = isPlayer ? battle.opponentSide.slots : battle.playerSide.slots;
	const hasUnnerve = opponents.some(s => s && s.pokemon.hp > 0 &&
		['unnerve', 'asoneglastrier', 'asonespectrier'].includes(toID(s.pokemon.ability || '')));

	if (hasUnnerve && item.toLowerCase().includes('berry')) return;

	let itemConsumed = false;
	const itemName = ITEMS_DATABASE[item]?.name || item;

	if (slot.status) {
		if (item === 'cheriberry' && slot.status === 'par') {
			slot.status = null;
			messageLog.push(`${pokemon.species} ate its ${itemName} and was cured of paralysis!`);
			itemConsumed = true;
		} else if (item === 'chestoberry' && slot.status === 'slp') {
			slot.status = null;
			slot.sleepCounter = 0;
			messageLog.push(`${pokemon.species} ate its ${itemName} and woke up!`);
			itemConsumed = true;
		} else if (item === 'pechaberry' && (slot.status === 'psn' || slot.status === 'tox')) {
			slot.status = null;
			slot.toxicCounter = undefined;
			messageLog.push(`${pokemon.species} ate its ${itemName} and was cured of poison!`);
			itemConsumed = true;
		} else if (item === 'rawstberry' && slot.status === 'brn') {
			slot.status = null;
			messageLog.push(`${pokemon.species} ate its ${itemName} and healed its burn!`);
			itemConsumed = true;
		} else if (item === 'aspearberry' && slot.status === 'frz') {
			slot.status = null;
			messageLog.push(`${pokemon.species} ate its ${itemName} and thawed out!`);
			itemConsumed = true;
		} else if (item === 'lumberry') {
			const statusMap: Record<string, string> = {
				par: 'paralysis', slp: 'sleep', psn: 'poison', tox: 'poison', brn: 'burn', frz: 'freeze',
			};
			messageLog.push(`${pokemon.species} ate its ${itemName} and was cured of ${statusMap[slot.status] || 'status'}!`);
			slot.status = null;
			slot.sleepCounter = 0;
			slot.toxicCounter = undefined;
			itemConsumed = true;
		}
	}

	if (slot.isConfused && !itemConsumed) {
		if (item === 'persimberry' || item === 'lumberry') {
			slot.isConfused = false;
			slot.confusionCounter = 0;
			messageLog.push(`${pokemon.species} ate its ${itemName} and snapped out of confusion!`);
			itemConsumed = true;
		}
	}

	if (itemConsumed) {
		consumeBerry(slot, item, messageLog);
	}
}

export function handleLeppaBerry(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (!slot.pokemon.item || slot.pokemon.item !== 'leppaberry' || battle.magicRoomTurns > 0) return;

	// Check Unnerve
	const isPlayer = battle.playerSide.slots.some(s => s?.pokemon.id === slot.pokemon.id);
	const opponents = isPlayer ? battle.opponentSide.slots : battle.playerSide.slots;
	const hasUnnerve = opponents.some(s => s && s.pokemon.hp > 0 &&
		['unnerve', 'asoneglastrier', 'asonespectrier'].includes(toID(s.pokemon.ability || '')));
	if (hasUnnerve) return;

	const moves = slot.pokemon.moves;
	let moveRestored: string | null = null;

	for (const move of moves) {
		if (move.pp === 0) {
			move.pp = 10;
			const moveData = getMove(move.id);
			moveRestored = moveData.name;
			break; // Restore only the first 0 PP move found
		}
	}

	if (moveRestored) {
		messageLog.push(`${slot.pokemon.species} ate its Leppa Berry and restored PP to ${moveRestored}!`);
		consumeBerry(slot, 'leppaberry', messageLog);
	}
}

export function activateUnburden(slot: ActivePokemonSlot, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	if (ability === 'unburden' && !slot.unburdenActive) {
		slot.unburdenActive = true;
		messageLog.push(`${slot.pokemon.species}'s Unburden activated!`);
	}
}

export function consumeBerry(slot: ActivePokemonSlot, berryId: string, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');

	slot.consumedBerry = berryId;
	slot.harvestUsedThisTurn = false;

	if (ability === 'cudchew') {
		slot.cudChewBerry = berryId;
	}

	// Use setItem to remove the berry and trigger Unburden
	setItem(slot, undefined, undefined, undefined, messageLog);

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
			if (!sourceSlot.status) {
				const sourceSpecies = Dex.species.get(sourceSlot.pokemon.species);
				let canBeAfflicted = true;

				if ((statusToInflict === 'brn' && sourceSpecies.types.includes('Fire')) ||
					(statusToInflict === 'par' && sourceSpecies.types.includes('Electric')) ||
					((statusToInflict === 'psn' || statusToInflict === 'tox') &&
						(sourceSpecies.types.includes('Poison') || sourceSpecies.types.includes('Steel')))) {
					canBeAfflicted = false;
				}

				if (canBeAfflicted && RPGAbilities.preventsStatus(sourceSlot.pokemon, statusToInflict, battle, targetPokemon)) {
					canBeAfflicted = false;
				}

				if (canBeAfflicted) {
					sourceSlot.status = statusToInflict;
					if (statusToInflict === 'tox') {
						sourceSlot.toxicCounter = 1;
					}
					messageLog.push(`${targetPokemon.species}'s Synchronize afflicted ${sourceSlot.pokemon.species} with ${statusToInflict}!`);
					checkStatusHealBerries(sourceSlot, battle, messageLog);
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

		setItem(slot, undefined, undefined, battle, messageLog);

		return true;
	}

	return false;
}

export function handleMirrorHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mirrorherb') return;

	const isPlayer = battle.playerSide.slots.includes(slot);
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSide.slots : battle.playerSide.slots);

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
		setItem(slot, undefined, undefined, battle, messageLog);
	}
}

export function calculateTotalExpForLevel(growthRate: string, level: number): number {
	if (level < 0) return 0;
	if (level === 0) return 0;
	if (!Number.isInteger(level)) level = Math.floor(level);

	const n = level;
	let result: number;

	switch (growthRate) {
	case 'Slow':
		result = Math.floor((5 * n ** 3) / 4);
		break;
	case 'Medium Fast':
		result = Math.floor(n ** 3);
		break;
	case 'Fast':
		result = Math.floor((4 * n ** 3) / 5);
		break;
	case 'Medium Slow':
		result = Math.floor(((6 / 5) * n ** 3) - (15 * n ** 2) + (100 * n) - 140);
		break;
	case 'Erratic':
		if (n <= 50) result = Math.floor((n ** 3 * (100 - n)) / 50);
		else if (n <= 68) result = Math.floor((n ** 3 * (150 - n)) / 100);
		else if (n <= 98) result = Math.floor((n ** 3 * Math.floor((1911 - 10 * n) / 3)) / 500);
		else result = Math.floor((n ** 3 * (160 - n)) / 100);
		break;
	case 'Fluctuating':
		if (n <= 15) result = Math.floor(n ** 3 * ((Math.floor((n + 1) / 3) + 24) / 50));
		else if (n <= 36) result = Math.floor(n ** 3 * ((n + 14) / 50));
		else result = Math.floor(n ** 3 * ((Math.floor(n / 2) + 32) / 50));
		break;
	default:
		result = Math.floor(n ** 3);
	}

	return Math.max(0, result);
}

export const NATURES: Record<string, { plus: keyof Stats, minus: keyof Stats } | null> = {
	'Adamant': { plus: 'atk', minus: 'spa' },
	'Bashful': null,
	'Brave': { plus: 'atk', minus: 'spe' },
	'Bold': { plus: 'def', minus: 'atk' },
	'Calm': { plus: 'spd', minus: 'atk' },
	'Careful': { plus: 'spd', minus: 'spa' },
	'Docile': null,
	'Gentle': { plus: 'spd', minus: 'def' },
	'Hardy': null,
	'Hasty': { plus: 'spe', minus: 'def' },
	'Impish': { plus: 'def', minus: 'spa' },
	'Jolly': { plus: 'spe', minus: 'spa' },
	'Lax': { plus: 'def', minus: 'spd' },
	'Lonely': { plus: 'atk', minus: 'def' },
	'Mild': { plus: 'spa', minus: 'def' },
	'Modest': { plus: 'spa', minus: 'atk' },
	'Naive': { plus: 'spe', minus: 'spd' },
	'Naughty': { plus: 'atk', minus: 'spd' },
	'Quiet': { plus: 'spa', minus: 'spe' },
	'Quirky': null,
	'Rash': { plus: 'spa', minus: 'spd' },
	'Relaxed': { plus: 'def', minus: 'spe' },
	'Sassy': { plus: 'spd', minus: 'spe' },
	'Serious': null,
	'Timid': { plus: 'spe', minus: 'atk' },
};

export const NATURE_LIST = Object.keys(NATURES);

export function calculateStats(
	species: any,
	level: number,
	nature: string,
	ivs: Record<keyof Stats, number>,
	evs: Record<keyof Stats, number>
): Stats {
	const stats: Stats = { maxHp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	stats.maxHp = Math.floor(((2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level) / 100) + level + 10;
	stats.atk = Math.floor(((2 * species.baseStats.atk + ivs.atk + Math.floor(evs.atk / 4)) * level) / 100) + 5;
	stats.def = Math.floor(((2 * species.baseStats.def + ivs.def + Math.floor(evs.def / 4)) * level) / 100) + 5;
	stats.spa = Math.floor(((2 * species.baseStats.spa + ivs.spa + Math.floor(evs.spa / 4)) * level) / 100) + 5;
	stats.spd = Math.floor(((2 * species.baseStats.spd + ivs.spd + Math.floor(evs.spd / 4)) * level) / 100) + 5;
	stats.spe = Math.floor(((2 * species.baseStats.spe + ivs.spe + Math.floor(evs.spe / 4)) * level) / 100) + 5;

	const natureEffect = NATURES[nature];
	if (natureEffect) {
		stats[natureEffect.plus] = Math.floor(stats[natureEffect.plus] * 110 / 100);
		stats[natureEffect.minus] = Math.floor(stats[natureEffect.minus] * 90 / 100);
	}
	return stats;
}

export function getMove(moveId: string): any {
	return Dex.moves.get(moveId);
}

export function levelUp(pokemon: RPGPokemon): string[] {
	const levelUpMessages: string[] = [];
	pokemon.level++;
	levelUpMessages.push(`**${pokemon.species} grew to Level ${pokemon.level}!**`);
	const oldStats = { ...pokemon };
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

	const hpPercentage = pokemon.hp / pokemon.maxHp;

	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;

	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * hpPercentage));

	pokemon.expToNextLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level + 1);
	return levelUpMessages;
}

export function handleLearningMoves(player: PlayerData, pokemon: RPGPokemon): { messages: string[] } {
	const messages: string[] = [];
	const speciesId = toID(pokemon.species);
	const manualLearnset = MANUAL_LEARNSETS[speciesId];
	if (!manualLearnset?.levelup) return { messages };

	const movesLearnedAtThisLevel = manualLearnset.levelup
		.filter(learnable => learnable.level === pokemon.level)
		.map(learnable => toID(learnable.move))
		.filter(moveId => {
			const moveData = getMove(moveId);
			return moveData.exists && !pokemon.moves.some(m => m.id === moveId);
		});

	if (movesLearnedAtThisLevel.length === 0) return { messages };

	const openMoveSlots = 4 - pokemon.moves.length;
	const movesToQueue: string[] = [];

	if (openMoveSlots > 0) {
		const movesToAutoLearn = movesLearnedAtThisLevel.slice(0, openMoveSlots);
		for (const moveId of movesToAutoLearn) {
			const moveData = getMove(moveId);
			pokemon.moves.push({ id: moveId, pp: moveData.pp || 5 });
			messages.push(`**${pokemon.species} learned ${moveData.name}!**`);
		}
	}

	if (movesLearnedAtThisLevel.length > openMoveSlots) {
		const remainingMoves = movesLearnedAtThisLevel.slice(openMoveSlots);
		movesToQueue.push(...remainingMoves);
	}

	if (movesToQueue.length > 0) {
		if (!player.pendingMoveLearnQueue) {
			player.pendingMoveLearnQueue = [];
		}

		const existingEntry = player.pendingMoveLearnQueue.find(q => q.pokemonId === pokemon.id);
		if (existingEntry) {
			existingEntry.moveIds.push(...movesToQueue);
		} else {
			player.pendingMoveLearnQueue.push({ pokemonId: pokemon.id, moveIds: movesToQueue });
		}
	}

	return { messages };
}

export interface CheckEvolutionContext {
	room: { add: (message: string) => { update: () => void } };
	user: { name: string };
}

export function checkEvolution(
	player: PlayerData,
	pokemon: RPGPokemon,
	context: CheckEvolutionContext,
	itemUsed?: string
): string | null {
	const speciesId = toID(pokemon.species);
	const evolutionList = MANUAL_EVOLUTIONS[speciesId];

	if (!evolutionList) return null;
	if (pokemon.item === 'everstone') return null;

	let foundEvo = null;

	for (const evoData of evolutionList) {
		const isLevelEvo = itemUsed === undefined && pokemon.level >= evoData.evoLevel && !evoData.evoItem;
		const isItemEvo = itemUsed !== undefined && evoData.evoItem === itemUsed;
		const isLevelItemEvo = itemUsed === evoData.evoItem && pokemon.level >= evoData.evoLevel;

		if (itemUsed) {
			if (isItemEvo || isLevelItemEvo) {
				foundEvo = evoData;
				break;
			}
		} else if (isLevelEvo) {
			foundEvo = evoData;
			break;
		}
	}

	if (!foundEvo) return null;

	const evoSpecies = Dex.species.get(foundEvo.evoTo);
	if (!evoSpecies.exists) return null;
	const oldSpeciesName = pokemon.species;
	pokemon.species = evoSpecies.name;

	if (pokemon.nickname === oldSpeciesName) {
		pokemon.nickname = evoSpecies.name;
	}

	const newStats = calculateStats(evoSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

	const hpPercentage = pokemon.hp / pokemon.maxHp;

	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;

	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * hpPercentage));

	const { messages: evoMoveMessages } = handleLearningMoves(player, pokemon);
	let evoMessage = `**What?! ${oldSpeciesName} is evolving!**<br>...Congratulations! Your ${oldSpeciesName} evolved into **${evoSpecies.name}**!`;
	if (evoMoveMessages.length > 0) evoMessage += `<br>${evoMoveMessages.join('<br>')}`;

	context.room.add(`|c|~RPG Bot|What?! ${context.user.name}'s ${oldSpeciesName} is evolving!`).update();
	return evoMessage;
}

function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export function assignRandomMoveset(pokemon: RPGPokemon): void {
	const speciesId = toID(pokemon.species);
	const learnsetData = MANUAL_LEARNSETS[speciesId];

	if (!learnsetData) {
		if (pokemon.moves.length === 0) {
			const tackle = getMove('tackle');
			pokemon.moves = [{ id: 'tackle', pp: tackle.pp || 35 }];
		}
		return;
	}

	const allMoveIds: string[] = [];

	if (learnsetData.levelup) {
		for (const entry of learnsetData.levelup) {
			allMoveIds.push(toID(entry.move));
		}
	}

	if (learnsetData.tm) {
		allMoveIds.push(...learnsetData.tm.map(toID));
	}

	if (learnsetData.tutor) {
		allMoveIds.push(...learnsetData.tutor.map(toID));
	}

	if (learnsetData.egg) {
		allMoveIds.push(...learnsetData.egg.map(toID));
	}

	const uniqueMoveIds = [...new Set(allMoveIds)];
	const validMoves: Move[] = [];
	for (const moveId of uniqueMoveIds) {
		const moveData = getMove(moveId) as Move;
		if (moveData?.exists) {
			if (moveData.category === 'Status' && moveData.basePower === 0 && !moveData.status && !moveData.boosts && !moveData.volatileStatus && !moveData.sideCondition && !moveData.pseudoWeather && !moveData.weather && !moveData.terrain && !moveData.flags?.heal) {
				continue;
			}
			validMoves.push(moveData);
		}
	}

	if (validMoves.length === 0) {
		const tackle = getMove('tackle');
		pokemon.moves = [{ id: 'tackle', pp: tackle.pp || 35 }];
		return;
	}

	const damagingMoves = validMoves.filter(m => m.category === 'Physical' || m.category === 'Special');
	const statusMoves = validMoves.filter(m => m.category === 'Status');

	shuffleArray(damagingMoves);
	shuffleArray(statusMoves);

	const newMoveset: Move[] = [];

	const statusMoveCount = statusMoves.length > 0 ? 1 : 0;
	const damagingMoveCount = 4 - statusMoveCount;

	newMoveset.push(...damagingMoves.slice(0, damagingMoveCount));

	newMoveset.push(...statusMoves.slice(0, statusMoveCount));

	if (newMoveset.length < 4 && statusMoves.length > statusMoveCount) {
		const needed = 4 - newMoveset.length;
		newMoveset.push(...statusMoves.slice(statusMoveCount, statusMoveCount + needed));
	}

	if (newMoveset.length < 4 && damagingMoves.length > damagingMoveCount) {
		const needed = 4 - newMoveset.length;
		newMoveset.push(...damagingMoves.slice(damagingMoveCount, damagingMoveCount + needed));
	}

	if (newMoveset.length === 0) {
		const tackle = getMove('tackle');
		pokemon.moves = [{ id: 'tackle', pp: tackle.pp || 35 }];
		return;
	}

	pokemon.moves = newMoveset.map(move => ({
		id: move.id,
		pp: move.pp || 5,
	}));
}

export function generateRandomTeam(count: number, level: number): RPGPokemon[] {
	const allSpecies = Dex.species.all();

	const viableTiers = ['OU', 'UU', 'UUBL', 'RU', 'RUBL', 'NU', 'NUBL', 'PU', 'PUBL'];
	const viableSpecies = allSpecies.filter(species => {
		const isFullyEvolved = !species.nfe && (!species.evos || species.evos.length === 0);

		const isInViableTier = viableTiers.includes(species.tier);

		const hasManualLearnset = !!MANUAL_LEARNSETS[species.id];

		return isFullyEvolved && isInViableTier && hasManualLearnset;
	});

	if (viableSpecies.length === 0) {
		const fallback = createPokemon('pikachu', level);
		assignRandomMoveset(fallback);
		fallback.item = 'lightball';
		return [fallback];
	}

	const team: RPGPokemon[] = [];

	while (team.length < count) {
		const randomSpecies = viableSpecies[Math.floor(Math.random() * viableSpecies.length)];

		const pokemon = createPokemon(randomSpecies.id, level);

		const stats: (keyof typeof pokemon.evs)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
		shuffleArray(stats);

		pokemon.evs[stats[0]] = 252;
		pokemon.evs[stats[1]] = 252;
		pokemon.evs[stats[2]] = 4;

		const speciesData = Dex.species.get(pokemon.species);
		const newStats = calculateStats(speciesData, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp;
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		assignRandomMoveset(pokemon);

		pokemon.item = VIABLE_HELD_ITEMS[Math.floor(Math.random() * VIABLE_HELD_ITEMS.length)];

		team.push(pokemon);
	}

	return team;
}

export const RPGUtils = {
	calculateTotalExpForLevel,
	calculateStats,
	getMove,
	levelUp,
	handleLearningMoves,
	checkEvolution,
	NATURES,
	NATURE_LIST,
	checkStatusHealBerries,
	handleLeppaBerry,
	setItem,
};

/**
 * Creates a new BattleState with the unified SideState structure.
 */
export function createBattleState(config: {
	playerId: string,
	zoneId: string,
	battleType: BattleState['battleType'],
	opponentName: string,
	opponentParty: RPGPokemon[],
	opponentMoney: number,
	trainerId?: string,
	weather?: BattleState['weather'],
	locationWeather?: BattleState['locationWeather'],
	floor?: number,
	overridePlayerParty?: RPGPokemon[] | null,
	battleTowerFormat?: string,
}): BattleState {
	const playerSide = createSideState();
	const opponentSide = createSideState();

	return {
		playerId: config.playerId,
		turn: 0,
		zoneId: config.zoneId,

		// Unified side states
		playerSide,
		opponentSide,

		// Weather and field effects
		weather: config.weather,
		locationWeather: config.locationWeather,
		trickRoomTurns: 0,
		magicRoomTurns: 0,
		wonderRoomTurns: 0,
		terrain: undefined,
		gravityTurns: 0,
		mudSportTurns: 0,
		waterSportTurns: 0,
		fairyLockTurns: 0,
		ionDelugeTurns: 0,

		// Battle meta
		forceEnd: false,
		battleEnded: false,
		battleResult: undefined,
		battleType: config.battleType,
		opponentName: config.opponentName,
		opponentParty: config.opponentParty,
		opponentMoney: config.opponentMoney,
		trainerId: config.trainerId,

		// Switches and pivots
		playerShouldSwitch: undefined,
		pendingPivot: undefined,
		aiPendingPivot: undefined,
		pendingActions: {},

		// Battle log and persistent state
		battleLog: [],
		persistentPokemonState: {},

		// Battle Tower specific
		floor: config.floor ?? 0,
		overridePlayerParty: config.overridePlayerParty ?? null,
		battleTowerFormat: config.battleTowerFormat,
	};
}

export default RPGUtils;
