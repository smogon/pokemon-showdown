 // Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

import { type FormatData, RuleTable } from '../sim/dex-formats';

const spmnm: Partial<FormatData> = {
	// Mix and Mega
	onBegin() {
		for (const pokemon of this.getAllPokemon()) {
			pokemon.m.originalSpecies = pokemon.baseSpecies.name;
		}
	},
	onSwitchIn(pokemon) {
		const originalSpecies = this.dex.species.get((pokemon.species as any).originalSpecies);
		if (originalSpecies.exists && pokemon.m.originalSpecies !== originalSpecies.baseSpecies) {
			// Place volatiles on the Pokémon to show its mega-evolved condition and details
			this.add('-start', pokemon, originalSpecies.requiredItems?.[0] || originalSpecies.requiredItem || originalSpecies.requiredMove, '[silent]');
			const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
			if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1] ||
				oSpecies.types[0] !== pokemon.species.types[0]) {
				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
		}
	},
	onSwitchOut(pokemon) {
		const originalSpecies = this.dex.species.get((pokemon.species as any).originalSpecies);
		if (originalSpecies.exists && pokemon.m.originalSpecies !== originalSpecies.baseSpecies) {
			this.add('-end', pokemon, originalSpecies.requiredItems?.[0] || originalSpecies.requiredItem || originalSpecies.requiredMove, '[silent]');
		}
	},
	// Shared Power
	getSharedPower(pokemon) {
		const sharedPower = new Set<string>();
		for (const ally of pokemon.side.pokemon) {
			if (pokemon.battle.ruleTable.isRestricted(`ability:${ally.baseAbility}`)) continue;
			if (ally.previouslySwitchedIn > 0) {
				if (pokemon.battle.dex.currentMod !== 'sharedpower' && ['trace', 'mirrorarmor'].includes(ally.baseAbility)) {
					sharedPower.add('noability');
					continue;
				}
				sharedPower.add(ally.baseAbility);
			}
		}
		sharedPower.delete(pokemon.baseAbility);
		return sharedPower;
	},
	onBeforeSwitchIn(pokemon) {
		let format = this.format;
		if (!format.getSharedPower) format = this.dex.formats.get('gen9sharedpower');
		for (const ability of format.getSharedPower!(pokemon)) {
			const effect = 'ability:' + this.toID(ability);
			pokemon.volatiles[effect] = this.initEffectState({ id: effect, target: pokemon });
			if (!pokemon.m.abils) pokemon.m.abils = [];
			if (!pokemon.m.abils.includes(effect)) pokemon.m.abils.push(effect);
		}
	},
};

const draftteams: Partial<FormatData> = {
	validateTeam(team, options) {
		const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
			require('../sim/team-validator').TeamValidator;
		return new TeamValidator('[Gen 9] ND Generations Draft [Gen 5]').validateTeam(team, options) ?? undefined;
	},
};
const draftteamsvgc: Partial<FormatData> = {
	validateTeam(team, options) {
		const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
			require('../sim/team-validator').TeamValidator;
		return new TeamValidator('[Gen 9] ND Generations Draft [Gen 5 VGC]').validateTeam(team, options) ?? undefined;
	},
};

export const Formats: import('../sim/dex-formats').FormatList = [

	// region Generations Draft League

	{
		section: 'Generations Draft',
		column: 1,
	},
	{
		name: "[Gen 9] ND Generations Draft [Gen 5]",
		mod: 'champions',
		ruleset: [
			'Standard Generations', 'Terastal Clause', '35 Pokes Mega Clause', '!Gems Clause',
			'!!Adjust Level = 50',
		],
		unbanlist: [
			'Accelgor', 'Alomomola', 'Amoonguss', 'Archen', 'Archeops', 'Audino-Base', 'Audino-Mega', 'Axew', 'Basculegion-Base', 'Basculegion-F', 'Basculin-Base', 'Basculin-Blue-Striped', 'Basculin-White-Striped', 'Beartic', 'Beheeyem', 'Bisharp', 'Blitzle', 'Boldore', 'Bouffalant', 'Braviary-Base', 'Braviary-Hisui', 'Brute Bonnet', 'Carracosta', 'Chandelure-Base', 'Chandelure-Mega', 'Cinccino', 'Cobalion', 'Cofagrigus', 'Conkeldurr', 'Cottonee', 'Crustle', 'Cryogonal', 'Cubchoo', 'Darmanitan-Base', 'Darmanitan-Galar', 'Darumaka-Base', 'Darumaka-Galar', 'Deerling', 'Deino', 'Dewott', 'Drilbur', 'Druddigon', 'Ducklett', 'Duosion', 'Durant', 'Dwebble', 'Eelektrik', 'Eelektross-Base', 'Eelektross-Mega', 'Elgyem', 'Emboar-Base', 'Emboar-Mega', 'Emolga', 'Enamorus-Base', 'Enamorus-Therian', 'Escavalier', 'Excadrill-Base', 'Excadrill-Mega', 'Ferroseed', 'Ferrothorn', 'Foongus', 'Fraxure', 'Frillish', 'Galvantula', 'Garbodor', 'Gigalith', 'Golett', 'Golurk-Base', 'Golurk-Mega', 'Gothita', 'Gothitelle', 'Gothorita', 'Gurdurr', 'Haxorus', 'Heatmor', 'Herdier', 'Hydreigon', 'Iron Boulder', 'Iron Crown', 'Iron Jugulis', 'Iron Leaves', 'Jellicent', 'Joltik', 'Karrablast', 'Keldeo-Base', 'Kingambit', 'Klang', 'Klink', 'Klinklang', 'Krokorok', 'Krookodile', 'Kyurem-Base', 'Lampent', 'Landorus-Base', 'Landorus-Therian', 'Larvesta', 'Leavanny', 'Liepard', 'Lilligant-Base', 'Lilligant-Hisui', 'Lillipup', 'Litwick', 'Mandibuzz', 'Maractus', 'Meloetta-Base', 'Mienfoo', 'Mienshao', 'Minccino', 'Munna', 'Musharna', 'Oshawott', 'Palpitoad', 'Panpour', 'Pansage', 'Pansear', 'Patrat', 'Pawniard', 'Petilil', 'Pidove', 'Pignite', 'Purrloin', 'Reuniclus', 'Roggenrola', 'Rufflet', 'Runerigus', 'Samurott-Base', 'Samurott-Hisui', 'Sandile', 'Sawk', 'Sawsbuck', 'Scolipede-Base', 'Scolipede-Mega', 'Scrafty-Base', 'Scrafty-Mega', 'Scraggy', 'Seismitoad', 'Serperior', 'Servine', 'Sewaddle', 'Shelmet', 'Sigilyph', 'Simipour', 'Simisage', 'Simisear', 'Slither Wing', 'Snivy', 'Solosis', 'Stoutland', 'Stunfisk-Base', 'Stunfisk-Galar', 'Swadloon', 'Swanna', 'Swoobat', 'Tepig', 'Terrakion', 'Throh', 'Thundurus-Base', 'Thundurus-Therian', 'Timburr', 'Tirtouga', 'Tornadus-Base', 'Tornadus-Therian', 'Tranquill', 'Trubbish', 'Tympole', 'Tynamo', 'Unfezant', 'Vanillish', 'Vanillite', 'Vanilluxe', 'Venipede', 'Victini', 'Virizion', 'Volcarona', 'Vullaby', 'Watchog', 'Whimsicott', 'Whirlipede', 'Woobat', 'Yamask-Base', 'Yamask-Galar', 'Zebstrika', 'Zoroark-Base', 'Zoroark-Hisui', 'Zorua-Base', 'Zorua-Hisui', 'Zweilous',

			'Audinite', 'Chandelurite', 'Eelektrossite', 'Emboarite', 'Excadrite', 'Golurkite', 'Scolipite', 'Scraftinite',
			'Bug Gem', 'Dark Gem', 'Dragon Gem', 'Electric Gem', 'Fairy Gem', 'Fighting Gem', 'Fire Gem', 'Flying Gem', 'Ghost Gem', 'Grass Gem', 'Ground Gem', 'Ice Gem', 'Normal Gem', 'Poison Gem', 'Psychic Gem', 'Rock Gem', 'Steel Gem', 'Water Gem',
			'Belue Berry', 'Watmel Berry', 'Pamtre Berry', 'Durin Berry',
		],
		checkCanLearn(move, species, setSources, set) {
			if (!this.ruleTable.has('natdexmod')) return this.checkCanLearn(move, species, setSources, set);
			const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
				require('../sim/team-validator').TeamValidator;
			const natDex = TeamValidator.get(`gen9nationaldexag`)
				.checkCanLearn(move, species, this.allSources(species), set);
			if (typeof natDex === 'string') return this.checkCanLearn(move, species, setSources, set);
			return natDex;
		},
		onValidateSet(set) {
			if (!this.ruleTable.has('natdexmod')) return;
			const species = this.dex.species.get(set.species);
			let tier = species.tier;
			if (tier === 'Illegal') tier = this.dex.mod('gen9').species.get(species.name).natDexTier;
			if (tier === 'Illegal') {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.name || set.species} does not exist in the National Dex.`];
			}
			const requireObtainable = this.ruleTable.has('obtainable');
			if (requireObtainable) {
				if (species.natDexTier === "Unreleased") {
					const basePokemon = this.toID(species.baseSpecies);
					if (this.ruleTable.has(`+pokemon:${species.id}`) || this.ruleTable.has(`+basepokemon:${basePokemon}`) ||
						this.ruleTable.has('+pokemontag:unobtainable')) {
						return;
					}
					return [`${set.name || set.species} does not exist in the National Dex.`];
				}
				for (const moveid of set.moves) {
					const move = this.dex.moves.get(moveid);
					if (move.isNonstandard === 'Unobtainable' && move.gen === this.dex.gen) {
						if (this.ruleTable.has(`+move:${move.id}`)) continue;
						const problem = `${set.name}'s move ${move.name} does not exist in the National Dex.`;
						if (this.ruleTable.has('omunobtainablemoves')) {
							const { outOfBattleSpecies } = this.getValidationSpecies(set);
							if (!this.omCheckCanLearn(move, outOfBattleSpecies, this.allSources(outOfBattleSpecies), set, problem)) continue;
						}
						return [problem];
					}
				}
			}
			// Any item that was legal in Gen 7 (Normal Gem for example) should be usable
			if (!set.item) return;
			let item = this.dex.items.get(set.item);
			let gen = this.dex.gen;
			while (item.isNonstandard && gen >= 7) {
				item = this.dex.forGen(gen).items.get(item.id);
				gen--;
			}
			if (requireObtainable && item.isNonstandard) {
				if (this.ruleTable.has(`+item:${item.id}`)) return;
				return [`${set.name}'s item ${item.name} does not exist in Gen ${this.dex.gen}.`];
			}
		},
	},
	{
		name: "[Gen 9] ND Generations Draft [Gen 5 VGC]",
		mod: 'champions',
		gameType: 'doubles',
		ruleset: [
			'Standard Generations', 'Terastal Clause', 'Tera Type Preview', '35 Pokes Mega Clause', '!Gems Clause',
			'!Sleep Clause Mod', '!DryPass Clause', '!!Adjust Level = 50',
			'Min Team Size = 6', 'Picked Team Size = 4', 'Best Of = 3', 'Item Clause = 1',
		],
		unbanlist: [
			'Shadow Tag', 'Last Respects', 'Shed Tail', 'Take Heart',

			'Accelgor', 'Alomomola', 'Amoonguss', 'Archen', 'Archeops', 'Audino-Base', 'Audino-Mega', 'Axew', 'Basculegion-Base', 'Basculegion-F', 'Basculin-Base', 'Basculin-Blue-Striped', 'Basculin-White-Striped', 'Beartic', 'Beheeyem', 'Bisharp', 'Blitzle', 'Boldore', 'Bouffalant', 'Braviary-Base', 'Braviary-Hisui', 'Brute Bonnet', 'Carracosta', 'Chandelure-Base', 'Chandelure-Mega', 'Cinccino', 'Cobalion', 'Cofagrigus', 'Conkeldurr', 'Cottonee', 'Crustle', 'Cryogonal', 'Cubchoo', 'Darmanitan-Base', 'Darmanitan-Galar', 'Darumaka-Base', 'Darumaka-Galar', 'Deerling', 'Deino', 'Dewott', 'Drilbur', 'Druddigon', 'Ducklett', 'Duosion', 'Durant', 'Dwebble', 'Eelektrik', 'Eelektross-Base', 'Eelektross-Mega', 'Elgyem', 'Emboar-Base', 'Emboar-Mega', 'Emolga', 'Enamorus-Base', 'Enamorus-Therian', 'Escavalier', 'Excadrill-Base', 'Excadrill-Mega', 'Ferroseed', 'Ferrothorn', 'Foongus', 'Fraxure', 'Frillish', 'Galvantula', 'Garbodor', 'Gigalith', 'Golett', 'Golurk-Base', 'Golurk-Mega', 'Gothita', 'Gothitelle', 'Gothorita', 'Gurdurr', 'Haxorus', 'Heatmor', 'Herdier', 'Hydreigon', 'Iron Boulder', 'Iron Crown', 'Iron Jugulis', 'Iron Leaves', 'Iron Moth', 'Jellicent', 'Joltik', 'Karrablast', 'Keldeo-Base', 'Kingambit', 'Klang', 'Klink', 'Klinklang', 'Krokorok', 'Krookodile', 'Kyurem-Base', 'Lampent', 'Landorus-Base', 'Landorus-Therian', 'Larvesta', 'Leavanny', 'Liepard', 'Lilligant-Base', 'Lilligant-Hisui', 'Lillipup', 'Litwick', 'Mandibuzz', 'Maractus', 'Meloetta-Base', 'Mienfoo', 'Mienshao', 'Minccino', 'Munna', 'Musharna', 'Oshawott', 'Palpitoad', 'Panpour', 'Pansage', 'Pansear', 'Patrat', 'Pawniard', 'Petilil', 'Pidove', 'Pignite', 'Purrloin', 'Reuniclus', 'Roggenrola', 'Rufflet', 'Runerigus', 'Samurott-Base', 'Samurott-Hisui', 'Sandile', 'Sawk', 'Sawsbuck', 'Scolipede-Base', 'Scolipede-Mega', 'Scrafty-Base', 'Scrafty-Mega', 'Scraggy', 'Seismitoad', 'Serperior', 'Servine', 'Sewaddle', 'Shelmet', 'Sigilyph', 'Simipour', 'Simisage', 'Simisear', 'Slither Wing', 'Snivy', 'Solosis', 'Stoutland', 'Stunfisk-Base', 'Stunfisk-Galar', 'Swadloon', 'Swanna', 'Swoobat', 'Tepig', 'Terrakion', 'Throh', 'Thundurus-Base', 'Thundurus-Therian', 'Timburr', 'Tirtouga', 'Tornadus-Base', 'Tornadus-Therian', 'Tranquill', 'Trubbish', 'Tympole', 'Tynamo', 'Unfezant', 'Vanillish', 'Vanillite', 'Vanilluxe', 'Venipede', 'Victini', 'Virizion', 'Volcarona', 'Vullaby', 'Watchog', 'Whimsicott', 'Whirlipede', 'Woobat', 'Yamask-Base', 'Yamask-Galar', 'Zebstrika', 'Zoroark-Base', 'Zoroark-Hisui', 'Zorua-Base', 'Zorua-Hisui', 'Zweilous',

			'Audinite', 'Chandelurite', 'Eelektrossite', 'Emboarite', 'Excadrite', 'Golurkite', 'Scolipite', 'Scraftinite',
			'Bug Gem', 'Dark Gem', 'Dragon Gem', 'Electric Gem', 'Fairy Gem', 'Fighting Gem', 'Fire Gem', 'Flying Gem', 'Ghost Gem', 'Grass Gem', 'Ground Gem', 'Ice Gem', 'Normal Gem', 'Poison Gem', 'Psychic Gem', 'Rock Gem', 'Steel Gem', 'Water Gem',
			'Belue Berry', 'Watmel Berry', 'Pamtre Berry', 'Durin Berry',
		],
		checkCanLearn(move, species, setSources, set) {
			if (!this.ruleTable.has('natdexmod')) return this.checkCanLearn(move, species, setSources, set);
			const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
				require('../sim/team-validator').TeamValidator;
			const natDex = TeamValidator.get(`gen9nationaldexag`)
				.checkCanLearn(move, species, this.allSources(species), set);
			if (typeof natDex === 'string') return this.checkCanLearn(move, species, setSources, set);
			return natDex;
		},
		onValidateSet(set) {
			if (!this.ruleTable.has('natdexmod')) return;
			const species = this.dex.species.get(set.species);
			let tier = species.tier;
			if (tier === 'Illegal') tier = this.dex.mod('gen9').species.get(species.name).natDexTier;
			if (tier === 'Illegal') {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.name || set.species} does not exist in the National Dex.`];
			}
			const requireObtainable = this.ruleTable.has('obtainable');
			if (requireObtainable) {
				if (species.natDexTier === "Unreleased") {
					const basePokemon = this.toID(species.baseSpecies);
					if (this.ruleTable.has(`+pokemon:${species.id}`) || this.ruleTable.has(`+basepokemon:${basePokemon}`) ||
						this.ruleTable.has('+pokemontag:unobtainable')) {
						return;
					}
					return [`${set.name || set.species} does not exist in the National Dex.`];
				}
				for (const moveid of set.moves) {
					const move = this.dex.moves.get(moveid);
					if (move.isNonstandard === 'Unobtainable' && move.gen === this.dex.gen) {
						if (this.ruleTable.has(`+move:${move.id}`)) continue;
						const problem = `${set.name}'s move ${move.name} does not exist in the National Dex.`;
						if (this.ruleTable.has('omunobtainablemoves')) {
							const { outOfBattleSpecies } = this.getValidationSpecies(set);
							if (!this.omCheckCanLearn(move, outOfBattleSpecies, this.allSources(outOfBattleSpecies), set, problem)) continue;
						}
						return [problem];
					}
				}
			}
			// Any item that was legal in Gen 7 (Normal Gem for example) should be usable
			if (!set.item) return;
			let item = this.dex.items.get(set.item);
			let gen = this.dex.gen;
			while (item.isNonstandard && gen >= 7) {
				item = this.dex.forGen(gen).items.get(item.id);
				gen--;
			}
			if (requireObtainable && item.isNonstandard) {
				if (this.ruleTable.has(`+item:${item.id}`)) return;
				return [`${set.name}'s item ${item.name} does not exist in Gen ${this.dex.gen}.`];
			}
		},
	},
	{
		name: "[Gen 9] ND Generations Draft [2026 Anniversary]",
		mod: 'gen9',
		ruleset: ['Standard Generations', 'Terastal Clause', '35 Pokes Mega Clause'],
		unbanlist: [
			'Abomasnow-Base', 'Abomasnow-Mega', 'Absol-Base', 'Absol-Mega', 'Aggron-Base', 'Aggron-Mega', 'Arcanine-Hisui', 'Aron', 'Articuno-Galar', 'Azelf', 'Azumarill', 'Azurill', 'Bagon', 'Bellossom', 'Blaziken-Base', 'Budew', 'Buneary', 'Carvanha', 'Celebi', 'Chimchar', 'Clamperl', 'Clefable-Base', 'Clefairy', 'Cleffa', 'Combusken', 'Corphish', 'Corsola-Galar', 'Cranidos', 'Crawdaunt', 'Croagunk', 'Crobat', 'Croconaw', 'Cursola', 'Deoxys-Speed', 'Ditto', 'Dragonair', 'Dragonite-Base', 'Dratini', 'Drifblim', 'Drifloon', 'Dusclops', 'Dusknoir', 'Duskull', 'Eevee-Base', 'Electabuzz', 'Electivire', 'Electrode-Hisui', 'Elekid', 'Entei', 'Exploud', 'Feraligatr-Base', 'Flareon', 'Flygon', 'Froslass', 'Froslass-Mega', 'Gabite', 'Gallade-Base', 'Gallade-Mega', 'Garchomp-Base', 'Garchomp-Mega', 'Gardevoir-Base', 'Gardevoir-Mega', 'Gible', 'Glaceon', 'Glalie-Base', 'Glalie-Mega', 'Gligar', 'Gliscor', 'Gloom', 'Golbat', 'Gorebyss', 'Grovyle', 'Growlithe-Hisui', 'Hariyama', 'Heatran-Base', 'Heracross-Base', 'Heracross-Mega', 'Horsea', 'Houndoom-Base', 'Houndoom-Mega', 'Houndour', 'Igglybuff', 'Infernape', 'Iron Treads', 'Iron Valiant', 'Jigglypuff', 'Jirachi', 'Jolteon', 'Kingdra', 'Kingler', 'Kirlia', 'Kleavor', 'Krabby', 'Lairon', 'Latias-Base', 'Latios-Base', 'Lombre', 'Lopunny-Base', 'Lopunny-Mega', 'Lotad', 'Loudred', 'Lucario-Base', 'Ludicolo', 'Machamp', 'Machoke', 'Machop', 'Makuhita', 'Mamoswine', 'Manaphy', 'Marill', 'Mew', 'Mime Jr.', 'Misdreavus', 'Mismagius', 'Monferno', 'Mr. Mime-Base', 'Munchlax', 'Nincada', 'Ninetales-Base', 'Oddish', 'Onix', 'Piloswine', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Porygon', 'Porygon-Z', 'Porygon2', 'Raikou', 'Ralts', 'Rampardos', 'Regice', 'Regidrago', 'Regieleki', 'Registeel', 'Rhydon', 'Rhyhorn', 'Rhyperior', 'Riolu', 'Roselia', 'Roserade', 'Rotom-Mow', 'Rotom-Wash', 'Salamence-Base', 'Sandshrew-Alola', 'Sandslash-Alola', 'Sandy Shocks', 'Sceptile-Base', 'Sceptile-Mega', 'Scizor-Base', 'Scream Tail', 'Scyther', 'Seadra', 'Sharpedo-Base', 'Sharpedo-Mega', 'Shedinja', 'Shelgon', 'Skuntank', 'Slowbro-Galar', 'Slowking-Base', 'Slowking-Galar', 'Slowpoke-Base', 'Slowpoke-Galar', 'Sneasel-Base', 'Sneasel-Hisui', 'Sneasler', 'Snorlax', 'Snorunt', 'Snover', 'Staraptor-Base', 'Staravia', 'Starly', 'Starmie-Base', 'Staryu', 'Steelix-Base', 'Steelix-Mega', 'Stunky', 'Suicune', 'Swellow', 'Swinub', 'Taillow', 'Togekiss', 'Togepi', 'Togetic', 'Torchic', 'Totodile', 'Toxicroak', 'Trapinch', 'Treecko', 'Umbreon', 'Uxie', 'Vaporeon', 'Vibrava', 'Vileplume', 'Voltorb-Hisui', 'Vulpix-Base', 'Weavile', 'Whismur', 'Wigglytuff', 'Zubat',

			'Houndoominite', 'Steelixite', 'Heracronite', 'Sceptilite', 'Aggronite', 'Sharpedonite', 'Absolite', 'Glalitite', 'Froslassite', 'Garchompite', 'Lopunnite', 'Gardevoirite', 'Galladite', 'Abomasite',
		],
	},
	{
		name: "[Gen 9] ND Generations Draft [2026 Anniversary VGC]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: [
			'Standard Generations', 'Terastal Clause', '35 Pokes Mega Clause',
			'!Sleep Clause Mod', '!DryPass Clause', '!!Adjust Level = 50',
			'Min Team Size = 6', 'Picked Team Size = 4', 'Best Of = 3', 'Item Clause = 1',
		],
		unbanlist: [
			'Abomasnow-Base', 'Abomasnow-Mega', 'Absol-Base', 'Absol-Mega', 'Aggron-Base', 'Aggron-Mega', 'Arcanine-Hisui', 'Aron', 'Articuno-Galar', 'Azelf', 'Azumarill', 'Azurill', 'Bagon', 'Bellossom', 'Blaziken-Base', 'Budew', 'Buneary', 'Carvanha', 'Celebi', 'Chimchar', 'Clamperl', 'Clefable-Base', 'Clefairy', 'Cleffa', 'Combusken', 'Corphish', 'Corsola-Galar', 'Cranidos', 'Crawdaunt', 'Croagunk', 'Crobat', 'Croconaw', 'Cursola', 'Deoxys-Speed', 'Ditto', 'Dragonair', 'Dragonite-Base', 'Dratini', 'Drifblim', 'Drifloon', 'Dusclops', 'Dusknoir', 'Duskull', 'Eevee-Base', 'Electabuzz', 'Electivire', 'Electrode-Hisui', 'Elekid', 'Entei', 'Exploud', 'Feraligatr-Base', 'Flareon', 'Flygon', 'Froslass', 'Froslass-Mega', 'Gabite', 'Gallade-Base', 'Gallade-Mega', 'Garchomp-Base', 'Garchomp-Mega', 'Gardevoir-Base', 'Gardevoir-Mega', 'Gible', 'Glaceon', 'Glalie-Base', 'Glalie-Mega', 'Gligar', 'Gliscor', 'Gloom', 'Golbat', 'Gorebyss', 'Grovyle', 'Growlithe-Hisui', 'Hariyama', 'Heatran-Base', 'Heracross-Base', 'Heracross-Mega', 'Horsea', 'Houndoom-Base', 'Houndoom-Mega', 'Houndour', 'Igglybuff', 'Infernape', 'Iron Treads', 'Iron Valiant', 'Jigglypuff', 'Jirachi', 'Jolteon', 'Kingdra', 'Kingler', 'Kirlia', 'Kleavor', 'Krabby', 'Lairon', 'Latias-Base', 'Latios-Base', 'Lombre', 'Lopunny-Base', 'Lopunny-Mega', 'Lotad', 'Loudred', 'Lucario-Base', 'Ludicolo', 'Machamp', 'Machoke', 'Machop', 'Makuhita', 'Mamoswine', 'Manaphy', 'Marill', 'Mew', 'Mime Jr.', 'Misdreavus', 'Mismagius', 'Monferno', 'Mr. Mime-Base', 'Munchlax', 'Nincada', 'Ninetales-Base', 'Oddish', 'Onix', 'Piloswine', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Porygon', 'Porygon-Z', 'Porygon2', 'Raikou', 'Ralts', 'Rampardos', 'Regice', 'Regidrago', 'Regieleki', 'Registeel', 'Rhydon', 'Rhyhorn', 'Rhyperior', 'Riolu', 'Roselia', 'Roserade', 'Rotom-Mow', 'Rotom-Wash', 'Salamence-Base', 'Sandshrew-Alola', 'Sandslash-Alola', 'Sandy Shocks', 'Sceptile-Base', 'Sceptile-Mega', 'Scizor-Base', 'Scream Tail', 'Scyther', 'Seadra', 'Sharpedo-Base', 'Sharpedo-Mega', 'Shedinja', 'Shelgon', 'Skuntank', 'Slowbro-Galar', 'Slowking-Base', 'Slowking-Galar', 'Slowpoke-Base', 'Slowpoke-Galar', 'Sneasel-Base', 'Sneasel-Hisui', 'Sneasler', 'Snorlax', 'Snorunt', 'Snover', 'Staraptor-Base', 'Staravia', 'Starly', 'Starmie-Base', 'Staryu', 'Steelix-Base', 'Steelix-Mega', 'Stunky', 'Suicune', 'Swellow', 'Swinub', 'Taillow', 'Togekiss', 'Togepi', 'Togetic', 'Torchic', 'Totodile', 'Toxicroak', 'Trapinch', 'Treecko', 'Umbreon', 'Uxie', 'Vaporeon', 'Vibrava', 'Vileplume', 'Voltorb-Hisui', 'Vulpix-Base', 'Weavile', 'Whismur', 'Wigglytuff', 'Zubat',

			'Houndoominite', 'Steelixite', 'Heracronite', 'Sceptilite', 'Aggronite', 'Sharpedonite', 'Absolite', 'Glalitite', 'Froslassite', 'Garchompite', 'Lopunnite', 'Gardevoirite', 'Galladite', 'Abomasite',
		],
	},
	{
		name: "[Gen 9] ND Generations Draft [Gen 4]",
		mod: 'generationsdraftgen4',
		ruleset: ['Standard Generations', 'Terastal Clause', '35 Pokes Mega Clause'],
		unbanlist: [
			'Abomasnow-Base', 'Abomasnow-Mega', 'Aipom', 'Ambipom', 'Azelf', 'Bastiodon', 'Bibarel', 'Bidoof', 'Blissey', 'Bonsly', 'Bronzong', 'Bronzor', 'Budew', 'Buizel', 'Buneary', 'Burmy', 'Carnivine', 'Chansey', 'Chatot', 'Cherrim-Base', 'Cherubi', 'Chimchar', 'Chimecho-Base', 'Chimecho-Mega', 'Chingling', 'Combee', 'Cranidos', 'Cresselia', 'Croagunk', 'Drapion', 'Drifblim', 'Drifloon', 'Dusclops', 'Dusknoir', 'Duskull', 'Eevee-Base', 'Electabuzz', 'Electivire', 'Elekid', 'Empoleon', 'Espeon', 'Finneon', 'Flareon', 'Floatzel', 'Froslass-Base', 'Froslass-Mega', 'Gabite', 'Gallade-Base', 'Garchomp-Base', 'Garchomp-Mega', 'Gardevoir-Base', 'Gardevoir-Mega', 'Gastrodon', 'Gible', 'Glaceon', 'Glalie-Base', 'Glalie-Mega', 'Glameow', 'Gligar', 'Gliscor', 'Grotle', 'Happiny', 'Heatran-Base', 'Hippopotas', 'Hippowdon', 'Honchkrow', 'Infernape', 'Jolteon', 'Kirlia', 'Kricketot', 'Kricketune', 'Leafeon', 'Lickilicky', 'Lickitung', 'Lopunny-Base', 'Lopunny-Mega', 'Lucario-Base', 'Lumineon', 'Luxio', 'Luxray', 'Magby', 'Magmar', 'Magmortar', 'Magnemite', 'Magneton', 'Magnezone', 'Mamoswine', 'Manaphy', 'Mantine', 'Mantyke', 'Mesprit', 'Mime Jr.', 'Misdreavus', 'Mismagius', 'Monferno', 'Mothim', 'Mr. Mime-Base', 'Mr. Mime-Galar', 'Mr. Rime', 'Munchlax', 'Murkrow', 'Nosepass', 'Pachirisu', 'Phione', 'Piloswine', 'Piplup', 'Porygon', 'Porygon-Z', 'Porygon2', 'Prinplup', 'Probopass', 'Purugly', 'Ralts', 'Rampardos', 'Regice', 'Regidrago', 'Regieleki', 'Regigigas', 'Regirock', 'Registeel', 'Rhydon', 'Rhyhorn', 'Rhyperior', 'Riolu', 'Roselia', 'Roserade', 'Rotom-Base', 'Rotom-Fan', 'Rotom-Frost', 'Rotom-Heat', 'Rotom-Mow', 'Rotom-Wash', 'Sandy Shocks', 'Shaymin-Base', 'Shellos', 'Shieldon', 'Shinx', 'Skorupi', 'Skuntank', 'Sneasel-Base', 'Sneasel-Hisui', 'Snorlax', 'Snorunt', 'Snover', 'Spiritomb', 'Staraptor-Base', 'Staraptor-Mega', 'Staravia', 'Starly', 'Stunky', 'Sudowoodo', 'Swinub', 'Sylveon', 'Tangela', 'Tangrowth', 'Togekiss', 'Togepi', 'Togetic', 'Torterra', 'Toxicroak', 'Turtwig', 'Umbreon', 'Uxie', 'Vaporeon', 'Vespiquen', 'Weavile', 'Wormadam-Base', 'Wormadam-Sandy', 'Wormadam-Trash', 'Yanma', 'Yanmega',

			'Abomasite', 'Chimechite', 'Froslassite', 'Garchompite', 'Gardevoirite', 'Glalitite', 'Lopunnite', 'Staraptite',
			'Belue Berry', 'Watmel Berry', 'Pamtre Berry', 'Durin Berry',
		],
	},
	{
		name: "[Gen 9] ND Generations Draft [Gen 4 VGC]",
		mod: 'generationsdraftgen4',
		gameType: 'doubles',
		ruleset: [
			'Standard Generations', 'Tera Type Preview', '35 Pokes Mega Clause',
			'!Sleep Clause Mod', '!DryPass Clause', '!!Adjust Level = 50',
			'Min Team Size = 6', 'Picked Team Size = 4', 'Best Of = 3', 'Item Clause = 1',
		],
		unbanlist: [
			'Abomasnow-Base', 'Abomasnow-Mega', 'Aipom', 'Ambipom', 'Azelf', 'Bastiodon', 'Bibarel', 'Bidoof', 'Blissey', 'Bonsly', 'Bronzong', 'Bronzor', 'Budew', 'Buizel', 'Buneary', 'Burmy', 'Carnivine', 'Chansey', 'Chatot', 'Cherrim-Base', 'Cherubi', 'Chimchar', 'Chimecho-Base', 'Chimecho-Mega', 'Chingling', 'Combee', 'Cranidos', 'Croagunk', 'Drapion', 'Drifblim', 'Drifloon', 'Dusclops', 'Dusknoir', 'Duskull', 'Eevee-Base', 'Electabuzz', 'Electivire', 'Elekid', 'Empoleon', 'Espeon', 'Finneon', 'Flareon', 'Floatzel', 'Froslass-Base', 'Froslass-Mega', 'Gabite', 'Gallade-Base', 'Gallade-Mega', 'Garchomp-Base', 'Garchomp-Mega', 'Gardevoir-Base', 'Gastrodon', 'Gible', 'Glaceon', 'Glalie-Base', 'Glalie-Mega', 'Glameow', 'Gligar', 'Gliscor', 'Grotle', 'Happiny', 'Heatran-Base', 'Hippopotas', 'Hippowdon', 'Honchkrow', 'Infernape', 'Iron Valiant', 'Jolteon', 'Kirlia', 'Kricketot', 'Kricketune', 'Leafeon', 'Lickilicky', 'Lickitung', 'Lopunny-Base', 'Lucario-Base', 'Lumineon', 'Luxio', 'Luxray', 'Magby', 'Magmar', 'Magmortar', 'Magnemite', 'Magneton', 'Magnezone', 'Mamoswine', 'Mantine', 'Mantyke', 'Mesprit', 'Mime Jr.', 'Misdreavus', 'Mismagius', 'Monferno', 'Mothim', 'Mr. Mime-Base', 'Mr. Mime-Galar', 'Mr. Rime', 'Munchlax', 'Murkrow', 'Nosepass', 'Pachirisu', 'Phione', 'Piloswine', 'Piplup', 'Porygon', 'Porygon-Z', 'Porygon2', 'Prinplup', 'Probopass', 'Purugly', 'Ralts', 'Rampardos', 'Regice', 'Regidrago', 'Regieleki', 'Regigigas', 'Regirock', 'Registeel', 'Rhydon', 'Rhyhorn', 'Rhyperior', 'Riolu', 'Roselia', 'Roserade', 'Rotom-Base', 'Rotom-Fan', 'Rotom-Frost', 'Rotom-Heat', 'Rotom-Mow', 'Rotom-Wash', 'Sandy Shocks', 'Shaymin-Base', 'Shellos', 'Shieldon', 'Shinx', 'Skorupi', 'Skuntank', 'Sneasel-Base', 'Sneasel-Hisui', 'Sneasler', 'Snorlax', 'Snorunt', 'Snover', 'Spiritomb', 'Staraptor-Base', 'Staraptor-Mega', 'Staravia', 'Starly', 'Stunky', 'Sudowoodo', 'Swinub', 'Sylveon', 'Tangela', 'Tangrowth', 'Togekiss', 'Togepi', 'Togetic', 'Torterra', 'Toxicroak', 'Turtwig', 'Umbreon', 'Uxie', 'Vaporeon', 'Vespiquen', 'Weavile', 'Wormadam-Base', 'Wormadam-Sandy', 'Wormadam-Trash', 'Yanma', 'Yanmega',

			'Abomasite', 'Chimechite', 'Froslassite', 'Galladite', 'Garchompite', 'Glalitite', 'Staraptite',
			'Belue Berry', 'Watmel Berry', 'Pamtre Berry', 'Durin Berry',
		],
	},
	{
		name: "[Gen 9] ND Generations Draft [Gen 3]",
		mod: 'gen9',
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Blaziken-Base', 'Latias-Base', 'Latios-Base', 'Manectric-Mega', 'Deoxys-Speed', 'Jirachi', 'Metagross-Base', 'Salamence-Base', 'Gardevoir-Base', 'Aggron-Mega', 'Sceptile-Mega', 'Sharpedo-Mega', 'Pelipper', 'Regieleki', 'Azumarill', 'Breloom', 'Flygon', 'Sableye-Mega', 'Milotic', 'Regidrago', 'Registeel', 'Roserade', 'Swampert-Base', 'Crawdaunt', 'Deoxys-Defense', 'Froslass-Base', 'Gallade-Base', 'Absol-Mega', 'Glalie-Mega', 'Obstagoon', 'Regirock', 'Swellow', 'Claydol', 'Hariyama', 'Ludicolo', 'Masquerain', 'Medicham-Base', 'Banette-Mega', 'Camerupt-Mega', 'Regice', 'Torkoal', 'Aggron-Base', 'Cradily', 'Dusknoir', 'Exploud', 'Gorebyss', 'Linoone-Base', 'Manectric-Base', 'Probopass', 'Sableye-Base', 'Altaria-Base', 'Armaldo', 'Cacturne', 'Camerupt-Base', 'Dusclops', 'Huntail', 'Sceptile-Base', 'Swalot', 'Wailord', 'Walrein', 'Zangoose', 'Absol-Base', 'Chimecho-Base', 'Combusken', 'Linoone-Galar', 'Mawile-Base', 'Ninjask', 'Regigigas', 'Relicanth', 'Sharpedo-Base', 'Shiftry', 'Slaking', 'Vigoroth', 'Whiscash', 'Banette-Base', 'Glalie-Base', 'Grumpig', 'Illumise', 'Kecleon', 'Metang', 'Roselia', 'Sealeo', 'Seviper', 'Trapinch', 'Tropius', 'Volbeat', 'Clamperl', 'Lairon', 'Lunatone', 'Marshtomp', 'Mightyena', 'Minun', 'Plusle', 'Shedinja', 'Shelgon', 'Solrock', 'Spinda', 'Vibrava', 'Wailmer', 'Anorith', 'Aron', 'Azurill', 'Bagon', 'Baltoy', 'Barboach', 'Beautifly', 'Beldum', 'Budew', 'Cacnea', 'Carvanha', 'Cascoon', 'Castform-Base', 'Chingling', 'Corphish', 'Delcatty', 'Duskull', 'Dustox', 'Electrike', 'Feebas', 'Zigzagoon-Galar', 'Grovyle', 'Gulpin', 'Kirlia', 'Lileep', 'Lombre', 'Lotad', 'Loudred', 'Luvdisc', 'Makuhita', 'Marill', 'Meditite', 'Mudkip', 'Nincada', 'Nosepass', 'Numel', 'Nuzleaf', 'Poochyena', 'Ralts', 'Seedot', 'Shroomish', 'Shuppet', 'Silcoon', 'Skitty', 'Slakoth', 'Snorunt', 'Spheal', 'Spoink', 'Surskit', 'Swablu', 'Taillow', 'Torchic', 'Treecko', 'Whismur', 'Wingull', 'Wobbuffet', 'Wurmple', 'Wynaut', 'Zigzagoon-Base',
		],
	},
	{
		name: "[Gen 9] ND Generations Draft [Gen 2]",
		mod: 'gen9',
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Pikachu-Base', 'Raichu-Base', 'Clefairy', 'Clefable-Base', 'Jigglypuff', 'Wigglytuff', 'Zubat', 'Golbat', 'Oddish',
			'Gloom', 'Vileplume', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Slowpoke', 'Slowbro', 'Onix', 'Hitmonlee',
			'Hitmonchan', 'Chansey', 'Horsea', 'Seadra', 'Scyther', 'Jynx', 'Electabuzz', 'Magmar', 'Eevee-Base',
			'Vaporeon', 'Jolteon', 'Flareon', 'Porygon', 'Chikorita', 'Bayleef', 'Meganium-Base', 'Cyndaquil', 'Quilava',
			'Typhlosion', 'Totodile', 'Croconaw', 'Feraligatr-Base', 'Sentret', 'Furret', 'Hoothoot', 'Noctowl', 'Ledyba',
			'Ledian', 'Spinarak', 'Ariados', 'Crobat', 'Chinchou', 'Lanturn', 'Pichu-Base', 'Cleffa', 'Igglybuff',
			'Togepi', 'Togetic', 'Natu', 'Xatu', 'Mareep', 'Flaaffy', 'Ampharos', 'Bellossom', 'Marill',
			'Azumarill', 'Sudowoodo', 'Politoed', 'Hoppip', 'Skiploom', 'Jumpluff', 'Aipom', 'Sunkern', 'Sunflora',
			'Yanma', 'Wooper', 'Quagsire', 'Espeon', 'Umbreon', 'Murkrow', 'Slowking', 'Misdreavus', 'Unown',
			'Wobbuffet', 'Girafarig', 'Pineco', 'Forretress', 'Dunsparce', 'Gligar', 'Steelix', 'Snubbull', 'Granbull',
			'Qwilfish', 'Scizor', 'Shuckle', 'Heracross', 'Sneasel', 'Teddiursa', 'Ursaring', 'Slugma', 'Magcargo',
			'Swinub', 'Piloswine', 'Corsola', 'Remoraid', 'Octillery', 'Delibird', 'Mantine', 'Skarmory-Base', 'Houndour',
			'Houndoom', 'Kingdra', 'Phanpy', 'Donphan', 'Porygon2', 'Stantler', 'Smeargle', 'Tyrogue', 'Hitmontop',
			'Smoochum', 'Elekid', 'Magby', 'Miltank', 'Blissey', 'Raikou', 'Entei', 'Suicune', 'Larvitar',
			'Pupitar', 'Tyranitar', 'Lugia', 'Ho-Oh', 'Celebi', 'Azurill', 'Wynaut', 'Ambipom', 'Mismagius',
			'Honchkrow', 'Bonsly', 'Happiny', 'Mantyke', 'Weavile', 'Electivire', 'Magmortar', 'Togekiss', 'Yanmega',
			'Leafeon', 'Glaceon', 'Gliscor', 'Mamoswine', 'Porygon-Z', 'Sylveon', 'Cursola', 'Wyrdeer', 'Kleavor',
			'Ursaluna', 'Sneasler', 'Overqwil', 'Clodsire', 'Farigiraf', 'Dudunsparce', 'Great Tusk', 'Scream Tail', 'Flutter Mane',
			'Iron Treads', 'Iron Bundle', 'Iron Thorns', 'Walking Wake', 'Gouging Fire', 'Raging Bolt',
		],
	},
	{
		name: "[Gen 9] ND Generations Draft [Gen 1]",
		mod: 'gen9',
		ruleset: ['Standard Generations', '35 Pokes Mega Clause'],
		unbanlist: [
			'Bulbasaur', 'Ivysaur', 'Venusaur-Base', 'Charmander', 'Charmeleon', 'Charizard-Base', 'Squirtle', 'Wartortle', 'Blastoise-Base',
			'Caterpie', 'Metapod', 'Butterfree', 'Weedle', 'Kakuna', 'Beedrill-Base', 'Pidgey', 'Pidgeotto', 'Pidgeot-Base',
			'Rattata', 'Raticate-Base', 'Raticate-Alola', 'Spearow', 'Fearow', 'Ekans', 'Arbok', 'Pikachu-Base', 'Raichu-Base', 'Sandshrew',
			'Sandslash', 'Nidoran-F', 'Nidorina', 'Nidoqueen', 'Nidoran-M', 'Nidorino', 'Nidoking', 'Clefairy', 'Clefable-Base',
			'Vulpix', 'Ninetales', 'Jigglypuff', 'Wigglytuff', 'Zubat', 'Golbat', 'Oddish', 'Gloom', 'Vileplume',
			'Paras', 'Parasect', 'Venonat', 'Venomoth', 'Diglett', 'Dugtrio', 'Meowth-Base', 'Meowth-Alola', 'Meowth-Galar', 'Persian', 'Psyduck',
			'Golduck', 'Mankey', 'Primeape', 'Growlithe', 'Arcanine', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Abra',
			'Kadabra', 'Alakazam-Base', 'Machop', 'Machoke', 'Machamp', 'Bellsprout', 'Weepinbell', 'Victreebel-Base', 'Tentacool',
			'Tentacruel', 'Geodude', 'Graveler', 'Golem', 'Ponyta', 'Rapidash', 'Slowpoke', 'Slowbro-Base', 'Slowbro-Galar', 'Magnemite',
			'Magneton', 'Farfetch’d', 'Doduo', 'Dodrio', 'Seel', 'Dewgong', 'Grimer', 'Muk', 'Shellder',
			'Cloyster', 'Gastly', 'Haunter', 'Gengar-Base', 'Onix', 'Drowzee', 'Hypno', 'Krabby', 'Kingler',
			'Voltorb', 'Electrode', 'Exeggcute', 'Exeggutor', 'Cubone', 'Marowak-Base', 'Marowak-Alola', 'Hitmonlee', 'Hitmonchan', 'Lickitung',
			'Koffing', 'Weezing', 'Rhyhorn', 'Rhydon', 'Chansey', 'Tangela', 'Kangaskhan-Base', 'Horsea', 'Seadra',
			'Goldeen', 'Seaking', 'Staryu', 'Starmie-Base', 'Mr. Mime', 'Scyther', 'Jynx', 'Electabuzz', 'Magmar',
			'Pinsir-Base', 'Tauros', 'Magikarp', 'Gyarados-Base', 'Lapras', 'Ditto', 'Eevee-Base', 'Vaporeon', 'Jolteon',
			'Flareon', 'Porygon', 'Omanyte', 'Omastar', 'Kabuto', 'Kabutops', 'Aerodactyl-Base', 'Snorlax', 'Articuno',
			'Zapdos', 'Moltres', 'Dratini', 'Dragonair', 'Dragonite-Base', 'Mewtwo-Base', 'Mew', 'Crobat', 'Pichu-Base',
			'Cleffa', 'Igglybuff', 'Bellossom', 'Politoed', 'Espeon', 'Umbreon', 'Slowking', 'Steelix-Base', 'Scizor-Base',
			'Kingdra', 'Porygon2', 'Hitmontop', 'Smoochum', 'Elekid', 'Magby', 'Blissey', 'Mime Jr.', 'Happiny',
			'Munchlax', 'Magnezone', 'Lickilicky', 'Rhyperior', 'Tangrowth', 'Electivire', 'Magmortar', 'Leafeon', 'Glaceon',
			'Porygon-Z', 'Sylveon', 'Meltan', 'Melmetal', 'Perrserker', 'Sirfetch’d', 'Mr. Rime', 'Kleavor', 'Toedscool',
			'Toedscruel', 'Wiglett', 'Wugtrio', 'Annihilape', 'Scream Tail', 'Sandy Shocks',
		],
	},
	{
		section: 'Draft Events',
		column: 1,
	},
	{
		name: '[Gen 9] PDL Bingo',
		desc: 'PDL Bingo speedtour format',
		mod: 'gen9',
		searchShow: false,
		ruleset: [
			'Standard AG', 'NatDex Mod',
			'DryPass Clause', 'Sleep Clause Mod', 'OHKO Clause', 'Forme Clause', 'Terastal Clause',
		],
		banlist: [
			'Moody', 'Snow Cloak', 'Sand Veil', 'Tangled Feet',
			'Focus Band', 'King\'s Rock', 'Razor Fang', 'Quick Claw', 'Berserk Gene',
			'Swagger', 'Revival Blessing', 'Shed Tail', 'Last Respects', 'Take Heart', 'Hidden Power',
		],
		validatorCallback(team, options) {
			if (!options?.user) {
				return 'This format requires a username for team validation.';
			}
			const plugin = (Chat.plugins.pdlbingo as typeof import('../server/chat-plugins/pdlbingo'))?.bingo;
			if (!plugin) {
				return 'Chat plugin "pdlbingo" required by this format not found.';
			}
			if (!plugin.isOn()) {
				return 'Bingo is currently off.';
			}
			return { draft: plugin.getPlayerTeam(options.user) };
		},
		validateTeam(team, options) {
			if (options?.callbackResult?.error) {
				return [options.callbackResult.error];
			}
			const draft = options?.callbackResult?.draft;
			if (!draft) {
				return ['You are not playing in this bingo.'];
			}
			if (draft.length < 6) {
				return ['You have not drafted a full team yet; wait for the rolls to conclude.'];
			}
			const problems: string[] = [];
			for (const set of team) {
				const species = this.dex.species.get(set.species);
				const baseSpecies = this.dex.species.get(species.baseSpecies);
				if (
					draft.includes(species.id) ||
					(baseSpecies.cosmeticFormes?.includes(species.name) && draft.includes(baseSpecies.id))
				) {
					// acceptable pokemon
					continue;
				}
				problems.push(`You have not drawn ${set.name} in this bingo.`);
			}
			if (problems.length) {
				return problems;
			}
			return this.baseValidateTeam(team, options) || undefined;
		},
		onValidateSet(set, format, setHas, teamHas) {
			const problems: string[] = [];
			for(const x of set.moves) {
				const move = Dex.moves.get(x);
				const onlyConfuses = (
					move.category === 'Status' &&
					move.volatileStatus === 'confusion' &&
					move.secondary === null
				);
				if(onlyConfuses) {
					problems.push(`${move.name} is a move used solely to confuse the opponent, which is banned in PDL Bingo.`);
				}
				const onlyDropsAccuracy = (
					move.category === 'Status' &&
					move.boosts?.accuracy &&
					move.boosts.accuracy < 0
				);
				if(onlyDropsAccuracy) {
					problems.push(`${move.name} is a move used solely to lower the opponent's accuracy, which is banned in PDL Bingo.`);
				}
			}
			return problems;
		},
	},
	{
		name: "[Gen 9] Dual Monotype Draft",
		desc: 'Monotype draft with 2 types (in the less restrictive sense).',
		mod: 'gen9',
		ruleset: [
			'Standard', 'Evasion Abilities Clause', 'Terastal Clause', 'Double Same Type Clause', 'DryPass Clause',
			'Min Level = 100', 'Min Team Size = 6',
		],
		banlist: [
			'Moody', 'Revival Blessing', 'Last Respects', 'Shed Tail', 'King\'s Rock', 'Razor Fang', 'Quick Claw',
		],
	},
	{
		name: "[Gen 9] NatDex Draft",
		mod: 'gen9',
		ruleset: ['Standard Draft', '+Unobtainable', '+Past', 'Min Source Gen = 1'],
	},
	{
		name: "[Gen 9] NatDex Draft (Tera Preview)",
		mod: 'gen9',
		ruleset: ['Standard Draft', '+Unobtainable', '+Past', 'Min Source Gen = 1', 'Tera Type Preview'],
	},
	{
		section: 'Draft Teams',
		column: 1,
	},
	// {
	// 	name: '[DIV] user',
	// 	challengeShow: false,
	// 	searchShow: false,
	// 	ruleset: ['Standard Generations'],
	// 	unbanlist: [],
	// 	validateTeam: draftteams.validateTeam,
	// },
	// {
	// 	name: '[DIV VGC] user',
	// 	challengeShow: false,
	// 	searchShow: false,
	// 	ruleset: ['Standard Generations'],
	// 	unbanlist: [],
	// 	validateTeam: draftteamsvgc.validateTeam,
	// },
	{
		name: '[TRU] bbnate',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Amoonguss', 'Basculin-Base', 'Basculin-Blue-Striped', 'Dwebble', 'Eelektross-Base', 'Kyurem-Base', 'Landorus-Base', 'Reuniclus', 'Roggenrola',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[TRU] Batman',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Alomomola', 'Cinccino', 'Enamorus-Therian', 'Keldeo-Base', 'Musharna', 'Stunfisk-Base', 'Victini', 'Whirlipede',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[TRU] Pizza of the Hut',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Chandelure-Mega', 'Cobalion', 'Garbodor', 'Landorus-Base', 'Meloetta-Base', 'Seismitoad', 'Whimsicott', 'Zweilous',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[TRU] Mailducks',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Audino-Mega', 'Cryogonal', 'Enamorus-Base', 'Haxorus', 'Iron Crown', 'Liepard', 'Runerigus', 'Sewaddle', 'Zebstrika',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[TRU] Mr.Smiles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Carracosta', 'Darmanitan-Base', 'Excadrill-Mega', 'Joltik', 'Mienshao', 'Swanna', 'Tornadus-Base', 'Zoroark-Hisui',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[TRU] NPC',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Darmanitan-Galar', 'Excadrill-Base', 'Ferroseed', 'Gigalith', 'Herdier', 'Jellicent', 'Scolipede-Mega', 'Thundurus-Base',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[TRU] Masterriolu',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Basculegion-F', 'Boldore', 'Eelektrik', 'Ferrothorn', 'Hydreigon', 'Krookodile', 'Scrafty-Mega', 'Servine', 'Simisear',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[TRU] Axel',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Cottonee', 'Stunfisk-Galar', 'Iron Boulder', 'Klinklang', 'Mandibuzz', 'Samurott-Hisui', 'Vanilluxe', 'Volcarona',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] Hannah',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Audino-Base', 'Darmanitan-Galar', 'Druddigon', 'Eelektross-Mega', 'Keldeo-Base', 'Serperior', 'Sewaddle', 'Sigilyph',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] SOM',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Audino-Mega', 'Beartic', 'Cobalion', 'Elgyem', 'Kyurem-Base', 'Samurott-Hisui', 'Scolipede-Base', 'Stunfisk-Galar', 'Vanilluxe',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] Conn',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Enamorus-Therian', 'Excadrill-Mega', 'Frillish', 'Galvantula', 'Kingambit', 'Sawk', 'Venipede', 'Victini',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] Brooks Y.',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Darmanitan-Base', 'Duosion', 'Hydreigon', 'Iron Crown', 'Landorus-Therian', 'Stoutland', 'Swanna', 'Virizion', 'Whirlipede',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] aedena',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Archeops', 'Chandelure-Mega', 'Ferrothorn', 'Gurdurr', 'Krookodile', 'Leavanny', 'Simipour', 'Zoroark-Hisui',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] Shhmur',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Bouffalant', 'Enamorus-Base', 'Excadrill-Base', 'Gigalith', 'Samurott-Base', 'Servine', 'Simisear', 'Tornadus-Therian',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] Shrewstorm',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Basculin-White-Striped', 'Golurk-Mega', 'Mienshao', 'Reuniclus', 'Simisage', 'Thundurus-Base', 'Volcarona', 'Zebstrika',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[IDE] Slinky',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Alomomola', 'Cryogonal', 'Garbodor', 'Haxorus', 'Joltik', 'Landorus-Therian', 'Lilligant-Base', 'Scrafty-Base',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] TRod63',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Basculegion-F', 'Carracosta', 'Landorus-Base', 'Scraggy', 'Servine', 'Stunfisk-Base', 'Volcarona', 'Whimsicott',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] aedena',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Basculegion-Base', 'Bisharp', 'Emboar-Mega', 'Emolga', 'Gurdurr', 'Landorus-Therian', 'Lilligant-Base', 'Swoobat',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] Dragapult',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Basculin-White-Striped', 'Boldore', 'Eelektross-Mega', 'Fraxure', 'Galvantula', 'Slither Wing', 'Swanna', 'Victini', 'Zoroark-Hisui',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] Masterriolu',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Basculin-Base', 'Basculin-Blue-Striped', 'Bouffalant', 'Excadrill-Mega', 'Ferroseed', 'Foongus', 'Kyurem-Base', 'Thundurus-Therian', 'Tornadus-Base',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] Blob',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Audino-Mega', 'Eelektross-Base', 'Enamorus-Therian', 'Golett', 'Gothitelle', 'Jellicent', 'Kingambit', 'Zoroark-Base',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] skye',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Chandelure-Base', 'Escavalier', 'Golurk-Mega', 'Mandibuzz', 'Mienshao', 'Reuniclus', 'Roggenrola', 'Zorua-Hisui',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] SupaJello',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Braviary-Base', 'Brute Bonnet', 'Chandelure-Mega', 'Conkeldurr', 'Larvesta', 'Liepard', 'Musharna', 'Simipour',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		name: '[ABS] Brooks Y.',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Standard Generations'],
		unbanlist: [
			'Amoonguss', 'Cobalion', 'Cofagrigus', 'Cottonee', 'Frillish', 'Purrloin', 'Scrafty-Mega', 'Thundurus-Base',
		],
		validateTeam: draftteams.validateTeam,
	},
	{
		section: 'Partner Communities',
		column: 1,
	},
	{
		name: '[Gen 9] Petpet Battle II',
		desc: 'Petpets',
		mod: 'petpet',
		ruleset: [
			'Standard', 'Terastal Clause',

			'#Bloop +acid +acidarmor +acidspray +acupressure +assurance +astonish +attract +barrage +bide +bittermalice +block +brutalswing +bubble +bubblebeam +captivate +chipaway +clearsmog +comeuppance +confide +confuseray +confusion +copycat +covet +craftyshield +curse +darkpulse +darkvoid +decorate +defensecurl +destinybond +dive +doodle +dreameater +embargo +encore +endeavor +entrainment +explosion +facade +faketears +falsesurrender +feint +feintattack +flatter +fling +followme +foulplay +frustration +gigadrain +glare +grudge +gunkshot +healblock +hex +hiddenpower +honeclaws +hornattack +hypnosis +imprison +lashout +leechlife +leer +lick +lunge +mefirst +meanlook +memento +mudbomb +mudshot +mudsport +mudslap +nastyplot +nightdaze +nightshade +obstruct +octazooka +painsplit +partingshot +payback +poltergeist +protect +punishment +pursuit +recover +recycle +rest +retaliate +return +round +scald +shadowball +shadowforce +shadowsneak +sludge +sludgebomb +sludgewave +snatch +soak +spite +substitute +supersonic +swagger +switcheroo +synchronoise +tarshot +taunt +thief +torment +toxic +toxicspikes +trick +trickroom +trickortreat +trumpcard +uproar +vacuumwave +venomdrench +venoshock +willowisp +wonderroom +workup',

			'#Yullie +agility +attract +bide +captivate +charge +chargebeam +charm +confide +confuseray +discharge +doubleteam +electricterrain +electrify +electroball +endure +facade +fakeout +feint +flail +flash +flashcannon +frustration +headbutt +hiddenpower +hyperfang +irontail +mefirst +minimize +nuzzle +paraboliccharge +playnice +playrough +protect +rest +return +risingvoltage +round +safeguard +shockwave +signalbeam +spark +stuffcheeks +substitute +tailglow +thunder +thunderfang +thundershock +thunderwave +thunderbolt +tickle +uturn +voltswitch +volttackle +wildcharge +wish +zapcannon',

			'#Spyder +agility +assurance +astonish +attract +bite +brutalswing +bugbite +captivate +chipaway +confide +confuseray +crosspoison +crunch +darkpulse +disable +electroweb +embargo +facade +falsesurrender +feint +feintattack +firstimpression +fling +foulplay +frustration +furycutter +glare +gunkshot +hex +hiddenpower +honeclaws +hyperfang +infestation +knockoff +leechlife +leer +lunge +meanlook +memento +nightshade +nightslash +partingshot +payback +poisonfang +poisonjab +poisonsting +pounce +protect +pursuit +rest +retaliate +return +round +scaryface +shadowclaw +shadowsneak +silktrap +skittersmack +smog +snatch +spiderweb +spite +stickyweb +stringshot +strugglebug +substitute +suckerpunch +swordsdance +taunt +thief +torment +toxic +toxicspikes +toxicthread +trickortreat +uturn +wrap +wringout +xscissor',

			'#Ukali +amnesia +ancientpower +aromatherapy +aromaticmist +attract +babydolleyes +breakingswipe +brutalswing +calmmind +captivate +chillingwater +chillyreception +clangoroussoul +coil +confide +confuseray +confusion +craftyshield +curse +darkpulse +defensecurl +defog +destinybond +disable +disarmingvoice +doomdesire +dracometeor +dragonbreath +dragonclaw +dragondance +dragonpulse +dragonrage +dragonrush +dragontail +dreameater +dualwingbeat +endeavor +endure +facade +faketears +ficklebeam +finalgambit +fireblast +flail +flamethrower +fly +frustration +gravity +gust +haze +healingwish +hex +hiddenpower +holdback +hyperbeam +lastresort +lightscreen +lunge +memento +mimic +mysticalfire +nightshade +nightmare +ominouswind +painsplit +perishsong +pound +protect +quash +rest +return +roar +roost +round +safeguard +shadowball +slam +sleeptalk +snore +splash +stompingtantrum +storedpower +substitute +synchronoise +takedown +tearfullook +torment +toxic +trickroom +twister +weatherball +whirlwind +wideguard +willowisp +wish +withdraw +workup +worryseed +yawn',

			'#Wuzzle +attract +beatup +bittermalice +blastburn +burnup +burningbulwark +burningjealousy +captivate +curse +darkpulse +disable +embargo +ember +facade +fireblast +firespin +flameburst +flamecharge +flamethrower +flareblitz +flash +foulplay +frustration +grudge +heatcrash +hex +hiddenpower +incinerate +inferno +lashout +leer +meanlook +memento +nastyplot +outrage +overheat +partingshot +payback +protect +rage +ragingfury +rest +return +revenge +round +ruination +selfdestruct +spite +substitute +sunnyday +taunt +temperflare +torment +uproar +willowisp',

			'#Kadoatie +agility +assist +assurance +attract +batonpass +bide +bite +bodyslam +burningjealousy +captivate +charm +confide +copycat +covet +cut +dig +doubleteam +doubleedge +echoedvoice +embargo +encore +endeavor +endure +facade +fakeout +faketears +falseswipe +feint +feintattack +flail +foulplay +frustration +furyswipes +gigaimpact +growl +headbutt +hiddenpower +honeclaws +hypervoice +irontail +knockoff +lashout +lastresort +metalclaw +mimic +nastyplot +nightslash +nightmare +painsplit +payday +payback +playrough +protect +punishment +pursuit +quickattack +rage +rest +retaliate +return +roar +roleplay +round +scratch +screech +secretpower +shadowclaw +sing +skullbash +slash +sleeptalk +snarl +snatch +snore +spite +substitute +swagger +swift +switcheroo +tailwhip +takedown +taunt +thief +torment +trailblaze +uproar +workup',

			'#Faellie +acrobatics +aerialace +agility +aircutter +airslash +alluringvoice +attract +babydolleyes +batonpass +bestow +bide +calmmind +captivate +charm +copycat +covet +dazzlinggleam +defog +disarmingvoice +dualwingbeat +encore +endeavor +endure +entrainment +facade +fairywind +fakeout +featherdance +flail +flash +fly +followme +frustration +furyswipes +growl +gust +headbutt +healbell +healpulse +healingwish +helpinghand +hiddenpower +hurricane +hyperbeam +hypervoice +knockoff +lastresort +lightscreen +luckychant +mefirst +move:metronome +mimic +mirrorcoat +mist +mistyterrain +moonblast +moonlight +mudslap +mysticalfire +naturalgift +naturepower +ominouswind +perishsong +playnice +playrough +pound +protect +quickattack +recover +recycle +reflect +refresh +rest +return +roost +round +safeguard +secretpower +simplebeam +sing +skillswap +skyattack +sleeptalk +splash +steelwing +substitute +sweetkiss +swift +synchronoise +tailwhip +tailwind +tickle +tidyup +uturn +weatherball +wish +workup',

			'#Rock +accelerock +rockblast +rockpolish +rockslide +rockthrow +rocktomb +rockwrecker +rollout +stealthrock +stoneedge',

			'#Ettaphant +acupressure +allyswitch +amnesia +assurance +astonish +attract +barrier +bellydrum +bide +bind +block +bodypress +bodyslam +brutalswing +bubblebeam +bulkup +captivate +chillingwater +coil +confuseray +confusion +copycat +counter +crushgrip +curse +destinybond +doublehit +doublekick +doubleslap +doubleteam +doubleedge +dreameater +dualchop +embargo +endeavor +expandingforce +facade +focusblast +frustration +futuresight +gigaimpact +gravity +headcharge +headbutt +healblock +heartswap +heavyslam +hiddenpower +highhorsepower +hornattack +hyperbeam +hypnosis +imprison +irondefense +knockoff +laserfocus +leer +lightscreen +luckychant +meanlook +meditate +memento +move:metronome +mysticalpower +nastyplot +ominouswind +outrage +pound +powertrick +powertrip +protect +psybeam +psychic +psychicnoise +psychicterrain +psychoboost +psychoshift +psyshock +psystrike +psywave +punishment +pursuit +quash +rage +ragingbull +reflect +rest +return +revenge +reversal +rocksmash +roleplay +round +scaryface +screech +seismictoss +signalbeam +skillswap +slam +sleeptalk +snore +speedswap +spitup +stockpile +stomp +storedpower +strength +substitute +superpower +swallow +synchronoise +tackle +takedown +taunt +thrash +topsyturvy +torment +triattack +trickroom +twinbeam +uproar +visegrip +wideguard +workup +wrap +wringout +yawn +zenheadbutt',

			'#Scado +absorb +acidspray +amnesia +ancientpower +aquajet +aromatherapy +attract +barrier +bide +brine +bubble +bubblebeam +calmmind +camouflage +captivate +chillingwater +chloroblast +confide +curse +disable +dive +drainingkiss +encore +energyball +facade +flail +flipturn +frenzyplant +frustration +gastroacid +gigadrain +grassknot +grasswhistle +grassyterrain +growth +headbutt +hiddenpower +hydropump +leafstorm +leafage +leechseed +magicalleaf +megadrain +mimic +mudbomb +mudshot +mudsport +mudslap +muddywater +naturalgift +naturepower +pound +protect +psychup +razorleaf +rest +return +round +safeguard +scald +solarbeam +spitup +splash +stockpile +substitute +surf +swallow +sweetkiss +sweetscent +synthesis +tailwhip +toxic +watergun +waterpulse +watersport +waterfall +wavecrash +weatherball +whirlpool +worryseed',

			'#Feepit +afteryou +agility +armthrust +attract +babydolleyes +bestow +bodyslam +brickbreak +bulkup +bulletpunch +captivate +charm +circlethrow +counter +covet +detect +dig +dizzypunch +doublehit +doubleslap +drainpunch +dualchop +dynamicpunch +endure +facade +fakeout +finalgambit +firepunch +flail +focusenergy +focuspunch +frustration +helpinghand +hiddenpower +icepunch +lastresort +lowkick +lowsweep +machpunch +playrough +poweruppunch +protect +quickattack +rest +return +revenge +round +scratch +sleeptalk +strength +substitute +superpower +swordsdance +thunderpunch +victorydance +wish +workup',

			'#Griefer +assurance +astonish +attract +beatup +block +bodyslam +bounce +bravebird +bulldoze +captivate +ceaselessedge +chipaway +confide +confuseray +curse +destinybond +drillpeck +drillrun +earthquake +embargo +facade +feint +feintattack +flashcannon +fling +foulplay +frustration +glare +grudge +hiddenpower +honeclaws +irondefense +ironhead +knockoff +lashout +magnetbomb +memento +mirrorshot +nastyplot +payback +powertrip +protect +pursuit +rest +return +round +screech +selfdestruct +shadowclaw +shadowsneak +snatch +spikes +spite +stealthrock +strength +substitute +taunt +thief +torment',

			'#Angelpuss +afteryou +alluringvoice +allyswitch +amnesia +aromaticmist +assist +attract +babydolleyes +batonpass +bide +bodyslam +calmmind +captivate +charm +confide +copycat +covet +craftyshield +curse +dazzlinggleam +disarmingvoice +doubleedge +drainingkiss +facade +fairywind +flash +frustration +headbutt +healbell +healpulse +healingwish +hiddenpower +hypervoice +icywind +imprison +lastresort +lovelykiss +luckychant +magiccoat +move:metronome +mimic +mirrorcoat +moonblast +moonlight +morningsun +naturalgift +naturepower +painsplit +playnice +protect +recover +reflect +refresh +rest +return +round +simplebeam +skillswap +sleeptalk +substitute +sweetkiss +teleport +toxic +trick +wish',

			'#Bython +acidspray +amnesia +astralbarrage +attract +aurasphere +bide +bind +bite +bodyslam +burningjealousy +captivate +coil +confusion +cosmicpower +crunch +curse +darkpulse +dazzlinggleam +destinybond +detect +doomdesire +doublehit +doubleteam +doubleedge +dragonbreath +dragonpulse +dragonrage +dragontail +earthpower +earthquake +energyball +expandingforce +extrasensory +facade +faketears +ficklebeam +flamethrower +flash +flashcannon +focusblast +frostbreath +frustration +geomancy +heartswap +hex +hiddenpower +irontail +memento +moonblast +moonlight +morningsun +mysticalfire +nightshade +outrage +poisonfang +poisontail +poltergeist +powertrick +powertrip +protect +psybeam +psychic +psychicfangs +psychoshift +psyshock +rest +return +round +shadowball +shadowsneak +skillswap +slam +snarl +substitute +trickroom +twinbeam +twineedle +vacuumwave +weatherball +workup +zenheadbutt',

			'#Snowbunny +agility +allyswitch +amnesia +aquaring +attract +aurorabeam +auroraveil +avalanche +babydolleyes +batonpass +bide +blizzard +bodyslam +bounce +calmmind +camouflage +captivate +charm +chillingwater +confuseray +confusion +cottonguard +covet +curse +cut +dazzlinggleam +defensecurl +dig +disable +doublekick +doubleedge +drainingkiss +drillrun +endeavor +endure +facade +flail +fling +foresight +freezedry +frostbreath +frustration +furyswipes +grassknot +gravity +gyroball +haze +headcharge +headbutt +healbell +healingwish +hiddenpower +honeclaws +hyperfang +iceball +icebeam +icefang +iceshard +icespinner +lastresort +lowkick +lunge +memento +metalclaw +mist +moonlight +mudslap +naturalgift +naturepower +painsplit +powdersnow +protect +quickattack +recycle +reflecttype +refresh +rest +retaliate +return +rollout +round +safeguard +sandattack +scratch +secretpower +shadowclaw +sheercold +slam +snowscape +stomp +stompingtantrum +storedpower +strength +substitute +superfang +tailwhip +tidyup +trailblaze +tripleaxel +wish +withdraw +workup +yawn +zenheadbutt',

			'#Meepit +assurance +astonish +attract +babydolleyes +beatup +bite +burningjealousy +captivate +charm +covet +crunch +curse +darkpulse +defensecurl +dig +disable +disarmingvoice +doubleedge +endure +facade +faketears +feint +feintattack +flail +followme +foulplay +frustration +glare +headbutt +hiddenpower +hypnosis +meanlook +move:metronome +nastyplot +playnice +playrough +populationbomb +pound +protect +pursuit +quickattack +rage +rest +retaliate +return +roleplay +round +scaryface +screech +slam +snarl +snatch +spite +stompingtantrum +storedpower +stuffcheeks +substitute +suckerpunch +swagger +sweetkiss +switcheroo +takedown +taunt +tearfullook +thief +thrash +tickle +torment +trick +uturn +uproar +wish +workup',

			'#Psimouse +acupressure +afteryou +allyswitch +amnesia +ancientpower +astonish +attract +aurasphere +aurorabeam +barrier +batonpass +bestow +blizzard +block +bubblebeam +calmmind +captivate +chillingwater +confide +confuseray +confusion +cosmicpower +curse +darkpulse +dazzlinggleam +destinybond +detect +disable +disarmingvoice +echoedvoice +eerieimpulse +eeriespell +embargo +encore +energyball +entrainment +expandingforce +extrasensory +facade +flash +flashcannon +flatter +focusblast +followme +foresight +frustration +futuresight +gravity +grudge +healbell +healblock +healpulse +healingwish +hex +hiddenpower +hyperbeam +hyperfang +hypervoice +icebeam +imprison +kinesis +laserfocus +lightscreen +luckychant +magiccoat +magicroom +magicalleaf +meditate +move:metronome +mimic +mindreader +miracleeye +mirrorcoat +moonblast +moonlight +mysticalfire +mysticalpower +nastyplot +nightshade +ominouswind +painsplit +partingshot +perishsong +playrough +powergem +powersplit +powerswap +powertrick +protect +psybeam +psychup +psychic +psychicnoise +psychicterrain +psychoshift +psyshock +psywave +quash +recycle +reflect +rest +return +round +safeguard +shadowball +shockwave +signalbeam +simplebeam +skillswap +speedswap +spiritbreak +spite +storedpower +substitute +supersonic +swift +synchronoise +telekinesis +teleport +terrainpulse +thunderbolt +topsyturvy +torment +toxic +triattack +trick +trickroom +waterpulse +weatherball +wonderroom +workup +zapcannon +zenheadbutt',
		],
		banlist: ['All Pokemon'],
		unbanlist: [
			'Bloop', 'Ettaphant', 'Faellie', 'Feepit', 'Griefer', 'Kadoatie', 'Meepit', 'Scado', 'Snowbunny', 'Spyder', 'Ukali', 'Wuzzle', 'Yullie',
			// 'Angelpuss', 'Bython', 'Psimouse', 'Rock',
		],
		onChangeSet(set, format, setHas, teamHas) {
			set.shiny = false;
		},
	},
	{
		name: '[Gen 9] ND VGC LC',
		desc: 'VGC with unevolved pokemon only.',
		mod: 'gen9',
		gameType: 'doubles',
		// bestOfDefault: true,
		ruleset: [
			'Standard Doubles', 'NatDex Mod', 'Picked Team Size = 4', 'Little Cup', '!! Max Level = 50', 'Z-Move Clause', 'Terastal Clause', '!Species Clause', 'Forme Clause', 'Item Clause = 1', 'Evasion Clause', 'VGC Timer', 'Limit One Restricted', 'Open Team Sheets',
		],
		restricted: [
			'Scyther', 'Tangela', 'Stantler', 'Sneasel-Hisui', 'Qwilfish-Hisui', 'Murkrow', 'Misdreavus', 'Gligar', 'Girafarig', 'Cottonee', 'Clamperl', 'Basculin-White-Striped', 'Sneasel', 'Corsola-Galar',
		],
		banlist: [
			'Duraludon', 'Type: Null',
			'Commander', 'Power Construct', 'Shadow Tag', 'Assist',
		],
	},
	{
		name: '[Gen 9] ND VGC LC (Bo3)',
		desc: 'VGC with unevolved pokemon only.',
		mod: 'gen9',
		gameType: 'doubles',
		// bestOfDefault: true,
		ruleset: [
			'Standard Doubles', 'NatDex Mod', 'Picked Team Size = 4', 'Little Cup', '!! Max Level = 50', 'Z-Move Clause', 'Terastal Clause', '!Species Clause', 'Forme Clause', 'Item Clause = 1', 'Evasion Clause', 'VGC Timer', 'Limit One Restricted', 'Open Team Sheets', 'Best Of = 3',
		],
		restricted: [
			'Scyther', 'Tangela', 'Stantler', 'Sneasel-Hisui', 'Qwilfish-Hisui', 'Murkrow', 'Misdreavus', 'Gligar', 'Girafarig', 'Cottonee', 'Clamperl', 'Basculin-White-Striped', 'Sneasel', 'Corsola-Galar',
		],
		banlist: [
			'Duraludon', 'Type: Null',
			'Commander', 'Power Construct', 'Shadow Tag', 'Assist',
		],
	},

	// endregion

	// region 35 Pokes Main

	{
		section: '35 Pokes 2026',
		column: 2,
	},
	{
		name: "[Gen 9] ND 35 Pokes [Oct 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Abomasnow-Base', 'Altaria-Base', 'Ampharos-Base', 'Appletun', 'Arboliva', 'Avalugg-Base', 'Brambleghast', 'Dewgong', 'Dusknoir', 'Eelektross', 'Florges', 'Gastrodon', 'Golem-Base', 'Granbull', 'Grumpig', 'Hariyama', 'Hitmontop', 'Honchkrow', 'Klefki', 'Luvdisc', 'Lycanroc-Base', 'Maushold', 'Mimikyu-Base', 'Morpeko-Base', 'Oinkologne-Base', 'Primeape', 'Raticate-Base', 'Spidops', 'Spiritomb', 'Sudowoodo', 'Swalot', 'Tatsugiri-Curly', 'Tatsugiri-Droopy', 'Tatsugiri-Stretchy', 'Thwackey', 'Trapinch', 'Wyrdeer',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Sep 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Araquanid-Base', /* 'Arcanine-Hisui', */ 'Archeops', 'Bellossom', 'Boltund', 'Escavalier', 'Farigiraf', 'Fezandipiti', 'Gothitelle', 'Gyarados-Base', 'Kabutops', 'Kilowattrel', 'Klawf', 'Magmortar', 'Mamoswine', 'Metagross-Base', 'Miltank', 'Oricorio-Base', 'Orthworm', 'Persian-Base', 'Pinsir-Base', 'Polteageist', 'Pyukumuku', 'Rotom-Mow', 'Scizor-Base', 'Shiftry', 'Simisear', 'Skarmory-Base', 'Slowbro-Galar', 'Slurpuff', 'Thievul', 'Torkoal', 'Toxtricity-Base', 'Turtonator', 'Tyranitar-Base', 'Wailord',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Aug 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Arcanine-Base', 'Arctozolt', 'Ariados', 'Bibarel', 'Ceruledge', 'Crabominable-Base', /* 'Crawdaunt', */ 'Cyclizar', 'Dachsbun', 'Decidueye-Base', 'Donphan', 'Dragalge-Base', 'Espeon', 'Exeggutor-Base', 'Feraligatr-Base', 'Gardevoir-Base', 'Garganacl', 'Glalie-Base', 'Grafaiai', 'Kecleon', 'Kingler', 'Mabosstiff', 'Mandibuzz', 'Munkidori', 'Obstagoon', 'Omastar', 'Parasect', 'Politoed', 'Swanna', 'Tentacruel', 'Trevenant', 'Ursaring', 'Vikavolt-Base', 'Wigglytuff', 'Wormadam-Trash', 'Yanmega',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jul 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Accelgor', 'Aggron-Base', 'Carbink', 'Carracosta', 'Clodsire', /* 'Cloyster', */ 'Emboar-Base', 'Florges', 'Heatmor', 'Heliolisk', 'Heracross-Base', 'Hydreigon', 'Illumise', 'Klinklang', 'Kricketune', 'Lanturn', 'Linoone-Base', 'Lucario-Base', 'Malamar-Base', 'Mawile-Base', 'Mismagius', 'Mothim', 'Nidoqueen', 'Purugly', 'Rampardos', 'Raticate-Base', 'Samurott-Base', 'Seaking', 'Seismitoad', 'Slowbro-Base', 'Sudowoodo', 'Tyrantrum', 'Vaporeon', 'Vileplume', 'Zangoose', 'Zebstrika',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jun 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Ampharos-Base', 'Arbok', 'Beheeyem', 'Bombirdier', 'Claydol', 'Cramorant-Base', 'Cursola', 'Dubwool', 'Flygon', 'Gastrodon', 'Hitmontop', 'Houndstone', 'Jumpluff', 'Ledian', 'Magmortar', 'Mesprit', 'Milotic', 'Okidogi', 'Pachirisu', 'Pincurchin', 'Probopass', 'Regice', 'Scrafty-Base', 'Seviper', 'Sharpedo-Base', 'Shiftry', 'Shiinotic', 'Sigilyph', 'Slowbro-Galar', 'Slurpuff', 'Swampert-Base', 'Torterra', 'Toxicroak', 'Virizion', 'Weezing-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [May 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Ambipom', 'Appletun', 'Azumarill', 'Banette-Base', 'Bellossom', 'Brambleghast', 'Bruxish', 'Delcatty', 'Donphan', 'Dragalge-Base', 'Drapion', 'Eiscue', 'Floatzel', 'Furfrou', 'Klefki', 'Leafeon', 'Lumineon', 'Malamar-Base', 'Mimikyu-Base', 'Morpeko', 'Ninetales-Base', 'Ninjask', 'Orthworm', 'Perrserker', 'Pyukumuku', 'Quagsire', 'Rabsca', 'Rapidash-Galar', 'Rhydon', 'Salazzle-Base', 'Sandslash-Base', 'Tatsugiri-Curly', 'Tatsugiri-Droopy', 'Tatsugiri-Stretchy', 'Wugtrio', 'Xatu', 'Zoroark-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Apr 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		banlist: ['Arena Trap'],
		unbanlist: [
			'Articuno-Base', 'Brute Bonnet', 'Cacturne', 'Clefable-Base', 'Cobalion', 'Drifblim', 'Dugtrio-Base', 'Gabite', 'Gogoat', 'Hariyama', /* 'Hawlucha-Base', */ 'Hippowdon', 'Krookodile', 'Lurantis-Base', 'Lycanroc-Base', 'Mabosstiff', 'Minior-Base', 'Munkidori', 'Passimian', 'Pawmot', 'Persian-Base', 'Raichu-Alola', 'Roserade', 'Rotom-Heat', 'Sandaconda', 'Sceptile-Base', /* 'Sigilyph', */ 'Stoutland', 'Stunfisk-Base', 'Tentacruel', 'Thwackey', 'Tinkaton', 'Toedscruel', 'Tsareena', 'Uxie', 'Vivillon', 'Whiscash',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Mar 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Aerodactyl-Base', 'Arctozolt', 'Armaldo', 'Armarouge', 'Bronzong', 'Centiskorch', 'Cherrim-Base', 'Cyclizar', 'Dhelmise', 'Dondozo', 'Drakloak', 'Empoleon', 'Glaceon', 'Golduck', 'Gyarados-Base', 'Jellicent', 'Jumpluff', 'Kecleon', 'Kilowattrel', 'Kingdra', 'Lunatone', 'Musharna', 'Noivern', 'Palossand', 'Pincurchin', 'Reuniclus', 'Revavroom', 'Sandslash-Alola', 'Snorlax', 'Solrock', 'Stonjourner', /* 'Tyranitar-Base', */ 'Vaporeon', 'Virizion', 'Wigglytuff', 'Wo-Chien',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Feb 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Articuno-Galar', 'Aurorus', 'Bellossom', 'Bewear', 'Blastoise-Base', 'Dodrio', 'Entei', 'Falinks-Base', 'Flygon', 'Furret', 'Goodra-Hisui', 'Gumshoos-Base', 'Heliolisk', 'Hydrapple', 'Indeedee-F', 'Iron Thorns', 'Leavanny', 'Lickilicky', 'Ludicolo', 'Maractus', 'Meganium-Base', 'Polteageist', 'Probopass', 'Regieleki', 'Rhyperior', 'Seismitoad', 'Shiinotic', 'Slaking', 'Spidops', 'Spiritomb', 'Unfezant', 'Vanilluxe', 'Victreebel-Base', 'Weezing-Galar', 'Wyrdeer',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jan 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Carracosta', 'Celebi', 'Cinccino', 'Cobalion', 'Cradily', 'Dedenne', 'Fezandipiti', 'Gabite', 'Granbull', 'Greedent', 'Hatterene', 'Heatmor', 'Houndstone', 'Indeedee-M', 'Lilligant-Base', 'Medicham-Base', 'Orbeetle', 'Oricorio-Pom-Pom', 'Overqwil', 'Pincurchin', 'Pinsir-Base', 'Rotom-Wash', 'Samurott-Base', 'Scovillain-Base', 'Sharpedo-Base', 'Shedinja', 'Shiftry', 'Steelix-Base', 'Tropius', 'Type: Null', 'Typhlosion-Hisui', 'Tyrantrum', 'Veluza', 'Vivillon', 'Whimsicott',
		],
	},
	{
		section: '35 Pokes 2025',
		column: 2,
	},
	{
		name: "[Gen 9] ND 35 Pokes [Dec 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Mamoswine', 'Oricorio-Baile', 'Galvantula', 'Bombirdier', 'Gothitelle', 'Drampa-Base', 'Perrserker', 'Glastrier', 'Klinklang', 'Walrein', 
			'Uxie', 'Vanilluxe', 'Serperior', 'Revavroom', 'Falinks-Base', 'Braviary-Hisui', 'Wyrdeer', 'Beedrill-Base', 'Blastoise-Base', 'Squawkabilly-Green', 
			'Swoobat', 'Lurantis-Base', 'Hypno', 'Scrafty-Base', 'Sinistcha', 'Cyclizar', 'Mothim', 'Mismagius', 'Goodra-Base', 'Mandibuzz', 'Delcatty', 
			'Skarmory-Base', 'Cherrim-Base', 'Centiskorch', 'Wishiwashi',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Nov 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Altaria-Base', 'Ampharos-Base', 'Arbok', 'Armaldo', 'Calyrex-Base', 'Castform-Base', 'Dewgong', 'Drifblim', 'Emolga', 'Fearow', 'Furret', 'Glalie-Base', 'Gumshoos-Base', 'Heliolisk', 'Jumpluff', 'Kecleon', 'Ludicolo', 'Lunatone', 'Luxray', 'Lycanroc-Midnight', 'Meowstic-M', 'Primeape', 'Pupitar', 'Pyroar-Base', 'Rampardos', 'Scovillain-Base', 'Silvally-Fairy', 'Simisage', 'Sneasel-Hisui', 'Spidops', 'Swalot', 'Thievul', 'Tinkaton', 'Whiscash', 'Zangoose',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Oct 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Ambipom', 'Armarouge', 'Articuno-Base', 'Basculegion-F', 'Bibarel', 'Copperajah', 'Corviknight', 'Crobat', 'Dudunsparce', 'Dugtrio-Alola', 'Farigiraf', 'Floatzel', 'Froslass-Base', 'Golem-Alola', 'Hippowdon', 'Magmortar', 'Meganium-Base', 'Moltres-Base', 'Muk-Alola', 'Munkidori', 'Nidoking', 'Ninjask', 'Orthworm', 'Perrserker', 'Porygon-Z', 'Pyukumuku', 'Sandslash-Base', 'Sigilyph', 'Simisear', 'Sirfetch’d', 'Steelix-Base', 'Tauros-Base', 'Tauros-Paldea-Aqua', 'Weezing-Galar', 'Zoroark-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Sep 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Arbok', 'Avalugg-Base', 'Cacturne', 'Chesnaught-Base', 'Clodsire', 'Cobalion', 'Crawdaunt', 'Eldegoss', 'Empoleon', 'Falinks-Base', 'Feraligatr-Base', 'Ferrothorn', 'Florges', 'Galvantula', 'Grimmsnarl', 'Klawf', 'Lucario-Base', 'Ludicolo', 'Mantine', 'Marowak-Alola', 'Milotic', 'Musharna', 'Overqwil', 'Pincurchin', 'Primeape', 'Regice', 'Sceptile-Base', 'Scolipede-Base', 'Silvally-Dragon', 'Slurpuff', 'Torterra', 'Toxicroak', 'Trapinch', 'Vikavolt-Base', 'Wormadam-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Aug 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Amoonguss', 'Arcanine-Base', 'Basculegion-F', 'Beartic', 'Brambleghast', 'Chandelure-Base', 'Chesnaught-Base', 'Cobalion', 'Copperajah', 'Cramorant-Base', 'Cursola', 'Dugtrio-Base', 'Eldegoss', 'Flygon', 'Froslass-Base', 'Frosmoth', 'Gabite', 'Gardevoir-Base', 'Hatterene', 'Heliolisk', 'Incineroar', 'Jolteon', 'Liepard', 'Maractus', 'Maushold', 'Oricorio-Pom-Pom', 'Overqwil', 'Shedinja', 'Stoutland', 'Sylveon', 'Scizor-Base', 'Toxicroak', 'Uxie', 'Weavile', 'Yanmega',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jul 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Arctovish', 'Azumarill', 'Blastoise-Base', 'Boltund', 'Bouffalant', 'Brambleghast', 'Braviary-Base', 'Chimecho-Base', 'Cofagrigus', 'Dachsbun', 'Darmanitan-Base', 'Delibird', 'Drakloak', 'Feraligatr-Base', 'Floatzel', 'Flygon', 'Grapploct', 'Incineroar', 'Kleavor', 'Lunatone', 'Mabosstiff', 'Marowak-Alola', 'Meowstic-F', 'Minun', 'Obstagoon', 'Persian-Alola', 'Primeape', 'Rapidash-Base', 'Raticate-Base', 'Reuniclus', 'Rotom-Mow', 'Sandaconda', 'Silvally-Ground', 'Simisage', 'Slowbro-Galar', 'Slowking-Base', 'Slowking-Galar', 'Starmie-Base', 'Tentacruel', 'Toedscruel',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jun 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Arbok', 'Archeops', 'Arctozolt', 'Bruxish', 'Calyrex-Base', 'Ditto', 'Drakloak', 'Dugtrio-Alola', 'Electrode-Base',
			'Escavalier', 'Espeon', 'Furfrou', 'Glimmora-Base', 'Grapploct', 'Honchkrow', 'Klawf', 'Lunatone', 'Luvdisc',
			'Masquerain', 'Mienshao', 'Mimikyu-Base', 'Orbeetle', 'Primeape', 'Purugly', 'Quaquaval', 'Rabsca', 'Simipour',
			'Simisage', 'Slowking-Base', 'Slowking-Galar', 'Smeargle', 'Tangrowth', 'Toedscruel', 'Tyranitar-Base', 'Uxie',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [May 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Inteleon', 'Dragonair', 'Vivillon', 'Heatmor', 'Cinccino', 'Lopunny-Base', 'Politoed', 'Skarmory-Base', 'Maushold',
			'Nidoking', 'Jumpluff', 'Ribombee-Base', 'Mudsdale', 'Drednaw', 'Meganium-Base', 'Kecleon', 'Barraskewda', 'Goodra-Base',
			'Carbink', 'Raichu-Base', 'Honchkrow', 'Venusaur-Base', 'Cofagrigus', 'Lokix', 'Frosmoth', 'Pinsir-Base', 'Empoleon',
			'Shiinotic', 'Hitmontop', 'Claydol', 'Tangrowth', 'Swoobat', 'Swellow', 'Mienshao', 'Ninetales-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Apr 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Kingdra', 'Crustle', 'Corsola-Base', 'Dipplin', 'Dusknoir', 'Drampa-Base', 'Pincurchin', 'Type: Null', 'Camerupt-Base',
			'Rotom-Base', 'Raticate-Base', 'Bombirdier', 'Cradily', 'Beedrill-Base', 'Gastrodon', 'Donphan', 'Chimecho-Base', 'Coalossal',
			'Dustox', 'Dedenne', 'Kecleon', 'Flareon', 'Cyclizar', 'Grumpig', 'Tentacruel', 'Miltank', 'Arcanine-Base',
			'Shelgon', 'Spinda', 'Wormadam-Sandy', 'Exploud', 'Marowak-Base', 'Hypno', 'Furret', 'Bastiodon',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Mar 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Gourgeist-Small', 'Kingler', 'Rapidash-Base', 'Accelgor', 'Ariados', 'Magcargo', 'Sudowoodo', 'Qwilfish-Base', 'Eldegoss',
			'Stunfisk-Base', 'Raichu-Base', 'Klawf', 'Scolipede-Base', 'Gabite', 'Jynx', 'Linoone-Base', 'Unfezant', 'Revavroom',
			'Appletun', 'Kabutops', 'Wyrdeer', 'Charizard-Base', 'Grafaiai', 'Golem-Base', 'Medicham-Base', 'Thievul', 'Lucario-Base',
			'Mantine', 'Wormadam-Trash', 'Morpeko-Base', 'Drifblim', 'Granbull', 'Swalot', 'Aggron-Base', 'Luxray',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Feb 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Rapidash-Galar', 'Whiscash', 'Scrafty-Base', 'Uxie', 'Arbok', 'Zangoose', 'Carnivine', 'Persian-Alola', 'Emolga',
			'Araquanid-Base', 'Pincurchin', 'Hitmonchan', 'Maractus', 'Dewgong', 'Spinda', 'Breloom', 'Parasect', 'Sigilyph',
			'Ambipom', 'Zygarde-10%', 'Tauros-Base', 'Glalie-Base', 'Golduck', 'Pangoro', 'Weezing-Base', 'Zweilous', 'Pinsir-Base',
			'Musharna', 'Cacturne', 'Regigigas', 'Arctozolt', 'Bewear', 'Kecleon', 'Alcremie', 'Togedemaru-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jan 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Clodsire', 'Comfey', 'Probopass', 'Bellibolt', 'Wugtrio', 'Unown', 'Shiftry', 'Swanna', 'Houndoom-Base',
			'Oricorio-Pom-Pom', 'Cursola', 'Slowbro-Base', 'Goodra-Base', 'Torkoal', 'Shaymin-Base', 'Infernape', 'Mesprit', 'Alcremie',
			'Golurk-Base', 'Dachsbun', 'Vileplume', 'Scyther', 'Donphan', 'Toedscruel', 'Sawsbuck', 'Reuniclus', 'Spiritomb',
			'Type: Null', 'Virizion', 'Absol-Base', 'Flapple', 'Crawdaunt', 'Kecleon', 'Jynx', 'Kingdra',
		],
	},
	{
		section: '35 Pokes 2024',
		column: 2,
	},
	{
		name: "[Gen 9] ND 35 Pokes [Dec 2024 AG]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!35 Pokes Mega Clause'],
		unbanlist: [
			'Shed Tail',
			'Golem-Alola', 'Zoroark-Base', 'Pyukumuku', 'Guzzlord', 'Wugtrio', 'Garbodor', 'Aurorus', 'Morpeko-Base', 'Walrein',
			'Roserade', 'Ribombee-Base', 'Carracosta', 'Perrserker', 'Cryogonal', 'Appletun', 'Primarina', 'Pachirisu', 'Banette-Base',
			'Celebi', 'Avalugg-Base', 'Wo-Chien', 'Pupitar', 'Cetitan', 'Milotic', 'Scovillain-Base', 'Dipplin', 'Chandelure-Base',
			'Toxicroak', 'Magmortar', 'Yanmega', 'Cacturne', 'Luvdisc', 'Mawile-Base', 'Jumpluff', 'Rotom-Frost',
			'Jolteon', 'Lokix', 'Okidogi', 'Banette-Mega', 'Mawile-Mega',
			'Bug Gem', 'Dark Gem', 'Dragon Gem', 'Electric Gem', 'Fairy Gem', 'Fighting Gem', 'Fire Gem', 'Flying Gem', 'Ghost Gem',
			'Grass Gem', 'Ground Gem', 'Ice Gem', 'Poison Gem', 'Psychic Gem', 'Rock Gem', 'Steel Gem', 'Water Gem',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Dec 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Golem-Alola', 'Zoroark-Base', 'Pyukumuku', 'Guzzlord', 'Wugtrio', 'Garbodor', 'Aurorus', 'Morpeko-Base', 'Walrein',
			'Roserade', 'Ribombee-Base', 'Carracosta', 'Perrserker', 'Cryogonal', 'Appletun', 'Primarina', 'Pachirisu', 'Banette-Base',
			'Celebi', 'Avalugg-Base', 'Wo-Chien', 'Pupitar', 'Cetitan', 'Milotic', 'Scovillain-Base', 'Dipplin', 'Chandelure-Base',
			'Toxicroak', 'Magmortar', 'Yanmega', 'Cacturne', 'Luvdisc', 'Mawile-Base', 'Jumpluff', 'Rotom-Frost',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Nov 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Wishiwashi-Base', 'Ampharos-Base', 'Tsareena', 'Glaceon', 'Centiskorch', 'Frosmoth', 'Exeggutor-Base', 'Shelgon', 'Granbull',
			'Guzzlord', 'Reuniclus', 'Spiritomb', 'Unown', 'Shedinja', 'Lurantis-Base', 'Gabite', 'Gourgeist-Base', 'Ledian',
			'Golduck', 'Qwilfish-Base', 'Pinsir-Base', 'Gumshoos-Base', 'Wigglytuff', 'Arbok', 'Dusknoir', 'Araquanid-Base', 'Kecleon',
			'Exeggutor-Alola', 'Trapinch', 'Appletun', 'Turtonator', 'Drampa-Base', 'Gorebyss', 'Gourgeist-Super', 'Galvantula',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Oct 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Ninjask', 'Perrserker', 'Klinklang', 'Snorlax', 'Houndstone', 'Amoonguss', 'Seviper', 'Rhydon', 'Vigoroth',
			'Bellossom', 'Sandaconda', 'Samurott-Base', 'Honchkrow', 'Scyther', 'Clawitzer', 'Bisharp', 'Sinistcha-Base', 'Guzzlord',
			'Porygon-Z', 'Sylveon', 'Sudowoodo', 'Vikavolt-Base', 'Noivern', 'Blastoise-Base', 'Dudunsparce', 'Dugtrio-Alola', 'Gengar-Base',
			'Emboar-Base', 'Munkidori', 'Zoroark-Hisui', 'Stoutland', 'Accelgor', 'Stunfisk-Base', 'Magmortar', 'Doublade',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Sep 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Starmie-Base', 'Muk-Alola', 'Krookodile', 'Slowking-Galar', 'Gabite', 'Florges', 'Bellibolt', 'Rotom-Fan', 'Beartic',
			'Hatterene', 'Fearow', 'Simisage', 'Pyroar-Base', 'Politoed', 'Mudsdale', 'Manectric-Base', 'Rhydon', 'Simisear',
			'Basculin-White-Striped', 'Swalot', 'Wyrdeer', 'Klawf', 'Flareon', 'Wugtrio', 'Glimmora-Base', 'Clodsire', 'Armaldo',
			'Togedemaru-Base', 'Toxicroak', 'Arctibax', 'Komala', 'Spidops', 'Sandslash-Alola', 'Dustox', 'Accelgor',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Aug 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Mandibuzz', 'Braviary-Base', 'Dusclops', 'Sawk', 'Corsola-Base', 'Maushold-Base', 'Vivillon', 'Runerigus', 'Chesnaught-Base',
			'Rotom-Heat', 'Dhelmise', 'Illumise', 'Seviper', 'Boltund', 'Braviary-Hisui', 'Mamoswine', 'Charizard-Base', 'Smeargle',
			'Donphan', 'Musharna', 'Muk-Alola', 'Frosmoth', 'Sableye-Base', 'Blissey', 'Heracross-Base', 'Eelektross-Base', 'Trapinch',
			'Fezandipiti', 'Golem-Alola', 'Lanturn', 'Quagsire', 'Squawkabilly-Yellow', 'Cradily', 'Scizor-Base', 'Vanilluxe',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jul 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Venusaur-Base', 'Shiftry', 'Mabosstiff', 'Donphan', 'Rotom-Heat', 'Garbodor', 'Blastoise-Base', 'Oricorio-Pom-Pom', 'Tinkaton',
			'Lilligant-Base', 'Claydol', 'Brambleghast', 'Noctowl', 'Aggron-Base', 'Rapidash-Galar', 'Muk-Base', 'Rampardos', 'Houndoom-Base',
			'Masquerain', 'Dachsbun', 'Cloyster', 'Rotom-Mow', 'Flareon', 'Eiscue-Base', 'Hitmontop', 'Charizard-Base', 'Primeape',
			'Shedinja', 'Pawmot', 'Goodra-Base', 'Mantine', 'Furret', 'Slurpuff', 'Torterra', 'Scrafty-Base', 'Yanmega',
			'Mamoswine', 'Dondozo', 'Porygon2', 'Kingdra', 'Chesnaught-Base', 'Ferrothorn', 'Zebstrika', 'Regice',
			'Slowking-Base', 'Klawf', 'Trapinch',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jun 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Mimikyu-Base', 'Cacturne', 'Mabosstiff', 'Cyclizar', 'Raticate-Alola', 'Wyrdeer', 'Pincurchin', 'Slowbro-Galar', 'Arboliva',
			'Heliolisk', 'Trapinch', 'Runerigus', 'Gabite', 'Illumise', 'Probopass', 'Banette-Base', 'Exeggutor-Base', 'Registeel',
			'Squawkabilly-Base', 'Delphox-Base', 'Spidops', 'Indeedee-M', 'Scyther', 'Fearow', 'Magcargo', 'Walrein', 'Crabominable-Base',
			'Toxicroak', 'Bellibolt', 'Rotom-Wash', 'Avalugg-Base', 'Raichu-Alola', 'Sirfetch’d', 'Talonflame', 'Kricketune',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [May 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Carbink', 'Mantine', 'Dusknoir', 'Cryogonal', 'Milotic', 'Mr. Mime-Base', 'Hitmonchan', 'Shiinotic', 'Beheeyem',
			'Drampa-Base', 'Oinkologne-F', 'Dustox', 'Sunflora', 'Raichu-Alola', 'Meowstic-Base', 'Dachsbun', 'Calyrex-Base', 'Arbok',
			'Octillery', 'Maushold-Base', 'Grafaiai', 'Torkoal', 'Miltank', 'Froslass-Base', 'Ariados', 'Sableye-Base', 'Cherrim-Base',
			'Simisear', 'Salazzle-Base', 'Zoroark-Base', 'Emolga', 'Wobbuffet', 'Klawf', 'Delcatty', 'Drakloak',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Apr 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Lokix', 'Sandslash-Alola', 'Altaria-Base', 'Gengar-Base', 'Drampa-Base', 'Dugtrio-Alola', 'Stoutland', 'Golisopod-Base', 'Abomasnow-Base',
			'Frosmoth', 'Fezandipiti', 'Golduck', 'Vespiquen', 'Decidueye-Base', 'Charizard-Base', 'Hippowdon', 'Rabsca', 'Coalossal',
			'Houndstone', 'Leafeon', 'Glaceon', 'Slowking-Base', 'Manectric-Base', 'Alomomola', 'Accelgor', 'Mismagius', 'Dachsbun',
			'Tentacruel', 'Sandslash-Base', 'Tinkaton', 'Roserade', 'Sableye-Base', 'Palossand', 'Cobalion', 'Garbodor',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Mar 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Oricorio-Base', 'Wigglytuff', 'Phione', 'Politoed', 'Ninjask', 'Samurott-Base', 'Galvantula', 'Mesprit', 'Scrafty-Base',
			'Rotom-Fan', 'Greedent', 'Seaking', 'Swampert-Base', 'Weezing-Galar', 'Shelgon', 'Leafeon', 'Cacturne', 'Turtonator',
			'Magmortar', 'Lilligant-Base', 'Sirfetch’d', 'Oricorio-Sensu', 'Persian-Alola', 'Farigiraf', 'Pinsir-Base', 'Primeape', 'Tatsugiri-Base',
			'Dugtrio-Alola', 'Flygon', 'Regice', 'Ditto', 'Grafaiai', 'Pidgeot-Base', 'Palossand', 'Ribombee-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Feb 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Tauros-Paldea-Blaze', 'Ceruledge', 'Klinklang', 'Houndstone', 'Gothitelle', 'Snorlax', 'Sandslash-Base', 'Morpeko-Base', 'Sawk',
			'Nidoqueen', 'Lickilicky', 'Shiftry', 'Vanilluxe', 'Jynx', 'Wormadam-Trash', 'Vigoroth', 'Mr. Rime', 'Skarmory-Base',
			'Tyrantrum', 'Aromatisse', 'Primarina', 'Golem-Alola', 'Maushold-Base', 'Pangoro', 'Malamar-Base', 'Clodsire', 'Klawf',
			'Meganium-Base', 'Quagsire', 'Toxicroak', 'Wugtrio', 'Walrein', 'Raichu-Base', 'Serperior', 'Zebstrika',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jan 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Hatterene', 'Drakloak', 'Luvdisc', 'Tangrowth', 'Snorlax', 'Starmie-Base', 'Ursaring', 'Appletun', 'Stoutland',
			'Musharna', 'Chatot', 'Masquerain', 'Gorebyss', 'Kecleon', 'Avalugg-Hisui', 'Rhyperior', 'Beedrill-Base', 'Meowstic-F',
			'Probopass', 'Dewgong', 'Braviary-Base', 'Houndoom-Base', 'Gothitelle', 'Crobat', 'Tentacruel', 'Eldegoss', 'Seaking',
			'Lapras', 'Ferrothorn', 'Dubwool', 'Araquanid-Base', 'Yanmega', 'Dudunsparce', 'Slowking-Base', 'Lucario-Base',
		],
	},
	{
		section: '35 Pokes 2023',
		column: 2,
	},
	{
		name: "[Gen 9] ND 35 Pokes [Dec 2023]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Mabosstiff', 'Eelektross-Base', 'Camerupt-Base', 'Grapploct', 'Drifblim', 'Ampharos-Base', 'Lurantis-Base', 'Gyarados-Base', 'Hypno',
			'Druddigon', 'Durant', 'Chesnaught-Base', 'Gastrodon', 'Eldegoss', 'Pelipper', 'Dodrio', 'Wailord', 'Emolga',
			'Dachsbun', 'Drampa-Base', 'Trevenant', 'Passimian', 'Beautifly', 'Tyranitar-Base', 'Regirock', 'Stunfisk-Galar', 'Morpeko-Base',
			'Jumpluff', 'Heatmor', 'Froslass-Base', 'Audino-Base', 'Cetitan', 'Pincurchin', 'Cradily', 'Ninetales-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Nov 2023]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Copperajah', 'Dhelmise', 'Mudsdale', 'Veluza', 'Bellossom', 'Tropius', 'Cramorant-Base', 'Jellicent', 'Boltund',
			'Scolipede-Base', 'Typhlosion-Base', 'Klefki', 'Metagross-Base', 'Swoobat', 'Honchkrow', 'Cursola', 'Revavroom', 'Swampert-Base',
			'Garbodor', 'Electivire', 'Slurpuff', 'Jynx', 'Bombirdier', 'Mismagius', 'Wyrdeer', 'Lanturn', 'Carnivine',
			'Kangaskhan-Base', 'Bellibolt', 'Kingdra', 'Perrserker', 'Steelix-Base', 'Alcremie', 'Heliolisk', 'Beartic',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Oct 2023 B]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Liepard', 'Dragalge-Base', 'Clefable-Base', 'Clodsire', 'Gigalith', 'Cacturne', 'Porygon2', 'Shuckle', 'Emboar-Base',
			'Doublade', 'Phione', 'Lumineon', 'Toucannon', 'Mandibuzz', 'Cinccino', 'Avalugg-Hisui', 'Sceptile-Base', 'Toedscruel',
			'Hitmontop', 'Golem-Alola', 'Dugtrio-Base', 'Mr. Rime', 'Ariados', 'Pachirisu', 'Ambipom', 'Volbeat', 'Centiskorch',
			'Shiinotic', 'Poliwrath', 'Stoutland', 'Banette-Base', 'Aurorus', 'Mawile-Base', 'Sableye-Base', 'Orthworm',
			'Rotom-Mow', 'Sandslash-Alola', 'Toxicroak', 'Roserade', 'Lopunny-Base', 'Luxray', 'Solrock', 'Cryogonal', 'Noctowl',
			// 'Xatu', banned
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Oct 2023]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Liepard', 'Dragalge-Base', 'Clefable-Base', 'Clodsire', 'Gigalith', 'Cacturne', 'Porygon2', 'Mimikyu-Base', 'Scovillain-Base',
			'Lycanroc-Base', 'Jolteon', 'Bisharp', 'Togekiss', 'Starmie-Base', 'Shuckle', 'Emboar-Base', 'Doublade', 'Phione',
			'Lumineon', 'Toucannon', 'Mandibuzz', 'Rotom-Base', 'Falinks-Base', 'Magnezone', 'Dondozo', 'Brambleghast', 'Goodra-Base',
			'Articuno-Base', 'Cinccino', 'Avalugg-Hisui', 'Sceptile-Base', 'Toedscruel', 'Hitmontop', 'Golem-Alola', 'Dugtrio-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Sep 2023]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Zoroark-Hisui', 'Yanmega', 'Mothim', 'Rapidash-Galar', 'Drapion', 'Chimecho-Base', 'Espeon', 'Vaporeon', 'Mamoswine',
			'Vespiquen', 'Barbaracle-Base', 'Shedinja', 'Alakazam-Base', 'Glaceon', 'Staraptor-Base', 'Electrode-Hisui', 'Lickilicky', 'Whiscash',
			'Cherrim-Base', 'Armaldo', 'Slowking-Base', 'Kingler', 'Dudunsparce', 'Watchog', 'Flygon', 'Granbull', 'Decidueye-Base',
			'Flareon', 'Bronzong', 'Rampardos', 'Fearow', 'Relicanth', 'Hitmonlee', 'Altaria-Base', 'Tinkaton',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Aug 2023]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Vileplume', 'Swanna', 'Yanmega', 'Heracross-Base', 'Nidoking', 'Leafeon', 'Kricketune', 'Swellow', 'Comfey',
			'Bibarel', 'Empoleon', 'Ludicolo', 'Tangrowth', 'Simisear', 'Parasect', 'Krookodile', 'Eelektross-Base', 'Abomasnow-Base',
			'Avalugg-Base', 'Bastiodon', 'Dusclops', 'Minior-Base', 'Masquerain', 'Victreebel-Base', 'Rabsca', 'Linoone-Base', 'Omastar',
			'Politoed', 'Ledian', 'Donphan', 'Magcargo', 'Bombirdier', 'Dedenne', 'Butterfree', 'Jynx',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes [Jul 2023]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Shed Tail',
			'Leavanny', 'Masquerain', 'Eiscue-Base', 'Torterra', 'Dragonair', 'Runerigus', 'Swalot', 'Muk-Alola', 'Musharna',
			'Hippowdon', 'Alomomola', 'Aggron-Base', 'Umbreon', 'Galvantula', 'Pawmot', 'Quagsire', 'Slurpuff', 'Sigilyph',
			'Vaporeon', 'Blastoise-Base', 'Aegislash-Base', 'Scizor-Base', 'Spiritomb', 'Golisopod-Base', 'Clawitzer', 'Ninetales-Base', 'Delphox-Base',
			'Typhlosion-Base', 'Marowak-Base', 'Porygon-Z', 'Jumpluff', 'Absol-Base', 'Porygon2', 'Rotom-Frost', 'Rotom-Mow',
		],
	},

	// endregion

	// region 35 Pokes Side

	{
		section: '35 Pokes Randomized',
		column: 3
	},
	{
		name: "[Gen 9] 35 Factory",
		desc: `Randomized teams of Pok&eacute;mon for a generated 35 Pokes tier with sets that are competitively viable.`,
		mod: 'gen9',
		team: 'random35Factory',
		ruleset: ['Standard NatDex', '!Obtainable Formes', '!Species Clause', 'Forme Clause', '!Evasion Clause', 'Terastal Clause'],
		onBegin() {
			this.add(`raw|<div class="broadcast-blue"><b>35 Factory Tier: ${this.teamGenerator.factoryTier}</b></div>`);
		},
	},

	// region 35 Perfect

	{
		section: '35 Pokes Perfect',
		column: 3
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [A1]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		banlist: [
			'Silvally > 1', 'Light Clay',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z',
		],
		unbanlist: [
			'Booster Energy',
			'Kangaskhan-Base', 'Wigglytuff', 'Komala', 'Haunter', 'Golurk-Base', 'Cofagrigus', 'Glalie-Base', 'Mr. Rime', 'Kadabra', 'Medicham-Base', 'Hitmonchan', 'Poliwrath', 'Simipour', 'Mantine', 'Silvally-Flying', 'Archeops', 'Klawf', 'Aurorus', 'Mawile-Base', 'Togedemaru-Base', 'Electrode-Base', 'Vikavolt-Base', 'Pinsir-Base', 'Wormadam-Trash', 'Simisage', 'Shiinotic', 'Victreebel-Base', 'Skuntank', 'Silvally-Dark', 'Guzzlord', 'Silvally-Dragon', 'Turtonator', 'Simisear', 'Camerupt-Base', 'Sandslash-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [A2]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		banlist: [
			'Silvally > 1', 'Light Clay',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z',
		],
		unbanlist: [
			'Booster Energy',
			'Cacturne', 'Seviper', 'Komala', 'Leafeon', 'Copperajah', 'Rotom-Fan', 'Armaldo', 'Mr. Rime', 'Cryogonal', 'Medicham-Base', 'Silvally-Psychic', 'Silvally-Fighting', 'Toxicroak', 'Mantine', 'Purugly', 'Archeops', 'Toucannon', 'Aurorus', 'Mawile-Base', 'Togedemaru-Base', 'Frogadier', 'Vikavolt-Base', 'Pinsir-Base', 'Wugtrio', 'Dragonair', 'Shiinotic', 'Dusknoir', 'Skuntank', 'Silvally-Dark', 'Runerigus', 'Misdreavus', 'Turtonator', 'Rapidash-Base', 'Camerupt-Base', 'Sandslash-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [A3]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		banlist: [
			'Silvally > 1', 'Light Clay', 'Silvally-Steel + Swords Dance', 'Silvally-Fairy + Swords Dance', 'Shell Smash',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z',
		],
		unbanlist: [
			'Booster Energy',
			'Archeops', 'Aromatisse', 'Aurorus', 'Braviary-Base', 'Cacturne', 'Centiskorch', 'Copperajah', 'Donphan', 'Drampa-Base', 'Dusknoir', 'Eelektross-Base', 'Escavalier', 'Forretress', 'Gurdurr', 'Guzzlord', 'Hitmonchan', 'Kadabra', 'Kangaskhan-Base', 'Mantine', 'Mesprit', 'Mismagius', 'Mr. Rime', 'Passimian', 'Rapidash-Base', 'Rhydon', 'Roserade', 'Rotom-Fan', 'Runerigus', 'Samurott-Base', 'Silvally-Fairy', 'Silvally-Poison', 'Silvally-Steel', 'Skuntank', 'Tentacruel', 'Tsareena', 'Turtonator', 'Vikavolt-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [A4]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', 'No Freeze Mod'],
		banlist: [
			'Silvally > 1', 'Light Clay', 'Shell Smash', 'Belly Drum', 'Diamond Storm',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z',
		],
		unbanlist: [
			'Booster Energy',
			'Aerodactyl-Base', 'Cacturne', 'Cloyster', 'Copperajah', 'Crobat', 'Dhelmise', 'Diancie-Base', 'Donphan', 'Drampa-Base', 'Drapion', 'Druddigon', 'Duraludon', 'Empoleon', 'Farigiraf', 'Florges', 'Gastrodon', 'Glastrier', 'Hariyama', 'Hitmontop', 'Jellicent', 'Jolteon', 'Mandibuzz', 'Mesprit', 'Mismagius', 'Rapidash-Base', 'Regigigas', 'Roserade', 'Runerigus', 'Shaymin-Base', 'Silvally-Ghost', 'Silvally-Grass', 'Silvally-Ground', 'Sneasel-Base', 'Stakataka', 'Talonflame', 'Tentacruel', 'Toxicroak',
		],
	},
	{
		name: "[Gen 3] 35 Pokes Perfect [B1]",
		mod: 'perfectb1',
		validatorMod: 'gen9',
		ruleset: [
			// from Custom Game
			'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',
			// from 35 Pokes / Natdex
			'Obtainable', '+Unobtainable', '+Past', 'Sketch Post-Gen 7 Moves', 'Nickname Clause', 'OHKO Clause', 'Evasion Clause',
			'Sleep Clause Mod', 'Forme Clause',
			// B1 specific
			'One Boost Passer Clause',

			'#empoleon+sandstream+anchorshot',
			'#articuno+snowwarning+batonpass',
			'#electivire+encore',
			'#rapidash+regenerator+rapidspin',
			'#klinklang+superpower',
			'#farigiraf+toughclaws+firefang',
			'#seismitoad+bulkup+roar',
			'#raichualola+swiftswim',
			'#noivern+haze+pursuit',
			'#altaria+saltcure+wish',
			'#claydol+scrappy+rapidspin',
			'#armaldo+unaware+spikes',
			'#escavalier+speedswap',
			'#uxie+whirlwind',
			'#glalie+angershell',
			'#centiskorch+firstimpression+stoneedge',
			'#rotom+hydropump+overheat',
			'#decidueye+sharpness',
			'#spiritomb+cursedbody+recover',
			'#charizard+dragonsmaw+aeroblast',
			'#chesnaught+lingeringaroma',
			'#weezing+bodypress',
			'#wochien+pursuit',
			'#lickilicky+slackoff',
			'#scrafty+rapidspin',
			'#seviper+icescales+pursuit',
			'#bouffalant+guts+quickattack',
			'#nihilego+solarpower+hydrosteam+sunnyday',
			'#persianalola+ceaselessedge',
			'#probopass+levitate+spikes',
			'#donphan+rockypayload+closecombat',
			'#vespiquen+magicguard+bravebird',
			'#meganium+fireblast+takeheart',
			'#hakamoo+swordofruin',
			'#lapras+filter+rapidspin',
		],
		banlist: [
			'ND Uber', 'ND AG', 'ND OU', 'ND UUBL', 'ND UU', 'ND RUBL', 'ND RU', 'ND NFE', 'ND LC',
			'Stealth Rock', 'U-Turn', 'Volt Switch', 'Flip Turn', 'Teleport', 'Choice Scarf', 'Heavy-Duty Boots', 'Defog', 'Electric Terrain', 'Psychic Terrain', 'Misty Terrain', 'Grassy Terrain',
		],
		unbanlist: [
			'Empoleon', 'Articuno-Base', 'Electivire', 'Rapidash-Base', 'Klinklang', 'Farigiraf', 'Seismitoad', 'Raichu-Alola', 'Noivern', 'Altaria-Base', 'Claydol', 'Armaldo', 'Escavalier', 'Uxie', 'Glalie-Base', 'Centiskorch', 'Rotom-Base', 'Decidueye-Base', 'Spiritomb', 'Charizard-Base', 'Chesnaught-Base', 'Weezing-Base', 'Wo-Chien', 'Lickilicky', 'Scrafty-Base', 'Seviper', 'Bouffalant', 'Nihilego', 'Persian-Alola', 'Probopass', 'Donphan', 'Vespiquen', 'Meganium-Base', 'Hakamo-o', 'Lapras',
		],
	},
	{
		name: "[Gen 5] 35 Pokes Perfect [B2]",
		mod: 'perfectb2',
		validatorMod: 'gen9',
		ruleset: [
			// from Custom Game
			'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',
			// from 35 Pokes / Natdex
			'Obtainable', '+Unobtainable', '+Past', 'Sketch Post-Gen 7 Moves', 'Nickname Clause', 'OHKO Clause', 'Evasion Clause',
			'Sleep Moves Clause', 'Forme Clause',
			// B2 specific
			'One Boost Passer Clause', 'Gems Clause',

			'#irontreads+sandstream',
			'#regice+snowwarning+aurasphere',
			'#scyther+deltastream+wish',
			'#bombirdier+darkestlariat+rapidspin',
			'#shaymin+levitate+nastyplot',
			'#tentacruel+poisontouch',
			'#arcanine+aurasphere+energyball',
			'#dusknoir+ironfist+drainpunch',
			'#nidoqueen+calmmind',
			'#decidueyehisui+unburden+meteorbeam',
			'#cyclizar+courtchange+heartswap',
			'#oranguru+unaware+slackoff',
			'#dudunsparce+levitate',
			'#klinklang+sunsteelstrike+temperflare',
			'#grapploct+regenerator+spikes',
			'#drapion+merciless+focuspunch',
			'#flapple+quickattack+aerilate',
			'#rotomfan+wanderingspirit+roost',
			'#pinsir+toughclaws+spikes',
			'#lycanrocmidnight+accelerock',
			'#passimian+machpunch+wish',
			'#bronzong+healbell',
			'#camerupt+shoreup+spikes',
			'#gardevoir+prankster',
			'#drifblim+mindblown',
			'#gourgeist+technician',
			'#piloswine+glaciallance+rockpolish',
			'#lapras+magicguard+spikes',
			'#bellibolt+rapidspin+surf',
			'#coalossal+clearsmog+knockoff',
			'#guzzlord+vesselofruin+spikes',
			'#centiskorch+punkrock+torchsong',
			'#feraligatr+intimidate+jetpunch',
			'#golemalola+trickroom',
			'#unfezant+guts',
		],
		banlist: [
			'ND Uber', 'ND AG', 'ND OU', 'ND UUBL', 'ND UU', 'ND RUBL', 'ND RU', 'ND NFE', 'ND LC',
			'Stealth Rock', 'U-Turn', 'Volt Switch', 'Flip Turn', 'Teleport', 'Choice Scarf', 'Heavy-Duty Boots', 'Defog', 'Electric Terrain', 'Psychic Terrain', 'Misty Terrain', 'Grassy Terrain', 'Hidden Power',
		],
		unbanlist: [
			'Iron Treads', 'Regice', 'Scyther', 'Bombirdier', 'Shaymin-Base', 'Tentacruel', 'Camerupt-Base', 'Arcanine-Base', 'Dusknoir', 'Nidoqueen', 'Decidueye-Hisui', 'Cyclizar', 'Oranguru', 'Dudunsparce', 'Grapploct', 'Guzzlord', 'Drapion', 'Flapple', 'Rotom-Fan', 'Pinsir-Base', 'Lycanroc-Midnight', 'Passimian', 'Klinklang', 'Bronzong', 'Gardevoir-Base', 'Drifblim', 'Gourgeist-Base', 'Piloswine', 'Lapras', 'Bellibolt', 'Coalossal', 'Centiskorch', 'Feraligatr-Base', 'Golem-Alola', 'Unfezant',
		],
	},
	{
		name: "[Gen 5] 35 Pokes Perfect [B3]",
		mod: 'perfectb3',
		desc: 'mm wuz here',
		validatorMod: 'gen9',
		ruleset: [
			// from Custom Game
			'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',
			// from 35 Pokes / Natdex
			'Obtainable', '+Unobtainable', '+Past', 'Sketch Post-Gen 7 Moves', 'Nickname Clause', 'OHKO Clause', 'Evasion Clause',
			'Sleep Moves Clause', 'Forme Clause',
			// Melten hates cheese now
			'DryPass Clause', 'Gems Clause',

			'#accelgor+nastyplot+stickyweb',
			'#ampharos+drizzle+electroshot',
			'#dracovish-fishiousrend+rapidspin',
			'#noctowl+bloodmoon',
			'#dragalge+mortalspin',
			'#corviknight+toxic+whirlwind',
			'#frosmoth+roost',
			'#hoopa-nastyplot+aurasphere',
			'#glaceon+snowwarning',
			'#gliscor-poisonheal',
			'#grumpig+magicbounce+luminacrash',
			'#heliolisk+sandforce+earthpower',
			'#hydreigon-levitate+klutz',
			'#ironleaves-swordsdance',
			'#chesnaught-bellydrum+hornleech',
			'#hitmonlee+thunderouskick',
			'#obstagoon+pursuit+wildcharge',
			'#braixen+drought+morningsun+voltswitch',
			'#luxray+levitate+courtchange',
			'#glimmora-toxicdebris',
			'#sandslashalola+refrigerate+mountaingale',
			'#escavalier+spikes',
			'#skeledirge-torchsong',
			'#mismagius-nastyplot+healingwish',
			'#gyarados-dragondance',
			'#registeel+magnetpull+tachyoncutter',
			'#cherrim+geomancy+neutralizinggas',
			'#crustle+sandstream-shellsmash',
			'#mukalola+waterabsorb+mortalspin',
			'#milotic-recover',
			'#hariyama+rapidspin',
			'#turtonator-shellarmor+cloudnine',
			'#sandaconda-sandspit-glare+thousandarrows',
			'#nidoking-sheerforce+neuroforce',
			'#gigalith-sandstream+accelerock',
		],
		banlist: [
			'ND Uber', 'ND AG', 'ND OU', 'ND UUBL', 'ND UU', 'ND RUBL', 'ND RU', 'ND NFE', 'ND LC',
			'Stealth Rock', 'U-turn', 'Teleport', 'Scald', 'Close Combat', 'Hidden Power', 'Defog', 'Shed Tail', 'Outrage',
			'Heavy-Duty Boots', 'Choice Scarf',
		],
		unbanlist: [
			'Accelgor', 'Ampharos-Base', 'Braixen', 'Cherrim-Base', 'Chesnaught-Base', 'Corviknight', 'Crustle', 'Dracovish', 'Dragalge-Base', 'Escavalier', 'Frosmoth', 'Gigalith', 'Glaceon', 'Glimmora-Base', 'Gliscor', 'Grumpig', 'Gyarados-Base', 'Hariyama', 'Heliolisk', 'Hitmonlee', 'Hoopa-Confined', 'Hydreigon', 'Iron Leaves', 'Luxray', 'Milotic', 'Mismagius', 'Muk-Alola', 'Nidoking', 'Noctowl', 'Obstagoon', 'Registeel', 'Sandaconda', 'Sandslash-Alola', 'Skeledirge', 'Turtonator',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [C1]",
		mod: 'gen9',
		ruleset: [
			'Standard 35 Pokes',

			'#liepard+bugbuzz+flamethrower',
			'#weezing+rapidspin',
			'#wigglytuff+regenerator+fleurcannon',
			'#aromatisse+lingeringaroma',
			'#silvally+cloudnine+stealthrock',
			'#gogoat+grassysurge',
			'#solrock+psychicsurge+victorydance',
			'#lickilicky+mistysurge+moonlight',
			'#dedenne+solarpower',
			'#klinklang+electricsurge+spikes',
			'#steelix+rockypayload+shoreup',
			'#jynx+sapsipper',
			'#wailord+unaware+thunder',
			'#rotomfrost+refrigerate',
			'#magcargo+drought',
			'#camerupt+moldbreaker+shoreup',
			'#palossand+sandstream',
			'#relicanth+sandrush+honeclaws',
			'#lumineon+drizzle',
			'#granbull+slushrush+glaciallance',
			'#delibird+snowwarning+burningbulwark+flipturn',
			'#haunter+flashfire+flamethrower',
			'#guzzlord+eartheater+stealthrock',
			'#mabosstiff+strongjaw',
			'#toxicroak+lightningrod',
			'#mothim+blizzard+hurricane',
			'#avalugg+chillyreception',
			'#dhelmise+grasspelt',
		],
		banlist: [
			'Light Clay',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z',
		],
		unbanlist: [
			'Booster Energy',
			'Dhelmise', 'Liepard', 'Weezing-Base', 'Wigglytuff', 'Aromatisse', 'Togedemaru-Base', 'Silvally-Base', 'Gogoat', 'Hitmontop', 'Solrock', 'Raichu-Alola', 'Lickilicky', 'Dedenne', 'Klinklang', 'Leavanny', 'Exeggutor-Base', 'Steelix-Base', 'Medicham-Base', 'Jynx', 'Wailord', 'Rotom-Frost', 'Magcargo', 'Camerupt-Base', 'Palossand', 'Relicanth', 'Lumineon', 'Granbull', 'Delibird', 'Talonflame', 'Haunter', 'Guzzlord', 'Mabosstiff', 'Toxicroak', 'Mothim', 'Avalugg-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [D1]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		banlist: [
			'Eviolite', 'Download', 'Analytic',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z',
		],
		unbanlist: [
			'Booster Energy',
			'Staravia', 'Charjabug', 'Ponyta-Base', 'Krokorok', 'Quilladin', 'Porygon', 'Hattrem', 'Tinkatuff', 'Floette-Base', 'Gimmighoul-Base', 'Gastly', 'Staryu', 'Luxio', 'Cubchoo', 'Amaura', 'Gloom', 'Stufful', 'Mankey', 'Carkol', 'Yanma', 'Grimer-Alola', 'Meowth-Alola', 'Cufant', 'Vibrava', 'Voltorb-Hisui', 'Gothorita', 'Lampent', 'Slowpoke-Galar', 'Palpitoad', 'Sandshrew-Alola', 'Anorith', 'Goomy', 'Mantyke', 'Snubbull', 'Aipom',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [D2]",
		mod: 'gen9',
		ruleset: [
			'Standard 35 Pokes',
			'Limit One Restricted',

			'#sandygast+stormdrain',
			'#finneon+stakeout+bouncybubble',
			'#cubchoo+swiftswim+glaciallance+jetpunch',
			'#larvesta+poisonheal+defog',
			'#skrelp+mortalspin',
			'#jigglypuff+regenerator+fleurcannon', // he thinks hes wiggly 😂✌️
			'#golett+zapcannon+crosschop',
			'#togepi+shellsmash+tintedlens',
			'#dreepy+dazzling+astralbarrage+flipturn',
			'#stunky+unaware+wish',
			'#gible+eartheater+spikes',
			'#varoom+motordrive+noxioustorque+highhorsepower',
			'#geodudealola+levitate+accelerock',
			'#sandile+temperflare',
			'#gimmighoul+goodasgold+willowisp+recover',
			'#dolliv+hypervoice',
			'#litten+morningsun+knockoff',
			'#magnemite+paraboliccharge+trace',
			'#croagunk+thunderouskick',
			'#smoochum+solarpower+healingwish',
			'#skiploom+naturalcure+defog',
			'#pancham+machpunch+seedbomb',
			'#pineco+healorder+thickfat',
			'#natu+oblivionwing+energyball',
			'#corvisquire+windrider',
			'#shieldon+rapidspin+heatproof',
			'#deino+suckerpunch+prankster+encore+partingshot', // he thinks its f1 😂✌️
			'#litleo+scorchingsands',
			'#marill+lightningrod+strengthsap+roar',
			'#munna+regenerator+chillyreception',
			'#tentacool+frisk',
		],
		banlist: [
			'Analytic', 'Huge Power', 'Hustle',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z', 'Eviolite', 'Light Clay',
			'Dynamic Punch',
		],
		unbanlist: [
			'Booster Energy', 'Noxious Torque',
			'Tentacool', 'Sandygast', 'Finneon', 'Cubchoo', 'Larvesta', 'Skrelp', 'Jigglypuff', 'Golett', 'Togepi', 'Dreepy', 'Stunky', 'Gible', 'Varoom', 'Geodude-Alola', 'Sandile', 'Gimmighoul-Base', 'Dolliv', 'Litten', 'Magnemite', 'Croagunk', 'Smoochum', 'Skiploom', 'Pancham', 'Pineco', 'Natu', 'Corvisquire', 'Heatproof', 'Deino', 'Litleo', 'Marill', 'Munna', 'Shieldon',
		],
		restricted: [
			'Delcatty', 'Luvdisc', 'Parasect', 'Delibird',
		],
	},
	{
		name: "[Gen 7] 35 Pokes Perfect [E1]",
		mod: 'gen7',
		ruleset: ['Standard', '35 Pokes Mega Clause', '!Sleep Clause Mod', 'Sleep Moves Clause', 'Evasion Abilities Clause'],
		banlist: ['All Pokemon', 'Regenerator', 'Dynamic Punch'],
		unbanlist: [
			'Golurk-Base', 'Flareon', 'Lycanroc-Base', 'Togedemaru-Base', 'Froslass-Base', 'Roserade', 'Magmortar', 'Abomasnow-Base', 'Abomasnow-Mega', 'Audino-Base', 'Audino-Mega', 'Banette-Base', 'Banette-Mega', 'Blastoise-Base', 'Blastoise-Mega', 'Noivern', 'Bronzong', 'Diancie-Base', 'Flygon', 'Forretress', 'Gallade-Base', 'Garbodor', 'Gigalith', 'Golisopod-Base', 'Guzzlord', 'Hariyama', 'Moltres-Base', 'Milotic', 'Miltank', 'Primeape', 'Rotom-Frost', 'Seismitoad', 'Shaymin-Base', 'Silvally-Fairy', 'Skuntank', 'Swellow', 'Vikavolt-Base', 'Xatu', 'Zoroark-Base',
			'Blastoisinite', 'Abomasite', 'Audinite', 'Banettite',
		],
		onValidateSet(set) {
			const problems: string[] = [];
			const zUsers = ['golurk', 'flareon', 'lycanroc', 'primeape', 'rotomfrost', 'roserade', 'magmortar'];
			const speciesid = this.toID(set.species);
			const item = this.dex.items.get(set.item);
			if (item.zMove && !zUsers.includes(speciesid)) {
				problems.push(`${set.name} is not allowed to hold a Z Crystal in E1.`);
			}
			if(problems.length) return problems;
		},
		onBegin() {
			const zUsers = ['Golurk', 'Flareon', 'Lycanroc', 'Primeape', 'Rotom-Frost', 'Roserade', 'Magmortar'];
			this.add('rule', `Perfect E1: Only the following Pokemon can hold Z Crystals:`);
			this.add('rule', zUsers.join(', '));
			this.add('rule', `Perfect E1: Pokemon can not have Regenerator.`);
			this.add('rule', `Perfect E1: Pokemon can not have Dynamic Punch.`);
		},
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [E2]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!35 Pokes Z-Move Clause'],
		banlist: ['Heavy-Duty Boots', 'Light Clay', 'Quick Draw'],
		unbanlist: [
			'Absol-Base', 'Aerodactyl-Base', 'Arcanine-Base', 'Camerupt-Base', 'Camerupt-Mega', 'Cramorant-Base', 'Cyclizar', 'Dachsbun', 'Druddigon', 'Electrode-Hisui', 'Escavalier', 'Floatzel', 'Frosmoth', 'Gardevoir-Base', 'Glimmet', 'Gurdurr', 'Leafeon', 'Magnezone', 'Mismagius', 'Mr. Rime', 'Orthworm', 'Overqwil', 'Poliwrath', 'Raboot', 'Raichu-Base', 'Rhyperior', 'Sableye-Base', 'Scyther', 'Slaking', 'Slowbro-Galar', 'Snorlax', 'Swampert-Base', 'Tauros-Paldea-Combat', 'Trevenant', 'Uxie', 'Whimsicott',
			'Cameruptite',
		],
		onValidateSet(set) {
			const problems: string[] = [];
			const zUsers = ['raichu', 'leafeon', 'poliwrath', 'raboot', 'frosmoth', 'slowbrogalar', 'snorlax'];
			const speciesid = this.toID(set.species);
			const item = this.dex.items.get(set.item);
			if (item.zMove && !zUsers.includes(speciesid)) {
				problems.push(`${set.name} is not allowed to hold a Z Crystal in E2.`);
			}
			if(problems.length) return problems;
		},
		onBegin() {
			const zUsers = ['Raichu', 'Leafeon', 'Poliwrath', 'Raboot', 'Frosmoth', 'Slowbro-Galar', 'Snorlax'];
			this.add('rule', `Perfect E2: Only the following Pokemon can hold Z Crystals:`);
			this.add('rule', zUsers.join(', '));
			this.add('rule', `Perfect E2: Pokemon can not have Quick Draw.`);
			this.add('rule', `Perfect E2: Pokemon can not have Heavy-Duty Boots.`);
		},
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [F1]",
		mod: 'gen9',
		ruleset: [
			'Standard 35 Pokes',

			'#dustox+simple+malignantchain',
			'#beedrill+adaptability+firstimpression+headlongrush+victorydance',
			'#armaldo+recover+uturn',
			'#corsola+hugepower+accelerock',
			'#absol+sheerforce',
			'#mawile+gigatonhammer+moonlight',
			'#tropius+galewings+clangingscales+dragonascent+oblivionwing',
			'#castform+scrappy+clangoroussoul+judgment',
			'#camerupt+waterabsorb+aurasphere',
			'#mightyena+fishiousrend+wish',
			'#wugtrio+noguard+tripleaxel',
			'#mienfoo+stealthrock+supercellslam',
			'#gastly+lightningrod+spikes',
			'#frillish+neutralizinggas+infernalparade',
			'#pachirisu+drizzle+rapidspin',
			'#abra+magicbounce+gravity+rapidspin',
			'#grumpig+icescales+sparklingaria',
			'#glalie+galvanize+extremespeed+rapidspin',
			'#dewgong+unaware+surgingstrikes',
			'#heatmor+drought+defog+spikes',
			'#pidgeot+noguard+focusblast',
			'#stunfiskgalar+wellbakedbody+ironhead',
			'#simisage+trace+copycat+woodhammer',
			'#dedenne+triage+calmmind',
			'#appletun+defog+earthpower',
			'#fearow+bravebird+guts',
			'#rampardos+rockhead',
			'#zweilous+prankster+partingshot+willowisp',
			'#crocalor+toxic',
			'#plusle+soulheart+courtchange+energyball+mistball+weatherball',
			'#seviper+adaptability+earthpower',
			'#banette+speedboost',
			'#wobbuffet+magicguard+mortalspin+seismictoss',
			'#gumshoos+jawlock+multiattack',
			'#granbull+furcoat+trickroom',
		],
		banlist: [
			'Light Clay',
			'Ultranecrozium Z', 'Solganium Z', 'Lunalium Z', 'Mewnium Z', 'Marshadium Z',
		],
		unbanlist: [
			'Booster Energy',
			'Abra', 'Absol-Base', 'Appletun', 'Armaldo', 'Banette-Base', 'Beedrill-Base', 'Camerupt-Base', 'Castform-Base', 'Corsola-Base', 'Crocalor', 'Dedenne', 'Dewgong', 'Dustox', 'Fearow', 'Frillish', 'Gastly', 'Glalie-Base', 'Granbull', 'Grumpig', 'Gumshoos-Base', 'Heatmor', 'Mawile-Base', 'Mienfoo', 'Mightyena', 'Pachirisu', 'Pidgeot-Base', 'Plusle', 'Rampardos', 'Seviper', 'Simisage', 'Stunfisk-Galar', 'Tropius', 'Wobbuffet', 'Wugtrio', 'Zweilous',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [H1]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		banlist: ['Burn Drive', 'Chill Drive', 'Douse Drive', 'Shock Drive'],
		unbanlist: [
			'Genesect-Base', 'Palkia-Origin', 'Lugia', 'Metagross-Mega', 'Manectric-Mega', 'Magearna-Base', 'Magearna-Original', 'Chi-Yu', 'Roaring Moon', 'Excadrill-Mega', 'Scizor-Mega', 'Ferrothorn', 'Zapdos-Base', 'Zamazenta-Crowned', 'Blissey', 'Urshifu-Rapid-Strike', 'Dialga-Origin', 'Alomomola', 'Giratina-Origin', 'Tyranitar-Mega', 'Glimmora-Mega', 'Tapu Koko', 'Delphox-Mega', 'Heatran-Base', 'Sneasler', 'Arceus-Ice', 'Altaria-Mega', 'Arceus-Grass', 'Iron Treads', 'Landorus-Therian', 'Araquanid-Base', 'Tapu Fini', 'Garchomp-Base', 'Pecharunt', 'Terapagos-Terastal', 'Iron Valiant',
			'Delphoxite', 'Excadrite', 'Glimmoranite', 'Piercing Drill',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [Z1]",
		mod: 'gen9',
		ruleset: [
			'Standard NatDex', '!Evasion Clause', 'Evasion Moves Clause', 'Evasion Items Clause', 'Mega Rayquaza Clause', 'Z-Move Clause', 'Terastal Clause',
		],
		banlist: ['ND AG', 'pokemontag:allmoves', 'Regenerator', 'Zacian-Crowned + Iron Head', 'Jirachi', 'Zamazenta-Crowned + Iron Head'],
		unbanlist: [
			'Weather Ball', 'Hidden Power', 'U-Turn', 'Overheat', 'Giga Impact', 'Retaliate', 'Acrobatics', 'Aqua Ring', 'Aqua Tail', 'Aromatherapy', 'Assist', 'Belly Drum', 'Body Press', 'Stockpile', 'Thunder', 'Bounce', 'Earth Power', 'Clear Smog', 'Psychic Noise', 'Crunch', 'Destiny Bond', 'Dragon Breath', 'Feint Attack', 'Freeze Dry', 'Grass Knot', 'Work Up', 'Ice Punch', 'Incinerate', 'Trick', 'Hex', 'Rock Slide', 'Iron Head', 'Alluring Voice', 'Sludge', 'Thief',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [VGC-1]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: [
			'Standard 35 Pokes VGC', '!35 Pokes Hidden Power Clause',
		],
		unbanlist: [
			'Arctovish', 'Baxcalibur-Base', 'Bisharp', 'Bruxish', 'Camerupt-Base', 'Conkeldurr', 'Drampa-Base', 'Dusclops', 'Excadrill-Base', 'Gengar-Base', 'Gigalith', 'Gothitelle', 'Hatterene', 'Heliolisk', 'Hydreigon', 'Ludicolo', 'Ninetales-Alola', 'Ninetales-Base', 'Okidogi', 'Overqwil', 'Politoed', 'Primarina', 'Raikou', 'Regigigas', 'Rotom-Wash', 'Scizor-Base', 'Scovillain-Base', 'Serperior', 'Skeledirge', 'Terrakion', 'Toedscruel', 'Togekiss', 'Torracat', 'Weezing-Base', 'Wo-Chien',
		],
	},
	
	{
		section: '35 Pokes Perfect (WIP)',
		column: 3
	},
	{
		name: "[Gen 9] ND 35 Pokes Perfect [C2]",
		mod: 'gen9',
		ruleset: [
			'Standard 35 Pokes',

			'#sandslashalola+icescales+mountaingale',
			'#wigglytuff+sheerforce+moonblast',
			'#poliwrath+drizzle+stealthrock',
			'#alakazam+courtchange',
			'#muk+regenerator',
			'#cloyster+snowwarning',
			'#rapidash+orichalcumpulse',
			'#electrodehisui+grassysurge',
			'#exeggutor+psychicsurge',
			'#weezinggalar+noxioustorque',
			'#pinsir+protosynthesis+megahorn+uturn',
			'#kabutops+sharpness+stoneaxe',
			'#meganium+waterabsorb+strengthsap',
			'#ampharos+hadronengine+thunderclap',
			'#azumarill+wavecrash',
			'#diancie+voltabsorb',
			'#sneasel+purifyingsalt',
			'#donphan+sandstream+headlongrush',
			'#armaldo+sandrush+uturn',
			'#empoleon+hydrosteam',
			'#torterra+chlorophyll',
			'#toxicroak+snipeshot',
			'#lickilicky+unaware+slackoff',
			'#electivire+quarkdrive+iciclecrash+plasmafists',
			'#drampa+deltastream+terrainpulse',
			'#yanmega+hurricane+weatherball',
			'#houndoom+imposter',
			'#turtonator+roughskin+recover+spikes',
			'#palossand+dryskin+sandsearstorm',
			'#houndstone+slushrush+spikes',
			'#rabsca+magicbounce+voltswitch',
			'#aggron+eartheater+saltcure+shoreup',
			'#pangoro+sandrush',
			'#noivern+windrider',
			'#mismagius+flashfire+flamethrower',
		],
		banlist: ['Light Clay', 'Shell Smash', 'Belly Drum'],
		unbanlist: [
			'Aggron-Base', 'Alakazam-Base', 'Ampharos-Base', 'Armaldo', 'Azumarill', 'Cloyster', 'Diancie-Base', 'Donphan', 'Drampa-Base', 'Electivire', 'Electrode-Hisui', 'Empoleon', 'Exeggutor-Base', 'Houndoom-Base', 'Houndstone', 'Kabutops', 'Lickilicky', 'Meganium-Base', 'Mismagius', 'Muk-Base', 'Noivern', 'Palossand', 'Pangoro', 'Pinsir-Base', 'Poliwrath', 'Rabsca', 'Rapidash-Base', 'Sandslash-Alola', 'Sneasel-Base', 'Torterra', 'Toxicroak', 'Turtonator', 'Weezing-Galar', 'Wigglytuff', 'Yanmega',
		],
	},

	// endregion

	// region 35 Babies

	{
		section: '35 Pokes Babies',
		column: 3
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Jan 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Bramblin', 'Chinchou', 'Clobbopus', 'Cyndaquil', 'Doduo', 'Dreepy', 'Grimer-Alola', 'Hatenna', 'Helioptile', 'Hoppip', 'Horsea', 'Inkay', 'Jangmo-o', 'Koffing', 'Larvesta', 'Lechonk', 'Magnemite', 'Mantyke', 'Mareep', 'Nidoran-F', 'Nosepass', 'Phanpy', 'Poliwag', 'Poltchageist', 'Shellos', 'Shroomish', 'Smoliv', 'Spritzee', 'Starly', 'Tentacool', 'Tinkatink', 'Tirtouga', 'Tympole', 'Whismur', 'Zorua-Hisui',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Apr 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Deino', 'Lechonk', 'Tentacool', 'Munna', 'Hatenna', 'Drilbur', 'Bagon', 'Arrokuda', 'Wynaut', 'Psyduck', 'Ferroseed', 'Beldum', 'Exeggcute', 'Charmander', 'Archen', 'Capsakid', 'Roggenrola', 'Geodude-Base', 'Petilil', 'Larvesta', 'Swablu', 'Glimmet', 'Kricketot', 'Karrablast', 'Gimmighoul-Roaming', 'Amaura', 'Pawniard', 'Abra', 'Sprigatito', 'Rhyhorn', 'Lillipup', 'Tyrunt', 'Chewtle', 'Slugma', 'Cacnea',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Feb 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Turtwig', 'Clamperl', 'Minccino', 'Binacle', 'Goldeen', 'Tadbulb', 'Ponyta-Galar', 'Shinx', 'Ferroseed', 'Sentret', 'Seedot', 'Machop', 'Tandemaus', 'Shroodle', 'Lickitung', 'Snom', 'Fletchling', 'Onix', 'Bagon', 'Darumaka-Galar', 'Tepig', 'Phanpy', 'Pumpkaboo-Base', 'Bellsprout', 'Taillow', 'Spoink', 'Varoom', 'Magikarp', 'Squirtle', 'Tynamo', 'Lotad', 'Diglett-Base', 'Joltik', 'Wiglett', 'Remoraid',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Jan 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Pidgey', 'Charmander', 'Gothita', 'Burmy', 'Zorua-Base', 'Scorbunny', 'Anorith', 'Stunky', 'Cranidos', 'Inkay', 'Patrat', 'Impidimp', 'Sewaddle', 'Croagunk', 'Sunkern', 'Combee', 'Larvesta', 'Vanillite', 'Shieldon', 'Shinx', 'Oddish', 'Ponyta-Galar', 'Drilbur', 'Rockruff-Base', 'Paras', 'Torchic', 'Ledyba', 'Smoochum', 'Remoraid', 'Snorunt', 'Swablu', 'Grimer-Base', 'Popplio', 'Gulpin', 'Gimmighoul-Roaming',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Dec 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Mareanie', 'Cubchoo', 'Corphish', 'Charmander', 'Cleffa', 'Snover', 'Goomy', 'Growlithe-Hisui', 'Sandygast', 'Fomantis', 'Tandemaus', 'Maschiff', 'Grookey', 'Treecko', 'Voltorb-Base', 'Blitzle', 'Sprigatito', 'Barboach', 'Ducklett', 'Gulpin', 'Munchlax', 'Rhyhorn', 'Totodile', 'Ferroseed', 'Staryu', 'Corsola-Galar', 'Dwebble', 'Archen', 'Bulbasaur', 'Turtwig', 'Sandshrew-Alola', 'Hippopotas', 'Eevee-Base', 'Dewpider', 'Snivy',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Nov 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Noibat', 'Abra', 'Smoochum', 'Rattata-Base', 'Helioptile', 'Turtwig', 'Gulpin', 'Wailmer', 'Skiddo', 'Spritzee', 'Hoothoot', 'Frillish', 'Electrike', 'Tepig', 'Goomy', 'Chewtle', 'Mienfoo', 'Makuhita', 'Lotad', 'Pancham', 'Zorua-Hisui', 'Fidough', 'Frigibax', 'Totodile', 'Slakoth', 'Wooper-Paldea', 'Hoppip', 'Dwebble', 'Bronzor', 'Sobble', 'Cyndaquil', 'Swablu', 'Vullaby', 'Patrat', 'Weedle',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Oct 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Flittle', 'Cottonee', 'Sizzlipede', 'Surskit', 'Varoom', 'Taillow', 'Bunnelby', 'Gimmighoul-Roaming', 'Cubchoo', 'Cranidos', 'Purrloin', 'Lotad', 'Remoraid', 'Spearow', 'Fuecoco', 'Maschiff', 'Growlithe-Base', 'Lileep', 'Doduo', 'Nacli', 'Makuhita', 'Espurr', 'Houndour', 'Slakoth', 'Yamask-Galar', 'Slowpoke-Galar', 'Joltik', 'Omanyte', 'Tirtouga', 'Sprigatito', 'Popplio', 'Meowth-Galar', 'Shroomish', 'Helioptile', 'Applin',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Sep 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Bunnelby', 'Tirtouga', 'Klink', 'Amaura', 'Gible', 'Mankey', 'Tyrogue', 'Trapinch', 'Poliwag', 'Munna', 'Onix', 'Totodile', 'Elekid', 'Spinarak', 'Whismur', 'Rhyhorn', 'Lillipup', 'Bulbasaur', 'Pansear', 'Mudkip', 'Munchlax', 'Panpour', 'Chewtle', 'Eevee-Base', 'Applin', 'Pancham', 'Tepig', 'Taillow', 'Hatenna', 'Wooloo', 'Stunky', 'Chingling', 'Blipbug', 'Tandemaus', 'Zubat',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Aug 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Quaxly', 'Wynaut', 'Swablu', 'Kricketot', 'Wiglett', 'Barboach', 'Spoink', 'Meltan', 'Geodude-Alola', 'Mantyke', 'Cubchoo', 'Tinkatink', 'Ledyba', 'Flittle', 'Dreepy', 'Horsea', 'Trapinch', 'Magby', 'Cottonee', 'Archen', 'Torchic', 'Spinarak', 'Gothita', 'Clauncher', 'Houndour', 'Bramblin', 'Cherubi', 'Scatterbug', 'Spheal', 'Bergmite', 'Toxel', 'Rhyhorn', 'Meowth-Alola', 'Stufful', 'Tyrunt',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Jul 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Glameow', 'Smoochum', 'Hoppip', 'Squirtle', 'Gastly', 'Corphish', 'Dreepy', 'Fuecoco', 'Froakie', 'Tepig', 'Snivy', 'Chespin', 'Pidove', 'Petilil', 'Impidimp', 'Zigzagoon-Galar', 'Porygon', 'Clamperl', 'Machop', 'Chewtle', 'Lillipup', 'Skrelp', 'Bunnelby', 'Mareanie', 'Shieldon', 'Larvitar', 'Goldeen', 'Meowth-Galar', 'Sandygast', 'Sewaddle', 'Meltan', 'Surskit', 'Wiglett', 'Rookidee',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Jun 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Squirtle', 'Kubfu', 'Yamper', 'Foongus', 'Jangmo-o', 'Cleffa', 'Tangela', 'Remoraid', 'Budew', 'Ekans', 'Gulpin', 'Misdreavus', 'Glameow', 'Hippopotas', 'Honedge', 'Larvesta', 'Pansage', 'Drilbur', 'Cetoddle', 'Tyrunt', 'Poipole', 'Chespin', 'Glimmet', 'Skrelp', 'Tyrogue', 'Barboach', 'Skorupi', 'Skwovet', 'Sizzlipede', 'Nacli', 'Zubat', 'Flittle', 'Arrokuda', 'Munchlax', 'Ponyta-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [May 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Voltorb-Hisui', 'Snivy', 'Maschiff', 'Horsea', 'Salandit', 'Tarountula', 'Dwebble', 'Rolycoly', 'Litwick', 'Morelull', 'Gossifleur', 'Taillow', 'Sunkern', 'Kabuto', 'Farfetch’d-Galar', 'Pansage', 'Buizel', 'Buneary', 'Treecko', 'Charcadet', 'Aron', 'Wimpod', 'Inkay', 'Roggenrola', 'Goldeen', 'Impidimp', 'Sandygast', 'Vulpix-Base', 'Cufant', 'Budew', 'Burmy', 'Nincada', 'Seedot', 'Tympole', 'Shellos',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Apr 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Magikarp', 'Toxel', 'Noibat', 'Mareanie', 'Wooper-Paldea', 'Cyndaquil', 'Sinistea', 'Fomantis', 'Silicobra', 'Charcadet', 'Meowth-Galar', 'Slowpoke-Base', 'Bagon', 'Lechonk', 'Machop', 'Patrat', 'Meowth-Base', 'Capsakid', 'Pidgey', 'Nosepass', 'Shroodle', 'Baltoy', 'Zigzagoon-Galar', 'Nickit', 'Froakie', 'Drilbur', 'Bounsweet', 'Porygon', 'Magnemite', 'Paras', 'Cubone', 'Vanillite', 'Sandshrew-Alola', 'Gimmighoul-Base', 'Lotad',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Mar 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Voltorb-Hisui', 'Natu', 'Charmander', 'Spearow', 'Sandshrew-Base', 'Exeggcute', 'Koffing', 'Staryu', 'Remoraid', 'Larvitar', 'Gulpin', 'Carvanha', 'Shuppet', 'Bidoof', 'Hippopotas', 'Mantyke', 'Panpour', 'Timburr', 'Karrablast', 'Chespin', 'Honedge', 'Inkay', 'Rowlet', 'Grubbin', 'Fomantis', 'Rolycoly', 'Hatenna', 'Dreepy', 'Wiglett', 'Tympole', 'Tirtouga', 'Helioptile', 'Lechonk', 'Popplio',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Jan 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Slugma', 'Torchic', 'Minccino', 'Spheal', 'Nacli', 'Greavard', 'Trapinch', 'Tympole', 'Mudkip', 'Snover', 'Squirtle', 'Exeggcute', 'Rufflet', 'Paras', 'Ralts', 'Vullaby', 'Goldeen', 'Shinx', 'Venonat', 'Stufful', 'Poochyena', 'Drifloon', 'Riolu', 'Rolycoly', 'Snom', 'Wurmple', 'Slakoth', 'Smoochum', 'Wailmer', 'Gastly', 'Larvesta', 'Larvitar', 'Litwick', 'Charcadet', 'Solosis',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Dec 2023]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		banlist: ['Deep Sea Tooth'],
		unbanlist: [
			'Corsola-Galar', 'Lotad', 'Inkay', 'Snom', 'Cetoddle', 'Noibat', 'Porygon', 'Lickitung', 'Hippopotas', 'Skwovet', 'Venipede', 'Slowpoke-Base', 'Silicobra', 'Wiglett', 'Diglett-Alola', 'Snorunt', 'Sunkern', 'Tandemaus', 'Wooper-Base', 'Clamperl', 'Flittle', 'Remoraid', 'Beldum', 'Cacnea', 'Magnemite', 'Toedscool', 'Pansage', 'Impidimp', 'Croagunk', 'Ponyta-Base', 'Slakoth', 'Blitzle', 'Charcadet', 'Minccino', 'Spoink',
		],
	},

	// endregion

	// region 35 Seniors

	{
		section: '35 Pokes Seniors',
		column: 3
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [Sep 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		unbanlist: [
			'Absol-Mega', 'Aegislash-Base', 'Alakazam-Mega', 'Annihilape', 'Araquanid-Base', 'Arceus-Bug', 'Beedrill-Mega', 'Dialga-Base', 'Dragapult', 'Ferrothorn', 'Fezandipiti', 'Garchomp-Base', 'Genesect-Base', 'Giratina-Base', 'Great Tusk', 'Heatran-Base', 'Hoopa-Unbound', 'Iron Treads', 'Iron Valiant', 'Kartana', 'Landorus-Base', 'Latias-Mega', 'Magearna-Base', 'Mawile-Mega', 'Naganadel', 'Ogerpon-Hearthflame', 'Palkia-Base', 'Pinsir-Mega', 'Quagsire', 'Tapu Fini', 'Tapu Koko', 'Tapu Lele', 'Ting-Lu', 'Tyranitar-Mega', 'Urshifu-Rapid-Strike',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [Apr 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		unbanlist: [
			'Articuno-Base', 'Entei', 'Latias-Base', 'Heatran-Base', 'Thundurus-Base', 'Tapu Bulu', 'Regieleki', 'Venusaur-Base', 'Arctozolt', 'Ting-Lu', 'Ogerpon-Wellspring', 'Dialga-Base', 'Mamoswine', 'Celebi', 'Great Tusk', 'Meloetta-Base', 'Lugia', 'Sneasler', 'Absol-Mega', 'Garchomp-Mega', 'Sharpedo-Mega', 'Giratina-Base', 'Iron Jugulis', 'Quagsire', 'Politoed', 'Arceus-Ice', 'Dracovish', 'Baxcalibur-Base', 'Charizard-Mega-Y', 'Tyranitar-Base', 'Hatterene', 'Stakataka', 'Excadrill-Base', 'Zygarde-Base', 'Ninetales-Alola',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [Jan 2025]",
		mod: 'gen9',
		ruleset: ['[Gen 9] ND 35 Pokes Seniors [Apr 2024]'],
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [Sep 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		unbanlist: [
			'Kyogre-Primal', 'Landorus-Base', 'Lugia', 'Metagross-Mega', 'Necrozma-Dusk-Mane', 'Sableye-Mega', 'Sceptile-Mega', 'Palkia-Origin', 'Reshiram', 'Salamence-Mega', 'Sneasler', 'Ogerpon-Hearthflame', 'Muk-Alola', 'Banette-Mega', 'Solgaleo', 'Walking Wake', 'Annihilape', 'Arceus-Rock', 'Deoxys-Base', 'Deoxys-Speed', 'Dialga-Origin', 'Gholdengo', 'Groudon-Primal', 'Zamazenta-Crowned', 'Zekrom', 'Koraidon', 'Corviknight', 'Latias-Mega', 'Steelix-Mega', 'Miraidon', 'Lopunny-Mega', 'Magnezone', 'Chansey', 'Grimmsnarl', 'Ampharos-Mega',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [Aug 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		unbanlist: [
			'Arceus-Electric', 'Heatran-Base', 'Garchomp-Base', 'Iron Treads', 'MissingNo.', 'Sandy Shocks', 'Slither Wing', 'Hatterene', 'Duraludon', 'Landorus-Base', 'Chi-Yu', 'Avalugg-Base', 'Archaludon', 'Tapu Lele', 'Venusaur-Base', 'Houndoom-Base', 'Pinsir-Base', 'Rayquaza-Base', 'Shedinja', 'Ogerpon-Hearthflame', 'Moltres-Base', 'Pelipper', 'Ogerpon-Base', 'Beedrill-Base', 'Iron Moth', 'Rillaboom', 'Banette-Base', 'Tapu Fini', 'Excadrill-Base', 'Weavile', 'Politoed', 'Tapu Bulu', 'Iron Boulder', 'Torkoal', 'Skarmory-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [Jun 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		unbanlist: [
			'Articuno-Base', 'Entei', 'Latias-Base', 'Cresselia', 'Thundurus-Base', 'Tapu Bulu', 'Xurkitree', 'Keldeo-Base', 'Enamorus-Base', 'Ting-Lu', 'Ogerpon-Wellspring-Tera', 'Dialga-Base', 'Basculin-White-Striped', 'Celebi', 'Manaphy', 'Meloetta-Base', 'Pokestar Black Belt', 'Pokestar MT2', 'Absol-Mega', 'Beedrill-Mega', 'Sharpedo-Mega', 'Iron Treads', 'Iron Jugulis', 'Quagsire', 'Pelipper', 'Arceus-Psychic', 'Dracovish', 'Weavile', 'MissingNo.', 'Tyranitar-Base', 'Reuniclus', 'Regirock', 'Stakataka', 'Zygarde-Base', 'Ninetales-Alola',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [May 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		unbanlist: [
			'Lugia', 'Sharpedo-Mega', 'Thundurus-Base', 'Pokestar Black Belt', 'Moltres-Base', 'Corviknight', 'Regidrago', 'Deoxys-Defense', 'Dragapult', 'Latias-Base', 'Palkia-Base', 'Arceus-Rock', 'Darmanitan-Galar', 'Tapu Lele', 'Deoxys-Base', 'Spectrier', 'Ferrothorn', 'Camerupt-Mega', 'Regice', 'Basculin-White-Striped', 'Pokestar F-00', 'Pelipper', 'Iron Jugulis', 'Naganadel', 'Keldeo-Base', 'Cobalion', 'Groudon-Base', 'Solgaleo', 'Okidogi', 'Scovillain-Base', 'Pokestar UFO-Base', 'Landorus-Base', 'Mew', 'Garganacl', 'Great Tusk',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Seniors [Apr 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes Ubers'],
		unbanlist: [
			'Forretress', 'Samurott-Hisui', 'Kyurem-White', 'Glalie-Base', 'Cresselia', 'Thundurus-Base', 'Regidrago', 'Banette-Mega', 'Dialga-Origin', 'Giratina-Origin', 'Palkia-Base', 'Arceus-Rock', 'Lunala', 'Machamp', 'Manectric-Mega', 'Naganadel', 'Pincurchin', 'Meloetta-Pirouette', 'Blissey', 'Alakazam-Mega', 'Aggron-Mega', 'Ogerpon-Hearthflame-Tera', 'Hoopa-Unbound', 'Dragapult', 'Camerupt-Mega', 'Tyranitar-Mega', 'Gothitelle', 'Skarmory-Base', 'Deoxys-Speed', 'Floette-Eternal-Base', 'Gastrodon', 'Dhelmise', 'Sceptile-Mega', 'Iron Treads', 'Victini',
		],
	},

	// endregion

	// region 35 VGC

	{
		section: '35 Pokes VGC',
		column: 3,
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Sep 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Araquanid-Base', 'Arcanine-Hisui', 'Archeops', 'Bellossom', 'Boltund', 'Escavalier', 'Farigiraf', 'Gothitelle', 'Gyarados-Base', 'Kabutops', 'Kilowattrel', 'Klawf', 'Magmortar', 'Mamoswine', 'Metagross-Base', 'Miltank', 'Oricorio-Base', 'Orthworm', 'Persian-Base', 'Pinsir-Base', 'Polteageist', 'Pyukumuku', 'Rotom-Mow', 'Scizor-Base', 'Shiftry', 'Simisear', 'Skarmory-Base', 'Slowbro-Galar', 'Slurpuff', 'Thievul', 'Torkoal', 'Toxtricity-Base', 'Turtonator', 'Tyranitar-Base', 'Wailord',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Aug 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Arcanine-Base', 'Arctozolt', 'Ariados', 'Ceruledge', 'Crabominable-Base', 'Crawdaunt', 'Cyclizar', 'Dachsbun', 'Decidueye-Base', 'Donphan', 'Dragalge-Base', 'Espeon', 'Exeggutor-Base', 'Feraligatr-Base', 'Gardevoir-Base', 'Garganacl', 'Glalie-Base', 'Grafaiai', 'Kecleon', 'Kingler', 'Mabosstiff', 'Mandibuzz', 'Munkidori', 'Obstagoon', 'Omastar', 'Parasect', 'Politoed', 'Swanna', 'Tentacruel', 'Trevenant', 'Ursaring', 'Vikavolt-Base', 'Wigglytuff', 'Wormadam-Trash', 'Yanmega',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jul 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Accelgor', 'Aggron-Base', 'Carbink', 'Carracosta', 'Clodsire', 'Cloyster', 'Emboar-Base', 'Florges', 'Heatmor', 'Heliolisk', 'Heracross-Base', 'Hydreigon', 'Illumise', 'Klinklang', 'Kricketune', 'Lanturn', 'Linoone-Base', 'Lucario-Base', 'Malamar-Base', 'Mawile-Base', 'Mismagius', 'Mothim', 'Purugly', 'Rampardos', 'Raticate-Base', 'Samurott-Base', 'Seaking', 'Seismitoad', 'Slowbro-Base', 'Sudowoodo', 'Tyrantrum', 'Vaporeon', 'Vileplume', 'Zangoose', 'Zebstrika',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jun 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Ampharos-Base', 'Arbok', 'Beheeyem', 'Bombirdier', 'Claydol', 'Cramorant-Base', 'Cursola', 'Dubwool', 'Flygon', 'Gastrodon', 'Hitmontop', 'Houndstone', 'Jumpluff', 'Ledian', 'Magmortar', 'Mesprit', 'Milotic', 'Okidogi', 'Pachirisu', 'Pincurchin', 'Probopass', 'Regice', 'Scrafty-Base', 'Seviper', 'Sharpedo-Base', 'Shiftry', 'Shiinotic', 'Sigilyph', 'Slowbro-Galar', 'Slurpuff', 'Swampert-Base', 'Torterra', 'Toxicroak', 'Virizion', 'Weezing-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [May 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Ambipom', 'Appletun', 'Azumarill', 'Banette-Base', 'Bellossom', 'Brambleghast', 'Bruxish', 'Delcatty', 'Donphan', 'Dragalge-Base', 'Drapion', 'Eiscue', 'Floatzel', 'Furfrou', 'Klefki', 'Leafeon', 'Lumineon', 'Malamar-Base', 'Mimikyu-Base', 'Morpeko', 'Ninetales-Base', 'Ninjask', 'Orthworm', 'Perrserker', 'Pyukumuku', 'Quagsire', 'Rabsca', 'Rapidash-Galar', 'Rhydon', 'Salazzle-Base', 'Sandslash-Base', 'Tatsugiri-Curly', 'Tatsugiri-Droopy', 'Tatsugiri-Stretchy', 'Wugtrio', 'Xatu', 'Zoroark-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Apr 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Articuno-Base', 'Brute Bonnet', 'Cacturne', 'Clefable-Base', 'Cobalion', 'Drifblim', 'Dugtrio-Base', 'Gabite', 'Gogoat', 'Hariyama', /* 'Hawlucha-Base', */ 'Hippowdon', 'Krookodile', 'Lurantis-Base', 'Lycanroc-Base', 'Mabosstiff', 'Minior-Base', 'Munkidori', 'Passimian', 'Pawmot', 'Persian-Base', 'Raichu-Alola', 'Roserade', 'Rotom-Heat', 'Sandaconda', 'Sceptile-Base', /* 'Sigilyph', */ 'Stoutland', 'Stunfisk-Base', 'Tentacruel', 'Thwackey', 'Tinkaton', 'Toedscruel', 'Tsareena', 'Uxie', 'Vivillon', 'Whiscash',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Mar 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Aerodactyl-Base', 'Arctozolt', 'Armaldo', 'Armarouge', 'Bronzong', 'Centiskorch', 'Cherrim-Base', 'Cyclizar', 'Dhelmise', 'Dondozo', 'Drakloak', 'Empoleon', 'Glaceon', 'Golduck', 'Gyarados-Base', 'Jellicent', 'Jumpluff', 'Kecleon', 'Kilowattrel', 'Kingdra', 'Lunatone', 'Musharna', 'Noivern', 'Palossand', 'Pincurchin', 'Reuniclus', 'Revavroom', 'Sandslash-Alola', 'Snorlax', 'Solrock', 'Stonjourner', 'Tyranitar-Base', 'Vaporeon', 'Virizion', 'Wigglytuff',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Feb 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC'],
		unbanlist: [
			'Articuno-Galar', 'Aurorus', 'Bellossom', 'Bewear', 'Blastoise-Base', 'Dodrio', 'Entei', 'Falinks-Base', 'Flygon', 'Furret', 'Goodra-Hisui', 'Gumshoos-Base', 'Heliolisk', 'Hydrapple', 'Indeedee-F', 'Iron Thorns', 'Leavanny', 'Lickilicky', 'Ludicolo', 'Maractus', 'Meganium-Base', 'Polteageist', 'Probopass', 'Regieleki', 'Rhyperior', 'Seismitoad', 'Shiinotic', 'Slaking', 'Spidops', 'Spiritomb', 'Unfezant', 'Vanilluxe', 'Victreebel-Base', 'Weezing-Galar', 'Wyrdeer',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jan 2026]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Carracosta', 'Celebi', 'Cinccino', 'Cobalion', 'Cradily', 'Dedenne', 'Fezandipiti', 'Gabite', 'Granbull', 'Greedent', 'Hatterene', 'Heatmor', 'Houndstone', 'Indeedee-M', 'Lilligant-Base', 'Medicham-Base', 'Orbeetle', 'Oricorio-Pom-Pom', 'Overqwil', 'Pincurchin', 'Pinsir-Base', 'Rotom-Wash', 'Samurott-Base', 'Scovillain-Base', 'Sharpedo-Base', 'Shedinja', 'Shiftry', 'Steelix-Base', 'Tropius', 'Type: Null', 'Typhlosion-Hisui', 'Tyrantrum', 'Veluza', 'Vivillon', 'Whimsicott',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Dec 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Mamoswine', 'Oricorio-Baile', 'Galvantula', 'Bombirdier', 'Gothitelle', 'Drampa-Base', 'Perrserker', 'Glastrier', 'Klinklang', 'Walrein', 
			'Uxie', 'Vanilluxe', 'Serperior', 'Revavroom', 'Falinks-Base', 'Braviary-Hisui', 'Wyrdeer', 'Beedrill-Base', 'Blastoise-Base', 'Squawkabilly-Green', 
			'Swoobat', 'Lurantis-Base', 'Hypno', 'Scrafty-Base', 'Sinistcha', 'Cyclizar', 'Mothim', 'Mismagius', 'Goodra-Base', 'Mandibuzz', 'Delcatty', 
			'Skarmory-Base', 'Cherrim-Base', 'Centiskorch', 'Wishiwashi',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Nov 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Altaria-Base', 'Ampharos-Base', 'Arbok', 'Armaldo', 'Calyrex-Base', 'Castform-Base', 'Dewgong', 'Drifblim', 'Emolga', 'Fearow', 'Furret', 'Glalie-Base', 'Gumshoos-Base', 'Heliolisk', 'Jumpluff', 'Kecleon', 'Ludicolo', 'Lunatone', 'Luxray', 'Lycanroc-Midnight', 'Meowstic-M', 'Primeape', 'Pupitar', 'Pyroar-Base', 'Rampardos', 'Scovillain-Base', 'Silvally-Fairy', 'Simisage', 'Sneasel-Hisui', 'Spidops', 'Swalot', 'Thievul', 'Tinkaton', 'Whiscash', 'Zangoose',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Oct 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Ambipom', 'Armarouge', 'Articuno-Base', 'Basculegion-F', 'Bibarel', 'Copperajah', 'Corviknight', 'Crobat', 'Dudunsparce', 'Dugtrio-Alola', 'Farigiraf', 'Floatzel', 'Froslass-Base', 'Golem-Alola', 'Hippowdon', 'Magmortar', 'Meganium-Base', 'Moltres-Base', 'Muk-Alola', 'Munkidori', 'Nidoking', 'Ninjask', 'Orthworm', 'Perrserker', 'Porygon-Z', 'Pyukumuku', 'Sandslash-Base', 'Sigilyph', 'Simisear', 'Sirfetch’d', 'Steelix-Base', 'Tauros-Base', 'Tauros-Paldea-Aqua', 'Weezing-Galar', 'Zoroark-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Sep 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Arbok', 'Avalugg-Base', 'Cacturne', 'Chesnaught-Base', 'Clodsire', 'Cobalion', 'Crawdaunt', 'Eldegoss', 'Empoleon', 'Falinks-Base', 'Feraligatr-Base', 'Ferrothorn', 'Florges', 'Galvantula', 'Grimmsnarl', 'Klawf', 'Lucario-Base', 'Ludicolo', 'Mantine', 'Marowak-Alola', 'Milotic', 'Musharna', 'Overqwil', 'Pincurchin', 'Primeape', 'Regice', 'Sceptile-Base', 'Scolipede-Base', 'Silvally-Dragon', 'Slurpuff', 'Torterra', 'Toxicroak', 'Trapinch', 'Vikavolt-Base', 'Wormadam-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Aug 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Amoonguss', 'Arcanine-Base', 'Basculegion-F', 'Beartic', 'Brambleghast', 'Chandelure-Base', 'Chesnaught-Base', 'Cobalion', 'Copperajah', 'Cramorant-Base', 'Cursola', 'Dugtrio-Base', 'Eldegoss', 'Flygon', 'Froslass-Base', 'Frosmoth', 'Gabite', 'Gardevoir-Base', 'Hatterene', 'Heliolisk', 'Incineroar', 'Jolteon', 'Liepard', 'Maractus', 'Maushold', 'Oricorio-Pom-Pom', 'Overqwil', 'Shedinja', 'Stoutland', 'Sylveon', 'Toxapex', 'Toxicroak', 'Uxie', 'Weavile', 'Yanmega',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jul 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Arctovish', 'Azumarill', 'Blastoise-Base', 'Boltund', 'Bouffalant', 'Brambleghast', 'Braviary-Base', 'Chimecho-Base', 'Cofagrigus', 'Dachsbun', 'Darmanitan-Base', 'Delibird', 'Drakloak', 'Floatzel', 'Flygon', 'Gliscor', 'Grapploct', 'Incineroar', 'Kleavor', 'Lunatone', 'Mabosstiff', 'Marowak-Alola', 'Meowstic-F', 'Minun', 'Obstagoon', 'Persian-Alola', 'Primeape', 'Rapidash-Base', 'Raticate-Base', 'Reuniclus', 'Rillaboom', 'Rotom-Mow', 'Silvally-Ground', 'Simisage', 'Slowbro-Galar', 'Slowking-Base', 'Slowking-Galar', 'Starmie-Base', 'Tentacruel', 'Toedscruel',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jun 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Arbok', 'Archeops', 'Arctozolt', 'Bruxish', 'Calyrex-Base', 'Ditto', 'Drakloak', 'Dugtrio-Alola', 'Electrode-Base',
			'Escavalier', 'Espeon', 'Furfrou', 'Glimmora-Base', 'Grapploct', 'Honchkrow', 'Klawf', 'Lunatone', 'Luvdisc',
			'Masquerain', 'Mienshao', 'Mimikyu-Base', 'Orbeetle', 'Primeape', 'Purugly', 'Quaquaval', 'Rabsca', 'Simipour',
			'Simisage', 'Slowking-Base', 'Slowking-Galar', /* 'Smeargle' */ 'Togekiss', 'Tangrowth', 'Toedscruel', 'Tyranitar-Base', 'Uxie',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [May 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Inteleon', 'Dragonair', 'Vivillon', 'Heatmor', 'Cinccino', 'Lopunny-Base', 'Politoed', 'Skarmory-Base', 'Maushold',
			'Nidoking', 'Jumpluff', 'Ribombee-Base', 'Mudsdale', 'Drednaw', 'Meganium-Base', 'Kecleon', 'Barraskewda', 'Goodra-Base',
			'Carbink', 'Raichu-Base', 'Honchkrow', 'Venusaur-Base', 'Cofagrigus', 'Lokix', 'Frosmoth', 'Pinsir-Base', 'Empoleon',
			'Shiinotic', 'Hitmontop', 'Claydol', 'Tangrowth', 'Swoobat', 'Swellow', 'Mienshao', 'Ninetales-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Apr 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Kingdra', 'Crustle', 'Corsola-Base', 'Dipplin', 'Dusknoir', 'Drampa-Base', 'Pincurchin', 'Type: Null', 'Camerupt-Base',
			'Rotom-Base', 'Raticate-Base', 'Bombirdier', 'Cradily', 'Beedrill-Base', 'Gastrodon', 'Donphan', 'Chimecho-Base', 'Coalossal',
			'Dustox', 'Dedenne', 'Kecleon', 'Flareon', 'Cyclizar', 'Grumpig', 'Tentacruel', 'Miltank', 'Arcanine-Base',
			'Shelgon', 'Spinda', 'Wormadam-Sandy', 'Exploud', 'Marowak-Base', 'Hypno', 'Furret', 'Bastiodon',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Mar 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Gourgeist-Small', 'Kingler', 'Rapidash-Base', 'Accelgor', 'Ariados', 'Magcargo', 'Sudowoodo', 'Qwilfish-Base', 'Eldegoss',
			'Stunfisk-Base', 'Raichu-Base', 'Klawf', 'Scolipede-Base', 'Gabite', 'Jynx', 'Linoone-Base', 'Unfezant', 'Revavroom',
			'Appletun', 'Kabutops', 'Wyrdeer', 'Charizard-Base', 'Grafaiai', 'Golem-Base', 'Medicham-Base', 'Thievul', 'Lucario-Base',
			'Mantine', 'Wormadam-Trash', 'Morpeko-Base', 'Drifblim', 'Granbull', 'Swalot', 'Aggron-Base', 'Luxray',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Feb 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Rapidash-Galar', 'Whiscash', 'Scrafty-Base', 'Uxie', 'Arbok', 'Zangoose', 'Carnivine', 'Persian-Alola', 'Emolga',
			'Araquanid-Base', 'Pincurchin', 'Hitmonchan', 'Maractus', 'Dewgong', 'Spinda', 'Breloom', 'Parasect', 'Sigilyph',
			'Ambipom', 'Zygarde-10%', 'Tauros-Base', 'Glalie-Base', 'Golduck', 'Pangoro', 'Weezing-Base', 'Zweilous', 'Pinsir-Base',
			'Musharna', 'Cacturne', 'Regigigas', 'Arctozolt', 'Bewear', 'Kecleon', 'Alcremie', 'Togedemaru-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jan 2025]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Clodsire', 'Comfey', 'Probopass', 'Bellibolt', 'Wugtrio', 'Unown', 'Shiftry', 'Swanna', 'Houndoom-Base',
			'Oricorio-Pom-Pom', 'Cursola', 'Slowbro-Base', 'Goodra-Base', 'Torkoal', 'Shaymin-Base', 'Infernape', 'Mesprit', 'Alcremie',
			'Golurk-Base', 'Dachsbun', 'Vileplume', 'Scyther', 'Donphan', 'Toedscruel', 'Sawsbuck', 'Reuniclus', 'Spiritomb',
			'Type: Null', 'Virizion', 'Absol-Base', 'Flapple', 'Crawdaunt', 'Kecleon', 'Jynx', 'Kingdra',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Dec 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Golem-Alola', 'Zoroark-Base', 'Pyukumuku', 'Guzzlord', 'Wugtrio', 'Garbodor', 'Aurorus', 'Morpeko-Base', 'Walrein',
			'Roserade', 'Ribombee-Base', 'Carracosta', 'Perrserker', 'Cryogonal', 'Appletun', 'Primarina', 'Pachirisu', 'Banette-Base',
			'Celebi', 'Avalugg-Base', 'Wo-Chien', 'Pupitar', 'Cetitan', 'Milotic', 'Scovillain-Base', 'Dipplin', 'Chandelure-Base',
			'Toxicroak', 'Magmortar', 'Yanmega', 'Cacturne', 'Luvdisc', 'Mawile-Base', 'Jumpluff', 'Rotom-Frost',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Nov 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Wishiwashi-Base', 'Ampharos-Base', 'Tsareena', 'Glaceon', 'Centiskorch', 'Frosmoth', 'Exeggutor-Base', 'Shelgon', 'Granbull',
			'Guzzlord', 'Reuniclus', 'Spiritomb', 'Unown', 'Shedinja', 'Lurantis-Base', 'Gabite', 'Gourgeist-Base', 'Ledian',
			'Golduck', 'Qwilfish-Base', 'Pinsir-Base', 'Gumshoos-Base', 'Wigglytuff', 'Arbok', 'Dusknoir', 'Araquanid-Base', 'Kecleon',
			'Exeggutor-Alola', 'Trapinch', 'Appletun', 'Turtonator', 'Drampa-Base', 'Gorebyss', 'Gourgeist-Super', 'Galvantula',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Oct 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Ninjask', 'Perrserker', 'Klinklang', 'Snorlax', 'Houndstone', 'Amoonguss', 'Seviper', 'Rhydon', 'Vigoroth',
			'Bellossom', 'Sandaconda', 'Samurott-Base', 'Honchkrow', 'Scyther', 'Clawitzer', 'Bisharp', 'Sinistcha-Base', 'Guzzlord',
			'Porygon-Z', 'Sylveon', 'Sudowoodo', 'Vikavolt-Base', 'Noivern', 'Blastoise-Base', 'Dudunsparce', 'Dugtrio-Alola', 'Gengar-Base',
			'Emboar-Base', 'Munkidori', 'Zoroark-Hisui', 'Stoutland', 'Accelgor', 'Stunfisk-Base', 'Magmortar', 'Doublade',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Sep 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Starmie-Base', 'Muk-Alola', 'Krookodile', 'Slowking-Galar', 'Gabite', 'Florges', 'Bellibolt', 'Rotom-Fan', 'Beartic',
			'Hatterene', 'Fearow', 'Simisage', 'Pyroar-Base', 'Politoed', 'Mudsdale', 'Manectric-Base', 'Rhydon', 'Simisear',
			'Basculin-White-Striped', 'Swalot', 'Wyrdeer', 'Klawf', 'Flareon', 'Wugtrio', 'Glimmora-Base', 'Clodsire', 'Armaldo',
			'Togedemaru-Base', 'Toxicroak', 'Arctibax', 'Komala', 'Spidops', 'Sandslash-Alola', 'Dustox', 'Accelgor',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Aug 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Mandibuzz', 'Braviary-Base', 'Dusclops', 'Sawk', 'Corsola-Base', 'Maushold-Base', 'Vivillon', 'Runerigus', 'Chesnaught-Base',
			'Rotom-Heat', 'Dhelmise', 'Illumise', 'Seviper', 'Boltund', 'Braviary-Hisui', 'Mamoswine', 'Charizard-Base', 'Smeargle',
			'Donphan', 'Musharna', 'Muk-Alola', 'Frosmoth', 'Sableye-Base', 'Blissey', 'Heracross-Base', 'Eelektross-Base', 'Trapinch',
			'Fezandipiti', 'Golem-Alola', 'Lanturn', 'Quagsire', 'Squawkabilly-Yellow', 'Cradily', 'Scizor-Base', 'Vanilluxe',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jul 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Venusaur-Base', 'Shiftry', 'Mabosstiff', 'Donphan', 'Rotom-Heat', 'Garbodor', 'Blastoise-Base', 'Oricorio-Pom-Pom', 'Tinkaton',
			'Lilligant-Base', 'Claydol', 'Brambleghast', 'Noctowl', 'Aggron-Base', 'Rapidash-Galar', 'Muk-Base', 'Rampardos', 'Houndoom-Base',
			'Masquerain', 'Dachsbun', 'Cloyster', 'Rotom-Mow', 'Flareon', 'Eiscue-Base', 'Hitmontop', 'Charizard-Base', 'Primeape',
			'Shedinja', 'Pawmot', 'Goodra-Base', 'Mantine', 'Furret', 'Slurpuff', 'Torterra', 'Scrafty-Base', 'Yanmega',
			'Mamoswine', 'Dondozo', 'Porygon2', 'Kingdra', 'Chesnaught-Base', 'Ferrothorn', 'Zebstrika', 'Regice',
			'Slowking-Base', 'Klawf', 'Trapinch',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jun 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Mimikyu-Base', 'Cacturne', 'Mabosstiff', 'Cyclizar', 'Raticate-Alola', 'Wyrdeer', 'Pincurchin', 'Slowbro-Galar', 'Arboliva',
			'Heliolisk', 'Trapinch', 'Runerigus', 'Gabite', 'Illumise', 'Probopass', 'Banette-Base', 'Exeggutor-Base', 'Registeel',
			'Squawkabilly-Base', 'Delphox-Base', 'Spidops', 'Indeedee-M', 'Scyther', 'Fearow', 'Magcargo', 'Walrein', 'Crabominable-Base',
			'Toxicroak', 'Bellibolt', 'Rotom-Wash', 'Avalugg-Base', 'Raichu-Alola', 'Sirfetch’d', 'Talonflame', 'Kricketune',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [May 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Carbink', 'Mantine', 'Dusknoir', 'Cryogonal', 'Milotic', 'Mr. Mime-Base', 'Hitmonchan', 'Shiinotic', 'Beheeyem',
			'Drampa-Base', 'Oinkologne-F', 'Dustox', 'Sunflora', 'Raichu-Alola', 'Meowstic-Base', 'Dachsbun', 'Calyrex-Base', 'Arbok',
			'Octillery', 'Maushold-Base', 'Grafaiai', 'Torkoal', 'Miltank', 'Froslass-Base', 'Ariados', 'Sableye-Base', 'Cherrim-Base',
			'Simisear', 'Salazzle-Base', 'Zoroark-Base', 'Emolga', 'Wobbuffet', 'Klawf', 'Delcatty', 'Drakloak',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Apr 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Lokix', 'Sandslash-Alola', 'Altaria-Base', 'Gengar-Base', 'Drampa-Base', 'Dugtrio-Alola', 'Stoutland', 'Golisopod-Base', 'Abomasnow-Base',
			'Frosmoth', 'Fezandipiti', 'Golduck', 'Vespiquen', 'Decidueye-Base', 'Charizard-Base', 'Hippowdon', 'Rabsca', 'Coalossal',
			'Houndstone', 'Leafeon', 'Glaceon', 'Slowking-Base', 'Manectric-Base', 'Alomomola', 'Accelgor', 'Mismagius', 'Dachsbun',
			'Tentacruel', 'Sandslash-Base', 'Tinkaton', 'Roserade', 'Sableye-Base', 'Palossand', 'Cobalion', 'Garbodor',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Mar 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Oricorio-Base', 'Wigglytuff', 'Phione', 'Politoed', 'Ninjask', 'Samurott-Base', 'Galvantula', 'Mesprit', 'Scrafty-Base',
			'Rotom-Fan', 'Greedent', 'Seaking', 'Swampert-Base', 'Weezing-Galar', 'Shelgon', 'Leafeon', 'Cacturne', 'Turtonator',
			'Magmortar', 'Lilligant-Base', 'Sirfetch’d', 'Oricorio-Sensu', 'Persian-Alola', 'Farigiraf', 'Pinsir-Base', 'Primeape', 'Tatsugiri-Base',
			'Dugtrio-Alola', 'Flygon', 'Regice', 'Ditto', 'Grafaiai', 'Pidgeot-Base', 'Palossand', 'Ribombee-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Feb 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Tauros-Paldea-Blaze', 'Ceruledge', 'Klinklang', 'Houndstone', 'Gothitelle', 'Snorlax', 'Sandslash-Base', 'Morpeko-Base', 'Sawk',
			'Nidoqueen', 'Lickilicky', 'Shiftry', 'Vanilluxe', 'Jynx', 'Wormadam-Trash', 'Vigoroth', 'Mr. Rime', 'Skarmory-Base',
			'Tyrantrum', 'Aromatisse', 'Primarina', 'Golem-Alola', 'Maushold-Base', 'Pangoro', 'Malamar-Base', 'Clodsire', 'Klawf',
			'Meganium-Base', 'Quagsire', 'Toxicroak', 'Wugtrio', 'Walrein', 'Raichu-Base', 'Serperior', 'Zebstrika',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jan 2024]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Hatterene', 'Drakloak', 'Luvdisc', 'Tangrowth', 'Snorlax', 'Starmie-Base', 'Ursaring', 'Appletun', 'Stoutland',
			'Musharna', 'Chatot', 'Masquerain', 'Gorebyss', 'Kecleon', 'Avalugg-Hisui', 'Rhyperior', 'Beedrill-Base', 'Meowstic-F',
			'Probopass', 'Dewgong', 'Braviary-Base', 'Houndoom-Base', 'Gothitelle', 'Crobat', 'Tentacruel', 'Eldegoss', 'Seaking',
			'Lapras', 'Ferrothorn', 'Dubwool', 'Araquanid-Base', 'Yanmega', 'Dudunsparce', 'Slowking-Base', 'Lucario-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Dec 2023]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Mabosstiff', 'Eelektross-Base', 'Camerupt-Base', 'Grapploct', 'Drifblim', 'Ampharos-Base', 'Lurantis-Base', 'Gyarados-Base', 'Hypno',
			'Druddigon', 'Durant', 'Chesnaught-Base', 'Gastrodon', 'Eldegoss', 'Pelipper', 'Dodrio', 'Wailord', 'Emolga',
			'Dachsbun', 'Drampa-Base', 'Trevenant', 'Passimian', 'Beautifly', 'Tyranitar-Base', 'Regirock', 'Stunfisk-Galar', 'Morpeko-Base',
			'Jumpluff', 'Heatmor', 'Froslass-Base', 'Audino-Base', 'Cetitan', 'Pincurchin', 'Cradily', 'Ninetales-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Nov 2023]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Copperajah', 'Dhelmise', 'Mudsdale', 'Veluza', 'Bellossom', 'Tropius', 'Cramorant-Base', 'Jellicent', 'Boltund',
			'Scolipede-Base', 'Typhlosion-Base', 'Klefki', 'Metagross-Base', 'Swoobat', 'Honchkrow', 'Cursola', 'Revavroom', 'Swampert-Base',
			'Garbodor', 'Electivire', 'Slurpuff', 'Jynx', 'Bombirdier', 'Mismagius', 'Wyrdeer', 'Lanturn', 'Carnivine',
			'Kangaskhan-Base', 'Bellibolt', 'Kingdra', 'Perrserker', 'Steelix-Base', 'Alcremie', 'Heliolisk', 'Beartic',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Oct 2023 B]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Liepard', 'Dragalge-Base', 'Clefable-Base', 'Clodsire', 'Gigalith', 'Cacturne', 'Porygon2', 'Shuckle', 'Emboar-Base',
			'Doublade', 'Phione', 'Lumineon', 'Toucannon', 'Mandibuzz', 'Cinccino', 'Avalugg-Hisui', 'Sceptile-Base', 'Toedscruel',
			'Hitmontop', 'Golem-Alola', 'Dugtrio-Base', 'Mr. Rime', 'Ariados', 'Pachirisu', 'Ambipom', 'Volbeat', 'Centiskorch',
			'Shiinotic', 'Poliwrath', 'Stoutland', 'Banette-Base', 'Aurorus', 'Mawile-Base', 'Sableye-Base', 'Orthworm',
			'Rotom-Mow', 'Sandslash-Alola', 'Toxicroak', 'Roserade', 'Lopunny-Base', 'Luxray', 'Solrock', 'Cryogonal', 'Noctowl',
			// 'Xatu', banned
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Oct 2023]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Liepard', 'Dragalge-Base', 'Clefable-Base', 'Clodsire', 'Gigalith', 'Cacturne', 'Porygon2', 'Mimikyu-Base', 'Scovillain-Base',
			'Lycanroc-Base', 'Jolteon', 'Bisharp', 'Togekiss', 'Starmie-Base', 'Shuckle', 'Emboar-Base', 'Doublade', 'Phione',
			'Lumineon', 'Toucannon', 'Mandibuzz', 'Rotom-Base', 'Falinks-Base', 'Magnezone', 'Dondozo', 'Brambleghast', 'Goodra-Base',
			'Articuno-Base', 'Cinccino', 'Avalugg-Hisui', 'Sceptile-Base', 'Toedscruel', 'Hitmontop', 'Golem-Alola', 'Dugtrio-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Sep 2023]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Zoroark-Hisui', 'Yanmega', 'Mothim', 'Rapidash-Galar', 'Drapion', 'Chimecho-Base', 'Espeon', 'Vaporeon', 'Mamoswine',
			'Vespiquen', 'Barbaracle-Base', 'Shedinja', 'Alakazam-Base', 'Glaceon', 'Staraptor-Base', 'Electrode-Hisui', 'Lickilicky', 'Whiscash',
			'Cherrim-Base', 'Armaldo', 'Slowking-Base', 'Kingler', 'Dudunsparce', 'Watchog', 'Flygon', 'Granbull', 'Decidueye-Base',
			'Flareon', 'Bronzong', 'Rampardos', 'Fearow', 'Relicanth', 'Hitmonlee', 'Altaria-Base', 'Tinkaton',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Aug 2023]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Vileplume', 'Swanna', 'Yanmega', 'Heracross-Base', 'Nidoking', 'Leafeon', 'Kricketune', 'Swellow', 'Comfey',
			'Bibarel', 'Empoleon', 'Ludicolo', 'Tangrowth', 'Simisear', 'Parasect', 'Krookodile', 'Eelektross-Base', 'Abomasnow-Base',
			'Avalugg-Base', 'Bastiodon', 'Dusclops', 'Minior-Base', 'Masquerain', 'Victreebel-Base', 'Rabsca', 'Linoone-Base', 'Omastar',
			'Politoed', 'Ledian', 'Donphan', 'Magcargo', 'Bombirdier', 'Dedenne', 'Butterfree', 'Jynx',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes VGC [Jul 2023]",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard 35 Pokes VGC', 'Terastal Clause'],
		unbanlist: [
			'Leavanny', 'Masquerain', 'Eiscue-Base', 'Torterra', 'Dragonair', 'Runerigus', 'Swalot', 'Muk-Alola', 'Musharna',
			'Hippowdon', 'Alomomola', 'Aggron-Base', 'Umbreon', 'Galvantula', 'Pawmot', 'Quagsire', 'Slurpuff', 'Sigilyph',
			'Vaporeon', 'Blastoise-Base', 'Aegislash-Base', 'Scizor-Base', 'Spiritomb', 'Golisopod-Base', 'Clawitzer', 'Ninetales-Base', 'Delphox-Base',
			'Typhlosion-Base', 'Marowak-Base', 'Porygon-Z', 'Jumpluff', 'Absol-Base', 'Porygon2', 'Rotom-Frost', 'Rotom-Mow',
		],
	},

	// endregion

	// endregion

	// region 35 Pokes Extended

	{
		section: '35 Pokes Tours',
		column: 4,
	},
	{
		name: "[Gen 9] ND 35 Pokes All-Stars",
		desc: '35 Pokes month vs month format using the modern ruleset.',
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		validateTeam(team, options) {
			// validating using modern ruleset; only the allowed pokemon list needs to be swapped.
			const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
				require('../sim/team-validator').TeamValidator;
			const val = new TeamValidator('[Gen 9] ND 35 Pokes [Jun 2026]');

			// shallow copying jun26 ruletable so we don't have to write over it.
			const rt = new RuleTable();
			for (const k in val.ruleTable) {
				// @ts-expect-error harmless
				rt[k] = val.ruleTable[k];
			}
			for (const [k, v] of val.ruleTable) {
				rt.set(k, v);
			}

			// @ts-expect-error harmless, but shouldn't be done carelessly
			val.ruleTable = rt;

			const months: string[] = [
				'[Gen 9] ND 35 Pokes [Jun 2026]',
				'[Gen 9] ND 35 Pokes [May 2026]',
				'[Gen 9] ND 35 Pokes [Apr 2026]',
				'[Gen 9] ND 35 Pokes [Mar 2026]',
				'[Gen 9] ND 35 Pokes [Feb 2026]',
				'[Gen 9] ND 35 Pokes [Jan 2026]',
				'[Gen 9] ND 35 Pokes [Dec 2025]',
				'[Gen 9] ND 35 Pokes [Nov 2025]',
				'[Gen 9] ND 35 Pokes [Oct 2025]',
				'[Gen 9] ND 35 Pokes [Sep 2025]',
				'[Gen 9] ND 35 Pokes [Aug 2025]',
				// '[Gen 9] ND 35 Pokes [Jul 2025]',
				'[Gen 9] ND 35 Pokes [Jun 2025]',
				'[Gen 9] ND 35 Pokes [May 2025]',
				'[Gen 9] ND 35 Pokes [Apr 2025]',
				'[Gen 9] ND 35 Pokes [Mar 2025]',
				'[Gen 9] ND 35 Pokes [Feb 2025]',
				'[Gen 9] ND 35 Pokes [Jan 2025]',
				'[Gen 9] ND 35 Pokes [Dec 2024]',
				'[Gen 9] ND 35 Pokes [Nov 2024]',
				'[Gen 9] ND 35 Pokes [Oct 2024]',
				'[Gen 9] ND 35 Pokes [Sep 2024]',
				'[Gen 9] ND 35 Pokes [Aug 2024]',
				// '[Gen 9] ND 35 Pokes [Jul 2024]',
				'[Gen 9] ND 35 Pokes [Jun 2024]',
				'[Gen 9] ND 35 Pokes [May 2024]',
				'[Gen 9] ND 35 Pokes [Apr 2024]',
				'[Gen 9] ND 35 Pokes [Mar 2024]',
				'[Gen 9] ND 35 Pokes [Feb 2024]',
				'[Gen 9] ND 35 Pokes [Jan 2024]',
				'[Gen 9] ND 35 Pokes [Dec 2023]',
				'[Gen 9] ND 35 Pokes [Nov 2023]',
				// '[Gen 9] ND 35 Pokes [Oct 2023 B]',
				'[Gen 9] ND 35 Pokes [Oct 2023]',
				'[Gen 9] ND 35 Pokes [Sep 2023]',
				'[Gen 9] ND 35 Pokes [Aug 2023]',
				'[Gen 9] ND 35 Pokes [Jul 2023]',
			];
			let shortestErrors: string[] = [];
			let closestFormat = '';
			for (const month of months) {
				const format = Dex.formats.get(month);
				if (!format.exists) continue;
				// using a new array here to avoid jankiness from iterating and deleting.
				for (const key of [...rt.keys()]) {
					if (key.startsWith('+pokemon:') || key.startsWith('+basepokemon:')) {
						rt.delete(key);
					}
				}
				for (const x of format.unbanlist) {
					const rule = this.dex.formats.validateBanRule(x);
					if (rule.startsWith('pokemon:') || rule.startsWith('basepokemon:')) {
						rt.set('+' + rule, '');
					}
				}
				const errors = val.validateTeam(team, options);
				if (!errors?.length) {
					// team is valid for this month
					return;
				}
				if (!shortestErrors.length || shortestErrors.length > errors.length) {
					shortestErrors = errors;
					closestFormat = month;
				}
			}
			return [
				'Your team is not valid for any of the legal months. Keep in mind that the modern ruleset is used ' +
				`in all months: Sleep Moves Clause, Shed Tail ban, etc. The closest format (${closestFormat}) gives these errors:`,
				...shortestErrors,
			];
		},
		onBegin() {
			// i wish we could just carry this information over from the validator ^^
			const months: [string, RuleTable][] = [
				'[Gen 9] ND 35 Pokes [Jun 2026]',
				'[Gen 9] ND 35 Pokes [May 2026]',
				'[Gen 9] ND 35 Pokes [Apr 2026]',
				'[Gen 9] ND 35 Pokes [Mar 2026]',
				'[Gen 9] ND 35 Pokes [Feb 2026]',
				'[Gen 9] ND 35 Pokes [Jan 2026]',
				'[Gen 9] ND 35 Pokes [Dec 2025]',
				'[Gen 9] ND 35 Pokes [Nov 2025]',
				'[Gen 9] ND 35 Pokes [Oct 2025]',
				'[Gen 9] ND 35 Pokes [Sep 2025]',
				'[Gen 9] ND 35 Pokes [Aug 2025]',
				// '[Gen 9] ND 35 Pokes [Jul 2025]',
				'[Gen 9] ND 35 Pokes [Jun 2025]',
				'[Gen 9] ND 35 Pokes [May 2025]',
				'[Gen 9] ND 35 Pokes [Apr 2025]',
				'[Gen 9] ND 35 Pokes [Mar 2025]',
				'[Gen 9] ND 35 Pokes [Feb 2025]',
				'[Gen 9] ND 35 Pokes [Jan 2025]',
				'[Gen 9] ND 35 Pokes [Dec 2024]',
				'[Gen 9] ND 35 Pokes [Nov 2024]',
				'[Gen 9] ND 35 Pokes [Oct 2024]',
				'[Gen 9] ND 35 Pokes [Sep 2024]',
				'[Gen 9] ND 35 Pokes [Aug 2024]',
				// '[Gen 9] ND 35 Pokes [Jul 2024]',
				'[Gen 9] ND 35 Pokes [Jun 2024]',
				'[Gen 9] ND 35 Pokes [May 2024]',
				'[Gen 9] ND 35 Pokes [Apr 2024]',
				'[Gen 9] ND 35 Pokes [Mar 2024]',
				'[Gen 9] ND 35 Pokes [Feb 2024]',
				'[Gen 9] ND 35 Pokes [Jan 2024]',
				'[Gen 9] ND 35 Pokes [Dec 2023]',
				'[Gen 9] ND 35 Pokes [Nov 2023]',
				// '[Gen 9] ND 35 Pokes [Oct 2023 B]',
				'[Gen 9] ND 35 Pokes [Oct 2023]',
				'[Gen 9] ND 35 Pokes [Sep 2023]',
				'[Gen 9] ND 35 Pokes [Aug 2023]',
				'[Gen 9] ND 35 Pokes [Jul 2023]',
			]
				.map((x) => this.dex.formats.get(x))
				.filter((x) => x.exists)
				.map((x) => [x.name, this.dex.formats.getRuleTable(x)]);
			let buf = 'raw|<div class="broadcast-blue"><b>Months represented in this battle:</b>';
			for (const side of this.sides) {
				const month = months.find(([name, ruleTable]) =>
					side.pokemon.every(({ species }) => !ruleTable.isBannedSpecies(species))
				);
				buf += `<br><b>${side.name}: ${month?.[0] ?? '?'}</b>`;
			}
			buf += `</div>`;
			this.add(buf);
		},
	},
	{
		name: "[Gen 9] ND 35 Pokes NFE [Nov 2024]",
		desc: '35 Pokes x NFE collab.',
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Steenee', 'Cutiefly', 'Duosion', 'Charmeleon', 'Quilladin', 'Meditite', 'Dewott', 'Aipom', 'Fletchinder', 'Poipole', 'Shelgon', 'Ivysaur', 'Pawmo', 'Growlithe-Hisui', 'Trumbeak', 'Marshtomp', 'Mudbray', 'Vanillish', 'Prinplup', 'Sliggoo-Base', 'Vibrava', 'Dartrix', 'Nidorino', 'Loudred', 'Dolliv', 'Flittle', 'Drakloak', 'Brionne', 'Whirlipede', 'Braixen', 'Murkrow', 'Crocalor', 'Krokorok', 'Flaaffy', 'Wartortle',
		],
	},
	// TODO: generic forcemonocolor
	{
		name: "[Gen 9] ND 35 Pokes Monocolor [May 2024]",
		desc: '35 Pokes x Monocolor collab.',
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause', /* 'Force Monocolor' */],
		unbanlist: [
			'Kingler', 'Scizor-Base', 'Braviary-Base', 'Crustle', 'Klawf', 'Druddigon', 'Wugtrio', 'Krookodile', 'Armarouge', 'Magmortar', 'Wailord', 'Jumpluff', 'Blastoise-Base', 'Sandslash-Alola', 'Empoleon', 'Nidoqueen', 'Eelektross-Base', 'Aurorus', 'Gastrodon-East', 'Tangrowth', 'Ribombee-Base', 'Vespiquen', 'Sunflora', 'Ampharos-Base', 'Cofagrigus', 'Hypno', 'Falinks-Base', 'Ninetales-Base', 'Typhlosion-Base', 'Exeggutor-Base', 'Carnivine', 'Kecleon', 'Yanmega', 'Araquanid-Base', 'Garbodor', 'Sceptile-Base', 'Politoed', 'Appletun', 'Tyranitar-Base', 'Golurk-Base', 'Claydol', 'Toucannon', 'Houndoom-Base', 'Toedscruel', 'Umbreon', 'Banette-Base', 'Mawile-Base', 'Snorlax', 'Seviper', 'Raticate-Alola', 'Minior-Base', 'Shiftry', 'Brambleghast', 'Perrserker', 'Dachsbun', 'Torkoal', 'Barbaracle-Base', 'Dragalge-Base', 'Clodsire', 'Dugtrio-Base', 'Drifblim', 'Aerodactyl-Base', 'Ambipom', 'Noivern', 'Weezing-Base', 'Starmie-Base', 'Goodra-Base', 'Drapion', 'Pincurchin', 'Gastrodon', 'Unfezant', 'Grafaiai', 'Hakamo-o', 'Golem-Alola', 'Probopass', 'Donphan', 'Golisopod-Base', 'Veluza', 'Steelix-Base', 'Machamp', 'Mesprit', 'Lurantis-Base', 'Bewear', 'Flamigo', 'Tinkaton', 'Clefable-Base', 'Milotic', 'Orthworm', 'Hatterene', 'Slowbro-Base', 'Togekiss', 'Frosmoth', 'Cursola', 'Amoonguss', 'Absol-Base', 'Gardevoir-Base', 'Dubwool', 'Alcremie', 'Maushold', 'Pachirisu',
		],
	},
	{
		section: 'April Fools',
		column: 4,
	},
	{
		name: "[Gen 9] ND 35 Pokes [Mega April]",
		mod: 'megaapril',
		ruleset: ['Standard 35 Pokes', '!35 Pokes Mega Clause'],
		unbanlist: [
			'Abomasnow-Base', 'Abomasnow-Mega', 'Accelgor', 'Alomomola', 'Alomomola-Mega', 'Altaria-Base', 'Altaria-Mega', 'Arcanine-Base', 'Articuno-Base', 'Bastiodon', 'Beedrill-Base', 'Beedrill-Mega', 'Bombirdier', 'Brute Bonnet', 'Cacturne', 'Camerupt-Base', 'Camerupt-Mega', 'Charizard-Base', 'Charizard-Mega-X', 'Charizard-Mega-Y', 'Chimecho-Base', 'Chimecho-Mega', 'Clefable-Base', 'Clefable-Mega', 'Coalossal', 'Cobalion', 'Corsola-Base', 'Cradily', 'Crustle', 'Cyclizar', 'Dachsbun', 'Decidueye-Base', 'Dedenne', 'Dipplin', 'Donphan', 'Drampa-Base', 'Drampa-Mega', 'Drifblim', 'Dugtrio-Alola', 'Dugtrio-Base', 'Dusknoir', 'Dustox', 'Exploud', 'Fezandipiti', 'Flareon', 'Frosmoth', 'Furret', 'Gabite', 'Garbodor', 'Gastrodon', 'Gengar-Base', 'Gengar-Mega', 'Glaceon', 'Gogoat', 'Golduck', 'Golisopod-Base', 'Golisopod-Mega', 'Grumpig', 'Hariyama', 'Hippowdon', 'Houndstone', 'Hypno', 'Kecleon', 'Kingdra', 'Krookodile', 'Leafeon', 'Lokix', 'Lurantis-Base', 'Lycanroc-Base', 'Mabosstiff', 'Manectric-Base', 'Manectric-Mega', 'Marowak-Base', 'Miltank', 'Minior-Base', 'Mismagius', 'Munkidori', 'Palossand', 'Passimian', 'Pawmot', 'Persian-Base', 'Pincurchin', 'Rabsca', 'Raichu-Alola', 'Raichu-Mega-X', 'Raichu-Mega-Y', 'Raticate-Base', 'Roserade', 'Rotom-Base', 'Rotom-Heat', 'Sableye-Base', 'Sableye-Mega', 'Sandaconda', 'Sandslash-Alola', 'Sandslash-Base', 'Sceptile-Base', 'Sceptile-Mega', 'Shelgon', 'Slowking-Base', 'Spinda', 'Stoutland', 'Stunfisk-Base', 'Tentacruel', 'Thwackey', 'Tinkaton', 'Toedscruel', 'Tsareena', 'Type: Null', 'Uxie', 'Vespiquen', 'Vivillon', 'Whiscash', 'Wormadam-Sandy',
		],
		onChangeSet(set, format, setHas, teamHas) {
			if (this.toID(set.species) === 'alomomola' && set.level === 100) {
				set.level = 99;
			}
		},
	},
	{
		name: "[Gen 9] Benjamin Button",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause', 'Scalemons Mod'],
		unbanlist: [
			'Articuno-Base', 'Entei', 'Latias-Base', 'Heatran-Base', 'Thundurus-Base', 'Tapu Bulu', 'Regieleki', 'Venusaur-Base', 'Arctozolt', 'Ting-Lu', 'Ogerpon-Wellspring', 'Dialga-Base', 'Mamoswine', 'Celebi', 'Great Tusk', 'Meloetta-Base', 'Lugia', 'Deino', 'Lechonk', 'Arrokuda', 'Psyduck', 'Ferroseed', 'Beldum', 'Exeggcute', 'Charmander', 'Archen', 'Fomantis', 'Roggenrola', 'Tentacool', 'Munna', 'Hatenna', 'Drilbur', 'Bagon', 'Minccino', 'Whimsicott',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Babies [Apr 2024 AFD]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes LC'],
		unbanlist: [
			'Magikarp', 'Toxel', 'Noibat', 'Mareanie', 'Wooper-Paldea', 'Cyndaquil', 'Sinistea', 'Fomantis', 'Silicobra', 'Meowth-Galar', 'Slowpoke-Base', 'Bagon', 'Lechonk', 'Machop', 'Nosepass', 'Shroodle', 'Baltoy', 'Zigzagoon-Galar', 'Nickit', 'Froakie', 'Drilbur', 'Bounsweet', 'Porygon', 'Magnemite', 'Paras', 'Cubone', 'Sandshrew-Alola', 'Lotad',
			'Chi-Yu', 'Duraludon', 'Scyther', 'Swirlix', 'Honedge', 'Sneasel-Base', 'Cosmog', 'Sneasel-Hisui',
		],
	},
	{
		section: '35 Pokes 1v1',
		column: 4,
	},
	{
		name: "[Gen 9] ND 35 Pokes 1v1 [Sep 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes 1v1'],
		unbanlist: [
			'Araquanid-Base', 'Arcanine-Hisui', 'Archeops', 'Bellossom', 'Boltund', 'Escavalier', 'Farigiraf', 'Gothitelle', 'Gyarados-Base', 'Kabutops', 'Kilowattrel', 'Klawf', 'Magmortar', 'Mamoswine', 'Metagross-Base', 'Miltank', 'Oricorio-Base', 'Orthworm', 'Persian-Base', 'Pinsir-Base', 'Polteageist', 'Pyukumuku', 'Rotom-Mow', 'Scizor-Base', 'Shiftry', 'Simisear', 'Skarmory-Base', 'Slowbro-Galar', 'Slurpuff', 'Thievul', 'Torkoal', 'Toxtricity-Base', 'Turtonator', 'Tyranitar-Base', 'Wailord',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes 1v1 [Aug 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes 1v1'],
		unbanlist: [
			'Arcanine-Base', 'Arctozolt', 'Ariados', 'Ceruledge', 'Crabominable-Base', 'Crawdaunt', 'Cyclizar', 'Dachsbun', 'Decidueye-Base', 'Donphan', 'Dragalge-Base', 'Espeon', 'Exeggutor-Base', 'Feraligatr-Base', 'Gardevoir-Base', 'Garganacl', 'Glalie-Base', 'Grafaiai', 'Kecleon', 'Kingler', 'Mabosstiff', 'Mandibuzz', 'Munkidori', 'Obstagoon', 'Omastar', 'Parasect', 'Politoed', 'Swanna', 'Tentacruel', 'Trevenant', 'Ursaring', 'Vikavolt-Base', 'Wigglytuff', 'Wormadam-Trash', 'Yanmega',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes 1v1 [Jul 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes 1v1'],
		unbanlist: [
			'Accelgor', 'Aggron-Base', 'Carbink', 'Carracosta', 'Clodsire', 'Cloyster', 'Emboar-Base', 'Florges', 'Heatmor', 'Heliolisk', 'Heracross-Base', 'Hydreigon', 'Illumise', 'Klinklang', 'Kricketune', 'Lanturn', 'Linoone-Base', 'Lucario-Base', 'Malamar-Base', 'Mawile-Base', 'Mismagius', 'Mothim', 'Purugly', 'Rampardos', 'Raticate-Base', 'Samurott-Base', 'Seaking', 'Seismitoad', 'Slowbro-Base', 'Sudowoodo', 'Tyrantrum', 'Vaporeon', 'Vileplume', 'Zangoose', 'Zebstrika',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes 1v1 [Jun 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes 1v1'],
		unbanlist: [
			'Ampharos-Base', 'Arbok', 'Beheeyem', 'Bombirdier', 'Claydol', 'Cramorant-Base', 'Cursola', 'Dubwool', 'Flygon', 'Gastrodon', 'Hitmontop', 'Houndstone', 'Jumpluff', 'Ledian', 'Magmortar', 'Mesprit', 'Milotic', 'Okidogi', 'Pachirisu', 'Pincurchin', 'Probopass', 'Regice', 'Scrafty-Base', 'Seviper', 'Sharpedo-Base', 'Shiftry', 'Shiinotic', 'Sigilyph', 'Slowbro-Galar', 'Slurpuff', 'Swampert-Base', 'Torterra', 'Toxicroak', 'Virizion', 'Weezing-Base',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes 1v1 [May 2026]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes 1v1'],
		unbanlist: [
			'Ambipom', 'Appletun', 'Azumarill', 'Banette-Base', 'Bellossom', 'Brambleghast', 'Bruxish', 'Delcatty', 'Donphan', 'Dragalge-Base', 'Drapion', 'Eiscue', 'Floatzel', 'Furfrou', 'Klefki', 'Leafeon', 'Lumineon', 'Malamar-Base', 'Mimikyu-Base', 'Morpeko', 'Ninetales-Base', 'Ninjask', 'Orthworm', 'Perrserker', 'Pyukumuku', 'Quagsire', 'Rabsca', 'Rapidash-Galar', 'Rhydon', 'Salazzle-Base', 'Sandslash-Base', 'Tatsugiri-Curly', 'Tatsugiri-Droopy', 'Tatsugiri-Stretchy', 'Wugtrio', 'Xatu', 'Zoroark-Base',
		],
	},
	{
		section: '35 Moves',
		column: 4,
	},
	{
		name: "[Gen 9] ND 35 Moves [May 2025]",
		mod: 'gen9',
		ruleset: ['Standard NatDex', '!Evasion Clause', 'Evasion Moves Clause', 'Evasion Items Clause', 'Mega Rayquaza Clause'],
		banlist: ['ND AG', 'pokemontag:allmoves'],
		unbanlist: [
			'Absorb', 'Bubble', 'Cotton Guard', 'Smack Down', 'Skill Swap', 'Guillotine', 'Vacuum Wave', 'Retaliate', 'Miracle Eye', 'Low Sweep', 'Fire Punch', 'Aura Sphere', 'Flatter', 'Scorching Sands', 'Iron Defense', 'Psybeam', 'Solar Beam', 'Frenzy Plant', 'Night Shade', 'Sky Attack', 'Air Slash', 'Psychic Fangs', 'Payback', 'Lovely Kiss', 'Hydro Cannon', 'Bone Rush', 'Dragon Dance', 'Frost Breath', 'Heavy Slam', 'Temper Flare', 'Magical Leaf', 'Aqua Ring', 'Rock Polish', 'Rock Slide', 'Bullet Punch',
		],
	},
	{
		name: "[Gen 9] ND 35 Moves [Sep 2024]",
		mod: 'gen9',
		ruleset: [
			'Standard NatDex', '!Evasion Clause', 'Evasion Moves Clause', 'Evasion Items Clause', 'Mega Rayquaza Clause', 'Z-Move Clause', 'Terastal Clause',
		],
		banlist: ['ND AG', 'pokemontag:allmoves'],
		unbanlist: [
			'Giga Impact', 'Rage', 'Metal Burst', 'Me First', 'Stealth Rock', 'Acid', 'Psychic Noise', 'Clear Smog', 'Curse', 'Fake Out', 'Soak', 'Dig', 'Fling', 'Wonder Room', 'Sludge', 'Acid Armor', 'Hurricane', 'Gastro Acid', 'Power Split', 'Sweet Scent', 'Disable', 'Body Press', 'Spite', 'Shock Wave', 'Sludge Bomb', 'Flail', 'Bubble', 'Inferno', 'Knock Off', 'Autotomize', 'Withdraw', 'Spark', 'Mimic', 'Vine Whip', 'Focus Blast',
		],
	},
	{
		section: '35 Pokes Pockets',
		column: 4,
	},
	{
		name: "[Gen 9] ND 35 Pokes Pockets Space-Time Smackdown",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Mightyena', 'Dusknoir', 'Uxie', 'Purugly', 'Electrode', 'Gabite', 'Hitmontop', 'Lickilicky', 'Lumineon', 'Togekiss', 'Kricketune', 'Glaceon', 'Lopunny', 'Toxicroak', 'Vespiquen', 'Drapion', 'Weavile', 'Bellossom', 'Cresselia', 'Skuntank', 'Empoleon', 'Bastiodon', 'Abomasnow', 'Rotom-Mow', 'Skarmory-Base', 'Staraptor-Base', 'Carnivine', 'Wormadam-Trash', 'Dusclops', 'Regigigas', 'Infernape', 'Rotom-Wash', 'Gliscor', 'Wormadam-Sandy', 'Rampardos',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Pockets Genetic Apex",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Tauros-Base', 'Charizard-Base', 'Raticate-Base', 'Aerodactyl-Base', 'Magneton', 'Machamp', 'Pikachu-Base', 'Vaporeon', 'Gengar-Base', 'Gardevoir-Base', 'Pidgeot-Base', 'Primeape', 'Swoobat', 'Rapidash-Base', 'Kabutops', 'Heatmor', 'Pincurchin', 'Nidoking', 'Tentacruel', 'Cloyster', 'Mawile-Base', 'Dubwool', 'Golduck', 'Chansey', 'Electrode-Base', 'Weezing-Base', 'Golem-Base', 'Cinccino', 'Jynx', 'Golurk-Base', 'Dugtrio-Base', 'Mienshao', 'Starmie-Base', 'Centiskorch', 'Electabuzz',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Pockets Mythical Island",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Exeggutor-Base', 'Celebi', 'Serperior', 'Dhelmise', 'Rapidash', 'Magmar', 'Volcarona', 'Salazzle', 'Gyarados', 'Vaporeon', 'Lumineon', 'Drednaw', 'Cramorant', 'Pikachu', 'Raichu-Base', 'Electabuzz', 'Galvantula', 'Dedenne', 'Mew', 'Sigilyph', 'Beheeyem', 'Florges', 'Slurpuff', 'Golem-Base', 'Aerodactyl', 'Primeape', 'Stonjourner', 'Weezing', 'Liepard', 'Scolipede-Base', 'Druddigon', 'Pidgeot', 'Tauros', 'Chatot', 'Shiinotic',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Pockets Shining Revelry",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause'],
		unbanlist: [
			'Pachirisu', 'Pawmot', 'Raticate-Base', 'Flamigo', 'Electrode-Base', 'Wugtrio', 'Tauros-Paldea-Blaze', 'Mr. Mime-Base', 'Drifblim', 'Magmortar', 'Dondozo', 'Arbok', 'Hitmonlee', 'Charizard-Base', 'Alakazam-Base', 'Spiritomb', 'Gimmighoul-Base', 'Lucario-Base', 'Cyclizar', 'Revavroom', 'Tatsugiri-Base', 'Machamp', 'Tinkaton', 'Clodsire', 'Floragato', 'Wigglytuff', 'Lopunny-Base', 'Pinsir-Base', 'Lickilicky', 'Floatzel', 'Hitmonchan', 'Bibarel', 'Tentacruel', 'Beedrill-Base', 'Pikachu-Base',
		],
	},
	{
		section: '35 Pokes ADV',
		column: 4,
	},
	{
		name: "[Gen 3] 35 Pokes [Sep 2024]",
		mod: 'gen3',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod'],
		banlist: ['All Pokemon'],
		unbanlist: [
			'Tropius', 'Wailord', 'Sunflora', 'Plusle', 'Camerupt-Base', 'Raichu-Base', 'Hitmonlee', 'Beedrill-Base', 'Lapras', 'Solrock', 'Volbeat', 'Lunatone', 'Arcanine-Base', 'Hitmontop', 'Slowbro-Base', 'Umbreon', 'Jumpluff', 'Marowak-Base', 'Magcargo', 'Dewgong', 'Corsola-Base', 'Delibird', 'Masquerain', 'Pidgeot-Base', 'Relicanth', 'Gardevoir-Base', 'Parasect', 'Shiftry', 'Weezing-Base', 'Armaldo', 'Seaking', 'Beautifly', 'Clamperl', 'Qwilfish-Base', 'Grumpig',
		],
	},
	{
		name: "[Gen 3] 35 Pokes [Aug 2024]",
		mod: 'gen3',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod'],
		banlist: ['All Pokemon'],
		unbanlist: [
			'Seaking', 'Raticate-Base', 'Sableye-Base', 'Corsola-Base', 'Walrein', 'Magneton', 'Mawile-Base', 'Aggron-Base', 'Magcargo', 'Cacturne', 'Glalie-Base', 'Steelix-Base', 'Sandslash-Base', 'Gligar', 'Xatu', 'Flareon', 'Chimecho-Base', 'Delibird', 'Sneasel-Base', 'Linoone-Base', 'Farfetch’d-Base', 'Whiscash', 'Trapinch', 'Ditto', 'Pikachu-Base', 'Roselia', 'Muk-Base', 'Shedinja', 'Meganium-Base', 'Dunsparce', 'Crobat', 'Raichu-Base', 'Castform-Base', 'Spinda', 'Absol-Base',
		],
	},
	{
		section: '35 Pokes Flipped',
		column: 4,
	},
	{
		name: "[Gen 9] ND 35 Pokes Flipped [Jan 2025]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause', 'Flipped Mod'],
		unbanlist: [
			'Flamigo', 'Golduck', 'Braviary-Base', 'Pyroar-Base', 'Carbink', 'Persian-Alola', 'Avalugg-Base', 'Rotom-Base', 'Scyther', 'Archeops', 'Shedinja', 'Roserade', 'Dipplin', 'Oinkologne-Base', 'Toedscruel', 'Bisharp', 'Ludicolo', 'Sirfetch’d', 'Heliolisk', 'Drampa-Base', 'Watchog', 'Gourgeist-Small', 'Aegislash-Blade', 'Vikavolt-Base', 'Qwilfish-Base', 'Scrafty-Base', 'Mudsdale', 'Excadrill-Base', 'Magcargo', 'Gourgeist-Base', 'Claydol', 'Farigiraf', 'Corsola-Base', 'Mabosstiff', 'Raichu-Alola', 'Dudunsparce', 'Beartic', 'Honchkrow', 'Cobalion', 'Ninetales-Base', 'Slaking', 'Alcremie', 'Pawmot', 'Golem-Alola', 'Gothitelle', 'Cyclizar', 'Spinda', 'Hawlucha-Base', 'Diggersby', 'Venusaur-Base', 'Lurantis-Base', 'Sudowoodo', 'Braviary-Hisui',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Flipped [Dec 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause', 'Flipped Mod'],
		unbanlist: [
			'Drapion', 'Seaking', 'Jumpluff', 'Oricorio-Pa\'u', 'Duraludon', 'Spinda', 'Carracosta', 'Relicanth', 'Miltank', 'Scolipede-Base', 'Abomasnow-Base', 'Wailord', 'Centiskorch', 'Silvally-Base', 'Machamp', 'Swampert-Base', 'Cinccino', 'Maushold-Base', 'Magmortar', 'Clodsire', 'Darmanitan-Base', 'Turtonator', 'Orbeetle', 'Druddigon', 'Excadrill-Base', 'Raticate-Base', 'Houndoom-Base', 'Regice', 'Butterfree', 'Mandibuzz', 'Granbull', 'Zangoose', 'Gigalith', 'Samurott-Base', 'Wobbuffet', 'Ambipom', 'Camerupt-Base', 'Hypno', 'Purugly', 'Politoed', 'Weavile', 'Pachirisu', 'Qwilfish-Base', 'Roserade', 'Hitmonchan', 'Veluza', 'Kecleon', 'Huntail', 'Altaria-Base', 'Raichu-Alola', 'Metagross-Base', 'Articuno-Base', 'Conkeldurr',
		],
	},
	{
		name: "[Gen 9] ND 35 Pokes Flipped [Nov 2024]",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes', '!Sleep Moves Clause', 'Flipped Mod'],
		unbanlist: [
			'Nihilego', 'Samurott-Hisui', 'Milotic', 'Rillaboom', 'Snorlax', 'Entei', 'Umbreon', 'Iron Thorns', 'Hydreigon', 'Necrozma-Base', 'Musharna', 'Roserade', 'Virizion', 'Krookodile', 'Magmortar', 'Indeedee-M', 'Glastrier', 'Dondozo', 'Heracross-Base', 'Rapidash-Base', 'Terrakion', 'Vanilluxe', 'Smeargle', 'Carbink', 'Probopass', 'Iron Hands', 'Arbok', 'Meganium-Base', 'Iron Jugulis', 'Sharpedo-Base', 'Simipour', 'Hypno', 'Appletun', 'Ampharos-Base', 'Pidgeot-Base', 'Swanna', 'Gengar-Base', 'Leafeon', 'Dugtrio-Base', 'Seaking', 'Victreebel-Base', 'Emboar-Base', 'Crawdaunt', 'Exeggutor-Alola', 'Tropius', 'Glaceon', 'Vivillon-Base', 'Vespiquen', 'Pinsir-Base', 'Plusle', 'Raticate-Alola',
		],
	},

	// endregion

	// region Miscellaneous

	{
		section: 'Misc',
		column: 5,
	},
	{
		name: "[Gen 9] Broken Cup",
		desc: '[Gen 9] Hackmons Cup but with only the most powerful Pok&eacute;mon, moves, abilities, and items.',
		team: 'randomHC',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		banlist: ['All Pokemon', 'All Abilities', 'All Items', 'All Moves'],
		unbanlist: [
			'10,000,000 Volt Thunderbolt', 'Abomasnow-Mega', 'Absol-Mega', 'Accelerock', 'Acid Spray', 'Adaptability', 'Aeroblast',
			'Aerodactyl-Mega', 'Aftermath', 'Aggron', 'Aggron-Mega', 'Aguav Berry', 'Air Balloon', 'Air Slash', 'Alakazam-Mega',
			'Alluring Voice', 'Altaria-Mega', 'Ampharos-Mega', 'Analytic', 'Anchor Shot', 'Anger Shell', 'Annihilape', 'Anticipation',
			'Apple Acid', 'Aqua Step', 'Arcanine', 'Arcanine-Hisui', 'Archaludon', 'Archeops', 'Arena Trap', 'Armarouge', 'Armor Cannon',
			'Aromatherapy', 'Articuno', 'Articuno-Galar', 'As One (Glastrier)', 'As One (Spectrier)', 'Assault Vest', 'Astral Barrage',
			'Attack Order', 'Audino-Mega', 'Aura Sphere', 'Axe Kick', 'Azelf', 'Baddy Bad', 'Baneful Bunker', 'Banette-Mega',
			'Barb Barrage', 'Basculegion', 'Basculegion-F', 'Baton Pass', 'Baxcalibur', 'Beads of Ruin', 'Beak Blast', 'Beast Boost',
			'Behemoth Bash', 'Behemoth Blade', 'Belly Drum', 'Berserk', 'Bitter Blade', 'Bitter Malice', 'Blacephalon', 'Blastoise',
			'Blastoise-Mega', 'Blaziken', 'Blaziken-Mega', 'Blazing Torque', 'Bleakwind Storm', 'Blissey', 'Blizzard', 'Blood Moon',
			'Blue Flare', 'Blunder Policy', 'Body Press', 'Body Slam', 'Bolt Beak', 'Bolt Strike', 'Boomburst', 'Bouncy Bubble',
			'Brave Bird', 'Bright Powder', 'Brute Bonnet', 'Bug Buzz', 'Bullet Punch', 'Burning Bulwark', 'Buzzwole', 'Buzzy Buzz',
			'Calm Mind', 'Calyrex-Ice', 'Calyrex-Shadow', 'Camerupt-Mega', 'Catastropika', 'Ceaseless Edge', 'Celebi', 'Celesteela',
			'Centiskorch', 'Ceruledge', 'Charizard', 'Charizard-Mega-X', 'Charizard-Mega-Y', 'Chatter', 'Chesnaught', 'Chesto Berry',
			'Chi-Yu', 'Chien-Pao', 'Chilan Berry', 'Chilling Neigh', 'Chilly Reception', 'Choice Band', 'Choice Scarf', 'Choice Specs',
			'Cinderace', 'Circle Throw', 'Clanging Scales', 'Clangorous Soul', 'Clangorous Soulblaze', 'Clear Amulet', 'Clear Body',
			'Clear Smog', 'Close Combat', 'Cloyster', 'Cobalion', 'Coil', 'Collision Course', 'Comatose', 'Combat Torque', 'Competitive',
			'Compound Eyes', 'Contrary', 'Core Enforcer', 'Cosmic Power', 'Cotton Guard', 'Court Change', 'Covert Cloak', 'Crabhammer',
			'Cresselia', 'Crobat', 'Cross Chop', 'Curse', 'Custap Berry', 'Dark Pulse', 'Darkest Lariat', 'Darkrai',
			'Darmanitan-Galar-Zen', 'Darmanitan-Zen', 'Decidueye', 'Decidueye-Hisui', 'Defend Order', 'Defiant', 'Defog', 'Delphox',
			'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Desolate Land', 'Dialga', 'Dialga-Origin', 'Diamond Storm',
			'Diancie', 'Diancie-Mega', 'Dire Claw', 'Disable', 'Discharge', 'Dondozo', 'Doom Desire', 'Double Iron Bash', 'Download',
			'Draco Meteor', 'Draco Plate', 'Dragapult', 'Dragon Ascent', 'Dragon Dance', 'Dragon Darts', 'Dragon Energy', 'Dragon Hammer',
			'Dragon Pulse', 'Dragon Tail', 'Dragonite', 'Drain Punch', 'Dread Plate', 'Drill Peck', 'Drizzle', 'Drought', 'Drum Beating',
			'Dry Skin', 'Duraludon', 'Dusknoir', 'Dynamax Cannon', 'Earth Eater', 'Earth Plate', 'Earth Power', 'Earthquake',
			'Eerie Spell', 'Effect Spore', 'Eject Pack', 'Electivire', 'Electric Surge', 'Electro Drift', 'Emboar', 'Empoleon',
			'Enamorus', 'Enamorus-Therian', 'Encore', 'Energy Ball', 'Entei', 'Eruption', 'Espeon', 'Esper Wing', 'Eternatus',
			'Eternatus-Eternamax', 'Exeggutor', 'Exeggutor-Alola', 'Expanding Force', 'Expert Belt', 'Explosion', 'Extreme Evoboost',
			'Extreme Speed', 'Fake Out', 'Feraligatr', 'Fezandipiti', 'Fickle Beam', 'Fiery Wrath', 'Figy Berry', 'Filter',
			'Fire Blast', 'Fire Lash', 'First Impression', 'Fishious Rend', 'Fist Plate', 'Flame Body', 'Flame Charge', 'Flame Plate',
			'Flamethrower', 'Flare Blitz', 'Flareon', 'Flash Cannon', 'Fleur Cannon', 'Flip Turn', 'Floaty Fall', 'Florges',
			'Flower Trick', 'Fluffy', 'Flutter Mane', 'Focus Blast', 'Focus Sash', 'Forewarn', 'Foul Play', 'Freeze-Dry', 'Freezing Glare',
			'Freezy Frost', 'Frost Breath', 'Full Metal Body', 'Fur Coat', 'Fusion Bolt', 'Fusion Flare', 'Future Sight', 'G-Max Befuddle',
			'G-Max Cannonade', 'G-Max Centiferno', 'G-Max Resonance', 'G-Max Steelsurge', 'G-Max Stonesurge', 'G-Max Sweetness',
			'G-Max Vine Lash', 'G-Max Volcalith', 'G-Max Wildfire', 'G-Max Wind Rage', 'Gallade-Mega', 'Garchomp', 'Garchomp-Mega',
			'Gardevoir-Mega', 'Gear Grind', 'Genesect', 'Genesis Supernova', 'Gengar-Mega', 'Gholdengo', 'Giga Drain', 'Gigaton Hammer',
			'Giratina', 'Giratina-Origin', 'Glaceon', 'Glacial Lance', 'Glaive Rush', 'Glalie-Mega', 'Glare', 'Glastrier', 'Glimmora',
			'Glitzy Glow', 'Gogoat', 'Golisopod', 'Good as Gold', 'Goodra', 'Goodra-Hisui', 'Gooey', 'Gorilla Tactics', 'Gouging Fire',
			'Grassy Surge', 'Grav Apple', 'Great Tusk', 'Greninja', 'Greninja-Ash', 'Grim Neigh', 'Groudon', 'Groudon-Primal',
			'Guardian of Alola', 'Gunk Shot', 'Guzzlord', 'Gyarados', 'Gyarados-Mega', 'Hadron Engine', 'Hammer Arm', 'Haxorus',
			'Haze', 'Head Charge', 'Head Smash', 'Headlong Rush', 'Heal Bell', 'Heal Order', 'Healing Wish', 'Heart Swap', 'Heat Crash',
			'Heat Wave', 'Heatran', 'Heavy-Duty Boots', 'Heracross-Mega', 'High Horsepower', 'High Jump Kick', 'Hippowdon', 'Ho-Oh',
			'Hone Claws', 'Hoopa', 'Hoopa-Unbound', 'Horn Leech', 'Houndoom-Mega', 'Huge Power', 'Hurricane', 'Hustle', 'Hydreigon',
			'Hydrapple', 'Hydro Pump', 'Hydro Steam', 'Hyper Drill', 'Iapapa Berry', 'Ice Beam', 'Ice Hammer', 'Ice Scales', 'Ice Shard',
			'Ice Spinner', 'Icicle Plate', 'Illusion', 'Imposter', 'Incineroar', 'Infernape', 'Innards Out', 'Insect Plate', 'Inteleon',
			'Intimidate', 'Intrepid Sword', 'Iron Barbs', 'Iron Boulder', 'Iron Bundle', 'Iron Crown', 'Iron Hands', 'Iron Head',
			'Iron Jugulis', 'Iron Leaves', 'Iron Moth', 'Iron Plate', 'Iron Tail', 'Iron Thorns', 'Iron Treads', 'Iron Valiant',
			'Ivy Cudgel', 'Jet Punch', 'Jirachi', 'Jolteon', 'Judgment', 'Jungle Healing', 'Kangaskhan-Mega', 'Kartana', 'Keldeo',
			'Keldeo-Resolute', 'King\'s Rock', 'King\'s Shield', 'Kingambit', 'Kingdra', 'Knock Off', 'Kommo-o', 'Koraidon', 'Kyogre',
			'Kyogre-Primal', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Landorus', 'Landorus-Therian', 'Lapras', 'Last Respects', 'Latias',
			'Latias-Mega', 'Latios', 'Latios-Mega', 'Lava Plume', 'Leaf Blade', 'Leaf Storm', 'Leafeon', 'Leech Life', 'Leech Seed',
			'Leftovers', 'Leppa Berry', 'Let\'s Snuggle Forever', 'Levitate', 'Libero', 'Liechi Berry', 'Life Orb', 'Light Screen',
			'Light That Burns the Sky', 'Light of Ruin', 'Lightning Rod', 'Liquidation', 'Lopunny-Mega', 'Lovely Kiss', 'Low Kick',
			'Lucario', 'Lucario-Mega', 'Lugia', 'Lum Berry', 'Lumina Crash', 'Lunala', 'Lunar Blessing', 'Lunar Dance', 'Lunge',
			'Luster Purge', 'Mach Punch', 'Magearna', 'Magic Bounce', 'Magic Guard', 'Magical Torque', 'Magma Storm', 'Magmortar',
			'Magnezone', 'Mago Berry', 'Make It Rain', 'Malicious Moonsault', 'Malignant Chain', 'Mamoswine', 'Manaphy', 'Manectric-Mega',
			'Marshadow', 'Marvel Scale', 'Matcha Gotcha', 'Max Guard', 'Meadow Plate', 'Megahorn', 'Meganium', 'Melmetal', 'Meloetta',
			'Meloetta-Pirouette', 'Memento', 'Menacing Moonraze Maelstrom', 'Mental Herb', 'Meowscarada', 'Mesprit', 'Metagross',
			'Metagross-Mega', 'Meteor Mash', 'item: Metronome', 'Mew', 'Mewtwo', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y', 'Mighty Cleave',
			'Milk Drink', 'Milotic', 'Mind Plate', 'Mind\'s Eye', 'Minimize', 'Miraidon', 'Mirror Herb', 'Mist Ball', 'Misty Surge',
			'Mold Breaker', 'Moltres', 'Moltres-Galar', 'Moody', 'Moonblast', 'Moongeist Beam', 'Moonlight', 'Morning Sun', 'Mortal Spin',
			'Mountain Gale', 'Moxie', 'Multiscale', 'Munkidori', 'Muscle Band', 'Mystical Fire', 'Mystical Power', 'Naganadel',
			'Nasty Plot', 'Natural Cure', 'Nature\'s Madness', 'Necrozma', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Necrozma-Ultra',
			'Neuroforce', 'Neutralizing Gas', 'Night Daze', 'Night Shade', 'Nihilego', 'No Retreat', 'Noivern', 'Noxious Torque',
			'Nuzzle', 'Oblivion Wing', 'Obstruct', 'Oceanic Operetta', 'Octolock', 'Ogerpon', 'Ogerpon-Cornerstone', 'Ogerpon-Hearthflame',
			'Ogerpon-Wellspring', 'Okidogi', 'Opportunist', 'Orichalcum Pulse', 'Origin Pulse', 'Outrage', 'Overdrive', 'Overheat',
			'Pain Split', 'Palafin-Hero', 'Palkia', 'Palkia-Origin', 'Parental Bond', 'Parting Shot', 'Pecharunt', 'Perish Body',
			'Perish Song', 'Petaya Berry', 'Pheromosa', 'Photon Geyser', 'Pidgeot-Mega', 'Pinsir-Mega', 'Pixie Plate', 'Plasma Fists',
			'Play Rough', 'Poison Heal', 'Poison Point', 'Poison Touch', 'Pollen Puff', 'Poltergeist', 'Population Bomb', 'Porygon-Z',
			'Power Gem', 'Power Trip', 'Power Whip', 'Prankster', 'Precipice Blades', 'Primarina', 'Primordial Sea', 'Prism Armor',
			'Probopass', 'Protean', 'Protect', 'Psyblade', 'Psychic Fangs', 'Psychic Surge', 'Psychic', 'Psycho Boost', 'Psyshield Bash',
			'Psystrike', 'Pulverizing Pancake', 'Pure Power', 'Purifying Salt', 'Pursuit', 'Pyro Ball', 'Quaquaval', 'Quick Claw',
			'Quiver Dance', 'Rage Fist', 'Raging Bolt', 'Raging Bull', 'Raging Fury', 'Raikou', 'Rapid Spin', 'Rayquaza', 'Rayquaza-Mega',
			'Razor Claw', 'Recover', 'Red Card', 'Reflect', 'Regenerator', 'Regice', 'Regidrago', 'Regieleki', 'Regigigas', 'Regirock',
			'Registeel', 'Reshiram', 'Rest', 'Revelation Dance', 'Revival Blessing', 'Rhyperior', 'Rillaboom', 'Roar', 'Roaring Moon',
			'Rocky Helmet', 'Roost', 'Rough Skin', 'Ruination', 'Sacred Fire', 'Sacred Sword', 'Salac Berry', 'Salamence', 'Salamence-Mega',
			'Salt Cure', 'Samurott', 'Samurott-Hisui', 'Sandsear Storm', 'Sandy Shocks', 'Sap Sipper', 'Sappy Seed', 'Scald', 'Sceptile',
			'Sceptile-Mega', 'Scizor-Mega', 'Scope Lens', 'Scream Tail', 'Searing Shot', 'Searing Sunraze Smash', 'Secret Sword',
			'Seed Flare', 'Seismic Toss', 'Serene Grace', 'Serperior', 'Shadow Ball', 'Shadow Bone', 'Shadow Shield', 'Shadow Sneak',
			'Shadow Tag', 'Sharpedo-Mega', 'Shaymin', 'Shaymin-Sky', 'Shed Skin', 'Shed Tail', 'Sheer Force', 'Shell Side Arm',
			'Shell Smash', 'Shield Dust', 'Shift Gear', 'Silk Scarf', 'Silk Trap', 'Silvally', 'Simple', 'Sinister Arrow Raid',
			'Sitrus Berry', 'Sizzly Slide', 'Skeledirge', 'Sky Plate', 'Slack Off', 'Slaking', 'Sleep Powder', 'Slither Wing',
			'Slowbro-Mega', 'Sludge Bomb', 'Sludge Wave', 'Snarl', 'Snipe Shot', 'Snorlax', 'Soft-Boiled', 'Solgaleo', 'Solid Rock',
			'Soul-Heart', 'Soul-Stealing 7-Star Strike', 'Spacial Rend', 'Sparkly Swirl', 'Spectral Thief', 'Spectrier', 'Speed Boost',
			'Spikes', 'Spiky Shield', 'Spin Out', 'Spirit Break', 'Spirit Shackle', 'Splash Plate', 'Splintered Stormshards',
			'Splishy Splash', 'Spooky Plate', 'Spore', 'Springtide Storm', 'Stakataka', 'Stakeout', 'Stamina', 'Static', 'Stealth Rock',
			'Steam Eruption', 'Steelix-Mega', 'Sticky Web', 'Stoked Sparksurfer', 'Stone Axe', 'Stone Edge', 'Stone Plate', 'Stored Power',
			'Storm Drain', 'Storm Throw', 'Strange Steam', 'Strength Sap', 'Sturdy', 'Sucker Punch', 'Suicune', 'Sunsteel Strike',
			'Super Fang', 'Supercell Slam', 'Superpower', 'Supreme Overlord', 'Surf', 'Surging Strikes', 'Swampert', 'Swampert-Mega',
			'Sword of Ruin', 'Swords Dance', 'Sylveon', 'Synthesis', 'Tablets of Ruin', 'Tachyon Cutter', 'Tail Glow', 'Tangling Hair',
			'Tangrowth', 'Tapu Bulu', 'Tapu Fini', 'Tapu Koko', 'Tapu Lele', 'Taunt', 'Techno Blast', 'Teleport', 'Tera Blast',
			'Tera Starstorm', 'Terapagos-Stellar', 'Terapagos-Terastal', 'Teravolt', 'Terrakion', 'Thermal Exchange', 'Thick Fat',
			'Thousand Arrows', 'Thousand Waves', 'Throat Spray', 'Thunder Cage', 'Thunder Wave', 'Thunder', 'Thunderbolt', 'Thunderclap',
			'Thunderous Kick', 'Thundurus', 'Thundurus-Therian', 'Tidy Up', 'Ting-Lu', 'Tinted Lens', 'Togekiss', 'Topsy-Turvy',
			'Torch Song', 'Tornadus', 'Tornadus-Therian', 'Torterra', 'Tough Claws', 'Toxic Chain', 'Toxic Debris', 'Toxic Plate',
			'Toxic Spikes', 'Toxic', 'Tri Attack', 'Triage', 'Triple Arrows', 'Triple Axel', 'Turboblaze', 'Type: Null', 'Typhlosion',
			'Typhlosion-Hisui', 'Tyranitar', 'Tyranitar-Mega', 'U-turn', 'Umbreon', 'Unaware', 'Unburden', 'Ursaluna', 'Ursaluna-Bloodmoon',
			'Urshifu', 'Urshifu-Rapid-Strike', 'Uxie', 'V-create', 'Vanilluxe', 'Vaporeon', 'Venusaur', 'Venusaur-Mega', 'Vessel of Ruin',
			'Victini', 'Victory Dance', 'Virizion', 'Volcanion', 'Volcarona', 'Volt Absorb', 'Volt Switch', 'Volt Tackle', 'Walking Wake',
			'Walrein', 'Water Absorb', 'Water Bubble', 'Water Shuriken', 'Water Spout', 'Waterfall', 'Wave Crash', 'Weakness Policy',
			'Well-Baked Body', 'Whirlwind', 'White Herb', 'Wicked Blow', 'Wicked Torque', 'Wide Lens', 'Wiki Berry', 'Wild Charge',
			'Wildbolt Storm', 'Will-O-Wisp', 'Wise Glasses', 'Wish', 'Wishiwashi-School', 'Wo-Chien', 'Wonder Guard', 'Wood Hammer',
			'Wyrdeer', 'Xerneas', 'Xurkitree', 'Yawn', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zap Plate',
			'Zapdos', 'Zapdos-Galar', 'Zarude', 'Zekrom', 'Zeraora', 'Zing Zap', 'Zippy Zap', 'Zygarde', 'Zygarde-Complete',
		],
	},
	{
		name: "[Gen 9] Broken Cup FFA",
		desc: '[Gen 9] Hackmons Cup but with only the most powerful Pok&eacute;mon, moves, abilities, and items.',
		gameType: 'freeforall',
		team: 'randomHC',
		ruleset: ['[Gen 9] Broken Cup'],
	},
	{
		name: "[Gen 9] Chaos Cup",
		mod: 'spmnm',
		team: 'randomHC',
		ruleset: [
			'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Scalemons Mod', 'Adjust Level = 100', 'Max Move Count = 6', 'Max Team Size = 12', 'Picked Team Size = 6',
			'Sleep Clause Mod', 'NatDex Mod', 'No Move-Species Restrictions',
		],
		banlist: [
			'CAP', 'LGPE', 'MissingNo.', 'Pikachu-Cosplay', 'Pichu-Spiky-eared', 'Pokestar Smeargle', 'Pokestar UFO', 'Pokestar UFO-2', 'Pokestar Brycen-Man', 'Pokestar MT', 'Pokestar MT2', 'Pokestar Transport', 'Pokestar Giant', 'Pokestar Humanoid', 'Pokestar Monster', 'Pokestar F-00', 'Pokestar F-002', 'Pokestar Spirit', 'Pokestar Black Door', 'Pokestar White Door', 'Pokestar Black Belt', 'Pokestar UFO-PropU2', 'Xerneas-Neutral',

			'Wonder Guard', 'Moody',

			'Max Strike', 'Max Knuckle', 'Max Airstream', 'Max Rockfall', 'Max Ooze', 'Max Quake', 'Max Flutterby', 'Max Phantasm', 'Max Steelspike', 'Max Flare', 'Max Geyser', 'Max Overgrowth', 'Max Lightning', 'Max Mindstorm', 'Max Hailstorm', 'Max Wyrmwind', 'Max Darkness', 'Max Starfall', 'G-max Drum Solo', 'G-max Fireball', 'G-max Hydrosnipe', 'Max Guard',

			'Breakneck Blitz', 'All-Out Pummeling', 'Supersonic Skystrike', 'Acid Downpour', 'Tectonic Rage', 'Continental Crush', 'Savage Spin-Out', 'Never-Ending Nightmare', 'Corkscrew Crash', 'Inferno Overdrive', 'Hydro Vortex', 'Bloom Doom', 'Gigavolt Havoc', 'Shattered Psyche', 'Subzero Slammer', 'Devastating Drake', 'Black Hole Eclipse', 'Twinkle Tackle',
		],
		unbanlist: [
			'G-Max Vine Lash', 'G-Max Wildfire', 'G-Max Cannonade', 'G-Max Befuddle', 'G-Max Volt Crash', 'G-Max Gold Rush', 'G-Max Chi Strike', 'G-Max Terror', 'G-Max Foam Burst', 'G-Max Resonance', 'G-Max Malodor', 'G-Max Meltdown', 'G-Max Wind Rage', 'G-Max Gravitas', 'G-Max Stonesurge', 'G-Max Volcalith', 'G-Max Tartness', 'G-Max Sandblast', 'G-Max Stun Shock', 'G-Max Centiferno', 'G-Max Smite', 'G-Max Snooze', 'G-Max Finale', 'G-Max Steelsurge',
		],
		onBegin: spmnm.onBegin,
		onSwitchIn: spmnm.onSwitchIn,
		onSwitchOut: spmnm.onSwitchOut,
		getSharedPower: spmnm.getSharedPower,
		onBeforeSwitchIn: spmnm.onBeforeSwitchIn,
	},
	{
		name: "[Gen 9] Chaos Cup FFA",
		mod: 'spmnm',
		gameType: 'freeforall',
		team: 'randomHC',
		ruleset: ['[Gen 9] Chaos Cup'],
		onBegin: spmnm.onBegin,
		onSwitchIn: spmnm.onSwitchIn,
		onSwitchOut: spmnm.onSwitchOut,
		getSharedPower: spmnm.getSharedPower,
		onBeforeSwitchIn: spmnm.onBeforeSwitchIn,
	},
	{
		name: "[Gen 9] Hackmons Cup",
		desc: 'Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.',
		mod: 'gen9',
		team: 'randomHC',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		banlist: ['CAP', 'LGPE', 'MissingNo.', 'Pikachu-Cosplay', 'Pichu-Spiky-eared', 'Pokestar Smeargle', 'Pokestar UFO', 'Pokestar UFO-2', 'Pokestar Brycen-Man', 'Pokestar MT', 'Pokestar MT2', 'Pokestar Transport', 'Pokestar Giant', 'Pokestar Humanoid', 'Pokestar Monster', 'Pokestar F-00', 'Pokestar F-002', 'Pokestar Spirit', 'Pokestar Black Door', 'Pokestar White Door', 'Pokestar Black Belt', 'Pokestar UFO-PropU2', 'Xerneas-Neutral'],
	},
	{
		name: "[Gen 9] Hackmons Cup FFA",
		desc: 'Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.',
		mod: 'gen9',
		gameType: 'freeforall',
		team: 'randomHC',
		ruleset: ['[Gen 9] Hackmons Cup'],
	},
	{
		name: "[Gen 9] Anything Goes",
		mod: 'gen9',
		ruleset: ['Standard AG'],
	},
	{
		name: "[Gen 9] National Dex AG",
		mod: 'gen9',
		ruleset: ['Standard AG', 'NatDex Mod'],
	},
	{
		name: "[Gen 9] 35 Pokes Rollable List",
		mod: 'gen9',
		ruleset: ['Standard 35 Pokes'],
		unbanlist: [
			'Abomasnow-Base', 'Absol-Base', 'Accelgor', 'Aerodactyl-Base', 'Aggron-Base', 'Alakazam-Base', 'Alcremie', 'Alomomola', 'Altaria-Base', 'Ambipom', 'Amoonguss', 'Ampharos-Base', 'Appletun', 'Araquanid-Base', 'Arbok', 'Arboliva', 'Arcanine-Base', 'Arcanine-Hisui', 'Archeops', 'Arctibax', 'Arctovish', 'Arctozolt', 'Ariados', 'Armaldo', 'Armarouge', 'Aromatisse', 'Articuno-Base', 'Articuno-Galar', 'Audino-Base', 'Aurorus', 'Avalugg-Base', 'Avalugg-Hisui', 'Azumarill', 'Banette-Base', 'Barbaracle-Base', 'Barraskewda', 'Basculegion-Base', 'Basculegion-F', 'Basculin-Base', 'Basculin-Blue-Striped', 'Basculin-White-Striped', 'Bastiodon', 'Beartic', 'Beautifly', 'Beedrill-Base', 'Beheeyem', 'Bellibolt', 'Bellossom', 'Bewear', 'Bibarel', 'Bisharp', 'Blastoise-Base', 'Blissey', 'Boltund', 'Bombirdier', 'Bouffalant', 'Brambleghast', 'Braviary-Base', 'Braviary-Hisui', 'Breloom', 'Bronzong', 'Brute Bonnet', 'Bruxish', 'Butterfree', 'Cacturne', 'Calyrex-Base', 'Camerupt-Base', 'Carbink', 'Carnivine', 'Carracosta', 'Castform-Base', 'Celebi', 'Centiskorch', 'Ceruledge', 'Cetitan', 'Chandelure-Base', 'Charizard-Base', 'Chatot', 'Cherrim-Base', 'Chesnaught-Base', 'Chimecho-Base', 'Cinccino', 'Clawitzer', 'Claydol', 'Clefable-Base', 'Clodsire', 'Cloyster', 'Coalossal', 'Cobalion', 'Cofagrigus', 'Comfey', 'Conkeldurr', 'Copperajah', 'Corsola-Base', 'Corsola-Galar', 'Corviknight', 'Crabominable-Base', 'Cradily', 'Cramorant-Base', 'Crawdaunt', 'Crobat', 'Crustle', 'Cryogonal', 'Cursola', 'Cyclizar', 'Dachsbun', 'Darmanitan-Base', 'Decidueye-Base', 'Decidueye-Hisui', 'Dedenne', 'Delcatty', 'Delibird', 'Delphox-Base', 'Dewgong', 'Dhelmise', 'Diancie-Base', 'Diggersby', 'Dipplin', 'Ditto', 'Dodrio', 'Dondozo', 'Donphan', 'Doublade', 'Dracozolt', 'Dragalge-Base', 'Dragonair', 'Drakloak', 'Drampa-Base', 'Drapion', 'Drednaw', 'Drifblim', 'Druddigon', 'Dubwool', 'Dudunsparce-Base', 'Dugtrio-Alola', 'Dugtrio-Base', 'Duraludon', 'Durant', 'Dusclops', 'Dusknoir', 'Dustox', 'Eelektross-Base', 'Eiscue-Base', 'Eldegoss', 'Electivire', 'Electrode-Base', 'Electrode-Hisui', 'Emboar-Base', 'Emolga', 'Empoleon', 'Entei', 'Escavalier', 'Espeon', 'Excadrill-Base', 'Exeggutor-Alola', 'Exeggutor-Base', 'Exploud', 'Falinks-Base', 'Farfetch’d-Base', 'Farigiraf', 'Fearow', 'Feraligatr-Base', 'Ferrothorn', 'Fezandipiti', 'Flamigo', 'Flapple', 'Flareon', 'Floatzel', 'Florges', 'Flygon', 'Forretress', 'Froslass-Base', 'Frosmoth', 'Furfrou', 'Furret', 'Gabite', 'Gallade-Base', 'Galvantula', 'Garbodor', 'Gardevoir-Base', 'Garganacl', 'Gastrodon', 'Gengar-Base', 'Gigalith', 'Glaceon', 'Glalie-Base', 'Glimmora-Base', 'Gogoat', 'Golduck', 'Golem-Alola', 'Golem-Base', 'Golisopod-Base', 'Golurk-Base', 'Goodra-Base', 'Goodra-Hisui', 'Gorebyss', 'Gothitelle', 'Gourgeist-Base', 'Gourgeist-Large', 'Gourgeist-Small', 'Gourgeist-Super', 'Grafaiai', 'Granbull', 'Grapploct', 'Greedent', 'Grimmsnarl', 'Grumpig', 'Gumshoos-Base', 'Guzzlord', 'Gyarados-Base', 'Hariyama', 'Hatterene', 'Hawlucha-Base', 'Haxorus', 'Heatmor', 'Heliolisk', 'Heracross-Base', 'Hippowdon', 'Hitmonchan', 'Hitmonlee', 'Hitmontop', 'Honchkrow', 'Houndoom-Base', 'Houndstone', 'Huntail', 'Hydrapple', 'Hypno', 'Illumise', 'Incineroar', 'Indeedee-Base', 'Indeedee-F', 'Infernape', 'Inteleon', 'Iron Thorns', 'Jellicent', 'Jolteon', 'Jumpluff', 'Jynx', 'Kabutops', 'Kangaskhan-Base', 'Kecleon', 'Kilowattrel', 'Kingdra', 'Kingler', 'Klawf', 'Kleavor', 'Klefki', 'Klinklang', 'Komala', 'Kricketune', 'Krookodile', 'Lanturn', 'Lapras', 'Leafeon', 'Leavanny', 'Ledian', 'Lickilicky', 'Liepard', 'Lilligant-Base', 'Lilligant-Hisui', 'Linoone-Base', 'Lokix', 'Lopunny-Base', 'Lucario-Base', 'Ludicolo', 'Lumineon', 'Lunatone', 'Lurantis-Base', 'Luvdisc', 'Luxray', 'Lycanroc-Base', 'Lycanroc-Dusk', 'Lycanroc-Midnight', 'Mabosstiff', 'Machamp', 'Magcargo', 'Magmortar', 'Magnezone', 'Malamar-Base', 'Mamoswine', 'Mandibuzz', 'Manectric-Base', 'Mantine', 'Maractus', 'Marowak-Alola', 'Marowak-Base', 'Masquerain', 'Maushold-Base', 'Mawile-Base', 'Medicham-Base', 'Meganium-Base', 'Meowstic-Base', 'Mesprit', 'Metagross-Base', 'Mienshao', 'Mightyena', 'Milotic', 'Miltank', 'Mimikyu-Base', 'Minior-Base', 'Minun', 'Mismagius', 'Moltres-Base', 'Morpeko-Base', 'Mothim', 'Mr. Mime-Base', 'Mr. Rime', 'Mudsdale', 'Muk-Alola', 'Muk-Base', 'Munkidori', 'Musharna', 'Nidoking', 'Nidoqueen', 'Ninetales-Alola', 'Ninetales-Base', 'Ninjask', 'Noctowl', 'Noivern', 'Obstagoon', 'Octillery', 'Oinkologne-Base', 'Oinkologne-F', 'Okidogi', 'Omastar', 'Oranguru', 'Orbeetle', 'Oricorio-Base', 'Oricorio-Pa\'u', 'Oricorio-Pom-Pom', 'Oricorio-Sensu', 'Orthworm', 'Overqwil', 'Pachirisu', 'Palossand', 'Pangoro', 'Parasect', 'Passimian', 'Pawmot', 'Pelipper', 'Perrserker', 'Persian-Alola', 'Persian-Base', 'Phione', 'Pidgeot-Base', 'Pincurchin', 'Pinsir-Base', 'Plusle', 'Politoed', 'Poliwrath', 'Polteageist-Base', 'Porygon-Z', 'Porygon2', 'Primarina', 'Primeape', 'Probopass', 'Pupitar', 'Purugly', 'Pyroar-Base', 'Pyukumuku', 'Quagsire', 'Quaquaval', 'Qwilfish-Base', 'Rabsca', 'Raichu-Alola', 'Raichu-Base', 'Rampardos', 'Rapidash-Base', 'Rapidash-Galar', 'Raticate-Alola', 'Raticate-Base', 'Regice', 'Regieleki', 'Regigigas', 'Regirock', 'Registeel', 'Relicanth', 'Reuniclus', 'Revavroom', 'Rhydon', 'Rhyperior', 'Ribombee-Base', 'Roserade', 'Rotom-Base', 'Rotom-Fan', 'Rotom-Frost', 'Rotom-Heat', 'Rotom-Mow', 'Rotom-Wash', 'Runerigus', 'Sableye-Base', 'Salazzle-Base', 'Samurott-Base', 'Sandaconda', 'Sandslash-Alola', 'Sandslash-Base', 'Sawk', 'Sawsbuck', 'Sceptile-Base', 'Scizor-Base', 'Scolipede-Base', 'Scovillain-Base', 'Scrafty-Base', 'Scyther', 'Seaking', 'Seismitoad', 'Serperior', 'Seviper', 'Sharpedo-Base', 'Shaymin-Base', 'Shedinja', 'Shelgon', 'Shiftry', 'Shiinotic', 'Shuckle', 'Sigilyph', 'Silvally', 'Silvally-Bug', 'Silvally-Dark', 'Silvally-Dragon', 'Silvally-Electric', 'Silvally-Fairy', 'Silvally-Fighting', 'Silvally-Fire', 'Silvally-Flying', 'Silvally-Ghost', 'Silvally-Grass', 'Silvally-Ground', 'Silvally-Ice', 'Silvally-Poison', 'Silvally-Psychic', 'Silvally-Rock', 'Silvally-Steel', 'Silvally-Water', 'Simipour', 'Simisage', 'Simisear', 'Sinistcha-Base', 'Sirfetch’d', 'Skarmory-Base', 'Skeledirge', 'Skuntank', 'Slaking', 'Slowbro-Base', 'Slowbro-Galar', 'Slowking-Base', 'Slowking-Galar', 'Slurpuff', 'Smeargle', 'Sneasel-Base', 'Sneasel-Hisui', 'Snorlax', 'Solrock', 'Spidops', 'Spinda', 'Spiritomb', 'Squawkabilly-Base', 'Stakataka', 'Staraptor-Base', 'Starmie-Base', 'Steelix-Base', 'Stonjourner', 'Stoutland', 'Stunfisk-Base', 'Stunfisk-Galar', 'Sudowoodo', 'Sunflora', 'Swalot', 'Swampert-Base', 'Swanna', 'Swellow', 'Swoobat', 'Sylveon', 'Talonflame', 'Tangrowth', 'Tatsugiri-Base', 'Tauros-Base', 'Tauros-Paldea-Aqua', 'Tauros-Paldea-Blaze', 'Tauros-Paldea-Combat', 'Tentacruel', 'Thievul', 'Throh', 'Thwackey', 'Tinkaton', 'Toedscruel', 'Togedemaru-Base', 'Togekiss', 'Torkoal', 'Torterra', 'Toucannon', 'Toxicroak', 'Toxtricity-Base', 'Toxtricity-Low-Key', 'Trapinch', 'Trevenant', 'Tropius', 'Tsareena', 'Turtonator', 'Type: Null', 'Typhlosion-Base', 'Typhlosion-Hisui', 'Tyranitar-Base', 'Tyrantrum', 'Umbreon', 'Unfezant', 'Uxie', 'Vanilluxe', 'Vaporeon', 'Veluza', 'Venomoth', 'Venusaur-Base', 'Vespiquen', 'Victreebel-Base', 'Vigoroth', 'Vikavolt-Base', 'Vileplume', 'Virizion', 'Vivillon-Base', 'Volbeat', 'Wailord', 'Walrein', 'Watchog', 'Weezing-Base', 'Weezing-Galar', 'Whimsicott', 'Whiscash', 'Wigglytuff', 'Wishiwashi-Base', 'Wo-Chien', 'Wormadam-Base', 'Wormadam-Sandy', 'Wormadam-Trash', 'Wugtrio', 'Wyrdeer', 'Xatu', 'Yanmega', 'Zangoose', 'Zebstrika', 'Zoroark-Base', 'Zoroark-Hisui', 'Zweilous', 'Zygarde-10%',
		],
		validateTeam(team, options) {
			return ['Not Implemented'];
		},
	},
	{
		name: "[Gen 9] Test",
		debug: true,
		mod: 'gen9',
		ruleset: ['Standard AG'],
	},

	// endregion

];
