/**
 * Gen 3 moves
 */

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	absorb: {
		inherit: true,
		pp: 20,
	},
	acid: {
		inherit: true,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
	},
	ancientpower: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	assist: {
		inherit: true,
		flags: { metronome: 1, noassist: 1, nosleeptalk: 1 },
	},
	astonish: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, minimize: 1 },
	},
	beatup: {
		inherit: true,
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('beatup');
			move.type = '???';
			move.category = 'Special';
			move.allies = pokemon.side.pokemon.filter(ally => !ally.fainted && !ally.status);
			move.multihit = move.allies.length;
		},
		condition: {
			duration: 1,
			onModifySpAPriority: -101,
			onModifySpA(atk, pokemon, defender, move) {
				if (!this.ruleTable.has('beatupnicknamesmod')) {
					this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + move.allies![0].name);
				}
				this.event.modifier = 1;
				return this.dex.species.get(move.allies!.shift()!.set.species).baseStats.atk;
			},
			onFoeModifySpDPriority: -101,
			onFoeModifySpD(def, pokemon) {
				this.event.modifier = 1;
				return this.dex.species.get(pokemon.set.species).baseStats.def;
			},
		},
	},
	bide: {
		inherit: true,
		accuracy: 100,
		priority: 0,
		condition: {
			inherit: true,
			onAfterSetStatus: undefined, // no inherit
			onBeforeMove(pokemon, defender, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					if (!this.effectState.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					defender = this.effectState.lastDamageSource;
					if (!defender) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!defender.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						defender = possibleTarget;
					}
					const moveData = {
						id: 'bide' as ID,
						name: "Bide",
						accuracy: 100,
						damage: this.effectState.totalDamage * 2,
						category: "Physical",
						priority: 0,
						flags: { contact: 1, protect: 1 },
						effectType: 'Move',
						type: 'Normal',
					} as unknown as ActiveMove;
					this.actions.tryMoveHit(defender, pokemon, moveData);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove: undefined, // no inherit
	},
	brickbreak: {
		inherit: true,
		onTryHit(defender, attacker) {
			// will shatter screens through sub, before you hit
			const foe = attacker.side.foe;
			foe.removeSideCondition('reflect');
			foe.removeSideCondition('lightscreen');
		},
	},
	charge: {
		inherit: true,
		boosts: undefined, // no inherit
	},
	conversion: {
		inherit: true,
		onHit(defender) {
			const possibleTypes = defender.moveSlots.map(moveSlot => {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.id !== 'curse' && !defender.hasType(move.type)) {
					return move.type;
				}
				return '';
			}).filter(type => type);
			if (!possibleTypes.length) {
				return false;
			}
			const type = this.sample(possibleTypes);

			if (!defender.setType(type)) return false;
			this.add('-start', defender, 'typechange', type);
		},
	},
	conversion2: {
		inherit: true,
		onHit(defender, attacker) {
			if (!defender.lastMoveUsed) {
				return false;
			}
			const possibleTypes = [];
			const lastMoveUsed = defender.lastMoveUsed;
			const attackType = lastMoveUsed.id === 'struggle' ? 'Normal' : lastMoveUsed.type;
			for (const typeName of this.dex.types.names()) {
				const typeCheck = this.dex.types.get(typeName).damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(typeName);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			const randomType = this.sample(possibleTypes);

			if (!attacker.setType(randomType)) return false;
			this.add('-start', attacker, 'typechange', randomType);
		},
	},
	counter: {
		inherit: true,
		condition: {
			inherit: true,
			onRedirectTarget(defender, attacker, source2) {
				if (attacker !== this.effectState.defender || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagingHit: undefined, // no inherit
			onDamagePriority: -101,
			onDamage(damage, defender, attacker, effect) {
				if (
					effect.effectType === 'Move' && !attacker.isAlly(defender) &&
					(effect.category === 'Physical' || effect.id === 'hiddenpower')
				) {
					this.effectState.slot = attacker.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
	},
	covet: {
		inherit: true,
		flags: { protect: 1, mirror: 1, noassist: 1 },
	},
	crunch: {
		inherit: true,
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
	},
	dig: {
		inherit: true,
		basePower: 60,
	},
	disable: {
		inherit: true,
		accuracy: 55,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		condition: {
			inherit: true,
			durationCallback() {
				return this.random(2, 6);
			},
			"onResidualOrder": undefined, // no inherit
			"onResidualSubOrder": undefined, // no inherit
		},
	},
	dive: {
		inherit: true,
		basePower: 60,
	},
	doomdesire: {
		inherit: true,
		onTry(attacker, defender) {
			if (!defender.side.addSlotCondition(defender, 'futuremove')) return false;
			const moveData = {
				name: "Doom Desire",
				basePower: 120,
				category: "Physical",
				flags: { metronome: 1, futuremove: 1 },
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(attacker, defender, moveData, true);
			Object.assign(defender.side.slotConditions[defender.position]['futuremove'], {
				duration: 3,
				move: 'doomdesire',
				attacker,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 85,
					basePower: 0,
					damage,
					category: "Physical",
					flags: { metronome: 1, futuremove: 1 },
					effectType: 'Move',
					type: '???',
				},
			});
			this.add('-start', attacker, 'Doom Desire');
			return null;
		},
	},
	encore: {
		inherit: true,
		volatileStatus: 'encore',
		condition: {
			inherit: true,
			durationCallback() {
				return this.random(3, 7);
			},
		},
	},
	extrasensory: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, minimize: 1 },
	},
	fakeout: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	feintattack: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	flail: {
		inherit: true,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 5) {
				bp = 150;
			} else if (ratio < 10) {
				bp = 100;
			} else if (ratio < 17) {
				bp = 80;
			} else if (ratio < 33) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	flash: {
		inherit: true,
		accuracy: 70,
	},
	fly: {
		inherit: true,
		basePower: 70,
	},
	followme: {
		inherit: true,
		volatileStatus: undefined, // no inherit
		slotCondition: 'followme',
		condition: {
			inherit: true,
			onStart(defender, attacker, effect) {
				this.add('-singleturn', defender, 'move: Follow Me');
				this.effectState.slot = defender.getSlot();
			},
			onFoeRedirectTarget(defender, attacker, source2, move) {
				const userSlot = this.getAtSlot(this.effectState.slot);
				if (this.validTarget(userSlot, attacker, move.defender)) {
					return userSlot;
				}
			},
		},
	},
	foresight: {
		inherit: true,
		accuracy: 100,
	},
	furycutter: {
		inherit: true,
		onHit(defender, attacker) {
			attacker.addVolatile('furycutter');
		},
	},
	gigadrain: {
		inherit: true,
		pp: 5,
	},
	glare: {
		inherit: true,
		ignoreImmunity: false,
	},
	haze: {
		inherit: true,
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
	},
	hiddenpower: {
		inherit: true,
		category: "Physical",
		onModifyMove(move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
			const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
			move.category = specialTypes.includes(move.type) ? 'Special' : 'Physical';
		},
	},
	highjumpkick: {
		inherit: true,
		basePower: 85,
		onMoveFail(defender, attacker, move) {
			if (defender.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(attacker, defender, move, true);
				if (typeof damage !== 'number') throw new Error("HJK recoil failed");
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(defender.maxhp / 2)), attacker, attacker, move);
			}
		},
	},
	hypnosis: {
		inherit: true,
		accuracy: 60,
	},
	jumpkick: {
		inherit: true,
		basePower: 70,
		onMoveFail(defender, attacker, move) {
			if (defender.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(attacker, defender, move, true);
				if (typeof damage !== 'number') throw new Error("Jump Kick didn't recoil");
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(defender.maxhp / 2)), attacker, attacker, move);
			}
		},
	},
	leafblade: {
		inherit: true,
		basePower: 70,
	},
	lockon: {
		inherit: true,
		accuracy: 100,
	},
	megadrain: {
		inherit: true,
		pp: 10,
	},
	memento: {
		inherit: true,
		accuracy: true,
	},
	mindreader: {
		inherit: true,
		accuracy: 100,
	},
	mimic: {
		inherit: true,
		flags: { protect: 1, bypasssub: 1, allyanim: 1, failencore: 1, noassist: 1, failmimic: 1 },
	},
	mirrorcoat: {
		inherit: true,
		condition: {
			inherit: true,
			onRedirectTarget(defender, attacker, source2) {
				if (attacker !== this.effectState.defender || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagingHit: undefined, // no inherit
			onDamagePriority: -101,
			onDamage(damage, defender, attacker, effect) {
				if (
					effect.effectType === 'Move' && !attacker.isAlly(defender) &&
					effect.category === 'Special' && effect.id !== 'hiddenpower'
				) {
					this.effectState.slot = attacker.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
	},
	mirrormove: {
		inherit: true,
		flags: { metronome: 1, failencore: 1, nosleeptalk: 1, noassist: 1 },
		onTryHit: undefined, // no inherit
		onHit(pokemon) {
			const noMirror = [
				'assist', 'curse', 'doomdesire', 'focuspunch', 'futuresight', 'magiccoat', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'psychup', 'roleplay', 'sketch', 'sleeptalk', 'spikes', 'spitup', 'taunt', 'teeterdance', 'transform',
			];
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.attacker.lastMove || !lastAttackedBy.move) {
				return false;
			}
			if (noMirror.includes(lastAttackedBy.move) || !lastAttackedBy.attacker.hasMove(lastAttackedBy.move)) {
				return false;
			}
			this.actions.useMove(lastAttackedBy.move, pokemon);
		},
		target: "self",
	},
	naturepower: {
		inherit: true,
		accuracy: 95,
		onHit(defender) {
			this.actions.useMove('swift', defender);
		},
	},
	needlearm: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, minimize: 1 },
	},
	nightmare: {
		inherit: true,
		accuracy: true,
	},
	odorsleuth: {
		inherit: true,
		accuracy: 100,
	},
	outrage: {
		inherit: true,
		basePower: 90,
	},
	overheat: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	petaldance: {
		inherit: true,
		basePower: 70,
	},
	pursuit: {
		inherit: true,
		beforeTurnCallback(pokemon, defender) {
			pokemon.addVolatile('pursuit', pokemon, this.dex.getActiveMove('pursuit'));
			pokemon.volatiles['pursuit'].targetLoc = pokemon.getLocOf(defender);
		},
		condition: {
			inherit: true,
			onFoeBeforeSwitchOut(pokemon) {
				const attacker: Pokemon = this.effectState.attacker;
				this.debug('Pursuit start');
				if (
					this.effectState.targetLoc !== attacker.getLocOf(pokemon) ||
					['frz', 'slp'].includes(attacker.status) || (attacker.hasAbility('truant') && attacker.volatiles['truant']) ||
					!attacker.isAdjacent(pokemon) || !attacker.hp ||
					(attacker.volatiles['encore'] && attacker.volatiles['encore'].move !== 'pursuit') ||
					!this.queue.cancelMove(attacker)
				) {
					return;
				}
				if (!pokemon.pursuitActivated) {
					this.add('-activate', pokemon, 'move: Pursuit');
					pokemon.pursuitActivated = true;
				}
				// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
				// If it is, then Mega Evolve before moving.
				if (attacker.canMegaEvo || attacker.canUltraBurst) {
					for (const [actionIndex, action] of this.queue.entries()) {
						if (action.pokemon === attacker && action.choice === 'megaEvo') {
							this.actions.runMegaEvo(attacker);
							this.queue.list.splice(actionIndex, 1);
							break;
						}
					}
				}
				const move = this.dex.getActiveMove('pursuit');
				attacker.deductPP(move.id);
				attacker.moveUsed(move, pokemon.position);
				if (this.actions.useMove(move, attacker, { defender: pokemon, sourceEffect: this.effectState.sourceEffect }) &&
					attacker.getItem().isChoice) {
					attacker.addVolatile('choicelock');
				}
			},
		},
	},
	recover: {
		inherit: true,
		pp: 20,
	},
	reversal: {
		inherit: true,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 5) {
				bp = 150;
			} else if (ratio < 10) {
				bp = 100;
			} else if (ratio < 17) {
				bp = 80;
			} else if (ratio < 33) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	rocksmash: {
		inherit: true,
		basePower: 20,
	},
	sketch: {
		inherit: true,
		flags: { bypasssub: 1, failencore: 1, noassist: 1, failmimic: 1, nosketch: 1 },
	},
	sleeptalk: {
		inherit: true,
		onHit(pokemon) {
			const moves = [];
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				const pp = moveSlot.pp;
				const move = this.dex.moves.get(moveid);
				if (moveid && !move.flags['nosleeptalk'] && !move.flags['charge']) {
					moves.push({ move: moveid, pp });
				}
			}
			if (!moves.length) {
				return false;
			}
			const randomMove = this.sample(moves);
			if (!randomMove.pp) {
				this.add('cant', pokemon, 'nopp', randomMove.move);
				return;
			}
			this.actions.useMove(randomMove.move, pokemon);
		},
	},
	spite: {
		inherit: true,
		onHit(defender) {
			const roll = this.random(2, 6);
			if (defender.lastMove && defender.deductPP(defender.lastMove.id, roll)) {
				this.add("-activate", defender, 'move: Spite', defender.lastMove.id, roll);
				return;
			}
			return false;
		},
	},
	stockpile: {
		inherit: true,
		pp: 10,
		condition: {
			noCopy: true,
			onStart(defender) {
				this.effectState.layers = 1;
				this.add('-start', defender, 'stockpile' + this.effectState.layers);
			},
			onRestart(defender) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', defender, 'stockpile' + this.effectState.layers);
			},
			onEnd(defender) {
				this.effectState.layers = 0;
				this.add('-end', defender, 'Stockpile');
			},
		},
	},
	struggle: {
		inherit: true,
		flags: { contact: 1, protect: 1, noassist: 1, failencore: 1, failmimic: 1, nosketch: 1 },
		accuracy: 100,
		recoil: [1, 4],
		struggleRecoil: false,
	},
	surf: {
		inherit: true,
		target: "allAdjacentFoes",
	},
	taunt: {
		inherit: true,
		flags: { protect: 1, bypasssub: 1, metronome: 1 },
		condition: {
			inherit: true,
			duration: 2,
			durationCallback: undefined, // no inherit
			onEnd(defender) {
				this.add('-end', defender, 'move: Taunt', '[silent]');
			},
			onBeforeMovePriority: undefined, // no inherit
		},
	},
	teeterdance: {
		inherit: true,
		flags: { protect: 1, metronome: 1 },
	},
	tickle: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	uproar: {
		inherit: true,
		condition: {
			inherit: true,
			durationCallback() {
				return this.random(2, 6);
			},
		},
	},
	vinewhip: {
		inherit: true,
		pp: 10,
	},
	volttackle: {
		inherit: true,
		secondary: undefined, // no inherit
	},
	waterfall: {
		inherit: true,
		secondary: undefined, // no inherit
	},
	weatherball: {
		inherit: true,
		onModifyMove(move) {
			switch (this.field.effectiveWeather()) {
			case 'sunnyday':
				move.type = 'Fire';
				move.category = 'Special';
				break;
			case 'raindance':
				move.type = 'Water';
				move.category = 'Special';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
				move.type = 'Ice';
				move.category = 'Special';
				break;
			}
			if (this.field.effectiveWeather()) move.basePower *= 2;
		},
	},
	zapcannon: {
		inherit: true,
		basePower: 100,
	},
};
