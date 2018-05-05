'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Exact HP Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal'],
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
