/*
* Pokemon Showdown
* RPG Battle End-of-Turn (EOT) Effects
*
* This file contains all logic that happens after
* all actions for the turn have been completed.
*/

import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { getActiveSlots, getMove } from './utils';
import type { ActivePokemonSlot, BattleState } from './interface';
import {
	activateUnburden,
	applyStatChange,
} from './battle-shared';

// Import functions from battle-core
import {
	getCustomEffectiveness,
	getStatMultiplier,
} from './battle-core';

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

		// Restore location weather if it exists
		if (battle.locationWeather) {
			battle.weather = {
				type: battle.locationWeather.type,
				turns: 9999, // Restore with high turn count for permanent location weather
			};
			const weatherRestoreMessages = {
				'sun': 'The harsh sunlight returned!',
				'rain': 'The rain resumed!',
				'sand': 'The sandstorm picked up again!',
				'hail': 'It started hailing again!',
			};
			messageLog.push(weatherRestoreMessages[battle.locationWeather.type]);
		} else {
			battle.weather = undefined;
		}
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

	if (battle.fairyLockTurns > 0) {
		battle.fairyLockTurns--;
		if (battle.fairyLockTurns <= 0) {
			messageLog.push('The Fairy Lock wore off!');
		}
	}

	if (battle.ionDelugeTurns > 0) {
		battle.ionDelugeTurns--;
	}
}

export function processEndOfTurn(battle: BattleState, messageLog: string[]) {
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	// Handle Perish Song counters
	allSlots.forEach(slot => {
		if (slot.perishSongCounter !== undefined && slot.perishSongCounter > 0) {
			slot.perishSongCounter--;
			messageLog.push(`${slot.pokemon.species}'s perish count fell to ${slot.perishSongCounter}!`);
			if (slot.perishSongCounter === 0) {
				slot.pokemon.hp = 0;
				messageLog.push(`${slot.pokemon.species} fainted from Perish Song!`);
			}
		}
	});

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
