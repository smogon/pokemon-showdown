exports.BattleMovedex = {
	blizzard: {
		inherit: true,
		basePower: 120
	},
	charm: {
		inherit: true,
		type: "Normal"
	},
	cottonspore: {
		inherit: true,
		onTryHit: null
	},
	hiddenpower: {
		inherit: true,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return pokemon.hpPower || 70;
		}
	},
	hiddenpowerbug: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerdark: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerdragon: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerelectric: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerfairy: null,
	hiddenpowerfighting: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerfire: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerflying: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerghost: {
		inherit: true,
		basePower: 70
	},
	hiddenpowergrass: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerground: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerice: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerpoison: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerpsychic: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerrock: {
		inherit: true,
		basePower: 70
	},
	hiddenpowersteel: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerwater: {
		inherit: true,
		basePower: 70
	},
	hurricane: {
		inherit: true,
		basePower: 120
	},
	hydropump: {
		inherit: true,
		basePower: 120
	},
	icebeam: {
		inherit: true,
		basePower: 95
	},
	moonlight: {
		inherit: true,
		type: "Normal"
	},
	fireblast: {
		inherit: true,
		basePower: 120
	},
	flamethrower: {
		inherit: true,
		basePower: 95
	},
	spore: {
		inherit: true,
		onTryHit: null
	},
	stunspore: {
		inherit: true,
		onTryHit: null
	},
	surf: {
		inherit: true,
		basePower: 95
	},
	sweetkiss: {
		inherit: true,
		type: "Normal"
	},
	thunder: {
		inherit: true,
		basePower: 120
	},
	thunderbolt: {
		inherit: true,
		basePower: 95
	},
	willowisp: {
		inherit: true,
		accuracy: 75
	}
};
