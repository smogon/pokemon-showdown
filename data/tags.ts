interface TagData {
	name: string;
	desc?: string;
	speciesFilter?: (species: Species) => boolean;
	moveFilter?: (move: Move) => boolean;
	genericFilter?: (thing: Species | Move | Item | Ability) => boolean;
	speciesNumCol?: (species: Species) => number;
	moveNumCol?: (move: Move) => number;
	genericNumCol?: (thing: Species | Move | Item | Ability) => number;
}

export const Tags: {[id: string]: TagData} = {
	// Categories
	// ----------
	physical: {
		name: "Physical",
		desc: "Move deals damage with the Attack and Defense stats.",
		moveFilter: move => move.category === 'Physical',
	},
	special: {
		name: "Special",
		desc: "Move deals damage with the Special Attack and Special Defense stats.",
		moveFilter: move => move.category === 'Special',
	},
	status: {
		name: "Status",
		desc: "Move does not deal damage.",
		moveFilter: move => move.category === 'Status',
	},

	// Pokemon tags
	// ------------
	mega: {
		name: "Mega",
		speciesFilter: species => !!species.isMega,
	},
	mythical: {
		name: "Mythical",
		speciesFilter: species => species.tags.includes("Mythical"),
	},
	sublegendary: {
		name: "Sub-Legendary",
		speciesFilter: species => species.tags.includes("Sub-Legendary"),
	},
	restrictedlegendary: {
		name: "Restricted Legendary",
		speciesFilter: species => species.tags.includes("Restricted Legendary"),
	},
	paradox: {
		name: "Paradox",
		speciesFilter: species => species.tags.includes("Paradox"),
	},

	// Move tags
	// ---------
	zmove: {
		name: "Z-Move",
		moveFilter: move => !!move.isZ,
	},
	maxmove: {
		name: "Max Move",
		moveFilter: move => !!move.isMax,
	},
	contact: {
		name: "Contact",
		desc: "Affected by a variety of moves, abilities, and items. Moves affected by contact moves include: Spiky Shield, King's Shield. Abilities affected by contact moves include: Iron Barbs, Rough Skin, Gooey, Flame Body, Static, Tough Claws. Items affected by contact moves include: Rocky Helmet, Sticky Barb.",
		moveFilter: move => 'contact' in move.flags,
	},
	sound: {
		name: "Sound",
		desc: "Doesn't affect Soundproof Pokémon. (All sound moves also bypass Substitute.)",
		moveFilter: move => 'sound' in move.flags,
	},
	powder: {
		name: "Powder",
		desc: "Doesn't affect Grass-type Pokémon, Overcoat Pokémon, or Safety Goggles holders.",
		moveFilter: move => 'powder' in move.flags,
	},
	fist: {
		name: "Fist",
		desc: "Boosted 1.2x by Iron Fist.",
		moveFilter: move => 'punch' in move.flags,
	},
	pulse: {
		name: "Pulse",
		desc: "Boosted 1.5x by Mega Launcher.",
		moveFilter: move => 'pulse' in move.flags,
	},
	bite: {
		name: "Bite",
		desc: "Boosted 1.5x by Strong Jaw.",
		moveFilter: move => 'bite' in move.flags,
	},
	ballistic: {
		name: "Ballistic",
		desc: "Doesn't affect Bulletproof Pokémon.",
		moveFilter: move => 'bullet' in move.flags,
	},
	bypassprotect: {
		name: "Bypass Protect",
		desc: "Bypasses Protect, Detect, King's Shield, and Spiky Shield.",
		moveFilter: move => move.target !== 'self' && !('protect' in move.flags),
	},
	nonreflectable: {
		name: "Nonreflectable",
		desc: "Can't be bounced by Magic Coat or Magic Bounce.",
		moveFilter: move => move.target !== 'self' && move.category === 'Status' && !('reflectable' in move.flags),
	},
	nonmirror: {
		name: "Nonmirror",
		desc: "Can't be copied by Mirror Move.",
		moveFilter: move => move.target !== 'self' && !('mirror' in move.flags),
	},
	nonsnatchable: {
		name: "Nonsnatchable",
		desc: "Can't be copied by Snatch.",
		moveFilter: move => ['allyTeam', 'self', 'adjacentAllyOrSelf'].includes(move.target) && !('snatch' in move.flags),
	},
	bypasssubstitute: {
		name: "Bypass Substitute",
		desc: "Bypasses but does not break a Substitute.",
		moveFilter: move => 'bypasssub' in move.flags,
	},
	gmaxmove: {
		name: "G-Max Move",
		moveFilter: move => typeof move.isMax === 'string',
	},

	// Tiers
	// -----
	uber: {
		name: "Uber",
		speciesFilter: species => species.tier === 'Uber' || species.tier === '(Uber)' || species.tier === 'AG',
	},
	ou: {
		name: "OU",
		speciesFilter: species => species.tier === 'OU' || species.tier === '(OU)',
	},
	uubl: {
		name: "UUBL",
		speciesFilter: species => species.tier === 'UUBL',
	},
	uu: {
		name: "UU",
		speciesFilter: species => species.tier === 'UU',
	},
	rubl: {
		name: "RUBL",
		speciesFilter: species => species.tier === 'RUBL',
	},
	ru: {
		name: "RU",
		speciesFilter: species => species.tier === 'RU',
	},
	nubl: {
		name: "NUBL",
		speciesFilter: species => species.tier === 'NUBL',
	},
	nu: {
		name: "NU",
		speciesFilter: species => species.tier === 'NU',
	},
	publ: {
		name: "PUBL",
		speciesFilter: species => species.tier === 'PUBL',
	},
	pu: {
		name: "PU",
		speciesFilter: species => species.tier === 'PU' || species.tier === '(NU)',
	},
	zu: {
		name: "ZU",
		speciesFilter: species => species.tier === '(PU)',
	},
	nfe: {
		name: "NFE",
		speciesFilter: species => species.tier === 'NFE',
	},
	lc: {
		name: "LC",
		speciesFilter: species => species.doublesTier === 'LC',
	},
	captier: {
		name: "CAP Tier",
		speciesFilter: species => species.isNonstandard === 'CAP',
	},
	caplc: {
		name: "CAP LC",
		speciesFilter: species => species.tier === 'CAP LC',
	},
	capnfe: {
		name: "CAP NFE",
		speciesFilter: species => species.tier === 'CAP NFE',
	},
	ag: {
		name: "AG",
		speciesFilter: species => species.tier === 'AG',
	},

	// Doubles tiers
	// -------------
	duber: {
		name: "DUber",
		speciesFilter: species => species.doublesTier === 'DUber' || species.doublesTier === '(DUber)',
	},
	dou: {
		name: "DOU",
		speciesFilter: species => species.doublesTier === 'DOU' || species.doublesTier === '(DOU)',
	},
	dbl: {
		name: "DBL",
		speciesFilter: species => species.doublesTier === 'DBL',
	},
	duu: {
		name: "DUU",
		speciesFilter: species => species.doublesTier === 'DUU',
	},
	dnu: {
		name: "DNU",
		speciesFilter: species => species.doublesTier === '(DUU)',
	},

	// Nat Dex tiers
	// -------------
	ndag: {
		name: "ND AG",
		speciesFilter: species => species.natDexTier === 'AG',
	},
	nduber: {
		name: "ND Uber",
		speciesFilter: species => species.natDexTier === 'Uber' || species.natDexTier === '(Uber)',
	},
	ndou: {
		name: "ND OU",
		speciesFilter: species => species.natDexTier === 'OU' || species.natDexTier === '(OU)',
	},
	nduubl: {
		name: "ND UUBL",
		speciesFilter: species => species.natDexTier === 'UUBL',
	},
	nduu: {
		name: "ND UU",
		speciesFilter: species => species.natDexTier === 'UU',
	},
	ndrubl: {
		name: "ND RUBL",
		speciesFilter: species => species.natDexTier === 'RUBL',
	},
	ndru: {
		name: "ND RU",
		speciesFilter: species => species.natDexTier === 'RU',
	},

	// Legality tags
	past: {
		name: "Past",
		genericFilter: thing => thing.isNonstandard === 'Past',
	},
	future: {
		name: "Future",
		genericFilter: thing => thing.isNonstandard === 'Future',
	},
	lgpe: {
		name: "LGPE",
		genericFilter: thing => thing.isNonstandard === 'LGPE',
	},
	unobtainable: {
		name: "Unobtainable",
		genericFilter: thing => thing.isNonstandard === 'Unobtainable',
	},
	cap: {
		name: "CAP",
		speciesFilter: thing => thing.isNonstandard === 'CAP',
	},
	custom: {
		name: "Custom",
		genericFilter: thing => thing.isNonstandard === 'Custom',
	},
	nonexistent: {
		name: "Nonexistent",
		genericFilter: thing => !!thing.isNonstandard && thing.isNonstandard !== 'Unobtainable',
	},

	// filter columns
	// --------------
	introducedgen: {
		name: "Introduced Gen",
		genericNumCol: thing => thing.gen,
	},

	height: {
		name: "Height",
		speciesNumCol: species => species.heightm,
	},
	weight: {
		name: "Weight",
		speciesNumCol: species => species.weightkg,
	},
	hp: {
		name: "HP",
		desc: "Hit Points",
		speciesNumCol: species => species.baseStats.hp,
	},
	atk: {
		name: "Atk",
		desc: "Attack",
		speciesNumCol: species => species.baseStats.atk,
	},
	def: {
		name: "Def",
		desc: "Defense",
		speciesNumCol: species => species.baseStats.def,
	},
	spa: {
		name: "SpA",
		desc: "Special Attack",
		speciesNumCol: species => species.baseStats.spa,
	},
	spd: {
		name: "SpD",
		desc: "Special Defense",
		speciesNumCol: species => species.baseStats.spd,
	},
	spe: {
		name: "Spe",
		desc: "Speed",
		speciesNumCol: species => species.baseStats.spe,
	},
	bst: {
		name: "BST",
		desc: "Base Stat Total",
		speciesNumCol: species => species.bst,
	},

	basepower: {
		name: "Base Power",
		moveNumCol: move => move.basePower,
	},
	priority: {
		name: "Priority",
		moveNumCol: move => move.priority,
	},
	accuracy: {
		name: "Accuracy",
		moveNumCol: move => move.accuracy === true ? 101 : move.accuracy,
	},
	maxpp: {
		name: "Max PP",
		moveNumCol: move => move.pp,
	},
};
