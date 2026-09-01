export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "Aucun Talent", // NEEDS QC
		shortDesc: "Ne fait rien.", // NEEDS QC
	},
	adaptability: {
		name: "Adaptabilité",
		// Official flavor text: "Quand le Pokémon utilise une capacité du même type que lui, le bonus de puissance qu'elle reçoit est encore plus important que normalement."
		desc: "Le bonus de même type (STAB) des capacités de ce Pokémon est de 2 au lieu de 1,5.", // NEEDS QC
		shortDesc: "Le bonus de même type (STAB) de ce Pokémon est de 2 au lieu de 1,5.", // NEEDS QC
	},
	aerilate: {
		name: "Peau Céleste",
		// Official flavor text: "Les capacités de type Normal deviennent de type Vol. Leur puissance augmente légèrement."
		desc: "Les capacités de type Normal de ce Pokémon deviennent de type Vol et leur puissance est multipliée par 1,2. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
		shortDesc: "Ses capacités de type Normal deviennent de type Vol avec une puissance x1,2.", // NEEDS QC
		gen6: {
			desc: "Les capacités de type Normal de ce Pokémon deviennent de type Vol et leur puissance est multipliée par 1,3. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
			shortDesc: "Les capacités Normal de ce Pokémon deviennent de type Vol avec 1,3x puissance.", // NEEDS QC
		},
	},
	aftermath: {
		name: "Boom Final",
		// Official flavor text: "Si le Pokémon est mis K.O. par une attaque directe, il inflige des dégâts à l’attaquant avant de s’évanouir."
		desc: "Si ce Pokémon est mis K.O. par une capacité directe, l'utilisateur de cette capacité perd 1/4 de ses PV max, arrondi à l'inférieur. Cet effet est empêché si l'utilisateur de la capacité a le talent Garde Magik ou si un Pokémon actif a le talent Moiteur.", // NEEDS QC
		shortDesc: "S'il est mis K.O. par une capacité directe, l'attaquant perd 1/4 de ses PV max.", // NEEDS QC

		damage: "  {POKEMON} est blessé !",
	},
	airlock: {
		name: "Air Lock",
		shortDesc: "Tant que ce Pokémon est au combat, les effets de la météo sont annulés.", // NEEDS QC

		start: "  Les effets de la météo se dissipent !",
	},
	analytic: {
		name: "Analyste",
		// Official flavor text: "Augmente la puissance des capacités du Pokémon s’il attaque en dernier."
		desc: "La puissance des capacités de ce Pokémon est multipliée par 1,3 s'il agit en dernier dans le tour. N'affecte pas Vœu Destructeur ni Prescience.", // NEEDS QC
		shortDesc: "Les attaques de ce Pokémon ont une puissance x1,3 s'il agit en dernier.", // NEEDS QC
	},
	angerpoint: {
		name: "Colérique",
		// Official flavor text: "Si le Pokémon subit un coup critique, il entre dans une colère noire qui augmente son Attaque au maximum."
		desc: "Si ce Pokémon, mais pas son clone, subit un coup critique, son Attaque monte de 12 niveaux.", // NEEDS QC
		shortDesc: "Si ce Pokémon (pas son clone) subit un coup critique : Attaque +12 niveaux.", // NEEDS QC
		gen4: {
			desc: "Si ce Pokémon ou son clone subit un coup critique, son Attaque monte de 12 niveaux.", // NEEDS QC
			shortDesc: "Si ce Pokémon ou son clone subit un coup critique, son Attaque monte de 12.", // NEEDS QC
		},

		boost: "  {POKEMON} monte son Attaque au maximum !",
	},
	angershell: {
		name: "Courroupace",
		// Official flavor text: "Le Pokémon enrage s’il a moins de la moitié de ses PV après avoir subi une attaque. Sa Déf. et sa Déf. Spé. baissent, et son Atq., son Atq. Spé. et sa Vit. augmentent."
		desc: "Quand ce Pokémon a plus de la moitié de ses PV max et qu'une attaque les fait tomber à la moitié ou moins, son Attaque, son Attaque Spéciale et sa Vitesse montent d'un niveau, et sa Défense et sa Défense Spéciale baissent d'un niveau. Cet effet s'applique après tous les coups d'une capacité frappant plusieurs fois. Cet effet est empêché si l'effet secondaire de la capacité a été supprimé par le talent Sans Limite.", // NEEDS QC
		shortDesc: "À la moitié des PV ou moins : +1 Atq, Atq. Spé et Vit., -1 Déf et Déf. Spé.", // NEEDS QC
	},
	anticipation: {
		name: "Anticipation",
		// Official flavor text: "Le Pokémon devine si l'adversaire connaît une capacité dangereuse pour lui."
		desc: "En entrant au combat, ce Pokémon est alerté si un Pokémon adverse connaît une capacité offensive d'un type super efficace contre lui, ou une capacité mettant K.O. en un coup. Cet effet considère Puissance Cachée comme étant de son type déterminé, et toute autre capacité comme étant de son type d'origine.", // NEEDS QC
		shortDesc: "À l'entrée, frissonne si un adversaire a une capacité super efficace ou K.O.", // NEEDS QC
		gen5: {
			desc: "À l'entrée au combat, ce Pokémon est alerté si un adversaire connaît une capacité offensive d'un type super efficace contre lui, ou une capacité mettant K.O. en un coup. Cet effet considère les capacités avec leur type d'origine.", // NEEDS QC
		},
		gen4: {
			desc: "À l'entrée au combat, ce Pokémon est alerté si un adversaire connaît une capacité offensive d'un type super efficace contre lui, ou une capacité mettant K.O. en un coup si ce Pokémon n'est pas immunisé contre son type et que l'adversaire n'est pas d'un niveau inférieur. Cet effet considère les capacités avec leur type d'origine. Riposte, Draco-Rage, Fulmifer, Voile Miroir, Ombre Nocturne, Vague Psy et Frappe Atlas ne déclenchent pas cet effet. Avant la vérification, cet effet considère si ce Pokémon tient une Balle Fer, s'il est sous les effets de Clairvoyance, Gravité, Racines, Œil Miracle ou Atterrissage, et si les adversaires ont les talents Normalise ou Querelleur.", // NEEDS QC
		},

		activate: "  {POKEMON} est tout tremblant !",
	},
	arenatrap: {
		name: "Piège Sable",
		// Official flavor text: "Empêche l'adversaire de quitter le terrain."
		desc: "Empêche les Pokémon adverses de choisir de quitter le combat, sauf s'ils sont en l'air, tiennent une Carapace Mue ou sont de type Spectre.", // NEEDS QC
		shortDesc: "Empêche les adversaires de quitter le combat, sauf s'ils sont en l'air.", // NEEDS QC
		gen6: {
			desc: "Empêche les Pokémon adverses adjacents de choisir de quitter le combat, sauf s'ils sont en l'air, tiennent une Carapace Mue ou sont de type Spectre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche les Pokémon adverses adjacents de choisir de quitter le combat, sauf s'ils sont en l'air ou tiennent une Carapace Mue.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche les Pokémon adverses de choisir de quitter le combat, sauf s'ils sont en l'air ou tiennent une Carapace Mue.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche les Pokémon adverses de choisir de quitter le combat, sauf s'ils sont en l'air.", // NEEDS QC
		},
	},
	armortail: {
		name: "Armure Caudale",
		// Official flavor text: "Une étrange queue recouvre la tête du Pokémon, ce qui empêche ce dernier et ses alliés d’être visés par une capacité prioritaire."
		desc: "Les capacités avec priorité utilisées par les Pokémon adverses contre ce Pokémon ou ses alliés échouent.", // NEEDS QC
		shortDesc: "Ce Pokémon et ses alliés sont protégés des capacités adverses avec priorité.", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "Aroma-Voile",
		// Official flavor text: "Protège le Pokémon et ses alliés des effets limitant le libre arbitre."
		desc: "Ce Pokémon et ses alliés ne peuvent pas être affectés par Attraction, Entrave, Encore, Anti-Soin, Provoc ni Tourmente.", // NEEDS QC
		shortDesc: "Protège l'équipe d'Attraction, Entrave, Encore, Anti-Soin, Provoc et Tourmente.", // NEEDS QC

		block: "  {POKEMON} est protégé par Aroma-Voile !",
	},
	asone: {
		name: "Osmose Équine",
		shortDesc: "Voir « Osmose Équine (Blizzeval) » et « Osmose Équine (Spectreval) ».", // NEEDS QC

		start: "  {POKEMON} a deux talents !",
	},
	asoneglastrier: {
		name: "Osmose Équine (Blizzeval)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Combine les talents Tension et Blanche Ruade.", // NEEDS QC
	},
	asonespectrier: {
		name: "Osmose Équine (Spectreval)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Combine les talents Tension et Sombre Ruade.", // NEEDS QC
	},
	aurabreak: {
		name: "Aura Inversée",
		// Official flavor text: "Inverse l’effet des talents « Aura » afin que ceux-ci baissent la puissance des capacités affectées au lieu de l’augmenter."
		desc: "Tant que ce Pokémon est au combat, les effets des talents Aura Ténébreuse et Aura Féérique sont inversés : la puissance des capacités de type Ténèbres et de type Fée est multipliée par 3/4 au lieu de 1,33.", // NEEDS QC
		shortDesc: "Tant que ce Pokémon est au combat, Aura Ténébreuse et Aura Féérique passent à 0,75x.", // NEEDS QC

		start: "  {POKEMON} inverse toutes les auras !",
	},
	baddreams: {
		name: "Mauvais Rêve",
		// Official flavor text: "Inflige des dégâts aux ennemis endormis."
		desc: "Les Pokémon adverses endormis perdent 1/8 de leurs PV max, arrondi à l'inférieur, à la fin de chaque tour.", // NEEDS QC
		shortDesc: "Les adversaires endormis perdent 1/8 de leurs PV max à la fin de chaque tour.", // NEEDS QC
		gen6: {
			desc: "Les Pokémon adverses adjacents endormis perdent 1/8 de leurs PV max, arrondi à l'inférieur, à la fin de chaque tour.", // NEEDS QC
			shortDesc: "Les ennemis adjacents endormis perdent 1/8 de leurs PV max chaque fin de tour.", // NEEDS QC
		},
		gen4: {
			desc: "Les Pokémon adverses endormis perdent 1/8 de leurs PV max, arrondi à l'inférieur, à la fin de chaque tour.", // NEEDS QC
			shortDesc: "Les adversaires endormis perdent 1/8 de leurs PV max à la fin de chaque tour.", // NEEDS QC
		},

		damage: "  {POKEMON} a le sommeil agité !",
	},
	ballfetch: {
		name: "Ramasse Ball",
		shortDesc: "Aucune utilité en combat.", // NEEDS QC
	},
	battery: {
		name: "Batterie",
		shortDesc: "Les attaques spéciales des alliés de ce Pokémon ont une puissance x1,3.", // NEEDS QC
	},
	battlearmor: {
		name: "Armurbaston",
		shortDesc: "Ce Pokémon ne peut pas subir de coup critique.", // NEEDS QC
	},
	battlebond: {
		name: "Synergie",
		// Official flavor text: "En battant un ennemi, ce Pokémon renforce ses liens avec son Dresseur, ce qui augmente son Attaque, son Attaque Spéciale et sa Vitesse."
		desc: "Si ce Pokémon est un Amphinobi, son Attaque, son Attaque Spéciale et sa Vitesse montent d'un niveau quand il met un autre Pokémon K.O. avec une attaque. Cet effet ne peut se produire qu'une fois par combat.", // NEEDS QC
		shortDesc: "Après un K.O. : +1 Attaque, Atq. Spé et Vitesse. Une fois par combat.", // NEEDS QC
		gen8: {
			desc: "Si ce Pokémon est un Amphinobi, il se transforme en Sachanobi s'il met un autre Pokémon K.O. avec une attaque. Si ce Pokémon est Sachanobi, son Sheauriken a 20 de puissance et frappe toujours trois fois.", // NEEDS QC
			shortDesc: "Après un K.O. : devient Sachanobi, Sheauriken : 20 de puissance, 3 coups.", // NEEDS QC
		},
		activate: "  {POKEMON} sent la force de la synergie !",
		transform: "{POKEMON} se transforme en Sachanobi !",
	},
	beadsofruin: {
		name: "Perles du Fléau",
		shortDesc: "Les Pokémon actifs sans ce talent ont leur Déf. Spé multipliée par 0,75.", // NEEDS QC

		start: "  Les Perles du Fléau {POKEMON:de} affaiblissent la Défense Spéciale des Pokémon alentour !",
	},
	beastboost: {
		name: "Boost Chimère",
		// Official flavor text: "Augmente la stat la plus élevée du Pokémon quand il met K.O. un autre Pokémon."
		desc: "La statistique la plus élevée de ce Pokémon monte d'un niveau quand il met un autre Pokémon K.O. avec une attaque. Les changements de niveaux ne sont pas pris en compte. En cas d'égalité, l'ordre de priorité est : Attaque, Défense, Attaque Spéciale, Défense Spéciale, Vitesse.", // NEEDS QC
		shortDesc: "La plus haute statistique de ce Pokémon monte de 1 s'il met un Pokémon K.O.", // NEEDS QC
	},
	berserk: {
		name: "Folle Furie",
		// Official flavor text: "Augmente l’Attaque Spéciale du Pokémon lorsque ses PV tombent à la moitié à cause d’une attaque de l’adversaire."
		desc: "Quand ce Pokémon a plus de la moitié de ses PV max et qu'une attaque les fait tomber à la moitié ou moins, son Attaque Spéciale monte d'un niveau. Cet effet s'applique après tous les coups d'une capacité frappant plusieurs fois. Cet effet est empêché si l'effet secondaire de la capacité a été supprimé par le talent Sans Limite.", // NEEDS QC
		shortDesc: "+1 Atq. Spé quand ce Pokémon tombe à la moitié de ses PV max ou moins.", // NEEDS QC
	},
	bigpecks: {
		name: "Cœur de Coq",
		shortDesc: "Empêche les autres Pokémon de baisser la Défense de ce Pokémon.", // NEEDS QC
	},
	blaze: {
		name: "Brasier",
		// Official flavor text: "Augmente la puissance des capacités de type Feu du Pokémon quand il a perdu une certaine quantité de PV."
		desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, sa statistique offensive est multipliée par 1,5 quand il utilise une attaque de type Feu.", // NEEDS QC
		shortDesc: "À 1/3 des PV max ou moins, sa statistique offensive est x1,5 avec les attaques Feu.", // NEEDS QC
		gen4: {
			desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, la puissance de ses attaques de type Feu est multipliée par 1,5.", // NEEDS QC
			shortDesc: "À 1/3 ou moins de ses PV max, ses attaques Feu ont 1,5x puissance.", // NEEDS QC
		},
	},
	bulletproof: {
		name: "Pare-Balles",
		shortDesc: "Ce Pokémon est immunisé contre les capacités à base de projectiles.", // NEEDS QC
	},
	cheekpouch: {
		name: "Bajoues",
		// Official flavor text: "Le Pokémon récupère des PV lorsqu’il consomme n’importe quelle Baie en plus de bénéficier de ses effets habituels."
		desc: "Si ce Pokémon mange une Baie tenue, il récupère 1/3 de ses PV max, arrondi à l'inférieur, en plus de l'effet de la Baie. Cet effet peut aussi s'activer après les effets de Piqûre, Dégommage, Picore, Garde-à-Joues et Thérémonie si la Baie mangée a eu un effet sur ce Pokémon.", // NEEDS QC
		shortDesc: "Si ce Pokémon mange une Baie, il restaure 1/3 de ses PV max en plus de son effet.", // NEEDS QC
		gen7: {
			desc: "Si ce Pokémon mange une Baie tenue, il récupère 1/3 de ses PV max, arrondi à l'inférieur, en plus de l'effet de la Baie. Cet effet peut aussi s'activer après Piqûre, Dégommage et Picore si la Baie mangée a un effet sur ce Pokémon.", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "Blanche Ruade",
		// Official flavor text: "Quand le Pokémon met un ennemi K.O., il émet un hennissement glaçant, ce qui augmente son Attaque."
		desc: "L'Attaque de ce Pokémon monte d'un niveau quand il met un autre Pokémon K.O. avec une attaque.", // NEEDS QC
		shortDesc: "L'Attaque de ce Pokémon monte d'un niveau s'il met un autre Pokémon K.O.", // NEEDS QC
	},
	chlorophyll: {
		name: "Chlorophylle",
		// Official flavor text: "Augmente la Vitesse du Pokémon s'il y a du soleil."
		desc: "Si Soleil est actif, la Vitesse de ce Pokémon est doublée. Cet effet est empêché si ce Pokémon tient un Parapluie Solide.", // NEEDS QC
		shortDesc: "Si Soleil est actif, la Vitesse de ce Pokémon est doublée.", // NEEDS QC
		gen7: {
			desc: "Si Soleil est actif, la Vitesse de ce Pokémon est doublée.", // NEEDS QC
		},
	},
	clearbody: {
		name: "Corps Sain",
		shortDesc: "Empêche les autres Pokémon de baisser les statistiques de ce Pokémon.", // NEEDS QC
	},
	cloudnine: {
		name: "Ciel Gris",
		shortDesc: "Tant que ce Pokémon est au combat, les effets de la météo sont annulés.", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "Homochromie",
		// Official flavor text: "Lorsque le Pokémon est touché par une capacité, il prend le type de celle-ci."
		desc: "Le type de ce Pokémon devient celui de la dernière capacité qui l'a touché, sauf si c'est déjà l'un de ses types. Cet effet s'applique après tous les coups d'une capacité frappant plusieurs fois. Cet effet est empêché si l'effet secondaire de la capacité a été supprimé par le talent Sans Limite.", // NEEDS QC
		shortDesc: "Son type devient celui de la capacité qui le touche, sauf s'il l'a déjà.", // NEEDS QC
		gen4: {
			desc: "Le type de ce Pokémon devient celui de la dernière capacité qui l'a touché, sauf s'il a déjà ce type. Cet effet s'applique après chaque coup d'une capacité frappant plusieurs fois. Il ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
		},
	},
	comatose: {
		name: "Hypersommeil",
		// Official flavor text: "Le Pokémon rêve en permanence et ne se réveille jamais. Il est capable d’attaquer normalement tout en dormant."
		desc: "Ce Pokémon est considéré comme endormi et ne peut être affecté ni par un problème de statut ni par Bâillement.", // NEEDS QC
		shortDesc: "Ce Pokémon ne peut pas subir de statut, mais est considéré comme endormi.", // NEEDS QC

		start: "  {POKEMON} est en Hypersommeil !",
	},
	commander: {
		name: "Commandant",
		// Official flavor text: "Si un Oyacata allié est sur le terrain quand ce Pokémon rejoint le combat, ce dernier entre dans sa bouche et devient son commandant."
		desc: "Si ce Pokémon est un Nigirigon et qu'un Oyacata allié est au combat, ce Pokémon entre dans la bouche de ce dernier. L'Attaque, l'Attaque Spéciale, la Vitesse, la Défense et la Défense Spéciale de l'Oyacata montent de 2 niveaux. Pendant l'effet, l'Oyacata ne peut pas quitter le combat, ce Pokémon ne peut pas choisir d'action, et les attaques qui ciblent ce Pokémon échouent, mais il subit toujours les dégâts indirects. Si ce Pokémon est mis K.O. pendant l'effet, un remplaçant peut entrer au combat, mais l'Oyacata ne peut toujours pas quitter le combat. Si l'Oyacata est mis K.O. pendant l'effet, ce Pokémon peut de nouveau choisir une action.", // NEEDS QC
		shortDesc: "Avec un Oyacata allié : ne peut ni agir ni être touché, Oyacata +2 partout.", // NEEDS QC

		activate: "  {POKEMON} a été avalé par {TARGET} et devient son commandant.",
	},
	competitive: {
		name: "Battant",
		// Official flavor text: "Augmente beaucoup l’Attaque Spéciale du Pokémon quand ses stats ont été baissées par l’adversaire."
		desc: "L'Attaque Spéciale de ce Pokémon monte de 2 niveaux pour chacun de ses niveaux de statistiques baissé par un Pokémon adverse.", // NEEDS QC
		shortDesc: "+2 Atq. Spé pour chaque statistique baissée par un adversaire.", // NEEDS QC
	},
	compoundeyes: {
		name: "Œil Composé",
		shortDesc: "Les capacités de ce Pokémon ont leur précision multipliée par 1,3.", // NEEDS QC
	},
	contrary: {
		name: "Contestation",
		shortDesc: "Les hausses de statistiques de ce Pokémon deviennent des baisses, et inversement.", // NEEDS QC
		gen7: {
			desc: "Les statistiques de ce Pokémon baissent au lieu de monter, et inversement. Ce talent n'affecte pas les hausses de stats des effets de la Force Z avant l'utilisation d'une capacité Z.", // NEEDS QC
		},
		gen6: {
			desc: "Les statistiques de ce Pokémon baissent au lieu de monter, et inversement.", // NEEDS QC
		},
	},
	corrosion: {
		name: "Corrosion",
		shortDesc: "Ce Pokémon peut empoisonner n'importe quel Pokémon, quels que soient ses types.", // NEEDS QC
	},
	costar: {
		name: "Collab",
		shortDesc: "À l'entrée, ce Pokémon copie tous les changements de statistiques de son allié.", // NEEDS QC
	},
	cottondown: {
		name: "Effilochage",
		// Official flavor text: "Quand le Pokémon est touché par une attaque, il dissémine des aigrettes qui diminuent la Vitesse de tout le monde, sauf la sienne."
		desc: "Quand ce Pokémon est touché par une attaque, la Vitesse de tous les autres Pokémon sur le terrain baisse d'un niveau.", // NEEDS QC
		shortDesc: "Si ce Pokémon est touché, la Vitesse de tous les autres Pokémon baisse d'un niveau.", // NEEDS QC
	},
	cudchew: {
		name: "Ruminant",
		shortDesc: "Si ce Pokémon mange une Baie, il la mange de nouveau à la fin du tour suivant.", // NEEDS QC
	},
	curiousmedicine: {
		name: "Breuvage Suspect",
		shortDesc: "À l'entrée, les statistiques des alliés de ce Pokémon sont remises à 0.", // NEEDS QC
	},
	cursedbody: {
		name: "Corps Maudit",
		// Official flavor text: "Quand le Pokémon est touché par une capacité adverse, il inflige parfois Entrave sur celle-ci."
		desc: "Si ce Pokémon est touché par une attaque, il y a 30 % de chances que cette capacité subisse l'effet d'Entrave, sauf si une des capacités de l'attaquant le subit déjà.", // NEEDS QC
		shortDesc: "Si ce Pokémon est touché par une attaque, 30 % de chances de la désactiver.", // NEEDS QC
	},
	cutecharm: {
		name: "Joli Sourire",
		// Official flavor text: "Peut séduire l'attaquant lorsque le Pokémon subit une attaque directe."
		desc: "Il y a 30 % de chances qu'un Pokémon du sexe opposé qui touche ce Pokémon avec une capacité directe tombe amoureux.", // NEEDS QC
		shortDesc: "30 % de chances de rendre amoureux un Pokémon du sexe opposé au contact.", // NEEDS QC
		gen4: {
			desc: "Il y a 30 % de chances qu'un Pokémon du sexe opposé touchant ce Pokémon tombe amoureux. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
		},
		gen3: {
			desc: "Il y a 1 chance sur 3 qu'un Pokémon du sexe opposé touchant ce Pokémon tombe amoureux. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
			shortDesc: "1 chance sur 3 de rendre amoureux les Pokémon du sexe opposé au contact.", // NEEDS QC
		},
	},
	damp: {
		name: "Moiteur",
		// Official flavor text: "Le Pokémon augmente l'humidité de l'air, ce qui empêche tous les Pokémon d'utiliser des capacités explosives telles que Destruction."
		desc: "Tant que ce Pokémon est au combat, Explosion, Caboche-Kaboum, Explo-Brume, Destruction et le talent Boom Final sont sans effet.", // NEEDS QC
		shortDesc: "Empêche Explosion, Caboche-Kaboum, Explo-Brume, Destruction et Boom Final.", // NEEDS QC
		gen7: {
			desc: "Tant que ce Pokémon est au combat, Explosion, Caboche-Kaboum, Destruction et le talent Boom Final sont sans effet.", // NEEDS QC
			shortDesc: "Empêche Explosion/Caboche-Kaboum/Destruction/Boom Final tant qu'il est actif.", // NEEDS QC
		},
		gen6: {
			desc: "Tant que ce Pokémon est au combat, Explosion, Destruction et le talent Boom Final sont sans effet.", // NEEDS QC
			shortDesc: "Empêche Explosion/Destruction/Boom Final tant qu'il est actif.", // NEEDS QC
		},
		gen3: {
			desc: "Tant que ce Pokémon est au combat, Explosion et Destruction sont sans effet.", // NEEDS QC
			shortDesc: "Empêche Explosion et Destruction tant qu'il est actif.", // NEEDS QC
		},

		block: "  {SOURCE} ne peut pas utiliser la capacité {MOVE} !",
	},
	dancer: {
		name: "Danseuse",
		// Official flavor text: "Si n’importe quel Pokémon utilise une capacité dansante, le Pokémon utilise immédiatement cette danse lui aussi."
		desc: "Quand un autre Pokémon utilise une capacité dansante, ce Pokémon utilise la même capacité. La capacité copiée est soumise à tous les effets qui peuvent empêcher l'exécution d'une capacité. Une capacité utilisée grâce à ce talent ne peut pas être copiée à son tour par d'autres Pokémon ayant ce talent.", // NEEDS QC
		shortDesc: "Quand un autre Pokémon utilise une capacité dansante, ce Pokémon l'utilise aussi.", // NEEDS QC
	},
	darkaura: {
		name: "Aura Ténébreuse",
		// Official flavor text: "Augmente la puissance des capacités de type Ténèbres de tous les Pokémon."
		desc: "Tant que ce Pokémon est au combat, la puissance des capacités de type Ténèbres utilisées par les Pokémon actifs est multipliée par 1,33.", // NEEDS QC
		shortDesc: "Tant que ce Pokémon est là, les capacités Ténèbres ont une puissance x1,33.", // NEEDS QC

		start: "  {POKEMON} dégage une aura ténébreuse !",
	},
	dauntlessshield: {
		name: "Égide Inflexible",
		shortDesc: "À l'entrée, la Défense de ce Pokémon monte d'un niveau. Une fois par combat.", // NEEDS QC
		gen8: {
			shortDesc: "À l'entrée, la Défense de ce Pokémon monte d'un niveau.", // NEEDS QC
		},
	},
	dazzling: {
		name: "Corps Coloré",
		// Official flavor text: "L’adversaire est abasourdi par le Pokémon, ce qui l’empêche de viser ce dernier et ses alliés avec une capacité prioritaire."
		desc: "Les capacités avec priorité utilisées par les Pokémon adverses contre ce Pokémon ou ses alliés échouent.", // NEEDS QC
		shortDesc: "Ce Pokémon et ses alliés sont protégés des capacités adverses avec priorité.", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "Défaitiste",
		// Official flavor text: "Le Pokémon devient défaitiste quand ses PV tombent à la moitié, et son Attaque et son Attaque Spéciale sont divisées par deux."
		desc: "Quand ce Pokémon a la moitié ou moins de ses PV max, son Attaque et son Attaque Spéciale sont divisées par deux.", // NEEDS QC
		shortDesc: "À la moitié des PV ou moins, son Attaque et son Atq. Spé sont réduites de moitié.", // NEEDS QC
	},
	defiant: {
		name: "Acharné",
		// Official flavor text: "Augmente beaucoup l'Attaque du Pokémon quand ses stats sont baissées par l'adversaire."
		desc: "L'Attaque de ce Pokémon monte de 2 niveaux pour chacun de ses niveaux de statistiques baissé par un Pokémon adverse.", // NEEDS QC
		shortDesc: "+2 Attaque pour chaque statistique baissée par un adversaire.", // NEEDS QC
	},
	deltastream: {
		name: "Souffle Delta",
		// Official flavor text: "Altère les conditions météo pour annuler les faiblesses du type Vol."
		desc: "En entrant au combat, la météo devient Vent mystérieux, qui supprime les faiblesses du type Vol des Pokémon de type Vol. Cette météo persiste jusqu'à ce que ce talent ne soit plus actif pour aucun Pokémon, ou que la météo soit changée par les talents Terre Finale ou Mer Primaire.", // NEEDS QC
		shortDesc: "À l'entrée, des vents violents soufflent tant que ce talent est actif au combat.", // NEEDS QC
	},
	desolateland: {
		name: "Terre Finale",
		// Official flavor text: "Altère les conditions météo pour neutraliser les attaques de type Eau."
		desc: "En entrant au combat, la météo devient Soleil intense, qui inclut tous les effets de Soleil et empêche l'exécution des capacités offensives de type Eau. Cette météo persiste jusqu'à ce que ce talent ne soit plus actif pour aucun Pokémon, ou que la météo soit changée par les talents Souffle Delta ou Mer Primaire.", // NEEDS QC
		shortDesc: "À l'entrée, un soleil extrême brille tant que ce talent est actif au combat.", // NEEDS QC
	},
	disguise: {
		name: "Fantômasque",
		// Official flavor text: "Le déguisement qui recouvre le corps du Pokémon est capable de le protéger d’une attaque."
		desc: "Si ce Pokémon est un Mimiqui, le premier coup qu'il subit en combat inflige 0 dégât (neutre). Son déguisement est alors brisé, il prend sa Forme Démasquée et perd 1/8 de ses PV max. Les dégâts de confusion brisent aussi le déguisement.", // NEEDS QC
		shortDesc: "(Mimiqui) Le premier coup subi est bloqué : il perd 1/8 de ses PV à la place.", // NEEDS QC
		gen7: {
			desc: "Si ce Pokémon est un Mimiqui, le premier coup qu'il subit en combat inflige 0 dégât (neutre). Son déguisement est alors brisé et il prend sa Forme Démasquée. Les dégâts de confusion brisent aussi le déguisement.", // NEEDS QC
			shortDesc: "(Mimiqui seulement) Le premier coup subi inflige 0 dégât, brise le déguisement.", // NEEDS QC
		},

		block: "  Le déguisement absorbe l’attaque !",
		transform: "Le déguisement {POKEMON:de} tombe !",
	},
	download: {
		name: "Télécharge",
		// Official flavor text: "Le Pokémon compare la Défense et la Défense Spéciale de l’adversaire et, en fonction de la stat la plus basse, il augmente sa propre Attaque ou Attaque Spéciale."
		desc: "En entrant au combat, l'Attaque ou l'Attaque Spéciale de ce Pokémon monte d'un niveau selon la statistique défensive combinée la plus faible des Pokémon adverses : l'Attaque monte si leur Défense est plus basse, l'Attaque Spéciale monte si leur Défense Spéciale est égale ou plus basse.", // NEEDS QC
		shortDesc: "À l'entrée, +1 Attaque ou Atq. Spé selon la défense la plus faible des adversaires.", // NEEDS QC
	},
	dragonize: {
		name: "Peau Draconique",
		desc: "Les capacités de type Normal de ce Pokémon deviennent de type Dragon et leur puissance est multipliée par 1,2. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
		shortDesc: "Ses capacités de type Normal deviennent de type Dragon avec une puissance x1,2.", // NEEDS QC
	},
	dragonsmaw: {
		name: "Dent de Dragon",
		shortDesc: "Sa statistique offensive est multipliée par 1,5 avec les attaques de type Dragon.", // NEEDS QC
	},
	drizzle: {
		name: "Crachin",
		shortDesc: "À l'entrée, ce Pokémon invoque Pluie.", // NEEDS QC
	},
	drought: {
		name: "Sécheresse",
		shortDesc: "À l'entrée, ce Pokémon invoque Soleil.", // NEEDS QC
	},
	dryskin: {
		name: "Peau Sèche",
		// Official flavor text: "Quand le soleil brille, le Pokémon perd des PV et subit plus de dégâts des capacités Feu, mais il regagne des PV lorsqu'il pleut ou s'il est touché par une capacité Eau."
		desc: "Ce Pokémon est immunisé contre les capacités de type Eau et récupère 1/4 de ses PV max, arrondi à l'inférieur, quand il est touché par une capacité de type Eau. La puissance des capacités de type Feu utilisées contre lui est multipliée par 1,25. À la fin de chaque tour, ce Pokémon récupère 1/8 de ses PV max, arrondi à l'inférieur, si Pluie est active, et perd 1/8 de ses PV max, arrondi à l'inférieur, si Soleil est actif. Les effets de la météo sont empêchés si ce Pokémon tient un Parapluie Solide.", // NEEDS QC
		shortDesc: "Soigné 1/4 par l'Eau, 1/8 par la pluie ; subit 1,25x du Feu, perd 1/8 au soleil.", // NEEDS QC
		gen7: {
			desc: "Ce Pokémon est immunisé contre les capacités de type Eau et récupère 1/4 de ses PV max, arrondi à l'inférieur, quand il est touché par l'une d'elles. La puissance des capacités de type Feu contre lui est multipliée par 1,25. À la fin de chaque tour, ce Pokémon récupère 1/8 de ses PV max, arrondi à l'inférieur, si la météo est Pluie, et perd 1/8 de ses PV max, arrondi à l'inférieur, si la météo est Soleil.", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "Matinal",
		shortDesc: "Le compteur de sommeil de ce Pokémon baisse de 2 au lieu de 1.", // NEEDS QC
	},
	eartheater: {
		name: "Absorbe-Terre",
		// Official flavor text: "Si le Pokémon est touché par une capacité de type Sol, il regagne des PV au lieu de subir des dégâts."
		desc: "Ce Pokémon est immunisé contre les capacités de type Sol et récupère 1/4 de ses PV max, arrondi à l'inférieur, quand il est touché par une capacité de type Sol.", // NEEDS QC
		shortDesc: "Récupère 1/4 de ses PV max quand une capacité Sol le touche ; immunisé au Sol.", // NEEDS QC
	},
	eelevate: {
		name: "Lévitaboost",
		desc: "Ce Pokémon est immunisé contre les attaques de type Sol et contre les effets de Picots, Pics Toxik, Toile Gluante et du talent Piège Sable. Les effets de Gravité, Racines, Anti-Air, Myria-Flèches et de la Balle Fer annulent cette immunité. Myria-Flèches peut toucher ce Pokémon comme s'il n'avait pas ce talent. La statistique la plus élevée de ce Pokémon monte d'un niveau quand il met un autre Pokémon K.O. avec une attaque. Les changements de niveaux ne sont pas pris en compte. En cas d'égalité, l'ordre de priorité est : Attaque, Défense, Attaque Spéciale, Défense Spéciale, Vitesse.", // NEEDS QC
		shortDesc: "Immunisé contre le type Sol ; +1 à sa plus haute statistique après un K.O.", // NEEDS QC
	},
	effectspore: {
		name: "Pose Spore",
		// Official flavor text: "Peut paralyser, empoisonner ou endormir l'attaquant lorsque le Pokémon subit une attaque directe."
		desc: "Il y a 30 % de chances qu'un Pokémon qui touche ce Pokémon avec une capacité directe soit empoisonné, paralysé ou endormi.", // NEEDS QC
		shortDesc: "30 % de chances de poison, paralysie ou sommeil au contact de ce Pokémon.", // NEEDS QC
		gen4: {
			desc: "30 % de chances qu'un Pokémon touchant ce Pokémon soit empoisonné, paralysé ou endormi. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
		},
		gen3: {
			desc: "10 % de chances qu'un Pokémon touchant ce Pokémon soit empoisonné, paralysé ou endormi. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
			shortDesc: "10 % de chances de poison/paralysie/sommeil au contact de ce Pokémon.", // NEEDS QC
		},
	},
	electricsurge: {
		name: "Créa-Élec",
		shortDesc: "À l'entrée, ce Pokémon invoque un Champ Électrifié.", // NEEDS QC
	},
	electromorphosis: {
		name: "Grecharge",
		shortDesc: "Ce Pokémon obtient l'effet de Chargeur quand une attaque le touche.", // NEEDS QC

		start: "  {POKEMON} a été touché par la capacité {MOVE} et se charge en électricité !",
	},
	embodyaspectcornerstone: {
		name: "Force Mémorielle (Pierre)", // PS-style disambiguator (not part of the official name)
		shortDesc: "À l'entrée, la Défense de ce Pokémon monte d'un niveau.", // NEEDS QC

		boost: "  {POKEMON} fait briller le Masque de la Pierre et sa Défense augmente !",
	},
	embodyaspecthearthflame: {
		name: "Force Mémorielle (Fourneau)", // PS-style disambiguator (not part of the official name)
		shortDesc: "À l'entrée, l'Attaque de ce Pokémon monte d'un niveau.", // NEEDS QC

		boost: "  {POKEMON} fait briller le Masque du Fourneau et son Attaque augmente !",
	},
	embodyaspectteal: {
		name: "Force Mémorielle (Turquoise)", // PS-style disambiguator (not part of the official name)
		shortDesc: "À l'entrée, la Vitesse de ce Pokémon monte d'un niveau.", // NEEDS QC

		boost: "  {POKEMON} fait briller le Masque Turquoise et sa Vitesse augmente !",
	},
	embodyaspectwellspring: {
		name: "Force Mémorielle (Puits)", // PS-style disambiguator (not part of the official name)
		shortDesc: "À l'entrée, la Déf. Spé de ce Pokémon monte d'un niveau.", // NEEDS QC

		boost: "  {POKEMON} fait briller le Masque du Puits et sa Défense Spéciale augmente !",
	},
	emergencyexit: {
		name: "Repli Tactique",
		// Official flavor text: "Le Pokémon évite les situations inutilement dangereuses. Quand ses PV tombent à la moitié, il se réfugie dans sa Poké Ball."
		desc: "Quand ce Pokémon a plus de la moitié de ses PV max et que des dégâts les font tomber à la moitié ou moins, il quitte immédiatement le combat et est remplacé par un allié choisi. Cet effet s'applique après tous les coups d'une capacité frappant plusieurs fois. Cet effet est empêché si l'effet secondaire de la capacité a été supprimé par le talent Sans Limite. Cet effet s'applique aux dégâts directs comme indirects, sauf ceux de Malédiction et Clonage quand ce Pokémon les utilise, de Cognobidon, de Balance et de la confusion.", // NEEDS QC
		shortDesc: "Ce Pokémon quitte le combat quand il tombe à la moitié de ses PV max ou moins.", // NEEDS QC
	},
	fairyaura: {
		name: "Aura Féérique",
		// Official flavor text: "Augmente la puissance des capacités de type Fée de tous les Pokémon."
		desc: "Tant que ce Pokémon est au combat, la puissance des capacités de type Fée utilisées par les Pokémon actifs est multipliée par 1,33.", // NEEDS QC
		shortDesc: "Tant que ce Pokémon est au combat, les capacités Fée ont une puissance x1,33.", // NEEDS QC

		start: "  {POKEMON} dégage une aura féérique !",
	},
	filter: {
		name: "Filtre",
		shortDesc: "Ce Pokémon subit 3/4 des dégâts des attaques super efficaces.", // NEEDS QC
	},
	firemane: {
		name: "Crinière de Feu",
		shortDesc: "Sa statistique offensive est multipliée par 1,5 avec les attaques de type Feu.", // NEEDS QC
	},
	flamebody: {
		name: "Corps Ardent",
		shortDesc: "30 % de chances de brûler un Pokémon qui touche ce Pokémon.", // NEEDS QC
		gen4: {
			desc: "30 % de chances qu'un Pokémon touchant ce Pokémon soit brûlé. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
		},
		gen3: {
			desc: "1 chance sur 3 qu'un Pokémon touchant ce Pokémon soit brûlé. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
			shortDesc: "1 chance sur 3 de brûler les Pokémon qui le touchent.", // NEEDS QC
		},
	},
	flareboost: {
		name: "Rage Brûlure",
		// Official flavor text: "Augmente la puissance des capacités spéciales quand le Pokémon est brûlé."
		desc: "Quand ce Pokémon est brûlé, la puissance de ses attaques spéciales est multipliée par 1,5.", // NEEDS QC
		shortDesc: "Quand ce Pokémon est brûlé, ses attaques spéciales ont une puissance x1,5.", // NEEDS QC
	},
	flashfire: {
		name: "Torche",
		// Official flavor text: "Lorsque le Pokémon est touché par une capacité de type Feu, il absorbe la chaleur pour renforcer ses propres capacités Feu."
		desc: "Ce Pokémon est immunisé contre les capacités de type Feu. La première fois qu'il est touché par une capacité de type Feu, sa statistique offensive est multipliée par 1,5 quand il utilise une attaque de type Feu, tant qu'il reste au combat avec ce talent. Si ce Pokémon est gelé, il ne peut pas être dégelé par les attaques de type Feu.", // NEEDS QC
		shortDesc: "Attaques Feu x1,5 s'il est touché par une capacité Feu ; immunisé au Feu.", // NEEDS QC
		gen4: {
			desc: "Ce Pokémon est immunisé contre les capacités de type Feu, tant qu'il n'est pas gelé. La première fois qu'il est touché par l'une d'elles, les dégâts de ses attaques de type Feu sont multipliés par 1,5 tant qu'il reste au combat avec ce talent.", // NEEDS QC
		},
		gen3: {
			desc: "Ce Pokémon est immunisé contre les capacités de type Feu, tant qu'il n'est pas gelé. La première fois qu'il est touché par l'une d'elles, les dégâts de ses attaques de type Feu sont multipliés par 1,5 tant qu'il reste au combat avec ce talent. Si ce Pokémon a un problème de statut, est de type Feu ou a un clone, Feu Follet n'active pas ce talent.", // NEEDS QC
		},

		start: "  {POKEMON} augmente la puissance de ses capacités de type Feu !",
	},
	flowergift: {
		name: "Don Floral",
		// Official flavor text: "Augmente l’Attaque et la Défense Spéciale du Pokémon et de ses alliés lorsque le soleil brille."
		desc: "Si ce Pokémon est un Ceriflor et que Soleil est actif, il prend sa Forme Temps Ensoleillé, et son Attaque et sa Défense Spéciale, ainsi que celles de ses alliés, sont multipliées par 1,5. Ces effets sont empêchés si le Pokémon tient un Parapluie Solide.", // NEEDS QC; form name Forme Temps Ensoleillé via Pokébip/Pokékalos
		shortDesc: "Si Ceriflor et Soleil actif : Attaque et Déf. Spé x1,5 pour lui et les alliés.", // NEEDS QC
		gen7: {
			desc: "Si ce Pokémon est un Ceriflor et que Soleil est actif, il prend sa Forme Temps Ensoleillé, et l'Attaque et la Défense Spéciale de lui et de ses alliés sont multipliées par 1,5.", // NEEDS QC; form name via Pokébip/Pokékalos
		},
		gen4: {
			desc: "Si Soleil est actif, l'Attaque et la Défense Spéciale de ce Pokémon et de ses alliés sont multipliées par 1,5.", // NEEDS QC
			shortDesc: "Sous Soleil : Attaque et Déf. Spé de ce Pokémon et de ses alliés x1,5.", // NEEDS QC
		},
	},
	flowerveil: {
		name: "Flora-Voile",
		// Official flavor text: "Empêche les alliés de type Plante de subir des baisses de stats et des altérations de statut."
		desc: "Les Pokémon de type Plante dans l'équipe de ce Pokémon ne peuvent pas voir leurs niveaux de statistiques baissés par d'autres Pokémon ni subir de problème de statut infligé par d'autres Pokémon.", // NEEDS QC
		shortDesc: "Les types Plante de l'équipe ne subissent ni baisses de stats ni statuts adverses.", // NEEDS QC

		block: "  {POKEMON} est protégé par Flora-Voile !",
	},
	fluffy: {
		name: "Boule de Poils",
		// Official flavor text: "Divise par deux les dégâts des attaques directes subies par le Pokémon, mais double les dégâts des capacités de type Feu."
		desc: "Ce Pokémon subit moitié moins de dégâts des capacités directes, mais le double des dégâts des capacités de type Feu.", // NEEDS QC
		shortDesc: "Ce Pokémon subit 1/2 des dégâts de contact, mais 2x les dégâts de type Feu.", // NEEDS QC
	},
	forecast: {
		name: "Météo",
		// Official flavor text: "Le Pokémon prend le type Eau, Feu ou Glace en fonction de la météo."
		desc: "Si ce Pokémon est un Morphéo, son type devient celui correspondant à la météo actuelle, sauf sous tempête de sable. Cet effet est empêché si ce Pokémon tient un Parapluie Solide et que Pluie ou Soleil est actif.", // NEEDS QC
		shortDesc: "Le type de Morphéo change selon la météo, sauf sous tempête de sable.", // NEEDS QC
		gen7: {
			desc: "Si ce Pokémon est un Morphéo, son type change selon la météo, sauf Tempête de Sable.", // NEEDS QC
		},
	},
	forewarn: {
		name: "Prédiction",
		// Official flavor text: "Révèle l’une des capacités de l’adversaire quand le combat commence."
		desc: "En entrant au combat, ce Pokémon est alerté de la capacité la plus puissante, choisie au hasard en cas d'égalité, connue par un Pokémon adverse. Cet effet considère les capacités mettant K.O. en un coup comme ayant 150 de puissance ; Riposte, Voile Miroir et Fulmifer comme ayant 120 de puissance ; toute autre capacité offensive à puissance non fixe comme ayant 80 de puissance ; et les capacités sans dégâts comme ayant 1 de puissance.", // NEEDS QC
		shortDesc: "À l'entrée, ce Pokémon détecte la capacité adverse la plus puissante.", // NEEDS QC
		gen4: {
			desc: "À l'entrée au combat, ce Pokémon découvre au hasard la capacité la plus puissante connue par un adversaire. Cet effet considère les capacités mettant K.O. en un coup comme ayant 150 de puissance, Riposte, Voile Miroir et Fulmifer 120 de puissance, et toute autre capacité offensive sans puissance fixe 80 de puissance.", // NEEDS QC
		},

		activate: "  La capacité {MOVE} {TARGET:de} a été détectée !",
		activateNoTarget: "  Prédiction du {POKEMON} lui signale {MOVE}!",
	},
	friendguard: {
		name: "Garde-Ami",
		shortDesc: "Les alliés de ce Pokémon subissent 3/4 des dégâts des attaques des autres.", // NEEDS QC
	},
	frisk: {
		name: "Fouille",
		shortDesc: "À l'entrée, ce Pokémon identifie les objets tenus par tous les adversaires.", // NEEDS QC
		gen5: {
			shortDesc: "À l'entrée, identifie l'objet tenu par un adversaire au hasard.", // NEEDS QC
		},

		activate: "  {POKEMON} fouille {TARGET} et trouve {ITEM:indefinite:classified} !",
		activateNoTarget: "  {POKEMON} a décelé l'objet: {ITEM}!",
	},
	fullmetalbody: {
		name: "Métallo-Garde",
		shortDesc: "Empêche les autres Pokémon de baisser les statistiques de ce Pokémon.", // NEEDS QC
	},
	furcoat: {
		name: "Toison Épaisse",
		shortDesc: "La Défense de ce Pokémon est doublée.", // NEEDS QC
	},
	galewings: {
		name: "Ailes Bourrasque",
		shortDesc: "Si ce Pokémon a tous ses PV, ses capacités de type Vol ont leur priorité +1.", // NEEDS QC
		gen6: {
			shortDesc: "Les capacités Vol de ce Pokémon ont leur priorité augmentée de 1.", // NEEDS QC
		},
	},
	galvanize: {
		name: "Peau Électrique",
		// Official flavor text: "Les capacités de type Normal deviennent de type Électrik. Leur puissance augmente légèrement."
		desc: "Les capacités de type Normal de ce Pokémon deviennent de type Électrik et leur puissance est multipliée par 1,2. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
		shortDesc: "Ses capacités de type Normal deviennent de type Électrik avec une puissance x1,2.", // NEEDS QC
	},
	gluttony: {
		name: "Gloutonnerie",
		// Official flavor text: "Si le Pokémon tient une Baie à manger en cas de PV bas, il la mange dès qu'il a perdu la moitié de ses PV."
		desc: "Quand ce Pokémon tient une Baie qui s'active normalement à 1/4 ou moins de ses PV max, il la mange dès qu'il a la moitié ou moins de ses PV max.", // NEEDS QC
		shortDesc: "Ce Pokémon mange ses Baies à la moitié des PV max au lieu de 1/4.", // NEEDS QC
	},
	goodasgold: {
		name: "Corps en Or",
		shortDesc: "Ce Pokémon est immunisé contre les capacités de statut.", // NEEDS QC
	},
	gooey: {
		name: "Poisseux",
		shortDesc: "Les Pokémon qui touchent ce Pokémon voient leur Vitesse baisser d'un niveau.", // NEEDS QC
	},
	gorillatactics: {
		name: "Entêtement",
		// Official flavor text: "Augmente l’Attaque, mais empêche d’utiliser toute autre capacité que celle utilisée en premier par le Pokémon."
		desc: "L'Attaque de ce Pokémon est multipliée par 1,5, mais il ne peut sélectionner que la première capacité qu'il exécute. Ces effets sont empêchés tant que ce Pokémon est dynamaxé.", // NEEDS QC
		shortDesc: "Attaque x1,5, mais ce Pokémon ne peut choisir que sa première capacité.", // NEEDS QC
	},
	grasspelt: {
		name: "Toison Herbue",
		shortDesc: "Si un Champ Herbu est actif, la Défense de ce Pokémon est multipliée par 1,5.", // NEEDS QC
	},
	grassysurge: {
		name: "Créa-Herbe",
		shortDesc: "À l'entrée, ce Pokémon invoque un Champ Herbu.", // NEEDS QC
	},
	grimneigh: {
		name: "Sombre Ruade",
		// Official flavor text: "Quand le Pokémon met un ennemi K.O., il émet un hennissement terrifiant qui augmente son Attaque Spéciale."
		desc: "L'Attaque Spéciale de ce Pokémon monte d'un niveau quand il met un autre Pokémon K.O. avec une attaque.", // NEEDS QC
		shortDesc: "L'Atq. Spé de ce Pokémon monte d'un niveau s'il met un autre Pokémon K.O.", // NEEDS QC
	},
	guarddog: {
		name: "Chien de Garde",
		// Official flavor text: "L’Attaque du Pokémon augmente s’il subit l’effet du talent Intimidation. Les capacités ou objets qui font changer de Pokémon n’ont aucun effet sur lui."
		desc: "Ce Pokémon est immunisé contre l'effet du talent Intimidation : son Attaque monte d'un niveau à la place. Ce Pokémon ne peut pas être forcé de quitter le combat par une attaque ou un objet d'un autre Pokémon.", // NEEDS QC
		shortDesc: "Immunisé contre Intimidation : +1 Attaque à la place. Ne peut être forcé de partir.", // NEEDS QC
	},
	gulpmissile: {
		name: "Dégobage",
		// Official flavor text: "Quand le Pokémon utilise Surf ou Plongée, il revient avec une proie. Lorsqu’il subit des dégâts par la suite, il attaque en recrachant sa proie."
		desc: "Si ce Pokémon est un Nigosier, il change de forme quand il touche une cible avec Surf ou réussit le premier tour de Plongée. Il prend sa Forme Gobage avec un Embrochet dans la bouche s'il lui reste plus de la moitié de ses PV max, ou sa Forme Gloutonnerie avec un Pikachu dans la bouche s'il lui reste la moitié ou moins de ses PV max. Si Nigosier est touché sous Forme Gobage ou Gloutonnerie, il crache l'Embrochet ou le Pikachu sur son attaquant, même s'il n'a plus de PV. Le projectile inflige des dégâts égaux à 1/4 des PV max de la cible, arrondi à l'inférieur ; ces dégâts sont bloqués par le talent Garde Magik, mais pas par un clone. Un Embrochet baisse aussi la Défense de la cible d'un niveau, et un Pikachu la paralyse. Nigosier reprend sa forme normale s'il crache un projectile, quitte le combat ou se dynamaxe.", // NEEDS QC
		shortDesc: "Touché après Surf/Plongée : l'attaquant perd 1/4 de ses PV et -1 Déf ou paralysie.", // NEEDS QC
	},
	guts: {
		name: "Cran",
		// Official flavor text: "Augmente l'Attaque du Pokémon s'il est affecté par une altération de statut."
		desc: "Si ce Pokémon a un problème de statut, son Attaque est multipliée par 1,5. Les attaques physiques de ce Pokémon ignorent la réduction de moitié des dégâts due à la brûlure.", // NEEDS QC
		shortDesc: "Si ce Pokémon a un statut, son Attaque est x1,5 ; ignore la baisse due à la brûlure.", // NEEDS QC
	},
	hadronengine: {
		name: "Moteur à Hadrons",
		shortDesc: "À l'entrée, invoque un Champ Électrifié ; Atq. Spé x1,3333 sur ce champ.", // NEEDS QC

		start: "  {POKEMON} crée un champ électrifié et active une machine du futur !",
		activate: "  {POKEMON} active une machine du futur grâce au champ électrifié !",
	},
	harvest: {
		name: "Récolte",
		// Official flavor text: "Permet de réutiliser une même Baie plusieurs fois."
		desc: "Si le dernier objet utilisé par ce Pokémon est une Baie, il y a 50 % de chances qu'elle soit restaurée à la fin de chaque tour. Si Soleil est actif, cette chance passe à 100 %.", // NEEDS QC
		shortDesc: "Dernier objet une Baie : 50 % de chances de la restaurer par tour, 100 % au soleil.", // NEEDS QC

		addItem: "  {POKEMON} a récolté {ITEM:indefinite} !",
	},
	healer: {
		name: "Cœur Soin",
		// Official flavor text: "Soigne parfois une altération de statut d’un allié proche."
		desc: "Il y a 30 % de chances que le problème de statut de l'allié de ce Pokémon soit soigné à la fin de chaque tour.", // NEEDS QC
		shortDesc: "30 % de chances de soigner le statut de son allié à la fin de chaque tour.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "30 % de chances, pour chaque allié adjacent, que son problème de statut soit soigné à la fin de chaque tour.", // NEEDS QC
			shortDesc: "30 % de chances par allié adjacent de soigner son statut en fin de tour.", // NEEDS QC
		},
	},
	heatproof: {
		name: "Ignifugé",
		// Official flavor text: "Diminue de moitié les dégâts infligés au Pokémon par les capacités de type Feu."
		desc: "Si un Pokémon utilise une attaque de type Feu contre ce Pokémon, sa statistique offensive est divisée par deux dans le calcul des dégâts infligés à ce Pokémon. Ce Pokémon subit la moitié des dégâts habituels de la brûlure, arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Attaques Feu subies : offense adverse réduite de moitié. Dégâts de brûlure : moitié.", // NEEDS QC
		gen8: {
			desc: "La puissance des attaques de type Feu contre ce Pokémon est divisée par deux. Ce Pokémon subit la moitié des dégâts de brûlure habituels, arrondi à l'inférieur.", // NEEDS QC
			shortDesc: "Attaques Feu subies : puissance divisée par deux ; brûlure réduite de moitié.", // NEEDS QC
		},
	},
	heavymetal: {
		name: "Heavy Metal",
		// Official flavor text: "Double le poids du Pokémon."
		desc: "Le poids de ce Pokémon est doublé. Cet effet est calculé après l'effet d'Allègement et avant celui de la Pierrallégée.", // NEEDS QC
		shortDesc: "Le poids de ce Pokémon est doublé.", // NEEDS QC
	},
	honeygather: {
		name: "Cherche Miel",
		shortDesc: "Aucune utilité en combat.", // NEEDS QC
	},
	hospitality: {
		name: "Aux Petits Soins",
		shortDesc: "À l'entrée, ce Pokémon restaure 1/4 des PV max de son allié.", // NEEDS QC

		heal: "  {POKEMON} boit le thé préparé par {SOURCE} !",
	},
	hugepower: {
		name: "Coloforce",
		shortDesc: "L'Attaque de ce Pokémon est doublée.", // NEEDS QC
	},
	hungerswitch: {
		name: "Déclic Fringale",
		// Official flavor text: "À la fin de chaque tour, le Pokémon alterne entre ses formes Mode Rassasié et Mode Affamé."
		desc: "Si ce Pokémon est un Morpeko, il alterne entre son Motif Rassasié et son Motif Affamé à la fin de chaque tour.", // NEEDS QC
		shortDesc: "Morpeko alterne entre Motif Rassasié et Motif Affamé à chaque fin de tour.", // NEEDS QC
	},
	hustle: {
		name: "Agitation",
		// Official flavor text: "Améliore l'Attaque du Pokémon, mais diminue la Précision."
		desc: "L'Attaque de ce Pokémon est multipliée par 1,5 et la précision de ses attaques physiques est multipliée par 0,8.", // NEEDS QC
		shortDesc: "Son Attaque est x1,5, mais la précision de ses attaques physiques est x0,8.", // NEEDS QC
	},
	hydration: {
		name: "Hydratation",
		// Official flavor text: "Soigne les altérations de statut du Pokémon quand il pleut."
		desc: "Le problème de statut de ce Pokémon est soigné à la fin de chaque tour si Pluie est active. Cet effet est empêché si ce Pokémon tient un Parapluie Solide.", // NEEDS QC
		shortDesc: "Le statut de ce Pokémon est soigné à la fin du tour si Pluie est active.", // NEEDS QC
		gen7: {
			desc: "Si Pluie est actif, le problème de statut de ce Pokémon est soigné à la fin de chaque tour.", // NEEDS QC
		},
	},
	hypercutter: {
		name: "Hyper Cutter",
		shortDesc: "Empêche les autres Pokémon de baisser l'Attaque de ce Pokémon.", // NEEDS QC
	},
	icebody: {
		name: "Corps Gel",
		// Official flavor text: "Régénère peu à peu les PV du Pokémon quand il neige."
		desc: "S'il neige, ce Pokémon récupère 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour.", // NEEDS QC
		shortDesc: "S'il neige, ce Pokémon récupère 1/16 de ses PV max chaque tour.", // NEEDS QC
		gen8: {
			desc: "Si Grêle est actif, ce Pokémon récupère 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour. Ce Pokémon ne subit pas de dégâts de Grêle.", // NEEDS QC
			shortDesc: "Sous la grêle : récupère 1/16 de ses PV max par tour ; immunisé contre la grêle.", // NEEDS QC
		},
	},
	iceface: {
		name: "Tête de Gel",
		// Official flavor text: "Le glaçon sur sa tête encaisse les attaques physiques à la place du Pokémon, mais sa destruction modifie son apparence. Le glaçon se reforme quand il neige."
		desc: "Si ce Pokémon est un Bekaglaçon, le premier coup physique qu'il subit en combat inflige 0 dégât (neutre). Sa tête de glace est alors brisée et il prend sa Forme Tête Dégel. Bekaglaçon reprend sa Forme Tête de Gel quand la neige commence à tomber ou quand il entre au combat pendant qu'il neige. Les dégâts de confusion brisent aussi la tête de glace.", // NEEDS QC
		shortDesc: "(Bekaglaçon) Le premier coup physique subi fait 0 dégât. Revient avec la neige.", // NEEDS QC
		gen8: {
			desc: "Si ce Pokémon est un Bekaglaçon, le premier coup physique qu'il subit en combat inflige 0 dégât (neutre). Sa tête de gel est alors brisée et il prend sa Forme Dégelée. Il reprend sa Forme Gelée quand Grêle commence ou s'il entre au combat pendant Grêle. Les dégâts de confusion brisent aussi la tête de gel.", // NEEDS QC
			shortDesc: "Si Bekaglaçon : le premier coup physique subi inflige 0 dégât. Restauré par la grêle.", // NEEDS QC
		},
	},
	icescales: {
		name: "Écailles Glacées",
		shortDesc: "Ce Pokémon subit la moitié des dégâts des attaques spéciales.", // NEEDS QC
	},
	illuminate: {
		name: "Lumiattirance",
		// Official flavor text: "Le Pokémon illumine les alentours, ce qui empêche sa Précision de baisser."
		desc: "Empêche les autres Pokémon de baisser le niveau de précision de ce Pokémon. Ce Pokémon ignore le niveau d'esquive de la cible.", // NEEDS QC
		shortDesc: "Sa précision ne peut pas être baissée ; ignore l'esquive des autres.", // NEEDS QC
		gen8: {
			desc: "Aucune utilité en combat.", // NEEDS QC
			shortDesc: "Aucune utilité en combat.", // NEEDS QC
		},
	},
	illusion: {
		name: "Illusion",
		// Official flavor text: "Le Pokémon prend l’apparence du dernier membre de l’équipe pour tromper l’adversaire."
		desc: "Quand ce Pokémon entre au combat, il prend l'apparence du dernier Pokémon non K.O. de son équipe jusqu'à ce qu'il subisse des dégâts directs d'une attaque d'un autre Pokémon. Le niveau et les PV affichés sont ceux de ce Pokémon, pas ceux du Pokémon imité.", // NEEDS QC
		shortDesc: "Prend l'apparence du dernier Pokémon de l'équipe jusqu'à subir des dégâts directs.", // NEEDS QC

		end: "  L’illusion {POKEMON:de} se brise !",
	},
	immunity: {
		name: "Vaccin",
		shortDesc: "Ce Pokémon ne peut pas être empoisonné. L'obtenir en l'étant le soigne.", // NEEDS QC
	},
	imposter: {
		name: "Imposteur",
		// Official flavor text: "Le Pokémon prend l’apparence du Pokémon adverse."
		desc: "En entrant au combat, ce Pokémon se transforme en copie du Pokémon adverse qui lui fait face. S'il n'y a aucun Pokémon à cette position, ce Pokémon ne se transforme pas.", // NEEDS QC
		shortDesc: "À l'entrée, ce Pokémon se transforme en l'adversaire qui lui fait face.", // NEEDS QC
	},
	infiltrator: {
		name: "Infiltration",
		// Official flavor text: "Traverse les barrières et les clones adverses pour attaquer directement."
		desc: "Les capacités de ce Pokémon ignorent les clones ainsi que Protection, Mur Lumière, Rune Protect, Brume et Voile Aurore du côté adverse.", // NEEDS QC
		shortDesc: "Ses capacités ignorent les clones, les murs, Rune Protect et Brume.", // NEEDS QC
		gen6: {
			desc: "Les capacités de ce Pokémon ignorent les clones ainsi que Protection, Mur Lumière, Rune Protect et Brume du côté adverse.", // NEEDS QC
			shortDesc: "Les capacités ignorent les clones et Protection, Mur Lumière, Rune Protect, Brume.", // NEEDS QC
		},
		gen5: {
			desc: "Les capacités de ce Pokémon ignorent Protection, Mur Lumière, Rune Protect et Brume du côté adverse.", // NEEDS QC
			shortDesc: "Les capacités ignorent Protection, Mur Lumière, Rune Protect et Brume adverses.", // NEEDS QC
		},
	},
	innardsout: {
		name: "Expuls’Organes",
		// Official flavor text: "Le Pokémon inflige à l’adversaire l’ayant mis K.O. des dégâts égaux au nombre de PV qu’il lui restait avant le coup de grâce."
		desc: "Si ce Pokémon est mis K.O. par une capacité, l'utilisateur de cette capacité perd autant de PV que les dégâts infligés à ce Pokémon.", // NEEDS QC
		shortDesc: "Si ce Pokémon est mis K.O., l'attaquant perd autant de PV que les dégâts infligés.", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "Attention",
		// Official flavor text: "Le Pokémon a un mental à toute épreuve qui empêche les attaques ennemies de lui faire peur. Il est aussi immunisé contre le talent Intimidation."
		desc: "Ce Pokémon ne peut pas être apeuré. Ce Pokémon est immunisé contre l'effet du talent Intimidation.", // NEEDS QC
		shortDesc: "Ce Pokémon ne peut pas être apeuré. Immunisé contre Intimidation.", // NEEDS QC
		gen7: {
			desc: "Ce Pokémon ne peut pas être apeuré.", // NEEDS QC
			shortDesc: "Ce Pokémon ne peut pas être apeuré.", // NEEDS QC
		},
	},
	insomnia: {
		name: "Insomnia",
		shortDesc: "Ce Pokémon ne peut pas s'endormir. L'obtenir en dormant le réveille.", // NEEDS QC
	},
	intimidate: {
		name: "Intimidation",
		// Official flavor text: "Le Pokémon rugit lorsqu'il arrive au combat, ce qui intimide l'ennemi et baisse son Attaque."
		desc: "En entrant au combat, ce Pokémon baisse l'Attaque des Pokémon adverses d'un niveau. Les Pokémon ayant les talents Attention, Benêt, Tempo Perso ou Querelleur et les Pokémon derrière un clone sont immunisés.", // NEEDS QC
		shortDesc: "À l'entrée, ce Pokémon baisse l'Attaque des adversaires d'un niveau.", // NEEDS QC
		gen7: {
			desc: "À l'entrée au combat, ce Pokémon baisse l'Attaque des Pokémon adverses d'un niveau. Les Pokémon derrière un clone sont immunisés.", // NEEDS QC
		},
		gen6: {
			desc: "À l'entrée au combat, ce Pokémon baisse l'Attaque des Pokémon adverses adjacents d'un niveau. Les Pokémon derrière un clone sont immunisés.", // NEEDS QC
			shortDesc: "À l'entrée au combat, baisse l'Attaque des adversaires adjacents d'un niveau.", // NEEDS QC
		},
		gen4: {
			desc: "À l'entrée au combat, ce Pokémon baisse l'Attaque des Pokémon adverses d'un niveau. Les Pokémon derrière un clone sont immunisés. Si Demi-Tour brise un clone adverse et que ce Pokémon entre en remplacement, le Pokémon qui avait le clone reste immunisé contre ce talent.", // NEEDS QC
			shortDesc: "À l'entrée, ce Pokémon baisse l'Attaque des adversaires d'un niveau.", // NEEDS QC
		},
		gen3: {
			desc: "À l'entrée au combat, ce Pokémon baisse l'Attaque des Pokémon adverses d'un niveau. Les Pokémon derrière un clone sont immunisés.", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "Lame Indomptable",
		shortDesc: "À l'entrée, l'Attaque de ce Pokémon monte d'un niveau. Une fois par combat.", // NEEDS QC
		gen8: {
			shortDesc: "À l'entrée, l'Attaque de ce Pokémon monte d'un niveau.", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "Épine de Fer",
		// Official flavor text: "Inflige des dégâts à l’attaquant lorsque le Pokémon subit une attaque directe."
		desc: "Les Pokémon qui touchent ce Pokémon avec une capacité directe perdent 1/8 de leurs PV max, arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Les Pokémon qui touchent ce Pokémon perdent 1/8 de leurs PV max.", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "Poing de Fer",
		// Official flavor text: "Augmente la puissance des capacités coups de poing."
		desc: "Les attaques de ce Pokémon utilisant les poings ont leur puissance multipliée par 1,2.", // NEEDS QC
		shortDesc: "Ses attaques de poing ont une puissance x1,2. Coup Bas exclu.", // NEEDS QC
	},
	justified: {
		name: "Cœur Noble",
		shortDesc: "+1 Attaque quand ce Pokémon subit des dégâts d'une capacité de type Ténèbres.", // NEEDS QC
	},
	keeneye: {
		name: "Regard Vif",
		// Official flavor text: "Les yeux perçants du Pokémon empêchent sa Précision de baisser."
		desc: "Empêche les autres Pokémon de baisser le niveau de précision de ce Pokémon. Ce Pokémon ignore le niveau d'esquive de la cible.", // NEEDS QC
		shortDesc: "Sa précision ne peut pas être baissée ; ignore l'esquive des autres.", // NEEDS QC
		gen5: {
			desc: "Empêche les autres Pokémon de baisser la précision de ce Pokémon.", // NEEDS QC
			shortDesc: "Les autres Pokémon ne peuvent pas baisser sa précision.", // NEEDS QC
		},
	},
	klutz: {
		name: "Maladresse",
		// Official flavor text: "Le Pokémon ne peut utiliser aucun objet tenu."
		desc: "L'objet tenu par ce Pokémon n'a aucun effet. Ce Pokémon ne peut pas utiliser Dégommage avec succès. Bracelet Macho, Chaîne Pouvoir, Bandeau Pouvoir, Ceinture Pouvoir, Poignet Pouvoir, Lentille Pouvoir et Poids Pouvoir conservent leurs effets.", // NEEDS QC
		shortDesc: "Son objet tenu est sans effet (sauf Bracelet Macho). Dégommage inutilisable.", // NEEDS QC
	},
	leafguard: {
		name: "Feuille Garde",
		// Official flavor text: "Protège le Pokémon contre les altérations de statut quand le soleil brille."
		desc: "Si Soleil est actif, ce Pokémon ne peut être affecté ni par un problème de statut ni par Bâillement, et Repos échoue s'il l'utilise. Cet effet est empêché si ce Pokémon tient un Parapluie Solide.", // NEEDS QC
		shortDesc: "Si Soleil est actif, ce Pokémon ne peut pas être statusé et Repos échoue.", // NEEDS QC
		gen7: {
			desc: "Si Soleil est actif, ce Pokémon ne peut subir ni problème de statut ni l'effet de Bâillement, et Repos échoue pour lui.", // NEEDS QC
		},
		gen4: {
			desc: "Si Soleil est actif, ce Pokémon ne peut subir ni problème de statut ni l'effet de Bâillement, mais peut utiliser Repos normalement.", // NEEDS QC
			shortDesc: "Sous Soleil : aucun problème de statut, mais Repos fonctionne normalement.", // NEEDS QC
		},
	},
	levitate: {
		name: "Lévitation",
		// Official flavor text: "Le Pokémon flotte, ce qui l'immunise contre les capacités de type Sol."
		desc: "Ce Pokémon est immunisé contre les attaques de type Sol et contre les effets de Picots, Pics Toxik, Toile Gluante et du talent Piège Sable. Les effets de Gravité, Racines, Anti-Air, Myria-Flèches et de la Balle Fer annulent cette immunité. Myria-Flèches peut toucher ce Pokémon comme s'il n'avait pas ce talent.", // NEEDS QC
		shortDesc: "Immunisé contre le Sol ; annulé par Gravité, Racines, Anti-Air, Balle Fer.", // NEEDS QC
		gen5: {
			desc: "Ce Pokémon est immunisé contre les attaques de type Sol et contre les effets de Picots, Pics Toxik et du talent Piège Sable. Les effets de Gravité, Racines, Anti-Air et de la Balle Fer annulent cette immunité.", // NEEDS QC
		},
		gen4: {
			desc: "Ce Pokémon est immunisé contre les attaques de type Sol et contre les effets de Picots, Pics Toxik et du talent Piège Sable. Les effets de Gravité, Racines et de la Balle Fer annulent cette immunité.", // NEEDS QC
			shortDesc: "Immunisé contre le type Sol ; Gravité/Racines/Balle Fer l'annulent.", // NEEDS QC
		},
		gen3: {
			desc: "Ce Pokémon est immunisé contre les attaques de type Sol et contre les effets de Picots et du talent Piège Sable.", // NEEDS QC
			shortDesc: "Ce Pokémon est immunisé contre le type Sol.", // NEEDS QC
		},
	},
	libero: {
		name: "Libéro",
		// Official flavor text: "Le Pokémon prend le type de la capacité qu’il utilise. Ce talent ne peut se déclencher qu’une fois par entrée au combat du Pokémon."
		desc: "Le type de ce Pokémon devient celui de la capacité qu'il s'apprête à utiliser. Cet effet s'applique après tous les effets qui changent le type d'une capacité. Cet effet ne peut se produire qu'une fois par entrée au combat, et seulement si ce Pokémon n'est pas téracristallisé.", // NEEDS QC
		shortDesc: "Son type devient celui de la capacité qu'il utilise. Une fois par entrée.", // NEEDS QC
		gen8: {
			desc: "Le type de ce Pokémon devient celui de la capacité qu'il s'apprête à utiliser. Cet effet s'applique après tous les effets qui changent le type d'une capacité.", // NEEDS QC
			shortDesc: "Le type de ce Pokémon devient celui de la capacité qu'il va utiliser.", // NEEDS QC
		},
	},
	lightmetal: {
		name: "Light Metal",
		// Official flavor text: "Divise par deux le poids du Pokémon."
		desc: "Le poids de ce Pokémon est divisé par deux, arrondi au dixième de kilogramme inférieur. Cet effet est calculé après l'effet d'Allègement et avant celui de la Pierrallégée. Le poids d'un Pokémon ne peut pas descendre sous 0,1 kg.", // NEEDS QC
		shortDesc: "Le poids de ce Pokémon est réduit de moitié.", // NEEDS QC
	},
	lightningrod: {
		name: "Paratonnerre",
		// Official flavor text: "Le Pokémon détourne sur lui les capacités de type Électrik et les neutralise, tout en augmentant son Attaque Spéciale."
		desc: "Ce Pokémon est immunisé contre les capacités de type Électrik et son Attaque Spéciale monte d'un niveau quand il est touché par une capacité de type Électrik. Si ce Pokémon n'est pas la cible d'une capacité de type Électrik à cible unique utilisée par un autre Pokémon, il redirige cette capacité vers lui s'il est à sa portée. Si plusieurs Pokémon peuvent rediriger avec ce talent, c'est celui avec la plus grande Vitesse qui le fait, ou en cas d'égalité, celui dont le talent est actif depuis le plus longtemps.", // NEEDS QC
		shortDesc: "Attire les capacités Électrik pour monter son Atq. Spé de 1 ; immunité Électrik.", // NEEDS QC
		gen4: {
			desc: "Si ce Pokémon n'est pas la cible d'une capacité de type Électrik à cible unique utilisée par un autre Pokémon, il redirige cette capacité vers lui.", // NEEDS QC
			shortDesc: "Attire vers lui les capacités Électrik à cible unique.", // NEEDS QC
		},
		gen3: {
			desc: "Si ce Pokémon n'est pas la cible d'une capacité de type Électrik à cible unique utilisée par un adversaire, il redirige cette capacité vers lui. Cet effet considère Puissance Cachée comme étant de type Normal.", // NEEDS QC
			shortDesc: "Attire vers lui les capacités Électrik adverses à cible unique.", // NEEDS QC
		},

		activate: "  {POKEMON} attire l’attaque sur lui !",
	},
	limber: {
		name: "Échauffement",
		shortDesc: "Ce Pokémon ne peut pas être paralysé. L'obtenir en l'étant le soigne.", // NEEDS QC
	},
	lingeringaroma: {
		name: "Odeur Tenace",
		// Official flavor text: "Lorsque le Pokémon subit une attaque directe, le talent de l’attaquant est remplacé par Odeur Tenace."
		desc: "Les Pokémon qui touchent ce Pokémon avec une capacité directe voient leur talent devenir Odeur Tenace. N'affecte pas les Pokémon ayant les talents Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Odeur Tenace, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Mode Transe et Supermutation.", // NEEDS QC
		shortDesc: "Le talent d'un attaquant au contact devient Odeur Tenace.", // NEEDS QC
		gen8: {
			desc: "Les Pokémon touchant ce Pokémon voient leur talent devenir Odeur Tenace. N'affecte pas les Pokémon ayant les talents Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Odeur Tenace, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe.", // NEEDS QC
		},

		changeAbility: "  Une odeur tenace imprègne {TARGET} !",
	},
	liquidooze: {
		name: "Suintement",
		shortDesc: "Les Pokémon qui drainent ses PV subissent autant de dégâts qu'ils auraient soignés.", // NEEDS QC
		gen4: {
			desc: "Ce Pokémon inflige aux Pokémon qui lui drainent des PV autant de dégâts qu'ils auraient soignés. Cet effet ne s'applique pas à Dévorêve.", // NEEDS QC
		},

		damage: "  {POKEMON} aspire le suintement !",
	},
	liquidvoice: {
		name: "Hydrata-Son",
		// Official flavor text: "Toutes les attaques sonores du Pokémon prennent le type Eau."
		desc: "Les capacités sonores de ce Pokémon deviennent de type Eau. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
		shortDesc: "Les capacités sonores de ce Pokémon deviennent de type Eau.", // NEEDS QC
	},
	longreach: {
		name: "Longue Portée",
		shortDesc: "Les attaques de ce Pokémon n'entrent pas en contact avec la cible.", // NEEDS QC
	},
	magicbounce: {
		name: "Miroir Magik",
		// Official flavor text: "Annule les effets des capacités de statut subies par le Pokémon et les retourne à l’envoyeur."
		desc: "Ce Pokémon n'est pas affecté par certaines capacités sans dégâts qui le ciblent : il les renvoie contre leur utilisateur. Les capacités ainsi renvoyées ne peuvent pas être renvoyées de nouveau par ce talent ou par l'effet de Reflet Magik. Picots, Piège de Roc, Toile Gluante et Pics Toxik ne peuvent être renvoyés qu'une fois par équipe, par le Pokémon le plus à gauche sous ce talent ou sous l'effet de Reflet Magik. Les talents Paratonnerre et Lavabo redirigent leurs capacités respectives avant que ce talent n'agisse.", // NEEDS QC
		shortDesc: "Ce Pokémon renvoie certaines capacités de statut à leur utilisateur.", // NEEDS QC
		gen5: {
			desc: "Ce Pokémon n'est pas affecté par certaines capacités de statut qui le visent et les utilise à la place contre leur utilisateur d'origine. Les capacités ainsi renvoyées ne peuvent pas être renvoyées à nouveau par ce talent ou Reflet Magik. Picots, Piège de Roc et Pics Toxik ne peuvent être renvoyées qu'une fois par côté, par le Pokémon le plus à gauche sous ce talent ou l'effet de Reflet Magik. Les talents Paratonnerre et Lavabo redirigent leurs capacités respectives avant que ce talent n'agisse.", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "Garde Magik",
		// Official flavor text: "Seules les attaques peuvent blesser le Pokémon."
		desc: "Ce Pokémon ne peut subir de dégâts que des attaques directes. Les dégâts de Malédiction et Clonage quand ce Pokémon les utilise, de Cognobidon, de Balance, du contrecoup de Lutte et de la confusion sont considérés comme directs.", // NEEDS QC
		shortDesc: "Ce Pokémon ne peut subir de dégâts que des attaques directes.", // NEEDS QC
		gen4: {
			desc: "Ce Pokémon ne peut être blessé que par des attaques directes. Malédiction et Clonage à l'utilisation, Cognobidon, Balance, le contrecoup de Lutte et les dégâts de confusion sont considérés comme des dégâts directs. Ce Pokémon ne peut pas être empêché d'agir par la paralysie et n'est pas affecté par Pics Toxik à l'entrée.", // NEEDS QC
			shortDesc: "Seules les attaques directes le blessent ; jamais totalement paralysé.", // NEEDS QC
		},
	},
	magician: {
		name: "Magicien",
		// Official flavor text: "Les capacités volent aussi l’objet tenu par la cible."
		desc: "Si ce Pokémon n'a pas d'objet, il vole celui du Pokémon qu'il touche avec une attaque. N'affecte pas Vœu Destructeur ni Prescience. Si une attaque touche plusieurs cibles, l'objet est volé au Pokémon le plus rapide, en tenant compte de l'effet de Distorsion et en priorisant les Pokémon adverses avant les alliés.", // NEEDS QC
		shortDesc: "S'il n'a pas d'objet, ce Pokémon vole celui du Pokémon qu'il touche.", // NEEDS QC
	},
	magmaarmor: {
		name: "Armumagma",
		shortDesc: "Ce Pokémon ne peut pas être gelé. L'obtenir en l'étant le dégèle.", // NEEDS QC
	},
	magnetpull: {
		name: "Magnépiège",
		// Official flavor text: "Attire les Pokémon Acier grâce à un champ magnétique, ce qui les empêche de quitter le terrain."
		desc: "Empêche les Pokémon adverses de type Acier de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue ou sont de type Spectre.", // NEEDS QC
		shortDesc: "Empêche les adversaires de type Acier de choisir de quitter le combat.", // NEEDS QC
		gen6: {
			desc: "Empêche les Pokémon adverses adjacents de type Acier de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue ou sont de type Spectre.", // NEEDS QC
			shortDesc: "Les adversaires Acier adjacents ne peuvent pas choisir de se retirer.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche les Pokémon adverses adjacents de type Acier de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue.", // NEEDS QC
			shortDesc: "Les adversaires Acier adjacents ne peuvent pas choisir de se retirer.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche les Pokémon adverses de type Acier de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue.", // NEEDS QC
			shortDesc: "Empêche les adversaires de type Acier de choisir de quitter le combat.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche les Pokémon de type Acier de choisir de quitter le combat, sauf ce Pokémon.", // NEEDS QC
			shortDesc: "Les Pokémon Acier ne peuvent pas se retirer, sauf ce Pokémon.", // NEEDS QC
		},
	},
	marvelscale: {
		name: "Écaille Spéciale",
		shortDesc: "Si ce Pokémon a un problème de statut, sa Défense est multipliée par 1,5.", // NEEDS QC
	},
	megalauncher: {
		name: "Méga Blaster",
		// Official flavor text: "Augmente la puissance des capacités qui projettent une aura."
		desc: "Les capacités à base d'ondes et d'auras de ce Pokémon ont leur puissance multipliée par 1,5. Vibra Soin restaure 3/4 des PV max de la cible, les 0,5 étant arrondis à l'inférieur.", // NEEDS QC
		shortDesc: "Ses capacités d'ondes ont une puissance x1,5. Vibra Soin soigne 3/4 des PV.", // NEEDS QC
	},
	megasol: {
		name: "Méga-Soleil",
		shortDesc: "Les capacités de ce Pokémon agissent comme si Soleil était actif.", // NEEDS QC
	},
	merciless: {
		name: "Cruauté",
		shortDesc: "Les attaques de ce Pokémon sont des coups critiques contre les cibles empoisonnées.", // NEEDS QC
	},
	mimicry: {
		name: "Mimétisme",
		// Official flavor text: "Le Pokémon adopte le même type que le terrain lorsqu’un champ est actif."
		desc: "Les types de ce Pokémon changent selon le champ actif quand ce Pokémon acquiert ce talent ou quand un champ commence : type Électrik sur un Champ Électrifié, type Plante sur un Champ Herbu, type Fée sur un Champ Brumeux et type Psy sur un Champ Psychique. Si ce talent est acquis sans champ actif, ou quand un champ prend fin, ce Pokémon retrouve les types d'origine de son espèce.", // NEEDS QC
		shortDesc: "Ses types changent selon le champ actif et reviennent quand il prend fin.", // NEEDS QC

		activate: "  {POKEMON} a repris son type d’origine !",
	},
	mindseye: {
		name: "Œil Révélateur",
		// Official flavor text: "Le Pokémon ignore les changements d’Esquive des cibles et peut toucher les Pokémon Spectre avec des capacités Normal ou Combat. Sa Précision ne peut pas baisser."
		desc: "Ce Pokémon peut toucher les Pokémon de type Spectre avec des capacités de type Normal et Combat. Empêche les autres Pokémon de baisser le niveau de précision de ce Pokémon. Ce Pokémon ignore le niveau d'esquive de la cible.", // NEEDS QC
		shortDesc: "Normal et Combat touchent Spectre. Précision non réductible, ignore l'esquive.", // NEEDS QC
	},
	minus: {
		name: "Moins",
		// Official flavor text: "L’Attaque Spéciale du Pokémon augmente si un Pokémon allié a le talent Moins ou Plus."
		desc: "Si un allié actif a ce talent ou le talent Plus, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5.", // NEEDS QC
		shortDesc: "Si un allié actif a ce talent ou Plus, son Atq. Spé est x1,5.", // NEEDS QC
		gen4: {
			desc: "Si un allié actif a le talent Plus, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5.", // NEEDS QC
			shortDesc: "Si un allié actif a Plus, son Atq. Spé est x1,5.", // NEEDS QC
		},
		gen3: {
			desc: "Si un Pokémon actif a le talent Plus, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5.", // NEEDS QC
			shortDesc: "Si un Pokémon actif a Plus, son Atq. Spé est x1,5.", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "Armure Miroir",
		// Official flavor text: "Le Pokémon renvoie les effets réducteurs de stats qu’il reçoit."
		desc: "Quand un niveau de statistique de ce Pokémon devrait être baissé par un autre Pokémon, c'est le niveau de ce dernier qui baisse à la place. Cet effet ne se produit pas si le niveau de ce Pokémon était déjà à -6. Si l'autre Pokémon a un clone, aucun des deux ne voit ses niveaux baisser.", // NEEDS QC
		shortDesc: "Si les statistiques de ce Pokémon devraient baisser, celles de l'attaquant baissent.", // NEEDS QC
	},
	mistysurge: {
		name: "Créa-Brume",
		shortDesc: "À l'entrée, ce Pokémon invoque un Champ Brumeux.", // NEEDS QC
	},
	moldbreaker: {
		name: "Brise Moule",
		// Official flavor text: "Le Pokémon ignore les talents adverses qui auraient un effet sur ses capacités."
		desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armure Caudale, Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Corps Coloré, Fantômasque, Peau Sèche, Absorbe-Terre, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Corps en Or, Toison Herbue, Chien de Garde, Ignifugé, Heavy Metal, Hyper Cutter, Tête de Gel, Écailles Glacées, Lumiattirance, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Œil Révélateur, Armure Miroir, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Pastel, Punk Rock, Sel Purificateur, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Téra-Carapace, Thermodynamique, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Bien Cuit, Écran Fumée, Aéroporté, Garde Mystik et Peau Miracle. Cet effet concerne tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent soit bénéfique ou non à ce Pokémon.", // NEEDS QC
		shortDesc: "Ses capacités et leurs effets ignorent les talents des autres Pokémon.", // NEEDS QC
		gen8: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Corps Coloré, Fantômasque, Peau Sèche, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Tête de Gel, Écailles Glacées, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Armure Miroir, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Pastel, Punk Rock, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen7: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Aura Ténébreuse, Corps Coloré, Fantômasque, Peau Sèche, Aura Féérique, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen6: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Aura Ténébreuse, Peau Sèche, Aura Féérique, Filtre, Torche, Don Floral, Flora-Voile, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen5: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armurbaston, Cœur de Coq, Corps Sain, Contestation, Moiteur, Peau Sèche, Filtre, Torche, Don Floral, Garde-Ami, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Tempo Perso, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen4: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armurbaston, Corps Sain, Moiteur, Peau Sèche, Filtre, Torche, Don Floral, Ignifugé, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Paratonnerre, Échauffement, Armumagma, Écaille Spéciale, Motorisé, Benêt, Tempo Perso, Voile Sable, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Pieds Confus, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée et Garde Mystik. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon. Le bonus d'Attaque du talent Don Floral d'un allié n'est pas ignoré.", // NEEDS QC
		},

		start: "  {POKEMON} brise le moule !",
	},
	moody: {
		name: "Lunatique",
		// Official flavor text: "Augmente beaucoup une stat du Pokémon et en baisse une autre au hasard à chaque tour."
		desc: "À la fin de chaque tour, une statistique de ce Pokémon choisie au hasard, autre que la précision et l'esquive, monte de 2 niveaux, et une autre baisse d'un niveau.", // NEEDS QC
		shortDesc: "Chaque tour : +2 à une statistique au hasard et -1 à une autre (sauf préc./esquive).", // NEEDS QC
		gen7: {
			desc: "À la fin de chaque tour, une statistique de ce Pokémon monte de 2 niveaux au hasard et une autre baisse d'un niveau.", // NEEDS QC
			shortDesc: "En fin de tour : une stat au hasard +2, une autre -1.", // NEEDS QC
		},
	},
	motordrive: {
		name: "Motorisé",
		// Official flavor text: "Si le Pokémon est touché par une capacité de type Électrik, il ne subit aucun dégât et sa Vitesse augmente."
		desc: "Ce Pokémon est immunisé contre les capacités de type Électrik et sa Vitesse monte d'un niveau quand il est touché par une capacité de type Électrik.", // NEEDS QC
		shortDesc: "+1 Vitesse s'il est touché par une capacité Électrik ; immunité Électrik.", // NEEDS QC
	},
	moxie: {
		name: "Impudence",
		// Official flavor text: "Quand le Pokémon met un ennemi K.O., sa confiance en lui ne connaît plus de limite et son Attaque augmente."
		desc: "L'Attaque de ce Pokémon monte d'un niveau quand il met un autre Pokémon K.O. avec une attaque.", // NEEDS QC
		shortDesc: "L'Attaque de ce Pokémon monte d'un niveau s'il met un autre Pokémon K.O.", // NEEDS QC
	},
	multiscale: {
		name: "Multiécaille",
		shortDesc: "Si ce Pokémon a tous ses PV, les dégâts des attaques subies sont réduits de moitié.", // NEEDS QC
	},
	multitype: {
		name: "Multi-Type",
		shortDesc: "Si ce Pokémon est Arceus, son type devient celui de sa plaque tenue.", // NEEDS QC
		gen7: {
			shortDesc: "Si Arceus : son type dépend de la plaque ou du Cristal Z tenu.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Si ce Pokémon est Arceus, son type devient celui de sa plaque tenue.", // NEEDS QC
		},
		gen4: {
			desc: "Si ce Pokémon est un Arceus, son type devient celui de sa plaque tenue. Ce Pokémon ne peut pas perdre son objet tenu à cause de l'attaque d'un autre Pokémon.", // NEEDS QC
		},
	},
	mummy: {
		name: "Momie",
		// Official flavor text: "Lorsque le Pokémon subit une attaque directe, le talent de l’attaquant est remplacé par Momie."
		desc: "Les Pokémon qui touchent ce Pokémon avec une capacité directe voient leur talent devenir Momie. N'affecte pas les Pokémon ayant les talents Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Momie, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Mode Transe et Supermutation.", // NEEDS QC
		shortDesc: "Le talent d'un attaquant au contact devient Momie.", // NEEDS QC
		gen8: {
			desc: "Les Pokémon touchant ce Pokémon voient leur talent devenir Momie. N'affecte pas les Pokémon ayant les talents Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Momie, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "Les Pokémon touchant ce Pokémon voient leur talent devenir Momie. N'affecte pas les Pokémon ayant les talents Synergie, Hypersommeil, Fantômasque, Multi-Type, Momie, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe.", // NEEDS QC
		},
		gen6: {
			desc: "Les Pokémon touchant ce Pokémon voient leur talent devenir Momie. N'affecte pas les Pokémon ayant les talents Multi-Type, Momie ou Déclic Tactique.", // NEEDS QC
		},
		gen5: {
			desc: "Les Pokémon touchant ce Pokémon voient leur talent devenir Momie. N'affecte pas les Pokémon ayant les talents Multi-Type ou Momie.", // NEEDS QC
		},

		changeAbility: "  Le talent {TARGET:de} devient Momie !",
	},
	myceliummight: {
		name: "Force Fongique",
		// Official flavor text: "Le Pokémon agit toujours plus lentement quand il utilise une capacité de statut, mais il ignore les talents adverses."
		desc: "Les capacités de statut de ce Pokémon ignorent certains talents des autres Pokémon et sont exécutées en dernier parmi les Pokémon utilisant des capacités de priorité égale ou supérieure.", // NEEDS QC
		shortDesc: "Ses capacités de statut vont en dernier dans leur priorité, ignorent les talents.", // NEEDS QC
	},
	naturalcure: {
		name: "Médic Nature",
		shortDesc: "Le problème de statut de ce Pokémon est soigné quand il quitte le combat.", // NEEDS QC

		activate: "  ({POKEMON} est soigné par Médic Nature !)", // NEEDS QC
	},
	neuroforce: {
		name: "Cérébro-Force",
		// Official flavor text: "Augmente encore plus la puissance des attaques super efficaces."
		desc: "Les attaques de ce Pokémon qui sont super efficaces contre la cible ont leurs dégâts multipliés par 1,25.", // NEEDS QC
		shortDesc: "Ses attaques super efficaces infligent des dégâts x1,25.", // NEEDS QC
	},
	neutralizinggas: {
		name: "Gaz Inhibiteur",
		// Official flavor text: "Si un Pokémon avec Gaz Inhibiteur est sur le terrain, les effets des talents de tous les autres Pokémon ne s’activent pas ou sont neutralisés."
		desc: "Tant que ce Pokémon est au combat, les talents n'ont aucun effet. Ce talent s'active avant les pièges et les autres talents. N'affecte pas les talents Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Gaz Inhibiteur, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Mode Transe et Supermutation.", // NEEDS QC
		shortDesc: "Tant que ce Pokémon est au combat, les talents n'ont aucun effet.", // NEEDS QC
		gen8: {
			desc: "Tant que ce Pokémon est au combat, les talents n'ont aucun effet. Ce talent s'active avant les pièges et les autres talents. N'affecte pas les talents Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Gaz Inhibiteur, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe.", // NEEDS QC
		},

		start: "  Un gaz inhibiteur envahit les lieux !",
		end: "  Les effets du gaz inhibiteur se sont dissipés.",
	},
	noguard: {
		name: "Annule Garde",
		shortDesc: "Les capacités utilisées par ou contre ce Pokémon touchent toujours.", // NEEDS QC
	},
	normalize: {
		name: "Normalise",
		// Official flavor text: "Toutes les capacités du Pokémon deviennent de type Normal, quel que soit leur type original. Leur puissance augmente légèrement."
		desc: "Les capacités de ce Pokémon deviennent de type Normal et leur puissance est multipliée par 1,2. Cet effet s'applique avant les autres effets qui changent le type d'une capacité.", // NEEDS QC
		shortDesc: "Ses capacités deviennent de type Normal avec une puissance x1,2.", // NEEDS QC
		gen6: {
			desc: "Les capacités de ce Pokémon deviennent de type Normal. Cet effet s'applique avant les autres effets qui changent le type d'une capacité.", // NEEDS QC
			shortDesc: "Les capacités de ce Pokémon deviennent de type Normal.", // NEEDS QC
		},
		gen4: {
			desc: "Les capacités de ce Pokémon deviennent de type Normal. Cet effet s'applique après les autres effets qui changent le type d'une capacité, sauf Lutte.", // NEEDS QC
		},
	},
	oblivious: {
		name: "Benêt",
		// Official flavor text: "Le Pokémon est un grand benêt, ce qui l'immunise contre l'attraction, la provocation ou l'intimidation."
		desc: "Ce Pokémon ne peut être ni amoureux ni provoqué. Obtenir ce talent en étant amoureux ou provoqué soigne cet état. Ce Pokémon est immunisé contre l'effet du talent Intimidation.", // NEEDS QC
		shortDesc: "Ne peut être ni amoureux ni provoqué. Immunisé contre Intimidation.", // NEEDS QC
		gen7: {
			desc: "Ce Pokémon ne peut être ni amoureux ni provoqué. Obtenir ce talent en étant amoureux ou provoqué le soigne.", // NEEDS QC
			shortDesc: "Ne peut être ni amoureux ni provoqué.", // NEEDS QC
		},
		gen5: {
			desc: "Ce Pokémon ne peut pas tomber amoureux. Obtenir ce talent en étant amoureux le soigne.", // NEEDS QC
			shortDesc: "Ne peut pas tomber amoureux. L'obtenir en étant amoureux le soigne.", // NEEDS QC
		},
	},
	opportunist: {
		name: "Opportuniste",
		shortDesc: "Quand un adversaire monte une statistique, ce Pokémon copie la hausse.", // NEEDS QC
	},
	orichalcumpulse: {
		name: "Pouls Orichalque",
		shortDesc: "À l'entrée, invoque Soleil ; Attaque x1,3333 au soleil.", // NEEDS QC

		start: "  Le soleil brille et {POKEMON} libère l’énergie d’une pulsation primitive !",
		activate: "  {POKEMON} tire profit des rayons du soleil et libère l’énergie d’une pulsation primitive !",
	},
	overcoat: {
		name: "Envelocape",
		// Official flavor text: "Protège des dégâts occasionnés par les tempêtes de sable, ainsi que des effets des capacités qui libèrent de la poudre et des spores."
		desc: "Ce Pokémon est immunisé contre les capacités à base de poudre, les dégâts de la tempête de sable et les effets de Poudre Fureur et du talent Pose Spore.", // NEEDS QC
		shortDesc: "Immunisé contre les poudres, la tempête de sable et Pose Spore.", // NEEDS QC
		gen8: {
			desc: "Ce Pokémon est immunisé contre les capacités de poudre, les dégâts de Tempête de Sable et Grêle, et les effets de Poudre Fureur et du talent Pose Spore.", // NEEDS QC
			shortDesc: "Immunisé : capacités de poudre, dégâts de sable/grêle, Pose Spore.", // NEEDS QC
		},
		gen5: {
			desc: "Ce Pokémon est immunisé contre les dégâts de Tempête de Sable et Grêle.", // NEEDS QC
			shortDesc: "Immunisé contre les dégâts de la tempête de sable et de la grêle.", // NEEDS QC
		},
	},
	overgrow: {
		name: "Engrais",
		// Official flavor text: "Augmente la puissance des capacités de type Plante du Pokémon quand il a perdu une certaine quantité de PV."
		desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, sa statistique offensive est multipliée par 1,5 quand il utilise une attaque de type Plante.", // NEEDS QC
		shortDesc: "À 1/3 des PV ou moins, sa statistique offensive est x1,5 avec les attaques Plante.", // NEEDS QC
		gen4: {
			desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, la puissance de ses attaques de type Plante est multipliée par 1,5.", // NEEDS QC
			shortDesc: "À 1/3 ou moins de ses PV max, ses attaques Plante ont 1,5x puissance.", // NEEDS QC
		},
	},
	owntempo: {
		name: "Tempo Perso",
		// Official flavor text: "Le Pokémon vit sa vie à son propre rythme, ce qui l'immunise contre la confusion et l'intimidation."
		desc: "Ce Pokémon ne peut pas être confus. Obtenir ce talent en étant confus soigne la confusion. Ce Pokémon est immunisé contre l'effet du talent Intimidation.", // NEEDS QC
		shortDesc: "Ce Pokémon ne peut pas être confus. Immunisé contre Intimidation.", // NEEDS QC
		gen7: {
			desc: "Ce Pokémon ne peut pas être confus. Obtenir ce talent en étant confus le soigne.", // NEEDS QC
			shortDesc: "Ce Pokémon ne peut pas être confus.", // NEEDS QC
		},
	},
	parentalbond: {
		name: "Amour Filial",
		// Official flavor text: "La mère et son petit unissent leurs forces pour attaquer deux fois d’affilée."
		desc: "Les capacités offensives de ce Pokémon frappent deux fois. Le second coup voit ses dégâts divisés par quatre. N'affecte pas Vœu Destructeur, Draco-Flèches, Canon Dynamax, Effort, Explosion, Tout ou Rien, Dégommage, Prescience, Ball’Glace, Roulade et Destruction, ni les capacités frappant déjà plusieurs fois, ni celles ayant plusieurs cibles, ni celles s'exécutant en deux tours.", // NEEDS QC
		shortDesc: "Ses capacités offensives frappent deux fois ; le second coup fait 1/4 des dégâts.", // NEEDS QC
		gen8: {
			desc: "Les capacités offensives de ce Pokémon frappent deux fois. Les dégâts du second coup sont divisés par 4. N'affecte pas Vœu Destructeur, Draco-Flèches, Canon Dynamax, Effort, Explosion, Tout ou Rien, Dégommage, Prescience, Ball’Glace, Roulade ou Destruction, les capacités frappant plusieurs fois, les capacités à cibles multiples, les capacités en deux tours ni les capacités Dynamax.", // NEEDS QC
		},
		gen7: {
			desc: "Les capacités offensives de ce Pokémon frappent deux fois. Les dégâts du second coup sont divisés par 4. N'affecte pas Vœu Destructeur, Effort, Explosion, Tout ou Rien, Dégommage, Prescience, Ball’Glace, Roulade ou Destruction, les capacités frappant plusieurs fois, les capacités à cibles multiples, les capacités en deux tours ni les capacités Z.", // NEEDS QC
		},
		gen6: {
			desc: "Les capacités offensives de ce Pokémon frappent deux fois. Les dégâts du second coup sont divisés par 2. N'affecte pas Vœu Destructeur, Effort, Explosion, Tout ou Rien, Dégommage, Prescience, Ball’Glace, Roulade ou Destruction, les capacités frappant plusieurs fois, les capacités à cibles multiples, les capacités en deux tours.", // NEEDS QC
			shortDesc: "Ses capacités offensives frappent deux fois. Second coup : moitié des dégâts.", // NEEDS QC
		},
	},
	pastelveil: {
		name: "Voile Pastel",
		// Official flavor text: "Protège le Pokémon et ses alliés contre toutes les altérations de statut liées à l’empoisonnement."
		desc: "Ce Pokémon et ses alliés ne peuvent pas être empoisonnés. Obtenir ce talent quand ce Pokémon ou son allié est empoisonné les soigne. Si ce talent est ignoré pendant un effet qui empoisonne, ce Pokémon est soigné immédiatement, mais pas son allié.", // NEEDS QC
		shortDesc: "Ce Pokémon et ses alliés ne peuvent pas être empoisonnés. Les soigne à l'entrée.", // NEEDS QC
	},
	perishbody: {
		name: "Corps Condamné",
		// Official flavor text: "Lorsque le Pokémon est directement touché par une capacité, l’assaillant et lui tomberont K.O. dans trois tours, à moins qu’ils ne soient remplacés entre temps."
		desc: "Toucher ce Pokémon avec une capacité directe déclenche l'effet de Requiem pour lui et l'attaquant. Cet effet ne se produit pas pour ce Pokémon si l'attaquant a déjà un compte à rebours.", // NEEDS QC
		shortDesc: "Un contact avec ce Pokémon déclenche Requiem pour lui et l'attaquant.", // NEEDS QC

		start: "  Les deux Pokémon seront K.O. dans trois tours !",
	},
	pickpocket: {
		name: "Pickpocket",
		// Official flavor text: "Vole l’objet que tient l’attaquant quand le Pokémon subit une attaque directe."
		desc: "Si ce Pokémon n'a pas d'objet et qu'il est touché par une capacité directe, il vole l'objet de l'attaquant. Cet effet s'applique après tous les coups d'une capacité frappant plusieurs fois. Cet effet est empêché si l'effet secondaire de la capacité a été supprimé par le talent Sans Limite.", // NEEDS QC
		shortDesc: "S'il n'a pas d'objet et subit une capacité directe, vole l'objet de l'attaquant.", // NEEDS QC
	},
	pickup: {
		name: "Ramassage",
		// Official flavor text: "Permet parfois au Pokémon de ramasser les objets que d’autres Pokémon ont utilisés. Il lui arrive aussi d’en trouver hors des combats."
		desc: "À la fin de chaque tour, si ce Pokémon ne tient pas d'objet et qu'au moins un Pokémon adjacent a utilisé un objet pendant ce tour, un de ces Pokémon est choisi au hasard et ce Pokémon obtient le dernier objet qu'il a utilisé. Un objet n'est pas considéré comme le dernier utilisé s'il s'agit d'un Ballon éclaté, s'il a été ramassé par un autre Pokémon avec ce talent, ou s'il a été perdu à cause de Piqûre, Gaz Corrosif, Implore, Calcination, Sabotage, Picore ou Larcin. Les objets lancés avec Dégommage peuvent être ramassés.", // NEEDS QC
		shortDesc: "S'il n'a pas d'objet, récupère celui utilisé par un Pokémon adjacent ce tour.", // NEEDS QC
		gen7: {
			desc: "À la fin de chaque tour, si ce Pokémon ne tient pas d'objet et qu'au moins un Pokémon adjacent a utilisé un objet ce tour, l'un d'eux est choisi au hasard et ce Pokémon obtient son dernier objet utilisé. Un objet n'est pas considéré comme le dernier utilisé s'il s'agit d'un Ballon éclaté, s'il a été ramassé par un autre Pokémon avec ce talent, ou s'il a été perdu à cause de Piqûre, Implore, Calcination, Sabotage, Picore ou Larcin. Les objets lancés avec Dégommage peuvent être ramassés.", // NEEDS QC
		},
		gen4: {
			desc: "Aucune utilité en combat.", // NEEDS QC
			shortDesc: "Aucune utilité en combat.", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "Transperceuse",
		shortDesc: "Ses capacités directes ignorent les protections et infligent 1/4 des dégâts.", // NEEDS QC
	},
	pixilate: {
		name: "Peau Féérique",
		// Official flavor text: "Les capacités de type Normal deviennent de type Fée. Leur puissance augmente légèrement."
		desc: "Les capacités de type Normal de ce Pokémon deviennent de type Fée et leur puissance est multipliée par 1,2. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
		shortDesc: "Ses capacités de type Normal deviennent de type Fée avec une puissance x1,2.", // NEEDS QC
		gen6: {
			desc: "Les capacités de type Normal de ce Pokémon deviennent de type Fée et leur puissance est multipliée par 1,3. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
			shortDesc: "Les capacités Normal de ce Pokémon deviennent de type Fée avec 1,3x puissance.", // NEEDS QC
		},
	},
	plus: {
		name: "Plus",
		// Official flavor text: "L’Attaque Spéciale du Pokémon augmente si un Pokémon allié a le talent Moins ou Plus."
		desc: "Si un allié actif a ce talent ou le talent Moins, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5.", // NEEDS QC
		shortDesc: "Si un allié actif a ce talent ou Moins, son Atq. Spé est x1,5.", // NEEDS QC
		gen4: {
			desc: "Si un allié actif a le talent Moins, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5.", // NEEDS QC
			shortDesc: "Si un allié actif a Moins, son Atq. Spé est x1,5.", // NEEDS QC
		},
		gen3: {
			desc: "Si un Pokémon actif a le talent Moins, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5.", // NEEDS QC
			shortDesc: "Si un Pokémon actif a Moins, son Atq. Spé est x1,5.", // NEEDS QC
		},
	},
	poisonheal: {
		name: "Soin Poison",
		// Official flavor text: "Quand le Pokémon est empoisonné, il regagne des PV au lieu d’en perdre."
		desc: "Si ce Pokémon est empoisonné, il récupère 1/8 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour au lieu de perdre des PV.", // NEEDS QC
		shortDesc: "Quand il est empoisonné, ce Pokémon récupère 1/8 de ses PV max par tour.", // NEEDS QC
	},
	poisonpoint: {
		name: "Point Poison",
		shortDesc: "30 % de chances d'empoisonner un Pokémon qui touche ce Pokémon.", // NEEDS QC
		gen4: {
			desc: "30 % de chances qu'un Pokémon touchant ce Pokémon soit empoisonné. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
		},
		gen3: {
			desc: "1 chance sur 3 qu'un Pokémon touchant ce Pokémon soit empoisonné. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
			shortDesc: "1 chance sur 3 d'empoisonner les Pokémon qui le touchent.", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "Emprise Toxique",
		// Official flavor text: "Lorsque Pêchaminus empoisonne un Pokémon grâce à l’une de ses capacités, ce dernier devient également confus."
		desc: "Si ce Pokémon est un Pêchaminus et qu'il empoisonne ou empoisonne gravement une cible, celle-ci devient aussi confuse.", // NEEDS QC
		shortDesc: "Pêchaminus : si ce Pokémon empoisonne une cible, elle devient aussi confuse.", // NEEDS QC
	},
	poisontouch: {
		name: "Toxitouche",
		// Official flavor text: "Peut empoisonner l’ennemi par simple contact."
		desc: "Les capacités directes de ce Pokémon ont 30 % de chances d'empoisonner. Cet effet s'applique après la chance d'effet secondaire propre à la capacité.", // NEEDS QC
		shortDesc: "Les capacités directes de ce Pokémon ont 30 % de chances d'empoisonner.", // NEEDS QC
	},
	powerconstruct: {
		name: "Rassemblement",
		// Official flavor text: "Lorsque le Pokémon perd la moitié de ses PV, ses Cellules se rassemblent pour l’encourager, ce qui lui permet de prendre sa Forme Parfaite."
		desc: "Si ce Pokémon est un Zygarde sous sa Forme 10 % ou 50 %, il prend sa Forme Parfaite quand il a la moitié ou moins de ses PV max à la fin du tour.", // NEEDS QC
		shortDesc: "Zygarde 10 %/50 % prend sa Forme Parfaite à la moitié des PV ou moins.", // NEEDS QC

		activate: "  Vous sentez la présence d’un grand nombre d’individus !",
		transform: "{POKEMON} prend sa Forme Parfaite !",
	},
	powerofalchemy: {
		name: "Osmose",
		// Official flavor text: "Le Pokémon acquiert le talent d’un allié mis K.O."
		desc: "Ce Pokémon copie le talent d'un allié mis K.O. Les talents ne pouvant pas être copiés sont Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Don Floral, Météo, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Osmose, Paléosynthèse, Charge Quantique, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téra-Carapace, Téramorphose, Téraformation 0, Calque, Garde Mystik, Mode Transe et Supermutation.", // NEEDS QC
		shortDesc: "Ce Pokémon copie le talent d'un allié mis K.O.", // NEEDS QC
		gen8: {
			desc: "Ce Pokémon copie le talent d'un allié mis K.O. Les talents ne pouvant pas être copiés sont Osmose Équine, Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Dégobage, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque, Garde Mystik et Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "Ce Pokémon copie le talent d'un allié mis K.O. Les talents ne pouvant pas être copiés sont Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Illusion, Imposteur, Multi-Type, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque, Garde Mystik et Mode Transe.", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "Cercle d’Énergie",
		// Official flavor text: "Augmente la puissance des capacités des Pokémon qui se trouvent à proximité."
		desc: "Les alliés de ce Pokémon ont la puissance de leurs capacités multipliée par 1,3. Affecte Vœu Destructeur et Prescience, même si l'utilisateur n'est plus sur le terrain.", // NEEDS QC
		shortDesc: "Les capacités des alliés de ce Pokémon ont une puissance x1,3.", // NEEDS QC
	},
	prankster: {
		name: "Farceur",
		// Official flavor text: "Rend les capacités de statut du Pokémon prioritaires."
		desc: "Les capacités sans dégâts de ce Pokémon ont leur priorité augmentée de 1. Les Pokémon adverses de type Ténèbres sont immunisés contre ces capacités, ainsi que contre toute capacité appelée par elles si l'utilisateur final a ce talent.", // NEEDS QC
		shortDesc: "Ses capacités de statut ont leur priorité +1 ; les types Ténèbres y sont immunisés.", // NEEDS QC
		gen6: {
			desc: "Les capacités sans dégâts de ce Pokémon voient leur priorité augmentée de 1.", // NEEDS QC
			shortDesc: "Les capacités sans dégâts de ce Pokémon ont +1 priorité.", // NEEDS QC
		},
	},
	pressure: {
		name: "Pression",
		// Official flavor text: "Met la pression à l’adversaire pour le forcer à dépenser plus de PP."
		desc: "Si ce Pokémon est la cible d'une capacité d'un Pokémon adverse, cette capacité perd un PP supplémentaire. Possessif, Saisie et Téra Explosion perdent aussi un PP supplémentaire quand un Pokémon adverse les utilise, mais pas Toile Gluante.", // NEEDS QC
		shortDesc: "Les capacités adverses qui ciblent ce Pokémon perdent un PP de plus.", // NEEDS QC
		gen8: {
			desc: "Si ce Pokémon est la cible d'une capacité adverse, celle-ci perd un PP supplémentaire. Possessif et Saisie perdent aussi un PP supplémentaire quand un adversaire les utilise, mais pas Toile Gluante.", // NEEDS QC
		},
		gen5: {
			desc: "Si ce Pokémon est la cible d'une capacité adverse, celle-ci perd un PP supplémentaire. Possessif et Saisie perdent aussi un PP supplémentaire quand un adversaire les utilise.", // NEEDS QC
		},
		gen4: {
			desc: "Si ce Pokémon est la cible de la capacité d'un autre Pokémon, celle-ci perd un PP supplémentaire.", // NEEDS QC
			shortDesc: "Les capacités visant ce Pokémon perdent un PP supplémentaire.", // NEEDS QC
		},

		start: "  {POKEMON} augmente la pression !",
	},
	primordialsea: {
		name: "Mer Primaire",
		// Official flavor text: "Altère les conditions météo pour neutraliser les attaques de type Feu."
		desc: "En entrant au combat, la météo devient Pluie battante, qui inclut tous les effets de Pluie et empêche l'exécution des capacités offensives de type Feu. Cette météo persiste jusqu'à ce que ce talent ne soit plus actif pour aucun Pokémon, ou que la météo soit changée par les talents Souffle Delta ou Terre Finale.", // NEEDS QC
		shortDesc: "À l'entrée, une pluie battante tombe tant que ce talent est actif au combat.", // NEEDS QC
	},
	prismarmor: {
		name: "Prisme-Armure",
		shortDesc: "Ce Pokémon subit 3/4 des dégâts des attaques super efficaces.", // NEEDS QC
	},
	propellertail: {
		name: "Propulseur",
		shortDesc: "Les capacités de ce Pokémon ne peuvent pas être redirigées.", // NEEDS QC
	},
	protean: {
		name: "Protéen",
		// Official flavor text: "Le Pokémon prend le type de la capacité qu’il utilise. Ce talent ne peut se déclencher qu’une fois par entrée au combat du Pokémon."
		desc: "Le type de ce Pokémon devient celui de la capacité qu'il s'apprête à utiliser. Cet effet s'applique après tous les effets qui changent le type d'une capacité. Cet effet ne peut se produire qu'une fois par entrée au combat, et seulement si ce Pokémon n'est pas téracristallisé.", // NEEDS QC
		shortDesc: "Son type devient celui de la capacité qu'il utilise. Une fois par entrée.", // NEEDS QC
		gen8: {
			desc: "Le type de ce Pokémon devient celui de la capacité qu'il s'apprête à utiliser. Cet effet s'applique après tous les effets qui changent le type d'une capacité.", // NEEDS QC
			shortDesc: "Le type de ce Pokémon devient celui de la capacité qu'il va utiliser.", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "Paléosynthèse",
		// Official flavor text: "Quand le soleil brille ou que le Pokémon tient une capsule d’Énergie Booster, sa stat la plus élevée augmente."
		desc: "Si Soleil est actif ou que ce Pokémon utilise une Énergie Booster tenue, sa statistique la plus élevée est multipliée par 1,3, ou par 1,5 s'il s'agit de la Vitesse. Les changements de niveaux sont pris en compte au moment où ce talent s'active. En cas d'égalité, l'ordre de priorité est : Attaque, Défense, Attaque Spéciale, Défense Spéciale, Vitesse. Si cet effet a été déclenché par le soleil, une Énergie Booster tenue ne s'active pas et l'effet prend fin quand le soleil n'est plus actif. Si cet effet a été déclenché par une Énergie Booster tenue, il prend fin quand ce Pokémon quitte le combat.", // NEEDS QC
		shortDesc: "Au soleil ou via Énergie Booster : plus haute stat x1,3 (x1,5 si Vitesse).", // NEEDS QC

		activate: "  Le soleil brille, ce qui a permis à {POKEMON} d’activer Paléosynthèse !",
		activateFromItem: "  {POKEMON} a activé Paléosynthèse grâce à son Énergie Booster !",
		start: "  {STAT:definite:capitalize} {POKEMON:de} est renforcée !",
		end: "  L’effet du talent Paléosynthèse {POKEMON:de} s’est dissipé !",
	},
	psychicsurge: {
		name: "Créa-Psy",
		shortDesc: "À l'entrée, ce Pokémon invoque un Champ Psychique.", // NEEDS QC
	},
	punkrock: {
		name: "Punk Rock",
		// Official flavor text: "Augmente la puissance des capacités basées sur le son. Le Pokémon ne subit que la moitié des dégâts quand il est touché par ce genre de capacités."
		desc: "Les capacités sonores de ce Pokémon ont leur puissance multipliée par 1,3. Ce Pokémon subit moitié moins de dégâts des capacités sonores.", // NEEDS QC
		shortDesc: "Subit la moitié des dégâts des capacités sonores ; les siennes font x1,3.", // NEEDS QC
	},
	purepower: {
		name: "Force Pure",
		shortDesc: "L'Attaque de ce Pokémon est doublée.", // NEEDS QC
	},
	purifyingsalt: {
		name: "Sel Purificateur",
		// Official flavor text: "Le sel pur immunise le Pokémon contre les altérations de statut, et diminue de moitié les dégâts des capacités de type Spectre."
		desc: "Ce Pokémon ne peut être affecté ni par un problème de statut ni par Bâillement. Si un Pokémon utilise une attaque de type Spectre contre ce Pokémon, sa statistique offensive est divisée par deux dans le calcul des dégâts infligés à ce Pokémon.", // NEEDS QC
		shortDesc: "Les attaques Spectre le frappent avec l'offense réduite de moitié ; aucun statut.", // NEEDS QC
	},
	quarkdrive: {
		name: "Charge Quantique",
		// Official flavor text: "Quand un champ électrifié est actif ou que le Pokémon tient une capsule d’Énergie Booster, sa stat la plus élevée augmente."
		desc: "Si Champ Électrifié est actif ou que ce Pokémon utilise une Énergie Booster tenue, sa statistique la plus élevée est multipliée par 1,3, ou par 1,5 s'il s'agit de la Vitesse. Les changements de niveaux sont pris en compte au moment où ce talent s'active. En cas d'égalité, l'ordre de priorité est : Attaque, Défense, Attaque Spéciale, Défense Spéciale, Vitesse. Si cet effet a été déclenché par le champ électrifié, une Énergie Booster tenue ne s'active pas et l'effet prend fin quand le champ électrifié n'est plus actif. Si cet effet a été déclenché par une Énergie Booster tenue, il prend fin quand ce Pokémon quitte le combat.", // NEEDS QC
		shortDesc: "Champ électrifié ou Énergie Booster : plus haute stat x1,3 (x1,5 si Vitesse).", // NEEDS QC

		activate: "  {POKEMON} a activé Charge Quantique grâce au champ électrifié !",
		activateFromItem: "  {POKEMON} a activé Charge Quantique grâce à son Énergie Booster !",
		start: "  {STAT:definite:capitalize} {POKEMON:de} est renforcée !",
		end: "  L’effet du talent Charge Quantique {POKEMON:de} s’est dissipé !",
	},
	queenlymajesty: {
		name: "Prestance Royale",
		// Official flavor text: "L’adversaire est impressionné par la majesté du Pokémon, ce qui l’empêche de viser ce dernier et ses alliés avec une capacité prioritaire."
		desc: "Les capacités avec priorité utilisées par les Pokémon adverses contre ce Pokémon ou ses alliés échouent.", // NEEDS QC
		shortDesc: "Ce Pokémon et ses alliés sont protégés des capacités adverses avec priorité.", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "Tir Vif",
		shortDesc: "30 % de chances d'agir en premier dans sa priorité avec une capacité offensive.", // NEEDS QC

		activate: "  Tir Vif permet à {POKEMON} d’agir plus vite que d’habitude !",
	},
	quickfeet: {
		name: "Pied Véloce",
		// Official flavor text: "Augmente la Vitesse du Pokémon en cas d'altération de statut."
		desc: "Si ce Pokémon a un problème de statut, sa Vitesse est multipliée par 1,5. Ce Pokémon ignore la réduction de moitié de la Vitesse due à la paralysie.", // NEEDS QC
		shortDesc: "Si ce Pokémon a un statut, sa Vitesse est x1,5 ; ignore la baisse de la paralysie.", // NEEDS QC
		gen6: {
			desc: "Si ce Pokémon a un problème de statut, sa Vitesse est multipliée par 1,5. Ce Pokémon ignore la baisse de Vitesse due à la paralysie.", // NEEDS QC
		},
	},
	raindish: {
		name: "Cuvette",
		// Official flavor text: "Le Pokémon récupère progressivement des PV lorsqu'il pleut."
		desc: "Si Pluie est active, ce Pokémon récupère 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour. Cet effet est empêché si ce Pokémon tient un Parapluie Solide.", // NEEDS QC
		shortDesc: "Si Pluie est active, ce Pokémon récupère 1/16 de ses PV max par tour.", // NEEDS QC
		gen7: {
			desc: "Si Pluie est actif, ce Pokémon récupère 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour.", // NEEDS QC
		},
	},
	rattled: {
		name: "Phobique",
		// Official flavor text: "Si le Pokémon est touché par le talent Intimidation ou une attaque de type Ténèbres, Spectre ou Insecte, sa phobie se révèle et sa Vitesse augmente."
		desc: "La Vitesse de ce Pokémon monte d'un niveau s'il est touché par une attaque de type Insecte, Ténèbres ou Spectre, ou si un Pokémon adverse l'affecte avec le talent Intimidation.", // NEEDS QC
		shortDesc: "+1 Vitesse s'il subit une attaque Insecte, Ténèbres ou Spectre, ou Intimidation.", // NEEDS QC
		gen7: {
			desc: "La Vitesse de ce Pokémon monte d'un niveau s'il est touché par une attaque de type Insecte, Ténèbres ou Spectre.", // NEEDS QC
			shortDesc: "Vitesse +1 s'il est touché par une attaque Insecte, Ténèbres ou Spectre.", // NEEDS QC
		},
	},
	receiver: {
		name: "Receveur",
		// Official flavor text: "Le Pokémon reçoit le talent d’un allié mis K.O."
		desc: "Ce Pokémon copie le talent d'un allié mis K.O. Les talents ne pouvant pas être copiés sont Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Don Floral, Météo, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Osmose, Paléosynthèse, Charge Quantique, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téra-Carapace, Téramorphose, Téraformation 0, Calque, Garde Mystik, Mode Transe et Supermutation.", // NEEDS QC
		shortDesc: "Ce Pokémon copie le talent d'un allié mis K.O.", // NEEDS QC
		gen8: {
			desc: "Ce Pokémon copie le talent d'un allié mis K.O. Les talents ne pouvant pas être copiés sont Osmose Équine, Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Dégobage, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque, Garde Mystik et Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "Ce Pokémon copie le talent d'un allié mis K.O. Les talents ne pouvant pas être copiés sont Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Illusion, Imposteur, Multi-Type, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque, Garde Mystik et Mode Transe.", // NEEDS QC
		},

		changeAbility: "  Le Pokémon reçoit le talent {ABILITY} {SOURCE:de} !",
	},
	reckless: {
		name: "Téméraire",
		// Official flavor text: "Augmente la puissance des capacités occasionnant un contrecoup."
		desc: "Les attaques de ce Pokémon avec contrecoup ou dégâts d'échec ont leur puissance multipliée par 1,2. N'affecte pas Lutte.", // NEEDS QC
		shortDesc: "Ses attaques à contrecoup ou dégâts d'échec font x1,2 ; sauf Lutte.", // NEEDS QC
	},
	refrigerate: {
		name: "Peau Gelée",
		// Official flavor text: "Les capacités de type Normal deviennent de type Glace. Leur puissance augmente légèrement."
		desc: "Les capacités de type Normal de ce Pokémon deviennent de type Glace et leur puissance est multipliée par 1,2. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
		shortDesc: "Ses capacités de type Normal deviennent de type Glace avec une puissance x1,2.", // NEEDS QC
		gen6: {
			desc: "Les capacités de type Normal de ce Pokémon deviennent de type Glace et leur puissance est multipliée par 1,3. Cet effet s'applique après les autres effets qui changent le type d'une capacité, mais avant les effets de Déluge Plasmique et Électrisation.", // NEEDS QC
			shortDesc: "Les capacités Normal de ce Pokémon deviennent de type Glace avec 1,3x puissance.", // NEEDS QC
		},
	},
	regenerator: {
		name: "Régé-Force",
		shortDesc: "Ce Pokémon récupère 1/3 de ses PV max quand il quitte le combat.", // NEEDS QC
	},
	ripen: {
		name: "Mûrissement",
		// Official flavor text: "Le Pokémon fait mûrir la Baie qu’il tient et double ainsi son effet."
		desc: "Quand ce Pokémon mange certaines Baies, leurs effets sont doublés. Les Baies qui restaurent des PV ou des PP en restaurent le double, les Baies qui montent des niveaux de statistiques en montent le double, les Baies qui divisent par deux les dégâts subis les divisent par quatre, et une Baie Jaboca ou une Baie Pommo fait perdre à l'attaquant 1/4 de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Quand ce Pokémon mange certaines Baies, leurs effets sont doublés.", // NEEDS QC
	},
	rivalry: {
		name: "Rivalité",
		// Official flavor text: "Le Pokémon déteste la concurrence et inflige plus de dégâts si sa cible est du même sexe. Par contre, il en inflige moins si sa cible est du sexe opposé."
		desc: "Les attaques de ce Pokémon ont leur puissance multipliée par 1,25 contre les cibles du même sexe, ou par 0,75 contre les cibles du sexe opposé. Il n'y a pas de modificateur si ce Pokémon ou la cible n'a pas de sexe.", // NEEDS QC
		shortDesc: "Ses attaques font 1,25x contre le même sexe, 0,75x contre le sexe opposé.", // NEEDS QC
	},
	rkssystem: {
		name: "Système Alpha",
		shortDesc: "Si ce Pokémon est Silvallié, son type devient celui de sa ROM tenue.", // NEEDS QC
	},
	rockhead: {
		name: "Tête de Roc",
		// Official flavor text: "Le Pokémon peut utiliser des capacités occasionnant un contrecoup sans perdre de PV."
		desc: "Ce Pokémon ne subit pas de dégâts de contrecoup, sauf ceux de Lutte. N'affecte ni les dégâts de l'Orbe Vie ni les dégâts d'échec.", // NEEDS QC
		shortDesc: "Ce Pokémon ne subit pas de contrecoup, sauf Lutte, Orbe Vie et échecs.", // NEEDS QC
		gen3: {
			desc: "Ce Pokémon ne subit pas de contrecoup, sauf celui de Lutte. N'affecte pas les dégâts d'échec.", // NEEDS QC
			shortDesc: "Aucun contrecoup, sauf Lutte et les dégâts d'échec.", // NEEDS QC
		},
	},
	rockypayload: {
		name: "Porte-Roche",
		shortDesc: "Sa statistique offensive est multipliée par 1,5 avec les attaques de type Roche.", // NEEDS QC
	},
	roughskin: {
		name: "Peau Dure",
		// Official flavor text: "Blesse l'attaquant lorsque le Pokémon subit une attaque directe."
		desc: "Les Pokémon qui touchent ce Pokémon avec une capacité directe perdent 1/8 de leurs PV max, arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Les Pokémon qui touchent ce Pokémon perdent 1/8 de leurs PV max.", // NEEDS QC
		gen4: {
			desc: "Les Pokémon touchant ce Pokémon perdent 1/8 de leurs PV max, arrondi à l'inférieur. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
		},
		gen3: {
			desc: "Les Pokémon touchant ce Pokémon perdent 1/16 de leurs PV max, arrondi à l'inférieur. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
			shortDesc: "Les Pokémon qui le touchent perdent 1/16 de leurs PV max.", // NEEDS QC
		},

		damage: "  {POKEMON} est blessé !",
	},
	runaway: {
		name: "Fuite",
		shortDesc: "Aucune utilité en combat.", // NEEDS QC
	},
	sandforce: {
		name: "Force Sable",
		// Official flavor text: "Augmente la puissance des capacités de types Roche, Sol et Acier en cas de tempête de sable."
		desc: "Si une tempête de sable est active, les attaques de type Sol, Roche et Acier de ce Pokémon ont leur puissance multipliée par 1,3. Ce Pokémon ne subit pas les dégâts de la tempête de sable.", // NEEDS QC
		shortDesc: "Ses attaques Sol/Roche/Acier font x1,3 sous tempête de sable ; immunisé contre elle.", // NEEDS QC
	},
	sandrush: {
		name: "Baigne Sable",
		// Official flavor text: "Augmente la Vitesse lors des tempêtes de sable."
		desc: "Si une tempête de sable est active, la Vitesse de ce Pokémon est doublée. Ce Pokémon ne subit pas les dégâts de la tempête de sable.", // NEEDS QC
		shortDesc: "Sous tempête de sable, sa Vitesse est doublée ; immunisé contre elle.", // NEEDS QC
	},
	sandspit: {
		name: "Expul’Sable",
		shortDesc: "Quand ce Pokémon est touché par une attaque, une tempête de sable se lève.", // NEEDS QC
		gen8: {
			desc: "Quand ce Pokémon est touché par une attaque, l'effet de Tempête de Sable commence. Cet effet vient après ceux des capacités Dynamax.", // NEEDS QC
		},
	},
	sandstream: {
		name: "Sable Volant",
		shortDesc: "À l'entrée, ce Pokémon invoque une tempête de sable.", // NEEDS QC
	},
	sandveil: {
		name: "Voile Sable",
		// Official flavor text: "Augmente l'Esquive du Pokémon lors des tempêtes de sable."
		desc: "Si une tempête de sable est active, la précision des capacités utilisées contre ce Pokémon est multipliée par 0,8. Ce Pokémon ne subit pas les dégâts de la tempête de sable.", // NEEDS QC
		shortDesc: "Sous tempête de sable, son esquive est x1,25 ; immunisé contre elle.", // NEEDS QC
	},
	sapsipper: {
		name: "Herbivore",
		// Official flavor text: "Annule les attaques de type Plante subies par le Pokémon et augmente son Attaque."
		desc: "Ce Pokémon est immunisé contre les capacités de type Plante et son Attaque monte d'un niveau quand il est touché par une capacité de type Plante.", // NEEDS QC
		shortDesc: "+1 Attaque s'il est touché par une capacité Plante ; immunité Plante.", // NEEDS QC
	},
	schooling: {
		name: "Banc",
		// Official flavor text: "Le Pokémon se rassemble avec ses congénères quand ses PV sont élevés. Quand il ne lui reste plus beaucoup de PV, le banc se disperse."
		desc: "En entrant au combat, si ce Pokémon est un Froussardine de niveau 20 ou plus avec plus de 1/4 de ses PV max, il prend sa Forme Banc. S'il est sous Forme Banc et que ses PV tombent à 1/4 de ses PV max ou moins, il reprend sa Forme Solitaire à la fin du tour. S'il est sous Forme Solitaire et qu'il a plus de 1/4 de ses PV max à la fin du tour, il prend sa Forme Banc.", // NEEDS QC
		shortDesc: "Froussardine prend sa Forme Banc au-dessus de 1/4 de ses PV, sinon Forme Solitaire.", // NEEDS QC

		transform: "{POKEMON} forme un banc !",
		transformEnd: "Le banc {POKEMON:de} se désagrège !",
	},
	scrappy: {
		name: "Querelleur",
		// Official flavor text: "Permet aux capacités de type Normal ou Combat du Pokémon de toucher les Pokémon de type Spectre. Immunise aussi contre le talent Intimidation."
		desc: "Ce Pokémon peut toucher les Pokémon de type Spectre avec des capacités de type Normal et Combat. Ce Pokémon est immunisé contre l'effet du talent Intimidation.", // NEEDS QC
		shortDesc: "Normal et Combat touchent Spectre. Immunisé contre Intimidation.", // NEEDS QC
		gen7: {
			desc: "Ce Pokémon peut toucher les types Spectre avec ses capacités de type Normal et Combat.", // NEEDS QC
			shortDesc: "Peut toucher les Spectres avec des capacités Normal et Combat.", // NEEDS QC
		},
	},
	screencleaner: {
		name: "Brise-Barrière",
		shortDesc: "À l'entrée, met fin à Voile Aurore, Mur Lumière et Protection des deux côtés.", // NEEDS QC
	},
	seedsower: {
		name: "Semencier",
		shortDesc: "Quand ce Pokémon est touché par une attaque, un Champ Herbu apparaît.", // NEEDS QC
	},
	serenegrace: {
		name: "Sérénité",
		// Official flavor text: "Augmente les chances d'infliger des effets additionnels."
		desc: "Les capacités de ce Pokémon ont leur chance d'effet secondaire doublée. Cet effet se cumule avec l'effet Arc-en-Ciel, sauf pour les effets secondaires qui apeurent la cible.", // NEEDS QC
		shortDesc: "Les capacités de ce Pokémon ont leur chance d'effet secondaire doublée.", // NEEDS QC
		gen4: {
			desc: "Les capacités de ce Pokémon voient leurs chances d'effet secondaire doublées.", // NEEDS QC
		},
	},
	shadowshield: {
		name: "Spectro-Bouclier",
		shortDesc: "Si ce Pokémon a tous ses PV, les dégâts des attaques subies sont réduits de moitié.", // NEEDS QC
	},
	shadowtag: {
		name: "Marque Ombre",
		// Official flavor text: "Empêche les Pokémon ennemis de quitter le terrain."
		desc: "Empêche les Pokémon adverses de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue, sont de type Spectre ou ont aussi ce talent.", // NEEDS QC
		shortDesc: "Empêche les adversaires de quitter le combat, sauf s'ils ont aussi ce talent.", // NEEDS QC
		gen6: {
			desc: "Empêche les Pokémon adverses adjacents de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue, sont de type Spectre ou ont aussi ce talent.", // NEEDS QC
			shortDesc: "Les ennemis adjacents ne peuvent se retirer que s'ils ont aussi ce talent.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche les Pokémon adverses adjacents de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue ou ont aussi ce talent.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche les Pokémon adverses de choisir de quitter le combat, sauf s'ils tiennent une Carapace Mue ou ont aussi ce talent.", // NEEDS QC
			shortDesc: "Empêche les adversaires de quitter le combat, sauf s'ils ont aussi ce talent.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche les Pokémon adverses de choisir de quitter le combat.", // NEEDS QC
			shortDesc: "Les Pokémon adverses ne peuvent pas choisir de se retirer.", // NEEDS QC
		},
	},
	sharpness: {
		name: "Incisif",
		shortDesc: "Les capacités tranchantes de ce Pokémon ont leur puissance multipliée par 1,5.", // NEEDS QC
	},
	shedskin: {
		name: "Mue",
		// Official flavor text: "Le Pokémon soigne parfois ses altérations de statut en muant."
		desc: "Ce Pokémon a 33 % de chances que son problème de statut soit soigné à la fin de chaque tour.", // NEEDS QC
		shortDesc: "33 % de chances que son problème de statut soit soigné à chaque fin de tour.", // NEEDS QC
	},
	sheerforce: {
		name: "Sans Limite",
		// Official flavor text: "Les capacités ayant un effet additionnel le perdent, mais leur puissance augmente."
		desc: "Les attaques de ce Pokémon ayant un effet secondaire ont leur puissance multipliée par 1,3, mais leurs effets secondaires sont supprimés. Si un effet secondaire a été supprimé, le contrecoup de l'Orbe Vie et la récupération du Grelot Coque de l'utilisateur sont aussi supprimés, et les talents Courroupace, Folle Furie, Homochromie, Repli Tactique, Pickpocket et Escampette de la cible, ainsi que sa Carton Rouge, son Bouton Fuite, sa Baie Éka et sa Baie Rangma, ne s'activent pas.", // NEEDS QC
		shortDesc: "Ses attaques à effet secondaire font x1,3, mais leurs effets sont supprimés.", // NEEDS QC
		gen8: {
			desc: "Les attaques de ce Pokémon avec effets secondaires ont leur puissance multipliée par 1,3, mais perdent leurs effets secondaires. Si un effet secondaire est retiré, le contrecoup de l'Orbe Vie et le soin du Grelot Coque de l'utilisateur sont aussi retirés, et Folle Furie, Homochromie, Repli Tactique, Pickpocket, Escampette, Carton Rouge, Bouton Fuite, Baie Éka et Baie Rangma de la cible ne s'activent pas.", // NEEDS QC
		},
		gen6: {
			desc: "Les attaques de ce Pokémon avec effets secondaires ont leur puissance multipliée par 1,3, mais perdent leurs effets secondaires. Si un effet secondaire est retiré, le contrecoup de l'Orbe Vie et le soin du Grelot Coque de l'utilisateur sont aussi retirés, et Homochromie, Pickpocket, Carton Rouge, Bouton Fuite, Baie Éka et Baie Rangma de la cible ne s'activent pas.", // NEEDS QC
		},
		gen5: {
			desc: "Les attaques de ce Pokémon avec effets secondaires ont leur puissance multipliée par 1,3, mais perdent leurs effets secondaires. Si un effet secondaire est retiré, le contrecoup de l'Orbe Vie et le soin du Grelot Coque de l'utilisateur sont aussi retirés, et Homochromie, Pickpocket, Carton Rouge et Bouton Fuite de la cible ne s'activent pas.", // NEEDS QC
		},
	},
	shellarmor: {
		name: "Coque Armure",
		shortDesc: "Ce Pokémon ne peut pas subir de coup critique.", // NEEDS QC
	},
	shielddust: {
		name: "Écran Poudre",
		// Official flavor text: "Le Pokémon dispose d'un écran naturel qui le protège des effets additionnels des attaques ennemies."
		desc: "Ce Pokémon n'est pas affecté par les effets secondaires des attaques des autres Pokémon. Cela inclut les effets ayant une chance (même de 100 %) de paralyser, endormir, geler, brûler, empoisonner, rendre confus, apeurer ce Pokémon ou baisser ses niveaux de statistiques, ainsi qu'Ancrage, Sort Sinistre, Dégommage, Dissonance Psy, Salaison, Tisse Ombre, Bombe au Sirop et Exécu-Son. L'effet d'Aria de l’Écume est empêché si ce Pokémon est la seule cible. Les effets secondaires ajoutés par la Roche Royale, le Croc Rasoir et les talents Toxitouche, Puanteur et Chaîne Toxique sont aussi empêchés contre ce Pokémon.", // NEEDS QC
		shortDesc: "Ce Pokémon ignore les effets secondaires des attaques des autres Pokémon.", // NEEDS QC
		gen8: {
			desc: "Ce Pokémon n'est pas affecté par les effets secondaires des attaques des autres Pokémon. Sont empêchées les attaques avec une chance (même 100 %) de paralyser, endormir, geler, brûler, empoisonner, rendre confus, apeurer ce Pokémon ou baisser ses statistiques, ainsi qu'Ancrage, Sort Sinistre, Dégommage, Tisse Ombre et Exécu-Son. L'effet d'Aria de l’Écume est empêché si ce Pokémon est la seule cible. Les effets secondaires ajoutés par Roche Royale, Croc Rasoir et les talents Toxitouche et Puanteur sont aussi empêchés contre ce Pokémon.", // NEEDS QC
		},
		gen7: {
			desc: "Ce Pokémon n'est pas affecté par les effets secondaires des attaques des autres Pokémon. Sont empêchées les attaques avec une chance (même 100 %) de paralyser, endormir, geler, brûler, empoisonner, rendre confus, apeurer ce Pokémon ou baisser ses statistiques, ainsi qu'Ancrage, Dégommage, Tisse Ombre et Exécu-Son. L'effet d'Aria de l’Écume est empêché si ce Pokémon est la seule cible. Les effets secondaires ajoutés par Roche Royale, Croc Rasoir et les talents Toxitouche et Puanteur sont aussi empêchés contre ce Pokémon.", // NEEDS QC
		},
		gen6: {
			desc: "Ce Pokémon n'est pas affecté par les effets secondaires des attaques des autres Pokémon. Sont empêchées les attaques avec une chance (même 100 %) de paralyser, endormir, geler, brûler, empoisonner, rendre confus, apeurer ce Pokémon ou baisser ses statistiques, ainsi que Dégommage. Les effets secondaires ajoutés par Roche Royale, Croc Rasoir et les talents Toxitouche et Puanteur sont aussi empêchés contre ce Pokémon.", // NEEDS QC
		},
		gen4: {
			desc: "Ce Pokémon n'est pas affecté par les effets secondaires des attaques des autres Pokémon. Sont empêchées les attaques avec une chance (même 100 %) de paralyser, endormir, geler, brûler, empoisonner, rendre confus, apeurer ce Pokémon ou baisser ses statistiques, ainsi que Dégommage. Les effets secondaires ajoutés par Roche Royale et Croc Rasoir sont aussi empêchés contre ce Pokémon.", // NEEDS QC
		},
		gen3: {
			desc: "Ce Pokémon n'est pas affecté par les effets secondaires des attaques des autres Pokémon. Sont empêchées les attaques avec une chance (même 100 %) de paralyser, endormir, geler, brûler, empoisonner, rendre confus, apeurer ce Pokémon ou baisser ses statistiques. L'effet secondaire ajouté par Roche Royale est aussi empêché contre ce Pokémon.", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "Bouclier-Carcan",
		// Official flavor text: "Lorsque le Pokémon perd la moitié de ses PV, son enveloppe se brise et il adopte une posture offensive."
		desc: "Si ce Pokémon est un Météno, il prend sa Forme Noyau quand il a la moitié ou moins de ses PV max, et sa Forme Météore quand il a plus de la moitié de ses PV max. Cette vérification a lieu à l'entrée au combat et à la fin de chaque tour. Sous sa Forme Météore, il ne peut être affecté ni par un problème de statut ni par Bâillement.", // NEEDS QC
		shortDesc: "Météno passe en Forme Noyau à la moitié des PV ou moins, sinon Forme Météore.", // NEEDS QC

		transform: "Le talent Bouclier-Carcan s’active !",
		transformEnd: "Le talent Bouclier-Carcan n’est plus actif !",
	},
	simple: {
		name: "Simple",
		shortDesc: "Les hausses et baisses de statistiques de ce Pokémon sont doublées.", // NEEDS QC
		gen7: {
			desc: "Quand une statistique de ce Pokémon monte ou baisse, le changement est doublé. Ce talent n'affecte pas les hausses de stats des effets de la Force Z avant l'utilisation d'une capacité Z de statut.", // NEEDS QC
		},
		gen6: {
			desc: "Quand une statistique de ce Pokémon monte ou baisse, le changement est doublé.", // NEEDS QC
		},
		gen4: {
			desc: "Les niveaux de statistiques de ce Pokémon sont considérés comme doublés dans les calculs. Un niveau ne peut pas être considéré supérieur à 6 ni inférieur à -6.", // NEEDS QC
			shortDesc: "Ses niveaux de stats sont considérés comme doublés dans les calculs.", // NEEDS QC
		},
	},
	skilllink: {
		name: "Multi-Coups",
		// Official flavor text: "Les capacités pouvant frapper plusieurs fois frappent toujours le nombre maximal de coups."
		desc: "Les attaques de ce Pokémon frappant plusieurs fois frappent toujours le nombre maximal de fois. Triple Pied et Triple Axel ne vérifient pas la précision des deuxième et troisième coups.", // NEEDS QC
		shortDesc: "Ses attaques frappant plusieurs fois frappent toujours le maximum de fois.", // NEEDS QC
		gen7: {
			desc: "Les capacités frappant plusieurs fois de ce Pokémon frappent toujours le nombre maximum de fois. Triple Pied ne vérifie pas la précision aux deuxième et troisième coups.", // NEEDS QC
		},
		gen4: {
			desc: "Les capacités frappant plusieurs fois de ce Pokémon frappent toujours le nombre maximum de fois. N'affecte pas Triple Pied.", // NEEDS QC
		},
	},
	slowstart: {
		name: "Début Calme",
		shortDesc: "À l'entrée, son Attaque et sa Vitesse sont réduites de moitié pendant 5 tours.", // NEEDS QC
		gen7: {
			desc: "À l'entrée au combat, l'Attaque et la Vitesse de ce Pokémon sont réduites de moitié pendant 5 tours. Pendant l'effet, s'il utilise une capacité Z générique basée sur une capacité spéciale, son Attaque Spéciale est réduite de moitié pendant le calcul des dégâts.", // NEEDS QC
		},
		gen6: {
			desc: "À l'entrée au combat, l'Attaque et la Vitesse de ce Pokémon sont réduites de moitié pendant 5 tours.", // NEEDS QC
		},

		start: "  {POKEMON} n’arrive pas à se motiver !",
		end: "  {POKEMON} arrive enfin à s’y mettre sérieusement !",
	},
	slushrush: {
		name: "Chasse-Neige",
		shortDesc: "S'il neige, la Vitesse de ce Pokémon est doublée.", // NEEDS QC
		gen8: {
			shortDesc: "Sous la grêle, la Vitesse de ce Pokémon est doublée.", // NEEDS QC
		},
	},
	sniper: {
		name: "Sniper",
		shortDesc: "Si ce Pokémon porte un coup critique, les dégâts sont multipliés par 1,5.", // NEEDS QC
	},
	snowcloak: {
		name: "Rideau Neige",
		// Official flavor text: "Augmente l'Esquive du Pokémon quand il neige."
		desc: "S'il neige, la précision des capacités utilisées contre ce Pokémon est multipliée par 0,8.", // NEEDS QC
		shortDesc: "S'il neige, l'esquive de ce Pokémon est multipliée par 1,25.", // NEEDS QC
		gen8: {
			desc: "Si Grêle est actif, la précision des capacités visant ce Pokémon est multipliée par 0,8. Ce Pokémon ne subit pas de dégâts de Grêle.", // NEEDS QC
			shortDesc: "Sous la grêle : esquive x1,25 ; immunisé contre la grêle.", // NEEDS QC
		},
	},
	snowwarning: {
		name: "Alerte Neige",
		shortDesc: "À l'entrée, ce Pokémon invoque la neige.", // NEEDS QC
		gen8: {
			shortDesc: "À l'entrée au combat, ce Pokémon invoque Grêle.", // NEEDS QC
		},
	},
	solarpower: {
		name: "Force Soleil",
		// Official flavor text: "Quand le soleil brille, l'Attaque Spéciale du Pokémon augmente mais il perd des PV à chaque tour."
		desc: "Si Soleil est actif, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5 et il perd 1/8 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour. Ces effets sont empêchés si le Pokémon tient un Parapluie Solide.", // NEEDS QC
		shortDesc: "Si Soleil est actif : Atq. Spé x1,5, mais perd 1/8 de ses PV max par tour.", // NEEDS QC
		gen7: {
			desc: "Si Soleil est actif, l'Attaque Spéciale de ce Pokémon est multipliée par 1,5 et il perd 1/8 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour.", // NEEDS QC
		},
	},
	solidrock: {
		name: "Solide Roc",
		shortDesc: "Ce Pokémon subit 3/4 des dégâts des attaques super efficaces.", // NEEDS QC
	},
	soulheart: {
		name: "Animacœur",
		shortDesc: "L'Atq. Spé de ce Pokémon monte d'un niveau quand un autre Pokémon est mis K.O.", // NEEDS QC
	},
	soundproof: {
		name: "Anti-Bruit",
		shortDesc: "Immunisé contre les capacités sonores, sauf celles qu'il utilise lui-même.", // NEEDS QC
		gen7: {
			shortDesc: "Immunisé contre les capacités sonores, y compris Glas de Soin.", // NEEDS QC
		},
		gen5: {
			shortDesc: "Immunisé contre les capacités sonores, sauf Glas de Soin.", // NEEDS QC
		},
		gen4: {
			shortDesc: "Immunisé contre les capacités sonores, y compris Glas de Soin.", // NEEDS QC
		},
	},
	speedboost: {
		name: "Turbo",
		// Official flavor text: "La Vitesse du Pokémon augmente à chaque tour."
		desc: "La Vitesse de ce Pokémon monte d'un niveau à la fin de chaque tour complet passé au combat.", // NEEDS QC
		shortDesc: "Sa Vitesse monte d'un niveau à la fin de chaque tour complet passé au combat.", // NEEDS QC
	},
	spicyspray: {
		name: "Habanéruption",
		shortDesc: "Si ce Pokémon est touché par une attaque, l'attaquant est brûlé.", // NEEDS QC
	},
	stakeout: {
		name: "Filature",
		shortDesc: "Sa statistique offensive est doublée contre une cible entrée au combat ce tour.", // NEEDS QC
	},
	stall: {
		name: "Frein",
		shortDesc: "Agit en dernier parmi les Pokémon utilisant une capacité de priorité égale ou plus.", // NEEDS QC
	},
	stalwart: {
		name: "Nerfs d’Acier",
		shortDesc: "Les capacités de ce Pokémon ne peuvent pas être redirigées.", // NEEDS QC
	},
	stamina: {
		name: "Endurance",
		shortDesc: "La Défense de ce Pokémon monte d'un niveau quand une capacité le blesse.", // NEEDS QC
	},
	stancechange: {
		name: "Déclic Tactique",
		// Official flavor text: "Le Pokémon prend la Forme Assaut lorsqu’il utilise une capacité offensive, et la Forme Parade lorsqu’il utilise Bouclier Royal."
		desc: "Si ce Pokémon est un Exagide, il prend sa Forme Assaut avant d'utiliser une capacité offensive, et sa Forme Parade avant d'utiliser Bouclier Royal.", // NEEDS QC
		shortDesc: "Exagide passe en Forme Assaut avant d'attaquer, en Forme Parade avant Bouclier Royal.", // NEEDS QC
		gen6: {
			desc: "Si ce Pokémon est un Exagide, il prend sa Forme Assaut avant d'utiliser une capacité offensive et sa Forme Parade avant d'utiliser Bouclier Royal.", // NEEDS QC
		},

		transform: "Passage en Forme Assaut !",
		transformEnd: "Passage en Forme Parade !",
	},
	static: {
		name: "Statik",
		shortDesc: "30 % de chances de paralyser un Pokémon qui touche ce Pokémon.", // NEEDS QC
		gen4: {
			desc: "30 % de chances qu'un Pokémon touchant ce Pokémon soit paralysé. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
		},
		gen3: {
			desc: "1 chance sur 3 qu'un Pokémon touchant ce Pokémon soit paralysé. Cet effet ne se produit pas si ce Pokémon n'a pas perdu de PV lors de l'attaque.", // NEEDS QC
			shortDesc: "1 chance sur 3 de paralyser les Pokémon qui le touchent.", // NEEDS QC
		},
	},
	steadfast: {
		name: "Impassible",
		shortDesc: "Si ce Pokémon est apeuré, sa Vitesse monte d'un niveau.", // NEEDS QC
	},
	steamengine: {
		name: "Turbine",
		// Official flavor text: "Lorsque le Pokémon est touché par des capacités de type Eau ou Feu, sa Vitesse augmente énormément."
		desc: "La Vitesse de ce Pokémon monte de 6 niveaux quand il subit des dégâts d'une capacité de type Feu ou Eau.", // NEEDS QC
		shortDesc: "Sa Vitesse monte de 6 niveaux s'il subit des dégâts de type Feu ou Eau.", // NEEDS QC
	},
	steelworker: {
		name: "Expert Acier",
		shortDesc: "Sa statistique offensive est multipliée par 1,5 avec les attaques de type Acier.", // NEEDS QC
	},
	steelyspirit: {
		name: "Boost Acier",
		// Official flavor text: "Augmente la puissance des attaques de type Acier du Pokémon et de ses alliés."
		desc: "Les capacités de type Acier de ce Pokémon et de ses alliés ont leur puissance multipliée par 1,5. Affecte Vœu Destructeur même si l'utilisateur n'est plus sur le terrain.", // NEEDS QC
		shortDesc: "Les capacités Acier de ce Pokémon et de ses alliés ont une puissance x1,5.", // NEEDS QC
	},
	stench: {
		name: "Puanteur",
		// Official flavor text: "Le Pokémon émet une odeur si nauséabonde qu'il peut effrayer sa cible en l'attaquant."
		desc: "Les attaques de ce Pokémon qui ne peuvent normalement pas apeurer la cible gagnent 10 % de chances de l'apeurer.", // NEEDS QC
		shortDesc: "Ses attaques sans chance d'apeurer gagnent 10 % de chances d'apeurer.", // NEEDS QC
		gen4: {
			desc: "Aucune utilité en combat.", // NEEDS QC
			shortDesc: "Aucune utilité en combat.", // NEEDS QC
		},
	},
	stickyhold: {
		name: "Glu",
		// Official flavor text: "Les objets sont collés au corps gluant du Pokémon, ce qui empêche ses adversaires de les dérober."
		desc: "Ce Pokémon ne peut pas perdre son objet tenu à cause du talent ou d'une attaque d'un autre Pokémon, sauf si l'attaque le met K.O. Les Piquants sont transférés aux autres Pokémon malgré ce talent.", // NEEDS QC
		shortDesc: "Ce Pokémon ne peut pas perdre son objet à cause d'un autre Pokémon.", // NEEDS QC
		gen4: {
			desc: "Ce Pokémon ne peut pas perdre son objet tenu à cause de l'attaque d'un autre Pokémon, même si l'attaque le met K.O. Les Piquants sont transférés aux autres Pokémon malgré ce talent.", // NEEDS QC
		},

		block: "  L’objet {POKEMON:de} ne peut pas être volé !",
	},
	stormdrain: {
		name: "Lavabo",
		// Official flavor text: "Le Pokémon détourne sur lui les capacités de type Eau et les neutralise, tout en augmentant son Attaque Spéciale."
		desc: "Ce Pokémon est immunisé contre les capacités de type Eau et son Attaque Spéciale monte d'un niveau quand il est touché par une capacité de type Eau. Si ce Pokémon n'est pas la cible d'une capacité de type Eau à cible unique utilisée par un autre Pokémon, il redirige cette capacité vers lui s'il est à sa portée. Si plusieurs Pokémon peuvent rediriger avec ce talent, c'est celui avec la plus grande Vitesse qui le fait, ou en cas d'égalité, celui dont le talent est actif depuis le plus longtemps.", // NEEDS QC
		shortDesc: "Attire les capacités Eau pour monter son Atq. Spé de 1 ; immunité Eau.", // NEEDS QC
		gen4: {
			desc: "Si ce Pokémon n'est pas la cible d'une capacité de type Eau à cible unique utilisée par un autre Pokémon, il redirige cette capacité vers lui.", // NEEDS QC
			shortDesc: "Attire vers lui les capacités Eau à cible unique.", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "Prognathe",
		// Official flavor text: "Le Pokémon a une mâchoire robuste qui augmente la puissance de ses capacités de morsure."
		desc: "Les attaques de ce Pokémon utilisant les mâchoires ont leur puissance multipliée par 1,5.", // NEEDS QC
		shortDesc: "Ses attaques de mâchoire ont une puissance x1,5. Piqûre exclu.", // NEEDS QC
	},
	sturdy: {
		name: "Fermeté",
		// Official flavor text: "Le Pokémon encaisse toujours au moins une attaque s’il a tous ses PV. Il est également immunisé contre les capacités pouvant mettre K.O. en un coup."
		desc: "Si ce Pokémon a tous ses PV, il survit à un coup avec au moins 1 PV. Les capacités mettant K.O. en un coup échouent contre ce Pokémon.", // NEEDS QC
		shortDesc: "À PV max, survit à un coup avec au moins 1 PV. Immunisé aux K.O. en un coup.", // NEEDS QC
		gen4: {
			desc: "Les capacités mettant K.O. en un coup échouent contre ce Pokémon.", // NEEDS QC
			shortDesc: "Les capacités mettant K.O. en un coup échouent contre lui.", // NEEDS QC
		},

		activate: "  {POKEMON} encaisse les coups !",
	},
	suctioncups: {
		name: "Ventouse",
		shortDesc: "Ce Pokémon ne peut pas être forcé de quitter le combat par une attaque ou un objet.", // NEEDS QC

		block: "  {POKEMON} s’accroche avec ses ventouses !",
	},
	superluck: {
		name: "Chanceux",
		shortDesc: "Le taux de critique de ce Pokémon monte d'un niveau.", // NEEDS QC
	},
	supersweetsyrup: {
		name: "Nectar Mielleux",
		shortDesc: "À l'entrée, baisse l'esquive des adversaires d'un niveau. Une fois par combat.", // NEEDS QC

		start: "  Le nectar {POKEMON:de} dégage un parfum sucré !",
	},
	supremeoverlord: {
		name: "Général Suprême",
		// Official flavor text: "Quand le Pokémon entre sur le terrain, son Attaque et son Attaque Spéciale augmentent légèrement pour chaque allié mis K.O. auparavant."
		desc: "Les capacités de ce Pokémon ont leur puissance multipliée par 1 + (X × 0,1), où X est le nombre total de Pokémon de son équipe mis K.O. au moment où ce talent s'est activé. X ne peut pas dépasser 5.", // NEEDS QC
		shortDesc: "Ses capacités gagnent 10 % de puissance par allié mis K.O., jusqu'à 5.", // NEEDS QC

		activate: "  {POKEMON} reçoit la puissance de ses alliés mis K.O. !",
	},
	surgesurfer: {
		name: "Surf Caudal",
		shortDesc: "Si un Champ Électrifié est actif, la Vitesse de ce Pokémon est doublée.", // NEEDS QC
	},
	swarm: {
		name: "Essaim",
		// Official flavor text: "Augmente la puissance des capacités de type Insecte du Pokémon quand il a perdu une certaine quantité de PV."
		desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, sa statistique offensive est multipliée par 1,5 quand il utilise une attaque de type Insecte.", // NEEDS QC
		shortDesc: "À 1/3 des PV ou moins, sa statistique offensive est x1,5 avec les attaques Insecte.", // NEEDS QC
		gen4: {
			desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, la puissance de ses attaques de type Insecte est multipliée par 1,5.", // NEEDS QC
			shortDesc: "À 1/3 ou moins de ses PV max, ses attaques Insecte ont 1,5x puissance.", // NEEDS QC
		},
	},
	sweetveil: {
		name: "Gluco-Voile",
		// Official flavor text: "Le Pokémon et ses alliés ne peuvent pas s’endormir."
		desc: "Ce Pokémon et ses alliés ne peuvent pas s'endormir, mais ceux qui dorment déjà ne se réveillent pas immédiatement. Ce Pokémon et ses alliés ne peuvent pas utiliser Repos avec succès ni être affectés par Bâillement, et ceux déjà affectés ne s'endormiront pas.", // NEEDS QC
		shortDesc: "Lui et ses alliés ne peuvent pas s'endormir ; les endormis ne se réveillent pas.", // NEEDS QC

		block: "  Gluco-Voile empêche {POKEMON} de dormir !",
	},
	swiftswim: {
		name: "Glissade",
		// Official flavor text: "Augmente la Vitesse du Pokémon s'il pleut."
		desc: "Si Pluie est active, la Vitesse de ce Pokémon est doublée. Cet effet est empêché si ce Pokémon tient un Parapluie Solide.", // NEEDS QC
		shortDesc: "Si Pluie est active, la Vitesse de ce Pokémon est doublée.", // NEEDS QC
		gen7: {
			desc: "Si Pluie est actif, la Vitesse de ce Pokémon est doublée.", // NEEDS QC
		},
	},
	swordofruin: {
		name: "Épée du Fléau",
		shortDesc: "Les Pokémon actifs sans ce talent ont leur Défense multipliée par 0,75.", // NEEDS QC

		start: "  L’Épée du Fléau {POKEMON:de} affaiblit la Défense des Pokémon alentour !",
	},
	symbiosis: {
		name: "Symbiose",
		// Official flavor text: "Quand les alliés utilisent l’objet qu’ils tiennent, le Pokémon leur donne l’objet qu’il tient en remplacement."
		desc: "Si un allié utilise son objet, ce Pokémon lui donne immédiatement le sien. Ne s'active pas si l'objet de l'allié a été volé ou retiré, ou si l'allié a utilisé un Bouton Fuite ou un Sac Fuite.", // NEEDS QC
		shortDesc: "Si un allié utilise son objet, ce Pokémon lui donne immédiatement le sien.", // NEEDS QC
		gen7: {
			desc: "Si un allié utilise son objet, ce Pokémon lui donne immédiatement le sien. Ne s'active pas si l'objet de l'allié a été volé ou fait tomber, ou si l'allié a utilisé un Bouton Fuite.", // NEEDS QC
		},
		gen6: {
			desc: "Si un allié utilise son objet, ce Pokémon lui donne immédiatement le sien. Ne s'active pas si l'objet de l'allié a été volé ou fait tomber.", // NEEDS QC
		},

		activate: "  {POKEMON} donne {ITEM:definite:classified} à {TARGET} !",
	},
	synchronize: {
		name: "Synchro",
		// Official flavor text: "Quand le Pokémon est brûlé, paralysé ou empoisonné par un autre Pokémon, il partage ce statut avec celui-ci."
		desc: "Si un autre Pokémon brûle, paralyse, empoisonne ou empoisonne gravement ce Pokémon, il subit le même problème de statut.", // NEEDS QC
		shortDesc: "Si un autre Pokémon le brûle, l'empoisonne ou le paralyse, il subit le même statut.", // NEEDS QC
		gen4: {
			desc: "Si un autre Pokémon brûle, paralyse ou empoisonne ce Pokémon, il reçoit le même problème de statut. Si un autre Pokémon empoisonne gravement ce Pokémon, il est empoisonné normalement.", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "Bois du Fléau",
		shortDesc: "Les Pokémon actifs sans ce talent ont leur Attaque multipliée par 0,75.", // NEEDS QC

		start: "  Le Bois du Fléau {POKEMON:de} affaiblit l’Attaque des Pokémon alentour !",
	},
	tangledfeet: {
		name: "Pieds Confus",
		shortDesc: "L'esquive de ce Pokémon est doublée tant qu'il est confus.", // NEEDS QC
	},
	tanglinghair: {
		name: "Mèche Rebelle",
		shortDesc: "Les Pokémon qui touchent ce Pokémon voient leur Vitesse baisser d'un niveau.", // NEEDS QC
	},
	technician: {
		name: "Technicien",
		// Official flavor text: "Augmente la puissance des capacités les plus faibles."
		desc: "Les capacités de ce Pokémon d'une puissance de 60 ou moins ont leur puissance multipliée par 1,5, y compris Lutte. Cet effet s'applique après qu'un effet de la capacité a modifié sa propre puissance.", // NEEDS QC
		shortDesc: "Ses capacités de 60 de puissance ou moins font x1,5, Lutte compris.", // NEEDS QC
		gen4: {
			desc: "Les capacités de ce Pokémon de 60 de puissance ou moins ont leur puissance multipliée par 1,5, sauf Lutte. Cet effet s'applique après qu'une capacité modifie sa propre puissance, ainsi qu'après les effets de Chargeur et Coup d’Main.", // NEEDS QC
			shortDesc: "Ses capacités de 60 de puissance ou moins ont 1,5x puissance, sauf Lutte.", // NEEDS QC
		},
	},
	telepathy: {
		name: "Télépathe",
		shortDesc: "Ce Pokémon ne subit pas les dégâts des attaques de ses alliés.", // NEEDS QC

		block: "  {POKEMON} ne peut pas être attaqué par ses alliés !",
	},
	teraformzero: {
		name: "Téraformation 0",
		shortDesc: "Terapagos : la téracristallisation annule météo et champs. Une fois par combat.", // NEEDS QC
	},
	terashell: {
		name: "Téra-Carapace",
		// Official flavor text: "Grâce à sa carapace qui renferme l’énergie de tous les types, les capacités subies par ce Pokémon quand ses PV sont au maximum ne sont pas très efficaces."
		desc: "Si ce Pokémon est un Terapagos avec tous ses PV, l'efficacité des attaques contre lui devient 0,5, sauf si ce Pokémon est immunisé contre la capacité. Les capacités frappant plusieurs fois conservent la même efficacité pendant toute l'attaque.", // NEEDS QC
		shortDesc: "Terapagos : à PV max, les attaques subies ont 0,5x d'efficacité, sauf immunité.", // NEEDS QC

		activate: "  {POKEMON} fait briller sa carapace et fausse les affinités de type !",
	},
	terashift: {
		name: "Téramorphose",
		shortDesc: "Si ce Pokémon est Terapagos, il prend sa Forme Téracristal à l'entrée.", // NEEDS QC

		transform: "{POKEMON} se transforme !",
	},
	teravolt: {
		name: "Téra-Voltage",
		// Official flavor text: "Le Pokémon ignore les talents adverses qui auraient un effet sur ses capacités."
		desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armure Caudale, Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Corps Coloré, Fantômasque, Peau Sèche, Absorbe-Terre, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Corps en Or, Toison Herbue, Chien de Garde, Ignifugé, Heavy Metal, Hyper Cutter, Tête de Gel, Écailles Glacées, Lumiattirance, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Œil Révélateur, Armure Miroir, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Pastel, Punk Rock, Sel Purificateur, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Téra-Carapace, Thermodynamique, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Bien Cuit, Écran Fumée, Aéroporté, Garde Mystik et Peau Miracle. Cet effet concerne tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent soit bénéfique ou non à ce Pokémon.", // NEEDS QC
		shortDesc: "Ses capacités et leurs effets ignorent les talents des autres Pokémon.", // NEEDS QC
		gen8: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Corps Coloré, Fantômasque, Peau Sèche, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Tête de Gel, Écailles Glacées, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Armure Miroir, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Pastel, Punk Rock, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen7: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Aura Ténébreuse, Corps Coloré, Fantômasque, Peau Sèche, Aura Féérique, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen6: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Aura Ténébreuse, Peau Sèche, Aura Féérique, Filtre, Torche, Don Floral, Flora-Voile, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen5: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armurbaston, Cœur de Coq, Corps Sain, Contestation, Moiteur, Peau Sèche, Filtre, Torche, Don Floral, Garde-Ami, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Tempo Perso, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen4: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armurbaston, Corps Sain, Moiteur, Peau Sèche, Filtre, Torche, Don Floral, Ignifugé, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Paratonnerre, Échauffement, Armumagma, Écaille Spéciale, Motorisé, Benêt, Tempo Perso, Voile Sable, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Pieds Confus, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée et Garde Mystik. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon. Le bonus d'Attaque du talent Don Floral d'un allié n'est pas ignoré.", // NEEDS QC
		},

		start: "  {POKEMON} dégage une aura électrique instable !",
	},
	thermalexchange: {
		name: "Thermodynamique",
		// Official flavor text: "Lorsque le Pokémon est touché par une capacité de type Feu, son Attaque augmente. Il ne peut pas être brûlé."
		desc: "L'Attaque de ce Pokémon monte d'un niveau quand il subit des dégâts d'une capacité de type Feu. Ce Pokémon ne peut pas être brûlé. Obtenir ce talent en étant brûlé soigne la brûlure.", // NEEDS QC
		shortDesc: "+1 Attaque s'il subit des dégâts de type Feu ; ne peut pas être brûlé.", // NEEDS QC
	},
	thickfat: {
		name: "Isograisse",
		// Official flavor text: "Le Pokémon est protégé par une épaisse couche de graisse qui diminue de moitié les dégâts qu'il subit des capacités de types Feu et Glace."
		desc: "Si un Pokémon utilise une attaque de type Feu ou Glace contre ce Pokémon, sa statistique offensive est divisée par deux dans le calcul des dégâts infligés à ce Pokémon.", // NEEDS QC
		shortDesc: "Les capacités Feu et Glace le frappent avec l'offense réduite de moitié.", // NEEDS QC
		gen4: {
			desc: "La puissance des attaques de type Feu et Glace contre ce Pokémon est divisée par deux.", // NEEDS QC
			shortDesc: "Les attaques Feu et Glace contre ce Pokémon perdent moitié puissance.", // NEEDS QC
		},
		gen3: {
			desc: "Si un Pokémon utilise une attaque de type Feu ou Glace contre ce Pokémon, son Attaque Spéciale est réduite de moitié lors du calcul des dégâts infligés à ce Pokémon.", // NEEDS QC
			shortDesc: "Les capacités Feu/Glace contre lui calculent avec une Atq. Spé réduite de moitié.", // NEEDS QC
		},
	},
	tintedlens: {
		name: "Lentiteintée",
		shortDesc: "Ses attaques peu efficaces infligent le double de dégâts.", // NEEDS QC
	},
	torrent: {
		name: "Torrent",
		// Official flavor text: "Augmente la puissance des capacités de type Eau du Pokémon quand il a perdu une certaine quantité de PV."
		desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, sa statistique offensive est multipliée par 1,5 quand il utilise une attaque de type Eau.", // NEEDS QC
		shortDesc: "À 1/3 des PV ou moins, sa statistique offensive est x1,5 avec les attaques Eau.", // NEEDS QC
		gen4: {
			desc: "Quand ce Pokémon a 1/3 ou moins de ses PV max, arrondi à l'inférieur, la puissance de ses attaques de type Eau est multipliée par 1,5.", // NEEDS QC
			shortDesc: "À 1/3 ou moins de ses PV max, ses attaques Eau ont 1,5x puissance.", // NEEDS QC
		},
	},
	toughclaws: {
		name: "Griffe Dure",
		shortDesc: "Les capacités directes de ce Pokémon ont leur puissance multipliée par 1,3.", // NEEDS QC
	},
	toxicboost: {
		name: "Rage Poison",
		// Official flavor text: "Augmente la puissance des capacités physiques quand le Pokémon est empoisonné."
		desc: "Quand ce Pokémon est empoisonné, la puissance de ses attaques physiques est multipliée par 1,5.", // NEEDS QC
		shortDesc: "Quand il est empoisonné, ses attaques physiques ont une puissance x1,5.", // NEEDS QC
	},
	toxicchain: {
		name: "Chaîne Toxique",
		// Official flavor text: "Grâce aux pouvoirs de sa chaîne imprégnée de toxines, le Pokémon peut empoisonner gravement sa cible en la touchant avec une capacité."
		desc: "Les attaques de ce Pokémon ont 30 % de chances d'empoisonner gravement. Cet effet s'applique avant la chance d'effet secondaire propre à la capacité.", // NEEDS QC
		shortDesc: "Les attaques de ce Pokémon ont 30 % de chances d'empoisonner gravement.", // NEEDS QC
	},
	toxicdebris: {
		name: "Dépôt Toxique",
		shortDesc: "S'il subit une attaque physique, des Pics Toxik sont posés côté adverse.", // NEEDS QC
	},
	trace: {
		name: "Calque",
		// Official flavor text: "Lorsque le Pokémon entre au combat, il calque le talent d'un ennemi pour remplacer le sien."
		desc: "En entrant au combat, ce Pokémon copie le talent d'un Pokémon adverse choisi au hasard. Les talents ne pouvant pas être copiés sont Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Don Floral, Météo, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Osmose, Paléosynthèse, Charge Quantique, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téraformation 0, Téra-Carapace, Téramorphose, Calque, Mode Transe et Supermutation. Si aucun Pokémon adverse n'a de talent copiable, ce talent s'activera dès que ce sera le cas.", // NEEDS QC
		shortDesc: "À l'entrée, ou dès que possible, copie le talent d'un adversaire au hasard.", // NEEDS QC
		gen8: {
			desc: "À l'entrée au combat, ce Pokémon copie le talent d'un Pokémon adverse au hasard. Les talents ne pouvant pas être copiés sont Osmose Équine, Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Dégobage, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque et Mode Transe. Si aucun adversaire n'a de talent copiable, ce talent s'active dès que c'est le cas.", // NEEDS QC
		},
		gen7: {
			desc: "À l'entrée au combat, ce Pokémon copie le talent d'un Pokémon adverse au hasard. Les talents ne pouvant pas être copiés sont Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Illusion, Imposteur, Multi-Type, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque et Mode Transe. Si aucun adversaire n'a de talent copiable, ce talent s'active dès que c'est le cas.", // NEEDS QC
		},
		gen6: {
			desc: "À l'entrée au combat, ce Pokémon copie le talent d'un Pokémon adverse adjacent au hasard. Les talents ne pouvant pas être copiés sont Don Floral, Météo, Illusion, Imposteur, Multi-Type, Déclic Tactique, Calque et Mode Transe. Si aucun adversaire n'a de talent copiable, ce talent s'active dès que c'est le cas.", // NEEDS QC
		},
		gen5: {
			desc: "À l'entrée au combat, ce Pokémon copie le talent d'un Pokémon adverse adjacent au hasard. Les talents ne pouvant pas être copiés sont Don Floral, Météo, Illusion, Imposteur, Multi-Type, Calque et Mode Transe. Si aucun adversaire n'a de talent copiable, ce talent s'active dès que c'est le cas.", // NEEDS QC
		},
		gen4: {
			desc: "À l'entrée au combat, ce Pokémon copie le talent d'un Pokémon adverse au hasard. Les talents ne pouvant pas être copiés sont Météo, Multi-Type et Calque. Si aucun adversaire n'a de talent copiable, ce talent s'active dès que c'est le cas.", // NEEDS QC
		},
		gen3: {
			desc: "À l'entrée au combat, ce Pokémon copie le talent d'un Pokémon adverse au hasard.", // NEEDS QC
		},

		changeAbility: "  Le talent {ABILITY} {SOURCE:de} a été calqué !", // SV fr_common:6723
	},
	transistor: {
		name: "Transistor",
		shortDesc: "Sa statistique offensive est multipliée par 1,3 avec les attaques Électrik.", // NEEDS QC
		gen8: {
			shortDesc: "Sa stat offensive est x1,5 quand il utilise une attaque Électrik.", // NEEDS QC
		},
	},
	triage: {
		name: "Prioguérison",
		shortDesc: "Les capacités de soin de ce Pokémon ont leur priorité augmentée de 3.", // NEEDS QC
	},
	truant: {
		name: "Absentéisme",
		shortDesc: "Ce Pokémon n'agit qu'un tour sur deux.", // NEEDS QC
		gen3: {
			desc: "Ce Pokémon paresse un tour sur deux au lieu d'utiliser une capacité. S'il remplace un Pokémon mis K.O. par des effets de fin de tour, son premier tour est paressé.", // NEEDS QC
		},

		cant: "{POKEMON} paresse !",
	},
	turboblaze: {
		name: "Turbo Brasier",
		// Official flavor text: "Le Pokémon ignore les talents adverses qui auraient un effet sur ses capacités."
		desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armure Caudale, Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Corps Coloré, Fantômasque, Peau Sèche, Absorbe-Terre, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Corps en Or, Toison Herbue, Chien de Garde, Ignifugé, Heavy Metal, Hyper Cutter, Tête de Gel, Écailles Glacées, Lumiattirance, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Œil Révélateur, Armure Miroir, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Pastel, Punk Rock, Sel Purificateur, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Téra-Carapace, Thermodynamique, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Bien Cuit, Écran Fumée, Aéroporté, Garde Mystik et Peau Miracle. Cet effet concerne tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent soit bénéfique ou non à ce Pokémon.", // NEEDS QC
		shortDesc: "Ses capacités et leurs effets ignorent les talents des autres Pokémon.", // NEEDS QC
		gen8: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Corps Coloré, Fantômasque, Peau Sèche, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Tête de Gel, Écailles Glacées, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Armure Miroir, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Pastel, Punk Rock, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen7: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Aura Ténébreuse, Corps Coloré, Fantômasque, Peau Sèche, Aura Féérique, Filtre, Torche, Don Floral, Flora-Voile, Boule de Poils, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Prestance Royale, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Aquabulle, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen6: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Aroma-Voile, Aura Inversée, Armurbaston, Cœur de Coq, Pare-Balles, Corps Sain, Contestation, Moiteur, Aura Ténébreuse, Peau Sèche, Aura Féérique, Filtre, Torche, Don Floral, Flora-Voile, Garde-Ami, Toison Épaisse, Toison Herbue, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Envelocape, Tempo Perso, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Gluco-Voile, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen5: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armurbaston, Cœur de Coq, Corps Sain, Contestation, Moiteur, Peau Sèche, Filtre, Torche, Don Floral, Garde-Ami, Ignifugé, Heavy Metal, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Light Metal, Paratonnerre, Échauffement, Miroir Magik, Armumagma, Écaille Spéciale, Motorisé, Multiécaille, Benêt, Tempo Perso, Voile Sable, Herbivore, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Pieds Confus, Télépathe, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée, Garde Mystik et Peau Miracle. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon, et que leur talent lui soit bénéfique ou non.", // NEEDS QC
		},
		gen4: {
			desc: "Les capacités de ce Pokémon et leurs effets ignorent certains talents des autres Pokémon. Les talents pouvant être ignorés sont Armurbaston, Corps Sain, Moiteur, Peau Sèche, Filtre, Torche, Don Floral, Ignifugé, Hyper Cutter, Vaccin, Attention, Insomnia, Regard Vif, Feuille Garde, Lévitation, Paratonnerre, Échauffement, Armumagma, Écaille Spéciale, Motorisé, Benêt, Tempo Perso, Voile Sable, Coque Armure, Écran Poudre, Simple, Rideau Neige, Solide Roc, Anti-Bruit, Glu, Lavabo, Fermeté, Ventouse, Pieds Confus, Isograisse, Inconscient, Esprit Vital, Absorbe-Volt, Absorbe-Eau, Ignifu-Voile, Écran Fumée et Garde Mystik. Cela affecte tous les autres Pokémon sur le terrain, qu'ils soient ou non la cible de la capacité de ce Pokémon. Le bonus d'Attaque du talent Don Floral d'un allié n'est pas ignoré.", // NEEDS QC
		},

		start: "  {POKEMON} dégage une aura de flammes incandescentes !",
	},
	unaware: {
		name: "Inconscient",
		// Official flavor text: "Le Pokémon ignore les changements de stats des autres Pokémon, qu'il attaque ou soit attaqué."
		desc: "Ce Pokémon ignore les niveaux d'Attaque, d'Attaque Spéciale et de précision des autres Pokémon quand il subit des dégâts, et ignore les niveaux de Défense, de Défense Spéciale et d'esquive des autres Pokémon quand il inflige des dégâts.", // NEEDS QC
		shortDesc: "Ignore les changements de statistiques des autres Pokémon dans les calculs.", // NEEDS QC
	},
	unburden: {
		name: "Délestage",
		// Official flavor text: "Augmente la Vitesse du Pokémon s'il perd ou utilise l'objet qu'il tenait au début du combat."
		desc: "Si ce Pokémon perd son objet tenu pour une raison quelconque, sa Vitesse est doublée tant qu'il reste au combat, garde ce talent et ne tient pas d'objet.", // NEEDS QC
		shortDesc: "Vitesse doublée s'il perd son objet ; perdu s'il part ou reçoit objet/talent.", // NEEDS QC
	},
	unnerve: {
		name: "Tension",
		// Official flavor text: "Fait stresser l’adversaire, ce qui l’empêche de manger des Baies."
		desc: "Tant que ce Pokémon est au combat, les Pokémon adverses ne peuvent pas utiliser leurs Baies. Ce talent s'active avant les pièges et les autres talents.", // NEEDS QC
		shortDesc: "Tant que ce Pokémon est au combat, les adversaires ne peuvent pas manger leurs Baies.", // NEEDS QC

		start: "  {TEAM:capitalize} est tendue et ne peut plus manger de Baies !",
	},
	unseenfist: {
		name: "Poing Invisible",
		shortDesc: "Ses capacités directes ignorent les protections de la cible, sauf Gardomax.", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "Urne du Fléau",
		shortDesc: "Les Pokémon actifs sans ce talent ont leur Atq. Spé multipliée par 0,75.", // NEEDS QC

		start: "  L’Urne du Fléau {POKEMON:de} affaiblit l’Attaque Spéciale des Pokémon alentour !",
	},
	victorystar: {
		name: "Victorieux",
		shortDesc: "Les capacités de ce Pokémon et de ses alliés ont leur précision x1,1.", // NEEDS QC
	},
	vitalspirit: {
		name: "Esprit Vital",
		shortDesc: "Ce Pokémon ne peut pas s'endormir. L'obtenir en dormant le réveille.", // NEEDS QC
	},
	voltabsorb: {
		name: "Absorbe-Volt",
		// Official flavor text: "Si le Pokémon est touché par une capacité Électrik, il ne subit aucun dégât et regagne des PV à la place."
		desc: "Ce Pokémon est immunisé contre les capacités de type Électrik et récupère 1/4 de ses PV max, arrondi à l'inférieur, quand il est touché par une capacité de type Électrik.", // NEEDS QC
		shortDesc: "Récupère 1/4 de ses PV max quand une capacité Électrik le touche ; immunité Électrik.", // NEEDS QC
		gen3: {
			desc: "Ce Pokémon est immunisé contre les capacités offensives de type Électrik et récupère 1/4 de ses PV max, arrondi à l'inférieur, quand il est touché par l'une d'elles.", // NEEDS QC
			shortDesc: "Soigne 1/4 de ses PV max contre les capacités Électrik offensives ; immunisé.", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "Âme Vagabonde",
		// Official flavor text: "Lorsque le Pokémon est directement touché par une capacité, il échange son talent avec celui de l’assaillant."
		desc: "Les Pokémon qui touchent ce Pokémon avec une capacité directe échangent leur talent avec le sien. N'affecte pas les Pokémon ayant les talents Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Déclic Fringale, Tête de Gel, Illusion, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Paléosynthèse, Charge Quantique, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téra-Carapace, Téramorphose, Téraformation 0, Garde Mystik, Mode Transe et Supermutation.", // NEEDS QC
		shortDesc: "Les Pokémon qui touchent ce Pokémon échangent leur talent avec le sien.", // NEEDS QC
		gen8: {
			desc: "Les Pokémon touchant ce Pokémon échangent leur talent avec celui-ci. N'affecte pas les Pokémon ayant les talents Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Déclic Fringale, Tête de Gel, Illusion, Multi-Type, Gaz Inhibiteur, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Garde Mystik ou Mode Transe.", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "Absorbe-Eau",
		// Official flavor text: "Si le Pokémon est touché par une capacité Eau, il ne subit aucun dégât et regagne des PV à la place."
		desc: "Ce Pokémon est immunisé contre les capacités de type Eau et récupère 1/4 de ses PV max, arrondi à l'inférieur, quand il est touché par une capacité de type Eau.", // NEEDS QC
		shortDesc: "Récupère 1/4 de ses PV max quand une capacité Eau le touche ; immunité Eau.", // NEEDS QC
	},
	waterbubble: {
		name: "Aquabulle",
		// Official flavor text: "Réduit la puissance des capacités de type Feu subies par le Pokémon. Il est également immunisé contre les brûlures."
		desc: "La statistique offensive de ce Pokémon est doublée quand il utilise une attaque de type Eau. Si un Pokémon utilise une attaque de type Feu contre ce Pokémon, sa statistique offensive est divisée par deux dans le calcul des dégâts infligés à ce Pokémon. Ce Pokémon ne peut pas être brûlé. Obtenir ce talent en étant brûlé soigne la brûlure.", // NEEDS QC
		shortDesc: "Sa puissance Eau est doublée ; jamais brûlé ; le Feu contre lui est réduit de moitié.", // NEEDS QC
	},
	watercompaction: {
		name: "Sable Humide",
		shortDesc: "Sa Défense monte de 2 niveaux quand une capacité Eau le blesse.", // NEEDS QC
	},
	waterveil: {
		name: "Ignifu-Voile",
		shortDesc: "Ce Pokémon ne peut pas être brûlé. L'obtenir en l'étant le soigne.", // NEEDS QC
	},
	weakarmor: {
		name: "Armurouillée",
		// Official flavor text: "Quand le Pokémon est touché par une capacité physique, sa Défense baisse mais sa Vitesse augmente beaucoup."
		desc: "Si une attaque physique touche ce Pokémon, sa Défense baisse d'un niveau et sa Vitesse monte de 2 niveaux.", // NEEDS QC
		shortDesc: "S'il subit une attaque physique : -1 Défense et +2 Vitesse.", // NEEDS QC
		gen6: {
			desc: "Si une attaque physique touche ce Pokémon, sa Défense baisse d'un niveau et sa Vitesse monte d'un niveau.", // NEEDS QC
			shortDesc: "Touché par une attaque physique : Défense -1, Vitesse +1.", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "Bien Cuit",
		// Official flavor text: "Si le Pokémon est touché par une capacité de type Feu, il ne subit aucun dégât et sa Défense augmente beaucoup."
		desc: "Ce Pokémon est immunisé contre les capacités de type Feu et sa Défense monte de 2 niveaux quand il est touché par une capacité de type Feu.", // NEEDS QC
		shortDesc: "+2 Défense s'il est touché par une capacité Feu ; immunité Feu.", // NEEDS QC
	},
	whitesmoke: {
		name: "Écran Fumée",
		shortDesc: "Empêche les autres Pokémon de baisser les statistiques de ce Pokémon.", // NEEDS QC
	},
	wimpout: {
		name: "Escampette",
		// Official flavor text: "Le Pokémon perd confiance quand ses PV tombent à la moitié et s’enfuit dans sa Poké Ball."
		desc: "Quand ce Pokémon a plus de la moitié de ses PV max et que des dégâts les font tomber à la moitié ou moins, il quitte immédiatement le combat et est remplacé par un allié choisi. Cet effet s'applique après tous les coups d'une capacité frappant plusieurs fois. Cet effet est empêché si l'effet secondaire de la capacité a été supprimé par le talent Sans Limite. Cet effet s'applique aux dégâts directs comme indirects, sauf ceux de Malédiction et Clonage quand ce Pokémon les utilise, de Cognobidon, de Balance et de la confusion.", // NEEDS QC
		shortDesc: "Ce Pokémon quitte le combat quand il tombe à la moitié de ses PV max ou moins.", // NEEDS QC
	},
	windpower: {
		name: "Turbine Éolienne",
		// Official flavor text: "Si le Pokémon est touché par une capacité faisant appel au vent, il se charge en électricité."
		desc: "Ce Pokémon obtient l'effet de Chargeur quand il est touché par une capacité de vent ou quand Vent Arrière commence dans son équipe.", // NEEDS QC
		shortDesc: "Obtient l'effet de Chargeur s'il subit une capacité de vent ou sous Vent Arrière.", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "Aéroporté",
		// Official flavor text: "L’Attaque du Pokémon augmente si un vent arrière souffle ou s’il est touché par une capacité faisant appel au vent. Dans ce dernier cas, il ne subit aucun dégât."
		desc: "Ce Pokémon est immunisé contre les capacités de vent et son Attaque monte d'un niveau quand il est touché par une capacité de vent ou quand Vent Arrière commence dans son équipe.", // NEEDS QC
		shortDesc: "+1 Attaque s'il subit une capacité de vent ou sous Vent Arrière ; immunisé au vent.", // NEEDS QC
	},
	wonderguard: {
		name: "Garde Mystik",
		shortDesc: "Ne peut être blessé que par les capacités super efficaces et les dégâts indirects.", // NEEDS QC
		gen4: {
			shortDesc: "Seuls Crocs Feu, les capacités super efficaces et les dégâts indirects le blessent.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Seules les capacités super efficaces et les dégâts indirects le blessent.", // NEEDS QC
		},
	},
	wonderskin: {
		name: "Peau Miracle",
		// Official flavor text: "Le Pokémon résiste mieux aux capacités de statut."
		desc: "Les capacités sans dégâts qui vérifient la précision voient leur précision devenir 50 % quand elles sont utilisées contre ce Pokémon. Cet effet s'applique avant les autres effets qui modifient la précision.", // NEEDS QC
		shortDesc: "Les capacités de statut avec précision n'ont que 50 % de chances de le toucher.", // NEEDS QC
	},
	zenmode: {
		name: "Mode Transe",
		// Official flavor text: "Le Pokémon change de forme quand il lui reste moins de la moitié de ses PV."
		desc: "Si ce Pokémon est un Darumacho ou un Darumacho de Galar, il passe en Mode Transe s'il a la moitié ou moins de ses PV max à la fin d'un tour. Si ses PV sont au-dessus de la moitié de ses PV max à la fin d'un tour, il repasse en Mode Normal.", // NEEDS QC
		shortDesc: "Darumacho passe en Mode Transe à la moitié des PV ou moins, sinon Mode Normal.", // NEEDS QC
		gen7: {
			desc: "Si ce Pokémon est un Darumacho, il passe en Mode Transe s'il a 1/2 ou moins de ses PV max à la fin d'un tour. Si ses PV dépassent 1/2 de ses PV max à la fin d'un tour, il repasse en Mode Normal.", // NEEDS QC
		},
		gen6: {
			desc: "Si ce Pokémon est un Darumacho, il passe en Mode Transe s'il a 1/2 ou moins de ses PV max à la fin d'un tour. Si ses PV dépassent 1/2 de ses PV max à la fin d'un tour, il repasse en Mode Normal. S'il perd ce talent en Mode Transe, il repasse immédiatement en Mode Normal.", // NEEDS QC
		},

		transform: "Le talent Mode Transe s’active !",
		transformEnd: "Le talent Mode Transe n’est plus actif !",
	},
	zerotohero: {
		name: "Supermutation",
		shortDesc: "Superdofin Forme Ordinaire passe en Forme Super quand il quitte le combat.", // NEEDS QC

		activate: "  {POKEMON} est revenu sous une autre forme !",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "À l'entrée, ce Pokémon évite toutes les attaques Roche et Piège de Roc.", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "En entrant au combat, ce Pokémon bloque certaines capacités de statut et les renvoie contre leur utilisateur.", // NEEDS QC
		shortDesc: "À l'entrée, renvoie certaines capacités de statut à leur utilisateur.", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "La durée de Gravité, Anti-Soin, Zone Magique, Rune Protect, Vent Arrière, Distorsion et Zone Étrange est augmentée de 2 tours quand l'effet est lancé par ce Pokémon.", // NEEDS QC
		shortDesc: "Ses Gravité, Anti-Soin, Rune Protect, Vent Arrière et Salles durent 2 tours de plus.", // NEEDS QC

		activate: "  {POKEMON} prolonge {MOVE} de 2 tours !", // NEEDS QC
	},
};
