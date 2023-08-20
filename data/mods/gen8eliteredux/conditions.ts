export const Conditions: {[k: string]: ModdedConditionData} = {
	frz: {
		inherit: true,
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {},
		
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
	},
}
