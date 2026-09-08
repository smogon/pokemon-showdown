export const TagsText: { [id: string]: TagText } = {
	physical: {
		name: "Physical",
		desc: "Move deals damage with the Attack and Defense stats.",
	},
	special: {
		name: "Special",
		desc: "Move deals damage with the Special Attack and Special Defense stats.",
	},
	status: {
		name: "Status",
		desc: "Move does not deal damage.",
	},
	mega: {
		name: "Mega",
	},
	gigantamax: {
		name: "Gigantamax",
	},
	mythical: {
		name: "Mythical",
		desc: "Legendaries usually only obtainable from events. Usually BST 600",
	},
	sublegendary: {
		name: "Sub-Legendary",
		desc: "Legendaries that aren't Restricted or Mythical. Usually BST 570 to 580.",
	},
	restrictedlegendary: {
		name: "Restricted Legendary",
		desc: "Officially called Special Pokémon. Legendaries restricted from most in-game formats. Usually BST at least 660.",
	},
	ultrabeast: {
		name: "Ultra Beast",
	},
	paradox: {
		name: "Paradox",
	},
	pokestar: {
		name: "Pokestar",
	},
	zmove: {
		name: "Z-Move",
	},
	maxmove: {
		name: "Max Move",
	},
	contact: {
		name: "Contact",
		hint: "triggers Iron Barbs, Spiky Shield, etc",
		desc: "Affected by a variety of moves, abilities, and items. Moves affected by contact moves include: Spiky Shield, King's Shield. Abilities affected by contact moves include: Iron Barbs, Rough Skin, Gooey, Flame Body, Static, Tough Claws. Items affected by contact moves include: Rocky Helmet, Sticky Barb.",
	},
	sound: {
		name: "Sound",
		hint: "doesn't affect Soundproof pokemon",
		desc: "Doesn't affect Soundproof Pokémon. (All sound moves also bypass Substitute.)",
	},
	powder: {
		name: "Powder",
		hint: "doesn't affect Grass, Overcoat, Safety Goggles",
		desc: "Doesn't affect Grass-type Pokémon, Overcoat Pokémon, or Safety Goggles holders.",
	},
	fist: {
		name: "Fist",
		hint: "boosted by Iron Fist",
		desc: "Boosted 1.2x by Iron Fist.",
	},
	pulse: {
		name: "Pulse",
		hint: "boosted by Mega Launcher",
		desc: "Boosted 1.5x by Mega Launcher.",
	},
	bite: {
		name: "Bite",
		hint: "boosted by Strong Jaw",
		desc: "Boosted 1.5x by Strong Jaw.",
	},
	bullet: {
		name: "Bullet",
		hint: "doesn't affect Bulletproof pokemon",
		desc: "Doesn't affect Bulletproof Pokémon.",
	},
	dance: {
		name: "Dance",
		desc: "Copied by Dancer.",
	},
	slicing: {
		name: "Slicing",
		hint: "boosted by Sharpness",
		desc: "Boosted 1.5x by Sharpness.",
	},
	wind: {
		name: "Wind",
		hint: "activates Wind Power and Wind Rider",
		desc: "Activates Wind Power and Wind Rider.",
	},
	defrost: {
		name: "Defrost",
		hint: "the user thaws out if it is frozen",
	},
	recoil: {
		name: "Recoil",
		hint: "boosted by Reckless",
	},
	twoturnmove: {
		name: "Two-turn move",
	},
	recharge: {
		name: "Has Recharge Turn",
	},
	suppressedbygravity: {
		name: "Suppressed by Gravity",
	},
	boostedbysheerforce: {
		name: "Boosted by Sheer Force",
	},
	bypassprotect: {
		name: "Bypasses Protect",
		hint: "and Detect, King's Shield, Spiky Shield",
		desc: "Bypasses Protect, Detect, King's Shield, and Spiky Shield.",
	},
	nonreflectable: {
		name: "Bypasses Magic Bounce",
		hint: "and Magic Coat",
		desc: "Can't be bounced by Magic Coat or Magic Bounce.",
	},
	nonmirror: {
		name: "Not Mirrorable",
		desc: "Can't be copied by Mirror Move.",
	},
	nonsnatchable: {
		name: "Not Snatchable",
		desc: "Can't be copied by Snatch.",
	},
	bypasssubstitute: {
		name: "Bypasses Substitutes",
		hint: "but does not break it",
		desc: "Bypasses but does not break a Substitute.",
	},
	gmaxmove: {
		name: "G-Max Move",
	},
	past: {
		name: "Past",
		desc: "Obtainable in a past game, but not in this game.",
	},
	truepast: {
		name: "True Past",
		desc: "Obtainable in a past game, but is not in this game's data at all, not even in Dexit placeholder form.",
	},
	pastunobtainable: {
		name: "Past Unobtainable",
		desc: "Existed in game data in a past game, but was never obtainable.",
	},
	future: {
		name: "Future",
		desc: "Obtainable in a future game, but is not in this game's data at all.",
	},
	lgpe: {
		name: "LGPE",
		desc: "Obtainable in Pokémon: Let's Go, Pikachu! or Let's Go, Eevee!, but not in this game.",
	},
	unobtainable: {
		name: "Unobtainable",
		desc: "Exists in game data but not obtainable without hacking.",
	},
	cap: {
		name: "CAP",
		desc: "Made up for the Smogon Create-A-Pokemon project.",
	},
	custom: {
		name: "Custom",
		desc: "Made up for... something or other. I don't recommend using this, it's not tagged very consistently.",
	},
	nonexistent: {
		name: "Nonexistent",
		desc: "Does not exist in game data. Includes Past, Future, LGPE, CAP, and Custom.",
	},

	// tiers (leave these out of translated versions)
	uber: {
		name: "Uber",
	},
	ou: {
		name: "OU",
	},
	uubl: {
		name: "UUBL",
	},
	uu: {
		name: "UU",
	},
	rubl: {
		name: "RUBL",
	},
	ru: {
		name: "RU",
	},
	nubl: {
		name: "NUBL",
	},
	nu: {
		name: "NU",
	},
	publ: {
		name: "PUBL",
	},
	pu: {
		name: "PU",
	},
	zubl: {
		name: "ZUBL",
	},
	zu: {
		name: "ZU",
	},
	nfe: {
		name: "NFE",
	},
	lc: {
		name: "LC",
	},
	captier: {
		name: "CAP Tier",
	},
	caplc: {
		name: "CAP LC",
	},
	capnfe: {
		name: "CAP NFE",
	},
	ag: {
		name: "AG",
	},
	duber: {
		name: "DUber",
	},
	dou: {
		name: "DOU",
	},
	dbl: {
		name: "DBL",
	},
	duu: {
		name: "DUU",
	},
	dnu: {
		name: "DNU",
	},
	ndag: {
		name: "ND AG",
	},
	nduber: {
		name: "ND Uber",
	},
	ndou: {
		name: "ND OU",
	},
	nduubl: {
		name: "ND UUBL",
	},
	nduu: {
		name: "ND UU",
	},
	ndrubl: {
		name: "ND RUBL",
	},
	ndru: {
		name: "ND RU",
	},
	ndnfe: {
		name: "ND NFE",
	},
	ndlc: {
		name: "ND LC",
	},

	// numeric tags
	introducedgen: {
		name: "Introduced Gen",
	},
	height: {
		name: "Height",
	},
	weight: {
		name: "Weight",
	},
	hp: {
		name: "HP",
		desc: "Hit Points",
	},
	atk: {
		name: "Atk",
		desc: "Attack",
	},
	def: {
		name: "Def",
		desc: "Defense",
	},
	spa: {
		name: "SpA",
		desc: "Special Attack",
	},
	spd: {
		name: "SpD",
		desc: "Special Defense",
	},
	spe: {
		name: "Spe",
		desc: "Speed",
	},
	bst: {
		name: "BST",
		desc: "Base Stat Total",
	},
	basepower: {
		name: "Base power",
	},
	priority: {
		name: "Priority",
	},
	accuracy: {
		name: "Accuracy",
	},
	maxpp: {
		name: "Max PP",
	},
};
