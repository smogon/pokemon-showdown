export const Formats: {[k: string]: ModdedFormatData} = {
	"2abilityclause": {
		inherit: true,
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same ability",
		onBegin() {
			this.add('rule', 'Ability Clause: Limit one of each ability');
		},
		onValidateTeam(team) {
			const abilityTable = new Set<string>();
			for (const set of team) {
				const ability = this.toID(set.ability);
				if (!ability) continue;
				if (abilityTable.has(ability)) {
					return [
						`You are limited to one of each ability by Ability Clause.`,
						`(You have more than one ${this.dex.getAbility(ability).name} variants)`,
					];
				}
				abilityTable.add(ability);
			}
		},
	},
};
