export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NOT CONVERTED: not in Champions
		winBattle: "", // NOT CONVERTED: not in Champions
		tieBattle: "", // NOT CONVERTED: not in Champions

		pokemon: "[NICKNAME]",
		opposingPokemon: "[NICKNAME] avversario",
		team: "la tua squadra",
		opposingTeam: "la squadra avversaria",
		party: "i Pokémon alleati",
		opposingParty: "i Pokémon nemici",

		turn: "", // NOT CONVERTED: not in Champions
		switchIn: "[TRAINER] manda in campo [FULLNAME]!",
		switchInOwn: "Avanti, [FULLNAME]!",
		switchOut: "[TRAINER] ritira [NICKNAME] dalla lotta!",
		switchOutOwn: "[NICKNAME], rientra!",
		drag: "[FULLNAME] è trascinato nella lotta!",
		faint: "[POKEMON] non ha più energie!",
		swap: "[POKEMON] e [TARGET] si scambiano di posto!",
		swapCenter: "[POKEMON] passa in prima linea!",

		// Multi Battles only
		canDynamax: "  [TRAINER] ora può usare il Dynamax!",
		canDynamaxOwn: "  L’energia Dynamax avvolge [TRAINER]!",

		zEffect: "  [POKEMON] usa una mossa Z sprigionando tutta la sua potenza!",
		move: "[POKEMON] usa **[MOVE]**!",
		abilityActivation: "[[ABILITY] di [POKEMON]]",

		mega: "", // NOT CONVERTED: not in Champions
		megaNoItem: "", // NOT CONVERTED: not in Champions
		megaGen6: "", // NOT CONVERTED: not in Champions
		transformMega: "[POKEMON] si evolve in Mega[SPECIES]!",
		primal: "[POKEMON] si è archeorisvegliato! È tornato alla sua forma originaria!",
		zPower: "  Il Potere Z circonda [POKEMON] come un’aura!",
		zBroken: "  La protezione fallisce! [POKEMON] subisce dei danni!",
		terastallize: "", // NOT CONVERTED: not in Champions

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] non può usare [MOVE]!",
		cantNoMove: "", // NOT CONVERTED: not in Champions
		fail: "  Ma fallisce!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] si è trasformato!",
		typeChange: "  [POKEMON] è diventato di tipo [TYPE]!",
		typeChangeFromEffect: "", // NOT CONVERTED: not in Champions
		typeAdd: "  Adesso [POKEMON] è anche di tipo [TYPE]!",

		start: "", // NOT CONVERTED: not in Champions
		end: "  [POKEMON] si è liberato da [EFFECT]!",
		activate: "", // NOT CONVERTED: not in Champions
		startTeamEffect: "", // NOT CONVERTED: not in Champions
		endTeamEffect: "", // NOT CONVERTED: not in Champions
		startFieldEffect: "", // NOT CONVERTED: not in Champions
		endFieldEffect: "", // NOT CONVERTED: not in Champions

		changeAbility: "  L’abilità di [POKEMON] è ora [ABILITY]!",
		addItem: "  [POKEMON] ottiene [ITEM]!",
		takeItem: "  [POKEMON] ruba [ITEM] di [SOURCE]!",
		eatItem: "", // NOT CONVERTED: not in Champions
		useGem: "  [ITEM] incrementa la potenza di [MOVE]!",
		eatItemWeaken: "  I danni inflitti [POKEMON] vengono ridotti d[ITEM]!",
		removeItem: "", // NOT CONVERTED: not in Champions
		activateItem: "", // NOT CONVERTED: not in Champions
		activateWeaken: "  I danni inflitti [POKEMON] vengono ridotti d[ITEM]!",

		damage: "  ([POKEMON] è ferito!)",
		damagePercentage: "", // NOT CONVERTED: not in Champions
		damageFromPokemon: "", // NOT CONVERTED: not in Champions
		damageFromItem: "", // NOT CONVERTED: runtime grammar
		damageFromPartialTrapping: "  [POKEMON] subisce i danni della mossa [MOVE]!",
		heal: "  [POKEMON] ha recuperato dei PS!",
		healFromZEffect: "", // NOT CONVERTED: runtime grammar
		healFromEffect: "", // NOT CONVERTED: not in Champions

		boost: "  [STAT] di [POKEMON] aumenta!",
		boost2: "  [STAT] di [POKEMON] aumenta di molto!",
		boost3: "  [STAT] di [POKEMON] aumenta di moltissimo!",
		boost0: "  [STAT] di [POKEMON] non può aumentare di più!",
		boostFromItem: "", // NOT CONVERTED: not in Champions
		boost2FromItem: "", // NOT CONVERTED: not in Champions
		boost3FromItem: "", // NOT CONVERTED: not in Champions
		boostFromZEffect: "", // NOT CONVERTED: not in Champions
		boost2FromZEffect: "", // NOT CONVERTED: not in Champions
		boost3FromZEffect: "", // NOT CONVERTED: not in Champions
		boostMultipleFromZEffect: "  Le statistiche di [POKEMON] aumentano grazie al Potere Z!",

		unboost: "  [STAT] di [POKEMON] diminuisce!",
		unboost2: "  [STAT] di [POKEMON] diminuisce di molto!",
		unboost3: "  [STAT] di [POKEMON] cala drasticamente!",
		unboost0: "  [STAT] di [POKEMON] non può diminuire di più!",
		unboostFromItem: "", // NOT CONVERTED: not in Champions
		unboost2FromItem: "", // NOT CONVERTED: not in Champions
		unboost3FromItem: "", // NOT CONVERTED: not in Champions

		swapBoost: "  [POKEMON] scambia con il bersaglio le modifiche alle statistiche!",
		swapOffensiveBoost: "  [POKEMON] scambia con il bersaglio le modifiche ad Attacco e Attacco Speciale!",
		swapDefensiveBoost: "  [POKEMON] scambia con il bersaglio le modifiche a Difesa e Difesa Speciale!",
		copyBoost: "  [POKEMON] copia le modifiche alle statistiche di [TARGET]!",
		clearBoost: "  Le statistiche di [POKEMON] tornano alla normalità!",
		clearBoostFromZEffect: "  Le statistiche di [POKEMON] che erano diminuite tornano alla normalità grazie al Potere Z!",
		invertBoost: "  Le modifiche alle statistiche di [POKEMON] vengono invertite!",
		clearAllBoost: "  Tutte le modifiche alle statistiche sono state annullate!",

		superEffective: "  È superefficace!",
		superEffectiveSpread: "  È superefficace su [POKEMON]!",
		resisted: "  Non è molto efficace...",
		resistedSpread: "  Non è molto efficace su [POKEMON]...",
		extremelyEffective: "  È iperefficace!!",
		extremelyEffectiveSpread: "  È iperefficace su [POKEMON]!!",
		mostlyIneffective: "  Non è quasi per niente efficace...",
		mostlyIneffectiveSpread: "  Non è quasi per niente efficace su [POKEMON]...",
		crit: "  Brutto colpo!",
		critSpread: "  [POKEMON] subisce un brutto colpo!",
		immune: "  Non ha effetto su [POKEMON]...",
		immuneNoPokemon: "", // NOT CONVERTED: not in Champions
		immuneOHKO: "  [POKEMON] è incolume!",
		miss: "  [POKEMON] evita l’attacco!",
		missNoPokemon: "", // NOT CONVERTED: not in Champions

		center: "  Centramento!",
		noTarget: "", // NOT CONVERTED: not in Champions
		ohko: "  È un colpo da KO!",
		combine: "  Formidabile! Due mosse che diventano una! È una mossa combinata!",
		hitCount: "  Colpi inflitti: [NUMBER]!",
		hitCountSingular: "  Colpi inflitti: 1!",
	},

	// stats
	hp: {
		statName: "PS",
		statShortName: "PS",
	},
	atk: {
		statName: "Attacco",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	def: {
		statName: "Difesa",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spa: {
		statName: "Attacco Speciale",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spd: {
		statName: "Difesa Speciale",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spe: {
		statName: "Velocità",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	accuracy: {
		statName: "precisione",
	},
	evasion: {
		statName: "elusione",
	},
	spc: {
		statName: "", // NOT CONVERTED: not in Champions
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	stats: {
		statName: "Statistiche",
	},

	// statuses
	brn: {
		start: "  [POKEMON] è stato scottato!",
		startFromItem: "  [POKEMON] è stato scottato d[ITEM]!",
		alreadyStarted: "  [POKEMON] è già scottato.",
		end: "", // NOT CONVERTED: not in Champions
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "  [POKEMON] soffre per la scottatura!",
	},
	frz: {
		start: "  [POKEMON] è stato congelato!",
		alreadyStarted: "  [POKEMON] è già congelato.",
		end: "  [POKEMON] non è più congelato!",
		endFromItem: "  [POKEMON] si è scongelato grazie [ITEM]!",
		endFromMove: "  [MOVE] di [POKEMON] scioglie il ghiaccio!",
		cant: "[POKEMON] è congelato! Non può agire!",
	},
	par: {
		start: "  [POKEMON] è stato paralizzato! Forse non riuscirà ad agire!",
		alreadyStarted: "  [POKEMON] è già paralizzato!",
		end: "  [POKEMON] guarisce dalla paralisi!",
		endFromItem: "  [POKEMON] guarisce dalla paralisi grazie [ITEM]!",
		cant: "", // NOT CONVERTED: not in Champions
	},
	psn: {
		start: "  [POKEMON] è stato avvelenato!",
		alreadyStarted: "  [POKEMON] è già avvelenato.",
		end: "  [POKEMON] guarisce dall’avvelenamento!",
		endFromItem: "", // NOT CONVERTED: runtime grammar
		damage: "", // NOT CONVERTED: not in Champions
	},
	tox: {
		start: "  [POKEMON] è stato iperavvelenato!",
		startFromItem: "  [POKEMON] è stato iperavvelenato d[ITEM]!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] si è addormentato!",
		startFromRest: "", // NOT CONVERTED: not in Champions
		alreadyStarted: "  [POKEMON] sta già dormendo!",
		end: "  [POKEMON] si è svegliato!",
		endFromItem: "  [POKEMON] si è svegliato grazie [ITEM]!",
		cant: "[POKEMON] dorme.",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON] entra in stato di confusione!",
		startFromFatigue: "  [POKEMON] è confuso per la fatica!",
		end: "  [POKEMON] non è più confuso!",
		endFromItem: "  [POKEMON] si libera dalla confusione grazie [ITEM]!",
		alreadyStarted: "  [POKEMON] è già confuso!",
		activate: "  [POKEMON] è confuso!",
		damage: "È così confuso da colpirsi da solo!",
	},
	drain: {
		heal: "  Viene prelevata energia da [SOURCE]!",
	},
	flinch: {
		cant: "[POKEMON] tentenna! Non può agire!",
	},
	heal: {
		fail: "  [POKEMON] ha già tutti i PS!",
	},
	healreplacement: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	nopp: {
		cant: "", // NOT CONVERTED: not in Champions
	},
	recharge: {
		cant: "[POKEMON] deve ricaricarsi!",
	},
	recoil: {
		damage: "  [POKEMON] ha subito il contraccolpo!",
	},
	unboost: {
		fail: "  La diminuzione delle statistiche di [POKEMON] è stata evitata!",
		failSingular: "", // NOT CONVERTED: not in Champions
	},
	struggle: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	trapped: {
		start: "  [POKEMON] non può più scappare!",
	},
	dynamax: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "  La mossa è stata vanificata dalla potenza del fenomeno Dynamax!",
		fail: "  [POKEMON] scuote il capo. Sembra che non riesca a usare questa mossa...",
	},

	// weather
	sandstorm: {
		weatherName: "Tempesta di sabbia",
		start: "  Inizia una tempesta di sabbia!",
		end: "  La tempesta di sabbia cessa!",
		upkeep: "  (La tempesta di sabbia imperversa!)",
		damage: "  La tempesta di sabbia infligge danni [POKEMON]!",
	},
	sunnyday: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  La luce solare diventa intensa!",
		end: "  La luce solare torna normale!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	raindance: {
		weatherName: "Pioggia",
		start: "  Inizia a piovere!",
		end: "  Smette di piovere!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	hail: {
		weatherName: "Grandine",
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	snowscape: {
		weatherName: "Neve",
		start: "  Inizia a nevicare!",
		end: "  Smette di nevicare!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	desolateland: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  La luce solare diventa accecante!",
		end: "", // NOT CONVERTED: not in Champions
		block: "  La luce accecante non si attenua!",
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	primordialsea: {
		weatherName: "Acquazzone",
		start: "  È scoppiato un acquazzone!",
		end: "  Smette di piovere!",
		block: "  L’acquazzone non si placa!",
		blockMove: "  L’acquazzone neutralizza le mosse di tipo Fuoco!",
	},
	deltastream: {
		weatherName: "Vento misterioso",
		start: "  Una corrente d’aria misteriosa protegge i Pokémon di tipo Volante!",
		end: "  La corrente d’aria misteriosa si placa!",
		activate: "  La corrente misteriosa indebolisce l’attacco!",
		block: "  La corrente misteriosa non si placa!",
	},

	// terrain
	electricterrain: {
		start: "  Ai piedi dei Pokémon si accumula dell’elettricità.",
		end: "  L’elettricità svanisce.",
		block: "  Il Campo Elettrico protegge [POKEMON]!",
	},
	grassyterrain: {
		start: "  Ai piedi dei Pokémon cresce rigogliosa l’erba.",
		end: "  L’erba sparisce.",
		heal: "", // NOT CONVERTED: not in Champions
	},
	mistyterrain: {
		start: "  Ai piedi dei Pokémon si addensa la nebbia.",
		end: "  La nebbia si dissolve.",
		block: "  Il Campo Nebbioso protegge [POKEMON]!",
	},
	psychicterrain: {
		start: "  Nel campo si avverte una strana sensazione...",
		end: "  La strana sensazione nel campo è svanita!",
		block: "  Il Campo Psichico protegge [POKEMON]!",
	},

	// field effects
	gravity: {
		start: "  La gravità si intensifica!",
		end: "  La gravità torna normale!",
		cant: "L’aumento di gravità impedisce [POKEMON] di usare [MOVE]!",
		activate: "[POKEMON] non riesce a rimanere in aria a causa della gravità alterata!",
	},
	magicroom: {
		start: "  È stata creata una nuova dimensione in cui gli strumenti dati ai Pokémon non hanno effetto!",
		end: "  La nuova dimensione svanisce e gli strumenti tornano ad avere effetto!",
	},
	mudsport: {
		start: "  La potenza delle mosse di tipo Elettro diminuisce!",
		end: "  L’effetto di Fangata è svanito!",
	},
	trickroom: {
		start: "  [POKEMON] crea una dimensione distorta!",
		end: "  La dimensione distorta torna alla normalità!",
	},
	watersport: {
		start: "  La potenza delle mosse di tipo Fuoco diminuisce!",
		end: "  L’effetto di Docciascudo è svanito!",
	},
	wonderroom: {
		start: "  È stata creata una nuova dimensione in cui Difesa e Difesa Speciale vengono scambiate!",
		end: "  La nuova dimensione svanisce: Difesa e Difesa Speciale tornano alla normalità!",
	},

	// misc
	crash: {
		damage: "  [POKEMON] si sbilancia e si schianta!",
	},
};
