'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	// Ststic
	keepitsteady: {
		desc: "This Pokemon's Special Attack is raised by 1 stage at the end of each full turn it has been on the field.",
		shortDesc: "This Pokemon's Special Attack is raised 1 stage at the end of each full turn on the field.",
		id: "keepitsteady",
		name: "Keep It Steady",
		isNonstandard: true,
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spa: 1});
			}
		},
	},
	// Erika
	quickstart: {
		desc: "As this Pokemon switches in, its Attack and Speed are doubled for 5 turns. After five turns have passed, these effects are removed.",
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are doubled for 5 turns.",
		id: "quickstart",
		name: "Quick Start",
		isNonstandard: true,
		onStart: function (pokemon) {
			pokemon.addVolatile('quickstart');
		},
		onEnd: function (pokemon) {
			delete pokemon.volatiles['quickstart'];
			this.add('-end', pokemon, 'Quick Start', '[silent]');
		},
		effect: {
			duration: 5,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Quick Start', '[silent]');
				this.add('-message', `${pokemon.name} can get it going.`);
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, pokemon) {
				return this.chainModify(2);
			},
			onModifySpe: function (spe, pokemon) {
				return this.chainModify(2);
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Quick Start', '[silent]');
				this.add('-message', `${pokemon.name}'s Quick Start has ended.`);
			},
		},
	},
	// Kyle
	desertcactus: {
		desc: "On switch-in, this Pokemon summons Sandstorm. If Sandstorm is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "Summons Sandstorm; If Sanstorm is active, this Pokemon heals 1/16 of its max HP each turn.",
		onStart: function (source) {
			this.setWeather('sandstorm');
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'sandstorm') {
				this.heal(target.maxhp / 16);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "desertcactus",
		name: "Desert Cactus",
		isNonstandard: true,
	},
	// Serene Star
	snowpower: {
		desc: "On switch-in, this Pokemon summons Hail. If Hail is active, its Attack is doubled.",
		shortDesc: "If Hail is active, this Pokemon's Attack is doubled.",
		onStart: function (source) {
			this.setWeather('hail');
		},
		onModifyAtk: function (atk, pokemon) {
			if (this.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		id: "snowpower",
		name: "Snow Power!",
		isNonstandard: true,
	},	
// Felix
	luckynumberseven: {
		shortDesc: "This Pokemon's moves have their accuracy doubled.",
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('enhancing accuracy');
			return accuracy * 2;
		},
		id: "luckynumberseven",
		name: "Lucky Number Seven",
		isNonstandard: true,
	},	
	// Nappa
	heroswill: {
		desc: "If this Pokemon is a Gallade, it will transform into Mega Gallade before using a physical or special attack. After using the attack, if this Pokemon was originally in its base forme, it will transform back into Gallade.",
		shortDesc: "Transforms into Mega Gallade before attacking, then reverts to a Gallade.",
		id: "heroswill",
		name: "Hero's Will",
		isNonstandard: true,
		onPrepareHit: function (source, target, move) {
			if (!target || !move) return;
			if (source.template.baseSpecies !== 'Gallade' || source.transformed) return;
			if (target !== source && move.category !== 'Status') {
				source.formeChange('Gallade-Mega', this.effect);
			}
		},
		onAfterMove: function (pokemon, move) {
			if (pokemon.template.baseSpecies !== 'Gallade' || pokemon.transformed) return;
			pokemon.formeChange('Gallade', this.effect);
		},
	},
  	// Skyla
	psychicshield: {
		desc: "This Pokemon cannot be afficted with status conditions, Taunt and Attract and prevents other Pokemon from lowering this Pokemon's stat stages.",
		shortDesc: "Prevent stats lowered; protects statuses.",
		id: "psychicshield",
		name: "Psychic Shield",
		isNonstandard: true,
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit: function (pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Oblivious');
				return null;
			}
		},
		onSetStatus: function (status, target, source, effect) {
				if (effect && effect.status) this.add('-immune', target, '[from] ability: Psychic Shield');
				return false;
		},
		onTryAddVolatile: function (status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Psychic Shield');
				return null;
			}
		},
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Clear Body", "[of] " + target);
		},
	},
  // Kris
  	chaosinnation: {
		desc: "On switch-in, this Pokemon harshly lowers the Defense, Special Defense and Speed of adjacent opposing Pokemon by 2 stages. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon harshly lowers Def, SpD and Spe of opponents by 2 stages.",
		onStart: function (pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Chaos Innation', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({def: -2}, target, pokemon);
					this.boost({spd: -2}, target, pokemon);
					this.boost({spe: -2}, target, pokemon);
				}
			}
		},
		id: "chaosinnation",
		name: "Chaos Innation",
		isNonstandard: true,
	},
	// Crystal
	mistyguard: {
		desc: "As it switches in, this Pokemon summons Gravity.",
		shortDesc: "On switch-in, this Pokemon Summons Gravity.",
		id: "mistyguard",
		name: "Misty Guard",
		isNonstandard: true,
		onStart: function (pokemon) {
			pokemon.side.addSideCondition('mist');
		},
	},
};

exports.BattleAbilities = BattleAbilities;
