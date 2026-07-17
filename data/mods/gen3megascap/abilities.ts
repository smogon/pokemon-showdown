export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	// Re-legalize the abilities used by the custom Mega/Primal formes so they
	// validate in Gen 3. Each Mega's intended ability lives in the base data
	// (inherited via pokedex.ts); here we just clear the gen gate / Future flag.
	//
	// NOT re-legalized: Pixilate (Gardevoir-Mega, Altaria-Mega) — it converts
	// Normal-type moves to Fairy, which doesn't exist in Gen 3, so those formes
	// keep a Gen-3 ability instead (see pokedex.ts).

	// Canonical later-gen abilities
	toughclaws: { inherit: true, gen: 3, isNonstandard: null },
	megalauncher: { inherit: true, gen: 3, isNonstandard: null },
	adaptability: { inherit: true, gen: 3, isNonstandard: null },
	noguard: { inherit: true, gen: 3, isNonstandard: null },
	magicbounce: { inherit: true, gen: 3, isNonstandard: null },
	innardsout: { inherit: true, gen: 3, isNonstandard: null },
	parentalbond: {
		inherit: true,
		gen: 3,
		isNonstandard: null,
		// The second strike deals 25% of normal damage, matching Pokémon Champions
		// (champions/scripts.ts applies bondModifier 0.25 for gen > 6) and Gen 7+.
		// Champions does NOT nerf Parental Bond below the modern value; an earlier
		// comment here claiming a Champions-specific ~10% nerf was incorrect.
		// The stock reducer lives in BattleActions#modifyDamage, but Gen 3's
		// modifyDamage override drops that parentalbond branch — so instead we hook
		// the ModifyDamage event the Gen 3 engine still fires (gen3/scripts.ts),
		// which dispatches onModifyDamage to the attacker (same channel
		// Neuroforce/Sniper/Tinted Lens use).
		//   1024/4096 = 0.25 — the engine-idiomatic 4096-fixed-point form of 25%.
		// Fixed-damage moves (Seismic Toss, Night Shade, Dragon Rage, Sonic Boom,
		// OHKOs) return before modifyDamage runs, so this never fires for them and
		// both their hits stay at full damage — matching the modern engine.
		onModifyDamage(damage, source, target, move) {
			if (move.multihitType === 'parentalbond' && move.hit > 1) {
				return this.chainModify([1024, 4096]);
			}
		},
	},
	// -ate type-changing abilities: gen3mega inherits gen6's 1.3x (5325/4096) boost
	// via the mod chain (gen3mega -> gen3 -> ... -> gen6), but we want the Gen 7+
	// 1.2x (4915/4096) behavior. Re-pin onBasePower to the 1.2x modifier; everything
	// else (onModifyType, priorities) keeps inheriting. (Dragonize is a custom,
	// base-only ability with no gen6 override, so it already resolves to 1.2x.)
	aerilate: {
		inherit: true,
		gen: 3,
		isNonstandard: null,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
	},
	moldbreaker: { inherit: true, gen: 3, isNonstandard: null },
	multiscale: { inherit: true, gen: 3, isNonstandard: null },
	steadfast: { inherit: true, gen: 3, isNonstandard: null },
	sandforce: { inherit: true, gen: 3, isNonstandard: null },
	technician: { inherit: true, gen: 3, isNonstandard: null },
	skilllink: { inherit: true, gen: 3, isNonstandard: null },
	stalwart: { inherit: true, gen: 3, isNonstandard: null },
	solarpower: { inherit: true, gen: 3, isNonstandard: null },
	filter: { inherit: true, gen: 3, isNonstandard: null },
	strongjaw: { inherit: true, gen: 3, isNonstandard: null },
	sheerforce: { inherit: true, gen: 3, isNonstandard: null },
	prankster: { inherit: true, gen: 3, isNonstandard: null },
	refrigerate: {
		inherit: true,
		gen: 3,
		isNonstandard: null,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
	},
	primordialsea: { inherit: true, gen: 3, isNonstandard: null },
	desolateland: { inherit: true, gen: 3, isNonstandard: null },
	beautifulshine: { inherit: true, gen: 3, isNonstandard: null },
	cursedbody: { inherit: true, gen: 3, isNonstandard: null },
	ironfist: { inherit: true, gen: 3, isNonstandard: null },
	shady: { inherit: true, gen: 3, isNonstandard: null },
	snowwarning: {
		inherit: true,
		gen: 3,
		isNonstandard: null,
		onStart(source) {
			this.field.setWeather('hail');
		},
		onWeather(target, source, effect) {
			if (effect.id === 'hail' || effect.id === 'snowscape') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
	},
	soulheart: { inherit: true, gen: 3, isNonstandard: null },
	stormdrain: { inherit: true, gen: 3, isNonstandard: null },
	imposter: { inherit: true, gen: 3, isNonstandard: null },
	perishbody: { inherit: true, gen: 3, isNonstandard: null },
	eartheater: { inherit: true, gen: 3, isNonstandard: null },
	unaware: { inherit: true, gen: 3, isNonstandard: null },
	opportunist: { inherit: true, gen: 3, isNonstandard: null },
	waterbubble: { inherit: true, gen: 3, isNonstandard: null },
	protean: { inherit: true, gen: 3, isNonstandard: null },
	teravolt: { inherit: true, gen: 3, isNonstandard: null },
	infiltrator: { inherit: true, gen: 3, isNonstandard: null },
	merciless: { inherit: true, gen: 3, isNonstandard: null },
	highnoon: {
		onStart(source) {
			this.field.setWeather('sunnyday');
		},
		flags: { breakable: 1 },
		name: "High Noon",
		rating: 3.5,
		num: 320,
		gen: 3,
		isNonstandard: null,
	},

	// Custom fork abilities (originally isNonstandard: "Future")
	megasol: { inherit: true, gen: 3, isNonstandard: null },
	dragonize: { inherit: true, gen: 3, isNonstandard: null },
};
