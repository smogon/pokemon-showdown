exports.BattleAbilities = {
	"angerpoint": {
		inherit: true,
		desc: "If this Pokemon, or its Substitute, is struck by a Critical Hit, its Attack is boosted to six stages.",
		shortDesc: "If this Pokemon is hit by a critical hit, its Attack is boosted by 12.",
		onAfterSubDamage: function (damage, target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({atk: 6});
				this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
			}
		}
	},
	"flowergift": {
		inherit: true,
		onAllyModifyAtk: function (atk) {
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpD: function (spd) {
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		}
	},
	"forewarn": {
		inherit: true,
		onStart: function (pokemon) {
			var targets = pokemon.side.foe.active;
			var warnMoves = [];
			var warnBp = 1;
			for (var i = 0; i < targets.length; i++) {
				if (targets[i].fainted) continue;
				for (var j = 0; j < targets[i].moveset.length; j++) {
					var move = this.getMove(targets[i].moveset[j].move);
					var bp = move.basePower;
					if (move.ohko) bp = 160;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [move];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push(move);
					}
				}
			}
			if (!warnMoves.length) return;
			var warnMove = warnMoves[this.random(warnMoves.length)];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove);
		}
	},
	"leafguard": {
		inherit: true,
		onSetStatus: function (status, target, source, effect) {
			if (effect && effect.id === 'rest') {
				return;
			} else if (this.isWeather('sunnyday')) {
				return false;
			}
		}
	},
	"lightningrod": {
		inherit: true,
		desc: "During double battles, this Pokemon draws any single-target Electric-type attack to itself. If an opponent uses an Electric-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Electric Hidden Power or Judgment.",
		shortDesc: "This Pokemon draws Electric moves to itself.",
		onTryHit: function () {},
		rating: 0
	},
	"magicguard": {
		//desc: "",
		shortDesc: "This Pokemon can only be damaged by direct attacks.",
		onDamage: function (damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (effect && effect.id === 'toxicspikes') {
				return false;
			}
		},
		id: "magicguard",
		name: "Magic Guard",
		rating: 4.5,
		num: 98
	},
	"minus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if its partner has the Plus ability.",
		shortDesc: "If an ally has the Plus Ability, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpA: function (spa, pokemon) {
			var allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (var i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].ability === 'plus') {
					return spa * 1.5;
				}
			}
		},
		id: "minus",
		name: "Minus",
		rating: 0,
		num: 58
	},
	"normalize": {
		inherit: true,
		onModifyMovePriority: -1,
		onModifyMove: function (move) {
			if (move.id !== 'struggle') {
				move.type = 'Normal';
			}
		}
	},
	"pickup": {
		desc: "No in-battle effect.",
		shortDesc: "No in-battle effect.",
		id: "pickup",
		name: "Pickup",
		rating: 0,
		num: 53
	},
	"plus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if its partner has the Minus ability.",
		shortDesc: "If an ally has the Minus Ability, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpA: function (spa, pokemon) {
			var allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (var i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].ability === 'minus') {
					return spa * 1.5;
				}
			}
		},
		id: "plus",
		name: "Plus",
		rating: 0,
		num: 57
	},
	"pressure": {
		desc: "If this Pokemon is the target of another Pokemon's move, that move loses one additional PP.",
		shortDesc: "If this Pokemon is the target of a move, that move loses one additional PP.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP: function (target, source) {
			if (target === source) return;
			return 1;
		},
		id: "pressure",
		name: "Pressure",
		rating: 1.5,
		num: 46
	},
	"simple": {
		shortDesc: "If this Pokemon's stat stages are raised or lowered, the effect is doubled instead.",
		onModifyBoost: function (boosts) {
			for (var key in boosts) {
				boosts[key] *= 2;
			}
		},
		id: "simple",
		name: "Simple",
		rating: 4,
		num: 86
	},
	"stench": {
		desc: "No in-battle effect.",
		shortDesc: "No in-battle effect.",
		id: "stench",
		name: "Stench",
		rating: 0,
		num: 1
	},
	"stormdrain": {
		inherit: true,
		desc: "During double battles, this Pokemon draws any single-target Water-type attack to itself. If an opponent uses an Water-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Water Hidden Power, Judgment or Weather Ball.",
		shortDesc: "This Pokemon draws Water moves to itself.",
		onTryHit: function () {},
		rating: 0
	},
	"sturdy": {
		inherit: true,
		onDamage: function () {}
	},
	"synchronize": {
		inherit: true,
		onAfterSetStatus: function (status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			var id = status.id;
			if (id === 'slp' || id === 'frz') return;
			if (id === 'tox') id = 'psn';
			source.trySetStatus(id);
		}
	},
	"trace": {
		inherit: true,
		onUpdate: function (pokemon) {
			var target = pokemon.side.foe.randomActive();
			if (!target || target.fainted) return;
			var ability = this.getAbility(target.ability);
			var bannedAbilities = {forecast:1, multitype:1, trace:1};
			if (bannedAbilities[target.ability]) {
				return;
			}
			if (pokemon.setAbility(ability)) {
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
			}
		}
	},
	"wonderguard": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle' || move.id === 'firefang') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-activate', target, 'ability: Wonder Guard');
				return null;
			}
		}
	}
};
