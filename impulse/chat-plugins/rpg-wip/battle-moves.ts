import { Dex, toID } from '../../../sim/dex';
import type { RPGPokemon, ActivePokemonSlot, BattleState, Move, Stats } from './interface';
import {
	getMove,
	getActiveSlots,
	checkStatDropAbilities,
	checkMentalHerb,
	activateUnburden,
	applySynchronize,
	applyStatChange,
	INITIAL_STAT_STAGES,
} from './utils';
import { ITEMS_DATABASE } from './items';
import { RPGAbilities } from './abilities';
import { getStatMultiplier } from './battle-core';
import { getPlayerData } from './core'; // Added missing import

// #region Constants & Config

const FLING_POWERS: Record<string, number> = {
	'leftovers': 10, 'oranberry': 10, 'berryjuice': 10, 'sitrusberry': 10, 'lumberry': 10, 'focussash': 10,
	'choiceband': 10, 'choicescarf': 10, 'choicespecs': 10, 'lifeorb': 30, 'rockyhelmet': 60, 'assaultvest': 80, 'ironball': 130,
};

const WEATHER_MAP: Record<string, 'sun' | 'rain' | 'sand' | 'hail'> = {
	'raindance': 'rain', 'sunnyday': 'sun', 'sandstorm': 'sand', 'hail': 'hail', 'snowscape': 'hail',
};

const TERRAIN_MAP: Record<string, 'electric' | 'grassy' | 'misty' | 'psychic'> = {
	'electricterrain': 'electric', 'grassyterrain': 'grassy', 'mistyterrain': 'misty', 'psychicterrain': 'psychic',
};

const SEMI_INVULNERABLE_STATES = ['fly', 'dig', 'dive', 'bounce', 'shadowforce', 'phantomforce'];

// #endregion

// #region Helpers

function hasAromaVeilProtection(targetSlot: ActivePokemonSlot, battle: BattleState): boolean {
	const isPlayerTarget = battle.playerSlots.some(s => s?.pokemon.id === targetSlot.pokemon.id);
	const allies = isPlayerTarget ? battle.playerSlots : battle.opponentSlots;
	return allies.some(slot => slot && slot.pokemon.hp > 0 && toID(slot.pokemon.ability || '') === 'aromaveil');
}

function getWeightPower(weight: number, thresholds: number[], powers: number[]): number {
	for (let i = 0; i < thresholds.length; i++) {
		if (weight < thresholds[i]) return powers[i];
	}
	return powers[powers.length - 1];
}

function getRatioPower(ratio: number, thresholds: number[], powers: number[]): number {
	for (let i = 0; i < thresholds.length; i++) {
		if (ratio < thresholds[i]) return powers[i];
	}
	return powers[powers.length - 1];
}

// #endregion

// #region Damage Calculation Logic

type BPCalculator = (
	move: Move,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	aSlot: ActivePokemonSlot,
	dSlot: ActivePokemonSlot,
	battle: BattleState
) => number;

const BP_CALCULATORS: Record<string, BPCalculator> = {
	'reversal': (m, a) => getRatioPower(a.hp / a.maxHp, [0.0417, 0.1042, 0.2083, 0.3542, 0.6875], [200, 150, 100, 80, 40, 20]),
	'flail': (m, a) => getRatioPower(a.hp / a.maxHp, [0.0417, 0.1042, 0.2083, 0.3542, 0.6875], [200, 150, 100, 80, 40, 20]),
	'eruption': (m, a) => Math.max(1, Math.floor(150 * (a.hp / a.maxHp))),
	'waterspout': (m, a) => Math.max(1, Math.floor(150 * (a.hp / a.maxHp))),
	'grassknot': (m, a, d) => getWeightPower(RPGAbilities.getModifiedWeight(d), [10, 25, 50, 100, 200], [20, 40, 60, 80, 100, 120]),
	'lowkick': (m, a, d) => getWeightPower(RPGAbilities.getModifiedWeight(d), [10, 25, 50, 100, 200], [20, 40, 60, 80, 100, 120]),
	'heavyslam': (m, a, d) => getRatioPower(RPGAbilities.getModifiedWeight(a) / RPGAbilities.getModifiedWeight(d), [2, 3, 4, 5], [40, 60, 80, 100, 120]),
	'heatcrash': (m, a, d) => {
		const r = RPGAbilities.getModifiedWeight(a) / RPGAbilities.getModifiedWeight(d);
		if (r >= 5) return 120; if (r >= 4) return 100; if (r >= 3) return 80; if (r >= 2) return 60; return 40;
	},
	'gyroball': (m, a, d, aSlot, dSlot) => {
		const aSpe = a.spe * getStatMultiplier(aSlot.statStages.spe);
		const dSpe = d.spe * getStatMultiplier(dSlot.statStages.spe);
		return dSpe > 0 ? Math.min(150, Math.floor(25 * (dSpe / aSpe))) : 1;
	},
	'electroball': (m, a, d, aSlot, dSlot) => {
		const aSpe = a.spe * getStatMultiplier(aSlot.statStages.spe);
		const dSpe = d.spe * getStatMultiplier(dSlot.statStages.spe);
		if (aSpe <= 0) return 40;
		const r = dSpe / aSpe;
		if (r >= 1) return 40; if (r >= 0.5) return 60; if (r >= 0.33) return 80; if (r >= 0.25) return 120; return 150;
	},
	'storedpower': (m, a, d, aSlot) => 20 + (20 * Object.values(aSlot.statStages).reduce((acc, val) => acc + (val > 0 ? val : 0), 0)),
	'powertrip': (m, a, d, aSlot) => 20 + (20 * Object.values(aSlot.statStages).reduce((acc, val) => acc + (val > 0 ? val : 0), 0)),
	'acrobatics': (m, a, d, aSlot, dSlot, battle) => (!a.item || battle.magicRoomTurns > 0) ? 110 : 55,
	'present': () => { const r = Math.random(); return r < 0.4 ? 40 : r < 0.7 ? 80 : r < 0.8 ? 120 : -1; },
	'magnitude': () => {
		const r = Math.random();
		if (r < 0.05) return 10; if (r < 0.15) return 30; if (r < 0.35) return 50; if (r < 0.65) return 70;
		if (r < 0.85) return 90; if (r < 0.95) return 110; return 150;
	},
	'spitup': (m, a, d, aSlot) => aSlot.stockpileCount === 0 ? 0 : 100 * aSlot.stockpileCount,
	'punishment': (m, a, d, aSlot, dSlot) => Math.min(200, 60 + (20 * Object.values(dSlot.statStages).reduce((acc, val) => acc + (val > 0 ? val : 0), 0))),
	'wringout': (m, a, d) => Math.floor(120 * (d.hp / d.maxHp)) + 1,
	'crushgrip': (m, a, d) => Math.floor(120 * (d.hp / d.maxHp)) + 1,
	'trumpcard': (m, a) => {
		const moveData = a.moves.find(mv => mv.id === m.id);
		if (!moveData) return 40;
		switch (moveData.pp) { case 0: return 200; case 1: return 80; case 2: return 60; case 3: return 50; default: return 40; }
	}
};

export function getDamageBasePower(
	move: Move,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	let bp = BP_CALCULATORS[move.id]
		? BP_CALCULATORS[move.id](move, attacker, defender, attackerSlot, defenderSlot, battle)
		: move.basePower;

	if (move.id === 'acrobatics' && bp === 110) return bp;
	if (move.id === 'acrobatics') bp = move.basePower * ((!attacker.item || battle.magicRoomTurns > 0) ? 2 : 1);

	if (attackerSlot.isHelped) bp = Math.floor(bp * 1.5);

	const dCharge = defenderSlot.chargingMove;
	if (dCharge) {
		if (dCharge === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) bp *= 2;
		if (dCharge === 'dive' && ['surf', 'whirlpool'].includes(move.id)) bp *= 2;
		if ((dCharge === 'fly' || dCharge === 'bounce') && ['twister', 'gust', 'skyuppercut'].includes(move.id)) bp *= 2;
	}

	const isStatus = (s: ActivePokemonSlot, list: string[]) => s.status && list.includes(s.status);
	const isWeather = RPGAbilities.isWeatherActive(battle);
	const isGroundedA = RPGAbilities.isGrounded(attacker, battle);
	const isGroundedD = RPGAbilities.isGrounded(defender, battle);

	if (move.id === 'facade' && isStatus(attackerSlot, ['psn', 'tox', 'brn', 'par'])) bp *= 2;
	if (move.id === 'brine' && defender.hp <= defender.maxHp / 2) bp *= 2;
	if (move.id === 'venoshock' && (defenderSlot.status === 'psn' || defenderSlot.status === 'tox')) bp *= 2;
	if (move.id === 'weatherball' && (isWeather || (battle.terrain && isGroundedA))) bp *= 2;
	if (move.id === 'terrainpulse' && battle.terrain && isGroundedA) bp *= 2;
	if (attackerSlot.isCharged && move.type === 'Electric') bp *= 2;
	if (['solarbeam', 'solarblade'].includes(move.id) && isWeather && ['rain', 'sand', 'hail'].includes(battle.weather!.type)) bp = Math.floor(bp * 0.5);
	if (move.id === 'knockoff' && defender.item) bp = Math.floor(bp * 1.5);
	if (move.id === 'assurance' && defenderSlot.lastDamageTaken) bp *= 2;
	if ((move.id === 'avalanche' || move.id === 'revenge') && attackerSlot.lastDamageTaken) bp *= 2;
	if (move.id === 'payback' && (attacker.spe * getStatMultiplier(attackerSlot.statStages.spe) < defender.spe * getStatMultiplier(defenderSlot.statStages.spe))) bp *= 2;
	if (move.id === 'hex' && (defenderSlot.status || toID(defender.ability || '') === 'comatose')) bp *= 2;
	if (move.id === 'wakeupslap' && defenderSlot.status === 'slp') bp *= 2;
	if (move.id === 'smellingsalts' && defenderSlot.status === 'par') bp *= 2;
	if (move.id === 'barbbarrage' && ['psn', 'tox'].includes(defenderSlot.status || '')) bp *= 2;
	if (move.id === 'infernalparade' && defenderSlot.status) bp *= 2;

	if (battle.terrain) {
		if (move.id === 'risingvoltage' && battle.terrain.type === 'electric' && isGroundedD) bp *= 2;
		if (move.id === 'expandingforce' && battle.terrain.type === 'psychic' && isGroundedA) bp = Math.floor(bp * 1.5);
		if (move.id === 'psyblade' && battle.terrain.type === 'electric') bp = Math.floor(bp * 1.5);
		if (move.id === 'mistyexplosion' && battle.terrain.type === 'misty' && isGroundedA) bp = Math.floor(bp * 1.5);
	}

	return bp;
}

// #endregion

// #region Move Preamble

function checkSemiInvulnerable(attacker: ActivePokemonSlot, defender: ActivePokemonSlot, move: Move, log: string[]): boolean {
	const dCharge = defender.chargingMove;
	if (!dCharge || !SEMI_INVULNERABLE_STATES.includes(dCharge)) return false;

	let isImmune = true;
	if (dCharge === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) isImmune = false;
	else if (dCharge === 'dive' && ['surf', 'whirlpool'].includes(move.id)) isImmune = false;
	else if ((dCharge === 'fly' || dCharge === 'bounce') && ['thunder', 'hurricane', 'twister', 'gust', 'skyuppercut', 'smackdown'].includes(move.id)) isImmune = false;

	if (isImmune) {
		log.push(`But it failed! ${defender.pokemon.species} avoided the attack!`);
		return true;
	}
	return false;
}

function checkOHKO(attacker: RPGPokemon, defender: RPGPokemon, move: Move, log: string[]): boolean {
	if (!move.ohko) return false;
	if (toID(defender.ability || '') === 'sturdy') {
		log.push(`But it failed! (${defender.species}'s Sturdy)`);
		return true;
	}
	if (defender.level > attacker.level) {
		log.push(`But it failed!`);
		return true;
	}
	const dTypes = Dex.species.get(defender.species).types;
	if ((move.ohko === 'Normal' && dTypes.includes('Ghost')) || (move.ohko === 'Ice' && dTypes.includes('Ice'))) {
		log.push(move.ohko === 'Normal' ? `It doesn't affect ${defender.species}...` : `But it failed!`);
		return true;
	}
	if (Math.random() * 100 < (30 + attacker.level - defender.level)) {
		defender.hp = 0;
		log.push(`<i style="color: #dc3545;">It's a one-hit KO!</i>`);
	} else {
		log.push(`${attacker.species}'s attack missed!`);
	}
	return true;
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

	if (move.id === 'steelroller' && !battle.terrain) {
		messageLog.push(`But it failed! (No terrain active)`);
		return true;
	}

	if (checkSemiInvulnerable(attackerSlot, defenderSlot, move, messageLog)) return true;

	if (move.id === 'counter' || move.id === 'mirrorcoat') {
		const targetCat = move.id === 'counter' ? 'Physical' : 'Special';
		if (attackerSlot.lastDamageTaken?.category !== targetCat) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const dmg = attackerSlot.lastDamageTaken.amount * 2;
		defender.hp = Math.max(0, defender.hp - dmg);
		messageLog.push(`${defender.species} took ${dmg} damage from the counter!`);
		return true;
	}

	if (move.id === 'fling') {
		if (battle.magicRoomTurns > 0 || !attacker.item) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const dmg = FLING_POWERS[attacker.item] || 30;
		defender.hp = Math.max(0, defender.hp - dmg);
		messageLog.push(`${attacker.species} flung its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt ${dmg} damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	if (move.id === 'naturalgift') {
		if (!attacker.item?.includes('berry')) {
			messageLog.push(`But it failed!`);
			return true;
		}
		defender.hp = Math.max(0, defender.hp - 80);
		messageLog.push(`${attacker.species} used its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt 80 damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	if (move.id === 'dreameater' && defenderSlot.status !== 'slp' && toID(defender.ability || '') !== 'comatose') {
		messageLog.push(`But it failed! (${defender.species} isn't asleep!)`);
		return true;
	}

	return checkOHKO(attacker, defender, move, messageLog);
}

// #endregion

// #region Specific Status Move Handlers

type StatusHandler = (aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot | null, move: Move, battle: BattleState, log: string[]) => boolean;

const STATUS_HANDLERS: Record<string, StatusHandler> = {
	'roar': (aSlot, dSlot, m, battle, log) => {
		if (!dSlot) { log.push(`But it failed!`); return true; }
		if (toID(dSlot.pokemon.ability || '') === 'suctioncups') { log.push(`${dSlot.pokemon.species}'s ${dSlot.pokemon.ability} anchors it in place!`); return true; }
		if (dSlot.isIngrained) { log.push(`${dSlot.pokemon.species} is rooted in place!`); return true; }

		const isPlayer = battle.playerSlots.includes(dSlot);
		const slots = isPlayer ? battle.playerSlots : battle.opponentSlots;
		const party = isPlayer ? getPlayerData(battle.playerId).party : battle.opponentParty;
		const unused = party.filter(p => p.hp > 0 && !slots.some(s => s?.pokemon.id === p.id));

		if (unused.length === 0) { log.push(`But it failed! (No Pokémon to switch to!)`); return true; }
		log.push(`${dSlot.pokemon.species} was blown away!`);
		const idx = slots.indexOf(dSlot);
		if (idx !== -1) slots[idx] = null;
		return true;
	},
	'whirlwind': (a, d, m, b, l) => STATUS_HANDLERS['roar'](a, d, m, b, l),
	'defog': (aSlot, dSlot, m, battle, log) => {
		battle.playerHazards = []; battle.opponentHazards = [];
		log.push('The entry hazards were removed from the field!');
		const sides = [battle.opponentReflectTurns, battle.opponentLightScreenTurns, battle.opponentAuroraVeilTurns, (battle as any).opponentMistTurns];
		if (sides.some(t => t > 0)) log.push("The opposing team's barriers wore off!");
		battle.opponentReflectTurns = 0; battle.opponentLightScreenTurns = 0; battle.opponentAuroraVeilTurns = 0; (battle as any).opponentMistTurns = 0;

		const mySides = [battle.playerReflectTurns, battle.playerLightScreenTurns, battle.playerAuroraVeilTurns, (battle as any).playerMistTurns];
		if (mySides.some(t => t > 0)) log.push("Your team's barriers wore off!");
		battle.playerReflectTurns = 0; battle.playerLightScreenTurns = 0; battle.playerAuroraVeilTurns = 0; (battle as any).playerMistTurns = 0;

		if (dSlot) applyStatChange(dSlot, 'evasion', -1, battle, log, aSlot);
		return true;
	},
	'leechseed': (a, dSlot, m, b, log) => {
		if (!dSlot) { log.push('But it failed!'); return true; }
		if (Dex.species.get(dSlot.pokemon.species).types.includes('Grass')) log.push(`It doesn't affect ${dSlot.pokemon.species}...`);
		else if (dSlot.isSeeded) log.push(`${dSlot.pokemon.species} is already seeded!`);
		else { dSlot.isSeeded = true; log.push(`${dSlot.pokemon.species} was seeded!`); }
		return true;
	},
	'curse': (aSlot, dSlot, m, battle, log) => {
		const isGhost = Dex.species.get(aSlot.pokemon.species).types.includes('Ghost');
		if (isGhost) {
			if (!dSlot || dSlot.isCursed) log.push('But it failed!');
			else {
				aSlot.pokemon.hp = Math.max(1, Math.floor(aSlot.pokemon.hp / 2));
				log.push(`${aSlot.pokemon.species} cut its own HP to lay a curse!`);
				dSlot.isCursed = true;
				log.push(`${dSlot.pokemon.species} was cursed!`);
			}
		} else {
			handleGenericBoostMove(aSlot, dSlot, m, battle, log);
		}
		return true;
	},
	'psychup': (a, d, m, b, log) => {
		if (!d) { log.push('But it failed!'); return true; }
		a.statStages = { ...d.statStages };
		log.push(`${a.pokemon.species} copied ${d.pokemon.species}'s stat changes!`);
		return true;
	},
	'trick': (a, d, m, b, log) => handleItemSwap(a, d, b, log),
	'switcheroo': (a, d, m, b, log) => handleItemSwap(a, d, b, log),
	'nightmare': (a, d, m, b, log) => {
		if (!d || d.status !== 'slp' || d.hasNightmare) log.push('But it failed!');
		else { d.hasNightmare = true; log.push(`${d.pokemon.species} began having a nightmare!`); }
		return true;
	},
	'bestow': (a, d, m, b, log) => {
		if (!d || b.magicRoomTurns > 0 || !a.pokemon.item || d.pokemon.item || RPGAbilities.checkItemRemovalPrevention(d.pokemon)) {
			log.push('But it failed!');
		} else {
			d.pokemon.item = a.pokemon.item; a.pokemon.item = undefined;
			activateUnburden(a, log);
			log.push(`${a.pokemon.species} gave ${ITEMS_DATABASE[d.pokemon.item]?.name || d.pokemon.item} to ${d.pokemon.species}!`);
		}
		return true;
	},
	'transform': (a, d, m, b, log) => {
		if (!d) { log.push('But it failed!'); return true; }
		const target = d.pokemon; const user = a.pokemon;
		const originalSpecies = user.species;
		user.species = target.species;
		user.atk = target.atk; user.def = target.def; user.spa = target.spa; user.spd = target.spd; user.spe = target.spe;
		user.moves = target.moves.map(mv => ({ id: mv.id, pp: 5 }));
		if (target.ability) user.ability = target.ability;
		a.statStages = { ...d.statStages };
		log.push(`${originalSpecies} transformed into ${target.species}!`);
		return true;
	},
	'helpinghand': (a, d, m, b, log) => {
		if (!d) { log.push('But it failed!'); return true; }
		d.isHelped = true; log.push(`${a.pokemon.species} is ready to help ${d.pokemon.species}!`);
		return true;
	},
	'substitute': (a, d, m, b, log) => {
		if (a.substitute) log.push(`${a.pokemon.species} already has a substitute!`);
		else if (a.pokemon.hp <= Math.floor(a.pokemon.maxHp / 4)) log.push('But it does not have enough HP left to make a substitute!');
		else {
			const cost = Math.floor(a.pokemon.maxHp / 4);
			a.pokemon.hp -= cost; a.substitute = { hp: cost };
			log.push(`${a.pokemon.species} made a substitute!`);
		}
		return true;
	},
	'charge': (a, d, m, b, log) => { a.isCharged = true; log.push(`${a.pokemon.species} began charging power!`); return false; },
	'stockpile': (a, d, m, b, log) => {
		if (a.stockpileCount >= 3) { log.push(`${a.pokemon.species} can't stockpile any more!`); return true; }
		a.stockpileCount++;
		log.push(`${a.pokemon.species} stockpiled ${a.stockpileCount}!`);
		const boost = toID(a.pokemon.ability || '') === 'contrary' ? -1 : 1;
		applyStatChange(a, 'def', boost, b, log, a); applyStatChange(a, 'spd', boost, b, log, a);
		return true;
	},
	'spitup': (a, d, m, b, log) => {
		if (a.stockpileCount === 0) { log.push('But it failed! (No stockpiles)'); return true; }
		a.statStages.def -= a.stockpileCount; a.statStages.spd -= a.stockpileCount; a.stockpileCount = 0;
		log.push(`${a.pokemon.species} released its stockpiled power!`);
		return false;
	},
	'swallow': (a, d, m, b, log) => {
		if (a.stockpileCount === 0 || a.pokemon.hp >= a.pokemon.maxHp) { log.push('But it failed!'); return true; }
		const amts = [0, 0.25, 0.5, 1];
		const heal = Math.floor(a.pokemon.maxHp * amts[a.stockpileCount]);
		const old = a.pokemon.hp;
		a.pokemon.hp = Math.min(a.pokemon.maxHp, a.pokemon.hp + heal);
		log.push(`${a.pokemon.species} restored ${a.pokemon.hp - old} HP!`);
		a.statStages.def -= a.stockpileCount; a.statStages.spd -= a.stockpileCount; a.stockpileCount = 0;
		return true;
	},
	'bellydrum': (a, d, m, b, log) => {
		if (a.substitute || a.pokemon.hp <= a.pokemon.maxHp / 2) { log.push('But it failed!'); return true; }
		const contrary = toID(a.pokemon.ability || '') === 'contrary';
		if ((!contrary && a.statStages.atk >= 6) || (contrary && a.statStages.atk <= -6)) { log.push('But it failed!'); return true; }
		a.pokemon.hp = Math.floor(a.pokemon.hp - a.pokemon.maxHp / 2);
		a.statStages.atk = contrary ? -6 : 6;
		log.push(`${a.pokemon.species} cut its own HP and ${contrary ? 'minimized' : 'maximized'} its Attack!`);
		return true;
	},
	'futuresight': (a, d, m, b, log) => handleFutureMove(a, d, m, b, log),
	'doomdesire': (a, d, m, b, log) => handleFutureMove(a, d, m, b, log),
	'protect': (a, d, m, b, log) => handleProtect(a, log),
	'detect': (a, d, m, b, log) => handleProtect(a, log),
	'followme': (a, d, m, b, log) => { a.isRedirecting = true; log.push(`${a.pokemon.species} became the center of attention!`); return true; },
	'ragepowder': (a, d, m, b, log) => { a.isRedirecting = true; log.push(`${a.pokemon.species} became the center of attention!`); return true; },
	'haze': (a, d, m, b, log) => {
		getActiveSlots([...b.playerSlots, ...b.opponentSlots]).forEach(s => s.statStages = { ...INITIAL_STAT_STAGES });
		log.push('All stat changes were eliminated!'); return true;
	},
	'perishsong': (a, d, m, b, log) => {
		let c = 0;
		getActiveSlots([...b.playerSlots, ...b.opponentSlots]).forEach(s => {
			if (toID(s.pokemon.ability || '') !== 'soundproof' && !s.perishSongCounter) { s.perishSongCounter = 3; c++; }
		});
		log.push(c > 0 ? 'All Pokémon that heard the song will faint in three turns!' : 'But it failed!');
		return true;
	},
	'courtchange': (a, d, m, b, log) => {
		const swap = <T>(k1: keyof BattleState, k2: keyof BattleState) => { const t = b[k1]; b[k1] = b[k2] as any; b[k2] = t as any; };
		swap('playerHazards', 'opponentHazards');
		swap('playerReflectTurns', 'opponentReflectTurns');
		swap('playerLightScreenTurns', 'opponentLightScreenTurns');
		swap('playerAuroraVeilTurns', 'opponentAuroraVeilTurns');
		const anyB = b as any;
		const tempMist = anyB.playerMistTurns; anyB.playerMistTurns = anyB.opponentMistTurns; anyB.opponentMistTurns = tempMist;
		log.push(`${a.pokemon.species} swapped the battle effects on both sides of the field!`);
		return true;
	},
	'flowershield': (a, d, m, b, log) => {
		let c = 0;
		getActiveSlots([...b.playerSlots, ...b.opponentSlots]).forEach(s => {
			if (Dex.species.get(s.pokemon.species).types.includes('Grass') && s.statStages.def < 6) {
				s.statStages.def++; log.push(`${s.pokemon.species}'s Defense rose!`); c++;
			}
		});
		if (c === 0) log.push('But it failed!');
		return true;
	},
	'rototiller': (a, d, m, b, log) => {
		let c = 0;
		getActiveSlots([...b.playerSlots, ...b.opponentSlots]).forEach(s => {
			if (Dex.species.get(s.pokemon.species).types.includes('Grass') && RPGAbilities.isGrounded(s.pokemon, b)) {
				let worked = false;
				if (s.statStages.atk < 6) { s.statStages.atk++; worked = true; }
				if (s.statStages.spa < 6) { s.statStages.spa++; worked = true; }
				if (worked) { log.push(`${s.pokemon.species}'s Attack and Sp. Atk rose!`); c++; }
			}
		});
		if (c === 0) log.push('But it failed!');
		return true;
	},
	'teatime': (a, d, m, b, log) => {
		let c = 0;
		getActiveSlots([...b.playerSlots, ...b.opponentSlots]).forEach(s => {
			const item = s.pokemon.item;
			if (item && (ITEMS_DATABASE[item]?.category === 'berry' || item.endsWith('berry'))) {
				log.push(`${s.pokemon.species} consumed its ${ITEMS_DATABASE[item]?.name || item}!`);
				s.pokemon.item = undefined; activateUnburden(s, log); c++;
			}
		});
		if (c === 0) log.push('But it failed!');
		return true;
	},
	'healbell': (a, d, m, b, log) => handleTeamStatusHeal(a, b, log, 'A bell chimed!'),
	'aromatherapy': (a, d, m, b, log) => handleTeamStatusHeal(a, b, log, 'A soothing aroma wafted through the area!'),
	'rest': (a, d, m, b, log) => {
		if (a.pokemon.hp >= a.pokemon.maxHp) log.push(`But it failed! (${a.pokemon.species}'s HP is already full!)`);
		else if (a.status === 'slp') log.push(`But it failed! (${a.pokemon.species} is already asleep!)`);
		else {
			const diff = a.pokemon.maxHp - a.pokemon.hp;
			a.pokemon.hp = a.pokemon.maxHp; a.status = 'slp'; a.sleepCounter = 2;
			log.push(`${a.pokemon.species} went to sleep and restored ${diff} HP!`);
		}
		return true;
	},
	'wish': (a, d, m, b, log) => { a.wishTurns = 2; log.push(`${a.pokemon.species} made a wish!`); return true; },
	'roost': (a, d, m, b, log) => handleSelfHeal(a, 0.5, log),
	'synthesis': (a, d, m, b, log) => handleWeatherHeal(a, b, log),
	'moonlight': (a, d, m, b, log) => handleWeatherHeal(a, b, log),
	'morningsun': (a, d, m, b, log) => handleWeatherHeal(a, b, log),
	'shoreup': (a, d, m, b, log) => {
		const isSand = RPGAbilities.isWeatherActive(b) && b.weather?.type === 'sand';
		handleSelfHeal(a, isSand ? 0.667 : 0.5, log);
		return true;
	},
	'painsplit': (a, d, m, b, log) => {
		if (!d) { log.push('But it failed!'); return true; }
		const avg = Math.floor((a.pokemon.hp + d.pokemon.hp) / 2);
		const gainA = avg - a.pokemon.hp; const gainD = avg - d.pokemon.hp;
		a.pokemon.hp = avg; d.pokemon.hp = avg;
		log.push(`The battlers shared their pain!`);
		if (gainA > 0) log.push(`${a.pokemon.species} gained ${gainA} HP!`);
		else if (gainA < 0) log.push(`${a.pokemon.species} lost ${-gainA} HP!`);
		if (gainD > 0) log.push(`${d.pokemon.species} gained ${gainD} HP!`);
		else if (gainD < 0) log.push(`${d.pokemon.species} lost ${-gainD} HP!`);
		return true;
	},
	'memento': (a, d, m, b, log) => {
		if (!d) { log.push('But it failed!'); return true; }
		let worked = false;
		if (d.statStages.atk > -6) { d.statStages.atk = Math.max(-6, d.statStages.atk - 2); worked = true; }
		if (d.statStages.spa > -6) { d.statStages.spa = Math.max(-6, d.statStages.spa - 2); worked = true; }
		if (worked) {
			log.push(`${d.pokemon.species}'s Attack and Sp. Atk harshly fell!`);
			a.pokemon.hp = 0; log.push(`${a.pokemon.species} fainted!`);
		} else log.push('But it failed!');
		return true;
	},
	'endeavor': (a, d, m, b, log) => {
		if (!d || a.pokemon.hp >= d.pokemon.hp) { log.push('But it failed!'); return true; }
		const dmg = d.pokemon.hp - a.pokemon.hp;
		d.pokemon.hp = a.pokemon.hp;
		log.push(`${d.pokemon.species} took ${dmg} damage!`);
		return true;
	},
	'block': (a, d, m, b, log) => handleTrap(d, log),
	'meanlook': (a, d, m, b, log) => handleTrap(d, log),
	'spiderweb': (a, d, m, b, log) => handleTrap(d, log),
	'fakeout': (a, d, m, b, log) => {
		if (a.activeTurns !== 1) { log.push('But it failed! (Fake Out only works on first turn)'); return true; }
		if (d) d.willFlinch = true;
		return false;
	}
};

function handleItemSwap(attacker: ActivePokemonSlot, defender: ActivePokemonSlot | null, battle: BattleState, log: string[]): boolean {
	if (!defender || battle.magicRoomTurns > 0 || RPGAbilities.checkItemRemovalPrevention(defender.pokemon) || RPGAbilities.checkItemRemovalPrevention(attacker.pokemon)) {
		log.push('But it failed!'); return true;
	}
	if (!attacker.pokemon.item && !defender.pokemon.item) { log.push('But it failed!'); return true; }
	const aItem = attacker.pokemon.item; const dItem = defender.pokemon.item;
	attacker.pokemon.item = dItem; defender.pokemon.item = aItem;
	log.push(`${attacker.pokemon.species} swapped items with ${defender.pokemon.species}!`);
	if (aItem) log.push(`${defender.pokemon.species} obtained a ${ITEMS_DATABASE[aItem]?.name || aItem}!`);
	if (dItem) log.push(`${attacker.pokemon.species} obtained a ${ITEMS_DATABASE[dItem]?.name || dItem}!`);
	if (aItem !== attacker.pokemon.item) activateUnburden(attacker, log);
	if (dItem !== defender.pokemon.item) activateUnburden(defender, log);
	return true;
}

function handleFutureMove(a: ActivePokemonSlot, d: ActivePokemonSlot | null, m: Move, b: BattleState, log: string[]): boolean {
	const isPlayer = b.playerSlots.some(s => s?.pokemon.id === a.pokemon.id);
	const targetIdx = (isPlayer ? b.opponentSlots : b.playerSlots).indexOf(d);
	if (targetIdx === -1) { log.push('But it failed!'); return true; }
	const list = isPlayer ? b.opponentFutureMoves : b.playerFutureMoves;
	if (list.some(fm => fm.slotIndex === targetIdx)) { log.push('But it failed!'); return true; }

	list.push({
		slotIndex: targetIdx, moveId: m.id, turnsLeft: 2, attackerSlotIndex: (isPlayer ? b.playerSlots : b.opponentSlots).indexOf(a),
		attackerStats: { atk: a.pokemon.atk * getStatMultiplier(a.statStages.atk), spa: a.pokemon.spa * getStatMultiplier(a.statStages.spa) }
	});
	log.push(`${a.pokemon.species} foresaw an attack!`);
	return true;
}

function handleProtect(a: ActivePokemonSlot, log: string[]): boolean {
	const chance = 1 / 3 ** a.protectSuccessCounter;
	if (Math.random() < chance) {
		a.isProtected = true; a.protectSuccessCounter++;
		log.push(`${a.pokemon.species} protected itself!`);
	} else {
		log.push('But it failed!');
	}
	return true;
}

function handleTeamStatusHeal(a: ActivePokemonSlot, b: BattleState, log: string[], msg: string): boolean {
	const isPlayer = b.playerSlots.some(s => s?.pokemon.id === a.pokemon.id);
	const slots = isPlayer ? b.playerSlots : b.opponentSlots;
	let c = 0;
	slots.forEach(s => { if (s?.status) { s.status = null; s.sleepCounter = 0; c++; } });
	log.push(c > 0 ? `${msg} The team's status conditions were healed!` : 'But it failed!');
	return true;
}

function handleSelfHeal(a: ActivePokemonSlot, ratio: number, log: string[]): boolean {
	if (a.pokemon.hp >= a.pokemon.maxHp) { log.push(`But it failed! (${a.pokemon.species}'s HP is already full!)`); return true; }
	const amt = Math.floor(a.pokemon.maxHp * ratio);
	const old = a.pokemon.hp;
	a.pokemon.hp = Math.min(a.pokemon.maxHp, a.pokemon.hp + amt);
	log.push(`${a.pokemon.species} restored ${a.pokemon.hp - old} HP!`);
	return true;
}

function handleWeatherHeal(a: ActivePokemonSlot, b: BattleState, log: string[]): boolean {
	let ratio = 0.5;
	if (RPGAbilities.isWeatherActive(b)) {
		if (b.weather?.type === 'sun' || b.weather?.type === 'harsh-sun') ratio = 0.667;
		else if (['rain', 'sand', 'hail', 'heavy-rain'].includes(b.weather!.type)) ratio = 0.25;
	}
	return handleSelfHeal(a, ratio, log);
}

function handleTrap(d: ActivePokemonSlot | null, log: string[]): boolean {
	if (!d) { log.push('But it failed!'); return true; }
	if (Dex.species.get(d.pokemon.species).types.includes('Ghost')) { log.push(`It doesn't affect ${d.pokemon.species}...`); return true; }
	if (d.isTrapped) log.push(`${d.pokemon.species} is already trapped!`);
	else { d.isTrapped = { turns: 5 }; log.push(`${d.pokemon.species} can no longer escape!`); }
	return true;
}

export function handleSpecificStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const handler = STATUS_HANDLERS[move.id];
	return handler ? handler(attackerSlot, defenderSlot, move, battle, messageLog) : false;
}

// #endregion

// #region Generic Handlers

export function handleGenericBoostMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.boosts) return false;
	const isSelf = move.target === 'self';
	const targetSlot = isSelf ? attackerSlot : defenderSlot;

	if (!targetSlot) { messageLog.push(`But it failed! (No target)`); return true; }
	if (!isSelf && targetSlot.substitute && Object.values(move.boosts).some(v => v < 0)) {
		messageLog.push(`But it failed! (${targetSlot.pokemon.species}'s Substitute blocked the move!)`);
		return true;
	}

	let hadEffect = false;
	let triggeredDefiant = false;

	for (const stat in move.boosts) {
		let val = move.boosts[stat as keyof typeof move.boosts]!;
		if (toID(targetSlot.pokemon.ability || '') === 'contrary') val *= -1;

		if (val < 0 && !isSelf) {
			if (battle.magicRoomTurns === 0 && targetSlot.pokemon.item === 'clearamulet') { messageLog.push(`${targetSlot.pokemon.species}'s Clear Amulet prevents stats lowering!`); continue; }
			const ability = toID(targetSlot.pokemon.ability || '');
			if (['clearbody', 'whitesmoke', 'fullmetalbody'].includes(ability)) { messageLog.push(`${targetSlot.pokemon.species}'s ${targetSlot.pokemon.ability} prevents stats lowering!`); continue; }
			if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(ability)) { messageLog.push(`${targetSlot.pokemon.species}'s ${targetSlot.pokemon.ability} prevents Attack lowering!`); continue; }
		}

		const stage = targetSlot.statStages[stat as keyof typeof targetSlot.statStages];
		const newStage = Math.max(-6, Math.min(6, stage + val));

		if (stage !== newStage) {
			targetSlot.statStages[stat as keyof typeof targetSlot.statStages] = newStage;
			messageLog.push(`${targetSlot.pokemon.species}'s ${stat.toUpperCase()} ${Math.abs(val) > 1 ? 'sharply ' : ''}${val > 0 ? 'rose' : 'fell'}!`);
			hadEffect = true;
			if (val < 0 && !isSelf) triggeredDefiant = true;
		}
	}

	if (!hadEffect) messageLog.push('But it failed!');
	if (triggeredDefiant) checkStatDropAbilities(targetSlot, attackerSlot, battle, messageLog);
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
	const d = defenderSlot.pokemon;

	if (defenderSlot.substitute) { messageLog.push(`But it failed! (${d.species}'s Substitute blocked the move!)`); return true; }
	if (defenderSlot.status) { messageLog.push(`But it failed!`); return true; }

	const isGrounded = RPGAbilities.isGrounded(d, battle);
	if (battle.terrain?.type === 'misty' && isGrounded) { messageLog.push('The Misty Terrain prevents status conditions!'); return true; }
	if (battle.terrain?.type === 'electric' && move.status === 'slp' && isGrounded) { messageLog.push('The Electric Terrain prevents sleep!'); return true; }

	if (move.status === 'slp' && [...battle.playerSlots, ...battle.opponentSlots].some(s => s?.uproarTurns && s.uproarTurns > 0)) {
		messageLog.push('But the uproar kept it awake!'); return true;
	}
	if (RPGAbilities.preventsStatus(d, move.status, battle, attackerSlot.pokemon)) {
		messageLog.push(`${d.species}'s ${d.ability} prevents ${move.status}!`); return true;
	}

	const dSpecies = Dex.species.get(d.species);
	const typeImmunities = {
		'brn': dSpecies.types.includes('Fire'),
		'par': dSpecies.types.includes('Electric'),
		'psn': dSpecies.types.includes('Poison') || dSpecies.types.includes('Steel'),
		'frz': dSpecies.types.includes('Ice')
	};

	if (typeImmunities[move.status as keyof typeof typeImmunities]) { messageLog.push('But it failed!'); return true; }

	const status = move.id === 'toxic' ? 'tox' : move.status as any;
	defenderSlot.status = status;
	if (status === 'tox') defenderSlot.toxicCounter = 1;
	if (status === 'slp') defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 1;
	messageLog.push(`${d.species} was afflicted with ${status}!`);

	if (toID(d.ability || '') === 'synchronize') applySynchronize(status, defenderSlot, attackerSlot, battle, messageLog);
	return true;
}

const VOLATILE_HANDLERS: Record<string, (target: ActivePokemonSlot, battle: BattleState, log: string[], attacker: ActivePokemonSlot, move: Move) => boolean> = {
	'confusion': (t, b, log) => {
		if (t.isConfused) return false;
		if (toID(t.pokemon.ability || '') === 'owntempo') { log.push(`${t.pokemon.species}'s Own Tempo prevents confusion!`); return false; }
		t.isConfused = true; t.confusionCounter = Math.floor(Math.random() * 4) + 1;
		log.push(`${t.pokemon.species} became confused!`);
		return true;
	},
	'taunt': (t, b, log) => {
		if (t.tauntTurns > 0 || hasAromaVeilProtection(t, b)) {
			if (hasAromaVeilProtection(t, b)) log.push(`${t.pokemon.species} is protected by Aroma Veil!`);
			return false;
		}
		t.tauntTurns = 3; log.push(`${t.pokemon.species} fell for the taunt!`);
		checkMentalHerb(t, b, log);
		return true;
	},
	'trap': (t, b, log) => { if (t.isTrapped) return false; t.isTrapped = { turns: 5 }; log.push(`${t.pokemon.species} can no longer escape!`); return true; },
	'yawn': (t, b, log) => {
		if (t.status || t.yawnCounter) return false;
		const immune = (b.terrain?.type === 'electric' && RPGAbilities.isGrounded(t.pokemon, b)) ||
			['insomnia', 'vitalspirit', 'comatose', 'sweetveil'].includes(toID(t.pokemon.ability || ''));
		if (immune) return false;
		t.yawnCounter = 2; log.push(`${t.pokemon.species} grew drowsy!`);
		return true;
	},
	'disable': (t, b, log) => {
		if (!t.lastMoveUsed || t.disabledMove || hasAromaVeilProtection(t, b)) {
			if (hasAromaVeilProtection(t, b)) log.push(`${t.pokemon.species} is protected by Aroma Veil!`);
			return false;
		}
		t.disabledMove = { moveId: t.lastMoveUsed, turns: 4 }; log.push(`${t.pokemon.species}'s ${t.lastMoveUsed} was disabled!`);
		checkMentalHerb(t, b, log);
		return true;
	},
	'encore': (t, b, log) => {
		if (!t.lastMoveUsed || t.encoreMove || hasAromaVeilProtection(t, b)) {
			if (hasAromaVeilProtection(t, b)) log.push(`${t.pokemon.species} is protected by Aroma Veil!`);
			return false;
		}
		t.encoreMove = { moveId: t.lastMoveUsed, turns: 3 }; log.push(`${t.pokemon.species} received an encore!`);
		checkMentalHerb(t, b, log);
		return true;
	},
	'ingrain': (t, b, log) => { if (t.isIngrained) return false; t.isIngrained = true; log.push(`${t.pokemon.species} planted its roots!`); return true; },
	'aquaring': (t, b, log) => { if (t.hasAquaRing) return false; t.hasAquaRing = true; log.push(`${t.pokemon.species} surrounded itself with a veil of water!`); return true; },
	'focusenergy': (t, b, log) => { if (t.focusEnergy) return false; t.focusEnergy = true; log.push(`${t.pokemon.species} is getting pumped!`); return true; },
	'magnetrise': (t, b, log) => {
		if (b.gravityTurns > 0) { log.push('But it failed! (Gravity)'); return false; }
		if (t.magnetRiseTurns > 0) return false;
		t.magnetRiseTurns = 5; log.push(`${t.pokemon.species} levitated with electromagnetism!`); return true;
	},
	'telekinesis': (t, b, log) => {
		if (b.gravityTurns > 0) { log.push('But it failed! (Gravity)'); return false; }
		if (t.telekinesisCounter > 0) return false;
		t.telekinesisCounter = 3; log.push(`${t.pokemon.species} was hurled into the air!`); return true;
	},
	'smackdown': (t, b, log) => { if (t.isSmackedDown) return false; t.isSmackedDown = true; log.push(`${t.pokemon.species} fell straight down!`); return true; },
	'torment': (t, b, log) => {
		if (t.tormentActive || hasAromaVeilProtection(t, b)) { if (hasAromaVeilProtection(t, b)) log.push('Protected by Aroma Veil!'); return false; }
		t.tormentActive = true; log.push(`${t.pokemon.species} was subjected to torment!`);
		checkMentalHerb(t, b, log);
		return true;
	},
	'embargo': (t, b, log) => { if (t.embargoTurns > 0) return false; t.embargoTurns = 5; log.push(`${t.pokemon.species} can't use items anymore!`); return true; },
	'healblock': (t, b, log) => {
		if (t.healBlockTurns > 0) return false;
		t.healBlockTurns = 5; log.push(`${t.pokemon.species} was prevented from healing!`);
		checkMentalHerb(t, b, log);
		return true;
	},
	'partiallytrapped': (t, b, log, attacker, move) => {
		if (t.partiallyTrapped) return false;
		const turns = attacker.pokemon.item === 'gripclaw' ? 7 : Math.floor(Math.random() * 3) + 4;
		const damage = attacker.pokemon.item === 'bindingband' ? 6 : 8;
		t.partiallyTrapped = { turns, moveId: move.id, damage };
		log.push(`${t.pokemon.species} was trapped by ${move.name}!`);
		return true;
	}
};

export function handleGenericVolatileMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.volatileStatus) return false;
	const targetSlot = move.target === 'self' ? attackerSlot : defenderSlot;
	if (!targetSlot) { messageLog.push(`But it failed!`); return true; }
	if (move.target !== 'self' && targetSlot.substitute) {
		messageLog.push(`But it failed! (${targetSlot.pokemon.species}'s Substitute blocked the move!)`);
		return true;
	}

	const handler = VOLATILE_HANDLERS[move.volatileStatus];
	if (handler) {
		if (!handler(targetSlot, battle, messageLog, attackerSlot, move)) messageLog.push('But it failed!');
	} else {
		messageLog.push('But it failed!');
	}
	return true;
}

export function handleGenericHealMove(attackerSlot: ActivePokemonSlot, move: Move, messageLog: string[]): boolean {
	if (!move.flags.heal) return false;
	if (attackerSlot.healBlockTurns > 0) { messageLog.push(`But it failed! (${attackerSlot.pokemon.species} is prevented from healing!)`); return true; }
	return handleSelfHeal(attackerSlot, (move.heal?.[0] || 1) / (move.heal?.[1] || 2), messageLog);
}

export function handleGenericFieldMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const a = attackerSlot.pokemon;
	const dur = 5; const extDur = 8;

	if (move.weather) {
		const type = WEATHER_MAP[toID(move.weather)];
		if (!type) { messageLog.push('But it failed!'); return true; }
		if (battle.weather?.type === type) { messageLog.push('But it failed!'); }
		else {
			const rocks: Record<string, string> = { 'damprock': 'rain', 'heatrock': 'sun', 'smoothrock': 'sand', 'icyrock': 'hail' };
			const turns = (battle.magicRoomTurns === 0 && a.item && rocks[a.item] === type) ? extDur : dur;
			battle.weather = { type, turns };
			messageLog.push({ 'sun': 'The sunlight turned harsh!', 'rain': 'It started to rain!', 'sand': 'A sandstorm kicked up!', 'hail': 'It started to snow!' }[type]!);
		}
		return true;
	}

	if (move.terrain) {
		const type = TERRAIN_MAP[toID(move.terrain)];
		if (type) {
			if (battle.terrain?.type === type) messageLog.push('But it failed!');
			else { battle.terrain = { type, turns: dur }; messageLog.push(`${a.species} turned the battlefield into ${type} terrain!`); }
			return true;
		}
	}

	const pseudo = move.pseudoWeather || move.id;
	if (['trickroom', 'magicroom', 'wonderroom'].includes(pseudo)) {
		const key = `${pseudo}Turns` as keyof BattleState;
		if ((battle[key] as number) > 0) { (battle as any)[key] = 0; messageLog.push('The bizarre dimensions disappeared.'); }
		else { (battle as any)[key] = dur; messageLog.push(pseudo === 'trickroom' ? `${a.species} twisted the dimensions!` : 'It created a bizarre area!'); }
		return true;
	}

	if (pseudo.endsWith('terrain')) {
		const type = pseudo.replace('terrain', '') as any;
		if (battle.terrain?.type === type) messageLog.push('But it failed!');
		else { battle.terrain = { type, turns: dur }; messageLog.push(`${a.species} turned the battlefield into ${type} terrain!`); }
		return true;
	}

	if (['gravity', 'mudsport', 'watersport'].includes(pseudo)) {
		const key = `${pseudo === 'gravity' ? 'gravity' : pseudo === 'mudsport' ? 'mudSport' : 'waterSport'}Turns` as keyof BattleState;
		if ((battle[key] as number) > 0) messageLog.push('But it failed!');
		else { (battle as any)[key] = dur; messageLog.push(pseudo === 'gravity' ? 'Gravity intensified!' : `${pseudo === 'mudsport' ? "Electricity" : "Fire"}'s power was weakened!`); }
		return true;
	}

	if (pseudo === 'fairylock' || pseudo === 'iondeluge') {
		const key = pseudo === 'fairylock' ? 'fairyLockTurns' : 'ionDelugeTurns';
		if ((battle as any)[key] > 0) messageLog.push('But it failed!');
		else { (battle as any)[key] = 1; messageLog.push(pseudo === 'fairylock' ? 'No one will be able to run away!' : 'A deluge of ions showers the battlefield!'); }
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
	const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === attackerSlot.pokemon.id);
	const targetHazards = isPlayer ? battle.opponentHazards : battle.playerHazards;
	const prefix = isPlayer ? 'player' : 'opponent';
	
	if (move.id === 'mist') {
		const key = `${isPlayer ? 'player' : 'opponent'}MistTurns` as keyof BattleState;
		if ((battle as any)[key] === 0) { (battle as any)[key] = 5; messageLog.push(`${isPlayer ? 'Your' : 'The opposing'} team became shrouded in mist!`); }
		else messageLog.push('But it failed!');
		return true;
	}

	if (['reflect', 'lightscreen', 'auroraveil'].includes(move.id)) {
		const dur = (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'lightclay') ? 8 : 5;
		const key = `${prefix}${move.id === 'reflect' ? 'Reflect' : move.id === 'lightscreen' ? 'LightScreen' : 'AuroraVeil'}Turns` as keyof BattleState;
		
		if (move.id === 'auroraveil' && (!RPGAbilities.isWeatherActive(battle) || battle.weather?.type !== 'hail')) { messageLog.push('But it failed!'); return true; }

		if ((battle as any)[key] === 0) {
			(battle as any)[key] = dur;
			messageLog.push(`${move.name} raised ${isPlayer ? 'your' : 'the opposing'} team's defenses!`);
		} else messageLog.push('But it failed!');
		return true;
	}

	if (move.sideCondition) {
		const id = toID(move.sideCondition);
		let added = false;
		if (id === 'spikes' && targetHazards.filter(h => h === 'spikes').length < 3) { targetHazards.push('spikes'); added = true; }
		else if (id === 'toxicspikes' && targetHazards.filter(h => h === 'toxicspikes').length < 2) { targetHazards.push('toxicspikes'); added = true; }
		else if (!targetHazards.includes(id as any) && ['stickyweb', 'stealthrock'].includes(id)) { targetHazards.push(id as any); added = true; }
		
		if (added) messageLog.push(`${move.name} scattered hazards around the opposing team!`);
		else messageLog.push('But it failed!');
		return true;
	}

	if (['quickguard', 'wideguard', 'craftyshield'].includes(move.id)) {
		const key = `${prefix}${move.id === 'quickguard' ? 'QuickGuard' : move.id === 'wideguard' ? 'WideGuard' : 'CraftyShield'}` as keyof BattleState;
		(battle as any)[key] = true;
		messageLog.push(`${attackerSlot.pokemon.species} is protecting its side!`);
		return true;
	}

	return false;
}

export function handleChargingMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[],
	ppDeduction: number
): boolean {
	if (!move.flags.charge) { if (attackerSlot.chargingMove === move.id) attackerSlot.chargingMove = undefined; return false; }
	if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'powerherb') {
		messageLog.push(`${attackerSlot.pokemon.species} consumed its Power Herb!`);
		attackerSlot.pokemon.item = undefined; activateUnburden(attackerSlot, messageLog);
		return false;
	}

	if (!attackerSlot.chargingMove) {
		attackerSlot.chargingMove = move.id;
		if (['fly', 'bounce'].includes(move.id) && battle.gravityTurns > 0) {
			messageLog.push('But it failed! (Gravity)'); attackerSlot.chargingMove = undefined; return false;
		}
		if (['solarbeam', 'solarblade'].includes(move.id) && RPGAbilities.isWeatherActive(battle) && ['sun', 'harsh-sun'].includes(battle.weather!.type)) {
			attackerSlot.chargingMove = undefined; return false;
		}

		const messages: Record<string, string> = {
			'fly': 'flew up high!', 'dig': 'burrowed underground!', 'dive': 'hid underwater!', 'bounce': 'sprang up!',
			'shadowforce': 'vanished instantly!', 'phantomforce': 'vanished instantly!', 'skyattack': 'became cloaked in a harsh light!',
			'geomancy': 'is absorbing power!', 'solarbeam': 'absorbed light!', 'solarblade': 'absorbed light!'
		};
		if (messages[move.id]) messageLog.push(`${attackerSlot.pokemon.species} ${messages[move.id]}`);
		if (moveObject.id !== 'struggle' && moveObject.pp > 0) moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
		return true;
	}
	return false;
}

export const RPGMoves = {
	getDamageBasePower, handleDamagingMovePreamble, handleSpecificStatusMove, handleGenericBoostMove,
	handleGenericStatusInflictMove, handleGenericVolatileMove, handleGenericHealMove, handleGenericFieldMove,
	handleGenericSideMove, handleChargingMove,
};

export default RPGMoves;
