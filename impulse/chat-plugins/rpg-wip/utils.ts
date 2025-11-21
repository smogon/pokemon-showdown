import { Dex, toID } from '../../../sim/dex';
import { createPokemon } from './core';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import { MANUAL_EVOLUTIONS } from './data-exp-evs-catch-rates';
import type { RPGPokemon, PlayerData, Stats, ActivePokemonSlot, Move, BattleState, Status } from './interface';
import { VIABLE_HELD_ITEMS, BERRY_FLAVORS, NATURE_FLAVOR_PREFERENCES, ITEMS_DATABASE } from './items';
import { RPGAbilities } from './abilities';

// #region Constants & Config

export const INITIAL_STAT_STAGES = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

export const TYPE_CHART: Record<string, { superEffective: string[], notVeryEffective: string[], noEffect: string[] }> = {
	Normal: { superEffective: [], notVeryEffective: ['Rock', 'Steel'], noEffect: ['Ghost'] },
	Fire: { superEffective: ['Grass', 'Ice', 'Bug', 'Steel'], notVeryEffective: ['Fire', 'Water', 'Rock', 'Dragon'], noEffect: [] },
	Water: { superEffective: ['Fire', 'Ground', 'Rock'], notVeryEffective: ['Water', 'Grass', 'Dragon'], noEffect: [] },
	Grass: { superEffective: ['Water', 'Ground', 'Rock'], notVeryEffective: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], noEffect: [] },
	Electric: { superEffective: ['Water', 'Flying'], notVeryEffective: ['Grass', 'Electric', 'Dragon'], noEffect: ['Ground'] },
	Ice: { superEffective: ['Grass', 'Ground', 'Flying', 'Dragon'], notVeryEffective: ['Fire', 'Water', 'Ice', 'Steel'], noEffect: [] },
	Fighting: { superEffective: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], notVeryEffective: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], noEffect: ['Ghost'] },
	Poison: { superEffective: ['Grass', 'Fairy'], notVeryEffective: ['Poison', 'Ground', 'Rock', 'Ghost'], noEffect: ['Steel'] },
	Ground: { superEffective: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], notVeryEffective: ['Grass', 'Bug'], noEffect: ['Flying'] },
	Flying: { superEffective: ['Grass', 'Fighting', 'Bug'], notVeryEffective: ['Electric', 'Rock', 'Steel'], noEffect: [] },
	Psychic: { superEffective: ['Fighting', 'Poison'], notVeryEffective: ['Psychic', 'Steel'], noEffect: ['Dark'] },
	Bug: { superEffective: ['Grass', 'Psychic', 'Dark'], notVeryEffective: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], noEffect: [] },
	Rock: { superEffective: ['Fire', 'Ice', 'Flying', 'Bug'], notVeryEffective: ['Fighting', 'Ground', 'Steel'], noEffect: [] },
	Ghost: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Dark'], noEffect: ['Normal'] },
	Dragon: { superEffective: ['Dragon'], notVeryEffective: ['Steel'], noEffect: ['Fairy'] },
	Dark: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Fighting', 'Dark', 'Fairy'], noEffect: [] },
	Steel: { superEffective: ['Ice', 'Rock', 'Fairy'], notVeryEffective: ['Fire', 'Water', 'Electric', 'Steel'], noEffect: [] },
	Fairy: { superEffective: ['Fighting', 'Dragon', 'Dark'], notVeryEffective: ['Fire', 'Poison', 'Steel'], noEffect: [] },
};

export const NATURES: Record<string, { plus: keyof Stats, minus: keyof Stats } | null> = {
	'Adamant': { plus: 'atk', minus: 'spa' }, 'Bashful': null, 'Brave': { plus: 'atk', minus: 'spe' },
	'Bold': { plus: 'def', minus: 'atk' }, 'Calm': { plus: 'spd', minus: 'atk' }, 'Careful': { plus: 'spd', minus: 'spa' },
	'Docile': null, 'Gentle': { plus: 'spd', minus: 'def' }, 'Hardy': null, 'Hasty': { plus: 'spe', minus: 'def' },
	'Impish': { plus: 'def', minus: 'spa' }, 'Jolly': { plus: 'spe', minus: 'spa' }, 'Lax': { plus: 'def', minus: 'spd' },
	'Lonely': { plus: 'atk', minus: 'def' }, 'Mild': { plus: 'spa', minus: 'def' }, 'Modest': { plus: 'spa', minus: 'atk' },
	'Naive': { plus: 'spe', minus: 'spd' }, 'Naughty': { plus: 'atk', minus: 'spd' }, 'Quiet': { plus: 'spa', minus: 'spe' },
	'Quirky': null, 'Rash': { plus: 'spa', minus: 'spd' }, 'Relaxed': { plus: 'def', minus: 'spe' },
	'Sassy': { plus: 'spd', minus: 'spe' }, 'Serious': null, 'Timid': { plus: 'spe', minus: 'atk' },
};

export const NATURE_LIST = Object.keys(NATURES);

const GROWTH_RATE_FORMULAS: Record<string, (n: number) => number> = {
	'Slow': n => Math.floor((5 * n ** 3) / 4),
	'Medium Fast': n => Math.floor(n ** 3),
	'Fast': n => Math.floor((4 * n ** 3) / 5),
	'Medium Slow': n => Math.floor(((6 / 5) * n ** 3) - (15 * n ** 2) + (100 * n) - 140),
	'Erratic': n => {
		if (n <= 50) return Math.floor((n ** 3 * (100 - n)) / 50);
		if (n <= 68) return Math.floor((n ** 3 * (150 - n)) / 100);
		if (n <= 98) return Math.floor((n ** 3 * Math.floor((1911 - 10 * n) / 3)) / 500);
		return Math.floor((n ** 3 * (160 - n)) / 100);
	},
	'Fluctuating': n => {
		if (n <= 15) return Math.floor(n ** 3 * ((Math.floor((n + 1) / 3) + 24) / 50));
		if (n <= 36) return Math.floor(n ** 3 * ((n + 14) / 50));
		return Math.floor(n ** 3 * ((Math.floor(n / 2) + 32) / 50));
	}
};

const STAT_PROTECTION_ABILITIES = ['clearbody', 'whitesmoke', 'fullmetalbody'];
const SPECIFIC_STAT_PROTECTION: Record<string, string> = { atk: 'hypercutter', def: 'bigpecks', accuracy: 'keeneye' };

// #endregion

// #region Party & Slot Management

export function getActiveSlots(slots: [ActivePokemonSlot | null, ActivePokemonSlot | null] | undefined): ActivePokemonSlot[] {
	return slots ? (slots.filter(slot => slot && slot.pokemon.hp > 0) as ActivePokemonSlot[]) : [];
}

export function getActiveParty(battle: BattleState, player: PlayerData): RPGPokemon[] {
	return battle.overridePlayerParty || player.party;
}

export function getSlotFromIndex(battle: BattleState, slotIndex: number): ActivePokemonSlot | null {
	const slot = [battle.playerSlots[0], battle.playerSlots[1], battle.opponentSlots[0], battle.opponentSlots[1]][slotIndex];
	return (slot && slot.pokemon.hp > 0) ? slot : null;
}

export function createActivePokemonSlot(pokemon: RPGPokemon): ActivePokemonSlot {
	return {
		pokemon, statStages: { ...INITIAL_STAT_STAGES }, status: pokemon.status,
		sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false,
		protectSuccessCounter: 0, willFlinch: false, isLoafing: false, isTrapped: null,
		tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false,
		chargingMove: undefined, activeTurns: 1, lockedMove: undefined, lockedMoveCounter: 0,
		mustRecharge: false, uproarTurns: 0, lastDamageTaken: undefined, yawnCounter: undefined,
		substitute: undefined, disabledMove: undefined, encoreMove: undefined, isIngrained: false,
		hasAquaRing: false, focusEnergy: false, magnetRiseTurns: 0, telekinesisCounter: 0,
		isSmackedDown: false, lastMoveUsed: undefined, tormentActive: false, embargoTurns: 0,
		healBlockTurns: 0, isCharged: false, stockpileCount: 0, flashFireBoost: false,
		unburdenActive: false, analyticBoost: false, slowStartTurns: undefined, volatileTypes: undefined,
		isDisguised: toID(pokemon.ability || '') === 'disguise' && pokemon.species.includes('Mimikyu'),
		lastMoveThatHitMe: undefined, terastallized: undefined, toxicCounter: pokemon.status === 'tox' ? 1 : undefined,
	};
}

// #endregion

// #region Stat Mechanics

export function applyStatChange(
	slot: ActivePokemonSlot, stat: keyof ActivePokemonSlot['statStages'], value: number,
	battle: BattleState, messageLog: string[], source: ActivePokemonSlot | null = null
): boolean {
	const p = slot.pokemon;
	const ability = toID(p.ability || '');
	const actualValue = RPGAbilities.applyStatChangeModifier(value, ability);
	const current = slot.statStages[stat];
	const isSelf = !source || source.pokemon.id === p.id;

	if (actualValue > 0) {
		if (current >= 6) { messageLog.push(`${p.species}'s ${stat.toUpperCase()} won't go any higher!`); return false; }
		slot.statStages[stat] = Math.min(6, current + actualValue) as any;
		messageLog.push(`${p.species}'s ${stat.toUpperCase()} ${actualValue > 1 ? 'sharply ' : ''}rose!`);
		return true;
	} 
	
	if (actualValue < 0) {
		if (!isSelf) {
			if (ability === 'mirrorarmor') {
				messageLog.push(`${p.species}'s Mirror Armor reflected the stat drop!`);
				if (source) applyStatChange(source, stat, actualValue, battle, messageLog, null);
				return false;
			}
			const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === p.id);
			if ((isPlayer ? (battle as any).playerMistTurns : (battle as any).opponentMistTurns) > 0) {
				messageLog.push(`${p.species} is protected by the mist!`); return false;
			}
			if (battle.magicRoomTurns === 0 && p.item === 'clearamulet') {
				messageLog.push(`${p.species}'s Clear Amulet prevents stat loss!`); return false;
			}
			if (STAT_PROTECTION_ABILITIES.includes(ability)) {
				messageLog.push(`${p.species}'s ${p.ability} prevents stat loss!`); return false;
			}
			if (SPECIFIC_STAT_PROTECTION[stat] === ability) {
				messageLog.push(`${p.species}'s ${p.ability} prevents ${stat} loss!`); return false;
			}
			if (ability === 'flowerveil' || checkAllyAbility(slot, battle, 'flowerveil')) {
				if (Dex.species.get(p.species).types.includes('Grass')) {
					messageLog.push(`Flower Veil protects ${p.species} from stat drops!`); return false;
				}
			}
		}

		if (current <= -6) { messageLog.push(`${p.species}'s ${stat.toUpperCase()} won't go any lower!`); return false; }
		slot.statStages[stat] = Math.max(-6, current + actualValue) as any;
		messageLog.push(`${p.species}'s ${stat.toUpperCase()} ${actualValue < -1 ? 'sharply ' : ''}fell!`);
		
		checkStatDropAbilities(slot, source, battle, messageLog);
		return true;
	}
	return false;
}

function checkAllyAbility(slot: ActivePokemonSlot, battle: BattleState, ability: string): boolean {
	const allies = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id) ? battle.playerSlots : battle.opponentSlots;
	return allies.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === ability && s.pokemon.id !== slot.pokemon.id);
}

export function checkStatDropAbilities(target: ActivePokemonSlot, source: ActivePokemonSlot | null, battle: BattleState, log: string[]) {
	RPGAbilities.applyStatDropResponse(target, battle, log, source || undefined);
}

export function getAccuracyEvasionMultiplier(stage: number): number {
	return stage > 0 ? (3 + stage) / 3 : 3 / (3 - stage);
}

// #endregion

// #region Item & HP Mechanics

export function handleHPDropEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	const p = slot.pokemon;
	if (p.hp <= 0) return;

	// Ability Checks (Emergency Exit)
	if (p.hp <= p.maxHp / 2 && ['emergencyexit', 'wimpout'].includes(toID(p.ability || ''))) {
		messageLog.push(`${p.species}'s ${p.ability} wants to switch out!`);
	}

	if (battle.magicRoomTurns > 0 || !p.item) return;

	// Unnerve Check
	const opps = battle.playerSlots.some(s => s?.pokemon.id === p.id) ? battle.opponentSlots : battle.playerSlots;
	if (opps.some(s => s && s.pokemon.hp > 0 && ['unnerve', 'asoneglastrier', 'asonespectrier'].includes(toID(s.pokemon.ability || ''))) && p.item.toLowerCase().includes('berry')) return;

	const gluttony = toID(p.ability || '') === 'gluttony';
	const threshold = gluttony ? p.maxHp / 2 : p.maxHp / 4;
	
	// Healing Berries
	if (p.hp <= p.maxHp / 2) {
		const heal = getBerryHealAmount(p);
		if (heal > 0) {
			const old = p.hp;
			p.hp = Math.min(p.maxHp, p.hp + heal);
			messageLog.push(`${p.species} ate its ${ITEMS_DATABASE[p.item]?.name || p.item} and restored ${p.hp - old} HP!`);
			consumeBerry(slot, p.item, messageLog);
			return;
		}
	}

	// Pinch Berries
	if (p.hp <= threshold) {
		const pinchHeal = getPinchBerryHeal(p);
		if (pinchHeal > 0) {
			const old = p.hp;
			p.hp = Math.min(p.maxHp, p.hp + pinchHeal);
			messageLog.push(`${p.species} ate its ${ITEMS_DATABASE[p.item]?.name || p.item} and restored ${p.hp - old} HP!`);
			checkBerryFlavorConfuse(slot, p.item, messageLog);
			consumeBerry(slot, p.item, messageLog);
			return;
		}

		const statBoost = getPinchStatBoost(p.item);
		if (statBoost) {
			if (applyStatChange(slot, statBoost, 1, battle, messageLog, slot)) {
				messageLog[messageLog.length - 1] += ` (from ${ITEMS_DATABASE[p.item]?.name || p.item})!`;
				consumeBerry(slot, p.item, messageLog);
			}
		} else if (p.item === 'starfberry') {
			const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;
			const valid = stats.filter(s => slot.statStages[s] < 6);
			if (valid.length > 0 && applyStatChange(slot, valid[Math.floor(Math.random() * valid.length)], 2, battle, messageLog, slot)) {
				messageLog[messageLog.length - 1] += ` (from Starf Berry)!`;
				consumeBerry(slot, p.item, messageLog);
			}
		}
	}
}

function getBerryHealAmount(p: RPGPokemon): number {
	const ripen = toID(p.ability || '') === 'ripen' ? 2 : 1;
	switch (p.item) {
		case 'berryjuice': return 20 * ripen;
		case 'oranberry': return 10 * ripen;
		case 'goldberry': return 30 * ripen;
		case 'sitrusberry': return Math.floor(p.maxHp / 4) * ripen;
		default: return 0;
	}
}

function getPinchBerryHeal(p: RPGPokemon): number {
	const ripen = toID(p.ability || '') === 'ripen' ? 2 : 1;
	if (['figyberry', 'wikiberry', 'magoberry', 'aguavberry', 'iapapaberry'].includes(p.item!)) {
		return Math.floor(p.maxHp / 2) * ripen; // Gen 9 buffed/restored logic assumption
	}
	return 0;
}

function getPinchStatBoost(item: string): keyof ActivePokemonSlot['statStages'] | null {
	const map: Record<string, keyof ActivePokemonSlot['statStages']> = {
		'liechiberry': 'atk', 'ganlonberry': 'def', 'salacberry': 'spe', 'petayaberry': 'spa', 'apicotberry': 'spd'
	};
	return map[item] || null;
}

function checkBerryFlavorConfuse(slot: ActivePokemonSlot, berry: string, log: string[]) {
	const p = slot.pokemon;
	const flavor = BERRY_FLAVORS[berry]?.flavor;
	const dislike = NATURES[p.nature]?.minus ? NATURE_FLAVOR_PREFERENCES[NATURES[p.nature]!.minus] : null;
	if (flavor && dislike && flavor === dislike && toID(p.ability || '') !== 'owntempo' && !slot.isConfused) {
		slot.isConfused = true; slot.confusionCounter = Math.floor(Math.random() * 3) + 2;
		log.push(`${p.species} became confused due to the berry's flavor!`);
	}
}

export function consumeBerry(slot: ActivePokemonSlot, berryId: string, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	slot.consumedBerry = berryId;
	slot.harvestUsedThisTurn = false;
	if (ability === 'cudchew') slot.cudChewBerry = berryId;
	slot.pokemon.item = undefined;
	activateUnburden(slot, messageLog);
	if (ability === 'cheekpouch' && slot.pokemon.hp < slot.pokemon.maxHp) {
		slot.pokemon.hp = Math.min(slot.pokemon.maxHp, slot.pokemon.hp + Math.floor(slot.pokemon.maxHp / 3));
		messageLog.push(`${slot.pokemon.species}'s Cheek Pouch restored its HP!`);
	}
}

export function activateUnburden(slot: ActivePokemonSlot, messageLog: string[]): void {
	if (toID(slot.pokemon.ability || '') === 'unburden' && !slot.unburdenActive) {
		slot.unburdenActive = true; messageLog.push(`${slot.pokemon.species}'s Unburden activated!`);
	}
}

export function checkMentalHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mentalherb') return false;
	if (slot.tauntTurns > 0 || slot.encoreMove || slot.disabledMove || slot.tormentActive || (slot.healBlockTurns || 0) > 0) {
		slot.tauntTurns = 0; slot.encoreMove = undefined; slot.disabledMove = undefined; slot.tormentActive = false; slot.healBlockTurns = 0;
		messageLog.push(`${slot.pokemon.species}'s Mental Herb snapped it out of its confusion!`);
		slot.pokemon.item = undefined; activateUnburden(slot, messageLog);
		return true;
	}
	return false;
}

export function handleMirrorHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mirrorherb') return;
	const opps = getActiveSlots(battle.playerSlots.includes(slot) ? battle.opponentSlots : battle.playerSlots);
	let copied = false;
	
	opps.forEach(opp => {
		(['atk', 'def', 'spa', 'spd', 'spe'] as const).forEach(stat => {
			if (opp.statStages[stat] > 0 && slot.statStages[stat] < 6) {
				slot.statStages[stat] = Math.min(6, slot.statStages[stat] + Math.min(opp.statStages[stat], 6 - slot.statStages[stat])) as any;
				copied = true;
			}
		});
	});

	if (copied) {
		messageLog.push(`${slot.pokemon.species}'s Mirror Herb copied the stat boosts!`);
		slot.pokemon.item = undefined; activateUnburden(slot, messageLog);
	}
}

export function applySynchronize(status: Status, source: ActivePokemonSlot, target: ActivePokemonSlot, battle: BattleState, log: string[]) {
	if (!target || target.pokemon.hp <= 0 || toID(target.pokemon.ability || '') !== 'synchronize') return;
	if (!['psn', 'par', 'brn', 'tox'].includes(status || '')) return;
	if (source.status) return; // Already has status

	const sType = Dex.species.get(source.pokemon.species);
	let can = true;
	if ((status === 'brn' && sType.types.includes('Fire')) || (status === 'par' && sType.types.includes('Electric')) || (['psn', 'tox'].includes(status || '') && (sType.types.includes('Poison') || sType.types.includes('Steel')))) can = false;
	if (can && RPGAbilities.preventsStatus(source.pokemon, status!, battle, target.pokemon)) can = false;

	if (can) {
		source.status = status;
		if (status === 'tox') source.toxicCounter = 1;
		log.push(`${target.pokemon.species}'s Synchronize afflicted ${source.pokemon.species} with ${status}!`);
	}
}

export function checkTrappingAbility(slot: ActivePokemonSlot, battle: BattleState): ActivePokemonSlot | null {
	const p = slot.pokemon;
	if (toID(p.ability || '') === 'shadowtag') return null;
	
	const opps = getActiveSlots(battle.playerSlots.includes(slot) ? battle.opponentSlots : battle.playerSlots);
	const types = Dex.species.get(p.species).types;

	for (const opp of opps) {
		const a = toID(opp.pokemon.ability || '');
		if (a === 'shadowtag') return opp;
		if (a === 'arenatrap' && RPGAbilities.isGrounded(p, battle) && !types.includes('Ghost')) return opp;
		if (a === 'magnetpull' && types.includes('Steel') && !types.includes('Ghost')) return opp;
	}
	return null;
}

// #endregion

// #region Math & Utilities

export function getMove(moveId: string): any { return Dex.moves.get(moveId); }

export function calculateTotalExpForLevel(rate: string, level: number): number {
	const n = Math.max(0, Math.floor(level));
	if (n === 0) return 0;
	const formula = GROWTH_RATE_FORMULAS[rate] || GROWTH_RATE_FORMULAS['Medium Fast'];
	return Math.max(0, formula(n));
}

export function calculateStats(species: any, level: number, nature: string, ivs: Record<keyof Stats, number>, evs: Record<keyof Stats, number>): Stats {
	const calc = (base: number, iv: number, ev: number, isHp: boolean) => {
		if (isHp) return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
		return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
	};
	const stats = {
		maxHp: calc(species.baseStats.hp, ivs.hp, evs.hp, true),
		atk: calc(species.baseStats.atk, ivs.atk, evs.atk, false),
		def: calc(species.baseStats.def, ivs.def, evs.def, false),
		spa: calc(species.baseStats.spa, ivs.spa, evs.spa, false),
		spd: calc(species.baseStats.spd, ivs.spd, evs.spd, false),
		spe: calc(species.baseStats.spe, ivs.spe, evs.spe, false),
	};
	const mod = NATURES[nature];
	if (mod) { stats[mod.plus] = Math.floor(stats[mod.plus] * 1.1); stats[mod.minus] = Math.floor(stats[mod.minus] * 0.9); }
	return stats;
}

export function levelUp(pokemon: RPGPokemon): string[] {
	pokemon.level++;
	const msgs = [`**${pokemon.species} grew to Level ${pokemon.level}!**`];
	const newStats = calculateStats(Dex.species.get(pokemon.species), pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	const ratio = pokemon.hp / pokemon.maxHp;
	
	Object.assign(pokemon, newStats);
	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * ratio));
	pokemon.expToNextLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level + 1);
	return msgs;
}

export function handleLearningMoves(player: PlayerData, pokemon: RPGPokemon): { messages: string[] } {
	const msgs: string[] = [];
	const learnset = MANUAL_LEARNSETS[toID(pokemon.species)];
	if (!learnset?.levelup) return { messages: msgs };

	const newMoves = learnset.levelup.filter(l => l.level === pokemon.level).map(l => toID(l.move)).filter(id => {
		const d = getMove(id); return d.exists && !pokemon.moves.some(m => m.id === id);
	});

	const queue: string[] = [];
	newMoves.forEach(id => {
		if (pokemon.moves.length < 4) {
			const d = getMove(id); pokemon.moves.push({ id, pp: d.pp || 5 }); msgs.push(`**${pokemon.species} learned ${d.name}!**`);
		} else queue.push(id);
	});

	if (queue.length > 0) {
		const entry = player.pendingMoveLearnQueue?.find(q => q.pokemonId === pokemon.id);
		if (entry) entry.moveIds.push(...queue);
		else (player.pendingMoveLearnQueue || (player.pendingMoveLearnQueue = [])).push({ pokemonId: pokemon.id, moveIds: queue });
	}
	return { messages: msgs };
}

export function checkEvolution(player: PlayerData, pokemon: RPGPokemon, context: { room: { add: (m: string) => { update: () => void } }, user: { name: string } }, itemUsed?: string): string | null {
	const evos = MANUAL_EVOLUTIONS[toID(pokemon.species)];
	if (!evos || pokemon.item === 'everstone') return null;

	const evo = evos.find(e => itemUsed ? (e.evoItem === itemUsed && pokemon.level >= e.evoLevel) : (pokemon.level >= e.evoLevel && !e.evoItem));
	if (!evo) return null;

	const species = Dex.species.get(evo.evoTo);
	if (!species.exists) return null;

	const oldName = pokemon.species;
	pokemon.species = species.name;
	if (pokemon.nickname === oldName) pokemon.nickname = species.name;

	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	const ratio = pokemon.hp / pokemon.maxHp;
	Object.assign(pokemon, newStats);
	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * ratio));

	const { messages } = handleLearningMoves(player, pokemon);
	context.room.add(`|c|~RPG Bot|What?! ${context.user.name}'s ${oldName} is evolving!`).update();
	return `**What?! ${oldName} is evolving!**<br>...Congratulations! Your ${oldName} evolved into **${species.name}**!${messages.length ? '<br>' + messages.join('<br>') : ''}`;
}

export function getMoveTargets(attackerIdx: number, targetIdx: number, move: Move, battle: BattleState): ActivePokemonSlot[] {
	const attacker = getSlotFromIndex(battle, attackerIdx);
	if (!attacker) return [];
	const isPlayer = attackerIdx <= 1;
	const foes = isPlayer ? [2, 3] : [0, 1];
	const allies = isPlayer ? [0, 1] : [2, 3];
	
	const get = (i: number) => getSlotFromIndex(battle, i);
	const add = (i: number, arr: ActivePokemonSlot[]) => { const s = get(i); if (s) arr.push(s); };

	const targets: ActivePokemonSlot[] = [];
	const t = move.target;

	if (['normal', 'any', 'ally'].includes(t)) add(targetIdx, targets);
	else if (t === 'self') targets.push(attacker);
	else if (t === 'allAdjacentFoes') foes.forEach(i => add(i, targets));
	else if (['allAdjacent', 'scripted', 'all'].includes(t)) [0, 1, 2, 3].forEach(i => { if (i !== attackerIdx) add(i, targets); });
	else if (t === 'randomNormal') {
		const valid = foes.map(get).filter(s => s) as ActivePokemonSlot[];
		if (valid.length) targets.push(valid[Math.floor(Math.random() * valid.length)]);
	}
	else if (t === 'foeSide') add(get(foes[0]) ? foes[0] : foes[1], targets);
	else if (t === 'allySide') add(get(allies[0]) ? allies[0] : allies[1], targets);
	else add(targetIdx, targets); // Default

	return [...new Set(targets)];
}

// #endregion

// #region Team Generation (Random)

export function generateRandomTeam(count: number, level: number): RPGPokemon[] {
	const all = Dex.species.all();
	const tiers = ['OU', 'UU', 'UUBL', 'RU', 'RUBL', 'NU', 'NUBL', 'PU', 'PUBL'];
	const viable = all.filter(s => !s.nfe && (!s.evos || !s.evos.length) && tiers.includes(s.tier) && MANUAL_LEARNSETS[s.id]);

	if (!viable.length) {
		const p = createPokemon('pikachu', level); assignRandomMoveset(p); p.item = 'lightball'; return [p];
	}

	const team: RPGPokemon[] = [];
	for (let i = 0; i < count; i++) {
		const s = viable[Math.floor(Math.random() * viable.length)];
		const p = createPokemon(s.id, level);
		const evs = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const;
		// Simple shuffle for random EVs
		const shuffled = [...evs].sort(() => 0.5 - Math.random());
		p.evs[shuffled[0]] = 252; p.evs[shuffled[1]] = 252; p.evs[shuffled[2]] = 4;
		
		Object.assign(p, calculateStats(Dex.species.get(p.species), p.level, p.nature, p.ivs, p.evs));
		p.hp = p.maxHp;
		assignRandomMoveset(p);
		p.item = VIABLE_HELD_ITEMS[Math.floor(Math.random() * VIABLE_HELD_ITEMS.length)];
		team.push(p);
	}
	return team;
}

export function assignRandomMoveset(p: RPGPokemon): void {
	const data = MANUAL_LEARNSETS[toID(p.species)];
	if (!data) { p.moves = [{ id: 'tackle', pp: 35 }]; return; }

	const pool = new Set<string>();
	if (data.levelup) data.levelup.forEach(l => pool.add(toID(l.move)));
	if (data.tm) data.tm.forEach(m => pool.add(toID(m)));
	if (data.tutor) data.tutor.forEach(m => pool.add(toID(m)));
	if (data.egg) data.egg.forEach(m => pool.add(toID(m)));

	const valid = Array.from(pool).map(id => getMove(id)).filter(m => 
		m?.exists && !(m.category === 'Status' && m.basePower === 0 && !m.status && !m.boosts && !m.volatileStatus && !m.sideCondition && !m.pseudoWeather && !m.weather && !m.terrain && !m.flags?.heal)
	);

	if (!valid.length) { p.moves = [{ id: 'tackle', pp: 35 }]; return; }

	const dmg = valid.filter(m => m.category !== 'Status').sort(() => 0.5 - Math.random());
	const status = valid.filter(m => m.category === 'Status').sort(() => 0.5 - Math.random());

	const moves: Move[] = [];
	const sCount = status.length > 0 ? 1 : 0;
	moves.push(...dmg.slice(0, 4 - sCount));
	moves.push(...status.slice(0, sCount));
	
	// Fill if under 4
	if (moves.length < 4) moves.push(...status.slice(sCount, sCount + (4 - moves.length)));
	if (moves.length < 4) moves.push(...dmg.slice(4 - sCount, (4 - sCount) + (4 - moves.length)));

	p.moves = moves.slice(0, 4).map(m => ({ id: m.id, pp: m.pp || 5 }));
}

// #endregion

export const RPGUtils = {
	calculateTotalExpForLevel, calculateStats, getMove, levelUp, handleLearningMoves, checkEvolution, NATURES, NATURE_LIST,
};

export default RPGUtils;
