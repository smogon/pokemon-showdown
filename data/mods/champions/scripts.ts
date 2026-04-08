export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	pokemon: {
		getMoves(lockedMove, restrictData) {
			if (lockedMove) {
				lockedMove = toID(lockedMove);
				if (lockedMove === 'recharge') {
					return [{
						move: 'Recharge',
						id: 'recharge' as ID,
					}];
				}
				for (const moveSlot of this.moveSlots) {
					if (moveSlot.id !== lockedMove) continue;
					return [{
						move: moveSlot.move,
						id: moveSlot.id,
					}];
				}
				// does this happen?
				return [{
					move: this.battle.dex.moves.get(lockedMove).name,
					id: lockedMove,
				}];
			}
			const moves = [];
			let hasValidMove = false;
			for (const moveSlot of this.moveSlots) {
				let moveName = moveSlot.move;
				if (moveSlot.id === 'hiddenpower') {
					moveName = `Hidden Power ${this.hpType}`;
					if (this.battle.gen < 6) moveName += ` ${this.hpPower}`;
				} else if (moveSlot.id === 'return' || moveSlot.id === 'frustration') {
					const basePowerCallback = this.battle.dex.moves.get(moveSlot.id).basePowerCallback as (pokemon: Pokemon) => number;
					moveName += ` ${basePowerCallback(this)}`;
				}
				let target = moveSlot.target;
				switch (moveSlot.id) {
				case 'curse':
					if (!this.hasType('Ghost')) {
						target = this.battle.dex.moves.get('curse').nonGhostTarget;
					}
					break;
				case 'pollenpuff':
					// Heal Block only prevents Pollen Puff from targeting an ally when the user has Heal Block
					if (this.volatiles['healblock']) {
						target = 'adjacentFoe';
					}
					break;
				case 'terastarstorm':
					if (this.species.name === 'Terapagos-Stellar') {
						target = 'allAdjacentFoes';
					}
					break;
				}
				let disabled = moveSlot.disabled;
				if (this.volatiles['dynamax']) {
					// if each of a Pokemon's base moves are disabled by one of these effects, it will Struggle
					const canCauseStruggle = ['Encore', 'Disable', 'Taunt', 'Assault Vest', 'Belch', 'Stuff Cheeks'];
					disabled = this.maxMoveDisabled(moveSlot.id) || disabled && canCauseStruggle.includes(moveSlot.disabledSource!);
				} else if (moveSlot.pp <= 0 || (moveSlot.id === 'fakeout' && this.activeMoveActions > 0)) {
					disabled = true;
				}
	
				if (disabled === 'hidden') {
					disabled = !restrictData;
				}
				if (!disabled) {
					hasValidMove = true;
				}
	
				moves.push({
					move: moveName,
					id: moveSlot.id,
					pp: moveSlot.pp,
					maxpp: moveSlot.maxpp,
					target,
					disabled,
				});
			}
			return hasValidMove ? moves : [];
		},
	},
};
