export const Rulesets: {[k: string]: ModdedFormatData} = {
	typebanclause: {
		effectType: 'ValidatorRule',
		name: 'Type Ban Clause',
		desc: `Forces teams to exclude given types. Usage: Type Ban Clause = [Type];[Type], e.g. "Type Ban Clause = Water;Dark"`,
		hasValue: true,
		onValidateRule(value) {
			const types = value.split(";");
			types.forEach(typeString => {
				const type = this.dex.types.get(typeString);
				if (!type.exists) throw new Error(`Misspelled type "${value}"`);
				// Temporary hardcode until types support generations
				if (
					(['Dark', 'Steel'].includes(type.name) && this.dex.gen < 2) ||
					(type.name === 'Fairy' && this.dex.gen < 6)
				) {
					throw new Error(`Invalid type "${type.name}" in Generation ${this.dex.gen}`);
				}
				if (type.name === 'Stellar') {
					throw new Error(`There are no Stellar-type Pok\u00e9mon.`);
				}
			});
		},
		onValidateSet(set) {
			const errors: string[] = [];
			const species = this.dex.species.get(set.species);
			const types = this.ruleTable.valueRules.get('typebanclause')!.split("=");
			types.forEach(typeString => {
				const type = this.dex.types.get(typeString);
				if (species.types.includes(type.id)) {
					errors.push(`${set.species} has banned type ${type.name}.`);
				}
			});
			return errors;
		},
	},
};
