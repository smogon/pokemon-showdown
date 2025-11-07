const https = require('https');
const fs = require('fs');

const POKEDEX_API = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
const OUTPUT_FILE = 'catch-rates.ts';

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function toID(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function getPokemonCatchRate(pokemonName) {
  const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  const speciesData = await fetchData(data.species.url);
  
  return speciesData.capture_rate;
}

async function generateCatchRates() {
  const pokemonList = await fetchData(POKEDEX_API);
  const catchRates = {};

  for (let i = 0; i < pokemonList.results.length; i++) {
    const pokemon = pokemonList.results[i];
    console.log(`Processing ${i + 1}/${pokemonList.results.length}: ${pokemon.name}`);
    
    try {
      const pokemonId = toID(pokemon.name);
      catchRates[pokemonId] = await getPokemonCatchRate(pokemon.name);
    } catch (error) {
      console.error(`Error processing ${pokemon.name}:`, error.message);
    }
  }

  let output = 'export const MANUAL_CATCH_RATES: Record<string, number> = {\n';
  
  for (const [pokemon, catchRate] of Object.entries(catchRates)) {
    output += `\t'${pokemon}': ${catchRate},\n`;
  }
  
  output += '};\n';
  
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`Generated ${OUTPUT_FILE}`);
}

generateCatchRates();
