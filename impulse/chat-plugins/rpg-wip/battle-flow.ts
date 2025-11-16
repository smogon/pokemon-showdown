/*
* Pokemon Showdown
* RPG Battle Flow
*
* This file contains all battle flow control, turn processing,
* action execution, and state change (faint, switch) logic.
*
* Renamed from battle-effects.ts after EOT logic was split.
*/

import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { generateRandomTeam, getActiveSlots, getActiveParty, getMove, type CheckEvolutionContext } from './utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, Move } from './interface';
import { ITEMS_DATABASE } from './items';
import { LOCATIONS } from './locations';
import { BATTLE_TOWER_FORMATS, generateRandomTeamFromBSS, generateRandomTeamFromBaby } from './battle-tower';
import { getPlayerData, activeBattles } from './core';
import {
	generateBattleHTML,
	generateMoveLearnHTML,
	generatePivotSwitchHTML,
	generateFaintSwitchHTML,
	generateBattleTowerFloorCompleteHTML,
	generateBattleTowerLossHTML,
} from './html';
import { RPGMoves } from './battle-moves';

// Import shared helpers
import {
	activateUnburden,
	applyStatChange,
	handleHPDropEffects,
	createActivePokemonSlot,
	checkTrappingAbility,
	getSlotFromIndex,
	getMoveTargets,
	getAccuracyEvasionMultiplier,
	handleMirrorHerb,
} from './battle-shared';

// Import core functions
import {
	gainExperience,
	getCustomEffectiveness,
	getStatMultiplier,
	handleDamagingMove,
	handleStatusMove,
	saveBattleStatus,
	getPokemonTypes,
	getMoveType,
} from './battle-core';

// Import EOT functions
import {
	processEndOfTurn,
	applyEOTStatusDamage,
	applyEOTItemEffects,
	applyEOTVolatileStatusDamage,
	applyEOTHealingEffects,
	applyEOTLeechSeedDamage,
	decrementEOTVolatileCounters,
	handleEndOfTurnEffects,
	handleEndOfTurnWeather,
	handleEndOfTurnFieldEffects,
} from './battle-eot';

/**
 * Get the initial weather for a battle based on the player's location
 * Converts location weather format to battle weather format
 * Returns both the active weather and the location weather type for restoration
 */
export function getLocationWeatherData(player: PlayerData): {
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
export function getWeatherStartMessage(weatherType: 'sun' | 'rain' | 'sand' | 'hail'): string {
	const weatherStartMessages: Record<string, string> = {
		'sun': 'The sunlight is strong.',
		'rain': 'It started to rain!',
		'sand': 'A sandstorm is raging!',
		'hail': 'It started to hail!',
	};
	return weatherStartMessages[weatherType];
}

/**
 * Creates a new Battle Tower battle state.
 * Generates random teams for both player and AI for the specified floor.
 */
export function startBattleTowerFloor(
	player: PlayerData,
	floor: number,
	context: CommandContext,
	room: ChatRoom,
	user: User,
	format = 'battlefactory'
) {
	// Get format configuration
	const formatConfig = BATTLE_TOWER_FORMATS[format] || BATTLE_TOWER_FORMATS['battlefactory'];
	const level = formatConfig.level;
	const teamSize = formatConfig.teamSize;

	const battleMessages: string[] = [];
	const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
	const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];

	try {
		// --- Generate Teams ---
		// Use format-specific team generation
		let playerTeam: RPGPokemon[];
		let aiTeam: RPGPokemon[];

		if (formatConfig.teamGeneration === 'bss') {
			// Use BSS Factory Sets for competitive, battle-tested teams
			playerTeam = generateRandomTeamFromBSS(teamSize, level);
			aiTeam = generateRandomTeamFromBSS(teamSize, level);
		} else if (formatConfig.teamGeneration === 'baby') {
			// Use Gen9 Baby Sets for Little Cup format (uses levels from sets.json)
			playerTeam = generateRandomTeamFromBaby(teamSize);
			aiTeam = generateRandomTeamFromBaby(teamSize);
		} else {
			// Use random team generation
			playerTeam = generateRandomTeam(teamSize, level);
			aiTeam = generateRandomTeam(teamSize, level);
		}

		// --- Player Pokemon ---
		playerSlots[0] = createActivePokemonSlot(playerTeam[0]);

		// --- Opponent Pokemon ---
		opponentSlots[0] = createActivePokemonSlot(aiTeam[0]);

		battleMessages.push(`<b>Battle Tower - Floor ${floor}</b>`);
		battleMessages.push(`Your random team for this floor is: ${playerTeam.map(p => p.species).join(', ')}.`);

		const locationWeatherData = getLocationWeatherData(player);
		if (locationWeatherData.weather) {
			battleMessages.push(getWeatherStartMessage(locationWeatherData.weather.type));
		}

		// Create the battle state object
		const battle: BattleState = {
			battleType: 'battletower',
			floor,
			overridePlayerParty: playerTeam, // Set the temporary party
			battleTowerFormat: format, // Store the selected format
			opponentName: `Battle Tower Trainer`,
			opponentParty: aiTeam,
			opponentMoney: 500 * floor, // Scale reward
			playerSlots,
			opponentSlots,
			pendingActions: {},
			playerId: user.id,
			turn: 0,
			zoneId: 'battletower',
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
		};

		// Apply switch-in abilities
		if (playerSlots[0]) {
			applyHazardEffectsOnSwitchIn(playerSlots[0], battle, true, battleMessages);
		}
		if (opponentSlots[0]) {
			applyHazardEffectsOnSwitchIn(opponentSlots[0], battle, false, battleMessages);
		}

		// Set the active battle
		activeBattles.set(user.id, battle);
		battle.battleLog.push(...battleMessages);

		// Generate HTML
		context.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(battle)}`);
	} catch (error) {
		console.error(error);
		context.errorReply(`Error starting Battle Tower floor: ${error}`);
	}
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
		// Handle both fainted Pokemon AND forced switches (null slots from Dragon Tail/Circle Throw)
		if (slot === null || slot.pokemon.hp <= 0) {
			// Only process faint effects if the Pokemon actually fainted (not a forced switch)
			if (slot && slot.pokemon.hp <= 0) {
				faintedThisCheck = true;
				messageLog.push(`<b>The opposing ${slot.pokemon.species} fainted!</b>`);

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

				const allActiveSlots = [...getActiveSlots(battle.playerSlots), ...getActiveSlots(battle.opponentSlots)];
				for (const activeSlot of allActiveSlots) {
					if (activeSlot.pokemon.hp > 0) {
						const ability = toID(activeSlot.pokemon.ability || '');
						if (ability === 'soulheart' && activeSlot.statStages.spa < 6) {
							activeSlot.statStages.spa++;
							messageLog.push(`${activeSlot.pokemon.species}'s Soul-Heart raised its Sp. Atk!`);
						}
					}
				}

				// [MODIFIED] Skip EXP/EVs in Battle Tower
				if (battle.battleType !== 'battletower' && playerParticipants.length > 0) {
					const expResult = gainExperience(player, playerParticipants, slot.pokemon, room, user);
					messageLog.push(...expResult.messages);
				}
			}

			// Keep trying to find a replacement until one survives entry or we run out
			let foundReplacement = false;
			while (!foundReplacement) {
				const nextOpponent = battle.opponentParty.find(p =>
					p.hp > 0 &&
					!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
				);

				if (nextOpponent) {
					messageLog.push(`<b>${battle.opponentName} is about to send in ${nextOpponent.species}!</b>`);
					const newSlot = createActivePokemonSlot(nextOpponent);
					battle.opponentSlots[i as 0 | 1] = newSlot;

					const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
					if (faintedOnEntry) {
						messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
						// Continue loop to try next Pokemon
					} else {
						handleMirrorHerb(newSlot, battle, messageLog);
						foundReplacement = true; // Successfully placed a Pokemon
					}
				} else {
					// No more Pokemon available
					battle.opponentSlots[i as 0 | 1] = null;
					foundReplacement = true; // Exit loop (no more to try)
				}
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
				messageLog.push(`<b>Your ${slot.pokemon.species} fainted!</b>`);

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

				const allActiveSlots = [...getActiveSlots(battle.playerSlots), ...getActiveSlots(battle.opponentSlots)];
				for (const activeSlot of allActiveSlots) {
					if (activeSlot.pokemon.hp > 0) {
						const ability = toID(activeSlot.pokemon.ability || '');
						if (ability === 'soulheart' && activeSlot.statStages.spa < 6) {
							activeSlot.statStages.spa++;
							messageLog.push(`${activeSlot.pokemon.species}'s Soul-Heart raised its Sp. Atk!`);
						}
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

	const slotIndex = battle.aiPendingPivot.slotIndex;
	const pivotSlot = battle.aiPendingPivot.slot;
	const isBatonPass = battle.aiPendingPivot.isBatonPass;

	messageLog.push(`<b>${battle.opponentName} withdrew ${pivotSlot.pokemon.species}!</b>`);

	// Keep trying to find a replacement until one survives entry or we run out
	let foundReplacement = false;
	while (!foundReplacement) {
		const nextOpponent = battle.opponentParty.find(p =>
			p.hp > 0 &&
			p.id !== pivotSlot.pokemon.id && // Exclude the pivoting Pokemon
			!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
		);

		if (nextOpponent) {
			messageLog.push(`<b>${battle.opponentName} sent out ${nextOpponent.species}!</b>`);

			const newSlot = createActivePokemonSlot(nextOpponent);

			if (isBatonPass) {
				newSlot.statStages = { ...pivotSlot.statStages };
				newSlot.isConfused = pivotSlot.isConfused;
				newSlot.confusionCounter = pivotSlot.confusionCounter;
				newSlot.isSeeded = pivotSlot.isSeeded;
				messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
			}

			battle.opponentSlots[slotIndex as 0 | 1] = newSlot;

			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
			if (faintedOnEntry) {
				messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
				// Continue loop to try next Pokemon
			} else {
				handleMirrorHerb(newSlot, battle, messageLog);
				foundReplacement = true; // Successfully placed a Pokemon
			}
		} else {
			// No more Pokemon available, put the original back
			battle.opponentSlots[slotIndex as 0 | 1] = pivotSlot;
			messageLog.push(`${pivotSlot.pokemon.species} had no one to switch to!`);
			foundReplacement = true; // Exit loop
		}
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
	const playerHasLivingPokemon = getActiveParty(battle, player).some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);
	const playerHasActivePokemon = getActiveSlots(battle.playerSlots).length > 0;

	// [MODIFIED] Check for Defeat
	if (!playerHasActivePokemon && !playerHasLivingPokemon) {
		// [NEW] Handle Battle Tower Loss
		if (battle.battleType === 'battletower') {
			saveBattleStatus(battle);
			battle.battleEnded = true;
			battle.battleResult = 'defeat';
			const currentFloor = battle.floor || 1;

			// Generate loss HTML
			const lossHTML = generateBattleTowerLossHTML(currentFloor);
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${lossHTML}`);

			// Reset progress
			player.battleTowerFloor = 1;
			activeBattles.delete(user.id);
			return true;
		}
		// [END NEW]

		// Original Story Mode Defeat Logic
		saveBattleStatus(battle);
		battle.battleEnded = true;
		battle.battleResult = 'defeat';

		let moneyLost = 100;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyLost = Math.floor(battle.opponentMoney / 10) || 200;
		}
		moneyLost = Math.min(player.money, moneyLost);
		player.money -= moneyLost;

		// Heal all Pokemon (like in Pokemon games)
		for (const pokemon of player.party) {
			pokemon.hp = pokemon.maxHp;
			pokemon.status = null;
			for (const move of pokemon.moves) {
				const moveData = getMove(move.id);
				move.pp = moveData.pp || 5;
			}
		}

		// Transport player to last Pokemon Center visited
		const respawnLocation = player.lastPokemonCenter || 'startertown';
		const respawnLocationData = LOCATIONS[respawnLocation] || LOCATIONS['startertown'];
		player.location = respawnLocationData.name;

		// Add defeat messages to battle log
		messageLog.push(`<hr><center><b>Defeat!</b></center>`);
		const opponentMessage = battle.opponentName ? `You lost to ${battle.opponentName}!` : "You have no more Pokemon that can fight!";
		messageLog.push(`<center><b>${opponentMessage}</b></center>`);
		messageLog.push(`<center><b>You lost ₽${moneyLost}!</b></center>`);

		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
		activeBattles.delete(user.id);
		return true;
	}

	const opponentHasLivingPokemon = battle.opponentParty.some(p =>
		p.hp > 0 &&
		!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
	);
	const opponentHasActivePokemon = getActiveSlots(battle.opponentSlots).length > 0;

	// [MODIFIED] Check for Victory
	if (!opponentHasActivePokemon && !opponentHasLivingPokemon) {
		// [NEW] Handle Battle Tower Victory
		if (battle.battleType === 'battletower') {
			battle.battleEnded = true;
			battle.battleResult = 'victory';
			const currentFloor = battle.floor || 1;
			player.battleTowerFloor = currentFloor + 1; // Increment floor for next battle

			// Generate floor clear HTML
			const floorClearHTML = generateBattleTowerFloorCompleteHTML(currentFloor);
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${floorClearHTML}`);

			// Don't delete the battle here - keep it so the format can be retrieved
			// when the player continues to the next floor via the nextfloor command
			return true;
		}
		// [END NEW]

		// Original Story Mode Victory Logic
		saveBattleStatus(battle);
		battle.battleEnded = true;
		battle.battleResult = 'victory';

		let moneyGained = 0;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyGained = battle.opponentMoney;
			player.money += moneyGained;

			// Track defeated trainer
			if (battle.trainerId) {
				player.defeatedTrainers.add(battle.trainerId);

				// Award badge if it's a gym leader
				if (battle.trainerId.startsWith('gym')) {
					const gymName = battle.trainerId.replace('gym', '');
					const badgeNames: Record<string, string> = {
						'brock': 'Boulder Badge',
						'misty': 'Cascade Badge',
						'ltsurge': 'Thunder Badge',
						'erika': 'Rainbow Badge',
						'koga': 'Soul Badge',
						'sabrina': 'Marsh Badge',
						'blaine': 'Volcano Badge',
						'giovanni': 'Earth Badge',
					};
					const badgeName = badgeNames[gymName];
					if (badgeName && !player.obtainedBadges.includes(badgeName)) {
						player.obtainedBadges.push(badgeName);
						player.badges = player.obtainedBadges.length;
						messageLog.push(`<hr><center><strong>You obtained the ${badgeName}!</strong></center>`);

						// Check if player has all 8 badges
						if (player.obtainedBadges.length === 8) {
							player.storyFlags.add('all_badges');
							messageLog.push(`<hr><center><strong>You now have all 8 gym badges! Victory Road is now accessible!</strong></center>`);
						}
					}
				}

				// Check if Champion was defeated
				if (battle.trainerId === 'champion_blue') {
					player.storyFlags.add('champion');
					player.storyFlags.add('game_complete');
					messageLog.push(`<hr><center><strong>🏆 Congratulations! You are the new Pokémon League Champion! 🏆</strong></center>`);
				}
			}

			// Add victory messages to battle log
			messageLog.push(`<hr><center><b>Victory!</b></center>`);
			messageLog.push(`<center><strong>You defeated ${battle.opponentName}!</strong></center>`);
			messageLog.push(`<center><b>You received ₽${moneyGained} for winning!</b></center>`);

			if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player, messageLog)}`);
			} else {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
			}
		} else {
			moneyGained = Math.floor(battle.opponentParty.reduce((sum, p) => sum + p.level, 0) * 5);
			player.money += moneyGained;

			// Add victory messages to battle log
			messageLog.push(`<hr><center><b>Victory!</b></center>`);
			const defeatedNames = battle.opponentParty.map(p => p.species).join(' and ');
			messageLog.push(`<center><strong>You defeated the wild ${defeatedNames}!</strong></center>`);
			messageLog.push(`<center><b>You gained ₽${moneyGained}!</b></center>`);

			if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player, messageLog)}`);
			} else {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
			}
		}
		activeBattles.delete(user.id);
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

	// Handle AI pivots FIRST, before checking for faints
	// This ensures that if an AI Pokemon used a pivot move, it's replaced
	// before any subsequent logic runs
	handleAiPivot(battle, messageLog);

	const playerParticipants = getActiveSlots(battle.playerSlots);
	handleOpponentFaint(battle, player, playerParticipants, room, user, messageLog);
	const playerSwitchNeeded = handlePlayerFaint(battle, messageLog);

	const battleEnded = checkForWinLoss(context, battle, player, user, messageLog);
	if (battleEnded) return true;

	if (battle.pendingPivot) {
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePivotSwitchHTML(battle, messageLog.join('<br>'), battle.pendingPivot.slotIndex)}`);
		return true;
	}

	const playerHasLivingPokemon = getActiveParty(battle, player).some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	if (playerSwitchNeeded && playerHasLivingPokemon) {
		// Clear pending actions for fainted Pokemon slots to prevent "already waiting to move" error
		for (let i = 0; i < battle.playerSlots.length; i++) {
			if (battle.playerSlots[i] === null || battle.playerSlots[i]?.pokemon.hp === 0) {
				delete battle.pendingActions[i];
			}
		}
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
		return true;
	}

	return false;
}

export function handlePreTurnChecks(attackerSlot: ActivePokemonSlot, battle: BattleState, messageLog: string[], move?: Move): boolean {
	const attacker = attackerSlot.pokemon;

	if (toID(attacker.ability || '') === 'truant') {
		if (attackerSlot.isLoafing) {
			messageLog.push(`${attacker.species} is loafing around!`);
			attackerSlot.isLoafing = false; // Will move next turn
			return false;
		}
		// This flag will be set to true in executeMove after a successful move
	}

	if (attackerSlot.mustRecharge) {
		messageLog.push(`${attacker.species} must recharge!`);
		attackerSlot.mustRecharge = false;
		return false;
	}

	if (attackerSlot.willFlinch) {
		messageLog.push(`${attacker.species} flinched and couldn't move!`);
		attackerSlot.willFlinch = false;

		const ability = toID(attacker.ability || '');
		if (ability === 'steadfast' && attackerSlot.statStages.spe < 6) {
			attackerSlot.statStages.spe++;
			messageLog.push(`${attacker.species}'s Steadfast raised its Speed!`);
		}

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
		// Check if move is sleep-usable (Sleep Talk, Snore)
		if (move?.sleepUsable) {
			// Move can be used while asleep
			return true;
		}

		const ability = toID(attacker.ability || '');
		const decrementAmount = ability === 'earlybird' ? 2 : 1;
		attackerSlot.sleepCounter -= decrementAmount;

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

	if (move && attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === move.id) {
		messageLog.push(`${attacker.species}'s ${move.name} is disabled!`);
		return false;
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
			const untraceableAbilities = ['trace', 'stancechange', 'schooling', 'disguise', 'neutralizinggas', 'download', 'forecast', 'flowergift', 'imposter', 'multitype', 'persistent'];
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
					// 1 layer = regular poison, 2+ layers = badly poisoned
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
		// Check for Magic Guard before applying hazard damage
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			if (hazards.includes('stealthrock')) {
				messageLog.push(`Pointed stones dug into ${pokemon.species}!`);
			} else if (hazards.includes('spikes')) {
				messageLog.push(`${pokemon.species} was hurt by the spikes!`);
			}
			pokemon.hp = Math.max(0, pokemon.hp - totalDamage);
			if (pokemon.hp <= 0) {
				return true;
			}
		} else {
			messageLog.push(`${pokemon.species}'s Magic Guard prevents hazard damage!`);
		}
	}

	runSwitchInAbilities();

	return false;
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

	// Handle field effect moves (weather, terrain, rooms, global effects) only once before the target loop
	// These moves affect the entire field or all Pokemon globally, not individual targets
	const isFieldEffectMove = move.category === 'Status' && (
		move.weather ||
		move.terrain ||
		move.pseudoWeather ||
		['trickroom', 'magicroom', 'wonderroom', 'gravity', 'mudsport', 'watersport',
			'haze', 'perishsong', 'courtchange'].includes(move.id)
	);

	if (isFieldEffectMove) {
		// Field effect moves should execute once, not per target
		handleStatusMove(attackerSlot, null, move, battle, messageLog);
		return;
	}

	for (const defenderSlot of targetSlots) {
		if (attackerSlot.pokemon.hp <= 0) break;
		if (defenderSlot.pokemon.hp <= 0) continue;

		// Calculate the move's true priority, including ability modifiers
		let truePriority = move.priority;
		truePriority += RPGAbilities.applyPriorityModifier(move, attackerSlot.pokemon);

		if (battle.terrain?.type === 'psychic' && truePriority > 0) {
			const isDefenderGrounded = RPGAbilities.isGrounded(defenderSlot.pokemon, battle);

			// Check if attacker and defender are on different teams
			const isAttackerPlayer = battle.playerSlots.includes(attackerSlot);
			const isDefenderPlayerCheck = battle.playerSlots.includes(defenderSlot);

			if (isDefenderGrounded && isAttackerPlayer !== isDefenderPlayerCheck) {
				messageLog.push(`${defenderSlot.pokemon.species} is protected by the Psychic Terrain!`);
				continue; // Skip this target
			}
		}

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
			const attackerAbility = toID(attackerSlot.pokemon.ability || '');
			const bypassesProtect = attackerAbility === 'unseenfist' && move.flags.contact;

			if (defenderSlot.isProtected && move.flags.protect && !move.breaksProtect && !bypassesProtect) {
				messageLog.push(`<span style="color: #6c757d;">${defenderSlot.pokemon.species} protected itself!</span>`);
				continue;
			}
		}

		let moveHit = true;
		const attackerAbility = toID(attackerSlot.pokemon.ability || '');
		const defenderAbility = toID(defenderSlot.pokemon.ability || '');
		const hasNoGuard = attackerAbility === 'noguard' || defenderAbility === 'noguard';

		if (['aerialace', 'struggle'].includes(move.id) || hasNoGuard) {
			// Moves like Aerial Ace always hit, or No Guard is active
		} else if (move.accuracy !== true) {
			const accuracyMultiplier = getAccuracyEvasionMultiplier(attackerSlot.statStages.accuracy);
			const ignoresEvasion = attackerAbility === 'mindseye';
			const evasionMultiplier = ignoresEvasion ? 1 : getAccuracyEvasionMultiplier(defenderSlot.statStages.evasion);
			let moveAccuracy = move.accuracy;

			moveAccuracy = RPGAbilities.applyAccuracyModifier(moveAccuracy, attackerSlot.pokemon, move);

			const abilityEvasionMultiplier = RPGAbilities.getEvasionMultiplier(defenderSlot, battle);
			const finalEvasionMultiplier = evasionMultiplier * abilityEvasionMultiplier;

			if (RPGAbilities.isWeatherActive(battle)) {
				if (battle.weather!.type === 'rain' || battle.weather!.type === 'heavy-rain') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 100;
				} else if (battle.weather!.type === 'sun' || battle.weather!.type === 'harsh-sun') {
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

		const attackerAbility = toID(attackerSlot.pokemon.ability || '');
		if (attackerAbility === 'gulpmissile' && (move.id === 'surf' || move.id === 'dive') && moveHitAnyTarget) {
			const attacker = attackerSlot.pokemon;
			const hpPercent = attacker.hp / attacker.maxHp;

			// Gulping Form (Arrokuda) if HP > 50%, Gorging Form (Pikachu) if HP <= 50%
			if (hpPercent > 0.5) {
				if (!attacker.species.includes('Gulping')) {
					attacker.species = 'Cramorant-Gulping';
					(attackerSlot as any).gulpMissileForm = 'gulping';
					messageLog.push(`${attacker.nickname || 'Cramorant'} caught an Arrokuda!`);
				}
			} else {
				if (!attacker.species.includes('Gorging')) {
					attacker.species = 'Cramorant-Gorging';
					(attackerSlot as any).gulpMissileForm = 'gorging';
					messageLog.push(`${attacker.nickname || 'Cramorant'} caught a Pikachu!`);
				}
			}
		}
	}
	for (const defenderSlot of targetSlots) {
		if (defenderSlot && defenderSlot.pokemon.hp > 0) {
			RPGAbilities.checkFormChangeAbilities(defenderSlot, battle, messageLog);
		}
	}

	if (attackerSlot && attackerSlot.pokemon.hp > 0 && toID(attackerSlot.pokemon.ability || '') === 'truant') {
		attackerSlot.isLoafing = true; // Will loaf next turn
	}
}

export function buildActionQueue(battle: BattleState, messageLog: string[]): NonNullable<BattleState['pendingActions'][number]>[] {
	const actionQueue: NonNullable<BattleState['pendingActions'][number]>[] = [];
	const allActiveSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	// Reset analyticBoost for all Pokemon at the start of the turn
	allActiveSlots.forEach(s => { s.analyticBoost = false; });

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

	allActiveSlots.forEach(s => { s.analyticBoost = false; });
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
			// Add turn header at end so it appears before actions when reversed
			messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${battle.turn}</strong></div><hr>`);
			// Append current turn logs to battle log
			battle.battleLog.push(...messageLog);
			return;
		}
	}

	if (battle.forceEnd) {
		// Add turn header at end so it appears before actions when reversed
		messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${battle.turn}</strong></div><hr>`);
		// Append current turn logs to battle log
		battle.battleLog.push(...messageLog);
		return;
	}

	messageLog.push("--- End of Turn ---");
	processEndOfTurn(battle, messageLog);

	const battleEnded = checkBattleEndCondition(context, battle, room, user, messageLog);

	// Add turn header at end so it appears before actions when reversed
	messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${battle.turn}</strong></div><hr>`);

	// Append current turn logs to cumulative battle log
	battle.battleLog.push(...messageLog);

	battle.pendingActions = {};

	if (!battleEnded) {
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			if (slot.pokemon.hp > 0) {
				slot.activeTurns++;
			}
		});

		// Only generate battle HTML if we have active Pokemon on both sides
		// For single battles (wild, trainer, battletower), check slot[0] specifically
		// For double battles, check if any slot has an active Pokemon
		let hasActivePlayerSlot: boolean;
		let hasActiveOpponentSlot: boolean;

		if (battle.battleType === 'wild_double' || battle.battleType === 'trainer_double') {
			// Double battle: check if any slot has an active Pokemon
			hasActivePlayerSlot = battle.playerSlots.some(s => s !== null && s.pokemon.hp > 0);
			hasActiveOpponentSlot = battle.opponentSlots.some(s => s !== null && s.pokemon.hp > 0);
		} else {
			// Single battle (including Battle Tower): only check slot[0]
			hasActivePlayerSlot = battle.playerSlots[0] !== null && battle.playerSlots[0]?.pokemon.hp > 0;
			hasActiveOpponentSlot = battle.opponentSlots[0] !== null && battle.opponentSlots[0]?.pokemon.hp > 0;
		}

		if (hasActivePlayerSlot && hasActiveOpponentSlot) {
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle)}`);
		} else {
			// If slots are missing, the battle should have ended or a switch should be pending
			// If neither happened, this is an edge case that should be logged for debugging
			console.warn(`[RPG Battle Warning] Battle ${user.id}: Attempted to generate HTML with null slots. Player: ${hasActivePlayerSlot}, Opponent: ${hasActiveOpponentSlot}`);
		}
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

	// Check for Shed Shell first
	if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'shedshell') {
		// Shed Shell bypasses all trapping except Ingrain
		if (attackerSlot.isIngrained) {
			messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
			return;
		}
		// Continue with the switch, skipping other trap checks
	} else {
		// No Shed Shell, perform normal trap checks
		const trappingPokemon = checkTrappingAbility(attackerSlot, battle);
		if (trappingPokemon) {
			messageLog.push(`${attackerSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`);
			return;
		}

		if (attackerSlot.isIngrained) {
			messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
			return;
		}
		if (attackerSlot.isTrapped || attackerSlot.partiallyTrapped) {
			messageLog.push(`${attackerSlot.pokemon.species} is trapped and can't switch out!`);
			return;
		}
		if (battle.fairyLockTurns > 0) {
			messageLog.push(`${attackerSlot.pokemon.species} can't switch out due to Fairy Lock!`);
			return;
		}
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

	if (outgoingAbility === 'zerotohero' && outgoingPokemon.species.includes('Palafin')) {
		// Mark on the pokemon object so it persists when creating new slot
		(outgoingPokemon as any).hasSwitchedOut = true;
	}

	saveBattleStatus(battle);

	if (isPlayerSwitch) {
		const playerParty = getActiveParty(battle, player);
		const incomingPokemon = playerParty.find(p => p.id === pokemonToSwitchInId);
		if (!incomingPokemon) {
			messageLog.push(`${outgoingPokemon.species} tried to switch out, but there was no one to switch to!`);
			return;
		}

		const newSlot = createActivePokemonSlot(incomingPokemon);
		if ((incomingPokemon as any).hasSwitchedOut) {
			(newSlot as any).hasSwitchedOut = true;
		}
		battle.playerSlots[attackerSlotIndex as 0 | 1] = newSlot;
		messageLog.push(`<b>${player.name} withdrew ${outgoingPokemon.species} and sent out ${incomingPokemon.species}!</b>`);

		const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
		if (faintedOnEntry) {
			messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
		} else {
			handleMirrorHerb(newSlot, battle, messageLog);
			RPGAbilities.checkFormChangeAbilities(newSlot, battle, messageLog);
		}
	} else {
		const replacement = battle.opponentParty.find(p => p.id === pokemonToSwitchInId);

		if (replacement) {
			messageLog.push(`<b>${battle.opponentName} withdrew ${outgoingPokemon.species} and sent out ${replacement.species}!</b>`);

			const newSlot = createActivePokemonSlot(replacement);
			if ((replacement as any).hasSwitchedOut) {
				(newSlot as any).hasSwitchedOut = true;
			}
			battle.opponentSlots[attackerSlotIndex as 0 | 1] = newSlot;

			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
			if (faintedOnEntry) {
				messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
				// The fainted Pokemon is in the slot now - handleOpponentFaint will handle it in the next check
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

	// Propeller Tail and Stalwart prevent redirection
	const attackerSlot = attackerSlotIndex <= 1 ? battle.playerSlots[attackerSlotIndex] : battle.opponentSlots[attackerSlotIndex - 2];
	const attackerAbility = toID(attackerSlot?.pokemon.ability || '');
	const ignoresRedirection = attackerAbility === 'propellertail' || attackerAbility === 'stalwart';

	let abilityRedirector: ActivePokemonSlot | undefined = undefined;
	if (move.target === 'normal' && !ignoresRedirection) {
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

	if (!abilityRedirector && !ignoresRedirection) {
		const redirector = opponentSlots.find(s => s.isRedirecting);
		if (redirector && move.target === 'normal') {
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(redirector);
			finalTargetIndex = redirectorIndex;
			messageLog.push(`${redirector.pokemon.species} took the attack!`);
		}
	}

	return finalTargetIndex;
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

				// --- NEW: Add Slow Start check after Terastallization ---
				if (toID(attackerSlot.pokemon.ability || '') === 'slowstart' && attackerSlot.slowStartTurns && attackerSlot.slowStartTurns > 0) {
					attackerSlot.slowStartTurns = 0;
					messageLog.push(`${attackerSlot.pokemon.species} got its act together due to Terastallization!`);
				}
				// --- End of new check ---
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

		if (!handlePreTurnChecks(attackerSlot, battle, messageLog, move)) {
			return;
		}

		const finalTargetIndex = resolveMoveTarget(attackerSlotIndex, action.targetSlot, move, battle, messageLog);
		const resolvedTargets = getMoveTargets(attackerSlotIndex, finalTargetIndex, move, battle);

		let ppDeduction = 1;
		if (resolvedTargets.some(target => toID(target.pokemon.ability || '') === 'pressure')) {
			ppDeduction = 2;
		}

		if (RPGMoves.handleChargingMove(attackerSlot, move, moveObject, battle, messageLog, ppDeduction)) {
			return;
		}

		if (moveObject.id !== 'struggle' && moveObject.pp > 0 && !move.flags.charge) {
			moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
		}

		// Check if there are no valid targets
		// This can happen if the target switched out (pivot move) or was forced out
		if (resolvedTargets.length === 0) {
			// For moves that target opponents, silently skip if they switched out
			// For self-targeting moves, this is an error and should be logged
			const selfTargetingMove = move.target === 'self' ||
				move.target === 'allySide' || move.target === 'all';
			if (selfTargetingMove) {
				const usedMsg = `<span style="color: #555;"><strong>` +
					`${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`;
				messageLog.push(usedMsg);
				messageLog.push(`But there was no target!`);
			}
			// For opponent-targeting moves, skip silently (target switched out)
			return;
		}

		const usedMsg = `<span style="color: #555;"><strong>` +
			`${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`;
		messageLog.push(usedMsg);

		const remainingTargets: ActivePokemonSlot[] = [];
		for (const defenderSlot of resolvedTargets) {
			const abilityContext = {
				attacker: attackerSlot.pokemon,
				defender: defenderSlot.pokemon,
				attackerSlot,
				defenderSlot,
				move,
				battle,
				messageLog,
			};
			const preventionCheck = RPGAbilities.preventMove(abilityContext);
			if (preventionCheck?.prevented) {
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
			// Check for Shed Shell first
			if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'shedshell') {
				// Shed Shell bypasses all trapping except Ingrain
				if (attackerSlot.isIngrained) {
					messageLog.push(`${attackerSlot.pokemon.species} is rooted in place and can't switch out!`);
					return; // Stop the switch
				}
				// Continue to the pivot logic
			} else {
				// No Shed Shell, perform normal trap checks
				const trappingPokemon = checkTrappingAbility(attackerSlot, battle);
				if (trappingPokemon) {
					messageLog.push(`${attackerSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`);
					return; // Stop the switch
				}

				if (attackerSlot.isTrapped || attackerSlot.partiallyTrapped) {
					messageLog.push(`${attackerSlot.pokemon.species} is trapped and can't switch out!`);
					return; // Stop the switch
				}

				if (attackerSlot.isIngrained) {
					messageLog.push(`${attackerSlot.pokemon.species} is rooted in place and can't switch out!`);
					return; // Stop the switch
				}
			}

			// Check if the move is immune against the primary target
			const primaryTargetSlot = getSlotFromIndex(battle, action.targetSlot);
			if (primaryTargetSlot) {
				const defenderTypes = getPokemonTypes(primaryTargetSlot.pokemon, primaryTargetSlot);
				// We must get the move type *after* abilities like Pixilate
				const moveType = getMoveType(move, attackerSlot.pokemon, attackerSlot, battle, { attacker: attackerSlot.pokemon, defender: primaryTargetSlot.pokemon, attackerSlot, defenderSlot: primaryTargetSlot, move, battle, messageLog });
				const effectiveness = getCustomEffectiveness(moveType, defenderTypes, primaryTargetSlot.pokemon, battle, attackerSlot.pokemon);

				if (effectiveness === 0) {
					// The move failed due to immunity, so the pivot also fails.
					// The "But it failed!" message will be added by executeMove.
					// We just need to stop the pivot from happening.
					return;
				}
			}

			const isPlayer = attackerSlotIndex <= 1;
			if (isPlayer) {
				const playerParty = getActiveParty(battle, player);
				const hasReplacement = playerParty.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));
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
					// Convert allSlots index (2-3) to opponentSlots index (0-1)
					const opponentSlotIndex = attackerSlotIndex - 2;
					battle.aiPendingPivot = { slotIndex: opponentSlotIndex, slot: attackerSlot, isBatonPass: move.selfSwitch === 'copyvolatile' };
					battle.opponentSlots[opponentSlotIndex as 0 | 1] = null;
					messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			}
		}
	}
}

export function generateAiAction(aiSlot: ActivePokemonSlot, aiSlotIndex: number, battle: BattleState): BattleState['pendingActions'][number] {
	let chosenMoveId = 'struggle';

	// Check if currently charging a move (Solar Beam, Dig, Fly, etc.)
	if (aiSlot.chargingMove) {
		const chargingMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.chargingMove);
		if (chargingMoveObj && chargingMoveObj.pp > 0) {
			chosenMoveId = aiSlot.chargingMove;
		} else {
			// Charging move has no PP, use Struggle
			chosenMoveId = 'struggle';
		}
	} else if (aiSlot.lockedMoveCounter && aiSlot.lockedMoveCounter > 0 && aiSlot.lockedMove) {
		// Check if locked into a rampage move (Outrage, Thrash, Petal Dance, Raging Fury)
		const lockedMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.lockedMove);
		if (lockedMoveObj && lockedMoveObj.pp > 0) {
			chosenMoveId = aiSlot.lockedMove;
		} else {
			// Locked move has no PP, use Struggle
			chosenMoveId = 'struggle';
		}
	} else if (aiSlot.uproarTurns && aiSlot.uproarTurns > 0 && aiSlot.lockedMove) {
		// Check if locked into Uproar
		const lockedMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.lockedMove);
		if (lockedMoveObj && lockedMoveObj.pp > 0) {
			chosenMoveId = aiSlot.lockedMove;
		} else {
			// Uproar has no PP, use Struggle
			chosenMoveId = 'struggle';
		}
	} else if (aiSlot.encoreMove?.moveId) {
		// Check if Encored into a specific move
		const encoredMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.encoreMove!.moveId);
		if (encoredMoveObj && encoredMoveObj.pp > 0) {
			chosenMoveId = aiSlot.encoreMove.moveId;
		} else {
			// Encored move has no PP, use Struggle
			chosenMoveId = 'struggle';
		}
	} else if (aiSlot.lockedMove && battle.magicRoomTurns === 0) {
		// Check if locked by Choice item
		const choiceItems = ['choiceband', 'choicescarf', 'choicespecs'];
		if (choiceItems.includes(aiSlot.pokemon.item || '')) {
			const lockedMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.lockedMove);
			if (lockedMoveObj && lockedMoveObj.pp > 0) {
				chosenMoveId = aiSlot.lockedMove;
			} else {
				// Choice locked move has no PP, use Struggle
				chosenMoveId = 'struggle';
			}
		}
	}

	// Normal move selection if not locked
	if (chosenMoveId === 'struggle' && !aiSlot.chargingMove && !aiSlot.lockedMoveCounter && !aiSlot.uproarTurns && !aiSlot.encoreMove) {
		// First try to find damaging moves
		let usableMoves = aiSlot.pokemon.moves.filter(m => {
			const moveData = getMove(m.id);
			// Skip disabled moves
			if (aiSlot.disabledMove && aiSlot.disabledMove.moveId === m.id) return false;
			// Skip moves prevented by Torment
			if (aiSlot.tormentActive && aiSlot.lastMoveUsed === m.id) return false;
			// Skip status moves if Taunted
			if (aiSlot.tauntTurns > 0 && moveData.category === 'Status') return false;
			return m.pp > 0 && moveData.category !== 'Status';
		});

		// If no damaging moves available, use any move with PP
		if (usableMoves.length === 0) {
			usableMoves = aiSlot.pokemon.moves.filter(m => {
				// Skip disabled moves
				if (aiSlot.disabledMove && aiSlot.disabledMove.moveId === m.id) return false;
				// Skip moves prevented by Torment
				if (aiSlot.tormentActive && aiSlot.lastMoveUsed === m.id) return false;
				// Skip status moves if Taunted
				const moveData = getMove(m.id);
				if (aiSlot.tauntTurns > 0 && moveData.category === 'Status') return false;
				return m.pp > 0;
			});
		}

		if (usableMoves.length > 0) {
			chosenMoveId = usableMoves[Math.floor(Math.random() * usableMoves.length)].id;
		}
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

	// Allow Struggle in all cases
	if (moveId === 'struggle') {
		return null;
	}

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

	// Check if currently charging a move (Solar Beam, Dig, Fly, etc.)
	// This check must come before Encore, Torment, and other locks
	// because charging moves take priority over all other move restrictions
	if (attackerSlot.chargingMove) {
		if (attackerSlot.chargingMove !== moveData.id) {
			// Trying to use a different move while charging
			// Check if the charging move has PP left
			const chargingMoveObj = pokemon.moves.find(m => m.id === attackerSlot.chargingMove);
			if (chargingMoveObj && chargingMoveObj.pp > 0) {
				const chargingMoveName = getMove(attackerSlot.chargingMove).name;
				return `${pokemon.species} must continue using ${chargingMoveName}!`;
			}
			// If charging move has no PP, allow Struggle (but no other moves)
			return `${pokemon.species} has no PP left for its charging move!`;
		}
		// If we're using the charging move itself, check only Disable (not Encore/Torment)
		// because charging takes priority
		if (attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === moveData.id) {
			return `${moveData.name} is disabled!`;
		}
		// Allow the charging move to continue - skip other checks
		return null;
	}

	// Not charging, do normal validation
	if (attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === moveData.id) {
		return `${moveData.name} is disabled!`;
	}

	if (attackerSlot.encoreMove && attackerSlot.encoreMove.moveId !== moveData.id) {
		// Check if the encored move has PP left
		const encoredMoveObj = pokemon.moves.find(m => m.id === attackerSlot.encoreMove!.moveId);
		if (encoredMoveObj && encoredMoveObj.pp > 0) {
			return `${pokemon.species} must use ${attackerSlot.encoreMove.moveId}!`;
		}
		// If encored move has no PP, allow other moves (Struggle will be used)
	}

	if (attackerSlot.tormentActive && attackerSlot.lastMoveUsed === moveData.id) {
		return `${pokemon.species} can't use the same move twice due to Torment!`;
	}

	if (attackerSlot.lockedMoveCounter > 0) {
		if (attackerSlot.lockedMove !== moveData.id) {
			// Check if the locked rampage move has PP left
			const lockedMoveObj = pokemon.moves.find(m => m.id === attackerSlot.lockedMove);
			if (lockedMoveObj && lockedMoveObj.pp > 0) {
				const lockedMoveName = getMove(attackerSlot.lockedMove!).name;
				return `${pokemon.species} must continue using ${lockedMoveName}!`;
			}
			// If locked rampage move has no PP, allow Struggle (but no other moves)
			return `${pokemon.species} has no PP left for its rampage move!`;
		}
	}

	if (attackerSlot.uproarTurns > 0) {
		if (attackerSlot.lockedMove !== moveData.id) {
			// Check if Uproar has PP left
			const lockedMoveObj = pokemon.moves.find(m => m.id === attackerSlot.lockedMove);
			if (lockedMoveObj && lockedMoveObj.pp > 0) {
				return `${pokemon.species} must continue its uproar!`;
			}
			// If Uproar has no PP, allow Struggle (but no other moves)
			return `${pokemon.species} has no PP left for Uproar!`;
		}
	}

	if (attackerSlot.healBlockTurns > 0 && moveData.flags.heal) {
		return `${pokemon.species} is prevented from healing by Heal Block!`;
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
		// If Choice locked move has no PP, allow other moves
	}

	return null;
}
