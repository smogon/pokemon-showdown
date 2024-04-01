export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen2',
	gen: 2,
	init() {
		const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
		for (const i in this.data.Moves) {
			this.modData('Moves', i).gen = 2;
			if (this.data.Moves[i].isNonstandard === 'Past') this.modData('Moves', i).isNonstandard = null;
			if (this.data.Moves[i].category === 'Status') continue;
			const newCategory = specialTypes.includes(this.data.Moves[i].type) ? 'Special' : 'Physical';
			if (newCategory !== this.data.Moves[i].category) {
				this.modData('Moves', i).category = newCategory;
			}
		}
		for (const i in this.data.Items) {
			this.modData('Items', i).gen = 2;
			if (this.data.Items[i].isNonstandard === 'Past') this.modData('Items', i).isNonstandard = null;
		}
	},
};
