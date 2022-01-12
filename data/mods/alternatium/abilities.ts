/*

Ratings and how they work:

-1: Detrimental
	  An ability that severely harms the user.
	ex. Defeatist, Slow Start

 0: Useless
	  An ability with no overall benefit in a singles battle.
	ex. Color Change, Plus

 1: Ineffective
	  An ability that has minimal effect or is only useful in niche situations.
	ex. Light Metal, Suction Cups

 2: Useful
	  An ability that can be generally useful.
	ex. Flame Body, Overcoat

 3: Effective
	  An ability with a strong effect on the user or foe.
	ex. Chlorophyll, Sturdy

 4: Very useful
	  One of the more popular abilities. It requires minimal support to be effective.
	ex. Adaptability, Magic Bounce

 5: Essential
	  The sort of ability that defines metagames.
	ex. Imposter, Shadow Tag

*/

export const Abilities: {[abilityid: string]: AbilityData} = {
	galewings: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move && (move.type === 'Flying' ||
				(pokemon.species.id === 'silvallyflying' &&
					move.id === 'multiattack')) && pokemon.hp === pokemon.maxhp) {
				return priority + 1;
			}
		},
		name: "Gale Wings",
		rating: 3,
		num: 177,
	},
	powerofalchemy: {
		onAnyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			const additionalBannedAbilities = [
				'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard',
			];
			if (target.getAbility().isPermanent || additionalBannedAbilities.includes(target.ability)) return;
			this.add('-ability', this.effectState.target, ability, '[from] ability: Power of Alchemy', '[of] ' + target);
			this.effectState.target.setAbility(ability);
		},
		name: "Power of Alchemy",
		shortDesc: "This Pokémon copies the ability of the last fainted Pokémon.",
		rating: 0,
		num: 223,
	},
	quickdraw: {
		onModifyPriority(priority, source, move) {
			if (source.activeMoveActions < 1) {
				return priority + 1;
			} else if (source.activeMoveActions > 1) {
				return priority + 0;
			}
		},
		name: "Quick Draw",
		shortDesc: "User's moves have increased priority in the first turn.",
		rating: 2.5,
		num: 259,
	},
	rkssystem: {
		onStart(pokemon) {
			switch (pokemon.species.id) {
			case 'silvally':
				this.add('-ability', pokemon, 'Adaptability', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('adaptability');
				break;
			case 'silvallybug':
				this.add('-ability', pokemon, 'Tinted Lens', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('tintedlens');
				break;
			case 'silvallydark':
				this.add('-ability', pokemon, 'Dark Aura', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('darkaura');
				break;
			case 'silvallydragon':
				this.add('-ability', pokemon, 'Multiscale', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('multiscale');
				break;
			case 'silvallyelectric':
				this.add('-ability', pokemon, 'Lightning Rod', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('lightningrod');
				break;
			case 'silvallyfairy':
				this.add('-ability', pokemon, 'Misty Surge', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('mistysurge');
				break;
			case 'silvallyfighting':
				this.add('-ability', pokemon, 'Scrappy', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('scrappy');
				break;
			case 'silvallyfire':
				this.add('-ability', pokemon, 'Flash Fire', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('flashfire');
				break;
			case 'silvallyflying':
				this.add('-ability', pokemon, 'Gale Wings', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('galewings');
				break;
			case 'silvallyghost':
				this.add('-ability', pokemon, 'Prankster', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('prankster');
				break;
			case 'silvallygrass':
				this.add('-ability', pokemon, 'Grassy Surge', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('grassysurge');
				break;
			case 'silvallyground':
				this.add('-ability', pokemon, 'Mold Breaker', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('moldbreaker');
				break;
			case 'silvallyice':
				this.add('-ability', pokemon, 'Refrigerate', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('refrigerate');
				break;
			case 'silvallypoison':
				this.add('-ability', pokemon, 'Corrosion', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('corrosion');
				break;
			case 'silvallypsychic':
				this.add('-ability', pokemon, 'Magic Guard', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('magicguard');
				break;
			case 'silvallyrock':
				this.add('-ability', pokemon, 'Sand Stream', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('sandstream');
				break;
			case 'silvallysteel':
				this.add('-ability', pokemon, 'Magnet Pull', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('magnetpull');
				break;
			case 'silvallywater':
				this.add('-ability', pokemon, 'Water Absorb', '[from] ability: RKS System', '[of] ' + pokemon);
				pokemon.setAbility('waterabsorb');
				break;
			}
		},
		isPermanent: undefined,
		name: "RKS System",
		shortDesc: "Ability varies based on the user's type.",
		rating: 4,
		num: 225,
	},
	staticcling: {
		onTakeItem(item, pokemon, source) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Static Cling');
				return false;
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
					return;
				}
				const yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Static Cling', '[of] ' + target);
			}
		},
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.flags['contact']) {
				if (source.item || source.volatiles['gem'] || move.id === 'fling') return;
				const yourItem = target.takeItem(source);
				if (!yourItem) return;
				if (!source.setItem(yourItem)) {
					target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Static Cling', '[of] ' + source);
				this.add('-item', target, yourItem, '[from] ability: Static Cling', '[of] ' + source);
			}
		},
		name: "Static Cling",
		shortDesc: "This Pokemon cannot lose its held item. Contact: Steals opponent's item on contact, if the user has no item.",
		rating: 0,
		num: 1001,
	},
	rarecold: {
		onSourceModifyDamage(damage, source, target, move) {
			if (source.getStat('spe', false, true) <= target.getStat('spe', false, true) && !(move.priority > 0.1)) {
				return this.chainModify(0.7);
			}
		},
		name: "Rare Cold",
		shortDesc: "User takes 30% less damage if user moves before the target.",
		rating: 0,
		num: 1002,
	},
	watercycle: {
		onBasePower(basePower, attacker, defender, move) {
			if (defender.volatiles['partiallytrapped']) {
				return this.chainModify(1.3);
			}
		},
		name: "Water Cycle",
		shortDesc: "User deal 1.3x damage to trapped targets.",
		rating: 0,
		num: 1003,
	},
	cloudburst: {
		onBeforeMove(source, target, move) {
			if (move.type === 'Electric' && !this.field.isWeather('raindance')) {
				this.field.setWeather('raindance');
			}
		},
		name: "Cloud Burst",
		shortDesc: "User summons Rain before executing an Electric-type move.",
		rating: 0,
		num: 1004,
	},
	packleader: {
		onModifyAtk(atk, source, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				return this.chainModify(1.3);
			}
		},
		name: "Pack Leader",
		shortDesc: "If this Pokemon goes first, it deals 1.3x damage.",
		rating: 0,
		num: 1005,
	},
	privatewifi: {
		onStart(source) {
			if (source.hasItem('burndrive')) {
				source.types[1] = 'Fire';
			} else if (source.hasItem('chilldrive')) {
				source.types[1] = 'Ice';
			} else if (source.hasItem('dousedrive')) {
				source.types[1] = 'Water';
			} else if (source.hasItem('shockdrive')) {
				source.types[1] = 'Electric';
			}
			this.add('-activate', source, 'ability: Private Wi-Fi');
			this.add('-message', `${source.name} changed its type to match its Drive!`);
			for (const foeactive of source.side.foe.active) {
				if (
					!foeactive ||
					foeactive.fainted ||
					(
						!foeactive.hasType(source.types[1]) &&
						!foeactive.hasType("Steel")
					)
				) continue;
				// Boosts player's Pokemon's highest stat
				let statName = 'atk';
				let bestStat = 0;
				let s: StatIDExceptHP;
				for (s in source.storedStats) {
					if (source.storedStats[s] > bestStat) {
						statName = s;
						bestStat = source.storedStats[s];
					}
				}
				this.boost({[statName]: 1}, source);

				// Boosts opponent's Pokemon's highest stat
				let statNameOpp = 'atk';
				let bestStatOpp = 0;
				let sOpp: StatIDExceptHP;
				for (sOpp in foeactive.storedStats) {
					if (foeactive.storedStats[sOpp] > bestStatOpp) {
						statNameOpp = sOpp;
						bestStatOpp = foeactive.storedStats[sOpp];
					}
				}
				this.boost({[statNameOpp]: 1}, foeactive);
			}
		},
		name: "Private Wi-Fi",
		shortDesc: "If this Pokemon switches in and the opposing Pokemon shares its type, both have their highest stat boosted.",
		rating: 0,
		num: 1006,
	},
	mountaineer: {
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
		isNonstandard: undefined,
		name: "Mountaineer",
		rating: 3,
		num: -2,
	},
	lifegem: {
		onModifyDamage(damage, source, target, move) {
			if (!target.hasAbility("aurabreak")) {
				return this.chainModify(1.3);
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status') {
				this.add('-ability', source, 'Life Gem');
				this.damage(source.baseMaxhp / 10, source, source);
			}
		},
		name: "Life Gem",
		shortDesc: "Holder's attacks do 1.3x damage, and it loses 1/10 its max HP after the attack.",
		rating: 3,
		num: 1007,
	},
	powercore: {
		// Hazard Immunity implemented in moves.js
		onBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) {
				boost[i] = 0;
				this.add('-ability', target, 'Power Core');
				this.hint("Power Core prevents stat changes for the user.");
			}
		},
		onSetStatus(status, target, source, effect) {
			if (effect && effect.id === 'toxicspikes') return false;
		},
		onDamage(damage, target, source, effect) {
			const hazards = ['stealthrock', 'spikes'];
			if (effect && hazards.includes(effect.id)) {
				return false;
			}
		},
		name: "Power Core",
		shortDesc: "Immunity to hazards and any kind of stat changes.",
		rating: 3,
		num: 1008,
	},
	aerialmenace: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Flying') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[from] ability: Aerial Menace');
				}
				return null;
			}
		},
		name: "Aerial Menace",
		shortDesc: "This Pokemon's attack is raised by one stage if hit by a Flying-type move; Flying-type immunity.",
		rating: 3,
		num: 1009,
	},
	shadowworld: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Shadow World');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target !== source || move.category !== 'Status' || move.type === 'Ghost' || move.type === 'Dark') {
				if (!move.auraBooster) move.auraBooster = this.effectState.target;
				if (move.auraBooster !== this.effectState.target) return;
				return this.chainModify(1.2);
			} else if (target !== source || move.category !== 'Status' || move.type === 'Fairy' || move.type === 'Psychic') {
				if (!move.auraBooster) move.auraBooster = this.effectState.target;
				if (move.auraBooster !== this.effectState.target) return;
				return this.chainModify(0.8);
			}
		},
		name: "Shadow World",
		shortDesc: "When this Ability is active, Ghost & Dark moves have 1.2x power. Psychic & Fairy have 0.8x power.",
		rating: 3,
		num: 1010,
	},
	burnheal: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.heal(target.baseMaxhp / 8);
				return false;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon, target, move) {
			// this is a hack but it's a lot shorter than copying the entire modifyDamage function into scripts to change 1 line
			if (pokemon.status === "brn" && move.id !== "facade") {
				return this.chainModify(2);
			}
		},
		name: "Burn Heal",
		shortDesc: "This Pokemon is healed by 1/8 of its max HP each turn when burned; no HP loss or damage reduction.",
		rating: 4,
		num: 1011,
	},
	sharpshooter: {
		onStart(source) {
			const target = source.side.foe.active[0];
			target.addVolatile('lockon', source);
			this.add('-activate', target, 'move: Lock-On', '[of] ' + source);
		},
		name: "Sharpshooter",
		shortDesc: "On switch-in, this Pokemon activates the Lock-On effect.",
		rating: 2,
		num: 1012,
	},
	forecast: {
		onSwitchIn(pokemon) {
			this.effectState.switchingIn = true;
		},
		onStart(pokemon) {
			if (this.effectState.switchingIn) {
				if (this.field.isWeather('raindance')) {
					this.field.clearWeather();
					this.field.setWeather('raindance');
				}
				if (this.field.isWeather('sunnyday')) {
					this.field.clearWeather();
					this.field.setWeather('sunnyday');
				}
				if (this.field.isWeather('sandstorm')) {
					this.field.clearWeather();
					this.field.setWeather('sandstorm');
				}
				if (this.field.isWeather('hail')) {
					this.field.clearWeather();
					this.field.setWeather('hail');
				}
			}
		},
		onUpdate(pokemon) {
			if (pokemon.species.id !== 'catastroform') return;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id === 'catastroform') pokemon.types[1] = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id === 'catastroform') pokemon.types[1] = 'Water';
				break;
			case 'hail':
				if (pokemon.species.id === 'catastroform') pokemon.types[1] = 'Ice';
				break;
			case 'sandstorm':
				if (pokemon.species.id === 'catastroform') pokemon.types[1] = 'Rock';
				break;
			default:
				if (pokemon.species.id === 'catastroform') return;
				break;
			}
		},
		name: "Forecast",
		shortDesc: "Upon Entry, resets any regular weather. Gets secondary typing matching weather.",
		rating: 2,
		num: 59,
	},
	liquidscales: {
		onDamagingHit(damage, target, source, move) {
			if (move.category !== 'Status') {
				this.heal(target.baseMaxhp / 10);
			}
		},
		name: "Liquid Scales",
		shortDesc: "If targeted by a foe's move, this Pokemon restores 1/10 max HP.",
		rating: 3,
		num: 1013,
	},
	flowergift: {
		onModifyAtkPriority: 3,
		onModifyAtk(atk, source) {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasAbility('aurabreak')) return;
			}
			if (source.species.id !== 'shayminsky') return;
			if (['sunnyday', 'desolateland'].includes(source.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onModifySpD(spd, source) {
			if (source.species.id !== 'shayminsky') return;
			if (['sunnyday', 'desolateland'].includes(source.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		name: "Flower Gift",
		shortDesc: "If user is Shaymin-Sky and Sunny Day is active, its Attack and Sp. Def are 1.5x.",
		rating: 1,
		num: 122,
	},
	mistycoat: {
		onModifySpDPriority: 6,
		onModifySpD(pokemon) {
			if (this.field.isTerrain('mistyterrain')) return this.chainModify(1.5);
		},
		name: "Misty Coat",
		shortDesc: "If Misty Terrain is active, this Pokemon's Special Defense is multiplied by 1.5.",
		rating: 0.5,
		num: 1014,
	},
	pulpup: {
		onStart(pokemon) {
			pokemon.addVolatile('stockpile');
		},
		name: "Pulp Up",
		shortDesc: "On entry, at >= 2/3 HP; 1x Stockpile, at <= 1/3 HP; 3x Stockpile, else 2x Stockpile.",
		rating: 3,
		num: 1015,
	},
	asonearrokuda: {
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		isPermanent: true,
		name: "As One (Arrokuda)",
		shortDesc: "Mold Breaker + Swift Swim",
		rating: 4,
		num: 1016,
	},
	iceface: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			} else if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			} else if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch') return null;
		},
		name: "Ice Face",
		shortDesc: "Takes 2x damage from Fire and 0.5x damage from Water. Immune to flinch.",
		rating: 3,
		num: 248,
	},
	washup: {
		onStart(source) {
			this.field.addPseudoWeather('watersport');
		},
		name: "Wash Up",
		shortDesc: "On switch-in, this Pokemon summons the Water Sport effect.",
		rating: 2,
		num: 1017,
	},
	darkaura: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Dark Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			if (!move.auraBooster) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify(1.33);
		},
		name: "Dark Aura",
		rating: 3,
		num: 186,
	},
	fairyaura: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Fairy') return;
			if (!move.auraBooster) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify(1.33);
		},
		name: "Fairy Aura",
		rating: 3,
		num: 187,
	},
	aurabreak: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Aura Break');
		},
		name: "Aura Break",
		shortDesc: "This Pokemon ignores the effects certain Abilities of other Pokemon have on their moves.",
		rating: 2.5,
		num: 188,
	},
	powerconstruct: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Dragon' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Dragon' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		name: "Power Construct",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Dragon attacks.",
		rating: 2,
		num: 211,
	},
};
