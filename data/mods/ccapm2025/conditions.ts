export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	snowscape: {
		inherit: true,
		onFieldEnd() {
			this.add('-weather', 'none');
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			for (const pokemon of this.getAllActive()) {
				if (pokemon.species.id === 'wyrdeer') {
					pokemon.formeChange('Wyrdeer-Snowblind', this.effect, true);
					this.add('-activate', pokemon, 'ability: Heart of Cold');
				}
			}
		},
	},
	ber: {
		name: 'ber',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectState.counter = 0;
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-activate', target, 'ber', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-activate', target, 'ber');
			}
			if (target.species.name === 'Drifblim') {
				target.formeChange('Drifblim-Inflamed', this.effect, false);
			}
			for (const opponent of target.side.foe.active) {
				const active = opponent.side.foe.active.filter(mon => mon.status === 'ber').length > 0;
				if (opponent.species.name === 'Mesprit' && active) {
					opponent.formeChange('Mesprit-Rampaging', this.effect, false);
				}
				if (opponent.species.name === 'Mesprit-Rampaging' && !active) {
					opponent.formeChange('Mesprit', this.effect, false);
				}
			}
		},
		onDamage(damage, target, source, effect) {
			if (!target) return damage;
			const hp = target.maxhp / 16;
			this.effectState.counter += hp;
			return damage + hp;
		},
		onFoeDamage(damage, target, source, effect) {
			if (source?.getStatus().name === 'ber') {
				const hp = target.maxhp / 16;
				this.effectState.counter += hp;
				return damage + hp;
			}
		},
		onEnd(pokemon) {
			for (const opponent of pokemon.side.foe.active) {
				const active = opponent.side.foe.active.filter(mon => mon.status === 'ber').length > 0;
				if (opponent.species.name === 'Mesprit' && active) {
					opponent.formeChange('Mesprit-Rampaging', this.effect, false);
				}
				if (opponent.species.name === 'Mesprit-Rampaging' && !active) {
					opponent.formeChange('Mesprit', this.effect, false);
				}
			}
			if (pokemon.species.name === 'Drifblim-Inflamed') {
				pokemon.formeChange('Drifblim', this.effect, false);
			}
		},
		onBeforeFaint(pokemon) {
			for (const opponent of pokemon.side.foe.active) {
				const active = opponent.side.foe.active.filter(mon => mon.status === 'ber').length - 1 > 0;
				if (opponent.species.name === 'Mesprit' && active) {
					opponent.formeChange('Mesprit-Rampaging', this.effect, false);
				}
				if (opponent.species.name === 'Mesprit-Rampaging' && !active) {
					opponent.formeChange('Mesprit', this.effect, false);
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const opponent of pokemon.side.foe.active) {
				const active = opponent.side.foe.active.filter(mon => mon.status === 'ber').length - 1 > 0;
				if (opponent.species.name === 'Mesprit' && active) {
					opponent.formeChange('Mesprit-Rampaging', this.effect, false);
				}
				if (opponent.species.name === 'Mesprit-Rampaging' && !active) {
					opponent.formeChange('Mesprit', this.effect, false);
				}
			}
		},
		onSwitchIn(pokemon) {
			if (this.effectState.counter >= 10000 * pokemon.maxhp) pokemon.cureStatus();
			for (const opponent of pokemon.side.foe.active) {
				const active = opponent.side.foe.active.filter(mon => mon.status === 'ber').length > 0;
				if (opponent.species.name === 'Mesprit' && active) {
					opponent.formeChange('Mesprit-Rampaging', this.effect, false);
				}
				if (opponent.species.name === 'Mesprit-Rampaging' && !active) {
					opponent.formeChange('Mesprit', this.effect, false);
				}
			}
			if (pokemon.species.name === 'Drifblim') {
				pokemon.formeChange('Drifblim-Inflamed', this.effect, false);
			}
		},
	},
	restoring: {
		name: 'Restoring',
		duration: 1,
		onStart(target, source, sourceEffect) {
			this.add('-start', target, 'restoring');
		},
		onEnd(target) {
			if (target.species.id === 'aurorus') {
				target.formeChange('Aurorus-Glorious', this.effect, true);
				target.setAbility('megalauncher', target);
				this.add('-activate', target, 'ability: Mega Launcher');
				if (this.field.isWeather(['hail', 'snowscape'])) {
					target.heal(target.baseMaxhp / 2);
				}
			}
			this.add('-end', target, 'restoring');
		},
	},
	// advent
	gingerstorm: {
		name: 'Gingerstorm',
		effectType: 'Weather',
		duration: 5,
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Fire') && this.field.isWeather('gingerstorm')) {
				return this.modify(def, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Gingerstorm', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'Gingerstorm');
			}
			this.add('-message', `${source} whipped up a gingerstorm!`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Gingerstorm', '[upkeep]');
			this.add('-message', `The gingerstorm continues!`);
			if (this.field.isWeather('gingerstorm')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Fire')) return;
			if (target.status === 'brn') {
				this.damage(target.baseMaxhp / 8);
				this.add('-message', `${target.name} was buffeted by the gingerstorm!`);
			} else {
				this.damage(target.baseMaxhp / 16);
				this.add('-message', `${target.name} was buffeted by the gingerstorm!`);
			}
		},
		onFieldEnd() {
			this.add('-weather', 'none');
			this.add('-message', `The gingerstorm subsided...`);
		},
	},
};
