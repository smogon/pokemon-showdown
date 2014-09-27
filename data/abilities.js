/*

Ratings and how they work:

-2: Extremely detrimental
	  The sort of ability that relegates Pokemon with Uber-level BSTs
	  into NU.
	ex. Slow Start, Truant

-1: Detrimental
	  An ability that does more harm than good.
	ex. Defeatist, Normalize

 0: Useless
	  An ability with no net effect on a Pokemon during a battle.
	ex. Pickup, Illuminate

 1: Ineffective
	  An ability that has a minimal effect. Should never be chosen over
	  any other ability.
	ex. Damp, Shell Armor

 2: Situationally useful
	  An ability that can be useful in certain situations.
	ex. Blaze, Insomnia

 3: Useful
	  An ability that is generally useful.
	ex. Volt Absorb, Iron Fist

 4: Very useful
	  One of the most popular abilities. The difference between 3 and 4
	  can be ambiguous.
	ex. Technician, Protean

 5: Essential
	  The sort of ability that defines metagames.
	ex. Drizzle, Shadow Tag

*/

exports.BattleAbilities = {
	"adaptability": {
		desc: "This Pokemon's attacks that receive STAB (Same Type Attack Bonus) are increased from 50% to 100%.",
		shortDesc: "This Pokemon's same-type attack bonus (STAB) is increased from 1.5x to 2x.",
		onModifyMove: function (move) {
			move.stab = 2;
		},
		id: "adaptability",
		name: "Adaptability",
		rating: 3.5,
		num: 91
	},
	"aftermath": {
		desc: "If a contact move knocks out this Pokemon, the opponent receives damage equal to one-fourth of its max HP.",
		shortDesc: "If this Pokemon is KOed with a contact move, that move's user loses 1/4 its max HP.",
		id: "aftermath",
		name: "Aftermath",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.isContact && !target.hp) {
				this.damage(source.maxhp / 4, source, target, null, true);
			}
		},
		rating: 3,
		num: 106
	},
	"aerilate": {
		desc: "Turns all of this Pokemon's Normal-typed attacks into Flying-type and deal 1.3x damage. Does not affect Hidden Power.",
		shortDesc: "This Pokemon's Normal moves become Flying-type and do 1.3x damage.",
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'hiddenpower') {
				move.type = 'Flying';
				pokemon.addVolatile('aerilate');
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
		rating: 3,
		num: 185
	},
	"airlock": {
		desc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		shortDesc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		onStart: function (pokemon) {
			this.add('-message', 'The effects of weather disappeared. (placeholder)');
		},
		onAnyModifyPokemon: function (pokemon) {
			pokemon.ignore['WeatherTarget'] = true;
		},
		onAnyTryWeather: false,
		id: "airlock",
		name: "Air Lock",
		rating: 3,
		num: 76
	},
	"analytic": {
		desc: "This Pokemon's attacks do 1.3x damage if it is the last to move in a turn.",
		shortDesc: "If the user moves last, the power of that move is increased by 30%.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (!this.willMove(defender)) {
				this.debug('Analytic boost');
				return this.chainModify([0x14CD, 0x1000]); // The Analytic modifier is slightly higher than the normal 1.3 (0x14CC)
			}
		},
		id: "analytic",
		name: "Analytic",
		rating: 1,
		num: 148
	},
	"angerpoint": {
		desc: "If this Pokemon, and not its Substitute, is struck by a Critical Hit, its Attack is boosted to six stages.",
		shortDesc: "If this Pokemon is hit by a critical hit, its Attack is boosted by 12.",
		onCriticalHit: function (target) {
			if (!target.volatiles['substitute']) {
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
		desc: "A warning is displayed if an opposing Pokemon has the moves Fissure, Guillotine, Horn Drill, Sheer Cold, or any attacking move from a type that is considered super effective against this Pokemon (including Counter, Mirror Coat, and Metal Burst). Hidden Power, Judgment, Natural Gift and Weather Ball are considered Normal-type moves. Flying Press is considered a Fighting-type move.",
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a super effective or OHKO move.",
		onStart: function (pokemon) {
			var targets = pokemon.side.foe.active;
			for (var i = 0; i < targets.length; i++) {
				if (!targets[i] || targets[i].fainted) continue;
				for (var j = 0; j < targets[i].moveset.length; j++) {
					var move = this.getMove(targets[i].moveset[j].move);
					if (move.category !== 'Status' && (this.getImmunity(move.type, pokemon) && this.getEffectiveness(move.type, pokemon) > 0 || move.ohko)) {
						this.add('-message', pokemon.name + ' shuddered! (placeholder)');
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
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they are part Flying-type, have the Levitate ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn. Flying-type and Levitate Pokemon cannot escape if they are holding Iron Ball or Gravity is in effect. Levitate Pokemon also cannot escape if their ability is disabled through other means, such as Skill Swap or Gastro Acid.",
		shortDesc: "Prevents foes from switching out normally unless they have immunity to Ground.",
		onFoeModifyPokemon: function (pokemon) {
			if (pokemon.runImmunity('Ground', false)) {
				pokemon.tryTrap();
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon) {
			if (pokemon.runImmunity('Ground', false)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "arenatrap",
		name: "Arena Trap",
		rating: 5,
		num: 71
	},
	"aromaveil": {
		desc: "Protects this Pokemon and its allies from Attract, Disable, Encore, Heal Block, Taunt, and Torment.",
		shortDesc: "Protects from Attract, Disable, Encore, Heal Block, Taunt, and Torment.",
		onAllyTryHit: function (target, source, move) {
			if (move && move.id in {attract:1, disable:1, encore:1, healblock:1, taunt:1, torment:1}) {
				return false;
			}
		},
		id: "aromaveil",
		name: "Aroma Veil",
		rating: 3,
		num: 165
	},
	"aurabreak": {
		desc: "Reverses the effect of Dark Aura and Fairy Aura.",
		shortDesc: "Reverses the effect of Aura abilities.",
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
		desc: "If asleep, each of this Pokemon's opponents receives damage equal to one-eighth of its max HP.",
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
		desc: "This Pokemon cannot be struck by a critical hit.",
		shortDesc: "Critical Hits cannot strike this Pokemon.",
		onCriticalHit: false,
		id: "battlearmor",
		name: "Battle Armor",
		rating: 1,
		num: 4
	},
	"bigpecks": {
		desc: "Prevents other Pokemon from lowering this Pokemon's Defense.",
		shortDesc: "Prevents the Pokemon's Defense stat from being reduced.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0) {
				boost['def'] = 0;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
			}
		},
		id: "bigpecks",
		name: "Big Pecks",
		rating: 1,
		num: 145
	},
	"blaze": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Fire-type attacks receive a 50% boost in power.",
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
		desc: "This Pokemon is protected from some Ball and Bomb moves.",
		shortDesc: "This Pokemon is protected from ball and bomb moves.",
		onTryHit: function (pokemon, target, move) {
			if (move.isBullet) {
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
		desc: "Restores HP when this Pokemon consumes a berry.",
		shortDesc: "Restores HP when this Pokemon consumes a berry.",
		onEatItem: function (item, pokemon) {
			this.heal(pokemon.maxhp / 4);
		},
		id: "cheekpouch",
		name: "Cheek Pouch",
		rating: 2,
		num: 167
	},
	"chlorophyll": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its speed is temporarily doubled.",
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
		onModifySpe: function (speMod) {
			if (this.isWeather('sunnyday')) {
				return this.chain(speMod, 2);
			}
		},
		id: "chlorophyll",
		name: "Chlorophyll",
		rating: 2,
		num: 34
	},
	"clearbody": {
		desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions.",
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
		desc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		shortDesc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		onStart: function (pokemon) {
			this.add('-message', 'The effects of weather disappeared. (placeholder)');
		},
		onAnyModifyPokemon: function (pokemon) {
			pokemon.ignore['WeatherTarget'] = true;
		},
		onAnyTryWeather: false,
		id: "cloudnine",
		name: "Cloud Nine",
		rating: 3,
		num: 13
	},
	"colorchange": {
		desc: "This Pokemon's type changes according to the type of the last move that hit this Pokemon.",
		shortDesc: "This Pokemon's type changes to match the type of the last move that hit it.",
		onAfterMoveSecondary: function (target, source, move) {
			if (target.isActive && move && move.effectType === 'Move' && move.category !== 'Status') {
				if (!target.hasType(move.type)) {
					if (!target.setType(move.type)) return false;
					this.add('-start', target, 'typechange', move.type, '[from] Color Change');
					target.update();
				}
			}
		},
		id: "colorchange",
		name: "Color Change",
		rating: 2,
		num: 16
	},
	"competitive": {
		desc: "Raises the user's Special Attack stat by two stages when a stat is lowered, including the Special Attack stat. This does not include self-induced stat drops like those from Close Combat.",
		shortDesc: "This Pokemon's SpAtk is boosted by 2 for each of its stats that is lowered by a foe.",
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
		rating: 2,
		num: 172
	},
	"compoundeyes": {
		desc: "The accuracy of this Pokemon's moves receives a 30% increase; for example, a 75% accurate move becomes 97.5% accurate.",
		shortDesc: "This Pokemon's moves have their accuracy boosted to 1.3x.",
		onSourceAccuracy: function (accuracy) {
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
		desc: "If this Pokemon has a stat boosted it is lowered instead, and vice versa.",
		shortDesc: "Stat changes are inverted.",
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
		desc: "30% chance of disabling one of the opponent's moves when attacked. This works even if the attacker is behind a Substitute, but will not activate if the Pokemon with Cursed Body is behind a Substitute.",
		shortDesc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets Disabled.",
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
		desc: "If an opponent of the opposite gender directly attacks this Pokemon, there is a 30% chance that the opponent will become Attracted to this Pokemon.",
		shortDesc: "30% chance of infatuating Pokemon of the opposite gender if they make contact.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.isContact) {
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
		desc: "While this Pokemon is active, no Pokemon on the field can use Selfdestruct or Explosion.",
		shortDesc: "While this Pokemon is active, Selfdestruct, Explosion, and Aftermath do not work.",
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
		rating: 0.5,
		num: 6
	},
	"darkaura": {
		desc: "Increases the power of all Dark-type moves in battle to 1.33x.",
		shortDesc: "Increases the power of all Dark-type moves in battle to 1.33x.",
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
		desc: "When this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.",
		shortDesc: "Attack and Special Attack are halved when HP is less than half.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.hp < pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, pokemon) {
			if (pokemon.hp < pokemon.maxhp / 2) {
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
		desc: "Raises the user's Attack stat by two stages when a stat is lowered, including the Attack stat. This does not include self-induced stat drops like those from Close Combat.",
		shortDesc: "This Pokemon's Attack is boosted by 2 for each of its stats that is lowered by a foe.",
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
		rating: 2,
		num: 128
	},
	"download": {
		desc: "If this Pokemon switches into an opponent with equal Defenses or higher Defense than Special Defense, this Pokemon's Special Attack receives a 50% boost. If this Pokemon switches into an opponent with higher Special Defense than Defense, this Pokemon's Attack receive a 50% boost.",
		shortDesc: "On switch-in, Attack or Sp. Atk is boosted by 1 based on the foes' weaker Defense.",
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
		desc: "When this Pokemon enters the battlefield, the weather becomes Rain Dance (for 5 turns normally, or 8 turns while holding Damp Rock).",
		shortDesc: "On switch-in, the weather becomes Rain Dance.",
		onStart: function (source) {
			this.setWeather('raindance');
		},
		id: "drizzle",
		name: "Drizzle",
		rating: 5,
		num: 2
	},
	"drought": {
		desc: "When this Pokemon enters the battlefield, the weather becomes Sunny Day (for 5 turns normally, or 8 turns while holding Heat Rock).",
		shortDesc: "On switch-in, the weather becomes Sunny Day.",
		onStart: function (source) {
			this.setWeather('sunnyday');
		},
		id: "drought",
		name: "Drought",
		rating: 5,
		num: 70
	},
	"dryskin": {
		desc: "This Pokemon absorbs Water attacks and gains a weakness to Fire attacks. If Sunny Day is in effect, this Pokemon takes damage. If Rain Dance is in effect, this Pokemon recovers health.",
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
			if (effect.id === 'raindance') {
				this.heal(target.maxhp / 8);
			} else if (effect.id === 'sunnyday') {
				this.damage(target.maxhp / 8);
			}
		},
		id: "dryskin",
		name: "Dry Skin",
		rating: 3.5,
		num: 87
	},
	"earlybird": {
		desc: "This Pokemon will remain asleep for half as long as it normally would; this includes both opponent-induced sleep and user-induced sleep via Rest.",
		shortDesc: "This Pokemon's sleep status lasts half as long as usual, self-induced or not.",
		id: "earlybird",
		name: "Early Bird",
		isHalfSleep: true,
		rating: 2.5,
		num: 48
	},
	"effectspore": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become either poisoned, paralyzed or put to sleep. There is an equal chance to inflict each status.",
		shortDesc: "30% chance of poisoning, paralyzing, or causing sleep on Pokemon making contact.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.isContact && !source.status && source.runImmunity('powder')) {
				var r = this.random(100);
				if (r < 11) source.setStatus('slp', target);
				else if (r < 21) source.setStatus('par', target);
				else if (r < 30) source.setStatus('psn', target);
			}
		},
		id: "effectspore",
		name: "Effect Spore",
		rating: 2,
		num: 27
	},
	"fairyaura": {
		desc: "Increases the power of all Fairy-type moves in battle to 1.33x.",
		shortDesc: "Increases the power of all Fairy-type moves in battle to 1.33x.",
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
		desc: "This Pokemon receives one-fourth reduced damage from Super Effective attacks.",
		shortDesc: "This Pokemon receives 3/4 damage from super effective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (this.getEffectiveness(move, target) > 0) {
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
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become burned.",
		shortDesc: "30% chance of burning a Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.isContact) {
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
		desc: "When the user with this ability is burned, its Special Attack is raised by 50%.",
		shortDesc: "When this Pokemon is burned, its special attacks do 1.5x damage.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(1.5);
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 3,
		num: 138
	},
	"flashfire": {
		desc: "This Pokemon is immune to all Fire-type attacks; additionally, its own Fire-type attacks receive a 50% boost if a Fire-type move hits this Pokemon. Multiple boosts do not occur if this Pokemon is hit with multiple Fire-type attacks.",
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
			}
		},
		id: "flashfire",
		name: "Flash Fire",
		rating: 3,
		num: 18
	},
	"flowergift": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its Attack and Special Defense stats (as well as its partner's stats in double battles) receive a 50% boost.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		onStart: function (pokemon) {
			delete this.effectData.forme;
		},
		onUpdate: function (pokemon) {
			if (!pokemon.isActive || pokemon.speciesid !== 'cherrim') return;
			if (this.isWeather('sunnyday')) {
				if (this.effectData.forme !== 'Sunshine') {
					this.effectData.forme = 'Sunshine';
					this.add('-formechange', pokemon, 'Cherrim-Sunshine');
					this.add('-message', pokemon.name + ' transformed! (placeholder)');
				}
			} else {
				if (this.effectData.forme) {
					delete this.effectData.forme;
					this.add('-formechange', pokemon, 'Cherrim');
					this.add('-message', pokemon.name + ' transformed! (placeholder)');
				}
			}
		},
		onModifyAtkPriority: 3,
		onAllyModifyAtk: function (atk) {
			if (this.effectData.target.template.speciesid !== 'cherrim') return;
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD: function (spd) {
			if (this.effectData.target.template.speciesid !== 'cherrim') return;
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 3,
		num: 122
	},
	"flowerveil": {
		desc: "Prevents ally Grass-type Pokemon from being statused or having their stats lowered.",
		shortDesc: "Prevents lowering of ally Grass-type Pokemon's stats.",
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
		desc: "This Pokemon's type changes according to the current weather conditions: it becomes Fire-type during Sunny Day, Water-type during Rain Dance, Ice-type during Hail and remains its regular type otherwise.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm.",
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.species !== 'Castform' || pokemon.transformed) return;
			var forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
				if (pokemon.template.speciesid !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
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
				this.add('-formechange', pokemon, forme);
				this.add('-message', pokemon.name + ' transformed! (placeholder)');
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 4,
		num: 59
	},
	"forewarn": {
		desc: "On switch-in, this Pokemon is alerted to the foes' move with the highest Base Power.",
		shortDesc: "The move with the highest Base Power in the opponent's moveset is revealed.",
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
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove[0], warnMove[1]);
		},
		id: "forewarn",
		name: "Forewarn",
		rating: 1,
		num: 108
	},
	"friendguard": {
		desc: "Reduces the damage received from an ally in a double or triple battle.",
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
		desc: "When this Pokemon enters the field, it identifies all the opponent's held items.",
		shortDesc: "On switch-in, this Pokemon identifies the foe's held items.",
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
		desc: "Halves the damage done to this Pokemon by physical attacks.",
		shortDesc: "Halves physical damage done to this Pokemon.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			return this.chainModify(0.5);
		},
		id: "furcoat",
		name: "Fur Coat",
		rating: 3.5,
		num: 169
	},
	"galewings": {
		desc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		shortDesc: "Gives priority to Flying-type moves.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 1;
		},
		id: "galewings",
		name: "Gale Wings",
		rating: 4.5,
		num: 177
	},
	"gluttony": {
		desc: "This Pokemon consumes its held berry when its health reaches 50% max HP or lower.",
		shortDesc: "When this Pokemon has 1/2 or less of its max HP, it uses certain Berries early.",
		id: "gluttony",
		name: "Gluttony",
		rating: 1.5,
		num: 82
	},
	"gooey": {
		desc: "Contact with this Pokemon lowers the attacker's Speed stat by 1.",
		shortDesc: "Contact with this Pokemon lowers the attacker's Speed.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.isContact) this.boost({spe: -1}, source, target);
		},
		id: "gooey",
		name: "Gooey",
		rating: 3,
		num: 183
	},
	"grasspelt": {
		desc: "This Pokemon's Defense is boosted in Grassy Terrain.",
		shortDesc: "This Pokemon's Defense is boosted in Grassy Terrain.",
		onModifyDefPriority: 6,
		onModifyDef: function (pokemon) {
			if (this.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		id: "grasspelt",
		name: "Grass Pelt",
		rating: 2,
		num: 179
	},
	"guts": {
		desc: "When this Pokemon is poisoned (including Toxic), burned, paralyzed or asleep (including self-induced Rest), its Attack stat receives a 50% boost; the burn status' Attack drop is also ignored.",
		shortDesc: "If this Pokemon is statused, its Attack is 1.5x; burn's Attack drop is ignored.",
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
		desc: "When the user uses a held Berry, it has a 50% chance of having it restored at the end of the turn. This chance becomes 100% during Sunny Day.",
		shortDesc: "50% chance this Pokemon's Berry is restored at the end of each turn. 100% in Sun.",
		id: "harvest",
		name: "Harvest",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (this.isWeather('sunnyday') || this.random(2) === 0) {
				if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		rating: 2,
		num: 139
	},
	"healer": {
		desc: "Has a 30% chance of curing an adjacent ally's status ailment at the end of each turn in Double and Triple Battles.",
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
		desc: "This Pokemon receives half damage from both Fire-type attacks and residual burn damage.",
		shortDesc: "This Pokemon receives half damage from Fire-type attacks and burn damage.",
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
		desc: "The user's weight is doubled. This increases user's base power of Heavy Slam and Heat Crash, as well as damage taken from the opponent's Low Kick and Grass Knot, due to these moves being calculated by the target's weight.",
		shortDesc: "This Pokemon's weight is doubled.",
		onModifyPokemon: function (pokemon) {
			pokemon.weightkg *= 2;
		},
		id: "heavymetal",
		name: "Heavy Metal",
		rating: -1,
		num: 134
	},
	"honeygather": {
		desc: "If it is not already holding an item, this Pokemon may find and be holding Honey after a battle.",
		shortDesc: "No competitive use.",
		id: "honeygather",
		name: "Honey Gather",
		rating: 0,
		num: 118
	},
	"hugepower": {
		desc: "This Pokemon's Attack stat is doubled. Therefore, if this Pokemon's Attack stat on the status screen is 200, it effectively has an Attack stat of 400; which is then subject to the full range of stat boosts and reductions.",
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
		desc: "This Pokemon's Attack receives a 50% boost but its Physical attacks receive a 20% drop in Accuracy. For example, a 100% accurate move would become an 80% accurate move. The accuracy of moves that never miss, such as Aerial Ace, remains unaffected.",
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
		desc: "If this Pokemon is active while Rain Dance is in effect, it recovers from poison, paralysis, burn, sleep and freeze at the end of the turn.",
		shortDesc: "This Pokemon has its status cured at the end of each turn if Rain Dance is active.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.status && this.isWeather('raindance')) {
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
		desc: "Opponents cannot reduce this Pokemon's Attack stat; they can, however, modify stat changes with Power Swap or Heart Swap and inflict a stat boost with Swagger. This ability does not prevent self-inflicted stat reductions.",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Attack.",
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
		desc: "If active while Hail is in effect, this Pokemon recovers one-sixteenth of its max HP after each turn. If a non-Ice-type Pokemon receives this ability through Skill Swap, Role Play or the Trace ability, it will not take damage from Hail.",
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
		rating: 3,
		num: 115
	},
	"illuminate": {
		desc: "When this Pokemon is in the first slot of the player's party, it doubles the rate of wild encounters.",
		shortDesc: "No competitive use.",
		id: "illuminate",
		name: "Illuminate",
		rating: 0,
		num: 35
	},
	"illusion": {
		desc: "Illusion will change the appearance of the Pokemon to a different species. This is dependent on the last Pokemon in the player's party. Along with the species itself, Illusion is broken when the user is damaged, but is not broken by Substitute, weather conditions, status ailments, or entry hazards. Illusion will replicate the type of Poke Ball, the species name, and the gender of the Pokemon it is masquerading as.",
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
		desc: "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.",
		shortDesc: "This Pokemon cannot become poisoned nor Toxic poisoned.",
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
		rating: 1,
		num: 17
	},
	"imposter": {
		desc: "As soon as the user comes into battle, it Transforms into its opponent, copying the opponent's stats exactly, with the exception of HP. Imposter copies all stat changes on the target originating from moves and abilities such as Swords Dance and Intimidate, but not from items such as Choice Specs. Imposter will not Transform the user if the opponent is an Illusion or if the opponent is behind a Substitute.",
		shortDesc: "On switch-in, this Pokemon copies the foe it's facing; stats, moves, types, Ability.",
		onStart: function (pokemon) {
			var target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				pokemon.transformInto(target, pokemon);
			}
		},
		id: "imposter",
		name: "Imposter",
		rating: 5,
		num: 150
	},
	"infiltrator": {
		desc: "This Pokemon's moves ignore the target's Light Screen, Mist, Reflect, Safeguard, and Substitute.",
		shortDesc: "Ignores Light Screen, Mist, Reflect, Safeguard, and Substitute.",
		onModifyMove: function (move) {
			move.notSubBlocked = true;
			move.ignoreScreens = true;
		},
		id: "infiltrator",
		name: "Infiltrator",
		rating: 2.5,
		num: 151
	},
	"innerfocus": {
		desc: "This Pokemon cannot be made to flinch.",
		shortDesc: "This Pokemon cannot be made to flinch.",
		onFlinch: false,
		id: "innerfocus",
		name: "Inner Focus",
		rating: 1,
		num: 39
	},
	"insomnia": {
		desc: "This Pokemon cannot be put to sleep; this includes both opponent-induced sleep as well as user-induced sleep via Rest.",
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
		desc: "When this Pokemon enters the field, the Attack stat of each of its opponents lowers by one stage.",
		shortDesc: "On switch-in, this Pokemon lowers adjacent foes' Attack by 1.",
		onStart: function (pokemon) {
			var foeactive = pokemon.side.foe.active;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (foeactive[i].volatiles['substitute']) {
					// does it give a message?
					this.add('-activate', foeactive[i], 'Substitute', 'ability: Intimidate', '[of] ' + pokemon);
				} else {
					this.add('-ability', pokemon, 'Intimidate', '[of] ' + foeactive[i]);
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
		desc: "All moves that make contact with the Pokemon with Iron Barbs will damage the user by 1/8 of their maximum HP after damage is dealt.",
		shortDesc: "This Pokemon causes other Pokemon making contact to lose 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
		id: "ironbarbs",
		name: "Iron Barbs",
		rating: 3,
		num: 160
	},
	"ironfist": {
		desc: "This Pokemon receives a 20% power boost for the following attacks: Bullet Punch, Comet Punch, Dizzy Punch, Drain Punch, Dynamicpunch, Fire Punch, Focus Punch, Hammer Arm, Ice Punch, Mach Punch, Mega Punch, Meteor Mash, Shadow Punch, Sky Uppercut, and Thunderpunch. Sucker Punch, which is known Ambush in Japan, is not boosted.",
		shortDesc: "This Pokemon's punch-based attacks do 1.2x damage. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.isPunchAttack) {
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
		desc: "Will raise the user's Attack stat one level when hit by any Dark-type moves. Unlike other abilities with immunity to certain typed moves, the user will still receive damage from the attack. Justified will raise Attack one level for each hit of a multi-hit move like Beat Up.",
		shortDesc: "This Pokemon's Attack is boosted by 1 after it is damaged by a Dark-type attack.",
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
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy.",
		shortDesc: "This Pokemon's Accuracy cannot be lowered.",
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
		desc: "This Pokemon ignores both the positive and negative effects of its held item, other than the speed-halving and EV-enhancing effects of Macho Brace, Power Anklet, Power Band, Power Belt, Power Bracer, Power Lens, and Power Weight. Fling cannot be used.",
		shortDesc: "This Pokemon's held item has no effect, except Macho Brace. Fling cannot be used.",
		onModifyPokemonPriority: 1,
		onModifyPokemon: function (pokemon) {
			if (pokemon.getItem().megaEvolves) return;
			pokemon.ignore['Item'] = true;
		},
		id: "klutz",
		name: "Klutz",
		rating: 0,
		num: 103
	},
	"leafguard": {
		desc: "If this Pokemon is active while Sunny Day is in effect, it cannot become poisoned, burned, paralyzed or put to sleep (other than user-induced Rest). Leaf Guard does not heal status effects that existed before Sunny Day came into effect.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.",
		onSetStatus: function (pokemon) {
			if (this.isWeather('sunnyday')) {
				return false;
			}
		},
		onTryHit: function (target, source, move) {
			if (move && move.id === 'yawn' && this.isWeather('sunnyday')) {
				return false;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 1,
		num: 102
	},
	"levitate": {
		desc: "This Pokemon is immune to Ground-type attacks, Spikes, Toxic Spikes and the Arena Trap ability; it loses these immunities while holding Iron Ball, after using Ingrain or if Gravity is in effect.",
		shortDesc: "This Pokemon is immune to Ground; Gravity, Ingrain, Smack Down, Iron Ball nullify it.",
		onImmunity: function (type) {
			if (type === 'Ground') return false;
		},
		id: "levitate",
		name: "Levitate",
		rating: 3.5,
		num: 26
	},
	"lightmetal": {
		desc: "The user's weight is halved. This decreases the damage taken from Low Kick and Grass Knot, and also lowers user's base power of Heavy Slam and Heat Crash, due these moves being calculated by the target and user's weight.",
		shortDesc: "This Pokemon's weight is halved.",
		onModifyPokemon: function (pokemon) {
			pokemon.weightkg /= 2;
		},
		id: "lightmetal",
		name: "Light Metal",
		rating: 1,
		num: 135
	},
	"lightningrod": {
		desc: "During double battles, this Pokemon draws any single-target Electric-type attack to itself. If an opponent uses an Electric-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Electric Hidden Power or Judgment. The user is immune to Electric and its Special Attack is increased one stage when hit by one.",
		shortDesc: "This Pokemon draws Electric moves to itself to boost Sp. Atk by 1; Electric immunity.",
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
			if (move.type !== 'Electric') return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				return this.effectData.target;
			}
		},
		id: "lightningrod",
		name: "Lightningrod",
		rating: 3.5,
		num: 32
	},
	"limber": {
		desc: "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it.",
		shortDesc: "This Pokemon cannot become paralyzed.",
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
		rating: 2,
		num: 7
	},
	"liquidooze": {
		desc: "When another Pokemon uses Absorb, Drain Punch, Dream Eater, Giga Drain, Leech Life, Leech Seed or Mega Drain against this Pokemon, the attacking Pokemon loses the amount of health that it would have gained.",
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
		rating: 1,
		num: 64
	},
	"magicbounce": {
		desc: "This Pokemon blocks certain status moves and uses the move itself.",
		shortDesc: "Non-damaging moves are reflected back at the user.",
		id: "magicbounce",
		name: "Magic Bounce",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target === source) return;
			if (move.hasBounced) return;
			if (typeof move.isBounceable === 'undefined') {
				move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
			}
			if (move.isBounceable) {
				var newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.useMove(newMove, target, source);
				return null;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target.side === source.side) return;
			if (move.hasBounced) return;
			if (typeof move.isBounceable === 'undefined') {
				move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
			}
			if (move.isBounceable) {
				var newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.useMove(newMove, target, source);
				return null;
			}
		},
		effect: {
			duration: 1
		},
		rating: 5,
		num: 156
	},
	"magicguard": {
		desc: "This Pokemon can only be damaged by direct attacks.",
		shortDesc: "Prevents all damage except from direct attacks.",
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
		desc: "If this Pokemon is not holding an item, it steals the held item of a target it hits with a move.",
		shortDesc: "This Pokemon steals the held item of a target it hits with a move.",
		onHit: function (target, source, move) {
			// We need to hard check if the ability is Magician since the event will be run both ways.
			if (target && target !== source && source.ability === 'magician' && move && move.category !== 'Status') {
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
		rating: 2,
		num: 170
	},
	"magmaarmor": {
		desc: "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it.",
		shortDesc: "This Pokemon cannot become frozen.",
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
		desc: "When this Pokemon enters the field, Steel-type opponents cannot switch out nor flee the battle unless they are holding Shed Shell or use attacks like U-Turn or Baton Pass.",
		shortDesc: "Prevents Steel-type foes from switching out normally.",
		onFoeModifyPokemon: function (pokemon) {
			if (pokemon.hasType('Steel')) {
				pokemon.tryTrap();
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon) {
			if (pokemon.hasType('Steel')) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "magnetpull",
		name: "Magnet Pull",
		rating: 4.5,
		num: 42
	},
	"marvelscale": {
		desc: "When this Pokemon becomes burned, poisoned (including Toxic), paralyzed, frozen or put to sleep (including self-induced sleep via Rest), its Defense receives a 50% boost.",
		shortDesc: "If this Pokemon is statused, its Defense is 1.5x.",
		onModifyDefPriority: 6,
		onModifyDef: function (def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "marvelscale",
		name: "Marvel Scale",
		rating: 3,
		num: 63
	},
	"megalauncher": {
		desc: "Boosts the power of Aura and Pulse moves, such as Aura Sphere and Dark Pulse, by 50%.",
		shortDesc: "Boosts the power of Aura/Pulse moves by 50%.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.isPulseMove) {
				return this.chainModify(1.5);
			}
		},
		id: "megalauncher",
		name: "Mega Launcher",
		rating: 3,
		num: 178
	},
	"minus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if a partner has the Plus or Minus ability.",
		shortDesc: "If an ally has the Ability Plus or Minus, this Pokemon's Sp. Atk is 1.5x.",
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
		desc: "When this Pokemon uses any move, it nullifies the Ability of any active Pokemon that hinder or empower this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Herbivore, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		shortDesc: "This Pokemon's moves ignore any Ability that could modify the effectiveness.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		onAllyModifyPokemonPriority: 100,
		onAllyModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemonPriority: 100,
		onFoeModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "moldbreaker",
		name: "Mold Breaker",
		rating: 3,
		num: 104
	},
	"moody": {
		desc: "At the end of each turn, the Pokemon raises a random stat that isn't already +6 by two stages, and lowers a random stat that isn't already -6 by one stage. These stats include accuracy and evasion.",
		shortDesc: "Boosts a random stat by 2 and lowers another stat by 1 at the end of each turn.",
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
		desc: "This Pokemon is immune to all Electric-type moves (including Status moves). If hit by an Electric-type attack, its Speed increases by one stage.",
		shortDesc: "This Pokemon's Speed is boosted by 1 if hit by an Electric move; Electric immunity.",
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
		desc: "If this Pokemon knocks out another Pokemon with a damaging attack, its Attack is raised by one stage.",
		shortDesc: "This Pokemon's Attack is boosted by 1 if it attacks and faints another Pokemon.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk:1}, source);
			}
		},
		id: "moxie",
		name: "Moxie",
		rating: 4,
		num: 153
	},
	"multiscale": {
		desc: "If this Pokemon is at full HP, it takes half damage from attacks.",
		shortDesc: "If this Pokemon is at full HP, it takes half damage from attacks.",
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
		desc: "If this Pokemon is Arceus, its type and sprite change to match its held Plate. Either way, this Pokemon is holding a Plate, the Plate cannot be taken (such as by Trick or Thief). This ability cannot be Skill Swapped, Role Played or Traced.",
		shortDesc: "If this Pokemon is Arceus, its type changes to match its held Plate.",
		// Multitype's type-changing itself is implemented in statuses.js
		onTakeItem: function (item) {
			if (item.onPlate) return false;
		},
		id: "multitype",
		name: "Multitype",
		rating: 4,
		num: 121
	},
	"mummy": {
		desc: "When the user is attacked by a contact move, the opposing Pokemon's ability is turned into Mummy as well. Multitype, Wonder Guard and Mummy itself are the only abilities not affected by Mummy. The effect of Mummy is not removed by Mold Breaker, Turboblaze, or Teravolt.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		id: "mummy",
		name: "Mummy",
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				var oldAbility = source.setAbility('mummy', source, 'mummy', true);
				if (oldAbility) {
					this.add('-endability', source, oldAbility, '[from] Mummy');
					this.add('-ability', source, 'Mummy', '[from] Mummy');
				}
			}
		},
		rating: 1,
		num: 152
	},
	"naturalcure": {
		desc: "When this Pokemon switches out of battle, it is cured of poison (including Toxic), paralysis, burn, freeze and sleep (including self-induced Rest).",
		shortDesc: "This Pokemon has its status cured when it switches out.",
		onSwitchOut: function (pokemon) {
			pokemon.setStatus('');
		},
		id: "naturalcure",
		name: "Natural Cure",
		rating: 4,
		num: 30
	},
	"noguard": {
		desc: "Every attack used by or against this Pokemon will always hit, even during evasive two-turn moves such as Fly and Dig.",
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
		desc: "Makes all of this Pokemon's attacks Normal-typed.",
		shortDesc: "This Pokemon's moves all become Normal-typed.",
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
		desc: "This Pokemon cannot be infatuated (by Attract or Cute Charm) or taunted. Gaining this Ability while afflicted by either condition cures it.",
		shortDesc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add("-message", pokemon.name + " got over its infatuation. (placeholder)");
			}
			if (pokemon.volatiles['taunt']) {
				pokemon.removeVolatile('taunt');
				// TODO: Research proper message.
				this.add("-message", pokemon.name + " got over its taunt. (placeholder)");
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
		rating: 0.5,
		num: 12
	},
	"overcoat": {
		desc: "In battle, the Pokemon does not take damage from weather conditions like Sandstorm or Hail. It is also immune to powder moves.",
		shortDesc: "This Pokemon is immune to residual weather damage, and powder moves.",
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 2,
		num: 142
	},
	"overgrow": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Grass-type attacks receive a 50% boost in power.",
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
		desc: "This Pokemon cannot be confused. Gaining this Ability while confused cures it.",
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
		desc: "Allows the Pokemon to hit twice with the same move in one turn. Second hit has 0.5x base power. Does not affect Status, multihit, or spread moves (in doubles).",
		shortDesc: "Hits twice in one turn. Second hit has 0.5x base power.",
		onModifyMove: function (move, pokemon, target) {
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && ((target.side && target.side.active.length < 2) || move.target in {any:1, normal:1, randomNormal:1})) {
				move.multihit = 2;
				pokemon.addVolatile('parentalbond');
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
		rating: 4.5,
		num: 184
	},
	"pickup": {
		desc: "If an opponent uses a consumable item, Pickup will give the Pokemon the item used, if it is not holding an item. If multiple Pickup Pokemon are in play, one will pick up a copy of the used Berry, and may or may not use it immediately. Works on Berries, Gems, Absorb Bulb, Focus Sash, Herbs, Cell Battery, Red Card, and anything that is thrown with Fling.",
		shortDesc: "If this Pokemon has no item, it finds one used by an adjacent Pokemon this turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			var foe = pokemon.side.foe.randomActive();
			if (!foe) return;
			if (!pokemon.item && foe.lastItem && foe.usedItemThisTurn && foe.lastItem !== 'airballoon' && foe.lastItem !== 'ejectbutton') {
				pokemon.setItem(foe.lastItem);
				foe.lastItem = '';
				var item = pokemon.getItem();
				this.add('-item', pokemon, item, '[from] Pickup');
				if (item.isBerry) pokemon.update();
			}
		},
		id: "pickup",
		name: "Pickup",
		rating: 0,
		num: 53
	},
	"pickpocket": {
		desc: "If this Pokemon has no item, it steals an item off an attacking Pokemon making contact.",
		shortDesc: "If this Pokemon has no item, it steals an item off a Pokemon making contact.",
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
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
				this.add('-item', target, yourItem, '[from] ability: Pickpocket');
			}
		},
		id: "pickpocket",
		name: "Pickpocket",
		rating: 1,
		num: 124
	},
	"pixilate": {
		desc: "Turns all of this Pokemon's Normal-typed attacks into Fairy-type and deal 1.3x damage. Does not affect Hidden Power.",
		shortDesc: "This Pokemon's Normal moves become Fairy-type and do 1.3x damage.",
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'hiddenpower') {
				move.type = 'Fairy';
				pokemon.addVolatile('pixilate');
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
		rating: 3,
		num: 182
	},
	"plus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if a partner has the Plus or Minus ability.",
		shortDesc: "If an ally has the Ability Plus or Minus, this Pokemon's Sp. Atk is 1.5x.",
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
		desc: "If this Pokemon becomes poisoned (including Toxic), it will recover 1/8 of its max HP after each turn.",
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
		desc: "If an opponent contact attacks this Pokemon, there is a 30% chance that the opponent will become poisoned.",
		shortDesc: "30% chance of poisoning a Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.isContact) {
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
		desc: "This Pokemon's contact attacks have a 30% chance of poisoning the target.",
		shortDesc: "This Pokemon's contact moves have a 30% chance of poisoning.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function (move) {
			if (!move || !move.isContact) return;
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
		desc: "This Pokemon's Status moves have their priority increased by 1 stage.",
		shortDesc: "This Pokemon's Status moves have their priority increased by 1.",
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
		desc: "If this Pokemon is the target of a foe's move, that move loses one additional PP.",
		shortDesc: "If this Pokemon is the target of a foe's move, that move loses one additional PP.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onSourceDeductPP: function (pp, target, source) {
			if (target.side === source.side) return;
			return pp + 1;
		},
		id: "pressure",
		name: "Pressure",
		rating: 1.5,
		num: 46
	},
	"protean": {
		desc: "Right before this Pokemon uses a move, it changes its type to match that move. Hidden Power is interpreted as its Hidden Power type, rather than Normal.",
		shortDesc: "Right before this Pokemon uses a move, it changes its type to match that move.",
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
		desc: "This Pokemon's Attack stat is doubled. Note that this is the Attack stat itself, not the base Attack stat of its species.",
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
		desc: "When this Pokemon is poisoned (including Toxic), burned, paralyzed, asleep (including self-induced Rest) or frozen, its Speed stat receives a 50% boost; the paralysis status' Speed drop is also ignored.",
		shortDesc: "If this Pokemon is statused, its Speed is 1.5x; paralysis' Speed drop is ignored.",
		onModifySpe: function (speMod, pokemon) {
			if (pokemon.status) {
				return this.chain(speMod, 1.5);
			}
		},
		id: "quickfeet",
		name: "Quick Feet",
		rating: 3,
		num: 95
	},
	"raindish": {
		desc: "If the weather is Rain Dance, this Pokemon recovers 1/16 of its max HP after each turn.",
		shortDesc: "If the weather is Rain Dance, this Pokemon heals 1/16 of its max HP each turn.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'raindance') {
				this.heal(target.maxhp / 16);
			}
		},
		id: "raindish",
		name: "Rain Dish",
		rating: 1.5,
		num: 44
	},
	"rattled": {
		desc: "Raises the user's Speed one stage when hit by a Dark-, Bug-, or Ghost-type move.",
		shortDesc: "This Pokemon gets +1 Speed if hit by a Dark-, Bug-, or Ghost-type attack.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({spe:1});
			}
		},
		id: "rattled",
		name: "Rattled",
		rating: 2,
		num: 155
	},
	"reckless": {
		desc: "When this Pokemon uses an attack that causes recoil damage, or an attack that has a chance to cause recoil damage such as Jump Kick and High Jump Kick, the attacks's power receives a 20% boost.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage do 1.2x damage; not Struggle.",
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
		desc: "Turns all of this Pokemon's Normal-typed attacks into Ice-typed and deal 1.3x damage. Does not affect Hidden Power.",
		shortDesc: "This Pokemon's Normal moves become Ice-type and do 1.3x damage.",
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'hiddenpower') {
				move.type = 'Ice';
				pokemon.addVolatile('refrigerate');
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
		rating: 3,
		num: 174
	},
	"regenerator": {
		desc: "This Pokemon heals 1/3 of its max HP when it switches out.",
		shortDesc: "This Pokemon heals 1/3 of its max HP when it switches out.",
		onSwitchOut: function (pokemon) {
			pokemon.heal(pokemon.maxhp / 3);
		},
		id: "regenerator",
		name: "Regenerator",
		rating: 4,
		num: 144
	},
	"rivalry": {
		desc: "This Pokemon's attacks do 1.25x damage if their target is the same gender, but 0.75x if their target is the opposite gender.",
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
		desc: "This Pokemon does not receive recoil damage except from Struggle, Life Orb, or crash damage from Jump Kick or High Jump Kick.",
		shortDesc: "This Pokemon does not take recoil damage besides Struggle, Life Orb, crash damage.",
		onModifyMove: function (move) {
			delete move.recoil;
		},
		id: "rockhead",
		name: "Rock Head",
		rating: 3,
		num: 69
	},
	"roughskin": {
		desc: "Causes recoil damage equal to 1/8 of the opponent's max HP if an opponent makes contact.",
		shortDesc: "This Pokemon causes other Pokemon making contact to lose 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				this.damage(source.maxhp / 8, source, target, null, true);
			}
		},
		id: "roughskin",
		name: "Rough Skin",
		rating: 3,
		num: 24
	},
	"runaway": {
		desc: "Unless this Pokemon is under the effects of a trapping move or ability, such as Mean Look or Shadow Tag, it will escape from wild Pokemon battles without fail.",
		shortDesc: "No competitive use.",
		id: "runaway",
		name: "Run Away",
		rating: 0,
		num: 50
	},
	"sandforce": {
		desc: "Raises the power of this Pokemon's Rock, Ground, and Steel-type moves by 1.3x if the weather is Sandstorm. This Pokemon is also immune to residual Sandstorm damage.",
		shortDesc: "This Pokemon's Rock/Ground/Steel attacks do 1.3x in Sandstorm; immunity to it.",
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
		desc: "This Pokemon's Speed is doubled if the weather is Sandstorm. This Pokemon is also immune to residual Sandstorm damage.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is doubled; immunity to Sandstorm.",
		onModifySpe: function (speMod, pokemon) {
			if (this.isWeather('sandstorm')) {
				return this.chain(speMod, 2);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandrush",
		name: "Sand Rush",
		rating: 2,
		num: 146
	},
	"sandstream": {
		desc: "When this Pokemon enters the battlefield, the weather becomes Sandstorm (for 5 turns normally, or 8 turns while holding Smooth Rock).",
		shortDesc: "On switch-in, the weather becomes Sandstorm.",
		onStart: function (source) {
			this.setWeather('sandstorm');
		},
		id: "sandstream",
		name: "Sand Stream",
		rating: 4.5,
		num: 45
	},
	"sandveil": {
		desc: "This Pokemon's Evasion is boosted by 1.25x if the weather is Sandstorm. This Pokemon is also immune to residual Sandstorm damage.",
		shortDesc: "If Sandstorm is active, this Pokemon's evasion is 1.25x; immunity to Sandstorm.",
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onAccuracy: function (accuracy) {
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
		desc: "This Pokemon is immune to Grass moves. If hit by a Grass move, its Attack is increased by one stage (once for each hit of Bullet Seed). Does not affect Aromatherapy.",
		shortDesc: "This Pokemon's Attack is boosted by 1 if hit by any Grass move; Grass immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({atk:1})) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
		id: "sapsipper",
		name: "Sap Sipper",
		rating: 3.5,
		num: 157
	},
	"scrappy": {
		desc: "This Pokemon has the ability to hit Ghost-type Pokemon with Normal-type and Fighting-type moves. Effectiveness of these moves takes into account the Ghost-type Pokemon's other weaknesses and resistances.",
		shortDesc: "This Pokemon can hit Ghost-types with Normal- and Fighting-type moves.",
		onModifyMove: function (move) {
			if (move.type in {'Fighting':1, 'Normal':1}) {
				move.affectedByImmunities = false;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113
	},
	"serenegrace": {
		desc: "This Pokemon's moves have their secondary effect chance doubled. For example, if this Pokemon uses Ice Beam, it will have a 20% chance to freeze its target.",
		shortDesc: "This Pokemon's moves have their secondary effect chance doubled.",
		onModifyMove: function (move) {
			if (move.secondaries) {
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
		desc: "When this Pokemon enters the field, its non-Ghost-type opponents cannot switch or flee the battle unless they have the same ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn.",
		shortDesc: "Prevents foes from switching out normally unless they also have this Ability.",
		onFoeModifyPokemon: function (pokemon) {
			if (!pokemon.hasAbility('shadowtag')) {
				pokemon.tryTrap();
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon) {
			if (!pokemon.hasAbility('shadowtag')) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "shadowtag",
		name: "Shadow Tag",
		rating: 5,
		num: 23
	},
	"shedskin": {
		desc: "At the end of each turn, this Pokemon has a 33% chance to heal itself from poison (including Toxic), paralysis, burn, freeze or sleep (including self-induced Rest).",
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
		rating: 4,
		num: 61
	},
	"sheerforce": {
		desc: "Raises the base power of all moves that have any secondary effects by 30%, but the secondary effects are ignored. Some side effects of moves, such as recoil, draining, stat reduction, and switching out usually aren't considered secondary effects. If a Pokemon with Sheer Force is holding a Life Orb and uses an attack that would be boosted by Sheer Force, then the move gains both boosts and the user receives no Life Orb recoil (only if the attack is boosted by Sheer Force).",
		shortDesc: "This Pokemon's attacks with secondary effects do 1.3x damage; nullifies the effects.",
		onModifyMove: function (move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				move.negateSecondary = true;
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
		desc: "Attacks targeting this Pokemon can't be critical hits.",
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
		onCriticalHit: false,
		id: "shellarmor",
		name: "Shell Armor",
		rating: 1,
		num: 75
	},
	"shielddust": {
		desc: "If the opponent uses a move that has secondary effects that affect this Pokemon in addition to damage, the move's secondary effects will not trigger (For example, Ice Beam loses its 10% freeze chance).",
		shortDesc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack.",
		onTrySecondaryHit: function () {
			this.debug('Shield Dust prevent secondary');
			return null;
		},
		id: "shielddust",
		name: "Shield Dust",
		rating: 2,
		num: 19
	},
	"simple": {
		desc: "This Pokemon doubles all of its positive and negative stat modifiers. For example, if this Pokemon uses Curse, its Attack and Defense stats increase by two stages and its Speed stat decreases by two stages.",
		shortDesc: "This Pokemon has its own stat boosts and drops doubled as they happen.",
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
		desc: "When this Pokemon uses an attack that strikes multiple times in one turn, such as Fury Attack or Spike Cannon, such attacks will always strike for the maximum number of hits.",
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
		desc: "After this Pokemon switches into the battle, its Attack and Speed stats are halved for five turns. For example, if this Pokemon has an Attack stat of 400, its Attack will be 200 until the effects of Slow Start wear off.",
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.",
		onStart: function (pokemon) {
			pokemon.addVolatile('slowstart');
		},
		effect: {
			duration: 5,
			onStart: function (target) {
				this.add('-start', target, 'Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, pokemon) {
				if (pokemon.ignore['Ability'] === true || pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return this.chainModify(0.5);
			},
			onModifySpe: function (speMod, pokemon) {
				if (pokemon.ignore['Ability'] === true || pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return this.chain(speMod, 0.5);
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
		desc: "When this Pokemon lands a Critical Hit, the damage is increased to another 1.5x.",
		shortDesc: "If this Pokemon strikes with a critical hit, the damage is increased by 50%.",
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
		desc: "This Pokemon's Evasion is boosted by 1.25x if the weather is Hail. This Pokemon is also immune to residual Hail damage.",
		shortDesc: "If Hail is active, this Pokemon's evasion is 1.25x; immunity to Hail.",
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		onAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('hail')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 1,
		num: 81
	},
	"snowwarning": {
		desc: "When this Pokemon enters the battlefield, the weather becomes Hail (for 5 turns normally, or 8 turns while holding Icy Rock).",
		shortDesc: "On switch-in, the weather becomes Hail.",
		onStart: function (source) {
			this.setWeather('hail');
		},
		id: "snowwarning",
		name: "Snow Warning",
		rating: 4,
		num: 117
	},
	"solarpower": {
		desc: "If the weather is Sunny Day, this Pokemon's Special Attack is 1.5x, but it loses 1/8 of its max HP at the end of every turn.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x and loses 1/8 max HP per turn.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'sunnyday') {
				this.damage(target.maxhp / 8);
			}
		},
		id: "solarpower",
		name: "Solar Power",
		rating: 1.5,
		num: 94
	},
	"solidrock": {
		desc: "Super-effective attacks only deal 3/4 their usual damage against this Pokemon.",
		shortDesc: "This Pokemon receives 3/4 damage from super effective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (this.getEffectiveness(move, target) > 0) {
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
		desc: "This Pokemon is immune to the effects of sound-based moves, which are: Bug Buzz, Chatter, Echoed Voice, Grasswhistle, Growl, Heal Bell, Hyper Voice, Metal Sound, Perish Song, Relic Song, Roar, Round, Screech, Sing, Snarl, Snore, Supersonic, and Uproar. This ability doesn't affect Heal Bell.",
		shortDesc: "This Pokemon is immune to sound-based moves, except Heal Bell.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.isSoundBased) {
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
		desc: "At the end of every turn, this Pokemon's Speed increases by one stage (except the turn it switched in).",
		shortDesc: "This Pokemon's Speed is boosted by 1 at the end of each full turn on the field.",
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
		desc: "This Pokemon moves last among Pokemon using the same or greater priority moves.",
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
		desc: "Only affects Aegislash. If this Pokemon uses a Physical or Special move, it changes to Blade forme. If this Pokemon uses King's Shield, it changes to Shield forme.",
		shortDesc: "The Pokemon changes form depending on how it battles.",
		onBeforeMovePriority: 10,
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
		rating: 4.5,
		num: 176
	},
	"static": {
		desc: "If an opponent contact attacks this Pokemon, there is a 30% chance that the opponent will become paralyzed.",
		shortDesc: "30% chance of paralyzing a Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.isContact) {
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
		desc: "If this Pokemon flinches, its Speed increases by one stage.",
		shortDesc: "If this Pokemon flinches, its Speed is boosted by 1.",
		onFlinch: function (pokemon) {
			this.boost({spe: 1});
		},
		id: "steadfast",
		name: "Steadfast",
		rating: 1,
		num: 80
	},
	"stench": {
		desc: "This Pokemon's damaging moves that don't already have a flinch chance gain a 10% chance to cause flinch.",
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
		rating: 0,
		num: 1
	},
	"stickyhold": {
		desc: "This Pokemon cannot lose its held item due to another Pokemon's attack.",
		shortDesc: "This Pokemon cannot lose its held item due to another Pokemon's attack.",
		onTakeItem: function (item, pokemon, source) {
			if (source && source !== pokemon) return false;
		},
		id: "stickyhold",
		name: "Sticky Hold",
		rating: 1,
		num: 60
	},
	"stormdrain": {
		desc: "During double battles, this Pokemon draws any single-target Water-type attack to itself. If an opponent uses an Water-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Water Hidden Power, Judgment or Weather Ball. The user is immune to Water and its Special Attack is increased one stage when hit by one.",
		shortDesc: "This Pokemon draws Water moves to itself to boost Sp. Atk by 1; Water immunity.",
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
			if (move.type !== 'Water') return;
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
		desc: "This Pokemon receives a 50% power boost for jaw attacks such as Bite and Crunch.",
		shortDesc: "This Pokemon's bite-based attacks do 1.5x damage.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.isBiteAttack) {
				return this.chainModify(1.5);
			}
		},
		id: "strongjaw",
		name: "Strong Jaw",
		rating: 3,
		num: 173
	},
	"sturdy": {
		desc: "This Pokemon is immune to OHKO moves, and will survive with 1 HP if hit by an attack which would KO it while at full health.",
		shortDesc: "If this Pokemon is at full HP, it lives one hit with at least 1HP. OHKO moves fail on it.",
		onDamagePriority: -100,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.ohko) {
				this.add('-activate', target, 'Sturdy');
				return 0;
			}
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-activate', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		id: "sturdy",
		name: "Sturdy",
		rating: 3,
		num: 5
	},
	"suctioncups": {
		desc: "This Pokemon cannot be forced to switch out by another Pokemon's attack or item.",
		shortDesc: "This Pokemon cannot be forced to switch out by another Pokemon's attack or item.",
		onDragOutPriority: 1,
		onDragOut: function (pokemon) {
			this.add('-activate', pokemon, 'ability: Suction Cups');
			return null;
		},
		id: "suctioncups",
		name: "Suction Cups",
		rating: 2.5,
		num: 21
	},
	"superluck": {
		desc: "This Pokemon's critical hit ratio is boosted by 1.",
		shortDesc: "This Pokemon's critical hit ratio is boosted by 1.",
		onModifyMove: function (move) {
			move.critRatio++;
		},
		id: "superluck",
		name: "Super Luck",
		rating: 1,
		num: 105
	},
	"swarm": {
		desc: "When its health reaches 1/3 or less of its max HP, this Pokemon's Bug-type attacks do 1.5x damage.",
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
		desc: "Prevents allies from being put to Sleep.",
		shortDesc: "Prevents allies from being put to Sleep.",
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
		rating: 0,
		num: 175
	},
	"swiftswim": {
		desc: "If the weather is Rain Dance, this Pokemon's Speed is doubled.",
		shortDesc: "If the weather is Rain Dance, this Pokemon's Speed is doubled.",
		onModifySpe: function (speMod, pokemon) {
			if (this.isWeather('raindance')) {
				return this.chain(speMod, 2);
			}
		},
		id: "swiftswim",
		name: "Swift Swim",
		rating: 2,
		num: 33
	},
	"symbiosis": {
		desc: "This Pokemon immediately passes its item to an ally after their item is consumed.",
		shortDesc: "This Pokemon passes its item to an ally after their item is consumed.",
		onAllyAfterUseItem: function (item, pokemon) {
			var sourceItem = this.effectData.target.takeItem();
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
		desc: "If an opponent burns, poisons or paralyzes this Pokemon, it receives the same condition.",
		shortDesc: "If another Pokemon burns/poisons/paralyzes this Pokemon, it also gets that status.",
		onAfterSetStatus: function (status, target, source) {
			if (!source || source === target) return;
			if (status.id === 'slp' || status.id === 'frz') return;
			source.trySetStatus(status, target);
		},
		id: "synchronize",
		name: "Synchronize",
		rating: 3,
		num: 28
	},
	"tangledfeet": {
		desc: "When this Pokemon is confused, attacks targeting it have a 50% chance of missing.",
		shortDesc: "This Pokemon's evasion is doubled as long as it is confused.",
		onAccuracy: function (accuracy, target) {
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
		desc: "When this Pokemon uses an attack that has 60 Base Power or less (including Struggle), the move's Base Power receives a 50% boost. For example, a move with 60 Base Power effectively becomes a move with 90 Base Power.",
		shortDesc: "This Pokemon's attacks of 60 Base Power or less do 1.5x damage. Includes Struggle.",
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
		desc: "This Pokemon will not take damage from its allies' spread moves in double and triple battles.",
		shortDesc: "This Pokemon does not take damage from its allies' attacks.",
		onTryHit: function (target, source, move) {
			if (target.side === source.side && move.category !== 'Status') {
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
		desc: "When this Pokemon uses any move, it nullifies the Ability of any active Pokemon that hinder or empower this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Herbivore, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		shortDesc: "This Pokemon's moves ignore any Ability that could modify the effectiveness.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		onAllyModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "teravolt",
		name: "Teravolt",
		rating: 3,
		num: 164
	},
	"thickfat": {
		desc: "This Pokemon receives half damage from Ice-type and Fire-type attacks.",
		shortDesc: "This Pokemon receives half damage from Fire- and Ice-type attacks.",
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
		rating: 3,
		num: 47
	},
	"tintedlens": {
		desc: "This Pokemon's attacks that are not very effective on a target do double damage.",
		shortDesc: "This Pokemon's attacks that are not very effective on a target do double damage.",
		onModifyDamage: function (damage, source, target, move) {
			if (this.getEffectiveness(move, target) < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		id: "tintedlens",
		name: "Tinted Lens",
		rating: 4,
		num: 110
	},
	"torrent": {
		desc: "When its health reaches 1/3 or less of its max HP, this Pokemon's Water-type attacks do 1.5x damage.",
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
		desc: "When this Pokemon is poisoned, its physical attacks do 1.5x damage.",
		shortDesc: "When this Pokemon is poisoned, its physical attacks do 1.5x damage.",
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
		desc: "This Pokemon's contact attacks do 33% more damage.",
		shortDesc: "This Pokemon's contact attacks do 1.33x damage.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.isContact) {
				return this.chainModify(1.33);
			}
		},
		id: "toughclaws",
		name: "Tough Claws",
		rating: 3,
		num: 181
	},
	"trace": {
		desc: "When this Pokemon enters the field, it temporarily copies an opponent's ability. This ability remains with this Pokemon until it leaves the field.",
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
		rating: 3.5,
		num: 36
	},
	"truant": {
		desc: "After this Pokemon is switched into battle, it skips every other turn.",
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant', pokemon, 'ability: Truant', move);
				return false;
			}
			pokemon.addVolatile('truant');
		},
		onBeforeMovePriority: 99,
		effect: {
			duration: 2
		},
		id: "truant",
		name: "Truant",
		rating: -2,
		num: 54
	},
	"turboblaze": {
		desc: "When this Pokemon uses any move, it nullifies the Ability of any active Pokemon that hinder or empower this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Herbivore, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		shortDesc: "This Pokemon's moves ignore any Ability that could modify the effectiveness.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onAllyModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "turboblaze",
		name: "Turboblaze",
		rating: 3,
		num: 163
	},
	"unaware": {
		desc: "This Pokemon ignores an opponent's stat boosts for Attack, Defense, Special Attack and Special Defense. These boosts will still affect Base Power calculation for Punishment and Stored Power.",
		shortDesc: "This Pokemon ignores other Pokemon's stat changes when taking or doing damage.",
		id: "unaware",
		name: "Unaware",
		onModifyMove: function (move, user, target) {
			move.ignoreEvasion = true;
			move.ignoreDefensive = true;
		},
		onSourceModifyMove: function (move, user, target) {
			if (user.hasAbility(['moldbreaker', 'turboblaze', 'teravolt'])) return;
			move.ignoreAccuracy = true;
			move.ignoreOffensive = true;
		},
		rating: 3,
		num: 109
	},
	"unburden": {
		desc: "Doubles this Pokemon's Speed if it loses its held item (such as by eating Berries, using Gems, or via Thief, Knock Off, etc).",
		shortDesc: "Speed is doubled on held item loss; boost is lost if it switches, gets new item/Ability.",
		onUseItem: function (item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		onTakeItem: function (item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		effect: {
			onModifySpe: function (speMod, pokemon) {
				if (pokemon.ignore['Ability'] === true || pokemon.ability !== 'unburden') {
					pokemon.removeVolatile('unburden');
					return;
				}
				if (!pokemon.item) {
					return this.chain(speMod, 2);
				}
			}
		},
		id: "unburden",
		name: "Unburden",
		rating: 3.5,
		num: 84
	},
	"unnerve": {
		desc: "While this Pokemon is active, prevents opposing Pokemon from using their Berries.",
		shortDesc: "While this Pokemon is active, prevents opposing Pokemon from using their Berries.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Unnerve', pokemon.side.foe);
		},
		onFoeEatItem: false,
		id: "unnerve",
		name: "Unnerve",
		rating: 1,
		num: 127
	},
	"victorystar": {
		desc: "Raises every friendly Pokemon's Accuracy, including this Pokemon's, by 10% (multiplied).",
		shortDesc: "This Pokemon and its allies' moves have their accuracy boosted to 1.1x.",
		onAllyModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.1;
			}
		},
		id: "victorystar",
		name: "Victory Star",
		rating: 2,
		num: 162
	},
	"vitalspirit": {
		desc: "This Pokemon cannot fall asleep (Rest will fail if it tries to use it). Gaining this Ability while asleep cures it.",
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
		desc: "This Pokemon is immune to Electric moves. If hit by an Electric move, it recovers 25% of its max HP.",
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
		desc: "This Pokemon is immune to Water moves. If hit by an Water move, it recovers 25% of its max HP.",
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
		desc: "This Pokemon cannot become burned. Gaining this Ability while burned cures it.",
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
		rating: 1.5,
		num: 41
	},
	"weakarmor": {
		desc: "Causes physical moves to lower the Pokemon's Defense and increase its Speed stat by one stage.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is lowered 1 and Speed is boosted 1.",
		onAfterDamage: function (damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({spe:1, def:-1});
			}
		},
		id: "weakarmor",
		name: "Weak Armor",
		rating: 0,
		num: 133
	},
	"whitesmoke": {
		desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles decreases by 50%.",
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
		desc: "This Pokemon only receives damage from attacks belonging to types that cause Super Effective to this Pokemon. Wonder Guard does not protect a Pokemon from status ailments (burn, freeze, paralysis, poison, sleep, Toxic or any of their side effects or damage), recoil damage nor the moves Beat Up, Bide, Doom Desire, Fire Fang, Future Sight, Hail, Leech Seed, Sandstorm, Spikes, Stealth Rock and Struggle. Wonder Guard cannot be Skill Swapped nor Role Played. Trace, however, does copy Wonder Guard.",
		shortDesc: "This Pokemon can only be damaged by super effective moves and indirect damage.",
		onTryHit: function (target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (this.getEffectiveness(move, target) <= 0) {
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
		desc: "Causes the chance of a status move working to be halved. It does not affect moves that inflict status as a secondary effect like Thunder's chance to paralyze.",
		shortDesc: "All status moves with a set % accuracy are 50% accurate if used on this Pokemon.",
		onAccuracyPriority: 10,
		onAccuracy: function (accuracy, target, source, move) {
			if (move.category === 'Status' && typeof move.accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 50;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 3,
		num: 147
	},
	"zenmode": {
		desc: "When Darmanitan's HP drops to below half, it will enter Zen Mode at the end of the turn. If it loses its ability, or recovers HP to above half while in Zen mode, it will change back. This ability only works on Darmanitan, even if it is copied by Role Play, Entrainment, or swapped with Skill Swap.",
		shortDesc: "If this Pokemon is Darmanitan, it changes to Zen Mode whenever it is below half HP.",
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.species !== 'Darmanitan') {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitan'){
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitanzen') {
				pokemon.removeVolatile('zenmode');
			}
		},
		effect: {
			onStart: function (pokemon) {
				if (pokemon.formeChange('Darmanitan-Zen')) {
					this.add('-formechange', pokemon, 'Darmanitan-Zen');
					this.add('-message', 'Zen Mode triggered! (placeholder)');
				} else {
					return false;
				}
			},
			onEnd: function (pokemon) {
				if (pokemon.formeChange('Darmanitan')) {
					this.add('-formechange', pokemon, 'Darmanitan');
					this.add('-message', 'Zen Mode ended! (placeholder)');
				} else {
					return false;
				}
			},
			onUpdate: function (pokemon) {
				if (!pokemon.hasAbility('zenmode')) {
					pokemon.transformed = false;
					pokemon.removeVolatile('zenmode');
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
		desc: "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.",
		shortDesc: "This Pokemon avoids all Rock-type attacks and hazards when switching in.",
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
		desc: "On switch-in, this Pokemon blocks certain status moves and uses the move itself.",
		shortDesc: "It can reflect the effect of status moves when switching in.",
		id: "rebound",
		isNonstandard: true,
		name: "Rebound",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (this.effectData.target.activeTurns) return;

			if (target === source) return;
			if (move.hasBounced) return;
			if (typeof move.isBounceable === 'undefined') {
				move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
			}
			if (move.isBounceable) {
				var newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.useMove(newMove, target, source);
				return null;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (this.effectData.target.activeTurns) return;

			if (target.side === source.side) return;
			if (move.hasBounced) return;
			if (typeof move.isBounceable === 'undefined') {
				move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
			}
			if (move.isBounceable) {
				var newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.useMove(newMove, target, source);
				return null;
			}
		},
		effect: {
			duration: 1
		},
		rating: 4,
		num: -3
	},
	"persistent": {
		desc: "The duration of certain field effects is increased by 2 turns if used by this Pokemon.",
		shortDesc: "Increases the duration of many field effects by two turns when used by this Pokemon.",
		id: "persistent",
		isNonstandard: true,
		name: "Persistent",
		// implemented in the corresponding move
		rating: 4,
		num: -4
	}
};
