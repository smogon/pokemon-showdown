'use strict';

exports.BattleAbilities = {
	"angerpoint": {
		inherit: true,
		desc: "If this Pokemon, or its substitute, is struck by a critical hit, its Attack is raised by 12 stages.",
		shortDesc: "If this Pokemon or its substitute takes a critical hit, its Attack is raised 12 stages.",
		onAfterSubDamage: function (damage, target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({atk: 6});
				this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
			}
		},
		rating: 1.5,
	},
	"effectspore": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status) {
				let r = this.random(100);
				if (r < 10) {
					source.setStatus('slp', target);
				} else if (r < 20) {
					source.setStatus('par', target);
				} else if (r < 30) {
					source.setStatus('psn', target);
				}
			}
		},
	},
	"flashfire": {
		inherit: true,
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyDamagePhase1: function (atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
	},
	"flowergift": {
		inherit: true,
		desc: "If Sunny Day is active, the Attack and Special Defense of this Pokemon and its allies are multiplied by 1.5.",
		shortDesc: "If Sunny Day is active, Attack and Sp. Def of this Pokemon and its allies are 1.5x.",
		onAllyModifyAtk: function (atk) {
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpD: function (spd) {
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
	},
	"forewarn": {
		inherit: true,
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
						warnMoves = [move];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push(move);
					}
				}
			}
			if (!warnMoves.length) return;
			let warnMove = warnMoves[this.random(warnMoves.length)];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove);
		},
	},
	"insomnia": {
		inherit: true,
		rating: 2.5,
	},
	"leafguard": {
		inherit: true,
		desc: "If Sunny Day is active, this Pokemon cannot gain a major status condition, but can use Rest normally.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused, but Rest works normally.",
		onSetStatus: function (status, target, source, effect) {
			if (effect && effect.id === 'rest') {
				return;
			} else if (this.isWeather('sunnyday')) {
				return false;
			}
		},
	},
	"lightningrod": {
		inherit: true,
		desc: "If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself.",
		shortDesc: "This Pokemon draws single-target Electric moves to itself.",
		onTryHit: function () {},
		rating: 0,
	},
	"magicguard": {
		desc: "This Pokemon can only be damaged by direct attacks. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage. This Pokemon cannot lose its turn because of paralysis, and is unaffected by Toxic Spikes on switch-in.",
		shortDesc: "This Pokemon can only be damaged by direct attacks, and can't be fully paralyzed.",
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
		num: 98,
	},
	"minus": {
		desc: "If an active ally has the Ability Plus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has the Ability Plus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpA: function (spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].ability === 'plus') {
					return spa * 1.5;
				}
			}
		},
		id: "minus",
		name: "Minus",
		rating: 0,
		num: 58,
	},
	"naturalcure": {
		inherit: true,
		onCheckShow: function (pokemon) {},
		onSwitchOut: function (pokemon) {
			if (!pokemon.status || pokemon.status === 'fnt') return;

			// Because statused/unstatused pokemon are shown after every switch
			// in gen 3-4, Natural Cure's curing is always known to both players

			this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.setStatus('');
		},
	},
	"normalize": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.id !== 'struggle') {
				move.type = 'Normal';
			}
		},
	},
	"pickup": {
		desc: "No competitive use.",
		shortDesc: "No competitive use.",
		id: "pickup",
		name: "Pickup",
		rating: 0,
		num: 53,
	},
	"plus": {
		desc: "If an active ally has the Ability Minus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has the Ability Minus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpA: function (spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].ability === 'minus') {
					return spa * 1.5;
				}
			}
		},
		id: "plus",
		name: "Plus",
		rating: 0,
		num: 57,
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
		num: 46,
	},
	"serenegrace": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
	},
	"simple": {
		shortDesc: "This Pokemon's stat stages are considered doubled during stat calculations.",
		onModifyBoost: function (boosts) {
			for (let key in boosts) {
				boosts[key] *= 2;
			}
		},
		id: "simple",
		name: "Simple",
		rating: 4,
		num: 86,
	},
	"stench": {
		desc: "No competitive use.",
		shortDesc: "No competitive use.",
		id: "stench",
		name: "Stench",
		rating: 0,
		num: 1,
	},
	"stickyhold": {
		inherit: true,
		onTakeItem: function (item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon) return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
	},
	"stormdrain": {
		inherit: true,
		desc: "If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself.",
		shortDesc: "This Pokemon draws single-target Water moves to itself.",
		onTryHit: function () {},
		rating: 0,
	},
	"sturdy": {
		inherit: true,
		desc: "OHKO moves fail when used against this Pokemon.",
		shortDesc: "OHKO moves fail when used against this Pokemon.",
		onDamage: function () {},
		rating: 0,
	},
	"synchronize": {
		inherit: true,
		desc: "If another Pokemon burns, paralyzes, or poisons this Pokemon, that Pokemon receives the same major status condition. If another Pokemon badly poisons this Pokemon, that Pokemon becomes poisoned.",
		onAfterSetStatus: function (status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			let id = status.id;
			if (id === 'slp' || id === 'frz') return;
			if (id === 'tox') id = 'psn';
			source.trySetStatus(id);
		},
	},
	"trace": {
		inherit: true,
		onUpdate: function (pokemon) {
			if (!pokemon.isStarted) return;
			let target = pokemon.side.foe.randomActive();
			if (!target || target.fainted) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {forecast:1, multitype:1, trace:1};
			if (bannedAbilities[target.ability]) {
				return;
			}
			if (pokemon.setAbility(ability)) {
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
			}
		},
	},
	"vitalspirit": {
		inherit: true,
		rating: 2.5,
	},
	"wonderguard": {
		inherit: true,
		shortDesc: "This Pokemon is only damaged by Fire Fang, supereffective moves, indirect damage.",
		onTryHit: function (target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle' || move.id === 'firefang') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-immune', target, '[msg]', '[from] ability: Wonder Guard');
				return null;
			}
		},
	},
};
