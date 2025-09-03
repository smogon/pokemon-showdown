export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
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
			if (target) {
				const typeEffectiveness: { [k: string]: number } = {
					Normal: this.dex.getEffectiveness('Normal', target),
					Water: this.dex.getEffectiveness('Water', target),
					Fighting: this.dex.getEffectiveness('Fighting', target),
					Fire: this.dex.getEffectiveness('Fire', target),
				};
				let bestType = 'Normal';
				let type: keyof typeof typeEffectiveness;
				let maxEffectiveness = -Infinity;
				// gets most effective type against target (defaults to normal)
				for (type in typeEffectiveness) {
					if (typeEffectiveness[type] > maxEffectiveness) {
						maxEffectiveness = typeEffectiveness[type];
						bestType = type;
					}
				}
				// changes form to match most effective type
				let forme = '';
				switch (bestType) {
				case 'Water': forme = '-Paldea-Aqua'; break;
				case 'Fighting': forme = '-Paldea-Combat'; break;
				case 'Fire': forme = '-Paldea-Blaze'; break;
				}
				source.formeChange('Tauros' + forme);
				this.add('-ability', source, 'Adaptability');
				source.m.ragingBullMoveType = bestType;
			}
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
		flags: { protect: 1, mirror: 1, metronome: 1 },
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
				move.flags.contact = undefined;
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
	thunderkick: {
		num: -1192,
		name: "Thunder Kick",
		type: "Electric",
		basePower: 50,
		accuracy: 100,
		category: "Physical",
		priority: 0,
		pp: 5,
		target: "normal",
		contestType: "Beautiful",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(t, s, m) {
			this.add('-anim', s, 'High Jump Kick', t);
			this.add('-anim', s, 'Thunder', t);
		},
		flags: { contact: 1, protect: 1 },
	},
	thunderouskick: {
		inherit: true,
		secondary: null,
		onHit(target, source, move) {
			// random # 0 or 1
			const randomNum = this.random(2);
			// 50% chance to drop def
			if (randomNum === 0) {
				if (target.boosts.def !== -6) {
					this.boost({ def: -1 }, target, source, move);
				}
			} else {
				this.add('-message', `${source.name} follows up with a Thunder Kick!`);
				// uses Thunder Kick
				this.actions.useMove('thunderkick', source, { target });
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
					if ((pokemon as any).storedVolatiles) {
						for (const volatile in (pokemon as any).storedVolatiles) {
							pokemon.addVolatile(volatile);
						}
					}
					if ((pokemon as any).storedBoosts) {
						for (const stat in (pokemon as any).storedBoosts) {
							const change = (pokemon as any).storedBoosts[stat as BoostID];
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
					let maxStatValue = meal.storedStats[highestStat as StatIDExceptHP];

					for (const stat of stats) {
						if (meal.storedStats[stat as StatIDExceptHP] > maxStatValue) {
							highestStat = stat;
							maxStatValue = meal.storedStats[stat as StatIDExceptHP];
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
			if (source.species.id === 'mew') return;
			source.side.addSideCondition('orderup');
			// stores stat changes and volatiles to reapply after switch
			(source as any).storedBoosts = { ...source.boosts };
			(source as any).storedVolatiles = {};
			for (const volatile in source.volatiles) {
				(source as any).storedVolatiles[volatile] = source.volatiles[volatile];
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
		inherit: true,
		beforeMoveCallback(source, target, move) {
			if (target) {
				this.effectState.surgingStrikesAlreadyUsed = 0;
				this.add('-anim', source, 'Techno Blast', target);
				const typeEffectiveness: { [k: string]: number } = {
					Water: this.dex.getEffectiveness('Water', target),
					Dark: this.dex.getEffectiveness('Dark', target),
				};
				let type: keyof typeof typeEffectiveness;
				let bestType = 'Water';
				let maxEffectiveness = -Infinity;
				// gets most effective type against target (defaults to the current type)
				for (type in typeEffectiveness) {
					if (typeEffectiveness[type] > maxEffectiveness) {
						maxEffectiveness = typeEffectiveness[type];
						bestType = type;
					}
				}
				// changes form to match most effective type
				if (bestType === 'Dark') {
					this.add('-message', `Urshifu takes pity on its foe and transforms into a weaker type!`);
					source.formeChange('Urshifu-Rapid-Strike', null, true);
					source.setAbility('Sniper');
					this.add('-ability', source, 'Sniper');
					const oldMove = 'wickedblow';
					const newMove = 'surgingstrikes';
					const oldMoveId = this.toID(oldMove);
					const newMoveData = this.dex.moves.get(newMove);
					const oldMoveIdx = source.moveSlots.findIndex(x => x.id === oldMoveId);
					if (oldMoveIdx >= 0) {
						source.moveSlots[oldMoveIdx] = source.baseMoveSlots[oldMoveIdx] = {
							move: newMoveData.name,
							id: newMoveData.id,
							pp: newMoveData.pp,
							maxpp: newMoveData.pp,
							target: newMoveData.target,
							disabled: false,
							used: false,
						};
					}
					this.actions.useMove('surgingstrikes', source, { target });
					this.effectState.surgingStrikesAlreadyUsed = 1;
				}
			}
		},
		onTry(source, target, move) {
			if (this.effectState.surgingStrikesAlreadyUsed === 1) {
				return null;
			}
		},
		desc: "This move will transform into Rapid Strike Urshifu/Surging Strikes if it would be less effective against the target.",
		shortDesc: "Becomes Surging Strikes if it would be less effective.",
	},
	surgingstrikes: {
		inherit: true,
		beforeMoveCallback(source, target, move) {
			if (source.species.id === 'araquanid') return;
			if (target) {
				this.effectState.wickedBlowAlreadyUsed = 0;
				this.add('-anim', source, 'Techno Blast', target);
				const typeEffectiveness: { [k: string]: number } = {
					Dark: this.dex.getEffectiveness('Dark', target),
					Water: this.dex.getEffectiveness('Water', target),
				};
				let type: keyof typeof typeEffectiveness;
				let bestType = 'Dark';
				let maxEffectiveness = -Infinity;
				// gets most effective type against target (defaults to the current type)
				for (type in typeEffectiveness) {
					if (typeEffectiveness[type] > maxEffectiveness) {
						maxEffectiveness = typeEffectiveness[type];
						bestType = type;
					}
				}
				// changes form to match most effective type
				if (bestType === 'Water') {
					this.add('-message', `Urshifu takes pity on its foe and transforms into a weaker type!`);
					source.formeChange('Urshifu', null, true);
					source.setAbility('Sniper');
					this.add('-ability', source, 'Sniper');
					const newMove = 'wickedblow';
					const oldMoveId: ID = 'surgingstrikes' as ID;
					const newMoveData = this.dex.moves.get(newMove);
					const oldMoveIdx = source.moveSlots.findIndex(x => x.id === oldMoveId);
					if (oldMoveIdx >= 0) {
						source.moveSlots[oldMoveIdx] = source.baseMoveSlots[oldMoveIdx] = {
							move: newMoveData.name,
							id: newMoveData.id,
							pp: newMoveData.pp,
							maxpp: newMoveData.pp,
							target: newMoveData.target,
							disabled: false,
							used: false,
						};
					}
					this.actions.useMove('wickedblow', source, { target });
					this.effectState.wickedBlowAlreadyUsed = 1;
				}
			}
		},
		onTry(source, target, move) {
			if (this.effectState.wickedBlowAlreadyUsed === 1) {
				return null;
			}
		},
		desc: "This move will transform into Single Strike Urshifu/Wicked Blow if it would be less effective against the target. Does not work with Araquanid.",
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
	triplekick: {
		inherit: true,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
	},
	freezingglare: {
		inherit: true,
		secondary: {
			chance: 30,
			onHit(target, source, move) {
				if (!target.hasType('Ice')) {
					target.trySetStatus('frostbite', source, move);
				}
			},
		},
		desc: "30% chance to inflict Frostbite.",
		shortDesc: "30% chance to inflict Frostbite.",
	},
	zippyzap: {
		inherit: true,
		category: "Special",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Speed', target);
			this.add('-anim', source, 'Thunder', target);
		},
		secondary: null,
		desc: "Nearly always goes first.",
		shortDesc: "Nearly always goes first.",
	},
	burnout: {
		num: -1004,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Burn Out",
		pp: 20,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'U-turn', target);
		},
		onHit(target, source, move) {
			if (source.species.id === 'jolteon' || source.species.id === 'vaporeon') {
				this.add('-message', `Eevee uses its Fire Stone!`);
				const currentHP = source.hp / source.maxhp;
				source.formeChange('Flareon', null, true);
				source.sethp(source.maxhp * currentHP);
				this.add('-sethp', source, source.getHealth, '[from] move: Flip Turn', '[silent]');
				// target.setAbility('Eeveelution');
				// target.baseAbility = target.ability;
				const newMoves = ['flipturn', 'voltswitch', 'sizzlyslide', 'bbqbeatdown'];
				// Update move slots
				// eslint-disable-next-line @typescript-eslint/no-shadow
				source.moveSlots = newMoves.map(move => {
					const moveData = this.dex.moves.get(move);
					return {
						move: moveData.name,
						id: moveData.id,
						pp: moveData.pp,
						maxpp: moveData.pp,
						target: moveData.target,
						disabled: false,
						used: false,
					};
				});
				// this forces the UI to update move slots visually
				(source as any).baseMoveSlots = source.moveSlots.slice();
			}
		},
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Cute",
		desc: "User switches out after damaging the target.",
		shortDesc: "User switches out after damaging the target.",
	},
	voltswitch: {
		inherit: true,
		onHit(target, source, move) {
			if (source.species.id === 'flareon' || source.species.id === 'vaporeon') {
				this.add('-message', `Eevee uses its Thunder Stone!`);
				const currentHP = source.hp / source.maxhp;
				source.formeChange('Jolteon', null, true);
				source.sethp(source.maxhp * currentHP);
				this.add('-sethp', source, source.getHealth, '[from] move: Flip Turn', '[silent]');
				// target.setAbility('Eeveelution');
				// target.baseAbility = target.ability;
				const newMoves = ['flipturn', 'burnout', 'zippyzap', 'freezyfrost'];
				// Update move slots
				// eslint-disable-next-line @typescript-eslint/no-shadow
				source.moveSlots = newMoves.map(move => {
					const moveData = this.dex.moves.get(move);
					return {
						move: moveData.name,
						id: moveData.id,
						pp: moveData.pp,
						maxpp: moveData.pp,
						target: moveData.target,
						disabled: false,
						used: false,
					};
				});
				// this forces the UI to update move slots visually
				(source as any).baseMoveSlots = source.moveSlots.slice();
			}
		},
	},
	flipturn: {
		inherit: true,
		onHit(target, source, move) {
			if (source.species.id === 'jolteon' || source.species.id === 'flareon') {
				this.add('-message', `Eevee uses its Water Stone!`);
				const currentHP = source.hp / source.maxhp;
				source.formeChange('Vaporeon', null, true);
				source.sethp(source.maxhp * currentHP);
				this.add('-sethp', source, source.getHealth, '[from] move: Flip Turn', '[silent]');
				// target.setAbility('Eeveelution');
				// target.baseAbility = target.ability;
				const newMoves = ['voltswitch', 'burnout', 'wish', 'bouncybubble'];
				// Update move slots
				// eslint-disable-next-line @typescript-eslint/no-shadow
				source.moveSlots = newMoves.map(move => {
					const moveData = this.dex.moves.get(move);
					return {
						move: moveData.name,
						id: moveData.id,
						pp: moveData.pp,
						maxpp: moveData.pp,
						target: moveData.target,
						disabled: false,
						used: false,
					};
				});
				// this forces the UI to update move slots visually
				(source as any).baseMoveSlots = source.moveSlots.slice();
			}
		},
	},
	bbqbeatdown: {
		num: -1005,
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.status === "brn") {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Burn Up', target);
			this.add('-anim', source, 'Close Combat', target);
		},
		category: "Physical",
		name: "BBQ Beatdown",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		zMove: { basePower: 160 },
		contestType: "Clever",
		desc: "Power doubles if the target is Burned.",
		shortDesc: "Power doubles if the target is Burned.",
	},
	sizzlyslide: {
		inherit: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Flame Charge', target);
		},
	},
	freezyfrost: {
		inherit: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Blizzard', target);
		},
	},
	bouncybubble: {
		inherit: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Bubble Beam', target);
		},
	},
	purify: {
		inherit: true,
		flags: { reflectable: 1, heal: 1, metronome: 1 },
		onHit(target, source) {
			const foe = source.side.foe.active[0];
			if (foe && !foe.fainted && foe.status) {
				this.heal(Math.ceil(source.maxhp * 0.5), source);
			} else {
				this.heal(Math.ceil(source.maxhp * 0.25), source);
			}
		},
		target: "self",
		desc: "Heals for 25% HP, or 50% if foe is statused.",
		shortDesc: "Heals for 20% HP, or 50% if foe is statused.",
	},
	saltcurse: {
		num: -1006,
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'par') {
				this.debug('BP doubled on paralyzed target');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
			if (type === 'Steel') return 1;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Glare', target);
			this.add('-anim', source, 'Ivy Cudgel Rock', target);
		},
		category: "Physical",
		name: "Salt Curse",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
		desc: "Double power if target is Paralyzed. Super-effective against Water and Steel.",
		shortDesc: "Double power if target is Paralyzed. Super-effective against Water and Steel.",
	},
	flyby: {
		num: -1006,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Fly-by",
		pp: 20,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dual Wingbeat', target);
		},
		flags: { protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: {
			chance: 50,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Flying",
		contestType: "Cute",
		desc: "User switches out. Target: -1 Attack.",
		shortDesc: "User switches out. Target: -1 Attack.",
	},
	silktrap: {
		inherit: true,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.side.addSideCondition('stickyweb');
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					source.side.addSideCondition('stickyweb');
				}
			},
		},
		desc: "Protect. If contact: set Sticky Web.",
		shortDesc: "Protect. If contact: set Sticky Web.",
	},
	heatsink: {
		num: -1007,
		accuracy: 100,
		basePower: 80,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Fire Spin', target);
			this.add('-anim', source, 'Bitter Blade', target);
		},
		onModifyMove(move, source, target) {
			if (target?.status === 'brn') {
				move.drain = [3, 4];
			}
		},
		category: "Special",
		name: "Heat Sink",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Fire",
		zMove: { basePower: 160 },
		contestType: "Clever",
		desc: "50% drain. 75% drain instead if target is Burned.",
		shortDesc: "50% drain. 75% drain instead if target is Burned.",
	},
	terastarstorm: {
		inherit: true,
		onModifyType(move, pokemon) {
			const types = pokemon.getTypes();
			let type = types[0];
			if (type === 'Bird') type = '???';
			if (type === '???' && types[1]) type = types[1];
			move.type = type;
			if (pokemon.species.name === 'Terapagos-Stellar') {
				move.type = 'Stellar';
				if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
					move.category = 'Physical';
				}
			}
		},
		desc: "Type varies based on the user's primary type.",
		shortDesc: "Type varies based on the user's primary type.",
	},
};
