export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen3',
	gen: 3,

	checkWin(faintData?: Battle['faintQueue'][0]) {
		if (this.sides.every(side => !side.pokemonLeft)) {
			this.win(faintData ? faintData.target.side : null);
			return true;
		}
		for (const side of this.sides) {
			if (!side.foePokemonLeft()) {
				this.win(side);
				return true;
			}
		}
	},
};
