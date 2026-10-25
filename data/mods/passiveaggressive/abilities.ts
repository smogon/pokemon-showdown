export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	aftermath: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (!defender.hp && this.checkMoveMakesContact(move, attacker, defender, true)) {
				const calc = calculate(this, defender, attacker);
				this.damage(calc * attacker.baseMaxhp / 4, attacker, defender);
			}
		},
	},
	baddreams: {
		inherit: true,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const defender of pokemon.foes()) {
				if (defender.status === 'slp' || defender.hasAbility('comatose')) {
					const calc = calculate(this, pokemon, defender);
					this.damage(calc * defender.baseMaxhp / 8, defender, pokemon);
				}
			}
		},
	},
	gulpmissile: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (!attacker.hp || !attacker.isActive || defender.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(defender.species.id)) {
				const calc = calculate(this, defender, attacker);
				if (calc) this.damage(calc * attacker.baseMaxhp / 4, attacker, defender);
				if (defender.species.id === 'cramorantgulping') {
					this.boost({ def: -1 }, attacker, defender, null, true);
				} else {
					attacker.trySetStatus('par', defender, move);
				}
				defender.formeChange('cramorant', move);
			}
		},
	},
	ironbarbs: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (this.checkMoveMakesContact(move, attacker, defender, true)) {
				const calc = calculate(this, defender, attacker);
				this.damage(calc * attacker.baseMaxhp / 8, attacker, defender);
			}
		},
	},
	roughskin: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (this.checkMoveMakesContact(move, attacker, defender, true)) {
				const calc = calculate(this, defender, attacker);
				this.damage(calc * attacker.baseMaxhp / 8, attacker, defender);
			}
		},
	},
};

function calculate(battle: Battle, attacker: Pokemon, pokemon: Pokemon) {
	const move = battle.dex.getActiveMove('tackle');
	move.type = attacker.getTypes()[0];
	const typeMod = 2 ** battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6);
	if (!pokemon.runImmunity(move)) return 0;
	return typeMod;
}
