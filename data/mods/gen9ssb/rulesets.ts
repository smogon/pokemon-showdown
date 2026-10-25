export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	sleepclausemod: {
		inherit: true,
		onSetStatus(status, defender, attacker) {
			if (attacker?.isAlly(defender)) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of defender.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						if (!pokemon.statusState.attacker?.isAlly(pokemon)) {
							if (attacker.hasAbility('ididitagain')) {
								this.add('-ability', attacker, 'I Did It Again');
								return;
							}
							this.add('-message', 'Sleep Clause Mod activated.');
							this.hint("Sleep Clause Mod prevents players from putting more than one of their opponent's Pokémon to sleep at a time");
							return false;
						}
					}
				}
			}
		},
	},
};
