export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NOT CONVERTED: not in Champions
		winBattle: "", // NOT CONVERTED: not in Champions
		tieBattle: "", // NOT CONVERTED: not in Champions

		pokemon: "[NICKNAME]",
		opposingPokemon: "[NICKNAME] (Gegner)",
		team: "die Pokémon auf deiner Seite",
		opposingTeam: "die gegnerischen Pokémon",
		party: "die Mitstreiterseite",
		opposingParty: "Gegner",

		turn: "", // NOT CONVERTED: not in Champions
		switchIn: "[TRAINER:definite:nominative:capitalize] schickt [FULLNAME] in den Kampf!",
		switchInOwn: "Los, [FULLNAME]!",
		switchOut: "[TRAINER:definite:nominative:capitalize] hat [NICKNAME] zurückgerufen!",
		switchOutOwn: "[NICKNAME], komm zurück!",
		drag: "[FULLNAME] wurde ausgewählt!",
		faint: "[POKEMON] wurde besiegt!",
		swap: "[POKEMON] und [TARGET] haben den Platz getauscht!",
		swapCenter: "[POKEMON] ist in die Mitte gewechselt!",

		// Multi Battles only
		canDynamax: "  [TRAINER] kann nun das Dynamax-Phänomen auslösen!",
		canDynamaxOwn: "  Bei [TRAINER] hat sich Dynamax-Energie angesammelt!",

		zEffect: "  [POKEMON] nimmt all seine Kraft zusammen und setzt eine Z-Attacke ein!",
		move: "[POKEMON] setzt **[MOVE]** ein!",
		abilityActivation: "[[ABILITY] von [POKEMON]]",

		mega: "", // NOT CONVERTED: not in Champions
		megaNoItem: "", // NOT CONVERTED: not in Champions
		megaGen6: "", // NOT CONVERTED: not in Champions
		transformMega: "[POKEMON] hat sich zu Mega-[SPECIES] entwickelt!",
		primal: "[POKEMON] hat eine Protomorphose durchgeführt und seine urzeitliche Form zurückerlangt!",
		zPower: "  [POKEMON] hüllt sich in Z-Kraft!",
		zBroken: "  [POKEMON] konnte den Angriff nicht abwehren und erleidet Schaden!",
		terastallize: "", // NOT CONVERTED: not in Champions

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] kann [MOVE] nicht einsetzen!",
		cantNoMove: "", // NOT CONVERTED: not in Champions
		fail: "  Es ist fehlgeschlagen!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] verwandelt sich!",
		typeChange: "  [POKEMON] nimmt den Typ [TYPE] an!",
		typeChangeFromEffect: "", // NOT CONVERTED: not in Champions
		typeAdd: "  [POKEMON] nimmt zusätzlich den Typ [TYPE] an!",

		start: "", // NOT CONVERTED: not in Champions
		end: "  [POKEMON] wurde von [EFFECT] befreit!",
		activate: "", // NOT CONVERTED: not in Champions
		startTeamEffect: "", // NOT CONVERTED: not in Champions
		endTeamEffect: "", // NOT CONVERTED: not in Champions
		startFieldEffect: "", // NOT CONVERTED: not in Champions
		endFieldEffect: "", // NOT CONVERTED: not in Champions

		changeAbility: "  [POKEMON] nimmt die Fähigkeit [ABILITY] an!",
		addItem: "  [POKEMON] erhält das Item [ITEM]!",
		takeItem: "  [POKEMON] hat [SOURCE] das Item [ITEM] geklaut!",
		eatItem: "", // NOT CONVERTED: not in Champions
		useGem: "  [ITEM] erhöht die Stärke von [MOVE]!",
		eatItemWeaken: "  [ITEM] reduziert den Schaden gegen [POKEMON]!",
		removeItem: "", // NOT CONVERTED: not in Champions
		activateItem: "", // NOT CONVERTED: not in Champions
		activateWeaken: "  [ITEM] reduziert den Schaden gegen [POKEMON]!",

		damage: "  ([POKEMON] wurde Schaden zugefügt!)",
		damagePercentage: "", // NOT CONVERTED: not in Champions
		damageFromPokemon: "", // NOT CONVERTED: not in Champions
		damageFromItem: "  [POKEMON] wurde durch das Item [ITEM] verletzt!",
		damageFromPartialTrapping: "  [POKEMON] wurde durch [MOVE] verletzt!",
		heal: "  KP von [POKEMON] wurden aufgefrischt!",
		healFromZEffect: "  [POKEMON] hat durch Z-Kraft seine KP aufgefrischt!",
		healFromEffect: "", // NOT CONVERTED: not in Champions

		boost: "  [STAT] von [POKEMON] steigt!",
		boost2: "  [STAT] von [POKEMON] steigt stark!",
		boost3: "  [STAT] von [POKEMON] steigt drastisch!",
		boost0: "  [STAT] von [POKEMON] kann nicht weiter steigen!",
		boostFromItem: "", // NOT CONVERTED: not in Champions
		boost2FromItem: "", // NOT CONVERTED: not in Champions
		boost3FromItem: "", // NOT CONVERTED: not in Champions
		boostFromZEffect: "", // NOT CONVERTED: not in Champions
		boost2FromZEffect: "", // NOT CONVERTED: not in Champions
		boost3FromZEffect: "", // NOT CONVERTED: not in Champions
		boostMultipleFromZEffect: "  Mehrere Statuswerte von [POKEMON] wurden durch Z-Kraft erhöht!",

		unboost: "  [STAT] von [POKEMON] sinkt!",
		unboost2: "  [STAT] von [POKEMON] sinkt stark!",
		unboost3: "  [STAT] von [POKEMON] sinkt drastisch!",
		unboost0: "  [STAT] von [POKEMON] kann nicht weiter sinken!",
		unboostFromItem: "", // NOT CONVERTED: not in Champions
		unboost2FromItem: "", // NOT CONVERTED: not in Champions
		unboost3FromItem: "", // NOT CONVERTED: not in Champions

		swapBoost: "  [POKEMON] tauscht die Statusveränderungen mit dem Ziel!",
		swapOffensiveBoost: "  [POKEMON] tauscht Änderungen an Angriff und Spezial-Angriff mit dem Ziel!",
		swapDefensiveBoost: "  [POKEMON] tauscht Änderungen an Verteidigung und Spezial-Verteidigung mit dem Ziel!",
		copyBoost: "  [POKEMON] kopiert die Statuswertänderungen von [TARGET]!",
		clearBoost: "  Die Statuswertänderungen von [POKEMON] wurden aufgehoben!",
		clearBoostFromZEffect: "  Gesenkte Statuswerte von [POKEMON] wurden durch Z-Kraft zurückgesetzt!",
		invertBoost: "  Alle Statuswertänderungen von [POKEMON] wurden invertiert!",
		clearAllBoost: "  Alle Statuswertänderungen wurden aufgehoben!",

		superEffective: "  Das ist sehr effektiv!",
		superEffectiveSpread: "  Das ist sehr effektiv gegen [POKEMON]!",
		resisted: "  Das ist nicht sehr effektiv...",
		resistedSpread: "  Das ist nicht sehr effektiv gegen [POKEMON]...",
		extremelyEffective: "  Das ist extrem effektiv!!",
		extremelyEffectiveSpread: "  Das ist extrem effektiv gegen [POKEMON]!!",
		mostlyIneffective: "  Das ist extrem ineffektiv...",
		mostlyIneffectiveSpread: "  Das ist extrem ineffektiv gegen [POKEMON]...",
		crit: "  Ein Volltreffer!",
		critSpread: "  Gegen [POKEMON] wurde ein Volltreffer gelandet!",
		immune: "  Es hat keine Wirkung auf [POKEMON]...",
		immuneNoPokemon: "", // NOT CONVERTED: not in Champions
		immuneOHKO: "  [POKEMON] ist unversehrt!",
		miss: "  Die Attacke hat [POKEMON] verfehlt!",
		missNoPokemon: "", // NOT CONVERTED: not in Champions

		center: "  Mittig setzen!",
		noTarget: "", // NOT CONVERTED: not in Champions
		ohko: "  Ein K.O.-Treffer!",
		combine: "  Zwei Attacken bilden zusammen eine Kombi-Attacke!",
		hitCount: "  [NUMBER]-mal getroffen!",
		hitCountSingular: "  1-mal getroffen!",
	},

	// stats
	hp: {
		statName: "KP",
		statShortName: "KP",
	},
	atk: {
		statName: "Angriff",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	def: {
		statName: "Verteidigung",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spa: {
		statName: "Spezial-Angriff",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spd: {
		statName: "Spezial-Verteidigung",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spe: {
		statName: "Initiative",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	accuracy: {
		statName: "Genauigkeit",
	},
	evasion: {
		statName: "Ausweichwert",
	},
	spc: {
		statName: "", // NOT CONVERTED: not in Champions
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	stats: {
		statName: "Statuswerte",
	},

	// statuses
	brn: {
		start: "  [POKEMON] erleidet Verbrennungen!",
		startFromItem: "  [POKEMON] erleidet Verbrennungen durch das Item [ITEM]!",
		alreadyStarted: "  [POKEMON] leidet bereits unter Verbrennungen!",
		end: "", // NOT CONVERTED: not in Champions
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "  Die Verbrennungen schaden [POKEMON]!",
	},
	frz: {
		start: "  [POKEMON] erstarrt zu Eis!",
		alreadyStarted: "  [POKEMON] ist bereits eingefroren!",
		end: "  [POKEMON] wurde aufgetaut!",
		endFromItem: "  [ITEM] bewirkt, dass [POKEMON] auftaut!",
		endFromMove: "  Das Eis wurde durch [MOVE] von [POKEMON] aufgetaut!",
		cant: "[POKEMON] ist eingefroren und kann nicht handeln!",
	},
	par: {
		start: "  [POKEMON] ist paralysiert! Es kann eventuell nicht handeln!",
		alreadyStarted: "  [POKEMON] ist bereits paralysiert!",
		end: "  Die Paralyse von [POKEMON] wurde aufgehoben!",
		endFromItem: "  [ITEM] von [POKEMON] heilt die Paralyse!",
		cant: "", // NOT CONVERTED: not in Champions
	},
	psn: {
		start: "  [POKEMON] wurde vergiftet!",
		alreadyStarted: "  [POKEMON] ist bereits vergiftet!",
		end: "  Die Vergiftung von [POKEMON] wurde geheilt!",
		endFromItem: "  [ITEM] von [POKEMON] heilt die Vergiftung!",
		damage: "", // NOT CONVERTED: not in Champions
	},
	tox: {
		start: "  [POKEMON] wurde schwer vergiftet!",
		startFromItem: "  [POKEMON] wurde durch das Item [ITEM] schwer vergiftet!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] ist eingeschlafen!",
		startFromRest: "", // NOT CONVERTED: not in Champions
		alreadyStarted: "  [POKEMON] schläft bereits!",
		end: "  [POKEMON] ist aufgewacht!",
		endFromItem: "  [ITEM] bewirkt, dass [POKEMON] aufwacht!",
		cant: "[POKEMON] schläft tief und fest!",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON] wurde verwirrt!",
		startFromFatigue: "  [POKEMON] ist vor Erschöpfung verwirrt!",
		end: "  [POKEMON] ist nicht mehr verwirrt!",
		endFromItem: "  [ITEM] von [POKEMON] hebt die Verwirrung auf!",
		alreadyStarted: "  [POKEMON] ist bereits verwirrt!",
		activate: "  [POKEMON] ist verwirrt!",
		damage: "Es hat sich vor Verwirrung selbst verletzt!",
	},
	drain: {
		heal: "  [SOURCE] wurde Energie abgesaugt!",
	},
	flinch: {
		cant: "[POKEMON] ist zurückgeschreckt und kann nicht handeln!",
	},
	heal: {
		fail: "  [POKEMON] hat volle KP!",
	},
	healreplacement: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	nopp: {
		cant: "", // NOT CONVERTED: not in Champions
	},
	recharge: {
		cant: "[POKEMON] kann sich wegen des Rückstoßes durch den Angriff nicht bewegen!",
	},
	recoil: {
		damage: "  [POKEMON] erleidet Schaden durch Rückstoß!",
	},
	unboost: {
		fail: "  Statuswerte von [POKEMON] sinken nicht!",
		failSingular: "", // NOT CONVERTED: not in Champions
	},
	struggle: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	trapped: {
		start: "  [POKEMON] kann nicht mehr fliehen!",
	},
	dynamax: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "  Die Wirkung der Attacke wurde durch die Dynamax-Energie blockiert!",
		fail: "  [POKEMON] weigert sich. Es kann diese Attacke wohl nicht einsetzen...",
	},

	// weather
	sandstorm: {
		weatherName: "Sandsturm",
		start: "  Ein Sandsturm kommt auf!",
		end: "  Der Sandsturm legt sich!",
		upkeep: "  (Der Sandsturm tobt!)",
		damage: "  Der Sandsturm fügt [POKEMON] Schaden zu!",
	},
	sunnyday: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  Das Sonnenlicht wird stärker!",
		end: "  Das Sonnenlicht verliert an Intensität!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	raindance: {
		weatherName: "Regen",
		start: "  Es fängt an zu regnen!",
		end: "  Es hört auf zu regnen!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	hail: {
		weatherName: "Hagelsturm",
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	snowscape: {
		weatherName: "Schnee",
		start: "  Es fängt an zu schneien!",
		end: "  Es hört auf zu schneien!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	desolateland: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  Das Sonnenlicht wird sehr viel stärker!",
		end: "", // NOT CONVERTED: not in Champions
		block: "  Das starke Sonnenlicht lässt nicht nach!",
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	primordialsea: {
		weatherName: "Strömender Regen",
		start: "  Es fängt an, in Strömen zu regnen!",
		end: "  Der strömende Regen hat aufgehört!",
		block: "  Der strömende Regen lässt nicht nach!",
		blockMove: "  Der strömende Regen löscht den Angriff vom Typ Feuer und macht ihn wirkungslos!",
	},
	deltastream: {
		weatherName: "Luftströmungen",
		start: "  Alle Flug-Pokémon werden von rätselhaften Luftströmungen geschützt!",
		end: "  Die rätselhaften Luftströmungen haben sich wieder gelegt!",
		activate: "  Rätselhafte Luftströmungen haben den Angriff abgeschwächt!",
		block: "  Die rätselhaften Luftströmungen lassen nicht nach!",
	},

	// terrain
	electricterrain: {
		start: "  Elektrische Energie fließt durch den Boden!",
		end: "  Das Elektrofeld ist wieder verschwunden!",
		block: "  [POKEMON] wird vom Elektrofeld geschützt!",
	},
	grassyterrain: {
		start: "  Dichtes Gras schießt aus dem Boden!",
		end: "  Das Grasfeld ist wieder verschwunden!",
		heal: "", // NOT CONVERTED: not in Champions
	},
	mistyterrain: {
		start: "  Am Boden breitet sich dichter Nebel aus!",
		end: "  Das Nebelfeld ist wieder verschwunden!",
		block: "  [POKEMON] wird vom Nebelfeld geschützt!",
	},
	psychicterrain: {
		start: "  Der Boden fühlt sich seltsam an!",
		end: "  Das Psychofeld ist wieder verschwunden!",
		block: "  [POKEMON] wird vom Psychofeld geschützt!",
	},

	// field effects
	gravity: {
		start: "  Die Erdanziehung wurde verstärkt!",
		end: "  Die Erdanziehung ist wieder normal!",
		cant: "[POKEMON] kann aufgrund von Erdanziehung [MOVE] nicht einsetzen!",
		activate: "[POKEMON] kann aufgrund von Erdanziehung nicht mehr in der Luft bleiben!",
	},
	magicroom: {
		start: "  Es entsteht ein Raum, in dem getragene Items ihre Wirkung verlieren!",
		end: "  Der Magieraum verpufft. Getragene Items erhalten ihre Wirkung zurück!",
	},
	mudsport: {
		start: "  Die Stärke aller Elektro-Attacken wurde reduziert!",
		end: "  Lehmsuhler hört auf zu wirken!",
	},
	trickroom: {
		start: "  [POKEMON] hat die Dimensionen verdreht!",
		end: "  Die verdrehte Dimension ist wieder normal!",
	},
	watersport: {
		start: "  Die Stärke aller Feuer-Attacken wurde reduziert!",
		end: "  Nassmacher hört auf zu wirken!",
	},
	wonderroom: {
		start: "  Es entsteht ein Raum, in dem Verteidigung und Spezial-Verteidigung miteinander vertauscht sind!",
		end: "  Der Wunderraum verpufft. Verteidigung und Spezial-Verteidigung werden wieder zurückgesetzt!",
	},

	// misc
	crash: {
		damage: "  [POKEMON] springt daneben und verletzt sich!",
	},
};
