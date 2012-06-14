function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleMovedex = {
	beatup: {
		inherit: true,
		basePower: 10,
		basePowerCallback: undefined,
		desc: "Does one hit for the user and each other unfainted non-egg active and non-active Pokemon on the user's side without a status problem."
	},
	bind: {
		inherit: true,
		accuracy: 75
	},
	bonerush: {
		inherit: true,
		accuracy: 80
	},
	bulletseed: {
		inherit: true,
		basePower: 10
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10
	},
	cottonspore: {
		inherit: true,
		accuracy: 85
	},
	covet: {
		inherit: true,
		basePower: 40
	},
	crabhammer: {
		inherit: true,
		accuracy: 85
	},
	detect: {
		inherit: true,
		//desc: "",
		priority: 3
	},
	disable: {
		inherit: true,
		accuracy: 80
	},
	doomdesire: {
		inherit: true,
		accuracy: 85,
		basePower: 120
	},
	drainpunch: {
		inherit: true,
		basePower: 60,
		pp: 5
	},
	extremespeed: {
		inherit: true,
		shortDesc: "Usually goes first.",
		priority: 1
	},
	fakeout: {
		inherit: true,
		shortDesc: "Usually hits first; first turn out only; target flinch.",
		priority: 1
	},
	feint: {
		inherit: true,
		basePower: 50
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15
	},
	furycutter: {
		inherit: true,
		basePower: 10
	},
	futuresight: {
		inherit: true,
		accuracy: 90,
		basePower: 80,
		pp: 15
	},
	gigadrain: {
		inherit: true,
		basePower: 60
	},
	glare: {
		inherit: true,
		accuracy: 75
	},
	growth: {
		inherit: true,
		desc: "Raises the user's Special Attack by 1 stage.",
		shortDesc: "Boosts the user's Sp. Atk by 1.",
		onModifyMove: undefined,
		boosts: {
			spa: 1
		}
	},
	hijumpkick: {
		inherit: true,
		basePower: 100,
		desc: "If this attack misses the target, the user takes half of the damage it would have dealt in recoil damage.",
		shortDesc: "User takes half damage it would have dealt if miss.",
		pp: 20,
		onMoveFail: function(target, source, move) {
			var damage = this.getDamage(source, target, move, true);
			this.damage(clampIntRange(damage/2, 1, Math.floor(target.maxhp/2)), source);
		}
	},
	iciclespear: {
		inherit: true,
		basePower: 10
	},
	jumpkick: {
		inherit: true,
		basePower: 85,
		desc: "If this attack misses the target, the user takes half of the damage it would have dealt in recoil damage.",
		shortDesc: "User takes half damage it would have dealt if miss.",
		pp: 25,
		onMoveFail: function(target, source, move) {
			var damage = this.getDamage(source, target, move, true);
			this.damage(clampIntRange(damage/2, 1, Math.floor(target.maxhp/2)), source);
		}
	},
	lastresort: {
		inherit: true,
		basePower: 130
	},
	magmastorm: {
		inherit: true,
		accuracy: 70
	},
	petaldance: {
		inherit: true,
		basePower: 90,
		pp: 20
	},
	poisongas: {
		inherit: true,
		accuracy: 55
	},
	protect: {
		inherit: true,
		//desc: "",
		priority: 3
	},
	rockblast: {
		inherit: true,
		accuracy: 80
	},
	sandtomb: {
		inherit: true,
		accuracy: 70,
		basePower: 15
	},
	scaryface: {
		inherit: true,
		accuracy: 90
	},
	tackle: {
		inherit: true,
		accuracy: 95,
		basePower: 35
	},
	tailglow: {
		inherit: true,
		desc: "Raises the user's Special Attack by 2 stages.",
		shortDesc: "Boosts the user's Sp. Atk by 2.",
		boosts: {
			spa: 2
		}
	},
	thrash: {
		inherit: true,
		basePower: 90,
		pp: 20
	},
	toxic: {
		inherit: true,
		accuracy: 85
	},
	uproar: {
		inherit: true,
		basePower: 50
	},
	whirlpool: {
		inherit: true,
		accuracy: 70,
		basePower: 15
	},
	wish: {
		inherit: true,
		//desc: "",
		shortDesc: "Next turn, heals 50% of the recipient's max HP.",
		sideCondition: 'Wish',
		effect: {
			duration: 2,
			onResidualOrder: 2,
			onEnd: function(side) {
				var target = side.active[this.effectData.sourcePosition];
				if (!target.fainted) {
					var source = this.effectData.source;
					var damage = this.heal(target.maxhp/2, target, target);
					if (damage) this.add('-heal', target, target.hpChange(damage), '[from] move: Wish', '[wisher] '+source.name);
				}
			}
		}
	},
	wrap: {
		inherit: true,
		accuracy: 85
	},
	magikarpsrevenge: null
};
