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
		desc: "If Sunny Day is active, this Pokemon's Attack is 1.5x, and its Speed is doubled.",
		shortDesc: "If Sunny Day is active, this Pokemon's Attack is 1.5x and its Speed is doubled.",
		id: "seasonsgift",
		name: "Season's Gift",
		isNonstandard: "Custom",
		onModifyAtk(atk) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2);
			}
		},
	},
	// Akir
	regrowth: {
		desc: "This Pokemon's healing moves have their priority increased by one stage. When switching out, this Pokemon restores 1/4 of its maximum HP, rounded down.",
		shortDesc: "Healing moves have priority increased by 1. Heals 1/4 max HP when switching out.",
		id: "regrowth",
		name: "Regrowth",
		isNonstandard: "Custom",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.flags['heal']) return priority + 1;
		},
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.maxhp / 4);
		},
	},
	// Arsenal
	logia: {
		desc: "If this Pokemon is an Arceus, its type changes to match its held Plate or Z-Crystal, and it is immune to Normal and same-type moves.",
		shortDesc: "Arceus: type matches held Plate or Z-Crystal; immunity to Normal and its own type.",
		// Logia's type-changing itself is implemented in statuses.js
		id: "logia",
		name: "Logia",
		isNonstandard: "Custom",
		onTryHit(target, source, move) {
			let plateType = this.getItem(target.item).onPlate;
			if (target !== source && (move.type === 'Normal' || plateType === move.type)) {
				this.add('-immune', target, '[from] ability: Logia');
				return null;
			}
		},
	},
	// Bhris Brown
	stimulatedpride: {
		id: "stimulatedpride",
		name: "Stimulated Pride",
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent foes not behind a Substitute by one stage. If the weather is rain, this Pokemon's Speed is doubled.",
		shortDesc: "On switch-in, adjacent foes' Atk is lowered by by 1. Speed is doubled in rain.",
		isNonstandard: "Custom",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Stimulated Pride', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({atk: -1}, target, pokemon, this.getAbility('intimidate'));
				}
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
	},
	// Brandon
	gracideamastery: {
		desc: "If this Pokemon is a Shaymin, it will transform into Shaymin-S before using a physical or special attack. After using the attack, if this Pokemon was originally in its base forme, it will transform back into Shaymin.",
		shortDesc: "Transforms into Shaymin-Sky before attacking, then reverts to Shaymin-Land.",
		id: "gracideamastery",
		name: "Gracidea Mastery",
		isNonstandard: "Custom",
		onPrepareHit(source, target, move) {
			if (!target || !move) return;
			if (source.template.baseSpecies !== 'Shaymin' || source.transformed) return;
			if (target !== source && move.category !== 'Status') {
				source.formeChange('Shaymin-Sky', this.effect);
			}
		},
		onAfterMove(pokemon, move) {
			if (pokemon.template.baseSpecies !== 'Shaymin' || pokemon.transformed) return;
			pokemon.formeChange('Shaymin', this.effect);
		},
	},
	// cc
	lurking: {
		desc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		id: "lurking",
		name: "Lurking",
		isNonstandard: "Custom",
		onModifyMove(move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.3;
			}
		},
	},
	// Cleo
	adrenalinerush: {
		desc: "As this Pokemon switches in, its Special Attack and Speed are doubled for 5 turns. After five turns have passed, these effects are removed.",
		shortDesc: "On switch-in, this Pokemon's Special Attack and Speed are doubled for 5 turns.",
		id: "adrenalinerush",
		name: "Adrenaline Rush",
		isNonstandard: "Custom",
		onStart(pokemon) {
			pokemon.addVolatile('adrenalinerush');
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['adrenalinerush'];
			this.add('-end', pokemon, 'Adrenaline Rush', '[silent]');
		},
		effect: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Adrenaline Rush', '[silent]');
				this.add('-message', `${pokemon.name}'s Adrenaline Rush has begun.`);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				return this.chainModify(2);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(2);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Adrenaline Rush', '[silent]');
				this.add('-message', `${pokemon.name}'s Adrenaline Rush has ended.`);
			},
		},
	},
	// E4 Flint
	starkmountain: {
		desc: "The user summons Sunny Day when it switches in. In addition, Water-type attacks do halved damage against this Pokemon.",
		shortDesc: "On switch-in, summons Sunny Day. Water power against this Pokemon is halved.",
		id: "starkmountain",
		name: "Stark Mountain",
		isNonstandard: "Custom",
		onStart(pokemon) {
			this.field.setWeather('sunnyday', pokemon);
		},
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
	},
	// HoeenHero
	scripter: {
		desc: "If Scripted Terrain is active, this Pokemon's Speed is doubled, and its moves have 1.5x power.",
		shortDesc: "If Scripted Terrain is active, this Pokemon's Speed doubles and attack power is 1.5x.",
		id: "scripter",
		name: "Scripter",
		isNonstandard: "Custom",
		onModifyDamage(damage, source, target, move) {
			if (this.field.isTerrain('scriptedterrain')) {
				this.debug('Scripter boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.field.isTerrain('scriptedterrain')) {
				return this.chainModify(2);
			}
		},
	},
	// KingSwordYT
	kungfupanda: {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2, and this Pokemon's Speed is raised by 1 stage after it is damaged by a contact move.",
		shortDesc: "This Pokemon's punch-based moves have 1.2x power. +1 Spe when a foe makes contact.",
		id: "kungfupanda",
		name: "Kung Fu Panda",
		isNonstandard: "Custom",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Kung Fu Panda boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onAfterDamage(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.flags.contact && effect.id !== 'confused') {
				this.boost({spe: 1});
			}
		},
	},
	// Lionyx
	frozenskin: {
		desc: "If hail is active, this Pokemon's Speed is doubled. This Pokemon takes no damage from hail.",
		shortDesc: "If hail is active, this Pokemon's Speed is doubled; immunity to hail.",
		id: "frozenskin",
		name: "Frozen Skin",
		isNonstandard: "Custom",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
	},
	// Megazard
	standuptall: {
		desc: "This Pokemon's Defense or Special Defense is raised by 1 stage at the end of each full turn it is on the field.",
		shortDesc: "Raises Defense or Special Defense by 1, at random, after each full turn on the field.",
		id: "standuptall",
		name: "Stand Up Tall",
		isNonstandard: "Custom",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
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
		desc: "If this Pokemon is a Lycanroc-Midnight, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, and it transforms into Lycanroc-Dusk. Confusion damage also breaks the disguise.",
		shortDesc: "If this Pokemon is a Lycanroc-Midnight, the first hit it takes in battle deals 0 damage.",
		id: "fakecrash",
		name: "Fake Crash",
		isNonstandard: "Custom",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.template.speciesid === 'lycanrocmidnight' && !target.transformed) {
				this.add('-activate', target, 'ability: Fake Crash');
				this.effectData.busted = true;
				return 0;
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (target.template.speciesid !== 'lycanrocmidnight' || target.transformed || (target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates))) return;
			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (pokemon.template.speciesid === 'lycanrocmidnight' && this.effectData.busted) {
				let templateid = 'Lycanroc-Dusk';
				pokemon.formeChange(templateid, this.effect, true);
				this.add('-message', `${pokemon.name || pokemon.species}'s true identity was revealed!`);
			}
		},
	},
	// nui
	prismaticsurge: {
		desc: "On switch-in, this Pokemon summons Prismatic Terrain.",
		shortDesc: "On switch-in, this Pokemon summons Prismatic Terrain.",
		id: "prismaticsurge",
		name: "Prismatic Surge",
		isNonstandard: "Custom",
		onStart() {
			this.field.setTerrain('prismaticterrain');
		},
	},
	// Osiris
	sacredshadow: {
		desc: "This Pokemon's attacking stats are doubled while using a Ghost-type attack. If a Pokemon uses a Fire-type or Flying-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Ghost power is 2x; can't be burned; Fire/Flying power against it is halved.",
		id: "sacredshadow",
		name: "Sacred Shadow",
		isNonstandard: "Custom",
		onModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flying') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flying') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(2);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Sacred Shadow');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[from] ability: Sacred Shadow');
			return false;
		},
	},
	// Pablo
	shellshocker: {
		desc: "This Pokemon's Normal-type moves become Electric-type and have 1.2x power. In addition, this Pokemon is immune to Electric-type moves and heals 1/4 of its maximum HP, rounded down, when hit by an Electric-type move.",
		shortDesc: "Normal-type moves become Electric with 1.2x power; Electric hits heal 1/4 max HP.",
		id: "shellshocker",
		name: "Shell Shocker",
		isNonstandard: "Custom",
		onModifyMovePriority: -1,
		onModifyMove(move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Electric';
				move.galvanizeBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			if (move.galvanizeBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[from] ability: Shell Shocker');
				}
				return null;
			}
		},
	},
	// ptoad
	fatrain: {
		desc: "This Pokemon summons Rain Dance when it switches in, and its Defense is 1.5x when Rain is active.",
		shortDesc: "On switch-in, summons Rain Dance. This Pokemon's Defense is 1.5x during Rain.",
		id: "fatrain",
		name: "Fat Rain",
		isNonstandard: "Custom",
		onStart(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.template.speciesid === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('raindance');
		},
		onModifyDef(def, pokemon) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(1.5);
			}
		},
	},
	// Psynergy
	wrath: {
		desc: "This Pokemon has its critical hit ratio raised by 1 stage, and its moves have their accuracy multiplied by 1.1.",
		shortDesc: "This Pokemon's critical hit ratio is raised by 1, and its moves have 1.1x accuracy.",
		id: "wrath",
		name: "Wrath",
		isNonstandard: "Custom",
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		onModifyMove(move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.1;
			}
		},
	},
	// Rory Mercury
	recharge: {
		desc: "Upon switching out, this Pokemon has its major status condition cured and restores 1/3 of its maximum HP, rounded down. When this Pokemon switches in, if it uses an Electric-type attack on the next turn, that attack's power will be doubled.",
		shortDesc: "Switch-out: cures status + 33% HP. Switch-in: 2x power on Electric move next turn.",
		id: "recharge",
		name: "Recharge",
		isNonstandard: "Custom",
		onSwitchIn(pokemon) {
			this.add('-activate', pokemon, 'ability: Recharge');
			pokemon.addVolatile('charge');
		},
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.maxhp / 3);

			if (!pokemon.status) return;
			this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Recharge');
			pokemon.setStatus('');
		},
	},
	// SamJo
	thiccerfat: {
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "Fire/Ice damage against this Pokemon has a halved attacking stat. Burn immunity.",
		id: "thiccerfat",
		name: "Thiccer Fat",
		isNonstandard: "Custom",
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thiccer Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thiccer Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thiccer Fat');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[from] ability: Thiccer Fat');
			return false;
		},
	},
	// Shiba and imas
	galewingsv1: {
		desc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		id: "galewingsv1",
		name: "Gale Wings v1",
		isNonstandard: "Custom",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 1;
		},
	},
	// SunGodVolcarona
	solarflare: {
		desc: "This Pokemon is immune to Rock-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Rock-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Rock moves; Rock immunity.",
		id: "solarflare",
		name: "Solar Flare",
		isNonstandard: "Custom",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Rock') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[from] ability: Solar Flare');
				}
				return null;
			}
		},
	},
	// Teremiare
	notprankster: {
		desc: "This Pokemon's status moves have their priority raised by 1.",
		shortDesc: "This Pokemon's Status moves have priority raised by 1.",
		id: "notprankster",
		name: "Not Prankster",
		isNonstandard: "Custom",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
	},
	// The Immortal
	beastboost2: {
		desc: "This Pokemon's two highest stats are raised by 1 if it attacks and KOes another Pokemon.",
		shortDesc: "This Pokemon's 2 highest stats are raised by 1 if it attacks and KOes another Pokemon.",
		id: "beastboost2",
		name: "Beast Boost 2",
		isNonstandard: "Custom",
		onSourceFaint(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				// @ts-ignore
				let statOrder = Object.keys(source.storedStats).sort((stat1, stat2) => source.storedStats[stat2] - source.storedStats[stat1]);
				this.boost({[statOrder[0]]: 1, [statOrder[1]]: 1}, source);
			}
		},
	},
	// torkool
	deflectiveshell: {
		desc: "Summons Sunny Day as the user switches in. Non-contact moves deal 2/3 damage to this Pokemon.",
		shortDesc: "On switch-in, summons Sunny Day. Receives 2/3 damage from non-contact moves.",
		id: "deflectiveshell",
		name: "Deflective Shell",
		isNonstandard: "Custom",
		onStart(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.template.speciesid === 'groudon') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('sunnyday');
		},
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (!move.flags['contact']) mod = (mod / 3) * 2; // 2/3
			return this.chainModify(mod);
		},
	},
	// Trickster
	interdimensional: {
		desc: "As it switches in, this Pokemon summons Gravity.",
		shortDesc: "On switch-in, this Pokemon Summons Gravity.",
		id: "interdimensional",
		name: "Interdimensional",
		isNonstandard: "Custom",
		onStart(pokemon) {
			this.field.addPseudoWeather('gravity', pokemon);
		},
	},
	// urkerab
	focusenergy: {
		desc: "This Pokemon gains the Focus Energy effect when it switches in.",
		shortDesc: "This Pokemon gains the Focus Energy effect when it switches in.",
		id: "focusenergy",
		name: "Focus Energy",
		isNonstandard: "Custom",
		onStart(pokemon) {
			pokemon.addVolatile('focusenergy');
		},
	},
	// Yuki
	snowstorm: {
		desc: "As it switches in, this Pokemon summons hail that remains in effect until replaced by another weather or suppressed by the effects of Cloud Nine, Air Lock, or Delta Stream.",
		shortDesc: "On switch-in, this Pokemon summons hail which remains active until replaced.",
		id: "snowstorm",
		name: "Snow Storm",
		isNonstandard: "Custom",
		onStart() {
			let snowStorm = this.deepClone(this.getEffect('hail'));
			snowStorm.duration = -1;
			this.field.setWeather(snowStorm);
		},
	},
	// Modified Illusion to support SSB volatiles
	illusion: {
		inherit: true,
		onEnd(pokemon) {
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
	// Modified Prankster to not boost Army of Mushrooms
	prankster: {
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.category === 'Status' && move.id !== 'armyofmushrooms') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
	},
};

exports.BattleAbilities = BattleAbilities;
