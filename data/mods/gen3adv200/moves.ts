/**
 * Gen 3 moves
 */

export const Moves: {[k: string]: ModdedMoveData} = {
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
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
	},
	assist: {
		inherit: true,
		flags: {metronome: 1, noassist: 1, nosleeptalk: 1},
	},
	astonish: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (target.volatiles['minimize']) return 60;
			return 30;
		},
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
				// https://www.smogon.com/forums/posts/8992145/
				// this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + move.allies![0].name);
				this.event.modifier = 1;
				return move.allies!.shift()!.species.baseStats.atk;
			},
			onFoeModifySpDPriority: -101,
			onFoeModifySpD(def, pokemon) {
				this.event.modifier = 1;
				return pokemon.species.baseStats.def;
			},
		},
	},
	bide: {
		inherit: true,
		accuracy: 100,
		priority: 0,
		condition: {
			duration: 3,
			onLockMove: 'bide',
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.add('-start', pokemon, 'move: Bide');
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move' || !source) return;
				this.effectState.totalDamage += damage;
				this.effectState.lastDamageSource = source;
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					if (!this.effectState.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					target = this.effectState.lastDamageSource;
					if (!target) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						target = possibleTarget;
					}
					const moveData = {
						id: 'bide' as ID,
						name: "Bide",
						accuracy: 100,
						damage: this.effectState.totalDamage * 2,
						category: "Physical",
						priority: 0,
						flags: {contact: 1, protect: 1},
						effectType: 'Move',
						type: 'Normal',
					} as unknown as ActiveMove;
					this.actions.tryMoveHit(target, pokemon, moveData);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
			onMoveAborted(pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove() { },
	},
	brickbreak: {
		inherit: true,
		onTryHit(target, source) {
			// will shatter screens through sub, before you hit
			const foe = source.side.foe;
			foe.removeSideCondition('reflect');
			foe.removeSideCondition('lightscreen');
		},
	},
	charge: {
		inherit: true,
		boosts: null,
	},
	conversion: {
		inherit: true,
		onHit(target) {
			const possibleTypes = target.moveSlots.map(moveSlot => {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.id !== 'curse' && !target.hasType(move.type)) {
					return move.type;
				}
				return '';
			}).filter(type => type);
			if (!possibleTypes.length) {
				return false;
			}
			const type = this.sample(possibleTypes);

			if (!target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
	},
	counter: {
		inherit: true,
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2) {
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, effect) {
				if (
					effect.effectType === 'Move' && !source.isAlly(target) &&
					(effect.category === 'Physical' || effect.id === 'hiddenpower')
				) {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
	},
	covet: {
		inherit: true,
		flags: {protect: 1, mirror: 1, noassist: 1},
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
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
		volatileStatus: 'disable',
		condition: {
			durationCallback() {
				return this.random(2, 6);
			},
			noCopy: true,
			onStart(pokemon) {
				if (!this.queue.willMove(pokemon)) {
					this.effectState.duration++;
				}
				if (!pokemon.lastMove) {
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === pokemon.lastMove.id) {
						if (!moveSlot.pp) {
							return false;
						} else {
							this.add('-start', pokemon, 'Disable', moveSlot.move);
							this.effectState.move = pokemon.lastMove.id;
							return;
						}
					}
				}
				return false;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Disable');
			},
			onBeforeMove(attacker, defender, move) {
				if (move.id === this.effectState.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	dive: {
		inherit: true,
		basePower: 60,
	},
	doomdesire: {
		inherit: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			const moveData = {
				name: "Doom Desire",
				basePower: 120,
				category: "Physical",
				flags: {metronome: 1, futuremove: 1},
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(source, target, moveData, true);
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'doomdesire',
				source: source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 85,
					basePower: 0,
					damage: damage,
					category: "Physical",
					flags: {metronome: 1, futuremove: 1},
					effectType: 'Move',
					type: '???',
				},
			});
			this.add('-start', source, 'Doom Desire');
			return null;
		},
	},
	encore: {
		inherit: true,
		volatileStatus: 'encore',
		condition: {
			durationCallback() {
				return this.random(3, 7);
			},
			onStart(target, source) {
				const moveIndex = target.lastMove ? target.moves.indexOf(target.lastMove.id) : -1;
				if (
					!target.lastMove || target.lastMove.flags['failencore'] ||
					!target.moveSlots[moveIndex] || target.moveSlots[moveIndex].pp <= 0
				) {
					// it failed
					return false;
				}
				this.effectState.move = target.lastMove.id;
				this.add('-start', target, 'Encore');
			},
			onOverrideAction(pokemon) {
				return this.effectState.move;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 14,
			onResidual(target) {
				if (
					target.moves.includes(this.effectState.move) &&
					target.moveSlots[target.moves.indexOf(this.effectState.move)].pp <= 0
				) {
					// early termination if you run out of PP
					target.removeVolatile('encore');
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	extrasensory: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (target.volatiles['minimize']) return 160;
			return 80;
		},
	},
	fakeout: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1},
	},
	feintattack: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1},
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
			this.debug('BP: ' + bp);
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
		volatileStatus: undefined,
		slotCondition: 'followme',
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				this.add('-singleturn', target, 'move: Follow Me');
				this.effectState.slot = target.getSlot();
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
				const userSlot = this.getAtSlot(this.effectState.slot);
				if (this.validTarget(userSlot, source, move.target)) {
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
		onHit(target, source) {
			source.addVolatile('furycutter');
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
		onMoveFail(target, source, move) {
			if (target.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(source, target, move, true);
				if (typeof damage !== 'number') throw new Error("HJK recoil failed");
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, move);
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
		onMoveFail(target, source, move) {
			if (target.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(source, target, move, true);
				if (typeof damage !== 'number') throw new Error("Jump Kick didn't recoil");
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, move);
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
		flags: {protect: 1, bypasssub: 1, allyanim: 1, failencore: 1, noassist: 1, failmimic: 1},
	},
	mirrorcoat: {
		inherit: true,
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2) {
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, effect) {
				if (
					effect.effectType === 'Move' && !source.isAlly(target) &&
					effect.category === 'Special' && effect.id !== 'hiddenpower'
				) {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
	},
	mirrormove: {
		inherit: true,
		flags: {metronome: 1, failencore: 1, nosleeptalk: 1, noassist: 1},
		onTryHit() { },
		onHit(pokemon) {
			const noMirror = [
				'assist', 'curse', 'doomdesire', 'focuspunch', 'futuresight', 'magiccoat', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'psychup', 'roleplay', 'sketch', 'sleeptalk', 'spikes', 'spitup', 'taunt', 'teeterdance', 'transform',
			];
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.source.lastMove || !lastAttackedBy.move) {
				return false;
			}
			if (noMirror.includes(lastAttackedBy.move) || !lastAttackedBy.source.hasMove(lastAttackedBy.move)) {
				return false;
			}
			this.actions.useMove(lastAttackedBy.move, pokemon);
		},
		target: "self",
	},
	naturepower: {
		inherit: true,
		accuracy: 95,
		onHit(target) {
			this.actions.useMove('swift', target);
		},
	},
	needlearm: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (target.volatiles['minimize']) return 120;
			return 60;
		},
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
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
	},
	petaldance: {
		inherit: true,
		basePower: 70,
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
			this.debug('BP: ' + bp);
			return bp;
		},
	},
	rocksmash: {
		inherit: true,
		basePower: 20,
	},
	sketch: {
		inherit: true,
		flags: {bypasssub: 1, failencore: 1, noassist: 1, failmimic: 1},
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
					moves.push({move: moveid, pp: pp});
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
		onHit(target) {
			const roll = this.random(2, 6);
			if (target.lastMove && target.deductPP(target.lastMove.id, roll)) {
				this.add("-activate", target, 'move: Spite', target.lastMove.id, roll);
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
			onStart(target) {
				this.effectState.layers = 1;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
			},
			onRestart(target) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
			},
			onEnd(target) {
				this.effectState.layers = 0;
				this.add('-end', target, 'Stockpile');
			},
		},
	},
	struggle: {
		inherit: true,
		flags: {contact: 1, protect: 1, noassist: 1, failencore: 1, failmimic: 1},
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
		flags: {protect: 1, bypasssub: 1, metronome: 1},
		condition: {
			duration: 2,
			onStart(target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt', '[silent]');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.move).category === 'Status') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMove(attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
	},
	teeterdance: {
		inherit: true,
		flags: {protect: 1, metronome: 1},
	},
	tickle: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	uproar: {
		inherit: true,
		condition: {
			onStart(target) {
				this.add('-start', target, 'Uproar');
				// 2-5 turns
				this.effectState.duration = this.random(2, 6);
			},
			onResidual(target) {
				if (target.volatiles['throatchop']) {
					target.removeVolatile('uproar');
					return;
				}
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['uproar'];
				}
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 11,
			onEnd(target) {
				this.add('-end', target, 'Uproar');
			},
			onLockMove: 'uproar',
			onAnySetStatus(status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectState.target) {
						this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
					} else {
						this.add('-fail', pokemon, 'slp', '[from] Uproar');
					}
					return null;
				}
			},
		},
	},
	vinewhip: {
		inherit: true,
		pp: 10,
	},
	volttackle: {
		inherit: true,
		secondary: null,
	},
	waterfall: {
		inherit: true,
		secondary: null,
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
