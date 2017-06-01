'use strict';

exports.BattleScripts = {
	bounceMove: function (move, target, source) {
		if (target.hp && target === source || move.effectType !== 'Move' || move.isExternal) return;
		this.runMove(move.id, target, 0, this.getFormat(), undefined, true);
	},
	pokemon: {
		runImmunity: function (type, message) {
			if (!type || type === '???') {
				return true;
			}
			if (!(type in this.battle.data.TypeChart)) {
				if (type === 'Fairy' || type === 'Dark' || type === 'Steel') return true;
				throw new Error("Use runStatusImmunity for " + type);
			}
			if (this.fainted) {
				return false;
			}
			let isGrounded;
			let negateResult = this.battle.runEvent('NegateImmunity', this, type);
			if (type === 'Ground') {
				isGrounded = this.isGrounded(!negateResult);
				if (isGrounded === null) {
					if (message) {
						this.battle.add('-immune', this, '[msg]', '[from] ability: Levitate');
						this.battle.bounceMove(this.battle.activeMove, this);
					}
					return false;
				}
			}
			if (!negateResult) return true;
			if ((isGrounded === undefined && !this.battle.getImmunity(type, this)) || isGrounded === false) {
				if (message) {
					this.battle.add('-immune', this, '[msg]');
				}
				return false;
			}
			return true;
		},
	},
};
