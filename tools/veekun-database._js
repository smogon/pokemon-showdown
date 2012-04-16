var assert = require("assert").ok;
var fs = require("fs");
var request = require("request");
var zlib = require("zlib");
var sqlite = require("sqlite-fts");

function VeekunDatabase(db, _) {
	this.db = db,

	this.getAllFormeIds = function(_) {
		var dbResult = this.db.execute("SELECT id FROM pokemon_forms ORDER BY \"order\" ASC", _);
		var result = new Array();
		for (var r = 0; r < dbResult.length; ++r)
			result.push(dbResult[r].id);
		return result;
	},
	
	this.getAllGenerations = function(_) {
		var dbResult = this.db.execute("SELECT id FROM generations", _);
		var results = new Array();
		for (var d = 0; d < dbResult.length; ++d)
			results.push(dbResult[d].id);
		return results;
	},

	// Following functions return either ids or numbers

	this.getPokemonFormes = function(pokemonId, _) {
		var speciesId = this.pokemonIdToSpeciesId(pokemonId, _);
		var dbResult = this.db.execute("SELECT id, is_default FROM pokemon WHERE species_id = ?", [speciesId], _);
		var result = new Array();
		var defaults = 0;
		for (var d = 0; d < dbResult.length; ++d) {
			var dbResult2 = this.db.execute("SELECT id, is_default, is_battle_only FROM pokemon_forms WHERE pokemon_id = ?", [dbResult[d].id], _);
			for (var d2 = 0; d2 < dbResult2.length; ++d2) {
				result.push({id: dbResult2[d2].id, isDefault: !!(dbResult[d].is_default && dbResult2[d2].is_default), isBattleOnly: !!dbResult2[d2].is_battle_only});
				if (dbResult[d].is_default && dbResult2[d2].is_default)
					++defaults;
			}
		}
		assert(defaults === 1);
		return result;
	},

	this.getPokemonDefaultForme = function(pokemonId, _) {
		var formeIds = this.getPokemonFormes(pokemonId, _);
		for (var f = 0; f < formeIds.length; ++f)
			if (formeIds[f].isDefault)
				return formeIds[f].id;
		assert(false);
	},

	this.getIsDefaultFormeCache_ = new Object();
	this.getIsDefaultForme = function(formeId, _, isOverrideCache) {
		if (!isOverrideCache && this.getIsDefaultFormeCache_[formeId])
			return this.getIsDefaultFormeCache_[formeId];
		var dbResult = this.db.execute("SELECT pokemon_id, is_default FROM pokemon_forms WHERE id = ? LIMIT 1", [formeId], _)[0];
		var dbResult2 = this.db.execute("SELECT is_default FROM pokemon WHERE id = ? LIMIT 1", [dbResult.pokemon_id], _)[0];
		return (this.getIsDefaultFormeCache_[formeId] = !!(dbResult.is_default && dbResult2.is_default));
	},

	this.getIsBattleOnlyForme = function(formeId, _) {
		return !!this.db.execute("SELECT is_battle_only FROM pokemon_forms WHERE id = ? LIMIT 1", [formeId], _)[0].is_battle_only;
	},

	this.getPokemonPokedexNumbers = function(pokemonId, _) {
		var speciesId = this.pokemonIdToSpeciesId(pokemonId, _);
		var dbResult = this.db.execute("SELECT pokedex_id, pokedex_number FROM pokemon_dex_numbers WHERE species_id = ? ORDER BY pokedex_id ASC", [speciesId], _);
		var results = new Object();
		for (var d = 0; d < dbResult.length; ++d) {
			assert(!results[dbResult[d].pokedex_id]);
			results[dbResult[d].pokedex_id] = dbResult[d].pokedex_number;
		}
		return results;
	},

	this.getPokemonNationalPokedexNumber = function(pokemonId, _) {
		var nationalPokedexId = 1; // National is always 1
		var speciesId = this.pokemonIdToSpeciesId(pokemonId, _);
		return this.db.execute("SELECT pokedex_number FROM pokemon_dex_numbers WHERE species_id = ? AND pokedex_id = ? LIMIT 1", [speciesId, nationalPokedexId], _)[0].pokedex_number;
	},

	this.getFormeTypes = function(formeId, _) {
		var pokemonId = this.formeIdToPokemonId(formeId, _);
		var dbResult = this.db.execute("SELECT type_id FROM pokemon_types WHERE pokemon_id = ? ORDER BY slot ASC", [pokemonId], _);
		var results = new Array();
		for (var d = 0; d < dbResult.length; ++d)
			results.push(dbResult[d].type_id);
		return results;
	},

	this.getFormeBaseStats = function(formeId, _) {
		var pokemonId = this.formeIdToPokemonId(formeId, _);
		var dbResult = this.db.execute("SELECT stat_id, base_stat FROM pokemon_stats WHERE pokemon_id = ? ORDER BY stat_id ASC", [pokemonId], _);
		var results = new Object();
		for (var d = 0; d < dbResult.length; ++d) {
			assert(!results[dbResult[d].stat_id]);
			results[dbResult[d].stat_id] = dbResult[d].base_stat;
		}
		return results;
	},

	this.getFormeAbilities = function(formeId, _) {
		var pokemonId = this.formeIdToPokemonId(formeId, _);
		var dbResult = this.db.execute("SELECT ability_id, is_dream FROM pokemon_abilities WHERE pokemon_id = ? ORDER BY slot ASC", [pokemonId], _);
		var results = new Array();
	nextAbility:
		for (var d = 0; d < dbResult.length; ++d) {
			var result = {id: dbResult[d].ability_id, isDreamWorld: !!dbResult[d].is_dream};
			for (var r = 0; r < results.length; ++r) // Hack to get around indexOf() only matching object references
				if (JSON.stringify(result) === JSON.stringify(results[r]))
					continue nextAbility;
			results.push(result);
		}
		return results;
	},

	this.getPokemonPrevo = function(pokemonId, _) {
		var speciesId = this.pokemonIdToSpeciesId(pokemonId, _);
		var dbResult = this.db.execute("SELECT evolves_from_species_id FROM pokemon_species WHERE id = ? LIMIT 1", [speciesId], _);
		if (!dbResult[0].evolves_from_species_id)
			return 0;
		return this.speciesIdToDefaultFormePokemonId(dbResult[0].evolves_from_species_id, _);
	},

	this.getPokemonEvos = function(pokemonId, _) {
		var speciesId = this.pokemonIdToSpeciesId(pokemonId, _);
		var evoSpeciesIds = this.db.execute("SELECT id FROM pokemon_species WHERE evolves_from_species_id = ?", [speciesId], _);
		var results = new Array();
		for (var s = 0; s < evoSpeciesIds.length; ++s)
			results.push(this.speciesIdToDefaultFormePokemonId(evoSpeciesIds[s].id, _));
		return results;
	},
	
	this.getFormeLearnset = function(formeId, versionGroupId, _) {
		var pokemonId = this.formeIdToPokemonId(formeId, _);
		var dbResult = this.db.execute("SELECT * FROM pokemon_moves \
										WHERE pokemon_id = ?  AND version_group_id = ? \
										ORDER BY level,\"order\"",
									   [pokemonId, versionGroupId], _);
		var results = new Array();
		for (var d = 0; d < dbResult.length; ++d)
			results.push({
				moveId: dbResult[d].move_id,
				methodOfLearningId: dbResult[d].pokemon_move_method_id,
				levelLearnt: dbResult[d].level
			});
		return results;
	}, 

	this.getFormeMiscInfo = function(formeId, _) {
		var pokemonId = this.formeIdToPokemonId(formeId, _);
		var dbResult = this.db.execute("SELECT height, weight FROM pokemon WHERE id = ? LIMIT 1", [pokemonId], _)[0];

		var result = new Object();
		result.heightm = dbResult.height / 10;
		result.masskg = dbResult.weight / 10;

		var speciesId = this.pokemonIdToSpeciesId(pokemonId, _);
		dbResult = this.db.execute("SELECT * FROM pokemon_species WHERE id = ? LIMIT 1", [speciesId], _)[0];

//		result.generationIntroducedId = dbResult.generation_id;
		result.colourId = dbResult.color_id;
		result.shapeId = dbResult.shape_id;
		result.habitatId = dbResult.habitat_id ? dbResult.habitat_id : 0;

		result.isHasGenderAppearanceDifferences = dbResult.has_gender_differences;
		result.genderRatio = {m: 0, f: 0};
		if (dbResult.gender_rate >= 0) {
			assert(dbResult.gender_rate <= 8);
			result.genderRatio.f = dbResult.gender_rate / 8;
			result.genderRatio.m = 1 - result.genderRatio.f;
		}

		result.captureRate = dbResult.capture_rate;
		result.growthRateId = dbResult.growth_rate_id;
		result.isFormesSwitchable = dbResult.forms_switchable;

		return result;
	},

	this.getTypeId = function(typeIdentifier, _) {
		return this.db.execute("SELECT id FROM types WHERE identifier = ? LIMIT 1", [typeIdentifier], _)[0].id;
	},
	
	this.getVersionGroupIdsForGeneration = function(generation, _) {
		var dbResult = this.db.execute("SELECT id FROM version_groups WHERE generation_id = ? ORDER BY \"order\"", [generation], _);
		var results = new Array();
		for (var d = 0; d < dbResult.length; ++d)
			results.push(dbResult[d].id);
		return results;
	},
	
	this.getLanguageId = function(languageName, _) {
		return this.db.execute("SELECT id FROM languages WHERE identifier = ? LIMIT 1", [languageName], _)[0].id;
	},

	// Following functions return text

	this.fallbackLanguageId_ = this.getLanguageId("en", _),

	this.getFormeName = function(formeId, languageId, _) {
		var speciesId = this.formeIdToSpeciesId(formeId, _);
		var pokemonName = this.getSingleText_("pokemon_species_names", "name", "pokemon_species_id", speciesId, languageId, _);
		var pokemonNameWithForme = this.getSingleText_("pokemon_form_names", "pokemon_name", "pokemon_form_id", formeId, languageId, _);
		if (!pokemonNameWithForme)
			return {name: pokemonName, forme: ""};

		var positionOfPokemonName = pokemonNameWithForme.indexOf(pokemonName);
		if (positionOfPokemonName === -1) {
			// There aren't any forme names for foreign scripts, so we get the fallback instead
			var pokemonNameFallback = this.getSingleText_("pokemon_species_names", "name", "pokemon_species_id", speciesId, this.fallbackLanguageId_, _);
			assert(pokemonNameWithForme.indexOf(pokemonNameFallback) !== -1);
			pokemonNameWithForme = pokemonNameWithForme.replace(pokemonNameFallback, pokemonName);
			positionOfPokemonName = pokemonNameWithForme.indexOf(pokemonName);
		}

		assert(positionOfPokemonName !== -1);
		if (positionOfPokemonName !== 0 && positionOfPokemonName !== (pokemonNameWithForme.length - pokemonName.length))
			console.warn("Warning: Pokemon name in wierd position for \"" + pokemonNameWithForme + "\".");
		var pokemonForme = pokemonNameWithForme.replace(pokemonName, "").replace(/\s+/g, " ").trim();
		return {name: pokemonName, forme: pokemonForme};
	},

	this.getPokedexName = function(pokedexId, languageId, _) {
		return this.getSingleText_("pokedex_prose", "name", "pokedex_id", pokedexId, languageId, _);
	},
	this.getStatName = function(statId, languageId, _) {
		return this.getSingleText_("stat_names", "name", "stat_id", statId, languageId, _);
	},
	this.getTypeName = function(typeId, languageId, _) {
		return this.getSingleText_("type_names", "name", "type_id", typeId, languageId, _);
	},

	this.getPokemonPokedexDescriptions = function(pokemonId, languageId, _) {
		var speciesId = this.pokemonIdToSpeciesId(pokemonId, _);
		var dbResult = this.db.execute("SELECT version_id, flavor_text FROM pokemon_species_flavor_text \
										WHERE species_id = ? AND language_id = ? ORDER BY version_id",
									   [speciesId, languageId], _);

		var result = new Object();
		for (var d = 0; d < dbResult.length; ++d)
			result[this.getSingleText_("version_names", "name", "version_id", dbResult[d].version_id, languageId, _)] = dbResult[d].flavor_text.replace(/\s+/g, " ").trim();
		return result;
	},
	
	this.getMoveName = function(moveId, languageId, _) {
		return this.getSingleText_("move_names", "name", "move_id", moveId, languageId, _);
	},
	this.getMoveMethodOfLearningName = function(methodOfLearningId, languageId, _) {
		return this.getSingleText_("pokemon_move_method_prose", "name", "pokemon_move_method_id", methodOfLearningId, languageId, _);
	},
	this.getAbilityName = function(abilityId, languageId, _) {
		return this.getSingleText_("ability_names", "name", "ability_id", abilityId, languageId, _);
	},
	this.getPokemonGenus = function(pokemonId, languageId, _) {
		return this.getSingleText_("pokemon_species_names", "genus", "pokemon_species_id", this.pokemonIdToSpeciesId(pokemonId, _), languageId, _);
	},
	this.getColourName = function(colourId, languageId, _) {
		return this.getSingleText_("pokemon_color_names", "name", "pokemon_color_id", colourId, languageId, _);
	},
	this.getShapeName = function(shapeId, languageId, _) {
		return this.getSingleText_("pokemon_shape_prose", "awesome_name", "pokemon_shape_id", shapeId, languageId, _);
	},
	this.getHabitatName = function(habitatId, languageId, _) {
		return this.getSingleText_("pokemon_habitat_names", "name", "pokemon_habitat_id", habitatId, languageId, _);
	},

	// id conversion functions

	this.formeIdToPokemonIdCache_ = new Object();
	this.formeIdToPokemonId = function(formeId, _, isOverrideCache) {
		if (!isOverrideCache && this.formeIdToPokemonIdCache_[formeId])
			return this.formeIdToPokemonIdCache_[formeId];
		return (this.formeIdToPokemonIdCache_[formeId] = this.db.execute("SELECT pokemon_id FROM pokemon_forms WHERE id = ? LIMIT 1", [formeId], _)[0].pokemon_id);
	},
	this.formeIdToSpeciesId = function(formeId, _) {
		return this.pokemonIdToSpeciesId(this.formeIdToPokemonId(formeId, _), _);
	},
	this.pokemonIdToFormeIdsCache_ = new Object();
	this.pokemonIdToFormeIds = function(pokemonId, _, isOverrideCache) {
		if (!isOverrideCache && this.pokemonIdToFormeIdsCache_[pokemonId])
			return this.pokemonIdToFormeIdsCache_[pokemonId];
		var dbResult = this.db.execute("SELECT id FROM pokemon_forms WHERE pokemon_id = ?", [pokemonId], _);
		var result = new Array();
		for (var d = 0; d < dbResult.length; ++d)
			result.push(dbResult[d].id);
		return (this.pokemonIdToFormeIdsCache_[pokemonId] = result);
	},
	this.pokemonIdToSpeciesIdCache_ = new Object();
	this.pokemonIdToSpeciesId = function(pokemonId, _, isOverrideCache) {
		if (!isOverrideCache && this.pokemonIdToSpeciesIdCache_[pokemonId])
			return this.pokemonIdToSpeciesIdCache_[pokemonId];
		return (this.pokemonIdToSpeciesIdCache_[pokemonId] = this.db.execute("SELECT species_id FROM pokemon WHERE id = ? LIMIT 1", [pokemonId], _)[0].species_id);
	},
	this.speciesIdToPokemonIdsCache_ = new Object();
	this.speciesIdToPokemonIds = function(speciesId, _, isOverrideCache) {
		if (!isOverrideCache && this.speciesIdToPokemonIdsCache_[speciesId])
			return this.speciesIdToPokemonIdsCache_[speciesId];
		var dbResult = this.db.execute("SELECT id FROM pokemon WHERE species_id = ?", [speciesId], _);
		var result = new Array();
		for (var d = 0; d < dbResult.length; ++d)
			result.push(dbResult[d].id);
		return (this.speciesIdToPokemonIdsCache_[speciesId] = result);
	},
	this.speciesIdToDefaultFormePokemonId = function(speciesId, _) {
		var pokemonIds = this.speciesIdToPokemonIds(speciesId, _);
		var results = new Array();
		for (var p = 0; p < pokemonIds.length; ++p) {
			var pokemonId = this.formeIdToPokemonId(this.getPokemonDefaultForme(pokemonIds[p], _), _);
			if (results.indexOf(pokemonId) === -1)
				results.push(pokemonId);
		}
		assert(results.length === 1)
		return results[0];
	},

	// Convienience function

	this.getFormeData = function(formeId, languageId, _, requestedData) {
		if (!requestedData)
			requestedData = {
				name: true,
				formes: true,
				pokedexNumbers: true,
				pokedexDescriptions: true,
				types: true,
				baseStats: true,
				abilities: true,
				prevo: true,
				evos: true,
				learnset: true,
				misc: true
			};
	
		var pokemonId = this.formeIdToPokemonId(formeId, _);
		var result = new Object();

		// Get the pokemon name
		if (requestedData.name) {
			result.isDefaultForme = this.getIsDefaultForme(formeId, _);
			result.isBattleOnlyForme = this.getIsBattleOnlyForme(formeId, _);
			var name = this.getFormeName(formeId, languageId, _);
			result.name = name.name;
			result.forme = name.forme;
			result.combinedName = result.name;
			if (!result.isDefaultForme)
				result.combinedName += "-" + result.forme;
		}

		// Get the other formes of this pokemon
		if (requestedData.formes) {
			var otherFormeIds = this.getPokemonFormes(pokemonId, _);
			result.otherFormes = new Array();
			for (var f = 0; f < otherFormeIds.length; ++f)
				if (otherFormeIds[f].id !== formeId) {
					var otherForme = this.getFormeName(otherFormeIds[f].id, languageId, _);
					otherForme.isDefaultForme = otherFormeIds[f].isDefault;
					otherForme.isBattleOnlyForme = otherFormeIds[f].isBattleOnly;
					otherForme.combinedName = result.name;
					if (!otherForme.isDefaultForme)
						otherForme.combinedName += "-" + otherForme.forme;
					result.otherFormes.push(otherForme);
				}
		}

		// Get pokedex numbers
		if (requestedData.pokedexNumbers) {
			result.nationalPokedexNumber = this.getPokemonNationalPokedexNumber(pokemonId, _);
			var pokedexNumberIds = this.getPokemonPokedexNumbers(pokemonId, _);
			result.pokedexNumbers = new Object();
			for (var p in pokedexNumberIds)
				result.pokedexNumbers[this.getPokedexName(p, languageId, _)] = pokedexNumberIds[p];
		}
		
		// Get pokedex descriptions
		if (requestedData.pokedexDescriptions)
			result.descriptions = this.getPokemonPokedexDescriptions(pokemonId, languageId, _);

		// Get types
		if (requestedData.types) {
			var typeIds = this.getFormeTypes(formeId, _);
			result.types = new Array();
			for (var t = 0; t < typeIds.length; ++t)
				result.types.push(this.getTypeName(typeIds[t], languageId, _));
		}

		// Get base stats
		if (requestedData.baseStats) {
			var baseStatIds = this.getFormeBaseStats(formeId, _);
			result.baseStats = new Object();
			for (var s in baseStatIds)
				result.baseStats[this.getStatName(s, languageId, _)] = baseStatIds[s];
		}

		// Get abilities
		if (requestedData.abilities) {
			var abilityIds = this.getFormeAbilities(formeId, _);
			result.abilities = new Array();
			for (var a = 0; a < abilityIds.length; ++a)
				result.abilities.push({name: this.getAbilityName(abilityIds[a].id, languageId, _), isDreamWorld: abilityIds[a].isDreamWorld});
		}

		// Get the previous evolution
		if (requestedData.prevo) {
			var prevoId = this.getPokemonPrevo(pokemonId, _);
			if (prevoId)
				result.prevo = this.getFormeName(this.getPokemonDefaultForme(prevoId, _), languageId, _).name
			else
				result.prevo = "";
		}

		// Get the evolutions
		if (requestedData.evos) {
			var evoIds = this.getPokemonEvos(pokemonId, _);
			result.evos = new Array();
			for (var e = 0; e < evoIds.length; ++e) {
				var evoDefaultFormeId = this.getPokemonDefaultForme(evoIds[e], _);
				var evoInfo = this.getFormeMiscInfo(evoDefaultFormeId, _);
				if (evoInfo.isFormesSwitchable) {
					var evo = this.getFormeName(evoDefaultFormeId, languageId, _);
					evo.combinedName = evo.name;
					result.evos.push(evo);
				} else {
					var evoFormeIds = this.getPokemonFormes(evoIds[e], _);
					for (var f = 0; f < evoFormeIds.length; ++f) {
						if (evoFormeIds[f].isBattleOnly)
							continue;
						var evo = this.getFormeName(evoFormeIds[f].id, languageId, _);
						evo.combinedName = evo.name;
						if (!evoFormeIds[f].isDefault)
							evo.combinedName += "-" + evo.forme;
						result.evos.push(evo);
					}
				}
			}
		}
		
		// Get the pokemon learnset
		if (requestedData.learnset) {
			result.learnset = new Object();
			var generations = this.getAllGenerations(_);
			for (var g = 0; g < generations.length; ++g) {
				result.learnset[generations[g]] = new Array();
				var versionGroupIds = this.getVersionGroupIdsForGeneration(generations[g], _);
				for (var v = 0; v < versionGroupIds.length; ++v) {
					var learnset = this.getFormeLearnset(formeId, versionGroupIds[v], _);
					for (var l = 0; l < learnset.length; ++l) {
						var move = {
							name: this.getMoveName(learnset[l].moveId, languageId, _),
							methodOfLearning: this.getMoveMethodOfLearningName(learnset[l].methodOfLearningId, languageId, _),
							levelLearnt: learnset[l].levelLearnt
						};
						var isAlreadyExists = false;
						for (var r = 0; r < result.learnset[generations[g]].length; ++r) // Hack to get around indexOf() only matching object references
							if (JSON.stringify(move) === JSON.stringify(result.learnset[generations[g]][r])) {
								isAlreadyExists = true;
								break;
							}
						if (!isAlreadyExists)
							result.learnset[generations[g]].push(move);
					}
				}
			}
		}

		// Get misc info
		if (requestedData.misc) {
			var miscInfo = this.getFormeMiscInfo(formeId, _);
			result.heightm = miscInfo.heightm;
			result.masskg = miscInfo.masskg;
			result.genus = this.getPokemonGenus(pokemonId, languageId, _);
			result.colour = this.getColourName(miscInfo.colourId, languageId, _);
			result.shape = this.getShapeName(miscInfo.shapeId, languageId, _);
			result.habitat = this.getHabitatName(miscInfo.habitatId, languageId, _);
			result.isHasGenderAppearanceDifferences = miscInfo.isHasGenderAppearanceDifferences;
			result.genderRatio = miscInfo.genderRatio;
			result.isFormesSwitchable = miscInfo.isFormesSwitchable;
		}

		return result;
	},

	// Close the database

	this.close = function(_) {
		this.db.close(_);
	},

	// Lonely private function

	this.singleTextCache_ = new Object();
	this.getSingleText_ = function(table, textKey, idKey, id, languageId, _, languageIdKeyOverride, isOverrideCache) {
		if (!languageIdKeyOverride)
			languageIdKeyOverride = "local_language_id";

		var argumentsHash = JSON.stringify({table: table, textKey: textKey, idKye: idKey, id: id, languageId: languageId, languageIdKeyOverride: languageIdKeyOverride});
		if (!isOverrideCache && this.singleTextCache_[argumentsHash])
			return this.singleTextCache_[argumentsHash];

		var dbResult = this.db.execute("SELECT " + textKey + " FROM " + table + " WHERE " + idKey + " = ? AND " + languageIdKeyOverride + " = ? LIMIT 1", [id, languageId], _);
		if (dbResult.length === 0)
			dbResult = this.db.execute("SELECT " + textKey + " FROM " + table + " WHERE " + idKey + " = ? AND " + languageIdKeyOverride + " = ? LIMIT 1", [id, this.fallbackLanguageId_], _);

		if (dbResult.length > 0 && dbResult[0][textKey])
			return (this.singleTextCache_[argumentsHash] = dbResult[0][textKey].replace(/\s+/g, " ").trim()); // Normalise spaces
		else
			return (this.singleTextCache_[argumentsHash] = "");
	}
}

exports.getVeekunDatabase = function(_, isForceRedownload) {
	try {
		var stat = fs.lstatSync("veekun.sqlite");
		if (!stat.isFile())
			isForceRedownload = true;
	} catch (e) {
		isForceRedownload = true;
	}
	
	if (isForceRedownload) {
		console.warn("Downloading Veekun Database.");
		var gunzip = zlib.createGunzip();
		request("http://veekun.com/static/pokedex/downloads/veekun-pokedex.sqlite.gz")
			.pipe(gunzip).pipe(fs.createWriteStream("veekun.sqlite"))
			.on("close", _);
	}
	var db = new sqlite.Database();
	db.open("veekun.sqlite", _);
	return new VeekunDatabase(db, _);
}
