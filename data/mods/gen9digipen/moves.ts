// isNonstandard: "DigiPen" means the move is only legal in DigiPen formats.
//
// modified: "DigiPen" means the move has been modified (balanced) for DigiPen formats. This is used to highlight
// it in the Pokedex. Use for moves on the Updates/Changes section of the DigiPen Spreadsheet.
// 
// `shortDesc` field is displayed in Teambuilder and should be under 100 characters.
//
// `desc` field is displayed in the Pokedex. This field is optional if a longer description
// not needed, and will default to the `shortDesc` field if omitted.
//
// (See data/text/moves.ts for examples of desc and shortDesc fields.)
//
// `contributors` field is an optional field used to credit the person/people who contributed to the move

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	/* ----- DigiPen Custom Moves ───────────────────────────────────────────── */
	// Use ordering from DigiPen Spreadsheet
	
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
				let duration = 5;
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
					duration = 7;
				}
				if (source?.hasItem('blueprint')) {
					this.add('-activate', source, 'item: Blueprint', '[move] Trick Room');
					duration = 8;
				}
				return duration;
			},
			onFieldStart(target, source) {
				if (source?.hasItem('blueprint')) {
					this.add('-fieldstart', 'move: Inverse Room', `[of] ${source}`, '[blueprint]', '[silent]');
				}
				else if(source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Inverse Room', `[of] ${source}`, '[persistent]', '[silent]');
				} 
				else {
					this.add('-fieldstart', 'move: Inverse Room', `[of] ${source}`, '[silent]');
				}
				this.add('-message', 'It created a bizarre area in which all type matchups are reversed!');
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('inverseroom');
			},
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
		shortDesc: "User -2 Evasion. Paralyzes and confuses the target.",
		desc: "Lower's the user's Evasion by 2 stages. Paralyzes and confuses the target. If the target has the Pressure ability, this move's accuracy is 80% and it deals 10x damage",
		target: "normal",
		type: "Normal",
		contestType: "Clever",
		contributors: ["Logan C."]
	},
	actualize: {
		num: 1004,
		isNonstandard: "DigiPen",
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Actualize",
		pp: 5,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTry(source) {
			if (source.volatiles['actualize']) {
				this.hint("Actualize cannot be used on consecutive turns.");
				return false;
			}
		},
		onPrepareHit(target, source, move) {
			source.addVolatile('actualize');
			this.add('-anim', source, 'Trick-or-Treat', target);
			this.attrLastMove('[anim] Trick-or-Treat');
		},
		// Need to playtest with Tera and added types.
		onHit(target, source) {
			let targetTypes = [...target.getTypes(true)]
			let sourceTypes = [...source.getTypes(true)]
			if (sourceTypes.length > 1) {
				if (sourceTypes[1] === targetTypes[1] || targetTypes[1] === sourceTypes[0]) {
					return
				}
				targetTypes[1] = sourceTypes[1];
			}
			else {
				if (targetTypes.length <= 1) return;
				targetTypes.splice(1, 1);
			}
			if (!target.setType(targetTypes)) return;
			this.add('-start', target, 'typechange', targetTypes.join('/'), '[from] move: Actualize', `[of] ${source}`);
		},
		condition: {
			noCopy: true,
			duration: 2,
		},
		target: "normal",
		type: "???",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
		shortDesc: "Changes the target's secondary type to the user's.",
		desc: "Changes the target's secondary type to the user's secondary type. Fails if the target is Arceus or Silvally, if the target's secondary type is the same as the user's secondary type, if the user and target both have no secondary type, if the target's primary type is the same as the user's secondary type, or if the target is Terastallized. If the user has no secondary type, the target's secondary type is removed. This move fails if used on consecutive turns.",
		contributors: ["Joshua C."],
	},
	wordclay: {
		num: 1005,
		isNonstandard: "DigiPen",
		accuracy: 95,
		basePower: 75,
		category: "Special",
		name: "Word Clay",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		target: "normal",
		type: "Ground",
		contestType: "Clever",
		beforeMoveCallback(pokemon, target, move) {
			const moveSlot = pokemon.getMoveData(move);
			if (moveSlot && moveSlot.pp === moveSlot.maxpp) {
				move.willCrit = true;
			}
		},
		shortDesc: "Always results in a critical hit if max PP.",
		desc: "Always results in a critical hit if this move has maximum PP unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.",
		contributors: ["Aiden C."],
	},
	damocles: {
		num: 1006,
		isNonstandard: "DigiPen",
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Damocles",
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

	/* ----- Update/changed Moves ───────────────────────────────────────────── */
	// Use ordering from DigiPen Spreadsheet
	// Don't forget to add the modified: "DigiPen" flag to the move

	scald: {
		inherit: true,
		modified: "DigiPen",
		basePower: 65,
		contributors: ["Bryce G."],
	},
	knockoff: {
		inherit: true,
		modified: "DigiPen",
		basePower: 60,
		contributors: ["Bryce G."],
	},
	rockthrow: {
		inherit: true,
		modified: "DigiPen",
		onHitField(target, source) {
			if (source.side.foe.sideConditions['stealthrock']) return;
			if (source.side.removeSideCondition('stealthrock')) {
				source.side.foe.addSideCondition('stealthrock');
				this.add('-activate', source, 'move: Rock Throw');
			}
		},
		shortDesc: "Transfers Stealth Rock from the user's to the foe's side if the foe does not have it.",
		contributors: ["Bryce G."],
	},
	rocksmash: {
		inherit: true,
		modified: "DigiPen",
		basePower: 50,
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce && pokemon.side.removeSideCondition('stealthrock')) {
				this.add('-sideend', pokemon.side, 'Stealth Rock', '[from] move: Rocksmash', `[of] ${pokemon}`);
			}
		},
		desc: "If this move is successful and the user has not fainted, stealth rock is removed from the user's side of the field. Has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "Clears Stealth Rock; target: 50% chance -1 Defense.",
		contributors: ["Bryce G."],
	},
	mist: { // Also implementing the logic for Ancient Sundial
		inherit: true,
		modified: "DigiPen",
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-activate', source, 'item: Ancient Sundial', '[move] Mist');
					return 8;
				}
				return 5;
			},
			onSideStart(field, source) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-fieldstart', 'move: Mist', '[ancientsundial]');
				}
				else {
					this.add('-fieldstart', 'move: Mist');
				}
			},
			onTryBoost(boost, target, source, effect) {
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if ((source && target !== source) || (effect.effectType === 'Move' && effect.category === 'Status')) {
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries) {
						this.add('-activate', target, 'move: Mist');
					}
				}
			},
			onCriticalHit: false,
			onModifySecondaries(secondaries) {
				this.debug('Mist prevents secondary effects');
				return secondaries.filter(effect => !!effect.self);
			},	
		},
		shortDesc: "5 turns: no stat drops, crits, and secondary effects.",
		desc: "For 5 turns, the user and its party members are protected from having \
			their stat stages lowered by other Pokemon or by their own status moves, \
			cannot be struck by critical hits, and are not affected by the secondary \
			effects of other Pokemon's moves. Fails if the effect is already active on \
			the user's side.",
		contributors: ["Bryce G."],
	},
	luckychant: { // Also implementing the logic for Ancient Sundial; not sure how to do alternate abilities effect
		inherit: true,
		modified: "DigiPen",
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('ancientsundial')) {
					return 8;
				}
				return 5;
			},
			onSideStart(field, source) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-fieldstart', 'move: Lucky Chant', '[ancientsundial]');
				}
				else {
					this.add('-fieldstart', 'move: Lucky Chant');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + 1;
			},
		},
		shortDesc: "5-turns: party immune to crits, crit more often.",
		desc: "For 5 turns, the user and its party members cannot be struck by a critical hit and have their critical hit ratio increased by 1. Fails if the effect is already active on the user's side.",
		contributors: ["Bryce G."],
	},

	/* ----- Other changes ───────────────────────────────────────────── */
	// Moves changes not related to balance changes but rather for implementing some other change
	// Use alphabetical ordering
	// Do NOT add the modified: "DigiPen" flag to these moves

	gravity: { // Implementing the logic for Ancient Sundial
		inherit: true,
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-activate', source, 'item: Ancient Sundial', '[move] Gravity');
					return 8;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-fieldstart', 'move: Gravity', '[ancientsundial]');
				}
				else if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Gravity', '[persistent]');
				} 
				else {
					this.add('-fieldstart', 'move: Gravity');
				}
				for (const pokemon of this.getAllActive()) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
		},
	},
	magicroom: { // Implementing the logic for Blueprint
		inherit: true,
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('blueprint')) {
					this.add('-activate', source, 'item: Blueprint', '[move] Magic Room');
					return 8;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Magic Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasItem('blueprint')) {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`, '[blueprint]');
				}
				else if(source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`, '[persistent]');
				} 
				else {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`);
				}
				for (const mon of this.getAllActive()) {
					this.singleEvent('End', mon.getItem(), mon.itemState, mon);
				}
			},
		},
	},
	mudsport: { // Implementing the logic for Ancient Sundial
		inherit: true,
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-activate', source, 'item: Ancient Sundial', '[move] Mud Sport');
					return 8;
				}
				return 5;
			},
			onFieldStart(field, source) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-fieldstart', 'move: Mud Sport', '[ancientsundial]');
				}
				else {
					this.add('-fieldstart', 'move: Mud Sport');
				}
			},
		},
	},
	trickroom: { // Implementing the logic for Blueprint
		inherit: true,
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('blueprint')) {
					this.add('-activate', source, 'item: Blueprint', '[move] Trick Room');
					return 8;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasItem('blueprint')) {
					this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`, '[blueprint]');
				}
				else if(source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`, '[persistent]');
				} 
				else {
					this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`);
				}
			},
		},
	},
	waterport: { // Implementing the logic for Ancient Sundial
		inherit: true,
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-activate', source, 'item: Ancient Sundial', '[move] Water Sport');
					return 8;
				}
				return 5;
			},
			onFieldStart(field, source) {
				if (source?.hasItem('ancientsundial')) {
					this.add('-fieldstart', 'move: Water Sport', '[ancientsundial]');
				}
				else {
					this.add('-fieldstart', 'move: Water Sport');
				}
			},
		},
	},
	wonderroom: { // Implementing the logic for Blueprint
		inherit: true,
		condition: {
			inherit: true,
			durationCallback(source, effect) {
				if (source?.hasItem('blueprint')) {
					this.add('-activate', source, 'item: Blueprint', '[move] Wonder Room');
					return 8;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Wonder Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(field, source) {
				if (source?.hasItem('blueprint')) {
					this.add('-fieldstart', 'move: Wonder Room', `[of] ${source}`, '[blueprint]');
				}
				else if(source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Wonder Room', `[of] ${source}`, '[persistent]');
				} 
				else {
					this.add('-fieldstart', 'move: Wonder Room', `[of] ${source}`);
				}
			},
		},
	},
};
