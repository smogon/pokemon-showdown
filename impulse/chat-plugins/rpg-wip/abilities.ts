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
		if (ctx.move.category === 'Status') {
			return null; // Status moves bypass Wonder Guard
		}
		
		// Calculate effectiveness to check if move is super-effective
		const defenderSpecies = Dex.species.get(ctx.defender.species);
		let effectiveness = 1;
		
		// Get type chart for the move
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
			for (const defenderType of defenderSpecies.types) {
				if (chartEntry.superEffective.includes(defenderType)) {
					effectiveness *= 2;
				} else if (chartEntry.notVeryEffective.includes(defenderType)) {
					effectiveness *= 0.5;
				} else if (chartEntry.noEffect.includes(defenderType)) {
					effectiveness *= 0;
				}
			}
		}
		
		// Wonder Guard: Only super-effective moves hit
		if (effectiveness <= 1) {
			return {
				immune: true,
				message: `${ctx.defender.species}'s Wonder Guard protected it!`
			};
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

	// Sheer Force - Boost moves with secondary effects (and removes them)
	'sheerforce': (ctx, basePower) => {
		if (ctx.move.secondary || ctx.move.secondaries) {
			// Power boost is applied here
			// Secondary effect removal is handled in the move execution code
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

	// Pixilate - Normal moves become Fairy (with 1.2x boost)
	'pixilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			// Mark that conversion happened for power boost
			(ctx.move as any).typeConversionBoost = true;
			return 'Fairy';
		}
		return moveType;
	},

	// Refrigerate - Normal moves become Ice (with 1.2x boost)
	'refrigerate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
			return 'Ice';
		}
		return moveType;
	},

	// Aerilate - Normal moves become Flying (with 1.2x boost)
	'aerilate': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
			return 'Flying';
		}
		return moveType;
	},

	// Galvanize - Normal moves become Electric (with 1.2x boost)
	'galvanize': (ctx, moveType) => {
		if (moveType === 'Normal' && ctx.move.category !== 'Status') {
			(ctx.move as any).typeConversionBoost = true;
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
 * WEATHER ABILITIES
 * Abilities that modify or are affected by weather
 */

export const WEATHER_ABILITIES = {
	// Drought - Sets harsh sunlight on switch-in
	'drought': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.weather = { type: 'sun', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Drought intensified the sun!`);
		},
	},
	
	// Drizzle - Sets rain on switch-in
	'drizzle': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.weather = { type: 'rain', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Drizzle caused a downpour!`);
		},
	},
	
	// Sand Stream - Sets sandstorm on switch-in
	'sandstream': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.weather = { type: 'sand', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Sand Stream whipped up a sandstorm!`);
		},
	},
	
	// Snow Warning - Sets hail on switch-in
	'snowwarning': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.weather = { type: 'hail', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Snow Warning created a hailstorm!`);
		},
	},
	
	// Cloud Nine / Air Lock - Suppresses weather effects
	'cloudnine': {
		suppressWeather: true,
	},
	'airlock': {
		suppressWeather: true,
	},
	
	// Solar Power - Boosts Sp. Atk in sun but takes damage
	'solarpower': {
		modifiesSpAtk: true,
		weatherDamage: 'sun',
	},
	
	// Rain Dish - Heals in rain
	'raindish': {
		weatherHeal: 'rain',
	},
	
	// Ice Body - Heals in hail
	'icebody': {
		weatherHeal: 'hail',
	},
};

/**
 * CONTACT ABILITIES
 * Abilities that trigger on contact moves
 */

export const CONTACT_ABILITIES = {
	// Static - May paralyze on contact
	'static': {
		onContactChance: 0.3,
		effect: 'par',
	},
	
	// Flame Body - May burn on contact
	'flamebody': {
		onContactChance: 0.3,
		effect: 'brn',
	},
	
	// Poison Point - May poison on contact
	'poisonpoint': {
		onContactChance: 0.3,
		effect: 'psn',
	},
	
	// Effect Spore - May cause status on contact
	'effectspore': {
		onContactChance: 0.3,
		effects: ['psn', 'par', 'slp'],
	},
	
	// Cute Charm - May infatuate on contact
	'cutecharm': {
		onContactChance: 0.3,
		effect: 'infatuate',
	},
	
	// Rough Skin - Damages attacker on contact
	'roughskin': {
		onContactDamage: 1/8,
	},
	
	// Iron Barbs - Damages attacker on contact
	'ironbarbs': {
		onContactDamage: 1/8,
	},
};

/**
 * PRIORITY ABILITIES
 * Abilities that affect move priority
 */

export const PRIORITY_ABILITIES = {
	// Prankster - Gives +1 priority to status moves
	'prankster': {
		modifyPriority: (move: Move) => {
			if (move.category === 'Status') {
				return 1;
			}
			return 0;
		},
	},
	
	// Gale Wings - Gives +1 priority to Flying moves at full HP
	'galewings': {
		modifyPriority: (move: Move, pokemon: RPGPokemon) => {
			if (move.type === 'Flying' && pokemon.hp === pokemon.maxHp) {
				return 1;
			}
			return 0;
		},
	},
};

/**
 * ACCURACY/EVASION ABILITIES
 */

export const ACCURACY_EVASION_ABILITIES = {
	// Compound Eyes - Boosts accuracy
	'compoundeyes': {
		accuracyMultiplier: 1.3,
	},
	
	// Hustle - Boosts Attack but lowers accuracy
	'hustle': {
		accuracyMultiplier: 0.8,
		attackMultiplier: 1.5,
	},
	
	// Tangled Feet - Boosts evasion when confused
	'tangledfeet': {
		evasionBoost: true,
	},
	
	// Sand Veil - Boosts evasion in sandstorm
	'sandveil': {
		weatherEvasion: 'sand',
	},
	
	// Snow Cloak - Boosts evasion in hail
	'snowcloak': {
		weatherEvasion: 'hail',
	},
};

/**
 * RECOIL/DRAIN ABILITIES
 */

export const RECOIL_DRAIN_ABILITIES = {
	// Rock Head - Prevents recoil damage
	'rockhead': {
		preventsRecoil: true,
	},
	
	// Magic Guard - Prevents indirect damage
	'magicguard': {
		preventsIndirectDamage: true,
	},
};

/**
 * FORM CHANGE ABILITIES
 */

export const FORM_CHANGE_ABILITIES = {
	// Stance Change - Changes form based on move used
	'stancechange': {
		formChange: true,
	},
	
	// Schooling - Changes form based on HP
	'schooling': {
		hpFormChange: true,
	},
	
	// Shields Down - Changes form based on HP
	'shieldsdown': {
		hpFormChange: true,
	},
};

/**
 * MULTI-HIT ABILITIES
 */

export const MULTI_HIT_ABILITIES = {
	// Skill Link - Multi-hit moves always hit maximum times
	'skilllink': {
		maxHits: true,
	},
	
	// Parental Bond - Attacks twice
	'parentalbond': {
		attackTwice: true,
	},
};

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
		basePower = handler(ctx, basePower);
	}
	
	// Apply 1.2x boost for type-conversion abilities
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
 * CRITICAL HIT ABILITIES
 */

export const CRITICAL_HIT_ABILITIES = {
	// Super Luck - Boosts critical hit ratio
	'superluck': {
		critBoost: 1,
	},
	
	// Sniper - Boosts critical hit damage
	'sniper': {
		critDamageMultiplier: 1.5, // Total becomes 2.25x instead of 1.5x
	},
};

/**
 * TERRAIN ABILITIES
 */

export const TERRAIN_ABILITIES = {
	// Electric Surge - Sets Electric Terrain
	'electricsurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.terrain = { type: 'electric', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Electric Surge electrified the field!`);
		},
	},
	
	// Grassy Surge - Sets Grassy Terrain
	'grassysurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.terrain = { type: 'grassy', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Grassy Surge created grassy terrain!`);
		},
	},
	
	// Misty Surge - Sets Misty Terrain
	'mistysurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.terrain = { type: 'misty', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Misty Surge created misty terrain!`);
		},
	},
	
	// Psychic Surge - Sets Psychic Terrain
	'psychicsurge': {
		onSwitchIn: (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => {
			battle.terrain = { type: 'psychic', turns: 5 };
			messageLog.push(`${slot.pokemon.species}'s Psychic Surge created psychic terrain!`);
		},
	},
	
	// Surge Surfer - Doubles speed in Electric Terrain
	'surgesurfer': {
		terrainSpeedBoost: 'electric',
	},
};

/**
 * HEALING ABILITIES
 */

export const HEALING_ABILITIES = {
	// Regenerator - Heals 1/3 HP on switch-out
	'regenerator': {
		onSwitchOut: 1/3,
	},
	
	// Natural Cure - Heals status on switch-out
	'naturalcure': {
		healStatusOnSwitch: true,
	},
};

/**
 * SPEED MODIFIER ABILITIES
 */

export function applySpeedModifier(pokemon: RPGPokemon, battle: BattleState, speed: number): number {
	const ability = toID(pokemon.ability || '');
	
	// Swift Swim - Doubles speed in rain
	if (ability === 'swiftswim' && battle.weather?.type === 'rain') {
		return speed * 2;
	}
	
	// Chlorophyll - Doubles speed in sun
	if (ability === 'chlorophyll' && battle.weather?.type === 'sun') {
		return speed * 2;
	}
	
	// Sand Rush - Doubles speed in sandstorm
	if (ability === 'sandrush' && battle.weather?.type === 'sand') {
		return speed * 2;
	}
	
	// Slush Rush - Doubles speed in hail
	if (ability === 'slushrush' && battle.weather?.type === 'hail') {
		return speed * 2;
	}
	
	// Surge Surfer - Doubles speed in Electric Terrain
	if (ability === 'surgesurfer' && battle.terrain?.type === 'electric' && isGrounded(pokemon, battle)) {
		return speed * 2;
	}
	
	// Unburden - Doubles speed when item is lost
	// Would need to track if item was consumed
	
	return speed;
}

/**
 * DAMAGE MODIFYING ABILITIES
 * Apply these after base damage calculation
 */

export function applyDamageModifier(ctx: AbilityContext, damage: number): number {
	const attackerAbility = toID(ctx.attacker.ability || '');
	const defenderAbility = toID(ctx.defender.ability || '');
	
	// Sniper - Boosts critical hit damage
	// Would need to know if it's a critical hit
	
	// Tinted Lens - Makes not very effective moves deal neutral damage
	if (attackerAbility === 'tintedlens') {
		// Would need effectiveness calculation
	}
	
	// Solid Rock / Filter - Reduces super-effective damage
	if ((defenderAbility === 'solidrock' || defenderAbility === 'filter')) {
		// Would need effectiveness > 1 check
		// damage = Math.floor(damage * 0.75);
	}
	
	// Multiscale / Shadow Shield - Reduces damage at full HP
	if ((defenderAbility === 'multiscale' || defenderAbility === 'shadowshield') && 
	    ctx.defender.hp === ctx.defender.maxHp) {
		damage = Math.floor(damage * 0.5);
	}
	
	// Fur Coat - Halves physical damage
	if (defenderAbility === 'furcoat' && ctx.move.category === 'Physical') {
		damage = Math.floor(damage * 0.5);
	}
	
	// Punk Rock - Boosts sound moves and reduces sound damage taken
	if (attackerAbility === 'punkrock' && ctx.move.flags.sound) {
		damage = Math.floor(damage * 1.3);
	}
	if (defenderAbility === 'punkrock' && ctx.move.flags.sound) {
		damage = Math.floor(damage * 0.5);
	}
	
	return damage;
}

/**
 * Check if secondary effects should be applied
 * Sheer Force removes secondary effects
 */
export function shouldApplySecondaryEffects(attacker: RPGPokemon, move: Move): boolean {
	const ability = toID(attacker.ability || '');
	if (ability === 'sheerforce' && (move.secondary || move.secondaries)) {
		return false; // Sheer Force removes secondary effects
	}
	return true;
}

/**
 * Check if ability prevents a specific move
 */
export function preventMove(ctx: AbilityContext): { prevented: boolean; message?: string } | null {
	const defenderAbility = toID(ctx.defender.ability || '');
	
	// Dazzling / Queenly Majesty - Prevents priority moves
	if ((defenderAbility === 'dazzling' || defenderAbility === 'queenlymajesty') && 
	    ctx.move.priority && ctx.move.priority > 0) {
		return {
			prevented: true,
			message: `${ctx.defender.species}'s ${ctx.defender.ability} prevents ${ctx.move.name}!`
		};
	}
	
	// Good as Gold - Prevents status moves
	if (defenderAbility === 'goodasgold' && ctx.move.category === 'Status') {
		return {
			prevented: true,
			message: `${ctx.defender.species}'s Good as Gold prevents ${ctx.move.name}!`
		};
	}
	
	return null;
}

/**
 * Get all implemented abilities
 */
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
	];
}

/**
 * Get ability info from Dex
 */
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

/**
 * Export all ability handlers
 */
export const RPGAbilities = {
	// Core functions
	checkImmunity: checkAbilityImmunity,
	applyPowerModifier: applyAbilityPowerModifier,
	applyTypeModifier: applyAbilityTypeModifier,
	applyStatModifier: applyAbilityStatModifier,
	applySpeedModifier,
	applyDamageModifier,
	checkItemRemovalPrevention,
	getSTABMultiplier,
	preventsStatus,
	preventMove,
	applySereneGrace,
	isGrounded,
	
	// Utility functions
	getAllImplementedAbilities,
	getAbilityInfo,
	getAbilityData,
	shouldApplySecondaryEffects,
	
	// Ability databases
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
};

export default RPGAbilities;
