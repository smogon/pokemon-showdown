exports.BattleScripts = {
	gen: 3,
	init: function() {
		for (var i in this.data.Learnsets) {
			this.modData('Learnsets', i);
			var learnset = this.data.Learnsets[i].learnset;
			for (var moveid in learnset) {
				if (typeof learnset[moveid] === 'string') learnset[moveid] = [learnset[moveid]];
				learnset[moveid] = learnset[moveid].filter(function(source) {
					return source[0] === '3';
				});
				if (!learnset[moveid].length) delete learnset[moveid];
			}
		}
		for (var i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['DW'];
		}
	},
	getCategory: function(move) {
		move = this.getMove(move);
		if (!(move.category in {'Special':1,'Physical':1})) return move.category;
		// overwrite categories
		var specialTypes = {Fire:1, Water:1, Grass:1, Ice:1, Electric:1, Dark:1, Psychic:1, Dragon:1};
		return specialTypes[move.type]? 'Special' : 'Physical';
	},
	getDamage: function(pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = this.getMove(move);

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

		if (!move.basePowerMultiplier && move.category !== 'Status') {
			// happens before basePowerCallback so Acrobatics works correctly
			// activates constant damage moves
			// but NOT OHKO moves
			move.basePowerMultiplier = this.runEvent('BasePowerMultiplier', pokemon, target, move, 1);
			if (move.basePowerMultiplier != 1) this.debug('multiplier: '+move.basePowerMultiplier);
		}

		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
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
		var category = this.getCategory(move);
		var defensiveCategory = move.defensiveCategory || category;

		var basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) {
			if (basePower === 0) return; // returning undefined means not dealing damage
			return basePower;
		}
		basePower = clampIntRange(basePower, 1);

		move.critRatio = clampIntRange(move.critRatio, 0, 5);
		var critMult = [0, 16, 8, 4, 3, 2];

		move.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (move.critRatio) {
				move.crit = (this.random(critMult[move.critRatio]) === 0);
			}
		}
		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		if (basePower) {
			basePower = this.singleEvent('BasePower', move, null, pokemon, target, move, basePower);
			basePower = this.runEvent('BasePower', pokemon, target, move, basePower);

			if (move.basePowerMultiplier && move.basePowerMultiplier != 1) {
				basePower = this.modify(basePower, move.basePowerMultiplier);
			}
			if (move.basePowerModifier) {
				basePower = this.modify(basePower, move.basePowerModifier);
			}
		}
		if (!basePower) return 0;
		basePower = clampIntRange(basePower, 1);

		var level = pokemon.level;

		var attacker = pokemon;
		var defender = target;
		if (move.useTargetOffensive) attacker = target;
		if (move.useSourceDefensive) defender = pokemon;

		var attack = attacker.getStat(category==='Physical'?'atk':'spa');
		var defense = defender.getStat(defensiveCategory==='Physical'?'def':'spd');

		if (move.crit) {
			move.ignoreNegativeOffensive = true;
			move.ignorePositiveDefensive = true;
		}
		if (move.ignoreNegativeOffensive && attack < attacker.getStat(category==='Physical'?'atk':'spa', true)) {
			move.ignoreOffensive = true;
		}
		if (move.ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			attack = attacker.getStat(category==='Physical'?'atk':'spa', true);
		}
		if (move.ignorePositiveDefensive && defense > target.getStat(defensiveCategory==='Physical'?'def':'spd', true)) {
			move.ignoreDefensive = true;
		}
		if (move.ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defense = target.getStat(defensiveCategory==='Physical'?'def':'spd', true);
		}

		//int(int(int(2*L/5+2)*A*P/D)/50);
		var baseDamage = Math.floor(Math.floor(Math.floor(2*level/5+2) * basePower * attack/defense)/50) + 2;

		// multi-target modifier (doubles only)
		if (move.spreadHit) {
			var spreadModifier = move.spreadModifier || 0.75;
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// weather modifier (TODO: relocate here)
		// crit
		if (move.crit) {
			if (!suppressMessages) this.add('-crit', target);
			baseDamage = this.modify(baseDamage, move.critModifier || 2);
		}

		// randomizer
		// this is not a modifier
		baseDamage = Math.floor(baseDamage * (100 - this.random(16)) / 100);

		// STAB
		if (type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		var totalTypeMod = this.getEffectiveness(type, target);
		if (totalTypeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);
			baseDamage *= 2;
			if (totalTypeMod >= 2) {
				baseDamage *= 2;
			}
		}
		if (totalTypeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);
			baseDamage = Math.floor(baseDamage/2);
			if (totalTypeMod <= -2) {
				baseDamage = Math.floor(baseDamage/2);
			}
		}

		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		return Math.floor(baseDamage);
	}
};