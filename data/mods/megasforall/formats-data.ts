const mons = [
	"butterfreemega", "raichumega", "nidoqueenmega", "nidokingmega", "clefablemega", "parasectmega", "starmiemega", "vaporeonmega", "jolteonmega",
	"flareonmega", "dragonitemega", "meganiummega", "typhlosionmega", "feraligatrmega", "ariadosmega", "slowkingmega", "magcargomega", "delibirdmega",
	"delibirdmegafestiverider", "exploudmega", "flygonmega", "cacturnemega", "walreinmega", "regirockmega", "regicemega", "registeelmega", "staraptormega",
	"bibarelmega", "kricketunemega", "luxraymega", "bastiodonmega", "mismagiusmega", "honchkrowmega", "spiritombmega", "drapionmega", "froslassmega",
	"samurottmega", "gigalithmega", "conkeldurrmega", "leavannymega", "archeopsmega", "garbodormega", "gothitellemega", "reuniclusmega", "vanilluxemega",
	"sawsbucksummer", "sawsbuckautumn", "sawsbuckwinter", "sawsbuckmega", "sawsbucksummermega", "sawsbuckautumnmega", "sawsbuckwintermega", "klinklangmega",
	"eelektrossmega", "chandeluremega", "bisharpmega", "hydreigonmega", "talonflamemega", "meowsticmega", "meowsticfmega", "dragalgemega", "tyrantrummega",
	"aurorusmega", "hawluchamega", "goodramega", "trevenantmega", "gourgeistmega", "gourgeistsmallmega", "gourgeistlargemega", "gourgeistsupermega",
	"noivernmega", "toucannonmega", "gumshoosmega", "vikavoltmega", "lycanrocmega", "lycanrocmidnightmega", "lycanrocduskmega", "araquanidmega",
	"lurantismega", "mimikyumega", "mimikyubustedmega", "dhelmisemega", "kommoomega", "rillaboommega", "cinderacemega", "inteleonmega", "corviknightmega",
	"orbeetlemega", "thievulmega", "boltundmega", "toxtricitymega", "toxtricitylowkeymega", "dragapultmega", "ninetalesalolamega", "zoroarkmega", "delphoxmega",
	"dugtriomega", "falinksmegacombat", "falinksmegalegion", "wishiwashimega", "wishiwashimega1", "wishiwashimega2", "wishiwashimega3", "wishiwashimega4",
	"wishiwashimegaschool",
];

const data: {[k: string]: ModdedSpeciesFormatsData} = {};

for (const mon of mons) {
	if (!data[mon]) data[mon] = {};
	data[mon].isNonstandard = null;
	data[mon].tier = "OU";
	data[mon].doublesTier = "DOU";
}

export const FormatsData = data;
