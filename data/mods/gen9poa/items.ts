export const Items: {[k: string]: ModdedItemData} = {
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
	etigirafarigite: {
		inherit: true,
		isNonstandard: null,
	},
	steelixitefire: {
		inherit: true,
		isNonstandard: null,
	},
	magcargonite: {
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
	deltasceptilite: {
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
	dragonfang: {
		inherit: true,
		desc: "If held by a Clamperl-Delta, its Attack is doubled. Dragon attacks have 1.2x power.",
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.name === 'Clamperl-Delta') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Clamperl-Delta"],
	},
	dragonscale: {
		inherit: true,
		desc: "If held by a Clamperl-Delta, its Defense is doubled",
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (pokemon.species.name === 'Clamperl-Delta') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Clamperl-Delta"],
	},
	// Uranium Items
	hafliberry: {
		inherit: true,
		isNonstandard: null,
	},
	coconutmilk: {
		inherit: true,
		isNonstandard: null,
	},
	carrotwine: {
		inherit: true,
		isNonstandard: null,
	},
	junglecrown: {
		inherit: true,
		isNonstandard: null,
	},
	metalynxite: {
		inherit: true,
		isNonstandard: null,
	},
	archillesite: {
		inherit: true,
		isNonstandard: null,
	},
	electruxolite: {
		inherit: true,
		isNonstandard: null,
	},
	baariettite: {
		inherit: true,
		isNonstandard: null,
	},
	nuclearbaariettite: {
		inherit: true,
		isNonstandard: null,
	},
	drilgannite: {
		inherit: true,
		isNonstandard: null,
	},
	inflagetite: {
		inherit: true,
		isNonstandard: null,
	},
	dramsamaite: {
		inherit: true,
		isNonstandard: null,
	},
	syrentideite: {
		inherit: true,
		isNonstandard: null,
	},
	unidentifiedfallenobject: {
		inherit: true,
		isNonstandard: null,
	},
	kiricornite: {
		inherit: true,
		isNonstandard: null,
	},
	whimsicottite: {
		inherit: true,
		isNonstandard: null,
	},
	arbokite: {
		inherit: true,
		isNonstandard: null,
	},
	nucleararbokite: {
		inherit: true,
		isNonstandard: null,
	},
	aromaticherb: {
		inherit: true,
		isNonstandard: null,
	},
	
	//PoA items
	florgesite: {
		inherit: true,
		isNonstandard: null,
	},
	golduckite: {
		inherit: true,
		isNonstandard: null,
	},
	nullhelm: {
		inherit: true,
		isNonstandard: null,
	},
	slowkingite: {
		inherit: true,
		isNonstandard: null,
	},
	custapberry: {
		inherit: true,
		isNonstandard: null,
	},
	rottencustapberry: {
		inherit: true,
		isNonstandard: null,
	},
	enigmaberry: {
		inherit: true,
		isNonstandard: null,
	},
	rottenenigmaberry: {
		inherit: true,
		isNonstandard: null,
	},
	jabocaberry: {
		inherit: true,
		isNonstandard: null,
	},
	rottenjabocaberry: {
		inherit: true,
		isNonstandard: null,
	},
	keeberry: {
		inherit: true,
		isNonstandard: null,
	},
	rottenkeeberry: {
		inherit: true,
		isNonstandard: null,
	},
	marangaberry: {
		inherit: true,
		isNonstandard: null,
	},
	rottenmarangaberry: {
		inherit: true,
		isNonstandard: null,
	},
	micleberry: {
		inherit: true,
		isNonstandard: null,
	},
	rottenmicleberry: {
		inherit: true,
		isNonstandard: null,
	},
	rowapberry: {
		inherit: true,
		isNonstandard: null,
	},
	rottenrowapberry: {
		inherit: true,
		isNonstandard: null,
	},
	ariadosite: {
		inherit: true,
		isNonstandard: null,
	},
	granbullite: {
		inherit: true,
		isNonstandard: null,
	},
	electrodite: {
		inherit: true,
		isNonstandard: null,
	},
	garbodorite: {
		inherit: true,
		isNonstandard: null,
	},
	deltaswampertite: {
		inherit: true,
		isNonstandard: null,
	},
	acidicrock: {
		inherit: true,
		isNonstandard: null,
	},
	mantinite: {
		inherit: true,
		isNonstandard: null,
	},
	deltaspiritombite: {
		inherit: true,
		isNonstandard: null,
	},
	deltaaggronite: {
		inherit: true,
		isNonstandard: null,
	},
	eelektrossite: {
		inherit: true,
		isNonstandard: null,
	},
	deltablazikenite: {
		inherit: true,
		isNonstandard: null,
	},
	discardedcloth: {
		inherit: true,
		isNonstandard: null,
	},
	pixiedust: {
		inherit: true,
		isNonstandard: null,
	},
	excadrite: {
		inherit: true,
		isNonstandard: null,
	},
	weavilite: {
		inherit: true,
		isNonstandard: null,
	},
	ribombite: {
		inherit: true,
		isNonstandard: null,
	},
	gigalite: {
		inherit: true,
		isNonstandard: null,
	},
	empoleonite: {
		inherit: true,
		isNonstandard: null,
	},

	//Cap Items
	crucibellite: {
		inherit: true,
		isNonstandard: null,
	},
	vilevial: {
		inherit: true,
		isNonstandard: null,
	},
};