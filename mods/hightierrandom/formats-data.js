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
	gengarmega: {
		randomBattleMoves: ["shadowball","sludgewave","focusblast","taunt","destinybond","disable","perishsong","protect"],
		randomDoubleBattleMoves: ["shadowball","sludgebomb","focusblast","substitute","disable","taunt","hypnosis","willowisp","dazzlinggleam","protect"],
		tier: "Uber"
	},
	salamencemega: {
		randomBattleMoves: ["doubleedge","return","fireblast","earthquake","dracometeor","roost","dragondance"],
		randomDoubleBattleMoves: ["doubleedge","return","fireblast","earthquake","dracometeor","protect","dragondance","dragonclaw"],
		tier: "Uber"
	},
	lucariomega: {
		randomBattleMoves: ["swordsdance","closecombat","crunch","icepunch","bulletpunch","nastyplot","aurasphere","darkpulse","flashcannon"],
		randomDoubleBattleMoves: ["followme","closecombat","crunch","extremespeed","icepunch","bulletpunch","aurasphere","darkpulse","vacuumwave","flashcannon","protect"],
		tier: "Uber"
	}
};
