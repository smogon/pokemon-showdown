'use strict';

/**@type {ModdedBattleScriptsData} */
exports.BattleScripts = {
	getZMove(move, pokemon, skipChecks) {
		let item = pokemon.getItem();
		if (!skipChecks) {
			if (!item.zMove) return;
			if (item.zMoveUser && !item.zMoveUser.includes(pokemon.template.species)) return;
			let moveData = pokemon.getMoveData(move);
			if (!moveData || !moveData.pp) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.
		}

		if (move.category === 'Status') return move.name;
		if (item.zMoveFrom) {
			if (move.name === item.zMoveFrom) return /** @type {string} */ (item.zMove);
		} else if (move.zMovePower) {
			if (item.zMoveType) return this.zMoveTable[item.zMoveType];
		}
	},
	getActiveZMove(move, pokemon) {
		move = this.getMove(move);
		if (move.category === 'Status') {
			let zMove = this.getActiveMove(move);
			zMove.isZ = true;
			zMove.isZPowered = true;
			return zMove;
		}
		let item = pokemon.getItem();
		if (item.zMoveFrom) {
			// @ts-ignore
			let zMove = this.getActiveMove(item.zMove);
			zMove.isZPowered = true;
			return zMove;
		}
		// @ts-ignore
		let zMove = this.getActiveMove(this.zMoveTable[item.zMoveType]);
		// @ts-ignore
		zMove.basePower = move.zMovePower;
		zMove.category = move.category;
		// copy the priority for Quick Guard
		zMove.priority = move.priority;
		zMove.isZPowered = true;
		return zMove;
	},
	canZMove(pokemon) {
		let item = pokemon.getItem();
		if (!item.zMove) return;
		if (item.zMoveUser && !item.zMoveUser.includes(pokemon.template.species)) return;
		let atLeastOne = false;
		let mustStruggle = true;
		/**@type {AnyObject?[]} */
		let zMoves = [];
		for (const moveSlot of pokemon.moveSlots) {
			if (moveSlot.pp <= 0) {
				zMoves.push(null);
				continue;
			}
			if (!moveSlot.disabled) {
				mustStruggle = false;
			}
			let move = this.getMove(moveSlot.move);
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
		if (atLeastOne && !mustStruggle) return zMoves;
	},
};
