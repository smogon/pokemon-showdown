exports.BattleScripts = {
	gen: 3,
	init: function() {
		for (var i in this.data.Pokedex) {
			var template = this.getTemplate(i);
			if (template.gen > 3) template.isNonstandard = true;
			delete template.abilities['DW'];
		}
		for (var i in this.data.Movedex) {
			var move = this.getMove(i);
			if (move.gen > 3) move.isNonstandard = true;
		}
		for (var i in this.data.Abilities) {
			var ability = this.getAbility(i);
			if (ability.gen > 3) ability.isNonstandard = true;
		}
		for (var i in this.data.Items) {
			var item = this.getItem(i);
			if (item.gen > 3) item.isNonstandard = true;
		}
	},
	getDamage: function(pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = selfB.getMove(move);

		if (typeof move === 'number') move = {
			basePower: move,
			type: '???',
			category: 'Physical'
		};

		if (move.affectedByImmunities) {
			if (!target.runImmunity(move.type, true)) {
				return false;
			}
		}

		if (move.isSoundBased && (pokemon !== target || this.gen <= 4)) {
			if (!target.runImmunity('sound', true)) {
				return false;
			}
		}

		if (move.ohko) {
			if (target.level > pokemon.level) {
				this.add('-failed', target);
				return false;
			}
			return target.maxhp;
		}
		if (move.damageCallback) {
			return move.damageCallback.call(selfB, pokemon, target);
		}
		if (move.damage === 'level') {
			return pokemon.level;
		}
		if (move.damage) {
			return move.damage;
		}

		if (!move) {
			move = {};
		}

		if (!move.type) move.type = '???';
		var type = move.type;
		// '???' is typeless damage: used for Struggle and Confusion etc

		// overwrite categories
		var specialTypes = {Fire:1, Water:1, Grass:1, Ice:1, Electric:1, Dark:1, Psychic:1, Dragon:1};
		var category = specialTypes[type]?'Special':'Physical';

		var basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(selfB, pokemon, target);
		}
		if (!basePower) return 0;
		basePower = clampIntRange(basePower, 1);

		move.critRatio = clampIntRange(move.critRatio, 0, 5);
		var critMult = [0, 16, 8, 4, 3, 2];

		move.crit = move.willCrit || false;
		if (typeof move.willCrit === 'undefined') {
			if (move.critRatio) {
				move.crit = (selfB.random(critMult[move.critRatio]) === 0);
			}
		}
		if (move.crit) {
			move.crit = selfB.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		if (basePower) {
			basePower = selfB.runEvent('BasePower', pokemon, target, move, basePower);

			if (move.basePowerModifier) {
				basePower *= move.basePowerModifier;
			}
		}
		if (!basePower) return 0;
		basePower = clampIntRange(basePower, 1);

		var level = pokemon.level;

		var attacker = pokemon;
		var defender = target;
		if (move.useTargetOffensive) attacker = target;
		if (move.useSourceDefensive) defender = pokemon;

		var attack = category==='Physical'?attacker.stats.atk:attacker.stats.spa;
		var defense = category==='Physical'?defender.stats.def:defender.stats.spd;

		if (move.crit) {
			move.ignoreNegativeOffensive = true;
			move.ignorePositiveDefensive = true;
		}
		if (move.ignoreNegativeOffensive && attack < (category==='Physical'?attacker.unboostedStats.atk:attacker.unboostedStats.spa)) {
			move.ignoreOffensive = true;
		}
		if (move.ignoreOffensive) {
			selfB.debug('Negating (sp)atk boost/penalty.');
			attack = (category==='Physical'?attacker.unboostedStats.atk:attacker.unboostedStats.spa);
		}
		if (move.ignorePositiveDefensive && defense > (category==='Physical'?target.unboostedStats.def:target.unboostedStats.spd)) {
			move.ignoreDefensive = true;
		}
		if (move.ignoreDefensive) {
			selfB.debug('Negating (sp)def boost/penalty.');
			defense = category==='Physical'?target.unboostedStats.def:target.unboostedStats.spd;
		}

		//int(int(int(2*L/5+2)*A*P/D)/50);
		var baseDamage = Math.floor(Math.floor(Math.floor(2*level/5+2) * basePower * attack/defense)/50) + 2;

		// multi-target modifier (doubles only)
		// weather modifier (TODO: relocate here)
		// crit
		if (move.crit) {
			if (!suppressMessages) selfB.add('-crit', target);
			baseDamage = selfB.modify(baseDamage, move.critModifier || 2);
		}

		// randomizer
		// this is not a modifier
		// gen 1-2
		//var randFactor = Math.floor(Math.random()*39)+217;
		//baseDamage *= Math.floor(randFactor * 100 / 255) / 100;
		baseDamage = Math.floor(baseDamage * (100 - selfB.random(16)) / 100);

		// STAB
		if (type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = selfB.modify(baseDamage, move.stab || 1.5);
		}
		// types
		var totalTypeMod = selfB.getEffectiveness(type, target);
		if (totalTypeMod > 0) {
			if (!suppressMessages) selfB.add('-supereffective', target);
			baseDamage *= 2;
			if (totalTypeMod >= 2) {
				baseDamage *= 2;
			}
		}
		if (totalTypeMod < 0) {
			if (!suppressMessages) selfB.add('-resisted', target);
			baseDamage = Math.floor(baseDamage/2);
			if (totalTypeMod <= -2) {
				baseDamage = Math.floor(baseDamage/2);
			}
		}

		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		if (pokemon.side.active.length > 1 && (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes')) {
			baseDamage = selfB.modify(baseDamage, move.spreadModifier || 0.75);
		}

		return Math.floor(baseDamage);
	}
}
