export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NEEDS TRANSLATION: Showdown custom text
		winBattle: "", // NEEDS TRANSLATION: Showdown custom text
		tieBattle: "", // NEEDS TRANSLATION: Showdown custom text

		pokemon: "[NICKNAME]",
		opposingPokemon: "[NICKNAME] ennemi",
		team: "votre équipe",
		opposingTeam: "l’équipe ennemie",
		party: "les alliés",
		opposingParty: "l’équipe ennemie",

		turn: "== [NUMBER] [INFLECT:NUMBER:s=tour:p=tours] ==",
		switchIn: "[TRAINER:definite:capitalize] envoie [FULLNAME] !",
		switchInOwn: "[FULLNAME] ! Go !",
		switchOut: "[TRAINER:definite:capitalize] retire [NICKNAME] !",
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
		abilityActivation: "[[ABILITY] [POKEMON:de]]",

		mega: "  [ITEM:definite:capitalize] [POKEMON:de] réagit à la Gemme Sésame de [TRAINER] !",
		megaNoItem: "  [POKEMON] réagit à la Gemme Sésame de [TRAINER] !",
		megaGen6: "  [ITEM:definite:capitalize] [POKEMON:de] réagi[INFLECT:ITEM:s=:p=ssen]t au Méga-Bracelet [TRAINER:de] !",
		transformMega: "[POKEMON] méga-évolue en Méga-[SPECIES] !",
		primal: "Primo-Résurgence [POKEMON:de] ! Il retrouve son apparence originelle !",
		zPower: "  [POKEMON] déploie sa Force Z comme une aura !",
		zBroken: "  [POKEMON] n’arrive pas à parer toute l’attaque et subit des dégâts !",
		terastallize: "", // NEEDS TRANSLATION: Showdown custom text

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] ne peut pas utiliser la capacité [MOVE] !",
		cantNoMove: "[POKEMON] est immobilisé!",
		fail: "  Mais cela échoue !",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] se transforme !",
		typeChange: "  [POKEMON] prend le type [TYPE] !",
		typeChangeFromEffect: "  [EFFECT] du [POKEMON] le transforme en type [TYPE]!",
		typeAdd: "  [POKEMON] gagne le type [TYPE].",

		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "  [POKEMON] est libéré de la capacité [EFFECT] !",
		activate: "", // NEEDS TRANSLATION: Showdown custom text
		startTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		startFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text

		changeAbility: "  Le talent [POKEMON:de] devient [ABILITY] !",
		addItem: "  [POKEMON] obtient [ITEM:indefinite:classified] !",
		takeItem: "  [POKEMON] vole [ITEM:definite:classified] [SOURCE:de] !",
		eatItem: "", // NEEDS TRANSLATION: Showdown custom text
		useGem: "  [ITEM:definite:capitalize:classified] renforce[INFLECT:ITEM:s=:p=nt] la capacité [MOVE] !",
		eatItemWeaken: "  [ITEM:definite:capitalize:classified] rédui[INFLECT:ITEM:s=:p=sen]t les dégâts infligés à [POKEMON] !",
		removeItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateWeaken: "  [ITEM:definite:capitalize:classified] rédui[INFLECT:ITEM:s=:p=sen]t les dégâts infligés à [POKEMON] !",

		damage: "  ([POKEMON] est blessé !)",
		damagePercentage: "", // NEEDS TRANSLATION: Showdown custom text
		damageFromPokemon: "  [ITEM:definite:capitalize] [SOURCE:de] blesse[INFLECT:ITEM:s=:p=nt] [POKEMON] !",
		damageFromItem: "  [POKEMON] est blessé par [ITEM:definite] !",
		damageFromPartialTrapping: "  [POKEMON] est blessé par la capacité [MOVE] !",
		heal: "  [POKEMON] récupère des PV !",
		healFromZEffect: "  [POKEMON] utilise la Force Z pour se soigner !",
		healFromEffect: "  [POKEMON] restaure ses PV grâce à [EFFECT]!",

		boost: "  [STAT:definite:capitalize] [POKEMON:de] augmente !",
		boost2: "  [STAT:definite:capitalize] [POKEMON:de] augmente beaucoup !",
		boost3: "  [STAT:definite:capitalize] [POKEMON:de] augmente énormément !",
		boost0: "  [STAT:definite:capitalize] [POKEMON:de] ne peut plus augmenter !",
		boostFromItem: "  [ITEM] de [POKEMON] augmente sa stat [STAT]!",
		boost2FromItem: "  [ITEM] de [POKEMON] monte beaucoup sa stat [STAT]!",
		boost3FromItem: "  Grâce [ITEM:a:definite], [STAT:definite:capitalize] [POKEMON:de] augmente énormément !",
		boostFromZEffect: "  Grâce à la Force Z, [STAT:definite:capitalize] [POKEMON:de] augmente !",
		boost2FromZEffect: "  Grâce à la Force Z, [STAT:definite:capitalize] [POKEMON:de] augmente beaucoup !",
		boost3FromZEffect: "  Grâce à la Force Z, [STAT:definite:capitalize] [POKEMON:de] augmente énormément !",
		boostMultipleFromZEffect: "  [POKEMON] utilise la Force Z pour augmenter ses stats !",

		unboost: "  [STAT:definite:capitalize] [POKEMON:de] baisse !",
		unboost2: "  [STAT:definite:capitalize] [POKEMON:de] baisse beaucoup !",
		unboost3: "  [STAT:definite:capitalize] [POKEMON:de] baisse énormément !",
		unboost0: "  [STAT:definite:capitalize] [POKEMON:de] ne peut plus baisser !",
		unboostFromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost2FromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost3FromItem: "", // NEEDS TRANSLATION: Showdown custom text

		swapBoost: "  [POKEMON] permute ses changements de stats avec ceux de sa cible !",
		swapOffensiveBoost: "  [POKEMON] permute les changements d’Attaque et d’Attaque Spéciale avec ceux de sa cible !",
		swapDefensiveBoost: "  [POKEMON] permute les changements de Défense et de Défense Spéciale avec ceux de sa cible !",
		copyBoost: "  [POKEMON] copie les changements de stats [TARGET:de] !",
		clearBoost: "  Les stats [POKEMON:de] sont revenues à la normale !",
		clearBoostFromZEffect: "  [POKEMON] utilise la Force Z pour annuler ses baisses de stats !",
		invertBoost: "  Les changements de stats [POKEMON:de] sont inversés !",
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
		immuneNoPokemon: "  Mais ça n’a aucun effet !",
		immuneOHKO: "  [POKEMON] n’est pas affecté !",
		miss: "  [POKEMON] évite l’attaque !",
		missNoPokemon: "  [SOURCE] rate son attaque!",

		center: "  Réinitialisation !",
		noTarget: "  Mais il n'y a pas de cible...",
		ohko: "  K.O. en un coup !",
		combine: "  Les deux capacités se sont combinées !",
		hitCount: "  Touché [NUMBER] fois !",
	},

	// stats
	hp: {
		statName: "PV",
		statShortName: "PV",
	},
	atk: {
		statName: "Attaque",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	def: {
		statName: "Défense",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spa: {
		statName: "Attaque Spéciale",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spd: {
		statName: "Défense Spéciale",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spe: {
		statName: "Vitesse",
		grammar: "fs",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	accuracy: {
		statName: "Précision",
		grammar: "fs",
	},
	evasion: {
		statName: "Esquive",
		grammar: "fs",
	},
	spc: {
		statName: "Spécial",
		grammar: "ms",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	stats: {
		statName: "Stats",
		grammar: "fp",
	},

	// statuses
	brn: {
		start: "  [POKEMON] est brûlé !",
		startFromItem: "  [POKEMON] est brûlé par [ITEM:definite:classified] !",
		alreadyStarted: "  [POKEMON] est déjà brûlé.",
		end: "  [POKEMON] n’est plus brûlé !",
		endFromItem: "  [ITEM:definite:capitalize] [POKEMON:de] le guéri[INFLECT:ITEM:s=:p=ssen]t de sa brûlure !",
		damage: "  [POKEMON] souffre de sa brûlure !",
	},
	frz: {
		start: "  [POKEMON] est gelé !",
		alreadyStarted: "  [POKEMON] est déjà gelé.",
		end: "  [POKEMON] n’est plus gelé !",
		endFromItem: "  [ITEM:definite:capitalize:classified] [POKEMON:de] le dégèle[INFLECT:ITEM:s=:p=nt] !",
		endFromMove: "  La glace a fondu grâce à la capacité [MOVE] [POKEMON:de] !",
		cant: "[POKEMON] est gelé ! Il ne peut plus agir !",
	},
	par: {
		start: "  [POKEMON] est paralysé ! Il aura du mal à utiliser des capacités !",
		alreadyStarted: "  [POKEMON] est déjà paralysé.",
		end: "  [POKEMON] n’est plus paralysé !",
		endFromItem: "  [ITEM:definite:capitalize:classified] [POKEMON:de] le sort[INFLECT:ITEM:s=:p=ent] de sa paralysie !",
		cant: "[POKEMON] est paralysé ! Il n’a pas pu attaquer !",
	},
	psn: {
		start: "  [POKEMON] est empoisonné !",
		alreadyStarted: "  [POKEMON] est déjà empoisonné.",
		end: "  [POKEMON] n’est plus empoisonné !",
		endFromItem: "  [ITEM:definite:capitalize] [POKEMON:de] le guéri[INFLECT:ITEM:s=:p=ssen]t de son empoisonnement !",
		damage: "  [POKEMON] souffre du poison !",
	},
	tox: {
		start: "  [POKEMON] est gravement empoisonné !",
		startFromItem: "  [POKEMON] est gravement empoisonné par [ITEM:definite:classified] !",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] s’est endormi !",
		startFromRest: "  [POKEMON] a récupéré en dormant !",
		alreadyStarted: "  [POKEMON] dort déjà.",
		end: "  [POKEMON] se réveille !",
		endFromItem: "  [ITEM:definite:capitalize:classified] [POKEMON:de] le réveille[INFLECT:ITEM:s=:p=nt] !",
		cant: "[POKEMON] dort profondément.",
	},

	// misc effects
	confusion: {
		start: "  Ça rend [POKEMON] confus !",
		startFromFatigue: "  La fatigue rend [POKEMON] confus !",
		end: "  [POKEMON] n’est plus confus !",
		endFromItem: "  [ITEM:definite:capitalize:classified] [POKEMON:de] le tire[INFLECT:ITEM:s=:p=nt] de sa confusion !",
		alreadyStarted: "  [POKEMON] est déjà confus !",
		activate: "  [POKEMON] est confus !",
		damage: "Il se blesse dans sa confusion.",
	},
	drain: {
		heal: "  L’énergie [SOURCE:de] est drainée !",
	},
	flinch: {
		cant: "[POKEMON] a la trouille ! Il ne peut pas utiliser sa capacité !",
	},
	heal: {
		fail: "  Les PV [POKEMON:de] sont au maximum !",
	},
	healreplacement: {
		activate: "  [POKEMON] utilise la Force Z pour soigner un allié qui entrera sur le terrain !",
	},
	nopp: {
		cant: "[POKEMON] utilise **[MOVE]** !\n  Mais cette capacité n’a plus de PP !",
	},
	recharge: {
		cant: "L’épuisement empêche [POKEMON] d’agir !",
	},
	recoil: {
		damage: "  [POKEMON] est blessé par le contrecoup !",
	},
	unboost: {
		fail: "  Les stats [POKEMON:de] ne baissent pas !",
	},
	struggle: {
		activate: "  [POKEMON] n’a plus de capacités utilisables !",
	},
	trapped: {
		start: "  [POKEMON] ne peut plus s’échapper !",
	},
	dynamax: {
		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "", // NEEDS TRANSLATION: Showdown custom text
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
		weatherName: "Soleil",
		start: "  Les rayons du soleil brillent !",
		end: "  Les rayons du soleil s’affaiblissent !",
		upkeep: "  (Les rayons du soleil sont forts.)",
	},
	raindance: {
		weatherName: "Pluie",
		start: "  Il commence à pleuvoir !",
		end: "  La pluie s’est arrêtée !",
		upkeep: "  (La pluie continue de tomber.)",
	},
	hail: {
		weatherName: "Grêle",
		start: "  Il commence à grêler !",
		end: "  La grêle s’est arrêtée !",
		upkeep: "  (Il y a un déluge de grêle.)",
		damage: "  La tempête de grêle inflige des dégâts à [POKEMON] !",
	},
	snowscape: {
		weatherName: "Neige",
		start: "  Il commence à neiger !",
		end: "  La neige s’est arrêtée !",
		upkeep: "  (Il y a une tempête de neige !)",
	},
	desolateland: {
		weatherName: "Soleil intense",
		start: "  Les rayons du soleil s’intensifient !",
		end: "  Les rayons du soleil s’affaiblissent !",
		block: "  Le soleil brille si intensément que rien ne peut l’obscurcir !",
		blockMove: "  Le soleil brille si intensément que toute attaque de type Eau s’évapore !",
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
		heal: "  [POKEMON] récupère des PV !",
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
