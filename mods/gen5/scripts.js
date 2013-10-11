exports.BattleScripts = {
	gen: 5,
	init: function () {
		for (var i in this.data.Learnsets) {
			this.modData('Learnsets', i);
			var learnset = this.data.Learnsets[i].learnset;
			for (var moveid in learnset) {
				if (typeof learnset[moveid] === 'string') learnset[moveid] = [learnset[moveid]];
				learnset[moveid] = learnset[moveid].filter(function(source) {
					return source[0] !== '6';
				});
				if (!learnset[moveid].length) delete learnset[moveid];
			}
		}
	}
};
