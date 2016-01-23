// Data for the mafia chat plugin.

'use strict';

// This object contains all functions that execute in the callback function of any mafia class. Executed from the context of the executing player.
// Target is a MafiaPlayer object.
let MafiaFunctions = {
	copReport: function (target) {
		if (target.class.side === 'town') {
			return 'After investigating ' + target.name + ' you find out they\'re sided with the village.';
		} else if (target.class.side === 'mafia') {
			return 'After investigating ' + target.name + ' you find out they\'re sided with the mafia.';
		} else {
			return 'After investigating ' + target.name + ' you find out they\'re not sided with the village or mafia.';
		}
	},
	naiveReport: function (target) {
		return 'After investigating ' + target.name + ' you find out they\'re sided with the village.';
	},
	paranoidReport: function (target) {
		return 'After investigating ' + target.name + ' you find out they\'re sided with the mafia.';
	},
	insaneReport: function (target) {
		if (target.class.side === 'mafia') {
			return 'After investigating ' + target.name + ' you find out they\'re sided with the village.';
		} else if (target.class.side === 'town') {
			return 'After investigating ' + target.name + ' you find out they\'re sided with the mafia.';
		} else {
			return 'After investigating ' + target.name + ' you find out they\'re not sided with the village or mafia.';
		}
	},
	roleBlock: function (target) {
		target.roleBlocked = true;
		return 'You visit ' + target.name + ' during the night.';
	},
	protect: function (target) {
		target.invincible = true;
		return 'You give ' + target.name + ' their daily dose of medicine to keep them safe and sound.';
	},
	killTarget: function (target) {
		target.kill('The werewolf has eaten a tasty snack!');
	},
};

// Every role has a side they belong to, as well as all functions they have. These functions are objects with the targeting mechanics and a callback.
// events are atStart, onNight, onDay, onLynch.
exports.MafiaClasses = {
	villager: {
		name: "Villager",
		side: 'town',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-villager.png" />',
		flavorText: 'You are a villager. You live peacefully in the town, which with the mafia activity hasn\'t been all too peaceful, actually.',
	},

	mafia: {
		name: "Mafia",
		side: 'mafia',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-mafia.png" />',
		flavorText: 'You are a member of the mafia. Every night, you get together with the other mafia members to eliminate someone in the town. The townsfolk aren\'t all that happy with that, however.',
	},

	hooker: {
		name: "Hooker",
		side: 'town',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-hooker.png" />',
		flavorText: 'You are the hooker. Every night, you can visit someone in the town. The person you visit can\'t execute any actions that night.',

		onNight: {
			target: {side: 'any', count: 'single'},
			priority: 5,
			callback: MafiaFunctions.roleBlock,
		},
	},

	doctor: {
		name: "Doctor",
		side: 'town',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-doctor.png" />',
		flavorText: 'You are the doctor. Every night, you can visit someone in the town. This person can\'t die that night.',

		onNight: {
			target: {side: 'any', count: 'single'},
			priority: 4,
			callback: MafiaFunctions.protect,
		},
	},

	cop: {
		name: "Cop",
		side: 'town',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-cop.png" />',
		flavorText: 'You are the cop. Every night, you can visit someone in town. When the night is over, you\'ll receive a report with that person\'s alignment.',

		onNight: {
			target: {side: 'any', count: 'single'},
			priority: -1,
			callback: MafiaFunctions.copReport,
		},
	},

	paranoidcop: {
		name: "Cop",
		side: 'town',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-cop.png" />',
		flavorText: 'You are the cop. Every night, you can visit someone in town. When the night is over, you\'ll receive a report with that person\'s alignment.',

		onNight: {
			target: {side: 'any', count: 'single'},
			priority: -1,
			callback: MafiaFunctions.paranoidReport,
		},
	},

	insanecop: {
		name: "Cop",
		side: 'town',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-cop.png" />',
		flavorText: 'You are the cop. Every night, you can visit someone in town. When the night is over, you\'ll receive a report with that person\'s alignment.',

		onNight: {
			target: {side: 'any', count: 'single'},
			priority: -1,
			callback: MafiaFunctions.insaneReport,
		},
	},

	naivecop: {
		name: "Cop",
		side: 'town',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-cop.png" />',
		flavorText: 'You are the cop. Every night, you can visit someone in town. When the night is over, you\'ll receive a report with that person\'s alignment.',

		onNight: {
			target: {side: 'any', count: 'single'},
			priority: -1,
			callback: MafiaFunctions.naiveReport,
		},
	},

	werewolf: {
		name: "Werewolf",
		side: 'solo',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-werewolf.png" />',
		flavorText: 'You are the werewolf. You\'re not aligned with either town or mafia, and instead kill someone every night. You win if you\'re the only remaining player.',
		victoryText: 'The wolf howls victorious, knowing he came out of this mess alive, and with some lunch as well.',

		onNight: {
			target: {side: 'any', count: 'single'},
			priority: 2,
			callback: MafiaFunctions.killTarget,
		},
	},
};
