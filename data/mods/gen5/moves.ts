export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	absorb: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	acidarmor: {
		inherit: true,
		pp: 40,
	},
	aircutter: {
		inherit: true,
		basePower: 55,
	},
	airslash: {
		inherit: true,
		pp: 20,
	},
	aromatherapy: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', source, 'move: Aromatherapy');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				ally.cureStatus();
			}
		},
	},
	assurance: {
		inherit: true,
		basePower: 50,
	},
	aurasphere: {
		inherit: true,
		basePower: 90,
	},
	autotomize: {
		inherit: true,
		volatileStatus: 'autotomize',
		onHit(pokemon) {
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon) {
				if (pokemon.species.weighthg > 1) {
					this.effectState.multiplier = 1;
					this.add('-start', pokemon, 'Autotomize');
				}
			},
			onRestart(pokemon) {
				if (pokemon.species.weighthg - (this.effectState.multiplier * 1000) > 1) {
					this.effectState.multiplier++;
					this.add('-start', pokemon, 'Autotomize');
				}
			},
			onModifyWeightPriority: 2,
			onModifyWeight(weighthg, pokemon) {
				if (this.effectState.multiplier) {
					weighthg -= this.effectState.multiplier * 1000;
					if (weighthg < 1) weighthg = 1;
					return weighthg;
				}
			},
		},
	},
	barrier: {
		inherit: true,
		pp: 30,
	},
	bestow: {
		inherit: true,
		flags: { protect: 1, mirror: 1, noassist: 1, failcopycat: 1 },
	},
	blizzard: {
		inherit: true,
		basePower: 120,
	},
	block: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
	},
	bounce: {
		inherit: true,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, metronome: 1, nosleeptalk: 1 },
	},
	bubble: {
		inherit: true,
		basePower: 20,
	},
	bugbuzz: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	camouflage: {
		inherit: true,
		onHit(target) {
			if (!target.setType('Ground')) return false;
			this.add('-start', target, 'typechange', 'Ground');
		},
	},
	charm: {
		inherit: true,
		type: "Normal",
	},
	chatter: {
		inherit: true,
		basePower: 60,
		onModifyMove(move, pokemon) {
			if (pokemon.species.name !== 'Chatot') delete move.secondaries;
		},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		flags: {
			protect: 1, sound: 1, distance: 1, noassist: 1, failcopycat: 1,
			failmefirst: 1, nosleeptalk: 1, failmimic: 1, nosketch: 1,
		},
	},
	conversion: {
		inherit: true,
		onHit(target) {
			const possibleTypes = target.moveSlots.map(moveSlot => {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.id !== 'conversion' && !target.hasType(move.type)) {
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
	copycat: {
		inherit: true,
		onHit(pokemon) {
			if (!this.lastMove || this.dex.moves.get(this.lastMove.id).flags['failcopycat']) {
				return false;
			}
			this.actions.useMove(this.lastMove.id, pokemon);
		},
	},
	cottonspore: {
		inherit: true,
		onTryHit() {},
		target: "normal",
	},
	covet: {
		inherit: true,
		pp: 40,
	},
	crabhammer: {
		inherit: true,
		basePower: 90,
	},
	defog: {
		inherit: true,
		onHit(pokemon) {
			if (!pokemon.volatiles['substitute']) this.boost({ evasion: -1 });
			const sideConditions = ['reflect', 'lightscreen', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock'];
			for (const condition of sideConditions) {
				if (pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Defog', `[of] ${pokemon}`);
				}
			}
		},
	},
	dig: {
		inherit: true,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1, nosleeptalk: 1 },
	},
	dive: {
		inherit: true,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1, nosleeptalk: 1 },
	},
	dracometeor: {
		inherit: true,
		basePower: 140,
	},
	dragonpulse: {
		inherit: true,
		basePower: 90,
	},
	drainpunch: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
	},
	dreameater: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	echoedvoice: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	electroball: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const ratio = Math.floor(pokemon.getStat('spe') / Math.max(1, target.getStat('spe')));
			const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	energyball: {
		inherit: true,
		basePower: 80,
	},
	extrasensory: {
		inherit: true,
		pp: 30,
	},
	feint: {
		inherit: true,
		flags: { noassist: 1, failcopycat: 1 },
	},
	finalgambit: {
		inherit: true,
		flags: { contact: 1, protect: 1, metronome: 1 },
	},
	fireblast: {
		inherit: true,
		basePower: 120,
	},
	firepledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback(target, source, move) {
			if (['grasspledge', 'waterpledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 150;
			}
			return 50;
		},
	},
	flamethrower: {
		inherit: true,
		basePower: 95,
	},
	fly: {
		inherit: true,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, metronome: 1 },
	},
	followme: {
		inherit: true,
		priority: 3,
	},
	frostbreath: {
		inherit: true,
		basePower: 40,
	},
	furycutter: {
		inherit: true,
		basePower: 20,
		condition: {
			duration: 2,
			onStart() {
				this.effectState.multiplier = 1;
			},
			onRestart() {
				if (this.effectState.multiplier < 8) {
					this.effectState.multiplier <<= 1;
				}
				this.effectState.duration = 2;
			},
		},
	},
	futuresight: {
		inherit: true,
		basePower: 100,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'futuresight',
				source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 100,
					basePower: 100,
					category: "Special",
					priority: 0,
					flags: { metronome: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Psychic',
				},
			});
			this.add('-start', source, 'move: Future Sight');
			return null;
		},
	},
	gigadrain: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	glare: {
		inherit: true,
		accuracy: 90,
	},
	grasswhistle: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	grasspledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback(target, source, move) {
			if (['waterpledge', 'firepledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 150;
			}
			return 50;
		},
	},
	growl: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	growth: {
		inherit: true,
		pp: 40,
	},
	gunkshot: {
		inherit: true,
		accuracy: 70,
	},
	gyroball: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			let power = Math.floor(25 * target.getStat('spe') / Math.max(1, pokemon.getStat('spe'))) + 1;
			if (power > 150) power = 150;
			this.debug(`BP: ${power}`);
			return power;
		},
	},
	healbell: {
		inherit: true,
		flags: { snatch: 1, sound: 1, metronome: 1 },
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				ally.cureStatus();
			}
		},
	},
	healpulse: {
		inherit: true,
		heal: [1, 2],
		onHit() {},
	},
	heatwave: {
		inherit: true,
		basePower: 100,
	},
	hex: {
		inherit: true,
		basePower: 50,
	},
	hiddenpower: {
		inherit: true,
		basePower: 0,
		basePowerCallback(pokemon) {
			const bp = pokemon.hpPower || 70;
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	hiddenpowerbug: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerdark: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerdragon: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerelectric: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerfighting: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerfire: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerflying: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerghost: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowergrass: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerground: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerice: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerpoison: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerpsychic: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerrock: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowersteel: {
		inherit: true,
		basePower: 70,
	},
	hiddenpowerwater: {
		inherit: true,
		basePower: 70,
	},
	hornleech: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	hurricane: {
		inherit: true,
		basePower: 120,
	},
	hydropump: {
		inherit: true,
		basePower: 120,
	},
	hypervoice: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	icebeam: {
		inherit: true,
		basePower: 95,
	},
	incinerate: {
		inherit: true,
		basePower: 30,
		onHit(pokemon, source) {
			const item = pokemon.getItem();
			if (item.isBerry && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		},
	},
	knockoff: {
		inherit: true,
		basePower: 20,
		onBasePower() {},
	},
	leafstorm: {
		inherit: true,
		basePower: 140,
	},
	leechlife: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	lick: {
		inherit: true,
		basePower: 20,
	},
	lightscreen: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (this.activePerHalf > 1) return this.chainModify([2703, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 2,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Light Screen');
			},
		},
	},
	lowsweep: {
		inherit: true,
		basePower: 60,
	},
	magiccoat: {
		inherit: true,
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				this.add('-singleturn', target, 'move: Magic Coat');
				if (effect?.effectType === 'Move') {
					this.effectState.pranksterBoosted = effect.pranksterBoosted;
				}
			},
			onTryHitPriority: 2,
			onTryHit(target, source, move) {
				if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
					return;
				}
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = this.effectState.pranksterBoosted;
				this.actions.useMove(newMove, target, { target: source });
				return null;
			},
			onAllyTryHitSide(target, source, move) {
				if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = false;
				this.actions.useMove(newMove, this.effectState.target, { target: source });
				return null;
			},
		},
	},
	magicroom: {
		inherit: true,
		priority: -7,
	},
	magmastorm: {
		inherit: true,
		basePower: 120,
	},
	meanlook: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
	},
	megadrain: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	metalsound: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	meteormash: {
		inherit: true,
		accuracy: 85,
		basePower: 100,
	},
	minimize: {
		inherit: true,
		pp: 20,
		condition: {
			noCopy: true,
			onSourceModifyDamage(damage, source, target, move) {
				if (['stomp', 'steamroller'].includes(move.id)) {
					return this.chainModify(2);
				}
			},
		},
	},
	moonlight: {
		inherit: true,
		type: "Normal",
	},
	mudsport: {
		inherit: true,
		pseudoWeather: undefined,
		volatileStatus: 'mudsport',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Mud Sport');
			},
			onAnyBasePowerPriority: 1,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Electric') {
					this.debug('mud sport weaken');
					return this.chainModify([1352, 4096]);
				}
			},
		},
	},
	muddywater: {
		inherit: true,
		basePower: 95,
	},
	naturepower: {
		inherit: true,
		onTryHit() {},
		onHit(pokemon) {
			this.actions.useMove('earthquake', pokemon);
		},
		target: "self",
	},
	overheat: {
		inherit: true,
		basePower: 140,
	},
	perishsong: {
		inherit: true,
		flags: { sound: 1, distance: 1, metronome: 1 },
	},
	pinmissile: {
		inherit: true,
		accuracy: 85,
		basePower: 14,
	},
	poisonfang: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'tox',
		},
	},
	poisongas: {
		inherit: true,
		accuracy: 80,
	},
	poisonpowder: {
		inherit: true,
		onTryHit() {},
	},
	powergem: {
		inherit: true,
		basePower: 70,
	},
	psychup: {
		inherit: true,
		onHit(target, source) {
			let i: BoostID;
			for (i in target.boosts) {
				source.boosts[i] = target.boosts[i];
			}
			this.add('-copyboost', source, target, '[from] move: Psych Up');
		},
	},
	psychoshift: {
		inherit: true,
		accuracy: 90,
	},
	psywave: {
		inherit: true,
		accuracy: 80,
	},
	quickguard: {
		inherit: true,
		stallingMove: true,
		onTry(source) {
			return this.queue.willAct() && this.runEvent('StallMove', source);
		},
		onHitSide(side, source) {
			source.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onSideStart(target, source) {
				this.add('-singleturn', source, 'Quick Guard');
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				// Quick Guard only blocks moves with a natural positive priority
				// (e.g. it doesn't block 0 priority moves boosted by Prankster)
				if (effect && (effect.id === 'feint' || this.dex.moves.get(effect.id).priority <= 0)) {
					return;
				}
				this.add('-activate', target, 'Quick Guard');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
	ragepowder: {
		inherit: true,
		priority: 3,
		flags: { noassist: 1, failcopycat: 1 },
	},
	reflect: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (this.activePerHalf > 1) return this.chainModify([2703, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 1,
			onSideEnd(side) {
				this.add('-sideend', side, 'Reflect');
			},
		},
	},
	relicsong: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1 },
	},
	roar: {
		inherit: true,
		accuracy: 100,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
	},
	rocktomb: {
		inherit: true,
		accuracy: 80,
		basePower: 50,
		pp: 10,
	},
	round: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	sacredsword: {
		inherit: true,
		pp: 20,
	},
	scald: {
		inherit: true,
		thawsTarget: false,
	},
	screech: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	secretpower: {
		inherit: true,
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
	},
	shadowforce: {
		inherit: true,
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1 },
	},
	sing: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	skillswap: {
		inherit: true,
		onHit(target, source) {
			const targetAbility = target.ability;
			const sourceAbility = source.ability;
			if (targetAbility === sourceAbility) {
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap', this.dex.abilities.get(targetAbility), this.dex.abilities.get(sourceAbility), `[of] ${target}`);
			source.setAbility(targetAbility);
			target.setAbility(sourceAbility);
		},
	},
	skullbash: {
		inherit: true,
		basePower: 100,
		pp: 15,
	},
	skydrop: {
		inherit: true,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, metronome: 1, nosleeptalk: 1 },
		onTryHit(target, source, move) {
			if (target.fainted) return false;
			if (source.removeVolatile(move.id)) {
				if (target !== source.volatiles['twoturnmove'].source) return false;

				if (target.hasType('Flying')) {
					this.add('-immune', target);
					this.add('-end', target, 'Sky Drop');
					return null;
				}
			} else {
				if (target.volatiles['substitute'] || target.isAlly(source)) {
					return false;
				}

				this.add('-prepare', source, move.name, target);
				source.addVolatile('twoturnmove', target);
				return null;
			}
		},
	},
	sleeppowder: {
		inherit: true,
		onTryHit() {},
	},
	smellingsalts: {
		inherit: true,
		basePower: 60,
	},
	smog: {
		inherit: true,
		basePower: 20,
	},
	snarl: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1 },
	},
	snore: {
		inherit: true,
		basePower: 40,
		flags: { protect: 1, mirror: 1, sound: 1 },
	},
	soak: {
		inherit: true,
		onHit(target) {
			if (!target.setType('Water')) {
				// Soak should animate even when it fails.
				// Returning false would suppress the animation.
				this.add('-fail', target);
				return null;
			}
			this.add('-start', target, 'typechange', 'Water');
		},
	},
	spore: {
		inherit: true,
		onTryHit() {},
	},
	stormthrow: {
		inherit: true,
		basePower: 40,
	},
	stringshot: {
		inherit: true,
		boosts: {
			spe: -1,
		},
	},
	strugglebug: {
		inherit: true,
		basePower: 30,
	},
	stunspore: {
		inherit: true,
		onTryHit() {},
	},
	substitute: {
		inherit: true,
		condition: {
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectState.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub']) {
					return;
				}
				let damage = this.actions.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) {
					return damage;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp as number;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					if (move.ohko) this.add('-ohko');
					target.removeVolatile('substitute');
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.recoil && damage) {
					this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.singleEvent('AfterSubDamage', move, null, target, source, move, damage);
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return this.HIT_SUBSTITUTE;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
	},
	submission: {
		inherit: true,
		pp: 25,
	},
	supersonic: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	surf: {
		inherit: true,
		basePower: 95,
	},
	sweetkiss: {
		inherit: true,
		type: "Normal",
	},
	sweetscent: {
		inherit: true,
		boosts: {
			evasion: -1,
		},
	},
	swordsdance: {
		inherit: true,
		pp: 30,
	},
	synchronoise: {
		inherit: true,
		basePower: 70,
		pp: 15,
	},
	tailwind: {
		inherit: true,
		pp: 30,
	},
	technoblast: {
		inherit: true,
		basePower: 85,
	},
	thief: {
		inherit: true,
		basePower: 40,
		pp: 10,
	},
	thunder: {
		inherit: true,
		basePower: 120,
	},
	thunderbolt: {
		inherit: true,
		basePower: 95,
	},
	toxic: {
		inherit: true,
		onPrepareHit() {},
	},
	uproar: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, metronome: 1, nosleeptalk: 1 },
	},
	vinewhip: {
		inherit: true,
		basePower: 35,
		pp: 15,
	},
	wakeupslap: {
		inherit: true,
		basePower: 60,
	},
	waterpledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback(target, source, move) {
			if (['firepledge', 'grasspledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 150;
			}
			return 50;
		},
	},
	watersport: {
		inherit: true,
		pseudoWeather: undefined,
		volatileStatus: 'watersport',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Water Sport');
			},
			onAnyBasePowerPriority: 1,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Fire') {
					this.debug('water sport weaken');
					return this.chainModify([1352, 4096]);
				}
			},
		},
	},
	whirlwind: {
		inherit: true,
		accuracy: 100,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	wideguard: {
		inherit: true,
		stallingMove: true,
		onTry(source) {
			return this.queue.willAct() && this.runEvent('StallMove', source);
		},
		onHitSide(side, source) {
			source.addVolatile('stall');
		},
	},
	willowisp: {
		inherit: true,
		accuracy: 75,
	},
	wonderroom: {
		inherit: true,
		priority: -7,
	},
};
