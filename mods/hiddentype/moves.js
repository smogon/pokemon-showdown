'use strict';

exports.BattleMovedex = {
	reflecttype: {
		inherit: true,
		onHit: function (target, source) {
			if (source.template && (source.template.num === 493 || source.template.num === 773)) return false;
			this.add('-start', source, 'typechange', '[from] move: Reflect Type', '[of] ' + target);

			source.types = target.types;
			if (target.addedType !== target.hpType) {
				source.addedType = target.addedType;
			} else if (source.types.indexOf(source.hpType) < 0) {
				source.addedType = source.hpType;
			} else {
				source.addedType = '';
			}
			source.knownType = target.side === source.side && target.knownType;
		},
	},
};
