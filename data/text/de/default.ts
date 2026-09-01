export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "Der Kampf zwischen {TRAINER1} und {TRAINER2} beginnt!", // NEEDS QC
		winBattle: "**{TRAINER}** hat den Kampf gewonnen!", // NEEDS QC
		tieBattle: "Der Kampf zwischen {TRAINER1} und {TRAINER2} endet unentschieden!", // NEEDS QC

		pokemon: "{NICKNAME}",
		opposingPokemon: "{NICKNAME} (Gegner)",
		team: "die Pokémon auf deiner Seite",
		opposingTeam: "die gegnerischen Pokémon",
		party: "die Mitstreiter", // NEEDS QC
		opposingParty: "die gegnerischen Pokémon", // NEEDS QC

		turn: "== Runde {NUMBER} ==", // NEEDS QC
		switchIn: "{TRAINER:definite:nominative:capitalize} schickt {FULLNAME} in den Kampf!",
		switchInOwn: "Los, {FULLNAME}!",
		switchOut: "{TRAINER:definite:nominative:capitalize} hat {NICKNAME} zurückgerufen!",
		switchOutOwn: "{NICKNAME}, komm zurück!",
		drag: "{FULLNAME} wurde ausgewählt!",
		faint: "{POKEMON} wurde besiegt!",
		swap: "{POKEMON} und {TARGET} haben den Platz getauscht!",
		swapCenter: "{POKEMON} ist in die Mitte gewechselt!",

		// Multi Battles only
		canDynamax: "  {TRAINER} kann nun das Dynamax-Phänomen auslösen!",
		canDynamaxOwn: "  Bei {TRAINER} hat sich Dynamax-Energie angesammelt!",

		zEffect: "  {POKEMON} nimmt all seine Kraft zusammen und setzt eine Z-Attacke ein!",
		move: "{POKEMON} setzt **{MOVE}** ein!",
		abilityActivation: "[{ABILITY} von {POKEMON}]",

		mega: "  {ITEM} von {POKEMON} reagiert auf Schlüssel-Stein von {TRAINER}!",
		megaNoItem: "  {POKEMON} reagiert auf Schlüssel-Stein von {TRAINER}!",
		megaGen6: "  {ITEM} von {POKEMON} reagiert auf Mega-Armreif von {TRAINER}!",
		transformMega: "{POKEMON} hat sich zu Mega-{SPECIES} entwickelt!",
		primal: "{POKEMON} hat eine Protomorphose durchgeführt und seine urzeitliche Form zurückerlangt!",
		zPower: "  {POKEMON} hüllt sich in Z-Kraft!",
		zBroken: "  {POKEMON} konnte den Angriff nicht abwehren und erleidet Schaden!",
		terastallize: "  ({POKEMON} ist terakristallisiert und hat den Typ {TYPE} angenommen!)", // NEEDS QC

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "{POKEMON} kann {MOVE} nicht einsetzen!",
		cantNoMove: "{POKEMON} kann nicht handeln!", // NEEDS QC: old text "ist gelähmt!" was RBY de_msg:1573 (gen-1, paralysis-specific)
		fail: "  Es ist fehlgeschlagen!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "{POKEMON} verwandelt sich!",
		typeChange: "  {POKEMON} nimmt den Typ {TYPE} an!",
		typeChangeFromEffect: "  {EFFECT} von {POKEMON} macht es zu einem {TYPE}-Typ!",
		typeAdd: "  {POKEMON} nimmt zusätzlich den Typ {TYPE} an!",

		start: "  ({EFFECT} wirkt jetzt auf {POKEMON}!)", // NEEDS QC
		end: "  {POKEMON} wurde von {EFFECT} befreit!",
		activate: "  ({EFFECT} wurde ausgelöst!)", // NEEDS QC
		startTeamEffect: "  ({EFFECT} wirkt jetzt auf {TEAM}!)", // NEEDS QC
		endTeamEffect: "  ({EFFECT} wirkt nicht mehr auf {TEAM}!)", // NEEDS QC
		startFieldEffect: "  ({EFFECT} beginnt!)", // NEEDS QC
		endFieldEffect: "  ({EFFECT} endet!)", // NEEDS QC

		changeAbility: "  {POKEMON} nimmt die Fähigkeit {ABILITY} an!",
		addItem: "  {POKEMON} erhält das Item {ITEM}!",
		takeItem: "  {POKEMON} hat {SOURCE} das Item {ITEM} geklaut!",
		eatItem: "  ({POKEMON} hat das Item {ITEM} verzehrt!)", // NEEDS QC
		useGem: "  {ITEM} erhöht die Stärke von {MOVE}!",
		eatItemWeaken: "  {ITEM} reduziert den Schaden gegen {POKEMON}!",
		removeItem: "  {POKEMON} hat das Item {ITEM} verloren!", // NEEDS QC
		activateItem: "  ({POKEMON} hat das Item {ITEM} eingesetzt!)", // NEEDS QC
		activateWeaken: "  {ITEM} reduziert den Schaden gegen {POKEMON}!",

		damage: "  ({POKEMON} wurde Schaden zugefügt!)",
		damagePercentage: "  ({POKEMON} hat {PERCENTAGE} % seiner KP verloren!)", // NEEDS QC
		damageFromPokemon: "  {POKEMON} wird durch das Item {ITEM} von {SOURCE} verletzt!",
		damageFromItem: "  {POKEMON} wurde durch das Item {ITEM} verletzt!",
		damageFromPartialTrapping: "  {POKEMON} wurde durch {MOVE} verletzt!",
		heal: "  KP von {POKEMON} wurden aufgefrischt!",
		healFromZEffect: "  {POKEMON} hat durch Z-Kraft seine KP aufgefrischt!",
		healFromEffect: "  {POKEMON} füllt KP mit Hilfe von {EFFECT} auf!",

		boost: "  {STAT} von {POKEMON} steigt!",
		boost2: "  {STAT} von {POKEMON} steigt stark!",
		boost3: "  {STAT} von {POKEMON} steigt drastisch!",
		boost0: "  {STAT} von {POKEMON} kann nicht weiter steigen!",
		boostFromItem: "  {ITEM} von {POKEMON} erhöht {STAT:definite:accusative}!", // NEEDS QC: adapted from SwSh de_common:6460
		boost2FromItem: "  {ITEM} von {POKEMON} erhöht {STAT:definite:accusative} stark!", // NEEDS QC: adapted from SwSh de_common:6488
		boost3FromItem: "  {ITEM} von {POKEMON} erhöht {STAT:definite:accusative} drastisch!",
		boostFromZEffect: "  {STAT} von {POKEMON} wurde durch Z-Kraft erhöht!",
		boost2FromZEffect: "  {STAT} von {POKEMON} wurde durch Z-Kraft stark erhöht!",
		boost3FromZEffect: "  {STAT} von {POKEMON} wurde durch Z-Kraft drastisch erhöht!",
		boostMultipleFromZEffect: "  Mehrere Statuswerte von {POKEMON} wurden durch Z-Kraft erhöht!",

		unboost: "  {STAT} von {POKEMON} sinkt!",
		unboost2: "  {STAT} von {POKEMON} sinkt stark!",
		unboost3: "  {STAT} von {POKEMON} sinkt drastisch!",
		unboost0: "  {STAT} von {POKEMON} kann nicht weiter sinken!",
		unboostFromItem: "  {ITEM} von {POKEMON} senkt {STAT:definite:accusative}!", // NEEDS QC
		unboost2FromItem: "  {ITEM} von {POKEMON} senkt {STAT:definite:accusative} stark!", // NEEDS QC
		unboost3FromItem: "  {ITEM} von {POKEMON} senkt {STAT:definite:accusative} drastisch!", // NEEDS QC

		swapBoost: "  {POKEMON} tauscht die Statusveränderungen mit dem Ziel!",
		swapOffensiveBoost: "  {POKEMON} tauscht Änderungen an Angriff und Spezial-Angriff mit dem Ziel!",
		swapDefensiveBoost: "  {POKEMON} tauscht Änderungen an Verteidigung und Spezial-Verteidigung mit dem Ziel!",
		copyBoost: "  {POKEMON} kopiert die Statuswertänderungen von {TARGET}!",
		clearBoost: "  Die Statuswertänderungen von {POKEMON} wurden aufgehoben!",
		clearBoostFromZEffect: "  Gesenkte Statuswerte von {POKEMON} wurden durch Z-Kraft zurückgesetzt!",
		invertBoost: "  Alle Statuswertänderungen von {POKEMON} wurden invertiert!",
		clearAllBoost: "  Alle Statuswertänderungen wurden aufgehoben!",

		superEffective: "  Das ist sehr effektiv!",
		superEffectiveSpread: "  Das ist sehr effektiv gegen {POKEMON}!",
		resisted: "  Das ist nicht sehr effektiv...",
		resistedSpread: "  Das ist nicht sehr effektiv gegen {POKEMON}...",
		// this is official text meaning 4x effective. do not QC this
		extremelyEffective: "  Das ist extrem effektiv!!",
		extremelyEffectiveSpread: "  Das ist extrem effektiv gegen {POKEMON}!!",
		// this is official text meaning 1/4x effective. do not QC this
		mostlyIneffective: "  Das ist extrem ineffektiv...",
		mostlyIneffectiveSpread: "  Das ist extrem ineffektiv gegen {POKEMON}...",
		crit: "  Ein Volltreffer!",
		critSpread: "  Gegen {POKEMON} wurde ein Volltreffer gelandet!",
		immune: "  Es hat keine Wirkung auf {POKEMON}...",
		immuneNoPokemon: "  Es ist wirkungslos!",
		immuneOHKO: "  {POKEMON} ist unversehrt!",
		miss: "  Die Attacke hat {POKEMON} verfehlt!",
		missNoPokemon: "  Attacke von {SOURCE} geht daneben!",

		center: "  Mittig setzen!",
		noTarget: "  Aber da ist gar kein Ziel...",
		ohko: "  Ein K.O.-Treffer!",
		combine: "  Zwei Attacken bilden zusammen eine Kombi-Attacke!",
		hitCount: "  {NUMBER}-mal getroffen!",
	},
	ui: {
		whatDo: "Was soll **{POKEMON}** tun?", // NEEDS QC
		moveTarget: "Worauf soll {POKEMON} **{MOVE}** einsetzen?", // NEEDS QC
		reviveWho: "Wen soll **{POKEMON}** wiederbeleben?", // NEEDS QC
		replaceWho: "Wer soll **{POKEMON}** ersetzen?", // NEEDS QC
		teamStart: "Wie startest du in den Kampf?", // NEEDS QC
		teamRest: "Reihenfolge der übrigen Pokémon?", // NEEDS QC
		chooseLead: "Startpokémon wählen", // NEEDS QC
		chooseSlot: "Platz {NUMBER} wählen", // NEEDS QC
		teamSoFar: "Bisheriges Team", // NEEDS QC
		waitingOpponent: "Warte auf Gegner...", // NEEDS QC
		cantSwitchTrapped: "Du sitzt **in der Falle** und kannst nicht wechseln!", // NEEDS QC
		usuallyMovesFirst: "Handelt meist zuerst (Priorität +{PRIORITY}).", // NEEDS QC
		almostAlwaysMovesFirst: "Handelt fast immer zuerst (Priorität +{PRIORITY}).", // NEEDS QC
		almostAlwaysMovesLast: "Handelt fast immer zuletzt (Priorität −{PRIORITY}).", // NEEDS QC
		failsIfHP: "Schlägt fehl, wenn die aktuellen KP {HP} betragen.", // NEEDS QC
		koSelfIfHP: "Besiegt den Anwender, wenn die aktuellen KP genau {HP} betragen.", // NEEDS QC
		transformedInto: "(Verwandelt in {SPECIES})", // NEEDS QC
		changedForme: "(Formwechsel: {SPECIES})", // NEEDS QC
		possibleIllusion: "Mögliches Trugbild #{NUMBER}", // NEEDS QC
		pixels: "({HP}/{MAXHP} Pixel)", // NEEDS QC
		wouldTakeIfAbilityRemoved: "Schaden ohne Fähigkeit: {PERCENT}%", // NEEDS QC
		nextDamage: "Nächster Schaden: {PERCENT}%", // NEEDS QC
		turnsAsleep: "Schlafrunden: {NUMBER}", // NEEDS QC
		illusionWarning: "(Mehr als 4 Attacken deuten meist auf das Trugbild von Zoroark/Zorua hin.)", // NEEDS QC
		pressureGen3Warning: "(Erzwinger ist in Gen 3 nicht sichtbar, daher ist der genaue AP-Verbrauch manchmal unbekannt.)", // NEEDS QC
		indistinguishableWarning: "(Der Gegner hat zwei ununterscheidbare Pokémon, daher lässt sich nicht sagen, welches welche Attacken/Fähigkeit/Item hat.)", // NEEDS QC
		noConditions: "(keine Zustände)", // NEEDS QC
		turn: "({NUMBER} Runde)", // NEEDS QC
		turns: "({NUMBER} Runden)", // NEEDS QC
		afterStatModifiers: "(Nach Statuswert-Modifikatoren:)", // NEEDS QC
		calls: "Ruft {MOVE} auf", // NEEDS QC
		base: "(Basis: {VALUE})", // NEEDS QC
		zEffectClearNegativeBoost: "Setzt gesenkte Statuswerte zurück", // NEEDS QC
		zEffectCrit2: "Volltrefferquote +2", // NEEDS QC
		zEffectHeal: "Stellt 100 % der KP wieder her", // NEEDS QC
		zEffectCurse: "Stellt bei Geist-Pokémon 100 % der KP wieder her, sonst Angriff +1", // NEEDS QC
		zEffectRedirect: "Lenkt gegnerische Angriffe auf den Anwender", // NEEDS QC
		zEffectHealReplacement: "Stellt 100 % der KP des eingewechselten Pokémon wieder her", // NEEDS QC
		ppRange: "({LOW} bis {HIGH})", // NEEDS QC
		revealed: "(bekannt)", // NEEDS QC
		range: "{LOW} bis {HIGH}", // NEEDS QC
		beforeStatStages: "(vor Statuswert-Änderungen)", // NEEDS QC
		beforeExternalModifiers: "(vor externen Modifikatoren)", // NEEDS QC
		flingBerry: "Löst den Effekt der Beere beim Ziel aus.", // NEEDS QC
		flingWhiteHerb: "Setzt gesenkte Statuswerte des Ziels zurück.", // NEEDS QC
		flingMentalHerb: "Hebt die Effekte von Anziehung, Aussetzer, Zugabe, Heilblockade, Verhöhner und Folterknecht beim Ziel auf.", // NEEDS QC
		cantFling: "Dieses Item kann nicht mit Schleuder eingesetzt werden.", // NEEDS QC
		unobtainableInGen: "In Gen {NUMBER} nicht erhältlich", // NEEDS QC
		tagMoves: "Attacken: {TAG}", // NEEDS QC
		notifyMoveTitle: "Dein Zug!", // NEEDS QC
		notifyMove: "Wähle eine Attacke in deinem Kampf", // NEEDS QC
		notifyMoveAgainst: "Wähle eine Attacke in deinem Kampf gegen {OPPONENT}", // NEEDS QC
		notifySwitchTitle: "Dein Wechsel!", // NEEDS QC
		notifySwitch: "Wechsle in deinem Kampf", // NEEDS QC
		notifySwitchAgainst: "Wechsle in deinem Kampf gegen {OPPONENT}", // NEEDS QC
		notifyTeamTitle: "Teamvorschau!", // NEEDS QC
		notifyTeam: "Wähle deine Teamreihenfolge in deinem Kampf", // NEEDS QC
		notifyTeamAgainst: "Wähle deine Teamreihenfolge in deinem Kampf gegen {OPPONENT}", // NEEDS QC
		mightBeDisabled: "Einige deiner Attacken sind **möglicherweise** blockiert, daher kannst du die Attackenwahl nicht abbrechen!", // NEEDS QC
		mightBeLocked: "Du bist **möglicherweise** auf eine Attacke festgelegt.", // NEEDS QC
		lockedExplanation: "(verhindert das Wechseln, falls du festgelegt bist)", // NEEDS QC
		mightBeTrapped: "Du bist **möglicherweise** gefangen, daher kannst du einen Wechsel nicht abbrechen!", // NEEDS QC
		autoChoice: "Automatische Wahl", // NEEDS QC
		unrecognizedChoice: "Unbekannte Wahl vom Server:", // NEEDS QC
		lockedIntoMove: "{POKEMON} ist auf eine Attacke festgelegt.", // NEEDS QC
		willUseMove: "{POKEMON} wird {ACTIONS}**{MOVE}**{AT} einsetzen.", // NEEDS QC
		atTarget: " auf {TARGET}", // NEEDS QC
		atSlot: " auf Position {NUMBER}", // NEEDS QC
		atAllyTarget: " auf Mitstreiter {TARGET}", // NEEDS QC
		atAllySlot: " auf Mitstreiter-Position {NUMBER}", // NEEDS QC
		actionMegaEvolve: "sich **Mega**-entwickeln und ", // NEEDS QC
		actionMegaEvolveX: "sich **Mega**-entwickeln (X) und ", // NEEDS QC
		actionMegaEvolveY: "sich **Mega**-entwickeln (Y) und ", // NEEDS QC
		actionUltraBurst: "einen **Ultra**-Burst durchführen und ", // NEEDS QC
		actionTerastallize: "terakristallisieren (**{TYPE}**) und ", // NEEDS QC
		actionDynamax: "sich **dynamaximieren** und ", // NEEDS QC
		actionGigantamax: "sich **gigadynamaximieren** und ", // NEEDS QC
		willRevive: "{POKEMON} wird **{TARGET}** wiederbeleben.", // NEEDS QC
		willSwitch: "{POKEMON} wird zu **{TARGET}** wechseln.", // NEEDS QC
		willShift: "{POKEMON} wird in die **Mitte** rücken.", // NEEDS QC
		youPicked: "Du hast {POKEMON} gewählt.", // NEEDS QC
		listComma: ", ", // NEEDS QC
		effectivenessVs: "{EFFECT} gegen {POKEMON}", // NEEDS QC
		basePowerVs: "{LABEL} gegen {POKEMON}", // NEEDS QC
		or: " oder ", // NEEDS QC
	},

	// statuses
	brn: {
		start: "  {POKEMON} erleidet Verbrennungen!",
		startFromItem: "  {POKEMON} erleidet Verbrennungen durch das Item {ITEM}!",
		alreadyStarted: "  {POKEMON} leidet bereits unter Verbrennungen!",
		end: "  Die Verbrennungen von {POKEMON} wurden geheilt!",
		endFromItem: "  {ITEM} von {POKEMON} heilt die Verbrennungen!",
		damage: "  Die Verbrennungen schaden {POKEMON}!",
	},
	frz: {
		start: "  {POKEMON} erstarrt zu Eis!",
		alreadyStarted: "  {POKEMON} ist bereits eingefroren!",
		end: "  {POKEMON} wurde aufgetaut!",
		endFromItem: "  {ITEM} bewirkt, dass {POKEMON} auftaut!",
		endFromMove: "  Das Eis wurde durch {MOVE} von {POKEMON} aufgetaut!",
		cant: "{POKEMON} ist eingefroren und kann nicht handeln!",
	},
	par: {
		start: "  {POKEMON} ist paralysiert! Es kann eventuell nicht handeln!",
		alreadyStarted: "  {POKEMON} ist bereits paralysiert!",
		end: "  Die Paralyse von {POKEMON} wurde aufgehoben!",
		endFromItem: "  {ITEM} von {POKEMON} heilt die Paralyse!",
		cant: "{POKEMON} ist paralysiert! Es kann nicht angreifen!",
	},
	psn: {
		start: "  {POKEMON} wurde vergiftet!",
		alreadyStarted: "  {POKEMON} ist bereits vergiftet!",
		end: "  Die Vergiftung von {POKEMON} wurde geheilt!",
		endFromItem: "  {ITEM} von {POKEMON} heilt die Vergiftung!",
		damage: "  {POKEMON} wird durch Gift verletzt!",
	},
	tox: {
		start: "  {POKEMON} wurde schwer vergiftet!",
		startFromItem: "  {POKEMON} wurde durch das Item {ITEM} schwer vergiftet!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  {POKEMON} ist eingeschlafen!",
		startFromRest: "  {POKEMON} hat im Schlaf Energie getankt!",
		alreadyStarted: "  {POKEMON} schläft bereits!",
		end: "  {POKEMON} ist aufgewacht!",
		endFromItem: "  {ITEM} bewirkt, dass {POKEMON} aufwacht!",
		cant: "{POKEMON} schläft tief und fest!",
	},

	// misc effects
	confusion: {
		start: "  {POKEMON} wurde verwirrt!",
		startFromFatigue: "  {POKEMON} ist vor Erschöpfung verwirrt!",
		end: "  {POKEMON} ist nicht mehr verwirrt!",
		endFromItem: "  {ITEM} von {POKEMON} hebt die Verwirrung auf!",
		alreadyStarted: "  {POKEMON} ist bereits verwirrt!",
		activate: "  {POKEMON} ist verwirrt!",
		damage: "Es hat sich vor Verwirrung selbst verletzt!",
	},
	drain: {
		heal: "  {SOURCE} wurde Energie abgesaugt!",
	},
	flinch: {
		cant: "{POKEMON} ist zurückgeschreckt und kann nicht handeln!",
	},
	heal: {
		fail: "  {POKEMON} hat volle KP!",
	},
	healreplacement: {
		activate: "  {POKEMON} wird durch Z-Kraft die KP des für ihn eingewechselten Mitstreiters auffrischen!",
	},
	nopp: {
		cant: "{POKEMON} setzt **{MOVE}** ein!\n  Es sind keine AP mehr für diese Attacke übrig!",
	},
	recharge: {
		cant: "{POKEMON} kann sich wegen des Rückstoßes durch den Angriff nicht bewegen!",
	},
	recoil: {
		damage: "  {POKEMON} erleidet Schaden durch Rückstoß!",
	},
	unboost: {
		fail: "  {STAT:capitalize} von {POKEMON} {INFLECT:STAT:s=sinkt:p=sinken} nicht!", // NEEDS QC: per-stat form; cf. SV de_common:6483 "Angriff von X sinkt nicht!"
		failNoStat: "  Statuswerte von {POKEMON} sinken nicht!", // SV de_common:6479
	},
	struggle: {
		activate: "  {POKEMON} hat keine Attacken mehr übrig!",
	},
	trapped: {
		start: "  {POKEMON} kann nicht mehr fliehen!",
	},
	dynamax: {
		start: "  ({POKEMON} dynamaximiert sich!)", // NEEDS QC
		end: "  ({POKEMON} nimmt wieder seine normale Gestalt an!)", // NEEDS QC
		block: "  Die Wirkung der Attacke wurde durch die Dynamax-Energie blockiert!",
		fail: "  {POKEMON} weigert sich. Es kann diese Attacke wohl nicht einsetzen...",
	},

	// weather
	sandstorm: {
		weatherName: "Sandsturm",
		start: "  Ein Sandsturm kommt auf!",
		end: "  Der Sandsturm legt sich!",
		upkeep: "  (Der Sandsturm tobt!)",
		damage: "  Der Sandsturm fügt {POKEMON} Schaden zu!",
	},
	sunnyday: {
		weatherName: "Sonne",
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
		damage: "  {POKEMON} wird von Hagelkörnern getroffen!",
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
		block: "  {POKEMON} wird vom Elektrofeld geschützt!",
	},
	grassyterrain: {
		start: "  Dichtes Gras schießt aus dem Boden!",
		end: "  Das Grasfeld ist wieder verschwunden!",
		heal: "  KP von {POKEMON} wurden aufgefrischt!",
	},
	mistyterrain: {
		start: "  Am Boden breitet sich dichter Nebel aus!",
		end: "  Das Nebelfeld ist wieder verschwunden!",
		block: "  {POKEMON} wird vom Nebelfeld geschützt!",
	},
	psychicterrain: {
		start: "  Der Boden fühlt sich seltsam an!",
		end: "  Das Psychofeld ist wieder verschwunden!",
		block: "  {POKEMON} wird vom Psychofeld geschützt!",
	},

	// field effects
	gravity: {
		start: "  Die Erdanziehung wurde verstärkt!",
		end: "  Die Erdanziehung ist wieder normal!",
		cant: "{POKEMON} kann aufgrund von Erdanziehung {MOVE} nicht einsetzen!",
		activate: "{POKEMON} kann aufgrund von Erdanziehung nicht mehr in der Luft bleiben!",
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
		start: "  {POKEMON} hat die Dimensionen verdreht!",
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
		damage: "  {POKEMON} springt daneben und verletzt sich!",
	},
};
