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
		newMoves("thievul", ["focusblast", "aurasphere", "hiddenpower", "moonlight", "spiritbreak"]);
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
		newMoves("mismagius", ["sludgebomb", "sludgewave", "toxicspikes", "poisonfang", "partingshot"]);
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
		newMoves("starmie", ["calmmind", "futuresight", "followme", "moonblast", "storedpower"]);
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
		newMoves("delphox", ["recover", "speedswap", "teleport"]);
		newMoves("wishiwashi", ["lifedew", "wish"]);
		newMoves("falinks", ["aurasphere", "flameburst", "flashcannon", "kingsshield", "thunder"]);
		newMoves("floatzel", ["coaching", "flipturn"]);
		newMoves("simisear", ["calmmind", "dazzlinggleam", "drainingkiss", "mysticalfire", "playrough", "slackoff"]);
		newMoves("krookodile", ["partingshot", "shoreup", "topsyturvy"]);
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
		if (item.name === "Ninetalesite" && pokemon.baseSpecies.name === "Ninetales") {
			return null;
		}
		if (item.name === "Dugtrionite" && pokemon.baseSpecies.name === "Dugtrio-Alola") {
			return null;
		}
		if (item.megaEvolves !== pokemon.baseSpecies.name || item.megaStone === pokemon.species.name) {
			return null;
		}
		return item.megaStone;
	},
	runMegaEvo(pokemon) {
		const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
		if (!speciesid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		if (pokemon.illusion) {
			this.singleEvent('End', this.dex.getAbility('Illusion'), pokemon.abilityData, pokemon);
		} // only part that's changed
		pokemon.formeChange(speciesid, pokemon.getItem(), true);

		// Limit one mega evolution
		const wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			if (wasMega) {
				ally.canMegaEvo = null;
			} else {
				ally.canUltraBurst = null;
			}
		}

		this.runEvent('AfterMega', pokemon);
		return true;
	},

	getDamage(
		pokemon: Pokemon, target: Pokemon, move: string | number | ActiveMove,
		suppressMessages = false
	): number | undefined | null | false {
		if (typeof move === 'string') move = this.dex.getActiveMove(move);

		if (typeof move === 'number') {
			const basePower = move;
			move = new Dex.Move({
				basePower,
				type: '???',
				category: 'Physical',
				willCrit: false,
			}) as ActiveMove;
			move.hit = 0;
		}

		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, !suppressMessages)) {
				return false;
			}
		}

		if (move.ohko) return target.maxhp;
		if (move.damageCallback) return move.damageCallback.call(this, pokemon, target);
		if (move.damage === 'level') {
			return pokemon.level;
		} else if (move.damage) {
			return move.damage;
		}

		const category = this.getCategory(move);
		const defensiveCategory = move.defensiveCategory || category;

		let basePower: number | false | null = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) return basePower === 0 ? undefined : basePower;
		basePower = this.clampIntRange(basePower, 1);

		let critMult;
		let critRatio = this.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
		if (this.gen <= 5) {
			critRatio = this.clampIntRange(critRatio, 0, 5);
			critMult = [0, 16, 8, 4, 3, 2];
		} else {
			critRatio = this.clampIntRange(critRatio, 0, 4);
			if (this.gen === 6) {
				critMult = [0, 16, 8, 2, 1];
			} else {
				critMult = [0, 24, 8, 2, 1];
			}
		}

		const moveHit = target.getMoveHitData(move);
		moveHit.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (critRatio) {
				moveHit.crit = this.randomChance(1, critMult[critRatio]);
			}
		}

		if (moveHit.crit) {
			moveHit.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		const level = pokemon.level;

		const attacker = pokemon;
		const defender = target;
		let attackStat: StatNameExceptHP = category === 'Physical' ? 'atk' : 'spa';
		const defenseStat: StatNameExceptHP = defensiveCategory === 'Physical' ? 'def' : 'spd';
		if (move.useSourceDefensiveAsOffensive) {
			attackStat = defenseStat;
			// Body press really wants to use the def stat,
			// so it switches stats to compensate for Wonder Room.
			// Of course, the game thus miscalculates the boosts...
			if ('wonderroom' in this.field.pseudoWeather) {
				if (attackStat === 'def') {
					attackStat = 'spd';
				} else if (attackStat === 'spd') {
					attackStat = 'def';
				}
				if (attacker.boosts['def'] || attacker.boosts['spd']) {
					this.hint("Body Press uses Sp. Def boosts when Wonder Room is active.");
				}
			}
		}
		if (move.settleBoosted) {
			attackStat = 'atk';
		}

		const statTable = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
		let attack;
		let defense;

		let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		if (move.bodyofwaterBoosted) {
			if (attackStat === 'def') {
				atkBoosts = attacker.boosts['atk'];
			} else if (attackStat === 'spd') {
				atkBoosts = attacker.boosts['spa'];
			}
		}
		let defBoosts = defender.boosts[defenseStat];

		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (moveHit.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		const ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
		const ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

		if (ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			atkBoosts = 0;
		}
		if (ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defBoosts = 0;
		}

		if (move.useTargetOffensive) {
			attack = defender.calculateStat(attackStat, atkBoosts);
		} else {
			attack = attacker.calculateStat(attackStat, atkBoosts);
		}

		attackStat = (category === 'Physical' ? 'atk' : 'spa');
		defense = defender.calculateStat(defenseStat, defBoosts);

		// Apply Stat Modifiers
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		if (this.gen <= 4 && ['explosion', 'selfdestruct'].includes(move.id) && defenseStat === 'def') {
			defense = this.clampIntRange(Math.floor(defense / 2), 1);
		}

		const tr = this.trunc;

		// int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		const baseDamage = tr(tr(tr(tr(2 * level / 5 + 2) * basePower * attack) / defense) / 50);

		// Calculate damage modifiers separately (order differs between generations)
		return this.modifyDamage(baseDamage, pokemon, target, move, suppressMessages);
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
		isGrounded(negateImmunity = false) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			if ('poolfloaties' in this.volatiles) return false;
			return item !== 'airballoon';
		}
	},
};
