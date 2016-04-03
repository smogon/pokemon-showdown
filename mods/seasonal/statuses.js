"use strict";

exports.BattleStatuses = {
	// Innate abilities
	// Lemonade
	adaptabilityinnate: {
		effectType: 'Ability',
		onModifyMove: function (move) {
			move.stab = 2;
		},
	},
	// Snobalt
	amityabsorb: {
		effectType: 'Ability',
		name: 'Amity Absorb',
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fairy') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Amity Absorb');
				}
				return null;
			}
		},
	},
	// manu 11
	arachnophobia: {
		effectType: 'Ability',
		name: 'Arachnophobia',
		onStart: function (target, source) {
			source.addVolatile('baddreamsinnate');
			this.boost({spd:1, spe:1}, source, source);
		},
		onModifyDamage: function (damage, source, target, move) {
			if (move.typeMod < 0) {
				return this.chainModify(2);
			}
		},
	},
	// ascriptmaster
	ascriptinnate: {
		effectType: 'Ability',
		onStart: function (target, source) {
			source.setType('Electric');
			this.add('-start', source, 'typechange', 'Electric');
			this.useMove('magnetrise', source);
		},
		onModifyMove: function (move) {
			let modifyanim = true;
			if (move.id === 'thunderbolt') {
				move.name = 'Spectrum Shock';
			} else if (move.id === 'mysticalfire') {
				move.name = 'Spectrum Blaze';
			} else if (move.id === 'aurorabeam') {
				move.name = 'Spectrum Impact';
			} else if (move.id === 'psyshock') {
				move.name = 'Spectrum Flash';
			} else {
				modifyanim = false;
			}
			if (modifyanim) {
				move.onPrepareHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, 'Swift', target);
				};
			}
		},
	},
	// atomicllamas, manu 11
	baddreamsinnate: {
		effectType: 'Ability',
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			const thisSide = pokemon.side;
			if (thisSide.foe.active.length) {
				const opponent = thisSide.foe.active[0];
				if (opponent.hp && opponent.status === 'slp') {
					this.add('-ability', pokemon, 'Bad Dreams');
					this.damage(opponent.maxhp / 8, opponent, pokemon, "Bad Dreams");
				}
			}
		},
	},
	// SpaceBass
	badtrip: {
		effectType: 'Ability',
		onSwitchOut: function (pokemon) {
			pokemon.heal(this.modify(pokemon.maxhp, 0.4));
		},
	},
	// Teremiare
	coinflip: {
		effectType: 'Ability',
		onStart: function (target, source) {
			this.add('-ability', source, 'Coin Flip');
			let pool = ['atk', 'def', 'spa', 'spd', 'spe'];
			let boost1 = pool.splice(this.random(pool.length), 1)[0];
			let boost2 = pool.splice(this.random(pool.length), 1)[0];
			source.boosts[boost1] = 6;
			this.add('-setboost', source, boost1, source.boosts[boost1]);
			const foes = source.side.foe.active;
			if (foes.length && foes[0].hp) {
				const opponent = foes[0];
				opponent.boosts[boost2] = 6;
				this.add('-setboost', opponent, boost2, opponent.boosts[boost2]);
			}
		},
	},
	// Bondie
	crabstance: {
		effectType: 'Ability',
		name: 'Crab Stance',
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.category in {Physical: 1, Special: 1}) {
				this.boost({def:1, spd:1}, target, target);
			}
		},
		onAfterMoveSecondarySelf: function (source, target, move) {
			if (move && move.category !== 'Status') {
				this.boost({atk:1, spa:1}, source, source);
			}
		},
	},
	// Clefairy
	coldsteel: {
		effectType: 'Ability',
		name: 'Coldsteel',
		duration: 3,
		onStart: function (pokemon) {
			this.boost({spe:1}, pokemon, pokemon);
			pokemon.addType('Dark');
			this.add('-start', pokemon, 'typeadd', 'Dark', '[from] ability: Coldsteel');
		},
		onEnd: function (pokemon) {
			this.heal(this.modify(pokemon.maxhp, 0.25));
			pokemon.addType('Steel');
			this.add('-start', pokemon, 'typeadd', 'Steel', '[from] ability: Coldsteel');
		},
	},
	// Former Hope
	cursedbodyinnate: {
		effectType: 'Ability',
		onAfterDamage: function (damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move') {
				if (this.random(10) < 3) {
					source.addVolatile('disable');
				}
			}
		},
	},
	// nv
	cuteness: {
		effectType: 'Ability',
		onStart: function (target, source) {
			this.add('-ability', source, 'Cuteness');
			this.boost({atk:1, def:1, spa:1, spd:1, spe:1, evasion:1}, source, source, source);
		},
		onModifyAtk: function () {
			return this.chainModify(1.7);
		},
		onModifySpA: function () {
			return this.chainModify(1.7);
		},
	},
	// Giagantic
	deltastreaminnate: {
		effectType: 'Ability',
		onStart: function (target, source) {
			this.setWeather('deltastream', source, "Delta Stream");
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'deltastream' && !(weather.id in {desolateland: 1, primordialsea: 1, deltastream: 1})) return false;
		},
		onSwitchOut: function (pokemon) {
			if (this.getWeather().id === 'deltastream') {
				if (pokemon.side.foe.active.length) {
					const opponent = pokemon.side.foe.active[0];
					if (opponent.hasAbility('deltastream') || (opponent.volatiles['deltastreaminnate'])) {
						this.weatherData.source = opponent;
					} else {
						this.clearWeather();
					}
				} else {
					this.clearWeather();
				}
			}
		},
		onFaint: function (pokemon) {
			if (this.getWeather().id === 'deltastream') {
				if (pokemon.side.foe.active.length) {
					const opponent = pokemon.side.foe.active[0];
					if (opponent.hasAbility('deltastream') || (opponent.volatiles['deltastreaminnate'])) {
						this.weatherData.source = opponent;
					} else {
						this.clearWeather();
					}
				} else {
					this.clearWeather();
				}
			}
		},
	},
	// Duck
	firstblood: {
		effectType: 'Ability',
		onModifyDamage: function (damage, source, target, move) {
			if (move.crit) {
				return this.chainModify(1.5);
			}
		},
	},
	// Blast Chance
	flipside: {
		effectType: 'Ability',
		onStart: function (target, source) {
			this.useMove('Topsy-Turvy', source);
			this.add('-ability', source, 'Flipside');
			this.add('message', source.name + '\'s Flipside has reversed type matchups against it!');
		},
		// Actual implementation in formats.js
	},
	// Gangnam Style
	gonnamakeyousweat: {
		effectType: 'Ability',
		name: 'Gonna Make You Sweat',
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			this.heal(this.modify(pokemon.maxhp, 0.33));
		},
	},
	// Winry
	hellacute: {
		effectType: 'Ability',
		onModifyDef: function () {
			return this.chainModify(3.2);
		},
		onModifySpD: function () {
			return this.chainModify(3.2);
		},
		onModifyAtk: function () {
			return this.chainModify(1.7);
		},
		onModifySpA: function () {
			return this.chainModify(1.7);
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.category in {Physical: 1, Special: 1}) && source && source.hp) {
				this.add('-ability', target, 'Hella Cute');
				this.boost({def: -1, spd: -1}, source, target, effect);
			}
		},
		onModifyMove: function (move) {
			if (move.ohko) {
				move.onMoveFail = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Explosion", target);
					this.damage(source.maxhp, source, source);
				};
			}
		},
		onAnyAccuracy: function (accuracy, target, source, move) {
			if (source.volatiles['hellacute'] && move.ohko) return 55;
			return accuracy;
		},
	},
	// unfixable
	ironbarbsinnate: {
		effectType: 'Ability',
		name: 'Iron Barbs',
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
	},
	// Scyther NO Swiping
	mountaineerinnate: {
		effectType: 'Ability',
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit: function (target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[msg]', '[from] ability: Mountaineer');
				return null;
			}
		},
	},
	// uselesstrainer
	ninja: {
		effectType: 'Ability',
		onModifyPriority: function (priority) {
			return priority + 0.2;
		},
	},
	// Haund
	prodigy: {
		effectType: 'Ability',
		onStart: function (target, source) {
			this.add('-ability', source, 'Prodigy');
			this.addPseudoWeather('prodigyweather', source, "Prodigy");
		},
		onSwitchOut: function (pokemon) {
			const foes = pokemon.side.foe.active;
			if (this.pseudoWeather['prodigyweather'] && !(foes.length && foes[0].volatiles['prodigy'])) {
				this.removePseudoWeather('prodigyweather', pokemon);
			}
		},
		onFaint: function (pokemon) {
			const foes = pokemon.side.foe.active;
			if (this.pseudoWeather['prodigyweather'] && !(foes.length && foes[0].volatiles['prodigy'])) {
				this.removePseudoWeather('prodigyweather', pokemon);
			}
		},
	},
	// qtrx
	qtrxinnate: {
		effectType: 'Ability',
		onStart: function (target, source) {
			source.addVolatile('focusenergy');
			source.addVolatile('telekinesis');
		},
		onDragOut: function (pokemon) {
			if (pokemon.isDuringAttack) {
				this.add('-message', "But it had no effect!");
				return null;
			}
		},
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			this.add('-message', pokemon.name + "'s aura of spammy letters is tearing at the very fabric of reality!");
			this.useMove(((this.random(2) === 1) ? 'trickroom' : 'wonderroom'), pokemon);
		},
	},
	// sparktrain
	refrigerateinnate: {
		effectType: 'Ability',
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Ice';
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
		name: "Refrigerate",
	},
	// Sigilyph
	samuraijack: {
		effectType: 'Ability',
		onModifySpe: function () {
			return this.chainModify(1.1);
		},
	},
	// bludz
	shielddustinnate: {
		effectType: 'Ability',
		onModifySecondaries: function (secondaries) {
			return secondaries.filter(effect => !!effect.self);
		},
	},
	// rssp1
	speedboostinnate: {
		effectType: 'Ability',
		name: 'Speed Boost',
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe: 1});
			}
		},
	},
	// SpecsMegaBeedrill
	weed: {
		effectType: 'Ability',
		onStart: function (target, source) {
			this.add('-ability', source, 'Weed');
			this.add('-anim', source, 'Geomancy', source);
			this.add('-message', source.name + " is high on Weed!");
		},
		onModifySpe: function () {
			return this.chainModify(2);
		},
		onModifyAtk: function () {
			return this.chainModify(3);
		},
		onModifySpA: function () {
			return this.chainModify(3);
		},
	},
	// Weathers
	hail: {
		inherit: true,
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (effect.id === 'holyhail') this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		durationCallback: function (source) {
			if (!source) return 5;
			if (source.getAbility() === 'Holy Hail') return 0;
			if (source.hasItem('icyrock')) return 8;
			return 5;
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (attacker.getAbility() === 'Holy Hail' && move.type === 'Ice') {
				return this.chainModify(1.5);
			}
		},
		onModifySpD: function (spd, pokemon) {
			if (pokemon.getAbility() === 'Holy Hail' && pokemon.hasType('Ice') && this.isWeather('hail')) {
				return this.modify(spd, 1.5);
			}
		},
	},
	prodigyweather: {
		effectType: 'Pseudoweather',
		duration: 0,
		onStart: function () {
			this.add('message', "Physical and special move categories on the battlefield have become inverted!");
		},
		onModifyMove: function (move) {
			if (move.category === 'Physical') {
				move.category = 'Special';
			} else if (move.category === 'Special') {
				move.category = 'Physical';
			}
		},
		onEnd: function () {
			this.add('message', "Physical and special move categories on the battlefield have returned to normal!");
		},
	},
	// Other effects
	saltguard: {
		duration: 2,
		onStart: function (pokemon) {
			this.add('-start', pokemon, 'Salt', '[silent]');
			this.add('message', "Residual salt is protecting againt indirect damage!");
		},
		onDamage: function (damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		onEnd: function (pokemon) {
			this.add('-end', pokemon, 'Salt', '[silent]');
			this.add('message', "The salt subsided.");
		},
	},
};
