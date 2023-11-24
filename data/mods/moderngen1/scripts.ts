export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen1',
	gen: 1,
	init() {
		for (const i in this.data.Pokedex) {
			(this.data.Pokedex[i] as any).gender = 'N';
			(this.data.Pokedex[i] as any).eggGroups = null;
		}
		const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
		let newCategory = '';
		for (const i in this.data.Moves) {
			if (!this.data.Moves[i]) console.log(i);
			if (this.data.Moves[i].category === 'Status') continue;
			newCategory = specialTypes.includes(this.data.Moves[i].type) ? 'Special' : 'Physical';
			if (newCategory !== this.data.Moves[i].category) {
				this.modData('Moves', i).category = newCategory;
			}
		}
	},
};
