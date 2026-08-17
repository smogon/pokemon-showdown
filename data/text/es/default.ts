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

		turn: "", // NOT CONVERTED: not in Champions
		switchIn: "¡[TRAINER] saca a [FULLNAME]!",
		switchInOwn: "¡Adelante, [FULLNAME]!",
		switchOut: "¡[TRAINER] retira a [NICKNAME] del combate!",
		switchOutOwn: "¡[NICKNAME], ven aquí!",
		drag: "¡[FULLNAME] ha sido arrastrado al combate!",
		faint: "¡[POKEMON] se ha debilitado!",
		swap: "¡[POKEMON] [TARGET] han intercambiado sus posiciones!",
		swapCenter: "", // NOT CONVERTED: not in Champions

		// Multi Battles only
		canDynamax: "", // NOT CONVERTED: not in Champions
		canDynamaxOwn: "", // NOT CONVERTED: not in Champions

		zEffect: "", // NOT CONVERTED: not in Champions
		move: "¡[POKEMON] ha usado **[MOVE]**!",
		abilityActivation: "[[ABILITY] de [POKEMON]]",

		mega: "", // NOT CONVERTED: not in Champions
		megaNoItem: "", // NOT CONVERTED: not in Champions
		megaGen6: "", // NOT CONVERTED: not in Champions
		transformMega: "¡[POKEMON] ha evolucionado a Mega-[SPECIES]!",
		primal: "", // NOT CONVERTED: not in Champions
		zPower: "", // NOT CONVERTED: not in Champions
		zBroken: "  ¡[POKEMON] no se ha podido proteger del ataque y ha recibido daño!",
		terastallize: "", // NOT CONVERTED: not in Champions

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "¡[POKEMON] no puede usar [MOVE]!",
		cantNoMove: "", // NOT CONVERTED: not in Champions
		fail: "  ¡Pero ha fallado!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "¡[POKEMON] se ha transformado!",
		typeChange: "  ¡[POKEMON] ha cambiado a tipo [TYPE]!",
		typeChangeFromEffect: "", // NOT CONVERTED: not in Champions
		typeAdd: "  ¡[POKEMON] ahora también es de tipo [TYPE]!",

		start: "", // NOT CONVERTED: not in Champions
		end: "  ¡[POKEMON] se ha liberado de [EFFECT]!",
		activate: "", // NOT CONVERTED: not in Champions
		startTeamEffect: "", // NOT CONVERTED: not in Champions
		endTeamEffect: "", // NOT CONVERTED: not in Champions
		startFieldEffect: "", // NOT CONVERTED: not in Champions
		endFieldEffect: "", // NOT CONVERTED: not in Champions

		changeAbility: "  ¡La habilidad de [POKEMON] ha cambiado a [ABILITY]!",
		addItem: "  ¡[POKEMON] ha obtenido [ITEM]!",
		takeItem: "  ¡[POKEMON] le ha robado [ITEM] a [SOURCE]!",
		eatItem: "", // NOT CONVERTED: not in Champions
		useGem: "  ¡[ITEM] refuerza la potencia de [MOVE]!",
		eatItemWeaken: "  ¡El daño a [POKEMON] ha sido atenuado por [ITEM]!",
		removeItem: "", // NOT CONVERTED: not in Champions
		activateItem: "", // NOT CONVERTED: not in Champions
		activateWeaken: "  ¡El daño a [POKEMON] ha sido atenuado por [ITEM]!",

		damage: "  (¡[POKEMON] ha resultado herido!)",
		damagePercentage: "", // NOT CONVERTED: not in Champions
		damageFromPokemon: "", // NOT CONVERTED: not in Champions
		damageFromItem: "", // NOT CONVERTED: not in Champions
		damageFromPartialTrapping: "  ¡[MOVE] ha herido a [POKEMON]!",
		heal: "  ¡[POKEMON] ha recuperado PS!",
		healFromZEffect: "", // NOT CONVERTED: not in Champions
		healFromEffect: "", // NOT CONVERTED: not in Champions

		boost: "  ¡[STAT] de [POKEMON] ha aumentado!",
		boost2: "  ¡[STAT] de [POKEMON] ha aumentado mucho!",
		boost3: "  ¡[STAT] de [POKEMON] ha aumentado muchísimo!",
		boost0: "  ¡[STAT] de [POKEMON] no puede aumentar más!",
		boostFromItem: "", // NOT CONVERTED: not in Champions
		boost2FromItem: "", // NOT CONVERTED: not in Champions
		boost3FromItem: "", // NOT CONVERTED: not in Champions
		boostFromZEffect: "", // NOT CONVERTED: not in Champions
		boost2FromZEffect: "", // NOT CONVERTED: not in Champions
		boost3FromZEffect: "", // NOT CONVERTED: not in Champions
		boostMultipleFromZEffect: "", // NOT CONVERTED: not in Champions

		unboost: "  ¡[STAT] de [POKEMON] ha disminuido!",
		unboost2: "  ¡[STAT] de [POKEMON] ha disminuido mucho!",
		unboost3: "  ¡[STAT] de [POKEMON] ha disminuido muchísimo!",
		unboost0: "  ¡[STAT] de [POKEMON] no puede disminuir más!",
		unboostFromItem: "", // NOT CONVERTED: not in Champions
		unboost2FromItem: "", // NOT CONVERTED: not in Champions
		unboost3FromItem: "", // NOT CONVERTED: not in Champions

		swapBoost: "", // NOT CONVERTED: not in Champions
		swapOffensiveBoost: "  ¡[POKEMON] ha intercambiado los cambios en el Ataque y el Ataque Especial con los del objetivo!",
		swapDefensiveBoost: "  ¡[POKEMON] ha intercambiado los cambios en la Defensa y la Defensa Especial con los del objetivo!",
		copyBoost: "  ¡[POKEMON] ha copiado los cambios en las características de [TARGET]!",
		clearBoost: "  ¡Las características de [POKEMON] han vuelto a sus valores originales!",
		clearBoostFromZEffect: "", // NOT CONVERTED: not in Champions
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
		immuneNoPokemon: "", // NOT CONVERTED: not in Champions
		immuneOHKO: "", // NOT CONVERTED: not in Champions
		miss: "  ¡[POKEMON] ha evitado el ataque!",
		missNoPokemon: "", // NOT CONVERTED: not in Champions

		center: "", // NOT CONVERTED: not in Champions
		noTarget: "", // NOT CONVERTED: not in Champions
		ohko: "  ¡Es un golpe fulminante!",
		combine: "", // NOT CONVERTED: not in Champions
		hitCount: "  N.º de golpes: [NUMBER].",
		hitCountSingular: "  N.º de golpes: 1.",
	},

	// stats
	hp: {
		statName: "PS",
		statShortName: "PS",
	},
	atk: {
		statName: "Ataque",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	def: {
		statName: "Defensa",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spa: {
		statName: "Ataque Especial",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spd: {
		statName: "Defensa Especial",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spe: {
		statName: "Velocidad",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	accuracy: {
		statName: "Precisión",
	},
	evasion: {
		statName: "Evasión",
	},
	spc: {
		statName: "", // NOT CONVERTED: not in Champions
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	stats: {
		statName: "Características",
	},

	// statuses
	brn: {
		start: "  ¡[POKEMON] se ha quemado!",
		startFromItem: "  ¡[POKEMON] se ha quemado con [ITEM]!",
		alreadyStarted: "  ¡[POKEMON] ya está quemado!",
		end: "", // NOT CONVERTED: not in Champions
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "  ¡[POKEMON] se resiente de las quemaduras!",
	},
	frz: {
		start: "  ¡[POKEMON] ha sido congelado!",
		alreadyStarted: "", // NOT CONVERTED: not in Champions
		end: "  ¡[POKEMON] ya no está congelado!",
		endFromItem: "  ¡[POKEMON] se ha descongelado gracias [ITEM]!",
		endFromMove: "  ¡[POKEMON] ha derretido el hielo con [MOVE]!",
		cant: "¡[POKEMON] está congelado! No se puede mover.",
	},
	par: {
		start: "  ¡[POKEMON] sufre parálisis! Quizá no se pueda mover.",
		alreadyStarted: "  ¡[POKEMON] ya está paralizado!",
		end: "  ¡[POKEMON] se ha curado de la parálisis!",
		endFromItem: "  ¡[POKEMON] ya no está paralizado gracias [ITEM]!",
		cant: "", // NOT CONVERTED: not in Champions
	},
	psn: {
		start: "  ¡[POKEMON] ha sido envenenado!",
		alreadyStarted: "  ¡[POKEMON] ya está envenenado!",
		end: "  ¡[POKEMON] ya no está envenenado!",
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	tox: {
		start: "  ¡[POKEMON] ha sido gravemente envenenado!",
		startFromItem: "  ¡[POKEMON] ha sido gravemente envenenado por [ITEM]!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  ¡[POKEMON] se ha dormido!",
		startFromRest: "", // NOT CONVERTED: not in Champions
		alreadyStarted: "  ¡[POKEMON] ya está dormido!",
		end: "  ¡[POKEMON] se ha despertado!",
		endFromItem: "  ¡[POKEMON] se ha despertado gracias [ITEM]!",
		cant: "¡[POKEMON] está dormido como un tronco!",
	},

	// misc effects
	confusion: {
		start: "  ¡[POKEMON] se ha quedado confuso!",
		startFromFatigue: "  ¡El cansancio ha terminado confundiendo a [POKEMON]!",
		end: "  ¡[POKEMON] ya no está confuso!",
		endFromItem: "  ¡[POKEMON] se ha librado de la confusión gracias [ITEM]!",
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
		activate: "", // NOT CONVERTED: not in Champions
	},
	nopp: {
		cant: "", // NOT CONVERTED: not in Champions
	},
	recharge: {
		cant: "¡[POKEMON] necesita recuperarse de su ataque!",
	},
	recoil: {
		damage: "  ¡[POKEMON] también se ha hecho daño!",
	},
	unboost: {
		fail: "  ¡Las características de [POKEMON] no han disminuido!",
		failSingular: "", // NOT CONVERTED: not in Champions
	},
	struggle: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	trapped: {
		start: "  ¡[POKEMON] ya no puede escapar!",
	},
	dynamax: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
		fail: "", // NOT CONVERTED: not in Champions
	},

	// weather
	sandstorm: {
		weatherName: "Tormenta de arena",
		start: "  ¡Se ha desatado una tormenta de arena!",
		end: "  ¡La tormenta de arena ha amainado!",
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "  ¡La tormenta de arena zarandea a [POKEMON]!",
	},
	sunnyday: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  ¡El sol pega fuerte!",
		end: "  ¡El sol vuelve a brillar como siempre!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	raindance: {
		weatherName: "Lluvia",
		start: "  ¡Ha empezado a llover!",
		end: "  ¡Ha dejado de llover!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	hail: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	snowscape: {
		weatherName: "Nieve",
		start: "  ¡Ha empezado a nevar!",
		end: "  ¡Ha dejado de nevar!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	desolateland: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	primordialsea: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	deltastream: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		activate: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
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
		heal: "", // NOT CONVERTED: not in Champions
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
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
	},
	trickroom: {
		start: "  ¡[POKEMON] ha alterado las dimensiones!",
		end: "  Se han restaurado las dimensiones alteradas.",
	},
	watersport: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
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
