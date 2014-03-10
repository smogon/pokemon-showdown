exports.BattleFormatsData = {
	bulbasaur: {
		viableMoves: {"sleeppowder":1,"gigadrain":1,"hiddenpowerfire":1,"hiddenpowerice":1,"sludgebomb":1,"powerwhip":1,"leechseed":1,"synthesis":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["sweetscent","growth","solarbeam","synthesis"]},
			{"generation":3,"level":10,"gender":"M","moves":["tackle","growl","leechseed","vinewhip"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tackle","growl","leechseed","vinewhip"]},
			{"generation":5,"level":1,"isHidden":false,"moves":["falseswipe","block","frenzyplant","weatherball"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	ivysaur: {
		viableMoves: {"sleeppowder":1,"gigadrain":1,"hiddenpowerfire":1,"hiddenpowerice":1,"sludgebomb":1,"powerwhip":1,"leechseed":1,"synthesis":1},
		maleOnlyHidden: true,
		tier: "NFE"
	},
	venusaur: {
		viableMoves: {"sleeppowder":1,"gigadrain":1,"hiddenpowerfire":1,"hiddenpowerice":1,"sludgebomb":1,"swordsdance":1,"powerwhip":1,"leechseed":1,"synthesis":1,"earthquake":1},
		maleOnlyHidden: true,
		tier: "OU"
	},
	charmander: {
		viableMoves: {"flamethrower":1,"overheat":1,"dragonpulse":1,"hiddenpowergrass":1,"fireblast":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["scratch","growl","ember"]},
			{"generation":4,"level":40,"gender":"M","nature":"Mild","moves":["return","hiddenpower","quickattack","howl"]},
			{"generation":4,"level":40,"gender":"M","nature":"Naive","moves":["return","hiddenpower","quickattack","howl"]},
			{"generation":4,"level":40,"gender":"M","nature":"Naughty","moves":["return","hiddenpower","quickattack","howl"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["scratch","growl","ember","smokescreen"]},
			{"generation":4,"level":40,"gender":"M","nature":"Hardy","moves":["return","hiddenpower","quickattack","howl"],"pokeball":"cherishball"},
			{"generation":5,"level":1,"isHidden":false,"moves":["falseswipe","block","blastburn","acrobatics"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	charmeleon: {
		viableMoves: {"flamethrower":1,"overheat":1,"dragonpulse":1,"hiddenpowergrass":1,"fireblast":1},
		maleOnlyHidden: true,
		tier: "NFE"
	},
	charizard: {
		viableMoves: {"flamethrower":1,"fireblast":1,"substitute":1,"airslash":1,"dragonpulse":1,"hiddenpowergrass":1,"roost":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["wingattack","slash","dragonrage","firespin"]}
		],
		maleOnlyHidden: true,
		tier: "NU"
	},
	squirtle: {
		viableMoves: {"icebeam":1,"hydropump":1,"rapidspin":1,"scald":1,"aquajet":1,"toxic":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","tailwhip","bubble","withdraw"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tackle","tailwhip","bubble","withdraw"]},
			{"generation":5,"level":1,"isHidden":false,"moves":["falseswipe","block","hydrocannon","followme"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	wartortle: {
		viableMoves: {"icebeam":1,"hydropump":1,"rapidspin":1,"scald":1,"aquajet":1,"toxic":1},
		maleOnlyHidden: true,
		tier: "NU"
	},
	blastoise: {
		viableMoves: {"icebeam":1,"hydropump":1,"rapidspin":1,"scald":1,"aquajet":1,"toxic":1,"dragontail":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["protect","raindance","skullbash","hydropump"]}
		],
		maleOnlyHidden: true,
		tier: "UU"
	},
	caterpie: {
		viableMoves: {"bugbite":1,"snore":1,"tackle":1,"electroweb":1},
		tier: "LC"
	},
	metapod: {
		viableMoves: {"snore":1,"bugbite":1,"tackle":1,"electroweb":1},
		tier: "NFE"
	},
	butterfree: {
		viableMoves: {"quiverdance":1,"roost":1,"bugbuzz":1,"substitute":1,"sleeppowder":1,"gigadrain":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["morningsun","psychic","sleeppowder","aerialace"]}
		],
		tier: "NU"
	},
	weedle: {
		viableMoves: {"bugbite":1,"stringshot":1,"poisonsting":1,"electroweb":1},
		tier: "LC"
	},
	kakuna: {
		viableMoves: {"electroweb":1,"bugbite":1,"irondefense":1,"poisonsting":1},
		tier: "NFE"
	},
	beedrill: {
		viableMoves: {"toxicspikes":1,"xscissor":1,"swordsdance":1,"uturn":1,"endeavor":1,"poisonjab":1,"drillrun":1,"brickbreak":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["batonpass","sludgebomb","twineedle","swordsdance"]}
		],
		tier: "NU"
	},
	pidgey: {
		viableMoves: {"roost":1,"bravebird":1,"heatwave":1,"return":1,"workup":1,"uturn":1},
		tier: "LC"
	},
	pidgeotto: {
		viableMoves: {"roost":1,"bravebird":1,"heatwave":1,"return":1,"workup":1,"uturn":1},
		eventPokemon: [
			{"generation":3,"level":30,"abilities":["keeneye"],"moves":["refresh","wingattack","steelwing","featherdance"]}
		],
		tier: "NFE"
	},
	pidgeot: {
		viableMoves: {"roost":1,"bravebird":1,"pursuit":1,"heatwave":1,"return":1,"workup":1,"uturn":1},
		eventPokemon: [
			{"generation":5,"level":61,"gender":"M","nature":"Naughty","isHidden":false,"abilities":["keeneye"],"moves":["whirlwind","wingattack","skyattack","mirrormove"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	rattata: {
		viableMoves: {"facade":1,"flamewheel":1,"suckerpunch":1,"uturn":1},
		tier: "LC"
	},
	raticate: {
		viableMoves: {"facade":1,"flamewheel":1,"suckerpunch":1,"uturn":1},
		eventPokemon: [
			{"generation":3,"level":34,"moves":["refresh","superfang","scaryface","hyperfang"]}
		],
		tier: "NU"
	},
	spearow: {
		viableMoves: {"return":1,"drillpeck":1,"doubleedge":1,"uturn":1,"quickattack":1,"pursuit":1},
		eventPokemon: [
			{"generation":3,"level":22,"moves":["batonpass","falseswipe","leer","aerialace"]}
		],
		tier: "LC"
	},
	fearow: {
		viableMoves: {"return":1,"drillpeck":1,"doubleedge":1,"uturn":1,"quickattack":1,"pursuit":1,"drillrun":1,"roost":1},
		tier: "NU"
	},
	ekans: {
		viableMoves: {"coil":1,"gunkshot":1,"seedbomb":1,"glare":1,"suckerpunch":1,"aquatail":1,"earthquake":1,"rest":1},
		eventPokemon: [
			{"generation":3,"level":14,"abilities":["shedskin"],"moves":["leer","wrap","poisonsting","bite"]},
			{"generation":3,"level":10,"gender":"M","moves":["wrap","leer","poisonsting"]}
		],
		tier: "LC"
	},
	arbok: {
		viableMoves: {"coil":1,"gunkshot":1,"seedbomb":1,"glare":1,"suckerpunch":1,"aquatail":1,"crunch":1,"earthquake":1,"rest":1},
		eventPokemon: [
			{"generation":3,"level":33,"moves":["refresh","sludgebomb","glare","bite"]}
		],
		tier: "NU"
	},
	pichu: {
		viableMoves: {"fakeout":1,"volttackle":1,"encore":1,"irontail":1,"toxic":1,"thunderbolt":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["thundershock","charm","surf"]},
			{"generation":3,"level":5,"moves":["thundershock","charm","wish"]},
			{"generation":3,"level":5,"moves":["thundershock","charm","teeterdance"]},
			{"generation":3,"level":5,"moves":["thundershock","charm","followme"]},
			{"generation":4,"level":1,"moves":["volttackle","thunderbolt","grassknot","return"]},
			{"generation":4,"level":30,"shiny":true,"gender":"M","nature":"Jolly","moves":["charge","volttackle","endeavor","endure"],"pokeball":"cherishball"},
			{"generation":4,"level":30,"shiny":true,"gender":"M","nature":"Jolly","moves":["volttackle","charge","endeavor","endure"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	pichuspikyeared: {
		eventPokemon: [
			{"generation":4,"level":30,"gender":"F","nature":"Naughty","moves":["helpinghand","volttackle","swagger","painsplit"]}
		],
		tier: ""
	},
	pikachu: {
		viableMoves: {"thunderbolt":1,"volttackle":1,"voltswitch":1,"grassknot":1,"hiddenpowerice":1,"brickbreak":1,"extremespeed":1,"encore":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":50,"moves":["thunderbolt","agility","thunder","lightscreen"]},
			{"generation":3,"level":10,"moves":["thundershock","growl","tailwhip","thunderwave"]},
			{"generation":3,"level":10,"moves":["fly","tailwhip","growl","thunderwave"]},
			{"generation":3,"level":5,"moves":["surf","growl","tailwhip","thunderwave"]},
			{"generation":3,"level":10,"moves":["fly","growl","tailwhip","thunderwave"]},
			{"generation":3,"level":10,"moves":["thundershock","growl","thunderwave","surf"]},
			{"generation":3,"level":70,"moves":["thunderbolt","thunder","lightscreen","fly"]},
			{"generation":3,"level":70,"moves":["thunderbolt","thunder","lightscreen","surf"]},
			{"generation":3,"level":70,"moves":["thunderbolt","thunder","lightscreen","agility"]},
			{"generation":4,"level":10,"gender":"F","nature":"Hardy","moves":["surf","volttackle","tailwhip","thunderwave"]},
			{"generation":3,"level":10,"gender":"M","moves":["thundershock","growl","tailwhip","thunderwave"]},
			{"generation":4,"level":50,"gender":"M","nature":"Hardy","moves":["surf","thunderbolt","lightscreen","quickattack"],"pokeball":"cherishball"},
			{"generation":4,"level":20,"gender":"F","nature":"Bashful","moves":["present","quickattack","thundershock","tailwhip"],"pokeball":"cherishball"},
			{"generation":4,"level":20,"gender":"M","nature":"Jolly","moves":["grassknot","thunderbolt","flash","doubleteam"],"pokeball":"cherishball"},
			{"generation":4,"level":40,"gender":"M","nature":"Modest","moves":["surf","thunder","protect"],"pokeball":"cherishball"},
			{"generation":4,"level":20,"gender":"F","nature":"Bashful","moves":["quickattack","thundershock","tailwhip","present"],"pokeball":"cherishball"},
			{"generation":4,"level":40,"gender":"M","nature":"Mild","moves":["surf","thunder","protect"],"pokeball":"cherishball"},
			{"generation":4,"level":20,"gender":"F","nature":"Bashful","moves":["present","quickattack","thunderwave","tailwhip"],"pokeball":"cherishball"},
			{"generation":4,"level":30,"gender":"M","moves":["lastresort","present","thunderbolt","quickattack"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"gender":"M","nature":"Relaxed","moves":["rest","sleeptalk","yawn","snore"],"pokeball":"cherishball"},
			{"generation":4,"level":20,"gender":"M","nature":"Docile","moves":["present","quickattack","thundershock","tailwhip"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"gender":"M","nature":"Naughty","moves":["volttackle","irontail","quickattack","thunderbolt"],"pokeball":"cherishball"},
			{"generation":4,"level":20,"gender":"M","nature":"Bashful","moves":["present","quickattack","thundershock","tailwhip"],"pokeball":"cherishball"},
			{"generation":5,"level":30,"gender":"F","isHidden":true,"moves":["sing","teeterdance","encore","electroball"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"isHidden":false,"moves":["fly","irontail","electroball","quickattack"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"gender":"F","isHidden":false,"moves":["thunder","volttackle","grassknot","quickattack"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"gender":"F","isHidden":false,"moves":["extremespeed","thunderbolt","grassknot","brickbreak"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"gender":"F","isHidden":true,"moves":["fly","thunderbolt","grassknot","protect"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["thundershock","tailwhip","thunderwave","headbutt"]},
			{"generation":5,"level":100,"gender":"M","isHidden":true,"moves":["volttackle","quickattack","feint","voltswitch"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"gender":"M","nature":"Brave","isHidden":false,"moves":["thunderbolt","quickattack","irontail","electroball"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	raichu: {
		viableMoves: {"nastyplot":1,"encore":1,"thunderbolt":1,"grassknot":1,"hiddenpowerice":1,"focusblast":1,"substitute":1,"extremespeed":1},
		tier: "NU"
	},
	sandshrew: {
		viableMoves: {"earthquake":1,"rockslide":1,"swordsdance":1,"rapidspin":1,"xscissor":1,"stealthrock":1,"toxic":1},
		eventPokemon: [
			{"generation":3,"level":12,"moves":["scratch","defensecurl","sandattack","poisonsting"]}
		],
		tier: "LC"
	},
	sandslash: {
		viableMoves: {"earthquake":1,"stoneedge":1,"swordsdance":1,"rapidspin":1,"xscissor":1,"stealthrock":1,"toxic":1},
		tier: "RU"
	},
	nidoranf: {
		viableMoves: {"toxicspikes":1,"crunch":1,"poisonjab":1,"honeclaws":1},
		tier: "LC"
	},
	nidorina: {
		viableMoves: {"toxicspikes":1,"crunch":1,"poisonjab":1,"honeclaws":1,"icebeam":1},
		tier: "NFE"
	},
	nidoqueen: {
		viableMoves: {"toxicspikes":1,"stealthrock":1,"fireblast":1,"thunderbolt":1,"icebeam":1,"earthpower":1,"sludgewave":1,"focusblast":1},
		tier: "UU"
	},
	nidoranm: {
		viableMoves: {"suckerpunch":1,"poisonjab":1,"headsmash":1,"honeclaws":1},
		tier: "LC"
	},
	nidorino: {
		viableMoves: {"suckerpunch":1,"poisonjab":1,"headsmash":1,"honeclaws":1},
		tier: "NFE"
	},
	nidoking: {
		viableMoves: {"fireblast":1,"thunderbolt":1,"icebeam":1,"earthpower":1,"sludgewave":1,"focusblast":1},
		tier: "UU"
	},
	cleffa: {
		viableMoves: {"reflect":1,"thunderwave":1,"lightscreen":1,"toxic":1,"fireblast":1,"encore":1,"wish":1,"protect":1,"aromatherapy":1},
		tier: "LC"
	},
	clefairy: {
		viableMoves: {"healingwish":1,"reflect":1,"thunderwave":1,"lightscreen":1,"toxic":1,"fireblast":1,"encore":1,"wish":1,"protect":1,"aromatherapy":1,"stealthrock":1},
		tier: "NFE"
	},
	clefable: {
		viableMoves: {"calmmind":1,"hypervoice":1,"softboiled":1,"fireblast":1,"thunderbolt":1,"icebeam":1},
		tier: "RU"
	},
	vulpix: {
		viableMoves: {"flamethrower":1,"fireblast":1,"willowisp":1,"energyball":1,"substitute":1,"toxic":1,"hypnosis":1,"painsplit":1},
		eventPokemon: [
			{"generation":3,"level":18,"moves":["tailwhip","roar","quickattack","willowisp"]},
			{"generation":3,"level":18,"moves":["charm","heatwave","ember","dig"]}
		],
		tier: "NFE"
	},
	ninetales: {
		viableMoves: {"flamethrower":1,"fireblast":1,"willowisp":1,"solarbeam":1,"nastyplot":1,"substitute":1,"toxic":1,"hypnosis":1,"painsplit":1},
		eventPokemon: [
			{"generation":5,"level":50,"gender":"M","nature":"Bold","isHidden":true,"moves":["heatwave","solarbeam","psyshock","willowisp"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	igglybuff: {
		viableMoves: {"wish":1,"thunderwave":1,"reflect":1,"lightscreen":1,"healbell":1,"seismictoss":1,"counter":1,"protect":1},
		eventPokemon: [
			{"generation":3,"level":5,"abilities":["cutecharm"],"moves":["sing","charm","defensecurl","tickle"]}
		],
		tier: "LC"
	},
	jigglypuff: {
		viableMoves: {"wish":1,"thunderwave":1,"reflect":1,"lightscreen":1,"healbell":1,"seismictoss":1,"counter":1,"stealthrock":1,"protect":1},
		tier: "NFE"
	},
	wigglytuff: {
		viableMoves: {"wish":1,"thunderwave":1,"return":1,"thunderbolt":1,"healbell":1,"fireblast":1,"counter":1,"stealthrock":1,"icebeam":1},
		tier: "NU"
	},
	zubat: {
		viableMoves: {"bravebird":1,"roost":1,"toxic":1,"taunt":1,"nastyplot":1,"gigadrain":1,"sludgebomb":1,"airslash":1,"uturn":1,"whirlwind":1,"acrobatics":1,"heatwave":1,"superfang":1},
		tier: "LC"
	},
	golbat: {
		viableMoves: {"bravebird":1,"roost":1,"toxic":1,"taunt":1,"nastyplot":1,"gigadrain":1,"sludgebomb":1,"airslash":1,"uturn":1,"whirlwind":1,"acrobatics":1,"heatwave":1,"superfang":1},
		tier: "NU"
	},
	crobat: {
		viableMoves: {"bravebird":1,"roost":1,"toxic":1,"taunt":1,"nastyplot":1,"gigadrain":1,"sludgebomb":1,"airslash":1,"uturn":1,"whirlwind":1,"acrobatics":1,"heatwave":1,"superfang":1},
		eventPokemon: [
			{"generation":4,"level":30,"gender":"M","nature":"Timid","moves":["heatwave","airslash","sludgebomb","superfang"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	oddish: {
		viableMoves: {"gigadrain":1,"sludgebomb":1,"synthesis":1,"sleeppowder":1,"stunspore":1,"toxic":1,"hiddenpowerfire":1,"leechseed":1},
		eventPokemon: [
			{"generation":3,"level":26,"moves":["poisonpowder","stunspore","sleeppowder","acid"]},
			{"generation":3,"level":5,"moves":["absorb","leechseed"]}
		],
		tier: "LC"
	},
	gloom: {
		viableMoves: {"gigadrain":1,"sludgebomb":1,"synthesis":1,"sleeppowder":1,"stunspore":1,"toxic":1,"hiddenpowerfire":1,"leechseed":1},
		eventPokemon: [
			{"generation":3,"level":50,"moves":["sleeppowder","acid","moonlight","petaldance"]}
		],
		tier: "NFE"
	},
	vileplume: {
		viableMoves: {"gigadrain":1,"sludgebomb":1,"synthesis":1,"sleeppowder":1,"stunspore":1,"toxic":1,"hiddenpowerfire":1,"leechseed":1,"aromatherapy":1},
		tier: "NU"
	},
	bellossom: {
		viableMoves: {"gigadrain":1,"sludgebomb":1,"synthesis":1,"sleeppowder":1,"stunspore":1,"toxic":1,"hiddenpowerfire":1,"leechseed":1,"leafstorm":1},
		tier: "NU"
	},
	paras: {
		viableMoves: {"spore":1,"stunspore":1,"xscissor":1,"seedbomb":1,"synthesis":1,"leechseed":1,"aromatherapy":1},
		eventPokemon: [
			{"generation":3,"level":28,"abilities":["effectspore"],"moves":["refresh","spore","slash","falseswipe"]}
		],
		tier: "LC"
	},
	parasect: {
		viableMoves: {"spore":1,"stunspore":1,"xscissor":1,"seedbomb":1,"synthesis":1,"leechseed":1,"aromatherapy":1},
		tier: "NU"
	},
	venonat: {
		viableMoves: {"sleeppowder":1,"morningsun":1,"toxicspikes":1,"sludgebomb":1,"signalbeam":1,"stunspore":1},
		tier: "LC"
	},
	venomoth: {
		viableMoves: {"sleeppowder":1,"roost":1,"toxicspikes":1,"quiverdance":1,"batonpass":1,"bugbuzz":1,"sludgebomb":1,"gigadrain":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":32,"abilities":["shielddust"],"moves":["refresh","silverwind","substitute","psychic"]}
		],
		tier: "BL2"
	},
	diglett: {
		viableMoves: {"earthquake":1,"rockslide":1,"stealthrock":1,"suckerpunch":1,"reversal":1,"substitute":1},
		tier: "LC"
	},
	dugtrio: {
		viableMoves: {"earthquake":1,"stoneedge":1,"stealthrock":1,"suckerpunch":1,"reversal":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":40,"moves":["charm","earthquake","sandstorm","triattack"]}
		],
		tier: "OU"
	},
	meowth: {
		viableMoves: {"fakeout":1,"uturn":1,"bite":1,"taunt":1,"return":1,"hypnosis":1,"waterpulse":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["scratch","growl","petaldance"]},
			{"generation":3,"level":5,"moves":["scratch","growl"]},
			{"generation":3,"level":10,"gender":"M","moves":["scratch","growl","bite"]},
			{"generation":3,"level":22,"moves":["sing","slash","payday","bite"]},
			{"generation":4,"level":21,"gender":"F","nature":"Jolly","abilities":["pickup"],"moves":["bite","fakeout","furyswipes","screech"],"pokeball":"cherishball"},
			{"generation":4,"level":10,"gender":"M","nature":"Jolly","abilities":["pickup"],"moves":["fakeout","payday","assist","scratch"],"pokeball":"cherishball"},
			{"generation":5,"level":15,"gender":"M","isHidden":false,"abilities":["pickup"],"moves":["furyswipes","sing","nastyplot","snatch"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	persian: {
		viableMoves: {"fakeout":1,"uturn":1,"bite":1,"taunt":1,"return":1,"hypnosis":1,"waterpulse":1,"switcheroo":1},
		tier: "NU"
	},
	psyduck: {
		viableMoves: {"hydropump":1,"surf":1,"icebeam":1,"hiddenpowergrass":1,"crosschop":1,"encore":1},
		eventPokemon: [
			{"generation":3,"level":27,"abilities":["damp"],"moves":["tailwhip","confusion","disable"]},
			{"generation":3,"level":5,"moves":["watersport","scratch","tailwhip","mudsport"]}
		],
		tier: "LC"
	},
	golduck: {
		viableMoves: {"hydropump":1,"surf":1,"icebeam":1,"hiddenpowergrass":1,"encore":1,"focusblast":1},
		eventPokemon: [
			{"generation":3,"level":33,"moves":["charm","waterfall","psychup","brickbreak"]}
		],
		tier: "NU"
	},
	mankey: {
		viableMoves: {"closecombat":1,"uturn":1,"icepunch":1,"rockslide":1,"punishment":1},
		tier: "LC"
	},
	primeape: {
		viableMoves: {"closecombat":1,"uturn":1,"icepunch":1,"stoneedge":1,"punishment":1,"encore":1},
		eventPokemon: [
			{"generation":3,"level":34,"abilities":["vitalspirit"],"moves":["helpinghand","crosschop","focusenergy","reversal"]}
		],
		tier: "NU"
	},
	growlithe: {
		viableMoves: {"flareblitz":1,"wildcharge":1,"hiddenpowergrass":1,"closecombat":1,"morningsun":1,"willowisp":1},
		eventPokemon: [
			{"generation":3,"level":32,"abilities":["intimidate"],"moves":["leer","odorsleuth","takedown","flamewheel"]},
			{"generation":3,"level":10,"gender":"M","moves":["bite","roar","ember"]},
			{"generation":3,"level":28,"moves":["charm","flamethrower","bite","takedown"]}
		],
		tier: "LC"
	},
	arcanine: {
		viableMoves: {"flareblitz":1,"wildcharge":1,"hiddenpowergrass":1,"extremespeed":1,"closecombat":1,"morningsun":1,"willowisp":1},
		tier: "UU"
	},
	poliwag: {
		viableMoves: {"hydropump":1,"icebeam":1,"encore":1,"bellydrum":1,"hypnosis":1,"waterfall":1,"return":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["bubble","sweetkiss"]}
		],
		tier: "LC"
	},
	poliwhirl: {
		viableMoves: {"hydropump":1,"icebeam":1,"encore":1,"bellydrum":1,"hypnosis":1,"waterfall":1,"return":1},
		tier: "NFE"
	},
	poliwrath: {
		viableMoves: {"substitute":1,"circlethrow":1,"focuspunch":1,"bulkup":1,"encore":1,"waterfall":1,"toxic":1,"rest":1,"sleeptalk":1,"icepunch":1},
		eventPokemon: [
			{"generation":3,"level":42,"moves":["helpinghand","hydropump","raindance","brickbreak"]}
		],
		tier: "RU"
	},
	politoed: {
		viableMoves: {"scald":1,"hypnosis":1,"toxic":1,"encore":1,"perishsong":1,"protect":1,"icebeam":1,"focusblast":1,"surf":1,"hydropump":1,"hiddenpowergrass":1},
		eventPokemon: [
			{"generation":5,"level":50,"gender":"M","nature":"Calm","isHidden":true,"moves":["scald","icebeam","perishsong","protect"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	abra: {
		viableMoves: {"calmmind":1,"psychic":1,"psyshock":1,"hiddenpowerfighting":1,"shadowball":1,"encore":1,"substitute":1},
		tier: "LC"
	},
	kadabra: {
		viableMoves: {"calmmind":1,"psychic":1,"psyshock":1,"hiddenpowerfighting":1,"shadowball":1,"encore":1,"substitute":1},
		tier: "NU"
	},
	alakazam: {
		viableMoves: {"calmmind":1,"psychic":1,"psyshock":1,"focusblast":1,"shadowball":1,"encore":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["futuresight","calmmind","psychic","trick"]}
		],
		tier: "OU"
	},
	machop: {
		viableMoves: {"dynamicpunch":1,"payback":1,"bulkup":1,"icepunch":1,"rockslide":1,"bulletpunch":1},
		tier: "LC"
	},
	machoke: {
		viableMoves: {"dynamicpunch":1,"payback":1,"bulkup":1,"icepunch":1,"rockslide":1,"bulletpunch":1},
		eventPokemon: [
			{"generation":3,"level":38,"abilities":["guts"],"moves":["seismictoss","foresight","revenge","vitalthrow"]},
			{"generation":5,"level":30,"isHidden":false,"moves":["lowsweep","foresight","seismictoss","revenge"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	machamp: {
		viableMoves: {"dynamicpunch":1,"payback":1,"bulkup":1,"icepunch":1,"stoneedge":1,"bulletpunch":1},
		tier: "UU"
	},
	bellsprout: {
		viableMoves: {"swordsdance":1,"sleeppowder":1,"sunnyday":1,"growth":1,"solarbeam":1,"gigadrain":1,"sludgebomb":1,"weatherball":1,"suckerpunch":1,"seedbomb":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["vinewhip","teeterdance"]},
			{"generation":3,"level":10,"gender":"M","moves":["vinewhip","growth"]}
		],
		tier: "LC"
	},
	weepinbell: {
		viableMoves: {"swordsdance":1,"sleeppowder":1,"sunnyday":1,"growth":1,"solarbeam":1,"gigadrain":1,"sludgebomb":1,"weatherball":1,"suckerpunch":1,"seedbomb":1},
		eventPokemon: [
			{"generation":3,"level":32,"moves":["morningsun","magicalleaf","sludgebomb","sweetscent"]}
		],
		tier: "NFE"
	},
	victreebel: {
		viableMoves: {"swordsdance":1,"sleeppowder":1,"sunnyday":1,"growth":1,"solarbeam":1,"gigadrain":1,"sludgebomb":1,"weatherball":1,"suckerpunch":1,"powerwhip":1},
		tier: "NU"
	},
	tentacool: {
		viableMoves: {"toxicspikes":1,"rapidspin":1,"scald":1,"sludgebomb":1,"icebeam":1,"knockoff":1,"gigadrain":1,"toxic":1},
		tier: "LC"
	},
	tentacruel: {
		viableMoves: {"toxicspikes":1,"rapidspin":1,"scald":1,"sludgebomb":1,"icebeam":1,"knockoff":1,"gigadrain":1,"toxic":1},
		tier: "OU"
	},
	geodude: {
		viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"suckerpunch":1,"hammerarm":1,"firepunch":1},
		tier: "LC"
	},
	graveler: {
		viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"suckerpunch":1,"hammerarm":1,"firepunch":1},
		tier: "NFE"
	},
	golem: {
		viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"suckerpunch":1,"hammerarm":1,"firepunch":1},
		tier: "NU"
	},
	ponyta: {
		viableMoves: {"flareblitz":1,"wildcharge":1,"morningsun":1,"hypnosis":1,"flamecharge":1},
		tier: "LC"
	},
	rapidash: {
		viableMoves: {"flareblitz":1,"wildcharge":1,"morningsun":1,"hypnosis":1,"flamecharge":1,"megahorn":1,"drillrun":1},
		eventPokemon: [
			{"generation":3,"level":40,"moves":["batonpass","solarbeam","sunnyday","flamethrower"]}
		],
		tier: "NU"
	},
	slowpoke: {
		viableMoves: {"scald":1,"aquatail":1,"zenheadbutt":1,"thunderwave":1,"toxic":1,"slackoff":1,"trickroom":1,"trick":1},
		eventPokemon: [
			{"generation":3,"level":31,"abilities":["oblivious"],"moves":["watergun","confusion","disable","headbutt"]},
			{"generation":3,"level":10,"gender":"M","moves":["curse","yawn","tackle","growl"]},
			{"generation":5,"level":30,"isHidden":false,"moves":["confusion","disable","headbutt","waterpulse"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	slowbro: {
		viableMoves: {"scald":1,"surf":1,"fireblast":1,"icebeam":1,"psychic":1,"grassknot":1,"calmmind":1,"thunderwave":1,"toxic":1,"slackoff":1,"trickroom":1,"trick":1},
		tier: "UU"
	},
	slowking: {
		viableMoves: {"scald":1,"surf":1,"fireblast":1,"icebeam":1,"psychic":1,"grassknot":1,"calmmind":1,"thunderwave":1,"toxic":1,"slackoff":1,"trickroom":1,"trick":1,"nastyplot":1},
		tier: "RU"
	},
	magnemite: {
		viableMoves: {"thunderbolt":1,"thunderwave":1,"magnetrise":1,"substitute":1,"flashcannon":1,"hiddenpowerice":1,"voltswitch":1},
		tier: "LC"
	},
	magneton: {
		viableMoves: {"thunderbolt":1,"thunderwave":1,"magnetrise":1,"substitute":1,"flashcannon":1,"hiddenpowerice":1,"voltswitch":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["refresh","doubleedge","raindance","thunder"]}
		],
		tier: "RU"
	},
	magnezone: {
		viableMoves: {"thunderbolt":1,"thunderwave":1,"magnetrise":1,"substitute":1,"flashcannon":1,"hiddenpowerice":1,"voltswitch":1},
		tier: "OU"
	},
	farfetchd: {
		viableMoves: {"bravebird":1,"swordsdance":1,"return":1,"leafblade":1,"roost":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["yawn","wish"]},
			{"generation":3,"level":36,"moves":["batonpass","slash","swordsdance","aerialace"]}
		],
		tier: "NU"
	},
	doduo: {
		viableMoves: {"bravebird":1,"return":1,"doubleedge":1,"roost":1,"quickattack":1,"pursuit":1},
		tier: "LC"
	},
	dodrio: {
		viableMoves: {"bravebird":1,"return":1,"doubleedge":1,"roost":1,"quickattack":1,"pursuit":1},
		eventPokemon: [
			{"generation":3,"level":34,"moves":["batonpass","drillpeck","agility","triattack"]}
		],
		tier: "NU"
	},
	seel: {
		viableMoves: {"surf":1,"icebeam":1,"aquajet":1,"protect":1,"rest":1,"toxic":1,"drillrun":1},
		eventPokemon: [
			{"generation":3,"level":23,"abilities":["thickfat"],"moves":["helpinghand","surf","safeguard","icebeam"]}
		],
		tier: "LC"
	},
	dewgong: {
		viableMoves: {"surf":1,"icebeam":1,"aquajet":1,"iceshard":1,"protect":1,"rest":1,"toxic":1,"drillrun":1},
		tier: "NU"
	},
	grimer: {
		viableMoves: {"curse":1,"gunkshot":1,"poisonjab":1,"shadowsneak":1,"payback":1,"rest":1,"icepunch":1,"firepunch":1,"sleeptalk":1},
		eventPokemon: [
			{"generation":3,"level":23,"moves":["helpinghand","sludgebomb","shadowpunch","minimize"]}
		],
		tier: "LC"
	},
	muk: {
		viableMoves: {"curse":1,"gunkshot":1,"poisonjab":1,"shadowsneak":1,"payback":1,"brickbreak":1,"rest":1,"icepunch":1,"firepunch":1,"sleeptalk":1},
		tier: "NU"
	},
	shellder: {
		viableMoves: {"shellsmash":1,"hydropump":1,"razorshell":1,"rockblast":1,"iciclespear":1,"rapidspin":1},
		eventPokemon: [
			{"generation":3,"level":24,"abilities":["shellarmor"],"moves":["withdraw","iciclespear","supersonic","aurorabeam"]},
			{"generation":3,"level":10,"gender":"M","abilities":["shellarmor"],"moves":["tackle","withdraw","iciclespear"]},
			{"generation":3,"level":29,"abilities":["shellarmor"],"moves":["refresh","takedown","surf","aurorabeam"]}
		],
		tier: "LC"
	},
	cloyster: {
		viableMoves: {"shellsmash":1,"hydropump":1,"razorshell":1,"rockblast":1,"iciclespear":1,"iceshard":1,"rapidspin":1,"spikes":1,"toxicspikes":1},
		eventPokemon: [
			{"generation":5,"level":30,"gender":"M","nature":"Naughty","isHidden":false,"abilities":["skilllink"],"moves":["iciclespear","rockblast","hiddenpower","razorshell"]}
		],
		tier: "OU"
	},
	gastly: {
		viableMoves: {"shadowball":1,"sludgebomb":1,"hiddenpowerfighting":1,"thunderbolt":1,"substitute":1,"disable":1,"painsplit":1,"hypnosis":1,"gigadrain":1,"trick":1},
		tier: "LC"
	},
	haunter: {
		viableMoves: {"shadowball":1,"sludgebomb":1,"hiddenpowerfighting":1,"thunderbolt":1,"substitute":1,"disable":1,"painsplit":1,"hypnosis":1,"gigadrain":1,"trick":1},
		eventPokemon: [
			{"generation":3,"level":23,"moves":["spite","curse","nightshade","confuseray"]},
			{"generation":5,"level":30,"moves":["confuseray","suckerpunch","shadowpunch","payback"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	gengar: {
		viableMoves: {"shadowball":1,"sludgebomb":1,"focusblast":1,"thunderbolt":1,"substitute":1,"disable":1,"painsplit":1,"hypnosis":1,"gigadrain":1,"trick":1},
		tier: "OU"
	},
	onix: {
		viableMoves: {"stealthrock":1,"earthquake":1,"stoneedge":1,"dragontail":1,"curse":1},
		tier: "LC"
	},
	steelix: {
		viableMoves: {"stealthrock":1,"earthquake":1,"ironhead":1,"curse":1,"roar":1,"toxic":1,"rockslide":1,"icefang":1,"firefang":1},
		tier: "RU"
	},
	drowzee: {
		viableMoves: {"psychic":1,"seismictoss":1,"thunderwave":1,"wish":1,"protect":1,"toxic":1,"nastyplot":1,"shadowball":1,"trickroom":1,"calmmind":1,"barrier":1},
		eventPokemon: [
			{"generation":3,"level":5,"abilities":["insomnia"],"moves":["bellydrum","wish"]}
		],
		tier: "LC"
	},
	hypno: {
		viableMoves: {"psychic":1,"seismictoss":1,"thunderwave":1,"wish":1,"protect":1,"toxic":1,"nastyplot":1,"shadowball":1,"trickroom":1,"batonpass":1,"calmmind":1,"barrier":1,"bellydrum":1,"zenheadbutt":1,"firepunch":1},
		eventPokemon: [
			{"generation":3,"level":34,"abilities":["insomnia"],"moves":["batonpass","psychic","meditate","shadowball"]}
		],
		tier: "NU"
	},
	krabby: {
		viableMoves: {"crabhammer":1,"return":1,"swordsdance":1,"agility":1,"rockslide":1,"substitute":1,"xscissor":1,"superpower":1},
		tier: "LC"
	},
	kingler: {
		viableMoves: {"crabhammer":1,"return":1,"swordsdance":1,"agility":1,"rockslide":1,"substitute":1,"xscissor":1,"superpower":1},
		tier: "NU"
	},
	voltorb: {
		viableMoves: {"voltswitch":1,"thunderbolt":1,"taunt":1,"foulplay":1,"hiddenpowerice":1},
		eventPokemon: [
			{"generation":3,"level":19,"moves":["refresh","mirrorcoat","spark","swift"]}
		],
		tier: "LC"
	},
	electrode: {
		viableMoves: {"voltswitch":1,"thunderbolt":1,"taunt":1,"foulplay":1,"hiddenpowerice":1},
		tier: "NU"
	},
	exeggcute: {
		viableMoves: {"substitute":1,"leechseed":1,"gigadrain":1,"psychic":1,"sleeppowder":1,"stunspore":1,"hiddenpowerfire":1,"synthesis":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["sweetscent","wish"]}
		],
		tier: "LC"
	},
	exeggutor: {
		viableMoves: {"substitute":1,"leechseed":1,"gigadrain":1,"leafstorm":1,"psychic":1,"sleeppowder":1,"stunspore":1,"hiddenpowerfire":1,"synthesis":1},
		eventPokemon: [
			{"generation":3,"level":46,"moves":["refresh","psychic","hypnosis","ancientpower"]}
		],
		tier: "NU"
	},
	cubone: {
		viableMoves: {"substitute":1,"bonemerang":1,"doubleedge":1,"rockslide":1,"firepunch":1,"earthquake":1},
		tier: "LC"
	},
	marowak: {
		viableMoves: {"substitute":1,"bonemerang":1,"doubleedge":1,"stoneedge":1,"swordsdance":1,"firepunch":1,"earthquake":1},
		eventPokemon: [
			{"generation":3,"level":44,"moves":["sing","earthquake","swordsdance","rockslide"]}
		],
		tier: "NU"
	},
	tyrogue: {
		viableMoves: {"highjumpkick":1,"rapidspin":1,"fakeout":1,"bulletpunch":1,"machpunch":1,"toxic":1,"counter":1},
		maleOnlyHidden: true,
		tier: "LC"
	},
	hitmonlee: {
		viableMoves: {"highjumpkick":1,"suckerpunch":1,"stoneedge":1,"machpunch":1,"substitute":1,"fakeout":1,"closecombat":1,"earthquake":1,"blazekick":1},
		eventPokemon: [
			{"generation":3,"level":38,"abilities":["limber"],"moves":["refresh","highjumpkick","mindreader","megakick"]}
		],
		maleOnlyHidden: true,
		tier: "RU"
	},
	hitmonchan: {
		viableMoves: {"bulkup":1,"drainpunch":1,"icepunch":1,"machpunch":1,"substitute":1,"closecombat":1,"stoneedge":1,"rapidspin":1},
		eventPokemon: [
			{"generation":3,"level":38,"abilities":["keeneye"],"moves":["helpinghand","skyuppercut","mindreader","megapunch"]}
		],
		maleOnlyHidden: true,
		tier: "RU"
	},
	hitmontop: {
		viableMoves: {"suckerpunch":1,"machpunch":1,"rapidspin":1,"closecombat":1,"stoneedge":1,"toxic":1},
		eventPokemon: [
			{"generation":5,"level":55,"gender":"M","nature":"Adamant","isHidden":false,"abilities":["intimidate"],"moves":["fakeout","closecombat","suckerpunch","helpinghand"]}
		],
		maleOnlyHidden: true,
		tier: "UU"
	},
	lickitung: {
		viableMoves: {"wish":1,"protect":1,"dragontail":1,"curse":1,"bodyslam":1,"return":1,"powerwhip":1,"swordsdance":1,"earthquake":1,"toxic":1,"healbell":1,"earthquake":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["healbell","wish"]},
			{"generation":3,"level":38,"moves":["helpinghand","doubleedge","defensecurl","rollout"]}
		],
		tier: "LC"
	},
	lickilicky: {
		viableMoves: {"wish":1,"protect":1,"dragontail":1,"curse":1,"bodyslam":1,"return":1,"powerwhip":1,"swordsdance":1,"earthquake":1,"toxic":1,"healbell":1,"explosion":1,"earthquake":1},
		tier: "NU"
	},
	koffing: {
		viableMoves: {"painsplit":1,"sludgebomb":1,"willowisp":1,"fireblast":1,"toxic":1,"clearsmog":1,"rest":1,"sleeptalk":1,"thunderbolt":1},
		tier: "LC"
	},
	weezing: {
		viableMoves: {"painsplit":1,"sludgebomb":1,"willowisp":1,"fireblast":1,"toxic":1,"clearsmog":1,"rest":1,"sleeptalk":1,"thunderbolt":1},
		tier: "NU"
	},
	rhyhorn: {
		viableMoves: {"stoneedge":1,"earthquake":1,"aquatail":1,"megahorn":1,"stealthrock":1,"rockblast":1},
		tier: "LC"
	},
	rhydon: {
		viableMoves: {"stoneedge":1,"earthquake":1,"aquatail":1,"megahorn":1,"stealthrock":1,"rockblast":1},
		eventPokemon: [
			{"generation":3,"level":46,"moves":["helpinghand","megahorn","scaryface","earthquake"]}
		],
		tier: "RU"
	},
	rhyperior: {
		viableMoves: {"stoneedge":1,"earthquake":1,"aquatail":1,"megahorn":1,"stealthrock":1,"rockblast":1},
		tier: "UU"
	},
	happiny: {
		viableMoves: {"aromatherapy":1,"toxic":1,"thunderwave":1,"counter":1,"endeavor":1},
		tier: "LC"
	},
	chansey: {
		viableMoves: {"wish":1,"softboiled":1,"protect":1,"toxic":1,"aromatherapy":1,"seismictoss":1,"counter":1,"thunderwave":1,"stealthrock":1},
		eventPokemon: [
			{"generation":3,"level":5,"gender":"F","moves":["sweetscent","wish"]},
			{"generation":3,"level":10,"gender":"F","moves":["pound","growl","tailwhip","refresh"]},
			{"generation":3,"level":39,"gender":"F","moves":["sweetkiss","thunderbolt","softboiled","skillswap"]}
		],
		tier: "BL"
	},
	blissey: {
		viableMoves: {"wish":1,"softboiled":1,"protect":1,"toxic":1,"aromatherapy":1,"seismictoss":1,"counter":1,"thunderwave":1,"stealthrock":1,"flamethrower":1,"icebeam":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"F","isHidden":true,"moves":["pound","growl","tailwhip","refresh"]}
		],
		tier: "OU"
	},
	tangela: {
		viableMoves: {"gigadrain":1,"sleeppowder":1,"hiddenpowerrock":1,"hiddenpowerice":1,"leechseed":1,"knockoff":1,"leafstorm":1,"stunspore":1,"synthesis":1},
		eventPokemon: [
			{"generation":3,"level":30,"abilities":["chlorophyll"],"moves":["morningsun","solarbeam","sunnyday","ingrain"]}
		],
		tier: "NU"
	},
	tangrowth: {
		viableMoves: {"gigadrain":1,"sleeppowder":1,"hiddenpowerrock":1,"hiddenpowerice":1,"leechseed":1,"knockoff":1,"leafstorm":1,"stunspore":1,"focusblast":1,"synthesis":1,"powerwhip":1},
		tier: "RU"
	},
	kangaskhan: {
		viableMoves: {"fakeout":1,"return":1,"hammerarm":1,"doubleedge":1,"suckerpunch":1,"earthquake":1,"substitute":1,"focuspunch":1,"wish":1},
		eventPokemon: [
			{"generation":3,"level":5,"gender":"F","abilities":["earlybird"],"moves":["yawn","wish"]},
			{"generation":3,"level":10,"gender":"F","abilities":["earlybird"],"moves":["cometpunch","leer","bite"]},
			{"generation":3,"level":36,"gender":"F","abilities":["earlybird"],"moves":["sing","earthquake","tailwhip","dizzypunch"]}
		],
		tier: "NU"
	},
	horsea: {
		viableMoves: {"hydropump":1,"icebeam":1,"substitute":1,"hiddenpowergrass":1,"raindance":1},
		eventPokemon: [
			{"generation":5,"level":1,"shiny":true,"isHidden":false,"moves":["bubble"]}
		],
		tier: "LC"
	},
	seadra: {
		viableMoves: {"hydropump":1,"icebeam":1,"agility":1,"substitute":1,"hiddenpowergrass":1},
		eventPokemon: [
			{"generation":3,"level":45,"abilities":["poisonpoint"],"moves":["leer","watergun","twister","agility"]}
		],
		tier: "NU"
	},
	kingdra: {
		viableMoves: {"hydropump":1,"icebeam":1,"dragondance":1,"substitute":1,"outrage":1,"dracometeor":1,"waterfall":1,"rest":1,"sleeptalk":1},
		eventPokemon: [
			{"generation":3,"level":50,"abilities":["swiftswim"],"moves":["leer","watergun","twister","agility"]},
			{"generation":5,"level":50,"gender":"M","nature":"Timid","isHidden":false,"abilities":["swiftswim"],"moves":["dracometeor","muddywater","dragonpulse","protect"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	goldeen: {
		viableMoves: {"raindance":1,"waterfall":1,"megahorn":1,"return":1,"drillrun":1},
		tier: "LC"
	},
	seaking: {
		viableMoves: {"raindance":1,"waterfall":1,"megahorn":1,"return":1,"drillrun":1},
		tier: "NU"
	},
	staryu: {
		viableMoves: {"surf":1,"thunderbolt":1,"icebeam":1,"rapidspin":1,"recover":1},
		eventPokemon: [
			{"generation":3,"level":50,"moves":["minimize","lightscreen","cosmicpower","hydropump"]},
			{"generation":3,"level":18,"abilities":["illuminate"],"moves":["tackle","watergun","rapidspin","recover"]}
		],
		tier: "LC"
	},
	starmie: {
		viableMoves: {"surf":1,"thunderbolt":1,"icebeam":1,"rapidspin":1,"recover":1,"psychic":1,"trick":1},
		eventPokemon: [
			{"generation":3,"level":41,"moves":["refresh","waterfall","icebeam","recover"]}
		],
		tier: "OU"
	},
	mimejr: {
		viableMoves: {"substitute":1,"batonpass":1,"psychic":1,"hiddenpowerfighting":1,"healingwish":1,"nastyplot":1,"thunderbolt":1,"encore":1},
		tier: "LC"
	},
	mrmime: {
		viableMoves: {"substitute":1,"batonpass":1,"psychic":1,"hiddenpowerfighting":1,"healingwish":1,"nastyplot":1,"thunderbolt":1,"encore":1},
		eventPokemon: [
			{"generation":3,"level":42,"abilities":["soundproof"],"moves":["followme","psychic","encore","thunderpunch"]}
		],
		tier: "NU"
	},
	scyther: {
		viableMoves: {"swordsdance":1,"roost":1,"bugbite":1,"quickattack":1,"brickbreak":1,"aerialace":1,"batonpass":1,"uturn":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["swarm"],"moves":["quickattack","leer","focusenergy"]},
			{"generation":3,"level":40,"abilities":["swarm"],"moves":["morningsun","razorwind","silverwind","slash"]},
			{"generation":5,"level":30,"isHidden":false,"moves":["agility","wingattack","furycutter","slash"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	scizor: {
		viableMoves: {"swordsdance":1,"roost":1,"bulletpunch":1,"bugbite":1,"superpower":1,"uturn":1,"batonpass":1,"pursuit":1},
		eventPokemon: [
			{"generation":3,"level":50,"gender":"M","abilities":["swarm"],"moves":["furycutter","metalclaw","swordsdance","slash"]},
			{"generation":4,"level":50,"gender":"M","nature":"Adamant","abilities":["swarm"],"moves":["xscissor","swordsdance","irondefense","agility"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"gender":"M","isHidden":false,"abilities":["technician"],"moves":["bulletpunch","bugbite","roost","swordsdance"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["leer","focusenergy","pursuit","steelwing"]}
		],
		tier: "OU"
	},
	smoochum: {
		viableMoves: {"icebeam":1,"psychic":1,"hiddenpowerfighting":1,"trick":1,"shadowball":1,"grassknot":1},
		tier: "LC"
	},
	jynx: {
		viableMoves: {"icebeam":1,"psychic":1,"focusblast":1,"trick":1,"shadowball":1,"nastyplot":1,"lovelykiss":1,"substitute":1,"energyball":1},
		tier: "BL3"
	},
	elekid: {
		viableMoves: {"thunderbolt":1,"crosschop":1,"voltswitch":1,"substitute":1,"icepunch":1,"psychic":1},
		eventPokemon: [
			{"generation":3,"level":20,"moves":["icepunch","firepunch","thunderpunch","crosschop"]}
		],
		tier: "LC"
	},
	electabuzz: {
		viableMoves: {"thunderbolt":1,"voltswitch":1,"substitute":1,"hiddenpowerice":1,"focusblast":1,"psychic":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["quickattack","leer","thunderpunch"]},
			{"generation":3,"level":43,"moves":["followme","crosschop","thunderwave","thunderbolt"]},
			{"generation":4,"level":30,"gender":"M","nature":"Naughty","moves":["lowkick","shockwave","lightscreen","thunderpunch"]},
			{"generation":5,"level":30,"isHidden":false,"moves":["lowkick","swift","shockwave","lightscreen"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	electivire: {
		viableMoves: {"wildcharge":1,"crosschop":1,"icepunch":1,"substitute":1,"flamethrower":1,"earthquake":1},
		eventPokemon: [
			{"generation":4,"level":50,"gender":"M","nature":"Adamant","moves":["thunderpunch","icepunch","crosschop","earthquake"]},
			{"generation":4,"level":50,"gender":"M","nature":"Serious","moves":["lightscreen","thunderpunch","discharge","thunderbolt"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	magby: {
		viableMoves: {"flareblitz":1,"substitute":1,"fireblast":1,"hiddenpowergrass":1,"crosschop":1,"thunderpunch":1,"overheat":1},
		tier: "LC"
	},
	magmar: {
		viableMoves: {"flareblitz":1,"substitute":1,"fireblast":1,"hiddenpowergrass":1,"crosschop":1,"thunderpunch":1,"focusblast":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["leer","smog","firepunch","leer"]},
			{"generation":3,"level":36,"moves":["followme","fireblast","crosschop","thunderpunch"]},
			{"generation":4,"level":30,"gender":"M","nature":"Quiet","moves":["smokescreen","firespin","confuseray","firepunch"]},
			{"generation":5,"level":30,"isHidden":false,"moves":["smokescreen","feintattack","firespin","confuseray"],"pokeball":"cherishball"}
		],
		tier: "NFE"
	},
	magmortar: {
		viableMoves: {"fireblast":1,"substitute":1,"focusblast":1,"hiddenpowergrass":1,"thunderbolt":1,"overheat":1},
		eventPokemon: [
			{"generation":4,"level":50,"gender":"F","nature":"Modest","moves":["flamethrower","psychic","hyperbeam","solarbeam"]},
			{"generation":4,"level":50,"gender":"M","nature":"Hardy","moves":["confuseray","firepunch","lavaplume","flamethrower"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	pinsir: {
		viableMoves: {"swordsdance":1,"xscissor":1,"earthquake":1,"closecombat":1,"stealthrock":1,"substitute":1,"stoneedge":1,"quickattack":1},
		eventPokemon: [
			{"generation":3,"level":35,"abilities":["hypercutter"],"moves":["helpinghand","guillotine","falseswipe","submission"]}
		],
		tier: "NU"
	},
	tauros: {
		viableMoves: {"return":1,"earthquake":1,"zenheadbutt":1,"rockslide":1,"pursuit":1},
		eventPokemon: [
			{"generation":3,"level":25,"gender":"M","abilities":["intimidate"],"moves":["rage","hornattack","scaryface","pursuit"]},
			{"generation":3,"level":10,"gender":"M","abilities":["intimidate"],"moves":["tackle","tailwhip","rage","hornattack"]},
			{"generation":3,"level":46,"gender":"M","abilities":["intimidate"],"moves":["refresh","earthquake","tailwhip","bodyslam"]}
		],
		tier: "NU"
	},
	magikarp: {
		viableMoves: {"bounce":1,"flail":1,"tackle":1,"hydropump":1},
		eventPokemon: [
			{"generation":4,"level":5,"gender":"M","nature":"Relaxed","moves":["splash"]},
			{"generation":4,"level":6,"gender":"F","nature":"Rash","moves":["splash"]},
			{"generation":4,"level":7,"gender":"F","nature":"Hardy","moves":["splash"]},
			{"generation":4,"level":5,"gender":"F","nature":"Lonely","moves":["splash"]},
			{"generation":4,"level":4,"gender":"M","nature":"Modest","moves":["splash"]},
			{"generation":5,"level":99,"shiny":true,"gender":"M","isHidden":false,"moves":["flail","hydropump","bounce","splash"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	gyarados: {
		viableMoves: {"dragondance":1,"waterfall":1,"earthquake":1,"bounce":1,"rest":1,"sleeptalk":1,"dragontail":1,"stoneedge":1,"substitute":1,"icefang":1},
		tier: "OU"
	},
	lapras: {
		viableMoves: {"icebeam":1,"thunderbolt":1,"healbell":1,"toxic":1,"surf":1,"dragondance":1,"substitute":1,"waterfall":1,"return":1,"avalanche":1,"rest":1,"sleeptalk":1,"curse":1,"iceshard":1,"drillrun":1},
		eventPokemon: [
			{"generation":3,"level":44,"moves":["hydropump","raindance","blizzard","healbell"]}
		],
		tier: "NU"
	},
	ditto: {
		viableMoves: {"transform":1},
		tier: "NU"
	},
	eevee: {
		viableMoves: {"quickattack":1,"return":1,"bite":1,"batonpass":1,"irontail":1,"yawn":1,"protect":1,"wish":1},
		eventPokemon: [
			{"generation":4,"level":10,"gender":"F","nature":"Lonely","abilities":["adaptability"],"moves":["covet","bite","helpinghand","attract"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"shiny":true,"gender":"M","nature":"Hardy","abilities":["adaptability"],"moves":["irontail","trumpcard","flail","quickattack"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"gender":"F","nature":"Hardy","isHidden":false,"abilities":["adaptability"],"moves":["sing","return","echoedvoice","attract"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	vaporeon: {
		viableMoves: {"wish":1,"protect":1,"scald":1,"roar":1,"icebeam":1,"toxic":1,"hydropump":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tailwhip","tackle","helpinghand","sandattack"]}
		],
		tier: "OU"
	},
	jolteon: {
		viableMoves: {"thunderbolt":1,"voltswitch":1,"hiddenpowergrass":1,"hiddenpowerice":1,"chargebeam":1,"batonpass":1,"substitute":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tailwhip","tackle","helpinghand","sandattack"]}
		],
		tier: "OU"
	},
	flareon: {
		viableMoves: {"rest":1,"sleeptalk":1,"flamecharge":1,"facade":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tailwhip","tackle","helpinghand","sandattack"]}
		],
		tier: "NU"
	},
	espeon: {
		viableMoves: {"psychic":1,"psyshock":1,"substitute":1,"wish":1,"shadowball":1,"hiddenpowerfighting":1,"calmmind":1,"morningsun":1,"storedpower":1,"batonpass":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["psybeam","psychup","psychic","morningsun"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tailwhip","tackle","helpinghand","sandattack"]}
		],
		tier: "OU"
	},
	umbreon: {
		viableMoves: {"curse":1,"payback":1,"moonlight":1,"wish":1,"protect":1,"healbell":1,"toxic":1,"batonpass":1,"foulplay":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["feintattack","meanlook","screech","moonlight"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tailwhip","tackle","helpinghand","sandattack"]}
		],
		tier: "UU"
	},
	leafeon: {
		viableMoves: {"swordsdance":1,"leafblade":1,"substitute":1,"return":1,"xscissor":1,"yawn":1,"roar":1,"healbell":1,"batonpass":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tailwhip","tackle","helpinghand","sandattack"]}
		],
		tier: "NU"
	},
	glaceon: {
		viableMoves: {"icebeam":1,"hiddenpowerground":1,"shadowball":1,"wish":1,"protect":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tailwhip","tackle","helpinghand","sandattack"]}
		],
		tier: "NU"
	},
	porygon: {
		viableMoves: {"triattack":1,"icebeam":1,"recover":1,"toxic":1,"thunderwave":1,"discharge":1,"trick":1},
		eventPokemon: [
			{"generation":5,"level":10,"isHidden":true,"moves":["tackle","conversion","sharpen","psybeam"]}
		],
		tier: "LC"
	},
	porygon2: {
		viableMoves: {"triattack":1,"icebeam":1,"recover":1,"toxic":1,"thunderwave":1,"discharge":1,"trick":1},
		tier: "UU"
	},
	porygonz: {
		viableMoves: {"triattack":1,"thunderbolt":1,"icebeam":1,"darkpulse":1,"hiddenpowerfighting":1,"agility":1,"trick":1,"nastyplot":1},
		tier: "UU"
	},
	omanyte: {
		viableMoves: {"shellsmash":1,"surf":1,"icebeam":1,"earthpower":1,"hiddenpowerelectric":1,"spikes":1,"toxicspikes":1,"stealthrock":1,"hydropump":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"abilities":["swiftswim"],"moves":["bubblebeam","supersonic","withdraw","bite"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	omastar: {
		viableMoves: {"shellsmash":1,"surf":1,"icebeam":1,"earthpower":1,"hiddenpowerelectric":1,"spikes":1,"toxicspikes":1,"stealthrock":1,"hydropump":1},
		tier: "RU"
	},
	kabuto: {
		viableMoves: {"aquajet":1,"rockslide":1,"rapidspin":1,"stealthrock":1,"honeclaws":1,"waterfall":1,"toxic":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"abilities":["battlearmor"],"moves":["confuseray","dig","scratch","harden"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	kabutops: {
		viableMoves: {"aquajet":1,"stoneedge":1,"rapidspin":1,"stealthrock":1,"swordsdance":1,"waterfall":1,"toxic":1,"superpower":1},
		tier: "RU"
	},
	aerodactyl: {
		viableMoves: {"stealthrock":1,"taunt":1,"stoneedge":1,"rockslide":1,"earthquake":1,"aquatail":1,"roost":1,"firefang":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"abilities":["pressure"],"moves":["steelwing","icefang","firefang","thunderfang"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	munchlax: {
		viableMoves: {"rest":1,"curse":1,"sleeptalk":1,"bodyslam":1,"earthquake":1,"return":1,"firepunch":1,"icepunch":1,"whirlwind":1},
		tier: "NU"
	},
	snorlax: {
		viableMoves: {"rest":1,"curse":1,"sleeptalk":1,"bodyslam":1,"earthquake":1,"return":1,"firepunch":1,"icepunch":1,"crunch":1,"selfdestruct":1,"pursuit":1,"whirlwind":1},
		eventPokemon: [
			{"generation":3,"level":43,"moves":["refresh","fissure","curse","bodyslam"]}
		],
		tier: "UU"
	},
	articuno: {
		viableMoves: {"icebeam":1,"roost":1,"roar":1,"healbell":1,"toxic":1,"substitute":1,"hurricane":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["agility","mindreader","icebeam","reflect"]},
			{"generation":3,"level":50,"moves":["icebeam","healbell","extrasensory","haze"]}
		],
		tier: "NU"
	},
	zapdos: {
		viableMoves: {"thunderbolt":1,"heatwave":1,"hiddenpowergrass":1,"hiddenpowerice":1,"roost":1,"toxic":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["agility","detect","drillpeck","charge"]},
			{"generation":3,"level":50,"moves":["thunderbolt","extrasensory","batonpass","metalsound"]}
		],
		tier: "UU"
	},
	moltres: {
		viableMoves: {"fireblast":1,"hiddenpowergrass":1,"airslash":1,"roost":1,"substitute":1,"toxic":1,"uturn":1,"willowisp":1,"hurricane":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["agility","endure","flamethrower","safeguard"]},
			{"generation":3,"level":50,"moves":["extrasensory","morningsun","willowisp","flamethrower"]}
		],
		tier: "RU"
	},
	dratini: {
		viableMoves: {"dragondance":1,"outrage":1,"waterfall":1,"fireblast":1,"extremespeed":1,"dracometeor":1,"substitute":1,"aquatail":1},
		tier: "LC"
	},
	dragonair: {
		viableMoves: {"dragondance":1,"outrage":1,"waterfall":1,"fireblast":1,"extremespeed":1,"dracometeor":1,"substitute":1,"aquatail":1},
		tier: "NU"
	},
	dragonite: {
		viableMoves: {"dragondance":1,"outrage":1,"firepunch":1,"extremespeed":1,"dragonclaw":1,"earthquake":1,"roost":1,"waterfall":1,"substitute":1,"roost":1,"thunderwave":1,"dragontail":1,"hurricane":1,"superpower":1,"dracometeor":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["agility","safeguard","wingattack","outrage"]},
			{"generation":3,"level":55,"moves":["healbell","hyperbeam","dragondance","earthquake"]},
			{"generation":4,"level":50,"gender":"M","nature":"Mild","moves":["dracometeor","thunderbolt","outrage","dragondance"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"gender":"M","isHidden":true,"moves":["extremespeed","firepunch","dragondance","outrage"],"pokeball":"cherishball"},
			{"generation":5,"level":55,"gender":"M","isHidden":true,"moves":["dragonrush","safeguard","wingattack","thunderpunch"]},
			{"generation":5,"level":55,"gender":"M","isHidden":true,"moves":["dragonrush","safeguard","wingattack","extremespeed"]},
			{"generation":5,"level":50,"gender":"M","nature":"Brave","isHidden":false,"abilities":["innerfocus"],"moves":["fireblast","safeguard","outrage","hyperbeam"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	mewtwo: {
		viableMoves: {"psystrike":1,"aurasphere":1,"fireblast":1,"icebeam":1,"calmmind":1,"substitute":1,"recover":1,"thunderbolt":1},
		eventPokemon: [
			{"generation":5,"level":70,"isHidden":false,"moves":["psystrike","shadowball","aurasphere","electroball"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"nature":"Timid","isHidden":true,"moves":["psystrike","icebeam","healpulse","hurricane"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	mew: {
		viableMoves: {"taunt":1,"willowisp":1,"roost":1,"psychic":1,"nastyplot":1,"aurasphere":1,"fireblast":1,"swordsdance":1,"superpower":1,"zenheadbutt":1,"batonpass":1,"rockpolish":1,"substitute":1,"toxic":1,"icebeam":1,"thunderbolt":1,"earthquake":1,"uturn":1,"stealthrock":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["pound","transform","megapunch","metronome"]},
			{"generation":3,"level":10,"moves":["pound","transform"]},
			{"generation":4,"level":50,"moves":["ancientpower","metronome","teleport","aurasphere"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["barrier","metronome","teleport","aurasphere"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["megapunch","metronome","teleport","aurasphere"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["amnesia","metronome","teleport","aurasphere"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["transform","metronome","teleport","aurasphere"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["psychic","metronome","teleport","aurasphere"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["synthesis","return","hypnosis","teleport"],"pokeball":"cherishball"},
			{"generation":4,"level":5,"moves":["pound"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	chikorita: {
		viableMoves: {"reflect":1,"lightscreen":1,"safeguard":1,"aromatherapy":1,"grasswhistle":1,"leechseed":1,"toxic":1,"gigadrain":1,"synthesis":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","growl","razorleaf"]}
		],
		tier: "LC"
	},
	bayleef: {
		viableMoves: {"reflect":1,"lightscreen":1,"safeguard":1,"aromatherapy":1,"grasswhistle":1,"leechseed":1,"toxic":1,"gigadrain":1,"synthesis":1},
		tier: "NFE"
	},
	meganium: {
		viableMoves: {"reflect":1,"lightscreen":1,"safeguard":1,"aromatherapy":1,"grasswhistle":1,"leechseed":1,"toxic":1,"gigadrain":1,"synthesis":1,"dragontail":1},
		tier: "NU"
	},
	cyndaquil: {
		viableMoves: {"eruption":1,"fireblast":1,"flamethrower":1,"hiddenpowergrass":1,"naturepower":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","leer","smokescreen"]}
		],
		tier: "LC"
	},
	quilava: {
		viableMoves: {"eruption":1,"fireblast":1,"flamethrower":1,"hiddenpowergrass":1,"naturepower":1},
		tier: "NFE"
	},
	typhlosion: {
		viableMoves: {"eruption":1,"fireblast":1,"flamethrower":1,"hiddenpowergrass":1,"naturepower":1,"focusblast":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["quickattack","flamewheel","swift","flamethrower"]}
		],
		tier: "RU"
	},
	totodile: {
		viableMoves: {"aquajet":1,"waterfall":1,"crunch":1,"icepunch":1,"superpower":1,"dragondance":1,"swordsdance":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["scratch","leer","rage"]}
		],
		tier: "LC"
	},
	croconaw: {
		viableMoves: {"aquajet":1,"waterfall":1,"crunch":1,"icepunch":1,"superpower":1,"dragondance":1,"swordsdance":1},
		tier: "NFE"
	},
	feraligatr: {
		viableMoves: {"aquajet":1,"waterfall":1,"crunch":1,"icepunch":1,"dragondance":1,"swordsdance":1,"earthquake":1,"superpower":1},
		tier: "RU"
	},
	sentret: {
		viableMoves: {"superfang":1,"trick":1,"toxic":1,"uturn":1,"knockoff":1},
		tier: "LC"
	},
	furret: {
		viableMoves: {"return":1,"uturn":1,"suckerpunch":1,"trick":1,"icepunch":1,"firepunch":1,"thunderpunch":1},
		tier: "NU"
	},
	hoothoot: {
		viableMoves: {"reflect":1,"toxic":1,"roost":1,"whirlwind":1,"nightshade":1,"magiccoat":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","growl","foresight"]}
		],
		tier: "LC"
	},
	noctowl: {
		viableMoves: {"roost":1,"whirlwind":1,"airslash":1,"nightshade":1,"toxic":1,"reflect":1,"magiccoat":1},
		tier: "NU"
	},
	ledyba: {
		viableMoves: {"roost":1,"agility":1,"lightscreen":1,"encore":1,"reflect":1,"knockoff":1,"swordsdance":1,"batonpass":1,"toxic":1},
		eventPokemon: [
			{"generation":3,"level":10,"moves":["refresh","psybeam","aerialace","supersonic"]}
		],
		tier: "LC"
	},
	ledian: {
		viableMoves: {"roost":1,"bugbuzz":1,"lightscreen":1,"encore":1,"reflect":1,"knockoff":1,"toxic":1},
		tier: "NU"
	},
	spinarak: {
		viableMoves: {"agility":1,"toxic":1,"xscissor":1,"toxicspikes":1,"poisonjab":1,"batonpass":1},
		eventPokemon: [
			{"generation":3,"level":14,"moves":["refresh","dig","signalbeam","nightshade"]}
		],
		tier: "LC"
	},
	ariados: {
		viableMoves: {"agility":1,"toxic":1,"xscissor":1,"toxicspikes":1,"poisonjab":1,"batonpass":1},
		tier: "NU"
	},
	chinchou: {
		viableMoves: {"voltswitch":1,"thunderbolt":1,"hiddenpowergrass":1,"hydropump":1,"icebeam":1,"surf":1,"thunderwave":1,"scald":1,"discharge":1},
		tier: "LC"
	},
	lanturn: {
		viableMoves: {"voltswitch":1,"thunderbolt":1,"hiddenpowergrass":1,"hydropump":1,"icebeam":1,"surf":1,"thunderwave":1,"scald":1,"discharge":1},
		tier: "RU"
	},
	togepi: {
		viableMoves: {"protect":1,"fireblast":1,"toxic":1,"thunderwave":1,"softboiled":1},
		eventPokemon: [
			{"generation":3,"level":20,"gender":"F","abilities":["serenegrace"],"moves":["metronome","charm","sweetkiss","yawn"]},
			{"generation":3,"level":25,"moves":["triattack","followme","ancientpower","helpinghand"]}
		],
		tier: "LC"
	},
	togetic: {
		viableMoves: {"nastyplot":1,"hypervoice":1,"fireblast":1,"batonpass":1,"roost":1},
		tier: "NU"
	},
	togekiss: {
		viableMoves: {"wish":1,"roost":1,"thunderwave":1,"nastyplot":1,"airslash":1,"aurasphere":1,"batonpass":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["extremespeed","aurasphere","airslash","present"]}
		],
		tier: "UU"
	},
	natu: {
		viableMoves: {"thunderwave":1,"roost":1,"toxic":1,"reflect":1,"lightscreen":1,"uturn":1,"wish":1,"psychic":1,"nightshade":1,"uturn":1},
		eventPokemon: [
			{"generation":3,"level":22,"moves":["batonpass","futuresight","nightshade","aerialace"]}
		],
		tier: "NU"
	},
	xatu: {
		viableMoves: {"thunderwave":1,"toxic":1,"roost":1,"psychic":1,"nightshade":1,"uturn":1,"reflect":1,"lightscreen":1,"wish":1,"calmmind":1},
		tier: "UU"
	},
	mareep: {
		viableMoves: {"reflect":1,"lightscreen":1,"thunderbolt":1,"discharge":1,"thunderwave":1,"toxic":1,"hiddenpowerice":1,"cottonguard":1},
		eventPokemon: [
			{"generation":3,"level":37,"gender":"F","moves":["thunder","thundershock","thunderwave","cottonspore"]},
			{"generation":3,"level":10,"gender":"M","moves":["tackle","growl","thundershock"]},
			{"generation":3,"level":17,"moves":["healbell","thundershock","thunderwave","bodyslam"]}
		],
		tier: "LC"
	},
	flaaffy: {
		viableMoves: {"reflect":1,"lightscreen":1,"thunderbolt":1,"discharge":1,"thunderwave":1,"toxic":1,"hiddenpowerice":1,"cottonguard":1},
		tier: "NFE"
	},
	ampharos: {
		viableMoves: {"voltswitch":1,"focusblast":1,"hiddenpowerice":1,"hiddenpowergrass":1,"thunderbolt":1,"healbell":1},
		tier: "NU"
	},
	azurill: {
		viableMoves: {"scald":1,"return":1,"doubleedge":1,"encore":1,"toxic":1,"protect":1},
		tier: "LC"
	},
	marill: {
		viableMoves: {"waterfall":1,"return":1,"doubleedge":1,"encore":1,"toxic":1,"aquajet":1,"superpower":1,"icepunch":1,"protect":1},
		tier: "NFE"
	},
	azumarill: {
		viableMoves: {"waterfall":1,"aquajet":1,"return":1,"doubleedge":1,"icepunch":1,"superpower":1},
		tier: "UU"
	},
	bonsly: {
		viableMoves: {"rockslide":1,"brickbreak":1,"doubleedge":1,"toxic":1,"stealthrock":1,"suckerpunch":1},
		tier: "LC"
	},
	sudowoodo: {
		viableMoves: {"hammerarm":1,"stoneedge":1,"earthquake":1,"suckerpunch":1,"woodhammer":1,"explosion":1,"stealthrock":1},
		tier: "NU"
	},
	hoppip: {
		viableMoves: {"encore":1,"sleeppowder":1,"uturn":1,"toxic":1,"leechseed":1,"substitute":1,"protect":1},
		tier: "LC"
	},
	skiploom: {
		viableMoves: {"encore":1,"sleeppowder":1,"uturn":1,"toxic":1,"leechseed":1,"substitute":1,"protect":1},
		tier: "NFE"
	},
	jumpluff: {
		viableMoves: {"encore":1,"sleeppowder":1,"uturn":1,"toxic":1,"leechseed":1,"substitute":1,"gigadrain":1,"acrobatics":1,"synthesis":1},
		eventPokemon: [
			{"generation":5,"level":27,"gender":"M","isHidden":true,"moves":["falseswipe","sleeppowder","bulletseed","leechseed"]}
		],
		tier: "NU"
	},
	aipom: {
		viableMoves: {"fakeout":1,"return":1,"brickbreak":1,"seedbomb":1,"shadowclaw":1,"uturn":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["scratch","tailwhip","sandattack"]}
		],
		tier: "LC"
	},
	ambipom: {
		viableMoves: {"fakeout":1,"return":1,"payback":1,"uturn":1,"lowsweep":1,"switcheroo":1,"seedbomb":1},
		tier: "UU"
	},
	sunkern: {
		viableMoves: {"sunnyday":1,"gigadrain":1,"solarbeam":1,"hiddenpowerfire":1,"toxic":1,"earthpower":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["chlorophyll"],"moves":["absorb","growth"]}
		],
		tier: "LC"
	},
	sunflora: {
		viableMoves: {"sunnyday":1,"leafstorm":1,"gigadrain":1,"solarbeam":1,"hiddenpowerfire":1,"earthpower":1},
		tier: "NU"
	},
	yanma: {
		viableMoves: {"bugbuzz":1,"airslash":1,"hiddenpowerground":1,"uturn":1,"protect":1,"gigadrain":1},
		tier: "NFE"
	},
	yanmega: {
		viableMoves: {"bugbuzz":1,"airslash":1,"hiddenpowerground":1,"uturn":1,"protect":1,"gigadrain":1},
		tier: "UU"
	},
	wooper: {
		viableMoves: {"recover":1,"earthquake":1,"scald":1,"toxic":1,"stockpile":1,"yawn":1,"protect":1},
		tier: "LC"
	},
	quagsire: {
		viableMoves: {"recover":1,"earthquake":1,"waterfall":1,"scald":1,"toxic":1,"curse":1,"stoneedge":1,"stockpile":1,"yawn":1},
		tier: "RU"
	},
	murkrow: {
		viableMoves: {"substitute":1,"suckerpunch":1,"bravebird":1,"heatwave":1,"hiddenpowergrass":1,"roost":1,"darkpulse":1,"thunderwave":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["insomnia"],"moves":["peck","astonish"]}
		],
		tier: "NU"
	},
	honchkrow: {
		viableMoves: {"substitute":1,"superpower":1,"suckerpunch":1,"bravebird":1,"roost":1,"hiddenpowergrass":1,"heatwave":1,"pursuit":1},
		tier: "UU"
	},
	misdreavus: {
		viableMoves: {"nastyplot":1,"substitute":1,"calmmind":1,"willowisp":1,"shadowball":1,"thunderbolt":1,"hiddenpowerfighting":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["growl","psywave","spite"]}
		],
		tier: "NU"
	},
	mismagius: {
		viableMoves: {"nastyplot":1,"substitute":1,"calmmind":1,"willowisp":1,"shadowball":1,"thunderbolt":1,"hiddenpowerfighting":1},
		tier: "UU"
	},
	unown: {
		viableMoves: {"hiddenpowerpsychic":1},
		tier: "NU"
	},
	wynaut: {
		viableMoves: {"destinybond":1,"counter":1,"mirrorcoat":1,"encore":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["splash","charm","encore","tickle"]}
		],
		tier: "LC"
	},
	wobbuffet: {
		viableMoves: {"destinybond":1,"counter":1,"mirrorcoat":1,"encore":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["counter","mirrorcoat","safeguard","destinybond"]},
			{"generation":3,"level":10,"gender":"M","moves":["counter","mirrorcoat","safeguard","destinybond"]}
		],
		tier: "BL"
	},
	girafarig: {
		viableMoves: {"psychic":1,"thunderbolt":1,"calmmind":1,"batonpass":1,"agility":1,"hypervoice":1,"thunderwave":1},
		tier: "NU"
	},
	pineco: {
		viableMoves: {"rapidspin":1,"toxicspikes":1,"spikes":1,"bugbite":1,"stealthrock":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","protect","selfdestruct"]},
			{"generation":3,"level":22,"moves":["refresh","pinmissile","spikes","counter"]}
		],
		tier: "LC"
	},
	forretress: {
		viableMoves: {"rapidspin":1,"toxicspikes":1,"spikes":1,"bugbite":1,"earthquake":1,"voltswitch":1,"stealthrock":1},
		tier: "OU"
	},
	dunsparce: {
		viableMoves: {"coil":1,"rockslide":1,"bite":1,"headbutt":1,"glare":1,"thunderwave":1,"bodyslam":1,"roost":1},
		tier: "NU"
	},
	gligar: {
		viableMoves: {"stealthrock":1,"toxic":1,"roost":1,"taunt":1,"swordsdance":1,"earthquake":1,"uturn":1,"stoneedge":1,"acrobatics":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["poisonsting","sandattack"]}
		],
		tier: "UU"
	},
	gliscor: {
		viableMoves: {"swordsdance":1,"acrobatics":1,"earthquake":1,"roost":1,"substitute":1,"taunt":1,"icefang":1,"protect":1,"toxic":1,"stealthrock":1},
		tier: "OU"
	},
	snubbull: {
		viableMoves: {"thunderwave":1,"return":1,"crunch":1,"closecombat":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","scaryface","tailwhip","charm"]}
		],
		tier: "LC"
	},
	granbull: {
		viableMoves: {"thunderwave":1,"return":1,"crunch":1,"closecombat":1,"healbell":1,"icepunch":1},
		tier: "NU"
	},
	qwilfish: {
		viableMoves: {"toxicspikes":1,"waterfall":1,"spikes":1,"swordsdance":1,"poisonjab":1,"painsplit":1,"thunderwave":1,"taunt":1,"destinybond":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","poisonsting","harden","minimize"]}
		],
		tier: "RU"
	},
	shuckle: {
		viableMoves: {"rollout":1,"acupressure":1,"powersplit":1,"rest":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["sturdy"],"moves":["constrict","withdraw","wrap"]},
			{"generation":3,"level":20,"abilities":["sturdy"],"moves":["substitute","toxic","sludgebomb","encore"]}
		],
		tier: "NU"
	},
	heracross: {
		viableMoves: {"closecombat":1,"megahorn":1,"stoneedge":1,"swordsdance":1,"facade":1},
		tier: "UU"
	},
	sneasel: {
		viableMoves: {"iceshard":1,"icepunch":1,"lowkick":1,"pursuit":1,"swordsdance":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["scratch","leer","taunt","quickattack"]}
		],
		tier: "NU"
	},
	weavile: {
		viableMoves: {"iceshard":1,"icepunch":1,"nightslash":1,"lowkick":1,"pursuit":1,"swordsdance":1},
		eventPokemon: [
			{"generation":4,"level":30,"gender":"M","nature":"Jolly","moves":["fakeout","iceshard","nightslash","brickbreak"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	teddiursa: {
		viableMoves: {"swordsdance":1,"protect":1,"facade":1,"closecombat":1,"firepunch":1,"crunch":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["pickup"],"moves":["scratch","leer","lick"]},
			{"generation":3,"level":11,"abilities":["pickup"],"moves":["refresh","metalclaw","leer","return"]}
		],
		tier: "LC"
	},
	ursaring: {
		viableMoves: {"swordsdance":1,"protect":1,"facade":1,"closecombat":1,"firepunch":1,"crunch":1},
		tier: "NU"
	},
	slugma: {
		viableMoves: {"stockpile":1,"recover":1,"lavaplume":1,"willowisp":1,"toxic":1,"hiddenpowergrass":1},
		tier: "LC"
	},
	magcargo: {
		viableMoves: {"stockpile":1,"recover":1,"lavaplume":1,"willowisp":1,"toxic":1,"hiddenpowergrass":1,"hiddenpowerrock":1,"stealthrock":1,"shellsmash":1,"fireblast":1,"earthpower":1},
		eventPokemon: [
			{"generation":3,"level":38,"moves":["refresh","heatwave","earthquake","flamethrower"]}
		],
		tier: "NU"
	},
	swinub: {
		viableMoves: {"earthquake":1,"iciclecrash":1,"iceshard":1,"superpower":1,"endeavor":1,"stealthrock":1},
		eventPokemon: [
			{"generation":3,"level":22,"abilities":["oblivious"],"moves":["charm","ancientpower","mist","mudshot"]}
		],
		tier: "LC"
	},
	piloswine: {
		viableMoves: {"earthquake":1,"iciclecrash":1,"iceshard":1,"superpower":1,"endeavor":1,"stealthrock":1},
		tier: "NU"
	},
	mamoswine: {
		viableMoves: {"iceshard":1,"earthquake":1,"endeavor":1,"iciclecrash":1,"stoneedge":1,"superpower":1,"stealthrock":1},
		eventPokemon: [
			{"generation":5,"level":34,"gender":"M","isHidden":true,"moves":["hail","icefang","takedown","doublehit"]}
		],
		tier: "OU"
	},
	corsola: {
		viableMoves: {"recover":1,"toxic":1,"powergem":1,"scald":1,"stealthrock":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["tackle","mudsport"]}
		],
		tier: "NU"
	},
	remoraid: {
		viableMoves: {"waterspout":1,"hydropump":1,"fireblast":1,"hiddenpowerground":1,"icebeam":1,"seedbomb":1,"rockblast":1},
		tier: "LC"
	},
	octillery: {
		viableMoves: {"hydropump":1,"fireblast":1,"icebeam":1,"energyball":1,"rockblast":1,"thunderwave":1},
		eventPokemon: [
			{"generation":4,"level":50,"gender":"F","nature":"Serious","abilities":["suctioncups"],"moves":["octazooka","icebeam","signalbeam","hyperbeam"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	delibird: {
		viableMoves: {"rapidspin":1,"iceshard":1,"icepunch":1,"aerialace":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["present"]}
		],
		tier: "NU"
	},
	mantyke: {
		viableMoves: {"raindance":1,"hydropump":1,"surf":1,"airslash":1,"icebeam":1,"rest":1,"sleeptalk":1,"toxic":1},
		tier: "LC"
	},
	mantine: {
		viableMoves: {"raindance":1,"hydropump":1,"surf":1,"airslash":1,"icebeam":1,"rest":1,"sleeptalk":1,"toxic":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","bubble","supersonic"]}
		],
		tier: "NU"
	},
	skarmory: {
		viableMoves: {"whirlwind":1,"bravebird":1,"roost":1,"spikes":1,"stealthrock":1},
		tier: "OU"
	},
	houndour: {
		viableMoves: {"pursuit":1,"suckerpunch":1,"fireblast":1,"darkpulse":1,"hiddenpowerfighting":1,"nastyplot":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["leer","ember","howl"]},
			{"generation":3,"level":17,"moves":["charm","feintattack","ember","roar"]}
		],
		tier: "LC"
	},
	houndoom: {
		viableMoves: {"nastyplot":1,"pursuit":1,"darkpulse":1,"suckerpunch":1,"fireblast":1,"hiddenpowerfighting":1},
		tier: "UU"
	},
	phanpy: {
		viableMoves: {"stealthrock":1,"earthquake":1,"iceshard":1,"headsmash":1,"knockoff":1,"seedbomb":1,"superpower":1},
		tier: "LC"
	},
	donphan: {
		viableMoves: {"stealthrock":1,"rapidspin":1,"iceshard":1,"earthquake":1,"headsmash":1,"seedbomb":1,"superpower":1},
		tier: "OU"
	},
	stantler: {
		viableMoves: {"return":1,"megahorn":1,"jumpkick":1,"earthquake":1,"thunderwave":1,"suckerpunch":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["intimidate"],"moves":["tackle","leer"]}
		],
		tier: "NU"
	},
	smeargle: {
		viableMoves: {"spore":1,"spikes":1,"stealthrock":1,"uturn":1,"destinybond":1,"whirlwind":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["owntempo"],"moves":["sketch"]},
			{"generation":5,"level":50,"gender":"F","nature":"Jolly","abilities":["technician"],"moves":["falseswipe","spore","odorsleuth","meanlook"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	miltank: {
		viableMoves: {"milkdrink":1,"stealthrock":1,"bodyslam":1,"healbell":1,"curse":1,"earthquake":1},
		tier: "NU"
	},
	raikou: {
		viableMoves: {"thunderbolt":1,"hiddenpowerice":1,"aurasphere":1,"calmmind":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["quickattack","spark","reflect","crunch"]},
			{"generation":4,"level":30,"shiny":true,"nature":"Rash","moves":["zapcannon","aurasphere","extremespeed","weatherball"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	entei: {
		viableMoves: {"extremespeed":1,"flareblitz":1,"ironhead":1,"flamecharge":1,"stoneedge":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["firespin","stomp","flamethrower","swagger"]},
			{"generation":4,"level":30,"shiny":true,"nature":"Adamant","moves":["flareblitz","howl","extremespeed","crushclaw"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	suicune: {
		viableMoves: {"hydropump":1,"icebeam":1,"scald":1,"hiddenpowergrass":1,"hiddenpowerelectric":1,"rest":1,"sleeptalk":1,"roar":1,"calmmind":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["gust","aurorabeam","mist","mirrorcoat"]},
			{"generation":4,"level":30,"shiny":true,"nature":"Relaxed","moves":["sheercold","airslash","extremespeed","aquaring"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	larvitar: {
		viableMoves: {"earthquake":1,"stoneedge":1,"rockpolish":1,"dragondance":1,"superpower":1},
		eventPokemon: [
			{"generation":3,"level":20,"moves":["sandstorm","dragondance","bite","outrage"]},
			{"generation":5,"level":5,"shiny":true,"gender":"M","isHidden":false,"moves":["bite","leer","sandstorm","superpower"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	pupitar: {
		viableMoves: {"earthquake":1,"stoneedge":1,"rockpolish":1,"dragondance":1,"superpower":1},
		tier: "NFE"
	},
	tyranitar: {
		viableMoves: {"crunch":1,"stoneedge":1,"pursuit":1,"superpower":1,"fireblast":1,"icebeam":1,"stealthrock":1,"aquatail":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["thrash","scaryface","crunch","earthquake"]},
			{"generation":5,"level":100,"gender":"M","isHidden":false,"moves":["fireblast","icebeam","stoneedge","crunch"],"pokeball":"cherishball"},
			{"generation":5,"level":55,"gender":"M","isHidden":true,"moves":["payback","crunch","earthquake","seismictoss"]}
		],
		tier: "OU"
	},
	lugia: {
		viableMoves: {"toxic":1,"dragontail":1,"roost":1,"substitute":1,"whirlwind":1,"icebeam":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["swift","raindance","hydropump","recover"]},
			{"generation":3,"level":70,"moves":["recover","hydropump","raindance","swift"]},
			{"generation":3,"level":50,"moves":["psychoboost","recover","hydropump","featherdance"]}
		],
		dreamWorldPokeball: 'dreamball',
		tier: "Uber"
	},
	hooh: {
		viableMoves: {"substitute":1,"sacredfire":1,"bravebird":1,"earthquake":1,"roost":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["swift","sunnyday","fireblast","recover"]},
			{"generation":3,"level":70,"moves":["recover","fireblast","sunnyday","swift"]}
		],
		dreamWorldPokeball: 'dreamball',
		tier: "Uber"
	},
	celebi: {
		viableMoves: {"nastyplot":1,"psychic":1,"gigadrain":1,"recover":1,"healbell":1,"batonpass":1,"stealthrock":1,"earthpower":1,"hiddenpowerfire":1,"hiddenpowerice":1,"calmmind":1,"leafstorm":1},
		eventPokemon: [
			{"generation":3,"level":10,"moves":["confusion","recover","healbell","safeguard"]},
			{"generation":3,"level":70,"moves":["ancientpower","futuresight","batonpass","perishsong"]},
			{"generation":3,"level":10,"moves":["leechseed","recover","healbell","safeguard"]},
			{"generation":3,"level":30,"moves":["healbell","safeguard","ancientpower","futuresight"]},
			{"generation":4,"level":50,"moves":["leafstorm","recover","nastyplot","healingwish"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	treecko: {
		viableMoves: {"substitute":1,"leechseed":1,"gigadrain":1,"leafstorm":1,"hiddenpowerice":1,"hiddenpowerrock":1,"endeavor":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["pound","leer","absorb"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["pound","leer","absorb"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	grovyle: {
		viableMoves: {"substitute":1,"leechseed":1,"gigadrain":1,"leafstorm":1,"hiddenpowerice":1,"hiddenpowerrock":1,"endeavor":1},
		maleOnlyHidden: true,
		tier: "NFE"
	},
	sceptile: {
		viableMoves: {"substitute":1,"leechseed":1,"gigadrain":1,"leafstorm":1,"hiddenpowerice":1,"focusblast":1,"synthesis":1,"hiddenpowerrock":1},
		eventPokemon: [
			{"generation":5,"level":50,"isHidden":false,"moves":["leafstorm","dragonpulse","focusblast","rockslide"],"pokeball":"cherishball"}
		],
		maleOnlyHidden: true,
		tier: "RU"
	},
	torchic: {
		viableMoves: {"fireblast":1,"protect":1,"batonpass":1,"substitute":1,"hiddenpowergrass":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["scratch","growl","focusenergy","ember"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["scratch","growl","focusenergy","ember"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	combusken: {
		viableMoves: {"flareblitz":1,"skyuppercut":1,"protect":1,"swordsdance":1,"substitute":1,"batonpass":1},
		maleOnlyHidden: true,
		tier: "NU"
	},
	blaziken: {
		viableMoves: {"flareblitz":1,"highjumpkick":1,"protect":1,"swordsdance":1,"substitute":1,"batonpass":1,"bravebird":1},
		eventPokemon: [
			{"generation":3,"level":70,"moves":["blazekick","slash","mirrormove","skyuppercut"]},
			{"generation":5,"level":50,"isHidden":false,"moves":["flareblitz","highjumpkick","thunderpunch","stoneedge"],"pokeball":"cherishball"}
		],
		maleOnlyHidden: true,
		tier: "Uber"
	},
	mudkip: {
		viableMoves: {"waterfall":1,"earthpower":1,"superpower":1,"icebeam":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["tackle","growl","mudslap","watergun"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tackle","growl","mudslap","watergun"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	marshtomp: {
		viableMoves: {"waterfall":1,"earthquake":1,"superpower":1,"icepunch":1,"rockslide":1,"stealthrock":1},
		maleOnlyHidden: true,
		tier: "NFE"
	},
	swampert: {
		viableMoves: {"surf":1,"earthquake":1,"icebeam":1,"stealthrock":1,"roar":1,"superpower":1,"stoneedge":1,"rest":1,"sleeptalk":1,"hydropump":1},
		eventPokemon: [
			{"generation":5,"level":50,"isHidden":false,"moves":["earthquake","icebeam","hydropump","hammerarm"],"pokeball":"cherishball"}
		],
		maleOnlyHidden: true,
		tier: "UU"
	},
	poochyena: {
		viableMoves: {"superfang":1,"foulplay":1,"suckerpunch":1,"toxic":1},
		eventPokemon: [
			{"generation":3,"level":10,"abilities":["runaway"],"moves":["healbell","dig","poisonfang","growl"]}
		],
		tier: "LC"
	},
	mightyena: {
		viableMoves: {"suckerpunch":1,"crunch":1,"icefang":1,"firefang":1,"howl":1},
		tier: "NU"
	},
	zigzagoon: {
		viableMoves: {"bellydrum":1,"extremespeed":1,"seedbomb":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":5,"shiny":true,"abilities":["pickup"],"moves":["tackle","growl","tailwhip"]},
			{"generation":3,"level":5,"abilities":["pickup"],"moves":["tackle","growl","extremespeed"]}
		],
		tier: "LC"
	},
	linoone: {
		viableMoves: {"bellydrum":1,"extremespeed":1,"seedbomb":1,"substitute":1,"shadowclaw":1},
		tier: "NU"
	},
	wurmple: {
		viableMoves: {"bugbite":1,"poisonsting":1,"tackle":1,"electroweb":1},
		tier: "LC"
	},
	silcoon: {
		viableMoves: {"bugbite":1,"poisonsting":1,"tackle":1,"electroweb":1},
		tier: "NFE"
	},
	beautifly: {
		viableMoves: {"quiverdance":1,"bugbuzz":1,"gigadrain":1,"hiddenpowerfighting":1,"hiddenpowerrock":1,"substitute":1,"roost":1},
		tier: "NU"
	},
	cascoon: {
		viableMoves: {"bugbite":1,"poisonsting":1,"tackle":1,"electroweb":1},
		tier: "NFE"
	},
	dustox: {
		viableMoves: {"toxic":1,"roost":1,"whirlwind":1,"bugbuzz":1,"protect":1,"sludgebomb":1,"quiverdance":1},
		tier: "NU"
	},
	lotad: {
		viableMoves: {"gigadrain":1,"icebeam":1,"scald":1,"substitute":1,"leechseed":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["astonish","growl","absorb"]}
		],
		tier: "LC"
	},
	lombre: {
		viableMoves: {"gigadrain":1,"icebeam":1,"scald":1,"substitute":1,"leechseed":1},
		tier: "NFE"
	},
	ludicolo: {
		viableMoves: {"raindance":1,"hydropump":1,"surf":1,"gigadrain":1,"icebeam":1,"scald":1,"leechseed":1,"substitute":1,"toxic":1},
		eventPokemon: [
			{"generation":5,"level":50,"isHidden":false,"abilities":["swiftswim"],"moves":["fakeout","hydropump","icebeam","gigadrain"],"pokeball":"cherishball"},
			{"generation":5,"level":30,"gender":"M","nature":"Calm","isHidden":false,"abilities":["swiftswim"],"moves":["scald","gigadrain","icebeam","sunnyday"]}
		],
		tier: "NU"
	},
	seedot: {
		viableMoves: {"leechseed":1,"naturepower":1,"seedbomb":1,"explosion":1,"foulplay":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["bide","harden","growth"]},
			{"generation":3,"level":17,"moves":["refresh","gigadrain","bulletseed","secretpower"]}
		],
		tier: "LC"
	},
	nuzleaf: {
		viableMoves: {"foulplay":1,"naturepower":1,"seedbomb":1,"explosion":1,"swordsdance":1},
		tier: "NFE"
	},
	shiftry: {
		viableMoves: {"hiddenpowerfire":1,"swordsdance":1,"seedbomb":1,"suckerpunch":1,"naturepower":1,"nastyplot":1,"gigadrain":1,"darkpulse":1},
		tier: "NU"
	},
	taillow: {
		viableMoves: {"bravebird":1,"facade":1,"quickattack":1,"uturn":1,"protect":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["peck","growl","focusenergy","featherdance"]}
		],
		tier: "LC"
	},
	swellow: {
		viableMoves: {"bravebird":1,"facade":1,"quickattack":1,"uturn":1,"protect":1},
		eventPokemon: [
			{"generation":3,"level":43,"moves":["batonpass","skyattack","agility","facade"]}
		],
		tier: "NU"
	},
	wingull: {
		viableMoves: {"scald":1,"icebeam":1,"hiddenpowergrass":1,"uturn":1,"airslash":1,"hurricane":1},
		tier: "LC"
	},
	pelipper: {
		viableMoves: {"scald":1,"icebeam":1,"hiddenpowergrass":1,"uturn":1,"airslash":1,"hurricane":1,"toxic":1,"roost":1},
		tier: "NU"
	},
	ralts: {
		viableMoves: {"trickroom":1,"destinybond":1,"psychic":1,"willowisp":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["growl","wish"]},
			{"generation":3,"level":5,"moves":["growl","charm"]},
			{"generation":3,"level":20,"moves":["sing","shockwave","reflect","confusion"]}
		],
		tier: "LC"
	},
	kirlia: {
		viableMoves: {"trickroom":1,"destinybond":1,"psychic":1,"willowisp":1},
		tier: "NFE"
	},
	gardevoir: {
		viableMoves: {"psychic":1,"focusblast":1,"shadowball":1,"trick":1,"calmmind":1,"willowisp":1,"wish":1,"thunderbolt":1,"protect":1,"healingwish":1},
		eventPokemon: [
			{"generation":5,"level":50,"isHidden":false,"abilities":["trace"],"moves":["hypnosis","thunderbolt","focusblast","psychic"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	gallade: {
		viableMoves: {"closecombat":1,"trick":1,"stoneedge":1,"shadowsneak":1,"swordsdance":1,"bulkup":1,"drainpunch":1,"icepunch":1,"psychocut":1},
		tier: "RU"
	},
	surskit: {
		viableMoves: {"hydropump":1,"signalbeam":1,"hiddenpowerfire":1,"hiddenpowerfighting":1,"gigadrain":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["bubble","mudsport"]},
			{"generation":3,"level":10,"gender":"M","moves":["bubble","quickattack"]}
		],
		tier: "LC"
	},
	masquerain: {
		viableMoves: {"hydropump":1,"bugbuzz":1,"airslash":1,"quiverdance":1,"substitute":1,"batonpass":1,"roost":1},
		tier: "NU"
	},
	shroomish: {
		viableMoves: {"spore":1,"substitute":1,"leechseed":1,"gigadrain":1,"protect":1,"toxic":1,"stunspore":1},
		eventPokemon: [
			{"generation":3,"level":15,"abilities":["effectspore"],"moves":["refresh","falseswipe","megadrain","stunspore"]}
		],
		tier: "LC"
	},
	breloom: {
		viableMoves: {"spore":1,"substitute":1,"leechseed":1,"focuspunch":1,"machpunch":1,"lowsweep":1,"bulletseed":1,"stoneedge":1,"swordsdance":1},
		tier: "OU"
	},
	slakoth: {
		viableMoves: {"doubleedge":1,"hammerarm":1,"firepunch":1,"suckerpunch":1,"retaliate":1,"toxic":1},
		tier: "LC"
	},
	vigoroth: {
		viableMoves: {"bulkup":1,"return":1,"earthquake":1,"firepunch":1,"suckerpunch":1,"slackoff":1},
		tier: "NU"
	},
	slaking: {
		viableMoves: {"return":1,"earthquake":1,"pursuit":1,"firepunch":1,"suckerpunch":1,"doubleedge":1,"retaliate":1,"gigaimpact":1,"hammerarm":1},
		eventPokemon: [
			{"generation":4,"level":50,"gender":"M","nature":"Adamant","moves":["gigaimpact","return","shadowclaw","aerialace"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	nincada: {
		viableMoves: {"xscissor":1,"toxic":1,"aerialace":1,"nightslash":1},
		tier: "LC"
	},
	ninjask: {
		viableMoves: {"batonpass":1,"swordsdance":1,"substitute":1,"protect":1,"xscissor":1},
		tier: "NU"
	},
	shedinja: {
		viableMoves: {"swordsdance":1,"willowisp":1,"xscissor":1,"shadowsneak":1,"suckerpunch":1},
		eventPokemon: [
			{"generation":3,"level":50,"moves":["spite","confuseray","shadowball","grudge"]},
			{"generation":3,"level":20,"moves":["doubleteam","furycutter","screech"]},
			{"generation":3,"level":25,"moves":["swordsdance"]},
			{"generation":3,"level":31,"moves":["slash"]},
			{"generation":3,"level":38,"moves":["agility"]},
			{"generation":3,"level":45,"moves":["batonpass"]},
			{"generation":4,"level":52,"moves":["xscissor"]}
		],
		tier: "NU"
	},
	whismur: {
		viableMoves: {"hypervoice":1,"fireblast":1,"shadowball":1,"icebeam":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["pound","uproar","teeterdance"]}
		],
		tier: "LC"
	},
	loudred: {
		viableMoves: {"hypervoice":1,"fireblast":1,"shadowball":1,"icebeam":1},
		tier: "NFE"
	},
	exploud: {
		viableMoves: {"hypervoice":1,"overheat":1,"shadowball":1,"icebeam":1,"surf":1,"focusblast":1},
		eventPokemon: [
			{"generation":3,"level":100,"moves":["roar","rest","sleeptalk","hypervoice"]},
			{"generation":3,"level":50,"moves":["stomp","screech","hyperbeam","roar"]}
		],
		tier: "NU"
	},
	makuhita: {
		viableMoves: {"crosschop":1,"bulletpunch":1,"closecombat":1,"icepunch":1,"bulkup":1},
		eventPokemon: [
			{"generation":3,"level":18,"moves":["refresh","brickbreak","armthrust","rocktomb"]}
		],
		tier: "LC"
	},
	hariyama: {
		viableMoves: {"crosschop":1,"bulletpunch":1,"closecombat":1,"icepunch":1,"stoneedge":1,"bulkup":1},
		tier: "RU"
	},
	nosepass: {
		viableMoves: {"stoneedge":1,"toxic":1,"stealthrock":1,"thunderwave":1},
		eventPokemon: [
			{"generation":3,"level":26,"moves":["helpinghand","thunderbolt","thunderwave","rockslide"]}
		],
		tier: "LC"
	},
	probopass: {
		viableMoves: {"stealthrock":1,"thunderwave":1,"toxic":1,"earthpower":1,"powergem":1,"voltswitch":1},
		tier: "NU"
	},
	skitty: {
		viableMoves: {"return":1,"suckerpunch":1,"zenheadbutt":1,"thunderwave":1,"fakeout":1},
		eventPokemon: [
			{"generation":3,"level":5,"abilities":["cutecharm"],"moves":["tackle","growl","tailwhip","payday"]},
			{"generation":3,"level":5,"abilities":["cutecharm"],"moves":["growl","tackle","tailwhip","rollout"]},
			{"generation":3,"level":10,"gender":"M","abilities":["cutecharm"],"moves":["growl","tackle","tailwhip","attract"]}
		],
		tier: "LC"
	},
	delcatty: {
		viableMoves: {"return":1,"suckerpunch":1,"zenheadbutt":1,"thunderwave":1,"fakeout":1,"wish":1},
		eventPokemon: [
			{"generation":3,"level":18,"abilities":["cutecharm"],"moves":["sweetkiss","secretpower","attract","shockwave"]}
		],
		tier: "NU"
	},
	sableye: {
		viableMoves: {"recover":1,"willowisp":1,"taunt":1,"trick":1,"toxic":1,"nightshade":1,"seismictoss":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","abilities":["keeneye"],"moves":["leer","scratch","foresight","nightshade"]},
			{"generation":3,"level":33,"abilities":["keeneye"],"moves":["helpinghand","shadowball","feintattack","recover"]},
			{"generation":5,"level":50,"gender":"M","isHidden":true,"moves":["foulplay","octazooka","tickle","trick"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	mawile: {
		viableMoves: {"swordsdance":1,"ironhead":1,"firefang":1,"crunch":1,"batonpass":1,"substitute":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["astonish","faketears"]},
			{"generation":3,"level":22,"moves":["sing","falseswipe","vicegrip","irondefense"]}
		],
		tier: "NU"
	},
	aron: {
		viableMoves: {"headsmash":1,"ironhead":1,"earthquake":1,"superpower":1,"stealthrock":1},
		tier: "LC"
	},
	lairon: {
		viableMoves: {"headsmash":1,"ironhead":1,"earthquake":1,"superpower":1,"stealthrock":1},
		tier: "NU"
	},
	aggron: {
		viableMoves: {"rockpolish":1,"headsmash":1,"earthquake":1,"superpower":1,"heavyslam":1,"aquatail":1,"icepunch":1,"stealthrock":1,"thunderwave":1},
		eventPokemon: [
			{"generation":3,"level":100,"moves":["irontail","protect","metalsound","doubleedge"]},
			{"generation":3,"level":50,"moves":["takedown","irontail","protect","metalsound"]}
		],
		tier: "RU"
	},
	meditite: {
		viableMoves: {"highjumpkick":1,"psychocut":1,"icepunch":1,"thunderpunch":1,"trick":1,"fakeout":1,"bulletpunch":1,"drainpunch":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["bide","meditate","confusion"]},
			{"generation":3,"level":20,"moves":["dynamicpunch","confusion","shadowball","detect"]}
		],
		tier: "NFE"
	},
	medicham: {
		viableMoves: {"highjumpkick":1,"drainpunch":1,"psychocut":1,"icepunch":1,"thunderpunch":1,"trick":1,"fakeout":1,"bulletpunch":1},
		tier: "RU"
	},
	electrike: {
		viableMoves: {"voltswitch":1,"thunderbolt":1,"hiddenpowerice":1,"switcheroo":1,"flamethrower":1},
		tier: "LC"
	},
	manectric: {
		viableMoves: {"voltswitch":1,"thunderbolt":1,"hiddenpowerice":1,"overheat":1,"switcheroo":1,"flamethrower":1},
		eventPokemon: [
			{"generation":3,"level":44,"moves":["refresh","thunder","raindance","bite"]}
		],
		tier: "RU"
	},
	plusle: {
		viableMoves: {"nastyplot":1,"thunderbolt":1,"substitute":1,"batonpass":1,"hiddenpowerice":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["growl","thunderwave","watersport"]},
			{"generation":3,"level":10,"gender":"M","moves":["growl","thunderwave","quickattack"]}
		],
		tier: "NU"
	},
	minun: {
		viableMoves: {"nastyplot":1,"thunderbolt":1,"substitute":1,"batonpass":1,"hiddenpowerice":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["growl","thunderwave","mudsport"]},
			{"generation":3,"level":10,"gender":"M","moves":["growl","thunderwave","quickattack"]}
		],
		tier: "NU"
	},
	volbeat: {
		viableMoves: {"tailglow":1,"batonpass":1,"substitute":1,"bugbuzz":1,"thunderwave":1,"encore":1},
		tier: "NU"
	},
	illumise: {
		viableMoves: {"substitute":1,"batonpass":1,"wish":1,"bugbuzz":1,"encore":1,"thunderbolt":1},
		tier: "NU"
	},
	budew: {
		viableMoves: {"spikes":1,"sludgebomb":1,"sleeppowder":1,"gigadrain":1,"stunspore":1,"rest":1},
		tier: "LC"
	},
	roselia: {
		viableMoves: {"spikes":1,"toxicspikes":1,"sleeppowder":1,"gigadrain":1,"stunspore":1,"rest":1,"sludgebomb":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["absorb","growth","poisonsting"]},
			{"generation":3,"level":22,"moves":["sweetkiss","magicalleaf","leechseed","grasswhistle"]}
		],
		tier: "NU"
	},
	roserade: {
		viableMoves: {"sludgebomb":1,"gigadrain":1,"sleeppowder":1,"leafstorm":1,"spikes":1,"toxicspikes":1,"rest":1,"synthesis":1,"hiddenpowerfire":1},
		tier: "UU"
	},
	gulpin: {
		viableMoves: {"stockpile":1,"sludgebomb":1,"icebeam":1,"toxic":1,"painsplit":1,"yawn":1,"encore":1},
		eventPokemon: [
			{"generation":3,"level":17,"moves":["sing","shockwave","sludge","toxic"]}
		],
		tier: "LC"
	},
	swalot: {
		viableMoves: {"stockpile":1,"sludgebomb":1,"icebeam":1,"toxic":1,"yawn":1,"encore":1,"earthquake":1},
		tier: "NU"
	},
	carvanha: {
		viableMoves: {"protect":1,"hydropump":1,"icebeam":1,"waterfall":1,"crunch":1,"hiddenpowergrass":1,"aquajet":1},
		eventPokemon: [
			{"generation":3,"level":15,"moves":["refresh","waterpulse","bite","scaryface"]}
		],
		tier: "NFE"
	},
	sharpedo: {
		viableMoves: {"protect":1,"hydropump":1,"icebeam":1,"crunch":1,"earthquake":1,"waterfall":1,"hiddenpowergrass":1,"aquajet":1},
		tier: "UU"
	},
	wailmer: {
		viableMoves: {"waterspout":1,"surf":1,"hydropump":1,"icebeam":1,"hiddenpowergrass":1,"hiddenpowerelectric":1},
		tier: "LC"
	},
	wailord: {
		viableMoves: {"waterspout":1,"surf":1,"hydropump":1,"icebeam":1,"hiddenpowergrass":1,"hiddenpowerelectric":1},
		eventPokemon: [
			{"generation":3,"level":100,"moves":["rest","waterspout","amnesia","hydropump"]},
			{"generation":3,"level":50,"moves":["waterpulse","mist","rest","waterspout"]}
		],
		tier: "NU"
	},
	numel: {
		viableMoves: {"curse":1,"earthquake":1,"rockslide":1,"fireblast":1,"flamecharge":1,"rest":1,"sleeptalk":1,"stockpile":1},
		eventPokemon: [
			{"generation":3,"level":14,"abilities":["oblivious"],"moves":["charm","takedown","dig","ember"]}
		],
		tier: "LC"
	},
	camerupt: {
		viableMoves: {"rockpolish":1,"fireblast":1,"earthpower":1,"stoneedge":1,"lavaplume":1,"stealthrock":1,"earthquake":1},
		tier: "NU"
	},
	torkoal: {
		viableMoves: {"rapidspin":1,"stealthrock":1,"yawn":1,"lavaplume":1,"earthquake":1,"toxic":1,"willowisp":1},
		tier: "NU"
	},
	spoink: {
		viableMoves: {"psychic":1,"reflect":1,"lightscreen":1,"thunderwave":1,"trick":1,"healbell":1},
		eventPokemon: [
			{"generation":3,"level":5,"abilities":["owntempo"],"moves":["splash","uproar"]}
		],
		tier: "LC"
	},
	grumpig: {
		viableMoves: {"calmmind":1,"psychic":1,"focusblast":1,"shadowball":1,"thunderwave":1,"trick":1,"healbell":1},
		tier: "NU"
	},
	spinda: {
		viableMoves: {"wish":1,"protect":1,"return":1,"superpower":1,"suckerpunch":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["tackle","uproar","sing"]}
		],
		tier: "NU"
	},
	trapinch: {
		viableMoves: {"earthquake":1,"rockslide":1,"crunch":1,"quickattack":1,"superpower":1},
		eventPokemon: [
			{"generation":5,"level":1,"shiny":true,"isHidden":false,"moves":["bite"]}
		],
		tier: "LC"
	},
	vibrava: {
		viableMoves: {"substitute":1,"earthquake":1,"outrage":1,"roost":1,"uturn":1,"superpower":1},
		tier: "NFE"
	},
	flygon: {
		viableMoves: {"earthquake":1,"outrage":1,"dragonclaw":1,"uturn":1,"roost":1,"substitute":1,"stoneedge":1,"firepunch":1,"superpower":1},
		eventPokemon: [
			{"generation":3,"level":45,"moves":["sandtomb","crunch","dragonbreath","screech"]},
			{"generation":4,"level":50,"gender":"M","nature":"Naive","moves":["dracometeor","uturn","earthquake","dragonclaw"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	cacnea: {
		viableMoves: {"swordsdance":1,"spikes":1,"suckerpunch":1,"seedbomb":1,"drainpunch":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["poisonsting","leer","absorb","encore"]}
		],
		tier: "LC"
	},
	cacturne: {
		viableMoves: {"swordsdance":1,"spikes":1,"suckerpunch":1,"seedbomb":1,"drainpunch":1},
		eventPokemon: [
			{"generation":3,"level":45,"moves":["ingrain","feintattack","spikes","needlearm"]}
		],
		tier: "NU"
	},
	swablu: {
		viableMoves: {"roost":1,"toxic":1,"cottonguard":1,"return":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["peck","growl","falseswipe"]},
			{"generation":5,"level":1,"shiny":true,"isHidden":false,"moves":["peck","growl"]}
		],
		tier: "LC"
	},
	altaria: {
		viableMoves: {"dragondance":1,"outrage":1,"dragonclaw":1,"earthquake":1,"roost":1,"fireblast":1},
		eventPokemon: [
			{"generation":3,"level":45,"moves":["takedown","dragonbreath","dragondance","refresh"]},
			{"generation":3,"level":36,"moves":["healbell","dragonbreath","solarbeam","aerialace"]},
			{"generation":5,"level":35,"gender":"M","isHidden":true,"moves":["takedown","naturalgift","dragonbreath","falseswipe"]}
		],
		tier: "NU"
	},
	zangoose: {
		viableMoves: {"swordsdance":1,"closecombat":1,"nightslash":1,"quickattack":1,"facade":1},
		eventPokemon: [
			{"generation":3,"level":18,"moves":["leer","quickattack","swordsdance","furycutter"]},
			{"generation":3,"level":10,"gender":"M","moves":["scratch","leer","quickattack","swordsdance"]},
			{"generation":3,"level":28,"moves":["refresh","brickbreak","counter","crushclaw"]}
		],
		tier: "NU"
	},
	seviper: {
		viableMoves: {"sludgebomb":1,"flamethrower":1,"gigadrain":1,"switcheroo":1,"earthquake":1,"suckerpunch":1,"aquatail":1},
		eventPokemon: [
			{"generation":3,"level":18,"moves":["wrap","lick","bite","poisontail"]},
			{"generation":3,"level":30,"moves":["poisontail","screech","glare","crunch"]},
			{"generation":3,"level":10,"gender":"M","moves":["wrap","lick","bite"]}
		],
		tier: "NU"
	},
	lunatone: {
		viableMoves: {"psychic":1,"earthpower":1,"stealthrock":1,"rockpolish":1,"batonpass":1,"calmmind":1,"icebeam":1,"hiddenpowerrock":1,"moonlight":1},
		eventPokemon: [
			{"generation":3,"level":10,"moves":["tackle","harden","confusion"]},
			{"generation":3,"level":25,"moves":["batonpass","psychic","raindance","rocktomb"]}
		],
		tier: "NU"
	},
	solrock: {
		viableMoves: {"stealthrock":1,"explosion":1,"stoneedge":1,"zenheadbutt":1,"earthquake":1,"batonpass":1,"willowisp":1,"rockpolish":1,"morningsun":1},
		eventPokemon: [
			{"generation":3,"level":10,"moves":["tackle","harden","confusion"]},
			{"generation":3,"level":41,"moves":["batonpass","psychic","sunnyday","cosmicpower"]}
		],
		tier: "NU"
	},
	barboach: {
		viableMoves: {"dragondance":1,"waterfall":1,"earthquake":1,"return":1},
		tier: "LC"
	},
	whiscash: {
		viableMoves: {"dragondance":1,"waterfall":1,"earthquake":1,"stoneedge":1},
		eventPokemon: [
			{"generation":4,"level":51,"gender":"F","nature":"Gentle","abilities":["oblivious"],"moves":["earthquake","aquatail","zenheadbutt","gigaimpact"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	corphish: {
		viableMoves: {"dragondance":1,"waterfall":1,"crunch":1,"superpower":1,"swordsdance":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["bubble","watersport"]}
		],
		tier: "LC"
	},
	crawdaunt: {
		viableMoves: {"dragondance":1,"waterfall":1,"crunch":1,"superpower":1,"swordsdance":1},
		eventPokemon: [
			{"generation":3,"level":100,"moves":["taunt","crabhammer","swordsdance","guillotine"]},
			{"generation":3,"level":50,"moves":["knockoff","taunt","crabhammer","swordsdance"]}
		],
		tier: "RU"
	},
	baltoy: {
		viableMoves: {"stealthrock":1,"earthquake":1,"toxic":1,"psychic":1,"reflect":1,"lightscreen":1,"icebeam":1,"rapidspin":1},
		eventPokemon: [
			{"generation":3,"level":17,"moves":["refresh","rocktomb","mudslap","psybeam"]}
		],
		tier: "LC"
	},
	claydol: {
		viableMoves: {"stealthrock":1,"toxic":1,"psychic":1,"icebeam":1,"earthquake":1,"rapidspin":1,"reflect":1,"lightscreen":1},
		tier: "UU"
	},
	lileep: {
		viableMoves: {"stealthrock":1,"recover":1,"ancientpower":1,"hiddenpowerfire":1,"gigadrain":1,"stockpile":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"moves":["recover","rockslide","constrict","acid"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	cradily: {
		viableMoves: {"stealthrock":1,"recover":1,"stockpile":1,"seedbomb":1,"rockslide":1,"earthquake":1,"curse":1,"swordsdance":1},
		tier: "NU"
	},
	anorith: {
		viableMoves: {"stealthrock":1,"brickbreak":1,"toxic":1,"xscissor":1,"rockslide":1,"swordsdance":1,"rockpolish":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"moves":["harden","mudsport","watergun","crosspoison"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	armaldo: {
		viableMoves: {"stealthrock":1,"stoneedge":1,"toxic":1,"xscissor":1,"swordsdance":1,"earthquake":1,"superpower":1},
		tier: "NU"
	},
	feebas: {
		viableMoves: {"protect":1,"confuseray":1,"hypnosis":1,"scald":1,"toxic":1},
		tier: "LC"
	},
	milotic: {
		viableMoves: {"recover":1,"scald":1,"hypnosis":1,"toxic":1,"icebeam":1,"dragontail":1,"rest":1,"sleeptalk":1,"hiddenpowergrass":1},
		eventPokemon: [
			{"generation":3,"level":35,"moves":["waterpulse","twister","recover","raindance"]},
			{"generation":4,"level":50,"gender":"F","nature":"Bold","moves":["recover","raindance","icebeam","hydropump"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"shiny":true,"gender":"M","nature":"Timid","moves":["raindance","recover","hydropump","icywind"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"isHidden":false,"moves":["recover","hydropump","icebeam","mirrorcoat"],"pokeball":"cherishball"},
			{"generation":5,"level":58,"gender":"M","nature":"Lax","isHidden":false,"moves":["recover","surf","icebeam","toxic"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	castform: {
		viableMoves: {"sunnyday":1,"raindance":1,"fireblast":1,"hydropump":1,"thunder":1,"icebeam":1,"solarbeam":1},
		tier: "NU"
	},
	kecleon: {
		viableMoves: {"stealthrock":1,"recover":1,"return":1,"thunderwave":1,"suckerpunch":1},
		tier: "NU"
	},
	shuppet: {
		viableMoves: {"trickroom":1,"destinybond":1,"taunt":1,"shadowsneak":1,"willowisp":1},
		eventPokemon: [
			{"generation":3,"level":45,"abilities":["insomnia"],"moves":["spite","willowisp","feintattack","shadowball"]}
		],
		tier: "LC"
	},
	banette: {
		viableMoves: {"trickroom":1,"destinybond":1,"taunt":1,"shadowclaw":1,"willowisp":1},
		eventPokemon: [
			{"generation":3,"level":37,"abilities":["insomnia"],"moves":["helpinghand","feintattack","shadowball","curse"]},
			{"generation":5,"level":37,"gender":"F","isHidden":true,"moves":["feintattack","hex","shadowball","cottonguard"]}
		],
		tier: "NU"
	},
	duskull: {
		viableMoves: {"willowisp":1,"shadowsneak":1,"icebeam":1,"painsplit":1,"substitute":1,"nightshade":1},
		eventPokemon: [
			{"generation":3,"level":45,"moves":["pursuit","curse","willowisp","meanlook"]},
			{"generation":3,"level":19,"moves":["helpinghand","shadowball","astonish","confuseray"]}
		],
		tier: "LC"
	},
	dusclops: {
		viableMoves: {"willowisp":1,"shadowsneak":1,"icebeam":1,"painsplit":1,"substitute":1,"seismictoss":1},
		tier: "UU"
	},
	dusknoir: {
		viableMoves: {"willowisp":1,"shadowsneak":1,"icebeam":1,"painsplit":1,"substitute":1,"earthquake":1,"focuspunch":1},
		tier: "RU"
	},
	tropius: {
		viableMoves: {"leechseed":1,"substitute":1,"airslash":1,"gigadrain":1,"earthquake":1,"hiddenpowerfire":1,"roost":1,"leafstorm":1},
		eventPokemon: [
			{"generation":4,"level":53,"gender":"F","nature":"Jolly","abilities":["chlorophyll"],"moves":["airslash","synthesis","sunnyday","solarbeam"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	chingling: {
		viableMoves: {"hypnosis":1,"reflect":1,"lightscreen":1,"toxic":1,"wish":1,"psychic":1},
		tier: "LC"
	},
	chimecho: {
		viableMoves: {"hypnosis":1,"toxic":1,"wish":1,"psychic":1,"thunderwave":1,"recover":1,"calmmind":1,"shadowball":1,"hiddenpowerfighting":1,"healingwish":1},
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["wrap","growl","astonish"]}
		],
		tier: "NU"
	},
	absol: {
		viableMoves: {"swordsdance":1,"suckerpunch":1,"nightslash":1,"psychocut":1,"superpower":1,"pursuit":1,"megahorn":1},
		eventPokemon: [
			{"generation":3,"level":5,"abilities":["pressure"],"moves":["scratch","leer","wish"]},
			{"generation":3,"level":5,"abilities":["pressure"],"moves":["scratch","leer","spite"]},
			{"generation":3,"level":35,"abilities":["pressure"],"moves":["razorwind","bite","swordsdance","spite"]},
			{"generation":3,"level":70,"abilities":["pressure"],"moves":["doubleteam","slash","futuresight","perishsong"]}
		],
		tier: "RU"
	},
	snorunt: {
		viableMoves: {"spikes":1,"icebeam":1,"hiddenpowerground":1,"iceshard":1,"crunch":1},
		eventPokemon: [
			{"generation":3,"level":22,"abilities":["innerfocus"],"moves":["sing","waterpulse","bite","icywind"]}
		],
		tier: "LC"
	},
	glalie: {
		viableMoves: {"spikes":1,"icebeam":1,"iceshard":1,"crunch":1,"earthquake":1},
		tier: "NU"
	},
	froslass: {
		viableMoves: {"icebeam":1,"spikes":1,"destinybond":1,"shadowball":1,"substitute":1,"taunt":1,"thunderbolt":1,"thunderwave":1},
		tier: "BL"
	},
	spheal: {
		viableMoves: {"substitute":1,"protect":1,"toxic":1,"surf":1,"icebeam":1},
		eventPokemon: [
			{"generation":3,"level":17,"abilities":["thickfat"],"moves":["charm","aurorabeam","watergun","mudslap"]}
		],
		tier: "LC"
	},
	sealeo: {
		viableMoves: {"substitute":1,"protect":1,"toxic":1,"surf":1,"icebeam":1},
		tier: "NFE"
	},
	walrein: {
		viableMoves: {"substitute":1,"protect":1,"toxic":1,"surf":1,"icebeam":1,"roar":1},
		eventPokemon: [
			{"generation":5,"level":50,"isHidden":false,"abilities":["thickfat"],"moves":["icebeam","surf","hail","sheercold"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	clamperl: {
		viableMoves: {"shellsmash":1,"icebeam":1,"surf":1,"hiddenpowergrass":1,"hiddenpowerelectric":1,"substitute":1},
		tier: "LC"
	},
	huntail: {
		viableMoves: {"shellsmash":1,"return":1,"hydropump":1,"batonpass":1,"suckerpunch":1},
		tier: "NU"
	},
	gorebyss: {
		viableMoves: {"shellsmash":1,"batonpass":1,"hydropump":1,"icebeam":1,"hiddenpowergrass":1,"substitute":1},
		tier: "NU"
	},
	relicanth: {
		viableMoves: {"headsmash":1,"waterfall":1,"earthquake":1,"doubleedge":1,"stealthrock":1},
		tier: "NU"
	},
	luvdisc: {
		viableMoves: {"surf":1,"icebeam":1,"toxic":1,"sweetkiss":1,"protect":1},
		tier: "NU"
	},
	bagon: {
		viableMoves: {"outrage":1,"dragondance":1,"firefang":1,"rockslide":1,"dragonclaw":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["rage","bite","wish"]},
			{"generation":3,"level":5,"moves":["rage","bite","irondefense"]},
			{"generation":5,"level":1,"shiny":true,"isHidden":false,"moves":["rage"]}
		],
		tier: "LC"
	},
	shelgon: {
		viableMoves: {"outrage":1,"brickbreak":1,"dragonclaw":1,"dragondance":1},
		tier: "NU"
	},
	salamence: {
		viableMoves: {"outrage":1,"fireblast":1,"earthquake":1,"dracometeor":1,"roost":1,"dragondance":1,"dragonclaw":1},
		eventPokemon: [
			{"generation":3,"level":50,"moves":["protect","dragonbreath","scaryface","fly"]},
			{"generation":3,"level":50,"moves":["refresh","dragonclaw","dragondance","aerialace"]},
			{"generation":4,"level":50,"gender":"M","nature":"Naughty","moves":["hydropump","stoneedge","fireblast","dragonclaw"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"isHidden":false,"moves":["dragondance","dragonclaw","outrage","aerialace"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	beldum: {
		viableMoves: {"ironhead":1,"zenheadbutt":1,"headbutt":1,"irondefense":1},
		tier: "LC"
	},
	metang: {
		viableMoves: {"stealthrock":1,"meteormash":1,"toxic":1,"earthquake":1,"bulletpunch":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["takedown","confusion","metalclaw","refresh"]}
		],
		tier: "NU"
	},
	metagross: {
		viableMoves: {"meteormash":1,"earthquake":1,"agility":1,"stealthrock":1,"zenheadbutt":1,"bulletpunch":1,"trick":1},
		eventPokemon: [
			{"generation":4,"level":62,"nature":"Brave","moves":["bulletpunch","meteormash","hammerarm","zenheadbutt"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"isHidden":false,"moves":["meteormash","earthquake","bulletpunch","hammerarm"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"isHidden":false,"moves":["bulletpunch","zenheadbutt","hammerarm","icepunch"],"pokeball":"cherishball"},
			{"generation":5,"level":45,"isHidden":false,"moves":["earthquake","zenheadbutt","protect","meteormash"]},
			{"generation":5,"level":45,"isHidden":true,"moves":["irondefense","agility","hammerarm","doubleedge"]},
			{"generation":5,"level":45,"isHidden":true,"moves":["psychic","meteormash","hammerarm","doubleedge"]},
			{"generation":5,"level":58,"nature":"Serious","isHidden":false,"moves":["earthquake","hyperbeam","psychic","meteormash"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	regirock: {
		viableMoves: {"stealthrock":1,"thunderwave":1,"stoneedge":1,"earthquake":1,"curse":1,"rest":1,"sleeptalk":1,"rockslide":1,"toxic":1},
		eventPokemon: [
			{"generation":3,"level":40,"moves":["curse","superpower","ancientpower","hyperbeam"]}
		],
		tier: "NU"
	},
	regice: {
		viableMoves: {"thunderwave":1,"icebeam":1,"thunderbolt":1,"rest":1,"sleeptalk":1,"focusblast":1},
		eventPokemon: [
			{"generation":3,"level":40,"moves":["curse","superpower","ancientpower","hyperbeam"]}
		],
		tier: "NU"
	},
	registeel: {
		viableMoves: {"stealthrock":1,"ironhead":1,"curse":1,"rest":1,"thunderwave":1,"toxic":1},
		eventPokemon: [
			{"generation":3,"level":40,"moves":["curse","superpower","ancientpower","hyperbeam"]}
		],
		tier: "UU"
	},
	latias: {
		viableMoves: {"dragonpulse":1,"surf":1,"thunderbolt":1,"roost":1,"calmmind":1,"healingwish":1},
		eventPokemon: [
			{"generation":3,"level":50,"gender":"F","moves":["charm","recover","psychic","mistball"]},
			{"generation":3,"level":70,"gender":"F","moves":["mistball","psychic","recover","charm"]},
			{"generation":4,"level":40,"gender":"F","moves":["watersport","refresh","mistball","zenheadbutt"]}
		],
		tier: "OU"
	},
	latios: {
		viableMoves: {"dracometeor":1,"dragonpulse":1,"surf":1,"thunderbolt":1,"psyshock":1,"roost":1},
		eventPokemon: [
			{"generation":3,"level":50,"gender":"M","moves":["dragondance","recover","psychic","lusterpurge"]},
			{"generation":3,"level":70,"gender":"M","moves":["lusterpurge","psychic","recover","dragondance"]},
			{"generation":4,"level":40,"gender":"M","moves":["protect","refresh","lusterpurge","zenheadbutt"]}
		],
		tier: "OU"
	},
	kyogre: {
		viableMoves: {"waterspout":1,"surf":1,"thunder":1,"icebeam":1,"calmmind":1,"rest":1,"sleeptalk":1},
		eventPokemon: [
			{"generation":5,"level":80,"moves":["icebeam","ancientpower","waterspout","thunder"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["waterspout","thunder","icebeam","sheercold"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	groudon: {
		viableMoves: {"earthquake":1,"dragontail":1,"stealthrock":1,"stoneedge":1,"swordsdance":1,"rockpolish":1,"thunderwave":1,"firepunch":1},
		eventPokemon: [
			{"generation":5,"level":80,"moves":["earthquake","ancientpower","eruption","solarbeam"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["eruption","hammerarm","earthpower","solarbeam"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	rayquaza: {
		viableMoves: {"outrage":1,"vcreate":1,"extremespeed":1,"dragondance":1,"swordsdance":1,"dracometeor":1,"dragonclaw":1},
		eventPokemon: [
			{"generation":5,"level":70,"shiny":true,"moves":["dragonpulse","ancientpower","outrage","dragondance"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["extremespeed","hyperbeam","dragonpulse","vcreate"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	jirachi: {
		viableMoves: {"bodyslam":1,"ironhead":1,"firepunch":1,"thunderwave":1,"stealthrock":1,"wish":1,"uturn":1,"calmmind":1,"psychic":1,"thunder":1,"icepunch":1,"flashcannon":1,"meteormash":1},
		eventPokemon: [
			{"generation":3,"level":5,"moves":["wish","confusion","rest"]},
			{"generation":3,"level":30,"moves":["helpinghand","psychic","refresh","rest"]},
			{"generation":4,"level":5,"moves":["wish","confusion","rest"],"pokeball":"cherishball"},
			{"generation":4,"level":5,"moves":["wish","confusion","rest","dracometeor"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"moves":["healingwish","psychic","swift","meteormash"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"moves":["dracometeor","meteormash","wish","followme"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"moves":["wish","healingwish","cosmicpower","meteormash"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"moves":["wish","healingwish","swift","return"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	deoxys: {
		viableMoves: {"psychoboost":1,"superpower":1,"extremespeed":1,"icebeam":1,"thunderbolt":1,"firepunch":1,"spikes":1,"stealthrock":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["snatch","psychic","spikes","knockoff"]},
			{"generation":3,"level":30,"moves":["superpower","psychic","pursuit","taunt"]},
			{"generation":3,"level":30,"moves":["swift","psychic","pursuit","knockoff"]},
			{"generation":3,"level":70,"moves":["cosmicpower","recover","psychoboost","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","zapcannon","irondefense","extremespeed"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["psychoboost","swift","doubleteam","extremespeed"]},
			{"generation":4,"level":50,"moves":["psychoboost","detect","counter","mirrorcoat"]},
			{"generation":4,"level":50,"moves":["psychoboost","meteormash","superpower","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","leer","wrap","nightshade"]},
			{"generation":5,"level":100,"moves":["nastyplot","darkpulse","recover","psychoboost"],"pokeball":"duskball"}
		],
		tier: "Uber"
	},
	deoxysattack: {
		viableMoves: {"psychoboost":1,"superpower":1,"extremespeed":1,"icebeam":1,"thunderbolt":1,"firepunch":1,"spikes":1,"stealthrock":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["snatch","psychic","spikes","knockoff"]},
			{"generation":3,"level":30,"moves":["superpower","psychic","pursuit","taunt"]},
			{"generation":3,"level":30,"moves":["swift","psychic","pursuit","knockoff"]},
			{"generation":3,"level":70,"moves":["cosmicpower","recover","psychoboost","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","zapcannon","irondefense","extremespeed"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["psychoboost","swift","doubleteam","extremespeed"]},
			{"generation":4,"level":50,"moves":["psychoboost","detect","counter","mirrorcoat"]},
			{"generation":4,"level":50,"moves":["psychoboost","meteormash","superpower","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","leer","wrap","nightshade"]},
			{"generation":5,"level":100,"moves":["nastyplot","darkpulse","recover","psychoboost"],"pokeball":"duskball"}
		],
		tier: "Uber"
	},
	deoxysdefense: {
		viableMoves: {"spikes":1,"stealthrock":1,"recover":1,"taunt":1,"toxic":1,"agility":1,"seismictoss":1,"magiccoat":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["snatch","psychic","spikes","knockoff"]},
			{"generation":3,"level":30,"moves":["superpower","psychic","pursuit","taunt"]},
			{"generation":3,"level":30,"moves":["swift","psychic","pursuit","knockoff"]},
			{"generation":3,"level":70,"moves":["cosmicpower","recover","psychoboost","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","zapcannon","irondefense","extremespeed"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["psychoboost","swift","doubleteam","extremespeed"]},
			{"generation":4,"level":50,"moves":["psychoboost","detect","counter","mirrorcoat"]},
			{"generation":4,"level":50,"moves":["psychoboost","meteormash","superpower","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","leer","wrap","nightshade"]},
			{"generation":5,"level":100,"moves":["nastyplot","darkpulse","recover","psychoboost"],"pokeball":"duskball"}
		],
		tier: "Uber"
	},
	deoxysspeed: {
		viableMoves: {"spikes":1,"stealthrock":1,"superpower":1,"icebeam":1,"psychoboost":1,"taunt":1,"lightscreen":1,"reflect":1,"magiccoat":1,"trick":1},
		eventPokemon: [
			{"generation":3,"level":30,"moves":["snatch","psychic","spikes","knockoff"]},
			{"generation":3,"level":30,"moves":["superpower","psychic","pursuit","taunt"]},
			{"generation":3,"level":30,"moves":["swift","psychic","pursuit","knockoff"]},
			{"generation":3,"level":70,"moves":["cosmicpower","recover","psychoboost","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","zapcannon","irondefense","extremespeed"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["psychoboost","swift","doubleteam","extremespeed"]},
			{"generation":4,"level":50,"moves":["psychoboost","detect","counter","mirrorcoat"]},
			{"generation":4,"level":50,"moves":["psychoboost","meteormash","superpower","hyperbeam"]},
			{"generation":4,"level":50,"moves":["psychoboost","leer","wrap","nightshade"]},
			{"generation":5,"level":100,"moves":["nastyplot","darkpulse","recover","psychoboost"],"pokeball":"duskball"}
		],
		tier: "Uber"
	},
	turtwig: {
		viableMoves: {"reflect":1,"lightscreen":1,"stealthrock":1,"seedbomb":1,"substitute":1,"leechseed":1,"toxic":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tackle","withdraw","absorb"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["tackle","withdraw","absorb","stockpile"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	grotle: {
		viableMoves: {"reflect":1,"lightscreen":1,"stealthrock":1,"seedbomb":1,"substitute":1,"leechseed":1,"toxic":1},
		maleOnlyHidden: true,
		tier: "NFE"
	},
	torterra: {
		viableMoves: {"stealthrock":1,"earthquake":1,"woodhammer":1,"stoneedge":1,"synthesis":1,"leechseed":1},
		eventPokemon: [
			{"generation":5,"level":100,"gender":"M","isHidden":false,"moves":["woodhammer","earthquake","outrage","stoneedge"],"pokeball":"cherishball"}
		],
		maleOnlyHidden: true,
		tier: "NU"
	},
	chimchar: {
		viableMoves: {"stealthrock":1,"overheat":1,"hiddenpowergrass":1,"fakeout":1},
		eventPokemon: [
			{"generation":4,"level":40,"gender":"M","nature":"Mild","moves":["flamethrower","thunderpunch","grassknot","helpinghand"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["scratch","leer","ember","taunt"]},
			{"generation":4,"level":40,"gender":"M","nature":"Hardy","moves":["flamethrower","thunderpunch","grassknot","helpinghand"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["leer","ember","taunt","fakeout"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	monferno: {
		viableMoves: {"stealthrock":1,"overheat":1,"hiddenpowergrass":1,"fakeout":1,"vacuumwave":1},
		maleOnlyHidden: true,
		tier: "NU"
	},
	infernape: {
		viableMoves: {"stealthrock":1,"fireblast":1,"closecombat":1,"uturn":1,"grassknot":1,"stoneedge":1,"machpunch":1,"swordsdance":1,"nastyplot":1,"flareblitz":1,"hiddenpowerice":1,"thunderpunch":1},
		eventPokemon: [
			{"generation":5,"level":100,"gender":"M","isHidden":false,"moves":["fireblast","closecombat","uturn","grassknot"],"pokeball":"cherishball"}
		],
		maleOnlyHidden: true,
		tier: "OU"
	},
	piplup: {
		viableMoves: {"stealthrock":1,"hydropump":1,"scald":1,"icebeam":1,"hiddenpowerelectric":1,"hiddenpowerfire":1,"yawn":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["pound","growl","bubble"]},
			{"generation":5,"level":15,"isHidden":false,"moves":["hydropump","featherdance","watersport","peck"],"pokeball":"cherishball"},
			{"generation":5,"level":15,"gender":"M","isHidden":false,"moves":["sing","round","featherdance","peck"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["pound","growl","bubble","featherdance"]}
		],
		maleOnlyHidden: true,
		tier: "LC"
	},
	prinplup: {
		viableMoves: {"stealthrock":1,"hydropump":1,"scald":1,"icebeam":1,"hiddenpowerelectric":1,"hiddenpowerfire":1,"yawn":1},
		maleOnlyHidden: true,
		tier: "NFE"
	},
	empoleon: {
		viableMoves: {"stealthrock":1,"hydropump":1,"scald":1,"icebeam":1,"hiddenpowerelectric":1,"hiddenpowerfire":1,"roar":1,"grassknot":1},
		eventPokemon: [
			{"generation":5,"level":100,"gender":"M","isHidden":false,"moves":["hydropump","icebeam","aquajet","grassknot"],"pokeball":"cherishball"}
		],
		maleOnlyHidden: true,
		tier: "UU"
	},
	starly: {
		viableMoves: {"bravebird":1,"return":1,"uturn":1,"pursuit":1},
		eventPokemon: [
			{"generation":4,"level":1,"gender":"M","nature":"Mild","moves":["tackle","growl"]}
		],
		tier: "LC"
	},
	staravia: {
		viableMoves: {"bravebird":1,"return":1,"uturn":1,"pursuit":1},
		tier: "NFE"
	},
	staraptor: {
		viableMoves: {"bravebird":1,"closecombat":1,"return":1,"uturn":1,"quickattack":1,"substitute":1,"roost":1,"doubleedge":1},
		tier: "BL"
	},
	bidoof: {
		viableMoves: {"return":1,"aquatail":1,"curse":1,"quickattack":1,"stealthrock":1},
		eventPokemon: [
			{"generation":4,"level":1,"gender":"M","nature":"Lonely","abilities":["simple"],"moves":["tackle"]}
		],
		tier: "LC"
	},
	bibarel: {
		viableMoves: {"return":1,"waterfall":1,"curse":1,"quickattack":1,"stealthrock":1},
		tier: "NU"
	},
	kricketot: {
		viableMoves: {"endeavor":1,"mudslap":1,"bugbite":1,"strugglebug":1},
		tier: "LC"
	},
	kricketune: {
		viableMoves: {"swordsdance":1,"bugbite":1,"aerialace":1,"brickbreak":1,"toxic":1},
		tier: "NU"
	},
	shinx: {
		viableMoves: {"wildcharge":1,"icefang":1,"firefang":1,"crunch":1},
		tier: "LC"
	},
	luxio: {
		viableMoves: {"wildcharge":1,"icefang":1,"firefang":1,"crunch":1},
		tier: "NFE"
	},
	luxray: {
		viableMoves: {"wildcharge":1,"icefang":1,"firefang":1,"crunch":1,"superpower":1},
		tier: "NU"
	},
	cranidos: {
		viableMoves: {"headsmash":1,"rockslide":1,"earthquake":1,"zenheadbutt":1,"firepunch":1,"rockpolish":1,"crunch":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"moves":["pursuit","takedown","crunch","headbutt"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	rampardos: {
		viableMoves: {"headsmash":1,"rockslide":1,"earthquake":1,"zenheadbutt":1,"firepunch":1,"rockpolish":1,"crunch":1},
		tier: "NU"
	},
	shieldon: {
		viableMoves: {"stealthrock":1,"metalburst":1,"fireblast":1,"icebeam":1,"protect":1,"toxic":1,"roar":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"moves":["metalsound","takedown","bodyslam","protect"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	bastiodon: {
		viableMoves: {"stealthrock":1,"metalburst":1,"fireblast":1,"icebeam":1,"protect":1,"toxic":1,"roar":1},
		tier: "NU"
	},
	burmy: {
		viableMoves: {"bugbite":1,"hiddenpowerice":1,"electroweb":1,"protect":1},
		tier: "LC"
	},
	wormadam: {
		viableMoves: {"leafstorm":1,"gigadrain":1,"signalbeam":1,"hiddenpowerice":1,"hiddenpowerrock":1,"toxic":1,"psychic":1,"protect":1},
		tier: "NU"
	},
	wormadamsandy: {
		viableMoves: {"earthquake":1,"toxic":1,"rockblast":1,"protect":1,"stealthrock":1},
		tier: "NU"
	},
	wormadamtrash: {
		viableMoves: {"stealthrock":1,"toxic":1,"ironhead":1,"protect":1},
		tier: "NU"
	},
	mothim: {
		viableMoves: {"quiverdance":1,"bugbuzz":1,"airslash":1,"gigadrain":1,"roost":1},
		tier: "NU"
	},
	combee: {
		viableMoves: {"bugbuzz":1,"aircutter":1,"endeavor":1,"ominouswind":1},
		tier: "LC"
	},
	vespiquen: {
		viableMoves: {"substitute":1,"roost":1,"toxic":1,"attackorder":1,"protect":1,"defendorder":1},
		tier: "NU"
	},
	pachirisu: {
		viableMoves: {"lightscreen":1,"thunderwave":1,"superfang":1,"toxic":1,"voltswitch":1},
		tier: "NU"
	},
	buizel: {
		viableMoves: {"waterfall":1,"aquajet":1,"switcheroo":1,"brickbreak":1,"bulkup":1,"batonpass":1,"icepunch":1},
		tier: "LC"
	},
	floatzel: {
		viableMoves: {"waterfall":1,"aquajet":1,"switcheroo":1,"brickbreak":1,"bulkup":1,"batonpass":1,"icepunch":1,"crunch":1},
		tier: "NU"
	},
	cherubi: {
		viableMoves: {"sunnyday":1,"solarbeam":1,"weatherball":1,"hiddenpowerice":1},
		tier: "LC"
	},
	cherrim: {
		viableMoves: {"sunnyday":1,"solarbeam":1,"weatherball":1,"hiddenpowerice":1},
		tier: "NU"
	},
	shellos: {
		viableMoves: {"scald":1,"clearsmog":1,"recover":1,"toxic":1,"icebeam":1},
		tier: "LC"
	},
	gastrodon: {
		viableMoves: {"earthpower":1,"icebeam":1,"scald":1,"toxic":1,"recover":1,"clearsmog":1},
		tier: "OU"
	},
	drifloon: {
		viableMoves: {"acrobatics":1,"shadowball":1,"substitute":1,"calmmind":1,"hypnosis":1,"hiddenpowerfighting":1,"thunderbolt":1,"destinybond":1,"willowisp":1,"stockpile":1,"batonpass":1},
		tier: "LC"
	},
	drifblim: {
		viableMoves: {"acrobatics":1,"shadowball":1,"substitute":1,"calmmind":1,"hypnosis":1,"hiddenpowerfighting":1,"thunderbolt":1,"destinybond":1,"willowisp":1,"stockpile":1,"batonpass":1},
		tier: "NU"
	},
	buneary: {
		viableMoves: {"fakeout":1,"return":1,"switcheroo":1,"thunderpunch":1,"jumpkick":1,"firepunch":1,"icepunch":1,"healingwish":1},
		tier: "LC"
	},
	lopunny: {
		viableMoves: {"fakeout":1,"return":1,"switcheroo":1,"thunderpunch":1,"jumpkick":1,"firepunch":1,"icepunch":1,"healingwish":1},
		tier: "NU"
	},
	glameow: {
		viableMoves: {"fakeout":1,"uturn":1,"suckerpunch":1,"hypnosis":1,"quickattack":1,"return":1,"foulplay":1},
		tier: "LC"
	},
	purugly: {
		viableMoves: {"fakeout":1,"uturn":1,"suckerpunch":1,"hypnosis":1,"quickattack":1,"return":1},
		tier: "NU"
	},
	stunky: {
		viableMoves: {"pursuit":1,"suckerpunch":1,"crunch":1,"fireblast":1,"explosion":1,"taunt":1},
		tier: "LC"
	},
	skuntank: {
		viableMoves: {"pursuit":1,"suckerpunch":1,"crunch":1,"fireblast":1,"explosion":1,"taunt":1,"poisonjab":1},
		tier: "NU"
	},
	bronzor: {
		viableMoves: {"stealthrock":1,"psychic":1,"toxic":1,"hypnosis":1,"reflect":1,"lightscreen":1,"trickroom":1,"trick":1},
		tier: "LC"
	},
	bronzong: {
		viableMoves: {"stealthrock":1,"psychic":1,"earthquake":1,"toxic":1,"hypnosis":1,"reflect":1,"lightscreen":1,"trickroom":1,"explosion":1},
		tier: "UU"
	},
	chatot: {
		viableMoves: {"nastyplot":1,"hypervoice":1,"heatwave":1,"hiddenpowergrass":1,"substitute":1,"chatter":1},
		eventPokemon: [
			{"generation":4,"level":25,"gender":"M","nature":"Jolly","abilities":["keeneye"],"moves":["mirrormove","furyattack","chatter","taunt"]}
		],
		tier: "NU"
	},
	spiritomb: {
		viableMoves: {"shadowsneak":1,"suckerpunch":1,"pursuit":1,"trick":1,"willowisp":1,"calmmind":1,"darkpulse":1,"rest":1,"sleeptalk":1},
		eventPokemon: [
			{"generation":5,"level":61,"gender":"F","nature":"Quiet","isHidden":false,"moves":["darkpulse","psychic","silverwind","embargo"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	gible: {
		viableMoves: {"outrage":1,"dragonclaw":1,"earthquake":1,"fireblast":1,"stoneedge":1,"stealthrock":1},
		tier: "LC"
	},
	gabite: {
		viableMoves: {"outrage":1,"dragonclaw":1,"earthquake":1,"fireblast":1,"stoneedge":1,"stealthrock":1},
		tier: "NU"
	},
	garchomp: {
		viableMoves: {"outrage":1,"dragonclaw":1,"earthquake":1,"stoneedge":1,"firefang":1,"swordsdance":1},
		eventPokemon: [
			{"generation":5,"level":100,"gender":"M","isHidden":false,"moves":["outrage","earthquake","swordsdance","stoneedge"],"pokeball":"cherishball"},
			{"generation":5,"level":48,"gender":"M","isHidden":true,"moves":["dragonclaw","dig","crunch","outrage"]}
		],
		tier: "OU"
	},
	riolu: {
		viableMoves: {"crunch":1,"roar":1,"copycat":1,"drainpunch":1},
		eventPokemon: [
			{"generation":4,"level":30,"gender":"M","nature":"Serious","abilities":["steadfast"],"moves":["aurasphere","shadowclaw","bulletpunch","drainpunch"]}
		],
		tier: "LC"
	},
	lucario: {
		viableMoves: {"swordsdance":1,"closecombat":1,"crunch":1,"extremespeed":1,"icepunch":1,"bulletpunch":1,"nastyplot":1,"aurasphere":1,"darkpulse":1,"vacuumwave":1},
		eventPokemon: [
			{"generation":4,"level":50,"gender":"M","nature":"Modest","abilities":["steadfast"],"moves":["aurasphere","darkpulse","dragonpulse","waterpulse"],"pokeball":"cherishball"},
			{"generation":4,"level":30,"gender":"M","nature":"Adamant","abilities":["innerfocus"],"moves":["forcepalm","bonerush","sunnyday","blazekick"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["detect","metalclaw","counter","bulletpunch"]},
			{"generation":5,"level":50,"gender":"M","nature":"Naughty","isHidden":true,"moves":["bulletpunch","closecombat","stoneedge","shadowclaw"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	hippopotas: {
		viableMoves: {"earthquake":1,"slackoff":1,"whirlwind":1,"stealthrock":1,"protect":1,"toxic":1},
		tier: "LC"
	},
	hippowdon: {
		viableMoves: {"earthquake":1,"slackoff":1,"whirlwind":1,"stealthrock":1,"protect":1,"toxic":1,"icefang":1,"stoneedge":1,"stockpile":1},
		tier: "OU"
	},
	skorupi: {
		viableMoves: {"toxicspikes":1,"xscissor":1,"poisonjab":1,"protect":1},
		tier: "LC"
	},
	drapion: {
		viableMoves: {"crunch":1,"whirlwind":1,"toxicspikes":1,"pursuit":1,"earthquake":1,"aquatail":1,"swordsdance":1,"poisonjab":1,"rest":1,"sleeptalk":1},
		tier: "RU"
	},
	croagunk: {
		viableMoves: {"fakeout":1,"vacuumwave":1,"suckerpunch":1,"drainpunch":1,"darkpulse":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["astonish","mudslap","poisonsting","taunt"]},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["mudslap","poisonsting","taunt","poisonjab"]}
		],
		tier: "LC"
	},
	toxicroak: {
		viableMoves: {"fakeout":1,"suckerpunch":1,"drainpunch":1,"bulkup":1,"substitute":1,"swordsdance":1,"crosschop":1,"icepunch":1},
		tier: "OU"
	},
	carnivine: {
		viableMoves: {"swordsdance":1,"powerwhip":1,"return":1,"sleeppowder":1,"substitute":1,"leechseed":1},
		tier: "NU"
	},
	finneon: {
		viableMoves: {"surf":1,"uturn":1,"icebeam":1,"hiddenpowerelectric":1,"hiddenpowergrass":1,"raindance":1},
		tier: "LC"
	},
	lumineon: {
		viableMoves: {"surf":1,"uturn":1,"icebeam":1,"hiddenpowerelectric":1,"hiddenpowergrass":1,"raindance":1},
		tier: "NU"
	},
	snover: {
		viableMoves: {"blizzard":1,"iceshard":1,"gigadrain":1,"leechseed":1,"substitute":1},
		tier: "LC"
	},
	abomasnow: {
		viableMoves: {"blizzard":1,"iceshard":1,"gigadrain":1,"leechseed":1,"substitute":1,"focusblast":1},
		tier: "UU"
	},
	rotom: {
		viableMoves: {"thunderbolt":1,"discharge":1,"voltswitch":1,"shadowball":1,"substitute":1,"painsplit":1,"hiddenpowerice":1,"hiddenpowerfighting":1,"willowisp":1,"rest":1,"sleeptalk":1,"trick":1},
		eventPokemon: [
			{"generation":5,"level":10,"nature":"Naughty","moves":["uproar","astonish","trick","thundershock"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	rotomheat: {
		viableMoves: {"thunderbolt":1,"discharge":1,"voltswitch":1,"substitute":1,"painsplit":1,"hiddenpowerice":1,"willowisp":1,"rest":1,"sleeptalk":1,"overheat":1,"trick":1},
		eventPokemon: [
			{"generation":5,"level":10,"nature":"Naughty","moves":["uproar","astonish","trick","thundershock"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	rotomwash: {
		viableMoves: {"thunderbolt":1,"discharge":1,"voltswitch":1,"substitute":1,"painsplit":1,"hiddenpowerice":1,"willowisp":1,"rest":1,"sleeptalk":1,"trick":1,"hydropump":1},
		eventPokemon: [
			{"generation":5,"level":10,"nature":"Naughty","moves":["uproar","astonish","trick","thundershock"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	rotomfrost: {
		viableMoves: {"thunderbolt":1,"discharge":1,"voltswitch":1,"substitute":1,"painsplit":1,"hiddenpowerfighting":1,"willowisp":1,"rest":1,"sleeptalk":1,"trick":1,"blizzard":1},
		eventPokemon: [
			{"generation":5,"level":10,"nature":"Naughty","moves":["uproar","astonish","trick","thundershock"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	rotomfan: {
		viableMoves: {"thunderbolt":1,"discharge":1,"voltswitch":1,"thunderwave":1,"substitute":1,"painsplit":1,"hiddenpowerfighting":1,"willowisp":1,"rest":1,"sleeptalk":1,"trick":1,"airslash":1,"confuseray":1},
		eventPokemon: [
			{"generation":5,"level":10,"nature":"Naughty","moves":["uproar","astonish","trick","thundershock"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	rotommow: {
		viableMoves: {"thunderbolt":1,"discharge":1,"voltswitch":1,"substitute":1,"painsplit":1,"hiddenpowerice":1,"willowisp":1,"rest":1,"sleeptalk":1,"trick":1,"leafstorm":1},
		eventPokemon: [
			{"generation":5,"level":10,"nature":"Naughty","moves":["uproar","astonish","trick","thundershock"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	uxie: {
		viableMoves: {"reflect":1,"lightscreen":1,"uturn":1,"psychic":1,"thunderwave":1,"yawn":1,"healbell":1,"stealthrock":1,"trick":1,"toxic":1},
		tier: "RU"
	},
	mesprit: {
		viableMoves: {"calmmind":1,"psychic":1,"thunderbolt":1,"icebeam":1,"substitute":1,"uturn":1,"trick":1,"stealthrock":1},
		tier: "RU"
	},
	azelf: {
		viableMoves: {"nastyplot":1,"psychic":1,"fireblast":1,"grassknot":1,"thunderbolt":1,"icepunch":1,"uturn":1,"trick":1,"taunt":1,"stealthrock":1,"explosion":1},
		tier: "UU"
	},
	dialga: {
		viableMoves: {"stealthrock":1,"dracometeor":1,"dragonpulse":1,"roar":1,"dragontail":1,"thunderbolt":1,"outrage":1,"bulkup":1,"fireblast":1,"aurasphere":1,"rest":1,"sleeptalk":1,"dragonclaw":1},
		eventPokemon: [
			{"generation":5,"level":100,"shiny":true,"isHidden":false,"moves":["dragonpulse","dracometeor","aurasphere","roaroftime"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'dreamball',
		tier: "Uber"
	},
	palkia: {
		viableMoves: {"spacialrend":1,"dracometeor":1,"surf":1,"hydropump":1,"thunderbolt":1,"outrage":1,"fireblast":1},
		eventPokemon: [
			{"generation":5,"level":100,"shiny":true,"isHidden":false,"moves":["hydropump","dracometeor","spacialrend","aurasphere"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'dreamball',
		tier: "Uber"
	},
	heatran: {
		viableMoves: {"substitute":1,"fireblast":1,"lavaplume":1,"willowisp":1,"stealthrock":1,"earthpower":1,"hiddenpowergrass":1,"hiddenpowerice":1,"protect":1,"toxic":1,"roar":1},
		eventPokemon: [
			{"generation":4,"level":50,"nature":"Quiet","moves":["eruption","magmastorm","earthpower","ancientpower"]}
		],
		tier: "OU"
	},
	regigigas: {
		viableMoves: {"thunderwave":1,"substitute":1,"return":1,"drainpunch":1,"earthquake":1,"firepunch":1,"toxic":1,"confuseray":1},
		eventPokemon: [
			{"generation":4,"level":100,"moves":["ironhead","rockslide","icywind","crushgrip"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	giratina: {
		viableMoves: {"rest":1,"sleeptalk":1,"dragontail":1,"roar":1,"willowisp":1,"calmmind":1,"dragonpulse":1,"shadowball":1},
		eventPokemon: [
			{"generation":5,"level":100,"shiny":true,"isHidden":false,"moves":["dragonpulse","dragonclaw","aurasphere","shadowforce"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'dreamball',
		tier: "Uber"
	},
	giratinaorigin: {
		viableMoves: {"dracometeor":1,"shadowsneak":1,"dragontail":1,"hiddenpowerfire":1,"willowisp":1,"calmmind":1,"substitute":1,"dragonpulse":1,"shadowball":1,"aurasphere":1,"outrage":1},
		requiredItem: "Griseous Orb",
		tier: "Uber"
	},
	cresselia: {
		viableMoves: {"moonlight":1,"psychic":1,"icebeam":1,"thunderwave":1,"toxic":1,"lunardance":1,"rest":1,"sleeptalk":1,"calmmind":1,"reflect":1,"lightscreen":1},
		eventPokemon: [
			{"generation":5,"level":68,"gender":"F","nature":"Modest","moves":["icebeam","psyshock","energyball","hiddenpower"]}
		],
		tier: "BL2"
	},
	phione: {
		viableMoves: {"raindance":1,"scald":1,"uturn":1,"rest":1,"icebeam":1,"surf":1},
		eventPokemon: [
			{"generation":4,"level":50,"abilities":["hydration"],"moves":["grassknot","raindance","rest","surf"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	manaphy: {
		viableMoves: {"tailglow":1,"surf":1,"icebeam":1,"grassknot":1},
		eventPokemon: [
			{"generation":4,"level":5,"moves":["tailglow","bubble","watersport"]},
			{"generation":4,"level":1,"moves":["tailglow","bubble","watersport"]},
			{"generation":4,"level":50,"moves":["acidarmor","whirlpool","waterpulse","heartswap"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["heartswap","waterpulse","whirlpool","acidarmor"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["heartswap","whirlpool","waterpulse","acidarmor"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"nature":"Impish","moves":["aquaring","waterpulse","watersport","heartswap"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	darkrai: {
		viableMoves: {"darkvoid":1,"darkpulse":1,"focusblast":1,"nastyplot":1,"substitute":1,"trick":1},
		eventPokemon: [
			{"generation":4,"level":50,"moves":["roaroftime","spacialrend","nightmare","hypnosis"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["darkvoid","darkpulse","shadowball","doubleteam"]},
			{"generation":4,"level":50,"moves":["nightmare","hypnosis","roaroftime","spacialrend"],"pokeball":"cherishball"},
			{"generation":4,"level":50,"moves":["doubleteam","nightmare","feintattack","hypnosis"]},
			{"generation":5,"level":50,"moves":["darkvoid","ominouswind","feintattack","nightmare"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	shaymin: {
		viableMoves: {"seedflare":1,"earthpower":1,"airslash":1,"hiddenpowerfire":1,"rest":1,"substitute":1,"leechseed":1},
		eventPokemon: [
			{"generation":4,"level":50,"moves":["seedflare","aromatherapy","substitute","energyball"],"pokeball":"cherishball"},
			{"generation":4,"level":30,"moves":["synthesis","leechseed","magicalleaf","growth"]},
			{"generation":4,"level":30,"moves":["growth","magicalleaf","leechseed","synthesis"]},
			{"generation":5,"level":50,"moves":["seedflare","leechseed","synthesis","sweetscent"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	shayminsky: {
		viableMoves: {"seedflare":1,"earthpower":1,"airslash":1,"hiddenpowerice":1,"hiddenpowerfire":1,"substitute":1,"leechseed":1},
		eventPokemon: [
			{"generation":4,"level":50,"moves":["seedflare","aromatherapy","substitute","energyball"],"pokeball":"cherishball"},
			{"generation":4,"level":30,"moves":["synthesis","leechseed","magicalleaf","growth"]},
			{"generation":4,"level":30,"moves":["growth","magicalleaf","leechseed","synthesis"]},
			{"generation":5,"level":50,"moves":["seedflare","leechseed","synthesis","sweetscent"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	arceus: {
		viableMoves: {"swordsdance":1,"extremespeed":1,"shadowclaw":1,"earthquake":1,"recover":1},
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusbug: {
		viableMoves: {"swordsdance":1,"xscissor":1,"stoneedge":1,"recover":1,"calmmind":1,"judgment":1,"icebeam":1,"fireblast":1},
		requiredItem: "Insect Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusdark: {
		viableMoves: {"calmmind":1,"judgment":1,"recover":1,"refresh":1},
		requiredItem: "Dread Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusdragon: {
		viableMoves: {"swordsdance":1,"outrage":1,"extremespeed":1,"earthquake":1,"recover":1},
		requiredItem: "Draco Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceuselectric: {
		viableMoves: {"calmmind":1,"judgment":1,"recover":1,"icebeam":1},
		requiredItem: "Zap Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusfighting: {
		viableMoves: {"calmmind":1,"judgment":1,"icebeam":1,"darkpulse":1,"recover":1,"toxic":1},
		requiredItem: "Fist Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusfire: {
		viableMoves: {"calmmind":1,"flamethrower":1,"fireblast":1,"thunderbolt":1,"recover":1},
		requiredItem: "Flame Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusflying: {
		viableMoves: {"calmmind":1,"judgment":1,"refresh":1,"recover":1},
		requiredItem: "Sky Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusghost: {
		viableMoves: {"calmmind":1,"judgment":1,"focusblast":1,"flamethrower":1,"recover":1,"swordsdance":1,"shadowclaw":1,"brickbreak":1,"willowisp":1,"roar":1},
		requiredItem: "Spooky Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusgrass: {
		viableMoves: {"calmmind":1,"icebeam":1,"judgment":1,"earthpower":1,"recover":1,"stealthrock":1,"thunderwave":1},
		requiredItem: "Meadow Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusground: {
		viableMoves: {"swordsdance":1,"earthquake":1,"stoneedge":1,"recover":1,"calmmind":1,"judgment":1,"icebeam":1,"stealthrock":1},
		requiredItem: "Earth Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusice: {
		viableMoves: {"calmmind":1,"judgment":1,"icebeam":1,"thunderbolt":1,"focusblast":1,"recover":1},
		requiredItem: "Icicle Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceuspoison: {
		viableMoves: {"calmmind":1,"judgment":1,"sludgebomb":1,"focusblast":1,"fireblast":1,"recover":1,"willowisp":1,"icebeam":1,"stealthrock":1},
		requiredItem: "Toxic Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceuspsychic: {
		viableMoves: {"calmmind":1,"psyshock":1,"focusblast":1,"recover":1,"willowisp":1,"judgment":1},
		requiredItem: "Mind Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusrock: {
		viableMoves: {"calmmind":1,"judgment":1,"recover":1,"willowisp":1,"swordsdance":1,"stoneedge":1,"earthquake":1,"refresh":1},
		requiredItem: "Stone Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceussteel: {
		viableMoves: {"calmmind":1,"judgment":1,"recover":1,"roar":1,"willowisp":1,"swordsdance":1,"ironhead":1},
		requiredItem: "Iron Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceuswater: {
		viableMoves: {"swordsdance":1,"waterfall":1,"extremespeed":1,"dragonclaw":1,"recover":1,"calmmind":1,"judgment":1,"icebeam":1,"fireblast":1},
		requiredItem: "Splash Plate",
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["recover","hyperbeam","perishsong","judgment"]}
		],
		tier: "Uber"
	},
	arceusunknown: {
		eventPokemon: [
			{"generation":4,"level":100,"moves":["judgment","roaroftime","spacialrend","shadowforce"],"pokeball":"cherishball"},
		],
		tier: "Uber"
	},
	victini: {
		viableMoves: {"vcreate":1,"boltstrike":1,"uturn":1,"psychic":1,"focusblast":1,"blueflare":1},
		eventPokemon: [
			{"generation":5,"level":15,"moves":["incinerate","quickattack","endure","confusion"]},
			{"generation":5,"level":50,"moves":["vcreate","fusionflare","fusionbolt","searingshot"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"moves":["vcreate","blueflare","boltstrike","glaciate"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	snivy: {
		viableMoves: {"leafstorm":1,"hiddenpowerfire":1,"substitute":1,"leechseed":1,"hiddenpowerice":1,"gigadrain":1},
		eventPokemon: [
			{"generation":5,"level":5,"gender":"M","nature":"Hardy","moves":["growth","synthesis","energyball","aromatherapy"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	servine: {
		viableMoves: {"leafstorm":1,"hiddenpowerfire":1,"substitute":1,"leechseed":1,"hiddenpowerice":1,"gigadrain":1},
		tier: "NFE"
	},
	serperior: {
		viableMoves: {"leafstorm":1,"hiddenpowerfire":1,"substitute":1,"leechseed":1,"dragonpulse":1,"gigadrain":1},
		eventPokemon: [
			{"generation":5,"level":100,"gender":"M","moves":["leafstorm","substitute","gigadrain","leechseed"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	tepig: {
		viableMoves: {"flamecharge":1,"flareblitz":1,"wildcharge":1,"superpower":1,"headsmash":1},
		tier: "LC"
	},
	pignite: {
		viableMoves: {"flamecharge":1,"flareblitz":1,"wildcharge":1,"superpower":1,"headsmash":1},
		tier: "NFE"
	},
	emboar: {
		viableMoves: {"flareblitz":1,"superpower":1,"flamecharge":1,"wildcharge":1,"headsmash":1,"earthquake":1,"fireblast":1},
		eventPokemon: [
			{"generation":5,"level":100,"gender":"M","moves":["flareblitz","hammerarm","wildcharge","headsmash"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	oshawott: {
		viableMoves: {"swordsdance":1,"waterfall":1,"aquajet":1,"xscissor":1},
		tier: "LC"
	},
	dewott: {
		viableMoves: {"swordsdance":1,"waterfall":1,"aquajet":1,"xscissor":1},
		tier: "NFE"
	},
	samurott: {
		viableMoves: {"swordsdance":1,"aquajet":1,"waterfall":1,"megahorn":1,"superpower":1},
		eventPokemon: [
			{"generation":5,"level":100,"gender":"M","moves":["hydropump","icebeam","megahorn","superpower"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	patrat: {
		viableMoves: {"swordsdance":1,"batonpass":1,"substitute":1,"hypnosis":1,"return":1,"superfang":1},
		tier: "LC"
	},
	watchog: {
		viableMoves: {"swordsdance":1,"batonpass":1,"substitute":1,"hypnosis":1,"return":1,"superfang":1},
		tier: "NU"
	},
	lillipup: {
		viableMoves: {"return":1,"wildcharge":1,"firefang":1,"crunch":1,"icefang":1},
		tier: "LC"
	},
	herdier: {
		viableMoves: {"return":1,"wildcharge":1,"firefang":1,"crunch":1,"icefang":1},
		tier: "NFE"
	},
	stoutland: {
		viableMoves: {"return":1,"wildcharge":1,"superpower":1,"crunch":1,"icefang":1},
		tier: "NU"
	},
	purrloin: {
		viableMoves: {"swagger":1,"thunderwave":1,"substitute":1,"foulplay":1},
		tier: "LC"
	},
	liepard: {
		viableMoves: {"swagger":1,"thunderwave":1,"substitute":1,"foulplay":1},
		eventPokemon: [
			{"generation":5,"level":20,"gender":"F","nature":"Jolly","isHidden":true,"moves":["fakeout","foulplay","encore","swagger"]}
		],
		tier: "NU"
	},
	pansage: {
		viableMoves: {"leafstorm":1,"hiddenpowerfire":1,"hiddenpowerice":1,"gigadrain":1,"nastyplot":1,"substitute":1,"leechseed":1},
		eventPokemon: [
			{"generation":5,"level":1,"gender":"M","nature":"Brave","isHidden":false,"moves":["bulletseed","bite","solarbeam","dig"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["leer","lick","vinewhip","leafstorm"]},
			{"generation":5,"level":30,"gender":"M","nature":"Serious","isHidden":false,"moves":["seedbomb","solarbeam","rocktomb","dig"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	simisage: {
		viableMoves: {"nastyplot":1,"leafstorm":1,"hiddenpowerfire":1,"hiddenpowerice":1,"gigadrain":1,"focusblast":1,"substitute":1,"leechseed":1,"synthesis":1},
		tier: "NU"
	},
	pansear: {
		viableMoves: {"nastyplot":1,"fireblast":1,"hiddenpowerelectric":1,"hiddenpowerground":1,"sunnyday":1,"solarbeam":1,"overheat":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["leer","lick","incinerate","heatwave"]}
		],
		tier: "LC"
	},
	simisear: {
		viableMoves: {"nastyplot":1,"fireblast":1,"focusblast":1,"grassknot":1,"hiddenpowerground":1,"substitute":1,"flamethrower":1,"overheat":1},
		tier: "NU"
	},
	panpour: {
		viableMoves: {"nastyplot":1,"hydropump":1,"hiddenpowergrass":1,"substitute":1,"surf":1,"icebeam":1},
		eventPokemon: [
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["leer","lick","watergun","hydropump"]}
		],
		tier: "LC"
	},
	simipour: {
		viableMoves: {"nastyplot":1,"hydropump":1,"icebeam":1,"substitute":1,"grassknot":1,"surf":1},
		tier: "NU"
	},
	munna: {
		viableMoves: {"psychic":1,"hiddenpowerfighting":1,"hypnosis":1,"calmmind":1,"moonlight":1,"thunderwave":1,"batonpass":1,"psyshock":1,"healbell":1,"signalbeam":1},
		tier: "LC"
	},
	musharna: {
		viableMoves: {"calmmind":1,"thunderwave":1,"moonlight":1,"psychic":1,"hiddenpowerfighting":1,"batonpass":1,"psyshock":1,"healbell":1,"signalbeam":1},
		eventPokemon: [
			{"generation":5,"level":50,"isHidden":true,"moves":["defensecurl","luckychant","psybeam","hypnosis"]}
		],
		tier: "NU"
	},
	pidove: {
		viableMoves: {"pluck":1,"uturn":1,"return":1,"detect":1,"roost":1,"wish":1},
		eventPokemon: [
			{"generation":5,"level":1,"gender":"F","nature":"Hardy","isHidden":false,"abilities":["superluck"],"moves":["gust","quickattack","aircutter"]}
		],
		tier: "LC"
	},
	tranquill: {
		viableMoves: {"pluck":1,"uturn":1,"return":1,"detect":1,"roost":1,"wish":1},
		tier: "NFE"
	},
	unfezant: {
		viableMoves: {"pluck":1,"uturn":1,"return":1,"detect":1,"roost":1,"wish":1},
		tier: "NU"
	},
	blitzle: {
		viableMoves: {"voltswitch":1,"hiddenpowergrass":1,"wildcharge":1,"mefirst":1},
		tier: "LC"
	},
	zebstrika: {
		viableMoves: {"voltswitch":1,"hiddenpowergrass":1,"overheat":1,"wildcharge":1},
		tier: "NU"
	},
	roggenrola: {
		viableMoves: {"autotomize":1,"stoneedge":1,"stealthrock":1,"rockblast":1,"earthquake":1,"explosion":1},
		tier: "LC"
	},
	boldore: {
		viableMoves: {"autotomize":1,"stoneedge":1,"stealthrock":1,"rockblast":1,"earthquake":1,"explosion":1},
		tier: "NFE"
	},
	gigalith: {
		viableMoves: {"stealthrock":1,"rockblast":1,"earthquake":1,"explosion":1,"stoneedge":1,"autotomize":1,"superpower":1},
		tier: "NU"
	},
	woobat: {
		viableMoves: {"calmmind":1,"psychic":1,"airslash":1,"gigadrain":1,"roost":1,"heatwave":1,"storedpower":1},
		tier: "LC"
	},
	swoobat: {
		viableMoves: {"calmmind":1,"psychic":1,"airslash":1,"gigadrain":1,"roost":1,"heatwave":1,"storedpower":1},
		tier: "NU"
	},
	drilbur: {
		viableMoves: {"swordsdance":1,"rapidspin":1,"earthquake":1,"rockslide":1,"shadowclaw":1,"return":1,"xscissor":1},
		tier: "LC"
	},
	excadrill: {
		viableMoves: {"swordsdance":1,"rapidspin":1,"earthquake":1,"rockslide":1,"ironhead":1},
		tier: "Uber"
	},
	audino: {
		viableMoves: {"wish":1,"protect":1,"healbell":1,"toxic":1,"thunderwave":1,"reflect":1,"lightscreen":1,"return":1},
		eventPokemon: [
			{"generation":5,"level":30,"gender":"F","nature":"Calm","isHidden":false,"abilities":["healer"],"moves":["healpulse","helpinghand","refresh","doubleslap"],"pokeball":"cherishball"},
			{"generation":5,"level":30,"gender":"F","nature":"Serious","isHidden":false,"abilities":["healer"],"moves":["healpulse","helpinghand","refresh","present"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	timburr: {
		viableMoves: {"machpunch":1,"bulkup":1,"drainpunch":1,"icepunch":1},
		tier: "LC"
	},
	gurdurr: {
		viableMoves: {"bulkup":1,"machpunch":1,"drainpunch":1,"icepunch":1},
		tier: "NU"
	},
	conkeldurr: {
		viableMoves: {"bulkup":1,"machpunch":1,"drainpunch":1,"icepunch":1},
		tier: "OU"
	},
	tympole: {
		viableMoves: {"hydropump":1,"surf":1,"sludgewave":1,"earthpower":1,"hiddenpowerelectric":1},
		tier: "LC"
	},
	palpitoad: {
		viableMoves: {"hydropump":1,"surf":1,"sludgewave":1,"earthpower":1,"hiddenpowerelectric":1,"stealthrock":1},
		tier: "NFE"
	},
	seismitoad: {
		viableMoves: {"hydropump":1,"surf":1,"sludgewave":1,"earthpower":1,"hiddenpowerelectric":1,"stealthrock":1},
		tier: "NU"
	},
	throh: {
		viableMoves: {"bulkup":1,"circlethrow":1,"icepunch":1,"stormthrow":1,"rest":1,"sleeptalk":1},
		tier: "NU"
	},
	sawk: {
		viableMoves: {"closecombat":1,"earthquake":1,"icepunch":1,"stoneedge":1,"bulkup":1},
		tier: "NU"
	},
	sewaddle: {
		viableMoves: {"calmmind":1,"gigadrain":1,"bugbuzz":1,"hiddenpowerfire":1,"hiddenpowerice":1,"airslash":1},
		tier: "LC"
	},
	swadloon: {
		viableMoves: {"calmmind":1,"gigadrain":1,"bugbuzz":1,"hiddenpowerfire":1,"hiddenpowerice":1,"airslash":1},
		tier: "NFE"
	},
	leavanny: {
		viableMoves: {"swordsdance":1,"leafblade":1,"xscissor":1,"batonpass":1},
		tier: "NU"
	},
	venipede: {
		viableMoves: {"toxicspikes":1,"steamroller":1,"spikes":1,"poisonjab":1},
		tier: "LC"
	},
	whirlipede: {
		viableMoves: {"toxicspikes":1,"steamroller":1,"spikes":1,"poisonjab":1},
		tier: "NU"
	},
	scolipede: {
		viableMoves: {"spikes":1,"toxicspikes":1,"megahorn":1,"rockslide":1,"earthquake":1,"swordsdance":1,"batonpass":1,"aquatail":1,"superpower":1},
		tier: "BL3"
	},
	cottonee: {
		viableMoves: {"encore":1,"taunt":1,"substitute":1,"leechseed":1,"toxic":1,"stunspore":1},
		tier: "LC"
	},
	whimsicott: {
		viableMoves: {"encore":1,"taunt":1,"substitute":1,"leechseed":1,"uturn":1,"toxic":1,"stunspore":1},
		eventPokemon: [
			{"generation":5,"level":50,"gender":"F","nature":"Timid","isHidden":false,"abilities":["prankster"],"moves":["swagger","gigadrain","beatup","helpinghand"],"pokeball":"cherishball"}
		],
		tier: "RU"
	},
	petilil: {
		viableMoves: {"sunnyday":1,"sleeppowder":1,"solarbeam":1,"hiddenpowerfire":1,"hiddenpowerice":1,"healingwish":1},
		tier: "LC"
	},
	lilligant: {
		viableMoves: {"quiverdance":1,"gigadrain":1,"sleeppowder":1,"hiddenpowerice":1,"hiddenpowerfire":1,"hiddenpowerrock":1,"petaldance":1},
		tier: "RU"
	},
	basculin: {
		viableMoves: {"waterfall":1,"aquajet":1,"superpower":1,"crunch":1},
		tier: "NU"
	},
	basculinbluestriped: {
		viableMoves: {"waterfall":1,"aquajet":1,"superpower":1,"crunch":1},
		tier: "NU"
	},
	sandile: {
		viableMoves: {"earthquake":1,"stoneedge":1,"pursuit":1,"crunch":1},
		tier: "LC"
	},
	krokorok: {
		viableMoves: {"earthquake":1,"stoneedge":1,"pursuit":1,"crunch":1},
		tier: "NFE"
	},
	krookodile: {
		viableMoves: {"earthquake":1,"stoneedge":1,"pursuit":1,"crunch":1,"bulkup":1,"superpower":1},
		tier: "UU"
	},
	darumaka: {
		viableMoves: {"uturn":1,"flareblitz":1,"firepunch":1,"rockslide":1,"superpower":1},
		tier: "LC"
	},
	darmanitan: {
		viableMoves: {"uturn":1,"flareblitz":1,"firepunch":1,"rockslide":1,"earthquake":1,"superpower":1},
		eventPokemon: [
			{"generation":5,"level":35,"isHidden":true,"moves":["thrash","bellydrum","flareblitz","hammerarm"]}
		],
		tier: "UU"
	},
	maractus: {
		viableMoves: {"spikes":1,"gigadrain":1,"leechseed":1,"hiddenpowerfire":1,"toxic":1},
		tier: "NU"
	},
	dwebble: {
		viableMoves: {"stealthrock":1,"spikes":1,"shellsmash":1,"earthquake":1,"rockblast":1,"xscissor":1,"stoneedge":1},
		tier: "LC"
	},
	crustle: {
		viableMoves: {"stealthrock":1,"spikes":1,"shellsmash":1,"earthquake":1,"rockblast":1,"xscissor":1,"stoneedge":1},
		tier: "RU"
	},
	scraggy: {
		viableMoves: {"dragondance":1,"icepunch":1,"highjumpkick":1,"drainpunch":1,"rest":1,"bulkup":1,"crunch":1},
		eventPokemon: [
			{"generation":5,"level":1,"gender":"M","nature":"Adamant","isHidden":false,"abilities":["moxie"],"moves":["headbutt","leer","highjumpkick","lowkick"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	scrafty: {
		viableMoves: {"dragondance":1,"icepunch":1,"highjumpkick":1,"drainpunch":1,"rest":1,"bulkup":1,"crunch":1},
		eventPokemon: [
			{"generation":5,"level":50,"gender":"M","nature":"Brave","isHidden":false,"abilities":["moxie"],"moves":["firepunch","payback","drainpunch","substitute"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	sigilyph: {
		viableMoves: {"cosmicpower":1,"roost":1,"storedpower":1,"psychoshift":1},
		tier: "RU"
	},
	yamask: {
		viableMoves: {"nastyplot":1,"trickroom":1,"shadowball":1,"hiddenpowerfighting":1,"willowisp":1,"haze":1,"rest":1,"sleeptalk":1,"painsplit":1},
		tier: "LC"
	},
	cofagrigus: {
		viableMoves: {"nastyplot":1,"trickroom":1,"shadowball":1,"hiddenpowerfighting":1,"willowisp":1,"haze":1,"rest":1,"sleeptalk":1,"painsplit":1},
		tier: "UU"
	},
	tirtouga: {
		viableMoves: {"shellsmash":1,"aquajet":1,"waterfall":1,"stoneedge":1,"earthquake":1,"stealthrock":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"abilities":["sturdy"],"moves":["bite","protect","aquajet","bodyslam"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	carracosta: {
		viableMoves: {"shellsmash":1,"aquajet":1,"waterfall":1,"stoneedge":1,"earthquake":1,"stealthrock":1},
		tier: "NU"
	},
	archen: {
		viableMoves: {"acrobatics":1,"stoneedge":1,"rockslide":1,"earthquake":1,"uturn":1,"pluck":1,"headsmash":1},
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","moves":["headsmash","wingattack","doubleteam","scaryface"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	archeops: {
		viableMoves: {"acrobatics":1,"stoneedge":1,"rockslide":1,"earthquake":1,"uturn":1,"pluck":1,"headsmash":1},
		tier: "RU"
	},
	trubbish: {
		viableMoves: {"clearsmog":1,"toxicspikes":1,"spikes":1,"gunkshot":1},
		tier: "LC"
	},
	garbodor: {
		viableMoves: {"spikes":1,"toxicspikes":1,"gunkshot":1,"clearsmog":1},
		tier: "NU"
	},
	zorua: {
		viableMoves: {"suckerpunch":1,"extrasensory":1,"darkpulse":1,"hiddenpowerfighting":1,"uturn":1},
		tier: "LC"
	},
	zoroark: {
		viableMoves: {"suckerpunch":1,"darkpulse":1,"focusblast":1,"flamethrower":1,"uturn":1,"nastyplot":1},
		eventPokemon: [
			{"generation":5,"level":50,"gender":"M","nature":"Quirky","moves":["agility","embargo","punishment","snarl"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	minccino: {
		viableMoves: {"return":1,"tailslap":1,"wakeupslap":1,"uturn":1,"aquatail":1},
		tier: "LC"
	},
	cinccino: {
		viableMoves: {"return":1,"tailslap":1,"wakeupslap":1,"uturn":1,"aquatail":1,"bulletseed":1,"rockblast":1},
		tier: "RU"
	},
	gothita: {
		viableMoves: {"psychic":1,"thunderbolt":1,"hiddenpowerfighting":1,"shadowball":1,"substitute":1,"calmmind":1,"reflect":1,"lightscreen":1,"trick":1},
		tier: "LC"
	},
	gothorita: {
		viableMoves: {"psychic":1,"thunderbolt":1,"hiddenpowerfighting":1,"shadowball":1,"substitute":1,"calmmind":1,"reflect":1,"lightscreen":1,"trick":1},
		eventPokemon: [
			{"generation":5,"level":32,"gender":"M","isHidden":true,"moves":["psyshock","flatter","futuresight","mirrorcoat"]},
			{"generation":5,"level":32,"gender":"M","isHidden":true,"moves":["psyshock","flatter","futuresight","imprison"]}
		],
		maleOnlyHidden: true,
		tier: "NFE"
	},
	gothitelle: {
		viableMoves: {"psychic":1,"thunderbolt":1,"hiddenpowerfighting":1,"shadowball":1,"substitute":1,"calmmind":1,"reflect":1,"lightscreen":1,"trick":1},
		maleOnlyHidden: true,
		tier: "BL"
	},
	solosis: {
		viableMoves: {"calmmind":1,"recover":1,"psychic":1,"hiddenpowerfighting":1,"shadowball":1,"trickroom":1,"psyshock":1},
		tier: "LC"
	},
	duosion: {
		viableMoves: {"calmmind":1,"recover":1,"psychic":1,"hiddenpowerfighting":1,"shadowball":1,"trickroom":1,"psyshock":1},
		tier: "NFE"
	},
	reuniclus: {
		viableMoves: {"calmmind":1,"recover":1,"psychic":1,"focusblast":1,"shadowball":1,"trickroom":1,"psyshock":1},
		tier: "OU"
	},
	ducklett: {
		viableMoves: {"scald":1,"airslash":1,"roost":1,"hurricane":1,"icebeam":1,"hiddenpowergrass":1,"bravebird":1},
		tier: "LC"
	},
	swanna: {
		viableMoves: {"airslash":1,"roost":1,"hurricane":1,"surf":1,"icebeam":1,"raindance":1},
		tier: "NU"
	},
	vanillite: {
		viableMoves: {"icebeam":1,"explosion":1,"hiddenpowerelectric":1,"hiddenpowerfighting":1,"autotomize":1},
		tier: "LC"
	},
	vanillish: {
		viableMoves: {"icebeam":1,"explosion":1,"hiddenpowerelectric":1,"hiddenpowerfighting":1,"autotomize":1},
		tier: "NFE"
	},
	vanilluxe: {
		viableMoves: {"icebeam":1,"explosion":1,"hiddenpowerelectric":1,"hiddenpowerfighting":1,"autotomize":1},
		tier: "NU"
	},
	deerling: {
		viableMoves: {"workup":1,"agility":1,"batonpass":1,"seedbomb":1,"jumpkick":1,"naturepower":1,"synthesis":1,"return":1,"thunderwave":1},
		eventPokemon: [
			{"generation":5,"level":30,"gender":"F","isHidden":true,"moves":["feintattack","takedown","jumpkick","aromatherapy"]}
		],
		tier: "LC"
	},
	sawsbuck: {
		viableMoves: {"swordsdance":1,"hornleech":1,"jumpkick":1,"naturepower":1,"return":1,"substitute":1,"synthesis":1,"batonpass":1},
		tier: "NU"
	},
	emolga: {
		viableMoves: {"agility":1,"chargebeam":1,"batonpass":1,"substitute":1,"thunderbolt":1,"airslash":1,"roost":1},
		tier: "NU"
	},
	karrablast: {
		viableMoves: {"swordsdance":1,"megahorn":1,"return":1,"substitute":1},
		eventPokemon: [
			{"generation":5,"level":30,"isHidden":false,"moves":["furyattack","headbutt","falseswipe","bugbuzz"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"isHidden":false,"moves":["megahorn","takedown","xscissor","flail"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	escavalier: {
		viableMoves: {"megahorn":1,"pursuit":1,"ironhead":1,"knockoff":1,"return":1,"swordsdance":1},
		tier: "RU"
	},
	foongus: {
		viableMoves: {"spore":1,"stunspore":1,"gigadrain":1,"clearsmog":1,"hiddenpowerfire":1,"synthesis":1},
		tier: "LC"
	},
	amoonguss: {
		viableMoves: {"spore":1,"stunspore":1,"gigadrain":1,"clearsmog":1,"hiddenpowerfire":1,"synthesis":1},
		tier: "RU"
	},
	frillish: {
		viableMoves: {"scald":1,"willowisp":1,"recover":1,"toxic":1,"shadowball":1},
		tier: "LC"
	},
	jellicent: {
		viableMoves: {"scald":1,"willowisp":1,"recover":1,"toxic":1,"shadowball":1,"icebeam":1,"gigadrain":1},
		eventPokemon: [
			{"generation":5,"level":40,"isHidden":true,"moves":["waterpulse","ominouswind","brine","raindance"]}
		],
		tier: "OU"
	},
	alomomola: {
		viableMoves: {"wish":1,"protect":1,"waterfall":1,"toxic":1,"scald":1},
		tier: "NU"
	},
	joltik: {
		viableMoves: {"thunderbolt":1,"bugbuzz":1,"hiddenpowerice":1,"gigadrain":1,"voltswitch":1},
		tier: "LC"
	},
	galvantula: {
		viableMoves: {"thunder":1,"hiddenpowerice":1,"gigadrain":1,"bugbuzz":1,"voltswitch":1},
		tier: "RU"
	},
	ferroseed: {
		viableMoves: {"spikes":1,"stealthrock":1,"leechseed":1,"seedbomb":1,"protect":1,"thunderwave":1,"gyroball":1},
		tier: "RU"
	},
	ferrothorn: {
		viableMoves: {"spikes":1,"stealthrock":1,"leechseed":1,"powerwhip":1,"thunderwave":1,"protect":1},
		tier: "OU"
	},
	klink: {
		viableMoves: {"shiftgear":1,"return":1,"geargrind":1,"wildcharge":1},
		tier: "LC"
	},
	klang: {
		viableMoves: {"shiftgear":1,"return":1,"geargrind":1,"wildcharge":1},
		tier: "NFE"
	},
	klinklang: {
		viableMoves: {"shiftgear":1,"return":1,"geargrind":1,"wildcharge":1},
		tier: "RU"
	},
	tynamo: {
		viableMoves: {"spark":1,"chargebeam":1,"thunderwave":1,"tackle":1},
		tier: "LC"
	},
	eelektrik: {
		viableMoves: {"uturn":1,"voltswitch":1,"acidspray":1,"wildcharge":1,"thunderbolt":1,"gigadrain":1,"aquatail":1,"coil":1},
		tier: "NFE"
	},
	eelektross: {
		viableMoves: {"thunderbolt":1,"flamethrower":1,"uturn":1,"voltswitch":1,"acidspray":1,"wildcharge":1,"drainpunch":1,"discharge":1,"superpower":1,"thunderpunch":1,"gigadrain":1,"aquatail":1,"coil":1},
		tier: "NU"
	},
	elgyem: {
		viableMoves: {"nastyplot":1,"psychic":1,"thunderbolt":1,"hiddenpowerfighting":1,"substitute":1,"calmmind":1,"recover":1,"trick":1},
		tier: "LC"
	},
	beheeyem: {
		viableMoves: {"nastyplot":1,"psychic":1,"thunderbolt":1,"hiddenpowerfighting":1,"substitute":1,"calmmind":1,"recover":1,"trick":1},
		tier: "NU"
	},
	litwick: {
		viableMoves: {"calmmind":1,"shadowball":1,"energyball":1,"fireblast":1,"overheat":1,"hiddenpowerfighting":1,"hiddenpowerground":1,"hiddenpowerrock":1,"trick":1},
		tier: "LC"
	},
	lampent: {
		viableMoves: {"calmmind":1,"shadowball":1,"energyball":1,"fireblast":1,"overheat":1,"hiddenpowerfighting":1,"hiddenpowerground":1,"hiddenpowerrock":1,"trick":1},
		tier: "NU"
	},
	chandelure: {
		viableMoves: {"shadowball":1,"energyball":1,"fireblast":1,"overheat":1,"hiddenpowerfighting":1,"hiddenpowerground":1,"hiddenpowerrock":1,"trick":1,"substitute":1,"painsplit":1},
		eventPokemon: [
			{"generation":5,"level":50,"gender":"F","nature":"Modest","abilities":["flashfire"],"moves":["heatwave","shadowball","energyball","psychic"],"pokeball":"cherishball"}
		],
		tier: "UU"
	},
	axew: {
		viableMoves: {"dragondance":1,"outrage":1,"dragonclaw":1,"swordsdance":1,"aquatail":1,"superpower":1},
		eventPokemon: [
			{"generation":5,"level":1,"gender":"M","nature":"Naive","isHidden":false,"abilities":["moldbreaker"],"moves":["scratch","dragonrage"]},
			{"generation":5,"level":10,"gender":"F","isHidden":false,"abilities":["moldbreaker"],"moves":["dragonrage","return","endure","dragonclaw"],"pokeball":"cherishball"},
			{"generation":5,"level":30,"gender":"M","nature":"Naive","isHidden":false,"abilities":["rivalry"],"moves":["dragonrage","scratch","outrage","gigaimpact"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	fraxure: {
		viableMoves: {"dragondance":1,"swordsdance":1,"outrage":1,"dragonclaw":1,"aquatail":1,"superpower":1},
		tier: "NU"
	},
	haxorus: {
		viableMoves: {"dragondance":1,"swordsdance":1,"outrage":1,"dragonclaw":1,"earthquake":1,"aquatail":1,"superpower":1},
		eventPokemon: [
			{"generation":5,"level":59,"gender":"F","nature":"Naive","isHidden":false,"abilities":["moldbreaker"],"moves":["earthquake","dualchop","xscissor","dragondance"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	cubchoo: {
		viableMoves: {"icebeam":1,"surf":1,"hiddenpowergrass":1,"superpower":1},
		eventPokemon: [
			{"generation":5,"level":15,"isHidden":false,"moves":["powdersnow","growl","bide","icywind"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	beartic: {
		viableMoves: {"iciclecrash":1,"superpower":1,"nightslash":1,"stoneedge":1,"swordsdance":1,"aquajet":1},
		tier: "NU"
	},
	cryogonal: {
		viableMoves: {"icebeam":1,"recover":1,"toxic":1,"rapidspin":1,"reflect":1},
		tier: "RU"
	},
	shelmet: {
		viableMoves: {"spikes":1,"yawn":1,"substitute":1,"acidarmor":1,"batonpass":1,"recover":1,"toxic":1,"bugbuzz":1},
		eventPokemon: [
			{"generation":5,"level":30,"isHidden":false,"moves":["strugglebug","megadrain","yawn","protect"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"isHidden":false,"moves":["encore","gigadrain","bodyslam","bugbuzz"],"pokeball":"cherishball"}
		],
		tier: "LC"
	},
	accelgor: {
		viableMoves: {"spikes":1,"yawn":1,"bugbuzz":1,"focusblast":1,"gigadrain":1,"hiddenpowerrock":1,"encore":1},
		tier: "RU"
	},
	stunfisk: {
		viableMoves: {"discharge":1,"thunderbolt":1,"earthpower":1,"scald":1,"toxic":1,"rest":1,"sleeptalk":1,"stealthrock":1},
		tier: "NU"
	},
	mienfoo: {
		viableMoves: {"uturn":1,"drainpunch":1,"stoneedge":1,"swordsdance":1,"batonpass":1,"highjumpkick":1,"fakeout":1},
		tier: "LC"
	},
	mienshao: {
		viableMoves: {"uturn":1,"fakeout":1,"highjumpkick":1,"stoneedge":1,"drainpunch":1,"swordsdance":1,"batonpass":1},
		tier: "UU"
	},
	druddigon: {
		viableMoves: {"outrage":1,"superpower":1,"earthquake":1,"suckerpunch":1,"dragonclaw":1,"dragontail":1,"substitute":1,"glare":1,"stealthrock":1,"firepunch":1,"thunderpunch":1},
		eventPokemon: [
			{"generation":5,"level":1,"shiny":true,"isHidden":false,"moves":["leer","scratch"]}
		],
		tier: "RU"
	},
	golett: {
		viableMoves: {"earthquake":1,"shadowpunch":1,"dynamicpunch":1,"icepunch":1,"stealthrock":1},
		tier: "LC"
	},
	golurk: {
		viableMoves: {"earthquake":1,"shadowpunch":1,"dynamicpunch":1,"icepunch":1,"stoneedge":1,"stealthrock":1},
		eventPokemon: [
			{"generation":5,"level":70,"shiny":true,"isHidden":false,"abilities":["ironfist"],"moves":["shadowpunch","hyperbeam","gyroball","hammerarm"],"pokeball":"cherishball"}
		],
		tier: "NU"
	},
	pawniard: {
		viableMoves: {"swordsdance":1,"substitute":1,"suckerpunch":1,"ironhead":1,"brickbreak":1,"nightslash":1},
		tier: "LC"
	},
	bisharp: {
		viableMoves: {"swordsdance":1,"substitute":1,"suckerpunch":1,"ironhead":1,"brickbreak":1,"nightslash":1},
		tier: "UU"
	},
	bouffalant: {
		viableMoves: {"headcharge":1,"earthquake":1,"stoneedge":1,"megahorn":1,"swordsdance":1,"superpower":1},
		tier: "RU"
	},
	rufflet: {
		viableMoves: {"bravebird":1,"rockslide":1,"return":1,"uturn":1,"substitute":1,"bulkup":1,"roost":1},
		tier: "LC"
	},
	braviary: {
		viableMoves: {"bravebird":1,"superpower":1,"return":1,"uturn":1,"substitute":1,"rockslide":1,"bulkup":1,"roost":1},
		eventPokemon: [
			{"generation":5,"level":25,"gender":"M","isHidden":true,"moves":["wingattack","honeclaws","scaryface","aerialace"]}
		],
		tier: "NU"
	},
	vullaby: {
		viableMoves: {"knockoff":1,"roost":1,"taunt":1,"whirlwind":1,"toxic":1,"darkpulse":1,"uturn":1,"bravebird":1},
		tier: "LC"
	},
	mandibuzz: {
		viableMoves: {"knockoff":1,"roost":1,"taunt":1,"whirlwind":1,"toxic":1,"uturn":1,"bravebird":1,"darkpulse":1},
		eventPokemon: [
			{"generation":5,"level":25,"gender":"F","isHidden":true,"moves":["pluck","nastyplot","flatter","feintattack"]}
		],
		tier: "NU"
	},
	heatmor: {
		viableMoves: {"fireblast":1,"suckerpunch":1,"focusblast":1,"gigadrain":1},
		tier: "NU"
	},
	durant: {
		viableMoves: {"honeclaws":1,"ironhead":1,"xscissor":1,"stoneedge":1,"batonpass":1,"superpower":1},
		tier: "RU"
	},
	deino: {
		viableMoves: {"outrage":1,"crunch":1,"firefang":1,"dragontail":1,"thunderwave":1,"superpower":1},
		eventPokemon: [
			{"generation":5,"level":1,"shiny":true,"moves":["tackle","dragonrage"]}
		],
		tier: "LC"
	},
	zweilous: {
		viableMoves: {"outrage":1,"crunch":1,"firefang":1,"dragontail":1,"thunderwave":1,"superpower":1},
		tier: "NU"
	},
	hydreigon: {
		viableMoves: {"uturn":1,"dracometeor":1,"substitute":1,"dragonpulse":1,"focusblast":1,"fireblast":1,"surf":1,"darkpulse":1,"roost":1},
		eventPokemon: [
			{"generation":5,"level":70,"shiny":true,"gender":"M","moves":["hypervoice","dragonbreath","flamethrower","focusblast"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	larvesta: {
		viableMoves: {"flareblitz":1,"uturn":1,"wildcharge":1,"zenheadbutt":1,"morningsun":1,"willowisp":1},
		tier: "LC"
	},
	volcarona: {
		viableMoves: {"quiverdance":1,"fierydance":1,"fireblast":1,"bugbuzz":1,"roost":1,"gigadrain":1},
		eventPokemon: [
			{"generation":5,"level":35,"moves":["stringshot","leechlife","gust","firespin"]},
			{"generation":5,"level":77,"gender":"M","nature":"Calm","moves":["bugbuzz","overheat","hyperbeam","quiverdance"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	cobalion: {
		viableMoves: {"closecombat":1,"ironhead":1,"swordsdance":1,"substitute":1,"stoneedge":1,"voltswitch":1,"hiddenpowerice":1,"thunderwave":1,"stealthrock":1},
		tier: "UU"
	},
	terrakion: {
		viableMoves: {"stoneedge":1,"closecombat":1,"swordsdance":1,"rockpolish":1,"substitute":1,"stealthrock":1},
		tier: "OU"
	},
	virizion: {
		viableMoves: {"swordsdance":1,"calmmind":1,"closecombat":1,"focusblast":1,"hiddenpowerice":1,"stoneedge":1,"leafblade":1,"gigadrain":1,"substitute":1,"synthesis":1},
		tier: "UU"
	},
	tornadus: {
		viableMoves: {"hurricane":1,"airslash":1,"uturn":1,"bulkup":1,"acrobatics":1,"superpower":1,"focusblast":1,"taunt":1,"substitute":1,"heatwave":1},
		eventPokemon: [
			{"generation":5,"level":70,"gender":"M","isHidden":false,"moves":["hurricane","hammerarm","airslash","hiddenpower"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'dreamball',
		tier: "UU"
	},
	tornadustherian: {
		viableMoves: {"hurricane":1,"airslash":1,"focusblast":1,"uturn":1,"heatwave":1},
		eventPokemon: [
			{"generation":5,"level":70,"gender":"M","isHidden":false,"moves":["hurricane","hammerarm","airslash","hiddenpower"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	thundurus: {
		viableMoves: {"thunderwave":1,"nastyplot":1,"thunderbolt":1,"hiddenpowerice":1,"focusblast":1,"grassknot":1,"substitute":1},
		eventPokemon: [
			{"generation":5,"level":70,"gender":"M","isHidden":false,"moves":["thunder","hammerarm","focusblast","wildcharge"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'dreamball',
		tier: "Uber"
	},
	thundurustherian: {
		viableMoves: {"nastyplot":1,"agility":1,"thunderbolt":1,"hiddenpowerice":1,"focusblast":1,"grassknot":1},
		eventPokemon: [
			{"generation":5,"level":70,"gender":"M","isHidden":false,"moves":["thunder","hammerarm","focusblast","wildcharge"],"pokeball":"cherishball"}
		],
		tier: "OU"
	},
	reshiram: {
		viableMoves: {"blueflare":1,"dracometeor":1,"dragonpulse":1,"flamethrower":1,"flamecharge":1,"roost":1},
		eventPokemon: [
			{"generation":5,"level":100,"moves":["blueflare","fusionflare","mist","dracometeor"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	zekrom: {
		viableMoves: {"voltswitch":1,"outrage":1,"dragonclaw":1,"boltstrike":1,"honeclaws":1,"substitute":1,"dracometeor":1,"fusionbolt":1,"roost":1},
		eventPokemon: [
			{"generation":5,"level":100,"moves":["boltstrike","fusionbolt","haze","outrage"],"pokeball":"cherishball"}
		],
		tier: "Uber"
	},
	landorus: {
		viableMoves: {"earthpower":1,"focusblast":1,"rockpolish":1,"hiddenpowerice":1,"psychic":1},
		dreamWorldPokeball: 'dreamball',
		tier: "Uber"
	},
	landorustherian: {
		viableMoves: {"rockpolish":1,"earthquake":1,"stoneedge":1,"uturn":1,"superpower":1,"stealthrock":1},
		tier: "OU"
	},
	kyurem: {
		viableMoves: {"substitute":1,"icebeam":1,"dracometeor":1,"dragonpulse":1,"focusblast":1,"outrage":1,"earthpower":1,"roost":1},
		tier: "BL"
	},
	kyuremblack: {
		viableMoves: {"outrage":1,"fusionbolt":1,"icebeam":1,"roost":1},
		tier: "OU"
	},
	kyuremwhite: {
		viableMoves: {"dracometeor":1,"dragonpulse":1,"icebeam":1,"fusionflare":1,"earthpower":1,"focusblast":1,"roost":1},
		tier: "Uber"
	},
	keldeo: {
		viableMoves: {"hydropump":1,"secretsword":1,"calmmind":1,"hiddenpowerghost":1,"hiddenpowerelectric":1,"substitute":1,"surf":1},
		eventPokemon: [
			{"generation":5,"level":15,"moves":["aquajet","leer","doublekick","bubblebeam"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"moves":["sacredsword","hydropump","aquajet","swordsdance"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'cherishball',
		tier: "OU"
	},
	keldeoresolute: {
		eventPokemon: [
			{"generation":5,"level":15,"moves":["aquajet","leer","doublekick","bubblebeam"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"moves":["sacredsword","hydropump","aquajet","swordsdance"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'cherishball',
		tier: "OU"
	},
	meloetta: {
		viableMoves: {"relicsong":1,"closecombat":1,"calmmind":1,"psychic":1,"thunderbolt":1,"hypervoice":1,"uturn":1},
		eventPokemon: [
			{"generation":5,"level":15,"moves":["quickattack","confusion","round"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"moves":["round","teeterdance","psychic","closecombat"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'cherishball',
		tier: "UU"
	},
	genesect: {
		viableMoves: {"uturn":1,"bugbuzz":1,"icebeam":1,"flamethrower":1,"thunderbolt":1},
		eventPokemon: [
			{"generation":5,"level":50,"moves":["technoblast","magnetbomb","solarbeam","signalbeam"],"pokeball":"cherishball"},
			{"generation":5,"level":15,"moves":["technoblast","magnetbomb","solarbeam","signalbeam"],"pokeball":"cherishball"},
			{"generation":5,"level":100,"shiny":true,"nature":"Hasty","moves":["extremespeed","technoblast","blazekick","shiftgear"],"pokeball":"cherishball"}
		],
		dreamWorldPokeball: 'cherishball',
		tier: "Uber"
	},
	missingno: {
		isNonstandard: true,
		tier: ""
	},
	tomohawk: {
		viableMoves: {"aurasphere":1,"roost":1,"stealthrock":1,"rapidspin":1,"hurricane":1,"airslash":1,"taunt":1,"substitute":1,"toxic":1},
		isNonstandard: true,
		tier: "CAP"
	},
	necturna: {
		viableMoves: {"powerwhip":1,"hornleech":1,"sacredfire":1,"boltstrike":1,"vcreate":1,"extremespeed":1,"closecombat":1,"shellsmash":1,"spore":1,"recover":1,"batonpass":1},
		isNonstandard: true,
		tier: "CAP"
	},
	mollux: {
		viableMoves: {"fireblast":1,"thunderbolt":1,"sludgebomb":1,"thunderwave":1,"willowisp":1,"recover":1,"rapidspin":1,"trick":1,"stealthrock":1,"toxicspikes":1},
		isNonstandard: true,
		tier: "CAP"
	},
	aurumoth: {
		viableMoves: {"dragondance":1,"quiverdance":1,"closecombat":1,"tailglow":1,"wish":1,"bugbuzz":1,"hydropump":1,"megahorn":1,"psychic":1,"overheat":1,"blizzard":1,"thunder":1,"focusblast":1},
		isNonstandard: true,
		tier: "CAP"
	},
	malaconda: {
		viableMoves: {"powerwhip":1,"glare":1,"crunch":1,"toxic":1,"suckerpunch":1,"rest":1,"substitute":1,"uturn":1,"synthesis":1,"rapidspin":1},
		isNonstandard: true,
		tier: "CAP"
	},
	syclant: {
		viableMoves: {"bugbuzz":1,"icebeam":1,"blizzard":1,"earthpower":1,"spikes":1,"superpower":1,"tailglow":1,"uturn":1,"focusblast":1},
		isNonstandard: true,
		tier: "CAP"
	},
	revenankh: {
		viableMoves: {"bulkup":1,"shadowsneak":1,"drainpunch":1,"moonlight":1,"powerwhip":1,"icepunch":1},
		isNonstandard: true,
		tier: "CAP"
	},
	pyroak: {
		viableMoves: {"leechseed":1,"lavaplume":1,"substitute":1,"protect":1},
		isNonstandard: true,
		tier: "CAP"
	},
	fidgit: {
		viableMoves: {"spikes":1,"stealthrock":1,"toxicspikes":1,"wish":1,"rapidspin":1,"encore":1,"uturn":1,"sludgebomb":1},
		isNonstandard: true,
		tier: "CAP"
	},
	stratagem: {
		viableMoves: {"paleowave":1,"earthpower":1,"fireblast":1,"gigadrain":1,"calmmind":1},
		isNonstandard: true,
		tier: "CAP"
	},
	arghonaut: {
		viableMoves: {"recover":1,"bulkup":1,"waterfall":1,"crosschop":1,"stoneedge":1,"thunderpunch":1},
		isNonstandard: true,
		tier: "CAP"
	},
	kitsunoh: {
		viableMoves: {"shadowstrike":1,"superpower":1,"meteormash":1,"uturn":1,"icepunch":1,"thunderpunch":1,"trick":1,"willowisp":1},
		isNonstandard: true,
		tier: "CAP"
	},
	cyclohm: {
		viableMoves: {"slackoff":1,"dracometeor":1,"dragonpulse":1,"fireblast":1,"thunderbolt":1,"hydropump":1},
		isNonstandard: true,
		tier: "CAP"
	},
	colossoil: {
		viableMoves: {"earthquake":1,"crunch":1,"suckerpunch":1,"uturn":1,"rapidspin":1,"encore":1,"pursuit":1},
		isNonstandard: true,
		tier: "CAP"
	},
	krilowatt: {
		viableMoves: {"surf":1,"thunderbolt":1,"icebeam":1,"counter":1,"mirrorcoat":1,"earthquake":1},
		isNonstandard: true,
		tier: "CAP"
	},
	voodoom: {
		viableMoves: {"aurasphere":1,"darkpulse":1,"taunt":1,"painsplit":1},
		isNonstandard: true,
		tier: "CAP"
	}
};
