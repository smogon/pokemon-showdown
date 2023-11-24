export const Rulesets: {[k: string]: ModdedFormatData} = {
	partialtrappingclause: {
		effectType: 'ValidatorRule',
		name: 'Partial Trapping Clause',
		desc: "Bans moves that partially trap the opponent (later gen additions)",
		banlist: ['Infestation', 'Magma Storm', 'Sand Tomb', 'Snap Trap', 'Thunder Cage', 'Whirlpool'],
		onBegin() {
			this.add('rule', 'Partial Trapping Clause: Partial Trapping moves are banned');
		},
	},
	protectclause: {
		effectType: 'ValidatorRule',
		name: 'Protect Clause',
		desc: "Bans Protect and Detect.",
		banlist: ['Protect', 'Detect'],
		onBegin() {
			this.add('rule', 'Protect Clause: Widely-distributed protecting moves are banned');
		},
	},
	fieldeffectclause: {
		effectType: 'ValidatorRule',
		name: 'Field Effect Clause',
		desc: "Bans moves that set a field effect",
		banlist: ['Spikes', 'Toxic Spikes', 'Stealth Rock', 'Sticky Web', 'Stone Axe', 'Ceaseless Edge', 'Wonder Room', 'Trick Room', 'Magic Room', 'Lucky Chant', 'Tailwind', 'Safeguard', 'Gravity'],
		onBegin() {
			this.add('rule', 'Field Effect Clause: Field Effects are banned');
		},
	},
};
