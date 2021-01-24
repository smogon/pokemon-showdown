export const Scripts: ModdedBattleScriptsData = {
	init() {
		const newMoves = (mon: string, moves: string[]) => {
			for (const move of moves) {
				this.modData('Learnsets', this.toID(mon)).learnset[this.toID(move)] = ["8M"];
			}
		};
		newMoves("dragonite", ["playrough"]);
		newMoves("goodra", ["gigadrain", "drainpunch"]);
		newMoves("dragapult", ["icebeam"]);
		newMoves("orbeetle", ["focusblast", "teleport"]);
		newMoves("thievul", ["focusblast", "aurasphere", "hiddenpower"]);
		newMoves("gumshoos", ["coil", "bodyslam"]);
		newMoves("vikavolt", ["leafblade", "darkpulse", "uturn", "thundercage"]);
		newMoves("lycanrocmidnight", ["headsmash"]);
		newMoves("lycanroc", ["extremespeed", "spikes"]);
		newMoves("raichu", ["highjumpkick"]);
		newMoves("clefable", ["hex", "nastyplot", "shadowsneak", "willowisp"]);
		newMoves("rillaboom", ["toxic"]);
		newMoves("cinderace", ["energyball"]);
		newMoves("inteleon", ["taunt", "firstimpression", "encore", "pursuit"]);
		newMoves("klinklang", ["overheat", "rapidspin"]);
		newMoves("garbodor", ["stealthrock", "knockoff"]);
		newMoves("jolteon", ["calmmind"]);
		newMoves("flareon", ["burnup", "morningsun"]);
		newMoves("butterfree", ["taunt", "earthpower"]);
		newMoves("chandelure", ["mindblown"]);
		newMoves("gothitelle", ["wish", "teleport", "doomdesire", "flashcannon"]);
		newMoves("conkeldurr", ["shoreup"]);
		newMoves("gigalith", ["skullbash", "sunnyday", "synthesis"]);
		newMoves("reuniclus", ["photongeyser", "psychoboost"]);
		newMoves("boltund", ["pursuit"]);
		newMoves("archeops", ["fireblast", "dualwingbeat", "bravebird"]);
		newMoves("talonflame", ["scorchingsands"]);
		newMoves("staraptor", ["roleplay", "superfang"]);
		newMoves("bibarel", ["fly"]);
		newMoves("kricketune", ["closecombat", "drainpunch", "dualwingbeat", "firstimpression", "powertrip", "tripleaxel", "uturn"]);
		newMoves("mismagius", ["sludgebomb", "sludgewave", "toxicspikes", "poisonfang", "partingshot", "fling"]);
		newMoves("murkrow", ["partingshot"]);
		newMoves("honchkrow", ["partingshot", "dualwingbeat"]);
		newMoves("spiritomb", ["partingshot"]);
		newMoves("ariados", ["spikes"]);
		newMoves("gourgeist", ["bodypress", "encore", "flareblitz", "partingshot", "strengthsap"]);
		newMoves("mimikyu", ["firstimpression", "strengthsap", "uturn"]);
		newMoves("nidoqueen", ["milkdrink"]);
		newMoves("walrein", ["darkpulse", "flipturn", "focusblast", "freezedry", "slackoff"]);
		newMoves("aurorus", ["rapidspin", "voltswitch"]);
		newMoves("trevenant", ["floralhealing", "synthesis", "floralhealing", "synthesis"]);
		newMoves("eelektross", ["recover", "scald"]);
		newMoves("dragalge", ["acidspray", "gastroacid", "roost", "terrainpulse"]);
		newMoves("dhelmise", ["flipturn", "superpower"]);
		newMoves("meganium", ["calmmind", "dragondance", "rockslide", "solarblade", "weatherball"]);
		newMoves("typhlosion", ["explosion", "headcharge", "honeclaws", "morningsun", "rapidspin"]);
		newMoves("feraligatr", ["darkpulse", "firefang", "suckerpunch", "thunderfang"]);
		newMoves("regice", ["teleport", "freezedry"]);
		newMoves("magcargo", ["firelash", "energyball"]);
		newMoves("bastiodon", ["earthpower"]);
		newMoves("leavanny", ["appleacid", "lunge", "thunderouskick", "quiverdance"]);
		newMoves("parasect", ["junglehealing", "taunt"]);
		newMoves("samurott", ["flipturn", "psychocut", "slackoff"]);
		newMoves("meowstic", ["brickbreak", "foulplay", "knockoff", "partingshot", "pursuit"]);
		newMoves("meowsticf", ["dazzlinggleam", "drainingkiss", "moonblast", "mysticalfire"]);
		newMoves("starmie", ["calmmind", "futuresight", "followme", "moonblast", "photongeyser", "storedpower"]);
		newMoves("delibird", ["celebrate", "healingwish", "roost", "swordsdance", "uturn", "wish"]);
		newMoves("sawsbuck", ["moonblast", "petalblizzard", "playrough"]);
		newMoves("sawsbucksummer", ["flameburst", "flamethrower", "growth", "leafstorm", "overheat"]);
		newMoves("sawsbuckautumn", ["petalblizzard", "poltergeist", "shadowsneak", "strengthsap", "trickortreat"]);
		newMoves("sawsbuckwinter", ["blizzard", "freezedry", "icebeam", "iceshard", "iciclecrash"]);
		newMoves("flygon", ["extremespeed", "flashcannon", "ironhead"]);
		newMoves("drapion", ["shoreup"]);
		newMoves("lurantis", ["moonblast", "moonlight", "playrough", "silverwind"]);
		newMoves("exploud", ["clangingscales", "dragonpulse", "snarl"]);
		newMoves("noivern", ["encore"]);
		newMoves("toxtricity", ["frustration", "gearup", "hiddenpower"]);
		newMoves("toxtricitylowkey", ["hiddenpower", "return", "slackoff"]);
		newMoves("cacturne", ["assurance", "knockoff", "strengthsap"]);
		newMoves("hawlucha", ["partingshot", "stormthrow"]);
		newMoves("araquanid", ["hypnosis", "lifedew", "painsplit", "purify"]);
	},
	canMegaEvo(pokemon) {
		const altForme = pokemon.baseSpecies.otherFormes && this.dex.getSpecies(pokemon.baseSpecies.otherFormes[0]);
		const item = pokemon.getItem();
		if (
			altForme?.isMega && altForme?.requiredMove &&
			pokemon.baseMoves.includes(this.toID(altForme.requiredMove)) && !item.zMove
		) {
			return altForme.name;
		}
		if (item.name === "Lycanite" && pokemon.baseSpecies.name === "Lycanroc-Midnight") {
			return "Lycanroc-Midnight-Mega";
		}
		if (item.name === "Lycanite" && pokemon.baseSpecies.name === "Lycanroc-Dusk") {
			return "Lycanroc-Dusk-Mega";
		}
		if (item.name === "Raichunite" && pokemon.baseSpecies.name === "Raichu-Alola") {
			return null;
		}
		if (item.name === "Slowbronite" && pokemon.baseSpecies.name === "Slowbro-Galar") {
			return null;
		}
		if (item.name === "Slowkinite" && pokemon.baseSpecies.name === "Slowking-Galar") {
			return null;
		}
		if (item.name === "Gourgeite" && pokemon.baseSpecies.name === "Gourgeist-Small") {
			return "Gourgeist-Small-Mega";
		}
		if (item.name === "Gourgeite" && pokemon.baseSpecies.name === "Gourgeist-Large") {
			return "Gourgeist-Large-Mega";
		}
		if (item.name === "Gourgeite" && pokemon.baseSpecies.name === "Gourgeist-Super") {
			return "Gourgeist-Super-Mega";
		}
		if (item.name === "Reginite" && pokemon.baseSpecies.name === "Regice") {
			return "Regice-Mega";
		}
		if (item.name === "Reginite" && pokemon.baseSpecies.name === "Registeel") {
			return "Registeel-Mega";
		}
		if (item.name === "Meowsticite" && pokemon.baseSpecies.name === "Meowstic-F") {
			return "Meowstic-F-Mega";
		}
		if (item.name === "Sawsbuckite" && pokemon.baseSpecies.name === "Delibird") {
			return "Delibird-Mega-Festive-Rider";
		}
		if (item.name === "Sawsbuckite" && pokemon.baseSpecies.name === "Sawsbuck-Summer") {
			return "Sawsbuck-Summer-Mega";
		}
		if (item.name === "Sawsbuckite" && pokemon.baseSpecies.name === "Sawsbuck-Autumn") {
			return "Sawsbuck-Autumn-Mega";
		}
		if (item.name === "Sawsbuckite" && pokemon.baseSpecies.name === "Sawsbuck-Winter") {
			return "Sawsbuck-Winter-Mega";
		}
		if (item.name === "Toxtricitite" && pokemon.baseSpecies.name === "Toxtricity-Low-Key") {
			return "Toxtricity-Low-Key-Mega";
		}
		if (item.megaEvolves !== pokemon.baseSpecies.name || item.megaStone === pokemon.species.name) {
			return null;
		}
		return item.megaStone;
	},
	pokemon: {
		lostItemForDelibird: null,
		setItem(item: string | Item, source?: Pokemon, effect?: Effect) {
			if (!this.hp) return false;
			if (typeof item === 'string') item = this.battle.dex.getItem(item);

			const effectid = this.battle.effect ? this.battle.effect.id : '';
			const RESTORATIVE_BERRIES = new Set([
				'leppaberry', 'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry',
			] as ID[]);
			if (RESTORATIVE_BERRIES.has('leppaberry' as ID)) {
				const inflicted = ['trick', 'switcheroo'].includes(effectid);
				const external = inflicted && source && source.side.id !== this.side.id;
				this.pendingStaleness = external ? 'external' : 'internal';
			} else {
				this.pendingStaleness = undefined;
			}
			this.item = item.id;
			this.itemData = {id: item.id, target: this};
			if (item.id) {
				this.battle.singleEvent('Start', item, this.itemData, this, source, effect);
			}
			return true;
		},
	},
};
