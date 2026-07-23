export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	// Re-legalize later-generation abilities used by eligible Mega and Primal
	// formes. Their battle behavior still resolves through the Gen 4 mod chain.
	toughclaws: { inherit: true, gen: 4, isNonstandard: null },
	megalauncher: { inherit: true, gen: 4, isNonstandard: null },
	adaptability: { inherit: true, gen: 4, isNonstandard: null },
	noguard: { inherit: true, gen: 4, isNonstandard: null },
	magicbounce: { inherit: true, gen: 4, isNonstandard: null },
	innardsout: { inherit: true, gen: 4, isNonstandard: null },
	parentalbond: {
		inherit: true,
		gen: 4,
		isNonstandard: null,
		// Gen 4's damage pipeline overrides the base action method that normally
		// reduces Parental Bond's second strike. Apply the modern 25% modifier
		// through the final ModifyDamage event that DPP still dispatches.
		onModifyDamage(damage, source, target, move) {
			if (move.multihitType === 'parentalbond' && move.hit > 1) {
				return this.chainModify([1024, 4096]);
			}
		},
	},
	aerilate: {
		inherit: true,
		gen: 4,
		isNonstandard: null,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
	},
	moldbreaker: { inherit: true, gen: 4, isNonstandard: null },
	multiscale: { inherit: true, gen: 4, isNonstandard: null },
	steadfast: { inherit: true, gen: 4, isNonstandard: null },
	sandforce: { inherit: true, gen: 4, isNonstandard: null },
	technician: { inherit: true, gen: 4, isNonstandard: null },
	skilllink: { inherit: true, gen: 4, isNonstandard: null },
	stalwart: { inherit: true, gen: 4, isNonstandard: null },
	solarpower: { inherit: true, gen: 4, isNonstandard: null },
	filter: { inherit: true, gen: 4, isNonstandard: null },
	strongjaw: { inherit: true, gen: 4, isNonstandard: null },
	sheerforce: { inherit: true, gen: 4, isNonstandard: null },
	prankster: { inherit: true, gen: 4, isNonstandard: null },
	refrigerate: {
		inherit: true,
		gen: 4,
		isNonstandard: null,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
	},
	primordialsea: { inherit: true, gen: 4, isNonstandard: null },
	desolateland: { inherit: true, gen: 4, isNonstandard: null },
	contrary: { inherit: true, gen: 4, isNonstandard: null },

	// Custom abilities used by the Champions Mega roster.
	megasol: { inherit: true, gen: 4, isNonstandard: null },
	dragonize: { inherit: true, gen: 4, isNonstandard: null },
};
