export const Conditions: {[k: string]: ModdedConditionData} = {
	sweetveilscreen: {
		name: "SweetVeilScreen",
		duration: 5,
		durationCallback(target, source, effect) {
			if (source?.hasItem('lightclay')) {
				return 8;
			}
			return 5;
		},
		onStart(side) {
			this.add('-sidestart', side, 'ability: Sweet Veil');
		},
		onEnd(side) {
			this.add('-sideend', side, 'ability: Sweet Veil');
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(side) {
			if (this.field.isTerrain('grassyterrain')) return;
			for (const ally of side.active) {
				this.heal(ally.maxhp / 16);
			}
		},
		onTerrain(pokemon) {
			if (!this.field.isTerrain('grassyterrain')) return;
			for (const ally of pokemon.side.active) {
				this.heal(ally.maxhp / 16);
			}
		},
	},
};
