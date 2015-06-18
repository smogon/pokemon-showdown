exports.BattleTypeChart = {
	"Bug": {
		inherit: true,
		HPivs: {"atk":26, "def":26, "spa":30, "spd":30, "spe":30, "hp":30}
	},
	"Dark": {
		inherit: true,
		HPivs: {"atk":30, "def":30, "spa":30, "spd":30, "spe":30, "hp":30}
	},
	"Dragon": {
		inherit: true,
		HPivs: {"atk":30, "def":28, "spa":30, "spd":30, "spe":30, "hp":22}
	},
	"Electric": {
		inherit: true,
		HPivs: {"atk":28, "def":30, "spa":30, "spd":30, "spe":30, "hp":14}
	},
	"Fighting": {
		inherit: true,
		HPivs: {"atk":24, "def":24, "spa":30, "spd":30, "spe":30, "hp":6}
	},
	"Fire": {
		damageTaken: {
			"Bug": 2,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fighting": 0,
			"Fire": 2,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 1,
			"Ice": 2,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Steel": 2,
			"Water": 1
		},
		HPivs: {"atk":28, "def":24, "spa":30, "spd":30, "spe":30, "hp":6}
	},
	"Flying": {
		inherit: true,
		HPivs: {"atk":24, "def":26, "spa":30, "spd":30, "spe":30, "hp":14}
	},
	"Ghost": {
		inherit: true,
		HPivs: {"atk":26, "def":28, "spa":30, "spd":30, "spe":30, "hp":22}
	},
	"Grass": {
		inherit: true,
		HPivs: {"atk":28, "def":28, "spa":30, "spd":30, "spe":30, "hp":6}
	},
	"Ground": {
		inherit: true,
		HPivs: {"atk":24, "def":30, "spa":30, "spd":30, "spe":30, "hp":14}
	},
	"Ice": {
		damageTaken: {
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fighting": 1,
			"Fire": 1,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 0,
			"Ground": 0,
			"Ice": 2,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Steel": 1,
			"Water": 0
		},
		HPivs: {"atk":30, "def":26, "spa":30, "spd":30, "spe":30, "hp":30}
	},
	"Poison": {
		inherit: true,
		HPivs: {"atk":24, "def":28, "spa":30, "spd":30, "spe":30, "hp":6}
	},
	"Psychic": {
		inherit: true,
		HPivs: {"atk":30, "def":24, "spa":30, "spd":30, "spe":30, "hp":22}
	},
	"Rock": {
		inherit: true,
		HPivs: {"atk":26, "def":24, "spa":30, "spd":30, "spe":30, "hp":22}
	},
	"Steel": {
		damageTaken: {
			sandstorm: 3,
			"Bug": 2,
			"Dark": 2,
			"Dragon": 2,
			"Electric": 0,
			"Fairy": 2,
			"Fighting": 1,
			"Fire": 1,
			"Flying": 2,
			"Ghost": 2,
			"Grass": 2,
			"Ground": 1,
			"Ice": 2,
			"Normal": 2,
			"Poison": 3,
			"Psychic": 2,
			"Rock": 2,
			"Steel": 2,
			"Water": 0
		},
		HPivs: {"atk":26, "def":30, "spa":30, "spd":30, "spe":30, "hp":30}
	},
	"Water": {
		inherit: true,
		HPivs: {"atk":28, "def":26, "spa":30, "spd":30, "spe":30, "hp":14}
	}
};
