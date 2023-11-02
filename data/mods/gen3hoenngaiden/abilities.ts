export const Abilities: {[k: string]: ModdedAbilityData} = {
	snowwarning: {
		inherit: true,
		onStart(source) {
			this.field.setWeather('hail');
		},
		isNonstandard: null,
		gen: 3,
	},
	rkssystem: {
		shortDesc: "If this Pokemon is a Silvally, its type changes to match its held Memory.",
		// RKS System's type-changing itself is implemented in statuses.js
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	sandveil: {
		shortDesc: "This Pokemon can not be damaged by sandstorm.",
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	icebody: {
		shortDesc: "This Pokemon can not be damaged by hail.",
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		isNonstandard: null,
		gen: 3,
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	overcoat: {
		shortDesc: "This Pokemon is immune to powder moves, Sandstorm or Hail damage, and Effect Spore.",
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (move.flags['powder'] && target !== source && this.dex.getImmunity('powder', target)) {
				this.add('-immune', target, '[from] ability: Overcoat');
				return null;
			}
		},
		isNonstandard: null,
		gen: 3,
		name: "Overcoat",
		rating: 2,
		num: 142,
	},
	magicguard: {
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		isNonstandard: null,
		gen: 3,
		name: "Magic Guard",
		rating: 4,
		num: 98,
	},
	galvanize: {
		onModifyMove(move) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id)) {
				move.type = 'Electric';
				move.category = 'Special';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		isNonstandard: null,
		gen: 3,
		name: "Galvanize",
		rating: 4,
		num: 206,
	},
	desolateland: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	forecast: {
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
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
		name: "Forecast",
		rating: 2,
		num: 59,
	},
	chlorophyll: {
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		name: "Chlorophyll",
		rating: 3,
		num: 34,
	},
	moldbreaker: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	gulpmissile: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	analytic: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	neutralizinggas: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	protean: {
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		isNonstandard: null,
		gen: 3,
		name: "Protean",
		rating: 4.5,
		num: 168,
	},
	innerfocus: {
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch') return null;
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', '[of] ' + target);
			}
		},
		name: "Inner Focus",
		shortDesc: "This Pokemon cannot be made to flinch. Immune to Intimidate.",
		rating: 1.5,
		num: 39,
	},
	owntempo: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Own Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit(target, source, move) {
			if (move?.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Own Tempo', '[of] ' + target);
			}
		},
		name: "Own Tempo",
		shortDesc: "This Pokemon cannot be confused. Immune to Intimidate.",
		rating: 1.5,
		num: 20,
	},
	oblivious: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract') {
				this.add('-immune', pokemon, '[from] Oblivious');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', '[of] ' + target);
			}
		},
		name: "Oblivious",
		shortDesc: "This Pokemon cannot be infatuated. Immune to Intimidate.",
		rating: 1.5,
		num: 12,
	},
	stakeout: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	furcoat: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	comatose: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
};
