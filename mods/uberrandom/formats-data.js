exports.BattleFormatsData = {
	gengar: {
		randomBattleMoves: ["shadowball","sludgebomb","focusblast","thunderbolt","substitute","disable","painsplit"],
		randomDoubleBattleMoves: ["shadowball","sludgebomb","focusblast","thunderbolt","substitute","disable","taunt","hypnosis","gigadrain","trick","dazzlinggleam","protect"],
		eventPokemon: [
			{"generation":6,"level":25,"nature":"Timid","moves":["psychic","confuseray","suckerpunch","shadowpunch"],"pokeball":"cherishball"},
			{"generation":6,"level":25,"moves":["nightshade","confuseray","suckerpunch","shadowpunch"],"pokeball":"cherishball"},
			{"generation":6,"level":50,"moves":["shadowball","sludgebomb","willowisp","destinybond"],"pokeball":"cherishball"},
			{"generation":6,"level":25,"shiny":true,"moves":["shadowball","sludgewave","confuseray","astonish"],"pokeball":"duskball"}
		],
		requiredItem: "Gengarite",
		tier: "OU"
	},
	kangaskhan: {
		randomBattleMoves: ["return","suckerpunch","earthquake","poweruppunch","crunch","fakeout"],
		randomDoubleBattleMoves: ["fakeout","return","suckerpunch","earthquake","doubleedge","poweruppunch","crunch","protect"],
		eventPokemon: [
			{"generation":3,"level":5,"gender":"F","abilities":["earlybird"],"moves":["yawn","wish"]},
			{"generation":3,"level":10,"gender":"F","abilities":["earlybird"],"moves":["cometpunch","leer","bite"]},
			{"generation":3,"level":36,"gender":"F","abilities":["earlybird"],"moves":["sing","earthquake","tailwhip","dizzypunch"]},
			{"generation":6,"level":50,"gender":"F","isHidden":false,"abilities":["scrappy"],"moves":["fakeout","return","earthquake","suckerpunch"],"pokeball":"cherishball"}
		],
		requiredItem: "Kangaskhanite",
		tier: "NU"
	},
	mawile: {
		randomBattleMoves: ["swordsdance","ironhead","substitute","playrough","suckerpunch","batonpass"],
		randomDoubleBattleMoves: ["swordsdance","ironhead","firefang","substitute","playrough","suckerpunch","knockoff","protect"],
		eventPokemon: [
			{"generation":3,"level":10,"gender":"M","moves":["astonish","faketears"]},
			{"generation":3,"level":22,"moves":["sing","falseswipe","vicegrip","irondefense"]},
			{"generation":6,"level":50,"isHidden":false,"abilities":["intimidate"],"moves":["ironhead","playrough","firefang","suckerpunch"],"pokeball":"cherishball"}
		],
		requiredItem: "Mawilite",
		tier: "UU"
	},
	salamence: {
		randomBattleMoves: ["outrage","fireblast","earthquake","dracometeor","roost","dragondance","dragonclaw","hydropump","stoneedge"],
		randomDoubleBattleMoves: ["protect","fireblast","earthquake","dracometeor","tailwind","dragondance","dragonclaw","hydropump","rockslide"],
		eventPokemon: [
			{"generation":3,"level":50,"moves":["protect","dragonbreath","scaryface","fly"]},
			{"generation":3,"level":50,"moves":["refresh","dragonclaw","dragondance","aerialace"]},
			{"generation":4,"level":50,"gender":"M","nature":"Naughty","moves":["hydropump","stoneedge","fireblast","dragonclaw"],"pokeball":"cherishball"},
			{"generation":5,"level":50,"isHidden":false,"moves":["dragondance","dragonclaw","outrage","aerialace"],"pokeball":"cherishball"}
		],
		requiredItem: "Salamencite",
		tier: "OU"
	},
	rayquazamega: {
		randomBattleMoves: ["vcreate","extremespeed","swordsdance","earthquake","dragonascent","dragonclaw","dragondance"],
		randomDoubleBattleMoves: ["vcreate","extremespeed","swordsdance","earthquake","dragonascent","dragonclaw","dragondance","protect"]
	},
	lucario: {
		randomBattleMoves: ["swordsdance","closecombat","crunch","extremespeed","icepunch","bulletpunch","nastyplot","aurasphere","darkpulse","vacuumwave","flashcannon"],
		randomDoubleBattleMoves: ["followme","closecombat","crunch","extremespeed","icepunch","bulletpunch","feint","aurasphere","darkpulse","vacuumwave","flashcannon","protect"],
		eventPokemon: [
			{"generation":4,"level":50,"gender":"M","nature":"Modest","abilities":["steadfast"],"moves":["aurasphere","darkpulse","dragonpulse","waterpulse"],"pokeball":"cherishball"},
			{"generation":4,"level":30,"gender":"M","nature":"Adamant","abilities":["innerfocus"],"moves":["forcepalm","bonerush","sunnyday","blazekick"],"pokeball":"cherishball"},
			{"generation":5,"level":10,"gender":"M","isHidden":true,"moves":["detect","metalclaw","counter","bulletpunch"]},
			{"generation":5,"level":50,"gender":"M","nature":"Naughty","isHidden":true,"moves":["bulletpunch","closecombat","stoneedge","shadowclaw"],"pokeball":"cherishball"}
		],
		requiredItem: "Lucarionite",
		tier: "UU"
	}
};
