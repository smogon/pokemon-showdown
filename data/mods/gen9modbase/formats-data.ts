// Shared base layer for the fork's custom content mods (see data/custom-mods.ts).
//
// Every fakemon mod inherits from this mod rather than from 'base' directly, so that data both mods
// need identically lives in one place instead of being copied into each of them.
//
// What belongs here: base-game tier corrections that any mod's National Dex format depends on.
// What does not: anything specific to one mod's content or balance philosophy — that stays in the
// mod's own folder.
//
// ── Champions Mega Evolutions ────────────────────────────────────────────────
// Base data marks these 'natDexTier: "Illegal"', so 'NatDex Mod' rejects them outright and no
// amount of '+Future' in a format will let them through. Giving them a real National Dex tier is
// what makes them usable in the mods' National Dex and VGC formats.

export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
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
	floetteeternal: {
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
	dragalgemega: {
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
	skarmorymega: {
		inherit: true,
		natDexTier: "OU",
	},
};
