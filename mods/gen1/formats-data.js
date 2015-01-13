exports.BattleFormatsData = {
	bulbasaur: {
		randomBattleMoves: ["razorleaf","sleeppowder","swordsdance","bodyslam"],
		tier: "LC"
	},
	ivysaur: {
		randomBattleMoves: ["razorleaf","sleeppowder","swordsdance","bodyslam"],
		tier: "UU"
	},
	venusaur: {
		randomBattleMoves: ["razorleaf","sleeppowder","swordsdance","bodyslam"],
		tier: "UU"
	},
	charmander: {
		randomBattleMoves: ["fireblast","bodyslam","swordsdance","hyperbeam","flamethrower","fire spin"],
		tier: "LC"
	},
	charmeleon: {
		randomBattleMoves: ["fireblast","bodyslam","swordsdance","hyperbeam","flamethrower","fire spin"],
		tier: "UU"
	},
	charizard: {
		randomBattleMoves: ["fireblast","earthquake","bodyslam","swordsdance","hyperbeam","fire spin","flamethrower"],
		tier: "UU"
	},
	//Thoughts on Rest on these? They're pretty bulky and it's not a very hard hitting tier.
	squirtle: {
		randomBattleMoves: ["surf","blizzard","bodyslam","mimic","hydro pump","rest"],
		tier: "LC"
	},
	//I think we neeed to make rest+hydro pump an illegal combo maybe? I dunno how bad do you think it would be?
	wartortle: {
		randomBattleMoves: ["surf","blizzard","bodyslam","mimic","hydro pump","rest"],
		tier: "UU"
	},
	//Hyper Beam and earthquake are kinda key moves that differentiate it from other mons..
	blastoise: {
		randomBattleMoves: ["surf","blizzard","bodyslam","earthquake","hyper beam"],
		tier: "UU"
	},
	caterpie: {
		randomBattleMoves:["string shot","tackle"]
		tier: "LC"
	},
	metapod: {
		randomBattleMoves:["string shot","tackle","harden"]
		tier: "UU"
	},
	//Added Hyper Beam as an option since its attack's still pretty good and it makes stuff more interesting.
	//Code needs to be adjusted to make sure it always gets psychic/sleep powder/stun spore somehow
	butterfree: {
		randomBattleMoves: ["psychic","megadrain","sleeppowder","stunspore","hyper beam"],
		tier: "UU"
	},
	weedle: {
		randomBattleMoves: ["poison sting","string shot"]
		tier: "LC"
	},
	kakuna: {
		randomBattleMoves: ["poison sting","string shot","harden"]
		tier: "UU"
	},
	beedrill: {
		randomBattleMoves: ["twineedle","hyperbeam","swordsdance","agility","mega drain",],
		tier: "UU"
	},
	//Basically, this line of pokemon is fairly bulky so imo reflect+rest is a legitimate combo.
	//Reflect is probably bad without rest on them though. Should probably hold true for all pokemon and be implemented for all.
	//Sky Attack is good enough considering how bad its movepool is.
	//Sand Attack might as well be too. Whatever it has is bad tbf.
	//Just so long as it has at least 1 attack other than Sky Attack and Mirror Move. Aka, Double Edge=Mandatory o.o
	pidgey: {
		randomBattleMoves: ["doubleedge","agility","mimic","mirrormove","skyattack","rest","reflect","sandattack"],
		tier: "LC"
	},
	pidgeotto: {
		randomBattleMoves: ["doubleedge","agility","mimic","mirrormove","skyattack","rest","reflect"],
		tier: "UU"
	},
	//Hyper Beam is also unacceptable on its own, so Double Edge is still mandatory.
	pidgeot: {
		randomBattleMoves: ["doubleedge","hyperbeam","agility","mimic","mirrormove","skyattack","rest","reflect"],
		tier: "UU"
	},
	//Does not get Hyper Beam like its evolution, so carrying 2/3 of blizz/bubblebeam/tbolt is fine.
	//Super Fang and Body Slam mandatory on both.
	rattata: {
		randomBattleMoves: ["superfang","bodyslam","blizzard","bubblebeam","thunderbolt"],
		tier: "LC"
	},
	//All moves mandatory bar Blizz/Bubble - how to code this in? Maybe make them reject eachother?
	raticate: {
		randomBattleMoves: ["superfang","bodyslam","hyperbeam","blizzard","bubblebeam"],
		tier: "UU"
	},
	//Hyper Beam removed, it does not learn it. Agility added to complete the set.
	spearow: {
		randomBattleMoves: ["drillpeck","doubleedge","mirrormove","agility"],
		tier: "LC"
	},
	fearow: {
		randomBattleMoves: ["drillpeck","doubleedge","hyperbeam","agility","mirrormove"],
		eventPokemon: [
			{"generation":1,"level":20,"moves":["growl","leer","furyattack","payday"]}
		],
		tier: "UU"
	},
	//Needs to be coded so that it always has wrap+glare+earthquake
	ekans: {
		randomBattleMoves: ["wrap","glare","earthquake","bodyslam","rockslide"]
		tier: "LC"
	},
	//Consider allowing Body Slam onto its moveset so long as it's never used alongside hyper beam?
	arbok: {
		randomBattleMoves: ["earthquake","wrap","glare","hyperbeam"],
		tier: "UU"
	},
	pikachu: {
		randomBattleMoves: ["thunderbolt","thunderwave","surf","bodyslam","agility"],
		eventPokemon: [
			{"generation":1,"level":5,"moves":["surf"]},
			{"generation":1,"level":5,"moves":["fly"]},
			{"generation":1,"level":5,"moves":["thundershock","growl","surf"]}
		],
		tier: "LC"
	},
	//I customised this to my personal set that's reasonably viable in OU, since it can beat 30% Chansey/Egg,
	//but I can see allowing Thunder Wave onto here possibly. It's meant to be a very all-or-nothing pokemon.
	//Pikachu should probably stay as is though (with agility added)..
	raichu: {
		randomBattleMoves: ["thunderbolt","agility","surf","hyperbeam"],
		tier: "UU"
	},
	sandshrew: {
		tier: "LC"
	},
	sandslash: {
		randomBattleMoves: ["earthquake","swordsdance","hyperbeam","bodyslam","rockslide","substitute"],
		tier: "UU"
	},
	nidoranf: {
		tier: "LC"
	},
	nidorina: {
		randomBattleMoves: ["bodyslam","blizzard","thunder","thunderbolt","bubblebeam","doubleedge","leer","rest","substitute"],
		tier: "NFE"
	},
	nidoqueen: {
		randomBattleMoves: ["earthquake","blizzard","thunder","thunderbolt","bodyslam"],
		tier: "UU"
	},
	nidoranm: {
		tier: "LC"
	},
	nidorino: {
		randomBattleMoves: ["bodyslam","blizzard","thunder","thunderbolt","bubblebeam","doubleedge","leer","rest","substitute"],
		tier: "NFE"
	},
	nidoking: {
		randomBattleMoves: ["earthquake","blizzard","thunder","thunderbolt","bodyslam"],
		tier: "UU"
	},
	clefairy: {
		tier: "LC"
	},
	clefable: {
		randomBattleMoves: ["blizzard","bodyslam","hyperbeam","thunderwave","thunderbolt","counter","sing","thunder"],
		tier: "UU"
	},
	vulpix: {
		tier: "LC"
	},
	ninetales: {
		randomBattleMoves: ["fireblast","bodyslam","confuseray","firespin"],
		tier: "UU"
	},
	jigglypuff: {
		tier: "LC"
	},
	wigglytuff: {
		randomBattleMoves: ["thunderwave","bodyslam","doubleedge","hyperbeam","blizzard","bubblebeam"],
		tier: "UU"
	},
	zubat: {
		tier: "LC"
	},
	golbat: {
		randomBattleMoves: ["screech","confuseray","doubleedge","hyperbeam","megadrain"],
		tier: "UU"
	},
	oddish: {
		tier: "LC"
	},
	gloom: {
		randomBattleMoves: ["sleeppowder","swordsdance","bodyslam","megadrain"],
		tier: "UU"
	},
	vileplume: {
		randomBattleMoves: ["sleeppowder","swordsdance","bodyslam","megadrain"],
		tier: "UU"
	},
	paras: {
		tier: "LC"
	},
	parasect: {
		randomBattleMoves: ["spore","stunspore","swordsdance","bodyslam","slash","megadrain"],
		tier: "UU"
	},
	venonat: {
		tier: "LC"
	},
	venomoth: {
		randomBattleMoves: ["psychic","megadrain","sleeppowder","stunspore"],
		tier: "UU"
	},
	diglett: {
		tier: "LC"
	},
	dugtrio: {
		randomBattleMoves: ["earthquake","slash","sandattack","mimic","substitute"],
		tier: "UU"
	},
	meowth: {
		tier: "LC"
	},
	persian: {
		randomBattleMoves: ["slash","bubblebeam","hyperbeam","bodyslam","screech","thunderbolt"],
		tier: "OU"
	},
	psyduck: {
		eventPokemon: [
			{"generation":1,"level":15,"moves":["scratch","amnesia"]}
		],
		tier: "LC"
	},
	golduck: {
		randomBattleMoves: ["amnesia","blizzard","icebeam","surf","bodyslam","rest"],
		tier: "UU"
	},
	mankey: {
		tier: "LC"
	},
	primeape: {
		randomBattleMoves: ["submission","rockslide","bodyslam","hyperbeam","megakick"],
		tier: "UU"
	},
	growlithe: {
		tier: "LC"
	},
	arcanine: {
		randomBattleMoves: ["fireblast","bodyslam","hyperbeam","mimic","reflect"],
		tier: "UU"
	},
	poliwag: {
		tier: "LC"
	},
	poliwhirl: {
		tier: "UU"
	},
	poliwrath: {
		randomBattleMoves: ["blizzard","hypnosis","amnesia","surf","submission"],
		tier: "UU"
	},
	politoed: {
		tier: "UU"
	},
	abra: {
		tier: "LC"
	},
	kadabra: {
		randomBattleMoves: ["recover","psychic","thunderwave","reflect","seismictoss"],
		tier: "UU"
	},
	alakazam: {
		randomBattleMoves: ["recover","psychic","thunderwave","reflect","seismictoss"],
		tier: "OU"
	},
	machop: {
		tier: "LC"
	},
	machoke: {
		randomBattleMoves: ["bodyslam","earthquake","hyperbeam","submission"],
		tier: "UU"
	},
	machamp: {
		randomBattleMoves: ["bodyslam","earthquake","hyperbeam","submission"],
		tier: "UU"
	},
	bellsprout: {
		tier: "LC"
	},
	weepinbell: {
		tier: "UU"
	},
	victreebel: {
		randomBattleMoves: ["razorleaf","swordsdance","sleeppowder","bodyslam","hyperbeam","stunspore","wrap"],
		tier: "UU"
	},
	tentacool: {
		tier: "LC"
	},
	tentacruel: {
		randomBattleMoves: ["swordsdance","wrap","blizzard","hyperbeam","hydropump","surf"],
		tier: "UU"
	},
	geodude: {
		tier: "LC"
	},
	graveler: {
		randomBattleMoves: ["bodyslam","earthquake","rockslide","explosion"],
		tier: "UU"
	},
	golem: {
		randomBattleMoves: ["explosion","bodyslam","earthquake","rockslide"],
		tier: "OU"
	},
	ponyta: {
		tier: "LC"
	},
	rapidash: {
		randomBattleMoves: ["fireblast","agility","bodyslam","firespin"],
		eventPokemon: [
			{"generation":1,"level":40,"moves":["ember","firespin","stomp","payday"]}
		],
		tier: "UU"
	},
	slowpoke: {
		tier: "LC"
	},
	slowbro: {
		randomBattleMoves: ["amnesia","surf","thunderwave","rest"],
		tier: "OU"
	},
	magnemite: {
		tier: "LC"
	},
	magneton: {
		randomBattleMoves: ["thunderwave","thunder","thunderbolt","mimic","doubleedge","hyperbeam"],
		tier: "UU"
	},
	farfetchd: {
		randomBattleMoves: ["sandattack","substitute","slash","swordsdance","bodyslam","toxic"],
		tier: "UU"
	},
	doduo: {
		tier: "LC"
	},
	dodrio: {
		randomBattleMoves: ["drillpeck","bodyslam","hyperbeam","mimic"],
		tier: "UU"
	},
	seel: {
		tier: "LC"
	},
	dewgong: {
		randomBattleMoves: ["surf","blizzard","bodyslam","mimic"],
		tier: "UU"
	},
	grimer: {
		tier: "LC"
	},
	muk: {
		randomBattleMoves: ["explosion","sludge","bodyslam","megadrain","screech"],
		tier: "UU"
	},
	shellder: {
		tier: "LC"
	},
	cloyster: {
		randomBattleMoves: ["clamp","blizzard","hyperbeam","explosion"],
		tier: "OU"
	},
	gastly: {
		tier: "LC"
	},
	haunter: {
		tier: "UU"
	},
	gengar: {
		randomBattleMoves: ["hypnosis","explosion","thunderbolt","megadrain","psychic"],
		tier: "OU"
	},
	onix: {
		randomBattleMoves: ["earthquake","explosion","rockslide","bind"],
		tier: "UU"
	},
	drowzee: {
		tier: "LC"
	},
	hypno: {
		randomBattleMoves: ["hypnosis","psychic","thunderwave","counter","rest"],
		tier: "UU"
	},
	krabby: {
		tier: "LC"
	},
	kingler: {
		randomBattleMoves: ["crabhammer","bodyslam","hyperbeam","surf","swordsdance"],
		tier: "UU"
	},
	voltorb: {
		tier: "LC"
	},
	electrode: {
		randomBattleMoves: ["explosion","thunder","thunderbolt","thunderwave","screech"],
		tier: "UU"
	},
	exeggcute: {
		tier: "LC"
	},
	exeggutor: {
		randomBattleMoves: ["sleeppowder","psychic","explosion","eggbomb","hyperbeam","megadrain","stunspore"],
		tier: "OU"
	},
	cubone: {
		tier: "LC"
	},
	marowak: {
		randomBattleMoves: ["earthquake","blizzard","bodyslam","seismictoss"],
		tier: "UU"
	},
	hitmonlee: {
		randomBattleMoves: ["bodyslam","counter","highjumpkick","mimic","seismictoss","substitute"],
		tier: "UU"
	},
	hitmonchan: {
		randomBattleMoves: ["bodyslam","submission","seismictoss","counter"],
		tier: "UU"
	},
	lickitung: {
		randomBattleMoves: ["swordsdance","earthquake","hyperbeam","bodyslam"],
		tier: "UU"
	},
	koffing: {
		tier: "LC"
	},
	weezing: {
		randomBattleMoves: ["explosion","sludge","thunder","thunderbolt","fireblast"],
		tier: "UU"
	},
	rhyhorn: {
		tier: "LC"
	},
	rhydon: {
		randomBattleMoves: ["earthquake","rockslide","substitute","bodyslam"],
		tier: "OU"
	},
	chansey: {
		randomBattleMoves: ["softboiled","icebeam","counter","thunderwave","thunderbolt"],
		tier: "OU"
	},
	tangela: {
		randomBattleMoves: ["sleeppowder","bind","hyperbeam","stunspore","megadrain","growth","swordsdance","bodyslam"],
		tier: "UU"
	},
	kangaskhan: {
		randomBattleMoves: ["bodyslam","hyperbeam","counter","earthquake","surf"],
		tier: "UU"
	},
	horsea: {
		tier: "LC"
	},
	seadra: {
		randomBattleMoves: ["smokescreen","hydropump","surf","blizzard","mimic"],
		tier: "UU"
	},
	goldeen: {
		tier: "LC"
	},
	seaking: {
		randomBattleMoves: ["surf","blizzard","hyperbeam","doubleedge"],
		tier: "UU"
	},
	staryu: {
		tier: "UU"
	},
	starmie: {
		randomBattleMoves: ["recover","blizzard","thunderbolt","thunderwave","surf"],
		tier: "OU"
	},
	mrmime: {
		randomBattleMoves: ["psychic","thunderwave","thunderbolt","seismictoss"],
		tier: "UU"
	},
	scyther: {
		randomBattleMoves: ["slash","swordsdance","agility","hyperbeam"],
		tier: "UU"
	},
	jynx: {
		randomBattleMoves: ["lovelykiss","blizzard","psychic","mimic"],
		tier: "OU"
	},
	electabuzz: {
		randomBattleMoves: ["thunderbolt","thunderwave","psychic","seismictoss"],
		tier: "UU"
	},
	magmar: {
		randomBattleMoves: ["confuseray","fireblast","flamethrower","bodyslam","hyperbeam","mimic"],
		tier: "UU"
	},
	pinsir: {
		randomBattleMoves: ["swordsdance","hyperbeam","bodyslam","submission"],
		tier: "UU"
	},
	tauros: {
		randomBattleMoves: ["bodyslam","hyperbeam","earthquake","blizzard"],
		tier: "OU"
	},
	magikarp: {
		randomBattleMoves: ["splash","dragonrage"],
		eventPokemon: [
			{"generation":1,"level":5,"moves":["dragonrage"]}
		],
		tier: "LC"
	},
	gyarados: {
		randomBattleMoves: ["blizzard","surf","thunderbolt","bodyslam","hyperbeam"],
		tier: "UU"
	},
	lapras: {
		randomBattleMoves: ["confuseray","blizzard","icebeam","rest","thunderbolt","bodyslam"],
		tier: "OU"
	},
	ditto: {
		randomBattleMoves: ["transform"],
		tier: "UU"
	},
	eevee: {
		tier: "LC"
	},
	vaporeon: {
		randomBattleMoves: ["rest","hydropump","surf","blizzard","bodyslam","mimic"],
		tier: "UU"
	},
	jolteon: {
		randomBattleMoves: ["thunderbolt","thunderwave","pinmissile","bodyslam","doublekick","sandattack"],
		tier: "UU"
	},
	flareon: {
		randomBattleMoves: ["fireblast","bodyslam","hyperbeam","quickattack"],
		tier: "UU"
	},
	porygon: {
		randomBattleMoves: ["recover","thunderwave","thunderbolt","blizzard","icebeam","doubleedge","hyperbeam","sharpen","psychic","agility","triattack"],
		tier: "UU"
	},
	omanyte: {
		tier: "LC"
	},
	omastar: {
		randomBattleMoves: ["blizzard","hydropump","surf","mimic","rest","seismictoss"],
		tier: "UU"
	},
	kabuto: {
		tier: "LC"
	},
	kabutops: {
		randomBattleMoves: ["swordsdance","bodyslam","surf","hyperbeam"],
		tier: "UU"
	},
	aerodactyl: {
		randomBattleMoves: ["skyattack","reflect","doubleedge","hyperbeam"],
		tier: "UU"
	},
	snorlax: {
		randomBattleMoves: ["amnesia","blizzard","icebeam","bodyslam","thunderbolt","rest","selfdestruct","hyperbeam","surf","earthquake"],
		tier: "OU"
	},
	articuno: {
		randomBattleMoves: ["blizzard","rest","reflect","icebeam","mimic"],
		tier: "UU"
	},
	zapdos: {
		randomBattleMoves: ["thunderbolt","drillpeck","thunderwave","agility"],
		tier: "OU"
	},
	moltres: {
		randomBattleMoves: ["agility","fireblast","firespin","hyperbeam"],
		tier: "UU"
	},
	dratini: {
		tier: "LC"
	},
	dragonair: {
		tier: "UU"
	},
	dragonite: {
		randomBattleMoves: ["agility","wrap","hyperbeam","blizzard","surf"],
		tier: "OU"
	},
	mewtwo: {
		randomBattleMoves: ["recover","psychic","blizzard","submission","thunderbolt","amnesia","icebeam","rest","barrier","thunderwave","bodyslam","hyperbeam"],
		tier: "Uber"
	},
	mew: {
		randomBattleMoves: ["thunderwave","horndrill","fissure","softboiled","thunderbolt","blizzard","psychic","swordsdance","earthquake","hyperbeam","swift","explosion"],
		eventPokemon: [
			{"generation":1,"level":5,"moves":["pound"]}
		],
		tier: "Uber"
	}
};
