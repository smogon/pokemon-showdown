export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NOT CONVERTED: not in Champions
		winBattle: "", // NOT CONVERTED: not in Champions
		tieBattle: "", // NOT CONVERTED: not in Champions

		pokemon: "[NICKNAME]",
		opposingPokemon: "[NICKNAME] ennemi",
		team: "votre équipe",
		opposingTeam: "l’équipe ennemie",
		party: "les alliés",
		opposingParty: "l’équipe ennemie",

		turn: "", // NOT CONVERTED: not in Champions
		switchIn: "[TRAINER] envoie [FULLNAME] !",
		switchInOwn: "[FULLNAME] ! Go !",
		switchOut: "[TRAINER] retire [NICKNAME] !",
		switchOutOwn: "Reviens, [NICKNAME] !",
		drag: "[FULLNAME] est traîné de force au combat !",
		faint: "[POKEMON] est K.O. !",
		swap: "[POKEMON] et [TARGET] échangent leur place !",
		swapCenter: "", // NOT CONVERTED: not in Champions

		// Multi Battles only
		canDynamax: "", // NOT CONVERTED: not in Champions
		canDynamaxOwn: "", // NOT CONVERTED: not in Champions

		zEffect: "", // NOT CONVERTED: not in Champions
		move: "[POKEMON] utilise **[MOVE]** !",
		abilityActivation: "[[ABILITY] [POKEMON]]",

		mega: "", // NOT CONVERTED: not in Champions
		megaNoItem: "", // NOT CONVERTED: not in Champions
		megaGen6: "", // NOT CONVERTED: not in Champions
		transformMega: "[POKEMON] méga-évolue en Méga-[SPECIES] !",
		primal: "", // NOT CONVERTED: not in Champions
		zPower: "", // NOT CONVERTED: not in Champions
		zBroken: "  [POKEMON] n’arrive pas à parer toute l’attaque et subit des dégâts !",
		terastallize: "", // NOT CONVERTED: not in Champions

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] ne peut pas utiliser la capacité [MOVE] !",
		cantNoMove: "", // NOT CONVERTED: not in Champions
		fail: "  Mais cela échoue !",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] se transforme !",
		typeChange: "  [POKEMON] prend le type [TYPE] !",
		typeChangeFromEffect: "", // NOT CONVERTED: not in Champions
		typeAdd: "  [POKEMON] gagne le type [TYPE].",

		start: "", // NOT CONVERTED: not in Champions
		end: "  [POKEMON] est libéré de la capacité [EFFECT] !",
		activate: "", // NOT CONVERTED: not in Champions
		startTeamEffect: "", // NOT CONVERTED: not in Champions
		endTeamEffect: "", // NOT CONVERTED: not in Champions
		startFieldEffect: "", // NOT CONVERTED: not in Champions
		endFieldEffect: "", // NOT CONVERTED: not in Champions

		changeAbility: "  Le talent [POKEMON] devient [ABILITY] !",
		addItem: "  [POKEMON] obtient [ITEM] !",
		takeItem: "  [POKEMON] vole [ITEM] [SOURCE] !",
		eatItem: "", // NOT CONVERTED: not in Champions
		useGem: "  [ITEM] renforce la capacité [MOVE] !",
		eatItemWeaken: "  [ITEM] réduit les dégâts infligés à [POKEMON] !",
		removeItem: "", // NOT CONVERTED: not in Champions
		activateItem: "", // NOT CONVERTED: not in Champions
		activateWeaken: "  [ITEM] réduit les dégâts infligés à [POKEMON] !",

		damage: "  ([POKEMON] est blessé !)",
		damagePercentage: "", // NOT CONVERTED: not in Champions
		damageFromPokemon: "", // NOT CONVERTED: not in Champions
		damageFromItem: "", // NOT CONVERTED: not in Champions
		damageFromPartialTrapping: "  [POKEMON] est blessé par la capacité [MOVE] !",
		heal: "  [POKEMON] récupère des PV !",
		healFromZEffect: "", // NOT CONVERTED: not in Champions
		healFromEffect: "", // NOT CONVERTED: not in Champions

		boost: "  [STAT] [POKEMON] augmente !",
		boost2: "  [STAT] [POKEMON] augmente beaucoup !",
		boost3: "  [STAT] [POKEMON] augmente énormément !",
		boost0: "  [STAT] [POKEMON] ne peut plus augmenter !",
		boostFromItem: "", // NOT CONVERTED: not in Champions
		boost2FromItem: "", // NOT CONVERTED: not in Champions
		boost3FromItem: "", // NOT CONVERTED: not in Champions
		boostFromZEffect: "", // NOT CONVERTED: not in Champions
		boost2FromZEffect: "", // NOT CONVERTED: not in Champions
		boost3FromZEffect: "", // NOT CONVERTED: not in Champions
		boostMultipleFromZEffect: "", // NOT CONVERTED: not in Champions

		unboost: "  [STAT] [POKEMON] baisse !",
		unboost2: "  [STAT] [POKEMON] baisse beaucoup !",
		unboost3: "  [STAT] [POKEMON] baisse énormément !",
		unboost0: "  [STAT] [POKEMON] ne peut plus baisser !",
		unboostFromItem: "", // NOT CONVERTED: not in Champions
		unboost2FromItem: "", // NOT CONVERTED: not in Champions
		unboost3FromItem: "", // NOT CONVERTED: not in Champions

		swapBoost: "", // NOT CONVERTED: not in Champions
		swapOffensiveBoost: "  [POKEMON] permute les changements d’Attaque et d’Attaque Spéciale avec ceux de sa cible !",
		swapDefensiveBoost: "  [POKEMON] permute les changements de Défense et de Défense Spéciale avec ceux de sa cible !",
		copyBoost: "  [POKEMON] copie les changements de stats [TARGET] !",
		clearBoost: "  Les stats [POKEMON] sont revenues à la normale !",
		clearBoostFromZEffect: "", // NOT CONVERTED: not in Champions
		invertBoost: "  Les changements de stats [POKEMON] sont inversés !",
		clearAllBoost: "  Les changements de stats ont tous été annulés !",

		superEffective: "  C’est super efficace !",
		superEffectiveSpread: "  C’est super efficace sur [POKEMON] !",
		resisted: "  Ce n’est pas très efficace...",
		resistedSpread: "  Ce n’est pas très efficace sur [POKEMON]...",
		extremelyEffective: "  C’est hyper efficace !!!",
		extremelyEffectiveSpread: "  C’est hyper efficace sur [POKEMON] !!!",
		mostlyIneffective: "  Ce n’est vraiment pas très efficace !",
		mostlyIneffectiveSpread: "  Ce n’est vraiment pas très efficace sur [POKEMON] !",
		crit: "  Coup critique !",
		critSpread: "  Coup critique infligé à [POKEMON] !",
		immune: "  Ça n’affecte pas [POKEMON]...",
		immuneNoPokemon: "", // NOT CONVERTED: not in Champions
		immuneOHKO: "", // NOT CONVERTED: not in Champions
		miss: "  [POKEMON] évite l’attaque !",
		missNoPokemon: "", // NOT CONVERTED: not in Champions

		center: "", // NOT CONVERTED: not in Champions
		noTarget: "", // NOT CONVERTED: not in Champions
		ohko: "  K.O. en un coup !",
		combine: "", // NOT CONVERTED: not in Champions
		hitCount: "  Touché [NUMBER] fois !",
		hitCountSingular: "  Touché 1 fois !",
	},

	// stats
	hp: {
		statName: "PV",
		statShortName: "PV",
	},
	atk: {
		statName: "Attaque",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	def: {
		statName: "Défense",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spa: {
		statName: "Attaque Spéciale",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spd: {
		statName: "Défense Spéciale",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spe: {
		statName: "Vitesse",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	accuracy: {
		statName: "Précision",
	},
	evasion: {
		statName: "Esquive",
	},
	spc: {
		statName: "", // NOT CONVERTED: not in Champions
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	stats: {
		statName: "Stats",
	},

	// statuses
	brn: {
		start: "  [POKEMON] est brûlé !",
		startFromItem: "  [POKEMON] est brûlé par [ITEM] !",
		alreadyStarted: "  [POKEMON] est déjà brûlé.",
		end: "", // NOT CONVERTED: not in Champions
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "  [POKEMON] souffre de sa brûlure !",
	},
	frz: {
		start: "  [POKEMON] est gelé !",
		alreadyStarted: "", // NOT CONVERTED: not in Champions
		end: "  [POKEMON] n’est plus gelé !",
		endFromItem: "  [ITEM] [POKEMON] le dégèle !",
		endFromMove: "  La glace a fondu grâce à la capacité [MOVE] [POKEMON] !",
		cant: "[POKEMON] est gelé ! Il ne peut plus agir !",
	},
	par: {
		start: "  [POKEMON] est paralysé ! Il aura du mal à utiliser des capacités !",
		alreadyStarted: "  [POKEMON] est déjà paralysé.",
		end: "  [POKEMON] n’est plus paralysé !",
		endFromItem: "  [ITEM] [POKEMON] le sort de sa paralysie !",
		cant: "", // NOT CONVERTED: not in Champions
	},
	psn: {
		start: "  [POKEMON] est empoisonné !",
		alreadyStarted: "  [POKEMON] est déjà empoisonné.",
		end: "  [POKEMON] n’est plus empoisonné !",
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	tox: {
		start: "  [POKEMON] est gravement empoisonné !",
		startFromItem: "  [POKEMON] est gravement empoisonné par [ITEM] !",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] s’est endormi !",
		startFromRest: "", // NOT CONVERTED: not in Champions
		alreadyStarted: "  [POKEMON] dort déjà.",
		end: "  [POKEMON] se réveille !",
		endFromItem: "  [ITEM] [POKEMON] le réveille !",
		cant: "[POKEMON] dort profondément.",
	},

	// misc effects
	confusion: {
		start: "  Ça rend [POKEMON] confus !",
		startFromFatigue: "  La fatigue rend [POKEMON] confus !",
		end: "  [POKEMON] n’est plus confus !",
		endFromItem: "  [ITEM] [POKEMON] le tire de sa confusion !",
		alreadyStarted: "  [POKEMON] est déjà confus !",
		activate: "  [POKEMON] est confus !",
		damage: "Il se blesse dans sa confusion.",
	},
	drain: {
		heal: "  L’énergie [SOURCE] est drainée !",
	},
	flinch: {
		cant: "[POKEMON] a la trouille ! Il ne peut pas utiliser sa capacité !",
	},
	heal: {
		fail: "  Les PV [POKEMON] sont au maximum !",
	},
	healreplacement: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	nopp: {
		cant: "", // NOT CONVERTED: not in Champions
	},
	recharge: {
		cant: "L’épuisement empêche [POKEMON] d’agir !",
	},
	recoil: {
		damage: "  [POKEMON] est blessé par le contrecoup !",
	},
	unboost: {
		fail: "  Les stats [POKEMON] ne baissent pas !",
		failSingular: "", // NOT CONVERTED: not in Champions
	},
	struggle: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	trapped: {
		start: "  [POKEMON] ne peut plus s’échapper !",
	},
	dynamax: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
		fail: "", // NOT CONVERTED: not in Champions
	},

	// weather
	sandstorm: {
		weatherName: "Tempête de sable",
		start: "  Une tempête de sable se prépare !",
		end: "  La tempête de sable se calme !",
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "  La tempête de sable inflige des dégâts à [POKEMON] !",
	},
	sunnyday: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  Les rayons du soleil brillent !",
		end: "  Les rayons du soleil s’affaiblissent !",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	raindance: {
		weatherName: "Pluie",
		start: "  Il commence à pleuvoir !",
		end: "  La pluie s’est arrêtée !",
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
		weatherName: "Neige",
		start: "  Il commence à neiger !",
		end: "  La neige s’est arrêtée !",
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
		start: "  De l’électricité parcourt le terrain !",
		end: "  L’électricité parcourant le terrain s’est dissipée...",
		block: "  [POKEMON] est protégé par un champ électrifié !",
	},
	grassyterrain: {
		start: "  Un beau gazon pousse sur le terrain !",
		end: "  Le gazon disparaît...",
		heal: "", // NOT CONVERTED: not in Champions
	},
	mistyterrain: {
		start: "  La brume recouvre le terrain !",
		end: "  La brume qui recouvrait le terrain se dissipe...",
		block: "  [POKEMON] est protégé par un champ brumeux !",
	},
	psychicterrain: {
		start: "  Le sol se met à réagir de façon bizarre...",
		end: "  Le sol redevient normal !",
		block: "  [POKEMON] est protégé par un champ psychique !",
	},

	// field effects
	gravity: {
		start: "  La gravité s’intensifie !",
		end: "  La gravité est revenue à la normale !",
		cant: "[POKEMON] ne peut pas utiliser la capacité [MOVE] à cause du changement de gravité !",
		activate: "[POKEMON] ne peut pas rester en l’air à cause du changement de gravité !",
	},
	magicroom: {
		start: "  L’effet des objets tenus est neutralisé !",
		end: "  La zone magique a disparu. L’effet des objets tenus est rétabli !",
	},
	mudsport: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
	},
	trickroom: {
		start: "  [POKEMON] fausse les dimensions !",
		end: "  Les dimensions faussées reviennent à la normale !",
	},
	watersport: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
	},
	wonderroom: {
		start: "  La Défense et la Défense Spéciale sont interverties !",
		end: "  La zone étrange a disparu. La Défense et la Défense Spéciale sont revenues à la normale !",
	},

	// misc
	crash: {
		damage: "  [POKEMON] s’écrase au sol !",
	},
};
