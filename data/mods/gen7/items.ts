export const Items: {[k: string]: ModdedItemData} = {
	abomasite: {
		inherit: true,
		isNonstandard: null,
	},
	absolite: {
		inherit: true,
		isNonstandard: null,
	},
	aerodactylite: {
		inherit: true,
		isNonstandard: null,
	},
	aggronite: {
		inherit: true,
		isNonstandard: null,
	},
	aguavberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	alakazite: {
		inherit: true,
		isNonstandard: null,
	},
	altarianite: {
		inherit: true,
		isNonstandard: null,
	},
	aloraichiumz: {
		inherit: true,
		isNonstandard: null,
	},
	ampharosite: {
		inherit: true,
		isNonstandard: null,
	},
	armorfossil: {
		inherit: true,
		isNonstandard: null,
	},
	audinite: {
		inherit: true,
		isNonstandard: null,
	},
	banettite: {
		inherit: true,
		isNonstandard: null,
	},
	beedrillite: {
		inherit: true,
		isNonstandard: null,
	},
	belueberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	blastoisinite: {
		inherit: true,
		isNonstandard: null,
	},
	blazikenite: {
		inherit: true,
		isNonstandard: null,
	},
	blueorb: {
		inherit: true,
		isNonstandard: null,
	},
	blukberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	buggem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	buginiumz: {
		inherit: true,
		isNonstandard: null,
	},
	cameruptite: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditex: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditey: {
		inherit: true,
		isNonstandard: null,
	},
	clawfossil: {
		inherit: true,
		isNonstandard: null,
	},
	cornnberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	coverfossil: {
		inherit: true,
		isNonstandard: null,
	},
	darkgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	darkiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	decidiumz: {
		inherit: true,
		isNonstandard: null,
	},
	diancite: {
		inherit: true,
		isNonstandard: null,
	},
	domefossil: {
		inherit: true,
		isNonstandard: null,
	},
	dracoplate: {
		inherit: true,
		isNonstandard: null,
	},
	dragongem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dragoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	dreadplate: {
		inherit: true,
		isNonstandard: null,
	},
	dreamball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	durinberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	earthplate: {
		inherit: true,
		isNonstandard: null,
	},
	eeviumz: {
		inherit: true,
		isNonstandard: null,
	},
	electricgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	electriumz: {
		inherit: true,
		isNonstandard: null,
	},
	fairiumz: {
		inherit: true,
		isNonstandard: null,
	},
	fairygem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fightinggem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fightiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	figyberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	firegem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	firiumz: {
		inherit: true,
		isNonstandard: null,
	},
	fistplate: {
		inherit: true,
		isNonstandard: null,
	},
	flameplate: {
		inherit: true,
		isNonstandard: null,
	},
	flyinggem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	flyiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	galladite: {
		inherit: true,
		isNonstandard: null,
	},
	garchompite: {
		inherit: true,
		isNonstandard: null,
	},
	gardevoirite: {
		inherit: true,
		isNonstandard: null,
	},
	gengarite: {
		inherit: true,
		isNonstandard: null,
	},
	ghostgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	ghostiumz: {
		inherit: true,
		isNonstandard: null,
	},
	glalitite: {
		inherit: true,
		isNonstandard: null,
	},
	grassgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	grassiumz: {
		inherit: true,
		isNonstandard: null,
	},
	groundgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	groundiumz: {
		inherit: true,
		isNonstandard: null,
	},
	gyaradosite: {
		inherit: true,
		isNonstandard: null,
	},
	helixfossil: {
		inherit: true,
		isNonstandard: null,
	},
	heracronite: {
		inherit: true,
		isNonstandard: null,
	},
	houndoominite: {
		inherit: true,
		isNonstandard: null,
	},
	iapapaberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	icegem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	icicleplate: {
		inherit: true,
		isNonstandard: null,
	},
	iciumz: {
		inherit: true,
		isNonstandard: null,
	},
	inciniumz: {
		inherit: true,
		isNonstandard: null,
	},
	insectplate: {
		inherit: true,
		isNonstandard: null,
	},
	ironplate: {
		inherit: true,
		isNonstandard: null,
	},
	jawfossil: {
		inherit: true,
		isNonstandard: null,
	},
	kangaskhanite: {
		inherit: true,
		isNonstandard: null,
	},
	kommoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	latiasite: {
		inherit: true,
		isNonstandard: null,
	},
	latiosite: {
		inherit: true,
		isNonstandard: null,
	},
	lopunnite: {
		inherit: true,
		isNonstandard: null,
	},
	lucarionite: {
		inherit: true,
		isNonstandard: null,
	},
	luckypunch: {
		inherit: true,
		isNonstandard: null,
	},
	lunaliumz: {
		inherit: true,
		isNonstandard: null,
	},
	lycaniumz: {
		inherit: true,
		isNonstandard: null,
	},
	machobrace: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	magoberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	magostberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	mail: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	manectite: {
		inherit: true,
		isNonstandard: null,
	},
	marshadiumz: {
		inherit: true,
		isNonstandard: null,
	},
	mawilite: {
		inherit: true,
		isNonstandard: null,
	},
	meadowplate: {
		inherit: true,
		isNonstandard: null,
	},
	medichamite: {
		inherit: true,
		isNonstandard: null,
	},
	metagrossite: {
		inherit: true,
		isNonstandard: null,
	},
	mewniumz: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitex: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitey: {
		inherit: true,
		isNonstandard: null,
	},
	mimikiumz: {
		inherit: true,
		isNonstandard: null,
	},
	mindplate: {
		inherit: true,
		isNonstandard: null,
	},
	nanabberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	nomelberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	normaliumz: {
		inherit: true,
		isNonstandard: null,
	},
	pamtreberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pidgeotite: {
		inherit: true,
		isNonstandard: null,
	},
	pikaniumz: {
		inherit: true,
		isNonstandard: null,
	},
	pikashuniumz: {
		inherit: true,
		isNonstandard: null,
	},
	pinapberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pinsirite: {
		inherit: true,
		isNonstandard: null,
	},
	plumefossil: {
		inherit: true,
		isNonstandard: null,
	},
	poisongem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	poisoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	primariumz: {
		inherit: true,
		isNonstandard: null,
	},
	psychicgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	psychiumz: {
		inherit: true,
		isNonstandard: null,
	},
	rabutaberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	razorfang: {
		inherit: true,
		isNonstandard: null,
	},
	razzberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	redorb: {
		inherit: true,
		isNonstandard: null,
	},
	rockgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	rockiumz: {
		inherit: true,
		isNonstandard: null,
	},
	rootfossil: {
		inherit: true,
		isNonstandard: null,
	},
	sablenite: {
		inherit: true,
		isNonstandard: null,
	},
	safariball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	sailfossil: {
		inherit: true,
		isNonstandard: null,
	},
	salamencite: {
		inherit: true,
		isNonstandard: null,
	},
	sceptilite: {
		inherit: true,
		isNonstandard: null,
	},
	scizorite: {
		inherit: true,
		isNonstandard: null,
	},
	sharpedonite: {
		inherit: true,
		isNonstandard: null,
	},
	skullfossil: {
		inherit: true,
		isNonstandard: null,
	},
	skyplate: {
		inherit: true,
		isNonstandard: null,
	},
	slowbronite: {
		inherit: true,
		isNonstandard: null,
	},
	snorliumz: {
		inherit: true,
		isNonstandard: null,
	},
	solganiumz: {
		inherit: true,
		isNonstandard: null,
	},
	spelonberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	splashplate: {
		inherit: true,
		isNonstandard: null,
	},
	spookyplate: {
		inherit: true,
		isNonstandard: null,
	},
	sportball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	steelgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	steeliumz: {
		inherit: true,
		isNonstandard: null,
	},
	steelixite: {
		inherit: true,
		isNonstandard: null,
	},
	stick: {
		inherit: true,
		isNonstandard: null,
	},
	stoneplate: {
		inherit: true,
		isNonstandard: null,
	},
	swampertite: {
		inherit: true,
		isNonstandard: null,
	},
	tapuniumz: {
		inherit: true,
		isNonstandard: null,
	},
	toxicplate: {
		inherit: true,
		isNonstandard: null,
	},
	tyranitarite: {
		inherit: true,
		isNonstandard: null,
	},
	ultranecroziumz: {
		inherit: true,
		isNonstandard: null,
	},
	venusaurite: {
		inherit: true,
		isNonstandard: null,
	},
	watergem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	wateriumz: {
		inherit: true,
		isNonstandard: null,
	},
	watmelberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	wepearberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	wikiberry: {
		inherit: true,
		isNonstandard: null,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	zapplate: {
		inherit: true,
		isNonstandard: null,
	},

	// Insurgence items
	poliwrathite: {
		inherit: true,
		isNonstandard: null,
	},
	marowite: {
		inherit: true,
		isNonstandard: null,
	},
	eevite: {
		inherit: true,
		isNonstandard: null,
	},
	meganiumite: {
		inherit: true,
		isNonstandard: null,
	},
	typhlosionite: {
		inherit: true,
		isNonstandard: null,
	},
	feraligatite: {
		inherit: true,
		isNonstandard: null,
	},
	sudowoodite: {
		inherit: true,
		isNonstandard: null,
	},
	politoedite: {
		inherit: true,
		isNonstandard: null,
	},
	sunflorite: {
		inherit: true,
		isNonstandard: null,
	},
	eitgirafarigite: {
		inherit: true,
		isNonstandard: null,
	},
	steelixitefire: {
		inherit: true,
		isNonstandard: null,
	},
	steelixitesteel: {
		inherit: true,
		isNonstandard: null,
	},
	macargonite: {
		inherit: true,
		isNonstandard: null,
	},
	donphanite: {
		inherit: true,
		isNonstandard: null,
	},
	miltankite: {
		inherit: true,
		isNonstandard: null,
	},
	shiftrite: {
		inherit: true,
		isNonstandard: null,
	},
	flygonite: {
		inherit: true,
		isNonstandard: null,
	},
	cacturnite: {
		inherit: true,
		isNonstandard: null,
	},
	crawdite: {
		inherit: true,
		isNonstandard: null,
	},
	milotite: {
		inherit: true,
		isNonstandard: null,
	},
	jirachite: {
		inherit: true,
		isNonstandard: null,
	},
	chatotite: {
		inherit: true,
		isNonstandard: null,
	},
	spiritombite: {
		inherit: true,
		isNonstandard: null,
	},
	froslassite: {
		inherit: true,
		isNonstandard: null,
	},
	zebstrikite: {
		inherit: true,
		isNonstandard: null,
	},
	zoronite: {
		inherit: true,
		isNonstandard: null,
	},
	gothitite: {
		inherit: true,
		isNonstandard: null,
	},
	reuniclite: {
		inherit: true,
		isNonstandard: null,
	},
	cryogonite: {
		inherit: true,
		isNonstandard: null,
	},
	haxorite: {
		inherit: true,
		isNonstandard: null,
	},
	stunfiskite: {
		inherit: true,
		isNonstandard: null,
	},
	bisharpite: {
		inherit: true,
		isNonstandard: null,
	},
	hydreigonite: {
		inherit: true,
		isNonstandard: null,
	},
	deltavenusaurite: {
		inherit: true,
		isNonstandard: null,
	},
	deltacharizardite: {
		inherit: true,
		isNonstandard: null,
	},
	deltablastoisinite: {
		inherit: true,
		isNonstandard: null,
	},
	deltabisharpite: {
		inherit: true,
		isNonstandard: null,
	},
	deltagardevoirite: {
		inherit: true,
		isNonstandard: null,
	},
	deltagalladite: {
		inherit: true,
		isNonstandard: null,
	},
	deltasunflorite: {
		inherit: true,
		isNonstandard: null,
	},
	deltascizorite: {
		inherit: true,
		isNonstandard: null,
	},
	deltaglalitite: {
		inherit: true,
		isNonstandard: null,
	},
	deltafroslassite: {
		inherit: true,
		isNonstandard: null,
	},
	deltatyphlosionite: {
		inherit: true,
		isNonstandard: null,
	},
	deltapidgeotite: {
		inherit: true,
		isNonstandard: null,
	},
	deltaetigirafarigite: {
		inherit: true,
		isNonstandard: null,
	},
	deltasablenite: {
		inherit: true,
		isNonstandard: null,
	},
	deltamawilite: {
		inherit: true,
		isNonstandard: null,
	},
	deltamedichamite: {
		inherit: true,
		isNonstandard: null,
	},
	deltacameruptite: {
		inherit: true,
		isNonstandard: null,
	},
	deltamilotite: {
		inherit: true,
		isNonstandard: null,
	},
	deltametagrossitespider: {
		inherit: true,
		isNonstandard: null,
	},
	deltametagrossiteruin: {
		inherit: true,
		isNonstandard: null,
	},
	crystalfragment: {
		inherit: true,
		isNonstandard: null,
	},
	deltalopunnite: {
		inherit: true,
		isNonstandard: null,
	},
	deltalucarionite: {
		inherit: true,
		isNonstandard: null,
	},
	crystalpiece: {
		inherit: true,
		isNonstandard: null,
	},
	flygonarmor: {
		inherit: true,
		isNonstandard: null,
	},
	leavannyarmor: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwoarmor: {
		inherit: true,
		isNonstandard: null,
	},
	tyranitararmor: {
		inherit: true,
		isNonstandard: null,
	},
	volcaronadeltaarmor: {
		inherit: true,
		isNonstandard: null,
	},
	zekromarmor: {
		inherit: true,
		isNonstandard: null,
	},
	darkrock: {
		inherit: true,
		isNonstandard: null,
	},
	trickrock: {
		inherit: true,
		isNonstandard: null,
	},

};
