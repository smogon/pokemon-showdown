export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	runPickTeam: {
		pickedTeamSize() {
			return 6;
		},
		chooseTeam(data = '') {
			if (this.requestState !== 'teampreview') {
				return this.emitChoiceError(`Can't choose for Team Preview: You're not in a Team Preview phase`);
			}

			const ruleTable = this.battle.ruleTable;
			let positions = data.split(data.includes(',') ? ',' : '')
				.map(datum => parseInt(datum) - 1);
			const pickedTeamSize = 6;

			// make sure positions is exactly of length pickedTeamSize
			// - If too big: the client automatically sends a full list, so we just trim it down to size
			positions.splice(pickedTeamSize);
			// - If too small: we intentionally support only sending leads and having the sim fill in the rest
			if (positions.length === 0) {
				for (let i = 0; i < pickedTeamSize; i++) positions.push(i);
			} else if (positions.length < pickedTeamSize) {
				for (let i = 0; i < pickedTeamSize; i++) {
					if (!positions.includes(i)) positions.push(i);
					// duplicate in input, let the rest of the code handle the error message
					if (positions.length >= pickedTeamSize) break;
				}
			}

			for (const [index, pos] of positions.entries()) {
				if (isNaN(pos) || pos < 0 || pos >= this.pokemon.length) {
					return this.emitChoiceError(`Can't choose for Team Preview: You do not have a Pokémon in slot ${pos + 1}`);
				}
				if (positions.indexOf(pos) !== index) {
					return this.emitChoiceError(`Can't choose for Team Preview: The Pokémon in slot ${pos + 1} can only switch in once`);
				}
			}
			if (ruleTable.maxTotalLevel) {
				let totalLevel = 0;
				for (const pos of positions) totalLevel += this.pokemon[pos].level;

				if (totalLevel > ruleTable.maxTotalLevel) {
					if (!data) {
						// autoChoose
						positions = [...this.pokemon.keys()].sort((a, b) => (this.pokemon[a].level - this.pokemon[b].level))
							.slice(0, pickedTeamSize);
					} else {
						return this.emitChoiceError(`Your selected team has a total level of ${totalLevel}, but it can't be above ${ruleTable.maxTotalLevel}; please select a valid team of ${pickedTeamSize} Pokémon`);
					}
				}
			}
			if (ruleTable.valueRules.has('forceselect')) {
				const species = this.battle.dex.species.get(ruleTable.valueRules.get('forceselect'));
				if (!data) {
					// autoChoose
					positions = [...this.pokemon.keys()].filter(pos => this.pokemon[pos].species.name === species.name)
						.concat([...this.pokemon.keys()].filter(pos => this.pokemon[pos].species.name !== species.name))
						.slice(0, pickedTeamSize);
				} else {
					let hasSelection = false;
					for (const pos of positions) {
						if (this.pokemon[pos].species.name === species.name) {
							hasSelection = true;
							break;
						}
					}
					if (!hasSelection) {
						return this.emitChoiceError(`You must bring ${species.name} to the battle.`);
					}
				}
			}
			for (const [index, pos] of positions.entries()) {
				this.choice.switchIns.add(pos);
				this.choice.actions.push({
					choice: 'team',
					index,
					pokemon: this.pokemon[pos],
					priority: -index,
				} as ChosenAction);
			}

			return true;
		},

	},
	'team-validator': {
		baseValidateTeam(
			team: PokemonSet[] | null,
			options: {
				removeNicknames?: boolean,
				skipSets?: { [name: string]: { [key: string]: boolean } },
			} = {}
		): string[] | null {
			const format = this.format;
			const dex = this.dex;

			let problems: string[] = [];
			const ruleTable = this.ruleTable;
			if (format.team) {
				if (team) {
					return [
						`This format doesn't let you use your own team.`,
						`If you're not using a custom client, please report this as a bug. If you are, remember to use \`/utm null\` before starting a game in this format.`,
					];
				}
				const testTeamSeed = PRNG.generateSeed();
				try {
					const testTeamGenerator = Teams.getGenerator(format, testTeamSeed);
					testTeamGenerator.getTeam(options); // Throws error if generation fails
				} catch (e) {
					return [
						`${format.name}'s team generator (${format.team}) failed using these rules and seed (${testTeamSeed}):-`,
						`${e}`,
					];
				}
				return null;
			}
			if (!team) {
				return [
					`This format requires you to use your own team.`,
					`If you're not using a custom client, please report this as a bug.`,
				];
			}
			if (!Array.isArray(team)) {
				throw new Error(`Invalid team data`);
			}

			if (team.length > ruleTable.maxTeamSize) {
				return [`You may only bring up to ${ruleTable.maxTeamSize} Pok\u00E9mon (your team has ${team.length}).`];
			}

			// A limit is imposed here to prevent too much engine strain or
			// too much layout deformation - to be exact, this is the limit
			// allowed in Custom Game.
			if (team.length > 24) {
				problems.push(`Your team has more than than 24 Pok\u00E9mon, which the simulator can't handle.`);
				return problems;
			}

			const teamHas: { [k: string]: number } = {};
			let lgpeStarterCount = 0;
			let deoxysType;
			for (const set of team) {
				if (!set) return [`You sent invalid team data. If you're not using a custom client, please report this as a bug.`];

				let setProblems: string[] | null = null;
				if (options?.skipSets && options?.skipSets[set.name]) {
					for (const i in options.skipSets[set.name]) {
						teamHas[i] = (teamHas[i] || 0) + 1;
					}
				} else {
					setProblems = (format.validateSet || this.validateSet).call(this, set, teamHas);
				}

				if (set.species === 'Pikachu-Starter' || set.species === 'Eevee-Starter') {
					lgpeStarterCount++;
					if (lgpeStarterCount === 2 && ruleTable.isBanned('nonexistent')) {
						problems.push(`You can only have one of Pikachu-Starter or Eevee-Starter on a team.`);
					}
				}
				if (dex.gen === 3 && set.species.startsWith('Deoxys')) {
					if (!deoxysType) {
						deoxysType = set.species;
					} else if (deoxysType !== set.species && ruleTable.isBanned('nonexistent')) {
						return [
							`You cannot have more than one type of Deoxys forme.`,
							`(Each game in Gen 3 supports only one forme of Deoxys.)`,
						];
					}
				}
				if (setProblems) {
					problems = problems.concat(setProblems);
				}
				if (options.removeNicknames) {
					const useCrossSpeciesNicknames = format.name.includes('Cross Evolution') || ruleTable.has('franticfusionsmod');
					const species = dex.species.get(set.species);
					let crossSpecies: Species;
					if (useCrossSpeciesNicknames && (crossSpecies = dex.species.get(set.name)).exists) {
						set.name = crossSpecies.name;
					} else {
						set.name = species.baseSpecies;
						if (species.baseSpecies === 'Unown') set.species = 'Unown';
					}
				}
			}

			for (const [rule, source, limit, bans] of ruleTable.complexTeamBans) {
				let count = 0;
				for (const ban of bans) {
					if (teamHas[ban] > 0) {
						count += limit ? teamHas[ban] : 1;
					}
				}
				if (limit && count > limit) {
					const clause = source ? ` by ${source}` : ``;
					problems.push(`You are limited to ${limit} of ${rule}${clause}.`);
				} else if (!limit && count >= bans.length) {
					const clause = source ? ` by ${source}` : ``;
					problems.push(`Your team has the combination of ${rule}, which is banned${clause}.`);
				}
			}

			for (const rule of ruleTable.keys()) {
				if ('!+-'.includes(rule.charAt(0))) continue;
				const subformat = dex.formats.get(rule);
				if (subformat.onValidateTeam && ruleTable.has(subformat.id)) {
					problems = problems.concat(subformat.onValidateTeam.call(this, team, format, teamHas) || []);
				}
			}
			if (format.onValidateTeam) {
				problems = problems.concat(format.onValidateTeam.call(this, team, format, teamHas) || []);
			}

			if (!problems.length) return null;
			return problems;
		},

	},
};
