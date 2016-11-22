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

'use strict';

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
		num: 91,
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
		num: 106,
	},
	"aerilate": {
		desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Flying';
				if (move.category !== 'Status') pokemon.addVolatile('aerilate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "aerilate",
		name: "Aerilate",
		rating: 4,
		num: 185,
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
		num: 76,
	},
	"analytic": {
		desc: "The power of this Pokemon's move is multiplied by 1.3 if it is the last to move in a turn. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon's attacks have 1.3x power if it is the last to move in a turn.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (!this.willMove(defender)) {
				this.debug('Analytic boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "analytic",
		name: "Analytic",
		rating: 2,
		num: 148,
	},
	"angerpoint": {
		desc: "If this Pokemon, but not its substitute, is struck by a critical hit, its Attack is raised by 12 stages.",
		shortDesc: "If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.",
		onHit: function (target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({atk: 6});
				this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
			}
		},
		id: "angerpoint",
		name: "Anger Point",
		rating: 2,
		num: 83,
	},
	"anticipation": {
		desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective on this Pokemon, or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, while Hidden Power, Judgment, Natural Gift, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move.",
		onStart: function (pokemon) {
			let targets = pokemon.side.foe.active;
			for (let i = 0; i < targets.length; i++) {
				if (!targets[i] || targets[i].fainted) continue;
				for (let j = 0; j < targets[i].moveset.length; j++) {
					let move = this.getMove(targets[i].moveset[j].move);
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
		num: 107,
	},
	"arenatrap": {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or are airborne.",
		shortDesc: "Prevents adjacent foes from choosing to switch unless they are airborne.",
		onFoeTrapPokemon: function (pokemon) {
			if (!this.isAdjacent(pokemon, this.effectData.target)) return;
			if (pokemon.isGrounded()) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!this.isAdjacent(pokemon, source)) return;
			if (pokemon.isGrounded(!pokemon.knownType)) { // Negate immunity if the type is unknown
				pokemon.maybeTrapped = true;
			}
		},
		id: "arenatrap",
		name: "Arena Trap",
		rating: 4.5,
		num: 71,
	},
	"aromaveil": {
		desc: "This Pokemon and its allies cannot be affected by Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		shortDesc: "Protects user/allies from Attract, Disable, Encore, Heal Block, Taunt, and Torment.",
		onAllyTryAddVolatile: function (status, target, source, effect) {
			if (status.id in {attract:1, disable:1, encore:1, healblock:1, taunt:1, torment:1}) {
				if (effect.effectType === 'Move') {
					this.add('-activate', this.effectData.target, 'ability: Aroma Veil', '[of] ' + target);
				}
				return null;
			}
		},
		id: "aromaveil",
		name: "Aroma Veil",
		rating: 1.5,
		num: 165,
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
			duration: 1,
		},
		id: "aurabreak",
		name: "Aura Break",
		rating: 2,
		num: 188,
	},
	"baddreams": {
		desc: "Causes adjacent opposing Pokemon to lose 1/8 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
		shortDesc: "Causes sleeping adjacent foes to lose 1/8 of their max HP at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			for (let i = 0; i < pokemon.side.foe.active.length; i++) {
				let target = pokemon.side.foe.active[i];
				if (!target || !target.hp) continue;
				if (target.status === 'slp') {
					this.damage(target.maxhp / 8, target, pokemon);
				}
			}
		},
		id: "baddreams",
		name: "Bad Dreams",
		rating: 2,
		num: 123,
	},
	"battery": {
		shortDesc: "This Pokemon's allies have the power of their special attacks multiplied by 1.3.",
		onBasePowerPriority: 8,
		onAllyBasePower: function (basePower, attacker, defender, move) {
			if (attacker !== this.effectData.target && move.category === 'Special') {
				this.debug('Battery boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "battery",
		name: "Battery",
		rating: 0,
		num: 217,
	},
	"battlearmor": {
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
		onCriticalHit: false,
		id: "battlearmor",
		name: "Battle Armor",
		rating: 1,
		num: 4,
	},
	"battlebond": {
		desc: "If this Pokemon is a Greninja, it transforms into Ash-Greninja after knocking out a Pokemon. As Ash-Greninja, its Water Shuriken does 1.5x damage.",
		shortDesc: "After knocking out a Pokemon: Becomes Ash-Greninja and Water Shuriken does 1.5x.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move' && source.template.speciesid === 'greninja' && !source.transformed) {
				this.add('-activate', source, 'ability: Battle Bond');
				let template = this.getTemplate('Greninja-Ash');
				source.formeChange(template);
				source.baseTemplate = template;
				source.details = template.species + (source.level === 100 ? '' : ', L' + source.level) + (source.gender === '' ? '' : ', ' + source.gender) + (source.set.shiny ? ', shiny' : '');
				this.add('detailschange', source, source.details);
				this.add('-message', "" + source.name + " became Ash-Greninja! (placeholder)"); // TODO: -bond
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			// TODO: figure out the exact boost
			if (move.id === 'watershuriken' && attacker.template.speciesid === 'greninjaash') {
				return this.chainModify([0x1800, 0x1000]);
			}
		},
		id: "battlebond",
		name: "Battle Bond",
		rating: 3,
		num: 210,
	},
	"beastboost": {
		desc: "This Pokemon's highest stat is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's highest stat is raised by 1 if it attacks and KOes another Pokemon.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]:1}, source);
			}
		},
		id: "beastboost",
		name: "Beast Boost",
		rating: 3.5,
		num: 224,
	},
	"berserk": {
		desc: "This Pokemon's Special Attack is raised by 1 stage when it reaches 1/2 or less of its maximum HP.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 when it reaches 1/2 or less of its max HP.",
		onAfterDamage: function (damage, target, source, move) {
			if (!target.hp || !damage || move.effectType !== 'Move') return;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({spa: 1});
			}
		},
		id: "berserk",
		name: "Berserk",
		rating: 2.5,
		num: 201,
	},
	"bigpecks": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Defense stat stage.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0) {
				delete boost['def'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
			}
		},
		id: "bigpecks",
		name: "Big Pecks",
		rating: 0.5,
		num: 145,
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
		num: 66,
	},
	"bulletproof": {
		desc: "This Pokemon is immune to ballistic moves. Ballistic moves include Bullet Seed, Octazooka, Barrage, Rock Wrecker, Zap Cannon, Acid Spray, Aura Sphere, Focus Blast, and all moves with Ball or Bomb in their name.",
		shortDesc: "Makes user immune to ballistic moves (Shadow Ball, Sludge Bomb, Focus Blast, etc).",
		onTryHit: function (pokemon, target, move) {
			if (move.flags['bullet']) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Bulletproof');
				return null;
			}
		},
		id: "bulletproof",
		name: "Bulletproof",
		rating: 3,
		num: 171,
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
		num: 167,
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
		num: 34,
	},
	"clearbody": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
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
		num: 29,
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
		num: 13,
	},
	"colorchange": {
		desc: "This Pokemon's type changes to match the type of the last move that hit it, unless that type is already one of its types. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's type changes to the type of a move it's hit by, unless it has the type.",
		onAfterMoveSecondary: function (target, source, move) {
			let type = move.type;
			if (target.isActive && move.effectType === 'Move' && move.category !== 'Status' && type !== '???' && !target.hasType(type)) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const decision = this.willMove(target);
					if (decision && decision.move.id === 'curse') {
						decision.targetLoc = -1;
						decision.targetSide = target.side;
						decision.targetPosition = 0;
					}
				}
			}
		},
		id: "colorchange",
		name: "Color Change",
		rating: 1,
		num: 16,
	},
	"comatose": {
		shortDesc: "This Pokemon cannot be statused. Gaining this Ability while statused cures it.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Comatose'); // TODO: "POKEMON is drowsing!"
		},
		onUpdate: function (pokemon) {
			if (pokemon.hp && pokemon.status) {
				this.add('-activate', pokemon, 'ability: Comatose');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Comatose');
			return false;
		},
		isUnbreakable: true,
		id: "comatose",
		name: "Comatose",
		rating: 3,
		num: 213,
	},
	"competitive": {
		desc: "This Pokemon's Special Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({spa: 2}, null, null, null, true);
			}
		},
		id: "competitive",
		name: "Competitive",
		rating: 2.5,
		num: 172,
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
		num: 14,
	},
	"contrary": {
		shortDesc: "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.",
		onBoost: function (boost) {
			for (let i in boost) {
				boost[i] *= -1;
			}
		},
		id: "contrary",
		name: "Contrary",
		rating: 4,
		num: 126,
	},
	"corrosion": {
		shortDesc: "This Pokemon can poison or badly poison other Pokemon regardless of their typing.",
		// Implemented in battle-engine.js:BattlePokemon#setStatus
		id: "corrosion",
		name: "Corrosion",
		rating: 2.5,
		num: 212,
	},
	"cursedbody": {
		desc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled unless one of the attacker's moves is already disabled.",
		shortDesc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled.",
		onAfterDamage: function (damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move' && !move.isFutureMove) {
				if (this.random(10) < 3) {
					source.addVolatile('disable', this.effectData.target);
				}
			}
		},
		id: "cursedbody",
		name: "Cursed Body",
		rating: 2,
		num: 130,
	},
	"cutecharm": {
		desc: "There is a 30% chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender.",
		shortDesc: "30% chance of infatuating Pokemon of the opposite gender if they make contact.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.addVolatile('attract', this.effectData.target);
				}
			}
		},
		id: "cutecharm",
		name: "Cute Charm",
		rating: 1,
		num: 56,
	},
	"damp": {
		desc: "While this Pokemon is active, Self-Destruct, Explosion, and the Ability Aftermath are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, Self-Destruct, Explosion, and Aftermath have no effect.",
		id: "damp",
		onAnyTryMove: function (target, source, effect) {
			if (effect.id === 'selfdestruct' || effect.id === 'explosion') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Damp', effect, '[of] ' + target);
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
		num: 6,
	},
	"dancer": {
		desc: "After another Pokemon uses a dance move, this Pokemon uses the same move. Moves used by this Ability cannot be copied again.",
		shortDesc: "After another Pokemon uses a dance move, this Pokemon uses the same move.",
		id: "dancer",
		onAnyAfterMove: function (source, target, move) {
			if (!this.effectData.target.hp || source === this.effectData.target) return;
			if (move.id.includes('dance') && move.id !== 'raindance') {
				this.faintMessages();
				this.add('-activate', this.effectData.target, 'ability: Dancer');
				this.useMove(move, this.effectData.target);
			}
		},
		name: "Dancer",
		rating: 2.5,
		num: 216,
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
		num: 186,
	},
	"dazzling": {
		desc: "While this Pokemon is active, priority moves from opposing Pokemon targeted at allies are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, allies are protected from opposing priority moves.",
		onFoeTryMove: function (target, source, effect) {
			if (source.side === this.effectData.target.side && effect.priority > 0.1 && effect.target !== 'self') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Dazzling', effect, '[of] ' + target);
				return false;
			}
		},
		id: "dazzling",
		name: "Dazzling",
		rating: 3.5,
		num: 219,
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
		id: "defeatist",
		name: "Defeatist",
		rating: -1,
		num: 129,
	},
	"defiant": {
		desc: "This Pokemon's Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: 2}, null, null, null, true);
			}
		},
		id: "defiant",
		name: "Defiant",
		rating: 2.5,
		num: 128,
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
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
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
		num: 191,
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
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
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
		num: 190,
	},
	"disguise": {
		desc: "If this Pokemon is a Mimikyu, it will take 0 damage the first time it is attacked in battle. It then changes to Busted Form.",
		shortDesc: "If this Pokemon is a Mimikyu, it takes 0 damage the first time it is attacked in battle.",
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.template.speciesid === 'mimikyu' && !target.transformed) {
				this.add('-activate', target, 'ability: Disguise');
				this.add('-message', "Its disguise served it as a decoy! (placeholder)");
				this.effectData.busted = true;
				return 0;
			}
		},
		onUpdate: function (pokemon) {
			if (pokemon.template.speciesid === 'mimikyu' && this.effectData.busted) {
				let template = this.getTemplate('Mimikyu-Busted');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
				this.add('-message', "" + pokemon.name + "'s disguise was busted! (placeholder)"); // TODO: -busted
			}
		},
		id: "disguise",
		name: "Disguise",
		rating: 4,
		num: 209,
	},
	"download": {
		desc: "On switch-in, this Pokemon's Attack or Special Attack is raised by 1 stage based on the weaker combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "On switch-in, Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let totaldef = 0;
			let totalspd = 0;
			for (let i = 0; i < foeactive.length; i++) {
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
		num: 88,
	},
	"drizzle": {
		shortDesc: "On switch-in, this Pokemon summons Rain Dance.",
		onStart: function (source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'kyogre') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
		},
		id: "drizzle",
		name: "Drizzle",
		rating: 4.5,
		num: 2,
	},
	"drought": {
		shortDesc: "On switch-in, this Pokemon summons Sunny Day.",
		onStart: function (source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'groudon') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('sunnyday');
		},
		id: "drought",
		name: "Drought",
		rating: 4.5,
		num: 70,
	},
	"dryskin": {
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day.",
		shortDesc: "This Pokemon is healed 1/4 by Water, 1/8 by Rain; is hurt 1.25x by Fire, 1/8 by Sun.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Dry Skin');
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
				this.damage(target.maxhp / 8, target, target);
			}
		},
		id: "dryskin",
		name: "Dry Skin",
		rating: 3,
		num: 87,
	},
	"earlybird": {
		shortDesc: "This Pokemon's sleep counter drops by 2 instead of 1.",
		id: "earlybird",
		name: "Early Bird",
		// Implemented in statuses.js
		rating: 2.5,
		num: 48,
	},
	"effectspore": {
		desc: "30% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep.",
		shortDesc: "30% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
				let r = this.random(100);
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
		num: 27,
	},
	"electricsurge": {
		shortDesc: "On switch-in, this Pokemon summons Electric Terrain.",
		onStart: function (source) {
			this.setTerrain('electricterrain');
		},
		id: "electricsurge",
		name: "Electric Surge",
		rating: 4,
		num: 226,
	},
	"emergencyexit": {
		shortDesc: "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				source.switchFlag = false;
				this.add('-activate', target, 'ability: Emergency Exit');
			}
		},
		id: "emergencyexit",
		name: "Emergency Exit",
		rating: 2,
		num: 194,
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
		num: 187,
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
		num: 111,
	},
	"flamebody": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be burned.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('brn', target);
				}
			}
		},
		id: "flamebody",
		name: "Flame Body",
		rating: 2,
		num: 49,
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
		num: 138,
	},
	"flashfire": {
		desc: "This Pokemon is immune to Fire-type moves. The first time it is hit by a Fire-type move, its attacking stat is multiplied by 1.5 while using a Fire-type attack as long as it remains active and has this Ability. If this Pokemon is frozen, it cannot be defrosted by Fire-type attacks.",
		shortDesc: "This Pokemon's Fire attacks do 1.5x damage if hit by one Fire move; Fire immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
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
			},
		},
		id: "flashfire",
		name: "Flash Fire",
		rating: 3,
		num: 18,
	},
	"flowergift": {
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		onStart: function (pokemon) {
			delete this.effectData.forme;
		},
		onUpdate: function (pokemon) {
			if (!pokemon.isActive || pokemon.baseTemplate.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				if (pokemon.template.speciesid !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine');
					this.add('-formechange', pokemon, 'Cherrim-Sunshine', '[msg]', '[from] ability: Flower Gift');
				}
			} else {
				if (pokemon.template.speciesid === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim');
					this.add('-formechange', pokemon, 'Cherrim', '[msg]', '[from] ability: Flower Gift');
				}
			}
		},
		onModifyAtkPriority: 3,
		onAllyModifyAtk: function (atk) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD: function (spd) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 2.5,
		num: 122,
	},
	"flowerveil": {
		desc: "Grass-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a major status condition inflicted on them by other Pokemon.",
		shortDesc: "This side's Grass types can't have stats lowered or status inflicted by other Pokemon.",
		onAllyBoost: function (boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add('-fail', this.effectData.target, 'unboost', '[from] ability: Flower Veil', '[of] ' + target);
		},
		onAllySetStatus: function (status, target, source, effect) {
			if (target.hasType('Grass')) {
				if (!effect || !effect.status) return false;
				this.add('-activate', this.effectData.target, 'ability: Flower Veil', '[of] ' + target);
				return null;
			}
		},
		id: "flowerveil",
		name: "Flower Veil",
		rating: 0,
		num: 166,
	},
	"fluffy": {
		desc: "This Pokemon receives 1/2 damage from contact moves, but double damage from Fire moves.",
		shortDesc: "This Pokemon takes 1/2 damage from contact moves, 2x damage from Fire moves.",
		// TODO: are either of these effects actually base power modifiers?
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		id: "fluffy",
		name: "Fluffy",
		rating: 2.5,
		num: 218,
	},
	"forecast": {
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm.",
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
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
				this.add('-formechange', pokemon, forme, '[msg]', '[from] ability: Forecast');
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 3,
		num: 59,
	},
	"forewarn": {
		desc: "On switch-in, this Pokemon is alerted to the move with the highest power, at random, known by an opposing Pokemon.",
		shortDesc: "On switch-in, this Pokemon is alerted to the foes' move with the highest power.",
		onStart: function (pokemon) {
			let targets = pokemon.side.foe.active;
			let warnMoves = [];
			let warnBp = 1;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].fainted) continue;
				for (let j = 0; j < targets[i].moveset.length; j++) {
					let move = this.getMove(targets[i].moveset[j].move);
					let bp = move.basePower;
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
			let warnMove = warnMoves[this.random(warnMoves.length)];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove[0], '[of] ' + warnMove[1]);
		},
		id: "forewarn",
		name: "Forewarn",
		rating: 1,
		num: 108,
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
		num: 132,
	},
	"frisk": {
		shortDesc: "On switch-in, this Pokemon identifies the held items of all opposing Pokemon.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				if (foeactive[i].item) {
					this.add('-item', foeactive[i], foeactive[i].getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
				}
			}
		},
		id: "frisk",
		name: "Frisk",
		rating: 1.5,
		num: 119,
	},
	"fullmetalbody": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", "[of] " + target);
		},
		isUnbreakable: true,
		id: "fullmetalbody",
		name: "Full Metal Body",
		rating: 2,
		num: 230,
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
		num: 169,
	},
	"galewings": {
		shortDesc: "If this Pokemon is at full HP, its Flying-type moves have their priority increased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		id: "galewings",
		name: "Gale Wings",
		rating: 3,
		num: 177,
	},
	"galvanize": {
		desc: "This Pokemon's Normal-type moves become Electric-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Electric type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Electric';
				if (move.category !== 'Status') pokemon.addVolatile('galvanize');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "galvanize",
		name: "Galvanize",
		rating: 4,
		num: 206,
	},
	"gluttony": {
		shortDesc: "When this Pokemon has 1/2 or less of its maximum HP, it uses certain Berries early.",
		id: "gluttony",
		name: "Gluttony",
		rating: 1,
		num: 82,
	},
	"gooey": {
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Gooey');
				this.boost({spe: -1}, source, target, null, true);
			}
		},
		id: "gooey",
		name: "Gooey",
		rating: 2.5,
		num: 183,
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
		num: 179,
	},
	"grassysurge": {
		shortDesc: "On switch-in, this Pokemon summons Grassy Terrain.",
		onStart: function (source) {
			this.setTerrain('grassyterrain');
		},
		id: "grassysurge",
		name: "Grassy Surge",
		rating: 4,
		num: 229,
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
		num: 62,
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
		num: 139,
	},
	"healer": {
		desc: "There is a 30% chance of curing an adjacent ally's major status condition at the end of each turn.",
		shortDesc: "30% chance of curing an adjacent ally's status at the end of each turn.",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].hp && this.isAdjacent(pokemon, allyActive[i]) && allyActive[i].status && this.random(10) < 3) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive[i].cureStatus();
				}
			}
		},
		rating: 0,
		num: 131,
	},
	"heatproof": {
		desc: "The power of Fire-type attacks against this Pokemon is halved, and burn damage taken is halved.",
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
		num: 85,
	},
	"heavymetal": {
		shortDesc: "This Pokemon's weight is doubled.",
		onModifyWeight: function (weight) {
			return weight * 2;
		},
		id: "heavymetal",
		name: "Heavy Metal",
		rating: -1,
		num: 134,
	},
	"honeygather": {
		shortDesc: "No competitive use.",
		id: "honeygather",
		name: "Honey Gather",
		rating: 0,
		num: 118,
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
		num: 37,
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
		num: 55,
	},
	"hydration": {
		desc: "This Pokemon has its major status condition cured at the end of each turn if Rain Dance is active.",
		shortDesc: "This Pokemon has its status cured at the end of each turn if Rain Dance is active.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.status && this.isWeather(['raindance', 'primordialsea'])) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				pokemon.cureStatus();
			}
		},
		id: "hydration",
		name: "Hydration",
		rating: 2,
		num: 93,
	},
	"hypercutter": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Attack stat stage.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				delete boost['atk'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
			}
		},
		id: "hypercutter",
		name: "Hyper Cutter",
		rating: 1.5,
		num: 52,
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
		num: 115,
	},
	"illuminate": {
		shortDesc: "No competitive use.",
		id: "illuminate",
		name: "Illuminate",
		rating: 0,
		num: 35,
	},
	"illusion": {
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage.",
		onBeforeSwitchIn: function (pokemon) {
			pokemon.illusion = null;
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				if (!pokemon.side.pokemon[i].fainted) break;
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			pokemon.illusion = pokemon.side.pokemon[i];
		},
		// illusion clearing for damage is hardcoded in the damage
		// function because mold breaker inhibits the damage event
		onEnd: function (pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				let details = pokemon.template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
			}
		},
		onFaint: function (pokemon) {
			pokemon.illusion = null;
		},
		id: "illusion",
		name: "Illusion",
		rating: 4.5,
		num: 149,
	},
	"immunity": {
		shortDesc: "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Immunity');
			return false;
		},
		id: "immunity",
		name: "Immunity",
		rating: 2,
		num: 17,
	},
	"imposter": {
		desc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it. If there is no Pokemon at that position, this Pokemon does not Transform.",
		shortDesc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it.",
		onStart: function (pokemon) {
			if (this.activeMove && this.activeMove.id === 'skillswap') return;
			let target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				pokemon.transformInto(target, pokemon, this.getAbility('imposter'));
			}
		},
		id: "imposter",
		name: "Imposter",
		rating: 4.5,
		num: 150,
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
		num: 151,
	},
	"innardsout": {
		desc: "If this Pokemon is knocked out with a move, that move's user loses HP equal to the amount of damage inflicted on this Pokemon.",
		shortDesc: "If this Pokemon is KOed with a move, that move's user loses an equal amount of HP.",
		id: "innardsout",
		name: "Innards Out",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.effectType === 'Move' && !target.hp) {
				this.damage(damage, source, target, null, true);
			}
		},
		rating: 2.5,
		num: 215,
	},
	"innerfocus": {
		shortDesc: "This Pokemon cannot be made to flinch.",
		onFlinch: false,
		id: "innerfocus",
		name: "Inner Focus",
		rating: 1.5,
		num: 39,
	},
	"insomnia": {
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Insomnia');
			return false;
		},
		id: "insomnia",
		name: "Insomnia",
		rating: 2,
		num: 15,
	},
	"intimidate": {
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({atk: -1}, foeactive[i], pokemon);
				}
			}
		},
		id: "intimidate",
		name: "Intimidate",
		rating: 3.5,
		num: 22,
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
		num: 160,
	},
	"ironfist": {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2.",
		shortDesc: "This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		id: "ironfist",
		name: "Iron Fist",
		rating: 3,
		num: 89,
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
		num: 154,
	},
	"keeneye": {
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage.",
		shortDesc: "This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0) {
				delete boost['accuracy'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", "[of] " + target);
			}
		},
		onModifyMove: function (move) {
			move.ignoreEvasion = true;
		},
		id: "keeneye",
		name: "Keen Eye",
		rating: 1,
		num: 51,
	},
	"klutz": {
		desc: "This Pokemon's held item has no effect. This Pokemon cannot use Fling successfully. Macho Brace, Power Anklet, Power Band, Power Belt, Power Bracer, Power Lens, and Power Weight still have their effects.",
		shortDesc: "This Pokemon's held item has no effect, except Macho Brace. Fling cannot be used.",
		// Item suppression implemented in BattlePokemon.ignoringItem() within battle-engine.js
		id: "klutz",
		name: "Klutz",
		rating: -1,
		num: 103,
	},
	"leafguard": {
		desc: "If Sunny Day is active, this Pokemon cannot gain a major status condition and Rest will fail for it.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.",
		onSetStatus: function (status, target, source, effect) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				if (effect && effect.status) this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
				return false;
			}
		},
		onTryAddVolatile: function (status, target) {
			if (status.id === 'yawn' && this.isWeather(['sunnyday', 'desolateland'])) {
				this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
				return null;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 1,
		num: 102,
	},
	"levitate": {
		desc: "This Pokemon is immune to Ground. Gravity, Ingrain, Smack Down, Thousand Arrows, and Iron Ball nullify the immunity.",
		shortDesc: "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it.",
		// airborneness implemented in battle-engine.js:BattlePokemon#isGrounded
		id: "levitate",
		name: "Levitate",
		rating: 3.5,
		num: 26,
	},
	"lightmetal": {
		shortDesc: "This Pokemon's weight is halved.",
		onModifyWeight: function (weight) {
			return weight / 2;
		},
		id: "lightmetal",
		name: "Light Metal",
		rating: 1,
		num: 135,
	},
	"lightningrod": {
		desc: "This Pokemon is immune to Electric-type moves and raises its Special Attack by 1 stage when hit by an Electric-type move. If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Electric moves to itself to raise Sp. Atk by 1; Electric immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spa:1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Electric' || move.id in {firepledge:1, grasspledge:1, waterpledge:1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
				}
				return this.effectData.target;
			}
		},
		id: "lightningrod",
		name: "Lightning Rod",
		rating: 3.5,
		num: 32,
	},
	"limber": {
		shortDesc: "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Limber');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'par') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Limber');
			return false;
		},
		id: "limber",
		name: "Limber",
		rating: 1.5,
		num: 7,
	},
	"liquidooze": {
		shortDesc: "This Pokemon damages those draining HP from it for as much as they would heal.",
		id: "liquidooze",
		onSourceTryHeal: function (damage, target, source, effect) {
			this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
			let canOoze = {drain: 1, leechseed: 1};
			if (canOoze[effect.id]) {
				this.damage(damage, null, null, null, true);
				return 0;
			}
		},
		name: "Liquid Ooze",
		rating: 1.5,
		num: 64,
	},
	"liquidvoice": {
		desc: "This Pokemon's sound-based moves become Water-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Water type.",
		onModifyMovePriority: -1,
		onModifyMove: function (move) {
			if (move.flags['sound']) {
				move.type = 'Water';
			}
		},
		id: "liquidvoice",
		name: "Liquid Voice",
		rating: 2.5,
		num: 204,
	},
	"longreach": {
		shortDesc: "This Pokemon's attacks do not make contact with the target.",
		onModifyMove: function (move) {
			delete move.flags['contact'];
		},
		id: "longreach",
		name: "Long Reach",
		rating: 1.5,
		num: 203,
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
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, this.effectData.target, source);
			return null;
		},
		effect: {
			duration: 1,
		},
		rating: 4.5,
		num: 156,
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
		num: 98,
	},
	"magician": {
		desc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack. Does not affect Doom Desire and Future Sight.",
		shortDesc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack.",
		onSourceHit: function (target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status') {
				if (source.item || source.volatiles['gem'] || source.volatiles['fling']) return;
				let yourItem = target.takeItem(source);
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
		num: 170,
	},
	"magmaarmor": {
		shortDesc: "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.cureStatus();
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'frz') return false;
		},
		id: "magmaarmor",
		name: "Magma Armor",
		rating: 0.5,
		num: 40,
	},
	"magnetpull": {
		desc: "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent Steel-type foes from choosing to switch.",
		onFoeTrapPokemon: function (pokemon) {
			if (pokemon.hasType('Steel') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType('Steel')) && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "magnetpull",
		name: "Magnet Pull",
		rating: 4.5,
		num: 42,
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
		num: 63,
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
		num: 178,
	},
	"merciless": {
		shortDesc: "This Pokemon's attacks are critical hits if the target is poisoned.",
		onModifyCritRatio: function (critRatio, source, target) {
			if (target && target.status in {'psn':1, 'tox':1}) return 5;
		},
		id: "merciless",
		name: "Merciless",
		rating: 2,
		num: 196,
	},
	"minus": {
		desc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "minus",
		name: "Minus",
		rating: 0,
		num: 58,
	},
	"mistysurge": {
		shortDesc: "On switch-in, this Pokemon summons Misty Terrain.",
		onStart: function (source) {
			this.setTerrain('mistyterrain');
		},
		id: "mistysurge",
		name: "Misty Surge",
		rating: 4,
		num: 228,
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
		num: 104,
	},
	"moody": {
		desc: "This Pokemon has a random stat raised by 2 stages and another stat lowered by 1 stage at the end of each turn.",
		shortDesc: "Raises a random stat by 2 and lowers another stat by 1 at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let stats = [];
			let boost = {};
			for (let statPlus in pokemon.boosts) {
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = 2;

			stats = [];
			for (let statMinus in pokemon.boosts) {
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost);
		},
		id: "moody",
		name: "Moody",
		rating: 5,
		num: 141,
	},
	"motordrive": {
		desc: "This Pokemon is immune to Electric-type moves and raises its Speed by 1 stage when hit by an Electric-type move.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by an Electric move; Electric immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spe:1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Motor Drive');
				}
				return null;
			}
		},
		id: "motordrive",
		name: "Motor Drive",
		rating: 3,
		num: 78,
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
		num: 153,
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
		num: 136,
	},
	"multitype": {
		shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate or Z-Crystal.",
		// Multitype's type-changing itself is implemented in statuses.js
		id: "multitype",
		name: "Multitype",
		rating: 4,
		num: 121,
	},
	"mummy": {
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect the Abilities Multitype or Stance Change.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		id: "mummy",
		name: "Mummy",
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				let oldAbility = source.setAbility('mummy', source, 'mummy', true);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.getAbility(oldAbility).name, '[of] ' + source);
				}
			}
		},
		rating: 2,
		num: 152,
	},
	"naturalcure": {
		shortDesc: "This Pokemon has its major status condition cured when it switches out.",
		onCheckShow: function (pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;

			let active = pokemon.side.active;
			let cureList = [];
			let noCureCount = 0;
			for (let i = 0; i < active.length; i++) {
				let curPoke = active[i];
				// pokemon not statused
				if (!curPoke || !curPoke.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				let template = Tools.getTemplate(curPoke.species);
				// pokemon can't get Natural Cure
				if (Object.values(template.abilities).indexOf('Natural Cure') < 0) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!template.abilities['1'] && !template.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}

				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}

			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured

				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', "(" + cureList.length + " of " + pokemon.side.name + "'s pokemon " + (cureList.length === 1 ? "was" : "were") + " cured by Natural Cure.)");

				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = false;
				}
			}
		},
		onSwitchOut: function (pokemon) {
			if (!pokemon.status) return;

			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;

			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.setStatus('');

			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) delete pokemon.showCure;
		},
		id: "naturalcure",
		name: "Natural Cure",
		rating: 3.5,
		num: 30,
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
		num: 99,
	},
	"normalize": {
		desc: "This Pokemon's moves are changed to be Normal type and have their power multiplied by 1.2. This effect comes before other effects that change a move's type.",
		shortDesc: "This Pokemon's moves are changed to be Normal type and have 1.2x power.",
		onModifyMovePriority: 1,
		onModifyMove: function (move, pokemon) {
			if (!move.isZ && move.id !== 'struggle' && this.getMove(move.id).type !== 'Normal') {
				move.type = 'Normal';
			}
			if (move.category !== 'Status') pokemon.addVolatile('normalize');
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "normalize",
		name: "Normalize",
		rating: -1,
		num: 96,
	},
	"oblivious": {
		desc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability while affected cures it.",
		shortDesc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit: function (pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Oblivious');
				return null;
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 1,
		num: 12,
	},
	"overcoat": {
		shortDesc: "This Pokemon is immune to powder moves and damage from Sandstorm or Hail.",
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (move.flags['powder'] && target !== source && this.getImmunity('powder', target)) {
				this.add('-immune', target, '[msg]', '[from] ability: Overcoat');
				return null;
			}
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 2.5,
		num: 142,
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
		num: 65,
	},
	"owntempo": {
		shortDesc: "This Pokemon cannot be confused. Gaining this Ability while confused cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Own Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile: function (status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit: function (target, source, move) {
			if (move && move.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
			}
		},
		id: "owntempo",
		name: "Own Tempo",
		rating: 1,
		num: 20,
	},
	"parentalbond": {
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage quartered. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage quartered.",
		onPrepareHit: function (source, target, move) {
			if (move.id in {iceball: 1, rollout: 1}) return;
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit && !move.isZ) {
				move.multihit = 2;
				source.addVolatile('parentalbond');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower) {
				if (this.effectData.hit) {
					this.effectData.hit++;
					return this.chainModify(0.25);
				} else {
					this.effectData.hit = 1;
				}
			},
			onSourceModifySecondaries: function (secondaries, target, source, move) {
				if (move.id === 'secretpower' && this.effectData.hit < 2) {
					// hack to prevent accidentally suppressing King's Rock/Razor Fang
					return secondaries.filter(effect => effect.volatileStatus === 'flinch');
				}
			},
		},
		id: "parentalbond",
		name: "Parental Bond",
		rating: 5,
		num: 184,
	},
	"pickup": {
		shortDesc: "If this Pokemon has no item, it finds one used by an adjacent Pokemon this turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.item) return;
			let pickupTargets = [];
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (let i = 0; i < allActives.length; i++) {
				let target = allActives[i];
				if (target.lastItem && target.usedItemThisTurn && this.isAdjacent(pokemon, target)) {
					pickupTargets.push(target);
				}
			}
			if (!pickupTargets.length) return;
			let randomTarget = pickupTargets[this.random(pickupTargets.length)];
			pokemon.setItem(randomTarget.lastItem);
			randomTarget.lastItem = '';
			let item = pokemon.getItem();
			this.add('-item', pokemon, item, '[from] ability: Pickup');
		},
		id: "pickup",
		name: "Pickup",
		rating: 0.5,
		num: 53,
	},
	"pickpocket": {
		desc: "If this Pokemon has no item, it steals the item off a Pokemon that makes contact with it. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "If this Pokemon has no item, it steals the item off a Pokemon making contact with it.",
		onAfterMoveSecondary: function (target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				if (target.item) {
					return;
				}
				let yourItem = source.takeItem(target);
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
		num: 124,
	},
	"pixilate": {
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Fairy';
				if (move.category !== 'Status') pokemon.addVolatile('pixilate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "pixilate",
		name: "Pixilate",
		rating: 4,
		num: 182,
	},
	"plus": {
		desc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "plus",
		name: "Plus",
		rating: 0,
		num: 57,
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
		num: 90,
	},
	"poisonpoint": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be poisoned.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('psn', target);
				}
			}
		},
		id: "poisonpoint",
		name: "Poison Point",
		rating: 2,
		num: 38,
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
				status: 'psn',
				ability: this.getAbility('poisontouch'),
			});
		},
		id: "poisontouch",
		name: "Poison Touch",
		rating: 2,
		num: 143,
	},
	"powerconstruct": {
		desc: "If this Pokemon is a Zygarde in its 10% or 50% Forme, it changes to Complete Forme when it has 1/2 or less of its maximum HP at the end of the turn.",
		shortDesc: "If Zygarde 10%/50%, changes to Complete if at 1/2 max HP or less at end of turn.",
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Zygarde' || pokemon.transformed) return;
			if (pokemon.template.speciesid === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-message', "You sense the presence of many! (placeholder)");
			this.add('-activate', pokemon, 'ability: Power Construct');
			let template = this.getTemplate('Zygarde-Complete');
			pokemon.formeChange(template);
			pokemon.baseTemplate = template;
			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);
			this.add('-message', "" + pokemon.name + " transformed into its Complete Forme! (placeholder)");
			pokemon.setAbility(template.abilities['0']);
			pokemon.baseAbility = pokemon.ability;
			let newHP = Math.floor(Math.floor(2 * pokemon.template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		id: "powerconstruct",
		name: "Power Construct",
		rating: 4,
		num: 211,
	},
	"powerofalchemy": {
		desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "This Pokemon copies the Ability of an ally that faints.",
		onAllyFaint: function (target) {
			if (!this.effectData.target.hp) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, wonderguard:1, zenmode:1};
			if (bannedAbilities[target.ability]) return;
			this.add('-ability', this.effectData.target, ability, '[from] ability: Power of Alchemy', '[of] ' + target);
			this.effectData.target.setAbility(ability);
		},
		id: "powerofalchemy",
		name: "Power of Alchemy",
		rating: 0,
		num: 223,
	},
	"prankster": {
		shortDesc: "This Pokemon's Status moves have priority raised by 1, but Dark types are immune.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
		onModifyMove: function (move) {
			if (move && move.category === 'Status') {
				move.pranksterBoosted = true;
			}
		},
		id: "prankster",
		name: "Prankster",
		rating: 4.5,
		num: 158,
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
		num: 46,
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
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
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
		num: 189,
	},
	"prismarmor": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Prism Armor neutralize');
				return this.chainModify(0.75);
			}
		},
		isUnbreakable: true,
		id: "prismarmor",
		name: "Prism Armor",
		rating: 3,
		num: 232,
	},
	"protean": {
		desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type.",
		shortDesc: "This Pokemon's type changes to match the type of the move it is about to use.",
		onPrepareHit: function (source, target, move) {
			if (move.hasBounced) return;
			let type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] Protean');
			}
		},
		id: "protean",
		name: "Protean",
		rating: 4,
		num: 168,
	},
	"psychicsurge": {
		shortDesc: "On switch-in, this Pokemon summons Psychic Terrain.",
		onStart: function (source) {
			this.setTerrain('psychicterrain');
		},
		id: "psychicsurge",
		name: "Psychic Surge",
		rating: 4,
		num: 227,
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
		num: 74,
	},
	"queenlymajesty": {
		desc: "While this Pokemon is active, priority moves from opposing Pokemon targeted at allies are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, allies are protected from opposing priority moves.",
		onFoeTryMove: function (target, source, effect) {
			if (source.side === this.effectData.target.side && effect.priority > 0.1 && effect.target !== 'self') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Queenly Majesty', effect, '[of] ' + target);
				return false;
			}
		},
		id: "queenlymajesty",
		name: "Queenly Majesty",
		rating: 3.5,
		num: 214,
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
		num: 95,
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
		num: 44,
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
		num: 155,
	},
	"receiver": {
		desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "This Pokemon copies the Ability of an ally that faints.",
		onAllyFaint: function (target) {
			if (!this.effectData.target.hp) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, wonderguard:1, zenmode:1};
			if (bannedAbilities[target.ability]) return;
			this.add('-ability', this.effectData.target, ability, '[from] ability: Receiver', '[of] ' + target);
			this.effectData.target.setAbility(ability);
		},
		id: "receiver",
		name: "Receiver",
		rating: 0,
		num: 222,
	},
	"reckless": {
		desc: "This Pokemon's attacks with recoil or crash damage have their power multiplied by 1.2. Does not affect Struggle.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage have 1.2x power; not Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		id: "reckless",
		name: "Reckless",
		rating: 3,
		num: 120,
	},
	"refrigerate": {
		desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Ice';
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			},
		},
		id: "refrigerate",
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	"regenerator": {
		shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.",
		onSwitchOut: function (pokemon) {
			pokemon.heal(pokemon.maxhp / 3);
		},
		id: "regenerator",
		name: "Regenerator",
		rating: 4,
		num: 144,
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
		num: 79,
	},
	"rkssystem": {
		shortDesc: "If this Pokemon is a Silvally, its type changes to match its held Memory.",
		// RKS System's type-changing itself is implemented in statuses.js
		id: "rkssystem",
		name: "RKS System",
		rating: 4,
		num: 225,
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
		num: 69,
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
		num: 24,
	},
	"runaway": {
		shortDesc: "No competitive use.",
		id: "runaway",
		name: "Run Away",
		rating: 0,
		num: 50,
	},
	"sandforce": {
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 1.3x in Sandstorm; immunity to it.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandforce",
		name: "Sand Force",
		rating: 2,
		num: 159,
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
		num: 146,
	},
	"sandstream": {
		shortDesc: "On switch-in, this Pokemon summons Sandstorm.",
		onStart: function (source) {
			this.setWeather('sandstorm');
		},
		id: "sandstream",
		name: "Sand Stream",
		rating: 4.5,
		num: 45,
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
		num: 8,
	},
	"sapsipper": {
		desc: "This Pokemon is immune to Grass-type moves and raises its Attack by 1 stage when hit by a Grass-type move.",
		shortDesc: "This Pokemon's Attack is raised 1 stage if hit by a Grass move; Grass immunity.",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({atk:1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Sipper');
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
		num: 157,
	},
	"schooling": {
		desc: "On switch-in, if this Pokemon is a Wishiwashi that is level 20 or above and has more than 1/4 of its maximum HP left, it changes to School Form. If it is in School Form and its HP drops to 1/4 of its maximum HP or less, it changes to Solo Form at the end of the turn. If it is in Solo Form and its HP is greater than 1/4 its maximum HP at the end of the turn, it changes to School Form.",
		shortDesc: "If user is Wishiwashi, changes to School Form if it has > 1/4 max HP, else Solo Form.",
		onStart: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		id: "schooling",
		name: "Schooling",
		rating: 2.5,
		num: 208,
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
		num: 113,
	},
	"serenegrace": {
		shortDesc: "This Pokemon's moves have their secondary effect chance doubled.",
		onModifyMovePriority: -2,
		onModifyMove: function (move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
		id: "serenegrace",
		name: "Serene Grace",
		rating: 4,
		num: 32,
	},
	"shadowshield": {
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Shadow Shield weaken');
				return this.chainModify(0.5);
			}
		},
		isUnbreakable: true,
		id: "shadowshield",
		name: "Shadow Shield",
		rating: 4,
		num: 231,
	},
	"shadowtag": {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or also have this Ability.",
		shortDesc: "Prevents adjacent foes from choosing to switch unless they also have this Ability.",
		onFoeTrapPokemon: function (pokemon) {
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
		num: 23,
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
		num: 61,
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
				return this.chainModify([0x14CD, 0x1000]);
			},
		},
		id: "sheerforce",
		name: "Sheer Force",
		rating: 4,
		num: 125,
	},
	"shellarmor": {
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
		onCriticalHit: false,
		id: "shellarmor",
		name: "Shell Armor",
		rating: 1,
		num: 75,
	},
	"shielddust": {
		shortDesc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack.",
		onModifySecondaries: function (secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		id: "shielddust",
		name: "Shield Dust",
		rating: 2.5,
		num: 19,
	},
	"shieldsdown": {
		desc: "If this Pokemon is a Minior, it changes to its Core forme if it has 1/2 or less of its maximum HP at the end of a turn. If Minior's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Meteor Form.",
		shortDesc: "If Minior, at end of turn changes forme to Core if at 1/2 max HP or less, else Meteor.",
		onStart: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Minior' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.template.speciesid === 'minior') {
					pokemon.formeChange('Minior-Meteor');
					this.add('-formechange', pokemon, 'Minior-Meteor', '[msg]', '[from] ability: Shields Down');
				}
			} else {
				if (pokemon.template.speciesid !== 'minior') {
					pokemon.formeChange('Minior');
					this.add('-formechange', pokemon, 'Minior', '[msg]', '[from] ability: Shields Down');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Minior' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.template.speciesid === 'minior') {
					pokemon.formeChange('Minior-Meteor');
					this.add('-formechange', pokemon, 'Minior-Meteor', '[msg]', '[from] ability: Shields Down');
				}
			} else {
				if (pokemon.template.speciesid !== 'minior') {
					pokemon.formeChange('Minior');
					this.add('-formechange', pokemon, 'Minior', '[msg]', '[from] ability: Shields Down');
				}
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (target.template.speciesid !== 'miniormeteor' || target.transformed) return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Shields Down');
			return false;
		},
		id: "shieldsdown",
		name: "Shields Down",
		rating: 2.5,
		num: 197,
	},
	"simple": {
		shortDesc: "If this Pokemon's stat stages are raised or lowered, the effect is doubled instead.",
		onBoost: function (boost) {
			for (let i in boost) {
				boost[i] *= 2;
			}
		},
		id: "simple",
		name: "Simple",
		rating: 4,
		num: 86,
	},
	"skilllink": {
		shortDesc: "This Pokemon's multi-hit attacks always hit the maximum number of times.",
		onModifyMove: function (move) {
			if (move.multihit && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		id: "skilllink",
		name: "Skill Link",
		rating: 4,
		num: 92,
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
				this.add('-start', target, 'ability: Slow Start');
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
			},
		},
		id: "slowstart",
		name: "Slow Start",
		rating: -2,
		num: 112,
	},
	"slushrush": {
		desc: "If Hail is active, this Pokemon's Speed is doubled. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon's Speed is doubled; immunity to Hail.",
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		id: "slushrush",
		name: "Slush Rush",
		rating: 2.5,
		num: 202,
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
		num: 97,
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
		num: 81,
	},
	"snowwarning": {
		shortDesc: "On switch-in, this Pokemon summons Hail.",
		onStart: function (source) {
			this.setWeather('hail');
		},
		id: "snowwarning",
		name: "Snow Warning",
		rating: 4,
		num: 117,
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
				this.damage(target.maxhp / 8, target, target);
			}
		},
		id: "solarpower",
		name: "Solar Power",
		rating: 1.5,
		num: 94,
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
		num: 116,
	},
	"soulheart": {
		desc: "This Pokemon's Special Attack is raised by 1 stage when another Pokemon faints.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 stage when another Pokemon faints.",
		onAnyFaint: function () {
			this.boost({spa:1}, this.effectData.target);
		},
		id: "soulheart",
		name: "Soul-Heart",
		rating: 3.5,
		num: 220,
	},
	"soundproof": {
		shortDesc: "This Pokemon is immune to sound-based moves, including Heal Bell.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.flags['sound']) {
				this.add('-immune', target, '[msg]', '[from] ability: Soundproof');
				return null;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', this.effectData.target, '[msg]', '[from] ability: Soundproof');
			}
		},
		id: "soundproof",
		name: "Soundproof",
		rating: 2,
		num: 43,
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
		num: 3,
	},
	"stakeout": {
		shortDesc: "This Pokemon's attacks deal double damage if the target switched in this turn.",
		onModifyDamage: function (damage, source, target) {
			if (!target.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		id: "stakeout",
		name: "Stakeout",
		rating: 2.5,
		num: 198,
	},
	"stall": {
		shortDesc: "This Pokemon moves last among Pokemon using the same or greater priority moves.",
		onModifyPriority: function (priority) {
			return Math.round(priority) - 0.1;
		},
		id: "stall",
		name: "Stall",
		rating: -1,
		num: 100,
	},
	"stamina": {
		shortDesc: "This Pokemon's Defense is raised by 1 stage after it is damaged by a move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({def:1});
			}
		},
		id: "stamina",
		name: "Stamina",
		rating: 1.5,
		num: 192,
	},
	"stancechange": {
		desc: "If this Pokemon is an Aegislash, it changes to Blade Forme before attempting to use an attacking move, and changes to Shield Forme before attempting to use King's Shield.",
		shortDesc: "If Aegislash, changes Forme to Blade before attacks and Shield before King's Shield.",
		onBeforeMovePriority: 11,
		onBeforeMove: function (attacker, defender, move) {
			if (attacker.template.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			let targetSpecies = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.template.species !== targetSpecies && attacker.formeChange(targetSpecies)) {
				this.add('-formechange', attacker, targetSpecies, '[from] ability: Stance Change');
			}
		},
		id: "stancechange",
		name: "Stance Change",
		rating: 5,
		num: 176,
	},
	"static": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be paralyzed.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('par', target);
				}
			}
		},
		id: "static",
		name: "Static",
		rating: 2,
		num: 9,
	},
	"steadfast": {
		shortDesc: "If this Pokemon flinches, its Speed is raised by 1 stage.",
		onFlinch: function (pokemon) {
			this.boost({spe: 1});
		},
		id: "steadfast",
		name: "Steadfast",
		rating: 1,
		num: 80,
	},
	"steelworker": {
		shortDesc: "This Pokemon's Steel-type attacks have their power multiplied by 1.5.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		id: "steelworker",
		name: "Steelworker",
		rating: 3,
		num: 200,
	},
	"stench": {
		shortDesc: "This Pokemon's attacks without a chance to flinch have a 10% chance to flinch.",
		onModifyMove: function (move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (let i = 0; i < move.secondaries.length; i++) {
					if (move.secondaries[i].volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		id: "stench",
		name: "Stench",
		rating: 0.5,
		num: 1,
	},
	"stickyhold": {
		shortDesc: "This Pokemon cannot lose its held item due to another Pokemon's attack.",
		onTakeItem: function (item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon || !pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		id: "stickyhold",
		name: "Sticky Hold",
		rating: 1.5,
		num: 60,
	},
	"stormdrain": {
		desc: "This Pokemon is immune to Water-type moves and raises its Special Attack by 1 stage when hit by a Water-type move. If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Water moves to itself to raise Sp. Atk by 1; Water immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa:1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Water' || move.id in {firepledge:1, grasspledge:1, waterpledge:1}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Storm Drain');
				}
				return this.effectData.target;
			}
		},
		id: "stormdrain",
		name: "Storm Drain",
		rating: 3.5,
		num: 114,
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
		num: 173,
	},
	"sturdy": {
		desc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. OHKO moves fail when used against this Pokemon.",
		shortDesc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. Immune to OHKO.",
		onTryHit: function (pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
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
		num: 5,
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
		num: 21,
	},
	"superluck": {
		shortDesc: "This Pokemon's critical hit ratio is raised by 1 stage.",
		onModifyCritRatio: function (critRatio) {
			return critRatio + 1;
		},
		id: "superluck",
		name: "Super Luck",
		rating: 1.5,
		num: 105,
	},
	"surgesurfer": {
		shortDesc: "If Electric Terrain is active, this Pokemon's Speed is doubled.",
		onModifySpe: function (spe) {
			if (this.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		id: "surgesurfer",
		name: "Surge Surfer",
		rating: 2,
		num: 207,
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
		num: 68,
	},
	"sweetveil": {
		shortDesc: "This Pokemon and its allies cannot fall asleep.",
		id: "sweetveil",
		name: "Sweet Veil",
		onAllySetStatus: function (status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				return null;
			}
		},
		onAllyTryAddVolatile: function (status, target) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				return null;
			}
		},
		rating: 2,
		num: 175,
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
		num: 33,
	},
	"symbiosis": {
		desc: "If an ally uses its item, this Pokemon gives its item to that ally immediately. Does not activate if the ally's item was stolen or knocked off.",
		shortDesc: "If an ally uses its item, this Pokemon gives its item to that ally immediately.",
		onAllyAfterUseItem: function (item, pokemon) {
			let sourceItem = this.effectData.target.getItem();
			let noSharing = sourceItem.onTakeItem && sourceItem.onTakeItem(sourceItem, pokemon) === false;
			if (!sourceItem || noSharing) {
				return;
			}
			sourceItem = this.effectData.target.takeItem();
			if (!sourceItem) {
				return;
			}
			if (pokemon.setItem(sourceItem)) {
				this.add('-activate', this.effectData.target, 'ability: Symbiosis', sourceItem, '[of] ' + pokemon);
			}
		},
		id: "symbiosis",
		name: "Symbiosis",
		rating: 0,
		num: 180,
	},
	"synchronize": {
		desc: "If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon, that Pokemon receives the same major status condition.",
		shortDesc: "If another Pokemon burns/poisons/paralyzes this Pokemon, it also gets that status.",
		onAfterSetStatus: function (status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz') return;
			this.add('-activate', target, 'ability: Synchronize');
			source.trySetStatus(status, target, {status: status.id, id: 'synchronize'});
		},
		id: "synchronize",
		name: "Synchronize",
		rating: 2.5,
		num: 28,
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
		num: 77,
	},
	"tanglinghair": {
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Tangling Hair');
				this.boost({spe: -1}, source, target, null, null, true);
			}
		},
		id: "tanglinghair",
		name: "Tangling Hair",
		rating: 2.5,
		num: 221,
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
		num: 101,
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
		num: 140,
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
		num: 164,
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
		num: 47,
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
		num: 110,
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
		num: 67,
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
		num: 137,
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
		num: 181,
	},
	"trace": {
		desc: "On switch-in, this Pokemon copies a random adjacent opposing Pokemon's Ability. If there is no Ability that can be copied at that time, this Ability will activate as soon as an Ability can be copied. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, and Zen Mode.",
		shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
		onUpdate: function (pokemon) {
			let possibleTargets = [];
			for (let i = 0; i < pokemon.side.foe.active.length; i++) {
				if (pokemon.side.foe.active[i] && !pokemon.side.foe.active[i].fainted) possibleTargets.push(pokemon.side.foe.active[i]);
			}
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				let ability = this.getAbility(target.ability);
				let bannedAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, zenmode:1};
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
		num: 36,
	},
	"triage": {
		shortDesc: "This Pokemon's healing moves have their priority increased by 3.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.flags['heal']) return priority + 3;
		},
		id: "triage",
		name: "Triage",
		rating: 3.5,
		num: 205,
	},
	"truant": {
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onBeforeMovePriority: 9,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant', pokemon, 'ability: Truant');
				return false;
			}
			pokemon.addVolatile('truant');
		},
		effect: {
			duration: 2,
		},
		id: "truant",
		name: "Truant",
		rating: -2,
		num: 54,
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
		num: 163,
	},
	"unaware": {
		desc: "This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
		id: "unaware",
		name: "Unaware",
		onAnyModifyBoost: function (boosts, target) {
			let source = this.effectData.target;
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
		num: 109,
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
			},
		},
		id: "unburden",
		name: "Unburden",
		rating: 3.5,
		num: 84,
	},
	"unnerve": {
		shortDesc: "While this Pokemon is active, it prevents opposing Pokemon from using their Berries.",
		onPreStart: function (pokemon) {
			this.add('-ability', pokemon, 'Unnerve', pokemon.side.foe);
		},
		onFoeTryEatItem: false,
		id: "unnerve",
		name: "Unnerve",
		rating: 1.5,
		num: 127,
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
		num: 162,
	},
	"vitalspirit": {
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Vital Spirit');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Vital Spirit');
			return false;
		},
		id: "vitalspirit",
		name: "Vital Spirit",
		rating: 2,
		num: 72,
	},
	"voltabsorb": {
		desc: "This Pokemon is immune to Electric-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Electric-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Electric moves; Electric immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
		id: "voltabsorb",
		name: "Volt Absorb",
		rating: 3.5,
		num: 10,
	},
	"waterabsorb": {
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				return null;
			}
		},
		id: "waterabsorb",
		name: "Water Absorb",
		rating: 3.5,
		num: 11,
	},
	"waterbubble": {
		desc: "This Pokemon's Water-type attacks have their power doubled, the power of Fire-type attacks against this Pokemon is halved, and this Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.",
		onBasePowerPriority: 7,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onUpdate: function (pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Bubble');
			return false;
		},
		id: "waterbubble",
		name: "Water Bubble",
		rating: 3.5,
		num: 199,
	},
	"watercompaction": {
		shortDesc: "This Pokemon's Defense is raised 2 stages after it is damaged by a Water-type move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.type === 'Water') {
				this.boost({def:2});
			}
		},
		id: "watercompaction",
		name: "Water Compaction",
		rating: 2,
		num: 195,
	},
	"waterveil": {
		shortDesc: "This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Veil');
			return false;
		},
		id: "waterveil",
		name: "Water Veil",
		rating: 2,
		num: 41,
	},
	"weakarmor": {
		desc: "If a physical attack hits this Pokemon, its Defense is lowered by 1 stage and its Speed is raised by 2 stages.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 2.",
		onAfterDamage: function (damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({def:-1, spe:2});
			}
		},
		id: "weakarmor",
		name: "Weak Armor",
		rating: 1,
		num: 133,
	},
	"whitesmoke": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
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
		num: 73,
	},
	"wimpout": {
		shortDesc: "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				source.switchFlag = false;
				this.add('-activate', target, 'ability: Wimp Out');
			}
		},
		id: "wimpout",
		name: "Wimp Out",
		rating: 2,
		num: 193,
	},
	"wonderguard": {
		shortDesc: "This Pokemon can only be damaged by supereffective moves and indirect damage.",
		onTryHit: function (target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-immune', target, '[msg]', '[from] ability: Wonder Guard');
				return null;
			}
		},
		id: "wonderguard",
		name: "Wonder Guard",
		rating: 5,
		num: 25,
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
		num: 147,
	},
	"zenmode": {
		desc: "If this Pokemon is a Darmanitan, it changes to Zen Mode if it has 1/2 or less of its maximum HP at the end of a turn. If Darmanitan's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Standard Mode. If Darmanitan loses this Ability while in Zen Mode it reverts to Standard Mode immediately.",
		shortDesc: "If Darmanitan, at end of turn changes Mode to Standard if > 1/2 max HP, else Zen.",
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitan') {
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitanzen') {
				pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
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
				if (pokemon.template.speciesid === 'darmanitanzen' || !pokemon.formeChange('Darmanitan-Zen')) return;
				this.add('-formechange', pokemon, 'Darmanitan-Zen', '[from] ability: Zen Mode');
			},
			onEnd: function (pokemon) {
				if (!pokemon.formeChange('Darmanitan')) return;
				this.add('-formechange', pokemon, 'Darmanitan', '[from] ability: Zen Mode');
			},
		},
		id: "zenmode",
		name: "Zen Mode",
		rating: -1,
		num: 161,
	},

	// CAP
	"mountaineer": {
		shortDesc: "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.",
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit: function (target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[msg]', '[from] ability: Mountaineer');
				return null;
			}
		},
		id: "mountaineer",
		isNonstandard: true,
		name: "Mountaineer",
		rating: 3.5,
		num: -2,
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
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide: function (target, source, move) {
			if (this.effectData.target.activeTurns) return;

			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, this.effectData.target, source);
			return null;
		},
		effect: {
			duration: 1,
		},
		rating: 3.5,
		num: -3,
	},
	"persistent": {
		shortDesc: "The duration of certain field effects is increased by 2 turns if used by this Pokemon.",
		id: "persistent",
		isNonstandard: true,
		name: "Persistent",
		// implemented in the corresponding move
		rating: 3.5,
		num: -4,
	},
};
