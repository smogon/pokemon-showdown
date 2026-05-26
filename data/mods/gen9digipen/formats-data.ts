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
	mojamas: {
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
		inherit: true,
		natDexTier: "OU",
	},
	barbaraclemega: {
		inherit: true,
		natDexTier: "OU",
	},
	baxcaliburmega: {
		inherit: true,
		natDexTier: "OU",
	},
	chandeluremega: {
		inherit: true,
		natDexTier: "OU",
	},
	chesnaughtmega: {
		inherit: true,
		natDexTier: "OU",
	},
	chimechomega: {
		inherit: true,
		natDexTier: "OU",
	},
	clefablemega: {
		inherit: true,
		natDexTier: "OU",
	},
	crabominablemega: {
		inherit: true,
		natDexTier: "OU",
	},
	darkraimega: {
		inherit: true,
		natDexTier: "OU",
	},
	delphoxmega: {
		inherit: true,
		natDexTier: "OU",
	},
	dragonitemega: {
		inherit: true,
		natDexTier: "OU",
	},
	drampamega: {
		inherit: true,
		natDexTier: "OU",
	},
	eelektrossmega: {
		inherit: true,
		natDexTier: "OU",
	},
	emboarmega: {
		inherit: true,
		natDexTier: "OU",
	},
	excadrillmega: {
		inherit: true,
		natDexTier: "OU",
	},
	falinksmega: {
		inherit: true,
		natDexTier: "OU",
	},
	feraligatrmega: {
		inherit: true,
		natDexTier: "OU",
	},
	floettemega: {
		inherit: true,
		natDexTier: "OU",
	},
	froslassmega: {
		inherit: true,
		natDexTier: "OU",
	},
	garchompmegaz: {
		inherit: true,
		natDexTier: "OU",
	},
	glimmoramega: {
		inherit: true,
		natDexTier: "OU",
	},
	golisopodmega: {
		inherit: true,
		natDexTier: "OU",
	},
	golurkmega: {
		inherit: true,
		natDexTier: "OU",
	},
	greninjamega: {
		inherit: true,
		natDexTier: "OU",
	},
	hawluchamega: {
		inherit: true,
		natDexTier: "OU",
	},
	heatranmega: {
		inherit: true,
		natDexTier: "OU",
	},
	lucariomegaz: {
		inherit: true,
		natDexTier: "OU",
	},
	magearnamega: {
		inherit: true,
		natDexTier: "OU",
	},
	malamarmega: {
		inherit: true,
		natDexTier: "OU",
	},
	meganiummega: {
		inherit: true,
		natDexTier: "OU",
	},
	meowsticfmega: {
		inherit: true,
		natDexTier: "OU",
	},
	meowsticmmega: {
		inherit: true,
		natDexTier: "OU",
	},
	pyroarmega: {
		inherit: true,
		natDexTier: "OU",
	},
	raichumegax: {
		inherit: true,
		natDexTier: "OU",
	},
	raichumegay: {
		inherit: true,
		natDexTier: "OU",
	},
	staraptormega: {
		inherit: true,
		natDexTier: "OU",
	},
	starmiemega: {
		inherit: true,
		natDexTier: "OU",
	},
	tatsugiricurlymega: {
		inherit: true,
		natDexTier: "OU",
	},
	tatsugiridroopymega: {
		inherit: true,
		natDexTier: "OU",
	},
	tatsugiristretchymega: {
		inherit: true,
		natDexTier: "OU",
	},
	victreebelmega: {
		inherit: true,
		natDexTier: "OU",
	},
	zeraoramega: {
		inherit: true,
		natDexTier: "OU",
	},
	zygardemega: {
		inherit: true,
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
