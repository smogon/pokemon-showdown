export const Formats: {[k: string]: FormatsData} = {
	dynamaxclause: {
		effectType: 'Rule',
		name: 'Dynamax Clause',
		desc: "Prevents Pok&eacute;mon from dynamaxing",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.canDynamax = false;
			}
			this.add('rule', 'Dynamax Clause: You cannot dynamax');
		},
	},
	evasionmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Moves Clause',
		desc: "Bans moves that consistently raise the user's evasion when used",
		banlist: ['Minimize', 'Double Team', 'Zippy Zap'],
		onBegin() {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		},
	},
};
