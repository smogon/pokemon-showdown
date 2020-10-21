export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen5',
	gen: 4,
	init() {
		for (const i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
	},

	modifyDamage(baseDamage, pokemon, target, move, suppressMessages = false) {
		// DPP divides modifiers into several mathematically important stages
		// The modifiers run earlier than other generations are called with ModifyDamagePhase1 and ModifyDamagePhase2

		if (!move.type) move.type = '???';
		const type = move.type;

		// Burn
		if (pokemon.status === 'brn' && baseDamage && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
			baseDamage = this.modify(baseDamage, 0.5);
		}

		// Other modifiers (Reflect/Light Screen/etc)
		baseDamage = this.runEvent('ModifyDamagePhase1', pokemon, target, move, baseDamage);

		// Double battle multi-hit
		if (move.spreadHit) {
			const spreadModifier = move.spreadModifier || (this.gameType === 'free-for-all' ? 0.5 : 0.75);
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// Weather
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		if (this.gen === 3 && move.category === 'Physical' && !Math.floor(baseDamage)) {
			baseDamage = 1;
		}

		baseDamage += 2;

		const isCrit = target.getMoveHitData(move).crit;
		if (isCrit) {
			baseDamage = this.modify(baseDamage, move.critModifier || 2);
		}

		// Mod 2 (Damage is floored after all multipliers are in)
		baseDamage = Math.floor(this.runEvent('ModifyDamagePhase2', pokemon, target, move, baseDamage));

		// this is not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.forceSTAB || type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		let typeMod = target.runEffectiveness(move);
		typeMod = this.clampIntRange(typeMod, -6, 6);
		target.getMoveHitData(move).typeMod = typeMod;
		if (typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > typeMod; i--) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		if (isCrit && !suppressMessages) this.add('-crit', target);

		// Final modifier.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if (!Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	},
	hitStepInvulnerabilityEvent(targets, pokemon, move) {
		const hitResults = this.runEvent('Invulnerability', targets, pokemon, move);
		for (const [i, target] of targets.entries()) {
			if (hitResults[i] === false) {
				this.attrLastMove('[miss]');
				this.add('-miss', pokemon, target);
			}
		}
		return hitResults;
	},

	calcRecoilDamage(damageDealt, move) {
		return this.clampIntRange(Math.floor(damageDealt * move.recoil![0] / move.recoil![1]), 1);
	},
};
