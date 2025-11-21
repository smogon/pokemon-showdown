import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { getMove, checkEvolution, handleLearningMoves, getActiveSlots, STARTER_POKEMON, TYPE_CHART } from './utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, NPCData, InventoryItem } from './interface';
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
import { getShopInventory, getNextShopTier } from './game-shops';
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
import { createActivePokemonSlot, checkTrappingAbility, getSlotFromIndex, handleMirrorHerb } from './battle-shared';
import {
	validateMoveAction,
	processTurn,
	applyHazardEffectsOnSwitchIn,
	startBattleTowerFloor,
	getLocationWeatherData,
	getWeatherStartMessage,
} from './battle-flow';
import { saveBattleStatus, performCatchAttempt } from './battle-core';
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
	generateMedicinePokemonSelectionHTML,
	generateItemUseErrorHTML,
	generateMiscItemPokemonSelectionHTML,
	generateEvolutionStoneErrorHTML,
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
	generateBattleTowerLadderHTML,
	generatePartyScreenHTML,
	generateProfileHTML,
	generateMoveSelectionHTML,
	generateScriptedEventHTML,
	generateNPCInteractionHTML,
	generatePokedexHTML,
} from './html';
import { BATTLE_TOWER_FORMATS } from './battle-tower';
import { LOCATIONS, ENCOUNTER_ZONES, getStartingLocation } from './game-locations';
import { TRAINER_DATABASE, TRAINER_LOCATIONS, NPC_DATABASE } from './game-npcs';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import * as NPCActions from './npc-actions';
import * as ScriptedEvents from './scripted-events';
import { GameConfig } from './game-config';

/**
 * Helper function to check if a player is in an active (ongoing) battle.
 * Returns true only if the battle exists AND has not ended.
 * This prevents soft-locking when a battle has ended but hasn't been cleaned up yet.
 */
function isInActiveBattle(userId: string): boolean {
	const battle = activeBattles.get(userId);
	if (!battle) return false;
	// If the battle has ended, we should allow the player to use commands
	if (battle.battleEnded) return false;
	return true;
}

function initializeAndStartBattle(
	ctx: CommandContext,
	room: ChatRoom,
	user: User,
	player: PlayerData,
	activeParty: RPGPokemon[],
	opponent: {
		name: string,
		party: RPGPokemon[],
		money: number,
		trainerId?: string,
	},
	config: {
		battleType: BattleState['battleType'],
		zoneId: string,
		eventId?: string,
	},
	initialMessages: string[]
) {
	const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
	const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];

	playerSlots[0] = createActivePokemonSlot(activeParty[0]);
	opponentSlots[0] = createActivePokemonSlot(opponent.party[0]);

	if (config.battleType.includes('double')) {
		if (activeParty[1]) playerSlots[1] = createActivePokemonSlot(activeParty[1]);
		if (opponent.party[1]) opponentSlots[1] = createActivePokemonSlot(opponent.party[1]);
	}

	const locationWeatherData = getLocationWeatherData(player);
	if (locationWeatherData.weather) {
		initialMessages.push(getWeatherStartMessage(locationWeatherData.weather.type));
	}

	const battle: BattleState = {
		battleType: config.battleType,
		opponentName: opponent.name,
		opponentParty: opponent.party,
		opponentMoney: opponent.money,
		trainerId: opponent.trainerId,
		playerSlots,
		opponentSlots,
		pendingActions: {},
		playerId: user.id,
		turn: 0,
		zoneId: config.zoneId,
		playerHazards: [],
		opponentHazards: [],
		weather: locationWeatherData.weather,
		locationWeather: locationWeatherData.locationWeather,
		trickRoomTurns: 0,
		magicRoomTurns: 0,
		wonderRoomTurns: 0,
		terrain: undefined,
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

	if (playerSlots[0]) applyHazardEffectsOnSwitchIn(playerSlots[0], battle, true, initialMessages);
	if (playerSlots[1]) applyHazardEffectsOnSwitchIn(playerSlots[1], battle, true, initialMessages);
	if (opponentSlots[0]) applyHazardEffectsOnSwitchIn(opponentSlots[0], battle, false, initialMessages);
	if (opponentSlots[1]) applyHazardEffectsOnSwitchIn(opponentSlots[1], battle, false, initialMessages);

	activeBattles.set(user.id, battle);
	battle.battleLog.push(...initialMessages);

	ctx.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, teraToggleState.get(user.id), config.eventId)}`);
}

function handleUseMedicine(
	this: CommandContext,
	player: PlayerData,
	item: { id: string, name: string, effects?: any },
	targetPokemon: RPGPokemon,
	room: ChatRoom,
	user: User
) {
	let result: { success: boolean, message: string } = { success: false, message: "This item cannot be used." };
	let requiresMoveSelection = false;

	const itemData = ITEMS_DATABASE[item.id];
	const eff = itemData?.effects;

	if (!eff) {
		return this.errorReply("Error: Item data missing effects.");
	}

	if (eff.revive) {
		result = useRevivalItem(player, targetPokemon, item.id);
	} else if (eff.healAmount || eff.healPercent || eff.statusCure) {
		result = useHealingItem(player, targetPokemon, item.id);
	} else if (eff.evBoost) {
		result = useVitaminItem(player, targetPokemon, item.id);
	} else if (eff.ppRestore || eff.ppRestoreAll) {
		if (eff.ppRestoreAll) {
			let totalPPRestored = 0;
			for (const move of targetPokemon.moves) {
				const moveData = getMove(move.id);
				const maxPP = moveData.pp || 5;
				if (move.pp < maxPP) {
					const restoreAmount = (eff.ppRestore === -1) ? maxPP : eff.ppRestore!;
					const oldPP = move.pp;
					move.pp = Math.min(maxPP, move.pp + restoreAmount);
					totalPPRestored += (move.pp - oldPP);
				}
			}
			if (totalPPRestored > 0) {
				result = { success: true, message: `${targetPokemon.species}'s moves had their PP restored!` };
				removeItemFromInventory(player, item.id, 1);
			} else {
				result = { success: false, message: `${targetPokemon.species}'s moves are already at full PP.` };
			}
		} else {
			requiresMoveSelection = true;
		}
	} else {
		return this.errorReply("This medicine item has no defined effect.");
	}

	if (requiresMoveSelection) {
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveSelectionHTML(player, targetPokemon.id, item.id)}`);
	}

	if (!result.success) {
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateItemUseErrorHTML(result.message, item.id)}`);
	}

	return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
}

function handleUseMiscItem(
	this: CommandContext,
	player: PlayerData,
	item: { id: string, name: string, effects?: any },
	targetPokemon: RPGPokemon,
	room: ChatRoom,
	user: User
) {
	const itemId = item.id;
	const itemData = ITEMS_DATABASE[itemId];
	const eff = itemData?.effects;

	if (eff?.levelBoost) {
		const result = useRareCandyItem(player, targetPokemon, room, user);
		if (!result.success) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateItemUseErrorHTML(result.message, itemId)}`);
		}
		if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
		}
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
	}

	if (eff?.expBoost) {
		const result = useExpCandyItem(player, targetPokemon, itemId, room, user);
		if (!result.success) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateItemUseErrorHTML(result.message, itemId)}`);
		}
		if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
		}
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
	}

	if (eff?.canTerastallize) {
		const allTypes = Object.keys(TYPE_CHART);
		const newTeraType = allTypes[Math.floor(Math.random() * allTypes.length)];
		targetPokemon.teraType = newTeraType;
		removeItemFromInventory(player, itemId, 1);
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

	if (item.category === 'tm' || itemId.startsWith('tm-')) {
		if (targetPokemon.hp <= 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="rpg-infobox"><h2>Cannot Use TM</h2><p><strong>${targetPokemon.species}</strong> has fainted! Heal it before teaching a move.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
		}

		const moveId = itemId.replace('tm-', '');
		const speciesId = toID(targetPokemon.species);
		const tmMoves = MANUAL_LEARNSETS[speciesId]?.tm || [];
		const dexLearnset = Dex.species.get(speciesId).learnset;
		let canLearn = tmMoves.includes(moveId);

		if (!canLearn && dexLearnset) {
			const learnData = dexLearnset[moveId];
			if (learnData) canLearn = true;
		}

		if (!canLearn) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="rpg-infobox"><h2>Incompatible TM</h2><p><strong>${targetPokemon.species}</strong> cannot learn this move.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
		}

		if (targetPokemon.moves.some(m => m.id === moveId)) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="rpg-infobox"><h2>Move Already Known</h2><p><strong>${targetPokemon.species}</strong> already knows this move!</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
		}

		if (targetPokemon.moves.length < 4) {
			const newMoveData = getMove(moveId);
			targetPokemon.moves.push({ id: moveId, pp: newMoveData.pp || 5 });
			removeItemFromInventory(player, itemId, 1);
			const successMsg = `<strong>${targetPokemon.species}</strong> learned <strong>${newMoveData.name}</strong>!`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		} else {
			if (!player.pendingMoveLearnQueue) {
				player.pendingMoveLearnQueue = [];
			}
			player.pendingMoveLearnQueue.push({ pokemonId: targetPokemon.id, moveIds: [moveId] });
			removeItemFromInventory(player, itemId, 1);
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
		}
	}

	const evoMessage = checkEvolution(player, targetPokemon, { room, user }, itemId);
	if (evoMessage) {
		removeItemFromInventory(player, itemId, 1);
		if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
		}
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, evoMessage)}`);
	}

	if (itemId.endsWith('stone')) {
		return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateEvolutionStoneErrorHTML(targetPokemon.species, itemId)}`);
	}

	return this.errorReply("This item cannot be used right now.");
}

export const teraToggleState = new Map<string, boolean>();
export const activeScriptedEvents = new Map<string, string>();

export const commands: ChatCommands = {
	rpg: {
		start(target, room, user) {
			const player = getPlayerData(user.id);
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			if (player.party.length > 0) {
				return this.parse('/rpg explore');
			}
			this.sendReply(`|uhtml|rpg-${user.id}|${generateWelcomeHTML()}`);
		},

		modes(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot change modes during a battle.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateModeSelectionHTML()}`);
		},

		battletower: {
			start(target, room, user) {
				if (isInActiveBattle(user.id)) return this.errorReply("You are already in a battle.");
				const player = getPlayerData(user.id);
				if (player.battleTowerFloor <= 1) player.battleTowerFloor = 1;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleTowerWelcomeHTML(player.battleTowerFloor)}`);
			},

			selectformat(target, room, user) {
				if (isInActiveBattle(user.id)) return this.errorReply("You are already in a battle.");
				const player = getPlayerData(user.id);
				const format = toID(target) || 'battlefactory';

				if (!BATTLE_TOWER_FORMATS[format]) {
					return this.errorReply(`Invalid format. Available formats: ${Object.keys(BATTLE_TOWER_FORMATS).join(', ')}`);
				}

				if (player.battleTowerFloor <= 1) player.battleTowerFloor = 1;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleTowerFormatSelectedHTML(player.battleTowerFloor, format)}`);
			},

			beginfloor(target, room, user) {
				if (isInActiveBattle(user.id)) return this.errorReply("You are already in a battle.");
				const player = getPlayerData(user.id);

				if (player.party.length === 0) return this.errorReply("You must start Story Mode and get a Pokémon before you can enter the Battle Tower.");

				const format = toID(target) || 'battlefactory';
				startBattleTowerFloor(player, player.battleTowerFloor, this, room, user, format);
			},

			nextfloor(target, room, user) {
				const oldBattle = activeBattles.get(user.id);
				if (oldBattle && oldBattle.battleType === 'battletower' && oldBattle.battleResult === 'victory') {
					const format = oldBattle.battleTowerFormat || 'battlefactory';
					activeBattles.delete(user.id);
					teraToggleState.delete(user.id);

					const player = getPlayerData(user.id);
					startBattleTowerFloor(player, player.battleTowerFloor, this, room, user, format);
				} else if (isInActiveBattle(user.id)) {
					return this.errorReply("You are still in a battle.");
				} else {
					const player = getPlayerData(user.id);
					startBattleTowerFloor(player, player.battleTowerFloor, this, room, user, 'battlefactory');
				}
			},

			'': 'start',
		},

		storymode(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.parse('/rpg explore');
			}
			const startLocId = GameConfig.startLocationId;
			const locationData = LOCATIONS[startLocId];
			player.location = locationData?.name || 'Unknown';

			return this.parse('/rpg explore');
		},

		choosestarter(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const type = target.trim().toLowerCase();
			const starters = STARTER_POKEMON[type as keyof typeof STARTER_POKEMON];
			if (!starters) {
				return this.errorReply("Invalid type. Choose 'fire', 'water', or 'grass'.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStarterSelectionHTML(type, starters)}`);
		},

		starterchoice(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("Cannot do this in battle.");

			const args = target.split(' ');
			const npcId = toID(args[0]);
			const pokemonId = toID(args[1]);

			const npc = NPC_DATABASE[npcId];
			if (!npc?.action || npc.action.type !== 'choosestarter') return this.errorReply("Invalid NPC.");

			if (pokemonId) {
				const player = getPlayerData(user.id);
				const allStarters = Object.values(STARTER_POKEMON).flat();

				if (!allStarters.includes(pokemonId)) return this.errorReply("Invalid starter.");

				const result = NPCActions.handleChooseStarter(player, npc.action, pokemonId);
				if (result.success) {
					if (npc.action.onceOnly) player.completedNPCActions.add(npcId);

					const startLocId = GameConfig.startLocationId;
					const locationData = LOCATIONS[startLocId];
					if (player.location === 'Unknown Location' || !player.location) {
						player.location = locationData?.name || 'Unknown';
					}

					const species = Dex.species.get(result.pokemon!.species);
					const tempSlot = createActivePokemonSlot(result.pokemon!);

					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCStarterConfirmHTML(npc.name, result.message, tempSlot, species.name)}`);
				} else {
					return this.errorReply(result.message);
				}
			} else {
				const allStarters = Object.values(STARTER_POKEMON).flat();
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCStarterChoiceHTML(npcId, npc.name, allStarters)}`);
			}
		},

		selectstarter(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const starterId = toID(target);
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.errorReply("You already have a starter Pokémon!");
			}

			const allStarters = Object.values(STARTER_POKEMON).flat();
			if (!allStarters.includes(starterId)) {
				return this.errorReply("Invalid starter Pokémon.");
			}
			try {
				const starterPokemon = createPokemon(starterId, 5);
				player.party.push(starterPokemon);
				player.name = user.name;

				const startLocId = GameConfig.startLocationId;
				const locationData = LOCATIONS[startLocId];
				player.location = locationData?.name || 'Unknown';
				const species = Dex.species.get(starterId);

				const tempSlot = createActivePokemonSlot(starterPokemon);

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStarterConfirmHTML(tempSlot, species.name, player.location)}`);
				if (room?.roomid !== 'lobby') {
					room.add(`|c|~RPG Bot|${user.name} has chosen ${species.name} as their starter Pokémon!`).update();
				}
			} catch (error) {
				this.errorReply(`Error creating starter Pokémon: ${error}`);
			}
		},

		learnmove(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot do this during a battle.");
			}
			const player = getPlayerData(user.id);
			const queueArray = player.pendingMoveLearnQueue;
			if (!queueArray || queueArray.length === 0) {
				return this.errorReply("Your Pokemon is not trying to learn a new move.");
			}
			const queue = queueArray[0];
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
				queueArray.shift();
				if (queueArray.length > 0) {
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
				} else {
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
			const rawMoveId = parts.slice(1).join(' ');

			if (!pokemonId || !rawMoveId) {
				return this.errorReply("Invalid command parameters.");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			const speciesId = toID(pokemon.species);
			const eggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];

			if (!eggMoves.includes(rawMoveId)) {
				return this.errorReply("This is not a valid Egg Move for this Pokemon.");
			}
			if (!removeItemFromInventory(player, 'eggmovetutor', 1)) {
				return this.errorReply("Could not use the Egg Move Tutor. Item not found in inventory.");
			}

			const newMoveId = toID(rawMoveId);

			if (pokemon.moves.length < 4) {
				const newMoveData = getMove(newMoveId);
				pokemon.moves.push({ id: newMoveId, pp: newMoveData.pp || 5 });
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
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot view a summary during battle.");
			}
			const player = getPlayerData(user.id);
			const targetId = target.trim();

			if (!targetId) {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSummarySelectionHTML(player)}`);
			}

			let pokemon = player.party.find(p => p.id === targetId);
			let source: 'party' | 'pc' = 'party';

			if (!pokemon) {
				pokemon = player.pc.get(targetId);
				source = 'pc';
			}

			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party or PC.");
			}

			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePokemonSummaryHTML(pokemon, source)}`);
		},

		profile(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You are in a battle!");
			}
			const player = getPlayerData(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateProfileHTML(player)}`);
		},

		party(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot view your party during a battle.");
			}
			const player = getPlayerData(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player)}`);
		},

		swapslot(target, room, user) {
			if (isInActiveBattle(user.id)) {
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

			const temp = player.party[slot1];
			player.party[slot1] = player.party[slot2];
			player.party[slot2] = temp;

			this.parse('/rpg party');
		},

		items(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot access your bag in battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			const validCategories = ['pokeball', 'medicine', 'berry', 'tm', 'key', 'held', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateInventoryHTML(player, filterCategory)}`);
		},

		useitem(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot use items from the menu during a battle.");
			}
			const [itemId, pokemonId] = target.split(' ').map(arg => toID(arg));
			const player = getPlayerData(user.id);

			if (!itemId) return this.errorReply("Please specify an item to use.");
			if (!player.inventory.has(itemId)) return this.errorReply("You don't have that item.");

			const item = player.inventory.get(itemId)!;
			const itemData = ITEMS_DATABASE[itemId];
			const eff = itemData?.effects;

			if (itemId === 'sacredash') {
				const result = useSacredAsh(player);
				if (!result.success) return this.errorReply(result.message);
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, result.message)}`);
			}

			if (!pokemonId) {
				if (eff) {
					if (eff.revive) {
						const faintedPokemon = player.party.filter(p => p.hp <= 0);
						if (faintedPokemon.length === 1) return this.parse(`/rpg useitem ${itemId} ${faintedPokemon[0].id}`);
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMedicinePokemonSelectionHTML(player, itemId, item.name)}`);
					}

					if (eff.healAmount || eff.healPercent || eff.statusCure) {
						const damagedPokemon = player.party.filter(p => p.hp > 0 && (p.hp < p.maxHp || p.status));
						if (damagedPokemon.length === 1) return this.parse(`/rpg useitem ${itemId} ${damagedPokemon[0].id}`);
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMedicinePokemonSelectionHTML(player, itemId, item.name)}`);
					}

					if (eff.evBoost || eff.ppRestore || eff.ppRestoreAll) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMedicinePokemonSelectionHTML(player, itemId, item.name)}`);
					}

					if (item.category === 'misc') return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMiscItemPokemonSelectionHTML(player, itemId, item.name)}`);
					if (item.category === 'held' || item.category === 'berry') return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemPokemonSelectionHTML(player, itemId)}`);
				}

				return this.errorReply("This item category cannot be used from the bag directly.");
			}

			const targetPokemon = player.party.find(p => p.id === pokemonId);
			if (!targetPokemon) return this.errorReply("Pokemon not found in party.");

			if (item.category === 'medicine') {
				return handleUseMedicine.call(this, player, item, targetPokemon, room, user);
			}

			if (item.category === 'misc') {
				return handleUseMiscItem.call(this, player, item, targetPokemon, room, user);
			}

			return this.errorReply("This item cannot be used in this way.");
		},

		restorepp(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot do this during a battle.");
			const [pokemonId, moveId, itemId] = target.split(' ').map(arg => toID(arg));

			const player = getPlayerData(user.id);
			const pokemon = player.party.find(p => p.id === pokemonId);
			const itemData = ITEMS_DATABASE[itemId];
			const eff = itemData?.effects;

			if (!pokemon || !eff?.ppRestore) return this.errorReply("Invalid usage or item.");

			const move = pokemon.moves.find(m => m.id === moveId);
			if (!move) return this.errorReply("Move not found.");

			const moveData = getMove(moveId);
			const maxPP = moveData.pp || 5;

			if (move.pp >= maxPP) return this.errorReply("Move already has full PP.");

			const restoreAmount = (eff.ppRestore === -1) ? maxPP : eff.ppRestore;
			const oldPP = move.pp;
			move.pp = Math.min(maxPP, move.pp + restoreAmount);
			const restored = move.pp - oldPP;

			removeItemFromInventory(player, itemId, 1);
			const msg = `Used <strong>${itemData.name}</strong>. Restored <strong>${restored} PP</strong> to ${moveData.name}.`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, msg)}`);
		},

		pc(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePCHTML(getPlayerData(user.id))}`);
		},

		depositpc(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot access the PC during a battle.");
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);

			if (player.party.length <= 1) return this.errorReply("You must keep at least one Pokemon in your party!");
			const pokemonIndex = player.party.findIndex(p => p.id === pokemonId);
			if (pokemonIndex === -1) return this.errorReply("Pokemon not found in party.");

			const [pokemon] = player.party.splice(pokemonIndex, 1);
			storePokemonInPC(player, pokemon);

			const successMsg = `Sent <strong>${pokemon.species}</strong> to the PC.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		},

		withdrawpc(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot access the PC during a battle.");
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);

			if (player.party.length >= 6) return this.errorReply("Your party is full!");

			const pokemon = withdrawPokemonFromPC(player, pokemonId);
			if (!pokemon) return this.errorReply("Pokemon not found in PC.");

			player.party.push(pokemon);

			const successMsg = `Withdrew <strong>${pokemon.species}</strong> to your party.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePCHTML(player, successMsg)}`);
		},

		shop(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot shop during a battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			const validCategories = ['pokeball', 'medicine', 'held', 'berry', 'tm', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateShopHTML(player, filterCategory)}`);
		},

		buy(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot shop during a battle.");
			const [itemId, quantityStr] = target.split(' ');
			const quantity = parseInt(quantityStr) || 1;
			const player = getPlayerData(user.id);

			if (!itemId || !ITEMS_DATABASE[itemId]) return this.errorReply("Invalid item specified.");
			if (quantity <= 0) return this.errorReply("You must buy at least 1 item.");

			const locationId = toID(player.location);
			const shopInventory = getShopInventory(locationId, player.badges);
			if (!shopInventory.includes(itemId)) return this.errorReply("This item is not available in this shop.");

			const itemData = ITEMS_DATABASE[itemId];
			const itemPrice = itemData.price || 0;

			if (itemPrice <= 0) return this.errorReply("This item is not for sale.");
			const totalCost = itemPrice * quantity;
			if (player.money < totalCost) return this.errorReply(`You don't have enough money! You need ₽${totalCost}.`);

			player.money -= totalCost;
			addItemToInventory(player, itemId, quantity);

			const successMsg = `Purchased <strong>${quantity}x ${itemData.name}</strong> for ₽${totalCost}.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateShopHTML(player, undefined, successMsg)}`);
		},

		sell(target, room, user) {
			if (isInActiveBattle(user.id)) {
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

			const itemData = ITEMS_DATABASE[itemId];
			const purchasePrice = itemData.price || 0;
			if (purchasePrice <= 0) return this.errorReply("This item cannot be sold.");

			const sellPrice = Math.floor(purchasePrice / 2);
			const totalGain = sellPrice * quantity;

			removeItemFromInventory(player, itemId, quantity);
			player.money += totalGain;

			const successMsg = `Sold <strong>${quantity}x ${itemInBag.name}</strong> for ₽${totalGain}.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSellMenuHTML(player, successMsg)}`);
		},

		pokedex(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot use the Pokedex during a battle.");
			}
			const player = getPlayerData(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePokedexHTML(player)}`);
		},

		explore(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot explore during a battle.");
			}

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];

			if (!currentLocation) {
				return this.errorReply(`Unknown location: ${player.location}`);
			}

			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, currentLocation)}`);
		},

		travel(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot travel during a battle.");

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);

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

			const targetLocationId = toID(target);
			const targetLocation = LOCATIONS[targetLocationId];
			const currentLocation = LOCATIONS[currentLocationId];

			if (!targetLocation || !currentLocation) return this.errorReply("Invalid location.");

			const connection = currentLocation.connectedLocations.find(c => c.id === targetLocationId);
			if (!connection) return this.errorReply(`You can't travel to ${targetLocation.name} from here.`);

			if (connection.requiredBadge && !player.obtainedBadges.includes(connection.requiredBadge)) return this.errorReply(`Locked: Requires ${connection.requiredBadge}.`);
			if (connection.requiredFlag && !player.storyFlags.has(connection.requiredFlag)) return this.errorReply(`Locked.`);

			player.location = targetLocation.name;
			player.visitedLocations.add(targetLocationId);

			const triggeredEvents = [];
			if (targetLocation.scriptedEvents) {
				for (const event of targetLocation.scriptedEvents) {
					const eventFlagId = `scripted_${event.id}`;
					if (event.triggerOnce && player.storyFlags.has(eventFlagId)) continue;
					if (event.requiredFlag && !player.storyFlags.has(event.requiredFlag)) continue;
					if (event.requiredBadgeCount && player.obtainedBadges.length < event.requiredBadgeCount) continue;
					if (event.maxBadgeCount && player.obtainedBadges.length > event.maxBadgeCount) continue;
					if (event.preventIfFlag && player.storyFlags.has(event.preventIfFlag)) continue;
					triggeredEvents.push(event);

					const interactiveTypes = ['choice', 'quiz', 'moralchoice', 'branching', 'wildbattle', 'bossbattle', 'raidbattle', 'trainer', 'gymchallenge', 'elitefour', 'tournament', 'gauntletbattle'];
					if (event.triggerOnce && !interactiveTypes.includes(event.type)) player.storyFlags.add(eventFlagId);
					if (event.setFlag && !interactiveTypes.includes(event.type)) player.storyFlags.add(event.setFlag);
				}
			}

			if (triggeredEvents.length > 0) {
				const firstEvent = triggeredEvents[0];
				const result = { success: true, message: '' };

				if (['wildbattle', 'bossbattle', 'raidbattle'].includes(firstEvent.type)) {
					if (firstEvent.type === 'wildbattle' && firstEvent.pokemon) {
						const newPokemon = createPokemon(firstEvent.pokemon.species, firstEvent.pokemon.level);
						if (firstEvent.pokemon.moves) {
							newPokemon.moves = firstEvent.pokemon.moves.map(m => ({ id: toID(m), pp: 5 }));
						}
						if (firstEvent.pokemon.shiny) newPokemon.shiny = true;
						player.pc.set(`scripted_wild_${firstEvent.id}`, newPokemon);
						result.message = firstEvent.dialogue || `A wild ${newPokemon.species} appeared!`;
					} else if (firstEvent.type === 'raidbattle') {
						const r = ScriptedEvents.handleRaidBattle(player, firstEvent);
						result.message = r.message;
						if (r.raidBoss) {
							const raidMon = createPokemon(r.raidBoss.species, r.raidLevel ? r.raidLevel * 10 : 50);
							player.pc.set(`scripted_wild_${firstEvent.id}`, raidMon);
						}
					} else if (firstEvent.type === 'bossbattle') {
						const r = ScriptedEvents.handleBossBattle(player, firstEvent);
						result.message = r.message;
					}
				} else {
					const handlerName = `handle${firstEvent.type.charAt(0).toUpperCase() + firstEvent.type.slice(1)}`;

					if (ScriptedEvents[handlerName]) {
						const r = ScriptedEvents[handlerName](player, firstEvent, firstEvent.id);
						result.message = r.message;
						if (r.opponent) firstEvent.nextOpponent = r.opponent;
					} else {
						result.message = firstEvent.dialogue || 'Event occurred.';
					}
				}

				const html = generateScriptedEventHTML(firstEvent, result.message);
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const msg = `You arrived at ${targetLocation.name}.`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, targetLocation, msg)}`);
		},

		eventchoice(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("Cannot do this in battle.");
			const player = getPlayerData(user.id);
			const location = LOCATIONS[toID(player.location)];
			const index = parseInt(target);

			let activeEvent = null;
			if (location?.scriptedEvents) {
				for (const event of location.scriptedEvents) {
					const eventFlagId = `scripted_${event.id}`;
					if (event.triggerOnce && player.storyFlags.has(eventFlagId)) continue;
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

			if (activeEvent.type === 'choice') result = ScriptedEvents.handleChoice(player, activeEvent, index);
			else if (activeEvent.type === 'quiz') result = ScriptedEvents.handleQuiz(player, activeEvent, index);
			else if (activeEvent.type === 'moralchoice') result = ScriptedEvents.handleMoralChoice(player, activeEvent, index);
			else if (activeEvent.type === 'branching') result = ScriptedEvents.handleBranchingPath(player, activeEvent, index);

			if (result.success) {
				this.sendReplyBox(result.message);
				if (activeEvent.triggerOnce) player.storyFlags.add(`scripted_${activeEvent.id}`);
				return this.parse('/rpg explore');
			} else {
				return this.errorReply(result.message);
			}
		},

		completeevent(target, room, user) {
			const eventId = target.trim();
			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);
			const location = LOCATIONS[currentLocationId];
			const event = location?.scriptedEvents?.find(e => e.id === eventId);

			if (event && eventId) {
				if (event.type === 'tournament') ScriptedEvents.advanceTournamentRound(player, eventId);
				else if (event.type === 'gauntletbattle') ScriptedEvents.advanceGauntletEvent(player, eventId);
				else player.storyFlags.add(`scripted_${eventId}`);

				activeScriptedEvents.delete(user.id);
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, location, "Battle Won!")}`);
			}
			return this.parse('/rpg explore');
		},

		building(target, room, user) {
			if (isInActiveBattle(user.id)) {
				return this.errorReply("You cannot enter a building during a battle.");
			}

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];

			if (!currentLocation) return this.errorReply(`Unknown location: ${player.location}`);
			if (!target) return this.errorReply("Please specify which building to enter.");

			const buildingId = toID(target);
			const building = currentLocation.buildings?.find(b => toID(b.id) === buildingId);

			if (!building) return this.errorReply("That building doesn't exist in this location.");
			if (building.accessible === false) return this.errorReply("This building is currently locked.");
			if (building.requiredFlag && !player.storyFlags.has(building.requiredFlag)) return this.errorReply("You can't access this building yet.");

			let buildingHTML = `<div class="rpg-infobox"><div class="rpg-text-center"><h2><b>${building.name}</b></h2><p><em>${building.description}</em></p></div><hr>`;

			if (building.npcs && building.npcs.length > 0) {
				buildingHTML += '<p><strong>People here:</strong></p>';
				for (const npcId of building.npcs) {
					const npc = NPC_DATABASE[npcId];
					if (npc) {
						if (npc.flags && !npc.flags.every(flag => player.storyFlags.has(flag))) continue;
						buildingHTML += `<button name="send" value="/rpg talknpc ${npcId}" class="button">💬 ${npc.name}</button> `;
					}
				}
			}

			buildingHTML += '<p><strong>Actions:</strong></p>';
			if (building.type === 'pokecenter') buildingHTML += `<button name="send" value="/rpg pc" class="button">💻 Access PC</button> `;
			if (building.type === 'pokemart' || building.type === 'department') buildingHTML += `<button name="send" value="/rpg shop" class="button">🏪 Shop</button> `;
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
			if (isInActiveBattle(user.id)) return this.errorReply("You are already in a battle!");

			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) return this.errorReply("All your Pokémon have fainted!");

			const zoneId = toID(target);
			const zone = ENCOUNTER_ZONES[zoneId];
			if (!zone) return this.errorReply("This is not a valid area to explore.");

			const zoneBattleType = zone.battleType || 'single';
			let finalBattleType: BattleState['battleType'] = 'wild';
			const battleMessages: string[] = [];
			const opponentParty: RPGPokemon[] = [];

			try {
				const wildSpecies1 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
				const [minLevel, maxLevel] = zone.levelRange;
				const wildLevel1 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
				const wildPokemon1 = createPokemon(wildSpecies1, wildLevel1);
				opponentParty.push(wildPokemon1);

				if (zoneBattleType === 'double') {
					finalBattleType = 'wild_double';

					const wildSpecies2 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
					const wildLevel2 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
					const wildPokemon2 = createPokemon(wildSpecies2, wildLevel2);
					opponentParty.push(wildPokemon2);
					battleMessages.push(`A wild ${wildPokemon1.species} and ${wildPokemon2.species} appeared!`);
				} else {
					battleMessages.push(`A wild ${wildPokemon1.species} appeared!`);
				}

				initializeAndStartBattle(
					this, room, user, player, activeParty,
					{ name: 'Wild Pokémon', party: opponentParty, money: 0 },
					{ battleType: finalBattleType, zoneId },
					battleMessages
				);
			} catch (error) {
				this.errorReply(`Error generating wild Pokémon: ${error}`);
			}
		},

		scriptedbattle(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You are already in a battle!");

			const eventId = target.trim();
			const player = getPlayerData(user.id);

			const tempKey = `scripted_wild_${eventId}`;
			const wildPokemon = player.pc.get(tempKey);

			if (!wildPokemon) return this.errorReply("This encounter is no longer available.");
			activeScriptedEvents.set(user.id, eventId);
			player.pc.delete(tempKey);

			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) return this.errorReply("Your team is fainted!");

			try {
				const startMsg = `A wild ${wildPokemon.shiny ? '✨ ' : ''}${wildPokemon.species} appeared!`;

				initializeAndStartBattle(
					this, room, user, player, activeParty,
					{ name: `Wild ${wildPokemon.species}`, party: [wildPokemon], money: 0 },
					{ battleType: 'wild', zoneId: 'scripted', eventId },
					[startMsg]
				);
			} catch (error) {
				activeBattles.delete(user.id);
				teraToggleState.delete(user.id);
				return this.errorReply("Error starting battle: " + String(error));
			}
		},

		challenge(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You are already in a battle!");

			const args = target.split(' ');
			const trainerId = toID(args[0]);
			const eventId = args[1];

			if (eventId) activeScriptedEvents.set(user.id, eventId);

			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) return this.errorReply("You must heal your Pokémon before challenging a trainer!");

			const trainerSpec = TRAINER_DATABASE[trainerId];
			if (!trainerSpec) return this.errorReply("That trainer could not be found.");

			const trainerParty: RPGPokemon[] = [];
			for (const spec of trainerSpec.party) {
				const pokemon = createPokemon(spec.species, spec.level);
				if (spec.moves) {
					pokemon.moves = spec.moves.map(moveId => {
						const moveData = getMove(moveId);
						return { id: moveId, pp: moveData.pp || 5 };
					});
				}
				if (spec.item) pokemon.item = spec.item;
				trainerParty.push(pokemon);
			}

			if (trainerParty.length === 0) return this.errorReply("This trainer has no Pokémon!");

			const specBattleType = trainerSpec.battleType || 'single';
			let finalBattleType: BattleState['battleType'] = 'trainer';
			if (specBattleType === 'double') finalBattleType = 'trainer_double';

			const startMessage = trainerSpec.dialogue?.start || `You are challenged by ${trainerSpec.name}!`;

			initializeAndStartBattle(
				this, room, user, player, activeParty,
				{ name: trainerSpec.name, party: trainerParty, money: trainerSpec.money, trainerId },
				{ battleType: finalBattleType, zoneId: 'trainer_battle', eventId },
				[startMessage]
			);
		},

		battle(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You are already in a battle!");

			const availableZoneIds = Object.keys(ENCOUNTER_ZONES);
			if (availableZoneIds.length === 0) return this.errorReply("There are no wild Pokémon zones configured yet.");

			const randomZoneId = availableZoneIds[Math.floor(Math.random() * availableZoneIds.length)];
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

				if (attackerSlotIndex !== 0 && attackerSlotIndex !== 1) return this.errorReply("Invalid attacker slot.");

				const attackerSlot = battle.playerSlots[attackerSlotIndex];
				if (!attackerSlot || attackerSlot.pokemon.hp <= 0) return this.errorReply("This Pokémon cannot move.");
				if (battle.pendingActions[attackerSlotIndex]) return this.errorReply("Action already queued.");

				const moveData = getMove(moveId);
				if (!moveData.exists) return this.errorReply(`Move '${moveId}' not found.`);

				if (shouldTerastallize) {
					if (battle.playerTerastallizeUsed) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"])}`);
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

				const activePlayerSlots = battle.playerSlots.filter(s => s && s.pokemon.hp > 0).length;
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
						battle.playerSlots[slotToFill as 0 | 1] = battle.pendingPivot.slot;
						battle.pendingPivot = undefined;
					}
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["The battle continues..."])}`);
				}

				const player = getPlayerData(battle.playerId);
				const partyToUse = battle.overridePlayerParty || player.party;
				const partyIndex = partyToUse.findIndex(p => p.id === pokemonId && p.hp > 0);

				if (partyIndex === -1) return this.errorReply("Invalid Pokemon or it has fainted.");
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonId)) return this.errorReply("This Pokemon is already in battle.");
				if (battle.playerSlots[slotToFill] !== null && !battle.pendingPivot) return this.errorReply("This slot is not empty.");

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

				battle.playerSlots[slotToFill as 0 | 1] = newSlot;

				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
				if (faintedOnEntry) messageLog.push(`<span class="rpg-text-error"><strong>${newSlot.pokemon.species} fainted upon entry!</strong></span>`);
				else handleMirrorHerb(newSlot, battle, messageLog);

				const isDoubleBattle = battle.battleType.includes('double');
				const slotsToCheck = isDoubleBattle ? [0, 1] : [0];
				const needsAnotherSwitch = slotsToCheck.some(i => battle.playerSlots[i] === null) &&
					partyToUse.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));

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

				const outgoingSlot = battle.playerSlots[slotToSwitchOut];
				if (!outgoingSlot || outgoingSlot.pokemon.hp <= 0) return this.errorReply("Slot empty or fainted.");

				const trappingPokemon = checkTrappingAbility(outgoingSlot, battle);
				if (trappingPokemon) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Trapped by ${trappingPokemon.pokemon.ability}!`])}`);
				if (outgoingSlot.isTrapped || outgoingSlot.partiallyTrapped) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped!`])}`);
				if (outgoingSlot.isIngrained) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is rooted!`])}`);

				const player = getPlayerData(battle.playerId);
				const partyToUse = battle.overridePlayerParty || player.party;
				const incomingPokemon = partyToUse.find(p => p.id === pokemonIdIn && p.hp > 0);

				if (!incomingPokemon) return this.errorReply("Invalid Pokemon.");
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonIdIn)) return this.errorReply("Pokemon already in battle.");

				outgoingSlot.lockedMove = undefined;
				outgoingSlot.lockedMoveCounter = 0;

				battle.pendingActions[slotToSwitchOut] = {
					actionType: 'switch',
					switchToPokemonId: pokemonIdIn,
					pokemonId: outgoingSlot.pokemon.id,
				};

				const activePlayerSlots = getActiveSlots(battle.playerSlots).length;
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
					const activeOpponents = getActiveSlots(battle.opponentSlots);
					if (activeOpponents.length > 1) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMultipleOpponentsCatchErrorHTML()}`);
				}
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchMenuHTML(getPlayerData(battle.playerId), battle)}`);
			},

			selectcatchtarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				if (battle.battleType.includes('trainer')) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);

				const ballId = toID(target);
				const activeOpponents = getActiveSlots(battle.opponentSlots);
				if (activeOpponents.length === 1) {
					const slotIndex = battle.opponentSlots.indexOf(activeOpponents[0]) + 2;
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

					if (ballId === 'healball') {
						caughtPokemon.hp = caughtPokemon.maxHp;
						caughtPokemon.status = null;
					}

					const location = player.party.length < 6 ? "your party" : "PC";
					if (player.party.length < 6) player.party.push(caughtPokemon);
					else storePokemonInPC(player, caughtPokemon);

					const tempSlot = createActivePokemonSlot(caughtPokemon);
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchSuccessHTML(caughtPokemon, tempSlot, location, zoneId, ballId === 'healball')}`);
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

				const playerSlots = getActiveSlots(battle.playerSlots);
				for (const slot of playerSlots) {
					const trapping = checkTrappingAbility(slot, battle);
					if (trapping) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Trapped by ${trapping.pokemon.ability}!`])}`);
					if (slot.isTrapped || slot.partiallyTrapped) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`You can't escape!`])}`);
				}

				saveBattleStatus(battle);
				activeBattles.delete(user.id);
				teraToggleState.delete(user.id);

				const player = getPlayerData(user.id);
				const location = LOCATIONS[toID(player.location)];
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, location, "You ran away safely!")}`);
			},

			back(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (battle) {
					for (let i = 0; i < battle.playerSlots.length; i++) {
						if (battle.playerSlots[i] === null || battle.playerSlots[i]?.pokemon.hp === 0) delete battle.pendingActions[i];
					}
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You returned to the battle."], undefined, teraToggleState.get(user.id))}`);
				}
			},

			help() {
				this.sendReply("Battle commands: /rpg battleaction [move|switch|catchmenu|run]");
			},
		},

		giveitem(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const [pokemonId, itemId] = target.split(' ').map(toID);

			if (!pokemonId) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemSelectionHTML(player)}`);

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found.");

			if (!itemId) return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemToSpecificPokemonHTML(player, pokemon)}`);

			const item = player.inventory.get(itemId);
			if (!item || (item.category !== 'held' && item.category !== 'berry')) return this.errorReply("Invalid item.");

			if (pokemon.item) {
				if (RPGAbilities.checkItemRemovalPrevention(pokemon)) return this.errorReply("Cannot swap item.");
				addItemToInventory(player, pokemon.item, 1);
			}

			pokemon.item = itemId;
			removeItemFromInventory(player, itemId, 1);

			const successMsg = `Gave <strong>${item.name}</strong> to ${pokemon.species}.`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		},

		takeitem(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const pokemonId = toID(target);

			if (!pokemonId) {
				const pokemonWithItems = player.party.filter(p => p.item);
				if (pokemonWithItems.length === 1) return this.parse(`/rpg takeitem ${pokemonWithItems[0].id}`);
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateTakeItemSelectionHTML(player)}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found.");
			if (!pokemon.item) return this.errorReply("No item to take.");

			if (RPGAbilities.checkItemRemovalPrevention(pokemon)) return this.errorReply("Cannot take item.");

			const item = ITEMS_DATABASE[pokemon.item];
			addItemToInventory(player, pokemon.item, 1);
			pokemon.item = undefined;

			const successMsg = `Took <strong>${item?.name || "Item"}</strong> from ${pokemon.species}.`;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, successMsg)}`);
		},

		nickname(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot change nicknames during a battle.");
			const player = getPlayerData(user.id);
			const parts = target.split(',');
			const pokemonId = parts[0]?.trim();
			const newNickname = parts.slice(1).join(',').trim();

			if (!pokemonId || !newNickname) return this.errorReply("Usage: /rpg nickname [pokemonId], [new nickname]");

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokemon not found.");
			if (newNickname.length > 12) return this.errorReply("Nickname too long.");

			const oldNickname = pokemon.nickname;
			pokemon.nickname = newNickname;
			return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePartyScreenHTML(player, `Changed ${oldNickname} to ${pokemon.nickname}.`)}`);
		},

		reset(target, room, user) {
			const player = getPlayerData(user.id);
			if (player.party.length === 0 && player.pc.size === 0 && player.inventory.size === 0) return this.errorReply("No data to reset.");

			if (isInActiveBattle(user.id)) {
				activeBattles.delete(user.id);
				teraToggleState.delete(user.id);
			}

			playerData.delete(user.id);
			this.sendReplyBox("Game data reset.");
			return this.parse('/rpg start');
		},

		unstuck(target, room, user) {
			if (!activeBattles.has(user.id)) return this.errorReply("You are not in a battle.");

			const battle = activeBattles.get(user.id);
			if (battle) saveBattleStatus(battle);

			activeBattles.delete(user.id);
			teraToggleState.delete(user.id);

			const player = getPlayerData(user.id);
			const location = LOCATIONS[toID(player.location)];
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(player, location, "Battle force-exited.")}`);
		},

		npc(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("You cannot talk to NPCs during a battle.");

			const player = getPlayerData(user.id);
			const npcId = toID(target);

			if (!npcId) {
				const currentLocationId = toID(player.location);
				const currentLocation = LOCATIONS[currentLocationId];
				const availableNPCs: [string, NPCData][] = [];

				for (const [id, npc] of Object.entries(NPC_DATABASE)) {
					const npcLocationId = toID(npc.location);
					if (npcLocationId === currentLocationId) {
						if (!npc.flags || npc.flags.every(f => player.storyFlags.has(f))) availableNPCs.push([id, npc]);
					} else if (currentLocation?.buildings) {
						const building = currentLocation.buildings.find(b => toID(b.id) === npcLocationId);
						if (building?.npcs?.includes(id)) {
							if (!npc.flags || npc.flags.every(f => player.storyFlags.has(f))) availableNPCs.push([id, npc]);
						}
					}
				}

				if (availableNPCs.length === 0) return this.errorReply("There are no NPCs here.");
				if (availableNPCs.length === 1) return this.parse(`/rpg npc ${availableNPCs[0][0]}`);

				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCSelectionHTML(availableNPCs)}`);
			}

			const npc = NPC_DATABASE[npcId];
			if (!npc) return this.errorReply("That NPC doesn't exist.");
			if (npc.flags && !npc.flags.every(f => player.storyFlags.has(f))) return this.errorReply("Cannot talk to this NPC yet.");

			let npcToRender = npc;
			if (npc.action?.onceOnly && player.completedNPCActions.has(npcId)) {
				npcToRender = { ...npc, action: null, dialogue: npc.dialogue + ' <br><br><em class="rpg-text-muted">(Request completed.)</em>' };
			}

			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCInteractionHTML(npcToRender)}`);
		},

		npcaction(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("Cannot interact during battle.");

			const player = getPlayerData(user.id);
			const args = target.split(' ');
			const npcId = toID(args[0]);
			const param1 = args.slice(1).join(' ');

			const npc = NPC_DATABASE[npcId];
			if (!npc?.action) return this.errorReply("Invalid NPC action.");

			const action = npc.action;
			if (action.onceOnly && player.completedNPCActions.has(npcId)) return this.errorReply("Already completed.");

			let result: { success: boolean, message: string, canBattle?: boolean } = { success: false, message: "Failed." };

			switch (action.type) {
			case 'giveitem':
				if (action.itemId && action.quantity) {
					addItemToInventory(player, action.itemId, action.quantity);
					const item = ITEMS_DATABASE[action.itemId];
					result = { success: true, message: `Received <strong>${item?.name || action.itemId} x${action.quantity}</strong>!` };
					if (action.onceOnly) player.completedNPCActions.add(npcId);
				}
				break;

			case 'givepokemon':
				if (action.pokemon) {
					if (player.party.length >= 6 && player.pc.size >= 100) return this.errorReply("Storage full!");
					const pokemon = createPokemon(action.pokemon.species, action.pokemon.level);
					const species = Dex.species.get(action.pokemon.species);
					if (player.party.length < 6) {
						player.party.push(pokemon);
						result = { success: true, message: `<strong>${species.name}</strong> joined your party!` };
					} else {
						storePokemonInPC(player, pokemon);
						result = { success: true, message: `<strong>${species.name}</strong> sent to PC.` };
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
						const item = ITEMS_DATABASE[action.itemId];
						result = { success: true, message: `Traded for <strong>${item?.name || action.itemId} x${action.quantity}</strong>!` };
						if (action.onceOnly) player.completedNPCActions.add(npcId);
					} else {
						return this.errorReply("Not enough items.");
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
						result = { success: true, message: `Received <strong>₽${reward}</strong>!` };
						if (action.onceOnly) player.completedNPCActions.add(npcId);
					} else {
						return this.errorReply("Missing item.");
					}
				}
				break;

			case 'choosestarter':
				return this.parse(`/rpg starterchoice ${npcId}`);

			case 'heal': result = NPCActions.handleHeal(player); break;
			case 'fossilrevival': result = NPCActions.handleFossilRevival(player, action, toID(param1)); break;
			case 'dailyreward': result = NPCActions.handleDailyReward(player, action, npcId); break;
			case 'battlerequest':
				const br = NPCActions.handleBattleRequest(player, action, npcId);
				result = { success: br.success, message: br.message, canBattle: br.canBattle };
				break;
			case 'questchain': result = NPCActions.handleQuestChain(player, action, npcId); break;
			case 'itemcraft': result = NPCActions.handleItemCraft(player, action, parseInt(param1)); break;
			case 'berryplant': result = NPCActions.handleBerryPlant(player, action, npcId, toID(param1)); break;
			case 'pokemongrooming':
				if (player.party.length > 0) result = NPCActions.handlePokemonGrooming(player, action, player.party[0]);
				else return this.errorReply("No Pokemon.");
				break;
			case 'fortuneteller': result = NPCActions.handleFortuneTeller(player, action, npcId, toID(param1) || 'luck'); break;
			case 'pokemonbreeder':
				if (player.party.length >= 2) result = NPCActions.handlePokemonBreeder(player, action, player.party[0], player.party[1]);
				else return this.errorReply("Need 2 Pokemon.");
				break;

			default:
				const handlerName = `handle${action.type.charAt(0).toUpperCase() + action.type.slice(1)}`;
				// @ts-ignore
				if (NPCActions[handlerName]) {
					// @ts-ignore
					result = NPCActions[handlerName](player, action, npcId, param1);
				} else {
					result = { success: false, message: `Unknown action type: ${action.type}` };
				}
				break;
			}

			let npcToRender = npc;
			if (result.success && npc.action?.onceOnly) {
				npcToRender = { ...npc, action: null, dialogue: npc.dialogue + ' <br><br><em class="rpg-text-muted">(Request completed.)</em>' };
			}

			if (result.success) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCInteractionHTML(npcToRender, result.message)}`);
				if (result.canBattle && action.trainerId) return this.parse(`/rpg challenge ${action.trainerId}`);
			} else {
				const errorMsg = `<span class="rpg-text-error">${result.message}</span>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateNPCInteractionHTML(npcToRender, errorMsg)}`);
			}
		},

		async dbsave(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("Cannot save during battle.");
			try {
				await savePlayerToDB(getPlayerData(user.id));
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateProfileHTML(getPlayerData(user.id), "Game saved successfully!")}`);
			} catch (error) {
				return this.errorReply("Save failed: " + String(error));
			}
		},

		async dbload(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("Cannot load during battle.");
			try {
				if (!await hasSaveInDB(user.id)) return this.errorReply("No save found.");
				const loadedPlayer = await loadPlayerFromDB(user.id);
				if (!loadedPlayer) return this.errorReply("Load failed.");
				const msg = `Save loaded! Welcome back, ${loadedPlayer.name}.`;
				const loc = LOCATIONS[toID(loadedPlayer.location)] || LOCATIONS[GameConfig.startLocationId];
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateExploreHTML(loadedPlayer, loc, msg)}`);
			} catch (error) {
				return this.errorReply("Load failed: " + String(error));
			}
		},

		async dbdelete(target, room, user) {
			if (isInActiveBattle(user.id)) return this.errorReply("Cannot delete during battle.");
			try {
				if (!await hasSaveInDB(user.id)) return this.errorReply("No save found.");
				if (!target || target !== 'confirm') return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateDBDeleteConfirmHTML()}`);
				if (!await deletePlayerFromDB(user.id)) return this.errorReply("Delete failed.");
				this.sendReplyBox("Save file deleted.");
				return this.parse('/rpg start');
			} catch (error) {
				return this.errorReply("Delete error: " + String(error));
			}
		},

		help() {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(`<div>RPG Help: Use /rpg start to begin. /rpg reset to wipe data.</div>`);
		},
		'': 'help',

		talknpc: 'npc',
		save: 'dbsave',
		load: 'dbload',
	},
};
