'use strict';

exports.BattleTypeChart = {
	"Fire": {
		damageTaken: {
			"Fire": 0,
			"Battle": 0,
			"Air": 0,
			"Earth": 0,
			"Ice": 1,
			"Mech": 0,
			"Filth": 0,
		},
	},
	"Battle": {
		damageTaken: {
			"Fire": 0,
			"Battle": 0,
			"Air": 0,
			"Earth": 0,
			"Ice": 0,
			"Mech": 1,
			"Filth": 0,
		},
	},
	"Air": {
		damageTaken: {
			"Fire": 0,
			"Battle": 0,
			"Air": 0,
			"Earth": 1,
			"Ice": 0,
			"Mech": 0,
			"Filth": 0,
		},
	},
	"Earth": {
		damageTaken: {
			"Fire": 1,
			"Battle": 0,
			"Air": 0,
			"Earth": 0,
			"Ice": 0,
			"Mech": 0,
			"Filth": 0,
		},
	},
	"Mech": {
		damageTaken: {
			"Fire": 0,
			"Battle": 0,
			"Air": 0,
			"Earth": 0,
			"Ice": 0,
			"Mech": 0,
			"Filth": 1,
		},
	},
	"Filth": {
		damageTaken: {
			"Fire": 0,
			"Battle": 1,
			"Air": 0,
			"Earth": 0,
			"Ice": 0,
			"Mech": 0,
			"Filth": 0,
		},
	},
	"Ice": {
		damageTaken: {
			"Fire": 0,
			"Battle": 0,
			"Air": 1,
			"Earth": 0,
			"Ice": 0,
			"Mech": 0,
			"Filth": 0,
		},
	},
};