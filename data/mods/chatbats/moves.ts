export const Moves: { [moveid: string]: ModdedMoveData } = {
	ancientpower: {
		inherit: true,
		category: "Physical",
		secondary: null,
		// Ancient Power is physical and boosts on-kill
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) {
				this.boost({ atk: 1, def: 1, spa: 1, spd: 1, spe: 1 }, pokemon, pokemon, move);
			}
		},
		desc: "If this move causes the opponent to faint, raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "Raise all stats by 1 if this move KOs the target.",
	},
	sandsearstorm: {
		// Now always hits in Sand in addition to Rain
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'sandstorm'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
	},
	mountainmaw: {
		// Copied from Psychic Fangs, just changed to be Rock type
		num: -101,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Mountain Maw",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Crunch', target);
			this.add('-anim', source, 'Rock Slide', target);
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Clever",
		shortDesc: "Breaks Screens.",
		desc: "Breaks Screens.",
	},
	steelwing: {
		// Buffed secondary chance to 50%
		inherit: true,
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	scavenge: {
		num: -102,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Scavenge",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Tough",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Thief', target);
		},
		onAfterMove(source) {
			if (source.lastItem) {
				const item = source.lastItem;
				source.lastItem = '';
				source.setItem(item);
				this.add('-item', source, this.dex.items.get(item), '[from] move: Scavenge');
			} else {
				return null;
			}
		},
		shortDesc: "User regains their last used item, similar to Recycle.",
		desc: "If the user has consumed their item, it will be restored.",
	},
	aquaring: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
			onSourceModifyAtkPriority: 5,
			onSourceModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(0.5);
				}
			},
			onSourceModifySpAPriority: 5,
			onSourceModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(0.5);
				}
			},
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Water') {
					return this.chainModify(2);
				}
			},
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Water') {
					return this.chainModify(2);
				}
			},
		},
		shortDesc: "User Water power 2x, takes 0.5x Fire damage. Recover 1/16 max HP per turn.",
		desc: "User recovers 1/16 max HP per turn. While this is active, this Pokemon's Water power is 2x and Fire power against it is halved.",
	},

	ragingbull: {
		num: 9999,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		priority: 0,
		pp: 10,
		name: "Raging Bull",
		type: "Normal",
		effectType: "Move",
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		shortDesc: "Changes type to the most effective against the target (Water, Fighting, Fire, or Normal).",
		desc: "Changes the move's and user's forme to the most effective against the target (Water, Fighting, Fire, or Normal).",
		beforeMoveCallback(source, target, move) {
			const typeEffectiveness = {
				Normal: this.dex.getEffectiveness('Normal', target),
				Water: this.dex.getEffectiveness('Water', target),
				Fighting: this.dex.getEffectiveness('Fighting', target),
				Fire: this.dex.getEffectiveness('Fire', target),
			};

			let bestType = 'Normal';
			let maxEffectiveness = -Infinity;
			// gets most effective type against target (defaults to normal)
			for (const type in typeEffectiveness) {
				if (typeEffectiveness[type] > maxEffectiveness) {
					maxEffectiveness = typeEffectiveness[type];
					bestType = type;
				}
			}
			// changes form to match most effective type
			let forme = '';
			switch (bestType):
			case 'Water': forme = '-Paldea-Aqua'; break;
			case 'Fighting': forme = '-Paldea-Combat'; break;
			case 'Fire': forme= '-Paldea-Blaze'; break;
			
			source.formeChange('Tauros' + forme);
			source.setAbility('Adaptability');
			this.add('-ability', source, 'Adaptability');

			source.m.ragingBullMoveType = bestType;
		},
		// animation was remnant of Techno Blast code being copied, decided to keep because funny
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Techno Blast', target);
		},
		// sets type properly (failsafe)
		onModifyType(move, pokemon, target) {
			if (pokemon.m.ragingBullMoveType) {
				move.type = pokemon.m.ragingBullMoveType;
			}
		},
		target: "normal",
	},
	iciclestorm: {
		num: -1044,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		name: "Icicle Storm",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Ice Shard', target);
			this.add('-anim', source, 'Ice Shard', target);
			this.add('-anim', source, 'Ice Shard', target);
		},
		self: {
			onHit(source) {
				this.field.setWeather('snowscape');
			},
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Clever",
		desc: "Sets Snow on-hit.",
		shortDesc: "Sets Snow.",
	},
	springtidestorm: {
		// Now always hits in Sand in addition to Rain
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['sandstorm', 'raindance'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
	},
	// Poison type now
	spitup: {
		inherit: true,
		type: "Poison",
	},
	// clone of shell side arm (modified to be base Physical so the randbats algorithm gives Attack EVs to Phione
	geyser: {
		num: -104,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Geyser",
		pp: 10,
		priority: 0,
		flags: { protect: 1, contact: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onModifyMove(move, pokemon, target) {
			if (!target) return;
			const atk = pokemon.getStat('atk', false, true);
			const spa = pokemon.getStat('spa', false, true);
			const def = target.getStat('def', false, true);
			const spd = target.getStat('spd', false, true);
			const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
			const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
			if (physical < special || (physical === special && this.randomChance(1, 2))) {
				move.category = 'Special';
				move.flags.contact = 0;
			}
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Water Spout', target);
		},
		onHit(target, source, move) {
			// Shell Side Arm normally reveals its category via animation on cart, but doesn't play either custom animation against allies
			if (!source.isAlly(target)) this.hint(move.category + " Geyser");
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!source.isAlly(target)) this.hint(move.category + " Geyser");
		},
		secondary: null,
		target: "normal",
		type: "Water",
		desc: "This move is Special + no contact if it would be stronger.",
		shortDesc: "This move is Special + no contact if it would be stronger.",
	},
	// Encore + Rain Dance
	tidalsurge: {
		num: -105,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Tidal Surge",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Surf', target);
		},
		onHit(target, source, move) {
			this.add('-anim', source, 'Encore', target);
			target.addVolatile('encore');
		},
		weather: 'raindance',
		secondary: null,
		target: "normal",
		type: "Water",
		zMove: { boost: { atk: 1 } },
		contestType: "Beautiful",
		desc: "Encore + Rain Dance",
		shortDesc: "Encore + Rain Dance",
	},
	// prio + double power if opponent is using a water move
	bonsaibounce: {
		num: -106,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Bonsai Bounce",
		pp: 10,
		priority: 0,
		flags: { protect: 1, contact: 1, mirror: 1, metronome: 1 },
		// checks for water move usage from opponent
		onModifyPriority(priority, source) {
			// gets current foe in singles
			const foe = source.foes()[0];
			if (!foe || foe.fainted) {
				return priority;
			}
			// gets attack of foe this turn
			const action = this.queue.willMove(foe);
			if (!action || action.choice !== 'move') {
				return priority;
			}
			const move = action.move;
			if (move?.type === 'Water') {
				return priority + 1;
			} else {
				return priority;
			}
			return priority;
		},
		// modifies base power
		onBasePower(basePower, source, target) {
			const foe = source.foes()[0];
			if (!foe || foe.fainted) {
				return basePower;
			}
			const action = this.queue.willMove(foe);
			if (!action || action.choice !== 'move') {
				return basePower;
			}
			const move = action.move;
			if (move?.type === 'Water') {
				this.add('-message', `Sudowoodo draws power from the water!`);
				return basePower + 70;
			} else {
				return basePower;
			}
			return basePower;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Ivy Cudgel Rock', target);
			this.add('-anim', source, 'Splash');
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
		shortDesc: "+1 Priority and 2x power if target is using a Water move.",
		desc: "If the target is using a Water type move, this move will always move first and gains double power.",
	},
	ironstrike: {
		// implemented via changes to Stealth Rocks and Spikes
		num: -107,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Iron Strike",
		pp: 15,
		priority: 0,
		flags: { protect: 1, contact: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Metal Claw', target);
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
		shortDesc: "Inflicts damage from hazards on target's side.",
		desc: "Target takes damage from all entry hazards on their side of the field, unless they are immune.",
	},
	thunderouskick: {
		inherit: true,
		secondary: null,
		onHit(target, source, move) {
			// random # 0 or 1
			const randomNum = Math.round(Math.random());
			// 50% chance to drop def
			if (randomNum === 0) {
				if (target.boosts.def !== -6) {
					this.boost({ def: -1 }, target, source, move);
				}
			} else {
				this.add('-message', `${source.name} follows up with a Thunder Kick!`);
				// defines Thunder Kick
				const thunderKick = {
					name: "Thunder Kick",
					type: "Electric",
					basePower: 50,
					accuracy: 100,
					category: "Physical",
					priority: 0,
					onTryMove() {
						this.attrLastMove('[still]');
					},
					onPrepareHit(target, source, move) {
						this.add('-anim', source, 'High Jump Kick', target);
						this.add('-anim', source, 'Thunder', target);
					},
					flags: { contact: true, protect: true },
				};
				// uses Thunder Kick
				this.actions.useMove(thunderKick, source, target);
			}
		},
		desc: "50% chance to reduce Defense by 1, 50% chance to inflict an additional 50 BP Electric type damage.",
		shortDesc: "50% -1 Defense, 50% extra 50 BP Electric damage.",
	},
	stealthrock: {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'stealthrock',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				// hardcode to prevent hazard damage during Order Up switches + enforce hazard damage while King of the Hill is active
				if ((pokemon.hasItem('heavydutyboots') && !pokemon.side.getSideCondition('kingofthehill')) ||
					pokemon.side.getSideCondition('orderup')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
			// iron strike functionality (reapplies stealth rock damage when hit with Iron Strike)
			onHit(pokemon, source, move) {
				if (move.id === 'ironstrike') {
					if (pokemon.hasItem('heavydutyboots')) return;
					const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
					this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Rock",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
	},
	spikes: {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spikes",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'spikes',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				// Order Up + king of the hill functionality
				if (((!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) && !pokemon.side.getSideCondition('kingofthehill')) ||
					pokemon.side.getSideCondition('orderup')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
			// iron strike functionality
			onHit(pokemon, source, move) {
				if (move.id === 'ironstrike') {
					if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
					const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
					this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Ground",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	orderup: {
		num: 856,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Order Up",
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		condition: {
			duration: 2,
			onSwitchInPriority: -1,
			onSwitchIn(pokemon) {
				// when Dondozo switches back in after eating, it gains boost
				if (pokemon.baseSpecies.baseSpecies === 'Dondozo') {
					// reapplies volatiles and stat boosts
					if (pokemon.storedVolatiles) {
						for (const volatile in pokemon.storedVolatiles) {
							pokemon.addVolatile(volatile);
						}
					}
					if (pokemon.storedBoosts) {
						for (const stat in pokemon.storedBoosts) {
							const change = pokemon.storedBoosts[stat];
							if (change !== 0) {
								this.boost({ [stat]: change }, pokemon);
							}
						}
					}
					this.add('-message', `Dondozo enjoyed its meal!`);
					// applies boost based on eaten mon stats
					if (this.effectState.eatenBoost === 'atk' || this.effectState.eatenBoost === 'spa') {
						this.boost({ atk: 3 }, pokemon);
					} else if (this.effectState.eatenBoost === 'def' || this.effectState.eatenBoost === 'spd') {
						this.boost({ def: 2, spd: 2 }, pokemon);
					} else {
						this.boost({ spe: 3 }, pokemon);
					}
					// adds volatile ordered, which prevents the order up effect from occuring again until Dondozo switches out
					pokemon.addVolatile('ordered');
					// removes the side condition
					pokemon.side.removeSideCondition('orderup');
				} else {
					// after Dondozo switches out, this happens to the next pokemon that is switched in
					const meal = pokemon;
					// faints the eaten mon
					pokemon.faint();
					// finds highest stat of eaten mon, stored in effectState eatenBoost
					const stats = ['atk', 'def', 'spa', 'spd', 'spe'];
					let highestStat = stats[0];
					let maxStatValue = meal.storedStats[highestStat];

					for (const stat of stats) {
						if (meal.storedStats[stat] > maxStatValue) {
							highestStat = stat;
							maxStatValue = meal.storedStats[stat];
						}
					}
					this.effectState.eatenBoost = highestStat;
				}
			},
			onFaint(pokemon) {
				const side = pokemon.side;
				const dondozo = side.pokemon.find(p => p.species.name === 'Dondozo' && !p.fainted);
				if (!dondozo) return;
				// forces Dondozo in after the eaten mon faints
				this.queue.insertChoice({
					choice: 'switch',
					pokemon,
					target: dondozo,
				});
				this.checkFainted();
			},
		},
		// when order up hits, first checks for volatile ordered to ensure that Order Up has not already been used, then starts orderup side condition and switches Dondozo out
		onHit(target, source, move) {
			if (source.volatiles['ordered']) return;
			if (source.id === 'mew') return;
			source.side.addSideCondition('orderup');
			// stores stat changes and volatiles to reapply after switch
			source.storedBoosts = { ...source.boosts };
			source.storedVolatiles = {};
			for (const volatile in source.volatiles) {
				source.storedVolatiles[volatile] = source.volatiles[volatile];
			}
			if (source.side.getSideCondition('orderup')) {
				this.add('-ability', source, 'Order Up');
				this.add('-message', `Select the Pokemon you would like to eat. Its highest base stat affects the boost you gain from this move.`);
			}
			source.switchFlag = true;
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
		type: "Dragon",
		desc: "Dondozo eats a mon on the user's team, KOing it. Dondozo then gains a stat boost depending on the eaten mon's highest stat: +3 Attack for Atk/SpA, +2 Def/+2 SpD for Def/SpD, and +3 Speed for Speed.",
		shortDesc: "Dondozo orders up a meal. Dondozo gains stat boosts based on the highest stat of the Pokemon it eats.",
	},
	toxicspikes: {
		// prevents Dondozo from being affected by Toxic Spikes during Order Up switching
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				// hardcode for King of the Hill
				if (!pokemon.isGrounded() && !pokemon.side.getSideCondition('kingofthehill')) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
					// hardcode for King of the Hill and Order Up
				} else if (
					pokemon.hasType('Steel') ||
					(pokemon.hasItem('heavydutyboots') && !pokemon.side.getSideCondition('kingofthehill')) ||
					pokemon.side.getSideCondition('orderup')
				) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				// king of the hill
				if ((!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) &&
					!pokemon.side.getSideCondition('kingofthehill')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	shatteredseal: {
		num: -1002,
		accuracy: true,
		basePower: 90,
		category: "Physical",
		name: "Shattered Seal",
		pp: 15,
		pseudoWeather: 'gravity',
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Spite', target);
			this.add('-anim', source, 'Spirit Shackle', target);
		},
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
		desc: "Sets gravity.",
		shortDesc: "Sets gravity.",
	},
	alloutassault: {
		num: -1003,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "All-Out Assault",
		pp: 5,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'All-Out Pummeling', target);
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) {
				this.boost({ atk: 1 }, pokemon, pokemon, move);
			} else {
				this.boost({ atk: -1 }, pokemon, pokemon, move);
			}
		},
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Clever",
		desc: "If this move KOs the target, raise the user's attack by 1. Otherwise, lower attack by 1.",
		shortDesc: "On KO: +1 Atk. Otherwise -1 Atk.",
	},
	wickedblow: {
		num: 817,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Wicked Blow",
		pp: 5,
		priority: 0,
		beforeMoveCallback(source, target, move) {
			this.effectState.surgingStrikesAlreadyUsed = 0;
			this.add('-anim', source, 'Techno Blast', target);
			const typeEffectiveness = {
				Water: this.dex.getEffectiveness('Water', target),
				Dark: this.dex.getEffectiveness('Dark', target),
			};

			let bestType = 'Water';
			let maxEffectiveness = -Infinity;
			// gets most effective type against target (defaults to the current type)
			for (const type in typeEffectiveness) {
				if (typeEffectiveness[type] > maxEffectiveness) {
					maxEffectiveness = typeEffectiveness[type];
					bestType = type;
				}
			}
			// changes form to match most effective type
			if (bestType === 'Dark') {
				this.add('-message', `Urshifu takes pity on its foe and transforms into a weaker type!`);
				source.formeChange('Urshifu-Rapid-Strike', source, true);
				source.setAbility('Sniper');
				this.add('-ability', source, 'Sniper');
				const oldMove = 'wickedblow';
				const newMove = 'surgingstrikes';

				const oldMoveId = this.toID(oldMove);
				const newMoveData = this.dex.moves.get(newMove);

				for (const slot of source.moveSlots) {
					if (slot.id === oldMoveId) {
						slot.move = newMoveData.name;
						slot.id = newMoveData.id;
						slot.pp = newMoveData.pp;
						slot.maxpp = newMoveData.pp;
						slot.target = newMoveData.target;
						slot.disabled = false;
						slot.used = false;
						break;
					}
				}
				source.baseMoveSlots = source.moveSlots.slice();
				this.actions.useMove('surgingstrikes', source, target);
				this.effectState.surgingStrikesAlreadyUsed = 1;
			}
		},
		onTry(source, target, move) {
			if (this.effectState.surgingStrikesAlreadyUsed === 1) {
				return null;
			}
		},
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
		type: "Dark",
		desc: "This move will transform into Rapid Strike Urshifu/Surging Strikes if it would be less effective against the target.",
		shortDesc: "Becomes Surging Strikes if it would be less effective.",
	},
	surgingstrikes: {
		num: 818,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Surging Strikes",
		pp: 5,
		priority: 0,
		beforeMoveCallback(source, target, move) {
			this.effectState.wickedBlowAlreadyUsed = 0;
			this.add('-anim', source, 'Techno Blast', target);
			const typeEffectiveness = {
				Dark: this.dex.getEffectiveness('Dark', target),
				Water: this.dex.getEffectiveness('Water', target),
			};

			let bestType = 'Dark';
			let maxEffectiveness = -Infinity;
			// gets most effective type against target (defaults to the current type)
			for (const type in typeEffectiveness) {
				if (typeEffectiveness[type] > maxEffectiveness) {
					maxEffectiveness = typeEffectiveness[type];
					bestType = type;
				}
			}
			// changes form to match most effective type
			if (bestType === 'Water') {
				this.add('-message', `Urshifu takes pity on its foe and transforms into a weaker type!`);
				source.formeChange('Urshifu', source, true);
				source.setAbility('Sniper');
				this.add('-ability', source, 'Sniper');
				const oldMove = 'surgingstrikes';
				const newMove = 'wickedblow';

				const oldMoveId = this.toID(oldMove);
				const newMoveData = this.dex.moves.get(newMove);

				for (const slot of source.moveSlots) {
					if (slot.id === oldMoveId) {
						slot.move = newMoveData.name;
						slot.id = newMoveData.id;
						slot.pp = newMoveData.pp;
						slot.maxpp = newMoveData.pp;
						slot.target = newMoveData.target;
						slot.disabled = false;
						slot.used = false;
						break;
					}
				}
				source.baseMoveSlots = source.moveSlots.slice();
				this.actions.useMove('wickedblow', source, target);
				this.effectState.wickedBlowAlreadyUsed = 1;
			}
		},
		onTry(source, target, move) {
			if (this.effectState.wickedBlowAlreadyUsed === 1) {
				return null;
			}
		},
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		willCrit: true,
		multihit: 3,
		secondary: null,
		target: "normal",
		type: "Water",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		desc: "This move will transform into Single Strike Urshifu/Wicked Blow if it would be less effective against the target.",
		shortDesc: "Becomes Wicked Blow if it would be less effective.",
	},
	twister: {
		num: 239,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Twister",
		pp: 20,
		priority: 0,
		onHit(target, source, move) {
			let success = !!this.boost({ evasion: -1 });
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Dragon",
		contestType: "Cool",
		desc: "Removes hazards, side conditions, and terrain. Lowers Evasion by 1.",
		shortDesc: "-1 evasion; ends user and target hazards/terrain.",
	},
	magnetbomb: {
		num: 443,
		accuracy: true,
		basePower: 90,
		category: "Special",
		name: "Magnet Bomb",
		pp: 20,
		priority: 0,
		onHit(target, source, move) {
			target.setType('Steel');
			this.add('-start', target, 'typechange', 'Steel');
		},
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
		desc: "Changes the target's type to Steel.",
		shortDesc: "Changes the target's type to Steel.",
	},
};
