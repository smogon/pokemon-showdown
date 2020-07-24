export const Formats: {[k: string]: ModdedFormatsData} = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Dig', 'Fly'],
	},
	scalemonsmod: {
		effectType: 'Rule',
		name: 'Scalemons Mod',
		desc: "Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 500 as possible",
		onBegin() {
			this.add('rule', 'Scalemons Mod: Every Pokemon\'s stats, barring HP, are scaled to come as close to a BST of 500 as possible');
		},
		onModifySpecies(species, target, source) {
			const newSpecies = this.dex.deepClone(species);
			newSpecies.baseStats = this.dex.deepClone(newSpecies.baseStats);
			const stats: StatName[] = ['atk', 'def', 'spa', 'spe'];
			const pst: number = stats.map(stat => newSpecies.baseStats[stat]).reduce((x, y) => x + y);
			const scale = 500 - newSpecies.baseStats['hp'];
			for (const stat of stats) {
				newSpecies.baseStats[stat] = this.clampIntRange(newSpecies.baseStats[stat] * scale / pst, 1, 255);
			}
			return newSpecies;
		},
	},
};
