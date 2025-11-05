/*
* Pokemon Showdown
* RPG Battle Engine
*
* This file contains all the core logic for running a battle,
* including damage calculation, move execution, turn processing,
* and end-of-turn effects.
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

/**
 * Get the current types of a Pokemon, accounting for terastallization.
 */
export function getPokemonTypes(pokemon: RPGPokemon, slot?: ActivePokemonSlot): string[] {
	if (slot?.terastallized) {
		return [slot.terastallized];
	}
	const species = Dex.species.get(pokemon.species);
	return species.types;
}

export function getCustomEffectiveness(moveType: string, defenderTypes: string[], defender: RPGPokemon, battle: BattleState): number {
	let effectiveness = 1;
	const chartEntry = TYPE_CHART[moveType];
	if (!chartEntry) return 1;
	for (const defenderType of defenderTypes) {
		if (chartEntry.superEffective.includes(defenderType)) {
			effectiveness *= 2;
		} else if (chartEntry.notVeryEffective.includes(defenderType)) {
			effectiveness *= 0.5;
		} else if (chartEntry.noEffect.includes(defenderType)) {
			effectiveness *= 0;
		}
	}
	return effectiveness;
}

export function getBallBonus(ballId: string, battle: BattleState, targetSlot: ActivePokemonSlot): number {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;
	const playerSlot = getActiveSlots(battle.playerSlots)[0];
	if (!playerSlot) return 1;
	const activePokemon = playerSlot.pokemon;
	const turn = battle.turn;

	const opponentSpecies = Dex.species.get(opponentActivePokemon.species);

	switch (ballId) {
	case 'greatball': return 1.5;
	case 'ultraball': return 2;
	case 'masterball': return 255;
	case 'fastball':
		return opponentSpecies.baseStats.spe >= 100 ? 4 : 1;
	case 'levelball':
		if (activePokemon.level >= opponentActivePokemon.level * 4) return 8;
		if (activePokemon.level >= opponentActivePokemon.level * 2) return 4;
		if (activePokemon.level > opponentActivePokemon.level) return 2;
		return 1;
	case 'nestball':
		return opponentActivePokemon.level <= 30 ? Math.max(1, (41 - opponentActivePokemon.level) / 10) : 1;
	case 'netball':
		return opponentSpecies.types.includes('Bug') || opponentSpecies.types.includes('Water') ? 3.5 : 1;
	case 'quickball':
		return turn === 0 ? 5 : 1;
	case 'timerball':
		return Math.min(4, 1 + turn * (1229 / 4096));
	case 'dreamball':
		return opponentStatus === 'slp' ? 4 : 1;
	default:
		return 1;
	}
}

export function performCatchAttempt(battle: BattleState, ballId: string, targetSlot: ActivePokemonSlot): { success: boolean, shakes: number } {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;

	const speciesId = toID(opponentActivePokemon.species);
	const catchRate = MANUAL_CATCH_RATES[speciesId] || 150;

	const ballBonus = getBallBonus(ballId, battle, targetSlot);
	if (ballBonus === 255) return { success: true, shakes: 4 };

	let statusBonus = 1;
	if (opponentStatus === 'slp' || opponentStatus === 'frz') {
		statusBonus = 2.5;
	} else if (opponentStatus === 'par' || opponentStatus === 'psn' || opponentStatus === 'brn') {
		statusBonus = 1.5;
	}

	const { maxHp, hp } = opponentActivePokemon;
	const modifiedCatchRate = catchRate;

	const a = Math.floor(
		(((3 * maxHp - 2 * hp) * modifiedCatchRate * ballBonus) / (3 * maxHp)) * statusBonus
	);

	if (a >= 255) return { success: true, shakes: 4 };

	const b = Math.floor(65536 / (255 / a) ** 0.1875);

	let shakes = 0;
	for (let i = 0; i < 4; i++) {
		const rand = Math.floor(Math.random() * 65536);
		if (rand >= b) {
			return { success: false, shakes };
		}
		shakes++;
	}

	return { success: true, shakes: 4 };
}

export function getStatMultiplier(stage: number): number {
	if (stage >= 0) {
		return (2 + stage) / 2;
	} else {
		return 2 / (2 - Math.abs(stage));
	}
}

export function getCriticalHitChance(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	const defenderAbility = toID(defenderSlot.pokemon.ability || '');
	if (defenderAbility === 'battlearmor' || defenderAbility === 'shellarmor') {
		return 0;
	}

	if (['frostbreath', 'stormthrow', 'zipzapzap', 'surginstrikes'].includes(move.id)) {
		return 1;
	}

	let critStage = 0;
	const attacker = attackerSlot.pokemon;

	if (attackerSlot.focusEnergy) {
		critStage += 2;
	}

	if (['slash', 'razorleaf', 'crabhammer', 'karatechop', 'attackorder', 'blazekick', 'crosschop', 'crosspoison', 'nightslash', 'poisontail', 'psychocut', 'shadowclaw', 'spacialrend', 'stoneedge'].includes(move.id)) {
		critStage += 1;
	}

	if (battle.magicRoomTurns === 0 && (attacker.item === 'scopelens' || attacker.item === 'razorclaw')) {
		critStage += 1;
	}

	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'superluck') {
		critStage += 1;
	}

	const critChances = [1 / 24, 1 / 8, 1 / 2, 1 / 1];
	return critChances[Math.min(critStage, 3)];
}

export function gainEffortValues(pokemon: RPGPokemon, defeatedPokemon: RPGPokemon) {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
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
	const baseExp = MANUAL_BASE_EXP[defeatedSpeciesId] || 150;

	const expGained = Math.floor((baseExp * defeatedPokemon.level) / 7);
	if (expGained <= 0) return { messages: [`No Experience Points were gained.`], leveledUp: false };

	let leveledUp = false;
	const messages: string[] = [];

	const participantNames: string[] = [];

	for (const slot of participantSlots) {
		if (!slot?.pokemon) continue;
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue;

		participantNames.push(pokemon.species);
		gainEffortValues(pokemon, defeatedPokemon);
		pokemon.experience += expGained;
	}

	if (participantNames.length === 0) return { messages: [], leveledUp: false };

	messages.push(`**${participantNames.join(' and ')}** gained ${expGained} Experience Points!`);

	for (const slot of participantSlots) {
		if (!slot?.pokemon) continue;
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue;

		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
			messages.push(...levelUp(pokemon));
			leveledUp = true;
			const evolveMessage = checkEvolution(player, pokemon, { room, user });
			if (evolveMessage) {
				messages.push(evolveMessage);
				break;
			}
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}
	}

	return { messages, leveledUp };
}

export function saveBattleStatus(battle: BattleState) {
	const player = getPlayerData(battle.playerId);

	for (const slot of battle.playerSlots) {
		if (slot) {
			const pokemonInParty = player.party.find(p => p.id === slot.pokemon.id);
			if (pokemonInParty) {
				if (slot.status === 'slp' || slot.status === 'frz') {
					pokemonInParty.status = null;
				} else {
					pokemonInParty.status = slot.status;
				}
			}
		}
	}

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

export function getDamageBasePower(
	move: Move,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	let basePower = move.basePower;
	const attackerSpecies = Dex.species.get(attacker.species);
	const defenderSpecies = Dex.species.get(defender.species);

	if (attackerSlot.isHelped) {
		basePower = Math.floor(basePower * 1.5);
	}

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
		const attackerSpe = attacker.spe * getStatMultiplier(attackerSlot.statStages.spe);
		const defenderSpe = defender.spe * getStatMultiplier(defenderSlot.statStages.spe);
		if (defenderSpe > 0) {
			basePower = Math.min(150, Math.floor(25 * (defenderSpe / attackerSpe)) + 1);
		} else {
			basePower = 1;
		}
		break;
	case 'storedpower':
	case 'powertrip':
		let totalBoosts = 0;
		for (const stat in attackerSlot.statStages) {
			if (attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages] > 0) {
				totalBoosts += attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages];
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
		const presentRand = Math.random();
		if (presentRand < 0.4) basePower = 40;
		else if (presentRand < 0.7) basePower = 80;
		else if (presentRand < 0.8) basePower = 120;
		else basePower = -1;
		break;
	case 'magnitude':
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

	if (move.id === 'facade' && attackerSlot.status && ['psn', 'brn', 'par'].includes(attackerSlot.status)) {
		basePower *= 2;
	}
	if (move.id === 'brine' && defender.hp <= defender.maxHp / 2) {
		basePower *= 2;
	}
	if (move.id === 'venoshock' && defenderSlot.status === 'psn') {
		basePower *= 2;
	}
	if (move.id === 'weatherball' && RPGAbilities.isWeatherActive(battle)) {
		basePower *= 2;
	}
	if (move.id === 'terrainpulse' && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		basePower *= 2;
	}
	if (attackerSlot.isCharged && move.type === 'Electric') {
		basePower *= 2;
	}
	if (['solarbeam', 'solarblade'].includes(move.id) && RPGAbilities.isWeatherActive(battle)) {
		if (['rain', 'sand', 'hail'].includes(battle.weather!.type)) {
			basePower = Math.floor(basePower * 0.5);
		}
	}
	if (move.id === 'knockoff' && defender.item) {
		basePower = Math.floor(basePower * 1.5);
	}

	return basePower;
}

export function getDamageOffense(
	move: Move,
	attacker: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	const isSpecial = move.category === 'Special';
	const statName = isSpecial ? 'spa' : 'atk';
	let attackStatRaw = attacker[statName];

	attackStatRaw = RPGAbilities.applyAbilityStatModifier(attacker, statName, attackStatRaw, attackerSlot, battle);

	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'choiceband' && !isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
		if (attacker.item === 'choicespecs' && isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	if (isSpecial && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'sun') {
		if (toID(attacker.ability || '') === 'solarpower') {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	return attackStatRaw;
}

export function getDamageDefense(
	move: Move,
	defender: RPGPokemon,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	const isSpecial = move.category === 'Special';
	let statName = isSpecial ? 'spd' : 'def';

	if (battle.wonderRoomTurns > 0) {
		statName = isSpecial ? 'def' : 'spd';
	}

	let defenseStatRaw = defender[statName];

	defenseStatRaw = RPGAbilities.applyAbilityStatModifier(defender, statName, defenseStatRaw, defenderSlot, battle);

	if (battle.magicRoomTurns === 0) {
		if (defender.item === 'assaultvest' && isSpecial && battle.wonderRoomTurns === 0) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
		}

		if (defender.item === 'eviolite') {
			const species = Dex.species.get(defender.species);
			if (species.evos && species.evos.length > 0) {
				const defWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'def', defender.def, defenderSlot, battle);
				const spdWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'spd', defender.spd, defenderSlot, battle);

				if (statName === 'def') {
					defenseStatRaw = Math.floor(defWithAbility * 1.5);
				} else {
					defenseStatRaw = Math.floor(spdWithAbility * 1.5);
				}
			}
		}
	}

	return defenseStatRaw;
}

export function getMoveType(
	move: Move,
	attacker: RPGPokemon,
	battle: BattleState,
	abilityContext: AbilityContext
): string {
	let moveType = move.type;

	if (move.id === 'weatherball' && RPGAbilities.isWeatherActive(battle)) {
		switch (battle.weather!.type) {
		case 'sun': moveType = 'Fire'; break;
		case 'rain': moveType = 'Water'; break;
		case 'sand': moveType = 'Rock'; break;
		case 'hail': moveType = 'Ice'; break;
		}
	}
	if (move.id === 'terrainpulse' && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		switch (battle.terrain.type) {
		case 'electric': moveType = 'Electric'; break;
		case 'grassy': moveType = 'Grass'; break;
		case 'psychic': moveType = 'Psychic'; break;
		case 'misty': moveType = 'Fairy'; break;
		}
	}

	moveType = RPGAbilities.applyTypeModifier(abilityContext, moveType);
	return moveType;
}

export function applyFinalDamageModifiers(
	baseDamage: number,
	move: Move,
	moveType: string,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState,
	effectiveness: number,
	isCritical: boolean,
	abilityContext: AbilityContext
): number {
	let damage = baseDamage;

	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
	if (!isCritical) {
		const defenderVeilTurns = isDefenderPlayer ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;
		if (defenderVeilTurns > 0) {
			damage = Math.floor(damage * 0.5);
		} else {
			if (move.category === 'Physical') {
				const defenderReflectTurns = isDefenderPlayer ? battle.playerReflectTurns : battle.opponentReflectTurns;
				if (defenderReflectTurns > 0) damage = Math.floor(damage * 0.5);
			} else if (move.category === 'Special') {
				const defenderLightScreenTurns = isDefenderPlayer ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
				if (defenderLightScreenTurns > 0) damage = Math.floor(damage * 0.5);
			}
		}
	}

	if (RPGAbilities.isWeatherActive(battle)) {
		if (battle.weather!.type === 'sun') {
			if (moveType === 'Fire') damage = Math.floor(damage * 1.5);
			if (moveType === 'Water') damage = Math.floor(damage * 0.5);
		} else if (battle.weather!.type === 'rain') {
			if (moveType === 'Water') damage = Math.floor(damage * 1.5);
			if (moveType === 'Fire') damage = Math.floor(damage * 0.5);
		}
	}

	if (battle.terrain) {
		const attackerIsGrounded = RPGAbilities.isGrounded(attacker, battle);
		const defenderIsGrounded = RPGAbilities.isGrounded(defender, battle);

		if (battle.terrain.type === 'electric' && moveType === 'Electric' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'grassy' && moveType === 'Grass' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'psychic' && moveType === 'Psychic' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		}

		if (battle.terrain.type === 'misty' && moveType === 'Dragon' && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		} else if (battle.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		}
	}

	if (battle.mudSportTurns > 0 && moveType === 'Electric') {
		damage = Math.floor(damage * 0.33);
	}
	if (battle.waterSportTurns > 0 && moveType === 'Fire') {
		damage = Math.floor(damage * 0.33);
	}

	damage = RPGAbilities.applyDamageModifier(abilityContext, damage);

	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'lifeorb') {
			damage = Math.floor(damage * 1.3);
		}
		if (attacker.item === 'expertbelt' && effectiveness > 1) {
			damage = Math.floor(damage * 1.2);
		}
	}

	return damage;
}

export function calculateDamage(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState,
	spreadMultiplier: number
): { damage: number, message: string, effectiveness: number, berryConsumed?: string, isCritical: boolean } {
	const move = getMove(moveId);
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const defenderSpecies = Dex.species.get(defender.species);

	const abilityContext: any = {
		attacker,
		defender,
		attackerSlot,
		defenderSlot,
		move: { ...move },
		battle,
		messageLog: [],
	};

	if (move.flags.powder && defenderSpecies.types.includes('Grass')) {
		return { damage: 0, message: ` <i style="color: #6c757d;">Grass-types are immune to powder moves!</i>`, effectiveness: 0, isCritical: false };
	}
	const immunityCheck = RPGAbilities.checkImmunity(abilityContext);
	if (immunityCheck && immunityCheck.immune) {
		return { damage: 0, message: ` <i style="color: #6c757d;">${immunityCheck.message}</i>`, effectiveness: 0, isCritical: false };
	}

	if (!move.basePower) {
		if (moveId === 'dragonrage') return { damage: 40, message: '', effectiveness: 1, isCritical: false };
		if (moveId === 'sonicboom') return { damage: 20, message: '', effectiveness: 1, isCritical: false };
		if (moveId === 'seismictoss' || moveId === 'nightshade') {
			return { damage: attacker.level, message: '', effectiveness: 1, isCritical: false };
		}
		if (moveId === 'psywave') {
			return { damage: Math.floor(Math.random() * attacker.level * 1.5) + 1, message: '', effectiveness: 1, isCritical: false };
		}
		if (moveId === 'superfang') {
			return { damage: Math.floor(defender.hp / 2), message: '', effectiveness: 1, isCritical: false };
		}
		return { damage: 0, message: ` <i style="color: #6c757d;">But it had no effect!</i>`, effectiveness: 1, isCritical: false };
	}

	let basePower = getDamageBasePower(move, attacker, defender, attackerSlot, defenderSlot, battle);
	if (basePower === -1) {
		const healAmount = Math.floor(defender.maxHp * 0.25);
		defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species} was healed!</i>`, effectiveness: 0, isCritical: false };
	}

	const moveType = getMoveType(move, attacker, battle, abilityContext);
	abilityContext.move.type = moveType;

	basePower = RPGAbilities.applyPowerModifier(abilityContext, basePower);

	const attackStatRaw = getDamageOffense(move, attacker, attackerSlot, battle);
	const defenseStatRaw = getDamageDefense(move, defender, defenderSlot, battle);

	let attackStage = move.category === 'Special' ? attackerSlot.statStages.spa : attackerSlot.statStages.atk;
	let defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderSlot.statStages.def : defenderSlot.statStages.spd) :
		(move.category === 'Special' ? defenderSlot.statStages.spd : defenderSlot.statStages.def);

	const defenderAbility = toID(defender.ability || '');
	const attackerAbility = toID(attacker.ability || '');

	if (defenderAbility === 'unaware') {
		attackStage = 0;
	}
	if (attackerAbility === 'unaware') {
		defenseStage = 0;
	}

	const attackStat = Math.floor(attackStatRaw * getStatMultiplier(attackStage));
	let defenseStat = Math.floor(defenseStatRaw * getStatMultiplier(defenseStage));

	let finalAttackStat = attackStat;
	if (attackerSlot.status === 'brn' && move.category === 'Physical' && move.id !== 'facade' && attackerAbility !== 'guts') {
		finalAttackStat = Math.floor(finalAttackStat / 2);
	}
	if (['explosion', 'selfdestruct'].includes(move.id)) {
		defenseStat = Math.floor(defenseStat * 0.5);
	}

	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, defenderSlot, move, battle);
	const criticalMultiplier = isCritical ? (attackerAbility === 'sniper' ? 2.25 : 1.5) : 1;
	const stabMultiplier = RPGAbilities.getSTABMultiplier(attacker, moveType, attackerSlot);
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	const defenderTypes = getPokemonTypes(defender, defenderSlot);
	const effectiveness = getCustomEffectiveness(moveType, defenderTypes, defender, battle);

	abilityContext.effectiveness = effectiveness;

	let berryConsumed: string | undefined = undefined;
	let effectivenessMultiplier = effectiveness;
	if (battle.magicRoomTurns === 0 && defender.item && TYPE_RESIST_BERRIES[defender.item]) {
		const resistedType = TYPE_RESIST_BERRIES[defender.item];
		if (moveType === resistedType && effectiveness > 1) {
			effectivenessMultiplier = effectiveness / 2;
			berryConsumed = defender.item;
		}
	}

	const baseDamage = Math.floor((((2 * attacker.level / 5 + 2) * basePower * (finalAttackStat / defenseStat)) / 50) + 2);

	let damage = applyFinalDamageModifiers(
		baseDamage, move, moveType, attacker, defender,
		attackerSlot, defenderSlot, battle, effectiveness, isCritical, abilityContext
	);

	damage = Math.floor(damage * stabMultiplier * effectivenessMultiplier * criticalMultiplier * randomMultiplier);
	damage = Math.floor(damage * spreadMultiplier);
	damage = Math.max(1, damage);

	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed, isCritical };
}

export function handleDamagingMovePreamble(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	const defenderChargingMoveId = defenderSlot.chargingMove;
	if (defenderChargingMoveId) {
		let isImmune = true;
		const semiInvulnerableStates = ['fly', 'dig', 'dive', 'bounce', 'shadowforce', 'phantomforce'];

		if (semiInvulnerableStates.includes(defenderChargingMoveId)) {
			if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) isImmune = false;
			if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) isImmune = false;
			if ((defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') && ['thunder', 'hurricane', 'twister', 'gust', 'skyuppercut', 'smackdown'].includes(move.id)) isImmune = false;
		}
		if (isImmune) {
			messageLog.push(`But it failed! ${defender.species} avoided the attack!`);
			return true;
		}
	}

	if (move.id === 'counter' || move.id === 'mirrorcoat') {
		const targetCategory = move.id === 'counter' ? 'Physical' : 'Special';
		if (attackerSlot.lastDamageTaken?.category !== targetCategory) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const counterDamage = attackerSlot.lastDamageTaken.amount * 2;
		defender.hp = Math.max(0, defender.hp - counterDamage);
		messageLog.push(`${defender.species} took ${counterDamage} damage from the counter!`);
		return true;
	}

	if (move.id === 'fling') {
		if (battle.magicRoomTurns > 0 || !attacker.item) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const flingPowers: Record<string, number> = {
			'leftovers': 10, 'oranberry': 10, 'berryjuice': 10, 'sitrusberry': 10, 'lumberry': 10, 'focussash': 10,
			'choiceband': 10, 'choicescarf': 10, 'choicespecs': 10, 'lifeorb': 30, 'rockyhelmet': 60, 'assaultvest': 80, 'ironball': 130,
		};
		const damage = flingPowers[attacker.item] || 30;
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} flung its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt ${damage} damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	if (move.id === 'naturalgift') {
		if (!attacker.item?.includes('berry')) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const damage = 80;
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} used its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt ${damage} damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	if (move.ohko) {
		const defenderAbility = toID(defender.ability || '');
		if (defenderAbility === 'sturdy') {
			messageLog.push(`But it failed! (${defender.species}'s Sturdy)`);
			return true;
		}
		if (defender.level > attacker.level) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const defenderSpecies = Dex.species.get(defender.species);
		if (move.ohko === 'Normal' && defenderSpecies.types.includes('Ghost')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return true;
		}
		if (move.ohko === 'Ice' && defenderSpecies.types.includes('Ice')) {
			messageLog.push(`But it failed!`);
			return true;
		}

		const accuracy = 30 + attacker.level - defender.level;
		if (Math.random() * 100 < accuracy) {
			defender.hp = 0;
			messageLog.push(`<i style="color: #dc3545;">It's a one-hit KO!</i>`);
		} else {
			messageLog.push(`${attacker.species}'s attack missed!`);
		}
		return true;
	}

	return false;
}

export function applyDamageAndEnduranceEffects(
	defenderSlot: ActivePokemonSlot,
	damageDealt: number,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): number {
	const defender = defenderSlot.pokemon;
	const defenderAbility = toID(defender.ability || '');

	if (defenderSlot.isDisguised && damageDealt > 0 && move.category !== 'Status') {
		defenderSlot.isDisguised = false;
		if (defender.species === 'Mimikyu') {
			defender.species = 'Mimikyu-Busted';
		}
		messageLog.push(`<strong>${defender.species}'s Disguise was broken!</strong>`);
		const disguiseDamage = Math.max(1, Math.floor(defender.maxHp / 8));
		defender.hp = Math.max(0, defender.hp - disguiseDamage);
		messageLog.push(`${defender.species} was hurt by the broken disguise!`);
		defenderSlot.lastMoveThatHitMe = move;
		return 0;
	}

	if (defenderSlot.substitute && damageDealt > 0 && !move.flags.bypasssub) {
		const subHP = defenderSlot.substitute.hp;
		if (damageDealt >= subHP) {
			defenderSlot.substitute = undefined;
			messageLog.push(`The substitute took the hit and broke!`);
		} else {
			defenderSlot.substitute.hp -= damageDealt;
			messageLog.push(`The substitute took the hit!`);
		}
		defenderSlot.lastMoveThatHitMe = move;
		return 0;
	}

	const isFullHP = defender.hp === defender.maxHp;

	if (damageDealt >= defender.hp) {
		if (battle.magicRoomTurns === 0 && defender.item === 'focussash' && isFullHP) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Focus Sash!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		} else if (defenderAbility === 'sturdy' && isFullHP && move.ohko !== true) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Sturdy!`);
		}
	}

	defender.hp = Math.max(0, defender.hp - damageDealt);

	if (damageDealt > 0) {
		defenderSlot.lastMoveThatHitMe = move;
	}

	return damageDealt;
}

export function applyPostDamageContactEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	effectiveness: number,
	abilityContext: AbilityContext,
	isCritical: boolean
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	if (defender.hp <= 0 || damageDealt <= 0) return;

	if (isCritical && toID(defender.ability || '') === 'angerpoint') {
		applyStatChange(defenderSlot, 'atk', 6, battle, messageLog, defenderSlot);
	}

	if (battle.magicRoomTurns === 0) {
		if (move.category === 'Physical' && defender.item === 'keberry') {
			if (applyStatChange(defenderSlot, 'def', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Kee Berry)!`;
				defender.item = undefined;
				activateUnburden(defenderSlot, messageLog);
			}
		} else if (move.category === 'Special' && defender.item === 'marangaberry') {
			if (applyStatChange(defenderSlot, 'spd', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Maranga Berry)!`;
				defender.item = undefined;
				activateUnburden(defenderSlot, messageLog);
			}
		}
	}

	if (move.flags.contact && attacker.hp > 0) {
		if (battle.magicRoomTurns === 0) {
			if (defender.item === 'rockyhelmet' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 6));
				messageLog.push(`${attacker.species} was hurt by the Rocky Helmet!`);
			}
			if (defender.item === 'jabocaberry' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
				messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Jaboca Berry!`);
				defender.item = undefined;
				activateUnburden(defenderSlot, messageLog);
			}
		}
		if (attacker.hp > 0) {
			RPGAbilities.applyContactAbilityEffects(abilityContext);
		}
	}

	if (move.category === 'Special' && attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'rowapberry') {
		if (RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
			messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Rowap Berry!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}
	}

	const defenderAbility = toID(defender.ability || '');
	if (defenderAbility === 'cursedbody' && attacker.hp > 0 && !attackerSlot.disabledMove && Math.random() < 0.3) {
		attackerSlot.disabledMove = { moveId: move.id, turns: 4 };
		messageLog.push(`${attacker.species}'s ${move.name} was disabled by ${defender.species}'s Cursed Body!`);
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'weaknesspolicy' && effectiveness > 1) {
		let activated = false;
		if (applyStatChange(defenderSlot, 'atk', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}
		if (applyStatChange(defenderSlot, 'spa', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}

		if (activated) {
			messageLog.push(`${defender.species}'s Weakness Policy was activated!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}
	}

	if (attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'redcard') {
		const isPlayerDefending = battle.playerSlots.includes(defenderSlot);
		const attackerSlotIndex = (isPlayerDefending ? battle.opponentSlots : battle.playerSlots).indexOf(attackerSlot);

		if (attackerSlotIndex !== -1) {
			messageLog.push(`${defender.species}'s Red Card forced ${attacker.species} to switch out!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);

			if (isPlayerDefending) {
				battle.opponentSlots[attackerSlotIndex as 0 | 1] = null;
			} else {
				battle.playerSlots[attackerSlotIndex as 0 | 1] = null;
			}
		}
	}
}

export function applyRecoilAndSelfEffects(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	moveWasSuccessful: boolean
) {
	if (attackerSlot.pokemon.hp <= 0) return;
	const attacker = attackerSlot.pokemon;

	let tookRecoil = false;

	if (['mindblown', 'steelbeam'].includes(move.id)) {
		attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 2));
		messageLog.push(`${attacker.species} was damaged by the move's recoil!`);
		tookRecoil = true;
	} else if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
		const attackerAbility = toID(attacker.ability || '');
		const sheerForceActive = attackerAbility === 'sheerforce' && (move.secondary || move.secondaries);
		if (!sheerForceActive && RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 10));
			messageLog.push(`${attacker.species} was hurt by its Life Orb!`);
			tookRecoil = true;
		}
	} else if (move.id === 'struggle') {
		attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(attacker.maxHp / 4)));
		messageLog.push(`${attacker.species} was damaged by recoil!`);
		tookRecoil = true;
	} else if (move.recoil) {
		if (!RPGAbilities.preventsRecoil(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(damageDealt * (move.recoil[0] / move.recoil[1]))));
			messageLog.push(`${attacker.species} was damaged by recoil!`);
			tookRecoil = true;
		}
	}

	if (tookRecoil) {
		handleHPDropEffects(attackerSlot, battle, messageLog);
	}

	if (attacker.hp > 0 && move.self?.boosts) {
		const boosts = move.self.boosts;
		for (const stat in boosts) {
			let boostValue = boosts[stat as keyof typeof boosts]!;

			if (toID(attacker.ability || '') === 'contrary') {
				boostValue *= -1;
			}

			const currentStage = attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages];
			if (currentStage !== undefined) {
				const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
				attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages] = newStage as any;
				if (boostValue > 0) {
					messageLog.push(`${attacker.species}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
				} else if (boostValue < 0) {
					messageLog.push(`${attacker.species}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
				}
			}
		}
	}

	if (moveWasSuccessful && ['selfdestruct', 'explosion', 'mistyexplosion', 'finalgambit'].includes(move.id)) {
		attacker.hp = 0;
		messageLog.push(`**${attacker.species} fainted from using ${move.name}!**`);
	}
}

export function applySecondaryEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	abilityContext: AbilityContext
) {
	if (defenderSlot.pokemon.hp <= 0) return;
	if (!move.secondary || !RPGAbilities.shouldApplySecondaryEffects(attackerSlot.pokemon, move)) return;

	let chance = move.secondary.chance || 100;
	chance = RPGAbilities.applySereneGrace(abilityContext, chance);

	if (Math.random() * 100 < chance) {
		if (move.secondary.status && !defenderSlot.status) {
			const defender = defenderSlot.pokemon;
			const defenderSpecies = Dex.species.get(defender.species);
			let canInflict = true;

			if ((move.secondary.status === 'par' && defenderSpecies.types.includes('Electric')) ||
				(move.secondary.status === 'brn' && defenderSpecies.types.includes('Fire')) ||
				(move.secondary.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel')))) {
				canInflict = false;
			}
			if (canInflict && RPGAbilities.preventsStatus(defender, move.secondary.status)) {
				canInflict = false;
				messageLog.push(`${defender.species}'s ${defender.ability} prevents ${move.secondary.status}!`);
			}
			if (canInflict && battle.terrain?.type === 'misty' && RPGAbilities.isGrounded(defender, battle)) {
				canInflict = false;
				messageLog.push('The Misty Terrain prevents status conditions!');
			}

			if (canInflict) {
				const newStatus = move.secondary.status as Status;
				defenderSlot.status = newStatus;
				if (newStatus === 'slp') {
					defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
				}
				messageLog.push(`${defender.species} was ${newStatus === 'par' ? 'paralyzed' : newStatus === 'brn' ? 'burned' : newStatus === 'psn' ? 'poisoned' : newStatus}!`);

				const defenderAbility = toID(defender.ability || '');
				if (defenderAbility === 'synchronize') {
					applySynchronize(newStatus, defenderSlot, attackerSlot, battle, messageLog);
				}
			}
		}

		if (move.secondary.boosts) {
			let hadEffect = false;
			let triggeredDefiant = false;

			for (const stat in move.secondary.boosts) {
				let boostValue = move.secondary.boosts[stat as keyof typeof move.secondary.boosts]!;

				if (toID(defenderSlot.pokemon.ability || '') === 'contrary') {
					boostValue *= -1;
				}

				const currentStage = defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages];

				if (boostValue < 0) {
					if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.item === 'clearamulet') {
						messageLog.push(`${defenderSlot.pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
						continue;
					}
					const targetAbility = toID(defenderSlot.pokemon.ability || '');
					const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
					if (blockAbilities.includes(targetAbility)) {
						messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} prevents its stats from being lowered!`);
						continue;
					}
					if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(targetAbility)) {
						messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} prevents its Attack from being lowered!`);
						continue;
					}

					if (currentStage > -6) {
						const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
						defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages] = newStage as any;
						messageLog.push(`${defenderSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
						hadEffect = true;
						triggeredDefiant = true;
					}
				} else if (boostValue > 0) {
					if (currentStage < 6) {
						const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
						defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages] = newStage as any;
						messageLog.push(`${defenderSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
						hadEffect = true;
					}
				}
			}

			if (triggeredDefiant) {
				checkStatDropAbilities(defenderSlot, attackerSlot, battle, messageLog);
			}
		}

		if (move.secondary.volatileStatus === 'flinch') {
			if (!RPGAbilities.preventsFlinch(defenderSlot.pokemon)) {
				defenderSlot.willFlinch = true;
			} else {
				messageLog.push(`${defenderSlot.pokemon.species}'s Inner Focus prevents flinching!`);
			}
		}
	}
}

export function handleDamagingMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	spreadMultiplier: number
) {
	if (handleDamagingMovePreamble(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	const attacker = attackerSlot.pokemon;
	let moveWasSuccessful = false;
	const hitCount = RPGAbilities.getMultiHitCount(attacker, move);
	const hasParentalBond = RPGAbilities.hasParentalBond(attacker);
	const totalHits = hasParentalBond && hitCount === 1 ? 2 : hitCount;

	if (totalHits > 1) {
		const hitMessage = hasParentalBond ?
			` <i style="color: #6c757d;">(Parental Bond hit twice!)</i>` :
			` <i style="color: #6c757d;">(It hit ${totalHits} times!)</i>`;
		if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += hitMessage;
		} else {
			messageLog.push(hitMessage);
		}
	}

	for (let i = 0; i < totalHits; i++) {
		let parentalBondSpreadMultiplier = spreadMultiplier;
		if (hasParentalBond && i === 1) {
			parentalBondSpreadMultiplier *= 0.25;
		}

		const attackResult = calculateDamage(attackerSlot, defenderSlot, move.id, battle, parentalBondSpreadMultiplier);
		if (attackResult.effectiveness > 0) {
			moveWasSuccessful = true;
		}

		if (attackResult.berryConsumed) {
			const itemName = ITEMS_DATABASE[attackResult.berryConsumed]?.name;
			if (TYPE_RESIST_BERRIES[attackResult.berryConsumed]) {
				messageLog.push(`${defenderSlot.pokemon.species}'s ${itemName} weakened the attack!`);
			}
			defenderSlot.pokemon.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}

		const damageDealt = applyDamageAndEnduranceEffects(defenderSlot, attackResult.damage, move, battle, messageLog);

		if (damageDealt > 0 && move.category !== 'Status') {
			defenderSlot.lastDamageTaken = {
				amount: damageDealt,
				category: move.category,
				from: attacker.id,
			};
		}

		if (totalHits > 1) {
			messageLog.push(`Dealt ${damageDealt} damage!` + attackResult.message);
		} else if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += attackResult.message;
		} else {
			messageLog.push(attackResult.message);
		}

		if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.hp > 0 && defenderSlot.pokemon.item === 'airballoon' &&
			damageDealt > 0 && move.category !== 'Status') {
			messageLog.push(`${defenderSlot.pokemon.species}'s Air Balloon popped!`);
			defenderSlot.pokemon.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}

		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			if (move.drain && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns > 0) {
					messageLog.push(`${attacker.species} can't restore HP due to Heal Block!`);
				} else {
					const drainAmount = Math.max(1, Math.floor(damageDealt * (move.drain[0] / move.drain[1])));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + drainAmount);
					messageLog.push(`${defenderSlot.pokemon.species} had its energy drained!`);
				}
			}
			if (battle.magicRoomTurns === 0 && attacker.item === 'shellbell' && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns <= 0) {
					const healAmount = Math.max(1, Math.floor(damageDealt / 8));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
					messageLog.push(`${attacker.species} restored some HP using its Shell Bell!`);
				}
			}

			const abilityContext = { attacker, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
			applyPostDamageContactEffects(attackerSlot, defenderSlot, move, battle, messageLog, damageDealt, attackResult.effectiveness, abilityContext, attackResult.isCritical);

			handleHPDropEffects(defenderSlot, battle, messageLog);

			applyRecoilAndSelfEffects(attackerSlot, move, battle, messageLog, damageDealt, moveWasSuccessful);

			applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);

			// Force switch moves (Dragon Tail, Circle Throw)
			if (['dragontail', 'circlethrow'].includes(move.id) && defenderSlot.pokemon.hp > 0) {
				const defenderAbility = toID(defenderSlot.pokemon.ability || '');
				// Suction Cups and similar abilities prevent forced switches
				if (defenderAbility === 'suctioncups') {
					messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} anchors it in place!`);
				} else {
					const isDefenderPlayer = battle.playerSlots.includes(defenderSlot);
					const defenderSlotIndex = (isDefenderPlayer ? battle.playerSlots : battle.opponentSlots).indexOf(defenderSlot);

					if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
						// In wild battles, forced switch moves end the battle (like Roar/Whirlwind)
						messageLog.push(`The wild ${defenderSlot.pokemon.species} was blown away!`);
						if (defenderSlotIndex !== -1) {
							if (isDefenderPlayer) {
								messageLog.push(`But it failed!`); // Player can't be forced out in wild battles
							} else {
								battle.opponentSlots[defenderSlotIndex as 0 | 1] = null;
							}
						}
					} else if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
						// In trainer battles, force the defender to switch
						messageLog.push(`${defenderSlot.pokemon.species} was blown away!`);
						if (defenderSlotIndex !== -1) {
							// Set the slot to null to trigger forced switch
							if (isDefenderPlayer) {
								battle.playerSlots[defenderSlotIndex as 0 | 1] = null;
							} else {
								battle.opponentSlots[defenderSlotIndex as 0 | 1] = null;
							}
						}
					}
				}
			}
		}

		if (defenderSlot.pokemon.hp <= 0) break;
	}
}

export function checkStatDropAbilities(
	targetSlot: ActivePokemonSlot,
	sourceSlot: ActivePokemonSlot | null,
	battle: BattleState,
	messageLog: string[]
) {
	RPGAbilities.applyStatDropResponse(targetSlot, battle, messageLog, sourceSlot);
}

export function handleGenericBoostMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.boosts) return false;

	let targetSlot: ActivePokemonSlot | null;
	let targetName: string;
	const isSelf = move.target === 'self';

	if (isSelf) {
		targetSlot = attackerSlot;
		targetName = attackerSlot.pokemon.species;
	} else {
		if (!defenderSlot) {
			messageLog.push(`But it failed! (No target)`);
			return true;
		}
		targetSlot = defenderSlot;
		targetName = defenderSlot.pokemon.species;
	}

	const targetStages = targetSlot.statStages;
	let hadEffect = false;
	let triggeredDefiant = false;

	for (const stat in move.boosts) {
		let boostValue = move.boosts[stat as keyof typeof move.boosts]!;

		if (toID(targetSlot.pokemon.ability || '') === 'contrary') {
			boostValue *= -1;
		}

		const stage = targetStages[stat as keyof typeof targetStages];

		if (boostValue > 0) {
			if (stage < 6) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetName}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
				hadEffect = true;
			}
		} else if (boostValue < 0) {
			if (!isSelf) {
				if (battle.magicRoomTurns === 0 && targetSlot.pokemon.item === 'clearamulet') {
					messageLog.push(`${targetName}'s Clear Amulet prevents its stats from being lowered!`);
					continue;
				}
				const targetAbility = toID(targetSlot.pokemon.ability || '');
				const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
				if (blockAbilities.includes(targetAbility)) {
					messageLog.push(`${targetName}'s ${targetSlot.pokemon.ability} prevents its stats from being lowered!`);
					continue;
				}
				if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(targetAbility)) {
					messageLog.push(`${targetName}'s ${targetSlot.pokemon.ability} prevents its Attack from being lowered!`);
					continue;
				}
			}

			if (stage > -6) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetName}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
				hadEffect = true;

				if (!isSelf) triggeredDefiant = true;
			}
		}
	}

	if (!hadEffect) messageLog.push('But it failed!');

	if (triggeredDefiant) {
		checkStatDropAbilities(targetSlot, attackerSlot, battle, messageLog);
	}

	return true;
}

export function handleGenericStatusInflictMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.status || !defenderSlot) return false;

	const defender = defenderSlot.pokemon;
	const defenderSpecies = Dex.species.get(defender.species);
	let canBeAfflicted = !defenderSlot.status;
	const defenderIsGrounded = RPGAbilities.isGrounded(defender, battle);

	if (battle.terrain?.type === 'misty' && defenderIsGrounded) {
		canBeAfflicted = false;
		messageLog.push('The Misty Terrain prevents status conditions!');
	}
	if (battle.terrain?.type === 'electric' && move.status === 'slp' && defenderIsGrounded) {
		canBeAfflicted = false;
		messageLog.push('The Electric Terrain prevents sleep!');
	}
	const anyUproar = [...battle.playerSlots, ...battle.opponentSlots].some(s => s?.uproarTurns && s.uproarTurns > 0);
	if (move.status === 'slp' && anyUproar) {
		canBeAfflicted = false;
		messageLog.push('But the uproar kept it awake!');
	}
	if (canBeAfflicted && RPGAbilities.preventsStatus(defender, move.status)) {
		canBeAfflicted = false;
		messageLog.push(`${defender.species}'s ${defender.ability} prevents ${move.status}!`);
	}
	if (canBeAfflicted) {
		if ((move.status === 'brn' && defenderSpecies.types.includes('Fire')) ||
			(move.status === 'par' && defenderSpecies.types.includes('Electric')) ||
			(move.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel'))) ||
			(move.status === 'frz' && defenderSpecies.types.includes('Ice'))) {
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

		const defenderAbility = toID(defender.ability || '');
		if (defenderAbility === 'synchronize') {
			applySynchronize(newStatus, defenderSlot, attackerSlot, battle, messageLog);
		}
	} else {
		messageLog.push(`But it failed!`);
	}

	return true;
}

export function handleGenericVolatileMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.volatileStatus) return false;

	const targetSlot = move.target === 'self' ? attackerSlot : defenderSlot;
	if (!targetSlot) {
		messageLog.push(`But it failed!`);
		return true;
	}
	const target = targetSlot.pokemon;
	let hadEffect = false;

	switch (move.volatileStatus) {
	case 'confusion':
		if (!targetSlot.isConfused) {
			targetSlot.isConfused = true;
			targetSlot.confusionCounter = Math.floor(Math.random() * 3) + 2;
			messageLog.push(`${target.species} became confused!`);
			hadEffect = true;
		}
		break;
	case 'taunt':
		if (targetSlot.tauntTurns <= 0) {
			targetSlot.tauntTurns = 3;
			messageLog.push(`${target.species} fell for the taunt!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'trap':
		if (!targetSlot.isTrapped) {
			targetSlot.isTrapped = { turns: 5 };
			messageLog.push(`${target.species} can no longer escape!`);
			hadEffect = true;
		}
		break;
	case 'yawn':
		if (!targetSlot.status && !targetSlot.yawnCounter) {
			const isTerrainImmune = battle.terrain?.type === 'electric' && RPGAbilities.isGrounded(target, battle);
			const sleepPreventingAbilities = ['insomnia', 'vitalspirit', 'comatose', 'sweetveil'];
			const isAbilityImmune = sleepPreventingAbilities.includes(toID(target.ability || ''));
			if (!isTerrainImmune && !isAbilityImmune) {
				targetSlot.yawnCounter = 2;
				messageLog.push(`${target.species} grew drowsy!`);
				hadEffect = true;
			}
		}
		break;
	case 'disable':
		if (targetSlot.lastMoveUsed && !targetSlot.disabledMove) {
			targetSlot.disabledMove = { moveId: targetSlot.lastMoveUsed, turns: 4 };
			messageLog.push(`${target.species}'s ${targetSlot.lastMoveUsed} was disabled!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'encore':
		if (targetSlot.lastMoveUsed && !targetSlot.encoreMove) {
			targetSlot.encoreMove = { moveId: targetSlot.lastMoveUsed, turns: 3 };
			messageLog.push(`${target.species} received an encore!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'ingrain':
		if (!targetSlot.isIngrained) {
			targetSlot.isIngrained = true;
			messageLog.push(`${target.species} planted its roots!`);
			hadEffect = true;
		}
		break;
	case 'aquaring':
		if (!targetSlot.hasAquaRing) {
			targetSlot.hasAquaRing = true;
			messageLog.push(`${target.species} surrounded itself with a veil of water!`);
			hadEffect = true;
		}
		break;
	case 'focusenergy':
		if (!targetSlot.focusEnergy) {
			targetSlot.focusEnergy = true;
			messageLog.push(`${target.species} is getting pumped!`);
			hadEffect = true;
		}
		break;
	case 'magnetrise':
		if (targetSlot.magnetRiseTurns === 0) {
			targetSlot.magnetRiseTurns = 5;
			messageLog.push(`${target.species} levitated with electromagnetism!`);
			hadEffect = true;
		}
		break;
	case 'telekinesis':
		if (targetSlot.telekinesisCounter === 0) {
			targetSlot.telekinesisCounter = 3;
			messageLog.push(`${target.species} was hurled into the air!`);
			hadEffect = true;
		}
		break;
	case 'smackdown':
		if (!targetSlot.isSmackedDown) {
			targetSlot.isSmackedDown = true;
			messageLog.push(`${target.species} fell straight down!`);
			hadEffect = true;
		}
		break;
	case 'torment':
		if (!targetSlot.tormentActive) {
			targetSlot.tormentActive = true;
			messageLog.push(`${target.species} was subjected to torment!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'embargo':
		if (targetSlot.embargoTurns === 0) {
			targetSlot.embargoTurns = 5;
			messageLog.push(`${target.species} can't use items anymore!`);
			hadEffect = true;
		}
		break;
	case 'healblock':
		if (targetSlot.healBlockTurns === 0) {
			targetSlot.healBlockTurns = 5;
			messageLog.push(`${target.species} was prevented from healing!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	}

	if (!hadEffect) messageLog.push('But it failed!');
	return true;
}

export function handleGenericHealMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	messageLog: string[]
): boolean {
	if (!move.flags.heal) return false;

	const attacker = attackerSlot.pokemon;
	if (attacker.hp >= attacker.maxHp) {
		messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
	} else {
		const healAmount = Math.floor(attacker.maxHp * (move.heal?.[0] || 1) / (move.heal?.[1] || 2));
		const oldHp = attacker.hp;
		attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
		messageLog.push(`${attacker.species} restored ${attacker.hp - oldHp} HP!`);
	}
	return true;
}

export function handleGenericFieldMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	let hadEffect = false;
	const attacker = attackerSlot.pokemon;

	if (move.weather) {
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
		return true;
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
		return true;
	case 'magicroom':
		if (battle.magicRoomTurns > 0) {
			battle.magicRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.magicRoomTurns = 5;
			messageLog.push('It created a bizarre area where held items lose their effects!');
		}
		return true;
	case 'wonderroom':
		if (battle.wonderRoomTurns > 0) {
			battle.wonderRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.wonderRoomTurns = 5;
			messageLog.push('It created a bizarre area where Defense and Sp. Def stats are swapped!');
		}
		return true;
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
		}
		return true;
	case 'gravity':
		if (battle.gravityTurns > 0) messageLog.push('But it failed!');
		else {
			battle.gravityTurns = 5;
			messageLog.push('Gravity intensified!');
		}
		return true;
	case 'mudsport':
		if (battle.mudSportTurns > 0) messageLog.push('But it failed!');
		else {
			battle.mudSportTurns = 5;
			messageLog.push('Electricity\'s power was weakened!');
		}
		return true;
	case 'watersport':
		if (battle.waterSportTurns > 0) messageLog.push('But it failed!');
		else {
			battle.waterSportTurns = 5;
			messageLog.push('Fire\'s power was weakened!');
		}
		return true;
	}

	return false;
}

export function handleGenericSideMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attackerSlot.pokemon.id);
	let hadEffect = false;

	if (['reflect', 'lightscreen', 'auroraveil'].includes(move.id)) {
		const duration = (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'lightclay') ? 8 : 5;
		if (isPlayerAttacker) {
			if (move.id === 'reflect' && battle.playerReflectTurns === 0) {
				battle.playerReflectTurns = duration;
				messageLog.push(`Reflect raised your team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.playerLightScreenTurns === 0) {
				battle.playerLightScreenTurns = duration;
				messageLog.push(`Light Screen raised your team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'hail' && battle.playerAuroraVeilTurns === 0) {
				battle.playerAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised your team's defenses!`);
				hadEffect = true;
			}
		} else {
			if (move.id === 'reflect' && battle.opponentReflectTurns === 0) {
				battle.opponentReflectTurns = duration;
				messageLog.push(`Reflect raised the opposing team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.opponentLightScreenTurns === 0) {
				battle.opponentLightScreenTurns = duration;
				messageLog.push(`Light Screen raised the opposing team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'hail' && battle.opponentAuroraVeilTurns === 0) {
				battle.opponentAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised the opposing team's defenses!`);
				hadEffect = true;
			}
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return true;
	}

	if (move.sideCondition) {
		const targetHazards = isPlayerAttacker ? battle.opponentHazards : battle.playerHazards;
		const hazardId = toID(move.sideCondition);

		switch (hazardId) {
		case 'spikes':
			if (targetHazards.filter(h => h === 'spikes').length < 3) {
				targetHazards.push('spikes');
				messageLog.push(`Spikes were scattered all around the opposing team's feet!`);
				hadEffect = true;
			}
			break;
		case 'toxicspikes':
			if (targetHazards.filter(h => h === 'toxicspikes').length < 2) {
				targetHazards.push('toxicspikes');
				messageLog.push(`Toxic Spikes were scattered all around the opposing team's feet!`);
				hadEffect = true;
			}
			break;
		case 'stickyweb':
			if (!targetHazards.includes('stickyweb')) {
				targetHazards.push('stickyweb');
				messageLog.push(`A sticky web has been laid out on the ground around the opposing team!`);
				hadEffect = true;
			}
			break;
		case 'stealthrock':
			if (!targetHazards.includes('stealthrock')) {
				targetHazards.push('stealthrock');
				messageLog.push(`Pointed stones float in the air around the opposing team!`);
				hadEffect = true;
			}
			break;
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return true;
	}

	if (['quickguard', 'wideguard', 'craftyshield'].includes(move.id)) {
		if (isPlayerAttacker) {
			if (move.id === 'quickguard') battle.playerQuickGuard = true;
			if (move.id === 'wideguard') battle.playerWideGuard = true;
			if (move.id === 'craftyshield') battle.playerCraftyShield = true;
		} else {
			if (move.id === 'quickguard') battle.opponentQuickGuard = true;
			if (move.id === 'wideguard') battle.opponentWideGuard = true;
			if (move.id === 'craftyshield') battle.opponentCraftyShield = true;
		}
		messageLog.push(`${attackerSlot.pokemon.species} is protecting its side!`);
		return true;
	}

	return false;
}

export function handleSpecificStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot?.pokemon;
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);

	switch (move.id) {
	case 'roar':
	case 'whirlwind':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
			messageLog.push(`The wild ${defender.species} was blown away!`);
			const oppSlotIndex = battle.opponentSlots.indexOf(defenderSlot);
			if (oppSlotIndex !== -1) {
				battle.opponentSlots[oppSlotIndex as 0 | 1] = null;
			}
		} else {
			messageLog.push(`But it failed!`);
		}
		return true;

	case 'defog':
		if (battle.playerHazards.length > 0 || battle.opponentHazards.length > 0) {
			battle.playerHazards = [];
			battle.opponentHazards = [];
			messageLog.push('The entry hazards were removed from the field!');
		}
		if (isPlayerAttacker) {
			if (battle.opponentReflectTurns > 0) { battle.opponentReflectTurns = 0; messageLog.push(`The opposing team's Reflect wore off!`); }
			if (battle.opponentLightScreenTurns > 0) { battle.opponentLightScreenTurns = 0; messageLog.push(`The opposing team's Light Screen wore off!`); }
			if (battle.opponentAuroraVeilTurns > 0) { battle.opponentAuroraVeilTurns = 0; messageLog.push(`The opposing team's Aurora Veil wore off!`); }
		} else {
			if (battle.playerReflectTurns > 0) { battle.playerReflectTurns = 0; messageLog.push(`Your team's Reflect wore off!`); }
			if (battle.playerLightScreenTurns > 0) { battle.playerLightScreenTurns = 0; messageLog.push(`Your team's Light Screen wore off!`); }
			if (battle.playerAuroraVeilTurns > 0) { battle.playerAuroraVeilTurns = 0; messageLog.push(`Your team's Aurora Veil wore off!`); }
		}
		if (defenderSlot && defenderSlot.statStages.evasion > -6) {
			defenderSlot.statStages.evasion--;
			messageLog.push(`${defender!.species}'s evasion fell!`);
		}
		return true;

	case 'leechseed':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const defenderSpecies = Dex.species.get(defender.species);
		if (defenderSpecies.types.includes('Grass')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
		} else if (defenderSlot.isSeeded) {
			messageLog.push(`${defender.species} is already seeded!`);
		} else {
			defenderSlot.isSeeded = true;
			messageLog.push(`${defender.species} was seeded!`);
		}
		return true;

	case 'curse':
		const attackerSpecies = Dex.species.get(attacker.species);
		if (attackerSpecies.types.includes('Ghost')) {
			if (!defenderSlot || defenderSlot.isCursed) {
				messageLog.push(`But it failed!`);
			} else {
				attacker.hp = Math.max(1, Math.floor(attacker.hp / 2));
				messageLog.push(`${attacker.species} cut its own HP to lay a curse!`);
				defenderSlot.isCursed = true;
				messageLog.push(`${defenderSlot.pokemon.species} was cursed!`);
			}
		} else {
			handleGenericBoostMove(attackerSlot, defenderSlot, move, battle, messageLog);
		}
		return true;

	case 'psychup':
		if (!defenderSlot) {
			messageLog.push(`But it failed!`);
			return true;
		}
		attackerSlot.statStages = { ...defenderSlot.statStages };
		messageLog.push(`${attacker.species} copied ${defender.species}'s stat changes!`);
		return true;

	case 'trick':
	case 'switcheroo':
		if (!defenderSlot || battle.magicRoomTurns > 0) {
			messageLog.push('But it failed!');
			return true;
		}
		if (RPGAbilities.checkItemRemovalPrevention(defender) || RPGAbilities.checkItemRemovalPrevention(attacker)) {
			messageLog.push('But it failed!');
			return true;
		}
		if (!attacker.item && !defender.item) {
			messageLog.push('But it failed!');
			return true;
		}
		const attackerItem = attacker.item;
		const defenderItem = defender.item;
		attacker.item = defenderItem;
		defender.item = attackerItem;
		messageLog.push(`${attacker.species} swapped items with ${defender.species}!`);
		if (attacker.item) messageLog.push(`${attacker.species} obtained a ${ITEMS_DATABASE[attacker.item]?.name || attacker.item}!`);
		if (defender.item) messageLog.push(`${defender.species} obtained a ${ITEMS_DATABASE[defender.item]?.name || defender.item}!`);

		if (attackerItem !== attacker.item) activateUnburden(attackerSlot, messageLog);
		if (defenderItem !== defender.item) activateUnburden(defenderSlot, messageLog);
		return true;

	case 'nightmare':
		if (!defenderSlot || defenderSlot.status !== 'slp' || defenderSlot.hasNightmare) {
			messageLog.push(`But it failed!`);
		} else {
			defenderSlot.hasNightmare = true;
			messageLog.push(`${defender.species} began having a nightmare!`);
		}
		return true;

	case 'bestow':
		if (!defenderSlot || battle.magicRoomTurns > 0 || !attacker.item || defender.item) {
			messageLog.push('But it failed!');
			return true;
		}
		if (RPGAbilities.checkItemRemovalPrevention(defender)) {
			messageLog.push('But it failed!');
			return true;
		}
		const givenItem = attacker.item;
		defender.item = givenItem;
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		messageLog.push(`${attacker.species} gave ${ITEMS_DATABASE[givenItem]?.name || givenItem} to ${defender.species}!`);
		return true;

	case 'transform':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		attacker.atk = defender.atk;
		attacker.def = defender.def;
		attacker.spa = defender.spa;
		attacker.spd = defender.spd;
		attacker.spe = defender.spe;
		attacker.moves = defender.moves.map(m => ({ id: m.id, pp: 5 }));
		const originalSpecies = attacker.species;
		attacker.species = defender.species;
		if (defender.ability) attacker.ability = defender.ability;
		attackerSlot.statStages = { ...defenderSlot.statStages };
		messageLog.push(`${originalSpecies} transformed into ${defender.species}!`);
		return true;

	case 'helpinghand':
		if (!defenderSlot) {
			messageLog.push('But it failed!');
			return true;
		}
		defenderSlot.isHelped = true;
		messageLog.push(`${attacker.species} is ready to help ${defender.species}!`);
		return true;

	case 'substitute':
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
			}
		}
		return true;

	case 'charge':
		attackerSlot.isCharged = true;
		messageLog.push(`${attacker.species} began charging power!`);
		return false;

	case 'stockpile':
		if (attackerSlot.stockpileCount < 3) {
			attackerSlot.stockpileCount++;
			messageLog.push(`${attacker.species} stockpiled ${attackerSlot.stockpileCount}!`);

			let boostValue = 1;
			if (toID(attacker.ability || '') === 'contrary') {
				boostValue = -1;
			}

			if (boostValue > 0) {
				if (attackerSlot.statStages.def < 6) {
					attackerSlot.statStages.def++;
					messageLog.push(`${attacker.species}'s Defense rose!`);
				}
				if (attackerSlot.statStages.spd < 6) {
					attackerSlot.statStages.spd++;
					messageLog.push(`${attacker.species}'s Sp. Def rose!`);
				}
			} else {
				if (attackerSlot.statStages.def > -6) {
					attackerSlot.statStages.def--;
					messageLog.push(`${attacker.species}'s Defense fell!`);
				}
				if (attackerSlot.statStages.spd > -6) {
					attackerSlot.statStages.spd--;
					messageLog.push(`${attacker.species}'s Sp. Def fell!`);
				}
			}
			return true;
		} else {
			messageLog.push(`${attacker.species} can't stockpile any more!`);
			return true;
		}

	case 'bellydrum':
		const contraryActive = toID(attacker.ability || '') === 'contrary';
		if (contraryActive) {
			if (attacker.hp <= attacker.maxHp / 2) {
				messageLog.push(`But it failed! (Not enough HP)`);
			} else if (attackerSlot.statStages.atk <= -6) {
				messageLog.push(`But it failed! (Attack is already minimized)`);
			} else {
				attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
				attackerSlot.statStages.atk = -6;
				messageLog.push(`${attacker.species} cut its own HP and minimized its Attack!`);
			}
		} else {
			if (attacker.hp <= attacker.maxHp / 2) {
				messageLog.push(`But it failed! (Not enough HP)`);
			} else if (attackerSlot.statStages.atk >= 6) {
				messageLog.push(`But it failed! (Attack is already maxed out)`);
			} else {
				attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
				attackerSlot.statStages.atk = 6;
				messageLog.push(`${attacker.species} cut its own HP and maximized its Attack!`);
			}
		}
		return true;

	case 'futuresight':
	case 'doomdesire':
		const futureMoveArray = isPlayerAttacker ? battle.opponentFutureMoves : battle.playerFutureMoves;
		const targetSlotLocalIndex = (isPlayerAttacker ? battle.opponentSlots : battle.playerSlots).indexOf(defenderSlot);
		if (targetSlotLocalIndex === -1) {
			messageLog.push('But it failed!');
			return true;
		}
		const existingFutureMove = futureMoveArray.find(fm => fm.slotIndex === targetSlotLocalIndex);
		if (existingFutureMove) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const attackerSlotIndex = (isPlayerAttacker ? battle.playerSlots : battle.opponentSlots).indexOf(attackerSlot);
		futureMoveArray.push({
			slotIndex: targetSlotLocalIndex,
			moveId: move.id,
			turnsLeft: 2,
			attackerSlotIndex,
			attackerStats: {
				atk: attacker.atk * getStatMultiplier(attackerSlot.statStages.atk),
				spa: attacker.spa * getStatMultiplier(attackerSlot.statStages.spa),
			},
		});
		messageLog.push(`${attacker.species} foresaw an attack!`);
		return true;

	case 'protect':
	case 'detect':
		const successCounter = attackerSlot.protectSuccessCounter;
		const successChance = 1 / 3 ** successCounter;
		if (Math.random() < successChance) {
			attackerSlot.isProtected = true;
			attackerSlot.protectSuccessCounter++;
			messageLog.push(`${attacker.species} protected itself!`);
		} else {
			messageLog.push(`But it failed!`);
		}
		return true;

	case 'followme':
	case 'ragepowder':
		attackerSlot.isRedirecting = true;
		messageLog.push(`${attacker.species} became the center of attention!`);
		return true;

	case 'haze':
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			slot.statStages = { ...INITIAL_STAT_STAGES };
		});
		messageLog.push('All stat changes were eliminated!');
		return true;
	}

	return false;
}

export function handleStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot?.pokemon;
	const defenderSpecies = defender ? Dex.species.get(defender.species) : null;

	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'prankster' && defenderSpecies?.types.includes('Dark')) {
		messageLog.push(`${defender!.species} is immune to Prankster-boosted moves!`);
		return;
	}

	if (defender && defenderSpecies && move.target !== 'self' && !move.flags.heal) {
		const effectiveness = getCustomEffectiveness(move.type, defenderSpecies.types, defender, battle);
		if (effectiveness === 0) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}
	}

	if (handleSpecificStatusMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (handleGenericBoostMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (handleGenericStatusInflictMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (handleGenericVolatileMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (handleGenericFieldMove(attackerSlot, move, battle, messageLog)) {
		return;
	}

	if (handleGenericSideMove(attackerSlot, move, battle, messageLog)) {
		return;
	}

	if (handleGenericHealMove(attackerSlot, move, messageLog)) {
		return;
	}

	if (move.selfSwitch) {
		return;
	}

	messageLog.push(`But it failed!`);
}

export function applySynchronize(
	status: Status,
	defenderSlot: ActivePokemonSlot,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState,
	messageLog: string[]
): void {
	const attacker = attackerSlot.pokemon;
	if (!attacker || attacker.hp <= 0) return;

	const attackerSpecies = Dex.species.get(attacker.species);
	let canBeAfflicted = !attackerSlot.status;

	if (!canBeAfflicted) return;

	if ((status === 'brn' && attackerSpecies.types.includes('Fire')) ||
		(status === 'par' && attackerSpecies.types.includes('Electric')) ||
		(status === 'psn' && (attackerSpecies.types.includes('Poison') || attackerSpecies.types.includes('Steel'))) ||
		(status === 'frz' && attackerSpecies.types.includes('Ice'))) {
		canBeAfflicted = false;
	}

	if (canBeAfflicted && RPGAbilities.preventsStatus(attacker, status)) {
		canBeAfflicted = false;
	}

	const attackerIsGrounded = RPGAbilities.isGrounded(attacker, battle);
	if (canBeAfflicted && battle.terrain?.type === 'misty' && attackerIsGrounded) {
		canBeAfflicted = false;
	}
	if (canBeAfflicted && battle.terrain?.type === 'electric' && status === 'slp' && attackerIsGrounded) {
		canBeAfflicted = false;
	}

	if (canBeAfflicted) {
		attackerSlot.status = status;
		if (status === 'slp') {
			attackerSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
		}
		messageLog.push(`${defenderSlot.pokemon.species}'s Synchronize afflicted ${attacker.species} with ${status}!`);
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
	if (battle.magicRoomTurns > 0) return;

	const pokemon = slot.pokemon;

	if (pokemon.hp <= 0 || !pokemon.item) return;

	let itemConsumed = false;
	let consumedItemName = '';
	const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);

	const halfHP = pokemon.maxHp / 2;
	const quarterHP = pokemon.maxHp / 4;

	if (pokemon.hp <= halfHP && !itemConsumed) {
		let healAmount = 0;
		if (pokemon.item === 'berryjuice') {
			healAmount = 20;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} drank its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'oranberry') {
			healAmount = 10;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'goldberry') {
			healAmount = 30;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'sitrusberry') {
			healAmount = Math.floor(pokemon.maxHp / 4);
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
			const oldHp = pokemon.hp;
			const healAmount = Math.floor(pokemon.maxHp / 2);
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${pokemon.hp - oldHp} HP!`);

			const berryData = BERRY_FLAVORS[pokemon.item];
			const natureData = NATURES[pokemon.nature];
			if (natureData && berryData) {
				const dislikedFlavor = natureData.minus ? NATURE_FLAVOR_PREFERENCES[natureData.minus] : null;
				if (dislikedFlavor && berryData.flavor === dislikedFlavor) {
					if (!slot.isConfused) {
						slot.isConfused = true;
						slot.confusionCounter = Math.floor(Math.random() * 3) + 2;
						messageLog.push(`${pokemon.species} became confused due to the berry's flavor!`);
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

	if (itemConsumed) {
		pokemon.item = undefined;
		activateUnburden(slot, messageLog);
	}
}

export function handleEndOfTurnWeather(battle: BattleState, messageLog: string[]) {
export function activateUnburden(slot: ActivePokemonSlot, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	if (ability === 'unburden' && !slot.unburdenActive) {
		slot.unburdenActive = true;
		messageLog.push(`${slot.pokemon.species}'s Unburden activated!`);
	}
}

