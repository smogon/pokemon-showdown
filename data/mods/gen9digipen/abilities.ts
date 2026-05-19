// DigiPen custom ability definitions.
//
// HOW TO ADD CONTENT:
//
// ── Custom Abilities ─────────────────────────────────────────────────────────
// New DigiPen abilities MUST include `isNonstandard: "DigiPen"` so they are
// treated as illegal outside DigiPen formats.
//
// ── Overriding Existing Abilities ────────────────────────────────────────────
// Use `inherit: true` to patch an existing ability without replacing it
// entirely. Only the fields you specify will differ in DigiPen formats.

export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	
	// ── DigiPen Custom Abilities ─────────────────────────────────────────────────────────
	procrastinator: {
		isNonstandard: "DigiPen",
		onStart(pokemon) {
			pokemon.removeVolatile('procrastinator');
		},
		onResidual(pokemon) {
			if (pokemon.removeVolatile('procrastinator')) {
				if (pokemon.status && pokemon.status !== 'slp') {
					this.debug('procrastinator');
					this.add('-activate', pokemon, 'ability: Procrastinator');
					pokemon.cureStatus();
				}
				this.heal(pokemon.baseMaxhp / 4);
			}
			else {
				pokemon.addVolatile('procrastinator');
			}
		},
		flags: {},
		name: "Procrastinator",
		rating: 4,
		num: 2058,
		shortDesc: "Every other turn: can't attack, heals 1/4 HP, cures non-sleep status conditions.",
		desc: "Every other turn, this Pokemon cannot use attacking moves. At the end of every other turn, \
			this Pokemon restores 1/4 of its max HP and has its non-volatile status conditions except for sleep \
			cured. If another Pokemon has the Pressure ability, this Pokemon's moves consume 3 PP instead.",
		contributors: ["Logan C."],
	},

	// ---- CAP Abilities -------------------------------------------------------------
	mountaineer: { // Need to 
		inherit: true,
		isNonstandard: "DigiPen",
	},
	
	// ── Ability Changes/Buffs ────────────────────────────────────────────────────
	angerpoint: {
		inherit: true,
		modified: "DigiPen",
		onSourceModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		shortDesc: "If this Pokemon takes a critical hit, +12 Attack. Opponents critical hit more often.",
		desc: "If this Pokemon, but not its substitute, is struck by a critical hit, its Attack is raised by 12 stages. Attacks used against this Pokemon are 12.5% more likely to be a critical hit.",
		contributors: ["Bryce G."],
	},

	// ── Champions "Leaked" Abilities ─────────────────────────────────────────────────────────
	nightmares: {
		isNonstandard: "DigiPen",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					this.add('-anim', pokemon, 'Nightmare', target);
					this.add('-message', `The opposing ${target.name} is tormented!`);
					this.damage(target.baseMaxhp / 4, target, pokemon);
				}
			}
		},
		flags: {},
		name: "Nightmares",
		rating: 2,
		num: 3001,
		shortDesc: "Causes sleeping foes to lose 1/4 of their max HP at the end of each turn.",
		desc: "Causes opposing Pokemon to lose 1/4 of their maximum HP, rounded down, at the end of each turn if they are asleep.",

	},
	thermalboost: {
		isNonstandard: "DigiPen",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Thermal Boost boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Thermal Boost boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Thermal Boost",
		rating: 3.5,
		num: 3002,
		shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Fire-type attack.",
	},	
};
