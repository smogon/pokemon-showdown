/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /data/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.BattleScripts = {
	randomSeasonalWinterTeam: function (side) {
		let seasonalPokemonList = [
			'raichu', 'nidoqueen', 'nidoking', 'clefable', 'wigglytuff', 'rapidash', 'dewgong', 'cloyster', 'exeggutor', 'starmie', 'jynx',
			'lapras', 'snorlax', 'articuno', 'azumarill', 'granbull', 'delibird', 'stantler', 'miltank', 'blissey', 'swalot', 'lunatone',
			'castform', 'chimecho', 'glalie', 'walrein', 'regice', 'jirachi', 'bronzong', 'chatot', 'abomasnow', 'weavile', 'togekiss',
			'glaceon', 'probopass', 'froslass', 'rotom-frost', 'uxie', 'mesprit', 'azelf', 'victini', 'vanilluxe', 'sawsbuck', 'beartic',
			'cryogonal', 'chandelure', 'gardevoir', 'amaura', 'aurorus', 'bergmite', 'avalugg', 'xerneas', 'kyogre', 'rotom-wash',
		];

		let team = [];
		for (let i = 0; i < 6; i++) {
			let set = this.randomSet(this.sampleNoReplace(seasonalPokemonList), i);
			set.level *= 50;
			team.push(set);
		}
		return team;
	},
	randomSeasonalFFTeam: function (side) {
		let seasonalPokemonList = [
			'charizard', 'ninetales', 'houndoom', 'arceusfire', 'arcanine', 'moltres', 'rapidash', 'magmar', 'quilava', 'typhlosion',
			'entei', 'hooh', 'blaziken', 'rotomheat', 'chandelure', 'magcargo', 'reshiram', 'zekrom', 'heatran', 'arceusdragon',
			'arceusfighting', 'seadra', 'kingdra', 'gyarados', 'dunsparce', 'milotic', 'drapion', 'growlithe', 'paras', 'parasect',
			'magikarp', 'suicune', 'raikou', 'absol', 'spiritomb', 'horsea', 'ponyta', 'blitzle', 'zebstrika',
		];

		let team = [];
		for (let i = 0; i < 6; i++) {
			let speciesId = this.sampleNoReplace(seasonalPokemonList);
			let set = this.randomSet(speciesId, i);
			if (speciesId === 'gyarados') set.shiny = true;
			set.moves[3] = 'explosion';
			team.push(set);
		}
		return team;
	},
	randomSeasonalSBTeam: function (side) {
		let crypto = require('crypto');
		let date = new Date();
		let hash = parseInt(crypto.createHash('md5').update(toId(side.name)).digest('hex').slice(0, 8), 16) + date.getDate();

		let randoms = new Set([
			(13 * hash + 6) % 721 || 1,
			(18 * hash + 12) % 721 || 1,
			(25 * hash + 24) % 721 || 1,
			(1 * hash + 48) % 721 || 1,
			(23 * hash + 96) % 721 || 1,
			(5 * hash + 192) % 721 || 1,
		]);

		if (randoms.size < 6) {
			// There is a very improbable chance in which two hashes collide, leaving the player with five Pokémon. Fix that.
			let defaults = ['zapdos', 'venusaur', 'aegislash', 'heatran', 'unown', 'liepard'];
			for (let i = randoms.size; i < 6; i++) {
				randoms.add(this.getTemplate(this.sampleNoReplace(defaults)).num);
			}
		}

		let team = [];

		for (let p in this.data.Pokedex) {
			if (!randoms.has(this.data.Pokedex[p].num)) continue;
			let set = this.randomSet(this.getTemplate(p), team.length);
			set.moves[3] = 'present';
			team.push(set);
			randoms.delete(this.data.Pokedex[p].num);
			if (!randoms.size) break;
		}

		return team;
	},
	randomSeasonalSleighTeam: function (side) {
		// All Pokémon in this Seasonal. They are meant to pull the sleigh.
		let seasonalPokemonList = [
			'abomasnow', 'accelgor', 'aggron', 'arbok', 'arcanine', 'arceus', 'ariados', 'armaldo', 'audino', 'aurorus', 'avalugg',
			'barbaracle', 'bastiodon', 'beartic', 'bellossom', 'bibarel', 'bisharp', 'blastoise', 'blaziken', 'bouffalant', 'cacturne',
			'camerupt', 'carracosta', 'cherrim', 'cobalion', 'conkeldurr', 'crawdaunt', 'crustle', 'darmanitan', 'dedenne', 'delcatty',
			'delibird', 'dialga', 'dodrio', 'donphan', 'drapion', 'druddigon', 'dunsparce', 'durant', 'eevee', 'electivire', 'electrode',
			'emboar', 'entei', 'espeon', 'exeggutor', 'exploud', 'feraligatr', 'flareon', 'furfrou', 'furret', 'gallade', 'galvantula',
			'garbodor', 'garchomp', 'gastrodon', 'genesect', 'gigalith', 'girafarig', 'glaceon', 'glaceon', 'glalie', 'gogoat', 'golem',
			'golurk', 'granbull', 'groudon', 'grumpig', 'hariyama', 'haxorus', 'heatmor', 'heatran', 'heliolisk', 'hippowdon', 'hitmonchan',
			'hitmonlee', 'hitmontop', 'houndoom', 'hypno', 'infernape', 'jolteon', 'jynx', 'kabutops', 'kangaskhan', 'kecleon', 'keldeo',
			'kingler', 'krookodile', 'kyurem', 'kyuremblack', 'kyuremwhite', 'lapras', 'leafeon', 'leavanny', 'lickilicky', 'liepard',
			'lilligant', 'linoone', 'lopunny', 'lucario', 'ludicolo', 'luxray', 'machamp', 'magcargo', 'magmortar', 'malamar', 'mamoswine',
			'manectric', 'marowak', 'meganium', 'meowstic', 'metagross', 'mewtwo', 'mightyena', 'miltank', 'nidoking', 'nidoqueen',
			'ninetales', 'octillery', 'omastar', 'pachirisu', 'palkia', 'pangoro', 'parasect', 'persian', 'poliwrath', 'primeape', 'purugly',
			'pyroar', 'raichu', 'raikou', 'rampardos', 'rapidash', 'raticate', 'regice', 'regigigas', 'regirock', 'registeel', 'reshiram',
			'rhydon', 'rhyperior', 'samurott', 'sandslash', 'sawk', 'sawsbuck', 'sceptile', 'scolipede', 'seismitoad', 'shaymin', 'shiftry',
			'simipour', 'simisage', 'simisear', 'skuntank', 'slaking', 'slowbro', 'slowking', 'slurpuff', 'spinda', 'stantler', 'steelix',
			'stoutland', 'sudowoodo', 'suicune', 'sunflora', 'swampert', 'sylveon', 'tangrowth', 'tauros', 'terrakion', 'throh', 'torkoal',
			'torterra', 'typhlosion', 'tyrantrum', 'umbreon', 'ursaring', 'ursaring', 'vaporeon', 'venusaur', 'vileplume', 'virizion',
			'whimsicott', 'wobbuffet', 'xerneas', 'zangoose', 'zebstrika', 'zekrom', 'zoroark',
		];

		// We create the team now
		let team = [];
		for (let i = 0; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);

			let presentIndex = 3;
			let currentMove = set.moves[presentIndex];
			// We preserve top priority moves over the rest.
			if (set.item === 'Heat Rock' && currentMove === 'sunnyday' || currentMove === 'geomancy' || currentMove === 'rest' && set.item === 'chestoberry' || pokemon === 'haxorus' && currentMove === 'dragondance' || set.ability === 'Guts' && currentMove === 'facade') {
				presentIndex = 2;
			}
			set.moves[presentIndex] = 'present';

			if (this.getItem(set.item).megaStone) set.item = 'Life Orb';
			team.push(set);
		}

		// Done, return the result.
		return team;
	},
};
