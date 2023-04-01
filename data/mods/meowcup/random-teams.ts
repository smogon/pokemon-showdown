import {PRNG, PRNGSeed} from "../../../sim/prng";
import RandomTeams from "../../random-teams";

export class RandomMeowCupTeams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
	}

	randomHCTeam(): PokemonSet[] {
		const team = [];
		const allowedPokemon = [
			'Chien-Pao', 'Chromera', 'Delcatty', 'Eevee', 'Entei', 'Espeon', 'Espurr', 'Flareon', 'Floragato', 'Glaceon', 'Glameow',
			'Hoppip', 'Incineroar', 'Jolteon', 'Jumpluff', 'Kitsunoh', 'Leafeon', 'Liepard', 'Litleo', 'Litten', 'Luxio', 'Luxray',
			'Meowscarada', 'Meowstic', 'Meowstic-F', 'Meowth', 'Meowth-Alola', 'Meowth-Galar', 'Mew', 'Mewtwo', 'Mewtwo-Mega-X',
			'Mewtwo-Mega-Y', 'Mightyena', 'Necrozma-Dusk-Mane', 'Nohface', 'Perrserker', 'Persian', 'Persian-Alola', 'Poochyena',
			'Purrloin', 'Purugly', 'Pyroar', 'Raikou', 'Shinx', 'Skiploom', 'Skitty', 'Sneasel', 'Sneasel-Hisui', 'Sneasler',
			'Solgaleo', 'Sprigatito', 'Suicune', 'Sylveon', 'Torracat', 'Umbreon', 'Vaporeon', 'Walking Wake', 'Weavile', 'Zangoose',
			'Zeraora',
		];
		const includedPokemon: string[] = [];
		while (team.length < (this.maxTeamSize || 6)) {
			let species = this.dex.species.get(this.sample(allowedPokemon));
			if (includedPokemon.includes(species.baseSpecies)) continue;
			includedPokemon.push(species.baseSpecies);
			if (species.cosmeticFormes) {
				species = this.dex.species.get(this.sample([species.name, ...species.cosmeticFormes]));
			}
			const movesPool = new Set<string>();
			let abilityPool = new Set<string>();
			for (const pokemon of allowedPokemon) {
				const pS = this.dex.species.get(pokemon);
				abilityPool.add(pS.abilities['0']);
				if (pS.abilities['1']) abilityPool.add(pS.abilities['1']);
				if (pS.abilities['H']) abilityPool.add(pS.abilities['H']);
				const learnset = this.dex.species.getLearnset(pS.id);
				if (learnset) {
					for (const moveid of Object.keys(learnset)) {
						movesPool.add(this.dex.moves.get(moveid).name);
					}
				}
			}
			const moves = new Set<string>();
			let loCounter = 0;
			// Guarantee one attacking move
			moves.add(this.sample([...movesPool].filter(m => this.dex.moves.get(m).category !== 'Status')));
			loCounter++;
			while (moves.size < (this.maxMoveCount || 5)) {
				const move = this.dex.moves.get(this.sample([...movesPool]));
				if (move.category !== 'Status') loCounter++;
				moves.add(move.name);
				if (species.nfe && moves.has('Acrobatics')) {
					moves.delete('Acrobatics');
					moves.add('Brave Bird');
				}
			}

			let item = 'Leftovers';
			if (this.dex.getEffectiveness('Rock', species) >= 1) {
				item = 'Heavy-Duty Boots';
			}
			if (loCounter > 2) {
				item = 'Life Orb';
			}
			if (loCounter === 5 && species.baseStats['hp'] + species.baseStats['def'] >= 150) {
				item = 'Assault Vest';
			}
			if (species.nfe) {
				item = 'Eviolite';
				abilityPool = new Set<string>([...abilityPool].filter(x => this.dex.abilities.get(x).rating >= 3));
			}
			if (species.battleOnly) {
				item = species.requiredItem!;
				species = this.dex.species.get(species.changesFrom);
			}
			const ability = this.sample([...abilityPool]);
			let level = species.nfe ? this.random(15) + 80 : species.natDexTier === "Uber" ?
				this.random(25) + 60 : this.random(20) + 70;
			if (this.adjustLevel) level = this.adjustLevel;
			team.push({
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				moves: Array.from(moves),
				ability,
				evs: {hp: 252, atk: 252, def: 252, spa: 252, spd: 252, spe: 252},
				ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				nature: 'Serious',
				item,
				level,
				shiny: this.randomChance(1, 1024),
				teraType: this.sample([...moves].map(x => this.dex.moves.get(x)).filter(x => x.category !== 'Status').map(x => x.type)),
			});
		}
		return team;
	}
}

export default RandomMeowCupTeams;
