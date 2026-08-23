export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "Pas de Talent",
		shortDesc: "Ne fait rien.",
	},
	adaptability: {
		name: "Adaptabilité",
		desc: "Quand le Pokémon utilise une capacité du même type que lui, le bonus de puissance qu'elle reçoit est encore plus important que normalement.",
		shortDesc: "Le STAB de ce Pokémon est de 2 à la place de 1.5.",
	},
	aerilate: {
		name: "Peau Céleste",
		desc: "Les capacités de type Normal deviennent de type Vol. Leur puissance augmente légèrement.",
		shortDesc: "Les capacités Normal du Pokémon deviennent Vol, leur puissance augmente de 20%.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	aftermath: {
		name: "Boom Final",
		desc: "Si le Pokémon est mis K.O. par une attaque directe, il inflige des dégâts à l’attaquant avant de s’évanouir.",
		shortDesc: "Si ce Pokémon est mis KO avec une capacité de contact, l'attaquant perd 25% PV max.",

		damage: "  [POKEMON] est blessé !",
	},
	airlock: {
		name: "Air Lock",
		shortDesc: "Tant que ce Pokémon est actif, les effets de la météo sont désactivés.",

		start: "  Les effets de la météo se dissipent !",
	},
	analytic: {
		name: "Analyste",
		desc: "Augmente la puissance des capacités du Pokémon s’il attaque en dernier.",
		shortDesc: "La puissance des capacités du Pokémon est augmentée de 30% s'il agit en dernier.",
	},
	angerpoint: {
		name: "Colérique",
		desc: "Si le Pokémon subit un coup critique, il entre dans une colère noire qui augmente son Attaque au maximum.",
		shortDesc: "Si ce Pokémon (pas son clone) subit un coup critique, augmente son Attaque de 12 crans.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		boost: "  [POKEMON] monte son Attaque au maximum !",
	},
	angershell: {
		name: "Courroupace",
		desc: "Le Pokémon enrage s’il a moins de la moitié de ses PV après avoir subi une attaque. Sa Déf. et sa Déf. Spé. baissent, et son Atq., son Atq. Spé. et sa Vit. augmentent.",
		shortDesc: "À 50% des PVs max ou moins : +1 Atq, Atq Spé et Vit, -1 Déf et Déf Spé.",
	},
	anticipation: {
		name: "Anticipation",
		desc: "Le Pokémon devine si l'adversaire connaît une capacité dangereuse pour lui.",
		shortDesc: "Sur switch-in, ce Pokémon tremble si un ennemi a une capacité super efficace ou OHKO.",
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "  [POKEMON] est tout tremblant !",
	},
	arenatrap: {
		name: "Piège Sable",
		desc: "Empêche l'adversaire de quitter le terrain.",
		shortDesc: "Empêche les ennemis au sol adjacents de switcher.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	armortail: {
		name: "Armure Caudale",
		desc: "Une étrange queue recouvre la tête du Pokémon, ce qui empêche ce dernier et ses alliés d’être visés par une capacité prioritaire.",
		shortDesc: "Ce Pokémon et ses alliés sont immunisés aux capacités de priorité adverses.",

		block: "#damp",
	},
	aromaveil: {
		name: "Aroma-Voile",
		desc: "Protège le Pokémon et ses alliés des effets limitant le libre arbitre.",
		shortDesc: "Protège Pokémon/alliés d'Attraction, Entrave, Encore, Anti-Soin, Provocation et Tourmente.",

		block: "  [POKEMON] est protégé par Aroma-Voile !",
	},
	asone: {
		name: "Osmose Équine",
		shortDesc: "(Talents séparés entre Blizzeval et Spectreval.)",

		start: "  [POKEMON] a deux talents !",
	},
	asoneglastrier: {
		name: "Osmose Équine (Blizzeval)",
		shortDesc: "Combinaison de Tension et Blanche Ruade.",
	},
	asonespectrier: {
		name: "Osmose Équine (Spectreval)",
		shortDesc: "Combinaison de Tension et Sombre Ruade.",
	},
	aurabreak: {
		name: "Aura Inversée",
		desc: "Inverse l’effet des talents « Aura » afin que ceux-ci baissent la puissance des capacités affectées au lieu de l’augmenter.",
		shortDesc: "Tant que ce Pokémon est actif, le bonus de Aura Ténébreuse/Aura Féérique est x0.75.",

		start: "  [POKEMON] inverse toutes les auras !",
	},
	baddreams: {
		name: "Mauvais Rêve",
		desc: "Inflige des dégâts aux ennemis endormis.",
		shortDesc: "Les ennemis adjacents endormis subissent 1/8 de leur PV max à la fin de chaque tour.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		damage: "  [POKEMON] a le sommeil agité !",
	},
	ballfetch: {
		name: "Ramasse Ball",
		shortDesc: "Pas d'utilisation compétitive.",
	},
	battery: {
		name: "Batterie",
		shortDesc: "La puissance des capacités spéciales des Pokémon alliés est augmentée de 30%.",
	},
	battlearmor: {
		name: "Armurbaston",
		shortDesc: "Ce Pokémon ne peut pas subir de coups critiques.",
	},
	battlebond: {
		name: "Synergie",
		desc: "En battant un ennemi, ce Pokémon renforce ses liens avec son Dresseur, ce qui augmente son Attaque, son Attaque Spéciale et sa Vitesse.",
		shortDesc: "Après avoir KO un Pokémon : devient Sachanobi. Sheauriken : 20 puissance, touche 3x.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		activate: "  [POKEMON] sent la force de la synergie !",
		transform: "[POKEMON] se transforme en Sachanobi !",
	},
	beadsofruin: {
		name: "Perles du Fléau",
		shortDesc: "La Défense Spéciale de tous les autres Pokémon actifs est réduite de 25%.",

		start: "  Les Perles du Fléau [POKEMON:de] affaiblissent la Défense Spéciale des Pokémon alentour !",
	},
	beastboost: {
		name: "Boost Chimère",
		desc: "Augmente la stat la plus élevée du Pokémon quand il met K.O. un autre Pokémon.",
		shortDesc: "La plus haute stat du Pokémon est augmentée de 1 s'il attaque et KO un autre Pokémon.",
	},
	berserk: {
		name: "Folle Furie",
		desc: "Augmente l’Attaque Spéciale du Pokémon lorsque ses PV tombent à la moitié à cause d’une attaque de l’adversaire.",
		shortDesc: "L'Atq. Spé du Pokémon est augmentée de 1 lorsqu'il atteint 50% ou moins de ses PV max.",
	},
	bigpecks: {
		name: "Cœur de Coq",
		shortDesc: "Empêche les autres Pokémon de baisser la Défense de ce Pokémon.",
	},
	blaze: {
		name: "Brasier",
		desc: "Augmente la puissance des capacités de type Feu du Pokémon quand il a perdu une certaine quantité de PV.",
		shortDesc: "Si PV < 33% PV max, augmente la puissance des capacités Feu du Pokémon de 50%.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	bulletproof: {
		name: "Pare-Balles",
		shortDesc: "Immunise le Pokémon aux capacités projectiles (Ball'Ombre, Bomb-Beurk, Exploforce, etc)",
	},
	cheekpouch: {
		name: "Bajoues",
		desc: "Le Pokémon récupère des PV lorsqu’il consomme n’importe quelle Baie en plus de bénéficier de ses effets habituels.",
		shortDesc: "Si le Pokémon mange une Baie, il regagne 33% des PV max en plus des effets de la Baie.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	chillingneigh: {
		name: "Blanche Ruade",
		desc: "Quand le Pokémon met un ennemi K.O., il émet un hennissement glaçant, ce qui augmente son Attaque.",
		shortDesc: "L'Attaque de ce Pokémon est augmentée de 1 s'il attaque et KO un autre Pokémon.",
	},
	chlorophyll: {
		name: "Chlorophylle",
		desc: "Augmente la Vitesse du Pokémon s'il y a du soleil.",
		shortDesc: "La Vitesse de ce Pokémon est doublée sous le Soleil.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	clearbody: {
		name: "Corps Sain",
		shortDesc: "Ce Pokémon est immunisé aux baisses de stats de son adversaire.",
	},
	cloudnine: {
		name: "Ciel Gris",
		shortDesc: "Tant que ce Pokémon est actif, les effets de la météo sont désactivés.",

		start: "#airlock",
	},
	colorchange: {
		name: "Homochromie",
		desc: "Lorsque le Pokémon est touché par une capacité, il prend le type de celle-ci.",
		shortDesc: "Le type de ce Pokémon devient le type de la capacité qui le touche, sauf s'il est de ce type.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	comatose: {
		name: "Hypersommeil",
		desc: "Le Pokémon rêve en permanence et ne se réveille jamais. Il est capable d’attaquer normalement tout en dormant.",
		shortDesc: "Ce Pokémon est considéré endormi et ne peut pas subir de problèmes de statut.",

		start: "  [POKEMON] est en Hypersommeil !",
	},
	commander: {
		name: "Commandant",
		desc: "Si un Oyacata allié est sur le terrain quand ce Pokémon rejoint le combat, ce dernier entre dans sa bouche et devient son commandant.",
		shortDesc: "Si l'allié est Oyacata, le Pokémon ne peut pas jouer ni être touché. +2 aux stats d'Oyacata.",

		activate: "  [POKEMON] a été avalé par [TARGET] et devient son commandant.",
	},
	competitive: {
		name: "Battant",
		desc: "Augmente beaucoup l’Attaque Spéciale du Pokémon quand ses stats ont été baissées par l’adversaire.",
		shortDesc: "L'Atq. Spé du Pokémon est augmentée de 2 dès qu'un adversaire baisse une de ses stats.",
	},
	compoundeyes: {
		name: "Œil Composé",
		shortDesc: "La Précision des capacités du Pokémon est augmentée de 30%.",
	},
	contrary: {
		name: "Contestation",
		shortDesc: "Si une des stats du Pokémon est augmentée, elle est baissée à la place, et vice versa.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	corrosion: {
		name: "Corrosion",
		shortDesc: "Ce Pokémon peut (gravement) empoisonner les Pokémon, peu importe leur type.",
	},
	costar: {
		name: "Collab",
		shortDesc: "En arrivant sur le terrain, le Pokémon copie les changements de stats d'un allié.",
	},
	cottondown: {
		name: "Effilochage",
		desc: "Quand le Pokémon est touché par une attaque, il dissémine des aigrettes qui diminuent la Vitesse de tout le monde, sauf la sienne.",
		shortDesc: "Lorsque ce Pokémon est touché, la Vitesse de tous les Pokémon du terrain baisse de 1.",
	},
	cudchew: {
		name: "Ruminant",
		shortDesc: "Si le Pokémon mange une baie, la baie est de nouveau mangée à la fin du prochain tour.",
	},
	curiousmedicine: {
		name: "Breuvage Suspect",
		shortDesc: "Quand ce Pokémon rentre au combat, les changements de stats de ses alliés sont annulés.",
	},
	cursedbody: {
		name: "Corps Maudit",
		desc: "Quand le Pokémon est touché par une capacité adverse, il inflige parfois Entrave sur celle-ci.",
		shortDesc: "Si un Pokémon attaque ce Pokémon, la capacité utilisée a 30% de chance d'être entravée.",
	},
	cutecharm: {
		name: "Joli Sourire",
		desc: "Peut séduire l'attaquant lorsque le Pokémon subit une attaque directe.",
		shortDesc: "A 30% de chance de séduire l'attaquant si le Pokémon subit une attaque de contact.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	damp: {
		name: "Moiteur",
		desc: "Le Pokémon augmente l'humidité de l'air, ce qui empêche tous les Pokémon d'utiliser des capacités explosives telles que Destruction.",
		shortDesc: "Empêche Destruction/Explosion/Caboche-Kaboum/Explo-Brume/Boom Final.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		block: "  [SOURCE] ne peut pas utiliser la capacité [MOVE] !",
	},
	dancer: {
		name: "Danseuse",
		desc: "Si n’importe quel Pokémon utilise une capacité dansante, le Pokémon utilise immédiatement cette danse lui aussi.",
		shortDesc: "Lorsqu'une capacité de danse est utilisée, ce Pokémon peut immédiatement la reproduire.",
	},
	darkaura: {
		name: "Aura Ténébreuse",
		desc: "Augmente la puissance des capacités de type Ténèbres de tous les Pokémon.",
		shortDesc: "La puissance des capacités de type Ténèbres est multipliée par x1.33.",

		start: "  [POKEMON] dégage une aura ténébreuse !",
	},
	dauntlessshield: {
		name: "Égide Inflexible",
		shortDesc: "Augmente la Défense du Pokémon de 1 quand il entre au combat.",
		gen8: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	dazzling: {
		name: "Corps Coloré",
		desc: "L’adversaire est abasourdi par le Pokémon, ce qui l’empêche de viser ce dernier et ses alliés avec une capacité prioritaire.",
		shortDesc: "Le Pokémon empêche les adversaires d'utiliser les capacités de priorité.",

		block: "#damp",
	},
	defeatist: {
		name: "Défaitiste",
		desc: "Le Pokémon devient défaitiste quand ses PV tombent à la moitié, et son Attaque et son Attaque Spéciale sont divisées par deux.",
		shortDesc: "Si les PV du Pokémon sont à 50% ou moins, son Attaque et Atq. Spé sont divisées par 2.",
	},
	defiant: {
		name: "Acharné",
		desc: "Augmente beaucoup l'Attaque du Pokémon quand ses stats sont baissées par l'adversaire.",
		shortDesc: "L'Attaque du Pokémon est augmentée de 2 dès qu'un adversaire baisse une de ses stats.",
	},
	deltastream: {
		name: "Souffle Delta",
		desc: "Altère les conditions météo pour annuler les faiblesses du type Vol.",
		shortDesc: "Invoque un Vent mystérieux qui annule les faiblesses du type Vol.",
	},
	desolateland: {
		name: "Terre Finale",
		desc: "Altère les conditions météo pour neutraliser les attaques de type Eau.",
		shortDesc: "Invoque un Soleil intense qui rend inefficaces les attaques Eau.",
	},
	disguise: {
		name: "Fantômasque",
		desc: "Le déguisement qui recouvre le corps du Pokémon est capable de le protéger d’une attaque.",
		shortDesc: "(Mimiqui) La première attaque qu'il subit est bloquée, subit 1/8 des PV max à la place.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		block: "  Le déguisement absorbe l’attaque !",
		transform: "Le déguisement [POKEMON:de] tombe !",
	},
	download: {
		name: "Télécharge",
		desc: "Le Pokémon compare la Défense et la Défense Spéciale de l’adversaire et, en fonction de la stat la plus basse, il augmente sa propre Attaque ou Attaque Spéciale.",
		shortDesc: "L'Attaque ou l'Atq. Spé est augmentée de 1 selon la Défense la plus faible de l'adversaire.",
	},
	dragonize: {
		name: "Peau Draconique",
		desc: "", // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	dragonsmaw: {
		name: "Dent de Dragon",
		shortDesc: "Augmente la puissance des capacités de type Dragon du Pokémon de 50%.",
	},
	drizzle: {
		name: "Crachin",
		shortDesc: "Lorsque le Pokémon est envoyé au combat, il invoque la Pluie.",
	},
	drought: {
		name: "Sécheresse",
		shortDesc: "Lorsque le Pokémon est envoyé au combat, il invoque le Soleil.",
	},
	dryskin: {
		name: "Peau Sèche",
		desc: "Quand le soleil brille, le Pokémon perd des PV et subit plus de dégâts des capacités Feu, mais il regagne des PV lorsqu'il pleut ou s'il est touché par une capacité Eau.",
		shortDesc: "Soigné de 25% par l'Eau et 1/8 sous la Puie, subit x1.25 par le Feu et 1/8 sous le Soleil.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		damage: "  ([POKEMON] est blessé !)",
	},
	earlybird: {
		name: "Matinal",
		shortDesc: "Le compteur de sommeil du Pokémon descend de 2 à la place 1.",
	},
	eartheater: {
		name: "Absorbe-Terre",
		desc: "Si le Pokémon est touché par une capacité de type Sol, il regagne des PV au lieu de subir des dégâts.",
		shortDesc: "Soigne 25% des PV max si touché par une capacité Sol. Immunité Sol.",
	},
	eelevate: {
		name: "", // NEEDS TRANSLATION: not in PokeAPI
		desc: "", // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	effectspore: {
		name: "Pose Spore",
		desc: "Peut paralyser, empoisonner ou endormir l'attaquant lorsque le Pokémon subit une attaque directe.",
		shortDesc: "30% de chance de sommeil/paralysie/poison l'attaquant s'il attaque au contact.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	electricsurge: {
		name: "Créa-Élec",
		shortDesc: "Le Pokémon crée un Champ Électrifié au moment où il entre au combat.",
	},
	electromorphosis: {
		name: "Grecharge",
		shortDesc: "Le Pokémon devient chargé s'il subit une capacité physique.",

		start: "  [POKEMON] a été touché par la capacité [MOVE] et se charge en électricité !",
	},
	embodyaspectcornerstone: {
		name: "Force Mémorielle (de la Pierre)",
		shortDesc: "À son arrivée sur le terrain, la Défense de ce Pokémon est augmentée d'1 cran.",

		boost: "  [POKEMON] fait briller le Masque de la Pierre et sa Défense augmente !",
	},
	embodyaspecthearthflame: {
		name: "Force Mémorielle (du Fourneau)",
		shortDesc: "À son arrivée sur le terrain, l'Attaque de ce Pokémon est augmentée d'1 cran.",

		boost: "  [POKEMON] fait briller le Masque du Fourneau et son Attaque augmente !",
	},
	embodyaspectteal: {
		name: "Force Mémorielle (Turquoise)",
		shortDesc: "À son arrivée sur le terrain, la Vitesse de ce Pokémon est augmentée d'1 cran.",

		boost: "  [POKEMON] fait briller le Masque Turquoise et sa Vitesse augmente !",
	},
	embodyaspectwellspring: {
		name: "Force Mémorielle (du Puits)",
		shortDesc: "À son arrivée sur le terrain, la Défense Spéciale de ce Pokémon est augmentée d'1 cran.",

		boost: "  [POKEMON] fait briller le Masque du Puits et sa Défense Spéciale augmente !",
	},
	emergencyexit: {
		name: "Repli Tactique",
		desc: "Le Pokémon évite les situations inutilement dangereuses. Quand ses PV tombent à la moitié, il se réfugie dans sa Poké Ball.",
		shortDesc: "Si les PV du tombent en dessous de 50%, il se retire automatiquement du combat.",
	},
	fairyaura: {
		name: "Aura Féérique",
		desc: "Augmente la puissance des capacités de type Fée de tous les Pokémon.",
		shortDesc: "La puissance des capacités de type Fée est multipliée par x1.33.",

		start: "  [POKEMON] dégage une aura féérique !",
	},
	filter: {
		name: "Filtre",
		shortDesc: "Le Pokémon reçoit 75% des dégâts d'une attaque super efficace.",
	},
	firemane: {
		name: "", // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	flamebody: {
		name: "Corps Ardent",
		shortDesc: "A 30% de chance de brûler l'attaquant si le Pokémon subit une attaque de contact.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	flareboost: {
		name: "Rage Brûlure",
		desc: "Augmente la puissance des capacités spéciales quand le Pokémon est brûlé.",
		shortDesc: "Si le Pokémon est brûlé, augmente la puissance de ses capacités spéciales de 50%.",
	},
	flashfire: {
		name: "Torche",
		desc: "Lorsque le Pokémon est touché par une capacité de type Feu, il absorbe la chaleur pour renforcer ses propres capacités Feu.",
		shortDesc: "Si touché par une capacité Feu, puissance capacités Feu +50%. Immunisé au Feu.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  [POKEMON] augmente la puissance de ses capacités de type Feu !",
	},
	flowergift: {
		name: "Don Floral",
		desc: "Augmente l’Attaque et la Défense Spéciale du Pokémon et de ses alliés lorsque le soleil brille.",
		shortDesc: "Sous le Soleil, le Pokémon/alliés ont leur Attaque et Déf. Spé augmentées de 50%.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	flowerveil: {
		name: "Flora-Voile",
		desc: "Empêche les alliés de type Plante de subir des baisses de stats et des altérations de statut.",
		shortDesc: "Les alliés de type Plante ne peuvent pas subir de baisse de stat ou problème de statut.",

		block: "  [POKEMON] est protégé par Flora-Voile !",
	},
	fluffy: {
		name: "Boule de Poils",
		desc: "Divise par deux les dégâts des attaques directes subies par le Pokémon, mais double les dégâts des capacités de type Feu.",
		shortDesc: "Divise par 2 les dégâts infligés par des capacités de contact, x2 dégâts des capacités Feu.",
	},
	forecast: {
		name: "Météo",
		desc: "Le Pokémon prend le type Eau, Feu ou Glace en fonction de la météo.",
		shortDesc: "Change le type de Morphéo en fonction de la météo (sauf Tempête de sable)",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	forewarn: {
		name: "Prédiction",
		desc: "Révèle l’une des capacités de l’adversaire quand le combat commence.",
		shortDesc: "Le Pokémon est alerté sur la capacité la plus puissante de l'adversaire.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "  La capacité [MOVE] [TARGET:de] a été détectée !",
		activateNoTarget: "  Prédiction du [POKEMON] lui signale [MOVE]!",
	},
	friendguard: {
		name: "Garde-Ami",
		shortDesc: "Les alliés du Pokémon réduisent les dégâts reçus de 25%.",
	},
	frisk: {
		name: "Fouille",
		shortDesc: "Détecte l'objet des Pokémon ennemis lorsqu'il est envoyé au combat.",
		gen5: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "  [POKEMON] fouille [TARGET] et trouve [ITEM:indefinite:classified] !",
		activateNoTarget: "  [POKEMON] a décelé l'objet: [ITEM]!",
	},
	fullmetalbody: {
		name: "Métallo-Garde",
		shortDesc: "Ce Pokémon est immunisé aux baisses de stats de son adversaire.",
	},
	furcoat: {
		name: "Toison Épaisse",
		shortDesc: "La Défense de ce Pokémon est doublée.",
	},
	galewings: {
		name: "Ailes Bourrasque",
		shortDesc: "Si les PV du Pokémon sont au maximum, ses capacités de type Vol ont une priorité +1.",
		gen6: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	galvanize: {
		name: "Peau Électrique",
		desc: "Les capacités de type Normal deviennent de type Électrik. Leur puissance augmente légèrement.",
		shortDesc: "Les capacités Normal du Pokémon deviennent Électrik, leur puissance augmente de 20%.",
	},
	gluttony: {
		name: "Gloutonnerie",
		desc: "Si le Pokémon tient une Baie à manger en cas de PV bas, il la mange dès qu'il a perdu la moitié de ses PV.",
		shortDesc: "À 50% des PV max ou moins, le Pokémon utilise certaines Baies plus tôt.",
	},
	goodasgold: {
		name: "Corps en Or",
		shortDesc: "Ce Pokémon est immunisé aux capacités de Statut.",
	},
	gooey: {
		name: "Poisseux",
		shortDesc: "Baisse la Vitesse de l'attaquant de 1 si le Pokémon subit une attaque de contact.",
	},
	gorillatactics: {
		name: "Entêtement",
		desc: "Augmente l’Attaque, mais empêche d’utiliser toute autre capacité que celle utilisée en premier par le Pokémon.",
		shortDesc: "Augmente l'Attaque du Pokémon de 50%, mais ne peut utilser que la 1ère capacité choisie.",
	},
	grasspelt: {
		name: "Toison Herbue",
		shortDesc: "La Défense du Pokémon est augmentée de 50% sur un Champ Herbu.",
	},
	grassysurge: {
		name: "Créa-Herbe",
		shortDesc: "Le Pokémon crée un Champ Herbu au moment où il entre au combat.",
	},
	grimneigh: {
		name: "Sombre Ruade",
		desc: "Quand le Pokémon met un ennemi K.O., il émet un hennissement terrifiant qui augmente son Attaque Spéciale.",
		shortDesc: "L'Atq. Spé de ce Pokémon est augmentée de 1 s'il attaque et KO un autre Pokémon.",
	},
	guarddog: {
		name: "Chien de Garde",
		desc: "L’Attaque du Pokémon augmente s’il subit l’effet du talent Intimidation. Les capacités ou objets qui font changer de Pokémon n’ont aucun effet sur lui.",
		shortDesc: "Immunité à Intimidation. Intimidation : +1 Attaque. Ne peut pas être forcé de switch out.",
	},
	gulpmissile: {
		name: "Dégobage",
		desc: "Quand le Pokémon utilise Surf ou Plongée, il revient avec une proie. Lorsqu’il subit des dégâts par la suite, il attaque en recrachant sa proie.",
		shortDesc: "Si touché après Surf/Plongée, l'attaquant subit 25% PV max et -1 Défense/Paralysie.",
	},
	guts: {
		name: "Cran",
		desc: "Augmente l'Attaque du Pokémon s'il est affecté par une altération de statut.",
		shortDesc: "Si le Pokémon subit un statut, Attaque +50%. Ignore baisse d'attaque de brûlure.",
	},
	hadronengine: {
		name: "Moteur à Hadrons",
		shortDesc: "Invoque le Champ Électrifié. Augmente l'Attaque Spéciale de 30% sous Champ Électrifié.",

		start: "  [POKEMON] crée un champ électrifié et active une machine du futur !",
		activate: "  [POKEMON] active une machine du futur grâce au champ électrifié !",
	},
	harvest: {
		name: "Récolte",
		desc: "Permet de réutiliser une même Baie plusieurs fois.",
		shortDesc: "Si l'objet utilisé est une Baie, 50% de chance de la récupérer chaque tour. Soleil : 100%.",

		addItem: "  [POKEMON] a récolté [ITEM:indefinite] !",
	},
	healer: {
		name: "Cœur Soin",
		desc: "Soigne parfois une altération de statut d’un allié proche.",
		shortDesc: "30% de chance soigner le statut d'un allié adjacent à la fin de chaque tour.",
		champions: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	heatproof: {
		name: "Ignifugé",
		desc: "Diminue de moitié les dégâts infligés au Pokémon par les capacités de type Feu.",
		shortDesc: "Dégâts subis par les capacités de type Feu et la brûlure divisés par deux.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	heavymetal: {
		name: "Heavy Metal",
		desc: "Double le poids du Pokémon.",
		shortDesc: "Le poids du Pokémon est doublé.",
	},
	honeygather: {
		name: "Cherche Miel",
		shortDesc: "Pas d'utilisation compétitive.",
	},
	hospitality: {
		name: "Aux Petits Soins",
		shortDesc: "Lorsque ce Pokémon arrive sur le terrain, il restaure 1/4 des PVs maximums de son allié.",

		heal: "  [POKEMON] boit le thé préparé par [SOURCE] !",
	},
	hugepower: {
		name: "Coloforce",
		shortDesc: "L'Attaque du Pokémon est doublée.",
	},
	hungerswitch: {
		name: "Déclic Fringale",
		desc: "À la fin de chaque tour, le Pokémon alterne entre ses formes Mode Rassasié et Mode Affamé.",
		shortDesc: "A la fin de chaque tour, Morpeko alterne entre ses formes Rassasié et Affamé.",
	},
	hustle: {
		name: "Agitation",
		desc: "Améliore l'Attaque du Pokémon, mais diminue la Précision.",
		shortDesc: "Augmente l'Attaque du Pokémon de 50%, mais Précision des capacités physiques -20%.",
	},
	hydration: {
		name: "Hydratation",
		desc: "Soigne les altérations de statut du Pokémon quand il pleut.",
		shortDesc: "Les altérations de statut du Pokémon sont soignées à la fin du tour quand il pleut.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	hypercutter: {
		name: "Hyper Cutter",
		shortDesc: "Ce Pokémon est immunisé aux baisses d'Attaque de son adversaire.",
	},
	icebody: {
		name: "Corps Gel",
		desc: "Régénère peu à peu les PV du Pokémon quand il neige.",
		shortDesc: "Sous la Grêle, restaure 1/16 des PV max du Pokémon chaque tour. Immunisé à la Grêle.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	iceface: {
		name: "Tête de Gel",
		desc: "Le glaçon sur sa tête encaisse les attaques physiques à la place du Pokémon, mais sa destruction modifie son apparence. Le glaçon se reforme quand il neige.",
		shortDesc: "(Bekaglaçon) La première capacité physique inflige 0 dégât. L'effet est restauré si Grêle.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	icescales: {
		name: "Écailles Glacées",
		shortDesc: "Le Pokémon réduit les dégâts des capacités spéciales de 50%.",
	},
	illuminate: {
		name: "Lumiattirance",
		desc: "Le Pokémon illumine les alentours, ce qui empêche sa Précision de baisser.",
		shortDesc: "Pas d'utilisation compétitive.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	illusion: {
		name: "Illusion",
		desc: "Le Pokémon prend l’apparence du dernier membre de l’équipe pour tromper l’adversaire.",
		shortDesc: "Prend l'apparence du dernier Pokémon de l'équipe jusqu'à qu'il subisse des dégâts directs.",

		end: "  L’illusion [POKEMON:de] se brise !",
	},
	immunity: {
		name: "Vaccin",
		shortDesc: "Le Pokémon ne peut pas être empoisonné. Gagner ce Talent soigne le poison.",
	},
	imposter: {
		name: "Imposteur",
		desc: "Le Pokémon prend l’apparence du Pokémon adverse.",
		shortDesc: "Lorsque le Pokémon entre en combat, il prend l'apparence du Pokémon adverse.",
	},
	infiltrator: {
		name: "Infiltration",
		desc: "Traverse les barrières et les clones adverses pour attaquer directement.",
		shortDesc: "Les capacités ignorent clones/Protection/Mur Lumière/Rune Protect/Brume/Voile Aurore.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	innardsout: {
		name: "Expuls’Organes",
		desc: "Le Pokémon inflige à l’adversaire l’ayant mis K.O. des dégâts égaux au nombre de PV qu’il lui restait avant le coup de grâce.",
		shortDesc: "Si le Pokémon est mis KO par une capacité, le lanceur perd le même nombre de PV.",

		damage: "#aftermath",
	},
	innerfocus: {
		name: "Attention",
		desc: "Le Pokémon a un mental à toute épreuve qui empêche les attaques ennemies de lui faire peur. Il est aussi immunisé contre le talent Intimidation.",
		shortDesc: "Le Pokémon ne peut pas être apeuré. Immunisé à Intimidation.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	insomnia: {
		name: "Insomnia",
		shortDesc: "Le Pokémon ne peut pas s'endormir. Gagner ce Talent réveille le Pokémon.",
	},
	intimidate: {
		name: "Intimidation",
		desc: "Le Pokémon rugit lorsqu'il arrive au combat, ce qui intimide l'ennemi et baisse son Attaque.",
		shortDesc: "Baisse l'Attaque des Pokémon adjacents de 1 quand le Pokémon arrive au combat.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	intrepidsword: {
		name: "Lame Indomptable",
		shortDesc: "Augmente l'Attaque du Pokémon de 1 quand il entre au combat.",
		gen8: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	ironbarbs: {
		name: "Épine de Fer",
		desc: "Inflige des dégâts à l’attaquant lorsque le Pokémon subit une attaque directe.",
		shortDesc: "Inflige 1/8 des PV max de l'attaquant si le Pokémon subit une attaque de contact.",

		damage: "#roughskin",
	},
	ironfist: {
		name: "Poing de Fer",
		desc: "Augmente la puissance des capacités coups de poing.",
		shortDesc: "Augmente la puissance des capacités de poing de 20%.",
	},
	justified: {
		name: "Cœur Noble",
		shortDesc: "L'Attaque du Pokémon est augmentée de 1 lorsqu'il est touché par une capacité Ténèbres.",
	},
	keeneye: {
		name: "Regard Vif",
		desc: "Les yeux perçants du Pokémon empêchent sa Précision de baisser.",
		shortDesc: "La Précision du Pokémon ne peut pas être baissée. Ignore l'Esquive adverse.",
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	klutz: {
		name: "Maladresse",
		desc: "Le Pokémon ne peut utiliser aucun objet tenu.",
		shortDesc: "Le Pokémon ne peut pas utiliser son objet, sauf Bracelet Macho. Dégommage inutilisable.",
	},
	leafguard: {
		name: "Feuille Garde",
		desc: "Protège le Pokémon contre les altérations de statut quand le soleil brille.",
		shortDesc: "Le Pokémon ne peut pas subir de problème de statut sous le Soleil. (y compris Repos)",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	levitate: {
		name: "Lévitation",
		desc: "Le Pokémon flotte, ce qui l'immunise contre les capacités de type Sol.",
		shortDesc: "Le Pokémon est immunisé au type Sol. Annulé par Gravité/Racines/Anti-Air/Balle Fer.",
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	libero: {
		name: "Libéro",
		desc: "Le Pokémon prend le type de la capacité qu’il utilise. Ce talent ne peut se déclencher qu’une fois par entrée au combat du Pokémon.",
		shortDesc: "Le Pokémon voit son type remplacé par celui de la capacité qu'il utilise.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	lightmetal: {
		name: "Light Metal",
		desc: "Divise par deux le poids du Pokémon.",
		shortDesc: "Le poids du Pokémon est divisé par 2.",
	},
	lightningrod: {
		name: "Paratonnerre",
		desc: "Le Pokémon détourne sur lui les capacités de type Électrik et les neutralise, tout en augmentant son Attaque Spéciale.",
		shortDesc: "Attire les capacités Électrik pour augmenter son Atq. Spé de 1. Immunisé au type Électrik.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "  [POKEMON] attire l’attaque sur lui !",
	},
	limber: {
		name: "Échauffement",
		shortDesc: "Le Pokémon ne peut pas être paralysé. Gagner ce Talent soigne la paralysie.",
	},
	lingeringaroma: {
		name: "Odeur Tenace",
		desc: "Lorsque le Pokémon subit une attaque directe, le talent de l’attaquant est remplacé par Odeur Tenace.",
		shortDesc: "Change le Talent de l'attaquant en Odeur Tenace si le Pokémon subit une attaque contact.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		changeAbility: "  Une odeur tenace imprègne [TARGET] !",
	},
	liquidooze: {
		name: "Suintement",
		shortDesc: "Les PV drainés sur ce Pokémon sont convertis en dégâts.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		damage: "  [POKEMON] aspire le suintement !",
	},
	liquidvoice: {
		name: "Hydrata-Son",
		desc: "Toutes les attaques sonores du Pokémon prennent le type Eau.",
		shortDesc: "Toutes les capacités sonores du Pokémon prennent le type Eau.",
	},
	longreach: {
		name: "Longue Portée",
		shortDesc: "Toutes les capacités du lanceur sont considérées comme sans contact.",
	},
	magicbounce: {
		name: "Miroir Magik",
		desc: "Annule les effets des capacités de statut subies par le Pokémon et les retourne à l’envoyeur.",
		shortDesc: "Le Pokémon n'est pas touché par les capacités de statut et les renvoie au lanceur.",
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "Garde Magik",
		desc: "Seules les attaques peuvent blesser le Pokémon.",
		shortDesc: "Le Pokémon ne peut subir que des dégâts directs.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	magician: {
		name: "Magicien",
		desc: "Les capacités volent aussi l’objet tenu par la cible.",
		shortDesc: "Si le Pokémon n'a pas d'objet et touche son adversaire, il lui vole son objet.",
	},
	magmaarmor: {
		name: "Armumagma",
		shortDesc: "Le Pokémon ne peut pas être gelé. Gagner ce Talent soigne le gel.",
	},
	magnetpull: {
		name: "Magnépiège",
		desc: "Attire les Pokémon Acier grâce à un champ magnétique, ce qui les empêche de quitter le terrain.",
		shortDesc: "Empêche les Pokémon adjacents de type Acier de switcher.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	marvelscale: {
		name: "Écaille Spéciale",
		shortDesc: "Si ce Pokémon subit un statut, augmente sa Défense de 50%",
	},
	megalauncher: {
		name: "Méga Blaster",
		desc: "Augmente la puissance des capacités qui projettent une aura.",
		shortDesc: "Augmente la puissance/soin des capacités à aura du Pokémon de 50%.",
	},
	megasol: {
		name: "Méga-Soleil",
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	merciless: {
		name: "Cruauté",
		shortDesc: "Les attaques du Pokémon sont des coups critiques sur une cible empoisonnée.",
	},
	mimicry: {
		name: "Mimétisme",
		desc: "Le Pokémon adopte le même type que le terrain lorsqu’un champ est actif.",
		shortDesc: "Le type du Pokémon change en fonction du Champ actif.",

		activate: "  [POKEMON] a repris son type d’origine !",
	},
	mindseye: {
		name: "Œil Révélateur",
		desc: "Le Pokémon ignore les changements d’Esquive des cibles et peut toucher les Pokémon Spectre avec des capacités Normal ou Combat. Sa Précision ne peut pas baisser.",
		shortDesc: "Capacités Normal et Combat touchent Spectre. Précision ne baisse pas. Ignore esquive.",
	},
	minus: {
		name: "Moins",
		desc: "L’Attaque Spéciale du Pokémon augmente si un Pokémon allié a le talent Moins ou Plus.",
		shortDesc: "Si un allié actif a ce Talent ou le Talent Plus, l'Atq Spé de ce Pokémon augmente de 50%.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	mirrorarmor: {
		name: "Armure Miroir",
		desc: "Le Pokémon renvoie les effets réducteurs de stats qu’il reçoit.",
		shortDesc: "Le Pokémon renvoie les baisses de stats à l'attaquant.",
	},
	mistysurge: {
		name: "Créa-Brume",
		shortDesc: "Le Pokémon crée un Champ Brumeux au moment où il entre au combat.",
	},
	moldbreaker: {
		name: "Brise Moule",
		desc: "Le Pokémon ignore les talents adverses qui auraient un effet sur ses capacités.",
		shortDesc: "Les capacités du Pokémon et leurs effets ignorent les Talents des autres Pokémon.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  [POKEMON] brise le moule !",
	},
	moody: {
		name: "Lunatique",
		desc: "Augmente beaucoup une stat du Pokémon et en baisse une autre au hasard à chaque tour.",
		shortDesc: "Chaque fin de tour, boost une stat aléatoire (pas Pré/Esq) de +2 et une autre de -1.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	motordrive: {
		name: "Motorisé",
		desc: "Si le Pokémon est touché par une capacité de type Électrik, il ne subit aucun dégât et sa Vitesse augmente.",
		shortDesc: "Augmente la Vitesse du Pokémon si touché par une capacité Électrik. Immunité Électrik.",
	},
	moxie: {
		name: "Impudence",
		desc: "Quand le Pokémon met un ennemi K.O., sa confiance en lui ne connaît plus de limite et son Attaque augmente.",
		shortDesc: "L'Attaque de ce Pokémon est augmentée de 1 s'il attaque et KO un autre Pokémon.",
	},
	multiscale: {
		name: "Multiécaille",
		shortDesc: "Si le Pokémon a tous ses PV, les dégâts subis par des attaques sont divisés par 2.",
	},
	multitype: {
		name: "Multi-Type",
		shortDesc: "Si le Pokémon est Arceus, change son type en fonction de la Plaque/Cristal Z porté.",
		gen7: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	mummy: {
		name: "Momie",
		desc: "Lorsque le Pokémon subit une attaque directe, le talent de l’attaquant est remplacé par Momie.",
		shortDesc: "Change le Talent de l'attaquant en Momie si le Pokémon subit une attaque de contact.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		changeAbility: "  Le talent [TARGET:de] devient Momie !",
	},
	myceliummight: {
		name: "Force Fongique",
		desc: "Le Pokémon agit toujours plus lentement quand il utilise une capacité de statut, mais il ignore les talents adverses.",
		shortDesc: "Les capacités de Statut du Pokémon s'activent en dernier mais ignorent les Talents.",
	},
	naturalcure: {
		name: "Médic Nature",
		shortDesc: "Le Pokémon soigne ses problèmes de statut en switchant.",

		activate: "", // NEEDS TRANSLATION: Showdown custom text
	},
	neuroforce: {
		name: "Cérébro-Force",
		desc: "Augmente encore plus la puissance des attaques super efficaces.",
		shortDesc: "Les dégâts des attaques super efficaces du Pokémon sont augmentés de 25%.",
	},
	neutralizinggas: {
		name: "Gaz Inhibiteur",
		desc: "Si un Pokémon avec Gaz Inhibiteur est sur le terrain, les effets des talents de tous les autres Pokémon ne s’activent pas ou sont neutralisés.",
		shortDesc: "Les Talents des autres Pokémon n'ont aucun effet.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  Un gaz inhibiteur envahit les lieux !",
		end: "  Les effets du gaz inhibiteur se sont dissipés.",
	},
	noguard: {
		name: "Annule Garde",
		shortDesc: "Toutes les capacités du Pokémon ou contre le Pokémon n'échouent jamais.",
	},
	normalize: {
		name: "Normalise",
		desc: "Toutes les capacités du Pokémon deviennent de type Normal, quel que soit leur type original. Leur puissance augmente légèrement.",
		shortDesc: "Les capacités du Pokémon deviennent de type Normal, leur puissance augmente de 20%.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	oblivious: {
		name: "Benêt",
		desc: "Le Pokémon est un grand benêt, ce qui l'immunise contre l'attraction, la provocation ou l'intimidation.",
		shortDesc: "Le Pokémon ne peut pas être Attiré ou Provoqué. Immunisé à Intimidation.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	opportunist: {
		name: "Opportuniste",
		shortDesc: "Quand l'adversaire reçoit des boosts de stats, le Pokémon récupère les mêmes boosts.",
	},
	orichalcumpulse: {
		name: "Pouls Orichalque",
		shortDesc: "Invoque le Soleil. Augmente l'Attaque de 30% sous le Soleil.",

		start: "  Le soleil brille et [POKEMON] libère l’énergie d’une pulsation primitive !",
		activate: "  [POKEMON] tire profit des rayons du soleil et libère l’énergie d’une pulsation primitive !",
	},
	overcoat: {
		name: "Envelocape",
		desc: "Protège des dégâts occasionnés par les tempêtes de sable, ainsi que des effets des capacités qui libèrent de la poudre et des spores.",
		shortDesc: "Le Pokémon est immunisé à la Tempête de Sable, la Grêle et aux capacités de poudre.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	overgrow: {
		name: "Engrais",
		desc: "Augmente la puissance des capacités de type Plante du Pokémon quand il a perdu une certaine quantité de PV.",
		shortDesc: "Si PV < 33% PV max, augmente la puissance des capacités Plante du Pokémon de 50%.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	owntempo: {
		name: "Tempo Perso",
		desc: "Le Pokémon vit sa vie à son propre rythme, ce qui l'immunise contre la confusion et l'intimidation.",
		shortDesc: "Le Pokémon ne peut pas être confus. Immunisé à Intimidation.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	parentalbond: {
		name: "Amour Filial",
		desc: "La mère et son petit unissent leurs forces pour attaquer deux fois d’affilée.",
		shortDesc: "Les capacités offensives touchent deux fois. Le deuxième coup inflige 25% des dégâts.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	pastelveil: {
		name: "Voile Pastel",
		desc: "Protège le Pokémon et ses alliés contre toutes les altérations de statut liées à l’empoisonnement.",
		shortDesc: "Le Pokémon et ses alliés ne peuvent pas être empoisonné. Switch-in : soigne le poison.",
	},
	perishbody: {
		name: "Corps Condamné",
		desc: "Lorsque le Pokémon est directement touché par une capacité, l’assaillant et lui tomberont K.O. dans trois tours, à moins qu’ils ne soient remplacés entre temps.",
		shortDesc: "Déclenche Requiem sur les deux Pokémon si le Pokémon subit une attaque de contact.",

		start: "  Les deux Pokémon seront K.O. dans trois tours !",
	},
	pickpocket: {
		name: "Pickpocket",
		desc: "Vole l’objet que tient l’attaquant quand le Pokémon subit une attaque directe.",
		shortDesc: "Si pas d'objet et touché par une attaque de contact, vole l'objet de l'attaquant.",
	},
	pickup: {
		name: "Ramassage",
		desc: "Permet parfois au Pokémon de ramasser les objets que d’autres Pokémon ont utilisés. Il lui arrive aussi d’en trouver hors des combats.",
		shortDesc: "Si le Pokémon n'a pas d'objet, il en trouve un utilisé ce tour par un Pokémon adjacent.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "Transperceuse",
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	pixilate: {
		name: "Peau Féérique",
		desc: "Les capacités de type Normal deviennent de type Fée. Leur puissance augmente légèrement.",
		shortDesc: "Les capacités Normal du Pokémon deviennent Fée, leur puissance augmente de 20%.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	plus: {
		name: "Plus",
		desc: "L’Attaque Spéciale du Pokémon augmente si un Pokémon allié a le talent Moins ou Plus.",
		shortDesc: "Si un allié actif a ce Talent ou le Talent Minus, l'Atq Spé de ce Pokémon augmente de 50%.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	poisonheal: {
		name: "Soin Poison",
		desc: "Quand le Pokémon est empoisonné, il regagne des PV au lieu d’en perdre.",
		shortDesc: "Si le Pokémon est empoisonné, il récupère 1/8 de ses PV max chaque tour (pas de dégâts)",
	},
	poisonpoint: {
		name: "Point Poison",
		shortDesc: "A 30% de chance d'empoisonner l'attaquant si le Pokémon subit une attaque de contact.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	poisonpuppeteer: {
		name: "Emprise Toxique",
		desc: "Lorsque Pêchaminus empoisonne un Pokémon grâce à l’une de ses capacités, ce dernier devient également confus.",
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	poisontouch: {
		name: "Toxitouche",
		desc: "Peut empoisonner l’ennemi par simple contact.",
		shortDesc: "Les attaques de contact du Pokémon ont 30% de chance d'empoisonner.",
	},
	powerconstruct: {
		name: "Rassemblement",
		desc: "Lorsque le Pokémon perd la moitié de ses PV, ses Cellules se rassemblent pour l’encourager, ce qui lui permet de prendre sa Forme Parfaite.",
		shortDesc: "Si Zygarde 10%/50%, transforme en Complet si 50% PV max ou moins à la fin du tour.",

		activate: "  Vous sentez la présence d’un grand nombre d’individus !",
		transform: "[POKEMON] prend sa Forme Parfaite !",
	},
	powerofalchemy: {
		name: "Osmose",
		desc: "Le Pokémon acquiert le talent d’un allié mis K.O.",
		shortDesc: "Le Pokémon obtient le Talent d'un allié qui tombe KO",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "Cercle d’Énergie",
		desc: "Augmente la puissance des capacités des Pokémon qui se trouvent à proximité.",
		shortDesc: "Augmente la puissance des capacités des alliés de 30%.",
	},
	prankster: {
		name: "Farceur",
		desc: "Rend les capacités de statut du Pokémon prioritaires.",
		shortDesc: "Augmente la priorité des capacités de statut de 1, mais type Ténèbres sont immunisés.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	pressure: {
		name: "Pression",
		desc: "Met la pression à l’adversaire pour le forcer à dépenser plus de PP.",
		shortDesc: "Les capacités ennemies ciblant le Pokémon perdent un PP supplémentaire.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  [POKEMON] augmente la pression !",
	},
	primordialsea: {
		name: "Mer Primaire",
		desc: "Altère les conditions météo pour neutraliser les attaques de type Feu.",
		shortDesc: "Invoque une Pluie battante qui rend inefficaces les attaques Feu.",
	},
	prismarmor: {
		name: "Prisme-Armure",
		shortDesc: "Le Pokémon reçoit 75% des dégâts d'une attaque super efficace.",
	},
	propellertail: {
		name: "Propulseur",
		shortDesc: "Les capacités du Pokémon ne peuvent pas être redirigées vers une autre cible.",
	},
	protean: {
		name: "Protéen",
		desc: "Le Pokémon prend le type de la capacité qu’il utilise. Ce talent ne peut se déclencher qu’une fois par entrée au combat du Pokémon.",
		shortDesc: "Le Pokémon voit son type remplacé par celui de la capacité qu'il utilise.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	protosynthesis: {
		name: "Paléosynthèse",
		desc: "Quand le soleil brille ou que le Pokémon tient une capsule d’Énergie Booster, sa stat la plus élevée augmente.",
		shortDesc: "Si le Soleil ou Énergie Booster est actif, meilleure stat +30%, +50% si Vitesse.",

		activate: "  Le soleil brille, ce qui a permis à [POKEMON] d’activer Paléosynthèse !",
		activateFromItem: "  [POKEMON] a activé Paléosynthèse grâce à son Énergie Booster !",
		start: "  [STAT:definite:capitalize] [POKEMON:de] est renforcée !",
		end: "  L’effet du talent Paléosynthèse [POKEMON:de] s’est dissipé !",
	},
	psychicsurge: {
		name: "Créa-Psy",
		shortDesc: "Le Pokémon crée un Champ Psychique au moment où il entre au combat.",
	},
	punkrock: {
		name: "Punk Rock",
		desc: "Augmente la puissance des capacités basées sur le son. Le Pokémon ne subit que la moitié des dégâts quand il est touché par ce genre de capacités.",
		shortDesc: "Puissance des capacités de son sur le Pokémon : -50% ; du Pokémon : +30%.",
	},
	purepower: {
		name: "Force Pure",
		shortDesc: "L'Attaque du Pokémon est doublée.",
	},
	purifyingsalt: {
		name: "Sel Purificateur",
		desc: "Le sel pur immunise le Pokémon contre les altérations de statut, et diminue de moitié les dégâts des capacités de type Spectre.",
		shortDesc: "Ne peut pas souffrir du statut et ne subit que la moitié des dégâts des capacités Spectre.",
	},
	quarkdrive: {
		name: "Charge Quantique",
		desc: "Quand un champ électrifié est actif ou que le Pokémon tient une capsule d’Énergie Booster, sa stat la plus élevée augmente.",
		shortDesc: "Si Champ Électrifié ou Énergie Booster est actif, meilleure stat +30%, +50% si Vitesse.",

		activate: "  [POKEMON] a activé Charge Quantique grâce au champ électrifié !",
		activateFromItem: "  [POKEMON] a activé Charge Quantique grâce à son Énergie Booster !",
		start: "  [STAT:definite:capitalize] [POKEMON:de] est renforcée !",
		end: "  L’effet du talent Charge Quantique [POKEMON:de] s’est dissipé !",
	},
	queenlymajesty: {
		name: "Prestance Royale",
		desc: "L’adversaire est impressionné par la majesté du Pokémon, ce qui l’empêche de viser ce dernier et ses alliés avec une capacité prioritaire.",
		shortDesc: "Le Pokémon empêche les adversaires d'utiliser les capacités de priorité.",

		block: "#damp",
	},
	quickdraw: {
		name: "Tir Vif",
		shortDesc: "Le Pokémon a 30% de chance d'agir en premier dans son groupe de priorité.",

		activate: "  Tir Vif permet à [POKEMON] d’agir plus vite que d’habitude !",
	},
	quickfeet: {
		name: "Pied Véloce",
		desc: "Augmente la Vitesse du Pokémon en cas d'altération de statut.",
		shortDesc: "Vitesse +50% si le Pokémon souffre d'un statut. Ignore la baisse de Vitesse de paralysie.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	raindish: {
		name: "Cuvette",
		desc: "Le Pokémon récupère progressivement des PV lorsqu'il pleut.",
		shortDesc: "Sous la Pluie, restaure 1/16 des PV max du Pokémon chaque tour.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	rattled: {
		name: "Phobique",
		desc: "Si le Pokémon est touché par le talent Intimidation ou une attaque de type Ténèbres, Spectre ou Insecte, sa phobie se révèle et sa Vitesse augmente.",
		shortDesc: "Vitesse +1 si touché par une capacité Insecte, Spectre, Ténèbres, ou Intimiation.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	receiver: {
		name: "Receveur",
		desc: "Le Pokémon reçoit le talent d’un allié mis K.O.",
		shortDesc: "Le Pokémon obtient le Talent d'un allié qui tombe KO",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		changeAbility: "  Le Pokémon reçoit le talent [ABILITY] [SOURCE:de] !",
	},
	reckless: {
		name: "Téméraire",
		desc: "Augmente la puissance des capacités occasionnant un contrecoup.",
		shortDesc: "Les capacités avec contrecoup et leur contrecoup ont leur puissance +20%. (sauf Lutte)",
	},
	refrigerate: {
		name: "Peau Gelée",
		desc: "Les capacités de type Normal deviennent de type Glace. Leur puissance augmente légèrement.",
		shortDesc: "Les capacités Normal du Pokémon deviennent Glace, leur puissance augmente de 20%.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	regenerator: {
		name: "Régé-Force",
		shortDesc: "Le Pokémon récupère 33% de ses PV max lorsqu'il se retire du combat.",
	},
	ripen: {
		name: "Mûrissement",
		desc: "Le Pokémon fait mûrir la Baie qu’il tient et double ainsi son effet.",
		shortDesc: "Lorsque ce Pokémon mange sa Baie, ses effets sont doublés.",
	},
	rivalry: {
		name: "Rivalité",
		desc: "Le Pokémon déteste la concurrence et inflige plus de dégâts si sa cible est du même sexe. Par contre, il en inflige moins si sa cible est du sexe opposé.",
		shortDesc: "Puissance capacités du Pokémon +25% sur les cibles même genre, -25% genre opposé.",
	},
	rkssystem: {
		name: "Système Alpha",
		shortDesc: "Si le Pokémon est Silvallié, change son type en fonction de la ROM portée.",
	},
	rockhead: {
		name: "Tête de Roc",
		desc: "Le Pokémon peut utiliser des capacités occasionnant un contrecoup sans perdre de PV.",
		shortDesc: "Le Pokémon ne subit pas de dégâts de recul sauf Lutte/Orbe Vie/Dégâts de chute.",
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	rockypayload: {
		name: "Porte-Roche",
		shortDesc: "Augmente la puissance des capacités de type Roche du Pokémon de 50%.",
	},
	roughskin: {
		name: "Peau Dure",
		desc: "Blesse l'attaquant lorsque le Pokémon subit une attaque directe.",
		shortDesc: "Inflige 1/8 des PV max de l'attaquant si le Pokémon subit une attaque de contact.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		damage: "  [POKEMON] est blessé !",
	},
	runaway: {
		name: "Fuite",
		shortDesc: "Pas d'utilisation compétitive.",
	},
	sandforce: {
		name: "Force Sable",
		desc: "Augmente la puissance des capacités de types Roche, Sol et Acier en cas de tempête de sable.",
		shortDesc: "Tempête de sable : Puissance Sol/Roche/Acier du Pokémon +30%, pas de dégâts météo.",
	},
	sandrush: {
		name: "Baigne Sable",
		desc: "Augmente la Vitesse lors des tempêtes de sable.",
		shortDesc: "Tempête de sable : Vitesse du Pokémon x2, pas de dégâts météo.",
	},
	sandspit: {
		name: "Expul’Sable",
		shortDesc: "Le Pokémon invoque une Tempête de sable quand il est touché.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	sandstream: {
		name: "Sable Volant",
		shortDesc: "Le Pokémon invoque une Tempête de sable quand il entre au combat.",
	},
	sandveil: {
		name: "Voile Sable",
		desc: "Augmente l'Esquive du Pokémon lors des tempêtes de sable.",
		shortDesc: "Tempête de sable : Esquive du Pokémon +25%, pas de dégâts météo.",
	},
	sapsipper: {
		name: "Herbivore",
		desc: "Annule les attaques de type Plante subies par le Pokémon et augmente son Attaque.",
		shortDesc: "Augmente l'Attaque du Pokémon si touché par une capacité Plante. Immunité Plante.",
	},
	schooling: {
		name: "Banc",
		desc: "Le Pokémon se rassemble avec ses congénères quand ses PV sont élevés. Quand il ne lui reste plus beaucoup de PV, le banc se disperse.",
		shortDesc: "Froussardine : Forme Banc si plus de 25% PV max, sinon Forme Solitaire.",

		transform: "[POKEMON] forme un banc !",
		transformEnd: "Le banc [POKEMON:de] se désagrège !",
	},
	scrappy: {
		name: "Querelleur",
		desc: "Permet aux capacités de type Normal ou Combat du Pokémon de toucher les Pokémon de type Spectre. Immunise aussi contre le talent Intimidation.",
		shortDesc: "Les capacités Normal et Combat touchent le type Spectre. Immunisé à Intimidation.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	screencleaner: {
		name: "Brise-Barrière",
		shortDesc: "Entre au combat : Mur Lumière/Protection/Voile Aurore disparaissent des deux côtés.",
	},
	seedsower: {
		name: "Semencier",
		shortDesc: "Si le Pokémon est touché par une capacité, invoque le Champ Herbu.",
	},
	serenegrace: {
		name: "Sérénité",
		desc: "Augmente les chances d'infliger des effets additionnels.",
		shortDesc: "Les effets secondaires des capacités du Pokémon ont 2 fois plus de chance d'être activés.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	shadowshield: {
		name: "Spectro-Bouclier",
		shortDesc: "Si le Pokémon a tous ses PV, les dégâts subis par des attaques sont divisés par 2.",
	},
	shadowtag: {
		name: "Marque Ombre",
		desc: "Empêche les Pokémon ennemis de quitter le terrain.",
		shortDesc: "Empêche les ennemis adjacents de switcher (sauf s'ils ont aussi Marque Ombre).",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	sharpness: {
		name: "Incisif",
		shortDesc: "Augmente la puissance des capacités tranchantes de 50%",
	},
	shedskin: {
		name: "Mue",
		desc: "Le Pokémon soigne parfois ses altérations de statut en muant.",
		shortDesc: "Le Pokémon a 33% de chance de soigner ses problèmes de statut à la fin de chaque tour.",
	},
	sheerforce: {
		name: "Sans Limite",
		desc: "Les capacités ayant un effet additionnel le perdent, mais leur puissance augmente.",
		shortDesc: "Puissance des attaques du Pokémon avec effets secondaires +30%, annule les effets.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	shellarmor: {
		name: "Coque Armure",
		shortDesc: "Ce Pokémon ne peut pas subir de coup critique.",
	},
	shielddust: {
		name: "Écran Poudre",
		desc: "Le Pokémon dispose d'un écran naturel qui le protège des effets additionnels des attaques ennemies.",
		shortDesc: "Le Pokémon n'est pas affecté par les effets secondaires des attaques des autres Pokémon.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	shieldsdown: {
		name: "Bouclier-Carcan",
		desc: "Lorsque le Pokémon perd la moitié de ses PV, son enveloppe se brise et il adopte une posture offensive.",
		shortDesc: "Météno : switch-in/fin du tour change en forme Noyau si HP < 50%, sinon Météore.",

		transform: "Le talent Bouclier-Carcan s’active !",
		transformEnd: "Le talent Bouclier-Carcan n’est plus actif !",
	},
	simple: {
		name: "Simple",
		shortDesc: "Quand le Pokémon obient une hausse ou baisse de stat, l'effet est doublé.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	skilllink: {
		name: "Multi-Coups",
		desc: "Les capacités pouvant frapper plusieurs fois frappent toujours le nombre maximal de coups.",
		shortDesc: "Le Pokémon effectue toujours le maximum de coups pour les capacités à coups multiples.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	slowstart: {
		name: "Début Calme",
		shortDesc: "Divise la Vitesse et l'Attaque du Pokémon par 2 pendant les 5 premiers tours du combat.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  [POKEMON] n’arrive pas à se motiver !",
		end: "  [POKEMON] arrive enfin à s’y mettre sérieusement !",
	},
	slushrush: {
		name: "Chasse-Neige",
		shortDesc: "La Vitesse du Pokémon est doublée sous la Grêle.",
		gen8: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	sniper: {
		name: "Sniper",
		shortDesc: "Les dégâts infligés par un coup critique sont augmentés de 50%",
	},
	snowcloak: {
		name: "Rideau Neige",
		desc: "Augmente l'Esquive du Pokémon quand il neige.",
		shortDesc: "Augmente l'Esquive du Pokémon de 25% sous la Grêle. Immunisé à la Grêle.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	snowwarning: {
		name: "Alerte Neige",
		shortDesc: "Déclenche une tempête de Grêle quand le Pokémon entre au combat.",
		gen8: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	solarpower: {
		name: "Force Soleil",
		desc: "Quand le soleil brille, l'Attaque Spéciale du Pokémon augmente mais il perd des PV à chaque tour.",
		shortDesc: "Augmente l'Atq. Spé du Pokémon de 50% sous le Soleil, inflige 1/8 des PV max par tour.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	solidrock: {
		name: "Solide Roc",
		shortDesc: "Le Pokémon reçoit 75% des dégâts d'une attaque super efficace.",
	},
	soulheart: {
		name: "Animacœur",
		shortDesc: "Augmente l'Atq. Spé du Pokémon de 1 quand un autre Pokémon tombe KO",
	},
	soundproof: {
		name: "Anti-Bruit",
		shortDesc: "Le Pokémon est immunisé aux capacités de son, y compris Glas de Soin.",
		gen7: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	speedboost: {
		name: "Turbo",
		desc: "La Vitesse du Pokémon augmente à chaque tour.",
		shortDesc: "La Vitesse du Pokémon est augmentée de 1 à la fin de chaque tour.",
	},
	spicyspray: {
		name: "Habanéruption",
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	stakeout: {
		name: "Filature",
		shortDesc: "Inflige le double de dégâts contre une cible ayant switch-in ce tour.",
	},
	stall: {
		name: "Frein",
		shortDesc: "Le Pokémon agit en dernier dans son groupe de priorité.",
	},
	stalwart: {
		name: "Nerfs d’Acier",
		shortDesc: "Les capacités du Pokémon ne peuvent pas être redirigées vers une autre cible.",
	},
	stamina: {
		name: "Endurance",
		shortDesc: "La Défense du Pokémon augmente de 1 après qu'il ait subi les dégâts d'une attaque.",
	},
	stancechange: {
		name: "Déclic Tactique",
		desc: "Le Pokémon prend la Forme Assaut lorsqu’il utilise une capacité offensive, et la Forme Parade lorsqu’il utilise Bouclier Royal.",
		shortDesc: "Exagide : change en Forme Assaut avant d'attaquer et Forme Parade avant Bouclier Royal.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		transform: "Passage en Forme Assaut !",
		transformEnd: "Passage en Forme Parade !",
	},
	static: {
		name: "Statik",
		shortDesc: "A 30% de chance de paralyser l'attaquant si le Pokémon subit une attaque de contact.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	steadfast: {
		name: "Impassible",
		shortDesc: "Si le Pokémon est apeuré, sa Vitesse augmente de 1.",
	},
	steamengine: {
		name: "Turbine",
		desc: "Lorsque le Pokémon est touché par des capacités de type Eau ou Feu, sa Vitesse augmente énormément.",
		shortDesc: "Augmente la Vitesse du Pokémon de 6 crans après être touché par une capacité Feu/Eau.",
	},
	steelworker: {
		name: "Expert Acier",
		shortDesc: "Augmente la puissance des capacités de type Acier du Pokémon de 50%.",
	},
	steelyspirit: {
		name: "Boost Acier",
		desc: "Augmente la puissance des attaques de type Acier du Pokémon et de ses alliés.",
		shortDesc: "Augmente la puissance des capacités de type Acier du Pokémon et ses alliés de 50%.",
	},
	stench: {
		name: "Puanteur",
		desc: "Le Pokémon émet une odeur si nauséabonde qu'il peut effrayer sa cible en l'attaquant.",
		shortDesc: "Les capacités du Pokémon sans chance d'apeurer ont 10% de chance d'apeurer.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	stickyhold: {
		name: "Glu",
		desc: "Les objets sont collés au corps gluant du Pokémon, ce qui empêche ses adversaires de les dérober.",
		shortDesc: "Ce Pokémon ne peut pas perdre son objet avec une capacité d'un Pokémon.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		block: "  L’objet [POKEMON:de] ne peut pas être volé !",
	},
	stormdrain: {
		name: "Lavabo",
		desc: "Le Pokémon détourne sur lui les capacités de type Eau et les neutralise, tout en augmentant son Attaque Spéciale.",
		shortDesc: "Attire les capacités Eau pour augmenter son Atq. Spé de 1. Immunisé au type Eau.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "Prognathe",
		desc: "Le Pokémon a une mâchoire robuste qui augmente la puissance de ses capacités de morsure.",
		shortDesc: "Le Pokémon augmente la puissance de ses attaques à base de morsures de 50%.",
	},
	sturdy: {
		name: "Fermeté",
		desc: "Le Pokémon encaisse toujours au moins une attaque s’il a tous ses PV. Il est également immunisé contre les capacités pouvant mettre K.O. en un coup.",
		shortDesc: "Si le Pokémon a tous ses PV, il survit un coup avec au moins 1 PV. Immunité aux OHKO.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "  [POKEMON] encaisse les coups !",
	},
	suctioncups: {
		name: "Ventouse",
		shortDesc: "Le Pokémon ne peut pas être forcé à switcher par une attaque/objet d'un autre Pokémon.",

		block: "  [POKEMON] s’accroche avec ses ventouses !",
	},
	superluck: {
		name: "Chanceux",
		shortDesc: "Le taux de coup critiques du Pokémon est augmenté de 1.",
	},
	supersweetsyrup: {
		name: "Nectar Mielleux",
		shortDesc: "Lorsqu'il arrive sur le terrain, diminue l'Esquive des Pokémon adverses adjacents d'1 cran.",

		start: "  Le nectar [POKEMON:de] dégage un parfum sucré !",
	},
	supremeoverlord: {
		name: "Général Suprême",
		desc: "Quand le Pokémon entre sur le terrain, son Attaque et son Attaque Spéciale augmentent légèrement pour chaque allié mis K.O. auparavant.",
		shortDesc: "L'Attaque et l'Attaque Spéciale du lanceur augmentent de 10% par allié KO.",

		activate: "  [POKEMON] reçoit la puissance de ses alliés mis K.O. !",
	},
	surgesurfer: {
		name: "Surf Caudal",
		shortDesc: "La Vitesse du Pokémon est doublée sur un Champ Électrifié.",
	},
	swarm: {
		name: "Essaim",
		desc: "Augmente la puissance des capacités de type Insecte du Pokémon quand il a perdu une certaine quantité de PV.",
		shortDesc: "Si PV < 33% PV max, augmente la puissance des capacités Insecte du Pokémon de 50%.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	sweetveil: {
		name: "Gluco-Voile",
		desc: "Le Pokémon et ses alliés ne peuvent pas s’endormir.",
		shortDesc: "Le Pokémon et ses alliés ne peuvent pas s'endormir.",

		block: "  Gluco-Voile empêche [POKEMON] de dormir !",
	},
	swiftswim: {
		name: "Glissade",
		desc: "Augmente la Vitesse du Pokémon s'il pleut.",
		shortDesc: "La Vitesse du Pokémon est doublée sous la Pluie.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	swordofruin: {
		name: "Épée du Fléau",
		shortDesc: "La Défense de tous les autres Pokémon actifs est réduite de 25%.",

		start: "  L’Épée du Fléau [POKEMON:de] affaiblit la Défense des Pokémon alentour !",
	},
	symbiosis: {
		name: "Symbiose",
		desc: "Quand les alliés utilisent l’objet qu’ils tiennent, le Pokémon leur donne l’objet qu’il tient en remplacement.",
		shortDesc: "Si un allié utilise son objet, le Pokémon donne immédiatement son objet à cet allié.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "  [POKEMON] donne [ITEM:definite:classified] à [TARGET] !",
	},
	synchronize: {
		name: "Synchro",
		desc: "Quand le Pokémon est brûlé, paralysé ou empoisonné par un autre Pokémon, il partage ce statut avec celui-ci.",
		shortDesc: "Si un autre Pokémon brûle/empoisonne/paralyse ce Pokémon, il subit également le statut.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	tabletsofruin: {
		name: "Bois du Fléau",
		shortDesc: "L'Attaque de tous les autres Pokémon actifs est réduite de 25%.",

		start: "  Le Bois du Fléau [POKEMON:de] affaiblit l’Attaque des Pokémon alentour !",
	},
	tangledfeet: {
		name: "Pieds Confus",
		shortDesc: "L'Esquive du Pokémon est doublée lorsqu'il est confus.",
	},
	tanglinghair: {
		name: "Mèche Rebelle",
		shortDesc: "Baisse la Vitesse de l'attaquant de 1 si le Pokémon subit une attaque de contact.",
	},
	technician: {
		name: "Technicien",
		desc: "Augmente la puissance des capacités les plus faibles.",
		shortDesc: "Augmente les capacités dont la puissance est 60 ou moins de 50%. (y compris Lutte)",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	telepathy: {
		name: "Télépathe",
		shortDesc: "Le Pokémon ne prend pas de dégâts des attaques de ses alliés.",

		block: "  [POKEMON] ne peut pas être attaqué par ses alliés !",
	},
	teraformzero: {
		name: "Téraformation 0",
		shortDesc: "Après Téracristallisation, élimine les changements de météo et de terrain.",
	},
	terashell: {
		name: "Téra-Carapace",
		desc: "Grâce à sa carapace qui renferme l’énergie de tous les types, les capacités subies par ce Pokémon quand ses PV sont au maximum ne sont pas très efficaces.",
		shortDesc: "Toutes les capacités reçues deviennent peu efficaces tant que le Pokémon a tous ses PV.",

		activate: "  [POKEMON] fait briller sa carapace et fausse les affinités de type !",
	},
	terashift: {
		name: "Téramorphose",
		shortDesc: "Lorsque Terapagos est envoyé au combat, il se transforme dans sa forme Téracristal.",

		transform: "[POKEMON] se transforme !",
	},
	teravolt: {
		name: "Téra-Voltage",
		desc: "Le Pokémon ignore les talents adverses qui auraient un effet sur ses capacités.",
		shortDesc: "Les capacités du Pokémon et leurs effets ignorent les Talents des autres Pokémon.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  [POKEMON] dégage une aura électrique instable !",
	},
	thermalexchange: {
		name: "Thermodynamique",
		desc: "Lorsque le Pokémon est touché par une capacité de type Feu, son Attaque augmente. Il ne peut pas être brûlé.",
		shortDesc: "Augmente l'Attaque du Pokémon de 1 si touché par une capacité Feu. Immunité Brûlure.",
	},
	thickfat: {
		name: "Isograisse",
		desc: "Le Pokémon est protégé par une épaisse couche de graisse qui diminue de moitié les dégâts qu'il subit des capacités de types Feu et Glace.",
		shortDesc: "Les dégâts des capacités Feu/Glace infligées au Pokémon sont réduits de moitié.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	tintedlens: {
		name: "Lentiteintée",
		shortDesc: "Les capacités pas très efficaces du Pokémon infligent le double de dégâts.",
	},
	torrent: {
		name: "Torrent",
		desc: "Augmente la puissance des capacités de type Eau du Pokémon quand il a perdu une certaine quantité de PV.",
		shortDesc: "Si PV < 33% PV max, augmente la puissance des capacités Eau du Pokémon de 50%.",
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	toughclaws: {
		name: "Griffe Dure",
		shortDesc: "La puissance des capacités de contact du Pokémon augmente de 30%.",
	},
	toxicboost: {
		name: "Rage Poison",
		desc: "Augmente la puissance des capacités physiques quand le Pokémon est empoisonné.",
		shortDesc: "Augmente l'Attaque du Pokémon de 50% si le Pokémon est empoisonné.",
	},
	toxicchain: {
		name: "Chaîne Toxique",
		desc: "Grâce aux pouvoirs de sa chaîne imprégnée de toxines, le Pokémon peut empoisonner gravement sa cible en la touchant avec une capacité.",
		shortDesc: "Les capacités offensives du Pokémon ont 30% de chances d'empoisonner gravement.",
	},
	toxicdebris: {
		name: "Dépôt Toxique",
		shortDesc: "Si le Pokémon est touché par une capacité physique, dépose des Pics Toxik sur le terrain adverse.",
	},
	trace: {
		name: "Calque",
		desc: "Lorsque le Pokémon entre au combat, il calque le talent d'un ennemi pour remplacer le sien.",
		shortDesc: "Copie le Talent d'un ennemi adjacent aléatoire lorsque le Pokémon arrive au combat.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		changeAbility: "  [POKEMON] Calque [ABILITY] du [SOURCE]!",
	},
	transistor: {
		name: "Transistor",
		shortDesc: "Augmente la puissance des capacités de type Électrik du Pokémon de 50%.",
		gen8: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	triage: {
		name: "Prioguérison",
		shortDesc: "Les capacités de soin du Pokémon ont une priorité de +3.",
	},
	truant: {
		name: "Absentéisme",
		shortDesc: "Le Pokémon ne peut attaquer qu'un tour sur deux.",
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		cant: "[POKEMON] paresse !",
	},
	turboblaze: {
		name: "Turbo Brasier",
		desc: "Le Pokémon ignore les talents adverses qui auraient un effet sur ses capacités.",
		shortDesc: "Les capacités du Pokémon et leurs effets ignorent les Talents des autres Pokémon.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen5: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen4: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  [POKEMON] dégage une aura de flammes incandescentes !",
	},
	unaware: {
		name: "Inconscient",
		desc: "Le Pokémon ignore les changements de stats des autres Pokémon, qu'il attaque ou soit attaqué.",
		shortDesc: "Les changements de stats des Pokémon sont ignorés en infligeant/subissant des dégâts.",
	},
	unburden: {
		name: "Délestage",
		desc: "Augmente la Vitesse du Pokémon s'il perd ou utilise l'objet qu'il tenait au début du combat.",
		shortDesc: "Vitesse x2 si l'objet est perdu. Boost perdu si le Pokémon switch ou gagne un objet/Talent.",
	},
	unnerve: {
		name: "Tension",
		desc: "Fait stresser l’adversaire, ce qui l’empêche de manger des Baies.",
		shortDesc: "Le Pokémon empêche les adversaires de manger leur Baie.",

		start: "  [TEAM:capitalize] est tendue et ne peut plus manger de Baies !",
	},
	unseenfist: {
		name: "Poing Invisible",
		shortDesc: "Les capacités de contact du Pokémon passent à travers les protections.",
		champions: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "Urne du Fléau",
		shortDesc: "L'Attaque Spéciale de tous les autres Pokémon actifs est réduite de 25%.",

		start: "  L’Urne du Fléau [POKEMON:de] affaiblit l’Attaque Spéciale des Pokémon alentour !",
	},
	victorystar: {
		name: "Victorieux",
		shortDesc: "La Précision du Pokémon et ses alliés est augmentée de 10%.",
	},
	vitalspirit: {
		name: "Esprit Vital",
		shortDesc: "Le Pokémon ne peut pas s'endormir. Gagner ce Talent réveille le Pokémon.",
	},
	voltabsorb: {
		name: "Absorbe-Volt",
		desc: "Si le Pokémon est touché par une capacité Électrik, il ne subit aucun dégât et regagne des PV à la place.",
		shortDesc: "Soigne 25% des PV max si touché par une capacité Électrik. Immunité Électrik.",
		gen3: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	wanderingspirit: {
		name: "Âme Vagabonde",
		desc: "Lorsque le Pokémon est directement touché par une capacité, il échange son talent avec celui de l’assaillant.",
		shortDesc: "Échange son Talent avec l'attaquant si le Pokémon subit une attaque de contact.",
		gen8: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "Absorbe-Eau",
		desc: "Si le Pokémon est touché par une capacité Eau, il ne subit aucun dégât et regagne des PV à la place.",
		shortDesc: "Soigne 25% des PV max si touché par une capacité Eau. Immunité Eau.",
	},
	waterbubble: {
		name: "Aquabulle",
		desc: "Réduit la puissance des capacités de type Feu subies par le Pokémon. Il est également immunisé contre les brûlures.",
		shortDesc: "Dégâts Eau du Pokémon x2, dégâts Feu subis divisés par 2, immunisé à brûlure.",
	},
	watercompaction: {
		name: "Sable Humide",
		shortDesc: "La Défense du Pokémon est augmentée de 2 après avoir été touché par une capacité Eau.",
	},
	waterveil: {
		name: "Ignifu-Voile",
		shortDesc: "Le Pokémon ne peut pas être brûlé. Gagner ce Talent soigne la brûlure.",
	},
	weakarmor: {
		name: "Armurouillée",
		desc: "Quand le Pokémon est touché par une capacité physique, sa Défense baisse mais sa Vitesse augmente beaucoup.",
		shortDesc: "Augmente la Vitesse de 2 et baisse la Défense de 1 si touché par une capacité physique.",
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	wellbakedbody: {
		name: "Bien Cuit",
		desc: "Si le Pokémon est touché par une capacité de type Feu, il ne subit aucun dégât et sa Défense augmente beaucoup.",
		shortDesc: "Si touché par une capacité Feu, augmente la Défense de 2. Immunisé aux capacités Feu.",
	},
	whitesmoke: {
		name: "Écran Fumée",
		shortDesc: "Ce Pokémon est immunisé aux baisses de stats de son adversaire.",
	},
	wimpout: {
		name: "Escampette",
		desc: "Le Pokémon perd confiance quand ses PV tombent à la moitié et s’enfuit dans sa Poké Ball.",
		shortDesc: "Si les PV du Pokémon tombent en dessous de 50%, il switch automatiquement.",
	},
	windpower: {
		name: "Turbine Éolienne",
		desc: "Si le Pokémon est touché par une capacité faisant appel au vent, il se charge en électricité.",
		shortDesc: "Si le Pokémon est touché par une capacité de vent, il devient chargé.",

		start: "#electromorphosis",
	},
	windrider: {
		name: "Aéroporté",
		desc: "L’Attaque du Pokémon augmente si un vent arrière souffle ou s’il est touché par une capacité faisant appel au vent. Dans ce dernier cas, il ne subit aucun dégât.",
		shortDesc: "Si touché par une capacité de vent : Attaque +1. Immunité aux capacités de vent.",
	},
	wonderguard: {
		name: "Garde Mystik",
		shortDesc: "Le Pokémon ne peut être blessé qu'avec des capacités super efficaces ou dégâts indirects.",
		gen4: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen3: {
			shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	wonderskin: {
		name: "Peau Miracle",
		desc: "Le Pokémon résiste mieux aux capacités de statut.",
		shortDesc: "La Précision des capacités de statut dirigées contre le Pokémon est divisée par 2.",
	},
	zenmode: {
		name: "Mode Transe",
		desc: "Le Pokémon change de forme quand il lui reste moins de la moitié de ses PV.",
		shortDesc: "Darumacho : à la fin du tour, change sa Forme en Normal si PV max > 50%, sinon Transe.",
		gen7: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "", // NEEDS TRANSLATION: not in PokeAPI
		},

		transform: "Le talent Mode Transe s’active !",
		transformEnd: "Le talent Mode Transe n’est plus actif !",
	},
	zerotohero: {
		name: "Supermutation",
		shortDesc: "Si le Pokémon est Superdofin, passe en forme Super lorsqu'il quitte le terrain.",

		activate: "  [POKEMON] est revenu sous une autre forme !",
	},

	// CAP
	mountaineer: {
		name: "", // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI
	},
	rebound: {
		name: "", // NEEDS TRANSLATION: not in PokeAPI
		desc: "", // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI

		move: "#magiccoat",
	},
	persistent: {
		name: "", // NEEDS TRANSLATION: not in PokeAPI
		desc: "", // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "", // NEEDS TRANSLATION: not in PokeAPI

		activate: "", // NEEDS TRANSLATION: Showdown custom text
	},
};
