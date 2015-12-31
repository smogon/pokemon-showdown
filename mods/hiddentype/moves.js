'use strict';

exports.BattleMovedex = {
	reflecttype: {
		inherit: true,
		onHit: function (target, source) {
			if (source.template && source.template.num === 493) return false;
			this.add('-start', source, 'typechange', '[from] move: Reflect Type', '[of] ' + target);

			let typeMap = {};
			source.typesData = [];
			for (let i = 0, l = target.typesData.length; i < l; i++) {
				let typeData = target.typesData[i];
				if (typeMap[typeData.type]) continue;
				typeMap[typeData.type] = true;

				if (typeData.isCustom) {
					source.typesData.push({
						type: source.baseHpType,
						suppressed: false,
						isAdded: typeData.isAdded,
						isCustom: true,
					});
				} else {
					if (typeData.suppressed) continue;
					source.typesData.push({
						type: typeData.type,
						suppressed: false,
						isAdded: typeData.isAdded,
					});
				}
			}
		},
	},
};
