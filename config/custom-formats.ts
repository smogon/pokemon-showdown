import { Dex } from '../sim/dex';

export const Formats: FormatList = [
  {
    name: "[Gen 9] Impulse Random Red",
    desc: "Randomized teams of Pokémon with red color only.",
    section: "S/V Singles",

    mod: 'gen9',
    team: 'random',
    ruleset: ['Obtainable', 'Standard', 'Team Preview'],
    onBegin() {
      this.add('message', `Welcome to [Gen 9] Impulse Random Red! Only Pokémon with red colors will be used.`);
    },
    teamGenerator: 'randomRedPokemon',
  },
];

export const TeamGenerators: { [k: string]: TeamGenerator } = {
  randomRedPokemon(battle: Battle): PokemonSet[] {
    // Get all Pokémon with red color from the Dex
    const redPokemon = Object.values(Dex.species.all()).filter(species =>
      species.color === 'Red' && !species.isNonstandard && !species.isUnreleased
    );

    if (redPokemon.length === 0) throw new Error("No Pokémon found with red color in this generation.");

    // Shuffle the list of red Pokémon
    this.prng.shuffle(redPokemon);

    // Generate a random team of 6 Pokémon
    const team: PokemonSet[] = [];
    for (let i = 0; i < 6; i++) {
      const species = redPokemon[i % redPokemon.length];
      team.push({
        name: species.name,
        species: species.name,
        item: this.sample(Dex.items.all()).name,
        ability: this.sample(Object.keys(species.abilities)),
        moves: this.sampleMany(Dex.moves.all(), 4).map(move => move.name),
        nature: this.sample(['Adamant', 'Jolly', 'Modest', 'Timid']),
        evs: {
          hp: this.random(252),
          atk: this.random(252),
          def: this.random(252),
          spa: this.random(252),
          spd: this.random(252),
          spe: this.random(252),
        },
        ivs: {
          hp: 31,
          atk: 31,
          def: 31,
          spa: 31,
          spd: 31,
          spe: 31,
        },
        level: 100, // Default level
        shiny: this.randomChance(1, 1024), // 1/1024 chance for shiny
      });
    }

    return team;
  },
};
