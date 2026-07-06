export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	shadow: {
		name: 'Shadow',
		noCopy: true,
		onStart(pokemon) {
			this.add('-start', pokemon, 'shadow');
			this.add('-anim', pokemon, "Hex", pokemon);
			this.add('-message', `${pokemon.name} has had its heart sealed!`);
			if (pokemon.species.id === 'lugia') {
				pokemon.formeChange('Shadow Lugia', this.effect, true);
				pokemon.setAbility('shadowdomain', pokemon);
				this.add('-activate', pokemon, 'ability: Shadow Domain');
				pokemon.baseMaxhp = Math.floor(Math.floor(
					2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
				) * pokemon.level / 100 + 10);
				const newMaxHP = pokemon.volatiles['dynamax'] ? (2 * pokemon.baseMaxhp) : pokemon.baseMaxhp;
				pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
				pokemon.maxhp = newMaxHP;
				this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'shadow');
		},
	},
	shadowsky: {
		name: 'Shadow Sky',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source.baseSpecies.name === 'Shadow Lugia' && source.hasItem('shadoworb')) {
				return 10;
			}
			return 5;
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Shadow Sky', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-weather', 'Shadow Sky');
			}
			this.add('-message', `A shadowy aura filled the sky!`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Shadow Sky', '[upkeep]');
			this.add('-message', `The shadowy aura persists!`);
			if (this.field.isWeather('shadowsky')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (!target.volatiles['shadow']) {
				this.damage(target.baseMaxhp / 8);
				this.add('-message', `A flashing light strikes ${target.name}!`);
			}
		},
		onFieldEnd() {
			this.add('-weather', 'none');
			this.add('-message', `The shadowy aura faded away...`);
		},
	},
};
