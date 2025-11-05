/*
* Pokemon Showdown
* RPG Battle Effects
*
* This file contains all end-of-turn effects, status effects,
* battle flow control, and utility functions for battles.
*
* Separated from battle-core.ts to reduce file size.
*/

import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { getActiveSlots, calculateTotalExpForLevel, calculateStats, getMove, levelUp, handleLearningMoves, checkEvolution, NATURES, type CheckEvolutionContext } from './utils';
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState, Stats, Move, AbilityContext } from './interface';
import { ITEMS_DATABASE, ITEM_PRICES } from './items';
import { BERRY_FLAVORS, NATURE_FLAVOR_PREFERENCES, TYPE_RESIST_BERRIES, TYPE_CHART } from './data';
import { getPlayerData, activeBattles, playerData } from './core';
import {
	generateBattleHTML,
	generateDefeatHTML,
	generateMoveLearnHTML,
	generateTrainerVictoryHTML,
	generateVictoryHTML,
	generatePivotSwitchHTML,
	generateFaintSwitchHTML
} from './html';
import { MANUAL_CATCH_RATES } from './MANUAL_CATCH_RATES';
import { MANUAL_BASE_EXP } from './MANUAL_BASE_EXP';
import { MANUAL_EV_YIELDS } from './MANUAL_EV_YIELDS';

// Import functions from battle-core that are used in this file
import {
	activateUnburden,
	applyStatChange,
	applySynchronize,
	checkMentalHerb,
	createActivePokemonSlot,
	executeMove,
	gainExperience,
	getCustomEffectiveness,
	getStatMultiplier,
	handleDamagingMove,
	handleHPDropEffects,
	handleStatusMove,
	saveBattleStatus,
} from './battle-core';

export function applyEOTStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;
	const status = slot.status;

	if (status === 'brn') {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was hurt by its burn!</span>`);
	} else if (status === 'psn') {
		if (!RPGAbilities.handlePoisonHeal(slot, messageLog)) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was hurt by its poison!</span>`);
		}
	}
}

export function applyEOTItemEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	if (slot.pokemon.hp <= 0 || battle.magicRoomTurns > 0) return false;

	const pokemon = slot.pokemon;
	const speciesData = Dex.species.get(pokemon.species);

	if (!slot.status) {
		if (pokemon.item === 'flameorb' && !speciesData.types.includes('Fire')) {
			slot.status = 'brn';
			messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was burned by its Flame Orb!</span>`);
		} else if (pokemon.item === 'toxicorb' && !speciesData.types.includes('Poison') && !speciesData.types.includes('Steel')) {
			slot.status = 'psn';
			messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was badly poisoned by its Toxic Orb!</span>`);
		}
	}

	if (slot.status && pokemon.item === 'lumberry') {
		slot.status = null;
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> ate its <strong>Lum Berry</strong> and cured its status condition!</span>`);
		pokemon.item = undefined;
		activateUnburden(slot, messageLog);
		return true;
	}

	if (pokemon.item === 'leftovers' && pokemon.hp < pokemon.maxHp) {
		pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Leftovers</strong>!</span>`);
	} else if (pokemon.item === 'blacksludge') {
		if (speciesData.types.includes('Poison')) {
			if (pokemon.hp < pokemon.maxHp) {
				pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
				messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Black Sludge</strong>!</span>`);
			}
		} else if (RPGAbilities.takesIndirectDamage(pokemon)) {
			pokemon.hp = Math.max(0, pokemon.hp - Math.max(1, Math.floor(pokemon.maxHp / 8)));
			messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Black Sludge</strong>!</span>`);
		}
	} else if (pokemon.item === 'stickybarb') {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			pokemon.hp = Math.max(0, pokemon.hp - Math.floor(pokemon.maxHp / 8));
			messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Sticky Barb</strong>!</span>`);
		}
	}

	return false;
}

export function applyEOTVolatileStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;

	if (slot.isCursed) {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is afflicted by the curse!`);
		}
	}
	if (pokemon.hp <= 0) return;

	if (slot.hasNightmare) {
		if (slot.status === 'slp') {
			if (RPGAbilities.takesIndirectDamage(pokemon)) {
				const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
				pokemon.hp = Math.max(0, pokemon.hp - damage);
				messageLog.push(`${pokemon.species} is locked in a nightmare!`);
			}
		} else {
			slot.hasNightmare = false;
		}
	}
	if (pokemon.hp <= 0) return;

	if (slot.isTrapped) {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is hurt by the trap!`);
		}
	}
}

export function applyEOTHealingEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;

	if ((slot.healBlockTurns || 0) > 0) return;

	if (slot.hasAquaRing && pokemon.hp < pokemon.maxHp) {
		const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
		messageLog.push(`${pokemon.species} was healed by Aqua Ring!`);
	}

	if (slot.isIngrained && pokemon.hp < pokemon.maxHp) {
		const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
		messageLog.push(`${pokemon.species} absorbed nutrients with its roots!`);
	}
}

export function applyEOTLeechSeedDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;

	if (slot.isSeeded) {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			const drainAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - drainAmount);
			messageLog.push(`${pokemon.species}'s health was sapped by Leech Seed!`);

			const isPlayer = battle.playerSlots.includes(slot);
			const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);
			const opponentToHeal = opponentSlots[0];

			if (opponentToHeal && opponentToHeal.pokemon.hp > 0 && (opponentToHeal.healBlockTurns || 0) <= 0) {
				const oldHp = opponentToHeal.pokemon.hp;
				opponentToHeal.pokemon.hp = Math.min(opponentToHeal.pokemon.maxHp, opponentToHeal.pokemon.hp + drainAmount);
				messageLog.push(`${opponentToHeal.pokemon.species} restored ${opponentToHeal.pokemon.hp - oldHp} HP!`);
			}
		}
	}
}

export function decrementEOTVolatileCounters(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;

	if (slot.yawnCounter !== undefined && slot.yawnCounter > 0) {
		slot.yawnCounter--;
		if (slot.yawnCounter === 0) {
			if (!slot.status) {
				const isTerrainImmune = battle.terrain?.type === 'electric' && RPGAbilities.isGrounded(pokemon, battle);
				const isAbilityImmune = ['Insomnia', 'Vital Spirit', 'Comatose', 'Sweet Veil'].includes(pokemon.ability || '');

				if (!isTerrainImmune && !isAbilityImmune) {
					slot.status = 'slp';
					slot.sleepCounter = Math.floor(Math.random() * 3) + 2;
					messageLog.push(`<strong>${pokemon.species}</strong> fell asleep!`);
				} else {
					messageLog.push(`${pokemon.species} stayed awake!`);
				}
			}
			slot.yawnCounter = undefined;
		}
	}

	if (slot.isTrapped) {
		slot.isTrapped.turns--;
		if (slot.isTrapped.turns <= 0) {
			slot.isTrapped = null;
			messageLog.push(`${pokemon.species} was freed from the trap.`);
		}
	}
	if (slot.tauntTurns > 0) {
		slot.tauntTurns--;
		if (slot.tauntTurns <= 0) {
			messageLog.push(`${pokemon.species}'s taunt wore off.`);
		}
	}
	if (slot.disabledMove) {
		slot.disabledMove.turns--;
		if (slot.disabledMove.turns <= 0) {
			messageLog.push(`${pokemon.species}'s ${slot.disabledMove.moveId} is no longer disabled!`);
			slot.disabledMove = undefined;
		}
	}
	if (slot.encoreMove) {
		slot.encoreMove.turns--;
		if (slot.encoreMove.turns <= 0) {
			messageLog.push(`${pokemon.species}'s encore ended!`);
			slot.encoreMove = undefined;
		}
	}
	if (slot.magnetRiseTurns > 0) {
		slot.magnetRiseTurns--;
		if (slot.magnetRiseTurns === 0) {
			messageLog.push(`${pokemon.species}'s electromagnetism wore off!`);
		}
	}
	if (slot.telekinesisCounter > 0) {
		slot.telekinesisCounter--;
		if (slot.telekinesisCounter === 0) {
			messageLog.push(`${pokemon.species} was freed from telekinesis!`);
		}
	}
	if (slot.embargoTurns > 0) {
		slot.embargoTurns--;
		if (slot.embargoTurns === 0) {
			messageLog.push(`${pokemon.species} can use items again!`);
		}
	}
	if (slot.healBlockTurns > 0) {
		slot.healBlockTurns--;
		if (slot.healBlockTurns === 0) {
			messageLog.push(`${pokemon.species}'s Heal Block wore off!`);
		}
	}

	if (slot.slowStartTurns !== undefined && slot.slowStartTurns > 0) {
		slot.slowStartTurns--;
		if (slot.slowStartTurns === 0) {
			messageLog.push(`${pokemon.species} got its act together!`);
		}
	}

	if (slot.lockedMoveCounter > 0) {
		if (slot.status === 'slp') {
			slot.lockedMove = undefined;
			slot.lockedMoveCounter = 0;
		} else {
			slot.lockedMoveCounter--;
			if (slot.lockedMoveCounter === 0) {
				slot.lockedMove = undefined;
				if (!slot.isConfused) {
					slot.isConfused = true;
					slot.confusionCounter = Math.floor(Math.random() * 4) + 2;
					messageLog.push(`${pokemon.species} became confused due to fatigue!`);
				}
			}
		}
	}

	if (slot.uproarTurns > 0) {
		slot.uproarTurns--;
		if (slot.uproarTurns === 0) {
			slot.lockedMove = undefined;
			messageLog.push(`${pokemon.species} calmed down.`);
		}
	}

	RPGAbilities.applyEndOfTurnAbilities(slot, battle, messageLog);
}

export function handleEndOfTurnEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;

	const lumCuredStatus = applyEOTItemEffects(slot, battle, messageLog);
	if (slot.pokemon.hp <= 0) return;

	applyEOTHealingEffects(slot, battle, messageLog);
	if (slot.pokemon.hp <= 0) return;

	if (!lumCuredStatus) {
		applyEOTStatusDamage(slot, battle, messageLog);
	}
	if (slot.pokemon.hp <= 0) return;

	applyEOTLeechSeedDamage(slot, battle, messageLog);
	if (slot.pokemon.hp <= 0) return;

	applyEOTVolatileStatusDamage(slot, battle, messageLog);
	if (slot.pokemon.hp <= 0) return;

	decrementEOTVolatileCounters(slot, battle, messageLog);

	slot.isCharged = false;
}

export function handleOpponentFaint(
	battle: BattleState,
	player: PlayerData,
	playerParticipants: ActivePokemonSlot[],
	room: ChatRoom,
	user: User,
	messageLog: string[]
): boolean {
	const opponentSlotsToCheck = (battle.battleType === 'wild_double' || battle.battleType === 'trainer_double') ? [0, 1] : [0];
	let faintedThisCheck = false;

	for (const i of opponentSlotsToCheck) {
		const slot = battle.opponentSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			faintedThisCheck = true;
			messageLog.push(`**The opposing ${slot.pokemon.species} fainted!**`);

			const faintedAbility = toID(slot.pokemon.ability || '');
			const lastMove = slot.lastMoveThatHitMe;
			if (faintedAbility === 'aftermath' && lastMove?.flags.contact) {
				const attackerSlot = playerParticipants.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0 && RPGAbilities.takesIndirectDamage(attackerSlot.pokemon)) {
					const damage = Math.floor(attackerSlot.pokemon.maxHp / 4);
					attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - damage);
					messageLog.push(`${attackerSlot.pokemon.species} was hurt by ${slot.pokemon.species}'s Aftermath!`);
				}
			}

			for (const participantSlot of playerParticipants) {
				if (participantSlot.pokemon.hp <= 0) continue;
				RPGAbilities.applyOnKOAbilities(participantSlot, battle, messageLog);
			}

			if (playerParticipants.length > 0) {
				const expResult = gainExperience(player, playerParticipants, slot.pokemon, room, user);
				messageLog.push(...expResult.messages);
			}

			const nextOpponent = battle.opponentParty.find(p =>
				p.hp > 0 &&
				!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
			);

			if (nextOpponent) {
				messageLog.push(`**${battle.opponentName} is about to send in ${nextOpponent.species}!**`);
				const newSlot = createActivePokemonSlot(nextOpponent);
				battle.opponentSlots[i as 0 | 1] = newSlot;

				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}
			} else {
				battle.opponentSlots[i as 0 | 1] = null;
			}
		}
	}
	return faintedThisCheck;
}

export function handlePlayerFaint(battle: BattleState, messageLog: string[]): boolean {
	const playerSlotsToCheck = (battle.battleType === 'wild_double' || battle.battleType === 'trainer_double') ? [0, 1] : [0];
	let switchNeeded = false;

	for (const i of playerSlotsToCheck) {
		const slot = battle.playerSlots[i];
		if (slot === null || slot.pokemon.hp <= 0) {
			if (slot && slot.pokemon.hp <= 0) {
				messageLog.push(`**Your ${slot.pokemon.species} fainted!**`);

				const faintedAbility = toID(slot.pokemon.ability || '');
				const lastMove = slot.lastMoveThatHitMe;
				if (faintedAbility === 'aftermath' && lastMove?.flags.contact) {
					const opponentSlots = getActiveSlots(battle.opponentSlots);
					const attackerSlot = opponentSlots.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
					if (attackerSlot && attackerSlot.pokemon.hp > 0 && RPGAbilities.takesIndirectDamage(attackerSlot.pokemon)) {
						const damage = Math.floor(attackerSlot.pokemon.maxHp / 4);
						attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - damage);
						messageLog.push(`${attackerSlot.pokemon.species} was hurt by ${slot.pokemon.species}'s Aftermath!`);
					}
				}
			}
			battle.playerSlots[i as 0 | 1] = null;
			switchNeeded = true;
		}
	}
	return switchNeeded;
}

export function handleAiPivot(battle: BattleState, messageLog: string[]) {
	if (!battle.aiPendingPivot) return;

	const nextOpponent = battle.opponentParty.find(p =>
		p.hp > 0 &&
		!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
	);
	const slotIndex = battle.aiPendingPivot.slotIndex;
	const pivotSlot = battle.aiPendingPivot.slot;

	if (nextOpponent) {
		messageLog.push(`**${battle.opponentName} withdrew ${pivotSlot.pokemon.species}!**`);
		messageLog.push(`**${battle.opponentName} sent out ${nextOpponent.species}!**`);

		const newSlot = createActivePokemonSlot(nextOpponent);

		if (battle.aiPendingPivot.isBatonPass) {
			newSlot.statStages = { ...pivotSlot.statStages };
			newSlot.isConfused = pivotSlot.isConfused;
			newSlot.confusionCounter = pivotSlot.confusionCounter;
			newSlot.isSeeded = pivotSlot.isSeeded;
			messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
		}

		battle.opponentSlots[slotIndex as 0 | 1] = newSlot;

		const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
		if (faintedOnEntry) {
			messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
		} else {
			handleMirrorHerb(newSlot, battle, messageLog);
		}
	} else {
		battle.opponentSlots[slotIndex as 0 | 1] = pivotSlot;
		messageLog.push(`${pivotSlot.pokemon.species} had no one to switch to!`);
	}
	battle.aiPendingPivot = undefined;
}

export function checkForWinLoss(
	context: CommandContext,
	battle: BattleState,
	player: PlayerData,
	user: User,
	messageLog: string[]
): boolean {
	const playerHasLivingPokemon = player.party.some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);
	const playerHasActivePokemon = getActiveSlots(battle.playerSlots).length > 0;

	if (!playerHasActivePokemon && !playerHasLivingPokemon) {
		saveBattleStatus(battle);
		activeBattles.delete(user.id);

		let moneyLost = 100;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyLost = Math.floor(battle.opponentMoney / 10) || 200;
		}
		moneyLost = Math.min(player.money, moneyLost);
		player.money -= moneyLost;

		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateDefeatHTML(moneyLost, battle.opponentName)}`);
		return true;
	}

	const opponentHasLivingPokemon = battle.opponentParty.some(p =>
		p.hp > 0 &&
		!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
	);
	const opponentHasActivePokemon = getActiveSlots(battle.opponentSlots).length > 0;

	if (!opponentHasActivePokemon && !opponentHasLivingPokemon) {
		saveBattleStatus(battle);
		activeBattles.delete(user.id);

		let moneyGained = 0;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyGained = battle.opponentMoney;
			player.money += moneyGained;
			if (player.pendingMoveLearnQueue?.moveIds.length) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateTrainerVictoryHTML(battle.opponentName, messageLog, moneyGained)}`);
			}
		} else {
			moneyGained = Math.floor(battle.opponentParty.reduce((sum, p) => sum + p.level, 0) * 5);
			player.money += moneyGained;
			if (player.pendingMoveLearnQueue?.moveIds.length) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				const defeatedNames = battle.opponentParty.map(p => p.species).join(' and ');
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateVictoryHTML(defeatedNames, messageLog, moneyGained, battle.zoneId)}`);
			}
		}
		return true;
	}

	return false;
}

export function checkBattleEndCondition(
	context: CommandContext,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
): boolean {
	const player = getPlayerData(user.id);

	const playerParticipants = getActiveSlots(battle.playerSlots);
	handleOpponentFaint(battle, player, playerParticipants, room, user, messageLog);
	const playerSwitchNeeded = handlePlayerFaint(battle, messageLog);

	const battleEnded = checkForWinLoss(context, battle, player, user, messageLog);
	if (battleEnded) return true;

	if (battle.pendingPivot) {
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePivotSwitchHTML(battle, messageLog.join('<br>'), battle.pendingPivot.slotIndex)}`);
		return true;
	}
	handleAiPivot(battle, messageLog);

	const playerHasLivingPokemon = player.party.some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	if (playerSwitchNeeded && playerHasLivingPokemon) {
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
		return true;
	}

	return false;
}

export function handlePreTurnChecks(attackerSlot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	const attacker = attackerSlot.pokemon;

	if (attackerSlot.mustRecharge) {
		messageLog.push(`${attacker.species} must recharge!`);
		attackerSlot.mustRecharge = false;
		return false;
	}

	if (attackerSlot.willFlinch) {
		messageLog.push(`${attacker.species} flinched and couldn't move!`);
		attackerSlot.willFlinch = false;
		return false;
	}

	if (attackerSlot.status === 'frz') {
		if (Math.random() < 0.20) {
			attackerSlot.status = null;
			messageLog.push(`${attacker.species} thawed out!`);
		} else {
			messageLog.push(`${attacker.species} is frozen solid!`);
			return false;
		}
	}

	if (attackerSlot.status === 'slp') {
		attackerSlot.sleepCounter--;
		if (attackerSlot.sleepCounter > 0) {
			messageLog.push(`${attacker.species} is fast asleep.`);
			return false;
		} else {
			attackerSlot.status = null;
			messageLog.push(`${attacker.species} woke up!`);
		}
	}

	if (attackerSlot.isConfused) {
		messageLog.push(`${attacker.species} is confused!`);
		attackerSlot.confusionCounter--;

		if (attackerSlot.confusionCounter <= 0) {
			attackerSlot.isConfused = false;
			messageLog.push(`${attacker.species} snapped out of its confusion!`);
		} else if (Math.random() < 1 / 3) {
			const attackerAbility = toID(attacker.ability || '');
			if (attackerAbility === 'tangledfeet') {
				messageLog.push(`${attacker.species}'s Tangled Feet prevents it from hurting itself!`);
				return false;
			}

			messageLog.push(`It hurt itself in its confusion!`);
			const selfDamage = Math.floor((((2 * attacker.level / 5 + 2) * 40 * (attacker.atk / attacker.def)) / 50) + 2);
			attacker.hp = Math.max(0, attacker.hp - selfDamage);
			messageLog.push(`${attacker.species} took ${selfDamage} damage!`);
			return false;
		}
	}

	if (attackerSlot.status === 'par') {
		const attackerAbility = toID(attacker.ability || '');

		if (attackerAbility !== 'quickfeet' && Math.random() < 0.25) {
			messageLog.push(`${attacker.species} is fully paralyzed!`);
			return false;
		}
	}

	return true;
}

export function applyHazardEffectsOnSwitchIn(slot: ActivePokemonSlot, battle: BattleState, isPlayerSwitchIn: boolean, messageLog: string[]): boolean {
	const pokemon = slot.pokemon;
	const ability = toID(pokemon.ability || '');

	const runSwitchInAbilities = () => {
		RPGAbilities.applySwitchInAbilities(slot, battle, isPlayerSwitchIn, messageLog);

		const opponentSlots = isPlayerSwitchIn ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);

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

		if (ability === 'trace') {
			const untraceableAbilities = ['trace', 'stancechange', 'schooling', 'disguise', 'neutralizinggas', 'download', 'forecast', 'flowergift', 'imposter', 'multitype'];
			const validTargets = opponentSlots.filter(oppSlot =>
				oppSlot.pokemon.ability && !untraceableAbilities.includes(toID(oppSlot.pokemon.ability))
			);

			if (validTargets.length > 0) {
				const targetSlot = validTargets[Math.floor(Math.random() * validTargets.length)];
				const tracedAbility = targetSlot.pokemon.ability || 'No Ability';
				pokemon.ability = tracedAbility;
				messageLog.push(`${pokemon.species} traced ${targetSlot.pokemon.species}'s ${tracedAbility}!`);
			}
		}
	};

	if (battle.magicRoomTurns === 0 && pokemon.item === 'heavydutyboots') {
		runSwitchInAbilities();
		return false;
	}

	const hazards = isPlayerSwitchIn ? battle.playerHazards : battle.opponentHazards;
	if (hazards.length === 0) {
		runSwitchInAbilities();
		return false;
	}

	const species = Dex.species.get(pokemon.species);
	const isGrounded = RPGAbilities.isGrounded(pokemon, battle);
	const hasAirBalloon = battle.magicRoomTurns === 0 && pokemon.item === 'airballoon';

	let totalDamage = 0;
	let airBalloonPopped = false;

	if (isGrounded) {
		if (hazards.includes('stickyweb')) {
			applyStatChange(slot, 'spe', -1, battle, messageLog, null);
		}

		const toxicSpikeLayers = hazards.filter(h => h === 'toxicspikes').length;
		if (toxicSpikeLayers > 0) {
			if (species.types.includes('Poison')) {
				if (isPlayerSwitchIn) {
					battle.playerHazards = battle.playerHazards.filter(h => h !== 'toxicspikes');
				} else {
					battle.opponentHazards = battle.opponentHazards.filter(h => h !== 'toxicspikes');
				}
				messageLog.push(`The Toxic Spikes were absorbed by ${pokemon.species}!`);
			} else {
				const isImmune = species.types.includes('Steel');
				const targetStatus = slot.status;

				if (!isImmune && !targetStatus) {
					const newStatus: Status = 'psn';
					slot.status = newStatus;
					messageLog.push(`${pokemon.species} was poisoned by the Toxic Spikes!`);
				}
			}
		}
	}

	if (isGrounded) {
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
			airBalloonPopped = true;
		}
		const effectiveness = getCustomEffectiveness('Rock', species.types, pokemon, battle);
		totalDamage += Math.floor(pokemon.maxHp * (1 / 8) * effectiveness);
	}

	if (totalDamage > 0) {
		if (hazards.includes('stealthrock')) {
			messageLog.push(`Pointed stones dug into ${pokemon.species}!`);
		} else if (hazards.includes('spikes')) {
			messageLog.push(`${pokemon.species} was hurt by the spikes!`);
		}
		pokemon.hp = Math.max(0, pokemon.hp - totalDamage);
		if (pokemon.hp <= 0) {
			return true;
		}
	}

	runSwitchInAbilities();

	return false;
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

export function handleMirrorHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mirrorherb') return;

	const isPlayer = battle.playerSlots.includes(slot);
	const myStages = slot.statStages;
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);

	if (opponentSlots.length === 0) return;

	let copiedAny = false;
	const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;

	for (const stat of stats) {
		const maxOpponentBoost = Math.max(0, ...opponentSlots.map(s => s.statStages[stat]));

		if (maxOpponentBoost > 0) {
			myStages[stat] = Math.min(6, myStages[stat] + maxOpponentBoost);
			copiedAny = true;
		}
	}

	if (copiedAny) {
		messageLog.push(`${slot.pokemon.species}'s Mirror Herb copied the opponent's stat boosts!`);
		slot.pokemon.item = undefined;
		activateUnburden(slot, messageLog);
	}
}

	if (!RPGAbilities.isWeatherActive(battle)) {
		if (battle.weather) battle.weather.turns--;
		if (battle.weather && battle.weather.turns <= 0) battle.weather = undefined;
		return;
	}

	battle.weather!.turns--;

	const weatherMessages = {
		'sun': 'The sunlight is harsh.',
		'rain': 'Rain continues to fall.',
		'sand': 'The sandstorm rages.',
		'hail': 'The hail crashes down.',
	};
	messageLog.push(weatherMessages[battle.weather!.type]);

	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	for (const slot of allSlots) {
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0) continue;
		const species = Dex.species.get(pokemon.species);
		const ability = toID(pokemon.ability || '');

		if (battle.weather!.type === 'rain' && ability === 'raindish' && pokemon.hp < pokemon.maxHp) {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species}'s Rain Dish restored its HP!`);
		} else if (battle.weather!.type === 'hail' && ability === 'icebody' && pokemon.hp < pokemon.maxHp) {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species}'s Ice Body restored its HP!`);
		} else if (battle.weather!.type === 'rain' && ability === 'dryskin' && pokemon.hp < pokemon.maxHp) {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species}'s Dry Skin restored its HP!`);
		}

		RPGAbilities.handleHydration(slot, battle, messageLog);

		let takeDamage = false;
		let damageAmount = Math.floor(pokemon.maxHp / 16);

		if (battle.weather!.type === 'sand' && !species.types.includes('Rock') && !species.types.includes('Ground') && !species.types.includes('Steel')) {
			takeDamage = true;
		} else if (battle.weather!.type === 'hail' && !species.types.includes('Ice') && ability !== 'icebody') {
			takeDamage = true;
		} else if (battle.weather!.type === 'sun') {
			if (ability === 'dryskin') {
				takeDamage = true;
				damageAmount = Math.floor(pokemon.maxHp / 8);
			} else if (ability === 'solarpower') {
				takeDamage = true;
				damageAmount = Math.floor(pokemon.maxHp / 8);
			}
		}

		if (takeDamage && RPGAbilities.takesIndirectDamage(pokemon)) {
			pokemon.hp = Math.max(0, pokemon.hp - Math.max(1, damageAmount));
			if (ability === 'dryskin' && battle.weather!.type === 'sun') {
				messageLog.push(`${pokemon.species} was hurt by its Dry Skin!`);
			} else if (ability === 'solarpower') {
				messageLog.push(`${pokemon.species} was hurt by Solar Power!`);
			} else {
				messageLog.push(`${pokemon.species} is buffeted by the weather!`);
			}
		}
	}

	if (battle.weather!.turns <= 0) {
		const weatherEndMessages = {
			'sun': 'The sunlight faded.',
			'rain': 'The rain stopped.',
			'sand': 'The sandstorm subsided.',
			'hail': 'The hail stopped.',
		};
		messageLog.push(weatherEndMessages[battle.weather!.type]);
		battle.weather = undefined;
	}
}

export function handleEndOfTurnFieldEffects(battle: BattleState, messageLog: string[]) {
	if (battle.terrain) {
		if (battle.terrain.type === 'grassy') {
			const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);
			for (const slot of allSlots) {
				const pokemon = slot.pokemon;
				if (pokemon.hp > 0 && pokemon.hp < pokemon.maxHp && RPGAbilities.isGrounded(pokemon, battle)) {
					const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
					pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
					messageLog.push(`${pokemon.species} restored a little HP due to the Grassy Terrain!`);
				}
			}
		}

		battle.terrain.turns--;
		if (battle.terrain.turns <= 0) {
			messageLog.push(`The ${battle.terrain.type} terrain returned to normal.`);
			battle.terrain = undefined;
		}
	}

	if (battle.playerReflectTurns > 0) {
		battle.playerReflectTurns--;
		if (battle.playerReflectTurns === 0) messageLog.push(`Your team's Reflect wore off!`);
	}
	if (battle.opponentReflectTurns > 0) {
		battle.opponentReflectTurns--;
		if (battle.opponentReflectTurns === 0) messageLog.push(`The opposing team's Reflect wore off!`);
	}
	if (battle.playerLightScreenTurns > 0) {
		battle.playerLightScreenTurns--;
		if (battle.playerLightScreenTurns === 0) messageLog.push(`Your team's Light Screen wore off!`);
	}
	if (battle.opponentLightScreenTurns > 0) {
		battle.opponentLightScreenTurns--;
		if (battle.opponentLightScreenTurns === 0) messageLog.push(`The opposing team's Light Screen wore off!`);
	}
	if (battle.playerAuroraVeilTurns > 0) {
		battle.playerAuroraVeilTurns--;
		if (battle.playerAuroraVeilTurns === 0) messageLog.push(`Your team's Aurora Veil wore off!`);
	}
	if (battle.opponentAuroraVeilTurns > 0) {
		battle.opponentAuroraVeilTurns--;
		if (battle.opponentAuroraVeilTurns === 0) messageLog.push(`The opposing team's Aurora Veil wore off!`);
	}

	if (battle.trickRoomTurns > 0) {
		battle.trickRoomTurns--;
		if (battle.trickRoomTurns <= 0) {
			messageLog.push('The twisted dimensions returned to normal.');
		}
	}

	if (battle.magicRoomTurns > 0) {
		battle.magicRoomTurns--;
		if (battle.magicRoomTurns <= 0) {
			messageLog.push('The bizarre dimensions disappeared. Held items are effective again.');
		}
	}

	if (battle.wonderRoomTurns > 0) {
		battle.wonderRoomTurns--;
		if (battle.wonderRoomTurns <= 0) {
			messageLog.push('The bizarre dimensions disappeared. Defense and Sp. Def stats returned to normal.');
		}
	}

	if (battle.gravityTurns > 0) {
		battle.gravityTurns--;
		if (battle.gravityTurns <= 0) {
			messageLog.push('The gravity returned to normal.');
		}
	}

	if (battle.mudSportTurns > 0) {
		battle.mudSportTurns--;
		if (battle.mudSportTurns <= 0) {
			messageLog.push('The effects of Mud Sport wore off.');
		}
	}

	if (battle.waterSportTurns > 0) {
		battle.waterSportTurns--;
		if (battle.waterSportTurns <= 0) {
			messageLog.push('The effects of Water Sport wore off.');
		}
	}
}

export function executeMove(
	attackerSlot: ActivePokemonSlot,
	targetSlots: ActivePokemonSlot[],
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[]
): void {
	attackerSlot.lastMoveUsed = move.id;

	if (!['protect', 'detect'].includes(move.id)) {
		attackerSlot.protectSuccessCounter = 0;
	}

	const isSpread = ['allAdjacentFoes', 'allAdjacent', 'scripted'].includes(move.target);
	const validTargetCount = targetSlots.filter(s => s.pokemon.hp > 0).length;
	const spreadMultiplier = (isSpread && validTargetCount > 1) ? 0.75 : 1.0;
	let moveHitAnyTarget = false;

	for (const defenderSlot of targetSlots) {
		if (attackerSlot.pokemon.hp <= 0) break;
		if (defenderSlot.pokemon.hp <= 0) continue;

		const isPlayerDefender = battle.playerSlots.includes(defenderSlot);

		if (isSpread) {
			if (isPlayerDefender && battle.playerWideGuard) {
				messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`);
				continue;
			}
			if (!isPlayerDefender && battle.opponentWideGuard) {
				messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`);
				continue;
			}
		}

		if (move.id !== 'struggle') {
			if (defenderSlot.isProtected && move.flags.protect && !move.breaksProtect) {
				messageLog.push(`<span style="color: #6c757d;">${defenderSlot.pokemon.species} protected itself!</span>`);
				continue;
			}
		}

		let moveHit = true;
		if (['aerialace'].includes(move.id)) {
		} else if (move.accuracy !== true) {
			const accuracyMultiplier = getAccuracyEvasionMultiplier(attackerSlot.statStages.accuracy);
			const evasionMultiplier = getAccuracyEvasionMultiplier(defenderSlot.statStages.evasion);
			let moveAccuracy = move.accuracy;

			moveAccuracy = RPGAbilities.applyAccuracyModifier(moveAccuracy, attackerSlot.pokemon);

			const abilityEvasionMultiplier = RPGAbilities.getEvasionMultiplier(defenderSlot, battle);
			const finalEvasionMultiplier = evasionMultiplier * abilityEvasionMultiplier;

			if (RPGAbilities.isWeatherActive(battle)) {
				if (battle.weather!.type === 'rain') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 100;
				} else if (battle.weather!.type === 'sun') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 50;
				}
				if (battle.weather!.type === 'hail' && move.id === 'blizzard') {
					moveAccuracy = 100;
				}
			}

			if (battle.gravityTurns > 0) {
				moveAccuracy = Math.floor(moveAccuracy * (5 / 3));
			}

			const finalAccuracy = moveAccuracy * (accuracyMultiplier / finalEvasionMultiplier);
			if ((Math.random() * 100) > finalAccuracy) {
				messageLog.push(`<span style="color: #dc3545;">${attackerSlot.pokemon.species}'s ${move.name} missed ${defenderSlot.pokemon.species}!</span>`);
				moveHit = false;

				if (['highjumpkick', 'jumpkick'].includes(move.id)) {
					const crashDamage = Math.floor(attackerSlot.pokemon.maxHp / 2);
					attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - crashDamage);
					messageLog.push(`<span style="color: #dc3545;">${attackerSlot.pokemon.species} kept going and crashed!</span>`);
				}
			}
		}

		if (!moveHit) {
			continue;
		}

		moveHitAnyTarget = true;

		if (move.id === 'struggle') {
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, 1.0);
		} else if (move.category === 'Status') {
			handleStatusMove(attackerSlot, defenderSlot, move, battle, messageLog);
		} else {
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, spreadMultiplier);
		}
	}

	if (attackerSlot && attackerSlot.pokemon.hp > 0 && move.self?.volatileStatus === 'lockedmove') {
		if (attackerSlot.lockedMoveCounter === 0) {
			attackerSlot.lockedMoveCounter = Math.floor(Math.random() * 2) + 2;
			attackerSlot.lockedMove = move.id;
		}
	}

	if (attackerSlot && attackerSlot.pokemon.hp > 0 && move.self?.volatileStatus === 'mustrecharge' && moveHitAnyTarget) {
		attackerSlot.mustRecharge = true;
	}

	if (attackerSlot && attackerSlot.pokemon.hp > 0 && move.self?.volatileStatus === 'uproar') {
		if (attackerSlot.uproarTurns === 0) {
			attackerSlot.uproarTurns = 3;
			attackerSlot.lockedMove = move.id;
			for (const slot of [...battle.playerSlots, ...battle.opponentSlots]) {
				if (slot && slot.status === 'slp') {
					slot.status = null;
					slot.sleepCounter = 0;
					messageLog.push(`${slot.pokemon.species} woke up due to the uproar!`);
				}
			}
		}
	}

	if (attackerSlot && attackerSlot.pokemon.hp > 0) {
		RPGAbilities.checkFormChangeAbilities(attackerSlot, battle, messageLog);
	}
	for (const defenderSlot of targetSlots) {
		if (defenderSlot && defenderSlot.pokemon.hp > 0) {
			RPGAbilities.checkFormChangeAbilities(defenderSlot, battle, messageLog);
		}
	}
}

export function processEndOfTurn(battle: BattleState, messageLog: string[]) {
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	battle.playerFutureMoves = battle.playerFutureMoves.filter(fm => {
		fm.turnsLeft--;
		if (fm.turnsLeft === 0) {
			const targetSlot = battle.opponentSlots[fm.slotIndex];
			if (targetSlot && targetSlot.pokemon.hp > 0) {
				const moveName = fm.moveId === 'futuresight' ? 'Future Sight' : 'Doom Desire';
				messageLog.push(`<strong>${moveName}</strong> took effect!`);

				const move = getMove(fm.moveId);
				const basePower = move.basePower || 120;
				const moveType = move.type;

				const defender = targetSlot.pokemon;
				const defenderSpecies = Dex.species.get(defender.species);
				const defenderDef = defender.spd * getStatMultiplier(targetSlot.statStages.spd);

				const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
				const baseDamage = Math.floor((2 * 50 / 5 + 2) * basePower * (fm.attackerStats.spa / defenderDef) / 50) + 2;
				const damage = Math.floor(baseDamage * effectiveness);

				targetSlot.pokemon.hp = Math.max(0, targetSlot.pokemon.hp - damage);
				messageLog.push(`${defender.species} took ${damage} damage!`);

				if (effectiveness > 1) messageLog.push(`It's super effective!`);
				else if (effectiveness < 1 && effectiveness > 0) messageLog.push(`It's not very effective...`);
			}
			return false;
		}
		return true;
	});

	battle.opponentFutureMoves = battle.opponentFutureMoves.filter(fm => {
		fm.turnsLeft--;
		if (fm.turnsLeft === 0) {
			const targetSlot = battle.playerSlots[fm.slotIndex];
			if (targetSlot && targetSlot.pokemon.hp > 0) {
				const moveName = fm.moveId === 'futuresight' ? 'Future Sight' : 'Doom Desire';
				messageLog.push(`<strong>${moveName}</strong> took effect!`);

				const move = getMove(fm.moveId);
				const basePower = move.basePower || 120;
				const moveType = move.type;

				const defender = targetSlot.pokemon;
				const defenderSpecies = Dex.species.get(defender.species);
				const defenderDef = defender.spd * getStatMultiplier(targetSlot.statStages.spd);

				const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
				const baseDamage = Math.floor((2 * 50 / 5 + 2) * basePower * (fm.attackerStats.spa / defenderDef) / 50) + 2;
				const damage = Math.floor(baseDamage * effectiveness);

				targetSlot.pokemon.hp = Math.max(0, targetSlot.pokemon.hp - damage);
				messageLog.push(`${defender.species} took ${damage} damage!`);

				if (effectiveness > 1) messageLog.push(`It's super effective!`);
				else if (effectiveness < 1 && effectiveness > 0) messageLog.push(`It's not very effective...`);
			}
			return false;
		}
		return true;
	});

	for (const slot of allSlots) {
		slot.willFlinch = false;
	}

	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) {
			handleEndOfTurnEffects(slot, battle, messageLog);
		}
	}

	handleEndOfTurnWeather(battle, messageLog);
	handleEndOfTurnFieldEffects(battle, messageLog);
}

export function getAccuracyEvasionMultiplier(stage: number): number {
	if (stage > 0) {
		return (3 + stage) / 3;
	} else if (stage < 0) {
		return 3 / (3 - stage);
	}
	return 1;
}

export const INITIAL_STAT_STAGES = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

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
	};
}

export function checkTrappingAbility(
	slotToSwitch: ActivePokemonSlot,
	battle: BattleState
): ActivePokemonSlot | null {
	const isPlayer = battle.playerSlots.includes(slotToSwitch);
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);
	const userAbility = toID(slotToSwitch.pokemon.ability || '');

	if (userAbility === 'shadowtag') return null;

	for (const oppSlot of opponentSlots) {
		const oppAbility = toID(oppSlot.pokemon.ability || '');

		if (oppAbility === 'shadowtag') {
			return oppSlot;
		}

		if (oppAbility === 'arenatrap') {
			if (RPGAbilities.isGrounded(slotToSwitch.pokemon, battle)) {
				return oppSlot;
			}
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

export function buildActionQueue(battle: BattleState, messageLog: string[]): NonNullable<BattleState['pendingActions'][number]>[] {
	const actionQueue: NonNullable<BattleState['pendingActions'][number]>[] = [];
	const allActiveSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	for (const slotIndex in battle.pendingActions) {
		const action = battle.pendingActions[slotIndex];
		if (action && allActiveSlots.some(s => s.pokemon.id === action.pokemonId)) {
			actionQueue.push(action);
		}
	}

	actionQueue.sort((a, b) => {
		const slotA = allActiveSlots.find(s => s.pokemon.id === a.pokemonId);
		const slotB = allActiveSlots.find(s => s.pokemon.id === b.pokemonId);

		if (!slotA) return 1;
		if (!slotB) return -1;

		const isSwitchA = a.actionType === 'switch';
		const isSwitchB = b.actionType === 'switch';
		const moveA = getMove(a.moveId || 'struggle');
		const moveB = getMove(b.moveId || 'struggle');

		let priorityA = isSwitchA ? 6 : (moveA.priority);
		let priorityB = isSwitchB ? 6 : (moveB.priority);

		if (!isSwitchA) priorityA += RPGAbilities.applyPriorityModifier(moveA, slotA.pokemon);
		if (!isSwitchB) priorityB += RPGAbilities.applyPriorityModifier(moveB, slotB.pokemon);

		if (priorityA !== priorityB) {
			return priorityB - priorityA;
		}

		let speedA = slotA.pokemon.spe * getStatMultiplier(slotA.statStages.spe);
		const abilityA = toID(slotA.pokemon.ability || '');
		if (slotA.status === 'par' && abilityA !== 'quickfeet') {
			speedA = Math.floor(speedA / 2);
		}
		speedA = RPGAbilities.applySpeedModifier(slotA.pokemon, battle, speedA);

		let speedB = slotB.pokemon.spe * getStatMultiplier(slotB.statStages.spe);
		const abilityB = toID(slotB.pokemon.ability || '');
		if (slotB.status === 'par' && abilityB !== 'quickfeet') {
			speedB = Math.floor(speedB / 2);
		}
		speedB = RPGAbilities.applySpeedModifier(slotB.pokemon, battle, speedB);

		const quickClawA = !isSwitchA && battle.magicRoomTurns === 0 && slotA.pokemon.item === 'quickclaw' && Math.random() < 0.2;
		const quickClawB = !isSwitchB && battle.magicRoomTurns === 0 && slotB.pokemon.item === 'quickclaw' && Math.random() < 0.2;

		if (quickClawA && !quickClawB) {
			messageLog.push(`${slotA.pokemon.species}'s Quick Claw let it move first!`);
			return -1;
		}
		if (quickClawB && !quickClawA) {
			messageLog.push(`${slotB.pokemon.species}'s Quick Claw let it move first!`);
			return 1;
		}

		if (battle.trickRoomTurns > 0) {
			return speedA - speedB;
		}
		return speedB - speedA;
	});

	allActiveSlots.forEach(s => s.analyticBoost = false);
	let lastMoveAction: NonNullable<BattleState['pendingActions'][number]> | null = null;
	for (let i = actionQueue.length - 1; i >= 0; i--) {
		if (actionQueue[i].actionType === 'move') {
			lastMoveAction = actionQueue[i];
			break;
		}
	}

	if (lastMoveAction) {
		const lastMoverSlot = allActiveSlots.find(s => s.pokemon.id === lastMoveAction.pokemonId);
		if (lastMoverSlot && toID(lastMoverSlot.pokemon.ability || '') === 'analytic') {
			lastMoverSlot.analyticBoost = true;
		}
	}

	return actionQueue;
}

export function processTurn(context: CommandContext, battle: BattleState, room: ChatRoom, user: User, initialMessages: string[] = []) {
	const messageLog: string[] = [...initialMessages];
	battle.turn++;

	battle.playerQuickGuard = false;
	battle.opponentQuickGuard = false;
	battle.playerWideGuard = false;
	battle.opponentWideGuard = false;
	battle.playerCraftyShield = false;
	battle.opponentCraftyShield = false;

	getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(s => {
		s.isHelped = false;
		s.isRedirecting = false;
		s.lastDamageTaken = undefined;
	});

	getActiveSlots(battle.opponentSlots).forEach((slot, i) => {
		const slotIndex = 2 + i;
		if (!battle.pendingActions[slotIndex]) {
			battle.pendingActions[slotIndex] = generateAiAction(slot, slotIndex, battle);
		}
	});

	const actionQueue = buildActionQueue(battle, messageLog);

	for (const action of actionQueue) {
		executeAction(action, battle, room, user, messageLog);

		const battleEndedMidTurn = checkBattleEndCondition(context, battle, room, user, messageLog);
		if (battleEndedMidTurn) {
			return;
		}
	}

	if (battle.forceEnd) {
		return;
	}

	messageLog.push("--- End of Turn ---");
	processEndOfTurn(battle, messageLog);

	const battleEnded = checkBattleEndCondition(context, battle, room, user, messageLog);

	battle.pendingActions = {};

	if (!battleEnded) {
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			if (slot.pokemon.hp > 0) {
				slot.activeTurns++;
			}
		});
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
	}
}

export function handleSwitchAction(
	attackerSlot: ActivePokemonSlot,
	attackerSlotIndex: number,
	action: Extract<NonNullable<BattleState['pendingActions'][number]>, { actionType: 'switch' }>,
	battle: BattleState,
	player: PlayerData,
	messageLog: string[]
) {
	const isPlayerSwitch = attackerSlotIndex <= 1;
	const pokemonToSwitchInId = action.switchToPokemonId!;

	const trappingPokemon = checkTrappingAbility(attackerSlot, battle);
	if (trappingPokemon) {
		messageLog.push(`${attackerSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`);
		return;
	}

	if (attackerSlot.isIngrained) {
		messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
		return;
	}
	if (attackerSlot.isTrapped) {
		messageLog.push(`${attackerSlot.pokemon.species} is trapped and can't switch out!`);
		return;
	}

	const outgoingPokemon = attackerSlot.pokemon;

	const outgoingAbility = toID(outgoingPokemon.ability || '');
	if (outgoingAbility === 'regenerator' && outgoingPokemon.hp > 0 && outgoingPokemon.hp < outgoingPokemon.maxHp) {
		const healAmount = Math.floor(outgoingPokemon.maxHp / 3);
		outgoingPokemon.hp = Math.min(outgoingPokemon.maxHp, outgoingPokemon.hp + healAmount);
		messageLog.push(`${outgoingPokemon.species}'s Regenerator restored its HP!`);
	} else if (outgoingAbility === 'naturalcure' && attackerSlot.status) {
		attackerSlot.status = null;
		outgoingPokemon.status = null;
		messageLog.push(`${outgoingPokemon.species}'s Natural Cure healed its status!`);
	}

	saveBattleStatus(battle);

	if (isPlayerSwitch) {
		const incomingPokemon = player.party.find(p => p.id === pokemonToSwitchInId);
		if (!incomingPokemon) {
			messageLog.push(`${outgoingPokemon.species} tried to switch out, but there was no one to switch to!`);
			return;
		}

		const newSlot = createActivePokemonSlot(incomingPokemon);
		battle.playerSlots[attackerSlotIndex as 0 | 1] = newSlot;
		messageLog.push(`**${player.name} withdrew ${outgoingPokemon.species} and sent out ${incomingPokemon.species}!**`);

		const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
		if (faintedOnEntry) {
			messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
		} else {
			handleMirrorHerb(newSlot, battle, messageLog);
			RPGAbilities.checkFormChangeAbilities(newSlot, battle, messageLog);
		}
	} else {
		const replacement = battle.opponentParty.find(p => p.id === pokemonToSwitchInId);

		if (replacement) {
			const newSlot = createActivePokemonSlot(replacement);
			battle.opponentSlots[attackerSlotIndex as 0 | 1] = newSlot;
			messageLog.push(`**${battle.opponentName} withdrew ${outgoingPokemon.species} and sent out ${replacement.species}!**`);

			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
			if (faintedOnEntry) {
				messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
			} else {
				handleMirrorHerb(newSlot, battle, messageLog);
				RPGAbilities.checkFormChangeAbilities(newSlot, battle, messageLog);
			}
		} else {
			messageLog.push(`${outgoingPokemon.species} tried to switch out, but no one was left!`);
		}
	}
}

export function resolveMoveTarget(
	attackerSlotIndex: number,
	chosenTargetSlotIndex: number,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): number {
	const isPlayerAttacker = attackerSlotIndex <= 1;
	const opponentSlots = getActiveSlots(isPlayerAttacker ? battle.opponentSlots : battle.playerSlots);
	let finalTargetIndex = chosenTargetSlotIndex;

	let abilityRedirector: ActivePokemonSlot | undefined = undefined;
	if (move.target === 'normal') {
		const moveType = move.type;

		if (moveType === 'Water') {
			abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'stormdrain');
		} else if (moveType === 'Electric') {
			abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'lightningrod');
		}

		if (abilityRedirector) {
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(abilityRedirector);
			finalTargetIndex = redirectorIndex;
			messageLog.push(`${abilityRedirector.pokemon.species}'s ${abilityRedirector.pokemon.ability} drew in the attack!`);
		}
	}

	if (!abilityRedirector) {
		const redirector = opponentSlots.find(s => s.isRedirecting);
		if (redirector && move.target === 'normal') {
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(redirector);
			finalTargetIndex = redirectorIndex;
			messageLog.push(`${redirector.pokemon.species} took the attack!`);
		}
	}

	return finalTargetIndex;
}

export function handleChargingMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[],
	ppDeduction: number
): boolean {
	if (move.flags.charge && !attackerSlot.chargingMove) {
		attackerSlot.chargingMove = move.id;
		let chargeMessage = `${attackerSlot.pokemon.species} is charging up!`;

		if (move.id === 'fly') chargeMessage = `${attackerSlot.pokemon.species} flew up high!`;
		else if (move.id === 'dig') chargeMessage = `${attackerSlot.pokemon.species} burrowed underground!`;
		else if (move.id === 'dive') chargeMessage = `${attackerSlot.pokemon.species} hid underwater!`;
		else if (move.id === 'bounce') chargeMessage = `${attackerSlot.pokemon.species} sprang up!`;
		else if (move.id === 'shadowforce' || move.id === 'phantomforce') chargeMessage = `${attackerSlot.pokemon.species} vanished instantly!`;
		else if (move.id === 'solarbeam' || move.id === 'solarblade') {
			if (RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'sun') {
				attackerSlot.chargingMove = undefined;
				chargeMessage = '';
			} else {
				chargeMessage = `${attackerSlot.pokemon.species} absorbed light!`;
			}
		} else if (move.id === 'skyattack') chargeMessage = `${attackerSlot.pokemon.species} became cloaked in a harsh light!`;
		else if (move.id === 'geomancy') chargeMessage = `${attackerSlot.pokemon.species} is absorbing power!`;

		if (chargeMessage) messageLog.push(chargeMessage);

		if (attackerSlot.chargingMove) {
			if (moveObject.id !== 'struggle' && moveObject.pp > 0) {
				moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
			}
			return true;
		}
	} else if (attackerSlot.chargingMove === move.id) {
		attackerSlot.chargingMove = undefined;
	}

	return false;
}

export function executeAction(
	action: NonNullable<BattleState['pendingActions'][number]>,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
) {
	const player = getPlayerData(battle.playerId);
	const allSlots = [...battle.playerSlots, ...battle.opponentSlots];
	const attackerSlotIndex = allSlots.findIndex(s => s?.pokemon.id === action.pokemonId);
	const attackerSlot = allSlots[attackerSlotIndex];

	if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
		return;
	}

	attackerSlot.isRedirecting = false;

	if (action.actionType === 'switch') {
		handleSwitchAction(attackerSlot, attackerSlotIndex, action as any, battle, player, messageLog);
		return;
	}

	if (action.actionType === 'move' && action.moveId && action.targetSlot !== undefined) {
		const isPlayerPokemon = attackerSlotIndex < battle.playerSlots.length;
		if (action.terastallize && isPlayerPokemon) {
			if (battle.playerTerastallizeUsed) {
				messageLog.push(`<span style="color: #FF1493;">${attackerSlot.pokemon.species} couldn't Terastallize because another Pokemon already did!</span>`);
			} else if (attackerSlot.terastallized) {
				messageLog.push(`<span style="color: #FF1493;">${attackerSlot.pokemon.species} has already Terastallized!</span>`);
			} else {
				attackerSlot.terastallized = attackerSlot.pokemon.teraType;
				battle.playerTerastallizeUsed = true;
				messageLog.push(`<span style="color: #FF1493; font-weight: bold;">✨ ${attackerSlot.pokemon.species} Terastallized into ${attackerSlot.pokemon.teraType} type! ✨</span>`);
			}
		}

		const move = getMove(action.moveId);
		let moveObject = attackerSlot.pokemon.moves.find(m => m.id === move.id);

		if (move.id === 'struggle') moveObject = { id: 'struggle', pp: 1 };
		else if (!moveObject) moveObject = { id: 'struggle', pp: 1 };
		else if (moveObject.pp === 0) {
			moveObject = { id: 'struggle', pp: 1 };
			messageLog.push(`${attackerSlot.pokemon.species} has no PP left for ${move.name}!`);
		}

		if (!handlePreTurnChecks(attackerSlot, battle, messageLog)) {
			return;
		}

		const finalTargetIndex = resolveMoveTarget(attackerSlotIndex, action.targetSlot, move, battle, messageLog);
		const resolvedTargets = getMoveTargets(attackerSlotIndex, finalTargetIndex, move, battle);

		let ppDeduction = 1;
		if (resolvedTargets.some(target => toID(target.pokemon.ability || '') === 'pressure')) {
			ppDeduction = 2;
		}

		if (handleChargingMove(attackerSlot, move, moveObject, battle, messageLog, ppDeduction)) {
			return;
		}

		if (moveObject.id !== 'struggle' && moveObject.pp > 0 && !move.flags.charge) {
			moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
		}

		messageLog.push(`<span style="color: #555;"><strong>${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`);
		if (resolvedTargets.length === 0) {
			messageLog.push(`But there was no target!`);
			return;
		}

		const remainingTargets: ActivePokemonSlot[] = [];
		for (const defenderSlot of resolvedTargets) {
			const abilityContext = { attacker: attackerSlot.pokemon, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
			const preventionCheck = RPGAbilities.preventMove(abilityContext);
			if (preventionCheck && preventionCheck.prevented) {
				messageLog.push(preventionCheck.message || `${defenderSlot.pokemon.species}'s ability prevented the move!`);
			} else {
				remainingTargets.push(defenderSlot);
			}
		}
		if (resolvedTargets.length > 0 && remainingTargets.length === 0) {
			return;
		}

		executeMove(attackerSlot, remainingTargets, move, moveObject, battle, messageLog);

		if (attackerSlot.pokemon.hp > 0 && move.id !== 'struggle' && !attackerSlot.lockedMove) {
			const item = attackerSlot.pokemon.item;
			if (battle.magicRoomTurns === 0 && (item === 'choiceband' || item === 'choicescarf' || item === 'choicespecs')) {
				attackerSlot.lockedMove = move.id;
			}
		}

		if (move.selfSwitch && attackerSlot.pokemon.hp > 0) {
			const isPlayer = attackerSlotIndex <= 1;
			if (isPlayer) {
				const hasReplacement = player.party.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));
				if (hasReplacement) {
					battle.pendingPivot = { slotIndex: attackerSlotIndex, slot: attackerSlot, isBatonPass: move.selfSwitch === 'copyvolatile' };
					battle.playerSlots[attackerSlotIndex as 0 | 1] = null;
					messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			} else {
				const hasReplacement = battle.opponentParty.some(p => p.hp > 0 && !battle.opponentSlots.some(s => s?.pokemon.id === p.id));
				if (hasReplacement) {
					battle.aiPendingPivot = { slotIndex: attackerSlotIndex, slot: attackerSlot, isBatonPass: move.selfSwitch === 'copyvolatile' };
					battle.opponentSlots[attackerSlotIndex as 0 | 1] = null;
					messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			}
		}
	}
}

export function generateAiAction(aiSlot: ActivePokemonSlot, aiSlotIndex: number, battle: BattleState): BattleState['pendingActions'][number] {
	const usableMoves = aiSlot.pokemon.moves.filter(m => {
		const moveData = getMove(m.id);
		return m.pp > 0 && moveData.category !== 'Status';
	});

	let chosenMoveId = 'struggle';
	if (usableMoves.length > 0) {
		chosenMoveId = usableMoves[Math.floor(Math.random() * usableMoves.length)].id;
	}

	const playerSlots = getActiveSlots(battle.playerSlots);
	let targetSlotIndex = 0;
	if (playerSlots.length > 0) {
		const targetSlot = playerSlots[Math.floor(Math.random() * playerSlots.length)];
		targetSlotIndex = battle.playerSlots.indexOf(targetSlot);
	}

	return {
		actionType: 'move',
		moveId: chosenMoveId,
		targetSlot: targetSlotIndex,
		pokemonId: aiSlot.pokemon.id,
	};
}

export function validateMoveAction(
	attackerSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState
): string | null {
	const pokemon = attackerSlot.pokemon;
	const moveData = getMove(moveId);

	if (attackerSlot.tauntTurns > 0 && moveData.category === 'Status') {
		return `${pokemon.species} is taunted! It can't use ${moveData.name}!`;
	}

	if (battle.magicRoomTurns === 0 && pokemon.item === 'assaultvest' && moveData.category === 'Status') {
		return `Your Assault Vest prevents you from using ${moveData.name}!`;
	}

	const moveObject = pokemon.moves.find(m => m.id === moveData.id);
	if (moveObject && moveObject.pp === 0) {
		return `There is no PP left for ${moveData.name}!`;
	}

	if (attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === moveData.id) {
		return `${moveData.name} is disabled!`;
	}

	if (attackerSlot.encoreMove && attackerSlot.encoreMove.moveId !== moveData.id) {
		return `${pokemon.species} must use ${attackerSlot.encoreMove.moveId}!`;
	}

	if (attackerSlot.tormentActive && attackerSlot.lastMoveUsed === moveData.id) {
		return `${pokemon.species} can't use the same move twice due to Torment!`;
	}

	if (attackerSlot.lockedMoveCounter > 0) {
		if (attackerSlot.lockedMove !== moveData.id) {
			const lockedMoveName = getMove(attackerSlot.lockedMove!).name;
			return `${pokemon.species} must continue using ${lockedMoveName}!`;
		}
	}

	if (attackerSlot.uproarTurns > 0) {
		if (attackerSlot.lockedMove !== moveData.id) {
			return `${pokemon.species} must continue its uproar!`;
		}
	}

	const hasChoiceItemLock = attackerSlot.lockedMove &&
		attackerSlot.lockedMove !== moveData.id &&
		battle.magicRoomTurns === 0 &&
		attackerSlot.lockedMoveCounter === 0 &&
		attackerSlot.uproarTurns === 0;

	if (hasChoiceItemLock) {
		const lockedMoveObject = pokemon.moves.find(m => m.id === attackerSlot.lockedMove);
		if (lockedMoveObject && lockedMoveObject.pp > 0) {
			return `${pokemon.species} is locked into ${lockedMoveObject.id}!`;
		}
	}

	return null;
}
