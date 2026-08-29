export interface TagData {
	name: string;
	speciesFilter?: (species: Species) => boolean;
	moveFilter?: (move: Move) => boolean;
	genericFilter?: (thing: Species | Move | Item | Ability) => boolean;
	speciesNumCol?: (species: Species) => number;
	moveNumCol?: (move: Move) => number;
	genericNumCol?: (thing: Species | Move | Item | Ability) => number;
}

export const Tags: { [id: IDEntry]: TagData } = {
	// Categories
	// ----------
	physical: {
		name: "Physical",
		moveFilter: move => move.category === 'Physical',
	},
	special: {
		name: "Special",
		moveFilter: move => move.category === 'Special',
	},
	status: {
		name: "Status",
		moveFilter: move => move.category === 'Status',
	},

	// Pokemon tags
	// ------------
	mega: {
		name: "Mega",
		speciesFilter: species => !!species.isMega,
	},
	gigantamax: {
		name: "Gigantamax",
		speciesFilter: species => !!species.placeholderFor,
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
	ultrabeast: {
		name: "Ultra Beast",
		speciesFilter: species => species.tags.includes("Ultra Beast"),
	},
	paradox: {
		name: "Paradox",
		speciesFilter: species => species.tags.includes("Paradox"),
	},
	pokestar: {
		name: "Pokestar",
		speciesFilter: species => species.tags.includes("Pokestar"),
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
		moveFilter: move => 'contact' in move.flags,
	},
	sound: {
		name: "Sound",
		moveFilter: move => 'sound' in move.flags,
	},
	powder: {
		name: "Powder",
		moveFilter: move => 'powder' in move.flags,
	},
	fist: {
		name: "Fist",
		moveFilter: move => 'punch' in move.flags,
	},
	pulse: {
		name: "Pulse",
		moveFilter: move => 'pulse' in move.flags,
	},
	bite: {
		name: "Bite",
		moveFilter: move => 'bite' in move.flags,
	},
	bullet: {
		name: "Bullet",
		moveFilter: move => 'bullet' in move.flags,
	},
	dance: {
		name: "Dance",
		moveFilter: move => 'dance' in move.flags,
	},
	slicing: {
		name: "Slicing",
		moveFilter: move => 'slicing' in move.flags,
	},
	wind: {
		name: "Wind",
		moveFilter: move => 'wind' in move.flags,
	},
	bypassprotect: {
		name: "Bypasses Protect",
		moveFilter: move => move.target !== 'self' && !('protect' in move.flags),
	},
	nonreflectable: {
		name: "Nonreflectable",
		moveFilter: move => move.target !== 'self' && move.category === 'Status' && !('reflectable' in move.flags),
	},
	nonmirror: {
		name: "Nonmirror",
		moveFilter: move => move.target !== 'self' && !('mirror' in move.flags),
	},
	nonsnatchable: {
		name: "Nonsnatchable",
		moveFilter: move => ['allyTeam', 'self', 'adjacentAllyOrSelf'].includes(move.target) && !('snatch' in move.flags),
	},
	bypasssubstitute: {
		name: "Bypasses Substitutes",
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
		speciesFilter: species => species.tier === 'Uber' || species.tier === 'AG' || species.tier === '(AG)',
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
		speciesFilter: species => species.tier === 'PU',
	},
	zubl: {
		name: "ZUBL",
		speciesFilter: species => species.tier === 'ZUBL',
	},
	zu: {
		name: "ZU",
		speciesFilter: species => species.tier === 'ZU',
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
		speciesFilter: species => species.tier === 'AG' || species.tier === '(AG)',
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
		speciesFilter: species => species.natDexTier === 'AG' || species.natDexTier === '(AG)',
	},
	nduber: {
		name: "ND Uber",
		speciesFilter: species => species.natDexTier === 'Uber',
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
	ndnfe: {
		name: "ND NFE",
		speciesFilter: species => species.natDexTier === 'NFE',
	},
	ndlc: {
		name: "ND LC",
		speciesFilter: species => species.natDexTier === 'LC',
	},

	// Legality tags
	past: {
		name: "Past",
		genericFilter: thing => thing.isNonstandard === 'Past',
	},
	truepast: {
		name: "True Past",
		genericFilter: thing => !!thing.tags?.includes("True Past"),
	},
	pastunobtainable: {
		name: "Past Unobtainable",
		genericFilter: thing => !!thing.tags?.includes("Past Unobtainable"),
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
		genericFilter: thing => thing.isNonstandard === 'CAP',
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
		speciesNumCol: species => species.baseStats.hp,
	},
	atk: {
		name: "Atk",
		speciesNumCol: species => species.baseStats.atk,
	},
	def: {
		name: "Def",
		speciesNumCol: species => species.baseStats.def,
	},
	spa: {
		name: "SpA",
		speciesNumCol: species => species.baseStats.spa,
	},
	spd: {
		name: "SpD",
		speciesNumCol: species => species.baseStats.spd,
	},
	spe: {
		name: "Spe",
		speciesNumCol: species => species.baseStats.spe,
	},
	bst: {
		name: "BST",
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
