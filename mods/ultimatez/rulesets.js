'use strict';

exports.BattleFormats = {
	evasionmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Moves Clause',
		desc: ["Bans moves that consistently raise the user's evasion when used, or when powered up by a Z-Crystal"],
		banlist: ['Minimize', 'Double Team'],
		onStart: function () {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		},
		onValidateSet: function (set, format, setHas) {
			let item = this.getItem(set.item);
			if (!item.zMove) return;
			let evasionBoosted = false;
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.zMoveBoost && move.zMoveBoost.evasion > 0) {
					evasionBoosted = true;
					break;
				}
			}
			if (!evasionBoosted) return;
			return [(set.name || set.species) + " can boost Evasion, which is banned by Evasion Clause."];
		},
	},
};
