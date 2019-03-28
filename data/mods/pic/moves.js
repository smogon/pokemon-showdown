'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
exports.BattleMovedex = {
	"skillswap": {
		inherit: true,
		onHit(target, source, move) {
			let targetAbility = this.getAbility(target.ability);
			let sourceAbility = this.getAbility(source.ability);
			if (target.side === source.side) {
				this.add('-activate', source, 'move: Skill Swap', '', '', '[of] ' + target);
			} else {
				this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
			}
			this.singleEvent('End', sourceAbility, source.abilityData, source);
			let sourceAlly = source.side.active.find(ally => ally && ally !== source && !ally.fainted);
			if (sourceAlly && sourceAlly.m.innate) {
				sourceAlly.removeVolatile(sourceAlly.m.innate);
				delete sourceAlly.m.innate;
			}
			this.singleEvent('End', targetAbility, target.abilityData, target);
			let targetAlly = target.side.active.find(ally => ally && ally !== target && !ally.fainted);
			if (targetAlly && targetAlly.m.innate) {
				targetAlly.removeVolatile(targetAlly.m.innate);
				delete targetAlly.m.innate;
			}
			if (targetAbility.id !== sourceAbility.id) {
				source.ability = targetAbility.id;
				target.ability = sourceAbility.id;
				source.abilityData = {id: source.ability, target: source};
				target.abilityData = {id: target.ability, target: target};
			}
			if (sourceAlly && sourceAlly.ability !== source.ability) {
				let volatile = sourceAlly.m.innate = 'ability' + source.ability;
				sourceAlly.volatiles[volatile] = {id: volatile};
				sourceAlly.volatiles[volatile].target = sourceAlly;
				sourceAlly.volatiles[volatile].source = source;
				sourceAlly.volatiles[volatile].sourcePosition = source.position;
				if (!source.m.innate) {
					volatile = source.m.innate = 'ability' + sourceAlly.ability;
					source.volatiles[volatile] = {id: volatile};
					source.volatiles[volatile].target = source;
					source.volatiles[volatile].source = sourceAlly;
					source.volatiles[volatile].sourcePosition = sourceAlly.position;
				}
			}
			if (targetAlly && targetAlly.ability !== target.ability) {
				let volatile = targetAlly.m.innate = 'ability' + target.ability;
				targetAlly.volatiles[volatile] = {id: volatile};
				targetAlly.volatiles[volatile].target = targetAlly;
				targetAlly.volatiles[volatile].source = target;
				targetAlly.volatiles[volatile].sourcePosition = target.position;
				if (!target.m.innate) {
					volatile = target.m.innate = 'ability' + targetAlly.ability;
					target.volatiles[volatile] = {id: volatile};
					target.volatiles[volatile].target = target;
					target.volatiles[volatile].source = targetAlly;
					target.volatiles[volatile].sourcePosition = targetAlly.position;
				}
			}
			this.singleEvent('Start', targetAbility, source.abilityData, source);
			if (sourceAlly && sourceAlly.m.innate) this.singleEvent('Start', targetAbility, sourceAlly.volatiles[sourceAlly.m.innate], sourceAlly);
			this.singleEvent('Start', sourceAbility, target.abilityData, target);
			if (targetAlly && targetAlly.m.innate) this.singleEvent('Start', sourceAbility, targetAlly.volatiles[targetAlly.m.innate], targetAlly);
		},
	},
};
