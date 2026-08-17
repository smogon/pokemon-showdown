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
		swapCenter: "[POKEMON] s’est déplacé au milieu !",

		// Multi Battles only
		canDynamax: "  [TRAINER] est maintenant capable d’utiliser le Dynamax !",
		canDynamaxOwn: "  La puissance du Dynamax entoure [TRAINER] !",

		zEffect: "  [POKEMON] déploie toute la puissance de sa Force Z !",
		move: "[POKEMON] utilise **[MOVE]** !",
		abilityActivation: "[[ABILITY] [POKEMON]]",

		mega: "", // NOT CONVERTED: not in Champions
		megaNoItem: "", // NOT CONVERTED: not in Champions
		megaGen6: "", // NOT CONVERTED: not in Champions
		transformMega: "[POKEMON] méga-évolue en Méga-[SPECIES] !",
		primal: "", // NOT CONVERTED: runtime grammar
		zPower: "  [POKEMON] déploie sa Force Z comme une aura !",
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
		damageFromItem: "", // NOT CONVERTED: runtime grammar
		damageFromPartialTrapping: "  [POKEMON] est blessé par la capacité [MOVE] !",
		heal: "  [POKEMON] récupère des PV !",
		healFromZEffect: "  [POKEMON] utilise la Force Z pour se soigner !",
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
		boostMultipleFromZEffect: "  [POKEMON] utilise la Force Z pour augmenter ses stats !",

		unboost: "  [STAT] [POKEMON] baisse !",
		unboost2: "  [STAT] [POKEMON] baisse beaucoup !",
		unboost3: "  [STAT] [POKEMON] baisse énormément !",
		unboost0: "  [STAT] [POKEMON] ne peut plus baisser !",
		unboostFromItem: "", // NOT CONVERTED: not in Champions
		unboost2FromItem: "", // NOT CONVERTED: not in Champions
		unboost3FromItem: "", // NOT CONVERTED: not in Champions

		swapBoost: "  [POKEMON] permute ses changements de stats avec ceux de sa cible !",
		swapOffensiveBoost: "  [POKEMON] permute les changements d’Attaque et d’Attaque Spéciale avec ceux de sa cible !",
		swapDefensiveBoost: "  [POKEMON] permute les changements de Défense et de Défense Spéciale avec ceux de sa cible !",
		copyBoost: "  [POKEMON] copie les changements de stats [TARGET] !",
		clearBoost: "  Les stats [POKEMON] sont revenues à la normale !",
		clearBoostFromZEffect: "  [POKEMON] utilise la Force Z pour annuler ses baisses de stats !",
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
		immuneOHKO: "  [POKEMON] n’est pas affecté !",
		miss: "  [POKEMON] évite l’attaque !",
		missNoPokemon: "", // NOT CONVERTED: not in Champions

		center: "  Réinitialisation !",
		noTarget: "", // NOT CONVERTED: not in Champions
		ohko: "  K.O. en un coup !",
		combine: "  Les deux capacités se sont combinées !",
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
		alreadyStarted: "  [POKEMON] est déjà gelé.",
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
		endFromItem: "", // NOT CONVERTED: runtime grammar
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
		block: "  La puissance du Dynamax a bloqué l’attaque !",
		fail: "  [POKEMON] fait non de la tête. On dirait qu’il ne peut pas utiliser cette capacité...",
	},

	// weather
	sandstorm: {
		weatherName: "Tempête de sable",
		start: "  Une tempête de sable se prépare !",
		end: "  La tempête de sable se calme !",
		upkeep: "  (La tempête de sable fait rage !)",
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
		weatherName: "Grêle",
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
		start: "  Les rayons du soleil s’intensifient !",
		end: "", // NOT CONVERTED: not in Champions
		block: "  Le soleil brille si intensément que rien ne peut l’obscurcir !",
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	primordialsea: {
		weatherName: "Pluie battante",
		start: "  Une pluie battante s’abat soudainement !",
		end: "  La pluie battante s’est arrêtée...",
		block: "  Impossible de dissiper une telle pluie !",
		blockMove: "  La pluie battante empêche toute attaque de type Feu !",
	},
	deltastream: {
		weatherName: "Vent mystérieux",
		start: "  Un vent mystérieux enveloppe les Pokémon de type Vol !",
		end: "  Le vent mystérieux s’est dissipé...",
		activate: "  Le vent mystérieux affaiblit l’attaque !",
		block: "  Impossible de ramener l’atmosphère à la normale !",
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
		start: "  La puissance des capacités de type Électrik diminue !",
		end: "  L’effet de Lance-Boue se dissipe !",
	},
	trickroom: {
		start: "  [POKEMON] fausse les dimensions !",
		end: "  Les dimensions faussées reviennent à la normale !",
	},
	watersport: {
		start: "  La puissance des capacités de type Feu diminue !",
		end: "  L’effet de Tourniquet se dissipe !",
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
