'use strict';

exports.BattleScripts = {
	getZMove: function (move, pokemon, skipChecks) {
		let item = pokemon.getItem();
		if (!skipChecks) {
			if (!item.zMove) return;
			if (item.zMoveUser && !item.zMoveUser.includes(pokemon.template.species)) return;
			let moveData = pokemon.getMoveData(move);
			if (!moveData || !moveData.pp) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.
		}

		if (move.category === 'Status') return move.name;
		if (item.zMoveFrom) return move.name === item.zMoveFrom && item.zMove;
		return move.zMovePower && this.zMoveTable[item.zMoveType];
	},
	getZMoveCopy: function (move, pokemon) {
		move = this.getMove(move);
		if (move.category === 'Status') {
			let zMove = this.getMoveCopy(move);
			zMove.isZ = true;
			return zMove;
		}
		let item = pokemon.getItem();
		if (item.zMoveFrom) return this.getMoveCopy(item.zMove);
		let zMove = this.getMoveCopy(this.zMoveTable[item.zMoveType]);
		zMove.basePower = move.zMovePower;
		zMove.category = move.category;
		return zMove;
	},
	canZMove: function (pokemon) {
		let item = pokemon.getItem();
		if (!item.zMove) return;
		if (item.zMoveUser && !item.zMoveUser.includes(pokemon.template.species)) return;
		let atLeastOne = false;
		let zMoves = [];
		for (let i = 0; i < pokemon.moves.length; i++) {
			if (pokemon.moveset[i].pp <= 0) {
				zMoves.push(null);
				continue;
			}
			let move = this.getMove(pokemon.moves[i]);
			let zMoveName = this.getZMove(move, pokemon, true) || '';
			if (zMoveName) {
				let zMove = this.getMove(zMoveName);
				if (!zMove.isZ && zMove.category === 'Status') zMoveName = "Z-" + zMoveName;
				zMoves.push({move: zMoveName, target: zMove.target});
			} else {
				zMoves.push(null);
			}
			if (zMoveName) atLeastOne = true;
		}
		if (atLeastOne) return zMoves;
	},
};
