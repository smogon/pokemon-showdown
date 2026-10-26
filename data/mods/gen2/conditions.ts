export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(defender) {
			this.add('-status', defender, 'brn');
		},
		onAfterMoveSelfPriority: 3,
		onAfterMoveSelf(pokemon) {
			residualdmg(this, pokemon);
		},
		onAfterSwitchInSelf(pokemon) {
			residualdmg(this, pokemon);
		},
	},
	par: {
		name: 'par',
		inherit: true,
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) {
			if (this.randomChance(63, 256)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(defender, attacker, sourceEffect) {
			if (sourceEffect?.effectType === 'Move') {
				this.add('-status', defender, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', defender, 'slp');
			}
			// 1-6 turns
			this.effectState.time = this.random(2, 8);

			if (defender.removeVolatile('nightmare')) {
				this.add('-end', defender, 'Nightmare', '[silent]');
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, defender, move) {
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	frz: {
		name: 'frz',
		inherit: true,
		onBeforeMove(pokemon, defender, move) {
			if (move.flags['defrost']) return;
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onModifyMove: undefined, // no inherit
		onDamagingHit: undefined, // no inherit
		onAfterMoveSecondary(defender, attacker, move) {
			if ((move.secondary?.status === 'brn') || move.statusRoll === 'brn') {
				defender.cureStatus();
			}
		},
		onAfterMoveSecondarySelf(pokemon, defender, move) {
			if (move.flags['defrost']) pokemon.cureStatus();
		},
		onResidualOrder: 7,
		onResidual(pokemon) {
			if (this.randomChance(25, 256)) pokemon.cureStatus();
		},
	},
	psn: {
		name: 'psn',
		effectType: 'Status',
		onStart(defender) {
			this.add('-status', defender, 'psn');
		},
		onAfterMoveSelfPriority: 3,
		onAfterMoveSelf(pokemon) {
			residualdmg(this, pokemon);
		},
		onAfterSwitchInSelf(pokemon) {
			residualdmg(this, pokemon);
		},
	},
	tox: {
		name: 'tox',
		effectType: 'Status',
		onStart(defender) {
			this.add('-status', defender, 'tox');
			if (!defender.volatiles['residualdmg']) defender.addVolatile('residualdmg');
			defender.volatiles['residualdmg'].counter = 0;
		},
		onAfterMoveSelfPriority: 3,
		onAfterMoveSelf(pokemon) {
			const damage = this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * pokemon.volatiles['residualdmg'].counter;
			this.damage(damage, pokemon, pokemon);
		},
		onSwitchOut(pokemon) {
			// Regular poison status and damage after a switchout
			// The flag that distinguishes between regular poison and toxic is battle-only
			pokemon.status = 'psn' as ID;
		},
		onAfterSwitchInSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	confusion: {
		inherit: true,
		onStart(defender, attacker, sourceEffect) {
			if (sourceEffect?.id === 'lockedmove') {
				this.add('-start', defender, 'confusion', '[silent]');
			} else {
				this.add('-start', defender, 'confusion');
			}
			if (sourceEffect?.id === 'berserkgene') {
				this.effectState.time = 256;
			} else {
				this.effectState.time = this.random(2, 6);
			}
		},
		onBeforeMove(pokemon, defender, move) {
			pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.randomChance(1, 2)) {
				return;
			}
			move = {
				basePower: 40,
				type: '???',
				baseMoveType: move.type,
				category: 'Physical',
				willCrit: false,
				isConfusionSelfHit: true,
				noDamageVariance: true,
				flags: {},
				selfdestruct: move.selfdestruct,
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(pokemon, pokemon, move);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			this.directDamage(damage);
			return false;
		},
	},
	partiallytrapped: {
		inherit: true,
		durationCallback(defender, attacker) {
			return this.random(3, 6);
		},
		onResidualOrder: 3,
		onResidualSubOrder: 1,
	},
	lockedmove: {
		name: 'lockedmove',
		// Outrage, Thrash, Petal Dance...
		durationCallback() {
			return this.random(2, 4);
		},
		onResidual(defender) {
			if ((defender.lastMove?.id === 'struggle') || defender.status === 'slp') {
				// don't lock, and bypass confusion for calming
				delete defender.volatiles['lockedmove'];
			}
		},
		onStart(defender, attacker, effect) {
			this.effectState.move = effect.id;
		},
		onAfterMove(pokemon) {
			if (this.effectState.duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		onEnd(defender) {
			// Confusion begins even if already confused
			delete defender.volatiles['confusion'];
			if (!defender.side.getSideCondition('safeguard')) defender.addVolatile('confusion');
		},
		onLockMove() {
			return this.effectState.move;
		},
		onMoveAborted(pokemon) {
			delete pokemon.volatiles['lockedmove'];
		},
	},
	futuremove: {
		inherit: true,
		onResidualOrder: 1,
	},
	raindance: {
		inherit: true,
		onFieldResidualOrder: 2,
	},
	sunnyday: {
		inherit: true,
		onFieldResidualOrder: 2,
	},
	sandstorm: {
		inherit: true,
		onFieldResidualOrder: 2,
		onWeather(defender) {
			this.damage(defender.baseMaxhp / 8);
		},
	},
	stall: {
		name: 'stall',
		duration: 2,
		onStart() {
			this.effectState.counter = 127;
		},
		onStallMove() {
			const counter = Math.floor(this.effectState.counter) || 127;
			this.debug(`Success chance: ${Math.round(counter * 1000 / 255) / 10}% (${counter}/255)`);
			return this.randomChance(counter, 255);
		},
		onRestart() {
			this.effectState.counter /= 2;
			this.effectState.duration = 2;
		},
	},
	residualdmg: {
		name: 'residualdmg',
		onStart(defender) {
			defender.volatiles['residualdmg'].counter = 0;
		},
		onAfterMoveSelfPriority: 100,
		onAfterMoveSelf(pokemon) {
			if (['brn', 'psn', 'tox'].includes(pokemon.status)) pokemon.volatiles['residualdmg'].counter++;
		},
		onAfterSwitchInSelf(pokemon) {
			if (['brn', 'psn', 'tox'].includes(pokemon.status)) pokemon.volatiles['residualdmg'].counter++;
		},
	},
};

function residualdmg(battle: Battle, pokemon: Pokemon) {
	if (pokemon.volatiles['residualdmg']) {
		const residualDmg = battle.clampIntRange(
			Math.floor(pokemon.maxhp / 16) * pokemon.volatiles['residualdmg'].counter, 1
		);
		battle.damage(residualDmg, pokemon);
		battle.hint("In Gen 2, Toxic's counter is retained through Baton Pass/Heal Bell and applies to PSN/BRN.", true);
	} else {
		battle.damage(battle.clampIntRange(Math.floor(pokemon.maxhp / 8), 1), pokemon);
	}
}
