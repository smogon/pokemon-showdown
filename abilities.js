/*

Ratings and how they work:

-2: Extremely detrimental
	  The sort of ability that relegates Pokemon with Uber-level BSTs
	  into NU.
	ex. Slow Start, Truant

-1: Detrimental
	  An ability that does more harm than good.
	ex. Defeatist, Klutz

 0: Useless
	  An ability with no net effect on a Pokemon during a battle.
	ex. Pickup, Illuminate

 1: Ineffective
	  An ability that has a minimal effect. Should never be chosen over
	  any other ability.
	ex. Pressure, Damp

 2: Situationally useful
	  An ability that can be useful in certain situations.
	ex. Blaze, Insomnia

 3: Useful
	  An ability that is generally useful.
	ex. Volt Absorb, Iron Fist

 4: Very useful
	  One of the most popular abilities. The difference between 3 and 4
	  can be ambiguous.
	ex. Technician, Intimidate

 5: Essential
	  The sort of ability that defines metagames.
	ex. Drizzle, Magnet Pull

*/

exports.BattleAbilities = {
	"adaptability": {
		desc: "This Pokemon's attacks that receive STAB (Same Type Attack Bonus) are increased from 50% to 100%.",
		shortDesc: "The Pokemon's STAB modifier becomes x2.",
		onModifyMove: function(move) {
			move.stab = 2;
		},
		id: "adaptability",
		name: "Adaptability",
		rating: 3.5,
		num: "91"
	},
	"aftermath": {
		desc: "If a contact move knocks out this Pokemon, the opponent receives damage equal to one-fourth of its max HP.",
		shortDesc: "Deals 25% damage when KOed by contact damage.",
		id: "aftermath",
		name: "Aftermath",
		onFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.isContact && source) {
				this.damage(source.maxhp/4, source, target);
			}
		},
		rating: 3,
		num: "106"
	},
	"airlock": {
		desc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		shortDesc: "Blocks the effects of weather.",
		onAnyModifyPokemon: function(pokemon) {
			pokemon.ignore['WeatherTarget'] = true;
		},
		id: "airlock",
		name: "Air Lock",
		rating: 3,
		num: "76"
	},
	"analytic": {
		desc: "If the user moves last, the power of that move is increased by 30%.",
		shortDesc: "Raises the power of all moves by 30% if the Pokemon moves last.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (!this.willMove(defender)) {
				this.debug('Analytic boost');
				return basePower * 1.3;
			}
		},
		id: "analytic",
		name: "Analytic",
		rating: 1,
		num: "??"
	},
	"angerpoint": {
		desc: "If this Pokemon, or its Substitute, is struck by a Critical Hit, its Attack is boosted to six stages.",
		shortDesc: "Raises Attack to +6 (4x) if struck by a critical hit.",
		onCriticalHit: function(target) {
			if (!target.volatiles['substitute']) {
				target.setBoost({atk: 6});
				this.add('-setboost',target,'atk',12,'[from] ability: Anger Point');
			}
		},
		id: "angerpoint",
		name: "Anger Point",
		rating: 2,
		num: "83"
	},
	"anticipation": {
		desc: "A warning is displayed if an opposing Pokemon has the moves Fissure, Guillotine, Horn Drill, Sheer Cold, or any attacking move from a type that is considered super effective against this Pokemon (including Counter, Mirror Coat, and Metal Burst). Hidden Power, Judgment, Natural Gift and Weather Ball are considered Normal-type moves.",
		shortDesc: "Alerts the Pokemon to super-effective or otherwise dangerous moves.",
		onStart: function(pokemon) {
			var targets = pokemon.side.foe.active;
			for (var i=0; i<targets.length; i++) {
				for (var j=0; j<targets[i].moveset.length; j++) {
					var move = this.getMove(targets[i].moveset[j].move);
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') continue;
					if (move.category !== 'Status' && this.getEffectiveness(move.type, pokemon) > 0 || move.ohko) {
						this.add('-message', pokemon.name+' shuddered! (placeholder)');
						return;
					}
				}
			}
		},
		id: "anticipation",
		name: "Anticipation",
		rating: 1,
		num: "107"
	},
	"arenatrap": {
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they are part Flying-type, have the Levitate ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn. Flying-type and Levitate Pokemon cannot escape if they are holding Iron Ball or Gravity is in effect. Levitate Pokemon also cannot escape if their ability is disabled through other means, such as Skill Swap or Gastro Acid.",
		shortDesc: "Prevents foe from switching unless it is immune to Ground.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.runImmunity('Ground', false)) {
				pokemon.trapped = true;
			}
		},
		id: "arenatrap",
		name: "Arena Trap",
		rating: 5,
		num: "71"
	},
	"baddreams": {
		desc: "If asleep, each of this Pokemon's opponents receives damage equal to one-eighth of its max HP.",
		shortDesc: "Deals 12.5% damage to sleeping opponents per turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			for (var i=0; i<pokemon.side.foe.active.length; i++) {
				var target = pokemon.side.foe.active[i];
				if (target.status === 'slp') {
					this.damage(target.maxhp/8, target);
				}
			}
		},
		id: "baddreams",
		name: "Bad Dreams",
		rating: 2,
		num: "123"
	},
	"battlearmor": {
		desc: "Critical Hits cannot strike this Pokemon.",
		shortDesc: "Prevents critical hits.",
		onCriticalHit: false,
		id: "battlearmor",
		name: "Battle Armor",
		rating: 1,
		num: "4"
	},
	"bigpecks": {
		desc: "Prevents the Pokemon's Defense stat from being reduced.",
		shortDesc: "Prevents the enemy from lowering this Pokemon's Defense.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0) {
				boost['def'] = 0;
			}
		},
		id: "bigpecks",
		name: "Big Pecks",
		rating: 1,
		num: "145"
	},
	"blaze": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Fire-type attacks receive a 50% boost in power.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp/3) {
				this.debug('Blaze boost');
				return basePower * 1.5;
			}
		},
		id: "blaze",
		name: "Blaze",
		rating: 2,
		num: "66"
	},
	"chlorophyll": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its speed is temporarily doubled.",
		onModifyStats: function(stats) {
			if (this.weather === 'sunnyday') {
				stats.spe *= 2;
			}
		},
		id: "chlorophyll",
		name: "Chlorophyll",
		rating: 3.5,
		num: "34"
	},
	"clearbody": {
		desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
				}
			}
		},
		id: "clearbody",
		name: "Clear Body",
		rating: 2,
		num: "29"
	},
	"cloudnine": {
		desc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		onAnyModifyPokemon: function(pokemon) {
			pokemon.ignore['WeatherTarget'] = true;
		},
		id: "cloudnine",
		name: "Cloud Nine",
		rating: 3,
		num: "13"
	},
	"colorchange": {
		desc: "This Pokemon's type changes according to the type of the last move that hit this Pokemon.",
		onAfterMoveSecondary: function(target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.category !== 'Status') {
				target.addVolatile('colorchange', source, effect);
			}
		},
		effect: {
			onStart: function(target, source, effect) {
				this.effectData.type = 'Normal';
				if (effect && effect.type && effect.type !== 'Normal') {
					this.add('-start', target, 'typechange', effect.type, '[from] Color Change');
					this.effectData.type = effect.type;
				} else {
					return false;
				}
			},
			onRestart: function(target, source, effect) {
				if (effect && effect.type && effect.type !== this.effectData.type) {
					this.add('-start', target, 'typechange', effect.type, '[from] Color Change');
					this.effectData.type = effect.type;
				}
			},
			onModifyPokemon: function(target) {
				if (!this.effectData.type) this.effectData.type = 'Normal';
				target.types = [this.effectData.type];
			}
		},
		id: "colorchange",
		name: "Color Change",
		rating: 2,
		num: "16"
	},
	"compoundeyes": {
		desc: "The accuracy of this Pokemon's moves receives a 30% increase; for example, a 75% accurate move becomes 97.5% accurate.",
		onModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			move.accuracy *= 1.3;
		},
		id: "compoundeyes",
		name: "Compoundeyes",
		rating: 3.5,
		num: "14"
	},
	"contrary": {
		desc: "Stat changes are inverted.",
		onBoost: function(boost) {
			for (var i in boost) {
				boost[i] *= -1;
			}
		},
		id: "contrary",
		name: "Contrary",
		rating: 4,
		num: "126"
	},
	"cursedbody": {
		desc: "30% chance of disabling one of the opponent's moves when attacked. This works even if the attacker is behind a Substitute, but will not activate if the Pokemon with Cursed Body is behind a Substitute.",
		id: "cursedbody",
		name: "Cursed Body",
		rating: 2,
		num: "130"
	},
	"cutecharm": {
		desc: "If an opponent of the opposite gender directly attacks this Pokemon, there is a 30% chance that the opponent will become Attracted to this Pokemon.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (Math.random() * 10 < 3) {
					if (source.addVolatile('attract', target)) {
						this.add('-start', source, 'Attract', '[from] Cute Charm', '[of] '+target);
					}
				}
			}
		},
		id: "cutecharm",
		name: "Cute Charm",
		rating: 2,
		num: "56"
	},
	"damp": {
		desc: "While this Pokemon is active, no Pokemon on the field can use Selfdestruct or Explosion.",
		id: "damp",
		onAnyTryHit: function(target, source, effect) {
			if (effect.id === 'selfdestruct' || effect.id === 'explosion') {
				return false;
			}
		},
		onAnyDamage: function(damage, target, source, effect) {
			if (effect && effect.id === 'aftermath') {
				return false;
			}
		},
		name: "Damp",
		rating: 1,
		num: "6"
	},
	"defeatist": {
		desc: "Attack and Special Attack are halved when HP is less than half.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.hp < pokemon.maxhp/2) {
				stats.atk /= 2;
				stats.spa /= 2;
			}
		},
		onResidual: function(pokemon) {
			pokemon.update();
		},
		id: "defeatist",
		name: "Defeatist",
		rating: -1,
		num: "129"
	},
	"defiant": {
		desc: "Raises the user's Attack stat by two stages when a stat is lowered, including the Attack stat. This does not include self-induced stat drops like those from Close Combat.",
		onAfterEachBoost: function(boost, target, source) {
			if (!source || target === source) {
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
		num: "128"
	},
	"download": {
		desc: "If this Pokemon switches into an opponent with equal Defenses or higher Defense than Special Defense, this Pokemon's Special Attack receives a 50% boost. If this Pokemon switches into an opponent with higher Special Defense than Defense, this Pokemon's Attack receive a 50% boost.",
		onStart: function (pokemon) {
			var foeactive = pokemon.side.foe.active;
			var totaldef = 0;
			var totalspd = 0;
			for (var i=0; i<foeactive.length; i++) {
				if (!foeactive[i]) continue;
				totaldef += foeactive[i].stats.def;
				totalspd += foeactive[i].stats.spd;
			}
			if (totaldef >= totalspd) {
				this.boost({spa:1});
			} else {
				this.boost({atk:1});
			}
		},
		id: "download",
		name: "Download",
		rating: 4,
		num: "88"
	},
	"drizzle": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Rain Dance that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('raindance');
			this.weatherData.duration = 0;
		},
		id: "drizzle",
		name: "Drizzle",
		rating: 5,
		num: "2"
	},
	"drought": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Sunny Day that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('sunnyday');
			this.weatherData.duration = 0;
		},
		id: "drought",
		name: "Drought",
		rating: 5,
		num: "70"
	},
	"dryskin": {
		desc: "This Pokemon absorbs Water attacks and gains a weakness to Fire attacks. If Sunny Day is in effect, this Pokemon takes damage. If Rain Dance is in effect, this Pokemon recovers health.",
		onImmunity: function(type, pokemon) {
			if (type === 'Water') {
				this.heal(pokemon.maxhp/4);
				return null;
			}
		},
		onFoeBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return basePower * 5/4;
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'raindance') {
				this.heal(target.maxhp/8);
			} else if (effect.id === 'sunnyday') {
				this.damage(target.maxhp/8);
			}
		},
		id: "dryskin",
		name: "Dry Skin",
		rating: 3,
		num: "87"
	},
	"earlybird": {
		desc: "This Pokemon will remain asleep for half as long as it normally would; this includes both opponent-induced sleep and user-induced sleep via Rest.",
		id: "earlybird",
		name: "Early Bird",
		isHalfSleep: true,
		rating: 2.5,
		num: "48"
	},
	"effectspore": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become either poisoned, paralyzed or put to sleep. There is an equal chance to inflict each status.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				var r = Math.random() * 10;
				if (r < 3) {
					if (r < 1) {
						source.trySetStatus('psn', target, move);
					} else if (r < 2) {
						source.trySetStatus('par', target, move);
					} else {
						source.trySetStatus('slp', target, move);
					}
				}
			}
		},
		id: "effectspore",
		name: "Effect Spore",
		rating: 2,
		num: "27"
	},
	"filter": {
		desc: "This Pokemon receives one-fourth reduced damage from Super Effective attacks.",
		onFoeBasePower: function(basePower, attacker, defender, move) {
			if (this.getEffectiveness(move.type, defender) > 0) {
				this.debug('Filter neutralize');
				return basePower * 3/4;
			}
		},
		id: "filter",
		name: "Filter",
		rating: 3,
		num: "111"
	},
	"flamebody": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become burned.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (Math.random() * 10 < 3) {
					source.trySetStatus('brn', target, move);
				}
			}
		},
		id: "flamebody",
		name: "Flame Body",
		rating: 2,
		num: "49"
	},
	"flareboost": {
		desc: "When the user with this ability is burned, its Special Attack is raised by 50%.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status === 'brn') {
				stats.spa *= 1.5;
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 3,
		num: "138"
	},
	"flashfire": {
		desc: "This Pokemon is immune to all Fire-type attacks; additionally, its own Fire-type attacks receive a 50% boost if a Fire-type move hits this Pokemon. Multiple boosts do not occur if this Pokemon is hit with multiple Fire-type attacks.",
		onImmunity: function(type, pokemon) {
			if (type === 'Fire') {
				pokemon.addVolatile('flashfire');
				return null;
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(target) {
				this.add('-start',target,'ability: Flash Fire');
			},
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return basePower * 1.5;
				}
			}
		},
		id: "flashfire",
		name: "Flash Fire",
		rating: 3,
		num: "18"
	},
	"flowergift": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its Attack and Special Defense stats (as well as its partner's stats in double battles) receive a 50% boost.",
		onStart: function(pokemon) {
			delete this.effectData.forme;
		},
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'sunnyday') {
				stats.atk *= 1.5;
				stats.spd *= 1.5;
				if (pokemon.isActive && pokemon.speciesid === 'cherrim' && this.effectData.forme !== 'Sunny') {
					this.effectData.forme = 'Sunny';
					this.add('-formechange', pokemon, 'Cherrim-Sunny');
				}
			} else if (pokemon.isActive && pokemon.speciesid === 'cherrim' && this.effectData.forme) {
				delete this.effectData.forme;
				this.add('-formechange', pokemon, 'Cherrim');
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 3,
		num: "122"
	},
	"forecast": {
		desc: "This Pokemon's type changes according to the current weather conditions: it becomes Fire-type during Sunny Day, Water-type during Rain Dance, Ice-type during Hail and remains its regular type otherwise.",
		onStart: function(pokemon) {
			delete this.effectData.forme;
		},
		onModifyPokemon: function(pokemon) {
			if (pokemon.species !== 'Castform') return;
			if (this.weather === 'sunnyday') {
				pokemon.types = ['Fire'];
			} else if (this.weather === 'raindance') {
				pokemon.types = ['Water'];
			} else if (this.weather === 'hail') {
				pokemon.types = ['Ice'];
			}
			if (pokemon.isActive && (this.effectData.forme||'Normal') != pokemon.types[0]) {
				this.effectData.forme = pokemon.types[0];
				if (pokemon.types[0] === 'Normal') {
					delete this.effectData.forme;
					this.add('-formechange', pokemon, 'Castform');
				} else {
					this.add('-formechange', pokemon, 'Castform-'+this.effectData.forme);
				}
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 4,
		num: "59"
	},
	"forewarn": {
		desc: "The move with the highest Base Power in the opponent's moveset is revealed.",
		onStart: function(pokemon) {
			var targets = pokemon.side.foe.active;
			var warnMoves = [];
			var warnBp = 1;
			for (var i=0; i<targets.length; i++) {
				for (var j=0; j<targets[i].moveset.length; j++) {
					var move = this.getMove(targets[i].moveset[j].move);
					var bp = move.basePower;
					if (move.ohko) bp = 160;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, targets[i]]];
						warnBp = bp;
					} else if (bp == warnBp) {
						warnMoves.push([move, targets[i]]);
					}
				}
			}
			if (!warnMoves.length) return;
			var warnMove = warnMoves[Math.floor(Math.random()*warnMoves.length)];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove);
		},
		id: "forewarn",
		name: "Forewarn",
		rating: 1,
		num: "108"
	},
	"friendguard": {
		desc: "Reduces the damage received from an ally in a double or triple battle.",
		id: "friendguard",
		name: "Friend Guard",
		rating: 0,
		num: "132"
	},
	"frisk": {
		desc: "When this Pokemon enters the field, it identifies the opponent's held item; in double battles, the held item of an unrevealed, randomly selected opponent is identified.",
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] '+pokemon);
		},
		id: "frisk",
		name: "Frisk",
		rating: 1.5,
		num: "119"
	},
	"gluttony": {
		desc: "This Pokemon consumes its held berry when its health reaches 50% max HP or lower.",
		id: "gluttony",
		name: "Gluttony",
		rating: 1.5,
		num: "82"
	},
	"guts": {
		desc: "When this Pokemon is poisoned (including Toxic), burned, paralyzed or asleep (including self-induced Rest), its Attack stat receives a 50% boost; the burn status' Attack drop is also ignored.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status) {
				stats.atk *= 1.5;
			}
		},
		id: "guts",
		name: "Guts",
		rating: 4,
		num: "62"
	},
	"harvest": {
			desc: "When the user uses a held Berry, it is restored at the end of the turn.",
			id: "harvest",
			name: "Harvest",
			onResidualOrder: 26,
			onResidualSubOrder: 1,
			onResidual: function(pokemon) {
				if ((this.weather === 'sunnyday') || (Math.random() * 2 < 1)) {
					if (!pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
							pokemon.setItem(pokemon.lastItem);
							this.add("-item", pokemon, pokemon.item, '[from] ability: Harvest');
					}
				}
		},
		rating: 4,
		num: "139"
	},
	"healer": {
		desc: "Has a 30% chance of curing an adjacent ally's status ailment at the end of each turn in Double and Triple Battles.",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		rating: 0,
		num: "131"
	},
	"heatproof": {
		desc: "This Pokemon receives half damage from both Fire-type attacks and residual burn damage.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return basePower / 2;
			}
		},
		onDamage: function(damage, attacker, defender, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 2;
			}
		},
		id: "heatproof",
		name: "Heatproof",
		rating: 2.5,
		num: "85"
	},
	"heavymetal": {
		desc: "The user's weight is doubled. This increases user's base power of Heavy Slam and Heat Crash, as well as damage taken from the opponent's Low Kick and Grass Knot, due to these moves being calculated by the target's weight.",
		onModifyPokemon: function(pokemon) {
			pokemon.weightkg *= 2;
		},
		id: "heavymetal",
		name: "Heavy Metal",
		rating: 0,
		num: "134"
	},
	"honeygather": {
		desc: "If it is not already holding an item, this Pokemon may find and be holding Honey after a battle.",
		id: "honeygather",
		name: "Honey Gather",
		rating: 0,
		num: "118"
	},
	"hugepower": {
		desc: "This Pokemon's Attack stat is doubled. Therefore, if this Pokemon's Attack stat on the status screen is 200, it effectively has an Attack stat of 400; which is then subject to the full range of stat boosts and reductions.",
		onModifyStats: function(stats) {
			stats.atk *= 2;
		},
		id: "hugepower",
		name: "Huge Power",
		rating: 5,
		num: "37"
	},
	"hustle": {
		desc: "This Pokemon's Attack receives a 50% boost but its Physical attacks receive a 20% drop in Accuracy. For example, a 100% accurate move would become an 80% accurate move. The accuracy of moves that never miss, such as Aerial Ace, remains unaffected.",
		onModifyStats: function(stats) {
			stats.atk *= 1.5;
		},
		onModifyMove: function(move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number') {
				move.accuracy *= 0.8;
			}
		},
		id: "hustle",
		name: "Hustle",
		rating: 3,
		num: "55"
	},
	"hydration": {
		desc: "If this Pokemon is active while Rain Dance is in effect, it recovers from poison, paralysis, burn, sleep and freeze at the end of the turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.status && this.weather === 'raindance') {
				this.debug('hydration');
				pokemon.cureStatus();
			}
		},
		id: "hydration",
		name: "Hydration",
		rating: 4,
		num: "93"
	},
	"hypercutter": {
		desc: "Opponents cannot reduce this Pokemon's Attack stat; they can, however, modify stat changes with Power Swap or Heart Swap and inflict a stat boost with Swagger. This ability does not prevent self-inflicted stat reductions.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				boost['atk'] = 0;
			}
		},
		id: "hypercutter",
		name: "Hyper Cutter",
		rating: 2,
		num: "52"
	},
	"icebody": {
		desc: "If active while Hail is in effect, this Pokemon recovers one-sixteenth of its max HP after each turn. If a non-Ice-type Pokemon receives this ability through Skill Swap, Role Play or the Trace ability, it will not take damage from Hail.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp/16);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		id: "icebody",
		name: "Ice Body",
		rating: 3,
		num: "115"
	},
	"illuminate": {
		desc: "When this Pokemon is in the first slot of the player's party, it doubles the rate of wild encounters.",
		id: "illuminate",
		name: "Illuminate",
		rating: 0,
		num: "35"
	},
	"illusion": {
		desc: "Illusion will change the appearance of the Pokemon to a different species. This is dependent on the last Pokemon in the player's party. Along with the species itself, Illusion is broken when the user is damaged, but is not broken by Substitute, weather conditions, status ailments, or entry hazards. Illusion will replicate the type of Poke Ball, the species name, and the gender of the Pokemon it is masquerading as.",
		onModifyPokemon: function(pokemon) {
			if (!pokemon.volatiles['illusion']) {
				for (i=pokemon.side.pokemon.length-1; i>pokemon.position; i--) {
					if (!pokemon.side.pokemon[i]) continue;
					if (!pokemon.side.pokemon[i].fainted) break;
				}
				pokemon.illusion = pokemon.side.pokemon[i];
			}
		},
		onDamage: function(damage, pokemon, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.debug('illusion cleared');
				//pokemon.addVolatile('illusion');
				pokemon.setAbility('');
				pokemon.illusion = null;
				this.add('replace', pokemon, pokemon.getDetails());
			}
		},
		id: "illusion",
		name: "Illusion",
		rating: 4.5,
		num: "149"
	},
	"immunity": {
		desc: "This Pokemon cannot become poisoned nor Toxic poisoned.",
		onImmunity: function(type) {
			if (type === 'psn') return false;
		},
		id: "immunity",
		name: "Immunity",
		rating: 1,
		num: "17"
	},
	"imposter": {
		desc: "As soon as the user comes into battle, it Transforms into its opponent, copying the opponent's stats exactly, with the exception of HP. Imposter copies all stat changes on the target originating from moves and abilities such as Swords Dance and Intimidate, but not from items such as Choice Specs. Imposter will not Transform the user if the opponent is an Illusion or if the opponent is behind a Substitute.",
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			if (pokemon.transformInto(target)) {
				this.add('-transform', pokemon, target);
			}
		},
		id: "imposter",
		name: "Imposter",
		rating: 5,
		num: "150"
	},
	"infiltrator": {
		desc: "Ignores Reflect, Light Screen and Safeguard under effect on the target.",
		// Implemented in the corresponding effects.
		id: "infiltrator",
		name: "Infiltrator",
		rating: 1,
		num: "151"
	},
	"innerfocus": {
		desc: "This Pokemon cannot be made to flinch.",
		onFlinch: false,
		id: "innerfocus",
		name: "Inner Focus",
		rating: 1,
		num: "39"
	},
	"insomnia": {
		desc: "This Pokemon cannot be put to sleep; this includes both opponent-induced sleep as well as user-induced sleep via Rest.",
		onImmunity: function(type, pokemon) {
			if (type === 'slp') return false;
		},
		id: "insomnia",
		name: "Insomnia",
		rating: 2,
		num: "15"
	},
	"intimidate": {
		desc: "When this Pokemon enters the field, the Attack stat of each of its opponents lowers by one stage.",
		onStart: function(pokemon) {
			var foeactive = pokemon.side.foe.active;
			for (var i=0; i<foeactive.length; i++) {
				if (!foeactive[i]) continue;
				if (foeactive[i].volatiles['substitute']) {
					// does it give a message?
					this.add('-start',foeactive[i],'substitute','[block] ability: Intimidate','[of] '+pokemon);
				} else {
					this.add('-ability',pokemon,'Intimidate','[of] '+foeactive[i]);
					this.boost({atk: -1}, foeactive[i], pokemon);
				}
			}
		},
		id: "intimidate",
		name: "Intimidate",
		rating: 4,
		num: "22"
	},
	"ironbarbs": {
		desc: "All moves that make contact with the Pokemon with Iron Barbs will damage the user by 1/8 of their maximum HP after damage is dealt.",
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				this.damage(source.maxhp/8, source, target);
			}
		},
		id: "ironbarbs",
		name: "Iron Barbs",
		rating: 3,
		num: "160"
	},
	"ironfist": {
		desc: "This Pokemon receives a 20% power boost for the following attacks: Bullet Punch, Comet Punch, Dizzy Punch, Drain Punch, Dynamicpunch, Fire Punch, Focus Punch, Hammer Arm, Ice Punch, Mach Punch, Mega Punch, Meteor Mash, Shadow Punch, Sky Uppercut, and Thunderpunch. Sucker Punch, which is known Ambush in Japan, is not boosted.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.isPunchAttack) {
				this.debug('Iron Fist boost');
				return basePower * 12/10;
			}
		},
		id: "ironfist",
		name: "Iron Fist",
		rating: 3,
		num: "89"
	},
	"justified": {
		desc: "Will raise the user's Attack stat one level when hit by any Dark-type moves. Unlike other abilities with immunity to certain typed moves, the user will still receive damage from the attack. Justified will raise Attack one level for each hit of a multi-hit move like Beat Up.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.type === 'Dark') {
				this.boost({atk:1});
			}
		},
		id: "justified",
		name: "Justified",
		rating: 2,
		num: "154"
	},
	"keeneye": {
		desc: "This Pokemon's Accuracy cannot be lowered.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0) {
				boost['accuracy'] = 0;
			}
		},
		id: "keeneye",
		name: "Keen Eye",
		rating: 1,
		num: "51"
	},
	"klutz": {
		desc: "This Pokemon ignores both the positive and negative effects of its held item, other than the speed-halving effects of Iron Ball.",
		onModifyPokemon: function(pokemon) {
			pokemon.ignore['Item'] = true;
		},
		id: "klutz",
		name: "Klutz",
		rating: 1.5,
		num: "103"
	},
	"leafguard": {
		desc: "If this Pokemon is active while Sunny Day is in effect, it cannot become poisoned, burned, paralyzed or put to sleep (other than user-induced Rest). Leaf Guard does not heal status effects that existed before Sunny Day came into effect.",
		onSetStatus: function(pokemon) {
			if (this.weather === 'sunnyday') {
				this.debug('interrupting setstatus');
				return false;
			}
		},
		onTryHit: function(target, source, move) {
			if (this.weather === 'sunnyday' && move && move.id === 'yawn') {
				this.debug('blocking yawn');
				return false;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 3,
		num: "102"
	},
	"levitate": {
		desc: "This Pokemon is immune to Ground-type attacks, Spikes, Toxic Spikes and the Arena Trap ability; it loses these immunities while holding Iron Ball, after using Ingrain or if Gravity is in effect.",
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		id: "levitate",
		name: "Levitate",
		rating: 3.5,
		num: "26"
	},
	"lightmetal": {
		desc: "The user's weight is halved. This decreases the damage taken from Low Kick and Grass Knot, and also lowers user's base power of Heavy Slam and Heat Crash, due these moves being calculated by the target and user's weight.",
		onModifyPokemon: function(pokemon) {
			pokemon.weightkg /= 2;
		},
		id: "lightmetal",
		name: "Light Metal",
		rating: 1,
		num: "135"
	},
	"lightningrod": {
		desc: "During double battles, this Pokemon draws any single-target Electric-type attack to itself. If an opponent uses an Electric-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Electric Hidden Power or Judgment. The user is immune to Electric and its Special Attack is increased one stage when hit by one.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric') {
				this.boost({spa:1});
				return null;
			}
		},
		id: "lightningrod",
		name: "Lightningrod",
		rating: 3,
		num: "32"
	},
	"limber": {
		desc: "This Pokemon cannot become paralyzed.",
		onImmunity: function(type, pokemon) {
			if (type === 'par') return false;
		},
		id: "limber",
		name: "Limber",
		rating: 2,
		num: "7"
	},
	"liquidooze": {
		desc: "When another Pokemon uses Absorb, Drain Punch, Dream Eater, Giga Drain, Leech Life, Leech Seed or Mega Drain against this Pokemon, the attacking Pokemon loses the amount of health that it would have gained.",
		id: "liquidooze",
		onSourceTryHeal: function(damage, target, source, effect) {
			this.debug("Heal is occurring: "+target+" <- "+source+" :: "+effect.id);
			var canOoze = {drain: 1, leechseed: 1};
			if (canOoze[effect.id]) {
				this.damage(damage);
				return 0;
			}
		},
		name: "Liquid Ooze",
		rating: 1,
		num: "64"
	},
	"magicbounce": {
		desc: "Non-damaging moves are reflected back at the user.",
		id: "magicbounce",
		name: "Magic Bounce",
		onAllyTryFieldHit: function(target, source, move) {
			if (target === source) return;
			if (typeof move.isBounceable === 'undefined') {
					move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
			}
			if (move.target !== 'foeSide' && target !== this.effectData.target) {
				return;
			}
			if (move.hasBounced) {
				return;
			}
			if (move.isBounceable) {
				var newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.add('-activate', target, 'ability: Magic Bounce', newMove, '[of] '+source);
				this.moveHit(source, target, newMove);
				return null;
			}
		},
		effect: {
			duration: 1
		},
		rating: 5,
		num: "156"
	},
	"magicguard": {
		desc: "Prevents all damage except from direct attacks.",
		onDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		id: "magicguard",
		name: "Magic Guard",
		rating: 4.5,
		num: "98"
	},
	"magmaarmor": {
		desc: "This Pokemon cannot become frozen.",
		onImmunity: function(type, pokemon) {
			if (type === 'frz') return false;
		},
		id: "magmaarmor",
		name: "Magma Armor",
		rating: 0.5,
		num: "40"
	},
	"magnetpull": {
		desc: "When this Pokemon enters the field, Steel-type opponents cannot switch out nor flee the battle unless they are holding Shed Shell or use the attacks U-Turn or Baton Pass.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.hasType('Steel')) {
				pokemon.trapped = true;
			}
		},
		id: "magnetpull",
		name: "Magnet Pull",
		rating: 5,
		num: "42"
	},
	"marvelscale": {
		desc: "When this Pokemon becomes burned, poisoned (including Toxic), paralyzed, frozen or put to sleep (including self-induced sleep via Rest), its Defense receives a 50% boost.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status) {
				stats.def *= 1.5;
			}
		},
		id: "marvelscale",
		name: "Marvel Scale",
		rating: 3,
		num: "63"
	},
	"minus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if its partner has the Plus ability.",
		id: "minus",
		name: "Minus",
		rating: 0,
		num: "58"
	},
	"moldbreaker": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Herbivore, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		onAllyModifyPokemonPriority: 100,
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemonPriority: 100,
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "moldbreaker",
		name: "Mold Breaker",
		rating: 3,
		num: "104"
	},
	"moody": {
		desc: "Causes the Pokemon to raise one of its stats by two stages, while another stat is lowered by one stage at the end of each turn. These stats include accuracy and evasion.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			var stats = [], i = '';
			var boost = {};
			for (var i in pokemon.boosts) {
				if (pokemon.boosts[i] < 6) {
					stats.push(i);
				}
			}
			if (stats.length) {
				i = stats[parseInt(Math.random()*stats.length)];
				boost[i] = 2;
			}
			stats = [];
			for (var j in pokemon.boosts) {
				if (pokemon.boosts[j] > -6 && j !== i) {
					stats.push(j);
				}
			}
			if (stats.length) {
				i = stats[parseInt(Math.random()*stats.length)];
				boost[i] = -1;
			}
			this.boost(boost);
		},
		id: "moody",
		name: "Moody",
		rating: 5,
		num: "141"
	},
	"motordrive": {
		desc: "This Pokemon is immune to all Electric-type attacks, including Thunder Wave, and if an Electric-type attack hits this Pokemon, it receives a one-level Speed boost.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric') {
				this.boost({spe:1});
				return null;
			}
		},
		id: "motordrive",
		name: "Motor Drive",
		rating: 3,
		num: "78"
	},
	"moxie": {
		desc: "When a Pokemon with Moxie faints another Pokemon, its Attack rises by one stage.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk:1}, source);
			}
		},
		id: "moxie",
		name: "Moxie",
		rating: 4,
		num: "153"
	},
	"multiscale": {
		desc: "Lowers damage taken by half when at maximum HP.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (defender.hp >= defender.maxhp) {
				this.debug('Multiscale weaken');
				return basePower/2;
			}
		},
		id: "multiscale",
		name: "Multiscale",
		rating: 4,
		num: "136"
	},
	"multitype": {
		desc: "This Pokemon changes its type to match its corresponding held Plate; this ability only works for Arceus, prevents the removal of Arceus' held item and cannot be Skill Swapped, Role Played or Traced.",
		onModifyPokemon: function(pokemon) {
			if (pokemon.baseTemplate.species !== 'Arceus') {
				return;
			}
			var type = this.runEvent('Plate', pokemon);
			if (type && type !== true) {
				pokemon.types = [type];
			}
		},
		onTakeItem: function(item) {
			if (item.onPlate) return false;
		},
		id: "multitype",
		name: "Multitype",
		rating: 5,
		num: "121"
	},
	"mummy": {
		desc: "When the user is attacked by a contact move, the opposing Pokemon's ability is turned into Mummy as well. Multitype, Wonder Guard and Mummy itself are the only abilities not affected by Mummy. The effect of Mummy is not removed by Mold Breaker, Turboblaze, or Teravolt.",
		id: "mummy",
		name: "Mummy",
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				if (source.setAbility('mummy')) {
					this.add('-ability', source, 'Mummy', '[from] Mummy');
				}
			}
		},
		rating: 1,
		num: "152"
	},
	"naturalcure": {
		desc: "When this Pokemon switches out of battle, it is cured of poison (including Toxic), paralysis, burn, freeze and sleep (including self-induced Rest).",
		onSwitchOut: function(pokemon) {
			pokemon.setStatus('');
		},
		id: "naturalcure",
		name: "Natural Cure",
		rating: 4,
		num: "30"
	},
	"noguard": {
		desc: "Every attack used by or against this Pokemon will always hit.",
		onModifyMove: function(move) {
			move.accuracy = true;
			move.alwaysHit = true;
		},
		onSourceModifyMove: function(move) {
			move.accuracy = true;
			move.alwaysHit = true;
		},
		id: "noguard",
		name: "No Guard",
		rating: 4.1,
		num: "99"
	},
	"normalize": {
		desc: "Makes all of this Pokemon's attacks Normal-typed.",
		onModifyMove: function(move) {
			move.type = 'Normal';
		},
		id: "normalize",
		name: "Normalize",
		rating: -1,
		num: "96"
	},
	"oblivious": {
		desc: "This Pokemon cannot become attracted to another Pokemon.",
		onImmunity: function(type, pokemon) {
			if (type === 'attract') {
				this.add('-immune', pokemon, '[from] Oblivious');
				return false;
			}
		},
		onTryHit: function(pokemon, target, move) {
			if (move.id === 'captivate') {
				this.add('-immune', pokemon, '[msg]', '[from] Oblivious');
				return null;
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 0.5,
		num: "12"
	},
	"overcoat": {
		desc: "In battle, the Pokemon does not take damage from weather conditions like Sandstorm or Hail.",
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail') return false;
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 1,
		num: "142"
	},
	"overgrow": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Grass-type attacks receive a 50% boost in power.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp/3) {
				this.debug('Overgrow boost');
				return basePower * 1.5;
			}
		},
		id: "overgrow",
		name: "Overgrow",
		rating: 2,
		num: "65"
	},
	"owntempo": {
		desc: "This Pokemon cannot become confused.",
		onImmunity: function(type, pokemon) {
			if (type === 'confusion') {
				this.add('-immune', pokemon, 'confusion');
				return false;
			}
		},
		id: "owntempo",
		name: "Own Tempo",
		rating: 1,
		num: "20"
	},
	"pickup": {
		desc: "If an opponent uses a consumable item, Pickup will give the Pokemon the item used, if it is not holding an item. If multiple Pickup Pokemon are in play, one will pick up a copy of the used Berry, and may or may not use it immediately. Works on Berries, Gems, Absorb Bulb, Focus Sash, Herbs, Cell Battery, Red Card, and anything that is thrown with Fling.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			var foe = pokemon.side.foe.randomActive();
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
		num: "53"
	},
	"pickpocket": {
		desc: "Steals attacking Pokemon's held item on contact.",
		onAfterDamage: function(damage, target, source, move) {
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
		num: "124"
	},
	"plus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if its partner has the Minus ability.",
		id: "plus",
		name: "Plus",
		rating: 0,
		num: "57"
	},
	"poisonheal": {
		desc: "If this Pokemon becomes poisoned or Toxic Poisoned, it will recover one-eighth of its max HP after each turn.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.maxhp/8);
				return false;
			}
		},
		id: "poisonheal",
		name: "Poison Heal",
		rating: 4,
		num: "90"
	},
	"poisonpoint": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become poisoned.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (Math.random() * 10 < 3) {
					source.trySetStatus('psn', target, move);
				}
			}
		},
		id: "poisonpoint",
		name: "Poison Point",
		rating: 2,
		num: "38"
	},
	"poisontouch": {
		desc: "The contact-based attacks from a Pokemon with Poison Touch have a 30% chance of poisoning the target.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function(move) {
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
		num: "143"
	},
	"prankster": {
		desc: "Increases the priority of non-damaging moves by 1.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
			return priority;
		},
		id: "prankster",
		name: "Prankster",
		rating: 4,
		num: "158"
	},
	"pressure": {
		desc: "When an opponent uses a move that affects this Pokemon, an additional PP is required for the opponent to use that move.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onSourceDeductPP: function(pp, target, source) {
			if (target === source) return;
			return pp+1;
		},
		id: "pressure",
		name: "Pressure",
		rating: 1,
		num: "46"
	},
	"purepower": {
		desc: "This Pokemon's Attack stat is doubled. Therefore, if this Pokemon's Attack stat on the status screen is 200, it effectively has an Attack stat of 400; which is then subject to the full range of stat boosts and reductions.",
		onModifyStats: function(stats) {
			stats.atk *= 2;
		},
		id: "purepower",
		name: "Pure Power",
		rating: 5,
		num: "74"
	},
	"quickfeet": {
		desc: "When this Pokemon is poisoned (including Toxic), burned, paralyzed, asleep (including self-induced Rest) or frozen, its Speed stat receives a 50% boost; the paralysis status' Speed drop is also ignored.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status) {
				stats.spe *= 1.5;
			}
		},
		id: "quickfeet",
		name: "Quick Feet",
		rating: 3,
		num: "95"
	},
	"raindish": {
		desc: "If active while Rain Dance is in effect, this Pokemon recovers one-sixteenth of its max HP after each turn.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'raindance') {
				this.heal(target.maxhp/16);
			}
		},
		id: "raindish",
		name: "Rain Dish",
		rating: 3,
		num: "44"
	},
	"rattled": {
		desc: "Raises the user's Speed one stage when hit by a Dark-, Bug-, or Ghost-type move.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({spe:1});
			}
		},
		id: "rattled",
		name: "Rattled",
		rating: 2,
		num: "155"
	},
	"reckless": {
		desc: "When this Pokemon uses an attack that causes recoil damage, or an attack that has a chance to cause recoil damage such as Jump Kick and Hi Jump Kick, the attacks's power receives a 20% boost.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return basePower * 12/10;
			}
		},
		id: "reckless",
		name: "Reckless",
		rating: 3,
		num: "120"
	},
	"regenerator": {
		desc: "Causes the user to restore HP by 1/3 of its maximum when switching out.",
		onSwitchOut: function(pokemon) {
			pokemon.heal(pokemon.maxhp/3);
		},
		id: "regenerator",
		name: "Regenerator",
		rating: 4.5,
		num: "144"
	},
	"rivalry": {
		desc: "Increases base power of Physical and Special attacks by 25% if the opponent is the same gender, but decreases base power by 25% if opponent is the opposite gender.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return basePower * 5/4;
				} else {
					this.debug('Rivalry weaken');
					return basePower * 3/4;
				}
			}
		},
		id: "rivalry",
		name: "Rivalry",
		rating: 2.5,
		num: "79"
	},
	"rockhead": {
		desc: "This Pokemon does not receive recoil damage unless it uses Struggle, it misses with Jump Kick or Hi Jump Kick or it is holding Life Orb, Jaboca Berry or Rowap Berry.",
		onModifyMove: function(move) {
			delete move.recoil;
		},
		id: "rockhead",
		name: "Rock Head",
		rating: 3.5,
		num: "69"
	},
	"roughskin": {
		desc: "Causes recoil damage equal to 1/8 of the opponent's max HP if an opponent directly attacks.",
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				this.damage(source.maxhp/8, source, target);
			}
		},
		id: "roughskin",
		name: "Rough Skin",
		rating: 3,
		num: "24"
	},
	"runaway": {
		desc: "Unless this Pokemon is under the effects of a trapping move or ability, such as Mean Look or Shadow Tag, it will escape from wild Pokemon battles without fail.",
		id: "runaway",
		name: "Run Away",
		rating: 0,
		num: "50"
	},
	"sandforce": {
		desc: "Raises the power of Rock, Ground, and Steel-type moves by 30% while a Sandstorm is in effect. It also gives the user immunity to damage from Sandstorm.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.weather === 'sandstorm') {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return basePower * 13/10;
				}
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandforce",
		name: "Sand Force",
		rating: 3,
		num: "159"
	},
	"sandrush": {
		desc: "Doubles Speed in a Sandstorm, and makes the Pokemon immune to Sandstorm damage.",
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'sandstorm') {
				stats.spe *= 2;
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandrush",
		name: "Sand Rush",
		rating: 3.5,
		num: "146"
	},
	"sandstream": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Sandstorm that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('sandstorm');
			this.weatherData.duration = 0;
		},
		id: "sandstream",
		name: "Sand Stream",
		rating: 5,
		num: "45"
	},
	"sandveil": {
		desc: "If active while Sandstorm is in effect, this Pokemon's Evasion receives a 20% boost; if this Pokemon has a typing that would normally take damage from Sandstorm, this Pokemon is also immune to Sandstorm's damage.",
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onSourceModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			if (this.weather === 'sandstorm') {
				this.debug('sand veil - decreasing accuracy');
				move.accuracy *= 0.8;
			}
		},
		id: "sandveil",
		name: "Sand Veil",
		rating: 3,
		num: "8"
	},
	"sapsipper": {
		desc: "When a Pokemon with Sap Sipper is hit with a Grass-type attack, its attack is increased by one level, and the move itself has no effect. If hit by a multi-hit attack like Bullet Seed, it will increase attack by one stage for each hit. The only Grass-type move that will not activate Sap Sipper is Aromatherapy.",
		onImmunity: function(type, pokemon) {
			if (type === 'Grass') {
				this.boost({atk:1});
				return null;
			}
		},
		id: "sapsipper",
		name: "Sap Sipper",
		rating: 3,
		num: "157"
	},
	"scrappy": {
		desc: "This Pokemon has the ability to hit Ghost-type Pokemon with Normal-type and Fighting-type moves. Effectiveness of these moves takes into account the Ghost-type Pokemon's other weaknesses and resistances.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.hasType('Ghost')) {
				pokemon.negateImmunity['Normal'] = true;
				pokemon.negateImmunity['Fighting'] = true;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: "113"
	},
	"serenegrace": {
		desc: "The side effects of this Pokemon's attack occur twice as often. For example, if this Pokemon uses Ice Beam, it will have a 20% chance to freeze its target.",
		onModifyMove: function(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (var i=0; i<move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
		id: "serenegrace",
		name: "Serene Grace",
		rating: 4,
		num: "32"
	},
	"shadowtag": {
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they have the same ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.ability !== 'shadowtag') {
				pokemon.trapped = true;
			}
		},
		id: "shadowtag",
		name: "Shadow Tag",
		rating: 5,
		num: "23"
	},
	"shedskin": {
		desc: "After each turn, this Pokemon has a 33% chance to heal itself from poison (including Toxic), paralysis, burn, freeze or sleep (including self-induced Rest).",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.status && Math.random()*3 < 1) {
				this.debug('shed skin');
				pokemon.cureStatus();
			}
		},
		id: "shedskin",
		name: "Shed Skin",
		rating: 3,
		num: "61"
	},
	"sheerforce": {
		desc: "Raises the base power of all moves that have any secondary effects by 30%, but the secondary effects are ignored. However, this ability is not applied to moves that have a negative effect on the user, such as recoil, two-turn moves, and stat reduction after using certain moves. If a Pokemon with Sheer Force is holding a Life Orb and uses an attack that would be boosted by Sheer Force, then the move gains both boosts but the user receives no recoil damage.",
		onModifyMove: function(move) {
			if (move.secondaries) {
				this.debug('Sheer Force boost');
				if (!move.basePowerModifier) move.basePowerModifier = 1;
				move.basePowerModifier *= 13/10;
				delete move.secondaries;
				move.negateSecondary = true;
			}
		},
		id: "sheerforce",
		name: "Sheer Force",
		rating: 4,
		num: "125"
	},
	"shellarmor": {
		desc: "Critical Hits cannot strike this Pokemon.",
		onCriticalHit: false,
		id: "shellarmor",
		name: "Shell Armor",
		rating: 1,
		num: "75"
	},
	"shielddust": {
		desc: "If the opponent uses a move that has secondary effects that affect this Pokemon in addition to damage, the move's secondary effects will not trigger. (For example, an Ice Beam will lose its 10% chance to freeze this Pokemon.)",
		onSourceModifyMove: function(move) {
			if (move.secondaries) {
				this.debug('Shield Dust remove secondary');
				delete move.secondaries;
			}
		},
		id: "shielddust",
		name: "Shield Dust",
		rating: 2,
		num: "19"
	},
	"simple": {
		desc: "This Pokemon doubles all of its positive and negative stat modifiers. For example, if this Pokemon uses Curse, its Attack and Defense stats each receive a two-level increase while its Speed stat receives a two-level decrease.",
		onBoost: function(boost) {
			for (var i in boost) {
				boost[i] *= 2;
			}
		},
		id: "simple",
		name: "Simple",
		rating: 4,
		num: "86"
	},
	"skilllink": {
		desc: "When this Pokemon uses an attack that strikes multiple times in one turn, such as Fury Attack or Spike Cannon, such attacks will always strike for the maximum number of hits.",
		onModifyMove: function(move) {
			if (move.multihit && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
		},
		id: "skilllink",
		name: "Skill Link",
		rating: 4,
		num: "92"
	},
	"slowstart": {
		desc: "After this Pokemon switches into the battle, its Attack and Speed stats are halved for five turns; for example, if this Pokemon has an Attack stat of 400, it will effectively have an Attack stat of 200 until the effects of Slow Start wear off.",
		onStart: function(pokemon) {
			pokemon.addVolatile('slowstart');
		},
		effect: {
			duration: 5,
			onStart: function(target) {
				this.add('-start', target, 'Slow Start');
			},
			onModifyStats: function(stats) {
				stats.atk /= 2;
				stats.spe /= 2;
			},
			onEnd: function(target) {
				this.add('-end', target, 'Slow Start');
			}
		},
		id: "slowstart",
		name: "Slow Start",
		rating: -2,
		num: "112"
	},
	"sniper": {
		desc: "When this Pokemon lands a Critical Hit, the base power of its attack is tripled rather than doubled.",
		onModifyMove: function(move) {
			move.critModifier = 3;
		},
		id: "sniper",
		name: "Sniper",
		rating: 1,
		num: "97"
	},
	"snowcloak": {
		desc: "If active while Hail is in effect, this Pokemon's Evasion receives a 20% boost; if this Pokemon has a typing that would normally take damage from Hail, this Pokemon is also immune to Hail's damage.",
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		onSourceModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			if (this.weather === 'hail') {
				this.debug('snow cloak - decreasing accuracy');
				move.accuracy *= 0.8;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 2,
		num: "81"
	},
	"snowwarning": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Hail that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('hail');
			this.weatherData.duration = 0;
		},
		id: "snowwarning",
		name: "Snow Warning",
		rating: 4.5,
		num: "117"
	},
	"solarpower": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its Special Attack temporarily receives a 50% boost but this Pokemon also receives damage equal to one-eighth of its max HP after each turn.",
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'sunnyday') {
				stats.spa *= 1.5;
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'sunnyday') {
				this.damage(target.maxhp/8);
			}
		},
		id: "solarpower",
		name: "Solar Power",
		rating: 3,
		num: "94"
	},
	"solidrock": {
		desc: "This Pokemon receives one-fourth reduced damage from Super Effective attacks.",
		onFoeBasePower: function(basePower, attacker, defender, move) {
			if (this.getEffectiveness(move.type, defender) > 0) {
				this.debug('Solid Rock neutralize');
				return basePower * 3/4;
			}
		},
		id: "solidrock",
		name: "Solid Rock",
		rating: 3,
		num: "116"
	},
	"soundproof": {
		desc: "This Pokemon is immune to the effects of the sound-related moves Bug Buzz, Chatter, Echoed Voice, Grasswhistle, Growl, Heal Bell, Hyper Voice, Metal Sound, Perish Song, Relic Song, Roar, Round, Screech, Sing, Snarl, Snore, Supersonic, and Uproar.",
		onImmunity: function(type) {
			if (type === 'sound') return false;
		},
		id: "soundproof",
		name: "Soundproof",
		rating: 2,
		num: "43"
	},
	"speedboost": {
		desc: "While this Pokemon is active, its Speed increases by one stage at the end of every turn; the six stage maximum for stat boosts is still in effect.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe:1});
			}
		},
		id: "speedboost",
		name: "Speed Boost",
		rating: 4.5,
		num: "3"
	},
	"stall": {
		desc: "This Pokemon attacks last in its priority bracket.",
		onModifyMove: function(move) {
			move.priority -= 0.1;
		},
		id: "stall",
		name: "Stall",
		rating: -1,
		num: "100"
	},
	"static": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become paralyzed.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.isContact) {
				if (Math.random() * 10 < 3) {
					source.trySetStatus('par', target, effect);
				}
			}
		},
		id: "static",
		name: "Static",
		rating: 2,
		num: "9"
	},
	"steadfast": {
		desc: "If this Pokemon is made to flinch, its Speed receives a one-level boost.",
		onFlinch: function(pokemon) {
			this.boost({spe: 1});
		},
		id: "steadfast",
		name: "Steadfast",
		rating: 1,
		num: "80"
	},
	"stench": {
		desc: "Damaging moves have a 10% chance to flinch.",
		id: "stench",
		name: "Stench",
		rating: 0,
		num: "1"
	},
	"stickyhold": {
		desc: "Opponents cannot remove items from this Pokemon.",
		onTakeItem: function(item, pokemon, source) {
			if (source && source !== pokemon) return false;
		},
		id: "stickyhold",
		name: "Sticky Hold",
		rating: 1,
		num: "60"
	},
	"stormdrain": {
		desc: "During double battles, this Pokemon draws any single-target Water-type attack to itself. If an opponent uses an Water-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Water Hidden Power, Judgment or Weather Ball. The user is immune to Water and its Special Attack is increased one stage when hit by one.",
		onImmunity: function(type, pokemon) {
			if (type === 'Water') {
				this.boost({spa:1});
				return null;
			}
		},
		id: "stormdrain",
		name: "Storm Drain",
		rating: 3,
		num: "114"
	},
	"sturdy": {
		desc: "This Pokemon is immune to OHKO moves, and will survive with 1 HP if hit by an attack which would KO it while at full health.",
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.ohko) {
				this.add('-activate',target,'Sturdy');
				return 0;
			}
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-activate',target,'Sturdy');
				return target.hp - 1;
			}
		},
		id: "sturdy",
		name: "Sturdy",
		rating: 3,
		num: "5"
	},
	"suctioncups": {
		desc: "This Pokemon cannot be forced out.",
		onDragOut: false,
		id: "suctioncups",
		name: "Suction Cups",
		rating: 3,
		num: "21"
	},
	"superluck": {
		desc: "Raises the chance of this Pokemon scoring a Critical Hit.",
		onModifyMove: function(move) {
			move.critRatio++;
		},
		id: "superluck",
		name: "Super Luck",
		rating: 1,
		num: "105"
	},
	"swarm": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Bug-type attacks receive a 50% boost in power.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp/3) {
				this.debug('Swarm boost');
				return basePower * 1.5;
			}
		},
		id: "swarm",
		name: "Swarm",
		rating: 2,
		num: "68"
	},
	"swiftswim": {
		desc: "If this Pokemon is active while Rain Dance is in effect, its speed is temporarily doubled.",
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'raindance') {
				stats.spe *= 2;
			}
		},
		id: "swiftswim",
		name: "Swift Swim",
		rating: 3.5,
		num: "33"
	},
	"synchronize": {
		desc: "If an opponent burns, poisons or paralyzes this Pokemon, it receives the same condition.",
		onAfterSetStatus: function(status, target, source) {
			if (!source || source === target) return;
			if (status.id === 'slp' || status.id === 'frz') return;
			source.trySetStatus(status);
		},
		id: "synchronize",
		name: "Synchronize",
		rating: 3,
		num: "28"
	},
	"tangledfeet": {
		desc: "When this Pokemon is confused, its opponent's attacks have a 50% chance of missing.",
		onSourceModifyMove: function(move, source, target) {
			if (target && target.volatiles['confusion'] && move.accuracy !== true) {
				move.accuracy /= 2;
			}
		},
		id: "tangledfeet",
		name: "Tangled Feet",
		rating: 1,
		num: "77"
	},
	"technician": {
		desc: "When this Pokemon uses an attack that has 60 Base Power or less, the move's Base Power receives a 50% boost. For example, a move with 60 Base Power effectively becomes a move with 90 Base Power.",
		onBasePowerPriority: 10,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return basePower * 1.5;
			}
		},
		id: "technician",
		name: "Technician",
		rating: 4,
		num: "101"
	},
	"telepathy": {
		desc: "If a Pokemon has Telepathy, it will not take damage from its teammates' moves in double and triple battles.",
		id: "telepathy",
		name: "Telepathy",
		rating: 0,
		num: "140"
	},
	"teravolt": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "teravolt",
		name: "Teravolt",
		rating: 3,
		num: "164"
	},
	"thickfat": {
		desc: "This Pokemon receives halved damage from Ice-type and Fire-type attacks.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return basePower / 2;
			}
		},
		id: "thickfat",
		name: "Thick Fat",
		rating: 3,
		num: "47"
	},
	"tintedlens": {
		desc: "Doubles the power of moves that are Not Very Effective against opponents.",
		onBasePowerPriority: -100,
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.getEffectiveness(move.type, defender) < 0) {
				this.debug('Tinted Lens boost');
				return basePower * 2;
			}
		},
		id: "tintedlens",
		name: "Tinted Lens",
		rating: 4.5,
		num: "110"
	},
	"torrent": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Water-type attacks receive a 50% boost in power.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp/3) {
				this.debug('Torrent boost');
				return basePower * 1.5;
			}
		},
		id: "torrent",
		name: "Torrent",
		rating: 2,
		num: "67"
	},
	"toxicboost": {
		desc: "When the user is poisoned, its Attack stat is raised by 50%.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				stats.atk *= 1.5;
			}
		},
		id: "toxicboost",
		name: "Toxic Boost",
		rating: 3,
		num: "137"
	},
	"trace": {
		desc: "When this Pokemon enters the field, it temporarily copies an opponent's ability (except Multitype). This ability remains with this Pokemon until it leaves the field.",
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			var ability = this.getAbility(target.ability);
			if (ability.id === 'trace') return;
			if (pokemon.setAbility(ability)) {
				this.add('-ability',pokemon, ability,'[from] ability: Trace','[of] '+target);
			}
		},
		id: "trace",
		name: "Trace",
		rating: 3.5,
		num: "36"
	},
	"truant": {
		desc: "After this Pokemon is switched into battle, it skips every other turn.",
		onBeforeMove: function(pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant',pokemon,'ability: Truant', move);
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
		num: "54"
	},
	"turboblaze": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "turboblaze",
		name: "Turboblaze",
		rating: 3,
		num: "163"
	},
	"unaware": {
		desc: "This Pokemon ignores an opponent's stat boosts for Attack, Defense, Special Attack and Special Defense. These boosts will still be calculated if this Pokemon uses Punishment.",
		id: "unaware",
		name: "Unaware",
		onModifyMove: function(move, user, target) {
			move.ignoreEvasion = true;
			move.ignoreDefensive = true;
		},
		onSourceModifyMove: function(move, user, target) {
			move.ignoreAccuracy = true;
			move.ignoreOffensive = true;
		},
		rating: 2,
		num: "109"
	},
	"unburden": {
		desc: "Increases Speed by one level if this Pokemon loses its held item through usage (i.e. Berries) or via Thief, Knock Off, etc.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.lastItem && !pokemon.item) {
				stats.spe *= 2;
			}
		},
		id: "unburden",
		name: "Unburden",
		rating: 3.5,
		num: "84"
	},
	"unnerve": {
		desc: "Opposing Pokemon can't eat their Berries.",
		onStart: function(pokemon) {
			this.add('-ability',pokemon,'Unnerve',pokemon.side.foe);
		},
		onFoeEatItem: false,
		id: "unnerve",
		name: "Unnerve",
		rating: 1,
		num: "127"
	},
	"victorystar": {
		desc: "Raises every friendly Pokemon's Accuracy, including this Pokemon's, by 10% (multiplied).",
		onAllyModifyMove: function(move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.1;
			}
		},
		id: "victorystar",
		name: "Victory Star",
		rating: 2,
		num: "162"
	},
	"vitalspirit": {
		desc: "This Pokemon cannot be put to sleep; this includes both opponent-induced sleep as well as user-induced sleep via Rest.",
		onImmunity: function(type) {
			if (type === 'slp') return false;
		},
		id: "vitalspirit",
		name: "Vital Spirit",
		rating: 1,
		num: "72"
	},
	"voltabsorb": {
		desc: "When an Electric-type attack hits this Pokemon, it recovers 25% of its max HP.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric') {
				var d = pokemon.heal(pokemon.maxhp/4);
				this.add('-heal',pokemon,d+pokemon.getHealth(),'[from] ability: Volt Absorb');
				return null;
			}
		},
		id: "voltabsorb",
		name: "Volt Absorb",
		rating: 3,
		num: "10"
	},
	"waterabsorb": {
		desc: "When a Water-type attack hits this Pokemon, it recovers 25% of its max HP.",
		onImmunity: function(type, pokemon) {
			if (type === 'Water') {
				var d = pokemon.heal(pokemon.maxhp/4);
				this.add('-heal',pokemon,d+pokemon.getHealth(),'[from] ability: Water Absorb');
				return null;
			}
		},
		id: "waterabsorb",
		name: "Water Absorb",
		rating: 3,
		num: "11"
	},
	"waterveil": {
		desc: "This Pokemon cannot become burned.",
		onImmunity: function(type, pokemon) {
			if (type === 'brn') return false;
		},
		id: "waterveil",
		name: "Water Veil",
		rating: 1.5,
		num: "41"
	},
	"weakarmor": {
		desc: "Causes physical moves to lower the Pokemon's Defense and increase its Speed stat by one stage.",
		onAfterDamage: function(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({spe:1, def:-1});
			}
		},
		id: "weakarmor",
		name: "Weak Armor",
		rating: 0,
		num: "133"
	},
	"whitesmoke": {
		desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles decreases by 50%.",
		onBoost: function(boost, target, source) {
			if (!source || target === source) return;
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
				}
			}
		},
		id: "whitesmoke",
		name: "White Smoke",
		rating: 2,
		num: "73"
	},
	"wonderguard": {
		desc: "This Pokemon only receives damage from attacks belonging to types that cause Super Effective to this Pokemon. Wonder Guard does not protect a Pokemon from status ailments (burn, freeze, paralysis, poison, sleep, Toxic or any of their side effects or damage), recoil damage nor the moves Beat Up, Bide, Doom Desire, Fire Fang, Future Sight, Hail, Leech Seed, Sandstorm, Spikes, Stealth Rock and Struggle. Wonder Guard cannot be Skill Swapped nor Role Played. Trace, however, does copy Wonder Guard.",
		onDamagePriority: 10,
		onDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (effect.type === '???' || effect.id === 'Struggle') return;
			this.debug('Wonder Guard immunity: '+effect.id);
			if (this.getEffectiveness(effect.type, target) <= 0) {
				this.add('-activate',target,'ability: Wonder Guard');
				return null;
			}
		},
		onSubDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (target.negateImmunity[effect.type]) return;
			this.debug('Wonder Guard immunity: '+effect.id);
			if (this.getEffectiveness(effect.type, target) <= 0) {
				this.add('-activate',target,'ability: Wonder Guard');
				return null;
			}
		},
		id: "wonderguard",
		name: "Wonder Guard",
		rating: 5,
		num: "25"
	},
	"wonderskin": {
		desc: "Causes the chance of a status move working to be halved. It does not affect moves that inflict status as a secondary effect like Thunder's chance to paralyze.",
		onSourceModifyMovePriority: 10,
		onSourceModifyMove: function(move) {
			if (move.category === 'Status' && typeof move.accuracy === 'number') {
				this.debug('setting move accuracy to 50%');
				move.accuracy = 50;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 1,
		num: "147"
	},
	"zenmode": {
		desc: "When Darmanitan's HP drops to below half, it will enter Zen Mode at the end of the turn. If it loses its ability, or recovers HP to above half while in Zen mode, it will change back. This ability only works on Darmanitan, even if it is copied by Role Play, Entrainment, or swapped with Skill Swap.",
		onResidualOrder: 27,
		onResidual: function(pokemon) {
			if (pokemon.baseTemplate.species !== 'Darmanitan') {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp/2 && pokemon.template.speciesid==='darmanitan' && pokemon.transformInto('Darmanitan-Zen')) {
				this.add('-formechange', pokemon, 'Darmanitan-Zen');
			} else if (pokemon.hp > pokemon.maxhp/2 && pokemon.template.speciesid==='darmanitanzen' && pokemon.transformInto('Darmanitan')) {
				this.add('-formechange', pokemon, 'Darmanitan');
			}
			// renderer takes care of this for us
		},
		id: "zenmode",
		name: "Zen Mode",
		rating: -1,
		num: "161"
	},

	// CAP
	"mountaineer": {
		desc: "This Pokémon avoids all Rock-type attacks and hazards when switching in.",
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onImmunity: function(type, target) {
			if (type === 'Rock' && !target.activeTurns) {
				return false;
			}
		},
		id: "mountaineer",
		name: "Mountaineer",
		rating: 3.5,
		num: "-2"
	},
	"rebound": {
		desc: "It can reflect the effect of status moves when switching in.",
		id: "rebound",
		name: "Rebound",
		onAllyTryFieldHit: function(target, source, move) {
			if (target === source) return;
			if (this.effectData.target.activeTurns) return;
			if (typeof move.isBounceable === 'undefined') {
				move.isBounceable = !!(move.status || move.forceSwitch);
			}
			if (move.target !== 'foeSide' && target !== this.effectData.target) {
				return;
			}
			if (this.pseudoWeather['magicbounce']) {
				return;
			}
			if (move.isBounceable) {
				this.addPseudoWeather('magicbounce');
				this.add('-activate', target, 'ability: Rebound', move, '[of] '+source);
				this.moveHit(source, source, move);
				return null;
			}
		},
		effect: {
			duration: 1
		},
		rating: 4.5,
		num: "-3"
	},
	"persistent": {
		desc: "Increases the duration of many field effects by two turns when used by this Pokémon.",
		id: "persistent",
		name: "Persistent",
		// implemented in the corresponding move
		rating: 4,
		num: "-4"
	}
};
