export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	/* ----- DigiPen Custom Moves ───────────────────────────────────────────── */
	inverseroom: {
		num: 1001,
		isNonstandard: "DigiPen",
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Inverse Room",
		pp: 5,
		priority: 0,
		flags: { mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Trick Room', target);
			this.attrLastMove('[anim] Trick Room');
		},
		pseudoWeather: 'inverseroom',
		shortDesc: 'For 5 turns, all type matchups are reversed.',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Inverse Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Inverse Room', `[of] ${source}`, '[persistent]', '[silent]');
				} else {
					this.add('-fieldstart', 'move: Inverse Room', `[of] ${source}`, '[silent]');
				}
				this.add('-message', 'It created a bizarre area in which all type matchups are reversed!');
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('inverseroom');
			},
			// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 1,
			onFieldEnd() {
				this.add('-fieldend', 'move: Inverse Room', '[silent]');
				this.add('-message', 'Inverse Room wore off, and all type matchups returned to normal!');
			},
			onNegateImmunity: false,
			onEffectivenessPriority: 1,
			onEffectiveness(typeMod, target, type, move) {
				// The effectiveness of Freeze Dry on Water isn't reverted
				if (move && move.id === 'freezedry' && type === 'Water') return;
				if (move && !this.dex.getImmunity(move, type)) return 1;
				// Ignore normal effectiveness, prevents bug with Tera Shell
				if (typeMod) return -typeMod;
			},
		},
		target: "all",
		type: "Fairy",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Clever",
		dexEntry: "Test dex entry",
		contributors: ["Jared G."]
	},
	starblazing: {
		num: 1002,
		isNonstandard: "DigiPen",
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Star Blazing",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Moonblast', target);
			this.attrLastMove('[anim] Moonblast');
		},
		secondary: {
			chance: 20,
			status: 'brn',
		},
		onBasePower(basePower, pokemon, target) {
			if (target.status || target.hasAbility('comatose')) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "20% burn chance. 1.5x power if target statused.",
		desc: "Has a 20% chance to burn the target. Power increases 50% if the target has a non-volatile status condition.",
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
		contributors: ["Jared G."]
	},
	overchoice: {
		num: 1003,
		isNonstandard: "DigiPen",
		accuracy: 90,
		basePower: 10,
		category: "Special",
		name: "Overchoice",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Supersonic', target);
			this.attrLastMove('[anim] Supersonic');
		},
		self: {
			boosts: {
				evasion: -2,
			},
		},
		onModifyMove(move, pokemon, target) {
			if (target?.hasAbility('pressure')) {
				move.accuracy = 80;
			}
		},
		basePowerCallback(pokemon, target, move) {
			if (target?.hasAbility('pressure')) return move.basePower * 10;
			return move.basePower;
		},
		secondary: {
			chance: 100,
			onHit(target, source) {
				target.addVolatile('confusion');
				target.trySetStatus('par', source);
			},		
		},
		shortDesc: "User -2 Evasion. Paralyzes and confuses the target. If target has Pressure, 80% accuracy and x10 damage.",
		desc: "Lower's the user's Evasion by 2 stages. Paralyzes and confuses the target. If the target has the Pressure ability, this move's accuracy is 80% and it deals 10x damage",
		target: "normal",
		type: "Normal",
		contestType: "Clever",
		contributors: ["Logan C."]
	},
	swordofdamocles: {
		num: 1006,
		isNonstandard: "DigiPen",
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sword of Damocles",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Swords Dance', source);
			this.attrLastMove('[anim] Swords Dance');
		},
		volatileStatus: "perishsong",
		condition: {
			duration: 4,
			onStart(pokemon) {
				if (!pokemon.volatiles['perishsong']) {
					pokemon.addVolatile('perishsong');
					this.add('-start', pokemon, 'perish3');
				}
			},
			onResidualOrder: 24,
			onResidual(pokemon) {
				const duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, `perish${duration}`);
			},
			onEnd(target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
		},
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
		},
		target: "self",
		type: "Steel",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
		shortDesc: "+1 all stats (not acc/ev). User faints in 3 turns.",
		desc: "Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage. \
			The user receives a perish count of 4 if it doesn't already have a perish count. At the end of each \
			turn including the turn used, the perish count of the user lowers by 1 and the user faints if the \
			number reaches 0. The perish count is removed from the user if it switches out. If the user uses \
			Baton Pass while it has a perish count, the replacement will gain the perish count and continue to \
			count down.",
		contributors: ["Jared G."],
	},

	/* ----- Modified Moves ───────────────────────────────────────────── */
	scald: {
		inherit: true,
		modified: "DigiPen",
		basePower: 65,
		contributors: ["Bryce G."],
	}
};
