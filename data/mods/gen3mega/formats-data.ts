export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
	// Mega forms — set tiers so they're legal.
	// Tiering mirrors base form: if the base is OU-legal the Mega is too,
	// unless specifically banned.

	// Gen 1
	venusaurmega: { tier: "OU" },
	charizardmegax: { tier: "OU" },
	charizardmegay: { tier: "OU" },
	blastoisemega: { tier: "OU" },
	beedrillmega: { tier: "OU" },
	pidgeotmega: { tier: "OU" },
	raichumegax: { tier: "OU" },
	raichumegay: { tier: "OU" },
	clefablemega: { tier: "OU" },
	alakazammega: { tier: "OU" },
	victreebelmega: { tier: "OU" },
	slowbromega: { tier: "OU" },
	gengarmega: { tier: "Uber" },
	// Dropped Uber -> OU. The broken Parental Bond + fixed-damage-move combo is
	// complex-banned from [Gen 3] Megas instead (config/formats.ts onValidateSet).
	kangaskhanmega: { tier: "OU" },
	starmiemega: { tier: "OU" },
	pinsirmega: { tier: "OU" },
	gyaradosmega: { tier: "OU" },
	aerodactylmega: { tier: "OU" },
	dragonitemega: { tier: "OU" },
	mewtwomegax: { tier: "Uber" },
	mewtwomegay: { tier: "Uber" },

	// Gen 2
	meganiummega: { tier: "OU" },
	feraligatrmega: { tier: "OU" },
	ampharosmega: { tier: "OU" },
	steelixmega: { tier: "OU" },
	scizormega: { tier: "OU" },
	heracrossmega: { tier: "OU" },
	skarmorymega: { tier: "OU" },
	houndoommega: { tier: "OU" },
	tyranitarmega: { tier: "Uber" },

	// Gen 3
	sceptilemega: { tier: "OU" },
	blazikenmega: { tier: "Uber" },
	swampertmega: { tier: "OU" },
	gardevoirmega: { tier: "OU" },
	sableyemega: { tier: "OU" },
	mawilemega: { tier: "OU" },
	aggronmega: { tier: "OU" },
	medichammega: { tier: "Uber" },
	manectricmega: { tier: "OU" },
	sharpedomega: { tier: "OU" },
	cameruptmega: { tier: "OU" },
	altariamega: { tier: "OU" },
	banettemega: { tier: "OU" },
	chimechomega: { tier: "OU" },
	absolmega: { tier: "OU" },
	glaliemega: { tier: "OU" },
	// Banned to AG (above Ubers): the 'Uber' tag covers AG so it's out of [Gen 3]
	// Megas, and [Gen 3] Megas Ubers bans the 'AG' tag so it's out of there too.
	salamencemega: { tier: "AG" },
	metagrossmega: { tier: "Uber" },
	latiasmega: { tier: "Uber" },
	latiosmega: { tier: "Uber" },

	// Primals
	kyogreprimal: { tier: "Uber" },
	groudonprimal: { tier: "Uber" },
};
