const https = require('https');
const fs = require('fs');

const POKEDEX_API = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
const OUTPUT_FILE = 'base-exp.ts';

function fetchData(url) {
	return new Promise((resolve, reject) => {
		https.get(url, res => {
			let data = '';
			res.on('data', chunk => { data += chunk; });
			res.on('end', () => resolve(JSON.parse(data)));
		}).on('error', reject);
	});
}

function toID(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function getPokemonBaseExp(pokemonName) {
	const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

	return data.base_experience;
}

async function generateBaseExp() {
	const pokemonList = await fetchData(POKEDEX_API);
	const baseExp = {};

	for (let i = 0; i < pokemonList.results.length; i++) {
		const pokemon = pokemonList.results[i];
		console.log(`Processing ${i + 1}/${pokemonList.results.length}: ${pokemon.name}`);

		try {
			const pokemonId = toID(pokemon.name);
			const exp = await getPokemonBaseExp(pokemon.name);
			if (exp !== null) {
				baseExp[pokemonId] = exp;
			}
		} catch (error) {
			console.error(`Error processing ${pokemon.name}:`, error.message);
		}
	}

	let output = 'export const MANUAL_BASE_EXP: Record<string, number> = {\n';

	for (const [pokemon, exp] of Object.entries(baseExp)) {
		output += `\t'${pokemon}': ${exp},\n`;
	}

	output += '};\n';

	fs.writeFileSync(OUTPUT_FILE, output);
	console.log(`Generated ${OUTPUT_FILE}`);
}

generateBaseExp();
