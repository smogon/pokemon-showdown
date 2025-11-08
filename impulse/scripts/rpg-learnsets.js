const https = require('https');
const fs = require('fs');

const POKEDEX_API = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
const OUTPUT_FILE = 'learnsets.ts';

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

async function getPokemonLearnset(pokemonName) {
	const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
	const speciesData = await fetchData(data.species.url);

	const levelupMap = new Map();
	const tmSet = new Set();
	const eggSet = new Set();

	for (const moveData of data.moves) {
		const moveName = toID(moveData.move.name);

		for (const versionDetail of moveData.version_group_details) {
			if (versionDetail.move_learn_method.name === 'level-up') {
				const level = versionDetail.level_learned_at;
				if (!levelupMap.has(moveName)) {
					levelupMap.set(moveName, { level, move: moveName });
				} else {
					const existing = levelupMap.get(moveName);
					if (level < existing.level) {
						levelupMap.set(moveName, { level, move: moveName });
					}
				}
			} else if (versionDetail.move_learn_method.name === 'machine') {
				tmSet.add(moveName);
			} else if (versionDetail.move_learn_method.name === 'egg') {
				eggSet.add(moveName);
			}
		}
	}

	const levelup = Array.from(levelupMap.values());
	levelup.sort((a, b) => a.level - b.level || a.move.localeCompare(b.move));

	const tm = Array.from(tmSet).sort();
	const egg = Array.from(eggSet).sort();

	return { levelup, tm, egg };
}

async function generateLearnsets() {
	const pokemonList = await fetchData(POKEDEX_API);
	const learnsets = {};

	for (let i = 0; i < pokemonList.results.length; i++) {
		const pokemon = pokemonList.results[i];
		console.log(`Processing ${i + 1}/${pokemonList.results.length}: ${pokemon.name}`);

		try {
			const pokemonId = toID(pokemon.name);
			learnsets[pokemonId] = await getPokemonLearnset(pokemon.name);
		} catch (error) {
			console.error(`Error processing ${pokemon.name}:`, error.message);
		}
	}

	let output = 'export const MANUAL_LEARNSETS = {\n';

	for (const [pokemon, data] of Object.entries(learnsets)) {
		output += `\t${pokemon}: {\n`;
		output += `\t\tlevelup: [\n`;
		data.levelup.forEach(move => {
			output += `\t\t\t{ level: ${move.level}, move: '${move.move}' },\n`;
		});
		output += `\t\t],\n`;
		output += `\t\tegg: [${data.egg.map(m => `'${m}'`).join(', ')}],\n`;
		output += `\t\ttm: [${data.tm.map(m => `'${m}'`).join(', ')}],\n`;
		output += `\t},\n`;
	}

	output += '};\n';

	fs.writeFileSync(OUTPUT_FILE, output);
	console.log(`Generated ${OUTPUT_FILE}`);
}

generateLearnsets();
