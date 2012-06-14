exports.BattleMovedex = {
	drainpunch: {
		inherit: true,
		basePower: 60
	},
	hijumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user takes half of the damage it would have dealt in recoil damage.",
		shortDesc: "User takes half damage it would have dealt if miss.",
		onMoveFail: function(target, source, move) {
			var damage = this.getDamage(source, target, move, true);
			this.damage(damage/2, source);
		}
	},
	gigadrain: {
		inherit: true,
		basePower: 60
	},
	magikarpsrevenge: null
};
