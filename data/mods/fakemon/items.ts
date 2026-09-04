/**
 * Fakemon items.
 *
 * Three groups:
 *   1. MEGA STONES  - one per Mega forme in the dex PDF. Holding the right one
 *      turns Mega Evolution into the +100 BST forme change with its Mega
 *      Ability instead of the generic stoneless +20-to-everything (scripts.ts).
 *   2. FOOD ITEMS   - the dex PDF repeatedly refers to "food items" (Crispy
 *      Charge, Sugar Rush, Nibble, Evergreen Cud, Itemfinder, Nectar Dash...)
 *      without listing any, so this set is defined here. `FOOD_ITEMS` is the
 *      single list every one of those abilities and moves checks against.
 *   3. UTILITY ITEMS - a small neutral set so team building has real choices.
 *
 * Every item is flagged `isNonstandard: 'Custom'`, which is what scripts.ts
 * uses to tell custom items apart from the original Showdown ones it deletes.
 */

/** Every food item in the custom game. Read by abilities.ts and moves-signature.ts. */
export const FOOD_ITEMS = [
	'sugarberry', 'crispycrumb', 'honeydrop', 'spicywrap', 'frostcone',
	'nectarvial', 'roastednut', 'jellycup', 'herbloaf', 'moonpetal',
] as const;

export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	// ---------------------------------------------------------------
	// 1. MEGA STONES
	// ---------------------------------------------------------------
	hallowispite: {
		name: "Hallowispite",
		spritenum: 0,
		megaStone: { "Hallowisp": "Hallowisp-Mega" },
		itemUser: ["Hallowisp"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3001,
		gen: 9,
		desc: "If held by Hallowisp, this item allows it to Mega Evolve into Hallowisp-Mega.",
	},
	bunbombardite: {
		name: "Bunbombardite",
		spritenum: 0,
		megaStone: { "Bunbombard": "Bunbombard-Mega" },
		itemUser: ["Bunbombard"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3002,
		gen: 9,
		desc: "If held by Bunbombard, this item allows it to Mega Evolve into Bunbombard-Mega.",
	},
	marionoakite: {
		name: "Marionoakite",
		spritenum: 0,
		megaStone: { "Marionoak": "Marionoak-Mega" },
		itemUser: ["Marionoak"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3003,
		gen: 9,
		desc: "If held by Marionoak, this item allows it to Mega Evolve into Marionoak-Mega.",
	},
	kabkolossite: {
		name: "Kabkolossite",
		spritenum: 0,
		megaStone: { "Kabkoloss": "Kabkoloss-Mega" },
		itemUser: ["Kabkoloss"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3004,
		gen: 9,
		desc: "If held by Kabkoloss, this item allows it to Mega Evolve into Kabkoloss-Mega.",
	},
	candelordite: {
		name: "Candelordite",
		spritenum: 0,
		megaStone: { "Candelord": "Candelord-Mega" },
		itemUser: ["Candelord"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3005,
		gen: 9,
		desc: "If held by Candelord, this item allows it to Mega Evolve into Candelord-Mega.",
	},
	monkongite: {
		name: "Monkongite",
		spritenum: 0,
		megaStone: { "Monkong": "Monkong-Mega" },
		itemUser: ["Monkong"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3006,
		gen: 9,
		desc: "If held by Monkong, this item allows it to Mega Evolve into Monkong-Mega.",
	},
	pilzogaarite: {
		name: "Pilzogaarite",
		spritenum: 0,
		megaStone: { "Pilzogaar": "Pilzogaar-Mega" },
		itemUser: ["Pilzogaar"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3007,
		gen: 9,
		desc: "If held by Pilzogaar, this item allows it to Mega Evolve into Pilzogaar-Mega.",
	},
	mudruffite: {
		name: "Mudruffite",
		spritenum: 0,
		megaStone: { "Mudruff": "Mudruff-Mega" },
		itemUser: ["Mudruff"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3008,
		gen: 9,
		desc: "If held by Mudruff, this item allows it to Mega Evolve into Mudruff-Mega.",
	},
	fluffoxite: {
		name: "Fluffoxite",
		spritenum: 0,
		megaStone: { "Fluffox": "Fluffox-Mega" },
		itemUser: ["Fluffox"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3009,
		gen: 9,
		desc: "If held by Fluffox, this item allows it to Mega Evolve into Fluffox-Mega.",
	},
	orbitailite: {
		name: "Orbitailite",
		spritenum: 0,
		megaStone: { "Orbitail": "Orbitail-Mega" },
		itemUser: ["Orbitail"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3010,
		gen: 9,
		desc: "If held by Orbitail, this item allows it to Mega Evolve into Orbitail-Mega.",
	},
	gasifernoite: {
		name: "Gasifernoite",
		spritenum: 0,
		megaStone: { "Gasiferno": "Gasiferno-Mega" },
		itemUser: ["Gasiferno"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3011,
		gen: 9,
		desc: "If held by Gasiferno, this item allows it to Mega Evolve into Gasiferno-Mega.",
	},
	rattoromboite: {
		name: "Rattoromboite",
		spritenum: 0,
		megaStone: { "Rattorombo": "Rattorombo-Mega" },
		itemUser: ["Rattorombo"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3012,
		gen: 9,
		desc: "If held by Rattorombo, this item allows it to Mega Evolve into Rattorombo-Mega.",
	},
	butterkekselite: {
		name: "Butterkekselite",
		spritenum: 0,
		megaStone: { "Butterkeksel": "Butterkeksel-Mega" },
		itemUser: ["Butterkeksel"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3013,
		gen: 9,
		desc: "If held by Butterkeksel, this item allows it to Mega Evolve into Butterkeksel-Mega.",
	},
	quakongite: {
		name: "Quakongite",
		spritenum: 0,
		megaStone: { "Quakong": "Quakong-Mega" },
		itemUser: ["Quakong"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3014,
		gen: 9,
		desc: "If held by Quakong, this item allows it to Mega Evolve into Quakong-Mega.",
	},
	pterockite: {
		name: "Pterockite",
		spritenum: 0,
		megaStone: { "Pterock": "Pterock-Mega" },
		itemUser: ["Pterock"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3015,
		gen: 9,
		desc: "If held by Pterock, this item allows it to Mega Evolve into Pterock-Mega.",
	},
	kaktomboxite: {
		name: "Kaktomboxite",
		spritenum: 0,
		megaStone: { "Kaktombox": "Kaktombox-Mega" },
		itemUser: ["Kaktombox"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3016,
		gen: 9,
		desc: "If held by Kaktombox, this item allows it to Mega Evolve into Kaktombox-Mega.",
	},
	tannadelaite: {
		name: "Tannadelaite",
		spritenum: 0,
		megaStone: { "Tannadela": "Tannadela-Mega" },
		itemUser: ["Tannadela"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3017,
		gen: 9,
		desc: "If held by Tannadela, this item allows it to Mega Evolve into Tannadela-Mega.",
	},
	tolithenaite: {
		name: "Tolithenaite",
		spritenum: 0,
		megaStone: { "Tolithena": "Tolithena-Mega" },
		itemUser: ["Tolithena"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3018,
		gen: 9,
		desc: "If held by Tolithena, this item allows it to Mega Evolve into Tolithena-Mega.",
	},
	heliaite: {
		name: "Heliaite",
		spritenum: 0,
		megaStone: { "Helia": "Helia-Mega" },
		itemUser: ["Helia"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3019,
		gen: 9,
		desc: "If held by Helia, this item allows it to Mega Evolve into Helia-Mega.",
	},
	violethraite: {
		name: "Violethraite",
		spritenum: 0,
		megaStone: { "Violethra": "Violethra-Mega" },
		itemUser: ["Violethra"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		isNonstandard: 'Custom',
		num: 3020,
		gen: 9,
		desc: "If held by Violethra, this item allows it to Mega Evolve into Violethra-Mega.",
	},

	// ---------------------------------------------------------------
	// 2. FOOD ITEMS
	// ---------------------------------------------------------------
	sugarberry: {
		name: "Sugar Berry",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Fairy" },
		onUpdate(pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp) pokemon.eatItem();
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
		},
		isNonstandard: 'Custom',
		num: 3101,
		gen: 9,
		desc: "Restores 1/3 max HP when the holder drops to half HP or less.",
	},
	crispycrumb: {
		name: "Crispy Crumb",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Normal" },
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				target.eatItem(true);
				return this.chainModify(0.5);
			}
		},
		onEat() {},
		isNonstandard: 'Custom',
		num: 3102,
		gen: 9,
		desc: "Halves the damage of one super effective hit, then is eaten.",
	},
	honeydrop: {
		name: "Honey Drop",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Bug" },
		onUpdate(pokemon) {
			if (pokemon.status) pokemon.eatItem();
		},
		onEat(pokemon) {
			pokemon.cureStatus();
		},
		isNonstandard: 'Custom',
		num: 3103,
		gen: 9,
		desc: "Cures the holder's status condition when it gets one.",
	},
	spicywrap: {
		name: "Spicy Wrap",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Fire" },
		onUpdate(pokemon) {
			if (pokemon.hp * 4 <= pokemon.maxhp) pokemon.eatItem();
		},
		onEat(pokemon) {
			this.boost({ atk: 2 }, pokemon, pokemon);
		},
		isNonstandard: 'Custom',
		num: 3104,
		gen: 9,
		desc: "Raises Attack by 2 when the holder falls to 1/4 max HP or less.",
	},
	frostcone: {
		name: "Frost Cone",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Ice" },
		onUpdate(pokemon) {
			if (pokemon.hp * 4 <= pokemon.maxhp) pokemon.eatItem();
		},
		onEat(pokemon) {
			this.boost({ spa: 2 }, pokemon, pokemon);
		},
		isNonstandard: 'Custom',
		num: 3105,
		gen: 9,
		desc: "Raises Sp. Atk by 2 when the holder falls to 1/4 max HP or less.",
	},
	nectarvial: {
		name: "Nectar Vial",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Grass" },
		onUpdate(pokemon) {
			if (pokemon.hp * 4 <= pokemon.maxhp) pokemon.eatItem();
		},
		onEat(pokemon) {
			this.boost({ spe: 2 }, pokemon, pokemon);
		},
		isNonstandard: 'Custom',
		num: 3106,
		gen: 9,
		desc: "Raises Speed by 2 when the holder falls to 1/4 max HP or less.",
	},
	roastednut: {
		name: "Roasted Nut",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Ground" },
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp < pokemon.maxhp) this.heal(pokemon.baseMaxhp / 16);
		},
		onEat() {},
		isNonstandard: 'Custom',
		num: 3107,
		gen: 9,
		desc: "Restores 1/16 max HP each turn. Is not consumed.",
	},
	jellycup: {
		name: "Jelly Cup",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Water" },
		onUpdate(pokemon) {
			if (pokemon.hp * 2 <= pokemon.maxhp) pokemon.eatItem();
		},
		onEat(pokemon) {
			this.boost({ def: 1, spd: 1 }, pokemon, pokemon);
		},
		isNonstandard: 'Custom',
		num: 3108,
		gen: 9,
		desc: "Raises Defense and Sp. Def by 1 at half HP or less.",
	},
	herbloaf: {
		name: "Herb Loaf",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Poison" },
		onUpdate(pokemon) {
			if (pokemon.volatiles['confusion']) pokemon.eatItem();
		},
		onEat(pokemon) {
			pokemon.removeVolatile('confusion');
			this.heal(pokemon.baseMaxhp / 4, pokemon);
		},
		isNonstandard: 'Custom',
		num: 3109,
		gen: 9,
		desc: "Cures confusion and restores 1/4 max HP.",
	},
	moonpetal: {
		name: "Moon Petal",
		spritenum: 0,
		isBerry: true,
		naturalGift: { basePower: 80, type: "Ghost" },
		onUpdate(pokemon) {
			if (pokemon.effectiveWeather() === 'fullmoon') pokemon.eatItem();
		},
		onEat(pokemon) {
			this.boost({ spa: 1, spd: 1 }, pokemon, pokemon);
		},
		isNonstandard: 'Custom',
		num: 3110,
		gen: 9,
		desc: "Raises Sp. Atk and Sp. Def by 1 under Full Moon.",
	},

	// ---------------------------------------------------------------
	// 3. UTILITY ITEMS
	// ---------------------------------------------------------------
	lunarrock: {
		name: "Lunar Rock",
		spritenum: 0,
		// The extension itself lives in the fullmoon condition's durationCallback.
		isNonstandard: 'Custom',
		num: 3201,
		gen: 9,
		desc: "Extends Full Moon set by the holder from 5 to 8 turns.",
	},
	braceband: {
		name: "Brace Band",
		spritenum: 0,
		onModifyAtkPriority: 1,
		onModifyAtk(atk) {
			return this.chainModify(1.4);
		},
		onDisableMove(pokemon) {
			if (!pokemon.lastMove || pokemon.volatiles['dynamax']) return;
			for (const slot of pokemon.moveSlots) {
				if (slot.id !== pokemon.lastMove.id) pokemon.disableMove(slot.id, false);
			}
		},
		isChoice: true,
		isNonstandard: 'Custom',
		num: 3202,
		gen: 9,
		desc: "1.4x Attack, but the holder is locked into its first move.",
	},
	focuslens: {
		name: "Focus Lens",
		spritenum: 0,
		onModifySpAPriority: 1,
		onModifySpA(spa) {
			return this.chainModify(1.4);
		},
		onDisableMove(pokemon) {
			if (!pokemon.lastMove || pokemon.volatiles['dynamax']) return;
			for (const slot of pokemon.moveSlots) {
				if (slot.id !== pokemon.lastMove.id) pokemon.disableMove(slot.id, false);
			}
		},
		isChoice: true,
		isNonstandard: 'Custom',
		num: 3203,
		gen: 9,
		desc: "1.4x Sp. Atk, but the holder is locked into its first move.",
	},
	swiftsash: {
		name: "Swift Sash",
		spritenum: 0,
		onModifySpe(spe) {
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.lastMove || pokemon.volatiles['dynamax']) return;
			for (const slot of pokemon.moveSlots) {
				if (slot.id !== pokemon.lastMove.id) pokemon.disableMove(slot.id, false);
			}
		},
		isChoice: true,
		isNonstandard: 'Custom',
		num: 3204,
		gen: 9,
		desc: "1.5x Speed, but the holder is locked into its first move.",
	},
	guardplate: {
		name: "Guard Plate",
		spritenum: 0,
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) return this.chainModify(0.75);
		},
		isNonstandard: 'Custom',
		num: 3205,
		gen: 9,
		desc: "Super effective hits deal 25% less damage to the holder.",
	},
	survivorband: {
		name: "Survivor Band",
		spritenum: 0,
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect?.effectType === 'Move') {
				if (target.useItem()) return target.hp - 1;
			}
		},
		isNonstandard: 'Custom',
		num: 3206,
		gen: 9,
		desc: "Once, if the holder is at full HP, it survives a KO with 1 HP.",
	},
	echoamplifier: {
		name: "Echo Amplifier",
		spritenum: 0,
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.flags['sound']) return this.chainModify(1.3);
		},
		isNonstandard: 'Custom',
		num: 3207,
		gen: 9,
		desc: "The holder's sound moves deal 30% more damage.",
	},
	weightedcore: {
		name: "Weighted Core",
		spritenum: 0,
		onModifyWeight(weighthg) {
			return weighthg * 2;
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.basePowerCallback) return this.chainModify(1.2);
		},
		isNonstandard: 'Custom',
		num: 3208,
		gen: 9,
		desc: "Doubles the holder's weight; its weight-based moves hit 20% harder.",
	},
	fieldprism: {
		name: "Field Prism",
		spritenum: 0,
		onBasePowerPriority: 15,
		onBasePower(basePower, user) {
			if (this.field.terrain) return this.chainModify(1.3);
		},
		isNonstandard: 'Custom',
		num: 3209,
		gen: 9,
		desc: "The holder's moves deal 30% more damage while a terrain is active.",
	},
	megacharm: {
		name: "Mega Charm",
		spritenum: 0,
		onAfterMega(pokemon) {
			this.boost({ spe: 1 }, pokemon, pokemon, this.dex.items.get('megacharm'));
		},
		isNonstandard: 'Custom',
		num: 3210,
		gen: 9,
		desc: "Raises Speed by 1 when the holder Mega Evolves (works without a stone).",
	},
};
