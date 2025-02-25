export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	sleepclausemod: {
		inherit: true,
		onSetStatus(status, target, source) {
			if (source?.isAlly(target)) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						if (!pokemon.statusState.source?.isAlly(pokemon)) {
							if (source.hasAbility('ididitagain')) {
								this.add('-ability', source, 'I Did It Again');
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
