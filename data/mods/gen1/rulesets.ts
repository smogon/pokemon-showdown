export const Formats: {[k: string]: ModdedFormatData} = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Desync Clause Mod', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Dig', 'Fly'],
	},
	'350cupmod': {
		effectType: 'Rule',
		name: '350 Cup Mod',
		desc: "If a Pok&eacute;mon's BST is 350 or lower, all of its stats get doubled.",
		onBegin() {
			this.add('rule', '350 Cup Mod: If a Pokemon\'s BST is 350 or lower, all of its stats get doubled.');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			const bst = newSpecies.bst;
			if (bst <= 350) {
				newSpecies.bst = 0;
				for (const stat in newSpecies.baseStats) {
					if (stat === 'spd') continue;
					newSpecies.baseStats[stat] = this.clampIntRange(newSpecies.baseStats[stat] * 2, 1, 255);
					newSpecies.bst += newSpecies.baseStats[stat];
				}
			}
			return newSpecies;
		},
	},
	flippedmod: {
		effectType: 'Rule',
		name: 'Flipped Mod',
		desc: "Every Pok&eacute;mon's stats are reversed. HP becomes Spe, Atk becomes Spc, Def stays the same.",
		onBegin() {
			this.add('rule', 'Pokemon have their stats flipped (HP becomes Spe, vice versa).');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			const stats: {[k: string]: number} = {
				hp: newSpecies.baseStats.spe,
				atk: newSpecies.baseStats.spa,
				def: newSpecies.baseStats.def,
				spa: newSpecies.baseStats.atk,
				spd: newSpecies.baseStats.atk,
				spe: newSpecies.baseStats.hp,
			};
			for (const i in newSpecies.baseStats) {
				newSpecies.baseStats[i] = stats[i];
			}
			return newSpecies;
		},
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
			const pst: number = newSpecies.bst - newSpecies.baseStats['hp'];
			const scale = 500 - newSpecies.baseStats['hp'];
			newSpecies.bst = newSpecies.baseStats['hp'];
			for (const stat in newSpecies.baseStats) {
				if (stat === 'hp' || stat === 'spd') continue;
				newSpecies.baseStats[stat] = this.clampIntRange(newSpecies.baseStats[stat] * scale / pst, 1, 255);
				newSpecies.bst += newSpecies.baseStats[stat];
			}
			return newSpecies;
		},
	},
};
