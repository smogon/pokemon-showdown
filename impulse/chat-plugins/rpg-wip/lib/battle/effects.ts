/*
* Pokemon Showdown
* RPG Battle End-of-Turn (EOT) Effects
*/

import { Dex, toID } from '../../../../sim/dex';
import { RPGAbilities } from '../abilities';
import { getActiveSlots, getMove } from '../utils';
import type { ActivePokemonSlot, BattleState } from '../interface';
import {
	activateUnburden,
	applyStatChange,
	consumeBerry,
} from '../battle-shared';

import {
	getCustomEffectiveness,
	getStatMultiplier,
} from './utils';

export function applyEOTStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;
	const status = slot.status;

	if (status === 'brn') {
		const ability = toID(pokemon.ability || '');
		if (ability !== 'heatproof') {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was hurt by its burn!</span>`);
		}
	} else if (status === 'psn') {
		// ... (logic for poison)
	} else if (status === 'tox') {
		// ... (logic for toxic)
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
			slot.status = 'tox';
			slot.toxicCounter = 1;
			messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was badly poisoned by its Toxic Orb!</span>`);
		}
	}

	if (slot.status && pokemon.item === 'lumberry') {
		slot.status = null;
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> ate its <strong>Lum Berry</strong> and cured its status condition!</span>`);
		consumeBerry(slot, 'lumberry', messageLog);
		return true;
	}

	if (pokemon.item === 'leftovers' && pokemon.hp < pokemon.maxHp) {
		pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Leftovers</strong>!</span>`);
	} else if (pokemon.item === 'blacksludge') {
		// ... (logic for black sludge)
	} else if (pokemon.item === 'stickybarb') {
		// ... (logic for sticky barb)
	}

	return false;
}

export function applyEOTVolatileStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	// ... (logic from battle-eot.ts)
}

export function applyEOTHealingEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	// ... (logic from battle-eot.ts)
}

export function applyEOTLeechSeedDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	// ... (logic from battle-eot.ts)
}

export function decrementEOTVolatileCounters(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	// ... (logic from battle-eot.ts)
}

export function handleEndOfTurnEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	// ... (logic from battle-eot.ts)
}

export function handleEndOfTurnWeather(battle: BattleState, messageLog: string[], allSlots: ActivePokemonSlot[]) {
	// ... (logic from battle-eot.ts)
}

export function handleEndOfTurnFieldEffects(battle: BattleState, messageLog: string[], allSlots: ActivePokemonSlot[]) {
	// ... (logic from battle-eot.ts)
}

export function processEndOfTurn(battle: BattleState, messageLog: string[]) {
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

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

	// ... (rest of processEndOfTurn logic)
}
