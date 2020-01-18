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
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.js
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// 5gen
	seasonsgift: {
		desc: "If Sunny Day is active, this Pokemon's Attack is 1.5x and its Speed is doubled.",
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
	// Aeonic
	dummythicc: {
		desc: "This ability gives the effects of the abilities Fur Coat, Magic Bounce, Infiltrator, and Sturdy.",
		shortDesc: "Fur Coat + Magic Bounce + Infiltrator + Sturdy.",
		id: "dummythicc",
		name: "Dummy Thicc",
		isNonstandard: "Custom",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		onModifyMove(move) {
			move.infiltrates = true;
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (move.ohko) {
				this.add('-immune', target, '[from] ability: Sturdy');
				return null;
			}
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, target, source, this.dex.getAbility('magicbounce'));
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, this.effectData.target, source, this.dex.getAbility('magicbounce'));
			return null;
		},
		onDamagePriority: -100,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		effect: {
			duration: 1,
		},
	},
	// Aethernum
	awakening: {
		desc: "On switch-in, Attack and Speed are lowered by three stages, while Defense and Special Defense are increased by three stages. At the end of each turn, Attack and Speed are increased by one stage while Defense and Special Defense are decreased by one stage.",
		shortDesc: "Atk & Spe -3; Def & SpD +3; each turn: Atk & Spe +1; Def & SpD -1.",
		id: "awakening",
		name: "Awakening",
		isNonstandard: "Custom",
		onStart(pokemon) {
			this.boost({atk: -3, spe: -3, def: 3, spd: 3});
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			this.boost({atk: 1, spe: 1, def: -1, spd: -1});
		},
	},
	// Akiamara
	toxicswap: {
		desc: "On switch-in, this Pokemon swaps all stat changes with the foe. Ignores abilities.",
		shortDesc: "On switch-in, swaps all stat changes with foe. Ignores abilities.",
		isNonstandard: "Custom",
		id: "toxicswap",
		name: "Toxic Swap",
		onStart(pokemon) {
			let target = pokemon.side.foe.active[0];
			if (!target) return;
			let targetBoosts = {};
			let pokemonBoosts = {};

			// @ts-ignore
			for (let i in target.boosts) {
				// @ts-ignore
				targetBoosts[i] = target.boosts[i];
				// @ts-ignore
				pokemonBoosts[i] = pokemon.boosts[i];
			}
			target.setBoost(pokemonBoosts);
			pokemon.setBoost(targetBoosts);

			this.add('-swapboost', pokemon, target, '[from] ability: Toxic Swap');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
	},
	// Akir
	neutralizingspores: {
		desc: "Nullifies all abilities while on the field.",
		shortDesc: "Nullifies all abilities while on the field.",
		id: "neutralizingspores",
		name: "Neutralizing Spores",
		isNonstandard: "Custom",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Spores');
			const abilities = [
				'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange',
			];
			for (const curMon of this.getAllActive()) {
				if (curMon === pokemon) continue;
				if (abilities.includes(curMon.ability)) continue;
				this.singleEvent('End', curMon.getAbility(), curMon.abilityData, curMon, curMon, 'gastroacid');
			}
			this.add('-message', `${pokemon.name} neutralized all abilities on the field!`);
		},
		// ability ignoring further located in scripts.js
	},
	// Alpha
	osolemio: {
		desc: "If Sunny Day is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Sunny Day is active, this Pokemon heals 1/16 of its max HP each turn.",
		id: "osolemio",
		name: "O SOLE MIO",
		isNonstandard: "Custom",
		onWeather(target, source, effect) {
			if (effect.id === 'sunnyday') {
				this.heal(target.baseMaxhp / 16);
			}
		},
	},
	// Andrew
	volcanictempest: {
		desc: "On switch-in, this Pokemon summons Lava Terrain.",
		shortDesc: "On switch-in, this Pokemon summons Lava Terrain.",
		id: "volcanictempest",
		name: "Volcanic Tempest",
		isNonstandard: "Custom",
		onStart() {
			this.field.setTerrain('lavaterrain');
		},
	},
	// Anubis
	distortionworld: {
		desc: "For 5 turns, Speed becomes the same for all Pokemon. The power of Ghost-type attacks made by Pokemon is multiplied by 1.5.",
		shortDesc: "5 turns. Speed ties. +Ghost power.",
		id: "distortionworld",
		name: "Distortion World",
		isNonstandard: "Custom",
		onStart() {
			this.field.addPseudoWeather('distortionworld');
		},
	},
	// A Quag To The Past
	careless: {
		desc: "This Pokemon blocks certain status moves and instead uses them against the original user. This Pokemon also ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "Bounces certain status moves and ignores other Pokemon's stat changes.",
		id: "careless",
		name: "Careless",
		isNonstandard: "Custom",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, this.effectData.target, source);
			return null;
		},
		onAnyModifyBoost(boosts, target) {
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
		effect: {
			duration: 1,
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
			let plateType = this.dex.getItem(target.item).onPlate;
			if (target !== source && (move.type === 'Normal' || plateType === move.type)) {
				this.add('-immune', target, '[from] ability: Logia');
				return null;
			}
		},
	},
	// Birdy~!
	arabesque: {
		id: "arabesque",
		name: "Arabesque",
		desc: "On switch-in, this Pokemon switches to a different Oricorio forme.",
		shortDesc: "On switch-in, this Pokemon switches to a different Oricorio forme.",
		isNonstandard: "Custom",
		onStart(source) {
			if (source.m.hasTransformed) {
				// Pull the breaks before it infinitely swaps formes.
				source.m.hasTransformed = false;
				return;
			}
			let formes = ['oricorio', 'oricoriosensu', 'oricoriopompom', 'oricoriopau'];
			if (formes.includes(toID(source.template.species))) {
				formes.splice(formes.indexOf(toID(source.template.species)), 1);
				this.add('-activate', source, 'ability: Arabesque');
				source.m.hasTransformed = true;
				source.formeChange(formes[this.random(formes.length)], this.effect, true);
			}
		},
	},
	// Brandon
	gracideamastery: {
		desc: "If this Pokemon is Shaymin-Sky, it will transform into Shaymin before using a status move or upon being attacked. After using the move or taking attack damage, if this Pokemon was originally in its base forme, it will transform back into Shaymin-Sky.",
		shortDesc: "Transforms into Shaymin when using status moves/being attacked.",
		id: "gracideamastery",
		name: "Gracidea Mastery",
		isNonstandard: "Custom",
		onTryHit(target, source, move) {
			if ((target === source || move.category === 'Status') && target.template.speciesid !== 'shayminsky' && target.transformed) return;
			target.formeChange('Shaymin', this.effect);
		},
		onAfterDamage(damage, target, source, effect) {
			if (source === target) return;
			if (target && target.template.speciesid === 'shaymin') {
				target.formeChange('Shaymin-Sky', this.effect);
			}
		},
		onPrepareHit(source, target, move) {
			if (!target || !move) return;
			if (source.template.baseSpecies !== 'Shaymin' || source.transformed) return;
			if (move.category !== 'Status') return;
			source.formeChange('Shaymin', this.effect);
		},
		onAfterMove(pokemon) {
			if (pokemon.template.speciesid !== 'shaymin' || pokemon.transformed) return;
			pokemon.formeChange('Shaymin-Sky', this.effect);
		},
	},
	// Darth
	seraphicregeneration: {
		desc: "When this Pokemon switches out, it regains 33% of its HP, then its replacement recovers 33% of its HP.",
		shortDesc: "Upon switching out, this Pokemon and its replacement regain 33% of their HP.",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
			pokemon.side.addSlotCondition(pokemon, 'seraphicregeneration');
		},
		id: "seraphicregeneration",
		name: "Seraphic Regeneration",
		isNonstandard: "Custom",
		effect: {
			duration: 1,
			onSwitchInPriority: -1,
			onSwitchIn(pokemon) {
				pokemon.heal(pokemon.baseMaxhp / 3);
				this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			},
		},
	},
	// DaWoblefet
	shadowartifice: {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or also have this ability or Shadow Tag. If this Pokemon is knocked out with an attack, that attack's user loses HP equal to the amount of damage inflicted on this Pokemon.",
		shortDesc: "Prevents adjacent foes from switching. If KOed, that move's user loses equal HP.",
		id: "shadowartifice",
		name: "Shadow Artifice",
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.hasAbility('shadowartifice') && !pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			if (!pokemon.hasAbility('shadowtag') && !pokemon.hasAbility('shadowartifice')) {
				pokemon.maybeTrapped = true;
			}
		},
		onAfterDamageOrder: 1,
		onAfterDamage(damage, target, source, move) {
			if (source && source !== target && move && move.effectType === 'Move' && !target.hp) {
				this.damage(damage, source, target);
			}
		},
	},
	// Decem
	miraclescale: {
		desc: "This Pokemon's Dragon-type moves have their priority increased by 1.",
		shortDesc: "+1 Priority to Dragon-type moves.",
		id: "miraclescale",
		name: "Miracle Scale",
		isNonstandard: "Custom",
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.type === 'Dragon') return priority + 1;
		},
	},
	// deetah
	radioactive: {
		desc: "If this Pokemon has a major status condition, its Attack is 1.5x; ignores burn halving physical damage. This Pokemon heals 1/8 of its max HP when poisoned.",
		shortDesc: "1.5x Atk if statused. Heals 1/8 if poisoned.",
		id: "radioactive",
		name: "Radioactive",
		isNonstandard: "Custom",
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.baseMaxhp / 8);
				return false;
			}
		},
	},
	// Dragontite
	iceabsorb: {
		desc: "This Pokemon is immune to Ice-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Ice-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Ice moves; Ice immunity.",
		id: "iceabsorb",
		name: "Ice Absorb",
		isNonstandard: "Custom",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Ice Absorb');
				}
				return null;
			}
		},
	},
	// E4 Flint
	starkmountain: {
		desc: "The user summons Sunny Day when it switches in. In addition, the Base Power of Water-type attacks is multiplied by 0.5 against this Pokemon.",
		shortDesc: "Summons Sunny Day on switch-in. Base Power of foe's Water moves is halved.",
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
	// Elgino
	giblovepls: {
		desc: "After being damaged by a contact move, this Pokemon is healed by 20% of its maximum HP and has its Defense raised by one stage.",
		shortDesc: "Defense +1 and heal 20% after hit by contact move.",
		onAfterDamage(damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.boost({def: 1}, target);
				this.heal(target.baseMaxhp / 5, target);
			}
		},
		id: "giblovepls",
		name: "Gib love pls",
	},
	// fart
	risefromthegases: {
		desc: "The power of Fire-type and Ground-type attacks against this Pokemon is halved.",
		shortDesc: "The power of Fire-type and Ground-type attacks is halved against this Pokemon.",
		id: "risefromthegases",
		name: "Rise from the Gases",
		isNonstandard: "Custom",
		onSourceBasePowerPriority: 7,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
			if (move.type === 'Ground') {
				return this.chainModify(0.5);
			}
		},
	},
	// Flare
	superillusion: {
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes super effective direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "Appears as the last Pokemon in the party until it takes a supereffective hit.",
		id: "superillusion",
		name: "Super Illusion",
		isNonstandard: "Custom",
		isUnbreakable: true,
		onBeforeSwitchIn(pokemon) {
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
		onAfterDamage(damage, target, source, effect) {
			// Illusion that only breaks when hit with a move that is super effective VS dark
			if (target.illusion && effect && effect.effectType === 'Move' && effect.id !== 'confused' && this.dex.getEffectiveness(effect.type, target.getTypes()) > 0) {
				this.singleEvent('End', this.dex.getAbility('Illusion'), target.abilityData, target, source, effect);
			}
		},
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				let disguisedAs = toID(pokemon.illusion.name);
				pokemon.illusion = null;
				let details = pokemon.template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				// Handle hippopotas
				if (this.dex.getTemplate(disguisedAs).exists) disguisedAs += 'user';
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[toID(pokemon.name)]) {
					let status = this.dex.getEffect(toID(pokemon.name));
					if (status && status.exists) {
						pokemon.addVolatile(toID(pokemon.name), pokemon);
					}
				}
			}
		},
		onFaint(pokemon) {
			pokemon.illusion = null;
		},
	},
	// Gallant Spear
	trombe: {
		desc: "On switch-in, this Pokemon summons Light Screen or Reflect and is guaranteed to move first for one turn.",
		shortDesc: "On switch, 1 screen + priority.",
		id: "trombe",
		name: "Trombe!",
		isNonstandard: "Custom",
		onSwitchIn(pokemon) {
			this.add('-activate', pokemon, 'ability: Trombe!');
			if (this.random(2)) {
				pokemon.side.addSideCondition('lightscreen');
			} else {
				pokemon.side.addSideCondition('reflect');
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move && pokemon.activeTurns === 1) return priority + 1;
		},
	},
	// Gimm1ck
	"russianrush": {
		desc: "If Hail is active, this Pokemon's Speed and accuracy are doubled.",
		shortDesc: "If Hail is active, this Pokemon's Speed and accuracy are doubled.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		onSourceModifyAccuracy(accuracy) {
			if (this.field.isWeather('hail')) {
				if (typeof accuracy !== 'number') return;
				this.debug('russianrush - enhancing accuracy');
				return accuracy * 2;
			}
		},
		id: "russianrush",
		name: "Russian Rush",
		isNonstandard: "Custom",
	},
	// GMars
	mysteryshell: {
		desc: "If this Pokemon is a Minior in its Meteor forme, it cannot be afflicted by a status condition. This Pokemon cannot be hit with a critical hit.",
		shortDesc: "Status immunity while in Meteor forme, crit immunity.",
		id: "mysteryshell",
		name: "Mystery Shell",
		isNonstandard: "Custom",
		onCriticalHit: false,
		onSetStatus(status, target, source, effect) {
			if (target.template.speciesid !== 'miniormeteor' || target.transformed) return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[from] ability: Mystery Shell');
			return false;
		},
	},
	// guishark
	gzguishark: {
		desc: "Boosts Attack by one stage upon switch-in or Mega Evolution.",
		shortDesc: "Boosts Attack by 1 stage upon switch-in/Mega Evolution.",
		id: "gzguishark",
		name: "gz guishark",
		isNonstandard: "Custom",
		onStart(pokemon) {
			this.boost({atk: 1}, pokemon);
		},
	},
	// HoeenHero
	scripter: {
		desc: "If Scripted Terrain is active, this Pokemon's Speed is doubled and its moves deal 1.5x damage.",
		shortDesc: "If Scripted Terrain is active, this Pokemon's Speed doubles and it deals 1.5x damage.",
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
	// inactive
	souleater: {
		desc: "Attacking moves heal the user by 33% of damage dealt.",
		shortDesc: "Attacking moves heal the user 33% of damage dealt.",
		id: "souleater",
		name: "Soul Eater",
		isNonstandard: "Custom",
		onModifyMove(move) {
			move.drain = [1, 3];
		},
	},
	// Kie
	maelstrom: {
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Desolate Land. If Rain Dance is active, this Pokemon's Speed is doubled.",
		shortDesc: "Summons heavy rain, doubled speed in rain.",
		id: "maelstrom",
		name: "Maelstrom",
		isNonstandard: "Custom",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
		onStart(source) {
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'primordialsea' && !['desolateland', 'primordialsea', 'deltastream'].includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea') || target.hasAbility('maelstrom')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
	},
	// kaori
	flowershield: {
		shortDesc: "This Pokemon's Special Defense is doubled.",
		onModifySpDPriority: 6,
		onModifySpD(spd) {
			return this.chainModify(2);
		},
		id: "flowershield",
		name: "Flower Shield",
	},
	// KingSwordYT
	kungfupanda: {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2, and this Pokemon's Speed is raised by one stage after it is damaged by a contact move.",
		shortDesc: "Punch-based moves have 1.2x power. +1 Spe when a foe makes contact.",
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
	// Mad Monty ¾°
	minnesnowta: {
		desc: "This Pokemon is immune to Ice-type moves. Its Ice- and Electric-type attacks have their power multiplied by 1.2x.",
		shortDesc: "This Pokemon's Ice and Electric attacks have 1.2x power; Ice immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				this.add('-immune', target, '[from] ability: Minnesnowta');
				return null;
			}
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (['Electric', 'Ice'].includes(move.type)) {
				this.debug('Minnesnowta boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		id: "minnesnowta",
		name: "Minnesnowta",
	},
	// Marshmallon
	sightseeing: {
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, and its moveset changes to the one associated with the current weather, except during Sandstorm and Acid Rain. The user's Defense, Special Attack, Special Defense, Speed, and accuracy are all boosted 1.5x during weather.",
		shortDesc: "Castform adapts to current weather; in weather, Def, SpA, SpD, Spe, accuracy 1.5x.",
		id: "sightseeing",
		name: "Sightseeing",
		isNonstandard: "Custom",
		onModifyDef(def) {
			if (!this.field.isWeather('')) {
				return this.chainModify(1.5);
			}
		},
		onModifySpA(spa) {
			if (!this.field.isWeather('')) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd) {
			if (!this.field.isWeather('')) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe) {
			if (!this.field.isWeather('')) {
				return this.chainModify(1.5);
			}
		},
		onSourceModifyAccuracy(accuracy) {
			if (!this.field.isWeather('')) {
				return this.chainModify(1.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (this.field.effectiveWeather()) {
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
				pokemon.formeChange(forme, this.effect, false, '[msg]');
				const sets = {
					'Castform-Sunny': ['Fire Blast', 'Solar Beam', 'Synthesis', 'Weather Forecast'],
					'Castform-Rainy': ['Hydro Pump', 'Hurricane', 'Thunder', 'Weather Forecast'],
					'Castform-Snowy': ['Blizzard', 'Thunder', 'Earth Power', 'Weather Forecast'],
					'Castform': ['Rain Dance', 'Sunny Day', 'Hail', 'Weather Forecast'],
				};
				// Store percentage of PP left for each moveSlot
				const carryOver = pokemon.moveSlots.slice().map(m => {
					return m.pp / m.maxpp;
				});
				// Incase theres ever less than 4 moves
				while (carryOver.length < 4) {
					carryOver.push(1);
				}
				// @ts-ignore
				let set = sets[forme];
				pokemon.moveSlots = [];
				for (let i = 0; i < set.length; i++) {
					let newMove = set[i];
					let moveTemplate = this.dex.getMove(newMove);
					pokemon.moveSlots.push({
						move: moveTemplate.name,
						id: moveTemplate.id,
						pp: ((moveTemplate.noPPBoosts || moveTemplate.isZ) ? Math.floor(moveTemplate.pp * carryOver[i]) : Math.floor((moveTemplate.pp * 8 / 5) * carryOver[i])),
						maxpp: ((moveTemplate.noPPBoosts || moveTemplate.isZ) ? moveTemplate.pp : moveTemplate.pp * 8 / 5),
						target: moveTemplate.target,
						disabled: false,
						disabledSource: '',
						used: false,
					});
				}
			}
		},
	},
	// Megazard
	standuptall: {
		desc: "This Pokemon's Attack, Defense, and Special Defense are raised by one stage at the end of each full turn it is on the field.",
		shortDesc: "Raises Atk, Def, and SpD by 1 at the end of each full turn on the field.",
		id: "standuptall",
		name: "Stand Up Tall",
		isNonstandard: "Custom",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({atk: 1, def: 1, spd: 1});
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
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Shell Shocker');
				}
				return null;
			}
		},
	},
	// Pirate Princess
	acidrain: {
		desc: "On switch-in, this Pokemon summons Acid Rain.",
		shortDesc: "On switch-in, this Pokemon summons Acid Rain.",
		onStart() {
			this.field.setWeather('acidrain');
		},
		id: "acidrain",
		name: "Acid Rain",
	},
	// pre
	optimize: {
		desc: "This Pokemon changes forme and sets depending on which attack it uses, before the attack takes place. If this Pokemon uses Psycho Boost, it first changes to its Attack forme. If this Pokemon uses Recover, it first changes to its Defense forme. If this Pokemon uses Extreme Speed, it first changes to its Speed forme. If this Pokemon uses Refactor, it first changes to its Base forme.",
		shortDesc: "This Pokemon changes forme and set depending on which attack it uses.",
		id: "optimize",
		name: "Optimize",
		isNonstandard: "Custom",
		onBeforeMove(pokemon, target, move) {
			switch (move.id) {
			case 'psychoboost':
				if (pokemon.template.species === 'Deoxys-Attack') return;
				pokemon.set.nature = 'Modest';
				pokemon.set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
				pokemon.set.evs = {hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252};
				pokemon.setItem('Life Orb');
				pokemon.formeChange('Deoxys-Attack', this.effect);
				break;
			case 'recover':
				if (pokemon.template.species === 'Deoxys-Defense') return;
				pokemon.set.nature = 'Bold';
				pokemon.set.ivs = {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31};
				pokemon.set.evs = {hp: 252, atk: 0, def: 128, spa: 0, spd: 128, spe: 0};
				pokemon.setItem('Leftovers');
				pokemon.formeChange('Deoxys-Defense', this.effect);
				break;
			case 'extremespeed':
				if (pokemon.template.species === 'Deoxys-Speed') return;
				pokemon.set.nature = 'Adamant';
				pokemon.set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
				pokemon.set.evs = {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252};
				pokemon.setItem('Focus Sash');
				pokemon.formeChange('Deoxys-Speed', this.effect);
				break;
			case 'refactor':
				if (pokemon.template.species === 'Deoxys') return;
				pokemon.set.nature = 'Bold';
				pokemon.set.ivs = {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31};
				pokemon.set.evs = {hp: 252, atk: 0, def: 4, spa: 0, spd: 0, spe: 252};
				pokemon.setItem('Rocky Helmet');
				pokemon.formeChange('Deoxys', this.effect);
				break;
			}
		},
	},
	// ptoad
	fatrain: {
		desc: "This Pokemon summons Rain Dance when it switches in, and its Defense is 2x when Rain is active.",
		shortDesc: "On switch-in, summons Rain Dance. This Pokemon's Defense is 2x during Rain.",
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
				return this.chainModify(2);
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
	// Raid
	tempest: {
		desc: "This Pokemon's Flying-type moves have 1.3x Base Power and will always hit.",
		shortDesc: "Flying type moves have 1.3x power and always hit.",
		id: "tempest",
		name: "Tempest",
		isNonstandard: "Custom",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Flying') {
				return this.chainModify(1.3);
			}
		},
		onModifyMove(move) {
			if (move.type === 'Flying') move.accuracy = true;
		},
	},
	// Ransei
	superguarda: {
		desc: "This user's Attack is doubled until it is hit by a super effective attack. If this Pokemon has a major status condition, its Attack is 1.5x; burn halving physical damage is ignored. This Pokemon can only be damaged by direct attacks.",
		shortDesc: "Atk 2x until hit by SE move. 1.5x Atk if statused. Immune to indirect damage.",
		id: "superguarda",
		name: "Superguarda",
		isNonstandard: "Custom",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		onAfterDamage(damage, target, source, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				if (target.m.heavilydamaged && !target.m.quoteplayed) {
					this.add(`c|@Ransei|Yo really? Why do you keep hitting me with super effective moves?`);
					target.m.quoteplayed = true;
				}
				if (!target.m.heavilydamaged) {
					this.add('-message', `${target.name}'s attack was reduced after that super effective attack!`);
					target.m.heavilydamaged = true;
				}
			}
		},
		onModifyAtk(atk, pokemon) {
			let atkmult = 1;
			if (!pokemon.m.heavilydamaged) {
				atkmult *= 2;
			}
			if (pokemon.status) {
				atkmult *= 1.5;
			}
			return this.chainModify(atkmult);
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
			pokemon.heal(pokemon.baseMaxhp / 3);

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
	// Salamander
	numbnumbjuice: {
		desc: "This Pokemon is immune to volatile statuses.",
		shortDesc: "This Pokemon is immune to volatile statuses.",
		onTryAddVolatile(status, target) {
			if (toID(target.name).includes(status.id)) return;
			this.add('-immune', target, '[from] ability: Numb Numb Juice');
			return null;
		},
		id: "numbnumbjuice",
		name: "Numb Numb Juice",
	},
	// Schiavetto
	rvs: {
		desc: "This Pokemon has two random stats except accuracy and evasion raised by one stage and another stat other than accuracy and evasion lowered by one stage at the end of each turn.",
		shortDesc: "Raises a 2 random stats by 1 and lowers another stat by 1 at the end the turn.",
		id: "rvs",
		name: "RVS",
		isNonstandard: "Custom",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			let stats = [];
			let boost = {};
			for (let statPlus in pokemon.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				// @ts-ignore
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? this.sample(stats) : "";
			if (randomStat) {
				// @ts-ignore
				boost[randomStat] = 1;
				// Prevent picking the same stat twice, sampleNoReplace dosen't exists on type Battle
				stats.splice(stats.indexOf(randomStat), 1);
			}

			randomStat = stats.length ? this.sample(stats) : "";
			// @ts-ignore
			if (randomStat) boost[randomStat] = 1;

			stats = [];
			for (let statMinus in pokemon.boosts) {
				if (statMinus === 'accuracy' || statMinus === 'evasion') continue;
				// @ts-ignore
				if (pokemon.boosts[statMinus] > -6 && !(statMinus in boost)) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : "";
			// @ts-ignore
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost);
		},
	},
	// Shiba
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
	// Teremiare
	notprankster: {
		desc: "This Pokemon's status moves have their priority raised by 1.",
		shortDesc: "This Pokemon's status moves have priority raised by 1.",
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
		desc: "This Pokemon's two highest stats are raised by one stage if it attacks and KOes another Pokemon.",
		shortDesc: "The user's 2 highest stats are raised by 1 if it attacks and KOes another Pokemon.",
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
	// vivalospride
	trashvivwebs: {
		desc: "This Pokemon's attacking stat is doubled while it uses a Water-type attack. If a Pokemon uses a Fire-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it. Sets Sticky Web the first time it switches in.",
		shortDesc: "Attack stat using Water 2x; burn immunity; foe's attack using Fire 0.5x; Sticky Web.",
		onStart(pokemon) {
			if (!pokemon.m.stickyweb) {
				this.useMove("stickyweb", pokemon);
				pokemon.m.stickyweb = true;
			}
		},
		onModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[from] ability: Water Bubble');
			return false;
		},
		id: "trashvivwebs",
		name: "TRASH VIV WEBS",
	},
	// xJoelituh
	clubexpertise: {
		desc: "This Pokemon's bone moves have their Base Power multiplied by 1.3.",
		shortDesc: "This Pokemon's bone moves have their power multiplied by 1.3.",
		id: "clubexpertise",
		name: "Club Expertise",
		isNonstandard: "Custom",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.id.includes('bone')) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
	},
	// Yuki
	snowstorm: {
		desc: "As it switches in, this Pokemon summons Hail that remains in effect until replaced by another weather or suppressed by the effects of Cloud Nine, Air Lock, or Delta Stream.",
		shortDesc: "On switch-in, this Pokemon summons Hail which remains active until replaced.",
		id: "snowstorm",
		name: "Snow Storm",
		isNonstandard: "Custom",
		onStart() {
			let snowStorm = this.dex.getEffect('hail');
			this.field.setWeather(snowStorm);
		},
	},
	// Modified Illusion to support SSB volatiles
	illusion: {
		inherit: true,
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				let disguisedAs = toID(pokemon.illusion.name);
				pokemon.illusion = null;
				let details = pokemon.template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				// Handle hippopotas
				if (this.dex.getTemplate(disguisedAs).exists) disguisedAs += 'user';
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[toID(pokemon.name)]) {
					let status = this.dex.getEffect(toID(pokemon.name));
					if (status && status.exists) {
						pokemon.addVolatile(toID(pokemon.name), pokemon);
					}
				}
			}
		},
	},
	// Modified Primordial Sea to not end if a pokemon with Maelstrom is out
	primordialsea: {
		inherit: true,
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea') || target.hasAbility('maelstrom')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
	},
};

exports.BattleAbilities = BattleAbilities;
