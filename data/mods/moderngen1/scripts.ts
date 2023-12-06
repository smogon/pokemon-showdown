export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen1',
	gen: 1,
	init() {
		for (const i in this.data.Pokedex) {
			this.modData('Pokedex', i).gen = 1;
			this.modData('Pokedex', i).gender = 'N';
			this.modData('Pokedex', i).eggGroups = null;
		}
		const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
		for (const i in this.data.Moves) {
			this.modData('Moves', i).gen = 1;
			if (this.data.Moves[i].category === 'Status') continue;
			const newCategory = specialTypes.includes(this.data.Moves[i].type) ? 'Special' : 'Physical';
			if (newCategory !== this.data.Moves[i].category) {
				this.modData('Moves', i).category = newCategory;
			}
		}
	},
};
