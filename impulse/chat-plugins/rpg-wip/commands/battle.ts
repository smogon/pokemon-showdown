/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*
*/
import { Dex, toID } from '../../../../sim/dex';
import { getMove, getActiveSlots } from '../../utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState } from '../../interface';
import {
	activeBattles,
} from '../../core';
import {
	getPlayerData,
} from '../../lib/player';
import {
	createPokemon,
} from '../../lib/pokemon';
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
} from '../../battle-engine';
import {
	generateBattleHTML,
	generateCatchMenuHTML,
	generateCatchTargetHTML,
	generateSwitchMenuHTML,
	generateRunHTML,
	generateCatchErrorHTML,
	generateCatchSuccessHTML,
} from '../../html';
import { ENCOUNTER_ZONES, LOCATIONS } from '../../locations';
import { TRAINER_DATABASE } from '../../trainers';

/**
 * Get the initial weather for a battle based on the player's location
 * Converts location weather format to battle weather format
 * Returns both the active weather and the location weather type for restoration
 */
function getLocationWeatherData(player: PlayerData): {
	weather: BattleState['weather'],
	locationWeather: BattleState['locationWeather'],
} {
	const locationId = toID(player.location);
	const location = LOCATIONS[locationId];

	if (!location?.weather) {
		return { weather: undefined, locationWeather: undefined };
	}

	// Convert location weather to battle weather format
	// Exclude 'fog' as per requirements
	const weatherMap: Record<string, 'sun' | 'rain' | 'sand' | 'hail'> = {
		'sun': 'sun',
		'rain': 'rain',
		'sandstorm': 'sand',
		'hail': 'hail',
	};

	const battleWeatherType = weatherMap[location.weather];
	if (!battleWeatherType) {
		return { weather: undefined, locationWeather: undefined };
	}

	// Return weather with very high turn count (9999) for permanent location weather
	// This effectively makes it permanent since battles rarely last that long
	// Also return locationWeather for restoration after temporary weather expires
	return {
		weather: {
			type: battleWeatherType,
			turns: 9999, // Very high number for permanent location-based weather
		},
		locationWeather: {
			type: battleWeatherType,
		},
	};
}

/**
 * Get the weather message for the start of a battle based on weather type
 */
function getWeatherStartMessage(weatherType: 'sun' | 'rain' | 'sand' | 'hail'): string {
	const weatherStartMessages: Record<string, string> = {
		'sun': 'The sunlight is strong.',
		'rain': 'It started to rain!',
		'sand': 'A sandstorm is raging!',
		'hail': 'It started to hail!',
	};
	return weatherStartMessages[weatherType];
}

export const commands: ChatCommands = {
	rpg: {
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
				this.popupReply(`|wide||html|${generateBattleHTML(battle)}`);
			} catch (error) {
				this.errorReply(`Error generating wild Pokémon: ${error}`);
			}
		},

		scriptedbattle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}

			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("All your Pokémon have fainted!");
			}

			// Get the temporarily stored wild Pokemon
			const tempWildId = target.trim();
			const wildPokemon = player.pc.get(tempWildId);

			if (!wildPokemon) {
				return this.errorReply("This scripted encounter is no longer available.");
			}

			// Remove from PC (it was only temporarily stored)
			player.pc.delete(tempWildId);

			const battleMessages: string[] = [];
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];

			try {
				// --- Player Pokemon ---
				playerSlots[0] = createActivePokemonSlot(activeParty[0]);

				// --- Scripted Wild Pokemon ---
				opponentSlots[0] = createActivePokemonSlot(wildPokemon);
				battleMessages.push(`A wild ${wildPokemon.shiny ? '✨ ' : ''}${wildPokemon.species} appeared!`);

				const opponentParty = [wildPokemon];

				const locationWeatherData3 = getLocationWeatherData(player);
				// Add weather message if there is location weather
				if (locationWeatherData3.weather) {
					battleMessages.push(getWeatherStartMessage(locationWeatherData3.weather.type));
				}

				// Create the battle state object
				const battle: BattleState = {
					battleType: 'wild',
					opponentName: `Wild ${wildPokemon.species}`,
					opponentParty,
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
					terrain: undefined, // Will be set by abilities
					playerShouldSwitch: undefined,
					pendingPivot: undefined,
					aiPendingPivot: undefined, // Corrected property name from source
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
				};

				// Apply switch-in abilities (which modifies the 'battle' object)
				if (playerSlots[0]) {
					applyHazardEffectsOnSwitchIn(playerSlots[0], battle, true, battleMessages);
				}
				if (opponentSlots[0]) {
					applyHazardEffectsOnSwitchIn(opponentSlots[0], battle, false, battleMessages);
				}

				// Set the modified battle object as the active battle
				activeBattles.set(user.id, battle);

				// Add initial messages to battle log
				battle.battleLog.push(...battleMessages);

				// Generate HTML using the modified battle object
				this.popupReply(`|wide||html|${generateBattleHTML(battle)}`);
			} catch (error) {
				activeBattles.delete(user.id);
				return this.errorReply("An error occurred while starting the battle: " + String(error));
			}
		},

		challenge(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("You must heal your Pokémon before challenging a trainer!");
			}

			const trainerId = toID(target);
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
			this.popupReply(`|wide||html|${generateBattleHTML(battle)}`);
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
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["Error: Invalid move command received."])}`);
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

				if (moveId !== 'struggle' && !attackerSlot.pokemon.moves.some(m => m.id === moveData.id)) {
					return this.errorReply(`${attackerSlot.pokemon.species} does not know ${moveData.name}.`);
				}

				// --- Terastallization validation ---
				if (shouldTerastallize) {
					if (battle.playerTerastallizeUsed) {
						return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"])}`);
					}
					if (attackerSlot.terastallized) {
						return this.popupReply(`|wide||html|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} has already Terastallized!`])}`);
					}
				}

				// --- REFACTORED VALIDATION ---
				const validationError = validateMoveAction(attackerSlot, moveId, battle);
				if (validationError) {
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, [validationError])}`);
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
					this.popupReply(`|wide||html|${generateBattleHTML(battle, messageLog)}`);
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
						return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"])}`);
					}
					if (attackerSlot.terastallized) {
						return this.popupReply(`|wide||html|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} has already Terastallized!`])}`);
					}
				}

				// Re-render the UI in "target selection" mode
				this.popupReply(`|wide||html|${generateBattleHTML(battle, [shouldTerastallize ? `Select a target for ${getMove(moveId).name} (with Terastallization).` : `Select a target for ${getMove(moveId).name}.`], { attackerSlotIndex, moveId, shouldTerastallize })}`);
			},
			// --- END NEW FUNCTION ---

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
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["The battle continues..."])}`);
				}

				const player = getPlayerData(battle.playerId);

				// Find the Pokemon in the party
				const partyIndex = player.party.findIndex(p => p.id === pokemonId && p.hp > 0);
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
				const nextPokemon = player.party[partyIndex];
				const newSlot = createActivePokemonSlot(nextPokemon);

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const messageLog = [`<span style="color: ${playerColor};">Go, ${nextPokemon.species}!</span>`];

				// **NEW:** Check if this is a pivot switch
				if (battle.pendingPivot?.slotIndex === slotToFill) {
					const pivotingPokemon = battle.pendingPivot.slot.pokemon;

					// Check if the pivoting Pokemon is already in the party to avoid duplicates
					const pivotIndex = player.party.findIndex(p => p.id === pivotingPokemon.id);
					if (pivotIndex === -1) {
						// Only push if not already in party (shouldn't normally happen)
						player.party.push(pivotingPokemon);
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
				// (If not a pivot, it was a faint switch. The fainted mon is already in the party at 0 HP)

				battle.playerSlots[slotToFill as 0 | 1] = newSlot;

				// --- Apply Hazards ---
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`<span style="color: ${infoColor};"><strong>${newSlot.pokemon.species} fainted upon entry!</strong></span>`);
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}

				// --- Check if more switches are needed ---
				// In single battles, only check slot 0. In double battles, check both slots 0 and 1.
				const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';
				const slotsToCheck = isDoubleBattle ? [0, 1] : [0];
				const needsAnotherSwitch = slotsToCheck.some(i => battle.playerSlots[i] === null) &&
					player.party.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));

				if (needsAnotherSwitch) {
					// Another slot is empty, show the switch screen again
					this.popupReply(`|wide||html|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
				} else {
					// All slots are filled, the forced switch is complete
					// A forced switch (due to fainting) ends the turn
					// Clear any pending actions since the turn is over
					battle.pendingActions = {};
					// Show the battle screen for the next turn
					this.popupReply(`|wide||html|${generateBattleHTML(battle, messageLog)}`);
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
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, [trapMessage])}`);
				}
				// --- END TRAP CHECK ---

				if (outgoingSlot.isTrapped) {
					this.errorReply(`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`);
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`])}`);
				}

				if (outgoingSlot.partiallyTrapped) {
					this.errorReply(`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`);
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`])}`);
				}

				if (outgoingSlot.isIngrained) {
					this.errorReply(`${outgoingSlot.pokemon.species} is rooted in place by Ingrain and cannot switch out!`);
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is rooted in place and cannot switch out!`])}`);
				}

				const player = getPlayerData(battle.playerId);

				// Check if incoming Pokemon is valid
				const incomingPokemon = player.party.find(p => p.id === pokemonIdIn && p.hp > 0);
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
					this.popupReply(`|wide||html|${generateBattleHTML(battle, messageLog)}`);
				}
			},

			switchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				this.popupReply(`|wide||html|${generateSwitchMenuHTML(battle, target)}`);
			},
			catchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				// In double battles, can only catch when one opponent remains
				if (battle.battleType === 'wild_double') {
					const activeOpponents = getActiveSlots(battle.opponentSlots);
					if (activeOpponents.length > 1) {
						return this.popupReply(`|wide||html|${generateCatchErrorHTML()}`);
					}
				}

				const player = getPlayerData(battle.playerId);
				this.popupReply(`|wide||html|${generateCatchMenuHTML(player, battle)}`);
			},

			// --- NEW ---
			selectcatchtarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
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
				this.popupReply(`|wide||html|${generateCatchTargetHTML(battle, ballId)}`);
			},

			catch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				// --- NEW: Read target ---
				const [ballId, slotIndexStr] = target.split(' ');
				const targetSlotIndex = parseInt(slotIndexStr);

				if (!ballId || isNaN(targetSlotIndex)) {
					return this.errorReply("Invalid catch command. Usage: /rpg battleaction catch [ballId] [slotIndex]");
				}

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't catch a Trainer's Pokémon!");
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}

				// In double battles, can only catch when one opponent remains (matches Pokemon games Gen 8+)
				if (battle.battleType === 'wild_double') {
					const activeOpponents = getActiveSlots(battle.opponentSlots);
					if (activeOpponents.length > 1) {
						this.errorReply("You can't throw a Poké Ball when there are multiple opponents!");
						return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["You can't throw a Poké Ball when there are multiple wild Pokémon! Defeat one first."])}`);
					}
				}

				// --- NEW: Get target slot ---
				const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
				if (!targetSlot || (targetSlotIndex !== 2 && targetSlotIndex !== 3)) {
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["That is not a valid target!"])}`);
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

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const neutralColor = '#6c757d';

				const messageLog: string[] = [];
				messageLog.push(`<span style="color: ${playerColor};">${player.name} used a ${ballItem.name}!</span>`);

				// --- NEW: Pass the target slot to performCatchAttempt ---
				const catchResult = performCatchAttempt(battle, ballId, targetSlot);
				const shakeMessages = [
					"Oh no! The Pokemon broke free!", "Aww! It appeared to be caught!",
					"Aargh! Almost had it!", "Gah! It was so close, too!",
				];

				for (let i = 1; i <= catchResult.shakes; i++) {
					if (i < 4) {
						messageLog.push(`<i style="color: ${neutralColor};">...The ball shook...</i>`);
					}
				}

				if (catchResult.success) {
					const zoneId = battle.zoneId;
					saveBattleStatus(battle);
					activeBattles.delete(user.id);

					const caughtPokemon = targetSlot.pokemon;
					caughtPokemon.caughtIn = ballId; // Set the ball it was caught in!

					if (ballId === 'healball') {
						caughtPokemon.hp = caughtPokemon.maxHp;
						caughtPokemon.status = null;
					}

					const location = player.party.length < 6 ? "your party" : "PC";
					if (player.party.length < 6) { player.party.push(caughtPokemon); } else { storePokemonInPC(player, caughtPokemon); }

					const tempSlot = createActivePokemonSlot(caughtPokemon);
					this.popupReply(
						`|wide||html|${generateCatchSuccessHTML(caughtPokemon, ballId, location, zoneId, tempSlot)}`
					);
				} else {
					// --- FAILED CATCH PATH (FIXED) ---
					messageLog.push(`<span style="color: ${infoColor};"><strong>${shakeMessages[catchResult.shakes]}</strong></span>`);

					// The catch attempt failed. In Pokémon games, using an item (including Pokéballs) consumes your turn.
					// The opponent gets to attack, so we need to process the turn.
					processTurn(this, battle, room, user, messageLog);
				}
			},

			run(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't run from a Trainer battle!");
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, ["You can't run from a Trainer battle!"])}`);
				}

				// --- ARENA TRAP / SHADOW TAG CHECK ---
				const playerSlots = getActiveSlots(battle.playerSlots);
				for (const slot of playerSlots) {
					const trappingPokemon = checkTrappingAbility(slot, battle);
					if (trappingPokemon) {
						const trapMessage = `${slot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`;
						this.errorReply(trapMessage);
						return this.popupReply(`|wide||html|${generateBattleHTML(battle, [trapMessage])}`);
					}
				}
				// --- END TRAP CHECK ---

				const trappedPokemon = playerSlots.find(slot => slot.isTrapped || slot.partiallyTrapped);

				if (trappedPokemon) {
					this.errorReply(`${trappedPokemon.pokemon.species} is trapped and cannot escape!`);
					return this.popupReply(`|wide||html|${generateBattleHTML(battle, [`You can't escape!`])}`);
				}
				// END: Trapping check

				const zoneId = battle.zoneId;
				saveBattleStatus(battle);
				activeBattles.delete(user.id);

				this.popupReply(`|wide||html|${generateRunHTML(zoneId)}`);
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
					this.popupReply(`|wide||html|${generateBattleHTML(battle, ["You returned to the battle."])}`);
				}
			},

			help() {
				this.popupReply("|wide||html|<div class=\"infobox\"><strong>Battle Commands</strong><hr><p>/rpg battleaction [move|switch|catchmenu|run]</p></div>");
			},
		},
	},
};
