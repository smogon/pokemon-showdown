// Mechanics desc style (es): official game terminology. Terminology: el portador (holder),
//   el usuario (user), el objetivo (target), efecto secundario (secondary effect), hacer
//   retroceder (flinch), golpe crítico (crit), niveles (stat stages), redondeado hacia
//   abajo/arriba (rounded down/up), características (stats), un solo uso (single use).
// Cross-references generated from name fields / pokedex-names.ts. CAP entities keep name
//   null (English fallback); descs are translated with English names inline.

export const ItemsText: { [id: IDEntry]: ItemText } = {
	abilityshield: {
		name: "Escudo Habilidad",
		shortDesc: "La habilidad del portador no puede cambiarse, anularse ni ignorarse.", // NEEDS QC

		block: "  ¡El Escudo Habilidad ha protegido la habilidad de {POKEMON}!",
	},
	abomasite: {
		name: "Abomasnowita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Abomasnow, le permite megaevolucionar en combate.", // NEEDS QC
	},
	absolite: {
		name: "Absolita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Absol, le permite megaevolucionar en Mega Absol.", // NEEDS QC
	},
	absolitez: {
		name: "Absolita Z", // NEEDS QC
		shortDesc: "Si lo lleva un Absol, le permite megaevolucionar en Mega Absol Z.", // NEEDS QC
	},
	absorbbulb: {
		name: "Tubérculo",
		shortDesc: "Sube 1 nivel su Ataque Esp. si lo golpea un ataque de tipo Agua. Un solo uso.", // NEEDS QC
	},
	adamantcrystal: {
		name: "Gran Diamansfera",
		shortDesc: "Si lo lleva Dialga, sus ataques de Acero y Dragón tienen 1,2 veces más potencia.", // NEEDS QC
	},
	adamantorb: {
		name: "Diamansfera",
		shortDesc: "Si lo lleva Dialga, sus ataques de Acero y Dragón tienen 1,2 veces más potencia.", // NEEDS QC
	},
	adrenalineorb: {
		name: "Nerviosfera",
		shortDesc: "Sube 1 nivel su Velocidad si lo afecta Intimidación. Un solo uso.", // NEEDS QC
	},
	aerodactylite: {
		name: "Aerodactylita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Aerodactyl, le permite megaevolucionar en combate.", // NEEDS QC
	},
	aggronite: {
		name: "Aggronita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Aggron, le permite megaevolucionar en combate.", // NEEDS QC
	},
	aguavberry: {
		name: "Baya Guaya",
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
		shortDesc: "El portador es inmune a los ataques de tipo Tierra. Explota al ser golpeado.", // NEEDS QC

		start: "  ¡{POKEMON} está flotando con un Globo Helio!",
		end: "  ¡Ha explotado el Globo Helio de {POKEMON}!",
	},
	alakazite: {
		name: "Alakazamita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Alakazam, le permite megaevolucionar en combate.", // NEEDS QC
	},
	aloraichiumz: {
		name: "Alo-Raistal Z",
		shortDesc: "Si lo lleva un Raichu (Forma de Alola) con Rayo, puede usar Surfeo Galvánico.", // NEEDS QC
	},
	altarianite: {
		name: "Altarianita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Altaria, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ampharosite: {
		name: "Ampharosita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Ampharos, le permite megaevolucionar en combate.", // NEEDS QC
	},
	apicotberry: {
		name: "Baya Aricoc",
		shortDesc: "Sube 1 nivel su Defensa Esp. con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	armorfossil: {
		name: "Fósil Coraza",
		shortDesc: "Puede revivirse como Shieldon.", // NEEDS QC
	},
	aspearberry: {
		name: "Baya Perasi",
		grammar: "fs",
		shortDesc: "Cura la congelación del portador. Un solo uso.", // NEEDS QC
	},
	assaultvest: {
		name: "Chaleco Asalto",
		shortDesc: "Su Defensa Esp. se multiplica por 1,5, pero solo puede elegir ataques.", // NEEDS QC
	},
	audinite: {
		name: "Audinita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Audino, le permite megaevolucionar en combate.", // NEEDS QC
	},
	auspiciousarmor: {
		name: "Armadura Auspiciosa",
		shortDesc: "Hace evolucionar a Charcadet en Armarouge al usarse.", // NEEDS QC
	},
	babiriberry: {
		name: "Baya Baribá",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Acero. Un solo uso.", // NEEDS QC
	},
	banettite: {
		name: "Banettita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Banette, le permite megaevolucionar en combate.", // NEEDS QC
	},
	barbaracite: {
		name: "Barbaraclita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Barbaracle, le permite megaevolucionar en combate.", // NEEDS QC
	},
	baxcalibrite: {
		name: "Baxcaliburita", // NEEDS QC
		shortDesc: "Si lo lleva un Baxcalibur, le permite megaevolucionar en combate.", // NEEDS QC
	},
	beastball: {
		name: "Ente Ball",
		shortDesc: "Una Poké Ball especial diseñada para atrapar Ultraentes.", // NEEDS QC
	},
	beedrillite: {
		name: "Beedrillita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Beedrill, le permite megaevolucionar en combate.", // NEEDS QC
	},
	belueberry: {
		name: "Baya Andano",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	berryjuice: {
		name: "Zumo de Baya",
		shortDesc: "Restaura 20 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	berrysweet: {
		name: "Confite Fruto",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	bignugget: {
		name: "Maxipepita",
		shortDesc: "Una gran pepita de oro puro con un brillo reluciente.", // NEEDS QC
	},
	bigroot: {
		name: "Raíz Grande",
		grammar: "fs",
		shortDesc: "Recupera 1,3 veces más PS con drenados, Acua Aro, Arraigo y Drenadoras.", // NEEDS QC
		gen6: {
			shortDesc: "Recupera 1,3 veces más PS con drenados, Acua Aro, Arraigo y Drenadoras.", // NEEDS QC
		},
	},
	bindingband: {
		name: "Banda Atadura",
		shortDesc: "Sus movimientos de atadura infligen 1/6 de los PS máximos por turno en vez de 1/8.", // NEEDS QC
	},
	blackbelt: {
		name: "Cinturón Negro",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Lucha del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Lucha del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	blacksludge: {
		name: "Lodo Negro",
		shortDesc: "Cada turno, un portador de tipo Veneno recupera 1/16 de sus PS; si no, pierde 1/8.", // NEEDS QC

		heal: "  ¡{POKEMON} ha recuperado unos pocos PS gracias al Lodo Negro!",
	},
	blackglasses: {
		name: "Gafas de Sol",
		grammar: "fp",
		shortDesc: "Los ataques de tipo Siniestro del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Siniestro del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	blastoisinite: {
		name: "Blastoisita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Blastoise, le permite megaevolucionar en combate.", // NEEDS QC
	},
	blazikenite: {
		name: "Blazikenita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Blaziken, le permite megaevolucionar en combate.", // NEEDS QC
	},
	blueorb: {
		name: "Prisma Azul",
		shortDesc: "Si lo lleva un Kyogre, activa su regresión primigenia en combate.", // NEEDS QC
	},
	blukberry: {
		name: "Baya Oram",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	blunderpolicy: {
		name: "Seguro Fallo",
		shortDesc: "Si falla por precisión, su Velocidad sube 2 niveles. Un solo uso.", // NEEDS QC
	},
	boosterenergy: {
		name: "Energía Potenciadora",
		shortDesc: "Activa las habilidades Paleosíntesis o Carga Cuark. Un solo uso.", // NEEDS QC
	},
	bottlecap: {
		name: "Chapa Plateada",
		shortDesc: "Para el entreno extremo: una característica se calcula con IV 31.", // NEEDS QC
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
		shortDesc: "Su primer ataque de tipo Bicho tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Bicho tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	buginiumz: {
		name: "Insectostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Bicho si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	bugmemory: {
		name: "Disco Bicho",
		shortDesc: "El Multiataque del portador es de tipo Bicho.", // NEEDS QC
	},
	burndrive: {
		name: "PiroROM",
		shortDesc: "El Tecno Shock del portador es de tipo Fuego.", // NEEDS QC
	},
	cameruptite: {
		name: "Cameruptita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Camerupt, le permite megaevolucionar en combate.", // NEEDS QC
	},
	cellbattery: {
		name: "Pila",
		shortDesc: "Sube 1 nivel su Ataque si lo golpea un ataque de tipo Eléctrico. Un solo uso.", // NEEDS QC
	},
	chandelurite: {
		name: "Chandelurita", // NEEDS QC
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
		shortDesc: "Los ataques de tipo Fuego del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Fuego del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	charizarditex: {
		name: "Charizardita X", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Charizard, le permite megaevolucionar en Mega Charizard X.", // NEEDS QC
	},
	charizarditey: {
		name: "Charizardita Y", // NEEDS QC
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
		shortDesc: "Una Poké Ball rara creada para conmemorar una ocasión.", // NEEDS QC
	},
	chesnaughtite: {
		name: "Chesnaughtita", // NEEDS QC
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
		shortDesc: "El Tecno Shock del portador es de tipo Hielo.", // NEEDS QC
	},
	chimechite: {
		name: "Chimechita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Chimecho, le permite megaevolucionar en combate.", // NEEDS QC
	},
	chippedpot: {
		name: "Tetera Rota",
		shortDesc: "Hace evolucionar a Sinistea antiguo en Polteageist antiguo al usarse.", // NEEDS QC
	},
	choiceband: {
		name: "Cinta Elección",
		shortDesc: "Su Ataque es 1,5 veces mayor, pero solo puede usar su primer movimiento.", // NEEDS QC
	},
	choicescarf: {
		name: "Pañuelo Elección",
		grammar: "ms",
		shortDesc: "Su Velocidad es 1,5 veces mayor, pero solo puede usar su primer movimiento.", // NEEDS QC
	},
	choicespecs: {
		name: "Gafas Elección",
		shortDesc: "Su Ataque Esp. es 1,5 veces mayor, pero solo puede usar su primer movimiento.", // NEEDS QC
	},
	chopleberry: {
		name: "Baya Pomaro",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Lucha. Un solo uso.", // NEEDS QC
	},
	clawfossil: {
		name: "Fósil Garra",
		shortDesc: "Puede revivirse como Anorith.", // NEEDS QC
	},
	clearamulet: {
		name: "Amuleto Puro",
		shortDesc: "Impide que otros Pokémon bajen las características del portador.", // NEEDS QC

		block: "  ¡El Amuleto Puro ha impedido que disminuyan las características de {POKEMON}!",
	},
	clefablite: {
		name: "Clefablita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Clefable, le permite megaevolucionar en combate.", // NEEDS QC
	},
	cloversweet: {
		name: "Confite Trébol",
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
		shortDesc: "Ogerpon Cimiento: ataques 1,2 veces más potentes; Evocarrecuerdos al teracristalizar.", // NEEDS QC
	},
	cornnberry: {
		name: "Baya Mais",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	coverfossil: {
		name: "Fósil Tapa",
		shortDesc: "Puede revivirse como Tirtouga.", // NEEDS QC
	},
	covertcloak: {
		name: "Capa Furtiva",
		desc: "El portador no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Entre los efectos evitados se incluyen los que tienen una probabilidad (incluso del 100%) de causar parálisis, sueño, congelación, quemadura, envenenamiento, confusión, hacer retroceder al portador o bajar sus características, así como los efectos de Anclaje, Conjuro Funesto, Lanzamiento, Psicorruido, Salazón, Puntada Sombría, Bomba Caramelo, Golpe Mordaza. El efecto de Aria Burbuja se evita solo si el portador es el único objetivo. También se evitan los efectos añadidos por Roca del Rey, Colmillo Agudo y las habilidades Toque Tóxico, Hedor y Cadena Tóxica.", // NEEDS QC
		shortDesc: "El portador no sufre los efectos secundarios de los ataques de otros Pokémon.", // NEEDS QC
	},
	crabominite: {
		name: "Crabominablita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Crabominable, le permite megaevolucionar en combate.", // NEEDS QC
	},
	crackedpot: {
		name: "Tetera Agrietada",
		shortDesc: "Hace evolucionar a Sinistea en Polteageist al usarse.", // NEEDS QC
	},
	custapberry: {
		name: "Baya Chiri",
		shortDesc: "Actúa primero dentro de su prioridad con 1/4 o menos de sus PS. Un solo uso.", // NEEDS QC

		activate: "  ¡Gracias a la Baya Chiri, {POKEMON} puede tener prioridad!",
	},
	damprock: {
		name: "Roca Lluvia",
		grammar: "fs",
		shortDesc: "Su Danza Lluvia dura 8 turnos en lugar de 5.", // NEEDS QC
	},
	darkgem: {
		name: "Gema Siniestra",
		shortDesc: "Su primer ataque de tipo Siniestro tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Siniestro tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	darkiniumz: {
		name: "Nictostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Siniestro si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	darkmemory: {
		name: "Disco Siniestro",
		shortDesc: "El Multiataque del portador es de tipo Siniestro.", // NEEDS QC
	},
	darkranite: {
		name: "Darkrainita", // NEEDS QC
		shortDesc: "Si lo lleva un Darkrai, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dawnstone: {
		name: "Piedra Alba",
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Brilla como un lucero."
		desc: "Al usarla, un Kirlia macho evoluciona a Gallade y un Snorunt hembra evoluciona a Froslass.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	decidiumz: {
		name: "Dueyestal Z",
		shortDesc: "Si lo lleva un Decidueye con Puntada Sombría, puede usar Aluvión de Flechas Sombrías.", // NEEDS QC
	},
	deepseascale: {
		name: "Escama Marina",
		// Official flavor text: "Tiene un débil brillo rosado y debe llevarla Clamperl. Sube la Defensa Especial."
		desc: "Si la lleva un Clamperl, su Defensa Especial se duplica. Si la lleva al intercambiarlo, Clamperl evoluciona a Gorebyss.", // NEEDS QC
		shortDesc: "Si lo lleva un Clamperl, su Defensa Esp. se duplica.", // NEEDS QC
	},
	deepseatooth: {
		name: "Diente Marino",
		// Official flavor text: "Tiene el brillo afilado de la plata y debe llevarlo Clamperl. Sube el Ataque Especial."
		desc: "Si lo lleva un Clamperl, su Ataque Especial se duplica. Si lo lleva al intercambiarlo, Clamperl evoluciona a Huntail.", // NEEDS QC
		shortDesc: "Si lo lleva un Clamperl, su Ataque Esp. se duplica.", // NEEDS QC
	},
	delphoxite: {
		name: "Delphoxita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Delphox, le permite megaevolucionar en combate.", // NEEDS QC
	},
	destinyknot: {
		name: "Lazo Destino",
		shortDesc: "Si el portador queda enamorado, el otro Pokémon también.", // NEEDS QC
	},
	diancite: {
		name: "Diancita", // NEEDS QC
		shortDesc: "Si lo lleva un Diancie, le permite megaevolucionar en combate.", // NEEDS QC
	},
	diveball: {
		name: "Buceo Ball",
		shortDesc: "Una Poké Ball que funciona especialmente bien bajo el agua.", // NEEDS QC
	},
	domefossil: {
		name: "Fósil Domo",
		shortDesc: "Puede revivirse como Kabuto.", // NEEDS QC
	},
	dousedrive: {
		name: "HidroROM",
		shortDesc: "El Tecno Shock del portador es de tipo Agua.", // NEEDS QC
	},
	dracoplate: {
		name: "Tabla Draco",
		shortDesc: "Ataques de tipo Dragón: 1,2 veces más potencia. Sentencia es de tipo Dragón.", // NEEDS QC
	},
	dragalgite: {
		name: "Dragalgita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Dragalge, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dragonfang: {
		name: "Colmillo de Dragón",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Dragón del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Dragón del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	dragongem: {
		name: "Gema Dragón",
		shortDesc: "Su primer ataque de tipo Dragón tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Dragón tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	dragoninite: {
		name: "Dragonitita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Dragonite, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dragoniumz: {
		name: "Dracostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Dragón si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	dragonmemory: {
		name: "Disco Dragón",
		shortDesc: "El Multiataque del portador es de tipo Dragón.", // NEEDS QC
	},
	dragonscale: {
		name: "Escama Dragón",
		shortDesc: "Hace evolucionar a Seadra en Kingdra al intercambiarlo.", // NEEDS QC
		gen2: {
			shortDesc: "Ataques de Dragón: 1,1x potencia. Evoluciona a Seadra al intercambiarlo.", // NEEDS QC
		},
	},
	drampanite: {
		name: "Drampanita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Drampa, le permite megaevolucionar en combate.", // NEEDS QC
	},
	dreadplate: {
		name: "Tabla Oscura",
		shortDesc: "Ataques de tipo Siniestro: 1,2 veces más potencia. Sentencia es de tipo Siniestro.", // NEEDS QC
	},
	dreamball: {
		name: "Ensueño Ball",
		shortDesc: "Una Poké Ball más eficaz para atrapar Pokémon dormidos.", // NEEDS QC
		gen7: {
			shortDesc: "Una Poké Ball especial que aparece de la nada en la mochila, en el Bosque Nexo.", // NEEDS QC
		},
	},
	dubiousdisc: {
		name: "Disco Extraño",
		shortDesc: "Hace evolucionar a Porygon2 en Porygon-Z al intercambiarlo.", // NEEDS QC
	},
	durinberry: {
		name: "Baya Rudion",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	duskball: {
		name: "Ocaso Ball",
		shortDesc: "Una Poké Ball más eficaz de noche o en cuevas.", // NEEDS QC
	},
	duskstone: {
		name: "Piedra Noche",
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Es oscura como la noche."
		desc: "Al usarla, Murkrow evoluciona a Honchkrow; Misdreavus evoluciona a Mismagius; Lampent evoluciona a Chandelure; Doublade evoluciona a Aegislash.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	earthplate: {
		name: "Tabla Terrax",
		shortDesc: "Ataques de tipo Tierra: 1,2 veces más potencia. Sentencia es de tipo Tierra.", // NEEDS QC
	},
	eelektrossite: {
		name: "Eelektrossita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Eelektross, le permite megaevolucionar en combate.", // NEEDS QC
	},
	eeviumz: {
		name: "Eeveestal Z",
		shortDesc: "Si lo lleva un Eevee con Última Baza, puede usar Novena Potencia.", // NEEDS QC
	},
	ejectbutton: {
		name: "Botón Escape",
		shortDesc: "Si sobrevive a un golpe, se cambia de inmediato por el aliado elegido. Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} regresa gracias al Botón Escape!",
	},
	ejectpack: {
		name: "Mochila Escape",
		shortDesc: "Si le bajan las características, se cambia por el aliado elegido. Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} regresa gracias a la Mochila Escape!",
	},
	electirizer: {
		name: "Electrizador",
		shortDesc: "Hace evolucionar a Electabuzz en Electivire al intercambiarlo.", // NEEDS QC
	},
	electricgem: {
		name: "Gema Eléctrica",
		shortDesc: "Su primer ataque de tipo Eléctrico tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Eléctrico tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	electricmemory: {
		name: "Disco Eléctrico",
		shortDesc: "El Multiataque del portador es de tipo Eléctrico.", // NEEDS QC
	},
	electricseed: {
		name: "Semilla Electro",
		shortDesc: "En campo eléctrico, sube 1 nivel la Defensa del portador. Un solo uso.", // NEEDS QC
	},
	electriumz: {
		name: "Electrostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Eléctrico si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	emboarite: {
		name: "Emboarita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Emboar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	enigmaberry: {
		name: "Baya Enigma",
		shortDesc: "Restaura 1/4 de sus PS máximos tras recibir un golpe supereficaz. Un solo uso.", // NEEDS QC
		gen3: {
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	eviolite: {
		name: "Mineral Evol",
		shortDesc: "Si su especie aún puede evolucionar, su Defensa y Defensa Esp. son 1,5 veces mayores.", // NEEDS QC
	},
	excadrite: {
		name: "Excadrillita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Excadrill, le permite megaevolucionar en combate.", // NEEDS QC
	},
	expertbelt: {
		name: "Cinta Experto",
		grammar: "ms",
		shortDesc: "Sus ataques supereficaces infligen 1,2 veces más daño.", // NEEDS QC
	},
	fairiumz: {
		name: "Feeristal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Hada si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	fairyfeather: {
		name: "Pluma Feérica",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Hada del portador tienen 1,2 veces más potencia.", // NEEDS QC
	},
	fairygem: {
		name: "Gema Hada",
		shortDesc: "Su primer ataque de tipo Hada tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
	},
	fairymemory: {
		name: "Disco Hada",
		shortDesc: "El Multiataque del portador es de tipo Hada.", // NEEDS QC
	},
	falinksite: {
		name: "Falinksita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Falinks, le permite megaevolucionar en combate.", // NEEDS QC
	},
	fastball: {
		name: "Rapid Ball",
		shortDesc: "Una Poké Ball más eficaz con Pokémon que huyen rápido.", // NEEDS QC
	},
	feraligite: {
		name: "Feraligatrita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Feraligatr, le permite megaevolucionar en combate.", // NEEDS QC
	},
	fightinggem: {
		name: "Gema Lucha",
		shortDesc: "Su primer ataque de tipo Lucha tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Lucha tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	fightingmemory: {
		name: "Disco Lucha",
		shortDesc: "El Multiataque del portador es de tipo Lucha.", // NEEDS QC
	},
	fightiniumz: {
		name: "Lizastal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Lucha si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	figyberry: {
		name: "Baya Higog",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde a naturalezas -Ataque. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde a naturalezas -Ataque. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde a naturalezas -Ataque. 1 uso.", // NEEDS QC
		},
	},
	firegem: {
		name: "Gema Fuego",
		shortDesc: "Su primer ataque de tipo Fuego tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Fuego tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	firememory: {
		name: "Disco Fuego",
		shortDesc: "El Multiataque del portador es de tipo Fuego.", // NEEDS QC
	},
	firestone: {
		name: "Piedra Fuego",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es amarilla con una marca naranja."
		desc: "Al usarla, Vulpix evoluciona a Ninetales; Growlithe evoluciona a Arcanine; Eevee evoluciona a Flareon; Pansear evoluciona a Simisear.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	firiumz: {
		name: "Pirostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Fuego si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	fistplate: {
		name: "Tabla Fuerte",
		shortDesc: "Ataques de tipo Lucha: 1,2 veces más potencia. Sentencia es de tipo Lucha.", // NEEDS QC
	},
	flameorb: {
		name: "Llamasfera",
		shortDesc: "Al final de cada turno, intenta quemar al portador.", // NEEDS QC
	},
	flameplate: {
		name: "Tabla Llama",
		shortDesc: "Ataques de tipo Fuego: 1,2 veces más potencia. Sentencia es de tipo Fuego.", // NEEDS QC
	},
	floatstone: {
		name: "Piedra Pómez",
		shortDesc: "El peso del portador se reduce a la mitad.", // NEEDS QC
	},
	floettite: {
		name: "Floettita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Floette Flor Eterna, le permite megaevolucionar en combate.", // NEEDS QC
	},
	flowersweet: {
		name: "Confite Flor",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	flyinggem: {
		name: "Gema Voladora",
		shortDesc: "Su primer ataque de tipo Volador tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Volador tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	flyingmemory: {
		name: "Disco Volador",
		shortDesc: "El Multiataque del portador es de tipo Volador.", // NEEDS QC
	},
	flyiniumz: {
		name: "Aerostal Z",
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
		shortDesc: "Revive como Dracozolt con Dracofósil o Arctozolt con Plesiofósil.", // NEEDS QC
	},
	fossilizeddino: {
		name: "Plesiofósil",
		shortDesc: "Revive como Arctovish con Ictiofósil o Arctozolt con Ornitofósil.", // NEEDS QC
	},
	fossilizeddrake: {
		name: "Dracofósil",
		shortDesc: "Revive como Dracozolt con Ornitofósil o Dracovish con Ictiofósil.", // NEEDS QC
	},
	fossilizedfish: {
		name: "Ictiofósil",
		shortDesc: "Revive como Dracovish con Dracofósil o Arctovish con Plesiofósil.", // NEEDS QC
	},
	friendball: {
		name: "Amigo Ball",
		shortDesc: "Una Poké Ball que hace más amistosos a los Pokémon atrapados.", // NEEDS QC
	},
	froslassite: {
		name: "Froslassita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Froslass, le permite megaevolucionar en combate.", // NEEDS QC
	},
	fullincense: {
		name: "Incienso Lento",
		shortDesc: "El portador actúa el último dentro de su prioridad.", // NEEDS QC
	},
	galaricacuff: {
		name: "Brazal Galanuez",
		shortDesc: "Hace evolucionar a Slowpoke (Forma de Galar) en Slowbro (Forma de Galar) al usarse.", // NEEDS QC
	},
	galaricawreath: {
		name: "Corona Galanuez",
		shortDesc: "Hace evolucionar a Slowpoke (Forma de Galar) en Slowking de Galar al usarse.", // NEEDS QC
	},
	galladite: {
		name: "Galladita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Gallade, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ganlonberry: {
		name: "Baya Gonlan",
		shortDesc: "Sube 1 nivel su Defensa con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	garchompite: {
		name: "Garchompita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Garchomp, le permite megaevolucionar en Mega Garchomp.", // NEEDS QC
	},
	garchompitez: {
		name: "Garchompita Z", // NEEDS QC
		shortDesc: "Si lo lleva un Garchomp, le permite megaevolucionar en Mega Garchomp Z.", // NEEDS QC
	},
	gardevoirite: {
		name: "Gardevoirita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Gardevoir, le permite megaevolucionar en combate.", // NEEDS QC
	},
	gengarite: {
		name: "Gengarita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Gengar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ghostgem: {
		name: "Gema Fantasma",
		shortDesc: "Su primer ataque de tipo Fantasma tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Fantasma tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	ghostiumz: {
		name: "Espectrostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Fantasma si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	ghostmemory: {
		name: "Disco Fantasma",
		shortDesc: "El Multiataque del portador es de tipo Fantasma.", // NEEDS QC
	},
	glalitite: {
		name: "Glalita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Glalie, le permite megaevolucionar en combate.", // NEEDS QC
	},
	glimmoranite: {
		name: "Glimmoranita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Glimmora, le permite megaevolucionar en combate.", // NEEDS QC
	},
	goldbottlecap: {
		name: "Chapa Dorada",
		shortDesc: "Para el entreno extremo: todas las características se calculan con IV 31.", // NEEDS QC
	},
	golisopite: {
		name: "Golisopodita", // NEEDS QC
		shortDesc: "Si lo lleva un Golisopod, le permite megaevolucionar en combate.", // NEEDS QC
	},
	golurkite: {
		name: "Golurkita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Golurk, le permite megaevolucionar en combate.", // NEEDS QC
	},
	grassgem: {
		name: "Gema Planta",
		shortDesc: "Su primer ataque de tipo Planta tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Planta tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	grassiumz: {
		name: "Fitostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Planta si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	grassmemory: {
		name: "Disco Planta",
		shortDesc: "El Multiataque del portador es de tipo Planta.", // NEEDS QC
	},
	grassyseed: {
		name: "Semilla Hierba",
		shortDesc: "En campo de hierba, sube 1 nivel la Defensa del portador. Un solo uso.", // NEEDS QC
	},
	greatball: {
		name: "Super Ball",
		shortDesc: "Una Ball de alto rendimiento con mejor tasa de captura que la Poké Ball.", // NEEDS QC
	},
	greninjite: {
		name: "Greninjanita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Greninja, le permite megaevolucionar en combate.", // NEEDS QC
	},
	grepaberry: {
		name: "Baya Uvav",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	gripclaw: {
		name: "Garra Garfio",
		shortDesc: "Sus movimientos de atadura siempre duran 7 turnos.", // NEEDS QC
	},
	griseouscore: {
		name: "Gran Griseosfera",
		shortDesc: "Si lo lleva Giratina, sus ataques de Fantasma y Dragón tienen 1,2 veces más potencia.", // NEEDS QC
	},
	griseousorb: {
		name: "Griseosfera",
		shortDesc: "Si lo lleva Giratina, sus ataques de Fantasma y Dragón tienen 1,2 veces más potencia.", // NEEDS QC
		gen4: {
			shortDesc: "Solo Giratina puede llevarlo. Sus ataques de Fantasma y Dragón tienen 1,2x potencia.", // NEEDS QC
		},
	},
	groundgem: {
		name: "Gema Tierra",
		shortDesc: "Su primer ataque de tipo Tierra tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Tierra tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	groundiumz: {
		name: "Geostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Tierra si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	groundmemory: {
		name: "Disco Tierra",
		shortDesc: "El Multiataque del portador es de tipo Tierra.", // NEEDS QC
	},
	gyaradosite: {
		name: "Gyaradosita", // NEEDS QC
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
		shortDesc: "Los ataques de tipo Roca del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Roca del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	hawluchanite: {
		name: "Hawluchanita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Hawlucha, le permite megaevolucionar en combate.", // NEEDS QC
	},
	healball: {
		name: "Sana Ball",
		shortDesc: "Una Poké Ball que cura los PS y el estado del Pokémon atrapado.", // NEEDS QC
	},
	hearthflamemask: {
		name: "Máscara Horno",
		shortDesc: "Ogerpon Horno: ataques 1,2 veces más potentes; Evocarrecuerdos al teracristalizar.", // NEEDS QC
	},
	heatranite: {
		name: "Heatranita", // NEEDS QC
		shortDesc: "Si lo lleva un Heatran, le permite megaevolucionar en combate.", // NEEDS QC
	},
	heatrock: {
		name: "Roca Calor",
		grammar: "fs",
		shortDesc: "Su Día Soleado dura 8 turnos en lugar de 5.", // NEEDS QC
	},
	heavyball: {
		name: "Peso Ball",
		shortDesc: "Una Poké Ball para atrapar Pokémon muy pesados.", // NEEDS QC
	},
	heavydutyboots: {
		name: "Botas Gruesas",
		shortDesc: "Al entrar en combate, el portador ignora las trampas de su bando.", // NEEDS QC
	},
	helixfossil: {
		name: "Fósil Hélix",
		shortDesc: "Puede revivirse como Omanyte.", // NEEDS QC
	},
	heracronite: {
		name: "Heracrossita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Heracross, le permite megaevolucionar en combate.", // NEEDS QC
	},
	hondewberry: {
		name: "Baya Meluce",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	houndoominite: {
		name: "Houndoomita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Houndoom, le permite megaevolucionar en combate.", // NEEDS QC
	},
	iapapaberry: {
		name: "Baya Pabaya",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde a naturalezas -Defensa. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde a naturalezas -Defensa. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde a naturalezas -Defensa. 1 uso.", // NEEDS QC
		},
	},
	icegem: {
		name: "Gema Hielo",
		shortDesc: "Su primer ataque de tipo Hielo tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Hielo tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	icememory: {
		name: "Disco Hielo",
		shortDesc: "El Multiataque del portador es de tipo Hielo.", // NEEDS QC
	},
	icestone: {
		name: "Piedra Hielo",
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Presenta motivos que recuerdan a los cristales de hielo."
		desc: "Al usarla, Sandshrew (Forma de Alola) evoluciona a Sandslash (Forma de Alola); Vulpix (Forma de Alola) evoluciona a Ninetales (Forma de Alola); Eevee evoluciona a Glaceon; y Darumaka (Forma de Galar) evoluciona a Darmanitan (Forma de Galar).", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
		gen7: {
			desc: "Al usarla, Sandshrew (Forma de Alola) evoluciona a Sandslash (Forma de Alola) y Vulpix (Forma de Alola) evoluciona a Ninetales (Forma de Alola).", // NEEDS QC
		},
	},
	icicleplate: {
		name: "Tabla Helada",
		shortDesc: "Ataques de tipo Hielo: 1,2 veces más potencia. Sentencia es de tipo Hielo.", // NEEDS QC
	},
	iciumz: {
		name: "Criostal Z",
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
		shortDesc: "Si lo lleva un Incineroar con Lariat Oscuro, puede usar Hiperplancha Oscura.", // NEEDS QC
	},
	insectplate: {
		name: "Tabla Bicho",
		shortDesc: "Ataques de tipo Bicho: 1,2 veces más potencia. Sentencia es de tipo Bicho.", // NEEDS QC
	},
	ironball: {
		name: "Bola Férrea",
		grammar: "fs",
		shortDesc: "El portador queda en el suelo y su Velocidad se reduce a la mitad; los Voladores reciben daño neutro de Tierra.", // NEEDS QC
		gen4: {
			shortDesc: "La Velocidad del portador se reduce a la mitad y queda en el suelo.", // NEEDS QC
		},
	},
	ironplate: {
		name: "Tabla Acero",
		shortDesc: "Ataques de tipo Acero: 1,2 veces más potencia. Sentencia es de tipo Acero.", // NEEDS QC
	},
	jabocaberry: {
		name: "Baya Jaboca",
		shortDesc: "Si lo golpea un movimiento físico, el atacante pierde 1/8 de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	jawfossil: {
		name: "Fósil Mandíbula",
		shortDesc: "Puede revivirse como Tyrunt.", // NEEDS QC
	},
	kangaskhanite: {
		name: "Kangaskhanita", // NEEDS QC
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
		shortDesc: "Sube 1 nivel su Defensa tras recibir un ataque físico. Un solo uso.", // NEEDS QC
	},
	kelpsyberry: {
		name: "Baya Algama",
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
		shortDesc: "Si lo lleva un Kommo-o con Fragor Escamas, puede usar Estruendo Implacable.", // NEEDS QC
	},
	laggingtail: {
		name: "Cola Plúmbea",
		shortDesc: "El portador actúa el último dentro de su prioridad.", // NEEDS QC
	},
	lansatberry: {
		name: "Baya Zonlan",
		shortDesc: "Obtiene el efecto de Foco Energía con 1/4 o menos de sus PS. Un solo uso.", // NEEDS QC
	},
	latiasite: {
		name: "Latiasita", // NEEDS QC
		shortDesc: "Si lo lleva un Latias, le permite megaevolucionar en combate.", // NEEDS QC
	},
	latiosite: {
		name: "Latiosita", // NEEDS QC
		shortDesc: "Si lo lleva un Latios, le permite megaevolucionar en combate.", // NEEDS QC
	},
	laxincense: {
		name: "Incienso Suave",
		shortDesc: "La precisión de los ataques contra el portador se multiplica por 0,9.", // NEEDS QC
		gen3: {
			shortDesc: "La precisión de los ataques contra el portador se multiplica por 0,95.", // NEEDS QC
		},
	},
	leafstone: {
		name: "Piedra Hoja",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Tiene grabada una hoja."
		desc: "Al usarla, Gloom evoluciona a Vileplume; Weepinbell evoluciona a Victreebel; Exeggcute evoluciona a Exeggutor o Exeggutor (Forma de Alola); Eevee evoluciona a Leafeon; Nuzleaf evoluciona a Shiftry; Pansage evoluciona a Simisage.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
		gen7: {
			desc: "Al usarla, Gloom evoluciona a Vileplume; Weepinbell a Victreebel; Exeggcute a Exeggutor o Exeggutor (Forma de Alola); Nuzleaf a Shiftry; y Pansage a Simisage.", // NEEDS QC
		},
	},
	leek: {
		name: "Puerro",
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
		shortDesc: "Una Poké Ball para atrapar Pokémon de nivel inferior al tuyo.", // NEEDS QC
	},
	liechiberry: {
		name: "Baya Lichi",
		shortDesc: "Sube 1 nivel su Ataque con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	lifeorb: {
		name: "Vidasfera",
		grammar: "fs",
		shortDesc: "Sus ataques infligen 1,3 veces más daño, pero pierde 1/10 de sus PS máximos al atacar.", // NEEDS QC

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
		desc: "Los movimientos del portador que golpean de 2 a 5 veces pasan a golpear siempre 4 o 5 veces. Si el primer golpe acierta, Triple Patada y Triple Axel golpean 3 veces y Proliferación golpea de 4 a 10 veces al azar.", // NEEDS QC
		shortDesc: "Sus movimientos de 2-5 golpes dan 4-5; Proliferación, de 4 a 10.", // NEEDS QC
	},
	lopunnite: {
		name: "Lopunnita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Lopunny, le permite megaevolucionar en combate.", // NEEDS QC
	},
	loveball: {
		name: "Amor Ball",
		shortDesc: "Una Poké Ball para atrapar Pokémon del sexo opuesto al del tuyo.", // NEEDS QC
	},
	lovesweet: {
		name: "Confite Corazón",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	lucarionite: {
		name: "Lucarita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Lucario, le permite megaevolucionar en Mega Lucario.", // NEEDS QC
	},
	lucarionitez: {
		name: "Lucarita Z", // NEEDS QC
		shortDesc: "Si lo lleva un Lucario, le permite megaevolucionar en Mega Lucario Z.", // NEEDS QC
	},
	luckypunch: {
		name: "Puño Suerte",
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
		shortDesc: "Sube 1 nivel su Defensa Esp. si lo golpea un ataque de tipo Agua. Un solo uso.", // NEEDS QC
	},
	lunaliumz: {
		name: "Lunalastal Z",
		shortDesc: "Lunala o Necrozma Alas del Alba con Rayo Umbrío: Movimiento Z especial.", // NEEDS QC
	},
	lureball: {
		name: "Cebo Ball",
		shortDesc: "Una Poké Ball para atrapar Pokémon que han picado el anzuelo.", // NEEDS QC
	},
	lustrousglobe: {
		name: "Gran Lustresfera",
		shortDesc: "Si lo lleva Palkia, sus ataques de Agua y Dragón tienen 1,2 veces más potencia.", // NEEDS QC
	},
	lustrousorb: {
		name: "Lustresfera",
		shortDesc: "Si lo lleva Palkia, sus ataques de Agua y Dragón tienen 1,2 veces más potencia.", // NEEDS QC
	},
	luxuryball: {
		name: "Lujo Ball",
		shortDesc: "Una cómoda Poké Ball que hace que el Pokémon atrapado se encariñe antes.", // NEEDS QC
	},
	lycaniumz: {
		name: "Lycanrostal Z",
		shortDesc: "Si lo lleva un Lycanroc con Roca Afilada, puede usar Tempestad Rocosa.", // NEEDS QC
	},
	machobrace: {
		name: "Brazal Firme",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	magearnite: {
		name: "Magearnita", // NEEDS QC
		shortDesc: "Si lo lleva un Magearna, le permite megaevolucionar en combate.", // NEEDS QC
	},
	magmarizer: {
		name: "Magmatizador",
		shortDesc: "Hace evolucionar a Magmar en Magmortar al intercambiarlo.", // NEEDS QC
	},
	magnet: {
		name: "Imán",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Eléctrico del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Eléctrico del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	magoberry: {
		name: "Baya Ango",
		shortDesc: "Restaura 1/3 de PS con 1/4 o menos; confunde a naturalezas -Velocidad. 1 uso.", // NEEDS QC
		gen7: {
			shortDesc: "Restaura 1/2 de PS con 1/4 o menos; confunde a naturalezas -Velocidad. 1 uso.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Restaura 1/8 de PS con 1/2 o menos; confunde a naturalezas -Velocidad. 1 uso.", // NEEDS QC
		},
	},
	magostberry: {
		name: "Baya Aostan",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	mail: {
		name: "Carta", // NEEDS QC
		shortDesc: "Solo puede darse o quitarse con Antojo, Desarme o Ladrón.", // NEEDS QC
	},
	malamarite: {
		name: "Malamarita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Malamar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	maliciousarmor: {
		name: "Armadura Maldita",
		shortDesc: "Hace evolucionar a Charcadet en Ceruledge al usarse.", // NEEDS QC
	},
	manectite: {
		name: "Manectricita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Manectric, le permite megaevolucionar en combate.", // NEEDS QC
	},
	marangaberry: {
		name: "Baya Maranga",
		shortDesc: "Sube 1 nivel su Defensa Esp. tras recibir un ataque especial. Un solo uso.", // NEEDS QC
	},
	marshadiumz: {
		name: "Marshastal Z",
		shortDesc: "Si lo lleva Marshadow con Robasombra, puede usar Constelación Robaalmas.", // NEEDS QC
	},
	masterball: {
		name: "Master Ball",
		shortDesc: "La mejor Ball: atrapa cualquier Pokémon salvaje sin fallar.", // NEEDS QC
	},
	masterpieceteacup: {
		name: "Cuenco Exquisito",
		shortDesc: "Hace evolucionar a Poltchageist rústico en Sinistcha exquisito al usarse.", // NEEDS QC
	},
	mawilite: {
		name: "Mawilita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Mawile, le permite megaevolucionar en combate.", // NEEDS QC
	},
	meadowplate: {
		name: "Tabla Pradal",
		shortDesc: "Ataques de tipo Planta: 1,2 veces más potencia. Sentencia es de tipo Planta.", // NEEDS QC
	},
	medichamite: {
		name: "Medichamita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Medicham, le permite megaevolucionar en combate.", // NEEDS QC
	},
	meganiumite: {
		name: "Meganiumita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Meganium, le permite megaevolucionar en combate.", // NEEDS QC
	},
	mentalherb: {
		name: "Hierba Mental",
		grammar: "fs",
		shortDesc: "Cura el enamoramiento, Anulación, Otra Vez, Mofa y más. Un solo uso.", // NEEDS QC
		gen4: {
			shortDesc: "Cura el enamoramiento del portador. Un solo uso.", // NEEDS QC
		},
	},
	meowsticite: {
		name: "Meowsticita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Meowstic, le permite megaevolucionar en combate.", // NEEDS QC
	},
	metagrossite: {
		name: "Metagrossita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Metagross, le permite megaevolucionar en combate.", // NEEDS QC
	},
	metalalloy: {
		name: "Metal Compuesto",
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
		desc: "Los ataques de tipo Acero del portador tienen 1,2 veces más potencia. Si lo lleva al intercambiarlo, Onix evoluciona a Steelix y Scyther evoluciona a Scizor.", // NEEDS QC
		shortDesc: "Los ataques de tipo Acero del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			desc: "Los ataques de Acero del portador tienen 1,1x más potencia. Al intercambiarlo, Onix evoluciona a Steelix y Scyther a Scizor.", // NEEDS QC
			shortDesc: "Los ataques de tipo Acero del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	metalpowder: {
		name: "Polvo Metálico",
		shortDesc: "Si lo lleva un Ditto sin transformar, su Defensa se duplica.", // NEEDS QC
		gen2: {
			shortDesc: "Si lo lleva un Ditto, su Defensa y Def. Esp. son x1,5, incluso transformado.", // NEEDS QC
		},
	},
	metronome: {
		name: "Metrónomo",
		grammar: "ms",
		shortDesc: "El daño de movimientos usados turnos seguidos aumenta, hasta 2x tras 5 turnos.", // NEEDS QC
		gen4: {
			shortDesc: "El daño de movimientos usados turnos seguidos aumenta, hasta 2x tras 10 turnos.", // NEEDS QC
		},
	},
	mewniumz: {
		name: "Mewstal Z",
		shortDesc: "Si lo lleva un Mew con Psíquico, puede usar Supernova Original.", // NEEDS QC
	},
	mewtwonitex: {
		name: "Mewtwoita X", // NEEDS QC
		shortDesc: "Si lo lleva un Mewtwo, le permite megaevolucionar en Mega Mewtwo X.", // NEEDS QC
	},
	mewtwonitey: {
		name: "Mewtwoita Y", // NEEDS QC
		shortDesc: "Si lo lleva un Mewtwo, le permite megaevolucionar en Mega Mewtwo Y.", // NEEDS QC
	},
	micleberry: {
		name: "Baya Lagro",
		shortDesc: "Su próximo movimiento tiene 1,2x más precisión con 1/4 o menos de PS. 1 uso.", // NEEDS QC
	},
	mimikiumz: {
		name: "Mimikyustal Z",
		shortDesc: "Si lo lleva un Mimikyu con Carantoña, puede usar Somanta Amistosa.", // NEEDS QC
	},
	mindplate: {
		name: "Tabla Mental",
		shortDesc: "Ataques de tipo Psíquico: 1,2 veces más potencia. Sentencia es de tipo Psíquico.", // NEEDS QC
	},
	miracleseed: {
		name: "Semilla Milagro",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Planta del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Planta del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	mirrorherb: {
		name: "Hierba Copia",
		shortDesc: "Cuando un rival sube sus características, el portador lo copia. Un solo uso.", // NEEDS QC

		activate: "  ¡{POKEMON} ha usado una Hierba Copia y ha copiado los cambios en las características del rival!",
	},
	mistyseed: {
		name: "Semilla Bruma",
		shortDesc: "En campo de niebla, sube 1 nivel la Defensa Esp. del portador. Un solo uso.", // NEEDS QC
	},
	moonball: {
		name: "Luna Ball",
		shortDesc: "Una Poké Ball para atrapar Pokémon que evolucionan con la Piedra Lunar.", // NEEDS QC
	},
	moonstone: {
		name: "Piedra Lunar",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es oscura como la noche."
		desc: "Al usarla, Nidorina evoluciona a Nidoqueen; Nidorino evoluciona a Nidoking; Clefairy evoluciona a Clefable; Jigglypuff evoluciona a Wigglytuff; Skitty evoluciona a Delcatty; Munna evoluciona a Musharna.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	muscleband: {
		name: "Cinta Fuerte",
		grammar: "fs",
		shortDesc: "Sus ataques físicos tienen 1,1 veces más potencia.", // NEEDS QC
	},
	mysticwater: {
		name: "Agua Mística",
		grammar: "fu",
		articleRule: "stressed-a",
		classified: {
			name: "colgante de Agua Mística",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Agua del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Agua del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	nanabberry: {
		name: "Baya Latano",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	nestball: {
		name: "Nido Ball",
		shortDesc: "Una Poké Ball más eficaz con Pokémon salvajes débiles.", // NEEDS QC
	},
	netball: {
		name: "Malla Ball",
		shortDesc: "Una Poké Ball más eficaz con Pokémon de tipo Agua y Bicho.", // NEEDS QC
	},
	nevermeltice: {
		name: "Hielo Perpetuo",
		grammar: "mu",
		classified: {
			name: "trozo de Hielo Perpetuo",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Hielo del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Hielo del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	nomelberry: {
		name: "Baya Monli",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	normalgem: {
		name: "Gema Normal",
		shortDesc: "Su primer ataque de tipo Normal tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Normal tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	normaliumz: {
		name: "Normastal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Normal si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	occaberry: {
		name: "Baya Caoca",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Fuego. Un solo uso.", // NEEDS QC
	},
	oddincense: {
		name: "Incienso Raro",
		shortDesc: "Los ataques de tipo Psíquico del portador tienen 1,2 veces más potencia.", // NEEDS QC
	},
	oldamber: {
		name: "Ámbar Viejo",
		shortDesc: "Puede revivirse como Aerodactyl.", // NEEDS QC
	},
	oranberry: {
		name: "Baya Aranja",
		grammar: "fs",
		shortDesc: "Restaura 10 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	ovalstone: {
		name: "Piedra Oval",
		shortDesc: "Hace evolucionar a Happiny en Chansey al subir de nivel de día llevándola.", // NEEDS QC
	},
	pamtreberry: {
		name: "Baya Plama",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	parkball: {
		name: "Parque Ball",
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
		shortDesc: "Cura la envenenamiento del portador. Un solo uso.", // NEEDS QC
	},
	persimberry: {
		name: "Baya Caquic",
		grammar: "fs",
		shortDesc: "Cura la confusión del portador. Un solo uso.", // NEEDS QC
	},
	petayaberry: {
		name: "Baya Yapati",
		shortDesc: "Sube 1 nivel su Ataque Esp. con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	pidgeotite: {
		name: "Pidgeotita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Pidgeot, le permite megaevolucionar en combate.", // NEEDS QC
	},
	pikaniumz: {
		name: "Pikastal Z",
		shortDesc: "Si lo lleva un Pikachu con Placaje Eléctrico, puede usar Pikavoltio Letal.", // NEEDS QC
	},
	pikashuniumz: {
		name: "Ash-Pikastal Z",
		shortDesc: "Si lo lleva un Pikachu con gorra y Rayo, puede usar Gigarrayo Fulminante.", // NEEDS QC
	},
	pinapberry: {
		name: "Baya Pinia",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	pinsirite: {
		name: "Pinsirita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Pinsir, le permite megaevolucionar en combate.", // NEEDS QC
	},
	pixieplate: {
		name: "Tabla Duende",
		shortDesc: "Ataques de tipo Hada: 1,2 veces más potencia. Sentencia es de tipo Hada.", // NEEDS QC
	},
	plumefossil: {
		name: "Fósil Pluma",
		shortDesc: "Puede revivirse como Archen.", // NEEDS QC
	},
	poisonbarb: {
		name: "Flecha Venenosa",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Veneno del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Veneno del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	poisongem: {
		name: "Gema Veneno",
		shortDesc: "Su primer ataque de tipo Veneno tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Veneno tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	poisoniumz: {
		name: "Toxistal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Veneno si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	poisonmemory: {
		name: "Disco Veneno",
		shortDesc: "El Multiataque del portador es de tipo Veneno.", // NEEDS QC
	},
	pokeball: {
		name: "Poké Ball",
		shortDesc: "Un dispositivo con forma de cápsula para atrapar Pokémon salvajes.", // NEEDS QC
	},
	pomegberry: {
		name: "Baya Grana",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	poweranklet: {
		name: "Franja Recia",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerband: {
		name: "Banda Recia",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerbelt: {
		name: "Cinto Recio",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerbracer: {
		name: "Brazal Recio",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerherb: {
		name: "Hierba Única",
		shortDesc: "Sus movimientos de dos turnos se completan en uno (salvo Caída Libre). Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} ya está listo gracias a la Hierba Única!",
	},
	powerlens: {
		name: "Lente Recia",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	powerweight: {
		name: "Pesa Recia",
		shortDesc: "Reduce a la mitad la Velocidad del portador. Zoquete no lo ignora.", // NEEDS QC
	},
	premierball: {
		name: "Honor Ball",
		shortDesc: "Una Poké Ball algo rara creada para conmemorar un evento.", // NEEDS QC
	},
	prettyfeather: {
		name: "Pluma Bella",
		shortDesc: "Aunque es preciosa, es solo una pluma corriente sin efecto.", // NEEDS QC
	},
	primariumz: {
		name: "Primastal Z",
		shortDesc: "Si lo lleva un Primarina con Aria Burbuja, puede usar Sinfonía de la Diva Marina.", // NEEDS QC
	},
	prismscale: {
		name: "Escama Bella",
		shortDesc: "Hace evolucionar a Feebas en Milotic al intercambiarlo.", // NEEDS QC
	},
	protectivepads: {
		name: "Paracontacto",
		shortDesc: "Protege sus movimientos de los efectos adversos por contacto (salvo Hurto).", // NEEDS QC

		block: "  ¡{POKEMON} ha neutralizado el efecto gracias al Paracontacto!",
	},
	protector: {
		name: "Protector",
		shortDesc: "Hace evolucionar a Rhydon en Rhyperior al intercambiarlo.", // NEEDS QC
	},
	psychicgem: {
		name: "Gema Psíquica",
		shortDesc: "Su primer ataque de tipo Psíquico tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Psíquico tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	psychicmemory: {
		name: "Disco Psíquico",
		shortDesc: "El Multiataque del portador es de tipo Psíquico.", // NEEDS QC
	},
	psychicseed: {
		name: "Semilla Psique",
		shortDesc: "En campo psíquico, sube 1 nivel la Defensa Esp. del portador. Un solo uso.", // NEEDS QC
	},
	psychiumz: {
		name: "Psicostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Psíquico si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	punchingglove: {
		name: "Guante de Boxeo",
		shortDesc: "Sus movimientos de puño tienen 1,1 veces más potencia y no hacen contacto.", // NEEDS QC
	},
	pyroarite: {
		name: "Pyroarita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Pyroar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	qualotberry: {
		name: "Baya Ispero",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	quickball: {
		name: "Veloz Ball",
		shortDesc: "Una Poké Ball más eficaz al principio de un encuentro salvaje.", // NEEDS QC
	},
	quickclaw: {
		name: "Garra Rápida",
		grammar: "fs",
		shortDesc: "Cada turno, 20% de probabilidad de actuar primero dentro de su prioridad.", // NEEDS QC
		gen2: {
			shortDesc: "Cada turno, ~23,4% de probabilidad de actuar primero dentro de su prioridad.", // NEEDS QC
		},

		activate: "  ¡Gracias a la Garra Rápida, {POKEMON} puede tener prioridad!",
	},
	quickpowder: {
		name: "Polvo Veloz",
		shortDesc: "Si lo lleva un Ditto sin transformar, su Velocidad se duplica.", // NEEDS QC
	},
	rabutaberry: {
		name: "Baya Rautan",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	raichunitex: {
		name: "Raichunita X", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Raichu, le permite megaevolucionar en Mega Raichu X.", // NEEDS QC
	},
	raichunitey: {
		name: "Raichunita Y", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Raichu, le permite megaevolucionar en Mega Raichu Y.", // NEEDS QC
	},
	rarebone: {
		name: "Hueso Raro",
		shortDesc: "Sin uso competitivo salvo con Lanzamiento.", // NEEDS QC
	},
	rawstberry: {
		name: "Baya Safre",
		grammar: "fs",
		shortDesc: "Cura la quemadura del portador. Un solo uso.", // NEEDS QC
	},
	razorclaw: {
		name: "Garra Afilada",
		// Official flavor text: "Aumenta la probabilidad de que el Pokémon que la lleve consiga un golpe crítico."
		desc: "El índice de golpe crítico del portador sube 1 nivel. Si la lleva al subir de nivel por la noche, Sneasel evoluciona a Weavile.", // NEEDS QC
		shortDesc: "El índice de golpe crítico del portador sube 1 nivel.", // NEEDS QC
	},
	razorfang: {
		name: "Colmillo Agudo",
		// Official flavor text: "Si lo lleva un Pokémon, puede amedrentar al objetivo al infligirle daño."
		desc: "Los ataques del portador que no tengan efecto de retroceso obtienen un 10% de probabilidad de hacer retroceder al objetivo. Si lo lleva al subir de nivel por la noche, Gligar evoluciona a Gliscor.", // NEEDS QC
		shortDesc: "Sus ataques sin efecto de retroceso obtienen un 10% de hacer retroceder.", // NEEDS QC
	},
	razzberry: {
		name: "Baya Frambu",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	reapercloth: {
		name: "Tela Terrible",
		shortDesc: "Hace evolucionar a Dusclops en Dusknoir al intercambiarlo.", // NEEDS QC
	},
	redcard: {
		name: "Tarjeta Roja",
		shortDesc: "Si sobrevive a un golpe, el atacante se cambia por un aliado al azar. Un solo uso.", // NEEDS QC

		end: "  ¡{POKEMON} le ha sacado una Tarjeta Roja a {TARGET}!",
	},
	redorb: {
		name: "Prisma Rojo",
		shortDesc: "Si lo lleva un Groudon, activa su regresión primigenia en combate.", // NEEDS QC
	},
	repeatball: {
		name: "Acopio Ball",
		shortDesc: "Una Poké Ball más eficaz con especies ya atrapadas antes.", // NEEDS QC
	},
	ribbonsweet: {
		name: "Confite Lazo",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	rindoberry: {
		name: "Baya Tamar",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Planta. Un solo uso.", // NEEDS QC
	},
	ringtarget: {
		name: "Blanco",
		shortDesc: "Las inmunidades debidas solo a los tipos del portador se anulan.", // NEEDS QC
	},
	rockgem: {
		name: "Gema Roca",
		shortDesc: "Su primer ataque de tipo Roca tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Roca tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	rockincense: {
		name: "Incienso Roca",
		shortDesc: "Los ataques de tipo Roca del portador tienen 1,2 veces más potencia.", // NEEDS QC
	},
	rockiumz: {
		name: "Litostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Roca si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	rockmemory: {
		name: "Disco Roca",
		shortDesc: "El Multiataque del portador es de tipo Roca.", // NEEDS QC
	},
	rockyhelmet: {
		name: "Casco Dentado",
		shortDesc: "Si lo golpea un movimiento de contacto, el atacante pierde 1/6 de sus PS máximos.", // NEEDS QC

		damage: "  ¡El Casco Dentado ha dañado a {POKEMON}!",
	},
	roomservice: {
		name: "Servicio Raro",
		shortDesc: "Si hay Espacio Raro, baja 1 nivel su Velocidad. Un solo uso.", // NEEDS QC
	},
	rootfossil: {
		name: "Fósil Raíz",
		shortDesc: "Puede revivirse como Lileep.", // NEEDS QC
	},
	roseincense: {
		name: "Incienso Floral",
		shortDesc: "Los ataques de tipo Planta del portador tienen 1,2 veces más potencia.", // NEEDS QC
	},
	roseliberry: {
		name: "Baya Hibis",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Hada. Un solo uso.", // NEEDS QC
	},
	rowapberry: {
		name: "Baya Magua",
		shortDesc: "Si lo golpea un movimiento especial, el atacante pierde 1/8 de sus PS. 1 uso.", // NEEDS QC
	},
	rustedshield: {
		name: "Escudo Oxidado",
		shortDesc: "Si lo lleva un Zamazenta, cambia a su Forma Escudo Supremo.", // NEEDS QC
	},
	rustedsword: {
		name: "Espada Oxidada",
		shortDesc: "Si lo lleva un Zacian, cambia a su Forma Espada Suprema.", // NEEDS QC
	},
	sablenite: {
		name: "Sableynita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Sableye, le permite megaevolucionar en combate.", // NEEDS QC
	},
	sachet: {
		name: "Saquito Fragante",
		shortDesc: "Hace evolucionar a Spritzee en Aromatisse al intercambiarlo.", // NEEDS QC
	},
	safariball: {
		name: "Safari Ball",
		shortDesc: "Una Poké Ball especial para la Zona Safari y el Gran Pantano.", // NEEDS QC
	},
	safetygoggles: {
		name: "Gafa Protectora",
		shortDesc: "Inmune a movimientos de polvo y al daño de tormenta de arena y granizo.", // NEEDS QC

		block: "  ¡{MOVE} no ha afectado a {POKEMON} gracias a la Gafa Protectora!",
	},
	sailfossil: {
		name: "Fósil Aleta",
		shortDesc: "Puede revivirse como Amaura.", // NEEDS QC
	},
	salacberry: {
		name: "Baya Aslac",
		shortDesc: "Sube 1 nivel su Velocidad con 1/4 o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	salamencite: {
		name: "Salamencita", // NEEDS QC
		shortDesc: "Si lo lleva un Salamence, le permite megaevolucionar en combate.", // NEEDS QC
	},
	sceptilite: {
		name: "Sceptilita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Sceptile, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scizorite: {
		name: "Scizorita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Scizor, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scolipite: {
		name: "Scolipedita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Scolipede, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scopelens: {
		name: "Periscopio",
		grammar: "ms",
		shortDesc: "El índice de golpe crítico del portador sube 1 nivel.", // NEEDS QC
	},
	scovillainite: {
		name: "Scovillainita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Scovillain, le permite megaevolucionar en combate.", // NEEDS QC
	},
	scraftinite: {
		name: "Scraftita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Scrafty, le permite megaevolucionar en combate.", // NEEDS QC
	},
	seaincense: {
		name: "Incienso Marino",
		shortDesc: "Los ataques de tipo Agua del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Agua del portador tienen 1,05 veces más potencia.", // NEEDS QC
		},
	},
	sharpbeak: {
		name: "Pico Afilado",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Volador del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Volador del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	sharpedonite: {
		name: "Sharpedonita", // NEEDS QC
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
		// Official flavor text: "Una piedra peculiar que hace evolucionar a algunos Pokémon. Tiene un brillo espectacular."
		desc: "Al usarla, Togetic evoluciona a Togekiss; Roselia evoluciona a Roserade; Minccino evoluciona a Cinccino; Floette evoluciona a Florges.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	shockdrive: {
		name: "FulgoROM",
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
		shortDesc: "Los ataques de tipo Normal del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Normal del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	silverpowder: {
		name: "Polvo Plata",
		grammar: "mu",
		classified: {
			name: "puñado de Polvo Plata",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Bicho del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Bicho del portador tienen 1,1 veces más potencia.", // NEEDS QC
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
		name: "Skarmorita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Skarmory, le permite megaevolucionar en combate.", // NEEDS QC
	},
	skullfossil: {
		name: "Fósil Cráneo",
		shortDesc: "Puede revivirse como Cranidos.", // NEEDS QC
	},
	skyplate: {
		name: "Tabla Cielo",
		shortDesc: "Ataques de tipo Volador: 1,2 veces más potencia. Sentencia es de tipo Volador.", // NEEDS QC
	},
	slowbronite: {
		name: "Slowbronita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Slowbro, le permite megaevolucionar en combate.", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	smoothrock: {
		name: "Roca Suave",
		grammar: "fs",
		shortDesc: "Su Tormenta de Arena dura 8 turnos en lugar de 5.", // NEEDS QC
	},
	snorliumz: {
		name: "Snorlastal Z",
		shortDesc: "Si lo lleva un Snorlax con Gigaimpacto, puede usar Arrojo Intempestivo.", // NEEDS QC
	},
	snowball: {
		name: "Bola de Nieve",
		shortDesc: "Sube 1 nivel su Ataque si lo golpea un ataque de tipo Hielo. Un solo uso.", // NEEDS QC
	},
	softsand: {
		name: "Arena Fina",
		grammar: "fu",
		classified: {
			name: "saquito de Arena Fina",
			grammar: "ms",
		},
		shortDesc: "Los ataques de tipo Tierra del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Tierra del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	solganiumz: {
		name: "Solgaleostal Z",
		shortDesc: "Solgaleo o Necrozma Melena Crepuscular con Meteoimpacto: Movimiento Z especial.", // NEEDS QC
	},
	souldew: {
		name: "Rocío Bondad",
		shortDesc: "Si lo lleva Latias o Latios, sus movimientos de Dragón y Psíquico tienen 1,2 veces más potencia.", // NEEDS QC
		gen6: {
			shortDesc: "Si lo lleva Latias o Latios, su At. Esp. y Def. Esp. son x1,5.", // NEEDS QC
		},
	},
	spelltag: {
		name: "Hechizo",
		grammar: "ms",
		shortDesc: "Los ataques de tipo Fantasma del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Fantasma del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	spelonberry: {
		name: "Baya Wikano",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	splashplate: {
		name: "Tabla Linfa",
		shortDesc: "Ataques de tipo Agua: 1,2 veces más potencia. Sentencia es de tipo Agua.", // NEEDS QC
	},
	spookyplate: {
		name: "Tabla Terror",
		shortDesc: "Ataques de tipo Fantasma: 1,2 veces más potencia. Sentencia es de tipo Fantasma.", // NEEDS QC
	},
	sportball: {
		name: "Competi Ball",
		shortDesc: "Una Poké Ball especial para el Concurso de Captura de Bichos.", // NEEDS QC
	},
	staraptite: {
		name: "Staraptorita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Staraptor, le permite megaevolucionar en combate.", // NEEDS QC
	},
	starfberry: {
		name: "Baya Arabol",
		shortDesc: "Sube 2 niveles una característica al azar con 1/4 o menos de PS. 1 uso.", // NEEDS QC
	},
	starminite: {
		name: "Starmita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Starmie, le permite megaevolucionar en combate.", // NEEDS QC
	},
	starsweet: {
		name: "Confite Estrella",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	steelgem: {
		name: "Gema Acero",
		shortDesc: "Su primer ataque de tipo Acero tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Acero tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	steeliumz: {
		name: "Metalostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Acero si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	steelixite: {
		name: "Steelixita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Steelix, le permite megaevolucionar en combate.", // NEEDS QC
	},
	steelmemory: {
		name: "Disco Acero",
		shortDesc: "El Multiataque del portador es de tipo Acero.", // NEEDS QC
	},
	stick: {
		name: "Puerro",
		shortDesc: "Si lo lleva un Farfetch’d, su índice de crítico sube 2 niveles.", // NEEDS QC
		gen2: {
			shortDesc: "Si lo lleva un Farfetch’d, su índice de crítico siempre es de nivel 2. (25%)", // NEEDS QC
		},
	},
	stickybarb: {
		name: "Toxiestrella",
		shortDesc: "Pierde 1/8 de sus PS máximos cada turno. Puede pasar a un atacante que haga contacto.", // NEEDS QC
	},
	stoneplate: {
		name: "Tabla Pétrea",
		shortDesc: "Ataques de tipo Roca: 1,2 veces más potencia. Sentencia es de tipo Roca.", // NEEDS QC
	},
	strangeball: {
		name: "Extraña Ball",
		shortDesc: "Sustituto si se atrapó en una Ball que no existe en el juego actual.", // NEEDS QC
	},
	strawberrysweet: {
		name: "Confite Fresa",
		shortDesc: "Hace evolucionar a Milcery en Alcremie al girar llevándolo.", // NEEDS QC
	},
	sunstone: {
		name: "Piedra Solar",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es roja como el núcleo del sol."
		desc: "Al usarla, Gloom evoluciona a Bellossom; Sunkern evoluciona a Sunflora; Cottonee evoluciona a Whimsicott; Petilil evoluciona a Lilligant; Helioptile evoluciona a Heliolisk.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	swampertite: {
		name: "Swampertita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Swampert, le permite megaevolucionar en combate.", // NEEDS QC
	},
	sweetapple: {
		name: "Manzana Dulce",
		shortDesc: "Hace evolucionar a Applin en Appletun al usarse.", // NEEDS QC
	},
	syrupyapple: {
		name: "Manzana Melosa",
		shortDesc: "Hace evolucionar a Applin en Dipplin al usarse.", // NEEDS QC
	},
	tamatoberry: {
		name: "Baya Tamate",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	tangaberry: {
		name: "Baya Yecana",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Bicho. Un solo uso.", // NEEDS QC
	},
	tapuniumz: {
		name: "Tapistal Z",
		shortDesc: "Si lo lleva un Tapu con Furia Natural, puede usar Cólera del Guardián.", // NEEDS QC
	},
	tartapple: {
		name: "Manzana Ácida",
		shortDesc: "Hace evolucionar a Applin en Flapple al usarse.", // NEEDS QC
	},
	tatsugirinite: {
		name: "Tatsugirita", // NEEDS QC
		shortDesc: "Si lo lleva un Tatsugiri, le permite megaevolucionar en combate.", // NEEDS QC
	},
	terrainextender: {
		name: "Cubresuelos",
		shortDesc: "Sus campos eléctrico, de hierba, de niebla o psíquico duran 8 turnos en lugar de 5.", // NEEDS QC
	},
	thickclub: {
		name: "Hueso Grueso",
		shortDesc: "Si lo lleva un Cubone o un Marowak, su Ataque se duplica.", // NEEDS QC
	},
	throatspray: {
		name: "Espray Bucal",
		shortDesc: "Sube 1 nivel su Ataque Esp. tras usar un movimiento de sonido. Un solo uso.", // NEEDS QC
	},
	thunderstone: {
		name: "Piedra Trueno",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Tiene grabado un rayo."
		desc: "Al usarla, Pikachu evoluciona a Raichu o Raichu (Forma de Alola); Eevee evoluciona a Jolteon; Eelektrik evoluciona a Eelektross; Charjabug evoluciona a Vikavolt.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
		gen7: {
			desc: "Al usarla, Pikachu evoluciona a Raichu o Raichu (Forma de Alola); Eevee a Jolteon; y Eelektrik a Eelektross.", // NEEDS QC
		},
	},
	timerball: {
		name: "Turno Ball",
		shortDesc: "Una Poké Ball que mejora cuantos más turnos dure el combate.", // NEEDS QC
	},
	toxicorb: {
		name: "Toxisfera",
		shortDesc: "Al final de cada turno, intenta envenenar gravemente al portador.", // NEEDS QC
	},
	toxicplate: {
		name: "Tabla Tóxica",
		shortDesc: "Ataques de tipo Veneno: 1,2 veces más potencia. Sentencia es de tipo Veneno.", // NEEDS QC
	},
	tr00: {
		name: "DT00",
		shortDesc: "Enseña Danza Espada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr01: {
		name: "DT01",
		shortDesc: "Enseña Golpe Cuerpo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr02: {
		name: "DT02",
		shortDesc: "Enseña Lanzallamas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr03: {
		name: "DT03",
		shortDesc: "Enseña Hidrobomba a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr04: {
		name: "DT04",
		shortDesc: "Enseña Surf a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr05: {
		name: "DT05",
		shortDesc: "Enseña Rayo Hielo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr06: {
		name: "DT06",
		shortDesc: "Enseña Ventisca a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr07: {
		name: "DT07",
		shortDesc: "Enseña Patada Baja a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr08: {
		name: "DT08",
		shortDesc: "Enseña Rayo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr09: {
		name: "DT09",
		shortDesc: "Enseña Trueno a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr10: {
		name: "DT10",
		shortDesc: "Enseña Terremoto a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr11: {
		name: "DT11",
		shortDesc: "Enseña Psíquico a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr12: {
		name: "DT12",
		shortDesc: "Enseña Agilidad a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr13: {
		name: "DT13",
		shortDesc: "Enseña Foco Energía a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr14: {
		name: "DT14",
		shortDesc: "Enseña Metrónomo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr15: {
		name: "DT15",
		shortDesc: "Enseña Llamarada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr16: {
		name: "DT16",
		shortDesc: "Enseña Cascada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr17: {
		name: "DT17",
		shortDesc: "Enseña Amnesia a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr18: {
		name: "DT18",
		shortDesc: "Enseña Chupavidas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr19: {
		name: "DT19",
		shortDesc: "Enseña Triataque a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr20: {
		name: "DT20",
		shortDesc: "Enseña Sustituto a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr21: {
		name: "DT21",
		shortDesc: "Enseña Inversión a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr22: {
		name: "DT22",
		shortDesc: "Enseña Bomba Lodo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr23: {
		name: "DT23",
		shortDesc: "Enseña Púas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr24: {
		name: "DT24",
		shortDesc: "Enseña Enfado a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr25: {
		name: "DT25",
		shortDesc: "Enseña Psicocarga a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr26: {
		name: "DT26",
		shortDesc: "Enseña Aguante a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr27: {
		name: "DT27",
		shortDesc: "Enseña Sonámbulo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr28: {
		name: "DT28",
		shortDesc: "Enseña Megacuerno a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr29: {
		name: "DT29",
		shortDesc: "Enseña Relevo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr30: {
		name: "DT30",
		shortDesc: "Enseña Otra Vez a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr31: {
		name: "DT31",
		shortDesc: "Enseña Cola Férrea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr32: {
		name: "DT32",
		shortDesc: "Enseña Triturar a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr33: {
		name: "DT33",
		shortDesc: "Enseña Bola Sombra a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr34: {
		name: "DT34",
		shortDesc: "Enseña Premonición a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr35: {
		name: "DT35",
		shortDesc: "Enseña Alboroto a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr36: {
		name: "DT36",
		shortDesc: "Enseña Onda Ígnea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr37: {
		name: "DT37",
		shortDesc: "Enseña Mofa a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr38: {
		name: "DT38",
		shortDesc: "Enseña Truco a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr39: {
		name: "DT39",
		shortDesc: "Enseña Fuerza Bruta a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr40: {
		name: "DT40",
		shortDesc: "Enseña Intercambio a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr41: {
		name: "DT41",
		shortDesc: "Enseña Patada Ígnea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr42: {
		name: "DT42",
		shortDesc: "Enseña Vozarrón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr43: {
		name: "DT43",
		shortDesc: "Enseña Sofoco a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr44: {
		name: "DT44",
		shortDesc: "Enseña Masa Cósmica a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr45: {
		name: "DT45",
		shortDesc: "Enseña Agua Lodosa a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr46: {
		name: "DT46",
		shortDesc: "Enseña Defensa Férrea a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr47: {
		name: "DT47",
		shortDesc: "Enseña Garra Dragón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr48: {
		name: "DT48",
		shortDesc: "Enseña Corpulencia a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr49: {
		name: "DT49",
		shortDesc: "Enseña Paz Mental a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr50: {
		name: "DT50",
		shortDesc: "Enseña Hoja Aguda a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr51: {
		name: "DT51",
		shortDesc: "Enseña Danza Dragón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr52: {
		name: "DT52",
		shortDesc: "Enseña Giro Bola a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr53: {
		name: "DT53",
		shortDesc: "Enseña A Bocajarro a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr54: {
		name: "DT54",
		shortDesc: "Enseña Púas Tóxicas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr55: {
		name: "DT55",
		shortDesc: "Enseña Envite Ígneo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr56: {
		name: "DT56",
		shortDesc: "Enseña Esfera Aural a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr57: {
		name: "DT57",
		shortDesc: "Enseña Puya Nociva a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr58: {
		name: "DT58",
		shortDesc: "Enseña Pulso Umbrío a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr59: {
		name: "DT59",
		shortDesc: "Enseña Bomba Germen a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr60: {
		name: "DT60",
		shortDesc: "Enseña Tijera X a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr61: {
		name: "DT61",
		shortDesc: "Enseña Zumbido a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr62: {
		name: "DT62",
		shortDesc: "Enseña Pulso Dragón a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr63: {
		name: "DT63",
		shortDesc: "Enseña Joya de Luz a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr64: {
		name: "DT64",
		shortDesc: "Enseña Onda Certera a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr65: {
		name: "DT65",
		shortDesc: "Enseña Energibola a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr66: {
		name: "DT66",
		shortDesc: "Enseña Pájaro Osado a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr67: {
		name: "DT67",
		shortDesc: "Enseña Tierra Viva a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr68: {
		name: "DT68",
		shortDesc: "Enseña Maquinación a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr69: {
		name: "DT69",
		shortDesc: "Enseña Cabezazo Zen a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr70: {
		name: "DT70",
		shortDesc: "Enseña Cañón Resplandor a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr71: {
		name: "DT71",
		shortDesc: "Enseña Lluevehojas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr72: {
		name: "DT72",
		shortDesc: "Enseña Latigazo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr73: {
		name: "DT73",
		shortDesc: "Enseña Lanzamugre a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr74: {
		name: "DT74",
		shortDesc: "Enseña Cabeza de Hierro a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr75: {
		name: "DT75",
		shortDesc: "Enseña Roca Afilada a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr76: {
		name: "DT76",
		shortDesc: "Enseña Trampa Rocas a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr77: {
		name: "DT77",
		shortDesc: "Enseña Hierba Lazo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr78: {
		name: "DT78",
		shortDesc: "Enseña Onda Tóxica a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr79: {
		name: "DT79",
		shortDesc: "Enseña Cuerpo Pesado a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr80: {
		name: "DT80",
		shortDesc: "Enseña Bola Voltio a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr81: {
		name: "DT81",
		shortDesc: "Enseña Juego Sucio a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr82: {
		name: "DT82",
		shortDesc: "Enseña Poder Reserva a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr83: {
		name: "DT83",
		shortDesc: "Enseña Cambio de Banda a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr84: {
		name: "DT84",
		shortDesc: "Enseña Escaldar a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr85: {
		name: "DT85",
		shortDesc: "Enseña Avivar a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr86: {
		name: "DT86",
		shortDesc: "Enseña Voltio Cruel a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr87: {
		name: "DT87",
		shortDesc: "Enseña Taladradora a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr88: {
		name: "DT88",
		shortDesc: "Enseña Golpe Calor a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr89: {
		name: "DT89",
		shortDesc: "Enseña Vendaval a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr90: {
		name: "DT90",
		shortDesc: "Enseña Carantoña a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr91: {
		name: "DT91",
		shortDesc: "Enseña Trampa Venenosa a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr92: {
		name: "DT92",
		shortDesc: "Enseña Brillo Mágico a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr93: {
		name: "DT93",
		shortDesc: "Enseña Lariat Oscuro a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr94: {
		name: "DT94",
		shortDesc: "Enseña Fuerza Equina a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr95: {
		name: "DT95",
		shortDesc: "Enseña Golpe Mordaza a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr96: {
		name: "DT96",
		shortDesc: "Enseña Bola de Polen a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr97: {
		name: "DT97",
		shortDesc: "Enseña Psicocolmillo a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr98: {
		name: "DT98",
		shortDesc: "Enseña Hidroariete a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	tr99: {
		name: "DT99",
		shortDesc: "Enseña Plancha Corporal a ciertos Pokémon. Un solo uso.", // NEEDS QC
	},
	twistedspoon: {
		name: "Cuchara Torcida",
		grammar: "fs",
		shortDesc: "Los ataques de tipo Psíquico del portador tienen 1,2 veces más potencia.", // NEEDS QC
		gen3: {
			shortDesc: "Los ataques de tipo Psíquico del portador tienen 1,1 veces más potencia.", // NEEDS QC
		},
	},
	tyranitarite: {
		name: "Tyranitarita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Tyranitar, le permite megaevolucionar en combate.", // NEEDS QC
	},
	ultraball: {
		name: "Ultra Ball",
		shortDesc: "Una Ball de rendimiento superior con mejor tasa que la Super Ball.", // NEEDS QC
	},
	ultranecroziumz: {
		name: "Ultranecrostal Z",
		shortDesc: "Necrozma con melena o alas: Ultraexplosión y luego Movimiento Z con Géiser Fotónico.", // NEEDS QC

		transform: "  ¡{POKEMON} emite una luz cegadora!",
		activate: "¡{POKEMON} ha adoptado una nueva forma gracias a la Ultraexplosión!",
	},
	unremarkableteacup: {
		name: "Cuenco Mediocre",
		shortDesc: "Hace evolucionar a Poltchageist en Sinistcha al usarse.", // NEEDS QC
	},
	upgrade: {
		name: "Mejora",
		shortDesc: "Hace evolucionar a Porygon en Porygon2 al intercambiarlo.", // NEEDS QC
	},
	utilityumbrella: {
		name: "Parasol Multiuso",
		// Official flavor text: "El portador se vuelve invulnerable a los efectos de la lluvia y del sol."
		desc: "El portador ignora los efectos de la lluvia y del sol (incluidos los de su propia habilidad, salvo Latido Oricalco y Paleosíntesis). El cálculo de daño y la precisión de los ataques que usa el portador sí se ven afectados por la lluvia y el sol, pero no los ataques que recibe.", // NEEDS QC
		shortDesc: "El portador ignora los efectos de la lluvia y del sol.", // NEEDS QC
		gen8: {
			desc: "El portador ignora los efectos de la lluvia y el sol, incluidos los de su habilidad. Los cálculos de daño y precisión de los ataques del portador sí se ven afectados por la lluvia y el sol, pero no los ataques usados contra él.", // NEEDS QC
		},
	},
	venusaurite: {
		name: "Venusaurita", // NEEDS QC
		grammar: "fs",
		shortDesc: "Si lo lleva un Venusaur, le permite megaevolucionar en combate.", // NEEDS QC
	},
	victreebelite: {
		name: "Victreebelita", // NEEDS QC
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
		shortDesc: "Su primer ataque de tipo Agua tendrá 1,3 veces más potencia. Un solo uso.", // NEEDS QC
		gen5: {
			shortDesc: "Su primer ataque de tipo Agua tendrá 1,5 veces más potencia. Un solo uso.", // NEEDS QC
		},
	},
	wateriumz: {
		name: "Hidrostal Z",
		shortDesc: "Permite usar un Movimiento Z de tipo Agua si conoce un movimiento de ese tipo.", // NEEDS QC
	},
	watermemory: {
		name: "Disco Agua",
		shortDesc: "El Multiataque del portador es de tipo Agua.", // NEEDS QC
	},
	waterstone: {
		name: "Piedra Agua",
		// Official flavor text: "Curiosa piedra que hace evolucionar a determinadas especies de Pokémon. Es de color azul."
		desc: "Al usarla, Poliwhirl evoluciona a Poliwrath; Shellder evoluciona a Cloyster; Staryu evoluciona a Starmie; Eevee evoluciona a Vaporeon; Lombre evoluciona a Ludicolo; Panpour evoluciona a Simipour.", // NEEDS QC
		shortDesc: "Hace evolucionar a ciertas especies de Pokémon al usarse.", // NEEDS QC
	},
	watmelberry: {
		name: "Baya Sambia",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	waveincense: {
		name: "Incienso Acua",
		shortDesc: "Los ataques de tipo Agua del portador tienen 1,2 veces más potencia.", // NEEDS QC
	},
	weaknesspolicy: {
		name: "Seguro Debilidad",
		shortDesc: "Si recibe un golpe supereficaz, su Ataque y Ataque Esp. suben 2 niveles. Un solo uso.", // NEEDS QC
	},
	wellspringmask: {
		name: "Máscara Fuente",
		shortDesc: "Ogerpon Fuente: ataques 1,2 veces más potentes; Evocarrecuerdos al teracristalizar.", // NEEDS QC
	},
	wepearberry: {
		name: "Baya Peragu",
		shortDesc: "El portador no puede comerla. Sin efecto con Picadura o Picoteo.", // NEEDS QC
	},
	whippeddream: {
		name: "Dulce de Nata",
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
		shortDesc: "Sus ataques especiales tienen 1,1 veces más potencia.", // NEEDS QC
	},
	yacheberry: {
		name: "Baya Rimoya",
		grammar: "fs",
		shortDesc: "Reduce a la mitad el daño de un ataque supereficaz de tipo Hielo. Un solo uso.", // NEEDS QC
	},
	zapplate: {
		name: "Tabla Trueno",
		shortDesc: "Ataques de tipo Eléctrico: 1,2 veces más potencia. Sentencia es de tipo Eléctrico.", // NEEDS QC
	},
	zeraorite: {
		name: "Zeraoranita", // NEEDS QC
		shortDesc: "Si lo lleva un Zeraora, le permite megaevolucionar en combate.", // NEEDS QC
	},
	zoomlens: {
		name: "Telescopio",
		grammar: "ms",
		shortDesc: "Si actúa después del objetivo, la precisión de sus ataques se multiplica por 1,2.", // NEEDS QC
	},
	zygardite: {
		name: "Zygardita", // NEEDS QC
		shortDesc: "Si lo lleva un Zygarde (Forma Completa), le permite megaevolucionar en combate.", // NEEDS QC
	},

	// Gen 2 items

	berserkgene: {
		name: "Gen Loco", // NEEDS QC
		shortDesc: "(2.ª gen.) Al entrar, sube 2 niveles su Ataque y lo confunde. Un solo uso.", // NEEDS QC
	},
	berry: {
		name: "Baya", // NEEDS QC
		shortDesc: "(2.ª gen.) Restaura 10 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	bitterberry: {
		name: "Baya Amarga", // NEEDS QC
		shortDesc: "(2.ª gen.) Cura la confusión del portador. Un solo uso.", // NEEDS QC
	},
	burntberry: {
		name: "Baya Antiquemadura", // NEEDS QC
		shortDesc: "(2.ª gen.) Cura la congelación del portador. Un solo uso.", // NEEDS QC
	},
	goldberry: {
		name: "Baya Dorada", // NEEDS QC
		shortDesc: "(2.ª gen.) Restaura 30 PS con la mitad o menos de sus PS máximos. Un solo uso.", // NEEDS QC
	},
	iceberry: {
		name: "Baya Hielo", // NEEDS QC
		shortDesc: "(2.ª gen.) Cura la quemadura del portador. Un solo uso.", // NEEDS QC
	},
	mintberry: {
		name: "Baya Menta", // NEEDS QC
		shortDesc: "(2.ª gen.) Despierta al portador si está dormido. Un solo uso.", // NEEDS QC
	},
	miracleberry: {
		name: "Baya Milagro", // NEEDS QC
		shortDesc: "(2.ª gen.) Cura los problemas de estado y la confusión. Un solo uso.", // NEEDS QC
	},
	mysteryberry: {
		name: "Baya Misterio", // NEEDS QC
		shortDesc: "(2.ª gen.) Restaura 5 PP al primer movimiento que llegue a 0 PP. Un solo uso.", // NEEDS QC

		activate: "  ¡{POKEMON} ha restaurado los PP de {MOVE} con la Baya Misterio!",
	},
	pinkbow: {
		name: "Lazo Rosa", // NEEDS QC
		shortDesc: "(2.ª gen.) Sus ataques de tipo Normal tienen 1,1 veces más potencia.", // NEEDS QC
	},
	polkadotbow: {
		name: "Cinta Lunares", // NEEDS QC
		shortDesc: "(2.ª gen.) Sus ataques de tipo Normal tienen 1,1 veces más potencia.", // NEEDS QC
	},
	przcureberry: {
		name: "Baya Antiparálisis", // NEEDS QC
		shortDesc: "(2.ª gen.) Cura la parálisis del portador. Un solo uso.", // NEEDS QC
	},
	psncureberry: {
		name: "Baya Antídoto", // NEEDS QC
		shortDesc: "(2.ª gen.) Cura la envenenamiento del portador. Un solo uso.", // NEEDS QC
	},

	// CAP items

	crucibellite: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "Si lo lleva un Crucibelle, le permite megaevolucionar en combate.", // NEEDS QC
	},
	vilevial: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "Si lo lleva Venomicon, sus ataques de Veneno y Volador tienen 1,2x más potencia.", // NEEDS QC
	},
};
