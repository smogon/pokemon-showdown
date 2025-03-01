export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	tox: {
		inherit: true,
		onResidual(pokemon) {
			if (this.effectState.stage < 15) {
				this.effectState.stage++;
			}
			const calc = calculate(this, this.effectState.source, pokemon);
			this.damage(calc * this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectState.stage);
		},
	},
	brn: {
		inherit: true,
		onResidual(pokemon) {
			const calc = calculate(this, this.effectState.source, pokemon);
			this.damage(calc * pokemon.baseMaxhp / 16);
		},
	},
	psn: {
		inherit: true,
		onResidual(pokemon) {
			const calc = calculate(this, this.effectState.source, pokemon);
			this.damage(calc * pokemon.baseMaxhp / 8);
		},
	},
	partiallytrapped: {
		inherit: true,
		onResidual(pokemon) {
			const source = this.effectState.source;
			// G-Max Centiferno and G-Max Sandblast continue even after the user leaves the field
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns) && !gmaxEffect) {
				delete pokemon.volatiles['partiallytrapped'];
				this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]', '[silent]');
				return;
			}
			const calc = calculate(this, source, pokemon);
			this.damage(calc * pokemon.baseMaxhp / this.effectState.boundDivisor);
		},
	},
	sandstorm: {
		inherit: true,
		onWeather(target) {
			const calc = calculate(this, this.effectState.source, target);
			this.damage(calc * target.baseMaxhp / 16);
		},
	},
};

function calculate(battle: Battle, source: Pokemon, pokemon: Pokemon) {
	const move = battle.dex.getActiveMove('tackle');
	move.type = source.getTypes()[0];
	const typeMod = 2 ** battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6);
	if (!pokemon.runImmunity(move.type)) return 0;
	return typeMod;
}
