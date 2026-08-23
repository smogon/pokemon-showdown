export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "¡El combate entre [TRAINER] y [TRAINER] ha comenzado!",
		winBattle: "¡**[TRAINER]** ha ganado el combate!",
		tieBattle: "¡El combate entre [TRAINER] y [TRAINER] ha terminado en empate!",

		pokemon: "[NICKNAME]",
		opposingPokemon: "el [NICKNAME] rival",
		team: "tu lado",
		opposingTeam: "el lado rival",
		party: "tu bando",
		opposingParty: "tus adversarios",

		turn: "== Turno [NUMBER] ==",
		switchIn: "¡[TRAINER:definite:capitalize] saca a [FULLNAME]!",
		switchInOwn: "¡Adelante, [FULLNAME]!",
		switchOut: "¡[TRAINER:definite:capitalize] retira a [NICKNAME] del combate!",
		switchOutOwn: "¡[NICKNAME], ven aquí!",
		drag: "¡[FULLNAME] ha sido arrastrado al combate!",
		faint: "¡[POKEMON] se ha debilitado!",
		swap: "¡[POKEMON] [TARGET:y] han intercambiado sus posiciones!",
		swapCenter: "¡[POKEMON] se ha desplazado al centro!",

		// Multi Battles only
		canDynamax: "  ¡[TRAINER] ya puede usar la energía Dinamax!",
		canDynamaxOwn: "  ¡La energía Dinamax rodea a [TRAINER]!",

		zEffect: "  ¡[POKEMON] despliega toda su fuerza para ejecutar un movimiento Z!",
		move: "¡[POKEMON] ha usado **[MOVE]**!",
		abilityActivation: "[[ABILITY] de [POKEMON]]",

		mega: "  ¡[ITEM:definite:capitalize] de [POKEMON] está reaccionando a la Piedra Activadora de [TRAINER]!",
		megaNoItem: "  ¡[POKEMON] está reaccionando a la Piedra Activadora de [TRAINER]!",
		megaGen6: "  ¡[ITEM:definite:capitalize] de [POKEMON] reacciona a la Megapulsera de [TRAINER]!",
		transformMega: "¡[POKEMON] ha evolucionado a Mega-[SPECIES]!",
		primal: "¡[POKEMON] ha experimentado una Regresión Primigenia y ha recobrado su apariencia primitiva!",
		zPower: "  ¡[POKEMON] se envuelve en un halo de Poder Z!",
		zBroken: "  ¡[POKEMON] no se ha podido proteger del ataque y ha recibido daño!",
		terastallize: "", // NEEDS TRANSLATION: Showdown custom text

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "¡[POKEMON] no puede usar [MOVE]!",
		cantNoMove: "¡[POKEMON] no se mueve!",
		fail: "  ¡Pero ha fallado!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "¡[POKEMON] se ha transformado!",
		typeChange: "  ¡[POKEMON] ha cambiado a tipo [TYPE]!",
		typeChangeFromEffect: "  ¡[EFFECT] de [POKEMON] lo convirtió en el tipo [TYPE]!",
		typeAdd: "  ¡[POKEMON] ahora también es de tipo [TYPE]!",

		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "  ¡[POKEMON] se ha liberado de [EFFECT]!",
		activate: "", // NEEDS TRANSLATION: Showdown custom text
		startTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		startFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text

		changeAbility: "  ¡La habilidad de [POKEMON] ha cambiado a [ABILITY]!",
		addItem: "  ¡[POKEMON] ha obtenido [ITEM:indefinite:classified]!",
		takeItem: "  ¡[POKEMON] le ha robado [ITEM:indefinite:classified] a [SOURCE]!",
		eatItem: "", // NEEDS TRANSLATION: Showdown custom text
		useGem: "  ¡[ITEM:definite:capitalize:classified] refuerza[INFLECT:ITEM:s=:p=n] la potencia de [MOVE]!",
		eatItemWeaken: "  ¡El daño a [POKEMON] ha sido atenuado por [ITEM:definite:classified]!",
		removeItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateWeaken: "  ¡El daño a [POKEMON] ha sido atenuado por [ITEM:definite:classified]!",

		damage: "  (¡[POKEMON] ha resultado herido!)",
		damagePercentage: "", // NEEDS TRANSLATION: Showdown custom text
		damageFromPokemon: "  ¡[POKEMON] ha resultado herido por [ITEM:definite] de [SOURCE]!",
		damageFromItem: "  ¡[POKEMON] ha resultado dañado por [ITEM:definite]!",
		damageFromPartialTrapping: "  ¡[MOVE] ha herido a [POKEMON]!",
		heal: "  ¡[POKEMON] ha recuperado PS!",
		healFromZEffect: "  ¡[POKEMON] ha recobrado la salud gracias al Poder Z!",
		healFromEffect: "  ¡[POKEMON] restauró PS usando su [EFFECT]!",

		boost: "  ¡[STAT:definite:capitalize] de [POKEMON] ha aumentado!",
		boost2: "  ¡[STAT:definite:capitalize] de [POKEMON] ha aumentado mucho!",
		boost3: "  ¡[STAT:definite:capitalize] de [POKEMON] ha aumentado muchísimo!",
		boost0: "  ¡[STAT:definite:capitalize] de [POKEMON] no puede aumentar más!",
		boostFromItem: "  ¡[STAT] de [POKEMON] subió con [ITEM]!",
		boost2FromItem: "  ¡[STAT] de [POKEMON] subió mucho con [ITEM]!",
		boost3FromItem: "  ¡[STAT:definite:capitalize] de [POKEMON] ha aumentado muchísimo gracias [ITEM:a:definite]!",
		boostFromZEffect: "  ¡[STAT:definite:capitalize] de [POKEMON] ha aumentado gracias al Poder Z!",
		boost2FromZEffect: "  ¡[STAT:definite:capitalize] de [POKEMON] ha aumentado mucho gracias al Poder Z!",
		boost3FromZEffect: "  ¡[STAT:definite:capitalize] de [POKEMON] ha aumentado muchísimo gracias al Poder Z!",
		boostMultipleFromZEffect: "  ¡Varias características de [POKEMON] han aumentado gracias al Poder Z!",

		unboost: "  ¡[STAT:definite:capitalize] de [POKEMON] ha disminuido!",
		unboost2: "  ¡[STAT:definite:capitalize] de [POKEMON] ha disminuido mucho!",
		unboost3: "  ¡[STAT:definite:capitalize] de [POKEMON] ha disminuido muchísimo!",
		unboost0: "  ¡[STAT:definite:capitalize] de [POKEMON] no puede disminuir más!",
		unboostFromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost2FromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost3FromItem: "", // NEEDS TRANSLATION: Showdown custom text

		swapBoost: "  ¡[POKEMON] ha intercambiado los cambios en sus características con el objetivo!",
		swapOffensiveBoost: "  ¡[POKEMON] ha intercambiado los cambios en el Ataque y el Ataque Especial con los del objetivo!",
		swapDefensiveBoost: "  ¡[POKEMON] ha intercambiado los cambios en la Defensa y la Defensa Especial con los del objetivo!",
		copyBoost: "  ¡[POKEMON] ha copiado los cambios en las características de [TARGET]!",
		clearBoost: "  ¡Las características de [POKEMON] han vuelto a sus valores originales!",
		clearBoostFromZEffect: "  ¡Las características de [POKEMON] que habían disminuido han vuelto a sus valores originales gracias al Poder Z!",
		invertBoost: "  ¡Se han invertido los cambios en las características de [POKEMON]!",
		clearAllBoost: "  ¡Se han eliminado todos los cambios en las características!",

		superEffective: "  ¡Es supereficaz!",
		superEffectiveSpread: "  ¡Es supereficaz contra [POKEMON]!",
		resisted: "  Es poco eficaz...",
		resistedSpread: "  Es poco eficaz contra [POKEMON]...",
		extremelyEffective: "  ¡Es hipereficaz!",
		extremelyEffectiveSpread: "  ¡Es hipereficaz contra [POKEMON]!",
		mostlyIneffective: "  Es muy poco eficaz...",
		mostlyIneffectiveSpread: "  Es muy poco eficaz contra [POKEMON]...",
		crit: "  ¡Un golpe crítico!",
		critSpread: "  ¡[POKEMON] ha recibido un golpe crítico!",
		immune: "  No afecta a [POKEMON]...",
		immuneNoPokemon: "  ¡Pero no ha surtido efecto!",
		immuneOHKO: "  ¡No ha afectado a [POKEMON]!",
		miss: "  ¡[POKEMON] ha evitado el ataque!",
		missNoPokemon: "  ¡El ataque de [SOURCE] falló!",

		center: "  Centrando Pokémon",
		noTarget: "  Pero no había objetivo...",
		ohko: "  ¡Es un golpe fulminante!",
		combine: "  ¡Los dos movimientos se han unido! ¡Es un movimiento combinado!",
		hitCount: "  N.º de golpes: [NUMBER].",
	},

	// stats
	hp: {
		statName: "PS",
		statShortName: "PS",
	},
	atk: {
		statName: "Ataque",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	def: {
		statName: "Defensa",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spa: {
		statName: "Ataque Especial",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spd: {
		statName: "Defensa Especial",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spe: {
		statName: "Velocidad",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	accuracy: {
		statName: "Precisión",
		grammar: "fs",
	},
	evasion: {
		statName: "Evasión",
		grammar: "fs",
	},
	spc: {
		statName: "Especial",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	stats: {
		statName: "Características",
		grammar: "fp",
	},

	// statuses
	brn: {
		start: "  ¡[POKEMON] se ha quemado!",
		startFromItem: "  ¡[POKEMON] se ha quemado con [ITEM:definite:classified]!",
		alreadyStarted: "  ¡[POKEMON] ya está quemado!",
		end: "  ¡[POKEMON] ya no tiene quemaduras!",
		endFromItem: "  ¡[POKEMON] ha curado sus quemaduras con [ITEM:definite]!",
		damage: "  ¡[POKEMON] se resiente de las quemaduras!",
	},
	frz: {
		start: "  ¡[POKEMON] ha sido congelado!",
		alreadyStarted: "  ¡[POKEMON] ya está congelado!",
		end: "  ¡[POKEMON] ya no está congelado!",
		endFromItem: "  ¡[POKEMON] se ha descongelado gracias [ITEM:a:definite:classified]!",
		endFromMove: "  ¡[POKEMON] ha derretido el hielo con [MOVE]!",
		cant: "¡[POKEMON] está congelado! No se puede mover.",
	},
	par: {
		start: "  ¡[POKEMON] sufre parálisis! Quizá no se pueda mover.",
		alreadyStarted: "  ¡[POKEMON] ya está paralizado!",
		end: "  ¡[POKEMON] se ha curado de la parálisis!",
		endFromItem: "  ¡[POKEMON] ya no está paralizado gracias [ITEM:a:definite:classified]!",
		cant: "¡[POKEMON] está paralizado! No se puede mover.",
	},
	psn: {
		start: "  ¡[POKEMON] ha sido envenenado!",
		alreadyStarted: "  ¡[POKEMON] ya está envenenado!",
		end: "  ¡[POKEMON] ya no está envenenado!",
		endFromItem: "  ¡[POKEMON] ya no está envenenado gracias [ITEM:a:definite]!",
		damage: "  ¡El veneno resta PS a [POKEMON]!",
	},
	tox: {
		start: "  ¡[POKEMON] ha sido gravemente envenenado!",
		startFromItem: "  ¡[POKEMON] ha sido gravemente envenenado por [ITEM:definite:classified]!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  ¡[POKEMON] se ha dormido!",
		startFromRest: "  ¡[POKEMON] se ha recuperado tras dormir un poco!",
		alreadyStarted: "  ¡[POKEMON] ya está dormido!",
		end: "  ¡[POKEMON] se ha despertado!",
		endFromItem: "  ¡[POKEMON] se ha despertado gracias [ITEM:a:definite:classified]!",
		cant: "¡[POKEMON] está dormido como un tronco!",
	},

	// misc effects
	confusion: {
		start: "  ¡[POKEMON] se ha quedado confuso!",
		startFromFatigue: "  ¡El cansancio ha terminado confundiendo a [POKEMON]!",
		end: "  ¡[POKEMON] ya no está confuso!",
		endFromItem: "  ¡[POKEMON] se ha librado de la confusión gracias [ITEM:a:definite:classified]!",
		alreadyStarted: "  ¡[POKEMON] ya está confuso!",
		activate: "  ¡[POKEMON] está confuso!",
		damage: "¡Está tan confuso que se ha herido a sí mismo!",
	},
	drain: {
		heal: "  ¡La energía de [SOURCE] ha sido absorbida!",
	},
	flinch: {
		cant: "¡[POKEMON] se ha amedrentado y no puede lanzar ningún ataque!",
	},
	heal: {
		fail: "  ¡Los PS de [POKEMON] están al máximo!",
	},
	healreplacement: {
		activate: "  ¡[POKEMON] restaurará la salud de su relevo gracias al Poder Z!",
	},
	nopp: {
		cant: "¡[POKEMON] ha usado **[MOVE]**!\n  ¡Pero no le quedan más PP para ejecutar ese movimiento!",
	},
	recharge: {
		cant: "¡[POKEMON] necesita recuperarse de su ataque!",
	},
	recoil: {
		damage: "  ¡[POKEMON] también se ha hecho daño!",
	},
	unboost: {
		fail: "  ¡Las características de [POKEMON] no han disminuido!",
	},
	struggle: {
		activate: "  ¡A [POKEMON] no le quedan más movimientos!",
	},
	trapped: {
		start: "  ¡[POKEMON] ya no puede escapar!",
	},
	dynamax: {
		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "", // NEEDS TRANSLATION: Showdown custom text
		block: "  ¡La energía Dinamax ha bloqueado el movimiento!",
		fail: "  [POKEMON] ha negado con la cabeza. Parece que no puede usar ese movimiento.",
	},

	// weather
	sandstorm: {
		weatherName: "Tormenta de arena",
		start: "  ¡Se ha desatado una tormenta de arena!",
		end: "  ¡La tormenta de arena ha amainado!",
		upkeep: "  (La tormenta de arena arrecia...)",
		damage: "  ¡La tormenta de arena zarandea a [POKEMON]!",
	},
	sunnyday: {
		weatherName: "Sol",
		start: "  ¡El sol pega fuerte!",
		end: "  ¡El sol vuelve a brillar como siempre!",
		upkeep: "  (Hace mucho sol...)",
	},
	raindance: {
		weatherName: "Lluvia",
		start: "  ¡Ha empezado a llover!",
		end: "  ¡Ha dejado de llover!",
		upkeep: "  (Sigue lloviendo...)",
	},
	hail: {
		weatherName: "Granizo",
		start: "  ¡Ha empezado a granizar!",
		end: "  ¡Ha dejado de granizar!",
		upkeep: "  (¡El granizo cae con violencia!)",
		damage: "  ¡El granizo golpea a [POKEMON]!",
	},
	snowscape: {
		weatherName: "Nieve",
		start: "  ¡Ha empezado a nevar!",
		end: "  ¡Ha dejado de nevar!",
		upkeep: "  (¡La nevada cae con fuerza!)",
	},
	desolateland: {
		weatherName: "Sol abrasador",
		start: "  ¡El sol que hace ahora es realmente abrasador!",
		end: "  ¡El sol vuelve a brillar como siempre!",
		block: "  ¡El calor abrasador se mantiene sin perder un ápice de intensidad!",
		blockMove: "  El sol brilla con tanta intensidad que el agua se evapora, lo que afecta a los movimientos de tipo Agua.",
	},
	primordialsea: {
		weatherName: "Diluvio",
		start: "  ¡Ha empezado a diluviar!",
		end: "  Ha dejado de diluviar.",
		block: "  ¡No parece que vaya a dejar de diluviar!",
		blockMove: "  ¡El diluvio impide todos los ataques de tipo Fuego!",
	},
	deltastream: {
		weatherName: "Turbulencias",
		start: "  ¡Las misteriosas turbulencias protegen a los Pokémon de tipo Volador!",
		end: "  Las misteriosas turbulencias han amainado.",
		activate: "  ¡Las misteriosas turbulencias atenúan el ataque!",
		block: "  ¡Las misteriosas turbulencias continúan sin cesar!",
	},

	// terrain
	electricterrain: {
		start: "  ¡Se ha formado un campo de corriente eléctrica en el terreno de combate!",
		end: "  El campo de corriente eléctrica ha desaparecido.",
		block: "  ¡El campo eléctrico ha protegido a [POKEMON]!",
	},
	grassyterrain: {
		start: "  ¡El terreno de combate se ha cubierto de hierba!",
		end: "  La hierba ha desaparecido.",
		heal: "  ¡[POKEMON] ha recuperado PS!",
	},
	mistyterrain: {
		start: "  ¡La niebla ha envuelto el terreno de combate!",
		end: "  La niebla se ha disipado.",
		block: "  ¡El campo de niebla ha protegido a [POKEMON]!",
	},
	psychicterrain: {
		start: "  ¡El terreno de combate se ha vuelto muy extraño!",
		end: "  Ha desaparecido la extraña sensación que se percibía en el terreno de combate.",
		block: "  ¡El campo psíquico ha protegido a [POKEMON]!",
	},

	// field effects
	gravity: {
		start: "  ¡La gravedad se ha incrementado!",
		end: "  La gravedad ha vuelto a su estado normal.",
		cant: "¡[POKEMON] no puede usar [MOVE] debido a la fuerza de la gravedad!",
		activate: "¡[POKEMON] no ha podido mantenerse en el aire debido al efecto de la gravedad!",
	},
	magicroom: {
		start: "  ¡Se ha creado un espacio en el que todos los objetos de los Pokémon quedan inutilizados!",
		end: "  Los efectos de Zona Mágica sobre los objetos de los Pokémon han desaparecido.",
	},
	mudsport: {
		start: "  ¡La potencia de los movimientos de tipo Eléctrico ha disminuido!",
		end: "  Chapoteo Lodo ha dejado de surtir efecto.",
	},
	trickroom: {
		start: "  ¡[POKEMON] ha alterado las dimensiones!",
		end: "  Se han restaurado las dimensiones alteradas.",
	},
	watersport: {
		start: "  ¡La potencia de los movimientos de tipo Fuego ha disminuido!",
		end: "  Hidrochorro ha dejado de surtir efecto.",
	},
	wonderroom: {
		start: "  ¡Se ha creado un espacio en el que la Defensa y la Defensa Especial se invierten!",
		end: "  Los efectos de Zona Extraña sobre la Defensa y la Defensa Especial han desaparecido.",
	},

	// misc
	crash: {
		damage: "  ¡[POKEMON] ha fallado y se ha caído al suelo!",
	},
};
