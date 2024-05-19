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
			const types = this.ruleTable.valueRules.get('typebanclause')!.split(";");
			types.forEach(typeString => {
				const type = this.dex.types.get(typeString);
				if (species.types.includes(type.name)) {
					errors.push(`${set.species} has banned type ${type.name}.`);
				}
			});
			return errors;
		},
	},
	movetypebanclause: {
		effectType: 'ValidatorRule',
		name: 'Move Type Ban Clause',
		desc: `Forces team moves to exclude given types. Usage: Move Type Ban Clause = [Type];[Type], e.g. "Move Type Ban Clause = Water;Dark"`,
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
			const types = this.ruleTable.valueRules.get('movetypebanclause')!.split(";");
			for (const moveid of set.moves) {
				const move = this.dex.moves.get(moveid);
				if (types.includes(move.type)) {
					errors.push(`${set.species} has banned move ${move.name} of type ${move.type}.`);
				}
			}
			return errors;
		},
	},
	annibanclause: {
		effectType: 'ValidatorRule',
		name: 'Anni Ban Clause',
		desc: "Bans the use of Anni Pokémon.",
		onValidateSet(set, format) {
			const anniPrefix = [
				"jataro", "kyoto", "haikou", "shiloh", "zeinova",
			];
			const species = this.dex.species.get(set.species || set.name);
			if (anniPrefix.some(prefix => species.name.toLowerCase().startsWith(prefix))) {
				return [`${species.name} is banned.`];
			}
		},
	},
	warofcryptaclause: {
		effectType: 'ValidatorRule',
		name: 'War of Crypta Clause',
		desc: "Bans the use of War of Crypta Pokémon.",
		onValidateSet(set, format) {
			const warofcryptanames = [
				"frostfang", "frostfangevo1", "frostfangevo2", "soko", "fafnir", "fafnirevo1", "fafnirevo2", "shade", "shadeevo1", "shadeevo2", "vixen", "vixenevo1", "slythe", "wildwing", "wildwingevo2", "wildwingevo1", "panshao", "panshaoevo1"
			];
			const species = this.dex.species.get(set.species || set.name);
			if (warofcryptanames.some(name => species.id === name)) {
				return [`${species.name} is banned.`];
			}
		},
	},
	gen1pokedex: {
		effectType: 'ValidatorRule',
		name: 'Gen 1 Pokedex',
		desc: "Only allows Pok&eacute;mon native to gen 1",
		onValidateSet(set, format) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.num <= 0 || species.num > 151) {
				return [species.baseSpecies + " is not in gen 1."];
			}
		},
	},
	gen2pokedex: {
		effectType: 'ValidatorRule',
		name: 'Gen 2 Pokedex',
		desc: "Only allows Pok&eacute;mon native to the gen 2",
		onValidateSet(set, format) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.num <= 152 || species.num > 251) {
				return [species.baseSpecies + " is not in gen 2."];
			}
		},
	},
	gen3pokedex: {
		effectType: 'ValidatorRule',
		name: 'Gen 3 Pokedex',
		desc: "Only allows Pok&eacute;mon native to the gen 3",
		onValidateSet(set, format) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.num <= 251 || species.num > 386) {
				return [species.baseSpecies + " is not in gen 3."];
			}
		},
	},
	gen4pokedex: {
		effectType: 'ValidatorRule',
		name: 'Gen 4 Pokedex',
		desc: "Only allows Pok&eacute;mon native to the gen 4",
		onValidateSet(set, format) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.num <= 386 || species.num > 493) {
				return [species.baseSpecies + " is not in gen 4."];
			}
		},
	},
	gen5pokedex: {
		effectType: 'ValidatorRule',
		name: 'Gen 5 Pokedex',
		desc: "Only allows Pok&eacute;mon native to the gen 5",
		onValidateSet(set, format) {
			const species = this.dex.species.get(set.species || set.name);
			if (species.num <= 493 || species.num > 649) {
				return [species.baseSpecies + " is not in gen 5."];
			}
		},
	},
};
