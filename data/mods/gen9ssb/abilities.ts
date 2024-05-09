import {ssbSets} from "./random-teams";
import {changeSet, getName, enemyStaff} from "./scripts";

const STRONG_WEATHERS = ['desolateland', 'primordialsea', 'deltastream', 'deserteddunes', 'millenniumcastle'];

export const Abilities: {[k: string]: ModdedAbilityData} = {
	/*
	// Example
	abilityid: {
		shortDesc: "", // short description, shows up in /dt
		desc: "", // long description
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.ts
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// Aelita
	fortifiedmetal: {
		shortDesc: "This Pokemon's weight is doubled and Attack is 1.5x when statused.",
		name: "Fortified Metal",
		onModifyWeightPriority: 1,
		onModifyWeight(weighthg) {
			return weighthg * 2;
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		flags: {breakable: 1},
		gen: 9,
	},

	// Aethernum
	theeminenceintheshadow: {
		shortDesc: "Unaware + Supreme Overlord with half the boost.",
		name: "The Eminence in the Shadow",
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		onStart(pokemon) {
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: The Eminence in the Shadow');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [20, 21, 22, 23, 24, 25];
				this.debug(`Supreme Overlord boost: ${powMod[this.effectState.fallen]}/25`);
				return this.chainModify([powMod[this.effectState.fallen], 20]);
			}
		},
		flags: {breakable: 1},
	},

	// Akir
	takeitslow: {
		shortDesc: "Regenerator + Psychic Surge.",
		name: "Take it Slow",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onStart(source) {
			this.field.setTerrain('psychicterrain');
		},
		flags: {},
		gen: 9,
	},

	// Alex
	pawprints: {
		shortDesc: "Oblivious + status moves ignore abilities.",
		name: "Pawprints",
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Paw Prints');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Paw Prints');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Paw Prints');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Paw Prints');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Paw Prints', '[of] ' + target);
			}
		},
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
			}
		},
		flags: {breakable: 1},
	},

	// Alexander489
	confirmedtown: {
		shortDesc: "Technician + Protean.",
		name: "Confirmed Town",
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
			this.debug('Base Power: ' + basePowerAfterMultiplier);
			if (basePowerAfterMultiplier <= 60) {
				this.debug('Confirmed Town boost');
				return this.chainModify(1.5);
			}
		},
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Confirmed Town');
			}
		},
		flags: {},
	},

	// Appletun a la Mode
	servedcold: {
		shortDesc: "This Pokemon's Defense is raised 2 stages if hit by an Ice move; Ice immunity.",
		name: "Served Cold",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.boost({def: 2})) {
					this.add('-immune', target, '[from] ability: Served Cold');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// aQrator
	neverendingfhunt: {
		shortDesc: "This Pokemon's Status moves have priority raised by 1. Dark types are not immune.",
		name: "Neverending fHunt",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				return priority + 1;
			}
		},
		flags: {},
	},

	// A Quag To The Past
	quagofruin: {
		shortDesc: "Active Pokemon without this Ability have 0.85x Defense. Ignores abilities.",
		desc: "Active Pokemon without this Ability have their Defense multiplied by 0.85x. This Pokemon's moves and their effects ignore certain Abilities of other Pokemon.",
		name: "Quag of Ruin",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Quag of Ruin');
		},
		onAnyModifyDef(def, target, source, move) {
			if (!move) return;
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Quag of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Quag of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Quag of Ruin Def drop');
			return this.chainModify(0.85);
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		flags: {},
		gen: 9,
	},
	clodofruin: {
		shortDesc: "Active Pokemon without this Ability have 0.85x Attack. Ignores stat changes.",
		desc: "Active Pokemon without this Ability have their Attack multiplied by 0.85x. This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
		name: "Clod of Ruin",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Clod of Ruin');
		},
		onAnyModifyAtk(atk, target, source, move) {
			if (!move) return;
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Clod of Ruin')) return;
			if (!move.ruinedAtk?.hasAbility('Clod of Ruin')) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Clod of Ruin Atk drop');
			return this.chainModify(0.85);
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		flags: {breakable: 1},
		gen: 9,
	},

	// Archas
	saintlybullet: {
		shortDesc: "Snipe Shot always has STAB and heals the user by 1/8 (or 1/6 on a crit) of its max HP.",
		name: "Saintly Bullet",
		onModifyMove(move) {
			if (move.id === 'snipeshot') {
				move.forceSTAB = true;
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (move.id === 'snipeshot') {
				const ratio = source.getMoveHitData(move).crit ? 6 : 8;
				this.heal(source.maxhp / ratio, source);
			}
		},
		flags: {},
		gen: 9,
	},

	// Arcueid
	marblephantasm: {
		shortDesc: "Deoxys-Defense is immune to status moves/effects. Deoxys-Attack gains Fairy type.",
		desc: "If this Pokemon is a Deoxys-Defense, it is immune to status moves and cannot be afflicted with any non-volatile status condition. If this Pokemon is a Deoxys-Attack, it gains an additional Fairy typing for as long as this Ability remains active.",
		name: "Marble Phantasm",
		onStart(source) {
			if (source.species.name === "Deoxys-Attack" && source.setType(['Psychic', 'Fairy'])) {
				this.add('-start', source, 'typechange', source.getTypes(true).join('/'), '[from] ability: Marble Phantasm');
			} else if (source.species.name === "Deoxys-Defense" && source.setType('Psychic')) {
				this.add('-start', source, 'typechange', 'Psychic', '[from] ability: Marble Phantasm');
			}
		},
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source && target.species.name === "Deoxys-Defense") {
				this.add('-immune', target, '[from] ability: Marble Phantasm');
				return null;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target.species.name === "Deoxys-Defense") {
				this.add('-immune', target, '[from] ability: Marble Phantasm');
				return false;
			}
		},
		flags: {},
		gen: 9,
	},

	// Arsenal
	onemore: {
		shortDesc: "Super effective and critical hits cause this Pokemon to flinch.",
		name: "One More",
		onHit(target, source, move) {
			const hitData = target.getMoveHitData(move);
			if (move.category === "Status" || hitData.typeMod <= 0 || !hitData.crit) return;
			if (!move.secondaries) move.secondaries = [];
			move.secondaries.push({
				chance: 100,
				volatileStatus: 'flinch',
			});
		},
		flags: {},
		gen: 9,
	},

	// Artemis
	supervisedlearning: {
		shortDesc: "Unaware + Clear Body.",
		name: "Supervised Learning",
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "unboost", "[from] ability: Supervised Learning", "[of] " + target);
			}
		},
		flags: {},
		gen: 9,
	},

	// ausma
	cascade: {
		shortDesc: "Switches out when below 50% HP. First re-entry gives +1 Def/SpD and +3 Spe.",
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it immediately switches out to a chosen ally. When this Pokemon next enters the field, its Defense and Special Defense are boosted by 1 stage and its Speed is boosted by 3 stages.",
		name: "Cascade",
		onEmergencyExit(target) {
			if (target.volatiles['sigilsstorm']?.lostFocus) {
				// delays the switch-out if using sigil's storm and it fails, such that the switch happens after trick room is used.
				this.effectState.cascadeSigil = true;
			} else {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				for (const active of this.getAllActive()) {
					active.switchFlag = false;
				}
				target.switchFlag = true;
				if (this.effectState.cascade === undefined) {
					this.effectState.cascade = 1;
				} else {
					this.effectState.cascade = 0;
				}
				this.add(`c:|${getName('ausma')}|uuuuuuuuuuuuuuuuuuuuuuuuugggggghhhhhhhh [dizzy sound effect] sec bitte`);
				this.add('-activate', target, 'ability: Cascade');
				target.m.cascade = true;
			}
		},
		onSwitchIn() {
			if (this.effectState.cascade) {
				this.boost({def: 1, spd: 1, spe: 3});
				this.add(`c:|${getName('ausma')}|ok i got my coffee yall mfs r about to face the wrath of Big Stall™`);
				this.effectState.cascade = 0;
			}
			delete this.effectState.cascadeSigil;
		},
		onResidual(target, source, effect) {
			if (this.effectState.cascadeSigil) {
				delete this.effectState.cascadeSigil;
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				for (const active of this.getAllActive()) {
					active.switchFlag = false;
				}
				target.switchFlag = true;
				if (this.effectState.cascade === undefined) {
					this.effectState.cascade = 1;
				} else {
					this.effectState.cascade = 0;
				}
				this.add(`c:|${getName('ausma')}|uuuuuuuuuuuuuuuuuuuuuuuuugggggghhhhhhhh [dizzy sound effect] sec bitte`);
				this.add('-activate', target, 'ability: Cascade');
			}
		},
		flags: {},
	},

	// blazeofvictory
	prismaticlens: {
		shortDesc: "Pixilate + Tinted Lens.",
		name: "Prismatic Lens",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		flags: {},
	},

	// Blitz
	blitzofruin: {
		shortDesc: "Dazzling + active Pokemon without this Ability have 0.75x Speed.",
		desc: "Active Pokemon without this Ability have their Speed multiplied by 0.75x. This Pokemon is protected from opposing priority moves.",
		name: "Blitz of Ruin",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Blitz of Ruin');
			this.add('-message', `${pokemon.name}'s Blitz of Ruin lowered the Speed of all surrounding Pokémon!`);
		},
		onAnyModifySpe(spe, pokemon) {
			if (!pokemon.hasAbility('Blitz of Ruin')) {
				return this.chainModify(0.75);
			}
		},
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', target, 'ability: Blitz of Ruin', move, '[of] ' + source);
				return false;
			}
		},
		flags: {breakable: 1},
	},

	// Breadstycks
	painfulexit: {
		shortDesc: "When this Pokemon switches out, foes lose 25% HP.",
		name: "Painful Exit",
		onBeforeSwitchOutPriority: -1,
		onBeforeSwitchOut(pokemon) {
			if (enemyStaff(pokemon) === "Mad Monty") {
				this.add(`c:|${getName('Breadstycks')}|Welp`);
			} else {
				this.add(`c:|${getName('Breadstycks')}|Just kidding!! Take this KNUCKLE SANDWICH`);
			}
			for (const foe of pokemon.foes()) {
				if (!foe || foe.fainted || !foe.hp) continue;
				this.add(`-anim`, pokemon, "Tackle", foe);
				this.damage(foe.hp / 4, foe, pokemon);
			}
		},
		flags: {},
	},

	// Chloe
	acetosa: {
		shortDesc: "This Pokemon's moves are changed to be Grass type and have 1.2x power.",
		name: "Acetosa",
		onModifyTypePriority: 1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (!(move.isZ && move.category !== 'Status') && !noModifyType.includes(move.id) &&
				!(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Grass';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
	},

	// Clefable
	thatshacked: {
		shortDesc: "Tries to inflict the foe with Torment at the end of each turn.",
		name: "That's Hacked",
		onResidual(target, source, effect) {
			if (!target.foes()?.length) return;
			const abilMessages = [
				"All hacks and hacking methods are banned!",
				"Can't be having that.",
				"Naaah, miss me with that shit.",
				"Bit bullshit that, mate.",
				"Wait, thats illegal!",
				"Nope.",
				"I can't believe you've done this.",
				"No thank you.",
				"Seems a bit suss.",
				"Thats probably hacked, shouldnt use it here.",
				"Hacks will get you banned.",
				"You silly sausage",
				"Can you not?",
				"Yeah, thats a no from me.",
				"Lets not",
				"No fun allowed",
			];
			this.add(`c:|${getName((target.illusion || target).name)}|${this.sample(abilMessages)}`);
			for (const foe of target.foes()) {
				if (foe && !foe.volatiles['torment']) {
					foe.addVolatile('torment');
				}
			}
		},
		flags: {},
	},

	// Clementine
	meltingpoint: {
		shortDesc: "+2 Speed. Fire moves change user to Water type. Fire immunity.",
		name: "Melting Point",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (target.setType('Water')) {
					this.add('-start', target, 'typechange', 'Water', '[from] ability: Melting Point');
					this.boost({spe: 2}, target, source, this.dex.abilities.get('meltingpoint'));
				} else {
					this.add('-immune', target, '[from] ability: Melting Point');
				}
				return null;
			}
		},
	},

	// clerica
	masquerade: {
		shortDesc: "(Mimikyu only) The first hit is blocked: instead, takes 1/8 damage and gets +1 Atk/Spe.",
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, it changes to Busted Form, its Attack and Speed are boosted by 1 stage, and it loses 1/8 of its max HP. Confusion damage also breaks the disguise.",
		name: "Masquerade",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' &&
				['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed
			) {
				this.add('-activate', target, 'ability: Masquerade');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.species.get(speciesid));
				this.boost({atk: 1, spe: 1});
				this.add(`c:|${getName('clerica')}|oop`);
			}
		},
		flags: {breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
	},

	// Clouds
	jetstream: {
		shortDesc: "Delta Stream + Stealth Rock immunity.",
		name: "Jet Stream",
		onStart(source) {
			this.field.setWeather('deltastream');
			this.add('message',	`Strong air currents keep Flying-types ahead of the chase!`);
		},
		onAnySetWeather(target, source, weather) {
			if (this.field.isWeather('deltastream') && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility(['deltastream', 'jetstream'])) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.name === 'Stealth Rock') {
				return false;
			}
		},
		flags: {breakable: 1},
	},

	// Coolcodename
	firewall: {
		shortDesc: "Burns foes that attempt to use status moves on this Pokemon; Status move immunity.",
		name: "Firewall",
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source) {
				if (!source.trySetStatus('brn', target)) {
					this.add('-immune', target, '[from] ability: Firewall');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// Corthius
	grassyemperor: {
		shortDesc: "On switch-in, summons Grassy Terrain. During Grassy Terrain, Attack is 1.33x.",
		name: "Grassy Emperor",
		onStart(pokemon) {
			if (this.field.setTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'Grassy Emperor', '[source]');
			} else if (this.field.isTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'ability: Grassy Emperor');
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Grassy Emperor boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: {},
	},

	// Dawn of Artemis
	formchange: {
		shortDesc: ">50% HP Necrozma, else Necrozma-Ultra. SpA boosts become Atk boosts and vice versa.",
		desc: "If this Pokemon is a Necrozma, it changes to Necrozma-Ultra and switches its Attack and Special Attack stat stage changes if it has 1/2 or less of its maximum HP at the end of a turn. If Necrozma-Ultra's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Necrozma and switches its Attack and Special Attack stat stage changes.",
		name: "Form Change",
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Necrozma' || pokemon.transformed || !pokemon.hp) return;
			let newSet = 'Dawn of Artemis';
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.id === 'necrozma') return;
				this.add(`c:|${getName('Dawn of Artemis')}|Good, I'm healthy again, time to swap back.`);
			} else {
				if (pokemon.species.id === 'necrozmaultra') return;
				this.add(`c:|${getName('Dawn of Artemis')}|Time for me to transform and you to witness the power of Ares now!`);
				newSet += '-Ultra';
			}
			this.add('-activate', pokemon, 'ability: Form Change');
			changeSet(this, pokemon, ssbSets[newSet]);
			[pokemon.boosts['atk'], pokemon.boosts['spa']] = [pokemon.boosts['spa'], pokemon.boosts['atk']];
			this.add('-setboost', pokemon, 'spa', pokemon.boosts['spa'], '[silent]');
			this.add('-setboost', pokemon, 'atk', pokemon.boosts['atk'], '[silent]');
			this.add('-message', `${pokemon.name} swapped its Attack and Special Attack boosts!`);
		},
		flags: {},
	},

	// DaWoblefet
	shadowartifice: {
		shortDesc: "Traps adjacent foes. If KOed with a move, that move's user loses an equal amount of HP.",
		name: "Shadow Artifice",
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.hasAbility(['shadowtag', 'shadowartifice']) && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.hasAbility(['shadowtag', 'shadowartifice'])) {
				pokemon.maybeTrapped = true;
			}
		},
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				this.damage(target.getUndynamaxedHP(damage), source, target);
			}
		},
		flags: {},
	},

	// dhelmise
	coalescence: {
		shortDesc: "Moves drain 37%. Allies heal 5% HP. <25% HP, moves drain 114%, allies get 10%.",
		desc: "All moves heal 37% of damage dealt. Unfainted allies heal 5% HP at the end of each turn. If this Pokemon's HP is less than 25%, moves heal 114% of damage dealt, and allies restore 10% of their health.",
		name: "Coalescence",
		onModifyMove(move, source, target) {
			if (move.category !== "Status") {
				// move.flags['heal'] = 1; // For Heal Block
				if (source.hp > source.maxhp / 4) {
					move.drain = [37, 100];
				} else {
					move.drain = [114, 100];
				}
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			for (const ally of pokemon.side.pokemon) {
				if (!ally.hp || ally === pokemon) continue;
				this.heal(ally.baseMaxhp * (pokemon.hp > pokemon.maxhp / 4 ? 5 : 10) / 100, ally, pokemon);
			}
		},
		flags: {},
	},

	// DianaNicole
	snowproblem: {
		shortDesc: "On switch-in, this Pokemon summons snow and its Sp. Atk is raised by 1 stage.",
		name: "Snow Problem",
		onStart(source) {
			this.field.setWeather('snow');
			this.boost({spa: 1}, source);
		},
		flags: {},
	},

	// Elly
	stormsurge: {
		shortDesc: "On switch-in, summons rain that causes wind moves to have perfect accuracy and 1.2x Base Power.",
		desc: "Summons the Storm Surge weather on switch-in. While Storm Surge is active, wind moves used by any Pokemon are perfectly accurate and become 20% stronger. Water moves are 50% stronger, Fire moves are 50% weaker.",
		name: "Storm Surge",
		onStart(source) {
			this.field.setWeather('stormsurge');
		},
	},

	// Emboar02
	hogwash: {
		shortDesc: "Reckless; on STAB moves, also add Rock Head. On non-STAB moves, recoil is recovery.",
		desc: "This Pokemon's attacks that would normally have recoil or crash damage have their power multiplied by 1.2. Does not affect Struggle. STAB recoil attacks used by this Pokemon do not deal recoil damage to the user. Non-STAB recoil attacks used by this Pokemon will heal the user instead of dealing recoil damage.",
		name: "Hogwash",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) {
				this.debug('Hogwash boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') {
					if (!source.hasType(this.activeMove.type)) this.heal(damage);
					return null;
				}
			}
		},
	},

	// Frostyicelad
	almostfrosty: {
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved.",
		name: "Almost Frosty",
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
	},

	// Frozoid
	snowballer: {
		shortDesc: "This Pokemon's Attack is raised 1 stage if hit by an Ice move; Ice immunity.",
		name: "Snowballer",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[from] ability: Snowballer');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// Fame
	socialjumpluffwarrior: {
		shortDesc: "Serene Grace + Mold Breaker.",
		name: "Social Jumpluff Warrior",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Social Jumpluff Warrior');
		},
		onModifyMovePriority: -2,
		onModifyMove(move) {
			move.ignoreAbility = true;
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		flags: {},
	},

	// Ganjafin
	gamblingaddiction: {
		shortDesc: "When under 1/4 max HP: +1 Spe, heal to full HP, and all moves become Final Gambit.",
		name: "Gambling Addiction",
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.gamblingAddiction && pokemon.hp && pokemon.hp < pokemon.maxhp / 4) {
				this.boost({spe: 1});
				this.heal(pokemon.maxhp);
				const move = this.dex.moves.get('finalgambit');
				const finalGambit = {
					move: move.name,
					id: move.id,
					pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
					maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
					target: move.target,
					disabled: false,
					used: false,
				};
				pokemon.moveSlots.fill(finalGambit);
				pokemon.baseMoveSlots.fill(finalGambit);
				this.effectState.gamblingAddiction = true;
			}
		},
		flags: {},
	},

	// Goro Yagami
	illusionmaster: {
		shortDesc: "This Pokemon has an illusion until it falls below 33% health.",
		name: "Illusion Master",
		onBeforeSwitchIn(pokemon) {
			pokemon.illusion = null;
			// yes, you can Illusion an active pokemon but only if it's to your right
			for (let i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				const possibleTarget = pokemon.side.pokemon[i];
				if (!possibleTarget.fainted) {
					// If Ogerpon is in the last slot while the Illusion Pokemon is Terastallized
					// Illusion will not disguise as anything
					if (!pokemon.terastallized || possibleTarget.species.baseSpecies !== 'Ogerpon') {
						pokemon.illusion = possibleTarget;
					}
					break;
				}
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (target.illusion && target.hp < (target.maxhp / 3)) {
				this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move);
			}
		},
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion master cleared');
				let disguisedAs = this.toID(pokemon.illusion.name);
				pokemon.illusion = null;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				if (this.ruleTable.has('illusionlevelmod')) {
					this.hint("Illusion Level Mod is active, so this Pok\u00e9mon's true level was hidden.", true);
				}
				// Handle various POKEMON.
				if (this.dex.species.get(disguisedAs).exists || this.dex.moves.get(disguisedAs).exists ||
					this.dex.abilities.get(disguisedAs).exists || disguisedAs === 'blitz') {
					disguisedAs += 'user';
				}
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[this.toID(pokemon.set.name)]) {
					const status = this.dex.conditions.get(this.toID(pokemon.set.name));
					if (status?.exists) {
						pokemon.addVolatile(this.toID(pokemon.set.name), pokemon);
					}
				}
			}
		},
		onFaint(pokemon) {
			pokemon.illusion = null;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1},
	},

	// havi
	mensiscage: {
		shortDesc: "Immune to status and is considered to be asleep. 30% chance to Disable when hit.",
		name: "Mensis Cage",
		onDamagingHit(damage, target, source, move) {
			if (source.volatiles['disable']) return;
			if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') {
				if (this.randomChance(3, 10)) {
					source.addVolatile('disable', this.effectState.target);
				}
			}
		},
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Mensis Cage');
		},
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Mensis Cage');
			}
			return false;
		},
		// Permanent sleep "status" implemented in the relevant sleep-checking effects
		flags: {},
	},

	// Hecate
	hacking: {
		name: "Hacking",
		shortDesc: "Hacks into PS and finds out if the enemy has any super effective moves.",
		onStart(pokemon) {
			const name = (pokemon.illusion || pokemon).name;
			this.add(`c:|${getName(name)}|One moment, please. One does not simply go into battle blind.`);
			const side = pokemon.side.id === 'p1' ? 'p2' : 'p1';
			this.add(
				`message`,
				(
					`ssh sim@pokemonshowdown.com && nc -U logs/repl/sim <<< ` +
					`"Users.get('${this.toID(name)}').popup(battle.sides.get('${side}').pokemon.map(m => Teams.exportSet(m)))"`
				)
			);
			let warnMoves: (Move | Pokemon)[][] = [];
			let warnBp = 1;
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 150;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (bp === 1) bp = 80;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, target]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, target]);
					}
				}
			}
			if (!warnMoves.length) {
				this.add(`c:|${getName(name)}|Fascinating. None of your sets have any moves of interest.`);
				return;
			}
			const [warnMoveName, warnTarget] = this.sample(warnMoves);
			this.add(
				'message',
				`${name} hacked into PS and looked at ${name === 'Hecate' ? 'her' : 'their'} opponent's sets. ` +
					`${warnTarget.name}'s move ${warnMoveName} drew ${name === 'Hecate' ? 'her' : 'their'} eye.`
			);
			this.add(`c:|${getName(name)}|Interesting. With that in mind, bring it!`);
		},
		flags: {},
	},

	// HoeenHero
	misspelled: {
		shortDesc: "Special Attack 1.5x, Accuracy 0.8x. Never misses, only misspells moves.",
		name: "Misspelled",
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.modify(spa, 1.5);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Special' && typeof accuracy === 'number') {
				return this.chainModify([3277, 4096]);
			}
		},
		// Misspelling implemented in scripts.ts#hitStepAccuracy
		flags: {},
	},

	// Hydrostatics
	hydrostaticpositivity: {
		shortDesc: "Sturdy + Storm Drain + Motor Drive + 1.3x accuracy of Water & Electric moves",
		name: "Hydrostatic Positivity",
		onTryHit(target, source, move) {
			// Storm Drain
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[from] ability: Hydrostatic Positivity');
				}
				return null;
			}

			// Motor Drive
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spe: 1})) {
					this.add('-immune', target, '[from] ability: Hydrostatic Positivity');
				}
				return null;
			}

			// Sturdy
			if (move.ohko) {
				this.add('-immune', target, '[from] ability: Hydrostatic Positivity');
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			// Storm Drain
			if (move.type !== 'Water' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Hydrostatic Positivity');
				}
				return this.effectState.target;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			// Sturdy
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Hydrostatic Positivity');
				return target.hp - 1;
			}
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy !== 'number') return;
			if (['Electric', 'Water'].includes(move.type)) {
				this.debug('Hydrostatic Positivity - enhancing accuracy');
				return this.chainModify([5325, 4096]);
			}
		},
	},

	// in the hills
	illiterit: {
		shortDesc: "Immune to moves with 12 or more alphanumeric characters.",
		name: "Illiterit",
		onTryHit(target, source, move) {
			if (target !== source && move.id.length >= 12) {
				this.add('-immune', target, '[from] ability: Illiterit');
				this.add(`c:|${getName('in the hills')}|Gee ${source.name}, maybe I should get a dictionary so I can understand what move you just used.`);
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// Irpachuza
	mimeknowsbest: {
		shortDesc: "When this Pokemon switches in, it uses a random screen or protect move.",
		desc: "When this Pokemon switches in, it will randomly use one of Light Screen, Reflect, Protect, Detect, Barrier, Spiky Shield, Baneful Bunker, Safeguard, Mist, King's Shield, Magic Coat, or Aurora Veil.",
		name: "Mime knows best",
		onStart(target) {
			const randomMove = [
				"Light Screen", "Reflect", "Protect", "Detect", "Barrier", "Spiky Shield", "Baneful Bunker",
				"Safeguard", "Mist", "King's Shield", "Magic Coat", "Aurora Veil",
			];
			const move = this.dex.getActiveMove(this.sample(randomMove));
			// allows use of Aurora Veil without hail
			if (move.name === "Aurora Veil") delete move.onTry;
			this.actions.useMove(move, target);
		},
		flags: {},
	},

	// J0rdy004
	fortifyingfrost: {
		shortDesc: "If Snow is active, this Pokemon's Sp. Atk and Sp. Def are 1.5x.",
		name: "Fortifying Frost",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
	},

	// kenn
	deserteddunes: {
		shortDesc: "Summons Deserted Dunes until switch-out; Sandstorm + Rock weaknesses removed.",
		desc: "On switch-in, the weather becomes Deserted Dunes, which removes the weaknesses of the Rock type from Rock-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by the Desolate Land, Primordial Sea or Delta Stream Abilities.",
		name: "Deserted Dunes",
		onStart(source) {
			this.field.setWeather('deserteddunes');
		},
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'deserteddunes' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('deserteddunes')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		flags: {},
		gen: 9,
	},

	// Kennedy
	anfield: {
		shortDesc: "Clears terrain/hazards/pseudo weathers. Summons Anfield Atmosphere.",
		name: "Anfield",
		onStart(target) {
			let success = false;
			if (this.field.terrain) {
				success = this.field.clearTerrain();
			}
			for (const side of this.sides) {
				const remove = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				for (const sideCondition of remove) {
					if (side.removeSideCondition(sideCondition)) {
						success = true;
					}
				}
			}
			if (Object.keys(this.field.pseudoWeather).length) {
				for (const pseudoWeather in this.field.pseudoWeather) {
					if (this.field.removePseudoWeather(pseudoWeather)) success = true;
				}
			}
			if (success) {
				this.add('-activate', target, 'ability: Anfield');
			}
			this.field.addPseudoWeather('anfieldatmosphere', target, target.getAbility());
		},
		flags: {},
	},
	youllneverwalkalone: {
		shortDesc: "Boosts Atk, Def, SpD, and Spe by 25% under Anfield Atmosphere.",
		name: "You'll Never Walk Alone",
		onStart(pokemon) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.add('-ability', pokemon, 'You\'ll Never Walk Alone');
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, source, target, move) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone atk boost');
				return this.chainModify([5120, 4096]);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, target, source, move) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone def boost');
				return this.chainModify([5120, 4096]);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, target, source, move) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone spd boost');
				return this.chainModify([5120, 4096]);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone spe boost');
				return this.chainModify([5120, 4096]);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
	},

	// kingbaruk
	peerpressure: {
		shortDesc: "All moves used while this Pokemon is on the field consume 4 PP.",
		name: "Peer Pressure",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Peer Pressure');
		},
		onAnyDeductPP(target, source) {
			return 3;
		},
		flags: {},
	},

	// Kiwi
	surehitsorcery: {
		shortDesc: "No Guard + Prankster + Grassy Surge.",
		name: "Sure Hit Sorcery",
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		onStart(source) {
			this.field.setTerrain('grassyterrain');
		},
		flags: {},
	},

	// Klmondo
	superskilled: {
		shortDesc: "Skill Link + Multiscale.",
		name: "Super Skilled",
		onModifyMove(move) {
			if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// Kry
	flashfreeze: {
		shortDesc: "Heatproof + If attacker's used offensive stat has positive stat changes, take 0.75x damage.",
		name: "Flash Freeze",
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof Atk weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof SpA weaken');
				return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 2;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (
				(move.category === 'Special' && source.boosts['spa'] > 0) ||
				(move.category === 'Physical' && source.boosts['atk'] > 0)
			) {
				return this.chainModify(0.75);
			}
		},
		flags: {breakable: 1},
	},

	// Lasen
	idealizedworld: {
		shortDesc: "Removes everything on switch-in.",
		desc: "When this Pokemon switches in, all stat boosts, entry hazards, weathers, terrains, persistent weathers (such as Primordial Sea), and any other field effects (such as Aurora Veil) are removed from all sides of the field.",
		name: "Idealized World",
		onStart(pokemon) {
			const target = pokemon.side.foe;
			this.add('-ability', pokemon, 'Idealized World');
			const displayText = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const targetCondition of Object.keys(target.sideConditions)) {
				if (target.removeSideCondition(targetCondition) && displayText.includes(targetCondition)) {
					this.add('-sideend', target, this.dex.conditions.get(targetCondition).name, '[from] ability: Idealized World', '[of] ' + pokemon);
				}
			}
			for (const sideCondition of Object.keys(pokemon.side.sideConditions)) {
				if (pokemon.side.removeSideCondition(sideCondition) && displayText.includes(sideCondition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(sideCondition).name, '[from] ability: Idealized World', '[of] ' + pokemon);
				}
			}
			this.field.clearTerrain();
			this.field.clearWeather();
			for (const pseudoWeather of Object.keys(this.field.pseudoWeather)) {
				this.field.removePseudoWeather(pseudoWeather);
			}
			this.add('-clearallboost');
			for (const poke of this.getAllActive()) {
				poke.clearBoosts();
			}
		},
		flags: {},
	},

	// Lionyx
	enormoos: {
		shortDesc: "This Pokemon's Defense is used in damage calculation instead of Attack or Sp. Atk.",
		name: "EnorMOOs",
		onModifyMove(move, pokemon, target) {
			if (move.category !== "Status") {
				move.overrideOffensiveStat = 'def';
			}
		},
		flags: {},
	},

	// Lumari
	pyrotechnic: {
		shortDesc: "Critical hits are guaranteed when the foe is burned.",
		name: "Pyrotechnic",
		onModifyCritRatio(critRatio, source, target) {
			if (target?.status === 'brn') return 5;
		},
		flags: {},
	},

	// Lunell
	lowtidehightide: {
		shortDesc: "Switch-in sets Gravity, immune to Water, traps Water-type foes.",
		name: "Low Tide, High Tide",
		onStart(source) {
			this.field.addPseudoWeather('gravity', source);
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				this.add('-immune', target, '[from] ability: Low Tide, High Tide');
				return null;
			}
		},
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType('Water') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.knownType || pokemon.hasType('Water')) {
				pokemon.maybeTrapped = true;
			}
		},
		flags: {breakable: 1},
	},

	// Lyna
	magicaura: {
		shortDesc: "Magic Guard + Magic Bounce.",
		name: "Magic Aura",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, source);
			return null;
		},
		condition: {
			duration: 1,
		},
		flags: {breakable: 1},
	},

	// Mad Monty
	climatechange: {
		shortDesc: "1.5x SpA in sun, 1.5x Def/SpD in snow, heals 50% in rain. Changes forme/weather.",
		desc: "If this Pokemon is a Castform, it changes the active weather and therefore this Pokemon's forme and set at the end of each turn, alternating between sun, rain, and snow in that order. When the weather is sun, this Pokemon's Special Attack is multiplied by 1.5x. When the weather becomes rain, this Pokemon heals for 1/2 of its maximum HP. When the weather is snow, this Pokemon's Defense and Special Defense are multiplied by 1.5x.",
		name: "Climate Change",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
				this.field.setWeather('raindance');
				break;
			case 'raindance':
				this.field.setWeather('snow');
				break;
			default:
				this.field.setWeather('sunnyday');
				break;
			}
		},
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			let relevantMove = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') {
					forme = 'Castform-Sunny';
					relevantMove = 'Solar Beam';
				}
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
				if (pokemon.species.id !== 'castformrainy') {
					forme = 'Castform-Rainy';
					relevantMove = 'Thunder';
					this.heal(pokemon.baseMaxhp / 2);
				}
				break;
			case 'hail':
			case 'snow':
				if (pokemon.species.id !== 'castformsnowy') {
					forme = 'Castform-Snowy';
					relevantMove = 'Aurora Veil';
				}
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');

				if (!relevantMove) return;
				const move = this.dex.moves.get(relevantMove);

				const sketchIndex = Math.max(
					pokemon.moves.indexOf("solarbeam"), pokemon.moves.indexOf("thunder"), pokemon.moves.indexOf("auroraveil")
				);
				if (sketchIndex < 0) return;
				const carryOver = pokemon.moveSlots[sketchIndex].pp / pokemon.moveSlots[sketchIndex].maxpp;
				const sketchedMove = {
					move: move.name,
					id: move.id,
					pp: Math.floor((move.pp * 8 / 5) * carryOver),
					maxpp: (move.pp * 8 / 5),
					target: move.target,
					disabled: false,
					used: false,
				};
				pokemon.moveSlots[sketchIndex] = sketchedMove;
				pokemon.baseMoveSlots[sketchIndex] = sketchedMove;
			}
		},
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifyDef(def, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
	},

	// maroon
	builtdifferent: {
		shortDesc: "Stamina + Normal-type moves get +1 priority.",
		name: "Built Different",
		onDamagingHit(damage, target, source, effect) {
			this.boost({def: 1});
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Normal') return priority + 1;
		},
		flags: {},
	},

	// Mathy
	dynamictyping: {
		shortDesc: "Moves used by all Pokemon are ??? type.",
		name: "Dynamic Typing",
		onStart(pokemon) {
			this.add('-ability', pokemon, "Dynamic Typing");
		},
		onModifyTypePriority: 2,
		onAnyModifyType(move, pokemon, target) {
			move.type = "???";
		},
		flags: {},
	},

	// Mex
	timedilation: {
		shortDesc: "+10% BP for every 10 turns passed in battle, max 200%.",
		name: "Time Dilation",
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			const turnMultiplier = Math.floor(this.turn / 10);
			let bpMod = 1 + (0.1 * turnMultiplier);
			if (bpMod > 2) bpMod = 2;
			return this.chainModify(bpMod);
		},
		flags: {},
	},

	// Monkey
	harambehit: {
		shortDesc: "Unseen Fist + Iron Fist.",
		name: "Harambe Hit",
		onModifyMove(move) {
			if (move.flags['contact']) delete move.flags['protect'];
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Harambe Hit boost');
				return this.chainModify([4915, 4096]);
			}
		},
		flags: {},
	},

	// MyPearl
	eoncall: {
		shortDesc: "Changes into Latios after status move, Latias after special move.",
		desc: "If this Pokemon is a Latios, it changes into Latias after using a status move. If this Pokemon is a Latias, it changes into Latios after using a special attack.",
		name: "Eon Call",
		onAfterMove(source, target, move) {
			if (move.category === 'Status' && source.species.baseSpecies === 'Latias') {
				changeSet(this, source, ssbSets['MyPearl'], true);
			} else if (move.category === 'Special' && source.species.baseSpecies === 'Latios') {
				changeSet(this, source, ssbSets['MyPearl-Latias'], true);
			}
		},
		flags: {},
	},

	// Ney
	pranksterplus: {
		shortDesc: "This Pokemon's Status moves have priority raised by 1. Dark types are not immune.",
		name: "Prankster Plus",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				return priority + 1;
			}
		},
		flags: {},
	},

	// Notater517
	ventcrosser: {
		shortDesc: "Uses Baton Pass after every move.",
		name: "Vent Crosser",
		onAfterMove(source, target, move) {
			this.actions.useMove('Baton Pass', source);
		},
		flags: {},
	},

	// nya
	adorablegrace: {
		shortDesc: "This Pokemon's secondary effects and certain items have their activation chance doubled.",
		desc: "This Pokemon's secondary effects of attacks, as well as the effects of chance based items like Focus Band and King's Rock, have their activation chance doubled.",
		name: "Adorable Grace",
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		// Item chances modified in items.js
	},

	// Nyx
	lasthymn: {
		shortDesc: "Weakens incoming attacks by 10% for each Pokemon fainted.",
		name: "Last Hymn",
		onStart(pokemon) {
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: Last Hymn');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onFoeBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				return this.chainModify([10, (10 + this.effectState.fallen)]);
			}
		},
	},

	// Opple
	orchardsgift: {
		shortDesc: "Summons Grassy Terrain. 1.5x Sp. Atk and Sp. Def during Grassy Terrain.",
		name: "Orchard's Gift",
		onStart(pokemon) {
			if (this.field.setTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'Orchard\'s Gift', '[source]');
			} else if (this.field.isTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'ability: Orchard\'s Gift');
			}
		},
		onModifyAtkPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Orchard\'s Gift boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Orchard\'s Gift boost');
				return this.chainModify(1.5);
			}
		},
	},

	// PartMan
	ctiershitposter: {
		shortDesc: "-1 Atk/SpA, +1 Def/SpD. +1 Atk/SpA/Spe, -1 Def/SpD, Mold Breaker if 420+ dmg taken.",
		desc: "When this Pokemon switches in, its Defense and Special Defense are boosted by 1 stage and its Attack and Special Attack are lowered by 1 stage. Once this Pokemon has taken total damage throughout the battle equal to or greater than 420 HP, it instead ignores the Abilities of opposing Pokemon when attacking and its existing stat stage changes are cleared. After this and whenever it gets sent out from this point onwards, this Pokemon boosts its Attack, Special Attack, and Speed by 1 stage, and lowers its Defense and Special Defense by 1 stage.",
		name: "C- Tier Shitposter",
		onDamage(damage, target, source, effect) {
			target.m.damageTaken ??= 0;
			target.m.damageTaken += damage;
			if (target.set && !target.set.shiny) {
				if (target.m.damageTaken >= 420) {
					target.set.shiny = true;
					if (!target.hp) {
						return this.add(`c:|${getName('PartMan')}|MWAHAHA NOW YOU - oh I'm dead`);
					}
					this.add(`c:|${getName('PartMan')}|That's it. Get ready to be rapid-fire hugged.`);
					target.clearBoosts();
					this.add('-clearboost', target);
					this.boost({atk: 1, def: -1, spa: 1, spd: -1, spe: 1});
					const details = target.species.name + (target.level === 100 ? '' : ', L' + target.level) +
						(target.gender === '' ? '' : ', ' + target.gender) + (target.set.shiny ? ', shiny' : '');
					target.details = details;
					this.add('detailschange', target, details);
				}
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.set.shiny) move.ignoreAbility = true;
		},
		onStart(pokemon) {
			if (!pokemon.set.shiny) {
				this.boost({atk: -1, def: 1, spa: -1, spd: 1});
			} else {
				this.boost({atk: 1, def: -1, spa: 1, spd: -1, spe: 1});
			}
		},
	},

	// PenQuin
	poleonspyroquirk: {
		shortDesc: "Burned Pokemon also become confused.",
		name: "'Poleon's Pyro Quirk",
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'brn') {
				target.addVolatile('confusion');
			}
		},
		flags: {},
	},

	// phoopes
	ididitagain: {
		shortDesc: "Bypasses Sleep Clause Mod once per battle.",
		name: "I Did It Again",
		flags: {},
		// implemented in rulesets.ts
	},

	// Pulse_kS
	pulseluck: {
		shortDesc: "Mega Launcher + Super Luck.",
		name: "Pulse Luck",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(1.5);
			}
		},
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		flags: {},
	},

	// PYRO
	hardcorehustle: {
		shortDesc: "Moves have 15% more power and -5% Acc for each fainted ally, up to 5 allies.",
		name: "Hardcore Hustle",
		onStart(pokemon) {
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: Hardcore Hustle');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [1, 1.15, 1.3, 1.45, 1.6, 1.75];
				this.debug(`Hardcore Hustle boost: ${powMod[this.effectState.fallen]}`);
				return this.chainModify(powMod[this.effectState.fallen]);
			}
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (this.effectState.fallen) {
				const accMod = [1, 0.95, 0.90, 0.85, 0.80, 0.75];
				this.debug(`Hardcore Hustle debuff: ${accMod[this.effectState.fallen]}`);
				return this.chainModify(accMod[this.effectState.fallen]);
			}
		},
		flags: {},
	},

	// Quite Quiet
	fancyscarf: {
		shortDesc: "Shield Dust + Magic Guard",
		name: "Fancy Scarf",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifySecondaries(secondaries) {
			this.debug('Fancy Scarf prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		flags: {},
	},

	// quziel
	highperformancecomputing: {
		shortDesc: "Becomes a random typing at the beginning of each turn.",
		name: "High Performance Computing",
		flags: {},
		onBeforeTurn(source) {
			if (source.terastallized) return;
			const type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar'));
			source.setType(type);
			this.add('-start', source, 'typechange', type, '[from] ability: High Performance Computing');
		},
	},

	// R8
	antipelau: {
		shortDesc: "Boosts Sp. Atk by 2 and sets a 25% Wish upon switch-in.",
		name: "Anti-Pelau",
		onStart(target) {
			this.boost({spa: 2}, target);
			const wish = this.dex.getActiveMove('wish');
			wish.condition = {
				duration: 2,
				onStart(pokemon, source) {
					this.effectState.hp = source.maxhp / 4;
				},
				onResidualOrder: 4,
				onEnd(pokemon) {
					if (pokemon && !pokemon.fainted) {
						const damage = this.heal(this.effectState.hp, pokemon, pokemon);
						if (damage) {
							this.add('-heal', pokemon, pokemon.getHealth, '[from] move: Wish', '[wisher] ' + this.effectState.source.name);
						}
					}
				},
			};
			this.actions.useMove(wish, target);
		},
		flags: {},
	},

	// Rainshaft
	rainysaura: {
		shortDesc: "On switch-in, this Pokemon summons rain. Boosts all Psychic-type damage by 33%.",
		name: "Rainy's Aura",
		onStart(source) {
			if (this.suppressingAbility(source)) return;
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('raindance');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Psychic') return;
			if (!move.auraBooster?.hasAbility('Rainy\'s Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		flags: {},
	},

	// Ransei
	ultramystik: {
		shortDesc: "Stats 1.5x until hit super effectively + Magic Guard + Leftovers.",
		desc: "This Pokemon can only be damaged by direct attacks. At the end of each turn, this Pokemon restores 1/16 of its maximum HP. This Pokemon's Attack, Defense, Special Attack, Special Defense, and Speed are boosted by 1.5x if it has not been hit by a super effective attack during this battle.",
		name: "Ultra Mystik",
		onStart(target) {
			if (!this.effectState.superHit) {
				target.addVolatile('ultramystik');
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.effectState.superHit = true;
				target.removeVolatile('ultramystik');
			}
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				this.add('-activate', pokemon, 'ability: Ultra Mystik');
				this.add('-start', pokemon, 'ultramystik');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.5);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.5);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.5);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.5);
			},
			onModifySpe(spe, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Ultra Mystik');
			},
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon, pokemon.getAbility());
		},
	},

	// ReturnToMonkey
	monkeseemonkedo: {
		shortDesc: "Boosts Atk or SpA by 1 based on foe's defenses, then copies foe's Ability.",
		name: "Monke See Monke Do",
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.foes()) {
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa: 1});
			} else if (totalspd) {
				this.boost({atk: 1});
			}

			// n.b. only affects Hackmons
			// interaction with No Ability is complicated: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/page-76#post-7790209
			if (pokemon.adjacentFoes().some(foeActive => foeActive.ability === 'noability')) {
				this.effectState.gaveUp = true;
			}
			// interaction with Ability Shield is similar to No Ability
			if (pokemon.hasItem('Ability Shield')) {
				this.add('-block', pokemon, 'item: Ability Shield');
				this.effectState.gaveUp = true;
			}
		},
		onUpdate(pokemon) {
			if (!pokemon.isStarted || this.effectState.gaveUp) return;

			const possibleTargets = pokemon.adjacentFoes().filter(
				target => !target.getAbility().flags['notrace'] && target.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const target = this.sample(possibleTargets);
			const ability = target.getAbility();
			if (pokemon.setAbility(ability)) {
				this.add('-ability', pokemon, ability, '[from] ability: Monke See Monke Do', '[of] ' + target);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1},
	},

	// RSB
	hotpursuit: {
		shortDesc: "This Pokemon's damaging moves have the Pursuit effect.",
		name: "Hot Pursuit",
		onBeforeTurn(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('hotpursuit', pokemon);
				const data = side.getSideConditionData('hotpursuit');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onBasePower(relayVar, source, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		onTryHit(source, target) {
			target.side.removeSideCondition('hotpursuit');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				const move = this.queue.willMove(pokemon.foes()[0]);
				const moveName = move && move.moveid ? move.moveid.toString() : "";
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon.foes()[0], 'ability: Hot Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove(moveName, source, source.getLocOf(pokemon));
				}
			},
		},
		flags: {},
	},

	// Rumia
	youkaiofthedusk: {
		shortDesc: "This Pokemon's Defense is doubled and its status moves gain +1 priority.",
		name: "Youkai of the Dusk",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		flags: {},
	},

	// SexyMalasada
	ancestryritual: {
		shortDesc: "Recoil heals. While below 50% HP, changes to Typhlosion-Hisui.",
		desc: "Moves that would deal recoil or crash damage, aside from Struggle, heal this Pokemon for the corresponding amount instead. If this Pokemon is a Typhlosion, it changes to Typhlosion-Hisui if it has 1/2 or less of its maximum HP at the end of a turn. If Typhlosion-Hisui's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Typhlosion.",
		name: "Ancestry Ritual",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') {
					this.heal(damage);
					return null;
				}
			}
		},
		onResidualOrder: 20,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Typhlosion' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.species.id !== 'typhlosionhisui') {
				pokemon.formeChange('Typhlosion-Hisui');
			} else if (pokemon.hp > pokemon.maxhp / 2 && pokemon.species.id === 'typhlosionhisui') {
				pokemon.formeChange('Typhlosion');
			}
		},
		flags: {},
	},

	// Siegfried
	magicalmysterycharge: {
		shortDesc: "Summons Electric Terrain upon switch-in, +1 boost to Sp. Def during Electric Terrain.",
		name: "Magical Mystery Charge",
		onStart(source) {
			this.field.setTerrain('electricterrain');
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
	},

	// Sificon
	perfectlyimperfect: {
		shortDesc: "Magic Guard + Thick Fat.",
		name: "Perfectly Imperfect",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Perfectly Imperfect weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Perfectly Imperfect weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// skies
	spikesofwrath: {
		shortDesc: "Stamina + Cheek Pouch + sets Spikes and Toxic Spikes upon getting KOed.",
		name: "Spikes of Wrath",
		onDamagingHit(damage, target, source, effect) {
			if (target.hp) {
				this.boost({def: 1});
			} else {
				const side = source.isAlly(target) ? source.side.foe : source.side;
				const spikes = side.sideConditions['spikes'];
				const toxicSpikes = side.sideConditions['toxicspikes'];
				if (!spikes || spikes.layers < 3) {
					this.add('-activate', target, 'ability: Spikes of Wrath');
					side.addSideCondition('spikes', target);
				}
				if (!toxicSpikes || toxicSpikes.layers < 2) {
					this.add('-activate', target, 'ability: Spikes of Wrath');
					side.addSideCondition('toxicspikes', target);
				}
			}
		},
		onEatItem(item, pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
		},
		flags: {},
	},

	// Soft Flex
	adaptiveengineering: {
		shortDesc: "Every turn, raises a random stat by 1 stage if the foe has more raised stats.",
		name: "Adaptive Engineering",
		onResidual(source) {
			if (source === undefined || source.foes() === undefined || source.foes()[0] === undefined) return;
			if (source.positiveBoosts() < source.foes()[0].positiveBoosts()) {
				const stats: BoostID[] = [];
				let stat: BoostID;
				for (stat in source.boosts) {
					if (stat === 'accuracy' || stat === 'evasion') continue;
					if (source.boosts[stat] < 6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					this.boost({[randomStat]: 1}, source, source);
				}
			}
		},
		flags: {},
	},

	// Solaros & Lunaris
	ridethesun: {
		shortDesc: "Drought + Chlorophyll",
		name: "Ride the Sun!",
		onStart(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'groudon') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('sunnyday');
		},
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		flags: {},
	},

	// spoo
	icanheartheheartbeatingasone: {
		shortDesc: "Pixilate + Sharpness. -1 Atk upon KOing an opposing Pokemon.",
		name: "I Can Hear The Heart Beating As One",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
			if (move.flags['slicing']) {
				this.debug('Sharpness boost');
				return this.chainModify(1.5);
			}
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk: -length}, source);
			}
		},
		flags: {},
	},

	// Steorra
	ghostlyhallow: {
		shortDesc: "This Pokémon can hit Normal types with Ghost-type moves.",
		name: "Ghostly Hallow",
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Ghost'] = true;
			}
		},
	},

	// Struchni
	overaskedclause: {
		shortDesc: "Moves used by opposing Pokemon on the previous turn will always fail.",
		name: "Overasked Clause",
		onFoeBeforeMove(target, source, move) {
			if (target.lastMove && target.lastMove.id !== 'struggle') {
				if (move.id === target.lastMove.id) {
					this.attrLastMove('[still]');
					this.add('cant', target, 'ability: Overasked Clause', move, '[of] ' + source);
					return false;
				}
			}
		},
	},

	// Sulo
	protectionofthegelatin: {
		shortDesc: "Magic Guard + Stamina",
		name: "Protection of the Gelatin",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onDamagingHit(damage, target, source, effect) {
			this.boost({def: 1});
		},
	},

	// Swiffix
	stinky: {
		desc: "10% chance to either poison or paralyze the target on hit.",
		name: "Stinky",
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stinky psn/par');
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 10,
					onHit(target, source) {
						const result = this.random(2);
						if (result === 0) {
							target.trySetStatus('par', source);
						} else {
							target.trySetStatus('psn', source);
						}
					},
				});
			}
		},
		flags: {},
	},

	// Tenshi
	sandsleuth: {
		desc: "Sets Gravity and identifies foes on switch-in. Priority immune from identified foes.",
		name: "Sand Sleuth",
		onStart(target) {
			this.field.addPseudoWeather('gravity', target);
			for (const opponent of target.adjacentFoes()) {
				if (!opponent.volatiles['foresight']) {
					opponent.addVolatile('foresight');
				}
			}
		},
		onFoeTryMove(target, source, move) {
			if (target.volatiles['foresight']) {
				const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
				if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
					return;
				}
				const dazzlingHolder = this.effectState.target;
				if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
					this.attrLastMove('[still]');
					this.add('cant', target, 'ability: Sand Sleuth', move, '[of] ' + source);
					return false;
				}
			}
		},
		flags: {},
	},

	// Theia
	powerabuse: {
		shortDesc: "Summons Sun; attacks do 66% less damage to this Pokemon; may burn physical attackers.",
		name: "Power Abuse",
		onStart() {
			this.field.setWeather('sunnyday');
		},
		onSourceModifyDamage() {
			return this.chainModify(0.34);
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === "Physical" && this.randomChance(1, 5)) {
				source.trySetStatus('brn', target);
			}
		},
		flags: {breakable: 1},
	},

	// Tico
	eternalgenerator: {
		shortDesc: "Regenerator + Hazard immune.",
		name: "Eternal Generator",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		flags: {breakable: 1},
	},

	// TheJesucristoOsAma
	thegraceofjesuschrist: {
		shortDesc: "Changes plates at the end of every turn.",
		name: "The Grace Of Jesus Christ",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			const plates = this.dex.items.all().filter(item => item.onPlate && !item.zMove);
			const item = this.sample(plates.filter(plate => this.toID(plate) !== this.toID(pokemon.item)));
			pokemon.item = '';
			this.add('-item', pokemon, item, '[from] ability: The Grace Of Jesus Christ');
			pokemon.setItem(item);
			pokemon.formeChange("Arceus-" + item.onPlate!, this.dex.abilities.get('thegraceofjesuschrist'), true);
		},
		flags: {},
	},

	// trace
	eyesofeternity: {
		shortDesc: "Moves used by/against this Pokemon always hit; only damaged by attacks.",
		name: "Eyes of Eternity",
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		flags: {},
	},

	// Two of Roses
	aswesee: {
		shortDesc: "1x per turn: Stat gets boosted -> 50% chance to copy, 15% to raise another.",
		desc: "Once per turn, when any active Pokemon has a stat boosted, this Pokemon has a 50% chance of copying it and a 15% chance to raise another random stat.",
		name: "As We See",
		onFoeAfterBoost(boost, target, source, effect) { // Opportunist
			if (this.randomChance(1, 2)) {
				if (effect && ['As We See', 'Mirror Herb', 'Opportunist'].includes(effect.name)) return;
				const pokemon = this.effectState.target;
				const positiveBoosts: Partial<BoostsTable> = {};
				let i: BoostID;
				for (i in boost) {
					if (boost[i]! > 0) {
						positiveBoosts[i] = boost[i];
					}
				}
				if (Object.keys(positiveBoosts).length < 1) return;
				this.boost(positiveBoosts, pokemon);
				this.effectState.triggered = true;
			}
		},
		onResidual(target, source, effect) {
			if (this.randomChance(15, 100) && this.effectState.triggered) {
				const stats: BoostID[] = [];
				const boost: SparseBoostsTable = {};
				let statPlus: BoostID;
				for (statPlus in target.boosts) {
					if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
					if (target.boosts[statPlus] < 6) {
						stats.push(statPlus);
					}
				}
				const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
				if (randomStat) boost[randomStat] = 1;
				this.boost(boost, target, target);
			}
			this.effectState.triggered = false;
		},
		flags: {},
	},

	// UT
	galeguard: {
		shortDesc: "Mountaineer + Fur Coat.",
		name: "Gale Guard",
		onDamage(damage, target, source, effect) {
			if (effect && effect.name === 'Stealth Rock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
		onModifyDef(def) {
			return this.chainModify(2);
		},
		flags: {breakable: 1},
	},

	// umuwo
	soulsurfer: {
		name: "Soul Surfer",
		shortDesc: "Drizzle + Surge Surfer.",
		onStart(source) {
			this.field.setWeather('raindance');
		},
		onModifySpe(spe) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		flags: {},
	},

	// Valerian
	fullbloom: {
		shortDesc: "This Pokémon's priority moves have double power.",
		name: "Full Bloom",
		onBasePowerPriority: 30,
		onBasePower(basePower, pokemon, target, move) {
			if (move.priority > 0) {
				return this.chainModify(2);
			}
		},
	},

	// Venous
	concreteoverwater: {
		shortDesc: "Gains +1 Defense and Sp. Def before getting hit by a super effective move.",
		name: "Concrete Over Water",
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (target.runEffectiveness(move) > 0) {
				this.boost({def: 1, spd: 1}, target);
			}
		},
		flags: {},
	},

	// Violet
	seenoevilhearnoevilspeaknoevil: {
		shortDesc: "Dark immune; Cornerstone: Sound immune. Wellspring: Moves never miss. Hearthflame: 1.3x BP vs male.",
		desc: "This Pokemon is immune to Dark-type attacks. If this Pokemon is Ogerpon-Cornerstone, it is immune to sound moves. If this Pokemon is Ogerpon-Wellspring, its moves will never miss. If this Pokemon is Ogerpon-Hearthflame, its damage against male targets is multiplied by 1.3x.",
		name: "See No Evil, Hear No Evil, Speak No Evil",
		onTryHit(target, source, move) {
			if (target !== source && move.flags['sound'] && target.species.id.startsWith('ogerponcornerstone')) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: See No Evil, Hear No Evil, Speak No Evil');
				}
				return null;
			}

			if (target !== source && move.type === 'Dark') {
				this.add('-immune', target, '[from] ability: See No Evil, Hear No Evil, Speak No Evil');
				return null;
			}
		},
		onSourceAccuracy(accuracy, target, source, move) {
			if (!source.species.id.startsWith('ogerponwellspring')) return;
			if (typeof accuracy !== 'number') return;
			return true;
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (!source.species.id.startsWith('ogerponwellspring')) return;
			if (typeof move.accuracy === 'number' && move.accuracy < 100) {
				this.debug('neutralize');
				return this.chainModify(0.75);
			}
		},
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) {
			if (!attacker.species.id.startsWith('ogerponhearthflame')) return;
			if (defender.gender === 'M') {
				this.debug('attack boost');
				return this.chainModify(1.3);
			}
		},
		flags: {breakable: 1},
	},

	// Vistar
	virtualidol: {
		shortDesc: "Dancer + Punk Rock.",
		name: "Virtual Idol",
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// vmnunes
	wildgrowth: {
		shortDesc: "Attacking moves also inflict Leech Seed on the target.",
		name: "Wild Growth",
		onModifyMovePriority: -1,
		onAfterMove(source, target, move) {
			if (target.hasType('Grass') || target.hasAbility('Sap Sipper') || !move.hit) return null;
			target.addVolatile('leechseed', source);
		},
		flags: {},
	},

	// WarriorGallade
	primevalharvest: {
		shortDesc: "Sun: Heal 1/8 max HP, random berry if no item. Else 50% random berry if no item.",
		desc: "In Sun, the user restores 1/8th of its maximum HP at the end of the turn and has a 100% chance to get a random berry if it has no item. Outside of sun, there is a 50% chance to get a random berry. Berry given will be one of: Cheri, Chesto, Pecha, Lum, Aguav, Liechi, Ganlon, Petaya, Apicot, Salac, Micle, Lansat, Enigma, Custap, Kee or Maranga.",
		name: "Primeval Harvest",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			const isSunny = this.field.isWeather(['sunnyday', 'desolateland']);
			if (isSunny) {
				this.heal(pokemon.baseMaxhp / 8, pokemon, pokemon, pokemon.getAbility());
			}
			if (isSunny || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item) {
					const berry = this.sample([
						'cheri', 'chesto', 'pecha', 'lum', 'aguav', 'liechi', 'ganlon', 'petaya',
						'apicot', 'salac', 'micle', 'lansat', 'enigma', 'custap', 'kee', 'maranga',
					]) + 'berry';
					pokemon.setItem(berry);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Primeval Harvest');
				}
			}
		},
		flags: {},
	},

	// WigglyTree
	treestance: {
		shortDesc: "Rock Head + Filter.",
		name: "Tree Stance",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Tree Stance neutralize');
				return this.chainModify(0.75);
			}
		},
		flags: {breakable: 1},
	},

	// xy01
	panic: {
		shortDesc: "Lowers the foe's Atk and Sp. Atk by 1 upon switch-in.",
		name: "Panic",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Panic', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({atk: -1, spa: -1}, target, pokemon, null, true);
				}
			}
		},
		flags: {},
	},

	// Yellow Paint
	yellowmagic: {
		shortDesc: "+25% HP, +1 SpA, +1 Spe, Charge, or paralyzes attacker when hit by an Electric move; Electric immunity.",
		desc: "This Pokemon is immune to Electric type moves. When this Pokemon is hit by one, it either: restores 25% of its maximum HP, boosts its Special Attack by 1 stage, boosts its Speed by 1 stage, gains the Charge effect, or paralyzes the attacker.",
		name: "Yellow Magic",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				let didSomething = false;
				switch (this.random(5)) {
				case 0:
					didSomething = !!this.heal(target.baseMaxhp / 4);
					break;
				case 1:
					didSomething = !!this.boost({spa: 1}, target, target);
					break;
				case 2:
					didSomething = !!this.boost({spe: 1}, target, target);
					break;
				case 3:
					if (!target.volatiles['charge']) {
						this.add('-ability', target, 'Yellow Magic');
						target.addVolatile('charge', target);
						didSomething = true;
					}
					break;
				case 4:
					didSomething = source.trySetStatus('par', target);
					break;
				}
				if (!didSomething) {
					this.add('-immune', target, '[from] ability: Yellow Magic');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// YveltalNL
	heightadvantage: {
		shortDesc: "If this Pokemon's height is more than that of the foe, -1 to foe's Attack/Sp. Atk.",
		name: "Height Advantage",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Height Advantage', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					if (this.dex.species.get(pokemon.species).heightm > this.dex.species.get(target.species).heightm) {
						this.boost({atk: -1, spa: -1}, target, pokemon, null, true);
					}
				}
			}
		},
		flags: {},
	},

	// za
	troll: {
		shortDesc: "Using moves that can flinch makes user move first in their priority bracket.",
		name: "Troll",
		onFractionalPriority(priority, pokemon, target, move) {
			if (move?.secondaries?.some(m => m.volatileStatus === 'flinch')) {
				this.add('-activate', pokemon, 'ability: Troll');
				return 0.1;
			}
		},
	},

	// Zarel
	tempochange: {
		shortDesc: "Switches Meloetta's forme between Aria and Pirouette at the end of each turn.",
		name: "Tempo Change",
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.species.baseSpecies !== 'Meloetta') return;
			if (pokemon.species.name === 'Meloetta') {
				changeSet(this, pokemon, ssbSets['Zarel-Pirouette'], true);
			} else {
				changeSet(this, pokemon, ssbSets['Zarel'], true);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
	},

	// zoro
	ninelives: {
		shortDesc: "Twice per battle, this Pokemon will survive a lethal hit with 1 HP remaining, regardless of HP.",
		name: "Nine Lives",
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[from] ability: Nine Lives');
				return null;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect?.effectType === 'Move' && !this.effectState.busted) {
				this.add('-ability', target, 'Nine Lives');
				if (this.effectState.busted === 0) {
					this.effectState.busted = 1;
				} else {
					this.effectState.busted = 0;
				}
				return target.hp - 1;
			}
		},
		// Yes, this looks very patchwork-y. declaring new persistent global variables seems to be a no-go here
		// so i repurposed one which should likely not affect anything else - have tested with clerica/zoro on both sides
		// and their disguise/sturdy state is unaffected by modifying anything here. but let wg know if this breaks stuff.
		flags: {breakable: 1},
	},

	// Modified abilities
	baddreams: {
		inherit: true,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (target.status === 'slp' || target.hasAbility(['comatose', 'mensiscage'])) {
					this.damage(target.baseMaxhp / 8, target, pokemon);
				}
			}
		},
	},
	deltastream: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'deltastream' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	desolateland: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'desolateland' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	dryskin: {
		inherit: true,
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea' || effect.id === 'stormsurge') {
				this.heal(target.baseMaxhp / 8);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
	},
	forecast: {
		inherit: true,
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
			case 'snow':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');
			}
		},
	},
	hydration: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea', 'stormsurge'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				pokemon.cureStatus();
			}
		},
	},
	neutralizinggas: {
		inherit: true,
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			for (const target of this.getAllActive()) {
				if (target.hasItem('Ability Shield')) {
					this.add('-block', target, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) {
					continue;
				}
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (STRONG_WEATHERS.includes(target.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
				}
			}
		},
	},
	overcoat: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes' || type === 'hail' || type === 'powder') return false;
		},
	},
	primordialsea: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'primordialsea' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	raindish: {
		inherit: true,
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea' || effect.id === 'stormsurge') {
				this.heal(target.baseMaxhp / 16);
			}
		},
	},
	sandforce: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather(['sandstorm', 'deserteddunes'])) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes') return false;
		},
	},
	sandrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['sandstorm', 'deserteddunes'])) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes') return false;
		},
	},
	sandveil: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes') return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['sandstorm', 'deserteddunes'])) {
				this.debug('Sand Veil - decreasing accuracy');
				return this.chainModify([3277, 4096]);
			}
		},
	},
	swiftswim: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea', 'stormsurge'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
	},
};
