export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	hoots: {
		name: "Hoots",
		spritenum: 715,
		fling: {
			basePower: 80,
		},
		num: 1120,
		gen: 8,
		// Hazard Immunity implemented in moves.ts
	},
	luckycharm: {
		name: "Lucky Charm",
		onModifyMovePriority: -2,
		onModifyMove(move, pokemon, target) {
			let trigger = false;
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance && secondary.chance < 100) {
						secondary.chance = 100;
						if (!trigger) trigger = true;
					}
				}
			}
			if (move.self?.chance) {
				move.self.chance = 100;
				trigger = true;
			}
			if (trigger) {
				pokemon.useItem();
			}
		},
		spritenum: 707,
		fling: {
			basePower: 120,
		},
		num: 9999,
		gen: 9,
	},
	onikaburger: {
		name: "Onika Burger",
		desc: "PP and damage of every move is halved. Gain 25% max HP at the end of each turn.",
		shortDesc: "PP and damage of every move is halved. Gain 25% max HP at the end of each turn.",
		onStart(target) {
			if (target.m.onikaBurger) return;
			target.m.onikaBurger = true;
			for (const moveSlot of target.moveSlots) {
				const deductPP = target.deductPP(moveSlot.id, moveSlot.maxpp / 2, target);
				if (!deductPP) continue;
				this.add('-activate', target, 'item: Onika Burger', moveSlot.move, deductPP);
			}
		},
		onModifyDamage() {
			return this.chainModify(0.5);
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 4);
		},
	},
	wardtag: {
		name: "Ward Tag",
		desc: "Reflects back 125% of the damage that would've been dealt. One-time use.",
		shortDesc: "Reflects back 125% of the damage that would've been dealt. One-time use.",
		onDamage(damage, target, source, effect) {
			if (source && target !== source && effect?.effectType === 'Move' && target.useItem()) {
				this.add('-activate', target, 'item: Ward Tag');
				this.damage(damage * 5 / 4, source, target);
				return 0;
			}
		},
	},
	strengthpolicy: {
		name: "Strength Policy",
		spritenum: 609,
		fling: {
			basePower: 80,
		},
		onDamagingHit(damage, target, source, move) {
			if (!move.damage && !move.damageCallback && target.getMoveHitData(move).typeMod < 0) {
				target.useItem();
			}
		},
		boosts: {
			def: 2,
			spd: 2,
		},
		num: 639,
		gen: 6,
	},
};
