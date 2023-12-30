export const Pokedex: {[speciesid: string]: ModdedSpeciesData} = {
	screamtail: {
		inherit: true,
		types: ["Fairy", "Dragon"],
		abilities: {0: "Protosmosis", H: "Cute Charm"},
	},
	crabrawler: {
		inherit: true,
		abilities: {0: "Hyper Cutter", 1: "Iron Fist", H: "Fair Fight"},
	},
	crabominable: {
		inherit: true,
		types: ["Fighting", "Water"],
		abilities: {0: "Fur Coat", 1: "Iron Fist", H: "Fair Fight"},
	},
	mareanie: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Merciless", H: "Regenerator"},
	},
	toxapex: {
		inherit: true,
		types: ["Dark", "Water"],
		abilities: {0: "Battle Spines", 1: "Merciless", H: "Regenerator"},
	},
	varoom: {
		inherit: true,
		abilities: {0: "Overcoat", 1: "Momentum", H: "Slow Start"},
	},
	revavroom: {
		inherit: true,
		abilities: {0: "Overcoat", 1: "Momentum", H: "Filter"},
		otherFormes: ["Revavroom-Segin", "Revavroom-Schedar", "Revavroom-Navi", "Revavroom-Ruchbah", "Revavroom-Caph"],
		formeOrder: ["Revavroom", "Revavroom-Segin", "Revavroom-Schedar", "Revavroom-Navi", "Revavroom-Ruchbah", "Revavroom-Caph"],
	},
	revavroomsegin: {
		num: 966,
		name: "Revavroom-Segin",
		baseSpecies: "Revavroom",
		forme: "Segin",
		types: ["Dark"],
		gender: "N",
		baseStats: {hp: 80, atk: 119, def: 90, spa: 54, spd: 67, spe: 90},
		abilities: {0: "Intimidate"},
		heightm: 1.8,
		weightkg: 120,
		color: "Gray",
		eggGroups: ["Mineral"],
		requiredItem: "Segin Star Shard",
		battleOnly: "Revavroom",
	},
	revavroomschedar: {
		num: 966,
		name: "Revavroom-Schedar",
		baseSpecies: "Revavroom",
		forme: "Schedar",
		types: ["Fire"],
		gender: "N",
		baseStats: {hp: 80, atk: 119, def: 90, spa: 54, spd: 67, spe: 90},
		abilities: {0: "Speed Boost"},
		heightm: 1.8,
		weightkg: 120,
		color: "Gray",
		eggGroups: ["Mineral"],
		requiredItem: "Schedar Star Shard",
		battleOnly: "Revavroom",
	},
	revavroomnavi: {
		num: 966,
		name: "Revavroom-Navi",
		baseSpecies: "Revavroom",
		forme: "Navi",
		types: ["Poison"],
		gender: "N",
		baseStats: {hp: 80, atk: 119, def: 90, spa: 54, spd: 67, spe: 90},
		abilities: {0: "Toxic Debris"},
		heightm: 1.8,
		weightkg: 120,
		color: "Gray",
		eggGroups: ["Mineral"],
		requiredItem: "Navi Star Shard",
		battleOnly: "Revavroom",
	},
	revavroomruchbah: {
		num: 966,
		name: "Revavroom-Ruchbah",
		baseSpecies: "Revavroom",
		forme: "Ruchbah",
		types: ["Fairy"],
		gender: "N",
		baseStats: {hp: 80, atk: 119, def: 90, spa: 54, spd: 67, spe: 90},
		abilities: {0: "Misty Surge"},
		heightm: 1.8,
		weightkg: 120,
		color: "Gray",
		eggGroups: ["Mineral"],
		requiredItem: "Ruchbah Star Shard",
		battleOnly: "Revavroom",
	},
	revavroomcaph: {
		num: 966,
		name: "Revavroom-Caph",
		baseSpecies: "Revavroom",
		forme: "Ruchbah",
		types: ["Fighting"],
		gender: "N",
		baseStats: {hp: 80, atk: 119, def: 90, spa: 54, spd: 67, spe: 90},
		abilities: {0: "Stamina"},
		heightm: 1.8,
		weightkg: 120,
		color: "Gray",
		eggGroups: ["Mineral"],
		requiredItem: "Caph Star Shard",
		battleOnly: "Revavroom",
	},
	donphan: {
		inherit: true,
		abilities: {0: "Sturdy", 1: "Overcoat", H: "Sand Spit"},
	},
	avalugg: {
		inherit: true,
		abilities: {0: "Overcoat", 1: "Permafrost", H: "Sturdy"},
	},
	avalugghisui: {
		inherit: true,
		abilities: {0: "Strong Jaw", 1: "Permafrost", H: "Sturdy"},
	},
	vespiquen: {
		inherit: true,
		types: ["Poison", "Flying"],
		abilities: {0: "Intimidate", 1: "Cute Charm", H: "Supreme Overlord"},
	},
	misdreavus: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Death Aura", H: "Fairy Ringer"},
	},
	mismagius: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Death Aura", H: "Fairy Ringer"},
	},
	floette: {
		inherit: true,
		abilities: {0: "Flower Veil", 1: "Healer", H: "Symbiosis"},
	},
	flabebe: {
		inherit: true,
		abilities: {0: "Flower Veil", 1: "Healer", H: "Symbiosis"},
	},
	florges: {
		inherit: true,
		abilities: {0: "Grass Pelt", 1: "Healer", H: "Symbiosis"},
	},
	oranguru: {
		inherit: true,
		abilities: {0: "Counteract", 1: "Healer", H: "Symbiosis"},
	},
	passimian: {
		inherit: true,
		abilities: {0: "Receiver", 1: "Counteract", H: "Defiant"},
	},
	petilil: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Sheer Heart", H: "Healer"},
	},
	lilligant: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Sheer Heart", H: "Healer"},
	},
	lilliganthisui: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Hustle", H: "Healer"},
	},
	ralts: {
		inherit: true,
		abilities: {0: "Synchronize", 1: "Trace", H: "Healer"},
	},
	kirlia: {
		inherit: true,
		abilities: {0: "Synchronize", 1: "Trace", H: "Healer"},
	},
	gardevoir: {
		inherit: true,
		abilities: {0: "Synchronize", 1: "Trace", H: "Healer"},
	},
	indeedee: {
		inherit: true,
		abilities: {0: "Healer", 1: "Synchronize", H: "Psychic Surge"},
	},
	indeedeef: {
		inherit: true,
		abilities: {0: "Healer", 1: "Synchronize", H: "Psychic Surge"},
	},
	magearna: {
		inherit: true,
		abilities: {0: "Soul-Heart", H: "Healer"},
	},
	magearnaoriginal: {
		inherit: true,
		abilities: {0: "Soul-Heart", H: "Healer"},
	},
	mesprit: {
		inherit: true,
		abilities: {0: "Levitate", H: "Healer"},
	},
	bellibolt: {
		inherit: true,
		types: ["Electric", "Water"],
		abilities: {0: "Electromorphosis", 1: "Static", H: "Volt Absorb"},
	},
	decidueye: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Contrary"},
	},
	decidueyehisui: {
		inherit: true,
		types: ["Ghost", "Fighting"],
		abilities: {0: "Overgrow", H: "Scrappy"},
	},
	magnemite: {
		inherit: true,
		abilities: {0: "Magnet Pull", 1: "Levitate", H: "Analytic"},
	},
	magneton: {
		inherit: true,
		abilities: {0: "Magnet Pull", 1: "Levitate", H: "Analytic"},
	},
	magnezone: {
		inherit: true,
		abilities: {0: "Magnet Pull", 1: "Levitate", H: "Analytic"},
	},
	greattusk: {
		inherit: true,
		abilities: {0: "Protocrysalis", H: "Muscle Memory"},
	},
	sandyshocks: {
		inherit: true,
		abilities: {0: "Protocrysalis", H: "Sand Spit"},
	},
	fluttermane: {
		inherit: true,
		abilities: {0: "Protostasis", H: "Illusion"},
	},
	brutebonnet: {
		inherit: true,
		abilities: {0: "Protosmosis", H: "Seed Sower"},
	},
	slitherwing: {
		inherit: true,
		abilities: {0: "Protosynthesis", H: "Shield Dust"},
	},
	irontreads: {
		inherit: true,
		abilities: {0: "Rune Drive", H: "Momentum"},
	},
	ironbundle: {
		inherit: true,
		abilities: {0: "Neuron Drive", H: "Water Veil"},
	},
	ironhands: {
		inherit: true,
		abilities: {0: "Photon Drive", H: "Fair Fight"},
	},
	ironjugulis: {
		inherit: true,
		abilities: {0: "Neuron Drive", H: "Mega Launcher"},
	},
	ironmoth: {
		inherit: true,
		abilities: {0: "Photon Drive", H: "Exoskeleton"},
	},
	ironthorns: {
		inherit: true,
		abilities: {0: "Quark Drive", H: "Blunt Force"},
	},
	roaringmoon: {
		inherit: true,
		abilities: {0: "Protostasis", H: "Gale Wings"},
	},
	ironvaliant: {
		inherit: true,
		abilities: {0: "Rune Drive", H: "Outclass"},
	},
	ironleaves: {
		inherit: true,
		abilities: {0: "Quark Drive", H: "Justified"},
	},
	arboliva: {
		inherit: true,
		abilities: {0: "Seed Sower", 1: "Grass Pelt", H: "Harvest"},
	},
	squawkabillyyellow: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Hustle", H: "Gale Wings"},
	},
	squawkabillywhite: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Hustle", H: "Gale Wings"},
	},
	calyrex: {
		inherit: true,
		abilities: {0: "Unnerve", 1: "Fairy Ringer", H: "Grass Pelt"},
	},
	swablu: {
		inherit: true,
		abilities: {0: "Natural Cure", 1: "Gale Wings", H: "Sheer Heart"},
	},
	altaria: {
		inherit: true,
		abilities: {0: "Natural Cure", 1: "Gale Wings", H: "Sheer Heart"},
	},
	tropius: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Gale Wings", H: "Harvest"},
	},
	articuno: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Gale Wings", H: "Permafrost"},
	},
	rotomfan: {
		inherit: true,
		abilities: {0: "Levitate", H: "Gale Wings"},
	},
	rotomheat: {
		inherit: true,
		abilities: {0: "Levitate", H: "Smelt"},
	},
	rotomfrost: {
		inherit: true,
		abilities: {0: "Levitate", H: "Permafrost"},
	},
	rotom: {
		inherit: true,
		abilities: {0: "Levitate", H: "Adaptability"},
	},
	rotomwash: {
		inherit: true,
		abilities: {0: "Levitate", H: "Water Veil"},
	},
	rotommow: {
		inherit: true,
		abilities: {0: "Levitate", H: "Natural Cure"},
	},
	bombirdier: {
		inherit: true,
		abilities: {0: "Big Pecks", 1: "Gale Wings", H: "Rocky Payload"},
	},
	oricorio: {
		inherit: true,
		types: ["Fighting", "Flying"],
		abilities: {0: "Dancer", 1: "Muscle Memory", H: "Scrappy"},
	},
	oricoriopau: {
		inherit: true,
		types: ["Fairy", "Flying"],
		abilities: {0: "Dancer", 1: "Muscle Memory", H: "Unaware"},
	},
	oricoriopompom: {
		inherit: true,
		abilities: {0: "Dancer", 1: "Muscle Memory", H: "Fluffy"},
	},
	oricoriosensu: {
		inherit: true,
		abilities: {0: "Dancer", 1: "Muscle Memory", H: "Death Aura"},
	},
	hydreigon: {
		inherit: true,
		abilities: {0: "Levitate", H: "Muscle Memory"},
	},
	flamigo: {
		inherit: true,
		abilities: {0: "Scrappy", 1: "Muscle Memory", H: "Costar"},
	},
	meloetta: {
		inherit: true,
		types: ["Psychic", "Fighting"],
		abilities: {0: "Trace", H: "Muscle Memory"},
	},
	meloettapirouette: {
		inherit: true,
		abilities: {0: "No Guard", H: "Muscle Memory"},
	},
	landorus: {
		inherit: true,
		abilities: {0: "Sand Force", H: "Cloud Nine"},
	},
	hoppip: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Cloud Nine", H: "Infiltrator"},
	},
	skiploom: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Cloud Nine", H: "Infiltrator"},
	},
	jumpluff: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Cloud Nine", H: "Infiltrator"},
	},
	lycanroc: {
		inherit: true,
		abilities: {0: "Steadfast", 1: "Sand Rush", H: "Cloud Nine"},
	},
	igglybuff: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Competitive", H: "Cloud Nine"},
	},
	jigglypuff: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Competitive", H: "Cloud Nine"},
	},
	wigglytuff: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Natural Cure", H: "Wind Rider"},
	},
	dudunsparce: {
		inherit: true,
		abilities: {0: "Serene Grace", 1: "Cloud Nine", H: "Rattled"},
	},
	dudunsparcethreesegment: {
		inherit: true,
		abilities: {0: "Serene Grace", 1: "Cloud Nine", H: "Rattled"},
	},
	cacnea: {
		inherit: true,
		abilities: {0: "Battle Spines", H: "Water Absorb"},
	},
	cacturne: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Sand Force", H: "Water Absorb"},
	},
	gible: {
		inherit: true,
		abilities: {0: "Sand Veil", 1: "Sand Force", H: "Rough Skin"},
	},
	gabite: {
		inherit: true,
		abilities: {0: "Sand Veil", 1: "Sand Force", H: "Rough Skin"},
	},
	garchomp: {
		inherit: true,
		abilities: {0: "Sand Veil", 1: "Sand Force", H: "Rough Skin"},
	},
	lycanrocmidnight: {
		inherit: true,
		abilities: {0: "Keen Eye", 1: "Sand Force", H: "No Guard"},
	},
	typhlosionhisui: {
		inherit: true,
		abilities: {0: "Blaze", H: "Death Aura"},
	},
	gastly: {
		inherit: true,
		abilities: {0: "Levitate", H: "Death Aura"},
	},
	haunter: {
		inherit: true,
		abilities: {0: "Levitate", H: "Death Aura"},
	},
	gengar: {
		inherit: true,
		abilities: {0: "Levitate", H: "Neutralizing Gas"},
	},
	rellor: {
		inherit: true,
		abilities: {0: "Compound Eyes", 1: "Sand Force", H: "Shed Skin"},
	},
	rabsca: {
		inherit: true,
		abilities: {0: "Sunblock", 1: "Sand Force", H: "Counteract"},
	},
	greavard: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Death Aura", H: "Fluffy"},
	},
	houndstone: {
		inherit: true,
		abilities: {0: "Sand Rush", 1: "Death Aura", H: "Fluffy"},
	},
	spiritomb: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Death Aura", H: "Green-Eyed"},
	},
	froslass: {
		inherit: true,
		abilities: {0: "Snow Cloak", 1: "Death Aura", H: "Sheer Heart"},
	},
	houndoom: {
		inherit: true,
		abilities: {0: "Death Aura", 1: "Flash Fire", H: "Unnerve"},
	},
	voltorbhisui: {
		inherit: true,
		abilities: {0: "Soundproof", 1: "Seed Sower", H: "Aftermath"},
	},
	electrodehisui: {
		inherit: true,
		abilities: {0: "Soundproof", 1: "Seed Sower", H: "Aftermath"},
	},
	chespin: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Seed Sower"},
	},
	quilladin: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Seed Sower"},
	},
	chesnaught: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Seed Sower"},
	},
	bounsweet: {
		inherit: true,
		abilities: {0: "Seed Sower", 1: "Oblivious", H: "Sweet Veil"},
	},
	steenee: {
		inherit: true,
		abilities: {0: "Seed Sower", 1: "Oblivious", H: "Sweet Veil"},
	},
	tsareena: {
		inherit: true,
		types: ["Grass", "Fairy"],
		abilities: {0: "Seed Sower", 1: "Queenly Majesty", H: "Cute Charm"},
	},
	leafeon: {
		inherit: true,
		abilities: {0: "Chlorophyll", H: "Sharpness"},
	},
	diglett: {
		inherit: true,
		abilities: {0: "Sand Spit", 1: "Arena Trap", H: "Sand Force"},
	},
	dugtrio: {
		inherit: true,
		abilities: {0: "Sand Spit", 1: "Arena Trap", H: "Sand Force"},
	},
	sandile: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Moxie", H: "Sand Spit"},
	},
	krokorok: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Moxie", H: "Sand Spit"},
	},
	krookodile: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Moxie", H: "Prehistoric Might"},
	},
	sandygast: {
		inherit: true,
		abilities: {0: "Water Compaction", 1: "Sand Spit", H: "Sand Veil"},
	},
	palossand: {
		inherit: true,
		abilities: {0: "Water Compaction", 1: "Sand Spit", H: "Sand Veil"},
	},
	pyroar: {
		inherit: true,
		types: ["Fire", "Ground"],
		abilities: {0: "Sand Rush", 1: "Outclass", H: "Supreme Overlord"},
	},
	zacian: {
		inherit: true,
		abilities: {0: "Intrepid Sword", H: "Outclass"},
	},
	zaciancrowned: {
		inherit: true,
		abilities: {0: "Intrepid Sword", H: "Outclass"},
	},
	zamazenta: {
		inherit: true,
		abilities: {0: "Dauntless Shield", H: "Counteract"},
	},
	zamazentacrowned: {
		inherit: true,
		abilities: {0: "Dauntless Shield", H: "Counteract"},
	},
	uxie: {
		inherit: true,
		abilities: {0: "Levitate", H: "Counteract"},
	},
	azelf: {
		inherit: true,
		abilities: {0: "Levitate", H: "Outclass"},
	},
	tinkaton: {
		inherit: true,
		abilities: {0: "Mold Breaker", 1: "Counteract", H: "Blunt Force"},
	},
	girafarig: {
		inherit: true,
		abilities: {0: "Inner Focus", 1: "Early Bird", H: "Counteract"},
	},
	farigiraf: {
		inherit: true,
		abilities: {0: "Cud Chew", 1: "Armor Tail", H: "Counteract"},
	},
	umbreon: {
		inherit: true,
		abilities: {0: "Fairy Ringer", H: "Counteract"},
	},
	drifloon: {
		inherit: true,
		abilities: {0: "Counteract", 1: "Unburden", H: "Flare Boost"},
	},
	drifblim: {
		inherit: true,
		abilities: {0: "Counteract", 1: "Unburden", H: "Flare Boost"},
	},
	falinks: {
		inherit: true,
		abilities: {0: "Battle Armor", 1: "Counteract", H: "Defiant"},
	},
	basculegionf: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Adaptability", H: "Counteract"},
	},
	taurospaldeablaze: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Sunblock", H: "Cud Chew"},
	},
	taurospaldeaaqua: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Counteract", H: "Cud Chew"},
	},
	espathra: {
		inherit: true,
		abilities: {0: "Opportunist", 1: "Outclass", H: "Speed Boost"},
	},
	haxorus: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Mold Breaker", H: "Unnerve"},
	},
	eevee: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Adaptability", H: "Anticipation"},
	},
	drednaw: {
		inherit: true,
		abilities: {0: "Strong Jaw", 1: "Sand Veil", H: "Swift Swim"},
	},
	sneasel: {
		inherit: true,
		abilities: {0: "Inner Focus", 1: "Keen Eye", H: "Green-Eyed"},
	},
	weavile: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Snow Cloak", H: "Green-Eyed"},
	},
	snom: {
		inherit: true,
		abilities: {0: "Shield Dust", 1: "Snow Cloak", H: "Ice Scales"},
	},
	frosmoth: {
		inherit: true,
		abilities: {0: "Shield Dust", 1: "Snow Cloak", H: "Ice Scales"},
	},
	frigibax: {
		inherit: true,
		abilities: {0: "Thermal Exchange", 1: "Snow Cloak", H: "Ice Body"},
	},
	arctibax: {
		inherit: true,
		abilities: {0: "Thermal Exchange", 1: "Snow Cloak", H: "Ice Body"},
	},
	baxcalibur: {
		inherit: true,
		abilities: {0: "Thermal Exchange", 1: "Snow Cloak", H: "Ice Body"},
	},
	salandit: {
		inherit: true,
		abilities: {0: "Corrosion", 1: "Sunblock", H: "Green-Eyed"},
	},
	salazzle: {
		inherit: true,
		abilities: {0: "Corrosion", 1: "Sunblock", H: "Green-Eyed"},
	},
	fomantis: {
		inherit: true,
		abilities: {0: "Leaf Guard", 1: "Sunblock", H: "Contrary"},
	},
	lurantis: {
		inherit: true,
		abilities: {0: "Leaf Guard", 1: "Sunblock", H: "Contrary"},
	},
	moltres: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Sunblock", H: "Flame Body"},
	},
	cyndaquil: {
		inherit: true,
		abilities: {0: "Blaze", H: "Sunblock"},
	},
	quilava: {
		inherit: true,
		abilities: {0: "Blaze", H: "Sunblock"},
	},
	typhlosion: {
		inherit: true,
		abilities: {0: "Blaze", H: "Sunblock"},
	},
	zarude: {
		inherit: true,
		abilities: {0: "Sunblock"},
	},
	zarudedada: {
		inherit: true,
		abilities: {0: "Sunblock"},
	},
	mew: {
		inherit: true,
		abilities: {0: "Synchronize", H: "Protean"},
	},
	hariyama: {
		inherit: true,
		abilities: {0: "Fair Fight", 1: "Guts", H: "Purifying Salt"},
	},
	mukalola: {
		inherit: true,
		abilities: {0: "Neutralizing Gas", 1: "Poison Touch", H: "Power of Alchemy"},
	},
	muk: {
		inherit: true,
		types: ["Poison", "Water"],
		abilities: {0: "Regenerator", 1: "Liquid Ooze", H: "Water Absorb"},
	},
	meowthgalar: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Tough Claws", H: "Steely Spirit"},
	},
	diglettalola: {
		inherit: true,
		abilities: {0: "Steely Spirit", 1: "Tangling Hair", H: "Sand Force"},
	},
	dugtrioalola: {
		inherit: true,
		abilities: {0: "Steely Spirit", 1: "Tangling Hair", H: "Sand Force"},
	},
	cufant: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Steely Spirit", H: "Heavy Metal"},
	},
	copperajah: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Steely Spirit", H: "Heavy Metal"},
	},
	bronzor: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Heatproof", H: "Steely Spirit"},
	},
	bronzong: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Heatproof", H: "Steely Spirit"},
	},
	thundurus: {
		inherit: true,
		abilities: {0: "Prankster", H: "Battle Spines"},
	},
	overqwil: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Swift Swim", H: "Intimidate"},
	},
	clodsire: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Water Absorb", H: "Unaware"},
	},
	jolteon: {
		inherit: true,
		abilities: {0: "Volt Absorb", H: "Battle Spines"},
	},
	pincurchin: {
		inherit: true,
		abilities: {0: "Lightning Rod", 1: "Battle Spines", H: "Electric Surge"},
	},
	cloyster: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Skill Link", H: "Overcoat"},
	},
	spoink: {
		inherit: true,
		abilities: {0: "Thick Fat", 1: "Sheer Heart", H: "Gluttony"},
	},
	grumpig: {
		inherit: true,
		abilities: {0: "Thick Fat", 1: "Sheer Heart", H: "Gluttony"},
	},
	alomomola: {
		inherit: true,
		abilities: {0: "Healer", 1: "Sheer Heart", H: "Regenerator"},
	},
	luvdisc: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Sheer Heart", H: "Hydration"},
	},
	lucario: {
		inherit: true,
		abilities: {0: "Sheer Heart", 1: "Steadfast", H: "Justified"},
	},
	gothita: {
		inherit: true,
		abilities: {0: "Sheer Heart", 1: "Competitive", H: "Shadow Tag"},
	},
	gothorita: {
		inherit: true,
		abilities: {0: "Sheer Heart", 1: "Competitive", H: "Shadow Tag"},
	},
	gothitelle: {
		inherit: true,
		abilities: {0: "Sheer Heart", 1: "Competitive", H: "Shadow Tag"},
	},
	gastrodon: {
		inherit: true,
		abilities: {0: "Color Change", 1: "Storm Drain", H: "Sand Force"},
	},
	deerling: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Color Change", H: "Serene Grace"},
	},
	sawsbuck: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Color Change", H: "Serene Grace"},
	},
	toedscool: {
		inherit: true,
		abilities: {0: "Mycelium Might", H: "Color Change"},
	},
	toedscruel: {
		inherit: true,
		abilities: {0: "Mycelium Might", H: "Color Change"},
	},
	heatran: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Smelt", H: "Flame Body"},
	},
	torkoal: {
		inherit: true,
		abilities: {0: "White Smoke", 1: "Drought", H: "Smelt"},
	},
	camerupt: {
		inherit: true,
		abilities: {0: "Smelt", 1: "Solid Rock", H: "Cud Chew"},
	},
	rolycoly: {
		inherit: true,
		abilities: {0: "Steam Engine", 1: "Heatproof", H: "Smelt"},
	},
	carkol: {
		inherit: true,
		abilities: {0: "Steam Engine", 1: "Flame Body", H: "Smelt"},
	},
	coalossal: {
		inherit: true,
		abilities: {0: "Steam Engine", 1: "Flame Body", H: "Smelt"},
	},
	chiyu: {
		inherit: true,
		abilities: {0: "Beads of Ruin", H: "Smelt"},
	},
	tinglu: {
		inherit: true,
		abilities: {0: "Vessel of Ruin", H: "Green-Eyed"},
	},
	moltresgalar: {
		inherit: true,
		abilities: {0: "Berserk", H: "Green-Eyed"},
	},
	mewoth: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Technician", H: "Green-Eyed"},
	},
	persian: {
		inherit: true,
		abilities: {0: "Limber", 1: "Technician", H: "Green-Eyed"},
	},
	meowthalola: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Technician", H: "Green-Eyed"},
	},
	persianalola: {
		inherit: true,
		abilities: {0: "Fur Coat", 1: "Technician", H: "Green-Eyed"},
	},
	zangoose: {
		inherit: true,
		abilities: {0: "Immunity", 1: "Green-Eyed", H: "Toxic Boost"},
	},
	seviper: {
		inherit: true,
		abilities: {0: "Shed Skin", 1: "Green-Eyed", H: "Infiltrator"},
	},
	scovillain: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Green-Eyed", H: "Moody"},
	},
	hoopa: {
		inherit: true,
		abilities: {0: "Magician", H: "Green-Eyed"},
	},
	hoopaunbound: {
		inherit: true,
		abilities: {0: "Magician", H: "Green-Eyed"},
	},
	zorua: {
		inherit: true,
		abilities: {0: "Illusion", H: "Green-Eyed"},
	},
	zoroark: {
		inherit: true,
		abilities: {0: "Illusion", H: "Green-Eyed"},
	},
	murkrow: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Super Luck", H: "Prankster"},
	},
	honchkrow: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Super Luck", H: "Moxie"},
	},
	impidimp: {
		inherit: true,
		abilities: {0: "Prankster", 1: "Frisk", H: "Green-Eyed"},
	},
	morgrem: {
		inherit: true,
		abilities: {0: "Prankster", 1: "Frisk", H: "Green-Eyed"},
	},
	grimmsnarl: {
		inherit: true,
		abilities: {0: "Prankster", 1: "Frisk", H: "Green-Eyed"},
	},
	sableye: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Stall", H: "Prankster"},
	},
	mudbray: {
		inherit: true,
		abilities: {0: "Mud Wash", 1: "Stamina", H: "Inner Focus"},
	},
	mudsdale: {
		inherit: true,
		abilities: {0: "Mud Wash", 1: "Stamina", H: "Inner Focus"},
	},
	barboach: {
		inherit: true,
		abilities: {0: "Water Veil", 1: "Oblivious", H: "Mud Wash"},
	},
	whiscash: {
		inherit: true,
		abilities: {0: "Water Veil", 1: "Oblivious", H: "Mud Wash"},
	},
	vaporeon: {
		inherit: true,
		abilities: {0: "Water Absorb", H: "Mud Wash"},
	},
	surskit: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Mud Wash", H: "Rain Dish"},
	},
	masquerain: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Mud Wash", H: "Unnerve"},
	},
	pelipper: {
		inherit: true,
		abilities: {0: "Mud Wash", 1: "Drizzle", H: "Rain Dish"},
	},
	orthworm: {
		inherit: true,
		types: ["Steel", "Water"],
		abilities: {0: "Earth Eater", 1: "Steely Spirit", H: "Mud Wash"},
	},
	psyduck: {
		inherit: true,
		abilities: {0: "Mud Wash", 1: "Cloud Nine", H: "Swift Swim"},
	},
	golduck: {
		inherit: true,
		abilities: {0: "Mud Wash", 1: "Cloud Nine", H: "Swift Swim"},
	},
	wooper: {
		inherit: true,
		abilities: {0: "Mud Wash", 1: "Water Absorb", H: "Unaware"},
	},
	quagsire: {
		inherit: true,
		abilities: {0: "Mud Wash", 1: "Water Absorb", H: "Unaware"},
	},
	salamence: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Technician", H: "Moxie"},
	},
	inteleon: {
		inherit: true,
		abilities: {0: "Torrent", H: "Outclass"},
	},
	dragalge: {
		inherit: true,
		abilities: {0: "Poison Point", 1: "Color Change", H: "Adaptability"},
	},
	sandshrew: {
		inherit: true,
		abilities: {0: "Momentum", 1: "Battle Spines", H: "Sand Rush"},
	},
	sandshrewalola: {
		inherit: true,
		abilities: {0: "Steely Spirit", 1: "Battle Spines", H: "Slush Rush"},
	},
	sandslash: {
		inherit: true,
		abilities: {0: "Momentum", 1: "Battle Spines", H: "Sand Rush"},
	},
	sandslashalola: {
		inherit: true,
		abilities: {0: "Steely Spirit", 1: "Battle Spines", H: "Slush Rush"},
	},
	bellsprout: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Seed Sower", H: "Gluttony"},
	},
	weepinbell: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Seed Sower", H: "Gluttony"},
	},
	victreebel: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Seed Sower", H: "Gluttony"},
	},
	poliwag: {
		inherit: true,
		abilities: {0: "Water Absorb", 1: "Mud Wash", H: "Swift Swim"},
	},
	poliwhirl: {
		inherit: true,
		abilities: {0: "Water Absorb", 1: "Mud Wash", H: "Swift Swim"},
	},
	poliwrath: {
		inherit: true,
		abilities: {0: "Water Absorb", 1: "Mud Wash", H: "Swift Swim"},
	},
	politoed: {
		inherit: true,
		abilities: {0: "Water Absorb", 1: "Mud Wash", H: "Drizzle"},
	},
	munchlax: {
		inherit: true,
		abilities: {0: "Counteract", 1: "Thick Fat", H: "Gluttony"},
	},
	snorlax: {
		inherit: true,
		abilities: {0: "Comatose", 1: "Thick Fat", H: "Gluttony"},
	},
	sentret: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Keen Eye", H: "Frisk"},
	},
	furret: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Keen Eye", H: "Frisk"},
	},
	spinarak: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Swarm", H: "Sniper"},
	},
	ariados: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Swarm", H: "Sniper"},
	},
	gligar: {
		inherit: true,
		abilities: {0: "Sand Force", 1: "Exoskeleton", H: "Immunity"},
	},
	gliscor: {
		inherit: true,
		abilities: {0: "Sand Force", 1: "Exoskeleton", H: "Poison Heal"},
	},
	slugma: {
		inherit: true,
		abilities: {0: "Smelt", 1: "Flame Body", H: "Weak Armor"},
	},
	magcargo: {
		inherit: true,
		abilities: {0: "Smelt", 1: "Flame Body", H: "Weak Armor"},
	},
	lotad: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Rain Dish", H: "Overcoat"},
	},
	lombre: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Rain Dish", H: "Overcoat"},
	},
	ludicolo: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Rain Dish", H: "Overcoat"},
	},
	seedot: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Early Bird", H: "Cloud Nine"},
	},
	nuzleaf: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Early Bird", H: "Cloud Nine"},
	},
	shiftry: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Wind Rider", H: "Cloud Nine"},
	},
	volbeat: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Swarm", H: "Prankster"},
	},
	illumise: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Tinted Lens", H: "Prankster"},
	},
	milotic: {
		inherit: true,
		types: ["Water", "Fairy"],
		abilities: {0: "Marvel Scale", 1: "Water Veil", H: "Sheer Heart"},
	},
	duskull: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Death Aura", H: "Frisk"},
	},
	dusclops: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Death Aura", H: "Frisk"},
	},
	dusknoir: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Death Aura", H: "Frisk"},
	},
	turtwig: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Sand Force"},
	},
	grotle: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Sand Force"},
	},
	torterra: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Sand Force"},
	},
	chimchar: {
		inherit: true,
		abilities: {0: "Blaze", H: "Muscle Memory"},
	},
	monferno: {
		inherit: true,
		abilities: {0: "Blaze", H: "Muscle Memory"},
	},
	infernape: {
		inherit: true,
		abilities: {0: "Blaze", H: "Muscle Memory"},
	},
	phione: {
		inherit: true,
		abilities: {0: "Hydration", H: "Healer"},
	},
	manaphy: {
		inherit: true,
		abilities: {0: "Hydration", H: "Healer"},
	},
	shaymin: {
		inherit: true,
		abilities: {0: "Serene Grace", H: "Grass Pelt"},
	},
	gurdurr: {
		inherit: true,
		abilities: {0: "Guts", 1: "Sheer Force", H: "Steely Spirit"},
	},
	sewaddle: {
		inherit: true,
		abilities: {0: "Grass Pelt", 1: "Chlorophyll", H: "Overcoat"},
	},
	swadloon: {
		inherit: true,
		abilities: {0: "Grass Pelt", 1: "Chlorophyll", H: "Overcoat"},
	},
	leavanny: {
		inherit: true,
		abilities: {0: "Grass Pelt", 1: "Chlorophyll", H: "Overcoat"},
	},
	ducklett: {
		inherit: true,
		abilities: {0: "Keen Eye", 1: "Big Pecks", H: "Gale Wings"},
	},
	swanna: {
		inherit: true,
		abilities: {0: "Keen Eye", 1: "Big Pecks", H: "Gale Wings"},
	},
	litwick: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Flash Fire", H: "Smelt"},
	},
	lampent: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Flash Fire", H: "Smelt"},
	},
	chandelure: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Flash Fire", H: "Smelt"},
	},
	mienfoo: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Regenerator", H: "Reckless"},
	},
	mienshao: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Regenerator", H: "Reckless"},
	},
	cutiefly: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Shield Dust", H: "Healer"},
	},
	ribombee: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Shield Dust", H: "Healer"},
	},
	poltchageist: {
		inherit: true,
		abilities: {0: "Hospitality", 1: "Healer", H: "Heatproof"},
	},
	sinistcha: {
		inherit: true,
		abilities: {0: "Hospitality", 1: "Healer", H: "Heatproof"},
	},
	poltchageistartisan: {
		inherit: true,
		abilities: {0: "Hospitality", 1: "Healer", H: "Heatproof"},
	},
	sinistchamasterpiece: {
		inherit: true,
		abilities: {0: "Hospitality", 1: "Healer", H: "Heatproof"},
	},
	ogerpon: {
		inherit: true,
		abilities: {0: "Defiant", H: "Seed Sower"},
	},
	scizor: {
		inherit: true,
		abilities: {0: "Swarm", 1: "Technician", H: "Exoskeleton"},
	},
	forretress: {
		inherit: true,
		abilities: {0: "Sturdy", 1: "Exoskeleton", H: "Overcoat"},
	},
	klawf: {
		inherit: true,
		abilities: {0: "Anger Shell", 1: "Exoskeleton", H: "Regenerator"},
	},
	corphish: {
		inherit: true,
		abilities: {0: "Hyper Cutter", 1: "Exoskeleton", H: "Adaptability"},
	},
	crawdaunt: {
		inherit: true,
		abilities: {0: "Hyper Cutter", 1: "Exoskeleton", H: "Adaptability"},
	},
	charjabug: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Swarm"},
	},
	vikavolt: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Swarm", H: "Exoskeleton"},
	},
	tyranitar: {
		inherit: true,
		abilities: {0: "Sand Stream", 1: "Exoskeleton", H: "Unnerve"},
	},
	pupitar: {
		inherit: true,
		abilities: {0: "Shed Skin", 1: "Exoskeleton"},
	},
	larvitar: {
		inherit: true,
		abilities: {0: "Guts", 1: "Exoskeleton", H: "Sand Veil"},
	},
	regidrago: {
		inherit: true,
		abilities: {0: "Dragon's Maw", H: "Blunt Force"},
	},
	tauros: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Blunt Force", H: "Cud Chew"},
	},
	dondozo: {
		inherit: true,
		abilities: {0: "Unaware", 1: "Blunt Force", H: "Water Veil"},
	},
	geodude: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Sturdy", H: "Sand Veil"},
	},
	graveler: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Sturdy", H: "Sand Veil"},
	},
	golem: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Sturdy", H: "Sand Veil"},
	},
	rufflet: {
		inherit: true,
		abilities: {0: "Fair Fight", 1: "Blunt Force", H: "Hustle"},
	},
	braviary: {
		inherit: true,
		abilities: {0: "Fair Fight", 1: "Blunt Force", H: "Defiant"},
	},
	braviaryhisui: {
		inherit: true,
		abilities: {0: "Fair Fight", 1: "Sheer Force", H: "Tinted Lens"},
	},
	volcanion: {
		inherit: true,
		abilities: {0: "Water Absorb", H: "Water Veil"},
	},
	silicobra: {
		inherit: true,
		abilities: {0: "Shed Skin", 1: "Sand Spit", H: "Shield Dust"},
	},
	sandaconda: {
		inherit: true,
		abilities: {0: "Shed Skin", 1: "Sand Spit", H: "Shield Dust"},
	},
	larvesta: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Shield Dust", H: "Swarm"},
	},
	volcarona: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Shield Dust", H: "Swarm"},
	},
	wochien: {
		inherit: true,
		abilities: {0: "Tablets of Ruin", H: "Shield Dust"},
	},
	flareon: {
		inherit: true,
		abilities: {0: "Smelt", H: "Fur Coat"},
	},
	glaceon: {
		inherit: true,
		abilities: {0: "Permafrost", H: "Muscle Memory"},
	},
	tarountula: {
		inherit: true,
		abilities: {0: "Insomnia", 1: "Steadfast", H: "Stakeout"},
	},
	spidops: {
		inherit: true,
		abilities: {0: "Insomnia", 1: "Steadfast", H: "Stakeout"},
	},
	cleffa: {
		inherit: true,
		abilities: {0: "Fairy Ringer", 1: "Magic Guard", H: "Friend Guard"},
	},
	clefairy: {
		inherit: true,
		abilities: {0: "Fairy Ringer", 1: "Magic Guard", H: "Friend Guard"},
	},
	clefable: {
		inherit: true,
		abilities: {0: "Fairy Ringer", 1: "Magic Guard", H: "Unaware"},
	},
	shroomish: {
		inherit: true,
		abilities: {0: "Fairy Ringer", 1: "Poison Heal", H: "Quick Feet"},
	},
	breloom: {
		inherit: true,
		abilities: {0: "Fairy Ringer", 1: "Poison Heal", H: "Technician"},
	},
	chingling: {
		inherit: true,
		abilities: {0: "Levitate", H: "Fairy Ringer"},
	},
	chimecho: {
		inherit: true,
		abilities: {0: "Levitate", H: "Fairy Ringer"},
	},
	hoothoot: {
		inherit: true,
		abilities: {0: "Synchronize", 1: "Fairy Ringer", H: "Tinted Lens"},
	},
	noctowl: {
		inherit: true,
		abilities: {0: "Synchronize", 1: "Fairy Ringer", H: "Tinted Lens"},
	},
	teddiursa: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Quick Feet", H: "Fairy Ringer"},
	},
	ursaring: {
		inherit: true,
		abilities: {0: "Guts", 1: "Quick Feet", H: "Fairy Ringer"},
	},
	ursaluna: {
		inherit: true,
		abilities: {0: "Guts", 1: "Bulletproof", H: "Fairy Ringer"},
	},
	charcadet: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Justified", H: "Flame Body"},
	},
	ceruledge: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Justified", H: "Weak Armor"},
	},
	armarouge: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Justified", H: "Weak Armor"},
	},
	rookidee: {
		inherit: true,
		abilities: {0: "Keen Eye", 1: "Justified", H: "Big Pecks"},
	},
	corvisquire: {
		inherit: true,
		abilities: {0: "Keen Eye", 1: "Justified", H: "Big Pecks"},
	},
	corviknight: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Justified", H: "Mirror Armor"},
	},
	cyclizar: {
		inherit: true,
		abilities: {0: "Shed Skin", 1: "Momentum", H: "Regenerator"},
	},
	bramblin: {
		inherit: true,
		abilities: {0: "Wind Rider", 1: "Momentum", H: "Infiltrator"},
	},
	brambleghast: {
		inherit: true,
		abilities: {0: "Wind Rider", 1: "Sand Rush", H: "Infiltrator"},
	},
	snorunt: {
		inherit: true,
		abilities: {0: "Inner Focus", 1: "Moody", H: "Permafrost"},
	},
	glalie: {
		inherit: true,
		abilities: {0: "Momentum", 1: "Moody", H: "Permafrost"},
	},
	okidogi: {
		inherit: true,
		abilities: {0: "Toxic Chain", H: "Intimidate"},
	},
	fezandipiti: {
		inherit: true,
		abilities: {0: "Toxic Chain", H: "Neutralizing Gas"},
	},
	munkidori: {
		inherit: true,
		abilities: {0: "Toxic Chain", H: "Magic Guard"},
	},
	sneasler: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Muscle Memory", H: "Poison Touch"},
	},
	lechonk: {
		inherit: true,
		abilities: {0: "Aroma Veil", 1: "Cud Chew", H: "Thick Fat"},
	},
	oinkologne: {
		inherit: true,
		abilities: {0: "Lingering Aroma", 1: "Cud Chew", H: "Thick Fat"},
	},
	oinkolognef: {
		inherit: true,
		abilities: {0: "Aroma Veil", 1: "Cud Chew", H: "Thick Fat"},
	},
	mareep: {
		inherit: true,
		abilities: {0: "Static", 1: "Cud Chew", H: "Plus"},
	},
	flaaffy: {
		inherit: true,
		abilities: {0: "Static", 1: "Cud Chew", H: "Plus"},
	},
	ampharos: {
		inherit: true,
		abilities: {0: "Static", 1: "Cud Chew", H: "Plus"},
	},
	cryogonal: {
		inherit: true,
		abilities: {0: "Levitate", H: "Permafrost"},
	},
	growlithehisui: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Prehistoric Might", H: "Rock Head"},
	},
	arcaninehisui: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Prehistoric Might", H: "Rock Head"},
	},
	growlithe: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Fair Fight", H: "Justified"},
	},
	arcanine: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Fair Fight", H: "Justified"},
	},
	kleavor: {
		inherit: true,
		abilities: {0: "Swarm", 1: "Prehistoric Might", H: "Sharpness"},
	},
	piloswine: {
		inherit: true,
		abilities: {0: "Oblivious", 1: "Prehistoric Might", H: "Thick Fat"},
	},
	mamoswine: {
		inherit: true,
		abilities: {0: "Oblivious", 1: "Prehistoric Might", H: "Thick Fat"},
	},
	yanma: {
		inherit: true,
		abilities: {0: "Speed Boost", 1: "Compound Eyes", H: "Prehistoric Might"},
	},
	yanmega: {
		inherit: true,
		abilities: {0: "Speed Boost", 1: "Tinted Lens", H: "Prehistoric Might"},
	},
	stonjourner: {
		inherit: true,
		abilities: {0: "Power Spot", H: "Prehistoric Might"},
	},
	walkingwake: {
		inherit: true,
		abilities: {0: "Protosynthesis", H: "Prehistoric Might"},
	},
	gallade: {
		inherit: true,
		abilities: {0: "Steadfast", 1: "Sharpness", H: "Justified"},
	},
	diancie: {
		inherit: true,
		abilities: {0: "Clear Body", H: "Synchronize"},
	},
	drowzee: {
		inherit: true,
		abilities: {0: "Insomnia", 1: "Forewarn", H: "Synchronize"},
	},
	hypno: {
		inherit: true,
		abilities: {0: "Insomnia", 1: "Forewarn", H: "Synchronize"},
	},
	bruxish: {
		inherit: true,
		abilities: {0: "Dazzling", 1: "Strong Jaw", H: "Synchronize"},
	},
	ditto: {
		inherit: true,
		abilities: {0: "Limber", 1: "Illusion", H: "Imposter"},
	},
	perrserker: {
		inherit: true,
		abilities: {0: "Steadfast", 1: "Tough Claws", H: "Steely Spirit"},
	},
	sunkern: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Early Bird", H: "Steadfast"},
	},
	sunflora: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Early Bird", H: "Steadfast"},
	},
	jangmoo: {
		inherit: true,
		abilities: {0: "Bulletproof", 1: "Fair Fight", H: "Overcoat"},
	},
	hakamoo: {
		inherit: true,
		abilities: {0: "Bulletproof", 1: "Fair Fight", H: "Overcoat"},
	},
	kommoo: {
		inherit: true,
		abilities: {0: "Bulletproof", 1: "Fair Fight", H: "Overcoat"},
	},
	oshawott: {
		inherit: true,
		abilities: {0: "Torrent", H: "Fair Fight"},
	},
	dewott: {
		inherit: true,
		abilities: {0: "Torrent", H: "Fair Fight"},
	},
	samurott: {
		inherit: true,
		abilities: {0: "Torrent", H: "Fair Fight"},
	},
	delphox: {
		inherit: true,
		types: ["Fire", "Fairy"],
	},
	blastoise: {
		inherit: true,
		abilities: {0: "Torrent", H: "Steely Spirit"},
	},
	vileplume: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Seed Sower", H: "Effect Spore"},
	},
	bellossom: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Seed Sower", H: "Healer"},
	},
	tentacool: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Liquid Ooze", H: "Water Veil"},
	},
	tentacruel: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Liquid Ooze", H: "Water Veil"},
	},
	doduo: {
		inherit: true,
		abilities: {0: "Muscle Memory", 1: "Sand Force", H: "Tangled Feet"},
	},
	dodrio: {
		inherit: true,
		abilities: {0: "Muscle Memory", 1: "Sand Force", H: "Tangled Feet"},
	},
	seel: {
		inherit: true,
		abilities: {0: "Thick Fat", 1: "Water Veil", H: "Cute Charm"},
	},
	dewgong: {
		inherit: true,
		abilities: {0: "Thick Fat", 1: "Water Veil", H: "Cute Charm"},
	},
	exeggcute: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Synchronize", H: "Seed Sower"},
	},
	exeggutor: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Synchronize", H: "Seed Sower"},
	},
	exeggutoralola: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Synchronize", H: "Harvest"},
	},
	tyrogue: {
		inherit: true,
		abilities: {0: "Muscle Memory", 1: "Guts", H: "Steadfast"},
	},
	hitmonlee: {
		inherit: true,
		abilities: {0: "Muscle Memory", 1: "Reckless", H: "Unburden"},
	},
	hitmonchan: {
		inherit: true,
		abilities: {0: "Muscle Memory", 1: "Iron Fist", H: "Inner Focus"},
	},
	hitmontop: {
		inherit: true,
		abilities: {0: "Momentum", 1: "Technician", H: "Steadfast"},
	},
	rhyhorn: {
		inherit: true,
		abilities: {0: "Overcoat", 1: "Rock Head", H: "Reckless"},
	},
	rhydon: {
		inherit: true,
		abilities: {0: "Overcoat", 1: "Rock Head", H: "Reckless"},
	},
	rhyperior: {
		inherit: true,
		abilities: {0: "Overcoat", 1: "Solid Rock", H: "Reckless"},
	},
	seadra: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Sniper", H: "Damp"},
	},
	elekid: {
		inherit: true,
		abilities: {0: "Static", 1: "Muscle Memory", H: "Vital Spirit"},
	},
	electabuzz: {
		inherit: true,
		abilities: {0: "Static", 1: "Muscle Memory", H: "Vital Spirit"},
	},
	electivire: {
		inherit: true,
		abilities: {0: "Static", 1: "Muscle Memory", H: "Vital Spirit"},
	},
	magby: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Smelt", H: "Vital Spirit"},
	},
	magmar: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Smelt", H: "Vital Spirit"},
	},
	magmortar: {
		inherit: true,
		abilities: {0: "Flame Body", 1: "Smelt", H: "Vital Spirit"},
	},
	lapras: {
		inherit: true,
		abilities: {0: "Water Absorb", 1: "Overcoat", H: "Hydration"},
	},
	porygonz: {
		inherit: true,
		abilities: {0: "Adaptability", 1: "Download", H: "Outclass"},
	},
	chikorita: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Sheer Heart"},
	},
	bayleef: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Sheer Heart"},
	},
	meganium: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Sheer Heart"},
	},
	chinchou: {
		inherit: true,
		abilities: {0: "Water Veil", 1: "Volt Absorb", H: "Water Absorb"},
	},
	lanturn: {
		inherit: true,
		abilities: {0: "Water Veil", 1: "Volt Absorb", H: "Water Absorb"},
	},
	snubbull: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Quick Feet", H: "Cute Charm"},
	},
	granbull: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Quick Feet", H: "Cute Charm"},
	},
	skarmory: {
		inherit: true,
		abilities: {0: "Battle Spines", 1: "Sturdy", H: "Steely Spirit"},
	},
	smeargle: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Technician", H: "Color Change"},
	},
	raikou: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Outclass", H: "Inner Focus"},
	},
	entei: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Smelt", H: "Inner Focus"},
	},
	suicune: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Cloud Nine", H: "Inner Focus"},
	},
	lugia: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Gale Wings", H: "Multiscale"},
	},
	hooh: {
		inherit: true,
		abilities: {0: "Pressure", 1: "Sunblock", H: "Regenerator"},
	},
	mudkip: {
		inherit: true,
		abilities: {0: "Torrent", H: "Mud Wash"},
	},
	marshtomp: {
		inherit: true,
		abilities: {0: "Torrent", H: "Mud Wash"},
	},
	swampert: {
		inherit: true,
		abilities: {0: "Torrent", H: "Mud Wash"},
	},
	trapinch: {
		inherit: true,
		abilities: {0: "Sand Spit", 1: "Arena Trap", H: "Sheer Force"},
	},
	vibrava: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Exoskeleton", H: "Prehistoric Might"},
	},
	flygon: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Exoskeleton", H: "Prehistoric Might"},
	},
	beldum: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Blunt Force", H: "Light Metal"},
	},
	metang: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Blunt Force", H: "Light Metal"},
	},
	metagross: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Blunt Force", H: "Light Metal"},
	},
	regirock: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Sand Force", H: "Sturdy"},
	},
	regice: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Permafrost", H: "Ice Body"},
	},
	cranidos: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Prehistoric Might", H: "Sheer Force"},
	},
	rampardos: {
		inherit: true,
		abilities: {0: "Blunt Force", 1: "Prehistoric Might", H: "Sheer Force"},
	},
	regigigas: {
		inherit: true,
		abilities: {0: "Slow Start", H: "Prehistoric Might"},
	},
	tepig: {
		inherit: true,
		abilities: {0: "Blaze", H: "Blunt Force"},
	},
	pignite: {
		inherit: true,
		abilities: {0: "Blaze", H: "Blunt Force"},
	},
	emboar: {
		inherit: true,
		abilities: {0: "Blaze", H: "Blunt Force"},
	},
	blitzle: {
		inherit: true,
		abilities: {0: "Lightning Rod", 1: "Muscle Memory", H: "Sap Sipper"},
	},
	zebstrika: {
		inherit: true,
		abilities: {0: "Lightning Rod", 1: "Muscle Memory", H: "Sap Sipper"},
	},
	solosis: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Magic Guard", H: "Regenerator"},
	},
	duosion: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Magic Guard", H: "Regenerator"},
	},
	reuniclus: {
		inherit: true,
		abilities: {0: "Outclass", 1: "Magic Guard", H: "Regenerator"},
	},
	golett: {
		inherit: true,
		abilities: {0: "Iron Fist", 1: "Prehistoric Might", H: "No Guard"},
	},
	golurk: {
		inherit: true,
		abilities: {0: "Iron Fist", 1: "Prehistoric Might", H: "No Guard"},
	},
	cobalion: {
		inherit: true,
		abilities: {0: "Justified", H: "Steely Spirit"},
	},
	terrakion: {
		inherit: true,
		abilities: {0: "Justified", H: "Muscle Memory"},
	},
	virizion: {
		inherit: true,
		abilities: {0: "Justified", H: "Fair Fight"},
	},
	kyurem: {
		inherit: true,
		abilities: {0: "Pressure", H: "Permafrost"},
	},
	keldeo: {
		inherit: true,
		abilities: {0: "Justified", H: "Water Veil"},
	},
	keldeoresolute: {
		inherit: true,
		abilities: {0: "Justified", H: "Water Veil"},
	},
	espurr: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Infiltrator", H: "Own Tempo"},
	},
	meowstic: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Infiltrator", H: "Prankster"},
	},
	meowsticf: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Infiltrator", H: "Competitive"},
	},
	inkay: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Contrary", H: "Color Change"},
	},
	malamar: {
		inherit: true,
		abilities: {0: "Green-Eyed", 1: "Contrary", H: "Color Change"},
	},
	dewpider: {
		inherit: true,
		abilities: {0: "Water Bubble", 1: "Overcoat", H: "Water Absorb"},
	},
	araquanid: {
		inherit: true,
		abilities: {0: "Water Bubble", 1: "Overcoat", H: "Water Absorb"},
	},
	comfey: {
		inherit: true,
		abilities: {0: "Fairy Ringer", 1: "Triage", H: "Natural Cure"},
	},
	minior: {
		inherit: true,
		abilities: {0: "Shields Down", H: "Cloud Nine"},
	},
	milcery: {
		inherit: true,
		abilities: {0: "Sweet Veil", 1: "Cute Charm", H: "Aroma Veil"},
	},
	alcremie: {
		inherit: true,
		abilities: {0: "Sweet Veil", 1: "Color Change", H: "Aroma Veil"},
	},
	gougingfire: {
		inherit: true,
		abilities: {0: "Protosynthesis", H: "Prehistoric Might"},
	},
	ragingbolt: {
		inherit: true,
		abilities: {0: "Protosynthesis", H: "Prehistoric Might"},
	},
	ironboulder: {
		inherit: true,
		abilities: {0: "Quark Drive", H: "Justified"},
	},
	ironcrown: {
		inherit: true,
		abilities: {0: "Quark Drive", H: "Justified"},
	},
	pecharunt: {
		inherit: true,
		abilities: {0: "Poison Puppeteer", H: "Green-Eyed"},
	},
};
