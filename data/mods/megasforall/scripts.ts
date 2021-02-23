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
		newMoves("delphox", ["recover", "speedswap", "teleport"]);
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
		if (item.name === "Ninetalesite" && pokemon.species.name === "Ninetales") {
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
	runMove(moveOrMoveName, pokemon, targetLoc, sourceEffect, zMove, externalMove, maxMove, originalTarget) {
		pokemon.activeMoveActions++;
		let target = this.getTarget(pokemon, maxMove || zMove || moveOrMoveName, targetLoc, originalTarget);
		let baseMove = this.dex.getActiveMove(moveOrMoveName);
		const pranksterBoosted = baseMove.pranksterBoosted;
		if (baseMove.id !== 'struggle' && !zMove && !maxMove && !externalMove) {
			const changedMove = this.runEvent('OverrideAction', pokemon, target, baseMove);
			if (changedMove && changedMove !== true) {
				baseMove = this.dex.getActiveMove(changedMove);
				if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
				target = this.getRandomTarget(pokemon, baseMove);
			}
		}
		let move = baseMove;
		if (zMove) {
			if (pokemon.item === 'zoroarkite') { // only part that's changed
				zMove = undefined;
			} else {
				move = this.getActiveZMove(baseMove, pokemon);
			}
		} else if (maxMove) {
			move = this.getActiveMaxMove(baseMove, pokemon);
		}

		move.isExternal = externalMove;

		this.setActiveMove(move, pokemon, target);

		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.queue.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		} */
		const willTryMove = this.runEvent('BeforeMove', pokemon, target, move);
		if (!willTryMove) {
			this.runEvent('MoveAborted', pokemon, target, move);
			this.clearActiveMove(true);
			// The event 'BeforeMove' could have returned false or null
			// false indicates that this counts as a move failing for the purpose of calculating Stomping Tantrum's base power
			// null indicates the opposite, as the Pokemon didn't have an option to choose anything
			pokemon.moveThisTurnResult = willTryMove;
			return;
		}
		if (move.beforeMoveCallback) {
			if (move.beforeMoveCallback.call(this, pokemon, target, move)) {
				this.clearActiveMove(true);
				pokemon.moveThisTurnResult = false;
				return;
			}
		}
		pokemon.lastDamage = 0;
		let lockedMove;
		if (!externalMove) {
			lockedMove = this.runEvent('LockMove', pokemon);
			if (lockedMove === true) lockedMove = false;
			if (!lockedMove) {
				if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
					this.add('cant', pokemon, 'nopp', move);
					const gameConsole = [
						null, 'Game Boy', 'Game Boy Color', 'Game Boy Advance', 'DS', 'DS', '3DS', '3DS',
					][this.gen] || 'Switch';
					this.hint(`This is not a bug, this is really how it works on the ${gameConsole}; try it yourself if you don't believe us.`);
					this.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			} else {
				sourceEffect = this.dex.getEffect('lockedmove');
			}
			pokemon.moveUsed(move, targetLoc);
		}

		// Dancer Petal Dance hack
		// TODO: implement properly
		const noLock = externalMove && !pokemon.volatiles['lockedmove'];

		if (zMove) {
			if (pokemon.illusion) {
				this.singleEvent('End', this.dex.getAbility('Illusion'), pokemon.abilityData, pokemon);
			}
			this.add('-zpower', pokemon);
			pokemon.side.zMoveUsed = true;
		}
		const moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove, maxMove);
		this.lastSuccessfulMoveThisTurn = moveDidSomething ? this.activeMove && this.activeMove.id : null;
		if (this.activeMove) move = this.activeMove;
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
		this.runEvent('AfterMove', pokemon, target, move);

		// Dancer's activation order is completely different from any other event, so it's handled separately
		if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
			const dancers = [];
			for (const currentPoke of this.getAllActive()) {
				if (pokemon === currentPoke) continue;
				if (currentPoke.hasAbility('dancer') && !currentPoke.isSemiInvulnerable()) {
					dancers.push(currentPoke);
				}
			}
			// Dancer activates in order of lowest speed stat to highest
			// Note that the speed stat used is after any volatile replacements like Speed Swap,
			// but before any multipliers like Agility or Choice Scarf
			// Ties go to whichever Pokemon has had the ability for the least amount of time
			dancers.sort(
				(a, b) => -(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityOrder - a.abilityOrder
			);
			for (const dancer of dancers) {
				if (this.faintMessages()) break;
				if (dancer.fainted) continue;
				this.add('-activate', dancer, 'ability: Dancer');
				const dancersTarget = target!.side !== dancer.side && pokemon.side === dancer.side ? target! : pokemon;
				this.runMove(move.id, dancer, this.getTargetLoc(dancersTarget, dancer), this.dex.getAbility('dancer'), undefined, true);
			}
		}
		if (noLock && pokemon.volatiles['lockedmove']) delete pokemon.volatiles['lockedmove'];
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
