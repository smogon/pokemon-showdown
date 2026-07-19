/* eslint-disable @stylistic/max-len */

export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	slp: {
		name: 'slp', effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			else this.add('-status', target, 'slp');
			this.effectState.time = this.random(2, 6);
			this.effectState.skippedTime = 0;
			if (target.removeVolatile('nightmare')) this.add('-end', target, 'Nightmare', '[silent]');
		},
		onSwitchIn(target) { this.effectState.time += this.effectState.skippedTime; this.effectState.skippedTime = 0; },
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) pokemon.statusState.time--;
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) { pokemon.cureStatus(); return; }
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) { this.effectState.skippedTime++; return; }
			this.effectState.skippedTime = 0;
			return false;
		},
	},
	par: {
		name: 'par', effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			else this.add('-status', target, 'par');
		},
		onModifySpePriority: -101,
		onModifySpe(spe, pokemon) { spe = this.finalModify(spe); if (!pokemon.hasAbility('quickfeet')) spe = Math.floor(spe * 25 / 100); return spe; },
		onBeforeMovePriority: 1,
	},
	frz: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.dex.moves.get(move.id).type === 'Fire' && move.category !== 'Status') target.cureStatus();
		},
	},
	sandstorm: { inherit: true, onModifySpD: undefined },
};
