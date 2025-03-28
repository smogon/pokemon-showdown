import { ssbSets } from "./random-teams";
import { changeSet, getName, PSEUDO_WEATHERS } from "./scripts";

const STRONG_WEATHERS = ['desolateland', 'primordialsea', 'deltastream', 'deserteddunes', 'millenniumcastle'];

export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
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
	// Please keep abilities organized alphabetically based on staff member name!
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
		flags: { breakable: 1 },
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
		flags: { breakable: 1 },
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
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Paw Prints', `[of] ${target}`);
			}
		},
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
			}
		},
		flags: { breakable: 1 },
	},

	// Alexander489
	confirmedtown: {
		shortDesc: "Technician + Protean.",
		name: "Confirmed Town",
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
			this.debug(`Base Power: ${basePowerAfterMultiplier}`);
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

	// Apple
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

	// Appletun a la Mode
	servedcold: {
		shortDesc: "This Pokemon's Defense is raised 2 stages if hit by an Ice move; Ice immunity.",
		name: "Served Cold",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.boost({ def: 2 })) {
					this.add('-immune', target, '[from] ability: Served Cold');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
	},

	// aQrator
	neverendingfhunt: {
		desc: "This Pokemon's non-damaging moves have their priority increased by 1. Opposing Dark-type Pokemon are immune to these moves, and any move called by these moves, if the resulting user of the move has this Ability.",
		shortDesc: "This Pokemon's Status moves have priority raised by 1, but Dark types are immune.",
		name: "Neverending fHunt",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
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
		flags: { breakable: 1 },
		gen: 9,
	},

	// Archas
	saintlybullet: {
		shortDesc: "Snipe Shot always has STAB and heals the user by 1/5 (or 1/4 on a crit) of its max HP.",
		name: "Saintly Bullet",
		onModifyMove(move) {
			if (move.id === 'snipeshot') {
				move.forceSTAB = true;
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (move.id === 'snipeshot') {
				const ratio = target.getMoveHitData(move).crit ? 4 : 5;
				this.heal(source.maxhp / ratio, source, source);
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
	absorbphys: {
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Normal moves; Normal immunity.",
		name: "Absorb Phys",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Normal') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Absorb Phys');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
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
				this.add("-fail", target, "unboost", "[from] ability: Supervised Learning", `[of] ${target}`);
			}
		},
		flags: {},
		gen: 9,
	},

	// Audiino
	mitosis: {
		shortDesc: "Regenerator + Multiscale.",
		name: "Mitosis",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
	},

	// ausma
	cascade: {
		shortDesc: "At 25% HP, transforms into a Mismagius. Sigil's Storm becomes Ghost type and doesn't charge.",
		name: "Cascade",
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Hatterene' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.species.id === 'mismagius' || pokemon.hp > pokemon.maxhp / 4) return;
			this.add(`c:|${getName('ausma')}|that's it, yall mfs are about to face the wrath of Big Stall™`);
			this.add(`c:|${getName('ausma')}|or i guess moreso Big Pult. pick your poison`);
			this.add('-activate', pokemon, 'ability: Cascade');
			changeSet(this, pokemon, ssbSets['ausma-Mismagius'], true);
			pokemon.cureStatus();
			this.heal(pokemon.maxhp / 3);
			if (this.field.pseudoWeather['trickroom']) {
				this.field.removePseudoWeather('trickroom');
				this.boost({ spe: 2 }, pokemon, pokemon, this.effect);
			}
		},
		flags: {},
	},

	// Bert122
	pesteringassault: {
		shortDesc: "Uses Knock Off, Taunt, Torment, Soak, and Confuse Ray with 33% accuracy at turn end.",
		name: "Pestering Assault",
		onResidual(pokemon, s, effect) {
			const moves = ['knockoff', 'taunt', 'torment', 'soak', 'confuseray'];
			for (const moveid of moves) {
				const move = this.dex.getActiveMove(moveid);
				move.accuracy = 33;
				const target = pokemon.foes()[0];
				if (target && !target.fainted) {
					this.actions.useMove(move, pokemon, { target, sourceEffect: effect });
				}
			}
		},
		flags: {},
	},

	// blazeofvictory
	prismaticlens: {
		shortDesc: "Gen 6 Pixilate + 10% buffed Tinted Lens.",
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
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2.2);
			}
		},
		flags: {},
	},

	// Blitz
	blitzofruin: {
		shortDesc: "Active Pokemon without this Ability have 0.75x Speed.",
		desc: "Active Pokemon without this Ability have their Speed multiplied by 0.75x.",
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
		flags: { breakable: 1 },
	},

	// Breadey
	painfulexit: {
		shortDesc: "When this Pokemon switches out, foes lose 25% HP.",
		name: "Painful Exit",
		onBeforeSwitchOutPriority: -1,
		onBeforeSwitchOut(pokemon) {
			this.add(`c:|${getName('Breadey')}|Just kidding!! Take this KNUCKLE SANDWICH`);
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

	// Chris
	astrothunder: {
		shortDesc: "Drizzle + Static.",
		name: "Astrothunder",
		onStart(source) {
			if (source.species.id === 'kyogre' && source.item === 'blueorb') return;
			this.field.setWeather('raindance');
		},
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('par', target);
				}
			}
		},
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
				if (foe && !foe.fainted && !foe.volatiles['torment']) {
					foe.addVolatile('torment');
				}
			}
		},
		flags: {},
	},

	// Clem
	meltingpoint: {
		shortDesc: "+2 Speed. Fire moves change user to Water type. Fire immunity.",
		name: "Melting Point",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.boost({ spe: 2 }, target, source, this.dex.abilities.get('meltingpoint'));
				if (target.setType('Water')) {
					this.add('-start', target, 'typechange', 'Water', '[from] ability: Melting Point');
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
				this.boost({ atk: 1, spe: 1 });
				this.add(`c:|${getName('clerica')}|oop`);
			}
		},
		flags: { breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
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
		flags: { breakable: 1 },
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
		flags: { breakable: 1 },
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
	virus: {
		shortDesc: "Causes hacked enemies to catch a virus that deals 145 damage over 3 turns.",
		name: "Virus",
		onAfterMove(source, target, move) {
			if (move.id === 'emp') target?.addVolatile('virus');
		},
		condition: {
			duration: 4,
			onStart(target, source, sourceEffect) {
				this.add('-start', target, 'virus');
			},
			onEnd(target) {
				this.add('-end', target, 'virus');
			},
			onResidual(target, source, effect) {
				let damage: number;
				if (this.effectState.duration === 1) {
					damage = 70;
				} else if (this.effectState.duration === 2) {
					damage = 34;
				} else {
					damage = 35;
				}
				this.damage(damage, target);
			},
		},
		flags: { breakable: 1 },
	},

	// Elly
	stormsurge: {
		shortDesc: "On switch-in, summons rain that causes wind moves to have perfect accuracy and 1.1x Base Power.",
		desc: "Summons the Storm Surge weather on switch-in. While Storm Surge is active, wind moves used by any Pokemon are perfectly accurate and become 10% stronger. Water moves are 30% stronger, Fire moves are 30% weaker.",
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
				let trueSource = source;
				// For some reason, the source of the damage is the substitute user when
				// hitting a sub.
				if (source !== target) trueSource = target;
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') {
					if (!trueSource.hasType(this.activeMove.type)) this.heal(damage);
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
		shortDesc: "This Pokemon's Attack is raised 2 stages if hit by an Ice move; Ice immunity.",
		name: "Snowballer",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.boost({ atk: 2 })) {
					this.add('-immune', target, '[from] ability: Snowballer');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
	},

	// Fame
	socialjumpluffwarrior: {
		shortDesc: "Serene Grace + Mycelium Might.",
		name: "Social Jumpluff Warrior",
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === 'Status') {
				return -0.1;
			}
		},
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
			}
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
				this.boost({ spe: 1 });
				this.heal(pokemon.maxhp);
				const move = this.dex.moves.get('finalgambit');
				const finalGambit = {
					move: move.name,
					id: move.id,
					pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
					maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
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
		shortDesc: "Swift Swim + Special Attack 1.5x, Accuracy 0.8x. Never misses, only misspells.",
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
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
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
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Hydrostatic Positivity');
				}
				return null;
			}

			// Motor Drive
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({ spe: 1 })) {
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
		flags: { breakable: 1 },
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
			if (['hail', 'snowscape'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (['hail', 'snowscape'].includes(pokemon.effectiveWeather())) {
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
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name, '[from] ability: Anfield', `[of] ${target}`);
					}
				}
			}
			for (const pseudoWeather of PSEUDO_WEATHERS) {
				if (this.field.removePseudoWeather(pseudoWeather)) success = true;
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
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
	},

	// kingbaruk
	peerpressure: {
		shortDesc: "All moves used while this Pokemon is on the field consume 4 PP. Sets Trump Card to 1 PP.",
		name: "Peer Pressure",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Peer Pressure');
			const trumpCard = pokemon.moveSlots.find(moveSlot => moveSlot.id === 'trumpcard');
			if (trumpCard) {
				trumpCard.pp = 1;
			}
		},
		onAnyDeductPP(target, source) {
			return 3;
		},
		onResidual(source, target, effect) {
			const trumpCard = source.moveSlots.find(moveSlot => moveSlot.id === 'trumpcard');
			if (trumpCard) {
				trumpCard.pp = 1;
			}
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
		flags: { breakable: 1 },
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
		flags: { breakable: 1 },
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
					this.add('-sideend', target, this.dex.conditions.get(targetCondition).name, '[from] ability: Idealized World', `[of] ${pokemon}`);
				}
			}
			for (const sideCondition of Object.keys(pokemon.side.sideConditions)) {
				if (pokemon.side.removeSideCondition(sideCondition) && displayText.includes(sideCondition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(sideCondition).name, '[from] ability: Idealized World', `[of] ${pokemon}`);
				}
			}
			this.field.clearTerrain();
			this.field.clearWeather();
			for (const pseudoWeather of PSEUDO_WEATHERS) {
				this.field.removePseudoWeather(pseudoWeather);
			}
			this.add('-clearallboost');
			for (const poke of this.getAllActive()) {
				poke.clearBoosts();
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
		flags: { breakable: 1 },
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
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, { target: source });
			return null;
		},
		condition: {
			duration: 1,
		},
		flags: { breakable: 1 },
	},

	// Maia
	powerabuse: {
		shortDesc: "Drought + 60% damage reduction + 20% burn after physical move.",
		name: "Power Abuse",
		onStart() {
			this.field.setWeather('sunnyday');
		},
		onSourceModifyDamage() {
			return this.chainModify(0.4);
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === "Physical" && this.randomChance(1, 5)) {
				source.trySetStatus('brn', target);
			}
		},
		flags: { breakable: 1 },
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

	// Merritty
	endround: {
		shortDesc: "Clears everything.",
		desc: "When this Pokemon switches in, all weather, terrains, field conditions, entry hazards, stat stage changes, and volatile status conditions are removed from the field.",
		name: "End Round",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'End Round');
			this.add('-message', 'A new round is starting! Resetting the field...');
			this.field.clearWeather();
			this.field.clearTerrain();
			for (const pseudoWeather of PSEUDO_WEATHERS) {
				this.field.removePseudoWeather(pseudoWeather);
			}
			for (const side of this.sides) {
				const remove = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
					'bioticorbfoe', 'bioticorbself', 'tailwind', 'luckychant', 'alting',
				];
				for (const sideCondition of remove) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name, '[from] ability: End Round', `[of] ${pokemon}`);
					}
				}
			}
			for (const mon of this.getAllActive()) {
				const volatilesToClear = [
					'substitute', 'aquaring', 'snack', 'attract', 'confusion', 'bide', 'partiallytrapped', 'perfectmimic',
					'mustrecharge', 'defensecurl', 'disable', 'focusenergy', 'dragoncheer', 'embargo', 'endure', 'gastroacid',
					'foresight', 'glaiverush', 'grudge', 'healblock', 'imprison', 'curse', 'leechseed', 'magnetrise', 'minimize',
					'miracleeye', 'nightmare', 'noretreat', 'octolock', 'lockedmove', 'powder', 'powershift', 'powertrick',
					'rage', 'ragepowder', 'roost', 'saltcure', 'smackdown', 'snatch', 'sparklingaria', 'spotlight', 'stockpile',
					'syrupbomb', 'tarshot', 'taunt', 'telekinesis', 'torment', 'uproar', 'yawn', 'flashfire', 'protosynthesis',
					'quarkdrive', 'slowstart', 'truant', 'unburden', 'metronome', 'beakblast', 'charge', 'echoedvoice', 'encore',
					'focuspunch', 'furycutter', 'gmaxcannonade', 'gmaxchistrike', 'gmaxvinelash', 'gmaxvolcalith', 'gmaxwildfire',
					'iceball', 'rollout', 'laserfocus', 'lockon', 'perishsong', 'shelltrap', 'throatchop', 'trapped', 'ultramystik',
					'choicelock', 'stall', 'catstampofapproval', 'beefed', 'boiled', 'flipped', 'therollingspheal', 'treasurebag',
					'torisstori', 'anyonecanbekilled', 'sigilsstorm', 'wonderwing', 'riseabove', 'superrollout', 'meatgrinder',
					'risingsword',
				];
				for (const volatile of volatilesToClear) {
					if (mon.volatiles[volatile]) {
						if (volatile === 'perishsong') {
							// will implode the pokemon otherwise
							delete mon.volatiles[volatile];
						} else {
							mon.removeVolatile(volatile);
						}
						if (volatile === 'flipped') {
							changeSet(this, mon, ssbSets['Clem']);
							this.add(`c:|${getName('Clem')}|┬──┬◡ﾉ(° -°ﾉ)`);
						}
						this.add('-activate', pokemon, 'ability: End Round');
					}
				}
				mon.clearBoosts();
				this.add('-clearboost', mon, '[from] ability: End Round', `[of] ${pokemon}`);
			}
		},
		flags: { cantsuppress: 1 },
	},

	// Meteordash
	tatsuglare: {
		shortDesc: "Fur Coat + All of the user's moves use the Special Attack stat.",
		name: "TatsuGlare",
		onModifyMove(move, pokemon, target) {
			if (move.category !== "Status") move.overrideOffensiveStat = 'spa';
		},
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		flags: { breakable: 1 },
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

	// Miojo
	therollingspheal: {
		shortDesc: "1.5x dmg boost for every repeated move use. Up to 5 uses. +1 Spe when use contact.",
		name: "The Rolling Spheal",
		onStart(pokemon) {
			pokemon.addVolatile('therollingspheal');
		},
		onSourceHit(target, source, move) {
			if (move.flags['contact'] && move.category === 'Physical') {
				this.add('-activate', source, 'ability: The Rolling Spheal');
				this.boost({ spe: 1 }, source, source, move);
			}
		},
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasAbility('therollingspheal')) {
					pokemon.removeVolatile('therollingspheal');
					return;
				}
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove']) {
					if (this.effectState.lastMove !== move.id) {
						this.effectState.numConsecutive = 1;
					} else {
						this.effectState.numConsecutive++;
					}
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				if (this.effectState.numConsecutive > 0) {
					this.debug(`Current Metronome boost: 6144/4096`);
					return this.chainModify([6144, 4096]);
				}
			},
			onAfterMove(source, target, move) {
				if (this.effectState.numConsecutive > 5) {
					this.effectState.numConsecutive = 0;
				}
			},
		},
		flags: {},
	},

	// Monkey
	harambehit: {
		shortDesc: "Unseen Fist + Punch moves have 1.6x power.",
		name: "Harambe Hit",
		onModifyMove(move) {
			if (move.flags['contact']) delete move.flags['protect'];
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Harambe Hit boost');
				return this.chainModify([6554, 4096]);
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

	// Neko
	weatherproof: {
		shortDesc: "Water-/Fire-type moves against this Pokemon deal damage with a halved offensive stat.",
		name: "Weatherproof",
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Weatherproof weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Weatherproof weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
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

	// pants
	drifting: {
		shortDesc: "Wandering Spirit + Stakeout.",
		name: "Drifting",
		onDamagingHit(damage, target, source, move) {
			if (source.getAbility().flags['failskillswap'] || target.volatiles['dynamax']) return;

			if (this.checkMoveMakesContact(move, source, target)) {
				const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, source.ability);
				if (!targetCanBeSet) return targetCanBeSet;
				const sourceAbility = source.setAbility('drifting', target);
				if (!sourceAbility) return;
				if (target.isAlly(source)) {
					this.add('-activate', target, 'Skill Swap', '', '', `[of] ${source}`);
				} else {
					this.add('-activate', target, 'ability: Drifting', this.dex.abilities.get(sourceAbility).name, 'Drifting', `[of] ${source}`);
				}
				target.setAbility(sourceAbility);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender) {
			if (defender && !defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender) {
			if (defender && !defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		flags: {},
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
					this.boost({ atk: 1, def: -1, spa: 1, spd: -1, spe: 1 });
					const details = target.getUpdatedDetails();
					target.details = details;
					this.add('replace', target, details);
				}
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.set.shiny) move.ignoreAbility = true;
		},
		onStart(pokemon) {
			if (!pokemon.set.shiny) {
				this.boost({ atk: -1, def: 1, spa: -1, spd: 1 });
			} else {
				this.boost({ atk: 1, def: -1, spa: 1, spd: -1, spe: 1 });
			}
		},
	},

	// Pastor Gigas
	godsmercy: {
		shortDesc: "Summons Grassy Terrain and cures the team's status conditions on switch-in.",
		name: "God's Mercy",
		onStart(source) {
			this.field.setTerrain('grassyterrain');
			const allies = [...source.side.pokemon, ...source.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && ally.hasAbility('sapsipper')) {
					continue;
				}
				ally.cureStatus();
			}
		},
		flags: {},
	},

	// phoopes
	ididitagain: {
		shortDesc: "Bypasses Sleep Clause Mod.",
		name: "I Did It Again",
		flags: {},
		// implemented in rulesets.ts
	},

	// Princess Autumn
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
		onResidual(source) {
			const type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar' && i !== source.getTypes()[0]));
			if (source.setType(type)) {
				this.add('-start', source, 'typechange', type, '[from] ability: High Performance Computing');
			}
		},
	},

	// R8
	antipelau: {
		shortDesc: "Boosts Sp. Atk by 2 and sets a 25% Wish upon switch-in.",
		name: "Anti-Pelau",
		onStart(target) {
			this.boost({ spa: 2 }, target);
			this.actions.useMove(this.dex.getActiveMove('wish'), target,
				{ target, sourceEffect: this.dex.abilities.get('antipelau') });
		},
		flags: {},
	},

	// Rainshaft
	rainysaura: {
		shortDesc: "On switch-in, this Pokemon summons rain. Boosts all Psychic-type damage by 33%.",
		name: "Rainy's Aura",
		onStart(source) {
			if (this.suppressingAbility(source)) return;
			if (source.species.id === 'kyogre' && source.item === 'blueorb') return;
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
		shortDesc: "Stats 1.3x + Magic Guard + Leftovers until hit super effectively.",
		desc: "This Pokemon can only be damaged by direct attacks. At the end of each turn, this Pokemon restores 1/16 of its maximum HP. This Pokemon's Attack, Defense, Special Attack, Special Defense, and Speed are boosted by 1.3x. This ability will be replaced with Healer if it is hit with a super effective attack.",
		name: "Ultra Mystik",
		onStart(target) {
			if (!this.effectState.superHit) {
				target.addVolatile('ultramystik');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['ultramystik'];
			this.add('-end', pokemon, 'Ultra Mystik', '[silent]');
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.effectState.superHit = true;
				target.removeVolatile('ultramystik');
				target.setAbility('Healer', null, true);
				target.baseAbility = target.ability;
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
				return this.chainModify(1.3);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onModifySpe(spe, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
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
				this.boost({ spa: 1 });
			} else if (totalspd) {
				this.boost({ atk: 1 });
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
				this.add('-ability', pokemon, ability, '[from] ability: Monke See Monke Do', `[of] ${target}`);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
	},

	// Rio Vidal
	builtdifferent: {
		shortDesc: "Stamina + Normal-type moves get +1 priority.",
		name: "Built Different",
		onDamagingHit(damage, target, source, effect) {
			this.boost({ def: 1 });
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Normal') return priority + 1;
		},
		flags: {},
	},

	// Rissoux
	hardheaded: {
		shortDesc: "Reckless + Rock Head.",
		name: "Hard Headed",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) {
				this.debug('Reckless boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		flags: {},
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
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire-/Ice-type moves against this Pokemon deal damage with a halved offensive stat.",
		name: "Perfectly Imperfect",
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
		flags: { breakable: 1 },
	},

	// skies
	spikesofwrath: {
		shortDesc: "Cheek Pouch + sets Spikes and Toxic Spikes upon getting KOed.",
		name: "Spikes of Wrath",
		onDamagingHit(damage, target, source, effect) {
			if (!target.hp) {
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
			if (source?.foes()?.[0] === undefined) return;
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
					this.boost({ [randomStat]: 1 }, source, source);
				}
			}
		},
		flags: {},
	},

	// Solaros & Lunaris
	ridethesun: {
		shortDesc: "Drought + 2x Spe in sun.",
		desc: "On switch-in, this Pokemon summons Sunny Day. If Sunny Day is active, this Pokemon's Speed is 2x.",
		name: "Ride the Sun!",
		onStart(source) {
			if (source.species.id === 'groudon' && source.item === 'redorb') return;
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
				this.boost({ atk: -length }, source);
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
					this.add('cant', target, 'ability: Overasked Clause', move, `[of] ${source}`);
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
			this.boost({ def: 1 });
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
					this.add('cant', target, 'ability: Sand Sleuth', move, `[of] ${source}`);
					return false;
				}
			}
		},
		flags: {},
	},

	// Tico
	eternalgenerator: {
		shortDesc: "Regenerator + Magic Guard + immune to Sticky Web.",
		name: "Eternal Generator",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		flags: { breakable: 1 },
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
		shortDesc: "1x per turn: Stat gets boosted -> 75% chance to copy, 40% to raise another.",
		desc: "Once per turn, when any active Pokemon has a stat boosted, this Pokemon has a 50% chance of copying it and a 15% chance to raise another random stat.",
		name: "As We See",
		onFoeAfterBoost(boost, target, source, effect) { // Opportunist
			if (this.randomChance(3, 4)) {
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
			if (this.randomChance(4, 10) && this.effectState.triggered) {
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
		flags: { breakable: 1 },
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
				this.boost({ def: 1, spd: 1 }, target);
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
		flags: { breakable: 1 },
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
		flags: { breakable: 1 },
	},

	// vmnunes
	wildgrowth: {
		shortDesc: "Attacking moves also inflict Leech Seed on the target.",
		name: "Wild Growth",
		onModifyMovePriority: -1,
		onAfterMove(source, target, move) {
			if (target.hasType('Grass') || target.hasAbility('Sap Sipper') || !move.hit || target === source) return null;
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
		flags: { breakable: 1 },
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
					this.boost({ atk: -1, spa: -1 }, target, pokemon, null, true);
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
					didSomething = !!this.boost({ spa: 1 }, target, target);
					break;
				case 2:
					didSomething = !!this.boost({ spe: 1 }, target, target);
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
		flags: { breakable: 1 },
	},

	// yeet dab xd
	treasurebag: {
		shortDesc: "At the end of the turn and when top kek is used, use one Treasure Bag item in the cycle.",
		desc: "At the end of each turn and when top kek is used, one of the following effects will occur, starting at the top and moving to the next item for each use of Treasure Bag: Deal 50 HP of damage to the foe, heal the user for 100 HP, paralyze the foe, set Aurora Veil for 5 turns, or grant the user a permanent Reviver Seed condition that causes it to revive to 50% upon reaching 0 HP once. If the Reviver Seed effect is set, all future cycles will replace that effect with a no-effect Reviser Seed item. The state of the cycle persists if the Pokemon switches out and back in.",
		name: "Treasure Bag",
		onStart(target) {
			this.add('-ability', target, 'Treasure Bag');
			target.addVolatile('treasurebag');
		},
		onResidual(target, source, effect) {
			if (!target.volatiles['treasurebag']) target.addVolatile('treasurebag');
		},
		condition: {
			onStart(pokemon, source, sourceEffect) {
				if (!pokemon.m.bag) {
					pokemon.m.bag = ['Blast Seed', 'Oran Berry', 'Petrify Orb', 'Luminous Orb', 'Reviver Seed'];
				}
			},
			onResidual(pokemon, source, effect) {
				if (!pokemon.m.bag) {
					pokemon.m.bag = ['Blast Seed', 'Oran Berry', 'Petrify Orb', 'Luminous Orb', 'Reviver Seed'];
				}
				const currentItem = pokemon.m.bag.shift();
				const foe = pokemon.foes()[0];
				switch (currentItem) {
				case 'Blast Seed':
					this.add('-activate', pokemon, 'ability: Treasure Bag');
					this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a ${currentItem}!`);
					if (foe) {
						this.damage(50, foe, pokemon, this.effect);
					} else {
						this.add('-message', `But there was no target!`);
					}
					break;
				case 'Oran Berry':
					this.add('-activate', pokemon, 'ability: Treasure Bag');
					this.add('-message', `${pokemon.name} dug through its Treasure Bag and found an ${currentItem}!`);
					this.heal(100, pokemon, pokemon, this.dex.items.get('Oran Berry'));
					break;
				case 'Petrify Orb':
					this.add('-activate', pokemon, 'ability: Treasure Bag');
					this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a ${currentItem}!`);
					if (foe?.trySetStatus('par', pokemon, this.effect)) {
						this.add('-message', `${pokemon.name} petrified ${foe.name}`);
					} else if (!foe) {
						this.add('-message', `But there was no target!`);
					} else {
						this.add('-message', `But it failed!`);
					}
					break;
				case 'Luminous Orb':
					this.add('-activate', pokemon, 'ability: Treasure Bag');
					this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a ${currentItem}!`);
					if (!pokemon.side.addSideCondition('auroraveil', pokemon, this.effect)) {
						this.add('-message', `But it failed!`);
					}
					break;
				// Handled separately
				case 'Reviver Seed':
					this.add('-activate', pokemon, 'ability: Treasure Bag');
					this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a Reviver Seed!`);
					pokemon.m.seedActive = true;
					break;
				}
				pokemon.m.bag = [...pokemon.m.bag, currentItem];
			},
			onAfterMoveSecondarySelf(source, target, move) {
				if (move.id !== 'topkek') return;
				if (!source.m.bag) {
					source.m.bag = ['Blast Seed', 'Oran Berry', 'Petrify Orb', 'Luminous Orb', 'Reviver Seed'];
				}
				const currentItem = source.m.bag.shift();
				this.add('-message', `${source.name} cycled its treasure bag!`);
				source.m.bag = [...source.m.bag, currentItem];
			},
			onDamage(damage, pokemon, source, effect) {
				if (damage >= pokemon.hp && pokemon.m.seedActive) {
					if (!pokemon.m.reviverSeedTriggered) {
						// Can't set hp to 0 because it causes visual bugs
						pokemon.hp = 1;
						this.add('-damage', pokemon, pokemon.getHealth, '[silent]');
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a Reviver Seed!`);
						pokemon.m.reviverSeedTriggered = true;
						pokemon.hp = Math.floor(pokemon.maxhp / 2);
						this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
						this.add('-message', `${pokemon.name} was revived!`);
						return 0;
					} else {
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} was revived!`);
						this.add('-message', `...thought it was the right one...`);
						this.add('-message', `...looking closer, this is...`);
						this.add('-message', `Not a Reviver Seed, but a Reviser Seed!`);
						this.add(`c:|${getName('yeet dab xd')}|An "s"?`);
						this.add('-message', `that wasn't a "v", but an "s"!`);
						this.add('-message', `yeet dab xd burst into spontaneous laughter and fainted!`);
						return damage;
					}
				}
			},
		},
	},

	// yuki
	partyup: {
		shortDesc: "On switch-in, this Pokemon's ability is replaced with a random teammate's ability.",
		name: "Party Up",
		onStart(target) {
			const abilities = target.side.pokemon.map(x => x.getAbility()).filter(x => !x.flags['notrace']);
			if (!abilities.length) return;
			this.add('-ability', target, 'Party Up');
			target.setAbility(this.sample(abilities), target);
			this.add('-ability', target, target.getAbility().name);
		},
		flags: { notrace: 1 },
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
						this.boost({ atk: -1, spa: -1 }, target, pokemon, null, true);
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
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
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
		flags: { breakable: 1 },
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
			case 'snowscape':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '0', '[msg]');
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
		onSwitchIn(pokemon) {
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
