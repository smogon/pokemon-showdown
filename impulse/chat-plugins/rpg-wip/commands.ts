/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*/
import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { getMove, checkEvolution, handleLearningMoves, getActiveSlots } from './utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, NPCData } from './interface';
import {
	addItemToInventory,
	removeItemFromInventory,
	useSacredAsh,
	useRevivalItem,
	useHealingItem,
	useVitaminItem,
	useRareCandyItem,
	useExpCandyItem,
	ITEMS_DATABASE,
	ITEM_PRICES,
} from './items';
import { getShopInventory, getNextShopTier } from './shop';
import {
	getPlayerData,
	createPokemon,
	activeBattles,
	storePokemonInPC,
	withdrawPokemonFromPC,
	playerData,
	getInitialMoves,
	savePlayerToDB,
	loadPlayerFromDB,
	hasSaveInDB,
	deletePlayerFromDB,
} from './core';
import {
	createActivePokemonSlot,
	validateMoveAction,
	processTurn,
	checkTrappingAbility,
	saveBattleStatus,
	performCatchAttempt,
	getSlotFromIndex,
	applyHazardEffectsOnSwitchIn,
	handleMirrorHerb,
	startBattleTowerFloor,
	getLocationWeatherData,
	getWeatherStartMessage,
} from './battle-engine';
import {
	generateSellMenuHTML,
	generateExploreHTML,
	generatePokemonInfoHTML,
	generateBattleHTML,
	generateWelcomeHTML,
	generateStarterSelectionHTML,
	generatePokemonSummaryHTML,
	generateEggMoveSelectionHTML,
	generateInventoryHTML,
	generateShopHTML,
	generatePCHTML,
	generateCatchMenuHTML,
	generateCatchTargetHTML,
	generateSwitchMenuHTML,
	generateMoveLearnHTML,
	generateGiveItemPokemonSelectionHTML,
	generateFaintSwitchHTML,
	generateBottomNavigation,
	generateStarterConfirmHTML,
	generateSummarySelectionHTML,
	generateSacredAshResultHTML,
	generateMedicinePokemonSelectionHTML,
	generateItemUseErrorHTML,
	generateItemUseResultHTML,
	generateMiscItemPokemonSelectionHTML,
	generateTeraShardResultHTML,
	generateEvolutionStoneErrorHTML,
	generatePPRestoreResultHTML,
	generateMultipleOpponentsCatchErrorHTML,
	generateCatchSuccessHTML,
	generateGiveItemSelectionHTML,
	generateGiveItemToSpecificPokemonHTML,
	generateTakeItemSelectionHTML,
	generateNPCSelectionHTML,
	generateNPCStarterChoiceHTML,
	generateNPCStarterConfirmHTML,
	generateDBDeleteConfirmHTML,
	generateBattleTowerWelcomeHTML,
	generateBattleTowerFormatSelectedHTML,
	generateBattleTowerFloorCompleteHTML,
	generateBattleTowerLossHTML,
	generatePartyScreenHTML,
	generateProfileHTML,
	generateMoveSelectionHTML,
	generateScriptedEventHTML,
	generateNPCInteractionHTML,
	generatePokedexHTML,
	generateRunHTML,
	generateDepositPCHTML,
	generateWithdrawPCHTML,
	generateNicknameChangedHTML,
	generateItemGivenHTML,
	generateItemTakenHTML,
    generateModeSelectionHTML,
    generateStoryModeStartHTML,
    generateDBSaveHTML,
    generateDBLoadNoSaveHTML,
    generateDBLoadConfirmHTML,
    generateDBDeleteNoSaveHTML,
    generateDBDeleteSuccessHTML
} from './html';
import {
	STARTER_POKEMON,
	TYPE_CHART,
} from './data';
import { BATTLE_TOWER_FORMATS } from './battle-tower';
import { LOCATIONS, ENCOUNTER_ZONES, getStartingLocation } from './locations';
import { TRAINER_DATABASE, TRAINER_LOCATIONS } from './trainers';
import { STORY_EVENTS } from './story-events';
import { NPC_DATABASE } from './npcs';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import * as NPCActions from './npc-actions';
import * as ScriptedEvents from './scripted-events';
import { TOTAL_BADGES } from './badges';

/**
 * Handles all logic for using items in the 'medicine' category.
 */
function handleUseMedicine(
	this: CommandContext,
	player: PlayerData,
	item: { id: string, name: string },
	targetPokemon: RPGPokemon,
	room: ChatRoom,
	user: User
) {
	let result: { success: boolean, message: string } = { success: false, message: "This item cannot be used." };
	let requiresMoveSelection = false;

	switch (item.id) {
	// Revival
	case 'revive':
	case 'maxrevive':
	case 'revivalherb':
		result = useRevivalItem(player, targetPokemon, item.id);
		break;
	// Healing
	case 'potion':
	case 'superpotion':
	case 'hyperpotion':
	case 'maxpotion':
	case 'fullrestore':
	case 'berryjuice':
	case 'freshwater':
	case 'sodapop':
	case 'lemonade':
	case 'moomoomilk':
	case 'tea':
	case 'energyroot':
	case 'energypowder':
		result = useHealingItem(player, targetPokemon, item.id);
		break;
	// Specific Status
	case 'antidote':
		if (targetPokemon.status === 'psn') {
			targetPokemon.status = null;
			result = { success: true, message: `${targetPokemon.species} was cured of poison!` };
		} else {
			result = { success: false, message: `${targetPokemon.species} is not poisoned.` };
		}
		break;
	case 'paralyzeheal':
		if (targetPokemon.status === 'par') {
			targetPokemon.status = null;
			result = { success: true, message: `${targetPokemon.species} was cured of paralysis!` };
		} else {
			result = { success: false, message: `${targetPokemon.species} is not paralyzed.` };
		}
		break;
	case 'awakening':
		if (targetPokemon.status === 'slp') {
			targetPokemon.status = null;
			result = { success: true, message: `${targetPokemon.species} woke up!` };
		} else {
			result = { success: false, message: `${targetPokemon.species} is not asleep.` };
		}
		break;
	case 'burnheal':
		if (targetPokemon.status === 'brn') {
			targetPokemon.status = null;
			result = { success: true, message: `${targetPokemon.species} was cured of its burn!` };
		} else {
			result = { success: false, message: `${targetPokemon.species} is not burned.` };
		}
		break;
	case 'iceheal':
		if (targetPokemon.status === 'frz') {
			targetPokemon.status = null;
			result = { success: true, message: `${targetPokemon.species} was thawed out!` };
		} else {
			result = { success: false, message: `${targetPokemon.species} is not frozen.` };
		}
		break;
	// Full Status
	case 'fullheal':
	case 'healpowder':
		if (targetPokemon.status) {
			targetPokemon.status = null;
			result = { success: true, message: `${targetPokemon.species}'s status was healed!` };
		} else {
			result = { success: false, message: `${targetPokemon.species} has no status condition.` };
		}
		break;
	// PP Restore (Single Move)
	case 'ether':
	case 'maxether':
		requiresMoveSelection = true;
		break;
	// PP Restore (All Moves)
	case 'elixir':
	case 'maxelixir':
		let totalPPRestored = 0;
		for (const move of targetPokemon.moves) {
			const moveData = getMove(move.id);
			const maxPP = moveData.pp || 5;
			if (move.pp < maxPP) {
				const restoreAmount = (item.id === 'elixir') ? 10 : maxPP;
				const oldPP = move.pp;
				move.pp = Math.min(maxPP, move.pp + restoreAmount);
				totalPPRestored += (move.pp - oldPP);
			}
		}
		if (totalPPRestored > 0) {
			result = { success: true, message: `${targetPokemon.species}'s moves had their PP restored!` };
		} else {
			result = { success: false, message: `${targetPokemon.species}'s moves are already at full PP.` };
		}
		break;
	// Vitamins
	case 'hpup':
	case 'protein':
	case 'iron':
	case 'calcium':
	case 'zinc':
	case 'carbos':
		result = useVitaminItem(player, targetPokemon, item.id);
		break;
	default:
		return this.errorReply("This medicine item is not recognized.");
	}

	if (requiresMoveSelection) {
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveSelectionHTML(player, targetPokemon.id, item.id)}`);
	}

	if (!result.success) {
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateItemUseErrorHTML(result.message, item.id)}`);
	}

	// If successful, remove item and show result
	if (!['hpup', 'protein', 'iron', 'calcium', 'zinc', 'carbos'].includes(item.id)) {
		removeItemFromInventory(player, item.id, 1);
	}

	// In-Menu Notification
	return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
}

/**
 * Handles all logic for using items in the 'misc' category.
 */
function handleUseMiscItem(
	this: CommandContext,
	player: PlayerData,
	item: { id: string, name: string },
	targetPokemon: RPGPokemon,
	room: ChatRoom,
	user: User
) {
	const itemId = item.id;

	// Handle specific misc items
	if (itemId === 'rarecandy') {
		const result = useRareCandyItem(player, targetPokemon, room, user);
		if (!result.success) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateItemUseErrorHTML(result.message, 'rarecandy')}`);
		}
		if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
		}
		// In-Menu Notification
        return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
	}

	if (itemId.startsWith('expcandy')) {
		const result = useExpCandyItem(player, targetPokemon, itemId, room, user);
		if (!result.success) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateItemUseErrorHTML(result.message, itemId)}`);
		}
		if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
		}
		// In-Menu Notification
        return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
	}

	if (itemId === 'terashard') {
		const allTypes = Object.keys(TYPE_CHART);
		if (allTypes.length === 0) return this.errorReply("Error: Could not find type list.");
		const newTeraType = allTypes[Math.floor(Math.random() * allTypes.length)];
		const oldTeraType = targetPokemon.teraType;
		targetPokemon.teraType = newTeraType;
		removeItemFromInventory(player, 'terashard', 1);
		const tempSlot = createActivePokemonSlot(targetPokemon);
		const successMsg = `${targetPokemon.species}'s Tera Type changed to ${newTeraType}!`;
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
	}

	if (itemId === 'eggmovetutor') {
		const speciesId = toID(targetPokemon.species);
		const allEggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];
		const learnableEggMoves = allEggMoves.filter(moveId => !targetPokemon.moves.some(m => m.id === toID(moveId)));
		if (learnableEggMoves.length === 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="rpg-infobox"><h2>No Moves Available</h2><p><strong>${targetPokemon.species}</strong> either has no Egg Moves or already knows all of them.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
		}
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateEggMoveSelectionHTML(targetPokemon, learnableEggMoves)}`);
	}

	if (itemId.startsWith('tm-')) {
		// TM Usage
		if (targetPokemon.hp <= 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="rpg-infobox"><h2>Cannot Use TM</h2><p><strong>${targetPokemon.species}</strong> has fainted! Heal it before teaching a move.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
		}

		const moveId = itemId.substring(3); // Remove 'tm-' prefix to get move ID
		const speciesId = toID(targetPokemon.species);
		const tmMoves = MANUAL_LEARNSETS[speciesId]?.tm || [];

		if (!tmMoves.includes(moveId)) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="rpg-infobox"><h2>Incompatible TM</h2><p><strong>${targetPokemon.species}</strong> cannot learn this move from a TM.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
		}

		if (targetPokemon.moves.some(m => m.id === moveId)) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="rpg-infobox"><h2>Move Already Known</h2><p><strong>${targetPokemon.species}</strong> already knows this move!</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
		}

		// Teach the move
		if (targetPokemon.moves.length < 4) {
			const newMoveData = getMove(moveId);
			targetPokemon.moves.push({ id: moveId, pp: newMoveData.pp || 5 });
			removeItemFromInventory(player, itemId, 1);
			
            // In-Menu Notification
            const successMsg = `<strong>${targetPokemon.species}</strong> learned <strong>${newMoveData.name}</strong>!`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		} else {
			// Queue move for replacement
			if (!player.pendingMoveLearnQueue) {
				player.pendingMoveLearnQueue = [];
			}
			player.pendingMoveLearnQueue.push({ pokemonId: targetPokemon.id, moveIds: [moveId] });
			removeItemFromInventory(player, itemId, 1);
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
		}
	}

	if (item.id.endsWith('stone')) {
		const evoMessage = checkEvolution(player, targetPokemon, { room, user }, itemId);

		if (evoMessage) {
			// Evolution was successful
			removeItemFromInventory(player, itemId, 1);
			
			// Check if new moves were queued
			if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} 
            // In-Menu Notification
            return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, evoMessage)}`);
		} else {
			// Evolution failed
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateEvolutionStoneErrorHTML(targetPokemon.species, itemId)}`);
		}
	}

	return this.errorReply("This item cannot be used right now.");
}

// Exported states for battle engine access
export const teraToggleState = new Map<string, boolean>();
export const activeScriptedEvents = new Map<string, string>(); // userId -> eventId

export const commands: ChatCommands = {
	rpg: {
		start(target, room, user) {
			const player = getPlayerData(user.id);
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}

			// Returning players: send to their last location
			if (player.party.length > 0) {
				return this.parse('/rpg explore');
			}

			// New players: show welcome screen
			this.sendReply(`|uhtml|rpg-${user.id}|${generateWelcomeHTML()}`);
		},

		modes(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot change modes during a battle.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateModeSelectionHTML()}`);
		},

		battletower: {
			start(target, room, user) {
				if (activeBattles.has(user.id)) return this.errorReply("You are already in a battle.");
				const player = getPlayerData(user.id);
				// Don't reset floor here, let them continue if they exited
				if (player.battleTowerFloor <= 1) player.battleTowerFloor = 1;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleTowerWelcomeHTML(player.battleTowerFloor)}`);
			},

			selectformat(target, room, user) {
				if (activeBattles.has(user.id)) return this.errorReply("You are already in a battle.");
				const player = getPlayerData(user.id);
				const format = toID(target) || 'battlefactory';

				// Validate format against configuration
				if (!BATTLE_TOWER_FORMATS[format]) {
					return this.errorReply(`Invalid format. Available formats: ${Object.keys(BATTLE_TOWER_FORMATS).join(', ')}`);
				}

				// Don't reset floor here, let them continue if they exited
				if (player.battleTowerFloor <= 1) player.battleTowerFloor = 1;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleTowerFormatSelectedHTML(player.battleTowerFloor, format)}`);
			},

			beginfloor(target, room, user) {
				if (activeBattles.has(user.id)) return this.errorReply("You are already in a battle.");
				const player = getPlayerData(user.id);
				// Safety check: The player must have *started* story mode to have a PlayerData object
				if (player.party.length === 0) return this.errorReply("You must start Story Mode and get a Pokémon before you can enter the Battle Tower.");

				// Parse format from target (defaults to battlefactory)
				const format = toID(target) || 'battlefactory';

				// Call the new function from battle-flow (via battle-engine)
				startBattleTowerFloor(player, player.battleTowerFloor, this, room, user, format);
			},

			nextfloor(target, room, user) {
				// This command is hit after winning a battle
				const oldBattle = activeBattles.get(user.id);
				if (oldBattle && oldBattle.battleType === 'battletower' && oldBattle.battleResult === 'victory') {
					// Store the format to continue with the same format
					const format = oldBattle.battleTowerFormat || 'battlefactory';
					// Battle was won, clear it and start the next
					activeBattles.delete(user.id);
					teraToggleState.delete(user.id);

					const player = getPlayerData(user.id);
					// player.battleTowerFloor should have been incremented by checkBattleEndCondition
					startBattleTowerFloor(player, player.battleTowerFloor, this, room, user, format);
				} else if (activeBattles.has(user.id)) {
					// This is a safety check
					return this.errorReply("You are still in a battle.");
				} else {
					// No battle found, start fresh
					const player = getPlayerData(user.id);
					startBattleTowerFloor(player, player.battleTowerFloor, this, room, user, 'battlefactory');
				}
			},

			'': 'start', // Default action
		},

		continue(target, room, user) {
			// Continue now redirects to start which handles the flow
			return this.parse('/rpg start');
		},

		storymode(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				// Player has already started their adventure, take them to explore
				return this.parse('/rpg explore');
			}
			// Set player location to starting location
			const startingLocation = getStartingLocation();
			player.location = startingLocation.name;
			
			// Directly redirect to explore, skipping the Welcome to Kanto screen
			return this.parse('/rpg explore');
		},

		choosestarter(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const type = target.trim().toLowerCase();
			const starters = STARTER_POKEMON[type as keyof typeof STARTER_POKEMON];
			if (!starters) {
				return this.errorReply("Invalid type. Choose 'fire', 'water', or 'grass'.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStarterSelectionHTML(type, starters)}`);
		},

		selectstarter(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const starterId = toID(target);
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.errorReply("You already have a starter Pokémon!");
			}
			if (!Object.values(STARTER_POKEMON).flat().includes(starterId)) {
				return this.errorReply("Invalid starter Pokémon.");
			}
			try {
				const starterPokemon = createPokemon(starterId, 5);
				player.party.push(starterPokemon);
				player.name = user.name;
				const startingLocation = getStartingLocation();
				player.location = startingLocation.name;
				const species = Dex.species.get(starterId);

				const tempSlot = createActivePokemonSlot(starterPokemon);

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStarterConfirmHTML(tempSlot, species.name, startingLocation.name)}`);
				if (room?.roomid !== 'lobby') {
					room.add(`|c|~RPG Bot|${user.name} has chosen ${species.name} as their starter Pokémon!`).update();
				}
			} catch (error) {
				this.errorReply(`Error creating starter Pokémon: ${error}`);
			}
		},

		menu(target, room, user) {
			// Menu command is removed - redirect to explore which is the new main hub
			return this.parse('/rpg explore');
		},

		learnmove(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this during a battle.");
			}
			const player = getPlayerData(user.id);
			const queueArray = player.pendingMoveLearnQueue;
			if (!queueArray || queueArray.length === 0) {
				return this.errorReply("Your Pokemon is not trying to learn a new move.");
			}
			const queue = queueArray[0]; // Process first Pokemon in queue
			if (!queue || queue.moveIds.length === 0) {
				player.pendingMoveLearnQueue?.shift();
				return this.errorReply("Your Pokemon is not trying to learn a new move.");
			}
			const pokemon = player.party.find(p => p.id === queue.pokemonId);
			if (!pokemon) {
				player.pendingMoveLearnQueue?.shift();
				return this.errorReply("Error: Pokemon not found.");
			}
			const newMoveId = queue.moveIds[0];
			const newMoveData = getMove(newMoveId);

			const newMoveName = newMoveData.name;
			const moveToReplace = toID(target);
			let message = "";
			if (moveToReplace === 'skip') {
				message = `<strong>${pokemon.species}</strong> did not learn <strong>${newMoveName}</strong>.`;
			} else {
				const moveIndex = pokemon.moves.findIndex(m => m.id === moveToReplace);
				if (moveIndex === -1) {
					return this.errorReply("That move is not known by your Pokemon.");
				}
				const oldMoveName = getMove(pokemon.moves[moveIndex].id).name;
				pokemon.moves[moveIndex] = { id: newMoveId, pp: newMoveData.pp || 5 };
				message = `1, 2, and... Poof! <strong>${pokemon.species}</strong> forgot <strong>${oldMoveName}</strong> and learned <strong>${newMoveName}</strong>!`;
			}
			queue.moveIds.shift();
			if (queue.moveIds.length > 0) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				// Remove this Pokemon's entry from queue
				queueArray.shift();
				// Check if there are more Pokemon waiting to learn moves
				if (queueArray.length > 0) {
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
				} else {
					// In-Menu Notification
                    return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, message)}`);
				}
			}
		},

		learneggmove(target, room, user) {
			const player = getPlayerData(user.id);

			const parts = target.split(' ');
			if (parts.length < 2) {
				return this.errorReply("Invalid command parameters.");
			}
			const pokemonId = parts[0];
			const rawMoveId = parts.slice(1).join(' '); // This correctly becomes "magical leaf"

			if (!pokemonId || !rawMoveId) {
				return this.errorReply("Invalid command parameters.");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			const speciesId = toID(pokemon.species);
			const eggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];

			// This check will now correctly use "magical leaf"
			if (!eggMoves.includes(rawMoveId)) {
				return this.errorReply("This is not a valid Egg Move for this Pokemon.");
			}
			if (!removeItemFromInventory(player, 'eggmovetutor', 1)) {
				// This is a safety check in case the player somehow lost the item after initiating the command
				return this.errorReply("Could not use the Egg Move Tutor. Item not found in inventory.");
			}

			const newMoveId = toID(rawMoveId); // Converts "magical leaf" to "magicalleaf"

			if (pokemon.moves.length < 4) {
				const newMoveData = getMove(newMoveId);
				pokemon.moves.push({ id: newMoveId, pp: newMoveData.pp || 5 });
				
                // In-Menu Notification
                const msg = `<strong>${pokemon.species}</strong> learned <strong>${newMoveData.name}</strong>!`;
                return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, msg)}`);
			} else {
				if (!player.pendingMoveLearnQueue) {
					player.pendingMoveLearnQueue = [];
				}
				player.pendingMoveLearnQueue.push({ pokemonId: pokemon.id, moveIds: [newMoveId] });
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			}
		},

		summary(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view a summary during battle.");
			}
			const player = getPlayerData(user.id);
			const targetId = target.trim();
			
			if (!targetId) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSummarySelectionHTML(player)}`);
			}

			// Check Party first
			let pokemon = player.party.find(p => p.id === targetId);
			let source: 'party' | 'pc' = 'party';

			// If not in party, check PC
			if (!pokemon) {
				pokemon = player.pc.get(targetId);
				source = 'pc';
			}

			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party or PC.");
			}

			// Pass the source ('party' or 'pc') so the back button goes to the right place
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePokemonSummaryHTML(pokemon, source)}`);
		},

		profile(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are in a battle!");
			}
			const player = getPlayerData(user.id);
			// Use the new helper function
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateProfileHTML(player)}`);
		},

		party(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view your party during a battle.");
			}
			const player = getPlayerData(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player)}`);
		},

		swapslot(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot swap party slots during a battle.");
			}
			const [slot1Str, slot2Str] = target.split(' ');
			const slot1 = parseInt(slot1Str);
			const slot2 = parseInt(slot2Str);

			if (isNaN(slot1) || isNaN(slot2)) {
				return this.errorReply("Invalid slot numbers. Usage: /rpg swapslot <slot1> <slot2>");
			}

			const player = getPlayerData(user.id);

			if (slot1 < 0 || slot1 >= player.party.length || slot2 < 0 || slot2 >= player.party.length) {
				return this.errorReply("Invalid slot numbers. Slots must be within your party.");
			}

			if (slot1 === slot2) {
				return this.errorReply("Cannot swap a slot with itself.");
			}

			// Swap the Pokemon in the party array
			const temp = player.party[slot1];
			player.party[slot1] = player.party[slot2];
			player.party[slot2] = temp;

			// Show updated party
			this.parse('/rpg party');
		},

		items(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access your bag in battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			const validCategories = ['pokeball', 'medicine', 'berry', 'tm', 'key', 'held', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateInventoryHTML(player, filterCategory)}`);
		},

		useitem(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot use items from the menu during a battle.");
			}
			const [itemId, pokemonId] = target.split(' ').map(arg => toID(arg));
			const player = getPlayerData(user.id);

			if (!itemId) return this.errorReply("Please specify an item to use.");
			if (!player.inventory.has(itemId)) return this.errorReply("You don't have that item.");

			const item = player.inventory.get(itemId)!;

			// Handle Sacred Ash (affects all)
			if (itemId === 'sacredash') {
				const result = useSacredAsh(player);
				if (!result.success) {
					return this.errorReply(result.message);
				}
				
				removeItemFromInventory(player, itemId, 1);
				// In-Menu Notification
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
			}

			// --- Handle "NO POKEMON SELECTED" ---
			if (!pokemonId) {
				// We need to show a selection screen
				if (item.category === 'medicine') {
					const revivalItems = ['revive', 'maxrevive', 'revivalherb'];
					const healingItems = ['potion', 'superpotion', 'hyperpotion', 'maxpotion', 'fullrestore', 'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'berryjuice'];

					if (revivalItems.includes(itemId)) {
						const faintedPokemon = player.party.filter(p => p.hp <= 0);
						if (faintedPokemon.length === 1) {
							return this.parse(`/rpg useitem ${itemId} ${faintedPokemon[0].id}`);
						}
					}

					if (healingItems.includes(itemId)) {
						const damagedPokemon = player.party.filter(p => p.hp > 0 && p.hp < p.maxHp);
						if (damagedPokemon.length === 1) {
							return this.parse(`/rpg useitem ${itemId} ${damagedPokemon[0].id}`);
						}
					}
					// No auto-selection, show the list
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMedicinePokemonSelectionHTML(player, itemId, item.name)}`);
				}

				if (item.category === 'misc') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMiscItemPokemonSelectionHTML(player, itemId, item.name)}`);
				}

				if (item.category === 'held' || item.category === 'berry') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemPokemonSelectionHTML(player, itemId)}`);
				}

				return this.errorReply("This item category cannot be used from the bag.");
			}

			// --- Handle "POKEMON IS SELECTED" ---
			const targetPokemon = player.party.find(p => p.id === pokemonId);
			if (!targetPokemon) return this.errorReply("Pokemon not found in party.");

			// Route to the correct handler
			if (item.category === 'medicine') {
				return handleUseMedicine.call(this, player, item, targetPokemon, room, user);
			}

			if (item.category === 'misc') {
				return handleUseMiscItem.call(this, player, item, targetPokemon, room, user);
			}

			return this.errorReply("This item cannot be used in this way.");
		},

		restorepp(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this during a battle.");
			}

			const [pokemonId, moveId, itemId] = target.split(' ').map(arg => toID(arg));
			if (!pokemonId || !moveId || !itemId) {
				return this.errorReply("Invalid command parameters.");
			}

			const player = getPlayerData(user.id);
			if (!player.inventory.has(itemId)) {
				return this.errorReply("You do not have that item.");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}

			const move = pokemon.moves.find(m => m.id === moveId);
			if (!move) {
				return this.errorReply("Pokemon does not know that move.");
			}

			const moveData = getMove(moveId);
			const maxPP = moveData.pp || 5;

			if (move.pp >= maxPP) {
				return this.errorReply("That move already has full PP.");
			}

			let restoreAmount = 0;
			if (itemId === 'ether') {
				restoreAmount = 10;
			} else if (itemId === 'maxether') {
				restoreAmount = maxPP;
			} else {
				return this.errorReply("That is not a valid PP-restoring item for a single move.");
			}

			const oldPP = move.pp;
			move.pp = Math.min(maxPP, move.pp + restoreAmount);
			const restored = move.pp - oldPP;

			removeItemFromInventory(player, itemId, 1);
			const item = ITEMS_DATABASE[itemId];

			const tempSlot = createActivePokemonSlot(pokemon);
			
			// In-Menu Notification
			const msg = `Used <strong>${item.name}</strong>. Restored <strong>${restored} PP</strong> to ${moveData.name}.`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, msg)}`);
		},

		pc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePCHTML(getPlayerData(user.id))}`);
		},

		depositpc(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot access the PC during a battle.");
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);
			
			if (player.party.length <= 1) return this.errorReply("You must keep at least one Pokemon in your party!");
			const pokemonIndex = player.party.findIndex(p => p.id === pokemonId);
			if (pokemonIndex === -1) return this.errorReply("Pokemon not found in party.");

			const [pokemon] = player.party.splice(pokemonIndex, 1);
			storePokemonInPC(player, pokemon);

			// In-Menu Notification
			const successMsg = `Sent <strong>${pokemon.species}</strong> to the PC.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		},

		withdrawpc(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot access the PC during a battle.");
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);
			
			if (player.party.length >= 6) return this.errorReply("Your party is full!");
			
			const pokemon = withdrawPokemonFromPC(player, pokemonId);
			if (!pokemon) return this.errorReply("Pokemon not found in PC.");
			
			player.party.push(pokemon);
			
			// In-Menu Notification
			const successMsg = `Withdrew <strong>${pokemon.species}</strong> to your party.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePCHTML(player, successMsg)}`);
		},

		shop(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot shop during a battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			// This line has been corrected to include 'medicine' instead of 'potion'
			const validCategories = ['pokeball', 'medicine', 'held', 'berry', 'tm', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateShopHTML(player, filterCategory)}`);
		},

		buy(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot shop during a battle.");
			const [itemId, quantityStr] = target.split(' ');
			const quantity = parseInt(quantityStr) || 1;
			const player = getPlayerData(user.id);
			
			if (!itemId || !ITEMS_DATABASE[itemId]) return this.errorReply("Invalid item specified.");
			if (quantity <= 0) return this.errorReply("You must buy at least 1 item.");

			const locationId = toID(player.location);
			const shopInventory = getShopInventory(locationId, player.badges);
			if (!shopInventory.includes(itemId)) return this.errorReply("This item is not available in this shop. You may need more badges to unlock it!");

			const itemPrice = ITEM_PRICES[itemId];
			if (!itemPrice) return this.errorReply("This item is not for sale.");
			const totalCost = itemPrice * quantity;
			if (player.money < totalCost) return this.errorReply(`You don't have enough money! You need ₽${totalCost}.`);
			
			player.money -= totalCost;
			addItemToInventory(player, itemId, quantity);
			const item = ITEMS_DATABASE[itemId];

			// In-Menu Notification
			const successMsg = `Purchased <strong>${quantity}x ${item.name}</strong> for ₽${totalCost}.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateShopHTML(player, undefined, successMsg)}`);
		},

		sell(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot sell items during a battle.");
			}
			const [itemId, quantityStr] = target.split(' ');
			const quantity = parseInt(quantityStr) || 1;
			const player = getPlayerData(user.id);

			if (!itemId) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSellMenuHTML(player)}`);
			}

			if (quantity <= 0) return this.errorReply("You must sell at least 1 item.");

			const itemInBag = player.inventory.get(itemId);
			if (!itemInBag) return this.errorReply("You don't have that item.");
			if (itemInBag.quantity < quantity) return this.errorReply(`You only have ${itemInBag.quantity} of that item.`);
			if (itemInBag.category === 'key') return this.errorReply("Key items cannot be sold.");

			const purchasePrice = ITEM_PRICES[itemId];
			if (!purchasePrice) return this.errorReply("This item cannot be sold.");

			const sellPrice = Math.floor(purchasePrice / 2);
			const totalGain = sellPrice * quantity;
			
			removeItemFromInventory(player, itemId, quantity);
			player.money += totalGain;

			// In-Menu Notification
			const successMsg = `Sold <strong>${quantity}x ${itemInBag.name}</strong> for ₽${totalGain}.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSellMenuHTML(player, successMsg)}`);
		},

		pokedex(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot use the Pokedex during a battle.");
			}
			const player = getPlayerData(user.id);
            this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePokedexHTML(player)}`);
		},

		explore(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot explore during a battle.");
			}

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];

			if (!currentLocation) {
				return this.errorReply(`Unknown location: ${player.location}`);
			}

			// UPDATED: Pass the full currentLocation object to support the new dynamic HTML
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, currentLocation)}`);
		},

		travel(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot travel during a battle.");

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);

			// If no target, show travel menu
			if (!target) {
				const currentLocation = LOCATIONS[currentLocationId];
				if (!currentLocation) return this.errorReply(`Unknown location: ${player.location}`);

				let travelHTML = `<div class="rpg-infobox"><h2>Travel from ${currentLocation.name}</h2>`;
				travelHTML += `<p>Where would you like to go?</p>`;

				if (currentLocation.connectedLocations.length === 0) {
					travelHTML += `<p>There are no paths from this location yet.</p>`;
				} else {
					for (const connection of currentLocation.connectedLocations) {
						let canAccess = true;
						let lockReason = '';

						if (connection.requiredBadge) {
							if (!player.obtainedBadges.includes(connection.requiredBadge)) {
								canAccess = false;
								lockReason = ` 🔒 (Requires ${connection.requiredBadge})`;
							}
						}

						if (connection.requiredFlag) {
							if (!player.storyFlags.has(connection.requiredFlag)) {
								canAccess = false;
								lockReason = ` 🔒 (Not accessible yet)`;
							}
						}

						if (canAccess) {
							travelHTML += `<button name="send" value="/rpg travel ${connection.id}" class="button">➡️ ${connection.name}</button> `;
						} else {
							travelHTML += `<button class="button" disabled>${connection.name}${lockReason}</button> `;
						}
					}
				}
				travelHTML += `<hr /><p><button name="send" value="/rpg explore" class="button">Back to Explore</button></p>`;
				travelHTML += generateBottomNavigation() + `</div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${travelHTML}`);
			}

			// --- EXECUTE TRAVEL ---
			const targetLocationId = toID(target);
			const targetLocation = LOCATIONS[targetLocationId];
			const currentLocation = LOCATIONS[currentLocationId];

			if (!targetLocation) {
				return this.errorReply("That location doesn't exist.");
			}

			if (!currentLocation) {
				return this.errorReply("Your current location is invalid.");
			}

			// Check if the location is connected
			const connection = currentLocation.connectedLocations.find(c => c.id === targetLocationId);
			if (!connection) {
				return this.errorReply(`You can't travel to ${targetLocation.name} from here.`);
			}

			// Check requirements
			if (connection.requiredBadge && !player.obtainedBadges.includes(connection.requiredBadge)) {
				return this.errorReply(`You need the ${connection.requiredBadge} to travel to ${targetLocation.name}.`);
			}

			if (connection.requiredFlag && !player.storyFlags.has(connection.requiredFlag)) {
				return this.errorReply(`You can't access ${targetLocation.name} yet.`);
			}

			// Perform travel
			player.location = targetLocation.name;
			player.visitedLocations.add(targetLocationId);

			// Check for scripted events
			const triggeredEvents = [];
			if (targetLocation.scriptedEvents) {
				for (const event of targetLocation.scriptedEvents) {
					// Check if event should trigger
					const eventFlagId = `scripted_${event.id}`;

					// Skip if already triggered and marked as triggerOnce
					if (event.triggerOnce && player.storyFlags.has(eventFlagId)) continue;

					// Skip if required flag is not present
					if (event.requiredFlag && !player.storyFlags.has(event.requiredFlag)) continue;

					// Skip if player doesn't have enough badges
					if (event.requiredBadgeCount && player.obtainedBadges.length < event.requiredBadgeCount) continue;

					// Skip if player has too many badges (for early-game only events)
					if (event.maxBadgeCount && player.obtainedBadges.length > event.maxBadgeCount) continue;

					// Skip if preventIfFlag is set and player has that flag
					if (event.preventIfFlag && player.storyFlags.has(event.preventIfFlag)) continue;

					triggeredEvents.push(event);

					// --- FIX: AUTO-COMPLETE LOGIC ---
					// Only mark "Passive" events (dialogue, weather) as done immediately.
					// "Interactive" events (Choices, Battles) must wait for user input.
					const interactiveTypes = [
						'choice', 'quiz', 'moralchoice', 'branching', 
						'wildbattle', 'bossbattle', 'raidbattle', 'trainer', 'gymchallenge', 'elitefour'
					];

					if (event.triggerOnce && !interactiveTypes.includes(event.type)) {
						player.storyFlags.add(eventFlagId);
					}

					// Set flag if specified (usually for discovery/passive events)
					if (event.setFlag && !interactiveTypes.includes(event.type)) {
						player.storyFlags.add(event.setFlag);
					}
				}
			}

			// If there are triggered events, show them
			if (triggeredEvents.length > 0) {
				const firstEvent = triggeredEvents[0];
				let eventHTML = `<div class="rpg-infobox"><h2>Arrived at ${targetLocation.name}</h2>`;
				eventHTML += `<p><em>${targetLocation.description}</em></p><hr />`;

                // --- INTEGRATED SCRIPTED EVENTS HANDLERS ---
                let result = { success: true, message: '' };
                
                switch (firstEvent.type) {
                    case 'cutscene': result = ScriptedEvents.handleCutscene(player, firstEvent); break;
                    case 'choice': 
                        result = { success: true, message: firstEvent.dialogue || 'Make a choice:' };
                        break;
                    case 'quiz':
                        result = { success: true, message: firstEvent.question || 'Quiz Time!' };
                        break;
                    case 'weather': result = ScriptedEvents.handleWeatherChange(player, firstEvent); break;
                    case 'earthquake': result = ScriptedEvents.handleEarthquake(player, firstEvent); break;
                    case 'explosion': result = ScriptedEvents.handleExplosion(player, firstEvent); break;
                    case 'flood': result = ScriptedEvents.handleFlood(player, firstEvent); break;
                    case 'meteor': result = ScriptedEvents.handleMeteor(player, firstEvent); break;
                    case 'eclipse': result = ScriptedEvents.handleEclipse(player, firstEvent); break;
                    case 'timewarp': result = ScriptedEvents.handleTimeWarp(player, firstEvent); break;
                    case 'dimensionrift': result = ScriptedEvents.handleDimensionRift(player, firstEvent); break;
                    case 'swarm': result = ScriptedEvents.handlePokemonSwarm(player, firstEvent); break;
                    case 'bossbattle': result = ScriptedEvents.handleBossBattle(player, firstEvent); break;
                    case 'tournament': result = ScriptedEvents.handleTournament(player, firstEvent, firstEvent.id); break;
                    case 'scavengerhunt': result = ScriptedEvents.handleScavengerHunt(player, firstEvent, firstEvent.id); break;
                    case 'investigation': result = ScriptedEvents.handleInvestigation(player, firstEvent, firstEvent.id); break;
                    case 'stealth': result = ScriptedEvents.handleStealth(player, firstEvent); break;
                    case 'escape': result = ScriptedEvents.handleEscape(player, firstEvent); break;
                    case 'rescue': result = ScriptedEvents.handleRescue(player, firstEvent); break;
                    case 'defense': result = ScriptedEvents.handleDefense(player, firstEvent); break;
                    case 'ambush': result = ScriptedEvents.handleAmbush(player, firstEvent); break;
                    case 'betrayal': result = ScriptedEvents.handleBetrayal(player, firstEvent); break;
                    case 'alliance': result = ScriptedEvents.handleAlliance(player, firstEvent); break;
                    case 'negotiation': result = ScriptedEvents.handleNegotiation(player, firstEvent); break;
                    case 'discovery': result = ScriptedEvents.handleDiscovery(player, firstEvent); break;
                    case 'revelation': result = ScriptedEvents.handleRevelation(player, firstEvent); break;
                    case 'ancientseal': result = ScriptedEvents.handleAncientSeal(player, firstEvent); break;
                    case 'portalopening': result = ScriptedEvents.handlePortalOpening(player, firstEvent); break;
                    case 'dimensionmerge': result = ScriptedEvents.handleDimensionMerge(player, firstEvent); break;
                    case 'timeloop': result = ScriptedEvents.handleTimeLoop(player, firstEvent, firstEvent.id); break;
                    case 'prophecy': result = ScriptedEvents.handleProphecy(player, firstEvent); break;
                    case 'fishingevent': result = ScriptedEvents.handleFishingEvent(player, firstEvent); break;
                    case 'surfingevent': result = ScriptedEvents.handleSurfingEvent(player, firstEvent); break;
                    case 'divingevent': result = ScriptedEvents.handleDivingEvent(player, firstEvent); break;
                    case 'itemball': result = ScriptedEvents.handleItemBall(player, firstEvent); break;
                    case 'hiddenitem': result = ScriptedEvents.handleHiddenItemEvent(player, firstEvent); break;
                    case 'roaming': result = ScriptedEvents.handleRoamingEvent(player, firstEvent); break;
                    case 'multibattle': result = ScriptedEvents.handleMultiBattle(player, firstEvent); break;
                    case 'festival': result = ScriptedEvents.handleFestivalEvent(player, firstEvent); break;
                    case 'secretarea': result = ScriptedEvents.handleSecretArea(player, firstEvent); break;
                    case 'warp': result = ScriptedEvents.handleWarpEvent(player, firstEvent); break;
                    case 'gymchallenge': result = ScriptedEvents.handleGymChallengeEvent(player, firstEvent); break;
                    case 'elitefour': result = ScriptedEvents.handleEliteFourChallengeEvent(player, firstEvent); break;
                    case 'halloffame': result = ScriptedEvents.handleHallOfFameEvent(player, firstEvent); break;
                    case 'safarizone': result = ScriptedEvents.handleSafariZoneEvent(player, firstEvent); break;
                    case 'bugcatching': result = ScriptedEvents.handleBugCatchingContestEvent(player, firstEvent); break;
                    case 'battlefrontier': result = ScriptedEvents.handleBattleFrontierEvent(player, firstEvent); break;
                    case 'flashback': result = ScriptedEvents.handleFlashback(player, firstEvent); break;
                    case 'dreamsequence': result = ScriptedEvents.handleDreamSequence(player, firstEvent); break;
                    case 'reputationchange': result = ScriptedEvents.handleReputationChange(player, firstEvent); break;
                    case 'companionjoin': result = ScriptedEvents.handleCompanionJoin(player, firstEvent); break;
                    case 'companionleave': result = ScriptedEvents.handleCompanionLeave(player, firstEvent); break;
                    case 'moralchoice': 
                         result = { success: true, message: firstEvent.dialogue || 'Make a choice:' };
                        break;
                    case 'lore': result = ScriptedEvents.handleLoreDiscovery(player, firstEvent, firstEvent.id); break;
                    case 'branching': 
                         result = { success: true, message: firstEvent.dialogue || 'Choose a path:' };
                        break;
                    case 'chapter': result = ScriptedEvents.handleChapterTransition(player, firstEvent); break;
                    case 'epilogue': result = ScriptedEvents.handleEpilogue(player, firstEvent); break;
                    case 'collectible': result = ScriptedEvents.handleCollectibleItem(player, firstEvent, firstEvent.id); break;
                    case 'voicefromabove': result = ScriptedEvents.handleVoiceFromAbove(player, firstEvent); break;
                    case 'memory': result = ScriptedEvents.handleMemoryRestoration(player, firstEvent, firstEvent.id); break;
                    case 'hordebattle': result = ScriptedEvents.handleHordeBattle(player, firstEvent); break;
                    case 'inversebattle': result = ScriptedEvents.handleInverseBattle(player, firstEvent); break;
                    case 'rotationbattle': result = ScriptedEvents.handleRotationBattle(player, firstEvent); break;
                    case 'battleroyale': result = ScriptedEvents.handleBattleRoyale(player, firstEvent); break;
                    case 'triplebattle': result = ScriptedEvents.handleTripleBattle(player, firstEvent); break;
                    case 'skybattle': result = ScriptedEvents.handleSkyBattle(player, firstEvent); break;
                    case 'underwaterbattle': result = ScriptedEvents.handleUnderwaterBattle(player, firstEvent); break;
                    case 'gauntletbattle': result = ScriptedEvents.handleGauntletBattle(player, firstEvent, firstEvent.id); break;
                    case 'championdefense': result = ScriptedEvents.handleChampionDefense(player, firstEvent, firstEvent.id); break;
                    case 'battletest': result = ScriptedEvents.handleBattleTest(player, firstEvent); break;
                    case 'warbattle': result = ScriptedEvents.handleWarBattle(player, firstEvent, firstEvent.id); break;

                    // --- FIX: WILD BATTLE CREATION ---
                    case 'wildbattle':
                        if (firstEvent.pokemon) {
                            const newPokemon = createPokemon(firstEvent.pokemon.species, firstEvent.pokemon.level);
                            if (firstEvent.pokemon.moves) {
                                newPokemon.moves = firstEvent.pokemon.moves.map(moveId => {
                                    const moveData = getMove(moveId);
                                    return { id: moveId, pp: moveData.pp || 5 };
                                });
                            }
                            if (firstEvent.pokemon.shiny) newPokemon.shiny = true;

                            // Store in temp PC slot using the specific ID format required by scriptedbattle
                            player.pc.set(`scripted_wild_${firstEvent.id}`, newPokemon);

                            result = { success: true, message: firstEvent.dialogue || `A wild ${newPokemon.species} appeared!` };
                        } else {
                            result = { success: false, message: "Error: No Pokemon data." };
                        }
                        break;

                    // --- FIX: RAID BATTLE LOGIC ---
                    case 'raidbattle':
                        const raidRes = ScriptedEvents.handleRaidBattle(player, firstEvent);
                        result = { success: true, message: raidRes.message };
                        if (raidRes.raidBoss) {
                             const level = raidRes.raidLevel ? raidRes.raidLevel * 10 : 50;
                             const raidMon = createPokemon(raidRes.raidBoss.species, level);
                             player.pc.set(`scripted_wild_${firstEvent.id}`, raidMon);
                        }
                        break;

                    // Legacy Handlers
                    case 'dialogue': result = { success: true, message: firstEvent.dialogue || '' }; break;
                    case 'item': 
                        if (firstEvent.itemId && firstEvent.itemQuantity) {
                            addItemToInventory(player, firstEvent.itemId, firstEvent.itemQuantity);
                            result = { success: true, message: `${firstEvent.dialogue || ''}<br>Received ${firstEvent.itemQuantity}x ${firstEvent.itemId}!` };
                        }
                        break;
                    case 'pokemon':
                        if (firstEvent.pokemon) {
                            const newPokemon = createPokemon(firstEvent.pokemon.species, firstEvent.pokemon.level);
                            if (player.party.length < 6) player.party.push(newPokemon);
                            else storePokemonInPC(player, newPokemon);
                            result = { success: true, message: `${firstEvent.dialogue || ''}<br>Received ${firstEvent.pokemon.species}!` };
                        }
                        break;
                    case 'trainer':
                         result = { success: true, message: firstEvent.dialogue || 'Battle start!' };
                         break;

                    default: result = { success: true, message: firstEvent.dialogue || 'Event occurred.' }; break;
                }

				// If boss battle handler returned bossTrainerId, update event for display
				if (firstEvent.type === 'bossbattle' && (result as any).bossTrainerId) {
					firstEvent.bossTrainerId = (result as any).bossTrainerId;
				}
                
                // Use the updated UI generator
				const html = generateScriptedEventHTML(firstEvent, result.message);
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			// Streamlined Travel (No Event)
			const msg = `You arrived at ${targetLocation.name}.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, targetLocation, msg)}`);
		},

		eventchoice(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("Cannot do this in battle.");

			const player = getPlayerData(user.id);
			const location = LOCATIONS[toID(player.location)];
			const index = parseInt(target);

			// Identify active event
			let activeEvent = null;
			if (location && location.scriptedEvents) {
				for (const event of location.scriptedEvents) {
					const eventFlagId = `scripted_${event.id}`;
					// Logic must match travel: skip if ALREADY completed
					if (event.triggerOnce && player.storyFlags.has(eventFlagId)) continue;
                    // ... (other skips) ...
                    if (event.requiredFlag && !player.storyFlags.has(event.requiredFlag)) continue;
                    if (event.requiredBadgeCount && player.obtainedBadges.length < event.requiredBadgeCount) continue;
                    if (event.maxBadgeCount && player.obtainedBadges.length > event.maxBadgeCount) continue;
                    if (event.preventIfFlag && player.storyFlags.has(event.preventIfFlag)) continue;
                    
					activeEvent = event;
					break;
				}
			}

			if (!activeEvent) return this.errorReply("No active event found.");

			let result = { success: false, message: "Invalid choice." };

			if (activeEvent.type === 'choice') {
				result = ScriptedEvents.handleChoice(player, activeEvent, index);
			} else if (activeEvent.type === 'quiz') {
				result = ScriptedEvents.handleQuiz(player, activeEvent, index);
			} else if (activeEvent.type === 'moralchoice') {
				result = ScriptedEvents.handleMoralChoice(player, activeEvent, index);
			} else if (activeEvent.type === 'branching') {
				result = ScriptedEvents.handleBranchingPath(player, activeEvent, index);
			}

			if (result.success) {
				// Notification style
				this.sendReplyBox(result.message);
				
				// Mark event as complete NOW, after success
				if (activeEvent.triggerOnce) {
					player.storyFlags.add(`scripted_${activeEvent.id}`);
				}

				return this.parse('/rpg explore');
			} else {
				return this.errorReply(result.message);
			}
		},

		// --- NEW COMMAND: COMPLETE EVENT ---
		completeevent(target, room, user) {
			const eventId = target.trim();
			const player = getPlayerData(user.id);

			if (eventId) {
				player.storyFlags.add(`scripted_${eventId}`);
				activeScriptedEvents.delete(user.id);
				// Use Notification
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, LOCATIONS[toID(player.location)], "Battle Won!")}`);
			}
			
			return this.parse('/rpg explore');
		},

		building(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot enter a building during a battle.");
			}

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];

			if (!currentLocation) {
				return this.errorReply(`Unknown location: ${player.location}`);
			}

			if (!target) {
				return this.errorReply("Please specify which building to enter.");
			}

			const buildingId = toID(target);
			const building = currentLocation.buildings?.find(b => toID(b.id) === buildingId);

			if (!building) {
				return this.errorReply("That building doesn't exist in this location.");
			}

			// Check accessibility
			if (building.accessible === false) {
				return this.errorReply("This building is currently locked.");
			}
			if (building.requiredFlag && !player.storyFlags.has(building.requiredFlag)) {
				return this.errorReply("You can't access this building yet.");
			}

			// Handle different building types
			let buildingHTML = `<div class="rpg-infobox"><div class="rpg-text-center"><h2><b>${building.name}</b></h2><p><em>${building.description}</em></p></div><hr>`;

			// NPCs in this building
			if (building.npcs && building.npcs.length > 0) {
				buildingHTML += '<p><strong>People here:</strong></p>';
				for (const npcId of building.npcs) {
					const npc = NPC_DATABASE[npcId];
					if (npc) {
						// Check if NPC is accessible based on flags
						if (npc.flags && !npc.flags.every(flag => player.storyFlags.has(flag))) {
							continue;
						}
						buildingHTML += `<button name="send" value="/rpg talknpc ${npcId}" class="button">💬 ${npc.name}</button> `;
					}
				}
			}

			// Building-specific actions
			buildingHTML += '<p><strong>Actions:</strong></p>';

			if (building.type === 'pokecenter') {
				buildingHTML += `<button name="send" value="/rpg pc" class="button">💻 Access PC</button> `;
			}

			if (building.type === 'pokemart' || building.type === 'department') {
				buildingHTML += `<button name="send" value="/rpg shop" class="button">🏪 Shop</button> `;
			}

			if (building.type === 'gym' && building.gymLeaderId) {
				const gymLeaderId = building.gymLeaderId;
				const gymData = TRAINER_DATABASE[gymLeaderId];
				if (gymData && !player.defeatedTrainers.has(gymLeaderId)) {
					buildingHTML += `<button name="send" value="/rpg challenge ${gymLeaderId}" class="button">⚔️ Challenge ${gymData.name}</button> `;
				} else if (gymData && player.defeatedTrainers.has(gymLeaderId)) {
					buildingHTML += `<p><em>You already defeated ${gymData.name}!</em></p>`;
				}
			}

			buildingHTML += `<hr /><p><button name="send" value="/rpg explore" class="button">← Leave Building</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${buildingHTML}`);
		},

		wildpokemon(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}

			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("All your Pokémon have fainted!");
			}

			const zoneId = target.trim();
			const zone = ENCOUNTER_ZONES[zoneId];
			if (!zone) {
				return this.errorReply("This is not a valid area to explore. Use /rpg explore to see available areas.");
			}

			const battleType = zone.battleType || 'single';
			const battleMessages: string[] = [];
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			let finalBattleType: BattleState['battleType'] = 'wild';

			try {
				// --- Player Pokemon ---
				playerSlots[0] = createActivePokemonSlot(activeParty[0]);

				// --- Wild Pokemon ---
				const wildSpecies1 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
				const [minLevel, maxLevel] = zone.levelRange;
				const wildLevel1 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
				const wildPokemon1 = createPokemon(wildSpecies1, wildLevel1);
				opponentSlots[0] = createActivePokemonSlot(wildPokemon1);

				if (battleType === 'double') {
					finalBattleType = 'wild_double';
					// Add second player Pokemon if available
					if (activeParty[1]) {
						playerSlots[1] = createActivePokemonSlot(activeParty[1]);
					}

					// Add second wild Pokemon
					const wildSpecies2 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
					const wildLevel2 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
					const wildPokemon2 = createPokemon(wildSpecies2, wildLevel2);
					opponentSlots[1] = createActivePokemonSlot(wildPokemon2);
					battleMessages.push(`A wild ${wildPokemon1.species} and ${wildPokemon2.species} appeared!`);
				} else {
					finalBattleType = 'wild';
					battleMessages.push(`A wild ${wildPokemon1.species} appeared!`);
				}

				const opponentParty = [opponentSlots[0].pokemon];
				if (opponentSlots[1]) opponentParty.push(opponentSlots[1].pokemon);

				const locationWeatherData = getLocationWeatherData(player);
				// Add weather message if there is location weather
				if (locationWeatherData.weather) {
					battleMessages.push(getWeatherStartMessage(locationWeatherData.weather.type));
				}

				// Create the battle state object
				const battle: BattleState = {
					battleType: finalBattleType,
					opponentName: `Wild Pokémon`,
					opponentParty,
					opponentMoney: 0,
					playerSlots,
					opponentSlots,
					pendingActions: {},
					playerId: user.id,
					turn: 0,
					zoneId,
					playerHazards: [],
					opponentHazards: [],
					weather: locationWeatherData.weather,
					locationWeather: locationWeatherData.locationWeather,
					trickRoomTurns: 0,
					magicRoomTurns: 0,
					wonderRoomTurns: 0,
					terrain: undefined, // Will be set by abilities
					playerShouldSwitch: undefined,
					pendingPivot: undefined,
					aiPendingPivot: undefined,
					forceEnd: false,
					playerTerastallizeUsed: false,
					opponentTerastallizeUsed: false,
					playerQuickGuard: false,
					opponentQuickGuard: false,
					playerWideGuard: false,
					opponentWideGuard: false,
					playerCraftyShield: false,
					opponentCraftyShield: false,
					playerReflectTurns: 0,
					opponentReflectTurns: 0,
					playerLightScreenTurns: 0,
					opponentLightScreenTurns: 0,
					playerAuroraVeilTurns: 0,
					opponentAuroraVeilTurns: 0,
					gravityTurns: 0,
					mudSportTurns: 0,
					waterSportTurns: 0,
					fairyLockTurns: 0,
					ionDelugeTurns: 0,
					playerFutureMoves: [],
					opponentFutureMoves: [],
					battleLog: [],
					floor: 0,
					overridePlayerParty: null,
				};

				// Apply switch-in abilities (which modifies the 'battle' object)
				if (playerSlots[0]) {
					applyHazardEffectsOnSwitchIn(playerSlots[0], battle, true, battleMessages);
				}
				if (playerSlots[1]) {
					applyHazardEffectsOnSwitchIn(playerSlots[1], battle, true, battleMessages);
				}
				if (opponentSlots[0]) {
					applyHazardEffectsOnSwitchIn(opponentSlots[0], battle, false, battleMessages);
				}
				if (opponentSlots[1]) {
					applyHazardEffectsOnSwitchIn(opponentSlots[1], battle, false, battleMessages);
				}

				// Set the modified battle object as the active battle
				activeBattles.set(user.id, battle);

				// Add initial messages to battle log
				battle.battleLog.push(...battleMessages);

				// Generate HTML using the modified battle object
				this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, teraToggleState.get(user.id))}`);
			} catch (error) {
				this.errorReply(`Error generating wild Pokémon: ${error}`);
			}
		},

		scriptedbattle(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You are already in a battle!");

			// target is the event ID (e.g. "red_gyarados")
			const eventId = target.trim();
			const player = getPlayerData(user.id);
			
			// Look for the stored pokemon using the prefix
			const tempKey = `scripted_wild_${eventId}`;
			const wildPokemon = player.pc.get(tempKey);

			if (!wildPokemon) {
				return this.errorReply("This scripted encounter is no longer available.");
			}

			// Track this event for completion
			activeScriptedEvents.set(user.id, eventId);

			// Remove from PC (it was only temporarily stored)
			player.pc.delete(tempKey);

			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) return this.errorReply("Your team is fainted!");

			const battleMessages: string[] = [];
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];

			try {
				playerSlots[0] = createActivePokemonSlot(activeParty[0]);
				opponentSlots[0] = createActivePokemonSlot(wildPokemon);
				battleMessages.push(`A wild ${wildPokemon.shiny ? '✨ ' : ''}${wildPokemon.species} appeared!`);

				const locationWeatherData3 = getLocationWeatherData(player);
				if (locationWeatherData3.weather) {
					battleMessages.push(getWeatherStartMessage(locationWeatherData3.weather.type));
				}

				const battle: BattleState = {
					battleType: 'wild',
					opponentName: `Wild ${wildPokemon.species}`,
					opponentParty: [wildPokemon],
					opponentMoney: 0,
					playerSlots,
					opponentSlots,
					pendingActions: {},
					playerId: user.id,
					turn: 0,
					zoneId: 'scripted',
					playerHazards: [],
					opponentHazards: [],
					weather: locationWeatherData3.weather,
					locationWeather: locationWeatherData3.locationWeather,
					terrain: undefined,
					playerShouldSwitch: undefined,
					pendingPivot: undefined,
					aiPendingPivot: undefined,
					forceEnd: false,
					trickRoomTurns: 0,
					magicRoomTurns: 0,
					wonderRoomTurns: 0,
					gravityTurns: 0,
					mudSportTurns: 0,
					waterSportTurns: 0,
					fairyLockTurns: 0,
					ionDelugeTurns: 0,
					playerQuickGuard: false,
					opponentQuickGuard: false,
					playerWideGuard: false,
					opponentWideGuard: false,
					playerCraftyShield: false,
					opponentCraftyShield: false,
					playerReflectTurns: 0,
					opponentReflectTurns: 0,
					playerLightScreenTurns: 0,
					opponentLightScreenTurns: 0,
					playerAuroraVeilTurns: 0,
					opponentAuroraVeilTurns: 0,
					playerTerastallizeUsed: false,
					opponentTerastallizeUsed: false,
					playerFutureMoves: [],
					opponentFutureMoves: [],
					battleLog: [],
					floor: 0,
					overridePlayerParty: null,
				};

				if (playerSlots[0]) applyHazardEffectsOnSwitchIn(playerSlots[0], battle, true, battleMessages);
				if (opponentSlots[0]) applyHazardEffectsOnSwitchIn(opponentSlots[0], battle, false, battleMessages);

				activeBattles.set(user.id, battle);
				battle.battleLog.push(...battleMessages);

				this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, teraToggleState.get(user.id), eventId)}`);
			} catch (error) {
				activeBattles.delete(user.id);
				teraToggleState.delete(user.id);
				return this.errorReply("Error starting battle: " + String(error));
			}
		},

		challenge(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You are already in a battle!");

			// Parse: trainerId [eventId]
			const args = target.split(' ');
			const trainerId = toID(args[0]);
			const eventId = args[1]; // Optional

			if (eventId) {
				activeScriptedEvents.set(user.id, eventId);
			}
			
			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("You must heal your Pokémon before challenging a trainer!");
			}

			const trainerSpec = TRAINER_DATABASE[trainerId];
			if (!trainerSpec) {
				return this.errorReply("That trainer could not be found.");
			}

			// Create fresh instances of the trainer's Pokémon
			const trainerParty: RPGPokemon[] = [];
			for (const spec of trainerSpec.party) {
				const pokemon = createPokemon(spec.species, spec.level);
				if (spec.moves) {
					pokemon.moves = spec.moves.map(moveId => {
						const moveData = getMove(moveId);
						return { id: moveId, pp: moveData.pp || 5 };
					});
				}
				if (spec.item) {
					pokemon.item = spec.item;
				}
				trainerParty.push(pokemon);
			}

			if (trainerParty.length === 0) {
				return this.errorReply("This trainer has no Pokémon!");
			}

			const battleType = trainerSpec.battleType || 'single';
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			let finalBattleType: BattleState['battleType'] = 'trainer';

			// --- Player Pokemon ---
			playerSlots[0] = createActivePokemonSlot(activeParty[0]);

			// --- Opponent Pokemon ---
			opponentSlots[0] = createActivePokemonSlot(trainerParty[0]);

			if (battleType === 'double') {
				finalBattleType = 'trainer_double';
				// Add second player Pokemon if available
				if (activeParty[1]) {
					playerSlots[1] = createActivePokemonSlot(activeParty[1]);
				}
				// Add second opponent Pokemon if available
				if (trainerParty[1]) {
					opponentSlots[1] = createActivePokemonSlot(trainerParty[1]);
				}
			} else {
				finalBattleType = 'trainer';
			}

			const locationWeatherData2 = getLocationWeatherData(player);

			const startMessage = trainerSpec.dialogue?.start || `You are challenged by ${trainerSpec.name}!`;
			const challengeMessages = [startMessage];

			// Create the battle state object
			const battle: BattleState = {
				battleType: finalBattleType,
				opponentName: trainerSpec.name,
				opponentParty: trainerParty,
				opponentMoney: trainerSpec.money,
				trainerId,
				playerSlots,
				opponentSlots,
				pendingActions: {},
				playerId: user.id,
				turn: 0,
				zoneId: 'trainer_battle',
				playerHazards: [],
				opponentHazards: [],
				weather: locationWeatherData2.weather,
				locationWeather: locationWeatherData2.locationWeather,
				trickRoomTurns: 0,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				terrain: undefined, // Will be set by abilities
				playerShouldSwitch: undefined,
				pendingPivot: undefined,
				aiPendingPivot: undefined,
				forceEnd: false,
				playerTerastallizeUsed: false,
				opponentTerastallizeUsed: false,
				playerQuickGuard: false,
				opponentQuickGuard: false,
				playerWideGuard: false,
				opponentWideGuard: false,
				playerCraftyShield: false,
				opponentCraftyShield: false,
				playerReflectTurns: 0,
				opponentReflectTurns: 0,
				playerLightScreenTurns: 0,
				opponentLightScreenTurns: 0,
				playerAuroraVeilTurns: 0,
				opponentAuroraVeilTurns: 0,
				gravityTurns: 0,
				mudSportTurns: 0,
				waterSportTurns: 0,
				fairyLockTurns: 0,
				ionDelugeTurns: 0,
				playerFutureMoves: [],
				opponentFutureMoves: [],
				battleLog: [],
				floor: 0,
				overridePlayerParty: null,
			};

			// Apply switch-in abilities (which modifies the 'battle' object)
			if (playerSlots[0]) {
				applyHazardEffectsOnSwitchIn(playerSlots[0], battle, true, challengeMessages);
			}
			if (playerSlots[1]) {
				applyHazardEffectsOnSwitchIn(playerSlots[1], battle, true, challengeMessages);
			}
			if (opponentSlots[0]) {
				applyHazardEffectsOnSwitchIn(opponentSlots[0], battle, false, challengeMessages);
			}
			if (opponentSlots[1]) {
				applyHazardEffectsOnSwitchIn(opponentSlots[1], battle, false, challengeMessages);
			}

			// Set the modified battle object as the active battle
			activeBattles.set(user.id, battle);

			// Add weather message if there is location weather
			if (locationWeatherData2.weather) {
				challengeMessages.push(getWeatherStartMessage(locationWeatherData2.weather.type));
			}

			// Add initial messages to battle log
			battle.battleLog.push(...challengeMessages);

			// Generate HTML using the modified battle object
			this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, teraToggleState.get(user.id), eventId)}`);
		},

		battle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			// Get all available zone IDs from the configuration object
			const availableZoneIds = Object.keys(ENCOUNTER_ZONES);

			if (availableZoneIds.length === 0) {
				return this.errorReply("There are no wild Pokémon zones configured yet.");
			}

			// Select a random zone ID from the list of available zones
			const randomZoneId = availableZoneIds[Math.floor(Math.random() * availableZoneIds.length)];

			// Use this.parse() to execute the wildpokemon command with the random zone
			// This avoids duplicating code and keeps everything streamlined.
			return this.parse(`/rpg wildpokemon ${randomZoneId}`);
		},

		battleaction: {
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

				if (attackerSlotIndex !== 0 && attackerSlotIndex !== 1) {
					return this.errorReply("Invalid attacker slot. Must be 0 or 1.");
				}
				const attackerSlot = battle.playerSlots[attackerSlotIndex];
				if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
					return this.errorReply("This Pokémon is not in battle or has fainted.");
				}

				if (battle.pendingActions[attackerSlotIndex]) {
					return this.errorReply(`${attackerSlot.pokemon.species} is already waiting to move.`);
				}

				const moveData = getMove(moveId);
				if (!moveData.exists) return this.errorReply(`Move '${moveId}' not found.`);

				const partyToUse = battle.overridePlayerParty || getPlayerData(battle.playerId).party;
				const currentPokemon = partyToUse.find(p => p.id === attackerSlot.pokemon.id);

				if (moveId !== 'struggle' && !currentPokemon?.moves.some(m => m.id === moveData.id)) {
					// This check is tricky. The `attackerSlot.pokemon` is the *instance* of the Pokemon.
					// We should check `attackerSlot.pokemon.moves` directly.
					if (moveId !== 'struggle' && !attackerSlot.pokemon.moves.some(m => m.id === moveData.id)) {
						return this.errorReply(`${attackerSlot.pokemon.species} does not know ${moveData.name}.`);
					}
				}

				// --- Terastallization validation ---
				if (shouldTerastallize) {
					if (battle.playerTerastallizeUsed) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"])}`);
					}
					if (attackerSlot.terastallized) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} has already Terastallized!`])}`);
					}
				}

				// --- REFACTORED VALIDATION ---
				const validationError = validateMoveAction(attackerSlot, moveId, battle);
				if (validationError) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [validationError])}`);
				}
				// --- END REFACTORED VALIDATION ---

				// --- Queue the action ---
				battle.pendingActions[attackerSlotIndex] = {
					actionType: 'move',
					moveId: moveData.id,
					targetSlot: targetSlotIndex,
					pokemonId: attackerSlot.pokemon.id,
					terastallize: shouldTerastallize,
				};

				// Clear the toggle state after move is queued
				teraToggleState.delete(user.id);

				const messageLog = shouldTerastallize ?
					[`${attackerSlot.pokemon.species} is ready to Terastallize and use ${moveData.name}!`] :
					[`${attackerSlot.pokemon.species} is ready to use ${moveData.name}!`];

				// --- Check if all player actions are submitted ---
				const activePlayerSlots = battle.playerSlots.filter(s => s && s.pokemon.hp > 0).length;
				const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

				if (submittedPlayerActions === activePlayerSlots) {
					// All players have moved, process the turn
					processTurn(this, battle, room, user);
				} else {
					// Waiting for other player's move
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},
			// --- NEW FUNCTION ---
			selecttarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const parts = target.split(' ');
				const attackerSlotStr = parts[0];
				const moveId = parts[1];
				const shouldTerastallize = parts[2] === 'terastallize';

				const attackerSlotIndex = parseInt(attackerSlotStr);

				if (isNaN(attackerSlotIndex) || !moveId) {
					return this.errorReply("Invalid command.");
				}

				// Validate terastallization if requested
				if (shouldTerastallize) {
					const attackerSlot = battle.playerSlots[attackerSlotIndex];
					if (!attackerSlot) {
						return this.errorReply("Invalid slot.");
					}
					if (battle.playerTerastallizeUsed) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"], undefined, teraToggleState.get(user.id))}`);
					}
					if (attackerSlot.terastallized) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} has already Terastallized!`], undefined, teraToggleState.get(user.id))}`);
					}
				}

				// Re-render the UI in "target selection" mode (don't show toggle in target selection)
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [shouldTerastallize ? `Select a target for ${getMove(moveId).name} (with Terastallization).` : `Select a target for ${getMove(moveId).name}.`], { attackerSlotIndex, moveId, shouldTerastallize })}`);
			},
			// --- END NEW FUNCTION ---

			teratoggle(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const newState = target === 'on';
				teraToggleState.set(user.id, newState);

				// Re-render the battle UI with the new toggle state
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, newState)}`);
			},

			forceswitch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [slotStr, pokemonId] = target.split(' ');
				const slotToFill = parseInt(slotStr);

				if (isNaN(slotToFill) || !pokemonId) {
					return this.errorReply("Invalid switch command.");
				}

				if (pokemonId === 'cancel') {
					// This happens if a player U-turns with no Pokemon to switch to.
					// We must clear the pivot flag.
					if (battle.pendingPivot?.slotIndex === slotToFill) {
						// Put the Pokemon back
						battle.playerSlots[slotToFill as 0 | 1] = battle.pendingPivot.slot;
						battle.pendingPivot = undefined;
					}
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["The battle continues..."])}`);
				}

				const player = getPlayerData(battle.playerId);

				const partyToUse = battle.overridePlayerParty || player.party;

				// Find the Pokemon in the correct party
				const partyIndex = partyToUse.findIndex(p => p.id === pokemonId && p.hp > 0);
				if (partyIndex === -1) {
					return this.errorReply("Invalid Pokemon or it has fainted.");
				}

				// Check if this Pokemon is already in battle
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonId)) {
					return this.errorReply("This Pokemon is already in battle.");
				}

				// Check if the slot is actually empty (it should be, if faint or pivot)
				if (battle.playerSlots[slotToFill] !== null && !battle.pendingPivot) {
					return this.errorReply("This slot is not empty.");
				}

				// --- Execute the Switch ---
				const nextPokemon = partyToUse[partyIndex]; // Get from correct party
				const newSlot = createActivePokemonSlot(nextPokemon);

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const messageLog = [`<span class="rpg-text-info">Go, ${nextPokemon.species}!</span>`];

				// Check if this is a pivot switch
				if (battle.pendingPivot?.slotIndex === slotToFill) {
					const pivotingPokemon = battle.pendingPivot.slot.pokemon;

					if (!battle.overridePlayerParty) {
						const pivotIndex = player.party.findIndex(p => p.id === pivotingPokemon.id);
						if (pivotIndex === -1) {
							player.party.push(pivotingPokemon);
						}
					}

					// Handle Baton Pass
					if (battle.pendingPivot.isBatonPass) {
						newSlot.statStages = { ...battle.pendingPivot.slot.statStages };
						newSlot.isConfused = battle.pendingPivot.slot.isConfused;
						newSlot.confusionCounter = battle.pendingPivot.slot.confusionCounter;
						newSlot.isSeeded = battle.pendingPivot.slot.isSeeded;
						// (Copy any other volatiles you want to pass)
						messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
					}
					battle.pendingPivot = undefined; // Clear the pivot flag
				}
				// (If not a pivot, it was a faint switch. The fainted mon is already in the party/overrideParty at 0 HP)

				battle.playerSlots[slotToFill as 0 | 1] = newSlot;

				// --- Apply Hazards ---
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`<span class="rpg-text-error"><strong>${newSlot.pokemon.species} fainted upon entry!</strong></span>`);
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}

				// --- Check if more switches are needed ---
				const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';
				const slotsToCheck = isDoubleBattle ? [0, 1] : [0];

				const needsAnotherSwitch = slotsToCheck.some(i => battle.playerSlots[i] === null) &&
					partyToUse.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));

				if (needsAnotherSwitch) {
					// Another slot is empty, show the switch screen again
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
				} else {
					// All slots are filled, the forced switch is complete
					// Clear any pending actions since the turn is over (if it was a faint)
					if (!battle.pendingPivot) { // Don't clear if it was a mid-turn pivot
						battle.pendingActions = {};
					}
					// Show the battle screen
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},

			playerswitch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [slotStr, pokemonIdIn] = target.split(' ');
				const slotToSwitchOut = parseInt(slotStr);

				if (isNaN(slotToSwitchOut) || !pokemonIdIn) {
					return this.errorReply("Invalid switch command. Usage: /rpg battleaction playerswitch [slot] [pokemonId]");
				}

				const outgoingSlot = battle.playerSlots[slotToSwitchOut];
				if (!outgoingSlot || outgoingSlot.pokemon.hp <= 0) {
					return this.errorReply("The Pokémon in that slot has fainted or is not there.");
				}

				// --- ARENA TRAP / SHADOW TAG CHECK ---
				const trappingPokemon = checkTrappingAbility(outgoingSlot, battle);
				if (trappingPokemon) {
					const trapMessage = `${outgoingSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`;
					this.errorReply(trapMessage);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [trapMessage])}`);
				}
				// --- END TRAP CHECK ---

				if (outgoingSlot.isTrapped) {
					this.errorReply(`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`])}`);
				}

				if (outgoingSlot.partiallyTrapped) {
					this.errorReply(`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`])}`);
				}

				if (outgoingSlot.isIngrained) {
					this.errorReply(`${outgoingSlot.pokemon.species} is rooted in place by Ingrain and cannot switch out!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is rooted in place and cannot switch out!`])}`);
				}

				const player = getPlayerData(battle.playerId);

				const partyToUse = battle.overridePlayerParty || player.party;

				// Check if incoming Pokemon is valid
				const incomingPokemon = partyToUse.find(p => p.id === pokemonIdIn && p.hp > 0);
				if (!incomingPokemon) {
					return this.errorReply("Invalid Pokemon or it has fainted.");
				}
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonIdIn)) {
					return this.errorReply("This Pokemon is already in battle.");
				}

				outgoingSlot.lockedMove = undefined;
				outgoingSlot.lockedMoveCounter = 0;

				// --- Queue the Switch Action ---
				battle.pendingActions[slotToSwitchOut] = {
					actionType: 'switch',
					switchToPokemonId: pokemonIdIn,
					pokemonId: outgoingSlot.pokemon.id,
				};

				const messageLog = [`${outgoingSlot.pokemon.species} is ready to switch out!`];

				// --- Check if all player actions are submitted ---
				const activePlayerSlots = getActiveSlots(battle.playerSlots).length;
				const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

				if (submittedPlayerActions === activePlayerSlots) {
					// All players have moved, process the turn
					processTurn(this, battle, room, user);
				} else {
					// Waiting for other player's move
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},

			switchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSwitchMenuHTML(battle, target)}`);
			},
			catchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				if (battle.battleType === 'battletower') {
					this.errorReply("You cannot catch Pokémon in the Battle Tower!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You cannot catch Pokémon in the Battle Tower!"])}`);
				}

				// In double battles, can only catch when one opponent remains
				if (battle.battleType === 'wild_double') {
					const activeOpponents = getActiveSlots(battle.opponentSlots);
					if (activeOpponents.length > 1) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMultipleOpponentsCatchErrorHTML()}`);
					}
				}

				const player = getPlayerData(battle.playerId);
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchMenuHTML(player, battle)}`);
			},

			// --- NEW ---
			selectcatchtarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				if (battle.battleType === 'battletower') {
					this.errorReply("You cannot catch Pokémon in the Battle Tower!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You cannot catch Pokémon in the Battle Tower!"])}`);
				}

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}
				const ballId = toID(target);
				if (!ballId) return this.errorReply("No ball selected.");

				// If only one target, just catch it.
				const activeOpponents = getActiveSlots(battle.opponentSlots);
				if (activeOpponents.length === 1) {
					const slotIndex = battle.opponentSlots.indexOf(activeOpponents[0]) + 2;
					return this.parse(`/rpg battleaction catch ${ballId} ${slotIndex}`);
				}

				// Show target selection screen
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchTargetHTML(battle, ballId)}`);
			},

			catch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				if (battle.battleType === 'battletower') {
					this.errorReply("You cannot catch Pokémon in the Battle Tower!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You cannot catch Pokémon in the Battle Tower!"])}`);
				}

				// --- NEW: Read target ---
				const [ballId, slotIndexStr] = target.split(' ');
				const targetSlotIndex = parseInt(slotIndexStr);

				if (!ballId || isNaN(targetSlotIndex)) {
					return this.errorReply("Invalid catch command. Usage: /rpg battleaction catch [ballId] [slotIndex]");
				}

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't catch a Trainer's Pokémon!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}

				// In double battles, can only catch when one opponent remains (matches Pokemon games Gen 8+)
				if (battle.battleType === 'wild_double') {
					const activeOpponents = getActiveSlots(battle.opponentSlots);
					if (activeOpponents.length > 1) {
						this.errorReply("You can't throw a Poké Ball when there are multiple opponents!");
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't throw a Poké Ball when there are multiple wild Pokémon! Defeat one first."])}`);
					}
				}

				// --- NEW: Get target slot ---
				const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
				if (!targetSlot || (targetSlotIndex !== 2 && targetSlotIndex !== 3)) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["That is not a valid target!"])}`);
				}

				const player = getPlayerData(battle.playerId);
				const ballItem = player.inventory.get(ballId);

				if (ballItem?.category !== 'pokeball' || ballItem.quantity < 1) {
					return this.errorReply(`You don't have any ${ITEMS_DATABASE[ballId]?.name || 'of that item'}!`);
				}

				if (player.party.length >= 6 && player.pc.size >= 100) {
					return this.errorReply("Your party and PC are full!");
				}

				removeItemFromInventory(player, ballId, 1);

				const messageLog: string[] = [];
				messageLog.push(`<span class="rpg-text-info">${player.name} used a ${ballItem.name}!</span>`);

				// --- NEW: Pass the target slot to performCatchAttempt ---
				const catchResult = performCatchAttempt(battle, ballId, targetSlot);
				const shakeMessages = [
					"Oh no! The Pokemon broke free!", "Aww! It appeared to be caught!",
					"Aargh! Almost had it!", "Gah! It was so close, too!",
				];

				for (let i = 1; i <= catchResult.shakes; i++) {
					if (i < 4) {
						messageLog.push(`<i class="rpg-text-muted">...The ball shook...</i>`);
					}
				}

				if (catchResult.success) {
					const zoneId = battle.zoneId;
					saveBattleStatus(battle);
					activeBattles.delete(user.id);
					teraToggleState.delete(user.id);

					const caughtPokemon = targetSlot.pokemon;
					caughtPokemon.caughtIn = ballId; // Set the ball it was caught in!

					if (ballId === 'healball') {
						caughtPokemon.hp = caughtPokemon.maxHp;
						caughtPokemon.status = null;
					}

					const location = player.party.length < 6 ? "your party" : "PC";
					if (player.party.length < 6) { player.party.push(caughtPokemon); } else { storePokemonInPC(player, caughtPokemon); }

					const wasHealed = ballId === 'healball';
					const tempSlot = createActivePokemonSlot(caughtPokemon);
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchSuccessHTML(caughtPokemon, tempSlot, location, zoneId, wasHealed)}`);
				} else {
					// --- FAILED CATCH PATH (FIXED) ---
					messageLog.push(`<span class="rpg-text-error"><strong>${shakeMessages[catchResult.shakes]}</strong></span>`);

					// The catch attempt failed. In Pokémon games, using an item (including Pokéballs) consumes your turn.
					// The opponent gets to attack, so we need to process the turn.
					processTurn(this, battle, room, user, messageLog);
				}
			},

			run(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				if (battle.battleType === 'battletower') {
					this.errorReply("You can't run from a Battle Tower challenge!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't run from a Battle Tower challenge!"])}`);
				}

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't run from a Trainer battle!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't run from a Trainer battle!"])}`);
				}

				// --- ARENA TRAP / SHADOW TAG CHECK ---
				const playerSlots = getActiveSlots(battle.playerSlots);
				for (const slot of playerSlots) {
					const trappingPokemon = checkTrappingAbility(slot, battle);
					if (trappingPokemon) {
						const trapMessage = `${slot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`;
						this.errorReply(trapMessage);
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [trapMessage])}`);
					}
				}
				// --- END TRAP CHECK ---

				const trappedPokemon = playerSlots.find(slot => slot.isTrapped || slot.partiallyTrapped);

				if (trappedPokemon) {
					this.errorReply(`${trappedPokemon.pokemon.species} is trapped and cannot escape!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`You can't escape!`])}`);
				}
				// END: Trapping check

				saveBattleStatus(battle);
				activeBattles.delete(user.id);
				teraToggleState.delete(user.id);

				// In-Menu Notification
				const player = getPlayerData(user.id);
				const location = LOCATIONS[toID(player.location)];
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, location, "You ran away safely!")}`);
			},

			back(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (battle) {
					// Clear any stale pending actions for fainted Pokemon to prevent "already waiting to move" error
					for (let i = 0; i < battle.playerSlots.length; i++) {
						if (battle.playerSlots[i] === null || battle.playerSlots[i]?.pokemon.hp === 0) {
							delete battle.pendingActions[i];
						}
					}
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You returned to the battle."], undefined, teraToggleState.get(user.id))}`);
				}
			},

			help() {
				this.sendReply("Battle commands: /rpg battleaction [move|switch|catchmenu|run]");
			},
		},

		giveitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const [pokemonId, itemId] = target.split(' ').map(toID);

			if (!pokemonId) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemSelectionHTML(player)}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");

			if (!itemId) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemToSpecificPokemonHTML(player, pokemon)}`);
			}

			const item = player.inventory.get(itemId);
			if (!item || (item.category !== 'held' && item.category !== 'berry')) {
				return this.errorReply("You do not have this item or it cannot be held.");
			}

			if (pokemon.item) {
				// --- ADDED: Sticky Hold Check ---
				if (RPGAbilities.checkItemRemovalPrevention(pokemon)) {
					return this.errorReply(`${pokemon.species}'s ${pokemon.ability} prevents its item from being swapped!`);
				}
				// --- END ADDED ---
				addItemToInventory(player, pokemon.item, 1);
			}

			pokemon.item = itemId;
			removeItemFromInventory(player, itemId, 1);

			// In-Menu Notification
			const successMsg = `Gave <strong>${item.name}</strong> to ${pokemon.species}.`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		},

		takeitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const pokemonId = toID(target);

			if (!pokemonId) {
				// Check if only one Pokemon has an item - auto-select it
				const pokemonWithItems = player.party.filter(p => p.item);
				if (pokemonWithItems.length === 1) {
					return this.parse(`/rpg takeitem ${pokemonWithItems[0].id}`);
				}
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateTakeItemSelectionHTML(player)}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");
			if (!pokemon.item) return this.errorReply(`${pokemon.species} is not holding an item.`);

			// --- ADDED: Sticky Hold Check ---
			if (RPGAbilities.checkItemRemovalPrevention(pokemon)) {
				return this.errorReply(`${pokemon.species}'s ${pokemon.ability} prevents its item from being taken!`);
			}
			// --- END ADDED ---

			const item = ITEMS_DATABASE[pokemon.item];
			addItemToInventory(player, pokemon.item, 1);
			pokemon.item = undefined;

			// In-Menu Notification
			const successMsg = `Took <strong>${item.name}</strong> from ${pokemon.species}.`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		},

		nickname(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot change nicknames during a battle.");
			}
			const player = getPlayerData(user.id);

			const parts = target.split(',');
			const pokemonId = parts[0]?.trim();
			const newNickname = parts.slice(1).join(',').trim();

			if (!pokemonId || !newNickname) {
				return this.errorReply("Invalid format. Usage: /rpg nickname [pokemonId], [new nickname]");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);

			if (!pokemon) {
				return this.errorReply(`Pokemon with ID "${pokemonId}" not found in your party.`);
			}

			if (newNickname.length > 12) {
				return this.errorReply("Nicknames cannot be longer than 12 characters.");
			}

			const oldNickname = pokemon.nickname;
			pokemon.nickname = newNickname;

			// In-Menu Notification
			const successMsg = `Changed ${oldNickname}'s name to <strong>${pokemon.nickname}</strong>.`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		},

		reset(target, room, user) {
			const player = getPlayerData(user.id);

			// Check if user has RPG data to reset
			if (player.party.length === 0 && player.pc.size === 0 && player.inventory.size === 0) {
				return this.errorReply("You don't have any RPG progress to reset.");
			}

			// Remove user from active battles if they're in one
			if (activeBattles.has(user.id)) {
				const battle = activeBattles.get(user.id);
				if (battle) {
					saveBattleStatus(battle);
				}
				activeBattles.delete(user.id);
				teraToggleState.delete(user.id);
			}

			// Clear all player data
			playerData.delete(user.id);

			// Standard Chat Feedback
			this.sendReplyBox("Game data reset.");
            return this.parse('/rpg start');
		},

		unstuck(target, room, user) {
			// Check if user is in a battle
			if (!activeBattles.has(user.id)) {
				return this.errorReply("You are not currently in a battle.");
			}

			// Save battle status and remove from active battles
			const battle = activeBattles.get(user.id);
			if (battle) {
				saveBattleStatus(battle);
			}
			activeBattles.delete(user.id);
			teraToggleState.delete(user.id);

			// In-Menu Notification
			const player = getPlayerData(user.id);
			const location = LOCATIONS[toID(player.location)];
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, location, "Battle force-exited.")}`);
		},

		npc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot talk to NPCs during a battle.");
			}

			const player = getPlayerData(user.id);
			const npcId = toID(target);

			if (!npcId) {
				// Show available NPCs in current location (including buildings)
				const currentLocationId = toID(player.location);
				const currentLocation = LOCATIONS[currentLocationId];

				const availableNPCs: [string, NPCData][] = [];

				// Find NPCs in the current location
				for (const [id, npc] of Object.entries(NPC_DATABASE)) {
					// Check if NPC is in this location (directly or in a building)
					const npcLocationId = toID(npc.location);
					if (npcLocationId === currentLocationId) {
						// NPC is in the main location
						if (!npc.flags || npc.flags.every(f => player.storyFlags.has(f))) {
							availableNPCs.push([id, npc]);
						}
					} else if (currentLocation?.buildings) {
						// Check if NPC is in a building in this location
						const building = currentLocation.buildings.find(b => toID(b.id) === npcLocationId);
						if (building?.npcs?.includes(id)) {
							if (!npc.flags || npc.flags.every(f => player.storyFlags.has(f))) {
								availableNPCs.push([id, npc]);
							}
						}
					}
				}

				if (availableNPCs.length === 0) {
					return this.errorReply("There are no NPCs to talk to here.");
				}

				// Auto-select if only one NPC available
				if (availableNPCs.length === 1) {
					return this.parse(`/rpg npc ${availableNPCs[0][0]}`);
				}

				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCSelectionHTML(availableNPCs)}`);
			}

			const npc = NPC_DATABASE[npcId];
			if (!npc) {
				return this.errorReply("That NPC doesn't exist.");
			}

			// Check location (NPC can be in the location directly or in a building in this location)
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];
			const npcLocationId = toID(npc.location);

			let npcAccessible = false;
			if (npcLocationId === currentLocationId) {
				npcAccessible = true;
			} else if (currentLocation?.buildings) {
				const building = currentLocation.buildings.find(b => toID(b.id) === npcLocationId);
				if (building?.npcs?.includes(npcId)) {
					npcAccessible = true;
				}
			}

			if (!npcAccessible) {
				return this.errorReply("That NPC is not in this location.");
			}

			// Check flags
			if (npc.flags && !npc.flags.every(f => player.storyFlags.has(f))) {
				return this.errorReply("You cannot talk to this NPC yet.");
			}

			// Handle completion state
			let npcToRender = npc;
			if (npc.action) {
				const actionCompleted = player.completedNPCActions.has(npcId);
				if (npc.action.onceOnly && actionCompleted) {
					 npcToRender = { 
						...npc, 
						action: null, 
						dialogue: npc.dialogue + ' <br><br><em class="rpg-text-muted">(You have completed this request.)</em>' 
					 };
				}
			}

			const dialogueHTML = generateNPCInteractionHTML(npcToRender);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${dialogueHTML}`);
		},

		npcaction(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot interact with NPCs during a battle.");
			}

			const player = getPlayerData(user.id);
			const args = target.split(' ');
			const npcId = toID(args[0]);
			const param1 = args.slice(1).join(' '); 
			
			const npc = NPC_DATABASE[npcId];
			if (!npc?.action) return this.errorReply("Invalid NPC action.");

			const action = npc.action;

			// Check completion for one-time events
			if (action.onceOnly && player.completedNPCActions.has(npcId)) {
				return this.errorReply("You've already completed this NPC's request.");
			}

			let result: { success: boolean, message: string, canBattle?: boolean } = { success: false, message: "Action failed." };

			switch (action.type) {
				// --- BASIC INVENTORY ACTIONS (Inline Logic) ---
				case 'giveitem':
					if (action.itemId && action.quantity) {
						addItemToInventory(player, action.itemId, action.quantity);
						const item = ITEMS_DATABASE[action.itemId];
						result = { success: true, message: `You received <strong>${item?.name || action.itemId} x${action.quantity}</strong>!` };
						if (action.onceOnly) player.completedNPCActions.add(npcId);
					}
					break;

				case 'givepokemon':
					if (action.pokemon) {
						if (player.party.length >= 6 && player.pc.size >= 100) {
							return this.errorReply("Your party and PC are both full! Free up space first.");
						}
						const pokemon = createPokemon(action.pokemon.species, action.pokemon.level);
						if (action.pokemon.moves && action.pokemon.moves.length > 0) {
							pokemon.moves = action.pokemon.moves.map(moveId => {
								const moveData = getMove(moveId);
								return { id: moveId, pp: moveData.pp || 5 };
							});
						}
						const species = Dex.species.get(action.pokemon.species);
						if (!species.exists) return this.errorReply("Invalid Pokemon species.");

						if (player.party.length < 6) {
							player.party.push(pokemon);
							result = { success: true, message: `<strong>${species.name}</strong> joined your party!` };
						} else {
							storePokemonInPC(player, pokemon);
							result = { success: true, message: `<strong>${species.name}</strong> was sent to your PC.` };
						}
						if (action.onceOnly) player.completedNPCActions.add(npcId);
					}
					break;

				case 'exchangeitems':
					if (action.requiredItem && action.requiredQuantity && action.itemId && action.quantity) {
						const hasRequired = player.inventory.get(action.requiredItem)?.quantity || 0;
						if (hasRequired >= action.requiredQuantity) {
							removeItemFromInventory(player, action.requiredItem, action.requiredQuantity);
							addItemToInventory(player, action.itemId, action.quantity);
							const rewardItem = ITEMS_DATABASE[action.itemId];
							result = { success: true, message: `Traded for <strong>${rewardItem?.name || action.itemId} x${action.quantity}</strong>!` };
							if (action.onceOnly) player.completedNPCActions.add(npcId);
						} else {
							return this.errorReply("You don't have enough of the required items.");
						}
					}
					break;

				case 'takeitem':
					if (action.itemId && action.quantity) {
						const hasItem = player.inventory.get(action.itemId)?.quantity || 0;
						if (hasItem >= action.quantity) {
							removeItemFromInventory(player, action.itemId, action.quantity);
							const reward = action.quantity * 1000;
							player.money += reward;
							result = { success: true, message: `Gave item and received <strong>₽${reward}</strong>!` };
							if (action.onceOnly) player.completedNPCActions.add(npcId);
						} else {
							return this.errorReply("You don't have the required item.");
						}
					}
					break;

				case 'choosestarter':
					return this.parse(`/rpg starterchoice ${npcId}`);

				// --- COMPLEX ACTIONS (Mapped to npc-actions.ts) ---
				case 'heal':
					result = NPCActions.handleHeal(player);
					break;
				case 'fossilrevival':
					result = NPCActions.handleFossilRevival(player, action, param1);
					break;
				case 'dailyreward':
					result = NPCActions.handleDailyReward(player, action, npcId);
					break;
				case 'battlerequest':
					const battleReq = NPCActions.handleBattleRequest(player, action, npcId);
					result = { success: battleReq.success, message: battleReq.message, canBattle: battleReq.canBattle };
					break;
				case 'questchain':
					result = NPCActions.handleQuestChain(player, action, npcId);
					break;
				case 'itemcraft':
					result = NPCActions.handleItemCraft(player, action, parseInt(param1));
					break;
				case 'berryplant':
					result = NPCActions.handleBerryPlant(player, action, npcId, param1);
					break;
				case 'pokemongrooming':
					if (player.party.length > 0) result = NPCActions.handlePokemonGrooming(player, action, player.party[0]);
					else return this.errorReply("You need a Pokemon in your party.");
					break;
				case 'fortuneteller':
					result = NPCActions.handleFortuneTeller(player, action, npcId, param1 || 'luck');
					break;
				case 'pokemonbreeder':
					if (player.party.length >= 2) result = NPCActions.handlePokemonBreeder(player, action, player.party[0], player.party[1]);
					else return this.errorReply("You need at least 2 Pokemon in your party.");
					break;
				case 'moverelearner':
					result = { success: false, message: "Move Relearner UI is under construction." };
					break;
				case 'abilitycapsule':
					if (player.party.length > 0) result = NPCActions.handleAbilityCapsule(player, action, player.party[0]);
					break;
				case 'evtrainer':
					if (player.party.length > 0) result = NPCActions.handleEVTrainer(player, action, player.party[0], param1);
					break;
				case 'ivchecker':
					if (player.party.length > 0) result = NPCActions.handleIVChecker(player.party[0]);
					break;
				case 'mysterygift':
					result = NPCActions.handleMysteryGift(player, action, npcId);
					break;
				case 'lottery':
					result = NPCActions.handleLottery(player, action);
					break;
				case 'masseuse':
					if (player.party.length > 0) result = NPCActions.handleMasseuse(player, action, player.party[0]);
					break;
				case 'haircutter':
					if (player.party.length > 0) result = NPCActions.handleHairCutter(player, action, player.party[0]);
					break;
				case 'fishing':
					result = NPCActions.handleFishing(player, action);
					break;
				case 'bikeshop':
					result = NPCActions.handleBikeShop(player, action);
					break;
				case 'coinexchange':
					result = NPCActions.handleCoinExchange(player, action, 'buy', parseInt(param1) || 50);
					break;
				case 'tutorcombo':
					result = { success: false, message: "Tutor UI not yet implemented." };
					break;
				case 'apricorncrafter':
					result = NPCActions.handleApricornCrafter(player, action, param1);
					break;
				case 'shardtrader':
					result = NPCActions.handleShardTrader(player, action, param1);
					break;
				case 'wingcollector':
					result = NPCActions.handleWingCollector(player, action, param1);
					break;
				case 'scalecollector':
					result = NPCActions.handleScaleCollector(player, action);
					break;
				case 'opower':
					result = NPCActions.handleOPower(player, action, npcId);
					break;
				case 'collectionquest':
					result = NPCActions.handleCollectionQuest(player, action, npcId);
					break;
				case 'reputation':
					result = NPCActions.handleReputation(player, action, npcId);
					break;
				case 'deliveryquest':
					result = NPCActions.handleDeliveryQuest(player, action, npcId, true);
					break;
				case 'timebased':
					result = NPCActions.handleTimeBasedAction(player, action);
					break;
				case 'conditionaldialogue':
					result = NPCActions.handleConditionalDialogue(player, action);
					break;
				case 'escortquest':
					result = NPCActions.handleEscortQuest(player, action, npcId, player.location);
					break;
				case 'achievement':
					result = NPCActions.handleAchievement(player, action, param1);
					break;
				case 'battlegauntlet':
					result = NPCActions.handleBattleGauntlet(player, action, npcId);
					break;
				case 'battlearena':
					result = NPCActions.handleBattleArena(player, action, npcId);
					break;
				case 'trainingbattle':
					result = NPCActions.handleTrainingBattle(player, action, npcId);
					if (result.success && result.canBattle) return this.parse(`/rpg challenge ${action.trainerId}`);
					break;
				case 'battlechallenge':
					result = NPCActions.handleBattleChallenge(player, action);
					break;
				case 'survivalbattle':
					result = NPCActions.handleSurvivalBattle(player, action, npcId);
					break;
				case 'rematchtracker':
					result = NPCActions.handleRematchTracker(player, action, npcId);
					break;
				
				default:
					result = { success: false, message: `Unknown action type: ${action.type}` };
					break;
			}

			// --- RENDER RESULT ---
			// Update completion state visual after success
			let npcToRender = npc;
			if (result.success && npc.action && npc.action.onceOnly) {
				 npcToRender = { 
					...npc, 
					action: null, 
					dialogue: npc.dialogue + ' <br><br><em class="rpg-text-muted">(You have completed this request.)</em>' 
				 };
			}
			
			if (result.success) {
				// In-Menu Notification (Green)
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCInteractionHTML(npcToRender, result.message)}`);
				
				if (result.canBattle && action.trainerId) {
					return this.parse(`/rpg challenge ${action.trainerId}`);
				}
			} else {
				// In-Menu Notification (Red/Error - reuse notification area with style)
                const errorMsg = `<span class="rpg-text-error">${result.message}</span>`;
                this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCInteractionHTML(npcToRender, errorMsg)}`);
			}
		},

		starterchoice(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot choose a starter during a battle.");
			}

			const player = getPlayerData(user.id);
			const parts = target.split(' ');
			const npcId = toID(parts[0]);
			const selectedPokemon = parts[1]; // pokemon id if selecting, undefined if viewing

			const npc = NPC_DATABASE[npcId];
			if (!npc?.action || npc.action.type !== 'choosestarter') {
				return this.errorReply("Invalid NPC or no starter selection available.");
			}

			const action = npc.action;

			if (!selectedPokemon) {
				// Show all available starters (like Pokemon games)
				// Get all starters from STARTER_POKEMON
				const allStarters = Object.values(STARTER_POKEMON).flat();
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCStarterChoiceHTML(npcId, npc.name, allStarters)}`);
			} else {
				// Player selected a specific Pokemon
				// Validate the selection is in STARTER_POKEMON
				const allStarters = Object.values(STARTER_POKEMON).flat();
				if (!allStarters.includes(selectedPokemon)) {
					return this.errorReply("Invalid starter Pokémon selection.");
				}

				const result = NPCActions.handleChooseStarter(player, action, selectedPokemon);

				if (!result.success) {
					return this.errorReply(result.message);
				}

				// Mark as completed
				if (action.onceOnly) {
					player.completedNPCActions.add(npcId);
				}

				// Set starting location if not already set
				if (!player.location) {
					const startingLocation = getStartingLocation();
					player.location = startingLocation.name;
				}

				const starter = result.pokemon!;
				const species = Dex.species.get(starter.species);
				const tempSlot = createActivePokemonSlot(starter);

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCStarterConfirmHTML(npc.name, result.message, tempSlot, species.name)}`);

				if (room?.roomid !== 'lobby') {
					room.add(`|c|~RPG Bot|${user.name} has chosen ${species.name} as their starter Pokémon!`).update();
				}
			}
		},

		// Manual JSON save/load commands removed - use database save/load instead
		// These were insecure as users could manually edit the JSON data
		save: 'dbsave',
		load: 'dbload',

		async dbsave(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot save during a battle.");
			}
			const player = getPlayerData(user.id);

			try {
				await savePlayerToDB(player);
				// In-Menu Notification
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateProfileHTML(player, "Game saved successfully!")}`);
			} catch (error) {
				return this.errorReply("Error saving game to database: " + String(error));
			}
		},

		async dbload(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot load during a battle.");
			}
			try {
				const hasSave = await hasSaveInDB(user.id);

				if (!hasSave) {
					return this.errorReply("No saved game found in the database.");
				}

				const loadedPlayer = await loadPlayerFromDB(user.id);

				if (!loadedPlayer) {
					return this.errorReply("Error loading game from database.");
				}

				// In-Menu Notification
				const msg = `Save loaded! Welcome back, ${loadedPlayer.name}.`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(loadedPlayer, LOCATIONS[toID(loadedPlayer.location)], msg)}`);
			} catch (error) {
				return this.errorReply("Error loading game from database: " + String(error));
			}
		},

		async dbdelete(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot delete saves during a battle.");
			}
			try {
				const hasSave = await hasSaveInDB(user.id);

				if (!hasSave) {
					return this.errorReply("You don't have a save file to delete.");
				}

				// Require confirmation
				if (!target || target !== 'confirm') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateDBDeleteConfirmHTML()}`);
				}

				// Perform deletion
				const deleted = await deletePlayerFromDB(user.id);

				if (!deleted) {
					return this.errorReply("Error deleting save from database.");
				}

				this.sendReplyBox("Save file deleted.");
				return this.parse('/rpg start');
			} catch (error) {
				return this.errorReply("Error deleting save from database: " + String(error));
			}
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/rpg start", desc: "Start your RPG adventure or continue from where you left off." },
				{ cmd: "/rpg reset", desc: "Reset all your RPG progress (cannot be undone)." },
				{ cmd: "/rpg unstuck", desc: "Exit a battle if you're stuck." },
				{ cmd: "/rpg battleaction back", desc: "Return to battle if ui disappears while you're in battle." },
			];
			const html = `<div class="rpg-text-center"><strong>RPG Commands</strong></div><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(`<div>${html}</div>`);
		},
		'': 'help',

		talknpc: 'npc',
	},
};
