'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
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
	"blaze": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Fire-type attacks have their power multiplied by 1.5.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's Fire-type attacks have 1.5x power.",
		onBasePowerPriority: 2,
		onBasePower: function (basePower, attacker, defender, move) {
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
	"colorchange": {
		inherit: true,
		desc: "This Pokemon's type changes to match the type of the last move that hit it, unless that type is already one of its types. This effect applies after each hit from a multi-hit move.",
		onAfterDamage: function (damage, target, source, move) {
			if (!target.hp) return;
			let type = move.type;
			if (target.isActive && move.effectType === 'Move' && move.category !== 'Status' && type !== '???' && !target.hasType(type)) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] Color Change');
			}
		},
		onAfterMoveSecondary: function () {},
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
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (target.status === 'frz') {
					return;
				}
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				return null;
			}
		},
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
			/**@type {Move[]} */
			let warnMoves = [];
			let warnBp = 1;
			for (const target of pokemon.side.foe.active) {
				if (target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					let move = this.getMove(moveSlot.move);
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
			let warnMove = this.sample(warnMoves);
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
			for (const ally of allyActive) {
				if (ally && ally.position !== pokemon.position && !ally.fainted && ally.ability === 'plus') {
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
	"overgrow": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Grass-type attacks have their power multiplied by 1.5.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's Grass-type attacks have 1.5x power.",
		onBasePowerPriority: 2,
		onBasePower: function (basePower, attacker, defender, move) {
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
			for (const ally of allyActive) {
				if (ally && ally.position !== pokemon.position && !ally.fainted && ally.ability === 'minus') {
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
				for (const secondary of move.secondaries) {
					// @ts-ignore
					secondary.chance *= 2;
				}
			}
		},
	},
	"simple": {
		shortDesc: "This Pokemon's stat stages are considered doubled during stat calculations.",
		onModifyBoost: function (boosts) {
			for (let key in boosts) {
				// @ts-ignore
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
			if ((source && source !== pokemon) || (this.activeMove && this.activeMove.id === 'knockoff')) {
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
	"swarm": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Bug-type attacks have their power multiplied by 1.5.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's Bug-type attacks have 1.5x power.",
		onBasePowerPriority: 2,
		onBasePower: function (basePower, attacker, defender, move) {
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
	"thickfat": {
		shortDesc: "The power of Fire- and Ice-type attacks against this Pokemon is halved.",
		onBasePowerPriority: 1,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		id: "thickfat",
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	"torrent": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Water-type attacks have their power multiplied by 1.5.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's Water-type attacks have 1.5x power.",
		onBasePowerPriority: 2,
		onBasePower: function (basePower, attacker, defender, move) {
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
	"trace": {
		inherit: true,
		onUpdate: function (pokemon) {
			if (!pokemon.isStarted) return;
			let target = pokemon.side.foe.randomActive();
			if (!target || target.fainted) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = ['forecast', 'multitype', 'trace'];
			if (bannedAbilities.includes(target.ability)) {
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

exports.BattleAbilities = BattleAbilities;
