export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
	// Initial tier seed carries forward the established gen3mega safety boundary,
	// then adds DPP's own Uber bases. New Gen 4 formes start conservatively when
	// their closest local evidence is Uber or their base ability is OU-banned.
	// This is a launch boundary for playtesting, not a solved balance claim.

	// Gen 1
	venusaurmega: { tier: "OU" },
	charizardmegax: { tier: "OU" },
	charizardmegay: { tier: "Uber" },
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
	salamencemega: { tier: "AG" },
	metagrossmega: { tier: "Uber" },
	latiasmega: { tier: "Uber" },
	latiosmega: { tier: "Uber" },
	kyogreprimal: { tier: "Uber" },
	groudonprimal: { tier: "Uber" },

	// Gen 4
	staraptormega: { tier: "OU" },
	lopunnymega: { tier: "OU" },
	garchompmega: { tier: "Uber" },
	lucariomega: { tier: "Uber" },
	abomasnowmega: { tier: "OU" },
	gallademega: { tier: "OU" },
	// Base Froslass can only have Snow Cloak in DPP, which the OU rules ban.
	// Keep its Mega in Ubers rather than creating a stone-specific loophole that
	// lets an unevolved Froslass retain the banned ability.
	froslassmega: { tier: "Uber" },
};
