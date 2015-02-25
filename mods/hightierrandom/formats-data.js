exports.BattleFormatsData = {
	charizard: {
		randomBattleMoves: ["fireblast","focusblast","airslash","roost","dragondance","flareblitz","dragonclaw","earthquake"],
		randomDoubleBattleMoves: ["heatwave","fireblast","airslash","dragondance","flareblitz","dragonclaw","earthquake","protect"],
		eventPokemon: [
			{"generation":3,"level":70,"moves":["wingattack","slash","dragonrage","firespin"]},
			{"generation":6,"level":36,"gender":"M","isHidden":false,"moves":["firefang","flameburst","airslash","inferno"],"pokeball":"cherishball"},
			{"generation":6,"level":36,"gender":"M","isHidden":false,"moves":["firefang","airslash","dragonclaw","dragonrage"],"pokeball":"cherishball"},
			{"generation":6,"level":36,"shiny":true,"gender":"M","isHidden":false,"moves":["overheat","solarbeam","focusblast","holdhands"],"pokeball":"cherishball"}
		],
		requiredItem: "Charizardite X", "Charizardite Y",
		tier: "OU"
	},
	beedrill: {
		randomBattleMoves: ["toxicspikes","tailwind","uturn","endeavor","poisonjab","knockoff"],
		randomDoubleBattleMoves: ["xscissor","uturn","poisonjab","drillrun","brickbreak","knockoff","protect","stringshot"],
		eventPokemon: [
			{"generation":3,"level":30,"moves":["batonpass","sludgebomb","twineedle","swordsdance"]}
		],
		requiredItem: "Beedrillite",
		tier: "UU"
	},
	pidgeot: {
		randomBattleMoves: ["roost","bravebird","heatwave","return","uturn","hurricane"],
		randomDoubleBattleMoves: ["bravebird","heatwave","return","uturn","tailwind","protect"],
		eventPokemon: [
			{"generation":5,"level":61,"gender":"M","nature":"Naughty","isHidden":false,"abilities":["keeneye"],"moves":["whirlwind","wingattack","skyattack","mirrormove"],"pokeball":"cherishball"}
		],
		requiredItem: "Pidgeotite",
		tier: "UU"
	},
	gengarmega: {
		randomBattleMoves: ["shadowball","sludgewave","focusblast","taunt","destinybond","disable","perishsong","protect"],
		randomDoubleBattleMoves: ["shadowball","sludgebomb","focusblast","substitute","disable","taunt","hypnosis","willowisp","dazzlinggleam","protect"],
		tier: "Uber"
	},
	pinsir: {
		randomBattleMoves: ["earthquake","xscissor","closecombat","stoneedge","stealthrock","knockoff"],
		randomDoubleBattleMoves: ["protect","swordsdance","xscissor","earthquake","closecombat","substitute","rockslide"],
		eventPokemon: [
			{"generation":3,"level":35,"abilities":["hypercutter"],"moves":["helpinghand","guillotine","falseswipe","submission"]},
			{"generation":6,"level":50,"gender":"F","nature":"Adamant","isHidden":false,"moves":["xscissor","earthquake","stoneedge","return"],"pokeball":"cherishball"},
			{"generation":6,"level":50,"nature":"Jolly","isHidden":true,"moves":["earthquake","swordsdance","feint","quickattack"],"pokeball":"cherishball"}
		],
		requiredItem: "Pinsirite",
		tier: "UU"
	},
	aerodactyl: {
		randomBattleMoves: ["stealthrock","taunt","stoneedge","earthquake","aquatail","roost","doubleedge"],
		randomDoubleBattleMoves: ["wideguard","taunt","stoneedge","rockslide","earthquake","aquatail","protect","icefang","skydrop","tailwind"],
		eventPokemon: [
			{"generation":5,"level":15,"gender":"M","isHidden":false,"abilities":["pressure"],"moves":["steelwing","icefang","firefang","thunderfang"],"pokeball":"cherishball"}
		],
		requiredItem: "Aerodactylite",
		tier: "UU"
	},
	ampharos: {
		randomBattleMoves: ["voltswitch","reflect","lightscreen","focusblast","thunderbolt","toxic","healbell","hiddenpowerice"],
		randomDoubleBattleMoves: ["focusblast","hiddenpowerice","hiddenpowergrass","thunderbolt","discharge","dragonpulse","protect"],
		requiredItem: "Ampharosite",
		tier: "UU"
	},
	houndoom: {
		randomBattleMoves: ["nastyplot","darkpulse","suckerpunch","fireblast","hiddenpowergrass"],
		randomDoubleBattleMoves: ["nastyplot","darkpulse","suckerpunch","heatwave","hiddenpowerfighting","protect"],
		eventPokemon: [
			{"generation":6,"level":50,"nature":"Timid","isHidden":false,"abilities":["flashfire"],"moves":["flamethrower","darkpulse","solarbeam","sludgebomb"],"pokeball":"cherishball"}
		],
		requiredItem: "Houndoominite",
		tier: "RU"
	},
	sceptile: {
		randomBattleMoves: ["substitute","gigadrain","leafstorm","hiddenpowerice","focusblast","hiddenpowerfire"],
		randomDoubleBattleMoves: ["substitute","gigadrain","leafstorm","hiddenpowerice","focusblast","hiddenpowerfire","protect"],
		eventPokemon: [
			{"generation":5,"level":50,"isHidden":false,"moves":["leafstorm","dragonpulse","focusblast","rockslide"],"pokeball":"cherishball"}
		],
		requiredItem: "Sceptilite",
		tier: "UU"
	},
	gallade: {
		randomBattleMoves: ["bulkup","drainpunch","icepunch","shadowsneak","closecombat","zenheadbutt","knockoff","trick"],
		randomDoubleBattleMoves: ["closecombat","trick","stoneedge","shadowsneak","drainpunch","icepunch","zenheadbutt","knockoff","trickroom","protect","helpinghand","healpulse"],
		requiredItem: "Galladite",
		tier: "OU"
	},
	aggron: {
		randomBattleMoves: ["autotomize","headsmash","earthquake","lowkick","heavyslam","aquatail","stealthrock"],
		randomDoubleBattleMoves: ["rockslide","headsmash","earthquake","lowkick","heavyslam","aquatail","stealthrock","protect"],
		eventPokemon: [
			{"generation":3,"level":100,"moves":["irontail","protect","metalsound","doubleedge"]},
			{"generation":3,"level":50,"moves":["takedown","irontail","protect","metalsound"]},
			{"generation":6,"level":50,"nature":"Brave","isHidden":false,"abilities":["rockhead"],"moves":["ironhead","earthquake","headsmash","rockslide"],"pokeball":"cherishball"}
		],
		requiredItem: "Aggronite",
		tier: "UU"
	},
	medicham: {
		randomBattleMoves: ["highjumpkick","drainpunch","zenheadbutt","icepunch","bulletpunch"],
		randomDoubleBattleMoves: ["highjumpkick","drainpunch","zenheadbutt","icepunch","bulletpunch","protect","fakeout"],
		requiredItem: "Medichamite",
		tier: "RU"
	},
	manectric: {
		randomBattleMoves: ["voltswitch","thunderbolt","hiddenpowerice","hiddenpowergrass","overheat","flamethrower"],
		randomDoubleBattleMoves: ["voltswitch","thunderbolt","hiddenpowerice","hiddenpowergrass","overheat","flamethrower","snarl","protect"],
		eventPokemon: [
			{"generation":3,"level":44,"moves":["refresh","thunder","raindance","bite"]},
			{"generation":6,"level":50,"nature":"Timid","isHidden":false,"abilities":["lightningrod"],"moves":["overheat","thunderbolt","voltswitch","protect"],"pokeball":"cherishball"}
		],
		requiredItem: "Manectite",
		tier: "OU"
	},
	absol: {
		randomBattleMoves: ["swordsdance","suckerpunch","knockoff","superpower","pursuit","playrough"],
		randomDoubleBattleMoves: ["swordsdance","suckerpunch","knockoff","fireblast","superpower","protect","playrough"],
		eventPokemon: [
			{"generation":3,"level":5,"abilities":["pressure"],"moves":["scratch","leer","wish"]},
			{"generation":3,"level":5,"abilities":["pressure"],"moves":["scratch","leer","spite"]},
			{"generation":3,"level":35,"abilities":["pressure"],"moves":["razorwind","bite","swordsdance","spite"]},
			{"generation":3,"level":70,"abilities":["pressure"],"moves":["doubleteam","slash","futuresight","perishsong"]}
		],
		requiredItem: "Absolite",
		tier: "UU"
	},
	salamencemega: {
		randomBattleMoves: ["doubleedge","return","fireblast","earthquake","dracometeor","roost","dragondance"],
		randomDoubleBattleMoves: ["doubleedge","return","fireblast","earthquake","dracometeor","protect","dragondance","dragonclaw"],
		tier: "Uber"
	},
	lopunny: {
		randomBattleMoves: ["return","switcheroo","highjumpkick","icepunch","healingwish"],
		randomDoubleBattleMoves: ["return","switcheroo","highjumpkick","firepunch","icepunch","fakeout","protect","encore"],
		requiredItem: "Lopunnite",
		tier: "OU"
	},
	lucariomega: {
		randomBattleMoves: ["swordsdance","closecombat","crunch","icepunch","bulletpunch","nastyplot","aurasphere","darkpulse","flashcannon"],
		randomDoubleBattleMoves: ["followme","closecombat","crunch","extremespeed","icepunch","bulletpunch","aurasphere","darkpulse","vacuumwave","flashcannon","protect"],
		tier: "Uber"
	}
};
