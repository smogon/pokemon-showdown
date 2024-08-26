export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	merciless: {
		shortDesc: "This Pokemon's attacks are critical hits if the target is statused.",
		onModifyCritRatio(critRatio, source, target) {
			if (target?.status) return 5;
		},
		name: "Merciless",
		rating: 1.5,
		num: 196,
		gen: 6,
	},
	pocketdimension: {
		shortDesc: "This Pokemon switches out after using a status move.",
		onModifyMove(move, pokemon) {
			if (move.category === 'Status') {
				move.selfSwitch = true;
				this.add('-ability', pokemon, 'Pocket Dimension');
			}
		},
		name: "Pocket Dimension",
		rating: 4.5,
	},
	grassysurge: {
		inherit: true,
		gen: 6,
	},
	mistysurge: {
		inherit: true,
		gen: 6,
	},
	neutralizinggas: {
		inherit: true,
		// Ability suppression cancelled in scripts.ts
		// new Ability suppression implemented in scripts.ts
		onPreStart(pokemon) {},
		onEnd(source) {},
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
		},
		// onModifyPriority implemented in relevant abilities
		onFoeBeforeMovePriority: 13,
		onFoeBeforeMove(attacker, defender, move) {
			attacker.addVolatile('neutralizinggas');
		},
		condition: {
			onAfterMove(pokemon) {
				pokemon.removeVolatile('neutralizinggas');
			},
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
		desc: "While this Pokemon is active, opposing Pokemon's moves and their effects ignore its own Ability. Does not affect the As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, or Zen Mode Abilities.",
		shortDesc: "While this Pokemon is active, opposing Pokemon's Ability has no effect when it uses moves.",
		gen: 6,
	},
	nostalgiatrip: {
		shortDesc: "This Pokemon's moves have the damage categories they would have in Gen 3. Fairy-type moves are Special.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Nostalgia Trip');
			this.add('-message', `This Pokemon is experiencing a nostalgia trip!`);
		},
		onModifyMovePriority: 8,
		onModifyMove(move, pokemon) {
			if (move.category === "Status") return;
			if (['Fire', 'Water', 'Grass', 'Electric', 'Dark', 'Psychic', 'Dragon', 'Fairy'].includes(move.type)) {
				move.category = "Special";
			} else {
				move.category = "Physical";
			}
		},
		name: "Nostalgia Trip",
		rating: 4,
		gen: 6,
	},
	weatherreport: {
		onBeforeMovePriority: 0.5,
		onBeforeMove(target, source, move) {
			if (move.type === 'Fire') {
				this.field.setWeather('sunnyday');
			} else if (move.type === 'Water') {
				this.field.setWeather('raindance');
			}
		},
		name: "Weather Report",
		shortDesc: "Before using a Water or Fire-type move, this Pokemon sets Rain Dance or Sunny Day respectively.",
		rating: 4,
		gen: 6,
	},
	armortail: {
		inherit: true,
		gen: 6,
	},
	brainpower: {
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.chainModify(2);
		},
		name: "Brain Power",
		shortDesc: "This Pokemon's Special Attack is doubled.",
		rating: 5,
	},
	neuroforce: {
		inherit: true,
		gen: 6,
	},
	bugzapper: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Bug') {
				if (!source.addVolatile('trapped', target, move, 'trapper')) {
					this.add('-immune', target, '[from] ability: Bug Zapper');
				}
				return null;
			}
		},
		name: "Bug Zapper",
		shortDesc: "This Pokemon is immune to Bug-type moves and traps the foe if hit by one.",
		rating: 5,
	},
	exoskeleton: {
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Physical') {
				return this.chainModify(0.5);
			}
		},
		name: "Exoskeleton",
		shortDesc: "This Pokemon takes halved damage from physical moves; Hazard immunity.",
		rating: 4,
	},
	icescales: {
		inherit: true,
		gen: 6,
	},
	eartheater: {
		inherit: true,
		gen: 6,
	},
	shellejection: {
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.category === 'Special') {
				attacker.addVolatile('shellejection');
				this.add('-ability', attacker, 'Shell Ejection');
				this.add('-message', `Slowbro is getting ready to leave the battlefield!`);
				this.add('-message', `Slowbro can no longer use status moves!`);
			}
		},
		condition: {
			duration: 2,
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					const move = this.dex.moves.get(moveSlot.id);
					if (move.category === 'Status' && move.id !== 'mefirst') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onEnd(pokemon) {
				this.add('-ability', pokemon, 'Shell Ejection');
				this.add('-message', `Slowbro ejected itself from its shell!`);
				pokemon.switchFlag = true;
			},
		},
		name: "Shell Ejection",
		rating: 3.5,
		gen: 6,
		shortDesc: "After using a Special move, this Pokemon switches out at the end of the next turn and it can't use status moves.",
	},
	sharpness: {
		inherit: true,
		gen: 6,
	},
	dauntlessshield: {
		onStart(pokemon) {
			this.boost({def: 1}, pokemon);
			pokemon.addVolatile('dauntlessshield');
			this.add('-message', `${pokemon.name} has its shield up!`);
		},
		condition: {
			duration: 2,
			onEnd(pokemon) {
				this.add('-ability', pokemon, 'Dauntless Shield');
				this.add('-message', `${pokemon.name} lowered its shield!`);
				this.boost({def: -1}, pokemon);
			},
		},
		name: "Dauntless Shield",
		rating: 3.5,
		num: 235,
		shortDesc: "+1 Defense on switch-in. Boost goes away at the end of the next turn.",
		gen: 6,
	},
	confidence: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa: length}, source);
			}
		},
		name: "Confidence",
		rating: 3,
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 stage if it attacks and KOes another Pokemon.",
		gen: 6,
	},
	electricsurge: {
		inherit: true,
		gen: 6,
	},
	goodasgold: {
		inherit: true,
		gen: 6,
	},
	opportunist: {
		inherit: true,
		gen: 6,
	},
	intoxicate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Poison';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted) return this.chainModify([5325, 4096]);
		},
		name: "Intoxicate",
		rating: 4,
		shortDesc: "This Pokemon's Normal-type moves become Poison-type and have 1.3x power.",
	},
	dragonsgale: {
		onStart(source) {
			this.field.setWeather('deltastream');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('dragonsgale')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		onDamage(damage, target, source, effect) {
			if (effect && (effect.id === 'stealthrock' || effect.id === 'spikes')) {
				return damage / 2;
			}
		},
		flags: {},
		name: "Dragon's Gale",
		shortDesc: "On switch-in, sets Delta Stream. User takes halved damage from hazards.",
		rating: 5,
	},
	parentalbond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || move.multihit) return;
			if ([
				'endeavor', 'seismictoss', 'psywave', 'nightshade', 'sonicboom', 'dragonrage',
				'superfang', 'naturesmadness', 'bide', 'counter', 'mirrorcoat', 'metalburst',
			].includes(move.id)) return;
			if (!move.spreadHit && !move.isZ && !move.isMax) {
				move.multihit = 2;
				move.multihitType = 'parentalbond';
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'parentalbond' && move.hit > 1) return this.chainModify(0.5);
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		name: "Parental Bond",
		rating: 4.5,
		num: 184,
	},

	// for ngas
	galewings: {
		// for ngas
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			for (const poke of this.getAllActive()) {
				if (poke.hasAbility('neutralizinggas') && poke.side.id !== pokemon.side.id && !poke.abilityState.ending) {
					return;
				}
			}
			if (move && move.type === 'Flying') return priority + 1;
		},
	},
	prankster: {
		// for ngas
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			for (const poke of this.getAllActive()) {
				if (poke.hasAbility('neutralizinggas') && poke.side.id !== pokemon.side.id && !poke.abilityState.ending) {
					return;
				}
			}
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
	},
};
