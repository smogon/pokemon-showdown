'use strict';

exports.BattleScripts = {
	inherit: 'gen5',
	gen: 4,
	init: function () {
		for (let i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
	},

	modifyDamage: function (baseDamage, pokemon, target, move, suppressMessages) {
		// DPP divides modifiers into several mathematically important stages
		// The modifiers run earlier than other generations are called with ModifyDamagePhase1 and ModifyDamagePhase2

		if (!move.type) move.type = '???';
		let type = move.type;

		// Burn
		if (pokemon.status === 'brn' && baseDamage && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
			baseDamage = this.modify(baseDamage, 0.5);
		}

		// Other modifiers (Reflect/Light Screen/etc)
		baseDamage = this.runEvent('ModifyDamagePhase1', pokemon, target, move, baseDamage);

		// Double battle multi-hit
		if (move.spreadHit) {
			let spreadModifier = move.spreadModifier || 0.75;
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// Weather
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		if (this.gen === 3 && move.category === 'Physical' && !Math.floor(baseDamage)) {
			baseDamage = 1;
		}

		baseDamage += 2;

		if (move.crit) {
			baseDamage = this.modify(baseDamage, move.critModifier || 2);
		}

		// Mod 2 (Damage is floored after all multipliers are in)
		baseDamage = Math.floor(this.runEvent('ModifyDamagePhase2', pokemon, target, move, baseDamage));

		// this is not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.hasSTAB || type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
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

		// Final modifier.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if (!Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	},

	calcRecoilDamage: function (damageDealt, move) {
		return this.clampIntRange(Math.floor(damageDealt * move.recoil[0] / move.recoil[1]), 1);
	},
};
