export const Conditions: {[k: string]: ModdedConditionData} = {
	par: {
		inherit: true,
		onBeforeMove(pokemon) {
			if (!pokemon.hasAbility('magicguard') && this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-4 turns
			this.effectData.time = this.random(2, 6);
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusData.time--;
			}
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	frz: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			if (move.flags['defrost']) return;
			this.add('cant', pokemon, 'frz');
			return false;
		},
	},
	substitutebroken: {
		noCopy: true,
	},
	trapped: {
		inherit: true,
		noCopy: false,
	},
	trapper: {
		inherit: true,
		noCopy: false,
	},
	partiallytrapped: {
		inherit: true,
		durationCallback(target, source) {
			if (source.hasItem('gripclaw')) return 6;
			return this.random(3, 7);
		},
	},
	stall: {
		// In gen 3-4, the chance of protect succeeding does not fall below 1/8.
		// See http://upokecenter.dreamhosters.com/dex/?lang=en&move=182
		inherit: true,
		counterMax: 8,
	},
	// Arceus's true typing for all its formes is Normal, and it's only Multitype
	// that changes its type, but its formes are specified to be their corresponding
	// type in the Pokedex, so that needs to be overridden. Without Multitype it
	// starts as Normal type, but its type can be changed by other effects.
	// This is mainly relevant for Hackmons Cup and Balanced Hackmons.
	arceus: {
		name: 'Arceus',
		onBeforeSwitchIn(pokemon) {
			pokemon.setType('Normal'); // Multitype will prevent this
		},
		onSwitchIn(pokemon) {
			if (pokemon.ability === 'multitype') {
				const item = pokemon.getItem();
				const targetForme = (item?.onPlate ? 'Arceus-' + item.onPlate : 'Arceus');
				if (pokemon.species.name !== targetForme) {
					pokemon.formeChange(targetForme);
				}
			}
		},
	},
};
