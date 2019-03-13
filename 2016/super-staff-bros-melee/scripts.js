"use strict";

exports.BattleScripts = {
	inherit: 'gen6',
	gen: 6,

	say(phrase) {
		if (!this.activePokemon) return;
		return this.activePokemon.say(phrase);
	},

	pokemon: {
		say(phrase) {
			this.battle.add('chat', this.name, phrase);
		},
	},
};
