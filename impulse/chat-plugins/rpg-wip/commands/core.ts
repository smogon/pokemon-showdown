/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*/
import { Dex, toID } from '../../../../sim/dex';
import { getMove, checkEvolution, handleLearningMoves, getActiveSlots } from '../utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, NPCData } from '../interface';
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
} from '../items';
import { getShopInventory, getNextShopTier } from '../shop';
import {
	activeBattles,
} from '../core';
import {
	getPlayerData,
	playerData,
	savePlayerToDB,
	loadPlayerFromDB,
	hasSaveInDB,
	deletePlayerFromDB,
} from '../lib/player';
import {
	createPokemon,
	storePokemonInPC,
	withdrawPokemonFromPC,
	getInitialMoves,
} from '../lib/pokemon';
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
} from '../battle-engine';
import {
	generateBuyHTML,
	generateSellMenuHTML,
	generateSellConfirmHTML,
	generateExploreHTML,
	generateRunHTML,
	generateResetHTML,
	generateUnstuckHTML,
	generatePokemonInfoHTML,
	generateBattleHTML,
	generateWelcomeHTML,
	generateRPGModeSelectionHTML,
	generateStoryModeStartHTML,
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
	generateStarterSelectionConfirmationHTML,
	generateLearnMoveResultHTML,
	generateLearnEggMoveResultHTML,
	generateSummarySelectionHTML,
	generatePartyHTML,
	generateUseItemPokemonSelectionHTML,
	generateItemUseErrorHTML,
	generateSacredAshResultHTML,
	generateItemUseSuccessHTML,
	generateMiscItemPokemonSelectionHTML,
	generateNoLearnableEggMovesHTML,
	generateEvolutionHTML,
	generateEvolutionErrorHTML,
	generateRestorePPResultHTML,
	generateDepositPokemonConfirmationHTML,
	generateWithdrawPokemonConfirmationHTML,
	generateBuyConfirmationHTML,
	generateTravelHTML,
	generateArrivalHTML,
	generateBuildingHTML,
	generateGiveItemSelectionHTML,
	generateGiveItemPokemonSelectionHTMLWrapper,
	generateGiveItemConfirmationHTML,
	generateTakeItemSelectionHTML,
	generateTakeItemConfirmationHTML,
	generateNicknameConfirmationHTML,
	generateNPCListHTML,
	generateNPCDialogueHTML,
	generateNPCActionHTML,
	generateStarterChoiceHTML,
	generateStarterChoiceConfirmationHTML,
	generateDBSaveConfirmationHTML,
	generateDBLoadConfirmationHTML,
	generateDBLoadErrorHTML,
	generateDBDeleteConfirmationHTML,
	generateDBDeleteSuccessHTML,
	generateHelpHTML,
	generateCatchErrorHTML,
} from '../html';
import {
	STARTER_POKEMON,
	TYPE_CHART,
} from '../data';
import { LOCATIONS, ENCOUNTER_ZONES, getStartingLocation } from '../locations';
import { TRAINER_DATABASE, TRAINER_LOCATIONS } from '../trainers';
import { STORY_EVENTS } from '../story-events';
import { NPC_DATABASE } from '../npcs';
import { MANUAL_LEARNSETS } from '../MANUAL_LEARNSETS';
import * as NPCActions from '../npc-actions';
import * as ScriptedEvents from '../scripted-events';

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
			this.popupReply(`|wide||html|${generateWelcomeHTML()}`);
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
				return this.errorReply("You have already started your adventure!");
			}
			// Set player location to starting location
			const startingLocation = getStartingLocation();
			player.location = startingLocation.name;
			this.popupReply(`|wide||html|${generateStoryModeStartHTML()}`);
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
			this.popupReply(`|wide||html|${generateStarterSelectionHTML(type, starters)}`);
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

				this.popupReply(`|wide||html|${generateStarterSelectionConfirmationHTML(species, tempSlot, startingLocation)}`);
			} catch (error) {
				this.errorReply(`Error creating starter Pokémon: ${error}`);
			}
		},

		menu(target, room, user) {
			// Menu command is removed - redirect to explore which is the new main hub
			return this.parse('/rpg explore');
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
			}

			// Clear all player data
			playerData.delete(user.id);

			// Send confirmation
			this.popupReply(`|wide||html|${generateResetHTML()}`);
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

			// Send confirmation
			this.popupReply(`|wide||html|${generateUnstuckHTML()}`);
		},

		help() {
			this.popupReply(`|wide||html|${generateHelpHTML()}`);
		},
		'': 'help',

		talknpc: 'npc',
	},
};
