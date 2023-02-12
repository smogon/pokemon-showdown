export const Items: {[k: string]: ModdedItemData} = {
	// Aeonic
	fossilizedfish: {
		inherit: true,
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		desc: "At the end of every turn, holder restores 1/16 of its max HP.",
	},
};
