export const Items: {[k: string]: ModdedItemData} = {
	// Aeonic
	noseiumz: {
		name: "Noseium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Shitpost",
		zMoveFrom: "Fissure",
		itemUser: ["Nosepass"],
		gen: 7,
		desc: "If held by a Nosepass with Fissure, it can use Shitpost.",
	},
	// E4 Flint
	magmarizer: {
		inherit: true,
		megaStone: "Steelix-Mega",
		megaEvolves: "Steelix",
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		fling: undefined, // Cannot be flung now since its a mega stone
		desc: "If held by a Steelix, this item allows it to Mega Evolve in battle.",
	},
	// FOMG
	astleyiumz: {
		name: "Astleyium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Rickrollout",
		zMoveFrom: "Rock Slide",
		itemUser: ["Golem"],
		gen: 7,
		desc: "If held by a Golem with Rock Slide, it can use Rickrollout.",
	},
	// inactive
	dusknoiriumz: {
		name: "Dusknoirium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Petrifying Gaze",
		zMoveFrom: "Mean Look",
		itemUser: ["Dusknoir"],
		gen: 7,
		desc: "If held by a Dusknoir with Mean Look, it can use Petrifying Gaze.",
	},
	// Kris
	thunderstone: {
		inherit: true,
		// @ts-ignore
		megaStone: ["Rotom-Wash", "Rotom-Mow", "Rotom-Heat", "Rotom-Frost", "Rotom-Fan"],
		megaEvolves: "Rotom",
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		fling: undefined, // Cannot be flung now since its a mega stone
		desc: "If held by a Rotom, this item allows it to Mega Evolve in battle.",
		shortDesc: "If held by a Rotom, this item allows it to Mega Evolve in battle.",
	},
	// MajorBowman
	victiniumz: {
		name: "Victinium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Blaze of Glory",
		zMoveFrom: "V-create",
		itemUser: ["Victini"],
		gen: 7,
		desc: "If held by a Victini with V-create, it can use Blaze of Glory.",
	},
	// Pohjis
	marowakiumz: {
		name: "Marowakium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Great Eqake",
		zMoveFrom: "Earthquake",
		itemUser: ["Marowak"],
		gen: 7,
		desc: "If held by a Marowak with Earthquake, it can use Great Eqake.",
	},
	// SamJo
	thicciniumz: {
		name: "Thiccinium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Extra T h i c c",
		zMoveFrom: "Thicc",
		itemUser: ["Mamoswine"],
		gen: 7,
		desc: "If held by a Mamoswine with Thicc, it can use Extra T h i c c.",
	},
	// Schiavetto
	mariahcariumz: {
		name: "Mariahcarium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Plurshift",
		zMoveFrom: "Poison Jab",
		itemUser: ["Scolipede"],
		gen: 7,
		desc: "If held by a Scolipede with Poison Jab, it can use Plurshift.",
	},
	// Snaquaza
	fakeclaimiumz: {
		name: "Fakeclaimium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Fake Claim",
		// @ts-ignore hack for Snaquaza's Z move.
		zMoveFrom: ["Brave Bird", "Superpower", "Sucker Punch", "Flamethrower", "Ice Beam", "Thunderbolt"],
		itemUser: ["Honchkrow"],
		gen: 7,
		desc: "If held by a Honchkrow, it can use Fake Claim.",
	},
	// The Immortal
	buzzniumz: {
		name: "Buzznium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Ultra Succ",
		zMoveFrom: "Drain Punch",
		itemUser: ["Buzzwole"],
		gen: 7,
		desc: "If held by a Buzzwole with Drain Punch, it can use Ultra Succ.",
	},
	// Teclis
	darkrainiumz: {
		name: "Darkrainium Z",
		isNonstandard: "Custom",
		onTakeItem: false,
		zMove: "Absolute Configuration",
		zMoveFrom: "Dark Void",
		itemUser: ["Darkrai"],
		gen: 7,
		desc: "If held by a Darkrai with Dark Void, it can use Absolute Configuration.",
	},
	// XpRienzo
	charcoal: {
		inherit: true,
		zMove: "Bleh Flame",
		zMoveFrom: "Blue Flare",
		itemUser: ["Reshiram"],
		desc: "Fire-type attacks have 1.2x power. Reshiram with Blue Flare can use Bleh Flame.",
	},
};
