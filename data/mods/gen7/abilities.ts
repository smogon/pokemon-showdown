export const Abilities: {[k: string]: ModdedAbilityData} = {
	disguise: {
		inherit: true,
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
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
			let stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in pokemon.boosts) {
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 2;

			stats = [];
			let statMinus: BoostID;
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
	slowstart: {
		inherit: true,
		condition: {
			duration: 5,
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon, target, move) {
				// This is because the game checks the move's category in data, rather than what it is currently, unlike e.g. Huge Power
				if (this.dex.moves.get(move.id).category === 'Physical') {
					return this.chainModify(0.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon, target, move) {
				// Ordinary Z-moves like Breakneck Blitz will halve the user's Special Attack as well
				if (this.dex.moves.get(move.id).category === 'Physical') {
					return this.chainModify(0.5);
				}
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
	},
	soundproof: {
		inherit: true,
		onTryHit(target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', target, '[from] ability: Soundproof');
				return null;
			}
		},
	},
	technician: {
		inherit: true,
		onBasePowerPriority: 19,
	},
};
