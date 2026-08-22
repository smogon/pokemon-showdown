export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NEEDS TRANSLATION: Showdown custom text
		winBattle: "", // NEEDS TRANSLATION: Showdown custom text
		tieBattle: "", // NEEDS TRANSLATION: Showdown custom text

		pokemon: "[NICKNAME]",
		opposingPokemon: "[NICKNAME] avversario",
		team: "la tua squadra",
		opposingTeam: "la squadra avversaria",
		party: "i Pokémon alleati",
		opposingParty: "i Pokémon nemici",

		turn: "== [NUMBER] turn[INFLECT:NUMBER:s=o:p=i] ==",
		switchIn: "[TRAINER:definite:capitalize] manda in campo [FULLNAME]!",
		switchInOwn: "Avanti, [FULLNAME]!",
		switchOut: "[TRAINER:definite:capitalize] ritira [NICKNAME] dalla lotta!",
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

		mega: "  [ITEM:definite:capitalize] di [POKEMON] reagisce alla Pietrachiave di [TRAINER]!",
		megaNoItem: "  [POKEMON] reagisce alla Pietrachiave di [TRAINER]!",
		megaGen6: "  [ITEM:definite:capitalize] di [POKEMON] reagisce al Megabracciale di [TRAINER]!",
		transformMega: "[POKEMON] si evolve in Mega[SPECIES]!",
		primal: "[POKEMON] si è archeorisvegliato! È tornato alla sua forma originaria!",
		zPower: "  Il Potere Z circonda [POKEMON] come un’aura!",
		zBroken: "  La protezione fallisce! [POKEMON] subisce dei danni!",
		terastallize: "", // NEEDS TRANSLATION: Showdown custom text

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] non può usare [MOVE]!",
		cantNoMove: "[POKEMON] è immobilizzato!",
		fail: "  Ma fallisce!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] si è trasformato!",
		typeChange: "  [POKEMON] è diventato di tipo [TYPE]!",
		typeChangeFromEffect: "  [EFFECT] di [POKEMON] lo ha reso di tipo [TYPE]!",
		typeAdd: "  Adesso [POKEMON] è anche di tipo [TYPE]!",

		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "  [POKEMON] si è liberato da [EFFECT]!",
		activate: "", // NEEDS TRANSLATION: Showdown custom text
		startTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		startFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text

		changeAbility: "  L’abilità di [POKEMON] è ora [ABILITY]!",
		addItem: "  [POKEMON] ottiene [ITEM:indefinite:classified]!",
		takeItem: "  [POKEMON] ruba [ITEM:definite:classified] di [SOURCE]!",
		eatItem: "", // NEEDS TRANSLATION: Showdown custom text
		useGem: "  [ITEM:definite:capitalize:classified] incrementa la potenza di [MOVE]!",
		eatItemWeaken: "  I danni inflitti [POKEMON:a] vengono ridotti d[ITEM:a:definite:classified]!",
		removeItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateWeaken: "  I danni inflitti [POKEMON:a] vengono ridotti d[ITEM:a:definite:classified]!",

		damage: "  ([POKEMON] è ferito!)",
		damagePercentage: "", // NEEDS TRANSLATION: Showdown custom text
		damageFromPokemon: "  [ITEM:definite:capitalize] di [SOURCE] ferisc[INFLECT:ITEM:s=e:p=ono] [POKEMON]!",
		damageFromItem: "  [POKEMON] subisce dei danni a causa [ITEM:di:definite]!",
		damageFromPartialTrapping: "  [POKEMON] subisce i danni della mossa [MOVE]!",
		heal: "  [POKEMON] ha recuperato dei PS!",
		healFromZEffect: "  Il Potere Z fa recuperare PS [POKEMON:a]!",
		healFromEffect: "  [POKEMON] ricarica PS usando [EFFECT]!",

		boost: "  [STAT:definite:capitalize] di [POKEMON] aumenta!",
		boost2: "  [STAT:definite:capitalize] di [POKEMON] aumenta di molto!",
		boost3: "  [STAT:definite:capitalize] di [POKEMON] aumenta di moltissimo!",
		boost0: "  [STAT:definite:capitalize] di [POKEMON] non può aumentare di più!",
		boostFromItem: "  Con [ITEM], [STAT] di [POKEMON] sale!",
		boost2FromItem: "  Con [ITEM], [STAT] di [POKEMON] sale di molto!",
		boost3FromItem: "  [STAT:definite:capitalize] di [POKEMON] aumenta moltissimo grazie [ITEM:a:definite]!",
		boostFromZEffect: "  [STAT:definite:capitalize] di [POKEMON] aumenta grazie al Potere Z!",
		boost2FromZEffect: "  [STAT:definite:capitalize] di [POKEMON] aumenta di molto grazie al Potere Z!",
		boost3FromZEffect: "  [STAT:definite:capitalize] di [POKEMON] aumenta moltissimo grazie al Potere Z!",
		boostMultipleFromZEffect: "  Le statistiche di [POKEMON] aumentano grazie al Potere Z!",

		unboost: "  [STAT:definite:capitalize] di [POKEMON] diminuisce!",
		unboost2: "  [STAT:definite:capitalize] di [POKEMON] diminuisce di molto!",
		unboost3: "  [STAT:definite:capitalize] di [POKEMON] cala drasticamente!",
		unboost0: "  [STAT:definite:capitalize] di [POKEMON] non può diminuire di più!",
		unboostFromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost2FromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost3FromItem: "", // NEEDS TRANSLATION: Showdown custom text

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
		immuneNoPokemon: "  Ma è inefficace!",
		immuneOHKO: "  [POKEMON] è incolume!",
		miss: "  [POKEMON] evita l’attacco!",
		missNoPokemon: "  L'attacco di [SOURCE] fallisce!",

		center: "  Centramento!",
		noTarget: "  Ma il Pokémon non c'è...",
		ohko: "  È un colpo da KO!",
		combine: "  Formidabile! Due mosse che diventano una! È una mossa combinata!",
		hitCount: "  Colpi inflitti: [NUMBER]!",
	},

	// stats
	hp: {
		statName: "PS",
		statShortName: "PS",
	},
	atk: {
		statName: "Attacco",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	def: {
		statName: "Difesa",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spa: {
		statName: "Attacco Speciale",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spd: {
		statName: "Difesa Speciale",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spe: {
		statName: "Velocità",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	accuracy: {
		statName: "precisione",
		grammar: "fs",
	},
	evasion: {
		statName: "elusione",
		grammar: "fs",
	},
	spc: {
		statName: "Speciale",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	stats: {
		statName: "Statistiche",
		grammar: "fp",
	},

	// statuses
	brn: {
		start: "  [POKEMON] è stato scottato!",
		startFromItem: "  [POKEMON] è stato scottato d[ITEM:a:definite:classified]!",
		alreadyStarted: "  [POKEMON] è già scottato.",
		end: "  [POKEMON] guarisce dalla scottatura!",
		endFromItem: "  [POKEMON] guarisce dalla scottatura grazie [ITEM:a:definite]!",
		damage: "  [POKEMON] soffre per la scottatura!",
	},
	frz: {
		start: "  [POKEMON] è stato congelato!",
		alreadyStarted: "  [POKEMON] è già congelato.",
		end: "  [POKEMON] non è più congelato!",
		endFromItem: "  [POKEMON] si è scongelato grazie [ITEM:a:definite:classified]!",
		endFromMove: "  [MOVE] di [POKEMON] scioglie il ghiaccio!",
		cant: "[POKEMON] è congelato! Non può agire!",
	},
	par: {
		start: "  [POKEMON] è stato paralizzato! Forse non riuscirà ad agire!",
		alreadyStarted: "  [POKEMON] è già paralizzato!",
		end: "  [POKEMON] guarisce dalla paralisi!",
		endFromItem: "  [POKEMON] guarisce dalla paralisi grazie [ITEM:a:definite:classified]!",
		cant: "[POKEMON] è paralizzato! Non può agire!",
	},
	psn: {
		start: "  [POKEMON] è stato avvelenato!",
		alreadyStarted: "  [POKEMON] è già avvelenato.",
		end: "  [POKEMON] guarisce dall’avvelenamento!",
		endFromItem: "  [POKEMON] guarisce dall’avvelenamento grazie [ITEM:a:definite]!",
		damage: "  Il veleno ha effetto su [POKEMON]!",
	},
	tox: {
		start: "  [POKEMON] è stato iperavvelenato!",
		startFromItem: "  [POKEMON] è stato iperavvelenato d[ITEM:a:definite:classified]!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] si è addormentato!",
		startFromRest: "  [POKEMON] ha recuperato le energie durante il sonno!",
		alreadyStarted: "  [POKEMON] sta già dormendo!",
		end: "  [POKEMON] si è svegliato!",
		endFromItem: "  [POKEMON] si è svegliato grazie [ITEM:a:definite:classified]!",
		cant: "[POKEMON] dorme.",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON] entra in stato di confusione!",
		startFromFatigue: "  [POKEMON] è confuso per la fatica!",
		end: "  [POKEMON] non è più confuso!",
		endFromItem: "  [POKEMON] si libera dalla confusione grazie [ITEM:a:definite:classified]!",
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
		activate: "  [POKEMON] fa recuperare PS al Pokémon che entra in campo grazie al Potere Z!",
	},
	nopp: {
		cant: "[POKEMON] usa **[MOVE]**!\n  Ma non ha PP per sferrare la mossa!",
	},
	recharge: {
		cant: "[POKEMON] deve ricaricarsi!",
	},
	recoil: {
		damage: "  [POKEMON] ha subito il contraccolpo!",
	},
	unboost: {
		fail: "  La diminuzione delle statistiche di [POKEMON] è stata evitata!",
	},
	struggle: {
		activate: "  [POKEMON] non ha più mosse da sferrare!",
	},
	trapped: {
		start: "  [POKEMON] non può più scappare!",
	},
	dynamax: {
		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "", // NEEDS TRANSLATION: Showdown custom text
		block: "  La mossa è stata vanificata dalla potenza del fenomeno Dynamax!",
		fail: "  [POKEMON] scuote il capo. Sembra che non riesca a usare questa mossa...",
	},

	// weather
	sandstorm: {
		weatherName: "Tempesta di sabbia",
		start: "  Inizia una tempesta di sabbia!",
		end: "  La tempesta di sabbia cessa!",
		upkeep: "  (La tempesta di sabbia imperversa!)",
		damage: "  La tempesta di sabbia infligge danni [POKEMON:a]!",
	},
	sunnyday: {
		weatherName: "Sole intenso",
		start: "  La luce solare diventa intensa!",
		end: "  La luce solare torna normale!",
		upkeep: "  (La luce solare è fortissima!)",
	},
	raindance: {
		weatherName: "Pioggia",
		start: "  Inizia a piovere!",
		end: "  Smette di piovere!",
		upkeep: "  (Continua a piovere.)",
	},
	hail: {
		weatherName: "Grandine",
		start: "  Inizia a grandinare!",
		end: "  Smette di grandinare!",
		upkeep: "  (La grandine imperversa!)",
		damage: "  La grandine infligge danni a [POKEMON]!",
	},
	snowscape: {
		weatherName: "Neve",
		start: "  Inizia a nevicare!",
		end: "  Smette di nevicare!",
		upkeep: "  (La neve imperversa!)",
	},
	desolateland: {
		weatherName: "Sole accecante",
		start: "  La luce solare diventa accecante!",
		end: "  La luce solare torna normale!",
		block: "  La luce accecante non si attenua!",
		blockMove: "  La luce solare accecante neutralizza le mosse di tipo Acqua!",
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
		heal: "  [POKEMON] ha recuperato dei PS!",
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
		cant: "L’aumento di gravità impedisce [POKEMON:a] di usare [MOVE]!",
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
