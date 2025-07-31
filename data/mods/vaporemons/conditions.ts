export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	partiallytrapped: {
		inherit: true,
		onStart(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, `[of] ${source}`);
			this.effectState.boundDivisor = 8;
		},
	},
	firedragon: {
		name: 'firedragon',
		noCopy: true,
		onStart(target) {
			this.add('-start', target, 'Fire/Dragon');
			this.add('-message', `${target.name} is now Fire/Dragon!`);
		},
	},
};
