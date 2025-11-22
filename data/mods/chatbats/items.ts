export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	bigroot: {
		inherit: true,
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
			if (heals.includes(effect.id)) {
				return this.chainModify([6144, 4096]);
			}
		},
		shortDesc: "Holder gains 1.5x HP from draining, Aqua Ring, Ingrain, Leech Seed, Strength Sap.",
	},
	masquerainite: {
		name: "Masquerainite",
		spritenum: 1,
		megaStone: "Masquerain-Mega",
		megaEvolves: "Masquerain",
		itemUser: ["Masquerain"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1,
		gen: 9,
		desc: "If held by a Masquerain, this item allows it to Mega Evolve in battle.",
	},
	starfberry: {
		name: "Starf Berry",
		spritenum: 472,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Psychic",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2 ||
				((pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in pokemon.boosts) {
				if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			}
		},
		num: 207,
		gen: 3,
	},
	typhlosionite: {
		name: "Typhlosionite",
		spritenum: 1,
		megaStone: "Typhlosion-Mega",
		megaEvolves: "Typhlosion",
		itemUser: ["Typhlosion"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -2,
		gen: 9,
		desc: "If held by a Typhlosion, this item allows it to Mega Evolve in battle.",
	},
	tartapple: {
		name: "Tart Apple",
		spritenum: 712,
		isBerry: true,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (
				move && (user.baseSpecies.num === 841) &&
				(move.type === 'Grass' || move.type === 'Ground')
			) {
				return this.chainModify([4915, 4096]);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 4)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 4);
		},
		itemUser: ["Flapple"],
		num: 1117,
		gen: 8,
		desc: "Grass- and Ground-type moves have 1.2x power. Restores 1/4 max HP when at 1/2 max HP or less.",
	},
	thickclub: {
		name: "Thick Club",
		spritenum: 491,
		fling: {
			basePower: 130,
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Mandibuzz' || pokemon.baseSpecies.baseSpecies === 'Mew') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Marowak", "Marowak-Alola", "Marowak-Alola-Totem", "Cubone", "Mandibuzz", "Mew"],
		num: 258,
		gen: 2,
		desc: "Doubles Attack.",
	},
};
