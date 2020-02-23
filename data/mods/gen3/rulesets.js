'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		desc: "The standard ruleset for all offical Smogon singles tiers (Ubers, OU, etc.)",
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Switch Priority Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	uunfeclause: {
		effectType: 'ValidatorRule',
		name: 'UU NFE Clause',
		desc: "Bans all NFE Pokemon, except Scyther.",
		banlist: [
			'Abra', 'Anorith', 'Aron', 'Azurill', 'Bagon', 'Baltoy', 'Barboach', 'Bayleef', 'Beldum', 'Bellsprout', 'Bulbasaur',
			'Cacnea', 'Carvanha', 'Cascoon', 'Caterpie', 'Charmander', 'Charmeleon', 'Chikorita', 'Chinchou', 'Clamperl', 'Clefairy',
			'Cleffa', 'Combusken', 'Corphish', 'Croconaw', 'Cubone', 'Cyndaquil', 'Diglett', 'Doduo', 'Dragonair', 'Dratini',
			'Drowzee', 'Duskull', 'Eevee', 'Ekans', 'Electrike', 'Elekid', 'Exeggcute', 'Feebas', 'Flaaffy', 'Gastly', 'Geodude',
			'Gloom', 'Goldeen', 'Grimer', 'Grovyle', 'Growlithe', 'Gulpin', 'Hoothoot', 'Hoppip', 'Horsea', 'Houndour', 'Igglybuff',
			'Ivysaur', 'Jigglypuff', 'Kabuto', 'Kakuna', 'Kirlia', 'Koffing', 'Krabby', 'Lairon', 'Larvitar', 'Ledyba', 'Lileep',
			'Lombre', 'Lotad', 'Loudred', 'Machoke', 'Machop', 'Magby', 'Magikarp', 'Magnemite', 'Makuhita', 'Mankey', 'Mareep', 'Marill',
			'Marshtomp', 'Meditite', 'Meowth', 'Metang', 'Metapod', 'Mudkip', 'Natu', 'Nidoran-F', 'Nidoran-M', 'Nidorina', 'Nidorino',
			'Nincada', 'Numel', 'Nuzleaf', 'Oddish', 'Omanyte', 'Onix', 'Paras', 'Phanpy', 'Pichu', 'Pidgeotto', 'Pidgey', 'Pikachu',
			'Pineco', 'Poliwag', 'Poliwhirl', 'Ponyta', 'Poochyena', 'Porygon', 'Psyduck', 'Pupitar', 'Quilava', 'Ralts', 'Rattata',
			'Remoraid', 'Rhyhorn', 'Sandshrew', 'Seadra', 'Sealeo', 'Seedot', 'Seel', 'Sentret', 'Shelgon', 'Shellder', 'Shroomish',
			'Shuppet', 'Silcoon', 'Skiploom', 'Skitty', 'Slakoth', 'Slowpoke', 'Slugma', 'Smoochum', 'Snorunt', 'Snubbull', 'Spearow',
			'Spheal', 'Spinarak', 'Spoink', 'Squirtle', 'Staryu', 'Sunkern', 'Surskit', 'Swablu', 'Swinub', 'Taillow', 'Teddiursa',
			'Tentacool', 'Togepi', 'Torchic', 'Totodile', 'Trapinch', 'Treecko', 'Tyrogue', 'Venonat', 'Vibrava', 'Vigoroth', 'Voltorb',
			'Vulpix', 'Wailmer', 'Wartortle', 'Weedle', 'Weepinbell', 'Whismur', 'Wingull', 'Wooper', 'Wurmple', 'Zigzagoon', 'Zubat',
		],
	},
};

exports.BattleFormats = BattleFormats;

