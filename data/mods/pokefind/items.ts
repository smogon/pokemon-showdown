export const Items: {[k: string]: ModdedItemData} = {
	thickclub: {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Cubone' || pokemon.baseSpecies.baseSpecies === 'Marowak') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Marowak", "Marowak-Alola", "Marowak-Alola-Totem", "Cubone", "Marowak-Shadow", "Alolan Marowak",
			"Kyoto Marowak"],
	},
	souldew: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (
				move && (user.baseSpecies.num === 380 || user.baseSpecies.num === 381) &&
				(move.type === 'Psychic' || move.type === 'Dragon')
			) {
				return this.chainModify([4915, 4096]);
			}
		},
		itemUser: ["Latios", "Latias", "Haikou Latias", "Haikou Latios"],
	},
};
