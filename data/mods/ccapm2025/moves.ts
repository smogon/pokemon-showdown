export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// Changed Moves
	acupressure: {
		inherit: true,
		onHit(target) {
			if (target.species.name === "Regigigas" && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (!target.m.stats) {
					const allStats: BoostID[] = [];
					let stat: BoostID;
					for (stat in target.boosts) {
						allStats.push(stat);
					}

					target.m.stats = allStats;
					target.m.stats.pop();
					target.m.stats.pop();
					this.prng.shuffle(target.m.stats);
				}

				if (target.m.stats.length) {
					const randomStat = target.m.stats.pop();
					const boost: SparseBoostsTable = {};
					boost[randomStat as BoostID] = 2;
					this.boost(boost);
				} else {
					return false;
				}

				if (target.m.stats.length === 0)
					target.formeChange('Regigigas-Colossal', null, true);
			} else {
				const stats: BoostID[] = [];
				let stat: BoostID;
				for (stat in target.boosts) {
					if (target.boosts[stat] < 6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					const boost: SparseBoostsTable = {};
					boost[randomStat] = 2;
					this.boost(boost);
				} else {
					return false;
				}
			}
		},
	},
	aromatherapy: {
		inherit: true,
		/* beforeMoveCallback(pokemon) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === 'Shaymin') {
				pokemon.formeChange('Shaymin-Sky', null, true);
				pokemon.setAbility('serenegrace', pokemon);
				return true;
			}
		}, */
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Aromatherapy');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('sapsipper')) {
						this.add('-immune', ally, '[from] ability: Sap Sipper');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
					if (ally.volatiles['substitute'] && !move.infiltrates) continue;
				}
				if ((ally as any).cureStatus(false, source)) success = true;
			}
			return success;
		},
	},
	diamondstorm: {
		inherit: true,
		onModifyMove(move, source) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;

			const item = source.getItem();
			if (!item?.isGem) return;

			move.type = item.name.split(' ')[0];

			if (source.ability !== "geminfusion" || !move) return;

			move.onEffectiveness =
				function (this: Battle, typeMod: number, target: Pokemon | null, type: string, ActiveMove) {
					return typeMod + this.dex.getEffectiveness('Rock', type);
				};
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;

			const item = pokemon.getItem();
			if (pokemon.species.id === 'diancie' && !pokemon.transformed && item?.isGem) {
				pokemon.formeChange('Diancie-Infused', this.effect, true, '0', '[msg]');
			}
		},
	},
	diamondstormbug: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Bug)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Bug",
		contestType: "Beautiful",
	},
	diamondstormdark: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Dark)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Dark",
		contestType: "Beautiful",
	},
	diamondstormdragon: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Dragon)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Dragon",
		contestType: "Beautiful",
	},
	diamondstormelectric: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Electric)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Electric",
		contestType: "Beautiful",
	},
	diamondstormfairy: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Fairy)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Fairy",
		contestType: "Beautiful",
	},
	diamondstormfighting: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Fighting)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Fighting",
		contestType: "Beautiful",
	},
	diamondstormfire: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Fire)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
	},
	diamondstormflying: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Flying)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Flying",
		contestType: "Beautiful",
	},
	diamondstormghost: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Ghost)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Ghost",
		contestType: "Beautiful",
	},
	diamondstormgrass: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Grass)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Grass",
		contestType: "Beautiful",
	},
	diamondstormground: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Ground)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Ground",
		contestType: "Beautiful",
	},
	diamondstormice: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Ice)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	diamondstormnormal: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Normal)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Beautiful",
	},
	diamondstormpoison: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Poison)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Poison",
		contestType: "Beautiful",
	},
	diamondstormpsychic: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Psychic)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Psychic",
		contestType: "Beautiful",
	},
	diamondstormrock: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Rock)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Rock",
		contestType: "Beautiful",
	},
	diamondstormsteel: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Steel)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Steel",
		contestType: "Beautiful",
	},
	diamondstormwater: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		realMove: "Diamond Storm",
		name: "Diamond Storm (Water)",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Rock', type);
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Beautiful",
	},
	explosion: {
		inherit: true,
		onAfterMove(pokemon, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === "Electrode" && pokemon.fainted) {
				this.add('-message', `Shakite escaped from its Pokéball!`);

				const shakite: PokemonSet = {
					name: "Shakite",
					species: "Shakite",
					item: pokemon.set.item,
					ability: "Aerilate",
					moves: pokemon.set.moves,
					nature: pokemon.set.nature,
					gender: ['M', 'F'][this.random(2)],
					happiness: this.random(256),
					teraType: pokemon.set.teraType,
					evs: pokemon.set.evs,
					ivs: pokemon.set.ivs,
					level: pokemon.set.level,
					shiny: this.random(4096) === 0,
				};

				const newPoke = pokemon.side.addPokemon(shakite)!;
				this.add('poke', newPoke.side.id, newPoke.details, '');
				this.actions.switchIn(newPoke, 0, null, false);
			}
		},
	},
	finalgambit: {
		inherit: true,
		onAfterMove(pokemon, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === "Electrode" && pokemon.fainted) {
				this.add('-message', `Shakite escaped from its Pokéball!`);

				const shakite: PokemonSet = {
					name: "Shakite",
					species: "Shakite",
					item: pokemon.set.item,
					ability: "Aerilate",
					moves: pokemon.set.moves,
					nature: pokemon.set.nature,
					gender: ['M', 'F'][this.random(2)],
					happiness: this.random(256),
					teraType: pokemon.set.teraType,
					evs: pokemon.set.evs,
					ivs: pokemon.set.ivs,
					level: pokemon.set.level,
					shiny: this.random(4096) === 0,
				};

				const newPoke = pokemon.side.addPokemon(shakite)!;
				this.add('poke', newPoke.side.id, newPoke.details, '');
				this.actions.switchIn(newPoke, 0, null, false);
			}
		},
	},
	gmaxsweetness: {
		inherit: true,
		self: {
			onHit(source) {
				for (const ally of source.side.pokemon) {
					(ally as any).cureStatus(false, source);
				}
			},
		},
	},
	healbell: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('soundproof')) {
						this.add('-immune', ally, '[from] ability: Soundproof');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
				}
				if ((ally as any).cureStatus(false, source)) success = true;
			}
			return success;
		},
	},
	junglehealing: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			return ((pokemon as any).cureStatus(false, pokemon)) || success;
		},
	},
	healingwish: {
		inherit: true,
		onAfterMove(pokemon, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === "Electrode" && pokemon.fainted) {
				this.add('-message', `Shakite escaped from its Pokéball!`);

				const shakite: PokemonSet = {
					name: "Shakite",
					species: "Shakite",
					item: pokemon.set.item,
					ability: "Aerilate",
					moves: pokemon.set.moves,
					nature: pokemon.set.nature,
					gender: ['M', 'F'][this.random(2)],
					happiness: this.random(256),
					teraType: pokemon.set.teraType,
					evs: pokemon.set.evs,
					ivs: pokemon.set.ivs,
					level: pokemon.set.level,
					shiny: this.random(4096) === 0,
				};

				const newPoke = pokemon.side.addPokemon(shakite)!;
				this.add('poke', newPoke.side.id, newPoke.details, '');
				this.actions.switchIn(newPoke, 0, null, false);
			}
		},
	},
	holdhands: {
		inherit: true,
		isNonstandard: undefined,
		onAfterMove(source, target, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (source.baseSpecies.name === 'Jirachi') return;
			if (!(source.side as any).holdHandsUsers) (source.side as any).holdHandsUsers = [source.baseSpecies.name];
			else if (!(source.side as any).holdHandsUsers.includes(source.baseSpecies.name)) (source.side as any)
				.holdHandsUsers.push(source.baseSpecies.name);
		},
		shortDesc: "If used twice, transforms Jirachi.",
		pp: 1,
		noPPBoosts: true,
	},
	lunarblessing: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			return (pokemon as any).cureStatus(false, pokemon) || success;
		},
	},
	lunardance: {
		inherit: true,
		onAfterMove(pokemon, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === "Electrode" && pokemon.fainted) {
				this.add('-message', `Shakite escaped from its Pokéball!`);

				const shakite: PokemonSet = {
					name: "Shakite",
					species: "Shakite",
					item: pokemon.set.item,
					ability: "Aerilate",
					moves: pokemon.set.moves,
					nature: pokemon.set.nature,
					gender: ['M', 'F'][this.random(2)],
					happiness: this.random(256),
					teraType: pokemon.set.teraType,
					evs: pokemon.set.evs,
					ivs: pokemon.set.ivs,
					level: pokemon.set.level,
					shiny: this.random(4096) === 0,
				};

				const newPoke = pokemon.side.addPokemon(shakite)!;
				this.add('poke', newPoke.side.id, newPoke.details, '');
				this.actions.switchIn(newPoke, 0, null, false);
			}
		},
	},
	memento: {
		inherit: true,
		onAfterMove(pokemon, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === "Electrode" && pokemon.fainted) {
				this.add('-message', `Shakite escaped from its Pokéball!`);

				const shakite: PokemonSet = {
					name: "Shakite",
					species: "Shakite",
					item: pokemon.set.item,
					ability: "Aerilate",
					moves: pokemon.set.moves,
					nature: pokemon.set.nature,
					gender: ['M', 'F'][this.random(2)],
					happiness: this.random(256),
					teraType: pokemon.set.teraType,
					evs: pokemon.set.evs,
					ivs: pokemon.set.ivs,
					level: pokemon.set.level,
					shiny: this.random(4096) === 0,
				};

				const newPoke = pokemon.side.addPokemon(shakite)!;
				this.add('poke', newPoke.side.id, newPoke.details, '');
				this.actions.switchIn(newPoke, 0, null, false);
			}
		},
	},
	mistyexplosion: {
		inherit: true,
		onAfterMove(pokemon, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === "Electrode" && pokemon.fainted) {
				this.add('-message', `Shakite escaped from its Pokéball!`);

				const shakite: PokemonSet = {
					name: "Shakite",
					species: "Shakite",
					item: pokemon.set.item,
					ability: "Aerilate",
					moves: pokemon.set.moves,
					nature: pokemon.set.nature,
					gender: ['M', 'F'][this.random(2)],
					happiness: this.random(256),
					teraType: pokemon.set.teraType,
					evs: pokemon.set.evs,
					ivs: pokemon.set.ivs,
					level: pokemon.set.level,
					shiny: this.random(4096) === 0,
				};

				const newPoke = pokemon.side.addPokemon(shakite)!;
				this.add('poke', newPoke.side.id, newPoke.details, '');
				this.actions.switchIn(newPoke, 0, null, false);
			}
		},
	},
	psychoshift: {
		inherit: true,
		self: {
			onHit(pokemon) {
				(pokemon as any).cureStatus(false, pokemon);
			},
		},
	},
	purify: {
		inherit: true,
		onHit(target, source) {
			if (!(target as any).cureStatus(false, source)) {
				this.add('-fail', source);
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
			this.heal(Math.ceil(source.maxhp * 0.5), source);
		},
	},
	refresh: {
		inherit: true,
		onHit(pokemon) {
			if (['', 'slp', 'frz'].includes(pokemon.status)) return false;
			(pokemon as any).cureStatus(false, pokemon);
		},
	},
	selfdestruct: {
		inherit: true,
		onAfterMove(pokemon, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (pokemon.species.name === "Electrode" && pokemon.fainted) {
				this.add('-message', `Shakite escaped from its Pokéball!`);

				const shakite: PokemonSet = {
					name: "Shakite",
					species: "Shakite",
					item: pokemon.set.item,
					ability: "Aerilate",
					moves: pokemon.set.moves,
					nature: pokemon.set.nature,
					gender: ['M', 'F'][this.random(2)],
					happiness: this.random(256),
					teraType: pokemon.set.teraType,
					evs: pokemon.set.evs,
					ivs: pokemon.set.ivs,
					level: pokemon.set.level,
					shiny: this.random(4096) === 0,
				};

				const newPoke = pokemon.side.addPokemon(shakite)!;
				this.add('poke', newPoke.side.id, newPoke.details, '');
				this.actions.switchIn(newPoke, 0, null, false);
			}
		},
	},
	smellingsalts: {
		inherit: true,
		onHit(target, source, move) {
			if (target.status === 'par') (target as any).cureStatus(false, source);
		},
	},
	sparklingaria: {
		inherit: true,
		onAfterMove(source, target, move) {
			if (source.fainted || !move.hitTargets || move.hasSheerForce) {
				// make sure the volatiles are cleared
				for (const pokemon of this.getAllActive()) delete pokemon.volatiles['sparklingaria'];
				return;
			}
			const numberTargets = move.hitTargets.length;
			for (const pokemon of move.hitTargets) {
				// bypasses Shield Dust when hitting multiple targets
				if (pokemon !== source && pokemon.isActive && (pokemon.removeVolatile('sparklingaria') || numberTargets > 1) &&
					pokemon.status === 'brn') {
					(pokemon as any).cureStatus(false, source);
				}
			}
		},
	},
	sparklyswirl: {
		inherit: true,
		self: {
			onHit(pokemon, source, move) {
				this.add('-activate', source, 'move: Aromatherapy');
				for (const ally of source.side.pokemon) {
					if (ally !== source && (ally.volatiles['substitute'] && !move.infiltrates)) {
						continue;
					}
					(ally as any).cureStatus(false, source);
				}
			},
		},
	},
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots') || pokemon.hasItem('restorationcapsule')) return;
				if (pokemon.hasAbility('moltencore')) return;
				const source = this.effectState.source;
				const type = source.ability === "geminfusion" &&
					source.getItem()?.isGem ? source.getItem().name.split(' ')[0] : this.dex.getActiveMove('stealthrock').type;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(type), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
	},
	toxicspikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots') ||
					pokemon.hasItem('restorationcapsule') || pokemon.hasAbility('moltencore')) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	spikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				if (pokemon.hasItem('restorationcapsule')) return;
				if (pokemon.hasAbility('moltencore')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				if (pokemon.hasItem('restorationcapsule')) return;
				if (pokemon.hasAbility('moltencore')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	takeheart: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.boost({ spa: 1, spd: 1 });
			return (pokemon as any).cureStatus(false, pokemon) || success;
		},
	},
	uproar: {
		inherit: true,
		onTryHit(target, source, move) {
			const activeTeam = target.side.activeTeam();
			const foeActiveTeam = target.side.foe.activeTeam();
			for (const [i, allyActive] of activeTeam.entries()) {
				if (allyActive && allyActive.status === 'slp') (allyActive as any).cureStatus(false, source);
				const foeActive = foeActiveTeam[i];
				if (foeActive && foeActive.status === 'slp') (foeActive as any).cureStatus(false, source);
			}
		},
		secondary: undefined,
		target: "randomNormal",
		type: "Normal",
		contestType: "Cute",
	},
	wakeupslap: {
		inherit: true,
		onHit(target, source, move) {
			if (target.status === 'slp') (target as any).cureStatus(false, source);
		},
	},
	worryseed: {
		inherit: true,
		onHit(target, source) {
			const oldAbility = target.setAbility('insomnia');
			if (!oldAbility) return oldAbility as false | null;
			if (target.status === 'slp') (target as any).cureStatus(false, source);
		},
		/* beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin') {
				pokemon.formeChange('Shaymin-Sky', null, true);
				pokemon.setAbility('serenegrace', pokemon);
				return true;
			}
		}, */
	},

	// New Moves
	primalpulse: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Primal Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Morning Sun', target);
			this.add('-anim', source, 'Aura Sphere', target);
		},
		onModifyType(move, pokemon) {
			const types = pokemon.getTypes();
			let type = types[1];
			if (type === 'Bird') type = '???';
			if (type === '???' && types[0]) type = types[0];
			move.type = type;
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
		shortDesc: "Type varies based on the user's secondary type. 20% flinch.",
	},
	dragonscurse: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Dragon's Curse",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dragon Pulse', target);
			this.add('-anim', source, 'Hex', target);
		},
		secondary: {
			chance: 100,
			onHit(target) {
				target.addVolatile('curse');
			},
		},
		target: "normal",
		type: "Dragon",
		contestType: "Clever",
		shortDesc: "Curses the target.",
	},
	gaslight: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Gaslight",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'ber',
		secondary: undefined,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Tough",
		shortDesc: "Makes the target go Berserk.",
	},
	heartofoak: {
		num: 1312,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Heart of Oak",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, distance: 1, metronome: 1 },
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Heart of Oak');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('sapsipper')) {
						this.add('-immune', ally, '[from] ability: Sap Sipper');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
					if (ally.volatiles['substitute'] && !move.infiltrates) continue;
				}
				if (ally.cureStatus()) success = true;
				if (ally.hp < ally.maxhp) ally.sethp(Math.min(ally.maxhp, ally.hp + source.maxhp / 8));
			}
			return success;
		},
		target: "allyTeam",
		type: "Grass",
		zMove: { effect: 'heal' },
		contestType: "Beautiful",
		shortDesc: "Heals the user and its team by 1/8 of their max HP and cures their status conditions.",
	},
	sixtongueemojis: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "sixtongueemojis",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Lick', target);
			this.add('-anim', source, 'Lick', target);
			this.add('-anim', source, 'Lick', target);
			this.add('-anim', source, 'Lick', target);
			this.add('-anim', source, 'Lick', target);
			this.add('-anim', source, 'Lick', target);
		},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('sixtongueemojis', pokemon);
				const data = side.getSideConditionData('sixtongueemojis');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('sixtongueemojis');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('sixtongueemojis start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: sixtongueemojis');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst || source.canTerastallize) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source) {
								if (action.choice === 'megaEvo') {
									this.actions.runMegaEvo(source);
								} else if (action.choice === 'terastallize') {
									// Also a "forme" change that happens before moves, though only possible in NatDex
									this.actions.terastallize(source);
								} else {
									continue;
								}
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('sixtongueemojis', source, source.getLocOf(pokemon));
				}
			},
		},
		secondary: undefined,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
		shortDesc: "Hits foes before they switch out.",
	},
	kaleidostorm: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Kaleidostorm",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Diamond Storm', target);
		},
		onModifyType(move, pokemon) {
			const types = pokemon.getTypes();
			let type = types[0];
			if (type === 'Bird') type = '???';
			if (type === '???' && types[1]) type = types[1];
			move.type = type;
		},
		secondary: undefined,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
		shortDesc: "Type varies based on the user's primary type.",
	},
	yinyangblast: {
		accuracy: true,
		basePower: 170,
		category: "Special",
		name: "Yin-Yang Blast",
		pp: 1,
		priority: 0,
		flags: {},
		/* onTryMove() {
			this.attrLastMove('[still]');
		}, */
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Inferno Overdrive', target);
			this.add('-anim', source, 'Thunder Cage', target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
		},
		isZ: "ultrasimiseariumz",
		secondary: undefined,
		target: "normal",
		type: "Fire",
		contestType: "Cool",
		shortDesc: "Super effective on Water.",
	},
	stackshield: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stack Shield",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'stackshield',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).bypassProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		secondary: undefined,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
		shortDesc: "Protects the user and flips its offenses and defenses.",
	},
	ribbonshift: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Ribbon Shift",
		pp: 5,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Swift', target);
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Psychic', type);
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (pokemon.baseSpecies.baseSpecies === 'Sylveon' && !pokemon.transformed) {
				const sylveForme = pokemon.species.id === 'sylveonlumineon' ? '' : '-Lumineon';
				pokemon.formeChange('Sylveon' + sylveForme, this.effect, false, '0', '[msg]');
			}
		},
		onTry(source) {
			if (source.species.name === 'Sylveon') {
				return;
			}
			this.hint("Only a Pokemon whose form is Sylveon-Base can use this move.");
			if (source.species.name === 'Sylveon-Lumineon') {
				this.attrLastMove('[still]');
				this.add('-fail', source, 'move: Ribbon Shift', '[forme]');
				return null;
			}
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Ribbon Shift');
			return null;
		},
		priority: 0,
		secondary: undefined,
		target: "normal",
		type: "Fairy",
		zMove: { basePower: 170 },
		contestType: "Cute",
		shortDesc: "Sylveon-Base: Combined type effectiveness with Psychic. Sylveon transforms.",
	},
	// generationalevolution: {
	// 	accuracy: 100,
	// 	basePower: 0,
	// 	damage: 40,
	// 	category: "Physical",
	// 	name: "Generational Evolution",
	// 	pp: 30,
	// 	priority: 0,
	// 	flags: { protect: 1, mirror: 1, metronome: 1 },
	// 	onTryMove() {
	// 		this.attrLastMove('[still]');
	// 	},
	// 	onPrepareHit(target, source) {
	// 		this.add('-anim', source, 'Dragon Rage', target);
	// 	},
	// 	onHit(target, pokemon, move) {
	// 		if (this.effectState.landoI) return;
	// 		if (pokemon.baseSpecies.baseSpecies === 'Landorus' && pokemon.transformed) {
	// 			move.willChangeForme = true;
	// 			this.effectState.landoT = false;
	// 			this.effectState.landoI = true;
	// 		}
	// 	},
	// 	onAfterMoveSecondarySelf(pokemon, target, move) {
	// 		if (move.willChangeForme) {
	// 			const lF = pokemon.species.id === 'landorustherianancestral' ? 'Landorus-Therian' : 'Landorus';
	// 			pokemon.formeChange(lF, this.effect, true);
	// 			if (pokemon.species.name === 'Landorus-Therian') {
	// 				pokemon.setAbility('intimidate', pokemon);
	// 			} else if (pokemon.species.name === 'Landorus') {
	// 				pokemon.setAbility('sheerforce', pokemon);
	// 			}
	// 		}
	// 	},
	// 	secondary: {
	// 		chance: 100,
	// 		self: {
	// 			boosts: {
	// 				atk: 2,
	// 			},
	// 		},
	// 	},
	// 	target: "normal",
	// 	type: "Normal",
	// 	contestType: "Cool",
	// 	desc: "Always does 40 damage. Boosts the user's Attack by 2 stages. Landorus transforms.",
	// 	shortDesc: "Always does 40 damage. Boosts the user's Attack by 2 stages. Landorus transforms.",
	// },
	generationaldeevolution: {
		accuracy: 100,
		basePower: 0,
		damage: 40,
		category: "Special",
		name: "Generational De-Evolution",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dragon Rage', target);
		},
		onHit(target, pokemon, move) {
			if (pokemon.species.id === 'landorus') this.boost({ spa: 2 }, pokemon);
			else if (pokemon.species.id === 'landorustherian') this.boost({ atk: 2 }, pokemon);
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (pokemon.baseSpecies.baseSpecies === 'Landorus' && pokemon.species.name !== 'Landorus-Ancestral') {
				pokemon.formeChange('Landorus-Ancestral', this.effect, true);
				pokemon.setAbility('Download', pokemon);
			}
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
		shortDesc: "Always does 40 damage. Boosts Atk/SpA by 2 based on form. Landorus transforms.",
	},
	soulboundslash: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Soulbound Slash",
		pp: 10,
		priority: 0,
		flags: { slicing: 1, protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Night Slash', target);
			if (source.types.join() === source.species.types.join()) {
				const randomType = target.types[this.random(target.types.length)];
				if (source.setType(randomType)) this.add('-start', source, 'typechange', randomType);
			}
		},
		onTryImmunity(target, source) {
			return target.hasType(source.getTypes());
		},
		onEffectiveness(typeMod, target, type, move) {
			if (typeMod !== null) return 1;
		},
		secondary: undefined,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
		shortDesc: "Before damage, user becomes primary type of target. 2x dmg on pkmn that share a type w/user.",
	},
	glacierfang: { // placeholder but the move change would probably be coded elsewhere
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Glacier Fang",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Ice Fang', target);
		},
		secondary: undefined,
		target: "normal",
		type: "Ice",
		shortDesc: "No additional effect.",
	},
	meltingmaul: { // placeholder but the move change would probably be coded elsewhere
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		name: "Melting Maul",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1, cantusetwice: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Steam Eruption', target);
			this.add('-anim', source, 'Ice Hammer', target);
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Ice', type);
		},
		secondary: undefined,
		target: "normal",
		type: "Water",
		shortDesc: "Combined type effectiveness with Ice. Cannot be used consecutively.",
	},
	frostbittenreception: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Frostbitten Reception",
		pp: 10,
		priority: 0,
		flags: {},
		weather: 'snowscape',
		volatileStatus: 'frostbittenreception',
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Chilly Reception', target);
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Frostbitten Reception');
				pokemon.addVolatile('healblock');
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				if (pokemon.status) {
					this.damage(pokemon.baseMaxhp / 10);
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Frostbitten Reception');
			},
		},
		secondary: undefined,
		target: "allAdjacentFoes",
		type: "Ice",
		shortDesc: "Sets Snow. Foes can't heal and statused foes lose 1/10 of their max HP each turn.",
	},
	// Old Moves
	kingsshield: {
		inherit: true,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).bypassProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					const boosts = this.ruleTable.tagRules.includes("+pokemontag:cap") ? { atk: -1 } : { atk: -1, spa: -1 };
					this.boost(boosts, source, target, this.dex.getActiveMove("King's Shield"));
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				const boosts = this.ruleTable.tagRules.includes("+pokemontag:cap") ? { atk: -1 } : { atk: -1, spa: -1 };
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.boost(boosts, source, target, this.dex.getActiveMove("King's Shield"));
				}
			},
		},
	},
	ivycudgel: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (pokemon.hasAbility('crystalize')) {
				move.type = 'Rock';
			}
			switch (pokemon.species.name) {
			case 'Ogerpon-Wellspring':
			case 'Ogerpon-Wellspring-Tera':
				move.type = 'Water';
				break;
			case 'Ogerpon-Hearthflame':
			case 'Ogerpon-Hearthflame-Tera':
				move.type = 'Fire';
				break;
			case 'Ogerpon-Cornerstone':
			case 'Ogerpon-Cornerstone-Tera':
				move.type = 'Rock';
				break;
			case 'Ogerpon-Pixiedust':
			case 'Ogerpon-Pixiedust-Tera':
				move.type = 'Fairy';
				break;
			}
		},
	},
	razorshell: {
		num: 534,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Razor Shell",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		onModifyMove(move, pokemon, target) {
			if (!target || this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			const atk = pokemon.getStat('atk', false, true);
			const spa = pokemon.getStat('spa', false, true);
			const def = target.getStat('def', false, true);
			const spd = target.getStat('spd', false, true);
			const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
			const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
			if (physical < special || (physical === special && this.randomChance(1, 2))) {
				move.category = 'Special';
				delete move.flags['contact'];
			}
			if (move.secondary) move.secondary.boosts = { def: -1, spd: -1 };
		},
		onHit(target, source, move) {
			// Shell Side Arm normally reveals its category via animation on cart, but doesn't play either custom animation against allies
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (!source.isAlly(target)) this.hint(move.category + " Razor Shell");
		},
		onAfterSubDamage(damage, target, source, move) {
			if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
			if (!source.isAlly(target)) this.hint(move.category + " Razor Shell");
		},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
		shortDesc: "50% -1 Def/SpD. Special + Non-Contact if it would be stronger.",
	},
	plasmafists: {
		num: 721,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Past",
		name: "Plasma Fists",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		pseudoWeather: 'iondeluge',
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!this.effectState.bigZera && !this.ruleTable.tagRules.includes("+pokemontag:cap") &&
				pokemon.baseSpecies.baseSpecies === 'Zeraora' && pokemon.volatiles['charge'] && !pokemon.transformed) {
				const zeraForme = pokemon.species.id === 'zeraorabig' ? '' : '-Big';
				pokemon.formeChange('Zeraora' + zeraForme, this.effect, false, '0', '[msg]');
				this.add('-message', "Zeraora's energy is overflowing!");
				pokemon.setAbility('electricsurge', pokemon);
				this.effectState.bigZera = true;
			}
		},
		secondary: undefined,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
		shortDesc: "Zeraora: If used while Charge active, transforms.",
	},
	morningsun: {
		num: 234,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Morning Sun",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(target, pokemon, move) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (this.effectState.solStice) return;
			if (pokemon.species.name === 'Volcarona' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Volcarona-Solstice', null, true);
				pokemon.setAbility('flamebody', pokemon);
				this.effectState.solStice = true;
			}
		},
		secondary: undefined,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	chillyreception: {
		num: 881,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Chilly Reception",
		pp: 10,
		priority: 0,
		flags: {},
		priorityChargeCallback(source) {
			source.addVolatile('chillyreception');
		},
		weather: 'snowscape',
		selfSwitch: true,
		secondary: undefined,
		condition: {
			duration: 1,
			onBeforeMovePriority: 100,
			onBeforeMove(source, target, move) {
				if (move.id !== 'chillyreception') return;
				this.add('-prepare', source, 'Chilly Reception', '[premajor]');
				if (this.effectState.frostKing) return;
				if (source.species.name === 'Slowking' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
					source.formeChange('Slowking-Frostking', null, true);
					source.setAbility('regenerator', source);
					this.effectState.frostKing = true;
				}
			},
		},
		target: "all",
		type: "Ice",
	},
	/* synthesis: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin-Sky', null, true);
				pokemon.setAbility('serenegrace', pokemon);
				return true;
			}
		},
	},
	flowershield: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin-Sky', null, true);
				pokemon.setAbility('serenegrace', pokemon);
				return true;
			}
		},
	},
	floralhealing: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin-Sky', null, true);
				pokemon.setAbility('serenegrace', pokemon);
				return true;
			}
		},
	},
	strengthsap: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin-Sky', null, true);
				pokemon.setAbility('serenegrace', pokemon);
				return true;
			}
		},
	},
	seedflare: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin-Sky' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin', null, true);
				pokemon.setAbility('flowerveil', pokemon);
				return true;
			}
		},
	},
	gigadrain: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin-Sky' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin', null, true);
				pokemon.setAbility('flowerveil', pokemon);
				return true;
			}
		},
	},
	flowertrick: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin-Sky' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin', null, true);
				pokemon.setAbility('flowerveil', pokemon);
				return true;
			}
		},
	},
	sappyseed: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.species.name === 'Shaymin-Sky' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Shaymin', null, true);
				pokemon.setAbility('flowerveil', pokemon);
				return true;
			}
		},
	}, */
	technoblast: {
		num: 546,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		isNonstandard: "Past",
		name: "Techno Blast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			move.type = this.runEvent('Drive', pokemon, null, move, 'Normal');
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (this.effectState.geneSect) return;
			if (pokemon.species.name === 'Genesect-Burn' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Genesect-Core', null, true);
				pokemon.setAbility('martialize', pokemon);
				this.effectState.geneSect = true;
			} else if (pokemon.species.name === 'Genesect-Douse' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Genesect-Rust', null, true);
				pokemon.setAbility('intoxicate', pokemon);
				this.effectState.geneSect = true;
			} else if (pokemon.species.name === 'Genesect-Shock' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Genesect-Airborne', null, true);
				pokemon.setAbility('aerilate', pokemon);
				this.effectState.geneSect = true;
			} else if (pokemon.species.name === 'Genesect-Chill' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Genesect-Luminous', null, true);
				pokemon.setAbility('pixilate', pokemon);
				this.effectState.geneSect = true;
			}
		},
		secondary: undefined,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
		shortDesc: "Type varies based on the held Drive. Genesect transforms.",
	},
	shellsmash: {
		num: 504,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shell Smash",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (this.effectState.rockInn) return;
			if (pokemon.species.name === 'Crustle' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Crustle-Crawler', null, true);
				pokemon.setAbility('sharpness', pokemon);
				this.effectState.rockInn = true;
			}
		},
		boosts: {
			def: -1,
			spd: -1,
			atk: 2,
			spa: 2,
			spe: 2,
		},
		secondary: undefined,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	curse: {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Curse",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		volatileStatus: 'curse',
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) {
				move.target = move.nonGhostTarget!;
			} else if (source.isAlly(target)) {
				move.target = 'randomNormal';
			}
		},
		onTryHit(target, source, move) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = { boosts: { spe: -1, atk: 1, def: 1 } };
			} else if (move.volatileStatus && target.volatiles['curse']) {
				return false;
			}
		},
		onHit(target, source) {
			this.directDamage(source.maxhp / 2, source, source);
		},
		onAfterMoveSecondarySelf(pokemon, target) {
			// if (this.effectState.griGus) return;
			if (pokemon.species.name === 'Cofagrigus' && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				pokemon.formeChange('Cofagrigus-Unchained', null, true);
				pokemon.setAbility('darkmagic', pokemon);
				// Switch Curse for Dragon's Curse
				const curseIndex = pokemon.set.moves
					.map(move => move.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf('curse' as ID);
				const move = this.dex.moves.get('dragonscurse');
				const sketchedMove = {
					move: move.name,
					id: move.id,
					pp: move.pp,
					maxpp: move.pp,
					target: move.target,
					disabled: false,
					used: false,
				};
				pokemon.moveSlots[curseIndex] = sketchedMove;
				pokemon.baseMoveSlots[curseIndex] = sketchedMove;
			};
		},
		// this.effectState.griGus = true;
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Curse', `[of] ${source}`);
			},
			onResidualOrder: 12,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
		secondary: undefined,
		target: "normal",
		nonGhostTarget: "self",
		type: "Ghost",
		zMove: { effect: 'curse' },
		contestType: "Tough",
	},
	phantomforce: {
		num: 566,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Phantom Force",
		pp: 10,
		priority: 0,
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
		breaksProtect: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			if (attacker.species.name === 'Dragapult' && !attacker.transformed &&
				!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				attacker.formeChange('Dragapult-Manifest', move);
				attacker.setAbility('analytic', attacker);
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability: false,
		},
		secondary: undefined,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	// advent Moves
	tidalgift: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "CAP",
		shortDesc: "Removes the user's side's status and negative stat boosts.",
		name: "Tidal Gift",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, distance: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Morning Sun', target);
		},
		onHit(target, source) {
			this.add('-activate', source, 'move: Tidal Gift');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
				}
				if (ally.cureStatus()) success = true;
				let activate = false;
				const boosts: SparseBoostsTable = {};
				let i: BoostID;
				for (i in ally.boosts) {
					if (ally.boosts[i] < 0) {
						activate = true;
						boosts[i] = 0;
					}
				}
				if (activate) {
					ally.setBoost(boosts);
					this.add('-clearnegativeboost', ally, '[silent]');
					success = true;
				}
				return success;
			}
		},
		target: "allyTeam",
		type: "Water",
		zMove: { effect: 'heal' },
		contestType: "Beautiful",
	},
	iciclestorm: {
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		isNonstandard: "CAP",
		shortDesc: "Summons Snow for 5 turns.",
		name: "Icicle Storm",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		weather: 'snowscape',
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Icicle Crash', target);
		},
		secondary: undefined,
		target: "normal",
		type: "Ice",
	},
	gingerstorm: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "CAP",
		shortDesc: "Summons Gingerstorm for 5 turns.",
		name: "Gingerstorm",
		pp: 10,
		priority: 0,
		flags: {},
		weather: 'gingerstorm',
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Sandstorm', target);
		},
		secondary: undefined,
		target: "all",
		type: "Fire",
	},
	christmascannon: {
		accuracy: 95,
		basePower: 100,
		category: "Special",
		isNonstandard: "CAP",
		shortDesc: "Sets Spikes. 20% chance to heal 25% of the user’s HP. Can't use twice in a row.",
		name: "Christmas Cannon",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, cantusetwice: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Armor Cannon', target);
		},
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
			if (this.randomChance(1, 5)) {
				this.heal(source.baseMaxhp / 4, source, source);
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
			if (this.randomChance(1, 5)) {
				this.heal(source.baseMaxhp / 4, source, source);
			}
		},
		secondary: {}, // Sheer Force-boosted
		target: "normal",
		type: "Poison",
	},
	miracledrill: {
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		isNonstandard: "CAP",
		shortDesc: "Hits 2-5 times. Each hit has a 10% chance of either raising or lowering user's Speed by 1.",
		name: "Miracle Drill",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: [2, 5],
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Drill Run', target);
		},
		secondary: {
			chance: 10,
			onHit(target, source) {
				const result = this.random(2);
				if (result === 0) {
					this.boost({ spe: 1 }, source);
				} else {
					this.boost({ spe: -1 }, source);
				}
			},
		},
		target: "normal",
		type: "Ground",
		maxMove: { basePower: 100 },
		contestType: "Cool",
	},
	moneytrees: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		isNonstandard: "CAP",
		shortDesc: "Deals doubled damage in Sun or Grassy Terrain.",
		name: "Money Trees",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Wood Hammer', target);
		},
		onBasePower(basePower, source) {
			if ((this.field.isTerrain('grassyterrain') && source.isGrounded()) ||
				['sunnyday', 'desolateland'].includes(source.effectiveWeather())
			) {
				this.debug('field buff');
				return this.chainModify(2);
			}
		},
		secondary: undefined,
		target: "normal",
		type: "Grass",
	},
	cashout: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		isNonstandard: "CAP",
		shortDesc: "Separate 10% chances of: User +1 SpA/SpD/Spe, Foe -1 SpA/SpD/Spe.",
		name: "Cash Out",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Leaf Storm', target);
		},
		secondaries: [
			{
				chance: 10,
				boosts: {
					spa: -1,
				},
			}, {
				chance: 10,
				boosts: {
					spd: -1,
				},
			}, {
				chance: 10,
				boosts: {
					spe: -1,
				},
			}, {
				chance: 10,
				self: {
					boosts: {
						spa: 1,
					},
				},
			}, {
				chance: 10,
				self: {
					boosts: {
						spd: 1,
					},
				},
			}, {
				chance: 10,
				self: {
					boosts: {
						spe: 1,
					},
				},
			},
		],
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	revelationray: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		isNonstandard: "CAP",
		shortDesc: "Type is user's primary type. User and target swap types.",
		name: "Revelation Ray",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, dance: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Revelation Dance', target);
		},
		onModifyType(move, pokemon) {
			const types = pokemon.getTypes();
			let type = types[0];
			if (type === 'Bird') type = '???';
			if (type === '???' && types[1]) type = types[1];
			move.type = type;
		},
		// finish later
		secondary: undefined,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	umbralscythe: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		isNonstandard: "CAP",
		shortDesc: "Has 33% recoil.",
		name: "Umbral Scythe",
		pp: 15,
		priority: 0,
		flags: { slicing: 1, protect: 1, mirror: 1 },
		recoil: [33, 100],
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Night Slash', target);
		},
		secondary: undefined,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	diracsea: {
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched) {
				this.debug('Dirac Sea damage boost');
				return move.basePower * 2;
			}
			this.debug('Dirac Sea NOT boosted');
			return move.basePower;
		},
		category: "Special",
		isNonstandard: "CAP",
		shortDesc: "2x if the foe switched in this turn.",
		name: "Dirac Sea",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Shadow Ball', target);
		},
		secondary: undefined,
		target: "normal",
		type: "Ghost",
	},
	stoneswipe: {
		accuracy: 90,
		basePower: 95,
		category: "Physical",
		isNonstandard: "CAP",
		shortDesc: "30% chance to lower the foe's Speed.",
		name: "Stone Swipe",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Stone Axe', target);
		},
		secondary: {
			chance: 30,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Cute",
	},
	sugarrush: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "CAP",
		shortDesc: "+2 Atk. +1 Atk & Spe if the user has 75% of their max HP or less.",
		name: "Sugar Rush",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dragon Dance', target);
		},
		onHit(target) {
			if (target.hp <= target.maxhp / 1.33333333) {
				this.boost({ atk: 1, spe: 1 }, target);
			} else {
				this.boost({ atk: 2 }, target);
			}
		},
		secondary: undefined,
		target: "self",
		type: "Fairy",
		zMove: { effect: 'heal' },
		contestType: "Clever",
	},
	waningmoon: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		isNonstandard: "CAP",
		shortDesc: "Hits after two turns. Heals 25% of the user's max HP. Bypasses protection.",
		name: "Waning Moon",
		pp: 10,
		priority: 0,
		flags: { allyanim: 1, futuremove: 1, heal: 1 },
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			this.heal(source.baseMaxhp / 4, source, source);
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'waningmoon',
				source,
				moveData: {
					id: 'waningmoon',
					name: "Waning Moon",
					accuracy: 100,
					basePower: 100,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, metronome: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Dark',
				},
			});
			this.add('-start', source, 'move: Waning Moon');
			return this.NOT_FAIL;
		},
		secondary: undefined,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	fireworkshot: {
		accuracy: 100,
		basePower: 40,
		category: "Special",
		isNonstandard: "CAP",
		shortDesc: "Usually moves first.",
		name: "Firework Shot",
		pp: 10,
		priority: 1,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Torch Song', target);
		},
		secondary: undefined,
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	draconicshuffle: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		isNonstandard: "CAP",
		shortDesc: "Switches the user out. 10% chance to burn foe.",
		name: "Draconic Shuffle",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		selfSwitch: true,
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dragon Tail', target);
		},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Dragon",
		contestType: "Cute",
	},
	triplestaffbash: {
		accuracy: 90,
		basePower: 30,
		category: "Physical",
		isNonstandard: "CAP",
		shortDesc: "Hits 3 times, each with a 20% chance to paralyze.",
		name: "Triple-Staff Bash",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: 3,
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Zing Zap', target);
		},
		secondary: {
			chance: 20,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		maxMove: { basePower: 100 },
		contestType: "Cool",
	},
	holidaypreparation: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "CAP",
		shortDesc: "Switches the user out. Next switch: +1 Atk, +Ice.",
		name: "Holiday Preparation",
		pp: 10,
		priority: 0,
		flags: {},
		sideCondition: 'holidaypreparation',
		condition: {
			onSwitchIn() {
				const source = this.effectState.source;
				if (!source.fainted) {
					source.side.removeSideCondition('holidaypreparation');
					this.boost({ atk: 1 }, source);
					if (!source.hasType('Ice') && source.addType('Ice')) {
						this.add('-start', source, 'typeadd', 'Ice', '[from] move: Holiday Preparation');
					}
					source.side.removeSideCondition('holidaypreparation');
				}
			},
		},
		onTry(source) {
			return !!this.canSwitch(source.side);
		},
		selfSwitch: true,
		secondary: undefined,
		target: "self",
		type: "Ice",
		zMove: { effect: 'heal' },
		contestType: "Cool",
	},
	bristles: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "CAP",
		shortDesc: "Grass-type Stealth Rock.",
		name: "Bristles",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, mustpressure: 1 },
		sideCondition: 'bristles',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Bristles');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('bristles')), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
		secondary: undefined,
		target: "foeSide",
		type: "Grass",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
	},
	gmaxwindrage: {
		inherit: true,
		self: {
			onHit(source) {
				let success = false;
				const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'bristles'];
				const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
				for (const targetCondition of removeTarget) {
					if (source.side.foe.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', source.side.foe, this.dex.conditions.get(targetCondition).name, '[from] move: G-Max Wind Rage', `[of] ${source}`);
						success = true;
					}
				}
				for (const sideCondition of removeAll) {
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: G-Max Wind Rage', `[of] ${source}`);
						success = true;
					}
				}
				this.field.clearTerrain();
				return success;
			},
		},
	},
	mortalspin: {
		inherit: true,
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'bristles'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		onAfterSubDamage(damage, target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'bristles'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
	},
	rapidspin: {
		inherit: true,
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'bristles'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		onAfterSubDamage(damage, target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'bristles'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
	},
	tidyup: {
		inherit: true,
		onHit(pokemon) {
			let success = false;
			for (const active of this.getAllActive()) {
				if (active.removeVolatile('substitute')) success = true;
			}
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'bristles'];
			const sides = [pokemon.side, ...pokemon.side.foeSidesWithConditions()];
			for (const side of sides) {
				for (const sideCondition of removeAll) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name);
						success = true;
					}
				}
			}
			if (success) this.add('-activate', pokemon, 'move: Tidy Up');
			return !!this.boost({ atk: 1, spe: 1 }, pokemon, pokemon, null, false, true) || success;
		},
	},
	courtchange: {
		inherit: true,
		onHitField(target, source) {
			const sideConditions = [
				'mist', 'lightscreen', 'reflect', 'spikes', 'safeguard', 'tailwind', 'toxicspikes', 'stealthrock', 'waterpledge', 'firepledge', 'grasspledge', 'stickyweb', 'auroraveil', 'luckychant', 'gmaxsteelsurge', 'gmaxcannonade', 'gmaxvinelash', 'gmaxwildfire', 'gmaxvolcalith', 'bristles',
			];
			let success = false;
			if (this.gameType === "freeforall") {
				// the list of all sides in clockwise order
				const sides = [this.sides[0], this.sides[3]!, this.sides[1], this.sides[2]!];
				const temp: { [k: number]: typeof source.side.sideConditions } = { 0: {}, 1: {}, 2: {}, 3: {} };
				for (const side of sides) {
					for (const id in side.sideConditions) {
						if (!sideConditions.includes(id)) continue;
						temp[side.n][id] = side.sideConditions[id];
						delete side.sideConditions[id];
						success = true;
					}
				}
				for (let i = 0; i < 4; i++) {
					const sourceSideConditions = temp[sides[i].n];
					const targetSide = sides[(i + 1) % 4]; // the next side in rotation
					for (const id in sourceSideConditions) {
						targetSide.sideConditions[id] = sourceSideConditions[id];
						targetSide.sideConditions[id].target = targetSide;
					}
				}
			} else {
				const sourceSideConditions = source.side.sideConditions;
				const targetSideConditions = source.side.foe.sideConditions;
				const sourceTemp: typeof sourceSideConditions = {};
				const targetTemp: typeof targetSideConditions = {};
				for (const id in sourceSideConditions) {
					if (!sideConditions.includes(id)) continue;
					sourceTemp[id] = sourceSideConditions[id];
					delete sourceSideConditions[id];
					success = true;
				}
				for (const id in targetSideConditions) {
					if (!sideConditions.includes(id)) continue;
					targetTemp[id] = targetSideConditions[id];
					delete targetSideConditions[id];
					success = true;
				}
				for (const id in sourceTemp) {
					targetSideConditions[id] = sourceTemp[id];
					targetSideConditions[id].target = source.side.foe;
				}
				for (const id in targetTemp) {
					sourceSideConditions[id] = targetTemp[id];
					sourceSideConditions[id].target = source.side;
				}
			}
			if (!success) return false;
			this.add('-swapsideconditions');
			this.add('-activate', source, 'move: Court Change');
		},
	},
	defog: {
		inherit: true,
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ evasion: -1 });
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'bristles'];
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
	},
	auroraveil: {
		inherit: true,
		onTry(source) {
			if (!this.field.isWeather(['hail', 'snowscape']) && !source.hasAbility('heartofcold')) return false;
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape']) || pokemon.hasAbility('heartofcold')) move.accuracy = true;
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snowscape':
				move.type = 'Ice';
				break;
			}
			if (!this.field.isWeather(['hail', 'snowscape']) && pokemon.hasAbility('heartofcold')) {
				move.type = 'Ice';
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'snowscape':
				move.basePower *= 2;
				break;
			}
			if (!this.field.isWeather(['hail', 'snowscape']) && pokemon.hasAbility('heartofcold')) {
				move.basePower *= 2;
			}
			this.debug(`BP: ${move.basePower}`);
		},
	},
	// heart of cold to-do: halving the bp/healing of solar blade/beam and synthesis clones
};
