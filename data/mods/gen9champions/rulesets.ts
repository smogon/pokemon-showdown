export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	flatrules: {
		inherit: true,
		ruleset: ['Champions Rules', 'Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'Item Clause = 1', 'Picked Team Size = Auto', 'Cancel Mod'],
		banlist: [],
	},
	championsrules: {
		// move to here all rules that can't be disabled in private battles (Item Clause?, Team Preview?)
		effectType: 'Rule',
		name: 'Champions Rules',
		desc: "Tells Champions formats to set the level to 50 and all IVs to 31",
		ruleset: ['Adjust Level = 50', 'EV limit = 512'],
		onChangeSet(set) {
			set.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
		},
		onBegin() {
			this.reportPercentages = true;
		},
	},
};
