export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// physical ghost
	poltergeist: {
		inherit: true,
		desc: "Fails if target has no item. Removes target's item.",
		shortDesc: "Fails if target has no item. Removes target's item.",
		basePower: 100,
		accuracy: 100,
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Poltergeist', `[of] ${source}`);
				}
			}
		},
	},
	shadowforce: {
		num: 467,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Shadow Force",
		desc: "Hits two turns after use.",
		shortDesc: "Hits two turns after use.",
		pp: 5,
		priority: 0,
		flags: { allyanim: 1, futuremove: 1 },
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'shadowforce',
				source,
				moveData: {
					id: 'shadowforce',
					name: "Shadow Force",
					accuracy: 100,
					basePower: 100,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Ghost',
				},
			});
			this.add('-start', source, 'move: Shadow Force');
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	phantomforce: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "User's Ghost type becomes typeless; must be Ghost.",
		shortDesc: "User's Ghost type becomes typeless; must be Ghost.",
		name: "Phantom Force",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Ghost')) return;
			this.add('-fail', pokemon, 'move: Phantom Force');
			this.attrLastMove('[still]');
			return null;
		},
		self: {
			onHit(pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Ghost" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Phantom Force');
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	spectralthief: {
		desc: "Fails if no stat boosts. Steals the target's stat boosts.",
		shortDesc: "Fails if no stat boosts. Steals the target's stat boosts.",
		inherit: true,
		isNonstandard: null,
		onTry(source, target) {
			if (target.positiveBoosts() === 0) return false;
		},
	},
	shadowbone: {
		inherit: true,
		isNonstandard: null,
		desc: "Uses the user's Defense in calculation. User: -1 Def.",
		shortDesc: "Uses the user's Defense in calculation. User: -1 Def.",
		overrideOffensiveStat: 'def',
		self: {
			boosts: {
				def: -1,
			},
		},
		secondary: null,
	},
	spiritshackle: {
		desc: "Removes the target's Ghost type.",
		shortDesc: "Removes the target's Ghost type.",
		basePower: 85,
		inherit: true,
		onHit(target) {
			if (!target.getTypes().includes("Ghost")) return;
			const newBaseTypes = target.getTypes().filter(t => t !== "Ghost");
			target.setType(newBaseTypes);
			this.add('-start', target, 'typechange', target.getTypes().join('/'), '[from] move: Spirit Shackle');
		},
		secondary: null,
	},
	shadowpunch: {
		desc: "Uses Pain Split.",
		shortDesc: "Uses Pain Split.",
		inherit: true,
		basePower: 75,
		onAfterHit(target, source, move) {
			this.actions.useMove("painsplit", source, { target });
		},
	},
	lastrespects: {
		inherit: true,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			return 60 + 5 * pokemon.side.totalFainted;
		},
		desc: "+1 priority and +5 BP for each ally fainted.",
		shortDesc: "+1 priority and +5 BP for each ally fainted.",
		priority: -1,
		onModifyPriority(priority, source, target, move) {
			return priority + source.side.totalFainted;
		},
	},
	ragefist: {
		desc: "+1 power per time hit, max 300. 1 damage recoil.",
		shortDesc: "+1 power per time hit, max 300. 1 damage recoil.",
		inherit: true,
		pp: 187.5,
		basePowerCallback(pokemon) {
			return Math.min(350, 50 + pokemon.timesAttacked);
		},
		onAfterHit(target, pokemon, move) {
			this.damage(1, pokemon, target);
		},
	},
	shadowsneak: {
		inherit: true,
		basePower: 50,
		desc: "Usually goes first. Fails if target is not attacking.",
		shortDesc: "Usually goes first. Fails if target is not attacking.",
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
	},
	shadowclaw: {
		inherit: true,
		basePower: 40,
		desc: "Always results in a critical hit.",
		shortDesc: "Always results in a critical hit.",
		willCrit: true,
		critRatio: 1,
	},
	astonish: {
		inherit: true,
		desc: "Fails if not turn 1 out. 100% chance to flinch.",
		shortDesc: "Fails if not turn 1 out. 100% chance to flinch.",
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Astonish only works on your first turn out.");
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
	},
	lick: {
		inherit: true,
		desc: "Paralyzes the target. Once per battle.",
		shortDesc: "Paralyzes the target. Once per battle.",
		onAfterHit(target, source, move) {
			if (this.effectState.lick) return;
			this.effectState.lick = true;
			target.trySetStatus('par', source, move);
		},
		secondary: null,
	},
	// special ghost
	nightshade: {
		inherit: true,
		flags: { protect: 1, mirror: 1, heal: 1 },
		desc: "Deals and heals damage equal to the user's level.",
		shortDesc: "Deals and heals damage equal to the user's level.",
		onHit(target, pokemon) {
			this.heal(pokemon.level, pokemon);
		},
	},
	astralbarrage: {
		inherit: true,
		desc: "User faints.",
		shortDesc: "User faints.",
		basePower: 150,
		selfdestruct: "always",
	},
	bombinomicon: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "BOMBINOMICON!",
		shortDesc: "Fails if the user is hit before it moves.",
		pp: 5,
		priority: -3,
		flags: {
			contact: 1, protect: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1,
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shell Trap", target);
		},
		priorityChargeCallback(pokemon) {
			const bomb = [
				'Bombinomicon! Destroy them!',
				'By the power...of the Bombinomicon!',
				'Booooooombinomicon!',
				'Forbidden book! I unchain thee!',
				'Cower before the Bombinomicon!',
				'Beebus Barrasbus Bombinomicon!',
				'Bombinomicon! Heed my call!',
				'Feel the terror...of reading!',
				'Feel the terror...of books!',
				'Heads up!', 'Fire in the hole!',
				'Grenade! (laughter)',
				'(crazed laughter)',
				'Bombs! So many bombs!',
				'Magic everyone! Magic!',
				'Yes! Yes! Perfect!',
				'Yes! Flee! Flee, cowards!',
				'(laughter) Run cowards! Run!',
				'That\'s right. Run cowards!',
				'(evil laughter) Run cowards! Run!',
				'How will you fight me when you\'re all so scared?',
				'The fear is inside you!',
				'Fear me! Poop, poop in your pumpkin pants!',
			];
			this.add('-message', `${this.sample(bomb)}`);
			pokemon.addVolatile('bombinomicon');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['bombinomicon']?.lostFocus) {
				this.add('cant', pokemon, 'BOMBINOMICON!', 'BOMBINOMICON!');
				return true;
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: BOMBINOMICON!');
			},
			onHit(pokemon, source, move) {
				if (move.category !== 'Status') {
					this.effectState.lostFocus = true;
				}
			},
			onTryAddVolatile(status, pokemon) {
				if (status.id === 'flinch') return null;
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	hex: {
		inherit: true,
		desc: "Fails if the target does not have a status ailment.",
		shortDesc: "Fails if the target does not have a status ailment.",
		basePower: 100,
		basePowerCallback(pokemon, target, move) {
			return move.basePower;
		},
		flags: { protect: 1, mirror: 1 },
		onTry(source, target) {
			return !!target.status;
		},
	},
	moongeistbeam: {
		inherit: true,
		isNonstandard: null,
		desc: "User must have used Moonlight last turn. Ignores abilities.",
		shortDesc: "Must use Moonlight first. Ignores abilities.",
		onTry(source, target) {
			if (source.lastMove?.id && source.lastMove.id !== 'moonlight') {
				this.add('cant', source, 'Moongeist Beam', 'Moongeist Beam');
				return true;
			}
		},
	},
	shadowball: {
		inherit: true,
		desc: "10% chance to lower target/user's Sp. Def by 1.",
		shortDesc: "10% chance to lower target/user's Sp. Def by 1.",
		basePower: 70,
		secondary: {
			chance: 20,
			onHit(target, source, move) {
				if (this.random(2) === 0) this.boost({ spd: -1 }, target, source, move);
				else this.boost({ spd: -1 }, source, source, move);
			},
		},
	},
	infernalparade: {
		inherit: true,
		desc: "+Fire effectiveness. 30% to burn.",
		shortDesc: "+Fire effectiveness. 30% to burn.",
		basePowerCallback(pokemon, target, move) {
			return move.basePower;
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Fire', type);
		},
	},
	bittermalice: {
		inherit: true,
		basePower: 50,
		desc: "+10 power for each PP used.",
		shortDesc: "+10 power for each PP used.",
		basePowerCallback(pokemon, target, move) {
			const callerMoveId = move.sourceEffect || move.id;
			const moveSlot = callerMoveId === 'instruct' ? pokemon.getMoveData(move.id) : pokemon.getMoveData(callerMoveId);
			if (!moveSlot) {
				return 50;
			} else {
				return 50 + 10 * ((move.pp * 1.6) - moveSlot.pp);
			}
		},
		secondary: null,
	},
	ominouswind: {
		inherit: true,
		isNonstandard: null,
		desc: "Forces the target out. 2x power if the user was hit.",
		shortDesc: "Forces the target out. 2x power if the user was hit.",
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			const damagedByTarget = pokemon.attackedBy.some(
				p => p.source === target && p.damage > 0 && p.thisTurn
			);
			if (damagedByTarget) {
				this.debug(`BP doubled for getting hit by ${target}`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		forceSwitch: true,
		secondary: null,
	},
	// status ghost
	grudge: {
		inherit: true,
		isNonstandard: null,
		priority: 1,
	},
	nightmare: {
		inherit: true,
		isNonstandard: null,
		desc: "A statused target is hurt 1/4 max HP per turn.",
		shortDesc: "A statused target is hurt 1/4 max HP per turn.",
		volatileStatus: 'nightmare',
		onTryHit(target, source, move) {
			if (!target?.status && !target.hasAbility('comatose')) return false;
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
	},
	spite: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spite",
		desc: "Copies, disables a foe's move. User must be faster.",
		shortDesc: "Copies, disables a foe's move. User must be faster.",
		pp: 20,
		priority: 0,
		flags: {
			protect: 1, bypasssub: 1,
			failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onTryHit(target, pokemon) {
			const action = this.queue.willMove(target);
			if (!action) return false;
			const move = this.dex.getActiveMove(action.move.id);
			target.lastMove = move;
			if (action.zmove || move.isZ || move.isMax) return false;
			if (target.volatiles['mustrecharge']) return false;
			if (move.category === 'Status' || move.flags['failmefirst']) return false;

			this.actions.useMove(move, pokemon, { target });
			target.addVolatile('spite');
			return null;
		},
		condition: {
			duration: 4,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (effect.effectType === 'Ability') {
					this.add('-start', pokemon, 'Spite', pokemon.lastMove, '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-start', pokemon, 'Spite', pokemon.lastMove);
				}
				const move = pokemon.lastMove;
				this.effectState.move = move;
			},
			onResidualOrder: 17,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Spite');
			},
			onBeforeMovePriority: 7,
			onBeforeMove(attacker, defender, move) {
				if (this.effectState.move.id === move.id) {
					this.add('cant', attacker, 'Spite', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.effectState.move.id === moveSlot.id) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Ghost",
	},
	trickortreat: {
		inherit: true,
		isNonstandard: null,
		desc: "50% chance to trick, 50% chance to treat.",
		shortDesc: "50% chance to trick, 50% chance to treat.",
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1 },
		onHit(target, source) {
			const random = this.random(2);
			if (random === 0) {
				const random2 = this.random(4);
				switch (random2) {
				case 0:
					const statuses = ['brn', 'par', 'slp', 'psn', 'frz'];
					source.trySetStatus(this.sample(statuses), source);
					break;
				case 1:
					const volatiles = ['taunt', 'torment', 'encore', 'disable'];
					source.addVolatile(this.sample(volatiles), source);
					break;
				case 2:
					this.actions.useMove("Trick", source, { target });
					break;
				case 3:
					this.damage(source.baseMaxhp / 4, source);
					break;
				}
			} else {
				const random2 = this.random(2);
				if (random2 === 0) source.cureStatus();
				else this.heal(source.baseMaxhp / 4, source);
			}
		},
	},
	confuseray: {
		inherit: true,
		priority: 1,
		desc: "Fails if target attacks. May cause target to disobey.",
		shortDesc: "Fails if target attacks. May cause target to disobey.",
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
		volatileStatus: 'confuseray',
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Confuse Ray', '[silent]');
				this.add('-message', `${pokemon.name} became disobedient!`);
			},
			onBeforeMove(pokemon, target, move) {
				if (this.random(2) === 0) {
					let rand = this.random(10);
					if (rand < 1) {
						if (pokemon.setStatus('slp', pokemon, move)) this.add('-message', `${pokemon.name} began to nap!`);
						else rand = 3;
					} else if (rand < 3) {
						this.add('-message', `${pokemon.name} won't obey!`);
						const damage = this.actions.getConfusionDamage(pokemon, 40);
						if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
						const activeMove = { id: this.toID('confused'), effectType: 'Move', type: '???' };
						this.damage(damage, pokemon, pokemon, activeMove as ActiveMove);
					} if (rand >= 3) {
						const noAttack = [
							'ignored orders!',
							'is loafing around!',
							'turned away!',
							'pretended not to notice!',
						];
						const noAttackSleep = 'ignored orders and kept sleeping!';
						this.add('-message', `${pokemon.name} ${(pokemon.status === 'slp' && ['sleeptalk', 'snore'].includes(move.id)) ? noAttackSleep : this.sample(noAttack)}`);
					}
					return null;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Confuse Ray', '[silent]');
				this.add('-message', `${pokemon.name} got its act together!`);
			},
		},
	},
	curse: {
		inherit: true,
		desc: "Curses if Shiny, else -1 Spe, +1 Atk, +1 Def.",
		shortDesc: "Curses if Shiny, else -1 Spe, +1 Atk, +1 Def.",
		onModifyMove(move, source, target) {
			if (!source.set.shiny) {
				move.target = move.nonGhostTarget!;
			} else if (source.isAlly(target)) {
				move.target = 'randomNormal';
			}
		},
		onTryHit(target, source, move) {
			const curses = [
				"butt", "booty", "blasted", "beach", "bloody HECK", "bugger", "doodoo", "carp", "dang",
				"frick", "HECK", "heck", "mf", "prickly", "nitwit", "shoot", "shut up", "twerp", "silly sausage",
			];
			this.add('-message', `${this.sample(curses)}!`);
			if (!source.set.shiny) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = { boosts: { spe: -1, atk: 1, def: 1 } };
			} else if (move.volatileStatus && target.volatiles['curse']) {
				return false;
			}
		},
	},
	destinybond: {
		inherit: true,
		pp: 1,
		noPPBoosts: true,
		desc: "Returns equal damage when hit. Single use.",
		shortDesc: "Returns equal damage when hit. Single use.",
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onDamagingHitOrder: 1,
			onDamagingHit(damage, target, source, move) {
				this.damage(damage, source, target);
			},
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, target, move) {
				if (move.id === 'destinybond') return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onMoveAborted(pokemon, target, move) {
				pokemon.removeVolatile('destinybond');
			},
		},
	},
	// nonghost
	knockoff: {
		inherit: true,
		basePower: 20,
	},
	lashout: {
		inherit: true,
		basePower: 60,
	},
	suckerpunch: {
		inherit: true,
		basePower: 60,
	},
	darkpulse: {
		inherit: true,
		basePower: 60,
	},
	bitterblade: {
		inherit: true,
		basePower: 75,
		flags: { contact: 1, protect: 1, mirror: 1, slicing: 1, heal: 1 },
	},
	flowertrick: {
		inherit: true,
		flags: { protect: 1, mirror: 1 },
	},
	powertrick: {
		inherit: true,
		flags: { snatch: 1 },
	},
	trick: {
		inherit: true,
		flags: { protect: 1, mirror: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
	},
	trickroom: {
		inherit: true,
		flags: { mirror: 1 },
	},
	grassyglide: {
		inherit: true,
		basePower: 70,
	},
	wordsdance: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Words Dance",
		shortDesc: "Confuses the target and lowers its Def/SpD by 2.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, dance: 1, sound: 1 },
		ignoreImmunity: { 'Normal': true },
		onPrepareHit(source, target, move) {
			// ana you are so lucky i don't have to shorten these
			const messages = [
				'L 🇱 RATIO ➗ READ MARX 🧔‍♂️ 📕 NO TOUHOU GIRLS 🔫 👧 🚫 CISHET 👨‍👩‍👦 NEUROTYPICAL 🧠 👨‍💼 CRINGE 😬 NO DRIP 🌧️ 🚫 GAME FUN HAPPY TIMES 游戏乐趣快乐时光 🎲 🎮 ACCELERATE ⏩ ACCELERATE ⏩ ACCELERATE ⏩ 🧞‍♂️ 🎣 🌇 🔋 🪡 SQUID GAMES ‼️',
				'Are you kidding ??? What the **** are you talking about man ? You are a biggest looser i ever seen in my life ! You was doing PIPI in your pampers when i was beating players much more stronger then you! You are not proffesional, because proffesionals knew how to lose and congratulate opponents, you are like a noob crying after i beat you! Be brave, be honest to yourself and stop this trush talkings!!! Everybody know that i am very good bh player, i can win anyone in the world in single game! And "c"ity "s"c is nobody for me, just a player who are crying every single time when loosing, ( remember what you say about Sevag ) !!! Stop playing with my name, i deserve to have a good name during whole my bh carrier, I am Officially inviting you to NDBH match with the Prize fund! Both of us will invest 5000$ and winner takes it all! I suggest all other people who\'s intrested in this situation, just take a look at my results in OMPL 8 and 9 tournaments, and that should be enough... No need to listen for every crying babe, ChampionLeonOM is always play Fair ! And if someone will continue Officially talk about me like that, we will meet in Court! God bless with true! True will never die ! Liers will kicked off...',
				'megas for all mismagius torment confusion alchemist araquanid no recover parasex flavor town megas for all sharting pot dragon heaven big button is watching pet mods gluke smogon kero megas for all dimrah pumpkin joltemons sylvemons farfetchd acid rock hematite boomer mentality flavor drama sexcadrill pet mods smogon pet mods bubble dies from cringe purple frong bat silvally pet mods',
				// 'Right here it says "UPS: Our Fastest Ground Shipping Ever." You know, what if it said "Our fastest and hardest boner?" Quickest, uh, speed for getting a boner? Alright, thanks guys.',
				'Pog sussy balls means nothing to you!?!? WTF! That’s one epic fail! You’re in the quite the pickle there Rick! Im rofling on the floor laughing AND firing my lazor AND you sir win teh interwebs AND le reddit gold if i do say so myself yessir yessir!',
			];
			this.add('-message', `${target.name} took a deep breath and said:`);
			this.attrLastMove('[still]');
			this.add('-anim', target, "Boomburst", source);
			this.add('-message', this.sample(messages));
		},
		volatileStatus: 'confusion',
		boosts: {
			def: -2,
			spd: -2,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	runch: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "+Grass effectiveness. Sets Leech Seed.",
		name: "Runch",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grassy Glide", target);
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Grass', type);
		},
		onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	ualchop: {
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		name: "Ual Chop",
		shortDesc: "Hits twice. 30% to lower highest offense.",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dual Chop", target);
		},
		multihit: 2,
		secondary: {
			chance: 30,
			onHit(target, source, move) {
				if (target.getStat('atk', false, true) > target.getStat('spa', false, true)) {
					return !!this.boost({ atk: -1 }, target, source, move);
				} else return !!this.boost({ spa: -1 }, target, source, move);
			},
		},
		target: "normal",
		type: "Dragon",
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	lackoff: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Lack Off",
		shortDesc: "Heals equal to the opponent's missing HP.",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Strength Sap", target);
		},
		onHit(target, source) {
			if (target.baseMaxhp === target.hp) return false;
			const toHeal = target.baseMaxhp - target.hp;
			console.log(target.baseMaxhp);
			console.log(target.hp);
			console.log(toHeal);
			return !!(this.heal(toHeal, source, target));
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	mindblown: {
		inherit: true,
		isNonstandard: null,
	},
	// spells
	shadowleap: {
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		shortDesc: "Heals 60 HP and switches out.",
		name: "Shadow Leap",
		pp: 1.25,
		priority: 0,
		flags: {
			protect: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Ipsum Instantarium!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shadow Sneak", target);
		},
		onAfterHit(target, source, move) {
			this.heal(60, source, source);
		},
		selfSwitch: true,
		target: "normal",
		type: "Ghost",
	},
	firebail: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Burns the target.",
		name: "FirebaIl",
		pp: 1.25,
		priority: 0,
		flags: {
			protect: 1, bullet: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Caputus Crepitus!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Searing Shot", target);
		},
		status: 'brn',
		target: "normal",
		type: "Fire",
	},
	blastjump: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		shortDesc: "Summons Super Jump and heals the user for 50 HP.",
		name: "Blast Jump",
		pp: 1.25,
		priority: 0,
		flags: {
			protect: 1, bullet: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		weather: 'superjump',
		onPrepareHit(target, source, move) {
			this.add('-message', `Amplus Tripudio!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "High Jump Kick", target);
		},
		self: {
			onHit(pokemon) {
				this.heal(50, pokemon);
			},
		},
		target: "normal",
		type: "Fighting",
	},
	overheal: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Gives the user Ubercharge and heals it for 1/8 max HP for 3 turns.",
		name: "Overheal",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Barpo Kabalto!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Geomancy", target);
		},
		onHit(pokemon) {
			pokemon.addVolatile('ubercharge');
		},
		volatileStatus: 'overheal',
		condition: {
			duration: 3,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Overheal');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 8);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Overheal');
			},
		},
		target: "self",
		type: "Normal",
	},
	batswarm: {
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		shortDesc: "Poisons the target.",
		name: "Bat Swarm",
		pp: 1.25,
		priority: 0,
		flags: {
			protect: 1, contact: 1, mirror: 1, failencore: 1, failmefirst: 1,
			nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Deus Invictus!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Gunk Shot", target);
		},
		status: 'psn',
		target: "normal",
		type: "Poison",
	},
	pumpkinmirv: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "If the user attacks first after this turn, the target loses 1/2 max HP. Disappears if the target attacks first.",
		name: "Pumpkin MIRV",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, bullet: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Pactum Diabolus!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Leech Seed", target);
		},
		volatileStatus: 'pumpkinmirv',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Pumpkin MIRV', '[silent]');
				this.add('-message', `Pumpkin bombs were scattered around ${pokemon.name}!`);
			},
			onAfterMove(pokemon, target, move) {
				if (move.category !== 'Status') {
					pokemon.removeVolatile('Pumpkin MIRV');
					this.add('-message', `The pumpkin bombs around ${pokemon.name} disappeared!`);
				}
			},
			onDamagingHit(damage, target, source, move) {
				if (source !== target) {
					this.add('-message', 'The pumpkin bombs exploded!');
					this.damage(target.baseMaxhp / 2, target, source);
					target.removeVolatile('Pumpkin MIRV');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Pumpkin MIRV', '[silent]');
			},
		},
		target: "normal",
		type: "Fire",
	},
	stealth: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals 100 HP; taunted, doubled evasion for one turn.",
		name: "Stealth",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Barpo Invisium!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shadow Force", target);
		},
		volatileStatus: 'stealth',
		condition: {
			duration: 2,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Stealth');
				this.heal(100, pokemon, pokemon);
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return this.chainModify(0.5);
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					const move = this.dex.moves.get(moveSlot.id);
					if (move.category === 'Status' && move.id !== 'spite') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Stealth');
			},
		},
		target: "self",
		type: "Ghost",
	},
	monoculus: {
		accuracy: 100,
		basePower: 0,
		category: "Special",
		shortDesc: "Deals 150 damage. 50 BP move at the end of the turn for 2 turns.",
		name: "MONOCULUS!",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, bullet: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1, /* summon: 1, */
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Invokum MONOCULUS!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Steel Beam", target);
			this.damage(150, target, source);
			if (!target.side.addSlotCondition(target, 'summon')) return false;
			Object.assign(target.side.slotConditions[target.position]['summon'], {
				duration: 2,
				source,
				move,
				position: target.position,
				side: target.side,
				moveData: {
					id: 'monoculus',
					name: "MONOCULUS!",
					accuracy: 100,
					basePower: 40,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Steel',
				},
			});
		},
		target: "normal",
		type: "Steel",
	},
	skeletonhorde: {
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		shortDesc: "50 BP move at the end of the turn for 5 turns.",
		name: "Skeleton Horde",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failinstruct: 1, failmimic: 1, /* summon: 1, */
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Mortis Animataris!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shadow Bone", target);
			if (!target.side.addSlotCondition(target, 'summon')) return false;
			Object.assign(target.side.slotConditions[target.position]['summon'], {
				duration: 5,
				source,
				move,
				position: target.position,
				side: target.side,
				moveData: {
					id: 'skeletonhorde',
					name: "Skeleton Horde",
					accuracy: 100,
					basePower: 50,
					category: "Physical",
					priority: 0,
					flags: { allyanim: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Ground',
				},
			});
		},
		target: "normal",
		type: "Ground",
	},
	ballolightning: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		shortDesc: "Traps the target. 50 BP move at the end of the turn for 3 turns.",
		name: "Ball O' Lightning",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, bullet: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failinstruct: 1, failmimic: 1, /* summon: 1, */
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Imputum Fulmenus!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Electro Ball", target);
			if (!target.side.addSlotCondition(target, 'summon')) return false;
			Object.assign(target.side.slotConditions[target.position]['summon'], {
				duration: 3,
				source,
				move,
				position: target.position,
				side: target.side,
				moveData: {
					id: 'balloflightning',
					name: "Ball O' Lightning",
					accuracy: 100,
					basePower: 50,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Electric',
				},
			});
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			},
		},
		target: "normal",
		type: "Electric",
	},
	meteorshower: {
		accuracy: 85,
		basePower: 50,
		category: "Special",
		shortDesc: "Hits 3 times.",
		name: "Meteor Shower",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, mirror: 1, bullet: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Seismela Tremoro!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Draco Meteor", target);
		},
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	minify: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User recovers 100 HP and doubles evasion, but damage taken is doubled and forces the user out.",
		name: "Minify",
		pp: 0.625,
		priority: 0,
		flags: {
			protect: 1, mirror: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onPrepareHit(target, source, move) {
			this.add('-message', `Barpo Invisium!`);
			this.attrLastMove('[still]');
			this.add('-anim', source, "Minimize", target);
		},
		volatileStatus: 'minify',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Minify');
				this.heal(100, pokemon, pokemon);
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return this.chainModify(0.5);
			},
			onSourceModifyDamage(damage, source, target, move) {
				return this.chainModify(2);
			},
			onDamagingHit(damage, target, source, move) {
				target.removeVolatile('minify');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Minify');
				pokemon.forceSwitchFlag = true;
			},
		},
		target: "self",
		type: "Fairy",
	},
};
