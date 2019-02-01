'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
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
			this.singleEvent('End', sourceAbility, source.abilityData, source);
			let sourceAlly = source.side.active.find(ally => ally && ally !== source && !ally.fainted);
			if (sourceAlly && sourceAlly.innate) {
				sourceAlly.removeVolatile(sourceAlly.innate);
				delete sourceAlly.innate;
			}
			this.singleEvent('End', targetAbility, target.abilityData, target);
			let targetAlly = target.side.active.find(ally => ally && ally !== target && !ally.fainted);
			if (targetAlly && targetAlly.innate) {
				targetAlly.removeVolatile(targetAlly.innate);
				delete targetAlly.innate;
			}
			if (targetAbility.id !== sourceAbility.id) {
				source.ability = targetAbility.id;
				target.ability = sourceAbility.id;
				source.abilityData = {id: source.ability, target: source};
				target.abilityData = {id: target.ability, target: target};
			}
			if (sourceAlly && sourceAlly.ability !== source.ability) {
				let volatile = sourceAlly.innate = 'ability' + source.ability;
				sourceAlly.volatiles[volatile] = {id: volatile};
				sourceAlly.volatiles[volatile].target = sourceAlly;
				sourceAlly.volatiles[volatile].source = source;
				sourceAlly.volatiles[volatile].sourcePosition = source.position;
				if (!source.innate) {
					volatile = source.innate = 'ability' + sourceAlly.ability;
					source.volatiles[volatile] = {id: volatile};
					source.volatiles[volatile].target = source;
					source.volatiles[volatile].source = sourceAlly;
					source.volatiles[volatile].sourcePosition = sourceAlly.position;
				}
			}
			if (targetAlly && targetAlly.ability !== target.ability) {
				let volatile = targetAlly.innate = 'ability' + target.ability;
				targetAlly.volatiles[volatile] = {id: volatile};
				targetAlly.volatiles[volatile].target = targetAlly;
				targetAlly.volatiles[volatile].source = target;
				targetAlly.volatiles[volatile].sourcePosition = target.position;
				if (!target.innate) {
					volatile = target.innate = 'ability' + targetAlly.ability;
					target.volatiles[volatile] = {id: volatile};
					target.volatiles[volatile].target = target;
					target.volatiles[volatile].source = targetAlly;
					target.volatiles[volatile].sourcePosition = targetAlly.position;
				}
			}
			this.singleEvent('Start', targetAbility, source.abilityData, source);
			if (sourceAlly && sourceAlly.innate) this.singleEvent('Start', targetAbility, sourceAlly.volatiles[sourceAlly.innate], sourceAlly);
			this.singleEvent('Start', sourceAbility, target.abilityData, target);
			if (targetAlly && targetAlly.innate) this.singleEvent('Start', sourceAbility, targetAlly.volatiles[targetAlly.innate], targetAlly);
		},
	},
};
