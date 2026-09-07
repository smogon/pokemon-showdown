export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	ceaselessedge: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
		},
	},
	direclaw: {
		inherit: true,
		secondary: {
			chance: 30,
			onHit(target, source) {
				const status = this.sample(['psn', 'par', 'slp']);
				if (target.status) {
					if (target.status === status) {
						this.add('-fail', target, status);
					} else {
						this.add('-fail', target);
					}
					return;
				}
				target.trySetStatus(status, source);
			},
		},
	},
	growth: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (pokemon.hasAbility('megasol') && !this.field.isWeather('sunnyday')) {
				delete move.boosts;
			} else if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				move.boosts = { atk: 2, spa: 2 };
			}
		},
	},
	stoneaxe: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('stealthrock');
				}
			}
		},
	},
};
