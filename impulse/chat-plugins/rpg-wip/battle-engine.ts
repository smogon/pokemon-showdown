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

export function activateUnburden(slot: ActivePokemonSlot, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	if (ability === 'unburden' && !slot.unburdenActive) {
		slot.unburdenActive = true;
		messageLog.push(`${slot.pokemon.species}'s Unburden activated!`);
	}
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
