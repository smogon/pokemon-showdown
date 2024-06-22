export const Rulesets: {[k: string]: ModdedFormatData} = {
	sleepclausemod: {
		inherit: true,
		onSetStatus(status, target, source) {
			if (source && source.isAlly(target)) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						if (!pokemon.statusState.source || !pokemon.statusState.source.isAlly(pokemon)) {
							if (source.hasAbility('ididitagain') && !source.m.bypassedSleepClause) {
								this.add('-ability', source, 'I Did It Again');
								source.m.bypassedSleepClause = true;
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
