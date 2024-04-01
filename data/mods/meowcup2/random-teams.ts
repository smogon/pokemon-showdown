import {PRNG, PRNGSeed} from "../../../sim/prng";
import RandomTeams from "../../random-teams";

export class RandomMeowCup2Teams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
	}

	randomHCTeam(): PokemonSet[] {
		const team = [];
		const allowedPokemon = [
			'Absol', 'Absol-Mega', 'Arcanine', 'Arcanine-Hisui', 'Boltund', 'Buizel', 'Braixen', 'Brionne', 'Carvanha', 'Chien-Pao', 'Chromera', 'Cyndaquil', 'Dachsbun', 'Delcatty', 'Delphox', 'Dewgong',
			'Dewott', 'Eevee', 'Electrike', 'Entei', 'Espeon', 'Espurr', 'Fennekin', 'Fidough', 'Flareon', 'Floatzel', 'Floragato', 'Furfrou', 'Gabite', 'Garchomp', 'Garchomp-Mega', 'Gible', 'Glaceon',
			'Glameow', 'Gouging Fire', 'Granbull', 'Greavard', 'Growlithe', 'Growlithe-Hisui', 'Herdier', 'Hoppip', 'Houndoom', 'Houndoom-Mega', 'Houndour', 'Houndstone', 'Incineroar', 'Jolteon', 'Jumpluff',
			'Kitsunoh', 'Landorus-Therian', 'Leafeon', 'Liepard', 'Lillipup', 'Linoone', 'Linoone-Galar', 'Litleo', 'Litten', 'Lucario', 'Lucario-Mega', 'Luxio', 'Luxray', 'Lycanroc', 'Lycanroc-Dusk',
			'Lycanroc-Midnight', 'Mabosstiff', 'Manectric', 'Manectric-Mega', 'Maschiff', 'Meowscarada', 'Meowstic', 'Meowstic-F', 'Meowth', 'Meowth-Alola', 'Meowth-Galar', 'Mew', 'Mewtwo', 'Mewtwo-Mega-X',
			'Mewtwo-Mega-Y', 'Mienfoo', 'Mienshao', 'Mightyena', 'Necrozma-Dusk-Mane', 'Nickit', 'Ninetales', 'Ninetales-Alola', 'Nohface', 'Obstagoon', 'Ogerpon', 'Ogerpon-Teal-Tera', 'Ogerpon-Cornerstone',
			'Ogerpon-Cornerstone-Tera', 'Ogerpon-Hearthflame', 'Ogerpon-Hearthflame-Tera', 'Ogerpon-Wellspring', 'Ogerpon-Wellspring-Tera', 'Okidogi', 'Oshawott', 'Pawmi', 'Pawmo', 'Pawmot', 'Perrserker',
			'Persian', 'Persian-Alola', 'Poochyena', 'Popplio', 'Primarina', 'Purrloin', 'Purugly', 'Pyroar', 'Quilava', 'Raging Bolt', 'Raikou', 'Riolu', 'Rockruff', 'Samurott', 'Samurott-Hisui', 'Sealeo',
			'Seel', 'Sharpedo', 'Sharpedo-Mega', 'Shaymin-Sky', 'Shinx', 'Skiploom', 'Skitty', 'Slurpuff', 'Smeargle', 'Sneasel', 'Sneasel-Hisui', 'Sneasler', 'Snubbull', 'Solgaleo', 'Spheal', 'Sprigatito',
			'Stoutland', 'Suicune', 'Swirlix', 'Sylveon', 'Thievul', 'Torracat', 'Typhlosion', 'Typhlosion-Hisui', 'Umbreon', 'Vaporeon', 'Vulpix', 'Vulpix-Alola', 'Walking Wake', 'Walrein', 'Weavile', 'Yamper',
			'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zangoose', 'Zeraora', 'Zigzagoon', 'Zigzagoon-Galar', 'Zoroark', 'Zoroark-Hisui', 'Zorua', 'Zorua-Hisui', 'Zygarde-10%',
			// Do NOT ask
			'Brute Bonnet',
		];
		const includedPokemon: string[] = [];
		while (team.length < this.maxTeamSize) {
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
				const learnset = this.dex.species.getLearnsetData(pS.id).learnset;
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
			while (moves.size < 5) {
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
			let teraType = this.sample([...moves].map(x => (
				this.dex.moves.get(x)
			)).filter(x => x.category !== 'Status').map(x => x.type));
			if (moves.has('Tera Blast') && this.randomChance(1, 100)) teraType = 'Stellar';
			if (species.forceTeraType) teraType = species.forceTeraType;
			if (this.forceTeraType) teraType = this.forceTeraType;
			let name = species.baseSpecies;
			if (name === 'Brute Bonnet') name = 'Among Us Impostor';
			team.push({
				name,
				species: species.name,
				gender: species.gender,
				moves: Array.from(moves),
				ability,
				evs: {hp: 252, atk: 252, def: 252, spa: 252, spd: 252, spe: 252},
				ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				nature: 'Serious',
				item,
				level: this.adjustLevel || (species.nfe ? this.random(15) + 80 :
				species.natDexTier === "Uber" ? this.random(25) + 60 : this.random(20) + 70),
				shiny: this.randomChance(1, 1024),
				teraType,
			});
		}
		return team;
	}
}

export default RandomMeowCup2Teams;
