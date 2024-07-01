export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	berryjuice: {
		inherit: true,
		isNonstandard: null,
	},
	blackbelt: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Fighting') {
				return damage * 1.1;
			}
		},
	},
	blackglasses: {
		inherit: true,
		onModifySpA() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Dark') {
				return damage * 1.1;
			}
		},
	},
	brightpowder: {
		inherit: true,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy - 20;
		},
	},
	charcoal: {
		inherit: true,
		onModifySpA() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Fire') {
				return damage * 1.1;
			}
		},
	},
	dragonfang: {
		inherit: true,
		onModifySpA() {},
	},
	dragonscale: {
		inherit: true,
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Dragon') {
				return damage * 1.1;
			}
		},
	},
	fastball: {
		inherit: true,
		isNonstandard: null,
	},
	focusband: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (this.randomChance(30, 256) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-activate', target, 'item: Focus Band');
				return target.hp - 1;
			}
		},
	},
	hardstone: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Rock') {
				return damage * 1.1;
			}
		},
	},
	heavyball: {
		inherit: true,
		isNonstandard: null,
	},
	kingsrock: {
		inherit: true,
		onModifyMove(move) {
			const affectedByKingsRock = [
				'absorb', 'aeroblast', 'barrage', 'beatup', 'bide', 'bonerush', 'bonemerang', 'cometpunch', 'counter', 'crabhammer', 'crosschop', 'cut', 'dig', 'doublekick', 'doubleslap', 'doubleedge', 'dragonrage', 'drillpeck', 'eggbomb', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'flail', 'fly', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigadrain', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydropump', 'jumpkick', 'karatechop', 'leechlife', 'machpunch', 'magnitude', 'megadrain', 'megakick', 'megapunch', 'megahorn', 'mirrorcoat', 'nightshade', 'outrage', 'payday', 'peck', 'petaldance', 'pinmissile', 'pound', 'present', 'pursuit', 'psywave', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'reversal', 'rockthrow', 'rollout', 'scratch', 'seismictoss', 'selfdestruct', 'skullbash', 'skyattack', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spikecannon', 'strength', 'struggle', 'submission', 'superfang', 'surf', 'swift', 'tackle', 'takedown', 'thief', 'thrash', 'triplekick', 'twineedle', 'visegrip', 'vinewhip', 'vitalthrow', 'watergun', 'waterfall', 'wingattack',
			];
			if (affectedByKingsRock.includes(move.id)) {
				if (!move.secondaries) move.secondaries = [];
				// The kingsrock flag allows for differentiation from Snore,
				// which can flinch and is also affected by King's Rock
				move.secondaries.push({
					chance: 12,
					volatileStatus: 'flinch',
					kingsrock: true,
				});
			}
		},
	},
	leftovers: {
		inherit: true,
		onResidualOrder: 5,
		onResidualSubOrder: 1,
	},
	levelball: {
		inherit: true,
		isNonstandard: null,
	},
	lightball: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifySpA() {},
	},
	loveball: {
		inherit: true,
		isNonstandard: null,
	},
	luckypunch: {
		inherit: true,
		onModifyCritRatioPriority: -1,
		onModifyCritRatio(critRatio, user) {
			if (user.species.name === 'Chansey') {
				return 3;
			}
		},
	},
	lureball: {
		inherit: true,
		isNonstandard: null,
	},
	magnet: {
		inherit: true,
		onModifySpA() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Electric') {
				return damage * 1.1;
			}
		},
	},
	metalcoat: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Steel') {
				return damage * 1.1;
			}
		},
	},
	metalpowder: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifyDef() {},
		onModifySpD() {},
	},
	miracleseed: {
		inherit: true,
		onModifySpA() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Grass') {
				return damage * 1.1;
			}
		},
	},
	moonball: {
		inherit: true,
		isNonstandard: null,
	},
	mysticwater: {
		inherit: true,
		onModifySpA() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Water') {
				return damage * 1.1;
			}
		},
	},
	nevermeltice: {
		inherit: true,
		onModifySpA() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Ice') {
				return damage * 1.1;
			}
		},
	},
	poisonbarb: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Poison') {
				return damage * 1.1;
			}
		},
	},
	sharpbeak: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Flying') {
				return damage * 1.1;
			}
		},
	},
	silverpowder: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Bug') {
				return damage * 1.1;
			}
		},
	},
	softsand: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Ground') {
				return damage * 1.1;
			}
		},
	},
	spelltag: {
		inherit: true,
		onModifyAtk() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Ghost') {
				return damage * 1.1;
			}
		},
	},
	sportball: {
		inherit: true,
		isNonstandard: null,
	},
	stick: {
		inherit: true,
		onModifyCritRatioPriority: -1,
		onModifyCritRatio(critRatio, user) {
			if (user.species.id === 'farfetchd') {
				return 3;
			}
		},
	},
	thickclub: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifyAtk() {},
	},
	twistedspoon: {
		inherit: true,
		onModifySpA() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Psychic') {
				return damage * 1.1;
			}
		},
	},
	berserkgene: {
		inherit: true,
		isNonstandard: null,
	},
	berry: {
		inherit: true,
		isNonstandard: null,
	},
	bitterberry: {
		inherit: true,
		isNonstandard: null,
	},
	burntberry: {
		inherit: true,
		isNonstandard: null,
	},
	goldberry: {
		inherit: true,
		isNonstandard: null,
	},
	iceberry: {
		inherit: true,
		isNonstandard: null,
	},
	mintberry: {
		inherit: true,
		isNonstandard: null,
	},
	miracleberry: {
		inherit: true,
		isNonstandard: null,
	},
	mysteryberry: {
		inherit: true,
		isNonstandard: null,
	},
	pinkbow: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Normal') {
				return damage * 1.1;
			}
		},
		isNonstandard: null,
	},
	polkadotbow: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Normal') {
				return damage * 1.1;
			}
		},
		isNonstandard: null,
	},
	przcureberry: {
		inherit: true,
		isNonstandard: null,
	},
	psncureberry: {
		inherit: true,
		isNonstandard: null,
	},
};
