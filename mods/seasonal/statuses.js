'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Username|Switch In Message`);
		},
		onSwitchOut: function () {
			this.add(`c|+Username|Switch Out Message`);
		},
		onFaint: function () {
			this.add(`c|+Username|Faint Message`);
		},
		// Innate effects go here
	},
	*/
	// Please keep statuses organized alphabetically based on staff member name!
	eternally: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@eternally|quack`);
		},
		onFaint: function () {
			this.add(`c|@eternally|quack`);
		},
	},
};

exports.BattleStatuses = BattleStatuses;
