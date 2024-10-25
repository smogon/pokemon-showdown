export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	blacksludge: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.hasType('Poison')) {
				this.heal(pokemon.baseMaxhp / 16);
			} else {
				const calc = calculate(this, pokemon, pokemon);
				if (calc) this.damage(calc * pokemon.baseMaxhp / 8);
			}
		},
	},
	jabocaberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					const calc = calculate(this, target, source);
					if (calc) this.damage(calc * source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
				}
			}
		},
	},
	lifeorb: {
		inherit: true,
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag) {
				const calc = calculate(this, source, source);
				if (calc) this.damage(calc * source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
			}
		},
	},
	rockyhelmet: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				const calc = calculate(this, target, source);
				if (calc) this.damage(calc * source.baseMaxhp / 6, source, target);
			}
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					const calc = calculate(this, target, source);
					if (calc) this.damage(calc * source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
				}
			}
		},
	},
	stickybarb: {
		inherit: true,
		onResidual(pokemon) {
			const calc = calculate(this, pokemon, pokemon);
			if (calc) this.damage(calc * pokemon.baseMaxhp / 8);
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
