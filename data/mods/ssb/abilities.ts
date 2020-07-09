export const BattleAbilities: {[k: string]: ModdedAbilityData} = {
	/*
	// Example
	"abilityid": {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.js
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// Aeonic
	arsene: {
		desc: "On switch-in, this Pokemon summons Sandstorm. If Sandstorm is active, this Pokemon's Speed is doubled. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "Sand Stream + Sand Rush.",
		name: "Arsene",
		onStart(source) {
			this.field.setWeather('sandstorm');
		},
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
	},

	// Aethernum
	rainyseason: {
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land, or Snowstorm. If Rain Dance is active, this Pokemon restores 1/8 of its maximum HP, rounded down, at the end of each turn. If this Pokemon is holding Big Root, it will restore 1/6 of its maximum HP, rounded down, at the end of the turn. If this Pokemon is holding Utility Umbrella, its HP does not get restored. This Pokemon collects raindrops.",
		shortDesc: "Primordial Sea + Swift Swim. Restore HP if raining. Collect raindrops.",
		name: "Rainy Season",
		onStart(source) {
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm', 'heavyhailstorm'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				if (!target.hasItem('Big Root')) {
					this.heal(target.baseMaxhp / 8);
				} else {
					this.heal(target.baseMaxhp / 6);
				}
				if (!target.volatiles['raindrop']) target.addVolatile('raindrop');
			}
		},
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
	},

	// Arsenal
	royalprivilege: {
		desc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack. This Pokemon can only be damaged by direct attacks. Attacks that need to charge do not charge and execute in 1 turnThis Pokemon is not affected by the secondary effect of another Pokemon's attack. This Pokemon can only be damaged by direct attacks. Attacks that need to charge do not charge and execute in 1 turn.",
		shortDesc: "Magic Guard + Shield Dust + Power Herb",
		name: "Royal Privilege",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifySecondaries(secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		onChargeMove(pokemon, target, move) {
			if (pokemon.useItem()) {
				this.debug('power herb - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
	},

	// Cake
	h: {
		desc: "On switch-in and at the ened of every turn, this Pokemon changes to a random typing.",
		shortDesc: "On switch-in & every turn, random type.",
		name: "h",
		onSwitchIn(pokemon) {
			const typeList = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock",
				"Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric",
				"Psychic", "Ice", "Dragon", "Dark", "Fairy"];
			this.prng.shuffle(typeList);
			const firstType = typeList[0];
			this.prng.shuffle(typeList);
			const secondType = typeList[0];
			let newTypes = [];
			if (firstType === secondType) {
				newTypes = [firstType];
			} else {
				newTypes = [firstType, secondType];
			}
			this.add('html|<b>h</b>');
			this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[silent]');
			pokemon.setType(newTypes);
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				const typeList = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock",
					"Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric",
					"Psychic", "Ice", "Dragon", "Dark", "Fairy"];
				this.prng.shuffle(typeList);
				const firstType = typeList[0];
				this.prng.shuffle(typeList);
				const secondType = typeList[0];
				let newTypes = [];
				if (firstType === secondType) {
					newTypes = [firstType];
				} else {
					newTypes = [firstType, secondType];
				}
				this.add('html|<b>h</b>');
				this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[silent]');
				pokemon.setType(newTypes);
			}
		},
	},

	// cant say
	ragequit: {
		desc: "If Pokemon with this ability uses a move that misses or fails it faints and gives -2 Atk / -2 SpA to foe",
		shortDesc: "If move misses or fails, apply memento.",
		name: "Rage Quit",
		onAfterMove(pokemon, target, move) {
			if (pokemon.moveThisTurnResult === false) {
				this.add('-ability', pokemon, 'Rage Quit', 'boost');
				pokemon.faint();
				if (pokemon.side.foe.active[0]) {
					this.boost({atk: -2, spa: -2}, pokemon.side.foe.active[0], pokemon);
				}
			}
		},
	},

	// c.kilgannon
	pestilence: {
		desc: "All active Pokemon lose 12% of their maximum health at the end of each turn while this Pokemon is out. Fairy-types take 18% damage.",
		shortDesc: "Active Pokemon lose 12% health each turn while this Pokemon is out. Fairy-types take 18%.",
		name: "Pestilence",
		onResidualOrder: 100,
		onResidual() {
			for (const curMon of this.getAllActive()) {
				if (curMon.hasType('Fairy')) {
					this.damage(Math.floor(curMon.baseMaxhp * 0.18), curMon);
				} else {
					this.damage(Math.floor(curMon.baseMaxhp * 0.12), curMon);
				}
			}
		},
	},

	// Darth
	guardianangel: {
		desc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out. When switching in, this Pokemon's types are changed to resist the weakness of the last Pokemon in before it.",
		shortDesc: "Switching out: Regenerator. Switching in: Resists Weaknesses of last Pokemon.",
		name: "Guardian Angel",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onStart(pokemon) {
			const possibleTypes = [];
			const newTypes = [];
			const types = pokemon.side.sideConditions['tracker'].storedTypes;
			for (const u in types) {
				for (const type in this.dex.data.TypeChart) {
					const typeCheck = this.dex.data.TypeChart[type].damageTaken[pokemon.side.sideConditions['tracker'].storedTypes[u]];
					if (typeCheck === 2 || typeCheck === 3) {
						possibleTypes.push(type);
					}
				}
			}
			if (possibleTypes.length < 2) return;

			newTypes.push(this.sample(possibleTypes), this.sample(possibleTypes));
			while (newTypes[0] === newTypes[1] && possibleTypes.length > 1) {
				newTypes[1] = this.sample(possibleTypes);
			}

			if (!pokemon.setType(newTypes)) return;
			this.add('-start', pokemon, 'typechange', newTypes.join('/'));
		},
	},

	// drampa's grandpa
	oldmanpa: {
		desc: "This Pokemon's sound-based moves have their power multiplied by 1.3. This Pokemon takes halved damage from sound-based moves. This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage. Upon switching in, this Pokemon's Defense and Special Defense are raised by 1 stage.",
		shortDesc: "Effects of Punk Rock + Unaware. On switch-in, boosts Def and Sp. Def by 1.",
		name: "Old Manpa",
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Old Manpa boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags['sound']) {
				this.debug('Old Manpa weaken');
				return this.chainModify(0.5);
			}
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectData.target;
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
			this.boost({def: 1, spd: 1});
		},
	},

	// dream
	greedpunisher: {
		desc: "This Pokemon can only be damaged by direct attacks. On switch-in, this Pokemon's stats are boosted based on the number of hazards on the field. 1 stat is raised if 1-2 hazards are up, and 2 stats are raised if 3 or more hazards are up.",
		shortDesc: "On switch-in, boosts stats based on the number of hazards up on this Pokemon's side.",
		name: "Greed Punisher",
		onSwitchIn(pokemon) {
			const side = pokemon.side;
			const activeCount = Object.keys(side.sideConditions).length;
			if (activeCount > 0) {
				const stats: BoostName[] = [];
				let i = 0;
				while (i <= activeCount) {
					let stat: BoostName;
					for (stat in pokemon.boosts) {
						if (stat === 'evasion' || stat === 'accuracy' || stats.includes(stat)) continue;
						if (pokemon.boosts[stat] < 6) {
							stats.push(stat);
							i++;
						}
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					const boost: {[k: string]: number} = {};
					boost[randomStat] = 1;
					this.boost(boost, pokemon);
				} else {
					return false;
				}
			}
		},
	},

	// Emeri
	dracovoice: {
		desc: "This Pokemon's sound-based moves become Dragon-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Dragon type.",
		name: "Draco Voice",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles.dynamax) { // hardcode
				move.type = 'Dragon';
			}
		},
	},

	// fart
	bipolar: {
		desc: "When this Pokemon switches in, it changes to two random types and gets STAB.",
		shortDesc: "2 random types + STAB on switch-in.",
		name: "Bipolar",
		onSwitchIn(pokemon) {
			const typeMap = {
				Normal: "Return",
				Fighting: "Sacred Sword",
				Flying: "Drill Peck",
				Poison: "Poison Jab",
				Ground: "Earthquake",
				Rock: "Stone Edge",
				Bug: "Lunge",
				Ghost: "Shadow Bone",
				Steel: "Iron Head",
				Electric: "Zing Zap",
				Psychic: "Psychic Fangs",
				Ice: "Icicle Crash",
				Dragon: "Dual Chop",
				Dark: "Jaw Lock",
				Fairy: "Play Rough",
			};
			const types = Object.keys(typeMap);
			this.prng.shuffle(types);
			const newTypes = [types[0], types[1]];
			this.add('-start', pokemon, 'typechange', newTypes.join('/'));
			pokemon.setType(newTypes);
			let move = this.dex.getMove(typeMap[newTypes[0]]);
			pokemon.moveSlots[3] = pokemon.moveSlots[1];
			pokemon.moveSlots[1] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			move = this.dex.getMove(typeMap[newTypes[1]]);
			pokemon.moveSlots[2] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
		},
	},

	// Flare
	permafrostarmor: {
		desc: "This Pokemon takes 15% less damage from direct attacks. This Pokemon can only be damaged by direct attacks.",
		shortDesc: "Reduced damage from direct attacks. Can only be damaged by direct attacks.",
		name: "Permafrost Armor",
		onSourceModifyDamage(damage, source, target, move) {
			return this.chainModify(0.85);
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
	},

	// Frostyicelad
	iceshield: {
		desc: "This Pokemon receives 1/2 damage from special attacks. This Pokemon can only be damaged by direct attacks. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage.",
		shortDesc: "Receives 1/2 dmg from SpAtks. This Pokemon can only be damaged by direct attacks.",
		name: "Ice Shield",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
	},

	// GXS
	virusupload: {
		desc: "On switch-in, this Pokemon's Attack or Special Attack is raised by 1 stage based on the weaker combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "On switch-in, Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense.",
		name: "Virus Upload",
		onStart(pokemon) {
			let totalatk = 0;
			let totalspa = 0;
			let targ;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				targ = target;
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (targ) {
				if (totalatk && totalatk >= totalspa) {
					this.boost({atk: -1}, targ, pokemon);
				} else if (totalspa) {
					this.boost({spa: -1}, targ, pokemon);
				}
			}
		},
	},

	// Instruct
	determination: {
		desc: "15% chance to live a hit on 1HP",
		shortDesc: "15% chance to live a hit on 1HP",
		name: "Determination",
		onDamage(damage, target, source, effect) {
			if (this.randomChance(1, 15) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "Ability: Determination");
				return target.hp - 1;
			}
		},
	},

	// Jett x_x
	deceiver: {
		desc: "This Pokemon's moves that match one of its types have a same-type attack bonus of 2 instead of 1.5. If this Pokemon is at full HP, it survives one hit with at least 1 HP. Upon switching in, this Pokemon's Speed is raised by 1 stage.",
		shortDesc: "Adaptability + Sturdy. +1 Speed on switch in.",
		onStart() {
			this.boost({spe: 1}); // User has asked to remove this if its too strong in playtesting
		},
		onModifyMove(move) {
			move.stab = 2;
		},
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[from] ability: Deceiver');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Deceiver');
				return target.hp - 1;
			}
		},
		name: "Deceiver",
	},

	// Jho
	venomize: {
		desc: "This Pokemon's sound-based moves become Poison-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Poison type.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Poison';
			}
		},
		name: "Venomize",
	},

	// Jordy
	divinesandstorm: {
		desc: "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage and switch-in, this Pokemon summons Sandstorm.",
		shortDesc: "Sand Stream + Rock Head.",
		name: "Divine Sandstorm",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) return;
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		onStart(pokemon) {
			this.field.setWeather('sandstorm');
		},
	},

	// Kaiju Bunny
	secondwind: {
		desc: "This Pokemon restores 1/2 of its HP if it falls below 1/4 of its maximum HP by an enemy attack. This effect only occurs once.",
		shortDesc: "If hit below 1/4 HP, heal 1/2 max HP. One time.",
		name: "Second Wind",
		onDamagingHit(damage, target, source, move) {
			if (move && target.hp > 0 && target.hp < target.maxhp / 4 && !target.m.secondwind) {
				target.m.secondwind = true;
				this.heal(target.maxhp / 2);
			}
		},
	},

	// KingSwordYT
	bambookingdom: {
		desc: "On switch-in, this Pokemon's Defense and Special Defense are raised by 1 stage. Pokemon using physical moves against this Pokemon lose 1/8 of their maximum HP. Pokemon using special moves against this Pokemon lose 1/16 of their maximum HP. Attacking moves have their priority set to -7.",
		shortDesc: "+1 Def/SpD. -7 priority on attacks. 1/8 recoil when hit with physical move, 1/16 when hit with special move.",
		name: "Bamboo Kingdom",
		onStart(pokemon) {
			this.boost({def: 1, spd: 1}, pokemon);
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category !== 'Status') return -7;
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.damage(source.baseMaxhp / 8, source, target);
			}
			if (move.category === 'Special') {
				this.damage(source.baseMaxhp / 16, source, target);
			}
		},
	},

	// Mitsuki
	photosynthesis: {
		desc: "On switch-in, this Pokemon summons Sunny Day. If Sunny Day is active and this Pokemon is not holding Utility Umbrella, this Pokemon's Speed is doubled. If Sunny Day is active, this Pokemon's Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn. If this Pokemon is holding Utility Umbrella, its Attack remains the same and it does not lose any HP.",
		shortDesc: "Summons Sunny Day. Under sun, 2x Speed, 1.5x Attack. End of turn: lose 1/8 max HP.",
		name: "Photosynthesis",
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
		onModifyAtk(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
	},

	// n10siT
	greedymagician: {
		desc: "This Pokemon steals the item off a Pokemon it hits with an attack. If you already have an item, it is replaced with the stolen item. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon steals the item off a Pokemon it hits with an attack; existing item gets replaced with the stolen item.",
		name: "Greedy Magician",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status') {
				const yourItem = target.takeItem(source);
				if (!yourItem) return;
				if (!source.setItem(yourItem)) {
					target.item = yourItem.id;
					return;
				}
				this.add('-item', source, yourItem, '[from] ability: Greedy Magician', '[of] ' + target);
			}
		},
	},

	// Overneat
	darkestwings: {
		desc: "This Pokemon's contact moves have their power multiplied by 1.3. This Pokemon's Defense is doubled.",
		shortDesc: "Contact moves are multiplied by 1.3. Defense is doubled.",
		name: "Darkest Wings",
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
	},

	// Perish Song
	snowstorm: {
		desc: "On switch-in, the weather becomes an extremely intense snowstorm that prevents damaging Dark-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land, or Primordial Sea.",
		shortDesc: "On switch-in, extremely intense hail begins until this Ability is not active in battle.",
		onStart(source) {
			this.field.setWeather('snowstorm');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm', 'heavyhailstorm'];
			if (this.field.getWeather().id === 'snowstorm' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('snowstorm')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		name: "Snowstorm",
	},

	// phiwings99
	plausibledeniability: {
		desc: "This Pokemon's Status moves have priority raised by 1, but Dark types are immune. Additionally, This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "The effects of Unaware and Prankster combined. Dark types: immune to Prankster moves.",
		name: "Plausible Deniability",
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectData.target;
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
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
	},

	// PiraTe Princess
	wildmagicsurge: {
		desc: "Randomly changes the Pokemon's type at the end of every turn to the type of one of its moves; same-type attack bonus (STAB) is 2 instead of 1.5.",
		shortDesc: "Adaptability + Randomly changes the Pokemon’s type to the type of one of its moves every turn.",
		name: "Wild Magic Surge",
		onModifyMove(move) {
			move.stab = 2;
		},
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			const moves = Object.values(pokemon.getMoves()).map(move => move.id);
			const types: string[] = [];
			for (const move of moves) {
				types.push(this.dex.getMove(move).type);
			}
			let type = this.sample(types);
			while (!pokemon.setType(type)) {
				type = this.sample(types);
			}
			this.add('-start', pokemon, 'typechange', type);
		},
	},

	// Robb576
	thenumbersgame: {
		desc: "Changes the pokemon's form upon switch-in depending on the amount of pokemon still alive on the user's team; Necrozma-Dusk-Mane if 3 or fewer, Necrozma-Ultra if it is the last Pokemon left on the team.",
		shortDesc: "Changes the pokemon's form upon switch-in depending on the amount of pokemon still alive on the user's team.",
		name: "The Numbers Game",
		onStart(pokemon) {
			if (pokemon.side.pokemonLeft > 3) return;
			const assignNewMoves = (poke: Pokemon, moves: string[]) => {
				const carryOver = poke.moveSlots.slice().map(m => {
					return m.pp / m.maxpp;
				});
				// Incase theres ever less than 4 moves
				while (carryOver.length < 4) {
					carryOver.push(1);
				}
				poke.moveSlots = [];
				let slot = 0;
				for (const newMove of moves) {
					const move = poke.battle.dex.getMove(toID(newMove));
					if (!move.id) continue;
					poke.moveSlots.push({
						move: move.name,
						id: move.id,
						pp: ((move.noPPBoosts || move.isZ) ? Math.floor(move.pp * carryOver[slot]) : move.pp * 8 / 5),
						maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
						target: move.target,
						disabled: false,
						disabledSource: '',
						used: false,
					});
					slot++;
				}
			};
			if (pokemon.species.name === 'Necrozma-Dusk-Mane' && pokemon.side.pokemonLeft === 1) {
				pokemon.set.evs = {hp: 0, atk: 204, def: 0, spa: 200, spd: 0, spe: 104};
				pokemon.formeChange("Necrozma-Ultra", this.effect, true);
				pokemon.baseMaxhp = Math.floor(Math.floor(
					2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
				) * pokemon.level / 100 + 10);
				const newMaxHP = pokemon.baseMaxhp;
				pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
				pokemon.maxhp = newMaxHP;
				pokemon.setItem("modium6z");
				const newMoves = ['Photon Geyser', 'Earthquake', 'Dynamax Cannon', 'Fusion Flare'];
				assignNewMoves(pokemon, newMoves);
				return;
			}
			if (pokemon.species.name === "Necrozma-Dawn-Wings") {
				pokemon.set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
				pokemon.set.evs = {hp: 252, atk: 4, def: 0, spa: 0, spd: 252, spe: 0};
				pokemon.formeChange("Necrozma-Dusk-Mane", this.effect, true);
				pokemon.baseMaxhp = Math.floor(Math.floor(
					2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
				) * pokemon.level / 100 + 10);
				const newMaxHP = pokemon.baseMaxhp;
				pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
				pokemon.maxhp = newMaxHP;
				pokemon.setItem("leftovers");
				const newMoves = ['Sunsteel Strike', 'Toxic', 'Rapid Spin', 'Mode [7: Defensive]'];
				assignNewMoves(pokemon, newMoves);
			}
		},
	},

	// Segmr
	wallin: {
		desc: "When this Pokemon switches in, Aurora Veil automatically gets set up.",
		shortDesc: "Sets up Aurora Veil on switch-in.",
		name: "wAll In",
		onSwitchIn(pokemon) {
			if (pokemon.side.getSideCondition('auroraveil')) return;
			pokemon.side.addSideCondition('auroraveil');
		},
	},

	// Sunny
	oneforall: {
		desc: "This Pokemon's contact moves have their power multiplied by 1.3. If this Pokemon KOes the target with a recoil move, it regains 25% of its max HP.",
		shortDesc: "Tough Claws + recovers 25% max HP when foe is KOed with a recoil move.",
		name: "One For All",
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType === 'Move' && effect?.recoil) this.heal(source.baseMaxhp / 4);
		},
	},

	// Tenshi
	royalcoat: {
		desc: "If Sandstorm is active, this Pokemon's Speed is doubled and its Special Defense is multiplied by 1.5. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm, Speed x2 and SpD x1.5; immunity to Sandstorm.",
		name: "Royal Coat",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(2);
			}
		},
		onModifySpD(spd, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
	},

	// tiki
	truegrit: {
		desc: "This Pokemon receives 1/2 damage from special attacks. This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "Takes 1/2 damage from special moves and ignores boosts.",
		name: "True Grit",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(0.5);
			}
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectData.target;
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
	},

	// yuki
	combattraining: {
		desc: "If this Pokemon is a Cosplay Pikachu forme, the first hit it takes in battle deals 0 neutral damage. Confusion damage also breaks the immunity.",
		shortDesc: "(Pikachu-Cosplay only) First hit deals 0 damage.",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			const cosplayFormes = [
				'pikachucosplay', 'pikachuphd', 'pikachulibre', 'pikachupopstar', 'pikachurockstar', 'pikachubelle',
			];
			if (
				effect?.effectType === 'Move' &&
				cosplayFormes.includes(target.species.id) && !target.transformed
			) {
				this.add('-activate', target, 'ability: Combat Training');
				this.effectData.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			const cosplayFormes = [
				'pikachucosplay', 'pikachuphd', 'pikachulibre', 'pikachupopstar', 'pikachurockstar', 'pikachubelle',
			];
			if (!cosplayFormes.includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			const cosplayFormes = [
				'pikachucosplay', 'pikachuphd', 'pikachulibre', 'pikachupopstar', 'pikachurockstar', 'pikachubelle',
			];
			if (!cosplayFormes.includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		name: "Combat Training",
	},
	// Modified Illusion to support SSB volatiles
	illusion: {
		inherit: true,
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				let disguisedAs = toID(pokemon.illusion.name);
				pokemon.illusion = null;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				// Handle users whos names match a species
				if (this.dex.getSpecies(disguisedAs).exists) disguisedAs += 'user';
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[toID(pokemon.name)]) {
					const status = this.dex.getEffect(toID(pokemon.name));
					if (status?.exists) {
						pokemon.addVolatile(toID(pokemon.name), pokemon);
					}
				}
			}
		},
	},

	// Modified various abilities to support Perish Song's ability (Snowstorm)
	deltastream: {
		inherit: true,
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land, Heavy Hailstorm, Primordial Sea, or Snowstorm.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm', 'heavyhailstorm'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	desolateland: {
		inherit: true,
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Heavy Hailstorm, Primordial Sea, or Snowstorm.",
		shortDesc: "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.",
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm', 'heavyhailstorm'];
			if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	forecast: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'heavyhailstorm':
			case 'hail':
			case 'snowstorm':
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
	icebody: {
		inherit: true,
		desc: "If Hail or Snowstorm is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail or Snowstorm.",
		shortDesc: "Hail/Snowstorm active: heals 1/16 max HP each turn; immunity to Hail and Snowstorm.",
		onWeather(target, source, effect) {
			if (['heavyhailstorm', 'hail', 'snowstorm'].includes(effect.id)) {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (['heavyhailstorm', 'hail', 'snowstorm'].includes(type)) return false;
		},
	},
	iceface: {
		inherit: true,
		desc: "If this Pokemon is an Eiscue, the first physical hit it takes in battle deals 0 neutral damage. Its ice face is then broken and it changes forme to Noice Face. Eiscue regains its Ice Face forme when Hail or Snowstorm begins or when Eiscue switches in while Hail or Snowstorm is active. Confusion damage also breaks the ice face.",
		shortDesc: "If Eiscue, first physical hit taken deals 0 damage. Effect is restored in Hail/Snowstorm.",
		onStart(pokemon) {
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'snowstorm']) &&
				pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onAnyWeatherStart() {
			const pokemon = this.effectData.target;
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'snowstorm']) &&
				pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
	},
	overcoat: {
		inherit: true,
		shortDesc: "This Pokemon is immune to powder moves and damage from Sandstorm, Hail, and Snowstorm.",
		onImmunity(type, pokemon) {
			if (['sandstorm', 'hail', 'snowstorm', 'powder'].includes(type)) return false;
		},
	},
	primordialsea: {
		inherit: true,
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land, Heavy Hailstorm, or Snowstorm.",
		shortDesc: "On switch-in, heavy rain begins until this Ability is not active in battle.",
		onStart(source) {
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm', 'heavyhailstorm'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	slushrush: {
		inherit: true,
		shortDesc: "If a Hail-like weather is active, this Pokemon's Speed is doubled.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'snowstorm'])) {
				return this.chainModify(2);
			}
		},
	},
	snowcloak: {
		inherit: true,
		desc: "If Heavy Hailstorm, Hail, or Snowstorm is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Heavy Hailstorm, Hail or Snowstorm.",
		shortDesc: "If a Hail-like weather is active, 1.25x evasion; immunity to Hail-like weathers.",
		onImmunity(type, pokemon) {
			if (['heavyhailstorm', 'hail', 'snowstorm'].includes(type)) return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'snowstorm'])) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
	},
	// Modified Magic Guard for Alpha
	magicguard: {
		inherit: true,
		shortDesc: "This Pokemon can only be damaged by direct attacks and Heavy Hailstorm.",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'heavyhailstorm') return;
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
	},
};
