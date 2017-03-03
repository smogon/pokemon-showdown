'use strict';

exports.BattleScripts = {
	getDamage : function (pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = this.getMove(move);

		if (typeof move === 'number') {
			move = {
				id: 'confused',
				basePower: move,
				type: '???',
				category: 'Physical',
				willCrit: false,
				flags: {},
			};
		}

		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, !suppressMessages)) {
				return false;
			}
		}

		if (move.ohko) return target.maxhp;

		if (move.damageCallback) return move.damageCallback.call(this, pokemon, target);
		if (move.damage === 'level') return pokemon.level;
		if (move.damage) return move.damage;

		if (!move) move = {};
		if (!move.type) move.type = '???';
		let type = move.type;
		let category = this.getCategory(move);
		let defensiveCategory = move.defensiveCategory || category;

		let basePower = move.basePower;
		if (move.basePowerCallback) basePower = move.basePowerCallback.call(this, pokemon, target, move);
		if (!basePower) {
			if (basePower === 0) return;
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		let critMult;
		let critRatio = this.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
		critRatio = this.clampIntRange(critRatio, 0, 4);
		critMult = [0, 16, 8, 2, 1];

		move.crit = move.willCrit || false;
		if (move.willCrit === undefined && critRatio) move.crit = (this.random(critMult[critRatio]) === 0);

		if (move.crit) move.crit = this.runEvent('CriticalHit', target, null, move);

		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		let level = pokemon.level;

		let attacker = pokemon;
		let defender = target;
		let statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
		let attackStat, highestStat = 0;
		let defenseStat = defensiveCategory === 'Physical' ? 'def' : 'spd';
		for (let i in statTable) {
			let stat = attacker.calculateStat(i, attacker.boosts[i]);
			stat = this.runEvent('Modify' + statTable[i], attacker, defender, move, stat);
			if (stat > highestStat) {
				attackStat = i;
				highestStat = stat;
			}
		}
		if (move.useTargetOffensive) {
			attackStat = category === 'Physical' ? 'atk' : 'spa';
		}
		if (move.id === 'confused') {
			attackStat = 'atk';
		}
		let attack;
		let defense;

		let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		let defBoosts = move.useSourceDefensive ? attacker.boosts[defenseStat] : defender.boosts[defenseStat];

		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (move.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		let ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
		let ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

		if (ignoreOffensive) atkBoosts = 0;
		if (ignoreDefensive) defBoosts = 0;

		if (move.useTargetOffensive) {
			attack = defender.calculateStat(attackStat, atkBoosts);
		} else {
			attack = attacker.calculateStat(attackStat, atkBoosts);
		}

		if (move.useSourceDefensive) {
			defense = attacker.calculateStat(defenseStat, defBoosts);
		} else {
			defense = defender.calculateStat(defenseStat, defBoosts);
		}

		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		let baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2;

		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		if (move.crit) baseDamage = this.modify(baseDamage, move.critModifier || (this.gen >= 6 ? 1.5 : 2));

		baseDamage = this.randomizer(baseDamage);

		if (move.hasSTAB || pokemon.hasType(type)) baseDamage = this.modify(baseDamage, move.stab || 1.5);
		move.typeMod = target.runEffectiveness(move);

		move.typeMod = this.clampIntRange(move.typeMod, -6, 6);
		if (move.typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < move.typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (move.typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > move.typeMod; i--) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		if (move.crit && !suppressMessages) this.add('-crit', target);

		if (pokemon.status === 'brn' && basePower && move.category === 'Physical' && move.id !== 'facade' && !pokemon.hasAbility('guts')) {
			baseDamage = this.modify(baseDamage, 0.5);
		}

		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if (basePower && !Math.floor(baseDamage)) return 1;

		return Math.floor(baseDamage);
	},
};
