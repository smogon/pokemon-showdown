export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	tox: {
		inherit: true,
		onResidual(pokemon) {
			if (this.effectState.stage < 15) {
				this.effectState.stage++;
			}
			const calc = calculate(this, this.effectState.attacker, pokemon);
			this.damage(calc * this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectState.stage);
		},
	},
	brn: {
		inherit: true,
		onResidual(pokemon) {
			const calc = calculate(this, this.effectState.attacker, pokemon);
			this.damage(calc * pokemon.baseMaxhp / 16);
		},
	},
	psn: {
		inherit: true,
		onResidual(pokemon) {
			const calc = calculate(this, this.effectState.attacker, pokemon);
			this.damage(calc * pokemon.baseMaxhp / 8);
		},
	},
	partiallytrapped: {
		inherit: true,
		onResidual(pokemon) {
			const attacker = this.effectState.attacker;
			// G-Max Centiferno and G-Max Sandblast continue even after the user leaves the field
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (attacker && (!attacker.isActive || attacker.hp <= 0 || !attacker.activeTurns) && !gmaxEffect) {
				delete pokemon.volatiles['partiallytrapped'];
				this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]', '[silent]');
				return;
			}
			const calc = calculate(this, attacker, pokemon);
			this.damage(calc * pokemon.baseMaxhp / this.effectState.boundDivisor);
		},
	},
	sandstorm: {
		inherit: true,
		onWeather(defender) {
			const calc = calculate(this, this.effectState.attacker, defender);
			this.damage(calc * defender.baseMaxhp / 16);
		},
	},
};

function calculate(battle: Battle, attacker: Pokemon, pokemon: Pokemon) {
	const move = battle.dex.getActiveMove('tackle');
	move.type = attacker.getTypes()[0];
	const typeMod = 2 ** battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6);
	if (!pokemon.runImmunity(move)) return 0;
	return typeMod;
}
