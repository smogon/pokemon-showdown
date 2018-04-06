'use strict';

exports.BattleAbilities = {
	prankster: {
		inherit: true,
		onModifyPriority: function (priority, pokemon, target, move) {
			let linkedMoves = pokemon.getLinkedMoves();
			if (linkedMoves.includes(move.id)) {
				let moveOne = this.getMove(linkedMoves[0]);
				let moveTwo = this.getMove(linkedMoves[1]);
				if (moveOne.category === 'Status' && moveTwo.category === 'Status') {
					moveOne.pranksterBoosted = true;
					moveTwo.pranksterBoosted = true;
					if (moveOne.priority + 1 >= moveTwo.priority + 1) {
						return moveTwo.priority + 1;
					} else {
						return moveOne.priority + 1;
					}
				}
				if (moveOne.category === 'Status' && moveTwo.category !== 'Status') {
					moveOne.pranksterBoosted = true;
					moveTwo.pranksterBoosted = false;
					if (moveTwo.priority >= moveOne.priority + 1) {
						return moveOne.priority + 1;
					} else {
						return moveTwo.priority;
					}
				}
				if (moveOne.category !== 'Status' && moveTwo.category === 'Status') {
					moveOne.pranksterBoosted = false;
					moveTwo.pranksterBoosted = true;
					if (moveOne.priority >= moveTwo.priority + 1) {
						return moveTwo.priority + 1;
					} else {
						return moveOne.priority;
					}
				}
			} else {
				if (move && move.category === 'Status') {
					move.pranksterBoosted = true;
					return priority + 1;
				}
			}
		},
	},
};
