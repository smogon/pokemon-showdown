// Mechanics desc style (es): official game terminology. Terminology: el portador (holder),
//   el usuario (user), el objetivo (target), efecto secundario (secondary effect), hacer
//   retroceder (flinch), golpe crítico (crit), niveles (stat stages), redondeado hacia
//   abajo/arriba (rounded down/up), características (stats), un solo uso (single use).
// Cross-references generated from name fields / pokedex-names.ts. CAP entities keep name
//   null (English fallback); descs are translated with English names inline.

export const ItemsText: { [id: IDEntry]: ItemText } = {
	abilityshield: {
		name: "Escudo Habilidad",
		grammar: "ms",
		shortDesc: "La habilidad del portador no puede cambiarse, anularse ni ignorarse.", // NEEDS QC

		block: "  ¡El Escudo Habilidad ha protegido la habilidad de {POKEMON}!",
	},
	abomasite: {
		name: "Abomasnowita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Abomasnow, le permite megaevolucionar en combate.", // NEEDS QC
	},
	absolite: {
		name: "Absolita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Absol, le permite megaevolucionar en Mega Absol.", // NEEDS QC
	},
	absolitez: {
		name: "Absolita Z",
		grammar: "fs",
		shortDesc: "Si lo lleva un Absol, le permite megaevolucionar en Mega Absol Z.", // NEEDS QC
	},
	absorbbulb: {
		name: "Tubérculo",
		grammar: "ms",
		shortDesc: "Sube 1 nivel su Ataque Esp. si lo golpea un ataque de tipo Agua. Un solo uso.", // NEEDS QC
	},
	adamantcrystal: {
		name: "Gran Diamansfera",
		grammar: "fs",
		shortDesc: "Si lo lleva Dialga, sus ataques de Acero y Dragón tienen 1,2× de potencia.", // NEEDS QC
	},
	adamantorb: {
		name: "Diamansfera",
		grammar: "fs",
		shortDesc: "Si lo lleva Dialga, sus ataques de Acero y Dragón tienen 1,2× de potencia.", // NEEDS QC
	},
	adrenalineorb: {
		name: "Nerviosfera",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Velocidad si lo afecta Intimidación. Un solo uso.", // NEEDS QC
	},
	aerodactylite: {
		name: "Aerodactylita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Aerodactyl, le permite megaevolucionar en combate.", // NEEDS QC
	},
	aggronite: {
		name: "Aggronita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Aggron, le permite megaevolucionar en combate.", // NEEDS QC
	},
	aguavberry: {
		name: "Baya Guaya",
		grammar: "fs",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde a naturalezas -Def. Esp. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde a naturalezas -Def. Esp. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde a naturalezas -Def. Esp. 1 uso.", // NEEDS QC
		},
	},
	airballoon: {
		name: "Globo Helio",
		grammar: "ms",
		shortDesc: "El portador es inmune a los ataques de tipo Tierra. Explota al ser golpeado.", // NEEDS QC

		start: "  ¡{POKEMON} está flotando con un Globo Helio!",
		end: "  ¡Ha explotado el Globo Helio de {POKEMON}!",
	},
	alakazite: {
		name: "Alakazamita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Alakazam, le permite megaevolucionar en combate.", // NEEDS QC
	},
	aloraichiumz: {
		name: "Alo-Raistal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Raichu de Alola con Rayo, puede usar Surfeo Galvánico.", // NEEDS QC
	},
	altarianite: {
		name: "Altarianita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Altaria, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ampharosite: {
		name: "Ampharosita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Ampharos, le permite megaevolucionar en combate.", // NEEDS QC
	},
	apicotberry: {
		name: "Baya Aricoc",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Defensa Esp. con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	armorfossil: {
		name: "Fósil Coraza",
		grammar: "ms",
		shortDesc: "Puede revivirse como Shieldon.", // NEEDS QC
	},
	aspearberry: {
		name: "Baya Perasi",
		grammar: "fs",
		shortDesc: "Cura la congelación del portador. Un solo uso.", // NEEDS QC
	},
	assaultvest: {
		name: "Chaleco Asalto",
		grammar: "ms",
		shortDesc: "Su Defensa Esp. se multiplica por 1,5, pero solo puede elegir ataques.", // NEEDS QC
	},
	audinite: {
		name: "Audinita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Audino, le permite megaevolucionar en combate.", // NEEDS QC
	},
	auspiciousarmor: {
		name: "Armadura Auspiciosa",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Charcadet en Armarouge al usarse.", // NEEDS QC
	},
	babiriberry: {
		name: "Baya Baribá",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Acero. Un solo uso.", // NEEDS QC
	},
	banettite: {
		name: "Banettita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Banette, le permite megaevolucionar en combate.", // NEEDS QC
	},
	barbaracite: {
		name: "Barbaraclita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Barbaracle, le permite megaevolucionar en combate.", // NEEDS QC
	},
	baxcalibrite: {
		name: "Baxcaliburita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Baxcalibur, le permite megaevolucionar en combate.", // NEEDS QC
	},
	beastball: {
		name: "Ente Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball especial diseñada para atrapar Ultraentes.", // NEEDS QC
	},
	beedrillite: {
		name: "Beedrillita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Beedrill, le permite megaevolucionar en combate.", // NEEDS QC
	},
	belueberry: {
		name: "Baya Andano",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	berryjuice: {
		name: "Zumo de Baya",
		grammar: "ms",
		shortDesc: "Restaura 20 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	berrysweet: {
		name: "Confite Fruto",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	bignugget: {
		name: "Maxipepita de Oro", // renamed in LZA (SV: Maxipepita)
		grammar: "fs",
		shortDesc: "Una gran pepita de oro puro con un brillo reluciente.", // NEEDS QC
	},
	bigroot: {
		name: "Raíz Grande",
		grammar: "fs",
		shortDesc: "Recupera 1,3× de PS con drenados, Acua Aro, Arraigo, Drenadoras y Absorbefuerza.", // NEEDS QC
		gen6: {
			shortDesc: "Recupera 1,3× de PS con drenados, Acua Aro, Arraigo y Drenadoras.", // NEEDS QC
		},
	},
	bindingband: {
		name: "Banda Atadura",
		grammar: "fs",
		shortDesc: "Sus movimientos de atadura infligen 1/6 de los PS máximos por turno en vez de 1/8.", // NEEDS QC
	},
	blackbelt: {
		name: "Cinturón Negro",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Lucha del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Lucha del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	blacksludge: {
		name: "Lodo Negro",
		grammar: "ms",
		shortDesc: "Cada turno, un portador de tipo Veneno recupera 1/16 de sus PS; si no, pierde 1/8.", // NEEDS QC

		heal: "  ¡{POKEMON} ha recuperado unos pocos PS gracias al Lodo Negro!",
	},
	blackglasses: {
		name: "Gafas de Sol",
		grammar: "fp",
		shortDesc: "Los ataques de tipo Siniestro del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Siniestro del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	blastoisinite: {
		name: "Blastoisita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Blastoise, le permite megaevolucionar en combate.", // NEEDS QC
	},
	blazikenite: {
		name: "Blazikenita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Blaziken, le permite megaevolucionar en combate.", // NEEDS QC
	},
	blueorb: {
		name: "Prisma Azul",
		grammar: "ms",
		shortDesc: "Si lo lleva un Kyogre, activa su regresión primigenia en combate.", // NEEDS QC
	},
	blukberry: {
		name: "Baya Oram",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	blunderpolicy: {
		name: "Seguro de Fallo", // renamed in LZA (SV: Seguro Fallo)
		grammar: "ms",
		shortDesc: "Si falla por precisión, su Velocidad sube 2 niveles. Un solo uso.", // NEEDS QC
	},
	boosterenergy: {
		name: "Energía Potenciadora",
		grammar: "fs",
		shortDesc: "Activa las habilidades Paleosíntesis o Carga Cuark. Un solo uso.", // NEEDS QC
	},
	bottlecap: {
		name: "Chapa Plateada",
		grammar: "fs",
		shortDesc: "Para el Entrenamiento Extremo: una característica se calcula con IV 31.", // NEEDS QC
	},
	brightpowder: {
		name: "Polvo Brillo",
		grammar: "mu",
		classified: {
			name: "saquito de Polvo Brillo",
			grammar: "ms",
		},
		shortDesc: "La precisión de los ataques contra el portador se multiplica por 0,9.", // NEEDS QC
		gen2: {
			shortDesc: "Un ataque contra el portador pierde 20 puntos de precisión sobre 255.", // NEEDS QC
		},
	},
	buggem: {
		name: "Gema Bicho",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Bicho tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Bicho tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	buginiumz: {
		name: "Insectostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Bicho si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	bugmemory: {
		name: "Disco Bicho",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Bicho.", // NEEDS QC
	},
	burndrive: {
		name: "PiroROM",
		grammar: "fs", // NEEDS QC
		shortDesc: "El Tecno Shock del portador es de tipo Fuego.", // NEEDS QC
	},
	cameruptite: {
		name: "Cameruptita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Camerupt, le permite megaevolucionar en combate.", // NEEDS QC
	},
	cellbattery: {
		name: "Pila",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Ataque si lo golpea un ataque de tipo Eléctrico. Un solo uso.", // NEEDS QC
	},
	chandelurite: {
		name: "Chandelurita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Chandelure, le permite megaevolucionar en combate.", // NEEDS QC
	},
	charcoal: {
		name: "Carbón",
		grammar: "mu",
		classified: {
			name: "trozo de Carbón",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Fuego del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Fuego del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	charizarditex: {
		name: "Charizardita X",
		grammar: "fs",
		shortDesc: "Si lo lleva un Charizard, le permite megaevolucionar en Mega Charizard X.", // NEEDS QC
	},
	charizarditey: {
		name: "Charizardita Y",
		grammar: "fs",
		shortDesc: "Si lo lleva un Charizard, le permite megaevolucionar en Mega Charizard Y.", // NEEDS QC
	},
	chartiberry: {
		name: "Baya Alcho",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Roca. Un solo uso.", // NEEDS QC
	},
	cheriberry: {
		name: "Baya Zreza",
		grammar: "fs",
		shortDesc: "Cura la parálisis del portador. Un solo uso.", // NEEDS QC
	},
	cherishball: {
		name: "Gloria Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball rara creada para conmemorar una ocasión.", // NEEDS QC
	},
	chesnaughtite: {
		name: "Chesnaughtita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Chesnaught, le permite megaevolucionar en combate.", // NEEDS QC
	},
	chestoberry: {
		name: "Baya Atania",
		grammar: "fs",
		shortDesc: "Despierta al portador si está dormido. Un solo uso.", // NEEDS QC
	},
	chilanberry: {
		name: "Baya Chilan",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque de tipo Normal. Un solo uso.", // NEEDS QC
	},
	chilldrive: {
		name: "CrioROM",
		grammar: "fs", // NEEDS QC
		shortDesc: "El Tecno Shock del portador es de tipo Hielo.", // NEEDS QC
	},
	chimechite: {
		name: "Chimechita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Chimecho, le permite megaevolucionar en combate.", // NEEDS QC
	},
	chippedpot: {
		name: "Tetera Rota",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Sinistea Genuina en Polteageist Genuina al usarse.", // NEEDS QC
	},
	choiceband: {
		name: "Cinta Elección",
		grammar: "fs",
		shortDesc: "Su Ataque se multiplica por 1,5, pero solo puede usar su primer movimiento.", // NEEDS QC
	},
	choicescarf: {
		name: "Pañuelo Elección",
		grammar: "ms",
		shortDesc: "Su Velocidad se multiplica por 1,5, pero solo puede usar su primer movimiento.", // NEEDS QC
	},
	choicespecs: {
		name: "Gafas Elección",
		grammar: "fp",
		shortDesc: "Su Ataque Esp. se multiplica por 1,5, pero solo puede usar su primer movimiento.", // NEEDS QC
	},
	chopleberry: {
		name: "Baya Pomaro",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Lucha. Un solo uso.", // NEEDS QC
	},
	clawfossil: {
		name: "Fósil Garra",
		grammar: "ms",
		shortDesc: "Puede revivirse como Anorith.", // NEEDS QC
	},
	clearamulet: {
		name: "Amuleto Puro",
		grammar: "ms",
		shortDesc: "Impide que otros Pokémon bajen las características del portador.", // NEEDS QC

		block: "  ¡El Amuleto Puro ha impedido que disminuyan las características de {POKEMON}!",
	},
	clefablite: {
		name: "Clefablita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Clefable, le permite megaevolucionar en combate.", // NEEDS QC
	},
	cloversweet: {
		name: "Confite Trébol",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	cobaberry: {
		name: "Baya Kouba",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Volador. Un solo uso.", // NEEDS QC
	},
	colburberry: {
		name: "Baya Dillo",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Siniestro. Un solo uso.", // NEEDS QC
	},
	cornerstonemask: {
		name: "Máscara Cimiento",
		grammar: "fs",
		shortDesc: "Ogerpon Máscara Cimiento: 1,2× de potencia; Evocarrecuerdos al teracristalizar.", // NEEDS QC
	},
	cornnberry: {
		name: "Baya Mais",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	coverfossil: {
		name: "Fósil Tapa",
		grammar: "ms",
		shortDesc: "Puede revivirse como Tirtouga.", // NEEDS QC
	},
	covertcloak: {
		name: "Capa Furtiva",
		grammar: "fs",
		desc: "El portador no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Entre los efectos evitados se incluyen los que tienen una probabilidad (incluso del 100%) de causar parálisis, sueño, congelación, quemadura, envenenamiento, confusión, hacer retroceder al portador o bajar sus características, así como los efectos de Anclaje, Conjuro Funesto, Lanzamiento, Psicorruido, Salazón, Puntada Sombría, Bomba Caramelo y Golpe Mordaza. El efecto de Aria Burbuja se evita solo si el portador es el único objetivo. También se evitan los efectos añadidos por Roca del Rey, Colmillo Agudo y las habilidades Toque Tóxico, Hedor y Cadena Tóxica.", // NEEDS QC
		shortDesc: "El portador no sufre los efectos secundarios de los ataques de otros Pokémon.", // NEEDS QC
	},
	crabominite: {
		name: "Crabominablita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Crabominable, le permite megaevolucionar en combate.", // NEEDS QC
	},
	crackedpot: {
		name: "Tetera Agrietada",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Sinistea en Polteageist al usarse.", // NEEDS QC
	},
	custapberry: {
		name: "Baya Chiri",
		grammar: "fs",
		shortDesc: "Actúa primero dentro de su prioridad con 1/4 o menos de sus PS. Un solo uso.", // NEEDS QC

		activate: "  ¡{POKEMON} puede tener prioridad gracias a la Baya Chiri!", // Champions; SV: ¡Gracias a la Baya Chiri, {POKEMON} puede tener prioridad!
	},
	damprock: {
		name: "Roca Lluvia",
		grammar: "fs",
		shortDesc: "Su Danza Lluvia dura 8 turnos en lugar de 5.", // NEEDS QC
	},
	darkgem: {
		name: "Gema Siniestro", // renamed in SV (SwSh: Gema Siniestra)
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Siniestro tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Siniestro tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	darkiniumz: {
		name: "Nictostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Siniestro si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	darkmemory: {
		name: "Disco Siniestro",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Siniestro.", // NEEDS QC
	},
	darkranite: {
		name: "Darkrainita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Darkrai, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dawnstone: {
		name: "Piedra Alba",
		grammar: "fs",
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Brilla como un lucero."
		desc: "Al usarla, un Kirlia macho evoluciona a Gallade y un Snorunt hembra evoluciona a Froslass.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	decidiumz: {
		name: "Dueyestal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Decidueye con Puntada Sombría, puede usar Aluvión de Flechas Sombrías.", // NEEDS QC
	},
	deepseascale: {
		name: "Escama Marina",
		grammar: "fs",
		// Official flavor text: "Tiene un débil brillo rosado y debe llevarla Clamperl. Sube la Defensa Especial."
		desc: "Si la lleva un Clamperl, su Defensa Especial se duplica. Si la lleva al intercambiarlo, Clamperl evoluciona a Gorebyss.", // NEEDS QC
		shortDesc: "Si lo lleva un Clamperl, su Defensa Esp. se duplica.", // NEEDS QC
	},
	deepseatooth: {
		name: "Diente Marino",
		grammar: "ms",
		// Official flavor text: "Tiene el brillo afilado de la plata y debe llevarlo Clamperl. Sube el Ataque Especial."
		desc: "Si lo lleva un Clamperl, su Ataque Especial se duplica. Si lo lleva al intercambiarlo, Clamperl evoluciona a Huntail.", // NEEDS QC
		shortDesc: "Si lo lleva un Clamperl, su Ataque Esp. se duplica.", // NEEDS QC
	},
	delphoxite: {
		name: "Delphoxita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Delphox, le permite megaevolucionar en combate.", // NEEDS QC
	},
	destinyknot: {
		name: "Lazo Destino",
		grammar: "ms",
		shortDesc: "Si el portador queda enamorado, el otro Pokémon también.", // NEEDS QC
	},
	diancite: {
		name: "Diancita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Diancie, le permite megaevolucionar en combate.", // NEEDS QC
	},
	diveball: {
		name: "Buceo Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball que funciona especialmente bien bajo el agua.", // NEEDS QC
	},
	domefossil: {
		name: "Fósil Domo",
		grammar: "ms",
		shortDesc: "Puede revivirse como Kabuto.", // NEEDS QC
	},
	dousedrive: {
		name: "HidroROM",
		grammar: "fs", // NEEDS QC
		shortDesc: "El Tecno Shock del portador es de tipo Agua.", // NEEDS QC
	},
	dracoplate: {
		name: "Tabla Draco",
		grammar: "fs",
		shortDesc: "Ataques de tipo Dragón: 1,2× de potencia. Sentencia es de tipo Dragón.", // NEEDS QC
	},
	dragalgite: {
		name: "Dragalgita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Dragalge, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dragonfang: {
		name: "Colmillo de Dragón",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Dragón del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Dragón del portador tienen 1,1× de potencia.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	dragongem: {
		name: "Gema Dragón",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Dragón tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Dragón tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	dragoninite: {
		name: "Dragonitita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Dragonite, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dragoniumz: {
		name: "Dracostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Dragón si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	dragonmemory: {
		name: "Disco Dragón",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Dragón.", // NEEDS QC
	},
	dragonscale: {
		name: "Escama de Dragón", // renamed in LZA (SV: Escama Dragón)
		grammar: "fs",
		shortDesc: "Hace evolucionar a Seadra en Kingdra al intercambiarlo.", // NEEDS QC
		gen2: {
			shortDesc: "Ataques de Dragón: 1,1× de potencia. Evoluciona a Seadra al intercambiarlo.", // NEEDS QC
		},
	},
	drampanite: {
		name: "Drampanita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Drampa, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dreadplate: {
		name: "Tabla Oscura",
		grammar: "fs",
		shortDesc: "Ataques de tipo Siniestro: 1,2× de potencia. Sentencia es de tipo Siniestro.", // NEEDS QC
	},
	dreamball: {
		name: "Ensueño Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball más eficaz para atrapar Pokémon dormidos.", // NEEDS QC
		gen7: {
			shortDesc: "Una Poké Ball especial que aparece de la nada en la mochila, en el Bosque Nexo.", // NEEDS QC
		},
	},
	dubiousdisc: {
		name: "Disco Extraño",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Porygon2 en Porygon-Z al intercambiarlo.", // NEEDS QC
	},
	durinberry: {
		name: "Baya Rudion",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	duskball: {
		name: "Ocaso Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball más eficaz de noche o en cuevas.", // NEEDS QC
	},
	duskstone: {
		name: "Piedra Noche",
		grammar: "fs",
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Es oscura como la noche."
		desc: "Al usarla, Murkrow evoluciona a Honchkrow; Misdreavus evoluciona a Mismagius; Lampent evoluciona a Chandelure; Doublade evoluciona a Aegislash.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	earthplate: {
		name: "Tabla Terrax",
		grammar: "fs",
		shortDesc: "Ataques de tipo Tierra: 1,2× de potencia. Sentencia es de tipo Tierra.", // NEEDS QC
	},
	eelektrossite: {
		name: "Eelektrossita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Eelektross, le permite megaevolucionar en combate.", // NEEDS QC
	},
	eeviumz: {
		name: "Eeveestal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Eevee con Última Baza, puede usar Novena Potencia.", // NEEDS QC
	},
	ejectbutton: {
		name: "Botón Escape",
		grammar: "ms",
		shortDesc: "Si sobrevive a un golpe, se cambia de inmediato por el aliado elegido. Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} regresa gracias al Botón Escape!",
	},
	ejectpack: {
		name: "Mochila Escape",
		grammar: "fs",
		shortDesc: "Si le bajan las características, se cambia por el aliado elegido. Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} regresa gracias a la Mochila Escape!",
	},
	electirizer: {
		name: "Electrizador",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Electabuzz en Electivire al intercambiarlo.", // NEEDS QC
	},
	electricgem: {
		name: "Gema Eléctrico", // renamed in SV (SwSh: Gema Eléctrica)
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Eléctrico tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Eléctrico tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	electricmemory: {
		name: "Disco Eléctrico",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Eléctrico.", // NEEDS QC
	},
	electricseed: {
		name: "Semilla Electro",
		grammar: "fs",
		shortDesc: "En campo eléctrico, sube 1 nivel la Defensa del portador. Un solo uso.", // NEEDS QC
	},
	electriumz: {
		name: "Electrostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Eléctrico si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	emboarite: {
		name: "Emboarita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Emboar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	enigmaberry: {
		name: "Baya Enigma",
		grammar: "fs",
		shortDesc: "Restaura 1/4 de sus PS máximos tras recibir un golpe supereficaz. Un solo uso.", // NEEDS QC
		gen3: {
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	eviolite: {
		name: "Mineral Evolutivo", // renamed in SV (SwSh: Mineral Evol)
		grammar: "ms",
		shortDesc: "Si su especie aún puede evolucionar, su Defensa y Def. Esp. se multiplican por 1,5.", // NEEDS QC
	},
	excadrite: {
		name: "Excadrillita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Excadrill, le permite megaevolucionar en combate.", // NEEDS QC
	},
	expertbelt: {
		name: "Cinturón de Experto", // renamed in LZA/Champions (SV: Cinta Experto)
		grammar: "ms",
		shortDesc: "Sus ataques supereficaces infligen 1,2× de daño.", // NEEDS QC
	},
	fairiumz: {
		name: "Feeristal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Hada si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	fairyfeather: {
		name: "Pluma Feérica",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Hada del portador tienen 1,2× de potencia.", // NEEDS QC
	},
	fairygem: {
		name: "Gema Hada",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Hada tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
	},
	fairymemory: {
		name: "Disco Hada",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Hada.", // NEEDS QC
	},
	falinksite: {
		name: "Falinksita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Falinks, le permite megaevolucionar en combate.", // NEEDS QC
	},
	fastball: {
		name: "Rapid Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball más eficaz con Pokémon que huyen rápido.", // NEEDS QC
	},
	feraligite: {
		name: "Feraligatrita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Feraligatr, le permite megaevolucionar en combate.", // NEEDS QC
	},
	fightinggem: {
		name: "Gema Lucha",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Lucha tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Lucha tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	fightingmemory: {
		name: "Disco Lucha",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Lucha.", // NEEDS QC
	},
	fightiniumz: {
		name: "Lizastal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Lucha si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	figyberry: {
		name: "Baya Higog",
		grammar: "fs",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde si su naturaleza es -Ataque. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde si su naturaleza es -Ataque. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde si su naturaleza es -Ataque. 1 uso.", // NEEDS QC
		},
	},
	firegem: {
		name: "Gema Fuego",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Fuego tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Fuego tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	firememory: {
		name: "Disco Fuego",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Fuego.", // NEEDS QC
	},
	firestone: {
		name: "Piedra Fuego",
		grammar: "fs",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es amarilla con una marca naranja."
		desc: "Al usarla, Vulpix evoluciona a Ninetales; Growlithe evoluciona a Arcanine; Eevee evoluciona a Flareon; Pansear evoluciona a Simisear.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	firiumz: {
		name: "Pirostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Fuego si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	fistplate: {
		name: "Tabla Fuerte",
		grammar: "fs",
		shortDesc: "Ataques de tipo Lucha: 1,2× de potencia. Sentencia es de tipo Lucha.", // NEEDS QC
	},
	flameorb: {
		name: "Llamasfera",
		grammar: "fs",
		shortDesc: "Al final de cada turno, intenta quemar al portador.", // NEEDS QC
	},
	flameplate: {
		name: "Tabla Llama",
		grammar: "fs",
		shortDesc: "Ataques de tipo Fuego: 1,2× de potencia. Sentencia es de tipo Fuego.", // NEEDS QC
	},
	floatstone: {
		name: "Piedra Pómez",
		grammar: "fs",
		shortDesc: "El peso del portador se reduce a la mitad.", // NEEDS QC
	},
	floettite: {
		name: "Floettita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Floette Eterna, le permite megaevolucionar en combate.", // NEEDS QC
	},
	flowersweet: {
		name: "Confite Flor",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	flyinggem: {
		name: "Gema Volador", // renamed in SV (SwSh: Gema Voladora)
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Volador tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Volador tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	flyingmemory: {
		name: "Disco Volador",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Volador.", // NEEDS QC
	},
	flyiniumz: {
		name: "Aerostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Volador si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	focusband: {
		name: "Cinta Aguante",
		grammar: "fs",
		shortDesc: "10% de probabilidad de sobrevivir con 1 PS a un ataque que lo debilitaría.", // NEEDS QC
		gen2: {
			shortDesc: "~11,7% de probabilidad de sobrevivir con 1 PS a un ataque que lo debilitaría.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha usado la Cinta Aguante y ha logrado resistir!",
	},
	focussash: {
		name: "Banda Aguante",
		grammar: "fs",
		shortDesc: "Con todos sus PS, sobrevive con 1 PS a un ataque que lo debilitaría. Un solo uso.", // NEEDS QC
		gen4: {
			shortDesc: "Con todos sus PS, sobrevive a todos los golpes de un ataque con al menos 1 PS. 1 uso.", // NEEDS QC
		},

		end: "  ¡{POKEMON} ha usado la Banda Aguante y ha logrado resistir!",
	},
	fossilizedbird: {
		name: "Ornitofósil",
		grammar: "ms",
		shortDesc: "Revive como Dracozolt con Dracofósil o Arctozolt con Plesiofósil.", // NEEDS QC
	},
	fossilizeddino: {
		name: "Plesiofósil",
		grammar: "ms",
		shortDesc: "Revive como Arctovish con Ictiofósil o Arctozolt con Ornitofósil.", // NEEDS QC
	},
	fossilizeddrake: {
		name: "Dracofósil",
		grammar: "ms",
		shortDesc: "Revive como Dracozolt con Ornitofósil o Dracovish con Ictiofósil.", // NEEDS QC
	},
	fossilizedfish: {
		name: "Ictiofósil",
		grammar: "ms",
		shortDesc: "Revive como Dracovish con Dracofósil o Arctovish con Plesiofósil.", // NEEDS QC
	},
	friendball: {
		name: "Amigo Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball que hace más amistosos a los Pokémon atrapados.", // NEEDS QC
	},
	froslassite: {
		name: "Froslassita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Froslass, le permite megaevolucionar en combate.", // NEEDS QC
	},
	fullincense: {
		name: "Incienso Lento",
		grammar: "ms",
		shortDesc: "El portador actúa el último dentro de su prioridad.", // NEEDS QC
	},
	galaricacuff: {
		name: "Brazal Galanuez",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Slowpoke de Galar en Slowbro de Galar al usarse.", // NEEDS QC
	},
	galaricawreath: {
		name: "Corona Galanuez",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Slowpoke de Galar en Slowking de Galar al usarse.", // NEEDS QC
	},
	galladite: {
		name: "Galladita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Gallade, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ganlonberry: {
		name: "Baya Gonlan",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Defensa con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	garchompite: {
		name: "Garchompita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Garchomp, le permite megaevolucionar en Mega Garchomp.", // NEEDS QC
	},
	garchompitez: {
		name: "Garchompita Z",
		grammar: "fs",
		shortDesc: "Si lo lleva un Garchomp, le permite megaevolucionar en Mega Garchomp Z.", // NEEDS QC
	},
	gardevoirite: {
		name: "Gardevoirita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Gardevoir, le permite megaevolucionar en combate.", // NEEDS QC
	},
	gengarite: {
		name: "Gengarita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Gengar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ghostgem: {
		name: "Gema Fantasma",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Fantasma tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Fantasma tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	ghostiumz: {
		name: "Espectrostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Fantasma si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	ghostmemory: {
		name: "Disco Fantasma",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Fantasma.", // NEEDS QC
	},
	glalitite: {
		name: "Glalita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Glalie, le permite megaevolucionar en combate.", // NEEDS QC
	},
	glimmoranite: {
		name: "Glimmoranita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Glimmora, le permite megaevolucionar en combate.", // NEEDS QC
	},
	goldbottlecap: {
		name: "Chapa Dorada",
		grammar: "fs",
		shortDesc: "Para el Entrenamiento Extremo: todas las características se calculan con IV 31.", // NEEDS QC
	},
	golisopite: {
		name: "Golisopodita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Golisopod, le permite megaevolucionar en combate.", // NEEDS QC
	},
	golurkite: {
		name: "Golurkita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Golurk, le permite megaevolucionar en combate.", // NEEDS QC
	},
	grassgem: {
		name: "Gema Planta",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Planta tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Planta tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	grassiumz: {
		name: "Fitostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Planta si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	grassmemory: {
		name: "Disco Planta",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Planta.", // NEEDS QC
	},
	grassyseed: {
		name: "Semilla Hierba",
		grammar: "fs",
		shortDesc: "En campo de hierba, sube 1 nivel la Defensa del portador. Un solo uso.", // NEEDS QC
	},
	greatball: {
		name: "Super Ball",
		grammar: "fs",
		shortDesc: "Una Ball de alto rendimiento con mejor tasa de captura que la Poké Ball.", // NEEDS QC
	},
	greninjite: {
		name: "Greninjanita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Greninja, le permite megaevolucionar en combate.", // NEEDS QC
	},
	grepaberry: {
		name: "Baya Uvav",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	gripclaw: {
		name: "Garra Garfio",
		grammar: "fs",
		shortDesc: "Sus movimientos de atadura siempre duran 7 turnos.", // NEEDS QC
	},
	griseouscore: {
		name: "Gran Griseosfera",
		grammar: "fs",
		shortDesc: "Si lo lleva Giratina, sus ataques de Fantasma y Dragón tienen 1,2× de potencia.", // NEEDS QC
	},
	griseousorb: {
		name: "Griseosfera",
		grammar: "fs",
		shortDesc: "Si lo lleva Giratina, sus ataques de Fantasma y Dragón tienen 1,2× de potencia.", // NEEDS QC
		gen4: {
			shortDesc: "Solo Giratina puede llevarlo. Sus ataques de Fantasma y Dragón: 1,2× de potencia.", // NEEDS QC
		},
	},
	groundgem: {
		name: "Gema Tierra",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Tierra tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Tierra tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	groundiumz: {
		name: "Geostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Tierra si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	groundmemory: {
		name: "Disco Tierra",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Tierra.", // NEEDS QC
	},
	gyaradosite: {
		name: "Gyaradosita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Gyarados, le permite megaevolucionar en combate.", // NEEDS QC
	},
	habanberry: {
		name: "Baya Anjiro",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Dragón. Un solo uso.", // NEEDS QC
	},
	hardstone: {
		name: "Piedra Dura",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Roca del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Roca del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	hawluchanite: {
		name: "Hawluchanita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Hawlucha, le permite megaevolucionar en combate.", // NEEDS QC
	},
	healball: {
		name: "Sana Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball que cura los PS y el estado del Pokémon atrapado.", // NEEDS QC
	},
	hearthflamemask: {
		name: "Máscara Horno",
		grammar: "fs",
		shortDesc: "Ogerpon Máscara Horno: 1,2× de potencia; Evocarrecuerdos al teracristalizar.", // NEEDS QC
	},
	heatranite: {
		name: "Heatranita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Heatran, le permite megaevolucionar en combate.", // NEEDS QC
	},
	heatrock: {
		name: "Roca Calor",
		grammar: "fs",
		shortDesc: "Su Día Soleado dura 8 turnos en lugar de 5.", // NEEDS QC
	},
	heavyball: {
		name: "Peso Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball para atrapar Pokémon muy pesados.", // NEEDS QC
	},
	heavydutyboots: {
		name: "Botas Gruesas",
		grammar: "fp",
		shortDesc: "Al entrar en combate, el portador ignora las trampas de su bando.", // NEEDS QC
	},
	helixfossil: {
		name: "Fósil Hélix",
		grammar: "ms",
		shortDesc: "Puede revivirse como Omanyte.", // NEEDS QC
	},
	heracronite: {
		name: "Heracrossita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Heracross, le permite megaevolucionar en combate.", // NEEDS QC
	},
	hondewberry: {
		name: "Baya Meluce",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	houndoominite: {
		name: "Houndoomita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Houndoom, le permite megaevolucionar en combate.", // NEEDS QC
	},
	iapapaberry: {
		name: "Baya Pabaya",
		grammar: "fs",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde si su naturaleza es -Defensa. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde si su naturaleza es -Defensa. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde si su naturaleza es -Defensa. 1 uso.", // NEEDS QC
		},
	},
	icegem: {
		name: "Gema Hielo",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Hielo tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Hielo tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	icememory: {
		name: "Disco Hielo",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Hielo.", // NEEDS QC
	},
	icestone: {
		name: "Piedra Hielo",
		grammar: "fs",
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Presenta motivos que recuerdan a los cristales de hielo."
		desc: "Al usarla, Sandshrew de Alola evoluciona a Sandslash de Alola; Vulpix de Alola evoluciona a Ninetales de Alola; Eevee evoluciona a Glaceon; y Darumaka de Galar evoluciona a Darmanitan de Galar.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
		gen7: {
			desc: "Al usarla, Sandshrew de Alola evoluciona a Sandslash de Alola y Vulpix de Alola evoluciona a Ninetales de Alola.", // NEEDS QC
		},
	},
	icicleplate: {
		name: "Tabla Helada",
		grammar: "fs",
		shortDesc: "Ataques de tipo Hielo: 1,2× de potencia. Sentencia es de tipo Hielo.", // NEEDS QC
	},
	iciumz: {
		name: "Criostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Hielo si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	icyrock: {
		name: "Roca Helada",
		grammar: "fs",
		shortDesc: "Su Paisaje Nevado dura 8 turnos en lugar de 5.", // NEEDS QC
		gen8: {
			shortDesc: "Su Granizo dura 8 turnos en lugar de 5.", // NEEDS QC
		},
	},
	inciniumz: {
		name: "Incinostal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Incineroar con Lariat Oscuro, puede usar Hiperplancha Oscura.", // NEEDS QC
	},
	insectplate: {
		name: "Tabla Bicho",
		grammar: "fs",
		shortDesc: "Ataques de tipo Bicho: 1,2× de potencia. Sentencia es de tipo Bicho.", // NEEDS QC
	},
	ironball: {
		name: "Bola Férrea",
		grammar: "fs",
		shortDesc: "Queda en el suelo, Velocidad a la mitad; si es Volador, recibe daño neutro de Tierra.", // NEEDS QC
		gen4: {
			shortDesc: "La Velocidad del portador se reduce a la mitad y queda en el suelo.", // NEEDS QC
		},
	},
	ironplate: {
		name: "Tabla Acero",
		grammar: "fs",
		shortDesc: "Ataques de tipo Acero: 1,2× de potencia. Sentencia es de tipo Acero.", // NEEDS QC
	},
	jabocaberry: {
		name: "Baya Jaboca",
		grammar: "fs",
		shortDesc: "Si lo golpea un movimiento físico, el atacante pierde 1/8 de sus PS. 1 uso.", // NEEDS QC
	},
	jawfossil: {
		name: "Fósil Mandíbula",
		grammar: "ms",
		shortDesc: "Puede revivirse como Tyrunt.", // NEEDS QC
	},
	kangaskhanite: {
		name: "Kangaskhanita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Kangaskhan, le permite megaevolucionar en combate.", // NEEDS QC
	},
	kasibberry: {
		name: "Baya Drasi",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Fantasma. Un solo uso.", // NEEDS QC
	},
	kebiaberry: {
		name: "Baya Kebia",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Veneno. Un solo uso.", // NEEDS QC
	},
	keeberry: {
		name: "Baya Biglia",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Defensa tras recibir un ataque físico. Un solo uso.", // NEEDS QC
	},
	kelpsyberry: {
		name: "Baya Algama",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	kingsrock: {
		name: "Roca del Rey",
		grammar: "fs",
		// Official flavor text: "El Pokémon que la lleva puede amedrentar al Pokémon al que le inflige daño."
		desc: "Los ataques del portador que no tengan efecto de retroceso obtienen un 10% de probabilidad de hacer retroceder al objetivo. Si la lleva al intercambiarlo, Poliwhirl evoluciona a Politoed y Slowpoke evoluciona a Slowking.", // NEEDS QC
		shortDesc: "Sus ataques sin efecto de retroceso obtienen un 10% de hacer retroceder.", // NEEDS QC
	},
	kommoniumz: {
		name: "Kommostal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Kommo-o con Fragor Escamas, puede usar Estruendo Implacable.", // NEEDS QC
	},
	laggingtail: {
		name: "Cola Plúmbea",
		grammar: "fs",
		shortDesc: "El portador actúa el último dentro de su prioridad.", // NEEDS QC
	},
	lansatberry: {
		name: "Baya Zonlan",
		grammar: "fs",
		shortDesc: "Obtiene el efecto de Foco Energía con 1/4 o menos de sus PS. Un solo uso.", // NEEDS QC
	},
	latiasite: {
		name: "Latiasita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Latias, le permite megaevolucionar en combate.", // NEEDS QC
	},
	latiosite: {
		name: "Latiosita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Latios, le permite megaevolucionar en combate.", // NEEDS QC
	},
	laxincense: {
		name: "Incienso Suave",
		grammar: "ms",
		shortDesc: "La precisión de los ataques contra el portador se multiplica por 0,9.", // NEEDS QC
		gen3: {
			shortDesc: "La precisión de los ataques contra el portador se multiplica por 0,95.", // NEEDS QC
		},
	},
	leafstone: {
		name: "Piedra Hoja",
		grammar: "fs",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Tiene grabada una hoja."
		desc: "Al usarla, Gloom evoluciona a Vileplume; Weepinbell evoluciona a Victreebel; Exeggcute evoluciona a Exeggutor o Exeggutor de Alola; Eevee evoluciona a Leafeon; Nuzleaf evoluciona a Shiftry; Pansage evoluciona a Simisage.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
		gen7: {
			desc: "Al usarla, Gloom evoluciona a Vileplume; Weepinbell a Victreebel; Exeggcute a Exeggutor o Exeggutor de Alola; Nuzleaf a Shiftry; y Pansage a Simisage.", // NEEDS QC
		},
	},
	leek: {
		name: "Puerro",
		grammar: "ms",
		shortDesc: "Si lo lleva un Farfetch’d o Sirfetch’d, su índice de crítico sube 2 niveles.", // NEEDS QC
	},
	leftovers: {
		name: "Restos",
		grammar: "mp",
		shortDesc: "Al final de cada turno, el portador recupera 1/16 de sus PS máximos.", // NEEDS QC

		heal: "  ¡{POKEMON} ha recuperado unos pocos PS gracias a los Restos!",
	},
	leppaberry: {
		name: "Baya Zanama",
		grammar: "fs",
		shortDesc: "Restaura 10 PP al primer movimiento del portador que llegue a 0 PP. Un solo uso.", // NEEDS QC

		activate: "  ¡{POKEMON} ha recuperado los PP de {MOVE} gracias a la Baya Zanama!",
	},
	levelball: {
		name: "Nivel Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball para atrapar Pokémon de nivel inferior al tuyo.", // NEEDS QC
	},
	liechiberry: {
		name: "Baya Lichi",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Ataque con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	lifeorb: {
		name: "Vidasfera",
		grammar: "fs",
		shortDesc: "Sus ataques infligen 1,3× de daño, pero pierde 1/10 de sus PS máximos al atacar.", // NEEDS QC

		damage: "  ¡{POKEMON} ha perdido unos pocos PS!",
	},
	lightball: {
		name: "Bola Luminosa",
		grammar: "fs",
		shortDesc: "Si lo lleva un Pikachu, su Ataque y Ataque Esp. se duplican.", // NEEDS QC
		gen4: {
			shortDesc: "Si lo lleva un Pikachu, la potencia de sus ataques se duplica.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Si lo lleva un Pikachu, su Ataque Especial se duplica.", // NEEDS QC
		},
	},
	lightclay: {
		name: "Refleluz",
		grammar: "ms",
		shortDesc: "Sus Velo Aurora, Pantalla de Luz y Reflejo duran 8 turnos en lugar de 5.", // NEEDS QC
		gen6: {
			shortDesc: "Sus Pantalla de Luz y Reflejo duran 8 turnos en lugar de 5.", // NEEDS QC
		},
	},
	loadeddice: {
		name: "Dado Trucado",
		grammar: "ms",
		desc: "Los movimientos del portador que golpean de 2 a 5 veces pasan a golpear siempre 4 o 5 veces. Si el primer golpe acierta, Triple Patada y Triple Axel golpean 3 veces y Proliferación golpea de 4 a 10 veces al azar.", // NEEDS QC
		shortDesc: "Sus movimientos de 2-5 golpes dan 4-5; Proliferación, de 4 a 10.", // NEEDS QC
	},
	lopunnite: {
		name: "Lopunnita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Lopunny, le permite megaevolucionar en combate.", // NEEDS QC
	},
	loveball: {
		name: "Amor Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball para atrapar Pokémon del sexo opuesto al del tuyo.", // NEEDS QC
	},
	lovesweet: {
		name: "Confite Corazón",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	lucarionite: {
		name: "Lucarita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Lucario, le permite megaevolucionar en Mega Lucario.", // NEEDS QC
	},
	lucarionitez: {
		name: "Lucarita Z",
		grammar: "fs",
		shortDesc: "Si lo lleva un Lucario, le permite megaevolucionar en Mega Lucario Z.", // NEEDS QC
	},
	luckypunch: {
		name: "Puño Suerte",
		grammar: "ms",
		shortDesc: "Si lo lleva un Chansey, su índice de crítico sube 2 niveles.", // NEEDS QC
		gen2: {
			shortDesc: "Si lo lleva un Chansey, su índice de crítico siempre es de nivel 2. (25%)", // NEEDS QC
		},
	},
	lumberry: {
		name: "Baya Ziuela",
		grammar: "fs",
		shortDesc: "Cura los problemas de estado y la confusión del portador. Un solo uso.", // NEEDS QC
	},
	luminousmoss: {
		name: "Musgo Brillante",
		grammar: "ms",
		shortDesc: "Sube 1 nivel su Defensa Esp. si lo golpea un ataque de tipo Agua. Un solo uso.", // NEEDS QC
	},
	lunaliumz: {
		name: "Lunalastal Z",
		grammar: "ms",
		shortDesc: "Lunala o Necrozma Alba con Rayo Umbrío: Movimiento Z especial.", // NEEDS QC
	},
	lureball: {
		name: "Cebo Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball para atrapar Pokémon que han picado el anzuelo.", // NEEDS QC
	},
	lustrousglobe: {
		name: "Gran Lustresfera",
		grammar: "fs",
		shortDesc: "Si lo lleva Palkia, sus ataques de Agua y Dragón tienen 1,2× de potencia.", // NEEDS QC
	},
	lustrousorb: {
		name: "Lustresfera",
		grammar: "fs",
		shortDesc: "Si lo lleva Palkia, sus ataques de Agua y Dragón tienen 1,2× de potencia.", // NEEDS QC
	},
	luxuryball: {
		name: "Lujo Ball",
		grammar: "fs",
		shortDesc: "Una cómoda Poké Ball que hace que el Pokémon atrapado se encariñe antes.", // NEEDS QC
	},
	lycaniumz: {
		name: "Lycanrostal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Lycanroc con Roca Afilada, puede usar Tempestad Rocosa.", // NEEDS QC
	},
	machobrace: {
		name: "Brazal Firme",
		grammar: "ms",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	magearnite: {
		name: "Magearnita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Magearna, le permite megaevolucionar en combate.", // NEEDS QC
	},
	magmarizer: {
		name: "Magmatizador",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Magmar en Magmortar al intercambiarlo.", // NEEDS QC
	},
	magnet: {
		name: "Imán",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Eléctrico del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Eléctrico del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	magoberry: {
		name: "Baya Ango",
		grammar: "fs",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde si su naturaleza es -Velocidad. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde si su naturaleza es -Velocidad. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde si su naturaleza es -Velocidad. 1 uso.", // NEEDS QC
		},
	},
	magostberry: {
		name: "Baya Aostan",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	mail: {
		name: "Carta", // NEEDS QC; generic (GS: CARTA FLOR etc.)
		grammar: "fs",
		shortDesc: "Solo puede darse o quitarse con Antojo, Desarme o Ladrón.", // NEEDS QC
	},
	malamarite: {
		name: "Malamarita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Malamar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	maliciousarmor: {
		name: "Armadura Maldita",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Charcadet en Ceruledge al usarse.", // NEEDS QC
	},
	manectite: {
		name: "Manectricita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Manectric, le permite megaevolucionar en combate.", // NEEDS QC
	},
	marangaberry: {
		name: "Baya Maranga",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Defensa Esp. tras recibir un ataque especial. Un solo uso.", // NEEDS QC
	},
	marshadiumz: {
		name: "Marshastal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva Marshadow con Robasombra, puede usar Constelación Robaalmas.", // NEEDS QC
	},
	masterball: {
		name: "Master Ball",
		grammar: "fs",
		shortDesc: "La mejor Ball: atrapa cualquier Pokémon salvaje sin fallar.", // NEEDS QC
	},
	masterpieceteacup: {
		name: "Cuenco Exquisito",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Poltchageist Opulenta en Sinistcha Exquisita al usarse.", // NEEDS QC
	},
	mawilite: {
		name: "Mawilita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Mawile, le permite megaevolucionar en combate.", // NEEDS QC
	},
	meadowplate: {
		name: "Tabla Pradal",
		grammar: "fs",
		shortDesc: "Ataques de tipo Planta: 1,2× de potencia. Sentencia es de tipo Planta.", // NEEDS QC
	},
	medichamite: {
		name: "Medichamita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Medicham, le permite megaevolucionar en combate.", // NEEDS QC
	},
	meganiumite: {
		name: "Meganiumita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Meganium, le permite megaevolucionar en combate.", // NEEDS QC
	},
	mentalherb: {
		name: "Hierba Mental",
		grammar: "fs",
		shortDesc: "Cura Atracción, Anulación, Otra Vez, Anticura, Mofa y Tormento. Un solo uso.", // NEEDS QC
		gen4: {
			shortDesc: "Cura el enamoramiento del portador. Un solo uso.", // NEEDS QC
		},
	},
	meowsticite: {
		name: "Meowsticita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Meowstic, le permite megaevolucionar en combate.", // NEEDS QC
	},
	metagrossite: {
		name: "Metagrossita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Metagross, le permite megaevolucionar en combate.", // NEEDS QC
	},
	metalalloy: {
		name: "Metal Compuesto",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Duraludon en Archaludon al usarse.", // NEEDS QC
	},
	metalcoat: {
		name: "Revest. Metálico",
		grammar: "ms",
		classified: {
			name: "Revestimiento Metálico",
			grammar: "ms",
		},
		// Official flavor text: "Película metálica que fortalece los ataques de tipo Acero. Debe llevarlo un Pokémon."
		desc: "Los ataques de tipo Acero del portador tienen 1,2× de potencia. Si lo lleva al intercambiarlo, Onix evoluciona a Steelix y Scyther evoluciona a Scizor.", // NEEDS QC
		shortDesc: "Los ataques de tipo Acero del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			desc: "Los ataques de Acero del portador tienen 1,1× de potencia. Al intercambiarlo, Onix evoluciona a Steelix y Scyther a Scizor.", // NEEDS QC
			shortDesc: "Los ataques de tipo Acero del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	metalpowder: {
		name: "Polvo Metálico",
		grammar: "mu", // NEEDS QC
		shortDesc: "Si lo lleva un Ditto sin transformar, su Defensa se duplica.", // NEEDS QC
		gen2: {
			shortDesc: "Si lo lleva un Ditto, su Defensa y Def. Esp. son ×1,5, incluso transformado.", // NEEDS QC
		},
	},
	metronome: {
		name: "Metrónomo",
		grammar: "ms",
		shortDesc: "El daño de movimientos usados turnos seguidos aumenta, hasta 2× tras 5 turnos.", // NEEDS QC
		gen4: {
			shortDesc: "El daño de movimientos usados turnos seguidos aumenta, hasta 2× tras 10 turnos.", // NEEDS QC
		},
	},
	mewniumz: {
		name: "Mewstal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Mew con Psíquico, puede usar Supernova Original.", // NEEDS QC
	},
	mewtwonitex: {
		name: "Mewtwoita X",
		grammar: "fs",
		shortDesc: "Si lo lleva un Mewtwo, le permite megaevolucionar en Mega Mewtwo X.", // NEEDS QC
	},
	mewtwonitey: {
		name: "Mewtwoita Y",
		grammar: "fs",
		shortDesc: "Si lo lleva un Mewtwo, le permite megaevolucionar en Mega Mewtwo Y.", // NEEDS QC
	},
	micleberry: {
		name: "Baya Lagro",
		grammar: "fs",
		shortDesc: "Su próximo movimiento tiene 1,2× de precisión con 1/4 o menos de PS. 1 uso.", // NEEDS QC
	},
	mimikiumz: {
		name: "Mimikyustal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Mimikyu con Carantoña, puede usar Somanta Amistosa.", // NEEDS QC
	},
	mindplate: {
		name: "Tabla Mental",
		grammar: "fs",
		shortDesc: "Ataques de tipo Psíquico: 1,2× de potencia. Sentencia es de tipo Psíquico.", // NEEDS QC
	},
	miracleseed: {
		name: "Semilla Milagro",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Planta del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Planta del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	mirrorherb: {
		name: "Hierba Copia",
		grammar: "fs",
		shortDesc: "Cuando un rival sube sus características, el portador lo copia. Un solo uso.", // NEEDS QC

		activate: "  ¡{POKEMON} ha usado una Hierba Copia y ha copiado los cambios en las características del rival!",
	},
	mistyseed: {
		name: "Semilla Bruma",
		grammar: "fs",
		shortDesc: "En campo de niebla, sube 1 nivel la Defensa Esp. del portador. Un solo uso.", // NEEDS QC
	},
	moonball: {
		name: "Luna Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball para atrapar Pokémon que evolucionan con la Piedra Lunar.", // NEEDS QC
	},
	moonstone: {
		name: "Piedra Lunar",
		grammar: "fs",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es oscura como la noche."
		desc: "Al usarla, Nidorina evoluciona a Nidoqueen; Nidorino evoluciona a Nidoking; Clefairy evoluciona a Clefable; Jigglypuff evoluciona a Wigglytuff; Skitty evoluciona a Delcatty; Munna evoluciona a Musharna.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	muscleband: {
		name: "Cinta Fuerte",
		grammar: "fs",
		shortDesc: "Sus ataques físicos tienen 1,1× de potencia.", // NEEDS QC
	},
	mysticwater: {
		name: "Agua Mística",
		grammar: "fu",
		articleRule: "stressed-a",
		classified: {
			name: "colgante de Agua Mística",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Agua del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Agua del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	nanabberry: {
		name: "Baya Latano",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	nestball: {
		name: "Nido Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball más eficaz con Pokémon salvajes débiles.", // NEEDS QC
	},
	netball: {
		name: "Malla Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball más eficaz con Pokémon de tipo Agua y Bicho.", // NEEDS QC
	},
	nevermeltice: {
		name: "Hielo Perpetuo",
		grammar: "mu",
		classified: {
			name: "trozo de Hielo Perpetuo",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Hielo del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Hielo del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	nomelberry: {
		name: "Baya Monli",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	normalgem: {
		name: "Gema Normal",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Normal tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Normal tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	normaliumz: {
		name: "Normastal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Normal si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	occaberry: {
		name: "Baya Caoca",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Fuego. Un solo uso.", // NEEDS QC
	},
	oddincense: {
		name: "Incienso Raro",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Psíquico del portador tienen 1,2× de potencia.", // NEEDS QC
	},
	oldamber: {
		name: "Ámbar Viejo",
		grammar: "ms",
		shortDesc: "Puede revivirse como Aerodactyl.", // NEEDS QC
	},
	oranberry: {
		name: "Baya Aranja",
		grammar: "fs",
		shortDesc: "Restaura 10 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	ovalstone: {
		name: "Piedra Oval",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Happiny en Chansey al subir de nivel de día llevándola.", // NEEDS QC
	},
	pamtreberry: {
		name: "Baya Plama",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	parkball: {
		name: "Parque Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball especial para el Parque Compi.", // NEEDS QC
	},
	passhoberry: {
		name: "Baya Pasio",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Agua. Un solo uso.", // NEEDS QC
	},
	payapaberry: {
		name: "Baya Payapa",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Psíquico. Un solo uso.", // NEEDS QC
	},
	pechaberry: {
		name: "Baya Meloc",
		grammar: "fs",
		shortDesc: "Cura el envenenamiento del portador. Un solo uso.", // NEEDS QC
	},
	persimberry: {
		name: "Baya Caquic",
		grammar: "fs",
		shortDesc: "Cura la confusión del portador. Un solo uso.", // NEEDS QC
	},
	petayaberry: {
		name: "Baya Yapati",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Ataque Esp. con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	pidgeotite: {
		name: "Pidgeotita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Pidgeot, le permite megaevolucionar en combate.", // NEEDS QC
	},
	pikaniumz: {
		name: "Pikastal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Pikachu con Placaje Eléctrico, puede usar Pikavoltio Letal.", // NEEDS QC
	},
	pikashuniumz: {
		name: "Ash-Pikastal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Pikachu con gorra y Rayo, puede usar Gigarrayo Fulminante.", // NEEDS QC
	},
	pinapberry: {
		name: "Baya Pinia",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	pinsirite: {
		name: "Pinsirita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Pinsir, le permite megaevolucionar en combate.", // NEEDS QC
	},
	pixieplate: {
		name: "Tabla Duende",
		grammar: "fs",
		shortDesc: "Ataques de tipo Hada: 1,2× de potencia. Sentencia es de tipo Hada.", // NEEDS QC
	},
	plumefossil: {
		name: "Fósil Pluma",
		grammar: "ms",
		shortDesc: "Puede revivirse como Archen.", // NEEDS QC
	},
	poisonbarb: {
		name: "Flecha Venenosa",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Veneno del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Veneno del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	poisongem: {
		name: "Gema Veneno",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Veneno tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Veneno tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	poisoniumz: {
		name: "Toxistal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Veneno si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	poisonmemory: {
		name: "Disco Veneno",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Veneno.", // NEEDS QC
	},
	pokeball: {
		name: "Poké Ball",
		grammar: "fs",
		shortDesc: "Un dispositivo con forma de cápsula para atrapar Pokémon salvajes.", // NEEDS QC
	},
	pomegberry: {
		name: "Baya Grana",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	poweranklet: {
		name: "Tobillera Recia", // renamed in LZA (SV: Franja Recia)
		grammar: "fs",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerband: {
		name: "Banda Recia",
		grammar: "fs",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerbelt: {
		name: "Cinto Recio",
		grammar: "ms",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerbracer: {
		name: "Brazal Recio",
		grammar: "ms",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerherb: {
		name: "Hierba Única",
		grammar: "fs",
		shortDesc: "Sus movimientos de dos turnos se completan en uno (salvo Caída Libre). Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} ya está listo gracias a la Hierba Única!",
	},
	powerlens: {
		name: "Lente Recia",
		grammar: "fs",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerweight: {
		name: "Pesa Recia",
		grammar: "fs",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	premierball: {
		name: "Honor Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball algo rara creada para conmemorar un evento.", // NEEDS QC
	},
	prettyfeather: {
		name: "Pluma Bella",
		grammar: "fs",
		shortDesc: "Aunque es preciosa, es solo una pluma corriente sin efecto.", // NEEDS QC
	},
	primariumz: {
		name: "Primastal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Primarina con Aria Burbuja, puede usar Sinfonía de la Diva Marina.", // NEEDS QC
	},
	prismscale: {
		name: "Escama Bella",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Feebas en Milotic al intercambiarlo.", // NEEDS QC
	},
	protectivepads: {
		name: "Paracontacto",
		grammar: "ms",
		shortDesc: "Protege sus movimientos de los efectos adversos por contacto (salvo Hurto).", // NEEDS QC

		block: "  ¡{POKEMON} ha neutralizado el efecto gracias al Paracontacto!",
	},
	protector: {
		name: "Protector",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Rhydon en Rhyperior al intercambiarlo.", // NEEDS QC
	},
	psychicgem: {
		name: "Gema Psíquico", // renamed in SV (SwSh: Gema Psíquica)
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Psíquico tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Psíquico tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	psychicmemory: {
		name: "Disco Psíquico",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Psíquico.", // NEEDS QC
	},
	psychicseed: {
		name: "Semilla Psique",
		grammar: "fs",
		shortDesc: "En campo psíquico, sube 1 nivel la Defensa Esp. del portador. Un solo uso.", // NEEDS QC
	},
	psychiumz: {
		name: "Psicostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Psíquico si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	punchingglove: {
		name: "Guante de Boxeo",
		grammar: "ms",
		shortDesc: "Sus movimientos de puño tienen 1,1× de potencia y no hacen contacto.", // NEEDS QC
	},
	pyroarite: {
		name: "Pyroarita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Pyroar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	qualotberry: {
		name: "Baya Ispero",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	quickball: {
		name: "Veloz Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball más eficaz al principio de un encuentro salvaje.", // NEEDS QC
	},
	quickclaw: {
		name: "Garra Rápida",
		grammar: "fs",
		shortDesc: "Cada turno, 20% de probabilidad de actuar primero dentro de su prioridad.", // NEEDS QC
		gen2: {
			shortDesc: "Cada turno, ~23,4% de probabilidad de actuar primero dentro de su prioridad.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} puede tener prioridad gracias a la Garra Rápida!", // Champions; SV: ¡Gracias a la Garra Rápida, {POKEMON} puede tener prioridad!
	},
	quickpowder: {
		name: "Polvo Veloz",
		grammar: "mu", // NEEDS QC
		shortDesc: "Si lo lleva un Ditto sin transformar, su Velocidad se duplica.", // NEEDS QC
	},
	rabutaberry: {
		name: "Baya Rautan",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	raichunitex: {
		name: "Raichunita X",
		grammar: "fs",
		shortDesc: "Si lo lleva un Raichu, le permite megaevolucionar en Mega Raichu X.", // NEEDS QC
	},
	raichunitey: {
		name: "Raichunita Y",
		grammar: "fs",
		shortDesc: "Si lo lleva un Raichu, le permite megaevolucionar en Mega Raichu Y.", // NEEDS QC
	},
	rarebone: {
		name: "Hueso Raro",
		grammar: "ms",
		shortDesc: "Sin uso competitivo salvo con Lanzamiento.", // NEEDS QC
	},
	rawstberry: {
		name: "Baya Safre",
		grammar: "fs",
		shortDesc: "Cura la quemadura del portador. Un solo uso.", // NEEDS QC
	},
	razorclaw: {
		name: "Garra Afilada",
		grammar: "fs",
		// Official flavor text: "Aumenta la probabilidad de que el Pokémon que la lleve consiga un golpe crítico."
		desc: "El índice de golpe crítico del portador sube 1 nivel. Si la lleva al subir de nivel por la noche, Sneasel evoluciona a Weavile.", // NEEDS QC
		shortDesc: "El índice de golpe crítico del portador sube 1 nivel.", // NEEDS QC
	},
	razorfang: {
		name: "Colmillo Agudo",
		grammar: "ms",
		// Official flavor text: "Si lo lleva un Pokémon, puede amedrentar al objetivo al infligirle daño."
		desc: "Los ataques del portador que no tengan efecto de retroceso obtienen un 10% de probabilidad de hacer retroceder al objetivo. Si lo lleva al subir de nivel por la noche, Gligar evoluciona a Gliscor.", // NEEDS QC
		shortDesc: "Sus ataques sin efecto de retroceso obtienen un 10% de hacer retroceder.", // NEEDS QC
	},
	razzberry: {
		name: "Baya Frambu",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	reapercloth: {
		name: "Tela Terrible",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Dusclops en Dusknoir al intercambiarlo.", // NEEDS QC
	},
	redcard: {
		name: "Tarjeta Roja",
		grammar: "fs",
		shortDesc: "Si sobrevive a un golpe, el atacante se cambia por un aliado al azar. Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} le ha sacado una Tarjeta Roja a {TARGET}!",
	},
	redorb: {
		name: "Prisma Rojo",
		grammar: "ms",
		shortDesc: "Si lo lleva un Groudon, activa su regresión primigenia en combate.", // NEEDS QC
	},
	repeatball: {
		name: "Acopio Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball más eficaz con especies ya atrapadas antes.", // NEEDS QC
	},
	ribbonsweet: {
		name: "Confite Lazo",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	rindoberry: {
		name: "Baya Tamar",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Planta. Un solo uso.", // NEEDS QC
	},
	ringtarget: {
		name: "Blanco",
		grammar: "ms",
		shortDesc: "Las inmunidades debidas solo a los tipos del portador se anulan.", // NEEDS QC
	},
	rockgem: {
		name: "Gema Roca",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Roca tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Roca tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	rockincense: {
		name: "Incienso Roca",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Roca del portador tienen 1,2× de potencia.", // NEEDS QC
	},
	rockiumz: {
		name: "Litostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Roca si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	rockmemory: {
		name: "Disco Roca",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Roca.", // NEEDS QC
	},
	rockyhelmet: {
		name: "Casco Dentado",
		grammar: "ms",
		shortDesc: "Si lo golpea un movimiento de contacto, el atacante pierde 1/6 de sus PS máximos.", // NEEDS QC

		damage: "  ¡El Casco Dentado ha dañado a {POKEMON}!",
	},
	roomservice: {
		name: "Servicio Raro",
		grammar: "ms",
		shortDesc: "Si hay Espacio Raro, baja 1 nivel su Velocidad. Un solo uso.", // NEEDS QC
	},
	rootfossil: {
		name: "Fósil Raíz",
		grammar: "ms",
		shortDesc: "Puede revivirse como Lileep.", // NEEDS QC
	},
	roseincense: {
		name: "Incienso Floral",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Planta del portador tienen 1,2× de potencia.", // NEEDS QC
	},
	roseliberry: {
		name: "Baya Hibis",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Hada. Un solo uso.", // NEEDS QC
	},
	rowapberry: {
		name: "Baya Magua",
		grammar: "fs",
		shortDesc: "Si lo golpea un movimiento especial, el atacante pierde 1/8 de sus PS. 1 uso.", // NEEDS QC
	},
	rustedshield: {
		name: "Escudo Oxidado",
		grammar: "ms",
		shortDesc: "Si lo lleva un Zamazenta, cambia a su Forma Escudo Supremo.", // NEEDS QC
	},
	rustedsword: {
		name: "Espada Oxidada",
		grammar: "fs",
		shortDesc: "Si lo lleva un Zacian, cambia a su Forma Espada Suprema.", // NEEDS QC
	},
	sablenite: {
		name: "Sableynita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Sableye, le permite megaevolucionar en combate.", // NEEDS QC
	},
	sachet: {
		name: "Saquito Fragante",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Spritzee en Aromatisse al intercambiarlo.", // NEEDS QC
	},
	safariball: {
		name: "Safari Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball especial para la Zona Safari y el Gran Pantano.", // NEEDS QC
	},
	safetygoggles: {
		name: "Gafa Protectora",
		grammar: "fs",
		shortDesc: "Inmune a movimientos de polvo y al daño de tormenta de arena y granizo.", // NEEDS QC

		block: "  ¡{MOVE} no ha afectado a {POKEMON} gracias a la Gafa Protectora!",
	},
	sailfossil: {
		name: "Fósil Aleta",
		grammar: "ms",
		shortDesc: "Puede revivirse como Amaura.", // NEEDS QC
	},
	salacberry: {
		name: "Baya Aslac",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Velocidad con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	salamencite: {
		name: "Salamencita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Salamence, le permite megaevolucionar en combate.", // NEEDS QC
	},
	sceptilite: {
		name: "Sceptilita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Sceptile, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scizorite: {
		name: "Scizorita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Scizor, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scolipite: {
		name: "Scolipedita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Scolipede, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scopelens: {
		name: "Periscopio",
		grammar: "ms",
		shortDesc: "El índice de golpe crítico del portador sube 1 nivel.", // NEEDS QC
	},
	scovillainite: {
		name: "Scovillainita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Scovillain, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scraftinite: {
		name: "Scraftita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Scrafty, le permite megaevolucionar en combate.", // NEEDS QC
	},
	seaincense: {
		name: "Incienso Marino",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Agua del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Agua del portador tienen 1,05× de potencia.", // NEEDS QC
		},
	},
	sharpbeak: {
		name: "Pico Afilado",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Volador del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Volador del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	sharpedonite: {
		name: "Sharpedonita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Sharpedo, le permite megaevolucionar en combate.", // NEEDS QC
	},
	shedshell: {
		name: "Muda Concha",
		grammar: "fs",
		shortDesc: "Ningún efecto puede impedir que el portador elija cambiarse.", // NEEDS QC
	},
	shellbell: {
		name: "Cascabel Concha",
		grammar: "ms",
		shortDesc: "Tras atacar, recupera 1/8 del daño infligido a otros Pokémon.", // NEEDS QC

		heal: "  ¡{POKEMON} ha recuperado unos pocos PS gracias al Cascabel Concha!",
	},
	shinystone: {
		name: "Piedra Día",
		grammar: "fs",
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Tiene un brillo espectacular."
		desc: "Al usarla, Togetic evoluciona a Togekiss; Roselia evoluciona a Roserade; Minccino evoluciona a Cinccino; Floette evoluciona a Florges.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	shockdrive: {
		name: "FulgoROM",
		grammar: "fs", // NEEDS QC
		shortDesc: "El Tecno Shock del portador es de tipo Eléctrico.", // NEEDS QC
	},
	shucaberry: {
		name: "Baya Acardo",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Tierra. Un solo uso.", // NEEDS QC
	},
	silkscarf: {
		name: "Pañuelo de Seda",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Normal del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Normal del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	silverpowder: {
		name: "Polvo Plata",
		grammar: "mu",
		classified: {
			name: "puñado de Polvo Plata",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Bicho del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Bicho del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	sitrusberry: {
		name: "Baya Zidra",
		grammar: "fs",
		shortDesc: "Restaura 1/4 de sus PS máximos con la mitad o menos. Un solo uso.", // NEEDS QC
		gen3: {
			shortDesc: "Restaura 30 PS con la mitad de PS o menos. Un solo uso.", // NEEDS QC
		},
	},
	skarmorite: {
		name: "Skarmorita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Skarmory, le permite megaevolucionar en combate.", // NEEDS QC
	},
	skullfossil: {
		name: "Fósil Cráneo",
		grammar: "ms",
		shortDesc: "Puede revivirse como Cranidos.", // NEEDS QC
	},
	skyplate: {
		name: "Tabla Cielo",
		grammar: "fs",
		shortDesc: "Ataques de tipo Volador: 1,2× de potencia. Sentencia es de tipo Volador.", // NEEDS QC
	},
	slowbronite: {
		name: "Slowbronita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Slowbro, le permite megaevolucionar en combate.", // NEEDS QC
		champions: {
			shortDesc: "Si lo lleva un Slowbro (no el de Galar), le permite megaevolucionar en combate.", // NEEDS QC
		},
	},
	smoothrock: {
		name: "Roca Suave",
		grammar: "fs",
		shortDesc: "Su Tormenta de Arena dura 8 turnos en lugar de 5.", // NEEDS QC
	},
	snorliumz: {
		name: "Snorlastal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Snorlax con Gigaimpacto, puede usar Arrojo Intempestivo.", // NEEDS QC
	},
	snowball: {
		name: "Bola de Nieve",
		grammar: "fs",
		shortDesc: "Sube 1 nivel su Ataque si lo golpea un ataque de tipo Hielo. Un solo uso.", // NEEDS QC
	},
	softsand: {
		name: "Arena Fina",
		grammar: "fu",
		classified: {
			name: "saquito de Arena Fina",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Tierra del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Tierra del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	solganiumz: {
		name: "Solgaleostal Z",
		grammar: "ms",
		shortDesc: "Solgaleo o Necrozma Crepuscular con Meteoimpacto: Movimiento Z especial.", // NEEDS QC
	},
	souldew: {
		name: "Rocío Bondad",
		grammar: "ms",
		shortDesc: "Si lo lleva Latias o Latios, sus ataques de Dragón y Psíquico: 1,2× de potencia.", // NEEDS QC
		gen6: {
			shortDesc: "Si lo lleva Latias o Latios, su At. Esp. y Def. Esp. son ×1,5.", // NEEDS QC
		},
	},
	spelltag: {
		name: "Hechizo",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Fantasma del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Fantasma del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	spelonberry: {
		name: "Baya Wikano",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	splashplate: {
		name: "Tabla Linfa",
		grammar: "fs",
		shortDesc: "Ataques de tipo Agua: 1,2× de potencia. Sentencia es de tipo Agua.", // NEEDS QC
	},
	spookyplate: {
		name: "Tabla Terror",
		grammar: "fs",
		shortDesc: "Ataques de tipo Fantasma: 1,2× de potencia. Sentencia es de tipo Fantasma.", // NEEDS QC
	},
	sportball: {
		name: "Competi Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball especial para el Concurso de Captura de Bichos.", // NEEDS QC
	},
	staraptite: {
		name: "Staraptorita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Staraptor, le permite megaevolucionar en combate.", // NEEDS QC
	},
	starfberry: {
		name: "Baya Arabol",
		grammar: "fs",
		shortDesc: "1/4 o menos de PS: sube 2 niveles una característica al azar (no prec./evas.). 1 uso.", // NEEDS QC
	},
	starminite: {
		name: "Starmita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Starmie, le permite megaevolucionar en combate.", // NEEDS QC
	},
	starsweet: {
		name: "Confite Estrella",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	steelgem: {
		name: "Gema Acero",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Acero tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Acero tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	steeliumz: {
		name: "Metalostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Acero si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	steelixite: {
		name: "Steelixita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Steelix, le permite megaevolucionar en combate.", // NEEDS QC
	},
	steelmemory: {
		name: "Disco Acero",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Acero.", // NEEDS QC
	},
	stick: {
		name: "Palo", // Gen 7 name; Puerro is the Gen 8 Leek
		grammar: "ms",
		shortDesc: "Si lo lleva un Farfetch’d, su índice de crítico sube 2 niveles.", // NEEDS QC
		gen2: {
			shortDesc: "Si lo lleva un Farfetch’d, su índice de crítico siempre es de nivel 2. (25%)", // NEEDS QC
		},
	},
	stickybarb: {
		name: "Toxiestrella",
		grammar: "fs",
		shortDesc: "Pierde 1/8 de sus PS máximos cada turno. Puede pasar a un atacante que haga contacto.", // NEEDS QC
	},
	stoneplate: {
		name: "Tabla Pétrea",
		grammar: "fs",
		shortDesc: "Ataques de tipo Roca: 1,2× de potencia. Sentencia es de tipo Roca.", // NEEDS QC
	},
	strangeball: {
		name: "Extraña Ball",
		grammar: "fs",
		shortDesc: "Sustituto si se atrapó en una Ball que no existe en el juego actual.", // NEEDS QC
	},
	strawberrysweet: {
		name: "Confite Fresa",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	sunstone: {
		name: "Piedra Solar",
		grammar: "fs",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es roja como el núcleo del sol."
		desc: "Al usarla, Gloom evoluciona a Bellossom; Sunkern evoluciona a Sunflora; Cottonee evoluciona a Whimsicott; Petilil evoluciona a Lilligant; Helioptile evoluciona a Heliolisk.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	swampertite: {
		name: "Swampertita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Swampert, le permite megaevolucionar en combate.", // NEEDS QC
	},
	sweetapple: {
		name: "Manzana Dulce",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Applin en Appletun al usarse.", // NEEDS QC
	},
	syrupyapple: {
		name: "Manzana Melosa",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Applin en Dipplin al usarse.", // NEEDS QC
	},
	tamatoberry: {
		name: "Baya Tamate",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	tangaberry: {
		name: "Baya Yecana",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Bicho. Un solo uso.", // NEEDS QC
	},
	tapuniumz: {
		name: "Tapistal Z",
		grammar: "ms",
		shortDesc: "Si lo lleva un Tapu con Furia Natural, puede usar Cólera del Guardián.", // NEEDS QC
	},
	tartapple: {
		name: "Manzana Ácida",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Applin en Flapple al usarse.", // NEEDS QC
	},
	tatsugirinite: {
		name: "Tatsugirita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Tatsugiri, le permite megaevolucionar en combate.", // NEEDS QC
	},
	terrainextender: {
		name: "Cubresuelos",
		grammar: "mu", // NEEDS QC
		classified: {
			name: "bote de Cubresuelos", // SV itemname_classified
			grammar: "ms",
		},
		shortDesc: "Sus campos eléctrico, de hierba, de niebla o psíquico duran 8 turnos en lugar de 5.", // NEEDS QC
	},
	thickclub: {
		name: "Hueso Grueso",
		grammar: "ms",
		shortDesc: "Si lo lleva un Cubone o un Marowak, su Ataque se duplica.", // NEEDS QC
	},
	throatspray: {
		name: "Espray Bucal",
		grammar: "ms",
		shortDesc: "Sube 1 nivel su Ataque Esp. tras usar un movimiento de sonido. Un solo uso.", // NEEDS QC
	},
	thunderstone: {
		name: "Piedra Trueno",
		grammar: "fs",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Tiene grabado un rayo."
		desc: "Al usarla, Pikachu evoluciona a Raichu o Raichu de Alola; Eevee evoluciona a Jolteon; Eelektrik evoluciona a Eelektross; Charjabug evoluciona a Vikavolt.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
		gen7: {
			desc: "Al usarla, Pikachu evoluciona a Raichu o Raichu de Alola; Eevee a Jolteon; y Eelektrik a Eelektross.", // NEEDS QC
		},
	},
	timerball: {
		name: "Turno Ball",
		grammar: "fs",
		shortDesc: "Una Poké Ball que mejora cuantos más turnos dure el combate.", // NEEDS QC
	},
	toxicorb: {
		name: "Toxisfera",
		grammar: "fs",
		shortDesc: "Al final de cada turno, intenta envenenar gravemente al portador.", // NEEDS QC
	},
	toxicplate: {
		name: "Tabla Tóxica",
		grammar: "fs",
		shortDesc: "Ataques de tipo Veneno: 1,2× de potencia. Sentencia es de tipo Veneno.", // NEEDS QC
	},
	tr00: {
		name: "DT00",
		grammar: "ms",
		shortDesc: "Enseña Danza Espada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr01: {
		name: "DT01",
		grammar: "ms",
		shortDesc: "Enseña Golpe Cuerpo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr02: {
		name: "DT02",
		grammar: "ms",
		shortDesc: "Enseña Lanzallamas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr03: {
		name: "DT03",
		grammar: "ms",
		shortDesc: "Enseña Hidrobomba a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr04: {
		name: "DT04",
		grammar: "ms",
		shortDesc: "Enseña Surf a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr05: {
		name: "DT05",
		grammar: "ms",
		shortDesc: "Enseña Rayo Hielo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr06: {
		name: "DT06",
		grammar: "ms",
		shortDesc: "Enseña Ventisca a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr07: {
		name: "DT07",
		grammar: "ms",
		shortDesc: "Enseña Patada Baja a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr08: {
		name: "DT08",
		grammar: "ms",
		shortDesc: "Enseña Rayo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr09: {
		name: "DT09",
		grammar: "ms",
		shortDesc: "Enseña Trueno a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr10: {
		name: "DT10",
		grammar: "ms",
		shortDesc: "Enseña Terremoto a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr11: {
		name: "DT11",
		grammar: "ms",
		shortDesc: "Enseña Psíquico a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr12: {
		name: "DT12",
		grammar: "ms",
		shortDesc: "Enseña Agilidad a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr13: {
		name: "DT13",
		grammar: "ms",
		shortDesc: "Enseña Foco Energía a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr14: {
		name: "DT14",
		grammar: "ms",
		shortDesc: "Enseña Metrónomo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr15: {
		name: "DT15",
		grammar: "ms",
		shortDesc: "Enseña Llamarada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr16: {
		name: "DT16",
		grammar: "ms",
		shortDesc: "Enseña Cascada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr17: {
		name: "DT17",
		grammar: "ms",
		shortDesc: "Enseña Amnesia a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr18: {
		name: "DT18",
		grammar: "ms",
		shortDesc: "Enseña Chupavidas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr19: {
		name: "DT19",
		grammar: "ms",
		shortDesc: "Enseña Triataque a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr20: {
		name: "DT20",
		grammar: "ms",
		shortDesc: "Enseña Sustituto a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr21: {
		name: "DT21",
		grammar: "ms",
		shortDesc: "Enseña Inversión a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr22: {
		name: "DT22",
		grammar: "ms",
		shortDesc: "Enseña Bomba Lodo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr23: {
		name: "DT23",
		grammar: "ms",
		shortDesc: "Enseña Púas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr24: {
		name: "DT24",
		grammar: "ms",
		shortDesc: "Enseña Enfado a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr25: {
		name: "DT25",
		grammar: "ms",
		shortDesc: "Enseña Psicocarga a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr26: {
		name: "DT26",
		grammar: "ms",
		shortDesc: "Enseña Aguante a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr27: {
		name: "DT27",
		grammar: "ms",
		shortDesc: "Enseña Sonámbulo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr28: {
		name: "DT28",
		grammar: "ms",
		shortDesc: "Enseña Megacuerno a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr29: {
		name: "DT29",
		grammar: "ms",
		shortDesc: "Enseña Relevo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr30: {
		name: "DT30",
		grammar: "ms",
		shortDesc: "Enseña Otra Vez a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr31: {
		name: "DT31",
		grammar: "ms",
		shortDesc: "Enseña Cola Férrea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr32: {
		name: "DT32",
		grammar: "ms",
		shortDesc: "Enseña Triturar a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr33: {
		name: "DT33",
		grammar: "ms",
		shortDesc: "Enseña Bola Sombra a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr34: {
		name: "DT34",
		grammar: "ms",
		shortDesc: "Enseña Premonición a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr35: {
		name: "DT35",
		grammar: "ms",
		shortDesc: "Enseña Alboroto a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr36: {
		name: "DT36",
		grammar: "ms",
		shortDesc: "Enseña Onda Ígnea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr37: {
		name: "DT37",
		grammar: "ms",
		shortDesc: "Enseña Mofa a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr38: {
		name: "DT38",
		grammar: "ms",
		shortDesc: "Enseña Truco a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr39: {
		name: "DT39",
		grammar: "ms",
		shortDesc: "Enseña Fuerza Bruta a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr40: {
		name: "DT40",
		grammar: "ms",
		shortDesc: "Enseña Intercambio a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr41: {
		name: "DT41",
		grammar: "ms",
		shortDesc: "Enseña Patada Ígnea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr42: {
		name: "DT42",
		grammar: "ms",
		shortDesc: "Enseña Vozarrón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr43: {
		name: "DT43",
		grammar: "ms",
		shortDesc: "Enseña Sofoco a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr44: {
		name: "DT44",
		grammar: "ms",
		shortDesc: "Enseña Masa Cósmica a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr45: {
		name: "DT45",
		grammar: "ms",
		shortDesc: "Enseña Agua Lodosa a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr46: {
		name: "DT46",
		grammar: "ms",
		shortDesc: "Enseña Defensa Férrea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr47: {
		name: "DT47",
		grammar: "ms",
		shortDesc: "Enseña Garra Dragón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr48: {
		name: "DT48",
		grammar: "ms",
		shortDesc: "Enseña Corpulencia a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr49: {
		name: "DT49",
		grammar: "ms",
		shortDesc: "Enseña Paz Mental a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr50: {
		name: "DT50",
		grammar: "ms",
		shortDesc: "Enseña Hoja Aguda a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr51: {
		name: "DT51",
		grammar: "ms",
		shortDesc: "Enseña Danza Dragón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr52: {
		name: "DT52",
		grammar: "ms",
		shortDesc: "Enseña Giro Bola a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr53: {
		name: "DT53",
		grammar: "ms",
		shortDesc: "Enseña A Bocajarro a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr54: {
		name: "DT54",
		grammar: "ms",
		shortDesc: "Enseña Púas Tóxicas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr55: {
		name: "DT55",
		grammar: "ms",
		shortDesc: "Enseña Envite Ígneo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr56: {
		name: "DT56",
		grammar: "ms",
		shortDesc: "Enseña Esfera Aural a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr57: {
		name: "DT57",
		grammar: "ms",
		shortDesc: "Enseña Puya Nociva a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr58: {
		name: "DT58",
		grammar: "ms",
		shortDesc: "Enseña Pulso Umbrío a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr59: {
		name: "DT59",
		grammar: "ms",
		shortDesc: "Enseña Bomba Germen a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr60: {
		name: "DT60",
		grammar: "ms",
		shortDesc: "Enseña Tijera X a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr61: {
		name: "DT61",
		grammar: "ms",
		shortDesc: "Enseña Zumbido a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr62: {
		name: "DT62",
		grammar: "ms",
		shortDesc: "Enseña Pulso Dragón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr63: {
		name: "DT63",
		grammar: "ms",
		shortDesc: "Enseña Joya de Luz a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr64: {
		name: "DT64",
		grammar: "ms",
		shortDesc: "Enseña Onda Certera a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr65: {
		name: "DT65",
		grammar: "ms",
		shortDesc: "Enseña Energibola a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr66: {
		name: "DT66",
		grammar: "ms",
		shortDesc: "Enseña Pájaro Osado a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr67: {
		name: "DT67",
		grammar: "ms",
		shortDesc: "Enseña Tierra Viva a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr68: {
		name: "DT68",
		grammar: "ms",
		shortDesc: "Enseña Maquinación a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr69: {
		name: "DT69",
		grammar: "ms",
		shortDesc: "Enseña Cabezazo Zen a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr70: {
		name: "DT70",
		grammar: "ms",
		shortDesc: "Enseña Cañón Resplandor a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr71: {
		name: "DT71",
		grammar: "ms",
		shortDesc: "Enseña Lluevehojas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr72: {
		name: "DT72",
		grammar: "ms",
		shortDesc: "Enseña Latigazo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr73: {
		name: "DT73",
		grammar: "ms",
		shortDesc: "Enseña Lanzamugre a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr74: {
		name: "DT74",
		grammar: "ms",
		shortDesc: "Enseña Cabeza de Hierro a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr75: {
		name: "DT75",
		grammar: "ms",
		shortDesc: "Enseña Roca Afilada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr76: {
		name: "DT76",
		grammar: "ms",
		shortDesc: "Enseña Trampa Rocas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr77: {
		name: "DT77",
		grammar: "ms",
		shortDesc: "Enseña Hierba Lazo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr78: {
		name: "DT78",
		grammar: "ms",
		shortDesc: "Enseña Onda Tóxica a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr79: {
		name: "DT79",
		grammar: "ms",
		shortDesc: "Enseña Cuerpo Pesado a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr80: {
		name: "DT80",
		grammar: "ms",
		shortDesc: "Enseña Bola Voltio a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr81: {
		name: "DT81",
		grammar: "ms",
		shortDesc: "Enseña Juego Sucio a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr82: {
		name: "DT82",
		grammar: "ms",
		shortDesc: "Enseña Poder Reserva a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr83: {
		name: "DT83",
		grammar: "ms",
		shortDesc: "Enseña Cambio de Banda a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr84: {
		name: "DT84",
		grammar: "ms",
		shortDesc: "Enseña Escaldar a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr85: {
		name: "DT85",
		grammar: "ms",
		shortDesc: "Enseña Avivar a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr86: {
		name: "DT86",
		grammar: "ms",
		shortDesc: "Enseña Voltio Cruel a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr87: {
		name: "DT87",
		grammar: "ms",
		shortDesc: "Enseña Taladradora a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr88: {
		name: "DT88",
		grammar: "ms",
		shortDesc: "Enseña Golpe Calor a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr89: {
		name: "DT89",
		grammar: "ms",
		shortDesc: "Enseña Vendaval a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr90: {
		name: "DT90",
		grammar: "ms",
		shortDesc: "Enseña Carantoña a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr91: {
		name: "DT91",
		grammar: "ms",
		shortDesc: "Enseña Trampa Venenosa a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr92: {
		name: "DT92",
		grammar: "ms",
		shortDesc: "Enseña Brillo Mágico a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr93: {
		name: "DT93",
		grammar: "ms",
		shortDesc: "Enseña Lariat Oscuro a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr94: {
		name: "DT94",
		grammar: "ms",
		shortDesc: "Enseña Fuerza Equina a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr95: {
		name: "DT95",
		grammar: "ms",
		shortDesc: "Enseña Golpe Mordaza a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr96: {
		name: "DT96",
		grammar: "ms",
		shortDesc: "Enseña Bola de Polen a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr97: {
		name: "DT97",
		grammar: "ms",
		shortDesc: "Enseña Psicocolmillo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr98: {
		name: "DT98",
		grammar: "ms",
		shortDesc: "Enseña Hidroariete a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr99: {
		name: "DT99",
		grammar: "ms",
		shortDesc: "Enseña Plancha Corporal a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	twistedspoon: {
		name: "Cuchara Torcida",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Psíquico del portador tienen 1,2× de potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Psíquico del portador tienen 1,1× de potencia.", // NEEDS QC
		},
	},
	tyranitarite: {
		name: "Tyranitarita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Tyranitar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ultraball: {
		name: "Ultra Ball",
		grammar: "fs",
		shortDesc: "Una Ball de rendimiento superior con mejor tasa que la Super Ball.", // NEEDS QC
	},
	ultranecroziumz: {
		name: "Ultranecrostal Z",
		grammar: "ms",
		shortDesc: "Necrozma Crepuscular o Alba: Ultraexplosión y luego Movimiento Z con Géiser Fotónico.", // NEEDS QC

		transform: "  ¡{POKEMON} emite una luz cegadora!",
		activate: "¡{POKEMON} ha adoptado una nueva forma gracias a la Ultraexplosión!",
	},
	unremarkableteacup: {
		name: "Cuenco Mediocre",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Poltchageist en Sinistcha al usarse.", // NEEDS QC
	},
	upgrade: {
		name: "Mejora",
		grammar: "fs",
		shortDesc: "Hace evolucionar a Porygon en Porygon2 al intercambiarlo.", // NEEDS QC
	},
	utilityumbrella: {
		name: "Parasol Multiuso",
		grammar: "ms",
		// Official flavor text: "El portador se vuelve invulnerable a los efectos de la lluvia y del sol."
		desc: "El portador ignora los efectos de la lluvia y del sol (incluidos los de su propia habilidad, salvo Latido Oricalco y Paleosíntesis). El cálculo de daño y la precisión de los ataques que usa el portador sí se ven afectados por la lluvia y el sol, pero no los ataques que recibe.", // NEEDS QC
		shortDesc: "El portador ignora los efectos de la lluvia y del sol.", // NEEDS QC
		gen8: {
			desc: "El portador ignora los efectos de la lluvia y el sol, incluidos los de su habilidad. Los cálculos de daño y precisión de los ataques del portador sí se ven afectados por la lluvia y el sol, pero no los ataques usados contra él.", // NEEDS QC
		},
	},
	venusaurite: {
		name: "Venusaurita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Venusaur, le permite megaevolucionar en combate.", // NEEDS QC
	},
	victreebelite: {
		name: "Victreebelita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Victreebel, le permite megaevolucionar en combate.", // NEEDS QC
	},
	wacanberry: {
		name: "Baya Gualot",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Eléctrico. Un solo uso.", // NEEDS QC
	},
	watergem: {
		name: "Gema Agua",
		grammar: "fs",
		shortDesc: "Su primer ataque de tipo Agua tendrá 1,3× de potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Agua tendrá 1,5× de potencia. Un solo uso.", // NEEDS QC
		},
	},
	wateriumz: {
		name: "Hidrostal Z",
		grammar: "ms",
		shortDesc: "Permite usar un Movimiento Z de tipo Agua si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	watermemory: {
		name: "Disco Agua",
		grammar: "ms",
		shortDesc: "El Multiataque del portador es de tipo Agua.", // NEEDS QC
	},
	waterstone: {
		name: "Piedra Agua",
		grammar: "fs",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es de color azul."
		desc: "Al usarla, Poliwhirl evoluciona a Poliwrath; Shellder evoluciona a Cloyster; Staryu evoluciona a Starmie; Eevee evoluciona a Vaporeon; Lombre evoluciona a Ludicolo; Panpour evoluciona a Simipour.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	watmelberry: {
		name: "Baya Sambia",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	waveincense: {
		name: "Incienso Acua",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Agua del portador tienen 1,2× de potencia.", // NEEDS QC
	},
	weaknesspolicy: {
		name: "Seguro de Debilidad", // renamed in LZA (SV: Seguro Debilidad)
		grammar: "ms",
		shortDesc: "Si recibe un golpe supereficaz, su Ataque y Ataque Esp. suben 2 niveles. Un solo uso.", // NEEDS QC
	},
	wellspringmask: {
		name: "Máscara Fuente",
		grammar: "fs",
		shortDesc: "Ogerpon Máscara Fuente: 1,2× de potencia; Evocarrecuerdos al teracristalizar.", // NEEDS QC
	},
	wepearberry: {
		name: "Baya Peragu",
		grammar: "fs",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	whippeddream: {
		name: "Dulce de Nata",
		grammar: "ms",
		shortDesc: "Hace evolucionar a Swirlix en Slurpuff al intercambiarlo.", // NEEDS QC
	},
	whiteherb: {
		name: "Hierba Blanca",
		grammar: "fs",
		shortDesc: "Restaura las características reducidas del portador. Un solo uso.", // NEEDS QC

		end: "  ¡La Hierba Blanca ha restaurado las características de {POKEMON}!",
	},
	widelens: {
		name: "Lupa",
		grammar: "fs",
		shortDesc: "La precisión de los ataques del portador se multiplica por 1,1.", // NEEDS QC
	},
	wikiberry: {
		name: "Baya Wiki",
		grammar: "fs",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde a naturalezas -Ataque Esp. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde a naturalezas -At. Esp. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde a naturalezas -At. Esp. 1 uso.", // NEEDS QC
		},
	},
	wiseglasses: {
		name: "Gafas Especiales",
		grammar: "fp",
		shortDesc: "Sus ataques especiales tienen 1,1× de potencia.", // NEEDS QC
	},
	yacheberry: {
		name: "Baya Rimoya",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Hielo. Un solo uso.", // NEEDS QC
	},
	zapplate: {
		name: "Tabla Trueno",
		grammar: "fs",
		shortDesc: "Ataques de tipo Eléctrico: 1,2× de potencia. Sentencia es de tipo Eléctrico.", // NEEDS QC
	},
	zeraorite: {
		name: "Zeraoranita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Zeraora, le permite megaevolucionar en combate.", // NEEDS QC
	},
	zoomlens: {
		name: "Telescopio",
		grammar: "ms",
		shortDesc: "Si actúa después del objetivo, la precisión de sus ataques se multiplica por 1,2.", // NEEDS QC
	},
	zygardite: {
		name: "Zygardita",
		grammar: "fs",
		shortDesc: "Si lo lleva un Zygarde Completa, le permite megaevolucionar en combate.", // NEEDS QC
	},

	// Gen 2 items

	berserkgene: {
		name: "Gen Loco", // Gen 2: GEN LOCO (en: BERSERK GENE)
		grammar: "ms",
		shortDesc: "(2.ª gen.) Al entrar, sube 2 niveles su Ataque y lo confunde. Un solo uso.", // NEEDS QC
	},
	berry: {
		name: "Baya", // Gen 2: BAYA
		grammar: "fs",
		shortDesc: "(2.ª gen.) Restaura 10 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	bitterberry: {
		name: "Bayamarga", // Gen 2: BAYAMARGA (en: BITTER BERRY)
		grammar: "fs",
		shortDesc: "(2.ª gen.) Cura la confusión del portador. Un solo uso.", // NEEDS QC
	},
	burntberry: {
		name: "Antiquembaya", // Gen 2: ANTIQUEMBAYA (en: BURNT BERRY)
		grammar: "fs",
		shortDesc: "(2.ª gen.) Cura la congelación del portador. Un solo uso.", // NEEDS QC
	},
	goldberry: {
		name: "Baya Dorada", // Gen 2: BAYA DORADA
		grammar: "fs",
		shortDesc: "(2.ª gen.) Restaura 30 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	iceberry: {
		name: "Baya Hielo", // Gen 2: BAYA HIELO
		grammar: "fs",
		shortDesc: "(2.ª gen.) Cura la quemadura del portador. Un solo uso.", // NEEDS QC
	},
	mintberry: {
		name: "Baya Menta", // Gen 2: BAYA MENTA
		grammar: "fs",
		shortDesc: "(2.ª gen.) Despierta al portador si está dormido. Un solo uso.", // NEEDS QC
	},
	miracleberry: {
		name: "Baya Milagro", // Gen 2: BAYA MILAGRO (en: MIRACLEBERRY)
		grammar: "fs",
		shortDesc: "(2.ª gen.) Cura los problemas de estado y la confusión. Un solo uso.", // NEEDS QC
	},
	mysteryberry: {
		name: "Bayamisterio", // Gen 2: BAYAMISTERIO (en: MYSTERYBERRY)
		grammar: "fs",
		shortDesc: "(2.ª gen.) Restaura 5 PP al primer movimiento que llegue a 0 PP. Un solo uso.", // NEEDS QC

		activate: "  ¡{POKEMON} ha recuperado los PP de {MOVE} gracias a la Bayamisterio!", // NEEDS QC (SV Leppa pattern; GS: recuperó PP usando BAYAMISTERIO.)
	},
	pinkbow: {
		name: "Lazo Rosa", // Gen 2: LAZO ROSA
		grammar: "ms",
		shortDesc: "(2.ª gen.) Sus ataques de tipo Normal tienen 1,1× de potencia.", // NEEDS QC
	},
	polkadotbow: {
		name: "Cintalunares", // Gen 2: CINTALUNARES (en: POLKADOT BOW); Stadium 2: EDREDÓN LUNARES
		grammar: "fs",
		shortDesc: "(2.ª gen.) Sus ataques de tipo Normal tienen 1,1× de potencia.", // NEEDS QC
	},
	przcureberry: {
		name: "Antiparabaya", // Gen 2: ANTIPARABAYA (en: PRZCUREBERRY)
		grammar: "fs",
		shortDesc: "(2.ª gen.) Cura la parálisis del portador. Un solo uso.", // NEEDS QC
	},
	psncureberry: {
		name: "Bayantídoto", // Gen 2: BAYANTÍDOTO (en: PSNCUREBERRY)
		grammar: "fs",
		shortDesc: "(2.ª gen.) Cura el envenenamiento del portador. Un solo uso.", // NEEDS QC
	},

	// CAP items

	crucibellite: {
		name: null, // NEEDS TRANSLATION: CAP
		shortDesc: "Si lo lleva un Crucibelle, le permite megaevolucionar en combate.", // NEEDS QC
	},
	vilevial: {
		name: null, // NEEDS TRANSLATION: CAP
		shortDesc: "Si lo lleva Venomicon, sus ataques de Veneno y Volador tienen 1,2× de potencia.", // NEEDS QC
	},
};
