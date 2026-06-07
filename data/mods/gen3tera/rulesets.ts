export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	bonustypemod: {
		effectType: 'Rule',
		name: 'Bonus Type Mod',
		desc: `In Gen 3 Tera: enables Tera Type validation without adding it as a passive bonus type.`,
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.canTerastallize = this.actions.canTerastallize(pokemon);
			}
		},
	},
};
