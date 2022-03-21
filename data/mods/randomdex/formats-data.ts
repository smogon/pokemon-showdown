export const FormatsData: {[k: string]: SpeciesFormatsData} = {
/*
	aerodactyl: {
		tier: "OU",
		doublesTier: "DOU",
	},
	ekans: {
		tier: "LC",
		doublesTier: "LC",
	},
	arbok: {
		tier: "OU",
		doublesTier: "DOU",
	},
	growlithe: {
		tier: "LC",
		doublesTier: "LC",
	},
	arcanine: {
		tier: "OU",
		doublesTier: "DOU",
	},
	archen: {
		tier: "LC",
		doublesTier: "LC",
	},
	archeops: {
		tier: "OU",
		doublesTier: "DOU",
	},
	articunogalar: {
		tier: "OU",
		doublesTier: "DOU",
	},
	shuppet: {
		tier: "LC",
		doublesTier: "LC",
	},
	banette: {
		tier: "OU",
		doublesTier: "DOU",
	},
	oddish: {
		tier: "LC",
		doublesTier: "LC",
	},
	gloom: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	bellossom: {
		tier: "OU",
		doublesTier: "DOU",
	},
	vileplume: {
		tier: "OU",
		doublesTier: "DOU",
	},
	bidoof: {
		tier: "LC",
		doublesTier: "LC",
	},
	bibarel: {
		tier: "OU",
		doublesTier: "DOU",
	},
	yamper: {
		tier: "LC",
		doublesTier: "LC",
	},
	boltund: {
		tier: "OU",
		doublesTier: "DOU",
	},
	charmander: {
		tier: "LC",
		doublesTier: "LC",
	},
	charmeleon: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	charizard: {
		tier: "OU",
		doublesTier: "DOU",
	},
	chingling: {
		tier: "LC",
		doublesTier: "LC",
	},
	chimecho: {
		tier: "OU",
		doublesTier: "DOU",
	},
	clauncher: {
		tier: "LC",
		doublesTier: "LC",
	},
	clawitzer: {
		tier: "OU",
		doublesTier: "DOU",
	},
	rolycoly: {
		tier: "LC",
		doublesTier: "LC",
	},
	carkol: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	coalossal: {
		tier: "OU",
		doublesTier: "DOU",
	},
	cufant: {
		tier: "LC",
		doublesTier: "LC",
	},
	copperajah: {
		tier: "OU",
		doublesTier: "DOU",
	},
	lileep: {
		tier: "LC",
		doublesTier: "LC",
	},
	cradily: {
		tier: "OU",
		doublesTier: "DOU",
	},
	corsolagalar: {
		tier: "LC",
		doublesTier: "LC",
	},
	cursola: {
		tier: "OU",
		doublesTier: "DOU",
	},
	dedenne: {
		tier: "OU",
		doublesTier: "DOU",
	},
	skrelp: {
		tier: "LC",
		doublesTier: "LC",
	},
	dragalge: {
		tier: "OU",
		doublesTier: "DOU",
	},
	drampa: {
		tier: "OU",
		doublesTier: "DOU",
	},
	chewtle: {
		tier: "LC",
		doublesTier: "LC",
	},
	drednaw: {
		tier: "OU",
		doublesTier: "DOU",
	},
	druddigon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	diglett: {
		tier: "LC",
		doublesTier: "LC",
	},
	dugtrio: {
		tier: "OU",
		doublesTier: "DOU",
	},
	eevee: {
		tier: "LC",
		doublesTier: "LC",
	},
	vaporeon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	jolteon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	flareon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	espeon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	umbreon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	leafeon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	glaceon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sylveon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	drilbur: {
		tier: "LC",
		doublesTier: "LC",
	},
	excadrill: {
		tier: "OU",
		doublesTier: "DOU",
	},
	totodile: {
		tier: "LC",
		doublesTier: "LC",
	},
	croconaw: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	feraligatr: {
		tier: "OU",
		doublesTier: "DOU",
	},
	flabebe: {
		tier: "LC",
		doublesTier: "LC",
	},
	floette: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	florges: {
		tier: "OU",
		doublesTier: "DOU",
	},
	snorunt: {
		tier: "LC",
		doublesTier: "LC",
	},
	glalie: {
		tier: "OU",
		doublesTier: "DOU",
	},
	froslass: {
		tier: "OU",
		doublesTier: "DOU",
	},
	snom: {
		tier: "LC",
		doublesTier: "LC",
	},
	frosmoth: {
		tier: "OU",
		doublesTier: "DOU",
	},
	girafarig: {
		tier: "OU",
		doublesTier: "DOU",
	},
	golett: {
		tier: "LC",
		doublesTier: "LC",
	},
	golurk: {
		tier: "OU",
		doublesTier: "DOU",
	},
	impidimp: {
		tier: "LC",
		doublesTier: "LC",
	},
	morgrem: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	grimmsnarl: {
		tier: "OU",
		doublesTier: "DOU",
	},
	groudon: {
		tier: "Uber",
		doublesTier: "DOU",
	},
	hippopotas: {
		tier: "LC",
		doublesTier: "LC",
	},
	hippowdon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tyrogue: {
		tier: "LC",
		doublesTier: "LC",
	},
	hitmonlee: {
		tier: "OU",
		doublesTier: "DOU",
	},
	hitmonchan: {
		tier: "OU",
		doublesTier: "DOU",
	},
	hitmontop: {
		tier: "OU",
		doublesTier: "DOU",
	},
	houndour: {
		tier: "LC",
		doublesTier: "LC",
	},
	houndoom: {
		tier: "OU",
		doublesTier: "DOU",
	},
	indeedee: {
		tier: "OU",
		doublesTier: "DOU",
	},
	indeedeef: {
		tier: "OU",
		doublesTier: "DOU",
	},
	chimchar: {
		tier: "LC",
		doublesTier: "LC",
	},
	monferno: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	infernape: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sobble: {
		tier: "LC",
		doublesTier: "LC",
	},
	drizzile: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	inteleon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	kangaskhan: {
		tier: "OU",
		doublesTier: "DOU",
	},
	kangaskhanmega: {
		tier: "Uber",
		doublesTier: "DOU",
	},
	klefki: {
		tier: "OU",
		doublesTier: "DOU",
	},
	komala: {
		tier: "OU",
		doublesTier: "DOU",
	},
	kyurem: {
		tier: "OU",
		doublesTier: "DOU",
	},
	kyuremwhite: {
		tier: "Uber",
		doublesTier: "DOU",
	},
	landorus: {
		tier: "OU",
		doublesTier: "DOU",
	},
	landorustherian: {
		tier: "OU",
		doublesTier: "DOU",
	},
	latias: {
		tier: "OU",
		doublesTier: "DOU",
	},
	zigzagoon: {
		tier: "LC",
		doublesTier: "LC",
	},
	linoone: {
		tier: "OU",
		doublesTier: "DOU",
	},
	luvdisc: {
		tier: "OU",
		doublesTier: "DOU",
	},
	inkay: {
		tier: "LC",
		doublesTier: "LC",
	},
	malamar: {
		tier: "OU",
		doublesTier: "DOU",
	},
	electrike: {
		tier: "LC",
		doublesTier: "LC",
	},
	manectric: {
		tier: "OU",
		doublesTier: "DOU",
	},
	moltres: {
		tier: "OU",
		doublesTier: "DOU",
	},
	moltresgalar: {
		tier: "OU",
		doublesTier: "DOU",
	},
	mimejr: {
		tier: "LC",
		doublesTier: "LC",
	},
	mrmime: {
		tier: "OU",
		doublesTier: "DOU",
	},
	zigzagoongalar: {
		tier: "LC",
		doublesTier: "LC",
	},
	linoonegalar: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	obstagoon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	remoraid: {
		tier: "LC",
		doublesTier: "LC",
	},
	octillery: {
		tier: "OU",
		doublesTier: "DOU",
	},
	omanyte: {
		tier: "LC",
		doublesTier: "LC",
	},
	omastar: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sandygast: {
		tier: "LC",
		doublesTier: "LC",
	},
	palossand: {
		tier: "OU",
		doublesTier: "DOU",
	},
	nosepass: {
		tier: "LC",
		doublesTier: "LC",
	},
	probopass: {
		tier: "OU",
		doublesTier: "DOU",
	},
	pyukumuku: {
		tier: "OU",
		doublesTier: "DOU",
	},
	regice: {
		tier: "OU",
		doublesTier: "DOU",
	},
	relicanth: {
		tier: "OU",
		doublesTier: "DOU",
	},
	reshiram: {
		tier: "Uber",
		doublesTier: "DOU",
	},
	yamaskgalar: {
		tier: "LC",
		doublesTier: "LC",
	},
	runerigus: {
		tier: "OU",
		doublesTier: "DOU",
	},
	salandit: {
		tier: "LC",
		doublesTier: "LC",
	},
	salazzle: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sandshrewalola: {
		tier: "LC",
		doublesTier: "LC",
	},
	sandslashalola: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sawk: {
		tier: "OU",
		doublesTier: "DOU",
	},
	farfetchdgalar: {
		tier: "LC",
		doublesTier: "LC",
	},
	sirfetchd: {
		tier: "OU",
		doublesTier: "DOU",
	},
	spectrier: {
		tier: "OU",
		doublesTier: "DOU",
	},
	spinda: {
		tier: "OU",
		doublesTier: "DOU",
	},
	stakataka: {
		tier: "OU",
		doublesTier: "DOU",
	},
	lillipup: {
		tier: "LC",
		doublesTier: "LC",
	},
	herdier: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	stoutland: {
		tier: "OU",
		doublesTier: "DOU",
	},
	stunfiskgalar: {
		tier: "OU",
		doublesTier: "DOU",
	},
	taillow: {
		tier: "LC",
		doublesTier: "LC",
	},
	swellow: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tapubulu: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tapufini: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tauros: {
		tier: "OU",
		doublesTier: "DOU",
	},
	togedemaru: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tyrunt: {
		tier: "LC",
		doublesTier: "LC",
	},
	tyrantrum: {
		tier: "OU",
		doublesTier: "DOU",
	},
	bulbasaur: {
		tier: "LC",
		doublesTier: "LC",
	},
	ivysaur: {
		tier: "NFE",
		doublesTier: "NFE",
	},
	venusaur: {
		tier: "OU",
		doublesTier: "DOU",
	},
	volbeat: {
		tier: "OU",
		doublesTier: "DOU",
	},
	cottonee: {
		tier: "LC",
		doublesTier: "LC",
	},
	whimsicott: {
		tier: "OU",
		doublesTier: "DOU",
	},
	zarude: {
		tier: "OU",
		doublesTier: "DOU",
	},
*/
	tapubulu: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tapufini: {
		tier: "OU",
		doublesTier: "DOU",
	},
	absol: {
		tier: "OU",
		doublesTier: "DOU",
	},
	absolmega: {
		tier: "OU",
		doublesTier: "DOU",
	},
	appletun: {
		tier: "OU",
		doublesTier: "DOU",
	},
	applin: {
		tier: "LC",
		doublesTier: "DOU",
	},
	articuno: {
		tier: "OU",
		doublesTier: "DOU",
	},
	aurorus: {
		tier: "OU",
		doublesTier: "DOU",
	},
	amaura: {
		tier: "LC",
		doublesTier: "DOU",
	},
	basculin: {
		tier: "OU",
		doublesTier: "DOU",
	},
	basculinbluestriped: {
		tier: "OU",
		doublesTier: "DOU",
	},
	beartic: {
		tier: "OU",
		doublesTier: "DOU",
	},
	cubchoo: {
		tier: "LC",
		doublesTier: "DOU",
	},
	bisharp: {
		tier: "OU",
		doublesTier: "DOU",
	},
	pawniard: {
		tier: "LC",
		doublesTier: "DOU",
	},
	calyrex: {
		tier: "OU",
		doublesTier: "DOU",
	},
	camerupt: {
		tier: "OU",
		doublesTier: "DOU",
	},
	cameruptmega: {
		tier: "OU",
		doublesTier: "DOU",
	},
	numel: {
		tier: "LC",
		doublesTier: "DOU",
	},
	celesteela: {
		tier: "OU",
		doublesTier: "DOU",
	},
	cloyster: {
		tier: "OU",
		doublesTier: "DOU",
	},
	shellder: {
		tier: "LC",
		doublesTier: "DOU",
	},
	crawdaunt: {
		tier: "OU",
		doublesTier: "DOU",
	},
	corphish: {
		tier: "LC",
		doublesTier: "DOU",
	},
	cursola: {
		tier: "OU",
		doublesTier: "DOU",
	},
	corsolagalar: {
		tier: "LC",
		doublesTier: "DOU",
	},
	dedenne: {
		tier: "OU",
		doublesTier: "DOU",
	},
	delibird: {
		tier: "OU",
		doublesTier: "DOU",
	},
	eelektross: {
		tier: "OU",
		doublesTier: "DOU",
	},
	eelektrik: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	tynamo: {
		tier: "LC",
		doublesTier: "DOU",
	},
	espeon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	eevee: {
		tier: "LC",
		doublesTier: "DOU",
	},
	flapple: {
		tier: "OU",
		doublesTier: "DOU",
	},
	flareon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	flygon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	vibrava: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	trapinch: {
		tier: "LC",
		doublesTier: "DOU",
	},
	galvantula: {
		tier: "OU",
		doublesTier: "DOU",
	},
	joltik: {
		tier: "LC",
		doublesTier: "DOU",
	},
	girafarig: {
		tier: "OU",
		doublesTier: "DOU",
	},
	glaceon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	goodra: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sliggoo: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	goomy: {
		tier: "LC",
		doublesTier: "DOU",
	},
	gourgeist: {
		tier: "OU",
		doublesTier: "DOU",
	},
	gourgeistsmall: {
		tier: "OU",
		doublesTier: "DOU",
	},
	gourgeistsuper: {
		tier: "OU",
		doublesTier: "DOU",
	},
	gourgeistlarge: {
		tier: "OU",
		doublesTier: "DOU",
	},
	pumpkaboo: {
		tier: "LC",
		doublesTier: "DOU",
	},
	pumpkaboosmall: {
		tier: "LC",
		doublesTier: "DOU",
	},
	pumpkaboosuper: {
		tier: "LC",
		doublesTier: "DOU",
	},
	pumpkaboolarge: {
		tier: "LC",
		doublesTier: "DOU",
	},
	grimmsnarl: {
		tier: "OU",
		doublesTier: "DOU",
	},
	morgrem: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	impidimp: {
		tier: "LC",
		doublesTier: "DOU",
	},
	guzzlord: {
		tier: "OU",
		doublesTier: "DOU",
	},
	heliolisk: {
		tier: "OU",
		doublesTier: "DOU",
	},
	helioptile: {
		tier: "LC",
		doublesTier: "DOU",
	},
	hitmonchan: {
		tier: "OU",
		doublesTier: "DOU",
	},
	hitmonlee: {
		tier: "OU",
		doublesTier: "DOU",
	},
	hitmontop: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tyrogue: {
		tier: "LC",
		doublesTier: "DOU",
	},
	incineroar: {
		tier: "OU",
		doublesTier: "DOU",
	},
	torracat: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	litten: {
		tier: "LC",
		doublesTier: "DOU",
	},
	indeedee: {
		tier: "OU",
		doublesTier: "DOU",
	},
	indeedeef: {
		tier: "OU",
		doublesTier: "DOU",
	},
	jolteon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	kangaskhan: {
		tier: "OU",
		doublesTier: "DOU",
	},
	kangaskhanmega: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	kartana: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	kommoo: {
		tier: "OU",
		doublesTier: "DOU",
	},
	jangmoo: {
		tier: "LC",
		doublesTier: "DOU",
	},
	hakamoo: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	kyurem: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	lanturn: {
		tier: "OU",
		doublesTier: "DOU",
	},
	chinchou: {
		tier: "LC",
		doublesTier: "DOU",
	},
	leafeon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	leavanny: {
		tier: "OU",
		doublesTier: "DOU",
	},
	swadloon: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	sewaddle: {
		tier: "LC",
		doublesTier: "DOU",
	},
	ludicolo: {
		tier: "OU",
		doublesTier: "DOU",
	},
	lombre: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	lotad: {
		tier: "LC",
		doublesTier: "DOU",
	},
	lunatone: {
		tier: "OU",
		doublesTier: "DOU",
	},
	luvdisc: {
		tier: "OU",
		doublesTier: "DOU",
	},
	machamp: {
		tier: "OU",
		doublesTier: "DOU",
	},
	machoke: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	machop: {
		tier: "LC",
		doublesTier: "DOU",
	},
	mandibuzz: {
		tier: "OU",
		doublesTier: "DOU",
	},
	vullaby: {
		tier: "LC",
		doublesTier: "DOU",
	},
	medicham: {
		tier: "OU",
		doublesTier: "DOU",
	},
	medichammega: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	meditite: {
		tier: "LC",
		doublesTier: "DOU",
	},
	nihilego: {
		tier: "OU",
		doublesTier: "DOU",
	},
	palossand: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sandygast: {
		tier: "LC",
		doublesTier: "DOU",
	},
	pidgeotmega: {
		tier: "OU",
		doublesTier: "DOU",
	},
	pidgeot: {
		tier: "OU",
		doublesTier: "DOU",
	},
	pidgeotto: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	pidgey: {
		tier: "LC",
		doublesTier: "DOU",
	},
	probopass: {
		tier: "OU",
		doublesTier: "DOU",
	},
	nosepass: {
		tier: "LC",
		doublesTier: "DOU",
	},
	pyroar: {
		tier: "OU",
		doublesTier: "DOU",
	},
	litleo: {
		tier: "LC",
		doublesTier: "DOU",
	},
	sawk: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sceptilemega: {
		tier: "OU",
		doublesTier: "DOU",
	},
	sceptile: {
		tier: "OU",
		doublesTier: "DOU",
	},
	grovyle: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	treecko: {
		tier: "LC",
		doublesTier: "DOU",
	},
	scolipede: {
		tier: "OU",
		doublesTier: "DOU",
	},
	whirlipede: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	venipede: {
		tier: "LC",
		doublesTier: "DOU",
	},
	shiftry: {
		tier: "OU",
		doublesTier: "DOU",
	},
	nuzleaf: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	seedot: {
		tier: "LC",
		doublesTier: "DOU",
	},
	simisage: {
		tier: "OU",
		doublesTier: "DOU",
	},
	pansage: {
		tier: "LC",
		doublesTier: "DOU",
	},
	slowbro: {
		tier: "OU",
		doublesTier: "DOU",
	},
	slowbromega: {
		tier: "OU",
		doublesTier: "DOU",
	},
	slowking: {
		tier: "OU",
		doublesTier: "DOU",
	},
	slowpoke: {
		tier: "LC",
		doublesTier: "DOU",
	},
	sylveon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tauros: {
		tier: "OU",
		doublesTier: "DOU",
	},
	typhlosion: {
		tier: "OU",
		doublesTier: "DOU",
	},
	quilava: {
		tier: "NFE",
		doublesTier: "DOU",
	},
	cyndaquil: {
		tier: "LC",
		doublesTier: "DOU",
	},
	umbreon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	ursaring: {
		tier: "OU",
		doublesTier: "DOU",
	},
	teddiursa: {
		tier: "LC",
		doublesTier: "DOU",
	},
	vaporeon: {
		tier: "OU",
		doublesTier: "DOU",
	},
	whiscash: {
		tier: "OU",
		doublesTier: "DOU",
	},
	barboach: {
		tier: "LC",
		doublesTier: "DOU",
	},
	wishiwashi: {
		tier: "OU",
		doublesTier: "DOU",
	},
	zebstrika: {
		tier: "OU",
		doublesTier: "DOU",
	},
	blitzle: {
		tier: "LC",
		doublesTier: "DOU",
	},
};
