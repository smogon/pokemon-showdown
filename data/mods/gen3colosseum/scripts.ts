export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen3',
	gen: 3,

	checkWin(faintData?: Battle['faintQueue'][0]) {
		if (this.sides.every(side => !side.pokemonLeft)) {
			let isSelfKo = false;
			if (faintData?.effect) {
				isSelfKo = isSelfKo || this.dex.moves.getByID(faintData?.effect?.id).selfdestruct !== undefined;
				isSelfKo = isSelfKo || this.dex.moves.getByID(faintData?.effect?.id).recoil !== undefined;
			}
			if (isSelfKo) {
				this.win(faintData ? faintData.target.side : null);
				return true;
			} else {
				this.win(undefined);
				return true;
			}
		}
		for (const side of this.sides) {
			if (!side.foePokemonLeft()) {
				this.win(side);
				return true;
			}
		}
	},
};
