export const Moves: {[moveid: string]: ModdedMoveData} = {
	/*
	placeholder: {
		name: "",
		type: "",
		category: "",
		basePower: 0,
		accuracy: 100,
		pp: 10,
		shortDesc: "",
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "", target);
		},
		secondary: null,
		target: "normal",
	},
	*/
	dreamseal: {
		name: "Dream Seal",
		type: "Flying",
		category: "Special",
		basePower: 70,
		accuracy: true,
		pp: 10,
		shortDesc: "Inflicts partial trapping.",
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Hidden Power", target);
			this.add('-anim', pokemon, "Bleakwind Storm", target);
		},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
	},
	silverdagger: {
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Silvr Dagger damage boost');
				return move.basePower * 1.5;
			}
			this.debug('Fishious Rend NOT boosted');
			return move.basePower;
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Smart Strike", target);
		},
		category: "Physical",
		name: "Silver Dagger",
		pp: 15,
		shortDesc: "1.5x damage when moving before the target.",
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	forbiddenbarrage: {
		accuracy: 80,
		basePower: 110,
		category: "Special",
		name: "Forbidden Barrage",
		pp: 5,
		shortDesc: "10% chance to flinch.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Astral Barrage", target);
		},
		flags: {protect: 1, mirror: 1, bullet: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Dark",
	},
	shikigamirush: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Shikigami Rush",
		pp: 5,
		shortDesc: "Gains priority if Ran Yakumo is the user's ally.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Zen Headbutt", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		onModifyPriority(priority, source, target, move) {
			if (source.allies.filter(p => p.baseSpecies.id === 'ranyakumo').length) {
				return priority + 1;
			}
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	lunaticbullet: {
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Lunatic Bullet",
		pp: 20,
		shortDesc: "Moves first in its priority bracket.",
		priority: 0.1,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Vacuum Wave", target);
			this.add('-anim', pokemon, "Psychic", target);
		},
		flags: {protect: 1, mirror: 1, bullet: 1},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	nervepoison: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Nerve Poison",
		pp: 15,
		shortDesc: "30% chance to inflict paralysis.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Clear Smog", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacentFoes",
		type: "Poison",
	},
	'superscope3d': {
		accuracy: 90,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		category: "Physical",
		name: "Super Scope 3d",
		pp: 10,
		shortDesc: "Hits 3 times, stronger each hit, each hit checks accuracy.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Fling", target);
			this.add('-anim', target, "Water Sport", pokemon);
		},
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1},
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Water",
	},
	cloudfist: {
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		name: "Cloud Fist",
		pp: 10,
		shortDesc: "Lowers the user's Speed by one stage.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Hammer Arm", target);
			this.add('-anim', target, "Haze", pokemon);
		},
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1, wind: 1},
		self: {
			boosts: {
				spe: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	waterplates: {
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		name: "Water Plates",
		pp: 15,
		shortDesc: "Hits twice, high critical hit rate.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Snipe Shot", target);
		},
		flags: {protect: 1, mirror: 1, metronome: 1},
		critRatio: 2,
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Water",
	},
	bodyswap: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Body Swap",
		pp: 10,
		shortDesc: "Heals 50% and changes Hecatia's forme (Otherworld->Earth->Moon)",
		priority: 0,
		flags: {heal: 1, metronome: 1},
		heal: [1, 2],
		secondary: null,
		target: "self",
		onHit(pokemon) {
			if (!pokemon.baseSpecies.name.includes('Hecatia')) return;
			let targetForme = 'Hecatia-Otherworld';
			let newAbility = 'Pressure';
			switch (pokemon.species.name) {
				case 'Hecatia-Otherworld':
					targetForme = 'Hecatia-Earth';
					newAbility = 'Natural Cure';
					break;
				case 'Hecatia-Earth':
					targetForme = 'Hecatia-Moon';
					newAbility = 'Dazzling';
					break;
				case 'Hecatia-Moon':
					targetForme = 'Hecatia-Otherworld';
					newAbility = 'Pressure';
					break;
			}
			pokemon.formeChange(targetForme, this.effect, true);
			this.add('-ability', pokemon, newAbility, '[from] move: Body Swap');
			pokemon.set.ability = newAbility;
		},
		type: "Normal",
	},
	dancingblow: {
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		name: "Dancing Blow",
		pp: 10,
		shortDesc: "20% chance to lower target Sp.Atk by one stage.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Quiver Dance", target);
			this.add('-anim', pokemon, "Mach Punch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1, dance: 1, metronome: 1},
		secondary: {
			chance: 20,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fighting",
	},
	stonestacking: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Stone Stacking",
		pp: 5,
		shortDesc: "Sets stealth rock on the user's side of the field.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Stone Edge", pokemon);
			this.add('-anim', pokemon, "Never-Ending Nightmare", target);
		},
		flags: {protect: 1, mirror: 1, metronome: 1},
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				source.side.addSideCondition('stealthrock');
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				source.side.addSideCondition('stealthrock');
			}
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ghost",
	},
	sculptedarmor: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sculpted Armor",
		pp: 20,
		shortDesc: "Raises Def. and Sp.Def by one stage, adds Ground, can target an ally.",
		priority: 0,
		flags: {metronome: 1},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Sand Tomb", target);
		},
		onHit(target) {
			this.boost({ def: 1, spd: 1 }, target);
			if (target.hasType('Ground')) return;
			if (!target.addType('Ground')) return;
			this.add('-start', target, 'typeadd', 'Ground', '[from] move: Sculpted Armor');
		},
		secondary: null,
		target: "adjacentAllyOrSelf",
		type: "Ground",
	},
	excavate: {
		accuracy: 90,
		basePower: 55,
		basePowerCallback(pokemon, target, move) {
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.side.sideConditions[condition]) return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Excavate",
		pp: 15,
		shortDesc: "Removes hazards from the user's side, double power when removing hazards.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Rock Throw", target);
		},
		flags: {protect: 1, mirror: 1, metronome: 1},
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
					}
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	ironchomp: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Iron Chomp",
		pp: 5,
		shortDesc: "Traps the target.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Iron Defense", target)
			this.add('-anim', pokemon, "Jaw Lock", target);
		},
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	missile: {
		accuracy: true,
		basePower: 90,
		category: "Physical",
		name: "Missile",
		pp: 10,
		shortDesc: "20% chance to inflict burn.",
		priority: 0,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Torch Song", target)
			// i dont know how to edit anims but if you know how to change the color of them make it grey
			// no big deal if that's annoying
		},
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1},
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "normal",
		type: "Steel",
	},
	wickedenergy: {
		num: 268,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Wicked Energy",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, metronome: 1},
		volatileStatus: 'wickedenergy',
		condition: {
			onStart(pokemon, source, effect) {
				if (effect && ['Wicked Power'].includes(effect.name)) {
					this.add('-start', pokemon, 'Wicked Energy', this.activeMove!.name, '[from] ability: ' + effect.name);
				} else {
					this.add('-start', pokemon, 'Wicked Energy');
				}
			},
			onRestart(pokemon, source, effect) {
				if (effect && ['Wicked Power'].includes(effect.name)) {
					this.add('-start', pokemon, 'Wicked Energy', this.activeMove!.name, '[from] ability: ' + effect.name);
				} else {
					this.add('-start', pokemon, 'Wicked Energy');
				}
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dark') {
					this.debug('charge boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.type === 'Dark' && move.id !== 'wickedenergy') {
					pokemon.removeVolatile('wickedenergy');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.type === 'Dark' && move.id !== 'wickedenergy') {
					pokemon.removeVolatile('wickedenergy');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Wicked Energy', '[silent]');
			},
		},
		boosts: {
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Dark",
	},

	//vanilla
	toxicspikes: {
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
				if (!pokemon.isGrounded() || pokemon.hasAbility('dexterity')) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
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
				if (!pokemon.isGrounded() || pokemon.hasAbility('dexterity') || pokemon.hasItem('heavydutyboots')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	hyperspacefury: {
		inherit: true,
		onTry(source) {
			if (source.species.name === 'Junko') {
				return;
			}
			this.hint("Only a Pokemon whose form is Junko can use this move.");
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Hyperspace Fury');
			return null;
		},
	},
};
