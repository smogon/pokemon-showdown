// DigiPen tier / formats-data definitions.
//
// Every Pokémon defined in pokedex.ts needs an entry here with:
//   - `isNonstandard: "DigiPen" | "DigiPen Future" | "DigiPen Past"` — marks it illegal outside DigiPen formats.
//   - `tier`       — singles / NatDex placement
//
// "DigiPen Future" and "DigiPen Past" are used to mark Pokemon that mechanically/lore-wise should be illegal in
// generation 9 formats. For instance, DigiPen mega-evolutions should be marked as DigiPen Future (or DigiPen Past) 
// since they were reintroduced only in Pokemon Champions. DigiPen Ultrabeasts should
// be marked as DigiPen Past since the Ultrabeasts have not been in games since generation 7.
//
// Valid DigiPen tier strings (defined in TierTypes.Other in sim/global-types.ts):
//   tier / natDexTier : "DigiPen Uber" | "DigiPen" | "DigiPen NFE" | "DigiPen LC"
//   doublesTier       : "DigiPen DUber" | "DigiPen" | "DigiPen NFE" | "DigiPen LC"
// 
// Overriding a base-game Pokémon's tier inside DigiPen formats:
//   Use `inherit: true` + only the fields you want to differ.
//   The base tier is preserved in all non-DigiPen formats.
//	 It makes sense to override the tiers of a buffed Pokemon to OU 
// 	 	to draw attention to the buffs.

export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {

	// ── Fakemon (Original) ─────────────────────────────────────────────
	pootis: {
		isNonstandard: "DigiPen",
		tier: "DigiPen LC",
		doublesTier: "DigiPen LC",
		natDexTier: "DigiPen LC",
	},
	armorobin: {
		isNonstandard: "DigiPen",
		tier: "DigiPen NFE",
		doublesTier: "DigiPen NFE",
		natDexTier: "DigiPen NFE",
	},
	chickiev: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	tineon: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	asymiladi: {
		isNonstandard: "DigiPen Past",
		tier: "Illegal",
		natDexTier: "DigiPen",
	},
	thiriniri: {
		isNonstandard: "DigiPen Past",
		tier: "Illegal",
		natDexTier: "DigiPen",
	},
	technichine: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	exytem: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	frostscales: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	tarantuchas: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	jotabyte: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	mojamas: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	quipsand: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	alteraton: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},

	// ── Fakemon (from Fanart) ─────────────────────────────────────────────

	// ── Forms/Variants ────────────────────────────────────────────────────
	typhlosiondigipen: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},

	// ── Mega Evolutions ────────────────────────────────────────────────────

	hydreigonmega: {
		isNonstandard: "DigiPen Future",
		tier: "Illegal",
		natDexTier: "DigiPen"
	},

	// ── Buff Item Holders ─────────────────────────────────────────────
	sirfetchdarmored: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	sandslasharmored: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	sandslashalolaarmored: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	samurottarmored: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},
	samurotthisuiarmored: {
		isNonstandard: "DigiPen",
		tier: "DigiPen",
		doublesTier: "DigiPen",
		natDexTier: "DigiPen",
	},

	// ── Base-game Pokémon Changes ───────────────────────────────────────
	// Don't forget to add inherit: true
	// Move sufficiently buffed Pokemon to OU 
	abomasnow: {
		inherit: true,
		tier: "UU",
		doublesTier: "DUU",
		natDexTier: "UU",
	},
	abomasnowmega: {
		inherit: true,
		natDexTier: "OU",
	},

	// ── Champions Mega Evolutions ────────────────────────────────────────────
	// Added all to NatDex OU except Zygarde-Mega to NatDex Uber
	absolmegaz: {
		tier: "OU",
		natDexTier: "OU",
	},
	barbaraclemega: {
		tier: "OU",
		natDexTier: "OU",
	},
	baxcaliburmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	chandeluremega: {
		tier: "OU",
		natDexTier: "OU",
	},
	chesnaughtmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	chimechomega: {
		tier: "OU",
		natDexTier: "OU",
	},
	clefablemega: {
		tier: "OU",
		natDexTier: "OU",
	},
	crabominablemega: {
		tier: "OU",
		natDexTier: "OU",
	},
	darkraimega: {
		tier: "OU",
		natDexTier: "OU",
	},
	delphoxmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	dragonitemega: {
		tier: "OU",
		natDexTier: "OU",
	},
	drampamega: {
		tier: "OU",
		natDexTier: "OU",
	},
	eelektrossmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	emboarmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	excadrillmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	falinksmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	feraligatrmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	floetteternal: {
		tier: "OU",
		natDexTier: "OU",
	},
	floettemega: {
		tier: "OU",
		natDexTier: "OU",
	},
	froslassmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	garchompmegaz: {
		tier: "OU",
		natDexTier: "OU",
	},
	glimmoramega: {
		tier: "OU",
		natDexTier: "OU",
	},
	golisopodmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	golurkmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	greninjamega: {
		tier: "OU",
		natDexTier: "OU",
	},
	hawluchamega: {
		tier: "OU",
		natDexTier: "OU",
	},
	heatranmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	lucariomegaz: {
		tier: "OU",
	},
	magearnamega: {
		tier: "OU",
		natDexTier: "OU",
	},
	malamarmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	meganiummega: {
		tier: "OU",
		natDexTier: "OU",
	},
	meowsticfmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	meowsticmmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	pyroarmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	raichumegax: {
		tier: "OU",
		natDexTier: "OU",
	},
	raichumegay: {
		tier: "OU",
		natDexTier: "OU",
	},
	staraptormega: {
		tier: "OU",
		natDexTier: "OU",
	},
	starmiemega: {
		tier: "OU",
		natDexTier: "OU",
	},
	tatsugiricurlymega: {
		tier: "OU",
		natDexTier: "OU",
	},
	tatsugiridroopymega: {
		tier: "OU",
		natDexTier: "OU",
	},
	tatsugiristretchymega: {
		tier: "OU",
		natDexTier: "OU",
	},
	victreebelmega: {
		tier: "OU",
		natDexTier: "OU",
	},
	zeraoramega: {
		tier: "OU",
		natDexTier: "OU",
	},
	zygardemega: {
		tier: "Uber",
		natDexTier: "Uber",
	},

	// ── Unbans ────────────────────────────────────────────────────────────
	// Unbanned all pokemon suspect tested during gen 9
	alakazammega: {
		inherit: true,
		natDexTier: "OU",
	},
	annihilape: {
		inherit: true,
		tier: "OU",
		doublesTier: "DOU",
		natDexTier: "OU",
	},
	archaludon: {
		inherit: true,
		tier: "OU",
		doublesTier: "DOU",
	},
	baxcalibur: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	blastoisemega: {
		inherit: true,
		natDexTier: "OU",
	},
	blazikenmega: {
		inherit: true,
		natDexTier: "OU",
	},
	chienpao: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	chiyu: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	darkrai: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	deoxysspeed: {
		inherit: true,
		natDexTier: "OU",
	},
	dragalgemega: {
		inherit: true,
		natDexTier: "OU",
	},
	dragapult: {
		inherit: true,
		natDexTier: "OU",
	},
	espathra: {
		inherit: true,
		tier: "OU",
		doublesTier: "DOU",
		natDexTier: "OU",
	},
	fluttermane: {
		inherit: true,
		tier: "OU",
		doublesTier: "DOU",
		natDexTier: "OU",
	},
	genesect: {
		inherit: true,
		natDexTier: "OU",
	},
	gougingfire: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	ironbundle: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	kangaskhanmega: {
		inherit: true,
		natDexTier: "OU",
	},
	landorus: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	lucariomega: {
		inherit: true,
		natDexTier: "OU",
	},
	magearna: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	marshadow: {
		inherit: true,
		natDexTier: "OU",
	},
	metagrossmega: {
		inherit: true,
		natDexTier: "OU",
	},
	naganadel: {
		inherit: true,
		natDexTier: "OU",
	},
	ogerponhearthflame: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	palafin: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	pheromosa: {
		inherit: true,
		natDexTier: "OU",
	},
	roaringmoon: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	salamencemega: {
		inherit: true,
		natDexTier: "OU",
	},
	scolipedemega: {
		inherit: true,
		natDexTier: "OU",
	},
	scovillainmega: {
		inherit: true,
		natDexTier: "OU",
	},
	scraftymega: {
		inherit: true,
		natDexTier: "OU",
	},
	shayminsky: {
		inherit: true,
		natDexTier: "OU",
	},
	skarmorymega: {
		inherit: true,
		natDexTier: "OU",
	},
	sneasler: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	spectrier: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	ursalunabloodmoon: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	urshifu: {
		inherit: true,
		tier: "OU",
		doublesTier: "DOU",
		natDexTier: "OU",
	},
	urshifurapidstrike: {
		inherit: true,
		tier: "OU",
		doublesTier: "DOU",
		natDexTier: "OU",
	},
	walkingwake: {
		inherit: true,
		natDexTier: "OU",
	},
	zamazentacrowned: {
		inherit: true,
		tier: "OU",
		natDexTier: "OU",
	},
	zygarde: {
		inherit: true,
		natDexTier: "OU",
	},
};
