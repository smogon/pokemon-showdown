/**
 * We need a fully new formats-data.js for the first 151 Pokemon just for the tiers.
 * Smogon's tiers for Gen 1 are OU and UU, Uber is just a banlist: Mew and Mewtwo.
 * I'm adding LC to be able to drive a Gen 1 LC unofficial other meta.
 * They can still be part of UU.
 */
exports.BattleFormatsData = {
	bulbasaur: {
		//viableMoves: {"sleeppowder":1,"gigadrain":1,"hiddenpowerfire":1,"hiddenpowerice":1,"sludgebomb":1,"powerwhip":1,"leechseed":1,"synthesis":1},
		tier: "LC"
	},
	ivysaur: {
		//viableMoves: {"sleeppowder":1,"gigadrain":1,"hiddenpowerfire":1,"hiddenpowerice":1,"sludgebomb":1,"powerwhip":1,"leechseed":1,"synthesis":1},
		tier: "UU"
	},
	venusaur: {
		//viableMoves: {"sleeppowder":1,"gigadrain":1,"hiddenpowerfire":1,"hiddenpowerice":1,"sludgebomb":1,"swordsdance":1,"powerwhip":1,"leechseed":1,"synthesis":1,"earthquake":1},
		tier: "UU"
	},
	charmander: {
		//viableMoves: {"flamethrower":1,"overheat":1,"dragonpulse":1,"hiddenpowergrass":1,"fireblast":1},
		tier: "LC"
	},
	charmeleon: {
		//viableMoves: {"flamethrower":1,"overheat":1,"dragonpulse":1,"hiddenpowergrass":1,"fireblast":1},
		tier: "UU"
	},
	charizard: {
		//viableMoves: {"flamethrower":1,"fireblast":1,"substitute":1,"airslash":1,"dragonpulse":1,"hiddenpowergrass":1,"roost":1},
		tier: "UU"
	},
	squirtle: {
		//viableMoves: {"icebeam":1,"hydropump":1,"rapidspin":1,"scald":1,"aquajet":1,"toxic":1},
		tier: "LC"
	},
	wartortle: {
		//viableMoves: {"icebeam":1,"hydropump":1,"rapidspin":1,"scald":1,"aquajet":1,"toxic":1},
		tier: "UU"
	},
	blastoise: {
		//viableMoves: {"icebeam":1,"hydropump":1,"rapidspin":1,"scald":1,"aquajet":1,"toxic":1,"dragontail":1},
		tier: "UU"
	},
	caterpie: {
		//viableMoves: {"bugbite":1,"snore":1,"tackle":1,"electroweb":1},
		tier: "LC"
	},
	metapod: {
		//viableMoves: {"snore":1,"bugbite":1,"tackle":1,"electroweb":1},
		tier: "UU"
	},
	butterfree: {
		//viableMoves: {"quiverdance":1,"roost":1,"bugbuzz":1,"airslash":1,"substitute":1,"sleeppowder":1,"gigadrain":1},
		tier: "UU"
	},
	weedle: {
		//viableMoves: {"bugbite":1,"stringshot":1,"poisonsting":1,"electroweb":1},
		tier: "LC"
	},
	kakuna: {
		//viableMoves: {"electroweb":1,"bugbite":1,"irondefense":1,"poisonsting":1},
		tier: "UU"
	},
	beedrill: {
		//viableMoves: {"toxicspikes":1,"xscissor":1,"swordsdance":1,"uturn":1,"endeavor":1,"poisonjab":1,"drillrun":1,"brickbreak":1},
		tier: "UU"
	},
	pidgey: {
		//viableMoves: {"roost":1,"bravebird":1,"heatwave":1,"return":1,"workup":1,"uturn":1},
		tier: "LC"
	},
	pidgeotto: {
		//viableMoves: {"roost":1,"bravebird":1,"heatwave":1,"return":1,"workup":1,"uturn":1},
		tier: "UU"
	},
	pidgeot: {
		//viableMoves: {"roost":1,"bravebird":1,"pursuit":1,"heatwave":1,"return":1,"workup":1,"uturn":1},
		tier: "UU"
	},
	rattata: {
		//viableMoves: {"facade":1,"flamewheel":1,"suckerpunch":1,"uturn":1},
		tier: "LC"
	},
	raticate: {
		//viableMoves: {"facade":1,"flamewheel":1,"suckerpunch":1,"uturn":1},
		tier: "UU"
	},
	spearow: {
		//viableMoves: {"return":1,"drillpeck":1,"doubleedge":1,"uturn":1,"quickattack":1,"pursuit":1},
		tier: "LC"
	},
	fearow: {
		//viableMoves: {"return":1,"drillpeck":1,"doubleedge":1,"uturn":1,"quickattack":1,"pursuit":1,"drillrun":1,"roost":1},
		tier: "UU"
	},
	ekans: {
		//viableMoves: {"coil":1,"gunkshot":1,"seedbomb":1,"glare":1,"suckerpunch":1,"aquatail":1,"crunch":1,"earthquake":1,"rest":1},
		tier: "LC"
	},
	arbok: {
		//viableMoves: {"coil":1,"gunkshot":1,"seedbomb":1,"glare":1,"suckerpunch":1,"aquatail":1,"crunch":1,"earthquake":1,"rest":1},
		tier: "UU"
	},
	pikachu: {
		//viableMoves: {"thunderbolt":1,"volttackle":1,"voltswitch":1,"grassknot":1,"hiddenpowerice":1,"brickbreak":1,"extremespeed":1,"encore":1,"substitute":1},
		tier: "LC"
	},
	raichu: {
		//viableMoves: {"nastyplot":1,"encore":1,"thunderbolt":1,"grassknot":1,"hiddenpowerice":1,"focusblast":1,"substitute":1,"extremespeed":1},
		tier: "UU"
	},
	sandshrew: {
		//viableMoves: {"earthquake":1,"stoneedge":1,"swordsdance":1,"rapidspin":1,"xscissor":1,"stealthrock":1,"toxic":1},
		tier: "LC"
	},
	sandslash: {
		//viableMoves: {"earthquake":1,"stoneedge":1,"swordsdance":1,"rapidspin":1,"xscissor":1,"stealthrock":1,"toxic":1},
		tier: "UU"
	},
	nidoranf: {
		//viableMoves: {"toxicspikes":1,"crunch":1,"poisonjab":1,"honeclaws":1},
		tier: "LC"
	},
	nidorina: {
		//viableMoves: {"crunch":1,"poisonjab":1,"honeclaws":1,"icebeam":1},
		tier: "UU"
	},
	nidoqueen: {
		//viableMoves: {"stealthrock":1,"fireblast":1,"thunderbolt":1,"icebeam":1,"earthpower":1,"sludgewave":1,"focusblast":1},
		tier: "UU"
	},
	nidoranm: {
		//viableMoves: {"suckerpunch":1,"poisonjab":1,"headsmash":1,"honeclaws":1},
		tier: "LC"
	},
	nidorino: {
		//viableMoves: {"suckerpunch":1,"poisonjab":1,"headsmash":1,"honeclaws":1},
		tier: "UU"
	},
	nidoking: {
		//viableMoves: {"fireblast":1,"thunderbolt":1,"icebeam":1,"earthpower":1,"sludgewave":1,"focusblast":1},
		tier: "UU"
	},
	clefairy: {
		//viableMoves: {"healingwish":1,"reflect":1,"thunderwave":1,"lightscreen":1,"toxic":1,"fireblast":1,"encore":1,"wish":1,"protect":1,"aromatherapy":1,"stealthrock":1},
		tier: "LC"
	},
	clefable: {
		//viableMoves: {"calmmind":1,"hypervoice":1,"softboiled":1,"fireblast":1,"thunderbolt":1,"icebeam":1},
		tier: "UU"
	},
	vulpix: {
		//viableMoves: {"flamethrower":1,"fireblast":1,"willowisp":1,"solarbeam":1,"nastyplot":1,"substitute":1,"toxic":1,"hypnosis":1,"painsplit":1},
		tier: "LC"
	},
	ninetales: {
		//viableMoves: {"flamethrower":1,"fireblast":1,"willowisp":1,"solarbeam":1,"nastyplot":1,"substitute":1,"toxic":1,"hypnosis":1,"painsplit":1},
		tier: "UU"
	},
	jigglypuff: {
		//viableMoves: {"wish":1,"thunderwave":1,"reflect":1,"lightscreen":1,"healbell":1,"seismictoss":1,"counter":1,"stealthrock":1,"protect":1},
		tier: "LC"
	},
	wigglytuff: {
		//viableMoves: {"wish":1,"thunderwave":1,"return":1,"thunderbolt":1,"healbell":1,"fireblast":1,"counter":1,"stealthrock":1,"icebeam":1},
		tier: "UU"
	},
	zubat: {
		//viableMoves: {"bravebird":1,"roost":1,"toxic":1,"taunt":1,"nastyplot":1,"gigadrain":1,"sludgebomb":1,"airslash":1,"uturn":1,"whirlwind":1,"acrobatics":1,"heatwave":1,"superfang":1},
		tier: "LC"
	},
	golbat: {
		//viableMoves: {"bravebird":1,"roost":1,"toxic":1,"taunt":1,"nastyplot":1,"gigadrain":1,"sludgebomb":1,"airslash":1,"uturn":1,"whirlwind":1,"acrobatics":1,"heatwave":1,"superfang":1},
		tier: "UU"
	},
	oddish: {
		//viableMoves: {"gigadrain":1,"sludgebomb":1,"synthesis":1,"sleeppowder":1,"stunspore":1,"toxic":1,"hiddenpowerfire":1,"leechseed":1},
		tier: "LC"
	},
	gloom: {
		//viableMoves: {"gigadrain":1,"sludgebomb":1,"synthesis":1,"sleeppowder":1,"stunspore":1,"toxic":1,"hiddenpowerfire":1,"leechseed":1},
		tier: "UU"
	},
	vileplume: {
		//viableMoves: {"gigadrain":1,"sludgebomb":1,"synthesis":1,"sleeppowder":1,"stunspore":1,"toxic":1,"hiddenpowerfire":1,"leechseed":1,"aromatherapy":1},
		tier: "UU"
	},
	paras: {
		//viableMoves: {"spore":1,"stunspore":1,"xscissor":1,"seedbomb":1,"synthesis":1,"leechseed":1,"aromatherapy":1},
		tier: "LC"
	},
	parasect: {
		//viableMoves: {"spore":1,"stunspore":1,"xscissor":1,"seedbomb":1,"synthesis":1,"leechseed":1,"aromatherapy":1},
		tier: "UU"
	},
	venonat: {
		//viableMoves: {"sleeppowder":1,"morningsun":1,"toxicspikes":1,"sludgebomb":1,"signalbeam":1,"stunspore":1},
		tier: "LC"
	},
	venomoth: {
		//viableMoves: {"sleeppowder":1,"roost":1,"toxicspikes":1,"quiverdance":1,"batonpass":1,"bugbuzz":1,"sludgebomb":1,"gigadrain":1,"substitute":1},
		tier: "UU"
	},
	diglett: {
		//viableMoves: {"earthquake":1,"rockslide":1,"stealthrock":1,"suckerpunch":1,"reversal":1,"substitute":1},
		tier: "LC"
	},
	dugtrio: {
		//viableMoves: {"earthquake":1,"stoneedge":1,"stealthrock":1,"suckerpunch":1,"reversal":1,"substitute":1},
		tier: "UU"
	},
	meowth: {
		//viableMoves: {"fakeout":1,"uturn":1,"bite":1,"taunt":1,"return":1,"hypnosis":1,"waterpulse":1},
		tier: "LC"
	},
	persian: {
		//viableMoves: {"fakeout":1,"uturn":1,"bite":1,"taunt":1,"return":1,"hypnosis":1,"waterpulse":1,"switcheroo":1},
		tier: "OU"
	},
	psyduck: {
		//viableMoves: {"hydropump":1,"surf":1,"icebeam":1,"hiddenpowergrass":1,"crosschop":1,"encore":1},
		tier: "LC"
	},
	golduck: {
		//viableMoves: {"hydropump":1,"surf":1,"icebeam":1,"hiddenpowergrass":1,"encore":1,"focusblast":1},
		tier: "UU"
	},
	mankey: {
		//viableMoves: {"closecombat":1,"uturn":1,"icepunch":1,"rockslide":1,"punishment":1},
		tier: "LC"
	},
	primeape: {
		//viableMoves: {"closecombat":1,"uturn":1,"icepunch":1,"stoneedge":1,"punishment":1,"encore":1},
		tier: "UU"
	},
	growlithe: {
		//viableMoves: {"flareblitz":1,"wildcharge":1,"hiddenpowergrass":1,"hiddenpowerice":1,"closecombat":1,"morningsun":1,"willowisp":1,"toxic":1},
		tier: "LC"
	},
	arcanine: {
		//viableMoves: {"flareblitz":1,"wildcharge":1,"hiddenpowergrass":1,"hiddenpowerice":1,"extremespeed":1,"closecombat":1,"morningsun":1,"willowisp":1,"toxic":1},
		tier: "UU"
	},
	poliwag: {
		//viableMoves: {"hydropump":1,"icebeam":1,"encore":1,"bellydrum":1,"hypnosis":1,"waterfall":1,"return":1},
		tier: "LC"
	},
	poliwhirl: {
		//viableMoves: {"hydropump":1,"icebeam":1,"encore":1,"bellydrum":1,"hypnosis":1,"waterfall":1,"return":1},
		tier: "UU"
	},
	poliwrath: {
		//viableMoves: {"substitute":1,"circlethrow":1,"focuspunch":1,"bulkup":1,"encore":1,"waterfall":1,"toxic":1,"rest":1,"sleeptalk":1,"icepunch":1},
		tier: "UU"
	},
	politoed: {
		//viableMoves: {"scald":1,"hypnosis":1,"toxic":1,"encore":1,"perishsong":1,"protect":1,"icebeam":1,"focusblast":1,"surf":1,"hydropump":1,"hiddenpowergrass":1},
		tier: "UU"
	},
	abra: {
		//viableMoves: {"calmmind":1,"psychic":1,"psyshock":1,"hiddenpowerfighting":1,"shadowball":1,"encore":1,"substitute":1},
		tier: "LC"
	},
	kadabra: {
		//viableMoves: {"calmmind":1,"psychic":1,"psyshock":1,"hiddenpowerfighting":1,"shadowball":1,"encore":1,"substitute":1},
		tier: "UU"
	},
	alakazam: {
		//viableMoves: {"calmmind":1,"psychic":1,"psyshock":1,"focusblast":1,"shadowball":1,"encore":1,"substitute":1},
		tier: "OU"
	},
	machop: {
		//viableMoves: {"dynamicpunch":1,"payback":1,"bulkup":1,"icepunch":1,"rockslide":1,"bulletpunch":1},
		tier: "LC"
	},
	machoke: {
		//viableMoves: {"dynamicpunch":1,"payback":1,"bulkup":1,"icepunch":1,"rockslide":1,"bulletpunch":1},
		tier: "UU"
	},
	machamp: {
		//viableMoves: {"dynamicpunch":1,"payback":1,"bulkup":1,"icepunch":1,"stoneedge":1,"bulletpunch":1},
		tier: "UU"
	},
	bellsprout: {
		//viableMoves: {"swordsdance":1,"sleeppowder":1,"sunnyday":1,"growth":1,"solarbeam":1,"gigadrain":1,"sludgebomb":1,"weatherball":1,"suckerpunch":1,"seedbomb":1},
		tier: "LC"
	},
	weepinbell: {
		//viableMoves: {"swordsdance":1,"sleeppowder":1,"sunnyday":1,"growth":1,"solarbeam":1,"gigadrain":1,"sludgebomb":1,"weatherball":1,"suckerpunch":1,"seedbomb":1},
		tier: "UU"
	},
	victreebel: {
		//viableMoves: {"swordsdance":1,"sleeppowder":1,"sunnyday":1,"growth":1,"solarbeam":1,"gigadrain":1,"sludgebomb":1,"weatherball":1,"suckerpunch":1,"powerwhip":1},
		tier: "UU"
	},
	tentacool: {
		//viableMoves: {"toxicspikes":1,"rapidspin":1,"scald":1,"sludgebomb":1,"icebeam":1,"knockoff":1,"gigadrain":1,"toxic":1},
		tier: "LC"
	},
	tentacruel: {
		//viableMoves: {"toxicspikes":1,"rapidspin":1,"scald":1,"sludgebomb":1,"icebeam":1,"knockoff":1,"gigadrain":1,"toxic":1},
		tier: "UU"
	},
	geodude: {
		//viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"suckerpunch":1,"hammerarm":1,"firepunch":1},
		tier: "LC"
	},
	graveler: {
		//viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"suckerpunch":1,"hammerarm":1,"firepunch":1},
		tier: "UU"
	},
	golem: {
		//viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"suckerpunch":1,"hammerarm":1,"firepunch":1},
		tier: "OU"
	},
	ponyta: {
		//viableMoves: {"flareblitz":1,"wildcharge":1,"morningsun":1,"hypnosis":1,"flamecharge":1},
		tier: "LC"
	},
	rapidash: {
		//viableMoves: {"flareblitz":1,"wildcharge":1,"morningsun":1,"hypnosis":1,"flamecharge":1,"megahorn":1,"drillrun":1},
		tier: "UU"
	},
	slowpoke: {
		//viableMoves: {"scald":1,"aquatail":1,"zenheadbutt":1,"thunderwave":1,"toxic":1,"slackoff":1,"trickroom":1,"trick":1},
		tier: "LC"
	},
	slowbro: {
		//viableMoves: {"scald":1,"surf":1,"fireblast":1,"icebeam":1,"psychic":1,"grassknot":1,"calmmind":1,"thunderwave":1,"toxic":1,"slackoff":1,"trickroom":1,"trick":1},
		tier: "OU"
	},
	magnemite: {
		//viableMoves: {"thunderbolt":1,"thunderwave":1,"magnetrise":1,"substitute":1,"flashcannon":1,"hiddenpowerice":1,"voltswitch":1},
		tier: "LC"
	},
	magneton: {
		//viableMoves: {"thunderbolt":1,"thunderwave":1,"magnetrise":1,"substitute":1,"flashcannon":1,"hiddenpowerice":1,"voltswitch":1},
		tier: "UU"
	},
	farfetchd: {
		//viableMoves: {"bravebird":1,"swordsdance":1,"return":1,"leafblade":1,"roost":1},
		tier: "UU"
	},
	doduo: {
		//viableMoves: {"bravebird":1,"return":1,"doubleedge":1,"roost":1,"quickattack":1,"pursuit":1},
		tier: "LC"
	},
	dodrio: {
		//viableMoves: {"bravebird":1,"return":1,"doubleedge":1,"roost":1,"quickattack":1,"pursuit":1},
		tier: "UU"
	},
	seel: {
		//viableMoves: {"surf":1,"icebeam":1,"aquajet":1,"protect":1,"rest":1,"toxic":1,"drillrun":1},
		tier: "LC"
	},
	dewgong: {
		//viableMoves: {"surf":1,"icebeam":1,"aquajet":1,"iceshard":1,"protect":1,"rest":1,"toxic":1,"drillrun":1},
		tier: "UU"
	},
	grimer: {
		//viableMoves: {"curse":1,"gunkshot":1,"poisonjab":1,"shadowsneak":1,"payback":1,"brickbreak":1,"rest":1,"icepunch":1,"firepunch":1,"sleeptalk":1},
		tier: "LC"
	},
	muk: {
		//viableMoves: {"curse":1,"gunkshot":1,"poisonjab":1,"shadowsneak":1,"payback":1,"brickbreak":1,"rest":1,"icepunch":1,"firepunch":1,"sleeptalk":1},
		tier: "UU"
	},
	shellder: {
		//viableMoves: {"shellsmash":1,"hydropump":1,"razorshell":1,"rockblast":1,"iciclespear":1,"rapidspin":1},
		tier: "LC"
	},
	cloyster: {
		//viableMoves: {"shellsmash":1,"hydropump":1,"razorshell":1,"rockblast":1,"iciclespear":1,"iceshard":1,"rapidspin":1,"spikes":1,"toxicspikes":1},
		tier: "OU"
	},
	gastly: {
		//viableMoves: {"shadowball":1,"sludgebomb":1,"hiddenpowerfighting":1,"thunderbolt":1,"substitute":1,"disable":1,"painsplit":1,"hypnosis":1,"gigadrain":1,"trick":1},
		tier: "LC"
	},
	haunter: {
		//viableMoves: {"shadowball":1,"sludgebomb":1,"hiddenpowerfighting":1,"thunderbolt":1,"substitute":1,"disable":1,"painsplit":1,"hypnosis":1,"gigadrain":1,"trick":1},
		tier: "UU"
	},
	gengar: {
		//viableMoves: {"shadowball":1,"sludgebomb":1,"focusblast":1,"thunderbolt":1,"substitute":1,"disable":1,"painsplit":1,"hypnosis":1,"gigadrain":1,"trick":1},
		tier: "OU"
	},
	onix: {
		//viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"dragontail":1,"curse":1},
		tier: "UU"
	},
	drowzee: {
		//viableMoves: {"psychic":1,"seismictoss":1,"thunderwave":1,"wish":1,"protect":1,"healbell":1,"toxic":1,"nastyplot":1,"shadowball":1,"trickroom":1,"calmmind":1,"barrier":1},
		tier: "LC"
	},
	hypno: {
		//viableMoves: {"psychic":1,"seismictoss":1,"thunderwave":1,"wish":1,"protect":1,"healbell":1,"toxic":1,"nastyplot":1,"shadowball":1,"trickroom":1,"batonpass":1,"calmmind":1,"barrier":1,"bellydrum":1,"zenheadbutt":1,"firepunch":1},
		tier: "UU"
	},
	krabby: {
		//viableMoves: {"crabhammer":1,"return":1,"swordsdance":1,"agility":1,"rockslide":1,"substitute":1,"xscissor":1,"superpower":1},
		tier: "LC"
	},
	kingler: {
		//viableMoves: {"crabhammer":1,"return":1,"swordsdance":1,"agility":1,"rockslide":1,"substitute":1,"xscissor":1,"superpower":1},
		tier: "UU"
	},
	voltorb: {
		//viableMoves: {"voltswitch":1,"thunderbolt":1,"taunt":1,"foulplay":1,"hiddenpowerice":1},
		tier: "LC"
	},
	electrode: {
		//viableMoves: {"voltswitch":1,"thunderbolt":1,"taunt":1,"foulplay":1,"hiddenpowerice":1},
		tier: "UU"
	},
	exeggcute: {
		//viableMoves: {"substitute":1,"leechseed":1,"gigadrain":1,"psychic":1,"sleeppowder":1,"stunspore":1,"hiddenpowerfire":1,"synthesis":1},
		tier: "LC"
	},
	exeggutor: {
		//viableMoves: {"substitute":1,"leechseed":1,"gigadrain":1,"leafstorm":1,"psychic":1,"sleeppowder":1,"stunspore":1,"hiddenpowerfire":1,"synthesis":1},
		tier: "OU"
	},
	cubone: {
		//viableMoves: {"substitute":1,"bonemerang":1,"doubleedge":1,"rockslide":1,"firepunch":1,"earthquake":1},
		tier: "LC"
	},
	marowak: {
		//viableMoves: {"substitute":1,"bonemerang":1,"doubleedge":1,"stoneedge":1,"swordsdance":1,"firepunch":1,"earthquake":1},
		tier: "UU"
	},
	hitmonlee: {
		//viableMoves: {"highjumpkick":1,"suckerpunch":1,"stoneedge":1,"machpunch":1,"substitute":1,"fakeout":1,"closecombat":1,"earthquake":1,"blazekick":1},
		tier: "UU"
	},
	hitmonchan: {
		//viableMoves: {"bulkup":1,"drainpunch":1,"icepunch":1,"machpunch":1,"substitute":1,"closecombat":1,"stoneedge":1,"rapidspin":1},
		tier: "UU"
	},
	lickitung: {
		//viableMoves: {"wish":1,"protect":1,"dragontail":1,"curse":1,"bodyslam":1,"return":1,"powerwhip":1,"swordsdance":1,"earthquake":1,"toxic":1,"healbell":1,"earthquake":1},
		tier: "UU"
	},
	koffing: {
		//viableMoves: {"painsplit":1,"sludgebomb":1,"willowisp":1,"fireblast":1,"toxic":1,"clearsmog":1,"rest":1,"sleeptalk":1,"thunderbolt":1},
		tier: "LC"
	},
	weezing: {
		//viableMoves: {"painsplit":1,"sludgebomb":1,"willowisp":1,"fireblast":1,"toxic":1,"clearsmog":1,"rest":1,"sleeptalk":1,"thunderbolt":1},
		tier: "UU"
	},
	rhyhorn: {
		//viableMoves: {"stoneedge":1,"earthquake":1,"aquatail":1,"megahorn":1,"stealthrock":1,"rockblast":1},
		tier: "LC"
	},
	rhydon: {
		//viableMoves: {"stoneedge":1,"earthquake":1,"aquatail":1,"megahorn":1,"stealthrock":1,"rockblast":1},
		tier: "OU"
	},
	chansey: {
		//viableMoves: {"wish":1,"softboiled":1,"protect":1,"toxic":1,"aromatherapy":1,"seismictoss":1,"counter":1,"thunderwave":1,"stealthrock":1},
		tier: "OU"
	},
	tangela: {
		//viableMoves: {"gigadrain":1,"sleeppowder":1,"hiddenpowerrock":1,"hiddenpowerice":1,"leechseed":1,"knockoff":1,"leafstorm":1,"stunspore":1,"synthesis":1},
		tier: "UU"
	},
	kangaskhan: {
		//viableMoves: {"fakeout":1,"return":1,"hammerarm":1,"doubleedge":1,"suckerpunch":1,"earthquake":1,"substitute":1,"focuspunch":1,"wish":1},
		tier: "UU"
	},
	horsea: {
		//viableMoves: {"hydropump":1,"icebeam":1,"substitute":1,"hiddenpowergrass":1,"raindance":1},
		tier: "LC"
	},
	seadra: {
		//viableMoves: {"hydropump":1,"icebeam":1,"agility":1,"substitute":1,"hiddenpowergrass":1},
		tier: "UU"
	},
	goldeen: {
		//viableMoves: {"raindance":1,"waterfall":1,"megahorn":1,"return":1,"drillrun":1},
		tier: "LC"
	},
	seaking: {
		//viableMoves: {"raindance":1,"waterfall":1,"megahorn":1,"return":1,"drillrun":1},
		tier: "UU"
	},
	staryu: {
		//viableMoves: {"surf":1,"thunderbolt":1,"icebeam":1,"rapidspin":1,"recover":1},
		tier: "UU"
	},
	starmie: {
		//viableMoves: {"surf":1,"thunderbolt":1,"icebeam":1,"rapidspin":1,"recover":1,"psychic":1,"trick":1},
		tier: "OU"
	},
	mrmime: {
		//viableMoves: {"substitute":1,"batonpass":1,"psychic":1,"hiddenpowerfighting":1,"healingwish":1,"nastyplot":1,"thunderbolt":1,"encore":1},
		tier: "UU"
	},
	scyther: {
		//viableMoves: {"swordsdance":1,"roost":1,"bugbite":1,"quickattack":1,"brickbreak":1,"aerialace":1,"batonpass":1,"uturn":1},
		tier: "UU"
	},
	jynx: {
		//viableMoves: {"icebeam":1,"psychic":1,"focusblast":1,"trick":1,"shadowball":1,"nastyplot":1,"lovelykiss":1,"substitute":1,"energyball":1},
		tier: "OU"
	},
	electabuzz: {
		//viableMoves: {"thunderbolt":1,"voltswitch":1,"substitute":1,"hiddenpowerice":1,"focusblast":1,"psychic":1},
		tier: "UU"
	},
	magmar: {
		//viableMoves: {"flareblitz":1,"substitute":1,"fireblast":1,"hiddenpowergrass":1,"crosschop":1,"thunderpunch":1,"focusblast":1},
		tier: "UU"
	},
	pinsir: {
		//viableMoves: {"swordsdance":1,"xscissor":1,"earthquake":1,"closecombat":1,"stealthrock":1,"substitute":1,"stoneedge":1,"quickattack":1},
		tier: "UU"
	},
	tauros: {
		//viableMoves: {"return":1,"earthquake":1,"zenheadbutt":1,"rockslide":1,"pursuit":1},
		tier: "OU"
	},
	magikarp: {
		//viableMoves: {"bounce":1,"flail":1,"tackle":1,"splash":1},
		tier: "LC"
	},
	gyarados: {
		//viableMoves: {"dragondance":1,"waterfall":1,"earthquake":1,"bounce":1,"rest":1,"sleeptalk":1,"dragontail":1,"stoneedge":1,"substitute":1,"icefang":1},
		tier: "UU"
	},
	lapras: {
		//viableMoves: {"icebeam":1,"thunderbolt":1,"healbell":1,"toxic":1,"surf":1,"dragondance":1,"substitute":1,"waterfall":1,"return":1,"avalanche":1,"rest":1,"sleeptalk":1,"curse":1,"iceshard":1,"drillrun":1},
		tier: "OU"
	},
	ditto: {
		//viableMoves: {"transform":1},
		tier: "UU"
	},
	eevee: {
		//viableMoves: {"quickattack":1,"return":1,"bite":1,"batonpass":1,"irontail":1,"yawn":1,"protect":1,"wish":1},
		tier: "LC"
	},
	vaporeon: {
		//viableMoves: {"wish":1,"protect":1,"scald":1,"roar":1,"icebeam":1,"toxic":1,"hydropump":1},
		tier: "UU"
	},
	jolteon: {
		//viableMoves: {"thunderbolt":1,"voltswitch":1,"hiddenpowergrass":1,"hiddenpowerice":1,"chargebeam":1,"batonpass":1,"substitute":1},
		tier: "UU"
	},
	flareon: {
		//viableMoves: {"rest":1,"sleeptalk":1,"flamecharge":1,"facade":1},
		tier: "UU"
	},
	porygon: {
		//viableMoves: {"triattack":1,"icebeam":1,"recover":1,"toxic":1,"thunderwave":1,"discharge":1,"trick":1},
		tier: "UU"
	},
	omanyte: {
		//viableMoves: {"shellsmash":1,"surf":1,"icebeam":1,"earthpower":1,"hiddenpowerelectric":1,"spikes":1,"toxicspikes":1,"stealthrock":1,"hydropump":1},
		tier: "LC"
	},
	omastar: {
		//viableMoves: {"shellsmash":1,"surf":1,"icebeam":1,"earthpower":1,"hiddenpowerelectric":1,"spikes":1,"toxicspikes":1,"stealthrock":1,"hydropump":1},
		tier: "UU"
	},
	kabuto: {
		//viableMoves: {"aquajet":1,"rockslide":1,"rapidspin":1,"stealthrock":1,"honeclaws":1,"waterfall":1,"toxic":1},
		tier: "LC"
	},
	kabutops: {
		//viableMoves: {"aquajet":1,"stoneedge":1,"rapidspin":1,"stealthrock":1,"swordsdance":1,"waterfall":1,"toxic":1,"superpower":1},
		tier: "UU"
	},
	aerodactyl: {
		//viableMoves: {"stealthrock":1,"taunt":1,"stoneedge":1,"rockslide":1,"earthquake":1,"aquatail":1,"roost":1,"firefang":1},
		tier: "UU"
	},
	snorlax: {
		//viableMoves: {"rest":1,"curse":1,"sleeptalk":1,"bodyslam":1,"earthquake":1,"return":1,"firepunch":1,"icepunch":1,"crunch":1,"selfdestruct":1,"pursuit":1,"whirlwind":1},
		tier: "OU"
	},
	articuno: {
		//viableMoves: {"icebeam":1,"roost":1,"roar":1,"healbell":1,"toxic":1,"substitute":1,"hurricane":1},
		tier: "UU"
	},
	zapdos: {
		//viableMoves: {"thunderbolt":1,"heatwave":1,"hiddenpowergrass":1,"hiddenpowerice":1,"roost":1,"toxic":1,"substitute":1},
		tier: "OU"
	},
	moltres: {
		//viableMoves: {"fireblast":1,"hiddenpowergrass":1,"airslash":1,"roost":1,"substitute":1,"toxic":1,"uturn":1,"willowisp":1,"hurricane":1},
		tier: "UU"
	},
	dratini: {
		//viableMoves: {"dragondance":1,"outrage":1,"waterfall":1,"fireblast":1,"extremespeed":1,"dracometeor":1,"substitute":1,"aquatail":1},
		tier: "LC"
	},
	dragonair: {
		//viableMoves: {"dragondance":1,"outrage":1,"waterfall":1,"fireblast":1,"extremespeed":1,"dracometeor":1,"substitute":1,"aquatail":1},
		tier: "UU"
	},
	dragonite: {
		//viableMoves: {"dragondance":1,"outrage":1,"firepunch":1,"extremespeed":1,"dragonclaw":1,"earthquake":1,"roost":1,"waterfall":1,"substitute":1,"roost":1,"thunderwave":1,"dragontail":1,"hurricane":1,"superpower":1,"dracometeor":1},
		tier: "OU"
	},
	mewtwo: {
		//viableMoves: {"psystrike":1,"aurasphere":1,"fireblast":1,"icebeam":1,"calmmind":1,"substitute":1,"recover":1,"thunderbolt":1},
		tier: "Uber"
	},
	mew: {
		//viableMoves: {"taunt":1,"willowisp":1,"roost":1,"psychic":1,"nastyplot":1,"aurasphere":1,"fireblast":1,"swordsdance":1,"superpower":1,"zenheadbutt":1,"batonpass":1,"rockpolish":1,"substitute":1,"toxic":1,"icebeam":1,"thunderbolt":1,"earthquake":1,"uturn":1,"stealthrock":1},
		tier: "Uber"
	}
};