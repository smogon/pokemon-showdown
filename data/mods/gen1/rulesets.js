'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
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
		onModifyTemplate(template, target, source) {
			const newTemplate = this.dex.deepClone(template);
			newTemplate.baseStats = this.dex.deepClone(newTemplate.baseStats);
			/** @type {StatName[]} */
			let stats = ['atk', 'def', 'spa', 'spe'];
			/** @type {number} */
			let pst = stats.map(stat => newTemplate.baseStats[stat]).reduce((x, y) => x + y);
			let scale = 500 - newTemplate.baseStats['hp'];
			for (const stat of stats) {
				newTemplate.baseStats[stat] = this.dex.clampIntRange(newTemplate.baseStats[stat] * scale / pst, 1, 255);
			}
			return newTemplate;
		},
	},
};

exports.BattleFormats = BattleFormats;
