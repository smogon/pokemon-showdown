'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	/*
	// Example
	"abilityid": {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		id: "abilityid",
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/Zarel/Pokemon-Showdown/blob/master/data/abilities.js
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// 5gen
	seasonsgift: {
		desc: "If the weather is sunnyday this pokemon has 1.5x atk and 2x spe.",
		shortDesc: "If sunnyday is active, 1.5x atk & 2x spe.",
		id: "seasonsgift",
		name: "Season's Gift",
		onModifyAtk: function (atk) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe: function (spe) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2);
			}
		},
	},
	// Arrested
	shellshocker: {
		desc: "This Pokemon's Normal-type moves become Electric type and have 1.2x power. In addition, this Pokemon heals 1/4 of its max HP when hit by Electric moves and is immune to Electric type moves.",
		shortDesc: "Normal type moves become Electric type; Heals 1/4 HP when hit by an Electric attack.",
		id: "shellshocker",
		name: "Shell Shocker",
		isNonstandard: true,
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Electric';
				move.galvanizeBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.galvanizeBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Shell Shocker');
				}
				return null;
			}
		},
	},
	// Bhris Brown
	stimulatedpride: {
		id: "stimulatedpride",
		name: "Stimulated Pride",
		desc: "On switch in, this Pokemon summons Rain, and lowers the foe's attack by 1.",
		shortDesc: "On switch in, this Pokemon summons Rain, and lowers the foe's attack by 1.",
		isNonstandard: true,
		onStart: function (pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Stimulated Pride', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target, '[msg]');
				} else {
					this.boost({atk: -1}, target, pokemon);
				}
			}
		},
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
	},
	// Bimp
	learnsomethingnew: {
		desc: "This Pokemon's Attack is raised by 1 stage when another Pokemon faints.",
		shortDesc: "This Pokemon's Atk is raised by 1 stage when another Pokemon faints.",
		id: "learnsomethingnew",
		name: "Learn Something New!",
		isNonstandard: true,
		onAnyFaint: function () {
			this.boost({atk: 1}, this.effectData.target);
		},
	},
	// Brandon
	gracideamastery: {
		desc: "If this pokemon is a Shaymin, it will transform into Shaymin-Sky before using a Physical or Special attack move. After using the move, this pokemon will transform back into Shaymin.",
		shortDesc: "This pokemon transforms into Shaymin-Sky before attacking, and revert to Shaymin after.",
		id: "gracideamastery",
		name: "Gracidea Mastery",
		isNonstandard: true,
		onPrepareHit: function (source, target, move) {
			if (!target || !move) return;
			if (source.template.baseSpecies !== 'Shaymin' || source.transformed) return;
			if (target !== source && move.category !== 'Status') {
				source.formeChange('Shaymin-Sky', this.effect);
			}
		},
		onSourceHit: function (target, source, move) {
			source.formeChange('Shaymin', this.effect);
		},
	},
	// cc
	lurking: {
		desc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		id: "lurking",
		name: "Lurking",
		isNonstandard: true,
		onModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.3;
			}
		},
	},
	// E4 Flint
	starkmountain: {
		desc: "The user summons sunny weather when they switch in. Water-type attack damage against this pokemon is halved.",
		shortDesc: "Summons sunny weather, halved Water damage.",
		id: "starkmountain",
		name: "Stark Mountain",
		isNonstandard: true,
		onStart: function (target, source) {
			this.setWeather('sunnyday', source);
		},
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
	},
	// HoeenHero
	scripter: {
		desc: "If the terrain is scripted terrain, this pokemon's moves have 1.5x power, and its speed is doubled.",
		shortDesc: "If scripted terrain, 1.5x move power & 2x speed",
		id: "scripter",
		name: "Scripter",
		isNonstandard: true,
		onModifyDamage: function (damage, source, target, move) {
			if (this.isTerrain('scriptedterrain')) {
				this.debug('Scripter boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpe: function (spe, pokemon) {
			if (this.isTerrain('scriptedterrain')) {
				return this.chainModify(2);
			}
		},
	},
	// KingSwordYT
	kungfupanda: {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2, and this Pokemon's Speed is raised by 1 stage after it is damaged by a move",
		shortDesc: "This Pokemon's punch-based attacks have 1.2x power. +1 Spe when hit.",
		id: "kungfupanda",
		name: "Kung Fu Panda",
		isNonstandard: true,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Kung Fu Panda boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.flags.contact && effect.id !== 'confused') {
				this.boost({spe: 1});
			}
		},
	},
	// Lionyx
	frozenskin: {
		desc: "If Hail is active, this Pokemon's Speed is doubled. This pokemon is also immune to Hail.",
		shortDesc: "If Hail is active, this Pokemon's Speed is doubled; immunity to Hail.",
		id: "frozenskin",
		name: "Frozen Skin",
		isNonstandard: true,
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
	},
	// Megazard
	standuptall: {
		desc: "This Pokemon's Defense or Special Defense is raised 1 stage at the end of each full turn on the field.",
		shortDesc: "This Pokemon's Def or Spd is raised 1 stage at the end of each full turn on the field.",
		id: "standuptall",
		name: "Stand Up Tall",
		isNonstandard: true,
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				if (this.randomChance(1, 2)) {
					this.boost({def: 1});
				} else {
					this.boost({spd: 1});
				}
			}
		},
	},
	// MicktheSpud
	fakecrash: {
		desc: "If this Pokemon is a Lycanroc-Midnight, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Lycanroc-Dusk. Confusion damage also breaks the disguise.",
		shortDesc: "If this Pokemon is a Lycanroc-Midnight, the first hit it takes in battle deals 0 damage.",
		id: "fakecrash",
		name: "Fake Crash",
		isNonstandard: true,
		onDamagePriority: 1,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.template.speciesid === 'lycanrocmidnight' && !target.transformed) {
				this.add('-activate', target, 'ability: Fake Crash');
				this.effectData.busted = true;
				return 0;
			}
		},
		onEffectiveness: function (typeMod, target, type, move) {
			if (!this.activeTarget) return;
			let pokemon = this.activeTarget;
			if (pokemon.template.speciesid !== 'lycanrocmidnight' || pokemon.transformed || (pokemon.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates))) return;
			if (!pokemon.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate: function (pokemon) {
			if (pokemon.template.speciesid === 'lycanrocmidnight' && this.effectData.busted) {
				let templateid = 'Lycanroc-Dusk';
				pokemon.formeChange(templateid, this.effect, true);
				this.add('-message', `${pokemon.name || pokemon.species}'s true identity was revealed!`);
			}
		},
	},
	// nui
	prismaticterrain: {
		desc: "For 5 turns, the terrain becomes Prismatic Terrain. During the effect, the power of Ice-type attacks is multiplied by 0.5. Hazards are removed and cannot be set while Prismatic Terrain is active. Fails if the current terrain is Prismatic Terrain.",
		shortDesc: "5 turns. No hazards,-Ice power.",
		id: "prismaticterrain",
		name: "Prismatic Terrain",
		isNonstandard: true,
		onStart: function (source) {
			this.setTerrain('prismaticterrain');
		},
		effect: {
			duration: 5,
			durationCallback: function (source, effect) {
				if (source && source.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBeforeMovePriority: 2,
			onBeforeMove: function (pokemon, target, move) {
				let hazards = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'hazardpass', 'beskyttelsesnet', 'bringerofdarkness'];
				if (hazards.includes(move.id)) {
					this.add('-message', 'The Prismatic Terrain prevents ' + move.name + ' from working.');
					return false;
				}
			},
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Ice') {
					this.debug('prismatic terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onStart: function (battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Prismatic Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Prismatic Terrain');
				}
				let removeAll = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const sideCondition of removeAll) {
					let target = source.side.foe;
					if (target.removeSideCondition(sideCondition)) {
						this.add('-sideend', target, this.getEffect(sideCondition).name, '[from] move: Prismatic Terrain', '[of] ' + target);
					}
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Prismatic Terrain', '[of] ' + source);
					}
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function (side) {
				this.add('-fieldend', 'Prismatic Terrain');
			},
		},
	},
	// Osiris
	sacredshadow: {
		desc: "This Pokemon's attacking stat is doubled while using a Ghost-type attack. If a Pokemon uses a Fire-type or FLying-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Ghost power is 2x; can't be burned; Fire/Flying power against it is halved.",
		id: "sacredshadow",
		name: "Sacred Shadow",
		isNonstandard: true,
		onModifyAtkPriority: 5,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flying') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flying') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(2);
			}
		},
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(2);
			}
		},
		onUpdate: function (pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Sacred Shadow');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Sacred Shadow');
			return false;
		},
	},
	// ptoad
	fatrain: {
		desc: "This pokemon summons Rain when it switches in, and its Defense is 1.5x in Rain.",
		shortDesc: "This pokemon summons Rain when it switches in; 1.5x def in Rain.",
		id: "fatrain",
		name: "Fat Rain",
		isNonstandard: true,
		onStart: function (source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.template.speciesid === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
		},
		onModifyDef: function (def, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(1.5);
			}
		},
	},
	// Rory Mercury
	recharge: {
		desc: "This Pokemon has its major status condition cured, and restores 1/3 of its maximum HP, rounded down, when it switches out. When this Pokemon switches in, if it uses an Electric-type attack on the next turn, its power will be doubled",
		shortDesc: "Natural Cure + Regenerator + Charge",
		id: "recharge",
		name: "Recharge",
		isNonstandard: true,
		onSwitchIn: function (pokemon) {
			this.add('-activate', pokemon, 'ability: Recharge');
			pokemon.addVolatile('charge');
		},
		onSwitchOut: function (pokemon) {
			pokemon.heal(pokemon.maxhp / 3);

			if (!pokemon.status) return;
			this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Recharge');
			pokemon.setStatus('');
		},
	},
	// SamJo
	thiccerfat: {
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "Fire/Ice-type damage reduced. Immune to burns.",
		id: "thiccerfat",
		name: "Thiccer Fat",
		isNonstandard: true,
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
		onUpdate: function (pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thiccer Fat');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Thiccer Fat');
			return false;
		},
	},
	// Shiba
	galewings10: {
		desc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		id: "galewings10",
		name: "Gale Wings 1.0",
		isNonstandard: true,
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 1;
		},
	},
	// SunGodVolcarona
	solarflare: {
		desc: "This Pokemon is immune to Rock-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Rock-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Rock moves; Rock immunity.",
		id: "solarflare",
		name: "Solar Flare",
		isNonstandard: true,
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Rock') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Solar Flare');
				}
				return null;
			}
		},
	},
	// Teremiare
	notprankster: {
		desc: "This Pokemon's Status moves have priority raised by 1.",
		shortDesc: "This Pokemon's Status moves have priority raised by 1.",
		id: "notprankster",
		name: "Not Prankster",
		isNonstandard: true,
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
	},
	// The Immortal
	beastboost2: {
		desc: "This Pokemon's highest 2 stats are raised by 1 if it attacks and KOes another Pokemon.",
		shortDesc: "This Pokemon's highest 2 stats are raised by 1 if it attacks and KOes another Pokemon.",
		id: "beastboost2",
		name: "Beast Boost 2",
		isNonstandard: true,
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let statOrder = Object.keys(source.stats)
				    .sort((stat1, stat2) => source.stats[stat2] - source.stats[stat1]);
				this.boost({[statOrder[0]]: 1, [statOrder[1]]: 1}, source);
			}
		},
	},
	// torkool
	deflectiveshell: {
		desc: "Non-contact moves do 33% less damage to this pokemon. Summons Sunny Day on switch-in.",
		shortDesc: "Drought + Non-contact does 33% less damage.",
		id: "deflectiveshell",
		name: "Deflective Shell",
		isNonstandard: true,
		onStart: function (source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.template.speciesid === 'groudon') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.setWeather('sunnyday');
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (!move.flags['contact']) mod = (mod / 3) * 2; // 2/3
			return this.chainModify(mod);
		},
	},
	// Trickster
	interdimensional: {
		desc: "On Switch-in, this Pokemon summons Gravity.",
		shortDesc: "On Switch-in, this Pokemon Summons Gravity.",
		id: "interdimensional",
		name: "Interdimensional",
		isNonstandard: true,
		onStart: function (target, source) {
			this.addPseudoWeather('gravity', source);
		},
	},
	// urkerab
	focusenergy: {
		desc: "This Pokemon gains the Focus Energy status when it switches in.",
		shortDesc: "This Pokemon gains the Focus Energy status when it switches in.",
		id: "focusenergy",
		name: "Focus Energy",
		isNonstandard: true,
		onStart: function (pokemon) {
			pokemon.addVolatile('focusenergy');
		},
	},
	// Yuki
	snowstorm: {
		desc: "Hail crashes down for unlimited turns.",
		shortDesc: "Hail crashes down for unlimited turns.",
		id: "snowstorm",
		name: "Snow Storm",
		isNonstandard: true,
		onStart: function () {
			let snowStorm = this.getEffect('hail');
			snowStorm.duration = -1;
			this.setWeather(snowStorm);
		},
	},
	// Modified Illusion to support SSB volatiles
	illusion: {
		inherit: true,
		onEnd: function (pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				let disguisedAs = toId(pokemon.illusion.name);
				pokemon.illusion = null;
				let details = pokemon.template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				// Handle hippopotas
				if (this.getTemplate(disguisedAs).exists) disguisedAs += 'user';
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[toId(pokemon.name)]) {
					let status = this.getEffect(toId(pokemon.name));
					if (status && status.exists) {
						pokemon.addVolatile(toId(pokemon.name), pokemon);
					}
				}
			}
		},
	},
};

exports.BattleAbilities = BattleAbilities;
