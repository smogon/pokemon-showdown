export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	actions: {
		getDamage(attacker, defender, move, suppressMessages) {
			if (typeof move === 'string') move = this.dex.getActiveMove(move);

			if (typeof move === 'number') {
				const basePower = move;
				move = new this.dex.Move({
					basePower,
					type: '???',
					category: 'Physical',
					willCrit: false,
				}) as ActiveMove;
				move.hit = 0;
			}

			if (!defender.runImmunity(move, !suppressMessages)) {
				return false;
			}

			if (move.ohko) return defender.maxhp;
			if (move.damageCallback) return move.damageCallback.call(this.battle, attacker, defender);
			if (move.damage === 'level') {
				return attacker.level;
			} else if (move.damage) {
				return move.damage;
			}

			let basePower: number | false | null = move.basePower;
			if (move.basePowerCallback) {
				basePower = move.basePowerCallback.call(this.battle, attacker, defender, move);
			}
			if (!basePower) return basePower === 0 ? undefined : basePower;
			basePower = this.battle.clampIntRange(basePower, 1);

			let critMult;
			let critRatio = this.battle.runEvent('ModifyCritRatio', attacker, defender, move, move.critRatio || 0);
			if (this.battle.gen <= 5) {
				critRatio = this.battle.clampIntRange(critRatio, 0, 5);
				critMult = [0, 16, 8, 4, 3, 2];
			} else {
				critRatio = this.battle.clampIntRange(critRatio, 0, 4);
				if (this.battle.gen === 6) {
					critMult = [0, 16, 8, 2, 1];
				} else {
					critMult = [0, 24, 8, 2, 1];
				}
			}

			const moveHit = defender.getMoveHitData(move);
			moveHit.crit = move.willCrit || false;
			if (move.willCrit === undefined) {
				if (critRatio) {
					moveHit.crit = this.battle.randomChance(1, critMult[critRatio]);
				}
			}

			if (moveHit.crit) {
				moveHit.crit = this.battle.runEvent('CriticalHit', defender, null, move);
			}

			// happens after crit calculation
			basePower = this.battle.runEvent('BasePower', attacker, defender, move, basePower, true);

			if (!basePower) return 0;
			basePower = this.battle.clampIntRange(basePower, 1);
			// Hacked Max Moves have 0 base power, even if you Dynamax
			if ((!attacker.volatiles['dynamax'] && move.isMax) || (move.isMax && this.dex.moves.get(move.baseMove).isMax)) {
				basePower = 0;
			}

			const level = attacker.level;

			const attacker = move.overrideOffensivePokemon === 'defender' ? defender : attacker;
			const defender = move.overrideDefensivePokemon === 'attacker' ? attacker : defender;

			const isPhysical = move.category === 'Physical';
			const defenseStat: StatIDExceptHP = move.overrideDefensiveStat || (isPhysical ? 'def' : 'spd');

			const statTable: { [k in StatIDExceptHP]: string } = { atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };

			let maxAttack = 0;

			let defBoosts = defender.boosts[defenseStat];

			let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
			let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

			if (moveHit.crit) {
				ignoreNegativeOffensive = true;
				ignorePositiveDefensive = true;
			}

			const ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));
			if (ignoreDefensive) {
				this.battle.debug('Negating (sp)def boost/penalty.');
				defBoosts = 0;
			}

			let attack = 0;

			for (const attackStat in statTable) {
				let atkBoosts = attacker.boosts[attackStat as keyof BoostsTable];
				const ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
				if (ignoreOffensive) {
					this.battle.debug('Negating (sp)atk boost/penalty.');
					atkBoosts = 0;
				}
				attack = attacker.calculateStat(attackStat as any, atkBoosts, 1, attacker);
				attack = this.battle.runEvent('Modify' + (statTable as any)[attackStat], attacker, defender, move, attack);
				if (attack > maxAttack) maxAttack = attack;
			}

			let defense = defender.calculateStat(defenseStat, defBoosts, 1, defender);

			// Apply Stat Modifiers
			defense = this.battle.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

			if (this.battle.gen <= 4 && ['explosion', 'selfdestruct'].includes(move.id) && defenseStat === 'def') {
				defense = this.battle.clampIntRange(Math.floor(defense / 2), 1);
			}

			const tr = this.battle.trunc;

			// int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
			const baseDamage = tr(tr(tr(tr(2 * level / 5 + 2) * basePower * maxAttack) / defense) / 50);

			// Calculate damage modifiers separately (order differs between generations)
			return this.modifyDamage(baseDamage, attacker, defender, move, suppressMessages);
		},
	},
};
