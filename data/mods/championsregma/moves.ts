export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
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
};
