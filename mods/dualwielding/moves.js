'use strict';

exports.BattleMovedex = {
	"incinerate": {
		inherit: true,
		onHit: function (pokemon, source) {
			let item = pokemon.getItem();
			if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
			let dual = pokemon.getAbility();
			if ((dual.isBerry || dual.isGem) && pokemon.takeDual(source)) {
				this.add('-endItem', pokemon, item.name, '[from] move: Incinerate');
			}
		},
	},
	"knockoff": {
		inherit: true,
		onBasePower: function (basePower, source, target, move) {
			let item = target.getItem();
			if (item.id && this.singleEvent('TakeItem', item, target.itemData, target, source, move, item)) {
				return this.chainModify(1.5);
			}
			let dual = target.getAbility();
			if (dual.id && dual.effectType === 'Item' && this.singleEvent('TakeItem', dual, target.abilityData, target, source, move, dual)) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit: function (target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
				}
				item = target.takeDual();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of]' + source);
				}
			}
		},
	},
	"switcheroo": {
		inherit: true,
		onHit: function (target, source, move) {
			let didSomething = false;
			let yourItem = target.takeItem(source);
			let myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) || (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myItem) {
					target.setItem(myItem);
					this.add('-item', target, myItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
				}
				if (yourItem) {
					source.setItem(yourItem);
					this.add('-item', source, yourItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			let yourDual = target.takeDual(source);
			let myDual = source.takeDual();
			if (target.ability || source.ability || (!yourItem && !myItem)) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else if ((myDual && !this.singleEvent('TakeItem', myDual, source.abilityData, target, source, move, myDual)) || (yourDual && !this.singleEvent('TakeItem', yourDual, target.abilityData, source, target, move, yourDual))) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myDual) {
					target.setAbility(myDual);
					target.baseAbility = target.ability;
					this.add('-item', target, myDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourDual, '[silent]', '[from] move: Switcheroo');
				}
				if (yourDual) {
					source.setAbility(yourDual);
					source.baseAbility = source.ability;
					this.add('-item', source, yourDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myDual, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			if (!didSomething) return false;
		},
	},
	"trick": {
		inherit: true,
		onHit: function (target, source, move) {
			let didSomething = false;
			let yourItem = target.takeItem(source);
			let myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) || (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myItem) {
					target.setItem(myItem);
					this.add('-item', target, myItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
				}
				if (yourItem) {
					source.setItem(yourItem);
					this.add('-item', source, yourItem, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			let yourDual = target.takeDual(source);
			let myDual = source.takeDual();
			if (target.ability || source.ability || (!yourItem && !myItem)) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else if ((myDual && !this.singleEvent('TakeItem', myDual, source.abilityData, target, source, move, myDual)) || (yourDual && !this.singleEvent('TakeItem', yourDual, target.abilityData, source, target, move, yourDual))) {
				if (yourDual) target.baseAbility = target.ability = yourDual.id;
				if (myDual) source.baseAbility = source.ability = myDual.id;
			} else {
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myDual) {
					target.setAbility(myDual);
					this.add('-item', target, myDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', target, yourDual, '[silent]', '[from] move: Switcheroo');
				}
				if (yourDual) {
					source.setAbility(yourDual);
					this.add('-item', source, yourDual, '[from] move: Switcheroo');
				} else {
					this.add('-enditem', source, myDual, '[silent]', '[from] move: Switcheroo');
				}
				didSomething = true;
			}
			if (!didSomething) return false;
		},
	},
};
