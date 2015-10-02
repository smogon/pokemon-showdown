/*

Ratings and how they work:

-2: Extremely detrimental
	  The sort of ability that relegates Pokemon with Uber-level BSTs into NU.
	ex. Slow Start, Truant

-1: Detrimental
	  An ability that does more harm than good.
	ex. Defeatist, Normalize

 0: Useless
	  An ability with no net effect during a singles battle.
	ex. Healer, Illuminate

 1: Ineffective
	  An ability that has a minimal effect. Should not be chosen over any other ability.
	ex. Damp, Shell Armor

 2: Situationally useful
	  An ability that can be useful in certain situations.
	ex. Blaze, Insomnia

 3: Useful
	  An ability that is generally useful.
	ex. Infiltrator, Sturdy

 4: Very useful
	  One of the most popular abilities. The difference between 3 and 4 can be ambiguous.
	ex. Protean, Regenerator

 5: Essential
	  The sort of ability that defines metagames.
	ex. Desolate Land, Shadow Tag

*/

exports.BattleAbilities = {
	"adaptability": {
		desc: "This Pokemon's moves that match one of its types have a same-type attack bonus (STAB) of 2 instead of 1.5.",
		shortDesc: "This Pokemon's same-type attack bonus (STAB) is 2 instead of 1.5.",
		onModifyMove: function (move) {
			move.stab = 2;
		},
		id: "adaptability",
		name: "Adaptability",
		rating: 3.5,
		num: 91
	},
	"aftermath": {
		desc: "If this Pokemon is knocked out with a contact move, that move's user loses 1/4 of its maximum HP, rounded down. If any active Pokemon has the Ability Damp, this effect is prevented.",
		shortDesc: "If this Pokemon is KOed with a contact move, that move's user loses 1/4 its max HP.",
		id: "aftermath",
		name: "Aftermath",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && !target.hp) {
				this.damage(source.maxhp / 4, source, target, null, true);
			}
		},
		rating: 2.5,
		num: 106
	},
	"aerilate": {
		desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Flying';
				if (move.category !== 'Status') pokemon.addVolatile('aerilate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "aerilate",
		name: "Aerilate",
		rating: 4,
		num: 185
	},
	"airlock": {
		shortDesc: "While this Pokemon is active, the effects of weather conditions are disabled.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Air Lock');
		},
		suppressWeather: true,
		id: "airlock",
		name: "Air Lock",
		rating: 3,
		num: 76
	},
	"analytic": {
		desc: "The power of this Pokemon's move is multiplied by 1.3 if it is the last to move in a turn. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon's attacks have 1.3x power if it is the last to move in a turn.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (!this.willMove(defender)) {
				this.debug('Analytic boost');
				return this.chainModify([0x14CD, 0x1000]); // The Analytic modifier is slightly higher than the normal 1.3 (0x14CC)
			}
		},
		id: "analytic",
		name: "Analytic",
		rating: 2,
		num: 148
	},
	"angerpoint": {
		desc: "If this Pokemon, but not its substitute, is struck by a critical hit, its Attack is raised by 12 stages.",
		shortDesc: "If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.",
		onAfterDamage: function (damage, target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({atk: 6});
				this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
			}
		},
		id: "angerpoint",
		name: "Anger Point",
		rating: 2,
		num: 83
	},
	"anticipation": {
		desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective on this Pokemon, or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, while Hidden Power, Judgment, Natural Gift, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move.",
		onStart: function (pokemon) {
			var targets = pokemon.side.foe.active;
			for (var i = 0; i < targets.length; i++) {
				if (!targets[i] || targets[i].fainted) continue;
				for (var j = 0; j < targets[i].moveset.length; j++) {
					var move = this.getMove(targets[i].moveset[j].move);
					if (move.category !== 'Status' && (this.getImmunity(move.type, pokemon) && this.getEffectiveness(move.type, pokemon) > 0 || move.ohko)) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
		id: "anticipation",
		name: "Anticipation",
		rating: 1,
		num: 107
	},
	"arenatrap": {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or are airborne.",
		shortDesc: "Prevents adjacent foes from choosing to switch unless they are airborne.",
		onFoeModifyPokemon: function (pokemon) {
			if (!this.isAdjacent(pokemon, this.effectData.target)) return;
			if (pokemon.isGrounded()) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!this.isAdjacent(pokemon, source)) return;
			if (pokemon.isGrounded()) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "arenatrap",
		name: "Arena Trap",
		rating: 4.5,
		num: 71
	},
	"aromaveil": {
		desc: "This Pokemon and its allies cannot be affected by Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		shortDesc: "Protects user/allies from Attract, Disable, Encore, Heal Block, Taunt, and Torment.",
		onAllyTryHit: function (target, source, move) {
			if (move && move.id in {attract:1, disable:1, encore:1, healblock:1, taunt:1, torment:1}) {
				return false;
			}
		},
		id: "aromaveil",
		name: "Aroma Veil",
		rating: 1.5,
		num: 165
	},
	"aurabreak": {
		desc: "While this Pokemon is active, the effects of the Abilities Dark Aura and Fairy Aura are reversed, multiplying the power of Dark- and Fairy-type moves, respectively, by 3/4 instead of 1.33.",
		shortDesc: "While this Pokemon is active, the Dark Aura and Fairy Aura power modifier is 0.75x.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Aura Break');
		},
		onAnyTryPrimaryHit: function (target, source, move) {
			if (target === source || move.category === 'Status') return;
			source.addVolatile('aurabreak');
		},
		effect: {
			duration: 1
		},
		id: "aurabreak",
		name: "Aura Break",
		rating: 2,
		num: 188
	},
	"baddreams": {
		desc: "Causes adjacent opposing Pokemon to lose 1/8 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
		shortDesc: "Causes sleeping adjacent foes to lose 1/8 of their max HP at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			for (var i = 0; i < pokemon.side.foe.active.length; i++) {
				var target = pokemon.side.foe.active[i];
				if (!target || !target.hp) continue;
				if (target.status === 'slp') {
					this.damage(target.maxhp / 8, target);
				}
			}
		},
		id: "baddreams",
		name: "Bad Dreams",
		rating: 2,
		num: 123
	},
	"battlearmor": {
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
		onCriticalHit: false,
		id: "battlearmor",
		name: "Battle Armor",
		rating: 1,
		num: 4
	},
	"bigpecks": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Defense stat stage.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0) {
				boost['def'] = 0;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
			}
		},
		id: "bigpecks",
		name: "Big Pecks",
		rating: 0.5,
		num: 145
	},
	"blaze": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Fire-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Fire attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		id: "blaze",
		name: "Blaze",
		rating: 2,
		num: 66
	},
	"bulletproof": {
		shortDesc: "This Pokemon is immune to bullet moves.",
		onTryHit: function (pokemon, target, move) {
			if (move.flags['bullet']) {
				this.add('-immune', pokemon, '[msg]', '[from] Bulletproof');
				return null;
			}
		},
		id: "bulletproof",
		name: "Bulletproof",
		rating: 3,
		num: 171
	},
	"cheekpouch": {
		desc: "If this Pokemon eats a Berry, it restores 1/3 of its maximum HP, rounded down, in addition to the Berry's effect.",
		shortDesc: "If this Pokemon eats a Berry, it restores 1/3 of its max HP after the Berry's effect.",
		onEatItem: function (item, pokemon) {
			this.heal(pokemon.maxhp / 3);
		},
		id: "cheekpouch",
		name: "Cheek Pouch",
		rating: 2,
		num: 167
	},
	"chlorophyll": {
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
		onModifySpe: function (spe) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2);
			}
		},
		id: "chlorophyll",
		name: "Chlorophyll",
		rating: 2.5,
		num: 34
	},
	"clearbody": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			var showMsg = false;
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Clear Body", "[of] " + target);
		},
		id: "clearbody",
		name: "Clear Body",
		rating: 2,
		num: 29
	},
	"cloudnine": {
		shortDesc: "While this Pokemon is active, the effects of weather conditions are disabled.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Cloud Nine');
		},
		suppressWeather: true,
		id: "cloudnine",
		name: "Cloud Nine",
		rating: 3,
		num: 13
	},
	"colorchange": {
		desc: "This Pokemon's type changes to match the type of the last move that hit it, unless that type is already one of its types. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's type changes to the type of a move it's hit by, unless it has the type.",
		onAfterMoveSecondary: function (target, source, move) {
			var type = move.type;
			if (target.isActive && move.effectType === 'Move' && move.category !== 'Status' && type !== '???' && !target.hasType(type)) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] Color Change');
				target.update();
			}
		},
		id: "colorchange",
		name: "Color Change",
		rating: 1,
		num: 16
	},
	"competitive": {
		desc: "This Pokemon's Special Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			var statsLowered = false;
			for (var i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({spa: 2});
			}
		},
		id: "competitive",
		name: "Competitive",
		rating: 2.5,
		num: 172
	},
	"compoundeyes": {
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return accuracy * 1.3;
		},
		id: "compoundeyes",
		name: "Compound Eyes",
		rating: 3.5,
		num: 14
	},
	"contrary": {
		shortDesc: "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.",
		onBoost: function (boost) {
			for (var i in boost) {
				boost[i] *= -1;
			}
		},
		id: "contrary",
		name: "Contrary",
		rating: 4,
		num: 126
	},
	"cursedbody": {
		desc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled unless one of the attacker's moves is already disabled.",
		shortDesc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled.",
		onAfterDamage: function (damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move') {
				if (this.random(10) < 3) {
					source.addVolatile('disable');
				}
			}
		},
		id: "cursedbody",
		name: "Cursed Body",
		rating: 2,
		num: 130
	},
	"cutecharm": {
		desc: "There is a 30% chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender.",
		shortDesc: "30% chance of infatuating Pokemon of the opposite gender if they make contact.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.addVolatile('attract', target);
				}
			}
		},
		id: "cutecharm",
		name: "Cute Charm",
		rating: 1,
		num: 56
	},
	"damp": {
		desc: "While this Pokemon is active, Self-Destruct, Explosion, and the Ability Aftermath are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, Self-Destruct, Explosion, and Aftermath have no effect.",
		id: "damp",
		onAnyTryMove: function (target, source, effect) {
			if (effect.id === 'selfdestruct' || effect.id === 'explosion') {
				this.attrLastMove('[still]');
				this.add('-activate', this.effectData.target, 'ability: Damp');
				return false;
			}
		},
		onAnyDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'aftermath') {
				return false;
			}
		},
		name: "Damp",
		rating: 1,
		num: 6
	},
	"darkaura": {
		desc: "While this Pokemon is active, the power of Dark-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, a Dark move used by any Pokemon has 1.33x power.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Dark Aura');
		},
		onAnyTryPrimaryHit: function (target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Dark') {
				source.addVolatile('aura');
			}
		},
		id: "darkaura",
		name: "Dark Aura",
		rating: 3,
		num: 186
	},
	"defeatist": {
		desc: "While this Pokemon has 1/2 or less of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onResidual: function (pokemon) {
			pokemon.update();
		},
		id: "defeatist",
		name: "Defeatist",
		rating: -1,
		num: 129
	},
	"defiant": {
		desc: "This Pokemon's Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			var statsLowered = false;
			for (var i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: 2});
			}
		},
		id: "defiant",
		name: "Defiant",
		rating: 2.5,
		num: 128
	},
	"deltastream": {
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land or Primordial Sea.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
		onStart: function (source) {
			this.setWeather('deltastream');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'deltastream' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1})) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					var target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('deltastream')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "deltastream",
		name: "Delta Stream",
		rating: 5,
		num: 191
	},
	"desolateland": {
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Primordial Sea.",
		shortDesc: "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.",
		onStart: function (source) {
			this.setWeather('desolateland');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'desolateland' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1})) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					var target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('desolateland')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "desolateland",
		name: "Desolate Land",
		rating: 5,
		num: 190
	},
	"download": {
		desc: "On switch-in, this Pokemon's Attack or Special Attack is raised by 1 stage based on the weaker combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "On switch-in, Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense.",
		onStart: function (pokemon) {
			var foeactive = pokemon.side.foe.active;
			var totaldef = 0;
			var totalspd = 0;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				totaldef += foeactive[i].getStat('def', false, true);
				totalspd += foeactive[i].getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa:1});
			} else if (totalspd) {
				this.boost({atk:1});
			}
		},
		id: "download",
		name: "Download",
		rating: 4,
		num: 88
	},
	"drizzle": {
		shortDesc: "On switch-in, this Pokemon summons Rain Dance.",
		onStart: function (source) {
			this.setWeather('raindance');
		},
		id: "drizzle",
		name: "Drizzle",
		rating: 4.5,
		num: 2
	},
	"drought": {
		shortDesc: "On switch-in, this Pokemon summons Sunny Day.",
		onStart: function (source) {
			this.setWeather('sunnyday');
		},
		id: "drought",
		name: "Drought",
		rating: 4.5,
		num: 70
	},
	"dryskin": {
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day.",
		shortDesc: "This Pokemon is healed 1/4 by Water, 1/8 by Rain; is hurt 1.25x by Fire, 1/8 by Sun.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		onBasePowerPriority: 7,
		onFoeBasePower: function (basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.type === 'Fire') {
				return this.chainModify(1.25);
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 8);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.maxhp / 8);
			}
		},
		id: "dryskin",
		name: "Dry Skin",
		rating: 3.5,
		num: 87
	},
	"earlybird": {
		shortDesc: "This Pokemon's sleep counter drops by 2 instead of 1.",
		id: "earlybird",
		name: "Early Bird",
		// Implemented in statuses.js
		rating: 2.5,
		num: 48
	},
	"effectspore": {
		desc: "30% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep.",
		shortDesc: "30% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status && source.runImmunity('powder')) {
				var r = this.random(100);
				if (r < 11) {
					source.setStatus('slp', target);
				} else if (r < 21) {
					source.setStatus('par', target);
				} else if (r < 30) {
					source.setStatus('psn', target);
				}
			}
		},
		id: "effectspore",
		name: "Effect Spore",
		rating: 2,
		num: 27
	},
	"fairyaura": {
		desc: "While this Pokemon is active, the power of Fairy-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, a Fairy move used by any Pokemon has 1.33x power.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyTryPrimaryHit: function (target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Fairy') {
				source.addVolatile('aura');
			}
		},
		id: "fairyaura",
		name: "Fairy Aura",
		rating: 3,
		num: 187
	},
	"filter": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(0.75);
			}
		},
		id: "filter",
		name: "Filter",
		rating: 3,
		num: 111
	},
	"flamebody": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be burned.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('brn', target, move);
				}
			}
		},
		id: "flamebody",
		name: "Flame Body",
		rating: 2,
		num: 49
	},
	"flareboost": {
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 1.5.",
		shortDesc: "While this Pokemon is burned, its special attacks have 1.5x power.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(1.5);
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 2.5,
		num: 138
	},
	"flashfire": {
		desc: "This Pokemon is immune to Fire-type moves. The first time it is hit by a Fire-type move, its attacking stat is multiplied by 1.5 while using a Fire-type attack as long as it remains active and has this Ability. If this Pokemon is frozen, it cannot be defrosted by Fire-type attacks.",
		shortDesc: "This Pokemon's Fire attacks do 1.5x damage if hit by one Fire move; Fire immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		onEnd: function (pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function (atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			}
		},
		id: "flashfire",
		name: "Flash Fire",
		rating: 3,
		num: 18
	},
	"flowergift": {
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		onStart: function (pokemon) {
			delete this.effectData.forme;
		},
		onUpdate: function (pokemon) {
			if (!pokemon.isActive || pokemon.baseTemplate.speciesid !== 'cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				if (pokemon.template.speciesid !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine');
					this.add('-formechange', pokemon, 'Cherrim-Sunshine', '[msg]');
				}
			} else {
				if (pokemon.template.speciesid === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim');
					this.add('-formechange', pokemon, 'Cherrim', '[msg]');
				}
			}
		},
		onModifyAtkPriority: 3,
		onAllyModifyAtk: function (atk) {
			if (this.effectData.target.baseTemplate.speciesid !== 'cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD: function (spd) {
			if (this.effectData.target.baseTemplate.speciesid !== 'cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 2.5,
		num: 122
	},
	"flowerveil": {
		desc: "Grass-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a major status condition inflicted on them by other Pokemon.",
		shortDesc: "This side's Grass types can't have stats lowered or status inflicted by other Pokemon.",
		onAllyBoost: function (boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
			var showMsg = false;
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Flower Veil", "[of] " + target);
		},
		onAllySetStatus: function (status, target) {
			if (target.hasType('Grass')) return false;
		},
		id: "flowerveil",
		name: "Flower Veil",
		rating: 0,
		num: 166
	},
	"forecast": {
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm.",
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.species !== 'Castform' || pokemon.transformed) return;
			var forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.template.speciesid !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.template.speciesid !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
				if (pokemon.template.speciesid !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.template.speciesid !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]');
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 3,
		num: 59
	},
	"forewarn": {
		desc: "On switch-in, this Pokemon is alerted to the move with the highest power, at random, known by an opposing Pokemon.",
		shortDesc: "On switch-in, this Pokemon is alerted to the foes' move with the highest power.",
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
						warnMoves = [[move, targets[i]]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, targets[i]]);
					}
				}
			}
			if (!warnMoves.length) return;
			var warnMove = warnMoves[this.random(warnMoves.length)];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove[0], '[of] ' + warnMove[1]);
		},
		id: "forewarn",
		name: "Forewarn",
		rating: 1,
		num: 108
	},
	"friendguard": {
		shortDesc: "This Pokemon's allies receive 3/4 damage from other Pokemon's attacks.",
		id: "friendguard",
		name: "Friend Guard",
		onAnyModifyDamage: function (damage, source, target, move) {
			if (target !== this.effectData.target && target.side === this.effectData.target.side) {
				this.debug('Friend Guard weaken');
				return this.chainModify(0.75);
			}
		},
		rating: 0,
		num: 132
	},
	"frisk": {
		shortDesc: "On switch-in, this Pokemon identifies the held items of all opposing Pokemon.",
		onStart: function (pokemon) {
			var foeactive = pokemon.side.foe.active;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				if (foeactive[i].item) {
					this.add('-item', foeactive[i], foeactive[i].getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
				}
			}
		},
		id: "frisk",
		name: "Frisk",
		rating: 1.5,
		num: 119
	},
	"furcoat": {
		shortDesc: "This Pokemon's Defense is doubled.",
		onModifyDefPriority: 6,
		onModifyDef: function (def) {
			return this.chainModify(2);
		},
		id: "furcoat",
		name: "Fur Coat",
		rating: 3.5,
		num: 169
	},
	"galewings": {
		shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 1;
		},
		id: "galewings",
		name: "Gale Wings",
		rating: 4.5,
		num: 177
	},
	"gluttony": {
		shortDesc: "When this Pokemon has 1/2 or less of its maximum HP, it uses certain Berries early.",
		id: "gluttony",
		name: "Gluttony",
		rating: 1,
		num: 82
	},
	"gooey": {
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) this.boost({spe: -1}, source, target);
		},
		id: "gooey",
		name: "Gooey",
		rating: 2.5,
		num: 183
	},
	"grasspelt": {
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 1.5.",
		onModifyDefPriority: 6,
		onModifyDef: function (pokemon) {
			if (this.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		id: "grasspelt",
		name: "Grass Pelt",
		rating: 0.5,
		num: 179
	},
	"guts": {
		desc: "If this Pokemon has a major status condition, its Attack is multiplied by 1.5; burn's physical damage halving is ignored.",
		shortDesc: "If this Pokemon is statused, its Attack is 1.5x; ignores burn halving physical damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "guts",
		name: "Guts",
		rating: 3,
		num: 62
	},
	"harvest": {
		desc: "If the last item this Pokemon used is a Berry, there is a 50% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 100%.",
		shortDesc: "If last item used is a Berry, 50% chance to restore it each end of turn. 100% in Sun.",
		id: "harvest",
		name: "Harvest",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland']) || this.random(2) === 0) {
				if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		rating: 2.5,
		num: 139
	},
	"healer": {
		desc: "There is a 30% chance of curing an adjacent ally's major status condition at the end of each turn.",
		shortDesc: "30% chance of curing an adjacent ally's status at the end of each turn.",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			var allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (var i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && this.isAdjacent(pokemon, allyActive[i]) && allyActive[i].status && this.random(10) < 3) {
					allyActive[i].cureStatus();
				}
			}
		},
		rating: 0,
		num: 131
	},
	"heatproof": {
		desc: "The power of Fire-type attacks against this Pokemon is halved, and any burn damage taken is 1/16 of its maximum HP, rounded down.",
		shortDesc: "The power of Fire-type attacks against this Pokemon is halved; burn damage halved.",
		onBasePowerPriority: 7,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 2;
			}
		},
		id: "heatproof",
		name: "Heatproof",
		rating: 2.5,
		num: 85
	},
	"heavymetal": {
		shortDesc: "This Pokemon's weight is doubled.",
		onModifyWeight: function (weight) {
			return weight * 2;
		},
		id: "heavymetal",
		name: "Heavy Metal",
		rating: -1,
		num: 134
	},
	"honeygather": {
		shortDesc: "No competitive use.",
		id: "honeygather",
		name: "Honey Gather",
		rating: 0,
		num: 118
	},
	"hugepower": {
		shortDesc: "This Pokemon's Attack is doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.chainModify(2);
		},
		id: "hugepower",
		name: "Huge Power",
		rating: 5,
		num: 37
	},
	"hustle": {
		desc: "This Pokemon's Attack is multiplied by 1.5 and the accuracy of its physical attacks is multiplied by 0.8.",
		shortDesc: "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.",
		// This should be applied directly to the stat as opposed to chaining witht he others
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.modify(atk, 1.5);
		},
		onModifyMove: function (move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number') {
				move.accuracy *= 0.8;
			}
		},
		id: "hustle",
		name: "Hustle",
		rating: 3,
		num: 55
	},
	"hydration": {
		desc: "This Pokemon has its major status condition cured at the end of each turn if Rain Dance is active.",
		shortDesc: "This Pokemon has its status cured at the end of each turn if Rain Dance is active.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.status && this.isWeather(['raindance', 'primordialsea'])) {
				this.debug('hydration');
				pokemon.cureStatus();
			}
		},
		id: "hydration",
		name: "Hydration",
		rating: 2,
		num: 93
	},
	"hypercutter": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Attack stat stage.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				boost['atk'] = 0;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
			}
		},
		id: "hypercutter",
		name: "Hyper Cutter",
		rating: 1.5,
		num: 52
	},
	"icebody": {
		desc: "If Hail is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Hail.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp / 16);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		id: "icebody",
		name: "Ice Body",
		rating: 1.5,
		num: 115
	},
	"illuminate": {
		shortDesc: "No competitive use.",
		id: "illuminate",
		name: "Illuminate",
		rating: 0,
		num: 35
	},
	"illusion": {
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage.",
		onBeforeSwitchIn: function (pokemon) {
			pokemon.illusion = null;
			var i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				if (!pokemon.side.pokemon[i].fainted) break;
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			pokemon.illusion = pokemon.side.pokemon[i];
		},
		// illusion clearing is hardcoded in the damage function
		id: "illusion",
		name: "Illusion",
		rating: 4.5,
		num: 149
	},
	"immunity": {
		shortDesc: "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				pokemon.cureStatus();
			}
		},
		onImmunity: function (type) {
			if (type === 'psn') return false;
		},
		id: "immunity",
		name: "Immunity",
		rating: 2,
		num: 17
	},
	"imposter": {
		desc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it. If there is no Pokemon at that position, this Pokemon does not Transform.",
		shortDesc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it.",
		onStart: function (pokemon) {
			var target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				pokemon.transformInto(target, pokemon, this.getAbility('imposter'));
			}
		},
		id: "imposter",
		name: "Imposter",
		rating: 4.5,
		num: 150
	},
	"infiltrator": {
		desc: "This Pokemon's moves ignore substitutes and the opposing side's Reflect, Light Screen, Safeguard, and Mist.",
		shortDesc: "Moves ignore substitutes and opposing Reflect, Light Screen, Safeguard, and Mist.",
		onModifyMove: function (move) {
			move.infiltrates = true;
		},
		id: "infiltrator",
		name: "Infiltrator",
		rating: 3,
		num: 151
	},
	"innerfocus": {
		shortDesc: "This Pokemon cannot be made to flinch.",
		onFlinch: false,
		id: "innerfocus",
		name: "Inner Focus",
		rating: 1.5,
		num: 39
	},
	"insomnia": {
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.cureStatus();
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'slp') return false;
		},
		id: "insomnia",
		name: "Insomnia",
		rating: 2,
		num: 15
	},
	"intimidate": {
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.",
		onStart: function (pokemon) {
			var foeactive = pokemon.side.foe.active;
			var activated = false;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-activate', foeactive[i], 'Substitute', 'ability: Intimidate', '[of] ' + pokemon);
				} else {
					this.boost({atk: -1}, foeactive[i], pokemon);
				}
			}
		},
		id: "intimidate",
		name: "Intimidate",
		rating: 3.5,
		num: 22
	},
	"ironbarbs": {
		desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
		id: "ironbarbs",
		name: "Iron Barbs",
		rating: 3,
		num: 160
	},
	"ironfist": {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2.",
		shortDesc: "This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify(1.2);
			}
		},
		id: "ironfist",
		name: "Iron Fist",
		rating: 3,
		num: 89
	},
	"justified": {
		shortDesc: "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark-type move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.type === 'Dark') {
				this.boost({atk:1});
			}
		},
		id: "justified",
		name: "Justified",
		rating: 2,
		num: 154
	},
	"keeneye": {
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage.",
		shortDesc: "This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0) {
				boost['accuracy'] = 0;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", "[of] " + target);
			}
		},
		onModifyMove: function (move) {
			move.ignoreEvasion = true;
		},
		id: "keeneye",
		name: "Keen Eye",
		rating: 1,
		num: 51
	},
	"klutz": {
		desc: "This Pokemon's held item has no effect. This Pokemon cannot use Fling successfully. Macho Brace, Power Anklet, Power Band, Power Belt, Power Bracer, Power Lens, and Power Weight still have their effects.",
		shortDesc: "This Pokemon's held item has no effect, except Macho Brace. Fling cannot be used.",
		// Item suppression implemented in BattlePokemon.ignoringItem() within battle-engine.js
		id: "klutz",
		name: "Klutz",
		rating: -1,
		num: 103
	},
	"leafguard": {
		desc: "If Sunny Day is active, this Pokemon cannot gain a major status condition and Rest will fail for it.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.",
		onSetStatus: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return false;
			}
		},
		onTryHit: function (target, source, move) {
			if (move && move.id === 'yawn' && this.isWeather(['sunnyday', 'desolateland'])) {
				return false;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 1,
		num: 102
	},
	"levitate": {
		desc: "This Pokemon is immune to Ground. Gravity, Ingrain, Smack Down, Thousand Arrows, and Iron Ball nullify the immunity.",
		shortDesc: "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it.",
		onImmunity: function (type) {
			if (type === 'Ground') return false;
		},
		id: "levitate",
		name: "Levitate",
		rating: 3.5,
		num: 26
	},
	"lightmetal": {
		shortDesc: "This Pokemon's weight is halved.",
		onModifyWeight: function (weight) {
			return weight / 2;
		},
		id: "lightmetal",
		name: "Light Metal",
		rating: 1,
		num: 135
	},
	"lightningrod": {
		desc: "This Pokemon is immune to Electric-type moves and raises its Special Attack by 1 stage when hit by an Electric-type move. If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Electric moves to itself to raise Sp. Atk by 1; Electric immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spa:1})) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		onAnyRedirectTargetPriority: 1,
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Electric' || move.id in {firepledge:1, grasspledge:1, waterpledge:1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				return this.effectData.target;
			}
		},
		id: "lightningrod",
		name: "Lightning Rod",
		rating: 3.5,
		num: 32
	},
	"limber": {
		shortDesc: "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'par') {
				pokemon.cureStatus();
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'par') return false;
		},
		id: "limber",
		name: "Limber",
		rating: 1.5,
		num: 7
	},
	"liquidooze": {
		shortDesc: "This Pokemon damages those draining HP from it for as much as they would heal.",
		id: "liquidooze",
		onSourceTryHeal: function (damage, target, source, effect) {
			this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
			var canOoze = {drain: 1, leechseed: 1};
			if (canOoze[effect.id]) {
				this.damage(damage, null, null, null, true);
				return 0;
			}
		},
		name: "Liquid Ooze",
		rating: 1.5,
		num: 64
	},
	"magicbounce": {
		desc: "This Pokemon blocks certain status moves and instead uses the move against the original user.",
		shortDesc: "This Pokemon blocks certain status moves and bounces them back to the user.",
		id: "magicbounce",
		name: "Magic Bounce",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			var newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			var newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			return null;
		},
		effect: {
			duration: 1
		},
		rating: 4.5,
		num: 156
	},
	"magicguard": {
		desc: "This Pokemon can only be damaged by direct attacks. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage.",
		shortDesc: "This Pokemon can only be damaged by direct attacks.",
		onDamage: function (damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		id: "magicguard",
		name: "Magic Guard",
		rating: 4.5,
		num: 98
	},
	"magician": {
		desc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack. Does not affect Doom Desire and Future Sight.",
		shortDesc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack.",
		onSourceHit: function (target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status') {
				if (source.item) return;
				var yourItem = target.takeItem(source);
				if (!yourItem) return;
				if (!source.setItem(yourItem)) {
					target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
					return;
				}
				this.add('-item', source, yourItem, '[from] ability: Magician', '[of] ' + target);
			}
		},
		id: "magician",
		name: "Magician",
		rating: 1.5,
		num: 170
	},
	"magmaarmor": {
		shortDesc: "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'frz') {
				pokemon.cureStatus();
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'frz') return false;
		},
		id: "magmaarmor",
		name: "Magma Armor",
		rating: 0.5,
		num: 40
	},
	"magnetpull": {
		desc: "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent Steel-type foes from choosing to switch.",
		onFoeModifyPokemon: function (pokemon) {
			if (pokemon.hasType('Steel') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if (pokemon.hasType('Steel') && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "magnetpull",
		name: "Magnet Pull",
		rating: 4.5,
		num: 42
	},
	"marvelscale": {
		desc: "If this Pokemon has a major status condition, its Defense is multiplied by 1.5.",
		shortDesc: "If this Pokemon is statused, its Defense is 1.5x.",
		onModifyDefPriority: 6,
		onModifyDef: function (def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "marvelscale",
		name: "Marvel Scale",
		rating: 2.5,
		num: 63
	},
	"megalauncher": {
		desc: "This Pokemon's pulse moves have their power multiplied by 1.5. Heal Pulse restores 3/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse moves have 1.5x power. Heal Pulse heals 3/4 target's max HP.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(1.5);
			}
		},
		id: "megalauncher",
		name: "Mega Launcher",
		rating: 3.5,
		num: 178
	},
	"minus": {
		desc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			var allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (var i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "minus",
		name: "Minus",
		rating: 0,
		num: 58
	},
	"moldbreaker": {
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		stopAttackEvents: true,
		id: "moldbreaker",
		name: "Mold Breaker",
		rating: 3.5,
		num: 104
	},
	"moody": {
		desc: "This Pokemon has a random stat raised by 2 stages and another stat lowered by 1 stage at the end of each turn.",
		shortDesc: "Raises a random stat by 2 and lowers another stat by 1 at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			var stats = [], i = '';
			var boost = {};
			for (var i in pokemon.boosts) {
				if (pokemon.boosts[i] < 6) {
					stats.push(i);
				}
			}
			if (stats.length) {
				i = stats[this.random(stats.length)];
				boost[i] = 2;
			}
			stats = [];
			for (var j in pokemon.boosts) {
				if (pokemon.boosts[j] > -6 && j !== i) {
					stats.push(j);
				}
			}
			if (stats.length) {
				i = stats[this.random(stats.length)];
				boost[i] = -1;
			}
			this.boost(boost);
		},
		id: "moody",
		name: "Moody",
		rating: 5,
		num: 141
	},
	"motordrive": {
		desc: "This Pokemon is immune to Electric-type moves and raises its Speed by 1 stage when hit by an Electric-type move.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by an Electric move; Electric immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spe:1})) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		id: "motordrive",
		name: "Motor Drive",
		rating: 3,
		num: 78
	},
	"moxie": {
		desc: "This Pokemon's Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 1 stage if it attacks and KOes another Pokemon.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk:1}, source);
			}
		},
		id: "moxie",
		name: "Moxie",
		rating: 3.5,
		num: 153
	},
	"multiscale": {
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		id: "multiscale",
		name: "Multiscale",
		rating: 4,
		num: 136
	},
	"multitype": {
		shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate.",
		// Multitype's type-changing itself is implemented in statuses.js
		id: "multitype",
		name: "Multitype",
		rating: 4,
		num: 121
	},
	"mummy": {
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect the Abilities Multitype or Stance Change.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		id: "mummy",
		name: "Mummy",
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				var oldAbility = source.setAbility('mummy', source, 'mummy', true);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', oldAbility, '[of] ' + source);
				}
			}
		},
		rating: 2,
		num: 152
	},
	"naturalcure": {
		shortDesc: "This Pokemon has its major status condition cured when it switches out.",
		onSwitchOut: function (pokemon) {
			pokemon.setStatus('');
		},
		id: "naturalcure",
		name: "Natural Cure",
		rating: 3.5,
		num: 30
	},
	"noguard": {
		shortDesc: "Every move used by or against this Pokemon will always hit.",
		onAnyAccuracy: function (accuracy, target, source, move) {
			if (move && (source === this.effectData.target || target === this.effectData.target)) {
				return true;
			}
			return accuracy;
		},
		id: "noguard",
		name: "No Guard",
		rating: 4,
		num: 99
	},
	"normalize": {
		desc: "This Pokemon's moves are changed to be Normal type. This effect comes before other effects that change a move's type.",
		shortDesc: "This Pokemon's moves are changed to be Normal type.",
		onModifyMovePriority: 1,
		onModifyMove: function (move) {
			if (move.id !== 'struggle') {
				move.type = 'Normal';
			}
		},
		id: "normalize",
		name: "Normalize",
		rating: -1,
		num: 96
	},
	"oblivious": {
		desc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability while affected cures it.",
		shortDesc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'attract') {
				this.add('-immune', pokemon, '[from] Oblivious');
				return false;
			}
		},
		onTryHit: function (pokemon, target, move) {
			if (move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[msg]', '[from] Oblivious');
				return null;
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 1,
		num: 12
	},
	"overcoat": {
		shortDesc: "This Pokemon is immune to powder moves and damage from Sandstorm or Hail.",
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 2.5,
		num: 142
	},
	"overgrow": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, its attacking stat is multiplied by 1.5 while using a Grass-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Grass attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		id: "overgrow",
		name: "Overgrow",
		rating: 2,
		num: 65
	},
	"owntempo": {
		shortDesc: "This Pokemon cannot be confused. Gaining this Ability while confused cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['confusion']) {
				pokemon.removeVolatile('confusion');
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'confusion') {
				this.add('-immune', pokemon, 'confusion');
				return false;
			}
		},
		id: "owntempo",
		name: "Own Tempo",
		rating: 1,
		num: 20
	},
	"parentalbond": {
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage halved. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved.",
		onPrepareHit: function (source, target, move) {
			if (move.id in {iceball: 1, rollout: 1}) return;
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit) {
				move.multihit = 2;
				source.addVolatile('parentalbond');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower) {
				if (this.effectData.hit) {
					return this.chainModify(0.5);
				} else {
					this.effectData.hit = true;
				}
			}
		},
		id: "parentalbond",
		name: "Parental Bond",
		rating: 5,
		num: 184
	},
	"pickup": {
		shortDesc: "If this Pokemon has no item, it finds one used by an adjacent Pokemon this turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.item) return;
			var pickupTargets = [];
			var target;
			for (var i = 0; i < pokemon.side.active.length; i++) {
				target = pokemon.side.active[i];
				if (target.lastItem && target.usedItemThisTurn && this.isAdjacent(pokemon, target)) {
					pickupTargets.push(target);
				}
			}
			for (var i = 0; i < pokemon.side.foe.active.length; i++) {
				target = pokemon.side.foe.active[i];
				if (target.lastItem && target.usedItemThisTurn && this.isAdjacent(pokemon, target)) {
					pickupTargets.push(target);
				}
			}
			if (!pickupTargets.length) return;
			target = pickupTargets[this.random(pickupTargets.length)];
			pokemon.setItem(target.lastItem);
			target.lastItem = '';
			var item = pokemon.getItem();
			this.add('-item', pokemon, item, '[from] Pickup');
			if (item.isBerry) pokemon.update();
		},
		id: "pickup",
		name: "Pickup",
		rating: 0.5,
		num: 53
	},
	"pickpocket": {
		desc: "If this Pokemon has no item, it steals the item off a Pokemon that makes contact with it. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "If this Pokemon has no item, it steals the item off a Pokemon making contact with it.",
		onAfterMoveSecondary: function (target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				if (target.item) {
					return;
				}
				var yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-item', target, yourItem, '[from] ability: Pickpocket', '[of] ' + source);
			}
		},
		id: "pickpocket",
		name: "Pickpocket",
		rating: 1,
		num: 124
	},
	"pixilate": {
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Fairy';
				if (move.category !== 'Status') pokemon.addVolatile('pixilate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "pixilate",
		name: "Pixilate",
		rating: 4,
		num: 182
	},
	"plus": {
		desc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			var allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (var i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "plus",
		name: "Plus",
		rating: 0,
		num: 57
	},
	"poisonheal": {
		desc: "If this Pokemon is poisoned, it restores 1/8 of its maximum HP, rounded down, at the end of each turn instead of losing HP.",
		shortDesc: "This Pokemon is healed by 1/8 of its max HP each turn when poisoned; no HP loss.",
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.maxhp / 8);
				return false;
			}
		},
		id: "poisonheal",
		name: "Poison Heal",
		rating: 4,
		num: 90
	},
	"poisonpoint": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be poisoned.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('psn', target, move);
				}
			}
		},
		id: "poisonpoint",
		name: "Poison Point",
		rating: 2,
		num: 38
	},
	"poisontouch": {
		shortDesc: "This Pokemon's contact moves have a 30% chance of poisoning.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function (move) {
			if (!move || !move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'psn'
			});
		},
		id: "poisontouch",
		name: "Poison Touch",
		rating: 2,
		num: 143
	},
	"prankster": {
		shortDesc: "This Pokemon's non-damaging moves have their priority increased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
		id: "prankster",
		name: "Prankster",
		rating: 4.5,
		num: 158
	},
	"pressure": {
		desc: "If this Pokemon is the target of an opposing Pokemon's move, that move loses one additional PP.",
		shortDesc: "If this Pokemon is the target of a foe's move, that move loses one additional PP.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP: function (target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		id: "pressure",
		name: "Pressure",
		rating: 1.5,
		num: 46
	},
	"primordialsea": {
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Desolate Land.",
		shortDesc: "On switch-in, heavy rain begins until this Ability is not active in battle.",
		onStart: function (source) {
			this.setWeather('primordialsea');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'primordialsea' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1})) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					var target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('primordialsea')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "primordialsea",
		name: "Primordial Sea",
		rating: 5,
		num: 189
	},
	"protean": {
		desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type.",
		shortDesc: "This Pokemon's type changes to match the type of the move it is about to use.",
		onPrepareHit: function (source, target, move) {
			var type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] Protean');
			}
		},
		id: "protean",
		name: "Protean",
		rating: 4,
		num: 168
	},
	"purepower": {
		shortDesc: "This Pokemon's Attack is doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.chainModify(2);
		},
		id: "purepower",
		name: "Pure Power",
		rating: 5,
		num: 74
	},
	"quickfeet": {
		desc: "If this Pokemon has a major status condition, its Speed is multiplied by 1.5; the Speed drop from paralysis is ignored.",
		shortDesc: "If this Pokemon is statused, its Speed is 1.5x; ignores Speed drop from paralysis.",
		onModifySpe: function (spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "quickfeet",
		name: "Quick Feet",
		rating: 2.5,
		num: 95
	},
	"raindish": {
		desc: "If Rain Dance is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Rain Dance is active, this Pokemon heals 1/16 of its max HP each turn.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 16);
			}
		},
		id: "raindish",
		name: "Rain Dish",
		rating: 1.5,
		num: 44
	},
	"rattled": {
		desc: "This Pokemon's Speed is raised by 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({spe:1});
			}
		},
		id: "rattled",
		name: "Rattled",
		rating: 1.5,
		num: 155
	},
	"reckless": {
		desc: "This Pokemon's attacks with recoil or crash damage have their power multiplied by 1.2. Does not affect Struggle.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage have 1.2x power; not Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return this.chainModify(1.2);
			}
		},
		id: "reckless",
		name: "Reckless",
		rating: 3,
		num: 120
	},
	"refrigerate": {
		desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift') {
				move.type = 'Ice';
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "refrigerate",
		name: "Refrigerate",
		rating: 4,
		num: 174
	},
	"regenerator": {
		shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.",
		onSwitchOut: function (pokemon) {
			pokemon.heal(pokemon.maxhp / 3);
		},
		id: "regenerator",
		name: "Regenerator",
		rating: 4,
		num: 144
	},
	"rivalry": {
		desc: "This Pokemon's attacks have their power multiplied by 1.25 against targets of the same gender or multiplied by 0.75 against targets of the opposite gender. There is no modifier if either this Pokemon or the target is genderless.",
		shortDesc: "This Pokemon's attacks do 1.25x on same gender targets; 0.75x on opposite gender.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.25);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.75);
				}
			}
		},
		id: "rivalry",
		name: "Rivalry",
		rating: 0.5,
		num: 79
	},
	"rockhead": {
		desc: "This Pokemon does not take recoil damage besides Struggle, Life Orb, and crash damage.",
		shortDesc: "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage.",
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
		id: "rockhead",
		name: "Rock Head",
		rating: 3,
		num: 69
	},
	"roughskin": {
		desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
		id: "roughskin",
		name: "Rough Skin",
		rating: 3,
		num: 24
	},
	"runaway": {
		shortDesc: "No competitive use.",
		id: "runaway",
		name: "Run Away",
		rating: 0,
		num: 50
	},
	"sandforce": {
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 1.3x in Sandstorm; immunity to it.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]); // The Sand Force modifier is slightly higher than the normal 1.3 (0x14CC)
				}
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandforce",
		name: "Sand Force",
		rating: 2,
		num: 159
	},
	"sandrush": {
		desc: "If Sandstorm is active, this Pokemon's Speed is doubled. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is doubled; immunity to Sandstorm.",
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather('sandstorm')) {
				return this.chainModify(2);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandrush",
		name: "Sand Rush",
		rating: 2.5,
		num: 146
	},
	"sandstream": {
		shortDesc: "On switch-in, this Pokemon summons Sandstorm.",
		onStart: function (source) {
			this.setWeather('sandstorm');
		},
		id: "sandstream",
		name: "Sand Stream",
		rating: 4.5,
		num: 45
	},
	"sandveil": {
		desc: "If Sandstorm is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's evasiveness is 1.25x; immunity to Sandstorm.",
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		id: "sandveil",
		name: "Sand Veil",
		rating: 1.5,
		num: 8
	},
	"sapsipper": {
		desc: "This Pokemon is immune to Grass-type moves and raises its Attack by 1 stage when hit by a Grass-type move.",
		shortDesc: "This Pokemon's Attack is raised 1 stage if hit by a Grass move; Grass immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({atk:1})) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass') {
				this.boost({atk:1}, this.effectData.target);
			}
		},
		id: "sapsipper",
		name: "Sap Sipper",
		rating: 3.5,
		num: 157
	},
	"scrappy": {
		shortDesc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
		onModifyMovePriority: -5,
		onModifyMove: function (move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113
	},
	"serenegrace": {
		shortDesc: "This Pokemon's moves have their secondary effect chance doubled.",
		onModifyMovePriority: -2,
		onModifyMove: function (move) {
			if (move.secondaries && move.id !== 'secretpower') {
				this.debug('doubling secondary chance');
				for (var i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
		id: "serenegrace",
		name: "Serene Grace",
		rating: 4,
		num: 32
	},
	"shadowtag": {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or also have this Ability.",
		shortDesc: "Prevents adjacent foes from choosing to switch unless they also have this Ability.",
		onFoeModifyPokemon: function (pokemon) {
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "shadowtag",
		name: "Shadow Tag",
		rating: 5,
		num: 23
	},
	"shedskin": {
		desc: "This Pokemon has a 33% chance to have its major status condition cured at the end of each turn.",
		shortDesc: "This Pokemon has a 33% chance to have its status cured at the end of each turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.hp && pokemon.status && this.random(3) === 0) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
		id: "shedskin",
		name: "Shed Skin",
		rating: 3.5,
		num: 61
	},
	"sheerforce": {
		desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed.",
		shortDesc: "This Pokemon's attacks with secondary effects have 1.3x power; nullifies the effects.",
		onModifyMove: function (move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				pokemon.addVolatile('sheerforce');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]); // The Sheer Force modifier is slightly higher than the normal 1.3 (0x14CC)
			}
		},
		id: "sheerforce",
		name: "Sheer Force",
		rating: 4,
		num: 125
	},
	"shellarmor": {
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
		onCriticalHit: false,
		id: "shellarmor",
		name: "Shell Armor",
		rating: 1,
		num: 75
	},
	"shielddust": {
		shortDesc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack.",
		onModifySecondaries: function (secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(function (effect) {
				return !!effect.self;
			});
		},
		id: "shielddust",
		name: "Shield Dust",
		rating: 2.5,
		num: 19
	},
	"simple": {
		shortDesc: "If this Pokemon's stat stages are raised or lowered, the effect is doubled instead.",
		onBoost: function (boost) {
			for (var i in boost) {
				boost[i] *= 2;
			}
		},
		id: "simple",
		name: "Simple",
		rating: 4,
		num: 86
	},
	"skilllink": {
		shortDesc: "This Pokemon's multi-hit attacks always hit the maximum number of times.",
		onModifyMove: function (move) {
			if (move.multihit && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
		},
		id: "skilllink",
		name: "Skill Link",
		rating: 4,
		num: 92
	},
	"slowstart": {
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.",
		onStart: function (pokemon) {
			pokemon.addVolatile('slowstart');
		},
		onEnd: function (pokemon) {
			delete pokemon.volatiles['slowstart'];
			this.add('-end', pokemon, 'Slow Start', '[silent]');
		},
		effect: {
			duration: 5,
			onStart: function (target) {
				this.add('-start', target, 'Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe: function (spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd: function (target) {
				this.add('-end', target, 'Slow Start');
			}
		},
		id: "slowstart",
		name: "Slow Start",
		rating: -2,
		num: 112
	},
	"sniper": {
		shortDesc: "If this Pokemon strikes with a critical hit, the damage is multiplied by 1.5.",
		onModifyDamage: function (damage, source, target, move) {
			if (move.crit) {
				this.debug('Sniper boost');
				return this.chainModify(1.5);
			}
		},
		id: "sniper",
		name: "Sniper",
		rating: 1,
		num: 97
	},
	"snowcloak": {
		desc: "If Hail is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon's evasiveness is 1.25x; immunity to Hail.",
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('hail')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 1.5,
		num: 81
	},
	"snowwarning": {
		shortDesc: "On switch-in, this Pokemon summons Hail.",
		onStart: function (source) {
			this.setWeather('hail');
		},
		id: "snowwarning",
		name: "Snow Warning",
		rating: 4,
		num: 117
	},
	"solarpower": {
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x; loses 1/8 max HP per turn.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.maxhp / 8);
			}
		},
		id: "solarpower",
		name: "Solar Power",
		rating: 1.5,
		num: 94
	},
	"solidrock": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.75);
			}
		},
		id: "solidrock",
		name: "Solid Rock",
		rating: 3,
		num: 116
	},
	"soundproof": {
		shortDesc: "This Pokemon is immune to sound-based moves, including Heal Bell.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.flags['sound']) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		id: "soundproof",
		name: "Soundproof",
		rating: 2,
		num: 43
	},
	"speedboost": {
		desc: "This Pokemon's Speed is raised by 1 stage at the end of each full turn it has been on the field.",
		shortDesc: "This Pokemon's Speed is raised 1 stage at the end of each full turn on the field.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe:1});
			}
		},
		id: "speedboost",
		name: "Speed Boost",
		rating: 4.5,
		num: 3
	},
	"stall": {
		shortDesc: "This Pokemon moves last among Pokemon using the same or greater priority moves.",
		onModifyPriority: function (priority) {
			return priority - 0.1;
		},
		id: "stall",
		name: "Stall",
		rating: -1,
		num: 100
	},
	"stancechange": {
		desc: "If this Pokemon is an Aegislash, it changes to Blade Forme before attempting to use an attacking move, and changes to Shield Forme before attempting to use King's Shield.",
		shortDesc: "If Aegislash, changes Forme to Blade before attacks and Shield before King's Shield.",
		onBeforeMovePriority: 11,
		onBeforeMove: function (attacker, defender, move) {
			if (attacker.template.baseSpecies !== 'Aegislash') return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			var targetSpecies = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.template.species !== targetSpecies && attacker.formeChange(targetSpecies)) {
				this.add('-formechange', attacker, targetSpecies);
			}
		},
		id: "stancechange",
		name: "Stance Change",
		rating: 5,
		num: 176
	},
	"static": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be paralyzed.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('par', target, effect);
				}
			}
		},
		id: "static",
		name: "Static",
		rating: 2,
		num: 9
	},
	"steadfast": {
		shortDesc: "If this Pokemon flinches, its Speed is raised by 1 stage.",
		onFlinch: function (pokemon) {
			this.boost({spe: 1});
		},
		id: "steadfast",
		name: "Steadfast",
		rating: 1,
		num: 80
	},
	"stench": {
		shortDesc: "This Pokemon's attacks without a chance to flinch have a 10% chance to flinch.",
		onModifyMove: function (move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (var i = 0; i < move.secondaries.length; i++) {
					if (move.secondaries[i].volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch'
				});
			}
		},
		id: "stench",
		name: "Stench",
		rating: 0.5,
		num: 1
	},
	"stickyhold": {
		shortDesc: "This Pokemon cannot lose its held item due to another Pokemon's attack.",
		onTakeItem: function (item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon) return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		id: "stickyhold",
		name: "Sticky Hold",
		rating: 1.5,
		num: 60
	},
	"stormdrain": {
		desc: "This Pokemon is immune to Water-type moves and raises its Special Attack by 1 stage when hit by a Water-type move. If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Water moves to itself to raise Sp. Atk by 1; Water immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa:1})) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		onAnyRedirectTargetPriority: 1,
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Water' || move.id in {firepledge:1, grasspledge:1, waterpledge:1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				move.accuracy = true;
				return this.effectData.target;
			}
		},
		id: "stormdrain",
		name: "Storm Drain",
		rating: 3.5,
		num: 114
	},
	"strongjaw": {
		desc: "This Pokemon's bite-based attacks have their power multiplied by 1.5.",
		shortDesc: "This Pokemon's bite-based attacks have 1.5x power. Bug Bite is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				return this.chainModify(1.5);
			}
		},
		id: "strongjaw",
		name: "Strong Jaw",
		rating: 3,
		num: 173
	},
	"sturdy": {
		desc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. OHKO moves fail when used against this Pokemon.",
		shortDesc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. Immune to OHKO.",
		onTryHit: function (pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function (damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		id: "sturdy",
		name: "Sturdy",
		rating: 3,
		num: 5
	},
	"suctioncups": {
		shortDesc: "This Pokemon cannot be forced to switch out by another Pokemon's attack or item.",
		onDragOutPriority: 1,
		onDragOut: function (pokemon) {
			this.add('-activate', pokemon, 'ability: Suction Cups');
			return null;
		},
		id: "suctioncups",
		name: "Suction Cups",
		rating: 2,
		num: 21
	},
	"superluck": {
		shortDesc: "This Pokemon's critical hit ratio is raised by 1 stage.",
		onModifyMove: function (move) {
			move.critRatio++;
		},
		id: "superluck",
		name: "Super Luck",
		rating: 1.5,
		num: 105
	},
	"swarm": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Bug-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Bug attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		id: "swarm",
		name: "Swarm",
		rating: 2,
		num: 68
	},
	"sweetveil": {
		shortDesc: "This Pokemon and its allies cannot fall asleep.",
		id: "sweetveil",
		name: "Sweet Veil",
		onAllySetStatus: function (status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				return false;
			}
		},
		onAllyTryHit: function (target, source, move) {
			if (move && move.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				return false;
			}
		},
		rating: 2,
		num: 175
	},
	"swiftswim": {
		shortDesc: "If Rain Dance is active, this Pokemon's Speed is doubled.",
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
		id: "swiftswim",
		name: "Swift Swim",
		rating: 2.5,
		num: 33
	},
	"symbiosis": {
		desc: "If an ally uses its item, this Pokemon gives its item to that ally immediately. Does not activate if the ally's item was stolen or knocked off.",
		shortDesc: "If an ally uses its item, this Pokemon gives its item to that ally immediately.",
		onAllyAfterUseItem: function (item, pokemon) {
			var sourceItem = this.effectData.target.getItem();
			var noSharing = sourceItem.onTakeItem && sourceItem.onTakeItem(sourceItem, pokemon) === false;
			if (!sourceItem || noSharing) {
				return;
			}
			sourceItem = this.effectData.target.takeItem();
			if (!sourceItem) {
				return;
			}
			if (pokemon.setItem(sourceItem)) {
				this.add('-activate', pokemon, 'ability: Symbiosis', sourceItem, '[of] ' + this.effectData.target);
			}
		},
		id: "symbiosis",
		name: "Symbiosis",
		rating: 0,
		num: 180
	},
	"synchronize": {
		desc: "If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon, that Pokemon receives the same major status condition.",
		shortDesc: "If another Pokemon burns/poisons/paralyzes this Pokemon, it also gets that status.",
		onAfterSetStatus: function (status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz') return;
			source.trySetStatus(status, target);
		},
		id: "synchronize",
		name: "Synchronize",
		rating: 2.5,
		num: 28
	},
	"tangledfeet": {
		shortDesc: "This Pokemon's evasiveness is doubled as long as it is confused.",
		onModifyAccuracy: function (accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target && target.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return accuracy * 0.5;
			}
		},
		id: "tangledfeet",
		name: "Tangled Feet",
		rating: 1,
		num: 77
	},
	"technician": {
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 1.5. Does affect Struggle.",
		shortDesc: "This Pokemon's moves of 60 power or less have 1.5x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		id: "technician",
		name: "Technician",
		rating: 4,
		num: 101
	},
	"telepathy": {
		shortDesc: "This Pokemon does not take damage from attacks made by its allies.",
		onTryHit: function (target, source, move) {
			if (target !== source && target.side === source.side && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Telepathy');
				return null;
			}
		},
		id: "telepathy",
		name: "Telepathy",
		rating: 0,
		num: 140
	},
	"teravolt": {
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		stopAttackEvents: true,
		id: "teravolt",
		name: "Teravolt",
		rating: 3.5,
		num: 164
	},
	"thickfat": {
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Ice-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		id: "thickfat",
		name: "Thick Fat",
		rating: 3.5,
		num: 47
	},
	"tintedlens": {
		shortDesc: "This Pokemon's attacks that are not very effective on a target deal double damage.",
		onModifyDamage: function (damage, source, target, move) {
			if (move.typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		id: "tintedlens",
		name: "Tinted Lens",
		rating: 3.5,
		num: 110
	},
	"torrent": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Water-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Water attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		id: "torrent",
		name: "Torrent",
		rating: 2,
		num: 67
	},
	"toxicboost": {
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 1.5.",
		shortDesc: "While this Pokemon is poisoned, its physical attacks have 1.5x power.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
				return this.chainModify(1.5);
			}
		},
		id: "toxicboost",
		name: "Toxic Boost",
		rating: 3,
		num: 137
	},
	"toughclaws": {
		shortDesc: "This Pokemon's contact moves have their power multiplied by 1.3.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "toughclaws",
		name: "Tough Claws",
		rating: 3.5,
		num: 181
	},
	"trace": {
		desc: "On switch-in, this Pokemon copies a random adjacent opposing Pokemon's Ability. If there is no Ability that can be copied at that time, this Ability will activate as soon as an Ability can be copied. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, and Zen Mode.",
		shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
		onUpdate: function (pokemon) {
			var possibleTargets = [];
			for (var i = 0; i < pokemon.side.foe.active.length; i++) {
				if (pokemon.side.foe.active[i] && !pokemon.side.foe.active[i].fainted) possibleTargets.push(pokemon.side.foe.active[i]);
			}
			while (possibleTargets.length) {
				var rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				var target = possibleTargets[rand];
				var ability = this.getAbility(target.ability);
				var bannedAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, zenmode:1};
				if (bannedAbilities[target.ability]) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				pokemon.setAbility(ability);
				return;
			}
		},
		id: "trace",
		name: "Trace",
		rating: 3,
		num: 36
	},
	"truant": {
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onBeforeMovePriority: 9,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant', pokemon, 'ability: Truant', move);
				return false;
			}
			pokemon.addVolatile('truant');
		},
		effect: {
			duration: 2
		},
		id: "truant",
		name: "Truant",
		rating: -2,
		num: 54
	},
	"turboblaze": {
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		stopAttackEvents: true,
		id: "turboblaze",
		name: "Turboblaze",
		rating: 3.5,
		num: 163
	},
	"unaware": {
		desc: "This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
		id: "unaware",
		name: "Unaware",
		onAnyModifyBoost: function (boosts, target) {
			var source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		rating: 3,
		num: 109
	},
	"unburden": {
		desc: "If this Pokemon loses its held item for any reason, its Speed is doubled. This boost is lost if it switches out or gains a new item or Ability.",
		shortDesc: "Speed is doubled on held item loss; boost is lost if it switches, gets new item/Ability.",
		onAfterUseItem: function (item, pokemon) {
			if (pokemon !== this.effectData.target) return;
			pokemon.addVolatile('unburden');
		},
		onTakeItem: function (item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		onEnd: function (pokemon) {
			pokemon.removeVolatile('unburden');
		},
		effect: {
			onModifySpe: function (spe, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(2);
				}
			}
		},
		id: "unburden",
		name: "Unburden",
		rating: 3.5,
		num: 84
	},
	"unnerve": {
		shortDesc: "While this Pokemon is active, it prevents opposing Pokemon from using their Berries.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Unnerve', pokemon.side.foe);
		},
		onFoeEatItem: false,
		id: "unnerve",
		name: "Unnerve",
		rating: 1.5,
		num: 127
	},
	"victorystar": {
		shortDesc: "This Pokemon and its allies' moves have their accuracy multiplied by 1.1.",
		onAllyModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.1;
			}
		},
		id: "victorystar",
		name: "Victory Star",
		rating: 2.5,
		num: 162
	},
	"vitalspirit": {
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.cureStatus();
			}
		},
		onImmunity: function (type) {
			if (type === 'slp') return false;
		},
		id: "vitalspirit",
		name: "Vital Spirit",
		rating: 2,
		num: 72
	},
	"voltabsorb": {
		desc: "This Pokemon is immune to Electric-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Electric-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Electric moves; Electric immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		id: "voltabsorb",
		name: "Volt Absorb",
		rating: 3.5,
		num: 10
	},
	"waterabsorb": {
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		id: "waterabsorb",
		name: "Water Absorb",
		rating: 3.5,
		num: 11
	},
	"waterveil": {
		shortDesc: "This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'brn') {
				pokemon.cureStatus();
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'brn') return false;
		},
		id: "waterveil",
		name: "Water Veil",
		rating: 2,
		num: 41
	},
	"weakarmor": {
		desc: "If a physical attack hits this Pokemon, its Defense is lowered by 1 stage and its Speed is raised by 1 stage.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 1.",
		onAfterDamage: function (damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({def:-1, spe:1});
			}
		},
		id: "weakarmor",
		name: "Weak Armor",
		rating: 0.5,
		num: 133
	},
	"whitesmoke": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			var showMsg = false;
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: White Smoke", "[of] " + target);
		},
		id: "whitesmoke",
		name: "White Smoke",
		rating: 2,
		num: 73
	},
	"wonderguard": {
		shortDesc: "This Pokemon can only be damaged by supereffective moves and indirect damage.",
		onTryHit: function (target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle' || move.isFutureMove) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-activate', target, 'ability: Wonder Guard');
				return null;
			}
		},
		id: "wonderguard",
		name: "Wonder Guard",
		rating: 5,
		num: 25
	},
	"wonderskin": {
		desc: "All non-damaging moves that check accuracy have their accuracy changed to 50% when used on this Pokemon. This change is done before any other accuracy modifying effects.",
		shortDesc: "Status moves with accuracy checks are 50% accurate when used on this Pokemon.",
		onModifyAccuracyPriority: 10,
		onModifyAccuracy: function (accuracy, target, source, move) {
			if (move.category === 'Status' && typeof move.accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 50;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 2,
		num: 147
	},
	"zenmode": {
		desc: "If this Pokemon is a Darmanitan, it changes to Zen Mode if it has 1/2 or less of its maximum HP at the end of a turn. If Darmanitan's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Standard Mode. If Darmanitan loses this Ability while in Zen Mode it reverts to Standard Mode immediately.",
		shortDesc: "If Darmanitan, at end of turn changes Mode to Standard if > 1/2 max HP, else Zen.",
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.species !== 'Darmanitan') {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitan') {
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitanzen') {
				pokemon.removeVolatile('zenmode');
			}
		},
		onEnd: function (pokemon) {
			if (!pokemon.volatiles['zenmode'] || !pokemon.hp) return;
			pokemon.transformed = false;
			delete pokemon.volatiles['zenmode'];
			if (pokemon.formeChange('Darmanitan')) {
				this.add('-formechange', pokemon, 'Darmanitan', '[silent]');
			}
		},
		effect: {
			onStart: function (pokemon) {
				if (pokemon.formeChange('Darmanitan-Zen')) {
					this.add('-formechange', pokemon, 'Darmanitan-Zen', '[from] ability: Zen Mode');
				} else {
					return false;
				}
			},
			onEnd: function (pokemon) {
				if (pokemon.formeChange('Darmanitan')) {
					this.add('-formechange', pokemon, 'Darmanitan', '[from] ability: Zen Mode');
				} else {
					return false;
				}
			}
		},
		id: "zenmode",
		name: "Zen Mode",
		rating: -1,
		num: 161
	},

	// CAP
	"mountaineer": {
		shortDesc: "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.",
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onImmunity: function (type, target) {
			if (type === 'Rock' && !target.activeTurns) {
				return false;
			}
		},
		id: "mountaineer",
		isNonstandard: true,
		name: "Mountaineer",
		rating: 3.5,
		num: -2
	},
	"rebound": {
		desc: "On switch-in, this Pokemon blocks certain status moves and instead uses the move against the original user.",
		shortDesc: "On switch-in, blocks certain status moves and bounces them back to the user.",
		id: "rebound",
		isNonstandard: true,
		name: "Rebound",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (this.effectData.target.activeTurns) return;

			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			var newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide: function (target, source, move) {
			if (this.effectData.target.activeTurns) return;

			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			var newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			return null;
		},
		effect: {
			duration: 1
		},
		rating: 3.5,
		num: -3
	},
	"persistent": {
		shortDesc: "The duration of certain field effects is increased by 2 turns if used by this Pokemon.",
		id: "persistent",
		isNonstandard: true,
		name: "Persistent",
		// implemented in the corresponding move
		rating: 3.5,
		num: -4
	}
};
