export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	aftermath: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp && this.checkMoveMakesContact(move, source, target, true)) {
				const calc = calculate(this, target, source);
				this.damage(calc * source.baseMaxhp / 4, source, target);
			}
		},
	},
	baddreams: {
		inherit: true,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					const calc = calculate(this, pokemon, target);
					this.damage(calc * target.baseMaxhp / 8, target, pokemon);
				}
			}
		},
	},
	gulpmissile: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!source.hp || !source.isActive || target.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
				const calc = calculate(this, target, source);
				if (calc) this.damage(calc * source.baseMaxhp / 4, source, target);
				if (target.species.id === 'cramorantgulping') {
					this.boost({def: -1}, source, target, null, true);
				} else {
					source.trySetStatus('par', target, move);
				}
				target.formeChange('cramorant', move);
			}
		},
	},
	ironbarbs: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				const calc = calculate(this, target, source);
				this.damage(calc * source.baseMaxhp / 8, source, target);
			}
		},
	},
	roughskin: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				const calc = calculate(this, target, source);
				this.damage(calc * source.baseMaxhp / 8, source, target);
			}
		},
	},
};

function calculate(battle: Battle, source: Pokemon, pokemon: Pokemon) {
	const move = battle.dex.getActiveMove('tackle');
	move.type = source.getTypes()[0];
	const typeMod = Math.pow(2, battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6));
	if (!pokemon.runImmunity(move.type)) return 0;
	return typeMod;
}
