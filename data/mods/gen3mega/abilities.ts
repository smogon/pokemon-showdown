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
	// -ate type-changing abilities. Each needs two Gen 3 adjustments, and both are
	// deliberately kept here rather than in data/mods/gen3, which 26 stock ADV
	// formats declare and every GSC format inherits:
	//
	// 1. Dispatch. Gen 3's useMoveInner never fires the `ModifyType` event that base
	//    useMoveInner does (sim/battle-actions.ts), so the inherited `onModifyType`
	//    handler is dead code in this mod. It does fire `ModifyMove` at the same
	//    point in the pipeline, so the retype is written as `onModifyMove` instead.
	//    The guard is base's, minus the Z-move/Dynamax/Tera clauses that cannot
	//    occur in Gen 3.
	// 2. Category. Gen 3 has no physical/special split: a damaging move's class is
	//    derived from its TYPE (gen3/scripts.ts init()). A runtime retype therefore
	//    has to re-derive it, or Refrigerate's Ice Return would still resolve as
	//    Physical. Gen 3's own Hidden Power and Weather Ball overrides do the same
	//    thing by hand in their onModifyMove. Aerilate is the quiet case: Flying is
	//    a physical type in Gen 3, so its moves keep the class they already had.
	//
	// The onBasePower re-pin is a third, separate adjustment: gen3mega would inherit
	// Gen 6's 1.3x (5325/4096) through the chain (gen3mega -> gen3 -> ... -> gen6),
	// and we want Gen 7+'s 1.2x (4915/4096). Dragonize is a custom, base-only ability
	// with no gen6 override, so it already resolves to 1.2x — it is re-pinned anyway
	// so all three read the same and a later gen6 edit cannot silently split them.
	//
	// noModifyType is copied verbatim from base rather than trimmed to the moves
	// that exist in Gen 3, so it stays diffable against upstream's -ate abilities.
	// (surfnWOB)
	aerilate: {
		inherit: true,
		gen: 3,
		isNonstandard: null,
		onModifyMove(move) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type !== 'Normal' || noModifyType.includes(move.id)) return;
			move.type = 'Flying';
			move.typeChangerBoosted = this.effect;
			if (move.category !== 'Status') {
				const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
				move.category = specialTypes.includes(move.type) ? 'Special' : 'Physical';
			}
		},
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
		// See the -ate note above aerilate.
		onModifyMove(move) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type !== 'Normal' || noModifyType.includes(move.id)) return;
			move.type = 'Ice';
			move.typeChangerBoosted = this.effect;
			if (move.category !== 'Status') {
				const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
				move.category = specialTypes.includes(move.type) ? 'Special' : 'Physical';
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
	},
	primordialsea: { inherit: true, gen: 3, isNonstandard: null },
	desolateland: { inherit: true, gen: 3, isNonstandard: null },

	// Custom fork abilities (originally isNonstandard: "Future")
	megasol: { inherit: true, gen: 3, isNonstandard: null },
	dragonize: {
		inherit: true,
		gen: 3,
		isNonstandard: null,
		// See the -ate note above aerilate.
		onModifyMove(move) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type !== 'Normal' || noModifyType.includes(move.id)) return;
			move.type = 'Dragon';
			move.typeChangerBoosted = this.effect;
			if (move.category !== 'Status') {
				const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
				move.category = specialTypes.includes(move.type) ? 'Special' : 'Physical';
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
	},
};
