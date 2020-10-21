export const Abilities: {[k: string]: ModdedAbilityData} = {
	disguise: {
		inherit: true,
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectData.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
			}
		},
	},
	innerfocus: {
		inherit: true,
		rating: 1,
		onBoost() {},
	},
	intimidate: {
		inherit: true,
		rating: 4,
	},
	moody: {
		inherit: true,
		onResidual(pokemon) {
			let stats: BoostName[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostName;
			for (statPlus in pokemon.boosts) {
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 2;

			stats = [];
			let statMinus: BoostName;
			for (statMinus in pokemon.boosts) {
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost);
		},
	},
	oblivious: {
		inherit: true,
		onBoost() {},
	},
	owntempo: {
		inherit: true,
		onBoost() {},
	},
	rattled: {
		onDamagingHit(damage, target, source, move) {
			if (['Dark', 'Bug', 'Ghost'].includes(move.type)) {
				this.boost({spe: 1});
			}
		},
		name: "Rattled",
		rating: 1.5,
		num: 155,
	},
	scrappy: {
		inherit: true,
		onBoost() {},
	},
	technician: {
		inherit: true,
		onBasePowerPriority: 19,
	},
};
