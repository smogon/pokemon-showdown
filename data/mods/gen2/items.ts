export const Items: {[k: string]: ModdedItemData} = {
	berryjuice: {
		inherit: true,
		isNonstandard: null,
	},
	brightpowder: {
		inherit: true,
		desc: "An attack against the holder has its accuracy out of 255 lowered by 20.",
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy - 20;
		},
	},
	dragonfang: {
		inherit: true,
		desc: "No competitive use.",
		onBasePower() {},
	},
	dragonscale: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Dragon-type attacks have 1.1x power. Evolves Seadra (trade).",
	},
	focusband: {
		inherit: true,
		desc: "Holder has a ~11.7% chance to survive an attack that would KO it with 1 HP.",
		onDamage(damage, target, source, effect) {
			if (this.randomChance(30, 256) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-activate', target, 'item: Focus Band');
				return target.hp - 1;
			}
		},
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
	lightball: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifySpA() {},
	},
	luckypunch: {
		inherit: true,
		desc: "If held by a Chansey, its critical hit ratio is always at stage 2. (25% crit rate)",
		onModifyCritRatioPriority: -1,
		onModifyCritRatio(critRatio, user) {
			if (user.species.name === 'Chansey') {
				return 3;
			}
		},
	},
	metalpowder: {
		inherit: true,
		desc: "If held by a Ditto, its Defense and Sp. Def are 1.5x, even while Transformed.",
		// In Gen 2 this happens in stat calculation directly.
		onModifyDef() {},
		onModifySpD() {},
	},
	quickclaw: {
		inherit: true,
		desc: "Each turn, holder has a ~23.4% chance to move first in its priority bracket.",
		onFractionalPriority(priority, pokemon) {
			if (this.randomChance(60, 256)) {
				return 0.1;
			}
		},
	},
	stick: {
		inherit: true,
		desc: "If held by a Farfetch\u2019d, its critical hit ratio is always at stage 2. (25% crit rate)",
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
		isNonstandard: null,
	},
	polkadotbow: {
		inherit: true,
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
