'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	"adamantorb": {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			if (move && user.template.species === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
	},
	"choiceband": {
		inherit: true,
		onStart: function () { },
	},
	"choicescarf": {
		inherit: true,
		onStart: function () { },
	},
	"choicespecs": {
		inherit: true,
		onStart: function () { },
	},
	"chopleberry": {
		inherit: true,
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.causedCrashDamage) return damage;
			if (move.type === 'Fighting' && move.typeMod > 0 && (!target.volatiles['substitute'] || move.flags['authentic'])) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	"custapberry": {
		inherit: true,
		onModifyPriority: function () {},
		onBeforeTurn: function (pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.ability === 'gluttony')) {
				let action = this.willMove(pokemon);
				if (!action) return;
				this.insertQueue({
					choice: 'event',
					event: 'Custap',
					priority: action.priority + 0.1,
					pokemon: action.pokemon,
					move: action.move,
					// @ts-ignore
					target: action.target,
				});
			}
		},
		onCustap: function (pokemon) {
			let action = this.willMove(pokemon);
			this.debug('custap action: ' + action);
			if (action && pokemon.eatItem()) {
				this.cancelAction(pokemon);
				this.add('-message', "Custap Berry activated.");
				this.runAction(action);
			}
		},
	},
	"deepseascale": {
		inherit: true,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.template.species === 'Clamperl') {
				return this.chainModify(2);
			}
		},
	},
	"deepseatooth": {
		inherit: true,
		onModifySpA: function (spa, pokemon) {
			if (pokemon.template.species === 'Clamperl') {
				return this.chainModify(2);
			}
		},
	},
	"focussash": {
		inherit: true,
		desc: "If holder's HP is full, survives all hits of one attack with at least 1 HP. Single use.",
		onDamage: function () { },
		onTryHit: function (target, source, move) {
			if (target !== source && target.hp === target.maxhp) {
				target.addVolatile('focussash');
			}
		},
		effect: {
			duration: 1,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && damage >= target.hp) {
					this.effectData.activated = true;
					return target.hp - 1;
				}
			},
			onAfterMoveSecondary: function (target) {
				if (this.effectData.activated) target.useItem();
				target.removeVolatile('focussash');
			},
		},
	},
	"griseousorb": {
		inherit: true,
		desc: "Can only be held by Giratina. Its Ghost- & Dragon-type attacks have 1.2x power.",
		onBasePower: function (basePower, user, target, move) {
			if (user.template.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
	},
	"ironball": {
		inherit: true,
		onEffectiveness: function () {},
		desc: "Holder's Speed is halved and it becomes grounded.",
	},
	"jabocaberry": {
		inherit: true,
		onAfterDamage: function () {},
		onAfterMoveSecondary: function (target, source, move) {
			if (source && source !== target && move && move.category === 'Physical') {
				if (target.eatItem()) {
					this.damage(source.maxhp / 8, source, target, null, true);
				}
			}
		},
	},
	"lifeorb": {
		inherit: true,
		onModifyDamage: function () {},
		onAfterMoveSecondarySelf: function () {},
		onBasePower: function (basePower, user, target) {
			if (!target.volatiles['substitute']) {
				user.addVolatile('lifeorb');
			}
			return basePower;
		},
		onModifyDamagePhase2: function (damage, source, target, move) {
			return damage * 1.3;
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (source, target, move) {
				if (move && move.effectType === 'Move' && source && source.volatiles['lifeorb']) {
					this.damage(source.maxhp / 10, source, source, this.getItem('lifeorb'));
					source.removeVolatile('lifeorb');
				}
			},
		},
	},
	"lightball": {
		inherit: true,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.template.species === 'Pikachu') {
				return this.chainModify(2);
			}
		},
		onModifySpA: function (spa, pokemon) {
			if (pokemon.template.species === 'Pikachu') {
				return this.chainModify(2);
			}
		},
	},
	"luckypunch": {
		inherit: true,
		onModifyCritRatio: function (critRatio, user) {
			if (user.template.species === 'Chansey') {
				return critRatio + 2;
			}
		},
	},
	"lustrousorb": {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			if (move && user.template.species === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
	},
	"mentalherb": {
		inherit: true,
		desc: "Holder is cured if it is infatuated. Single use.",
		fling: {
			basePower: 10,
			effect: function (pokemon) {
				if (pokemon.removeVolatile('attract')) {
					this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
				}
			},
		},
		onUpdate: function (pokemon) {
			if (pokemon.volatiles.attract && pokemon.useItem()) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
			}
		},
	},
	"metronome": {
		inherit: true,
		desc: "Damage of moves used on consecutive turns is increased. Max 2x after 10 turns.",
		effect: {
			onStart: function (pokemon) {
				this.effectData.numConsecutive = 0;
				this.effectData.lastMove = '';
			},
			onTryMovePriority: -2,
			onTryMove: function (pokemon, target, move) {
				if (!pokemon.hasItem('metronome')) {
					pokemon.removeVolatile('metronome');
					return;
				}
				if (this.effectData.lastMove === move.id) {
					this.effectData.numConsecutive++;
				} else {
					this.effectData.numConsecutive = 0;
				}
				this.effectData.lastMove = move.id;
			},
			onModifyDamagePhase2: function (damage, source, target, move) {
				return damage * (1 + (this.effectData.numConsecutive / 10));
			},
		},
	},
	"rowapberry": {
		inherit: true,
		onAfterDamage: function () {},
		onAfterMoveSecondary: function (target, source, move) {
			if (source && source !== target && move && move.category === 'Special') {
				if (target.eatItem()) {
					this.damage(source.maxhp / 8, source, target, null, true);
				}
			}
		},
	},
	"stick": {
		inherit: true,
		onModifyCritRatio: function (critRatio, user) {
			if (user.template.species === 'Farfetch\'d') {
				return critRatio + 2;
			}
		},
	},
	"thickclub": {
		inherit: true,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.template.species === 'Cubone' || pokemon.template.species === 'Marowak') {
				return this.chainModify(2);
			}
		},
	},
};

exports.BattleItems = BattleItems;
