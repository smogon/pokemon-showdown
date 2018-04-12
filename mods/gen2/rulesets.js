'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	pokemon: {
		effectType: 'ValidatorRule',
		name: 'Pokemon',
		onValidateSet: function (set, format) {
			let template = this.getTemplate(set.species);
			let problems = [];
			if (set.species === set.name) delete set.name;

			if (template.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			} else if (template.isNonstandard) {
				problems.push(set.species + ' is not a real Pokemon.');
			}
			let hasSD = false;
			if (set.item) {
				let item = this.getItem(set.item);
				if (item.gen > this.gen) {
					problems.push(item.name + ' does not exist in gen ' + this.gen + '.');
				} else if (item.isNonstandard) {
					problems.push(item.name + ' is not a real item.');
				}
			}
			if (set.moves) {
				for (const setMoveid of set.moves) {
					let move = this.getMove(setMoveid);
					if (move.gen > this.gen) {
						problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
					} else if (move.isNonstandard) {
						problems.push(move.name + ' is not a real move.');
					}
					if (move.id === 'swordsdance') hasSD = true;
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}

			// Automatically set ability to None
			set.ability = 'None';

			if (set.ivs && toId(set.item) === 'thickclub' && set.species === 'Marowak' && hasSD) {
				set.ivs.atk = 26;
			}

			// They all also get a useless nature, since that didn't exist
			set.nature = 'Serious';

			return problems;
		},
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal',
			'Hypnosis + Mean Look',
			'Hypnosis + Spider Web',
			'Lovely Kiss + Mean Look',
			'Lovely Kiss + Spider Web',
			'Sing + Mean Look',
			'Sing + Spider Web',
			'Sleep Powder + Mean Look',
			'Sleep Powder + Spider Web',
			'Spore + Mean Look',
			'Spore + Spider Web',
		],
		onValidateSet: function (set) {
			// limit one of each move in Standard
			let moves = [];
			if (set.moves) {
				let hasMove = {};
				for (const setMoveid of set.moves) {
					let move = this.getMove(setMoveid);
					let moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(setMoveid);
				}
			}
			set.moves = moves;
		},
	},
};

exports.BattleFormats = BattleFormats;
