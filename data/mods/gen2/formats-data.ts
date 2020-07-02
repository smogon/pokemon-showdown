export const BattleFormatsData: {[k: string]: ModdedSpeciesFormatsData} = {
	bulbasaur: {
		tiers: ["LC"],
	},
	ivysaur: {
		tiers: ["NFE"],
	},
	venusaur: {
		randomSets: [
			{
				chance: 4,
				item: ["leftovers"],
				baseMove1: "leechseed", baseMove2: "synthesis",
				fillerMoves1: ["razorleaf", "razorleaf", "hiddenpowerice"],
				fillerMoves2: ["sleeppowder", "sleeppowder", "sleeppowder", "reflect", "lightscreen"],
			},
			{
				chance: 8,
				item: ["leftovers"],
				fillerMoves1: ["razorleaf", "gigadrain", "gigadrain"],
				fillerMoves2: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerfire", "bodyslam"],
				fillerMoves3: ["sleeppowder", "synthesis", "leechseed", "reflect", "lightscreen"],
				fillerMoves4: ["sleeppowder", "synthesis", "leechseed"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "gigadrain",
				fillerMoves1: ["bodyslam", "bodyslam", "return"],
				fillerMoves2: ["sleeppowder", "sleeppowder", "synthesis", "ancientpower"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "gigadrain",
				fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerice", "hiddenpowerfire", "hiddenpowerwater"],
				fillerMoves2: ["sleeppowder", "sleeppowder", "synthesis"],
			},
		],
		tiers: ["UUBL"],
	},
	charmander: {
		tiers: ["LC"],
	},
	charmeleon: {
		tiers: ["NFE"],
	},
	charizard: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "rockslide",
				fillerMoves1: ["bellydrum", "bellydrum", "swordsdance", "swordsdance"],
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "charcoal"],
				baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "sunnyday",
				fillerMoves1: ["hiddenpowergrass", "hiddenpowergrass", "hiddenpowerice", "rockslide", "crunch", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["UUBL"],
	},
	squirtle: {
		tiers: ["LC"],
	},
	wartortle: {
		tiers: ["NFE"],
	},
	blastoise: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "surf",
				fillerMoves1: ["icebeam", "icebeam", "toxic", "zapcannon"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "toxic", baseMove3: "rest",
				fillerMoves1: ["icebeam", "haze", "rapidspin", "mirrorcoat", "mirrorcoat"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "icebeam", baseMove3: "rest",
				fillerMoves1: ["mirrorcoat", "haze", "rapidspin"],
			},
			{
				chance: 16,
				item: ["leftovers", "leftovers", "leftovers", "mintberry"],
				baseMove1: "icebeam", baseMove2: "rest",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["earthquake", "zapcannon"],
			},
		],
		tiers: ["UU"],
	},
	caterpie: {
		tiers: ["LC"],
	},
	metapod: {
		tiers: ["NFE"],
	},
	butterfree: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "sleeppowder",
				fillerMoves1: ["stunspore", "stunspore", "toxic"],
				fillerMoves2: ["psychic", "psychic", "psychic", "psywave"],
				fillerMoves3: ["gigadrain", "gigadrain", "psywave", "reflect", "reflect", "safeguard", "hiddenpowerbug", "nightmare"],
			},
		],
		tiers: ["NU"],
	},
	weedle: {
		tiers: ["LC"],
	},
	kakuna: {
		tiers: ["NFE"],
	},
	beedrill: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers", "leftovers", "miracleberry", "miracleberry", "poisonbarb"],
				baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "sludgebomb", baseMove4: "hiddenpowerground",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "sludgebomb", baseMove3: "hiddenpowerground",
				fillerMoves1: ["substitute", "substitute", "return", "reflect"],
			},
		],
		tiers: ["NU"],
	},
	pidgey: {
		tiers: ["LC"],
	},
	pidgeotto: {
		tiers: ["NFE"],
	},
	pidgeot: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "wingattack",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "steelwing", "hiddenpowergrass"],
				fillerMoves2: ["toxic", "rest", "steelwing", "doubleedge", "substitute", "reflect"],
			},
			{
				chance: 9,
				baseMove1: "return", baseMove2: "thief",
				fillerMoves1: ["wingattack", "hiddenpowerflying", "hiddenpowerground"],
				fillerMoves2: ["toxic", "reflect", "hiddenpowerground"],
			},
			{
				chance: 11,
				item: ["miracleberry", "mintberry"],
				baseMove1: "return", baseMove2: "thief", baseMove3: "rest",
				fillerMoves1: ["wingattack", "wingattack", "hiddenpowerground"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "curse",
				fillerMoves1: ["rest", "hiddenpowerground", "hiddenpowerground"],
				fillerMoves2: ["rest", "wingattack", "wingattack"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["return", "return", "doubleedge"],
				fillerMoves2: ["wingattack", "hiddenpowerflying", "hiddenpowerground"],
			},
		],
		tiers: ["NU"],
	},
	rattata: {
		tiers: ["LC"],
	},
	raticate: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "superfang", baseMove2: "return",
				fillerMoves1: ["irontail", "irontail", "icebeam", "thunder"],
				fillerMoves2: ["irontail", "irontail", "shadowball"],
			},
			{
				chance: 13,
				baseMove1: "superfang", baseMove2: "return", baseMove3: "thief",
				fillerMoves1: ["irontail", "irontail", "irontail", "shadowball", "hiddenpowerground"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "superfang", baseMove2: "return", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["NU"],
	},
	spearow: {
		tiers: ["LC"],
	},
	fearow: {
		randomSets: [
			{
				chance: 3,
				item: ["leftovers", "leftovers", "miracleberry", "miracleberry", "miracleberry"],
				baseMove1: "return", baseMove2: "drillpeck",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "steelwing"],
				fillerMoves2: ["steelwing", "doubleedge", "hyperbeam"],
			},
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "drillpeck", baseMove3: "substitute",
				fillerMoves1: ["hiddenpowerground", "steelwing"],
			},
			{
				chance: 11,
				baseMove1: "return", baseMove2: "drillpeck", baseMove3: "thief",
				fillerMoves1: ["hiddenpowerground", "steelwing"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "drillpeck",
				fillerMoves1: ["return", "return", "doubleedge"],
			},
		],
		tiers: ["NU"],
	},
	ekans: {
		tiers: ["LC"],
	},
	arbok: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "earthquake", baseMove3: "glare",
				fillerMoves1: ["rockslide", "rockslide", "rockslide", "gigadrain", "screech", "substitute", "curse"],
			},
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["NU"],
	},
	pichu: {
		tiers: ["LC"],
	},
	pikachu: {
		tiers: ["UU"],
	},
	raichu: {
		randomSets: [
			{
				chance: 13,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "thunderbolt", baseMove2: "surf", baseMove3: "hiddenpowerice",
				fillerMoves1: ["thunderwave", "thunderwave", "sing"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "surf", baseMove3: "thunderwave",
				fillerMoves1: ["reflect", "lightscreen"],
			},
		],
		tiers: ["NUBL"],
	},
	sandshrew: {
		tiers: ["LC"],
	},
	sandslash: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "earthquake", baseMove3: "rockslide",
				fillerMoves1: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerbug", "bodyslam", "counter", "substitute"],
			},
		],
		tiers: ["UU"],
	},
	nidoranf: {
		tiers: ["LC"],
	},
	nidorina: {
		tiers: ["NFE"],
	},
	nidoqueen: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "earthquake",
				fillerMoves1: ["thunderbolt", "thunderbolt", "thunder", "thunder", "icebeam"],
				fillerMoves2: ["icebeam", "icebeam", "rockslide", "fireblast"],
				fillerMoves3: ["lovelykiss", "lovelykiss", "lovelykiss", "counter", "icebeam"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "moonlight",
				fillerMoves1: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunderbolt", "thunder"],
				fillerMoves2: ["reflect", "reflect", "icebeam", "icebeam", "toxic", "roar"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves2: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunder"],
			},
		],
		tiers: ["UU"],
	},
	nidoranm: {
		tiers: ["LC"],
	},
	nidorino: {
		tiers: ["NFE"],
	},
	nidoking: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake",
				fillerMoves1: ["thunderbolt", "thunder", "thunder", "icebeam"],
				fillerMoves2: ["icebeam", "icebeam", "rockslide", "rockslide", "fireblast"],
				fillerMoves3: ["lovelykiss", "lovelykiss", "lovelykiss", "lovelykiss", "morningsun", "morningsun", "counter"],
			},
		],
		tiers: ["OU"],
	},
	cleffa: {
		tiers: ["LC"],
	},
	clefairy: {
		tiers: ["NFE"],
	},
	clefable: {
		randomSets: [
			{
				chance: 4,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "return", baseMove3: "moonlight",
				fillerMoves1: ["icebeam", "icebeam", "hiddenpowerground", "hiddenpowerground", "fireblast", "sing", "encore"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "icebeam",
				fillerMoves1: ["return", "bodyslam", "doubleedge"],
				fillerMoves2: ["thunderbolt", "thunderbolt", "fireblast", "moonlight"],
				fillerMoves3: ["moonlight", "moonlight", "moonlight", "counter", "sing"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "moonlight", baseMove2: "icebeam",
				fillerMoves1: ["return", "return", "thunderbolt", "thunderbolt", "fireblast", "thunderwave"],
				fillerMoves2: ["reflect", "lightscreen", "lightscreen", "thunderwave", "thunderwave", "thunderwave"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "moonlight", baseMove2: "bodyslam",
				fillerMoves1: ["icebeam", "fireblast"],
				fillerMoves2: ["reflect", "lightscreen"],
			},
		],
		tiers: ["UUBL"],
	},
	vulpix: {
		tiers: ["LC"],
	},
	ninetales: {
		randomSets: [
			{
				chance: 13,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry", "charcoal"],
				baseMove1: "fireblast", baseMove2: "hiddenpowergrass",
				fillerMoves1: ["hypnosis", "hypnosis", "hypnosis", "sunnyday"],
				fillerMoves2: ["sunnyday", "sunnyday", "confuseray", "return"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "confuseray", baseMove2: "toxic", baseMove3: "substitute",
				fillerMoves1: ["flamethrower", "fireblast"],
			},
		],
		tiers: ["NU"],
	},
	igglybuff: {
		tiers: ["LC"],
	},
	jigglypuff: {
		tiers: ["NFE"],
	},
	wigglytuff: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers"],
				baseMove1: "doubleedge", baseMove2: "icebeam", baseMove3: "thunderwave",
				fillerMoves1: ["thunderbolt", "thunderbolt", "fireblast"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "icebeam",
				fillerMoves1: ["doubleedge", "bodyslam"],
				fillerMoves2: ["thunderbolt", "thunderbolt", "fireblast"],
				fillerMoves3: ["sing", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["doubleedge", "doubleedge", "bodyslam"],
				fillerMoves2: ["curse", "curse", "curse", "icebeam", "fireblast"],
			},
		],
		tiers: ["NU"],
	},
	zubat: {
		tiers: ["LC"],
	},
	golbat: {
		tiers: ["NFE"],
	},
	crobat: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "wingattack", baseMove2: "hiddenpowerground",
				fillerMoves1: ["return", "doubleedge", "confuseray"],
				fillerMoves2: ["confuseray", "confuseray", "screech", "toxic"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "wingattack", baseMove2: "hiddenpowerground", baseMove3: "curse",
				fillerMoves1: ["return", "doubleedge", "doubleedge", "whirlwind"],
			},
			{
				chance: 12,
				baseMove1: "wingattack", baseMove2: "hiddenpowerground", baseMove3: "thief",
				fillerMoves1: ["return", "doubleedge", "confuseray", "confuseray"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "hiddenpowerground",
				fillerMoves1: ["return", "doubleedge", "wingattack", "wingattack", "wingattack"],
			},
		],
		tiers: ["UU"],
	},
	oddish: {
		tiers: ["LC"],
	},
	gloom: {
		tiers: ["NFE"],
	},
	vileplume: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "sludgebomb", baseMove3: "gigadrain",
				fillerMoves1: ["sleeppowder", "sleeppowder", "bodyslam", "hiddenpowerground", "moonlight", "moonlight"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "leechseed", baseMove2: "sludgebomb",
				fillerMoves1: ["gigadrain", "moonlight"],
				fillerMoves2: ["sleeppowder", "sleeppowder", "moonlight", "reflect", "stunspore"],
			},
		],
		tiers: ["UU"],
	},
	bellossom: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "leechseed", baseMove2: "moonlight", baseMove3: "sludgebomb",
				fillerMoves1: ["gigadrain", "sleeppowder", "stunspore", "reflect"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "razorleaf", baseMove2: "moonlight",
				fillerMoves1: ["sleeppowder", "stunspore", "stunspore", "toxic", "reflect"],
				fillerMoves2: ["sleeppowder", "reflect"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "gigadrain",
				fillerMoves1: ["sludgebomb", "hiddenpowerice"],
				fillerMoves2: ["sleeppowder", "stunspore"],
				fillerMoves3: ["moonlight", "leechseed", "sleeppowder"],
			},
		],
		tiers: ["UU"],
	},
	paras: {
		tiers: ["LC"],
	},
	parasect: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "hiddenpowerrock",
				fillerMoves1: ["bodyslam", "bodyslam", "return"],
				fillerMoves2: ["spore", "gigadrain"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "hiddenpowerbug", baseMove3: "bodyslam",
				fillerMoves2: ["spore", "gigadrain"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "spore", baseMove2: "stunspore", baseMove3: "return",
				fillerMoves1: ["gigadrain", "hiddenpowerbug", "hiddenpowerrock"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "spore", baseMove2: "synthesis", baseMove3: "bodyslam",
				fillerMoves1: ["gigadrain", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock"],
			},
		],
		tiers: ["NU"],
	},
	venonat: {
		tiers: ["LC"],
	},
	venomoth: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "sludgebomb",
				fillerMoves1: ["hiddenpowerground", "psychic"],
				fillerMoves2: ["sleeppowder", "sleeppowder", "stunspore"],
			},
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "sludgebomb", baseMove3: "gigadrain",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "return"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "psychic",
				fillerMoves1: ["sleeppowder", "sleeppowder", "sleeppowder", "stunspore"],
				fillerMoves2: ["stunspore", "reflect", "gigadrain", "gigadrain"],
			},
		],
		tiers: ["NU"],
	},
	diglett: {
		tiers: ["LC"],
	},
	dugtrio: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "earthquake", baseMove2: "rockslide", baseMove3: "sludgebomb",
				fillerMoves1: ["substitute", "screech", "curse"],
			},
		],
		tiers: ["NU"],
	},
	meowth: {
		tiers: ["LC"],
	},
	persian: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "icebeam", baseMove2: "hypnosis",
				fillerMoves1: ["return", "return", "return", "bodyslam", "doubleedge"],
				fillerMoves2: ["irontail", "swagger", "hiddenpowerground"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "substitute", baseMove2: "swagger",
				fillerMoves1: ["return", "return", "bodyslam", "doubleedge"],
				fillerMoves2: ["irontail", "shadowball", "hiddenpowerground"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["return", "return", "bodyslam", "doubleedge"],
				fillerMoves2: ["substitute", "substitute", "irontail"],
			},
		],
		tiers: ["NU"],
	},
	psyduck: {
		tiers: ["LC"],
	},
	golduck: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "icebeam", baseMove2: "crosschop",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["hypnosis", "hypnosis", "hypnosis", "hiddenpowerelectric", "psychic"],
			},
		],
		tiers: ["NUBL"],
	},
	mankey: {
		tiers: ["LC"],
	},
	primeape: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "crosschop", baseMove2: "rockslide",
				fillerMoves1: ["hiddenpowerbug", "hiddenpowerghost", "doubleedge"],
				fillerMoves2: ["meditate", "meditate", "counter", "curse"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "crosschop", baseMove4: "rockslide",
			},
			{
				chance: 16,
				item: ["miracleberry"],
				baseMove1: "endure", baseMove2: "reversal",
				fillerMoves1: ["crosschop", "meditate"],
				fillerMoves2: ["rockslide", "hiddenpowerghost"],
			},
		],
		tiers: ["NU"],
	},
	growlithe: {
		tiers: ["LC"],
	},
	arcanine: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "fireblast",
				fillerMoves1: ["irontail", "crunch", "hiddenpowergrass"],
				fillerMoves2: ["bodyslam", "bodyslam", "extremespeed", "doubleedge"],
				fillerMoves3: ["sunnyday", "sunnyday", "rest", "crunch"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "bodyslam", baseMove2: "rest", baseMove3: "reflect",
				fillerMoves1: ["flamethrower", "fireblast"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["crunch", "crunch", "bodyslam", "bodyslam", "doubleedge"],
			},
		],
		tiers: ["UU"],
	},
	poliwag: {
		tiers: ["LC"],
	},
	poliwhirl: {
		tiers: ["NFE"],
	},
	poliwrath: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "lovelykiss", baseMove3: "bodyslam", baseMove4: "earthquake",
			},
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "bodyslam", baseMove3: "earthquake",
				fillerMoves1: ["surf", "surf", "hiddenpowerbug", "hiddenpowerrock"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake",
				fillerMoves1: ["surf", "hydropump"],
				fillerMoves2: ["icebeam", "icebeam", "bodyslam"],
				fillerMoves3: ["lovelykiss", "lovelykiss", "lovelykiss", "lovelykiss", "dynamicpunch", "bodyslam", "counter"],
			},
		],
		tiers: ["NUBL"],
	},
	politoed: {
		randomSets: [
			{
				chance: 4,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "lovelykiss", baseMove3: "bodyslam",
				fillerMoves1: ["earthquake", "surf"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "icebeam",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["hiddenpowerelectric", "rest"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["icebeam", "growth"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "icebeam",
				fillerMoves1: ["surf", "hydropump"],
				fillerMoves2: ["hiddenpowerelectric", "earthquake", "bodyslam", "rest", "lovelykiss"],
				fillerMoves3: ["rest", "lovelykiss"],
			},
		],
		tiers: ["UU"],
	},
	abra: {
		tiers: ["LC"],
	},
	kadabra: {
		tiers: ["UU"],
	},
	alakazam: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers", "miracleberry"],
				baseMove1: "psychic", baseMove2: "thunderpunch",
				fillerMoves1: ["firepunch", "icepunch"],
				fillerMoves2: ["recover", "thunderwave", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "recover",
				fillerMoves1: ["reflect", "reflect", "lightscreen", "thunderwave"],
				fillerMoves2: ["thunderwave", "thunderwave", "thunderpunch", "icepunch", "firepunch", "encore"],
			},
		],
		tiers: ["UUBL"],
	},
	machop: {
		tiers: ["LC"],
	},
	machoke: {
		tiers: ["NFE"],
	},
	machamp: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "crosschop", baseMove3: "earthquake", baseMove4: "rockslide",
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "crosschop", baseMove2: "earthquake", baseMove3: "rockslide",
				fillerMoves1: ["fireblast", "fireblast", "hiddenpowerbug", "hiddenpowerbug", "bodyslam", "lightscreen", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "crosschop",
				fillerMoves1: ["curse", "curse", "rockslide"],
			},
		],
		tiers: ["OU"],
	},
	bellsprout: {
		tiers: ["LC"],
	},
	weepinbell: {
		tiers: ["NFE"],
	},
	victreebel: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "sludgebomb",
				fillerMoves1: ["gigadrain", "gigadrain", "hiddenpowerground"],
				fillerMoves2: ["sleeppowder", "sleeppowder", "hiddenpowerground", "return", "synthesis"],
			},
		],
		tiers: ["UU"],
	},
	tentacool: {
		tiers: ["LC"],
	},
	tentacruel: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "sludgebomb",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["substitute", "substitute", "icebeam"],
			},
			{
				chance: 13,
				item: ["leftovers", "mintberry"],
				baseMove1: "swordsdance", baseMove2: "sludgebomb", baseMove3: "rest",
				fillerMoves1: ["surf", "surf", "hydropump"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "icebeam",
				fillerMoves1: ["hydropump", "surf"],
				fillerMoves2: ["mirrorcoat", "rapidspin", "haze"],
			},
		],
		tiers: ["UUBL"],
	},
	geodude: {
		tiers: ["LC"],
	},
	graveler: {
		tiers: ["NFE"],
	},
	golem: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "rockslide", baseMove3: "explosion",
				fillerMoves1: ["curse", "hiddenpowerbug", "fireblast", "rapidspin", "roar"],
			},
		],
		tiers: ["OU"],
	},
	ponyta: {
		tiers: ["LC"],
	},
	rapidash: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "irontail",
				fillerMoves1: ["return", "doubleedge", "bodyslam", "bodyslam"],
				fillerMoves2: ["hypnosis", "hypnosis", "hypnosis", "hiddenpowerelectric"],
			},
			{
				chance: 13,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry", "charcoal"],
				baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "hiddenpowergrass",
				fillerMoves1: ["bodyslam", "return"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "fireblast", baseMove4: "bodyslam",
			},
		],
		tiers: ["NU"],
	},
	slowpoke: {
		tiers: ["LC"],
	},
	slowbro: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "psychic", baseMove3: "icebeam", baseMove4: "thunderwave",
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "rest",
				fillerMoves1: ["thunderwave", "thunderwave", "thunderwave", "reflect"],
				fillerMoves2: ["psychic", "psychic", "icebeam", "reflect"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "surf",
				fillerMoves1: ["psychic", "psychic", "thunderwave"],
			},
		],
		tiers: ["UU"],
	},
	slowking: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "psychic", baseMove3: "icebeam", baseMove4: "thunderwave",
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "rest",
				fillerMoves1: ["thunderwave", "thunderwave", "reflect"],
				fillerMoves2: ["psychic", "psychic", "icebeam", "reflect", "thunderwave"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "surf",
				fillerMoves1: ["psychic", "psychic", "thunderwave"],
			},
		],
		tiers: ["UU"],
	},
	magnemite: {
		tiers: ["LC"],
	},
	magneton: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "rest", baseMove4: "sleeptalk",
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "leftovers", "magnet"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "thunderwave",
				fillerMoves1: ["reflect", "substitute", "substitute"],
			},
			{
				chance: 16,
				item: ["leftovers", "magnet"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "thunderwave", baseMove4: "thunder",
			},
		],
		tiers: ["UU"],
	},
	farfetchd: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers", "miracleberry", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "return", baseMove4: "batonpass",
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "substitute", baseMove3: "return", baseMove4: "batonpass",
			},
			{
				chance: 14,
				item: ["stick"],
				baseMove1: "swordsdance", baseMove2: "return",
				fillerMoves1: ["agility", "hiddenpowerflying"],
				fillerMoves2: ["irontail", "hiddenpowerground"],
			},
			{
				chance: 16,
				item: ["miracleberry"],
				baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "endure", baseMove4: "flail",
			},
		],
		tiers: ["NU"],
	},
	doduo: {
		tiers: ["LC"],
	},
	dodrio: {
		randomSets: [
			{
				chance: 3,
				item: ["leftovers", "miracleberry", "miracleberry"],
				baseMove1: "drillpeck",
				fillerMoves1: ["bodyslam", "return", "doubleedge"],
				fillerMoves2: ["hiddenpowerground", "steelwing"],
				fillerMoves3: ["bodyslam", "return", "doubleedge"],
			},
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "drillpeck", baseMove3: "substitute",
				fillerMoves1: ["hiddenpowerground", "steelwing"],
			},
			{
				chance: 11,
				baseMove1: "return", baseMove2: "drillpeck", baseMove3: "thief",
				fillerMoves1: ["hiddenpowerground", "steelwing"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "drillpeck",
				fillerMoves1: ["return", "return", "doubleedge"],
			},
		],
		tiers: ["UU"],
	},
	seel: {
		tiers: ["LC"],
	},
	dewgong: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "icebeam", baseMove2: "surf", baseMove3: "rest", baseMove4: "sleeptalk",
			},
			{
				chance: 13,
				item: ["leftovers", "leftovers", "leftovers", "mintberry"],
				baseMove1: "icebeam", baseMove2: "surf", baseMove3: "rest",
				fillerMoves1: ["encore", "safeguard", "toxic", "toxic"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "whirlpool", baseMove2: "perishsong", baseMove3: "protect", baseMove4: "icebeam",
			},
		],
		tiers: ["NU"],
	},
	grimer: {
		tiers: ["LC"],
	},
	muk: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "sludgebomb",
				fillerMoves1: ["dynamicpunch", "hiddenpowerground", "hiddenpowerground"],
				fillerMoves2: ["explosion", "explosion", "explosion", "dynamicpunch", "fireblast", "bodyslam"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "explosion",
				fillerMoves1: ["dynamicpunch", "hiddenpowerground"],
				fillerMoves2: ["dynamicpunch", "bodyslam", "fireblast", "gigadrain"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "sludgebomb", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["UUBL"],
	},
	shellder: {
		tiers: ["LC"],
	},
	cloyster: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "spikes", baseMove2: "icebeam",
				fillerMoves1: ["surf", "surf", "toxic", "reflect"],
				fillerMoves2: ["explosion", "explosion", "explosion", "rapidspin"],
			},
		],
		tiers: ["OU"],
	},
	gastly: {
		tiers: ["LC"],
	},
	haunter: {
		tiers: ["UU"],
	},
	gengar: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "thunderbolt", baseMove2: "icepunch",
				fillerMoves1: ["explosion", "explosion", "destinybond", "hypnosis"],
				fillerMoves2: ["hypnosis", "hypnosis", "firepunch", "psychic", "shadowball", "counter"],
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "thunderbolt", baseMove2: "firepunch", baseMove3: "gigadrain",
				fillerMoves1: ["explosion", "explosion", "destinybond", "hypnosis"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "meanlook", baseMove2: "perishsong", baseMove3: "protect",
				fillerMoves1: ["thunderbolt", "thunderbolt", "confuseray", "destinybond"],
			},
		],
		tiers: ["OU"],
	},
	onix: {
		tiers: ["LC"],
	},
	steelix: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "earthquake", baseMove3: "explosion",
				fillerMoves1: ["irontail", "rockslide", "bodyslam"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "toxic", baseMove3: "rest",
				fillerMoves1: ["rockslide", "irontail", "roar"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "roar", baseMove3: "explosion",
				fillerMoves1: ["bodyslam", "rockslide", "irontail"],
			},
		],
		tiers: ["OU"],
	},
	drowzee: {
		tiers: ["LC"],
	},
	hypno: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "thunderwave", baseMove3: "rest",
				fillerMoves1: ["reflect", "lightscreen"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "psychic",
				fillerMoves1: ["thunderpunch", "hypnosis", "hypnosis"],
				fillerMoves2: ["thunderpunch", "icepunch", "firepunch", "shadowball"],
				fillerMoves3: ["thunderwave", "thunderwave", "counter", "reflect"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "psychic",
				fillerMoves1: ["seismictoss", "seismictoss", "thunderwave"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "bodyslam", baseMove3: "psychic",
				fillerMoves1: ["rest", "rest", "shadowball"],
			},
		],
		tiers: ["UU"],
	},
	krabby: {
		tiers: ["LC"],
	},
	kingler: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "return", baseMove3: "surf",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerbug"],
			},
		],
		tiers: ["NU"],
	},
	voltorb: {
		tiers: ["LC"],
	},
	electrode: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "explosion",
				fillerMoves1: ["reflect", "lightscreen", "thunderwave", "thunderwave"],
			},
			{
				chance: 15,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice",
				fillerMoves1: ["reflect", "lightscreen"],
				fillerMoves2: ["explosion", "thunderwave"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "mirrorcoat",
				fillerMoves1: ["reflect", "explosion"],
			},
		],
		tiers: ["UU"],
	},
	exeggcute: {
		tiers: ["LC"],
	},
	exeggutor: {
		randomSets: [
			{
				chance: 4,
				item: ["leftovers"],
				baseMove1: "psychic",
				fillerMoves1: ["moonlight", "synthesis"],
				fillerMoves2: ["leechseed", "gigadrain", "gigadrain"],
				fillerMoves3: ["sleeppowder", "sleeppowder", "stunspore", "reflect"],
			},
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "gigadrain", baseMove3: "hiddenpowerfire",
				fillerMoves1: ["explosion", "explosion", "sleeppowder"],
			},
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "leechseed",
				fillerMoves1: ["stunspore", "stunspore", "toxic"],
				fillerMoves2: ["substitute", "substitute", "sleeppowder"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "gigadrain", baseMove3: "explosion",
				fillerMoves1: ["sleeppowder", "sleeppowder", "stunspore"],
			},
		],
		tiers: ["OU"],
	},
	cubone: {
		tiers: ["LC"],
	},
	marowak: {
		randomSets: [
			{
				chance: 16,
				item: ["thickclub"],
				baseMove1: "swordsdance",
				fillerMoves1: ["earthquake", "earthquake", "bonemerang"],
				fillerMoves2: ["rockslide", "rockslide", "ancientpower"],
				fillerMoves3: ["bodyslam", "hiddenpowerbug"],
			},
		],
		tiers: ["OU"],
	},
	tyrogue: {
		tiers: ["LC"],
	},
	hitmonlee: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "highjumpkick",
				fillerMoves1: ["bodyslam", "return"],
				fillerMoves2: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
				fillerMoves3: ["meditate", "counter", "curse"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "highjumpkick",
				fillerMoves1: ["curse", "bodyslam"],
			},
			{
				chance: 16,
				item: ["miracleberry"],
				baseMove1: "endure", baseMove2: "meditate", baseMove3: "reversal", baseMove4: "hiddenpowerghost",
			},
		],
		tiers: ["NU"],
	},
	hitmonchan: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "highjumpkick", baseMove2: "bodyslam",
				fillerMoves1: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
				fillerMoves2: ["counter", "curse", "curse", "machpunch"],
			},
			{
				chance: 12,
				baseMove1: "highjumpkick", baseMove2: "bodyslam", baseMove3: "thief",
				fillerMoves1: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "highjumpkick", baseMove4: "bodyslam",
			},
		],
		tiers: ["NU"],
	},
	hitmontop: {
		randomSets: [
			{
				chance: 13,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "highjumpkick", baseMove2: "return",
				fillerMoves2: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
				fillerMoves3: ["counter", "curse", "curse", "machpunch", "rapidspin"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "highjumpkick",
				fillerMoves1: ["curse", "return"],
			},
		],
		tiers: ["NU"],
	},
	lickitung: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "bodyslam", baseMove3: "earthquake",
				fillerMoves1: ["thunderbolt", "shadowball", "fireblast", "megakick", "doubleedge", "counter"],
			},
			{
				chance: 9,
				item: ["leftovers", "mintberry"],
				baseMove1: "swordsdance", baseMove2: "bodyslam", baseMove3: "earthquake", baseMove4: "rest",
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["bodyslam", "icebeam"],
				fillerMoves2: ["bodyslam", "seismictoss"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "bodyslam", baseMove4: "curse",
			},
			{
				chance: 16,
				item: ["leftovers"],
				fillerMoves1: ["bodyslam", "bodyslam", "doubleedge"],
				fillerMoves2: ["thunder", "thunderbolt", "thunderbolt", "fireblast"],
				fillerMoves3: ["icebeam", "icebeam", "icebeam", "earthquake"],
				fillerMoves4: ["fireblast", "earthquake", "counter", "rest"],
			},
		],
		tiers: ["NU"],
	},
	koffing: {
		tiers: ["LC"],
	},
	weezing: {
		randomSets: [
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "thunderbolt", baseMove3: "fireblast",
				fillerMoves1: ["explosion", "explosion", "explosion", "explosion", "destinybond", "painsplit"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "curse", baseMove3: "explosion",
				fillerMoves1: ["thunderbolt", "fireblast"],
			},
		],
		tiers: ["NU"],
	},
	rhyhorn: {
		tiers: ["LC"],
	},
	rhydon: {
		randomSets: [
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "rockslide",
				fillerMoves1: ["curse", "hiddenpowerbug", "roar"],
				fillerMoves2: ["rest", "hiddenpowerbug", "roar"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "rockslide", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["OU"],
	},
	chansey: {
		tiers: ["UU"],
	},
	blissey: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers"],
				baseMove1: "healbell", baseMove2: "softboiled", baseMove3: "toxic",
				fillerMoves2: ["icebeam", "icebeam", "flamethrower", "lightscreen"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "healbell", baseMove2: "softboiled", baseMove3: "lightscreen",
				fillerMoves1: ["toxic", "icebeam"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "healbell", baseMove2: "softboiled", baseMove3: "icebeam",
				fillerMoves1: ["sing", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "reflect", baseMove2: "softboiled", baseMove3: "thunderwave",
				fillerMoves1: ["seismictoss", "icebeam", "icebeam"],
			},
		],
		tiers: ["OU"],
	},
	tangela: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "gigadrain",
				fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerwater"],
				fillerMoves2: ["sleeppowder", "sleeppowder", "synthesis"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "sleeppowder", baseMove2: "gigadrain",
				fillerMoves1: ["reflect", "reflect", "synthesis"],
				fillerMoves2: ["stunspore", "stunspore", "synthesis"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "sleeppowder", baseMove2: "swordsdance", baseMove3: "gigadrain", baseMove4: "bodyslam",
			},
		],
		tiers: ["NU"],
	},
	kangaskhan: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers", "leftovers", "mintberry"],
				baseMove1: "curse", baseMove2: "earthquake", baseMove3: "rest",
				fillerMoves1: ["bodyslam", "bodyslam", "return"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["bodyslam", "bodyslam", "return"],
				fillerMoves2: ["earthquake", "curse"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "bodyslam", baseMove2: "earthquake",
				fillerMoves1: ["rockslide", "rockslide", "shadowball"],
				fillerMoves2: ["shadowball", "counter", "dynamicpunch", "doubleedge", "substitute"],
			},
		],
		tiers: ["UUBL"],
	},
	horsea: {
		tiers: ["LC"],
	},
	seadra: {
		tiers: ["NFE"],
	},
	kingdra: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["icebeam", "dragonbreath"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "haze", baseMove3: "rest",
				fillerMoves1: ["dragonbreath", "toxic", "icebeam"],
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "mintberry"],
				baseMove1: "curse", baseMove2: "return", baseMove3: "surf", baseMove4: "rest",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "return", baseMove3: "surf",
				fillerMoves1: ["hiddenpowerrock", "hiddenpowerbug"],
			},
		],
		tiers: ["UUBL"],
	},
	goldeen: {
		tiers: ["LC"],
	},
	seaking: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "return", baseMove3: "surf",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerrock", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerbug"],
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "return",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "surf", "surf", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerbug"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["return", "icebeam"],
			},
		],
		tiers: ["NU"],
	},
	staryu: {
		tiers: ["LC"],
	},
	starmie: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry", "miracleberry"],
				baseMove1: "recover",
				fillerMoves1: ["hydropump", "surf"],
				fillerMoves2: ["thunderbolt", "thunderbolt", "thunderbolt", "psychic"],
				fillerMoves3: ["icebeam", "icebeam", "icebeam", "psychic"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "recover",
				fillerMoves1: ["thunderwave", "thunderwave", "thunderwave", "lightscreen", "lightscreen", "reflect"],
				fillerMoves2: ["thunderbolt", "icebeam", "psychic"],
			},
			{
				chance: 15,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "recover",
				fillerMoves1: ["thunderwave", "thunderwave", "rapidspin"],
				fillerMoves2: ["lightscreen", "lightscreen", "reflect", "rapidspin"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "recover", baseMove3: "thunderwave", baseMove4: "confuseray",
			},
		],
		tiers: ["OU"],
	},
	mrmime: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "psychic",
				fillerMoves1: ["thunderbolt", "thunderbolt", "hypnosis", "encore"],
				fillerMoves2: ["thunderwave", "thunderwave", "encore"],
				fillerMoves3: ["reflect", "lightscreen"],
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "psychic", baseMove2: "thunderbolt",
				fillerMoves1: ["icepunch", "firepunch", "thunderwave", "counter", "encore"],
				fillerMoves2: ["hypnosis", "hypnosis", "thunderwave", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "thunderbolt", baseMove3: "substitute",
				fillerMoves1: ["icepunch", "firepunch", "hypnosis", "thunderwave", "encore"],
			},
		],
		tiers: ["UU"],
	},
	scyther: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "wingattack",
				fillerMoves1: ["return", "return", "doubleedge"],
				fillerMoves2: ["hiddenpowerground", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerbug"],
			},
			{
				chance: 9,
				item: ["leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "steelwing",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerbug", "hiddenpowerbug"],
				fillerMoves2: ["return", "wingattack"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "substitute", baseMove3: "batonpass",
				fillerMoves1: ["wingattack", "hiddenpowerbug", "hiddenpowerground", "return"],
			},
			{
				chance: 14,
				item: ["leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "batonpass",
				fillerMoves1: ["wingattack", "return", "hiddenpowerbug", "hiddenpowerground"],
				fillerMoves2: ["agility", "hiddenpowerbug", "hiddenpowerground"],
			},
			{
				chance: 16,
				item: ["miracleberry"],
				baseMove1: "swordsdance", baseMove2: "endure", baseMove3: "reversal",
				fillerMoves1: ["wingattack", "hiddenpowerrock", "hiddenpowerrock"],
			},
		],
		tiers: ["UU"],
	},
	scizor: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "steelwing",
				fillerMoves1: ["return", "doubleedge"],
				fillerMoves2: ["hiddenpowerground", "hiddenpowerbug", "hiddenpowerrock"],
			},
			{
				chance: 9,
				item: ["leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "agility",
				fillerMoves1: ["steelwing", "steelwing", "steelwing", "return"],
				fillerMoves2: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
			},
			{
				chance: 13,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "batonpass",
				fillerMoves1: ["hiddenpowersteel", "hiddenpowersteel", "hiddenpowerbug", "hiddenpowerground", "return"],
			},
			{
				chance: 15,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "batonpass",
				fillerMoves1: ["steelwing", "steelwing", "steelwing", "return"],
				fillerMoves2: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "substitute", baseMove3: "batonpass",
				fillerMoves1: ["hiddenpowersteel", "hiddenpowersteel", "hiddenpowerbug", "hiddenpowerground", "return"],
			},
		],
		tiers: ["UUBL"],
	},
	smoochum: {
		tiers: ["LC"],
	},
	jynx: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "icebeam", baseMove2: "psychic", baseMove3: "lovelykiss", baseMove4: "substitute",
			},
			{
				chance: 10,
				item: ["leftovers", "miracleberry"],
				baseMove1: "icebeam", baseMove2: "psychic", baseMove3: "lovelykiss",
				fillerMoves1: ["counter", "counter", "reflect", "reflect", "toxic"],
			},
			{
				chance: 12,
				baseMove1: "icebeam", baseMove2: "psychic", baseMove3: "lovelykiss", baseMove4: "thief",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "meanlook", baseMove2: "perishsong", baseMove3: "protect",
				fillerMoves1: ["icebeam", "icebeam", "substitute"],
			},
		],
		tiers: ["OU"],
	},
	elekid: {
		tiers: ["LC"],
	},
	electabuzz: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "thunderbolt", baseMove2: "icepunch",
				fillerMoves1: ["psychic", "psychic", "firepunch"],
				fillerMoves2: ["crosschop", "crosschop", "thunderwave", "thunderwave", "counter"],
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "thunderbolt", baseMove2: "icepunch",
				fillerMoves1: ["psychic", "psychic", "firepunch", "lightscreen"],
				fillerMoves2: ["crosschop", "thunderwave"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "icepunch", baseMove3: "substitute",
				fillerMoves1: ["psychic", "crosschop", "thunderwave", "thunderwave"],
			},
		],
		tiers: ["UU"],
	},
	magby: {
		tiers: ["LC"],
	},
	magmar: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "crosschop",
				fillerMoves1: ["thunderpunch", "thunderpunch", "hiddenpowergrass"],
				fillerMoves2: ["hiddenpowerice", "hiddenpowergrass", "hiddenpowergrass", "confuseray", "confuseray"],
			},
			{
				chance: 16,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "sunnyday",
				fillerMoves1: ["thunderpunch", "thunderpunch", "hiddenpowergrass"],
				fillerMoves2: ["crosschop", "hiddenpowerice"],
			},
		],
		tiers: ["NU"],
	},
	pinsir: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "submission",
				fillerMoves1: ["bodyslam", "return"],
				fillerMoves2: ["hiddenpowerbug", "hiddenpowerrock"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "substitute",
				fillerMoves1: ["bodyslam", "return"],
				fillerMoves2: ["hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
			},
			{
				chance: 16,
				item: ["mintberry"],
				baseMove1: "swordsdance", baseMove2: "rest",
				fillerMoves1: ["bodyslam", "return"],
				fillerMoves2: ["hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
			},
		],
		tiers: ["UU"],
	},
	tauros: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "earthquake",
				fillerMoves1: ["bodyslam", "return", "doubleedge", "doubleedge"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "bodyslam", baseMove3: "earthquake", baseMove4: "doubleedge",
			},
			{
				chance: 15,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "earthquake",
				fillerMoves1: ["bodyslam", "return"],
				fillerMoves2: ["quickattack", "quickattack", "rest", "irontail"],
			},
			{
				chance: 16,
				item: ["berserkgene"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "hyperbeam",
				fillerMoves1: ["hiddenpowerbug", "irontail", "quickattack"],
			},
		],
		tiers: ["UUBL"],
	},
	magikarp: {
		tiers: ["LC"],
	},
	gyarados: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				fillerMoves1: ["doubleedge", "doubleedge", "return"],
				fillerMoves2: ["hydropump", "surf"],
				fillerMoves3: ["thunder", "zapcannon"],
				fillerMoves4: ["hiddenpowerbug", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerflying", "hiddenpowerflying"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				fillerMoves1: ["doubleedge", "bodyslam"],
				fillerMoves2: ["hydropump", "surf"],
				fillerMoves3: ["icebeam", "fireblast", "rest"],
				fillerMoves4: ["hiddenpowerflying", "hiddenpowerground", "hiddenpowerrock"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "hiddenpowerflying",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["bodyslam", "doubleedge"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "curse",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["return", "return", "bodyslam"],
				fillerMoves3: ["hiddenpowerbug", "hiddenpowerground", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerrock"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "hydropump", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["bodyslam", "doubleedge"],
			},
		],
		tiers: ["UU"],
	},
	lapras: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "icebeam",
				fillerMoves1: ["thunder", "thunderbolt"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "icebeam",
				fillerMoves1: ["thunderbolt", "thunderbolt", "thunder"],
				fillerMoves2: ["hydropump", "surf"],
				fillerMoves3: ["rest", "sing", "confuseray", "reflect"],
			},
		],
		tiers: ["UUBL"],
	},
	ditto: {
		randomSets: [
			{
				chance: 16,
				item: ["metalpowder"],
				baseMove1: "transform",
			},
		],
		tiers: ["NU"],
	},
	eevee: {
		tiers: ["LC"],
	},
	vaporeon: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["growth", "growth", "growth", "growth", "icebeam", "icebeam", "toxic"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "rest",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["icebeam", "icebeam", "icebeam", "icebeam", "acidarmor"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "icebeam",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["hiddenpowerelectric", "hiddenpowerelectric", "hiddenpowergrass", "acidarmor"],
			},
			{
				chance: 15,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "rest",
				fillerMoves1: ["toxic", "icebeam", "haze"],
				fillerMoves2: ["haze", "reflect"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "batonpass", baseMove3: "growth",
				fillerMoves1: ["acidarmor", "substitute"],
			},
		],
		tiers: ["OU"],
	},
	jolteon: {
		randomSets: [
			{
				chance: 3,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "substitute", baseMove3: "thunderbolt", baseMove4: "hiddenpowerice",
			},
			{
				chance: 10,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "growth", baseMove2: "thunderbolt", baseMove3: "hiddenpowerice",
				fillerMoves1: ["batonpass", "batonpass", "batonpass", "thunderwave", "thunderwave", "reflect"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "thunderbolt", baseMove3: "substitute", baseMove4: "batonpass",
			},
			{
				chance: 16,
				item: ["leftovers", "miracleberry"],
				baseMove1: "growth", baseMove2: "thunderbolt", baseMove3: "agility", baseMove4: "batonpass",
			},
		],
		tiers: ["UUBL"],
	},
	flareon: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "fireblast",
				fillerMoves1: ["bodyslam", "bodyslam", "return"],
				fillerMoves2: ["shadowball", "shadowball", "irontail"],
				fillerMoves3: ["hiddenpowerground", "hiddenpowerrock", "irontail", "sunnyday"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "zapcannon",
				fillerMoves1: ["return", "return", "doubleedge"],
				fillerMoves2: ["shadowball", "shadowball", "shadowball", "irontail", "irontail"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "growth", baseMove3: "batonpass",
				fillerMoves1: ["return", "zapcannon"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "growth", baseMove3: "return",
				fillerMoves1: ["hiddenpowergrass", "zapcannon"],
			},
		],
		tiers: ["NU"],
	},
	espeon: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "growth", baseMove2: "psychic",
				fillerMoves1: ["bite", "hiddenpowerdark"],
				fillerMoves2: ["morningsun", "morningsun", "morningsun", "hiddenpowerwater", "hiddenpowerwater", "zapcannon"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "psychic", baseMove3: "substitute",
				fillerMoves1: ["bite", "hiddenpowerdark"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "psychic", baseMove3: "reflect", baseMove4: "morningsun",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "psychic", baseMove3: "substitute", baseMove4: "batonpass",
			},
		],
		tiers: ["UUBL"],
	},
	umbreon: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers"],
				baseMove1: "toxic", baseMove2: "confuseray",
				fillerMoves1: ["rest", "moonlight"],
				fillerMoves2: ["meanlook", "hiddenpowerdark"],
			},
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "meanlook", baseMove2: "batonpass",
				fillerMoves1: ["rest", "rest", "moonlight"],
				fillerMoves2: ["curse", "curse", "charm", "sandattack"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "toxic", baseMove2: "reflect",
				fillerMoves1: ["hiddenpowerdark", "hiddenpowerdark", "pursuit"],
				fillerMoves2: ["rest", "moonlight"],
			},
			{
				chance: 15,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "batonpass", baseMove3: "bodyslam", baseMove4: "moonlight",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "batonpass", baseMove3: "hiddenpowerdark", baseMove4: "moonlight",
			},
		],
		tiers: ["OU"],
	},
	porygon: {
		tiers: ["LC"],
	},
	porygon2: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "recover", baseMove3: "icebeam",
				fillerMoves1: ["return", "return", "doubleedge"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "recover", baseMove2: "icebeam",
				fillerMoves1: ["return", "return", "doubleedge"],
				fillerMoves2: ["thunderbolt", "thunderbolt", "thunder", "thunderwave", "thunderwave"],
			},
		],
		tiers: ["UUBL"],
	},
	omanyte: {
		tiers: ["LC"],
	},
	omastar: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "rest",
				fillerMoves1: ["icebeam", "icebeam", "reflect", "haze", "toxic"],
				fillerMoves2: ["icebeam", "reflect", "haze", "toxic"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "icebeam",
				fillerMoves1: ["surf", "surf", "hydropump"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "icebeam",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["hiddenpowerelectric", "hiddenpowerelectric", "hiddenpowergrass"],
				fillerMoves3: ["reflect", "toxic", "rest", "hydropump"],
			},
		],
		tiers: ["UU"],
	},
	kabuto: {
		tiers: ["LC"],
	},
	kabutops: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "swordsdance", baseMove2: "ancientpower", baseMove3: "surf",
				fillerMoves1: ["hiddenpowerground", "hiddenpowerflying", "hiddenpowerbug", "doubleedge"],
			},
		],
		tiers: ["UU"],
	},
	aerodactyl: {
		randomSets: [
			{
				chance: 4,
				item: ["leftovers", "miracleberry"],
				baseMove1: "hiddenpowerflying", baseMove2: "ancientpower", baseMove3: "earthquake", baseMove4: "fireblast",
			},
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "hiddenpowerflying", baseMove2: "ancientpower", baseMove3: "earthquake", baseMove4: "substitute",
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "reflect", baseMove2: "whirlwind",
				fillerMoves1: ["rest", "rest", "toxic"],
				fillerMoves2: ["hiddenpowerrock", "hiddenpowerrock", "hiddenpowerflying", "wingattack"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "earthquake", baseMove3: "ancientpower",
				fillerMoves1: ["hiddenpowerflying", "whirlwind"],
			},
		],
		tiers: ["UUBL"],
	},
	snorlax: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers", "leftovers", "mintberry"],
				baseMove1: "curse", baseMove2: "rest", baseMove3: "earthquake",
				fillerMoves1: ["bodyslam", "bodyslam", "return", "doubleedge"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["bodyslam", "doubleedge"],
				fillerMoves2: ["curse", "curse", "earthquake"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "earthquake",
				fillerMoves1: ["bodyslam", "doubleedge", "return"],
				fillerMoves2: ["lovelykiss", "lovelykiss", "rockslide", "rockslide", "fireblast", "surf", "counter"],
				fillerMoves3: ["selfdestruct", "selfdestruct", "rest"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "return", baseMove3: "earthquake", baseMove4: "lovelykiss",
			},
		],
		tiers: ["OU"],
	},
	articuno: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "icebeam", baseMove2: "rest",
				fillerMoves1: ["toxic", "reflect", "whirlwind"],
				fillerMoves2: ["toxic", "reflect", "whirlwind"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "icebeam", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["toxic", "toxic", "toxic", "hiddenpowerelectric", "hiddenpowerflying", "return"],
			},
		],
		tiers: ["UUBL"],
	},
	zapdos: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["thunderbolt", "thunderbolt", "thunder"],
				fillerMoves2: ["hiddenpowerice", "hiddenpowerice", "drillpeck"],
			},
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "rest",
				fillerMoves1: ["thunderwave", "thunderwave", "toxic", "toxic", "whirlwind"],
				fillerMoves2: ["lightscreen", "lightscreen", "reflect", "reflect", "whirlwind"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice",
				fillerMoves1: ["thunderwave", "thunderwave", "toxic", "rest"],
				fillerMoves2: ["reflect", "lightscreen", "lightscreen", "whirlwind", "rest"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "drillpeck",
				fillerMoves1: ["thunderwave", "thunderwave", "toxic", "toxic", "rest"],
				fillerMoves2: ["reflect", "lightscreen", "whirlwind", "rest"],
			},
			{
				chance: 16,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "thunderbolt", baseMove2: "drillpeck",
				fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerwater", "hiddenpowerwater", "hiddenpowerwater"],
				fillerMoves2: ["thunderwave", "thunderwave", "thunderwave", "toxic", "lightscreen", "reflect"],
			},
		],
		tiers: ["OU"],
	},
	moltres: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers", "leftovers", "leftovers", "charcoal", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "hiddenpowergrass",
				fillerMoves1: ["reflect", "reflect", "flamethrower"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "hiddenpowergrass", baseMove4: "substitute",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["hiddenpowergrass", "hiddenpowergrass", "return"],
			},
		],
		tiers: ["UUBL"],
	},
	dratini: {
		tiers: ["LC"],
	},
	dragonair: {
		tiers: ["NFE"],
	},
	dragonite: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "icebeam",
				fillerMoves1: ["bodyslam", "return", "doubleedge", "extremespeed"],
				fillerMoves2: ["thunderbolt", "thunderbolt", "thunder"],
				fillerMoves3: ["thunderwave", "wingattack", "fireblast", "dynamicpunch"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "thunderwave",
				fillerMoves1: ["reflect", "lightscreen"],
				fillerMoves2: ["icebeam", "icebeam", "rest"],
				fillerMoves3: ["return", "return", "icebeam"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "bodyslam", baseMove2: "haze",
				fillerMoves1: ["reflect", "lightscreen"],
				fillerMoves2: ["rest", "rest", "icebeam"],
			},
		],
		tiers: ["UUBL"],
	},
	mewtwo: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "icebeam", baseMove3: "thunderbolt",
				fillerMoves1: ["recover", "recover", "recover", "recover", "selfdestruct"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "psychic",
				fillerMoves1: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunderbolt", "fireblast"],
				fillerMoves2: ["fireblast", "fireblast", "fireblast", "shadowball", "shadowball", "counter"],
				fillerMoves3: ["recover", "recover", "recover", "recover", "selfdestruct"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "recover",
				fillerMoves1: ["thunderwave", "thunderwave", "reflect"],
				fillerMoves2: ["reflect", "reflect", "icebeam", "thunderbolt", "fireblast"],
			},
		],
		tiers: ["Uber"],
	},
	mew: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "earthquake",
				fillerMoves1: ["rockslide", "rockslide", "rockslide", "rockslide", "shadowball", "bodyslam", "sludgebomb"],
				fillerMoves2: ["explosion", "explosion", "explosion", "softboiled", "softboiled"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "psychic",
				fillerMoves1: ["earthquake", "earthquake", "earthquake", "thunderbolt", "fireblast", "shadowball"],
				fillerMoves2: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunderbolt", "fireblast"],
				fillerMoves3: ["softboiled", "explosion"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "softboiled",
				fillerMoves1: ["thunderwave", "thunderwave", "thunderwave", "reflect"],
				fillerMoves2: ["reflect", "reflect", "reflect", "reflect", "earthquake", "icebeam", "thunderbolt", "fireblast"],
			},
		],
		tiers: ["Uber"],
	},
	chikorita: {
		tiers: ["LC"],
	},
	bayleef: {
		tiers: ["NFE"],
	},
	meganium: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "swordsdance", baseMove2: "earthquake",
				fillerMoves1: ["gigadrain", "gigadrain", "gigadrain", "bodyslam"],
				fillerMoves2: ["synthesis", "synthesis", "synthesis", "bodyslam", "ancientpower"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "synthesis", baseMove2: "leechseed",
				fillerMoves1: ["reflect", "lightscreen", "lightscreen"],
				fillerMoves2: ["razorleaf", "razorleaf", "razorleaf", "hiddenpowerice", "bodyslam"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				fillerMoves1: ["gigadrain", "gigadrain", "razorleaf"],
				fillerMoves2: ["earthquake", "bodyslam", "bodyslam"],
				fillerMoves3: ["leechseed", "reflect", "lightscreen", "lightscreen"],
				fillerMoves4: ["synthesis", "synthesis", "synthesis", "leechseed", "leechseed"],
			},
		],
		tiers: ["UUBL"],
	},
	cyndaquil: {
		tiers: ["LC"],
	},
	quilava: {
		tiers: ["NFE"],
	},
	typhlosion: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "thunderpunch",
				fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerice"],
			},
			{
				chance: 14,
				item: ["leftovers", "leftovers", "charcoal", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "thunderpunch", baseMove4: "earthquake",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["earthquake", "thunderpunch"],
			},
		],
		tiers: ["UUBL"],
	},
	totodile: {
		tiers: ["LC"],
	},
	croconaw: {
		tiers: ["NFE"],
	},
	feraligatr: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "earthquake",
				fillerMoves1: ["surf", "surf", "hydropump"],
				fillerMoves2: ["rockslide", "rockslide", "ancientpower"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "icebeam",
				fillerMoves1: ["hydropump", "surf"],
				fillerMoves2: ["rockslide", "crunch", "hiddenpowerbug"],
			},
			{
				chance: 14,
				item: ["leftovers", "mintberry"],
				baseMove1: "earthquake", baseMove2: "icebeam", baseMove3: "rest",
				fillerMoves1: ["hydropump", "surf"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["hydropump", "surf", "surf"],
				fillerMoves2: ["earthquake", "icebeam"],
			},
		],
		tiers: ["NUBL"],
	},
	sentret: {
		tiers: ["LC"],
	},
	furret: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers", "mintberry"],
				baseMove1: "curse", baseMove2: "rest",
				fillerMoves1: ["return", "return", "doubleedge"],
				fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
			},
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "curse",
				fillerMoves1: ["return", "return", "doubleedge"],
				fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
				fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "quickattack", "surf"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "amnesia", baseMove3: "return", baseMove4: "rest",
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["return", "doubleedge"],
			},
			{
				chance: 16,
				baseMove1: "thief",
				fillerMoves1: ["return", "doubleedge"],
				fillerMoves2: ["hiddenpowerground", "shadowball", "irontail", "surf", "dynamicpunch"],
				fillerMoves3: ["hiddenpowerground", "shadowball", "irontail"],
			},
		],
		tiers: ["NU"],
	},
	hoothoot: {
		tiers: ["LC"],
	},
	noctowl: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "reflect",
				fillerMoves1: ["hiddenpowerflying", "hiddenpowerflying", "return", "nightshade", "nightshade"],
				fillerMoves2: ["rest", "hypnosis", "toxic"],
				fillerMoves3: ["whirlwind", "whirlwind", "whirlwind", "nightshade", "toxic", "rest"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "hypnosis",
				fillerMoves1: ["hiddenpowerflying", "return"],
				fillerMoves2: ["steelwing", "nightshade"],
			},
			{
				chance: 16,
				baseMove1: "thief", baseMove2: "hypnosis", baseMove3: "nightshade",
				fillerMoves1: ["hiddenpowerflying", "return"],
			},
		],
		tiers: ["NU"],
	},
	ledyba: {
		tiers: ["LC"],
	},
	ledian: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "agility", baseMove2: "toxic", baseMove3: "batonpass",
				fillerMoves1: ["reflect", "lightscreen", "barrier"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "hiddenpowerbug", baseMove3: "batonpass",
				fillerMoves1: ["agility", "lightscreen"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				fillerMoves1: ["reflect", "lightscreen", "safeguard"],
				fillerMoves2: ["reflect", "lightscreen", "safeguard"],
				fillerMoves3: ["toxic", "hiddenpowerbug", "rest"],
				fillerMoves4: ["toxic", "rest"],
			},
			{
				chance: 16,
				baseMove1: "thief",
				fillerMoves1: ["reflect", "lightscreen", "safeguard"],
				fillerMoves2: ["reflect", "lightscreen", "safeguard"],
				fillerMoves3: ["toxic", "hiddenpowerbug"],
			},
		],
		tiers: ["NU"],
	},
	spinarak: {
		tiers: ["LC"],
	},
	ariados: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "sludgebomb",
				fillerMoves1: ["return", "return", "gigadrain"],
				fillerMoves2: ["hiddenpowerground", "hiddenpowerbug"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "sludgebomb", baseMove2: "batonpass",
				fillerMoves1: ["curse", "agility"],
				fillerMoves2: ["return", "hiddenpowerground", "hiddenpowerbug", "nightshade", "nightshade"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "spiderweb", baseMove3: "sludgebomb", baseMove4: "batonpass",
			},
		],
		tiers: ["NU"],
	},
	chinchou: {
		tiers: ["LC"],
	},
	lanturn: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "thunderwave", baseMove2: "thunderbolt",
				fillerMoves1: ["surf", "icebeam"],
				fillerMoves2: ["surf", "surf", "icebeam", "icebeam", "confuseray", "lightscreen"],
			},
			{
				chance: 15,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk",
				fillerMoves1: ["thunderbolt", "thunder"],
				fillerMoves2: ["surf", "icebeam"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "raindance", baseMove2: "surf", baseMove3: "thunder", baseMove4: "icebeam",
			},
		],
		tiers: ["UU"],
	},
	togepi: {
		tiers: ["LC"],
	},
	togetic: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "toxic",
				fillerMoves1: ["doubleedge", "return", "psychic"],
				fillerMoves2: ["safeguard", "encore"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "fireblast",
				fillerMoves1: ["return", "doubleedge"],
				fillerMoves2: ["steelwing", "hiddenpowersteel"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "fireblast",
				fillerMoves1: ["return", "doubleedge", "doubleedge"],
			},
		],
		tiers: ["NU"],
	},
	natu: {
		tiers: ["LC"],
	},
	xatu: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers", "leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "psychic", baseMove2: "drillpeck",
				fillerMoves1: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerfire"],
				fillerMoves2: ["nightshade", "nightshade", "gigadrain", "confuseray"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "psychic", baseMove2: "drillpeck", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["NU"],
	},
	mareep: {
		tiers: ["LC"],
	},
	flaaffy: {
		tiers: ["NFE"],
	},
	ampharos: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice",
				fillerMoves1: ["firepunch", "firepunch", "firepunch", "dynamicpunch"],
				fillerMoves2: ["thunderwave", "thunderwave", "thunderwave", "thunderwave", "dynamicpunch"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "thunderwave",
				fillerMoves1: ["reflect", "lightscreen"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "hiddenpowerice",
				fillerMoves1: ["thunderbolt", "thunderbolt", "thunder"],
			},
		],
		tiers: ["UU"],
	},
	marill: {
		tiers: ["LC"],
	},
	azumarill: {
		randomSets: [
			{
				chance: 5,
				item: ["mintberry"],
				baseMove1: "bellydrum", baseMove2: "surf", baseMove3: "rest",
				fillerMoves1: ["doubleedge", "return"],
			},
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "surf", baseMove3: "hiddenpowerground",
				fillerMoves1: ["doubleedge", "return"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["icebeam", "icebeam", "icebeam", "toxic", "toxic"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "toxic", baseMove3: "lightscreen", baseMove4: "rest",
			},
		],
		tiers: ["NU"],
	},
	sudowoodo: {
		randomSets: [
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "selfdestruct",
				fillerMoves1: ["curse", "hiddenpowerbug"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["NU"],
	},
	hoppip: {
		tiers: ["LC"],
	},
	skiploom: {
		tiers: ["NFE"],
	},
	jumpluff: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "sleeppowder", baseMove2: "stunspore", baseMove3: "leechseed",
				fillerMoves1: ["encore", "gigadrain", "hiddenpowerflying", "hiddenpowerflying"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "sleeppowder", baseMove2: "toxic",
				fillerMoves1: ["leechseed", "leechseed", "synthesis", "reflect"],
				fillerMoves2: ["reflect", "reflect", "synthesis", "encore", "gigadrain"],
			},
		],
		tiers: ["UU"],
	},
	aipom: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "batonpass", baseMove2: "return",
				fillerMoves1: ["curse", "curse", "agility", "counter"],
				fillerMoves2: ["curse", "curse", "agility", "counter"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "return",
				fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
				fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "counter"],
			},
			{
				chance: 14,
				baseMove1: "thief", baseMove2: "return",
				fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
				fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "counter", "thunderbolt", "thunder"],
			},
			{
				chance: 16,
				item: ["leftovers", "miracleberry"],
				baseMove1: "return", baseMove2: "counter",
				fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
				fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "thunderbolt", "thunder"],
			},
		],
		tiers: ["NU"],
	},
	sunkern: {
		tiers: ["LC"],
	},
	sunflora: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "growth", baseMove2: "gigadrain", baseMove3: "synthesis",
				fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerfire", "hiddenpowerwater"],
			},
		],
		tiers: ["NU"],
	},
	yanma: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "gigadrain",
				fillerMoves1: ["hiddenpowerbug", "hiddenpowerrock"],
				fillerMoves2: ["return", "wingattack"],
			},
			{
				chance: 12,
				baseMove1: "thief", baseMove2: "toxic",
				fillerMoves1: ["gigadrain", "hiddenpowerice"],
				fillerMoves2: ["return", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock"],
			},
			{
				chance: 16,
				baseMove1: "toxic",
				fillerMoves1: ["gigadrain", "hiddenpowerice"],
				fillerMoves2: ["return", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock"],
				fillerMoves3: ["whirlwind", "whirlwind", "sweetkiss"],
			},
		],
		tiers: ["NU"],
	},
	wooper: {
		tiers: ["LC"],
	},
	quagsire: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "earthquake",
				fillerMoves1: ["rest", "rest", "surf", "surf", "ancientpower", "ancientpower", "hiddenpowerrock"],
				fillerMoves2: ["sludgebomb", "bodyslam"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "earthquake", baseMove3: "sludgebomb",
				fillerMoves1: ["ancientpower", "hiddenpowerrock"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "rest",
				fillerMoves1: ["surf", "surf", "surf", "bodyslam", "sludgebomb", "icebeam"],
				fillerMoves2: ["haze", "sleeptalk"],
			},
		],
		tiers: ["UU"],
	},
	murkrow: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "drillpeck", baseMove2: "faintattack",
				fillerMoves1: ["hiddenpowerice", "hiddenpowerground"],
				fillerMoves2: ["pursuit", "pursuit", "nightshade"],
			},
			{
				chance: 16,
				item: ["", "", "miracleberry"],
				baseMove1: "drillpeck", baseMove2: "hiddenpowerdark", baseMove3: "thief",
				fillerMoves2: ["pursuit", "nightshade"],
			},
		],
		tiers: ["NU"],
	},
	misdreavus: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "meanlook", baseMove2: "perishsong", baseMove3: "protect",
				fillerMoves1: ["thunderbolt", "confuseray", "confuseray", "confuseray", "destinybond"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				fillerMoves1: ["thunderbolt", "thunder"],
				fillerMoves2: ["shadowball", "shadowball", "psychic", "hiddenpowerice"],
				fillerMoves3: ["hypnosis", "hypnosis", "toxic"],
				fillerMoves4: ["destinybond", "rest", "painsplit", "painsplit"],
			},
		],
		tiers: ["OU"],
	},
	unown: {
		randomSets: [
			{
				chance: 10,
				item: ["twistedspoon"],
				baseMove1: "hiddenpowerpsychic",
			},
			{
				chance: 12,
				item: ["nevermeltice"],
				baseMove1: "hiddenpowerice",
			},
			{
				chance: 14,
				item: ["hardstone"],
				baseMove1: "hiddenpowerrock",
			},
			{
				chance: 16,
				item: ["blackglasses"],
				baseMove1: "hiddenpowerdark",
			},
		],
		tiers: ["NU"],
	},
	wobbuffet: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "counter", baseMove2: "mirrorcoat",
				fillerMoves1: ["mimic", "mimic", "safeguard", "safeguard", "destinybond"],
				fillerMoves2: ["mimic", "mimic", "safeguard", "safeguard", "destinybond"],
			},
		],
		tiers: ["NU"],
	},
	girafarig: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "psychic", baseMove4: "thunderbolt",
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "batonpass", baseMove2: "agility", baseMove3: "psychic",
				fillerMoves1: ["return", "crunch", "return", "earthquake", "thunderbolt"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "batonpass", baseMove2: "curse", baseMove3: "return",
				fillerMoves1: ["psychic", "earthquake", "amnesia"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return", baseMove4: "psychic",
			},
		],
		tiers: ["UU"],
	},
	pineco: {
		tiers: ["LC"],
	},
	forretress: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "spikes", baseMove2: "explosion",
				fillerMoves1: ["rapidspin", "rapidspin", "rapidspin", "reflect", "toxic"],
				fillerMoves2: ["hiddenpowerbug", "hiddenpowersteel", "toxic"],
			},
		],
		tiers: ["OU"],
	},
	dunsparce: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "return",
				fillerMoves1: ["rockslide", "irontail", "irontail"],
				fillerMoves2: ["glare", "rest"],
			},
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "return",
				fillerMoves1: ["thunderbolt", "thunder"],
				fillerMoves2: ["flamethrower", "flamethrower", "rockslide", "rest"],
				fillerMoves3: ["irontail", "hiddenpowerice", "rest", "rest"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "glare",
				fillerMoves1: ["thunderbolt", "thunder"],
				fillerMoves2: ["flamethrower", "rockslide", "irontail"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return",
				fillerMoves1: ["thunderbolt", "thunder", "curse", "curse", "flamethrower", "irontail"],
			},
		],
		tiers: ["NU"],
	},
	gligar: {
		randomSets: [
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "wingattack", baseMove3: "hiddenpowerrock",
				fillerMoves1: ["curse", "curse", "curse", "counter", "counter", "screech"],
			},
			{
				chance: 16,
				baseMove1: "earthquake", baseMove2: "wingattack", baseMove3: "hiddenpowerrock", baseMove4: "thief",
			},
		],
		tiers: ["UU"],
	},
	snubbull: {
		tiers: ["LC"],
	},
	granbull: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "return",
				fillerMoves1: ["healbell", "healbell", "healbell", "healbell", "rest", "roar"],
				fillerMoves2: ["shadowball", "hiddenpowerground"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "healbell", baseMove3: "reflect",
				fillerMoves1: ["rest", "rest", "roar"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "healbell", baseMove3: "shadowball",
				fillerMoves1: ["roar", "zapcannon", "dynamicpunch", "icepunch", "firepunch", "hiddenpowerground", "hiddenpowerground"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return",
				fillerMoves1: ["shadowball", "hiddenpowerground"],
			},
		],
		tiers: ["UU"],
	},
	qwilfish: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "spikes", baseMove2: "sludgebomb",
				fillerMoves1: ["surf", "hydropump"],
				fillerMoves2: ["curse", "curse", "curse", "haze"],
			},
		],
		tiers: ["UU"],
	},
	shuckle: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "toxic", baseMove2: "wrap", baseMove3: "rest",
				fillerMoves1: ["encore", "protect", "swagger"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "earthquake", baseMove3: "hiddenpowerrock", baseMove4: "rest",
			},
		],
		tiers: ["NU"],
	},
	heracross: {
		randomSets: [
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "megahorn", baseMove3: "earthquake",
				fillerMoves1: ["hiddenpowerrock", "hiddenpowerrock", "hiddenpowerrock", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "megahorn",
				fillerMoves1: ["earthquake", "earthquake", "curse"],
			},
		],
		tiers: ["OU"],
	},
	sneasel: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
				baseMove1: "icebeam", baseMove2: "return", baseMove3: "shadowball",
				fillerMoves1: ["irontail", "irontail", "dynamicpunch", "dynamicpunch", "counter", "curse"],
			},
		],
		tiers: ["NU"],
	},
	teddiursa: {
		tiers: ["LC"],
	},
	ursaring: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers", "leftovers", "mintberry"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "curse", baseMove4: "rest",
			},
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "curse",
				fillerMoves1: ["roar", "roar", "roar", "zapcannon", "firepunch", "counter"],
			},
			{
				chance: 11,
				item: ["leftovers", "leftovers", "leftovers", "mintberry"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "rest",
				fillerMoves1: ["roar", "zapcannon", "firepunch", "counter"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return",
				fillerMoves2: ["curse", "earthquake"],
			},
		],
		tiers: ["UUBL"],
	},
	slugma: {
		tiers: ["LC"],
	},
	magcargo: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "fireblast", baseMove3: "earthquake", baseMove4: "rockslide",
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "rockslide", baseMove3: "toxic",
				fillerMoves1: ["sunnyday", "hiddenpowergrass"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["earthquake", "rockslide", "rockslide"],
			},
		],
		tiers: ["NU"],
	},
	swinub: {
		tiers: ["LC"],
	},
	piloswine: {
		randomSets: [
			{
				chance: 6,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "icebeam", baseMove3: "earthquake",
				fillerMoves1: ["bodyslam", "bodyslam", "rockslide", "rockslide", "rockslide", "ancientpower"],
			},
			{
				chance: 10,
				item: ["leftovers", "leftovers", "leftovers", "mintberry"],
				baseMove1: "curse", baseMove2: "icebeam", baseMove3: "earthquake", baseMove4: "rest",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "icebeam", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["UU"],
	},
	corsola: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "surf", baseMove3: "rockslide", baseMove4: "recover",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "recover", baseMove3: "toxic",
				fillerMoves1: ["mirrorcoat", "icebeam"],
			},
		],
		tiers: ["NU"],
	},
	remoraid: {
		tiers: ["LC"],
	},
	octillery: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "flamethrower", baseMove3: "icebeam",
				fillerMoves1: ["return", "return", "hiddenpowergrass", "hiddenpowerelectric", "rest"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "return", baseMove3: "surf", baseMove4: "icebeam",
			},
		],
		tiers: ["NU"],
	},
	delibird: {
		randomSets: [
			{
				chance: 12,
				item: ["", "", "miracleberry"],
				baseMove1: "icebeam", baseMove2: "spikes", baseMove3: "thief", baseMove4: "toxic",
			},
			{
				chance: 16,
				item: ["", "", "miracleberry"],
				baseMove1: "icebeam", baseMove2: "spikes", baseMove3: "toxic",
				fillerMoves1: ["hiddenpowerelectric", "hiddenpowergrass", "hiddenpowerflying", "present", "sleeptalk"],
			},
		],
		tiers: ["NU"],
	},
	mantine: {
		randomSets: [
			{
				chance: 9,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "haze", baseMove3: "toxic",
				fillerMoves1: ["icebeam", "icebeam", "icebeam", "rest", "rest", "confuseray"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "icebeam",
				fillerMoves1: ["hydropump", "hydropump", "surf"],
				fillerMoves2: ["hiddenpowerelectric", "hiddenpowergrass"],
				fillerMoves3: ["confuseray", "haze", "rest", "toxic"],
			},
		],
		tiers: ["NU"],
	},
	skarmory: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "drillpeck", baseMove2: "whirlwind", baseMove3: "rest",
				fillerMoves1: ["toxic", "toxic", "curse"],
			},
			{
				chance: 16,
				item: ["", "", "mintberry"],
				baseMove1: "drillpeck", baseMove2: "whirlwind", baseMove3: "rest", baseMove4: "thief",
			},
		],
		tiers: ["OU"],
	},
	houndour: {
		tiers: ["LC"],
	},
	houndoom: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "sunnyday", baseMove2: "fireblast", baseMove3: "solarbeam",
				fillerMoves1: ["crunch", "crunch", "crunch", "pursuit", "counter"],
			},
			{
				chance: 13,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "crunch", baseMove3: "pursuit",
				fillerMoves1: ["counter", "hiddenpowergrass"],
			},
			{
				chance: 16,
				item: ["", "", "miracleberry"],
				baseMove1: "fireblast", baseMove2: "crunch", baseMove3: "thief",
				fillerMoves1: ["counter", "pursuit", "pursuit", "hiddenpowergrass"],
			},
		],
		tiers: ["UUBL"],
	},
	phanpy: {
		tiers: ["LC"],
	},
	donphan: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "earthquake", baseMove3: "ancientpower",
				fillerMoves1: ["bodyslam", "hiddenpowerbug", "roar", "rest"],
			},
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "roar", baseMove3: "rest",
				fillerMoves1: ["rapidspin", "bodyslam"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "earthquake", baseMove2: "ancientpower",
				fillerMoves1: ["bodyslam", "bodyslam", "hiddenpowerbug"],
				fillerMoves2: ["rapidspin", "roar", "roar", "hiddenpowerbug"],
			},
		],
		tiers: ["UUBL"],
	},
	stantler: {
		randomSets: [
			{
				chance: 5,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "hypnosis",
				fillerMoves1: ["confuseray", "rest", "reflect", "lightscreen"],
			},
			{
				chance: 10,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "curse",
				fillerMoves1: ["hypnosis", "hypnosis", "rest", "lightscreen"],
			},
			{
				chance: 13,
				item: ["leftovers", "leftovers", "leftovers", "mintberry"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "rest",
				fillerMoves1: ["reflect", "lightscreen"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "return", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
			},
		],
		tiers: ["NU"],
	},
	smeargle: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers", "leftovers", "miracleberry"],
				baseMove1: "spikes", baseMove2: "healbell",
				fillerMoves1: ["counter", "mirrorcoat", "destinybond"],
				fillerMoves2: ["superfang", "superfang", "destinybond", "destinybond", "spore", "spore", "rapidspin", "encore", "recover"],
			},
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "bellydrum", baseMove2: "spore", baseMove3: "batonpass",
				fillerMoves1: ["agility", "agility", "agility", "substitute", "substitute", "return", "extremespeed"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "spiderweb", baseMove2: "batonpass",
				fillerMoves1: ["counter", "mirrorcoat", "destinybond", "recover", "encore", "disable"],
				fillerMoves2: ["destinybond", "spikes", "substitute", "recover", "encore", "disable", "healbell"],
			},
		],
		tiers: ["UUBL"],
	},
	miltank: {
		randomSets: [
			{
				chance: 12,
				item: ["leftovers"],
				baseMove1: "bodyslam", baseMove2: "healbell", baseMove3: "milkdrink",
				fillerMoves1: ["earthquake", "earthquake", "curse", "toxic"],
			},
		],
		tiers: ["OU"],
	},
	raikou: {
		randomSets: [
			{
				chance: 8,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["crunch", "hiddenpowerice", "hiddenpowerice"],
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "reflect", baseMove3: "rest",
				fillerMoves1: ["crunch", "hiddenpowerice", "hiddenpowerice"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "thunderbolt", baseMove2: "crunch", baseMove3: "hiddenpowerice",
				fillerMoves1: ["rest", "roar", "reflect", "toxic"],
			},
		],
		tiers: ["OU"],
	},
	entei: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "return", baseMove3: "rest", baseMove4: "sleeptalk",
			},
			{
				chance: 13,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "return", baseMove3: "irontail", baseMove4: "curse",
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "fireblast", baseMove2: "return", baseMove3: "sunnyday", baseMove4: "solarbeam",
			},
		],
		tiers: ["UUBL"],
	},
	suicune: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "rest", baseMove3: "sleeptalk",
				fillerMoves1: ["icebeam", "toxic"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "surf", baseMove2: "rest",
				fillerMoves1: ["icebeam", "toxic", "toxic"],
				fillerMoves2: ["roar", "roar", "mirrorcoat"],
			},
		],
		tiers: ["OU"],
	},
	larvitar: {
		tiers: ["LC"],
	},
	pupitar: {
		tiers: ["NFE"],
	},
	tyranitar: {
		randomSets: [
			{
				chance: 7,
				item: ["leftovers"],
				baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "thunderbolt",
				fillerMoves1: ["fireblast", "icebeam", "crunch", "dynamicpunch"],
			},
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "curse",
				fillerMoves1: ["roar", "roar", "roar", "crunch", "icebeam", "fireblast"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "rockslide", baseMove2: "earthquake",
				fillerMoves1: ["pursuit", "pursuit", "roar"],
				fillerMoves2: ["thunderbolt", "fireblast", "icebeam", "crunch"],
			},
		],
		tiers: ["OU"],
	},
	lugia: {
		randomSets: [
			{
				chance: 11,
				item: ["leftovers"],
				baseMove1: "curse", baseMove2: "aeroblast",
				fillerMoves1: ["earthquake", "earthquake", "earthquake", "whirlwind"],
				fillerMoves2: ["recover", "recover", "rest"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "aeroblast",
				fillerMoves1: ["psychic", "icebeam", "hydropump", "earthquake", "earthquake"],
				fillerMoves2: ["thunderbolt", "thunder", "whirlwind", "whirlwind", "whirlwind"],
				fillerMoves3: ["recover", "recover", "rest"],
			},
		],
		tiers: ["Uber"],
	},
	hooh: {
		randomSets: [
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "recover", baseMove2: "earthquake",
				fillerMoves1: ["sacredfire", "sacredfire", "fireblast"],
				fillerMoves2: ["thunderbolt", "thunder"],
			},
		],
		tiers: ["Uber"],
	},
	celebi: {
		randomSets: [
			{
				chance: 14,
				item: ["leftovers"],
				baseMove1: "healbell", baseMove2: "recover", baseMove3: "psychic",
				fillerMoves1: ["leechseed", "leechseed", "leechseed", "leechseed", "gigadrain", "perishsong"],
			},
			{
				chance: 16,
				item: ["leftovers"],
				baseMove1: "healbell", baseMove2: "recover", baseMove3: "curse", baseMove4: "batonpass",
			},
		],
		tiers: ["Uber"],
	},
};
