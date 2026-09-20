// Custom volatile conditions. Useful for making custom abilities and moves with persistent effects.

export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	illusiondisc: {
		name: 'illusiondisc',
		onResidual(pokemon) {
			pokemon.useItem();
			if (!pokemon.illusion) return;
			this.debug('illusion cleared');
			pokemon.illusion = null;
			const details = pokemon.getUpdatedDetails();
			this.add('replace', pokemon, details);
			this.add('-end', pokemon, 'Illusion');
			if (this.ruleTable.has('illusionlevelmod')) {
				this.hint("Illusion Level Mod is active, so this Pok\u00e9mon's true level was hidden.", true);
			}
			pokemon.removeVolatile('illusiondisc');
		},
	},
	cursecounter: {
		name: 'cursecounter',
		duration: 1,
		onStart(target) {
			this.add('-start', target, 'cursecounter1');
		},
		onEnd(target) {
			this.add('-start', target, 'cursecounter0');
			target.addVolatile('itsmecurse');
		},
		onResidualOrder: 24,
		onResidual(pokemon) {
			const duration = pokemon.volatiles['cursecounter'].duration;
			this.add('-start', pokemon, `cursecounter${duration}`);
		},
	},
	itsmecurse: {
		name: 'itsmecurse',
		onStart(target, source) {
			this.add('-start', target, 'Curse', `[of] ${source}`);
		},
		onResidualOrder: 12,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 4);
		},
	},
};
