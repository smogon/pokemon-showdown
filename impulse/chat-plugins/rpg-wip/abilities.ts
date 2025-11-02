/**
 * RPG Ability System
 * This file contains all ability implementations for the Pokemon RPG plugin
 * Abilities are organized by type and utilize Dex data where possible
 */

import { Dex, toID } from '../../../sim/dex';

// Type definitions for the RPG system
export interface RPGPokemon {
	species: string;
	level: number;
	hp: number;
	maxHp: number;
	atk: number;
	def: number;
	spa: number;
	spd: number;
	spe: number;
	ability?: string;
	item?: string;
	status: string | null;
	[key: string]: any;
}

export interface ActivePokemonSlot {
	pokemon: RPGPokemon;
	statStages: Record<string, number>;
	status: string | null;
	[key: string]: any;
}

export interface BattleState {
	weather?: { type: string; turns: number };
	terrain?: { type: string; turns: number };
	magicRoomTurns: number;
	wonderRoomTurns: number;
	gravityTurns: number;
	[key: string]: any;
}

export interface Move {
	id: string;
	name: string;
	type: string;
	category: 'Physical' | 'Special' | 'Status';
	basePower: number;
	flags: Record<string, boolean>;
	secondary?: any;
	[key: string]: any;
}

export interface AbilityContext {
	attacker: RPGPokemon;
	defender: RPGPokemon;
	attackerSlot: ActivePokemonSlot;
	defenderSlot: ActivePokemonSlot;
	move: Move;
	battle: BattleState;
	messageLog: string[];
}

/**
 * Ability Handler Types
 */
export type AbilityImmunityHandler = (ctx: AbilityContext) => { immune: boolean; message?: string } | null;
export type AbilityPowerModifierHandler = (ctx: AbilityContext, basePower: number) => number;
export type AbilityDamageModifierHandler = (ctx: AbilityContext, damage: number) => number;
export type AbilityStatModifierHandler = (pokemon: RPGPokemon, stat: string, value: number) => number;
export type AbilityTypeModifierHandler = (ctx: AbilityContext, moveType: string) => string;
export type AbilityOnSwitchInHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityOnDamageHandler = (ctx: AbilityContext, damage: number) => void;
export type AbilityOnMoveHandler = (ctx: AbilityContext) => void;

/**
 * Check if a Pokemon is grounded (affected by Ground-type moves)
 */
export function isGrounded(pokemon: RPGPokemon, battle: BattleState): boolean {
	const species = Dex.species.get(pokemon.species);
	const hasAirBalloon = battle.magicRoomTurns === 0 && pokemon.item === 'airballoon';
	const ability = toID(pokemon.ability || '');
	
	// Flying types, Levitate ability, or Air Balloon make Pokemon ungrounded
	if (species.types.includes('Flying') || ability === 'levitate' || hasAirBalloon) {
		return false;
	}
	
	// Gravity grounds everything
	if (battle.gravityTurns > 0) {
		return true;
	}
	
	// Check for Smack Down effect (if implemented in slot)
	// For now, default to grounded
	return true;
}

/**
 * Get ability data from Dex with fallback
 */
export function getAbilityData(abilityName: string) {
	const ability = Dex.abilities.get(abilityName);
	if (ability.exists) {
		return ability;
	}
	return null;
}

/**
 * IMMUNITY ABILITIES
 * These abilities grant immunity to certain move types, effects, or conditions
 */

export const IMMUNITY_ABILITIES: Record<string, AbilityImmunityHandler> = {
	// Sound-based move immunity
	'soundproof': (ctx) => {
		if (ctx.move.flags.sound) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Soundproof blocks the move!`
			};
		}
		return null;
	},

	// Powder move immunity
	'overcoat': (ctx) => {
		if (ctx.move.flags.powder) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Overcoat blocks the move!`
			};
		}
		return null;
	},

	// Ground-type immunity
	'levitate': (ctx) => {
		if (ctx.move.type === 'Ground' && ctx.battle.gravityTurns === 0) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Levitate makes it immune to Ground moves!`
			};
		}
		return null;
	},

	// Water-type immunity (absorbs and heals)
	'waterabsorb': (ctx) => {
		if (ctx.move.type === 'Water') {
			const healAmount = Math.floor(ctx.defender.maxHp * 0.25);
			ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + healAmount);
			return {
				immune: true,
				message: `${ctx.defender.species}'s Water Absorb restored its HP!`
			};
		}
		return null;
	},

	// Electric-type immunity (absorbs and heals)
	'voltabsorb': (ctx) => {
		if (ctx.move.type === 'Electric') {
			const healAmount = Math.floor(ctx.defender.maxHp * 0.25);
			ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + healAmount);
			return {
				immune: true,
				message: `${ctx.defender.species}'s Volt Absorb restored its HP!`
			};
		}
		return null;
	},

	// Fire-type immunity (absorbs and heals)
	'flashfire': (ctx) => {
		if (ctx.move.type === 'Fire') {
			// Note: In full implementation, would boost Fire-type moves
			return {
				immune: true,
				message: `${ctx.defender.species}'s Flash Fire absorbed the Fire move!`
			};
		}
		return null;
	},

	// Status move immunity (when at full HP)
	'sapsipper': (ctx) => {
		if (ctx.move.type === 'Grass') {
			// Boost Attack by 1 stage (would need stat stage system)
			return {
				immune: true,
				message: `${ctx.defender.species}'s Sap Sipper boosted its Attack!`
			};
		}
		return null;
	},

	// Storm Drain - Water moves redirect to this Pokemon
	'stormdrain': (ctx) => {
		if (ctx.move.type === 'Water') {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Storm Drain absorbed the Water move and boosted Sp. Atk!`
			};
		}
		return null;
	},

	// Lightning Rod - Electric moves redirect to this Pokemon
	'lightningrod': (ctx) => {
		if (ctx.move.type === 'Electric') {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Lightning Rod absorbed the Electric move and boosted Sp. Atk!`
			};
		}
		return null;
	},

	// Motor Drive - Electric immunity with speed boost
	'motordrive': (ctx) => {
		if (ctx.move.type === 'Electric') {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Motor Drive boosted its Speed!`
			};
		}
		return null;
	},

	// Dry Skin - Water immunity with HP restore, Fire weakness
	'dryskin': (ctx) => {
		if (ctx.move.type === 'Water') {
			const healAmount = Math.floor(ctx.defender.maxHp * 0.25);
			ctx.defender.hp = Math.min(ctx.defender.maxHp, ctx.defender.hp + healAmount);
			return {
				immune: true,
				message: `${ctx.defender.species}'s Dry Skin restored its HP!`
			};
		}
		return null;
	},

	// Wonder Guard - Only super-effective moves hit
	'wonderguard': (ctx) => {
		// This needs effectiveness calculation, which is complex
		// For now, simplified implementation
		if (ctx.move.category !== 'Status') {
			// Would need to calculate effectiveness here
			// Placeholder for now
			return null;
		}
		return null;
	},

	// Bulletproof - Immunity to ball and bomb moves
	'bulletproof': (ctx) => {
		if (ctx.move.flags.bullet) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Bulletproof blocks the move!`
			};
		}
		return null;
	},
};

/**
 * POWER MODIFIER ABILITIES
 * These abilities modify the base power of moves
 */

export const POWER_MODIFIER_ABILITIES: Record<string, AbilityPowerModifierHandler> = {
	// Boost punch moves
	'ironfist': (ctx, basePower) => {
		if (ctx.move.flags.punch) {
			return Math.floor(basePower * 1.2);
		}
		return basePower;
	},

	// Boost bite moves
	'strongjaw': (ctx, basePower) => {
		if (ctx.move.flags.bite) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	// Boost pulse moves
	'megalauncher': (ctx, basePower) => {
		if (ctx.move.flags.pulse) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	// Technician - Boost moves with 60 BP or less
	'technician': (ctx, basePower) => {
		if (basePower <= 60 && basePower > 0) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	// Sheer Force - Boost moves with secondary effects
	'sheerforce': (ctx, basePower) => {
		if (ctx.move.secondary || ctx.move.secondaries) {
			return Math.floor(basePower * 1.3);
		}
		return basePower;
	},

	// Reckless - Boost recoil moves
	'reckless': (ctx, basePower) => {
		if (ctx.move.recoil || ctx.move.hasCrashDamage) {
			return Math.floor(basePower * 1.2);
		}
		return basePower;
	},

	// Tough Claws - Boost contact moves
	'toughclaws': (ctx, basePower) => {
		if (ctx.move.flags.contact) {
			return Math.floor(basePower * 1.3);
		}
		return basePower;
	},

	// Adaptability - Boost STAB moves even more
	'adaptability': (ctx, basePower) => {
		const species = Dex.species.get(ctx.attacker.species);
		if (species.types.includes(ctx.move.type)) {
			// This would be applied differently - it's a STAB modifier
			// For power calculation, return basePower unchanged
			// The STAB multiplier changes from 1.5 to 2.0
		}
		return basePower;
	},

	// Rivalry - Boost/reduce based on gender
	'rivalry': (ctx, basePower) => {
		// Would need gender comparison logic
		return basePower;
	},

	// Sand Force - Boost Rock/Ground/Steel in sandstorm
	'sandforce': (ctx, basePower) => {
		if (ctx.battle.weather?.type === 'sand' && 
		    ['Rock', 'Ground', 'Steel'].includes(ctx.move.type)) {
			return Math.floor(basePower * 1.3);
		}
		return basePower;
	},

	// Analytic - Boost if moving last
	'analytic': (ctx, basePower) => {
		// Would need turn order logic
		return basePower;
	},

	// Blaze - Boost Fire moves when HP is low
	'blaze': (ctx, basePower) => {
		if (ctx.move.type === 'Fire' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	// Torrent - Boost Water moves when HP is low
	'torrent': (ctx, basePower) => {
		if (ctx.move.type === 'Water' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	// Overgrow - Boost Grass moves when HP is low
	'overgrow': (ctx, basePower) => {
		if (ctx.move.type === 'Grass' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},

	// Swarm - Boost Bug moves when HP is low
	'swarm': (ctx, basePower) => {
		if (ctx.move.type === 'Bug' && ctx.attacker.hp <= ctx.attacker.maxHp / 3) {
			return Math.floor(basePower * 1.5);
		}
		return basePower;
	},
};

/**
 * TYPE MODIFIER ABILITIES
 * These abilities change the type of moves
 */

export const TYPE_MODIFIER_ABILITIES: Record<string, AbilityTypeModifierHandler> = {
	// Normalize - All moves become Normal-type
	'normalize': (ctx, moveType) => {
		if (ctx.move.category !== 'Status') {
			return 'Normal';
		}
		return moveType;
	},

	// Pixilate - Normal moves become Fairy
	'pixilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			return 'Fairy';
		}
		return moveType;
	},

	// Refrigerate - Normal moves become Ice
	'refrigerate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			return 'Ice';
		}
		return moveType;
	},

	// Aerilate - Normal moves become Flying
	'aerilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			return 'Flying';
		}
		return moveType;
	},

	// Galvanize - Normal moves become Electric
	'galvanize': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			return 'Electric';
		}
		return moveType;
	},
};

/**
 * ITEM INTERACTION ABILITIES
 */

export const ITEM_INTERACTION_ABILITIES = {
	// Sticky Hold - Prevents item removal
	'stickyhold': {
		preventsItemRemoval: true,
	},

	// Unburden - Speed doubles when item is consumed
	'unburden': {
		onItemRemove: true,
	},

	// Klutz - Can't use held items
	'klutz': {
		preventsItemUse: true,
	},
};

/**
 * STAT MODIFIER ABILITIES
 * These abilities modify stats in various ways
 */

export const STAT_MODIFIER_ABILITIES: Record<string, AbilityStatModifierHandler> = {
	// Huge Power / Pure Power - Doubles Attack
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

	// Guts - Attack boost when statused
	'guts': (pokemon, stat, value) => {
		if (stat === 'atk' && pokemon.status) {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	// Marvel Scale - Defense boost when statused
	'marvelscale': (pokemon, stat, value) => {
		if (stat === 'def' && pokemon.status) {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	// Quick Feet - Speed boost when statused
	'quickfeet': (pokemon, stat, value) => {
		if (stat === 'spe' && pokemon.status) {
			return Math.floor(value * 1.5);
		}
		return value;
	},

	// Slow Start - Attack and Speed halved
	'slowstart': (pokemon, stat, value) => {
		if (stat === 'atk' || stat === 'spe') {
			// Would need turn counter to implement properly
			return Math.floor(value * 0.5);
		}
		return value;
	},
};

/**
 * SECONDARY EFFECT MODIFIERS
 */

export function applySereneGrace(ctx: AbilityContext, chance: number): number {
	const ability = toID(ctx.attacker.ability || '');
	if (ability === 'serenegrace') {
		return Math.min(100, chance * 2);
	}
	return chance;
}

/**
 * Main ability application functions
 */

export function checkAbilityImmunity(ctx: AbilityContext): { immune: boolean; message?: string } | null {
	const ability = toID(ctx.defender.ability || '');
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
		return handler(ctx, basePower);
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

export function applyAbilityStatModifier(pokemon: RPGPokemon, stat: string, value: number): number {
	const ability = toID(pokemon.ability || '');
	const handler = STAT_MODIFIER_ABILITIES[ability];
	if (handler) {
		return handler(pokemon, stat, value);
	}
	return value;
}

/**
 * Get STAB multiplier (modified by Adaptability)
 */
export function getSTABMultiplier(pokemon: RPGPokemon, moveType: string): number {
	const species = Dex.species.get(pokemon.species);
	if (!species.types.includes(moveType)) {
		return 1;
	}
	
	const ability = toID(pokemon.ability || '');
	if (ability === 'adaptability') {
		return 2.0;
	}
	
	return 1.5;
}

/**
 * Check if ability prevents status conditions
 */
export function preventsStatus(pokemon: RPGPokemon, status: string): boolean {
	const ability = toID(pokemon.ability || '');
	
	// Immunity - Prevents poison
	if (ability === 'immunity' && (status === 'psn' || status === 'tox')) {
		return true;
	}
	
	// Water Veil - Prevents burn
	if (ability === 'waterveil' && status === 'brn') {
		return true;
	}
	
	// Limber - Prevents paralysis
	if (ability === 'limber' && status === 'par') {
		return true;
	}
	
	// Insomnia / Vital Spirit - Prevents sleep
	if ((ability === 'insomnia' || ability === 'vitalspirit') && status === 'slp') {
		return true;
	}
	
	// Magma Armor - Prevents freeze
	if (ability === 'magmaarmor' && status === 'frz') {
		return true;
	}
	
	// Leaf Guard - Prevents status in sun
	// Would need weather check
	
	return false;
}

/**
 * Export all ability handlers
 */
export const RPGAbilities = {
	checkImmunity: checkAbilityImmunity,
	applyPowerModifier: applyAbilityPowerModifier,
	applyTypeModifier: applyAbilityTypeModifier,
	applyStatModifier: applyAbilityStatModifier,
	checkItemRemovalPrevention,
	getSTABMultiplier,
	preventsStatus,
	applySereneGrace,
	isGrounded,
};

export default RPGAbilities;
