/*
* Pokemon Showdown
* RPG Battle Utility Functions
*/

import { Dex, toID } from '../../../../sim/dex';
import { RPGAbilities } from '../abilities';
import { getActiveSlots, calculateStats, getMove, levelUp, handleLearningMoves, checkEvolution } from '../utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, Stats, Move, AbilityContext } from '../interface';
import { TYPE_RESIST_BERRIES, TYPE_CHART } from '../data';
import { getPlayerData } from '../player';
import { MANUAL_CATCH_RATES } from '../MANUAL_CATCH_RATES';
import { MANUAL_BASE_EXP } from '../MANUAL_BASE_EXP';
import { MANUAL_EV_YIELDS } from '../MANUAL_EV_YIELDS';
import { RPGMoves } from '../battle-moves';

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

export function getCustomEffectiveness(moveType: string, defenderTypes: string[], defender: RPGPokemon, battle: BattleState, attacker?: RPGPokemon): number {
	let effectiveness = 1;
	const chartEntry = TYPE_CHART[moveType];
	if (!chartEntry) return 1;

	// Phase 4: Delta Stream - Strong winds negate Flying-type weaknesses
	const hasStrongWinds = battle.weather?.type === 'strong-winds';
	const isFlyingType = defenderTypes.includes('Flying');

	// Phase 2: Mind's Eye - Hits Ghost types with Normal/Fighting moves
	const attackerAbility = attacker ? toID(attacker.ability || '') : '';
	const hasMindEye = attackerAbility === 'mindseye';

	for (const defenderType of defenderTypes) {
		if (chartEntry.superEffective.includes(defenderType)) {
			// Delta Stream negates super effective hits on Flying types from Rock, Electric, Ice
			if (hasStrongWinds && isFlyingType && defenderType === 'Flying' &&
				['Rock', 'Electric', 'Ice'].includes(moveType)) {
				effectiveness *= 1; // Neutral instead of super effective
			} else {
				effectiveness *= 2;
			}
		} else if (chartEntry.notVeryEffective.includes(defenderType)) {
			effectiveness *= 0.5;
		} else if (chartEntry.noEffect.includes(defenderType)) {
			// Mind's Eye bypasses Ghost immunity to Normal/Fighting
			if (hasMindEye && defenderType === 'Ghost' && ['Normal', 'Fighting'].includes(moveType)) {
				// Don't multiply by 0, treat as neutral
				effectiveness *= 1;
			} else {
				effectiveness *= 0;
			}
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
		return 2 / (2 + Math.abs(stage));
	}
}

export function getCriticalHitChance(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	const defenderAbility = toID(defenderSlot.pokemon.ability || '');
	if (RPGAbilities.isAbilityIgnored(attackerSlot.pokemon, defenderSlot.pokemon, defenderAbility)) {
		// Continue if ability is ignored
	} else if (defenderAbility === 'battlearmor' || defenderAbility === 'shellarmor') {
		return 0;
	}

	if (['frostbreath', 'stormthrow', 'zipzapzap', 'surginstrikes'].includes(move.id)) {
		return 1;
	}

	let critStage = 0;
	const attacker = attackerSlot.pokemon;

	// Phase 2: Merciless - always crit against poisoned targets
	const abilityId = toID(attacker.ability || '');
	if (abilityId === 'merciless' && (defenderSlot.status === 'psn' || defenderSlot.status === 'tox')) {
		return 1;
	}

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
	const evYield: Partial<Stats> = MANUAL_EV_YIELDS[defeatedSpeciesId] || { atk: 1 };
	const { hp, atk, def, spa, spd, spe } = pokemon.evs;
	let totalEVs = hp + atk + def + spa + spd + spe;

	for (const stat in evYield) {
		if (totalEVs >= 510) break;
		const statKey = stat as keyof Stats;
		const evGained = evYield[statKey];
		if (!evGained) continue;
		const currentEV = pokemon.evs[statKey];
		if (currentEV >= 252) continue;
		const canAdd = Math.min(evGained, 252 - currentEV, 510 - totalEVs);
		pokemon.evs[statKey] += canAdd;
		totalEVs += canAdd;
	}
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	const hpDiff = newStats.maxHp - pokemon.maxHp;
	pokemon.hp = Math.max(1, Number(pokemon.hp) + Number(hpDiff));
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

	let leveledUp = false;
	const messages: string[] = [];
	const participantExpGains = new Map<string, number>();

	// Gen 5-9 Scaled Experience Formula
	// Formula: ExpGained = floor((X^1.5 * Z) / (Y^1.5)) + 1
	// Where: X = 2 * OpponentLevel + 10
	//        Y = OpponentLevel + ParticipantLevel + 10
	//        Z = floor((BaseExp * OpponentLevel) / 5)
	//        X^1.5 = sqrt(X) * X * X (same for Y^1.5)
	const opponentLevel = defeatedPokemon.level;
	const X = 2 * opponentLevel + 10;
	const Z = Math.floor((baseExp * opponentLevel) / 5);

	// Get IDs of active participants (for EV distribution)
	const activeParticipantIds = new Set<string>();
	for (const slot of participantSlots) {
		if (slot?.pokemon && slot.pokemon.hp > 0) {
			activeParticipantIds.add(slot.pokemon.id);
		}
	}

	// Gen 6-9: Exp Share is always on - ALL Pokemon in party gain experience
	for (const pokemon of player.party) {
		if (pokemon.level >= 100) continue;

		// Calculate level-scaled experience for this Pokemon
		const participantLevel = pokemon.level;
		const Y = opponentLevel + participantLevel + 10;

		// Calculate scaling factor: (X^1.5) / (Y^1.5)
		const scalingFactor = (Math.sqrt(X) * X * X) / (Math.sqrt(Y) * Y * Y);
		const expGained = Math.floor(scalingFactor * Z) + 1;

		participantExpGains.set(pokemon.species, expGained);

		// Only active participants gain EVs
		if (activeParticipantIds.has(pokemon.id)) {
			gainEffortValues(pokemon, defeatedPokemon);
		}

		pokemon.experience += expGained;
	}

	if (participantExpGains.size === 0) return { messages: [], leveledUp: false };

	// Create exp gain message
	if (participantExpGains.size === 1) {
		const [species, exp] = Array.from(participantExpGains.entries())[0];
		messages.push(`<b>${species} gained ${exp} Experience Points!</b>`);
	} else {
		// Check if all Pokemon gained the same exp
		const expValues = Array.from(participantExpGains.values());
		const allSame = expValues.every(v => v === expValues[0]);

		if (allSame) {
			const participantNames = Array.from(participantExpGains.keys());
			messages.push(`<b>${participantNames.join(' and ')} gained ${expValues[0]} Experience Points!</b>`);
		} else {
			// Different exp amounts - show individual gains
			const expStrings = Array.from(participantExpGains.entries()).map(([name, exp]) =>
				`${name} gained ${exp} Experience Points`
			);
			messages.push(`<b>${expStrings.join(' and ')}!</b>`);
		}
	}

	// Check for level ups, evolutions, and move learning for ALL Pokemon in party
	for (const pokemon of player.party) {
		if (pokemon.level >= 100) continue;

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

export function getDamageOffense(
	move: Move,
	attacker: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState,
	abilityContext: AbilityContext // Added for Foul Play
): number {
	const isSpecial = move.category === 'Special';
	let statName = isSpecial ? 'spa' : 'atk';
	let attackStatRaw: number;

	if (move.id === 'foulplay') {
		// Foul Play uses the defender's Attack stat
		const defender = abilityContext.defender; // We need to get the defender context
		attackStatRaw = defender.atk;
		statName = 'atk'; // Ensure it uses 'atk' stat stages
	} else {
		// Standard moves use the attacker's stats
		attackStatRaw = attacker[statName];
	}

	attackStatRaw = RPGAbilities.applyAbilityStatModifier(attacker, statName, attackStatRaw, attackerSlot, battle);

	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'choiceband' && !isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
		if (attacker.item === 'choicespecs' && isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	if (isSpecial && RPGAbilities.isWeatherActive(battle) && (battle.weather?.type === 'sun' || battle.weather?.type === 'harsh-sun')) {
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

	// Handle Psyshock, Psystrike, Secret Sword (Special moves that target Defense)
	if (isSpecial && ['psyshock', 'psystrike', 'secretsword'].includes(move.id)) {
		statName = 'def';
	}

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

	if (move.id === 'weatherball') {
		if (RPGAbilities.isWeatherActive(battle)) {
			// Weather takes priority
			switch (battle.weather!.type) {
			case 'sun': moveType = 'Fire'; break;
			case 'rain': moveType = 'Water'; break;
			case 'sand': moveType = 'Rock'; break;
			case 'hail': moveType = 'Ice'; break;
			}
		} else if (battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
			// Terrain is checked if no weather is active
			switch (battle.terrain.type) {
			case 'electric': moveType = 'Electric'; break;
			case 'grassy': moveType = 'Grass'; break;
			case 'psychic': moveType = 'Psychic'; break;
			case 'misty': moveType = 'Fairy'; break;
			}
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

	const attackerAbility = toID(attacker.ability || '');
	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);

	// Check for screens only if the attacker does not have Infiltrator
	if (attackerAbility !== 'infiltrator' && !isCritical) {
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
		if (battle.weather!.type === 'sun' || battle.weather!.type === 'harsh-sun') {
			if (moveType === 'Fire') damage = Math.floor(damage * 1.5);
			if (moveType === 'Water') damage = Math.floor(damage * 0.5);
		} else if (battle.weather!.type === 'rain' || battle.weather!.type === 'heavy-rain') {
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
	if (immunityCheck?.immune) {
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

	let basePower = RPGMoves.getDamageBasePower(move, attacker, defender, attackerSlot, defenderSlot, battle);
	if (basePower === -1) {
		const healAmount = Math.floor(defender.maxHp * 0.25);
		defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species} was healed!</i>`, effectiveness: 0, isCritical: false };
	}

	const moveType = getMoveType(move, attacker, battle, abilityContext);
	abilityContext.move.type = moveType;

	basePower = RPGAbilities.applyPowerModifier(abilityContext, basePower);

	const attackStatRaw = getDamageOffense(move, attacker, attackerSlot, battle, abilityContext);
	const defenseStatRaw = getDamageDefense(move, defender, defenderSlot, battle);

	let attackStage: number;
	if (move.id === 'foulplay') {
		attackStage = defenderSlot.statStages.atk;
	} else {
		attackStage = move.category === 'Special' ? attackerSlot.statStages.spa : attackerSlot.statStages.atk;
	}

	let defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderSlot.statStages.def : defenderSlot.statStages.spd) :
		(move.category === 'Special' ? defenderSlot.statStages.spd : defenderSlot.statStages.def);

	// Handle Psyshock / Psystrike / Secret Sword
	if (['psyshock', 'psystrike', 'secretsword'].includes(move.id)) {
		defenseStage = battle.wonderRoomTurns > 0 ? defenderSlot.statStages.spd : defenderSlot.statStages.def;
	}

	const defenderAbility = toID(defender.ability || '');
	const attackerAbility = toID(attacker.ability || '');

	// Attacker's Unaware: Ignores defender's positive defensive stat stages
	// (But Mold Breaker bypasses this)
	if (attackerAbility === 'unaware' && !RPGAbilities.isAbilityIgnored(attacker, defender, attackerAbility)) {
		if (defenseStage > 0) {
			defenseStage = 0;
		}
	}

	// Defender's Unaware: Ignores attacker's positive offensive stat stages
	// (But Mold Breaker bypasses this)
	if (defenderAbility === 'unaware' && !RPGAbilities.isAbilityIgnored(attacker, defender, defenderAbility)) {
		if (attackStage > 0) {
			attackStage = 0;
		}
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

	// Safety check: Ensure defenseStat is always at least 1 to prevent division issues
	defenseStat = Math.max(1, defenseStat);
	finalAttackStat = Math.max(1, finalAttackStat);

	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, defenderSlot, move, battle);
	const criticalMultiplier = isCritical ? (attackerAbility === 'sniper' ? 2.25 : 1.5) : 1;
	const stabMultiplier = RPGAbilities.getSTABMultiplier(attacker, moveType, attackerSlot);
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	const defenderTypes = getPokemonTypes(defender, defenderSlot);

	let effectiveness: number;
	if (moveId === 'struggle') {
		// Struggle is typeless and always hits neutrally
		effectiveness = 1;
	} else {
		// All other moves calculate effectiveness normally
		effectiveness = getCustomEffectiveness(moveType, defenderTypes, defender, battle, attacker);
	}

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

	// Safety check: Handle any invalid damage values (Infinity, NaN, or negative)
	if (!isFinite(damage) || isNaN(damage) || damage < 0) {
		damage = 1;
	}
	damage = Math.max(1, damage);

	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed, isCritical };
}
