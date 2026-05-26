// DigiPen custom ability definitions.
//
// HOW TO ADD CONTENT:
//
// ── Custom Abilities ─────────────────────────────────────────────────────────
// New DigiPen abilities should include `isNonstandard: "DigiPen"` so they are
// treated as illegal outside DigiPen formats and flagged as DigiPen in the Pokedex.
//
// ── Changing Existing Abilities ────────────────────────────────────────────
// Use `inherit: true` to patch an existing ability without replacing it
// entirely. Only the fields you specify will differ in DigiPen formats. Add
// the `modified: true` flag to indicate that the ability has been modified for
// highlighting in the Pokedex
//
// ── Other Notes ────────────────────────────────────────────
//// `shortDesc` field is displayed in Teambuilder and should be under 100 characters.
//
// `desc` field is displayed in the Pokedex. This field is optional if a longer description
// not needed, and will default to the `shortDesc` field if omitted.
//
// (See data/text/abilities.ts for examples of desc and shortDesc fields.)
//
// `contributors` field is an optional field used to credit the person/people who contributed to the ability


export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	
	// ── DigiPen Custom Abilities ─────────────────────────────────────────────────────────
	procrastinator: { // Needs playtesting around how it interacts with Pressure Pokemon switching in/out
		isNonstandard: "DigiPen",
		onStart(pokemon) {
			pokemon.removeVolatile('procrastinator');
		},			
		onTryMove(pokemon, target, move) {
			if (move.id === 'struggle') return;
			const pokemonOnBattlefield = [...pokemon.allies(), ...pokemon.foes()];
			for (const otherPokemon of pokemonOnBattlefield) {
				if (otherPokemon.hasAbility('Pressure')) {
					pokemon.deductPP(move.id, 3);
					return;
				}
			}
		},
		onResidual(pokemon) {
			const pokemonOnBattlefield = [...pokemon.allies(), ...pokemon.foes()];
			for (const otherPokemon of pokemonOnBattlefield) {
				if (otherPokemon.hasAbility('Pressure')) {
					pokemon.removeVolatile('procrastinator');
					return;
				}
			}
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
	selfalteryzation: {
		isNonstandard: "DigiPen",
		onSwitchInPriority: 2,
		onSwitchIn(source) {
			let sourceTypes = [...source.getTypes(true)]
			let moves = source.getMoves();
			let randomMove = this.sample(moves);
			let type = this.dex.moves.get(randomMove.id).type;
			if (type) {
				if (sourceTypes[0] !== type) {
					sourceTypes[1] = type;
				}
				if (!source.setType(sourceTypes)) return;
				this.add('-start', source, 'typechange', sourceTypes.join('/'), '[from] ability: Self-Alteryzation');
			}
		},
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			let sourceTypes = [...source.getTypes(true)]
			if (type && sourceTypes[1] !== type) {
				if (sourceTypes[0] !== type) {
					sourceTypes[1] = type;
				}
				if (!source.setType(sourceTypes)) return;
				this.add('-start', source, 'typechange', sourceTypes.join('/'), '[from] ability: Self-Alteryzation');
			}
		},
		flags: {},
		name: "Self-Alteryzation",
		rating: 4.5,
		num: 2059,
		shortDesc: "This Pokemon's secondary type changes to the type of a move it knows on switch-in and before using.",
		desc: "This Pokemon's secondary type changes to the type of a random move it knows on switch-in. This Pokemon's secondary type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type. This effect fails if the this Pokemon is Terastallized."
	},
	snarky: {
		isNonstandard: "DigiPen",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Psychic';
			}
		},
		flags: {},
		name: "Snarky",
		rating: 1.5,
		num: 2060,
		desc: "This Pokemon's sound-based moves become Psychic-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Psychic type.",
	},
	venomabsorb: {
		isNonstandard: "DigiPen",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Poison') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Venom Absorb');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Venom Absorb",
		rating: 3.5,
		num: 2086,
		desc: "This Pokemon is immune to Poison-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Poison-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Poison moves; Poison immunity.",
	},

	// ---- CAP Abilities -------------------------------------------------------------
	// Any CAP abilities on DigiPen Pokemon need to be overriden as `isNonstandard: "DigiPen"` so they are
	// legal in DigiPen formats.
	mountaineer: { 
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

	/* ----- Other changes ───────────────────────────────────────────── */
	// Ability changes not related to balance changes but rather needed to implement new features
};
