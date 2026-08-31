export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NEEDS TRANSLATION: Showdown custom text
		winBattle: "", // NEEDS TRANSLATION: Showdown custom text
		tieBattle: "", // NEEDS TRANSLATION: Showdown custom text

		pokemon: "[NICKNAME]",
		opposingPokemon: "[NICKNAME] (Gegner)",
		team: "die Pokémon auf deiner Seite",
		opposingTeam: "die gegnerischen Pokémon",
		party: "die Mitstreiterseite",
		opposingParty: "Gegner",

		turn: "== Zug Nr. [NUMBER] ==",
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

		mega: "  [ITEM] von [POKEMON] reagiert auf Schlüssel-Stein von [TRAINER]!",
		megaNoItem: "  [POKEMON] reagiert auf Schlüssel-Stein von [TRAINER]!",
		megaGen6: "  [ITEM] von [POKEMON] reagiert auf Mega-Armreif von [TRAINER]!",
		transformMega: "[POKEMON] hat sich zu Mega-[SPECIES] entwickelt!",
		primal: "[POKEMON] hat eine Protomorphose durchgeführt und seine urzeitliche Form zurückerlangt!",
		zPower: "  [POKEMON] hüllt sich in Z-Kraft!",
		zBroken: "  [POKEMON] konnte den Angriff nicht abwehren und erleidet Schaden!",
		terastallize: "", // NEEDS TRANSLATION: Showdown custom text

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] kann [MOVE] nicht einsetzen!",
		cantNoMove: "[POKEMON] ist gelähmt!",
		fail: "  Es ist fehlgeschlagen!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] verwandelt sich!",
		typeChange: "  [POKEMON] nimmt den Typ [TYPE] an!",
		typeChangeFromEffect: "  [EFFECT] von [POKEMON] macht es zu einem [TYPE]-Typ!",
		typeAdd: "  [POKEMON] nimmt zusätzlich den Typ [TYPE] an!",

		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "  [POKEMON] wurde von [EFFECT] befreit!",
		activate: "", // NEEDS TRANSLATION: Showdown custom text
		startTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		startFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text

		changeAbility: "  [POKEMON] nimmt die Fähigkeit [ABILITY] an!",
		addItem: "  [POKEMON] erhält das Item [ITEM]!",
		takeItem: "  [POKEMON] hat [SOURCE] das Item [ITEM] geklaut!",
		eatItem: "", // NEEDS TRANSLATION: Showdown custom text
		useGem: "  [ITEM] erhöht die Stärke von [MOVE]!",
		eatItemWeaken: "  [ITEM] reduziert den Schaden gegen [POKEMON]!",
		removeItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateWeaken: "  [ITEM] reduziert den Schaden gegen [POKEMON]!",

		damage: "  ([POKEMON] wurde Schaden zugefügt!)",
		damagePercentage: "", // NEEDS TRANSLATION: Showdown custom text
		damageFromPokemon: "  [POKEMON] wird durch das Item [ITEM] von [SOURCE] verletzt!",
		damageFromItem: "  [POKEMON] wurde durch das Item [ITEM] verletzt!",
		damageFromPartialTrapping: "  [POKEMON] wurde durch [MOVE] verletzt!",
		heal: "  KP von [POKEMON] wurden aufgefrischt!",
		healFromZEffect: "  [POKEMON] hat durch Z-Kraft seine KP aufgefrischt!",
		healFromEffect: "  [POKEMON] füllt KP mit Hilfe von [EFFECT] auf!",

		boost: "  [STAT] von [POKEMON] steigt!",
		boost2: "  [STAT] von [POKEMON] steigt stark!",
		boost3: "  [STAT] von [POKEMON] steigt drastisch!",
		boost0: "  [STAT] von [POKEMON] kann nicht weiter steigen!",
		boostFromItem: "  [ITEM]: [STAT] von [POKEMON] steigt.",
		boost2FromItem: "  [ITEM]: [STAT] von [POKEMON] steigt stark!",
		boost3FromItem: "  [ITEM] von [POKEMON] erhöht [STAT:definite:accusative] drastisch!",
		boostFromZEffect: "  [STAT] von [POKEMON] wurde durch Z-Kraft erhöht!",
		boost2FromZEffect: "  [STAT] von [POKEMON] wurde durch Z-Kraft stark erhöht!",
		boost3FromZEffect: "  [STAT] von [POKEMON] wurde durch Z-Kraft drastisch erhöht!",
		boostMultipleFromZEffect: "  Mehrere Statuswerte von [POKEMON] wurden durch Z-Kraft erhöht!",

		unboost: "  [STAT] von [POKEMON] sinkt!",
		unboost2: "  [STAT] von [POKEMON] sinkt stark!",
		unboost3: "  [STAT] von [POKEMON] sinkt drastisch!",
		unboost0: "  [STAT] von [POKEMON] kann nicht weiter sinken!",
		unboostFromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost2FromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost3FromItem: "", // NEEDS TRANSLATION: Showdown custom text

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
		immuneNoPokemon: "  Es ist wirkungslos!",
		immuneOHKO: "  [POKEMON] ist unversehrt!",
		miss: "  Die Attacke hat [POKEMON] verfehlt!",
		missNoPokemon: "  Attacke von [SOURCE] geht daneben!",

		center: "  Mittig setzen!",
		noTarget: "  Aber da ist gar kein Ziel...",
		ohko: "  Ein K.O.-Treffer!",
		combine: "  Zwei Attacken bilden zusammen eine Kombi-Attacke!",
		hitCount: "  [NUMBER]-mal getroffen!",
	},

	// stats
	hp: {
		statName: "KP",
		statShortName: "KP",
	},
	atk: {
		statName: "Angriff",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	def: {
		statName: "Verteidigung",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spa: {
		statName: "Spezial-Angriff",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spd: {
		statName: "Spezial-Verteidigung",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spe: {
		statName: "Initiative",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	accuracy: {
		statName: "Genauigkeit",
		grammar: "fs",
	},
	evasion: {
		statName: "Ausweichwert",
		grammar: "ms",
	},
	spc: {
		statName: "Spezial",
		grammar: "ns",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	stats: {
		statName: "Statuswerte",
		grammar: "mp",
	},

	// statuses
	brn: {
		start: "  [POKEMON] erleidet Verbrennungen!",
		startFromItem: "  [POKEMON] erleidet Verbrennungen durch das Item [ITEM]!",
		alreadyStarted: "  [POKEMON] leidet bereits unter Verbrennungen!",
		end: "  Die Verbrennungen von [POKEMON] wurden geheilt!",
		endFromItem: "  [ITEM] von [POKEMON] heilt die Verbrennungen!",
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
		cant: "[POKEMON] ist paralysiert! Es kann nicht angreifen!",
	},
	psn: {
		start: "  [POKEMON] wurde vergiftet!",
		alreadyStarted: "  [POKEMON] ist bereits vergiftet!",
		end: "  Die Vergiftung von [POKEMON] wurde geheilt!",
		endFromItem: "  [ITEM] von [POKEMON] heilt die Vergiftung!",
		damage: "  [POKEMON] wird durch Gift verletzt!",
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
		startFromRest: "  [POKEMON] hat im Schlaf Energie getankt!",
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
		activate: "  [POKEMON] wird durch Z-Kraft die KP des für ihn eingewechselten Mitstreiters auffrischen!",
	},
	nopp: {
		cant: "[POKEMON] setzt **[MOVE]** ein!\n  Es sind keine AP mehr für diese Attacke übrig!",
	},
	recharge: {
		cant: "[POKEMON] kann sich wegen des Rückstoßes durch den Angriff nicht bewegen!",
	},
	recoil: {
		damage: "  [POKEMON] erleidet Schaden durch Rückstoß!",
	},
	unboost: {
		fail: "  Statuswerte von [POKEMON] sinken nicht!",
	},
	struggle: {
		activate: "  [POKEMON] hat keine Attacken mehr übrig!",
	},
	trapped: {
		start: "  [POKEMON] kann nicht mehr fliehen!",
	},
	dynamax: {
		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "", // NEEDS TRANSLATION: Showdown custom text
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
		weatherName: "Sonnenschein",
		start: "  Das Sonnenlicht wird stärker!",
		end: "  Das Sonnenlicht verliert an Intensität!",
		upkeep: "  (Gleißendes Sonnenlicht!)",
	},
	raindance: {
		weatherName: "Regen",
		start: "  Es fängt an zu regnen!",
		end: "  Es hört auf zu regnen!",
		upkeep: "  (Es regnet weiter.)",
	},
	hail: {
		weatherName: "Hagelsturm",
		start: "  Es fängt an zu hageln!",
		end: "  Es hört auf zu hageln!",
		upkeep: "  (Der Hagelsturm tobt!)",
		damage: "  [POKEMON] wird von Hagelkörnern getroffen!",
	},
	snowscape: {
		weatherName: "Schnee",
		start: "  Es fängt an zu schneien!",
		end: "  Es hört auf zu schneien!",
		upkeep: "  (Der Schneefall lässt nicht nach!)",
	},
	desolateland: {
		weatherName: "Gleißende Sonne",
		start: "  Das Sonnenlicht wird sehr viel stärker!",
		end: "  Das Sonnenlicht verliert an Intensität!",
		block: "  Das starke Sonnenlicht lässt nicht nach!",
		blockMove: "  Das intensive Sonnenlicht lässt die Wasser-Attacke verdampfen und macht sie wirkungslos!",
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
		heal: "  KP von [POKEMON] wurden aufgefrischt!",
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
