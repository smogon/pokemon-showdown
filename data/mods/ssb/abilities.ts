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
	// Aethernum
	rainyseason: {
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land, or Snowstorm. If Rain Dance is active, this Pokemon restores 1/8 of its maximum HP, rounded down, at the end of each turn. If this Pokemon is holding Big Root, it will restore 1/6 of its maximum HP, rounded down, at the end of the turn. If this Pokemon is holding Utility Umbrella, its HP does not get restored. This Pokemon collects raindrops.",
		shortDesc: "Primordial Sea + Swift Swim. Restore HP if raining. Collect raindrops.",
		name: "Rainy Season",
		onStart(source) {
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm'];
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
			let types = pokemon.side.sideConditions['tracker'].storedTypes;
			for (const u in types) {
				for (const type in this.dex.data.TypeChart) {
					let typeCheck = this.dex.data.TypeChart[type].damageTaken[pokemon.side.sideConditions['tracker'].storedTypes[u]];
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
		}
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

	// Flare
	permafrostarmor: {
		desc: "This Pokemon takes 1/10 less damage from direct attacks. This Pokemon can only be damaged by direct attacks.",
		shortDesc: "Reduced damage from direct attacks. Can only be damaged by direct attacks.",
		name: "Permafrost Armor",
		onSourceModifyDamage(damage, source, target, move) {
			return this.chainModify(0.9);
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
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm'];
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
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land, Primordial Sea, or Snowstorm.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	desolateland: {
		inherit: true,
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Primordial Sea, or Snowstorm.",
		shortDesc: "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.",
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm'];
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
			if (effect.id === 'hail' || effect.id === 'snowstorm') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail' || type === 'snowstorm') return false;
		},
	},
	iceface: {
		inherit: true,
		desc: "If this Pokemon is an Eiscue, the first physical hit it takes in battle deals 0 neutral damage. Its ice face is then broken and it changes forme to Noice Face. Eiscue regains its Ice Face forme when Hail or Snowstorm begins or when Eiscue switches in while Hail or Snowstorm is active. Confusion damage also breaks the ice face.",
		shortDesc: "If Eiscue, first physical hit taken deals 0 damage. Effect is restored in Hail/Snowstorm.",
		onStart(pokemon) {
			if (this.field.isWeather(['hail', 'snowstorm']) && pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onAnyWeatherStart() {
			const pokemon = this.effectData.target;
			if (this.field.isWeather(['hail', 'snowstorm']) && pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
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
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land, or Snowstorm.",
		shortDesc: "On switch-in, heavy rain begins until this Ability is not active in battle.",
		onStart(source) {
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'snowstorm'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	slushrush: {
		inherit: true,
		shortDesc: "If Hail or Snowstorm is active, this Pokemon's Speed is doubled.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['hail', 'snowstorm'])) {
				return this.chainModify(2);
			}
		},
	},
	snowcloak: {
		inherit: true,
		desc: "If Hail or Snowstorm is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Hail or Snowstorm.",
		shortDesc: "If Hail/Snowstorm is active, 1.25x evasion; immunity to Hail and Snowstorm.",
		onImmunity(type, pokemon) {
			if (type === 'hail' || type === 'snowstorm') return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['hail', 'snowstorm'])) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
	},
};
