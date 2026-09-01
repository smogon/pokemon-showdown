export const MovesText: { [id: IDEntry]: MoveText } = {
	"10000000voltthunderbolt": {
		name: "Giga-Tonnerre",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A de très grandes chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique très élevé.", // NEEDS QC
	},
	absorb: {
		name: "Vole-Vie",
		// Official flavor text: "Une attaque qui convertit la moitié des dégâts infligés en PV pour le lanceur."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur. Si la cible a un clone, cette capacité la rate.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur. Si cette capacité brise le clone de la cible, l'utilisateur ne récupère pas de PV.", // NEEDS QC
		},
	},
	accelerock: {
		name: "Vif Roc",
		// Official flavor text: "Le lanceur charge l’ennemi à toute vitesse. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	acid: {
		name: "Acide",
		// Official flavor text: "Le lanceur attaque l’ennemi avec un jet d’acide corrosif. Peut aussi baisser sa Défense Spéciale."
		desc: "A 10 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Déf. Spé des ennemis d'un niveau.", // NEEDS QC
		gen3: {
			desc: "A 10 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
			shortDesc: "10 % de baisser la Déf. des ennemis d'un niveau.", // NEEDS QC
		},
		gen1: {
			desc: "A 33 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
			shortDesc: "33 % de baisser la Déf. de la cible d'un niveau.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10 % de baisser la Déf. de la cible d'un niveau.", // NEEDS QC
		},
	},
	acidarmor: {
		name: "Acidarmure",
		// Official flavor text: "Le lanceur modifie sa structure moléculaire pour se liquéfier et beaucoup augmenter sa Défense."
		desc: "Monte la Défense de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur de 2 niveaux.", // NEEDS QC
	},
	aciddownpour: {
		name: "Déluge Causti-Toxique",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	acidspray: {
		name: "Bombe Acide",
		// Official flavor text: "Projette un liquide acide qui fait fondre l’ennemi. Sa Défense Spéciale diminue beaucoup."
		desc: "A 100 % de chances de baisser la Défense Spéciale de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "100 % de baisser la Déf. Spé de la cible de 2 niveaux.", // NEEDS QC
	},
	acrobatics: {
		name: "Acrobatie",
		shortDesc: "Puissance doublée si le lanceur n'a pas d'objet.", // NEEDS QC
	},
	acupressure: {
		name: "Acupression",
		// Official flavor text: "Le lanceur utilise sa connaissance des points de pression pour beaucoup augmenter une stat."
		desc: "Monte une statistique au hasard de 2 niveaux, à condition qu'elle ne soit pas déjà au niveau 6. L'utilisateur peut choisir de cibler lui-même ou un allié adjacent. Échoue si aucun niveau ne peut être monté, ou si la cible est un allié derrière un clone.", // NEEDS QC
		shortDesc: "+2 à une stat au hasard du lanceur ou d'un allié.", // NEEDS QC
		gen4: {
			desc: "Monte une statistique au hasard de 2 niveaux, à condition qu'elle ne soit pas déjà au niveau 6. L'utilisateur peut choisir de cibler lui-même ou un allié. Échoue si aucun niveau ne peut être monté, ou si l'utilisateur ou l'allié a un clone.", // NEEDS QC
		},
	},
	aerialace: {
		name: "Aéropique",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	aeroblast: {
		name: "Aéroblast",
		// Official flavor text: "Le lanceur projette une tornade sur l’ennemi pour infliger des dégâts. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	afteryou: {
		name: "Après Vous",
		// Official flavor text: "S’il est le premier à agir, le lanceur permet à sa cible d’utiliser une capacité juste après lui."
		desc: "La cible agit immédiatement après l'utilisateur ce tour, quelle que soit la priorité de la capacité qu'elle a choisie. Échoue si la cible allait de toute façon agir juste après, ou si elle a déjà agi ce tour.", // NEEDS QC
		shortDesc: "La cible agit juste après le lanceur.", // NEEDS QC

		activate: "  {TARGET} accepte avec joie !",
	},
	agility: {
		name: "Hâte",
		// Official flavor text: "Le lanceur se relaxe et allège son corps pour beaucoup augmenter sa Vitesse."
		desc: "Monte la Vitesse de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte la Vitesse du lanceur de 2 niveaux.", // NEEDS QC
	},
	aircutter: {
		name: "Tranch’Air",
		// Official flavor text: "Le lanceur appelle des vents tranchants qui lacèrent l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé. Touche les ennemis adjacents.", // NEEDS QC
	},
	airslash: {
		name: "Lame d’Air",
		// Official flavor text: "Le lanceur attaque avec une lame d’air qui fend tout. Peut aussi apeurer l’ennemi."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	alloutpummeling: {
		name: "Combo Hyper-Furie",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	alluringvoice: {
		name: "Voix Envoûtante",
		// Official flavor text: "Le lanceur attaque la cible avec sa voix angélique. Cette capacité rend la cible confuse si ses stats ont augmenté pendant ce tour."
		desc: "A 100 % de chances de rendre la cible confuse si ses niveaux de statistiques ont monté ce tour.", // NEEDS QC
		shortDesc: "100 % de rendre confus si la cible a monté une stat.", // NEEDS QC
	},
	allyswitch: {
		name: "Interversion",
		// Official flavor text: "Le lanceur se téléporte à l’aide d’un pouvoir mystérieux. Il échange sa place avec celle d’un allié sur le terrain."
		desc: "L'utilisateur échange sa position avec son allié. Échoue si l'utilisateur est le seul Pokémon de son équipe sur le terrain. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée par l'utilisateur n'est pas Interversion.", // NEEDS QC
		shortDesc: "Échange sa position avec son allié ; peut échouer.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur échange sa position avec son allié. Échoue si l'utilisateur est le seul Pokémon de son équipe sur le terrain.", // NEEDS QC
			shortDesc: "L'utilisateur échange sa position avec son allié.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur échange sa position avec celle de l'allié à l'autre bout du terrain. Échoue s'il n'y a pas de Pokémon à cette position, si l'utilisateur est le seul Pokémon de son équipe sur le terrain, ou s'il se trouve au milieu.", // NEEDS QC
			shortDesc: "Échange sa position avec l'allié à l'autre bout.", // NEEDS QC
		},
	},
	amnesia: {
		name: "Amnésie",
		// Official flavor text: "Le lanceur fait le vide dans son esprit pour oublier ses soucis. Augmente beaucoup sa Défense Spéciale."
		desc: "Monte la Défense Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte la Déf. Spé du lanceur de 2 niveaux.", // NEEDS QC
		gen1: {
			desc: "Monte le Spécial de l'utilisateur de 2 niveaux.", // NEEDS QC
			shortDesc: "Monte le Spécial de l'utilisateur de 2 niveaux.", // NEEDS QC
		},
	},
	anchorshot: {
		name: "Ancrage",
		// Official flavor text: "Le lanceur jette son ancre sur la cible pour l’attaquer. Une fois accrochée, elle l’empêche de s’enfuir."
		desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Empêche la cible de quitter le combat.", // NEEDS QC
		gen7: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
	},
	ancientpower: {
		name: "Pouvoir Antique",
		// Official flavor text: "Une attaque préhistorique qui peut augmenter toutes les stats du lanceur d’un seul coup."
		desc: "A 10 % de chances de monter l'Attaque, la Défense, l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "10 % de monter toutes ses stats d'un niveau.", // NEEDS QC
	},
	appleacid: {
		name: "Acide Malique",
		// Official flavor text: "Le lanceur attaque son adversaire avec un liquide corrosif créé à partir d’une pomme acide. Baisse la Défense Spéciale de la cible."
		desc: "A 100 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	aquacutter: {
		name: "Tranch'Aqua",
		// Official flavor text: "Le lanceur projette de l'eau pressurisée qui entaille la cible comme une lame. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	aquajet: {
		name: "Aqua-Jet",
		// Official flavor text: "Le lanceur fonce sur l’ennemi si rapidement qu’on parvient à peine à le discerner. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	aquaring: {
		name: "Anneau Hydro",
		// Official flavor text: "Un voile d’eau recouvre le lanceur et régénère ses PV à chaque tour."
		desc: "L'utilisateur récupère 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour tant qu'il reste au combat. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5. Si l'utilisateur utilise Relais, son remplaçant hérite de l'effet de soin.", // NEEDS QC
		shortDesc: "Le lanceur récupère 1/16 de ses PV max par tour.", // NEEDS QC

		start: "  {POKEMON} s’entoure d’un voile d’eau !",
		heal: "  Le voile d’eau restaure les PV {POKEMON:de} !",
	},
	aquastep: {
		name: "Danse Aquatique",
		// Official flavor text: "Le lanceur se joue de la cible et lui inflige des dégâts avec ses pas de danse gracieux et légers. Cette capacité augmente la Vitesse du lanceur."
		desc: "A 100 % de chances de monter la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "100 % de monter la Vitesse du lanceur d'un niveau.", // NEEDS QC
	},
	aquatail: {
		name: "Hydro-Queue",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	armorcannon: {
		name: "Canon Blindé",
		// Official flavor text: "Le lanceur tire un boulet de canon ardent provenant de sa propre armure sur la cible. Cela baisse la Défense et la Défense Spéciale du lanceur."
		desc: "Baisse la Défense et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "-1 Déf et Déf. Spé du lanceur.", // NEEDS QC
	},
	armthrust: {
		name: "Cogne",
		// Official flavor text: "Un déluge de coups adressés avec la paume qui frappe de deux à cinq fois d’affilée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
	},
	aromatherapy: {
		name: "Aromathérapie",
		// Official flavor text: "Le lanceur libère un parfum apaisant qui guérit toutes les altérations de statut de l’équipe."
		desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut. Les Pokémon actifs ayant le talent Herbivore ne sont pas soignés, sauf s'il s'agit de l'utilisateur.", // NEEDS QC
		shortDesc: "Soigne le statut de toute l'équipe du lanceur.", // NEEDS QC
		gen5: {
			desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut.", // NEEDS QC
		},

		activate: "  Une odeur apaisante flotte dans l’air !",
	},
	aromaticmist: {
		name: "Brume Capiteuse",
		// Official flavor text: "Grâce à un parfum mystérieux, augmente la Défense Spéciale d’un allié."
		desc: "Monte la Défense Spéciale de la cible d'un niveau. Échoue si aucun allié n'est adjacent à l'utilisateur.", // NEEDS QC
		shortDesc: "Monte la Déf. Spé d'un allié d'un niveau.", // NEEDS QC
	},
	assist: {
		name: "Assistance",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Utilise une capacité choisie au hasard parmi celles connues par les membres de l'équipe de l'utilisateur. Ne peut pas sélectionner Assistance, Blockhaus, Bec-Canon, Éructation, Passe-Cadeau, Crash Brûlant, Rebond, Célébration, Babil, Projection, Crash Musclé, Photocopie, Riposte, Implore, Lien du Destin, Détection, Tunnel, Plongée, Draco-Queue, Ténacité, Ruse, Vol, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Crash Magique, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Crash Toxique, Hantise, Abri, Poudre Fureur, Hurlement, Revenant, Carapiège, Gribouille, Chute Libre, Blabla Dodo, Saisie, Pico-Défense, Projecteur, Lutte, Passe-Passe, Pluie Térastrale, Larcin, Morphing, Tour de Magie, Cyclone ou Crash Obscur.", // NEEDS QC
		shortDesc: "Utilise une capacité au hasard de l'équipe.", // NEEDS QC
		gen8: {
			desc: "Utilise une capacité choisie au hasard parmi celles connues par les membres de l'équipe de l'utilisateur. Ne peut pas sélectionner Assistance, Blockhaus, Bec-Canon, Éructation, Passe-Cadeau, Rebond, Célébration, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Tunnel, Plongée, Draco-Queue, Ténacité, Ruse, Vol, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Hantise, Abri, Poudre Fureur, Hurlement, Revenant, Carapiège, Gribouille, Chute Libre, Blabla Dodo, Saisie, Pico-Défense, Projecteur, Lutte, Passe-Passe, Larcin, Morphing, Tour de Magie ou Cyclone.", // NEEDS QC
		},
		gen7: {
			desc: "Utilise une capacité choisie au hasard parmi celles connues par les membres de l'équipe de l'utilisateur. Ne peut pas sélectionner Assistance, Blockhaus, Bec-Canon, Éructation, Passe-Cadeau, Rebond, Célébration, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Tunnel, Plongée, Draco-Queue, Ténacité, Ruse, Vol, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Hantise, Abri, Poudre Fureur, Hurlement, Revenant, Carapiège, Gribouille, Chute Libre, Blabla Dodo, Saisie, Pico-Défense, Projecteur, Lutte, Passe-Passe, Larcin, Morphing, Tour de Magie ou Cyclone, ni une capacité Z.", // NEEDS QC
		},
		gen6: {
			desc: "Utilise une capacité choisie au hasard parmi celles connues par les membres de l'équipe de l'utilisateur. Ne peut pas sélectionner Assistance, Éructation, Passe-Cadeau, Rebond, Célébration, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Tunnel, Plongée, Draco-Queue, Ténacité, Ruse, Vol, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Hantise, Abri, Poudre Fureur, Hurlement, Revenant, Gribouille, Chute Libre, Blabla Dodo, Saisie, Pico-Défense, Lutte, Passe-Passe, Larcin, Morphing, Tour de Magie ou Cyclone.", // NEEDS QC
		},
		gen5: {
			desc: "Utilise une capacité choisie au hasard parmi celles connues par les membres de l'équipe de l'utilisateur. Ne peut pas sélectionner Assistance, Passe-Cadeau, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Draco-Queue, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Abri, Poudre Fureur, Gribouille, Blabla Dodo, Saisie, Lutte, Passe-Passe, Larcin, Morphing ou Tour de Magie.", // NEEDS QC
		},
		gen4: {
			desc: "Utilise une capacité choisie au hasard parmi celles connues par les membres de l'équipe de l'utilisateur. Ne peut pas sélectionner Assistance, Babil, Photocopie, Riposte, Implore, Lien du Destin, Détection, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Abri, Gribouille, Blabla Dodo, Saisie, Lutte, Passe-Passe, Larcin ou Tour de Magie.", // NEEDS QC
		},
		gen3: {
			desc: "Utilise une capacité choisie au hasard parmi celles connues par les membres de l'équipe de l'utilisateur. Ne peut pas sélectionner Assistance, Riposte, Implore, Lien du Destin, Détection, Ténacité, Mitra-Poing, Par Ici, Coup d’Main, Métronome, Copie, Voile Miroir, Mimique, Abri, Gribouille, Blabla Dodo, Saisie, Lutte, Larcin ou Tour de Magie.", // NEEDS QC
		},
	},
	assurance: {
		name: "Assurance",
		// Official flavor text: "Cette attaque est deux fois plus efficace si l’ennemi a déjà été blessé durant ce tour."
		desc: "La puissance est doublée si la cible a déjà subi des dégâts ce tour, autres que les dégâts directs de Cognobidon, de la confusion, de Malédiction ou de Balance.", // NEEDS QC
		shortDesc: "Puissance doublée si la cible a été blessée ce tour.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si la cible a déjà subi des dégâts ce tour.", // NEEDS QC
		},
	},
	astonish: {
		name: "Étonnement",
		// Official flavor text: "Le lanceur attaque l’ennemi en poussant un cri terrifiant. Peut aussi l’apeurer."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		gen3: {
			desc: "A 30 % de chances d'apeurer la cible. Les dégâts sont doublés si la cible a utilisé Lilliput depuis qu'elle est au combat.", // NEEDS QC
		},
	},
	astralbarrage: {
		name: "Éclat Spectral",
		// Official flavor text: "Le lanceur attaque l’ennemi avec une multitude de petits spectres."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis adjacents.", // NEEDS QC
	},
	attackorder: {
		name: "Appel Attaque",
		// Official flavor text: "Le lanceur appelle ses sous-fifres pour frapper l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	attract: {
		name: "Attraction",
		// Official flavor text: "Si l’ennemi est du sexe opposé, il tombe amoureux et rechigne alors à attaquer."
		desc: "Rend la cible amoureuse : elle est incapable d'attaquer 50 % du temps. Échoue si l'utilisateur et la cible sont du même sexe, si l'un des deux n'a pas de sexe, ou si la cible est déjà amoureuse. L'effet prend fin quand l'utilisateur ou la cible quitte le combat. Les Pokémon ayant le talent Benêt ou protégés par le talent Aroma-Voile sont immunisés.", // NEEDS QC
		shortDesc: "Rend amoureuse une cible du sexe opposé.", // NEEDS QC
		gen5: {
			desc: "Rend la cible amoureuse : elle est incapable d'attaquer 50 % du temps. Échoue si l'utilisateur et la cible sont du même sexe, si l'un des deux n'a pas de sexe, ou si la cible est déjà amoureuse. L'effet prend fin quand l'utilisateur ou la cible quitte le combat. Les Pokémon ayant le talent Benêt sont immunisés.", // NEEDS QC
		},
		gen2: {
			desc: "Rend la cible amoureuse : elle est incapable d'attaquer 50 % du temps. Échoue si l'utilisateur et la cible sont du même sexe, si l'un des deux n'a pas de sexe, ou si la cible est déjà amoureuse. L'effet prend fin quand l'utilisateur ou la cible quitte le combat.", // NEEDS QC
		},

		start: "  {POKEMON} entre dans l’état « Attraction » !",
		startFromItem: "  {ITEM:definite:capitalize} rend{INFLECT:ITEM:s=:p=ent} {POKEMON} amoureux !",
		end: "  {POKEMON} sort de l’état « Attraction » !",
		endFromItem: "  {ITEM:definite:capitalize:classified} {POKEMON:de} le {INFLECT:ITEM:s=sort:p=sortent} de l’état « Attraction » !",
		activate: "  {POKEMON} subit l’état « Attraction » infligé par {TARGET} !",
		cant: "L’état « Attraction » empêche {POKEMON} d’utiliser sa capacité !",
	},
	aurasphere: {
		name: "Aurasphère",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	aurawheel: {
		name: "Roue Libre",
		// Official flavor text: "Morpeko libère l’énergie stockée dans ses joues pour attaquer et augmenter sa Vitesse. Le type de cette capacité change en fonction de la forme de Morpeko."
		desc: "A 100 % de chances de monter la Vitesse de l'utilisateur d'un niveau. Si l'utilisateur est un Morpeko sous son Motif Rassasié, cette capacité est de type Électrik. S'il est sous son Motif Affamé, elle est de type Ténèbres. Cette capacité ne peut être utilisée avec succès que si la forme actuelle de l'utilisateur, en tenant compte de Morphing, est un Morpeko sous Motif Rassasié ou Affamé.", // NEEDS QC
		shortDesc: "Rassasié : Électrik ; Affamé : Ténèbres. 100 % +1 Vit.", // NEEDS QC
	},
	aurorabeam: {
		name: "Onde Boréale",
		// Official flavor text: "Envoie un rayon arc-en-ciel sur l’ennemi. Peut aussi baisser son Attaque."
		desc: "A 10 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		gen1: {
			desc: "A 33 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
			shortDesc: "33 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		},
	},
	auroraveil: {
		name: "Voile Aurore",
		// Official flavor text: "Réduit les dégâts causés par les capacités physiques et spéciales durant cinq tours. Ne peut être utilisée que lorsqu’il grêle."
		desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 0,5x les dégâts des attaques physiques et spéciales, ou 0,66x en Combat Duo ; ne réduit pas davantage les dégâts avec Protection ou Mur Lumière. Les coups critiques ignorent cette protection. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique, Psycho-Croc ou Anti-Brume. Casse-Brique et Psycho-Croc retirent l'effet avant le calcul des dégâts. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue s'il ne neige pas.", // NEEDS QC
		shortDesc: "5 tours : dégâts sur l'équipe réduits de moitié. Neige.", // NEEDS QC
		gen8: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 0,5x les dégâts des attaques physiques et spéciales, ou 0,66x en Combat Duo ; ne réduit pas davantage les dégâts avec Protection ou Mur Lumière. Les coups critiques ignorent cette protection. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique, Psycho-Croc ou Anti-Brume. Casse-Brique et Psycho-Croc retirent l'effet avant le calcul des dégâts. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue s'il ne grêle pas.", // NEEDS QC
			shortDesc: "5 tours : l'équipe subit moitié moins. Grêle.", // NEEDS QC
		},

		start: "  Voile Aurore augmente la résistance de {TEAM} aux capacités physiques et spéciales !",
		end: "  Voile Aurore n’a plus d’effet sur {TEAM} !",
	},
	autotomize: {
		name: "Allègement",
		// Official flavor text: "Le lanceur se débarrasse des parties inutiles de son corps. Son poids diminue et sa Vitesse augmente beaucoup."
		desc: "Monte la Vitesse de l'utilisateur de 2 niveaux. Si la Vitesse de l'utilisateur a changé, son poids est réduit de 100 kg tant qu'il reste au combat. Cet effet est cumulable, mais ne peut pas réduire le poids de l'utilisateur sous 0,1 kg.", // NEEDS QC
		shortDesc: "+2 Vitesse ; le lanceur perd 100 kg.", // NEEDS QC

		start: "  {POKEMON} est devenu très vif !",
	},
	avalanche: {
		name: "Avalanche",
		// Official flavor text: "Une attaque deux fois plus puissante si le lanceur a été blessé par l’ennemi durant le tour."
		desc: "La puissance est doublée si l'utilisateur a été touché par la cible ce tour.", // NEEDS QC
		shortDesc: "Puissance doublée si la cible a blessé le lanceur.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si l'utilisateur a été touché par un Pokémon à la position de la cible ce tour.", // NEEDS QC
		},
	},
	axekick: {
		name: "Talon-Marteau",
		// Official flavor text: "Le lanceur donne un coup de talon descendant à la cible, ce qui peut aussi la rendre confuse. S'il échoue, le lanceur se blesse."
		desc: "A 30 % de chances de rendre la cible confuse. Si cette attaque échoue, l'utilisateur perd la moitié de ses PV max, arrondi à l'inférieur, en dégâts d'échec. Les Pokémon ayant le talent Garde Magik ne subissent pas les dégâts d'échec.", // NEEDS QC
		shortDesc: "30 % de confusion. Rate : perd la moitié de ses PV.", // NEEDS QC

		damage: "#crash",
	},
	babydolleyes: {
		name: "Regard Touchant",
		// Official flavor text: "Fixe l’ennemi d’un air très attendrissant qui le touche et diminue son Attaque. Agit en priorité."
		desc: "Baisse l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	baddybad: {
		name: "Évo-Ténébro",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette capacité invoque Protection pendant 5 tours.", // NEEDS QC
		shortDesc: "Invoque Protection pendant 5 tours.", // NEEDS QC
	},
	banefulbunker: {
		name: "Blockhaus",
		// Official flavor text: "Protège le lanceur contre les attaques de l’ennemi et empoisonne ce dernier s’il utilise une attaque directe sur le lanceur."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui le touchent avec une capacité directe sont empoisonnés. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège des capacités. Contact : empoisonne.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui le touchent avec une capacité directe sont empoisonnés. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui le touchent avec une capacité directe sont empoisonnés. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
	},
	barbbarrage: {
		name: "Multitoxik",
		// Official flavor text: "Une multitude de pointes toxiques frappent la cible et peuvent l'empoisonner. La puissance est doublée si celle-ci est déjà empoisonnée."
		desc: "A 50 % de chances d'empoisonner la cible. La puissance est doublée si la cible est déjà empoisonnée.", // NEEDS QC
		shortDesc: "50 % de psn. Puissance x2 si la cible est empoisonnée.", // NEEDS QC
	},
	barrage: {
		name: "Pilonnage",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour chaque coup. Si un des coups brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	barrier: {
		name: "Bouclier",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Monte la Défense de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur de 2 niveaux.", // NEEDS QC
	},
	batonpass: {
		name: "Relais",
		// Official flavor text: "Le lanceur échange sa place et tout changement de stat avec un Pokémon de l’équipe."
		desc: "L'utilisateur est remplacé par un autre Pokémon de son équipe. Le Pokémon choisi hérite des changements de niveaux de statistiques de l'utilisateur, ainsi que des effets de la confusion, de Anneau Hydro, Malédiction, Cri Draconique, Embargo, Puissance, Suc Digestif, Anti-Soin, Racines, Vampigraine, Verrouillage, Vol Magnétik, Requiem, Astuce Force et Lévikinésie (et Lire-Esprit), et d'un clone avec ses PV restants. L'effet d'Suc Digestif n'est pas transmis si le remplaçant a un talent qui ne peut pas être affecté.", // NEEDS QC
		shortDesc: "Le lanceur se retire en léguant ses changements.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur est remplacé par un autre Pokémon de son équipe. Le Pokémon choisi hérite des changements de niveaux de statistiques de l'utilisateur, ainsi que des effets de la confusion, de Anneau Hydro, Malédiction, Embargo, Puissance, Suc Digestif, Anti-Soin, Racines, Vampigraine, Verrouillage (et Lire-Esprit), Vol Magnétik, Requiem, Astuce Force et Lévikinésie, et d'un clone avec ses PV restants. L'effet de Suc Digestif n'est pas transmis si le remplaçant a un talent qui ne peut pas être affecté.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur est remplacé par un autre Pokémon de son équipe. Le Pokémon choisi hérite des changements de niveaux de statistiques de l'utilisateur, ainsi que des effets de la confusion, de Anneau Hydro, Malédiction, Embargo, Puissance, Suc Digestif, Anti-Soin, Racines, Vampigraine, Verrouillage (et Lire-Esprit), Vol Magnétik, Requiem, Astuce Force et Lévikinésie, ainsi que du fait d'être piégé par Regard Noir (Barrage, Toile), et d'un clone avec ses PV restants. L'effet de Suc Digestif n'est pas transmis si le remplaçant a un talent qui ne peut pas être affecté. L'effet de Lévikinésie n'est pas transmis si le remplaçant est Méga-Ectoplasma.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur est remplacé par un autre Pokémon de son équipe. Le Pokémon choisi hérite des changements de niveaux de statistiques de l'utilisateur, ainsi que des effets de la confusion, de Anneau Hydro, Malédiction, Embargo, Puissance, Suc Digestif, Anti-Soin, Racines, Vampigraine, Verrouillage (et Lire-Esprit), Vol Magnétik, Requiem, Astuce Force et Lévikinésie, ainsi que du fait d'être piégé par Regard Noir (Barrage, Toile), et d'un clone avec ses PV restants.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur est remplacé par un autre Pokémon de son équipe. Le Pokémon choisi hérite des changements de niveaux de statistiques de l'utilisateur, ainsi que des effets de la confusion, de Anneau Hydro, Malédiction, Embargo, Puissance, Suc Digestif, Anti-Soin, Racines, Vampigraine, Verrouillage (et Lire-Esprit), Vol Magnétik, Lance-Boue, Requiem, Astuce Force et Tourniquet, ainsi que du fait de piéger ou d'être piégé par Regard Noir (Barrage, Toile), et d'un clone avec ses PV restants.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur est remplacé par un autre Pokémon de son équipe. Le Pokémon choisi hérite des changements de niveaux de statistiques de l'utilisateur, ainsi que des effets de la confusion, de Malédiction, Puissance, Racines, Vampigraine, Verrouillage (et Lire-Esprit), Lance-Boue, Requiem et Tourniquet, ainsi que du fait de piéger ou d'être piégé par Regard Noir (Barrage, Toile), et d'un clone avec ses PV restants.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur est remplacé par un autre Pokémon de son équipe. Le Pokémon choisi hérite des changements de niveaux de statistiques de l'utilisateur, ainsi que des effets de la confusion, de Malédiction, Boul’Armure, Puissance, Clairvoyance, Vampigraine, Verrouillage (et Lire-Esprit), Lilliput, Brume et Requiem, ainsi que du fait de piéger ou d'être piégé par Regard Noir (Toile), et d'un clone avec ses PV restants.", // NEEDS QC
		},
	},
	beakblast: {
		name: "Bec-Canon",
		// Official flavor text: "Le lanceur fait chauffer son bec avant d’attaquer. S’il subit une attaque directe pendant la montée en température, l’attaquant sera brûlé."
		desc: "Si l'utilisateur est touché par une capacité directe ce tour avant de pouvoir exécuter cette capacité, l'attaquant est brûlé.", // NEEDS QC
		shortDesc: "Brûle au contact avant que le lanceur n'agisse.", // NEEDS QC

		start: "  {POKEMON} fait chauffer son bec !",
	},
	beatup: {
		name: "Baston",
		// Official flavor text: "Le lanceur appelle tous les Pokémon de son équipe à attaquer. Plus ils sont nombreux, plus il y a d’attaques."
		desc: "Frappe une fois pour l'utilisateur et une fois pour chaque Pokémon de son équipe non K.O. et sans problème de statut. La puissance de chaque coup est égale à 5 + (X/10), où X est l'Attaque de base du Pokémon participant ; chaque coup est considéré comme venant de l'utilisateur.", // NEEDS QC
		shortDesc: "Tous les alliés en forme frappent la cible.", // NEEDS QC
		gen4: {
			desc: "Inflige des dégâts sans type. Frappe une fois pour l'utilisateur et une fois pour chaque Pokémon de son équipe non K.O. et sans problème de statut. Pour chaque coup, la formule de dégâts utilise l'Attaque de base du Pokémon participant comme Attaque et la Défense de base de la cible comme Défense, et ignore les changements de niveaux et les autres effets modifiant l'Attaque ou la Défense ; chaque coup est considéré comme venant de l'utilisateur.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige des dégâts sans type. Frappe une fois pour chaque Pokémon de l'équipe non K.O. et sans problème de statut, ou échoue si aucun Pokémon ne remplit les conditions. Pour chaque coup, la formule de dégâts utilise l'Attaque de base du Pokémon participant comme Attaque et la Défense de base de la cible comme Défense, et ignore les changements de niveaux et les autres effets modifiant l'Attaque ou la Défense ; chaque coup est considéré comme venant de l'utilisateur.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige des dégâts sans type. Frappe une fois pour chaque Pokémon de l'équipe non K.O. et sans problème de statut. Pour chaque coup, la formule de dégâts utilise le niveau du Pokémon participant, son Attaque de base comme Attaque et la Défense de base de la cible comme Défense, et ignore les changements de niveaux et les autres effets modifiant l'Attaque ou la Défense. Échoue si aucun membre de l'équipe ne peut participer.", // NEEDS QC
		},

		activate: "  Attaque de {NAME}!",
	},
	behemothbash: {
		name: "Aegis Maxima",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		gen8: {
			shortDesc: "Dégâts doublés contre les cibles dynamaxées.", // NEEDS QC
		},
	},
	behemothblade: {
		name: "Gladius Maximus",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		gen8: {
			shortDesc: "Dégâts doublés contre les cibles dynamaxées.", // NEEDS QC
		},
	},
	belch: {
		name: "Éructation",
		// Official flavor text: "Le lanceur se tourne vers l’ennemi et lui éructe dessus, infligeant des dégâts. Ne fonctionne que si le lanceur consomme la Baie qu’il tient."
		desc: "Cette capacité ne peut pas être sélectionnée tant que l'utilisateur n'a pas mangé de Baie, que ce soit en mangeant celle qu'il tenait, en volant et mangeant celle d'un autre Pokémon avec Piqûre ou Picore, ou en mangeant celle qu'on lui a lancée avec Dégommage. Une fois la condition remplie, cette capacité peut être sélectionnée et utilisée pour le reste du combat, même si l'utilisateur obtient ou utilise un autre objet, ou quitte le combat. Consommer une Baie avec Don Naturel ne compte pas.", // NEEDS QC
		shortDesc: "Utilisable seulement si le lanceur a mangé une Baie.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	bellydrum: {
		name: "Cognobidon",
		// Official flavor text: "Améliore l’Attaque au maximum en sacrifiant la moitié des PV max."
		desc: "Monte l'Attaque de l'utilisateur de 12 niveaux en échange de la moitié de ses PV max, arrondi à l'inférieur. Échoue si l'utilisateur serait mis K.O. ou si son niveau d'Attaque est déjà à 6.", // NEEDS QC
		shortDesc: "Perd la moitié de ses PV max. Attaque maximisée.", // NEEDS QC
		gen2: {
			desc: "L'utilisateur perd la moitié de ses PV max, arrondi à l'inférieur, sauf s'il serait mis K.O. ou si son Attaque est déjà au niveau 6. Si l'utilisateur n'avait pas assez de PV, son Attaque monte de 2 niveaux. Sinon, tant que son niveau d'Attaque est inférieur à 6, il monte de 2, et si sa statistique d'Attaque avant cette étape était de 999, le niveau baisse de 1 et la boucle s'arrête.", // NEEDS QC
		},

		boost: "  {POKEMON} sacrifie des PV et monte son Attaque au maximum !",
	},
	bestow: {
		name: "Passe-Cadeau",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La cible reçoit l'objet tenu par l'utilisateur. Échoue si l'utilisateur n'a pas d'objet ou tient un Cristal Z, si la cible tient déjà un objet, si l'objet est une Méga-Gemme et que l'utilisateur ou la cible est l'espèce pouvant méga-évoluer avec, ou si l'objet est une Gemme Bleue, une Gemme Rouge, une Orbe Platiné, une plaque, un module ou une ROM et que l'utilisateur ou la cible est respectivement Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvallié.", // NEEDS QC
		shortDesc: "Donne l'objet tenu du lanceur à la cible.", // NEEDS QC
		gen6: {
			desc: "La cible reçoit l'objet tenu par l'utilisateur. Échoue si l'utilisateur n'a pas d'objet, si la cible tient déjà un objet, si l'objet est une Méga-Gemme et que l'utilisateur ou la cible est l'espèce pouvant méga-évoluer avec, ou si l'objet est une Gemme Bleue, une Gemme Rouge, une Orbe Platiné, une plaque ou un module et que l'utilisateur ou la cible est respectivement Kyogre, Groudon, Giratina, Arceus ou Genesect.", // NEEDS QC
		},
		gen5: {
			desc: "La cible reçoit l'objet tenu par l'utilisateur. Échoue si l'utilisateur n'a pas d'objet ou tient une Lettre, si la cible tient déjà un objet, ou si l'objet est une Orbe Platiné, une plaque ou un module et que l'utilisateur ou la cible est respectivement Giratina, Arceus ou Genesect.", // NEEDS QC
		},

		takeItem: "  {POKEMON} obtient {ITEM:definite} {SOURCE:de:definite:masculine} sauvage !",
	},
	bide: {
		name: "Patience",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "L'utilisateur reste bloqué sur cette capacité pendant deux tours, puis, au second tour, il attaque le dernier Pokémon qui l'a touché, infligeant le double des PV qu'il a perdus en dégâts d'attaques pendant ces deux tours. Si le dernier Pokémon qui l'a touché n'est plus au combat, l'utilisateur attaque un Pokémon adverse au hasard. Si l'utilisateur est empêché d'agir pendant l'utilisation, l'effet prend fin. Cette capacité ne vérifie pas la précision et ignore l'immunité de type.", // NEEDS QC
		shortDesc: "Attend 2 tours ; rend le double des dégâts subis.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux tours, puis, au second tour, il attaque le dernier Pokémon qui l'a touché, infligeant le double des PV qu'il a perdus en dégâts d'attaques pendant ces deux tours. Si le dernier Pokémon qui l'a touché n'est plus au combat, l'utilisateur attaque un Pokémon adverse au hasard. Si l'utilisateur est empêché d'agir pendant l'utilisation, l'effet prend fin. Cette capacité ne vérifie pas la précision et ignore l'immunité de type.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux tours, puis, au second tour, il attaque le dernier Pokémon qui l'a touché, infligeant le double des PV perdus pendant ces deux tours. Si le dernier Pokémon qui l'a touché n'est plus au combat, l'utilisateur attaque un Pokémon adverse au hasard. Si l'utilisateur est empêché d'agir pendant l'utilisation, l'effet prend fin. Cette capacité n'ignore pas l'immunité de type.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours, puis, au deuxième ou troisième tour, il attaque l'adversaire, infligeant le double des PV perdus pendant ces tours. Si l'utilisateur est empêché d'agir pendant l'utilisation, l'effet prend fin. Cette capacité n'ignore pas l'immunité de type.", // NEEDS QC
			shortDesc: "Attend 2-3 tours puis rend le double des dégâts.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours, puis, au deuxième ou troisième tour, il attaque l'adversaire, infligeant le double des PV perdus pendant ces tours. Cette capacité ignore l'immunité de type et ne peut pas être évitée, même si la cible utilise Tunnel ou Vol. L'utilisateur peut choisir d'être remplacé pendant l'effet. S'il est remplacé ou empêché d'agir, l'effet prend fin. Pendant l'effet, si le Pokémon adverse est remplacé ou utilise Onde Folie, Conversion, Puissance, Regard Médusant, Buée Noire, Vampigraine, Mur Lumière, Copie, Brume, Gaz Toxik, Poudre Toxik, Soin, Protection, Repos, E-Coque, Trempette, Para-Spore, Clonage, Ultrason, Téléport, Cage Éclair, Toxik ou Morphing, les dégâts subis auparavant sont ajoutés au total.", // NEEDS QC
		},

		start: "  {POKEMON} prend son mal en patience !",
		end: "  {POKEMON} perd patience et se déchaîne !",
		activate: "  {POKEMON} prend son mal en patience !",
	},
	bind: {
		name: "Étreinte",
		// Official flavor text: "Ligote l’ennemi avec les tentacules ou le corps pour l’écraser durant quatre à cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max (1/8 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours (toujours cinq si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
			shortDesc: "Piège et blesse la cible pendant 2-5 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours. Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle utilise Relais. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur utilise cette capacité pendant deux à cinq tours. A 3/8 de chances de durer deux ou trois tours et 1/8 de chances de durer quatre ou cinq tours. Les dégâts calculés au premier tour sont repris pour chaque autre tour. L'utilisateur ne peut pas choisir de capacité et la cible ne peut pas exécuter de capacité pendant l'effet, mais tous deux peuvent être remplacés. Si l'utilisateur est remplacé, la cible reste incapable d'agir ce tour-là. Si la cible est remplacée, l'utilisateur utilise à nouveau cette capacité automatiquement, et si elle avait 0 PP à ce moment, ils passent à 63. Si l'utilisateur ou la cible est remplacé, ou si l'utilisateur est empêché d'agir, l'effet prend fin. Cette capacité peut empêcher la cible d'agir même si elle a une immunité de type, mais n'inflige alors pas de dégâts.", // NEEDS QC
			shortDesc: "La cible ne peut pas agir pendant 2-5 tours.", // NEEDS QC
		},

		start: "  {POKEMON} est pris dans l’étreinte {SOURCE:de} !",
		move: "#wrap",
	},
	bite: {
		name: "Morsure",
		// Official flavor text: "L’ennemi est mordu par de tranchantes canines. Peut l’apeurer."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		gen1: {
			desc: "A 10 % de chances d'apeurer la cible.", // NEEDS QC
			shortDesc: "10 % d'apeurer la cible.", // NEEDS QC
		},
	},
	bitterblade: {
		name: "Lame en Peine",
		// Official flavor text: "Le lanceur concentre son amertume du monde des vivants dans la pointe de ses épées et tranche la cible. La moitié des dégâts infligés sont convertis en PV pour le lanceur."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
	},
	bittermalice: {
		name: "Cœur de Rancœur",
		// Official flavor text: "Une rancœur glaciale frappe la cible et baisse son Attaque."
		desc: "A 100 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	blackholeeclipse: {
		name: "Trou Noir des Ombres",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	blastburn: {
		name: "Rafale Feu",
		// Official flavor text: "Une explosion ardente souffle l’adversaire. Le lanceur doit se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	blazekick: {
		name: "Pied Brûleur",
		// Official flavor text: "Le lanceur envoie un coup de pied au taux de critiques élevé. Peut aussi brûler la cible."
		desc: "A 10 % de chances de brûler la cible et plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé. 10 % de brûler.", // NEEDS QC
	},
	blazingtorque: {
		name: "Crash Brûlant",
		desc: "A 30 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "30 % de brûler la cible.", // NEEDS QC
	},
	bleakwindstorm: {
		name: "Typhon Hivernal",
		// Official flavor text: "Le lanceur déclenche un typhon froid et brutal qui fait trembler le cœur et le corps de la cible, ce qui peut aussi baisser sa Vitesse."
		desc: "A 30 % de chances de baisser la Vitesse de la cible d'un niveau. Si la météo est Pluie battante ou Pluie, cette capacité ne vérifie pas la précision. Si elle est utilisée contre un Pokémon tenant un Parapluie Solide, sa précision reste à 80 %.", // NEEDS QC
		shortDesc: "30 % de -1 Vit. des ennemis. Ne rate pas sous la pluie.", // NEEDS QC
	},
	blizzard: {
		name: "Blizzard",
		// Official flavor text: "Une violente tempête de neige s’abat sur l’ennemi. Peut aussi le geler."
		desc: "A 10 % de chances de geler la cible. S'il neige, cette capacité ne vérifie pas la précision.", // NEEDS QC
		shortDesc: "10 % de geler les ennemis. Ne rate pas s'il neige.", // NEEDS QC
		gen8: {
			desc: "A 10 % de chances de geler la cible. S'il grêle, cette capacité ne vérifie pas la précision.", // NEEDS QC
			shortDesc: "10 % de geler les ennemis. Ne rate pas s'il grêle.", // NEEDS QC
		},
		gen3: {
			desc: "A 10 % de chances de geler la cible.", // NEEDS QC
			shortDesc: "10 % de chances de geler les ennemis.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10 % de geler la cible.", // NEEDS QC
		},
	},
	block: {
		name: "Barrage",
		// Official flavor text: "Le lanceur bloque la route de l’ennemi pour empêcher sa fuite."
		desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Empêche la cible de quitter le combat.", // NEEDS QC
		gen7: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain, sauf s'il utilise Relais, auquel cas la cible reste piégée.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle utilise Relais. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain, sauf s'il utilise Relais, auquel cas la cible reste piégée.", // NEEDS QC
		},
	},
	bloodmoon: {
		name: "Lune Rouge",
		shortDesc: "Ne peut pas être choisie deux tours de suite.", // NEEDS QC
	},
	bloomdoom: {
		name: "Pétalexplosion Éblouissante",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	blueflare: {
		name: "Flamme Bleue",
		// Official flavor text: "De magnifiques et redoutables flammes bleues fondent sur l’ennemi. Peut aussi le brûler."
		desc: "A 20 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "20 % de brûler la cible.", // NEEDS QC
	},
	bodypress: {
		name: "Big Splash",
		// Official flavor text: "Le lanceur utilise son corps pour attaquer sa cible. Plus la Défense du lanceur est élevée, plus les dégâts infligés sont importants."
		desc: "Les dégâts sont calculés en utilisant la Défense de l'utilisateur à la place de son Attaque, changements de niveaux compris. Les autres effets qui modifient l'Attaque s'appliquent normalement.", // NEEDS QC
		shortDesc: "Attaque avec sa Défense au lieu de son Attaque.", // NEEDS QC
	},
	bodyslam: {
		name: "Plaquage",
		// Official flavor text: "Le lanceur se laisse tomber sur l’ennemi de tout son poids. Peut aussi le paralyser."
		desc: "A 30 % de chances de paralyser la cible. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "30 % de paralyser la cible.", // NEEDS QC
		gen5: {
			desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		},
	},
	boltbeak: {
		name: "Prise de Bec",
		// Official flavor text: "Le lanceur transperce sa cible avec son bec chargé d’électricité. Si cette attaque est lancée avant que la cible n’attaque, elle infligera deux fois plus de dégâts."
		desc: "La puissance est doublée si l'utilisateur agit avant la cible.", // NEEDS QC
		shortDesc: "Puissance doublée si le lanceur agit avant la cible.", // NEEDS QC
	},
	boltstrike: {
		name: "Charge Foudre",
		// Official flavor text: "Le lanceur s’enveloppe d’une charge électrique surpuissante et se jette sur l’ennemi. Peut aussi le paralyser."
		desc: "A 20 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "20 % de paralyser la cible.", // NEEDS QC
	},
	boneclub: {
		name: "Massd’Os",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 10 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "10 % d'apeurer la cible.", // NEEDS QC
	},
	bonemerang: {
		name: "Osmerang",
		// Official flavor text: "Le lanceur projette son os comme un boomerang. Cette attaque frappe à l’aller et au retour."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois en un tour.", // NEEDS QC
		gen4: {
			desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	bonerush: {
		name: "Charge Os",
		// Official flavor text: "Le lanceur frappe l’ennemi avec un os de deux à cinq fois d’affilée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
	},
	boomburst: {
		name: "Bang Sonique",
		// Official flavor text: "Attaque les Pokémon alentour grâce à une onde sonore assourdissante qui détruit tout sur son passage."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les Pokémon adjacents.", // NEEDS QC
	},
	bounce: {
		name: "Rebond",
		// Official flavor text: "Le lanceur bondit très haut et plonge sur l’ennemi au second tour. Peut aussi le paralyser."
		desc: "A 30 % de chances de paralyser la cible. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Vent Violent, Stratopercut, Anti-Air, Myria-Flèches, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Bondit, frappe au tour 2. 30 % de paralysie.", // NEEDS QC
		gen5: {
			desc: "A 30 % de chances de paralyser la cible. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Vent Violent, Stratopercut, Anti-Air, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen4: {
			desc: "A 30 % de chances de paralyser la cible. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Stratopercut, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen3: {
			desc: "A 30 % de chances de paralyser la cible. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Stratopercut, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui.", // NEEDS QC
		},

		prepare: "{POKEMON} se propulse dans les airs !",
	},
	bouncybubble: {
		name: "Évo-Thalasso",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
	},
	branchpoke: {
		name: "Tapotige",
		// Official flavor text: "Le lanceur attaque sa cible en la piquant avec une branche pointue."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	bravebird: {
		name: "Rapace",
		// Official flavor text: "Le lanceur replie ses ailes et charge en rase-mottes. Blesse gravement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 33 % des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 33 % des dégâts.", // NEEDS QC
		gen4: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/3 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
			shortDesc: "A 1/3 de contrecoup.", // NEEDS QC
		},
	},
	breakingswipe: {
		name: "Abattage",
		// Official flavor text: "Le lanceur balaie violemment le camp adverse avec son immense queue. Baisse l’Attaque de la cible."
		desc: "A 100 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Attaque des ennemis d'un niveau.", // NEEDS QC
	},
	breakneckblitz: {
		name: "Turbo-Charge Bulldozer",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	brickbreak: {
		name: "Casse-Brique",
		// Official flavor text: "Le lanceur attaque avec le tranchant de la main. Permet aussi de briser les barrières comme Mur Lumière et Protection."
		desc: "Si cette attaque ne rate pas, les effets de Protection, Mur Lumière et Voile Aurore prennent fin du côté de la cible avant le calcul des dégâts.", // NEEDS QC
		shortDesc: "Détruit les murs, sauf si la cible est immunisée.", // NEEDS QC
		gen6: {
			desc: "Si cette attaque ne rate pas, les effets de Protection et Mur Lumière prennent fin du côté de la cible avant le calcul des dégâts.", // NEEDS QC
		},
		gen4: {
			desc: "Si cette attaque ne rate pas, et que la cible soit immunisée ou non, les effets de Protection et Mur Lumière prennent fin du côté de la cible avant le calcul des dégâts.", // NEEDS QC
			shortDesc: "Détruit les écrans, même si la cible est immunisée.", // NEEDS QC
		},
		gen3: {
			desc: "Si cette attaque ne rate pas, et que la cible soit immunisée ou non, les effets de Protection et Mur Lumière prennent fin du côté adverse avant le calcul des dégâts.", // NEEDS QC
		},

		activate: "  {POKEMON} brise les protections de {TEAM} !", // NEEDS QC
	},
	brine: {
		name: "Saumure",
		// Official flavor text: "Cette attaque est deux fois plus puissante lorsque l’ennemi a moins de la moitié de ses PV."
		desc: "La puissance est doublée si la cible a la moitié ou moins de ses PV max.", // NEEDS QC
		shortDesc: "Puissance doublée si la cible est à moitié PV ou moins.", // NEEDS QC
	},
	brutalswing: {
		name: "Centrifugifle",
		// Official flavor text: "Le lanceur pivote pour prendre de l’élan et infliger des dégâts."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les Pokémon adjacents.", // NEEDS QC
	},
	bubble: {
		name: "Écume",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 10 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Vitesse des ennemis d'un niveau.", // NEEDS QC
		gen1: {
			desc: "A 33 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
			shortDesc: "33 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		},
	},
	bubblebeam: {
		name: "Bulles d’O",
		// Official flavor text: "Des bulles sont envoyées avec puissance sur l’ennemi. Peut aussi baisser sa Vitesse."
		desc: "A 10 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		gen1: {
			desc: "A 33 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
			shortDesc: "33 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		},
	},
	bugbite: {
		name: "Piqûre",
		// Official flavor text: "Le lanceur pique l’ennemi. Si ce dernier tient une Baie, le lanceur la dévore et obtient son effet."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il vole la Baie tenue par la cible et la mange immédiatement, obtenant ses effets même si son propre objet est ignoré. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		shortDesc: "Vole et mange la Baie de la cible.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur vole la Baie tenue par la cible et la mange immédiatement, obtenant ses effets sauf si son propre objet est ignoré. Les objets perdus à cause de cette capacité peuvent être récupérés avec Recyclage.", // NEEDS QC
		},

		removeItem: "  {SOURCE} vole et mange {ITEM:definite:classified} de la cible !",
	},
	bugbuzz: {
		name: "Bourdon",
		// Official flavor text: "Le lanceur fait vibrer son corps pour lancer une vague sonique. Peut aussi baisser la Défense Spéciale de l’ennemi."
		desc: "A 10 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	bulkup: {
		name: "Gonflette",
		// Official flavor text: "Le lanceur tend ses muscles pour se gonfler, ce qui booste son Attaque et sa Défense."
		desc: "Monte l'Attaque et la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'Attaque et la Défense du lanceur d'un niveau.", // NEEDS QC
	},
	bulldoze: {
		name: "Piétisol",
		// Official flavor text: "Le lanceur piétine le sol et inflige des dégâts à tous les Pokémon autour de lui. Baisse aussi leur Vitesse."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de -1 Vitesse des Pokémon adjacents.", // NEEDS QC
	},
	bulletpunch: {
		name: "Pisto-Poing",
		// Official flavor text: "Le lanceur envoie des coups de poing aussi rapides que des balles de revolver. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	bulletseed: {
		name: "Balle Graine",
		// Official flavor text: "Le lanceur mitraille l’ennemi avec une rafale de graines. De deux à cinq rafales sont lancées à la suite."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
	},
	burningbulwark: {
		name: "Rempart Brûlant",
		// Official flavor text: "Le lanceur se protège contre les attaques grâce à son pelage incandescent, et si un assaillant utilise une attaque directe contre lui, il le brûle."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe sont brûlés. Les capacités sans dégâts passent outre cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège des attaques. Contact : brûle.", // NEEDS QC
	},
	burningjealousy: {
		name: "Feu Envieux",
		// Official flavor text: "Le lanceur attaque sa cible avec toute sa jalousie. Cette capacité brûle tout Pokémon dont les stats ont augmenté pendant ce tour."
		desc: "A 100 % de chances de brûler la cible si ses niveaux de statistiques ont monté ce tour.", // NEEDS QC
		shortDesc: "100 % de brûler si la cible a monté une stat ce tour.", // NEEDS QC
	},
	burnup: {
		name: "Flamme Ultime",
		// Official flavor text: "Le Pokémon se consume et les flammes de son corps infligent des dégâts élevés à la cible. Le lanceur perd le type Feu."
		desc: "Échoue si l'utilisateur n'est pas de type Feu. Si cette capacité réussit et que l'utilisateur n'est pas téracristallisé, son type Feu disparaît tant qu'il reste au combat.", // NEEDS QC
		shortDesc: "Le lanceur perd son type Feu ; doit être de type Feu.", // NEEDS QC
		gen8: {
			desc: "Échoue si l'utilisateur n'est pas de type Feu. Si cette capacité réussit, l'utilisateur perd son type Feu tant qu'il reste au combat.", // NEEDS QC
		},

		typeChange: "  Le feu intérieur {POKEMON:de} s’est entièrement consumé !",
	},
	buzzybuzz: {
		name: "Évo-Dynamo",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 100 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "100 % de paralyser la cible.", // NEEDS QC
	},
	calmmind: {
		name: "Plénitude",
		// Official flavor text: "Le lanceur se concentre et fait le vide dans son esprit pour augmenter son Attaque Spéciale et sa Défense Spéciale."
		desc: "Monte l'Attaque Spéciale et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'Atq. Spé et la Déf. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	camouflage: {
		name: "Camouflage",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Le type de l'utilisateur change selon le terrain du combat : type Normal sur le terrain standard, type Électrik sur un Champ Électrifié, type Fée sur un Champ Brumeux, type Plante sur un Champ Herbu et type Psy sur un Champ Psychique. Échoue si le type de l'utilisateur ne peut pas être changé ou s'il est déjà purement de ce type.", // NEEDS QC
		shortDesc: "Type du lanceur selon le terrain (Normal par défaut).", // NEEDS QC
		gen6: {
			desc: "Le type de l'utilisateur change selon le terrain du combat : type Normal sur le terrain standard, type Électrik sur un Champ Électrifié, type Fée sur un Champ Brumeux et type Plante sur un Champ Herbu. Échoue si le type de l'utilisateur ne peut pas être changé ou s'il est déjà purement de ce type.", // NEEDS QC
		},
		gen5: {
			desc: "Le type de l'utilisateur change selon le terrain du combat : type Sol sur le terrain standard. Échoue si le type de l'utilisateur ne peut pas être changé ou s'il est déjà purement de ce type.", // NEEDS QC
			shortDesc: "Change de type selon le terrain. (Sol)", // NEEDS QC
		},
		gen4: {
			desc: "Le type de l'utilisateur change selon le terrain du combat : type Normal sur le terrain standard. Échoue si l'utilisateur a le talent Multi-Type ou si ce type est déjà l'un de ses types actuels.", // NEEDS QC
			shortDesc: "Change de type selon le terrain. (Normal)", // NEEDS QC
		},
		gen3: {
			desc: "Le type de l'utilisateur change selon le terrain du combat : type Normal sur le terrain standard. Échoue si ce type est déjà l'un des types actuels de l'utilisateur.", // NEEDS QC
		},
	},
	captivate: {
		name: "Séduction",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Baisse l'Attaque Spéciale de la cible de 2 niveaux. La cible n'est pas affectée si elle est du même sexe que l'utilisateur, ou si l'un des deux n'a pas de sexe. Les Pokémon ayant le talent Benêt sont immunisés.", // NEEDS QC
		shortDesc: "-2 Atq. Spé des ennemis de sexe opposé.", // NEEDS QC
	},
	catastropika: {
		name: "Pikachute Foudroyante",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	ceaselessedge: {
		name: "Vagues à Lames",
		// Official flavor text: "Des lames de coquillages entaillent la cible en visant ses points faibles. Les débris de coquillage se répandent sous la forme de picots aux pieds de la cible."
		desc: "Si cette capacité réussit, elle pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Un maximum de trois couches peut être posé : les adversaires perdent 1/8 de leurs PV max avec une couche, 1/6 avec deux couches et 1/4 avec trois couches, arrondi à l'inférieur. Peut être retiré du côté adverse si un Pokémon utilise Grand Nettoyage, ou si un Pokémon adverse utilise Toupie Éclat, Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		shortDesc: "Pose une couche de Picots du côté adverse.", // NEEDS QC
	},
	celebrate: {
		name: "Célébration",
		shortDesc: "Aucune utilité en combat.", // NEEDS QC

		activate: "  Félicitations, {TRAINER} !",
	},
	charge: {
		name: "Chargeur",
		// Official flavor text: "Le lanceur concentre sa puissance pour sa prochaine attaque Électrik. Augmente sa Défense Spéciale."
		desc: "Monte la Défense Spéciale de l'utilisateur d'un niveau. La prochaine attaque de type Électrik de l'utilisateur aura sa puissance doublée ; l'effet prend fin quand l'utilisateur quitte le combat, ou après qu'il a essayé d'utiliser une capacité de type Électrik autre que Chargeur, même sans succès.", // NEEDS QC
		shortDesc: "+1 Déf. Spé ; sa prochaine capacité Électrik x2.", // NEEDS QC
		gen8: {
			desc: "Monte la Défense Spéciale de l'utilisateur d'un niveau. Si l'utilisateur utilise une attaque de type Électrik au tour suivant, sa puissance sera doublée.", // NEEDS QC
			shortDesc: "+1 Déf. Spé. Prochaine attaque Électrik : x2.", // NEEDS QC
		},
		gen3: {
			desc: "Si l'utilisateur utilise une attaque de type Électrik au tour suivant, sa puissance sera doublée.", // NEEDS QC
			shortDesc: "La prochaine attaque Électrik a sa puissance x2.", // NEEDS QC
		},

		start: "  {POKEMON} se charge en électricité !",
	},
	chargebeam: {
		name: "Rayon Chargé",
		// Official flavor text: "Le lanceur tire un rayon chargé d’électricité. Peut aussi augmenter son Attaque Spéciale."
		desc: "A 70 % de chances de monter l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "70 % de monter l'Atq. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	charm: {
		name: "Charme",
		// Official flavor text: "Le lanceur fait les yeux doux pour berner l’ennemi et beaucoup réduire son Attaque."
		desc: "Baisse l'Attaque de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Attaque de la cible de 2 niveaux.", // NEEDS QC
	},
	chatter: {
		name: "Babil",
		// Official flavor text: "Attaque avec les ondes sonores assourdissantes qu’il émet en bavardant. Rend l’ennemi confus."
		desc: "A 100 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "100 % de rendre la cible confuse.", // NEEDS QC
		gen5: {
			desc: "A X % de chances de rendre la cible confuse, où X vaut 0 sauf si l'utilisateur est un Pijako non transformé. Si l'utilisateur est un Pijako, X vaut 0 ou 10 selon le volume du cri enregistré : 0 pour un volume faible ou aucun enregistrement, 10 pour un volume moyen à élevé.", // NEEDS QC
			shortDesc: "Pour Pijako : 10 % de rendre confus.", // NEEDS QC
		},
		gen4: {
			desc: "A X % de chances de rendre la cible confuse, où X vaut 0 sauf si l'utilisateur est un Pijako non transformé. Si l'utilisateur est un Pijako, X vaut 1, 11 ou 31 selon le volume du cri enregistré : 1 sans enregistrement ou à faible volume, 11 à volume moyen et 31 à volume élevé.", // NEEDS QC
			shortDesc: "Pour Pijako : 31 % de rendre confus.", // NEEDS QC
		},
	},
	chillingwater: {
		name: "Douche Froide",
		// Official flavor text: "Le lanceur attaque la cible en l'arrosant d'une eau si froide qu'elle détériore son esprit combatif. Baisse l'Attaque de la cible."
		desc: "A 100 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	chillyreception: {
		name: "Neigeux de Mots",
		// Official flavor text: "Le lanceur fait un si mauvais jeu de mots qu'il jette un froid et échange sa place avec un Pokémon de l'équipe prêt à combattre. La neige tombe pendant cinq tours."
		desc: "Pendant 5 tours, il neige. L'utilisateur quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O.", // NEEDS QC
		shortDesc: "Invoque la neige et le lanceur se retire.", // NEEDS QC

		prepare: "  {POKEMON} s’apprête à faire un mauvais jeu de mots...",
	},
	chipaway: {
		name: "Attrition",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Ignore les changements de niveaux de statistiques de la cible, esquive comprise.", // NEEDS QC
		shortDesc: "Ignore les changements de stats de la cible.", // NEEDS QC
	},
	chloroblast: {
		name: "Herblast",
		// Official flavor text: "Le lanceur tire un concentré de sa propre chlorophylle sur la cible, ce qui le blesse également."
		desc: "Si cette capacité réussit, l'utilisateur perd la moitié de ses PV max, arrondi au supérieur, sauf s'il a le talent Garde Magik ou Tête de Roc.", // NEEDS QC
		shortDesc: "Le lanceur perd la moitié de ses PV max.", // NEEDS QC
	},
	circlethrow: {
		name: "Projection",
		// Official flavor text: "Projette le Pokémon ennemi et le remplace par un autre. Lors d’un combat contre un Pokémon sauvage seul, met fin au combat."
		desc: "Si ni l'utilisateur ni la cible ne sont K.O., la cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Cet effet échoue si la cible est sous l'effet de Racines, a le talent Ventouse, ou si cette capacité a touché un clone.", // NEEDS QC
		shortDesc: "La cible est remplacée par un allié au hasard.", // NEEDS QC
	},
	clamp: {
		name: "Claquoir",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max (1/8 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours (toujours cinq si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
			shortDesc: "Piège et blesse la cible pendant 2-5 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours. Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle utilise Relais. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur utilise cette capacité pendant deux à cinq tours. A 3/8 de chances de durer deux ou trois tours et 1/8 de chances de durer quatre ou cinq tours. Les dégâts calculés au premier tour sont repris pour chaque autre tour. L'utilisateur ne peut pas choisir de capacité et la cible ne peut pas exécuter de capacité pendant l'effet, mais tous deux peuvent être remplacés. Si l'utilisateur est remplacé, la cible reste incapable d'agir ce tour-là. Si la cible est remplacée, l'utilisateur utilise à nouveau cette capacité automatiquement, et si elle avait 0 PP à ce moment, ils passent à 63. Si l'utilisateur ou la cible est remplacé, ou si l'utilisateur est empêché d'agir, l'effet prend fin. Cette capacité peut empêcher la cible d'agir même si elle a une immunité de type, mais n'inflige alors pas de dégâts.", // NEEDS QC
			shortDesc: "La cible ne peut pas agir pendant 2-5 tours.", // NEEDS QC
		},

		start: "  {POKEMON} est pris dans le Claquoir {SOURCE:de} !",
		move: "#wrap",
	},
	clangingscales: {
		name: "Vibrécaille",
		// Official flavor text: "Le lanceur déclenche un vacarme en frottant ses écailles les unes contre les autres pour attaquer. Baisse la Défense du lanceur."
		desc: "Baisse la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la Défense du lanceur d'un niveau.", // NEEDS QC
	},
	clangoroussoul: {
		name: "Dracacophonie",
		// Official flavor text: "Le lanceur sacrifie une partie de ses PV pour augmenter toutes ses stats."
		desc: "Monte l'Attaque, la Défense, l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur d'un niveau en échange de 33 % de ses PV max, arrondi à l'inférieur. Échoue si l'utilisateur serait mis K.O. ou si aucun de ces niveaux ne changerait.", // NEEDS QC
		shortDesc: "Perd 1/3 de ses PV max. +1 à toutes ses stats.", // NEEDS QC
	},
	clangoroussoulblaze: {
		name: "Dracacophonie Flamboyante",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Monte l'Attaque, la Défense, l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "+1 Atq, Déf, Atq. Spé, Déf. Spé et Vit. du lanceur.", // NEEDS QC
	},
	clearsmog: {
		name: "Bain de Smog",
		shortDesc: "Remet à 0 tous les changements de stats de la cible.", // NEEDS QC
	},
	closecombat: {
		name: "Close Combat",
		// Official flavor text: "Le lanceur combat au corps à corps sans se protéger. Baisse aussi sa Défense et sa Défense Spéciale."
		desc: "Baisse la Défense et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "-1 Déf et Déf. Spé du lanceur.", // NEEDS QC
	},
	coaching: {
		name: "Coaching",
		// Official flavor text: "Le lanceur coache ses alliés, augmentant ainsi leur Attaque et leur Défense."
		desc: "Monte l'Attaque et la Défense de la cible d'un niveau. Échoue si aucun allié n'est adjacent à l'utilisateur.", // NEEDS QC
		shortDesc: "+1 Attaque et Défense d'un allié.", // NEEDS QC
	},
	coil: {
		name: "Enroulement",
		// Official flavor text: "Le lanceur s’enroule sur lui-même et se concentre. Son Attaque, sa Défense et sa Précision augmentent."
		desc: "Monte l'Attaque, la Défense et la précision de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "+1 Attaque, Défense et précision du lanceur.", // NEEDS QC
	},
	collisioncourse: {
		name: "Nitro Crash",
		// Official flavor text: "Le lanceur change de forme et s'écrase sur la cible dans une explosion antique. Si la capacité est super efficace, elle inflige encore plus de dégâts que d'ordinaire."
		desc: "Les dégâts sont multipliés par 1,3333 si cette capacité est super efficace contre la cible.", // NEEDS QC
		shortDesc: "Dégâts x1,3333 si super efficace.", // NEEDS QC
	},
	combattorque: {
		name: "Crash Musclé",
		desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "30 % de paralyser la cible.", // NEEDS QC
	},
	cometpunch: {
		name: "Poing Comète",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour chaque coup. Si un des coups brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	comeuppance: {
		name: "Vindicte",
		// Official flavor text: "Le lanceur contre-attaque avec un coup infligeant des dégâts supérieurs à ceux de la dernière capacité qui l'a blessé."
		desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ou spéciale ce tour des dégâts égaux à 1,5 fois les PV que l'utilisateur a perdus lors de cette attaque, arrondi à l'inférieur. Si l'utilisateur n'a pas perdu de PV lors de cette attaque, cette capacité inflige 1 PV de dégâts. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique ou spéciale d'un Pokémon adverse ce tour.", // NEEDS QC
		shortDesc: "S'il est touché, renvoie 1,5x les dégâts.", // NEEDS QC
	},
	confide: {
		name: "Confidence",
		// Official flavor text: "Dévoile des secrets à l’ennemi, qui perd alors sa concentration et voit son Attaque Spéciale diminuer."
		desc: "Baisse l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
	},
	confuseray: {
		name: "Onde Folie",
		// Official flavor text: "Un rayon sinistre qui plonge l’ennemi dans un état de confusion."
		desc: "Rend la cible confuse.", // NEEDS QC
		shortDesc: "Rend la cible confuse.", // NEEDS QC
	},
	confusion: {
		name: "Choc Mental",
		// Official flavor text: "Une faible vague télékinétique frappe l’ennemi. Peut aussi le plonger dans la confusion."
		desc: "A 10 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "10 % de rendre la cible confuse.", // NEEDS QC
	},
	constrict: {
		name: "Constriction",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 10 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		gen1: {
			desc: "A 33 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
			shortDesc: "33 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		},
	},
	continentalcrush: {
		name: "Apocalypse Gigalithique",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	conversion: {
		name: "Conversion",
		// Official flavor text: "Le lanceur change de type pour prendre celui de la première capacité de sa liste."
		desc: "Le type de l'utilisateur devient le type d'origine de la capacité dans son premier emplacement. Échoue si l'utilisateur ne peut pas changer de type, ou si ce type est déjà l'un de ses types actuels.", // NEEDS QC
		shortDesc: "Prend le type de sa première capacité.", // NEEDS QC
		gen5: {
			desc: "Le type de l'utilisateur devient au hasard le type d'origine d'une de ses capacités autres que celle-ci, mais pas l'un de ses types actuels. Échoue si l'utilisateur ne peut pas changer de type, ou si cette capacité ne pourrait choisir qu'un de ses types actuels.", // NEEDS QC
			shortDesc: "Prend le type d'une de ses capacités.", // NEEDS QC
		},
		gen4: {
			desc: "Le type de l'utilisateur devient au hasard le type d'origine d'une de ses capacités autres que celle-ci et Malédiction, mais pas l'un de ses types actuels. Échoue si l'utilisateur ne peut pas changer de type, ou si cette capacité ne pourrait choisir qu'un de ses types actuels.", // NEEDS QC
		},
		gen3: {
			desc: "Le type de l'utilisateur devient au hasard le type d'origine d'une de ses capacités autres que Malédiction, mais pas l'un de ses types actuels. Échoue si l'utilisateur ne peut pas changer de type, ou si cette capacité ne pourrait choisir qu'un de ses types actuels.", // NEEDS QC
		},
		gen1: {
			desc: "Les types de l'utilisateur deviennent les types actuels de la cible.", // NEEDS QC
			shortDesc: "Copie les types de la cible.", // NEEDS QC
		},

		typeChange: "  Son élément s'adapte!",
	},
	conversion2: {
		name: "Conversion 2",
		// Official flavor text: "Le lanceur change de type pour être résistant au type de la dernière attaque lancée par sa cible."
		desc: "Le type de l'utilisateur devient un type qui résiste ou est immunisé au type de la dernière capacité utilisée par la cible, mais pas l'un de ses types actuels. Le type déterminé de la capacité est utilisé plutôt que son type d'origine. Échoue si la cible n'a pas encore agi, si l'utilisateur ne peut pas changer de type, ou si cette capacité ne pourrait choisir qu'un des types actuels de l'utilisateur.", // NEEDS QC
		shortDesc: "Prend un type qui résiste à la dernière capacité subie.", // NEEDS QC
		gen4: {
			desc: "Le type de l'utilisateur devient un type qui résiste ou est immunisé au type de la dernière capacité utilisée contre lui, si elle a réussi, mais pas l'un de ses types actuels. Le type déterminé de la capacité est utilisé plutôt que son type d'origine. Échoue si la dernière capacité utilisée contre l'utilisateur n'a pas réussi, si l'utilisateur a le talent Multi-Type, ou si cette capacité ne pourrait choisir qu'un de ses types actuels.", // NEEDS QC
			shortDesc: "Prend un type qui résiste à la dernière capacité.", // NEEDS QC
		},
		gen3: {
			desc: "Le type de l'utilisateur devient un type qui résiste ou est immunisé au type de la dernière capacité utilisée contre lui, si elle a réussi, mais pas l'un de ses types actuels. Le type déterminé de la capacité est utilisé plutôt que son type d'origine, mais Lutte est considérée comme de type Normal. Échoue si la dernière capacité utilisée contre l'utilisateur n'a pas réussi, ou si cette capacité ne pourrait choisir qu'un de ses types actuels.", // NEEDS QC
		},
		gen2: {
			desc: "Le type de l'utilisateur devient un type qui résiste ou est immunisé au type de la dernière capacité utilisée par le Pokémon adverse, même si c'est l'un de ses types actuels. Le type d'origine de la capacité est utilisé plutôt que le type déterminé. Échoue si le Pokémon adverse n'a pas utilisé de capacité.", // NEEDS QC
			shortDesc: "Prend un type qui résiste à la dernière capacité.", // NEEDS QC
		},
	},
	copycat: {
		name: "Photocopie",
		// Official flavor text: "Le lanceur imite la dernière capacité employée. Échoue si aucune capacité n’a été utilisée."
		desc: "L'utilisateur utilise la dernière capacité utilisée par n'importe quel Pokémon, y compris lui-même. Échoue si aucune capacité n'a été utilisée, ou si la dernière capacité utilisée était Assistance, Blockhaus, Bec-Canon, Aegis Maxima, Gladius Maximus, Éructation, Passe-Cadeau, Crash Brûlant, Célébration, Babil, Projection, Crash Musclé, Photocopie, Riposte, Implore, Lien du Destin, Détection, Draco-Queue, Canon Dynamax, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Crash Magique, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Crash Toxique, Abri, Poudre Fureur, Hurlement, Carapiège, Gribouille, Blabla Dodo, Saisie, Pico-Défense, Projecteur, Lutte, Passe-Passe, Pluie Térastrale, Larcin, Morphing, Tour de Magie, Cyclone ou Crash Obscur.", // NEEDS QC
		shortDesc: "Utilise la dernière capacité utilisée dans le combat.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur utilise la dernière capacité utilisée par n'importe quel Pokémon, y compris lui-même. Pour les capacités Dynamax et Gigamax, la capacité de base est prise en compte. Échoue si aucune capacité n'a été utilisée, ou si la dernière capacité utilisée était Assistance, Blockhaus, Bec-Canon, Aegis Maxima, Gladius Maximus, Éructation, Passe-Cadeau, Célébration, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Draco-Queue, Canon Dynamax, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Abri, Poudre Fureur, Hurlement, Carapiège, Gribouille, Blabla Dodo, Saisie, Pico-Défense, Projecteur, Lutte, Passe-Passe, Larcin, Morphing, Tour de Magie ou Cyclone.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur utilise la dernière capacité utilisée par n'importe quel Pokémon, y compris lui-même. Échoue si aucune capacité n'a été utilisée, ou si la dernière capacité utilisée était Assistance, Blockhaus, Bec-Canon, Éructation, Passe-Cadeau, Célébration, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Draco-Queue, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Abri, Poudre Fureur, Hurlement, Carapiège, Gribouille, Blabla Dodo, Saisie, Pico-Défense, Projecteur, Lutte, Passe-Passe, Larcin, Morphing, Tour de Magie ou Cyclone, ou une capacité Z.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur utilise la dernière capacité utilisée par n'importe quel Pokémon, y compris lui-même. Échoue si aucune capacité n'a été utilisée, ou si la dernière capacité utilisée était Assistance, Éructation, Passe-Cadeau, Célébration, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Draco-Queue, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Mains Jointes, Bouclier Royal, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Abri, Poudre Fureur, Hurlement, Gribouille, Blabla Dodo, Saisie, Pico-Défense, Lutte, Passe-Passe, Larcin, Morphing, Tour de Magie ou Cyclone.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur utilise la dernière capacité utilisée par n'importe quel Pokémon, y compris lui-même. Échoue si aucune capacité n'a été utilisée, ou si la dernière capacité utilisée était Assistance, Passe-Cadeau, Babil, Projection, Photocopie, Riposte, Implore, Lien du Destin, Détection, Draco-Queue, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Abri, Poudre Fureur, Gribouille, Blabla Dodo, Saisie, Lutte, Passe-Passe, Larcin, Morphing ou Tour de Magie.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur utilise la dernière capacité utilisée par n'importe quel Pokémon, y compris lui-même. Échoue si aucune capacité n'a été utilisée, ou si la dernière capacité utilisée était Assistance, Babil, Photocopie, Riposte, Implore, Lien du Destin, Détection, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Abri, Gribouille, Blabla Dodo, Saisie, Lutte, Passe-Passe, Larcin ou Tour de Magie.", // NEEDS QC
		},
	},
	coreenforcer: {
		name: "Sanction Suprême",
		// Official flavor text: "La cible subit des dégâts et, si elle a déjà agi à ce tour, elle perd aussi son talent."
		desc: "Si l'utilisateur agit après la cible, le talent de celle-ci est rendu inactif tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant reste sous cet effet. Si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Mode Transe ou Supermutation, cet effet ne se produit pas, et le recevoir via Relais y met fin immédiatement.", // NEEDS QC
		shortDesc: "Annule le talent des ennemis qui ont agi avant.", // NEEDS QC
		gen8: {
			desc: "Si l'utilisateur agit après la cible, le talent de celle-ci est rendu inactif tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant reste sous cet effet. Si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe, cet effet ne se produit pas, et le recevoir via Relais y met fin immédiatement.", // NEEDS QC
		},
		gen7: {
			desc: "Si l'utilisateur agit après la cible, le talent de celle-ci est rendu inactif tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant reste sous cet effet. Si le talent de la cible est Synergie, Hypersommeil, Fantômasque, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe, cet effet ne se produit pas, et le recevoir via Relais y met fin immédiatement.", // NEEDS QC
		},
	},
	corkscrewcrash: {
		name: "Vrille Maximum",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	corrosivegas: {
		name: "Gaz Corrosif",
		// Official flavor text: "Un gaz corrosif qui enveloppe tous les Pokémon alentour et qui dissout les objets qu’ils tiennent."
		desc: "La cible perd son objet tenu. Cette capacité ne peut pas faire perdre leur objet aux Pokémon ayant le talent Glu, ni faire perdre à Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, un Pokémon Paradoxe ou Ogerpon respectivement Gemme Bleue, Gemme Rouge, Globe Adamant, Globe Perlé, Globe Platiné, une plaque, un module, une ROM, une Épée Rouillée, un Bouclier Rouillé, une Énergie Booster ou un masque. Dans ce cas, les Pokémon Paradoxe incluent toutes les espèces ayant les talents Paléosynthèse et Charge Quantique, sauf Feu-Perçant, Ire-Foudre, Roc-de-Fer et Chef-de-Fer. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		shortDesc: "Détruit les objets des Pokémon adjacents.", // NEEDS QC
		gen8: {
			desc: "La cible perd son objet tenu. Cette capacité ne peut pas faire perdre leur objet aux Pokémon ayant le talent Glu, ni faire perdre à Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta respectivement Gemme Bleue, Gemme Rouge, Orbe Platiné, une plaque, un module, une ROM, Épée Rouillée ou Bouclier Rouillé. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},

		fail: "#healblock",
		removeItem: "  {SOURCE} fait fondre {ITEM:definite:classified} {POKEMON:de} !",
	},
	cosmicpower: {
		name: "Force Cosmique",
		// Official flavor text: "Le lanceur absorbe un pouvoir mystique spatial qui augmente sa Défense et sa Défense Spéciale."
		desc: "Monte la Défense et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte la Défense et la Déf. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	cottonguard: {
		name: "Cotogarde",
		// Official flavor text: "Le lanceur se protège en s’emmitouflant dans du coton. Sa Défense augmente énormément."
		desc: "Monte la Défense de l'utilisateur de 3 niveaux.", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur de 3 niveaux.", // NEEDS QC
	},
	cottonspore: {
		name: "Spore Coton",
		// Official flavor text: "Le lanceur libère des spores cotonneuses qui collent à l’ennemi et baissent beaucoup sa Vitesse."
		desc: "Baisse la Vitesse de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse la Vitesse de la cible de 2 niveaux.", // NEEDS QC
	},
	counter: {
		name: "Riposte",
		// Official flavor text: "Une riposte qui répond à toute capacité physique en infligeant le double de dégâts."
		desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ce tour des dégâts égaux au double des PV que l'utilisateur a perdus lors de cette attaque. Si l'utilisateur n'a pas perdu de PV lors de cette attaque, cette capacité inflige 1 PV de dégâts. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique d'un Pokémon adverse ce tour.", // NEEDS QC
		shortDesc: "Renvoie le double des dégâts d'une attaque physique.", // NEEDS QC
		gen6: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ce tour des dégâts égaux au double des PV perdus lors de cette attaque. Si l'utilisateur n'a pas perdu de PV, cette capacité inflige des dégâts avec une puissance de 1. Si la position de ce Pokémon adverse n'est plus occupée, les dégâts sont infligés à un Pokémon adverse à portée, au hasard. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique adverse ce tour.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ce tour des dégâts égaux au double des PV perdus lors de cette attaque. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique adverse ce tour, ou s'il n'a pas perdu de PV lors de cette attaque.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ce tour des dégâts égaux au double des PV perdus lors de cette attaque. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Puissance Cachée est considérée comme de type Normal, et seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique adverse ce tour, ou s'il n'a pas perdu de PV lors de cette attaque.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige au Pokémon adverse des dégâts égaux au double des PV perdus par l'utilisateur suite à une attaque physique ce tour. Puissance Cachée est considérée comme de type Normal, et seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur agit en premier, s'il n'a pas été touché par une attaque physique ce tour, ou s'il n'a pas perdu de PV lors de cette attaque. Si le Pokémon adverse a utilisé Abîme ou Empal’Korne et a raté, cette capacité inflige 65535 dégâts.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige au Pokémon adverse des dégâts égaux au double des dégâts infligés par la dernière capacité utilisée dans le combat. Cette capacité ignore l'immunité de type. Échoue si l'utilisateur agit en premier, ou si la dernière capacité du côté adverse était Riposte, avait 0 de puissance, ou n'était pas de type Normal ou Combat. Échoue si la dernière capacité utilisée par l'un des deux côtés a infligé 0 dégât et n'était pas Onde Folie, Conversion, Puissance, Regard Médusant, Buée Noire, Vampigraine, Mur Lumière, Copie, Brume, Gaz Toxik, Poudre Toxik, Soin, Protection, Repos, E-Coque, Trempette, Para-Spore, Clonage, Ultrason, Téléport, Cage Éclair, Toxik ou Morphing.", // NEEDS QC
			shortDesc: "Rend 2x les dégâts des attaques Normal/Combat.", // NEEDS QC
		},
	},
	courtchange: {
		name: "Change-Côté",
		// Official flavor text: "Une force mystérieuse intervertit les effets affectant chaque côté du terrain."
		desc: "Échange les effets de Brume, Mur Lumière, Protection, Picots, Rune Protect, Vent Arrière, Pics Toxik, Piège de Roc, Aire d’Eau, Aire de Feu, Aire d’Herbe, Toile Gluante, Voile Aurore, Percée G-Max, Canonnade G-Max, Fouet G-Max et Fournaise G-Max entre le côté de l'utilisateur et le côté adverse.", // NEEDS QC
		shortDesc: "Échange les effets de terrain des deux camps.", // NEEDS QC

		activate: "  Les effets affectant chaque côté du terrain ont été échangés par {POKEMON} !",
	},
	covet: {
		name: "Implore",
		// Official flavor text: "Le lanceur s’approche de la cible avec un air angélique afin de dérober l’objet qu’elle tient."
		desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet si elle n'est pas K.O. L'objet de la cible n'est pas volé s'il s'agit de Gemme Bleue, Gemme Rouge, Globe Adamant, Globe Perlé, Globe Platiné, une plaque, un module, une ROM, une Épée Rouillée, un Bouclier Rouillé, une Énergie Booster ou un masque tenu respectivement par Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, un Pokémon Paradoxe ou Ogerpon, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Dans ce cas, les Pokémon Paradoxe incluent toutes les espèces ayant les talents Paléosynthèse et Charge Quantique, sauf Feu-Perçant, Ire-Foudre, Roc-de-Fer et Chef-de-Fer. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		shortDesc: "Sans objet, le lanceur vole celui de la cible.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque, d'un module, d'une ROM, de Épée Rouillée ou de Bouclier Rouillé tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen7: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit d'un Cristal Z, d'une Méga-Gemme tenue par l'espèce pouvant méga-évoluer avec, ou de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque, d'un module ou d'une ROM tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen6: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit d'une Méga-Gemme tenue par l'espèce pouvant méga-évoluer avec, ou de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque ou d'un module tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen5: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit d'une Lettre, ou de Orbe Platiné, d'une plaque ou d'un module tenus respectivement par Giratina, Arceus ou Genesect, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen4: {
			desc: "Si cette attaque réussit et que l'utilisateur ne tient pas d'objet, il vole l'objet tenu par la cible. L'objet n'est pas volé s'il s'agit d'une Lettre ou d'une Orbe Platiné, ou si la cible a le talent Multi-Type ou Glu. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage.", // NEEDS QC
		},
		gen3: {
			desc: "Si cette attaque réussit et que l'utilisateur ne tient pas d'objet, il vole l'objet tenu par la cible. L'objet n'est pas volé s'il s'agit d'une Lettre ou d'une Baie Enigma, ou si la cible a le talent Glu. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage.", // NEEDS QC
		},
	},
	crabhammer: {
		name: "Pince-Masse",
		// Official flavor text: "Une grande pince martèle l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	craftyshield: {
		name: "Vigilance",
		// Official flavor text: "Utilise une force mystérieuse pour protéger l’équipe des capacités de statut. Ne protège pas des autres capacités."
		desc: "L'utilisateur et son équipe sont protégés des capacités sans dégâts des autres Pokémon, alliés compris, pendant ce tour. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		shortDesc: "Protège l'équipe des capacités de statut ce tour.", // NEEDS QC

		start: "  {TEAM} est protégé par la capacité Vigilance !",
		block: "  {POKEMON} est protégé par la capacité Vigilance !",
	},
	crosschop: {
		name: "Coup Croix",
		// Official flavor text: "Le lanceur délivre un coup double en croisant les avant-bras. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	crosspoison: {
		name: "Poison Croix",
		// Official flavor text: "Un coup tranchant qui peut empoisonner l’ennemi. Taux de critiques élevé."
		desc: "A 10 % de chances d'empoisonner la cible et plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé. 10 % d'empoisonner.", // NEEDS QC
	},
	crunch: {
		name: "Mâchouille",
		// Official flavor text: "Le lanceur mord l’ennemi de ses crocs pointus. Peut aussi baisser sa Défense."
		desc: "A 20 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "20 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		gen3: {
			desc: "A 20 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
			shortDesc: "20 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
		},
	},
	crushclaw: {
		name: "Éclate Griffe",
		// Official flavor text: "Lacère l’ennemi avec des griffes solides et aiguisées. Peut aussi baisser sa Défense."
		desc: "A 50 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	crushgrip: {
		name: "Presse",
		// Official flavor text: "Une force puissante écrase l’ennemi. Plus il lui reste de PV et plus l’attaque est puissante."
		desc: "La puissance est égale à 120 × (PV actuels de la cible / PV max de la cible), arrondi à l'inférieur à partir de 0,5, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Plus puissant si la cible a beaucoup de PV.", // NEEDS QC
		gen4: {
			desc: "La puissance est égale à 120 × (PV actuels de la cible ÷ PV max de la cible) + 1, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	curse: {
		name: "Malédiction",
		// Official flavor text: "Une capacité à l’effet différent selon que le lanceur est un Pokémon Spectre ou non."
		desc: "Si l'utilisateur n'est pas de type Spectre, sa Vitesse baisse d'un niveau et son Attaque et sa Défense montent d'un niveau. Si l'utilisateur est de type Spectre, il perd la moitié de ses PV max, arrondi à l'inférieur, même si cela le met K.O., et la cible perd 1/4 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour tant qu'elle est au combat. Si la cible utilise Relais, son remplaçant reste affecté. Échoue s'il n'y a pas de cible ou si elle est déjà affectée.", // NEEDS QC
		shortDesc: "Spectre : maudit ; sinon -1 Vit., +1 Atq et Déf.", // NEEDS QC
		gen4: {
			desc: "Si l'utilisateur n'est pas de type Spectre, baisse sa Vitesse d'un niveau et monte son Attaque et sa Défense d'un niveau. S'il est de type Spectre, il perd la moitié de ses PV max, arrondi à l'inférieur, même si cela le met K.O. ; en échange, la cible perd 1/4 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour tant qu'elle est au combat. Si la cible utilise Relais, son remplaçant reste affecté. Échoue s'il n'y a pas de cible, ou si la cible est déjà affectée ou a un clone.", // NEEDS QC
		},
		gen2: {
			desc: "Si l'utilisateur n'est pas de type Spectre, baisse sa Vitesse d'un niveau et monte son Attaque et sa Défense d'un niveau, sauf si son Attaque et sa Défense sont toutes deux au niveau 6. S'il est de type Spectre, il perd la moitié de ses PV max, arrondi à l'inférieur, même si cela le met K.O. ; en échange, la cible perd 1/4 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour tant qu'elle est au combat. Si la cible utilise Relais, son remplaçant reste affecté. Échoue si la cible est déjà affectée ou a un clone.", // NEEDS QC
		},

		start: "  {SOURCE} sacrifie des PV et lance une malédiction sur {POKEMON} !",
		damage: "  {POKEMON} est touché par la malédiction !",
	},
	cut: {
		name: "Coupe",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	darkestlariat: {
		name: "Dark Lariat",
		// Official flavor text: "Le Pokémon étend les bras et frappe l’adversaire en tournant violemment. Inflige des dégâts et ignore les changements de stats de la cible."
		desc: "Ignore les changements de niveaux de statistiques de la cible, esquive comprise.", // NEEDS QC
		shortDesc: "Ignore les changements de stats de la cible.", // NEEDS QC
	},
	darkpulse: {
		name: "Vibrobscur",
		// Official flavor text: "Le lanceur dégage une horrible aura chargée de pensées maléfiques. Peut aussi apeurer l’ennemi."
		desc: "A 20 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "20 % d'apeurer la cible.", // NEEDS QC
	},
	darkvoid: {
		name: "Trou Noir",
		// Official flavor text: "L’ennemi est plongé dans les ténèbres. Il tombe dans un profond sommeil."
		desc: "Endort la cible. Cette capacité ne peut être utilisée avec succès que si la forme actuelle de l'utilisateur, en tenant compte de Morphing, est Darkrai.", // NEEDS QC
		shortDesc: "Darkrai : endort les ennemis.", // NEEDS QC
		gen6: {
			desc: "Endort la cible.", // NEEDS QC
			shortDesc: "Endort les ennemis.", // NEEDS QC
		},

		fail: "Mais il en est incapable !",
		failWrongForme: "Mais il en est incapable sous cette forme !",
	},
	dazzlinggleam: {
		name: "Éclat Magique",
		// Official flavor text: "Libère une puissante décharge lumineuse qui inflige des dégâts à l’ennemi."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis adjacents.", // NEEDS QC
	},
	decorate: {
		name: "Nappage",
		// Official flavor text: "Le lanceur augmente beaucoup l’Attaque et l’Attaque Spéciale de la cible en la nappant de glaçage."
		desc: "Monte l'Attaque et l'Attaque Spéciale de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte l'Attaque et l'Atq. Spé de la cible de 2 niveaux.", // NEEDS QC
	},
	defendorder: {
		name: "Appel Défense",
		// Official flavor text: "Le lanceur appelle ses sous-fifres pour former un bouclier qui augmente sa Défense et sa Défense Spéciale."
		desc: "Monte la Défense et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte la Défense et la Déf. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	defensecurl: {
		name: "Boul’Armure",
		// Official flavor text: "Le lanceur s’enroule pour cacher ses points faibles, ce qui augmente sa Défense."
		desc: "Monte la Défense de l'utilisateur d'un niveau. Tant que l'utilisateur reste au combat, la puissance de ses Ball’Glace et Roulade est doublée (cet effet n'est pas cumulable).", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur d'un niveau.", // NEEDS QC
		gen2: {
			desc: "Monte la Défense de l'utilisateur d'un niveau. Tant que l'utilisateur reste au combat, la puissance de son Roulade est doublée (effet non cumulable). Cet effet peut être transmis par Relais.", // NEEDS QC
		},
		gen1: {
			desc: "Monte la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		},
	},
	defog: {
		name: "Anti-Brume",
		// Official flavor text: "Un grand coup de vent qui disperse la Protection ou le Mur Lumière de l’ennemi. Diminue aussi son Esquive."
		desc: "Baisse l'esquive de la cible d'un niveau. Si cette capacité réussit, que l'esquive de la cible ait été affectée ou non, les effets de Protection, Mur Lumière, Voile Aurore, Rune Protect, Brume, Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de la cible, et les effets de Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de l'utilisateur. Ignore le clone de la cible, mais un clone bloque tout de même la baisse d'esquive. Si un champ est actif et que cette capacité réussit, le champ est dissipé.", // NEEDS QC
		shortDesc: "-1 esquive ; retire pièges et champs des deux côtés.", // NEEDS QC
		gen7: {
			desc: "Baisse l'Esquive de la cible d'un niveau. Si cette capacité réussit, et que l'Esquive de la cible ait été affectée ou non, les effets de Protection, Mur Lumière, Voile Aurore, Rune Protect, Brume, Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de la cible, et les effets de Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de l'utilisateur. Ignore le clone de la cible, mais un clone bloque tout de même la baisse d'Esquive.", // NEEDS QC
			shortDesc: "Esquive -1 ; retire les pièges des deux côtés.", // NEEDS QC
		},
		gen6: {
			desc: "Baisse l'Esquive de la cible d'un niveau. Si cette capacité réussit, et que l'Esquive de la cible ait été affectée ou non, les effets de Protection, Mur Lumière, Rune Protect, Brume, Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de la cible, et les effets de Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de l'utilisateur. Ignore le clone de la cible, mais un clone bloque tout de même la baisse d'Esquive.", // NEEDS QC
		},
		gen5: {
			desc: "Baisse l'Esquive de la cible d'un niveau. Si cette capacité réussit, et que l'Esquive de la cible ait été affectée ou non, les effets de Protection, Mur Lumière, Rune Protect, Brume, Picots, Pics Toxik et Piège de Roc prennent fin du côté de la cible. Ignore le clone de la cible, mais un clone bloque tout de même la baisse d'Esquive.", // NEEDS QC
			shortDesc: "Esquive -1 ; retire pièges et écrans adverses.", // NEEDS QC
		},
	},
	destinybond: {
		name: "Lien du Destin",
		// Official flavor text: "Si un ennemi porte un coup fatal au lanceur après qu’il a activé cette capacité, ils sont tous les deux mis K.O. La capacité échoue si elle est immédiatement réutilisée."
		desc: "Jusqu'à la prochaine action de l'utilisateur, si l'attaque d'un Pokémon adverse le met K.O., ce Pokémon est mis K.O. aussi, sauf si l'attaque était Vœu Destructeur ou Prescience. Échoue si l'utilisateur a déjà utilisé cette capacité avec succès à son action précédente, sans compter les capacités utilisées via le talent Danseuse.", // NEEDS QC
		shortDesc: "Si un ennemi met le lanceur K.O., il l'est aussi.", // NEEDS QC
		gen6: {
			desc: "Jusqu'au prochain tour de l'utilisateur, si l'attaque d'un Pokémon adverse le met K.O., ce Pokémon est aussi mis K.O., sauf si l'attaque était Vœu Destructeur ou Prescience.", // NEEDS QC
		},
		gen2: {
			desc: "Jusqu'au prochain tour de l'utilisateur, si l'attaque d'un Pokémon adverse le met K.O., ce Pokémon est aussi mis K.O.", // NEEDS QC
		},

		start: "  {POKEMON} veut entraîner son assaillant dans sa chute !",
		activate: "{POKEMON} entraîne son assaillant dans sa chute !",
	},
	detect: {
		name: "Détection",
		// Official flavor text: "Le lanceur se protège de toutes les attaques. Peut échouer si utilisée plusieurs fois de suite."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège le lanceur des capacités ce tour.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité, Abri, Prévention ou Garde Large. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie, jusqu'à un maximum de 8. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a X chances sur 65536 de réussir, où X commence à 65535 et est divisé par deux, arrondi à l'inférieur, à chaque utilisation réussie. Après la quatrième réussite d'affilée, X tombe à 118 et prend ensuite des valeurs apparemment aléatoires entre 0 et 65535. X revient à 65535 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur est protégé des attaques de l'adversaire pendant ce tour. Cette capacité a X chances sur 255 de réussir, où X commence à 255 et est divisé par deux, arrondi à l'inférieur, à chaque utilisation réussie. X revient à 255 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur a un clone ou agit en dernier ce tour.", // NEEDS QC
		},
	},
	devastatingdrake: {
		name: "Chaos Draconique",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	diamondstorm: {
		name: "Orage Adamantin",
		// Official flavor text: "Provoque une tempête de diamants qui inflige des dégâts. Peut beaucoup augmenter la Défense du lanceur."
		desc: "A 50 % de chances de monter la Défense de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "50 % de monter la Défense du lanceur de 2 niveaux.", // NEEDS QC
		gen6: {
			desc: "A 50 % de chances de monter la Défense de l'utilisateur d'un niveau pour chaque coup.", // NEEDS QC
			shortDesc: "50 % de monter sa Déf. de 1 à chaque coup.", // NEEDS QC
		},
	},
	dig: {
		name: "Tunnel",
		// Official flavor text: "Le lanceur creuse au premier tour et frappe au second."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Séisme et Ampleur, dont il subit le double des dégâts, et il n'est pas affecté par la météo. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Creuse au tour 1, frappe au tour 2.", // NEEDS QC
		gen4: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Séisme et Ampleur, qui ont leur puissance doublée contre lui, et n'est pas affecté par la météo. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen3: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Séisme et Ampleur, qui ont leur puissance doublée contre lui, et n'est pas affecté par la météo.", // NEEDS QC
		},
		gen2: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Séisme, Abîme et Ampleur, n'est pas affecté par la météo, et Séisme et Ampleur ont leur puissance doublée contre lui.", // NEEDS QC
		},
		gen1: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Patience, Météores et Morphing. Si l'utilisateur est totalement paralysé au second tour, il continue d'éviter les attaques jusqu'à ce qu'il soit remplacé ou exécute avec succès le second tour de cette capacité ou de Vol.", // NEEDS QC
		},

		prepare: "{POKEMON} se cache dans le sol !",
	},
	direclaw: {
		name: "Griffes Funestes",
		// Official flavor text: "Le lanceur attaque avec des griffes destructrices en visant les points faibles. La cible peut aussi être empoisonnée, paralysée, ou endormie."
		desc: "A 50 % de chances d'endormir, d'empoisonner ou de paralyser la cible.", // NEEDS QC
		shortDesc: "50 % de sommeil, poison ou paralysie.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	disable: {
		name: "Entrave",
		// Official flavor text: "Empêche l’ennemi d’employer à nouveau sa dernière attaque. Dure quatre tours."
		desc: "Pendant 4 tours, la dernière capacité utilisée par la cible est désactivée. Échoue si une des capacités de la cible est déjà désactivée, si la cible n'a pas encore agi, si elle ne connaît plus cette capacité, ou s'il s'agissait d'une capacité Dynamax ou Gigamax.", // NEEDS QC
		shortDesc: "Désactive 4 tours la dernière capacité de la cible.", // NEEDS QC
		gen7: {
			desc: "Pendant 4 tours, la dernière capacité utilisée par la cible est mise sous entrave. Échoue si une capacité de la cible est déjà sous entrave, si la cible n'a pas encore agi, si elle ne connaît plus la capacité, ou si la capacité était une capacité Z. Les capacités renforcées par la Force Z peuvent toujours être choisies et exécutées pendant l'effet.", // NEEDS QC
		},
		gen6: {
			desc: "Pendant 4 tours, la dernière capacité utilisée par la cible est mise sous entrave. Échoue si une capacité de la cible est déjà sous entrave, si la cible n'a pas encore agi, ou si elle ne connaît plus la capacité.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 4 à 7 tours, la dernière capacité utilisée par la cible est mise sous entrave. Échoue si une capacité de la cible est déjà sous entrave, si la cible n'a pas encore agi, si elle ne connaît plus la capacité, ou si la capacité a 0 PP.", // NEEDS QC
			shortDesc: "Bloque la dernière capacité de la cible 4-7 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Pendant 2 à 5 tours, la dernière capacité utilisée par la cible est mise sous entrave. Échoue si une capacité de la cible est déjà sous entrave, si la cible n'a pas encore agi, si elle ne connaît plus la capacité, ou si la capacité a 0 PP.", // NEEDS QC
			shortDesc: "Bloque la dernière capacité de la cible 2-5 tours.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 1 à 7 tours, la dernière capacité utilisée par la cible est mise sous entrave. Échoue si une capacité de la cible est déjà sous entrave, si la cible n'a pas encore agi, si elle ne connaît plus la capacité, ou si la capacité a 0 PP.", // NEEDS QC
			shortDesc: "Bloque la dernière capacité de la cible 1-7 tours.", // NEEDS QC
		},
		gen1: {
			desc: "Pendant 0 à 7 tours, une des capacités de la cible ayant au moins 1 PP est mise sous entrave, au hasard. Échoue si une capacité de la cible est déjà sous entrave, ou si aucune de ses capacités n'a de PP. Si un Pokémon utilise Buée Noire, l'effet prend fin. Que cette capacité réussisse ou non, elle compte comme un coup pour Frénésie de l'adversaire.", // NEEDS QC
			shortDesc: "Bloque une capacité de la cible 0-7 tours.", // NEEDS QC
		},

		start: "  La capacité {MOVE} {POKEMON:de} est mise sous entrave !",
		end: "  La capacité {POKEMON:de} n’est plus sous entrave !",
		cant: "Il y a une entrave sur la capacité {MOVE} {POKEMON:de} !",
	},
	disarmingvoice: {
		name: "Voix Enjôleuse",
		// Official flavor text: "Laisse s’échapper une voix enchanteresse qui inflige des dégâts psychiques à l’ennemi. Touche à coup sûr."
		desc: "Cette capacité ne vérifie pas la précision.", // NEEDS QC
		shortDesc: "Ne vérifie pas la précision. Touche les ennemis.", // NEEDS QC
	},
	discharge: {
		name: "Coup d’Jus",
		// Official flavor text: "Un flamboiement d’électricité frappe tous les Pokémon autour du lanceur. Peut aussi les paralyser."
		desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "30 % de paralyser les Pokémon adjacents.", // NEEDS QC
	},
	dive: {
		name: "Plongée",
		// Official flavor text: "Le lanceur plonge sous l’eau au premier tour et frappe au second."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Surf et Siphon, dont il subit le double des dégâts, et il n'est pas affecté par la météo. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Plonge au tour 1, frappe au tour 2.", // NEEDS QC
		gen4: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Surf et Siphon, qui ont leur puissance doublée contre lui, et n'est pas affecté par la météo. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen3: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Surf et Siphon, qui ont leur puissance doublée contre lui, et n'est pas affecté par la météo.", // NEEDS QC
		},

		prepare: "{POKEMON} se cache sous l’eau !",
	},
	dizzypunch: {
		name: "Uppercut",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 20 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "20 % de rendre la cible confuse.", // NEEDS QC
		gen1: {
			desc: "Aucun effet supplémentaire.", // NEEDS QC
			shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		},
	},
	doodle: {
		name: "Décalquage",
		// Official flavor text: "Le lanceur capture l'essence de la cible et la décalque. Le talent du lanceur et de ses alliés devient alors identique à celui de la cible."
		desc: "Le talent de l'utilisateur et celui de son allié deviennent celui de la cible. Ne change pas le talent de l'utilisateur ou de l'allié s'il s'agit de Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Mode Transe ou Supermutation, ou s'il est déjà identique à celui de la cible. Échoue si les talents de l'utilisateur et de son allié sont déjà identiques à celui de la cible, ou si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Don Floral, Météo, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Osmose, Paléosynthèse, Charge Quantique, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téra-Carapace, Téramorphose, Téraformation 0, Calque, Garde Mystik, Mode Transe ou Supermutation.", // NEEDS QC
		shortDesc: "Le lanceur et son allié copient le talent de la cible.", // NEEDS QC
	},
	doomdesire: {
		name: "Vœu Destructeur",
		// Official flavor text: "Le lanceur génère une sphère lumineuse qu’il projette sur l’ennemi deux tours plus tard."
		desc: "Inflige des dégâts deux tours après l'utilisation de cette capacité. À la fin de ce tour, les dégâts sont calculés à ce moment-là et infligés au Pokémon occupant la position que la cible avait quand la capacité a été utilisée. Si l'utilisateur n'est plus au combat à ce moment, les dégâts sont calculés à partir de son Attaque Spéciale naturelle, de ses types et de son niveau, sans bonus de son objet tenu ou de son talent. Échoue si cette capacité ou Prescience est déjà en effet pour la position de la cible.", // NEEDS QC
		shortDesc: "Frappe deux tours après son utilisation.", // NEEDS QC
		gen4: {
			desc: "Inflige deux tours après son utilisation des dégâts sans type qui ne peuvent pas être un coup critique. Les dégâts sont calculés contre la cible au moment de l'utilisation et infligés à la fin du dernier tour au Pokémon occupant la position initiale de la cible. Échoue si cette capacité ou Prescience est déjà en cours pour la position de la cible.", // NEEDS QC
		},

		start: "  {POKEMON} souhaite que la capacité Vœu Destructeur se déclenche !",
		activate: "  {TARGET} subit l’attaque Vœu Destructeur !",
	},
	doubleedge: {
		name: "Damoclès",
		// Official flavor text: "Une charge dangereuse et imprudente. Blesse aussi gravement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 33 % des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 33 % des dégâts.", // NEEDS QC
		gen4: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/3 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
			shortDesc: "A 1/3 de contrecoup.", // NEEDS QC
		},
		gen2: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/4 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV. Si cette capacité touche un clone, les dégâts de contrecoup sont toujours de 1 PV.", // NEEDS QC
			shortDesc: "Contrecoup de 1/4 des dégâts.", // NEEDS QC
		},
		gen1: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/4 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV. Si cette capacité brise le clone de la cible, l'utilisateur ne subit aucun contrecoup.", // NEEDS QC
		},
	},
	doublehit: {
		name: "Coup Double",
		// Official flavor text: "Le lanceur frappe l’ennemi deux fois d’affilée à l’aide de sa queue, de lianes ou d’un autre membre."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois en un tour.", // NEEDS QC
		gen4: {
			desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
	},
	doubleironbash: {
		name: "Écrous d’Poing",
		// Official flavor text: "Le lanceur fait pivoter l’écrou de sa poitrine deux fois d’affilée pour frapper l’adversaire avec ses bras. Peut apeurer l’ennemi."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup. A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "Frappe deux fois. 30 % d'apeurer la cible.", // NEEDS QC
	},
	doublekick: {
		name: "Double Pied",
		// Official flavor text: "Deux coups de pied qui frappent l’ennemi deux fois d’affilée."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois en un tour.", // NEEDS QC
		gen4: {
			desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour les deux. Si le premier coup brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	doubleshock: {
		name: "Double Décharge",
		// Official flavor text: "Le lanceur libère toute l'électricité contenue dans son corps pour infliger des dégâts élevés à la cible. Le lanceur perd le type Électrik."
		desc: "Échoue si l'utilisateur n'est pas de type Électrik. Si cette capacité réussit et que l'utilisateur n'est pas téracristallisé, son type Électrik disparaît tant qu'il reste au combat.", // NEEDS QC
		shortDesc: "Le lanceur perd son type Électrik ; doit être Électrik.", // NEEDS QC

		typeChange: "  {POKEMON} a utilisé toute son électricité !",
	},
	doubleslap: {
		name: "Torgnoles",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour chaque coup. Si un des coups brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	doubleteam: {
		name: "Reflet",
		// Official flavor text: "Le lanceur se déplace si vite qu’il crée des copies illusoires de lui-même, augmentant son Esquive."
		desc: "Monte l'esquive de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'esquive du lanceur d'un niveau.", // NEEDS QC
	},
	dracometeor: {
		name: "Draco-Météore",
		// Official flavor text: "Le lanceur invoque des comètes. Le contrecoup réduit beaucoup son Attaque Spéciale."
		desc: "Baisse l'Attaque Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Atq. Spé du lanceur de 2 niveaux.", // NEEDS QC
	},
	dragonascent: {
		name: "Draco-Ascension",
		// Official flavor text: "Le Pokémon s’abat à toute vitesse sur la cible depuis les hautes couches de l’atmosphère. Baisse la Défense et la Défense Spéciale du lanceur."
		desc: "Baisse la Défense et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "-1 Déf et Déf. Spé du lanceur.", // NEEDS QC

		megaNoItem: "  L’esprit {TRAINER:de} entre en résonance avec la volonté {POKEMON:de} !",
	},
	dragonbreath: {
		name: "Draco-Souffle",
		// Official flavor text: "Le lanceur souffle fort sur l’ennemi pour lui infliger des dégâts. Peut aussi le paralyser."
		desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "30 % de paralyser la cible.", // NEEDS QC
	},
	dragoncheer: {
		name: "Cri Draconique",
		// Official flavor text: "Le lanceur galvanise ses alliés avec un encouragement draconique qui augmente leur taux de critiques. L'effet est plus puissant si les alliés ont le type Dragon."
		desc: "Monte le taux de critique de la cible d'un niveau, ou de 2 niveaux si la cible est de type Dragon. Échoue si aucun allié n'est adjacent à l'utilisateur, ou si la cible a déjà cet effet ou celui de Puissance. Relais peut transmettre cet effet à un allié.", // NEEDS QC
		shortDesc: "Allié : taux de critique +1, ou +2 s'il est Dragon.", // NEEDS QC

		start: "#focusenergy",
	},
	dragonclaw: {
		name: "Draco-Griffe",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	dragondance: {
		name: "Danse Draco",
		// Official flavor text: "Une danse mystique dont le rythme effréné augmente l’Attaque et la Vitesse du lanceur."
		desc: "Monte l'Attaque et la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'Attaque et la Vitesse du lanceur d'un niveau.", // NEEDS QC
	},
	dragondarts: {
		name: "Draco-Flèches",
		// Official flavor text: "Le lanceur attaque en propulsant deux Fantyrm. S’il y a deux adversaires, chacun d’entre eux est frappé par un Fantyrm."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup. En Combat Duo, cette capacité tente de frapper une fois le Pokémon ciblé et une fois son allié. Si l'un des deux ne peut pas être touché à cause d'une immunité, d'une protection, d'une semi-invulnérabilité, d'un talent ou de la précision, elle tente de frapper l'autre Pokémon deux fois. Si cette capacité est redirigée, elle frappe cette cible deux fois.", // NEEDS QC
		shortDesc: "Frappe 2 fois. En duo : une fois chaque ennemi.", // NEEDS QC
	},
	dragonenergy: {
		name: "Draco-Énergie",
		// Official flavor text: "Le lanceur utilise son énergie vitale pour attaquer l’ennemi. Moins il a de PV, moins l’attaque est puissante."
		desc: "La puissance est égale à (PV actuels de l'utilisateur × 150 / PV max de l'utilisateur), arrondi à l'inférieur, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Moins de PV = moins puissant. Touche les ennemis.", // NEEDS QC
	},
	dragonhammer: {
		name: "Draco-Marteau",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	dragonpulse: {
		name: "Draco-Choc",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	dragonrage: {
		name: "Draco-Rage",
		shortDesc: "Inflige 40 PV de dégâts à la cible.", // NEEDS QC
	},
	dragonrush: {
		name: "Draco-Charge",
		// Official flavor text: "Le lanceur frappe l’ennemi en prenant un air menaçant. Peut aussi l’apeurer."
		desc: "A 20 % de chances d'apeurer la cible. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "20 % d'apeurer la cible.", // NEEDS QC
		gen5: {
			desc: "A 20 % de chances d'apeurer la cible.", // NEEDS QC
		},
	},
	dragontail: {
		name: "Draco-Queue",
		// Official flavor text: "Un coup puissant qui blesse la cible et l’envoie au loin. Lors d’un combat contre un Pokémon sauvage seul, met fin au combat."
		desc: "Si ni l'utilisateur ni la cible ne sont K.O., la cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Cet effet échoue si la cible a utilisé Racines, a le talent Ventouse, ou si cette capacité a touché un clone.", // NEEDS QC
		shortDesc: "La cible est remplacée par un allié au hasard.", // NEEDS QC
	},
	drainingkiss: {
		name: "Vampibaiser",
		// Official flavor text: "Aspire la force vitale de l’ennemi par un baiser. Rend au lanceur un nombre de PV supérieur ou égal à la moitié des dégâts infligés."
		desc: "L'utilisateur récupère 3/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère 3/4 des dégâts infligés.", // NEEDS QC
	},
	drainpunch: {
		name: "Vampi-Poing",
		// Official flavor text: "Un coup de poing qui draine l’énergie. Convertit la moitié des dégâts infligés en PV pour le lanceur."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	dreameater: {
		name: "Dévorêve",
		// Official flavor text: "Le lanceur mange le rêve de l’ennemi endormi et récupère en PV la moitié des dégâts infligés."
		desc: "La cible n'est pas affectée par cette capacité si elle ne dort pas. L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Récupère la moitié des dégâts. Cible endormie.", // NEEDS QC
		gen4: {
			desc: "N'affecte la cible que si elle dort et n'a pas de clone. L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur.", // NEEDS QC
		},
		gen3: {
			desc: "N'affecte la cible que si elle dort et n'a pas de clone. L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
		},
		gen1: {
			desc: "N'affecte la cible que si elle dort. L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV. Si cette capacité brise le clone de la cible, l'utilisateur ne récupère pas de PV.", // NEEDS QC
		},
	},
	drillpeck: {
		name: "Bec Vrille",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	drillrun: {
		name: "Tunnelier",
		// Official flavor text: "Le lanceur tourne sur lui-même comme une perceuse et se jette sur l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	drumbeating: {
		name: "Tambour Battant",
		// Official flavor text: "Le lanceur bat son tambour pour en diriger les racines sur la cible, l’attaquer, et baisser sa Vitesse."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
	},
	dualchop: {
		name: "Double Baffe",
		// Official flavor text: "Le lanceur frappe l’ennemi deux fois d’affilée avec les parties les plus robustes de son corps."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois en un tour.", // NEEDS QC
	},
	dualwingbeat: {
		name: "Double Volée",
		// Official flavor text: "Le lanceur frappe l’ennemi avec ses ailes deux fois d’affilée."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois en un tour.", // NEEDS QC
	},
	dynamaxcannon: {
		name: "Canon Dynamax",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		gen8: {
			shortDesc: "Dégâts doublés contre les cibles dynamaxées.", // NEEDS QC
		},
	},
	dynamicpunch: {
		name: "Dynamo-Poing",
		// Official flavor text: "Le lanceur rassemble ses forces et envoie un coup de poing à l’ennemi. Rend ce dernier confus."
		desc: "A 100 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "100 % de rendre la cible confuse.", // NEEDS QC
	},
	earthpower: {
		name: "Telluriforce",
		// Official flavor text: "De terribles séismes secouent l’ennemi. Peut aussi baisser sa Défense Spéciale."
		desc: "A 10 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	earthquake: {
		name: "Séisme",
		// Official flavor text: "Le lanceur provoque un tremblement de terre touchant tous les Pokémon autour de lui."
		desc: "Les dégâts sont doublés si la cible utilise Tunnel.", // NEEDS QC
		shortDesc: "Touche les adjacents. Dégâts x2 contre Tunnel.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si la cible utilise Tunnel.", // NEEDS QC
			shortDesc: "Touche les Pokémon adjacents. x2 contre Tunnel.", // NEEDS QC
		},
		gen1: {
			desc: "Aucun effet supplémentaire.", // NEEDS QC
			shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Puissance doublée contre Tunnel.", // NEEDS QC
		},
	},
	echoedvoice: {
		name: "Écho",
		// Official flavor text: "Un cri retentissant blesse l’ennemi. Si le lanceur ou d’autres Pokémon l’utilisent à chaque tour, l’effet augmente."
		desc: "Pour chaque tour consécutif où cette capacité est utilisée par au moins un Pokémon, sa puissance est multipliée par le nombre de tours écoulés, jusqu'à un maximum de 5.", // NEEDS QC
		shortDesc: "Plus puissant à chaque tour consécutif d'utilisation.", // NEEDS QC
	},
	eerieimpulse: {
		name: "Ondes Étranges",
		// Official flavor text: "Le corps du lanceur produit des ondes anormales qui enveloppent l’ennemi et diminuent beaucoup son Attaque Spéciale."
		desc: "Baisse l'Attaque Spéciale de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Atq. Spé de la cible de 2 niveaux.", // NEEDS QC
	},
	eeriespell: {
		name: "Sort Sinistre",
		// Official flavor text: "Le lanceur attaque avec de puissants pouvoirs psychiques et retire 3 PP de la dernière capacité de l’ennemi."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., la cible perd 3 PP sur sa dernière capacité utilisée.", // NEEDS QC
		shortDesc: "Retire 3 PP à la dernière capacité de la cible.", // NEEDS QC

		activate: "#spite",
	},
	eggbomb: {
		name: "Bombe Œuf",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	electricterrain: {
		name: "Champ Électrifié",
		// Official flavor text: "Pendant cinq tours, le terrain se charge d’électricité. Les Pokémon au sol ne peuvent pas s’endormir et la puissance des capacités de type Électrik augmente."
		desc: "Pendant 5 tours, le terrain devient un Champ Électrifié. Pendant l'effet, la puissance des attaques de type Électrik des Pokémon au sol est multipliée par 1,3 et les Pokémon au sol ne peuvent pas s'endormir ; ceux qui dorment déjà ne se réveillent pas. Les Pokémon au sol ne peuvent pas être affectés par Bâillement ni s'endormir à cause de son effet. Camouflage transforme l'utilisateur en type Électrik, Force Nature devient Tonnerre et Force Cachée a 30 % de chances de paralyser. Échoue si le terrain actuel est déjà un Champ Électrifié.", // NEEDS QC
		shortDesc: "5 tours : Électrik +, pas de sommeil au sol.", // NEEDS QC
		gen7: {
			desc: "Pendant 5 tours, un Champ Électrifié est actif. Pendant l'effet, la puissance des attaques de type Électrik des Pokémon au sol est multipliée par 1,5, et les Pokémon au sol ne peuvent pas s'endormir ; ceux qui dorment déjà ne se réveillent pas. Les Pokémon au sol ne peuvent pas être affectés par Bâillement ni s'endormir par son effet. Camouflage transforme l'utilisateur en type Électrik, Force Nature devient Tonnerre, et Force Cachée a 30 % de chances de paralyser. Échoue si un Champ Électrifié est déjà actif.", // NEEDS QC
		},
	},
	electrify: {
		name: "Électrisation",
		// Official flavor text: "Si le lanceur attaque avant la cible, les capacités de celle-ci seront de type Électrik jusqu’à la fin du tour."
		desc: "La capacité de la cible devient de type Électrik ce tour. Parmi les effets qui peuvent changer le type d'une capacité, celui-ci s'applique en dernier. Échoue si la cible a déjà agi ce tour.", // NEEDS QC
		shortDesc: "La capacité de la cible devient Électrik ce tour.", // NEEDS QC

		start: "  Électrisation donne le type Électrik à la prochaine capacité {POKEMON:de} !",
	},
	electroball: {
		name: "Boule Élek",
		// Official flavor text: "Le lanceur envoie une boule d’électricité. Si sa Vitesse est plus grande que celle de l’ennemi, les dégâts augmentent d’autant."
		desc: "La puissance de cette capacité dépend de (Vitesse actuelle de l'utilisateur / Vitesse actuelle de la cible), arrondi à l'inférieur. La puissance est de 150 si le résultat est 4 ou plus, 120 si 3, 80 si 2, 60 si 1, 40 si moins de 1. Si la Vitesse actuelle de la cible est 0, la puissance est de 40.", // NEEDS QC
		shortDesc: "Plus puissant si plus rapide que la cible.", // NEEDS QC
		gen5: {
			desc: "La puissance dépend de (Vitesse actuelle de l'utilisateur ÷ Vitesse actuelle de la cible), arrondi à l'inférieur. Elle est de 150 si le résultat est 4 ou plus, 120 si 3, 80 si 2, 60 si 1, 40 si moins de 1. Si la Vitesse actuelle de la cible est 0, elle est traitée comme 1.", // NEEDS QC
		},
	},
	electrodrift: {
		name: "Turbo Volt",
		// Official flavor text: "Le lanceur change de forme et fonce sur la cible en la perforant d'électricité futuriste. Si la capacité est super efficace, sa puissance augmente encore plus."
		desc: "Les dégâts sont multipliés par 1,3333 si cette capacité est super efficace contre la cible.", // NEEDS QC
		shortDesc: "Dégâts x1,3333 si super efficace.", // NEEDS QC
	},
	electroshot: {
		name: "Fulgurayon",
		// Official flavor text: "Le lanceur absorbe de l'électricité au premier tour, ce qui augmente son Attaque Spéciale, et envoie une puissante décharge au second. S'il pleut, il l'envoie au premier tour."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. Monte l'Attaque Spéciale de l'utilisateur d'un niveau au premier tour. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Pluie battante ou Pluie, la capacité s'exécute en un tour. Si l'utilisateur tient un Parapluie Solide et que la météo est Pluie battante ou Pluie, la capacité nécessite quand même un tour de charge.", // NEEDS QC
		shortDesc: "+1 Atq. Spé, frappe au tour 2. Direct sous la pluie.", // NEEDS QC

		prepare: "{POKEMON} absorbe de l’électricité !",
	},
	electroweb: {
		name: "Toile Élek",
		// Official flavor text: "Attrape l’ennemi dans un filet électrique. Baisse aussi la Vitesse de l’ennemi."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse des ennemis d'un niveau.", // NEEDS QC
	},
	embargo: {
		name: "Embargo",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Pendant 5 tours, l'objet tenu par la cible n'a aucun effet. Les changements de forme causés par un objet ne sont pas affectés, mais tous les autres effets de tels objets sont annulés. Pendant l'effet, la cible ne peut pas utiliser Dégommage ni Don Naturel. Les objets lancés sur la cible avec Dégommage s'activent quand même. Si la cible utilise Relais, son remplaçant reste incapable d'utiliser des objets.", // NEEDS QC
		shortDesc: "5 tours : l'objet de la cible n'a aucun effet.", // NEEDS QC

		start: "  {POKEMON} ne peut plus utiliser d’objets !",
		end: "  {POKEMON} peut de nouveau utiliser des objets !",
	},
	ember: {
		name: "Flammèche",
		// Official flavor text: "L’ennemi est attaqué par une faible flamme. Peut aussi le brûler."
		desc: "A 10 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "10 % de brûler la cible.", // NEEDS QC
	},
	encore: {
		name: "Encore",
		// Official flavor text: "Oblige l’ennemi à répéter la dernière capacité utilisée durant trois tours."
		desc: "Pendant ses 3 prochains tours, la cible est forcée de répéter sa dernière capacité utilisée. Si cette capacité n'a plus de PP, l'effet prend fin. Échoue si la cible est déjà sous cet effet, si elle n'a pas encore agi, si la capacité a 0 PP, ou s'il s'agit de Assistance, Crash Brûlant, Crash Musclé, Photocopie, Canon Dynamax, Encore, Crash Magique, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Crash Toxique, Gribouille, Blabla Dodo, Lutte, Morphing ou Crash Obscur.", // NEEDS QC
		shortDesc: "La cible répète sa dernière capacité pendant 3 tours.", // NEEDS QC
		gen8: {
			desc: "Pendant ses 3 prochains tours, la cible est forcée de répéter sa dernière capacité utilisée. Si la capacité n'a plus de PP, l'effet prend fin. Échoue si la cible est déjà sous cet effet, si elle n'a pas encore agi, si la capacité a 0 PP, si la cible est dynamaxée, ou si la capacité est Assistance, Photocopie, Canon Dynamax, Encore, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Gribouille, Blabla Dodo, Lutte ou Morphing.", // NEEDS QC
		},
		gen7: {
			desc: "Pendant ses 3 prochains tours, la cible est forcée de répéter sa dernière capacité utilisée. Si la capacité n'a plus de PP, l'effet prend fin. Échoue si la cible est déjà sous cet effet, si elle n'a pas encore agi, si la capacité a 0 PP, ou si la capacité est Assistance, Photocopie, Encore, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Gribouille, Blabla Dodo, Lutte ou Morphing ou une capacité Z. Les capacités renforcées par la Force Z peuvent toujours être choisies et exécutées pendant l'effet.", // NEEDS QC
		},
		gen6: {
			desc: "Pendant 3 tours, la cible est forcée de répéter sa dernière capacité utilisée. Si la capacité n'a plus de PP, l'effet prend fin. Échoue si la cible est déjà sous cet effet, si elle n'a pas encore agi, si la capacité a 0 PP, ou si la capacité est Encore, Copie, Mimique, Gribouille, Lutte ou Morphing.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 4 à 8 tours, la cible est forcée de répéter sa dernière capacité utilisée. Si la capacité n'a plus de PP, l'effet prend fin. Échoue si la cible est déjà sous cet effet, si elle n'a pas encore agi, si la capacité a 0 PP, ou si la capacité est Encore, Copie, Mimique, Gribouille, Lutte ou Morphing.", // NEEDS QC
			shortDesc: "La cible répète sa dernière capacité 4-8 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Pendant 3 à 6 tours, la cible est forcée de répéter sa dernière capacité utilisée. Si la capacité n'a plus de PP, l'effet prend fin. Échoue si la cible est déjà sous cet effet, si elle n'a pas encore agi, si la capacité a 0 PP, ou si la capacité est Encore, Copie, Mimique, Gribouille, Lutte ou Morphing.", // NEEDS QC
			shortDesc: "La cible répète sa dernière capacité 3-6 tours.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 3 à 6 tours, la cible est forcée de répéter sa dernière capacité utilisée. Si la capacité n'a plus de PP, l'effet prend fin. Échoue si la cible est déjà sous cet effet, si elle n'a pas encore agi, si la capacité a 0 PP, ou si la capacité est Encore, Métronome, Copie, Mimique, Gribouille, Blabla Dodo, Lutte ou Morphing.", // NEEDS QC
		},

		start: "  {POKEMON} ! Encore une fois !",
		end: "  {POKEMON} n’a plus à répéter la même capacité !",
	},
	endeavor: {
		name: "Effort",
		// Official flavor text: "Une attaque qui réduit les PV de l’ennemi au niveau des PV du lanceur."
		desc: "Inflige à la cible des dégâts égaux à (PV actuels de la cible - PV actuels de l'utilisateur). La cible n'est pas affectée si ses PV actuels sont inférieurs ou égaux à ceux de l'utilisateur.", // NEEDS QC
		shortDesc: "Réduit les PV de la cible à ceux du lanceur.", // NEEDS QC
	},
	endure: {
		name: "Ténacité",
		// Official flavor text: "Le lanceur résiste aux attaques avec 1 PV. Peut échouer si utilisée plusieurs fois de suite."
		desc: "L'utilisateur survit aux attaques des autres Pokémon ce tour avec au moins 1 PV. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Survit aux attaques ce tour avec au moins 1 PV.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur survit aux attaques des autres Pokémon ce tour avec au moins 1 PV. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur survit aux attaques des autres Pokémon ce tour avec au moins 1 PV. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur survit aux attaques des autres Pokémon ce tour avec au moins 1 PV. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée n'est pas Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur survit aux attaques des autres Pokémon ce tour avec au moins 1 PV. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité, Abri, Prévention ou Garde Large. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur survit aux attaques des autres Pokémon ce tour avec au moins 1 PV. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie, jusqu'à un maximum de 8. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur survit aux attaques des autres Pokémon ce tour avec au moins 1 PV. Cette capacité a X chances sur 65536 de réussir, où X commence à 65535 et est divisé par deux, arrondi à l'inférieur, à chaque utilisation réussie. Après la quatrième réussite d'affilée, X tombe à 118 et prend ensuite des valeurs apparemment aléatoires entre 0 et 65535. X revient à 65535 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur survit aux attaques de l'adversaire ce tour avec au moins 1 PV. Cette capacité a X chances sur 255 de réussir, où X commence à 255 et est divisé par deux, arrondi à l'inférieur, à chaque utilisation réussie. X revient à 255 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur a un clone ou agit en dernier ce tour.", // NEEDS QC
		},

		start: "  {POKEMON} se prépare à encaisser les coups !",
		activate: "  {POKEMON} encaisse les coups !",
	},
	energyball: {
		name: "Éco-Sphère",
		// Official flavor text: "Utilise les pouvoirs de la nature pour attaquer l’ennemi. Peut aussi baisser sa Défense Spéciale."
		desc: "A 10 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	entrainment: {
		name: "Ten-Danse",
		// Official flavor text: "Le lanceur danse sur un rythme étrange. Il force sa cible à l’imiter, ce qui lui fait adopter son talent."
		desc: "Le talent de la cible devient le même que celui de l'utilisateur. Échoue si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Absentéisme, Mode Transe ou Supermutation ou le même que celui de l'utilisateur, ou si le talent de l'utilisateur est Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Don Floral, Météo, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Osmose, Paléosynthèse, Charge Quantique, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téra-Carapace, Téramorphose, Téraformation 0, Calque, Garde Mystik, Mode Transe ou Supermutation.", // NEEDS QC
		shortDesc: "Le talent de la cible devient celui du lanceur.", // NEEDS QC
		gen8: {
			desc: "Le talent de la cible devient le même que celui de l'utilisateur. Échoue si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Absentéisme ou Mode Transe ou le même que celui de l'utilisateur, ou si le talent de l'utilisateur est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Dégobage, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque ou Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "Le talent de la cible devient le même que celui de l'utilisateur. Échoue si le talent de la cible est Synergie, Hypersommeil, Fantômasque, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Absentéisme ou Mode Transe ou le même que celui de l'utilisateur, ou si le talent de l'utilisateur est Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Illusion, Imposteur, Multi-Type, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque ou Mode Transe.", // NEEDS QC
		},
		gen6: {
			desc: "Le talent de la cible devient le même que celui de l'utilisateur. Échoue si le talent de la cible est Multi-Type, Déclic Tactique ou Absentéisme ou le même que celui de l'utilisateur, ou si le talent de l'utilisateur est Don Floral, Météo, Illusion, Imposteur, Multi-Type, Déclic Tactique, Calque ou Mode Transe.", // NEEDS QC
		},
		gen5: {
			desc: "Le talent de la cible devient le même que celui de l'utilisateur. Échoue si le talent de la cible est Multi-Type ou Absentéisme ou le même que celui de l'utilisateur, ou si le talent de l'utilisateur est Don Floral, Météo, Illusion, Imposteur, Multi-Type, Calque ou Mode Transe.", // NEEDS QC
		},
	},
	eruption: {
		name: "Éruption",
		// Official flavor text: "Le lanceur laisse exploser sa colère. Plus ses PV sont bas, moins l’attaque est puissante."
		desc: "La puissance est égale à (PV actuels de l'utilisateur × 150 / PV max de l'utilisateur), arrondi à l'inférieur, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Moins de PV = moins puissant. Touche les ennemis.", // NEEDS QC
	},
	esperwing: {
		name: "Ailes Psycho",
		// Official flavor text: "Le lanceur entaille la cible avec ses ailes renforcées par une émanation psychique. Taux de critiques élevé. Cela augmente la Vitesse du lanceur."
		desc: "A 100 % de chances de monter la Vitesse de l'utilisateur d'un niveau et plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "100 % de +1 Vitesse. Taux de critique élevé.", // NEEDS QC
	},
	eternabeam: {
		name: "Laser Infinimax",
		// Official flavor text: "L’attaque la plus puissante d’Éthernatos sous sa forme originelle. S’il l’utilise, il devra se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	expandingforce: {
		name: "Vaste Pouvoir",
		// Official flavor text: "Le lanceur attaque la cible avec ses pouvoirs psychiques. Si un Champ Psychique est actif, la puissance de cette capacité augmente et elle touche tous les ennemis."
		desc: "Si le terrain actuel est un Champ Psychique et que l'utilisateur est au sol, cette capacité touche tous les Pokémon adverses et sa puissance est multipliée par 1,5.", // NEEDS QC
		shortDesc: "Sur champ psychique : x1,5 et touche les ennemis.", // NEEDS QC
	},
	explosion: {
		name: "Explosion",
		// Official flavor text: "Le lanceur explose et inflige des dégâts à tous les Pokémon autour de lui. Met K.O. le lanceur."
		desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité, même si elle échoue faute de cible. Cette capacité ne peut pas s'exécuter si un Pokémon actif a le talent Moiteur.", // NEEDS QC
		shortDesc: "Touche les adjacents. Le lanceur est mis K.O.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité, sauf si elle n'a pas de cible. La Défense de la cible est divisée par deux pendant le calcul des dégâts. Cette capacité n'est pas exécutée si un Pokémon ayant le talent Moiteur est au combat.", // NEEDS QC
			shortDesc: "Déf. adverse réduite de moitié. L'utilisateur : K.O.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité. La Défense de la cible est divisée par deux pendant le calcul des dégâts. Cette capacité n'est pas exécutée si un Pokémon ayant le talent Moiteur est au combat.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité. La Défense de la cible est divisée par deux pendant le calcul des dégâts.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité, sauf si elle a brisé le clone de la cible. La Défense de la cible est divisée par deux pendant le calcul des dégâts.", // NEEDS QC
		},
	},
	extrasensory: {
		name: "Extrasenseur",
		// Official flavor text: "Le lanceur attaque avec un pouvoir étrange et invisible. Peut aussi apeurer l’ennemi."
		desc: "A 10 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "10 % d'apeurer la cible.", // NEEDS QC
		gen3: {
			desc: "A 10 % de chances d'apeurer la cible. Les dégâts sont doublés si la cible a utilisé Lilliput depuis qu'elle est au combat.", // NEEDS QC
		},
	},
	extremeevoboost: {
		name: "Neuf pour Un",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Monte l'Attaque, la Défense, l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "+2 Atq, Déf, Atq. Spé, Déf. Spé et Vit. du lanceur.", // NEEDS QC
	},
	extremespeed: {
		name: "Vitesse Extrême",
		// Official flavor text: "Le lanceur charge à une vitesse renversante. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit presque toujours en premier (priorité +2).", // NEEDS QC
		gen4: {
			shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
		},
	},
	facade: {
		name: "Façade",
		// Official flavor text: "Une attaque dont la puissance double lorsque le lanceur est empoisonné, paralysé ou brûlé."
		desc: "La puissance est doublée si l'utilisateur est brûlé, paralysé ou empoisonné. La réduction de moitié des dégâts physiques due à la brûlure de l'utilisateur est ignorée.", // NEEDS QC
		shortDesc: "Puissance x2 si brûlé, paralysé ou empoisonné.", // NEEDS QC
		gen5: {
			desc: "La puissance est doublée si l'utilisateur est brûlé, paralysé ou empoisonné.", // NEEDS QC
		},
	},
	fairylock: {
		name: "Verrou Enchanté",
		// Official flavor text: "Des chaînes entourent la zone de combat, empêchant tous les Pokémon de fuir au prochain tour."
		desc: "Aucun Pokémon actif ne peut être remplacé au tour suivant. Un Pokémon peut tout de même quitter le combat s'il tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. Échoue si l'effet est déjà actif.", // NEEDS QC
		shortDesc: "Personne ne peut être remplacé au tour suivant.", // NEEDS QC
		gen7: {
			desc: "Empêche tous les Pokémon actifs de quitter le combat au tour suivant. Un Pokémon peut tout de même être remplacé s'il tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. Échoue si l'effet est déjà actif.", // NEEDS QC
		},

		activate: "  Il sera impossible de fuir au tour suivant !",
	},
	fairywind: {
		name: "Vent Féérique",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	fakeout: {
		name: "Bluff",
		// Official flavor text: "Permet de frapper en priorité et apeure l’ennemi. Ne fonctionne qu’au premier tour."
		desc: "A 100 % de chances d'apeurer la cible. Échoue si ce n'est pas le premier tour de l'utilisateur sur le terrain.", // NEEDS QC
		shortDesc: "Agit en premier. 100 % d'apeurer. Premier tour.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	faketears: {
		name: "Croco Larme",
		// Official flavor text: "Le lanceur fait semblant de pleurer pour troubler l’ennemi et beaucoup baisser sa Défense Spéciale."
		desc: "Baisse la Défense Spéciale de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse la Déf. Spé de la cible de 2 niveaux.", // NEEDS QC
	},
	falsesurrender: {
		name: "Fourbette",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	falseswipe: {
		name: "Faux-Chage",
		// Official flavor text: "Le lanceur retient ses coups pour que l’ennemi garde au moins 1 PV et ne tombe pas K.O."
		desc: "Laisse la cible avec au moins 1 PV.", // NEEDS QC
		shortDesc: "Laisse toujours au moins 1 PV à la cible.", // NEEDS QC
	},
	featherdance: {
		name: "Danse Plumes",
		// Official flavor text: "Une montagne de plumes ensevelit l’ennemi et réduit beaucoup son Attaque."
		desc: "Baisse l'Attaque de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Attaque de la cible de 2 niveaux.", // NEEDS QC
	},
	feint: {
		name: "Ruse",
		// Official flavor text: "Une attaque capable de toucher un ennemi qui utilise une capacité comme Détection ou Abri. Annule l’effet de ces capacités."
		desc: "Si cette capacité réussit, elle brise les effets de Blockhaus, Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer ce côté normalement.", // NEEDS QC
		shortDesc: "Annule Détection, Abri et les Gardes.", // NEEDS QC
		gen6: {
			desc: "Si cette capacité réussit, elle brise Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour.", // NEEDS QC
		},
		gen5: {
			desc: "Si cette capacité réussit, elle brise Détection ou Abri de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si la cible est un adversaire et que son côté est protégé par Prévention ou Garde Large, cette protection est aussi brisée pour ce tour.", // NEEDS QC
		},
		gen4: {
			desc: "Échoue si la cible n'utilise pas Détection ou Abri. Si cette capacité réussit, elle brise cette protection pour ce tour, permettant aux autres Pokémon d'attaquer la cible normalement.", // NEEDS QC
			shortDesc: "Brise la protection, sinon échoue.", // NEEDS QC
		},

		activate: "  {TARGET} s’est fait avoir par une ruse !",
	},
	feintattack: {
		name: "Feinte",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	fellstinger: {
		name: "Dard Mortel",
		// Official flavor text: "Augmente énormément l’Attaque du lanceur si un ennemi est mis K.O. avec cette capacité."
		desc: "Monte l'Attaque de l'utilisateur de 3 niveaux si cette capacité met la cible K.O.", // NEEDS QC
		shortDesc: "+3 Attaque si cette capacité met la cible K.O.", // NEEDS QC
		gen6: {
			desc: "Monte l'Attaque de l'utilisateur de 2 niveaux si cette capacité met la cible K.O.", // NEEDS QC
			shortDesc: "Attaque +2 si ce coup met la cible K.O.", // NEEDS QC
		},
	},
	ficklebeam: {
		name: "Laser Hasard",
		shortDesc: "30 % de chances de puissance doublée.", // NEEDS QC

		activate: "  {POKEMON} a pris cette capacité au sérieux !",
	},
	fierydance: {
		name: "Danse du Feu",
		// Official flavor text: "Le lanceur enveloppe l’ennemi de flammes. Peut aussi augmenter l’Attaque Spéciale du lanceur."
		desc: "A 50 % de chances de monter l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "50 % de monter l'Atq. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	fierywrath: {
		name: "Fureur Ardente",
		// Official flavor text: "Le lanceur canalise sa colère et la transforme en aura brûlante, avec laquelle il attaque l’ennemi. Peut aussi l’apeurer."
		desc: "A 20 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "20 % d'apeurer la cible.", // NEEDS QC
	},
	filletaway: {
		name: "Décharnement",
		// Official flavor text: "Le lanceur sacrifie des PV pour beaucoup augmenter son Attaque, son Attaque Spéciale, et sa Vitesse."
		desc: "Monte l'Attaque, l'Attaque Spéciale et la Vitesse de l'utilisateur de 2 niveaux en échange de la moitié de ses PV max, arrondi à l'inférieur. Échoue si l'utilisateur serait mis K.O. ou si ses niveaux d'Attaque, d'Attaque Spéciale et de Vitesse ne changeraient pas.", // NEEDS QC
		shortDesc: "+2 Atq, Atq. Spé et Vit. contre la moitié de ses PV.", // NEEDS QC
	},
	finalgambit: {
		name: "Tout ou Rien",
		// Official flavor text: "Une attaque très risquée. Le lanceur perd tous ses PV restants et inflige autant de dégâts à l’ennemi."
		desc: "Inflige à la cible des dégâts égaux aux PV actuels de l'utilisateur. Si cette capacité réussit, l'utilisateur est mis K.O.", // NEEDS QC
		shortDesc: "Inflige ses PV actuels en dégâts et est mis K.O.", // NEEDS QC
	},
	fireblast: {
		name: "Déflagration",
		// Official flavor text: "Un déluge de flammes ardentes submerge l’ennemi. Peut aussi le brûler."
		desc: "A 10 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "10 % de brûler la cible.", // NEEDS QC
		gen1: {
			desc: "A 30 % de chances de brûler la cible.", // NEEDS QC
			shortDesc: "30 % de brûler la cible.", // NEEDS QC
		},
	},
	firefang: {
		name: "Crocs Feu",
		// Official flavor text: "Le lanceur utilise une morsure enflammée. Peut aussi brûler ou apeurer l’ennemi."
		desc: "A 10 % de chances de brûler la cible et 10 % de chances de l'apeurer.", // NEEDS QC
		shortDesc: "10 % de brûler. 10 % d'apeurer.", // NEEDS QC
		gen4: {
			desc: "A 10 % de chances de brûler la cible et 10 % de chances de l'apeurer. Cette capacité peut toucher les Pokémon ayant le talent Garde Mystik quel que soit leur type.", // NEEDS QC
		},
	},
	firelash: {
		name: "Fouet de Feu",
		// Official flavor text: "Frappe la cible avec un fouet incandescent et baisse sa Défense."
		desc: "A 100 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	firepledge: {
		name: "Aire de Feu",
		// Official flavor text: "Une masse de feu s’abat sur l’ennemi. En l’utilisant avec Aire d’Herbe, l’effet augmente et une mer de feu apparaît."
		desc: "Si un des alliés de l'utilisateur a choisi d'utiliser Aire d’Herbe ou Aire d’Eau ce tour et n'a pas encore agi, il agit immédiatement après l'utilisateur et la capacité de l'utilisateur ne fait rien. Combinée avec Aire d’Herbe, l'allié utilise Aire de Feu avec 150 de puissance et une mer de feu apparaît du côté de la cible pendant 4 tours, infligeant aux Pokémon non-Feu des dégâts égaux à 1/8 de leurs PV max, arrondi à l'inférieur, à la fin de chaque tour de l'effet, dernier tour compris. Combinée avec Aire d’Eau, l'allié utilise Aire d’Eau avec 150 de puissance et un arc-en-ciel apparaît du côté de l'utilisateur pendant 4 tours, doublant les chances d'effet secondaire, cumulable avec le talent Sérénité, sauf pour les effets qui apeurent, dont la chance ne peut être doublée qu'une fois. Utilisée en capacité combinée, cette capacité bénéficie du STAB quel que soit le type de l'utilisateur. Cette capacité ne consomme pas la Joyau Feu de l'utilisateur.", // NEEDS QC
		shortDesc: "À combiner avec les autres Vœux pour plus d'effets.", // NEEDS QC

		activate: "#waterpledge",
		start: "  {TEAM:capitalize} est cernée par une mer de feu !",
		end: "  La mer de feu autour de {TEAM} a disparu !",
		damage: "  {POKEMON} est plongé dans un océan de feu !",
	},
	firepunch: {
		name: "Poing Feu",
		// Official flavor text: "Un coup de poing enflammé vient frapper l’ennemi. Peut le brûler."
		desc: "A 10 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "10 % de brûler la cible.", // NEEDS QC
	},
	firespin: {
		name: "Danse Flammes",
		// Official flavor text: "Un tourbillon de flammes emprisonne l’ennemi pendant quatre à cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max (1/8 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours (toujours cinq si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
			shortDesc: "Piège et blesse la cible pendant 2-5 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours. Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle utilise Relais. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur utilise cette capacité pendant deux à cinq tours. A 3/8 de chances de durer deux ou trois tours et 1/8 de chances de durer quatre ou cinq tours. Les dégâts calculés au premier tour sont repris pour chaque autre tour. L'utilisateur ne peut pas choisir de capacité et la cible ne peut pas exécuter de capacité pendant l'effet, mais tous deux peuvent être remplacés. Si l'utilisateur est remplacé, la cible reste incapable d'agir ce tour-là. Si la cible est remplacée, l'utilisateur utilise à nouveau cette capacité automatiquement, et si elle avait 0 PP à ce moment, ils passent à 63. Si l'utilisateur ou la cible est remplacé, ou si l'utilisateur est empêché d'agir, l'effet prend fin. Cette capacité peut empêcher la cible d'agir même si elle a une immunité de type, mais n'inflige alors pas de dégâts.", // NEEDS QC
			shortDesc: "La cible ne peut pas agir pendant 2-5 tours.", // NEEDS QC
		},

		start: "  {POKEMON} est piégé dans un tourbillon de feu !",
		move: "#wrap",
	},
	firstimpression: {
		name: "Escarmouche",
		// Official flavor text: "Une capacité très puissante, mais qui ne fonctionne qu’au premier tour."
		desc: "Échoue si ce n'est pas le premier tour de l'utilisateur sur le terrain.", // NEEDS QC
		shortDesc: "Agit presque toujours en premier. Premier tour.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	fishiousrend: {
		name: "Branchicrok",
		// Official flavor text: "Le lanceur mord sa cible avec ses solides branchies. Si cette capacité est lancée avant que la cible n’attaque, elle infligera deux fois plus de dégâts."
		desc: "La puissance est doublée si l'utilisateur agit avant la cible.", // NEEDS QC
		shortDesc: "Puissance doublée si le lanceur agit avant la cible.", // NEEDS QC
	},
	fissure: {
		name: "Abîme",
		// Official flavor text: "Le lanceur fait tomber l’ennemi dans une crevasse. Si cette attaque réussit, elle met K.O. sur le coup."
		desc: "Inflige à la cible des dégâts égaux à ses PV max. Ignore les modificateurs de précision et d'esquive. La précision de cette attaque est égale à (niveau de l'utilisateur - niveau de la cible + 30) %, et elle échoue si la cible est d'un niveau supérieur. Les Pokémon ayant le talent Fermeté sont immunisés.", // NEEDS QC
		shortDesc: "K.O. en un coup. Échoue si niveau inférieur.", // NEEDS QC
		gen2: {
			desc: "Inflige 65535 dégâts à la cible. La précision de cette capacité sur 256 est égale au plus petit de (2 × (niveau de l'utilisateur − niveau de la cible) + 76) et 255, avant d'appliquer les modificateurs de Précision et d'Esquive. Échoue si la cible est de niveau supérieur. Peut toucher une cible utilisant Tunnel.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige 65535 dégâts à la cible. Échoue si la Vitesse de la cible est supérieure à celle de l'utilisateur.", // NEEDS QC
			shortDesc: "65535 dégâts. Échoue si la cible est plus rapide.", // NEEDS QC
		},
	},
	flail: {
		name: "Gigotage",
		// Official flavor text: "Le lanceur attaque en gigotant dans tous les sens. Plus ses PV sont bas, plus l’attaque est puissante."
		desc: "La puissance de cette capacité est de 20 si X est entre 33 et 48, 40 si X est entre 17 et 32, 80 si X est entre 10 et 16, 100 si X est entre 5 et 9, 150 si X est entre 2 et 4, et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 48 / PV max de l'utilisateur), arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Plus puissant si le lanceur a peu de PV.", // NEEDS QC
		gen4: {
			desc: "La puissance est de 20 si X va de 43 à 48, 40 de 22 à 42, 80 de 13 à 21, 100 de 6 à 12, 150 de 2 à 5 et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 64 ÷ PV max de l'utilisateur), arrondi à l'inférieur.", // NEEDS QC
		},
		gen3: {
			desc: "La puissance de cette capacité est de 20 si X est entre 33 et 48, 40 si X est entre 17 et 32, 80 si X est entre 10 et 16, 100 si X est entre 5 et 9, 150 si X est entre 2 et 4, et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 48 / PV max de l'utilisateur), arrondi à l'inférieur.", // NEEDS QC
		},
		gen2: {
			desc: "La puissance est de 20 si X va de 33 à 48, 40 de 17 à 32, 80 de 10 à 16, 100 de 5 à 9, 150 de 2 à 4 et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 48 ÷ PV max de l'utilisateur), arrondi à l'inférieur. Cette capacité n'a pas de variance de dégâts et ne peut pas être un coup critique.", // NEEDS QC
		},
	},
	flameburst: {
		name: "Rebondifeu",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Si cette capacité réussit, l'allié de la cible perd 1/16 de ses PV max, arrondi à l'inférieur, sauf s'il a le talent Garde Magik.", // NEEDS QC
		shortDesc: "Blesse aussi les Pokémon à côté de la cible.", // NEEDS QC
		gen6: {
			desc: "Si cette capacité réussit, chaque allié adjacent à la cible perd 1/16 de ses PV max, arrondi à l'inférieur, sauf s'il a le talent Garde Magik.", // NEEDS QC
		},

		damage: "  {POKEMON} est arrosé d’une gerbe de flammes !",
	},
	flamecharge: {
		name: "Nitrocharge",
		// Official flavor text: "Le lanceur s’entoure de flammes pour attaquer l’ennemi. Il se concentre et sa Vitesse augmente."
		desc: "A 100 % de chances de monter la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "100 % de monter la Vitesse du lanceur d'un niveau.", // NEEDS QC
	},
	flamethrower: {
		name: "Lance-Flammes",
		// Official flavor text: "L’ennemi reçoit un torrent de flammes. Peut aussi le brûler."
		desc: "A 10 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "10 % de brûler la cible.", // NEEDS QC
	},
	flamewheel: {
		name: "Roue de Feu",
		// Official flavor text: "Le lanceur s’entoure de feu et charge l’ennemi. Peut aussi le brûler."
		desc: "A 10 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "10 % de brûler. Dégèle le lanceur.", // NEEDS QC
	},
	flareblitz: {
		name: "Boutefeu",
		// Official flavor text: "Le lanceur s’embrase avant de charger l’ennemi. Le choc blesse aussi gravement le lanceur. Peut brûler l’ennemi."
		desc: "A 10 % de chances de brûler la cible. Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 33 % des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup 33 %. 10 % de brûler. Dégèle le lanceur.", // NEEDS QC
		gen4: {
			desc: "A 10 % de chances de brûler la cible. Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/3 des PV perdus, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
			shortDesc: "1/3 contrecoup. 10 % de brûler. Dégèle l'utilisateur.", // NEEDS QC
		},
	},
	flash: {
		name: "Flash",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
	},
	flashcannon: {
		name: "Luminocanon",
		// Official flavor text: "Le lanceur concentre son énergie lumineuse et la fait exploser. Peut aussi baisser la Défense Spéciale de l’ennemi."
		desc: "A 10 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	flatter: {
		name: "Flatterie",
		// Official flavor text: "Rend la cible confuse, mais augmente son Attaque Spéciale."
		desc: "Monte l'Attaque Spéciale de la cible d'un niveau et la rend confuse.", // NEEDS QC
		shortDesc: "+1 Atq. Spé de la cible et la rend confuse.", // NEEDS QC
	},
	fleurcannon: {
		name: "Canon Floral",
		// Official flavor text: "Envoie un rayon laser dévastateur. Baisse beaucoup l’Attaque Spéciale du lanceur."
		desc: "Baisse l'Attaque Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Atq. Spé du lanceur de 2 niveaux.", // NEEDS QC
	},
	fling: {
		name: "Dégommage",
		// Official flavor text: "Le lanceur envoie l’objet qu’il tient sur l’ennemi. La puissance et les effets dépendent de l’objet."
		desc: "La puissance de cette capacité dépend de l'objet tenu par l'utilisateur. L'objet tenu est perdu et s'active sur la cible le cas échéant. S'il n'y a pas de cible ou qu'elle évite cette capacité en se protégeant, l'objet est quand même perdu. L'utilisateur peut récupérer un objet lancé avec Recyclage ou le talent Récolte. Échoue si l'utilisateur n'a pas d'objet tenu, si l'objet ne peut pas être lancé, si l'utilisateur est sous l'effet d'Embargo ou de Zone Magique, ou s'il a le talent Maladresse.", // NEEDS QC
		shortDesc: "Lance son objet sur la cible. Puissance variable.", // NEEDS QC
		gen4: {
			desc: "La puissance de cette capacité dépend de l'objet tenu par l'utilisateur. L'objet est perdu et s'active sur la cible le cas échéant. Si la cible évite cette capacité en se protégeant, l'objet est tout de même perdu. Un objet lancé peut être récupéré avec Recyclage. Échoue si l'utilisateur n'a pas d'objet, si l'objet ne peut pas être lancé, ou si l'utilisateur est sous l'effet d'Embargo.", // NEEDS QC
		},

		removeItem: "  {POKEMON} lance {ITEM:indefinite:classified} !",
	},
	flipturn: {
		name: "Eau Revoir",
		// Official flavor text: "Après son attaque, le lanceur revient à toute vitesse et change de place avec un Pokémon de l’équipe prêt au combat."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O., ou si la cible a été remplacée grâce à un Bouton Fuite ou aux talents Repli Tactique ou Escampette.", // NEEDS QC
		shortDesc: "Le lanceur se retire après avoir blessé la cible.", // NEEDS QC

		switchOut: "#uturn",
	},
	floatyfall: {
		name: "Pika-Piqué",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	floralhealing: {
		name: "Soin Floral",
		// Official flavor text: "Rend la moitié de ses PV max à la cible. Plus efficace sur un Champ Herbu."
		desc: "La cible récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5. Si le terrain est un Champ Herbu, elle récupère 2/3 de ses PV max, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "La cible récupère la moitié de ses PV max.", // NEEDS QC
	},
	flowershield: {
		name: "Garde Florale",
		// Official flavor text: "Grâce à une force mystérieuse, la Défense de tous les Pokémon Plante au combat augmente."
		desc: "Monte la Défense de tous les Pokémon actifs de type Plante d'un niveau. Échoue s'il n'y a aucun Pokémon actif de type Plante.", // NEEDS QC
		shortDesc: "+1 Défense de tous les types Plante au combat.", // NEEDS QC
	},
	flowertrick: {
		name: "Magie Florale",
		// Official flavor text: "Le lanceur attaque en jetant un bouquet de fleurs piégé sur la cible. N'échoue jamais et inflige toujours un coup critique."
		desc: "Cette capacité porte toujours un coup critique, sauf si la cible est sous l'effet de Air Veinard ou a le talent Armurbaston ou Coque Armure. Cette capacité ne vérifie pas la précision.", // NEEDS QC
		shortDesc: "Toujours critique et ne vérifie pas la précision.", // NEEDS QC
	},
	fly: {
		name: "Vol",
		// Official flavor text: "Le lanceur s’envole au premier tour et frappe au second."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Vent Violent, Stratopercut, Anti-Air, Myria-Flèches, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "S'envole au tour 1, frappe au tour 2.", // NEEDS QC
		gen5: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Vent Violent, Stratopercut, Anti-Air, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen4: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Stratopercut, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen3: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Stratopercut, Fatal-Foudre et Ouragan, et Tornade et Ouragan ont leur puissance doublée contre lui.", // NEEDS QC
		},
		gen2: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Tornade, Fatal-Foudre, Ouragan et Cyclone, et Tornade et Ouragan ont leur puissance doublée contre lui.", // NEEDS QC
		},
		gen1: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques sauf Patience, Météores et Morphing. Si l'utilisateur est totalement paralysé au second tour, il continue d'éviter les attaques jusqu'à ce qu'il soit remplacé ou exécute avec succès le second tour de cette capacité ou de Tunnel.", // NEEDS QC
		},

		prepare: "{POKEMON} s’envole !",
	},
	flyingpress: {
		name: "Flying Press",
		// Official flavor text: "Une attaque en piqué depuis le ciel, à la fois de type Combat et de type Vol."
		desc: "Cette capacité combine le type Vol dans son efficacité contre la cible. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "Combine le type Vol dans son efficacité.", // NEEDS QC
	},
	focusblast: {
		name: "Exploforce",
		// Official flavor text: "Le lanceur rassemble ses forces et laisse éclater son pouvoir. Peut aussi baisser la Défense Spéciale de l’ennemi."
		desc: "A 10 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	focusenergy: {
		name: "Puissance",
		// Official flavor text: "Le lanceur prend une profonde inspiration et se concentre pour augmenter son taux de critiques."
		desc: "Monte le taux de critique de l'utilisateur de 2 niveaux. Échoue si l'utilisateur a déjà cet effet. Relais peut transmettre cet effet à un allié.", // NEEDS QC
		shortDesc: "Monte le taux de critique du lanceur de 2 niveaux.", // NEEDS QC
		gen2: {
			desc: "Monte le taux de coups critiques de l'utilisateur d'un niveau. Échoue si l'utilisateur a déjà l'effet. Cet effet peut être transmis par Relais.", // NEEDS QC
			shortDesc: "Monte le taux de critique de l'utilisateur de 1.", // NEEDS QC
		},
		gen1: {
			desc: "Tant que l'utilisateur reste au combat, son taux de coups critiques est divisé par quatre. Échoue si l'utilisateur a déjà l'effet. Si un Pokémon utilise Buée Noire, l'effet prend fin.", // NEEDS QC
			shortDesc: "Divise par 4 le taux de critique de l'utilisateur.", // NEEDS QC
		},

		start: "  {POKEMON} est prêt à tout donner !",
		startFromItem: "  {POKEMON} est plein d’énergie grâce {ITEM:a:definite:classified} !",
		startFromZEffect: "  {POKEMON} utilise la Force Z pour augmenter son taux de critiques !",
	},
	focuspunch: {
		name: "Mitra-Poing",
		// Official flavor text: "Le lanceur se concentre avant d’attaquer. Échoue s’il est touché avant d’avoir frappé."
		desc: "L'utilisateur perd sa concentration et ne fait rien s'il est touché par une attaque infligeant des dégâts ce tour avant de pouvoir exécuter cette capacité.", // NEEDS QC
		shortDesc: "Échoue si le lanceur est blessé avant d'agir.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur perd sa concentration et ne fait rien s'il est touché par une attaque ce tour avant de pouvoir exécuter la capacité, mais il perd tout de même des PP.", // NEEDS QC
		},

		start: "  {POKEMON} se concentre au maximum !",
		cant: "{POKEMON} n’est plus concentré. Il ne peut plus utiliser sa capacité !",
	},
	followme: {
		name: "Par Ici",
		// Official flavor text: "Attire l’attention des ennemis pour les forcer à n’attaquer que le lanceur."
		desc: "Jusqu'à la fin du tour, toutes les attaques à cible unique du côté adverse sont redirigées vers l'utilisateur. Ces attaques sont redirigées avant de pouvoir être renvoyées par Reflet Magik ou le talent Miroir Magik, ou attirées par les talents Paratonnerre ou Lavabo. Échoue si ce n'est ni un Combat Duo ni un Combat Royal. Cet effet est ignoré tant que l'utilisateur est sous l'effet de Chute Libre.", // NEEDS QC
		shortDesc: "Les capacités ennemies visent le lanceur ce tour.", // NEEDS QC
		gen6: {
			desc: "Jusqu'à la fin du tour, toutes les attaques mono-cible du côté adverse sont redirigées vers l'utilisateur s'il est à portée. Ces attaques sont redirigées avant de pouvoir être renvoyées par Reflet Magik ou le talent Miroir Magik, ou attirées par les talents Paratonnerre ou Lavabo. Échoue si ce n'est pas un Combat Duo ou Trio. Cet effet est ignoré tant que l'utilisateur est sous l'effet de Chute Libre.", // NEEDS QC
		},
		gen4: {
			desc: "Jusqu'à la fin du tour, toutes les attaques mono-cible du côté adverse sont redirigées vers l'utilisateur. Ces attaques sont redirigées avant de pouvoir être renvoyées par Reflet Magik, ou attirées par les talents Paratonnerre ou Lavabo. Cet effet reste actif même si l'utilisateur quitte le terrain. Échoue si ce n'est pas un Combat Duo.", // NEEDS QC
		},
		gen3: {
			desc: "Jusqu'à la fin du tour, toutes les attaques mono-cible du côté adverse sont redirigées vers l'utilisateur. Ces attaques sont redirigées avant de pouvoir être renvoyées par Reflet Magik, ou attirées par le talent Paratonnerre. Cet effet reste actif même si l'utilisateur quitte le terrain. Échoue si ce n'est pas un Combat Duo.", // NEEDS QC
		},

		start: "  {POKEMON} devient le centre de l’attention !",
		startFromZEffect: "  {POKEMON} devient le centre de l’attention !",
	},
	forcepalm: {
		name: "Forte-Paume",
		// Official flavor text: "Une onde de choc frappe l’ennemi. Peut aussi paralyser la cible."
		desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "30 % de paralyser la cible.", // NEEDS QC
	},
	foresight: {
		name: "Clairvoyance",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Tant que la cible reste au combat, son niveau d'esquive est ignoré dans les calculs de précision contre elle s'il est supérieur à 0, et les attaques de type Normal et Combat peuvent la toucher si elle est de type Spectre. Échoue si la cible est déjà affectée par cet effet, par Œil Miracle ou par Flair.", // NEEDS QC
		shortDesc: "Combat et Normal touchent Spectre. Ignore esquive.", // NEEDS QC
		gen4: {
			desc: "Tant que la cible reste au combat, son niveau d'Esquive est ignoré lors des tests de précision contre elle s'il est supérieur à 0, et les attaques de type Normal et Combat peuvent la toucher même si elle est de type Spectre.", // NEEDS QC
		},
		gen3: {
			desc: "Tant que la cible reste au combat, son niveau d'Esquive est ignoré lors des tests de précision contre elle, et les attaques de type Normal et Combat peuvent la toucher même si elle est de type Spectre.", // NEEDS QC
		},
		gen2: {
			desc: "Tant que la cible reste au combat, si son niveau d'Esquive est supérieur au niveau de Précision de l'attaquant, les deux sont ignorés lors des tests de précision, et les attaques de type Normal et Combat peuvent la toucher même si elle est de type Spectre. Si la cible quitte le terrain avec Relais, son remplaçant reste sous cet effet. Échoue si la cible est déjà affectée.", // NEEDS QC
		},

		start: "  {POKEMON} est identifié !",
	},
	forestscurse: {
		name: "Maléfice Sylvain",
		// Official flavor text: "La cible est charmée par l’esprit de la forêt. Le type Plante est ajouté à ses types actuels."
		desc: "Ajoute le type Plante à la cible, qui a alors deux ou trois types. Échoue si la cible est déjà de type Plante. Si Halloween ajoute un type à la cible, il remplace celui ajouté par cette capacité et inversement.", // NEEDS QC
		shortDesc: "Ajoute le type Plante à la cible.", // NEEDS QC
	},
	foulplay: {
		name: "Tricherie",
		// Official flavor text: "Le lanceur utilise la force de l’ennemi. Plus l’Attaque de l’ennemi est élevée, plus le lanceur inflige de dégâts."
		desc: "Les dégâts sont calculés en utilisant l'Attaque de la cible, changements de niveaux compris. Le talent, l'objet et la brûlure de l'utilisateur s'appliquent normalement.", // NEEDS QC
		shortDesc: "Utilise l'Attaque de la cible dans le calcul.", // NEEDS QC
	},
	freezedry: {
		name: "Lyophilisation",
		// Official flavor text: "Refroidit violemment l’ennemi et peut le geler. Super efficace sur les Pokémon de type Eau."
		desc: "A 10 % de chances de geler la cible. L'efficacité de cette capacité contre le type Eau devient super efficace, quel que soit le type de cette capacité.", // NEEDS QC
		shortDesc: "10 % de geler. Super efficace contre l'Eau.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	freezeshock: {
		name: "Éclair Gelé",
		// Official flavor text: "Projette un bloc de glace électrifié sur l’ennemi au second tour. Peut aussi le paralyser."
		desc: "A 30 % de chances de paralyser la cible. Cette attaque se charge au premier tour et s'exécute au second. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Charge, frappe au tour 2. 30 % de paralysie.", // NEEDS QC

		prepare: "  {POKEMON} est baigné d’une lumière blafarde !",
	},
	freezingglare: {
		name: "Regard Glaçant",
		// Official flavor text: "Les yeux du lanceur tirent des rayons psychiques. Peut aussi geler l’ennemi."
		desc: "A 10 % de chances de geler la cible.", // NEEDS QC
		shortDesc: "10 % de geler la cible.", // NEEDS QC
	},
	freezyfrost: {
		name: "Évo-Congélo",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Remet à 0 les niveaux de statistiques de tous les Pokémon actifs.", // NEEDS QC
		shortDesc: "Annule tous les changements de stats.", // NEEDS QC
	},
	frenzyplant: {
		name: "Végé-Attaque",
		// Official flavor text: "Un violent coup de racines s’abat sur l’ennemi. Immobilise le lanceur au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	frostbreath: {
		name: "Souffle Glacé",
		// Official flavor text: "Un souffle froid blesse l’ennemi. L’effet est toujours critique."
		desc: "Cette capacité porte toujours un coup critique, sauf si la cible est sous l'effet de Air Veinard ou a le talent Armurbaston ou Coque Armure.", // NEEDS QC
		shortDesc: "Porte toujours un coup critique.", // NEEDS QC
	},
	frustration: {
		name: "Frustration",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est égale à ((255 - bonheur de l'utilisateur) × 2/5), arrondi à l'inférieur, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Puissance max (102) avec le bonheur minimal.", // NEEDS QC
	},
	furyattack: {
		name: "Furie",
		// Official flavor text: "Frappe l’ennemi deux à cinq fois d’affilée avec un bec ou une corne, par exemple."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour chaque coup. Si un des coups brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	furycutter: {
		name: "Taillade",
		// Official flavor text: "Un coup de faux ou de griffe dont la force augmente quand il touche plusieurs fois d’affilée."
		desc: "La puissance double à chaque coup réussi, jusqu'à un maximum de 160. La puissance est réinitialisée si cette capacité rate ou si une autre capacité est utilisée.", // NEEDS QC
		shortDesc: "Puissance doublée à chaque coup, jusqu'à 160.", // NEEDS QC
	},
	furyswipes: {
		name: "Combo-Griffe",
		// Official flavor text: "L’ennemi est lacéré par des faux ou des griffes de deux à cinq fois d’affilée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour chaque coup. Si un des coups brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	fusionbolt: {
		name: "Éclair Croix",
		// Official flavor text: "Projette un orbe électrique gigantesque. L’effet augmente sous l’influence de Flamme Croix."
		desc: "La puissance est doublée si la dernière capacité utilisée par un Pokémon ce tour était Flamme Croix.", // NEEDS QC
		shortDesc: "Puissance x2 après Flamme Croix ce tour.", // NEEDS QC
	},
	fusionflare: {
		name: "Flamme Croix",
		// Official flavor text: "Projette une boule de feu gigantesque. L’effet augmente sous l’influence d’Éclair Croix."
		desc: "La puissance est doublée si la dernière capacité utilisée par un Pokémon ce tour était Éclair Croix.", // NEEDS QC
		shortDesc: "Puissance x2 après Éclair Croix ce tour.", // NEEDS QC
	},
	futuresight: {
		name: "Prescience",
		// Official flavor text: "De l’énergie psychique vient frapper l’ennemi deux tours après l’utilisation de cette capacité."
		desc: "Inflige des dégâts deux tours après l'utilisation de cette capacité. À la fin de ce tour, les dégâts sont calculés à ce moment-là et infligés au Pokémon occupant la position que la cible avait quand la capacité a été utilisée. Si l'utilisateur n'est plus au combat à ce moment, les dégâts sont calculés à partir de son Attaque Spéciale naturelle, de ses types et de son niveau, sans bonus de son objet tenu ou de son talent. Échoue si cette capacité ou Vœu Destructeur est déjà en effet pour la position de la cible.", // NEEDS QC
		shortDesc: "Frappe deux tours après son utilisation.", // NEEDS QC
		gen4: {
			desc: "Inflige deux tours après son utilisation des dégâts sans type qui ne peuvent pas être un coup critique. Les dégâts sont calculés contre la cible au moment de l'utilisation et infligés à la fin du dernier tour au Pokémon occupant la position initiale de la cible. Échoue si cette capacité ou Vœu Destructeur est déjà en cours pour la position de la cible.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige deux tours après son utilisation des dégâts sans type qui ne peuvent pas être un coup critique. Les dégâts sont calculés contre la cible au moment de l'utilisation et infligés à la fin du dernier tour au Pokémon occupant la position initiale de la cible. Échoue si cette capacité est déjà en cours pour la position de la cible.", // NEEDS QC
		},

		start: "  {POKEMON} prévoit une attaque !",
		activate: "  {TARGET} subit l’attaque Prescience !",
	},
	gastroacid: {
		name: "Suc Digestif",
		// Official flavor text: "Le lanceur répand ses sucs digestifs sur l’ennemi. Le fluide neutralise le talent de l’ennemi."
		desc: "Le talent de la cible est rendu inactif tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant reste sous cet effet. Si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Mode Transe ou Supermutation, cette capacité échoue, et recevoir l'effet via Relais y met fin immédiatement.", // NEEDS QC
		shortDesc: "Annule le talent de la cible.", // NEEDS QC
		gen8: {
			desc: "Le talent de la cible est rendu inactif tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant reste sous cet effet. Si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe, cette capacité échoue, et recevoir l'effet via Relais y met fin immédiatement.", // NEEDS QC
		},
		gen7: {
			desc: "Le talent de la cible est rendu inactif tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant reste sous cet effet. Si le talent de la cible est Synergie, Hypersommeil, Fantômasque, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe, cette capacité échoue, et recevoir l'effet via Relais y met fin immédiatement.", // NEEDS QC
		},
		gen6: {
			desc: "Le talent de la cible est rendu inactif tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant reste sous cet effet. Si le talent de la cible est Multi-Type ou Déclic Tactique, cette capacité échoue, et recevoir l'effet via Relais y met fin immédiatement.", // NEEDS QC
		},

		start: "  Le talent {POKEMON:de} a été rendu inactif !",
	},
	geargrind: {
		name: "Lancécrou",
		// Official flavor text: "Le lanceur jette deux écrous d’acier qui frappent l’ennemi deux fois d’affilée."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois en un tour.", // NEEDS QC
	},
	gearup: {
		name: "Engrenage",
		// Official flavor text: "Change de réglage pour augmenter l’Attaque et l’Attaque Spéciale des alliés ayant les talents Plus ou Moins."
		desc: "Monte l'Attaque et l'Attaque Spéciale des Pokémon de l'équipe de l'utilisateur ayant le talent Plus ou Moins d'un niveau.", // NEEDS QC
		shortDesc: "+1 Atq et Atq. Spé des alliés avec Plus/Moins.", // NEEDS QC
	},
	genesissupernova: {
		name: "Supernova Originelle",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Si cette capacité réussit, le terrain devient un Champ Psychique.", // NEEDS QC
		shortDesc: "Invoque un champ psychique.", // NEEDS QC
	},
	geomancy: {
		name: "Géo-Contrôle",
		// Official flavor text: "Le lanceur absorbe de l’énergie au premier tour et augmente beaucoup son Attaque Spéciale, sa Défense Spéciale et sa Vitesse au second."
		desc: "Monte l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur de 2 niveaux. Cette attaque se charge au premier tour et s'exécute au second. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Charge, puis +2 Atq. Spé, Déf. Spé et Vit. au tour 2.", // NEEDS QC

		prepare: "{POKEMON} concentre son énergie !",
	},
	gigadrain: {
		name: "Giga-Sangsue",
		// Official flavor text: "Une attaque qui convertit la moitié des dégâts infligés en PV pour le lanceur."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	gigaimpact: {
		name: "Giga Impact",
		// Official flavor text: "Le lanceur charge l’ennemi de toute sa puissance et doit ensuite se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	gigatonhammer: {
		name: "Marteau Mastoc",
		shortDesc: "Ne peut pas être choisie deux tours de suite.", // NEEDS QC
	},
	gigavolthavoc: {
		name: "Fulguro-Lance Gigavolt",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	glaciallance: {
		name: "Lance de Glace",
		// Official flavor text: "Le lanceur attaque l’ennemi avec une lance de glace entourée d’un blizzard."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis adjacents.", // NEEDS QC
	},
	glaciate: {
		name: "Ère Glaciaire",
		// Official flavor text: "Un souffle de vent qui congèle tout sur son passage s’abat sur l’ennemi. Réduit aussi sa Vitesse."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse des ennemis d'un niveau.", // NEEDS QC
	},
	glaiverush: {
		name: "Charge Glaive",
		// Official flavor text: "Le lanceur se jette dans une charge inconsciente sur la cible. Une fois cette capacité utilisée, toute attaque sur le lanceur inflige le double de dégâts et n'échoue jamais."
		desc: "Si cette capacité réussit, les capacités ciblant l'utilisateur infligent le double de dégâts et ne vérifient pas la précision jusqu'à sa prochaine action.", // NEEDS QC
		shortDesc: "Subit des dégâts x2 assurés jusqu'à son prochain tour.", // NEEDS QC
	},
	glare: {
		name: "Regard Médusant",
		// Official flavor text: "Le lanceur intimide l’ennemi grâce à son regard terrifiant pour le paralyser."
		desc: "Paralyse la cible.", // NEEDS QC
		shortDesc: "Paralyse la cible.", // NEEDS QC
		gen3: {
			desc: "Paralyse la cible. Cette capacité n'ignore pas l'immunité de type.", // NEEDS QC
		},
		gen1: {
			desc: "Paralyse la cible.", // NEEDS QC
		},
	},
	glitzyglow: {
		name: "Évo-Psycho",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette capacité invoque Mur Lumière pendant 5 tours.", // NEEDS QC
		shortDesc: "Invoque Mur Lumière.", // NEEDS QC
	},
	gmaxbefuddle: {
		name: "Illusion G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse s'endort, est empoisonné ou est paralysé, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : somm., psn ou par.", // NEEDS QC
	},
	gmaxcannonade: {
		name: "Canonnade G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, pendant 4 tours, chaque Pokémon non-Eau du côté adverse subit des dégâts égaux à 1/6 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour de l'effet, dernier tour compris.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1/6 PV.", // NEEDS QC

		start: "  La violence des courants frappe {PARTY} !",
		damage: "  {POKEMON} subit la violence du tourbillon provoqué par Canonnade G-Max !",
	},
	gmaxcentiferno: {
		name: "Combustion G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse ne peut plus quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe), même derrière un clone. Leur inflige des dégâts égaux à 1/8 de leurs PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. Ils peuvent tout de même être remplacés s'ils tiennent une Carapace Mue ou utilisent Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin pour une cible si elle quitte le terrain ou utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Piège 4-5 tours.", // NEEDS QC
	},
	gmaxchistrike: {
		name: "Frappe G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté de l'utilisateur voit son taux de critique monter d'un niveau, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : critique +1.", // NEEDS QC

		start: "#focusenergy",
	},
	gmaxcuddle: {
		name: "Câlin G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse tombe amoureux, même derrière un clone. Cet effet ne se produit pas pour une cible si elle est du même sexe que l'utilisateur, si l'un des deux n'a pas de sexe, ou si elle est déjà amoureuse.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : amoureux.", // NEEDS QC
	},
	gmaxdepletion: {
		name: "Usure G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse perd 2 PP sur sa dernière capacité utilisée, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -2 PP.", // NEEDS QC

		activate: "  Les PP {TARGET:de} baissent !",
	},
	gmaxdrumsolo: {
		name: "Percussion G-Max",
		desc: "La puissance est de 160, quelle que soit celle de la capacité Dynamax de la capacité de base. Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Toujours 160 de puissance. Ignore les talents.", // NEEDS QC
	},
	gmaxfinale: {
		name: "Cure G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté de l'utilisateur récupère 1/6 de ses PV max actuels, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : +1/6 des PV max.", // NEEDS QC
	},
	gmaxfireball: {
		name: "Pyroball G-Max",
		desc: "La puissance est de 160, quelle que soit celle de la capacité Dynamax de la capacité de base. Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Toujours 160 de puissance. Ignore les talents.", // NEEDS QC
	},
	gmaxfoamburst: {
		name: "Bulles G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, la Vitesse de chaque Pokémon du côté adverse baisse de 2 niveaux, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -2 Vitesse.", // NEEDS QC
	},
	gmaxgoldrush: {
		name: "Pactole G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse devient confus, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis confus.", // NEEDS QC
	},
	gmaxgravitas: {
		name: "Ondes G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Gravité commence.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Active Gravité.", // NEEDS QC
	},
	gmaxhydrosnipe: {
		name: "Gâchette G-Max",
		desc: "La puissance est de 160, quelle que soit celle de la capacité Dynamax de la capacité de base. Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Toujours 160 de puissance. Ignore les talents.", // NEEDS QC
	},
	gmaxmalodor: {
		name: "Pestilence G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse est empoisonné, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : empoisonnés.", // NEEDS QC
	},
	gmaxmeltdown: {
		name: "Fonte G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Tourmente commence pour chaque Pokémon du côté adverse, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : sous Tourmente.", // NEEDS QC
	},
	gmaxoneblow: {
		name: "Coup Final G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Cette capacité passe outre tous les effets de protection, y compris Gardomax.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ignore Gardomax.", // NEEDS QC
	},
	gmaxrapidflow: {
		name: "Multicoup G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Cette capacité passe outre tous les effets de protection, y compris Gardomax.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ignore Gardomax.", // NEEDS QC
	},
	gmaxreplenish: {
		name: "Récolte G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, il y a 50 % de chances que chaque Pokémon du côté de l'utilisateur voie sa Baie restaurée, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. 50 % de rendre les Baies.", // NEEDS QC
	},
	gmaxresonance: {
		name: "Résonance G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Voile Aurore commence du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : Voile Aurore.", // NEEDS QC
	},
	gmaxsandblast: {
		name: "Enlisement G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse ne peut plus quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe), même derrière un clone. Leur inflige des dégâts égaux à 1/8 de leurs PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. Ils peuvent tout de même être remplacés s'ils tiennent une Carapace Mue ou utilisent Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin pour une cible si elle quitte le terrain ou utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Piège 4-5 tours.", // NEEDS QC
	},
	gmaxsmite: {
		name: "Sentence G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse devient confus, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis confus.", // NEEDS QC
	},
	gmaxsnooze: {
		name: "Torpeur G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, il y a 50 % de chances que l'effet de Bâillement commence sur la cible, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. 50 % de Bâillement.", // NEEDS QC
	},
	gmaxsteelsurge: {
		name: "Percée G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, elle pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat. Les adversaires perdent 1/32, 1/16, 1/8, 1/4 ou 1/2 de leurs PV max, arrondi à l'inférieur, selon leur faiblesse au type Acier (0,25x, 0,5x, neutre, 2x ou 4x respectivement). Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Piège de type Acier.", // NEEDS QC

		start: "  Des morceaux d’acier acérés lévitent autour de {PARTY} !",
		end: "  Les morceaux d’acier acérés autour de {PARTY} ont disparu !",
		damage: "  L’acier pointu transperce {POKEMON} !",
	},
	gmaxstonesurge: {
		name: "Récif G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, elle pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat. Les adversaires perdent 1/32, 1/16, 1/8, 1/4 ou 1/2 de leurs PV max, arrondi à l'inférieur, selon leur faiblesse au type Roche (0,25x, 0,5x, neutre, 2x ou 4x respectivement). Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Pose Piège de Roc.", // NEEDS QC
	},
	gmaxstunshock: {
		name: "Choc G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse est empoisonné ou paralysé, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : psn ou par.", // NEEDS QC
	},
	gmaxsweetness: {
		name: "Nectar G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté de l'utilisateur voit son problème de statut soigné, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : statut soigné.", // NEEDS QC
	},
	gmaxtartness: {
		name: "Corrosion G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'esquive de chaque Pokémon du côté adverse baisse d'un niveau, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1 esquive.", // NEEDS QC
	},
	gmaxterror: {
		name: "Hantise G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse ne peut plus quitter le combat, même derrière un clone. Ils peuvent tout de même être remplacés s'ils tiennent une Carapace Mue ou utilisent Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : piégés.", // NEEDS QC
	},
	gmaxvinelash: {
		name: "Fouet G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, pendant 4 tours, chaque Pokémon non-Plante du côté adverse subit des dégâts égaux à 1/6 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour de l'effet, dernier tour compris.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1/6 PV.", // NEEDS QC

		start: "  Des coups de fouet frappent {PARTY} !",
		damage: "  {POKEMON} subit des coups de Fouet G-Max !",
	},
	gmaxvolcalith: {
		name: "Téphra G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, pendant 4 tours, chaque Pokémon non-Roche du côté adverse subit des dégâts égaux à 1/6 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour de l'effet, dernier tour compris.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1/6 PV.", // NEEDS QC

		start: "  Les rochers encerclent {PARTY} !",
		damage: "  {POKEMON} est blessé par les pierres éjectées par Téphra G-Max !",
	},
	gmaxvoltcrash: {
		name: "Foudre G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, chaque Pokémon du côté adverse est paralysé, même derrière un clone.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : paralysés.", // NEEDS QC
	},
	gmaxwildfire: {
		name: "Fournaise G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, pendant 4 tours, chaque Pokémon non-Feu du côté adverse subit des dégâts égaux à 1/6 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour de l'effet, dernier tour compris.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1/6 PV.", // NEEDS QC

		start: "  Les flammes encerclent {PARTY} !",
		damage: "  {POKEMON} est brûlé par les flammes de Fournaise G-Max !",
	},
	gmaxwindrage: {
		name: "Rafale G-Max",
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, les effets de Champ Électrifié, Champ Herbu, Champ Brumeux et Champ Psychique prennent fin, les effets de Protection, Mur Lumière, Voile Aurore, Rune Protect, Brume, Percée G-Max, Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de la cible, et les effets de Percée G-Max, Picots, Pics Toxik, Piège de Roc et Toile Gluante prennent fin du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Retire champs et pièges.", // NEEDS QC
	},
	grassknot: {
		name: "Nœud Herbe",
		// Official flavor text: "L’ennemi est piégé dans de l’herbe qui le fait trébucher. Plus il est lourd, plus il subit de dégâts."
		desc: "La puissance de cette capacité est de 20 si la cible pèse moins de 10 kg, 40 si moins de 25 kg, 60 si moins de 50 kg, 80 si moins de 100 kg, 100 si moins de 200 kg, et 120 si 200 kg ou plus.", // NEEDS QC
		shortDesc: "Plus puissant si la cible est lourde.", // NEEDS QC
	},
	grasspledge: {
		name: "Aire d’Herbe",
		// Official flavor text: "Une masse végétale s’abat sur l’ennemi. En l’utilisant avec Aire d’Eau, l’effet augmente et un marécage apparaît."
		desc: "Si un des alliés de l'utilisateur a choisi d'utiliser Aire de Feu ou Aire d’Eau ce tour et n'a pas encore agi, il agit immédiatement après l'utilisateur et la capacité de l'utilisateur ne fait rien. Combinée avec Aire de Feu, l'allié utilise Aire de Feu avec 150 de puissance et une mer de feu apparaît du côté de la cible pendant 4 tours, infligeant aux Pokémon non-Feu des dégâts égaux à 1/8 de leurs PV max, arrondi à l'inférieur, à la fin de chaque tour de l'effet, dernier tour compris. Combinée avec Aire d’Eau, l'allié utilise Aire d’Herbe avec 150 de puissance et un marécage apparaît du côté de la cible pendant 4 tours, divisant par quatre la Vitesse de chaque Pokémon de ce côté. Utilisée en capacité combinée, cette capacité bénéficie du STAB quel que soit le type de l'utilisateur. Cette capacité ne consomme pas la Joyau Plante de l'utilisateur.", // NEEDS QC
		shortDesc: "À combiner avec les autres Vœux pour plus d'effets.", // NEEDS QC

		activate: "#waterpledge",
		start: "  {TEAM:capitalize} est cernée par un marécage !",
		end: "  Le marécage autour de {TEAM} a disparu !",
	},
	grasswhistle: {
		name: "Siffl’Herbe",
		shortDesc: "Endort la cible.", // NEEDS QC
	},
	grassyglide: {
		name: "Gliss’Herbe",
		// Official flavor text: "Le lanceur attaque l’ennemi en glissant sur le terrain. Frappe toujours en priorité si un Champ Herbu est actif."
		desc: "Si le terrain actuel est un Champ Herbu et que l'utilisateur est au sol, cette capacité a sa priorité augmentée de 1.", // NEEDS QC
		shortDesc: "Sur champ herbu : priorité +1.", // NEEDS QC
	},
	grassyterrain: {
		name: "Champ Herbu",
		// Official flavor text: "Pendant cinq tours, les Pokémon au sol récupèrent quelques PV à chaque tour et la puissance des capacités de type Plante augmente."
		desc: "Pendant 5 tours, le terrain devient un Champ Herbu. Pendant l'effet, la puissance des attaques de type Plante des Pokémon au sol est multipliée par 1,3, la puissance de Piétisol, Séisme et Ampleur contre les Pokémon au sol est multipliée par 0,5, et les Pokémon au sol récupèrent 1/16 de leurs PV max, arrondi à l'inférieur, à la fin de chaque tour, dernier tour compris. Camouflage transforme l'utilisateur en type Plante, Force Nature devient Éco-Sphère et Force Cachée a 30 % de chances d'endormir. Échoue si le terrain actuel est déjà un Champ Herbu.", // NEEDS QC
		shortDesc: "5 tours : Plante + et soigne 1/16 des PV par tour.", // NEEDS QC
		gen7: {
			desc: "Pendant 5 tours, un Champ Herbu est actif. Pendant l'effet, la puissance des attaques de type Plante des Pokémon au sol est multipliée par 1,5, la puissance de Piétisol, Séisme et Ampleur contre les Pokémon au sol est multipliée par 0,5, et les Pokémon au sol récupèrent 1/16 de leurs PV max, arrondi à l'inférieur, à la fin de chaque tour, y compris le dernier. Camouflage transforme l'utilisateur en type Plante, Force Nature devient Éco-Sphère, et Force Cachée a 30 % de chances d'endormir. Échoue si un Champ Herbu est déjà actif.", // NEEDS QC
		},
	},
	gravapple: {
		name: "Force G",
		// Official flavor text: "Le lanceur attaque son adversaire avec une pomme qu’il fait tomber de très haut. Baisse la Défense de la cible."
		desc: "A 100 % de chances de baisser la Défense de la cible d'un niveau. La puissance est multipliée par 1,5 pendant l'effet de Gravité.", // NEEDS QC
		shortDesc: "100 % de -1 Défense. Sous Gravité : x1,5.", // NEEDS QC
	},
	gravity: {
		name: "Gravité",
		// Official flavor text: "Pendant cinq tours, les Pokémon Vol ou qui ont Lévitation deviennent sensibles aux capacités Sol, et les capacités volantes deviennent inutilisables."
		desc: "Pendant 5 tours, l'esquive de tous les Pokémon actifs est multipliée par 0,6. À l'utilisation, Rebond, Vol, Vol Magnétik, Chute Libre et Lévikinésie prennent fin immédiatement pour tous les Pokémon actifs. Pendant l'effet, Rebond, Vol, Flying Press, Pied Voltige, Pied Sauté, Vol Magnétik, Chute Libre, Trempette et Lévikinésie ne peuvent pas être utilisées par les Pokémon actifs. Les attaques de type Sol, Picots, Pics Toxik, Toile Gluante et le talent Piège Sable peuvent affecter les Pokémon de type Vol ou ayant le talent Lévitation. Échoue si cet effet est déjà actif.", // NEEDS QC
		shortDesc: "5 tours : plus d'immunité au Sol, précision x1,67.", // NEEDS QC
		gen7: {
			desc: "Pendant 5 tours, l'Esquive de tous les Pokémon actifs est multipliée par 0,6. Au moment de l'utilisation, Rebond, Vol, Vol Magnétik, Chute Libre et Lévikinésie prennent fin immédiatement pour tous les Pokémon. Pendant l'effet, Rebond, Vol, Flying Press, Pied Voltige, Pied Sauté, Vol Magnétik, Chute Libre, Trempette et Lévikinésie ne peuvent être utilisées par aucun Pokémon. Les attaques de type Sol, Picots, Pics Toxik, Toile Gluante et le talent Piège Sable peuvent affecter les Pokémon de type Vol ou ayant le talent Lévitation. Échoue si l'effet est déjà actif. Les capacités Z concernées peuvent toujours être choisies, mais seront empêchées à l'exécution pendant cet effet.", // NEEDS QC
		},
		gen6: {
			desc: "Pendant 5 tours, l'esquive de tous les Pokémon actifs est multipliée par 0,6. À l'utilisation, Rebond, Vol, Vol Magnétik, Chute Libre et Lévikinésie prennent fin immédiatement pour tous les Pokémon actifs. Pendant l'effet, Rebond, Vol, Flying Press, Pied Voltige, Pied Sauté, Vol Magnétik, Chute Libre, Trempette et Lévikinésie ne peuvent pas être utilisées par les Pokémon actifs. Les attaques de type Sol, Picots, Pics Toxik, Toile Gluante et le talent Piège Sable peuvent affecter les Pokémon de type Vol ou ayant le talent Lévitation. Échoue si cet effet est déjà actif.", // NEEDS QC
		},
		gen5: {
			desc: "Pendant 5 tours, l'Esquive de tous les Pokémon actifs est multipliée par 0,6. Au moment de l'utilisation, Rebond, Vol, Vol Magnétik, Chute Libre et Lévikinésie prennent fin immédiatement pour tous les Pokémon. Pendant l'effet, Rebond, Vol, Pied Voltige, Pied Sauté, Vol Magnétik, Chute Libre, Trempette et Lévikinésie ne peuvent être utilisées par aucun Pokémon. Les attaques de type Sol, Picots, Pics Toxik et le talent Piège Sable peuvent affecter les Pokémon de type Vol ou ayant le talent Lévitation. Échoue si l'effet est déjà actif.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 5 tours, l'Esquive de tous les Pokémon actifs est multipliée par 0,6. Au moment de l'utilisation, Rebond, Vol et Vol Magnétik prennent fin immédiatement pour tous les Pokémon. Pendant l'effet, Rebond, Vol, Pied Voltige, Pied Sauté, Vol Magnétik et Trempette ne peuvent être utilisées par aucun Pokémon. Les attaques de type Sol, Picots, Pics Toxik et le talent Piège Sable peuvent affecter les Pokémon de type Vol ou ayant le talent Lévitation. Échoue si l'effet est déjà actif.", // NEEDS QC
		},
	},
	growl: {
		name: "Rugissement",
		// Official flavor text: "Le lanceur pousse un cri tout mimi pour tromper la vigilance de l’ennemi et baisser son Attaque."
		desc: "Baisse l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Attaque des ennemis d'un niveau.", // NEEDS QC
		gen2: {
			shortDesc: "Baisse l'Attaque de la cible d'un niveau.", // NEEDS QC
		},
	},
	growth: {
		name: "Croissance",
		// Official flavor text: "Le corps du lanceur se développe. Augmente l’Attaque et l’Attaque Spéciale."
		desc: "Monte l'Attaque et l'Attaque Spéciale de l'utilisateur d'un niveau. Si la météo est Soleil ou Soleil intense, les monte de 2 niveaux. Si l'utilisateur tient un Parapluie Solide, elles ne montent que d'un niveau, même sous Soleil ou Soleil intense.", // NEEDS QC
		shortDesc: "+1 Attaque et Atq. Spé du lanceur (+2 au soleil).", // NEEDS QC
		gen7: {
			desc: "Monte l'Attaque et l'Attaque Spéciale de l'utilisateur d'un niveau. Si le soleil brille ou est extrêmement fort, elles montent de 2 niveaux.", // NEEDS QC
		},
		gen5: {
			desc: "Monte l'Attaque et l'Attaque Spéciale de l'utilisateur d'un niveau. Sous Soleil, elles montent de 2 niveaux.", // NEEDS QC
		},
		gen4: {
			desc: "Monte l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
			shortDesc: "Monte l'Atq. Spé de l'utilisateur d'un niveau.", // NEEDS QC
		},
		gen1: {
			desc: "Monte le Spécial de l'utilisateur d'un niveau.", // NEEDS QC
			shortDesc: "Monte le Spécial de l'utilisateur d'un niveau.", // NEEDS QC
		},
	},
	grudge: {
		name: "Rancune",
		// Official flavor text: "Si le lanceur est mis K.O., sa rancune épuise les PP de la capacité utilisée par l’ennemi pour le mettre K.O."
		desc: "Jusqu'à la prochaine action de l'utilisateur, si l'attaque d'un Pokémon adverse le met K.O., cette capacité perd tous ses PP restants.", // NEEDS QC
		shortDesc: "Si le lanceur est mis K.O., l'attaque perd ses PP.", // NEEDS QC

		activate: "  La capacité {MOVE} {POKEMON:de} perd ses PP à cause de Rancune !",
		start: "{POKEMON} veut que sa cible subisse sa rancune !",
	},
	guardianofalola: {
		name: "Colère du Gardien d’Alola",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Inflige à la cible des dégâts égaux à 3/4 de ses PV actuels, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Inflige 3/4 des PV actuels de la cible.", // NEEDS QC
	},
	guardsplit: {
		name: "Partage Garde",
		// Official flavor text: "Additionne la Défense et la Défense Spéciale du lanceur et de sa cible et les redistribue équitablement entre les deux."
		desc: "La Défense et la Défense Spéciale de l'utilisateur et de la cible sont fixées à la moyenne de leurs statistiques respectives, arrondi à l'inférieur. Les changements de niveaux ne sont pas affectés.", // NEEDS QC
		shortDesc: "Fait la moyenne des Déf et Déf. Spé avec la cible.", // NEEDS QC

		activate: "  {POKEMON} additionne sa garde à celle de sa cible et redistribue le tout équitablement !",
	},
	guardswap: {
		name: "Permugarde",
		// Official flavor text: "Pouvoir qui échange les modifications de la Défense Spéciale et de la Défense avec la cible."
		desc: "L'utilisateur échange ses changements de niveaux de Défense et de Défense Spéciale avec ceux de la cible.", // NEEDS QC
		shortDesc: "Échange ses hausses de Déf et Déf. Spé avec la cible.", // NEEDS QC
	},
	guillotine: {
		name: "Guillotine",
		// Official flavor text: "Des pinces lacèrent violemment l’ennemi, le mettant K.O. sur le coup s’il est touché."
		desc: "Inflige à la cible des dégâts égaux à ses PV max. Ignore les modificateurs de précision et d'esquive. La précision de cette attaque est égale à (niveau de l'utilisateur - niveau de la cible + 30) %, et elle échoue si la cible est d'un niveau supérieur. Les Pokémon ayant le talent Fermeté sont immunisés.", // NEEDS QC
		shortDesc: "K.O. en un coup. Échoue si niveau inférieur.", // NEEDS QC
		gen2: {
			desc: "Inflige 65535 dégâts à la cible. La précision de cette capacité sur 256 est égale au plus petit de (2 × (niveau de l'utilisateur − niveau de la cible) + 76) et 255, avant d'appliquer les modificateurs de Précision et d'Esquive. Échoue si la cible est de niveau supérieur.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige 65535 dégâts à la cible. Échoue si la Vitesse de la cible est supérieure à celle de l'utilisateur.", // NEEDS QC
			shortDesc: "65535 dégâts. Échoue si la cible est plus rapide.", // NEEDS QC
		},
	},
	gunkshot: {
		name: "Détricanon",
		// Official flavor text: "Le lanceur envoie des détritus sur l’ennemi. Peut aussi l’empoisonner."
		desc: "A 30 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "30 % d'empoisonner la cible.", // NEEDS QC
	},
	gust: {
		name: "Tornade",
		// Official flavor text: "Le lanceur bat des ailes pour générer une bourrasque qui blesse l’ennemi."
		desc: "La puissance est doublée si la cible utilise Rebond, Vol ou Chute Libre, ou est sous l'effet de Chute Libre.", // NEEDS QC
		shortDesc: "Puissance x2 contre Rebond, Vol et Chute Libre.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si la cible utilise Rebond ou Vol.", // NEEDS QC
			shortDesc: "Puissance x2 contre Rebond et Vol.", // NEEDS QC
		},
		gen2: {
			desc: "La puissance est doublée si la cible utilise Vol.", // NEEDS QC
			shortDesc: "Puissance x2 contre Vol.", // NEEDS QC
		},
		gen1: {
			desc: "Aucun effet supplémentaire.", // NEEDS QC
			shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		},
	},
	gyroball: {
		name: "Gyroballe",
		// Official flavor text: "Le lanceur effectue une rotation et frappe l’ennemi. Plus la Vitesse du lanceur est basse, plus il inflige de dégâts."
		desc: "La puissance est égale à (25 × Vitesse actuelle de la cible / Vitesse actuelle de l'utilisateur) + 1, arrondi à l'inférieur, avec un maximum de 150. Si la Vitesse actuelle de l'utilisateur est 0, la puissance est de 1.", // NEEDS QC
		shortDesc: "Plus puissant si plus lent que la cible.", // NEEDS QC
		gen5: {
			desc: "La puissance est égale à (25 × Vitesse actuelle de la cible ÷ Vitesse actuelle de l'utilisateur) + 1, arrondi à l'inférieur, mais pas plus de 150. Si la Vitesse actuelle de l'utilisateur est 0, elle est traitée comme 1.", // NEEDS QC
		},
	},
	hail: {
		name: "Grêle",
		// Official flavor text: "Invoque une tempête de grêle qui dure cinq tours. Blesse tous les Pokémon, sauf ceux de type Glace."
		desc: "Pendant 5 tours, la météo devient la grêle. À la fin de chaque tour sauf le dernier, tous les Pokémon actifs perdent 1/16 de leurs PV max, arrondi à l'inférieur, sauf s'ils sont de type Glace ou ont le talent Corps Gel, Garde Magik, Envelocape ou Rideau Neige. Dure 8 tours si l'utilisateur tient une Roche Glace. Échoue si la météo actuelle est déjà la grêle.", // NEEDS QC
		shortDesc: "Pendant 5 tours, la grêle tombe.", // NEEDS QC
		gen4: {
			desc: "Pendant 5 tours, il grêle. À la fin de chaque tour sauf le dernier, tous les Pokémon actifs perdent 1/16 de leurs PV max, arrondi à l'inférieur, sauf s'ils sont de type Glace ou ont le talent Corps Gel, Garde Magik ou Rideau Neige. Dure 8 tours si l'utilisateur tient une Roche Glace. Échoue s'il grêle déjà.", // NEEDS QC
		},
		gen3: {
			desc: "Pendant 5 tours, il grêle. À la fin de chaque tour sauf le dernier, tous les Pokémon actifs perdent 1/16 de leurs PV max, arrondi à l'inférieur, sauf s'ils sont de type Glace. Échoue s'il grêle déjà.", // NEEDS QC
		},
	},
	hammerarm: {
		name: "Marto-Poing",
		// Official flavor text: "Le lanceur donne un puissant coup de poing à l’ennemi. Réduit la Vitesse du lanceur."
		desc: "Baisse la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la Vitesse du lanceur d'un niveau.", // NEEDS QC
	},
	happyhour: {
		name: "Étrennes",
		shortDesc: "Aucune utilité en combat.", // NEEDS QC

		activate: "  L’ambiance est euphorique !",
	},
	harden: {
		name: "Armure",
		// Official flavor text: "Le lanceur contracte tous ses muscles pour augmenter sa Défense."
		desc: "Monte la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur d'un niveau.", // NEEDS QC
	},
	hardpress: {
		name: "Pression Extrême",
		// Official flavor text: "Le lanceur écrase la cible avec ses bras ou ses pinces. Plus il reste de PV à la cible, plus la puissance de la capacité augmente."
		desc: "La puissance est égale à 100 × (PV actuels de la cible / PV max de la cible), arrondi à l'inférieur à partir de 0,5, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Plus puissant si la cible a beaucoup de PV.", // NEEDS QC
	},
	haze: {
		name: "Buée Noire",
		// Official flavor text: "Crée un brouillard qui annule les changements de stats de tous les Pokémon au combat."
		desc: "Remet à 0 les niveaux de statistiques de tous les Pokémon actifs.", // NEEDS QC
		shortDesc: "Annule tous les changements de stats.", // NEEDS QC
		gen1: {
			desc: "Remet à 0 les niveaux de statistiques des deux Pokémon et retire les baisses de statistiques dues à la brûlure et à la paralysie. Remet à 0 les compteurs de Toxik et retire les effets de la confusion et de Onde Folie, Entrave, Puissance, Vampigraine, Mur Lumière, Brume et Protection des deux Pokémon. Retire le problème de statut de l'adversaire.", // NEEDS QC
			shortDesc: "Annule les stats. Soigne le statut de l'ennemi.", // NEEDS QC
		},

		// Only used in Gen 1
		activate: "  Tout effet est annulé!",
	},
	headbutt: {
		name: "Coup d’Boule",
		// Official flavor text: "Le lanceur donne un coup de tête. Peut apeurer l’ennemi."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	headcharge: {
		name: "Peignée",
		// Official flavor text: "Le lanceur donne un coup avec sa tête couronnée d’une fière crinière. Blesse aussi légèrement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 1/4 des dégâts.", // NEEDS QC
	},
	headlongrush: {
		name: "Assaut Frontal",
		// Official flavor text: "Le lanceur charge la cible de toutes ses forces, ce qui baisse la Défense et la Défense Spéciale du lanceur."
		desc: "Baisse la Défense et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "-1 Déf et Déf. Spé du lanceur.", // NEEDS QC
	},
	headsmash: {
		name: "Fracass’Tête",
		// Official flavor text: "Le lanceur assène un coup de tête désespéré. Blesse aussi gravement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de la moitié des dégâts.", // NEEDS QC
		gen4: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/2 des PV perdus, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
		},
	},
	healbell: {
		name: "Glas de Soin",
		// Official flavor text: "Carillon apaisant qui soigne les altérations de statut de tous les Pokémon de l’équipe."
		desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut. Les Pokémon actifs ayant le talent Anti-Bruit ne sont pas soignés, sauf s'il s'agit de l'utilisateur.", // NEEDS QC
		shortDesc: "Soigne le statut de toute l'équipe du lanceur.", // NEEDS QC
		gen7: {
			desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut. Les Pokémon actifs ayant le talent Anti-Bruit ne sont pas soignés.", // NEEDS QC
		},
		gen5: {
			desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut. Les Pokémon actifs ayant le talent Anti-Bruit sont aussi soignés.", // NEEDS QC
		},
		gen4: {
			desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut. Les Pokémon ayant le talent Anti-Bruit ne sont pas soignés.", // NEEDS QC
		},
		gen2: {
			desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut.", // NEEDS QC
		},

		activate: "  Un grelot sonne !",
	},
	healblock: {
		name: "Anti-Soin",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Pendant 5 tours, la cible ne peut plus récupérer de PV tant qu'elle reste au combat. Pendant l'effet, les capacités de soin et de drain sont inutilisables, et les talents et objets qui soignent ne soignent pas l'utilisateur. Si un Pokémon affecté utilise Relais, son remplaçant reste incapable de récupérer des PV. Balance et le talent Régé-Force ne sont pas affectés.", // NEEDS QC
		shortDesc: "5 tours : les ennemis ne peuvent pas se soigner.", // NEEDS QC
		gen8: {
			end: "  {POKEMON} peut à nouveau guérir !",
			cant: "{POKEMON} ne peut pas utiliser la capacité {MOVE} à cause d’Anti-Soin !",
		},
		gen7: {
			desc: "Pendant 5 tours, la cible ne peut pas récupérer de PV tant qu'elle reste au combat. Pendant l'effet, les capacités de soin et de drain sont inutilisables, et les talents et objets qui soignent n'ont pas d'effet. Si un Pokémon affecté utilise Relais, son remplaçant reste incapable de récupérer des PV. Balance et le talent Régé-Force ne sont pas affectés. Les capacités Z concernées peuvent toujours être choisies et exécutées pendant cet effet.", // NEEDS QC
		},
		gen6: {
			desc: "Pendant 5 tours, la cible ne peut plus récupérer de PV tant qu'elle reste au combat. Pendant l'effet, les capacités de soin et de drain sont inutilisables, et les talents et objets qui soignent ne soignent pas l'utilisateur. Si un Pokémon affecté utilise Relais, son remplaçant reste incapable de récupérer des PV. Balance et le talent Régé-Force ne sont pas affectés.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 5 tours, la cible ne peut pas récupérer de PV tant qu'elle reste au combat. Pendant l'effet, les capacités de soin sont inutilisables et les effets de soin des capacités n'agissent pas, mais les talents et objets continuent de soigner. Si un Pokémon affecté utilise Relais, son remplaçant reste sous l'effet. Balance n'est pas affectée.", // NEEDS QC
		},

		start: "  {POKEMON} ne peut pas guérir !",
		end: "  Le blocage de soins qui affectait {POKEMON} s’est dissipé !",
		cant: "{POKEMON} ne peut pas utiliser la capacité {MOVE} à cause du blocage de soins qui l’affecte !",
		fail: "  Mais cela échoue sur {POKEMON} !",
	},
	healingwish: {
		name: "Vœu Soin",
		// Official flavor text: "Le lanceur tombe K.O. pour soigner les PV et le statut du Pokémon qui passe après lui."
		desc: "L'utilisateur est mis K.O., et si le Pokémon envoyé pour le remplacer n'a pas tous ses PV ou a un problème de statut, ses PV sont entièrement restaurés et son problème de statut est soigné. Le remplaçant est envoyé à la fin du tour, et le soin a lieu avant l'effet des pièges. Cet effet persiste jusqu'à ce qu'un Pokémon remplissant l'une de ces conditions entre à la position de l'utilisateur ou y soit échangé avec Interversion. Échoue si l'utilisateur est le dernier Pokémon non K.O. de son équipe.", // NEEDS QC
		shortDesc: "Mis K.O. ; le prochain Pokémon blessé est soigné.", // NEEDS QC
		gen7: {
			desc: "L'utilisateur est mis K.O. et le Pokémon qui le remplace a ses PV entièrement restaurés et son problème de statut soigné. Le nouveau Pokémon est envoyé à la fin du tour, et le soin a lieu avant l'effet des pièges. Échoue si l'utilisateur est le dernier Pokémon non K.O. de son équipe.", // NEEDS QC
			shortDesc: "L'utilisateur est K.O. Le remplaçant est soigné.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur est mis K.O. et le Pokémon qui le remplace a ses PV entièrement restaurés et son problème de statut soigné. Le nouveau Pokémon est envoyé immédiatement, et le soin a lieu après l'effet des pièges. Échoue si l'utilisateur est le dernier Pokémon non K.O. de son équipe.", // NEEDS QC
		},

		heal: "  Le Vœu Soin est exaucé et profite à {POKEMON} !",
	},
	healorder: {
		name: "Appel Soins",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "L'utilisateur récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	healpulse: {
		name: "Vibra Soin",
		// Official flavor text: "Une aura de bien-être fait récupérer la moitié de ses PV max à la cible."
		desc: "La cible récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5. Si l'utilisateur a le talent Méga Blaster, elle récupère 3/4 de ses PV max, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "La cible récupère la moitié de ses PV max.", // NEEDS QC
		gen5: {
			desc: "La cible récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5.", // NEEDS QC
		},
	},
	heartstamp: {
		name: "Crève-Cœur",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	heartswap: {
		name: "Permucœur",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "L'utilisateur échange tous ses changements de niveaux de statistiques avec ceux de la cible.", // NEEDS QC
		shortDesc: "Échange tous les changements de stats avec la cible.", // NEEDS QC
	},
	heatcrash: {
		name: "Tacle Feu",
		// Official flavor text: "Le lanceur projette son corps enflammé contre l’ennemi. S’il est plus lourd que l’ennemi, l’effet augmente en conséquence."
		desc: "La puissance de cette capacité dépend de (poids de l'utilisateur / poids de la cible), arrondi à l'inférieur. La puissance est de 120 si le résultat est 5 ou plus, 100 si 4, 80 si 3, 60 si 2, et 40 si 1 ou moins. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "Plus puissant si le lanceur pèse plus que la cible.", // NEEDS QC
		gen5: {
			desc: "La puissance dépend de (poids de l'utilisateur ÷ poids de la cible), arrondi à l'inférieur. Elle est de 120 si le résultat est 5 ou plus, 100 si 4, 80 si 3, 60 si 2 et 40 si 1 ou moins.", // NEEDS QC
		},
	},
	heatwave: {
		name: "Canicule",
		// Official flavor text: "Le lanceur provoque une vague de chaleur. Peut aussi brûler l’ennemi."
		desc: "A 10 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "10 % de brûler la cible.", // NEEDS QC
	},
	heavyslam: {
		name: "Tacle Lourd",
		// Official flavor text: "Le lanceur se jette sur l’ennemi de tout son poids. S’il est plus lourd que l’ennemi, l’effet augmente en conséquence."
		desc: "La puissance de cette capacité dépend de (poids de l'utilisateur / poids de la cible), arrondi à l'inférieur. La puissance est de 120 si le résultat est 5 ou plus, 100 si 4, 80 si 3, 60 si 2, et 40 si 1 ou moins. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "Plus puissant si le lanceur pèse plus que la cible.", // NEEDS QC
		gen6: {
			desc: "La puissance dépend de (poids de l'utilisateur ÷ poids de la cible), arrondi à l'inférieur. Elle est de 120 si le résultat est 5 ou plus, 100 si 4, 80 si 3, 60 si 2 et 40 si 1 ou moins.", // NEEDS QC
		},
	},
	helpinghand: {
		name: "Coup d’Main",
		// Official flavor text: "Une capacité qui augmente la puissance d’attaque d’un allié."
		desc: "La puissance de l'attaque de la cible ce tour est multipliée par 1,5 (cet effet est cumulable). Échoue si aucun allié n'est adjacent à l'utilisateur ou si l'allié a déjà agi ce tour, mais n'échoue pas si l'allié utilise une capacité en deux tours.", // NEEDS QC
		shortDesc: "La capacité d'un allié adjacent est x1,5 ce tour.", // NEEDS QC

		start: "  {SOURCE} est prêt à aider {POKEMON} !",
	},
	hex: {
		name: "Châtiment",
		// Official flavor text: "Attaque acharnée qui cause davantage de dégâts à l’ennemi s’il a un problème de statut."
		desc: "La puissance est doublée si la cible a un problème de statut.", // NEEDS QC
		shortDesc: "Puissance doublée contre un statut.", // NEEDS QC
	},
	hiddenpower: {
		name: "Puissance Cachée",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Le type de cette capacité dépend des valeurs individuelles (IV) de l'utilisateur, et peut être n'importe quel type sauf Fée et Normal.", // NEEDS QC
		shortDesc: "Son type varie selon les IV du lanceur.", // NEEDS QC
		gen5: {
			desc: "Le type et la puissance de cette capacité dépendent des IV de l'utilisateur. La puissance varie entre 30 et 70, et le type peut être n'importe lequel sauf Normal.", // NEEDS QC
			shortDesc: "Puissance et type varient selon les IV.", // NEEDS QC
		},
	},
	hiddenpowerbug: {
		name: "Puissance Cachée Insecte", // NEEDS QC
	},
	hiddenpowerdark: {
		name: "Puissance Cachée Ténèbres", // NEEDS QC
	},
	hiddenpowerdragon: {
		name: "Puissance Cachée Dragon", // NEEDS QC
	},
	hiddenpowerelectric: {
		name: "Puissance Cachée Électrik", // NEEDS QC
	},
	hiddenpowerfighting: {
		name: "Puissance Cachée Combat", // NEEDS QC
	},
	hiddenpowerfire: {
		name: "Puissance Cachée Feu", // NEEDS QC
	},
	hiddenpowerflying: {
		name: "Puissance Cachée Vol", // NEEDS QC
	},
	hiddenpowerghost: {
		name: "Puissance Cachée Spectre", // NEEDS QC
	},
	hiddenpowergrass: {
		name: "Puissance Cachée Plante", // NEEDS QC
	},
	hiddenpowerground: {
		name: "Puissance Cachée Sol", // NEEDS QC
	},
	hiddenpowerice: {
		name: "Puissance Cachée Glace", // NEEDS QC
	},
	hiddenpowerpoison: {
		name: "Puissance Cachée Poison", // NEEDS QC
	},
	hiddenpowerpsychic: {
		name: "Puissance Cachée Psy", // NEEDS QC
	},
	hiddenpowerrock: {
		name: "Puissance Cachée Roche", // NEEDS QC
	},
	hiddenpowersteel: {
		name: "Puissance Cachée Acier", // NEEDS QC
	},
	hiddenpowerwater: {
		name: "Puissance Cachée Eau", // NEEDS QC
	},
	highhorsepower: {
		name: "Cavalerie Lourde",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	highjumpkick: {
		name: "Pied Voltige",
		// Official flavor text: "Le lanceur s’élance pour effectuer un coup de genou sauté. S’il échoue, le lanceur se blesse."
		desc: "Si cette attaque échoue, l'utilisateur perd la moitié de ses PV max, arrondi à l'inférieur, en dégâts d'échec. Les Pokémon ayant le talent Garde Magik ne subissent pas les dégâts d'échec.", // NEEDS QC
		shortDesc: "S'il rate, le lanceur perd la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "Si cette attaque échoue, l'utilisateur perd en dégâts de chute la moitié des PV max de la cible, arrondi à l'inférieur, si celle-ci était immunisée, sinon la moitié des dégâts que la cible aurait subis, arrondi à l'inférieur, mais pas moins de 1 PV ni plus de la moitié des PV max de la cible. Les Pokémon ayant le talent Garde Magik ne subissent pas de dégâts de chute.", // NEEDS QC
			shortDesc: "En cas d'échec, subit 1/2 des dégâts prévus.", // NEEDS QC
		},
		gen3: {
			desc: "Si cette attaque échoue et que la cible n'était pas immunisée, l'utilisateur perd en dégâts de chute la moitié des dégâts que la cible aurait subis, arrondi à l'inférieur, mais pas moins de 1 PV ni plus de la moitié des PV max de la cible.", // NEEDS QC
			shortDesc: "En cas d'échec, subit 1/2 des dégâts prévus.", // NEEDS QC
		},
		gen2: {
			desc: "Si cette attaque échoue et que la cible n'était pas immunisée, l'utilisateur perd en dégâts de chute 1/8 des dégâts que la cible aurait subis, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
			shortDesc: "En cas d'échec, subit 1/8 des dégâts prévus.", // NEEDS QC
		},
		gen1: {
			desc: "Si cette attaque rate la cible, l'utilisateur subit 1 PV de dégâts de chute. Si l'utilisateur a un clone, ces dégâts sont infligés au clone de la cible s'il en a un, sinon aucun dégât de chute n'est infligé.", // NEEDS QC
			shortDesc: "En cas d'échec, l'utilisateur perd 1 PV.", // NEEDS QC
		},

		damage: "#crash",
	},
	holdback: {
		name: "Retenue",
		// Official flavor text: "Le lanceur attaque avec retenue, et laisse au moins 1 PV à l’ennemi."
		desc: "Laisse la cible avec au moins 1 PV.", // NEEDS QC
		shortDesc: "Laisse toujours au moins 1 PV à la cible.", // NEEDS QC
	},
	holdhands: {
		name: "Mains Jointes",
		// Official flavor text: "Le lanceur et un allié se prennent la main, ce qui les rend heureux."
		desc: "Aucune utilité en combat. Échoue si aucun allié n'est adjacent à l'utilisateur.", // NEEDS QC
		shortDesc: "Aucune utilité en combat.", // NEEDS QC
	},
	honeclaws: {
		name: "Aiguisage",
		// Official flavor text: "Le lanceur s’aiguise les griffes. Augmente l’Attaque et la Précision."
		desc: "Monte l'Attaque et la précision de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'Attaque et la précision du lanceur d'un niveau.", // NEEDS QC
	},
	hornattack: {
		name: "Koud’Korne",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	horndrill: {
		name: "Empal’Korne",
		// Official flavor text: "Un coup de corne en vrille qui empale l’ennemi, le mettant K.O. sur le coup s’il est touché."
		desc: "Inflige à la cible des dégâts égaux à ses PV max. Ignore les modificateurs de précision et d'esquive. La précision de cette attaque est égale à (niveau de l'utilisateur - niveau de la cible + 30) %, et elle échoue si la cible est d'un niveau supérieur. Les Pokémon ayant le talent Fermeté sont immunisés.", // NEEDS QC
		shortDesc: "K.O. en un coup. Échoue si niveau inférieur.", // NEEDS QC
		gen2: {
			desc: "Inflige 65535 dégâts à la cible. La précision de cette capacité sur 256 est égale au plus petit de (2 × (niveau de l'utilisateur − niveau de la cible) + 76) et 255, avant d'appliquer les modificateurs de Précision et d'Esquive. Échoue si la cible est de niveau supérieur.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige 65535 dégâts à la cible. Échoue si la Vitesse de la cible est supérieure à celle de l'utilisateur.", // NEEDS QC
			shortDesc: "65535 dégâts. Échoue si la cible est plus rapide.", // NEEDS QC
		},
	},
	hornleech: {
		name: "Encornebois",
		// Official flavor text: "Un coup de corne qui draine l’énergie de l’ennemi. Convertit la moitié des dégâts infligés en PV pour le lanceur."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
	},
	howl: {
		name: "Grondement",
		// Official flavor text: "Le lanceur grogne pour se rassurer, ce qui augmente son Attaque et celle de ses alliés."
		desc: "Monte l'Attaque de l'utilisateur et de tous ses alliés d'un niveau.", // NEEDS QC
		shortDesc: "+1 Attaque du lanceur et de son allié.", // NEEDS QC
		gen7: {
			desc: "Monte l'Attaque de l'utilisateur d'un niveau.", // NEEDS QC
			shortDesc: "Monte l'Attaque du lanceur d'un niveau.", // NEEDS QC
		},
	},
	hurricane: {
		name: "Vent Violent",
		// Official flavor text: "Le lanceur déclenche une tempête de vents violents qui s’abat sur l’ennemi. Peut aussi le rendre confus."
		desc: "A 30 % de chances de rendre la cible confuse. Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre. Si la météo est Pluie battante ou Pluie, cette capacité ne vérifie pas la précision. Si la météo est Soleil intense ou Soleil, sa précision est de 50 %. Si elle est utilisée contre un Pokémon tenant un Parapluie Solide, sa précision reste à 70 %.", // NEEDS QC
		shortDesc: "30 % de rendre confus. Ne rate pas sous la pluie.", // NEEDS QC
		gen7: {
			desc: "A 30 % de chances de rendre la cible confuse. Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre. Sous pluie battante ou Pluie, cette capacité ne vérifie pas la précision. Sous soleil extrêmement fort ou Soleil, sa précision est de 50 %.", // NEEDS QC
		},
		gen5: {
			desc: "A 30 % de chances de rendre la cible confuse. Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre. Sous Pluie, cette capacité ne vérifie pas la précision. Sous Soleil, sa précision est de 50 %.", // NEEDS QC
		},
	},
	hydrocannon: {
		name: "Hydroblast",
		// Official flavor text: "Une trombe d’eau heurte l’ennemi. Le lanceur doit se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	hydropump: {
		name: "Hydrocanon",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	hydrosteam: {
		name: "Hydrovapeur",
		// Official flavor text: "Le lanceur asperge la cible avec un puissant jet d'eau bouillante. Quand le soleil brille, la puissance de cette capacité augmente de 50 % au lieu de baisser."
		desc: "Si la météo actuelle est Soleil et que l'utilisateur ne tient pas de Parapluie Solide, les dégâts de cette capacité sont multipliés par 1,5 au lieu d'être divisés par deux pour son type Eau.", // NEEDS QC
		shortDesc: "Au soleil : dégâts x1,5 au lieu de la moitié.", // NEEDS QC
	},
	hydrovortex: {
		name: "Super Tourbillon Abyssal",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	hyperbeam: {
		name: "Ultralaser",
		// Official flavor text: "Projette un puissant rayon sur l’ennemi. Le lanceur doit se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
		gen1: {
			desc: "Si cette capacité réussit, l'utilisateur doit se reposer au tour suivant et ne peut pas choisir de capacité, sauf si la cible ou son clone a été mis K.O. par cette capacité.", // NEEDS QC
			shortDesc: "Doit se reposer si la cible n'est pas K.O.", // NEEDS QC
		},
	},
	hyperdrill: {
		name: "Hyperceuse",
		shortDesc: "Passe outre les protections sans les briser.", // NEEDS QC
	},
	hyperfang: {
		name: "Croc de Mort",
		// Official flavor text: "Le lanceur mord l’ennemi à l’aide de ses incisives aiguisées. Peut aussi l’apeurer."
		desc: "A 10 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "10 % d'apeurer la cible.", // NEEDS QC
	},
	hyperspacefury: {
		name: "Furie Dimension",
		// Official flavor text: "Le Pokémon utilise sa multitude de bras pour infliger une nuée de coups qui ignorent les capacités telles qu’Abri ou Détection. Baisse la Défense du lanceur."
		desc: "Baisse la Défense de l'utilisateur d'un niveau. Cette capacité ne peut être utilisée avec succès que si la forme actuelle de l'utilisateur, en tenant compte de Morphing, est Hoopa Déchaîné. Si cette capacité réussit, elle brise les effets de Blockhaus, Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer ce côté normalement.", // NEEDS QC
		shortDesc: "Hoopa Déchaîné : -1 Déf ; brise les protections.", // NEEDS QC
		gen6: {
			desc: "Baisse la Défense de l'utilisateur d'un niveau. Cette capacité ne peut être utilisée que si la forme actuelle de l'utilisateur, en tenant compte de Morphing, est Hoopa Déchaîné. Si cette capacité réussit, elle brise Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour.", // NEEDS QC
		},

		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		name: "TrouDimensionnel",
		// Official flavor text: "Crée une faille dimensionnelle pour attaquer soudainement l’ennemi de côté. Ignore même les capacités comme Abri ou Détection."
		desc: "Si cette capacité réussit, elle brise les effets de Blockhaus, Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer ce côté normalement.", // NEEDS QC
		shortDesc: "Brise la protection de la cible ce tour.", // NEEDS QC
		gen6: {
			desc: "Si cette capacité réussit, elle brise Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour.", // NEEDS QC
		},

		activate: "#shadowforce",
	},
	hypervoice: {
		name: "Mégaphone",
		// Official flavor text: "Le lanceur pousse un cri dont l’écho terrifiant a le pouvoir d’infliger des dégâts à l’ennemi."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis adjacents.", // NEEDS QC
	},
	hypnosis: {
		name: "Hypnose",
		shortDesc: "Endort la cible.", // NEEDS QC
	},
	iceball: {
		name: "Ball’Glace",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Si cette capacité réussit, l'utilisateur reste bloqué dessus et ne peut pas faire d'autre action jusqu'à ce qu'elle rate, que 5 tours passent ou que l'attaque ne puisse plus être utilisée. La puissance double à chaque coup réussi, et double encore si l'utilisateur a utilisé Boul’Armure auparavant. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour.", // NEEDS QC
		shortDesc: "Puissance doublée par coup. Se répète 5 tours.", // NEEDS QC
		gen7: {
			desc: "Si cette capacité réussit, l'utilisateur est bloqué dessus et ne peut pas utiliser d'autre capacité jusqu'à ce qu'elle rate, que 5 tours passent ou que l'attaque ne puisse pas être utilisée. La puissance double à chaque coup réussi et double encore si l'utilisateur a utilisé Boul’Armure auparavant. Si cette capacité est utilisée via Blabla Dodo, elle est utilisée pendant un tour. Si cette capacité touche un Fantômasque actif pendant l'effet, le multiplicateur de puissance est mis en pause mais pas le compteur de tours, ce qui peut permettre d'appliquer le multiplicateur à la prochaine capacité de l'utilisateur après la fin de l'effet.", // NEEDS QC
		},
		gen6: {
			desc: "Si cette capacité réussit, l'utilisateur reste bloqué dessus et ne peut pas faire d'autre action jusqu'à ce qu'elle rate, que 5 tours passent ou que l'attaque ne puisse plus être utilisée. La puissance double à chaque coup réussi, et double encore si l'utilisateur a utilisé Boul’Armure auparavant. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour.", // NEEDS QC
		},
	},
	icebeam: {
		name: "Laser Glace",
		// Official flavor text: "Un rayon de glace frappe l’ennemi. Peut aussi le geler."
		desc: "A 10 % de chances de geler la cible.", // NEEDS QC
		shortDesc: "10 % de geler la cible.", // NEEDS QC
	},
	iceburn: {
		name: "Feu Glacé",
		// Official flavor text: "Au second tour, le lanceur projette un souffle de vent glacial dévastateur sur l’ennemi. Peut aussi le brûler."
		desc: "A 30 % de chances de brûler la cible. Cette attaque se charge au premier tour et s'exécute au second. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Charge, frappe au tour 2. 30 % de brûler.", // NEEDS QC

		prepare: "  {POKEMON} est entouré d’un air glacial !",
	},
	icefang: {
		name: "Crocs Givre",
		// Official flavor text: "Le lanceur utilise une morsure glaciale. Peut aussi geler ou apeurer l’ennemi."
		desc: "A 10 % de chances de geler la cible et 10 % de chances de l'apeurer.", // NEEDS QC
		shortDesc: "10 % de geler. 10 % d'apeurer.", // NEEDS QC
	},
	icehammer: {
		name: "Marteau de Glace",
		// Official flavor text: "Le lanceur donne un puissant coup de poing à l’ennemi. Réduit la Vitesse du lanceur."
		desc: "Baisse la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la Vitesse du lanceur d'un niveau.", // NEEDS QC
	},
	icepunch: {
		name: "Poing Glace",
		// Official flavor text: "Un coup de poing glacé vient frapper l’ennemi. Peut le geler."
		desc: "A 10 % de chances de geler la cible.", // NEEDS QC
		shortDesc: "10 % de geler la cible.", // NEEDS QC
	},
	iceshard: {
		name: "Éclats Glace",
		// Official flavor text: "Le lanceur crée des éclats de glace qu’il envoie sur l’ennemi. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	icespinner: {
		name: "Cryo-Pirouette",
		// Official flavor text: "Le lanceur enveloppe ses jambes d'une fine couche de glace et heurte la cible en tournant sur lui-même. Ses rotations détruisent le champ actif sur le terrain."
		desc: "Met fin aux effets de Champ Électrifié, Champ Herbu, Champ Brumeux et Champ Psychique.", // NEEDS QC
		shortDesc: "Met fin aux effets des champs.", // NEEDS QC
	},
	iciclecrash: {
		name: "Chute Glace",
		// Official flavor text: "Envoie de gros blocs de glace sur l’ennemi pour lui infliger des dégâts. Peut aussi l’apeurer."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	iciclespear: {
		name: "Stalactite",
		// Official flavor text: "Le lanceur jette des pics de glace sur l’ennemi, de deux à cinq fois de suite."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
	},
	icywind: {
		name: "Vent Glace",
		// Official flavor text: "Une bourrasque de vent froid blesse l’ennemi. Réduit aussi sa Vitesse."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse des ennemis d'un niveau.", // NEEDS QC
		gen2: {
			shortDesc: "100 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		},
	},
	imprison: {
		name: "Possessif",
		// Official flavor text: "Si l’ennemi et le lanceur ont des capacités en commun, l’ennemi ne pourra pas les utiliser."
		desc: "Les Pokémon adverses ne peuvent plus utiliser les capacités que l'utilisateur connaît aussi, tant que celui-ci reste au combat.", // NEEDS QC
		shortDesc: "Les ennemis ne peuvent pas utiliser ses capacités.", // NEEDS QC
		gen7: {
			desc: "Tant que l'utilisateur reste au combat, les Pokémon adverses ne peuvent pas utiliser les capacités que l'utilisateur connaît aussi. Les capacités renforcées par la Force Z peuvent toujours être choisies et exécutées pendant l'effet.", // NEEDS QC
		},
		gen6: {
			desc: "Les Pokémon adverses ne peuvent plus utiliser les capacités que l'utilisateur connaît aussi, tant que celui-ci reste au combat.", // NEEDS QC
		},
		gen4: {
			desc: "Tant que l'utilisateur reste au combat, les Pokémon adverses ne peuvent pas utiliser les capacités que l'utilisateur connaît aussi. Échoue si aucun Pokémon adverse ne connaît une des capacités de l'utilisateur.", // NEEDS QC
		},

		start: "  {POKEMON} empêche sa cible d’utiliser les capacités qu’ils ont en commun !",
		cant: "{POKEMON} ne peut pas utiliser la capacité bloquée {MOVE} !",
	},
	incinerate: {
		name: "Calcination",
		// Official flavor text: "Des flammes calcinent l’ennemi. S’il tient un objet, une Baie par exemple, celui-ci est brûlé et devient inutilisable."
		desc: "La cible perd son objet tenu s'il s'agit d'une Baie ou d'un Joyau. Cette capacité ne peut pas faire perdre leur objet aux Pokémon ayant le talent Glu. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		shortDesc: "Détruit la Baie ou le Joyau des ennemis.", // NEEDS QC
		gen5: {
			desc: "La cible perd son objet tenu s'il s'agit d'une Baie. Cette capacité ne peut pas faire perdre leur objet aux Pokémon ayant le talent Glu. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
			shortDesc: "Détruit la Baie des ennemis.", // NEEDS QC
		},

		removeItem: "  {ITEM:definite:capitalize} {POKEMON:de} {INFLECT:ITEM:ms=est détruit:fs=est détruite:mp=sont détruits:fp=sont détruites} par le feu !",
	},
	infernalparade: {
		name: "Cortège Funèbre",
		// Official flavor text: "Une multitude de boules de feu frappent la cible, ce qui peut aussi la brûler. La puissance est doublée si celle-ci souffre d'une altération de statut."
		desc: "A 30 % de chances de brûler la cible. La puissance est doublée si la cible a un problème de statut.", // NEEDS QC
		shortDesc: "30 % de brûler. Puissance x2 contre un statut.", // NEEDS QC
	},
	inferno: {
		name: "Feu d’Enfer",
		// Official flavor text: "L’ennemi est entouré d’un torrent de flammes ardentes qui le brûlent."
		desc: "A 100 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "100 % de brûler la cible.", // NEEDS QC
	},
	infernooverdrive: {
		name: "Pyro-Explosion Cataclysmique",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	infestation: {
		name: "Harcèlement",
		// Official flavor text: "Cette attaque perdure pendant quatre à cinq tours. L’ennemi ne peut pas fuir au cours de cette période."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},

		start: "  {POKEMON} est harcelé par {SOURCE} !",
	},
	ingrain: {
		name: "Racines",
		// Official flavor text: "Le lanceur plante ses racines et récupère des PV à chaque tour. Une fois enraciné, il ne peut plus fuir."
		desc: "L'utilisateur récupère 1/16 de ses PV max à la fin de chaque tour, mais il ne peut plus quitter le combat et les autres Pokémon ne peuvent pas l'y forcer. L'utilisateur peut tout de même être remplacé s'il utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. S'il quitte le terrain avec Relais, son remplaçant reste piégé et reçoit l'effet de soin. Pendant l'effet, l'utilisateur peut être touché normalement par les attaques de type Sol et être affecté par Picots, Pics Toxik et Toile Gluante, même s'il est de type Vol ou a le talent Lévitation.", // NEEDS QC
		shortDesc: "S'enracine : +1/16 des PV par tour, ne peut partir.", // NEEDS QC
		gen7: {
			desc: "L'utilisateur récupère 1/16 de ses PV max à la fin de chaque tour, mais il ne peut plus quitter le combat et les autres Pokémon ne peuvent pas le forcer à être remplacé. Il peut tout de même être remplacé s'il utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. S'il quitte le terrain avec Relais, son remplaçant reste piégé et bénéficie toujours du soin. Pendant l'effet, l'utilisateur peut être touché normalement par les attaques de type Sol et être affecté par Picots, Pics Toxik et Toile Gluante, même s'il est de type Vol ou a le talent Lévitation.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur récupère 1/16 de ses PV max à la fin de chaque tour, mais il ne peut plus quitter le combat et les autres Pokémon ne peuvent pas le forcer à être remplacé. Il peut tout de même être remplacé s'il utilise Relais, Demi-Tour ou Change Éclair. S'il quitte le terrain avec Relais, son remplaçant reste piégé et bénéficie toujours du soin. Pendant l'effet, l'utilisateur peut être touché normalement par les attaques de type Sol et être affecté par Picots et Pics Toxik, même s'il est de type Vol ou a le talent Lévitation.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur récupère 1/16 de ses PV max à la fin de chaque tour, mais il ne peut plus quitter le combat et les autres Pokémon ne peuvent pas le forcer à être remplacé. Il peut tout de même être remplacé s'il utilise Relais ou Demi-Tour. S'il quitte le terrain avec Relais, son remplaçant reste piégé et bénéficie toujours du soin. Pendant l'effet, l'utilisateur peut être touché normalement par les attaques de type Sol et être affecté par Picots et Pics Toxik, même s'il est de type Vol ou a le talent Lévitation.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur récupère 1/16 de ses PV max à la fin de chaque tour, mais il ne peut plus quitter le combat et les autres Pokémon ne peuvent pas le forcer à être remplacé. Il peut tout de même être remplacé s'il utilise Relais ; son remplaçant reste piégé et bénéficie toujours du soin.", // NEEDS QC
			shortDesc: "Récupère 1/16 par tour. Ne peut plus se retirer.", // NEEDS QC
		},

		start: "  {POKEMON} plante ses racines !",
		block: "  {POKEMON} s’accroche avec ses racines !",
		heal: "  {POKEMON} absorbe des nutriments avec ses racines !",
	},
	instruct: {
		name: "Sommation",
		// Official flavor text: "Force la cible à lancer immédiatement la dernière capacité qu’elle a utilisée."
		desc: "La cible utilise immédiatement sa dernière capacité utilisée. Échoue si la cible n'a pas encore agi, si la capacité a 0 PP, si la cible prépare Bec-Canon, Mitra-Poing ou Carapiège, ou si la capacité est Assistance, Bec-Canon, Éructation, Patience, Crash Brûlant, Célébration, Babil, Crash Musclé, Photocopie, Canon Dynamax, Mitra-Poing, Mains Jointes, Ball’Glace, Sommation, Bouclier Royal, Crash Magique, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Crash Toxique, Blocage, Colère, Danse Fleurs, Roulade, Carapiège, Gribouille, Blabla Dodo, Lutte, Mania, Morphing, Brouhaha ou Crash Obscur, une capacité en deux tours ou une capacité à rechargement.", // NEEDS QC
		shortDesc: "La cible réutilise immédiatement sa dernière capacité.", // NEEDS QC
		gen8: {
			desc: "La cible utilise immédiatement sa dernière capacité utilisée. Échoue si la cible n'a pas encore agi, si la capacité a 0 PP, si la cible est dynamaxée, si la cible prépare Bec-Canon, Mitra-Poing ou Carapiège, ou si la capacité est Assistance, Bec-Canon, Éructation, Patience, Célébration, Babil, Photocopie, Canon Dynamax, Mitra-Poing, Mains Jointes, Ball’Glace, Sommation, Bouclier Royal, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Blocage, Colère, Danse Fleurs, Roulade, Carapiège, Gribouille, Blabla Dodo, Lutte, Mania, Morphing ou Brouhaha, une capacité en deux tours, une capacité nécessitant du repos, ou une capacité Dynamax ou Gigamax.", // NEEDS QC
		},
		gen7: {
			desc: "La cible utilise immédiatement sa dernière capacité utilisée. Échoue si la cible n'a pas encore agi, si la capacité a 0 PP, si la cible prépare Bec-Canon, Mitra-Poing ou Carapiège, ou si la capacité est Assistance, Bec-Canon, Éructation, Patience, Célébration, Babil, Photocopie, Mitra-Poing, Mains Jointes, Ball’Glace, Sommation, Bouclier Royal, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Colère, Danse Fleurs, Roulade, Carapiège, Gribouille, Blabla Dodo, Lutte, Mania, Morphing ou Brouhaha, une capacité en deux tours, une capacité nécessitant du repos, ou une capacité Z.", // NEEDS QC
		},

		activate: "  {TARGET} obéit à la sommation {POKEMON:de} !",
	},
	iondeluge: {
		name: "Déluge Plasmique",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Les capacités de type Normal deviennent de type Électrik ce tour. Cet effet s'applique après les autres effets qui changent le type d'une capacité.", // NEEDS QC
		shortDesc: "Les capacités Normal deviennent Électrik ce tour.", // NEEDS QC

		activate: "  Un déluge de plasma s’abat sur le terrain !",
	},
	irondefense: {
		name: "Mur de Fer",
		// Official flavor text: "L’épiderme du lanceur devient dur comme du fer, ce qui augmente beaucoup sa Défense."
		desc: "Monte la Défense de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur de 2 niveaux.", // NEEDS QC
	},
	ironhead: {
		name: "Tête de Fer",
		// Official flavor text: "Le lanceur heurte l’ennemi avec sa tête dure comme de l’acier. Peut aussi l’apeurer."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	irontail: {
		name: "Queue de Fer",
		// Official flavor text: "Attaque l’ennemi avec une queue de fer. Peut aussi baisser sa Défense."
		desc: "A 30 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "30 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	ivycudgel: {
		name: "Massue Liane",
		// Official flavor text: "Le lanceur frappe avec un gourdin enveloppé de lierre. Le type de cette capacité change selon le masque porté par le lanceur, et a un taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique. Si l'utilisateur est un Ogerpon, le type de cette capacité dépend de sa forme : type Eau avec le Masque du Puits, type Feu avec le Masque du Fourneau et type Roche avec le Masque de la Pierre.", // NEEDS QC
		shortDesc: "Taux de critique élevé. Type selon la forme.", // NEEDS QC
	},
	jawlock: {
		name: "Croque Fort",
		// Official flavor text: "Le lanceur et sa cible ne peuvent plus quitter le terrain jusqu’à ce que l’un d’entre eux tombe K.O. L’effet est annulé si l’un des deux Pokémon disparaît."
		desc: "Empêche l'utilisateur et la cible de quitter le combat. Ils peuvent tout de même être remplacés si l'un d'eux tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Le lanceur et la cible ne peuvent plus être remplacés.", // NEEDS QC
	},
	jetpunch: {
		name: "Poing Sonique",
		// Official flavor text: "Le lanceur enveloppe son poing d'un torrent furieux et attaque si rapidement qu'on peine à le discerner. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	judgment: {
		name: "Jugement",
		// Official flavor text: "Le lanceur libère une myriade de rayons de lumière. Le type varie selon la Plaque que tient le lanceur."
		desc: "Le type de cette capacité dépend de la plaque tenue par l'utilisateur.", // NEEDS QC
		shortDesc: "Son type dépend de la plaque tenue.", // NEEDS QC
	},
	jumpkick: {
		name: "Pied Sauté",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Si cette attaque échoue, l'utilisateur perd la moitié de ses PV max, arrondi à l'inférieur, en dégâts d'échec. Les Pokémon ayant le talent Garde Magik ne subissent pas les dégâts d'échec.", // NEEDS QC
		shortDesc: "S'il rate, le lanceur perd la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "Si cette attaque échoue, l'utilisateur perd en dégâts de chute la moitié des PV max de la cible, arrondi à l'inférieur, si celle-ci était immunisée, sinon la moitié des dégâts que la cible aurait subis, arrondi à l'inférieur, mais pas moins de 1 PV ni plus de la moitié des PV max de la cible. Les Pokémon ayant le talent Garde Magik ne subissent pas de dégâts de chute.", // NEEDS QC
			shortDesc: "En cas d'échec, subit 1/2 des dégâts prévus.", // NEEDS QC
		},
		gen3: {
			desc: "Si cette attaque échoue et que la cible n'était pas immunisée, l'utilisateur perd en dégâts de chute la moitié des dégâts que la cible aurait subis, arrondi à l'inférieur, mais pas moins de 1 PV ni plus de la moitié des PV max de la cible.", // NEEDS QC
			shortDesc: "En cas d'échec, subit 1/2 des dégâts prévus.", // NEEDS QC
		},
		gen2: {
			desc: "Si cette attaque échoue et que la cible n'était pas immunisée, l'utilisateur perd en dégâts de chute 1/8 des dégâts que la cible aurait subis, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
			shortDesc: "En cas d'échec, subit 1/8 des dégâts prévus.", // NEEDS QC
		},
		gen1: {
			desc: "Si cette attaque rate la cible, l'utilisateur subit 1 PV de dégâts de chute. Si l'utilisateur a un clone, ces dégâts sont infligés au clone de la cible s'il en a un, sinon aucun dégât de chute n'est infligé.", // NEEDS QC
			shortDesc: "En cas d'échec, l'utilisateur perd 1 PV.", // NEEDS QC
		},

		damage: "#crash",
	},
	junglehealing: {
		name: "Selve Salvatrice",
		// Official flavor text: "Le lanceur fait appel au pouvoir de la jungle pour restaurer les PV et soigner les altérations d’état de ses alliés et de lui-même."
		desc: "Chaque Pokémon du côté de l'utilisateur récupère 1/4 de ses PV max, arrondi au supérieur à partir de 0,5, et voit son problème de statut soigné.", // NEEDS QC
		shortDesc: "Équipe : +1/4 des PV max et statut soigné.", // NEEDS QC
	},
	karatechop: {
		name: "Poing Karaté",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	kinesis: {
		name: "Télékinésie",
		// Official flavor text: "Le lanceur distrait l’ennemi en pliant une cuillère, ce qui baisse sa Précision."
		desc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
	},
	kingsshield: {
		name: "Bouclier Royal",
		// Official flavor text: "Prend une posture défensive pour bloquer les dégâts. Diminue l’Attaque de tout Pokémon qui entre en contact avec le lanceur."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe voient leur Attaque baisser d'un niveau. Les capacités sans dégâts passent outre cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège des attaques. Contact : -1 Attaque.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe voient leur Attaque baisser d'un niveau. Les capacités de statut passent au travers de cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe voient leur Attaque baisser de 2 niveaux. Les capacités de statut passent au travers de cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
			shortDesc: "Bloque les attaques. Contact : Attaque -2.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe voient leur Attaque baisser de 2 niveaux. Les capacités de statut passent au travers de cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée n'est pas Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
	},
	knockoff: {
		name: "Sabotage",
		// Official flavor text: "Fait plus de dégâts aux cibles qui tiennent un objet. De plus, fait tomber cet objet et empêche la cible de l’utiliser jusqu’à la fin du combat."
		desc: "La puissance de cette capacité est multipliée par 1,5 si la cible tient un objet, et la cible perd son objet tenu si l'utilisateur n'est pas K.O. Une cible ayant le talent Glu ne perd pas son objet si elle n'est pas K.O. Cette capacité ne gagne pas en puissance et ne retire pas l'objet de la cible s'il s'agit d'une Gemme Bleue, d'une Gemme Rouge, d'un Globe Adamant, d'un Globe Perlé, d'un Globe Platiné, d'une plaque, d'un module, d'une ROM, d'une Épée Rouillée, d'un Bouclier Rouillé, d'une Énergie Booster ou d'un masque tenu respectivement par Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, un Pokémon Paradoxe ou Ogerpon, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Dans ce cas, les Pokémon Paradoxe incluent toutes les espèces ayant les talents Paléosynthèse et Charge Quantique, sauf Feu-Perçant, Ire-Foudre, Roc-de-Fer et Chef-de-Fer. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		shortDesc: "Dégâts x1,5 si la cible a un objet, et le retire.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "La puissance de cette capacité est multipliée par 1,5 si la cible tient un objet, et la cible perd son objet si l'utilisateur n'est pas K.O. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. La puissance n'augmente pas et l'objet n'est pas retiré s'il s'agit de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque, d'un module, d'une ROM, de Épée Rouillée ou de Bouclier Rouillé tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen7: {
			desc: "La puissance de cette capacité est multipliée par 1,5 si la cible tient un objet, et la cible perd son objet si l'utilisateur n'est pas K.O. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. La puissance n'augmente pas et l'objet n'est pas retiré s'il s'agit d'un Cristal Z, d'une Méga-Gemme tenue par l'espèce pouvant méga-évoluer avec, ou de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque, d'un module ou d'une ROM tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen6: {
			desc: "La puissance de cette capacité est multipliée par 1,5 si la cible tient un objet, et la cible perd son objet si l'utilisateur n'est pas K.O. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. La puissance n'augmente pas et l'objet n'est pas retiré s'il s'agit d'une Méga-Gemme tenue par l'espèce pouvant méga-évoluer avec, ou de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque ou d'un module tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen5: {
			desc: "Si l'utilisateur n'est pas K.O., la cible perd son objet tenu. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas retiré s'il s'agit de Orbe Platiné, d'une plaque ou d'un module tenus respectivement par Giratina, Arceus ou Genesect, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
			shortDesc: "Retire l'objet tenu par la cible.", // NEEDS QC
		},
		gen4: {
			desc: "La cible perd son objet tenu pour le reste du combat, sauf si l'objet est une Orbe Platiné ou si la cible a le talent Multi-Type ou Glu. Pendant l'effet, la cible ne peut obtenir aucun nouvel objet.", // NEEDS QC
			shortDesc: "La cible perd son objet et n'en obtient plus.", // NEEDS QC
		},
		gen3: {
			desc: "La cible perd son objet tenu pour le reste du combat, sauf si elle a le talent Glu. Pendant l'effet, la cible ne peut obtenir aucun nouvel objet.", // NEEDS QC
		},

		removeItem: "  {SOURCE} fait tomber {ITEM:definite:classified} {POKEMON:de} !",
	},
	kowtowcleave: {
		name: "Génusection",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	landswrath: {
		name: "Force Chtonienne",
		// Official flavor text: "Utilise la puissance du sol et la concentre sur l’ennemi pour infliger des dégâts."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis adjacents.", // NEEDS QC
	},
	laserfocus: {
		name: "Affilage",
		// Official flavor text: "Le lanceur se concentre pour être sûr de porter un coup critique au tour suivant."
		desc: "Jusqu'à la fin du tour suivant, les attaques de l'utilisateur porteront des coups critiques.", // NEEDS QC
		shortDesc: "Coups critiques jusqu'à la fin du tour suivant.", // NEEDS QC

		start: "  {POKEMON} aiguise son esprit !",
	},
	lashout: {
		name: "Cent Rancunes",
		// Official flavor text: "Le lanceur frappe l’ennemi avec toute sa rancune. Si les stats du lanceur ont diminué pendant ce tour, la puissance de cette attaque est doublée."
		desc: "La puissance est doublée si les niveaux de statistiques de l'utilisateur ont baissé ce tour.", // NEEDS QC
		shortDesc: "Puissance x2 si ses stats ont baissé ce tour.", // NEEDS QC
	},
	lastresort: {
		name: "Dernier Recours",
		// Official flavor text: "Cette capacité ne peut être utilisée qu’après que le lanceur a utilisé toutes les autres."
		desc: "Cette capacité échoue si l'utilisateur ne connaît pas au moins une autre capacité en plus de celle-ci, ou s'il n'a pas utilisé au moins une fois chacune de ses autres capacités depuis son entrée au combat ou sa transformation.", // NEEDS QC
		shortDesc: "Échoue si ses autres capacités n'ont pas été utilisées.", // NEEDS QC
	},
	lastrespects: {
		name: "Hommage Posthume",
		// Official flavor text: "Le lanceur attaque pour venger ses alliés. Plus le nombre de Pokémon alliés mis K.O. est élevé, plus la puissance de cette capacité augmente."
		desc: "La puissance est égale à 50 + (X × 50), où X est le nombre total de Pokémon de l'équipe de l'utilisateur mis K.O., avec un maximum de 100.", // NEEDS QC
		shortDesc: "+50 de puissance par équipier mis K.O.", // NEEDS QC
	},
	lavaplume: {
		name: "Ébullilave",
		// Official flavor text: "Des boules de feu s’abattent sur tous les Pokémon autour du lanceur. Peut aussi les brûler."
		desc: "A 30 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "30 % de brûler les Pokémon adjacents.", // NEEDS QC
	},
	leafage: {
		name: "Feuillage",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	leafblade: {
		name: "Lame Feuille",
		// Official flavor text: "Une feuille coupante comme une lame entaille l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	leafstorm: {
		name: "Tempête Verte",
		// Official flavor text: "Invoque une tempête de feuilles acérées. Le contrecoup réduit beaucoup l’Attaque Spéciale du lanceur."
		desc: "Baisse l'Attaque Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Atq. Spé du lanceur de 2 niveaux.", // NEEDS QC
	},
	leaftornado: {
		name: "Phytomixeur",
		// Official flavor text: "L’ennemi est pris dans un tourbillon de feuilles acérées. Peut aussi baisser sa Précision."
		desc: "A 50 % de chances de baisser la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser la précision de la cible d'un niveau.", // NEEDS QC
	},
	leechlife: {
		name: "Vampirisme",
		// Official flavor text: "Une attaque qui aspire le sang de l’ennemi. La moitié des dégâts sont convertis en PV pour le lanceur."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	leechseed: {
		name: "Vampigraine",
		// Official flavor text: "Une graine est semée sur l’ennemi. À chaque tour, elle lui dérobe des PV que le lanceur récupère."
		desc: "Le Pokémon à la position de l'utilisateur vole 1/8 des PV max de la cible, arrondi à l'inférieur, à la fin de chaque tour. Si le bénéficiaire tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5. Si la cible utilise Relais, son remplaçant continue d'être drainé. Si la cible quitte le combat ou utilise Toupie Éclat ou Tour Rapide avec succès, l'effet prend fin. Les Pokémon de type Plante sont immunisés contre l'utilisation de cette capacité, mais pas contre son effet.", // NEEDS QC
		shortDesc: "Draine 1/8 des PV de la cible chaque tour.", // NEEDS QC
		gen8: {
			desc: "Le Pokémon à la position de l'utilisateur vole 1/8 des PV max de la cible, arrondi à l'inférieur, à la fin de chaque tour. Si le bénéficiaire tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5. Si la cible utilise Relais, son remplaçant continue d'être drainé. Si la cible quitte le combat ou utilise Tour Rapide avec succès, l'effet prend fin. Les Pokémon de type Plante sont immunisés contre cette capacité à l'utilisation, mais pas contre son effet.", // NEEDS QC
		},
		gen3: {
			desc: "Le Pokémon à la position de l'utilisateur vole 1/8 des PV max de la cible, arrondi à l'inférieur, à la fin de chaque tour. Si la cible utilise Relais, son remplaçant continue d'être drainé. Si la cible quitte le combat ou utilise Tour Rapide, l'effet prend fin. Les Pokémon de type Plante sont immunisés contre cette capacité à l'utilisation, mais pas contre son effet.", // NEEDS QC
		},
		gen1: {
			desc: "À la fin de chaque tour de la cible, le Pokémon à la position de l'utilisateur vole 1/16 des PV max de la cible, arrondi à l'inférieur et multiplié par le compteur de Toxik actuel de la cible si elle en a un, même si la cible a moins de PV restants. Si la cible quitte le combat ou si un Pokémon utilise Buée Noire, cet effet prend fin. Les Pokémon de type Plante sont immunisés contre cette capacité.", // NEEDS QC
			shortDesc: "Vole 1/16 des PV de la cible chaque tour.", // NEEDS QC
		},

		start: "  {POKEMON} est infecté !",
		end: "  {POKEMON} est libéré de la capacité Vampigraine !",
		damage: "  Vampigraine draine l’énergie {POKEMON:de} !",
	},
	leer: {
		name: "Groz’Yeux",
		// Official flavor text: "Le lanceur fait les gros yeux à l’ennemi pour l’intimider et baisser sa Défense."
		desc: "Baisse la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la Défense des ennemis d'un niveau.", // NEEDS QC
		gen2: {
			shortDesc: "Baisse la Défense de la cible d'un niveau.", // NEEDS QC
		},
	},
	letssnuggleforever: {
		name: "Patati-Patattrape",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	lick: {
		name: "Léchouille",
		// Official flavor text: "Un grand coup de langue qui inflige des dégâts à l’ennemi. Peut aussi le paralyser."
		desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "30 % de paralyser la cible.", // NEEDS QC
	},
	lifedew: {
		name: "Fontaine de Vie",
		// Official flavor text: "Le lanceur projette une eau mystérieuse autour du terrain pour restaurer ses PV et ceux de ses alliés au combat."
		desc: "Chaque Pokémon du côté de l'utilisateur récupère 1/4 de ses PV max, arrondi au supérieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Soigne le lanceur et ses alliés de 1/4 des PV max.", // NEEDS QC
	},
	lightofruin: {
		name: "Lumière du Néant",
		// Official flavor text: "Utilise la puissance de la fleur Éternelle pour lancer un formidable rayon d’énergie. Blesse aussi gravement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de la moitié des dégâts.", // NEEDS QC
	},
	lightscreen: {
		name: "Mur Lumière",
		// Official flavor text: "Crée un fabuleux mur de lumière qui réduit les dégâts causés par les capacités spéciales pendant cinq tours."
		desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 0,5x les dégâts des attaques spéciales, ou 0,66x en Combat Duo. Les dégâts ne sont pas réduits davantage avec Voile Aurore. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique, Psycho-Croc ou Anti-Brume. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "5 tours : dégâts spéciaux subis réduits de moitié.", // NEEDS QC
		gen6: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 0,5x les dégâts des attaques spéciales, ou 0,66x en Combat Duo ou Trio. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique ou Anti-Brume. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 1/2 des dégâts des attaques spéciales, ou 2/3 s'il y a plusieurs Pokémon actifs du côté de l'utilisateur. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique ou Anti-Brume. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},
		gen3: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 1/2 des dégâts des attaques spéciales, ou 2/3 s'il y a plusieurs Pokémon actifs du côté de l'utilisateur. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe ont leur Défense Spéciale doublée. Les coups critiques ignorent cet effet. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
			shortDesc: "5 tours : Déf. Spé de l'équipe doublée.", // NEEDS QC
		},
		gen1: {
			desc: "Tant que l'utilisateur reste au combat, son Spécial est doublé quand il subit des dégâts. Les coups critiques ignorent cet effet. Si un Pokémon utilise Buée Noire, l'effet prend fin.", // NEEDS QC
			shortDesc: "Tant qu'actif : Spécial x2 quand il subit des dégâts.", // NEEDS QC
			start: "  {POKEMON} est protégé contre les attaques spéciales!",
		},

		start: "  Mur Lumière augmente la résistance de {TEAM} aux capacités spéciales !",
		end: "  Mur Lumière n’a plus d’effet sur {TEAM} !",
	},
	lightthatburnsthesky: {
		name: "Apocalypsis Luminis",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette capacité devient une attaque physique si l'Attaque de l'utilisateur est supérieure à son Attaque Spéciale, changements de niveaux compris. Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Physique si Atq > Atq. Spé. Ignore les talents.", // NEEDS QC
	},
	liquidation: {
		name: "Aqua-Brèche",
		// Official flavor text: "Le lanceur utilise la force de l’eau pour attaquer. Peut aussi baisser la Défense de la cible."
		desc: "A 20 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "20 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	lockon: {
		name: "Verrouillage",
		// Official flavor text: "Verrouille l’ennemi pour ne pas le rater au tour suivant."
		desc: "Jusqu'à la fin du tour suivant, la cible ne peut pas éviter les capacités de l'utilisateur, même si elle est au milieu d'une capacité en deux tours. L'effet prend fin si l'utilisateur ou la cible quitte le terrain. Échoue si cet effet est déjà actif pour l'utilisateur.", // NEEDS QC
		shortDesc: "Sa prochaine capacité ne ratera pas la cible.", // NEEDS QC
		gen4: {
			desc: "Jusqu'à la fin du tour suivant, la cible ne peut pas éviter les capacités de l'utilisateur, même au milieu d'une capacité en deux tours. Quand cet effet démarre contre la cible, cet effet et celui de Lire-Esprit prennent fin pour tous les autres Pokémon contre cette cible. Si la cible quitte le terrain avec Relais, son remplaçant reste sous cet effet. Si l'utilisateur quitte le terrain avec Relais, l'effet redémarre contre la même cible pour son remplaçant. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		},
		gen2: {
			desc: "Le prochain test de précision contre la cible réussit. La cible évite tout de même Séisme, Abîme et Ampleur si elle utilise Vol. Si la cible quitte le terrain avec Relais, son remplaçant reste sous cet effet. Cet effet prend fin quand la cible quitte le terrain ou qu'un test de précision est effectué contre elle.", // NEEDS QC
			shortDesc: "La prochaine capacité ne ratera pas la cible.", // NEEDS QC
		},

		start: "  {SOURCE} vise {POKEMON} !",
	},
	lovelykiss: {
		name: "Grobisou",
		shortDesc: "Endort la cible.", // NEEDS QC
	},
	lowkick: {
		name: "Balayage",
		// Official flavor text: "Un puissant coup de pied bas qui fauche l’ennemi. Il est plus efficace contre les ennemis lourds."
		desc: "La puissance de cette capacité est de 20 si la cible pèse moins de 10 kg, 40 si moins de 25 kg, 60 si moins de 50 kg, 80 si moins de 100 kg, 100 si moins de 200 kg, et 120 si 200 kg ou plus.", // NEEDS QC
		shortDesc: "Plus puissant si la cible est lourde.", // NEEDS QC
		gen2: {
			desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
			shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		},
	},
	lowsweep: {
		name: "Balayette",
		// Official flavor text: "Un coup rapide qui affecte la mobilité de l’ennemi et diminue sa Vitesse."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
	},
	luckychant: {
		name: "Air Veinard",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Pendant 5 tours, l'utilisateur et son équipe ne peuvent pas subir de coup critique. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "5 tours : l'équipe ne subit pas de coups critiques.", // NEEDS QC

		start: "  Air Veinard immunise {TEAM} contre les coups critiques !",
		end: "  Les effets d’Air Veinard sur {TEAM} prennent fin !",
	},
	luminacrash: {
		name: "Lumino-Impact",
		// Official flavor text: "Le lanceur attaque en émettant une étrange lumière qui ébranle l'esprit de la cible. Cela baisse beaucoup la Défense Spéciale de la cible."
		desc: "A 100 % de chances de baisser la Défense Spéciale de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "100 % de baisser la Déf. Spé de la cible de 2 niveaux.", // NEEDS QC
	},
	lunarblessing: {
		name: "Prière Lunaire",
		// Official flavor text: "Le lanceur adresse une prière à la lune pour restaurer les PV et soigner ses altérations de statut ainsi que celles de ses alliés."
		desc: "Chaque Pokémon du côté de l'utilisateur récupère 1/4 de ses PV max, arrondi au supérieur à partir de 0,5, et voit son problème de statut soigné.", // NEEDS QC
		shortDesc: "Équipe : +1/4 des PV max et statut soigné.", // NEEDS QC
	},
	lunardance: {
		name: "Danse Lune",
		// Official flavor text: "Le lanceur tombe K.O. pour soigner le statut et les PV du Pokémon qui prendra sa place au combat."
		desc: "L'utilisateur est mis K.O., et si le Pokémon envoyé pour le remplacer n'a pas tous ses PV ou PP, ou a un problème de statut, ses PV et PP sont entièrement restaurés et son problème de statut est soigné. Le remplaçant est envoyé à la fin du tour, et le soin a lieu avant l'effet des pièges. Cet effet persiste jusqu'à ce qu'un Pokémon remplissant l'une de ces conditions entre à la position de l'utilisateur ou y soit échangé avec Interversion. Échoue si l'utilisateur est le dernier Pokémon non K.O. de son équipe.", // NEEDS QC
		shortDesc: "K.O. ; le prochain Pokémon blessé est soigné à fond.", // NEEDS QC
		gen7: {
			desc: "L'utilisateur est mis K.O. et le Pokémon qui le remplace a ses PV et PP entièrement restaurés et son problème de statut soigné. Le nouveau Pokémon est envoyé à la fin du tour, et le soin a lieu avant l'effet des pièges. Échoue si l'utilisateur est le dernier Pokémon non K.O. de son équipe.", // NEEDS QC
			shortDesc: "K.O. volontaire. Remplaçant soigné, PP compris.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur est mis K.O. et le Pokémon qui le remplace a ses PV et PP entièrement restaurés et son problème de statut soigné. Le nouveau Pokémon est envoyé immédiatement, et le soin a lieu après l'effet des pièges. Échoue si l'utilisateur est le dernier Pokémon non K.O. de son équipe.", // NEEDS QC
		},

		heal: "  {POKEMON} baigne dans la lumière des rayons de lune !",
	},
	lunge: {
		name: "Furie-Bond",
		// Official flavor text: "Le lanceur se jette sur la cible de toutes ses forces pour lui infliger des dégâts et baisser son Attaque."
		desc: "A 100 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	lusterpurge: {
		name: "Lumi-Éclat",
		// Official flavor text: "Le lanceur libère un éclair lumineux. Peut aussi baisser la Défense Spéciale de l’ennemi."
		desc: "A 50 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	machpunch: {
		name: "Mach Punch",
		// Official flavor text: "Coup de poing fulgurant. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	magicalleaf: {
		name: "Feuille Magik",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	magicaltorque: {
		name: "Crash Magique",
		desc: "A 30 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "30 % de rendre la cible confuse.", // NEEDS QC
	},
	magiccoat: {
		name: "Reflet Magik",
		// Official flavor text: "Une barrière qui renvoie les capacités comme Vampigraine et celles affectant le statut et les stats."
		desc: "Jusqu'à la fin du tour, l'utilisateur n'est pas affecté par certaines capacités sans dégâts qui le ciblent : il les renvoie contre leur utilisateur. Les capacités ainsi renvoyées ne peuvent pas être renvoyées de nouveau par cet effet ou par le talent Miroir Magik. Picots, Piège de Roc, Toile Gluante et Pics Toxik ne peuvent être renvoyés qu'une fois par équipe, par le Pokémon le plus à gauche sous cet effet ou sous le talent Miroir Magik. Les talents Paratonnerre et Lavabo redirigent leurs capacités respectives avant que cette capacité n'agisse.", // NEEDS QC
		shortDesc: "Renvoie certaines capacités de statut.", // NEEDS QC
		gen5: {
			desc: "Jusqu'à la fin du tour, l'utilisateur n'est pas affecté par certaines capacités de statut qui le visent et les utilise à la place contre leur utilisateur d'origine. Les capacités ainsi renvoyées ne peuvent pas être renvoyées à nouveau par cet effet ou celui du talent Miroir Magik. Picots, Piège de Roc et Pics Toxik ne peuvent être renvoyées qu'une fois par côté, par le Pokémon le plus à gauche sous cet effet ou celui du talent Miroir Magik. Les talents Paratonnerre et Lavabo redirigent leurs capacités respectives avant que cette capacité n'agisse.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur n'est pas affecté par certaines capacités de statut qui le visent et les utilise à la place contre leur utilisateur d'origine. Si la capacité vise les deux Pokémon adverses, le Pokémon sous cet effet ne la renvoie que contre son utilisateur d'origine. L'effet prend fin dès qu'une capacité est renvoyée ou à la fin du tour. Les talents Paratonnerre et Lavabo redirigent leurs capacités respectives avant que cette capacité n'agisse.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur n'est pas affecté par certaines capacités de statut qui le visent et les utilise à la place contre leur utilisateur d'origine. Si la capacité vise les deux Pokémon adverses et que le Pokémon sous cet effet est à gauche, il renvoie la capacité en visant les deux Pokémon adverses et son allié n'est pas affecté par la capacité d'origine ; s'il est à droite, son allié est affecté par la capacité d'origine et il ne renvoie la capacité que contre son utilisateur d'origine. L'effet prend fin dès qu'une capacité est renvoyée ou à la fin du tour. Les capacités ainsi renvoyées peuvent être renvoyées à nouveau par un autre Pokémon sous cet effet. Si l'utilisateur a le talent Anti-Bruit, celui-ci annule les capacités sonores avant que cet effet n'agisse. Le talent Paratonnerre redirige les capacités de type Électrik avant que cette capacité n'agisse.", // NEEDS QC
		},

		start: "  {POKEMON} s’entoure du Reflet Magik !",
		move: "{POKEMON} renvoie la capacité {MOVE} ! Retour à l’envoyeur !",
	},
	magicpowder: {
		name: "Poudre Magique",
		// Official flavor text: "Le lanceur recouvre sa cible d’une poudre magique qui change son type en Psy."
		desc: "La cible devient de type Psy. Échoue si la cible est un Arceus ou un Silvallié, si elle est déjà purement de type Psy, ou si elle est téracristallisée.", // NEEDS QC
		shortDesc: "La cible devient de type Psy.", // NEEDS QC
		gen8: {
			desc: "La cible devient de type Psy. Échoue si la cible est un Arceus ou un Silvallié, ou si elle est déjà purement de type Psy.", // NEEDS QC
		},
	},
	magicroom: {
		name: "Zone Magique",
		// Official flavor text: "Le lanceur crée une zone mystérieuse où les objets tenus par tous les Pokémon n’ont plus aucun effet pendant cinq tours."
		desc: "Pendant 5 tours, les objets tenus par tous les Pokémon actifs n'ont aucun effet. Les changements de forme causés par un objet ne sont pas affectés, mais tous les autres effets de tels objets sont annulés. Pendant l'effet, aucun Pokémon actif ne peut utiliser Dégommage ni Don Naturel. Si cette capacité est utilisée pendant l'effet, celui-ci prend fin.", // NEEDS QC
		shortDesc: "5 tours : aucun objet tenu n'a d'effet.", // NEEDS QC
	},
	magmastorm: {
		name: "Vortex Magma",
		// Official flavor text: "L’ennemi est pris dans un tourbillon de feu qui dure de quatre à cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max (1/8 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours (toujours cinq si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
			shortDesc: "Piège et blesse la cible pendant 2-5 tours.", // NEEDS QC
		},

		start: "  {POKEMON} est piégé dans un tourbillon de magma !",
	},
	magnetbomb: {
		name: "Bombe Aimant",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	magneticflux: {
		name: "Magné-Contrôle",
		// Official flavor text: "Manipule les champs magnétiques pour augmenter la Défense et la Défense Spéciale des Pokémon alliés dotés du talent Plus ou du talent Moins."
		desc: "Monte la Défense et la Défense Spéciale des Pokémon de l'équipe de l'utilisateur ayant le talent Plus ou Moins d'un niveau.", // NEEDS QC
		shortDesc: "+1 Déf et Déf. Spé des alliés avec Plus/Moins.", // NEEDS QC
	},
	magnetrise: {
		name: "Vol Magnétik",
		// Official flavor text: "Le lanceur utilise l’électricité pour générer un champ magnétique et léviter durant cinq tours."
		desc: "Pendant 5 tours, l'utilisateur est immunisé contre les attaques de type Sol et contre les effets de Picots, Pics Toxik, Toile Gluante et du talent Piège Sable tant qu'il reste au combat. Si l'utilisateur utilise Relais, son remplaçant hérite de l'effet. Racines, Anti-Air, Myria-Flèches et la Balle Fer priment sur cette capacité si l'utilisateur est sous l'un de leurs effets. Échoue si l'utilisateur est déjà sous cet effet ou sous ceux de Racines, Anti-Air ou Myria-Flèches.", // NEEDS QC
		shortDesc: "5 tours : le lanceur est immunisé contre le Sol.", // NEEDS QC
		gen5: {
			desc: "Pendant 5 tours, l'utilisateur est immunisé contre les attaques de type Sol et contre les effets de Picots, Pics Toxik et du talent Piège Sable tant qu'il reste au combat. Si l'utilisateur utilise Relais, son remplaçant hérite de l'effet. Racines, Anti-Air et la Balle Fer priment sur cette capacité si l'utilisateur est sous l'un de leurs effets. Échoue si l'utilisateur est déjà sous cet effet ou sous ceux de Racines ou Anti-Air.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 5 tours, l'utilisateur est immunisé contre les attaques de type Sol et contre les effets de Picots, Pics Toxik et du talent Piège Sable tant qu'il reste au combat. Si l'utilisateur utilise Relais, son remplaçant hérite de l'effet. Racines et la Balle Fer priment sur cette capacité si l'utilisateur est sous l'un de leurs effets. Échoue si l'utilisateur est déjà sous cet effet ou sous celui de Racines.", // NEEDS QC
		},

		start: "  {POKEMON} lévite sur un champ magnétique !",
		end: "  Le magnétisme {POKEMON:de} se dissipe !",
	},
	magnitude: {
		name: "Ampleur",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance de cette capacité varie : 5 % de chances pour 10 et 150 de puissance, 10 % pour 30 et 110, 20 % pour 50 et 90, et 30 % pour 70. Les dégâts sont doublés si la cible utilise Tunnel.", // NEEDS QC
		shortDesc: "Adjacents. Puissance variable ; x2 sur Tunnel.", // NEEDS QC
		gen4: {
			desc: "La puissance de cette capacité varie : 5 % de chances pour 10 et 150 de puissance, 10 % pour 30 et 110, 20 % pour 50 et 90, et 30 % pour 70. La puissance est doublée si la cible utilise Tunnel.", // NEEDS QC
		},

		activate: "  Ampleur {NUMBER}!",
	},
	makeitrain: {
		name: "Ruée d'Or",
		// Official flavor text: "Le lanceur attaque en lançant de nombreuses pièces, ce qui baisse son Attaque Spéciale. Permet d'obtenir plus d'argent à la fin du combat."
		desc: "Baisse l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "-1 Atq. Spé du lanceur. Touche les ennemis.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "#payday",
	},
	maliciousmoonsault: {
		name: "Dark Body Press",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "Dégâts x2 si la cible a utilisé Lilliput.", // NEEDS QC
	},
	malignantchain: {
		name: "Chaîne Malsaine",
		// Official flavor text: "Le lanceur ligote la cible avec une chaîne faite de poison et lui injecte un venin corrosif, ce qui peut aussi gravement l'empoisonner."
		desc: "A 50 % de chances d'empoisonner gravement la cible.", // NEEDS QC
		shortDesc: "50 % d'empoisonner gravement la cible.", // NEEDS QC
	},
	matblock: {
		name: "Tatamigaeshi",
		// Official flavor text: "Retourne un tatami pour bloquer, comme avec un bouclier, les capacités visant le lanceur ou ses alliés. N’a pas d’effet sur les attaques de statut."
		desc: "L'utilisateur et son équipe sont protégés des attaques infligeant des dégâts des autres Pokémon, alliés compris, pendant ce tour. Échoue si ce n'est pas le premier tour de l'utilisateur sur le terrain, s'il agit en dernier ce tour, ou si cet effet est déjà actif de son côté.", // NEEDS QC
		shortDesc: "Protège l'équipe des attaques. Premier tour seulement.", // NEEDS QC

		start: "  {POKEMON} se prépare à utiliser un tatami pour bloquer les attaques !",
		block: "  La capacité {MOVE} a été bloquée par un tatami !",
	},
	matchagotcha: {
		name: "Mortier Matcha",
		// Official flavor text: "Le lanceur remue son thé et en bombarde la cible. La moitié des dégâts infligés sont convertis en PV pour le lanceur. Cette capacité peut aussi brûler la cible."
		desc: "A 20 % de chances de brûler la cible. L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5. La cible est dégelée si elle était gelée.", // NEEDS QC
		shortDesc: "20 % de brûler. Récupère moitié des dégâts. Dégèle.", // NEEDS QC
	},
	maxairstream: {
		name: "Aéromax",
		// Official flavor text: "Une attaque de type Vol que seuls les Pokémon Dynamax peuvent utiliser. Augmente la Vitesse des alliés."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, la Vitesse de chaque Pokémon du côté de l'utilisateur monte d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : +1 Vitesse.", // NEEDS QC
	},
	maxdarkness: {
		name: "Sinistromax",
		// Official flavor text: "Une attaque de type Ténèbres que seuls les Pokémon Dynamax peuvent utiliser. Baisse la Défense Spéciale de la cible."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, la Défense Spéciale de chaque Pokémon du côté adverse baisse d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1 Déf. Spé.", // NEEDS QC
	},
	maxflare: {
		name: "Pyromax",
		// Official flavor text: "Une attaque de type Feu que seuls les Pokémon Dynamax peuvent utiliser. Fait briller le soleil pendant cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Soleil commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Invoque le soleil.", // NEEDS QC
	},
	maxflutterby: {
		name: "Insectomax",
		// Official flavor text: "Une attaque de type Insecte que seuls les Pokémon Dynamax peuvent utiliser. Baisse l’Attaque Spéciale de la cible."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'Attaque Spéciale de chaque Pokémon du côté adverse baisse d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1 Atq. Spé.", // NEEDS QC
	},
	maxgeyser: {
		name: "Hydromax",
		// Official flavor text: "Une attaque de type Eau que seuls les Pokémon Dynamax peuvent utiliser. Invoque de fortes pluies qui durent cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Pluie commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Invoque la pluie.", // NEEDS QC
	},
	maxguard: {
		name: "Gardomax",
		// Official flavor text: "Le lanceur se protège de toutes les attaques. Peut échouer si utilisée plusieurs fois de suite."
		desc: "L'utilisateur est protégé de presque toutes les attaques des autres Pokémon pendant ce tour, y compris les capacités Dynamax et Gigamax. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège même des capacités Dynamax ce tour.", // NEEDS QC

		activate: "  {POKEMON} se protège !",
	},
	maxhailstorm: {
		name: "Cryomax",
		// Official flavor text: "Une attaque de type Glace que seuls les Pokémon Dynamax peuvent utiliser. Invoque une tempête de grêle qui dure cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Grêle commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Invoque la grêle.", // NEEDS QC
	},
	maxknuckle: {
		name: "Pugilomax",
		// Official flavor text: "Une attaque de type Combat que seuls les Pokémon Dynamax peuvent utiliser. Augmente l’Attaque des alliés."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'Attaque de chaque Pokémon du côté de l'utilisateur monte d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : +1 Attaque.", // NEEDS QC
	},
	maxlightning: {
		name: "Fulguromax",
		// Official flavor text: "Une attaque de type Électrik que seuls les Pokémon Dynamax peuvent utiliser. Crée un Champ Électrifié qui dure cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Champ Électrifié commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Champ électrifié.", // NEEDS QC
	},
	maxmindstorm: {
		name: "Psychomax",
		// Official flavor text: "Une attaque de type Psy que seuls les Pokémon Dynamax peuvent utiliser. Crée un Champ Psychique qui dure cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Champ Psychique commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Champ psychique.", // NEEDS QC
	},
	maxooze: {
		name: "Toxinomax",
		// Official flavor text: "Une attaque de type Poison que seuls les Pokémon Dynamax peuvent utiliser. Augmente l’Attaque Spéciale des alliés."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'Attaque Spéciale de chaque Pokémon du côté de l'utilisateur monte d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : +1 Atq. Spé.", // NEEDS QC
	},
	maxovergrowth: {
		name: "Phytomax",
		// Official flavor text: "Une attaque de type Plante que seuls les Pokémon Dynamax peuvent utiliser. Crée un Champ Herbu qui dure cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Champ Herbu commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Champ herbu.", // NEEDS QC
	},
	maxphantasm: {
		name: "Spectromax",
		// Official flavor text: "Une attaque de type Spectre que seuls les Pokémon Dynamax peuvent utiliser. Baisse la Défense de la cible."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, la Défense de chaque Pokémon du côté adverse baisse d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1 Défense.", // NEEDS QC
	},
	maxquake: {
		name: "Sismomax",
		// Official flavor text: "Une attaque de type Sol que seuls les Pokémon Dynamax peuvent utiliser. Augmente la Défense Spéciale des alliés."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, la Défense Spéciale de chaque Pokémon du côté de l'utilisateur monte d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : +1 Déf. Spé.", // NEEDS QC
	},
	maxrockfall: {
		name: "Lithomax",
		// Official flavor text: "Une attaque de type Roche que seuls les Pokémon Dynamax peuvent utiliser. Invoque une tempête de sable qui dure cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Tempête de Sable commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Tempête de sable.", // NEEDS QC
	},
	maxstarfall: {
		name: "Enchantomax",
		// Official flavor text: "Une attaque de type Fée que seuls les Pokémon Dynamax peuvent utiliser. Crée un Champ Brumeux qui dure cinq tours."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'effet de Champ Brumeux commence. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Champ brumeux.", // NEEDS QC
	},
	maxsteelspike: {
		name: "Métallomax",
		// Official flavor text: "Une attaque de type Acier que seuls les Pokémon Dynamax peuvent utiliser. Augmente la Défense des alliés."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, la Défense de chaque Pokémon du côté de l'utilisateur monte d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Alliés : +1 Défense.", // NEEDS QC
	},
	maxstrike: {
		name: "Normalomax",
		// Official flavor text: "Une attaque de type Normal que seuls les Pokémon Dynamax peuvent utiliser. Baisse la Vitesse de la cible."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, la Vitesse de chaque Pokémon du côté adverse baisse d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1 Vitesse.", // NEEDS QC
	},
	maxwyrmwind: {
		name: "Dracomax",
		// Official flavor text: "Une attaque de type Dragon que seuls les Pokémon Dynamax peuvent utiliser. Baisse l’Attaque de la cible."
		desc: "La puissance est égale à celle de la capacité Dynamax de la capacité de base. Si cette capacité réussit, l'Attaque de chaque Pokémon du côté adverse baisse d'un niveau, même derrière un clone. Cet effet ne se produit pas si l'utilisateur n'est pas dynamaxé. Si cette capacité est utilisée comme capacité de base, elle inflige des dégâts avec une puissance de 0.", // NEEDS QC
		shortDesc: "Puissance selon capa. de base. Ennemis : -1 Attaque.", // NEEDS QC
	},
	meanlook: {
		name: "Regard Noir",
		// Official flavor text: "Le lanceur pétrifie l’ennemi en lui lançant un regard noir. Il devient incapable de s’enfuir."
		desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Empêche la cible de quitter le combat.", // NEEDS QC
		gen7: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain, sauf s'il utilise Relais, auquel cas la cible reste piégée.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle utilise Relais. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain, sauf s'il utilise Relais, auquel cas la cible reste piégée.", // NEEDS QC
		},
	},
	meditate: {
		name: "Yoga",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Monte l'Attaque de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'Attaque du lanceur d'un niveau.", // NEEDS QC
	},
	mefirst: {
		name: "Moi d’Abord",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "L'utilisateur utilise contre la cible, si possible, la capacité que celle-ci a choisie ce tour, avec sa puissance multipliée par 1,5. La capacité doit être une capacité offensive autre que Bec-Canon, Éructation, Crash Brûlant, Crash Musclé, Vindicte, Riposte, Implore, Mitra-Poing, Crash Magique, Moi d’Abord, Fulmifer, Voile Miroir, Crash Toxique, Carapiège, Lutte, Larcin ou Crash Obscur. Échoue si la cible agit avant l'utilisateur. Ignore le clone de la cible pour la copie de la capacité.", // NEEDS QC
		shortDesc: "Copie l'ennemi avec x1,5. Doit agir en premier.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur utilise contre la cible, si possible, la capacité que celle-ci a choisie ce tour, avec sa puissance multipliée par 1,5. La capacité doit être une capacité offensive autre que Bec-Canon, Éructation, Babil, Riposte, Implore, Mitra-Poing, Moi d’Abord, Fulmifer, Voile Miroir, Carapiège, Lutte ou Larcin. Échoue si la cible agit avant l'utilisateur. Ignore le clone de la cible pour la copie de la capacité.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur utilise contre la cible, si possible, la capacité que celle-ci a choisie ce tour, avec sa puissance multipliée par 1,5. La capacité doit être une capacité offensive autre que Bec-Canon, Éructation, Babil, Riposte, Implore, Mitra-Poing, Moi d’Abord, Fulmifer, Voile Miroir, Carapiège, Lutte, Larcin ou une capacité Z. Échoue si la cible agit avant l'utilisateur. Ignore le clone de la cible pour la copie de la capacité.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur utilise contre la cible, si possible, la capacité que celle-ci a choisie ce tour, avec sa puissance multipliée par 1,5. La capacité doit être une capacité offensive autre que Éructation, Babil, Riposte, Implore, Mitra-Poing, Moi d’Abord, Fulmifer, Voile Miroir, Lutte ou Larcin. Échoue si la cible agit avant l'utilisateur. Ignore le clone de la cible pour la copie de la capacité.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur utilise contre la cible, si possible, la capacité que celle-ci a choisie ce tour, avec sa puissance multipliée par 1,5. La capacité doit être une capacité offensive autre que Babil, Riposte, Implore, Mitra-Poing, Moi d’Abord, Fulmifer, Voile Miroir, Lutte ou Larcin. Échoue si la cible agit avant l'utilisateur. Ignore le clone de la cible pour la copie de la capacité.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur utilise contre la cible, si possible, la capacité que celle-ci a choisie ce tour, avec sa puissance multipliée par 1,5. La capacité doit être une capacité offensive autre que Babil, Riposte, Implore, Mitra-Poing, Moi d’Abord, Voile Miroir, Lutte ou Larcin. Échoue si la cible agit avant l'utilisateur. Ignore le clone de la cible pour la copie de la capacité.", // NEEDS QC
		},
	},
	megadrain: {
		name: "Méga-Sangsue",
		// Official flavor text: "Une attaque qui convertit la moitié des dégâts infligés en PV pour le lanceur."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	megahorn: {
		name: "Mégacorne",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	megakick: {
		name: "Ultimawashi",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	megapunch: {
		name: "Ultimapoing",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	memento: {
		name: "Souvenir",
		// Official flavor text: "Le lanceur est mis K.O., mais l’Attaque et l’Attaque Spéciale de l’ennemi baissent beaucoup."
		desc: "Baisse l'Attaque et l'Attaque Spéciale de la cible de 2 niveaux. L'utilisateur est mis K.O., sauf si cette capacité rate ou s'il n'y a pas de cible. Échoue entièrement si cette capacité touche un clone, mais n'échoue pas si les statistiques de la cible ne peuvent pas être changées.", // NEEDS QC
		shortDesc: "-2 Atq et Atq. Spé de la cible. Le lanceur est K.O.", // NEEDS QC
		gen4: {
			desc: "Baisse l'Attaque et l'Attaque Spéciale de la cible de 2 niveaux. L'utilisateur est mis K.O., même si cette capacité rate. Cette capacité peut toucher une cible au milieu d'une capacité en deux tours. Échoue entièrement s'il n'y a pas de cible, mais n'échoue pas si les statistiques de la cible ne peuvent pas être changées.", // NEEDS QC
		},
		gen3: {
			desc: "Baisse l'Attaque et l'Attaque Spéciale de la cible de 2 niveaux. L'utilisateur est mis K.O. Cette capacité ne vérifie pas la précision et peut toucher une cible au milieu d'une capacité en deux tours. Échoue entièrement si les niveaux d'Attaque et d'Attaque Spéciale de la cible sont tous deux à -6.", // NEEDS QC
		},

		heal: "  {POKEMON} utilise la Force Z pour se soigner !",
	},
	menacingmoonrazemaelstrom: {
		name: "Rayons Séléno-Explosifs",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Ignore les talents des autres Pokémon.", // NEEDS QC
	},
	metalburst: {
		name: "Fulmifer",
		// Official flavor text: "Le lanceur attaque le dernier ennemi l’ayant blessé durant le même tour en frappant plus fort."
		desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ou spéciale ce tour des dégâts égaux à 1,5 fois les PV que l'utilisateur a perdus lors de cette attaque, arrondi à l'inférieur. Si l'utilisateur n'a pas perdu de PV lors de cette attaque, cette capacité inflige 1 PV de dégâts. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique ou spéciale d'un Pokémon adverse ce tour.", // NEEDS QC
		shortDesc: "S'il est touché, renvoie 1,5x les dégâts.", // NEEDS QC
		gen6: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ou spéciale ce tour des dégâts égaux à 1,5 fois les PV que l'utilisateur a perdus lors de cette attaque, arrondi à l'inférieur. Si l'utilisateur n'a pas perdu de PV lors de cette attaque, cette capacité inflige à la place des dégâts avec une puissance de 1. Si la position de ce Pokémon adverse n'est plus occupée, les dégâts sont infligés à un Pokémon adverse à portée choisi au hasard. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique ou spéciale d'un Pokémon adverse ce tour.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque physique ou spéciale ce tour des dégâts égaux à 1,5 fois les PV que l'utilisateur a perdus lors de cette attaque, arrondi à l'inférieur. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque physique ou spéciale d'un Pokémon adverse ce tour, ou s'il n'a pas perdu de PV lors de cette attaque.", // NEEDS QC
		},
	},
	metalclaw: {
		name: "Griffe Acier",
		// Official flavor text: "Attaque avec des griffes d’acier. Peut aussi augmenter l’Attaque du lanceur."
		desc: "A 10 % de chances de monter l'Attaque de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "10 % de monter l'Attaque du lanceur d'un niveau.", // NEEDS QC
	},
	metalsound: {
		name: "Strido-Son",
		// Official flavor text: "Un cri horrible tel un crissement métallique qui réduit beaucoup la Défense Spéciale de l’ennemi."
		desc: "Baisse la Défense Spéciale de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse la Déf. Spé de la cible de 2 niveaux.", // NEEDS QC
	},
	meteorassault: {
		name: "Joute Astrale",
		// Official flavor text: "Le lanceur attaque son adversaire avec son poireau. Toutefois, cette action le fait vaciller et il doit se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	meteorbeam: {
		name: "Laser Météore",
		// Official flavor text: "Le lanceur concentre l’énergie cosmique au premier tour, ce qui augmente son Attaque Spéciale, et frappe au second."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. Monte l'Attaque Spéciale de l'utilisateur d'un niveau au premier tour. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "+1 Atq. Spé au tour 1, frappe au tour 2.", // NEEDS QC

		prepare: "La puissance du cosmos afflue dans le corps {POKEMON:de} !",
	},
	meteormash: {
		name: "Poing Météore",
		// Official flavor text: "Un coup de poing lancé à la vitesse d’un météore. Peut aussi augmenter l’Attaque du lanceur."
		desc: "A 20 % de chances de monter l'Attaque de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "20 % de monter l'Attaque du lanceur d'un niveau.", // NEEDS QC
	},
	metronome: {
		name: "Métronome",
		// Official flavor text: "Le lanceur agite un doigt et stimule son cerveau pour utiliser presque n’importe quelle capacité au hasard."
		desc: "Utilise une capacité choisie au hasard, autre que Après Vous, Acide Malique, Canon Blindé, Assistance, Éclat Spectral, Roue Libre, Blockhaus, Bec-Canon, Aegis Maxima, Gladius Maximus, Éructation, Passe-Cadeau, Crash Brûlant, Big Splash, Tapotige, Abattage, Célébration, Babil, Douche Froide, Neigeux de Mots, Dracacophonie, Nitro Crash, Crash Musclé, Vindicte, Photocopie, Riposte, Implore, Vigilance, Nappage, Lien du Destin, Détection, Orage Adamantin, Décalquage, Écrous d’Poing, Double Décharge, Draco-Ascension, Draco-Énergie, Tambour Battant, Canon Dynamax, Turbo Volt, Ténacité, Laser Infinimax, Fourbette, Ruse, Fureur Ardente, Décharnement, Canon Floral, Mitra-Poing, Par Ici, Éclair Gelé, Regard Glaçant, Lance de Glace, Force G, Coup d’Main, Mains Jointes, Hyperceuse, Furie Dimension, TrouDimensionnel, Feu Glacé, Sommation, Poing Sonique, Selve Salvatrice, Bouclier Royal, Fontaine de Vie, Lumière du Néant, Crash Magique, Ruée d'Or, Tatamigaeshi, Moi d’Abord, Joute Astrale, Métronome, Copie, Caboche-Kaboum, Voile Miroir, Mimique, Rayon Spectral, Force Nature, Ire de la Nature, Crash Toxique, Blocage, Plat du Jour, Onde Originelle, Overdrive, Photo-Geyser, Plasma Punch, Prolifération, Bond, Échange Force, Lame Pangéenne, Abri, Ballon Brûlant, À la Queue, Prévention, Poing de Colère, Poudre Fureur, Taurogne, Grand Courroux, Chant Antique, Second Souffle, Cataclysme, Salaison, Lame Ointe, Queulonage, Carapiège, Piège de Fil, Gribouille, Blabla Dodo, Troquenard, Aboiement, Saisie, Ronflement, Neige, Clepto-Mânes, Habanerage, Pico-Défense, Choc Émotionnel, Projecteur, Typhon Passionné, Jet de Vapeur, Métalaser, Vapeur Féérique, Lutte, Choc Météore, Torrent de Coups, Passe-Passe, Techno-Buster, Pluie Térastrale, Larcin, Myria-Flèches, Myria-Vagues, Voltageôle, Coup Fulgurant, Grand Nettoyage, Désherbaffe, Morphing, Tour de Magie, Double Laser, Coup Victoire, Poing Obscur, Crash Obscur ou Garde Large.", // NEEDS QC
		shortDesc: "Utilise une capacité au hasard.", // NEEDS QC
		gen8: {
			desc: "Utilise une capacité choisie au hasard, autre que Après Vous, Acide Malique, Assistance, Éclat Spectral, Roue Libre, Blockhaus, Bec-Canon, Aegis Maxima, Gladius Maximus, Éructation, Passe-Cadeau, Big Splash, Tapotige, Abattage, Célébration, Babil, Dracacophonie, Photocopie, Riposte, Implore, Vigilance, Nappage, Lien du Destin, Détection, Orage Adamantin, Écrous d’Poing, Draco-Ascension, Draco-Énergie, Draco-Marteau, Tambour Battant, Canon Dynamax, Ténacité, Laser Infinimax, Fourbette, Ruse, Fureur Ardente, Canon Floral, Mitra-Poing, Par Ici, Éclair Gelé, Regard Glaçant, Lance de Glace, Force G, Coup d’Main, Mains Jointes, Furie Dimension, TrouDimensionnel, Feu Glacé, Sommation, Selve Salvatrice, Bouclier Royal, Fontaine de Vie, Lumière du Néant, Tatamigaeshi, Moi d’Abord, Joute Astrale, Métronome, Copie, Caboche-Kaboum, Voile Miroir, Mimique, Rayon Spectral, Force Nature, Ire de la Nature, Blocage, Onde Originelle, Overdrive, Photo-Geyser, Plasma Punch, Lame Pangéenne, Abri, Ballon Brûlant, À la Queue, Prévention, Poudre Fureur, Chant Antique, Lame Ointe, Carapiège, Gribouille, Blabla Dodo, Troquenard, Aboiement, Saisie, Ronflement, Clepto-Mânes, Pico-Défense, Choc Émotionnel, Projecteur, Jet de Vapeur, Métalaser, Vapeur Féérique, Lutte, Choc Météore, Torrent de Coups, Passe-Passe, Techno-Buster, Larcin, Myria-Flèches, Myria-Vagues, Voltageôle, Coup Fulgurant, Morphing, Tour de Magie, Coup Victoire, Poing Obscur ou Garde Large.", // NEEDS QC
		},
		gen7: {
			desc: "Utilise une capacité choisie au hasard, autre que Après Vous, Assistance, Blockhaus, Bec-Canon, Éructation, Passe-Cadeau, Célébration, Babil, Photocopie, Riposte, Implore, Vigilance, Lien du Destin, Détection, Orage Adamantin, Draco-Ascension, Ténacité, Ruse, Canon Floral, Mitra-Poing, Par Ici, Éclair Gelé, Coup d’Main, Mains Jointes, Furie Dimension, TrouDimensionnel, Feu Glacé, Sommation, Bouclier Royal, Lumière du Néant, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Caboche-Kaboum, Voile Miroir, Mimique, Force Nature, Onde Originelle, Photo-Geyser, Plasma Punch, Lame Pangéenne, Abri, À la Queue, Prévention, Poudre Fureur, Chant Antique, Lame Ointe, Carapiège, Gribouille, Blabla Dodo, Aboiement, Saisie, Ronflement, Clepto-Mânes, Pico-Défense, Projecteur, Jet de Vapeur, Lutte, Passe-Passe, Techno-Buster, Larcin, Myria-Flèches, Myria-Vagues, Morphing, Tour de Magie, Coup Victoire ou Garde Large.", // NEEDS QC
		},
		gen6: {
			desc: "Utilise une capacité choisie au hasard, autre que Après Vous, Assistance, Éructation, Passe-Cadeau, Célébration, Babil, Photocopie, Riposte, Implore, Vigilance, Lien du Destin, Détection, Orage Adamantin, Draco-Ascension, Ténacité, Ruse, Mitra-Poing, Par Ici, Éclair Gelé, Coup d’Main, Mains Jointes, Furie Dimension, TrouDimensionnel, Feu Glacé, Bouclier Royal, Lumière du Néant, Tatamigaeshi, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Onde Originelle, Lame Pangéenne, Abri, À la Queue, Prévention, Poudre Fureur, Chant Antique, Lame Ointe, Gribouille, Blabla Dodo, Aboiement, Saisie, Ronflement, Pico-Défense, Jet de Vapeur, Lutte, Passe-Passe, Techno-Buster, Larcin, Myria-Flèches, Myria-Vagues, Morphing, Tour de Magie, Coup Victoire ou Garde Large.", // NEEDS QC
		},
		gen5: {
			desc: "Utilise une capacité choisie au hasard, autre que Après Vous, Assistance, Passe-Cadeau, Babil, Photocopie, Riposte, Implore, Lien du Destin, Détection, Ténacité, Ruse, Mitra-Poing, Par Ici, Éclair Gelé, Coup d’Main, Feu Glacé, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Force Nature, Abri, À la Queue, Prévention, Poudre Fureur, Chant Antique, Lame Ointe, Gribouille, Blabla Dodo, Aboiement, Saisie, Ronflement, Lutte, Passe-Passe, Techno-Buster, Larcin, Morphing, Tour de Magie, Coup Victoire ou Garde Large.", // NEEDS QC
		},
		gen4: {
			desc: "Utilise une capacité choisie au hasard, autre que Assistance, Babil, Photocopie, Riposte, Implore, Lien du Destin, Détection, Ténacité, Ruse, Mitra-Poing, Par Ici, Coup d’Main, Moi d’Abord, Métronome, Copie, Voile Miroir, Mimique, Abri, Gribouille, Blabla Dodo, Saisie, Lutte, Passe-Passe, Larcin, Tour de Magie ou une capacité que l'utilisateur connaît déjà.", // NEEDS QC
		},
		gen3: {
			desc: "Utilise une capacité choisie au hasard, autre que Riposte, Implore, Lien du Destin, Détection, Ténacité, Mitra-Poing, Par Ici, Coup d’Main, Métronome, Copie, Voile Miroir, Abri, Gribouille, Blabla Dodo, Saisie, Lutte, Larcin ou Tour de Magie.", // NEEDS QC
		},
		gen2: {
			desc: "Utilise une capacité choisie au hasard, autre que Riposte, Lien du Destin, Détection, Ténacité, Métronome, Copie, Voile Miroir, Abri, Gribouille, Blabla Dodo, Lutte, Larcin ou une capacité que l'utilisateur connaît déjà.", // NEEDS QC
		},
		gen1: {
			desc: "Utilise une capacité choisie au hasard, autre que Métronome ou Lutte.", // NEEDS QC
		},

		move: "Grâce à Métronome, le Pokémon lance la capacité {MOVE} !",
	},
	mightycleave: {
		name: "Lame Puissante",
		shortDesc: "Passe outre les protections sans les briser.", // NEEDS QC
	},
	milkdrink: {
		name: "Lait à Boire",
		// Official flavor text: "Le lanceur récupère jusqu’à la moitié de ses PV max."
		desc: "L'utilisateur récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	mimic: {
		name: "Copie",
		// Official flavor text: "Le lanceur copie la dernière capacité utilisée par la cible et la conserve tant qu’il reste au combat."
		desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par la dernière capacité utilisée par la cible. La capacité copiée a son maximum de PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, s'il connaît déjà la capacité, ou si la capacité est Assistance, Aegis Maxima, Gladius Maximus, Éructation, Crash Brûlant, Célébration, Babil, Crash Musclé, Photocopie, Canon Dynamax, Mains Jointes, Crash Magique, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Crash Toxique, Gribouille, Blabla Dodo, Lutte, Pluie Térastrale, Morphing ou Crash Obscur.", // NEEDS QC
		shortDesc: "Copie la dernière capacité de la cible.", // NEEDS QC
		gen8: {
			desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par la dernière capacité utilisée par la cible. La capacité copiée a son maximum de PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, s'il connaît déjà la capacité, ou si la capacité est Aegis Maxima, Gladius Maximus, Babil, Canon Dynamax, Copie, Gribouille, Lutte, Morphing ou une capacité Dynamax ou Gigamax.", // NEEDS QC
		},
		gen7: {
			desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par la dernière capacité utilisée par la cible. La capacité copiée a son maximum de PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, s'il connaît déjà la capacité, ou si la capacité est Babil, Copie, Gribouille, Lutte, Morphing ou une capacité Z.", // NEEDS QC
		},
		gen6: {
			desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par la dernière capacité utilisée par la cible. La capacité copiée a son maximum de PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, s'il connaît déjà la capacité, ou si la capacité est Babil, Copie, Gribouille, Lutte ou Morphing.", // NEEDS QC
		},
		gen4: {
			desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par la dernière capacité utilisée par la cible. La capacité copiée a 5 PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, s'il connaît déjà la capacité, ou si la capacité est Babil, Métronome, Copie, Gribouille ou Lutte.", // NEEDS QC
		},
		gen3: {
			desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par la dernière capacité utilisée par la cible. La capacité copiée a 5 PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, s'il connaît déjà la capacité, ou si la capacité est Métronome, Copie, Gribouille ou Lutte.", // NEEDS QC
		},
		gen2: {
			desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par la dernière capacité utilisée par la cible. La capacité copiée a 5 PP. Échoue si la cible n'a pas encore agi, si l'utilisateur connaît déjà la capacité, ou si la capacité est Lutte.", // NEEDS QC
		},
		gen1: {
			desc: "Tant que l'utilisateur reste au combat, cette capacité est remplacée par une capacité connue de la cible choisie au hasard, même si l'utilisateur la connaît déjà. La capacité copiée conserve les PP restants de cette capacité, quel que soit son maximum de PP. Chaque fois qu'un PP de la capacité copiée est utilisé, un PP de cette capacité est aussi utilisé.", // NEEDS QC
			shortDesc: "Remplacée par une capacité de la cible au hasard.", // NEEDS QC
		},

		start: "  {POKEMON} apprend {MOVE} !",
	},
	mindblown: {
		name: "Caboche-Kaboum",
		// Official flavor text: "Le lanceur fait exploser sa tête pour attaquer toutes les cibles autour de lui. Il subit aussi des dégâts."
		desc: "Que cette capacité réussisse ou non, et même si cela le met K.O., l'utilisateur perd la moitié de ses PV max, arrondi au supérieur, sauf s'il a le talent Garde Magik. Cette capacité ne s'exécute pas et l'utilisateur ne perd pas de PV si un Pokémon actif a le talent Moiteur, ou si cette capacité est de type Feu et que l'utilisateur est sous l'effet de Nuée de Poudre ou que la météo est Pluie battante.", // NEEDS QC
		shortDesc: "Perd la moitié de ses PV max. Touche les adjacents.", // NEEDS QC

		damage: "  ({POKEMON} sacrifie des PV pour renforcer sa capacité !)", // NEEDS QC
	},
	mindreader: {
		name: "Lire-Esprit",
		// Official flavor text: "Le lanceur analyse les mouvements de l’ennemi pour être sûr de toucher au coup suivant."
		desc: "Jusqu'à la fin du tour suivant, la cible ne peut pas éviter les capacités de l'utilisateur, même si elle est au milieu d'une capacité en deux tours. L'effet prend fin si l'utilisateur ou la cible quitte le terrain. Échoue si cet effet est déjà actif pour l'utilisateur.", // NEEDS QC
		shortDesc: "Sa prochaine capacité ne ratera pas la cible.", // NEEDS QC
		gen4: {
			desc: "Jusqu'à la fin du tour suivant, la cible ne peut pas éviter les capacités de l'utilisateur, même au milieu d'une capacité en deux tours. Quand cet effet démarre contre la cible, cet effet et celui de Verrouillage prennent fin pour tous les autres Pokémon contre cette cible. Si la cible quitte le terrain avec Relais, son remplaçant reste sous cet effet. Si l'utilisateur quitte le terrain avec Relais, l'effet redémarre contre la même cible pour son remplaçant. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		},
		gen2: {
			desc: "Le prochain test de précision contre la cible réussit. La cible évite tout de même Séisme, Abîme et Ampleur si elle utilise Vol. Si la cible quitte le terrain avec Relais, son remplaçant reste sous cet effet. Cet effet prend fin quand la cible quitte le terrain ou qu'un test de précision est effectué contre elle.", // NEEDS QC
			shortDesc: "La prochaine capacité ne ratera pas la cible.", // NEEDS QC
		},

		start: "#lockon",
	},
	minimize: {
		name: "Lilliput",
		// Official flavor text: "Le lanceur comprime son corps pour se faire tout petit et beaucoup augmenter son Esquive."
		desc: "Monte l'esquive de l'utilisateur de 2 niveaux. Que l'esquive ait changé ou non, Plaquage, Draco-Charge, Flying Press, Tacle Feu, Tacle Lourd, Dark Body Press, Bulldoboule, Écrasement et Volt Assaut ne vérifient pas la précision et ont leurs dégâts doublés contre l'utilisateur tant qu'il reste au combat.", // NEEDS QC
		shortDesc: "Monte l'esquive du lanceur de 2 niveaux.", // NEEDS QC
		gen8: {
			desc: "Monte l'esquive de l'utilisateur de 2 niveaux. Que l'esquive ait changé ou non, Plaquage, Draco-Charge, Flying Press, Tacle Feu, Tacle Lourd, Dark Body Press, Bulldoboule et Écrasement ne vérifient pas la précision et ont leurs dégâts doublés contre l'utilisateur tant qu'il reste au combat.", // NEEDS QC
		},
		gen6: {
			desc: "Monte l'esquive de l'utilisateur de 2 niveaux. Que l'esquive ait changé ou non, Plaquage, Draco-Charge, Flying Press, Tacle Feu, Hantise, Revenant, Bulldoboule et Écrasement ne vérifient pas la précision et ont leurs dégâts doublés contre l'utilisateur tant qu'il reste au combat.", // NEEDS QC
		},
		gen5: {
			desc: "Monte l'esquive de l'utilisateur de 2 niveaux. Que l'esquive ait changé ou non, Écrasement et Bulldoboule ont leurs dégâts doublés contre l'utilisateur tant qu'il reste au combat.", // NEEDS QC
		},
		gen4: {
			desc: "Monte l'esquive de l'utilisateur d'un niveau. Que l'esquive ait changé ou non, Écrasement a sa puissance doublée contre l'utilisateur tant qu'il reste au combat.", // NEEDS QC
			shortDesc: "Monte l'esquive du lanceur d'un niveau.", // NEEDS QC
		},
		gen3: {
			desc: "Monte l'esquive de l'utilisateur d'un niveau. Que l'esquive ait changé ou non, Étonnement, Extrasenseur, Poing Dard et Écrasement ont leurs dégâts doublés contre l'utilisateur tant qu'il reste au combat.", // NEEDS QC
		},
		gen2: {
			desc: "Monte l'esquive de l'utilisateur d'un niveau. Que l'esquive ait changé ou non, Écrasement a sa puissance doublée contre l'utilisateur tant qu'il reste au combat. Relais peut transmettre cet effet à un allié.", // NEEDS QC
		},
		gen1: {
			desc: "Monte l'esquive de l'utilisateur d'un niveau.", // NEEDS QC
		},
	},
	miracleeye: {
		name: "Œil Miracle",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Tant que la cible reste au combat, son niveau d'esquive est ignoré dans les calculs de précision contre elle s'il est supérieur à 0, et les attaques de type Psy peuvent la toucher si elle est de type Ténèbres. Échoue si la cible est déjà affectée par cet effet, par Clairvoyance ou par Flair.", // NEEDS QC
		shortDesc: "Psy touche Ténèbres. Ignore l'esquive.", // NEEDS QC
		gen4: {
			desc: "Tant que la cible reste au combat, son niveau d'esquive est ignoré dans les calculs de précision contre elle s'il est supérieur à 0, et les attaques de type Psy peuvent la toucher si elle est de type Ténèbres.", // NEEDS QC
		},

		start: "#foresight",
	},
	mirrorcoat: {
		name: "Voile Miroir",
		// Official flavor text: "Une riposte qui contre n’importe quelle capacité spéciale en infligeant le double des dégâts subis."
		desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque spéciale ce tour des dégâts égaux au double des PV que l'utilisateur a perdus lors de cette attaque. Si l'utilisateur n'a pas perdu de PV lors de cette attaque, cette capacité inflige 1 PV de dégâts. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque spéciale d'un Pokémon adverse ce tour.", // NEEDS QC
		shortDesc: "Renvoie le double des dégâts d'une attaque spéciale.", // NEEDS QC
		gen6: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque spéciale ce tour des dégâts égaux au double des PV que l'utilisateur a perdus lors de cette attaque. Si l'utilisateur n'a pas perdu de PV lors de cette attaque, cette capacité inflige à la place des dégâts avec une puissance de 1. Si la position de ce Pokémon adverse n'est plus occupée, les dégâts sont infligés à un Pokémon adverse à portée choisi au hasard. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque spéciale d'un Pokémon adverse ce tour.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque spéciale ce tour des dégâts égaux au double des PV que l'utilisateur a perdus lors de cette attaque. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque spéciale d'un Pokémon adverse ce tour, ou s'il n'a pas perdu de PV lors de cette attaque.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige au dernier Pokémon adverse ayant touché l'utilisateur avec une attaque spéciale ce tour des dégâts égaux au double des PV que l'utilisateur a perdus lors de cette attaque. Si la position de ce Pokémon adverse n'est plus occupée et qu'un autre Pokémon adverse est sur le terrain, les dégâts lui sont infligés à la place. Cette capacité considère Puissance Cachée comme étant de type Normal, et seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur n'a pas été touché par une attaque spéciale d'un Pokémon adverse ce tour, ou s'il n'a pas perdu de PV lors de cette attaque.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige au Pokémon adverse des dégâts égaux au double des PV que l'utilisateur a perdus à cause d'une attaque spéciale ce tour. Cette capacité considère Puissance Cachée comme étant de type Normal, et seul le dernier coup d'une capacité frappant plusieurs fois est compté. Échoue si l'utilisateur agit en premier, s'il n'a pas été touché par une attaque spéciale ce tour, ou s'il n'a pas perdu de PV lors de cette attaque.", // NEEDS QC
		},
	},
	mirrormove: {
		name: "Mimique",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "L'utilisateur utilise la dernière capacité utilisée par la cible, contre elle si possible. Échoue si la cible n'a pas encore agi, ou si sa dernière capacité ne peut pas être copiée par cette capacité.", // NEEDS QC
		shortDesc: "Utilise la dernière capacité de la cible contre elle.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur utilise la dernière capacité l'ayant pris pour cible avec succès. La capacité copiée est utilisée sans cible précise. Échoue si aucune capacité n'a pris l'utilisateur pour cible, si la capacité a été appelée par une autre capacité, si la capacité est Encore, ou si la capacité ne peut pas être copiée par cette capacité.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur utilise la dernière capacité l'ayant pris pour cible avec succès. La capacité copiée est utilisée sans cible précise. Échoue si aucune capacité n'a pris l'utilisateur pour cible, si la capacité a raté, échoué ou n'a eu aucun effet sur l'utilisateur, ou si la capacité ne peut pas être copiée par cette capacité.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur utilise la dernière capacité utilisée par la cible. Échoue si la cible n'a pas utilisé de capacité depuis l'entrée de l'utilisateur, ou si la dernière capacité utilisée est Métronome, Copie, Mimique, Gribouille, Blabla Dodo ou Morphing ou une capacité que l'utilisateur connaît.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur utilise la dernière capacité utilisée par la cible. Échoue si la cible n'a pas utilisé de capacité depuis l'entrée de l'utilisateur, ou si la dernière capacité utilisée est Mimique.", // NEEDS QC
		},
	},
	mirrorshot: {
		name: "Miroi-Tir",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances de baisser la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "30 % de baisser la précision de la cible d'un niveau.", // NEEDS QC
	},
	mist: {
		name: "Brume",
		// Official flavor text: "Une brume blanche enveloppe l’équipe du lanceur et empêche la réduction des stats pour cinq tours."
		desc: "Pendant 5 tours, l'utilisateur et son équipe ne peuvent pas voir leurs niveaux de statistiques baissés par d'autres Pokémon. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "5 tours : l'équipe ne subit pas de baisses de stats.", // NEEDS QC
		gen2: {
			desc: "Tant que l'utilisateur reste au combat, ses niveaux de statistiques ne peuvent pas être baissés par d'autres Pokémon. Échoue si l'utilisateur a déjà cet effet. Relais peut transmettre cet effet à un allié.", // NEEDS QC
			shortDesc: "Tant qu'actif, ses stats ne peuvent pas baisser.", // NEEDS QC
			start: "  {POKEMON} s'entoure d'une BRUME!",
			block: "  {POKEMON} est protégé par la BRUME!",
		},
		gen1: {
			desc: "Tant que l'utilisateur reste au combat, ses niveaux de statistiques ne peuvent pas être baissés par d'autres Pokémon, sauf par l'effet secondaire d'une capacité. Échoue si l'utilisateur a déjà cet effet. Si un Pokémon utilise Buée Noire, cet effet prend fin.", // NEEDS QC
			start: "  {POKEMON} s'entoure d'une BRUME!",
			block: "  Mais cela échoue !",
		},

		start: "  La brume enveloppe {TEAM} !",
		end: "  La brume autour de {TEAM} s’est dissipée !",
		block: "  {POKEMON} est protégé par la brume !",
	},
	mistball: {
		name: "Ball’Brume",
		// Official flavor text: "Une bulle de brume inflige des dégâts à l’ennemi. Peut aussi réduire son Attaque Spéciale."
		desc: "A 50 % de chances de baisser l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
	},
	mistyexplosion: {
		name: "Explo-Brume",
		// Official flavor text: "Le lanceur frappe tous les Pokémon autour de lui en explosant, ce qui le met K.O. La puissance de cette attaque augmente si un Champ Brumeux est actif."
		desc: "Si le terrain actuel est un Champ Brumeux et que l'utilisateur est au sol, la puissance de cette capacité est multipliée par 1,5. L'utilisateur est mis K.O. après avoir utilisé cette capacité, même si elle échoue faute de cible. Cette capacité ne peut pas s'exécuter si un Pokémon actif a le talent Moiteur.", // NEEDS QC
		shortDesc: "Mis K.O. Sur champ brumeux : puissance x1,5.", // NEEDS QC
	},
	mistyterrain: {
		name: "Champ Brumeux",
		// Official flavor text: "Pendant cinq tours, les Pokémon au sol ne peuvent pas subir d’altération de statut et la puissance des capacités de type Dragon est divisée par deux."
		desc: "Pendant 5 tours, le terrain devient un Champ Brumeux. Pendant l'effet, la puissance des attaques de type Dragon contre les Pokémon au sol est multipliée par 0,5, et les Pokémon au sol ne peuvent subir ni problème de statut ni confusion. Les Pokémon au sol peuvent être affectés par Bâillement mais ne peuvent pas s'endormir à cause de son effet. Camouflage transforme l'utilisateur en type Fée, Force Nature devient Pouvoir Lunaire et Force Cachée a 30 % de chances de baisser l'Attaque Spéciale d'un niveau. Échoue si le terrain actuel est déjà un Champ Brumeux.", // NEEDS QC
		shortDesc: "5 tours : pas de statut ; Dragon affaibli au sol.", // NEEDS QC
		gen6: {
			desc: "Pendant 5 tours, le terrain devient un Champ Brumeux. Pendant l'effet, la puissance des attaques de type Dragon contre les Pokémon au sol est multipliée par 0,5, et les Pokémon au sol ne peuvent pas subir de problème de statut. Les Pokémon au sol peuvent être affectés par Bâillement mais ne peuvent pas s'endormir à cause de son effet. Camouflage transforme l'utilisateur en type Fée, Force Nature devient Pouvoir Lunaire et Force Cachée a 30 % de chances de baisser l'Attaque Spéciale d'un niveau. Échoue si le terrain actuel est déjà un Champ Brumeux.", // NEEDS QC
		},
	},
	moonblast: {
		name: "Pouvoir Lunaire",
		// Official flavor text: "Attaque l’ennemi grâce au pouvoir de la lune. Peut diminuer son Attaque Spéciale."
		desc: "A 30 % de chances de baisser l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "30 % de baisser l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	moongeistbeam: {
		name: "Rayon Spectral",
		// Official flavor text: "Le lanceur attaque avec un rayon de lumière mystérieux. Ignore le talent de la cible."
		desc: "Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Ignore les talents des autres Pokémon.", // NEEDS QC
	},
	moonlight: {
		name: "Rayon Lune",
		// Official flavor text: "Un soin qui restaure des PV au lanceur. Son efficacité varie en fonction de la météo."
		desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif, s'il n'y a aucune météo ou s'il tient un Parapluie Solide ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Pluie battante, Pluie, la tempête de sable ou la neige, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Soigne le lanceur selon la météo.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif, s'il n'y a aucune météo ou s'il tient un Parapluie Solide ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif ou s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; tous ses PV si la météo est Soleil ; et 1/4 de ses PV max si la météo est Pluie ou Tempête de Sable, le tout arrondi à l'inférieur.", // NEEDS QC
		},
	},
	morningsun: {
		name: "Aurore",
		// Official flavor text: "Un soin qui restaure des PV au lanceur. Son efficacité varie en fonction de la météo."
		desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif, s'il n'y a aucune météo ou s'il tient un Parapluie Solide ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Pluie battante, Pluie, la tempête de sable ou la neige, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Soigne le lanceur selon la météo.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif, s'il n'y a aucune météo ou s'il tient un Parapluie Solide ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif ou s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; tous ses PV si la météo est Soleil ; et 1/4 de ses PV max si la météo est Pluie ou Tempête de Sable, le tout arrondi à l'inférieur.", // NEEDS QC
		},
	},
	mortalspin: {
		name: "Toupie Éclat",
		// Official flavor text: "Le lanceur attaque en tournant sur lui-même et empoisonne la cible. Il se libère également des effets de capacités comme Étreinte, Ligotage ou Vampigraine."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., les effets de Vampigraine et des capacités de piégeage prennent fin pour l'utilisateur, et tous les pièges sont retirés de son côté du terrain. A 100 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "Empoisonne, se libère des pièges et drains.", // NEEDS QC
	},
	mountaingale: {
		name: "Bise Glaciaire",
		// Official flavor text: "Le lanceur envoie un bloc de glace de la taille d'un iceberg sur la cible, ce qui peut aussi l'apeurer."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	mudbomb: {
		name: "Boue-Bombe",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances de baisser la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "30 % de baisser la précision de la cible d'un niveau.", // NEEDS QC
	},
	muddywater: {
		name: "Ocroupi",
		// Official flavor text: "Le lanceur attaque en projetant de l’eau boueuse. Peut aussi réduire la Précision de l’ennemi."
		desc: "A 30 % de chances de baisser la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "30 % de baisser la précision des ennemis d'un niveau.", // NEEDS QC
	},
	mudshot: {
		name: "Tir de Boue",
		// Official flavor text: "Le lanceur attaque en projetant de la boue sur l’ennemi. Réduit aussi la Vitesse de la cible."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
	},
	mudslap: {
		name: "Coud’Boue",
		// Official flavor text: "Le lanceur envoie de la boue au visage de l’ennemi pour infliger des dégâts et baisser sa Précision."
		desc: "A 100 % de chances de baisser la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la précision de la cible d'un niveau.", // NEEDS QC
	},
	mudsport: {
		name: "Lance-Boue",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Pendant 5 tours, toutes les attaques de type Électrik des Pokémon actifs ont leur puissance multipliée par 0,33. Échoue si cet effet est déjà actif.", // NEEDS QC
		shortDesc: "5 tours : les attaques Électrik font 1/3 des dégâts.", // NEEDS QC
		gen5: {
			desc: "Tant que l'utilisateur est au combat, toutes les attaques de type Électrik des Pokémon actifs ont leur puissance multipliée par 0,33. Échoue si cet effet est déjà actif pour un Pokémon.", // NEEDS QC
			shortDesc: "Réduit les attaques Électrik à 1/3 de leur puissance.", // NEEDS QC
		},
		gen4: {
			desc: "Tant que l'utilisateur est au combat, toutes les attaques de type Électrik des Pokémon actifs ont leur puissance réduite de moitié. Échoue si cet effet est déjà actif pour l'utilisateur. Relais peut transmettre cet effet à un allié.", // NEEDS QC
			shortDesc: "Réduit les attaques Électrik à 1/2 de leur puissance.", // NEEDS QC
		},
	},
	multiattack: {
		name: "Coup Varia-Type",
		// Official flavor text: "Le Pokémon s’entoure d’une puissante énergie avant de foncer sur sa cible. Le type de la capacité dépend de la ROM installée."
		desc: "Le type de cette capacité dépend de la ROM tenue par l'utilisateur.", // NEEDS QC
		shortDesc: "Son type dépend de la ROM tenue.", // NEEDS QC
	},
	mysticalfire: {
		name: "Feu Ensorcelé",
		// Official flavor text: "Attaque avec des flammes brûlantes soufflées de la bouche du lanceur. Diminue l’Attaque Spéciale de l’ennemi."
		desc: "A 100 % de chances de baisser l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
	},
	mysticalpower: {
		name: "Force Mystique",
		// Official flavor text: "Le lanceur attaque en libérant un pouvoir mystique. Cela augmente également son Attaque Spéciale."
		desc: "A 100 % de chances de monter l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "100 % de monter l'Atq. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	nastyplot: {
		name: "Machination",
		// Official flavor text: "Stimule l’esprit par de mauvaises pensées. Augmente beaucoup l’Attaque Spéciale du lanceur."
		desc: "Monte l'Attaque Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte l'Atq. Spé du lanceur de 2 niveaux.", // NEEDS QC
	},
	naturalgift: {
		name: "Don Naturel",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Le type et la puissance de cette capacité dépendent de la Baie tenue par l'utilisateur, et la Baie est perdue. Échoue si l'utilisateur ne tient pas de Baie, s'il a le talent Maladresse, ou si Embargo ou Zone Magique est en effet pour l'utilisateur.", // NEEDS QC
		shortDesc: "Puissance et type selon la Baie du lanceur.", // NEEDS QC
		gen4: {
			desc: "Le type et la puissance de cette capacité dépendent de la Baie tenue par l'utilisateur, et la Baie est perdue. Échoue si l'utilisateur ne tient pas de Baie, s'il a le talent Maladresse, ou si Embargo est en effet pour l'utilisateur.", // NEEDS QC
		},
	},
	naturepower: {
		name: "Force Nature",
		// Official flavor text: "Une attaque qui tire sa force de la nature. Son type varie selon le terrain."
		desc: "Cette capacité en appelle une autre selon le terrain du combat : Triplattaque sur le terrain standard, Tonnerre sur un Champ Électrifié, Pouvoir Lunaire sur un Champ Brumeux, Éco-Sphère sur un Champ Herbu et Psyko sur un Champ Psychique.", // NEEDS QC
		shortDesc: "Capacité selon le terrain (Triplattaque par défaut).", // NEEDS QC
		gen6: {
			desc: "Cette capacité en appelle une autre selon le terrain du combat : Triplattaque sur le terrain Wi-Fi standard, Tonnerre sur un Champ Électrifié, Pouvoir Lunaire sur un Champ Brumeux et Éco-Sphère sur un Champ Herbu.", // NEEDS QC
		},
		gen5: {
			desc: "Cette capacité en appelle une autre selon le terrain du combat : Séisme sur le terrain Wi-Fi standard.", // NEEDS QC
			shortDesc: "Attaque selon le terrain. (Séisme)", // NEEDS QC
		},
		gen4: {
			desc: "Cette capacité en appelle une autre selon le terrain du combat : Triplattaque dans les combats Wi-Fi.", // NEEDS QC
			shortDesc: "Attaque selon le terrain. (Triplattaque)", // NEEDS QC
		},
		gen3: {
			desc: "Cette capacité en appelle une autre selon le terrain du combat : Météores dans les combats Wi-Fi.", // NEEDS QC
			shortDesc: "Attaque selon le terrain. (Météores)", // NEEDS QC
		},

		move: "La capacité Force Nature se transforme en {MOVE} !",
	},
	naturesmadness: {
		name: "Ire de la Nature",
		// Official flavor text: "Le lanceur déchaîne toute la colère de la nature pour baisser les PV de la cible de moitié."
		desc: "Inflige à la cible des dégâts égaux à la moitié de ses PV actuels, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Inflige la moitié des PV actuels de la cible.", // NEEDS QC
	},
	needlearm: {
		name: "Poing Dard",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		gen3: {
			desc: "A 30 % de chances d'apeurer la cible. Les dégâts sont doublés si la cible a utilisé Lilliput depuis qu'elle est au combat.", // NEEDS QC
		},
	},
	neverendingnightmare: {
		name: "Appel des Ombres Éternelles",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	nightdaze: {
		name: "Explonuit",
		// Official flavor text: "Le lanceur attaque l’ennemi avec une onde de choc ténébreuse. Peut aussi baisser sa Précision."
		desc: "A 40 % de chances de baisser la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "40 % de baisser la précision de la cible d'un niveau.", // NEEDS QC
	},
	nightmare: {
		name: "Cauchemar",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La cible perd 1/4 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour tant qu'elle dort. Cette capacité n'affecte la cible que si elle dort. L'effet prend fin quand la cible se réveille, même si elle se rendort le même tour.", // NEEDS QC
		shortDesc: "Une cible endormie perd 1/4 de ses PV max par tour.", // NEEDS QC

		start: "  {POKEMON} commence à cauchemarder !",
		damage: "  {POKEMON} est prisonnier d’un cauchemar !",
	},
	nightshade: {
		name: "Ombre Nocturne",
		// Official flavor text: "Le lanceur invoque un mirage. Inflige des dégâts équivalents au niveau du lanceur."
		desc: "Inflige à la cible des dégâts égaux au niveau de l'utilisateur.", // NEEDS QC
		shortDesc: "Inflige des dégâts égaux au niveau du lanceur.", // NEEDS QC
		gen1: {
			desc: "Inflige à la cible des dégâts égaux au niveau de l'utilisateur. Cette capacité ignore l'immunité de type.", // NEEDS QC
			shortDesc: "Dégâts = niveau. Touche les types Normal.", // NEEDS QC
		},
	},
	nightslash: {
		name: "Tranche-Nuit",
		// Official flavor text: "Le lanceur lacère l’ennemi à la première occasion. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	nobleroar: {
		name: "Râle Mâle",
		// Official flavor text: "Le lanceur pousse un rugissement qui intimide l’ennemi et diminue son Attaque et son Attaque Spéciale."
		desc: "Baisse l'Attaque et l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Attaque et l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
	},
	noretreat: {
		name: "Ultime Bastion",
		// Official flavor text: "Le lanceur voit toutes ses stats augmenter, mais en contrepartie, il ne peut plus fuir ou se retirer du combat."
		desc: "Monte l'Attaque, la Défense, l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur d'un niveau, mais il ne peut plus quitter le combat. L'utilisateur peut tout de même être remplacé s'il utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. Échoue si l'utilisateur est déjà piégé par cet effet.", // NEEDS QC
		shortDesc: "+1 à toutes ses stats, mais reste piégé.", // NEEDS QC

		start: "  {POKEMON} ne peut plus fuir à cause d’Ultime Bastion !",
	},
	noxioustorque: {
		name: "Crash Toxique",
		desc: "A 30 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "30 % d'empoisonner la cible.", // NEEDS QC
	},
	nuzzle: {
		name: "Frotte-Frimousse",
		// Official flavor text: "Le lanceur attaque en frottant ses bajoues chargées d’électricité. Paralyse l’ennemi."
		desc: "A 100 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "100 % de paralyser la cible.", // NEEDS QC
	},
	oblivionwing: {
		name: "Mort’Ailes",
		// Official flavor text: "Vole l’énergie de la cible. Rend au lanceur un nombre de PV supérieur ou égal à la moitié des dégâts infligés."
		desc: "L'utilisateur récupère 3/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère 3/4 des dégâts infligés.", // NEEDS QC
	},
	obstruct: {
		name: "Blocage",
		// Official flavor text: "Le lanceur se protège de toutes les attaques. Peut échouer si utilisée plusieurs fois de suite. Baisse beaucoup la Défense de l’assaillant s’il utilise une attaque directe."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe voient leur Défense baisser de 2 niveaux. Les capacités sans dégâts passent outre cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège des attaques. Contact : -2 Défense.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe voient leur Défense baisser de 2 niveaux. Les capacités sans dégâts passent outre cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
	},
	oceanicoperetta: {
		name: "Symphonie des Ondines",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	octazooka: {
		name: "Octazooka",
		// Official flavor text: "Le lanceur attaque en projetant de l’encre au visage de l’ennemi. Peut aussi baisser sa Précision."
		desc: "A 50 % de chances de baisser la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser la précision de la cible d'un niveau.", // NEEDS QC
	},
	octolock: {
		name: "Octoprise",
		// Official flavor text: "Le lanceur empêche l’adversaire de fuir. À chaque tour qui passe, cette capacité baisse la Défense et la Défense Spéciale de la cible."
		desc: "Empêche la cible de quitter le combat. À la fin de chaque tour pendant l'effet, la Défense et la Défense Spéciale de la cible baissent d'un niveau. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Piège la cible : -1 Déf et Déf. Spé chaque tour.", // NEEDS QC

		start: "  {POKEMON} ne peut plus fuir à cause d’Octoprise !",
	},
	odorsleuth: {
		name: "Flair",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Tant que la cible reste au combat, son niveau d'esquive est ignoré dans les calculs de précision contre elle s'il est supérieur à 0, et les attaques de type Normal et Combat peuvent la toucher si elle est de type Spectre. Échoue si la cible est déjà affectée par cet effet, par Clairvoyance ou par Œil Miracle.", // NEEDS QC
		shortDesc: "Combat et Normal touchent Spectre. Ignore esquive.", // NEEDS QC
		gen4: {
			desc: "Tant que la cible reste au combat, son niveau d'Esquive est ignoré lors des tests de précision contre elle s'il est supérieur à 0, et les attaques de type Normal et Combat peuvent la toucher même si elle est de type Spectre.", // NEEDS QC
		},
		gen3: {
			desc: "Tant que la cible reste au combat, son niveau d'Esquive est ignoré lors des tests de précision contre elle, et les attaques de type Normal et Combat peuvent la toucher même si elle est de type Spectre.", // NEEDS QC
		},
	},
	ominouswind: {
		name: "Vent Mauvais",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 10 % de chances de monter l'Attaque, la Défense, l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "10 % de monter toutes ses stats d'un niveau.", // NEEDS QC
	},
	orderup: {
		name: "Plat du Jour",
		// Official flavor text: "Le lanceur attaque avec grâce et élégance. Si le lanceur a un Nigirigon dans sa bouche, cette capacité augmente une des statistiques du lanceur selon la forme du Nigirigon."
		desc: "Si un Nigirigon allié a activé son talent Commandant, cette capacité monte d'un niveau l'Attaque de l'utilisateur si le Nigirigon est sous sa Forme Courbée, la Défense s'il est sous sa Forme Affalée, ou la Vitesse s'il est sous sa Forme Raide. L'effet se produit même si le Nigirigon qui l'a activé a été mis K.O. depuis.", // NEEDS QC
		shortDesc: "Selon le Nigirigon allié : +1 Atq, Déf ou Vit.", // NEEDS QC
	},
	originpulse: {
		name: "Onde Originelle",
		// Official flavor text: "D’innombrables rayons lumineux d’un bleu étincelant s’abattent sur la cible."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis adjacents.", // NEEDS QC
	},
	outrage: {
		name: "Colère",
		// Official flavor text: "Le lanceur enrage et attaque pendant deux ou trois tours avant de devenir confus."
		desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible au premier tour de l'effet ou au deuxième tour d'un effet de trois tours, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo et que l'utilisateur dort, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		shortDesc: "Dure 2-3 tours, puis le lanceur devient confus.", // NEEDS QC
		gen6: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse adjacent au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible au premier tour de l'effet ou au deuxième tour d'un effet de trois tours, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus à la fin du dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus à la fin du dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'endort, est gelé, ou si l'attaque échoue contre la cible, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen2: {
			desc: "Que cette capacité réussisse ou non, l'utilisateur reste bloqué dessus pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet, même s'il est déjà confus. Si l'utilisateur est empêché d'agir, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
	},
	overdrive: {
		name: "Overdrive",
		// Official flavor text: "Le lanceur gratte ses cordes de guitare ou de basse pour créer de violentes vibrations sonores qui blessent la cible."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis.", // NEEDS QC
	},
	overheat: {
		name: "Surchauffe",
		// Official flavor text: "Attaque l’ennemi à pleine puissance. Le contrecoup baisse beaucoup l’Attaque Spéciale du lanceur."
		desc: "Baisse l'Attaque Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Atq. Spé du lanceur de 2 niveaux.", // NEEDS QC
	},
	painsplit: {
		name: "Balance",
		// Official flavor text: "Le lanceur ajoute ses PV à ceux de sa cible et les répartit équitablement."
		desc: "Les PV de l'utilisateur et de la cible deviennent la moyenne de leurs PV actuels, arrondi à l'inférieur, sans dépasser les PV max de chacun.", // NEEDS QC
		shortDesc: "Partage les PV à égalité avec la cible.", // NEEDS QC

		activate: "  Le lanceur et sa cible partagent leurs PV !",
	},
	paleowave: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "A 20 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "20 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	paraboliccharge: {
		name: "Parabocharge",
		// Official flavor text: "Inflige des dégâts à tous les Pokémon autour du lanceur. Il récupère en PV la moitié des dégâts infligés."
		desc: "L'utilisateur récupère la moitié des PV perdus par la cible, arrondi au supérieur à partir de 0,5. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié des dégâts infligés.", // NEEDS QC
	},
	partingshot: {
		name: "Dernier Mot",
		// Official flavor text: "Menace l’ennemi dans une ultime tirade avant de changer de place avec un autre Pokémon. Réduit l’Attaque et l’Attaque Spéciale de l’ennemi."
		desc: "Baisse l'Attaque et l'Attaque Spéciale de la cible d'un niveau. Si cette capacité réussit, l'utilisateur quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat si les niveaux d'Attaque et d'Attaque Spéciale de la cible n'ont pas changé, ou s'il n'y a aucun autre membre d'équipe non K.O.", // NEEDS QC
		shortDesc: "-1 Atq et Atq. Spé de la cible. Le lanceur se retire.", // NEEDS QC
		gen6: {
			desc: "Baisse l'Attaque et l'Attaque Spéciale de la cible d'un niveau. Si cette capacité réussit, l'utilisateur quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O.", // NEEDS QC
		},

		heal: "#memento",
		switchOut: "#uturn",
	},
	payback: {
		name: "Représailles",
		// Official flavor text: "Le lanceur charge son énergie, puis attaque. La puissance est doublée si le lanceur agit après l’ennemi."
		desc: "La puissance est doublée si l'utilisateur agit après la cible ce tour, y compris les actions effectuées via Sommation ou le talent Danseuse. Entrer au combat ne compte pas comme une action.", // NEEDS QC
		shortDesc: "Puissance doublée si le lanceur agit après la cible.", // NEEDS QC
		gen6: {
			desc: "La puissance est doublée si l'utilisateur agit après la cible ce tour. Entrer au combat ne compte pas comme une action.", // NEEDS QC
		},
		gen4: {
			desc: "La puissance est doublée si l'utilisateur agit après la cible ce tour. Entrer au combat compte comme une action.", // NEEDS QC
		},
	},
	payday: {
		name: "Jackpot",
		// Official flavor text: "Des pièces sont lancées sur l’ennemi. Permet d’obtenir de l’argent à la fin du combat."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Éparpille des pièces.", // NEEDS QC

		activate: "  Il pleut des pièces !",
	},
	peck: {
		name: "Picpic",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	perishsong: {
		name: "Requiem",
		// Official flavor text: "Tout Pokémon qui entend ce requiem est K.O. dans trois tours à moins qu’il ne soit remplacé."
		desc: "Chaque Pokémon actif reçoit un compte à rebours de 4 s'il n'en a pas déjà un. À la fin de chaque tour, y compris celui de l'utilisation, le compte à rebours de tous les Pokémon actifs baisse de 1, et les Pokémon dont il atteint 0 sont mis K.O. Le compte à rebours est retiré des Pokémon qui quittent le combat. Si un Pokémon utilise Relais avec un compte à rebours, son remplaçant en hérite et le décompte continue.", // NEEDS QC
		shortDesc: "Les Pokémon au combat seront K.O. dans 3 tours.", // NEEDS QC

		start: "  Les Pokémon au combat seront K.O. dans trois tours !",
		activate: "  Le compte à rebours de Requiem {POKEMON:de} descend à {NUMBER} !",
	},
	petalblizzard: {
		name: "Tempête Florale",
		// Official flavor text: "Déclenche une violente tempête de fleurs qui inflige des dégâts à tous les Pokémon alentour."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les Pokémon adjacents.", // NEEDS QC
	},
	petaldance: {
		name: "Danse Fleurs",
		// Official flavor text: "Le lanceur attaque en projetant des pétales pendant deux à trois tours avant de céder à la confusion."
		desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible au premier tour de l'effet ou au deuxième tour d'un effet de trois tours, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo et que l'utilisateur dort, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		shortDesc: "Dure 2-3 tours, puis le lanceur devient confus.", // NEEDS QC
		gen6: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse adjacent au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible au premier tour de l'effet ou au deuxième tour d'un effet de trois tours, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus à la fin du dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus à la fin du dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'endort, est gelé, ou si l'attaque échoue contre la cible, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen2: {
			desc: "Que cette capacité réussisse ou non, l'utilisateur reste bloqué dessus pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet, même s'il est déjà confus. Si l'utilisateur est empêché d'agir, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen1: {
			desc: "Que cette capacité réussisse ou non, l'utilisateur reste bloqué dessus pendant trois ou quatre tours et devient confus juste après son action au dernier tour de l'effet, même s'il est déjà confus. Si l'utilisateur est empêché d'agir, l'effet prend fin sans causer de confusion. Pendant l'effet, la précision de cette capacité est remplacée à chaque tour par la précision actuelle calculée, changements de niveaux compris, mais sans descendre sous 1/256 ni dépasser 255/256.", // NEEDS QC
			shortDesc: "Dure 3-4 tours, puis rend l'utilisateur confus.", // NEEDS QC
		},
	},
	phantomforce: {
		name: "Hantise",
		// Official flavor text: "Le lanceur disparaît au premier tour et frappe au second. Cette attaque passe outre les protections."
		desc: "Si cette capacité réussit, elle brise les effets de Blockhaus, Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer ce côté normalement. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Disparaît, frappe au tour 2. Brise les protections.", // NEEDS QC
		gen6: {
			desc: "Si cette capacité réussit, elle brise les effets de Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer ce côté normalement. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		},

		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	photongeyser: {
		name: "Photo-Geyser",
		// Official flavor text: "Le lanceur fait jaillir un pilier de lumière. Compare l’Attaque et l’Attaque Spéciale, et utilise celle qui infligera le plus de dégâts."
		desc: "Cette capacité devient une attaque physique si l'Attaque de l'utilisateur est supérieure à son Attaque Spéciale, changements de niveaux compris. Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Physique si Atq > Atq. Spé. Ignore les talents.", // NEEDS QC
	},
	pikapapow: {
		name: "Pika-Fracas",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est égale à (bonheur de l'utilisateur × 2/5), arrondi à l'inférieur, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Bonheur max : 102 de puissance. Ne rate jamais.", // NEEDS QC
	},
	pinmissile: {
		name: "Dard-Nuée",
		// Official flavor text: "Envoie une rafale de dards. Peut toucher de deux à cinq fois."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour chaque coup. Si un des coups brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	plasmafists: {
		name: "Plasma Punch",
		// Official flavor text: "Le lanceur attaque en projetant de l’électricité avec ses poings. Convertit les capacités de type Normal en type Électrik."
		desc: "Si cette capacité réussit, les capacités de type Normal deviennent de type Électrik ce tour.", // NEEDS QC
		shortDesc: "Les capacités Normal deviennent Électrik ce tour.", // NEEDS QC
	},
	playnice: {
		name: "Camaraderie",
		// Official flavor text: "L’ennemi se lie d’amitié avec le lanceur et perd sa combativité, diminuant son Attaque."
		desc: "Baisse l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	playrough: {
		name: "Câlinerie",
		// Official flavor text: "Attaque l’ennemi avec un câlin. Peut diminuer son Attaque."
		desc: "A 10 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	pluck: {
		name: "Picore",
		// Official flavor text: "Le lanceur picore la cible. Si cette dernière tient une Baie, le lanceur la mange et profite de ses effets."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il vole la Baie tenue par la cible et la mange immédiatement, obtenant ses effets même si son propre objet est ignoré. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		shortDesc: "Vole et mange la Baie de la cible.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur vole la Baie tenue par la cible et la mange immédiatement, obtenant ses effets sauf si son propre objet est ignoré. Les objets perdus à cause de cette capacité peuvent être récupérés avec Recyclage.", // NEEDS QC
		},

		removeItem: "#bugbite",
	},
	poisonfang: {
		name: "Crochet Venin",
		// Official flavor text: "Le lanceur mord l’ennemi de ses crocs toxiques. Peut aussi l’empoisonner gravement."
		desc: "A 50 % de chances d'empoisonner gravement la cible.", // NEEDS QC
		shortDesc: "50 % d'empoisonner gravement la cible.", // NEEDS QC
		gen5: {
			desc: "A 30 % de chances d'empoisonner gravement la cible.", // NEEDS QC
			shortDesc: "30 % d'empoisonner gravement la cible.", // NEEDS QC
		},
	},
	poisongas: {
		name: "Gaz Toxik",
		// Official flavor text: "Un nuage de gaz toxique est projeté au visage de l’ennemi pour l’empoisonner."
		desc: "Empoisonne la cible.", // NEEDS QC
		shortDesc: "Empoisonne les ennemis.", // NEEDS QC
		gen2: {
			shortDesc: "Empoisonne la cible.", // NEEDS QC
		},
	},
	poisonjab: {
		name: "Direct Toxik",
		// Official flavor text: "Attaque l’ennemi avec un tentacule, un bras, ou un autre membre plein de poison. Peut aussi l’empoisonner."
		desc: "A 30 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "30 % d'empoisonner la cible.", // NEEDS QC
	},
	poisonpowder: {
		name: "Poudre Toxik",
		// Official flavor text: "Une poudre toxique empoisonne l’ennemi."
		desc: "Empoisonne la cible.", // NEEDS QC
		shortDesc: "Empoisonne la cible.", // NEEDS QC
	},
	poisonsting: {
		name: "Dard-Venin",
		// Official flavor text: "Un dard toxique qui transperce l’ennemi. Peut aussi l’empoisonner."
		desc: "A 30 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "30 % d'empoisonner la cible.", // NEEDS QC
		gen1: {
			desc: "A 20 % de chances d'empoisonner la cible.", // NEEDS QC
			shortDesc: "20 % d'empoisonner la cible.", // NEEDS QC
		},
	},
	poisontail: {
		name: "Queue-Poison",
		// Official flavor text: "Attaque à taux de critiques élevé. Peut aussi empoisonner l’ennemi."
		desc: "A 10 % de chances d'empoisonner la cible et plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé. 10 % d'empoisonner.", // NEEDS QC
	},
	polarflare: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "A 10 % de chances de geler la cible. Cette capacité ne peut pas dégeler une cible gelée. Si cette capacité réussit contre au moins une cible et que l'utilisateur est un Ramnarok, il prend sa Radiant Forme s'il est sous sa Dormant Forme, et inversement. Ce changement de forme ne se produit pas si le Ramnarok a le talent Sans Limite. La Radiant Forme redevient Dormant Forme quand Ramnarok quitte le combat.", // NEEDS QC
		shortDesc: "10 % de geler. Ramnarok change de forme.", // NEEDS QC
	},
	pollenpuff: {
		name: "Boule Pollen",
		// Official flavor text: "Utilisée sur l’ennemi, envoie une boule explosive qui fait des dégâts\u00A0; sur un allié, donne du bon pollen nutritif qui fait récupérer des PV."
		desc: "Si la cible est un allié, cette capacité lui restaure la moitié de ses PV max, arrondi à l'inférieur, au lieu d'infliger des dégâts.", // NEEDS QC
		shortDesc: "Soigne un allié ciblé de la moitié de ses PV max.", // NEEDS QC
	},
	poltergeist: {
		name: "Esprit Frappeur",
		shortDesc: "Échoue si la cible ne tient pas d'objet.", // NEEDS QC

		activate: "  {POKEMON} est attaqué par {INFLECT:ITEM:ms=son propre:fs=sa propre:mp=ses propres:fp=ses propres} {ITEM:classified} !",
	},
	populationbomb: {
		name: "Prolifération",
		// Official flavor text: "Le lanceur et ses congénères prolifèrent en masse et attaquent ensemble d'une à dix fois d'affilée."
		desc: "Frappe dix fois. Cette capacité vérifie la précision à chaque coup, et l'attaque s'arrête si la cible évite un coup. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours dix fois. Si l'utilisateur tient un Dé Pipé, elle frappe quatre à dix fois au hasard sans vérifier la précision entre les coups.", // NEEDS QC
		shortDesc: "Frappe 10 fois. Chaque coup peut rater.", // NEEDS QC
	},
	pounce: {
		name: "Bond",
		// Official flavor text: "Le lanceur attaque en bondissant sur la cible, ce qui baisse la Vitesse de celle-ci."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
	},
	pound: {
		name: "Écras’Face",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	powder: {
		name: "Nuée de Poudre",
		// Official flavor text: "L’ennemi est pris dans un nuage de poudre. S’il utilise une capacité de type Feu lors du même tour, le nuage explose et lui inflige des dégâts."
		desc: "Si la cible utilise une capacité de type Feu ce tour, celle-ci ne s'exécute pas et la cible perd 1/4 de ses PV max, arrondi au supérieur à partir de 0,5. Cet effet ne se produit pas si la capacité de type Feu est empêchée par Pluie battante.", // NEEDS QC
		shortDesc: "Si elle utilise une capacité Feu, la cible perd 1/4 PV.", // NEEDS QC
		gen6: {
			desc: "Si la cible utilise une capacité de type Feu ce tour, celle-ci ne s'exécute pas et la cible perd 1/4 de ses PV max, arrondi au supérieur à partir de 0,5. Cet effet se produit avant que la capacité de type Feu ne soit empêchée par Pluie battante.", // NEEDS QC
		},

		start: "  {POKEMON} est couvert de poudre !",
		activate: "  La nuée de poudre entre en réaction avec {MOVE} et explose !",
	},
	powdersnow: {
		name: "Poudreuse",
		// Official flavor text: "Le lanceur projette de la neige poudreuse. Peut aussi geler l’ennemi."
		desc: "A 10 % de chances de geler la cible.", // NEEDS QC
		shortDesc: "10 % de geler la cible.", // NEEDS QC
		gen2: {
			shortDesc: "10 % de geler la cible.", // NEEDS QC
		},
	},
	powergem: {
		name: "Rayon Gemme",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	powersplit: {
		name: "Partage Force",
		// Official flavor text: "Additionne l’Attaque Spéciale et l’Attaque du lanceur et de sa cible et les redistribue équitablement entre les deux."
		desc: "L'Attaque et l'Attaque Spéciale de l'utilisateur et de la cible sont fixées à la moyenne de leurs statistiques respectives, arrondi à l'inférieur. Les changements de niveaux ne sont pas affectés.", // NEEDS QC
		shortDesc: "Fait la moyenne des Atq et Atq. Spé avec la cible.", // NEEDS QC

		activate: "  {POKEMON} additionne sa force à celle de sa cible et redistribue le tout équitablement !",
	},
	powerswap: {
		name: "Permuforce",
		// Official flavor text: "Pouvoir qui échange les modifications de l’Attaque Spéciale et de l’Attaque du lanceur avec la cible."
		desc: "L'utilisateur échange ses changements de niveaux d'Attaque et d'Attaque Spéciale avec ceux de la cible.", // NEEDS QC
		shortDesc: "Échange ses hausses d'Atq et Atq. Spé avec la cible.", // NEEDS QC
	},
	powershift: {
		name: "Échange Force",
		// Official flavor text: "Le lanceur échange son Attaque avec sa Défense."
		desc: "L'utilisateur échange ses statistiques d'Attaque et de Défense ; les changements de niveaux restent sur leurs statistiques respectives. Cette capacité peut être utilisée de nouveau pour rétablir les statistiques. Si l'utilisateur utilise Relais, son remplaçant a ses statistiques d'Attaque et de Défense échangées si l'effet est actif. Si les statistiques de l'utilisateur sont recalculées par un changement de forme pendant l'échange, cet effet est ignoré mais reste actif pour Relais.", // NEEDS QC
		shortDesc: "Échange l'Attaque et la Défense du lanceur.", // NEEDS QC

		start: "  {POKEMON} échange sa puissance offensive et sa puissance défensive !",
		end: "#.start",
	},
	powertrick: {
		name: "Astuce Force",
		// Official flavor text: "Le lanceur utilise ses pouvoirs psychiques pour échanger sa Défense et son Attaque."
		desc: "L'utilisateur échange ses statistiques d'Attaque et de Défense ; les changements de niveaux restent sur leurs statistiques respectives. Cette capacité peut être utilisée de nouveau pour rétablir les statistiques. Si l'utilisateur utilise Relais, son remplaçant a ses statistiques d'Attaque et de Défense échangées si l'effet est actif. Si les statistiques de l'utilisateur sont recalculées par un changement de forme pendant l'échange, cet effet est ignoré mais reste actif pour Relais.", // NEEDS QC
		shortDesc: "Échange l'Attaque et la Défense du lanceur.", // NEEDS QC

		start: "  {POKEMON} intervertit son Attaque et sa Défense !",
		end: "#.start",
	},
	powertrip: {
		name: "Arrogance",
		// Official flavor text: "Ivre de puissance, le lanceur attaque de toutes ses forces. Plus ses stats ont été augmentées, plus la puissance de l’attaque est élevée."
		desc: "La puissance est égale à 20 + (X × 20), où X est le total des changements de niveaux de statistiques positifs de l'utilisateur.", // NEEDS QC
		shortDesc: "+20 de puissance par hausse de stat du lanceur.", // NEEDS QC
	},
	poweruppunch: {
		name: "Poing Boost",
		// Official flavor text: "À force de frapper, les poings deviennent plus durs. Augmente l’Attaque du lanceur si l’ennemi est touché."
		desc: "A 100 % de chances de monter l'Attaque de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "100 % de monter l'Attaque du lanceur d'un niveau.", // NEEDS QC
	},
	powerwhip: {
		name: "Mégafouet",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	precipiceblades: {
		name: "Lame Pangéenne",
		// Official flavor text: "Le Pokémon transforme la puissance de la terre et attaque la cible avec une lame acérée."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Aucun effet en plus. Touche les ennemis adjacents.", // NEEDS QC
	},
	present: {
		name: "Cadeau",
		// Official flavor text: "Le lanceur attaque en offrant un cadeau piégé à la cible. Peut cependant restaurer certains de ses PV."
		desc: "Si cette capacité réussit, elle inflige des dégâts ou soigne la cible : 40 % de chances pour 40 de puissance, 30 % pour 80, 10 % pour 120, et 20 % de chances de soigner la cible de 1/4 de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Puissance 40, 80 ou 120, ou soigne la cible de 1/4 PV.", // NEEDS QC
		gen2: {
			desc: "Si cette capacité réussit, elle inflige des dégâts ou soigne la cible : 102/256 de chances pour 40 de puissance, 76/256 pour 80, 26/256 pour 120, et 52/256 de chances de soigner la cible de 1/4 de ses PV max, arrondi à l'inférieur. Si cette capacité inflige des dégâts, elle utilise une version anormale de la formule de dégâts en substituant certaines valeurs : l'Attaque de l'utilisateur est remplacée par 10 fois l'efficacité de cette capacité contre la cible, la Défense de la cible par le numéro d'index du second type de l'utilisateur, et le niveau de l'utilisateur par le numéro d'index du second type de la cible. Si un Pokémon n'a pas de second type, son premier type est utilisé. Les numéros d'index des types sont Normal : 0, Combat : 1, Vol : 2, Poison : 3, Sol : 4, Roche : 5, Insecte : 7, Spectre : 8, Acier : 9, Feu : 20, Eau : 21, Plante : 22, Électrik : 23, Psy : 24, Glace : 25, Dragon : 26, Ténèbres : 27. Si une division par 0 devait se produire dans la formule de dégâts, elle divise par 1 à la place.", // NEEDS QC
		},
	},
	prismaticlaser: {
		name: "Laser Prisme",
		// Official flavor text: "Le lanceur utilise la puissance d’un prisme pour envoyer un laser destructeur, mais il doit se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	protect: {
		name: "Abri",
		// Official flavor text: "Le lanceur se protège de toutes les attaques. Peut échouer si utilisée plusieurs fois de suite."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège le lanceur des capacités ce tour.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité, Abri, Prévention ou Garde Large. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie, jusqu'à un maximum de 8. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour. Cette capacité a X chances sur 65536 de réussir, où X commence à 65535 et est divisé par deux, arrondi à l'inférieur, à chaque utilisation réussie. Après la quatrième réussite d'affilée, X tombe à 118 et prend ensuite des valeurs apparemment aléatoires entre 0 et 65535. X revient à 65535 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur est protégé des attaques de l'adversaire pendant ce tour. Cette capacité a X chances sur 255 de réussir, où X commence à 255 et est divisé par deux, arrondi à l'inférieur, à chaque utilisation réussie. X revient à 255 si cette capacité échoue ou si la dernière capacité utilisée n'est pas Détection, Ténacité ou Abri. Échoue si l'utilisateur a un clone ou agit en dernier ce tour.", // NEEDS QC
		},

		start: "  {POKEMON} est prêt à se protéger !",
		block: "  {POKEMON} se protège !",
	},
	psybeam: {
		name: "Rafale Psy",
		// Official flavor text: "Un étrange rayon frappe l’ennemi. Peut aussi le rendre confus."
		desc: "A 10 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "10 % de rendre la cible confuse.", // NEEDS QC
	},
	psyblade: {
		name: "Lame Psychique",
		// Official flavor text: "Le lanceur lacère la cible à l'aide d'une lame intangible. S'il se trouve dans un champ électrifié, la puissance de cette capacité augmente de 50 %."
		desc: "Si le terrain actuel est un Champ Électrifié, la puissance de cette capacité est multipliée par 1,5.", // NEEDS QC
		shortDesc: "Sur champ électrifié : puissance x1,5.", // NEEDS QC
	},
	psychic: {
		name: "Psyko",
		// Official flavor text: "Une puissante force télékinétique frappe l’ennemi. Peut aussi faire baisser sa Défense Spéciale."
		desc: "A 10 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "10 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
		gen1: {
			desc: "A 33 % de chances de baisser le Spécial de la cible d'un niveau.", // NEEDS QC
			shortDesc: "33 % de baisser le Spécial de la cible d'un niveau.", // NEEDS QC
		},
	},
	psychicfangs: {
		name: "Psycho-Croc",
		// Official flavor text: "Le lanceur mord la cible avec ses pouvoirs psychiques. Brise aussi les barrières comme Mur Lumière et Protection."
		desc: "Si cette attaque ne rate pas, les effets de Protection, Mur Lumière et Voile Aurore prennent fin du côté de la cible avant le calcul des dégâts.", // NEEDS QC
		shortDesc: "Détruit les murs, sauf si la cible est immunisée.", // NEEDS QC
	},
	psychicnoise: {
		name: "Dissonance Psy",
		// Official flavor text: "Le lanceur attaque avec des ondes sonores dissonantes. Cela empêche la cible de récupérer des PV à l'aide de capacités, talents ou objets tenus pendant 2 tours."
		desc: "Pendant 2 tours, la cible ne peut plus récupérer de PV tant qu'elle reste au combat. Pendant l'effet, les capacités de soin et de drain sont inutilisables, et les talents et objets qui soignent ne soignent pas l'utilisateur. Si un Pokémon affecté utilise Relais, son remplaçant reste incapable de récupérer des PV. Balance et le talent Régé-Force ne sont pas affectés.", // NEEDS QC
		shortDesc: "2 tours : la cible ne peut pas se soigner.", // NEEDS QC
	},
	psychicterrain: {
		name: "Champ Psychique",
		// Official flavor text: "Pendant cinq tours, les Pokémon au sol ne peuvent plus subir d’attaques prioritaires et la puissance des capacités de type Psy augmente."
		desc: "Pendant 5 tours, le terrain devient un Champ Psychique. Pendant l'effet, la puissance des attaques de type Psy des Pokémon au sol est multipliée par 1,3, et les Pokémon au sol ne peuvent pas être touchés par des capacités de priorité supérieure à 0, sauf si la cible est un allié. Camouflage transforme l'utilisateur en type Psy, Force Nature devient Psyko et Force Cachée a 30 % de chances de baisser la Vitesse de la cible d'un niveau. Échoue si le terrain actuel est déjà un Champ Psychique.", // NEEDS QC
		shortDesc: "5 tours : Psy + ; bloque les capacités prioritaires.", // NEEDS QC
		gen7: {
			desc: "Pendant 5 tours, le terrain devient un Champ Psychique. Pendant l'effet, la puissance des attaques de type Psy des Pokémon au sol est multipliée par 1,5, et les Pokémon au sol ne peuvent pas être touchés par des capacités de priorité supérieure à 0, sauf si la cible est un allié. Camouflage transforme l'utilisateur en type Psy, Force Nature devient Psyko et Force Cachée a 30 % de chances de baisser la Vitesse de la cible d'un niveau. Échoue si le terrain actuel est déjà un Champ Psychique.", // NEEDS QC
		},
	},
	psychoboost: {
		name: "Psycho-Boost",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Baisse l'Attaque Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'Atq. Spé du lanceur de 2 niveaux.", // NEEDS QC
	},
	psychocut: {
		name: "Coupe Psycho",
		// Official flavor text: "Le lanceur entaille l’ennemi grâce à des lames faites d’énergie psychique. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	psychoshift: {
		name: "Échange Psy",
		// Official flavor text: "Le lanceur transfère ses problèmes de statut à l’ennemi grâce à son pouvoir de suggestion."
		desc: "Le problème de statut de l'utilisateur est transféré à la cible, et l'utilisateur est soigné. Échoue si l'utilisateur n'a pas de problème de statut ou si la cible en a déjà un.", // NEEDS QC
		shortDesc: "Transfère son problème de statut à la cible.", // NEEDS QC
	},
	psychup: {
		name: "Boost",
		// Official flavor text: "Une autohypnose qui permet au lanceur de copier les changements de stats de la cible."
		desc: "L'utilisateur copie tous les changements de niveaux de statistiques actuels de la cible.", // NEEDS QC
		shortDesc: "Copie les changements de stats de la cible.", // NEEDS QC
		gen2: {
			desc: "L'utilisateur copie tous les changements de niveaux de statistiques actuels de la cible. Échoue si les niveaux de statistiques de la cible sont tous à 0.", // NEEDS QC
		},
	},
	psyshieldbash: {
		name: "Sprint Bouclier",
		// Official flavor text: "Le lanceur s'enveloppe d'énergie psychique et frappe sa cible de plein fouet. Cela augmente également la Défense du lanceur."
		desc: "A 100 % de chances de monter la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "100 % de monter la Défense du lanceur d'un niveau.", // NEEDS QC
	},
	psyshock: {
		name: "Choc Psy",
		// Official flavor text: "Le lanceur matérialise des ondes mystérieuses qu’il projette sur l’ennemi. Inflige des dégâts physiques."
		desc: "Inflige des dégâts à la cible selon sa Défense au lieu de sa Défense Spéciale.", // NEEDS QC
		shortDesc: "Frappe la Défense de la cible, pas sa Déf. Spé.", // NEEDS QC
	},
	psystrike: {
		name: "Frappe Psy",
		// Official flavor text: "Le lanceur matérialise des ondes mystérieuses qu’il projette sur l’ennemi. Inflige des dégâts physiques."
		desc: "Inflige des dégâts à la cible selon sa Défense au lieu de sa Défense Spéciale.", // NEEDS QC
		shortDesc: "Frappe la Défense de la cible, pas sa Déf. Spé.", // NEEDS QC
	},
	psywave: {
		name: "Vague Psy",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Inflige à la cible des dégâts égaux à (niveau de l'utilisateur) × (X + 50) / 100, où X est un nombre aléatoire entre 0 et 100, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Dégâts aléatoires entre 0,5x et 1,5x son niveau.", // NEEDS QC
		gen4: {
			desc: "Inflige à la cible des dégâts égaux à (niveau de l'utilisateur) × (X × 10 + 50) / 100, où X est un nombre aléatoire entre 0 et 10, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige à la cible des dégâts égaux à un nombre aléatoire entre 1 et (niveau de l'utilisateur × 1,5 − 1), arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
			shortDesc: "Dégâts aléatoires de 1 à (niveau x 1,5 - 1).", // NEEDS QC
		},
	},
	pulverizingpancake: {
		name: "Gare au Ronflex",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	punishment: {
		name: "Punition",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est égale à 60 + (X × 20), où X est le total des changements de niveaux de statistiques positifs de la cible, avec un maximum de 200.", // NEEDS QC
		shortDesc: "Puissance 60, +20 par hausse de stat de la cible.", // NEEDS QC
	},
	purify: {
		name: "Purification",
		// Official flavor text: "Le lanceur soigne les altérations de statut de la cible, ce qui lui permet de regagner des PV."
		desc: "Soigne le problème de statut de la cible. Si la cible a été soignée, l'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Soigne le statut de la cible ; si oui, +1/2 PV max.", // NEEDS QC
	},
	pursuit: {
		name: "Poursuite",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Si un Pokémon adverse quitte le combat ce tour, cette capacité le frappe avant qu'il ne parte, même s'il n'était pas la cible d'origine. Si l'utilisateur agit après un adversaire utilisant Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair, mais pas Relais, il le frappe avant qu'il ne parte. La puissance est doublée et la précision n'est pas vérifiée si l'utilisateur frappe un adversaire en train de partir, et le tour de l'utilisateur est terminé ; si un adversaire est mis K.O. ainsi, son remplaçant n'entre qu'à la fin du tour.", // NEEDS QC
		shortDesc: "Frappe à puissance x2 les ennemis qui se retirent.", // NEEDS QC
		gen7: {
			desc: "Si un Pokémon adverse adjacent quitte le combat ce tour, cette capacité le frappe avant qu'il ne parte, même s'il n'était pas la cible d'origine. Si l'utilisateur agit après un adversaire utilisant Dernier Mot, Demi-Tour ou Change Éclair, mais pas Relais, il le frappe avant qu'il ne parte. La puissance est doublée et la précision n'est pas vérifiée si l'utilisateur frappe un adversaire en train de partir, et le tour de l'utilisateur est terminé ; si un adversaire est mis K.O. ainsi, son remplaçant n'entre qu'à la fin du tour.", // NEEDS QC
		},
		gen5: {
			desc: "Si un Pokémon adverse adjacent quitte le combat ce tour, cette capacité le frappe avant qu'il ne parte, même s'il n'était pas la cible d'origine. Si l'utilisateur agit après un adversaire utilisant Demi-Tour ou Change Éclair, mais pas Relais, il le frappe avant qu'il ne parte. La puissance est doublée et la précision n'est pas vérifiée si l'utilisateur frappe un adversaire en train de partir, et le tour de l'utilisateur est terminé ; si un adversaire est mis K.O. ainsi, son remplaçant n'entre qu'à la fin du tour.", // NEEDS QC
		},
		gen4: {
			desc: "Si un Pokémon adverse quitte le combat ce tour, cette capacité le frappe avant qu'il ne parte, même s'il n'était pas la cible d'origine. Si l'utilisateur agit après un adversaire utilisant Demi-Tour, mais pas Relais, il le frappe avant qu'il ne parte. La puissance est doublée et la précision n'est pas vérifiée si l'utilisateur frappe un adversaire en train de partir, et le tour de l'utilisateur est terminé ; si un adversaire est mis K.O. ainsi, son remplaçant entre immédiatement.", // NEEDS QC
		},
		gen3: {
			desc: "Si la cible est un Pokémon adverse et qu'elle quitte le combat ce tour, cette capacité la frappe avant qu'elle ne parte. La puissance est doublée et la précision n'est pas vérifiée si l'utilisateur frappe un adversaire en train de partir, et le tour de l'utilisateur est terminé ; si un adversaire est mis K.O. ainsi, son remplaçant entre immédiatement.", // NEEDS QC
			shortDesc: "Puissance x2 si la cible visée se retire.", // NEEDS QC
		},
		gen2: {
			desc: "Si la cible quitte le combat ce tour, cette capacité la frappe avec une puissance doublée avant qu'elle ne parte, et le tour de l'utilisateur est terminé.", // NEEDS QC
			shortDesc: "Puissance x2 si l'ennemi se retire.", // NEEDS QC
		},

		activate: "  ({TARGET} va être rappelé...)", // NEEDS QC
	},
	pyroball: {
		name: "Ballon Brûlant",
		// Official flavor text: "Le lanceur attaque avec un ballon fait à partir d’un caillou enflammé. Peut aussi brûler la cible."
		desc: "A 10 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "10 % de brûler. Dégèle le lanceur.", // NEEDS QC
	},
	quash: {
		name: "À la Queue",
		// Official flavor text: "Retient la cible de force, l’obligeant à agir en dernier."
		desc: "La cible agit après tous les autres Pokémon ce tour, quelle que soit la priorité de la capacité qu'elle a choisie. Échoue si la cible a déjà agi ce tour.", // NEEDS QC
		shortDesc: "Force la cible à agir en dernier ce tour.", // NEEDS QC

		activate: "  {TARGET} doit retourner à la queue !",
	},
	quickattack: {
		name: "Vive-Attaque",
		// Official flavor text: "Le lanceur fonce sur l’ennemi si rapidement qu’on parvient à peine à le discerner. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	quickguard: {
		name: "Prévention",
		// Official flavor text: "Le lanceur et son équipe sont protégés contre les attaques prioritaires."
		desc: "L'utilisateur et son équipe sont protégés des attaques de priorité (d'origine ou modifiée) supérieure à 0 des autres Pokémon, alliés compris, pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		shortDesc: "Protège l'équipe des capacités prioritaires ce tour.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur et son équipe sont protégés des attaques de priorité (d'origine ou modifiée) supérieure à 0 des autres Pokémon, alliés compris, pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur et son équipe sont protégés des attaques de priorité (d'origine ou modifiée) supérieure à 0 des autres Pokémon, alliés compris, pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur et son équipe sont protégés des attaques de priorité (d'origine ou modifiée) supérieure à 0 des autres Pokémon, alliés compris, pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur et son équipe sont protégés des attaques de priorité d'origine supérieure à 0 des autres Pokémon, alliés compris, pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée par l'utilisateur n'est pas Détection, Ténacité, Abri, Prévention ou Garde Large. Si X vaut 256 ou plus, cette capacité a 1 chance sur 2^32 de réussir. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		},

		start: "  {TEAM} est protégé par la capacité Prévention !",
		block: "  {POKEMON} est protégé par la capacité Prévention !",
	},
	quiverdance: {
		name: "Papillodanse",
		// Official flavor text: "Une danse mystique dont le rythme parfait augmente l’Attaque Spéciale, la Défense Spéciale et la Vitesse du lanceur."
		desc: "Monte l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "+1 Atq. Spé, Déf. Spé et Vit. du lanceur.", // NEEDS QC
	},
	rage: {
		name: "Frénésie",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Une fois cette capacité utilisée avec succès, l'Attaque de l'utilisateur monte d'un niveau chaque fois qu'il est touché par l'attaque d'un autre Pokémon, tant que cette capacité reste sélectionnée.", // NEEDS QC
		shortDesc: "+1 Attaque s'il est touché pendant l'utilisation.", // NEEDS QC
		gen3: {
			desc: "Une fois cette capacité utilisée, et sauf si la cible s'est protégée, l'Attaque de l'utilisateur monte d'un niveau chaque fois qu'il est touché par l'attaque d'un autre Pokémon, tant que cette capacité reste sélectionnée.", // NEEDS QC
		},
		gen2: {
			desc: "Une fois cette capacité utilisée avec succès, X commence à 1. Les dégâts de cette capacité sont multipliés par X, et chaque fois que l'utilisateur est touché par le Pokémon adverse, X augmente de 1, jusqu'à un maximum de 255. X revient à 1 quand l'utilisateur n'est plus au combat ou n'a pas choisi cette capacité.", // NEEDS QC
			shortDesc: "Frénésie suivante renforcée si touché pendant l'usage.", // NEEDS QC
		},
		gen1: {
			desc: "Une fois cette capacité utilisée avec succès, l'utilisateur l'utilise automatiquement chaque tour et ne peut plus quitter le combat. Pendant l'effet, son Attaque monte d'un niveau chaque fois qu'il est touché par le Pokémon adverse, et la précision de cette capacité est remplacée à chaque tour par la précision actuelle calculée, changements de niveaux compris, mais sans descendre sous 1/256 ni dépasser 255/256.", // NEEDS QC
			shortDesc: "Dure indéfiniment. Attaque +1 quand il est touché.", // NEEDS QC
		},
	},
	ragefist: {
		name: "Poing de Colère",
		// Official flavor text: "Le lanceur transforme sa colère en énergie pour attaquer. Plus il a subi d'attaques, plus la puissance de cette capacité augmente."
		desc: "La puissance est égale à 50 + (X × 50), où X est le nombre total de fois où l'utilisateur a été touché par une attaque infligeant des dégâts pendant le combat, même s'il n'a pas perdu de PV. X ne peut pas dépasser 6 et n'est pas réinitialisé par un remplacement ou une mise K.O. Chaque coup d'une capacité frappant plusieurs fois est compté, mais pas les dégâts de confusion.", // NEEDS QC
		shortDesc: "+50 de puissance par coup subi (6 max).", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	ragepowder: {
		name: "Poudre Fureur",
		// Official flavor text: "Le lanceur s’asperge d’une poudre irritante pour attirer l’attention. Il attire toutes les attaques ennemies."
		desc: "Jusqu'à la fin du tour, toutes les attaques à cible unique du côté adverse sont redirigées vers l'utilisateur. Ces attaques sont redirigées avant de pouvoir être renvoyées par Reflet Magik ou le talent Miroir Magik, ou attirées par les talents Paratonnerre ou Lavabo. Échoue si ce n'est ni un Combat Duo ni un Combat Royal. Cet effet est ignoré tant que l'utilisateur est sous l'effet de Chute Libre.", // NEEDS QC
		shortDesc: "Les capacités ennemies visent le lanceur ce tour.", // NEEDS QC
		gen6: {
			desc: "Jusqu'à la fin du tour, toutes les attaques mono-cible du côté adverse sont redirigées vers l'utilisateur s'il est à portée. Ces attaques sont redirigées avant de pouvoir être renvoyées par Reflet Magik ou le talent Miroir Magik, ou attirées par les talents Paratonnerre ou Lavabo. Échoue si ce n'est pas un Combat Duo ou Trio. Cet effet est ignoré tant que l'utilisateur est sous l'effet de Chute Libre.", // NEEDS QC
		},

		start: "#followme",
		startFromZEffect: "#followme",
	},
	ragingbull: {
		name: "Taurogne",
		// Official flavor text: "Le lanceur effectue un plaquage comme un taureau enragé. Le type de cette capacité dépend de la forme du lanceur. Peut aussi briser les barrières comme Mur Lumière et Protection."
		desc: "Si cette attaque ne rate pas, les effets de Protection, Mur Lumière et Voile Aurore prennent fin du côté de la cible avant le calcul des dégâts. Si la forme actuelle de l'utilisateur est un Tauros de Paldea, le type de cette capacité change en conséquence : type Combat pour la Race Combative, type Feu pour la Race Flamboyante et type Eau pour la Race Aquatique.", // NEEDS QC
		shortDesc: "Détruit les murs. Type selon la forme.", // NEEDS QC

		activate: "  {POKEMON} brise les protections de {TEAM} !", // NEEDS QC
	},
	ragingfury: {
		name: "Grand Courroux",
		// Official flavor text: "Le lanceur se déchaîne et attaque en projetant de violentes flammes pendant deux ou trois tours. Il devient ensuite confus."
		desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible au premier tour de l'effet ou au deuxième tour d'un effet de trois tours, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo et que l'utilisateur dort, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		shortDesc: "Dure 2-3 tours, puis le lanceur devient confus.", // NEEDS QC
	},
	raindance: {
		name: "Danse Pluie",
		// Official flavor text: "Invoque de fortes pluies qui durent cinq tours, augmentant la puissance des capacités de type Eau et baissant celle des capacités de type Feu."
		desc: "Pendant 5 tours, la météo devient Pluie. Pendant l'effet, les dégâts des attaques de type Eau sont multipliés par 1,5 et ceux des attaques de type Feu par 0,5. Dure 8 tours si l'utilisateur tient une Roche Humide. Échoue si la météo actuelle est déjà Pluie.", // NEEDS QC
		shortDesc: "5 tours : la pluie renforce les capacités Eau.", // NEEDS QC
		gen3: {
			desc: "Pendant 5 tours, la météo devient Pluie. Pendant l'effet, les dégâts des attaques de type Eau sont multipliés par 1,5 et ceux des attaques de type Feu par 0,5. Échoue si la météo actuelle est déjà Pluie.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 5 tours, la météo devient Pluie, même si la météo actuelle est déjà Pluie. Pendant l'effet, les dégâts des attaques de type Eau sont multipliés par 1,5 et ceux des attaques de type Feu par 0,5.", // NEEDS QC
		},
	},
	rapidspin: {
		name: "Tour Rapide",
		// Official flavor text: "Une attaque tournoyante pouvant aussi annuler, par exemple, Étreinte, Ligotage ou Vampigraine. Augmente également la Vitesse du lanceur."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., les effets de Vampigraine et des capacités de piégeage prennent fin pour l'utilisateur, et tous les pièges sont retirés de son côté du terrain. A 100 % de chances de monter la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Se libère des pièges et entraves ; +1 Vitesse.", // NEEDS QC
		gen7: {
			desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., les effets de Vampigraine et des capacités de piégeage prennent fin pour l'utilisateur, et tous les pièges sont retirés de son côté du terrain.", // NEEDS QC
			shortDesc: "Libère des pièges, de l'étreinte et de Vampigraine.", // NEEDS QC
		},
		gen4: {
			desc: "Si cette capacité réussit, les effets de Vampigraine et des capacités de piégeage prennent fin pour l'utilisateur, et tous les pièges sont retirés de son côté du terrain.", // NEEDS QC
		},
		gen3: {
			desc: "Si cette capacité réussit, les effets de Vampigraine et des capacités de piégeage prennent fin pour l'utilisateur, et Picots est retiré de son côté du terrain.", // NEEDS QC
		},
	},
	razorleaf: {
		name: "Tranch’Herbe",
		// Official flavor text: "Des feuilles aiguisées comme des rasoirs entaillent l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé. Touche les ennemis adjacents.", // NEEDS QC
		gen2: {
			shortDesc: "Taux de critique élevé.", // NEEDS QC
		},
	},
	razorshell: {
		name: "Coqui-Lame",
		// Official flavor text: "Un coquillage aiguisé lacère l’ennemi. Peut aussi baisser sa Défense."
		desc: "A 50 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	razorwind: {
		name: "Coupe-Vent",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A plus de chances de porter un coup critique. Cette attaque se charge au premier tour et s'exécute au second. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Charge, frappe au tour 2. Taux de critique élevé.", // NEEDS QC
		gen4: {
			desc: "A plus de chances de porter un coup critique. Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
		},
		gen3: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
			shortDesc: "Charge, puis frappe les ennemis au tour 2.", // NEEDS QC
		},
		gen2: {
			desc: "A plus de chances de porter un coup critique. Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
			shortDesc: "Charge puis frappe au tour 2. Taux de critique élevé.", // NEEDS QC
		},
		gen1: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
			shortDesc: "Charge au tour 1. Frappe au tour 2.", // NEEDS QC
		},

		prepare: "  {POKEMON} se prépare à lancer une bourrasque !",
	},
	recover: {
		name: "Soin",
		// Official flavor text: "Un soin qui permet au lanceur de récupérer jusqu’à la moitié de ses PV max."
		desc: "L'utilisateur récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur. Échoue si (PV max de l'utilisateur − PV actuels + 1) est divisible par 256.", // NEEDS QC
		},
	},
	recycle: {
		name: "Recyclage",
		// Official flavor text: "Recycle un objet tenu à usage unique déjà utilisé lors du combat pour pouvoir l’utiliser à nouveau."
		desc: "L'utilisateur récupère le dernier objet qu'il a utilisé. Échoue si l'utilisateur tient un objet, s'il n'a pas tenu d'objet, si l'objet était un Ballon éclaté, si l'objet a été ramassé par un Pokémon avec le talent Ramassage, ou si l'objet a été perdu à cause de Piqûre, Gaz Corrosif, Implore, Calcination, Sabotage, Picore ou Larcin. Les objets lancés avec Dégommage peuvent être récupérés.", // NEEDS QC
		shortDesc: "Récupère le dernier objet qu'il a utilisé.", // NEEDS QC
		gen7: {
			desc: "L'utilisateur récupère le dernier objet qu'il a utilisé. Échoue si l'utilisateur tient un objet, s'il n'a pas tenu d'objet, si l'objet était un Ballon éclaté, si l'objet a été ramassé par un Pokémon avec le talent Ramassage, ou si l'objet a été perdu à cause de Piqûre, Implore, Calcination, Sabotage, Picore ou Larcin. Les objets lancés avec Dégommage peuvent être récupérés.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur récupère l'objet utilisé en dernier par un Pokémon à sa position actuelle sur le terrain, même si ce Pokémon n'était pas l'utilisateur. Échoue si l'utilisateur tient un objet, si aucun objet n'a été utilisé à sa position, ou si l'objet a été perdu à cause de Implore, Sabotage ou Larcin. Les objets lancés avec Dégommage peuvent être récupérés.", // NEEDS QC
		},

		addItem: "  {POKEMON} ramasse l'objet: {ITEM}!",
	},
	reflect: {
		name: "Protection",
		// Official flavor text: "Crée un fabuleux mur de lumière qui réduit les dégâts causés par les capacités physiques pendant cinq tours."
		desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 0,5x les dégâts des attaques physiques, ou 0,66x en Combat Duo. Les dégâts ne sont pas réduits davantage avec Voile Aurore. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique, Psycho-Croc ou Anti-Brume. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "5 tours : dégâts physiques subis réduits de moitié.", // NEEDS QC
		gen6: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 0,5x les dégâts des attaques physiques, ou 0,66x en Combat Duo ou Trio. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique ou Anti-Brume. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 1/2 des dégâts des attaques physiques, ou 2/3 s'il y a plusieurs Pokémon actifs du côté de l'utilisateur. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique ou Anti-Brume. Dure 8 tours si l'utilisateur tient une Lumargile. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},
		gen3: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe subissent 1/2 des dégâts des attaques physiques, ou 2/3 s'il y a plusieurs Pokémon actifs du côté de l'utilisateur. Les coups critiques ignorent cet effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Casse-Brique. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe ont leur Défense doublée. Les coups critiques ignorent cet effet. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
			shortDesc: "5 tours : Défense de l'équipe doublée.", // NEEDS QC
		},
		gen1: {
			desc: "Tant que l'utilisateur reste au combat, sa Défense est doublée quand il subit des dégâts. Les coups critiques ignorent cette protection. Cet effet peut être retiré par Buée Noire.", // NEEDS QC
			shortDesc: "Tant qu'actif, sa Défense est doublée.", // NEEDS QC
			start: "  {POKEMON} augmente sa protection!",
		},

		start: "  Protection augmente la résistance de {TEAM} aux capacités physiques !",
		end: "  Protection n’a plus d’effet sur {TEAM} !",
	},
	reflecttype: {
		name: "Copie-Type",
		// Official flavor text: "Le lanceur copie le type de la cible et devient du même type."
		desc: "Les types de l'utilisateur deviennent les types actuels de la cible. Si les types actuels de la cible incluent l'absence de type et un type non ajouté, l'absence de type est ignorée. S'ils incluent l'absence de type et un type ajouté par Maléfice Sylvain ou Halloween, l'absence de type est copiée comme type Normal. Échoue si l'utilisateur est un Arceus ou un Silvallié, s'il est téracristallisé, ou si la cible n'a aucun type.", // NEEDS QC
		shortDesc: "Copie les types de la cible.", // NEEDS QC
		gen8: {
			desc: "Les types de l'utilisateur deviennent les types actuels de la cible. Si les types actuels de la cible incluent l'absence de type et un type non ajouté, l'absence de type est ignorée. S'ils incluent l'absence de type et un type ajouté par Maléfice Sylvain ou Halloween, l'absence de type est copiée comme type Normal. Échoue si l'utilisateur est un Arceus ou un Silvallié, ou si la cible n'a aucun type.", // NEEDS QC
		},
		gen6: {
			desc: "Les types de l'utilisateur deviennent les types actuels de la cible. Échoue si l'utilisateur est un Arceus.", // NEEDS QC
		},

		typeChange: "  {POKEMON} prend le type {SOURCE:de} !",
	},
	refresh: {
		name: "Régénération",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Soigne la brûlure, l'empoisonnement ou la paralysie de l'utilisateur. Échoue si l'utilisateur n'est ni brûlé, ni empoisonné, ni paralysé.", // NEEDS QC
		shortDesc: "Soigne sa brûlure, son poison ou sa paralysie.", // NEEDS QC
	},
	relicsong: {
		name: "Chant Antique",
		// Official flavor text: "Le lanceur attaque l’ennemi en lui chantant une chanson d’un autre temps. Peut l’endormir."
		desc: "A 10 % de chances d'endormir la cible. Si cette capacité réussit contre au moins une cible et que l'utilisateur est un Meloetta, il prend sa Forme Danse s'il est sous sa Forme Chant, ou sa Forme Chant s'il est sous sa Forme Danse. Ce changement de forme ne se produit pas si le Meloetta a le talent Sans Limite. La Forme Danse redevient Forme Chant quand Meloetta quitte le combat.", // NEEDS QC
		shortDesc: "10 % d'endormir. Meloetta change de forme.", // NEEDS QC
	},
	rest: {
		name: "Repos",
		// Official flavor text: "Le lanceur regagne tous ses PV et soigne ses altérations de statut, puis il dort pendant deux tours."
		desc: "L'utilisateur s'endort pour les deux tours suivants et récupère tous ses PV, se soignant au passage de tout problème de statut. Échoue si l'utilisateur a tous ses PV, s'il dort déjà, ou si un autre effet empêche le sommeil.", // NEEDS QC
		shortDesc: "Dort 2 tours : récupère tous ses PV et son statut.", // NEEDS QC
		gen2: {
			desc: "L'utilisateur s'endort pour les deux tours suivants et récupère tous ses PV, se soignant au passage de tout problème de statut, même s'il dort déjà. Échoue si l'utilisateur a tous ses PV.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur s'endort pour les deux tours suivants et récupère tous ses PV, se soignant au passage de tout problème de statut. Cela ne retire pas la pénalité de statistique due à la brûlure ou à la paralysie. Échoue si l'utilisateur a tous ses PV.", // NEEDS QC
		},
	},
	retaliate: {
		name: "Vengeance",
		// Official flavor text: "Venge un Pokémon de l’équipe mis K.O. Si un Pokémon de l’équipe a été mis K.O. au tour d’avant, l’effet augmente."
		desc: "La puissance est doublée si un membre de l'équipe de l'utilisateur a été mis K.O. au tour précédent.", // NEEDS QC
		shortDesc: "Puissance x2 si un allié a été K.O. le tour d'avant.", // NEEDS QC
	},
	return: {
		name: "Retour",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est égale à (bonheur de l'utilisateur × 2/5), arrondi à l'inférieur, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Puissance max (102) avec le bonheur maximal.", // NEEDS QC
	},
	revelationdance: {
		name: "Danse Éveil",
		// Official flavor text: "Le lanceur attaque en dansant avec enthousiasme. Le type de la capacité est le même que celui du lanceur."
		desc: "Le type de cette capacité dépend du type principal de l'utilisateur. Si le type principal de l'utilisateur est l'absence de type, cette capacité prend son type secondaire s'il en a un, sinon le type ajouté par Maléfice Sylvain ou Halloween. Cette capacité est sans type si l'utilisateur n'a aucun type.", // NEEDS QC
		shortDesc: "Son type est le premier type du lanceur.", // NEEDS QC
	},
	revenge: {
		name: "Vendetta",
		// Official flavor text: "Une attaque deux fois plus puissante si le lanceur a été blessé par l’ennemi durant ce tour."
		desc: "La puissance est doublée si l'utilisateur a été touché par la cible ce tour.", // NEEDS QC
		shortDesc: "Puissance doublée si la cible a blessé le lanceur.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si l'utilisateur a été touché ce tour par un Pokémon à la position actuelle de la cible.", // NEEDS QC
		},
		gen3: {
			desc: "Les dégâts sont doublés si l'utilisateur a été touché ce tour par un Pokémon à la position actuelle de la cible, et que ce Pokémon a été le dernier à toucher l'utilisateur.", // NEEDS QC
			shortDesc: "Dégâts x2 si l'utilisateur a été touché avant.", // NEEDS QC
		},
	},
	reversal: {
		name: "Contre",
		// Official flavor text: "Le lanceur ne retient plus ses coups. Plus ses PV sont bas, plus l’attaque est puissante."
		desc: "La puissance de cette capacité est de 20 si X est entre 33 et 48, 40 si X est entre 17 et 32, 80 si X est entre 10 et 16, 100 si X est entre 5 et 9, 150 si X est entre 2 et 4, et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 48 / PV max de l'utilisateur), arrondi à l'inférieur.", // NEEDS QC
		shortDesc: "Plus puissant si le lanceur a peu de PV.", // NEEDS QC
		gen4: {
			desc: "La puissance est de 20 si X va de 43 à 48, 40 de 22 à 42, 80 de 13 à 21, 100 de 6 à 12, 150 de 2 à 5 et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 64 ÷ PV max de l'utilisateur), arrondi à l'inférieur.", // NEEDS QC
		},
		gen3: {
			desc: "La puissance de cette capacité est de 20 si X est entre 33 et 48, 40 si X est entre 17 et 32, 80 si X est entre 10 et 16, 100 si X est entre 5 et 9, 150 si X est entre 2 et 4, et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 48 / PV max de l'utilisateur), arrondi à l'inférieur.", // NEEDS QC
		},
		gen2: {
			desc: "La puissance est de 20 si X va de 33 à 48, 40 de 17 à 32, 80 de 10 à 16, 100 de 5 à 9, 150 de 2 à 4 et 200 si X vaut 0 ou 1, où X est égal à (PV actuels de l'utilisateur × 48 ÷ PV max de l'utilisateur), arrondi à l'inférieur. Cette capacité n'a pas de variance de dégâts et ne peut pas être un coup critique.", // NEEDS QC
		},
	},
	revivalblessing: {
		name: "Second Souffle",
		// Official flavor text: "Dans un élan de compassion, le lanceur adresse une prière afin de ranimer un Pokémon de l'équipe K.O. en lui rendant la moitié de ses PV."
		desc: "Un membre de l'équipe mis K.O. est choisi et ranimé avec la moitié de ses PV max, arrondi à l'inférieur. Échoue si aucun membre de l'équipe n'est K.O.", // NEEDS QC
		shortDesc: "Ranime un équipier K.O. avec la moitié de ses PV.", // NEEDS QC

		heal: "  {POKEMON} a repris connaissance et est prêt à se battre de nouveau !",
	},
	risingvoltage: {
		name: "Monte-Tension",
		// Official flavor text: "Des éclairs surgissent du sol et frappent l’ennemi. La puissance de cette attaque est doublée si la cible est sur un Champ Électrifié."
		desc: "Si le terrain actuel est un Champ Électrifié et que la cible est au sol, la puissance de cette capacité est doublée.", // NEEDS QC
		shortDesc: "x2 contre une cible au sol sur champ électrifié.", // NEEDS QC
	},
	roar: {
		name: "Hurlement",
		// Official flavor text: "Effraie le Pokémon ennemi et le remplace par un autre. Lors d’un combat contre un Pokémon sauvage seul, met fin au combat."
		desc: "La cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Échoue si la cible est le dernier Pokémon non K.O. de son équipe, si elle a utilisé Racines ou si elle a le talent Ventouse.", // NEEDS QC
		shortDesc: "La cible est remplacée par un allié au hasard.", // NEEDS QC
		gen4: {
			desc: "La cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Échoue si la cible est le dernier Pokémon non K.O. de son équipe, si elle a utilisé Racines ou si elle a le talent Ventouse, ou si le niveau de l'utilisateur est inférieur à celui de la cible et que X × (niveau de l'utilisateur + niveau de la cible) / 256 + 1 est inférieur ou égal à (niveau de la cible / 4), arrondi à l'inférieur, où X est un nombre aléatoire entre 0 et 255.", // NEEDS QC
		},
		gen2: {
			desc: "La cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Échoue si la cible est le dernier Pokémon non K.O. de son équipe, ou si l'utilisateur agit avant la cible.", // NEEDS QC
		},
		gen1: {
			desc: "Aucune utilité en combat.", // NEEDS QC
			shortDesc: "Aucune utilité en combat.", // NEEDS QC
		},
	},
	roaroftime: {
		name: "Hurle-Temps",
		// Official flavor text: "Le lanceur frappe si fort qu’il affecte le cours du temps. Il se repose au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	rockblast: {
		name: "Boule Roc",
		// Official flavor text: "Le lanceur projette un rocher sur l’ennemi de deux à cinq fois d’affilée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
	},
	rockclimb: {
		name: "Escalade",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 20 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "20 % de rendre la cible confuse.", // NEEDS QC
	},
	rockpolish: {
		name: "Poliroche",
		// Official flavor text: "Le lanceur polit son corps pour diminuer sa résistance au vent. Augmente beaucoup la Vitesse."
		desc: "Monte la Vitesse de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte la Vitesse du lanceur de 2 niveaux.", // NEEDS QC
	},
	rockslide: {
		name: "Éboulement",
		// Official flavor text: "Envoie de gros rochers sur l’ennemi pour infliger des dégâts. Peut aussi l’apeurer."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		gen1: {
			desc: "Aucun effet supplémentaire.", // NEEDS QC
			shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		},
		gen2: {
			shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		},
	},
	rocksmash: {
		name: "Éclate-Roc",
		// Official flavor text: "Porte un coup de poing à l’ennemi qui peut baisser sa Défense."
		desc: "A 50 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	rockthrow: {
		name: "Jet-Pierres",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	rocktomb: {
		name: "Tomberoche",
		// Official flavor text: "Des rochers frappent l’ennemi. Réduit aussi sa Vitesse."
		desc: "A 100 % de chances de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Vitesse de la cible d'un niveau.", // NEEDS QC
	},
	rockwrecker: {
		name: "Roc-Boulet",
		// Official flavor text: "Le lanceur attaque en projetant un gros rocher sur l’ennemi. Il doit se reposer au tour suivant."
		desc: "Si cette capacité réussit, l'utilisateur doit se recharger au tour suivant et ne peut pas sélectionner de capacité.", // NEEDS QC
		shortDesc: "Le lanceur ne peut pas agir au tour suivant.", // NEEDS QC
	},
	roleplay: {
		name: "Imitation",
		// Official flavor text: "Imite la cible et copie son talent."
		desc: "Le talent de l'utilisateur devient celui de la cible. Échoue si le talent de l'utilisateur est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Mode Transe ou Supermutation ou déjà identique à celui de la cible, ou si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Don Floral, Météo, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Osmose, Paléosynthèse, Charge Quantique, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téra-Carapace, Téramorphose, Téraformation 0, Calque, Garde Mystik, Mode Transe ou Supermutation.", // NEEDS QC
		shortDesc: "Copie le talent de la cible.", // NEEDS QC
		gen8: {
			desc: "Le talent de l'utilisateur devient celui de la cible. Échoue si le talent de l'utilisateur est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe ou déjà identique à celui de la cible, ou si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Dégobage, Déclic Fringale, Tête de Gel, Illusion, Imposteur, Multi-Type, Gaz Inhibiteur, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque, Garde Mystik ou Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "Le talent de l'utilisateur devient celui de la cible. Échoue si le talent de l'utilisateur est Synergie, Hypersommeil, Fantômasque, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique ou Mode Transe ou déjà identique à celui de la cible, ou si le talent de la cible est Synergie, Hypersommeil, Fantômasque, Don Floral, Météo, Illusion, Imposteur, Multi-Type, Rassemblement, Osmose, Receveur, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Calque, Garde Mystik ou Mode Transe.", // NEEDS QC
		},
		gen6: {
			desc: "Le talent de l'utilisateur devient celui de la cible. Échoue si le talent de l'utilisateur est Multi-Type ou Déclic Tactique ou déjà identique à celui de la cible, ou si le talent de la cible est Don Floral, Météo, Illusion, Imposteur, Multi-Type, Déclic Tactique, Calque, Garde Mystik ou Mode Transe.", // NEEDS QC
		},
		gen5: {
			desc: "Le talent de l'utilisateur devient celui de la cible. Échoue si le talent de l'utilisateur est Multi-Type ou déjà identique à celui de la cible, ou si le talent de la cible est Don Floral, Météo, Illusion, Imposteur, Multi-Type, Calque, Garde Mystik ou Mode Transe.", // NEEDS QC
		},
		gen4: {
			desc: "Le talent de l'utilisateur devient celui de la cible. Échoue si le talent de l'utilisateur est Multi-Type ou déjà identique à celui de la cible, si le talent de la cible est Multi-Type ou Garde Mystik, ou si l'utilisateur tient une Orbe Platiné.", // NEEDS QC
		},
		gen3: {
			desc: "Le talent de l'utilisateur devient celui de la cible. Échoue si le talent de la cible est Garde Mystik.", // NEEDS QC
		},

		changeAbility: "  {POKEMON} copie le talent {ABILITY} {SOURCE:de} !",
	},
	rollingkick: {
		name: "Mawashi Geri",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	rollout: {
		name: "Roulade",
		// Official flavor text: "Un rocher roule sur l’ennemi pendant cinq tours. L’attaque gagne en puissance à chaque coup."
		desc: "Si cette capacité réussit, l'utilisateur reste bloqué dessus et ne peut pas faire d'autre action jusqu'à ce qu'elle rate, que 5 tours passent ou que l'attaque ne puisse plus être utilisée. La puissance double à chaque coup réussi, et double encore si l'utilisateur a utilisé Boul’Armure auparavant. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour.", // NEEDS QC
		shortDesc: "Puissance doublée par coup. Se répète 5 tours.", // NEEDS QC
		gen7: {
			desc: "Si cette capacité réussit, l'utilisateur est bloqué dessus et ne peut pas utiliser d'autre capacité jusqu'à ce qu'elle rate, que 5 tours passent ou que l'attaque ne puisse pas être utilisée. La puissance double à chaque coup réussi et double encore si l'utilisateur a utilisé Boul’Armure auparavant. Si cette capacité est utilisée via Blabla Dodo, elle est utilisée pendant un tour. Si cette capacité touche un Fantômasque actif pendant l'effet, le multiplicateur de puissance est mis en pause mais pas le compteur de tours, ce qui peut permettre d'appliquer le multiplicateur à la prochaine capacité de l'utilisateur après la fin de l'effet.", // NEEDS QC
		},
		gen6: {
			desc: "Si cette capacité réussit, l'utilisateur reste bloqué dessus et ne peut pas faire d'autre action jusqu'à ce qu'elle rate, que 5 tours passent ou que l'attaque ne puisse plus être utilisée. La puissance double à chaque coup réussi, et double encore si l'utilisateur a utilisé Boul’Armure auparavant. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour.", // NEEDS QC
		},
	},
	roost: {
		name: "Atterrissage",
		// Official flavor text: "Le lanceur atterrit et se repose. Restaure jusqu’à la moitié de ses PV max."
		desc: "L'utilisateur récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5. Si l'utilisateur n'est pas téracristallisé, jusqu'à la fin du tour, les utilisateurs de type Vol perdent leur type Vol et ceux purement de type Vol deviennent de type Normal. Ne fait rien si l'utilisateur a tous ses PV.", // NEEDS QC
		shortDesc: "Récupère 1/2 PV. Sans type Vol jusqu'à la fin du tour.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5. Jusqu'à la fin du tour, les utilisateurs de type Vol perdent leur type Vol et ceux purement de type Vol deviennent de type Normal. Ne fait rien si l'utilisateur a tous ses PV.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur. Jusqu'à la fin du tour, les utilisateurs de type Vol perdent leur type Vol et ceux purement de type Vol n'ont plus aucun type. Ne fait rien si l'utilisateur a tous ses PV.", // NEEDS QC
		},

		start: "  ({POKEMON} perd le type Vol pour ce tour.)", // NEEDS QC
	},
	rototiller: {
		name: "Fertilisation",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Monte l'Attaque et l'Attaque Spéciale de tous les Pokémon de type Plante au sol d'un niveau.", // NEEDS QC
		shortDesc: "+1 Atq et Atq. Spé des types Plante au sol.", // NEEDS QC
	},
	round: {
		name: "Chant Canon",
		// Official flavor text: "Le lanceur attaque l’ennemi en chantant. Si plusieurs Pokémon déclenchent cette attaque à la suite, l’effet augmente."
		desc: "Si d'autres Pokémon actifs ont choisi cette capacité ce tour, ils agissent immédiatement après l'utilisateur, par ordre de Vitesse, et la puissance de cette capacité est de 120 pour chacun d'eux.", // NEEDS QC
		shortDesc: "Puissance x2 si un autre a utilisé Chant Canon ce tour.", // NEEDS QC
	},
	ruination: {
		name: "Cataclysme",
		// Official flavor text: "Le lanceur déclenche un cataclysme qui baisse les PV de la cible de moitié."
		desc: "Inflige à la cible des dégâts égaux à la moitié de ses PV actuels, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Inflige la moitié des PV actuels de la cible.", // NEEDS QC
	},
	sacredfire: {
		name: "Feu Sacré",
		// Official flavor text: "Le lanceur génère un feu mystique d’une intensité redoutable pour attaquer l’ennemi. Peut aussi le brûler."
		desc: "A 50 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "50 % de brûler. Dégèle le lanceur.", // NEEDS QC
	},
	sacredsword: {
		name: "Lame Sainte",
		// Official flavor text: "Un coup de corne violent qui lacère l’ennemi et lui inflige des dégâts quels que soient ses changements de stats."
		desc: "Ignore les changements de niveaux de statistiques de la cible, esquive comprise.", // NEEDS QC
		shortDesc: "Ignore les changements de stats de la cible.", // NEEDS QC
	},
	safeguard: {
		name: "Rune Protect",
		// Official flavor text: "Crée un champ protecteur qui empêche toutes les altérations de statut pendant cinq tours."
		desc: "Pendant 5 tours, l'utilisateur et son équipe ne peuvent pas subir de problème de statut ni de confusion infligés par d'autres Pokémon. Les Pokémon du côté de l'utilisateur ne peuvent pas être affectés par Bâillement, mais peuvent s'endormir à cause de son effet. L'effet est retiré du côté de l'utilisateur si lui ou un allié est touché par Anti-Brume. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "5 tours : protège l'équipe des problèmes de statut.", // NEEDS QC
		gen3: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe ne peuvent pas subir de problème de statut ni de confusion infligés par d'autres Pokémon. Les Pokémon du côté de l'utilisateur ne peuvent pas être affectés par Bâillement, mais peuvent s'endormir à cause de son effet. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 5 tours, l'utilisateur et son équipe ne peuvent pas subir de problème de statut ni de confusion infligés par d'autres Pokémon. Pendant l'effet, Colère, Mania et Danse Fleurs ne rendent pas l'utilisateur confus. Échoue si l'effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		},

		start: "  Un voile mystérieux recouvre {TEAM} !",
		end: "  {TEAM:capitalize} n’est plus protégée par le voile mystérieux !",
		block: "  {POKEMON} est protégé par la capacité Rune Protect !",
	},
	saltcure: {
		name: "Salaison",
		// Official flavor text: "Le lanceur couvre la cible de sel, ce qui lui inflige des dégâts à chaque tour. Si la cible est de type Acier ou Eau, ces dégâts sont plus élevés."
		desc: "Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/4 si la cible est de type Acier ou Eau), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. L'effet prend fin quand la cible quitte le combat.", // NEEDS QC
		shortDesc: "Inflige 1/8 des PV par tour ; 1/4 aux Acier et Eau.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  {POKEMON} est couvert de sel !",
		damage: "  {POKEMON} est blessé par la capacité Salaison !",
	},
	sandattack: {
		name: "Jet de Sable",
		// Official flavor text: "Lance du sable au visage de l’ennemi pour baisser sa Précision."
		desc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
	},
	sandsearstorm: {
		name: "Typhon Pyrosable",
		// Official flavor text: "Le lanceur déclenche un violent typhon mêlé à du sable ardent qui s'abat sur la cible, ce qui peut la brûler."
		desc: "A 20 % de chances de brûler la cible. Si la météo est Pluie battante ou Pluie, cette capacité ne vérifie pas la précision. Si elle est utilisée contre un Pokémon tenant un Parapluie Solide, sa précision reste à 80 %.", // NEEDS QC
		shortDesc: "20 % de brûler. Ne rate pas sous la pluie.", // NEEDS QC
	},
	sandstorm: {
		name: "Tempête de Sable",
		// Official flavor text: "Une tempête de sable blesse tous les Pokémon pendant cinq tours, sauf ceux de type Roche, Sol ou Acier. Augmente la Défense Spéciale des Pokémon Roche."
		desc: "Pendant 5 tours, la météo devient la tempête de sable. À la fin de chaque tour sauf le dernier, tous les Pokémon actifs perdent 1/16 de leurs PV max, arrondi à l'inférieur, sauf s'ils sont de type Sol, Roche ou Acier, ou ont le talent Garde Magik, Envelocape, Force Sable, Baigne Sable ou Voile Sable. Pendant l'effet, la Défense Spéciale des Pokémon de type Roche est multipliée par 1,5 quand ils subissent une attaque spéciale. Dure 8 tours si l'utilisateur tient une Roche Lisse. Échoue si la météo actuelle est déjà la tempête de sable.", // NEEDS QC
		shortDesc: "5 tours : tempête de sable. Roche : Déf. Spé x1,5.", // NEEDS QC
		gen4: {
			desc: "Pendant 5 tours, la météo devient la tempête de sable. À la fin de chaque tour sauf le dernier, tous les Pokémon actifs perdent 1/16 de leurs PV max, arrondi à l'inférieur, sauf s'ils sont de type Sol, Roche ou Acier, ou ont le talent Garde Magik ou Voile Sable. Pendant l'effet, la Défense Spéciale des Pokémon de type Roche est multipliée par 1,5 quand ils subissent une attaque spéciale. Dure 8 tours si l'utilisateur tient une Roche Lisse. Échoue si la météo actuelle est déjà la tempête de sable.", // NEEDS QC
		},
		gen3: {
			desc: "Pendant 5 tours, la météo devient la tempête de sable. À la fin de chaque tour sauf le dernier, tous les Pokémon actifs perdent 1/16 de leurs PV max, arrondi à l'inférieur, sauf s'ils sont de type Sol, Roche ou Acier, ou ont le talent Voile Sable. Échoue si la météo actuelle est déjà la tempête de sable.", // NEEDS QC
			shortDesc: "Pendant 5 tours, une tempête de sable fait rage.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 5 tours, la météo devient la tempête de sable. À la fin de chaque tour sauf le dernier, tous les Pokémon actifs perdent 1/8 de leurs PV max, arrondi à l'inférieur, sauf s'ils sont de type Sol, Roche ou Acier. Échoue si la météo actuelle est déjà la tempête de sable.", // NEEDS QC
		},
	},
	sandtomb: {
		name: "Tourbi-Sable",
		// Official flavor text: "Le lanceur emprisonne l’ennemi dans une tempête de sable terrifiante qui dure de quatre à cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max (1/8 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours (toujours cinq si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
			shortDesc: "Piège et blesse la cible pendant 2-5 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours. Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle utilise Relais. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},

		start: "  {POKEMON} est piégé dans un tourbillon de sable !",
	},
	sappyseed: {
		name: "Évo-Écolo",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette capacité invoque Vampigraine sur la cible.", // NEEDS QC
		shortDesc: "Invoque l'effet de Vampigraine.", // NEEDS QC
	},
	savagespinout: {
		name: "Cocon Fatal",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	scald: {
		name: "Ébullition",
		// Official flavor text: "L’ennemi est attaqué par un jet d’eau bouillante. Peut aussi le brûler."
		desc: "A 30 % de chances de brûler la cible. La cible est dégelée si elle était gelée.", // NEEDS QC
		shortDesc: "30 % de brûler. Dégèle la cible.", // NEEDS QC
		gen5: {
			desc: "A 30 % de chances de brûler la cible.", // NEEDS QC
			shortDesc: "30 % de brûler la cible.", // NEEDS QC
		},
	},
	scaleshot: {
		name: "Rafale Écailles",
		// Official flavor text: "Le lanceur projette des écailles sur la cible de deux à cinq fois d’affilée. Augmente la Vitesse, mais diminue la Défense."
		desc: "Frappe deux à cinq fois. Baisse la Défense de l'utilisateur d'un niveau et monte sa Vitesse d'un niveau après le dernier coup. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2-5 fois. Après : -1 Déf, +1 Vitesse.", // NEEDS QC
	},
	scaryface: {
		name: "Grimace",
		// Official flavor text: "Le lanceur fait une grimace qui effraie l’ennemi et réduit beaucoup sa Vitesse."
		desc: "Baisse la Vitesse de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse la Vitesse de la cible de 2 niveaux.", // NEEDS QC
	},
	scorchingsands: {
		name: "Sable Ardent",
		// Official flavor text: "Le lanceur projette du sable chauffé à blanc sur l’ennemi. Peut aussi brûler la cible."
		desc: "A 30 % de chances de brûler la cible. La cible est dégelée si elle était gelée.", // NEEDS QC
		shortDesc: "30 % de brûler. Dégèle la cible.", // NEEDS QC
	},
	scratch: {
		name: "Griffe",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	screech: {
		name: "Grincement",
		// Official flavor text: "Le lanceur émet un son strident qui baisse beaucoup la Défense de l’ennemi."
		desc: "Baisse la Défense de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse la Défense de la cible de 2 niveaux.", // NEEDS QC
	},
	searingshot: {
		name: "Incendie",
		// Official flavor text: "Des boules de feu s’abattent sur tous les Pokémon autour du lanceur. Peut aussi les brûler."
		desc: "A 30 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "30 % de brûler les Pokémon adjacents.", // NEEDS QC
	},
	searingsunrazesmash: {
		name: "Hélio-Choc Dévastateur",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Ignore les talents des autres Pokémon.", // NEEDS QC
	},
	secretpower: {
		name: "Force Cachée",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances de causer un effet secondaire selon le terrain du combat : paralysie sur le terrain standard, paralysie sur un Champ Électrifié, baisse d'un niveau d'Attaque Spéciale sur un Champ Brumeux, sommeil sur un Champ Herbu et baisse d'un niveau de Vitesse sur un Champ Psychique.", // NEEDS QC
		shortDesc: "Effet selon le terrain (30 % de paralysie).", // NEEDS QC
		gen6: {
			desc: "A 30 % de chances de causer un effet secondaire selon le terrain du combat : paralysie sur le terrain Wi-Fi standard, paralysie sur un Champ Électrifié, baisse d'un niveau d'Attaque Spéciale sur un Champ Brumeux et sommeil sur un Champ Herbu.", // NEEDS QC
		},
		gen5: {
			desc: "A 30 % de chances de causer un effet secondaire selon le terrain du combat : baisse d'un niveau de précision sur le terrain Wi-Fi standard. La chance d'effet secondaire n'est pas affectée par le talent Sérénité.", // NEEDS QC
			shortDesc: "Effet selon le terrain. (30 % : précision -1)", // NEEDS QC
		},
		gen4: {
			desc: "A 30 % de chances de causer un effet secondaire selon le terrain du combat : paralysie sur le terrain Wi-Fi standard.", // NEEDS QC
			shortDesc: "Effet selon le terrain (30 % de paralysie).", // NEEDS QC
		},
	},
	secretsword: {
		name: "Lame Ointe",
		// Official flavor text: "L’ennemi est lacéré par une longue corne. Son pouvoir mystérieux inflige des dégâts physiques."
		desc: "Inflige des dégâts à la cible selon sa Défense au lieu de sa Défense Spéciale.", // NEEDS QC
		shortDesc: "Frappe la Défense de la cible, pas sa Déf. Spé.", // NEEDS QC
	},
	seedbomb: {
		name: "Canon Graine",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	seedflare: {
		name: "Fulmigraine",
		// Official flavor text: "Le corps du lanceur émet une onde de choc. Peut aussi beaucoup baisser la Défense Spéciale de la cible."
		desc: "A 40 % de chances de baisser la Défense Spéciale de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "40 % de baisser la Déf. Spé de la cible de 2 niveaux.", // NEEDS QC
	},
	seismictoss: {
		name: "Frappe Atlas",
		// Official flavor text: "L’ennemi est projeté grâce au pouvoir de la gravité. Inflige des dégâts équivalents au niveau du lanceur."
		desc: "Inflige à la cible des dégâts égaux au niveau de l'utilisateur.", // NEEDS QC
		shortDesc: "Inflige des dégâts égaux au niveau du lanceur.", // NEEDS QC
		gen1: {
			desc: "Inflige à la cible des dégâts égaux au niveau de l'utilisateur. Cette capacité ignore l'immunité de type.", // NEEDS QC
			shortDesc: "Dégâts = niveau. Touche les types Spectre.", // NEEDS QC
		},
	},
	selfdestruct: {
		name: "Destruction",
		// Official flavor text: "Le lanceur explose en blessant tous les Pokémon autour de lui. Le lanceur tombe K.O."
		desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité, même si elle échoue faute de cible. Cette capacité ne peut pas s'exécuter si un Pokémon actif a le talent Moiteur.", // NEEDS QC
		shortDesc: "Touche les adjacents. Le lanceur est mis K.O.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité, sauf si elle n'a pas de cible. La Défense de la cible est divisée par deux pendant le calcul des dégâts. Cette capacité n'est pas exécutée si un Pokémon ayant le talent Moiteur est au combat.", // NEEDS QC
			shortDesc: "Déf. adverse réduite de moitié. L'utilisateur : K.O.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité. La Défense de la cible est divisée par deux pendant le calcul des dégâts. Cette capacité n'est pas exécutée si un Pokémon ayant le talent Moiteur est au combat.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité. La Défense de la cible est divisée par deux pendant le calcul des dégâts.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur est mis K.O. après avoir utilisé cette capacité, sauf si le clone de la cible a été brisé par les dégâts. La Défense de la cible est réduite de moitié pendant le calcul des dégâts.", // NEEDS QC
		},
	},
	shadowball: {
		name: "Ball’Ombre",
		// Official flavor text: "Projette une grande ombre sur l’ennemi. Peut aussi faire baisser sa Défense Spéciale."
		desc: "A 20 % de chances de baisser la Défense Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "20 % de baisser la Déf. Spé de la cible d'un niveau.", // NEEDS QC
	},
	shadowbone: {
		name: "Os Ombre",
		// Official flavor text: "Le lanceur frappe avec un os possédé par l’âme d’un défunt. Peut aussi baisser la Défense de la cible."
		desc: "A 20 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "20 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	shadowclaw: {
		name: "Griffe Ombre",
		// Official flavor text: "Attaque avec une griffe puissante faite d’ombres. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	shadowforce: {
		name: "Revenant",
		// Official flavor text: "Le lanceur disparaît et frappe l’ennemi au second tour. Fonctionne même si l’ennemi se protège."
		desc: "Si cette capacité réussit, elle brise les effets de Blockhaus, Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer ce côté normalement. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Disparaît, frappe au tour 2. Brise les protections.", // NEEDS QC
		gen6: {
			desc: "Si cette capacité réussit, elle brise les effets de Détection, Bouclier Royal, Abri ou Pico-Défense de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si le côté de la cible est protégé par Vigilance, Tatamigaeshi, Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer ce côté normalement. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		},
		gen5: {
			desc: "Si cette capacité réussit, elle brise les effets de Détection ou Abri de la cible pour ce tour, permettant aux autres Pokémon de l'attaquer normalement. Si la cible est un adversaire et que son côté est protégé par Prévention ou Garde Large, cette protection est aussi brisée pour ce tour et les autres Pokémon peuvent attaquer le côté adverse normalement. Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, l'utilisateur évite toutes les attaques. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		},

		activate: "  Ça transperce la protection {TARGET:de} !",
		prepare: "{POKEMON} disparaît instantanément !",
	},
	shadowpunch: {
		name: "Poing Ombre",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	shadowsneak: {
		name: "Ombre Portée",
		// Official flavor text: "Le lanceur étend son ombre pour frapper par-derrière. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	shadowstrike: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "A 50 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "50 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	sharpen: {
		name: "Affûtage",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Monte l'Attaque de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'Attaque du lanceur d'un niveau.", // NEEDS QC
	},
	shatteredpsyche: {
		name: "Psycho-Pulvérisation EX",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	shedtail: {
		name: "Queulonage",
		// Official flavor text: "Le lanceur crée un clone en sacrifiant des PV, puis il revient et échange sa place avec un Pokémon de l'équipe prêt à combattre."
		desc: "L'utilisateur sacrifie la moitié de ses PV max, arrondi au supérieur, pour créer un clone ayant 1/4 de ses PV max, arrondi à l'inférieur. L'utilisateur est remplacé par un autre Pokémon de son équipe, qui hérite du clone. Échoue si l'utilisateur serait mis K.O. ou s'il n'y a aucun autre membre d'équipe non K.O.", // NEEDS QC
		shortDesc: "Perd la moitié de ses PV et lègue un clone.", // NEEDS QC

		start: "  {POKEMON} détache sa queue pour créer un leurre !",
		alreadyStarted: "#substitute",
		fail: "#substitute",
	},
	sheercold: {
		name: "Glaciation",
		// Official flavor text: "Une vague de froid glacial frappe l’ennemi pour le mettre K.O. en un coup. A peu de chances de réussir si le lanceur ne possède pas le type Glace."
		desc: "Inflige à la cible des dégâts égaux à ses PV max. Ignore les modificateurs de précision et d'esquive. La précision de cette attaque est égale à (niveau de l'utilisateur - niveau de la cible + X) %, où X est 30 si l'utilisateur est de type Glace et 20 sinon, et elle échoue si la cible est d'un niveau supérieur. Les Pokémon de type Glace et ceux ayant le talent Fermeté sont immunisés.", // NEEDS QC
		shortDesc: "K.O. en un coup. N'affecte pas le type Glace.", // NEEDS QC
		gen6: {
			desc: "Inflige à la cible des dégâts égaux à ses PV max. Ignore les modificateurs de précision et d'esquive. La précision de cette attaque est égale à (niveau de l'utilisateur - niveau de la cible + 30) %, et elle échoue si la cible est d'un niveau supérieur. Les Pokémon ayant le talent Fermeté sont immunisés.", // NEEDS QC
			shortDesc: "K.O. en un coup. Échoue si niveau inférieur.", // NEEDS QC
		},
	},
	shellsidearm: {
		name: "Kokiyarme",
		// Official flavor text: "Une attaque physique ou spéciale, en fonction de ce qui est le plus efficace contre la cible. Peut aussi empoisonner."
		desc: "A 20 % de chances d'empoisonner la cible. Cette capacité devient une attaque physique avec contact si la valeur de ((((2 × niveau de l'utilisateur / 5 + 2) × 90 × X) / Y) / 50), où X est l'Attaque de l'utilisateur et Y la Défense de la cible, est supérieure à la même valeur où X est l'Attaque Spéciale de l'utilisateur et Y la Défense Spéciale de la cible. Aucun modificateur autre que les changements de niveaux n'est pris en compte pour ce calcul. Si les deux valeurs sont égales, la catégorie de dégâts est choisie au hasard.", // NEEDS QC
		shortDesc: "20 % de psn. Physique si cela fait plus de dégâts.", // NEEDS QC
	},
	shellsmash: {
		name: "Exuviation",
		// Official flavor text: "Le lanceur brise sa coquille. Il baisse sa Défense et sa Défense Spéciale, mais augmente beaucoup son Attaque, son Attaque Spéciale et sa Vitesse."
		desc: "Baisse la Défense et la Défense Spéciale de l'utilisateur d'un niveau. Monte son Attaque, son Attaque Spéciale et sa Vitesse de 2 niveaux.", // NEEDS QC
		shortDesc: "-1 Déf et Déf. Spé ; +2 Atq, Atq. Spé et Vit.", // NEEDS QC
	},
	shelltrap: {
		name: "Carapiège",
		// Official flavor text: "Pose une carapace piégée. Si l’adversaire utilise une capacité physique, la carapace explose et lui inflige des dégâts."
		desc: "Échoue si l'utilisateur n'est pas touché par une attaque physique d'un adversaire ce tour avant de pouvoir exécuter cette capacité. Si l'utilisateur a été touché et n'est pas K.O., il attaque immédiatement après avoir été touché, et l'effet prend fin. Si l'attaque physique de l'adversaire a eu son effet secondaire supprimé par le talent Sans Limite, elle ne compte pas pour cet effet.", // NEEDS QC
		shortDesc: "Doit subir des dégâts physiques avant d'agir.", // NEEDS QC

		start: "  {POKEMON} déclenche le Carapiège !",
		prepare: "  {POKEMON} déclenche le Carapiège !",
		cant: "Le Carapiège {POKEMON:de} n’a pas explosé...",
	},
	shelter: {
		name: "Mur Fumigène",
		// Official flavor text: "Rend la peau du lanceur dure comme un mur de fer, ce qui augmente beaucoup sa Défense."
		desc: "Monte la Défense de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur de 2 niveaux.", // NEEDS QC
	},
	shiftgear: {
		name: "Chgt Vitesse",
		// Official flavor text: "Le lanceur fait tourner ses engrenages. Cela augmente son Attaque et augmente beaucoup sa Vitesse."
		desc: "Monte la Vitesse de l'utilisateur de 2 niveaux et son Attaque d'un niveau.", // NEEDS QC
		shortDesc: "Monte sa Vitesse de 2 niveaux et son Attaque de 1.", // NEEDS QC
	},
	shockwave: {
		name: "Onde de Choc",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	shoreup: {
		name: "Amass’Sable",
		// Official flavor text: "Le lanceur récupère jusqu’à la moitié de ses PV max. Durant une tempête de sable, il en récupère encore plus."
		desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur à partir de 0,5. Si la météo est la tempête de sable, il récupère 2/3 de ses PV max, arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Récupère 1/2 PV ; 2/3 sous tempête de sable.", // NEEDS QC
	},
	signalbeam: {
		name: "Rayon Signal",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 10 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "10 % de rendre la cible confuse.", // NEEDS QC
	},
	silktrap: {
		name: "Piège de Fil",
		// Official flavor text: "Le lanceur déploie un piège de fil pour se protéger contre les attaques, et si un assaillant utilise une attaque directe contre lui, la Vitesse de l'assaillant baisse."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui essaient de le toucher avec une capacité directe voient leur Vitesse baisser d'un niveau. Les capacités sans dégâts passent outre cette protection. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège des attaques. Contact : -1 Vitesse.", // NEEDS QC
	},
	silverwind: {
		name: "Vent Argenté",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 10 % de chances de monter l'Attaque, la Défense, l'Attaque Spéciale, la Défense Spéciale et la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "10 % de monter toutes ses stats d'un niveau.", // NEEDS QC
	},
	simplebeam: {
		name: "Rayon Simple",
		// Official flavor text: "Le lanceur envoie des ondes mystérieuses à l’ennemi. Son talent devient Simple."
		desc: "Le talent de la cible devient Simple. Échoue si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Simple, Déclic Tactique, Téramorphose, Absentéisme, Mode Transe ou Supermutation.", // NEEDS QC
		shortDesc: "Le talent de la cible devient Simple.", // NEEDS QC
		gen8: {
			desc: "Le talent de la cible devient Simple. Échoue si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Simple, Déclic Tactique, Absentéisme ou Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "Le talent de la cible devient Simple. Échoue si le talent de la cible est Synergie, Hypersommeil, Fantômasque, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Simple, Déclic Tactique, Absentéisme ou Mode Transe.", // NEEDS QC
		},
		gen6: {
			desc: "Le talent de la cible devient Simple. Échoue si le talent de la cible est Multi-Type, Simple, Déclic Tactique ou Absentéisme.", // NEEDS QC
		},
		gen5: {
			desc: "Le talent de la cible devient Simple. Échoue si le talent de la cible est Multi-Type, Simple ou Absentéisme.", // NEEDS QC
		},
	},
	sing: {
		name: "Berceuse",
		shortDesc: "Endort la cible.", // NEEDS QC
	},
	sinisterarrowraid: {
		name: "Fureur des Plumes Spectrales",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	sizzlyslide: {
		name: "Évo-Flambo",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 100 % de chances de brûler la cible.", // NEEDS QC
		shortDesc: "100 % de brûler la cible.", // NEEDS QC
	},
	sketch: {
		name: "Gribouille",
		// Official flavor text: "Le lanceur apprend la dernière capacité utilisée par la cible. Gribouille disparaît après utilisation."
		desc: "Cette capacité est remplacée définitivement par la dernière capacité utilisée par la cible. La capacité copiée a son maximum de PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, ou si la capacité est Crash Brûlant, Crash Musclé, Trou Noir, Furie Dimension, Crash Magique, Crash Toxique, Second Souffle, Gribouille, Lutte, Pluie Térastrale ou Crash Obscur ou une capacité que l'utilisateur connaît déjà.", // NEEDS QC
		shortDesc: "Copie définitivement la dernière capacité de la cible.", // NEEDS QC
		gen8: {
			desc: "Cette capacité est remplacée définitivement par la dernière capacité utilisée par la cible. La capacité copiée a son maximum de PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, ou si la capacité est Babil, Gribouille ou Lutte ou une capacité que l'utilisateur connaît déjà.", // NEEDS QC
		},
		gen3: {
			desc: "Cette capacité est remplacée définitivement par la dernière capacité utilisée par la cible. La capacité copiée a son maximum de PP. Échoue si la cible n'a pas encore agi, si l'utilisateur s'est transformé, ou si la capacité est Gribouille ou Lutte ou une capacité que l'utilisateur connaît déjà.", // NEEDS QC
		},
		gen2: {
			desc: "Échoue lorsqu'elle est utilisée dans un combat en connexion.", // NEEDS QC
			shortDesc: "Échoue dans un combat en connexion.", // NEEDS QC
		},

		activate: "  {POKEMON} utilise Gribouille pour copier {MOVE} !",
	},
	skillswap: {
		name: "Échange",
		// Official flavor text: "Le lanceur utilise ses pouvoirs psychiques pour échanger son talent avec la cible."
		desc: "L'utilisateur échange son talent avec celui de la cible. Échoue si le talent de l'utilisateur ou de la cible est Osmose Équine, Synergie, Hypersommeil, Commandant, Fantômasque, Force Mémorielle, Déclic Fringale, Tête de Gel, Illusion, Multi-Type, Gaz Inhibiteur, Emprise Toxique, Rassemblement, Paléosynthèse, Charge Quantique, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téra-Carapace, Téramorphose, Téraformation 0, Garde Mystik, Mode Transe ou Supermutation.", // NEEDS QC
		shortDesc: "Échange les talents avec la cible.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur échange son talent avec celui de la cible. Échoue si le talent de l'utilisateur ou de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Déclic Fringale, Tête de Gel, Illusion, Multi-Type, Gaz Inhibiteur, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Garde Mystik ou Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur échange son talent avec celui de la cible. Échoue si le talent de l'utilisateur ou de la cible est Synergie, Hypersommeil, Fantômasque, Illusion, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Garde Mystik ou Mode Transe.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur échange son talent avec celui de la cible. Échoue si le talent de l'utilisateur ou de la cible est Illusion, Multi-Type, Déclic Tactique ou Garde Mystik.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur échange son talent avec celui de la cible. Échoue si le talent de l'utilisateur ou de la cible est Illusion, Multi-Type ou Garde Mystik, ou si les deux ont le même talent.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur échange son talent avec celui de la cible. Échoue si le talent de l'utilisateur ou de la cible est Multi-Type ou Garde Mystik, si les deux ont le même talent, ou si l'un des deux tient une Orbe Platiné.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur échange son talent avec celui de la cible. Échoue si le talent de l'utilisateur ou de la cible est Garde Mystik.", // NEEDS QC
		},

		activate: "  {POKEMON} et sa cible échangent leurs talents !",
	},
	skittersmack: {
		name: "Ravage Rampant",
		// Official flavor text: "Le lanceur rampe derrière l’ennemi pour l’attaquer. Baisse l’Attaque Spéciale de la cible."
		desc: "A 100 % de chances de baisser l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
	},
	skullbash: {
		name: "Coud’Krâne",
		// Official flavor text: "Le lanceur baisse la tête pour augmenter sa Défense au premier tour et percuter l’ennemi au second."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. Monte la Défense de l'utilisateur d'un niveau au premier tour. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "+1 Défense au tour 1, frappe au tour 2.", // NEEDS QC
		gen3: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Au premier tour, la Défense de l'utilisateur monte d'un niveau.", // NEEDS QC
		},
		gen1: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
			shortDesc: "Charge au tour 1. Frappe au tour 2.", // NEEDS QC
		},

		prepare: "{POKEMON} baisse la tête !",
	},
	skyattack: {
		name: "Piqué",
		// Official flavor text: "Une attaque en deux tours au taux de critiques élevé. Peut aussi apeurer l’ennemi."
		desc: "A 30 % de chances d'apeurer la cible et plus de chances de porter un coup critique. Cette attaque se charge au premier tour et s'exécute au second. Si l'utilisateur tient une Herbe Pouvoir, la capacité s'exécute en un tour.", // NEEDS QC
		shortDesc: "Charge, frappe au tour 2. 30 % d'apeurer. Crit. élevé.", // NEEDS QC
		gen3: {
			desc: "A 30 % de chances d'apeurer la cible et plus de chances de porter un coup critique. Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
		},
		gen2: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
			shortDesc: "Charge au tour 1. Frappe au tour 2.", // NEEDS QC
		},

		prepare: "{POKEMON} est entouré d’une lumière intense !",
	},
	skydrop: {
		name: "Chute Libre",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette attaque emporte la cible dans les airs avec l'utilisateur au premier tour et s'exécute au second. Les Pokémon pesant 200 kg ou plus ne peuvent pas être soulevés. Au premier tour, l'utilisateur et la cible évitent toutes les attaques sauf Tornade, Vent Violent, Stratopercut, Anti-Air, Myria-Flèches, Fatal-Foudre et Ouragan. L'utilisateur et la cible ne peuvent pas agir entre les tours, mais la cible peut sélectionner une capacité. Cette capacité ne peut pas blesser les Pokémon de type Vol. Échoue au premier tour si la cible est un allié, si elle a un clone, ou si elle utilise Rebond, Tunnel, Plongée, Vol, Hantise, Revenant ou Chute Libre.", // NEEDS QC
		shortDesc: "Enlève la cible dans les airs, frappe au tour 2.", // NEEDS QC
		gen5: {
			desc: "Cette attaque emporte la cible dans les airs avec l'utilisateur au premier tour et s'exécute au second. Au premier tour, l'utilisateur et la cible évitent toutes les attaques sauf Tornade, Vent Violent, Stratopercut, Anti-Air, Fatal-Foudre et Ouragan. L'utilisateur et la cible ne peuvent pas agir entre les tours, mais la cible peut sélectionner une capacité. Cette capacité ne peut pas blesser les Pokémon de type Vol. Échoue au premier tour si la cible est un allié, si elle a un clone, ou si elle utilise Rebond, Tunnel, Plongée, Vol, Revenant ou Chute Libre. Si l'effet de Gravité met fin à cet effet avant le second tour, l'utilisateur et la cible reviennent au sol ; sinon, la cible reste sous cet effet jusqu'à ce que l'utilisateur quitte le terrain ou exécute avec succès le second tour d'une capacité en deux tours.", // NEEDS QC
		},

		prepare: "{POKEMON} emporte {TARGET} haut dans le ciel !",
		end: "  {POKEMON} est lâché en chute libre !",
		failSelect: "{POKEMON} est en chute libre ! Cette action est impossible !",
		failTooHeavy: "  {POKEMON} est trop lourd pour être emporté !",
	},
	skyuppercut: {
		name: "Stratopercut",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre.", // NEEDS QC
		shortDesc: "Touche même en plein Rebond, Vol ou Chute Libre.", // NEEDS QC
		gen4: {
			desc: "Cette capacité peut toucher une cible utilisant Rebond ou Vol.", // NEEDS QC
			shortDesc: "Touche les cibles utilisant Rebond ou Vol.", // NEEDS QC
		},
	},
	slackoff: {
		name: "Paresse",
		// Official flavor text: "Le lanceur se tourne les pouces et récupère jusqu’à la moitié de ses PV max."
		desc: "L'utilisateur récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	slam: {
		name: "Souplesse",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	slash: {
		name: "Tranche",
		// Official flavor text: "Un coup de griffe ou autre tranche l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	sleeppowder: {
		name: "Poudre Dodo",
		shortDesc: "Endort la cible.", // NEEDS QC
	},
	sleeptalk: {
		name: "Blabla Dodo",
		// Official flavor text: "Le lanceur utilise une de ses capacités au hasard pendant qu’il dort."
		desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, et peut avoir 0 PP. Cette capacité ne peut pas choisir Assistance, Bec-Canon, Éructation, Patience, Crash Brûlant, Célébration, Babil, Crash Musclé, Photocopie, Canon Dynamax, Mitra-Poing, Mains Jointes, Crash Magique, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Crash Toxique, Carapiège, Gribouille, Blabla Dodo, Lutte, Brouhaha ou Crash Obscur ni une capacité en deux tours.", // NEEDS QC
		shortDesc: "Doit dormir. Utilise une autre capacité connue.", // NEEDS QC
		gen8: {
			desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, et peut avoir 0 PP. Cette capacité ne peut pas choisir Assistance, Bec-Canon, Éructation, Patience, Célébration, Babil, Photocopie, Canon Dynamax, Mitra-Poing, Mains Jointes, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Carapiège, Gribouille, Blabla Dodo, Lutte, Brouhaha ni une capacité en deux tours ou une capacité Dynamax.", // NEEDS QC
		},
		gen7: {
			desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, et peut avoir 0 PP. Cette capacité ne peut pas choisir Assistance, Bec-Canon, Éructation, Patience, Célébration, Babil, Photocopie, Mitra-Poing, Mains Jointes, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Carapiège, Gribouille, Blabla Dodo, Lutte, Brouhaha ni une capacité en deux tours ou une capacité Z.", // NEEDS QC
		},
		gen6: {
			desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, et peut avoir 0 PP. Cette capacité ne peut pas choisir Assistance, Éructation, Patience, Célébration, Babil, Photocopie, Mitra-Poing, Mains Jointes, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Gribouille, Blabla Dodo, Lutte, Brouhaha ni une capacité en deux tours.", // NEEDS QC
		},
		gen5: {
			desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, et peut avoir 0 PP. Cette capacité ne peut pas choisir Assistance, Patience, Babil, Photocopie, Mitra-Poing, Moi d’Abord, Métronome, Copie, Mimique, Force Nature, Gribouille, Blabla Dodo, Lutte, Brouhaha ni une capacité en deux tours.", // NEEDS QC
		},
		gen4: {
			desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, et peut avoir 0 PP. Cette capacité ne peut pas choisir Assistance, Patience, Babil, Photocopie, Mitra-Poing, Moi d’Abord, Métronome, Mimique, Blabla Dodo, Brouhaha ni une capacité en deux tours.", // NEEDS QC
		},
		gen3: {
			desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, mais si elle a actuellement 0 PP, elle échoue. Cette capacité ne peut pas choisir Assistance, Patience, Mitra-Poing, Métronome, Mimique, Blabla Dodo, Brouhaha ni une capacité en deux tours.", // NEEDS QC
		},
		gen2: {
			desc: "Une des capacités connues par l'utilisateur, autre que celle-ci, est choisie au hasard et utilisée. Échoue si l'utilisateur ne dort pas. La capacité choisie ne voit pas ses PP déduits, et peut avoir 0 PP. Cette capacité ne peut pas choisir Patience, Blabla Dodo ni une capacité en deux tours.", // NEEDS QC
		},
	},
	sludge: {
		name: "Détritus",
		// Official flavor text: "Des détritus toxiques sont projetés sur l’ennemi. Peut aussi l’empoisonner."
		desc: "A 30 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "30 % d'empoisonner la cible.", // NEEDS QC
		gen1: {
			desc: "A 40 % de chances d'empoisonner la cible.", // NEEDS QC
			shortDesc: "40 % d'empoisonner la cible.", // NEEDS QC
		},
	},
	sludgebomb: {
		name: "Bombe Beurk",
		// Official flavor text: "Des détritus toxiques sont projetés sur l’ennemi. Peut aussi l’empoisonner."
		desc: "A 30 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "30 % d'empoisonner la cible.", // NEEDS QC
	},
	sludgewave: {
		name: "Cradovague",
		// Official flavor text: "Une vague de détritus attaque tous les Pokémon autour du lanceur. Peut aussi empoisonner."
		desc: "A 10 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "10 % d'empoisonner les Pokémon adjacents.", // NEEDS QC
	},
	smackdown: {
		name: "Anti-Air",
		// Official flavor text: "Le lanceur jette toutes sortes de projectiles à un ennemi. Si ce dernier vole, il tombe au sol."
		desc: "Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre. Si elle touche une cible sous l'effet de Rebond, Vol, Vol Magnétik ou Lévikinésie, l'effet prend fin. Si la cible est de type Vol et n'a pas utilisé Atterrissage ce tour, ou a le talent Lévitation, elle perd son immunité aux attaques de type Sol et au talent Piège Sable tant qu'elle reste au combat. Pendant l'effet, Vol Magnétik échoue pour la cible et Lévikinésie échoue contre elle.", // NEEDS QC
		shortDesc: "Retire l'immunité au type Sol de la cible.", // NEEDS QC

		start: "  Touché dans les airs, {POKEMON} s’écrase au sol !",
	},
	smartstrike: {
		name: "Estocorne",
		shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
	},
	smellingsalts: {
		name: "Stimulant",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est doublée si la cible est paralysée. Si l'utilisateur n'est pas K.O., la cible est soignée de sa paralysie.", // NEEDS QC
		shortDesc: "x2 contre les paralysés, mais les soigne.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si la cible est paralysée. Si cette capacité réussit, la cible est soignée de sa paralysie.", // NEEDS QC
		},
		gen3: {
			desc: "Les dégâts sont doublés si la cible est paralysée. Si cette capacité réussit, la cible est soignée de sa paralysie.", // NEEDS QC
			shortDesc: "Dégâts x2 si la cible est paralysée ; la soigne.", // NEEDS QC
		},
	},
	smog: {
		name: "Purédpois",
		// Official flavor text: "Le lanceur attaque à l’aide d’une éruption de gaz répugnants. Peut aussi empoisonner l’ennemi."
		desc: "A 40 % de chances d'empoisonner la cible.", // NEEDS QC
		shortDesc: "40 % d'empoisonner la cible.", // NEEDS QC
	},
	smokescreen: {
		name: "Brouillard",
		// Official flavor text: "Le lanceur disperse un nuage d’encre ou de fumée. Réduit la Précision de l’ennemi."
		desc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la précision de la cible d'un niveau.", // NEEDS QC
	},
	snaptrap: {
		name: "Troquenard",
		// Official flavor text: "Le lanceur piège sa cible dans son Troquenard d’acier et lui inflige des dégâts pendant quatre ou cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},

		start: "  {POKEMON} est tombé dans un Troquenard !",
	},
	snarl: {
		name: "Aboiement",
		// Official flavor text: "Le lanceur hurle sur l’ennemi. Baisse l’Attaque Spéciale de l’ennemi."
		desc: "A 100 % de chances de baisser l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Atq. Spé des ennemis d'un niveau.", // NEEDS QC
	},
	snatch: {
		name: "Saisie",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Si un autre Pokémon utilise certaines capacités sans dégâts ce tour, l'utilisateur les lui vole pour les utiliser lui-même. Si plusieurs Pokémon utilisent une de ces capacités ce tour, elles sont toutes volées par le premier Pokémon dans l'ordre du tour ayant utilisé cette capacité. Cet effet est ignoré tant que l'utilisateur est sous l'effet de Chute Libre.", // NEEDS QC
		shortDesc: "Vole certaines capacités de soutien pour les utiliser.", // NEEDS QC
		gen4: {
			desc: "Si un autre Pokémon utilise certaines capacités sans dégâts ce tour, l'utilisateur les lui vole pour les utiliser lui-même. Si plusieurs Pokémon utilisent cette capacité ce tour, les capacités concernées sont volées par chacun de ces Pokémon dans l'ordre du tour, et seul le dernier dans l'ordre du tour obtient les effets.", // NEEDS QC
		},

		start: "  {POKEMON} attend qu’une cible agisse !",
		activate: "  {POKEMON} saisit la capacité {TARGET:de} !",
	},
	snipeshot: {
		name: "Tir de Précision",
		// Official flavor text: "Le lanceur parvient toujours à viser la cible voulue, en ignorant l’effet des talents et des capacités capables de détourner les attaques."
		desc: "A plus de chances de porter un coup critique. Cette capacité ne peut être redirigée vers une autre cible par aucun effet.", // NEEDS QC
		shortDesc: "Taux de critique élevé. Ne peut être redirigée.", // NEEDS QC
	},
	snore: {
		name: "Ronflement",
		// Official flavor text: "Une attaque qui ne fonctionne que si le lanceur est endormi. Le boucan peut aussi apeurer l’ennemi."
		desc: "A 30 % de chances d'apeurer la cible. Échoue si l'utilisateur ne dort pas.", // NEEDS QC
		shortDesc: "Doit dormir. 30 % d'apeurer la cible.", // NEEDS QC
	},
	snowscape: {
		name: "Chute de Neige",
		// Official flavor text: "Le lanceur invoque une tempête de neige qui dure cinq tours, ce qui augmente la Défense des Pokémon de type Glace."
		desc: "Pendant 5 tours, il neige. Pendant l'effet, la Défense des Pokémon de type Glace est multipliée par 1,5 quand ils subissent une attaque physique. Dure 8 tours si l'utilisateur tient une Roche Glace. Échoue s'il neige déjà.", // NEEDS QC
		shortDesc: "5 tours : neige. Glace : Défense x1,5.", // NEEDS QC
	},
	soak: {
		name: "Détrempage",
		// Official flavor text: "Le lanceur projette beaucoup d’eau sur sa cible, qui devient de type Eau."
		desc: "La cible devient de type Eau. Échoue si la cible est un Arceus ou un Silvallié, si elle est déjà purement de type Eau, ou si elle est téracristallisée.", // NEEDS QC
		shortDesc: "La cible devient de type Eau.", // NEEDS QC
		gen8: {
			desc: "La cible devient de type Eau. Échoue si la cible est un Arceus ou un Silvallié, ou si elle est déjà purement de type Eau.", // NEEDS QC
		},
		gen6: {
			desc: "La cible devient de type Eau. Échoue si la cible est un Arceus, ou si elle est déjà purement de type Eau.", // NEEDS QC
		},
		gen5: {
			desc: "La cible devient de type Eau. Échoue si la cible est un Arceus.", // NEEDS QC
		},
	},
	softboiled: {
		name: "E-Coque",
		// Official flavor text: "Le lanceur récupère jusqu’à la moitié de ses PV max."
		desc: "L'utilisateur récupère la moitié de ses PV max, arrondi au supérieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Le lanceur récupère la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur récupère la moitié de ses PV max, arrondi à l'inférieur. Échoue si (PV max de l'utilisateur − PV actuels + 1) est divisible par 256.", // NEEDS QC
		},
	},
	solarbeam: {
		name: "Lance-Soleil",
		// Official flavor text: "Absorbe la lumière au premier tour et envoie un rayon puissant au tour suivant."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. La puissance est divisée par deux si la météo est Pluie battante, Pluie, la tempête de sable ou la neige et que l'utilisateur ne tient pas de Parapluie Solide. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil intense ou Soleil, la capacité s'exécute en un tour. Si l'utilisateur tient un Parapluie Solide et que la météo est Soleil intense ou Soleil, la capacité nécessite quand même un tour de charge.", // NEEDS QC
		shortDesc: "Charge, frappe au tour 2. Direct au soleil.", // NEEDS QC
		gen8: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. La puissance est divisée par deux si la météo est la grêle, Pluie battante, Pluie ou la tempête de sable et que l'utilisateur ne tient pas de Parapluie Solide. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil intense ou Soleil, la capacité s'exécute en un tour. Si l'utilisateur tient un Parapluie Solide et que la météo est Soleil intense ou Soleil, la capacité nécessite quand même un tour de charge.", // NEEDS QC
		},
		gen7: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. La puissance est divisée par deux si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil intense ou Soleil, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen5: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. La puissance est divisée par deux si la météo est Grêle, Pluie ou Tempête de Sable. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen4: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Les dégâts sont divisés par deux si la météo est Grêle, Pluie ou Tempête de Sable. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen3: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Les dégâts sont divisés par deux si la météo est Grêle, Pluie ou Tempête de Sable. Si la météo est Soleil, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen2: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. Les dégâts sont divisés par deux si la météo est Pluie. Si la météo est Soleil, la capacité s'exécute en un tour.", // NEEDS QC
		},
		gen1: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second.", // NEEDS QC
			shortDesc: "Charge au tour 1. Frappe au tour 2.", // NEEDS QC
		},

		prepare: "  {POKEMON} absorbe la lumière !",
	},
	solarblade: {
		name: "Lame Solaire",
		// Official flavor text: "Le lanceur absorbe la lumière au premier tour et attaque au second tour en libérant cette énergie sous forme de lames."
		desc: "Cette attaque se charge au premier tour et s'exécute au second. La puissance est divisée par deux si la météo est la grêle, Pluie battante, Pluie ou la tempête de sable et que l'utilisateur ne tient pas de Parapluie Solide. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil intense ou Soleil, la capacité s'exécute en un tour. Si l'utilisateur tient un Parapluie Solide et que la météo est Soleil intense ou Soleil, la capacité nécessite quand même un tour de charge.", // NEEDS QC
		shortDesc: "Charge, frappe au tour 2. Direct au soleil.", // NEEDS QC
		gen8: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. La puissance est divisée par deux si la météo est Pluie battante, Pluie, la tempête de sable ou la neige et que l'utilisateur ne tient pas de Parapluie Solide. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil intense ou Soleil, la capacité s'exécute en un tour. Si l'utilisateur tient un Parapluie Solide et que la météo est Soleil intense ou Soleil, la capacité nécessite quand même un tour de charge.", // NEEDS QC
		},
		gen7: {
			desc: "Cette attaque se charge au premier tour et s'exécute au second. La puissance est divisée par deux si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable. Si l'utilisateur tient une Herbe Pouvoir ou que la météo est Soleil intense ou Soleil, la capacité s'exécute en un tour.", // NEEDS QC
		},

		prepare: "#solarbeam",
	},
	sonicboom: {
		name: "Sonic Boom",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Inflige 20 PV de dégâts à la cible.", // NEEDS QC
		shortDesc: "Inflige toujours 20 PV de dégâts.", // NEEDS QC
		gen1: {
			desc: "Inflige 20 PV de dégâts à la cible. Cette capacité ignore l'immunité de type.", // NEEDS QC
		},
	},
	soulstealing7starstrike: {
		name: "Fauche-Âme des Sept Étoiles",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	spacialrend: {
		name: "Spatio-Rift",
		// Official flavor text: "Le lanceur déchire l’ennemi et l’espace autour de lui. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	spark: {
		name: "Étincelle",
		// Official flavor text: "Lance une charge électrique sur l’ennemi. Peut aussi le paralyser."
		desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "30 % de paralyser la cible.", // NEEDS QC
	},
	sparklingaria: {
		name: "Aria de l’Écume",
		// Official flavor text: "Le lanceur émet plusieurs bulles en chantant. Soigne les brûlures des Pokémon touchés par ces bulles."
		desc: "Si l'utilisateur n'est pas K.O., la brûlure de la cible est soignée.", // NEEDS QC
		shortDesc: "Soigne la brûlure de la cible.", // NEEDS QC
	},
	sparklyswirl: {
		name: "Évo-Fabulo",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Tous les Pokémon de l'équipe de l'utilisateur sont soignés de leur problème de statut.", // NEEDS QC
		shortDesc: "Soigne le statut de toute l'équipe du lanceur.", // NEEDS QC
	},
	spectralthief: {
		name: "Clepto-Mânes",
		// Official flavor text: "Le lanceur plonge dans l’ombre de la cible, vole ses augmentations de stats et l’attaque."
		desc: "Les niveaux de statistiques positifs de la cible lui sont volés et appliqués à l'utilisateur avant le calcul des dégâts.", // NEEDS QC
		shortDesc: "Vole les hausses de la cible avant de frapper.", // NEEDS QC

		clearBoost: "  {SOURCE} vole les augmentations de stats !",
	},
	speedswap: {
		name: "Permuvitesse",
		// Official flavor text: "Intervertit la Vitesse du lanceur et celle de la cible."
		desc: "L'utilisateur échange sa statistique de Vitesse avec celle de la cible. Les changements de niveaux ne sont pas affectés.", // NEEDS QC
		shortDesc: "Échange sa Vitesse avec celle de la cible.", // NEEDS QC

		activate: "  {POKEMON} et sa cible échangent leur Vitesse !",
	},
	spicyextract: {
		name: "Habanerage",
		// Official flavor text: "Le lanceur relâche un concentré extrêmement pimenté sur la cible, ce qui augmente beaucoup l'Attaque de celle-ci, mais baisse aussi beaucoup sa Défense."
		desc: "Monte l'Attaque de la cible de 2 niveaux et baisse sa Défense de 2 niveaux.", // NEEDS QC
		shortDesc: "+2 Attaque et -2 Défense de la cible.", // NEEDS QC
	},
	spiderweb: {
		name: "Toile",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Empêche la cible de quitter le combat.", // NEEDS QC
		gen7: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain, sauf s'il utilise Relais, auquel cas la cible reste piégée.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle utilise Relais. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain, sauf s'il utilise Relais, auquel cas la cible reste piégée.", // NEEDS QC
		},
	},
	spikecannon: {
		name: "Picanon",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen4: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux à cinq fois. A 3/8 de chances de frapper deux ou trois fois et 1/8 de chances de frapper quatre ou cinq fois. Les dégâts sont calculés une seule fois pour le premier coup et repris pour chaque coup. Si un des coups brise le clone de la cible, la capacité prend fin.", // NEEDS QC
		},
	},
	spikes: {
		name: "Picots",
		// Official flavor text: "Le lanceur disperse des piquants sur le sol pour blesser tout ennemi qui entre au combat."
		desc: "Pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à trois fois avant d'échouer. Les adversaires perdent 1/8 de leurs PV max avec une couche, 1/6 avec deux couches et 1/4 avec trois couches, arrondi à l'inférieur. Peut être retiré du côté adverse si un Pokémon utilise Grand Nettoyage, ou si un Pokémon adverse utilise Toupie Éclat, Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		shortDesc: "Blesse les ennemis qui entrent au sol. 3 couches max.", // NEEDS QC
		gen8: {
			desc: "Pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à trois fois avant d'échouer. Les adversaires perdent 1/8 de leurs PV max avec une couche, 1/6 avec deux couches et 1/4 avec trois couches, arrondi à l'inférieur. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		},
		gen5: {
			desc: "Pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à trois fois avant d'échouer. Les adversaires perdent 1/8 de leurs PV max avec une couche, 1/6 avec deux couches et 1/4 avec trois couches, arrondi à l'inférieur. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		},
		gen3: {
			desc: "Pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à trois fois avant d'échouer. Les adversaires perdent 1/8 de leurs PV max avec une couche, 1/6 avec deux couches et 1/4 avec trois couches, arrondi à l'inférieur. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide avec succès.", // NEEDS QC
		},
		gen2: {
			desc: "Pose un piège du côté adverse qui fait perdre à chaque Pokémon adverse entrant au combat 1/8 de ses PV max, arrondi à l'inférieur, sauf s'il est de type Vol. Échoue si l'effet est déjà actif du côté adverse. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide avec succès.", // NEEDS QC
			shortDesc: "Blesse les ennemis entrant au combat. 1 couche max.", // NEEDS QC
		},

		start: "  Des picots s’éparpillent autour de {TEAM} !",
		end: "  Il n’y a plus de picots autour de {TEAM} !",
		damage: "  {POKEMON} est blessé par les picots !",
	},
	spikyshield: {
		name: "Pico-Défense",
		// Official flavor text: "Protège des attaques, et diminue les PV de tout attaquant qui entre en contact avec le lanceur."
		desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui le touchent avec une capacité directe perdent 1/8 de leurs PV max, arrondi à l'inférieur. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		shortDesc: "Protège des capacités. Contact : perd 1/8 des PV.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui le touchent avec une capacité directe perdent 1/8 de leurs PV max, arrondi à l'inférieur. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui le touchent avec une capacité directe perdent 1/8 de leurs PV max, arrondi à l'inférieur. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur est protégé de la plupart des attaques des autres Pokémon pendant ce tour, et les Pokémon qui le touchent avec une capacité directe perdent 1/8 de leurs PV max, arrondi à l'inférieur. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et triple à chaque utilisation réussie. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour.", // NEEDS QC
		},

		damage: "  {POKEMON} s’est blessé en attaquant !",
	},
	spinout: {
		name: "Dérapage",
		// Official flavor text: "Le lanceur met tout son poids sur ses pattes et effectue de violentes rotations, ce qui inflige des dégâts à la cible, mais baisse beaucoup la Vitesse du lanceur."
		desc: "Baisse la Vitesse de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse la Vitesse du lanceur de 2 niveaux.", // NEEDS QC
	},
	spiritbreak: {
		name: "Choc Émotionnel",
		// Official flavor text: "Le lanceur attaque son adversaire avec une telle force que ce dernier peut s’en retrouver profondément troublé. Baisse l’Attaque Spéciale de la cible."
		desc: "A 100 % de chances de baisser l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
	},
	spiritshackle: {
		name: "Tisse Ombre",
		// Official flavor text: "Une attaque qui coud l’ennemi à son ombre, ce qui l’empêche de s’enfuir."
		desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Empêche la cible de quitter le combat.", // NEEDS QC
		gen7: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
	},
	spite: {
		name: "Dépit",
		// Official flavor text: "Le lanceur exprime son ressentiment en retirant 4 PP de la dernière capacité de l’ennemi."
		desc: "La dernière capacité utilisée par la cible perd 4 PP. Échoue si la cible n'a pas encore agi, si la capacité a 0 PP, ou si elle ne la connaît plus.", // NEEDS QC
		shortDesc: "Retire 4 PP à la dernière capacité de la cible.", // NEEDS QC
		gen3: {
			desc: "La dernière capacité utilisée par la cible perd de 2 à 5 PP, au hasard. Échoue si la cible n'a pas encore agi, si la capacité a 0 ou 1 PP, ou si elle ne la connaît plus.", // NEEDS QC
			shortDesc: "La dernière capacité de la cible perd 2-5 PP.", // NEEDS QC
		},
		gen2: {
			desc: "La dernière capacité utilisée par la cible perd de 2 à 5 PP, au hasard. Échoue si la cible n'a pas encore agi, ou si la capacité a 0 PP.", // NEEDS QC
		},

		activate: "  Les PP de la capacité {MOVE} {TARGET:de} baissent de {NUMBER} !",
	},
	spitup: {
		name: "Relâche",
		// Official flavor text: "Libère dans une attaque la puissance précédemment accumulée avec Stockage."
		desc: "La puissance est égale à 100 fois le compteur de Stockage de l'utilisateur. Échoue si ce compteur est à 0. Que cette capacité réussisse ou non, la Défense et la Défense Spéciale de l'utilisateur baissent d'autant de niveaux que Stockage les avait montées, et le compteur revient à 0.", // NEEDS QC
		shortDesc: "Plus puissant selon les utilisations de Stockage.", // NEEDS QC
		gen4: {
			desc: "La puissance est égale à 100 fois le compteur de Stockage de l'utilisateur. Cette capacité n'applique pas de variance de dégâts. Échoue si ce compteur est à 0. Sauf s'il n'y a pas de cible, que cette capacité réussisse ou non, la Défense et la Défense Spéciale de l'utilisateur baissent d'autant de niveaux que Stockage les avait montées, et le compteur revient à 0.", // NEEDS QC
		},
		gen3: {
			desc: "Les dégâts sont multipliés par le compteur de Stockage de l'utilisateur. Cette capacité n'applique pas de variance de dégâts et ne peut pas porter de coup critique. Échoue si ce compteur est à 0. Sauf si cette capacité rate, le compteur revient à 0.", // NEEDS QC
		},
	},
	splash: {
		name: "Trempette",
		shortDesc: "Aucune utilité en combat.", // NEEDS QC

		activate: "  Mais rien ne se passe !",
	},
	splinteredstormshards: {
		name: "Hurlement des Roches-Lames",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Met fin aux effets de Champ Électrifié, Champ Herbu, Champ Brumeux et Champ Psychique.", // NEEDS QC
		shortDesc: "Met fin aux effets des champs.", // NEEDS QC
	},
	splishysplash: {
		name: "Pika-Splash",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "30 % de paralyser la cible.", // NEEDS QC
	},
	spore: {
		name: "Spore",
		shortDesc: "Endort la cible.", // NEEDS QC
	},
	spotlight: {
		name: "Projecteur",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Jusqu'à la fin du tour, toutes les attaques à cible unique des adversaires de la cible sont redirigées vers elle. Ces attaques sont redirigées avant de pouvoir être renvoyées par Reflet Magik ou le talent Miroir Magik, ou attirées par les talents Paratonnerre ou Lavabo. Échoue si ce n'est ni un Combat Duo ni un Combat Royal.", // NEEDS QC
		shortDesc: "Les attaques ennemies sont redirigées vers la cible.", // NEEDS QC

		start: "#followme",
		startFromZEffect: "#followme",
	},
	springtidestorm: {
		name: "Typhon Passionné",
		// Official flavor text: "Le lanceur déclenche un violent typhon de haine et d'amour qui s'abat sur la cible. Peut baisser l'Attaque de celle-ci."
		desc: "A 30 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "30 % de baisser l'Attaque des ennemis d'un niveau.", // NEEDS QC
	},
	stealthrock: {
		name: "Piège de Roc",
		// Official flavor text: "Lance des pierres flottantes autour de l’ennemi, qui blessent tout adversaire entrant au combat."
		desc: "Pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat. Échoue si l'effet est déjà actif du côté adverse. Les adversaires perdent 1/32, 1/16, 1/8, 1/4 ou 1/2 de leurs PV max, arrondi à l'inférieur, selon leur faiblesse au type Roche (0,25x, 0,5x, neutre, 2x ou 4x respectivement). Peut être retiré du côté adverse si un Pokémon utilise Grand Nettoyage, ou si un Pokémon adverse utilise Toupie Éclat, Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		shortDesc: "Blesse les ennemis entrants selon leur faiblesse Roche.", // NEEDS QC
		gen8: {
			desc: "Pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat. Échoue si l'effet est déjà actif du côté adverse. Les adversaires perdent 1/32, 1/16, 1/8, 1/4 ou 1/2 de leurs PV max, arrondi à l'inférieur, selon leur faiblesse au type Roche (0,25x, 0,5x, neutre, 2x ou 4x respectivement). Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		},
		gen5: {
			desc: "Pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat. Échoue si l'effet est déjà actif du côté adverse. Les adversaires perdent 1/32, 1/16, 1/8, 1/4 ou 1/2 de leurs PV max, arrondi à l'inférieur, selon leur faiblesse au type Roche (0,25x, 0,5x, neutre, 2x ou 4x respectivement). Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		},

		start: "  Des pierres pointues lévitent autour de {TEAM} !",
		end: "  Les pierres pointues autour de {TEAM} ont disparu !",
		damage: "  Des pierres pointues transpercent {POKEMON} !",
	},
	steameruption: {
		name: "Jet de Vapeur",
		// Official flavor text: "Plonge l’ennemi dans une chaleur étouffante. Peut le brûler."
		desc: "A 30 % de chances de brûler la cible. La cible est dégelée si elle était gelée.", // NEEDS QC
		shortDesc: "30 % de brûler. Dégèle la cible.", // NEEDS QC
	},
	steamroller: {
		name: "Bulldoboule",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 30 % de chances d'apeurer la cible. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		gen5: {
			desc: "A 30 % de chances d'apeurer la cible. Les dégâts sont doublés si la cible a utilisé Lilliput depuis qu'elle est au combat.", // NEEDS QC
		},
	},
	steelbeam: {
		name: "Métalaser",
		// Official flavor text: "Le lanceur concentre du métal issu de tout son corps en un rayon qu’il projette violemment sur sa cible. Il subit aussi des dégâts."
		desc: "Que cette capacité réussisse ou non, et même si cela le met K.O., l'utilisateur perd la moitié de ses PV max, arrondi au supérieur, sauf s'il a le talent Garde Magik.", // NEEDS QC
		shortDesc: "Le lanceur perd la moitié de ses PV max.", // NEEDS QC

		damage: "#mindblown",
	},
	steelroller: {
		name: "Métalliroue",
		// Official flavor text: "Une attaque qui inflige des dégâts et fait disparaître le champ actif, mais qui échoue s’il n’y en a pas à ce moment."
		desc: "Échoue si aucun champ n'est actif. Met fin aux effets de Champ Électrifié, Champ Herbu, Champ Brumeux et Champ Psychique.", // NEEDS QC
		shortDesc: "Échoue sans champ actif. Met fin au champ.", // NEEDS QC
	},
	steelwing: {
		name: "Ailes d’Acier",
		// Official flavor text: "Le lanceur frappe l’ennemi avec des ailes d’acier. Peut aussi augmenter la Défense du lanceur."
		desc: "A 10 % de chances de monter la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "10 % de monter la Défense du lanceur d'un niveau.", // NEEDS QC
	},
	stickyweb: {
		name: "Toile Gluante",
		// Official flavor text: "Déploie une toile visqueuse autour de l’ennemi qui ralentit la Vitesse de tout adversaire entrant au combat."
		desc: "Pose un piège du côté adverse qui baisse d'un niveau la Vitesse de chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Échoue si l'effet est déjà actif du côté adverse. Peut être retiré du côté adverse si un Pokémon utilise Grand Nettoyage, ou si un Pokémon adverse utilise Toupie Éclat, Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		shortDesc: "-1 Vitesse aux ennemis qui entrent au sol.", // NEEDS QC
		gen8: {
			desc: "Pose un piège du côté adverse qui baisse d'un niveau la Vitesse de chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Échoue si l'effet est déjà actif du côté adverse. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		},

		start: "  Le terrain est couvert d’une toile gluante du côté de {TEAM} !",
		end: "  La toile gluante du côté de {TEAM} a disparu !",
		activate: "  {POKEMON} est pris dans une toile gluante !",
	},
	stockpile: {
		name: "Stockage",
		// Official flavor text: "Le lanceur accumule de la puissance et augmente sa Défense et sa Défense Spéciale. Peut être utilisée trois fois."
		desc: "Monte la Défense et la Défense Spéciale de l'utilisateur d'un niveau. Le compteur de Stockage de l'utilisateur augmente de 1. Échoue si ce compteur est à 3. Le compteur revient à 0 quand l'utilisateur quitte le combat.", // NEEDS QC
		shortDesc: "+1 Déf et Déf. Spé. Se cumule jusqu'à 3 fois.", // NEEDS QC
		gen3: {
			desc: "Le compteur de Stockage de l'utilisateur augmente de 1. Échoue si ce compteur est à 3. Le compteur revient à 0 quand l'utilisateur quitte le combat.", // NEEDS QC
			shortDesc: "Compteur de Stockage +1. 3 fois max.", // NEEDS QC
		},

		start: "  {POKEMON} utilise la capacité Stockage {NUMBER} fois !",
		end: "  Les effets accumulés par {POKEMON} se dissipent !",
	},
	stokedsparksurfer: {
		name: "Électro-Surf Survolté",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 100 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "100 % de paralyser la cible.", // NEEDS QC
	},
	stomp: {
		name: "Écrasement",
		// Official flavor text: "Écrase l’ennemi avec un énorme pied. Peut aussi l’apeurer."
		desc: "A 30 % de chances d'apeurer la cible. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
		gen5: {
			desc: "A 30 % de chances d'apeurer la cible. Les dégâts sont doublés si la cible a utilisé Lilliput depuis qu'elle est au combat.", // NEEDS QC
		},
		gen4: {
			desc: "A 30 % de chances d'apeurer la cible. La puissance est doublée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		},
		gen3: {
			desc: "A 30 % de chances d'apeurer la cible. Les dégâts sont doublés si la cible a utilisé Lilliput depuis qu'elle est au combat.", // NEEDS QC
		},
		gen2: {
			desc: "A 30 % de chances d'apeurer la cible. La puissance est doublée si la cible est sous l'effet de Lilliput.", // NEEDS QC
		},
		gen1: {
			desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		},
	},
	stompingtantrum: {
		name: "Trépignement",
		// Official flavor text: "Le lanceur attaque en utilisant sa frustration. S’il a utilisé une capacité qui a échoué au tour précédent, la puissance de Trépignement est doublée."
		desc: "La puissance est doublée si la dernière capacité de l'utilisateur au tour précédent, y compris les capacités appelées par d'autres capacités ou utilisées via Sommation, Reflet Magik, Saisie ou les talents Danseuse ou Miroir Magik, a échoué dans tous ses effets normaux — sans compter les dégâts d'un Pied Voltige, Pied Sauté ou Caboche-Kaboum raté — ou si l'utilisateur a été empêché d'agir par un effet autre que le rechargement ou Chute Libre. Une capacité bloquée par Blockhaus, Détection, Bouclier Royal, Abri, Pico-Défense, Vigilance, Tatamigaeshi, Prévention ou Garde Large ne double pas la puissance de cette capacité, pas plus qu'un Rebond ou un Vol interrompu par l'effet de Gravité, Anti-Air ou Myria-Flèches.", // NEEDS QC
		shortDesc: "Puissance doublée si sa dernière capacité a raté.", // NEEDS QC
	},
	stoneaxe: {
		name: "Hache de Pierre",
		// Official flavor text: "Le lanceur attaque le point faible de sa cible avec sa hache de pierre. Les débris de pierre se mettent alors à flotter autour de la cible."
		desc: "Si cette capacité réussit, elle pose un piège du côté adverse qui blesse chaque Pokémon adverse entrant au combat. Les adversaires perdent 1/32, 1/16, 1/8, 1/4 ou 1/2 de leurs PV max, arrondi à l'inférieur, selon leur faiblesse au type Roche (0,25x, 0,5x, neutre, 2x ou 4x respectivement). Peut être retiré du côté adverse si un Pokémon utilise Grand Nettoyage, ou si un Pokémon adverse utilise Toupie Éclat, Tour Rapide ou Anti-Brume avec succès, ou est touché par Anti-Brume.", // NEEDS QC
		shortDesc: "Pose Piège de Roc du côté adverse.", // NEEDS QC
	},
	stoneedge: {
		name: "Lame de Roc",
		// Official flavor text: "Fait surgir des pierres aiguisées sous l’ennemi. Taux de critiques élevé."
		desc: "A plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Taux de critique élevé.", // NEEDS QC
	},
	storedpower: {
		name: "Force Ajoutée",
		// Official flavor text: "Le lanceur attaque l’ennemi avec une force accumulée. Plus les stats du lanceur sont augmentées, plus le coup est efficace."
		desc: "La puissance est égale à 20 + (X × 20), où X est le total des changements de niveaux de statistiques positifs de l'utilisateur.", // NEEDS QC
		shortDesc: "+20 de puissance par hausse de stat du lanceur.", // NEEDS QC
	},
	stormthrow: {
		name: "Yama Arashi",
		// Official flavor text: "Un coup très puissant dont l’effet est toujours critique."
		desc: "Cette capacité porte toujours un coup critique, sauf si la cible est sous l'effet de Air Veinard ou a le talent Armurbaston ou Coque Armure.", // NEEDS QC
		shortDesc: "Porte toujours un coup critique.", // NEEDS QC
	},
	strangesteam: {
		name: "Vapeur Féérique",
		// Official flavor text: "Le lanceur émet de la vapeur pour attaquer sa cible. Peut aussi la rendre confuse."
		desc: "A 20 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "20 % de rendre la cible confuse.", // NEEDS QC
	},
	strength: {
		name: "Force",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	strengthsap: {
		name: "Vole-Force",
		// Official flavor text: "Rend au lanceur une quantité de PV équivalente à la stat d’Attaque de la cible, puis baisse celle-ci."
		desc: "Baisse l'Attaque de la cible d'un niveau. L'utilisateur récupère des PV égaux à l'Attaque de la cible calculée avec son niveau de statistique d'avant l'utilisation. Si l'utilisateur tient une Grosse Racine, les PV récupérés sont multipliés par 1,3, arrondi à l'inférieur à partir de 0,5. Échoue si le niveau d'Attaque de la cible est à -6.", // NEEDS QC
		shortDesc: "Récupère des PV égaux à l'Attaque de la cible ; -1 Atq.", // NEEDS QC
	},
	stringshot: {
		name: "Sécrétion",
		// Official flavor text: "Le lanceur crache de la soie pour ligoter l’ennemi et beaucoup baisser sa Vitesse."
		desc: "Baisse la Vitesse de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse la Vitesse des ennemis de 2 niveaux.", // NEEDS QC
		gen5: {
			desc: "Baisse la Vitesse de la cible d'un niveau.", // NEEDS QC
			shortDesc: "Baisse la Vitesse des ennemis d'un niveau.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Baisse la Vitesse de la cible d'un niveau.", // NEEDS QC
		},
	},
	struggle: {
		name: "Lutte",
		// Official flavor text: "Une attaque désespérée, utilisée quand le lanceur n’a plus de PP. Le blesse aussi légèrement."
		desc: "Inflige des dégâts sans type à un Pokémon adverse au hasard. Si cette capacité réussit, l'utilisateur perd 1/4 de ses PV max, arrondi au supérieur à partir de 0,5, et le talent Tête de Roc ne l'empêche pas. Cette capacité est utilisée automatiquement si aucune des capacités connues par l'utilisateur ne peut être sélectionnée.", // NEEDS QC
		shortDesc: "Le lanceur perd 1/4 de ses PV max.", // NEEDS QC
		gen6: {
			desc: "Inflige des dégâts sans type à un Pokémon adverse adjacent au hasard. Si cette capacité réussit, l'utilisateur perd 1/4 de ses PV max, arrondi au supérieur à partir de 0,5, et le talent Tête de Roc ne l'empêche pas. Cette capacité est utilisée automatiquement si aucune des capacités connues par l'utilisateur ne peut être sélectionnée.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige des dégâts sans type à un Pokémon adverse au hasard. Si cette capacité réussit, l'utilisateur perd 1/4 de ses PV max, arrondi à l'inférieur, et le talent Tête de Roc ne l'empêche pas. Cette capacité est utilisée automatiquement si aucune des capacités connues par l'utilisateur ne peut être sélectionnée.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige des dégâts sans type à un Pokémon adverse au hasard. Si cette capacité réussit, l'utilisateur subit des dégâts égaux à 1/4 des PV perdus par la cible, arrondi à l'inférieur, avec un minimum de 1 PV, et le talent Tête de Roc ne l'empêche pas. Cette capacité est utilisée automatiquement si aucune des capacités connues par l'utilisateur ne peut être sélectionnée.", // NEEDS QC
			shortDesc: "L'utilisateur perd 1/4 des PV perdus par la cible.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige des dégâts sans type. Si cette capacité réussit, l'utilisateur subit des dégâts égaux à 1/4 des PV perdus par la cible, arrondi à l'inférieur, avec un minimum de 1 PV. Cette capacité est utilisée automatiquement si aucune des capacités connues par l'utilisateur ne peut être sélectionnée.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige des dégâts de type Normal. Si cette capacité réussit, l'utilisateur subit des dégâts égaux à 1/2 des PV perdus par la cible, arrondi à l'inférieur, avec un minimum de 1 PV. Cette capacité est utilisée automatiquement si aucune des capacités connues par l'utilisateur ne peut être sélectionnée.", // NEEDS QC
			shortDesc: "L'utilisateur perd 1/2 des PV perdus par la cible.", // NEEDS QC
		},
	},
	strugglebug: {
		name: "Survinsecte",
		// Official flavor text: "Le lanceur se débat de toutes ses forces, et baisse l’Attaque Spéciale de l’ennemi."
		desc: "A 100 % de chances de baisser l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Atq. Spé des ennemis d'un niveau.", // NEEDS QC
	},
	stuffcheeks: {
		name: "Garde-à-Joues",
		// Official flavor text: "Le lanceur mange la Baie qu’il tient, ce qui augmente beaucoup sa Défense."
		desc: "Cette capacité ne peut être sélectionnée que si l'utilisateur tient une Baie. L'utilisateur mange sa Baie et monte sa Défense de 2 niveaux. Cet effet n'est pas empêché par les talents Maladresse ou Tension, ni par les effets d'Embargo ou de Zone Magique. Échoue si l'utilisateur ne tient pas de Baie.", // NEEDS QC
		shortDesc: "Mange sa Baie tenue et monte sa Défense de 2 niveaux.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	stunspore: {
		name: "Para-Spore",
		// Official flavor text: "Le lanceur répand sur l’ennemi une poudre qui le paralyse."
		desc: "Paralyse la cible.", // NEEDS QC
		shortDesc: "Paralyse la cible.", // NEEDS QC
		gen3: {
			desc: "Paralyse la cible. Cette capacité n'ignore pas l'immunité de type.", // NEEDS QC
		},
		gen1: {
			desc: "Paralyse la cible.", // NEEDS QC
		},
	},
	submission: {
		name: "Sacrifice",
		// Official flavor text: "Le lanceur agrippe l’ennemi et l’écrase au sol. Blesse aussi légèrement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 1/4 des dégâts.", // NEEDS QC
		gen4: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		},
		gen2: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV. Si cette capacité touche un clone, le contrecoup est toujours de 1 PV.", // NEEDS QC
		},
		gen1: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/4 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV. Si cette capacité brise le clone de la cible, l'utilisateur ne subit aucun contrecoup.", // NEEDS QC
		},
	},
	substitute: {
		name: "Clonage",
		// Official flavor text: "Le lanceur crée un clone en sacrifiant quelques PV. Ce clone sert de leurre."
		desc: "L'utilisateur sacrifie 1/4 de ses PV max, arrondi à l'inférieur, pour créer un clone qui le remplace au combat. Le clone disparaît quand il a subi assez de dégâts, si l'utilisateur quitte le combat ou est mis K.O., ou si un Pokémon utilise Grand Nettoyage. Relais peut transmettre le clone à un allié, avec ses PV restants. Tant que le clone n'est pas brisé, il subit les dégâts de toutes les attaques des autres Pokémon et protège l'utilisateur des effets de statut et des changements de niveaux causés par les autres Pokémon. Les capacités sonores et les Pokémon ayant le talent Infiltration ignorent les clones. L'utilisateur subit normalement les dégâts de la météo et des statuts derrière son clone. Si le clone se brise pendant une capacité frappant plusieurs fois, l'utilisateur subit les dégâts des coups restants. Si un clone est créé pendant que l'utilisateur est piégé par une capacité de piégeage, cet effet prend fin immédiatement. Échoue si l'utilisateur n'a pas assez de PV pour créer un clone sans être mis K.O., ou s'il a déjà un clone.", // NEEDS QC
		shortDesc: "Dépense 1/4 de ses PV pour créer un clone.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur sacrifie 1/4 de ses PV max, arrondi à l'inférieur, pour créer un clone qui le remplace au combat. Le clone disparaît quand il a subi assez de dégâts, ou si l'utilisateur quitte le combat ou est mis K.O. Relais peut transmettre le clone à un allié, avec ses PV restants. Tant que le clone n'est pas brisé, il subit les dégâts de toutes les attaques des autres Pokémon et protège l'utilisateur des effets de statut et des changements de niveaux causés par les autres Pokémon. Les capacités sonores et les Pokémon ayant le talent Infiltration ignorent les clones. L'utilisateur subit normalement les dégâts de la météo et des statuts derrière son clone. Si le clone se brise pendant une capacité frappant plusieurs fois, l'utilisateur subit les dégâts des coups restants. Si un clone est créé pendant que l'utilisateur est piégé par une capacité de piégeage, cet effet prend fin immédiatement. Échoue si l'utilisateur n'a pas assez de PV pour créer un clone sans être mis K.O., ou s'il a déjà un clone.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur sacrifie 1/4 de ses PV max, arrondi à l'inférieur, pour créer un clone qui le remplace au combat. Le clone disparaît quand il a subi assez de dégâts, ou si l'utilisateur quitte le combat ou est mis K.O. Relais peut transmettre le clone à un allié, avec ses PV restants. Tant que le clone n'est pas brisé, il subit les dégâts de toutes les attaques des autres Pokémon et protège l'utilisateur des effets de statut et des changements de niveaux causés par les autres Pokémon. L'utilisateur subit normalement les dégâts de la météo et des statuts derrière son clone. Si le clone se brise pendant une capacité frappant plusieurs fois, l'utilisateur subit les dégâts des coups restants. Si un clone est créé pendant que l'utilisateur est piégé par une capacité de piégeage, cet effet prend fin immédiatement. Échoue si l'utilisateur n'a pas assez de PV pour créer un clone sans être mis K.O., ou s'il a déjà un clone.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur sacrifie 1/4 de ses PV max, arrondi à l'inférieur, pour créer un clone qui le remplace au combat. Le clone a 1 PV plus les PV utilisés pour le créer, et disparaît quand il a subi assez de dégâts ou 255 dégâts d'un coup, ou si l'utilisateur quitte le combat ou est mis K.O. Tant que le clone n'est pas brisé, il subit les dégâts de toutes les attaques du Pokémon adverse et protège l'utilisateur des effets de statut et des changements de niveaux causés par l'adversaire, sauf si l'effet est Entrave, Vampigraine, le sommeil, la paralysie en effet principal ou la confusion en effet secondaire et que le clone de l'utilisateur n'a pas été brisé. L'utilisateur subit normalement les dégâts des statuts derrière son clone, sauf les dégâts de confusion, qui sont infligés au clone du Pokémon adverse à la place. Si le clone se brise pendant une capacité frappant plusieurs fois, l'attaque prend fin. Échoue si l'utilisateur n'a pas assez de PV pour créer un clone, ou s'il a déjà un clone. L'utilisateur crée un clone puis est mis K.O. si ses PV actuels sont exactement 1/4 de ses PV max.", // NEEDS QC
			shortDesc: "Sacrifie 1/4 de ses PV max pour créer un clone.", // NEEDS QC
		},

		start: "  {POKEMON} crée un clone !",
		alreadyStarted: "  {POKEMON} a déjà un clone !",
		end: "  Le clone {POKEMON:de} disparaît...",
		fail: "  Mais il est trop faible pour créer un clone !",
		activate: "  Le clone subit l’attaque à la place {POKEMON:de} !",
	},
	subzeroslammer: {
		name: "Laser Cryogénique",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	suckerpunch: {
		name: "Coup Bas",
		// Official flavor text: "Permet au lanceur de frapper en priorité. Échoue si l’ennemi ne prépare pas une attaque."
		desc: "Échoue si la cible n'a pas choisi une attaque physique, une attaque spéciale ou Moi d’Abord ce tour, ou si elle agit avant l'utilisateur.", // NEEDS QC
		shortDesc: "Va en premier. Échoue si la cible n'attaque pas.", // NEEDS QC
		gen4: {
			desc: "Échoue si la cible n'a pas choisi une attaque physique ou spéciale ce tour, ou si elle agit avant l'utilisateur.", // NEEDS QC
		},
	},
	sunnyday: {
		name: "Zénith",
		// Official flavor text: "Fait briller le soleil pendant cinq tours, augmentant la puissance des capacités de type Feu et baissant celle des capacités de type Eau."
		desc: "Pendant 5 tours, la météo devient Soleil. Pendant l'effet, les dégâts des attaques de type Feu sont multipliés par 1,5 et ceux des attaques de type Eau par 0,5. Dure 8 tours si l'utilisateur tient une Roche Chaude. Échoue si la météo actuelle est déjà Soleil.", // NEEDS QC
		shortDesc: "5 tours : le soleil renforce les capacités Feu.", // NEEDS QC
		gen3: {
			desc: "Pendant 5 tours, la météo devient Soleil. Pendant l'effet, les dégâts des attaques de type Feu sont multipliés par 1,5 et ceux des attaques de type Eau par 0,5. Échoue si la météo actuelle est déjà Soleil.", // NEEDS QC
		},
		gen2: {
			desc: "Pendant 5 tours, la météo devient Soleil, même si la météo actuelle est déjà Soleil. Pendant l'effet, les dégâts des attaques de type Feu sont multipliés par 1,5 et ceux des attaques de type Eau par 0,5.", // NEEDS QC
		},
	},
	sunsteelstrike: {
		name: "Choc Météore",
		// Official flavor text: "Le lanceur fonce sur la cible à la vitesse d’une météorite. Ignore le talent de l’ennemi."
		desc: "Cette capacité et ses effets ignorent les talents des autres Pokémon.", // NEEDS QC
		shortDesc: "Ignore les talents des autres Pokémon.", // NEEDS QC
	},
	supercellslam: {
		name: "Volt Assaut",
		// Official flavor text: "Le lanceur se charge en électricité et fond sur la cible. S'il échoue, le lanceur se blesse."
		desc: "Si cette attaque échoue, l'utilisateur perd la moitié de ses PV max, arrondi à l'inférieur, en dégâts d'échec. Les Pokémon ayant le talent Garde Magik ne subissent pas les dégâts d'échec. Les dégâts sont doublés et la précision n'est pas vérifiée si la cible a utilisé Lilliput depuis son entrée au combat.", // NEEDS QC
		shortDesc: "S'il rate, le lanceur perd la moitié de ses PV max.", // NEEDS QC

		damage: "#crash",
	},
	superfang: {
		name: "Croc Fatal",
		// Official flavor text: "Une vilaine morsure d’incisives qui réduit de moitié les PV de l’ennemi."
		desc: "Inflige à la cible des dégâts égaux à la moitié de ses PV actuels, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Inflige la moitié des PV actuels de la cible.", // NEEDS QC
		gen1: {
			desc: "Inflige à la cible des dégâts égaux à la moitié de ses PV actuels, arrondi à l'inférieur, avec un minimum de 1 PV. Cette capacité ignore l'immunité de type.", // NEEDS QC
			shortDesc: "Dégâts = 1/2 des PV actuels. Touche les Spectres.", // NEEDS QC
		},
	},
	superpower: {
		name: "Surpuissance",
		// Official flavor text: "Une attaque puissante, mais qui baisse l’Attaque et la Défense du lanceur."
		desc: "Baisse l'Attaque et la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Attaque et la Défense du lanceur d'un niveau.", // NEEDS QC
	},
	supersonic: {
		name: "Ultrason",
		shortDesc: "Rend la cible confuse.", // NEEDS QC
	},
	supersonicskystrike: {
		name: "Piqué Supersonique",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	surf: {
		name: "Surf",
		// Official flavor text: "Une énorme vague s’abat sur le champ de bataille et inflige des dégâts à tous les Pokémon autour du lanceur."
		desc: "Les dégâts sont doublés si la cible utilise Plongée.", // NEEDS QC
		shortDesc: "Touche les adjacents. Dégâts x2 contre Plongée.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si la cible utilise Plongée.", // NEEDS QC
			shortDesc: "Touche les Pokémon adjacents. x2 contre Plongée.", // NEEDS QC
		},
		gen2: {
			desc: "Aucun effet supplémentaire.", // NEEDS QC
			shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Touche les ennemis. x2 contre Plongée.", // NEEDS QC
		},
	},
	surgingstrikes: {
		name: "Torrent de Coups",
		// Official flavor text: "Le lanceur assène trois coups fluides à l’ennemi. Cette technique qui inflige toujours un coup critique est réservée à ceux qui maîtrisent la puissance de l’Eau."
		desc: "Frappe trois fois. Cette capacité porte toujours un coup critique, sauf si la cible est sous l'effet de Air Veinard ou a le talent Armurbaston ou Coque Armure.", // NEEDS QC
		shortDesc: "Frappe 3 fois. Toujours des coups critiques.", // NEEDS QC
	},
	swagger: {
		name: "Vantardise",
		// Official flavor text: "Fait enrager la cible et la plonge dans la confusion, mais augmente beaucoup son Attaque."
		desc: "Monte l'Attaque de la cible de 2 niveaux et la rend confuse.", // NEEDS QC
		shortDesc: "+2 Attaque de la cible et la rend confuse.", // NEEDS QC
		gen2: {
			desc: "Monte l'Attaque de la cible de 2 niveaux et la rend confuse. Cette capacité rate si l'Attaque de la cible ne peut pas être montée.", // NEEDS QC
		},
	},
	swallow: {
		name: "Avale",
		// Official flavor text: "Le lanceur absorbe la puissance accumulée avec Stockage pour restaurer ses PV."
		desc: "L'utilisateur récupère des PV selon son compteur de Stockage : 1/4 de ses PV max s'il est à 1, la moitié s'il est à 2, arrondi à l'inférieur à partir de 0,5, et tous ses PV s'il est à 3. Échoue si le compteur est à 0. La Défense et la Défense Spéciale de l'utilisateur baissent d'autant de niveaux que Stockage les avait montées, et le compteur revient à 0.", // NEEDS QC
		shortDesc: "Se soigne selon les utilisations de Stockage.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur récupère des PV selon son compteur de Stockage : 1/4 de ses PV max s'il est à 1, la moitié s'il est à 2, arrondi à l'inférieur, et tous ses PV s'il est à 3. Échoue si le compteur est à 0. La Défense et la Défense Spéciale de l'utilisateur baissent d'autant de niveaux que Stockage les avait montées, et le compteur revient à 0.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur récupère des PV selon son compteur de Stockage : 1/4 de ses PV max s'il est à 1, la moitié s'il est à 2, arrondi à l'inférieur à partir de 0,5, et tous ses PV s'il est à 3. Échoue si le compteur est à 0. Le compteur revient à 0.", // NEEDS QC
		},
	},
	sweetkiss: {
		name: "Doux Baiser",
		shortDesc: "Rend la cible confuse.", // NEEDS QC
	},
	sweetscent: {
		name: "Doux Parfum",
		// Official flavor text: "Un doux parfum qui réduit beaucoup l’Esquive de l’ennemi."
		desc: "Baisse l'esquive de la cible de 2 niveaux.", // NEEDS QC
		shortDesc: "Baisse l'esquive des ennemis de 2 niveaux.", // NEEDS QC
		gen5: {
			desc: "Baisse l'esquive de la cible d'un niveau.", // NEEDS QC
			shortDesc: "Baisse l'esquive des ennemis d'un niveau.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Baisse l'esquive de la cible d'un niveau.", // NEEDS QC
		},
	},
	swift: {
		name: "Météores",
		// Official flavor text: "Le lanceur envoie des rayons d’étoiles. Touche toujours l’ennemi."
		desc: "Cette capacité ne vérifie pas la précision.", // NEEDS QC
		shortDesc: "Ne vérifie pas la précision. Touche les ennemis.", // NEEDS QC
		gen1: {
			desc: "Cette capacité ne vérifie pas la précision et touche même une cible utilisant Tunnel ou Vol.", // NEEDS QC
			shortDesc: "Ne rate jamais, même contre Tunnel et Vol.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Ne vérifie pas la précision.", // NEEDS QC
		},
	},
	switcheroo: {
		name: "Passe-Passe",
		// Official flavor text: "Le lanceur échange son objet avec celui de la cible à une vitesse que l’œil a du mal à suivre."
		desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, ou si l'utilisateur essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Globe Adamant, un Globe Perlé, un Globe Platiné, une plaque, un module, une ROM, une Épée Rouillée, un Bouclier Rouillé, une Énergie Booster ou un masque à ou d'un Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, Pokémon Paradoxe ou Ogerpon, respectivement. Dans ce cas, les Pokémon Paradoxe incluent toutes les espèces ayant les talents Paléosynthèse et Charge Quantique, sauf Feu-Perçant, Ire-Foudre, Roc-de-Fer et Chef-de-Fer. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		shortDesc: "Échange son objet avec celui de la cible.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, ou si l'utilisateur essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Orbe Platiné, une plaque, un module, une ROM, une Épée Rouillée ou un Bouclier Rouillé à ou d'un Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, Zacian ou Zamazenta, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'un des deux tient un Cristal Z, si l'utilisateur essaie de donner ou de prendre une Méga-Gemme à ou de l'espèce pouvant méga-évoluer avec, ou s'il essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Orbe Platiné, une plaque, un module ou une ROM à ou d'un Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvallié, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'utilisateur essaie de donner ou de prendre une Méga-Gemme à ou de l'espèce pouvant méga-évoluer avec, ou s'il essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Orbe Platiné, une plaque ou un module à ou d'un Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'un des deux tient une Lettre, ou si l'utilisateur essaie de donner ou de prendre un Orbe Platiné, une plaque ou un module à ou d'un Giratina, Arceus ou Genesect, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'un des deux tient une Lettre ou un Orbe Platiné, si l'un des deux a le talent Multi-Type, si l'un des deux est sous l'effet de Sabotage, ou si la cible a le talent Glu.", // NEEDS QC
		},

		activate: "#trick",
	},
	swordsdance: {
		name: "Danse Lames",
		// Official flavor text: "Une danse frénétique qui exalte l’esprit combatif. Augmente beaucoup l’Attaque du lanceur."
		desc: "Monte l'Attaque de l'utilisateur de 2 niveaux.", // NEEDS QC
		shortDesc: "Monte l'Attaque du lanceur de 2 niveaux.", // NEEDS QC
	},
	synchronoise: {
		name: "Synchropeine",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La cible est immunisée si elle ne partage aucun type avec l'utilisateur.", // NEEDS QC
		shortDesc: "Touche les adjacents qui partagent son type.", // NEEDS QC
	},
	synthesis: {
		name: "Synthèse",
		// Official flavor text: "Un soin qui restaure des PV au lanceur. Son efficacité varie en fonction de la météo."
		desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif, s'il n'y a aucune météo ou s'il tient un Parapluie Solide ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Pluie battante, Pluie, la tempête de sable ou la neige, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		shortDesc: "Soigne le lanceur selon la météo.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif, s'il n'y a aucune météo ou s'il tient un Parapluie Solide ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur récupère la moitié de ses PV max si Vent mystérieux est actif ou s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil intense ou Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie battante, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur à partir de 0,5.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; 2/3 de ses PV max si la météo est Soleil ; et 1/4 de ses PV max si la météo est Grêle, Pluie ou Tempête de Sable, le tout arrondi à l'inférieur.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur récupère la moitié de ses PV max s'il n'y a aucune météo ; tous ses PV si la météo est Soleil ; et 1/4 de ses PV max si la météo est Pluie ou Tempête de Sable, le tout arrondi à l'inférieur.", // NEEDS QC
		},
	},
	syrupbomb: {
		name: "Bombe au Sirop",
		// Official flavor text: "Le lanceur jette une bombe qui recouvre la cible de sirop gluant et fait progressivement baisser la Vitesse de la cible pendant trois tours."
		desc: "Si cette capacité réussit, la Vitesse de la cible baisse d'un niveau à la fin de chaque tour pendant 3 tours.", // NEEDS QC
		shortDesc: "-1 Vitesse de la cible chaque tour pendant 3 tours.", // NEEDS QC

		start: "  {POKEMON} est recouvert de sirop !",
	},
	tackle: {
		name: "Charge",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	tachyoncutter: {
		name: "Lame Tachyonique",
		// Official flavor text: "Le lanceur concentre des particules élémentaires pour créer une lame qui inflige des dégâts à la cible deux fois d'affilée. N'échoue jamais."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup. Cette capacité ne vérifie pas la précision.", // NEEDS QC
		shortDesc: "Frappe 2 fois. Ne vérifie pas la précision.", // NEEDS QC
	},
	tailglow: {
		name: "Lumi-Queue",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Monte l'Attaque Spéciale de l'utilisateur de 3 niveaux.", // NEEDS QC
		shortDesc: "Monte l'Atq. Spé du lanceur de 3 niveaux.", // NEEDS QC
		gen4: {
			desc: "Monte l'Attaque Spéciale de l'utilisateur de 2 niveaux.", // NEEDS QC
			shortDesc: "Monte l'Atq. Spé du lanceur de 2 niveaux.", // NEEDS QC
		},
	},
	tailslap: {
		name: "Plumo-Queue",
		// Official flavor text: "Le lanceur frappe l’ennemi de deux à cinq fois d’affilée avec sa queue robuste."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Frappe 2 à 5 fois en un tour.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
	},
	tailwhip: {
		name: "Mimi-Queue",
		// Official flavor text: "Le lanceur remue son adorable queue pour tromper la vigilance de l’ennemi et baisser sa Défense."
		desc: "Baisse la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse la Défense des ennemis d'un niveau.", // NEEDS QC
		gen2: {
			shortDesc: "Baisse la Défense de la cible d'un niveau.", // NEEDS QC
		},
	},
	tailwind: {
		name: "Vent Arrière",
		// Official flavor text: "Génère une rafale de vent qui augmente la Vitesse des Pokémon de l’équipe pendant quatre tours."
		desc: "Pendant 4 tours, l'utilisateur et son équipe ont leur Vitesse doublée. Échoue si cet effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
		shortDesc: "4 tours : la Vitesse de l'équipe est doublée.", // NEEDS QC
		gen4: {
			desc: "Pendant 3 tours, l'utilisateur et son équipe ont leur Vitesse doublée. Échoue si cet effet est déjà actif du côté de l'utilisateur.", // NEEDS QC
			shortDesc: "3 tours : la Vitesse de l'équipe est doublée.", // NEEDS QC
		},

		start: "  Un vent arrière souffle sur {TEAM} !",
		end: "  Le vent arrière soufflant sur {TEAM} s’arrête !",
	},
	takedown: {
		name: "Bélier",
		// Official flavor text: "Une charge violente qui blesse aussi légèrement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 1/4 des dégâts.", // NEEDS QC
		gen4: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
		},
		gen2: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV. Si cette capacité touche un clone, le contrecoup est toujours de 1 PV.", // NEEDS QC
		},
		gen1: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/4 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV. Si cette capacité brise le clone de la cible, l'utilisateur ne subit aucun contrecoup.", // NEEDS QC
		},
	},
	takeheart: {
		name: "Extravaillance",
		// Official flavor text: "Le lanceur fait preuve de bravoure pour soigner ses altérations de statut et augmenter son Attaque Spéciale ainsi que sa Défense Spéciale."
		desc: "Soigne le problème de statut de l'utilisateur. Monte son Attaque Spéciale et sa Défense Spéciale d'un niveau.", // NEEDS QC
		shortDesc: "Soigne son statut ; +1 Atq. Spé et Déf. Spé.", // NEEDS QC
	},
	tarshot: {
		name: "Goudronnage",
		// Official flavor text: "Le lanceur recouvre sa cible de goudron liquide pour baisser sa Vitesse et la rendre vulnérable au feu."
		desc: "Baisse la Vitesse de la cible d'un niveau. Jusqu'à ce que la cible quitte le combat, l'efficacité des capacités de type Feu est doublée contre elle.", // NEEDS QC
		shortDesc: "-1 Vitesse et rend la cible vulnérable au Feu.", // NEEDS QC

		start: "  {POKEMON} est maintenant vulnérable au feu !",
	},
	taunt: {
		name: "Provoc",
		// Official flavor text: "Provoque l’ennemi. L’oblige à n’utiliser que des attaques pendant trois tours."
		desc: "La cible ne peut pas utiliser de capacités sans dégâts pendant ses trois prochains tours. Les Pokémon ayant le talent Benêt ou protégés par le talent Aroma-Voile sont immunisés.", // NEEDS QC
		shortDesc: "La cible ne peut pas utiliser de statut 3 tours.", // NEEDS QC
		gen7: {
			desc: "La cible ne peut pas utiliser de capacités sans dégâts pendant ses trois prochains tours. Les Pokémon ayant le talent Benêt ou protégés par le talent Aroma-Voile sont immunisés. Les capacités renforcées par la Force Z peuvent toujours être choisies et exécutées pendant l'effet.", // NEEDS QC
		},
		gen6: {
			desc: "La cible ne peut pas utiliser de capacités sans dégâts pendant ses trois prochains tours. Les Pokémon ayant le talent Benêt ou protégés par le talent Aroma-Voile sont immunisés.", // NEEDS QC
		},
		gen5: {
			desc: "La cible ne peut pas utiliser de capacités sans dégâts pendant ses trois prochains tours.", // NEEDS QC
		},
		gen4: {
			desc: "Pendant 3 à 5 tours, la cible ne peut pas utiliser de capacités sans dégâts.", // NEEDS QC
			shortDesc: "La cible ne peut pas utiliser de statut 3-5 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Pendant 2 tours, la cible ne peut pas utiliser de capacités sans dégâts.", // NEEDS QC
			shortDesc: "La cible ne peut pas utiliser de statut 2 tours.", // NEEDS QC
		},

		start: "  {POKEMON} répond à la Provoc !",
		end: "  {POKEMON} s’est remis de la Provoc !",
		cant: "{POKEMON} ne peut pas utiliser la capacité {MOVE} après la Provoc !",
	},
	tearfullook: {
		name: "Larme à l’Œil",
		// Official flavor text: "Le lanceur jette un regard plein de larmes à la cible. Celle-ci perd toute velléité de combat et voit son Attaque et son Attaque Spéciale baisser."
		desc: "Baisse l'Attaque et l'Attaque Spéciale de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Attaque et l'Atq. Spé de la cible d'un niveau.", // NEEDS QC
	},
	teatime: {
		name: "Thérémonie",
		// Official flavor text: "Le lanceur invite tous les Pokémon sur le terrain à prendre le goûter autour d’une tasse de thé. Ceux qui tiennent une Baie la mangent."
		desc: "Tous les Pokémon actifs consomment leur Baie tenue. Cet effet n'est empêché ni par les clones, ni par les talents Maladresse ou Tension, ni par les effets d'Embargo ou de Zone Magique. Échoue si aucun Pokémon actif ne tient de Baie.", // NEEDS QC
		shortDesc: "Tous les Pokémon au combat mangent leur Baie.", // NEEDS QC

		activate: "  C’est l’heure du thé ! Tout le monde mange sa Baie.",
		fail: "  Mais rien ne se passe !",
	},
	technoblast: {
		name: "Techno-Buster",
		// Official flavor text: "Le lanceur projette un rayon lumineux sur l’ennemi. Le type varie selon le Module que tient le lanceur."
		desc: "Le type de cette capacité dépend du module tenu par l'utilisateur.", // NEEDS QC
		shortDesc: "Son type dépend du module tenu.", // NEEDS QC
	},
	tectonicrage: {
		name: "Éruption Géo-Sismique",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	teeterdance: {
		name: "Danse Folle",
		// Official flavor text: "Danse qui rend confus tous les Pokémon autour du lanceur."
		desc: "Rend la cible confuse.", // NEEDS QC
		shortDesc: "Rend les Pokémon adjacents confus.", // NEEDS QC
	},
	telekinesis: {
		name: "Lévikinésie",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Pendant 3 tours, la cible ne peut éviter aucune attaque, sauf les capacités mettant K.O. en un coup, tant qu'elle reste au combat. Pendant l'effet, la cible est immunisée contre les attaques de type Sol et contre les effets de Picots, Pics Toxik, Toile Gluante et du talent Piège Sable tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant hérite de l'effet. Racines, Anti-Air, Myria-Flèches et la Balle Fer priment sur cette capacité si la cible est sous l'un de leurs effets. Échoue si la cible est déjà sous cet effet ou sous ceux de Racines, Anti-Air ou Myria-Flèches. La cible est immunisée contre l'utilisation de cette capacité si son espèce est Taupiqueur, Triopikeur, Taupiqueur d’Alola, Triopikeur d’Alola, Bacabouh, Trépassable ou Ectoplasma méga-évolué. Méga-Ectoplasma ne peut être sous cet effet d'aucune façon.", // NEEDS QC
		shortDesc: "3 tours : la cible flotte et ne peut pas esquiver.", // NEEDS QC
		gen6: {
			desc: "Pendant 3 tours, la cible ne peut éviter aucune attaque, sauf les capacités mettant K.O. en un coup, tant qu'elle reste au combat. Pendant l'effet, la cible est immunisée contre les attaques de type Sol et contre les effets de Picots, Pics Toxik, Toile Gluante et du talent Piège Sable tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant hérite de l'effet. Racines, Anti-Air, Myria-Flèches et la Balle Fer priment sur cette capacité si la cible est sous l'un de leurs effets. Échoue si la cible est déjà sous cet effet ou sous ceux de Racines, Anti-Air ou Myria-Flèches. La cible est immunisée contre l'utilisation de cette capacité si son espèce est Taupiqueur, Triopikeur ou Ectoplasma méga-évolué. Méga-Ectoplasma ne peut être sous cet effet d'aucune façon.", // NEEDS QC
		},
		gen5: {
			desc: "Pendant 3 tours, la cible ne peut éviter aucune attaque, sauf les capacités mettant K.O. en un coup, tant qu'elle reste au combat. Pendant l'effet, la cible est immunisée contre les attaques de type Sol et contre les effets de Picots, Pics Toxik et du talent Piège Sable tant qu'elle reste au combat. Si la cible utilise Relais, son remplaçant hérite de l'effet. Racines, Anti-Air et la Balle Fer priment sur cette capacité si la cible est sous l'un de leurs effets. Échoue si la cible est déjà sous cet effet ou sous ceux de Racines ou Anti-Air. La cible est immunisée contre cette capacité si son espèce est Taupiqueur ou Triopikeur.", // NEEDS QC
		},

		start: "  Ça fait léviter {POKEMON} !",
		end: "  {POKEMON} est libéré de la capacité Lévikinésie !",
	},
	teleport: {
		name: "Téléport",
		// Official flavor text: "Permet de changer de place avec un autre Pokémon de l’équipe s’il y en a. Quand cette capacité est utilisée par un Pokémon sauvage, celui-ci fuit le combat."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O.", // NEEDS QC
		shortDesc: "Le lanceur se retire du combat.", // NEEDS QC
		gen7: {
			desc: "Échoue lorsqu'elle est utilisée.", // NEEDS QC
			shortDesc: "Échoue lorsqu'elle est utilisée.", // NEEDS QC
		},
	},
	temperflare: {
		name: "Indignition",
		// Official flavor text: "Le lanceur utilise la force de son dépit pour attaquer. S'il a utilisé une capacité qui a échoué au tour précédent, la puissance d'Indignition est doublée."
		desc: "La puissance est doublée si la dernière capacité de l'utilisateur au tour précédent, y compris les capacités appelées par d'autres capacités ou utilisées via Sommation, Reflet Magik, Saisie ou les talents Danseuse ou Miroir Magik, a échoué dans tous ses effets normaux — sans compter les dégâts d'un Pied Voltige, Pied Sauté ou Caboche-Kaboum raté — ou si l'utilisateur a été empêché d'agir par un effet autre que le rechargement ou Chute Libre. Une capacité bloquée par Blockhaus, Détection, Bouclier Royal, Abri, Pico-Défense, Vigilance, Tatamigaeshi, Prévention ou Garde Large ne double pas la puissance de cette capacité, pas plus qu'un Rebond ou un Vol interrompu par l'effet de Gravité, Anti-Air ou Myria-Flèches.", // NEEDS QC
		shortDesc: "Puissance doublée si sa dernière capacité a raté.", // NEEDS QC
	},
	terablast: {
		name: "Téra Explosion",
		// Official flavor text: "Si le lanceur est Téracristallisé, il libère l'énergie de son Type Téracristal. Cette capacité inflige des dégâts en utilisant l'Attaque ou l'Attaque Spéciale du lanceur, selon la statistique la plus élevée."
		desc: "Si l'utilisateur est téracristallisé, cette capacité devient une attaque physique si son Attaque est supérieure à son Attaque Spéciale, changements de niveaux compris, et son type devient le type Téracristal de l'utilisateur. De plus, si le type Téracristal de l'utilisateur est Stellaire, cette capacité a 100 de puissance, est super efficace contre les cibles téracristallisées et neutre contre les autres, et baisse l'Attaque et l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Téracristallisé : phys. si Atq > Atq. Spé, type Téra.", // NEEDS QC
	},
	terastarstorm: {
		name: "Pluie Térastrale",
		// Official flavor text: "Le lanceur bombarde la cible afin de l'éliminer grâce au pouvoir des cristaux. Si le lanceur est Terapagos sous sa Forme Stellaire, la capacité touche tous les ennemis."
		desc: "Si l'utilisateur est un Terapagos sous sa Forme Stellaire, le type de cette capacité devient Stellaire, elle touche tous les Pokémon adverses, et elle devient une attaque physique si l'Attaque de l'utilisateur est supérieure à son Attaque Spéciale, changements de niveaux compris.", // NEEDS QC
		shortDesc: "Terapagos Stellaire : type Stellaire, touche les deux.", // NEEDS QC
	},
	terrainpulse: {
		name: "Champlification",
		// Official flavor text: "Une attaque qui tire sa force des champs. Son type et sa puissance varient selon le champ actif."
		desc: "La puissance est doublée si l'utilisateur est au sol et qu'un champ est actif, et le type de cette capacité change en conséquence : type Électrik sur un Champ Électrifié, type Plante sur un Champ Herbu, type Fée sur un Champ Brumeux et type Psy sur un Champ Psychique.", // NEEDS QC
		shortDesc: "Sur un champ : puissance x2 et type variable.", // NEEDS QC
	},
	thief: {
		name: "Larcin",
		// Official flavor text: "Le lanceur attaque la cible et vole son objet. Le lanceur ne peut rien voler s’il tient déjà un objet."
		desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet si elle n'est pas K.O. L'objet de la cible n'est pas volé s'il s'agit d'une Gemme Bleue, d'une Gemme Rouge, d'un Globe Adamant, d'un Globe Perlé, d'un Globe Platiné, d'une plaque, d'un module, d'une ROM, d'une Épée Rouillée, d'un Bouclier Rouillé, d'une Énergie Booster ou d'un masque tenu respectivement par Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, un Pokémon Paradoxe ou Ogerpon, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Dans ce cas, les Pokémon Paradoxe incluent toutes les espèces ayant les talents Paléosynthèse et Charge Quantique, sauf Feu-Perçant, Ire-Foudre, Roc-de-Fer et Chef-de-Fer. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		shortDesc: "Sans objet, le lanceur vole celui de la cible.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque, d'un module, d'une ROM, de Épée Rouillée ou de Bouclier Rouillé tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen7: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit d'un Cristal Z, d'une Méga-Gemme tenue par l'espèce pouvant méga-évoluer avec, ou de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque, d'un module ou d'une ROM tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen6: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit d'une Méga-Gemme tenue par l'espèce pouvant méga-évoluer avec, ou de Gemme Bleue, Gemme Rouge, Orbe Platiné, d'une plaque ou d'un module tenus respectivement par Kyogre, Groudon, Giratina, Arceus, Genesect, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen5: {
			desc: "Si cette attaque réussit et que l'utilisateur n'est pas K.O., il vole l'objet tenu par la cible s'il n'en tient pas lui-même. Une cible ayant le talent Glu ne perd pas son objet tant qu'elle n'est pas K.O. L'objet n'est pas volé s'il s'agit d'une Lettre, ou de Orbe Platiné, d'une plaque ou d'un module tenus respectivement par Giratina, Arceus ou Genesect, ou si l'utilisateur est l'une de ces espèces et que la cible tient l'objet correspondant. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage ou le talent Récolte.", // NEEDS QC
		},
		gen4: {
			desc: "Si cette attaque réussit et que l'utilisateur ne tient pas d'objet, il vole l'objet tenu par la cible. L'objet n'est pas volé s'il s'agit d'une Lettre ou d'une Orbe Platiné, ou si la cible a le talent Multi-Type ou Glu. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage.", // NEEDS QC
		},
		gen3: {
			desc: "Si cette attaque réussit et que l'utilisateur ne tient pas d'objet, il vole l'objet tenu par la cible. L'objet n'est pas volé s'il s'agit d'une Lettre ou d'une Baie Enigma, ou si la cible a le talent Glu. Les objets perdus à cause de cette capacité ne peuvent pas être récupérés avec Recyclage.", // NEEDS QC
		},
		gen2: {
			desc: "A 100 % de chances de voler l'objet tenu par la cible si l'utilisateur n'en tient pas. L'objet de la cible n'est pas volé s'il s'agit d'une Lettre.", // NEEDS QC
		},
	},
	thousandarrows: {
		name: "Myria-Flèches",
		// Official flavor text: "Touche même les Pokémon dans les airs. Dans ce cas, la cible retombe au sol."
		desc: "Cette capacité peut toucher les Pokémon en l'air, ce qui inclut les Pokémon de type Vol, ceux ayant le talent Lévitation, ceux tenant un Ballon et ceux sous l'effet de Vol Magnétik ou Lévikinésie. Si la cible est de type Vol et n'est pas déjà au sol, cette capacité inflige des dégâts neutres quels que soient ses autres types. Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre. Si elle touche une cible sous l'effet de Rebond, Vol, Vol Magnétik ou Lévikinésie, l'effet prend fin. Si la cible est de type Vol et n'a pas utilisé Atterrissage ce tour, ou a le talent Lévitation, elle perd son immunité aux attaques de type Sol et au talent Piège Sable tant qu'elle reste au combat. Pendant l'effet, Vol Magnétik échoue pour la cible et Lévikinésie échoue contre elle.", // NEEDS QC
		shortDesc: "Met les ennemis au sol. Neutre contre le type Vol.", // NEEDS QC
	},
	thousandwaves: {
		name: "Myria-Vagues",
		// Official flavor text: "Attaque avec des vagues glissant au sol. L’ennemi pris dedans ne peut pas s’échapper."
		desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain.", // NEEDS QC
		shortDesc: "Touche les ennemis et les empêche de partir.", // NEEDS QC
		gen7: {
			desc: "Empêche la cible de quitter le combat. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. Si la cible quitte le terrain avec Relais, son remplaçant reste piégé. L'effet prend fin si l'utilisateur quitte le terrain.", // NEEDS QC
		},
	},
	thrash: {
		name: "Mania",
		// Official flavor text: "Une attaque furieuse qui dure de deux à trois tours. Le lanceur devient confus."
		desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible au premier tour de l'effet ou au deuxième tour d'un effet de trois tours, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo et que l'utilisateur dort, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		shortDesc: "Dure 2-3 tours, puis le lanceur devient confus.", // NEEDS QC
		gen6: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse adjacent au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible au premier tour de l'effet ou au deuxième tour d'un effet de trois tours, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus à la fin du dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'il dort au début d'un tour, ou si l'attaque échoue contre la cible, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux ou trois tours et devient confus à la fin du dernier tour de l'effet s'il ne l'est pas déjà. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Si l'utilisateur est empêché d'agir, s'endort, est gelé, ou si l'attaque échoue contre la cible, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen2: {
			desc: "Que cette capacité réussisse ou non, l'utilisateur reste bloqué dessus pendant deux ou trois tours et devient confus juste après son action au dernier tour de l'effet, même s'il est déjà confus. Si l'utilisateur est empêché d'agir, l'effet prend fin sans causer de confusion. Si cette capacité est appelée par Blabla Dodo, elle n'est utilisée qu'un tour et ne rend pas confus.", // NEEDS QC
		},
		gen1: {
			desc: "Que cette capacité réussisse ou non, l'utilisateur reste bloqué dessus pendant trois ou quatre tours et devient confus juste après son action au dernier tour de l'effet, même s'il est déjà confus. Si l'utilisateur est empêché d'agir, l'effet prend fin sans causer de confusion. Pendant l'effet, la précision de cette capacité est remplacée à chaque tour par la précision actuelle calculée, changements de niveaux compris, mais sans descendre sous 1/256 ni dépasser 255/256.", // NEEDS QC
			shortDesc: "Dure 3-4 tours, puis rend l'utilisateur confus.", // NEEDS QC
		},
	},
	throatchop: {
		name: "Exécu-Son",
		// Official flavor text: "Inflige une douleur tellement violente à la cible qu’elle ne peut plus émettre de sons pendant deux tours."
		desc: "Pendant 2 tours, la cible ne peut pas utiliser de capacités sonores.", // NEEDS QC
		shortDesc: "2 tours : la cible ne peut pas utiliser de sons.", // NEEDS QC
		gen7: {
			desc: "Pendant 2 tours, la cible ne peut pas utiliser de capacités sonores. Les capacités sonores renforcées par la Force Z peuvent toujours être choisies et exécutées pendant l'effet.", // NEEDS QC
		},

		cant: "Exécu-Son empêche {POKEMON} d’utiliser la capacité !",
	},
	thunder: {
		name: "Fatal-Foudre",
		// Official flavor text: "La foudre tombe sur l’ennemi pour lui infliger des dégâts. Peut aussi le paralyser."
		desc: "A 30 % de chances de paralyser la cible. Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre. Si la météo est Pluie battante ou Pluie, cette capacité ne vérifie pas la précision. Si la météo est Soleil intense ou Soleil, sa précision est de 50 %. Si elle est utilisée contre un Pokémon tenant un Parapluie Solide, sa précision reste à 70 %.", // NEEDS QC
		shortDesc: "30 % de paralyser. Ne rate pas sous la pluie.", // NEEDS QC
		gen7: {
			desc: "A 30 % de chances de paralyser la cible. Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre. Si la météo est Pluie battante ou Pluie, cette capacité ne vérifie pas la précision. Si la météo est Soleil intense ou Soleil, sa précision est de 50 %.", // NEEDS QC
		},
		gen5: {
			desc: "A 30 % de chances de paralyser la cible. Cette capacité peut toucher une cible utilisant Rebond, Vol ou Chute Libre, ou sous l'effet de Chute Libre. Si la météo est Pluie, cette capacité ne vérifie pas la précision. Si la météo est Soleil, sa précision est de 50 %.", // NEEDS QC
		},
		gen4: {
			desc: "A 30 % de chances de paralyser la cible. Cette capacité peut toucher une cible utilisant Rebond ou Vol. Si la météo est Pluie, cette capacité ne vérifie pas la précision. Si la météo est Soleil, sa précision est de 50 %.", // NEEDS QC
		},
		gen2: {
			desc: "A 30 % de chances de paralyser la cible. Cette capacité peut toucher une cible utilisant Vol. Si la météo est Pluie, cette capacité ne vérifie pas la précision. Si la météo est Soleil, sa précision est de 50 %.", // NEEDS QC
		},
		gen1: {
			desc: "A 10 % de chances de paralyser la cible.", // NEEDS QC
			shortDesc: "10 % de paralyser la cible.", // NEEDS QC
		},
	},
	thunderbolt: {
		name: "Tonnerre",
		// Official flavor text: "Une grosse décharge électrique tombe sur l’ennemi. Peut aussi le paralyser."
		desc: "A 10 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "10 % de paralyser la cible.", // NEEDS QC
	},
	thundercage: {
		name: "Voltageôle",
		// Official flavor text: "Le lanceur frappe l’ennemi, et le piège dans une prison électrique qui dure de quatre à cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},

		start: "  {POKEMON} se fait emprisonner par {SOURCE} !",
	},
	thunderclap: {
		name: "Vif Éclair",
		// Official flavor text: "Permet au lanceur d'attaquer la cible en priorité avec une décharge électrique. Échoue si la cible ne prépare pas une attaque."
		desc: "Échoue si la cible n'a pas choisi une attaque physique, une attaque spéciale ou Moi d’Abord ce tour, ou si elle agit avant l'utilisateur.", // NEEDS QC
		shortDesc: "Va en premier. Échoue si la cible n'attaque pas.", // NEEDS QC
	},
	thunderfang: {
		name: "Crocs Éclair",
		// Official flavor text: "Le lanceur utilise une morsure électrifiée. Peut aussi paralyser ou apeurer l’ennemi."
		desc: "A 10 % de chances de paralyser la cible et 10 % de chances de l'apeurer.", // NEEDS QC
		shortDesc: "10 % de paralyser. 10 % d'apeurer.", // NEEDS QC
	},
	thunderouskick: {
		name: "Coup Fulgurant",
		// Official flavor text: "Le lanceur assène un coup de pied à la cible à la vitesse de l’éclair. Baisse aussi la Défense de la cible."
		desc: "A 100 % de chances de baisser la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser la Défense de la cible d'un niveau.", // NEEDS QC
	},
	thunderpunch: {
		name: "Poing Éclair",
		// Official flavor text: "Un coup de poing électrique vient frapper l’ennemi. Peut le paralyser."
		desc: "A 10 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "10 % de paralyser la cible.", // NEEDS QC
	},
	thundershock: {
		name: "Éclair",
		// Official flavor text: "Une décharge électrique tombe sur l’ennemi. Peut aussi le paralyser."
		desc: "A 10 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "10 % de paralyser la cible.", // NEEDS QC
	},
	thunderwave: {
		name: "Cage Éclair",
		// Official flavor text: "Un faible choc électrique frappe l’ennemi. Si l’attaque le touche, celui-ci est paralysé."
		desc: "Paralyse la cible. Cette capacité n'ignore pas l'immunité de type.", // NEEDS QC
		shortDesc: "Paralyse la cible.", // NEEDS QC
	},
	tickle: {
		name: "Chatouille",
		// Official flavor text: "Le lanceur chatouille l’ennemi, ce qui baisse son Attaque et sa Défense."
		desc: "Baisse l'Attaque et la Défense de la cible d'un niveau.", // NEEDS QC
		shortDesc: "Baisse l'Attaque et la Défense de la cible d'un niveau.", // NEEDS QC
	},
	tidyup: {
		name: "Grand Nettoyage",
		// Official flavor text: "Le lanceur fait le ménage sur le terrain, ce qui annule les effets de Picots, Piège de Roc, Toile Gluante, Pics Toxik, et Clonage. Augmente l'Attaque et la Vitesse du lanceur."
		desc: "Monte l'Attaque et la Vitesse de l'utilisateur d'un niveau. Retire les clones de tous les Pokémon actifs et met fin aux effets de Picots, Piège de Roc, Toile Gluante et Pics Toxik des deux côtés.", // NEEDS QC
		shortDesc: "+1 Atq et Vit. Retire clones et pièges.", // NEEDS QC

		activate: "  Le grand nettoyage est terminé !",
	},
	topsyturvy: {
		name: "Renversement",
		// Official flavor text: "Inverse tous les changements de stats de la cible."
		desc: "Les niveaux de statistiques positifs de la cible deviennent négatifs et inversement. Échoue si tous les niveaux de la cible sont à 0.", // NEEDS QC
		shortDesc: "Inverse les changements de stats de la cible.", // NEEDS QC
	},
	torchsong: {
		name: "Chant Flamboyant",
		// Official flavor text: "Le lanceur carbonise la cible en projetant sur elle de vives flammes créées par un chant. Cette capacité augmente l'Attaque Spéciale du lanceur."
		desc: "A 100 % de chances de monter l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "100 % de monter l'Atq. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	torment: {
		name: "Tourmente",
		// Official flavor text: "Le lanceur irrite l’ennemi pour l’empêcher d’utiliser la même capacité deux fois de suite."
		desc: "La cible ne peut pas sélectionner la même capacité deux tours de suite. Cet effet prend fin quand la cible quitte le combat.", // NEEDS QC
		shortDesc: "La cible ne peut pas répéter sa capacité.", // NEEDS QC

		start: "  {POKEMON} est tourmenté !",
		end: "  Les tourments {POKEMON:de} sont apaisés !",
	},
	toxic: {
		name: "Toxik",
		// Official flavor text: "Empoisonne gravement l’ennemi. Les dégâts dus au poison augmentent à chaque tour."
		desc: "Empoisonne gravement la cible. Si un Pokémon de type Poison utilise cette capacité, la cible ne peut pas l'éviter, même si elle est au milieu d'une capacité en deux tours.", // NEEDS QC
		shortDesc: "Empoisonne gravement. Ne rate pas si type Poison.", // NEEDS QC
		gen5: {
			desc: "Empoisonne gravement la cible.", // NEEDS QC
			shortDesc: "Empoisonne gravement la cible.", // NEEDS QC
		},
	},
	toxicspikes: {
		name: "Pics Toxik",
		// Official flavor text: "Lance des pics autour de l’ennemi. Ils empoisonnent les ennemis qui entrent au combat."
		desc: "Pose un piège du côté adverse qui empoisonne chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à deux fois avant d'échouer. Les Pokémon adverses sont empoisonnés avec une couche et gravement empoisonnés avec deux couches. Peut être retiré du côté adverse si un Pokémon utilise Grand Nettoyage, si un Pokémon adverse utilise Toupie Éclat, Tour Rapide ou Anti-Brume avec succès, est touché par Anti-Brume, ou si un Pokémon de type Poison au sol entre au combat. Rune Protect empêche l'équipe adverse d'être empoisonnée à l'entrée, mais pas un clone.", // NEEDS QC
		shortDesc: "Empoisonne les ennemis qui entrent. 2 couches max.", // NEEDS QC
		gen8: {
			desc: "Pose un piège du côté adverse qui empoisonne chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à deux fois avant d'échouer. Les Pokémon adverses sont empoisonnés avec une couche et gravement empoisonnés avec deux couches. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide ou Anti-Brume avec succès, est touché par Anti-Brume, ou si un Pokémon de type Poison au sol entre au combat. Rune Protect empêche l'équipe adverse d'être empoisonnée à l'entrée, mais pas un clone.", // NEEDS QC
		},
		gen5: {
			desc: "Pose un piège du côté adverse qui empoisonne chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à deux fois avant d'échouer. Les Pokémon adverses sont empoisonnés avec une couche et gravement empoisonnés avec deux couches. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide avec succès, est touché par Anti-Brume, ou si un Pokémon de type Poison au sol entre au combat. Rune Protect empêche l'équipe adverse d'être empoisonnée à l'entrée, mais pas un clone.", // NEEDS QC
		},
		gen4: {
			desc: "Pose un piège du côté adverse qui empoisonne chaque Pokémon adverse entrant au combat, sauf s'il est de type Vol ou a le talent Lévitation. Peut être utilisée jusqu'à deux fois avant d'échouer. Les Pokémon adverses sont empoisonnés avec une couche et gravement empoisonnés avec deux couches. Peut être retiré du côté adverse si un Pokémon adverse utilise Tour Rapide avec succès, est touché par Anti-Brume, ou si un Pokémon de type Poison au sol entre au combat. Rune Protect empêche l'empoisonnement à l'entrée, tout comme entrer au combat avec un clone.", // NEEDS QC
		},

		start: "  Des pics toxiques se répandent autour de {TEAM} !",
		end: "  Il n’y a plus de pics toxiques autour de {TEAM} !",
	},
	toxicthread: {
		name: "Fil Toxique",
		// Official flavor text: "Tisse un fil imprégné de venin. Empoisonne la cible et baisse sa Vitesse."
		desc: "Baisse la Vitesse de la cible d'un niveau et l'empoisonne.", // NEEDS QC
		shortDesc: "-1 Vitesse de la cible et l'empoisonne.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	trailblaze: {
		name: "Désherbaffe",
		// Official flavor text: "Le lanceur surgit des hautes herbes pour attaquer la cible. Les mouvements agiles du lanceur augmentent sa Vitesse."
		desc: "A 100 % de chances de monter la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "100 % de monter la Vitesse du lanceur d'un niveau.", // NEEDS QC
	},
	transform: {
		name: "Morphing",
		// Official flavor text: "Le lanceur devient une copie de sa cible et obtient la même palette de capacités."
		desc: "L'utilisateur se transforme en la cible. Les statistiques actuelles, les niveaux de statistiques, les types, les capacités, le talent, le poids, le sexe et l'apparence de la cible sont copiés. Le niveau et les PV de l'utilisateur restent les mêmes, et chaque capacité copiée ne reçoit que 5 PP, avec un maximum de 5 PP chacune. L'utilisateur ne peut plus changer de forme s'il en avait la possibilité. Cette capacité échoue si elle touche un clone, si l'utilisateur ou la cible est déjà transformé, ou si l'un des deux est derrière une Illusion.", // NEEDS QC
		shortDesc: "Copie stats, capacités, types et talent de la cible.", // NEEDS QC
		gen4: {
			desc: "L'utilisateur se transforme en la cible. Les statistiques actuelles, les niveaux de statistiques, les types, les capacités, le talent, le poids, les IV, l'espèce et l'apparence de la cible sont copiés. Le niveau et les PV de l'utilisateur restent les mêmes, et chaque capacité copiée ne reçoit que 5 PP. Cette capacité échoue si la cible est transformée.", // NEEDS QC
		},
		gen2: {
			desc: "L'utilisateur se transforme en la cible. Les statistiques actuelles, les niveaux de statistiques, les types, les capacités, les DV, l'espèce et l'apparence de la cible sont copiés. Le niveau et les PV de l'utilisateur restent les mêmes, et chaque capacité copiée ne reçoit que 5 PP. Cette capacité échoue si la cible est transformée.", // NEEDS QC
			shortDesc: "Copie stats, capacités, types et espèce de la cible.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur se transforme en la cible. Les statistiques actuelles, les niveaux de statistiques, les types, les capacités, les DV, l'espèce et l'apparence de la cible sont copiés. Le niveau et les PV de l'utilisateur restent les mêmes, et chaque capacité copiée ne reçoit que 5 PP. Cette capacité peut toucher une cible utilisant Tunnel ou Vol.", // NEEDS QC
		},

		transform: "{POKEMON} prend l’apparence {SPECIES:de} !",
	},
	triattack: {
		name: "Triplattaque",
		// Official flavor text: "Le lanceur envoie trois boules d’énergie simultanément. Peut aussi paralyser, brûler ou geler l’ennemi."
		desc: "A 20 % de chances de brûler, geler ou paralyser la cible.", // NEEDS QC
		shortDesc: "20 % de paralyser, brûler ou geler.", // NEEDS QC
		gen2: {
			desc: "Cette capacité choisit au hasard la brûlure, le gel ou la paralysie, et a 20 % de chances d'infliger ce statut à la cible. Si la cible est gelée et que la brûlure a été choisie, elle dégèle.", // NEEDS QC
		},
		gen1: {
			desc: "Aucun effet supplémentaire.", // NEEDS QC
			shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		},
	},
	trick: {
		name: "Tour de Magie",
		// Official flavor text: "Le lanceur prend la cible au dépourvu et l’oblige à échanger son objet contre le sien."
		desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, ou si l'utilisateur essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Globe Adamant, un Globe Perlé, un Globe Platiné, une plaque, un module, une ROM, une Épée Rouillée, un Bouclier Rouillé, une Énergie Booster ou un masque à ou d'un Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvallié, Zacian, Zamazenta, Pokémon Paradoxe ou Ogerpon, respectivement. Dans ce cas, les Pokémon Paradoxe incluent toutes les espèces ayant les talents Paléosynthèse et Charge Quantique, sauf Feu-Perçant, Ire-Foudre, Roc-de-Fer et Chef-de-Fer. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		shortDesc: "Échange son objet avec celui de la cible.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, ou si l'utilisateur essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Orbe Platiné, une plaque, un module, une ROM, une Épée Rouillée ou un Bouclier Rouillé à ou d'un Kyogre, Groudon, Giratina, Arceus, Genesect, Silvallié, Zacian ou Zamazenta, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'un des deux tient un Cristal Z, si l'utilisateur essaie de donner ou de prendre une Méga-Gemme à ou de l'espèce pouvant méga-évoluer avec, ou s'il essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Orbe Platiné, une plaque, un module ou une ROM à ou d'un Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvallié, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'utilisateur essaie de donner ou de prendre une Méga-Gemme à ou de l'espèce pouvant méga-évoluer avec, ou s'il essaie de donner ou de prendre une Gemme Bleue, une Gemme Rouge, un Orbe Platiné, une plaque ou un module à ou d'un Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'un des deux tient une Lettre, ou si l'utilisateur essaie de donner ou de prendre un Orbe Platiné, une plaque ou un module à ou d'un Giratina, Arceus ou Genesect, respectivement. La cible est immunisée contre cette capacité si elle a le talent Glu.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'un des deux tient une Lettre ou un Orbe Platiné, si l'un des deux a le talent Multi-Type, si l'un des deux est sous l'effet de Sabotage, ou si la cible a le talent Glu.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur échange son objet tenu avec celui de la cible. Échoue si ni l'utilisateur ni la cible ne tiennent d'objet, si l'un des deux tient une Lettre, si l'un des deux est sous l'effet de Sabotage, ou si la cible a le talent Glu.", // NEEDS QC
		},

		activate: "  {POKEMON} échange son objet contre celui de sa cible !",
	},
	trickortreat: {
		name: "Halloween",
		// Official flavor text: "Insuffle à la cible l’esprit d’Halloween, et ajoute le type Spectre à ses types actuels."
		desc: "Ajoute le type Spectre à la cible, qui a alors deux ou trois types. Échoue si la cible est déjà de type Spectre. Si Maléfice Sylvain ajoute un type à la cible, il remplace celui ajouté par cette capacité et inversement.", // NEEDS QC
		shortDesc: "Ajoute le type Spectre à la cible.", // NEEDS QC
	},
	trickroom: {
		name: "Distorsion",
		// Official flavor text: "Le lanceur crée une zone mystérieuse où les Pokémon les plus lents frappent en priorité pendant cinq tours."
		desc: "Pendant 5 tours, la Vitesse de chaque Pokémon est recalculée pour déterminer l'ordre du tour. Pendant l'effet, la Vitesse de chaque Pokémon est considérée comme étant (10000 - sa Vitesse normale), et si cette valeur dépasse 8191, on lui soustrait 8192. Si cette capacité est utilisée pendant l'effet, celui-ci prend fin.", // NEEDS QC
		shortDesc: "Agit en dernier. 5 tours : ordre du tour inversé.", // NEEDS QC
		gen4: {
			desc: "Pendant 5 tours, tous les Pokémon actifs avec une Vitesse plus basse agissent avant ceux avec une Vitesse plus haute, au sein de leur niveau de priorité. Si cette capacité est utilisée pendant l'effet, celui-ci prend fin.", // NEEDS QC
		},
	},
	triplearrows: {
		name: "Triple Flèche",
		// Official flavor text: "Le lanceur donne un coup de pied et tire trois flèches simultanément, ce qui peut baisser la Défense de la cible ou l'apeurer. Taux de critiques élevé."
		desc: "A 50 % de chances de baisser la Défense de la cible d'un niveau, 30 % de chances de l'apeurer, et plus de chances de porter un coup critique.", // NEEDS QC
		shortDesc: "Crit. élevé. 50 % de -1 Déf, 30 % d'apeurer.", // NEEDS QC
	},
	tripleaxel: {
		name: "Triple Axel",
		// Official flavor text: "Une salve composée de un à trois coups de pied dont la puissance augmente à chaque coup porté."
		desc: "Frappe trois fois. La puissance passe à 40 au deuxième coup et 60 au troisième. Cette capacité vérifie la précision à chaque coup, et l'attaque s'arrête si la cible évite un coup. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours trois fois.", // NEEDS QC
		shortDesc: "Frappe 3 fois. Chaque coup peut rater, puissance croît.", // NEEDS QC
	},
	tripledive: {
		name: "Triple Plongeon",
		// Official flavor text: "Le lanceur effectue des plongeons parfaitement cadencés pour éclabousser la cible et lui infliger des dégâts trois fois d'affilée."
		desc: "Frappe trois fois.", // NEEDS QC
		shortDesc: "Frappe 3 fois.", // NEEDS QC
	},
	triplekick: {
		name: "Triple Pied",
		// Official flavor text: "Une salve de un à trois coups de pied dont la puissance augmente à chaque coup porté."
		desc: "Frappe trois fois. La puissance passe à 20 au deuxième coup et 30 au troisième. Cette capacité vérifie la précision à chaque coup, et l'attaque s'arrête si la cible évite un coup. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours trois fois.", // NEEDS QC
		shortDesc: "Frappe 3 fois. Chaque coup peut rater, puissance croît.", // NEEDS QC
		gen4: {
			desc: "Frappe trois fois. La puissance passe à 20 au deuxième coup et 30 au troisième. Cette capacité vérifie la précision à chaque coup, et l'attaque s'arrête si la cible évite un coup. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe trois fois. La puissance passe à 20 au deuxième coup et 30 au troisième. Cette capacité vérifie la précision à chaque coup, et l'attaque s'arrête si la cible évite un coup. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants.", // NEEDS QC
		},
		gen2: {
			desc: "Frappe une à trois fois, au hasard. La puissance passe à 20 au deuxième coup et 30 au troisième.", // NEEDS QC
			shortDesc: "Frappe 1 à 3 fois. La puissance monte à chaque coup.", // NEEDS QC
		},
	},
	tropkick: {
		name: "Botte Sucrette",
		// Official flavor text: "Un coup de pied chaud comme les tropiques qui inflige des dégâts à la cible et baisse son Attaque."
		desc: "A 100 % de chances de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
		shortDesc: "100 % de baisser l'Attaque de la cible d'un niveau.", // NEEDS QC
	},
	trumpcard: {
		name: "Atout",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance de cette capacité dépend des PP restants après la réduction normale de PP et l'effet du talent Pression : 200 de puissance pour 0 PP, 80 pour 1 PP, 60 pour 2 PP, 50 pour 3 PP et 40 pour 4 PP ou plus.", // NEEDS QC
		shortDesc: "Plus puissant s'il lui reste peu de PP.", // NEEDS QC
	},
	twinbeam: {
		name: "Double Laser",
		// Official flavor text: "Le lanceur projette d'étranges rayons lumineux avec ses yeux et inflige des dégâts deux fois d'affilée."
		desc: "Frappe deux fois. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois en un tour.", // NEEDS QC
	},
	twineedle: {
		name: "Double Dard",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Frappe deux fois, chaque coup ayant 20 % de chances d'empoisonner la cible. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		shortDesc: "Frappe 2 fois. Chaque coup : 20 % de psn.", // NEEDS QC
		gen4: {
			desc: "Frappe deux fois, chaque coup ayant 20 % de chances d'empoisonner la cible. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup. Si la cible tient une Ceinture Force et avait tous ses PV au début de cette capacité, elle n'est pas mise K.O., quel que soit le nombre de coups.", // NEEDS QC
		},
		gen3: {
			desc: "Frappe deux fois, chaque coup ayant 20 % de chances d'empoisonner la cible. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup.", // NEEDS QC
		},
		gen2: {
			desc: "Frappe deux fois, le second coup ayant 20 % de chances d'empoisonner la cible. Si le premier coup brise le clone de la cible, elle subit les dégâts du second coup mais ne peut pas être empoisonnée par celui-ci.", // NEEDS QC
			shortDesc: "Frappe 2 fois. Le second coup empoisonne à 20 %.", // NEEDS QC
		},
		gen1: {
			desc: "Frappe deux fois, le second coup ayant 20 % de chances d'empoisonner la cible. Si le premier coup brise le clone de la cible, la capacité s'arrête.", // NEEDS QC
		},
	},
	twinkletackle: {
		name: "Impact Choupinova",
		shortDesc: "Puissance selon le Pouvoir Z de la capacité de base.", // NEEDS QC
	},
	twister: {
		name: "Ouragan",
		// Official flavor text: "Déclenche un terrible ouragan sur l’ennemi. Peut aussi l’apeurer."
		desc: "A 20 % de chances d'apeurer la cible. La puissance est doublée si la cible utilise Rebond, Vol ou Chute Libre, ou est sous l'effet de Chute Libre.", // NEEDS QC
		shortDesc: "20 % d'apeurer la cible.", // NEEDS QC
		gen4: {
			desc: "A 20 % de chances d'apeurer la cible. La puissance est doublée si la cible utilise Rebond ou Vol.", // NEEDS QC
		},
		gen2: {
			desc: "A 20 % de chances d'apeurer la cible. La puissance est doublée si la cible utilise Vol.", // NEEDS QC
			shortDesc: "20 % d'apeurer la cible.", // NEEDS QC
		},
	},
	upperhand: {
		name: "Prio-Parade",
		// Official flavor text: "Le lanceur réagit instinctivement au moindre mouvement et donne un coup de paume qui apeure la cible. Échoue si cette dernière n'a pas utilisé une attaque prioritaire."
		desc: "A 100 % de chances d'apeurer la cible. Échoue si la cible n'a pas choisi ce tour une attaque physique ou spéciale avec une priorité modifiée supérieure à 0, ou si elle agit avant l'utilisateur.", // NEEDS QC
		shortDesc: "100 % d'apeurer. Échoue sans attaque prioritaire.", // NEEDS QC
	},
	uproar: {
		name: "Brouhaha",
		// Official flavor text: "Le lanceur attaque en rugissant durant trois tours. Pendant ce temps, aucun Pokémon ne peut s’endormir."
		desc: "L'utilisateur reste bloqué sur cette capacité pendant trois tours. Cette capacité cible un adversaire au hasard à chaque tour. Au premier des trois tours, tous les Pokémon actifs endormis se réveillent. Pendant les trois tours, aucun Pokémon actif ne peut s'endormir d'aucune façon, et les Pokémon entrant au combat pendant l'effet ne se réveillent pas. Si l'utilisateur est empêché d'agir ou si l'attaque échoue contre la cible pendant un des tours, l'effet prend fin.", // NEEDS QC
		shortDesc: "Dure 3 tours. Personne ne peut s'endormir.", // NEEDS QC
		gen6: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant trois tours. Cette capacité cible un adversaire adjacent au hasard à chaque tour. Au premier des trois tours, tous les Pokémon actifs endormis se réveillent. Pendant les trois tours, aucun Pokémon actif ne peut s'endormir d'aucune façon, et les Pokémon entrant au combat pendant l'effet ne se réveillent pas. Si l'utilisateur est empêché d'agir ou si l'attaque échoue contre la cible pendant un des tours, l'effet prend fin.", // NEEDS QC
		},
		gen4: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant trois à six tours. Cette capacité cible un adversaire au hasard à chaque tour. Pendant l'effet, aucun Pokémon actif ne peut s'endormir d'aucune façon, et les Pokémon déjà endormis se réveillent au début de leur tour ou à la fin de chaque tour, y compris le dernier. Si l'utilisateur est empêché d'agir ou si l'attaque échoue contre la cible pendant un des tours, l'effet prend fin.", // NEEDS QC
			shortDesc: "Dure 3-6 tours. Personne ne peut s'endormir.", // NEEDS QC
		},
		gen3: {
			desc: "L'utilisateur reste bloqué sur cette capacité pendant deux à cinq tours. Cette capacité cible un Pokémon adverse au hasard à chaque tour. Pendant l'effet, aucun Pokémon actif ne peut s'endormir d'aucune façon, et les Pokémon déjà endormis se réveillent au début de leur tour ou à la fin de chaque tour, y compris le dernier. Si l'utilisateur est empêché d'agir ou si l'attaque échoue contre la cible pendant un des tours, l'effet prend fin.", // NEEDS QC
			shortDesc: "Dure 2-5 tours. Personne ne peut s'endormir.", // NEEDS QC
		},

		start: "  {POKEMON} provoque un brouhaha !",
		end: "  {POKEMON} se calme.",
		upkeep: "  {POKEMON} continue son brouhaha !",
		block: "  Le brouhaha tient {POKEMON} éveillé !",
		blockSelf: "  Le brouhaha empêche {POKEMON} de dormir !",
	},
	uturn: {
		name: "Demi-Tour",
		// Official flavor text: "Après son attaque, le lanceur revient à toute vitesse et change de place avec un Pokémon de l’équipe prêt au combat."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O., ou si la cible a été remplacée grâce à un Bouton Fuite ou aux talents Repli Tactique ou Escampette.", // NEEDS QC
		shortDesc: "Le lanceur se retire après avoir blessé la cible.", // NEEDS QC
		gen6: {
			desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O., ou si la cible a été remplacée grâce à un Bouton Fuite.", // NEEDS QC
		},
		gen4: {
			desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O.", // NEEDS QC
		},

		switchOut: "{POKEMON} revient vers {TRAINER:definite} !",
	},
	vacuumwave: {
		name: "Onde Vide",
		// Official flavor text: "Le lanceur agite son poing pour projeter une onde de vide. Frappe en priorité."
		desc: "Aucun effet supplémentaire.", // NEEDS QC
		shortDesc: "Agit généralement en premier (priorité +1).", // NEEDS QC
	},
	vcreate: {
		name: "Coup Victoire",
		// Official flavor text: "Le lanceur projette une flamme ardente de son front et se jette sur l’ennemi. Baisse la Défense, la Défense Spéciale et la Vitesse."
		desc: "Baisse la Vitesse, la Défense et la Défense Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "-1 Déf, Déf. Spé et Vit. du lanceur.", // NEEDS QC
	},
	veeveevolley: {
		name: "Évo-Chardasso",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est égale à (bonheur de l'utilisateur × 2/5), arrondi à l'inférieur, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Bonheur max : 102 de puissance. Ne rate jamais.", // NEEDS QC
	},
	venomdrench: {
		name: "Piège de Venin",
		// Official flavor text: "Sécrète un liquide empoisonné. Diminue l’Attaque, l’Attaque Spéciale et la Vitesse de l’ennemi empoisonné."
		desc: "Baisse l'Attaque, l'Attaque Spéciale et la Vitesse de la cible d'un niveau si elle est empoisonnée. Échoue si la cible n'est pas empoisonnée.", // NEEDS QC
		shortDesc: "-1 Atq, Atq. Spé et Vit. des ennemis empoisonnés.", // NEEDS QC
	},
	venoshock: {
		name: "Choc Venin",
		// Official flavor text: "Le lanceur inocule un poison spécial à l’ennemi. L’effet est doublé si l’ennemi est déjà empoisonné."
		desc: "La puissance est doublée si la cible est empoisonnée.", // NEEDS QC
		shortDesc: "Puissance doublée contre les cibles empoisonnées.", // NEEDS QC
	},
	victorydance: {
		name: "Danse Victoire",
		// Official flavor text: "Le lanceur danse vigoureusement pour invoquer la victoire, ce qui augmente son Attaque, sa Défense et sa Vitesse."
		desc: "Monte l'Attaque, la Défense et la Vitesse de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "+1 Atq, Déf et Vit. du lanceur.", // NEEDS QC
	},
	vinewhip: {
		name: "Fouet Lianes",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	visegrip: {
		name: "Force Poigne",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	vitalthrow: {
		name: "Corps Perdu",
		// Official flavor text: "Le lanceur porte son coup en dernier. En échange, cette capacité n’échoue jamais."
		desc: "Cette capacité ne vérifie pas la précision.", // NEEDS QC
		shortDesc: "Ne vérifie pas la précision. Agit en dernier.", // NEEDS QC
	},
	voltswitch: {
		name: "Change Éclair",
		// Official flavor text: "Après son attaque, le lanceur revient à toute vitesse et change de place avec un Pokémon de l’équipe prêt au combat."
		desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O., ou si la cible a été remplacée grâce à un Bouton Fuite ou aux talents Repli Tactique ou Escampette.", // NEEDS QC
		shortDesc: "Le lanceur se retire après avoir blessé la cible.", // NEEDS QC
		gen6: {
			desc: "Si cette capacité réussit et que l'utilisateur n'est pas K.O., il quitte le combat, même s'il est piégé, et est immédiatement remplacé par un membre de l'équipe choisi. L'utilisateur ne quitte pas le combat s'il n'y a aucun autre membre d'équipe non K.O., ou si la cible a été remplacée grâce à un Bouton Fuite.", // NEEDS QC
		},

		switchOut: "#uturn",
	},
	volttackle: {
		name: "Électacle",
		// Official flavor text: "Le lanceur électrifie son corps avant de charger. Le choc blesse aussi gravement le lanceur et peut paralyser l’ennemi."
		desc: "A 10 % de chances de paralyser la cible. Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 33 % des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup 33 %. 10 % de paralyser.", // NEEDS QC
		gen4: {
			desc: "A 10 % de chances de paralyser la cible. Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/3 des PV perdus par la cible, arrondi à l'inférieur, avec un minimum de 1 PV.", // NEEDS QC
			shortDesc: "1/3 de contrecoup. 10 % de paralyser.", // NEEDS QC
		},
		gen3: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/3 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
			shortDesc: "A 1/3 de contrecoup.", // NEEDS QC
		},
	},
	wakeupslap: {
		name: "Réveil Forcé",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est doublée si la cible dort. Si l'utilisateur n'est pas K.O., la cible se réveille.", // NEEDS QC
		shortDesc: "x2 contre les endormis, mais les réveille.", // NEEDS QC
		gen4: {
			desc: "La puissance est doublée si la cible dort. Si cette capacité réussit, la cible se réveille.", // NEEDS QC
		},
	},
	waterfall: {
		name: "Cascade",
		// Official flavor text: "Le lanceur charge l’ennemi à une vitesse remarquable, ce qui peut l’apeurer."
		desc: "A 20 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "20 % d'apeurer la cible.", // NEEDS QC
		gen3: {
			desc: "Aucun effet supplémentaire.", // NEEDS QC
			shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
		},
	},
	watergun: {
		name: "Pistolet à O",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	waterpledge: {
		name: "Aire d’Eau",
		// Official flavor text: "Une masse d’eau s’abat sur l’ennemi. En l’utilisant avec Aire de Feu, l’effet augmente et un arc-en-ciel apparaît."
		desc: "Si un des alliés de l'utilisateur a choisi d'utiliser Aire de Feu ou Aire d’Herbe ce tour et n'a pas encore agi, il agit immédiatement après l'utilisateur et la capacité de l'utilisateur ne fait rien. Combinée avec Aire de Feu, l'allié utilise Aire d’Eau avec 150 de puissance et un arc-en-ciel apparaît du côté de l'utilisateur pendant 4 tours, doublant les chances d'effet secondaire, cumulable avec le talent Sérénité, sauf pour les effets qui apeurent, dont la chance ne peut être doublée qu'une fois. Combinée avec Aire d’Herbe, l'allié utilise Aire d’Herbe avec 150 de puissance et un marécage apparaît du côté de la cible pendant 4 tours, divisant par quatre la Vitesse de chaque Pokémon de ce côté. Utilisée en capacité combinée, cette capacité bénéficie du STAB quel que soit le type de l'utilisateur. Cette capacité ne consomme pas la Joyau Eau de l'utilisateur et ne peut pas être redirigée par le talent Lavabo.", // NEEDS QC
		shortDesc: "À combiner avec les autres Vœux pour plus d'effets.", // NEEDS QC

		activate: "  {POKEMON} attend {TARGET}...",
		start: "  Un arc-en-ciel apparaît au-dessus de {TEAM} !",
		end: "  L’arc-en-ciel au-dessus de {TEAM} a disparu !",
	},
	waterpulse: {
		name: "Vibraqua",
		// Official flavor text: "Le lanceur envoie un puissant jet d’eau sur l’ennemi. Peut le rendre confus."
		desc: "A 20 % de chances de rendre la cible confuse.", // NEEDS QC
		shortDesc: "20 % de rendre la cible confuse.", // NEEDS QC
	},
	watershuriken: {
		name: "Sheauriken",
		// Official flavor text: "Attaque l’ennemi avec des shuriken de mucus. Frappe en priorité deux à cinq fois d’affilée en un tour."
		desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois. Si l'utilisateur est un Sachanobi avec le talent Synergie, cette capacité a 20 de puissance et frappe toujours trois fois. Si l'utilisateur tient un Dé Pipé, cette capacité frappe 4 ou 5 fois.", // NEEDS QC
		shortDesc: "Va souvent en premier. Frappe 2 à 5 fois.", // NEEDS QC
		gen8: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
		gen6: {
			desc: "Frappe deux à cinq fois. A 35 % de chances de frapper deux ou trois fois et 15 % de chances de frapper quatre ou cinq fois. Si un des coups brise le clone de la cible, elle subit les dégâts des coups restants. Si l'utilisateur a le talent Multi-Coups, cette capacité frappe toujours cinq fois.", // NEEDS QC
		},
	},
	watersport: {
		name: "Tourniquet",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "Pendant 5 tours, toutes les attaques de type Feu des Pokémon actifs ont leur puissance multipliée par 0,33. Échoue si cet effet est déjà actif.", // NEEDS QC
		shortDesc: "5 tours : les attaques Feu font 1/3 des dégâts.", // NEEDS QC
		gen5: {
			desc: "Tant que l'utilisateur est au combat, toutes les attaques de type Feu des Pokémon actifs ont leur puissance multipliée par 0,33. Échoue si cet effet est déjà actif pour un Pokémon.", // NEEDS QC
			shortDesc: "Réduit les attaques Feu à 1/3 de leur puissance.", // NEEDS QC
		},
		gen4: {
			desc: "Tant que l'utilisateur est au combat, toutes les attaques de type Feu des Pokémon actifs ont leur puissance réduite de moitié. Échoue si cet effet est déjà actif pour l'utilisateur. Relais peut transmettre cet effet à un allié.", // NEEDS QC
			shortDesc: "Réduit les attaques Feu à 1/2 de leur puissance.", // NEEDS QC
		},
	},
	waterspout: {
		name: "Giclédo",
		// Official flavor text: "Le lanceur attaque avec un jet d’eau. Moins il a de PV et moins l’attaque est puissante."
		desc: "La puissance est égale à (PV actuels de l'utilisateur × 150 / PV max de l'utilisateur), arrondi à l'inférieur, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Moins de PV = moins puissant. Touche les ennemis.", // NEEDS QC
	},
	wavecrash: {
		name: "Aquatacle",
		// Official flavor text: "Le lanceur se recouvre entièrement d'eau avant de charger sa cible. Cela blesse aussi gravement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 33 % des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 33 % des dégâts.", // NEEDS QC
	},
	weatherball: {
		name: "Ball’Météo",
		// Official flavor text: "Une attaque dont la puissance et le type varient en fonction du temps qu’il fait."
		desc: "La puissance est doublée si une météo autre que Vent mystérieux est active, et le type de cette capacité change en conséquence : type Glace sous la neige, type Eau sous Pluie battante ou Pluie, type Roche sous la tempête de sable et type Feu sous Soleil intense ou Soleil. Si l'utilisateur tient un Parapluie Solide et utilise cette capacité sous Pluie battante, Pluie, Soleil intense ou Soleil, elle reste de type Normal et sa puissance n'est pas doublée.", // NEEDS QC
		shortDesc: "Sous une météo : puissance x2 et type variable.", // NEEDS QC
		gen8: {
			desc: "La puissance est doublée si une météo autre que Vent mystérieux est active, et le type de cette capacité change en conséquence : type Glace sous Grêle, type Eau sous Pluie battante ou Pluie, type Roche sous Tempête de Sable et type Feu sous Soleil intense ou Soleil. Si l'utilisateur tient un Parapluie Solide et utilise cette capacité sous Pluie battante, Pluie, Soleil intense ou Soleil, elle reste de type Normal et sa puissance n'est pas doublée.", // NEEDS QC
		},
		gen5: {
			desc: "La puissance est doublée si une météo est active, et le type de cette capacité change en conséquence : type Glace sous Grêle, type Eau sous Pluie, type Roche sous Tempête de Sable et type Feu sous Soleil.", // NEEDS QC
		},
		gen3: {
			desc: "Les dégâts sont doublés si une météo est active, et le type de cette capacité change en conséquence : type Glace sous Grêle, type Eau sous Pluie, type Roche sous Tempête de Sable et type Feu sous Soleil.", // NEEDS QC
			shortDesc: "Dégâts x2 et type variable selon la météo.", // NEEDS QC
		},

		move: "La météo change Turbo-Charge Bulldozer en {MOVE} !",
	},
	whirlpool: {
		name: "Siphon",
		// Official flavor text: "Piège l’ennemi dans une trombe d’eau pendant quatre à cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max (1/8 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours (toujours cinq si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
			shortDesc: "Piège et blesse la cible pendant 2-5 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours. Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle utilise Relais. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},

		start: "  {POKEMON} est piégé dans le tourbillon !",
	},
	whirlwind: {
		name: "Cyclone",
		// Official flavor text: "Éjecte le Pokémon ennemi et le remplace par un autre. Lors d’un combat contre un Pokémon sauvage seul, met fin au combat."
		desc: "La cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Échoue si la cible est le dernier Pokémon non K.O. de son équipe, si elle a utilisé Racines ou si elle a le talent Ventouse.", // NEEDS QC
		shortDesc: "La cible est remplacée par un allié au hasard.", // NEEDS QC
		gen4: {
			desc: "La cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Échoue si la cible est le dernier Pokémon non K.O. de son équipe, si elle a utilisé Racines ou si elle a le talent Ventouse, ou si le niveau de l'utilisateur est inférieur à celui de la cible et que X × (niveau de l'utilisateur + niveau de la cible) / 256 + 1 est inférieur ou égal à (niveau de la cible / 4), arrondi à l'inférieur, où X est un nombre aléatoire entre 0 et 255.", // NEEDS QC
		},
		gen2: {
			desc: "La cible est forcée de quitter le combat et est remplacée par un allié non K.O. choisi au hasard. Échoue si la cible est le dernier Pokémon non K.O. de son équipe, ou si l'utilisateur agit avant la cible.", // NEEDS QC
		},
		gen1: {
			desc: "Aucune utilité en combat.", // NEEDS QC
			shortDesc: "Aucune utilité en combat.", // NEEDS QC
		},
	},
	wickedblow: {
		name: "Poing Obscur",
		// Official flavor text: "Le lanceur assène un coup puissant à l’ennemi. Cette technique qui inflige toujours un coup critique est réservée à ceux qui maîtrisent la puissance des Ténèbres."
		desc: "Cette capacité porte toujours un coup critique, sauf si la cible est sous l'effet de Air Veinard ou a le talent Armurbaston ou Coque Armure.", // NEEDS QC
		shortDesc: "Porte toujours un coup critique.", // NEEDS QC
	},
	wickedtorque: {
		name: "Crash Obscur",
		desc: "A 10 % de chances d'endormir la cible.", // NEEDS QC
		shortDesc: "10 % d'endormir la cible.", // NEEDS QC
	},
	wideguard: {
		name: "Garde Large",
		// Official flavor text: "Annule les attaques visant toute l’équipe pendant un tour."
		desc: "L'utilisateur et son équipe sont protégés des capacités des autres Pokémon, alliés compris, qui ciblent tous les adversaires adjacents ou tous les Pokémon adjacents pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Rempart Brûlant, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Piège de Fil, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		shortDesc: "Protège l'équipe des capacités multicibles.", // NEEDS QC
		gen8: {
			desc: "L'utilisateur et son équipe sont protégés des capacités des autres Pokémon, alliés compris, qui ciblent tous les adversaires adjacents ou tous les Pokémon adjacents pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Gardomax, Blocage, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		},
		gen7: {
			desc: "L'utilisateur et son équipe sont protégés des capacités des autres Pokémon, alliés compris, qui ciblent tous les adversaires adjacents ou tous les Pokémon adjacents pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Blockhaus, Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		},
		gen6: {
			desc: "L'utilisateur et son équipe sont protégés des attaques infligeant des dégâts des autres Pokémon, alliés compris, qui ciblent tous les adversaires adjacents ou tous les Pokémon adjacents pendant ce tour. Cette capacité modifie le même compteur de 1 chance sur X que les autres capacités de protection, où X commence à 1 et triple à chaque utilisation réussie, mais n'utilise pas cette chance pour déterminer son échec. X revient à 1 si cette capacité échoue, si la dernière capacité utilisée par l'utilisateur n'est pas Détection, Ténacité, Bouclier Royal, Abri, Prévention, Pico-Défense ou Garde Large, ou si c'était une de ces capacités et que la protection de l'utilisateur a été brisée. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
			shortDesc: "Protège l'équipe des attaques multicibles ce tour.", // NEEDS QC
		},
		gen5: {
			desc: "L'utilisateur et son équipe sont protégés des attaques infligeant des dégâts des autres Pokémon, alliés compris, qui ciblent tous les adversaires adjacents ou tous les Pokémon adjacents pendant ce tour. Cette capacité a 1 chance sur X de réussir, où X commence à 1 et double à chaque utilisation réussie. X revient à 1 si cette capacité échoue ou si la dernière capacité utilisée par l'utilisateur n'est pas Détection, Ténacité, Abri, Prévention ou Garde Large. Si X vaut 256 ou plus, cette capacité a 1 chance sur 2^32 de réussir. Échoue si l'utilisateur agit en dernier ce tour ou si cet effet est déjà actif de son côté.", // NEEDS QC
		},

		start: "  {TEAM} est protégé par la capacité Garde Large !",
		block: "  {POKEMON} est protégé par la capacité Garde Large !",
	},
	wildboltstorm: {
		name: "Typhon Fulgurant",
		// Official flavor text: "Le lanceur déclenche un violent typhon orageux dont les rafales et la foudre frappent la cible, ce qui peut aussi la paralyser."
		desc: "A 20 % de chances de paralyser la cible. Si la météo est Pluie battante ou Pluie, cette capacité ne vérifie pas la précision. Si elle est utilisée contre un Pokémon tenant un Parapluie Solide, sa précision reste à 80 %.", // NEEDS QC
		shortDesc: "20 % de paralyser. Ne rate pas sous la pluie.", // NEEDS QC
	},
	wildcharge: {
		name: "Éclair Fou",
		// Official flavor text: "Une charge électrique violente qui blesse aussi légèrement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 1/4 des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 1/4 des dégâts.", // NEEDS QC
	},
	willowisp: {
		name: "Feu Follet",
		// Official flavor text: "Lance un bouquet de flammes maléfiques à l’ennemi pour lui infliger une brûlure."
		desc: "Brûle la cible.", // NEEDS QC
		shortDesc: "Brûle la cible.", // NEEDS QC
	},
	wingattack: {
		name: "Cru-Ailes",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	wish: {
		name: "Vœu",
		// Official flavor text: "Un vœu qui permet au lanceur ou au Pokémon entrant sur le terrain au tour suivant de récupérer la moitié des PV max du lanceur."
		desc: "À la fin du tour suivant, le Pokémon à la position de l'utilisateur récupère la moitié des PV max de l'utilisateur, arrondi à l'inférieur. Échoue si cet effet est déjà actif pour la position de l'utilisateur.", // NEEDS QC
		shortDesc: "Au tour suivant, récupère la moitié de ses PV max.", // NEEDS QC
		gen4: {
			desc: "À la fin du tour suivant, le Pokémon à la position de l'utilisateur récupère la moitié de ses propres PV max, arrondi à l'inférieur. Échoue si cet effet est déjà actif pour la position de l'utilisateur.", // NEEDS QC
			shortDesc: "Au tour suivant, soigne 50 % des PV max du receveur.", // NEEDS QC
		},

		heal: "  Le vœu {NICKNAME:de} se réalise !",
	},
	withdraw: {
		name: "Repli",
		// Official flavor text: "Le lanceur se recroqueville dans sa carapace, ce qui augmente sa Défense."
		desc: "Monte la Défense de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte la Défense du lanceur d'un niveau.", // NEEDS QC
	},
	wonderroom: {
		name: "Zone Étrange",
		// Official flavor text: "Le lanceur crée une zone mystérieuse où la Défense et la Défense Spéciale de tous les Pokémon sont inversées pendant cinq tours."
		desc: "Pendant 5 tours, tous les Pokémon actifs ont leur Défense et leur Défense Spéciale échangées. Les changements de niveaux ne sont pas affectés. Si cette capacité est utilisée pendant l'effet, celui-ci prend fin.", // NEEDS QC
		shortDesc: "5 tours : les Défenses et Déf. Spé sont échangées.", // NEEDS QC
	},
	woodhammer: {
		name: "Martobois",
		// Official flavor text: "Le lanceur heurte l’ennemi de son corps robuste. Blesse aussi gravement le lanceur."
		desc: "Si la cible a perdu des PV, l'utilisateur subit un contrecoup égal à 33 % des PV perdus par la cible, arrondi au supérieur à partir de 0,5, avec un minimum de 1 PV.", // NEEDS QC
		shortDesc: "Contrecoup de 33 % des dégâts.", // NEEDS QC
		gen4: {
			desc: "Si la cible a perdu des PV, l'utilisateur subit des dégâts de contrecoup égaux à 1/3 des PV perdus par la cible, arrondi à l'inférieur, mais pas moins de 1 PV.", // NEEDS QC
			shortDesc: "A 1/3 de contrecoup.", // NEEDS QC
		},
	},
	workup: {
		name: "Rengorgement",
		// Official flavor text: "Le lanceur se rengorge. Augmente l’Attaque et l’Attaque Spéciale."
		desc: "Monte l'Attaque et l'Attaque Spéciale de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Monte l'Attaque et l'Atq. Spé du lanceur d'un niveau.", // NEEDS QC
	},
	worryseed: {
		name: "Soucigraine",
		// Official flavor text: "Plante sur la cible une graine qui la rend soucieuse et remplace son talent par Insomnia, l’empêchant ainsi de dormir."
		desc: "Le talent de la cible devient Insomnia. Échoue si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Insomnia, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Téramorphose, Absentéisme, Mode Transe ou Supermutation.", // NEEDS QC
		shortDesc: "Le talent de la cible devient Insomnia.", // NEEDS QC
		gen8: {
			desc: "Le talent de la cible devient Insomnia. Échoue si le talent de la cible est Osmose Équine, Synergie, Hypersommeil, Fantômasque, Dégobage, Tête de Gel, Insomnia, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Absentéisme ou Mode Transe.", // NEEDS QC
		},
		gen7: {
			desc: "Le talent de la cible devient Insomnia. Échoue si le talent de la cible est Synergie, Hypersommeil, Fantômasque, Insomnia, Multi-Type, Rassemblement, Système Alpha, Banc, Bouclier-Carcan, Déclic Tactique, Absentéisme ou Mode Transe.", // NEEDS QC
		},
		gen6: {
			desc: "Le talent de la cible devient Insomnia. Échoue si le talent de la cible est Insomnia, Multi-Type, Déclic Tactique ou Absentéisme.", // NEEDS QC
		},
		gen5: {
			desc: "Le talent de la cible devient Insomnia. Échoue si le talent de la cible est Insomnia, Multi-Type ou Absentéisme.", // NEEDS QC
		},
		gen4: {
			desc: "Le talent de la cible devient Insomnia. Échoue si le talent de la cible est Multi-Type ou Absentéisme, ou si la cible tient un Orbe Platiné.", // NEEDS QC
		},
	},
	wrap: {
		name: "Ligotage",
		// Official flavor text: "Le lanceur ligote l’ennemi avec des lianes ou son corps pour l’écraser durant quatre à cinq tours."
		desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Queulonage, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Toupie Éclat, Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		shortDesc: "Piège et blesse la cible pendant 4 ou 5 tours.", // NEEDS QC
		gen8: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Eau Revoir, Dernier Mot, Téléport, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen7: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/8 de ses PV max (1/6 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Dernier Mot, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen5: {
			desc: "Empêche la cible de quitter le combat pendant quatre ou cinq tours (sept si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max (1/8 si l'utilisateur tient un Bande Étreinte), arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais, Demi-Tour ou Change Éclair. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen4: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours (toujours cinq si l'utilisateur tient un Accro Griffe). Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle tient une Carapace Mue ou utilise Relais ou Demi-Tour. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
			shortDesc: "Piège et blesse la cible pendant 2-5 tours.", // NEEDS QC
		},
		gen3: {
			desc: "Empêche la cible de quitter le combat pendant deux à cinq tours. Inflige à la cible des dégâts égaux à 1/16 de ses PV max, arrondi à l'inférieur, à la fin de chaque tour pendant l'effet. La cible peut tout de même être remplacée si elle utilise Relais. L'effet prend fin si l'utilisateur ou la cible quitte le terrain, ou si la cible utilise Tour Rapide ou Clonage avec succès. Cet effet n'est pas cumulable et n'est pas réinitialisé par une nouvelle capacité de ce genre.", // NEEDS QC
		},
		gen1: {
			desc: "L'utilisateur utilise cette capacité pendant deux à cinq tours. A 3/8 de chances de durer deux ou trois tours et 1/8 de chances de durer quatre ou cinq tours. Les dégâts calculés au premier tour sont repris pour chaque autre tour. L'utilisateur ne peut pas choisir de capacité et la cible ne peut pas exécuter de capacité pendant l'effet, mais tous deux peuvent être remplacés. Si l'utilisateur est remplacé, la cible reste incapable d'agir ce tour-là. Si la cible est remplacée, l'utilisateur utilise à nouveau cette capacité automatiquement, et si elle avait 0 PP à ce moment, ils passent à 63. Si l'utilisateur ou la cible est remplacé, ou si l'utilisateur est empêché d'agir, l'effet prend fin. Cette capacité peut empêcher la cible d'agir même si elle a une immunité de type, mais n'inflige alors pas de dégâts.", // NEEDS QC
			shortDesc: "La cible ne peut pas agir pendant 2-5 tours.", // NEEDS QC
		},

		start: "  {POKEMON} est ligoté par {SOURCE} !",
		move: "{POKEMON} attaque encore!",
	},
	wringout: {
		name: "Essorage",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "La puissance est égale à 120 × (PV actuels de la cible / PV max de la cible), arrondi à l'inférieur à partir de 0,5, avec un minimum de 1.", // NEEDS QC
		shortDesc: "Plus puissant si la cible a beaucoup de PV.", // NEEDS QC
		gen4: {
			desc: "La puissance est égale à 120 × (PV actuels de la cible ÷ PV max de la cible) + 1, arrondi à l'inférieur.", // NEEDS QC
		},
	},
	xscissor: {
		name: "Plaie Croix",
		shortDesc: "Aucun effet supplémentaire.", // NEEDS QC
	},
	yawn: {
		name: "Bâillement",
		// Official flavor text: "Fait bâiller l’ennemi qui s’endort au tour suivant."
		desc: "Endort la cible à la fin du tour suivant. Échoue à l'utilisation si la cible ne peut pas s'endormir ou si elle a déjà un problème de statut. À la fin du tour suivant, si la cible est toujours au combat, n'a pas de problème de statut et peut s'endormir, elle s'endort. Une fois la cible affectée, cet effet ne peut être empêché ni par Rune Protect ni par un clone, ni en s'endormant et se réveillant pendant l'effet.", // NEEDS QC
		shortDesc: "Endort la cible à la fin du tour suivant.", // NEEDS QC

		start: "  Ça rend {POKEMON} somnolent !",
	},
	zapcannon: {
		name: "Élecanon",
		// Official flavor text: "Un boulet de canon électrifié qui inflige des dégâts et paralyse l’ennemi."
		desc: "A 100 % de chances de paralyser la cible.", // NEEDS QC
		shortDesc: "100 % de paralyser la cible.", // NEEDS QC
	},
	zenheadbutt: {
		name: "Psykoud’Boul",
		// Official flavor text: "Le lanceur concentre sa volonté et donne un coup de tête. Peut aussi apeurer l’ennemi."
		desc: "A 20 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "20 % d'apeurer la cible.", // NEEDS QC
	},
	zingzap: {
		name: "Électrikipik",
		// Official flavor text: "Le lanceur fonce sur la cible et lui envoie un puissant choc électrique. Peut aussi l’effrayer."
		desc: "A 30 % de chances d'apeurer la cible.", // NEEDS QC
		shortDesc: "30 % d'apeurer la cible.", // NEEDS QC
	},
	zippyzap: {
		name: "Pika-Sprint",
		// Official flavor text: "Cette capacité ne peut pas être utilisée. Il est recommandé de l’oublier, même s’il sera impossible de se la remémorer une fois oubliée."
		desc: "A 100 % de chances de monter l'esquive de l'utilisateur d'un niveau.", // NEEDS QC
		shortDesc: "Agit en premier. Monte son esquive d'un niveau.", // NEEDS QC
		gen7: {
			desc: "Porte toujours un coup critique.", // NEEDS QC
			shortDesc: "Agit presque toujours en premier. Toujours critique.", // NEEDS QC
		},
	},
};
