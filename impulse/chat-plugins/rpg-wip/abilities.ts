import { Dex, toID } from '../../../sim/dex';
import { getActiveSlots, applyStatChange, activateUnburden, setItem } from './utils';
import type { RPGPokemon, ActivePokemonSlot, BattleState, Move, AbilityContext, AbilityImmunityHandler, AbilityPowerModifierHandler, AbilityDamageModifierHandler, AbilityStatModifierHandler, AbilityTypeModifierHandler, AbilityOnSwitchInHandler, AbilityOnDamageHandler, AbilityOnMoveHandler, AbilityOnKOHandler, AbilityEndOfTurnHandler, AbilityStatDropResponseHandler, AbilityStatChangeModifierHandler } from './interface';

/**
 * Safely gets the defender's ability, returning 'noability' if the attacker
 * has an ability that ignores it (Mold Breaker, Teravolt, Turboblaze).
 */
export function getActiveAbility(defender: RPGPokemon, attacker?: RPGPokemon): string {
	const defenderAbility = toID(defender.ability || '');

	if (!attacker) return defenderAbility;

	const attackerAbility = toID(attacker.ability || '');
	const breakerAbilities = ['moldbreaker', 'turboblaze', 'teravolt'];

	// Specific override for Moongeist Beam / Sunsteel Strike / Photon Geyser would go here

	if (breakerAbilities.includes(attackerAbility)) {
		// List of abilities that cannot be ignored by Mold Breaker
		const ignoredAbilities = [
			'asomeone', 'battlebond', 'comatose', 'disguise', 'multitype',
			'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown',
			'stancechange', 'zenmode', 'magicbounce', 'magiccoat',
			'deltastream', 'desolateland', 'primordialsea',
			'fullmetalbody', 'shadowshield', 'prismarmor'
		];

		if (!ignoredAbilities.includes(defenderAbility)) {
			return 'noability';
		}
	}

	return defenderAbility;
}

export function isPersistent(pokemon: RPGPokemon): boolean {
	const ability = toID(pokemon.ability || '');
	return ability === 'persistent';
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

	'mountaineer': ctx => {
		if (ctx.move.type === 'Rock') {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Mountaineer makes it immune to Rock moves!`,
			};
		}
		return null;
	},

	'levitate': ctx => {
		if (ctx.move.type === 'Ground' && ctx.battle.gravityTurns === 0) {
			if (ctx.defender.item === 'ironball') return null;
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

	'eartheater': ctx => {
		if (ctx.move.type === 'Ground') {
			const healAmount = Math.floor(ctx.defender.maxHp * 0.25);
			ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + healAmount);
			return {
				immune: true,
				message: `${ctx.defender.species}'s Earth Eater restored its HP!`,
			};
		}
		return null;
	},

	'wellbakedbody': ctx => {
		if (ctx.move.type === 'Fire') {
			let message = `${ctx.defender.species}'s Well-Baked Body blocked the Fire move!`;
			if (ctx.defenderSlot.statStages.def < 6) {
				ctx.defenderSlot.statStages.def += 2;
				message = `${ctx.defender.species}'s Well-Baked Body sharply raised its Defense!`;
			}
			return {
				immune: true,
				message,
			};
		}
		return null;
	},

	'windpower': ctx => {
		const windMoves = ['twister', 'gust', 'whirlwind', 'hurricane', 'tailwind', 'icy wind', 'heat wave', 'sandstorm', 'blizzard'];
		if (windMoves.includes(ctx.move.id)) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Wind Power charged it up!`,
			};
		}
		return null;
	},

	'windrider': ctx => {
		const windMoves = ['twister', 'gust', 'whirlwind', 'hurricane', 'tailwind', 'icy wind', 'heat wave', 'sandstorm', 'blizzard'];
		if (windMoves.includes(ctx.move.id)) {
			let message = `${ctx.defender.species}'s Wind Rider blocked the wind move!`;
			if (ctx.defenderSlot.statStages.atk < 6) {
				ctx.defenderSlot.statStages.atk++;
				message = `${ctx.defender.species}'s Wind Rider raised its Attack!`;
			}
			return {
				immune: true,
				message,
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

	'telepathy': ctx => {
		const attackerIsPlayer = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.attacker.id);
		const defenderIsPlayer = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.defender.id);

		if (attackerIsPlayer === defenderIsPlayer) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Telepathy protects it from its ally's move!`,
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

	'steelworker': (ctx, basePower) => {
		if (ctx.move.type === 'Steel') {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'transistor': (ctx, basePower) => {
		if (ctx.move.type === 'Electric') {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'dragonsmaw': (ctx, basePower) => {
		if (ctx.move.type === 'Dragon') {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'rockypayload': (ctx, basePower) => {
		if (ctx.move.type === 'Rock') {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'sharpness': (ctx, basePower) => {
		const slicingMoves = [
			'aerialace', 'aircutter', 'airslash', 'aquacutter', 'behemothblade', 'bitterblade',
			'ceaselessedge', 'crosspoison', 'cut', 'furycutter', 'kowtowcleave', 'leafblade',
			'nightslash', 'populationbomb', 'psychocut', 'razorleaf', 'razorshell', 'sacredsword',
			'slash', 'solarblade', 'stoneaxe', 'xscissor',
		];
		if (slicingMoves.includes(ctx.move.id)) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'steelyspirit': (ctx, basePower) => {
		if (ctx.move.type === 'Steel') {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	'stakeout': (ctx, basePower) => {
		if (ctx.defenderSlot.activeTurns === 1) {
			return Math.floor(basePower * 2);
		}
		return basePower;
	},

	'supremeoverlord': (ctx, basePower) => {
		const isPlayerAttacker = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.attacker.id);
		const party = isPlayerAttacker ?
			ctx.battle.playerSlots.map(s => s?.pokemon).filter(p => p) :
			ctx.battle.opponentSlots.map(s => s?.pokemon).filter(p => p);

		const faintedCount = party.filter(p => p && p.hp === 0).length;
		if (faintedCount > 0) {
			const multiplier = 1 + (faintedCount * 0.1);
			return Math.floor(basePower * multiplier);
		}
		return basePower;
	},

	'solarpower': (ctx, basePower) => {
		if (ctx.attacker.item === 'utilityumbrella') return basePower;
		if (isWeatherActive(ctx.battle) && (ctx.battle.weather?.type === 'sun' || ctx.battle.weather?.type === 'harsh-sun')) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},
};

export const TYPE_MODIFIER_ABILITIES: Record<string, AbilityTypeModifierHandler> = {
	'normalize': (ctx, moveType) => {
		if (ctx.move.category !== 'Status') {
			(ctx.move).typeConversionBoost = true;
			return 'Normal';
		}
		return moveType;
	},

	'pixilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move).typeConversionBoost = true;
			return 'Fairy';
		}
		return moveType;
	},

	'refrigerate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move).typeConversionBoost = true;
			return 'Ice';
		}
		return moveType;
	},

	'aerilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move).typeConversionBoost = true;
			return 'Flying';
		}
		return moveType;
	},

	'galvanize': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move).typeConversionBoost = true;
			return 'Electric';
		}
		return moveType;
	},

	'liquidvoice': (ctx, moveType) => {
		if (ctx.move.flags.sound) {
			return 'Water';
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

	'gorillatactics': (pokemon, stat, value) => {
		if (stat === 'atk') {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'toxicboost': (pokemon, stat, value, slot) => {
		const status = slot ? slot.status : pokemon.status;
		if (stat === 'atk' && (status === 'psn' || status === 'tox')) {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'flareboost': (pokemon, stat, value, slot) => {
		const status = slot ? slot.status : pokemon.status;
		if (stat === 'spa' && status === 'brn') {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'defeatist': (pokemon, stat, value) => {
		if ((stat === 'atk' || stat === 'spa') && pokemon.hp <= pokemon.maxHp / 2) {
			return Math.floor(value * 0.5);
		}
		return value;
	},

	'grasspelt': (pokemon, stat, value, slot, battle) => {
		if (stat === 'def' && battle?.terrain?.type === 'grassy') {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	'plus': (pokemon, stat, value, slot, battle) => {
		if (stat === 'spa' && battle) {
			const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
			const allies = isPlayer ? battle.playerSlots : battle.opponentSlots;
			const hasMinusOrPlus = allies.some(s =>
				s && s.pokemon.id !== pokemon.id && s.pokemon.hp > 0 &&
				(toID(s.pokemon.ability || '') === 'minus' || toID(s.pokemon.ability || '') === 'plus')
			);
			if (hasMinusOrPlus) {
				return Math.floor(value * 1.5);
			}
		}
		return value;
	},

	'hadronengine': (pokemon, stat, value, slot, battle) => {
		if (stat === 'spa' && battle?.terrain?.type === 'electric') {
			return Math.floor(value * 1.33);
		}
		return value;
	},

	'orichalcumpulse': (pokemon, stat, value, slot, battle) => {
		if (stat === 'atk' && battle?.weather?.type === 'sun') {
			return Math.floor(value * 1.33);
		}
		return value;
	},

	'protosynthesis': (pokemon, stat, value, slot, battle) => {
		const inSun = battle && RPGAbilities.isWeatherActive(battle) &&
			(battle.weather?.type === 'sun' || battle.weather?.type === 'harsh-sun');
		const hasBoosterActive = slot?.boosterEnergyActive;

		if (!inSun && !hasBoosterActive) return value;

		const stats = {
			atk: pokemon.atk,
			def: pokemon.def,
			spa: pokemon.spa,
			spd: pokemon.spd,
			spe: pokemon.spe,
		};

		let highestStat: keyof typeof stats = 'atk';
		let highestValue = stats.atk;

		for (const [statName, statValue] of Object.entries(stats) as [keyof typeof stats, number][]) {
			if (statValue > highestValue) {
				highestValue = statValue;
				highestStat = statName;
			}
		}

		if (stat === highestStat) {
			const multiplier = stat === 'spe' ? 1.5 : 1.3;
			return Math.floor(value * multiplier);
		}
		return value;
	},

	'quarkdrive': (pokemon, stat, value, slot, battle) => {
		const inElectricTerrain = battle?.terrain?.type === 'electric';
		const hasBoosterActive = slot?.boosterEnergyActive;

		if (!inElectricTerrain && !hasBoosterActive) return value;

		const stats = {
			atk: pokemon.atk,
			def: pokemon.def,
			spa: pokemon.spa,
			spd: pokemon.spd,
			spe: pokemon.spe,
		};

		let highestStat: keyof typeof stats = 'atk';
		let highestValue = stats.atk;

		for (const [statName, statValue] of Object.entries(stats) as [keyof typeof stats, number][]) {
			if (statValue > highestValue) {
				highestValue = statValue;
				highestStat = statName;
			}
		}

		if (stat === highestStat) {
			const multiplier = stat === 'spe' ? 1.5 : 1.3;
			return Math.floor(value * multiplier);
		}
		return value;
	},

	'swordofruin': (pokemon, stat, value, slot, battle) => {
		if (stat === 'def' && battle) {
			const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
			const opponents = isPlayer ? battle.opponentSlots : battle.playerSlots;
			const hasSwordOfRuin = opponents.some(s =>
				s && s.pokemon.hp > 0 &&
				toID(s.pokemon.ability || '') === 'swordofruin' &&
				s.pokemon.id !== pokemon.id
			);

			if (hasSwordOfRuin) {
				return Math.floor(value * 0.75);
			}
		}
		return value;
	},

	'tabletsofruin': (pokemon, stat, value, slot, battle) => {
		if (stat === 'atk' && battle) {
			const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
			const opponents = isPlayer ? battle.opponentSlots : battle.playerSlots;
			const hasTabletsOfRuin = opponents.some(s =>
				s && s.pokemon.hp > 0 &&
				toID(s.pokemon.ability || '') === 'tabletsofruin' &&
				s.pokemon.id !== pokemon.id
			);

			if (hasTabletsOfRuin) {
				return Math.floor(value * 0.75);
			}
		}
		return value;
	},

	'vesselofruin': (pokemon, stat, value, slot, battle) => {
		if (stat === 'spa' && battle) {
			const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
			const opponents = isPlayer ? battle.opponentSlots : battle.playerSlots;
			const hasVesselOfRuin = opponents.some(s =>
				s && s.pokemon.hp > 0 &&
				toID(s.pokemon.ability || '') === 'vesselofruin' &&
				s.pokemon.id !== pokemon.id
			);

			if (hasVesselOfRuin) {
				return Math.floor(value * 0.75);
			}
		}
		return value;
	},

	'beadsofruin': (pokemon, stat, value, slot, battle) => {
		if (stat === 'spd' && battle) {
			const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
			const opponents = isPlayer ? battle.opponentSlots : battle.playerSlots;
			const hasBeadsOfRuin = opponents.some(s =>
				s && s.pokemon.hp > 0 &&
				toID(s.pokemon.ability || '') === 'beadsofruin' &&
				s.pokemon.id !== pokemon.id
			);

			if (hasBeadsOfRuin) {
				return Math.floor(value * 0.75);
			}
		}
		return value;
	},
};

export const WEATHER_ABILITIES = {
	'drought': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'sun') {
				const hasHeatRock = battle.magicRoomTurns === 0 && slot.pokemon.item === 'heatrock';
				battle.weather = { type: 'sun', turns: hasHeatRock ? 8 : 5 };
				messageLog.push(`${slot.pokemon.species}'s Drought intensified the sun!`);
			}
		},
	},

	'drizzle': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'rain') {
				const hasDampRock = battle.magicRoomTurns === 0 && slot.pokemon.item === 'damprock';
				battle.weather = { type: 'rain', turns: hasDampRock ? 8 : 5 };
				messageLog.push(`${slot.pokemon.species}'s Drizzle caused a downpour!`);
			}
		},
	},

	'sandstream': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'sand') {
				const hasSmoothRock = battle.magicRoomTurns === 0 && slot.pokemon.item === 'smoothrock';
				battle.weather = { type: 'sand', turns: hasSmoothRock ? 8 : 5 };
				messageLog.push(`${slot.pokemon.species}'s Sand Stream whipped up a sandstorm!`);
			}
		},
	},

	'snowwarning': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'hail') {
				const hasIcyRock = battle.magicRoomTurns === 0 && slot.pokemon.item === 'icyrock';
				battle.weather = { type: 'hail', turns: hasIcyRock ? 8 : 5 };
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

	'deltastream': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'strong-winds') {
				battle.weather = { type: 'strong-winds', turns: 9999 };
				messageLog.push(`${slot.pokemon.species}'s Delta Stream created strong winds!`);
			}
		},
	},

	'desolateland': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'harsh-sun') {
				battle.weather = { type: 'harsh-sun', turns: 9999 };
				messageLog.push(`${slot.pokemon.species}'s Desolate Land created harsh sunlight!`);
			}
		},
	},

	'primordialsea': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'heavy-rain') {
				battle.weather = { type: 'heavy-rain', turns: 9999 };
				messageLog.push(`${slot.pokemon.species}'s Primordial Sea created heavy rain!`);
			}
		},
	},

	'orichalcumpulse': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.weather?.type !== 'sun') {
				const hasHeatRock = battle.magicRoomTurns === 0 && slot.pokemon.item === 'heatrock';
				battle.weather = { type: 'sun', turns: hasHeatRock ? 8 : 5 };
				messageLog.push(`${slot.pokemon.species}'s Orichalcum Pulse created harsh sunlight!`);
			}
		},
	},

	'teraformzero': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			const hadWeather = battle.weather !== null;
			const hadTerrain = battle.terrain !== null;

			battle.weather = null;
			battle.terrain = null;

			(battle as any).teraformZeroActive = true;

			if (hadWeather || hadTerrain) {
				messageLog.push(`${slot.pokemon.species}'s Teraform Zero eliminated all effects on the field!`);
			}
		},
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

	'poisontouch': {
		onContactChance: 0.3,
		effect: 'psn',
	},

	'pickpocket': {
		stealItem: true,
	},

	'watercompaction': {
		onContactStat: 'def',
		value: 2,
		triggerType: 'Water',
	},

	'toxicchain': {
		onContactChance: 0.3,
		effect: 'tox',
	},

	'mummy': {
		changeAbility: 'mummy',
	},

	'lingeringaroma': {
		changeAbility: 'lingeringaroma',
	},

	'wanderingspirit': {
		swapAbility: true,
	},

	'perishbody': {
		perishBody: true,
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

	'quickdraw': {
		modifyPriority: (move: Move, pokemon: RPGPokemon) => {
			if (move.category !== 'Status' && Math.random() < 0.3) {
				return 1;
			}
			return 0;
		},
	},

	'stall': {
		modifyPriority: (move: Move, pokemon: RPGPokemon) => {
			return -9999;
		},
	},

	'myceliummight': {
		modifyPriority: (move: Move, pokemon: RPGPokemon) => {
			if (move.category === 'Status') {
				return -999;
			}
			return 0;
		},
		ignoresAbilities: true,
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

	'noguard': {
		alwaysHit: true,
	},

	'victorystar': {
		accuracyMultiplier: 1.1,
	},

	'mindseye': {
		ignoresEvasion: true,
		hitsGhosts: true,
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

	'iceface': {
		blockPhysical: true,
	},

	'mimicry': {
		terrainType: true,
	},

	'hungerswitch': {
		formChange: true,
		everyTurn: true,
	},

	'zenmode': {
		hpFormChange: true,
		threshold: 0.5,
	},

	'gulpmissile': {
		formChange: true,
		onSurfDive: true,
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

	'hadronengine': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			if (battle.terrain?.type !== 'electric') {
				battle.terrain = { type: 'electric', turns: 5 };
				messageLog.push(`${slot.pokemon.species}'s Hadron Engine electrified the field!`);
			}
		},
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
	'grimneigh': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.spa < 6) {
				slot.statStages.spa++;
				messageLog.push(`${slot.pokemon.species}'s Grim Neigh raised its Sp. Atk!`);
			}
		},
	},

	'asoneglastrier': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.atk < 6) {
				slot.statStages.atk++;
				messageLog.push(`${slot.pokemon.species}'s As One raised its Attack!`);
			}
		},
	},

	'asonespectrier': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.spa < 6) {
				slot.statStages.spa++;
				messageLog.push(`${slot.pokemon.species}'s As One raised its Sp. Atk!`);
			}
		},
	},
	'soulheart': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.spa < 6) {
				slot.statStages.spa++;
				messageLog.push(`${slot.pokemon.species}'s Soul-Heart raised its Sp. Atk!`);
			}
		},
	},
	'aftermath': {
		handler: (slot, battle, messageLog) => {

		},
	},

	'innardsout': {
		handler: (slot, battle, messageLog) => {

		},
	},
};

export const END_OF_TURN_ABILITIES: Record<string, { handler: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void }> = {
	'speedboost': {
		handler: (slot, battle, messageLog) => {
			if (slot.statStages.spe < 6) {
				slot.statStages.spe++;
				messageLog.push(`${slot.pokemon.species}'s Speed Boost raised its Speed!`);
			}
		},
	},

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
	'colorchange': {
		handler: (slot, battle, messageLog) => {

		},
	},
	'moody': {
		handler: (slot, battle, messageLog) => {
			const stats: (keyof typeof slot.statStages)[] = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];

			const raisableStats = stats.filter(stat => slot.statStages[stat] < 6);

			const lowerableStats = stats.filter(stat => slot.statStages[stat] > -6);

			if (raisableStats.length > 0) {
				const statToRaise = raisableStats[Math.floor(Math.random() * raisableStats.length)];
				slot.statStages[statToRaise] = Math.min(6, slot.statStages[statToRaise] + 2);
				const statNames: Record<string, string> = {
					atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed',
					accuracy: 'accuracy', evasion: 'evasion',
				};
				messageLog.push(`${slot.pokemon.species}'s Moody sharply raised its ${statNames[statToRaise]}!`);

				const lowerableDifferentStats = lowerableStats.filter(stat => stat !== statToRaise);
				if (lowerableDifferentStats.length > 0) {
					const statToLower = lowerableDifferentStats[Math.floor(Math.random() * lowerableDifferentStats.length)];
					slot.statStages[statToLower] = Math.max(-6, slot.statStages[statToLower] - 1);
					messageLog.push(`${slot.pokemon.species}'s Moody lowered its ${statNames[statToLower]}!`);
				}
			}
		},
	},

	'healer': {
		handler: (slot, battle, messageLog) => {
			if (Math.random() >= 0.3) return;

			const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id);
			const allies = isPlayerPokemon ? battle.playerSlots : battle.opponentSlots;

			for (const allySlot of allies) {
				if (allySlot && allySlot.pokemon.id !== slot.pokemon.id && allySlot.pokemon.hp > 0 && allySlot.status) {
					const statusName = {
						psn: 'poison',
						tox: 'toxic poison',
						brn: 'burn',
						par: 'paralysis',
						slp: 'sleep',
						frz: 'freeze',
					}[allySlot.status] || 'status condition';
					allySlot.status = null;
					messageLog.push(`${slot.pokemon.species}'s Healer cured ${allySlot.pokemon.species}'s ${statusName}!`);
					return;
				}
			}
		},
	},

	'harvest': {
		handler: (slot, battle, messageLog) => {
			if (!slot.consumedBerry || slot.pokemon.item || slot.harvestUsedThisTurn) return;

			const inSunlight = isWeatherActive(battle) &&
				(battle.weather?.type === 'sun' || battle.weather?.type === 'harsh-sun');
			const chance = inSunlight ? 1.0 : 0.5;

			if (Math.random() < chance) {
				// Use setItem to handle item gain properly (unburden reset etc)
				setItem(slot, slot.consumedBerry, undefined, battle, messageLog);
				messageLog.push(`${slot.pokemon.species}'s Harvest restored its ${slot.consumedBerry}!`);
				slot.harvestUsedThisTurn = true;
			}
		},
	},

	'baddreams': {
		handler: (slot, battle, messageLog) => {
			const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === slot.pokemon.id);
			const opponents = isPlayerPokemon ? battle.opponentSlots : battle.playerSlots;

			for (const opponentSlot of opponents) {
				if (opponentSlot && opponentSlot.pokemon.hp > 0 && opponentSlot.status === 'slp') {
					const damage = Math.floor(opponentSlot.pokemon.maxHp / 8);
					opponentSlot.pokemon.hp = Math.max(0, opponentSlot.pokemon.hp - damage);
					messageLog.push(`${opponentSlot.pokemon.species} is tormented by ${slot.pokemon.species}'s Bad Dreams!`);
				}
			}
		},
	},

	'cudchew': {
		handler: (slot, battle, messageLog) => {
			if (slot.cudChewBerry && !slot.pokemon.item) {
				// Use setItem to restore the berry (Unburden resets)
				setItem(slot, slot.cudChewBerry, undefined, battle, messageLog);
				messageLog.push(`${slot.pokemon.species} is chewing its ${slot.cudChewBerry} again!`);

				slot.cudChewBerry = undefined;
			}
		},
	},

	'windpower': {
		handler: (slot, battle, messageLog) => {

		},
	},

	'windrider': {
		handler: (slot, battle, messageLog) => {

		},
	},

	'electromorphosis': {
		handler: (slot, battle, messageLog) => {

		},
	},
};

export const STAT_DROP_RESPONSE_ABILITIES: Record<string, { handler: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[], sourceSlot?: ActivePokemonSlot) => void }> = {
	'defiant': {
		handler: (slot, battle, messageLog, sourceSlot) => {
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
			if (sourceSlot && sourceSlot.pokemon.id === slot.pokemon.id) {
				return;
			}
			if (slot.statStages.spa < 6) {
				slot.statStages.spa = Math.min(6, slot.statStages.spa + 2);
				messageLog.push(`${slot.pokemon.species}'s Competitive sharply raised its Sp. Atk!`);
			}
		},
	},
	'mirrorarmor': {
		handler: (slot, battle, messageLog, sourceSlot) => {
			// This handler is actually tricky to use for reflection because
			// reflection needs to happen INSTEAD of the drop, not AFTER.
			// It is cleaner to handle this directly in applyStatChange
		},
	},
};

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

export const TRAPPING_ABILITIES = {
	'shadowtag': {
		preventsSwitch: true,
		description: 'Prevents non-Shadow Tag opponents from switching',
	},
	'arenatrap': {
		preventsSwitch: true,
		groundedOnly: true,
		description: 'Prevents grounded opponents from switching',
	},
	'magnetpull': {
		preventsSwitch: true,
		steelOnly: true,
		description: 'Prevents Steel-type opponents from switching',
	},
};

export const AURA_ABILITIES = {
	'darkaura': {
		boostedType: 'Dark',
		multiplier: 1.33,
		description: 'Boosts Dark-type moves for all Pokemon by 33%',
	},
	'fairyaura': {
		boostedType: 'Fairy',
		multiplier: 1.33,
		description: 'Boosts Fairy-type moves for all Pokemon by 33%',
	},
	'aurabreak': {
		reversesAuras: true,
		description: 'Reverses the effects of Dark Aura and Fairy Aura',
	},
};

export const RUIN_ABILITIES = {
	'swordofruin': {
		stat: 'def',
		description: 'Lowers Defense of all other Pokemon',
	},
	'tabletsofruin': {
		stat: 'atk',
		description: 'Lowers Attack of all other Pokemon',
	},
	'vesselofruin': {
		stat: 'spa',
		description: 'Lowers Sp. Atk of all other Pokemon',
	},
	'beadsofruin': {
		stat: 'spd',
		description: 'Lowers Sp. Def of all other Pokemon',
	},
};

export const SPECIAL_MECHANIC_ABILITIES = {
	'protean': {
		changeTypeOnMove: true,
		description: 'Changes the Pokemon\'s type to the type of the move it\'s about to use',
	},
	'libero': {
		changeTypeOnMove: true,
		description: 'Changes the Pokemon\'s type to the type of the move it\'s about to use',
	},
	'magician': {
		stealsItemOnHit: true,
		description: 'Steals the target\'s item when attacking',
	},
	'dancer': {
		copiesDanceMoves: true,
		description: 'Automatically uses dance moves after another Pokemon uses one',
	},
	'symbiosis': {
		passesItem: true,
		description: 'Passes item to ally when they use their item',
	},
	'opportunist': {
		copiesStatBoosts: true,
		description: 'Copies any stat increases made by opponents',
	},
	'receiver': {
		copiesAllyAbility: true,
		description: 'Copies the ability of a defeated ally',
	},
	'powerofalchemy': {
		copiesAllyAbility: true,
		description: 'Copies the ability of a defeated ally',
	},
	'magicbounce': {
		reflectsStatusMoves: true,
		description: 'Reflects non-damaging moves back at the user',
	},
	'rebound': {
		reflectsStatusMoves: true,
		description: 'Reflects non-damaging moves back at the user',
	},
	'wonderskin': {
		lowersStatusAccuracy: true,
		description: 'Lowers the accuracy of status moves targeting this Pokemon to 50%',
	},
	'waterbubble': {
		fireResistance: 0.5,
		attackBoost: 2.0,
		burnImmune: true,
		description: 'Halves Fire damage, doubles Attack, prevents burn',
	},
};

export const RPG_SPECIFIC_ABILITIES = {
	'noability': {

		description: 'No ability - does nothing',
	},
	'runaway': {

		description: 'Guarantees escape from wild battles (implemented in encounter system)',
		escapeGuaranteed: true,
	},
	'illuminate': {

		description: 'Increases wild encounter rate by 2x (implemented in encounter system)',
		encounterRateMultiplier: 2,
	},
	'honeygather': {

		description: 'May gather Honey after battle (implemented in post-battle rewards)',
		postBattleItem: 'honey',
		chance: 0.05,
	},
	'pickup': {

		description: 'May pick up items after battle based on level (implemented in post-battle rewards)',
		postBattlePickup: true,
		chanceByLevel: true,
	},
	'ballfetch': {
		description: 'Fetches failed Poké Ball after battle (implemented in catch system)',
		retrievesBall: true,
	},
	'anticipation': {
		description: 'Warns about dangerous moves (implemented in battle start)',
		warnsDangerousMoves: true,
	},
	'forewarn': {
		description: 'Reveals opponent\'s strongest move (implemented in battle start)',
		revealsStrongestMove: true,
	},
};

export function getModifiedWeight(pokemon: RPGPokemon): number {
	const ability = toID(pokemon.ability || '');
	const species = Dex.species.get(pokemon.species);
	const baseWeight = species.weightkg;

	if (ability === 'heavymetal') {
		return baseWeight * 2;
	}
	if (ability === 'lightmetal') {
		return baseWeight / 2;
	}

	return baseWeight;
}

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
		if (pokemon.item === 'ironball') return true;
		return false;
	}

	if (species.types.includes('Flying')) {
		if (pokemon.item === 'ironball') return true;
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
	const ability = getActiveAbility(ctx.defender, ctx.attacker);

	if (ctx.move.flags.powder && ctx.defender.item === 'safetygoggles') {
		return {
			immune: true,
			message: `${ctx.defender.species}'s Safety Goggles protects it from the powder!`,
		};
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

	const isPlayerAttacker = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.attacker.id);
	const attackerAllies = isPlayerAttacker ? ctx.battle.playerSlots : ctx.battle.opponentSlots;
	const hasBattery = attackerAllies.some(s =>
		s && s.pokemon.id !== ctx.attacker.id && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'battery'
	);
	const hasPowerSpot = attackerAllies.some(s =>
		s && s.pokemon.id !== ctx.attacker.id && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'powerspot'
	);

	if (hasBattery && ctx.move.category === 'Special') {
		basePower = Math.floor(basePower * 1.3);
	}
	if (hasPowerSpot) {
		basePower = Math.floor(basePower * 1.3);
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

	if (slot?.terastallized) {
		const isTeraMatch = slot.terastallized === moveType;
		const isOriginalMatch = species.types.includes(moveType);
		const ability = toID(pokemon.ability || '');

		if (isTeraMatch) {
			if (isOriginalMatch) {
				return ability === 'adaptability' ? 2.25 : 2.0;
			}
			return ability === 'adaptability' ? 2.0 : 1.5;
		} else if (isOriginalMatch) {
			return 1.5;
		}
		return 1;
	}

	const hasSTAB = species.types.includes(moveType);
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
	return ability === 'innerfocus';
}

export function preventsStatus(pokemon: RPGPokemon, status: string, battle?: BattleState, attacker?: RPGPokemon): boolean {
	const ability = getActiveAbility(pokemon, attacker);

	if (attacker && toID(attacker.ability || '') === 'corrosion' && (status === 'psn' || status === 'tox')) {
		if (ability === 'immunity' || ability === 'purifyingsalt') {
			return true;
		}
		return false;
	}

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

	if (ability === 'leafguard' && battle && isWeatherActive(battle) && battle.weather?.type === 'sun') {
		return true;
	}

	if (battle) {
		const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
		const allies = isPlayerPokemon ? battle.playerSlots : battle.opponentSlots;

		if ((status === 'psn' || status === 'tox') && allies.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'pastelveil')) {
			return true;
		}

		if (status === 'slp' && allies.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'sweetveil')) {
			return true;
		}
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
		if (ability === 'hustle' && move.category !== 'Physical') {
			return moveAccuracy;
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

export function applyAbilitySpeedModifier(pokemon: RPGPokemon, battle: BattleState, speed: number): number {
	const ability = toID(pokemon.ability || '');

	if (pokemon.item === 'utilityumbrella') return speed;

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

	return speed;
}

export function applyDamageModifier(ctx: AbilityContext, damage: number): number {
	const attackerAbility = toID(ctx.attacker.ability || '');
	const defenderAbility = getActiveAbility(ctx.defender, ctx.attacker);
	const effectiveness = ctx.effectiveness || 1;

	if (defenderAbility === 'dryskin' && ctx.move.type === 'Fire') {
		if (ctx.defender.item !== 'utilityumbrella') {
			damage = Math.floor(damage * 1.25);
		}
	}

	if (attackerAbility === 'tintedlens' && effectiveness < 1) {
		damage = Math.floor(damage * 2);
	}

	if ((defenderAbility === 'solidrock' || defenderAbility === 'filter') && effectiveness > 1) {
		damage = Math.floor(damage * 0.75);
	}

	if ((defenderAbility === 'multiscale' || defenderAbility === 'shadowshield') &&
		ctx.defender.hp === ctx.defender.maxHp) {
		damage = Math.floor(damage * 0.5);
	}

	if (defenderAbility === 'purifyingsalt' && ctx.move.type === 'Ghost') {
		damage = Math.floor(damage * 0.5);
	}

	if (defenderAbility === 'furcoat' && ctx.move.category === 'Physical') {
		damage = Math.floor(damage * 0.5);
	}

	if (defenderAbility === 'thickfat' && (ctx.move.type === 'Fire' || ctx.move.type === 'Ice')) {
		damage = Math.floor(damage * 0.5);
	}

	if (defenderAbility === 'heatproof' && ctx.move.type === 'Fire') {
		damage = Math.floor(damage * 0.5);
	}

	if (defenderAbility === 'fluffy') {
		if (ctx.move.flags.contact) {
			damage = Math.floor(damage * 0.5);
		}
		if (ctx.move.type === 'Fire') {
			damage = Math.floor(damage * 2);
		}
	}

	if (defenderAbility === 'icescales' && ctx.move.category === 'Special') {
		damage = Math.floor(damage * 0.5);
	}

	if (defenderAbility === 'prismarmor' && effectiveness > 1) {
		damage = Math.floor(damage * 0.75);
	}

	if (attackerAbility === 'neuroforce' && effectiveness > 1) {
		damage = Math.floor(damage * 1.25);
	}

	if (attackerAbility === 'punkrock' && ctx.move.flags.sound) {
		damage = Math.floor(damage * 1.3);
	}
	if (defenderAbility === 'punkrock' && ctx.move.flags.sound) {
		damage = Math.floor(damage * 0.5);
	}

	const isPlayerDefender = ctx.battle.playerSlots.some(s => s?.pokemon.id === ctx.defender.id);
	const defenderAllies = isPlayerDefender ? ctx.battle.playerSlots : ctx.battle.opponentSlots;
	const hasFriendGuard = defenderAllies.some(s =>
		s && s.pokemon.id !== ctx.defender.id && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'friendguard'
	);
	if (hasFriendGuard) {
		damage = Math.floor(damage * 0.75);
	}

	if (defenderAbility === 'terashell' && ctx.defender.hp === ctx.defender.maxHp && ctx.move.category !== 'Status') {
		damage = Math.floor(damage * 0.5);
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

	if (ability === 'terashift') {
		if (pokemon.species === 'Terapagos' && slot.activeTurns === 1) {
			pokemon.species = 'Terapagos-Terastal';
			messageLog.push(`${pokemon.nickname || pokemon.species} transformed into its Terastal Form!`);
		}
	}

	if (ability === 'gulpmissile') {
		if ((slot as any).gulpMissileForm && slot.lastDamageTaken) {
			const form = (slot as any).gulpMissileForm;

			if (pokemon.species.includes('Gulping') || pokemon.species.includes('Gorging')) {
				pokemon.species = 'Cramorant';
				(slot as any).gulpMissileForm = null;
			}
		}
	}
}

export function getMultiHitCount(attacker: RPGPokemon, move: Move): number {
	const ability = toID(attacker.ability || '');
	const item = toID(attacker.item || '');

	if (move.multihit) {
		if (ability === 'skilllink') {
			if (Array.isArray(move.multihit)) {
				return move.multihit[1];
			}
			return 5;
		}

		if (item === 'loadeddice' && Array.isArray(move.multihit) && move.multihit[0] === 2 && move.multihit[1] === 5) {
			return Math.random() < 0.5 ? 4 : 5;
		}

		if (Array.isArray(move.multihit) && move.multihit[0] === 2 && move.multihit[1] === 5) {
			const rand = Math.random() * 100;
			if (rand < 35) return 2;
			if (rand < 70) return 3;
			if (rand < 85) return 4;
			return 5;
		}

		if (Array.isArray(move.multihit)) {
			const min = move.multihit[0];
			const max = move.multihit[1];
			return min + Math.floor(Math.random() * (max - min + 1));
		}

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
	const defenderAbility = getActiveAbility(ctx.defender, ctx.attacker);

	const allSlots = [...ctx.battle.playerSlots, ...ctx.battle.opponentSlots];
	const hasDamp = allSlots.some(s => s && s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'damp');
	if (hasDamp && ['explosion', 'selfdestruct', 'mindblown', 'mistyexplosion'].includes(ctx.move.id)) {
		return {
			prevented: true,
			message: `${ctx.attacker.species} cannot use ${ctx.move.name} due to Damp!`,
		};
	}

	if (ctx.battle.weather?.type === 'harsh-sun' && ctx.move.type === 'Water') {
		return {
			prevented: true,
			message: `The harsh sunlight evaporated the Water-type move!`,
		};
	}

	if (ctx.battle.weather?.type === 'heavy-rain' && ctx.move.type === 'Fire') {
		return {
			prevented: true,
			message: `The heavy rain extinguished the Fire-type move!`,
		};
	}

	if ((defenderAbility === 'dazzling' || defenderAbility === 'queenlymajesty' || defenderAbility === 'armortail') &&
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

export function applyStatChangeModifier(value: number, ability: string): number {
	if (ability === 'contrary') {
		return -value;
	}
	if (ability === 'simple') {
		return value * 2;
	}
	return value;
}

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
	const ability = getActiveAbility(slot.pokemon, sourceSlot?.pokemon);
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
		'contrary', 'simple',
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

	const weatherAbility = WEATHER_ABILITIES[ability];
	if (weatherAbility?.onSwitchIn) {
		weatherAbility.onSwitchIn(slot, battle, messageLog);
	}

	const terrainAbility = TERRAIN_ABILITIES[ability];
	if (terrainAbility?.onSwitchIn) {
		terrainAbility.onSwitchIn(slot, battle, messageLog);
	}

	if (ability === 'intimidate') {
		const opponentSlots = isPlayerSwitchIn ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);
		messageLog.push(`${pokemon.species}'s Intimidate cuts the opposing Pokémon's Attack!`);

		for (const opponentSlot of opponentSlots) {
			if (opponentSlot && opponentSlot.pokemon.hp > 0) {
				const oppAbility = getActiveAbility(opponentSlot.pokemon, slot.pokemon);

				if (oppAbility === 'guarddog') {
					if (opponentSlot.statStages.atk < 6) {
						opponentSlot.statStages.atk++;
						messageLog.push(`${opponentSlot.pokemon.species}'s Guard Dog raised its Attack!`);
					}
					continue;
				}

				if (opponentSlot.pokemon.item === 'adrenalineorb' && opponentSlot.statStages.spe < 6) {
					applyStatChange(opponentSlot, 'spe', 1, battle, messageLog, slot);
					setItem(opponentSlot, undefined, undefined, battle, messageLog); // Consume Adrenaline Orb
					messageLog.push(`${opponentSlot.pokemon.species}'s Adrenaline Orb raised its Speed!`);
				}

				applyStatChange(opponentSlot, 'atk', -1, battle, messageLog, slot);
			}
		}
	}

	if (ability === 'slowstart') {
		slot.slowStartTurns = 5;
		messageLog.push(`${pokemon.species} is off to a slow start!`);
	}

	if (ability === 'dauntlessshield' && slot.statStages.def < 6) {
		slot.statStages.def++;
		messageLog.push(`${pokemon.species}'s Dauntless Shield raised its Defense!`);
	}

	if (ability === 'intrepidsword' && slot.statStages.atk < 6) {
		slot.statStages.atk++;
		messageLog.push(`${pokemon.species}'s Intrepid Sword raised its Attack!`);
	}

	if (ability === 'costar') {
		const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
		const allies = isPlayerPokemon ? battle.playerSlots : battle.opponentSlots;
		const ally = allies.find(s => s && s.pokemon.id !== pokemon.id && s.pokemon.hp > 0);

		if (ally) {
			slot.statStages = { ...ally.statStages };
			messageLog.push(`${pokemon.species} copied ${ally.pokemon.species}'s stat changes!`);
		}
	}

	if (ability === 'curiousmedicine') {
		const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
		const allies = isPlayerPokemon ? battle.playerSlots : battle.opponentSlots;

		for (const ally of allies) {
			if (ally && ally.pokemon.id !== pokemon.id && ally.pokemon.hp > 0) {
				const hadNegative = Object.values(ally.statStages).some(stage => stage < 0);
				if (hadNegative) {
					ally.statStages = {
						atk: Math.max(0, ally.statStages.atk),
						def: Math.max(0, ally.statStages.def),
						spa: Math.max(0, ally.statStages.spa),
						spd: Math.max(0, ally.statStages.spd),
						spe: Math.max(0, ally.statStages.spe),
						accuracy: Math.max(0, ally.statStages.accuracy),
						evasion: Math.max(0, ally.statStages.evasion),
					};
					messageLog.push(`${pokemon.species}'s Curious Medicine restored ${ally.pokemon.species}'s stats!`);
				}
			}
		}
	}

	if (ability === 'hospitality') {
		const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
		const allies = isPlayerPokemon ? battle.playerSlots : battle.opponentSlots;
		const ally = allies.find(s => s && s.pokemon.id !== pokemon.id && s.pokemon.hp > 0);

		if (ally && ally.pokemon.hp < ally.pokemon.maxHp) {
			const healAmount = Math.floor(ally.pokemon.maxHp * 0.25);
			ally.pokemon.hp = Math.min(ally.pokemon.maxHp, ally.pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species}'s Hospitality restored ${ally.pokemon.species}'s HP!`);
		}
	}

	if (ability === 'supersweetsynup' || ability === 'supersweetsynip') {
		const opponents = isPlayerSwitchIn ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);
		for (const opponent of opponents) {
			if (opponent && opponent.pokemon.hp > 0) {
				applyStatChange(opponent, 'evasion', -1, battle, messageLog, slot);
			}
		}
	}

	if (ability === 'commander' && pokemon.species.includes('Tatsugiri')) {
		const isPlayerPokemon = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
		const allies = isPlayerPokemon ? battle.playerSlots : battle.opponentSlots;
		const dondozo = allies.find(s => s && s.pokemon.species === 'Dondozo' && s.pokemon.hp > 0);

		if (dondozo) {
			(slot as any).commanderActive = true;
			(dondozo as any).commanderBoost = true;

			const statBoosts = ['atk', 'def', 'spa', 'spd', 'spe'] as const;
			for (const stat of statBoosts) {
				if (dondozo.statStages[stat] < 6) {
					dondozo.statStages[stat] = Math.min(6, dondozo.statStages[stat] + 2);
				}
			}

			messageLog.push(`${pokemon.species} commanded from inside ${dondozo.pokemon.species}'s mouth!`);
		}
	}

	if (ability === 'zerotohero' && pokemon.species === 'Palafin' && (slot as any).hasSwitchedOut) {
		pokemon.species = 'Palafin-Hero';
		(slot as any).hasSwitchedOut = false;
		messageLog.push(`${pokemon.nickname || 'Palafin'} transformed into its Hero form!`);
	}

	if (ability === 'embodyaspectteal' && pokemon.species.includes('Ogerpon')) {
		applyStatChange(slot, 'spe', 1, battle, messageLog, slot);
	}

	if (ability === 'embodyaspectwellspring' && pokemon.species.includes('Ogerpon')) {
		applyStatChange(slot, 'spd', 1, battle, messageLog, slot);
	}

	if (ability === 'embodyaspecthearthflame' && pokemon.species.includes('Ogerpon')) {
		applyStatChange(slot, 'atk', 1, battle, messageLog, slot);
	}

	if (ability === 'embodyaspectcornerstone' && pokemon.species.includes('Ogerpon')) {
		applyStatChange(slot, 'def', 1, battle, messageLog, slot);
	}

	if (ability === 'screencleaner') {
		const sides = [
			{ name: 'player', slots: battle.playerSlots },
			{ name: 'opponent', slots: battle.opponentSlots },
		];
		let removedScreens = false;

		for (const side of sides) {
			const sidePrefix = side.name === 'player' ? 'player' : 'opponent';
			if ((battle as any)[`${sidePrefix}ReflectTurns`] > 0) {
				(battle as any)[`${sidePrefix}ReflectTurns`] = 0;
				removedScreens = true;
			}
			if ((battle as any)[`${sidePrefix}LightScreenTurns`] > 0) {
				(battle as any)[`${sidePrefix}LightScreenTurns`] = 0;
				removedScreens = true;
			}
			if ((battle as any)[`${sidePrefix}AuroraVeilTurns`] > 0) {
				(battle as any)[`${sidePrefix}AuroraVeilTurns`] = 0;
				removedScreens = true;
			}
		}

		if (removedScreens) {
			messageLog.push(`${pokemon.species}'s Screen Cleaner removed all screens!`);
		}
	}

	if ((ability === 'protosynthesis' || ability === 'quarkdrive') && pokemon.item === 'boosterenergy') {
		const hasWeatherBuff = ability === 'protosynthesis' && battle.weather &&
			(battle.weather.type === 'sun' || battle.weather.type === 'harsh-sun');
		const hasTerrainBuff = ability === 'quarkdrive' && battle.terrain?.type === 'electric';

		if (!hasWeatherBuff && !hasTerrainBuff && !(slot as any).boosterEnergyActive) {
			setItem(slot, undefined, undefined, battle, messageLog); // Consume Booster Energy
			(slot as any).boosterEnergyActive = true;
			messageLog.push(`${pokemon.species} consumed its Booster Energy to activate ${pokemon.ability}!`);
		}
	}
}

export function applyContactAbilityEffects(ctx: AbilityContext): void {
	// Protective Pads check
	if (ctx.attacker.item === 'protectivepads') return;

	const defenderAbility = getActiveAbility(ctx.defender, ctx.attacker);

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

	if (handler.onContactStat && attacker.hp > 0) {
		const stat = handler.onContactStat as keyof ActivePokemonSlot['statStages'];
		const value = handler.value as number;

		if (applyStatChange(attackerSlot, stat, value, ctx.battle, ctx.messageLog, ctx.defenderSlot)) {
			ctx.messageLog[ctx.messageLog.length - 1] += ` (from ${ctx.defender.species}'s ${ctx.defender.ability})!`;
		}
	}

	if (handler.effect && !attackerSlot.status && attacker.hp > 0 && Math.random() < handler.onContactChance) {
		const statusToInflict = handler.effect as string;
		let canBeAfflicted = true;

		const attackerTypes = ctx.attackerSlot.terastallized ? [ctx.attackerSlot.terastallized] : attackerSpecies.types;

		if ((statusToInflict === 'par' && attackerTypes.includes('Electric')) ||
			(statusToInflict === 'brn' && attackerTypes.includes('Fire')) ||
			(statusToInflict === 'psn' && (attackerTypes.includes('Poison') || attackerTypes.includes('Steel')))) {
			canBeAfflicted = false;
		}

		if (canBeAfflicted && preventsStatus(attacker, statusToInflict, ctx.battle, ctx.defender)) {
			canBeAfflicted = false;
			ctx.messageLog.push(`${attacker.species}'s ${attacker.ability} prevents ${statusToInflict}!`);
		}

		if (statusToInflict === 'infatuate') {
			canBeAfflicted = false;
		}

		if (canBeAfflicted) {
			attackerSlot.status = statusToInflict;
			if (statusToInflict === 'slp') {
				(attackerSlot as any).sleepCounter = Math.floor(Math.random() * 3) + 1;
			}
			ctx.messageLog.push(`${attacker.species} was afflicted with ${statusToInflict} by ${ctx.defender.species}'s ${ctx.defender.ability}!`);
		}
	}

	if (handler.effects && !attackerSlot.status && attacker.hp > 0 && Math.random() < handler.onContactChance) {
		const possibleStatuses: string[] = [];

		const attackerTypes = ctx.attackerSlot.terastallized ? [ctx.attackerSlot.terastallized] : attackerSpecies.types;

		if (!attackerTypes.includes('Poison') && !attackerTypes.includes('Steel') && !preventsStatus(attacker, 'psn', ctx.battle, ctx.defender)) {
			possibleStatuses.push('psn');
		}
		if (!attackerTypes.includes('Electric') && !preventsStatus(attacker, 'par', ctx.battle, ctx.defender)) {
			possibleStatuses.push('par');
		}
		if (!preventsStatus(attacker, 'slp', ctx.battle, ctx.defender)) {
			possibleStatuses.push('slp');
		}

		if (possibleStatuses.length > 0) {
			const statusToInflict = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
			attackerSlot.status = statusToInflict;
			if (statusToInflict === 'slp') {
				(attackerSlot as any).sleepCounter = Math.floor(Math.random() * 3) + 1;
			}
			ctx.messageLog.push(`${attacker.species} was afflicted with ${statusToInflict} by ${ctx.defender.species}'s Effect Spore!`);
		}
	}

	if (handler.stealItem && attacker.hp > 0 && !ctx.defender.item && attacker.item) {
		const attackerAbility = toID(attacker.ability || '');

		if (attackerAbility !== 'stickyhold') {
			// Use setItem to handle item transfer
			setItem(ctx.defenderSlot, attacker.item, ctx.attackerSlot, ctx.battle, ctx.messageLog);
			setItem(ctx.attackerSlot, undefined, undefined, ctx.battle, ctx.messageLog);
			ctx.messageLog.push(`${ctx.defender.species} stole ${attacker.species}'s ${ctx.defender.item}!`);
		}
	}

	if (handler.changeAbility && attacker.hp > 0) {
		const attackerAbility = toID(attacker.ability || '');

		const unchangeableAbilities = ['multitype', 'stancechange', 'schooling', 'shieldsdown', 'battlebond',
			'powerconstruct', 'disguise', 'rkssystem', 'comatose', 'zenmode'];

		if (!unchangeableAbilities.includes(attackerAbility)) {
			const oldAbility = attacker.ability;
			attacker.ability = handler.changeAbility;
			ctx.messageLog.push(`${attacker.species}'s ability changed to ${handler.changeAbility} from ${ctx.defender.species}'s ${defenderAbility}!`);
		}
	}

	if (handler.swapAbility && attacker.hp > 0) {
		const attackerAbility = toID(attacker.ability || '');
		const defenderAbilityName = ctx.defender.ability;

		const unswappableAbilities = ['multitype', 'stancechange', 'schooling', 'shieldsdown', 'battlebond',
			'powerconstruct', 'disguise', 'rkssystem', 'comatose', 'zenmode', 'wonderguard', 'illusion'];

		if (!unswappableAbilities.includes(attackerAbility) && !unswappableAbilities.includes(defenderAbility)) {
			const temp = attacker.ability;
			attacker.ability = defenderAbilityName;
			ctx.defender.ability = temp;
			ctx.messageLog.push(`${ctx.defender.species} swapped abilities with ${attacker.species}!`);
		}
	}

	if (handler.perishBody && attacker.hp > 0) {
		if (!attackerSlot.perishSongCounter) {
			attackerSlot.perishSongCounter = 3;
			ctx.messageLog.push(`${attacker.species} will perish in 3 turns!`);
		}
		if (!ctx.defenderSlot.perishSongCounter) {
			ctx.defenderSlot.perishSongCounter = 3;
			ctx.messageLog.push(`${ctx.defender.species} will perish in 3 turns!`);
		}
	}
}

export const RPGAbilities = {
	checkImmunity: checkAbilityImmunity,
	applyPowerModifier: applyAbilityPowerModifier,
	applyTypeModifier: applyAbilityTypeModifier,
	applyAbilityStatModifier,
	applyAbilitySpeedModifier,
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
	getModifiedWeight,

	isPersistent,
	getActiveAbility,

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
	TRAPPING_ABILITIES,
	AURA_ABILITIES,
	RUIN_ABILITIES,
	SPECIAL_MECHANIC_ABILITIES,
	RPG_SPECIFIC_ABILITIES,
};

export default RPGAbilities;
