'use strict';

exports.BattleItems = {
	"airballoon": {
		inherit: true,
		onAfterDamage: function (damage, target, source, effect) {
			if (effect.effectType === 'Move' && effect.id !== 'confused') {
				this.add('-enditem', target, 'Air Balloon');
				if (target.item === 'airballoon') {
					target.item = '';
					target.itemData = {id: '', target: target};
				}
				if (target.ability === 'airballoon') {
					target.baseAbility = target.ability = '';
					target.abilityData = {id: '', target: target};
				}
				this.runEvent('AfterUseItem', target, null, null, 'airballoon');
			}
		},
		onAfterSubDamage: function (damage, target, source, effect) {
			if (effect.effectType === 'Move' && effect.id !== 'confused') {
				this.add('-enditem', target, 'Air Balloon');
				if (target.item === 'airballoon') {
					target.item = '';
					target.itemData = {id: '', target: this};
				}
				if (target.ability === 'airballoon') {
					target.baseAbility = target.ability = '';
					target.abilityData = {id: '', target: this};
				}
				this.itemData = {id: '', target: this};
				this.runEvent('AfterUseItem', target, null, null, 'airballoon');
			}
		},
	},
};
