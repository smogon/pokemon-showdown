// DigiPen custom item definitions.
//
// HOW TO ADD CONTENT:
//
// ── Custom Items ─────────────────────────────────────────────────────────────
// New DigiPen items must include `isNonstandard: "DigiPen" | "DigiPen" | "DigiPen"` so they are
// treated as illegal outside DigiPen formats and flagged as DigiPen in the Pokedex.
//
// DigiPen item icons image files are in a separate resource location and uses a file
// system instead of an icon sheet, so spritenum is an unecessary field to specify.
// However, it is a required field by default, so just set `spritenum: 0` to avoid errors.
//
// `shortDesc` field is displayed in Teambuilder and should be under 100 characters.
//
// `desc` field is displayed in the Pokedex. This field is optional if a longer description
// not needed, and will default to the `shortDesc` field if omitted.
// 
// (See data/text/items.ts for examples of desc and shortDesc fields.)
//
// `quality` field allows for the item to be categorized in the Teambuilder. The possible
// values are: "great", "good", "specific", "poor", "bad".
//
// `dexEntry` field is displayed in the Pokedex. It is for a flavor description of the item that doesn't necessarily
// explain its battle mechanics.
//
// `contributors` field is an optional field used to credit the person/people who contributed to the item
//
// ── Mega Stones ──────────────────────────────────────────────────────────────
// If you define a custom Mega Evolution in pokedex.ts you also need to define
// its Mega Stone here so the validator can find it. Set
// `megaStone: "<Species>-Mega"` and `itemUser: "<Species>"`.
//
// These should also be marked as `isNonstandard: "DigiPen"` or 
// `isNonstandard: "DigiPen"` since mega stones are not legal in normal generation
//  9 formats.
//
// Finally, they should be marked as `quality: "specific"` since they are specific to a single Pokemon.
//
// --- Buff Items ──────────────────────────────────────────────────────────────
// Buff Items are items that increase the base stats of a Pokemon when held.
//
// They have the `forcedFormes` field set where the key is the base species and the value is the 
// forme that the Pokemon transforms into.
//
// The `itemUser` field is set to the base species of the Pokemon that can hold them for the sake
// of the Teambuilder
//
// Same as above, they should be marked as `quality: "specific"` since they are specific to a subset of Pokemon.
//
// ── Overriding Existing Items ─────────────────────────────────────────────────
// Use `inherit: true` to change one or more fields of an existing item without
// replacing the whole entry.
//
// For buffed items, consider changing the item's quality to "great" or "good" to highlight the buff
// in the Teambuilder.

export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {

	// ── Custom Items ─────────────────────────────────────────────────────────
	// Use ordering from DigiPen Spreadsheet

	blueprint: {
		name: "Blueprint",
		spritenum: 0,
		fling: { basePower: 10 },
		// battle logic implemented on the Room moves
		// Need to fix parenthetical on battle counting down from 5 instead of 8
		num: 10002,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "Rooms set by the holder lasts 8 turn instead of 5.",
		desc: "Holder's use of Trick Room, Magic Room, Inverse Room, and Wonder Room lasts 8 turn instead of 5.",
		quality: "great",
		contributors: ["Jared G."],
	},
	frightmask: {
		name: "Fright Mask",
		spritenum: 0,
		fling: { basePower: 60 },
		onStart(pokemon) {
			let activated = false;
			if (!pokemon.ignoringItem() && !pokemon.hasAbility('intimidate') && pokemon.useItem()) {
				for (const target of pokemon.adjacentFoes()) {
					if (!activated) {
						this.add('-enditem', pokemon, 'Fright Mask', 'boost');
						activated = true;
					}
					if (target.volatiles['substitute']) {
						this.add('-immune', target);
					} else {
						const intimidate = this.dex.abilities.get('intimidate');
						this.boost({ atk: -1 }, target, pokemon, intimidate, true);
					}
				}
			}
		},
		num: 10003,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "On switch-in, lowers the Attack of opponents by 1 stage. Single use.",
		desc: "On switch-in, this item lowers the Attack of opposing Pokemon by 1 stage. \
			This item is consumed after use. This item cannot be used by Pokemon with \
			Intimidate ability. The effect of this item has the same interaction with \
			other abilities as Intimidate.",
		quality: "great",
		contributors: ["Jared G."],
	},
	perfection: {
		name: "Perfection",
		spritenum: 0,
		fling: { basePower: 10 }, // Same as Air Balloon
		onStart(target) {
			if (!target.ignoringItem()) {
				this.add('-item', target, 'Perfection');
				this.add('-message', `${target.name}'s Perfection increases its luck!`);
			}
		},
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		onDamagingHit(damage, target, source, move) {
			this.add('-enditem', target, 'Perfection');
			target.item = '';
			this.add('-message', `${target.name}'s Perfection was lost!`);
			this.clearEffectState(target.itemState);
			this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('perfection'));
		},
		onAfterSubDamage(damage, target, source, effect) {
			this.debug('effect: ' + effect.id);
			if (effect.effectType === 'Move') {
				this.add('-enditem', target, 'Perfection');
				target.item = '';
				this.add('-message', `${target.name}'s Perfection was lost!`);
				this.clearEffectState(target.itemState);
				this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('perfection'));
			}
		},
		num: 10004,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "Doubles secondary effect chance of holder's moves. Lost when holder is hit.",
		quality: "good",
		contributors: ["Jared G."],
	},
	lightshield: {
		name: "Light Shield",
		spritenum: 0,
		fling: { basePower: 30 }, // Same as Ability Shield
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates);
				if (hitSub) return;

				if (target.useItem()) {
					this.debug('15% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.85);
				}
			}
		},
		num: 10005,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "The holder takes 0.85x damage from a damaging attack. Single use.",
		quality: "poor",
		contributors: ["Bryce G."],
	},
	// Skipping Heavy-Duty Jacket for now -- seems difficult to implement
	ancientsundial: {
		name: "Ancient Sundial",
		spritenum: 0,
		fling: { basePower: 100 }, // Same as fossils
		// Battle logic implemented on affected moves
		// Don't forget to implement for Updraft once added
		num: 10007,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "Extends the duration of certain field effects by 3 turns.",
		desc: "Holder's use of Gravity, Updraft, Mud Sport, Water Sport, Mist, and Lucky Chant lasts 8 turns instead of 5.",
		quality: "good",
		contributors: ["Bryce G."],
	},
	shockorb: {
		name: "Shock Orb",
		spritenum: 0,
		fling: { // Same as Flame Orb and Toxic Orb
			basePower: 30,  
			status: 'par',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			pokemon.trySetStatus('par', pokemon);
		},
		num: 10008,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "At the end of every turn, this item attempts to burn the holder.",
		quality: "good",
		contributors: ["Bryce G."],
	},
	runningshoes: {
		name: "Running Shoes",
		spritenum: 0,
		fling: { basePower: 10 }, // Same as other clothing-like items
		onModifySpe(spe, pokemon) {
			if (pokemon.species.name !== 'Ditto') {
				return spe + 1;
			}
			return spe;
		},
		num: 10009,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "Increases the holder's Speed stat by 1 if the holder is not a Ditto.",
		quality: "good",
		contributors: ["Bryce G."],
	},

	// ── Mega Stones ──────────────────────────────────────────────────────────
	// Use ordering from DigiPen Spreadsheet of the corresponding Mega Pokemon

	hydreigite: {
		name: "Hydreigite",
		spritenum: 0,
		megaStone: { "Hydreigon": "Hydreigon-Mega" },
		itemUser: ["Hydreigon"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		num: 30003,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "If held by a Hydreigon, this item allows it to Mega Evolve in battle.",
		quality: "specific",
		contributors: ["Bryce G."],
	},

	// -- Buff Items ──────────────────────────────────────────────────────────
	// Use ordering from DigiPen Spreadsheet

	sirfetchdarmor: {
		name: "Sirfetch\u2019d Armor",
		spritenum: 0,
		fling: { basePower: 60 },
		forcedFormes: { 
			'Sirfetch\u2019d': 'Sirfetch\u2019d-Armored', 
		},
		itemUser: ['Sirfetch\u2019d'],
		num: 20002,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "If held by a Sirfetch\u2019d, this item transforms it into its Armored forme.",
		quality: "specific",
		// dexEntry:
		contributors: ["Bryce G."],
	},
	sandslasharmor: {
		name: "Sandslash Armor",
		spritenum: 0,
		fling: { basePower: 60 },
		forcedFormes: { 
			'Sandslash': 'Sandslash-Armored', 
			'Sandslash-Alola': 'Sandslash-Alola-Armored',
		},
		itemUser: ['Sandslash', 'Sandslash-Alola'],
		num: 20002,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "If held by a Sandslash, this item transforms it into its Armored forme.",
		desc: "If held by a Sandlash or a Sandlash-Alola, this item transforms it into its Armored forme.",
		quality: "specific",
		// dexEntry:
		contributors: ["Bryce G."],
	},
	samurottarmor: {
		name: "Samurott Armor",
		spritenum: 0,
		fling: { basePower: 60 },
		forcedFormes: { 
			'Samurott': 'Samurott-Armored',
			'Samurott-Hisui': 'Samurott-Hisui-Armored'
		},
		itemUser: ['Samurott', 'Samurott-Hisui'],
		num: 20002,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "If held by a Samurott, this item transforms it into its Armored forme.",
		desc: "If held by a Samurott or a Samurott-Hisui, this item transforms it into its Armored forme.",
		quality: "specific",
		// dexEntry:
		contributors: ["Bryce G."],
	},

	// ── Changing Existing Items ─────────────────────────────────────────────
	// Use ordering from DigiPen Spreadsheet

	shellbell :{
		inherit: true,
		modified: "DigiPen",
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.totalDamage && !pokemon.forceSwitchFlag) {
				this.heal(move.totalDamage / 5, pokemon);
			}
		},
		shortDesc: "After an attack, holder gains 1/5 of the damage in HP dealt to other Pokemon.",
		contributors: ["Bryce G."],
	},
	bigroot: {
		inherit: true,
		modified: "DigiPen",
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
			if (heals.includes(effect.id)) {
				return this.chainModify([6144, 4096]);
			}
		},
		shortDesc: "Holder gains 1.5x HP from draining/Aqua Ring/Ingrain/Leech Seed/Strength Sap.",
		contributors: ["Bryce G."],
	},
};
