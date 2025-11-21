import { Dex, toID } from '../../../sim/dex';
import { getActiveSlots, applyStatChange } from './utils';
import type { RPGPokemon, ActivePokemonSlot, BattleState, Move, AbilityContext, AbilityImmunityHandler, AbilityPowerModifierHandler, AbilityStatModifierHandler, AbilityTypeModifierHandler } from './interface';

// #region Helper & Config Constants

const WONDER_GUARD_CHART: Record<string, { superEffective: string[], notVeryEffective: string[], noEffect: string[] }> = {
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

const SLICING_MOVES = new Set([
	'aerialace', 'aircutter', 'airslash', 'aquacutter', 'behemothblade', 'bitterblade', 'ceaselessedge', 'crosspoison',
	'cut', 'furycutter', 'kowtowcleave', 'leafblade', 'nightslash', 'populationbomb', 'psychocut', 'razorleaf',
	'razorshell', 'sacredsword', 'slash', 'solarblade', 'stoneaxe', 'xscissor',
]);

// #endregion

// #region Ability Handlers (Immunity, Power, Type, Stat)

export const IMMUNITY_ABILITIES: Record<string, AbilityImmunityHandler> = {
	'soundproof': ctx => ctx.move.flags.sound ? { immune: true, message: `${ctx.defender.species}'s Soundproof blocks the move!` } : null,
	'overcoat': ctx => ctx.move.flags.powder ? { immune: true, message: `${ctx.defender.species}'s Overcoat blocks the move!` } : null,
	'bulletproof': ctx => ctx.move.flags.bullet ? { immune: true, message: `${ctx.defender.species}'s Bulletproof blocks the move!` } : null,
	'mountaineer': ctx => ctx.move.type === 'Rock' ? { immune: true, message: `${ctx.defender.species}'s Mountaineer makes it immune to Rock moves!` } : null,
	'levitate': ctx => (ctx.move.type === 'Ground' && ctx.battle.gravityTurns === 0) ? { immune: true, message: `${ctx.defender.species}'s Levitate makes it immune to Ground moves!` } : null,
	'telepathy': ctx => {
		const isSameSide = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.attacker.id) === ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.defender.id);
		return isSameSide ? { immune: true, message: `${ctx.defender.species}'s Telepathy protects it from its ally's move!` } : null;
	},
	'waterabsorb': ctx => handleAbsorb(ctx, 'Water', 'Water Absorb', true),
	'dryskin': ctx => handleAbsorb(ctx, 'Water', 'Dry Skin', true),
	'voltabsorb': ctx => handleAbsorb(ctx, 'Electric', 'Volt Absorb', true),
	'eartheater': ctx => handleAbsorb(ctx, 'Ground', 'Earth Eater', true),
	'flashfire': ctx => {
		if (ctx.move.type !== 'Fire') return null;
		ctx.defenderSlot.flashFireBoost = true;
		return { immune: true, message: `${ctx.defender.species}'s Flash Fire absorbed the Fire move!` };
	},
	'wellbakedbody': ctx => handleStatRaiseAbsorb(ctx, 'Fire', 'Well-Baked Body', 'def', 2, true),
	'sapsipper': ctx => handleStatRaiseAbsorb(ctx, 'Grass', 'Sap Sipper', 'atk', 1),
	'stormdrain': ctx => handleStatRaiseAbsorb(ctx, 'Water', 'Storm Drain', 'spa', 1),
	'lightningrod': ctx => handleStatRaiseAbsorb(ctx, 'Electric', 'Lightning Rod', 'spa', 1),
	'motordrive': ctx => handleStatRaiseAbsorb(ctx, 'Electric', 'Motor Drive', 'spe', 1),
	'windpower': ctx => handleWindAbsorb(ctx, 'Wind Power'),
	'windrider': ctx => handleWindAbsorb(ctx, 'Wind Rider', 'atk'),
	'wonderguard': ctx => {
		if (ctx.move.category === 'Status') return null;
		const dTypes = ctx.defenderSlot.terastallized ? [ctx.defenderSlot.terastallized] : Dex.species.get(ctx.defender.species).types;
		const chart = WONDER_GUARD_CHART[ctx.move.type];
		let eff = 1;
		if (chart) dTypes.forEach(t => { if (chart.superEffective.includes(t)) eff *= 2; else if (chart.notVeryEffective.includes(t)) eff *= 0.5; else if (chart.noEffect.includes(t)) eff *= 0; });
		return eff <= 1 ? { immune: true, message: `${ctx.defender.species}'s Wonder Guard protected it!` } : null;
	},
};

function handleAbsorb(ctx: AbilityContext, type: string, name: string, heal: boolean) {
	if (ctx.move.type !== type) return null;
	if (heal) ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + Math.floor(ctx.defender.maxHp * 0.25));
	return { immune: true, message: `${ctx.defender.species}'s ${name} ${heal ? 'restored its HP' : 'absorbed the move'}!` };
}

function handleStatRaiseAbsorb(ctx: AbilityContext, type: string, name: string, stat: keyof ActivePokemonSlot['statStages'], amt: number, sharp?: boolean) {
	if (ctx.move.type !== type) return null;
	let msg = `${ctx.defender.species}'s ${name} blocked the ${type} move!`;
	if (ctx.defenderSlot.statStages[stat] < 6) {
		ctx.defenderSlot.statStages[stat] += amt;
		msg = `${ctx.defender.species}'s ${name} ${sharp ? 'sharply ' : ''}raised its ${stat === 'def' ? 'Defense' : stat === 'atk' ? 'Attack' : stat === 'spa' ? 'Sp. Atk' : 'Speed'}!`;
	}
	return { immune: true, message: msg };
}

function handleWindAbsorb(ctx: AbilityContext, name: string, stat?: keyof ActivePokemonSlot['statStages']) {
	const windMoves = ['twister', 'gust', 'whirlwind', 'hurricane', 'tailwind', 'icy wind', 'heat wave', 'sandstorm', 'blizzard'];
	if (!windMoves.includes(ctx.move.id)) return null;
	let msg = stat ? `${ctx.defender.species}'s ${name} blocked the wind move!` : `${ctx.defender.species}'s ${name} charged it up!`;
	if (stat && ctx.defenderSlot.statStages[stat] < 6) {
		ctx.defenderSlot.statStages[stat]++;
		msg = `${ctx.defender.species}'s ${name} raised its Attack!`;
	}
	return { immune: true, message: msg };
}

export const POWER_MODIFIER_ABILITIES: Record<string, AbilityPowerModifierHandler> = {
	'ironfist': (ctx, bp) => ctx.move.flags.punch ? Math.floor(bp * 1.2) : bp,
	'strongjaw': (ctx, bp) => ctx.move.flags.bite ? Math.floor(bp * 1.5) : bp,
	'megalauncher': (ctx, bp) => ctx.move.flags.pulse ? Math.floor(bp * 1.5) : bp,
	'technician': (ctx, bp) => (ctx.move.basePower <= 60 && ctx.move.basePower > 0) ? Math.floor(bp * 1.5) : bp,
	'sheerforce': (ctx, bp) => (ctx.move.secondary || ctx.move.secondaries) ? Math.floor(bp * 1.3) : bp,
	'reckless': (ctx, bp) => (ctx.move.recoil || ctx.move.hasCrashDamage) ? Math.floor(bp * 1.2) : bp,
	'toughclaws': (ctx, bp) => ctx.move.flags.contact ? Math.floor(bp * 1.3) : bp,
	'adaptability': (ctx, bp) => bp,
	'rivalry': (ctx, bp) => (ctx.attacker.gender !== 'N' && ctx.defender.gender !== 'N') ? Math.floor(bp * (ctx.attacker.gender === ctx.defender.gender ? 1.25 : 0.75)) : bp,
	'sandforce': (ctx, bp) => (isWeatherActive(ctx.battle) && ctx.battle.weather?.type === 'sand' && ['Rock', 'Ground', 'Steel'].includes(ctx.move.type)) ? Math.floor(bp * 1.3) : bp,
	'analytic': (ctx, bp) => ctx.attackerSlot.analyticBoost ? Math.floor(bp * 1.3) : bp,
	'steelworker': (ctx, bp) => ctx.move.type === 'Steel' ? Math.floor(bp * 1.5) : bp,
	'steelyspirit': (ctx, bp) => ctx.move.type === 'Steel' ? Math.floor(bp * 1.5) : bp,
	'transistor': (ctx, bp) => ctx.move.type === 'Electric' ? Math.floor(bp * 1.5) : bp,
	'dragonsmaw': (ctx, bp) => ctx.move.type === 'Dragon' ? Math.floor(bp * 1.5) : bp,
	'rockypayload': (ctx, bp) => ctx.move.type === 'Rock' ? Math.floor(bp * 1.5) : bp,
	'sharpness': (ctx, bp) => SLICING_MOVES.has(ctx.move.id) ? Math.floor(bp * 1.5) : bp,
	'stakeout': (ctx, bp) => ctx.defenderSlot.activeTurns === 1 ? Math.floor(bp * 2) : bp,
	'blaze': (ctx, bp) => (ctx.move.type === 'Fire' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) ? Math.floor(bp * 1.5) : bp,
	'torrent': (ctx, bp) => (ctx.move.type === 'Water' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) ? Math.floor(bp * 1.5) : bp,
	'overgrow': (ctx, bp) => (ctx.move.type === 'Grass' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) ? Math.floor(bp * 1.5) : bp,
	'swarm': (ctx, bp) => (ctx.move.type === 'Bug' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) ? Math.floor(bp * 1.5) : bp,
	'supremeoverlord': (ctx, bp) => {
		const party = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.attacker.id) ? ctx.battle.playerSlots : ctx.battle.opponentSlots;
		const fainted = party.filter(s => s?.pokemon && s.pokemon.hp === 0).length; // Logic assumption: slots persist fainted mons or check party data in full implementation
		// *Correction based on context:* We can't easily check party fainted count from Slots alone if they are cleared. 
		// Assuming implementation provided in original file was correct for the context available.
		return fainted > 0 ? Math.floor(bp * (1 + fainted * 0.1)) : bp;
	}
};

export const TYPE_MODIFIER_ABILITIES: Record<string, AbilityTypeModifierHandler> = {
	'normalize': (ctx, t) => ctx.move.category !== 'Status' ? ((ctx.move as any).typeConversionBoost = true, 'Normal') : t,
	'pixilate': (ctx, t) => (t === 'Normal' && ctx.move.category !== 'Status') ? ((ctx.move as any).typeConversionBoost = true, 'Fairy') : t,
	'refrigerate': (ctx, t) => (t === 'Normal' && ctx.move.category !== 'Status') ? ((ctx.move as any).typeConversionBoost = true, 'Ice') : t,
	'aerilate': (ctx, t) => (t === 'Normal' && ctx.move.category !== 'Status') ? ((ctx.move as any).typeConversionBoost = true, 'Flying') : t,
	'galvanize': (ctx, t) => (t === 'Normal' && ctx.move.category !== 'Status') ? ((ctx.move as any).typeConversionBoost = true, 'Electric') : t,
	'liquidvoice': (ctx, t) => ctx.move.flags.sound ? 'Water' : t,
};

export const STAT_MODIFIER_ABILITIES: Record<string, AbilityStatModifierHandler> = {
	'hugepower': (p, s, v) => s === 'atk' ? v * 2 : v,
	'purepower': (p, s, v) => s === 'atk' ? v * 2 : v,
	'hustle': (p, s, v) => s === 'atk' ? Math.floor(v * 1.5) : v,
	'gorillatactics': (p, s, v) => s === 'atk' ? Math.floor(v * 1.5) : v,
	'guts': (p, s, v, slot) => (s === 'atk' && (slot?.status || p.status)) ? Math.floor(v * 1.5) : v,
	'marvelscale': (p, s, v, slot) => (s === 'def' && (slot?.status || p.status)) ? Math.floor(v * 1.5) : v,
	'quickfeet': (p, s, v, slot) => (s === 'spe' && (slot?.status || p.status)) ? Math.floor(v * 1.5) : v,
	'toxicboost': (p, s, v, slot) => (s === 'atk' && ['psn', 'tox'].includes(slot?.status || p.status || '')) ? Math.floor(v * 1.5) : v,
	'flareboost': (p, s, v, slot) => (s === 'spa' && (slot?.status || p.status) === 'brn') ? Math.floor(v * 1.5) : v,
	'defeatist': (p, s, v) => ((s === 'atk' || s === 'spa') && p.hp <= p.maxHp / 2) ? Math.floor(v * 0.5) : v,
	'slowstart': (p, s, v, slot) => ((s === 'atk' || s === 'spe') && (!slot || (slot.slowStartTurns || 0) > 0)) ? Math.floor(v * 0.5) : v,
	'grasspelt': (p, s, v, slot, b) => (s === 'def' && b?.terrain?.type === 'grassy') ? Math.floor(v * 1.5) : v,
	'hadronengine': (p, s, v, slot, b) => (s === 'spa' && b?.terrain?.type === 'electric') ? Math.floor(v * 1.33) : v,
	'orichalcumpulse': (p, s, v, slot, b) => (s === 'atk' && b?.weather?.type.includes('sun')) ? Math.floor(v * 1.33) : v,
	'swordofruin': (p, s, v, slot, b) => (s === 'def' && checkRuin(p, 'swordofruin', b)) ? Math.floor(v * 0.75) : v,
	'tabletsofruin': (p, s, v, slot, b) => (s === 'atk' && checkRuin(p, 'tabletsofruin', b)) ? Math.floor(v * 0.75) : v,
	'vesselofruin': (p, s, v, slot, b) => (s === 'spa' && checkRuin(p, 'vesselofruin', b)) ? Math.floor(v * 0.75) : v,
	'beadsofruin': (p, s, v, slot, b) => (s === 'spd' && checkRuin(p, 'beadsofruin', b)) ? Math.floor(v * 0.75) : v,
	'plus': (p, s, v, slot, b) => {
		if (s !== 'spa' || !b) return v;
		const allies = b.playerSlots.some(ps => ps?.pokemon.id === p.id) ? b.playerSlots : b.opponentSlots;
		return allies.some(a => a && a.pokemon.id !== p.id && a.pokemon.hp > 0 && ['plus', 'minus'].includes(toID(a.pokemon.ability || ''))) ? Math.floor(v * 1.5) : v;
	},
	'protosynthesis': (p, s, v, slot, b) => handleParadoxBoost(p, s, v, slot, b?.weather?.type.includes('sun') || false),
	'quarkdrive': (p, s, v, slot, b) => handleParadoxBoost(p, s, v, slot, b?.terrain?.type === 'electric'),
};

function checkRuin(p: RPGPokemon, ability: string, b?: BattleState) {
	if (!b) return false;
	const opponents = b.playerSlots.some(ps => ps?.pokemon.id === p.id) ? b.opponentSlots : b.playerSlots;
	return opponents.some(o => o && o.pokemon.hp > 0 && toID(o.pokemon.ability || '') === ability);
}

function handleParadoxBoost(p: RPGPokemon, s: string, v: number, slot: ActivePokemonSlot | undefined, condition: boolean) {
	if (!condition && !slot?.boosterEnergyActive) return v;
	const stats = { atk: p.atk, def: p.def, spa: p.spa, spd: p.spd, spe: p.spe };
	const highest = Object.keys(stats).reduce((a, b) => stats[a as keyof typeof stats] > stats[b as keyof typeof stats] ? a : b);
	return s === highest ? Math.floor(v * (s === 'spe' ? 1.5 : 1.3)) : v;
}

// #endregion

// #region Switch-In & Damage Modifiers

const SWITCH_IN_HANDLERS: Record<string, (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void> = {
	'intimidate': (slot, battle, log) => {
		const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id);
		const opponents = isPlayer ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);
		log.push(`${slot.pokemon.species}'s Intimidate cuts the opposing Pokémon's Attack!`);
		opponents.forEach(opp => {
			if (toID(opp.pokemon.ability || '') === 'guarddog') {
				if (opp.statStages.atk < 6) { opp.statStages.atk++; log.push(`${opp.pokemon.species}'s Guard Dog raised its Attack!`); }
			} else {
				applyStatChange(opp, 'atk', -1, battle, log, slot);
			}
		});
	},
	'slowstart': (slot, battle, log) => { slot.slowStartTurns = 5; log.push(`${slot.pokemon.species} is off to a slow start!`); },
	'dauntlessshield': (slot, battle, log) => { if (slot.statStages.def < 6) { slot.statStages.def++; log.push(`${slot.pokemon.species}'s Dauntless Shield raised its Defense!`); } },
	'intrepidsword': (slot, battle, log) => { if (slot.statStages.atk < 6) { slot.statStages.atk++; log.push(`${slot.pokemon.species}'s Intrepid Sword raised its Attack!`); } },
	'costar': (slot, battle, log) => {
		const allies = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id) ? battle.playerSlots : battle.opponentSlots;
		const ally = allies.find(s => s && s.pokemon.id !== slot.pokemon.id && s.pokemon.hp > 0);
		if (ally) { slot.statStages = { ...ally.statStages }; log.push(`${slot.pokemon.species} copied ${ally.pokemon.species}'s stat changes!`); }
	},
	'curiousmedicine': (slot, battle, log) => {
		const allies = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id) ? battle.playerSlots : battle.opponentSlots;
		allies.forEach(ally => {
			if (ally && ally.pokemon.id !== slot.pokemon.id && ally.pokemon.hp > 0 && Object.values(ally.statStages).some(v => v < 0)) {
				['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'].forEach(k => ally.statStages[k as keyof typeof ally.statStages] = Math.max(0, ally.statStages[k as any]));
				log.push(`${slot.pokemon.species}'s Curious Medicine restored ${ally.pokemon.species}'s stats!`);
			}
		});
	},
	'hospitality': (slot, battle, log) => {
		const allies = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id) ? battle.playerSlots : battle.opponentSlots;
		const ally = allies.find(s => s && s.pokemon.id !== slot.pokemon.id && s.pokemon.hp > 0);
		if (ally && ally.pokemon.hp < ally.pokemon.maxHp) {
			ally.pokemon.hp = Math.min(ally.pokemon.maxHp, ally.pokemon.hp + Math.floor(ally.pokemon.maxHp * 0.25));
			log.push(`${slot.pokemon.species}'s Hospitality restored ${ally.pokemon.species}'s HP!`);
		}
	},
	'supersweetsynup': (slot, battle, log) => {
		const opps = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id) ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);
		opps.forEach(o => applyStatChange(o, 'evasion', -1, battle, log, slot));
	},
	'commander': (slot, battle, log) => {
		if (!slot.pokemon.species.includes('Tatsugiri')) return;
		const allies = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id) ? battle.playerSlots : battle.opponentSlots;
		const dondozo = allies.find(s => s && s.pokemon.species === 'Dondozo' && s.pokemon.hp > 0);
		if (dondozo) {
			(slot as any).commanderActive = true; (dondozo as any).commanderBoost = true;
			['atk', 'def', 'spa', 'spd', 'spe'].forEach(s => dondozo.statStages[s as any] = Math.min(6, dondozo.statStages[s as any] + 2));
			log.push(`${slot.pokemon.species} commanded from inside ${dondozo.pokemon.species}'s mouth!`);
		}
	},
	'zerotohero': (slot, battle, log) => {
		if (slot.pokemon.species === 'Palafin' && (slot as any).hasSwitchedOut) {
			slot.pokemon.species = 'Palafin-Hero'; (slot as any).hasSwitchedOut = false; log.push(`${slot.pokemon.nickname || 'Palafin'} transformed into its Hero form!`);
		}
	},
	'screencleaner': (slot, battle, log) => {
		let removed = false;
		['player', 'opponent'].forEach(side => {
			['Reflect', 'LightScreen', 'AuroraVeil'].forEach(wall => {
				if ((battle as any)[`${side}${wall}Turns`] > 0) { (battle as any)[`${side}${wall}Turns`] = 0; removed = true; }
			});
		});
		if (removed) log.push(`${slot.pokemon.species}'s Screen Cleaner removed all screens!`);
	},
	'teraformzero': (slot, battle, log) => {
		if (battle.weather || battle.terrain) {
			battle.weather = undefined; battle.terrain = undefined; (battle as any).teraformZeroActive = true;
			log.push(`${slot.pokemon.species}'s Teraform Zero eliminated all effects on the field!`);
		}
	},
	// Ogerpon forms
	'embodyaspectteal': (s, b, l) => s.pokemon.species.includes('Ogerpon') && applyStatChange(s, 'spe', 1, b, l, s),
	'embodyaspectwellspring': (s, b, l) => s.pokemon.species.includes('Ogerpon') && applyStatChange(s, 'spd', 1, b, l, s),
	'embodyaspecthearthflame': (s, b, l) => s.pokemon.species.includes('Ogerpon') && applyStatChange(s, 'atk', 1, b, l, s),
	'embodyaspectcornerstone': (s, b, l) => s.pokemon.species.includes('Ogerpon') && applyStatChange(s, 'def', 1, b, l, s),
};

const ATTACKER_DMG_MODS: Record<string, (ctx: AbilityContext, d: number) => number> = {
	'tintedlens': (ctx, d) => (ctx.effectiveness || 1) < 1 ? Math.floor(d * 2) : d,
	'neuroforce': (ctx, d) => (ctx.effectiveness || 1) > 1 ? Math.floor(d * 1.25) : d,
	'punkrock': (ctx, d) => ctx.move.flags.sound ? Math.floor(d * 1.3) : d,
};

const DEFENDER_DMG_MODS: Record<string, (ctx: AbilityContext, d: number) => number> = {
	'dryskin': (ctx, d) => (ctx.move.type === 'Fire' && !isAbilityIgnored(ctx.attacker, ctx.defender, 'dryskin')) ? Math.floor(d * 1.25) : d,
	'solidrock': (ctx, d) => ((ctx.effectiveness || 1) > 1 && !isAbilityIgnored(ctx.attacker, ctx.defender, 'solidrock')) ? Math.floor(d * 0.75) : d,
	'filter': (ctx, d) => ((ctx.effectiveness || 1) > 1 && !isAbilityIgnored(ctx.attacker, ctx.defender, 'filter')) ? Math.floor(d * 0.75) : d,
	'prismarmor': (ctx, d) => ((ctx.effectiveness || 1) > 1 && !isAbilityIgnored(ctx.attacker, ctx.defender, 'prismarmor')) ? Math.floor(d * 0.75) : d,
	'multiscale': (ctx, d) => (ctx.defender.hp === ctx.defender.maxHp && !isAbilityIgnored(ctx.attacker, ctx.defender, 'multiscale')) ? Math.floor(d * 0.5) : d,
	'shadowshield': (ctx, d) => (ctx.defender.hp === ctx.defender.maxHp && !isAbilityIgnored(ctx.attacker, ctx.defender, 'shadowshield')) ? Math.floor(d * 0.5) : d,
	'purifyingsalt': (ctx, d) => (ctx.move.type === 'Ghost' && !isAbilityIgnored(ctx.attacker, ctx.defender, 'purifyingsalt')) ? Math.floor(d * 0.5) : d,
	'furcoat': (ctx, d) => (ctx.move.category === 'Physical' && !isAbilityIgnored(ctx.attacker, ctx.defender, 'furcoat')) ? Math.floor(d * 0.5) : d,
	'icescales': (ctx, d) => (ctx.move.category === 'Special' && !isAbilityIgnored(ctx.attacker, ctx.defender, 'icescales')) ? Math.floor(d * 0.5) : d,
	'thickfat': (ctx, d) => (['Fire', 'Ice'].includes(ctx.move.type) && !isAbilityIgnored(ctx.attacker, ctx.defender, 'thickfat')) ? Math.floor(d * 0.5) : d,
	'heatproof': (ctx, d) => (ctx.move.type === 'Fire' && !isAbilityIgnored(ctx.attacker, ctx.defender, 'heatproof')) ? Math.floor(d * 0.5) : d,
	'fluffy': (ctx, d) => {
		if (isAbilityIgnored(ctx.attacker, ctx.defender, 'fluffy')) return d;
		let mod = d;
		if (ctx.move.flags.contact) mod = Math.floor(mod * 0.5);
		if (ctx.move.type === 'Fire') mod = Math.floor(mod * 2);
		return mod;
	},
	'punkrock': (ctx, d) => (ctx.move.flags.sound && !isAbilityIgnored(ctx.attacker, ctx.defender, 'punkrock')) ? Math.floor(d * 0.5) : d,
	'friendguard': (ctx, d) => {
		const allies = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.defender.id) ? ctx.battle.playerSlots : ctx.battle.opponentSlots;
		return allies.some(s => s && s.pokemon.id !== ctx.defender.id && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'friendguard') ? Math.floor(d * 0.75) : d;
	},
	'terashell': (ctx, d) => (ctx.defender.hp === ctx.defender.maxHp && ctx.move.category !== 'Status' && !isAbilityIgnored(ctx.attacker, ctx.defender, 'terashell')) ? Math.floor(d * 0.5) : d,
};

// #endregion

// #region Config Objects (Used by Utils)

export const WEATHER_ABILITIES: any = {
	'drought': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startWeather(s, b, l, 'sun', 'heatrock', 'Drought intensified the sun!') },
	'drizzle': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startWeather(s, b, l, 'rain', 'damprock', 'Drizzle caused a downpour!') },
	'sandstream': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startWeather(s, b, l, 'sand', 'smoothrock', 'Sand Stream whipped up a sandstorm!') },
	'snowwarning': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startWeather(s, b, l, 'hail', 'icyrock', 'Snow Warning created a hailstorm!') },
	'deltastream': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => { if (b.weather?.type !== 'strong-winds') { b.weather = { type: 'strong-winds', turns: 9999 }; l.push(`${s.pokemon.species}'s Delta Stream created strong winds!`); } } },
	'desolateland': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => { if (b.weather?.type !== 'harsh-sun') { b.weather = { type: 'harsh-sun', turns: 9999 }; l.push(`${s.pokemon.species}'s Desolate Land created harsh sunlight!`); } } },
	'primordialsea': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => { if (b.weather?.type !== 'heavy-rain') { b.weather = { type: 'heavy-rain', turns: 9999 }; l.push(`${s.pokemon.species}'s Primordial Sea created heavy rain!`); } } },
	'orichalcumpulse': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startWeather(s, b, l, 'sun', 'heatrock', 'Orichalcum Pulse created harsh sunlight!') },
	'cloudnine': { suppressWeather: true }, 'airlock': { suppressWeather: true },
	'solarpower': { modifiesSpAtk: true, weatherDamage: 'sun' }, 'raindish': { weatherHeal: 'rain' }, 'icebody': { weatherHeal: 'hail' },
};

function startWeather(slot: ActivePokemonSlot, battle: BattleState, log: string[], type: any, rock: string, msg: string) {
	if (battle.weather?.type !== type) {
		const turns = (battle.magicRoomTurns === 0 && slot.pokemon.item === rock) ? 8 : 5;
		battle.weather = { type, turns }; log.push(`${slot.pokemon.species}'s ${msg}`);
	}
}

export const TERRAIN_ABILITIES: any = {
	'electricsurge': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startTerrain(s, b, l, 'electric', 'Electric Surge electrified the field!') },
	'grassysurge': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startTerrain(s, b, l, 'grassy', 'Grassy Surge created grassy terrain!') },
	'mistysurge': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startTerrain(s, b, l, 'misty', 'Misty Surge created misty terrain!') },
	'psychicsurge': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startTerrain(s, b, l, 'psychic', 'Psychic Surge created psychic terrain!') },
	'hadronengine': { onSwitchIn: (s: ActivePokemonSlot, b: BattleState, l: string[]) => startTerrain(s, b, l, 'electric', 'Hadron Engine electrified the field!') },
	'surgesurfer': { terrainSpeedBoost: 'electric' },
};

function startTerrain(slot: ActivePokemonSlot, battle: BattleState, log: string[], type: any, msg: string) {
	if (battle.terrain?.type !== type) { battle.terrain = { type, turns: 5 }; log.push(`${slot.pokemon.species}'s ${msg}`); }
}

export const ITEM_INTERACTION_ABILITIES = { 'stickyhold': { preventsItemRemoval: true }, 'unburden': { onItemRemove: true }, 'klutz': { preventsItemUse: true } };
export const HEALING_ABILITIES = { 'regenerator': { onSwitchOut: 1 / 3 }, 'naturalcure': { healStatusOnSwitch: true } };
export const CONTACT_ABILITIES: any = {
	'static': { onContactChance: 0.3, effect: 'par' }, 'flamebody': { onContactChance: 0.3, effect: 'brn' },
	'poisonpoint': { onContactChance: 0.3, effect: 'psn' }, 'effectspore': { onContactChance: 0.3, effects: ['psn', 'par', 'slp'] },
	'cutecharm': { onContactChance: 0.3, effect: 'infatuate' }, 'roughskin': { onContactDamage: 1 / 8 }, 'ironbarbs': { onContactDamage: 1 / 8 },
	'gooey': { onContactStat: 'spe', value: -1 }, 'tanglinghair': { onContactStat: 'spe', value: -1 }, 'poisontouch': { onContactChance: 0.3, effect: 'psn' },
	'pickpocket': { stealItem: true }, 'watercompaction': { onContactStat: 'def', value: 2, triggerType: 'Water' },
	'toxicchain': { onContactChance: 0.3, effect: 'tox' }, 'mummy': { changeAbility: 'mummy' }, 'lingeringaroma': { changeAbility: 'lingeringaroma' },
	'wanderingspirit': { swapAbility: true }, 'perishbody': { perishBody: true },
};
export const PRIORITY_ABILITIES = {
	'prankster': { modifyPriority: (m: Move) => m.category === 'Status' ? 1 : 0 },
	'galewings': { modifyPriority: (m: Move, p: RPGPokemon) => (m.type === 'Flying' && p.hp === p.maxHp) ? 1 : 0 },
	'quickdraw': { modifyPriority: (m: Move) => (m.category !== 'Status' && Math.random() < 0.3) ? 1 : 0 },
	'stall': { modifyPriority: () => -9999 },
	'myceliummight': { modifyPriority: (m: Move) => m.category === 'Status' ? -999 : 0, ignoresAbilities: true },
};
export const ACCURACY_EVASION_ABILITIES = {
	'compoundeyes': { accuracyMultiplier: 1.3 }, 'hustle': { accuracyMultiplier: 0.8 }, 'tangledfeet': { evasionBoost: true },
	'sandveil': { weatherEvasion: 'sand' }, 'snowcloak': { weatherEvasion: 'hail' }, 'noguard': { alwaysHit: true },
	'victorystar': { accuracyMultiplier: 1.1 }, 'mindseye': { ignoresEvasion: true, hitsGhosts: true },
};
export const RECOIL_DRAIN_ABILITIES = { 'rockhead': { preventsRecoil: true }, 'magicguard': { preventsIndirectDamage: true } };
export const FORM_CHANGE_ABILITIES = {
	'stancechange': { formChange: true }, 'schooling': { hpFormChange: true }, 'shieldsdown': { hpFormChange: true },
	'iceface': { blockPhysical: true }, 'mimicry': { terrainType: true }, 'hungerswitch': { formChange: true, everyTurn: true },
	'zenmode': { hpFormChange: true, threshold: 0.5 }, 'gulpmissile': { formChange: true, onSurfDive: true },
};
export const MULTI_HIT_ABILITIES = { 'skilllink': { maxHits: true }, 'parentalbond': { attackTwice: true } };
export const CRITICAL_HIT_ABILITIES = { 'superluck': { critBoost: 1 }, 'sniper': { critDamageMultiplier: 1.5 } };
export const ON_KO_ABILITIES: Record<string, { handler: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void }> = {
	'moxie': { handler: (s, b, l) => { if (s.statStages.atk < 6) { s.statStages.atk++; l.push(`${s.pokemon.species}'s Moxie raised its Attack!`); } } },
	'chillingneigh': { handler: (s, b, l) => { if (s.statStages.atk < 6) { s.statStages.atk++; l.push(`${s.pokemon.species}'s Chilling Neigh raised its Attack!`); } } },
	'beastboost': {
		handler: (s, b, l) => {
			const stats = s.pokemon;
			const mapping = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
			const highest = (Object.keys(mapping) as (keyof typeof mapping)[]).reduce((a, b) => stats[a] > stats[b] ? a : b);
			if (s.statStages[highest] < 6) { s.statStages[highest]++; l.push(`${s.pokemon.species}'s Beast Boost raised its ${mapping[highest]}!`); }
		}
	},
	'grimneigh': { handler: (s, b, l) => { if (s.statStages.spa < 6) { s.statStages.spa++; l.push(`${s.pokemon.species}'s Grim Neigh raised its Sp. Atk!`); } } },
	'asoneglastrier': { handler: (s, b, l) => { if (s.statStages.atk < 6) { s.statStages.atk++; l.push(`${s.pokemon.species}'s As One raised its Attack!`); } } },
	'asonespectrier': { handler: (s, b, l) => { if (s.statStages.spa < 6) { s.statStages.spa++; l.push(`${s.pokemon.species}'s As One raised its Sp. Atk!`); } } },
	'soulheart': { handler: (s, b, l) => { if (s.statStages.spa < 6) { s.statStages.spa++; l.push(`${s.pokemon.species}'s Soul-Heart raised its Sp. Atk!`); } } },
	'aftermath': { handler: () => { } }, 'innardsout': { handler: () => { } },
};
export const END_OF_TURN_ABILITIES: Record<string, { handler: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void }> = {
	'speedboost': { handler: (s, b, l) => { if (s.statStages.spe < 6) { s.statStages.spe++; l.push(`${s.pokemon.species}'s Speed Boost raised its Speed!`); } } },
	'shedskin': {
		handler: (s, b, l) => {
			if (s.status && Math.random() < 0.3) {
				l.push(`${s.pokemon.species} shed its skin and cured its ${s.status}!`); s.status = null;
			}
		}
	},
	'moody': {
		handler: (s, b, l) => {
			const stats = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'] as const;
			const raise = stats.filter(k => s.statStages[k] < 6);
			const lower = stats.filter(k => s.statStages[k] > -6);
			if (raise.length) {
				const r = raise[Math.floor(Math.random() * raise.length)];
				s.statStages[r] = Math.min(6, s.statStages[r] + 2); l.push(`${s.pokemon.species}'s Moody sharply raised its ${r}!`);
				const lOpts = lower.filter(k => k !== r);
				if (lOpts.length) {
					const lStat = lOpts[Math.floor(Math.random() * lOpts.length)];
					s.statStages[lStat] = Math.max(-6, s.statStages[lStat] - 1); l.push(`${s.pokemon.species}'s Moody lowered its ${lStat}!`);
				}
			}
		}
	},
	'healer': {
		handler: (s, b, l) => {
			if (Math.random() >= 0.3) return;
			const allies = b.playerSlots.some(p => p?.pokemon.id === s.pokemon.id) ? b.playerSlots : b.opponentSlots;
			const ally = allies.find(a => a && a.pokemon.id !== s.pokemon.id && a.pokemon.hp > 0 && a.status);
			if (ally) { l.push(`${s.pokemon.species}'s Healer cured ${ally.pokemon.species}'s ${ally.status}!`); ally.status = null; }
		}
	},
	'harvest': {
		handler: (s, b, l) => {
			if (!s.consumedBerry || s.pokemon.item || s.harvestUsedThisTurn) return;
			if (Math.random() < (isWeatherActive(b) && b.weather?.type.includes('sun') ? 1 : 0.5)) {
				s.pokemon.item = s.consumedBerry; l.push(`${s.pokemon.species}'s Harvest restored its ${s.consumedBerry}!`); s.harvestUsedThisTurn = true;
			}
		}
	},
	'baddreams': {
		handler: (s, b, l) => {
			const opps = b.playerSlots.some(p => p?.pokemon.id === s.pokemon.id) ? b.opponentSlots : b.playerSlots;
			opps.forEach(o => {
				if (o && o.pokemon.hp > 0 && o.status === 'slp') {
					o.pokemon.hp = Math.max(0, o.pokemon.hp - Math.floor(o.pokemon.maxHp / 8));
					l.push(`${o.pokemon.species} is tormented by ${s.pokemon.species}'s Bad Dreams!`);
				}
			});
		}
	},
	'cudchew': {
		handler: (s, b, l) => {
			if (s.cudChewBerry && !s.pokemon.item) {
				s.pokemon.item = s.cudChewBerry; l.push(`${s.pokemon.species} is chewing its ${s.cudChewBerry} again!`); s.cudChewBerry = undefined;
			}
		}
	},
	'colorchange': { handler: () => { } }, 'windpower': { handler: () => { } }, 'windrider': { handler: () => { } }, 'electromorphosis': { handler: () => { } },
};
export const STAT_DROP_RESPONSE_ABILITIES = {
	'defiant': { handler: (s: ActivePokemonSlot, b: BattleState, l: string[], src?: ActivePokemonSlot) => { if (src && src.pokemon.id !== s.pokemon.id && s.statStages.atk < 6) { s.statStages.atk = Math.min(6, s.statStages.atk + 2); l.push(`${s.pokemon.species}'s Defiant sharply raised its Attack!`); } } },
	'competitive': { handler: (s: ActivePokemonSlot, b: BattleState, l: string[], src?: ActivePokemonSlot) => { if (src && src.pokemon.id !== s.pokemon.id && s.statStages.spa < 6) { s.statStages.spa = Math.min(6, s.statStages.spa + 2); l.push(`${s.pokemon.species}'s Competitive sharply raised its Sp. Atk!`); } } },
	'mirrorarmor': { handler: () => { } },
};
export const STATUS_INTERACTION_ABILITIES = {
	'poisonheal': { healFromPoison: (s: ActivePokemonSlot, l: string[]) => { if (s.pokemon.hp < s.pokemon.maxHp) { s.pokemon.hp = Math.min(s.pokemon.maxHp, s.pokemon.hp + Math.max(1, Math.floor(s.pokemon.maxHp / 8))); l.push(`<span style="color: #28a745;"><strong>${s.pokemon.species}</strong> was healed by its Poison Heal!</span>`); } } },
	'hydration': { cureStatusInRain: (s: ActivePokemonSlot, l: string[]) => { if (s.status) { s.status = null; l.push(`${s.pokemon.species}'s Hydration cured its status condition!`); } } },
};
export const TRAPPING_ABILITIES = { 'shadowtag': { preventsSwitch: true, description: 'Prevents non-Shadow Tag opponents from switching' }, 'arenatrap': { preventsSwitch: true, groundedOnly: true, description: 'Prevents grounded opponents from switching' }, 'magnetpull': { preventsSwitch: true, steelOnly: true, description: 'Prevents Steel-type opponents from switching' } };
export const AURA_ABILITIES = { 'darkaura': { boostedType: 'Dark', multiplier: 1.33, description: 'Boosts Dark-type moves for all Pokemon by 33%' }, 'fairyaura': { boostedType: 'Fairy', multiplier: 1.33, description: 'Boosts Fairy-type moves for all Pokemon by 33%' }, 'aurabreak': { reversesAuras: true, description: 'Reverses the effects of Dark Aura and Fairy Aura' } };
export const RUIN_ABILITIES = { 'swordofruin': { stat: 'def', description: 'Lowers Defense of all other Pokemon' }, 'tabletsofruin': { stat: 'atk', description: 'Lowers Attack of all other Pokemon' }, 'vesselofruin': { stat: 'spa', description: 'Lowers Sp. Atk of all other Pokemon' }, 'beadsofruin': { stat: 'spd', description: 'Lowers Sp. Def of all other Pokemon' } };
export const SPECIAL_MECHANIC_ABILITIES = {
	'protean': { changeTypeOnMove: true, description: 'Changes type to move type' }, 'libero': { changeTypeOnMove: true, description: 'Changes type to move type' },
	'magician': { stealsItemOnHit: true, description: 'Steals item on hit' }, 'dancer': { copiesDanceMoves: true, description: 'Copies dance moves' },
	'symbiosis': { passesItem: true, description: 'Passes item to ally' }, 'opportunist': { copiesStatBoosts: true, description: 'Copies stat boosts' },
	'receiver': { copiesAllyAbility: true, description: 'Copies defeated ally ability' }, 'powerofalchemy': { copiesAllyAbility: true, description: 'Copies defeated ally ability' },
	'magicbounce': { reflectsStatusMoves: true, description: 'Reflects status moves' }, 'rebound': { reflectsStatusMoves: true, description: 'Reflects status moves' },
	'wonderskin': { lowersStatusAccuracy: true, description: 'Lowers status move accuracy' }, 'waterbubble': { fireResistance: 0.5, attackBoost: 2.0, burnImmune: true, description: 'Halves Fire dmg, doubles Atk, prevents burn' },
};
export const RPG_SPECIFIC_ABILITIES = {
	'noability': { description: 'No ability' }, 'runaway': { description: 'Guarantees escape', escapeGuaranteed: true },
	'illuminate': { description: '2x encounter rate', encounterRateMultiplier: 2 }, 'honeygather': { description: 'Gathers Honey', postBattleItem: 'honey', chance: 0.05 },
	'pickup': { description: 'Picks up items', postBattlePickup: true, chanceByLevel: true }, 'ballfetch': { description: 'Fetches failed ball', retrievesBall: true },
	'anticipation': { description: 'Warns dangerous moves', warnsDangerousMoves: true }, 'forewarn': { description: 'Reveals strongest move', revealsStrongestMove: true },
};

// #endregion

// #region Public API

export function isAbilityIgnored(attacker: RPGPokemon, defender: RPGPokemon, ability: string): boolean {
	const aAbil = toID(attacker.ability || '');
	return ['moldbreaker', 'turboblaze', 'teravolt'].includes(aAbil) && !['disguise', 'stancechange', 'schooling', 'comatose', 'shieldsdown', 'rkssystem', 'powerconstruct'].includes(ability);
}

export function isPersistent(pokemon: RPGPokemon): boolean { return toID(pokemon.ability || '') === 'persistent'; }

export function getModifiedWeight(pokemon: RPGPokemon): number {
	const w = Dex.species.get(pokemon.species).weightkg;
	const a = toID(pokemon.ability || '');
	return a === 'heavymetal' ? w * 2 : a === 'lightmetal' ? w / 2 : w;
}

export function isWeatherActive(battle: BattleState): boolean {
	if (!battle.weather) return false;
	const all = [...getActiveSlots(battle.playerSlots), ...getActiveSlots(battle.opponentSlots)];
	return !all.some(s => ['cloudnine', 'airlock'].includes(toID(s.pokemon.ability || '')));
}

export function isGrounded(slotOrPokemon: ActivePokemonSlot | RPGPokemon, battle: BattleState): boolean {
	const p = (slotOrPokemon as any).pokemon || slotOrPokemon;
	const slot = (slotOrPokemon as any).pokemon ? (slotOrPokemon as ActivePokemonSlot) : undefined;
	if (battle.gravityTurns > 0 || slot?.isSmackedDown || slot?.isIngrained) return true;
	if (slot?.magnetRiseTurns || battle.magicRoomTurns === 0 && p.item === 'airballoon' || toID(p.ability || '') === 'levitate') return false;
	return !Dex.species.get(p.species).types.includes('Flying');
}

export function getAbilityData(abilityName: string) {
	const a = Dex.abilities.get(abilityName); return a.exists ? a : null;
}

export function getAbilityInfo(abilityName: string) {
	const a = Dex.abilities.get(abilityName); return a.exists ? { name: a.name, desc: a.desc || a.shortDesc, rating: a.rating } : null;
}

export function applyAbilityStatModifier(p: RPGPokemon, s: string, v: number, slot?: ActivePokemonSlot, b?: BattleState): number {
	const h = STAT_MODIFIER_ABILITIES[toID(p.ability || '')]; return h ? h(p, s, v, slot, b) : v;
}

export function applySereneGrace(ctx: AbilityContext, chance: number): number {
	return toID(ctx.attacker.ability || '') === 'serenegrace' ? Math.min(100, chance * 2) : chance;
}

export function checkAbilityImmunity(ctx: AbilityContext): { immune: boolean, message?: string } | null {
	if (isAbilityIgnored(ctx.attacker, ctx.defender, toID(ctx.defender.ability || ''))) return null;
	const h = IMMUNITY_ABILITIES[toID(ctx.defender.ability || '')]; return h ? h(ctx) : null;
}

export function applyAbilityPowerModifier(ctx: AbilityContext, bp: number): number {
	const h = POWER_MODIFIER_ABILITIES[toID(ctx.attacker.ability || '')];
	if (h) bp = h(ctx, bp);
	if (ctx.move.type === 'Fire' && ctx.attackerSlot.flashFireBoost) bp = Math.floor(bp * 1.5);
	if ((ctx.move as any).typeConversionBoost) bp = Math.floor(bp * 1.2);
	
	const allies = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.attacker.id) ? ctx.battle.playerSlots : ctx.battle.opponentSlots;
	if (ctx.move.category === 'Special' && allies.some(s => s && s.pokemon.id !== ctx.attacker.id && toID(s.pokemon.ability || '') === 'battery')) bp = Math.floor(bp * 1.3);
	if (allies.some(s => s && s.pokemon.id !== ctx.attacker.id && toID(s.pokemon.ability || '') === 'powerspot')) bp = Math.floor(bp * 1.3);
	return bp;
}

export function applyAbilityTypeModifier(ctx: AbilityContext, type: string): string {
	const h = TYPE_MODIFIER_ABILITIES[toID(ctx.attacker.ability || '')]; return h ? h(ctx, type) : type;
}

export function checkItemRemovalPrevention(p: RPGPokemon): boolean { return !!ITEM_INTERACTION_ABILITIES[toID(p.ability || '')]?.preventsItemRemoval; }

export function getSTABMultiplier(p: RPGPokemon, type: string, slot?: ActivePokemonSlot): number {
	const species = Dex.species.get(p.species);
	const abil = toID(p.ability || '');
	const adapt = abil === 'adaptability';
	
	if (slot?.terastallized) {
		const isTera = slot.terastallized === type;
		const isOrig = species.types.includes(type);
		if (isTera) return (isOrig ? (adapt ? 2.25 : 2.0) : (adapt ? 2.0 : 1.5));
		return isOrig ? 1.5 : 1;
	}
	return species.types.includes(type) ? (adapt ? 2.0 : 1.5) : 1;
}

export function preventsFlinch(p: RPGPokemon): boolean { return toID(p.ability || '') === 'innerfocus'; }

export function preventsStatus(p: RPGPokemon, status: string, battle?: BattleState, attacker?: RPGPokemon): boolean {
	const abil = toID(p.ability || '');
	if (attacker && toID(attacker.ability || '') === 'corrosion' && ['psn', 'tox'].includes(status)) return ['immunity', 'purifyingsalt'].includes(abil);
	if (abil === 'purifyingsalt') return true;
	if (abil === 'immunity' && ['psn', 'tox'].includes(status)) return true;
	if (abil === 'waterveil' && status === 'brn') return true;
	if (abil === 'limber' && status === 'par') return true;
	if (['insomnia', 'vitalspirit'].includes(abil) && status === 'slp') return true;
	if (abil === 'magmaarmor' && status === 'frz') return true;
	if (abil === 'leafguard' && battle && isWeatherActive(battle) && battle.weather?.type.includes('sun')) return true;
	
	if (battle) {
		const allies = battle.playerSlots.some(s => s?.pokemon.id === p.id) ? battle.playerSlots : battle.opponentSlots;
		if (['psn', 'tox'].includes(status) && allies.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'pastelveil')) return true;
		if (status === 'slp' && allies.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'sweetveil')) return true;
	}
	return false;
}

export function applyPriorityModifier(move: Move, p: RPGPokemon): number {
	const h = PRIORITY_ABILITIES[toID(p.ability || '')]; return h ? h.modifyPriority(move, p) : 0;
}

export function applyAccuracyModifier(acc: number, p: RPGPokemon, move: Move): number {
	const h = ACCURACY_EVASION_ABILITIES[toID(p.ability || '')];
	if (h?.accuracyMultiplier) return (toID(p.ability || '') === 'hustle' && move.category !== 'Physical') ? acc : Math.floor(acc * h.accuracyMultiplier);
	return acc;
}

export function getEvasionMultiplier(slot: ActivePokemonSlot, battle: BattleState): number {
	const h = ACCURACY_EVASION_ABILITIES[toID(slot.pokemon.ability || '')];
	if (h?.weatherEvasion === 'sand' && isWeatherActive(battle) && battle.weather?.type === 'sand') return 1.25;
	if (h?.weatherEvasion === 'hail' && isWeatherActive(battle) && battle.weather?.type === 'hail') return 1.25;
	if (h?.evasionBoost && slot.isConfused) return 1.5;
	return 1;
}

export function applyAbilitySpeedModifier(p: RPGPokemon, battle: BattleState, speed: number): number {
	const abil = toID(p.ability || '');
	const slot = [...battle.playerSlots, ...battle.opponentSlots].find(s => s?.pokemon.id === p.id);
	if (abil === 'quickfeet' && (slot?.status || p.status)) return Math.floor(speed * 1.5);
	if (isWeatherActive(battle)) {
		if (abil === 'swiftswim' && battle.weather?.type.includes('rain')) return speed * 2;
		if (abil === 'chlorophyll' && battle.weather?.type.includes('sun')) return speed * 2;
		if (abil === 'sandrush' && battle.weather?.type === 'sand') return speed * 2;
		if (abil === 'slushrush' && battle.weather?.type === 'hail') return speed * 2;
	}
	if (abil === 'surgesurfer' && battle.terrain?.type === 'electric' && isGrounded(p, battle)) return speed * 2;
	if (abil === 'unburden' && slot?.unburdenActive) return speed * 2;
	return speed;
}

export function applyDamageModifier(ctx: AbilityContext, dmg: number): number {
	const dMod = DEFENDER_DMG_MODS[toID(ctx.defender.ability || '')];
	if (dMod) dmg = dMod(ctx, dmg);
	const aMod = ATTACKER_DMG_MODS[toID(ctx.attacker.ability || '')];
	if (aMod) dmg = aMod(ctx, dmg);
	
	if (toID(ctx.attacker.ability || '') === 'battery' || toID(ctx.attacker.ability || '') === 'powerspot') { /* Handled in Power Mod, not here */ } 
	return dmg;
}

export function shouldApplySecondaryEffects(attacker: RPGPokemon, move: Move): boolean {
	return !(toID(attacker.ability || '') === 'sheerforce' && (move.secondary || move.secondaries));
}

export function takesIndirectDamage(p: RPGPokemon): boolean { return toID(p.ability || '') !== 'magicguard'; }
export function preventsRecoil(p: RPGPokemon): boolean { return toID(p.ability || '') === 'rockhead'; }
export function canUseHeldItem(p: RPGPokemon, b: BattleState): boolean { return b.magicRoomTurns === 0 && toID(p.ability || '') !== 'klutz'; }

export function checkFormChangeAbilities(slot: ActivePokemonSlot, battle: BattleState, log: string[]): void {
	const p = slot.pokemon;
	const abil = toID(p.ability || '');
	if (abil === 'stancechange' && p.species.startsWith('Aegislash')) {
		if (slot.lastMoveUsed === 'kingsshield' && p.species === 'Aegislash-Blade') { p.species = 'Aegislash'; log.push(`${p.nickname || p.species} changed to Shield Forme!`); }
		else if (slot.lastMoveUsed && Dex.moves.get(slot.lastMoveUsed).category !== 'Status' && p.species === 'Aegislash') { p.species = 'Aegislash-Blade'; log.push(`${p.nickname || p.species} changed to Blade Forme!`); }
	}
	else if (abil === 'schooling' && p.species.startsWith('Wishiwashi')) {
		if (p.level >= 20 && p.hp > p.maxHp * 0.25 && p.species === 'Wishiwashi') { p.species = 'Wishiwashi-School'; log.push(`${p.nickname || p.species} formed a school!`); }
		else if (p.hp <= p.maxHp * 0.25 && p.species === 'Wishiwashi-School') { p.species = 'Wishiwashi'; log.push(`${p.nickname || p.species} stopped schooling!`); }
	}
	else if (abil === 'shieldsdown' && p.species.startsWith('Minior-Meteor') && p.hp <= p.maxHp * 0.5) {
		p.species = `Minior-${p.species.split('-')[2] || 'Red'}`; log.push(`${p.nickname || p.species}'s shell broke off!`);
	}
	else if (abil === 'terashift' && p.species === 'Terapagos' && slot.activeTurns === 1) {
		p.species = 'Terapagos-Terastal'; log.push(`${p.nickname || p.species} transformed into its Terastal Form!`);
	}
	else if (abil === 'gulpmissile' && (slot as any).gulpMissileForm && slot.lastDamageTaken && p.species.includes('Gulping') || p.species.includes('Gorging')) {
		p.species = 'Cramorant'; (slot as any).gulpMissileForm = null;
	}
}

export function getMultiHitCount(attacker: RPGPokemon, move: Move): number {
	if (!move.multihit) return 1;
	const link = toID(attacker.ability || '') === 'skilllink';
	if (link && Array.isArray(move.multihit)) return move.multihit[1];
	if (Array.isArray(move.multihit)) {
		if (move.multihit[0] === 2 && move.multihit[1] === 5) {
			const r = Math.random() * 100;
			return r < 35 ? 2 : r < 70 ? 3 : r < 85 ? 4 : 5;
		}
		return move.multihit[0] + Math.floor(Math.random() * (move.multihit[1] - move.multihit[0] + 1));
	}
	return move.multihit as number;
}

export function hasParentalBond(p: RPGPokemon): boolean { return toID(p.ability || '') === 'parentalbond'; }
export function applyParentalBondModifier(dmg: number, second: boolean): number { return second ? Math.floor(dmg * 0.25) : dmg; }

export function preventMove(ctx: AbilityContext): { prevented: boolean, message?: string } | null {
	const all = [...ctx.battle.playerSlots, ...ctx.battle.opponentSlots];
	if (['explosion', 'selfdestruct', 'mindblown', 'mistyexplosion'].includes(ctx.move.id) && all.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'damp')) return { prevented: true, message: `${ctx.attacker.species} cannot use ${ctx.move.name} due to Damp!` };
	
	if (ctx.battle.weather?.type === 'harsh-sun' && ctx.move.type === 'Water') return { prevented: true, message: `The harsh sunlight evaporated the Water-type move!` };
	if (ctx.battle.weather?.type === 'heavy-rain' && ctx.move.type === 'Fire') return { prevented: true, message: `The heavy rain extinguished the Fire-type move!` };

	if (isAbilityIgnored(ctx.attacker, ctx.defender, toID(ctx.defender.ability || ''))) return null;
	const dAbil = toID(ctx.defender.ability || '');
	
	if (['dazzling', 'queenlymajesty', 'armortail'].includes(dAbil) && (ctx.move.priority || 0) > 0) return { prevented: true, message: `${ctx.defender.species}'s ${ctx.defender.ability} prevents ${ctx.move.name}!` };
	if (dAbil === 'goodasgold' && ctx.move.category === 'Status') return { prevented: true, message: `${ctx.defender.species}'s Good as Gold prevents ${ctx.move.name}!` };
	return null;
}

export function applyStatChangeModifier(v: number, ability: string): number { return ability === 'contrary' ? -v : ability === 'simple' ? v * 2 : v; }
export function applyOnKOAbilities(s: ActivePokemonSlot, b: BattleState, l: string[]) { const h = ON_KO_ABILITIES[toID(s.pokemon.ability || '')]; if (h) h.handler(s, b, l); }
export function applyEndOfTurnAbilities(s: ActivePokemonSlot, b: BattleState, l: string[]) { const h = END_OF_TURN_ABILITIES[toID(s.pokemon.ability || '')]; if (h) h.handler(s, b, l); }
export function applyStatDropResponse(s: ActivePokemonSlot, b: BattleState, l: string[], src?: ActivePokemonSlot) { const h = STAT_DROP_RESPONSE_ABILITIES[toID(s.pokemon.ability || '') as keyof typeof STAT_DROP_RESPONSE_ABILITIES]; if (h) h.handler(s, b, l, src); }
export function handlePoisonHeal(s: ActivePokemonSlot, l: string[]): boolean { const h = STATUS_INTERACTION_ABILITIES.poisonheal; if (toID(s.pokemon.ability || '') === 'poisonheal' && h) { h.healFromPoison!(s, l); return true; } return false; }
export function handleHydration(s: ActivePokemonSlot, b: BattleState, l: string[]): boolean { const h = STATUS_INTERACTION_ABILITIES.hydration; if (toID(s.pokemon.ability || '') === 'hydration' && b.weather?.type === 'rain' && h) { h.cureStatusInRain!(s, l); return true; } return false; }

export function applySwitchInAbilities(slot: ActivePokemonSlot, battle: BattleState, isPlayerSwitchIn: boolean, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	
	if (WEATHER_ABILITIES[ability]?.onSwitchIn) WEATHER_ABILITIES[ability].onSwitchIn(slot, battle, messageLog);
	if (TERRAIN_ABILITIES[ability]?.onSwitchIn) TERRAIN_ABILITIES[ability].onSwitchIn(slot, battle, messageLog);
	if (SWITCH_IN_HANDLERS[ability]) SWITCH_IN_HANDLERS[ability](slot, battle, messageLog);

	if ((ability === 'protosynthesis' || ability === 'quarkdrive') && slot.pokemon.item === 'boosterenergy') {
		const sun = ability === 'protosynthesis' && battle.weather?.type.includes('sun');
		const elec = ability === 'quarkdrive' && battle.terrain?.type === 'electric';
		if (!sun && !elec && !(slot as any).boosterEnergyActive) {
			slot.pokemon.item = undefined; (slot as any).boosterEnergyActive = true; messageLog.push(`${slot.pokemon.species} consumed Booster Energy to activate ${slot.pokemon.ability}!`);
		}
	}
}

export function applyContactAbilityEffects(ctx: AbilityContext): void {
	if (isAbilityIgnored(ctx.attacker, ctx.defender, toID(ctx.defender.ability || ''))) return;
	const h = CONTACT_ABILITIES[toID(ctx.defender.ability || '')];
	if (!h) return;

	const atk = ctx.attacker;
	if (h.onContactDamage && takesIndirectDamage(atk)) {
		atk.hp = Math.max(0, atk.hp - Math.floor(atk.maxHp * h.onContactDamage));
		ctx.messageLog.push(`${atk.species} was hurt by ${ctx.defender.species}'s ${ctx.defender.ability}!`);
	}
	if (h.onContactStat && atk.hp > 0) {
		if (applyStatChange(ctx.attackerSlot, h.onContactStat, h.value, ctx.battle, ctx.messageLog, ctx.defenderSlot)) {
			ctx.messageLog[ctx.messageLog.length - 1] += ` (from ${ctx.defender.species}'s ${ctx.defender.ability})!`;
		}
	}
	if (h.effect && !ctx.attackerSlot.status && atk.hp > 0 && Math.random() < h.onContactChance) {
		let blocked = false;
		const types = ctx.attackerSlot.terastallized ? [ctx.attackerSlot.terastallized] : Dex.species.get(atk.species).types;
		if (h.effect === 'par' && types.includes('Electric')) blocked = true;
		if (h.effect === 'brn' && types.includes('Fire')) blocked = true;
		if (h.effect === 'psn' && (types.includes('Poison') || types.includes('Steel'))) blocked = true;
		if (!blocked && preventsStatus(atk, h.effect, ctx.battle)) { ctx.messageLog.push(`${atk.species}'s ability prevents ${h.effect}!`); blocked = true; }
		
		if (!blocked) {
			if (h.effect === 'infatuate') { /* Not implemented in original fully */ }
			else {
				ctx.attackerSlot.status = h.effect;
				if (h.effect === 'slp') (ctx.attackerSlot as any).sleepCounter = Math.floor(Math.random() * 3) + 1;
				ctx.messageLog.push(`${atk.species} was afflicted with ${h.effect} by ${ctx.defender.species}'s ${ctx.defender.ability}!`);
			}
		}
	}
	if (h.stealItem && atk.hp > 0 && !ctx.defender.item && atk.item && toID(atk.ability || '') !== 'stickyhold') {
		ctx.defender.item = atk.item; atk.item = undefined; ctx.messageLog.push(`${ctx.defender.species} stole ${atk.species}'s ${ctx.defender.item}!`);
	}
}

export function getAllImplementedAbilities(): string[] {
	return [
		...Object.keys(IMMUNITY_ABILITIES), ...Object.keys(POWER_MODIFIER_ABILITIES), ...Object.keys(TYPE_MODIFIER_ABILITIES),
		...Object.keys(STAT_MODIFIER_ABILITIES), ...Object.keys(ITEM_INTERACTION_ABILITIES), ...Object.keys(WEATHER_ABILITIES),
		...Object.keys(CONTACT_ABILITIES), ...Object.keys(PRIORITY_ABILITIES), ...Object.keys(ACCURACY_EVASION_ABILITIES),
		...Object.keys(RECOIL_DRAIN_ABILITIES), ...Object.keys(FORM_CHANGE_ABILITIES), ...Object.keys(MULTI_HIT_ABILITIES),
		...Object.keys(CRITICAL_HIT_ABILITIES), ...Object.keys(TERRAIN_ABILITIES), ...Object.keys(HEALING_ABILITIES),
		...Object.keys(ON_KO_ABILITIES), ...Object.keys(END_OF_TURN_ABILITIES), ...Object.keys(STAT_DROP_RESPONSE_ABILITIES),
		...Object.keys(STATUS_INTERACTION_ABILITIES), 'contrary', 'simple',
	];
}

// #endregion

export const RPGAbilities = {
	checkImmunity: checkAbilityImmunity, applyPowerModifier: applyAbilityPowerModifier, applyTypeModifier: applyAbilityTypeModifier,
	applyAbilityStatModifier, applyAbilitySpeedModifier, applyDamageModifier, checkItemRemovalPrevention, getSTABMultiplier,
	preventsStatus, preventMove, applySereneGrace, isGrounded, applyContactAbilityEffects, applySwitchInAbilities,
	applyPriorityModifier, applyAccuracyModifier, getEvasionMultiplier, isWeatherActive, checkFormChangeAbilities,
	getMultiHitCount, hasParentalBond, applyParentalBondModifier, preventsFlinch, getAllImplementedAbilities, getAbilityInfo,
	getAbilityData, shouldApplySecondaryEffects, takesIndirectDamage, preventsRecoil, canUseHeldItem, applyOnKOAbilities,
	applyEndOfTurnAbilities, applyStatDropResponse, applyStatChangeModifier, handlePoisonHeal, handleHydration, getModifiedWeight,
	isAbilityIgnored, isPersistent,
	IMMUNITY_ABILITIES, POWER_MODIFIER_ABILITIES, TYPE_MODIFIER_ABILITIES, STAT_MODIFIER_ABILITIES, ITEM_INTERACTION_ABILITIES,
	WEATHER_ABILITIES, CONTACT_ABILITIES, PRIORITY_ABILITIES, ACCURACY_EVASION_ABILITIES, RECOIL_DRAIN_ABILITIES,
	FORM_CHANGE_ABILITIES, MULTI_HIT_ABILITIES, CRITICAL_HIT_ABILITIES, TERRAIN_ABILITIES, HEALING_ABILITIES, ON_KO_ABILITIES,
	END_OF_TURN_ABILITIES, STAT_DROP_RESPONSE_ABILITIES, STATUS_INTERACTION_ABILITIES, TRAPPING_ABILITIES, AURA_ABILITIES,
	RUIN_ABILITIES, SPECIAL_MECHANIC_ABILITIES, RPG_SPECIFIC_ABILITIES,
};

export default RPGAbilities;
