/*
* Pokemon Showdown
* RPG Abilities
*/
import { Dex, toID } from '../../../sim/dex';
import { getActiveSlots } from './utils';
import { applyStatChange } from './battle-shared';
import type { RPGPokemon, ActivePokemonSlot, BattleState, Move, AbilityContext, AbilityImmunityHandler, AbilityPowerModifierHandler, AbilityDamageModifierHandler, AbilityStatModifierHandler, AbilityTypeModifierHandler, AbilityOnSwitchInHandler, AbilityOnDamageHandler, AbilityOnMoveHandler, AbilityOnKOHandler, AbilityEndOfTurnHandler, AbilityStatDropResponseHandler, AbilityStatChangeModifierHandler } from './interface';

export function isAbilityIgnored(attacker: RPGPokemon, defender: RPGPokemon, defenderAbilityId: string): boolean {
	const attackerAbility = toID(attacker.ability || '');
	if (['moldbreaker', 'turboblaze', 'teravolt'].includes(attackerAbility)) {
		// These abilities ignore most defensive abilities
		// Add any abilities that CANNOT be ignored here
		if (['disguise', 'stancechange', 'schooling', 'comatose'].includes(defenderAbilityId)) {
			return false;
		}
		return true;
	}
	return false;
}

export const IMMUNITY_ABILITIES: Record<string, AbilityImmunityHandler> = {
	'soundproof': ctx => {
		if (ctx.move.flags.sound) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Soundproof blocks the move!`,
			};
		}
		return null;
	},

	'overcoat': ctx => {
		if (ctx.move.flags.powder) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Overcoat blocks the move!`,
			};
		}
		return null;
	},

	'levitate': ctx => {
		if (ctx.move.type === 'Ground' && ctx.battle.gravityTurns === 0) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Levitate makes it immune to Ground moves!`,
			};
		}
		return null;
	},

	'waterabsorb': ctx => {
		if (ctx.move.type === 'Water') {
			const healAmount = Math.floor(ctx.defender.maxHp * 0.25);
			ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + healAmount);
			return {
				immune: true,
				message: `${ctx.defender.species}'s Water Absorb restored its HP!`,
			};
		}
		return null;
	},

	'voltabsorb': ctx => {
		if (ctx.move.type === 'Electric') {
			const healAmount = Math.floor(ctx.defender.maxHp * 0.25);
			ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + healAmount);
			return {
				immune: true,
				message: `${ctx.defender.species}'s Volt Absorb restored its HP!`,
			};
		}
		return null;
	},

	'flashfire': ctx => {
		if (ctx.move.type === 'Fire') {
			ctx.defenderSlot.flashFireBoost = true;
			return {
				immune: true,
				message: `${ctx.defender.species}'s Flash Fire absorbed the Fire move!`,
			};
		}
		return null;
	},

	'sapsipper': ctx => {
		if (ctx.move.type === 'Grass') {
			let message = `${ctx.defender.species}'s Sap Sipper absorbed the Grass move!`;
			if (ctx.defenderSlot.statStages.atk < 6) {
				ctx.defenderSlot.statStages.atk++;
				message = `${ctx.defender.species}'s Sap Sipper boosted its Attack!`;
			}
			return {
				immune: true,
				message,
			};
		}
		return null;
	},

	'stormdrain': ctx => {
		if (ctx.move.type === 'Water') {
			let message = `${ctx.defender.species}'s Storm Drain absorbed the Water move!`;
			if (ctx.defenderSlot.statStages.spa < 6) {
				ctx.defenderSlot.statStages.spa++;
				message = `${ctx.defender.species}'s Storm Drain boosted its Sp. Atk!`;
			}
			return {
				immune: true,
				message,
			};
		}
		return null;
	},

	'lightningrod': ctx => {
		if (ctx.move.type === 'Electric') {
			let message = `${ctx.defender.species}'s Lightning Rod absorbed the Electric move!`;
			if (ctx.defenderSlot.statStages.spa < 6) {
				ctx.defenderSlot.statStages.spa++;
				message = `${ctx.defender.species}'s Lightning Rod boosted its Sp. Atk!`;
			}
			return {
				immune: true,
				message,
			};
		}
		return null;
	},

	'motordrive': ctx => {
		if (ctx.move.type === 'Electric') {
			let message = `${ctx.defender.species}'s Motor Drive absorbed the Electric move!`;
			if (ctx.defenderSlot.statStages.spe < 6) {
				ctx.defenderSlot.statStages.spe++;
				message = `${ctx.defender.species}'s Motor Drive boosted its Speed!`;
			}
			return {
				immune: true,
				message,
			};
		}
		return null;
	},

	'dryskin': ctx => {
		if (ctx.move.type === 'Water') {
			const healAmount = Math.floor(ctx.defender.maxHp * 0.25);
			ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + healAmount);
			return {
				immune: true,
				message: `${ctx.defender.species}'s Dry Skin restored its HP!`,
			};
		}
		return null;
	},

	'wonderguard': ctx => {
		if (ctx.move.category === 'Status') {
			return null;
		}

		const defenderSpecies = Dex.species.get(ctx.defender.species);
		// Get actual types (accounting for terastallization)
		const defenderTypes = ctx.defenderSlot.terastallized ? [ctx.defenderSlot.terastallized] : defenderSpecies.types;
		let effectiveness = 1;

		const typeChart: any = {
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

		const chartEntry = typeChart[ctx.move.type];
		if (chartEntry) {
			for (const defenderType of defenderTypes) {
				if (chartEntry.superEffective.includes(defenderType)) {
					effectiveness *= 2;
				} else if (chartEntry.notVeryEffective.includes(defenderType)) {
					effectiveness *= 0.5;
				} else if (chartEntry.noEffect.includes(defenderType)) {
					effectiveness *= 0;
				}
			}
		}

		if (effectiveness <= 1) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Wonder Guard protected it!`,
			};
		}

		return null;
	},

	'bulletproof': ctx => {
		if (ctx.move.flags.bullet) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Bulletproof blocks the move!`,
			};
		}
		return null;
	},
};

export const POWER_MODIFIER_ABILITIES: Record<string, AbilityPowerModifierHandler> = {
	'ironfist': (ctx, basePower) => {
		if (ctx.move.flags.punch) {
			return Math.floor(basePower * 1.2);
		}
		return basePower;
	},

	'strongjaw': (ctx, basePower) => {
		if (ctx.move.flags.bite) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'megalauncher': (ctx, basePower) => {
		if (ctx.move.flags.pulse) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'technician': (ctx, basePower) => {
		if (ctx.move.basePower <= 60 && ctx.move.basePower > 0) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'sheerforce': (ctx, basePower) => {
		if (ctx.move.secondary || ctx.move.secondaries) {
			return Math.floor(basePower * 1.3);
		}
		return basePower;
	},

	'reckless': (ctx, basePower) => {
		if (ctx.move.recoil || ctx.move.hasCrashDamage) {
			return Math.floor(basePower * 1.2);
		}
		return basePower;
	},

	'toughclaws': (ctx, basePower) => {
		if (ctx.move.flags.contact) {
			return Math.floor(basePower * 1.3);
		}
		return basePower;
	},

	'adaptability': (ctx, basePower) => {
		return basePower;
	},

	'rivalry': (ctx, basePower) => {
		if (ctx.attacker.gender !== 'N' && ctx.defender.gender !== 'N') {
			if (ctx.attacker.gender === ctx.defender.gender) {
				return Math.floor(basePower * 1.25);
			} else {
				return Math.floor(basePower * 0.75);
			}
		}
		return basePower;
	},

	'sandforce': (ctx, basePower) => {
		if (isWeatherActive(ctx.battle) && ctx.battle.weather?.type === 'sand' &&
			['Rock', 'Ground', 'Steel'].includes(ctx.move.type)) {
			return Math.floor(basePower * 1.3);
		}
		return basePower;
	},

	'analytic': (ctx, basePower) => {
		if (ctx.attackerSlot.analyticBoost) {
			return Math.floor(basePower * 1.3);
		}
		return basePower;
	},

	'blaze': (ctx, basePower) => {
		if (ctx.move.type === 'Fire' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'torrent': (ctx, basePower) => {
		if (ctx.move.type === 'Water' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'overgrow': (ctx, basePower) => {
		if (ctx.move.type === 'Grass' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'swarm': (ctx, basePower) => {
		if (ctx.move.type === 'Bug' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	// Phase 2: Steelworker - 1.5x power for Steel-type moves
	'steelworker': (ctx, basePower) => {
		if (ctx.move.type === 'Steel') {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},
};

export const TYPE_MODIFIER_ABILITIES: Record<string, AbilityTypeModifierHandler> = {
	'normalize': (ctx, moveType) => {
		if (ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
			return 'Normal';
		}
		return moveType;
	},

	'pixilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
			return 'Fairy';
		}
		return moveType;
	},

	'refrigerate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
			return 'Ice';
		}
		return moveType;
	},

	'aerilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
			return 'Flying';
		}
		return moveType;
	},

	'galvanize': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
			return 'Electric';
		}
		return moveType;
	},
};

export const ITEM_INTERACTION_ABILITIES = {
	'stickyhold': {
		preventsItemRemoval: true,
	},

	'unburden': {
		onItemRemove: true,
	},

	'klutz': {
		preventsItemUse: true,
	},
};

export const STAT_MODIFIER_ABILITIES: Record<string, AbilityStatModifierHandler> = {
	'hugepower': (pokemon, stat, value) => {
		if (stat === 'atk') {
			return value * 2;
		}
		return value;
	},

	'purepower': (pokemon, stat, value) => {
		if (stat === 'atk') {
			return value * 2;
		}
		return value;
	},

	'guts': (pokemon, stat, value, slot) => {
		const status = slot ? slot.status : pokemon.status;
		if (stat === 'atk' && status) {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'marvelscale': (pokemon, stat, value, slot) => {
		const status = slot ? slot.status : pokemon.status;
		if (stat === 'def' && status) {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'quickfeet': (pokemon, stat, value, slot) => {
		const status = slot ? slot.status : pokemon.status;
		if (stat === 'spe' && status) {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'hustle': (pokemon, stat, value) => {
		if (stat === 'atk') {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'slowstart': (pokemon, stat, value, slot) => {
		if (slot) {
			if (slot.slowStartTurns === undefined || slot.slowStartTurns > 0) {
				if (stat === 'atk' || stat === 'spe') return Math.floor(value * 0.5);
			}
		} else {
			if (stat === 'atk' || stat === 'spe') {
				return Math.floor(value * 0.5);
			}
		}
		return value;
	},

	// Phase 2: Gorilla Tactics - 1.5x Attack (like Choice Band effect)
	'gorillatactics': (pokemon, stat, value) => {
		if (stat === 'atk') {
			return Math.floor(value * 1.5);
		}
		return value;
	},
};

export const WEATHER_ABILITIES = {
	'drought': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'sun') {
				battle.weather = { type: 'sun', turns: 9999 };
				messageLog.push(`${slot.pokemon.species}'s Drought intensified the sun!`);
			}
		},
	},

	'drizzle': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'rain') {
				battle.weather = { type: 'rain', turns: 9999 };
				messageLog.push(`${slot.pokemon.species}'s Drizzle caused a downpour!`);
			}
		},
	},

	'sandstream': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'sand') {
				battle.weather = { type: 'sand', turns: 9999 };
				messageLog.push(`${slot.pokemon.species}'s Sand Stream whipped up a sandstorm!`);
			}
		},
	},

	'snowwarning': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'hail') {
				battle.weather = { type: 'hail', turns: 9999 };
				messageLog.push(`${slot.pokemon.species}'s Snow Warning created a hailstorm!`);
			}
		},
	},

	'cloudnine': {
		suppressWeather: true,
	},
	'airlock': {
		suppressWeather: true,
	},

	'solarpower': {
		modifiesSpAtk: true,
		weatherDamage: 'sun',
	},

	'raindish': {
		weatherHeal: 'rain',
	},

	'icebody': {
		weatherHeal: 'hail',
	},
};

export const CONTACT_ABILITIES = {
	'static': {
		onContactChance: 0.3,
		effect: 'par',
	},

	'flamebody': {
		onContactChance: 0.3,
		effect: 'brn',
	},

	'poisonpoint': {
		onContactChance: 0.3,
		effect: 'psn',
	},

	'effectspore': {
		onContactChance: 0.3,
		effects: ['psn', 'par', 'slp'],
	},

	'cutecharm': {
		onContactChance: 0.3,
		effect: 'infatuate',
	},

	'roughskin': {
		onContactDamage: 1 / 8,
	},

	'ironbarbs': {
		onContactDamage: 1 / 8,
	},

	'gooey': {
		onContactStat: 'spe',
		value: -1,
	},
	
	'tanglinghair': {
		onContactStat: 'spe',
		value: -1,
	},

	// Phase 2: Poison Touch - 30% chance to poison on contact
	'poisontouch': {
		onContactChance: 0.3,
		effect: 'psn',
	},
};

export const PRIORITY_ABILITIES = {
	'prankster': {
		modifyPriority: (move: Move) => {
			if (move.category === 'Status') {
				return 1;
			}
			return 0;
		},
	},

	'galewings': {
		modifyPriority: (move: Move, pokemon: RPGPokemon) => {
			if (move.type === 'Flying' && pokemon.hp === pokemon.maxHp) {
				return 1;
			}
			return 0;
		},
	},
};

export const ACCURACY_EVASION_ABILITIES = {
	'compoundeyes': {
		accuracyMultiplier: 1.3,
	},

	'hustle': {
		accuracyMultiplier: 0.8,
	},

	'tangledfeet': {
		evasionBoost: true,
	},

	'sandveil': {
		weatherEvasion: 'sand',
	},

	'snowcloak': {
		weatherEvasion: 'hail',
	},
};

export const RECOIL_DRAIN_ABILITIES = {
	'rockhead': {
		preventsRecoil: true,
	},

	'magicguard': {
		preventsIndirectDamage: true,
	},
};

export const FORM_CHANGE_ABILITIES = {
	'stancechange': {
		formChange: true,
	},

	'schooling': {
		hpFormChange: true,
	},

	'shieldsdown': {
		hpFormChange: true,
	},
};

export const MULTI_HIT_ABILITIES = {
	'skilllink': {
		maxHits: true,
	},

	'parentalbond': {
		attackTwice: true,
	},
};

export const CRITICAL_HIT_ABILITIES = {
	'superluck': {
		critBoost: 1,
	},

	'sniper': {
		critDamageMultiplier: 1.5,
	},
};

export const TERRAIN_ABILITIES = {
	'electricsurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.terrain?.type !== 'electric') {
				battle.terrain = { type: 'electric', turns: 5 };
				messageLog.push(`${slot.pokemon.species}'s Electric Surge electrified the field!`);
			}
		},
	},

	'grassysurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.terrain?.type !== 'grassy') {
				battle.terrain = { type: 'grassy', turns: 5 };
				messageLog.push(`${slot.pokemon.species}'s Grassy Surge created grassy terrain!`);
			}
		},
	},

	'mistysurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.terrain?.type !== 'misty') {
				battle.terrain = { type: 'misty', turns: 5 };
				messageLog.push(`${slot.pokemon.species}'s Misty Surge created misty terrain!`);
			}
		},
	},

	'psychicsurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.terrain?.type !== 'psychic') {
				battle.terrain = { type: 'psychic', turns: 5 };
				messageLog.push(`${slot.pokemon.species}'s Psychic Surge created psychic terrain!`);
			}
		},
	},

	'surgesurfer': {
		terrainSpeedBoost: 'electric',
	},
};

export const HEALING_ABILITIES = {
	'regenerator': {
		onSwitchOut: 1 / 3,
	},

	'naturalcure': {
		healStatusOnSwitch: true,
	},
};

// On-KO Abilities - abilities that trigger when a Pokemon is KO'd
export const ON_KO_ABILITIES: Record<string, { handler: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void }> = {
	'moxie': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.atk < 6) {
				slot.statStages.atk++;
				messageLog.push(`${slot.pokemon.species}'s Moxie raised its Attack!`);
			}
		},
	},
	'chillingneigh': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.atk < 6) {
				slot.statStages.atk++;
				messageLog.push(`${slot.pokemon.species}'s Chilling Neigh raised its Attack!`);
			}
		},
	},
	'beastboost': {
		handler: (slot, battle, messageLog) => {
			const stats = slot.pokemon;
			let highestStat: 'atk' | 'def' | 'spa' | 'spd' | 'spe' = 'atk';
			let maxStatVal = stats.atk;
			if (stats.def > maxStatVal) { maxStatVal = stats.def; highestStat = 'def'; }
			if (stats.spa > maxStatVal) { maxStatVal = stats.spa; highestStat = 'spa'; }
			if (stats.spd > maxStatVal) { maxStatVal = stats.spd; highestStat = 'spd'; }
			if (stats.spe > maxStatVal) { maxStatVal = stats.spe; highestStat = 'spe'; }

			if (slot.statStages[highestStat] < 6) {
				slot.statStages[highestStat]++;
				const statNames: Record<string, string> = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
				messageLog.push(`${slot.pokemon.species}'s Beast Boost raised its ${statNames[highestStat]}!`);
			}
		},
	},
};

// End of Turn Abilities - abilities that trigger at the end of each turn
export const END_OF_TURN_ABILITIES: Record<string, { handler: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void }> = {
	'speedboost': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.spe < 6) {
				slot.statStages.spe++;
				messageLog.push(`${slot.pokemon.species}'s Speed Boost raised its Speed!`);
			}
		},
	},

	// Phase 2: Shed Skin - 30% chance to cure status at end of turn
	'shedskin': {
		handler: (slot, battle, messageLog) => {
			if (slot.status && Math.random() < 0.3) {
				const statusName = {
					psn: 'poison',
					tox: 'toxic poison',
					brn: 'burn',
					par: 'paralysis',
					slp: 'sleep',
					frz: 'freeze',
				}[slot.status] || 'status condition';
				slot.status = null;
				messageLog.push(`${slot.pokemon.species} shed its skin and cured its ${statusName}!`);
			}
		},
	},
};

// Stat Drop Response Abilities - abilities that trigger when stats are lowered
export const STAT_DROP_RESPONSE_ABILITIES: Record<string, { handler: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[], sourceSlot?: ActivePokemonSlot) => void }> = {
	'defiant': {
		handler: (slot, battle, messageLog, sourceSlot) => {
			// Don't trigger if self-inflicted
			if (sourceSlot && sourceSlot.pokemon.id === slot.pokemon.id) {
				return;
			}
			if (slot.statStages.atk < 6) {
				slot.statStages.atk = Math.min(6, slot.statStages.atk + 2);
				messageLog.push(`${slot.pokemon.species}'s Defiant sharply raised its Attack!`);
			}
		},
	},
	'competitive': {
		handler: (slot, battle, messageLog, sourceSlot) => {
			// Don't trigger if self-inflicted
			if (sourceSlot && sourceSlot.pokemon.id === slot.pokemon.id) {
				return;
			}
			if (slot.statStages.spa < 6) {
				slot.statStages.spa = Math.min(6, slot.statStages.spa + 2);
				messageLog.push(`${slot.pokemon.species}'s Competitive sharply raised its Sp. Atk!`);
			}
		},
	},
};

// Status Interaction Abilities - abilities that interact with status conditions
export const STATUS_INTERACTION_ABILITIES: Record<string, {
	healFromPoison?: (slot: ActivePokemonSlot, messageLog: string[]) => void,
	cureStatusInRain?: (slot: ActivePokemonSlot, messageLog: string[]) => void,
}> = {
	'poisonheal': {
		healFromPoison: (slot, messageLog) => {
			const pokemon = slot.pokemon;
			if (pokemon.hp < pokemon.maxHp) {
				const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
				pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
				messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> was healed by its Poison Heal!</span>`);
			}
		},
	},
	'hydration': {
		cureStatusInRain: (slot, messageLog) => {
			if (slot.status) {
				slot.status = null;
				messageLog.push(`${slot.pokemon.species}'s Hydration cured its status condition!`);
			}
		},
	},
};

export function isWeatherActive(battle: BattleState): boolean {
	if (!battle.weather) return false;

	const allSlots = getActiveSlots(battle.playerSlots).concat(getActiveSlots(battle.opponentSlots));
	for (const slot of allSlots) {
		const ability = toID(slot.pokemon.ability || '');
		if (ability === 'cloudnine' || ability === 'airlock') {
			return false;
		}
	}
	return true;
}

export function isGrounded(slotOrPokemon: ActivePokemonSlot | RPGPokemon, battle: BattleState): boolean {
	const pokemon = (slotOrPokemon as any).pokemon ? (slotOrPokemon as ActivePokemonSlot).pokemon : slotOrPokemon as RPGPokemon;
	const slot = (slotOrPokemon as any).pokemon ? (slotOrPokemon as ActivePokemonSlot) : undefined;

	if (battle.gravityTurns > 0) {
		return true;
	}

	if (slot?.isSmackedDown) {
		return true;
	}

	if (slot && slot.magnetRiseTurns > 0) {
		return false;
	}

	const species = Dex.species.get(pokemon.species);
	const hasAirBalloon = battle.magicRoomTurns === 0 && pokemon.item === 'airballoon';
	const ability = toID(pokemon.ability || '');

	if (hasAirBalloon) {
		return false;
	}

	if (ability === 'levitate') {
		return false;
	}

	if (species.types.includes('Flying')) {
		return false;
	}

	return true;
}

export function getAbilityData(abilityName: string) {
	const ability = Dex.abilities.get(abilityName);
	if (ability.exists) {
		return ability;
	}
	return null;
}

export function applyAbilityStatModifier(pokemon: RPGPokemon, stat: string, value: number, slot?: ActivePokemonSlot, battle?: BattleState): number {
	const ability = toID(pokemon.ability || '');
	const handler = STAT_MODIFIER_ABILITIES[ability];
	if (handler) {
		return handler(pokemon, stat, value, slot, battle);
	}
	return value;
}

export function applySereneGrace(ctx: AbilityContext, chance: number): number {
	const ability = toID(ctx.attacker.ability || '');
	if (ability === 'serenegrace') {
		return Math.min(100, chance * 2);
	}
	return chance;
}

export function checkAbilityImmunity(ctx: AbilityContext): { immune: boolean, message?: string } | null {
	const ability = toID(ctx.defender.ability || '');

	// Check for Mold Breaker
	if (isAbilityIgnored(ctx.attacker, ctx.defender, ability)) {
		return null;
	}

	const handler = IMMUNITY_ABILITIES[ability];
	if (handler) {
		return handler(ctx);
	}
	return null;
}

export function applyAbilityPowerModifier(ctx: AbilityContext, basePower: number): number {
	const ability = toID(ctx.attacker.ability || '');
	const handler = POWER_MODIFIER_ABILITIES[ability];
	if (handler) {
		basePower = handler(ctx, basePower);
	}

	if (ctx.move.type === 'Fire' && ctx.attackerSlot.flashFireBoost) {
		basePower = Math.floor(basePower * 1.5);
	}

	if ((ctx.move as any).typeConversionBoost) {
		basePower = Math.floor(basePower * 1.2);
	}

	return basePower;
}

export function applyAbilityTypeModifier(ctx: AbilityContext, moveType: string): string {
	const ability = toID(ctx.attacker.ability || '');
	const handler = TYPE_MODIFIER_ABILITIES[ability];
	if (handler) {
		return handler(ctx, moveType);
	}
	return moveType;
}

export function checkItemRemovalPrevention(pokemon: RPGPokemon): boolean {
	const ability = toID(pokemon.ability || '');
	return ITEM_INTERACTION_ABILITIES[ability]?.preventsItemRemoval || false;
}

export function getSTABMultiplier(pokemon: RPGPokemon, moveType: string, slot?: ActivePokemonSlot): number {
	const species = Dex.species.get(pokemon.species);
	let hasSTAB = false;

	// Check if terastallized
	if (slot?.terastallized) {
		// When terastallized, STAB is only from the tera type
		// But if the move type matches BOTH the tera type AND one of the original types, it gets 2.0x STAB
		hasSTAB = slot.terastallized === moveType;
		if (hasSTAB && species.types.includes(moveType)) {
			// With Adaptability: 2.25x when Tera Type matches move type and original type
			const ability = toID(pokemon.ability || '');
			if (ability === 'adaptability') {
				return 2.25;
			}
			// Standard: 2.0x when Tera Type matches move type and original type
			return 2.0;
		}
	} else {
		// Normal STAB check (not terastallized)
		hasSTAB = species.types.includes(moveType);
	}

	if (!hasSTAB) {
		return 1;
	}

	const ability = toID(pokemon.ability || '');
	if (ability === 'adaptability') {
		return 2.0;
	}

	return 1.5;
}

export function preventsFlinch(pokemon: RPGPokemon): boolean {
	const ability = toID(pokemon.ability || '');
	// Phase 2: Inner Focus prevents flinching
	return ability === 'innerfocus';
}

export function preventsStatus(pokemon: RPGPokemon, status: string): boolean {
	const ability = toID(pokemon.ability || '');

	if (ability === 'purifyingsalt') {
		return true;
	}

	if (ability === 'immunity' && (status === 'psn' || status === 'tox')) {
		return true;
	}

	if (ability === 'waterveil' && status === 'brn') {
		return true;
	}

	if (ability === 'limber' && status === 'par') {
		return true;
	}

	if ((ability === 'insomnia' || ability === 'vitalspirit') && status === 'slp') {
		return true;
	}

	if (ability === 'magmaarmor' && status === 'frz') {
		return true;
	}

	return false;
}

export function applyPriorityModifier(move: Move, pokemon: RPGPokemon): number {
	const ability = toID(pokemon.ability || '');

	if (ability === 'prankster' && move.category === 'Status') {
		return 1;
	}

	if (ability === 'galewings' && move.type === 'Flying' && pokemon.hp === pokemon.maxHp) {
		return 1;
	}

	if (ability === 'triage' && move.flags.heal) {
		return 3;
	}

	return 0;
}


export function applyAccuracyModifier(moveAccuracy: number, attacker: RPGPokemon, move: Move): number {
	const ability = toID(attacker.ability || '');
	const handler = ACCURACY_EVASION_ABILITIES[ability];

	if (handler?.accuracyMultiplier) {
		// Special case for Hustle
		if (ability === 'hustle' && move.category !== 'Physical') {
			return moveAccuracy; // Do not apply penalty to Special or Status moves
		}
		return Math.floor(moveAccuracy * handler.accuracyMultiplier);
	}

	return moveAccuracy;
}

export function getEvasionMultiplier(defenderSlot: ActivePokemonSlot, battle: BattleState): number {
	const ability = toID(defenderSlot.pokemon.ability || '');
	const handler = ACCURACY_EVASION_ABILITIES[ability];

	if (handler) {
		if (handler.weatherEvasion === 'sand' && isWeatherActive(battle) && battle.weather?.type === 'sand') {
			return 1.25;
		}
		if (handler.weatherEvasion === 'hail' && isWeatherActive(battle) && battle.weather?.type === 'hail') {
			return 1.25;
		}
		if (handler.evasionBoost && defenderSlot.isConfused) {
			return 1.5;
		}
	}

	return 1;
}

export function applySpeedModifier(pokemon: RPGPokemon, battle: BattleState, speed: number): number {
	const ability = toID(pokemon.ability || '');

	const slot = battle.playerSlots.find(s => s?.pokemon.id === pokemon.id) ||
		battle.opponentSlots.find(s => s?.pokemon.id === pokemon.id);
	const status = slot ? slot.status : pokemon.status;

	if (ability === 'quickfeet' && status) {
		speed = Math.floor(speed * 1.5);
	}

	const weatherActive = isWeatherActive(battle);

	if (ability === 'swiftswim' && weatherActive && battle.weather?.type === 'rain') {
		return speed * 2;
	}

	if (ability === 'chlorophyll' && weatherActive && battle.weather?.type === 'sun') {
		return speed * 2;
	}

	if (ability === 'sandrush' && weatherActive && battle.weather?.type === 'sand') {
		return speed * 2;
	}

	if (ability === 'slushrush' && weatherActive && battle.weather?.type === 'hail') {
		return speed * 2;
	}

	if (ability === 'surgesurfer' && battle.terrain?.type === 'electric' && isGrounded(pokemon, battle)) {
		return speed * 2;
	}

	if (ability === 'unburden') {
		if (slot?.unburdenActive) {
			return speed * 2;
		}
	}

	if (battle.magicRoomTurns === 0 && pokemon.item === 'choicescarf') {
		speed = Math.floor(speed * 1.5);
	}

	return speed;
}

export function applyDamageModifier(ctx: AbilityContext, damage: number): number {
	const attackerAbility = toID(ctx.attacker.ability || '');
	const defenderAbility = toID(ctx.defender.ability || '');
	const effectiveness = ctx.effectiveness || 1;

	if (defenderAbility === 'dryskin' && ctx.move.type === 'Fire') {
		if (!isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
			damage = Math.floor(damage * 1.25);
		}
	}

	if (attackerAbility === 'tintedlens' && effectiveness < 1) {
		damage = Math.floor(damage * 2);
	}

	if ((defenderAbility === 'solidrock' || defenderAbility === 'filter') && effectiveness > 1) {
		if (!isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
			damage = Math.floor(damage * 0.75);
		}
	}

	if ((defenderAbility === 'multiscale' || defenderAbility === 'shadowshield') &&
		ctx.defender.hp === ctx.defender.maxHp) {
		if (!isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
			damage = Math.floor(damage * 0.5);
		}
	}

	if (defenderAbility === 'purifyingsalt' && ctx.move.type === 'Ghost') {
		if (!isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
			damage = Math.floor(damage * 0.5);
		}
	}

	if (defenderAbility === 'furcoat' && ctx.move.category === 'Physical') {
		if (!isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
			damage = Math.floor(damage * 0.5);
		}
	}

	// Phase 2: Thick Fat - halves Fire and Ice damage
	if (defenderAbility === 'thickfat' && (ctx.move.type === 'Fire' || ctx.move.type === 'Ice')) {
		if (!isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
			damage = Math.floor(damage * 0.5);
		}
	}

	if (attackerAbility === 'punkrock' && ctx.move.flags.sound) {
		damage = Math.floor(damage * 1.3);
	}
	if (defenderAbility === 'punkrock' && ctx.move.flags.sound) {
		if (!isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
			damage = Math.floor(damage * 0.5);
		}
	}

	return damage;
}

export function shouldApplySecondaryEffects(attacker: RPGPokemon, move: Move): boolean {
	const ability = toID(attacker.ability || '');
	if (ability === 'sheerforce' && (move.secondary || move.secondaries)) {
		return false;
	}
	return true;
}

export function takesIndirectDamage(pokemon: RPGPokemon): boolean {
	const ability = toID(pokemon.ability || '');
	return ability !== 'magicguard';
}

export function preventsRecoil(pokemon: RPGPokemon): boolean {
	const ability = toID(pokemon.ability || '');
	return ability === 'rockhead';
}

export function canUseHeldItem(pokemon: RPGPokemon, battle: BattleState): boolean {
	if (battle.magicRoomTurns > 0) return false;

	const ability = toID(pokemon.ability || '');
	if (ability === 'klutz') return false;

	return true;
}

export function checkFormChangeAbilities(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	const pokemon = slot.pokemon;
	const ability = toID(pokemon.ability || '');

	if (ability === 'stancechange') {
		if (pokemon.species === 'Aegislash-Blade' && slot.lastMoveUsed === 'kingsshield') {
			pokemon.species = 'Aegislash';
			messageLog.push(`${pokemon.nickname || pokemon.species} changed to Shield Forme!`);
		} else if (pokemon.species === 'Aegislash' && slot.lastMoveUsed) {
			const move = Dex.moves.get(slot.lastMoveUsed);
			if (move.category !== 'Status') {
				pokemon.species = 'Aegislash-Blade';
				messageLog.push(`${pokemon.nickname || pokemon.species} changed to Blade Forme!`);
			}
		}
	}

	if (ability === 'schooling') {
		if (pokemon.species === 'Wishiwashi' && pokemon.level >= 20 && pokemon.hp > pokemon.maxHp * 0.25) {
			pokemon.species = 'Wishiwashi-School';
			messageLog.push(`${pokemon.nickname || pokemon.species} formed a school!`);
		} else if (pokemon.species === 'Wishiwashi-School' && pokemon.hp <= pokemon.maxHp * 0.25) {
			pokemon.species = 'Wishiwashi';
			messageLog.push(`${pokemon.nickname || pokemon.species} stopped schooling!`);
		}
	}

	if (ability === 'shieldsdown') {
		if (pokemon.species.startsWith('Minior-Meteor') && pokemon.hp <= pokemon.maxHp * 0.5) {
			const color = pokemon.species.split('-')[2] || 'Red';
			pokemon.species = `Minior-${color}`;
			messageLog.push(`${pokemon.nickname || pokemon.species}'s shell broke off!`);
		}
	}
}

export function getMultiHitCount(attacker: RPGPokemon, move: Move): number {
	const ability = toID(attacker.ability || '');

	if (move.multihit) {
		// Skill Link always grants the maximum number of hits
		if (ability === 'skilllink') {
			if (Array.isArray(move.multihit)) {
				return move.multihit[1];
			}
			return 5; // Fallback for moves that just say "multihit: 5"
		}

		// This handles moves that hit 2-5 times with the standard Gen 5+ distribution
		if (Array.isArray(move.multihit) && move.multihit[0] === 2 && move.multihit[1] === 5) {
			const rand = Math.random() * 100;
			if (rand < 35) return 2; // 35% chance
			if (rand < 70) return 3; // 35% chance
			if (rand < 85) return 4; // 15% chance
			return 5;                // 15% chance
		}

		// This handles other multi-hit moves, like Triple Kick or simple ranges
		if (Array.isArray(move.multihit)) {
			const min = move.multihit[0];
			const max = move.multihit[1];
			return min + Math.floor(Math.random() * (max - min + 1));
		}

		// Fallback for moves where multihit is just a number (e.g., Double Slap)
		return move.multihit;
	}

	return 1;
}

export function hasParentalBond(attacker: RPGPokemon): boolean {
	const ability = toID(attacker.ability || '');
	return ability === 'parentalbond';
}

export function applyParentalBondModifier(damage: number, isSecondHit: boolean): number {
	if (isSecondHit) {
		return Math.floor(damage * 0.25);
	}
	return damage;
}

export function preventMove(ctx: AbilityContext): { prevented: boolean, message?: string } | null {
	const defenderAbility = toID(ctx.defender.ability || '');

	// Check for Mold Breaker
	if (isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
		return null;
	}

	if ((defenderAbility === 'dazzling' || defenderAbility === 'queenlymajesty') &&
		ctx.move.priority && ctx.move.priority > 0) {
		return {
			prevented: true,
			message: `${ctx.defender.species}'s ${ctx.defender.ability} prevents ${ctx.move.name}!`,
		};
	}

	if (defenderAbility === 'goodasgold' && ctx.move.category === 'Status') {
		return {
			prevented: true,
			message: `${ctx.defender.species}'s Good as Gold prevents ${ctx.move.name}!`,
		};
	}

	return null;
}

// Stat Change Modifier Abilities - abilities that modify stat changes (Contrary, Simple)
export function applyStatChangeModifier(value: number, ability: string): number {
	if (ability === 'contrary') {
		return -value;
	}
	if (ability === 'simple') {
		return value * 2;
	}
	return value;
}

// Helper functions for the newly organized abilities
export function applyOnKOAbilities(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	const handler = ON_KO_ABILITIES[ability];
	if (handler) {
		handler.handler(slot, battle, messageLog);
	}
}

export function applyEndOfTurnAbilities(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	const handler = END_OF_TURN_ABILITIES[ability];
	if (handler) {
		handler.handler(slot, battle, messageLog);
	}
}

export function applyStatDropResponse(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[], sourceSlot?: ActivePokemonSlot): void {
	const ability = toID(slot.pokemon.ability || '');
	const handler = STAT_DROP_RESPONSE_ABILITIES[ability];
	if (handler) {
		handler.handler(slot, battle, messageLog, sourceSlot);
	}
}

export function handlePoisonHeal(slot: ActivePokemonSlot, messageLog: string[]): boolean {
	const ability = toID(slot.pokemon.ability || '');
	if (ability === 'poisonheal' && STATUS_INTERACTION_ABILITIES['poisonheal'].healFromPoison) {
		STATUS_INTERACTION_ABILITIES['poisonheal'].healFromPoison(slot, messageLog);
		return true;
	}
	return false;
}

export function handleHydration(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	const ability = toID(slot.pokemon.ability || '');
	if (ability === 'hydration' && battle.weather?.type === 'rain' && STATUS_INTERACTION_ABILITIES['hydration'].cureStatusInRain) {
		STATUS_INTERACTION_ABILITIES['hydration'].cureStatusInRain(slot, messageLog);
		return true;
	}
	return false;
}

export function getAllImplementedAbilities(): string[] {
	return [
		...Object.keys(IMMUNITY_ABILITIES),
		...Object.keys(POWER_MODIFIER_ABILITIES),
		...Object.keys(TYPE_MODIFIER_ABILITIES),
		...Object.keys(STAT_MODIFIER_ABILITIES),
		...Object.keys(ITEM_INTERACTION_ABILITIES),
		...Object.keys(WEATHER_ABILITIES),
		...Object.keys(CONTACT_ABILITIES),
		...Object.keys(PRIORITY_ABILITIES),
		...Object.keys(ACCURACY_EVASION_ABILITIES),
		...Object.keys(RECOIL_DRAIN_ABILITIES),
		...Object.keys(FORM_CHANGE_ABILITIES),
		...Object.keys(MULTI_HIT_ABILITIES),
		...Object.keys(CRITICAL_HIT_ABILITIES),
		...Object.keys(TERRAIN_ABILITIES),
		...Object.keys(HEALING_ABILITIES),
		...Object.keys(ON_KO_ABILITIES),
		...Object.keys(END_OF_TURN_ABILITIES),
		...Object.keys(STAT_DROP_RESPONSE_ABILITIES),
		...Object.keys(STATUS_INTERACTION_ABILITIES),
		'contrary', 'simple', // Stat change modifiers handled by applyStatChangeModifier
	];
}

export function getAbilityInfo(abilityName: string): any {
	const ability = Dex.abilities.get(abilityName);
	if (ability.exists) {
		return {
			name: ability.name,
			desc: ability.desc || ability.shortDesc,
			rating: ability.rating,
		};
	}
	return null;
}

export function applySwitchInAbilities(slot: ActivePokemonSlot, battle: BattleState, isPlayerSwitchIn: boolean, messageLog: string[]): void {
	const pokemon = slot.pokemon;
	const ability = toID(pokemon.ability || '');

	// Apply weather abilities
	const weatherAbility = WEATHER_ABILITIES[ability];
	if (weatherAbility?.onSwitchIn) {
		weatherAbility.onSwitchIn(slot, battle, messageLog);
	}

	// Apply terrain abilities
	const terrainAbility = TERRAIN_ABILITIES[ability];
	if (terrainAbility?.onSwitchIn) {
		terrainAbility.onSwitchIn(slot, battle, messageLog);
	}

	if (ability === 'intimidate') {
		const opponentSlots = isPlayerSwitchIn ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);
		for (const opponentSlot of opponentSlots) {
			if (opponentSlot && opponentSlot.pokemon.hp > 0) {
				const oppAbility = toID(opponentSlot.pokemon.ability || '');
				const blockAbilities = ['clearbody', 'whitesmoke', 'hypercutter', 'fullmetalbody'];

				if (opponentSlot.substitute) {
					messageLog.push(`${pokemon.species}'s Intimidate was blocked by ${opponentSlot.pokemon.species}'s Substitute!`);
				} else if (blockAbilities.includes(oppAbility)) {
					messageLog.push(`${opponentSlot.pokemon.species}'s ${opponentSlot.pokemon.ability} prevents its stats from being lowered!`);
				} else if (opponentSlot.statStages.atk > -6) {
					opponentSlot.statStages.atk--;
					messageLog.push(`${pokemon.species}'s Intimidate lowered ${opponentSlot.pokemon.species}'s Attack!`);
				}
			}
		}
	}

	if (ability === 'slowstart') {
		slot.slowStartTurns = 5;
		messageLog.push(`${pokemon.species} is off to a slow start!`);
	}
}

export function applyContactAbilityEffects(ctx: AbilityContext): void {
	const defenderAbility = toID(ctx.defender.ability || '');

	// Check for Mold Breaker
	if (isAbilityIgnored(ctx.attacker, ctx.defender, defenderAbility)) {
		return;
	}

	const handler = CONTACT_ABILITIES[defenderAbility];

	if (!handler) return;

	const attacker = ctx.attacker;
	const attackerSlot = ctx.attackerSlot;
	const attackerSpecies = Dex.species.get(attacker.species);

	if (handler.onContactDamage) {
		if (takesIndirectDamage(attacker)) {
			const damage = Math.floor(attacker.maxHp * handler.onContactDamage);
			attacker.hp = Math.max(0, attacker.hp - damage);
			ctx.messageLog.push(`${attacker.species} was hurt by ${ctx.defender.species}'s ${ctx.defender.ability}!`);
		}
	}

	// New logic for stat-lowering contact abilities
	if (handler.onContactStat && attacker.hp > 0) {
		const stat = handler.onContactStat as keyof ActivePokemonSlot['statStages'];
		const value = handler.value as number;
		// Use applyStatChange on the attacker, sourced from the defender
		// This will be correctly blocked by abilities like Clear Body
		if (applyStatChange(attackerSlot, stat, value, ctx.battle, ctx.messageLog, ctx.defenderSlot)) {
			// applyStatChange already adds the "fell!" message, we just add the cause.
			ctx.messageLog[ctx.messageLog.length - 1] += ` (from ${ctx.defender.species}'s ${ctx.defender.ability})!`;
		}
	}

	if (handler.effect && !attackerSlot.status && attacker.hp > 0 && Math.random() < handler.onContactChance) {
		const statusToInflict = handler.effect as string;
		let canBeAfflicted = true;

		// Get actual types (accounting for terastallization)
		const attackerTypes = ctx.attackerSlot.terastallized ? [ctx.attackerSlot.terastallized] : attackerSpecies.types;

		if ((statusToInflict === 'par' && attackerTypes.includes('Electric')) ||
			(statusToInflict === 'brn' && attackerTypes.includes('Fire')) ||
			(statusToInflict === 'psn' && (attackerTypes.includes('Poison') || attackerTypes.includes('Steel')))) {
			canBeAfflicted = false;
		}

		if (canBeAfflicted && preventsStatus(attacker, statusToInflict, ctx.battle)) { // Added ctx.battle
			canBeAfflicted = false;
			ctx.messageLog.push(`${attacker.species}'s ${attacker.ability} prevents ${statusToInflict}!`);
		}

		if (statusToInflict === 'infatuate') {
			canBeAfflicted = false;
		}

		if (canBeAfflicted) {
			attackerSlot.status = statusToInflict;
			if (statusToInflict === 'slp') {
				(attackerSlot as any).sleepCounter = Math.floor(Math.random() * 3) + 2;
			}
			ctx.messageLog.push(`${attacker.species} was afflicted with ${statusToInflict} by ${ctx.defender.species}'s ${ctx.defender.ability}!`);
		}
	}

	if (handler.effects && !attackerSlot.status && attacker.hp > 0 && Math.random() < handler.onContactChance) {
		const possibleStatuses: string[] = [];
		// Get actual types (accounting for terastallization)
		const attackerTypes = ctx.attackerSlot.terastallized ? [ctx.attackerSlot.terastallized] : attackerSpecies.types;

		if (!attackerTypes.includes('Poison') && !attackerTypes.includes('Steel') && !preventsStatus(attacker, 'psn', ctx.battle)) { // Added ctx.battle
			possibleStatuses.push('psn');
		}
		if (!attackerTypes.includes('Electric') && !preventsStatus(attacker, 'par', ctx.battle)) { // Added ctx.battle
			possibleStatuses.push('par');
		}
		if (!preventsStatus(attacker, 'slp', ctx.battle)) { // Added ctx.battle
			possibleStatuses.push('slp');
		}

		if (possibleStatuses.length > 0) {
			const statusToInflict = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
			attackerSlot.status = statusToInflict;
			if (statusToInflict === 'slp') {
				(attackerSlot as any).sleepCounter = Math.floor(Math.random() * 3) + 2;
			}
			ctx.messageLog.push(`${attacker.species} was afflicted with ${statusToInflict} by ${ctx.defender.species}'s Effect Spore!`);
		}
	}
}

export const RPGAbilities = {
	checkImmunity: checkAbilityImmunity,
	applyPowerModifier: applyAbilityPowerModifier,
	applyTypeModifier: applyAbilityTypeModifier,
	applyAbilityStatModifier,
	applySpeedModifier,
	applyDamageModifier,
	checkItemRemovalPrevention,
	getSTABMultiplier,
	preventsStatus,
	preventMove,
	applySereneGrace,
	isGrounded,
	applyContactAbilityEffects,
	applySwitchInAbilities,
	applyPriorityModifier,
	applyAccuracyModifier,
	getEvasionMultiplier,
	isWeatherActive,
	checkFormChangeAbilities,
	getMultiHitCount,
	hasParentalBond,
	applyParentalBondModifier,
	preventsFlinch,

	getAllImplementedAbilities,
	getAbilityInfo,
	getAbilityData,
	shouldApplySecondaryEffects,
	takesIndirectDamage,
	preventsRecoil,
	canUseHeldItem,

	applyOnKOAbilities,
	applyEndOfTurnAbilities,
	applyStatDropResponse,
	applyStatChangeModifier,
	handlePoisonHeal,
	handleHydration,
	
	isAbilityIgnored,

	IMMUNITY_ABILITIES,
	POWER_MODIFIER_ABILITIES,
	TYPE_MODIFIER_ABILITIES,
	STAT_MODIFIER_ABILITIES,
	ITEM_INTERACTION_ABILITIES,
	WEATHER_ABILITIES,
	CONTACT_ABILITIES,
	PRIORITY_ABILITIES,
	ACCURACY_EVASION_ABILITIES,
	RECOIL_DRAIN_ABILITIES,
	FORM_CHANGE_ABILITIES,
	MULTI_HIT_ABILITIES,
	CRITICAL_HIT_ABILITIES,
	TERRAIN_ABILITIES,
	HEALING_ABILITIES,
	ON_KO_ABILITIES,
	END_OF_TURN_ABILITIES,
	STAT_DROP_RESPONSE_ABILITIES,
	STATUS_INTERACTION_ABILITIES,
};

export default RPGAbilities;
