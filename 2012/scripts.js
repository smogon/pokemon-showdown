/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /data/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.BattleScripts = {
	randomSeasonalTeam: function (side) {
		let seasonalPokemonList = ['alakazam', 'machamp', 'hypno', 'hitmonlee', 'hitmonchan', 'mrmime', 'jynx', 'hitmontop', 'hariyama', 'sableye', 'medicham', 'toxicroak', 'electivire', 'magmortar', 'conkeldurr', 'throh', 'sawk', 'gothitelle', 'beheeyem', 'bisharp', 'volbeat', 'illumise', 'spinda', 'cacturne', 'infernape', 'lopunny', 'lucario', 'mienshao', 'pidgeot', 'fearow', 'dodrio', 'aerodactyl', 'noctowl', 'crobat', 'xatu', 'skarmory', 'swellow', 'staraptor', 'honchkrow', 'chatot', 'unfezant', 'sigilyph', 'braviary', 'mandibuzz', 'farfetchd', 'pelipper', 'altaria', 'togekiss', 'swoobat', 'archeops', 'swanna', 'weavile', 'gallade', 'gardevoir', 'ludicolo', 'snorlax', 'wobbuffet', 'meloetta', 'blissey', 'landorus', 'tornadus', 'golurk', 'bellossom', 'lilligant', 'probopass', 'roserade', 'leavanny', 'zapdos', 'moltres', 'articuno', 'delibird'];

		let team = [];
		for (let i = 0; i < 6; i++) {
			let set = this.randomSet(this.sampleNoReplace(seasonalPokemonList), i);
			set.level = 100;
			team.push(set);
		}
		return team;
	},
	randomSeasonalWWTeam: function (side) {
		let seasonalPokemonList = ['raichu', 'nidoqueen', 'nidoking', 'clefable', 'wigglytuff', 'rapidash', 'dewgong', 'cloyster', 'exeggutor', 'starmie', 'jynx', 'lapras', 'snorlax', 'articuno', 'azumarill', 'granbull', 'delibird', 'stantler', 'miltank', 'blissey', 'swalot', 'lunatone', 'castform', 'chimecho', 'glalie', 'walrein', 'regice', 'jirachi', 'bronzong', 'chatot', 'abomasnow', 'weavile', 'togekiss', 'glaceon', 'probopass', 'froslass', 'rotom-frost', 'uxie', 'mesprit', 'azelf', 'victini', 'vanilluxe', 'sawsbuck', 'beartic', 'cryogonal', 'chandelure'];
		let shouldHavePresent = {raichu:1, clefable:1, wigglytuff:1, azumarill:1, granbull:1, miltank:1, blissey:1, togekiss:1, delibird:1};

		let bannedMoves = new Set(['ironhead', 'fireblast', 'overhead', 'vcreate', 'blueflare']);

		let team = [];

		for (let i = 0; i < 6; i++) {
			let template = this.getTemplate(this.sampleNoReplace(seasonalPokemonList));
			if (template.id === 'chandelure' || template.randomBattleMoves.some(move => bannedMoves.has(move))) {
				template = Object.assign({}, template);
				template.randomBattleMoves = template.randomBattleMoves.filter(move => !bannedMoves.has(move));
				if (template.id === 'chandelure') {
					template.randomBattleMoves.push('flameburst');
					template.abilities = Object.assign({}, template.abilities);
					template.abiities['H'] = 'Flash Fire';
				}
			}

			let set = this.randomSet(template, i);
			if (template.id in shouldHavePresent) set.moves[0] = 'Present';
			set.level = 100;
			team.push(set);
		}

		return team;
	},
};
