export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	randtand: {
		name: "RandTand",
		effectType: 'ValidatorRule',
		onValidateTeam(team, format, teamHas) {
			if (team.length > 3) return [`You must bring at most 3 Pokemon.`];
			let randomCount = 0;
			for (const set of team) {
				let species = this.dex.species.get(set.species);
				if (typeof species.battleOnly === 'string') species = this.dex.species.get(species.battleOnly);
				// @ts-expect-error custom tier
				if (species.tier === 'Random') randomCount++;
			}
			if (randomCount < 2) {
				return [`You must have at least 2 Head Pokemon.`];
			}
		},
	}
};