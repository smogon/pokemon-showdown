export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	randomtandemrule: {
		effectType: 'Rule',
		name: 'Random Tandem Rule',
		desc: "Required for Random Tandem to function.",
		onValidateTeam(team) {
			if (team.length > 3) return "You must bring at most 3 Pokemon.";
			const randomCount = 0;
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				if (typeof species.battleOnly === 'string') species = this.dex.species.get(species.battleOnly);
				if (species.tier === 'Random') randomCount++;
			}
			if (randomCount < 2) {
				return [`You must have at least 2 Random Pokemon.`];
			}
		},
		onBegin() {
			for (const side of this.sides) {
				for (const pokemon of side.pokemon) {
					if (!pokemon.baseSpecies.mons || pokemon.random) continue;
					const pokemonList = side.pokemon.map(mon => mon.baseSpecies.id);
					// console.log(pokemonList);
					const mons = pokemon.baseSpecies.mons.filter(mon => !pokemonList.includes(mon[0].species));
					// console.log(mons);
					const mon1 = this.sample(mons);
					mons = mons.filter(mon => mon !== mon1);
					const mon2 = this.sample(mons);

					const poke1 = this.dex.deepClone(mon1[0]);
					poke1.name = poke1.species;
					if (Array.isArray(poke1.item)) poke1.item = this.sample(poke1.item);
					if (Array.isArray(poke1.ability)) poke1.ability = this.sample(poke1.ability);
					if (mon1[1].length === 2 && mon1[2]) {
						const moveset = [...mon1[1]];
						const move1 = this.sample(mon1[2]);
						moveset.push(move1);
						const move2 = this.sample(mon1[2].filter(move => move !== move1));
						moveset.push(move2);
						poke1.moves = moveset;
					} else poke1.moves = mon1[1];
					poke1.nature = 'Serious';
					if (!poke1.gender) poke1.gender = this.sample(['M', 'F']);
					poke1.evs = { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 };
					poke1.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
					poke1.level = 100;
					poke1.shiny = true;
					if (Array.isArray(poke1.teraType)) poke1.teraType = this.sample(poke1.teraType);
					// irrelevant but just in case
					poke1.happiness = 255;
					poke1.hpType = '';
					poke1.pokeball = '';
					poke1.gigantamax = false;
					poke1.dynamaxLevel = 10;

					const poke2 = this.dex.deepClone(mon2[0]);
					poke2.name = poke2.species;
					if (Array.isArray(poke2.item)) poke2.item = this.sample(poke2.item);
					if (Array.isArray(poke2.ability)) poke2.ability = this.sample(poke2.ability);
					if (mon2[1].length === 2 && mon2[2]) {
						const moveset = [...mon2[1]];
						const move1 = this.sample(mon2[2]);
						moveset.push(move1);
						const move2 = this.sample(mon2[2].filter(move => move !== move1));
						moveset.push(move2);
						poke2.moves = moveset;
					} else poke2.moves = mon2[1];
					poke2.nature = 'Serious';
					if (!poke2.gender) poke2.gender = this.sample(['M', 'F']);
					poke2.evs = { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 };
					poke2.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
					poke2.level = 100;
					poke2.shiny = true;
					if (Array.isArray(poke2.teraType)) poke2.teraType = this.sample(poke2.teraType);
					// irrelevant but just in case
					poke2.happiness = 255;
					poke2.hpType = '';
					poke2.pokeball = '';
					poke2.gigantamax = false;
					poke2.dynamaxLevel = 10;

					const newPoke1 = side.addPokemon(poke1);
					newPoke1.random = true;
					const newPoke2 = side.addPokemon(poke2);
					newPoke2.random = true;
				}
			}
			this.ruleTable.pickedTeamSize = 6;
		},
	},
};
