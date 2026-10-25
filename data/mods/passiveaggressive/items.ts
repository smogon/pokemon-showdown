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
		onDamagingHit(damage, defender, attacker, move) {
			if (move.category === 'Physical' && attacker.hp && attacker.isActive && !attacker.hasAbility('magicguard')) {
				if (defender.eatItem()) {
					const calc = calculate(this, defender, attacker);
					if (calc) this.damage(calc * attacker.baseMaxhp / (defender.hasAbility('ripen') ? 4 : 8), attacker, defender);
				}
			}
		},
	},
	lifeorb: {
		inherit: true,
		onAfterMoveSecondarySelf(attacker, defender, move) {
			if (attacker && attacker !== defender && move && move.category !== 'Status' && !attacker.forceSwitchFlag) {
				const calc = calculate(this, attacker, attacker);
				if (calc) this.damage(calc * attacker.baseMaxhp / 10, attacker, attacker, this.dex.items.get('lifeorb'));
			}
		},
	},
	rockyhelmet: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (this.checkMoveMakesContact(move, attacker, defender)) {
				const calc = calculate(this, defender, attacker);
				if (calc) this.damage(calc * attacker.baseMaxhp / 6, attacker, defender);
			}
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.category === 'Special' && attacker.hp && attacker.isActive && !attacker.hasAbility('magicguard')) {
				if (defender.eatItem()) {
					const calc = calculate(this, defender, attacker);
					if (calc) this.damage(calc * attacker.baseMaxhp / (defender.hasAbility('ripen') ? 4 : 8), attacker, defender);
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

function calculate(battle: Battle, attacker: Pokemon, pokemon: Pokemon) {
	const move = battle.dex.getActiveMove('tackle');
	move.type = attacker.getTypes()[0];
	const typeMod = 2 ** battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6);
	if (!pokemon.runImmunity(move)) return 0;
	return typeMod;
}
