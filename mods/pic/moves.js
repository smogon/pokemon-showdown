'use strict';

exports.BattleMovedex = {
	"skillswap": {
		inherit: true,
		onHit: function (target, source, move) {
			let targetAbility = this.getAbility(target.ability);
			let sourceAbility = this.getAbility(source.ability);
			if (target.side === source.side) {
				this.add('-activate', source, 'move: Skill Swap', '', '', '[of] ' + target);
			} else {
				this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
			}
			source.battle.singleEvent('End', sourceAbility, source.abilityData, source);
			let sourceAlly = source.side.active.find(ally => ally && ally !== source && !ally.fainted);
			if (sourceAlly && sourceAlly.innate) {
				sourceAlly.removeVolatile(sourceAlly.innate);
				delete sourceAlly.innate;
			}
			target.battle.singleEvent('End', targetAbility, target.abilityData, target);
			let targetAlly = target.side.active.find(ally => ally && ally !== target && !ally.fainted);
			if (targetAlly && targetAlly.innate) {
				targetAlly.removeVolatile(targetAlly.innate);
				delete targetAlly.innate;
			}
			if (targetAbility.id !== sourceAbility.id) {
				source.ability = targetAbility.id;
				target.ability = sourceAbility.id;
				source.abilityData = {id: source.ability.id, target: source};
				target.abilityData = {id: target.ability.id, target: target};
			}
			source.battle.singleEvent('Start', targetAbility, source.abilityData, source);
			if (sourceAlly && sourceAlly.ability !== source.ability) {
				sourceAlly.innate = 'ability' + source.ability;
				sourceAlly.addVolatile(sourceAlly.innate);
			}
			target.battle.singleEvent('Start', sourceAbility, target.abilityData, target);
			if (targetAlly && targetAlly.ability !== target.ability) {
				targetAlly.innate = 'ability' + target.ability;
				targetAlly.addVolatile(targetAlly.innate);
			}
		},
	},
};
