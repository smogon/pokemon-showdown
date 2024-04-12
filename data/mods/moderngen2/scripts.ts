export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen2',
	gen: 2,
	init() {
		const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].num! >= 252) this.modData('Moves', i).gen = 2;
			const illegalities = ['Past', 'LGPE', 'Unobtainable'];
			if (this.data.Moves[i].isNonstandard && illegalities.includes(this.data.Moves[i].isNonstandard as string)) {
				this.modData('Moves', i).isNonstandard = null;
			}
			if (this.data.Moves[i].category === 'Status') continue;
			const newCategory = specialTypes.includes(this.data.Moves[i].type) ? 'Special' : 'Physical';
			if (newCategory !== this.data.Moves[i].category) {
				this.modData('Moves', i).category = newCategory;
			}
		}
		for (const i in this.data.Items) {
			if (this.data.Items[i].gen! > 2) this.modData('Items', i).gen = 2;
			if (this.data.Items[i].isNonstandard === 'Past') this.modData('Items', i).isNonstandard = null;
		}
		for (const i in this.data.Pokedex) {
			if (this.species.get(i).gen > 2) this.modData('Pokedex', i).gen = 2;
		}
		for (const i in this.data.FormatsData) {
			if (this.forGen(9).species.get(i).isNonstandard === 'Past') {
				this.modData('FormatsData', i).isNonstandard = null;
			}
		}
	},
};
