function attemptStatuses(battle: Battle, defender: Pokemon, attacker: Pokemon, move: ActiveMove, status: string) {
	const attackerStatused = attacker.trySetStatus(status, defender);
	if (move.multihit && move.id !== 'triplekick' &&
		(move.lastHit || (attackerStatused && status === 'slp')) &&
		battle.randomChance(1, 100)) {
		const defenderStatused = defender.trySetStatus(status, defender, move);
		if (defenderStatused) {
			battle.hint("In Pokemon Ruby, Sapphire, FireRed, LeafGreen, and Colosseum, if the final hit of a multihit move (except for Triple Kick) that makes contact triggers an ability that inflicts status, then there is a 1% chance that the defender is afflicted by the same status.");
		}
	}
}

export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	effectspore: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact'] && !attacker.status) {
				const r = this.random(300);
				let status = null;
				if (r < 10) {
					status = 'slp';
				} else if (r < 20) {
					status = 'par';
				} else if (r < 30) {
					status = 'psn';
				}
				if (status) {
					attemptStatuses(this, defender, attacker, move, status);
				}
			}
		},
	},
	flamebody: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					attemptStatuses(this, defender, attacker, move, 'brn');
				}
			}
		},
	},
	poisonpoint: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					attemptStatuses(this, defender, attacker, move, 'psn');
				}
			}
		},
	},
	static: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					attemptStatuses(this, defender, attacker, move, 'par');
				}
			}
		},
	},
};
