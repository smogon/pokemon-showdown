export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standardag: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Exact HP Mod', 'Cancel Mod', 'Beat Up Nicknames Mod',
		],
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: [
			'Standard AG',
			'Stadium Sleep Clause', 'Freeze Clause Mod', 'Self-KO Clause', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Stadium Items Clause',
		],
	},
	selfkoclause: {
		effectType: 'Rule',
		name: 'Self-KO Clause',
		desc: "If a player's last Pokemon uses Self-Destruct or Explosion, they automatically lose the battle.",
		onBegin() {
			this.add('rule', 'Self-KO Clause: If a player\'s last Pokemon uses Self-Destruct/Explosion, they automatically lose');
		},
	},
};
