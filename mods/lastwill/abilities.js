'use strict';

exports.BattleAbilities = {
	"rockhead": {
		inherit: true,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
	},
};
