'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standard: {
		inherit: true,
		ruleset: ['Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		minSourceGen: 0, // auto
	},
	standarddoubles: {
		inherit: true,
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Abilities Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		minSourceGen: 0, // auto
	},
	gravsleepclause: {
		effectType: 'ValidatorRule',
		name: 'GravSleep Clause',
		desc: "Bans the combination of Gravity with sleep-inducing moves with imperfect accuracy",
		onBegin() {
			this.add('rule', 'GravSleep Clause: Sleep-inducing moves with imperfect accuracy are banned with Gravity');
		},
		onValidateTeam(team) {
			let hasGravity = 0;
			let hasSleep = 0;
			let moves = [];
			for (const set of team) {
				if (set.moves) {
					for (const id of set.moves) {
						let move = this.dex.getMove(id);
						if (move.status && move.status === 'slp' && move.accuracy < 100) {
							hasSleep++;
							moves.push(move.name);
						}
						if (move.id === 'gravity') {
							hasGravity++;
						}
					}
				}
			}
			if (hasGravity > 0 && hasSleep > 0) {
				return [`Your team has the combination of Gravity and ${moves.join(' and ')}, which is banned by GravSleep Clause.`];
			}
		},
	},
	obtainablemoves: {
		inherit: true,
		banlist: [
			// Leaf Blade: Gen 6+ Nuzleaf level-up
			// Sucker Punch: Gen 4 Shiftry tutor
			'Shiftry + Leaf Blade + Sucker Punch',
		],
	},
};

exports.BattleFormats = BattleFormats;
