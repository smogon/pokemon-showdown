exports.BattleAbilities = {
	"swiftswim": {
		inherit: true,
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(1.5);
			}
		}
	},
	"chlorophyll": {
		inherit: true,
		onModifySpe: function (spe) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		}
	},
	"sandrush": {
		inherit: true,
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		}
	},
	"forecast": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.weather) {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function (target, source) {
					this.setWeather(weather, source, this.getAbility('forecast'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		}
	},
	"thickfat": {
		inherit: true,
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Fighting') {
				this.add('-message', "The attack was weakened by Thick Fat!");
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Fighting') {
				this.add('-message', "The attack was weakened by Thick Fat!");
				return this.chainModify(0.5);
			}
		}
	},
	"marvelscale": {
		inherit: true,
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		}
	},
	"snowcloak": {
		inherit: true,
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		onSourceBasePower: function (basePower) {
			if (this.isWeather('hail')) {
				return basePower * 3 / 4;
			}
			return basePower * 7 / 8;
		},
		onModifyAccuracy: function () {}
	},
	"sandveil": {
		inherit: true,
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onSourceBasePower: function (basePower) {
			if (this.isWeather('sandstorm')) {
				return basePower * 4 / 5;
			}
		},
		onModifyAccuracy: function () {}
	},
	"waterveil": {
		inherit: true,
		onSourceBasePower: function (basePower) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return basePower * 3 / 4;
			}
			return basePower * 7 / 8;
		}
	},
	"icebody": {
		inherit: true,
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		onResidual: function (target, source, effect) {
			this.heal(target.maxhp / 16);
		},
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && this.isWeather('hail')) {
				if (this.random(10) < 3) {
					source.trySetStatus('frz', target, move);
				}
			}
		},
		onWeather: function () {}
	},
	"flamebody": {
		inherit: true,
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		}
	},
	"static": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('par', target, move);
			}
		}
	},
	"cutecharm": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.addVolatile('Attract', target);
			}
		}
	},
	"poisonpoint": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('psn', target, move);
			}
		}
	},
	"flowergift": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.id === 'sunnyday') {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function (target, source) {
					this.setWeather(weather, source, this.getAbility('flowergift'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
				move.sideCondition = 'flowergift';
			}
		},
		onUpdate: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				if (pokemon.isActive && pokemon.speciesid === 'cherrim' && this.effectData.forme !== 'Sunshine') {
					this.effectData.forme = 'Sunshine';
					this.add('-formechange', pokemon, 'Cherrim-Sunshine', '[msg]');
					this.boost({spd:1});
				}
			} else if (pokemon.isActive && pokemon.speciesid === 'cherrim' && this.effectData.forme) {
				delete this.effectData.forme;
				this.add('-formechange', pokemon, 'Cherrim', '[msg]');
			}
		},
		effect: {
			onSwitchInPriority: 1,
			onSwitchIn: function (target) {
				if (!target.fainted) {
					this.boost({spd:1}, target, target, this.getAbility('flowergift'));
				}
				target.side.removeSideCondition('flowergift');
			}
		}
	},
	"slowstart": {
		inherit: true,
		effect: {
			duration: 3,
			onStart: function (target) {
				this.add('-start', target, 'Slow Start');
			},
			onModifyAtk: function (atk, pokemon) {
				if (pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return atk / 2;
			},
			onModifySpe: function (spe, pokemon) {
				if (pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return spe / 2;
			},
			onEnd: function (target) {
				this.add('-end', target, 'Slow Start');
			}
		}
	},
	"compoundeyes": {
		desc: "The accuracy of this Pokemon's moves receives a 60% increase; for example, a 50% accurate move becomes 80% accurate.",
		shortDesc: "This Pokemon's moves have their Accuracy boosted to 1.6x.",
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return accuracy * 1.6;
		},
		id: "compoundeyes",
		name: "Compound Eyes",
		rating: 3.5,
		num: 14
	},
	"keeneye": {
		desc: "The accuracy of this Pokemon's moves receives a 60% increase; for example, a 50% accurate move becomes 80% accurate.",
		shortDesc: "This Pokemon's moves have their Accuracy boosted to 1.6x.",
		onModifyMove: function (move) {
			if (typeof move.accuracy !== 'number') return;
			this.debug('keeneye - enhancing accuracy');
			move.accuracy *= 1.6;
		},
		id: "keeneye",
		name: "Keen Eye",
		rating: 3.5,
		num: 51
	},
	"solidrock": {
		inherit: true,
		onSourceModifyDamage: function (damage, attacker, defender, move) {
			if (move.typeMod > 0) {
				this.add('-message', "The attack was weakened by Solid Rock!");
				return this.chainModify(0.5);
			}
		}
	},
	"filter": {
		inherit: true,
		onSourceModifyDamage: function (damage, attacker, defender, move) {
			if (move.typeMod > 0) {
				this.add('-message', "The attack was weakened by Filter!");
				return this.chainModify(0.5);
			}
		}
	},
	"heatproof": {
		inherit: true,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.add('-message', "The attack was weakened by Heatproof!");
				return basePower / 2;
			}
		}
	},
	"reckless": {
		inherit: true,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil || attacker.item === 'lifeorb') {
				this.debug('Reckless boost');
				return basePower * 12 / 10;
			}
		}
	},
	"clearbody": {
		inherit: true,
		onBoost: function (boost, target, source) {
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					this.add("-message", target.name + "'s stats were not lowered! (placeholder)");
				}
			}
		}
	},
	"whitesmoke": {
		inherit: true,
		onBoost: function (boost, target, source) {
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					this.add("-message", target.name + "'s stats were not lowered! (placeholder)");
				}
			}
		}
	},
	"rockhead": {
		inherit: true,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id in {lifeorb: 1, recoil: 1}) return false;
		}
	},
	"download": {
		inherit: true,
		onStart: function (pokemon) {
			if (pokemon.template.baseSpecies === 'Genesect') {
				if (!pokemon.getItem().onDrive) return;
			}
			var foeactive = pokemon.side.foe.active;
			var totaldef = 0;
			var totalspd = 0;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				totaldef += foeactive[i].stats.def;
				totalspd += foeactive[i].stats.spd;
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa:1});
			} else if (totalspd) {
				this.boost({atk:1});
			}
		}
	},
	"victorystar": {
		inherit: true,
		onAllyModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.5;
			}
		}
	},
	"shellarmor": {
		inherit: true,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.add('-message', "Its damage was reduced by Shell Armor!");
				damage -= target.maxhp / 10;
				if (damage < 0) damage = 0;
				return damage;
			}
		},
		onHit: function (target, source, move) {
			if (move.id === 'shellsmash') {
				target.setAbility('');
			}
		}
	},
	"battlearmor": {
		inherit: true,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.add('-message', "Its damage was reduced by Battle Armor!");
				damage -= target.maxhp / 10;
				if (damage < 0) damage = 0;
				return damage;
			}
		}
	},
	"weakarmor": {
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.add('-message', "Its damage was reduced by Weak Armor!");
				damage -= target.maxhp / 10;
				if (damage < 0) damage = 0;
				target.setAbility('');
				this.boost({spe: 1});
				return damage;
			}
		},
		onAfterDamage: function () {}
	},
	"magmaarmor": {
		inherit: true,
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
			if (type === 'frz') return false;
		},
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				damage -= target.maxhp / 10;
				if (damage < 0) damage = 0;
				if (effect.type === 'Ice' || effect.type === 'Water') {
					this.add('-activate', target, 'ability: Magma Armor');
					target.setAbility('battlearmor');
					damage = 0;
				} else {
					this.add('-message', "Its damage was reduced by Magma Armor!");
				}
				return damage;
			}
		}
	},
	"multiscale": {
		inherit: true,
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.add('-message', "The attack was slightly weakened by Multiscale!");
				return this.chainModify(2 / 3);
			}
		}
	},
	"ironfist": {
		inherit: true,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				return basePower * 1.33;
			}
		}
	},
	"stench": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (var i = 0; i < move.secondaries.length; i++) {
					if (move.secondaries[i].volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 40,
					volatileStatus: 'flinch'
				});
			}
		}
	},
	"aftermath": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && !target.hp) {
				this.damage(source.maxhp / 3, source, target, null, true);
			}
		}
	},
	"cursedbody": {
		desc: "When this Pokemon faints, attacker is Cursed.",
		shortDesc: "When this Pokemon faints, attacker is Cursed.",
		onFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move' && source) {
				source.addVolatile('curse');
			}
		},
		id: "cursedbody",
		name: "Cursed Body",
		rating: 3,
		num: 130
	},
	"gluttony": {
		inherit: true,
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (!pokemon.gluttonyFlag && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
				pokemon.gluttonyFlag = true;
				pokemon.setItem(pokemon.lastItem);
				this.add("-item", pokemon, pokemon.item, '[from] ability: Gluttony');
			}
		}
	},
	"guts": {
		inherit: true,
		onDamage: function (damage, attacker, defender, effect) {
			if (effect && (effect.id === 'brn' || effect.id === 'psn' || effect.id === 'tox')) {
				return damage / 2;
			}
		}
	},
	"quickfeet": {
		inherit: true,
		onDamage: function (damage, attacker, defender, effect) {
			if (effect && (effect.id === 'brn' || effect.id === 'psn' || effect.id === 'tox')) {
				return damage / 2;
			}
		}
	},
	"toxicboost": {
		inherit: true,
		onDamage: function (damage, attacker, defender, effect) {
			if (effect && (effect.id === 'psn' || effect.id === 'tox')) {
				return damage / 2;
			}
		}
	},
	"truant": {
		onModifyMove: function (move, pokemon) {
			if (!move.self) move.self = {};
			if (!move.self.volatileStatus) move.self.volatileStatus = 'truant';
		},
		effect: {
			duration: 2,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Truant');
			},
			onBeforeMovePriority: 99,
			onBeforeMove: function (pokemon, target, move) {
				if (pokemon.removeVolatile('truant')) {
					this.add('cant', pokemon, 'ability: Truant');
					this.heal(pokemon.maxhp / 3);
					return false;
				}
			}
		}
	},
	"flareboost": {
		inherit: true,
		onDamage: function (damage, defender, attacker, effect) {
			if (effect && (effect.id === 'brn')) {
				return damage / 2;
			}
		}
	},
	"telepathy": {
		inherit: true,
		onStart: function (target) {
			this.add('-start', target, 'move: Imprison');
		},
		onFoeDisableMove: function (pokemon) {
			var foeMoves = this.effectData.target.moveset;
			for (var f = 0; f < foeMoves.length; f++) {
				pokemon.disableMove(foeMoves[f].id, true);
			}
			pokemon.maybeDisabled = true;
		},
		onFoeBeforeMove: function (attacker, defender, move) {
			if (attacker.disabledMoves[move.id]) {
				this.add('cant', attacker, 'move: Imprison', move);
				return false;
			}
		}
	},
	"speedboost": {
		inherit: true,
		onResidualPriority: -1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns && !pokemon.volatiles.stall) {
				this.boost({spe:1});
			}
		}
	},
	"parentalbond": {
		inherit: true,
		onModifyMove: function (move, pokemon, target) {
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && ((target.side && target.side.active.length < 2) || move.target in {any:1, normal:1, randomNormal:1})) {
				move.multihit = 2;
				move.accuracy = true;
				pokemon.addVolatile('parentalbond');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower) {
				return this.chainModify(0.5);
			}
		}
	},
	"adaptability": {
		inherit: true,
		onModifyMove: function (move) {},
		onBasePower: function (power, attacker, defender, move) {
			if (!attacker.hasType(move.type)) {
				return this.chainModify(1.33);
			}
		}
	},
	"shadowtag": {
		onStart: function (pokemon) {
			pokemon.addVolatile('shadowtag');
		},
		effect: {
			duration: 2,
			onFoeModifyPokemon: function (pokemon) {
				if (pokemon.ability !== 'shadowtag') {
					pokemon.tryTrap(true);
				}
			}
		},
		onBeforeMovePriority: 15,
		onBeforeMove: function (pokemon) {
			pokemon.removeVolatile('shadowtag');
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if (pokemon.ability !== 'shadowtag' && !source.volatiles.shadowtag) {
				pokemon.maybeTrapped = true;
			}
		}
	},
	"justified": {
		inherit: true,
		onBasePowerPriority: 100,
		onBasePower: function (power, attacker, defender) {
			if (power > 100 && !defender.hasType('Dark')) {
				this.debug('capping base power at 100');
				return 100;
			}
		}
	}
};
