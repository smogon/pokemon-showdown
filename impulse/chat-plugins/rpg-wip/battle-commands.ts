/**
 * Battle Commands for the RPG system
 *
 * This module contains all battle-related commands that are part of the
 * /rpg battleaction namespace. These commands handle move selection,
 * switching, catching, running, and item usage during battles.
 *
 * All commands are exported and then imported into commands.ts to maintain
 * the /rpg namespace structure.
 */

import { toID } from '../../../sim/dex';
import {
	getMove,
	getActiveSlots,
	createActivePokemonSlot,
	checkTrappingAbility,
	getSlotFromIndex,
	handleMirrorHerb,
} from './utils';
import { GameConfig } from './game-config';
import {
	removeItemFromInventory,
	useBattleHealingItem,
	useBattleRevivalItem,
	canUseItemInBattle,
	getBattleUsableItems,
	ITEMS_DATABASE,
} from './items';
import {
	getPlayerData,
	activeBattles,
	storePokemonInPC,
} from './core';
import { validateMoveAction, processTurn, applyHazardEffectsOnSwitchIn } from './battle-flow';
import { saveBattleStatus, performCatchAttempt } from './battle-core';
import { LOCATIONS, getZoneLocation } from './game-locations';
import { generateExploreHTML } from './html';
import {
	generateBattleHTML,
	generateCatchMenuHTML,
	generateCatchTargetHTML,
	generateSwitchMenuHTML,
	generateFaintSwitchHTML,
	generateMultipleOpponentsCatchErrorHTML,
	generateCatchSuccessHTML,
	generateBattleItemMenuHTML,
	generateBattleItemTargetHTML,
	generateBattleBagMenuHTML,
} from './battle-ui';
import { teraToggleState } from './battle-state';

/**
 * Battle action commands namespace
 * These are all accessible via /rpg battleaction <subcommand>
 */
export const battleActionCommands: ChatCommands = {
	move(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		const parts = target.split(' ');
		const attackerSlotStr = parts[0];
		const moveIdStr = parts[1];
		const targetSlotStr = parts[2];
		const shouldTerastallize = parts[3] === 'terastallize';

		const attackerSlotIndex = parseInt(attackerSlotStr);
		const targetSlotIndex = parseInt(targetSlotStr);
		const moveId = toID(moveIdStr);

		if (isNaN(attackerSlotIndex) || !moveId || isNaN(targetSlotIndex)) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Error: Invalid move command received."])}`);
		}

		if (attackerSlotIndex !== 0 && attackerSlotIndex !== 1) return this.errorReply("Invalid attacker slot.");

		const attackerSlot = battle.playerSide.slots[attackerSlotIndex];
		if (!attackerSlot || attackerSlot.pokemon.hp <= 0) return this.errorReply("This Pokémon cannot move.");
		if (battle.pendingActions[attackerSlotIndex]) return this.errorReply("Action already queued.");

		const moveData = getMove(moveId);
		if (!moveData.exists) return this.errorReply(`Move '${moveId}' not found.`);

		if (shouldTerastallize) {
			if (battle.playerSide.terastallizeUsed) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"])}`);
			if (attackerSlot.terastallized) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Already Terastallized!"])}`);
		}

		const validationError = validateMoveAction(attackerSlot, moveId, battle);
		if (validationError) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [validationError])}`);

		battle.pendingActions[attackerSlotIndex] = {
			actionType: 'move',
			moveId: moveData.id,
			targetSlot: targetSlotIndex,
			pokemonId: attackerSlot.pokemon.id,
			terastallize: shouldTerastallize,
		};

		teraToggleState.delete(user.id);
		const messageLog = shouldTerastallize ?
			[`${attackerSlot.pokemon.species} is ready to Terastallize and use ${moveData.name}!`] :
			[`${attackerSlot.pokemon.species} is ready to use ${moveData.name}!`];

		const activePlayerSlots = battle.playerSide.slots.filter(s => s && s.pokemon.hp > 0).length;
		const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

		if (submittedPlayerActions === activePlayerSlots) processTurn(this, battle, room, user);
		else this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
	},

	selecttarget(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		const parts = target.split(' ');
		const attackerSlotIndex = parseInt(parts[0]);
		const moveId = parts[1];
		const shouldTerastallize = parts[2] === 'terastallize';

		if (isNaN(attackerSlotIndex) || !moveId) return this.errorReply("Invalid command.");

		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [shouldTerastallize ? `Select a target for ${getMove(moveId).name} (with Terastallization).` : `Select a target for ${getMove(moveId).name}.`], { attackerSlotIndex, moveId, shouldTerastallize })}`);
	},

	teratoggle(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");
		const newState = target === 'on';
		teraToggleState.set(user.id, newState);
		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, newState)}`);
	},

	forceswitch(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		const [slotStr, pokemonId] = target.split(' ');
		const slotToFill = parseInt(slotStr);

		if (isNaN(slotToFill) || !pokemonId) return this.errorReply("Invalid switch command.");

		if (pokemonId === 'cancel') {
			if (battle.pendingPivot?.slotIndex === slotToFill) {
				battle.playerSide.slots[slotToFill as 0 | 1] = battle.pendingPivot.slot;
				battle.pendingPivot = undefined;
			}
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["The battle continues..."])}`);
		}

		const player = getPlayerData(battle.playerId);
		const partyToUse = battle.overridePlayerParty || player.party;
		const partyIndex = partyToUse.findIndex(p => p.id === pokemonId && p.hp > 0);

		if (partyIndex === -1) return this.errorReply("Invalid Pokemon or it has fainted.");
		if (battle.playerSide.slots.some(s => s?.pokemon.id === pokemonId)) return this.errorReply("This Pokemon is already in battle.");
		if (battle.playerSide.slots[slotToFill] !== null && !battle.pendingPivot) return this.errorReply("This slot is not empty.");

		const nextPokemon = partyToUse[partyIndex];
		const newSlot = createActivePokemonSlot(nextPokemon);
		const messageLog = [`<span class="rpg-text-info">Go, ${nextPokemon.species}!</span>`];

		if (battle.pendingPivot?.slotIndex === slotToFill) {
			if (battle.pendingPivot.isBatonPass) {
				newSlot.statStages = { ...battle.pendingPivot.slot.statStages };
				newSlot.isConfused = battle.pendingPivot.slot.isConfused;
				newSlot.confusionCounter = battle.pendingPivot.slot.confusionCounter;
				newSlot.isSeeded = battle.pendingPivot.slot.isSeeded;
				messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
			}
			battle.pendingPivot = undefined;
		}

		battle.playerSide.slots[slotToFill as 0 | 1] = newSlot;

		const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
		if (faintedOnEntry) messageLog.push(`<span class="rpg-text-error"><strong>${newSlot.pokemon.species} fainted upon entry!</strong></span>`);
		else handleMirrorHerb(newSlot, battle, messageLog);

		const isDoubleBattle = battle.battleType.includes('double');
		const slotsToCheck = isDoubleBattle ? [0, 1] : [0];
		const needsAnotherSwitch = slotsToCheck.some(i => battle.playerSide.slots[i] === null) &&
			partyToUse.some(p => p.hp > 0 && !battle.playerSide.slots.some(s => s?.pokemon.id === p.id));

		if (needsAnotherSwitch) {
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
		} else {
			if (!battle.pendingPivot) battle.pendingActions = {};
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
		}
	},

	playerswitch(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		const [slotStr, pokemonIdIn] = target.split(' ');
		const slotToSwitchOut = parseInt(slotStr);

		if (isNaN(slotToSwitchOut) || !pokemonIdIn) return this.errorReply("Invalid switch command.");

		const outgoingSlot = battle.playerSide.slots[slotToSwitchOut];
		if (!outgoingSlot || outgoingSlot.pokemon.hp <= 0) return this.errorReply("Slot empty or fainted.");

		const trappingPokemon = checkTrappingAbility(outgoingSlot, battle);
		if (trappingPokemon) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Trapped by ${trappingPokemon.pokemon.ability}!`])}`);
		if (outgoingSlot.isTrapped || outgoingSlot.partiallyTrapped) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped!`])}`);
		if (outgoingSlot.isIngrained) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is rooted!`])}`);

		const player = getPlayerData(battle.playerId);
		const partyToUse = battle.overridePlayerParty || player.party;
		const incomingPokemon = partyToUse.find(p => p.id === pokemonIdIn && p.hp > 0);

		if (!incomingPokemon) return this.errorReply("Invalid Pokemon.");
		if (battle.playerSide.slots.some(s => s?.pokemon.id === pokemonIdIn)) return this.errorReply("Pokemon already in battle.");

		outgoingSlot.lockedMove = undefined;
		outgoingSlot.lockedMoveCounter = 0;

		battle.pendingActions[slotToSwitchOut] = {
			actionType: 'switch',
			switchToPokemonId: pokemonIdIn,
			pokemonId: outgoingSlot.pokemon.id,
		};

		const activePlayerSlots = getActiveSlots(battle.playerSide.slots).length;
		const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

		if (submittedPlayerActions === activePlayerSlots) processTurn(this, battle, room, user);
		else this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is ready to switch out!`])}`);
	},

	switchmenu(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");
		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSwitchMenuHTML(battle, target)}`);
	},

	catchmenu(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");
		if (battle.battleType === 'battletower') return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Cannot catch in Battle Tower!"])}`);

		if (battle.battleType.includes('double')) {
			const activeOpponents = getActiveSlots(battle.opponentSide.slots);
			if (activeOpponents.length > 1) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMultipleOpponentsCatchErrorHTML()}`);
		}
		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchMenuHTML(getPlayerData(battle.playerId), battle)}`);
	},

	selectcatchtarget(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");
		if (battle.battleType.includes('trainer')) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);

		const ballId = toID(target);
		const activeOpponents = getActiveSlots(battle.opponentSide.slots);
		if (activeOpponents.length === 1) {
			const slotIndex = battle.opponentSide.slots.indexOf(activeOpponents[0]) + 2;
			return this.parse(`/rpg battleaction catch ${ballId} ${slotIndex}`);
		}
		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchTargetHTML(battle, ballId)}`);
	},

	catch(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		const [ballId, slotIndexStr] = target.split(' ');
		const targetSlotIndex = parseInt(slotIndexStr);

		if (!ballId || isNaN(targetSlotIndex)) return this.errorReply("Invalid catch command.");
		if (battle.battleType.includes('trainer')) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);

		const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
		if (!targetSlot || targetSlot.pokemon.hp <= 0) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Invalid target!"])}`);

		const player = getPlayerData(battle.playerId);
		const ballItem = player.inventory.get(ballId);
		if (ballItem?.category !== 'pokeball' || ballItem.quantity < 1) return this.errorReply("You don't have that ball!");

		if (player.party.length >= 6 && player.pc.size >= 100) return this.errorReply("Storage full!");

		removeItemFromInventory(player, ballId, 1);
		const messageLog: string[] = [`<span class="rpg-text-info">${player.name} used a ${ballItem.name}!</span>`];
		const catchResult = performCatchAttempt(battle, ballId, targetSlot);

		for (let i = 1; i <= catchResult.shakes; i++) if (i < 4) messageLog.push(`<i class="rpg-text-muted">...The ball shook...</i>`);

		if (catchResult.success) {
			const zoneId = battle.zoneId;
			saveBattleStatus(battle);
			activeBattles.delete(user.id);
			teraToggleState.delete(user.id);

			const caughtPokemon = targetSlot.pokemon;
			caughtPokemon.caughtIn = ballId;

			// Special ball effects after catching
			if (ballId === 'healball') {
				caughtPokemon.hp = caughtPokemon.maxHp;
				caughtPokemon.status = null;
			}
			if (ballId === 'friendball') {
				caughtPokemon.friendship = 200;
			}
			// Luxury Ball increases friendship gain (handled in friendship gain logic)

			const location = player.party.length < 6 ? "your party" : "PC";
			if (player.party.length < 6) player.party.push(caughtPokemon);
			else storePokemonInPC(player, caughtPokemon);

			const tempSlot = createActivePokemonSlot(caughtPokemon);

			const currentLocationId = toID(player.location);
			const locInfo = getZoneLocation(zoneId, currentLocationId);
			let returnCommand = '/rpg explore';
			if (locInfo?.buildingId && locInfo.roomId) {
				returnCommand = `/rpg building ${locInfo.buildingId} ${locInfo.roomId}`;
			}

			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchSuccessHTML(caughtPokemon, tempSlot, location, zoneId, ballId === 'healball', returnCommand)}`);
		} else {
			messageLog.push(`<span class="rpg-text-error"><strong>${["Oh no! The Pokemon broke free!", "Aww! It appeared to be caught!", "Aargh! Almost had it!", "Gah! It was so close, too!"][catchResult.shakes]}</strong></span>`);
			processTurn(this, battle, room, user, messageLog);
		}
	},

	run(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");
		if (battle.battleType === 'battletower') return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Can't run from Battle Tower!"])}`);
		if (battle.battleType.includes('trainer')) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Can't run from a Trainer!"])}`);

		const playerSlots = getActiveSlots(battle.playerSide.slots);
		for (const slot of playerSlots) {
			const trapping = checkTrappingAbility(slot, battle);
			if (trapping) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Trapped by ${trapping.pokemon.ability}!`])}`);
			if (slot.isTrapped || slot.partiallyTrapped) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`You can't escape!`])}`);
		}

		const zoneId = battle.zoneId;
		saveBattleStatus(battle);
		activeBattles.delete(user.id);
		teraToggleState.delete(user.id);

		const player = getPlayerData(user.id);
		const currentLocationId = toID(player.location);
		const locInfo = getZoneLocation(zoneId, currentLocationId);
		if (locInfo?.buildingId && locInfo.roomId) {
			return this.parse(`/rpg building ${locInfo.buildingId} ${locInfo.roomId}`);
		}

		const location = LOCATIONS[currentLocationId];
		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, location, "You ran away safely!")}`);
	},

	back(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (battle) {
			for (let i = 0; i < battle.playerSide.slots.length; i++) {
				if (battle.playerSide.slots[i] === null || battle.playerSide.slots[i]?.pokemon.hp === 0) delete battle.pendingActions[i];
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You returned to the battle."], undefined, teraToggleState.get(user.id))}`);
		}
	},

	bagmenu(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");
		const player = getPlayerData(battle.playerId);
		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleBagMenuHTML(battle, player)}`);
	},

	itemmenu(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		// Check if item usage is enabled in config
		if (!GameConfig.allowItemUsageInBattle) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Item usage during battle is disabled!"])}`);
		}

		const player = getPlayerData(battle.playerId);
		const usableItems = getBattleUsableItems(player);

		if (usableItems.length === 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You don't have any items to use in battle!"])}`);
		}

		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleItemMenuHTML(battle, player, usableItems)}`);
	},

	selectitemtarget(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		// Check if item usage is enabled in config
		if (!GameConfig.allowItemUsageInBattle) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Item usage during battle is disabled!"])}`);
		}

		const itemId = toID(target);
		const player = getPlayerData(battle.playerId);
		const item = player.inventory.get(itemId);

		if (!item || !canUseItemInBattle(itemId)) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Invalid item!"])}`);
		}

		this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleItemTargetHTML(battle, player, itemId)}`);
	},

	useitem(target, room, user) {
		const battle = activeBattles.get(user.id);
		if (!battle) return this.errorReply("You are not in a battle.");

		// Check if item usage is enabled in config
		if (!GameConfig.allowItemUsageInBattle) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Item usage during battle is disabled!"])}`);
		}

		const [itemIdStr, slotIndexStr] = target.split(' ');
		const itemId = toID(itemIdStr);
		const slotIndex = parseInt(slotIndexStr);

		if (!itemId || isNaN(slotIndex)) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Invalid item command!"])}`);
		}

		const player = getPlayerData(battle.playerId);
		const item = player.inventory.get(itemId);

		if (!item || !canUseItemInBattle(itemId)) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You don't have that item!"])}`);
		}

		if (slotIndex < 0 || slotIndex > 1) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Invalid target slot!"])}`);
		}

		const targetSlot = battle.playerSide.slots[slotIndex];
		if (!targetSlot) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["No Pokémon in that slot!"])}`);
		}

		const pokemon = targetSlot.pokemon;
		const itemData = ITEMS_DATABASE[itemId];
		if (!itemData?.effects) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Invalid item!"])}`);
		}

		const eff = itemData.effects;
		let result: { success: boolean, message: string };

		// Handle special items first
		if (itemId === 'direhit') {
			// Dire Hit raises critical-hit ratio
			if (pokemon.hp <= 0) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${pokemon.species} has fainted!`])}`);
			}
			if (targetSlot.focusEnergy) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${pokemon.species} is already pumped!`])}`);
			}
			targetSlot.focusEnergy = true;
			result = { success: true, message: `${pokemon.species} is getting pumped!` };
		} else if (itemId === 'guardspec') {
			// Guard Spec prevents stat reduction (not implemented yet)
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Guard Spec is not yet implemented!"])}`);
		} else if (eff.revive) {
			result = useBattleRevivalItem(pokemon, itemId);
		} else if (eff.healAmount || eff.healPercent || eff.statusCure) {
			result = useBattleHealingItem(pokemon, itemId);
		} else if (eff.battleStatBoost) {
			// Handle stat boost items
			if (pokemon.hp <= 0) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${pokemon.species} has fainted!`])}`);
			}
			const boost = eff.battleStatBoost;
			const currentStage = targetSlot.statStages[boost.stat];
			if (currentStage >= 6) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${pokemon.species}'s ${boost.stat.toUpperCase()} is already maxed!`])}`);
			}
			const newStage = Math.min(6, currentStage + boost.stages);
			targetSlot.statStages[boost.stat] = newStage as any;
			result = {
				success: true,
				message: `${pokemon.species}'s ${boost.stat.toUpperCase()} ${boost.stages >= 2 ? 'sharply ' : ''}rose!`,
			};
		} else if (eff.ppRestore) {
			// Handle PP restoration items
			if (pokemon.hp <= 0) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${pokemon.species} has fainted!`])}`);
			}

			let restoredAny = false;
			const ppAmount = eff.ppRestore === -1 ? 999 : eff.ppRestore;

			if (eff.ppRestoreAll) {
				// Restore PP to all moves
				for (const move of pokemon.moves) {
					const moveData = getMove(move.id);
					const maxPP = moveData.pp || 5;
					if (move.pp < maxPP) {
						move.pp = Math.min(maxPP, move.pp + ppAmount);
						restoredAny = true;
					}
				}
				result = restoredAny ?
					{ success: true, message: `PP was restored for all of ${pokemon.species}'s moves!` } :
					{ success: false, message: `${pokemon.species}'s moves already have full PP!` };
			} else {
				// For single move PP items, restore the first move that needs PP
				for (const move of pokemon.moves) {
					const moveData = getMove(move.id);
					const maxPP = moveData.pp || 5;
					if (move.pp < maxPP) {
						move.pp = Math.min(maxPP, move.pp + ppAmount);
						result = { success: true, message: `PP was restored for ${pokemon.species}'s ${moveData.name}!` };
						restoredAny = true;
						break;
					}
				}
				if (!restoredAny) {
					result = { success: false, message: `${pokemon.species}'s moves already have full PP!` };
				}
			}
		} else {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["This item cannot be used in battle!"])}`);
		}

		if (!result.success) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [result.message])}`);
		}

		// Remove item from inventory
		removeItemFromInventory(player, itemId, 1);

		// Queue the item usage as an action
		const messageLog = [`Used <strong>${itemData.name}</strong>! ${result.message}`];

		// Process turn after item usage
		processTurn(this, battle, room, user, messageLog);
	},

	help() {
		this.sendReply("Battle commands: /rpg battleaction [move|switch|bagmenu|run]");
	},
};
