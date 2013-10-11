exports.BattleMovedex = {
	cottonspore: {
		inherit: true,
		onTryHit: function(target, source) {
			return !target.hasType('Grass');
		}
	},
	spore: {
		inherit: true,
		onTryHit: function(target, source) {
			return !target.hasType('Grass');
		}
	},
	stunspore: {
		inherit: true,
		onTryHit: function(target, source) {
			return !target.hasType('Grass');
		}
	}
};
