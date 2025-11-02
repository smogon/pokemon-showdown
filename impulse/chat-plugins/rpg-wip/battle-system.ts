/**
 * Pokemon RPG Battle System
 *
 * This module consolidates all battle-related functionality in one place
 * for easy maintenance and extension of battle mechanics.
 */

// Import types and utilities
import type { BattleState, ActivePokemonSlot, RPGPokemon, PlayerData, Stats, Status } from './types';
import { TYPE_CHART, TYPE_RESIST_BERRIES, BERRY_FLAVORS, NATURES, ITEMS_DATABASE } from './constants';
import { MANUAL_BASE_EXP } from './MANUAL_BASE_EXP';
import { MANUAL_EV_YIELDS } from './MANUAL_EV_YIELDS';
import { MANUAL_EVOLUTIONS } from './MANUAL_EVOLUTIONS';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import {
	getCustomEffectiveness,
	getStatMultiplier,
	getCriticalHitChance,
	getMove,
	getBallBonus,
	performCatchAttempt,
} from './battle-helpers';
import { getPlayerData, activeBattles } from './player-data';
import {
	calculateStats,
	createPokemon,
	addItemToInventory,
	removeItemFromInventory,
	calculateTotalExpForLevel,
} from './utils';

export function calculateDamage(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState,
	spreadMultiplier: number // <-- NEW PARAM
): { damage: number, message: string, effectiveness: number, berryConsumed?: string } {
	const move = getMove(moveId);
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const attackerStages = attackerSlot.statStages;
	const defenderStages = defenderSlot.statStages;
	const attackerStatus = attackerSlot.status;

	let moveType = move.type; // Use a mutable variable for type-changing moves
	const attackerSpecies = Dex.species.get(attacker.species);
	const defenderSpecies = Dex.species.get(defender.species);

	// --- Ability/Type ImmunITIES Check ---
	if (move.flags.sound && defender.ability === 'Soundproof') {
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species}'s Soundproof blocks the move!</i>`, effectiveness: 0 };
	}
	if (move.flags.powder) {
		if (defenderSpecies.types.includes('Grass')) {
			return { damage: 0, message: ` <i style="color: #6c757d;">Grass-types are immune to powder moves!</i>`, effectiveness: 0 };
		}
		if (defender.ability === 'Overcoat') {
			return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species}'s Overcoat blocks the move!</i>`, effectiveness: 0 };
		}
	}

	if (!move.basePower) {
		// Fixed damage moves
		if (moveId === 'dragonrage') return { damage: 40, message: '', effectiveness: 1 };
		if (moveId === 'sonicboom') return { damage: 20, message: '', effectiveness: 1 };
		if (moveId === 'seismictoss' || moveId === 'nightshade') {
			return { damage: attacker.level, message: '', effectiveness: 1 };
		}
		if (moveId === 'psywave') {
			const damage = Math.floor(Math.random() * attacker.level * 1.5) + 1;
			return { damage, message: '', effectiveness: 1 };
		}
		if (moveId === 'superfang') {
			const damage = Math.floor(defender.hp / 2);
			return { damage, message: '', effectiveness: 1 };
		}
		return { damage: 0, message: ` <i style="color: #6c757d;">But it had no effect!</i>`, effectiveness: 1 };
	}

	let basePower = move.basePower;

	// --- NEW: Apply Helping Hand ---
	if (attackerSlot.isHelped) {
		basePower = Math.floor(basePower * 1.5);
	}

	// --- Power modification for hitting semi-invulnerable targets ---
	const defenderChargingMoveId = defenderSlot.chargingMove;

	if (defenderChargingMoveId) {
		if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) {
			basePower *= 2;
		}
		if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) {
			basePower *= 2;
		}
		if ((defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') && ['twister', 'gust', 'skyuppercut'].includes(move.id)) {
			basePower *= 2;
		}
	}

	// Handle Variable Power moves
	switch (move.id) {
	case 'reversal':
	case 'flail':
		const hpRatio = attacker.hp / attacker.maxHp;
		if (hpRatio < 0.0417) basePower = 200;
		else if (hpRatio < 0.1042) basePower = 150;
		else if (hpRatio < 0.2083) basePower = 100;
		else if (hpRatio < 0.3542) basePower = 80;
		else if (hpRatio < 0.6875) basePower = 40;
		else basePower = 20;
		break;

	case 'eruption':
	case 'waterspout':
		basePower = Math.max(1, Math.floor(150 * (attacker.hp / attacker.maxHp)));
		break;

	case 'grassknot':
	case 'lowkick':
		const defenderWeight = defenderSpecies.weightkg;
		if (defenderWeight < 10) basePower = 20;
		else if (defenderWeight < 25) basePower = 40;
		else if (defenderWeight < 50) basePower = 60;
		else if (defenderWeight < 100) basePower = 80;
		else if (defenderWeight < 200) basePower = 100;
		else basePower = 120;
		break;

	case 'heavyslam':
	case 'heatcrash':
		const attackerWeight = attackerSpecies.weightkg;
		const defenderWeightSlam = defenderSpecies.weightkg;
		const weightRatio = attackerWeight / defenderWeightSlam;
		if (weightRatio >= 5) basePower = 120;
		else if (weightRatio >= 4) basePower = 100;
		else if (weightRatio >= 3) basePower = 80;
		else if (weightRatio >= 2) basePower = 60;
		else basePower = 40;
		break;

	case 'gyroball':
		const attackerSpe = attacker.spe * getStatMultiplier(attackerStages.spe);
		const defenderSpe = defender.spe * getStatMultiplier(defenderStages.spe);
		if (defenderSpe > 0) {
			basePower = Math.min(150, Math.floor(25 * (defenderSpe / attackerSpe)) + 1);
		} else {
			basePower = 1;
		}
		break;

	case 'storedpower':
	case 'powertrip':
		let totalBoosts = 0;
		for (const stat in attackerStages) {
			if (attackerStages[stat as keyof typeof attackerStages] > 0) {
				totalBoosts += attackerStages[stat as keyof typeof attackerStages];
			}
		}
		basePower = 20 + (20 * totalBoosts);
		break;

	case 'acrobatics':
		if (!attacker.item || battle.magicRoomTurns > 0) {
			basePower *= 2;
		}
		break;

	case 'present':
		// Present has random effects: 40, 80, 120 power, or heals 80 HP
		const presentRand = Math.random();
		if (presentRand < 0.4) basePower = 40;
		else if (presentRand < 0.7) basePower = 80;
		else if (presentRand < 0.8) basePower = 120;
		else {
			// Heal the target instead
			const healAmount = Math.floor(defender.maxHp * 0.25);
			defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
			return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species} was healed!</i>`, effectiveness: 0 };
		}
		break;

	case 'magnitude':
		// Magnitude has random power: 10, 30, 50, 70, 90, 110, 150
		const magnitudeRoll = Math.random();
		if (magnitudeRoll < 0.05) basePower = 10;
		else if (magnitudeRoll < 0.15) basePower = 30;
		else if (magnitudeRoll < 0.35) basePower = 50;
		else if (magnitudeRoll < 0.65) basePower = 70;
		else if (magnitudeRoll < 0.85) basePower = 90;
		else if (magnitudeRoll < 0.95) basePower = 110;
		else basePower = 150;
		break;
	}

	// --- Context-Dependent Power Modifications ---
	if (move.id === 'facade' && attackerStatus && ['psn', 'brn', 'par'].includes(attackerStatus)) {
		basePower *= 2;
	}
	if (move.id === 'brine' && defender.hp <= defender.maxHp / 2) {
		basePower *= 2;
	}
	const defenderStatus = defenderSlot.status;
	if (move.id === 'venoshock' && defenderStatus === 'psn') {
		basePower *= 2;
	}
	if (move.id === 'weatherball' && battle.weather) {
		basePower *= 2;
	}
	if (move.id === 'terrainpulse' && battle.terrain && isGrounded(attacker, battle)) {
		basePower *= 2;
	}

	// Charge boosts next Electric move
	if (attackerSlot.isCharged && moveType === 'Electric') {
		basePower *= 2;
	}

	if (['solarbeam', 'solarblade'].includes(move.id) && battle.weather) {
		if (['rain', 'sand', 'hail'].includes(battle.weather.type)) {
			basePower = Math.floor(basePower * 0.5);
		}
	}

	// --- Type-Changing Moves ---
	if (move.id === 'weatherball' && battle.weather) {
		switch (battle.weather.type) {
		case 'sun': moveType = 'Fire'; break;
		case 'rain': moveType = 'Water'; break;
		case 'sand': moveType = 'Rock'; break;
		case 'hail': moveType = 'Ice'; break;
		}
	}
	if (move.id === 'terrainpulse' && battle.terrain && isGrounded(attacker, battle)) {
		switch (battle.terrain.type) {
		case 'electric': moveType = 'Electric'; break;
		case 'grassy': moveType = 'Grass'; break;
		case 'psychic': moveType = 'Psychic'; break;
		case 'misty': moveType = 'Fairy'; break;
		}
	}

	// --- Move-specific Power Boosts ---
	if (move.id === 'knockoff' && defender.item) {
		basePower = Math.floor(basePower * 1.5);
	}

	// --- Ability Power Boosts ---
	if (attacker.ability === 'Iron Fist' && move.flags.punch) {
		basePower = Math.floor(basePower * 1.2);
	}
	if (attacker.ability === 'Strong Jaw' && move.flags.bite) {
		basePower = Math.floor(basePower * 1.5);
	}
	if (attacker.ability === 'Mega Launcher' && move.flags.pulse) {
		basePower = Math.floor(basePower * 1.5);
	}

	let attackStatRaw = move.category === 'Special' ? attacker.spa : attacker.atk;
	let defenseStatRaw = move.category === 'Special' ? defender.spd : defender.def;

	if (battle.wonderRoomTurns > 0) {
		defenseStatRaw = move.category === 'Special' ? defender.def : defender.spd;
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'assaultvest' && move.category === 'Special') {
		defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'eviolite') {
		const defenderId = toID(defender.species);
		const species = Dex.species.get(defenderId);
		if (species.evos && species.evos.length > 0) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
			if (battle.wonderRoomTurns > 0 && move.category === 'Physical') {
				const originalSpDef = defender.spd;
				defenseStatRaw = Math.floor(originalSpDef * 1.5);
			}
		}
	}

	if (battle.magicRoomTurns === 0 && attacker.item === 'choiceband' && move.category === 'Physical') {
		attackStatRaw = Math.floor(attackStatRaw * 1.5);
	}
	if (battle.magicRoomTurns === 0 && attacker.item === 'choicespecs' && move.category === 'Special') {
		attackStatRaw = Math.floor(attackStatRaw * 1.5);
	}

	const attackStage = move.category === 'Special' ? attackerStages.spa : attackerStages.atk;
	const defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderStages.def : defenderStages.spd) :
		(move.category === 'Special' ? defenderStages.spd : defenderStages.def);

	const attackStat = Math.floor(attackStatRaw * getStatMultiplier(attackStage));
	const defenseStat = Math.floor(defenseStatRaw * getStatMultiplier(defenseStage));

	let finalAttackStat = attackStat;
	if (attackerStatus === 'brn' && move.category === 'Physical' && move.id !== 'facade') {
		finalAttackStat = Math.floor(finalAttackStat / 2);
	}

	// --- Self-Destruct Defense Halving ---
	let finalDefenseStat = defenseStat;
	if (['explosion', 'selfdestruct'].includes(move.id)) {
		finalDefenseStat = Math.floor(finalDefenseStat * 0.5);
	}

	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, move, battle);
	const criticalMultiplier = isCritical ? 1.5 : 1;
	const isStab = attackerSpecies.types.includes(moveType);
	const stabMultiplier = isStab ? 1.5 : 1;
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	let baseDamage = Math.floor((((2 * attacker.level / 5 + 2) * basePower * (finalAttackStat / finalDefenseStat)) / 50) + 2);
	const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
	let berryConsumed: string | undefined = undefined;
	let effectivenessMultiplier = effectiveness;

	if (battle.magicRoomTurns === 0 && defender.item && TYPE_RESIST_BERRIES[defender.item]) {
		const resistedType = TYPE_RESIST_BERRIES[defender.item];
		if (moveType === resistedType && effectiveness > 1) {
			effectivenessMultiplier = effectiveness / 2;
			berryConsumed = defender.item;
		}
	}

	// --- Screen Damage Reduction Check ---
	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
	if (!isCritical) { // Critical hits bypass screens
		const defenderVeilTurns = isDefenderPlayer ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;

		if (defenderVeilTurns > 0) {
			baseDamage = Math.floor(baseDamage * 0.5);
		} else {
			if (move.category === 'Physical') {
				const defenderReflectTurns = isDefenderPlayer ? battle.playerReflectTurns : battle.opponentReflectTurns;
				if (defenderReflectTurns > 0) {
					baseDamage = Math.floor(baseDamage * 0.5);
				}
			} else if (move.category === 'Special') {
				const defenderLightScreenTurns = isDefenderPlayer ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
				if (defenderLightScreenTurns > 0) {
					baseDamage = Math.floor(baseDamage * 0.5);
				}
			}
		}
	}

	if (battle.weather) {
		if (battle.weather.type === 'sun') {
			if (moveType === 'Fire') baseDamage = Math.floor(baseDamage * 1.5);
			if (moveType === 'Water') baseDamage = Math.floor(baseDamage * 0.5);
		} else if (battle.weather.type === 'rain') {
			if (moveType === 'Water') baseDamage = Math.floor(baseDamage * 1.5);
			if (moveType === 'Fire') baseDamage = Math.floor(baseDamage * 0.5);
		}
	}

	if (battle.terrain) {
		const attackerIsGrounded = isGrounded(attacker, battle);
		const defenderIsGrounded = isGrounded(defender, battle);

		if (battle.terrain.type === 'electric' && moveType === 'Electric' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		} else if (battle.terrain.type === 'grassy' && moveType === 'Grass' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		} else if (battle.terrain.type === 'psychic' && moveType === 'Psychic' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		}

		if (battle.terrain.type === 'misty' && moveType === 'Dragon' && defenderIsGrounded) {
			baseDamage = Math.floor(baseDamage * 0.5);
		} else if (battle.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && defenderIsGrounded) {
			baseDamage = Math.floor(baseDamage * 0.5);
		}
	}

	// --- Mud/Water Sport Damage Reduction ---
	if (battle.mudSportTurns > 0 && moveType === 'Electric') {
		baseDamage = Math.floor(baseDamage * 0.33);
	}
	if (battle.waterSportTurns > 0 && moveType === 'Fire') {
		baseDamage = Math.floor(baseDamage * 0.33);
	}

	let damage = Math.floor(baseDamage * stabMultiplier * effectivenessMultiplier * criticalMultiplier * randomMultiplier);

	if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
		damage = Math.floor(damage * 1.3);
	}

	if (battle.magicRoomTurns === 0 && attacker.item === 'expertbelt' && effectiveness > 1) {
		damage = Math.floor(damage * 1.2);
	}

	// --- NEW: SPREAD MOVE DAMAGE REDUCTION ---
	damage = Math.floor(damage * spreadMultiplier);

	damage = Math.max(1, damage);

	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed };
}

export function levelUp(pokemon: RPGPokemon): string[] {
	const levelUpMessages: string[] = [];
	pokemon.level++;
	levelUpMessages.push(`**${pokemon.species} grew to Level ${pokemon.level}!**`);
	const oldStats = { ...pokemon };
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
	pokemon.hp = pokemon.maxHp;
	levelUpMessages.push(`Max HP: ${oldStats.maxHp} -> ${pokemon.maxHp}`);
	levelUpMessages.push(`Attack: ${oldStats.atk} -> ${pokemon.atk}`);
	levelUpMessages.push(`Defense: ${oldStats.def} -> ${pokemon.def}`);
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
			// --- FIX: Check if move exists AND Pokemon doesn't already know it ---
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
		player.pendingMoveLearnQueue = { pokemonId: pokemon.id, moveIds: movesToQueue };
	}

	return { messages };
}

export function gainEffortValues(pokemon: RPGPokemon, defeatedPokemon: RPGPokemon) {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	// --- FIX: Added fallback EV yield of { atk: 1 } ---
	const evYield = MANUAL_EV_YIELDS[defeatedSpeciesId] || { atk: 1 };

	let totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	for (const stat in evYield) {
		if (totalEVs >= 510) break;
		const statKey = stat as keyof Stats;
		const evGained = evYield[statKey]!;
		const currentEV = pokemon.evs[statKey];
		if (currentEV >= 252) continue;
		const canAdd = Math.min(evGained, 252 - currentEV, 510 - totalEVs);
		pokemon.evs[statKey] += canAdd;
		totalEVs += canAdd;
	}
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	const hpDiff = newStats.maxHp - pokemon.maxHp;
	pokemon.hp = Math.max(1, pokemon.hp + hpDiff);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
}

export function gainExperience(
	player: PlayerData,
	participantSlots: ActivePokemonSlot[],
	defeatedPokemon: RPGPokemon,
	room: ChatRoom,
	user: User
): { messages: string[], leveledUp: boolean } {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	// --- FIX: Added fallback base experience of 150 ---
	const baseExp = MANUAL_BASE_EXP[defeatedSpeciesId] || 150;
	// if (!baseExp) return { messages: ['No experience was gained.'], leveledUp: false }; // <-- This check is no longer needed

	const expGained = Math.floor((baseExp * defeatedPokemon.level) / 7);
	if (expGained <= 0) return { messages: [`No Experience Points were gained.`], leveledUp: false };

	let leveledUp = false;
	const messages: string[] = [];

	const participantNames: string[] = [];

	// 1. Distribute EVs and EXP
	for (const slot of participantSlots) {
		if (!slot?.pokemon) continue; // <-- Safety check
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue; // Fainted or max level

		participantNames.push(pokemon.species);
		gainEffortValues(pokemon, defeatedPokemon);
		pokemon.experience += expGained;
	}

	if (participantNames.length === 0) return { messages: [], leveledUp: false };

	messages.push(`**${participantNames.join(' and ')}** gained ${expGained} Experience Points!`);

	// 2. Handle Level-Ups for all participants
	for (const slot of participantSlots) {
		if (!slot?.pokemon) continue; // <-- Safety check
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue;

		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
			messages.push(...levelUp(pokemon));
			leveledUp = true;
			const evolveMessage = checkEvolution(player, pokemon, room, user);
			if (evolveMessage) {
				messages.push(evolveMessage);
				// Stop leveling this Pokemon if it evolved, as its stats/exp curve changed
				break;
			}
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}
	}

	return { messages, leveledUp };
}

export function checkEvolution(player: PlayerData, pokemon: RPGPokemon, room: ChatRoom, user: User): string | null {
	const speciesId = toID(pokemon.species);
	const evoData = MANUAL_EVOLUTIONS[speciesId];
	if (!evoData || pokemon.level < evoData.evoLevel) return null;
	const evoSpecies = Dex.species.get(evoData.evoTo);
	if (!evoSpecies.exists) return null;
	const oldSpeciesName = pokemon.species;
	pokemon.species = evoSpecies.name;
	const newStats = calculateStats(evoSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
	pokemon.hp = pokemon.maxHp;
	const { messages: evoMoveMessages } = handleLearningMoves(player, pokemon);
	let evoMessage = `**What?! ${oldSpeciesName} is evolving!**<br>...Congratulations! Your ${oldSpeciesName} evolved into **${evoSpecies.name}**!`;
	if (evoMoveMessages.length > 0) evoMessage += `<br>${evoMoveMessages.join('<br>')}`;
	const pokemonIndex = player.party.findIndex(p => p.id === pokemon.id);
	if (pokemonIndex !== -1) player.party[pokemonIndex] = pokemon;
	room.add(`|c|~RPG Bot|What?! ${user.name}'s ${oldSpeciesName} is evolving!`).update();
	return evoMessage;
}

export function saveBattleStatus(battle: BattleState) {
	const player = getPlayerData(battle.playerId);

	// Save player's active Pokemon statuses back to the party
	for (const slot of battle.playerSlots) {
		if (slot) {
			const pokemonInParty = player.party.find(p => p.id === slot.pokemon.id);
			if (pokemonInParty) {
				// Copy volatile status back to the persistent Pokemon object
				// HP, PP, and Item should already be updated (as slot.pokemon is a reference)
				if (slot.status === 'slp' || slot.status === 'frz') {
					pokemonInParty.status = null; // These statuses don't persist outside battle
				} else {
					pokemonInParty.status = slot.status;
				}
			}
		}
	}

	// Save opponent's active Pokemon statuses back to the battle's party array
	if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
		for (const slot of battle.opponentSlots) {
			if (slot) {
				const opponentPokemonInParty = battle.opponentParty.find(p => p.id === slot.pokemon.id);
				if (opponentPokemonInParty) {
					opponentPokemonInParty.status = slot.status;
				}
			}
		}
	}
}

/**********************
* Battle Logic Helpers
**********************/
/**
 * Checks for statuses that might prevent a Pokémon from moving (sleep, freeze, paralysis, confusion).
 * @returns {boolean} `true` if the Pokémon can move, `false` otherwise.
 */
export function handlePreTurnChecks(attackerSlot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	const attacker = attackerSlot.pokemon;

	// START: Add this new block for Flinch
	if (attackerSlot.willFlinch) {
		messageLog.push(`${attacker.species} flinched and couldn't move!`);
		attackerSlot.willFlinch = false; // Reset the flag
		return false; // Prevent the move
	}
	// END: New Flinch block

	// Check for Freeze
	if (attackerSlot.status === 'frz') {
		if (Math.random() < 0.20) {
			attackerSlot.status = null;
			messageLog.push(`${attacker.species} thawed out!`);
		} else {
			messageLog.push(`${attacker.species} is frozen solid!`);
			return false;
		}
	}

	// Check for Sleep
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

	// Check for Confusion
	if (attackerSlot.isConfused) {
		messageLog.push(`${attacker.species} is confused!`);
		attackerSlot.confusionCounter--;

		if (attackerSlot.confusionCounter <= 0) {
			attackerSlot.isConfused = false;
			messageLog.push(`${attacker.species} snapped out of its confusion!`);
		} else if (Math.random() < 1 / 3) {
			messageLog.push(`It hurt itself in its confusion!`);
			const selfDamage = Math.floor((((2 * attacker.level / 5 + 2) * 40 * (attacker.atk / attacker.def)) / 50) + 2);
			attacker.hp = Math.max(0, attacker.hp - selfDamage);
			messageLog.push(`${attacker.species} took ${selfDamage} damage!`);
			return false; // Turn ends after self-damage
		}
	}

	// Check for Paralysis
	if (attackerSlot.status === 'par' && Math.random() < 0.25) {
		messageLog.push(`${attacker.species} is fully paralyzed!`);
		return false;
	}

	return true; // Can move
}

/**
 * Processes end-of-turn effects like status damage, item healing/damage, and volatile statuses.
 */

export function handleEndOfTurnEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;

	const pokemon = slot.pokemon;
	let status = slot.status;
	const speciesData = Dex.species.get(pokemon.species);

	if (!status && battle.magicRoomTurns === 0) {
		if (pokemon.item === 'flameorb' && !speciesData.types.includes('Fire')) {
			slot.status = 'brn';
			messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was burned by its Flame Orb!</span>`);
			status = 'brn';
		} else if (pokemon.item === 'toxicorb' && !speciesData.types.includes('Poison') && !speciesData.types.includes('Steel')) {
			slot.status = 'psn';
			messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was badly poisoned by its Toxic Orb!</span>`);
			status = 'psn';
		}
	}

	if (battle.magicRoomTurns === 0 && pokemon.item === 'lumberry' && status) {
		slot.status = null;
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> ate its <strong>Lum Berry</strong> and cured its status condition!</span>`);
		pokemon.item = undefined;
		return;
	}

	if (status === 'brn') {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was hurt by its burn!</span>`);
		if (pokemon.hp <= 0) return;
	} else if (status === 'psn') {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was hurt by its poison!</span>`);
		if (pokemon.hp <= 0) return;
	}

	if (battle.magicRoomTurns === 0) {
		if (pokemon.item === 'leftovers' && pokemon.hp < pokemon.maxHp) {
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
			messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Leftovers</strong>!</span>`);
		} else if (pokemon.item === 'blacksludge') {
			if (speciesData.types.includes('Poison')) {
				if (pokemon.hp < pokemon.maxHp) {
					pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
					messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Black Sludge</strong>!</span>`);
				}
			} else {
				pokemon.hp = Math.max(0, pokemon.hp - Math.max(1, Math.floor(pokemon.maxHp / 8)));
				messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Black Sludge</strong>!</span>`);
			}
		} else if (pokemon.item === 'stickybarb') {
			pokemon.hp = Math.max(0, pokemon.hp - Math.floor(pokemon.maxHp / 8));
			messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Sticky Barb</strong>!</span>`);
		}
	}
	if (pokemon.hp <= 0) return;

	if (slot.isCursed) {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`${pokemon.species} is afflicted by the curse!`);
	}
	if (pokemon.hp <= 0) return;

	if (slot.hasNightmare) {
		if (slot.status === 'slp') {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is locked in a nightmare!`);
		} else {
			slot.hasNightmare = false;
		}
	}
	if (pokemon.hp <= 0) return;

	if (slot.isTrapped) {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`${pokemon.species} is hurt by the trap!`);
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
	if (pokemon.hp <= 0) return;

	if (slot.isSeeded && pokemon.hp > 0) {
		const drainAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
		pokemon.hp = Math.max(0, pokemon.hp - drainAmount);
		messageLog.push(`${pokemon.species}'s health was sapped by Leech Seed!`);

		// Find an opponent to heal (flawed 1v1 logic, but a necessary patch)
		const isPlayer = battle.playerSlots.includes(slot);
		const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);
		const opponentToHeal = opponentSlots[0]; // Heals the first available opponent

		if (opponentToHeal && opponentToHeal.pokemon.hp > 0) {
			const oldHp = opponentToHeal.pokemon.hp;
			opponentToHeal.pokemon.hp = Math.min(opponentToHeal.pokemon.maxHp, opponentToHeal.pokemon.hp + drainAmount);
			messageLog.push(`${opponentToHeal.pokemon.species} restored ${opponentToHeal.pokemon.hp - oldHp} HP!`);
		}
	}

	// Handle Yawn counter
	if (slot.yawnCounter !== undefined && slot.yawnCounter > 0) {
		slot.yawnCounter--;
		if (slot.yawnCounter === 0) {
			// Try to inflict sleep
			if (!slot.status) {
				const speciesData = Dex.species.get(pokemon.species);
				// Check immunity
				const isTerrainImmune = battle.terrain?.type === 'electric' && isGrounded(pokemon, battle);
				const isAbilityImmune = ['Insomnia', 'Vital Spirit', 'Comatose', 'Sweet Veil'].includes(pokemon.ability || '');

				if (!isTerrainImmune && !isAbilityImmune) {
					slot.status = 'slp';
					slot.sleepCounter = Math.floor(Math.random() * 3) + 2;
					messageLog.push(`<strong>${pokemon.species}</strong> fell asleep!`);
				} else {
					messageLog.push(`${pokemon.species} stayed awake!`);
				}
			}
			// Clear the yawn counter
			slot.yawnCounter = undefined;
		}
	}

	// Handle Aqua Ring healing (blocked by Heal Block)
	if (slot.hasAquaRing && pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) {
		if (slot.healBlockTurns > 0) {
			// Heal Block prevents Aqua Ring healing
		} else {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species} was healed by Aqua Ring!`);
		}
	}

	// Handle Ingrain healing (blocked by Heal Block)
	if (slot.isIngrained && pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) {
		if (slot.healBlockTurns > 0) {
			// Heal Block prevents Ingrain healing
		} else {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species} absorbed nutrients with its roots!`);
		}
	}

	// Decrement volatile counters
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

	// Clear one-turn effects
	slot.isCharged = false; // Charge only lasts until next Electric move
}

/**
 * Applies all entry hazard effects to a Pokémon switching in.
 * Handles damage, status, and stat changes from Spikes, Toxic Spikes, Stealth Rock, and Sticky Web.
 * Also handles hazard removal effects (e.g., Poison-type absorbing Toxic Spikes).
 * @returns {boolean} Returns true if the Pokémon fainted from hazard damage.
 */
export function applyHazardEffectsOnSwitchIn(slot: ActivePokemonSlot, battle: BattleState, isPlayerSwitchIn: boolean, messageLog: string[]): boolean {
	const pokemon = slot.pokemon;
	// Heavy-Duty Boots provides total immunity to all entry hazards.
	if (battle.magicRoomTurns === 0 && pokemon.item === 'heavydutyboots') {
		return false;
	}

	const hazards = isPlayerSwitchIn ? battle.playerHazards : battle.opponentHazards;
	if (hazards.length === 0) return false; // No hazards, no effect.

	const species = Dex.species.get(pokemon.species);
	const hasAirBalloon = battle.magicRoomTurns === 0 && pokemon.item === 'airballoon';
	const isGroundedCheck = !(species.types.includes('Flying') || pokemon.ability === 'Levitate' || hasAirBalloon);

	// isGrounded check must also respect Gravity
	const isGrounded = isGroundedCheck || battle.gravityTurns > 0;

	let totalDamage = 0;
	let airBalloonPopped = false;

	// --- Effects that don't do direct damage (run first) ---
	if (isGrounded) {
		// Sticky Web lowers Speed
		if (hazards.includes('stickyweb')) {
			const targetStages = slot.statStages;
			if (targetStages.spe > -6) {
				targetStages.spe--;
				messageLog.push(`${pokemon.species}'s Speed was lowered by the sticky web!`);
			}
		}

		// Toxic Spikes poisons or badly poisons
		const toxicSpikeLayers = hazards.filter(h => h === 'toxicspikes').length;
		if (toxicSpikeLayers > 0) {
			// Poison-type Pokémon absorb and remove Toxic Spikes from their side of the field.
			if (species.types.includes('Poison')) {
				if (isPlayerSwitchIn) {
					battle.playerHazards = battle.playerHazards.filter(h => h !== 'toxicspikes');
				} else {
					battle.opponentHazards = battle.opponentHazards.filter(h => h !== 'toxicspikes');
				}
				messageLog.push(`The Toxic Spikes were absorbed by ${pokemon.species}!`);
			} else {
				const isImmune = species.types.includes('Steel');
				const targetStatus = slot.status; // Read from slot

				if (!isImmune && !targetStatus) {
					const newStatus: Status = 'psn';
					slot.status = newStatus; // Apply to slot
					messageLog.push(`${pokemon.species} was poisoned by the Toxic Spikes!`);
				}
			}
		}
	}

	// --- Damage-dealing hazards ---
	// Spikes (max 3 layers) - only affect grounded Pokemon
	if (isGrounded) {
		const spikeLayers = hazards.filter(h => h === 'spikes').length;
		if (spikeLayers > 0) {
			const damageFraction = [0, 1 / 8, 1 / 6, 1 / 4][spikeLayers];
			totalDamage += Math.floor(pokemon.maxHp * damageFraction);
		}
	}

	// Stealth Rock - affects all Pokemon, but Air Balloon pops from it
	if (hazards.includes('stealthrock')) {
		if (hasAirBalloon) {
			messageLog.push(`${pokemon.species}'s Air Balloon popped from the pointed stones!`);
			pokemon.item = undefined;
			airBalloonPopped = true;
		}
		// Pass the pokemon, not the slot, to getCustomEffectiveness
		const effectiveness = getCustomEffectiveness('Rock', species.types, pokemon, battle);
		totalDamage += Math.floor(pokemon.maxHp * (1 / 8) * effectiveness);
	}

	// Apply final damage and add appropriate messages
	if (totalDamage > 0) {
		if (hazards.includes('stealthrock')) {
			messageLog.push(`Pointed stones dug into ${pokemon.species}!`);
		} else if (hazards.includes('spikes')) {
			messageLog.push(`${pokemon.species} was hurt by the spikes!`);
		}
		pokemon.hp = Math.max(0, pokemon.hp - totalDamage);
		if (pokemon.hp <= 0) {
			return true; // Pokémon fainted
		}
	}

	return false; // Pokémon survived
}

export function handleMirrorHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mirrorherb') return;

	const isPlayer = battle.playerSlots.includes(slot);
	const myStages = slot.statStages;
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);

	if (opponentSlots.length === 0) return; // No opponents to copy from

	let copiedAny = false;
	const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;

	for (const stat of stats) {
		// Find the maximum positive stat boost for this stat among all opponents
		const maxOpponentBoost = Math.max(0, ...opponentSlots.map(s => s.statStages[stat]));

		if (maxOpponentBoost > 0) {
			// Copy those boosts
			myStages[stat] = Math.min(6, myStages[stat] + maxOpponentBoost);
			copiedAny = true;
		}
	}

	if (copiedAny) {
		messageLog.push(`${slot.pokemon.species}'s Mirror Herb copied the opponent's stat boosts!`);
		slot.pokemon.item = undefined; // Consumed after use
	}
}

export function handleStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot, // Note: defenderSlot can be null for 'self' or 'allySide' moves
	move: Move,
	battle: BattleState,
	messageLog: string[]
) {
	const attacker = attackerSlot.pokemon;
	// Defender can be null, so check before accessing
	const defender = defenderSlot?.pokemon;
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
	const defenderSpecies = defender ? Dex.species.get(defender.species) : null;
	let hadEffect = false;

	// Handle moves that need a defender
	if (defender && defenderSpecies) {
		// Handle forced switching moves first
		if (['roar', 'whirlwind'].includes(move.id)) {
			if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
				messageLog.push(`The wild ${defender.species} was blown away!`);
				// Find and remove the slot
				const oppSlotIndex = battle.opponentSlots.indexOf(defenderSlot);
				if (oppSlotIndex !== -1) {
					battle.opponentSlots[oppSlotIndex as 0 | 1] = null;
				}
			} else {
				messageLog.push(`But it failed!`); // Can't force switch a trainer
			}
			return;
		}

		// Handle Hazard/Screen Removal
		if (move.id === 'defog') {
			let clearedSomething = false;
			if (battle.playerHazards.length > 0 || battle.opponentHazards.length > 0) {
				battle.playerHazards = [];
				battle.opponentHazards = [];
				messageLog.push('The entry hazards were removed from the field!');
				clearedSomething = true;
			}

			// Defog clears screens from the *opposing* side
			if (isPlayerAttacker) {
				if (battle.opponentReflectTurns > 0) {
					battle.opponentReflectTurns = 0;
					messageLog.push(`The opposing team's Reflect wore off!`);
					clearedSomething = true;
				}
				if (battle.opponentLightScreenTurns > 0) {
					battle.opponentLightScreenTurns = 0;
					messageLog.push(`The opposing team's Light Screen wore off!`);
					clearedSomething = true;
				}
				if (battle.opponentAuroraVeilTurns > 0) {
					battle.opponentAuroraVeilTurns = 0;
					messageLog.push(`The opposing team's Aurora Veil wore off!`);
					clearedSomething = true;
				}
			} else {
				if (battle.playerReflectTurns > 0) {
					battle.playerReflectTurns = 0;
					messageLog.push(`Your team's Reflect wore off!`);
					clearedSomething = true;
				}
				if (battle.playerLightScreenTurns > 0) {
					battle.playerLightScreenTurns = 0;
					messageLog.push(`Your team's Light Screen wore off!`);
					clearedSomething = true;
				}
				if (battle.playerAuroraVeilTurns > 0) {
					battle.playerAuroraVeilTurns = 0;
					messageLog.push(`Your team's Aurora Veil wore off!`);
					clearedSomething = true;
				}
			}

			// Defog lowers the target's evasion
			if (defenderSlot.statStages.evasion > -6) {
				defenderSlot.statStages.evasion--;
				messageLog.push(`${defender.species}'s evasion fell!`);
			}
			hadEffect = true;
			return;
		}

		const effectiveness = getCustomEffectiveness(move.type, defenderSpecies.types, defender, battle);
		if (effectiveness === 0 && move.target !== 'self' && !move.flags.heal) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}

		if (move.id === 'leechseed') {
			if (defenderSpecies.types.includes('Grass')) {
				messageLog.push(`It doesn't affect ${defender.species}...`);
				return;
			}
			if (defenderSlot.isSeeded) {
				messageLog.push(`${defender.species} is already seeded!`);
			} else {
				defenderSlot.isSeeded = true;
				messageLog.push(`${defender.species} was seeded!`);
				hadEffect = true;
			}
		} else if (move.id === 'curse') {
			const attackerSpecies = Dex.species.get(attacker.species);

			if (attackerSpecies.types.includes('Ghost')) {
				if (defenderSlot.isCursed) {
					messageLog.push(`But it failed!`);
				} else {
					attacker.hp = Math.max(1, Math.floor(attacker.hp / 2));
					messageLog.push(`${attacker.species} cut its own HP to lay a curse!`);
					defenderSlot.isCursed = true;
					messageLog.push(`${defender.species} was cursed!`);
					hadEffect = true;
				}
			} else {
				// Non-ghost Curse
				const boosts = move.boosts;
				if (boosts) {
					const selfStages = attackerSlot.statStages;
					for (const stat in boosts) {
						const stage = selfStages[stat as keyof typeof selfStages];
						const boostValue = boosts[stat as keyof typeof boosts]!;
						if ((stage < 6 && boostValue > 0) || (stage > -6 && boostValue < 0)) {
							selfStages[stat as keyof typeof selfStages] = Math.max(-6, Math.min(6, stage + boostValue));
							messageLog.push(`${attacker.species}'s ${stat.toUpperCase()} ${boostValue > 0 ? 'rose' : 'fell'}!`);
							hadEffect = true;
						}
					}
				}
			}
		} else if (move.id === 'psychup') {
			const sourceStages = defenderSlot.statStages;
			attackerSlot.statStages = { ...sourceStages };
			messageLog.push(`${attacker.species} copied ${defender.species}'s stat changes!`);
			hadEffect = true;
		} else if (['trick', 'switcheroo'].includes(move.id)) {
			if (battle.magicRoomTurns > 0) {
				messageLog.push('But it failed!');
				return;
			}
			if (defender.ability === 'Sticky Hold' || attacker.ability === 'Sticky Hold') {
				messageLog.push('But it failed!');
				return;
			}
			if (!attacker.item && !defender.item) {
				messageLog.push('But it failed!');
				return;
			}

			const attackerItem = attacker.item;
			const defenderItem = defender.item;

			attacker.item = defenderItem;
			defender.item = attackerItem;

			hadEffect = true;
			messageLog.push(`${attacker.species} swapped items with ${defender.species}!`);

			if (attacker.item) messageLog.push(`${attacker.species} obtained a ${ITEMS_DATABASE[attacker.item].name}!`);
			if (defender.item) messageLog.push(`${defender.species} obtained a ${ITEMS_DATABASE[defender.item].name}!`);
		} else if (move.id === 'nightmare') {
			const defenderStatus = defenderSlot.status;
			const hasNightmare = defenderSlot.hasNightmare;

			if (defenderStatus !== 'slp') {
				messageLog.push(`But it failed!`);
			} else if (hasNightmare) {
				messageLog.push(`${defender.species} is already having a nightmare!`);
			} else {
				defenderSlot.hasNightmare = true;
				messageLog.push(`${defender.species} began having a nightmare!`);
				hadEffect = true;
			}
		} else if (move.id === 'bestow') {
			if (battle.magicRoomTurns > 0) {
				messageLog.push('But it failed!');
				return;
			}
			if (!attacker.item || defender.item) {
				messageLog.push('But it failed!');
				return;
			}
			if (defender.ability === 'Sticky Hold') {
				messageLog.push('But it failed!');
				return;
			}

			const givenItem = attacker.item;
			defender.item = givenItem;
			attacker.item = undefined;
			messageLog.push(`${attacker.species} gave ${ITEMS_DATABASE[givenItem].name} to ${defender.species}!`);
			hadEffect = true;
		} else if (move.id === 'transform') {
			// Transform copies target's species, stats, moves, and ability (but not HP, status, or item)
			const transformedStats = {
				atk: defender.atk,
				def: defender.def,
				spa: defender.spa,
				spd: defender.spd,
				spe: defender.spe,
			};

			// Copy base stats to attacker
			attacker.atk = transformedStats.atk;
			attacker.def = transformedStats.def;
			attacker.spa = transformedStats.spa;
			attacker.spd = transformedStats.spd;
			attacker.spe = transformedStats.spe;

			// Copy moveset (with 5 PP each)
			attacker.moves = defender.moves.map(m => ({ id: m.id, pp: 5 }));

			// Copy species name (for display)
			const originalSpecies = attacker.species;
			attacker.species = defender.species;

			// Copy ability
			if (defender.ability) {
				attacker.ability = defender.ability;
			}

			// Reset stat stages to match target
			attackerSlot.statStages = { ...defenderSlot.statStages };

			messageLog.push(`${originalSpecies} transformed into ${defender.species}!`);
			hadEffect = true;
		} else if (move.boosts && move.target !== 'self') {
			const targetSlot = defenderSlot;
			const targetStages = targetSlot.statStages;

			if (battle.magicRoomTurns === 0 && targetSlot.pokemon.item === 'clearamulet') {
				const hasNegativeBoosts = Object.values(move.boosts).some(boost => (boost || 0) < 0);
				if (hasNegativeBoosts) {
					messageLog.push(`${targetSlot.pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
					return;
				}
			}

			for (const stat in move.boosts) {
				const stage = targetStages[stat as keyof typeof targetStages];
				const boostValue = move.boosts[stat as keyof typeof move.boosts]!;
				if ((stage < 6 && boostValue > 0) || (stage > -6 && boostValue < 0)) {
					targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
					messageLog.push(`${targetSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue > 0 ? 'rose' : 'fell'}!`);
					hadEffect = true;
				}
			}
		} else if (move.status) {
			const defenderCurrentStatus = defenderSlot.status;
			let canBeAfflicted = !defenderCurrentStatus;
			const defenderIsGrounded = isGrounded(defender, battle);

			if (battle.terrain?.type === 'misty' && defenderIsGrounded) {
				canBeAfflicted = false;
				messageLog.push('The Misty Terrain prevents status conditions!');
			}
			if (battle.terrain?.type === 'electric' && move.status === 'slp' && defenderIsGrounded) {
				canBeAfflicted = false;
				messageLog.push('The Electric Terrain prevents sleep!');
			}

			if (canBeAfflicted) {
				if ((move.status === 'brn' && defenderSpecies.types.includes('Fire')) || (move.status === 'par' && defenderSpecies.types.includes('Electric')) || (move.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel'))) || (move.status === 'frz' && defenderSpecies.types.includes('Ice'))) {
					canBeAfflicted = false;
				}
			}

			if (canBeAfflicted) {
				const newStatus = move.status as Status;
				defenderSlot.status = newStatus;
				if (newStatus === 'slp') {
					defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
				}
				messageLog.push(`${defender.species} was afflicted with ${newStatus}!`);
				hadEffect = true;
			}
		} else if (move.volatileStatus) {
			switch (move.volatileStatus) {
			case 'confusion':
				if (!defenderSlot.isConfused) {
					defenderSlot.isConfused = true;
					defenderSlot.confusionCounter = Math.floor(Math.random() * 3) + 2;
					messageLog.push(`${defender.species} became confused!`);
					hadEffect = true;
				}
				break;

			case 'taunt':
				if (defenderSlot.tauntTurns <= 0) {
					defenderSlot.tauntTurns = 3;
					messageLog.push(`${defender.species} fell for the taunt!`);
					hadEffect = true;
				}
				break;

			case 'trap':
				if (!defenderSlot.isTrapped) {
					defenderSlot.isTrapped = { turns: 5 };
					messageLog.push(`${defender.species} can no longer escape!`);
					hadEffect = true;
				}
				break;

			case 'yawn':
				// Check if target can be put to sleep
				if (!defenderSlot.status && !defenderSlot.yawnCounter) {
					const defenderSpecies = Dex.species.get(defender.species);
					// Check type immunity
					const isTypeImmune = defenderSpecies.types.includes('Grass') && defenderSlot.pokemon.ability === 'Overcoat';
					// Check terrain immunity
					const isTerrainImmune = battle.terrain?.type === 'electric' && isGrounded(defender, battle);
					// Check ability immunity
					const isAbilityImmune = ['Insomnia', 'Vital Spirit', 'Comatose', 'Sweet Veil'].includes(defender.ability || '');

					if (!isTypeImmune && !isTerrainImmune && !isAbilityImmune) {
						defenderSlot.yawnCounter = 2; // Will fall asleep in 2 turns
						messageLog.push(`${defender.species} grew drowsy!`);
						hadEffect = true;
					} else {
						messageLog.push(`But it failed!`);
					}
				}
				break;

			case 'disable':
				if (defenderSlot.lastMoveUsed && !defenderSlot.disabledMove) {
					defenderSlot.disabledMove = { moveId: defenderSlot.lastMoveUsed, turns: 4 };
					messageLog.push(`${defender.species}'s ${defenderSlot.lastMoveUsed} was disabled!`);
					hadEffect = true;
				} else {
					messageLog.push(`But it failed!`);
				}
				break;

			case 'encore':
				if (defenderSlot.lastMoveUsed && !defenderSlot.encoreMove) {
					defenderSlot.encoreMove = { moveId: defenderSlot.lastMoveUsed, turns: 3 };
					messageLog.push(`${defender.species} received an encore!`);
					hadEffect = true;
				} else {
					messageLog.push(`But it failed!`);
				}
				break;

			case 'ingrain':
				if (!attackerSlot.isIngrained) {
					attackerSlot.isIngrained = true;
					messageLog.push(`${attacker.species} planted its roots!`);
					hadEffect = true;
				}
				break;

			case 'aquaring':
				if (!attackerSlot.hasAquaRing) {
					attackerSlot.hasAquaRing = true;
					messageLog.push(`${attacker.species} surrounded itself with a veil of water!`);
					hadEffect = true;
				}
				break;

			case 'focusenergy':
				if (!attackerSlot.focusEnergy) {
					attackerSlot.focusEnergy = true;
					messageLog.push(`${attacker.species} is getting pumped!`);
					hadEffect = true;
				}
				break;

			case 'magnetrise':
				if (attackerSlot.magnetRiseTurns === 0) {
					attackerSlot.magnetRiseTurns = 5;
					messageLog.push(`${attacker.species} levitated with electromagnetism!`);
					hadEffect = true;
				}
				break;

			case 'telekinesis':
				if (defenderSlot.telekinesisCounter === 0) {
					defenderSlot.telekinesisCounter = 3;
					messageLog.push(`${defender.species} was hurled into the air!`);
					hadEffect = true;
				}
				break;

			case 'smackdown':
				if (!defenderSlot.isSmackedDown) {
					defenderSlot.isSmackedDown = true;
					messageLog.push(`${defender.species} fell straight down!`);
					hadEffect = true;
				}
				break;

			case 'torment':
				if (!defenderSlot.tormentActive) {
					defenderSlot.tormentActive = true;
					messageLog.push(`${defender.species} was subjected to torment!`);
					hadEffect = true;
				}
				break;

			case 'embargo':
				if (defenderSlot.embargoTurns === 0) {
					defenderSlot.embargoTurns = 5;
					messageLog.push(`${defender.species} can't use items anymore!`);
					hadEffect = true;
				}
				break;

			case 'healblock':
				if (defenderSlot.healBlockTurns === 0) {
					defenderSlot.healBlockTurns = 5;
					messageLog.push(`${defender.species} was prevented from healing!`);
					hadEffect = true;
				}
				break;
			}
		} else if (move.id === 'helpinghand') {
			if (!defenderSlot) { // Target fainted or is empty
				messageLog.push('But it failed!');
				return;
			}
			// Mark the ally slot as having been helped
			defenderSlot.isHelped = true; // <-- NEW VOLATILE
			messageLog.push(`${attacker.species} is ready to help ${defender.species}!`);
			hadEffect = true;
		} else if (move.id === 'substitute') {
			// Substitute creates a decoy with 1/4 of user's max HP
			if (attackerSlot.substitute) {
				messageLog.push(`${attacker.species} already has a substitute!`);
			} else {
				const subHP = Math.floor(attacker.maxHp / 4);
				if (attacker.hp <= subHP) {
					messageLog.push(`But it does not have enough HP left to make a substitute!`);
				} else {
					attacker.hp -= subHP;
					attackerSlot.substitute = { hp: subHP };
					messageLog.push(`${attacker.species} made a substitute!`);
					hadEffect = true;
				}
			}
		} else if (move.id === 'charge') {
			attackerSlot.isCharged = true;
			messageLog.push(`${attacker.species} began charging power!`);
			hadEffect = true;
		} else if (move.id === 'stockpile') {
			if (attackerSlot.stockpileCount < 3) {
				attackerSlot.stockpileCount++;
				// Stockpile also raises Defense and Sp. Def by 1 stage
				if (attackerSlot.statStages.def < 6) attackerSlot.statStages.def++;
				if (attackerSlot.statStages.spd < 6) attackerSlot.statStages.spd++;
				messageLog.push(`${attacker.species} stockpiled ${attackerSlot.stockpileCount}!`);
				hadEffect = true;
			} else {
				messageLog.push(`${attacker.species} can't stockpile any more!`);
			}
		}
	}

	// --- Handle moves that don't target a single defender ---

	// Handle Future Sight and Doom Desire
	if (['futuresight', 'doomdesire'].includes(move.id)) {
		// Determine which side's future moves array to use
		const futureMoveArray = isPlayerAttacker ? battle.opponentFutureMoves : battle.playerFutureMoves;

		// Check if a future move is already scheduled for this slot
		const targetSlotLocalIndex = isPlayerAttacker ?
			(chosenTargetSlot - 2) : chosenTargetSlot; // Convert to 0-1 index

		const existingFutureMove = futureMoveArray.find(fm => fm.slotIndex === targetSlotLocalIndex);

		if (existingFutureMove) {
			messageLog.push(`But it failed!`);
			return;
		}

		// Schedule the future move to hit in 2 turns
		futureMoveArray.push({
			slotIndex: targetSlotLocalIndex,
			moveId: move.id as 'futuresight' | 'doomdesire',
			turnsLeft: 2,
			attackerSlotIndex,
			attackerStats: {
				atk: attacker.atk * getStatMultiplier(attackerSlot.statStages.atk),
				spa: attacker.spa * getStatMultiplier(attackerSlot.statStages.spa),
			},
		});

		const moveName = move.id === 'futuresight' ? 'Future Sight' : 'Doom Desire';
		messageLog.push(`${attacker.species} foresaw an attack!`);
		hadEffect = true;
		return;
	}

	// Handle Protect and Detect
	if (['protect', 'detect'].includes(move.id)) {
		const successCounter = attackerSlot.protectSuccessCounter;
		const successChance = 1 / 3 ** successCounter;

		if (Math.random() < successChance) {
			attackerSlot.isProtected = true;
			attackerSlot.protectSuccessCounter++;
			messageLog.push(`${attacker.species} protected itself!`);
		} else {
			messageLog.push(`But it failed!`);
		}
		return;
	}

	// Handle Guarding Moves
	if (['quickguard', 'wideguard', 'craftyshield'].includes(move.id)) {
		let guardSet = false;
		if (isPlayerAttacker) {
			if (move.id === 'quickguard') { battle.playerQuickGuard = true; guardSet = true; }
			if (move.id === 'wideguard') { battle.playerWideGuard = true; guardSet = true; }
			if (move.id === 'craftyshield') { battle.playerCraftyShield = true; guardSet = true; }
		} else {
			if (move.id === 'quickguard') { battle.opponentQuickGuard = true; guardSet = true; }
			if (move.id === 'wideguard') { battle.opponentWideGuard = true; guardSet = true; }
			if (move.id === 'craftyshield') { battle.opponentCraftyShield = true; guardSet = true; }
		}

		if (guardSet) {
			messageLog.push(`${attacker.species} is protecting its side!`);
		} else {
			messageLog.push(`But it failed!`);
		}
		return;
	}

	// Handle Screen Moves
	if (['reflect', 'lightscreen', 'auroraveil'].includes(move.id)) {
		const duration = (battle.magicRoomTurns === 0 && attacker.item === 'lightclay') ? 8 : 5;
		if (isPlayerAttacker) {
			if (move.id === 'reflect' && battle.playerReflectTurns === 0) {
				battle.playerReflectTurns = duration;
				messageLog.push(`Reflect raised your team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.playerLightScreenTurns === 0) {
				battle.playerLightScreenTurns = duration;
				messageLog.push(`Light Screen raised your team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && battle.weather?.type === 'hail' && battle.playerAuroraVeilTurns === 0) {
				battle.playerAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised your team's defenses!`);
				hadEffect = true;
			}
		} else { // Opponent is attacker
			if (move.id === 'reflect' && battle.opponentReflectTurns === 0) {
				battle.opponentReflectTurns = duration;
				messageLog.push(`Reflect raised the opposing team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.opponentLightScreenTurns === 0) {
				battle.opponentLightScreenTurns = duration;
				messageLog.push(`Light Screen raised the opposing team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && battle.weather?.type === 'hail' && battle.opponentAuroraVeilTurns === 0) {
				battle.opponentAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised the opposing team's defenses!`);
				hadEffect = true;
			}
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return;
	}

	// Handle new field effects
	if (move.id === 'gravity') {
		if (battle.gravityTurns > 0) {
			messageLog.push('But it failed!');
		} else {
			battle.gravityTurns = 5;
			messageLog.push('Gravity intensified!');
			hadEffect = true;
		}
	} else if (move.id === 'mudsport') {
		if (battle.mudSportTurns > 0) {
			messageLog.push('But it failed!');
		} else {
			battle.mudSportTurns = 5;
			messageLog.push('Electricity\'s power was weakened!');
			hadEffect = true;
		}
	} else if (move.id === 'watersport') {
		if (battle.waterSportTurns > 0) {
			messageLog.push('But it failed!');
		} else {
			battle.waterSportTurns = 5;
			messageLog.push('Fire\'s power was weakened!');
			hadEffect = true;
		}
	}

	const pseudoWeather = move.pseudoWeather || move.id;
	switch (pseudoWeather) {
	case 'trickroom':
		if (battle.trickRoomTurns > 0) {
			battle.trickRoomTurns = 0;
			messageLog.push('The twisted dimensions returned to normal.');
		} else {
			battle.trickRoomTurns = 5;
			messageLog.push(`${attacker.species} twisted the dimensions!`);
		}
		hadEffect = true;
		break;
	case 'magicroom':
		if (battle.magicRoomTurns > 0) {
			battle.magicRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.magicRoomTurns = 5;
			messageLog.push('It created a bizarre area where held items lose their effects!');
		}
		hadEffect = true;
		break;
	case 'wonderroom':
		if (battle.wonderRoomTurns > 0) {
			battle.wonderRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.wonderRoomTurns = 5;
			messageLog.push('It created a bizarre area where Defense and Sp. Def stats are swapped!');
		}
		hadEffect = true;
		break;
	case 'electricterrain':
	case 'grassyterrain':
	case 'mistyterrain':
	case 'psychicterrain':
		const terrainType = pseudoWeather.replace('terrain', '') as 'electric' | 'grassy' | 'misty' | 'psychic';
		if (battle.terrain) {
			messageLog.push('But it failed! (A terrain is already active)');
		} else {
			battle.terrain = { type: terrainType, turns: 5 };
			messageLog.push(`${attacker.species} turned the battlefield into ${terrainType} terrain!`);
			hadEffect = true;
		}
		break;
	}
	if (hadEffect) return;

	// --- NEW: Add Follow Me / Rage Powder ---
	if (['followme', 'ragepowder'].includes(move.id)) {
		attackerSlot.isRedirecting = true;
		messageLog.push(`${attacker.species} became the center of attention!`);
		hadEffect = true;
	}

	if (move.id === 'haze') {
		// Haze affects all slots
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			slot.statStages = { ...INITIAL_STAT_STAGES };
		});
		messageLog.push('All stat changes were eliminated!');
		hadEffect = true;
	} else if (move.weather) {
		const weatherType = move.weather as 'sun' | 'rain' | 'sand' | 'hail';
		if (battle.weather?.type === weatherType) {
			messageLog.push(`But it failed!`);
		} else {
			const weatherItems: Record<string, string> = { 'damprock': 'rain', 'heatrock': 'sun', 'smoothrock': 'sand', 'icyrock': 'hail' };
			const turns = (battle.magicRoomTurns === 0 && attacker.item && weatherItems[attacker.item] === weatherType) ? 8 : 5;
			battle.weather = { type: weatherType, turns };
			const weatherStartMessages = { 'sun': 'The sunlight turned harsh!', 'rain': 'It started to rain!', 'sand': 'A sandstorm kicked up!', 'hail': 'It started to hail!' };
			messageLog.push(weatherStartMessages[weatherType]);
			hadEffect = true;
		}
	} else if (move.flags.heal) {
		if (attacker.hp >= attacker.maxHp) {
			messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
		} else {
			const healAmount = Math.floor(attacker.maxHp * (move.heal?.[0] || 1) / (move.heal?.[1] || 2));
			const oldHp = attacker.hp;
			attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
			messageLog.push(`${attacker.species} restored ${attacker.hp - oldHp} HP!`);
			hadEffect = true;
		}
	} else if (move.id === 'bellydrum') {
		const attackerStages = attackerSlot.statStages;
		if (attacker.hp <= attacker.maxHp / 2) {
			messageLog.push(`But it failed! (Not enough HP)`);
		} else if (attackerStages.atk >= 6) {
			messageLog.push(`But it failed! (Attack is already maxed out)`);
		} else {
			attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
			attackerStages.atk = 6;
			messageLog.push(`${attacker.species} cut its own HP and maximized its Attack!`);
			hadEffect = true;
		}
	} else if (move.sideCondition) {
		const targetHazards = isPlayerAttacker ? battle.opponentHazards : battle.playerHazards;
		const hazardId = toID(move.sideCondition);
		let hazardSet = false;
		switch (hazardId) {
		case 'spikes':
			if (targetHazards.filter(h => h === 'spikes').length < 3) {
				targetHazards.push('spikes');
				messageLog.push(`Spikes were scattered all around the opposing team's feet!`);
				hazardSet = true;
			}
			break;
		case 'toxicspikes':
			if (targetHazards.filter(h => h === 'toxicspikes').length < 2) {
				targetHazards.push('toxicspikes');
				messageLog.push(`Toxic Spikes were scattered all around the opposing team's feet!`);
				hazardSet = true;
			}
			break;
		case 'stickyweb':
			if (!targetHazards.includes('stickyweb')) {
				targetHazards.push('stickyweb');
				messageLog.push(`A sticky web has been laid out on the ground around the opposing team!`);
				hazardSet = true;
			}
			break;
		case 'stealthrock':
			if (!targetHazards.includes('stealthrock')) {
				targetHazards.push('stealthrock');
				messageLog.push(`Pointed stones float in the air around the opposing team!`);
				hazardSet = true;
			}
			break;
		}
		if (hazardSet) {
			hadEffect = true;
		}
	} else if (move.boosts && move.target === 'self') {
		const targetSlot = attackerSlot;
		const targetStages = targetSlot.statStages;

		for (const stat in move.boosts) {
			const stage = targetStages[stat as keyof typeof targetStages];
			const boostValue = move.boosts[stat as keyof typeof move.boosts]!;
			if ((stage < 6 && boostValue > 0) || (stage > -6 && boostValue < 0)) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue > 0 ? 'rose' : 'fell'}!`);
				hadEffect = true;
			}
		}
	}

	// --- Handle self-switching status moves (Baton Pass, Teleport) ---
	if (move.selfSwitch) {
		// This will be handled by executeAction
		// We set the flag there
		hadEffect = true;
	}

	if (!hadEffect) {
		messageLog.push(`But it failed!`);
	}
}

export function handleDamagingMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	spreadMultiplier: number // <-- NEW PARAM
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	// Check for semi-invulnerable state from two-turn moves
	const defenderChargingMoveId = defenderSlot.chargingMove;
	if (defenderChargingMoveId) {
		let isImmune = true; // Assume the defender is immune by default while charging
		const semiInvulnerableStates = ['fly', 'dig', 'dive', 'bounce', 'shadowforce', 'phantomforce'];

		if (semiInvulnerableStates.includes(defenderChargingMoveId)) {
			if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) isImmune = false;
			if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) isImmune = false;
			if ((defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') && ['thunder', 'hurricane', 'twister', 'gust', 'skyuppercut', 'smackdown'].includes(move.id)) isImmune = false;
		}

		if (isImmune) {
			messageLog.push(`But it failed! ${defender.species} avoided the attack!`);
			return; // The attack misses
		}
	}

	// Handle Counter and Mirror Coat
	if (move.id === 'counter' || move.id === 'mirrorcoat') {
		const targetCategory = move.id === 'counter' ? 'Physical' : 'Special';

		if (!attackerSlot.lastDamageTaken || attackerSlot.lastDamageTaken.category !== targetCategory) {
			messageLog.push(`But it failed!`);
			return;
		}

		// Deal double the damage received
		const counterDamage = attackerSlot.lastDamageTaken.amount * 2;
		defender.hp = Math.max(0, defender.hp - counterDamage);
		messageLog.push(`${defender.species} took ${counterDamage} damage from the counter!`);
		return;
	}

	// Handle Fling
	if (move.id === 'fling') {
		if (battle.magicRoomTurns > 0 || !attacker.item) {
			messageLog.push(`But it failed!`);
			return;
		}

		// Fling power is based on the item (simplified)
		const flingPowers: Record<string, number> = {
			'leftovers': 10, 'oranberry': 10, 'berryjuice': 10,
			'sitrusberry': 10, 'lumberry': 10, 'focussash': 10,
			'choiceband': 10, 'choicescarf': 10, 'choicespecs': 10,
			'lifeorb': 30, 'rockyhelmet': 60, 'assaultvest': 80,
			'ironball': 130,
		};
		const damage = flingPowers[attacker.item] || 30;
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} flung its ${ITEMS_DATABASE[attacker.item].name} and dealt ${damage} damage!`);
		attacker.item = undefined;
		return;
	}

	// Handle Nature Gift (type and power based on berry)
	if (move.id === 'naturalgift') {
		if (!attacker.item?.includes('berry')) {
			messageLog.push(`But it failed!`);
			return;
		}

		// Nature Gift power is based on berry (simplified to 80)
		const damage = 80;
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} used its ${ITEMS_DATABASE[attacker.item].name} and dealt ${damage} damage!`);
		attacker.item = undefined;
		return;
	}

	// Handle One-Hit KO moves
	if (move.ohko) {
		// Check level immunity
		if (defender.level > attacker.level) {
			messageLog.push(`But it failed!`);
			return;
		}

		// Check type immunity (e.g., Ghost immune to Normal OHKO)
		const defenderSpecies = Dex.species.get(defender.species);
		if (move.ohko === 'Normal' && defenderSpecies.types.includes('Ghost')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}
		if (move.ohko === 'Ice' && defenderSpecies.types.includes('Ice')) {
			messageLog.push(`But it failed!`);
			return;
		}

		const accuracy = 30 + attacker.level - defender.level;
		if (Math.random() * 100 < accuracy) {
			defender.hp = 0;
			messageLog.push(`<i style="color: #dc3545;">It's a one-hit KO!</i>`);
		} else {
			messageLog.push(`${attacker.species}'s attack missed!`);
		}
		return;
	}

	let moveWasSuccessful = false; // Flag to check if the move hit for self-destruct
	let hitCount = 1;
	if (move.multihit) {
		if (typeof move.multihit === 'number') {
			hitCount = move.multihit;
		} else {
			const rand = Math.random() * 8;
			if (rand < 3) hitCount = 2;
			else if (rand < 6) hitCount = 3;
			else if (rand < 7) hitCount = 4;
			else hitCount = 5;
		}
	}

	const attackerStages = attackerSlot.statStages;
	const defenderStages = defenderSlot.statStages;

	if (hitCount > 1) {
		// Ensure messageLog is not empty before trying to access last element
		if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += ` <i style="color: #6c757d;">(It hit ${hitCount} times!)</i>`;
		} else {
			messageLog.push(`<i style="color: #6c757d;">(It hit ${hitCount} times!)</i>`);
		}
	}

	for (let i = 0; i < hitCount; i++) {
		const attackResult = calculateDamage(attackerSlot, defenderSlot, move.id, battle, spreadMultiplier);

		if (attackResult.effectiveness > 0) {
			moveWasSuccessful = true;
		}

		if (attackResult.berryConsumed) {
			const itemName = ITEMS_DATABASE[attackResult.berryConsumed]?.name;
			if (attackResult.berryConsumed === 'enigmaberry') {
				// Special message handled by HP check
			} else if (TYPE_RESIST_BERRIES[attackResult.berryConsumed]) {
				messageLog.push(`${defender.species}'s ${itemName} weakened the attack!`);
			} else {
				messageLog.push(`${defender.species}'s ${itemName} activated!`);
			}
			defender.item = undefined;
		}

		let damageDealt = attackResult.damage;

		if (battle.magicRoomTurns === 0 && defender.item === 'airballoon' && move.type === 'Ground') {
			messageLog.push(`<i style="color: #6c757d;">The Air Balloon made the attack miss!</i>`);
			continue;
		}

		// Handle Substitute - takes damage instead of the Pokemon
		if (defenderSlot.substitute && damageDealt > 0 && !move.flags.bypasssub) {
			const subHP = defenderSlot.substitute.hp;
			if (damageDealt >= subHP) {
				damageDealt -= subHP;
				defenderSlot.substitute = undefined;
				messageLog.push(`The substitute took the hit and broke!`);
				// If there's remaining damage, it doesn't carry over in most cases
				damageDealt = 0;
			} else {
				defenderSlot.substitute.hp -= damageDealt;
				messageLog.push(`The substitute took the hit!`);
				damageDealt = 0;
			}
		}

		if (battle.magicRoomTurns === 0 && defender.item === 'focussash' && defender.hp === defender.maxHp && damageDealt >= defender.hp) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Focus Sash!`);
			defender.item = undefined;
		}

		defender.hp = Math.max(0, defender.hp - damageDealt);

		// Track damage for Counter/Mirror Coat
		if (damageDealt > 0 && move.category !== 'Status') {
			defenderSlot.lastDamageTaken = {
				amount: damageDealt,
				category: move.category,
				from: attacker.id,
			};
		}

		if (hitCount > 1) {
			messageLog.push(`Dealt ${damageDealt} damage!` + attackResult.message);
		} else {
			if (messageLog.length > 0) {
				messageLog[messageLog.length - 1] += attackResult.message;
			} else {
				messageLog.push(attackResult.message); // Should not happen, but a safe fallback
			}
		}

		if (battle.magicRoomTurns === 0 && defender.hp > 0 && defender.item === 'enigmaberry' && attackResult.effectiveness > 1) {
			const healAmount = Math.floor(defender.maxHp / 4); // Gen 4+ Enigma Berry heals 1/4
			const oldHp = defender.hp;
			defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
			messageLog.push(`${defender.species} ate its Enigma Berry and restored ${defender.hp - oldHp} HP!`);
			defender.item = undefined;
		}

		if (battle.magicRoomTurns === 0 && defender.hp > 0 && defender.item === 'airballoon' &&
			damageDealt > 0 && move.category !== 'Status') {
			messageLog.push(`${defender.species}'s Air Balloon popped!`);
			defender.item = undefined;
		}

		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			// Drain moves - blocked by Heal Block
			if (move.drain && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns > 0) {
					messageLog.push(`${attacker.species} can't restore HP due to Heal Block!`);
				} else {
					const drainAmount = Math.max(1, Math.floor(damageDealt * (move.drain[0] / move.drain[1])));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + drainAmount);
					messageLog.push(`${defender.species} had its energy drained!`);
				}
			}

			// Shell Bell - blocked by Heal Block
			if (battle.magicRoomTurns === 0 && attacker.item === 'shellbell' && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns > 0) {
					// Heal Block prevents Shell Bell healing
				} else {
					const healAmount = Math.max(1, Math.floor(damageDealt / 8)); // Shell Bell is 1/8 damage dealt
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
					messageLog.push(`${attacker.species} restored some HP using its Shell Bell!`);
				}
			}

			if (defender.hp > 0 && battle.magicRoomTurns === 0) {
				if (move.category === 'Physical' && defender.item === 'keberry' && defenderStages.def < 6) {
					defenderStages.def++;
					messageLog.push(`${defender.species} ate its Kee Berry to raise its Defense!`);
					defender.item = undefined;
				} else if (move.category === 'Special' && defender.item === 'marangaberry' && defenderStages.spd < 6) {
					defenderStages.spd++;
					messageLog.push(`${defender.species} ate its Maranga Berry to raise its Sp. Def!`);
					defender.item = undefined;
				}

				if (move.flags.contact) {
					if (defender.item === 'rockyhelmet') {
						attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 6));
						messageLog.push(`${attacker.species} was hurt by the Rocky Helmet!`);
					}
					if (defender.item === 'jabocaberry') {
						attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
						messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Jaboca Berry!`);
						defender.item = undefined;
					}
				}

				if (move.category === 'Special' && defender.item === 'rowapberry') {
					attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
					messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Rowap Berry!`);
					defender.item = undefined;
				}
			}

			if (defender.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'weaknesspolicy' && attackResult.effectiveness > 1) {
				let activated = false;
				if (defenderStages.atk < 6) {
					defenderStages.atk = Math.min(6, defenderStages.atk + 2);
					activated = true;
				}
				if (defenderStages.spa < 6) {
					defenderStages.spa = Math.min(6, defenderStages.spa + 2);
					activated = true;
				}
				if (activated) {
					messageLog.push(`${defender.species}'s Weakness Policy sharply boosted its Attack and Sp. Attack!`);
					defender.item = undefined;
				}
			}

			handleHPDropEffects(defenderSlot, battle, messageLog);
			handleHPDropEffects(attackerSlot, battle, messageLog);

			if (attacker.hp > 0) {
				let tookRecoil = false;

				if (['mindblown', 'steelbeam'].includes(move.id)) {
					const recoilDamage = Math.floor(attacker.maxHp / 2);
					attacker.hp = Math.max(0, attacker.hp - recoilDamage);
					messageLog.push(`${attacker.species} was damaged by the move's recoil!`);
					tookRecoil = true;
				}

				if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
					attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 10));
					messageLog.push(`${attacker.species} was hurt by its Life Orb!`);
					tookRecoil = true;
				}
				if (move.id === 'struggle') {
					const recoilDamage = Math.max(1, Math.floor(attacker.maxHp / 4));
					attacker.hp = Math.max(0, attacker.hp - recoilDamage);
					messageLog.push(`${attacker.species} was damaged by recoil!`);
					tookRecoil = true;
				} else if (move.recoil) {
					const recoilDamage = Math.max(1, Math.floor(damageDealt * (move.recoil[0] / move.recoil[1])));
					attacker.hp = Math.max(0, attacker.hp - recoilDamage);
					messageLog.push(`${attacker.species} was damaged by recoil!`);
					tookRecoil = true;
				}
				if (tookRecoil) {
					handleHPDropEffects(attackerSlot, battle, messageLog);
				}
			}

			if (attacker.hp > 0 && move.self?.boosts) {
				const boosts = move.self.boosts;
				for (const stat in boosts) {
					const boostValue = boosts[stat as keyof typeof boosts]!;
					if (attackerStages[stat as keyof typeof attackerStages] > -6 && boostValue < 0) {
						attackerStages[stat as keyof typeof attackerStages] = Math.max(-6, attackerStages[stat as keyof typeof attackerStages] + boostValue);
						messageLog.push(`<span style="color: #d9534f;">${attacker.species}'s ${stat.toUpperCase()} fell!</span>`);
					}
				}
			}

			if (defender.hp > 0) {
				if (battle.magicRoomTurns === 0 && defender.item === 'covertcloak') {
					// Covert Cloak blocks secondary effects
				} else if (move.secondary) {
					let chance = move.secondary.chance || 100;
					if (attacker.ability === 'Serene Grace') {
						chance *= 2;
					}

					if (Math.random() * 100 < chance) {
						if (move.id === 'triattack' && move.secondary.status) {
							const statuses = ['brn', 'par', 'frz'] as Status[];
							const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
							const defenderCurrentStatus = defenderSlot.status;
							const defenderSpecies = Dex.species.get(defender.species);
							let canBeAfflicted = !defenderCurrentStatus;

							if ((randomStatus === 'brn' && defenderSpecies.types.includes('Fire')) ||
								(randomStatus === 'par' && defenderSpecies.types.includes('Electric')) ||
								(randomStatus === 'frz' && defenderSpecies.types.includes('Ice'))) {
								canBeAfflicted = false;
							}

							if (canBeAfflicted) {
								defenderSlot.status = randomStatus;
								messageLog.push(`${defender.species} was afflicted with ${randomStatus}!`);
							}
						} else if (move.secondary.status) {
							const defenderCurrentStatus = defenderSlot.status;
							const defenderSpecies = Dex.species.get(defender.species);
							let canBeAfflicted = !defenderCurrentStatus;
							const newStatus = move.secondary.status as Status;
							if ((newStatus === 'brn' && defenderSpecies.types.includes('Fire')) || (newStatus === 'par' && defenderSpecies.types.includes('Electric')) || (newStatus === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel'))) || (newStatus === 'frz' && defenderSpecies.types.includes('Ice'))) {
								canBeAfflicted = false;
							}
							if (canBeAfflicted) {
								defenderSlot.status = newStatus;
								if (newStatus === 'slp') defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
								messageLog.push(`${defender.species} was afflicted with ${newStatus}!`);
							}
						}

						if (move.secondary.volatileStatus) {
							switch (move.secondary.volatileStatus) {
							case 'flinch':
								defenderSlot.willFlinch = true;
								break;
							case 'confusion':
								if (!defenderSlot.isConfused) {
									defenderSlot.isConfused = true;
									defenderSlot.confusionCounter = Math.floor(Math.random() * 3) + 2;
									messageLog.push(`${defender.species} became confused!`);
								}
								break;
							}
						}

						if (move.secondary.boosts) {
							if (battle.magicRoomTurns === 0 && defender.item === 'clearamulet' && Object.values(move.secondary.boosts).some(v => v < 0)) {
								messageLog.push(`${defender.species}'s Clear Amulet prevents its stats from being lowered!`);
							} else {
								for (const stat in move.secondary.boosts) {
									const stage = defenderStages[stat as keyof typeof defenderStages];
									const boostValue = move.secondary.boosts[stat as keyof typeof move.secondary.boosts]!;
									if ((stage < 6 && boostValue > 0) || (stage > -6 && boostValue < 0)) {
										defenderStages[stat as keyof typeof defenderStages] = Math.max(-6, Math.min(6, stage + boostValue));
										messageLog.push(`${defender.species}'s ${stat.toUpperCase()} ${boostValue > 0 ? 'rose' : 'fell'}!`);
									}
								}
							}
						}
					}
				}
			}
		}

		if (defender.hp <= 0) break;
		if (attacker.hp <= 0) break;
	}

	// --- Post-damage Item Manipulation Effects ---
	if (defender.hp > 0 && battle.magicRoomTurns === 0) {
		if (move.id === 'knockoff' && defender.item && defender.ability !== 'Sticky Hold') {
			const removedItem = ITEMS_DATABASE[defender.item];
			messageLog.push(`${attacker.species} knocked off ${defender.species}'s ${removedItem.name}!`);
			defender.item = undefined;
		}
		if (['thief', 'covet'].includes(move.id) && defender.item && !attacker.item && defender.ability !== 'Sticky Hold') {
			const stolenItem = ITEMS_DATABASE[defender.item];
			attacker.item = defender.item;
			defender.item = undefined;
			messageLog.push(`${attacker.species} stole ${defender.species}'s ${stolenItem.name}!`);
		}
	}

	// --- Post-damage Hazard/Trap Removal & Stat Boosts ---
	if (attacker.hp > 0 && move.id === 'rapidspin') {
		let clearedSomething = false;
		const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);

		if (isPlayerAttacker) {
			if (battle.playerHazards.length > 0) { battle.playerHazards = []; clearedSomething = true; }
			if (attackerSlot.isSeeded) { attackerSlot.isSeeded = false; clearedSomething = true; }
			if (attackerSlot.isTrapped) { attackerSlot.isTrapped = null; clearedSomething = true; }
		} else { // Opponent is attacker
			if (battle.opponentHazards.length > 0) { battle.opponentHazards = []; clearedSomething = true; }
			if (attackerSlot.isSeeded) { attackerSlot.isSeeded = false; clearedSomething = true; }
			if (attackerSlot.isTrapped) { attackerSlot.isTrapped = null; clearedSomething = true; }
		}
		if (clearedSomething) messageLog.push(`${attacker.species} cleared away hazards and traps!`);

		if (attackerStages.spe < 6) {
			attackerStages.spe++;
			messageLog.push(`${attacker.species}'s Speed rose!`);
		}
	}

	// --- Trapping Move Application ---
	if (defender.hp > 0 && move.volatileStatus === 'partiallytrapped') {
		if (!defenderSlot.isTrapped) {
			const turns = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6 turns
			defenderSlot.isTrapped = { turns };
			messageLog.push(`${defender.species} was trapped!`);
		}
	}

	// Handle Feint breaking protection after all hits
	if (move.id === 'feint') {
		if (defenderSlot.isProtected) {
			defenderSlot.isProtected = false;
			messageLog.push(`${defender.species}'s protection was broken!`);
		}
	}

	// FIX #1: U-Turn / Volt Switch / Flip Turn - handle switch after damage
	if (attacker.hp > 0 && defender.hp > 0 && (move.selfSwitch === true || move.selfSwitch === 'copyvolatile')) {
		// This is now handled by executeAction after this function returns
		// We set battle.playerShouldSwitch or battle.aiPendingPivot there
	}

	if (defender.hp > 0) {
		if (['dragontail', 'circlethrow'].includes(move.id)) {
			// --- MODIFIED ---
			if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
				messageLog.push(`The wild ${defender.species} was dragged away!`);
				// Find and remove the slot
				const oppSlotIndex = battle.opponentSlots.indexOf(defenderSlot);
				if (oppSlotIndex !== -1) {
					battle.opponentSlots[oppSlotIndex as 0 | 1] = null;
				}
			} else {
				messageLog.push(`But it failed!`); // Can't force switch a trainer
			}
		}
	}

	// --- Self-Destruct Fainting (after all hits) ---
	if (move.selfdestruct === 'always' && attacker.hp > 0) {
		messageLog.push(`${attacker.species} fainted!`);
		attacker.hp = 0;
	}
}

export function handleHPDropEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	// **NEW:** Magic Room disables all held items.
	if (battle.magicRoomTurns > 0) return;

	const pokemon = slot.pokemon;

	// No effect if fainted, no item, or if an item was already consumed this turn (prevents multiple berries activating)
	if (pokemon.hp <= 0 || !pokemon.item) return;

	let itemConsumed = false;
	let consumedItemName = '';
	const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);

	// **FIXED HP THRESHOLDS:** Check both 50% and 25% thresholds in one pass
	const halfHP = pokemon.maxHp / 2;
	const quarterHP = pokemon.maxHp / 4;

	// Priority 1: 50% HP healing items (FIXED: Sitrus Berry now activates at 1/2 HP)
	if (pokemon.hp <= halfHP && !itemConsumed) {
		let healAmount = 0;
		if (pokemon.item === 'berryjuice') {
			healAmount = 20;
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} drank its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'oranberry') {
			healAmount = 10;
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'goldberry') {
			healAmount = 30;
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'sitrusberry') {
			// FIXED: Sitrus Berry now activates at 1/2 HP and heals 1/4 max HP
			healAmount = Math.floor(pokemon.maxHp / 4);
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		}

		if (healAmount > 0) {
			const oldHp = pokemon.hp;
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
		}
	}

	// Priority 2: 25% HP items (only if no item consumed yet)
	if (!itemConsumed && pokemon.hp <= quarterHP) {
		const pinchBerryHP = ['figyberry', 'wikiberry', 'magoberry', 'aguavberry', 'iapapaberry'];
		const pinchBerryStat: Record<string, keyof Omit<Stats, 'maxHp'>> = {
			'liechiberry': 'atk', 'ganlonberry': 'def', 'salacberry': 'spe',
			'petayaberry': 'spa', 'apicotberry': 'spd',
		};

		if (pinchBerryHP.includes(pokemon.item)) {
			const oldHp = pokemon.hp;
			// FIXED: Now heals 1/2 max HP instead of 1/3
			const healAmount = Math.floor(pokemon.maxHp / 2);
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${pokemon.hp - oldHp} HP!`);

			// Check for confusion based on nature
			const berryData = BERRY_FLAVORS[pokemon.item];
			const natureData = NATURES[pokemon.nature];
			if (natureData && berryData) {
				// Pokemon becomes confused if the berry's flavor matches what the nature dislikes
				const dislikedFlavor = natureData.minus ? NATURE_FLAVOR_PREFERENCES[natureData.minus] : null;
				if (dislikedFlavor && berryData.flavor === dislikedFlavor) {
					if (!slot.isConfused) {
						slot.isConfused = true;
						slot.confusionCounter = Math.floor(Math.random() * 3) + 2; // 2-4 turns
						messageLog.push(`${pokemon.species} became confused due to the berry's flavor!`);
					}
				}
			}
			itemConsumed = true;
		} else if (pokemon.item in pinchBerryStat) {
			const statToBoost = pinchBerryStat[pokemon.item];
			const targetStages = slot.statStages;
			if (targetStages[statToBoost] < 6) {
				// FIXED: All stat-boosting berries now boost by exactly 1 stage
				targetStages[statToBoost]++;
				consumedItemName = ITEMS_DATABASE[pokemon.item].name;
				messageLog.push(`${pokemon.species} ate its ${consumedItemName} to boost its ${statToBoost.toUpperCase()}!`);
				itemConsumed = true;
			}
		} else if (pokemon.item === 'starfberry') {
			const targetStages = slot.statStages;
			const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;
			const availableStats = stats.filter(stat => targetStages[stat] < 6);

			if (availableStats.length > 0) {
				const randomStat = availableStats[Math.floor(Math.random() * availableStats.length)];
				targetStages[randomStat] += 2; // Starf Berry boosts by 2 stages (this was correct)
				targetStages[randomStat] = Math.min(6, targetStages[randomStat]); // Cap at +6
				consumedItemName = ITEMS_DATABASE[pokemon.item].name;
				messageLog.push(`${pokemon.species} ate its ${consumedItemName} to sharply boost its ${randomStat.toUpperCase()}!`);
				itemConsumed = true;
			}
		}
	}

	// If an item was used, remove it from the Pokemon
	if (itemConsumed) {
		pokemon.item = undefined;
	}
}

/**
 * Processes end-of-turn effects for weather, such as damage and duration.
 */
export function handleEndOfTurnWeather(battle: BattleState, messageLog: string[]) {
	if (!battle.weather) return;

	// Decrement weather timer
	battle.weather.turns--;

	const weatherMessages = {
		'sun': 'The sunlight is harsh.',
		'rain': 'Rain continues to fall.',
		'sand': 'The sandstorm rages.',
		'hail': 'The hail crashes down.',
	};
	messageLog.push(weatherMessages[battle.weather.type]);

	// Apply weather damage if applicable
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	for (const slot of allSlots) {
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0) continue;
		const species = Dex.species.get(pokemon.species);
		let takeDamage = false;

		if (battle.weather.type === 'sand' && !species.types.includes('Rock') && !species.types.includes('Ground') && !species.types.includes('Steel')) {
			takeDamage = true;
		} else if (battle.weather.type === 'hail' && !species.types.includes('Ice')) {
			takeDamage = true;
		}

		if (takeDamage) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is buffeted by the weather!`);
		}
	}

	// Check if weather has ended
	if (battle.weather.turns <= 0) {
		const weatherEndMessages = {
			'sun': 'The sunlight faded.',
			'rain': 'The rain stopped.',
			'sand': 'The sandstorm subsided.',
			'hail': 'The hail stopped.',
		};
		messageLog.push(weatherEndMessages[battle.weather.type]);
		battle.weather = undefined;
	}
}

/**
 * Checks if a Pokémon is grounded and affected by terrain.
 */
export function isGrounded(pokemon: RPGPokemon, battle: BattleState): boolean {
	// Gravity grounds all Pokémon, overriding other immunities.
	if (battle.gravityTurns > 0) {
		return true;
	}
	const species = Dex.species.get(pokemon.species);
	// Air Balloon effect is disabled in Magic Room, so we can't check for it here
	// The Magic Room check should be done in the calling function
	return !species.types.includes('Flying') && pokemon.ability !== 'Levitate';
}

/**
 * Checks if a Pokemon's held item is usable (not suppressed by Magic Room or Embargo)
 * @param slot The Pokemon slot to check
 * @param battle The battle state
 * @returns true if items can be used, false if suppressed
 */
export function canUseItem(slot: ActivePokemonSlot, battle: BattleState): boolean {
	// Magic Room suppresses all items
	if (battle.magicRoomTurns > 0) return false;
	// Embargo suppresses this Pokemon's item specifically
	if (slot.embargoTurns > 0) return false;
	return true;
}

/**
 * Processes end-of-turn effects for all field conditions (Rooms, Terrains).
 */
export function handleEndOfTurnFieldEffects(battle: BattleState, messageLog: string[]) {
	// Handle Terrain
	if (battle.terrain) {
		if (battle.terrain.type === 'grassy') {
			const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);
			for (const slot of allSlots) {
				const pokemon = slot.pokemon;
				if (pokemon.hp > 0 && pokemon.hp < pokemon.maxHp && isGrounded(pokemon, battle)) {
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

	// Handle Screens
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

	// Handle Trick Room
	if (battle.trickRoomTurns > 0) {
		battle.trickRoomTurns--;
		if (battle.trickRoomTurns <= 0) {
			messageLog.push('The twisted dimensions returned to normal.');
		}
	}

	// Handle Magic Room
	if (battle.magicRoomTurns > 0) {
		battle.magicRoomTurns--;
		if (battle.magicRoomTurns <= 0) {
			messageLog.push('The bizarre dimensions disappeared. Held items are effective again.');
		}
	}

	// Handle Wonder Room
	if (battle.wonderRoomTurns > 0) {
		battle.wonderRoomTurns--;
		if (battle.wonderRoomTurns <= 0) {
			messageLog.push('The bizarre dimensions disappeared. Defense and Sp. Def stats returned to normal.');
		}
	}

	// Handle Gravity
	if (battle.gravityTurns > 0) {
		battle.gravityTurns--;
		if (battle.gravityTurns <= 0) {
			messageLog.push('The gravity returned to normal.');
		}
	}

	// Handle Mud Sport
	if (battle.mudSportTurns > 0) {
		battle.mudSportTurns--;
		if (battle.mudSportTurns <= 0) {
			messageLog.push('The effects of Mud Sport wore off.');
		}
	}

	// Handle Water Sport
	if (battle.waterSportTurns > 0) {
		battle.waterSportTurns--;
		if (battle.waterSportTurns <= 0) {
			messageLog.push('The effects of Water Sport wore off.');
		}
	}
}

/***********************
* MAIN UNIFICATION
************************/
/**
 * Executes a single move for a single Pokémon during a battle turn.
 * This unified function handles all turn logic, including pre-turn checks,
 * accuracy, move execution, and post-turn effects.
 */
export function executeMove(
	attackerSlot: ActivePokemonSlot,
	targetSlots: ActivePokemonSlot[],
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[]
): void {
	// Track last move used (for Disable, Torment, etc.)
	attackerSlot.lastMoveUsed = move.id;

	// Reset protect counter if a different move is used
	if (!['protect', 'detect'].includes(move.id)) {
		attackerSlot.protectSuccessCounter = 0;
	}

	// --- Calculate Spread Multiplier ---
	const isSpread = ['allAdjacentFoes', 'allAdjacent', 'scripted'].includes(move.target);
	const validTargetCount = targetSlots.filter(s => s.pokemon.hp > 0).length;
	const spreadMultiplier = (isSpread && validTargetCount > 1) ? 0.75 : 1.0;

	for (const defenderSlot of targetSlots) {
		if (attackerSlot.pokemon.hp <= 0) break; // Attacker fainted mid-move (e.g. from ally recoil)
		if (defenderSlot.pokemon.hp <= 0) continue; // Target fainted mid-move (e.g. from first hit of spread)

		// --- NEW: WIDE GUARD CHECK ---
		const isPlayerDefender = battle.playerSlots.includes(defenderSlot);

		if (isSpread) {
			if (isPlayerDefender && battle.playerWideGuard) {
				messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`);
				continue; // Fails against this target
			}
			if (!isPlayerDefender && battle.opponentWideGuard) {
				messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`);
				continue; // Fails against this target
			}
		}
		// --- END WIDE GUARD CHECK ---

		// 2. Check for Protection (Struggle bypasses this)
		if (move.id !== 'struggle') {
			if (defenderSlot.isProtected && move.flags.protect && !move.breaksProtect) {
				messageLog.push(`<span style="color: #6c757d;">${defenderSlot.pokemon.species} protected itself!</span>`);
				continue; // Move fails against this target
			}
		}

		// 6. Accuracy Check
		let moveHit = true;
		if (['aerialace'].includes(move.id)) {
			// Bypasses accuracy
		} else if (move.accuracy !== true) {
			const accuracyMultiplier = getAccuracyEvasionMultiplier(attackerSlot.statStages.accuracy);
			const evasionMultiplier = getAccuracyEvasionMultiplier(defenderSlot.statStages.evasion);
			let moveAccuracy = move.accuracy;
			// ... (Weather accuracy logic) ...
			if (battle.weather) {
				if (battle.weather.type === 'rain') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 100;
				} else if (battle.weather.type === 'sun') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 50;
				}
				if (battle.weather.type === 'hail' && move.id === 'blizzard') {
					moveAccuracy = 100;
				}
			}

			// Gravity increases accuracy by 5/3 (approx 1.67x)
			if (battle.gravityTurns > 0) {
				moveAccuracy = Math.floor(moveAccuracy * (5 / 3));
			}

			const finalAccuracy = moveAccuracy * (accuracyMultiplier / evasionMultiplier);
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
			continue; // Move missed this target
		}

		// 7. Execute the Move
		if (move.id === 'struggle') {
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, 1.0); // Struggle doesn't spread
		} else if (move.category === 'Status') {
			handleStatusMove(attackerSlot, defenderSlot, move, battle, messageLog);
		} else {
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, spreadMultiplier);
		}
	}
}

/**
 * Checks the HP of all active Pokémon and handles the outcome of a faint.
 * This can result in a win, a loss, or a prompt to switch Pokémon.
 * @returns {boolean} Returns `true` if the battle ended or was interrupted (awaiting a switch), `false` if it continues.
 */
export function checkBattleEndCondition(
	context: CommandContext,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
): boolean {
	const player = getPlayerData(user.id);

	// --- 1. Check for Fainted Opponents ---
	let opponentFainted = false;
	const playerParticipants = getActiveSlots(battle.playerSlots);

	for (let i = 0; i < battle.opponentSlots.length; i++) {
		const slot = battle.opponentSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			opponentFainted = true;
			messageLog.push(`**The opposing ${slot.pokemon.species} fainted!**`);

			// Grant EXP to all active player Pokemon
			if (playerParticipants.length > 0) {
				const expResult = gainExperience(player, playerParticipants, slot.pokemon, room, user);
				messageLog.push(...expResult.messages);
			}

			// Find a replacement from the trainer's party
			const nextOpponent = battle.opponentParty.find(p =>
				p.hp > 0 &&
				!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
			);

			if (nextOpponent) {
				messageLog.push(`**${battle.opponentName} is about to send in ${nextOpponent.species}!**`);
				const newSlot = createActivePokemonSlot(nextOpponent);
				battle.opponentSlots[i as 0 | 1] = newSlot;

				// Apply hazards on switch-in
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
					// This will be caught in the next loop of the turn or next check
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}
			} else {
				// No replacement found, set slot to null
				battle.opponentSlots[i as 0 | 1] = null;
			}
		}
	}

	// --- 2. Check for Fainted Player Pokemon ---
	let playerFaintSwitchNeeded = false;
	for (let i = 0; i < battle.playerSlots.length; i++) {
		const slot = battle.playerSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			messageLog.push(`**Your ${slot.pokemon.species} fainted!**`);
			battle.playerSlots[i as 0 | 1] = null; // Set slot to null
			playerFaintSwitchNeeded = true;
		}
	}

	// --- 3. Check for Win/Loss/Interrupt Conditions ---

	// A. Check for Player Loss (No Pokemon left in party or field)
	const playerHasLivingPokemon = player.party.some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);
	const playerHasActivePokemon = getActiveSlots(battle.playerSlots).length > 0;

	if (!playerHasActivePokemon && !playerHasLivingPokemon) {
		// PLAYER LOSES
		saveBattleStatus(battle);
		activeBattles.delete(user.id);

		let moneyLost = 100;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyLost = Math.floor(battle.opponentMoney / 10) || 200;
		}
		moneyLost = Math.min(player.money, moneyLost);
		player.money -= moneyLost;

		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateDefeatHTML(moneyLost, battle.opponentName)}`);
		return true; // Battle ended
	}

	// B. Check for Player Win (No Opponent Pokemon left in party or field)
	const opponentHasLivingPokemon = battle.opponentParty.some(p =>
		p.hp > 0 &&
		!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
	);
	const opponentHasActivePokemon = getActiveSlots(battle.opponentSlots).length > 0;

	if (!opponentHasActivePokemon && !opponentHasLivingPokemon) {
		// PLAYER WINS
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
			// Wild battle win
			moneyGained = Math.floor(battle.opponentParty.reduce((sum, p) => sum + p.level, 0) * 5); // Average level * 10
			player.money += moneyGained;
			if (player.pendingMoveLearnQueue?.moveIds.length) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				const defeatedNames = battle.opponentParty.map(p => p.species).join(' and ');
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateVictoryHTML(defeatedNames, messageLog, moneyGained, battle.zoneId)}`);
			}
		}
		return true; // Battle ended
	}

	// C. Check for Player Pivot Switch (U-turn, etc.)
	if (battle.pendingPivot) {
		// Battle is interrupted, player must switch.
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePivotSwitchHTML(battle, messageLog.join('<br>'), battle.pendingPivot.slotIndex)}`);
		return true; // Battle interrupted
	}

	// D. Check for AI Pivot Switch
	if (battle.aiPendingPivot) {
		const nextOpponent = battle.opponentParty.find(p =>
			p.hp > 0 &&
			!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
		);
		const slotIndex = battle.aiPendingPivot.slotIndex;

		if (nextOpponent) {
			messageLog.push(`**${battle.opponentName} withdrew ${battle.aiPendingPivot.slot.pokemon.species}!**`);
			messageLog.push(`**${battle.opponentName} sent out ${nextOpponent.species}!**`);

			const newSlot = createActivePokemonSlot(nextOpponent);

			// Handle Baton Pass
			if (battle.aiPendingPivot.isBatonPass) {
				newSlot.statStages = { ...battle.aiPendingPivot.slot.statStages };
				newSlot.isConfused = battle.aiPendingPivot.slot.isConfused;
				newSlot.confusionCounter = battle.aiPendingPivot.slot.confusionCounter;
				newSlot.isSeeded = battle.aiPendingPivot.slot.isSeeded;
				messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
			}

			battle.opponentSlots[slotIndex as 2 | 3] = newSlot;

			// Apply hazards on switch-in
			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
			if (faintedOnEntry) {
				messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
				// Will be caught by the faint check at the start of the next turn
			} else {
				handleMirrorHerb(newSlot, battle, messageLog);
			}
		} else {
			// No replacement found, pivot fails, Pokemon stays in
			battle.opponentSlots[slotIndex as 2 | 3] = battle.aiPendingPivot.slot;
			messageLog.push(`${battle.aiPendingPivot.slot.pokemon.species} had no one to switch to!`);
		}
		battle.aiPendingPivot = undefined; // Clear flag
	}

	// E. Check for Player Faint Switch-In Needed
	if (playerFaintSwitchNeeded && playerHasLivingPokemon) {
		// Battle is interrupted, player must switch.
		// We'll just show the first available slot to fill.
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
		return true; // Battle interrupted
	}

	// If no one has fainted or all faints were handled, the battle continues.
	return false;
}

/**
 * Processes all end-of-turn effects, such as status damage,
 * weather, and field conditions, for both Pokémon.
 */
export function processEndOfTurn(battle: BattleState, messageLog: string[]) {
	// Get all active slots before effects start
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	// --- Process Future Sight / Doom Desire attacks ---
	// Process player's future moves (hitting opponents)
	battle.playerFutureMoves = battle.playerFutureMoves.filter(fm => {
		fm.turnsLeft--;
		if (fm.turnsLeft === 0) {
			// Execute the future move
			const targetSlot = battle.opponentSlots[fm.slotIndex];
			if (targetSlot && targetSlot.pokemon.hp > 0) {
				const moveName = fm.moveId === 'futuresight' ? 'Future Sight' : 'Doom Desire';
				messageLog.push(`<strong>${moveName}</strong> took effect!`);

				// Calculate damage using stored stats
				const move = getMove(fm.moveId);
				const basePower = move.basePower || 120;
				const moveType = move.type;

				// Get defender's current stats
				const defender = targetSlot.pokemon;
				const defenderSpecies = Dex.species.get(defender.species);
				const defenderDef = defender.spd * getStatMultiplier(targetSlot.statStages.spd);

				// Calculate damage
				const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
				const baseDamage = Math.floor((2 * 50 / 5 + 2) * basePower * (fm.attackerStats.spa / defenderDef) / 50) + 2;
				const damage = Math.floor(baseDamage * effectiveness);

				// Apply damage
				targetSlot.pokemon.hp = Math.max(0, targetSlot.pokemon.hp - damage);
				messageLog.push(`${defender.species} took ${damage} damage!`);

				if (effectiveness > 1) messageLog.push(`It's super effective!`);
				else if (effectiveness < 1 && effectiveness > 0) messageLog.push(`It's not very effective...`);
			}
			return false; // Remove this future move from the array
		}
		return true; // Keep this future move
	});

	// Process opponent's future moves (hitting player)
	battle.opponentFutureMoves = battle.opponentFutureMoves.filter(fm => {
		fm.turnsLeft--;
		if (fm.turnsLeft === 0) {
			// Execute the future move
			const targetSlot = battle.playerSlots[fm.slotIndex];
			if (targetSlot && targetSlot.pokemon.hp > 0) {
				const moveName = fm.moveId === 'futuresight' ? 'Future Sight' : 'Doom Desire';
				messageLog.push(`<strong>${moveName}</strong> took effect!`);

				// Calculate damage using stored stats
				const move = getMove(fm.moveId);
				const basePower = move.basePower || 120;
				const moveType = move.type;

				// Get defender's current stats
				const defender = targetSlot.pokemon;
				const defenderSpecies = Dex.species.get(defender.species);
				const defenderDef = defender.spd * getStatMultiplier(targetSlot.statStages.spd);

				// Calculate damage
				const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
				const baseDamage = Math.floor((2 * 50 / 5 + 2) * basePower * (fm.attackerStats.spa / defenderDef) / 50) + 2;
				const damage = Math.floor(baseDamage * effectiveness);

				// Apply damage
				targetSlot.pokemon.hp = Math.max(0, targetSlot.pokemon.hp - damage);
				messageLog.push(`${defender.species} took ${damage} damage!`);

				if (effectiveness > 1) messageLog.push(`It's super effective!`);
				else if (effectiveness < 1 && effectiveness > 0) messageLog.push(`It's not very effective...`);
			}
			return false; // Remove this future move from the array
		}
		return true; // Keep this future move
	});

	// Reset flinch status for all active slots
	for (const slot of allSlots) {
		slot.willFlinch = false;
	}

	// Handle effects that apply to each Pokémon individually (status, items)
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) {
			handleEndOfTurnEffects(slot, battle, messageLog);
		}
	}

	// Handle effects that apply to the whole field (weather, terrain, rooms)
	handleEndOfTurnWeather(battle, messageLog);
	handleEndOfTurnFieldEffects(battle, messageLog);
}

/****************
* Core Functions
****************/
/**
 * Applies a healing item to a Pokémon and handles all logic.
 * @returns An object with the result of the action.
 */

export function useHealingItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData || (itemData.category !== 'medicine' && itemId !== 'berryjuice')) {
		return { success: false, message: `This item cannot be used to heal.` };
	}

	// Handle status-only healing items first
	if (itemId === 'healpowder') {
		if (!pokemon.status) {
			return { success: false, message: `${pokemon.species} is not affected by any status condition.` };
		}
		pokemon.status = null;
		removeItemFromInventory(player, itemId, 1);
		return { success: true, message: `You used <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! Its status condition was healed.` };
	}

	// Handle HP restoration items
	if (pokemon.hp >= pokemon.maxHp) {
		return { success: false, message: `${pokemon.species} is already at full health!` };
	}

	let healAmount = 0;
	switch (itemId) {
	case 'potion':
		healAmount = 20;
		break;
	case 'superpotion':
		healAmount = 60;
		break;
	case 'hyperpotion':
		healAmount = 120;
		break;
	case 'maxpotion':
	case 'fullrestore':
		healAmount = pokemon.maxHp;
		break;
	case 'berryjuice':
		healAmount = 20;
		break;
	case 'freshwater':
		healAmount = 50;
		break;
	case 'sodapop':
		healAmount = 60;
		break;
	case 'lemonade':
		healAmount = 80;
		break;
	case 'moomoomilk':
		healAmount = 100;
		break;
	case 'tea':
		healAmount = 120;
		break;
	case 'energyroot':
		healAmount = 200;
		break;
	case 'energypowder':
		healAmount = 50;
		break;
	default:
		return { success: false, message: `The healing effect for ${itemData.name} is not defined.` };
	}

	const previousHp = pokemon.hp;
	pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
	const hpRestored = pokemon.hp - previousHp;

	let message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It recovered ${hpRestored} HP!`;

	if (itemId === 'fullrestore' && pokemon.status) {
		pokemon.status = null;
		message += `<br>${pokemon.species}'s status condition was healed.`;
	}

	removeItemFromInventory(player, itemId, 1);
	return { success: true, message };
}

/**
 * Calculates accuracy/evasion multiplier from stat stage.
 * @param stage The stat stage, from -6 to +6.
 * @returns The multiplier.
 */
export function getAccuracyEvasionMultiplier(stage: number): number {
	if (stage > 0) {
		return (3 + stage) / 3;
	} else if (stage < 0) {
		return 3 / (3 - stage);
	}
	return 1;
}

/********************
Core Functiins Ends
*************""*"""" */

// --- NEW GLOBAL CONSTANT AND HELPER FUNCTION ---

const INITIAL_STAT_STAGES = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

/**
 * Creates a new ActivePokemonSlot object with default volatile statuses.
 * @param pokemon The base RPGPokemon object.
 * @returns A new ActivePokemonSlot object.
 */
export function createActivePokemonSlot(pokemon: RPGPokemon): ActivePokemonSlot {
	return {
		pokemon,
		statStages: { ...INITIAL_STAT_STAGES },
		status: pokemon.status, // Carry over out-of-battle status
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
		lastDamageTaken: undefined,
		yawnCounter: undefined,
		// Initialize new volatile fields
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
	};
}

/**
 * Helper to get a live Pokemon slot from its index.
 * Returns the slot if it exists and the Pokemon is not fainted.
 */
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

/**
 * Resolves all targets for a move based on the move's target property.
 * @param attackerSlotIndex The slot index (0-3) of the user.
 * @param targetSlotIndex The slot index (0-3) the user *chose*.
 * @param move The move being used.
 * @param battle The current battle state.
 * @returns An array of ActivePokemonSlot objects that are the final targets.
 */
export function getMoveTargets(attackerSlotIndex: number, targetSlotIndex: number, move: Move, battle: BattleState): ActivePokemonSlot[] {
	const targets: ActivePokemonSlot[] = [];
	const attackerSlot = getSlotFromIndex(battle, attackerSlotIndex);
	if (!attackerSlot) return []; // Attacker is fainted or doesn't exist

	const isPlayerAttacker = attackerSlotIndex <= 1;

	// Get all potential targets that are alive
	const pSlot0 = getSlotFromIndex(battle, 0);
	const pSlot1 = getSlotFromIndex(battle, 1);
	const oSlot0 = getSlotFromIndex(battle, 2);
	const oSlot1 = getSlotFromIndex(battle, 3);

	const allFoes = isPlayerAttacker ? [oSlot0, oSlot1] : [pSlot0, pSlot1];
	const allAllies = isPlayerAttacker ? [pSlot0, pSlot1] : [oSlot0, oSlot1];
	const allOthers = [pSlot0, pSlot1, oSlot0, oSlot1];

	// Helper function to add a target if it's valid
	const addTarget = (slot: ActivePokemonSlot | null) => {
		if (slot && slot.pokemon.hp > 0) {
			targets.push(slot);
		}
	};

	switch (move.target) {
	// --- Single-target moves ---
	case 'normal': // Hits one adjacent foe
	case 'any': // Hits any one pokemon
	case 'ally': // Hits one ally
		// TODO: Add redirect logic (Follow Me, Rage Powder) here
		const chosenTarget = getSlotFromIndex(battle, targetSlotIndex);
		addTarget(chosenTarget);
		break;

	// --- User ---
	case 'self':
		addTarget(attackerSlot);
		break;

	// --- Spread moves ---
	case 'allAdjacentFoes': // Hits both foes
		allFoes.forEach(addTarget);
		break;

	case 'allAdjacent': // Hits everyone but user
	case 'scripted': // e.g., Surf, Earthquake - hits everyone but user
		allOthers.forEach(slot => {
			if (slot && slot.pokemon.id !== attackerSlot.pokemon.id) {
				addTarget(slot);
			}
		});
		break;

	case 'randomNormal': // Hits one random adjacent foe
		const validFoes = allFoes.filter(s => s && s.pokemon.hp > 0) as ActivePokemonSlot[];
		if (validFoes.length > 0) {
			const randomFoe = validFoes[Math.floor(Math.random() * validFoes.length)];
			addTarget(randomFoe);
		}
		break;

	// --- Side-wide moves ---
	case 'foeSide': // e.g., Stealth Rock, Spikes
		// For damage/effect logic, we only need one target.
		// The execution function will know to apply this to the *side*.
		const primaryFoe = getSlotFromIndex(battle, isPlayerAttacker ? 2 : 0);
		if (primaryFoe) addTarget(primaryFoe);
		else addTarget(getSlotFromIndex(battle, isPlayerAttacker ? 3 : 1));
		break;

	case 'allySide': // e.g., Reflect, Light Screen
		const primaryAlly = getSlotFromIndex(battle, isPlayerAttacker ? 0 : 2);
		if (primaryAlly) addTarget(primaryAlly);
		else addTarget(getSlotFromIndex(battle, isPlayerAttacker ? 1 : 3));
		break;

	case 'all': // e.g., Perish Song
		allOthers.forEach(addTarget);
		break;

	default:
		// Default to the chosen target if type is unhandled
		const defaultTarget = getSlotFromIndex(battle, targetSlotIndex);
		addTarget(defaultTarget);
		break;
	}

	// Return a unique list of targets
	return [...new Set(targets)];
}

/**
 * [STEP 4/6/7 Implementation]
 * Processes all queued actions for the turn.
 */
export function processTurn(context: CommandContext, battle: BattleState, room: ChatRoom, user: User) {
	const messageLog: string[] = [];
	battle.turn++;

	// --- Reset side-wide guards ---
	battle.playerQuickGuard = false;
	battle.opponentQuickGuard = false;
	battle.playerWideGuard = false;
	battle.opponentWideGuard = false;
	battle.playerCraftyShield = false;
	battle.opponentCraftyShield = false;

	// --- Reset per-pokemon flags ---
	getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(s => {
		s.isHelped = false;
		s.isRedirecting = false;
	});

	// 1. Generate AI Actions
	getActiveSlots(battle.opponentSlots).forEach((slot, i) => {
		const slotIndex = 2 + i; // Opponent slots are 2 and 3
		if (!battle.pendingActions[slotIndex]) {
			battle.pendingActions[slotIndex] = generateAiAction(slot, slotIndex, battle);
		}
	});

	// 2. Build and Sort Action Order
	const actionQueue: NonNullable<BattleState['pendingActions'][number]>[] = [];
	let allActiveSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	for (const slotIndex in battle.pendingActions) {
		const action = battle.pendingActions[slotIndex];
		// Only queue actions for Pokemon that are still active
		if (action && allActiveSlots.some(s => s.pokemon.id === action.pokemonId)) {
			actionQueue.push(action);
		}
	}

	actionQueue.sort((a, b) => {
		const slotA = allActiveSlots.find(s => s.pokemon.id === a.pokemonId);
		const slotB = allActiveSlots.find(s => s.pokemon.id === b.pokemonId);

		// Should not happen, but as a fallback
		if (!slotA) return 1;
		if (!slotB) return -1;

		// --- Handle switch priority ---
		const isSwitchA = a.actionType === 'switch';
		const isSwitchB = b.actionType === 'switch';

		// Switches have +6 priority
		const priorityA = isSwitchA ? 6 : (getMove(a.moveId || 'struggle').priority);
		const priorityB = isSwitchB ? 6 : (getMove(b.moveId || 'struggle').priority);

		// Sort by Priority
		if (priorityA !== priorityB) {
			return priorityB - priorityA;
		}

		// Sort by Speed
		let speedA = slotA.pokemon.spe * getStatMultiplier(slotA.statStages.spe);
		if (slotA.status === 'par') speedA = Math.floor(speedA / 2);
		let speedB = slotB.pokemon.spe * getStatMultiplier(slotB.statStages.spe);
		if (slotB.status === 'par') speedB = Math.floor(speedB / 2);

		if (battle.trickRoomTurns > 0) {
			return speedA - speedB; // Slower goes first in Trick Room
		}
		return speedB - speedA; // Faster goes first normally
	});

	// 3. Execute Actions in order
	for (const action of actionQueue) {
		executeAction(action, battle, room, user, messageLog);

		// --- Faint Check (Mid-turn) ---
		// Check for faints caused by this action
		const battleEndedMidTurn = checkBattleEndCondition(context, battle, room, user, messageLog);
		if (battleEndedMidTurn) {
			return; // Battle ended or is waiting for a switch
		}
	}

	// 4. End-of-Turn Effects
	if (battle.forceEnd) {
		// Handled by checkBattleEndCondition or executeAction
		return;
	}

	messageLog.push("--- End of Turn ---");
	processEndOfTurn(battle, messageLog);

	// 5. Check for Battle End (after EOT effects)
	const battleEnded = checkBattleEndCondition(context, battle, room, user, messageLog);

	// 6. Reset and Render
	battle.pendingActions = {}; // Reset for next turn

	if (!battleEnded) {
		// Increment active turn counters for all active Pokemon
		allActiveSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);
		allActiveSlots.forEach(slot => {
			if (slot.pokemon.hp > 0) {
				slot.activeTurns++;
			}
		});
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
	}
}

/**
 * Gets all active (non-fainted, non-null) slots for a given side.
 * @param slots The [Slot | null, Slot | null] array.
 * @returns An array of ActivePokemonSlot.
 */
export function getActiveSlots(slots: [ActivePokemonSlot | null, ActivePokemonSlot | null]): ActivePokemonSlot[] {
	return slots.filter(slot => slot && slot.pokemon.hp > 0) as ActivePokemonSlot[];
}

/**
 * [AI] Generates a simple action for an AI-controlled slot.
 * Picks a random damaging move and a random player-side target.
 */
export function generateAiAction(aiSlot: ActivePokemonSlot, aiSlotIndex: number, battle: BattleState): BattleState['pendingActions'][number] {
	// Find valid moves (with PP)
	const usableMoves = aiSlot.pokemon.moves.filter(m => {
		const moveData = getMove(m.id);
		return m.pp > 0 && moveData.category !== 'Status'; // Simple AI: only use damaging moves
	});

	let chosenMoveId = 'struggle';
	if (usableMoves.length > 0) {
		chosenMoveId = usableMoves[Math.floor(Math.random() * usableMoves.length)].id;
	}

	// Find valid targets (player side)
	const playerSlots = getActiveSlots(battle.playerSlots);
	let targetSlotIndex = 0; // Default to slot 0 if no one is active
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

/**
 * [STEP 4/6/7 Implementation]
 * Executes a single queued action (move or switch).
 */
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

	// Check if the Pokemon fainted before its turn (e.g., from an ally's Earthquake)
	if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
		return;
	}

	// --- Reset redirection flag at the start of a pokemon's turn ---
	attackerSlot.isRedirecting = false;

	// --- Handle Switch Action ---
	if (action.actionType === 'switch' && action.switchToPokemonId) {
		const isPlayerSwitch = attackerSlotIndex <= 1;
		const pokemonToSwitchInId = action.switchToPokemonId;

		// Check for switch prevention
		if (attackerSlot.isIngrained) {
			messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
			return;
		}
		if (attackerSlot.isTrapped) {
			messageLog.push(`${attackerSlot.pokemon.species} is trapped and can't switch out!`);
			return;
		}

		if (isPlayerSwitch) {
			const outgoingPokemon = attackerSlot.pokemon;

			// Find new Pokemon in party
			const partyIndex = player.party.findIndex(p => p.id === pokemonToSwitchInId);
			if (partyIndex === -1) {
				messageLog.push(`${outgoingPokemon.species} tried to switch out, but there was no one to switch to!`);
				return;
			}

			// Save outgoing Pokemon's status to the party
			saveBattleStatus(battle); // This function needs to be updated in Step 7

			// Add outgoing Pokemon back to party
			player.party.push(outgoingPokemon);

			// Remove incoming Pokemon from party
			const [incomingPokemon] = player.party.splice(partyIndex, 1);

			// Create new slot
			const newSlot = createActivePokemonSlot(incomingPokemon);
			battle.playerSlots[attackerSlotIndex as 0 | 1] = newSlot;

			messageLog.push(`**${player.name} withdrew ${outgoingPokemon.species} and sent out ${incomingPokemon.species}!**`);

			// Apply hazards
			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
			if (faintedOnEntry) {
				messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
				// Faint check will run at end of turn
			} else {
				handleMirrorHerb(newSlot, battle, messageLog);
			}
		} else {
			// --- AI SWITCH LOGIC ---
			const outgoingPokemon = attackerSlot.pokemon;

			// Find new Pokemon in party
			const replacement = battle.opponentParty.find(p =>
				p.hp > 0 &&
				!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
			);

			if (replacement) {
				const newSlot = createActivePokemonSlot(replacement);
				battle.opponentSlots[attackerSlotIndex as 2 | 3] = newSlot;

				messageLog.push(`**${battle.opponentName} withdrew ${outgoingPokemon.species} and sent out ${replacement.species}!**`);

				// Apply hazards
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}
			} else {
				messageLog.push(`${outgoingPokemon.species} tried to switch out, but no one was left!`);
			}
		}
		return;
	}

	// --- Handle Move Action ---
	if (action.actionType === 'move' && action.moveId && action.targetSlot !== undefined) {
		const move = getMove(action.moveId);
		let moveObject = attackerSlot.pokemon.moves.find(m => m.id === move.id);

		// Handle Struggle
		if (move.id === 'struggle') {
			moveObject = { id: 'struggle', pp: 1 };
		} else if (!moveObject) {
			// Should not happen if validation is correct
			moveObject = { id: 'struggle', pp: 1 };
		} else if (moveObject.pp === 0) {
			moveObject = { id: 'struggle', pp: 1 };
			messageLog.push(`${attackerSlot.pokemon.species} has no PP left for ${move.name}!`);
		}

		// 1. Pre-Turn Status Checks (Sleep, Freeze, Paralysis, Confusion, Flinch)
		if (!handlePreTurnChecks(attackerSlot, battle, messageLog)) {
			return; // Attacker couldn't move
		}

		// 2. Handle Two-Turn/Charging Moves
		if (move.flags.charge && !attackerSlot.chargingMove) {
			// First turn: Start charging
			attackerSlot.chargingMove = move.id;
			let chargeMessage = `${attackerSlot.pokemon.species} is charging up!`;

			// Custom messages for specific moves
			if (move.id === 'fly') chargeMessage = `${attackerSlot.pokemon.species} flew up high!`;
			else if (move.id === 'dig') chargeMessage = `${attackerSlot.pokemon.species} burrowed underground!`;
			else if (move.id === 'dive') chargeMessage = `${attackerSlot.pokemon.species} hid underwater!`;
			else if (move.id === 'bounce') chargeMessage = `${attackerSlot.pokemon.species} sprang up!`;
			else if (move.id === 'shadowforce' || move.id === 'phantomforce') chargeMessage = `${attackerSlot.pokemon.species} vanished instantly!`;
			else if (move.id === 'solarbeam' || move.id === 'solarblade') {
				// Solar moves skip charging in harsh sunlight
				if (battle.weather?.type === 'sun') {
					attackerSlot.chargingMove = undefined; // Don't charge
					chargeMessage = '';
				} else {
					chargeMessage = `${attackerSlot.pokemon.species} absorbed light!`;
				}
			} else if (move.id === 'razorwind') chargeMessage = `${attackerSlot.pokemon.species} whipped up a whirlwind!`;
			else if (move.id === 'skyattack') chargeMessage = `${attackerSlot.pokemon.species} became cloaked in a harsh light!`;
			else if (move.id === 'skullbash') chargeMessage = `${attackerSlot.pokemon.species} tucked in its head!`;
			else if (move.id === 'freezeshock') chargeMessage = `${attackerSlot.pokemon.species} became cloaked in a freezing light!`;
			else if (move.id === 'iceburn') chargeMessage = `${attackerSlot.pokemon.species} became cloaked in freezing air!`;
			else if (move.id === 'geomancy') chargeMessage = `${attackerSlot.pokemon.species} is absorbing power!`;
			else if (move.id === 'meteorbeam') chargeMessage = `${attackerSlot.pokemon.species} is overflowing with space power!`;

			if (chargeMessage) messageLog.push(chargeMessage);

			// If still charging (not skipped), deduct PP and return
			if (attackerSlot.chargingMove) {
				if (moveObject.id !== 'struggle' && moveObject.pp > 0) {
					moveObject.pp--;
				}
				return;
			}
		} else if (attackerSlot.chargingMove === move.id) {
			// Second turn: Execute the move
			attackerSlot.chargingMove = undefined;
		}

		// 3. PP Deduction (if not already deducted during charging)
		if (moveObject.id !== 'struggle' && moveObject.pp > 0 && !move.flags.charge) {
			moveObject.pp--;
		}

		// 4. Resolve Targets
		let chosenTargetSlot = action.targetSlot;
		const isPlayerAttacker = attackerSlotIndex <= 1;
		const opponentSlots = getActiveSlots(isPlayerAttacker ? battle.opponentSlots : battle.playerSlots);

		// --- Check for redirection ---
		const redirector = opponentSlots.find(s => s.isRedirecting);
		if (redirector && move.target === 'normal') { // Check move is single-target
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(redirector);
			chosenTargetSlot = redirectorIndex;
			messageLog.push(`${redirector.pokemon.species} took the attack!`);
		}

		const targetSlots = getMoveTargets(attackerSlotIndex, chosenTargetSlot, move, battle);

		// 5. Announce and Execute the Move
		messageLog.push(`<span style="color: #555;"><strong>${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`);

		if (targetSlots.length === 0) {
			messageLog.push(`But there was no target!`);
			return;
		}

		// 6. Execute move against all targets
		executeMove(attackerSlot, targetSlots, move, moveObject, battle, messageLog);

		// 7. Handle U-turn/Volt Switch (self-switch after move)
		if (move.selfSwitch && attackerSlot.pokemon.hp > 0) {
			const isPlayer = attackerSlotIndex <= 1;
			if (isPlayer) {
				const player = getPlayerData(battle.playerId);
				const hasReplacement = player.party.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));
				if (hasReplacement) {
					// --- SET PIVOT FLAG ---
					battle.pendingPivot = {
						slotIndex: attackerSlotIndex,
						slot: attackerSlot,
						isBatonPass: move.selfSwitch === 'copyvolatile',
					};
					battle.playerSlots[attackerSlotIndex as 0 | 1] = null; // Empty the slot
					messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			} else {
				// AI U-turn
				const hasReplacement = battle.opponentParty.some(p => p.hp > 0 && !battle.opponentSlots.some(s => s?.pokemon.id === p.id));
				if (hasReplacement) {
					battle.aiPendingPivot = {
						slotIndex: attackerSlotIndex,
						slot: attackerSlot,
						isBatonPass: move.selfSwitch === 'copyvolatile',
					};
					battle.opponentSlots[attackerSlotIndex as 2 | 3] = null;
					messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			}
		}
	}
}

/**********************
* HTML UI
**********************/
/**
 * [NEW] Generates the UI for a 1-v-1 single battle.
 */

// Export helper to check if battle is a doubles battle
export function isDoublesBattle(battle: BattleState): boolean {
	return battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';
}

// Export helper to get all active player slots
export function getActivePlayerSlots(battle: BattleState): ActivePokemonSlot[] {
	return getActiveSlots(battle.playerSlots);
}

// Export helper to get all active opponent slots
export function getActiveOpponentSlots(battle: BattleState): ActivePokemonSlot[] {
	return getActiveSlots(battle.opponentSlots);
}
