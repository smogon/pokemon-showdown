// TODO retirer la fin des pokemons missingno + CAP + pokemon studio
"use strict";
const fileSystem = require("fs");
const { Abilities } = require("./.data-dist/abilities");
const { AbilitiesText } = require("./.data-dist/text/abilities");
const { Items } = require("./.data-dist/items");
const { ItemsText } = require("./.data-dist/text/items");
const { TypeChart } = require("./.data-dist/typechart");
const { Moves } = require("./.data-dist/moves");
const { MovesText } = require("./.data-dist/text/moves");
const { Pokedex } = require("./.data-dist/pokedex");
const { PokedexText } = require("./.data-dist/text/pokedex");
const { Learnsets } = require("./.data-dist/learnsets");
const { Natures } = require("./.data-dist/natures");
const { FormatsData } = require("./.data-dist/formats-data");

const log = error => {
	if (error) {
		console.error(error);
	} else {
		console.info("Fichier écrit");
	}
};

const removeParenthesis = string =>
	string.replace(/\(+/g, "").replace(/\)+/g, "");

console.info("abilities");
const abilities = Object.entries(Abilities)
	.filter(
		([key, value]) => !value.isNonstandard || value.isNonstandard === "Past"
	)
	.map(([key, value]) => ({
		name: value.name,
		description: AbilitiesText[key].desc || AbilitiesText[key].shortDesc,
		shortDescription: AbilitiesText[key].shortDesc
	}));
fileSystem.writeFile("json/abilities.json", JSON.stringify(abilities), log);

console.info("items");
const items = Object.entries(Items)
	.filter(
		([key, value]) => !value.isNonstandard || value.isNonstandard === "Past"
	)
	.map(([key, value]) => ({
		name: value.name,
		description: ItemsText[key].desc,
		owners: value.itemUser
	}));
fileSystem.writeFile("json/items.json", JSON.stringify(items), log);

console.info("types");
const WEAKNESS = { 0: 1, 1: 2, 2: 0.5, 3: 0 }; // translate weakness ratio
const types = Object.entries(TypeChart).map(([key, value]) => ({
	name: key,
	weaknesses: Object.entries(value.damageTaken).map(([key, value]) => ({
		name: key,
		ratio: WEAKNESS[value]
	}))
}));
fileSystem.writeFile("json/types.json", JSON.stringify(types), log);

console.info("moves");
const moves = Object.entries(Moves)
	.filter(
		([key, value]) => !value.isNonstandard || value.isNonstandard === "Past"
	)
	.map(([key, value]) => ({
		name: value.name,
		category: value.category,
		description: MovesText[key].desc || MovesText[key].shortDesc,
		shortDescription: MovesText[key].shortDesc,
		power: value.basePower,
		pp: value.pp,
		accuracy: value.accuracy === true ? null : value.accuracy,
		type: value.type
	}));
fileSystem.writeFile("json/moves.json", JSON.stringify(moves), log);

console.info("pokemons");
const pokemons = Object.values(Pokedex).map(value => ({
	name: value.name,
	type_1: value.types[0],
	type_2: value.types[1],
	hp: value.baseStats.hp,
	atk: value.baseStats.atk,
	def: value.baseStats.def,
	spa: value.baseStats.spa,
	spd: value.baseStats.spd,
	spe: value.baseStats.spe,
	ability_1: value.abilities[0],
	ability_2: value.abilities[1],
	ability_hidden: value.abilities["H"],
	weight: value.weightkg,
	forms: value.otherFormes,
	prevo: value.prevo,
	evos: value.evos
}));
fileSystem.writeFile("json/pokemons.json", JSON.stringify(pokemons), log);

console.info("learns");
let learns = [];
Object.entries(Learnsets).forEach(([pokemon, value]) => {
	const pkmName = PokedexText[pokemon] ? PokedexText[pokemon].name : pokemon;
	if (value.learnset) {
		Object.keys(value.learnset).forEach(move => {
			learns.push({ pokemon: pkmName, move });
		});
	}
});
fileSystem.writeFile("json/learns.json", JSON.stringify(learns), log);

console.info("natures");
const natures = Object.values(Natures).map(value => {
	const nature = { name: value.name };
	if (value.plus) nature[value.plus] = 1;
	if (value.minus) nature[value.minus] = -1;
	return nature;
});
fileSystem.writeFile("json/natures.json", JSON.stringify(natures), log);

console.info("pokemonTier");
const pokemonTier = Object.entries(FormatsData)
	.filter(
		([pokemon, value]) =>
			!value.isNonstandard
			|| value.isNonstandard === "Past"
			|| value.isNonstandard === "Gigantamax"
	)
	.map(([pokemon, value]) => {
		const pkmName = PokedexText[pokemon]
			? PokedexText[pokemon].name
			: pokemon;
		return {
			pokemon: pkmName,
			tier: value.tier ? removeParenthesis(value.tier) : undefined,
			doublesTier: value.doublesTier
				? removeParenthesis(value.doublesTier)
				: undefined
		};
	});
fileSystem.writeFile("json/pokemonTier.json", JSON.stringify(pokemonTier), log);
