export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		desc: "The standard ruleset for all offical Smogon singles tiers (Ubers, OU, etc.)",
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Switch Priority Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Items Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	batonpassmod: {
		effectType: 'Rule',
		name: 'Baton Pass Mod',
		desc: "Positive stat boosts are reset upon using Baton Pass.",
		onBegin() {
			this.add('rule', 'Baton Pass Mod: Positive stat boosts are reset upon using Baton Pass');
		},
		onHit(source, target, move) {
			if (source.positiveBoosts() && move.id === 'batonpass') {
				this.add('-clearpositiveboost', source);
				this.hint("Baton Pass Mod activated: Stat Boosts cannot be passed");
			}
		},
	},
};
