const https = require('https');
const fs = require('fs');

const POKEDEX_API = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
const OUTPUT_FILE = 'ev-yields.ts';

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

async function getPokemonEVYield(pokemonName) {
	const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

	const evYield = {};
	const statMap = {
		'hp': 'hp',
		'attack': 'atk',
		'defense': 'def',
		'special-attack': 'spa',
		'special-defense': 'spd',
		'speed': 'spe',
	};

	for (const stat of data.stats) {
		const effort = stat.effort;
		if (effort > 0) {
			const statName = statMap[stat.stat.name];
			if (statName) {
				evYield[statName] = effort;
			}
		}
	}

	return evYield;
}

async function generateEVYields() {
	const pokemonList = await fetchData(POKEDEX_API);
	const evYields = {};

	for (let i = 0; i < pokemonList.results.length; i++) {
		const pokemon = pokemonList.results[i];
		console.log(`Processing ${i + 1}/${pokemonList.results.length}: ${pokemon.name}`);

		try {
			const pokemonId = toID(pokemon.name);
			const evYield = await getPokemonEVYield(pokemon.name);
			if (Object.keys(evYield).length > 0) {
				evYields[pokemonId] = evYield;
			}
		} catch (error) {
			console.error(`Error processing ${pokemon.name}:`, error.message);
		}
	}

	let output = 'export const MANUAL_EV_YIELDS: Record<string, {\n';
	output += '\thp?: number,\n';
	output += '\tatk?: number,\n';
	output += '\tdef?: number,\n';
	output += '\tspa?: number,\n';
	output += '\tspd?: number,\n';
	output += '\tspe?: number,\n';
	output += '}> = {\n';

	for (const [pokemon, evYield] of Object.entries(evYields)) {
		const evString = Object.entries(evYield)
			.map(([stat, value]) => `${stat}: ${value}`)
			.join(', ');
		output += `\t'${pokemon}': { ${evString} },\n`;
	}

	output += '};\n';

	fs.writeFileSync(OUTPUT_FILE, output);
	console.log(`Generated ${OUTPUT_FILE}`);
}

generateEVYields();
