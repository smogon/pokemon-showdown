export const Rulesets: {[k: string]: ModdedFormatData} = {
	standard: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Items Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	standarddoubles: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Gravity Sleep Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	standardoms: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Dynamax Clause', 'HP Percentage Mod', 'Cancel Mod', 'Overflow Stat Mod',
		],
	},
	zmoveclause: {
		effectType: 'ValidatorRule',
		name: 'Z-Move Clause',
		desc: "Bans Pok&eacute;mon from holding Z-Crystals",
		onValidateSet(set) {
			const item = this.dex.items.get(set.item);
			if (item.zMove) return [`${set.name || set.species}'s item ${item.name} is banned by Z-Move Clause.`];
		},
		onBegin() {
			this.add('rule', 'Z-Move Clause: Z-Moves are banned');
		},
	},
	megastoneclause: {
		effectType: 'ValidatorRule',
		name: 'Mega Stone Clause',
		desc: "Bans Pok&eacute;mon from holding Mega Stones",
		onValidateSet(set) {
			const item = this.dex.items.get(set.item);
			if (item.megaStone) return [`${set.name || set.species}'s item ${item.name} is banned by Mega Stone Clause.`];
		},
		onBegin() {
			this.add('rule', 'Mega Stone Clause: Mega Stones are banned');
		},
	}
};
