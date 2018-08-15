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
	hoeenhero: {
		noCopy: true,
		onStart: function () {
			this.add(`c|&HoeenHero|I'll script my way to victory!`);
		},
		onSwitchOut: function () {
			this.add(`c|&HoeenHero|I need to look something up, hold on...`);
		},
		onFaint: function () {
			this.add(`c|&HoeenHero|NO! There must of been a bug in my script ;-;`);
		},
	},
	macchaeger: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@MacChaeger|What are you gonna do with that big bat? Gonna hit me? Better make it count. Better make it hurt. Better kill me in one shot.`);
		},
		onFaint: function () {
			this.add(`c|@MacChaeger|im gonna pyuk`);
		},
	},
};

exports.BattleStatuses = BattleStatuses;
