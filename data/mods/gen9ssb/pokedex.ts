export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	// Aelita
	melmetal: {
		inherit: true,
		abilities: {0: "Fortified Metal"},
	},

	// A Quag To The Past
	quagsire: {
		inherit: true,
		baseStats: {hp: 130, atk: 100, def: 75, spa: 20, spd: 60, spe: 45},
		abilities: {0: "Quag of Ruin"},
	},
	clodsire: {
		inherit: true,
		baseStats: {hp: 130, atk: 60, def: 75, spa: 40, spd: 100, spe: 20},
		abilities: {0: "Clod of Ruin"},
	},

	// Archas
	lilligant: {
		inherit: true,
		abilities: {0: "Saintly Bullet"},
	},

	// Blitz
	chiyu: {
		inherit: true,
		types: ['Water', 'Dark'],
		abilities: {0: "Blitz of Ruin"},
	},

	// Cake
	dudunsparcethreesegment: {
		inherit: true,
		abilities: {0: "Not Enough Removal"},
	},

	// Chloe
	tsareena: {
		inherit: true,
		abilities: {0: "Acetosa"},
	},

	// clerica
	mimikyu: {
		inherit: true,
		abilities: {0: "Masquerade"},
	},
	mimikyubusted: {
		inherit: true,
		abilities: {0: 'Masquerade'},
	},

	// Coolcodename
	victini: {
		inherit: true,
		abilities: {0: "Firewall"},
	},

	// Cor'Jon
	dachsbun: {
		inherit: true,
		abilities: {0: "Painful Exit"},
	},

	// Dawn of Artemis
	necrozma: {
		inherit: true,
		abilities: {0: "Form Change"},
	},
	necrozmaultra: {
		inherit: true,
		abilities: {0: "Form Change"},
	},

	// DaWoblefet
	wobbuffet: {
		inherit: true,
		abilities: {0: "Shadow Artifice"},
	},

	// deftinwolf
	yveltal: {
		inherit: true,
		abilities: {0: "Sharpness"},
	},

	// Eli
	thundurus: {
		inherit: true,
		abilities: {0: "Storm Surge"},
	},

	// Ganjafin
	wiglett: {
		inherit: true,
		baseStats: {hp: 80, atk: 60, def: 80, spa: 60, spd: 80, spe: 100},
		abilities: {0: "Gambling Addiction"},
	},

	// havi
	gastly: {
		inherit: true,
		baseStats: {hp: 60, atk: 65, def: 60, spa: 130, spd: 75, spe: 110},
		abilities: {0: "Mensis Cage"},
	},

	// HoeenHero
	ludicolo: {
		inherit: true,
		abilities: {0: "Misspelled"},
	},

	// hsy
	ursaluna: {
		inherit: true,
		abilities: {0: "Hustle"},
	},

	// in the hills
	gligar: {
		inherit: true,
		abilities: {0: "Illterit"},
	},

	// ironwater
	jirachi: {
		inherit: true,
		abilities: {0: "Good as Gold"},
	},

	// Irpachuza
	mrmime: {
		inherit: true,
		abilities: {0: "Mime knows best"},
	},

	// Isaiah
	stakataka: {
		inherit: true,
		types: ["Water", "Fighting"],
		abilities: {0: "Anchor Arms"},
	},

	// Kennedy
	cinderace: {
		inherit: true,
		abilities: {0: "Anfield"},
		otherFormes: ["Cinderace-Gmax"],
	},
	cinderacegmax: {
		inherit: true,
		types: ["Fire", "Ice"],
		baseStats: {hp: 84, atk: 119, def: 78, spa: 77, spd: 81, spe: 105},
		abilities: {0: "You'll Never Walk Alone"},
		weightkg: 103,
	},

	// Kris
	nymble: {
		inherit: true,
		baseStats: {hp: 110, atk: 200, def: 99, spa: 101, spd: 99, spe: 35},
		abilities: {0: "Cacophony"},
	},

	// Krytocon
	mawile: {
		inherit: true,
		abilities: {0: "Curse of Dexit"},
	},

	// Lumari
	ponytagalar: {
		inherit: true,
		abilities: {0: "Pyrotechnic"},
	},

	// Mad Monty
	castform: {
		inherit: true,
		abilities: {0: "Climate Change"},
	},

	// Mathy
	furret: {
		inherit: true,
		baseStats: {hp: 105, atk: 96, def: 84, spa: 45, spd: 75, spe: 110},
		abilities: {0: "Dynamic Typing"},
	},

	// Mex
	dialga: {
		inherit: true,
		abilities: {0: "Time Dilation"},
	},

	// Mia
	mewtwo: {
		inherit: true,
		abilities: {0: "Hacking"},
	},
	mewtwomegax: {
		inherit: true,
		abilities: {0: 'Hacking'},
	},

	// Ney
	banettemega: {
		inherit: true,
		abilities: {0: 'Prankster Plus'},
	},

	// Peary
	klinklang: {
		inherit: true,
		abilities: {0: "Levitate"},
	},

	// phoopes
	jynx: {
		inherit: true,
		abilities: {0: "I Did It Again"},
	},

	// PYRO
	kingambit: {
		inherit: true,
		abilities: {0: "Hardcore Hustle"},
	},

	// ReturnToMonkey
	oranguru: {
		inherit: true,
		abilities: {0: "Monke See Monke Do"},
	},

	// Rumia
	duskull: {
		inherit: true,
		baseStats: {hp: 50, atk: 55, def: 90, spa: 90, spd: 55, spe: 55},
		abilities: {0: 'Youkai of the Dusk'},
	},

	// Scotteh
	suicune: {
		inherit: true,
		abilities: {0: "Water Absorb"},
	},

	// sharp_claw
	sneasel: {
		inherit: true,
		baseStats: {hp: 55, atk: 105, def: 95, spa: 35, spd: 95, spe: 135},
		abilities: {0: 'Rough and Tumble'},
	},
	sneaselhisui: {
		inherit: true,
		baseStats: {hp: 55, atk: 135, def: 75, spa: 35, spd: 85, spe: 135},
		abilities: {0: 'Rough and Tumble'},
	},

	// spoo
	mumbao: {
		inherit: true,
		baseStats: {hp: 92, atk: 63, def: 96, spa: 104, spd: 97, spe: 124},
		abilities: {0: 'Dazzling'},
	},
	jumbao: {
		inherit: true,
		abilities: {0: 'Drought'},
	},

	// Swiffix
	piplup: {
		inherit: true,
		baseStats: {hp: 84, atk: 66, def: 88, spa: 81, spd: 101, spe: 50},
		abilities: {0: "Stinky"},
	},

	// Theia
	litwick: {
		inherit: true,
		abilities: {0: "Power Abuse"},
	},

	// TheJesuchristoOsAma
	arceus: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusbug: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusdark: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusdragon: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceuselectric: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusfairy: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusfighting: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusfire: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusflying: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusghost: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusgrass: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusground: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusice: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceuspoison: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceuspsychic: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceusrock: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceussteel: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},
	arceuswater: {
		inherit: true,
		abilities: {0: "The Grace of Jesus Christ"},
	},

	// trace
	delphox: {
		inherit: true,
		abilities: {0: "Eyes of Eternity"},
	},

	// UT
	talonflame: {
		inherit: true,
		abilities: {0: "Gale Guard"},
	},

	// umowu
	pikachu: {
		inherit: true,
		baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120},
		abilities: {0: "Soul Surfer"},
	},

	// Venous
	mantine: {
		inherit: true,
		abilities: {0: "Concrete Over Water"},
	},

	// Violet
	ironvaliant: {
		inherit: true,
		abilities: {0: "Scarlet Aeonia"},
	},

	// WigglyTree
	sudowoodo: {
		inherit: true,
		abilities: {0: "Tree Stance"},
	},

	// Yellow Paint
	rotomfrost: {
		inherit: true,
		abilities: {0: "Yellow Magic"},
	},

	// Zalm
	weedle: {
		inherit: true,
		baseStats: {hp: 100, atk: 90, def: 100, spa: 35, spd: 90, spe: 100},
	},
};
