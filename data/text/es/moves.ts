// Mechanics desc style (es): official game terminology. el usuario (user), el objetivo
//   (target), efecto secundario, hacer retroceder (flinch), golpe crítico, niveles (stages),
//   problema de estado (status), movimiento multigolpe, prioridad, sustituto, redondeado
//   hacia abajo/arriba. Decimal comma (1,5). Boilerplate shared verbatim — QC one, fix all.
// Cross-references generated from name fields / pokedex-names.ts. CAP entities keep name
//   null (English fallback); descs are translated with English names inline.

export const MovesText: { [id: IDEntry]: MoveText } = {
	"10000000voltthunderbolt": {
		name: "Gigarrayo Fulminante",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Probabilidad muy alta de golpe crítico (índice +2).", // NEEDS QC
		shortDesc: "Probabilidad muy alta de golpe crítico.", // NEEDS QC
	},
	absorb: {
		name: "Absorber",
		// Official flavor text: "Un ataque que absorbe nutrientes. Quien lo usa recupera la mitad de los PS del daño que produce."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si el usuario lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja). Si el usuario lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja).", // NEEDS QC
		},
		gen3: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja).", // NEEDS QC
		},
		gen2: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja). Si el objetivo tiene un sustituto, este movimiento falla.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja). Si este movimiento rompe el sustituto del objetivo, el usuario no recupera PS.", // NEEDS QC
		},
	},
	accelerock: {
		name: "Roca Veloz",
		// Official flavor text: "El usuario se lanza contra el objetivo a gran velocidad. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	acid: {
		name: "Ácido",
		// Official flavor text: "Rocía a los enemigos con un ácido corrosivo. Puede bajar la Defensa Especial."
		desc: "10% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel la Def. Esp. del objetivo.", // NEEDS QC
		gen3: {
			desc: "10% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
			shortDesc: "10% de bajar 1 nivel la Def. de los rivales.", // NEEDS QC
		},
		gen1: {
			desc: "33% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
			shortDesc: "33% de bajar 1 nivel la Def. del objetivo.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10% de bajar 1 nivel la Def. del objetivo.", // NEEDS QC
		},
	},
	acidarmor: {
		name: "Armadura Ácida",
		// Official flavor text: "Transforma la estructura celular para hacerse líquido y aumenta mucho la Defensa."
		desc: "Sube 2 niveles la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Defensa del usuario.", // NEEDS QC
	},
	aciddownpour: {
		name: "Diluvio Corrosivo",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	acidspray: {
		name: "Bomba Ácida",
		// Official flavor text: "Ataca con un líquido corrosivo que reduce mucho la Defensa Especial del objetivo."
		desc: "100% de probabilidad de bajar 2 niveles la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 2 niveles Def. Esp. del objetivo.", // NEEDS QC
	},
	acrobatics: {
		name: "Acróbata",
		shortDesc: "Potencia doble si el usuario no lleva objeto.", // NEEDS QC
	},
	acupressure: {
		name: "Acupresión",
		// Official flavor text: "Aplica presión en puntos clave del cuerpo para potenciar mucho una de sus características."
		desc: "Sube 2 niveles una característica al azar que no esté ya en +6. Puede usarse sobre el propio usuario o un aliado adyacente. Falla si no hay característica que subir o si se usa sobre un aliado con sustituto.", // NEEDS QC
		shortDesc: "Sube 2 niveles una característica al azar suya o aliada.", // NEEDS QC
		gen4: {
			desc: "Sube 2 niveles una característica al azar que no esté ya en +6. Puede usarse sobre el propio usuario o un aliado. Falla si no hay característica que subir o si el usuario o el aliado tienen un sustituto.", // NEEDS QC
		},
	},
	aerialace: {
		name: "Golpe Aéreo",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	aeroblast: {
		name: "Aerochorro",
		// Official flavor text: "Lanza un chorro de aire que suele asestar un golpe crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	afteryou: {
		name: "Cede Paso",
		// Official flavor text: "Si el usuario es el más rápido, permite al objetivo usar un movimiento justo tras él, adelantándose a Pokémon más rápidos."
		desc: "El objetivo actúa justo después del usuario este turno, sin importar la prioridad de su movimiento. Falla si el objetivo ya iba a actuar a continuación o si ya actuó este turno.", // NEEDS QC
		shortDesc: "El objetivo actúa justo después del usuario.", // NEEDS QC

		activate: "  ¡{TARGET} ha decidido aprovechar la oportunidad!",
	},
	agility: {
		name: "Agilidad",
		// Official flavor text: "Relaja el cuerpo para ganar mucha Velocidad."
		desc: "Sube 2 niveles la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Velocidad del usuario.", // NEEDS QC
	},
	aircutter: {
		name: "Aire Afilado",
		// Official flavor text: "Viento cortante que azota. Suele ser un golpe crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta prob. de crítico. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	airslash: {
		name: "Tajo Aéreo",
		// Official flavor text: "Ataca con un viento afilado que incluso corta el aire. También puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	alloutpummeling: {
		name: "Ráfaga Demoledora",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	alluringvoice: {
		name: "Canto Encantador",
		desc: "100% de probabilidad de confundir al objetivo si sus características subieron este turno.", // NEEDS QC
		shortDesc: "100% de confundir si el objetivo subió características.", // NEEDS QC
	},
	allyswitch: {
		name: "Cambio de Banda",
		// Official flavor text: "Extraño poder que intercambia la posición del usuario con la de un aliado sobre el terreno de combate."
		desc: "El usuario intercambia su posición con la de un aliado. Falla si es el único Pokémon de su bando. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla o si el último movimiento usado no fue Cambio de Banda.", // NEEDS QC
		shortDesc: "Se intercambia con su aliado; repetirlo puede fallar.", // NEEDS QC
		gen8: {
			desc: "El usuario intercambia su posición con la de un aliado. Falla si es el único Pokémon de su bando.", // NEEDS QC
			shortDesc: "El usuario intercambia su posición con su aliado.", // NEEDS QC
		},
		gen6: {
			desc: "El usuario intercambia su posición con la del aliado del extremo opuesto del campo. Falla si no hay Pokémon en esa posición, si es el único Pokémon de su bando o si está en el centro.", // NEEDS QC
			shortDesc: "Intercambia posición con el aliado del otro lado.", // NEEDS QC
		},
	},
	amnesia: {
		name: "Amnesia",
		// Official flavor text: "El usuario olvida sus preocupaciones y aumenta mucho la Defensa Especial."
		desc: "Sube 2 niveles la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Def. Esp. del usuario.", // NEEDS QC
		gen1: {
			desc: "Sube 2 niveles el Especial del usuario.", // NEEDS QC
			shortDesc: "Sube 2 niveles el Especial del usuario.", // NEEDS QC
		},
	},
	anchorshot: {
		name: "Anclaje",
		// Official flavor text: "Ataca lanzando un ancla al oponente, que queda atrapado y no puede huir."
		desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Impide que el objetivo se cambie.", // NEEDS QC
		gen7: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
	},
	ancientpower: {
		name: "Poder Pasado",
		// Official flavor text: "Ataque prehistórico que puede subir todas las características."
		desc: "10% de probabilidad de subir 1 nivel el Ataque, la Defensa, el Ataque Especial, la Defensa Especial y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "10% de subir 1 nivel todas sus características.", // NEEDS QC
	},
	appleacid: {
		name: "Ácido Málico",
		// Official flavor text: "Ataca al objetivo con el fluido corrosivo que desprende una manzana ácida, lo que también disminuye la Defensa Especial de este."
		desc: "100% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	aquacutter: {
		name: "Tajo Acuático",
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	aquajet: {
		name: "Acua Jet",
		// Official flavor text: "Ataque de una rapidez espeluznante. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	aquaring: {
		name: "Acua Aro",
		// Official flavor text: "Un manto de agua cubre al Pokémon que lo usa. Recupera algunos PS en cada turno."
		desc: "Mientras el usuario siga en combate, recupera 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Si el usuario lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5). Si usa Relevo, el sustituto recibe el efecto curativo.", // NEEDS QC
		shortDesc: "Recupera 1/16 de sus PS máximos cada turno.", // NEEDS QC

		start: "  ¡{POKEMON} se ha rodeado de un manto de agua!",
		heal: "  ¡{POKEMON} ha recuperado algunos PS gracias al manto de agua que rodea su cuerpo!",
	},
	aquastep: {
		name: "Danza Acuática",
		desc: "100% de probabilidad de subir 1 nivel la Velocidad del usuario.", // NEEDS QC
		shortDesc: "100% de subir 1 nivel Velocidad del usuario.", // NEEDS QC
	},
	aquatail: {
		name: "Acua Cola",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	armorcannon: {
		name: "Cañón Armadura",
		desc: "Baja 1 nivel la Defensa y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Defensa y Def. Esp. del usuario.", // NEEDS QC
	},
	armthrust: {
		name: "Empujón",
		// Official flavor text: "Fuertes empujones que golpean de dos a cinco veces seguidas."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
	},
	aromatherapy: {
		name: "Aromaterapia",
		// Official flavor text: "Cura todos los problemas de estado del equipo con un suave aroma."
		desc: "Cura los problemas de estado de todo el equipo del usuario. Los Pokémon en combate con la habilidad Herbívoro no se curan, salvo el propio usuario.", // NEEDS QC
		shortDesc: "Cura los estados de todo el equipo del usuario.", // NEEDS QC
		gen5: {
			desc: "Cura los problemas de estado de todo el equipo del usuario.", // NEEDS QC
		},

		activate: "  Un aroma balsámico flota en el aire.",
	},
	aromaticmist: {
		name: "Niebla Aromática",
		// Official flavor text: "Consigue aumentar la Defensa Especial de un Pokémon de su equipo con una fragancia misteriosa."
		desc: "Sube 1 nivel la Defensa Especial de un aliado. Falla si el usuario no tiene un aliado adyacente.", // NEEDS QC
		shortDesc: "Sube 1 nivel la Def. Esp. de un aliado.", // NEEDS QC
	},
	assist: {
		name: "Ayuda",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Usa al azar un movimiento conocido por los compañeros de equipo del usuario. No puede seleccionar Ayuda, Búnker, Pico Cañón, Eructo, Ofrenda, Pirochoque, Bote, Celebración, Cháchara, Llave Giro, Pugnachoque, Copión, Contraataque, Antojo, Mismo Destino, Detección, Excavar, Buceo, Cola Dragón, Aguante, Amago, Vuelo, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Feerichoque, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Ponzochoque, Golpe Fantasma, Protección, Polvo Ira, Rugido, Golpe Umbrío, Coraza Trampa, Esquema, Caída Libre, Sonámbulo, Robo, Barrera Espinosa, Foco, Forcejeo, Trapicheo, Teraclúster, Ladrón, Transformación, Truco, Remolino, Ominochoque.", // NEEDS QC
		shortDesc: "Usa un movimiento al azar de sus compañeros.", // NEEDS QC
		gen8: {
			desc: "Usa al azar un movimiento conocido por los compañeros de equipo del usuario. No puede seleccionar Ayuda, Búnker, Pico Cañón, Eructo, Ofrenda, Bote, Celebración, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Excavar, Buceo, Cola Dragón, Aguante, Amago, Vuelo, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Golpe Fantasma, Protección, Polvo Ira, Rugido, Golpe Umbrío, Coraza Trampa, Esquema, Caída Libre, Sonámbulo, Robo, Barrera Espinosa, Foco, Forcejeo, Trapicheo, Ladrón, Transformación, Truco, Remolino.", // NEEDS QC
		},
		gen7: {
			desc: "Usa al azar un movimiento conocido por los compañeros de equipo del usuario. No puede seleccionar Ayuda, Búnker, Pico Cañón, Eructo, Ofrenda, Bote, Celebración, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Excavar, Buceo, Cola Dragón, Aguante, Amago, Vuelo, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Golpe Fantasma, Protección, Polvo Ira, Rugido, Golpe Umbrío, Coraza Trampa, Esquema, Caída Libre, Sonámbulo, Robo, Barrera Espinosa, Foco, Forcejeo, Trapicheo, Ladrón, Transformación, Truco, Remolino, ni ningún movimiento Z.", // NEEDS QC
		},
		gen6: {
			desc: "Usa al azar un movimiento conocido por los compañeros de equipo del usuario. No puede seleccionar Ayuda, Eructo, Ofrenda, Bote, Celebración, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Excavar, Buceo, Cola Dragón, Aguante, Amago, Vuelo, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Golpe Fantasma, Protección, Polvo Ira, Rugido, Golpe Umbrío, Esquema, Caída Libre, Sonámbulo, Robo, Barrera Espinosa, Forcejeo, Trapicheo, Ladrón, Transformación, Truco, Remolino.", // NEEDS QC
		},
		gen5: {
			desc: "Usa al azar un movimiento conocido por los compañeros de equipo del usuario. No puede seleccionar Ayuda, Ofrenda, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Cola Dragón, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Protección, Polvo Ira, Esquema, Sonámbulo, Robo, Forcejeo, Trapicheo, Ladrón, Transformación, Truco.", // NEEDS QC
		},
		gen4: {
			desc: "Usa al azar un movimiento conocido por los compañeros de equipo del usuario. No puede seleccionar Ayuda, Cháchara, Copión, Contraataque, Antojo, Mismo Destino, Detección, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Protección, Esquema, Sonámbulo, Robo, Forcejeo, Trapicheo, Ladrón, Truco.", // NEEDS QC
		},
		gen3: {
			desc: "Usa al azar un movimiento conocido por los compañeros de equipo del usuario. No puede seleccionar Ayuda, Contraataque, Antojo, Mismo Destino, Detección, Aguante, Puño Certero, Señuelo, Refuerzo, Metrónomo, Mimético, Manto Espejo, Espejo, Protección, Esquema, Sonámbulo, Robo, Forcejeo, Ladrón, Truco.", // NEEDS QC
		},
	},
	assurance: {
		name: "Buena Baza",
		// Official flavor text: "Si el objetivo ya ha sufrido daño en ese turno, la fuerza del ataque se duplica."
		desc: "La potencia se duplica si el objetivo ya recibió daño este turno, sin contar el daño directo de Tambor, la confusión, Maldición o Divide Dolor.", // NEEDS QC
		shortDesc: "Potencia doble si el objetivo ya fue dañado este turno.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica si el objetivo ya recibió daño este turno.", // NEEDS QC
		},
	},
	astonish: {
		name: "Impresionar",
		// Official flavor text: "Lanza un grito tan tremendo que impresiona y puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		gen3: {
			desc: "30% de probabilidad de amedrentar al objetivo. El daño se duplica si el objetivo usó Reducción desde que está en combate.", // NEEDS QC
		},
	},
	astralbarrage: {
		name: "Orbes Espectro",
		// Official flavor text: "El usuario ataca al objetivo lanzándole una ingente cantidad de pequeños fantasmas."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	attackorder: {
		name: "Al Ataque",
		// Official flavor text: "El usuario llama a sus súbditos para que ataquen al objetivo. Suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	attract: {
		name: "Atracción",
		// Official flavor text: "Si el objetivo es del sexo opuesto, se enamorará y bajará la posibilidad de que ataque."
		desc: "Enamora al objetivo, que no podrá atacar el 50% de las veces. Falla si usuario y objetivo son del mismo sexo, si alguno no tiene sexo o si el objetivo ya está enamorado. El efecto termina cuando alguno deja el combate. Los Pokémon con la habilidad Despiste o protegidos por Velo Aroma son inmunes.", // NEEDS QC
		shortDesc: "Enamora a un objetivo del sexo opuesto.", // NEEDS QC
		gen5: {
			desc: "Enamora al objetivo, que no podrá atacar el 50% de las veces. Falla si usuario y objetivo son del mismo sexo, si alguno no tiene sexo o si el objetivo ya está enamorado. El efecto termina cuando alguno deja el combate. Los Pokémon con la habilidad Despiste son inmunes.", // NEEDS QC
		},
		gen2: {
			desc: "Enamora al objetivo, que no podrá atacar el 50% de las veces. Falla si usuario y objetivo son del mismo sexo, si alguno no tiene sexo o si el objetivo ya está enamorado. El efecto termina cuando alguno deja el combate.", // NEEDS QC
		},

		start: "  ¡{POKEMON} se ha enamorado!",
		startFromItem: "  ¡{POKEMON} se ha enamorado debido {ITEM:a:definite}!",
		end: "  ¡{POKEMON} ya no está enamorado!",
		endFromItem: "  ¡{POKEMON} ya no está enamorado gracias {ITEM:a:definite:classified}!",
		activate: "  ¡{POKEMON} está enamorado de {TARGET}!",
		cant: "¡El enamoramiento impide que {POKEMON} reaccione!",
	},
	aurasphere: {
		name: "Esfera Aural",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	aurawheel: {
		name: "Rueda Aural",
		// Official flavor text: "La energía que acumula en las mejillas le sirve para atacar y aumentar su Velocidad. Este movimiento cambia de tipo según la forma que adopte Morpeko."
		desc: "Sube 1 nivel la Velocidad del usuario (100%). Si el usuario es un Morpeko en Forma Saciada es de tipo Eléctrico y en Forma Voraz, de tipo Siniestro. Solo puede usarse si su forma actual (contando Transformación) es Morpeko Saciada o Voraz.", // NEEDS QC
		shortDesc: "Morpeko: Eléctrico; Voraz: Siniestro. 100% +1 Vel.", // NEEDS QC
	},
	aurorabeam: {
		name: "Rayo Aurora",
		// Official flavor text: "Rayo multicolor que puede reducir el Ataque."
		desc: "10% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Ataque del objetivo.", // NEEDS QC
		gen1: {
			desc: "33% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
			shortDesc: "33% de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		},
	},
	auroraveil: {
		name: "Velo Aurora",
		// Official flavor text: "Reduce el daño de los ataques físicos y especiales que ejecuta el rival durante cinco turnos. Solo puede usarse cuando está granizando."
		desc: "Durante 5 turnos, el usuario y sus aliados reciben 0,5 veces el daño de ataques físicos y especiales (0,66 en combates dobles); no se acumula con Reflejo ni Pantalla de Luz. Los golpes críticos ignoran esta protección. Desaparece del bando del usuario si él o un aliado reciben Demolición, Psicocolmillo, Despejar; los dos primeros la eliminan antes de calcular el daño. Dura 8 turnos con Refleluz. Falla si no nieva.", // NEEDS QC
		shortDesc: "5 turnos: daño a aliados a la mitad. Solo con nieve.", // NEEDS QC
		gen8: {
			desc: "Durante 5 turnos, el usuario y sus aliados reciben 0,5 veces el daño de ataques físicos y especiales (0,66 en combates dobles); no se acumula con Reflejo ni Pantalla de Luz. Los golpes críticos ignoran esta protección. Desaparece del bando del usuario si él o un aliado reciben Demolición, Psicocolmillo, Despejar; los dos primeros la eliminan antes de calcular el daño. Dura 8 turnos con Refleluz. Falla si no graniza.", // NEEDS QC
			shortDesc: "5 turnos: mitad de daño al equipo. Solo granizo.", // NEEDS QC
		},

		start: "  ¡Velo Aurora ha aumentado la resistencia de {TEAM} ante los ataques físicos y especiales!",
		end: "  El efecto de Velo Aurora en {TEAM} se ha disipado.",
	},
	autotomize: {
		name: "Aligerar",
		// Official flavor text: "El usuario se desprende de partes prescindibles de su cuerpo para hacerse más ligero y aumentar mucho su Velocidad."
		desc: "Sube 2 niveles la Velocidad del usuario. Si su Velocidad cambió, su peso se reduce en 100 kg mientras siga en combate. El efecto es acumulable, pero el peso no baja de 0,1 kg.", // NEEDS QC
		shortDesc: "Sube 2 niveles su Velocidad; pierde 100 kg.", // NEEDS QC

		start: "  ¡{POKEMON} es ahora más ligero!",
	},
	avalanche: {
		name: "Alud",
		// Official flavor text: "Este ataque inflige el doble de daño a un objetivo que haya golpeado al usuario en ese mismo turno."
		desc: "La potencia se duplica si el usuario fue golpeado por el objetivo este turno.", // NEEDS QC
		shortDesc: "Potencia doble si el objetivo lo dañó este turno.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica si el usuario fue golpeado por un Pokémon en la posición del objetivo este turno.", // NEEDS QC
		},
	},
	axekick: {
		name: "Patada Hacha",
		desc: "30% de probabilidad de confundir al objetivo. Si el ataque falla, el usuario pierde la mitad de sus PS máximos (redondeado hacia abajo) por el impacto. Los Pokémon con la habilidad Muro Mágico no sufren este daño.", // NEEDS QC
		shortDesc: "30% de confusión. Pierde la mitad de PS si falla.", // NEEDS QC

		damage: "#crash",
	},
	babydolleyes: {
		name: "Ojitos Tiernos",
		// Official flavor text: "Lanza una mirada al objetivo con ojos acaramelados, con lo que logra que su Ataque se reduzca. Este movimiento tiene prioridad alta."
		desc: "Baja 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	baddybad: {
		name: "Umbreozona",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Al usarse, genera el efecto de Reflejo durante 5 turnos en el bando del usuario.", // NEEDS QC
		shortDesc: "Crea el efecto de Reflejo.", // NEEDS QC
	},
	banefulbunker: {
		name: "Búnker",
		// Official flavor text: "Protege de los ataques y, al mismo tiempo, envenena al Pokémon que use un movimiento de contacto contra el usuario."
		desc: "Protege al usuario de la mayoría de los movimientos este turno y envenena a los Pokémon que hagan contacto con él. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege de movimientos. Contacto: envenena.", // NEEDS QC
		gen8: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno y envenena a los Pokémon que hagan contacto con él. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen7: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno y envenena a los Pokémon que hagan contacto con él. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
	},
	barbbarrage: {
		name: "Mil Púas Tóxicas",
		desc: "50% de probabilidad de envenenar al objetivo. La potencia se duplica si el objetivo ya está envenenado.", // NEEDS QC
		shortDesc: "50% de envenenar. Doble contra envenenados.", // NEEDS QC
	},
	barrage: {
		name: "Bombardeo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. El daño se calcula una sola vez para el primer golpe y se repite en cada golpe. Si un golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	barrier: {
		name: "Barrera",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Sube 2 niveles la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Defensa del usuario.", // NEEDS QC
	},
	batonpass: {
		name: "Relevo",
		// Official flavor text: "Cambia el puesto con otro miembro del equipo y le pasa los cambios de características."
		desc: "El usuario se cambia por otro Pokémon de su equipo, que hereda sus cambios de características, además de la confusión y los efectos de Acua Aro, Maldición, Bramido Dragón, Embargo, Foco Energía, Bilis, Anticura, Arraigo, Drenadoras, Fijar Blanco, Telépata, Levitón, Canto Mortal, Truco Fuerza, Telequinesis, así como un sustituto con sus PS restantes. El efecto de Bilis no se hereda si el receptor tiene una habilidad que no puede anularse.", // NEEDS QC
		shortDesc: "Se cambia y transfiere sus cambios de características.", // NEEDS QC
		gen8: {
			desc: "El usuario se cambia por otro Pokémon de su equipo, que hereda sus cambios de características, además de la confusión y los efectos de Acua Aro, Maldición, Embargo, Foco Energía, Bilis, Anticura, Arraigo, Drenadoras, Fijar Blanco (Telépata), Levitón, Canto Mortal, Truco Fuerza, Telequinesis, así como un sustituto con sus PS restantes. El efecto de Bilis no se hereda si el receptor tiene una habilidad que no puede anularse.", // NEEDS QC
		},
		gen7: {
			desc: "El usuario se cambia por otro Pokémon de su equipo, que hereda sus cambios de características, además de la confusión y los efectos de Acua Aro, Maldición, Embargo, Foco Energía, Bilis, Anticura, Arraigo, Drenadoras, Fijar Blanco (Telépata), Levitón, Canto Mortal, Truco Fuerza, Telequinesis y el estado de atrapado por Mal de Ojo (Bloqueo, Telaraña), así como un sustituto con sus PS restantes. El efecto de Bilis no se hereda si el receptor tiene una habilidad que no puede anularse. El efecto de Telequinesis no se hereda si el receptor es Mega-Gengar.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario se cambia por otro Pokémon de su equipo, que hereda sus cambios de características, además de la confusión y los efectos de Acua Aro, Maldición, Embargo, Foco Energía, Bilis, Anticura, Arraigo, Drenadoras, Fijar Blanco (Telépata), Levitón, Canto Mortal, Truco Fuerza, Telequinesis y el estado de atrapado por Mal de Ojo (Bloqueo, Telaraña), así como un sustituto con sus PS restantes.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario se cambia por otro Pokémon de su equipo, que hereda sus cambios de características, además de la confusión y los efectos de Acua Aro, Maldición, Embargo, Foco Energía, Bilis, Anticura, Arraigo, Drenadoras, Fijar Blanco (Telépata), Levitón, Chapoteo Lodo, Canto Mortal, Truco Fuerza, Hidrochorro y los estados de atrapar o estar atrapado por Mal de Ojo (Bloqueo, Telaraña), así como un sustituto con sus PS restantes.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario se cambia por otro Pokémon de su equipo, que hereda sus cambios de características, además de la confusión y los efectos de Maldición, Foco Energía, Arraigo, Drenadoras, Fijar Blanco (Telépata), Chapoteo Lodo, Canto Mortal, Hidrochorro y los estados de atrapar o estar atrapado por Mal de Ojo (Bloqueo, Telaraña), así como un sustituto con sus PS restantes.", // NEEDS QC
		},
		gen2: {
			desc: "El usuario se cambia por otro Pokémon de su equipo, que hereda sus cambios de características, además de la confusión y los efectos de Maldición, Rizo Defensa, Foco Energía, Profecía, Drenadoras, Fijar Blanco (Telépata), Reducción, Neblina, Canto Mortal y los estados de atrapar o estar atrapado por Mal de Ojo (Telaraña), así como un sustituto con sus PS restantes.", // NEEDS QC
		},
	},
	beakblast: {
		name: "Pico Cañón",
		// Official flavor text: "Primero aumenta la temperatura de su pico y luego ejecuta un ataque. Quema al rival si este le propina un ataque físico mientras está calentando el pico."
		desc: "Si el usuario recibe un movimiento de contacto este turno antes de ejecutar este movimiento, el atacante se quema.", // NEEDS QC
		shortDesc: "Quema a quien haga contacto antes de que actúe.", // NEEDS QC

		start: "  ¡{POKEMON} empieza a calentar su pico!",
	},
	beatup: {
		name: "Paliza",
		// Official flavor text: "Ataque de todo el equipo Pokémon. Cuantos más haya, más veces se atacará."
		desc: "Golpea una vez por el usuario y una por cada Pokémon del equipo no debilitado y sin problemas de estado. La potencia de cada golpe es 5+(X/10), donde X es el Ataque base de cada participante; todos los golpes cuentan como del usuario.", // NEEDS QC
		shortDesc: "Todo el equipo sano ayuda a dañar al objetivo.", // NEEDS QC
		gen4: {
			desc: "Inflige daño sin tipo. Golpea una vez por el usuario y una por cada Pokémon del equipo no debilitado y sin problemas de estado. Para cada golpe, la fórmula de daño usa el Ataque base del participante como Ataque y la Defensa base del objetivo como Defensa, e ignora los cambios de características y otros efectos que modifiquen el Ataque o la Defensa; todos los golpes cuentan como del usuario.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige daño sin tipo. Golpea una vez por cada Pokémon del equipo no debilitado y sin problemas de estado, o falla si ninguno cumple los requisitos. Para cada golpe, la fórmula de daño usa el Ataque base del participante como Ataque y la Defensa base del objetivo como Defensa, e ignora los cambios de características y otros efectos que modifiquen el Ataque o la Defensa; todos los golpes cuentan como del usuario.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige daño sin tipo. Golpea una vez por cada Pokémon del equipo no debilitado y sin problemas de estado. Para cada golpe, la fórmula de daño usa el nivel del participante, su Ataque base como Ataque y la Defensa base del objetivo como Defensa, e ignora los cambios de características y otros efectos que modifiquen el Ataque o la Defensa. Falla si ningún miembro del equipo puede participar.", // NEEDS QC
		},

		activate: "  ¡Ataque de {NAME}!",
	},
	behemothbash: {
		name: "Embate Supremo",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
		gen8: {
			shortDesc: "Doble de daño contra objetivos dinamaxizados.", // NEEDS QC
		},
	},
	behemothblade: {
		name: "Tajo Supremo",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
		gen8: {
			shortDesc: "Doble de daño contra objetivos dinamaxizados.", // NEEDS QC
		},
	},
	belch: {
		name: "Eructo",
		// Official flavor text: "El Pokémon causa daño a su oponente lanzándole un eructo. Para poder utilizar este movimiento tiene que llevar una baya y comérsela."
		desc: "No puede seleccionarse hasta que el usuario coma una baya: una que lleve, una robada y comida con Picadura o Picoteo, o una lanzada con Lanzamiento. Cumplida la condición, puede usarse el resto del combate aunque obtenga o use otro objeto o se cambie. Consumir una baya con Don Natural no cuenta.", // NEEDS QC
		shortDesc: "Solo puede usarse tras comer una baya.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	bellydrum: {
		name: "Tambor",
		// Official flavor text: "Reduce la mitad de los PS máximos para mejorar al máximo el Ataque."
		desc: "Sube 12 niveles el Ataque del usuario a cambio de la mitad de sus PS máximos (redondeado hacia abajo). Falla si el usuario se debilitaría o si su Ataque ya está en +6.", // NEEDS QC
		shortDesc: "Pierde la mitad de sus PS. Maximiza su Ataque.", // NEEDS QC
		gen2: {
			desc: "El usuario pierde la mitad de sus PS máximos (redondeado hacia abajo), salvo si se debilitaría o su Ataque ya está en +6. Si el usuario no tenía suficientes PS, su Ataque sube 2 niveles. En caso contrario, mientras su nivel de Ataque sea inferior a +6 sube de 2 en 2, y si su Ataque antes de ese paso era de 999, el nivel baja 1 y el bucle termina.", // NEEDS QC
		},

		boost: "  ¡{POKEMON} ha sacrificado algunos PS y ha aumentado al máximo su Ataque!",
	},
	bestow: {
		name: "Ofrenda",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El objetivo recibe el objeto del usuario. Falla si el usuario no tiene objeto o lleva un Cristal Z, si el objetivo ya lleva objeto, si el objeto es una megapiedra y alguno de los dos es la especie que puede megaevolucionar con ella, o si es Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho o un disco y alguno es Kyogre, Groudon, Giratina, Arceus, Genesect o Silvally, respectivamente.", // NEEDS QC
		shortDesc: "Entrega su objeto al objetivo.", // NEEDS QC
		gen6: {
			desc: "El objetivo recibe el objeto del usuario. Falla si el usuario no tiene objeto, si el objetivo ya lleva objeto, si el objeto es una megapiedra y alguno de los dos es la especie que puede megaevolucionar con ella, o si es Prisma Azul, Prisma Rojo, Griseosfera, una tabla o un cartucho y alguno es Kyogre, Groudon, Giratina, Arceus o Genesect, respectivamente.", // NEEDS QC
		},
		gen5: {
			desc: "El objetivo recibe el objeto del usuario. Falla si el usuario no tiene objeto o lleva Carta, si el objetivo ya lleva objeto, o si el objeto es Griseosfera, una tabla o un cartucho y alguno es Giratina, Arceus o Genesect, respectivamente.", // NEEDS QC
		},

		takeItem: "  ¡{POKEMON} ha recibido {ITEM:indefinite} de {SOURCE}!",
	},
	bide: {
		name: "Venganza",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El usuario queda fijado en este movimiento durante 2 turnos y después ataca al último Pokémon que lo golpeó, infligiendo el doble del daño recibido por ataques durante ese tiempo. Si ese Pokémon ya no está en combate, ataca a un rival al azar. Si el usuario no puede actuar durante el efecto, este termina. No comprueba la precisión, pero no ignora las inmunidades de tipo.", // NEEDS QC
		shortDesc: "Espera 2 turnos y devuelve el doble del daño recibido.", // NEEDS QC
		gen4: {
			desc: "El usuario queda fijado en este movimiento durante 2 turnos y después ataca al último Pokémon que lo golpeó, infligiendo el doble del daño recibido por ataques durante ese tiempo. Si ese Pokémon ya no está en combate, ataca a un rival al azar. Si el usuario no puede actuar durante el efecto, este termina. No comprueba la precisión e ignora las inmunidades de tipo.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario queda fijado en este movimiento durante 2 turnos y después ataca al último Pokémon que lo golpeó, infligiendo el doble de los PS perdidos durante ese tiempo. Si ese Pokémon ya no está en combate, ataca a un rival al azar. Si el usuario no puede actuar durante el efecto, este termina. No ignora las inmunidades de tipo.", // NEEDS QC
		},
		gen2: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y después ataca al rival, infligiendo el doble de los PS perdidos durante esos turnos. Si el usuario no puede actuar durante el efecto, este termina. No ignora las inmunidades de tipo.", // NEEDS QC
			shortDesc: "Espera 2-3 turnos; devuelve el doble del daño.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y después ataca al rival, infligiendo el doble de los PS perdidos durante esos turnos. Ignora las inmunidades de tipo y no puede evitarse aunque el objetivo esté usando Excavar o Vuelo. El usuario puede cambiarse durante el efecto. Si se cambia o no puede actuar, el efecto termina. Durante el efecto, si el rival se cambia o usa Rayo Confuso, Conversión, Foco Energía, Deslumbrar, Niebla, Drenadoras, Pantalla de Luz, Mimético, Neblina, Gas Venenoso, Polvo Veneno, Recuperación, Reflejo, Descanso, Ovocuración, Salpicadura, Paralizador, Sustituto, Supersónico, Teletransporte, Onda Trueno, Tóxico, Transformación, el daño recibido antes se suma al total.", // NEEDS QC
		},

		start: "  ¡{POKEMON} está acumulando energía!",
		end: "  ¡{POKEMON} ha liberado la energía!",
		activate: "  ¡{POKEMON} está acumulando energía!",
	},
	bind: {
		name: "Atadura",
		// Official flavor text: "Ata y oprime de cuatro a cinco turnos."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (1/8 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos (siempre 5 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
			shortDesc: "Atrapa y daña al objetivo durante 2-5 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si usa Relevo. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario pasa de 2 a 5 turnos usando este movimiento: 3/8 de probabilidad de que dure 2 o 3 turnos y 1/8 de que dure 4 o 5. El daño calculado el primer turno se repite en los demás. El usuario no puede elegir movimiento y el objetivo no puede ejecutar movimientos durante el efecto, pero ambos pueden cambiarse. Si el usuario se cambia, el objetivo sigue sin poder actuar ese turno. Si el objetivo se cambia, el usuario vuelve a usar este movimiento automáticamente, y si entonces tenía 0 PP, pasan a 63. Si alguno se cambia o el usuario no puede actuar, el efecto termina. Este movimiento puede impedir actuar al objetivo aunque tenga inmunidad de tipo, pero entonces no inflige daño.", // NEEDS QC
			shortDesc: "El objetivo no puede actuar durante 2-5 turnos.", // NEEDS QC
		},

		start: "  ¡La atadura de {SOURCE} oprime a {POKEMON}!",
		move: "#wrap",
	},
	bite: {
		name: "Mordisco",
		// Official flavor text: "Un voraz bocado que puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		gen1: {
			desc: "10% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
			shortDesc: "10% de hacer retroceder al objetivo.", // NEEDS QC
		},
	},
	bitterblade: {
		name: "Espada Lamento",
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
	},
	bittermalice: {
		name: "Rencor Reprimido",
		desc: "100% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	blackholeeclipse: {
		name: "Agujero Negro Aniquilador",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	blastburn: {
		name: "Anillo Ígneo",
		// Official flavor text: "Explosión de fuego. El atacante debe descansar el siguiente turno."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	blazekick: {
		name: "Patada Ígnea",
		// Official flavor text: "Patada que suele ser un golpe crítico y puede causar quemaduras."
		desc: "10% de probabilidad de quemar al objetivo. Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta prob. de crítico. 10% de quemar.", // NEEDS QC
	},
	blazingtorque: {
		name: "Pirochoque",
		desc: "30% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "30% de quemar al objetivo.", // NEEDS QC
	},
	bleakwindstorm: {
		name: "Vendaval Gélido",
		desc: "30% de probabilidad de bajar 1 nivel la Velocidad del objetivo. No puede fallar si llueve o hay diluvio. Contra un objetivo con Parasol Multiuso, su precisión sigue siendo del 80%.", // NEEDS QC
		shortDesc: "30% de bajar Vel. de rivales. No falla con lluvia.", // NEEDS QC
	},
	blizzard: {
		name: "Ventisca",
		// Official flavor text: "Tormenta de hielo que puede llegar a congelar."
		desc: "10% de probabilidad de congelar al objetivo. No puede fallar si nieva.", // NEEDS QC
		shortDesc: "10% de congelar. No falla si nieva.", // NEEDS QC
		gen8: {
			desc: "10% de probabilidad de congelar al objetivo. Si graniza, no comprueba la precisión.", // NEEDS QC
			shortDesc: "10% de congelar. No falla con granizo.", // NEEDS QC
		},
		gen3: {
			desc: "10% de probabilidad de congelar al objetivo.", // NEEDS QC
			shortDesc: "10% de probabilidad de congelar.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10% de congelar al objetivo.", // NEEDS QC
		},
	},
	block: {
		name: "Bloqueo",
		// Official flavor text: "Le corta el paso al objetivo para que no pueda escapar."
		desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Impide que el objetivo se cambie.", // NEEDS QC
		gen7: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo, salvo que use Relevo: en ese caso el objetivo sigue atrapado.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si usa Relevo. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo, salvo que use Relevo: en ese caso el objetivo sigue atrapado.", // NEEDS QC
		},
	},
	bloodmoon: {
		name: "Luna Roja",
		shortDesc: "No puede elegirse dos turnos seguidos.", // NEEDS QC
	},
	bloomdoom: {
		name: "Megatón Floral",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	blueflare: {
		name: "Llama Azul",
		// Official flavor text: "Ataca con una bella pero potente llama azul que rodea al objetivo. Puede quemarlo."
		desc: "20% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "20% de quemar al objetivo.", // NEEDS QC
	},
	bodypress: {
		name: "Plancha Corporal",
		// Official flavor text: "El usuario usa el cuerpo para lanzar su ataque e infligir un daño directamente proporcional a su Defensa."
		desc: "El daño se calcula usando la Defensa del usuario en lugar de su Ataque, incluidos los cambios de nivel. Los demás modificadores del Ataque se aplican con normalidad.", // NEEDS QC
		shortDesc: "Calcula el daño con su Defensa en lugar de su Ataque.", // NEEDS QC
	},
	bodyslam: {
		name: "Golpe Cuerpo",
		// Official flavor text: "Salta sobre el objetivo con todo su peso y puede llegar a paralizarlo."
		desc: "30% de probabilidad de paralizar al objetivo. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "30% de paralizar al objetivo.", // NEEDS QC
		gen5: {
			desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		},
	},
	boltbeak: {
		name: "Electropico",
		// Official flavor text: "El usuario ensarta al objetivo con su pico cargado de electricidad. Si ataca en primer lugar, la potencia del movimiento se duplica."
		desc: "La potencia se duplica si el usuario actúa antes que el objetivo.", // NEEDS QC
		shortDesc: "Potencia doble si actúa antes que el objetivo.", // NEEDS QC
	},
	boltstrike: {
		name: "Ataque Fulgor",
		// Official flavor text: "Ataca envolviéndose de una gran carga eléctrica y embistiendo al objetivo con ella. Puede paralizar."
		desc: "20% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "20% de paralizar al objetivo.", // NEEDS QC
	},
	boneclub: {
		name: "Hueso Palo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "10% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "10% de hacer retroceder al objetivo.", // NEEDS QC
	},
	bonemerang: {
		name: "Huesomerang",
		// Official flavor text: "Lanza un hueso a modo de bumerán que golpea dos veces."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces en un turno.", // NEEDS QC
		gen4: {
			desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	bonerush: {
		name: "Ataque Óseo",
		// Official flavor text: "Hueso en ristre, aporrea al objetivo de dos a cinco veces."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
	},
	boomburst: {
		name: "Estruendo",
		// Official flavor text: "Ataca a todos los Pokémon a su alrededor con una potentísima onda sonora."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los Pokémon adyacentes.", // NEEDS QC
	},
	bounce: {
		name: "Bote",
		// Official flavor text: "El usuario bota en el primer turno y golpea al objetivo en el segundo y puede llegar a paralizarlo."
		desc: "30% de probabilidad de paralizar al objetivo. Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Vendaval, Gancho Alto, Antiaéreo, Mil Flechas, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Se eleva y golpea el turno 2. 30% de paralizar.", // NEEDS QC
		gen5: {
			desc: "30% de probabilidad de paralizar al objetivo. Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Vendaval, Gancho Alto, Antiaéreo, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		},
		gen4: {
			desc: "30% de probabilidad de paralizar al objetivo. Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Gancho Alto, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		},
		gen3: {
			desc: "30% de probabilidad de paralizar al objetivo. Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Gancho Alto, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño.", // NEEDS QC
		},

		prepare: "¡{POKEMON} ha saltado muy alto!",
	},
	bouncybubble: {
		name: "Vapodrenaje",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
	},
	branchpoke: {
		name: "Punzada Rama",
		// Official flavor text: "Ataca pinchando al objetivo con una rama afilada."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	bravebird: {
		name: "Pájaro Osado",
		// Official flavor text: "Pliega sus alas y ataca con un vuelo rasante. El Pokémon que lo usa también resulta seriamente dañado."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso del 33% del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso del 33% del daño.", // NEEDS QC
		gen4: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/3 de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "Tiene 1/3 de retroceso.", // NEEDS QC
		},
	},
	breakingswipe: {
		name: "Vasto Impacto",
		// Official flavor text: "El usuario sacude violentamente su enorme cola para golpear a todos los rivales y reducir su Ataque a la par."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel el Ataque de los rivales.", // NEEDS QC
	},
	breakneckblitz: {
		name: "Carrera Arrolladora",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	brickbreak: {
		name: "Demolición",
		// Official flavor text: "Potente ataque que también es capaz de destruir barreras como Pantalla de Luz y Reflejo."
		desc: "Si el ataque no falla, elimina los efectos de Reflejo, Pantalla de Luz, Velo Aurora del bando del objetivo antes de calcular el daño.", // NEEDS QC
		shortDesc: "Destruye las pantallas, salvo si el objetivo es inmune.", // NEEDS QC
		gen6: {
			desc: "Si el ataque no falla, elimina los efectos de Reflejo y Pantalla de Luz del bando del objetivo antes de calcular el daño.", // NEEDS QC
		},
		gen4: {
			desc: "Si el ataque no falla, y sea el objetivo inmune o no, elimina los efectos de Reflejo y Pantalla de Luz del bando del objetivo antes de calcular el daño.", // NEEDS QC
			shortDesc: "Destruye pantallas aunque el objetivo sea inmune.", // NEEDS QC
		},
		gen3: {
			desc: "Si el ataque no falla, y sea el objetivo inmune o no, elimina los efectos de Reflejo y Pantalla de Luz del bando rival antes de calcular el daño.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha destrozado las protecciones de {TEAM}!", // NEEDS QC
	},
	brine: {
		name: "Salmuera",
		// Official flavor text: "Si al objetivo le queda la mitad o menos de sus PS, el ataque será el doble de fuerte."
		desc: "La potencia se duplica si el objetivo tiene la mitad o menos de sus PS máximos.", // NEEDS QC
		shortDesc: "Potencia doble contra objetivos a mitad de PS o menos.", // NEEDS QC
	},
	brutalswing: {
		name: "Giro Vil",
		// Official flavor text: "Hace pivotar su cuerpo para causar daño a su alrededor."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los Pokémon adyacentes.", // NEEDS QC
	},
	bubble: {
		name: "Burbuja",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "10% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel la Velocidad de los rivales.", // NEEDS QC
		gen1: {
			desc: "33% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
			shortDesc: "33% de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
		},
	},
	bubblebeam: {
		name: "Rayo Burbuja",
		// Official flavor text: "Diluvio de burbujas que puede bajar la Velocidad."
		desc: "10% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
		gen1: {
			desc: "33% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
			shortDesc: "33% de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		},
	},
	bugbite: {
		name: "Picadura",
		// Official flavor text: "Pica al objetivo. Si el objetivo lleva una baya, el usuario se la come y se beneficia de su efecto."
		desc: "Si acierta y el usuario no se ha debilitado, roba y come la baya del objetivo, obteniendo su efecto aunque su propio objeto esté anulado. Las bayas perdidas así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		shortDesc: "Roba y se come la baya del objetivo.", // NEEDS QC
		gen4: {
			desc: "Roba y come la baya del objetivo, obteniendo su efecto salvo que su propio objeto esté anulado. Las bayas perdidas así pueden recuperarse con Reciclaje.", // NEEDS QC
		},

		removeItem: "  ¡{SOURCE} ha robado {ITEM:definite:classified} del objetivo y se {INFLECT:ITEM:ms=lo:fs=la:mp=los:fp=las} ha comido!",
	},
	bugbuzz: {
		name: "Zumbido",
		// Official flavor text: "El usuario crea una onda sónica dañina moviendo su cuerpo que también puede disminuir la Defensa Especial del objetivo."
		desc: "10% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	bulkup: {
		name: "Corpulencia",
		// Official flavor text: "Robustece el cuerpo para subir el Ataque y la Defensa."
		desc: "Sube 1 nivel el Ataque y la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Ataque y Defensa del usuario.", // NEEDS QC
	},
	bulldoze: {
		name: "Terratemblor",
		// Official flavor text: "Sacudida sísmica que afecta a los demás Pokémon adyacentes y también reduce su Velocidad."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel la Velocidad de los adyacentes.", // NEEDS QC
	},
	bulletpunch: {
		name: "Puño Bala",
		// Official flavor text: "Ataca con fuertes puñetazos tan rápidos como proyectiles. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	bulletseed: {
		name: "Semilladora",
		// Official flavor text: "Dispara rápido de dos a cinco ráfagas de semillas de manera consecutiva."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
	},
	burningbulwark: {
		name: "Llama Protectora",
		desc: "Protege al usuario de la mayoría de los movimientos este turno y quema a los Pokémon que intenten hacer contacto con él. Los movimientos que no causan daño lo atraviesan. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege de ataques. Contacto: quema.", // NEEDS QC
	},
	burningjealousy: {
		name: "Envidia Ardiente",
		// Official flavor text: "Ataca al objetivo con la energía generada por la envidia y causa quemaduras a los Pokémon cuyas características hayan aumentado en ese turno."
		desc: "100% de probabilidad de quemar al objetivo si sus características subieron este turno.", // NEEDS QC
		shortDesc: "100% de quemar si el objetivo subió características.", // NEEDS QC
	},
	burnup: {
		name: "Llama Final",
		// Official flavor text: "Utiliza hasta el último resquicio de llamas de su cuerpo para infligir un grave daño al oponente. Tras el ataque, el usuario deja de ser de tipo Fuego."
		desc: "Falla si el usuario no es de tipo Fuego. Si acierta y el usuario no está teracristalizado, pierde su tipo Fuego mientras siga en combate.", // NEEDS QC
		shortDesc: "Pierde su tipo Fuego; debe ser de tipo Fuego.", // NEEDS QC
		gen8: {
			desc: "Falla si el usuario no es de tipo Fuego. Si acierta, el usuario pierde su tipo Fuego mientras siga en combate.", // NEEDS QC
		},

		typeChange: "  ¡El fuego interior de {POKEMON} se ha extinguido!",
	},
	buzzybuzz: {
		name: "Joltioparálisis",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "100% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "100% de paralizar al objetivo.", // NEEDS QC
	},
	calmmind: {
		name: "Paz Mental",
		// Official flavor text: "Aumenta la concentración y calma el espíritu para subir el Ataque Especial y la Defensa Especial."
		desc: "Sube 1 nivel el Ataque Especial y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel At. Esp. y Def. Esp. del usuario.", // NEEDS QC
	},
	camouflage: {
		name: "Camuflaje",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El tipo del usuario cambia según el campo: Normal por defecto, Eléctrico en campo eléctrico, Hada en campo de niebla, Planta en campo de hierba y Psíquico en campo psíquico. Falla si su tipo no puede cambiar o si ya es puramente de ese tipo.", // NEEDS QC
		shortDesc: "Cambia su tipo según el campo (Normal por defecto).", // NEEDS QC
		gen6: {
			desc: "El tipo del usuario cambia según el campo: Normal por defecto, Eléctrico en campo eléctrico, Hada en campo de niebla y Planta en campo de hierba. Falla si su tipo no puede cambiar o si ya es puramente de ese tipo.", // NEEDS QC
		},
		gen5: {
			desc: "El tipo del usuario cambia según el campo: Tierra por defecto. Falla si su tipo no puede cambiar o si ya es puramente de ese tipo.", // NEEDS QC
			shortDesc: "Cambia su tipo según el campo. (Tierra)", // NEEDS QC
		},
		gen4: {
			desc: "El tipo del usuario cambia según el campo: Normal por defecto. Falla si el usuario tiene la habilidad Multitipo o si ese tipo ya es uno de los suyos.", // NEEDS QC
			shortDesc: "Cambia su tipo según el campo. (Normal)", // NEEDS QC
		},
		gen3: {
			desc: "El tipo del usuario cambia según el campo: Normal por defecto. Falla si ese tipo ya es uno de los suyos.", // NEEDS QC
		},
	},
	captivate: {
		name: "Seducción",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Baja 2 niveles el Ataque Especial del objetivo. No afecta si usuario y objetivo son del mismo sexo o si alguno no tiene sexo. Los Pokémon con la habilidad Despiste son inmunes.", // NEEDS QC
		shortDesc: "Baja 2 niveles el At. Esp. del sexo opuesto.", // NEEDS QC
	},
	catastropika: {
		name: "Pikavoltio Letal",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	ceaselessedge: {
		name: "Tajo Metralla",
		desc: "Si acierta, coloca una trampa en el bando rival que daña a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede acumularse hasta 3 veces: pierden 1/8, 1/6 o 1/4 de sus PS máximos (redondeado hacia abajo) según las capas. Se elimina si algún Pokémon usa Limpieza General o si un rival usa con éxito Giro Mortífero, Giro Rápido, Despejar o recibe Despejar.", // NEEDS QC
		shortDesc: "Coloca una capa de púas en el bando rival.", // NEEDS QC
	},
	celebrate: {
		name: "Celebración",
		shortDesc: "Sin uso competitivo.", // NEEDS QC

		activate: "  ¡Felicidades, {TRAINER}!",
	},
	charge: {
		name: "Carga",
		// Official flavor text: "Recarga energía para potenciar el siguiente movimiento de tipo Eléctrico. También sube la Defensa Especial."
		desc: "Sube 1 nivel la Defensa Especial del usuario y duplica la potencia de su siguiente ataque de tipo Eléctrico. El efecto termina al dejar el combate o al intentar usar (aunque falle) un movimiento Eléctrico distinto de Carga.", // NEEDS QC
		shortDesc: "+1 Def. Esp. y duplica su próximo movimiento Eléctrico.", // NEEDS QC
		gen8: {
			desc: "Sube 1 nivel la Defensa Especial del usuario. Si el usuario usa un ataque de tipo Eléctrico el siguiente turno, su potencia se duplicará.", // NEEDS QC
			shortDesc: "+1 Def. Esp. Próximo mov. Eléctrico: doble potencia.", // NEEDS QC
		},
		gen3: {
			desc: "Si el usuario usa un ataque de tipo Eléctrico el siguiente turno, su potencia se duplicará.", // NEEDS QC
			shortDesc: "El próximo mov. Eléctrico tiene doble potencia.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha comenzado a acumular energía!",
	},
	chargebeam: {
		name: "Rayo Carga",
		// Official flavor text: "Lanza un rayo eléctrico contra el objetivo. Puede subir el Ataque Especial de quien lo usa."
		desc: "70% de probabilidad de subir 1 nivel el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "70% de subir 1 nivel At. Esp. del usuario.", // NEEDS QC
	},
	charm: {
		name: "Encanto",
		// Official flavor text: "Engatusa al objetivo y reduce mucho su Ataque."
		desc: "Baja 2 niveles el Ataque del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles Ataque del objetivo.", // NEEDS QC
	},
	chatter: {
		name: "Cháchara",
		// Official flavor text: "Ataca con una onda de sonido muy ruidosa compuesta por palabras y confunde al objetivo."
		desc: "100% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "100% de confundir al objetivo.", // NEEDS QC
		gen5: {
			desc: "X% de probabilidad de confundir al objetivo, donde X es 0 salvo que el usuario sea un Chatot sin transformar. Si es un Chatot, X es 0 o 10 según el volumen del canto grabado: 0 con volumen bajo o sin grabación, 10 con volumen medio o alto.", // NEEDS QC
			shortDesc: "Con Chatot: 10% de confundir.", // NEEDS QC
		},
		gen4: {
			desc: "X% de probabilidad de confundir al objetivo, donde X es 0 salvo que el usuario sea un Chatot sin transformar. Si es un Chatot, X es 1, 11 o 31 según el volumen del canto grabado: 1 sin grabación o con volumen bajo, 11 con volumen medio y 31 con volumen alto.", // NEEDS QC
			shortDesc: "Con Chatot: 31% de confundir.", // NEEDS QC
		},
	},
	chillingwater: {
		name: "Agua Fría",
		desc: "100% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	chillyreception: {
		name: "Fría Acogida",
		desc: "Hace nevar durante 5 turnos. El usuario se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos.", // NEEDS QC
		shortDesc: "Invoca la nieve y el usuario se cambia.", // NEEDS QC

		prepare: "  {POKEMON} se prepara para contar un chiste malo...",
	},
	chipaway: {
		name: "Guardia Baja",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Ignora los cambios de características del objetivo, incluida la evasión.", // NEEDS QC
		shortDesc: "Ignora los cambios de características del objetivo.", // NEEDS QC
	},
	chloroblast: {
		name: "Clorofiláser",
		desc: "Si acierta, el usuario pierde la mitad de sus PS máximos (redondeado hacia arriba), salvo que tenga las habilidades Muro Mágico o Cabeza Roca.", // NEEDS QC
		shortDesc: "El usuario pierde la mitad de sus PS máximos.", // NEEDS QC
	},
	circlethrow: {
		name: "Llave Giro",
		// Official flavor text: "Lanza por los aires al objetivo y hace que salga otro Pokémon. Si es uno salvaje, acaba el combate."
		desc: "Si ni el usuario ni el objetivo se han debilitado, obliga al objetivo a cambiarse por un aliado sano al azar. Este efecto falla si el objetivo está bajo el efecto de Arraigo, tiene la habilidad Ventosas o el movimiento golpeó un sustituto.", // NEEDS QC
		shortDesc: "Obliga al objetivo a cambiarse por un aliado al azar.", // NEEDS QC
	},
	clamp: {
		name: "Tenaza",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (1/8 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos (siempre 5 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
			shortDesc: "Atrapa y daña al objetivo durante 2-5 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si usa Relevo. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario pasa de 2 a 5 turnos usando este movimiento: 3/8 de probabilidad de que dure 2 o 3 turnos y 1/8 de que dure 4 o 5. El daño calculado el primer turno se repite en los demás. El usuario no puede elegir movimiento y el objetivo no puede ejecutar movimientos durante el efecto, pero ambos pueden cambiarse. Si el usuario se cambia, el objetivo sigue sin poder actuar ese turno. Si el objetivo se cambia, el usuario vuelve a usar este movimiento automáticamente, y si entonces tenía 0 PP, pasan a 63. Si alguno se cambia o el usuario no puede actuar, el efecto termina. Este movimiento puede impedir actuar al objetivo aunque tenga inmunidad de tipo, pero entonces no inflige daño.", // NEEDS QC
			shortDesc: "El objetivo no puede actuar durante 2-5 turnos.", // NEEDS QC
		},

		start: "  ¡{SOURCE} ha atenazado a {POKEMON}!",
		move: "#wrap",
	},
	clangingscales: {
		name: "Fragor Escamas",
		// Official flavor text: "Frota todas las escamas de su cuerpo para crear un fuerte sonido con el que ataca. Cuando el ataque termina, su Defensa se ve reducida."
		desc: "Baja 1 nivel la Defensa del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Defensa del usuario.", // NEEDS QC
	},
	clangoroussoul: {
		name: "Estruendo Escama",
		// Official flavor text: "Utiliza parte de los PS propios para subir sus características."
		desc: "Sube 1 nivel el Ataque, la Defensa, el Ataque Especial, la Defensa Especial y la Velocidad del usuario a cambio del 33% de sus PS máximos (redondeado hacia abajo). Falla si el usuario se debilitaría o si ninguna de esas características puede cambiar.", // NEEDS QC
		shortDesc: "Pierde 1/3 de sus PS. +1 a todas sus características.", // NEEDS QC
	},
	clangoroussoulblaze: {
		name: "Estruendo Implacable",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Sube 1 nivel el Ataque, la Defensa, el Ataque Especial, la Defensa Especial y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel todas las características del usuario.", // NEEDS QC
	},
	clearsmog: {
		name: "Niebla Clara",
		shortDesc: "Elimina los cambios de características del objetivo.", // NEEDS QC
	},
	closecombat: {
		name: "A Bocajarro",
		// Official flavor text: "Lucha abiertamente contra el objetivo sin protegerse. También reduce la Defensa y la Defensa Especial del usuario."
		desc: "Baja 1 nivel la Defensa y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Defensa y Def. Esp. del usuario.", // NEEDS QC
	},
	coaching: {
		name: "Motivación",
		// Official flavor text: "El usuario imparte indicaciones precisas a sus aliados, que ven aumentados su Ataque y su Defensa."
		desc: "Sube 1 nivel el Ataque y la Defensa de un aliado. Falla si el usuario no tiene un aliado adyacente.", // NEEDS QC
		shortDesc: "Sube 1 nivel el Ataque y la Defensa de un aliado.", // NEEDS QC
	},
	coil: {
		name: "Enrosque",
		// Official flavor text: "El usuario se concentra, lo que le permite aumentar su Ataque, Defensa y Precisión."
		desc: "Sube 1 nivel el Ataque, la Defensa y la precisión del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel su Ataque, Defensa y precisión.", // NEEDS QC
	},
	collisioncourse: {
		name: "Nitrochoque",
		desc: "El daño se multiplica por 1,3333 si el movimiento es supereficaz contra el objetivo.", // NEEDS QC
		shortDesc: "Inflige 1,3333x de daño si es supereficaz.", // NEEDS QC
	},
	combattorque: {
		name: "Pugnachoque",
		desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "30% de paralizar al objetivo.", // NEEDS QC
	},
	cometpunch: {
		name: "Puño Cometa",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. El daño se calcula una sola vez para el primer golpe y se repite en cada golpe. Si un golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	comeuppance: {
		name: "Resarcimiento",
		desc: "Inflige al último rival que dañó al usuario con un ataque físico o especial este turno 1,5 veces el daño recibido (redondeado hacia abajo); si no perdió PS, inflige 1 PS. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico o especial rival este turno.", // NEEDS QC
		shortDesc: "Si lo golpean, devuelve 1,5 veces el daño.", // NEEDS QC
	},
	confide: {
		name: "Confidencia",
		// Official flavor text: "Hace que el objetivo pierda la concentración contándole un secreto. Disminuye el Ataque Especial del oponente."
		desc: "Baja 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel At. Esp. del objetivo.", // NEEDS QC
	},
	confuseray: {
		name: "Rayo Confuso",
		// Official flavor text: "Rayo siniestro que confunde al objetivo."
		desc: "Confunde al objetivo.", // NEEDS QC
		shortDesc: "Confunde al objetivo.", // NEEDS QC
	},
	confusion: {
		name: "Confusión",
		// Official flavor text: "Débil ataque telequinético que puede causar confusión."
		desc: "10% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "10% de confundir al objetivo.", // NEEDS QC
	},
	constrict: {
		name: "Restricción",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "10% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
		gen1: {
			desc: "33% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
			shortDesc: "33% de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		},
	},
	continentalcrush: {
		name: "Aplastamiento Gigalítico",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	conversion: {
		name: "Conversión",
		// Official flavor text: "Cambia el tipo del usuario por el del primero de sus movimientos."
		desc: "El tipo del usuario cambia al tipo original del movimiento de su primera posición. Falla si su tipo no puede cambiar o si ese tipo ya es uno de los suyos.", // NEEDS QC
		shortDesc: "Cambia su tipo al de su primer movimiento.", // NEEDS QC
		gen5: {
			desc: "El tipo del usuario cambia al azar al tipo original de uno de sus movimientos distintos de este (excluidos sus tipos actuales). Falla si su tipo no puede cambiar o si solo podría elegir uno de sus tipos actuales.", // NEEDS QC
			shortDesc: "Cambia su tipo al de uno de sus movimientos.", // NEEDS QC
		},
		gen4: {
			desc: "El tipo del usuario cambia al azar al tipo original de uno de sus movimientos distintos de este y de Maldición (excluidos sus tipos actuales). Falla si su tipo no puede cambiar o si solo podría elegir uno de sus tipos actuales.", // NEEDS QC
		},
		gen3: {
			desc: "El tipo del usuario cambia al azar al tipo original de uno de sus movimientos distintos de Maldición (excluidos sus tipos actuales). Falla si su tipo no puede cambiar o si solo podría elegir uno de sus tipos actuales.", // NEEDS QC
		},
		gen1: {
			desc: "Los tipos del usuario pasan a ser los tipos actuales del objetivo.", // NEEDS QC
			shortDesc: "Copia los tipos del objetivo.", // NEEDS QC
		},

		typeChange: "  ¡Cambió tipo al de {SOURCE}!",
	},
	conversion2: {
		name: "Conversión 2",
		// Official flavor text: "El usuario cambia de tipo para hacerse resistente al último tipo de movimiento usado por el objetivo."
		desc: "El tipo del usuario cambia a uno que resista o sea inmune al tipo del último movimiento usado por el objetivo (excluidos sus tipos actuales). Se usa el tipo resultante del movimiento, no el original. Falla si el objetivo no ha usado un movimiento, si el tipo del usuario no puede cambiar o si solo podría elegir uno de sus tipos actuales.", // NEEDS QC
		shortDesc: "Su tipo pasa a resistir el último movimiento rival.", // NEEDS QC
		gen4: {
			desc: "El tipo del usuario cambia a uno que resista o sea inmune al tipo del último movimiento usado contra él, si tuvo éxito (excluidos sus tipos actuales). Se usa el tipo resultante del movimiento, no el original. Falla si el último movimiento usado contra el usuario no tuvo éxito, si tiene la habilidad Multitipo o si solo podría elegir uno de sus tipos actuales.", // NEEDS QC
			shortDesc: "Cambia a un tipo que resista el último mov. sufrido.", // NEEDS QC
		},
		gen3: {
			desc: "El tipo del usuario cambia a uno que resista o sea inmune al tipo del último movimiento usado contra él, si tuvo éxito (excluidos sus tipos actuales). Se usa el tipo resultante del movimiento, no el original, pero Forcejeo cuenta como tipo Normal. Falla si el último movimiento usado contra el usuario no tuvo éxito o si solo podría elegir uno de sus tipos actuales.", // NEEDS QC
		},
		gen2: {
			desc: "El tipo del usuario cambia a uno que resista o sea inmune al tipo del último movimiento usado por el rival, aunque sea uno de sus tipos actuales. Se usa el tipo original del movimiento, no el resultante. Falla si el rival no ha usado un movimiento.", // NEEDS QC
			shortDesc: "Cambia a un tipo que resista el último mov. rival.", // NEEDS QC
		},
	},
	copycat: {
		name: "Copión",
		// Official flavor text: "Imita el movimiento usado justo antes. El movimiento falla si no se ha usado aún ninguno."
		desc: "Usa el último movimiento usado por cualquier Pokémon, incluido él mismo. Falla si no se ha usado ninguno o si el último fue Ayuda, Búnker, Pico Cañón, Embate Supremo, Tajo Supremo, Eructo, Ofrenda, Pirochoque, Celebración, Cháchara, Llave Giro, Pugnachoque, Copión, Contraataque, Antojo, Mismo Destino, Detección, Cola Dragón, Cañón Dinamax, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Feerichoque, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Ponzochoque, Protección, Polvo Ira, Rugido, Coraza Trampa, Esquema, Sonámbulo, Robo, Barrera Espinosa, Foco, Forcejeo, Trapicheo, Teraclúster, Ladrón, Transformación, Truco, Remolino, Ominochoque.", // NEEDS QC
		shortDesc: "Usa el último movimiento usado en el combate.", // NEEDS QC
		gen8: {
			desc: "Usa el último movimiento usado por cualquier Pokémon, incluido él mismo. Para los movimientos Dinamax y Gigamax se considera el movimiento base. Falla si no se ha usado ninguno o si el último fue Ayuda, Búnker, Pico Cañón, Embate Supremo, Tajo Supremo, Eructo, Ofrenda, Celebración, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Cola Dragón, Cañón Dinamax, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Protección, Polvo Ira, Rugido, Coraza Trampa, Esquema, Sonámbulo, Robo, Barrera Espinosa, Foco, Forcejeo, Trapicheo, Ladrón, Transformación, Truco, Remolino.", // NEEDS QC
		},
		gen7: {
			desc: "Usa el último movimiento usado por cualquier Pokémon, incluido él mismo. Falla si no se ha usado ninguno o si el último fue Ayuda, Búnker, Pico Cañón, Eructo, Ofrenda, Celebración, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Cola Dragón, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Protección, Polvo Ira, Rugido, Coraza Trampa, Esquema, Sonámbulo, Robo, Barrera Espinosa, Foco, Forcejeo, Trapicheo, Ladrón, Transformación, Truco, Remolino, o un movimiento Z.", // NEEDS QC
		},
		gen6: {
			desc: "Usa el último movimiento usado por cualquier Pokémon, incluido él mismo. Falla si no se ha usado ninguno o si el último fue Ayuda, Eructo, Ofrenda, Celebración, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Cola Dragón, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Manos Juntas, Escudo Real, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Protección, Polvo Ira, Rugido, Esquema, Sonámbulo, Robo, Barrera Espinosa, Forcejeo, Trapicheo, Ladrón, Transformación, Truco, Remolino.", // NEEDS QC
		},
		gen5: {
			desc: "Usa el último movimiento usado por cualquier Pokémon, incluido él mismo. Falla si no se ha usado ninguno o si el último fue Ayuda, Ofrenda, Cháchara, Llave Giro, Copión, Contraataque, Antojo, Mismo Destino, Detección, Cola Dragón, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Protección, Polvo Ira, Esquema, Sonámbulo, Robo, Forcejeo, Trapicheo, Ladrón, Transformación, Truco.", // NEEDS QC
		},
		gen4: {
			desc: "Usa el último movimiento usado por cualquier Pokémon, incluido él mismo. Falla si no se ha usado ninguno o si el último fue Ayuda, Cháchara, Copión, Contraataque, Antojo, Mismo Destino, Detección, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Protección, Esquema, Sonámbulo, Robo, Forcejeo, Trapicheo, Ladrón, Truco.", // NEEDS QC
		},
	},
	coreenforcer: {
		name: "Núcleo Castigo",
		// Official flavor text: "Inflige daño al rival, y si este ya ha hecho uso de algún movimiento, pierde su habilidad."
		desc: "Si el usuario actúa después del objetivo, anula su habilidad mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Si la habilidad del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Modo Daruma, Cambio Heroico, no ocurre nada, y recibir el efecto por Relevo lo termina de inmediato.", // NEEDS QC
		shortDesc: "Anula la habilidad del rival si este actúa primero.", // NEEDS QC
		gen8: {
			desc: "Si el usuario actúa después del objetivo, anula su habilidad mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Si la habilidad del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Modo Daruma, no ocurre nada, y recibir el efecto por Relevo lo termina de inmediato.", // NEEDS QC
		},
		gen7: {
			desc: "Si el usuario actúa después del objetivo, anula su habilidad mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Si la habilidad del objetivo es Fuerte Afecto, Letargo Perenne, Disfraz, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Modo Daruma, no ocurre nada, y recibir el efecto por Relevo lo termina de inmediato.", // NEEDS QC
		},
	},
	corkscrewcrash: {
		name: "Hélice Trepanadora",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	corrosivegas: {
		name: "Gas Corrosivo",
		// Official flavor text: "El usuario libera un gas cáustico que envuelve a todos los que se encuentren alrededor y derrite por completo los objetos que lleven equipados."
		desc: "El objetivo pierde su objeto. No puede hacer que los Pokémon con la habilidad Viscosidad pierdan su objeto, ni que Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradoja o Ogerpon pierdan, respectivamente, Prisma Azul, Prisma Rojo, Gran Diamansfera, Gran Lustresfera, Gran Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada, Escudo Oxidado, Energía Potenciadora o su máscara. Aquí, los Pokémon Paradoja son todas las especies con las habilidades Paleosíntesis y Carga Cuark, salvo Flamariete, Electrofuria, Ferromole, Ferrotesta. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		shortDesc: "Elimina los objetos de los Pokémon adyacentes.", // NEEDS QC
		gen8: {
			desc: "El objetivo pierde su objeto. No puede hacer que los Pokémon con la habilidad Viscosidad pierdan su objeto, ni que Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta pierdan, respectivamente, Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada o Escudo Oxidado. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},

		fail: "#healblock",
		removeItem: "  ¡{SOURCE} ha derretido {ITEM:definite:classified} de {POKEMON}!",
	},
	cosmicpower: {
		name: "Masa Cósmica",
		// Official flavor text: "Sube la Defensa y la Defensa Especial propias con energía mística."
		desc: "Sube 1 nivel la Defensa y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Defensa y Def. Esp. del usuario.", // NEEDS QC
	},
	cottonguard: {
		name: "Rizo Algodón",
		// Official flavor text: "Cubre al Pokémon con una madeja protectora. Aumenta muchísimo la Defensa."
		desc: "Sube 3 niveles la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 3 niveles Defensa del usuario.", // NEEDS QC
	},
	cottonspore: {
		name: "Esporagodón",
		// Official flavor text: "Adhiere esporas a los rivales para reducir mucho su Velocidad."
		desc: "Baja 2 niveles la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles Velocidad del objetivo.", // NEEDS QC
	},
	counter: {
		name: "Contraataque",
		// Official flavor text: "Devuelve un golpe físico por duplicado."
		desc: "Inflige al último rival que dañó al usuario con un ataque físico este turno el doble del daño recibido; si no perdió PS, inflige 1 PS. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico rival este turno.", // NEEDS QC
		shortDesc: "Devuelve el doble del daño de un ataque físico.", // NEEDS QC
		gen6: {
			desc: "Inflige al último rival que dañó al usuario con un ataque físico este turno el doble del daño recibido; si no perdió PS, inflige daño con potencia 1. Si esa posición está vacía, daña a un rival al azar dentro del alcance. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico rival este turno.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige al último rival que dañó al usuario con un ataque físico este turno el doble del daño recibido. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico rival este turno o si no perdió PS.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige al último rival que dañó al usuario con un ataque físico este turno el doble del daño recibido. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. Poder Oculto cuenta como tipo Normal, y de los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico rival este turno o si no perdió PS.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige al rival el doble de los PS perdidos por el usuario a causa de un ataque físico este turno. Poder Oculto cuenta como tipo Normal, y de los multigolpes solo cuenta el último golpe. Falla si el usuario actúa primero, si no recibió un ataque físico este turno o si no perdió PS. Si el rival usó Fisura o Perforador y falló, este movimiento inflige 65535 puntos de daño.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige al rival el doble del daño infligido por el último movimiento usado en el combate. Ignora las inmunidades de tipo. Falla si el usuario actúa primero, o si el último movimiento del bando rival fue Contraataque, tenía 0 de potencia o no era de tipo Normal o Lucha. Falla si el último movimiento usado por cualquiera de los dos bandos hizo 0 de daño y no era Rayo Confuso, Conversión, Foco Energía, Deslumbrar, Niebla, Drenadoras, Pantalla de Luz, Mimético, Neblina, Gas Venenoso, Polvo Veneno, Recuperación, Reflejo, Descanso, Ovocuración, Salpicadura, Paralizador, Sustituto, Supersónico, Teletransporte, Onda Trueno, Tóxico, Transformación.", // NEEDS QC
			shortDesc: "Devuelve 2x el daño de ataques Normal/Lucha.", // NEEDS QC
		},
	},
	courtchange: {
		name: "Cambio de Cancha",
		// Official flavor text: "Extraño poder que intercambia los efectos en el terreno de combate de ambos bandos."
		desc: "Intercambia entre ambos bandos los efectos de Neblina, Pantalla de Luz, Reflejo, Púas, Velo Sagrado, Viento Afín, Púas Tóxicas, Trampa Rocas, Voto Agua, Voto Fuego, Voto Planta, Red Viscosa, Velo Aurora, Gigatrampa Acero, Gigacañonazo, Gigalianas, Gigallamarada.", // NEEDS QC
		shortDesc: "Intercambia los efectos de campo de ambos bandos.", // NEEDS QC

		activate: "  ¡{POKEMON} ha intercambiado los efectos del terreno de combate!",
	},
	covet: {
		name: "Antojo",
		// Official flavor text: "Se acerca con ternura al objetivo, pero le ataca y le roba el objeto que lleve."
		desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. No puede robar cuando Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradoja o Ogerpon pierdan, respectivamente, Prisma Azul, Prisma Rojo, Gran Diamansfera, Gran Lustresfera, Gran Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada, Escudo Oxidado, Energía Potenciadora o su máscara, ni si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Aquí, los Pokémon Paradoja son todas las especies con las habilidades Paleosíntesis y Carga Cuark, salvo Flamariete, Electrofuria, Ferromole, Ferrotesta. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		shortDesc: "Si no lleva objeto, roba el del objetivo.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada o Escudo Oxidado llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen7: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es un Cristal Z, una megapiedra llevada por la especie que puede megaevolucionar con ella, o Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho o un disco llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen6: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es una megapiedra llevada por la especie que puede megaevolucionar con ella, o Prisma Azul, Prisma Rojo, Griseosfera, una tabla o un cartucho llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen5: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es Carta, o Griseosfera, una tabla o un cartucho llevados, respectivamente, por Giratina, Arceus o Genesect, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen4: {
			desc: "Si acierta y el usuario no lleva objeto, roba el objeto del objetivo. El objeto no se roba si es Carta o Griseosfera, o si el objetivo tiene la habilidad Multitipo o Viscosidad. Los objetos perdidos así no pueden recuperarse con Reciclaje.", // NEEDS QC
		},
		gen3: {
			desc: "Si acierta y el usuario no lleva objeto, roba el objeto del objetivo. El objeto no se roba si es Carta o Baya Enigma, o si el objetivo tiene la habilidad Viscosidad. Los objetos perdidos así no pueden recuperarse con Reciclaje.", // NEEDS QC
		},
	},
	crabhammer: {
		name: "Martillazo",
		// Official flavor text: "Golpea con fuerza con una pinza enorme. Suele asestar un golpe crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	craftyshield: {
		name: "Truco Defensa",
		// Official flavor text: "Usa unos misteriosos poderes para protegerse a sí mismo y a sus aliados de movimientos de estado, pero no de otro tipo de ataques."
		desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos que no causan daño de otros Pokémon, incluidos aliados. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "Protege a los aliados de movimientos de estado.", // NEEDS QC

		start: "  ¡{TEAM} está protegido por Truco Defensa!",
		block: "  ¡{POKEMON} está protegido por Truco Defensa!",
	},
	crosschop: {
		name: "Tajo Cruzado",
		// Official flavor text: "Corte doble que suele propinar un golpe crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	crosspoison: {
		name: "Veneno X",
		// Official flavor text: "Tajo que puede envenenar al objetivo. Suele ser crítico."
		desc: "10% de probabilidad de envenenar al objetivo. Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta prob. de crítico. 10% de envenenar.", // NEEDS QC
	},
	crunch: {
		name: "Triturar",
		// Official flavor text: "Tritura con afilados colmillos y puede bajar la Defensa del objetivo."
		desc: "20% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "20% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
		gen3: {
			desc: "20% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
			shortDesc: "20% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
		},
	},
	crushclaw: {
		name: "Garra Brutal",
		// Official flavor text: "Hace trizas al objetivo con garras afiladas y puede bajar su Defensa."
		desc: "50% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	crushgrip: {
		name: "Agarrón",
		// Official flavor text: "Estruja al objetivo con gran fuerza. Cuantos más PS le queden al objetivo, más fuerte será el ataque."
		desc: "La potencia es 120×(PS actuales del objetivo÷PS máximos del objetivo) (redondeado a la baja desde 0,5, mínimo 1).", // NEEDS QC
		shortDesc: "Más potencia cuantos más PS le queden al objetivo.", // NEEDS QC
		gen4: {
			desc: "La potencia es 120 × (PS actuales del objetivo ÷ PS máximos del objetivo) + 1, redondeado hacia abajo.", // NEEDS QC
		},
	},
	curse: {
		name: "Maldición",
		// Official flavor text: "Un movimiento que tiene efectos distintos si el usuario es de tipo Fantasma o no."
		desc: "Si el usuario no es de tipo Fantasma, baja 1 nivel su Velocidad y sube 1 nivel su Ataque y su Defensa. Si es de tipo Fantasma, pierde la mitad de sus PS máximos (redondeado hacia abajo, aunque se debilite) y el objetivo pierde 1/4 de sus PS máximos (redondeado hacia abajo) al final de cada turno mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Falla si no hay objetivo o si ya está afectado.", // NEEDS QC
		shortDesc: "Maldice si es Fantasma; si no: -1 Vel., +1 Ata. y Def.", // NEEDS QC
		gen4: {
			desc: "Si el usuario no es de tipo Fantasma, baja 1 nivel su Velocidad y sube 1 nivel su Ataque y su Defensa. Si es de tipo Fantasma, pierde la mitad de sus PS máximos (redondeado hacia abajo, incluso si se debilita); a cambio, el objetivo pierde 1/4 de sus PS máximos (redondeado hacia abajo) al final de cada turno mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Falla si no hay objetivo, o si el objetivo ya está afectado o tiene un sustituto.", // NEEDS QC
		},
		gen2: {
			desc: "Si el usuario no es de tipo Fantasma, baja 1 nivel su Velocidad y sube 1 nivel su Ataque y su Defensa, salvo si su Ataque y su Defensa ya están ambos en +6. Si es de tipo Fantasma, pierde la mitad de sus PS máximos (redondeado hacia abajo, incluso si se debilita); a cambio, el objetivo pierde 1/4 de sus PS máximos (redondeado hacia abajo) al final de cada turno mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Falla si el objetivo ya está afectado o tiene un sustituto.", // NEEDS QC
		},

		start: "  ¡{SOURCE} sacrifica algunos PS y maldice a {POKEMON}!",
		damage: "  ¡{POKEMON} es víctima de una maldición!",
	},
	cut: {
		name: "Corte",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	darkestlariat: {
		name: "Lariat Oscuro",
		// Official flavor text: "Gira sobre sí mismo y golpea al oponente con ambos brazos. Ignora los cambios en las características del objetivo."
		desc: "Ignora los cambios de características del objetivo, incluida la evasión.", // NEEDS QC
		shortDesc: "Ignora los cambios de características del objetivo.", // NEEDS QC
	},
	darkpulse: {
		name: "Pulso Umbrío",
		// Official flavor text: "Libera una horrible aura llena de malos pensamientos que puede amedrentar al objetivo."
		desc: "20% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "20% de hacer retroceder al objetivo.", // NEEDS QC
	},
	darkvoid: {
		name: "Brecha Negra",
		// Official flavor text: "El objetivo es enviado a un mundo de tinieblas que lo hace dormir."
		desc: "Duerme al objetivo. Solo puede usarse si la forma actual del usuario (contando Transformación) es Darkrai.", // NEEDS QC
		shortDesc: "Darkrai: duerme a los rivales.", // NEEDS QC
		gen6: {
			desc: "Duerme al objetivo.", // NEEDS QC
			shortDesc: "Duerme a los rivales.", // NEEDS QC
		},

		fail: "Pero no ha podido ponerlo en práctica.",
		failWrongForme: "Pero no ha podido ponerlo en práctica en su forma actual.",
	},
	dazzlinggleam: {
		name: "Brillo Mágico",
		// Official flavor text: "Inflige daño a los oponentes con una potente luz."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	decorate: {
		name: "Decoración",
		// Official flavor text: "Aumenta mucho el Ataque y el Ataque Especial del objetivo al decorarlo."
		desc: "Sube 2 niveles el Ataque y el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "Sube 2 niveles Ataque y At. Esp. del objetivo.", // NEEDS QC
	},
	defendorder: {
		name: "A Defender",
		// Official flavor text: "El usuario llama a sus súbditos para que formen un escudo viviente. Sube la Defensa y la Defensa Especial."
		desc: "Sube 1 nivel la Defensa y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Defensa y Def. Esp. del usuario.", // NEEDS QC
	},
	defensecurl: {
		name: "Rizo Defensa",
		// Official flavor text: "Se enrosca para ocultar sus puntos débiles y aumentar la Defensa."
		desc: "Sube 1 nivel la Defensa del usuario. Mientras siga en combate, la potencia de sus Bola Hielo y Rodar se duplica (efecto no acumulable).", // NEEDS QC
		shortDesc: "Sube 1 nivel Defensa del usuario.", // NEEDS QC
		gen2: {
			desc: "Sube 1 nivel la Defensa del usuario. Mientras siga en combate, la potencia de su Rodar se duplica (efecto no acumulable). Este efecto puede transferirse con Relevo.", // NEEDS QC
		},
		gen1: {
			desc: "Sube 1 nivel la Defensa del usuario.", // NEEDS QC
		},
	},
	defog: {
		name: "Despejar",
		// Official flavor text: "Potente viento que barre el reflejo o la pantalla de luz creada por el objetivo. También puede reducir su Evasión."
		desc: "Baja 1 nivel la evasión del objetivo. Si acierta, se hayan o no reducido, terminan los efectos de Reflejo, Pantalla de Luz, Velo Aurora, Velo Sagrado, Neblina, Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa en el bando del objetivo y los de Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa en el del usuario. Ignora los sustitutos, aunque estos bloquean la bajada de evasión. Si hay un campo activo y el movimiento acierta, también se elimina.", // NEEDS QC
		shortDesc: "-1 evasión; elimina trampas y campos de ambos.", // NEEDS QC
		gen7: {
			desc: "Baja 1 nivel la evasión del objetivo. Si el movimiento acierta, y se haya visto afectada la evasión o no, elimina los efectos de Reflejo, Pantalla de Luz, Velo Aurora, Velo Sagrado, Neblina, Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa del bando del objetivo, y los efectos de Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa del bando del usuario. Ignora el sustituto del objetivo, aunque un sustituto bloquea igualmente la bajada de evasión.", // NEEDS QC
			shortDesc: "-1 evasión; elimina las trampas de ambos bandos.", // NEEDS QC
		},
		gen6: {
			desc: "Baja 1 nivel la evasión del objetivo. Si el movimiento acierta, y se haya visto afectada la evasión o no, elimina los efectos de Reflejo, Pantalla de Luz, Velo Sagrado, Neblina, Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa del bando del objetivo, y los efectos de Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa del bando del usuario. Ignora el sustituto del objetivo, aunque un sustituto bloquea igualmente la bajada de evasión.", // NEEDS QC
		},
		gen5: {
			desc: "Baja 1 nivel la evasión del objetivo. Si el movimiento acierta, y se haya visto afectada la evasión o no, elimina los efectos de Reflejo, Pantalla de Luz, Velo Sagrado, Neblina, Púas, Púas Tóxicas, Trampa Rocas del bando del objetivo. Ignora el sustituto del objetivo, aunque un sustituto bloquea igualmente la bajada de evasión.", // NEEDS QC
			shortDesc: "-1 evasión; elimina trampas y pantallas rivales.", // NEEDS QC
		},
	},
	destinybond: {
		name: "Mismo Destino",
		// Official flavor text: "Si el usuario se debilita por un ataque rival antes de usar otro movimiento, el Pokémon rival se debilitará también. Puede fallar si se usa repetidamente."
		desc: "Hasta la próxima acción del usuario, si un ataque rival lo debilita, ese Pokémon también se debilita, salvo con Deseo Oculto o Premonición. Falla si el usuario lo usó con éxito como su último movimiento (sin contar los usados mediante la habilidad Pareja de Baile).", // NEEDS QC
		shortDesc: "Si un rival lo debilita, ese rival también cae.", // NEEDS QC
		gen6: {
			desc: "Hasta el próximo turno del usuario, si el ataque de un rival lo debilita, ese rival también se debilita, salvo si el ataque era Deseo Oculto o Premonición.", // NEEDS QC
		},
		gen2: {
			desc: "Hasta el próximo turno del usuario, si el ataque de un rival lo debilita, ese rival también se debilita.", // NEEDS QC
		},

		start: "  ¡{POKEMON} intenta que su atacante sufra su mismo destino!",
		activate: "¡{POKEMON} ha conseguido debilitar también a su atacante!",
	},
	detect: {
		name: "Detección",
		// Official flavor text: "Frena todos los ataques, pero puede fallar si se usa repetidamente."
		desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege al usuario de los movimientos este turno.", // NEEDS QC
		gen8: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen7: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen6: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen5: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso. X vuelve a 1 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección, Anticipo, Vasta Guardia. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen4: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso, hasta un máximo de 8. X vuelve a 1 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen3: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene X/65536 de probabilidad de éxito: X empieza en 65535 y se reduce a la mitad (redondeado hacia abajo) con cada uso exitoso. Tras el cuarto éxito seguido, X baja a 118 y luego toma valores aparentemente aleatorios entre 0 y 65535. X vuelve a 65535 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen2: {
			desc: "Protege al usuario de los ataques del rival este turno. Tiene X/255 de probabilidad de éxito: X empieza en 255 y se reduce a la mitad (redondeado hacia abajo) con cada uso exitoso. X vuelve a 255 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario tiene un sustituto o actúa el último este turno.", // NEEDS QC
		},
	},
	devastatingdrake: {
		name: "Dracoaliento Devastador",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	diamondstorm: {
		name: "Tormenta de Diamantes",
		// Official flavor text: "Desata un devastador vendaval de diamantes para dañar a los oponentes. Puede aumentar mucho la Defensa del usuario."
		desc: "50% de probabilidad de subir 2 niveles la Defensa del usuario.", // NEEDS QC
		shortDesc: "50% de subir 2 niveles su Defensa.", // NEEDS QC
		gen6: {
			desc: "50% de probabilidad de subir 1 nivel la Defensa del usuario por cada golpe.", // NEEDS QC
			shortDesc: "50% de subir 1 nivel su Def. por cada golpe.", // NEEDS QC
		},
	},
	dig: {
		name: "Excavar",
		// Official flavor text: "El usuario cava durante el primer turno y ataca en el segundo."
		desc: "Se entierra el primer turno y golpea el segundo. Bajo tierra solo lo alcanzan Terremoto y Magnitud, que le hacen el doble de daño; además, no le afecta el clima. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Se entierra el turno 1 y golpea el turno 2.", // NEEDS QC
		gen4: {
			desc: "Se carga el primer turno y golpea el segundo. Mientras está bajo tierra solo lo alcanzan Terremoto y Magnitud, que le hacen el doble de daño, y no le afecta el clima. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		},
		gen3: {
			desc: "Se carga el primer turno y golpea el segundo. Mientras está bajo tierra solo lo alcanzan Terremoto y Magnitud, que le hacen el doble de daño, y no le afecta el clima.", // NEEDS QC
		},
		gen2: {
			desc: "Se carga el primer turno y golpea el segundo. Mientras está bajo tierra solo lo alcanzan Terremoto, Fisura y Magnitud, no le afecta el clima, y Terremoto y Magnitud le hacen el doble de daño.", // NEEDS QC
		},
		gen1: {
			desc: "Se carga el primer turno y golpea el segundo. Mientras está bajo tierra solo lo alcanzan Venganza, Meteoros y Transformación. Si el usuario queda totalmente paralizado el segundo turno, sigue evitando ataques hasta que se cambie o ejecute con éxito el segundo turno de este movimiento o de Vuelo.", // NEEDS QC
		},

		prepare: "¡{POKEMON} se ha ocultado bajo tierra!",
	},
	direclaw: {
		name: "Garra Nociva",
		desc: "50% de probabilidad de dormir, envenenar o paralizar al objetivo.", // NEEDS QC
		shortDesc: "50% de dormir, envenenar o paralizar.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	disable: {
		name: "Anulación",
		// Official flavor text: "Desactiva el último movimiento del objetivo durante cuatro turnos."
		desc: "Durante 4 turnos, anula el último movimiento usado por el objetivo. Falla si el objetivo ya tiene un movimiento anulado, si no ha usado ninguno, si ya no lo conoce o si fue un movimiento Dinamax o Gigamax.", // NEEDS QC
		shortDesc: "Anula 4 turnos el último movimiento del objetivo.", // NEEDS QC
		gen7: {
			desc: "Durante 4 turnos, anula el último movimiento usado por el objetivo. Falla si un movimiento del objetivo ya está anulado, si el objetivo no ha actuado, si ya no conoce el movimiento o si era un movimiento Z. Los movimientos potenciados con Poder Z pueden seguir eligiéndose y ejecutándose durante el efecto.", // NEEDS QC
		},
		gen6: {
			desc: "Durante 4 turnos, anula el último movimiento usado por el objetivo. Falla si un movimiento del objetivo ya está anulado, si el objetivo no ha actuado o si ya no conoce el movimiento.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 4 a 7 turnos, anula el último movimiento usado por el objetivo. Falla si un movimiento del objetivo ya está anulado, si el objetivo no ha actuado, si ya no conoce el movimiento o si el movimiento tiene 0 PP.", // NEEDS QC
			shortDesc: "Anula el último mov. del objetivo 4-7 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Durante 2 a 5 turnos, anula el último movimiento usado por el objetivo. Falla si un movimiento del objetivo ya está anulado, si el objetivo no ha actuado, si ya no conoce el movimiento o si el movimiento tiene 0 PP.", // NEEDS QC
			shortDesc: "Anula el último mov. del objetivo 2-5 turnos.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 1 a 7 turnos, anula el último movimiento usado por el objetivo. Falla si un movimiento del objetivo ya está anulado, si el objetivo no ha actuado, si ya no conoce el movimiento o si el movimiento tiene 0 PP.", // NEEDS QC
			shortDesc: "Anula el último mov. del objetivo 1-7 turnos.", // NEEDS QC
		},
		gen1: {
			desc: "Durante 0 a 7 turnos, anula al azar uno de los movimientos del objetivo con al menos 1 PP. Falla si un movimiento del objetivo ya está anulado o si ninguno tiene PP. Si algún Pokémon usa Niebla, el efecto termina. Acierte o no, cuenta como golpe a efectos de Furia del rival.", // NEEDS QC
			shortDesc: "Anula un movimiento del objetivo 0-7 turnos.", // NEEDS QC
		},

		start: "  ¡Se ha anulado el movimiento {MOVE} de {POKEMON}!",
		end: "  ¡El movimiento de {POKEMON} ya no está anulado!",
		cant: "¡{POKEMON} no puede usar {MOVE} porque ha sido anulado!",
	},
	disarmingvoice: {
		name: "Voz Cautivadora",
		// Official flavor text: "Obnubila a los oponentes con su fascinante voz y les provoca daños emocionales. Siempre acierta al objetivo."
		desc: "No comprueba la precisión.", // NEEDS QC
		shortDesc: "No comprueba la precisión. Golpea a los rivales.", // NEEDS QC
	},
	discharge: {
		name: "Chispazo",
		// Official flavor text: "Una deslumbradora onda eléctrica afecta a los Pokémon que hay combatiendo alrededor. Puede paralizar."
		desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "30% de paralizar a los Pokémon adyacentes.", // NEEDS QC
	},
	dive: {
		name: "Buceo",
		// Official flavor text: "El usuario se sumerge en el primer turno y ataca en el segundo."
		desc: "Se sumerge el primer turno y golpea el segundo. Bajo el agua solo lo alcanzan Surf y Torbellino, que le hacen el doble de daño; además, no le afecta el clima. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Se sumerge el turno 1 y golpea el turno 2.", // NEEDS QC
		gen4: {
			desc: "Se carga el primer turno y golpea el segundo. Mientras está bajo el agua solo lo alcanzan Surf y Torbellino, que le hacen el doble de daño, y no le afecta el clima. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		},
		gen3: {
			desc: "Se carga el primer turno y golpea el segundo. Mientras está bajo el agua solo lo alcanzan Surf y Torbellino, que le hacen el doble de daño, y no le afecta el clima.", // NEEDS QC
		},

		prepare: "¡{POKEMON} se ha ocultado bajo el agua!",
	},
	dizzypunch: {
		name: "Puño Mareo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "20% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "20% de confundir al objetivo.", // NEEDS QC
		gen1: {
			desc: "Sin efecto adicional.", // NEEDS QC
			shortDesc: "Sin efecto adicional.", // NEEDS QC
		},
	},
	doodle: {
		name: "Decalcomanía",
		desc: "Las habilidades del usuario y de su aliado pasan a ser la del objetivo. No cambia si la del usuario o el aliado es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Modo Daruma, Cambio Heroico o ya coincide. Falla si ambas ya coinciden o si la habilidad del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Evocarrecuerdos, Don Floral, Predicción, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Reacción Química, Paleosíntesis, Carga Cuark, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Calco, Superguarda, Modo Daruma, Cambio Heroico.", // NEEDS QC
		shortDesc: "El usuario y su aliado copian la habilidad del objetivo.", // NEEDS QC
	},
	doomdesire: {
		name: "Deseo Oculto",
		// Official flavor text: "Concentra un haz de luz y ataca dos turnos después."
		desc: "Inflige daño 2 turnos después de usarse. Al final de ese turno, el daño se calcula en ese momento y lo recibe el Pokémon en la posición que tenía el objetivo. Si el usuario ya no está en combate, el daño se calcula con su Ataque Especial, tipos y nivel naturales, sin mejoras de objeto ni habilidad. Falla si este movimiento o Premonición ya están en efecto para esa posición.", // NEEDS QC
		shortDesc: "Golpea dos turnos después de usarse.", // NEEDS QC
		gen4: {
			desc: "Inflige dos turnos después de usarse daño sin tipo que no puede ser crítico. El daño se calcula contra el objetivo al usarse y se inflige al final del último turno al Pokémon que ocupe la posición original del objetivo. Falla si este movimiento o Premonición ya está en curso en esa posición.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha elegido Deseo Oculto para el futuro!",
		activate: "  ¡{TARGET} ha sido alcanzado por Deseo Oculto!",
	},
	doubleedge: {
		name: "Doble Filo",
		// Official flavor text: "Ataque arriesgado que también hiere al agresor."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso del 33% del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso del 33% del daño.", // NEEDS QC
		gen4: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/3 de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "Tiene 1/3 de retroceso.", // NEEDS QC
		},
		gen2: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/4 de los PS perdidos (redondeado hacia abajo, mínimo 1 PS). Si el movimiento golpea a un sustituto, el retroceso siempre es de 1 PS.", // NEEDS QC
			shortDesc: "Retroceso de 1/4 del daño.", // NEEDS QC
		},
		gen1: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/4 de los PS perdidos (redondeado hacia abajo, mínimo 1 PS). Si el movimiento rompe el sustituto del objetivo, el usuario no sufre retroceso.", // NEEDS QC
		},
	},
	doublehit: {
		name: "Doble Golpe",
		// Official flavor text: "Golpea al objetivo dos veces seguidas con la cola u otras partes de su cuerpo."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces en un turno.", // NEEDS QC
		gen4: {
			desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
	},
	doubleironbash: {
		name: "Ferropuño Doble",
		// Official flavor text: "Usando la tuerca del pecho como eje, gira sobre sí mismo y golpea con los brazos dos veces seguidas. Puede amedrentar al rival."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon. Cada golpe tiene un 30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "Golpea 2 veces. 30% de hacer retroceder.", // NEEDS QC
	},
	doublekick: {
		name: "Doble Patada",
		// Official flavor text: "Una patada doble. Golpea dos veces."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces en un turno.", // NEEDS QC
		gen4: {
			desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea 2 veces. El daño se calcula una sola vez para el primer golpe y se repite en ambos. Si el primer golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	doubleshock: {
		name: "Electropalmas",
		desc: "Falla si el usuario no es de tipo Eléctrico. Si acierta y el usuario no está teracristalizado, pierde su tipo Eléctrico mientras siga en combate.", // NEEDS QC
		shortDesc: "Pierde su tipo Eléctrico; debe ser Eléctrico.", // NEEDS QC

		typeChange: "  ¡{POKEMON} ha descargado toda su electricidad!",
	},
	doubleslap: {
		name: "Doble Bofetón",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. El daño se calcula una sola vez para el primer golpe y se repite en cada golpe. Si un golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	doubleteam: {
		name: "Doble Equipo",
		// Official flavor text: "Crea copias de sí mismo para mejorar la Evasión."
		desc: "Sube 1 nivel la evasión del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel evasión del usuario.", // NEEDS QC
	},
	dracometeor: {
		name: "Cometa Draco",
		// Official flavor text: "Hace que grandes cometas caigan del cielo sobre el objetivo. Baja mucho el Ataque Especial del que lo usa."
		desc: "Baja 2 niveles el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 2 niveles At. Esp. del usuario.", // NEEDS QC
	},
	dragonascent: {
		name: "Ascenso Draco",
		// Official flavor text: "El usuario se precipita desde el cielo a una velocidad de vértigo para atacar al objetivo, pero hace que bajen la Defensa y la Defensa Especial del usuario."
		desc: "Baja 1 nivel la Defensa y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Defensa y Def. Esp. del usuario.", // NEEDS QC

		megaNoItem: "  ¡El ruego vehemente de {TRAINER} alcanza a {POKEMON}!",
	},
	dragonbreath: {
		name: "Dragoaliento",
		// Official flavor text: "Poderosa ráfaga de aliento que golpea al objetivo y puede paralizarlo."
		desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "30% de paralizar al objetivo.", // NEEDS QC
	},
	dragoncheer: {
		name: "Bramido Dragón",
		desc: "Sube 1 nivel el índice de golpe crítico de un aliado (2 si es de tipo Dragón). Falla si el usuario no tiene un aliado adyacente o si el aliado ya tiene este efecto o el de Foco Energía. Puede transferirse con Relevo.", // NEEDS QC
		shortDesc: "Aliado: crítico +1 (+2 si es de tipo Dragón).", // NEEDS QC

		start: "#focusenergy",
	},
	dragonclaw: {
		name: "Garra Dragón",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	dragondance: {
		name: "Danza Dragón",
		// Official flavor text: "Danza mística que sube el Ataque y la Velocidad."
		desc: "Sube 1 nivel el Ataque y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Ataque y Velocidad del usuario.", // NEEDS QC
	},
	dragondarts: {
		name: "Dracoflechas",
		// Official flavor text: "El usuario ataca propulsando a ambos Dreepy. En caso de haber dos adversarios, cada Dreepy golpea a su propio objetivo por separado."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon. En combates dobles, intenta golpear una vez al objetivo y otra a su aliado. Si golpear a uno se ve impedido por inmunidad, protección, semiinvulnerabilidad, una habilidad o la precisión, intenta golpear al otro dos veces. Si el movimiento se redirige, golpea dos veces a ese objetivo.", // NEEDS QC
		shortDesc: "Golpea 2 veces. En dobles, una vez a cada rival.", // NEEDS QC
	},
	dragonenergy: {
		name: "Dracoenergía",
		// Official flavor text: "El usuario convierte su fuerza vital en una energía con la que ataca al objetivo. Cuantos menos PS tenga el usuario, menor será la potencia del movimiento."
		desc: "La potencia es (PS actuales del usuario×150÷PS máximos del usuario) (redondeado hacia abajo, mínimo 1).", // NEEDS QC
		shortDesc: "Menos potencia con menos PS. Golpea a los rivales.", // NEEDS QC
	},
	dragonhammer: {
		name: "Martillo Dragón",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	dragonpulse: {
		name: "Pulso Dragón",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	dragonrage: {
		name: "Furia Dragón",
		shortDesc: "Inflige 40 PS de daño al objetivo.", // NEEDS QC
	},
	dragonrush: {
		name: "Carga Dragón",
		// Official flavor text: "Ataca de forma brutal mientras intimida al objetivo. También puede amedrentarlo."
		desc: "20% de probabilidad de hacer retroceder al objetivo. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "20% de hacer retroceder al objetivo.", // NEEDS QC
		gen5: {
			desc: "20% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		},
	},
	dragontail: {
		name: "Cola Dragón",
		// Official flavor text: "Ataca al objetivo y lo obliga a cambiarse por otro Pokémon. Si es uno salvaje, acaba el combate."
		desc: "Si ni el usuario ni el objetivo se han debilitado, obliga al objetivo a cambiarse por un aliado sano al azar. Este efecto falla si el objetivo usó Arraigo, tiene la habilidad Ventosas o el movimiento golpeó un sustituto.", // NEEDS QC
		shortDesc: "Obliga al objetivo a cambiarse por un aliado al azar.", // NEEDS QC
	},
	drainingkiss: {
		name: "Beso Drenaje",
		// Official flavor text: "El usuario absorbe PS del objetivo con un beso y restaura su propia energía en una cantidad igual o superior a la mitad del daño infligido."
		desc: "El usuario recupera 3/4 del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera 3/4 del daño infligido.", // NEEDS QC
	},
	drainpunch: {
		name: "Puño Drenaje",
		// Official flavor text: "Un golpe que drena energía. El Pokémon recupera la mitad de los PS arrebatados al objetivo."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja). Si el usuario lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja).", // NEEDS QC
		},
	},
	dreameater: {
		name: "Comesueños",
		// Official flavor text: "Restaura al usuario la mitad del daño causado a un objetivo dormido."
		desc: "Solo afecta a objetivos dormidos. El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "Solo contra dormidos. Recupera la mitad del daño.", // NEEDS QC
		gen4: {
			desc: "Solo afecta al objetivo si está dormido y no tiene sustituto. El usuario recupera la mitad de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado hacia abajo).", // NEEDS QC
		},
		gen3: {
			desc: "Solo afecta al objetivo si está dormido y no tiene sustituto. El usuario recupera la mitad de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		},
		gen1: {
			desc: "Solo afecta al objetivo si está dormido. El usuario recupera la mitad de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS). Si el movimiento rompe el sustituto del objetivo, el usuario no recupera PS.", // NEEDS QC
		},
	},
	drillpeck: {
		name: "Pico Taladro",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	drillrun: {
		name: "Taladradora",
		// Official flavor text: "El usuario golpea usando su cuerpo como un taladro. Suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	drumbeating: {
		name: "Batería Asalto",
		// Official flavor text: "El usuario controla un tocón mediante la percusión y al atacar reduce la Velocidad del objetivo."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
	},
	dualchop: {
		name: "Golpe Bis",
		// Official flavor text: "Golpea dos veces seguidas con las partes más recias de su cuerpo."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces en un turno.", // NEEDS QC
	},
	dualwingbeat: {
		name: "Ala Bis",
		// Official flavor text: "Ataca al adversario golpeándolo dos veces con las alas."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces en un turno.", // NEEDS QC
	},
	dynamaxcannon: {
		name: "Cañón Dinamax",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
		gen8: {
			shortDesc: "Doble de daño contra objetivos dinamaxizados.", // NEEDS QC
		},
	},
	dynamicpunch: {
		name: "Puño Dinámico",
		// Official flavor text: "Puñetazo con toda la fuerza concentrada. Causa confusión si atina."
		desc: "100% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "100% de confundir al objetivo.", // NEEDS QC
	},
	earthpower: {
		name: "Tierra Viva",
		// Official flavor text: "La tierra a los pies del objetivo erupciona violentamente. Puede disminuir la Defensa Especial del objetivo."
		desc: "10% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	earthquake: {
		name: "Terremoto",
		// Official flavor text: "Un terremoto que afecta a todos los Pokémon que estén a su alrededor."
		desc: "El daño se duplica contra objetivos que estén usando Excavar.", // NEEDS QC
		shortDesc: "Golpea a los adyacentes. Doble daño contra Excavar.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica si el objetivo está usando Excavar.", // NEEDS QC
			shortDesc: "Golpea a los adyacentes. Doble potencia contra Excavar.", // NEEDS QC
		},
		gen1: {
			desc: "Sin efecto adicional.", // NEEDS QC
			shortDesc: "Sin efecto adicional.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Doble potencia contra Excavar.", // NEEDS QC
		},
	},
	echoedvoice: {
		name: "Eco Voz",
		// Official flavor text: "Un susurro que aumenta de potencia conforme el usuario y otros Pokémon lo van utilizando."
		desc: "Por cada turno consecutivo en que al menos un Pokémon use este movimiento, su potencia se multiplica por el número de turnos transcurridos (máximo 5).", // NEEDS QC
		shortDesc: "Más potencia si se usa turnos seguidos.", // NEEDS QC
	},
	eerieimpulse: {
		name: "Onda Anómala",
		// Official flavor text: "El usuario irradia unas raras ondas que, al alcanzar a un oponente, hacen que disminuya mucho su Ataque Especial."
		desc: "Baja 2 niveles el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles At. Esp. del objetivo.", // NEEDS QC
	},
	eeriespell: {
		name: "Conjuro Funesto",
		// Official flavor text: "El usuario ataca con un poder psíquico de inmensa potencia y elimina 3 PP del último movimiento que haya usado el objetivo."
		desc: "Si acierta y el usuario no se ha debilitado, el objetivo pierde 3 PP de su último movimiento.", // NEEDS QC
		shortDesc: "Resta 3 PP al último movimiento del objetivo.", // NEEDS QC

		activate: "#spite",
	},
	eggbomb: {
		name: "Bomba Huevo",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	electricterrain: {
		name: "Campo Eléctrico",
		// Official flavor text: "Durante cinco turnos, se potencian los movimientos de tipo Eléctrico y los Pokémon que están en contacto con el suelo no pueden quedarse dormidos."
		desc: "Durante 5 turnos, se activa el campo eléctrico: la potencia de los ataques de tipo Eléctrico de los Pokémon en el suelo se multiplica por 1,3 y estos no pueden dormirse (los ya dormidos no despiertan). Los Pokémon en el suelo no pueden verse afectados por Bostezo ni dormirse por su efecto. Camuflaje vuelve al usuario de tipo Eléctrico, Adaptación pasa a ser Rayo y Daño Secreto tiene un 30% de causar parálisis. Falla si ya hay campo eléctrico.", // NEEDS QC
		shortDesc: "5 turnos: potencia Eléctrico, nadie duerme en el suelo.", // NEEDS QC
		gen7: {
			desc: "Durante 5 turnos se activa un campo eléctrico. Mientras dura, la potencia de los ataques de tipo Eléctrico de los Pokémon en el suelo se multiplica por 1,5, y estos no pueden dormirse; los ya dormidos no despiertan. Los Pokémon en el suelo no pueden verse afectados por Bostezo ni dormirse por su efecto. Camuflaje convierte al usuario en tipo Eléctrico, Adaptación pasa a ser Rayo y Daño Secreto tiene un 30% de probabilidad de paralizar. Falla si ya hay un campo eléctrico.", // NEEDS QC
		},
	},
	electrify: {
		name: "Electrificación",
		// Official flavor text: "Si el objetivo queda electrificado antes de usar un movimiento, este será de tipo Eléctrico."
		desc: "El movimiento del objetivo pasa a ser de tipo Eléctrico este turno. Entre los efectos que cambian el tipo de un movimiento, este se aplica el último. Falla si el objetivo ya actuó este turno.", // NEEDS QC
		shortDesc: "El movimiento del objetivo es Eléctrico este turno.", // NEEDS QC

		start: "  ¡Electrificación hace que el siguiente movimiento de {POKEMON} sea de tipo Eléctrico!",
	},
	electroball: {
		name: "Bola Voltio",
		// Official flavor text: "Lanza una bola eléctrica. Cuanto mayor sea la Velocidad del usuario en comparación con la del objetivo, mayor será el daño causado."
		desc: "La potencia depende de (Velocidad actual del usuario÷Velocidad actual del objetivo) (redondeado hacia abajo): 150 si es 4 o más, 120 si es 3, 80 si es 2, 60 si es 1 y 40 si es menor que 1. Si la Velocidad actual del objetivo es 0, la potencia es 40.", // NEEDS QC
		shortDesc: "Más potencia cuanto más rápido sea que el objetivo.", // NEEDS QC
		gen5: {
			desc: "La potencia depende de (Velocidad actual del usuario ÷ Velocidad actual del objetivo), redondeado hacia abajo. Es 150 si el resultado es 4 o más, 120 si es 3, 80 si es 2, 60 si es 1 y 40 si es menos de 1. Si la Velocidad actual del objetivo es 0, se trata como 1.", // NEEDS QC
		},
	},
	electrodrift: {
		name: "Electroderrape",
		desc: "El daño se multiplica por 1,3333 si el movimiento es supereficaz contra el objetivo.", // NEEDS QC
		shortDesc: "Inflige 1,3333x de daño si es supereficaz.", // NEEDS QC
	},
	electroshot: {
		name: "Electrorrayo",
		desc: "Carga el primer turno y golpea el segundo; al cargar, sube 1 nivel el Ataque Especial del usuario. Con Hierba Única, o si llueve o hay diluvio, ataca en 1 turno. Con Parasol Multiuso, necesita el turno de carga aunque llueva o haya diluvio.", // NEEDS QC
		shortDesc: "+1 At. Esp. y golpea el turno 2. Con lluvia: directo.", // NEEDS QC

		prepare: "¡{POKEMON} está acumulando electricidad!",
	},
	electroweb: {
		name: "Electrotela",
		// Official flavor text: "Atrapa y ataca a los objetivos con una telaraña eléctrica. También reduce su Velocidad."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel la Velocidad de los rivales.", // NEEDS QC
	},
	embargo: {
		name: "Embargo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Durante 5 turnos, el objeto del objetivo no tiene efecto. Los efectos de cambio de forma se mantienen, pero el resto queda anulado. Durante el efecto, el objetivo no puede usar Lanzamiento ni Don Natural. Los objetos lanzados con Lanzamiento sí le hacen efecto. Si el objetivo usa Relevo, el sustituto sigue sin poder usar objetos.", // NEEDS QC
		shortDesc: "5 turnos: el objeto del objetivo no tiene efecto.", // NEEDS QC

		start: "  ¡{POKEMON} no puede usar objetos!",
		end: "  ¡{POKEMON} ya puede usar objetos de nuevo!",
	},
	ember: {
		name: "Ascuas",
		// Official flavor text: "Ataca con llamas pequeñas que pueden causar quemaduras."
		desc: "10% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "10% de quemar al objetivo.", // NEEDS QC
	},
	encore: {
		name: "Otra Vez",
		// Official flavor text: "El objetivo repite su último movimiento durante tres turnos."
		desc: "Durante 3 turnos, el objetivo repite su último movimiento usado. El efecto termina si el movimiento se queda sin PP. Falla si el objetivo ya está afectado, si no ha usado ningún movimiento, si el movimiento tiene 0 PP o si es Ayuda, Pirochoque, Pugnachoque, Copión, Cañón Dinamax, Otra Vez, Feerichoque, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Ponzochoque, Esquema, Sonámbulo, Forcejeo, Transformación, Ominochoque.", // NEEDS QC
		shortDesc: "El objetivo repite su último movimiento 3 turnos.", // NEEDS QC
		gen8: {
			desc: "Durante sus próximos 3 turnos, el objetivo repite su último movimiento usado. Si el movimiento se queda sin PP, el efecto termina. Falla si el objetivo ya está bajo este efecto, si no ha actuado, si el movimiento tiene 0 PP, si el objetivo está dinamaxizado, o si el movimiento es Ayuda, Copión, Cañón Dinamax, Otra Vez, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Esquema, Sonámbulo, Forcejeo, Transformación.", // NEEDS QC
		},
		gen7: {
			desc: "Durante sus próximos 3 turnos, el objetivo repite su último movimiento usado. Si el movimiento se queda sin PP, el efecto termina. Falla si el objetivo ya está bajo este efecto, si no ha actuado, si el movimiento tiene 0 PP, o si el movimiento es Ayuda, Copión, Otra Vez, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Esquema, Sonámbulo, Forcejeo, Transformación o un movimiento Z. Los movimientos potenciados con Poder Z pueden seguir eligiéndose y ejecutándose durante el efecto.", // NEEDS QC
		},
		gen6: {
			desc: "Durante 3 turnos, el objetivo repite su último movimiento usado. Si el movimiento se queda sin PP, el efecto termina. Falla si el objetivo ya está bajo este efecto, si no ha actuado, si el movimiento tiene 0 PP, o si el movimiento es Otra Vez, Mimético, Espejo, Esquema, Forcejeo, Transformación.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 4 a 8 turnos, el objetivo repite su último movimiento usado. Si el movimiento se queda sin PP, el efecto termina. Falla si el objetivo ya está bajo este efecto, si no ha actuado, si el movimiento tiene 0 PP, o si el movimiento es Otra Vez, Mimético, Espejo, Esquema, Forcejeo, Transformación.", // NEEDS QC
			shortDesc: "El objetivo repite su último mov. 4-8 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Durante 3 a 6 turnos, el objetivo repite su último movimiento usado. Si el movimiento se queda sin PP, el efecto termina. Falla si el objetivo ya está bajo este efecto, si no ha actuado, si el movimiento tiene 0 PP, o si el movimiento es Otra Vez, Mimético, Espejo, Esquema, Forcejeo, Transformación.", // NEEDS QC
			shortDesc: "El objetivo repite su último mov. 3-6 turnos.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 3 a 6 turnos, el objetivo repite su último movimiento usado. Si el movimiento se queda sin PP, el efecto termina. Falla si el objetivo ya está bajo este efecto, si no ha actuado, si el movimiento tiene 0 PP, o si el movimiento es Otra Vez, Metrónomo, Mimético, Espejo, Esquema, Sonámbulo, Forcejeo, Transformación.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha sufrido los efectos de Otra Vez!",
		end: "  ¡{POKEMON} ya no sufre los efectos de Otra Vez!",
	},
	endeavor: {
		name: "Esfuerzo",
		// Official flavor text: "Reduce los PS del objetivo para que igualen a los del atacante."
		desc: "Reduce los PS del objetivo en (PS actuales del objetivo−PS actuales del usuario). No afecta si los PS del objetivo son iguales o inferiores a los del usuario.", // NEEDS QC
		shortDesc: "Reduce los PS del objetivo hasta igualar los suyos.", // NEEDS QC
	},
	endure: {
		name: "Aguante",
		// Official flavor text: "Resiste cualquier ataque y deja al menos 1 PS. Puede fallar si se usa repetidamente."
		desc: "Este turno, el usuario sobrevive a los ataques de otros Pokémon con al menos 1 PS. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Sobrevive a los ataques de este turno con 1 PS.", // NEEDS QC
		gen8: {
			desc: "El usuario resiste los ataques de otros Pokémon este turno con al menos 1 PS. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen7: {
			desc: "El usuario resiste los ataques de otros Pokémon este turno con al menos 1 PS. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen6: {
			desc: "El usuario resiste los ataques de otros Pokémon este turno con al menos 1 PS. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario resiste los ataques de otros Pokémon este turno con al menos 1 PS. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso. X vuelve a 1 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección, Anticipo, Vasta Guardia. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario resiste los ataques de otros Pokémon este turno con al menos 1 PS. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso, hasta un máximo de 8. X vuelve a 1 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario resiste los ataques de otros Pokémon este turno con al menos 1 PS. Tiene X/65536 de probabilidad de éxito: X empieza en 65535 y se reduce a la mitad (redondeado hacia abajo) con cada uso exitoso. Tras el cuarto éxito seguido, X baja a 118 y luego toma valores aparentemente aleatorios entre 0 y 65535. X vuelve a 65535 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen2: {
			desc: "El usuario resiste los ataques del rival este turno con al menos 1 PS. Tiene X/255 de probabilidad de éxito: X empieza en 255 y se reduce a la mitad (redondeado hacia abajo) con cada uso exitoso. X vuelve a 255 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario tiene un sustituto o actúa el último este turno.", // NEEDS QC
		},

		start: "  ¡{POKEMON} se prepara para resistir los ataques!",
		activate: "  ¡{POKEMON} ha aguantado el golpe!",
	},
	energyball: {
		name: "Energibola",
		// Official flavor text: "Aúna fuerzas de la naturaleza y libera su ataque. Puede disminuir la Defensa Especial del objetivo."
		desc: "10% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	entrainment: {
		name: "Danza Amiga",
		// Official flavor text: "Una extraña danza que hace que el usuario y el objetivo tengan la misma habilidad."
		desc: "La habilidad del objetivo pasa a ser la del usuario. Falla si la habilidad del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Ausente, Modo Daruma, Cambio Heroico o la misma que la del usuario, o si la del usuario es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Don Floral, Predicción, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Reacción Química, Paleosíntesis, Carga Cuark, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Calco, Superguarda, Modo Daruma, Cambio Heroico o Evocarrecuerdos.", // NEEDS QC
		shortDesc: "La habilidad del objetivo pasa a ser la del usuario.", // NEEDS QC
		gen8: {
			desc: "La habilidad del objetivo pasa a ser la misma que la del usuario. Falla si la habilidad del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Ausente, Modo Daruma o la misma que la del usuario, o si la habilidad del usuario es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Tragamisil, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "La habilidad del objetivo pasa a ser la misma que la del usuario. Falla si la habilidad del objetivo es Fuerte Afecto, Letargo Perenne, Disfraz, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Ausente, Modo Daruma o la misma que la del usuario, o si la habilidad del usuario es Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Ilusión, Impostor, Multitipo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Modo Daruma.", // NEEDS QC
		},
		gen6: {
			desc: "La habilidad del objetivo pasa a ser la misma que la del usuario. Falla si la habilidad del objetivo es Multitipo, Cambio Táctico, Ausente o la misma que la del usuario, o si la habilidad del usuario es Don Floral, Predicción, Ilusión, Impostor, Multitipo, Cambio Táctico, Calco, Modo Daruma.", // NEEDS QC
		},
		gen5: {
			desc: "La habilidad del objetivo pasa a ser la misma que la del usuario. Falla si la habilidad del objetivo es Multitipo, Ausente o la misma que la del usuario, o si la habilidad del usuario es Don Floral, Predicción, Ilusión, Impostor, Multitipo, Calco, Modo Daruma.", // NEEDS QC
		},
	},
	eruption: {
		name: "Estallido",
		// Official flavor text: "Furia explosiva. Cuanto menor sea el número de PS del usuario, menos daño hará el ataque."
		desc: "La potencia es (PS actuales del usuario×150÷PS máximos del usuario) (redondeado hacia abajo, mínimo 1).", // NEEDS QC
		shortDesc: "Menos potencia con menos PS. Golpea a los rivales.", // NEEDS QC
	},
	esperwing: {
		name: "Ala Aural",
		desc: "100% de probabilidad de subir 1 nivel la Velocidad del usuario. Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "100% de +1 Velocidad. Alta prob. de crítico.", // NEEDS QC
	},
	eternabeam: {
		name: "Rayo Infinito",
		// Official flavor text: "Este es el mayor ataque de Eternatus una vez adquirida su forma original. No puede moverse en el turno siguiente."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	expandingforce: {
		name: "Vasta Fuerza",
		// Official flavor text: "El usuario ataca al objetivo con sus poderes psíquicos. Cuando se usa en conjunción con un campo psíquico, aumenta su potencia e inflige daño a todos los rivales."
		desc: "Si hay campo psíquico y el usuario está en el suelo, golpea a todos los rivales y su potencia se multiplica por 1,5.", // NEEDS QC
		shortDesc: "En campo psíquico: 1,5x y golpea a los rivales.", // NEEDS QC
	},
	explosion: {
		name: "Explosión",
		// Official flavor text: "El atacante causa una grandísima explosión y hiere a todos a su alrededor. El usuario se debilita de inmediato."
		desc: "El usuario se debilita tras usarlo, incluso si falla por no haber objetivo. No puede ejecutarse si algún Pokémon en combate tiene la habilidad Humedad.", // NEEDS QC
		shortDesc: "Golpea a los adyacentes. El usuario se debilita.", // NEEDS QC
		gen4: {
			desc: "El usuario se debilita tras usar este movimiento, salvo si no tiene objetivo. La Defensa del objetivo se reduce a la mitad durante el cálculo del daño. Este movimiento no se ejecuta si hay en combate un Pokémon con la habilidad Humedad.", // NEEDS QC
			shortDesc: "Mitad de Def. del objetivo al calcular. Se debilita.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario se debilita tras usar este movimiento. La Defensa del objetivo se reduce a la mitad durante el cálculo del daño. Este movimiento no se ejecuta si hay en combate un Pokémon con la habilidad Humedad.", // NEEDS QC
		},
		gen2: {
			desc: "El usuario se debilita tras usar este movimiento. La Defensa del objetivo se reduce a la mitad durante el cálculo del daño.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario se debilita tras usar este movimiento, salvo si rompió el sustituto del objetivo. La Defensa del objetivo se reduce a la mitad durante el cálculo del daño.", // NEEDS QC
		},
	},
	extrasensory: {
		name: "Paranormal",
		// Official flavor text: "Emite una energía muy extraña que puede amedrentar al objetivo."
		desc: "10% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "10% de hacer retroceder al objetivo.", // NEEDS QC
		gen3: {
			desc: "10% de probabilidad de amedrentar al objetivo. El daño se duplica si el objetivo usó Reducción desde que está en combate.", // NEEDS QC
		},
	},
	extremeevoboost: {
		name: "Novena Potencia",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Sube 2 niveles el Ataque, la Defensa, el Ataque Especial, la Defensa Especial y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles todas las características del usuario.", // NEEDS QC
	},
	extremespeed: {
		name: "Velocidad Extrema",
		// Official flavor text: "Ataque de una velocidad extrema. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Casi siempre actúa primero (prioridad +2).", // NEEDS QC
		gen4: {
			shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
		},
	},
	facade: {
		name: "Fachada",
		// Official flavor text: "Si el usuario está quemado, paralizado o envenenado, ataca con el doble de potencia."
		desc: "La potencia se duplica si el usuario está quemado, paralizado o envenenado. También se ignora la reducción de daño físico de la quemadura.", // NEEDS QC
		shortDesc: "Potencia doble con quemadura, parálisis o veneno.", // NEEDS QC
		gen5: {
			desc: "La potencia se duplica si el usuario está quemado, paralizado o envenenado.", // NEEDS QC
		},
	},
	fairylock: {
		name: "Cerrojo Feérico",
		// Official flavor text: "Consigue que ningún Pokémon pueda huir en el siguiente turno echando un cerrojo."
		desc: "El próximo turno, ningún Pokémon en combate podrá cambiarse. Pueden cambiarse igualmente los que lleven Muda Concha o usen Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. Falla si el efecto ya está activo.", // NEEDS QC
		shortDesc: "Nadie puede cambiarse el próximo turno.", // NEEDS QC
		gen7: {
			desc: "El próximo turno, ningún Pokémon activo puede cambiarse. Un Pokémon puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Falla si el efecto ya está activo.", // NEEDS QC
		},

		activate: "  Nadie podrá huir durante el próximo turno.",
	},
	fairywind: {
		name: "Viento Feérico",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	fakeout: {
		name: "Sorpresa",
		// Official flavor text: "Amedrenta al objetivo con este movimiento de prioridad alta. Solo sirve en el primer turno."
		desc: "100% de probabilidad de hacer retroceder al objetivo. Falla si no es el primer turno del usuario en combate.", // NEEDS QC
		shortDesc: "Actúa primero y hace retroceder. Solo el primer turno.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	faketears: {
		name: "Llanto Falso",
		// Official flavor text: "Lágrimas de cocodrilo que bajan mucho la Defensa Especial del objetivo."
		desc: "Baja 2 niveles la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles Def. Esp. del objetivo.", // NEEDS QC
	},
	falsesurrender: {
		name: "Irreverencia",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	falseswipe: {
		name: "Falso Tortazo",
		// Official flavor text: "Ataque moderado que no debilita al objetivo y le deja al menos 1 PS."
		desc: "Deja al objetivo con al menos 1 PS.", // NEEDS QC
		shortDesc: "Siempre deja al objetivo con al menos 1 PS.", // NEEDS QC
	},
	featherdance: {
		name: "Danza Pluma",
		// Official flavor text: "Envuelve al objetivo con un manto de plumas para reducir mucho su Ataque."
		desc: "Baja 2 niveles el Ataque del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles Ataque del objetivo.", // NEEDS QC
	},
	feint: {
		name: "Amago",
		// Official flavor text: "Permite golpear a objetivos que han utilizado movimientos como Protección o Detección y anula sus efectos."
		desc: "Si acierta, rompe este turno la protección de Búnker, Detección, Escudo Real, Protección, Barrera Espinosa del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad. Si el bando del objetivo está protegido por Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia, esa protección también se rompe este turno.", // NEEDS QC
		shortDesc: "Anula Detección, Protección y las guardias.", // NEEDS QC
		gen6: {
			desc: "Si acierta, rompe Detección, Escudo Real, Protección o Barrera Espinosa del objetivo este turno, permitiendo a los demás Pokémon atacarlo con normalidad. Si el bando del objetivo está protegido por Truco Defensa, Escudo Tatami, Anticipo o Vasta Guardia, esa protección también se rompe este turno.", // NEEDS QC
		},
		gen5: {
			desc: "Si acierta, rompe Detección o Protección del objetivo este turno, permitiendo a los demás Pokémon atacarlo con normalidad. Si el objetivo es un rival y su bando está protegido por Anticipo o Vasta Guardia, esa protección también se rompe este turno.", // NEEDS QC
		},
		gen4: {
			desc: "Falla salvo que el objetivo esté usando Detección o Protección. Si acierta, rompe esa protección este turno, permitiendo a los demás Pokémon atacar al objetivo con normalidad.", // NEEDS QC
			shortDesc: "Rompe la protección; si no hay protección, falla.", // NEEDS QC
		},

		activate: "  ¡{TARGET} se ha dejado engañar por Amago!",
	},
	feintattack: {
		name: "Finta",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	fellstinger: {
		name: "Aguijón Letal",
		// Official flavor text: "Si se derrota al objetivo utilizando este movimiento, aumenta muchísimo el Ataque del usuario."
		desc: "Sube 3 niveles el Ataque del usuario si este movimiento debilita al objetivo.", // NEEDS QC
		shortDesc: "+3 Ataque si debilita al objetivo.", // NEEDS QC
		gen6: {
			desc: "Sube 2 niveles el Ataque del usuario si este movimiento debilita al objetivo.", // NEEDS QC
			shortDesc: "+2 Ataque si este movimiento debilita al objetivo.", // NEEDS QC
		},
	},
	ficklebeam: {
		name: "Láser Veleidoso",
		shortDesc: "30% de duplicar su potencia.", // NEEDS QC

		activate: "  ¡{POKEMON} lo ha dado todo!",
	},
	fierydance: {
		name: "Danza Llama",
		// Official flavor text: "Envuelve en llamas y daña al objetivo. Puede aumentar el Ataque Especial de quien lo usa."
		desc: "50% de probabilidad de subir 1 nivel el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "50% de subir 1 nivel At. Esp. del usuario.", // NEEDS QC
	},
	fierywrath: {
		name: "Furia Candente",
		// Official flavor text: "El usuario convierte su ira en un aura flamígera para lanzar su ataque. Puede amedrentar al objetivo."
		desc: "20% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "20% de hacer retroceder al objetivo.", // NEEDS QC
	},
	filletaway: {
		name: "Deslome",
		desc: "Sube 2 niveles el Ataque, el Ataque Especial y la Velocidad del usuario a cambio de la mitad de sus PS máximos (redondeado hacia abajo). Falla si el usuario se debilitaría o si ninguna de esas características puede cambiar.", // NEEDS QC
		shortDesc: "+2 Ataque, At. Esp. y Vel. a cambio de la mitad de PS.", // NEEDS QC
	},
	finalgambit: {
		name: "Sacrificio",
		// Official flavor text: "El usuario se sacrifica causándole un daño al objetivo equivalente a sus propios PS perdidos."
		desc: "Inflige al objetivo un daño igual a los PS actuales del usuario. Si acierta, el usuario se debilita.", // NEEDS QC
		shortDesc: "Inflige sus PS actuales como daño y se debilita.", // NEEDS QC
	},
	fireblast: {
		name: "Llamarada",
		// Official flavor text: "Llama intensa que chamusca y puede causar quemaduras."
		desc: "10% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "10% de quemar al objetivo.", // NEEDS QC
		gen1: {
			desc: "30% de probabilidad de quemar al objetivo.", // NEEDS QC
			shortDesc: "30% de quemar al objetivo.", // NEEDS QC
		},
	},
	firefang: {
		name: "Colmillo Ígneo",
		// Official flavor text: "El usuario muerde al objetivo con colmillos en llamas y puede hacer que se amedrente o sufra quemaduras."
		desc: "10% de probabilidad de quemar al objetivo y 10% de hacerlo retroceder.", // NEEDS QC
		shortDesc: "10% de quemar. 10% de hacer retroceder.", // NEEDS QC
		gen4: {
			desc: "10% de probabilidad de quemar al objetivo y 10% de amedrentarlo. Este movimiento puede golpear a los Pokémon con la habilidad Superguarda sea cual sea su tipo.", // NEEDS QC
		},
	},
	firelash: {
		name: "Látigo Ígneo",
		// Official flavor text: "Golpea al oponente con un látigo incandescente y reduce su Defensa."
		desc: "100% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	firepledge: {
		name: "Voto Fuego",
		// Official flavor text: "Ataca con columnas de fuego. Combinado con Voto Planta, crea un mar de llamas y aumenta su potencia."
		desc: "Si un aliado eligió Voto Planta o Voto Agua este turno y aún no ha actuado, actúa justo después del usuario y el movimiento del usuario no hace nada. Combinado con Voto Planta, el aliado usa Voto Fuego con 150 de potencia y un mar de fuego aparece en el bando rival durante 4 turnos: los Pokémon que no sean de tipo Fuego pierden 1/8 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último. Combinado con Voto Agua, el aliado usa Voto Agua con 150 de potencia y un arcoíris aparece en el bando del usuario durante 4 turnos: duplica la probabilidad de los efectos secundarios (se acumula con la habilidad Dicha, salvo para el retroceso, que solo se duplica una vez). Como movimiento combinado recibe STAB sin importar el tipo del usuario. No consume Gema Fuego.", // NEEDS QC
		shortDesc: "Combínalo con los otros votos para efectos extra.", // NEEDS QC

		activate: "#waterpledge",
		start: "  ¡{TEAM:capitalize} se ve rodeado por un mar de llamas!",
		end: "  El mar de llamas que rodeaba a {TEAM} ha desaparecido.",
		damage: "  ¡{POKEMON} ha resultado herido por un mar de llamas!",
	},
	firepunch: {
		name: "Puño Fuego",
		// Official flavor text: "Puñetazo ardiente que puede causar quemaduras."
		desc: "10% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "10% de quemar al objetivo.", // NEEDS QC
	},
	firespin: {
		name: "Giro Fuego",
		// Official flavor text: "Un aro de fuego que atrapa al objetivo de cuatro a cinco turnos."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (1/8 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos (siempre 5 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
			shortDesc: "Atrapa y daña al objetivo durante 2-5 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si usa Relevo. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario pasa de 2 a 5 turnos usando este movimiento: 3/8 de probabilidad de que dure 2 o 3 turnos y 1/8 de que dure 4 o 5. El daño calculado el primer turno se repite en los demás. El usuario no puede elegir movimiento y el objetivo no puede ejecutar movimientos durante el efecto, pero ambos pueden cambiarse. Si el usuario se cambia, el objetivo sigue sin poder actuar ese turno. Si el objetivo se cambia, el usuario vuelve a usar este movimiento automáticamente, y si entonces tenía 0 PP, pasan a 63. Si alguno se cambia o el usuario no puede actuar, el efecto termina. Este movimiento puede impedir actuar al objetivo aunque tenga inmunidad de tipo, pero entonces no inflige daño.", // NEEDS QC
			shortDesc: "El objetivo no puede actuar durante 2-5 turnos.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha quedado atrapado en un torbellino de fuego!",
		move: "#wrap",
	},
	firstimpression: {
		name: "Escaramuza",
		// Official flavor text: "Movimiento de gran potencia que solo puede usarse en el turno en que el usuario sale al combate."
		desc: "Falla si no es el primer turno del usuario en combate.", // NEEDS QC
		shortDesc: "Casi siempre actúa primero. Solo el primer turno.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	fishiousrend: {
		name: "Branquibocado",
		// Official flavor text: "El usuario agarra al objetivo con sus duras branquias. En caso de atacar antes que este último, la potencia del movimiento se duplica."
		desc: "La potencia se duplica si el usuario actúa antes que el objetivo.", // NEEDS QC
		shortDesc: "Potencia doble si actúa antes que el objetivo.", // NEEDS QC
	},
	fissure: {
		name: "Fisura",
		// Official flavor text: "Abre una grieta en el suelo y mete al objetivo en ella. Fulmina en un golpe."
		desc: "Debilita al objetivo de un golpe (daño igual a sus PS máximos). Ignora los cambios de precisión y evasión. Su precisión es (nivel del usuario−nivel del objetivo+30)% y falla si el objetivo tiene mayor nivel. Los Pokémon con la habilidad Robustez son inmunes.", // NEEDS QC
		shortDesc: "Debilita de un golpe. Falla contra niveles mayores.", // NEEDS QC
		gen2: {
			desc: "Inflige 65535 puntos de daño al objetivo. La precisión de este movimiento sobre 256 es el menor de (2 × (nivel del usuario − nivel del objetivo) + 76) y 255, antes de aplicar los modificadores de precisión y evasión. Falla si el objetivo es de nivel superior. Puede golpear a un objetivo que use Excavar.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige 65535 puntos de daño al objetivo. Falla si la Velocidad del objetivo es mayor que la del usuario.", // NEEDS QC
			shortDesc: "65535 de daño. Falla si el objetivo es más rápido.", // NEEDS QC
		},
	},
	flail: {
		name: "Azote",
		// Official flavor text: "Ataque frenético. Cuantos menos PS tenga el usuario, más daño producirá."
		desc: "La potencia depende de X=(PS actuales del usuario×48÷PS máximos del usuario) (redondeado hacia abajo): 20 si X es 33-48, 40 si es 17-32, 80 si es 10-16, 100 si es 5-9, 150 si es 2-4 y 200 si es 0-1.", // NEEDS QC
		shortDesc: "Más potencia cuantos menos PS le queden al usuario.", // NEEDS QC
		gen4: {
			desc: "La potencia es 20 si X va de 43 a 48, 40 de 22 a 42, 80 de 13 a 21, 100 de 6 a 12, 150 de 2 a 5 y 200 si X es 0 o 1, donde X es (PS actuales del usuario × 64 ÷ PS máximos del usuario), redondeado hacia abajo.", // NEEDS QC
		},
		gen3: {
			desc: "La potencia depende de X=(PS actuales del usuario×48÷PS máximos del usuario) (redondeado hacia abajo): 20 si X es 33-48, 40 si es 17-32, 80 si es 10-16, 100 si es 5-9, 150 si es 2-4 y 200 si es 0-1.", // NEEDS QC
		},
		gen2: {
			desc: "La potencia es 20 si X va de 33 a 48, 40 de 17 a 32, 80 de 10 a 16, 100 de 5 a 9, 150 de 2 a 4 y 200 si X es 0 o 1, donde X es (PS actuales del usuario × 48 ÷ PS máximos del usuario), redondeado hacia abajo. Este movimiento no tiene varianza de daño y no puede ser crítico.", // NEEDS QC
		},
	},
	flameburst: {
		name: "Pirotecnia",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Si acierta, el aliado del objetivo pierde 1/16 de sus PS máximos (redondeado hacia abajo), salvo que tenga la habilidad Muro Mágico.", // NEEDS QC
		shortDesc: "También daña a los Pokémon junto al objetivo.", // NEEDS QC
		gen6: {
			desc: "Si acierta, cada aliado adyacente al objetivo pierde 1/16 de sus PS máximos (redondeado hacia abajo), salvo que tenga la habilidad Muro Mágico.", // NEEDS QC
		},

		damage: "  ¡Las chispas también han alcanzado a {POKEMON}!",
	},
	flamecharge: {
		name: "Nitrocarga",
		// Official flavor text: "Llamas que golpean al objetivo y aumentan la Velocidad del atacante."
		desc: "100% de probabilidad de subir 1 nivel la Velocidad del usuario.", // NEEDS QC
		shortDesc: "100% de subir 1 nivel Velocidad del usuario.", // NEEDS QC
	},
	flamethrower: {
		name: "Lanzallamas",
		// Official flavor text: "Ataca con una gran ráfaga de fuego que puede causar quemaduras."
		desc: "10% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "10% de quemar al objetivo.", // NEEDS QC
	},
	flamewheel: {
		name: "Rueda Fuego",
		// Official flavor text: "Ataca envuelto en fuego. Puede causar quemaduras."
		desc: "10% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "10% de quemar. Descongela al usuario.", // NEEDS QC
	},
	flareblitz: {
		name: "Envite Ígneo",
		// Official flavor text: "El Pokémon se cubre de llamas y carga contra el objetivo, aunque él también recibe daño. Puede quemar."
		desc: "10% de probabilidad de quemar al objetivo. Si el objetivo pierde PS, el usuario sufre un retroceso del 33% del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso 33%. 10% de quemar. Descongela al usuario.", // NEEDS QC
		gen4: {
			desc: "10% de probabilidad de quemar al objetivo. Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/3 de los PS perdidos (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "1/3 de retroceso. 10% de quemar. Se descongela.", // NEEDS QC
		},
	},
	flash: {
		name: "Destello",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Baja 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel precisión del objetivo.", // NEEDS QC
	},
	flashcannon: {
		name: "Cañón Resplandor",
		// Official flavor text: "El usuario concentra toda la luz del cuerpo y la libera. Puede bajar la Defensa Especial del objetivo."
		desc: "10% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	flatter: {
		name: "Camelo",
		// Official flavor text: "Halaga al objetivo y lo confunde, pero también sube su Ataque Especial."
		desc: "Sube 1 nivel el Ataque Especial del objetivo y lo confunde.", // NEEDS QC
		shortDesc: "Sube 1 nivel el At. Esp. del objetivo y lo confunde.", // NEEDS QC
	},
	fleurcannon: {
		name: "Cañón Floral",
		// Official flavor text: "El usuario emite un potente rayo, pero su Ataque Especial se reduce mucho."
		desc: "Baja 2 niveles el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 2 niveles At. Esp. del usuario.", // NEEDS QC
	},
	fling: {
		name: "Lanzamiento",
		// Official flavor text: "El usuario lanza contra el objetivo el objeto que lleva. La fuerza del ataque y su efecto varían según el objeto."
		desc: "La potencia depende del objeto del usuario. El objeto se pierde y, si tiene efecto, se activa sobre el objetivo. Si no hay objetivo o este se protege, el objeto se pierde igualmente. Puede recuperarse con Reciclaje o la habilidad Cosecha. Falla si el usuario no lleva objeto, si este no puede lanzarse, si el usuario está bajo Embargo o Zona Mágica, o si tiene la habilidad Zoquete.", // NEEDS QC
		shortDesc: "Lanza su objeto al objetivo. La potencia varía.", // NEEDS QC
		gen4: {
			desc: "La potencia depende del objeto que lleve el usuario. El objeto se pierde y se activa sobre el objetivo si procede. Si el objetivo evita este movimiento protegiéndose, el objeto se pierde igualmente. Un objeto lanzado puede recuperarse con Reciclaje. Falla si el usuario no lleva objeto, si el objeto no puede lanzarse o si el usuario está bajo el efecto de Embargo.", // NEEDS QC
		},

		removeItem: "  ¡{POKEMON} ha tirado su{INFLECT:ITEM:s=:p=s} {ITEM:classified}!",
	},
	flipturn: {
		name: "Viraje",
		// Official flavor text: "Tras atacar, el usuario da paso a toda prisa a otro Pokémon del equipo."
		desc: "Si acierta y el usuario no se ha debilitado, se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos o si el objetivo se cambió con Botón Escape o por las habilidades Retirada o Huida.", // NEEDS QC
		shortDesc: "El usuario se cambia tras dañar al objetivo.", // NEEDS QC

		switchOut: "#uturn",
	},
	floatyfall: {
		name: "Pikapicado",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	floralhealing: {
		name: "Cura Floral",
		// Official flavor text: "Restaura la mitad de los PS máximos del objetivo. Es más efectivo cuando se usa en conjunción con Campo de Hierba."
		desc: "Restaura la mitad de los PS máximos del objetivo (redondeado al alza desde 0,5). Con campo de hierba, restaura 2/3 (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El objetivo recupera la mitad de sus PS máximos.", // NEEDS QC
	},
	flowershield: {
		name: "Defensa Floral",
		// Official flavor text: "Aumenta la Defensa de todos los Pokémon de tipo Planta que hay en el combate usando unos misteriosos poderes."
		desc: "Sube 1 nivel la Defensa de todos los Pokémon de tipo Planta en combate. Falla si no hay ninguno.", // NEEDS QC
		shortDesc: "+1 Defensa a todos los de tipo Planta en combate.", // NEEDS QC
	},
	flowertrick: {
		name: "Truco Floral",
		desc: "Siempre asesta un golpe crítico, salvo que el objetivo esté bajo el efecto de Conjuro o tenga las habilidades Armadura Batalla o Caparazón. No comprueba la precisión.", // NEEDS QC
		shortDesc: "Siempre es crítico y no comprueba la precisión.", // NEEDS QC
	},
	fly: {
		name: "Vuelo",
		// Official flavor text: "El usuario vuela en el primer turno y ataca en el segundo."
		desc: "Vuela alto el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Vendaval, Gancho Alto, Antiaéreo, Mil Flechas, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Vuela alto y golpea el turno siguiente.", // NEEDS QC
		gen5: {
			desc: "Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Vendaval, Gancho Alto, Antiaéreo, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		},
		gen4: {
			desc: "Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Gancho Alto, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		},
		gen3: {
			desc: "Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Gancho Alto, Trueno, Ciclón, y Tornado y Ciclón le hacen el doble de daño.", // NEEDS QC
		},
		gen2: {
			desc: "Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Tornado, Trueno, Ciclón, Remolino, y Tornado y Ciclón le hacen el doble de daño.", // NEEDS QC
		},
		gen1: {
			desc: "Se eleva el primer turno y golpea el segundo. Mientras está en el aire solo lo alcanzan Venganza, Meteoros y Transformación. Si el usuario queda totalmente paralizado el segundo turno, sigue evitando ataques hasta que se cambie o ejecute con éxito el segundo turno de este movimiento o de Excavar.", // NEEDS QC
		},

		prepare: "¡{POKEMON} ha volado muy alto!",
	},
	flyingpress: {
		name: "Plancha Voladora",
		// Official flavor text: "El Pokémon que lo usa se lanza sobre su oponente. Este movimiento es de tipo Lucha y tipo Volador al mismo tiempo."
		desc: "Combina el tipo Volador en el cálculo de eficacia contra el objetivo. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "Combina el tipo Volador en su eficacia.", // NEEDS QC
	},
	focusblast: {
		name: "Onda Certera",
		// Official flavor text: "Agudiza la concentración mental y libera su poder. Puede disminuir la Defensa Especial del objetivo."
		desc: "10% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	focusenergy: {
		name: "Foco Energía",
		// Official flavor text: "Concentra energía para aumentar las posibilidades de asestar un golpe crítico."
		desc: "Sube 2 niveles el índice de golpe crítico del usuario. Falla si ya tiene el efecto. Puede transferirse con Relevo.", // NEEDS QC
		shortDesc: "Sube 2 niveles su índice de golpe crítico.", // NEEDS QC
		gen2: {
			desc: "Sube 1 nivel el índice de críticos del usuario. Falla si el usuario ya tiene el efecto. Este efecto puede transferirse con Relevo.", // NEEDS QC
			shortDesc: "Sube 1 nivel el índice de crítico del usuario.", // NEEDS QC
		},
		gen1: {
			desc: "Mientras el usuario siga en combate, su índice de críticos se reduce a la cuarta parte. Falla si el usuario ya tiene el efecto. Si algún Pokémon usa Niebla, el efecto termina.", // NEEDS QC
			shortDesc: "Reduce a 1/4 su probabilidad de golpe crítico.", // NEEDS QC
		},

		start: "  ¡{POKEMON} se está preparando para luchar!",
		startFromItem: "  ¡La probabilidad de asestar golpes críticos de {POKEMON} ha aumentado gracias {ITEM:a:definite:classified}!",
		startFromZEffect: "  ¡{POKEMON} ve aumentada su probabilidad de asestar golpes críticos gracias al Poder Z!",
	},
	focuspunch: {
		name: "Puño Certero",
		// Official flavor text: "Se concentra para dar un puñetazo. Falla si se sufre un golpe antes de su uso."
		desc: "El usuario pierde la concentración y no hace nada si recibe un ataque que cause daño este turno antes de ejecutarlo.", // NEEDS QC
		shortDesc: "Falla si recibe daño antes de ejecutarlo.", // NEEDS QC
		gen4: {
			desc: "El usuario pierde la concentración y no hace nada si recibe un ataque este turno antes de poder ejecutar el movimiento, pero pierde PP igualmente.", // NEEDS QC
		},

		start: "  ¡{POKEMON} está reforzando su concentración!",
		cant: "¡{POKEMON} ha perdido la concentración y no puede atacar!",
	},
	followme: {
		name: "Señuelo",
		// Official flavor text: "Llama la atención para concentrar todos los ataques de todos los del equipo rival hacia sí mismo."
		desc: "Hasta el final del turno, los ataques de un solo objetivo del bando rival se redirigen al usuario, antes de que puedan devolverse con Capa Mágica o la habilidad Espejo Mágico, o atraerse con Pararrayos o Colector. Falla si no es un combate doble o una batalla campal. Se ignora mientras el usuario está bajo Caída Libre.", // NEEDS QC
		shortDesc: "Los movimientos rivales apuntan al usuario este turno.", // NEEDS QC
		gen6: {
			desc: "Hasta el final del turno, todos los ataques de un solo objetivo del bando rival se redirigen al usuario si está al alcance. Se redirigen antes de que puedan ser devueltos por Capa Mágica o la habilidad Espejo Mágico, o atraídos por las habilidades Pararrayos o Colector. Falla si no es un combate doble o triple. Este efecto se ignora mientras el usuario esté bajo el efecto de Caída Libre.", // NEEDS QC
		},
		gen4: {
			desc: "Hasta el final del turno, todos los ataques de un solo objetivo del bando rival se redirigen al usuario. Se redirigen antes de que puedan ser devueltos por Capa Mágica o atraídos por las habilidades Pararrayos o Colector. Este efecto sigue activo aunque el usuario deje el campo. Falla si no es un combate doble.", // NEEDS QC
		},
		gen3: {
			desc: "Hasta el final del turno, todos los ataques de un solo objetivo del bando rival se redirigen al usuario. Se redirigen antes de que puedan ser devueltos por Capa Mágica o atraídos por la habilidad Pararrayos. Este efecto sigue activo aunque el usuario deje el campo. Falla si no es un combate doble.", // NEEDS QC
		},

		start: "  ¡{POKEMON} se ha convertido en el centro de atención!",
		startFromZEffect: "  ¡{POKEMON} se ha convertido en el centro de atención!",
	},
	forcepalm: {
		name: "Palmeo",
		// Official flavor text: "Ataca al objetivo con una onda de choque y puede llegar a paralizarlo."
		desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "30% de paralizar al objetivo.", // NEEDS QC
	},
	foresight: {
		name: "Profecía",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Mientras el objetivo siga en combate, su evasión se ignora en las comprobaciones de precisión si es mayor que 0, y los ataques de tipo Normal y Lucha pueden golpearlo aunque sea de tipo Fantasma. Falla si ya está afectado por este efecto o por Gran Ojo u Rastreo.", // NEEDS QC
		shortDesc: "Lucha y Normal golpean a Fantasma. Ignora evasión.", // NEEDS QC
		gen4: {
			desc: "Mientras el objetivo siga en combate, su nivel de evasión se ignora en los cálculos de precisión contra él si es mayor que 0, y los ataques de tipo Normal y Lucha pueden golpearlo aunque sea de tipo Fantasma.", // NEEDS QC
		},
		gen3: {
			desc: "Mientras el objetivo siga en combate, su nivel de evasión se ignora en los cálculos de precisión contra él, y los ataques de tipo Normal y Lucha pueden golpearlo aunque sea de tipo Fantasma.", // NEEDS QC
		},
		gen2: {
			desc: "Mientras el objetivo siga en combate, si su nivel de evasión es mayor que el nivel de precisión del atacante, ambos se ignoran en los cálculos de precisión, y los ataques de tipo Normal y Lucha pueden golpearlo aunque sea de tipo Fantasma. Si el objetivo deja el campo con Relevo, el sustituto sigue afectado. Falla si el objetivo ya está afectado.", // NEEDS QC
		},

		start: "  ¡{POKEMON} identificado!",
	},
	forestscurse: {
		name: "Condena Silvana",
		// Official flavor text: "El objetivo es presa de la maldición del bosque, por lo que pasa a ser un Pokémon de tipo Planta, además de conservar sus tipos habituales."
		desc: "Añade el tipo Planta al objetivo, que pasa a tener 2 o 3 tipos. Falla si ya es de tipo Planta. Si Halloween le añade un tipo, sustituye al añadido por este movimiento (y viceversa).", // NEEDS QC
		shortDesc: "Añade el tipo Planta al objetivo.", // NEEDS QC
	},
	foulplay: {
		name: "Juego Sucio",
		// Official flavor text: "El usuario emplea la fuerza del objetivo para atacarlo. Cuanto mayor es el Ataque del objetivo, más daño provoca."
		desc: "El daño se calcula usando el Ataque del objetivo, incluidos sus cambios de nivel. La habilidad, el objeto y la quemadura del usuario se aplican con normalidad.", // NEEDS QC
		shortDesc: "Usa el Ataque del objetivo para calcular el daño.", // NEEDS QC
	},
	freezedry: {
		name: "Liofilización",
		// Official flavor text: "Enfría súbitamente al objetivo e incluso puede congelarlo. Es supereficaz contra Pokémon de tipo Agua."
		desc: "10% de probabilidad de congelar al objetivo. Su eficacia contra el tipo Agua pasa a ser supereficaz, sin importar el tipo del movimiento.", // NEEDS QC
		shortDesc: "10% de congelar. Supereficaz contra Agua.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	freezeshock: {
		name: "Rayo Gélido",
		// Official flavor text: "El usuario carga un bloque de hielo con electricidad en el primer turno y ataca con él en el segundo. Puede paralizar."
		desc: "30% de probabilidad de paralizar al objetivo. Carga el primer turno y golpea el segundo. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Carga y golpea el turno 2. 30% de paralizar.", // NEEDS QC

		prepare: "  ¡Una luz fría envuelve a {POKEMON}!",
	},
	freezingglare: {
		name: "Mirada Heladora",
		// Official flavor text: "A través de sus ojos emite poderes psíquicos con los que ataca al objetivo, al que puede llegar a congelar."
		desc: "10% de probabilidad de congelar al objetivo.", // NEEDS QC
		shortDesc: "10% de congelar al objetivo.", // NEEDS QC
	},
	freezyfrost: {
		name: "Glaceoprisma",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Elimina los cambios de características de todos los Pokémon en combate.", // NEEDS QC
		shortDesc: "Elimina todos los cambios de características.", // NEEDS QC
	},
	frenzyplant: {
		name: "Planta Feroz",
		// Official flavor text: "Golpea con una enorme planta. Quien lo usa no puede moverse en el siguiente turno."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	frostbreath: {
		name: "Vaho Gélido",
		// Official flavor text: "Quien lo usa ataca lanzando un aliento gélido. Siempre asesta un golpe crítico."
		desc: "Siempre asesta un golpe crítico, salvo que el objetivo esté bajo el efecto de Conjuro o tenga las habilidades Armadura Batalla o Caparazón.", // NEEDS QC
		shortDesc: "Siempre asesta un golpe crítico.", // NEEDS QC
	},
	frustration: {
		name: "Frustración",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia es ((255−amistad del usuario)×2/5) (redondeado hacia abajo, mínimo 1).", // NEEDS QC
		shortDesc: "Potencia máxima (102) con amistad mínima.", // NEEDS QC
	},
	furyattack: {
		name: "Ataque Furia",
		// Official flavor text: "Cornea al objetivo de dos a cinco veces."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. El daño se calcula una sola vez para el primer golpe y se repite en cada golpe. Si un golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	furycutter: {
		name: "Corte Furia",
		// Official flavor text: "Ataque con garras o guadaña que crece en intensidad si se usa repetidas veces."
		desc: "La potencia se duplica con cada acierto, hasta un máximo de 160. Se reinicia si falla o si se usa otro movimiento.", // NEEDS QC
		shortDesc: "Potencia doble por cada acierto, hasta 160.", // NEEDS QC
	},
	furyswipes: {
		name: "Golpes Furia",
		// Official flavor text: "Araña rápidamente de dos a cinco veces."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. El daño se calcula una sola vez para el primer golpe y se repite en cada golpe. Si un golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	fusionbolt: {
		name: "Rayo Fusión",
		// Official flavor text: "Ataca con una enorme descarga eléctrica. Aumenta su potencia si es influenciada por una gigantesca llamarada."
		desc: "La potencia se duplica si el último movimiento usado por cualquier Pokémon este turno fue Llama Fusión.", // NEEDS QC
		shortDesc: "Potencia doble tras Llama Fusión este turno.", // NEEDS QC
	},
	fusionflare: {
		name: "Llama Fusión",
		// Official flavor text: "Ataca con una llamarada gigantesca. Aumenta su potencia si es influenciada por una gran energía eléctrica."
		desc: "La potencia se duplica si el último movimiento usado por cualquier Pokémon este turno fue Rayo Fusión.", // NEEDS QC
		shortDesc: "Potencia doble tras Rayo Fusión este turno.", // NEEDS QC
	},
	futuresight: {
		name: "Premonición",
		// Official flavor text: "Concentra energía psíquica para golpear al objetivo dos turnos después."
		desc: "Inflige daño 2 turnos después de usarse. Al final de ese turno, el daño se calcula en ese momento y lo recibe el Pokémon en la posición que tenía el objetivo. Si el usuario ya no está en combate, el daño se calcula con su Ataque Especial, tipos y nivel naturales, sin mejoras de objeto ni habilidad. Falla si este movimiento o Deseo Oculto ya están en efecto para esa posición.", // NEEDS QC
		shortDesc: "Golpea dos turnos después de usarse.", // NEEDS QC
		gen4: {
			desc: "Inflige dos turnos después de usarse daño sin tipo que no puede ser crítico. El daño se calcula contra el objetivo al usarse y se inflige al final del último turno al Pokémon que ocupe la posición original del objetivo. Falla si este movimiento o Deseo Oculto ya está en curso en esa posición.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige dos turnos después de usarse daño sin tipo que no puede ser crítico. El daño se calcula contra el objetivo al usarse y se inflige al final del último turno al Pokémon que ocupe la posición original del objetivo. Falla si este movimiento ya está en curso en esa posición.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha previsto un ataque!",
		activate: "  ¡{TARGET} ha sido alcanzado por Premonición!",
	},
	gastroacid: {
		name: "Bilis",
		// Official flavor text: "El usuario arroja sus jugos biliares al objetivo, lo que anula el efecto de la habilidad en uso."
		desc: "Anula la habilidad del objetivo mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Falla si su habilidad es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Modo Daruma, Cambio Heroico, y recibir el efecto por Relevo lo termina de inmediato.", // NEEDS QC
		shortDesc: "Anula la habilidad del objetivo.", // NEEDS QC
		gen8: {
			desc: "Anula la habilidad del objetivo mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Si la habilidad del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Modo Daruma, este movimiento falla, y recibir el efecto por Relevo lo termina de inmediato.", // NEEDS QC
		},
		gen7: {
			desc: "Anula la habilidad del objetivo mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Si la habilidad del objetivo es Fuerte Afecto, Letargo Perenne, Disfraz, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Modo Daruma, este movimiento falla, y recibir el efecto por Relevo lo termina de inmediato.", // NEEDS QC
		},
		gen6: {
			desc: "Anula la habilidad del objetivo mientras siga en combate. Si el objetivo usa Relevo, el sustituto sigue afectado. Si la habilidad del objetivo es Multitipo, Cambio Táctico, este movimiento falla, y recibir el efecto por Relevo lo termina de inmediato.", // NEEDS QC
		},

		start: "  ¡Se ha anulado la habilidad de {POKEMON}!",
	},
	geargrind: {
		name: "Rueda Doble",
		// Official flavor text: "Rota dos engranajes de hierro sobre el objetivo. Golpea dos veces."
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces en un turno.", // NEEDS QC
	},
	gearup: {
		name: "Piñón Auxiliar",
		// Official flavor text: "Cambia de marcha y logra aumentar el Ataque y el Ataque Especial de los Pokémon aliados que cuenten con las habilidades Más y Menos."
		desc: "Sube 1 nivel el Ataque y el Ataque Especial de los aliados con las habilidades Más o Menos.", // NEEDS QC
		shortDesc: "+1 Ataque y At. Esp. a aliados con Más o Menos.", // NEEDS QC
	},
	genesissupernova: {
		name: "Supernova Original",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Si acierta, se activa el campo psíquico.", // NEEDS QC
		shortDesc: "Crea un campo psíquico.", // NEEDS QC
	},
	geomancy: {
		name: "Geocontrol",
		// Official flavor text: "Concentra energía durante el primer turno, de forma que su Velocidad, Ataque Especial y Defensa Especial aumenten mucho en el segundo."
		desc: "Sube 2 niveles el Ataque Especial, la Defensa Especial y la Velocidad del usuario. Carga el primer turno y se ejecuta el segundo. Con Hierba Única, se completa en 1 turno.", // NEEDS QC
		shortDesc: "Carga y luego +2 At. Esp., Def. Esp. y Vel.", // NEEDS QC

		prepare: "¡{POKEMON} está acumulando energía!",
	},
	gigadrain: {
		name: "Gigadrenado",
		// Official flavor text: "Un ataque que absorbe nutrientes. Quien lo usa recupera la mitad de los PS del daño que produce."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja). Si el usuario lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja).", // NEEDS QC
		},
		gen3: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja).", // NEEDS QC
		},
	},
	gigaimpact: {
		name: "Gigaimpacto",
		// Official flavor text: "El usuario carga contra el objetivo con toda la fuerza que tiene y descansa durante el siguiente turno."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	gigatonhammer: {
		name: "Martillo Colosal",
		shortDesc: "No puede elegirse dos turnos seguidos.", // NEEDS QC
	},
	gigavolthavoc: {
		name: "Gigavoltio Destructor",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	glaciallance: {
		name: "Lanza Glacial",
		// Official flavor text: "El usuario ataca al objetivo lanzándole un carámbano de hielo envuelto en una ventisca."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	glaciate: {
		name: "Mundo Gélido",
		// Official flavor text: "Ataque con aire helado que baja la Velocidad del objetivo."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel la Velocidad de los rivales.", // NEEDS QC
	},
	glaiverush: {
		name: "Asalto Espadón",
		desc: "Si acierta, hasta la próxima acción del usuario los movimientos dirigidos a él no comprueban la precisión y le hacen el doble de daño.", // NEEDS QC
		shortDesc: "Hasta su próximo turno recibe daño doble y certero.", // NEEDS QC
	},
	glare: {
		name: "Deslumbrar",
		// Official flavor text: "Intimida y asusta al objetivo con la mirada para dejarlo paralizado."
		desc: "Paraliza al objetivo.", // NEEDS QC
		shortDesc: "Paraliza al objetivo.", // NEEDS QC
		gen3: {
			desc: "Paraliza al objetivo. Este movimiento no ignora las inmunidades de tipo.", // NEEDS QC
		},
		gen1: {
			desc: "Paraliza al objetivo.", // NEEDS QC
		},
	},
	glitzyglow: {
		name: "Espeaura",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Al usarse, genera el efecto de Pantalla de Luz durante 5 turnos en el bando del usuario.", // NEEDS QC
		shortDesc: "Crea el efecto de Pantalla de Luz.", // NEEDS QC
	},
	gmaxbefuddle: {
		name: "Gigaestupor",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, cada rival queda dormido, envenenado o paralizado (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: slp, psn o par.", // NEEDS QC
	},
	gmaxcannonade: {
		name: "Gigacañonazo",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, durante 4 turnos los rivales que no sean de tipo Agua pierden 1/6 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1/6 PS, 4 turnos.", // NEEDS QC

		start: "  ¡La corriente arrastra a {PARTY}!",
		damage: "  ¡{POKEMON} sufre al verse arrastrado por la corriente de Gigacañonazo!",
	},
	gmaxcentiferno: {
		name: "Gigacienfuegos",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los rivales no pueden cambiarse durante 4 o 5 turnos (7 con Garra Garfio) y pierden 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) cada turno (incluso tras un sustituto). Pueden cambiarse con Muda Concha o usando Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina para un objetivo si deja el campo o usa con éxito Giro Rápido o Sustituto. No es acumulable ni se reinicia.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: atados 4-5 turnos.", // NEEDS QC
	},
	gmaxchistrike: {
		name: "Gigapuñición",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, el índice de golpe crítico de los aliados sube 1 nivel (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: crítico +1.", // NEEDS QC

		start: "#focusenergy",
	},
	gmaxcuddle: {
		name: "Gigaternura",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, cada rival queda enamorado (incluso tras un sustituto). No afecta a un objetivo del mismo sexo que el usuario, sin sexo o ya enamorado.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: enamorados.", // NEEDS QC
	},
	gmaxdepletion: {
		name: "Gigadesgaste",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, el último movimiento usado de cada rival pierde 2 PP (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -2 PP al último mov.", // NEEDS QC

		activate: "  ¡{TARGET} ha perdido PP!",
	},
	gmaxdrumsolo: {
		name: "Gigarredoble",
		desc: "Su potencia es siempre 160, sin importar el Maximovimiento base. Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Potencia fija de 160. Ignora habilidades.", // NEEDS QC
	},
	gmaxfinale: {
		name: "Gigacolofón",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los aliados recuperan 1/6 de sus PS máximos (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: +1/6 de sus PS.", // NEEDS QC
	},
	gmaxfireball: {
		name: "Gigaesfera Ígnea",
		desc: "Su potencia es siempre 160, sin importar el Maximovimiento base. Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Potencia fija de 160. Ignora habilidades.", // NEEDS QC
	},
	gmaxfoamburst: {
		name: "Gigaespuma",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, la Velocidad de los rivales baja 2 niveles (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -2 Velocidad.", // NEEDS QC
	},
	gmaxgoldrush: {
		name: "Gigamonedas",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los rivales quedan confusos (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según el mov. base. Rivales: confusión.", // NEEDS QC
	},
	gmaxgravitas: {
		name: "Gigabóveda",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, se activa el efecto de Gravedad.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Activa Gravedad.", // NEEDS QC
	},
	gmaxhydrosnipe: {
		name: "Gigadisparo",
		desc: "Su potencia es siempre 160, sin importar el Maximovimiento base. Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Potencia fija de 160. Ignora habilidades.", // NEEDS QC
	},
	gmaxmalodor: {
		name: "Gigapestilencia",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los rivales quedan envenenados (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: envenenados.", // NEEDS QC
	},
	gmaxmeltdown: {
		name: "Gigafundido",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, cada rival queda bajo el efecto de Tormento (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: bajo Tormento.", // NEEDS QC
	},
	gmaxoneblow: {
		name: "Gigagolpe Brusco",
		desc: "Su potencia es la del Maximovimiento base. Atraviesa todas las protecciones, incluida Maxibarrera.", // NEEDS QC
		shortDesc: "Potencia según el mov. base. Atraviesa Maxibarrera.", // NEEDS QC
	},
	gmaxrapidflow: {
		name: "Gigagolpe Fluido",
		desc: "Su potencia es la del Maximovimiento base. Atraviesa todas las protecciones, incluida Maxibarrera.", // NEEDS QC
		shortDesc: "Potencia según el mov. base. Atraviesa Maxibarrera.", // NEEDS QC
	},
	gmaxreplenish: {
		name: "Gigarreciclaje",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, hay un 50% de probabilidad de que los aliados recuperen sus bayas (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. 50% de recuperar las bayas.", // NEEDS QC
	},
	gmaxresonance: {
		name: "Gigamelodía",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, se activa Velo Aurora en el bando del usuario.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: Velo Aurora.", // NEEDS QC
	},
	gmaxsandblast: {
		name: "Gigapolvareda",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los rivales no pueden cambiarse durante 4 o 5 turnos (7 con Garra Garfio) y pierden 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) cada turno (incluso tras un sustituto). Pueden cambiarse con Muda Concha o usando Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina para un objetivo si deja el campo o usa con éxito Giro Rápido o Sustituto. No es acumulable ni se reinicia.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: atados 4-5 turnos.", // NEEDS QC
	},
	gmaxsmite: {
		name: "Gigacastigo",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los rivales quedan confusos (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según el mov. base. Rivales: confusión.", // NEEDS QC
	},
	gmaxsnooze: {
		name: "Gigasopor",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, hay un 50% de probabilidad de que el objetivo quede bajo el efecto de Bostezo (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. 50% de Bostezo al objetivo.", // NEEDS QC
	},
	gmaxsteelsurge: {
		name: "Gigatrampa Acero",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, coloca una trampa en el bando rival que daña a los rivales que entren en combate según su debilidad al tipo Acero: pierden 1/32, 1/16, 1/8, 1/4 o 1/2 de sus PS máximos (redondeado hacia abajo) con eficacia 0,25, 0,5, neutra, 2 o 4. Se elimina si un rival usa con éxito Giro Rápido o Despejar o recibe Despejar.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Trampa de tipo Acero.", // NEEDS QC

		start: "  ¡Piezas de acero puntiagudas rodean a {PARTY}!",
		end: "  Las piezas de acero que rodeaban a {PARTY} han desaparecido.",
		damage: "  ¡Unas piezas de acero puntiagudas han dañado a {POKEMON}!",
	},
	gmaxstonesurge: {
		name: "Gigatrampa Rocas",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, coloca una trampa en el bando rival que daña a los rivales que entren en combate según su debilidad al tipo Roca: pierden 1/32, 1/16, 1/8, 1/4 o 1/2 de sus PS máximos (redondeado hacia abajo) con eficacia 0,25, 0,5, neutra, 2 o 4. Se elimina si un rival usa con éxito Giro Rápido o Despejar o recibe Despejar.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Coloca Trampa Rocas.", // NEEDS QC
	},
	gmaxstunshock: {
		name: "Gigadescarga",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, cada rival queda envenenado o paralizado (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: veneno o parálisis.", // NEEDS QC
	},
	gmaxsweetness: {
		name: "Giganéctar",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, se curan los problemas de estado de los aliados (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: estados curados.", // NEEDS QC
	},
	gmaxtartness: {
		name: "Gigacorrosión",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, la evasión de los rivales baja 1 nivel (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1 evasión.", // NEEDS QC
	},
	gmaxterror: {
		name: "Gigaaparición",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los rivales no pueden cambiarse (incluso tras un sustituto). Pueden cambiarse con Muda Concha o usando Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: atrapados.", // NEEDS QC
	},
	gmaxvinelash: {
		name: "Gigalianas",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, durante 4 turnos los rivales que no sean de tipo Planta pierden 1/6 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1/6 PS, 4 turnos.", // NEEDS QC

		start: "  ¡Violentos latigazos avasallan a {PARTY}!",
		damage: "  ¡Los violentos golpes de Gigalianas hieren a {POKEMON}!",
	},
	gmaxvolcalith: {
		name: "Gigarroca Ígnea",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, durante 4 turnos los rivales que no sean de tipo Roca pierden 1/6 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1/6 PS, 4 turnos.", // NEEDS QC

		start: "  ¡Las rocas rodean a {PARTY}!",
		damage: "  ¡Las piedras desprendidas por Gigarroca Ígnea han herido a {POKEMON}!",
	},
	gmaxvoltcrash: {
		name: "Gigatronada",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, los rivales quedan paralizados (incluso tras un sustituto).", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: paralizados.", // NEEDS QC
	},
	gmaxwildfire: {
		name: "Gigallamarada",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, durante 4 turnos los rivales que no sean de tipo Fuego pierden 1/6 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1/6 PS, 4 turnos.", // NEEDS QC

		start: "  ¡Las llamas rodean a {PARTY}!",
		damage: "  ¡El fuego de Gigallamarada ha quemado a {POKEMON}!",
	},
	gmaxwindrage: {
		name: "Gigahuracán",
		desc: "Su potencia es la del movimiento Maximovimiento base. Si acierta, terminan los efectos de los campos eléctrico, de hierba, de niebla y psíquico; los de Reflejo, Pantalla de Luz, Velo Aurora, Velo Sagrado, Neblina, Gigatrampa Acero, Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa en el bando del objetivo; y los de Gigatrampa Acero, Púas, Púas Tóxicas, Trampa Rocas, Red Viscosa en el del usuario.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Elimina campos y trampas.", // NEEDS QC
	},
	grassknot: {
		name: "Hierba Lazo",
		// Official flavor text: "Enreda al objetivo con hierba y lo derriba. Cuanto más pesado es el objetivo, más daño inflige."
		desc: "La potencia depende del peso del objetivo: 20 si pesa menos de 10 kg, 40 si menos de 25 kg, 60 si menos de 50 kg, 80 si menos de 100 kg, 100 si menos de 200 kg y 120 si pesa 200 kg o más.", // NEEDS QC
		shortDesc: "Más potencia cuanto más pese el objetivo.", // NEEDS QC
	},
	grasspledge: {
		name: "Voto Planta",
		// Official flavor text: "Ataca con columnas de hojas. Combinado con Voto Agua, crea un pantano y aumenta su potencia."
		desc: "Si un aliado eligió Voto Fuego o Voto Agua este turno y aún no ha actuado, actúa justo después del usuario y el movimiento del usuario no hace nada. Combinado con Voto Fuego, el aliado usa Voto Fuego con 150 de potencia y un mar de fuego aparece en el bando rival durante 4 turnos: los Pokémon que no sean de tipo Fuego pierden 1/8 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último. Combinado con Voto Agua, el aliado usa Voto Planta con 150 de potencia y un pantano aparece en el bando rival durante 4 turnos, reduciendo a 1/4 la Velocidad de ese bando. Como movimiento combinado recibe STAB sin importar el tipo del usuario. No consume Gema Planta.", // NEEDS QC
		shortDesc: "Combínalo con los otros votos para efectos extra.", // NEEDS QC

		activate: "#waterpledge",
		start: "  ¡Ha aparecido un pantano alrededor de {TEAM}!",
		end: "  El pantano que rodeaba a {TEAM} ha desaparecido.",
	},
	grasswhistle: {
		name: "Silbato",
		shortDesc: "Duerme al objetivo.", // NEEDS QC
	},
	grassyglide: {
		name: "Fitoimpulso",
		// Official flavor text: "Ataca al objetivo deslizándose sobre el terreno de combate. Este movimiento tiene prioridad alta cuando el terreno está cubierto por un campo de hierba."
		desc: "Si hay campo de hierba y el usuario está en el suelo, su prioridad aumenta en 1.", // NEEDS QC
		shortDesc: "En campo de hierba: prioridad +1.", // NEEDS QC
	},
	grassyterrain: {
		name: "Campo de Hierba",
		// Official flavor text: "Durante cinco turnos, se potencian los movimientos de tipo Planta y los Pokémon que están en contacto con el suelo recuperan PS en cada turno."
		desc: "Durante 5 turnos, se activa el campo de hierba: la potencia de los ataques de tipo Planta de los Pokémon en el suelo se multiplica por 1,3, la de Terratemblor, Terremoto, Magnitud contra Pokémon en el suelo por 0,5, y los Pokémon en el suelo recuperan 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último. Camuflaje vuelve al usuario de tipo Planta, Adaptación pasa a ser Energibola y Daño Secreto tiene un 30% de causar sueño. Falla si ya hay campo de hierba.", // NEEDS QC
		shortDesc: "5 turnos: potencia Planta y cura 1/16 por turno.", // NEEDS QC
		gen7: {
			desc: "Durante 5 turnos se activa un campo de hierba. Mientras dura, la potencia de los ataques de tipo Planta de los Pokémon en el suelo se multiplica por 1,5, la potencia de Terratemblor, Terremoto y Magnitud contra Pokémon en el suelo se multiplica por 0,5, y los Pokémon en el suelo recuperan 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno, incluido el último. Camuflaje convierte al usuario en tipo Planta, Adaptación pasa a ser Energibola y Daño Secreto tiene un 30% de probabilidad de dormir. Falla si ya hay un campo de hierba.", // NEEDS QC
		},
	},
	gravapple: {
		name: "Fuerza G",
		// Official flavor text: "El usuario ataca haciendo caer una manzana desde gran altura. Disminuye la Defensa del objetivo."
		desc: "100% de probabilidad de bajar 1 nivel la Defensa del objetivo. La potencia se multiplica por 1,5 durante Gravedad.", // NEEDS QC
		shortDesc: "100% de -1 Defensa. Con Gravedad: 1,5x potencia.", // NEEDS QC
	},
	gravity: {
		name: "Gravedad",
		// Official flavor text: "Durante cinco turnos, se anulan los movimientos que alzan el vuelo y los Pokémon de tipo Volador o que levitan son vulnerables a movimientos de tipo Tierra."
		desc: "Durante 5 turnos, la evasión de todos los Pokémon en combate se multiplica por 0,6. Al usarse, terminan de inmediato Bote, Vuelo, Levitón, Caída Libre, Telequinesis para todos. Durante el efecto, nadie puede usar Bote, Vuelo, Plancha Voladora, Patada Salto Alta, Patada Salto, Levitón, Caída Libre, Salpicadura, Telequinesis. Los ataques de tipo Tierra, Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena afectan a los de tipo Volador y a los que tienen Levitación. Falla si ya está en efecto.", // NEEDS QC
		shortDesc: "5 turnos: sin inmunidades a Tierra, 1,67x precisión.", // NEEDS QC
		gen7: {
			desc: "Durante 5 turnos, la evasión de todos los Pokémon activos se multiplica por 0,6. Al usarse, Bote, Vuelo, Levitón, Caída Libre, Telequinesis terminan de inmediato para todos los Pokémon. Mientras dura, ningún Pokémon puede usar Bote, Vuelo, Plancha Voladora, Patada Salto Alta, Patada Salto, Levitón, Caída Libre, Salpicadura, Telequinesis. Los ataques de tipo Tierra, Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena pueden afectar a los Pokémon de tipo Volador o con la habilidad Levitación. Falla si el efecto ya está activo. Los movimientos Z afectados pueden seguir eligiéndose, pero se impedirán al ejecutarse durante este efecto.", // NEEDS QC
		},
		gen6: {
			desc: "Durante 5 turnos, la evasión de todos los Pokémon en combate se multiplica por 0,6. Al usarse, terminan de inmediato Bote, Vuelo, Levitón, Caída Libre, Telequinesis para todos. Durante el efecto, nadie puede usar Bote, Vuelo, Plancha Voladora, Patada Salto Alta, Patada Salto, Levitón, Caída Libre, Salpicadura, Telequinesis. Los ataques de tipo Tierra, Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena afectan a los de tipo Volador y a los que tienen Levitación. Falla si ya está en efecto.", // NEEDS QC
		},
		gen5: {
			desc: "Durante 5 turnos, la evasión de todos los Pokémon activos se multiplica por 0,6. Al usarse, Bote, Vuelo, Levitón, Caída Libre, Telequinesis terminan de inmediato para todos los Pokémon. Mientras dura, ningún Pokémon puede usar Bote, Vuelo, Patada Salto Alta, Patada Salto, Levitón, Caída Libre, Salpicadura, Telequinesis. Los ataques de tipo Tierra, Púas, Púas Tóxicas y la habilidad Trampa Arena pueden afectar a los Pokémon de tipo Volador o con la habilidad Levitación. Falla si el efecto ya está activo.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 5 turnos, la evasión de todos los Pokémon activos se multiplica por 0,6. Al usarse, Bote, Vuelo, Levitón terminan de inmediato para todos los Pokémon. Mientras dura, ningún Pokémon puede usar Bote, Vuelo, Patada Salto Alta, Patada Salto, Levitón, Salpicadura. Los ataques de tipo Tierra, Púas, Púas Tóxicas y la habilidad Trampa Arena pueden afectar a los Pokémon de tipo Volador o con la habilidad Levitación. Falla si el efecto ya está activo.", // NEEDS QC
		},
	},
	growl: {
		name: "Gruñido",
		// Official flavor text: "Dulce gruñido que reduce el Ataque del equipo rival."
		desc: "Baja 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel el Ataque de los rivales.", // NEEDS QC
		gen2: {
			shortDesc: "Baja 1 nivel Ataque del objetivo.", // NEEDS QC
		},
	},
	growth: {
		name: "Desarrollo",
		// Official flavor text: "Hace que su cuerpo crezca a marchas forzadas con lo que aumenta su Ataque y Ataque Especial."
		desc: "Sube 1 nivel el Ataque y el Ataque Especial del usuario (2 niveles si hace sol o hay luz solar extrema). Con Parasol Multiuso, solo sube 1 nivel aunque haga sol.", // NEEDS QC
		shortDesc: "+1 Ataque y At. Esp. (+2 con sol).", // NEEDS QC
		gen7: {
			desc: "Sube 1 nivel el Ataque y el Ataque Especial del usuario. Con sol o sol abrasador, suben 2 niveles.", // NEEDS QC
		},
		gen5: {
			desc: "Sube 1 nivel el Ataque y el Ataque Especial del usuario. Con sol, suben 2 niveles.", // NEEDS QC
		},
		gen4: {
			desc: "Sube 1 nivel el Ataque Especial del usuario.", // NEEDS QC
			shortDesc: "Sube 1 nivel el Ataque Especial del usuario.", // NEEDS QC
		},
		gen1: {
			desc: "Sube 1 nivel el Especial del usuario.", // NEEDS QC
			shortDesc: "Sube 1 nivel el Especial del usuario.", // NEEDS QC
		},
	},
	grudge: {
		name: "Rabia",
		// Official flavor text: "Si el usuario se debilita al recibir un ataque, todos los PP de este último ataque serán eliminados."
		desc: "Hasta el próximo turno del usuario, si un ataque rival lo debilita, ese movimiento pierde todos sus PP restantes.", // NEEDS QC
		shortDesc: "Si lo debilitan, el movimiento usado pierde sus PP.", // NEEDS QC

		activate: "  ¡A causa de la rabia {POKEMON} se ha quedado sin ningún PP de {MOVE}!",
		start: "¡{POKEMON} va a intentar que su rival sienta rabia!",
	},
	guardianofalola: {
		name: "Cólera del Guardián",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Inflige un daño igual a 3/4 de los PS actuales del objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Inflige 3/4 de los PS actuales del objetivo.", // NEEDS QC
	},
	guardsplit: {
		name: "Isoguardia",
		// Official flavor text: "El usuario emplea sus poderes para hacer la media de su Defensa y Defensa Especial con las de su objetivo y compartirlas."
		desc: "La Defensa y la Defensa Especial del usuario y del objetivo pasan a ser la media de ambos (redondeado hacia abajo). Los cambios de nivel no se ven afectados.", // NEEDS QC
		shortDesc: "Promedia Defensa y Def. Esp. con el objetivo.", // NEEDS QC

		activate: "  ¡{POKEMON} suma su capacidad defensiva a la del objetivo y la reparte equitativamente!",
	},
	guardswap: {
		name: "Cambiadefensa",
		// Official flavor text: "El usuario emplea su poder mental para intercambiar los cambios en la Defensa y Defensa Especial con el objetivo."
		desc: "El usuario intercambia con el objetivo sus cambios de Defensa y Defensa Especial.", // NEEDS QC
		shortDesc: "Intercambia cambios de Def. y Def. Esp. con el objetivo.", // NEEDS QC
	},
	guillotine: {
		name: "Guillotina",
		// Official flavor text: "Ataque cortante que debilita al oponente de un golpe si acierta."
		desc: "Debilita al objetivo de un golpe (daño igual a sus PS máximos). Ignora los cambios de precisión y evasión. Su precisión es (nivel del usuario−nivel del objetivo+30)% y falla si el objetivo tiene mayor nivel. Los Pokémon con la habilidad Robustez son inmunes.", // NEEDS QC
		shortDesc: "Debilita de un golpe. Falla contra niveles mayores.", // NEEDS QC
		gen2: {
			desc: "Inflige 65535 puntos de daño al objetivo. La precisión de este movimiento sobre 256 es el menor de (2 × (nivel del usuario − nivel del objetivo) + 76) y 255, antes de aplicar los modificadores de precisión y evasión. Falla si el objetivo es de nivel superior.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige 65535 puntos de daño al objetivo. Falla si la Velocidad del objetivo es mayor que la del usuario.", // NEEDS QC
			shortDesc: "65535 de daño. Falla si el objetivo es más rápido.", // NEEDS QC
		},
	},
	gunkshot: {
		name: "Lanzamugre",
		// Official flavor text: "Lanza contra el objetivo basura asquerosa y puede envenenarlo."
		desc: "30% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "30% de envenenar al objetivo.", // NEEDS QC
	},
	gust: {
		name: "Tornado",
		// Official flavor text: "Crea un tornado con las alas y lo lanza contra el objetivo."
		desc: "La potencia se duplica contra objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre.", // NEEDS QC
		shortDesc: "Potencia doble contra Bote, Vuelo y Caída Libre.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica si el objetivo está usando Bote o Vuelo.", // NEEDS QC
			shortDesc: "Doble potencia contra Bote y Vuelo.", // NEEDS QC
		},
		gen2: {
			desc: "La potencia se duplica si el objetivo está usando Vuelo.", // NEEDS QC
			shortDesc: "Doble potencia contra Vuelo.", // NEEDS QC
		},
		gen1: {
			desc: "Sin efecto adicional.", // NEEDS QC
			shortDesc: "Sin efecto adicional.", // NEEDS QC
		},
	},
	gyroball: {
		name: "Giro Bola",
		// Official flavor text: "Embiste al objetivo con un potente ataque giratorio. Cuanto más lento es el usuario, más daño causa."
		desc: "La potencia es (25×Velocidad actual del objetivo÷Velocidad actual del usuario)+1 (redondeado hacia abajo, máximo 150). Si la Velocidad actual del usuario es 0, la potencia es 1.", // NEEDS QC
		shortDesc: "Más potencia cuanto más lento sea que el objetivo.", // NEEDS QC
		gen5: {
			desc: "La potencia es (25 × Velocidad actual del objetivo ÷ Velocidad actual del usuario) + 1, redondeado hacia abajo, con un máximo de 150. Si la Velocidad actual del usuario es 0, se trata como 1.", // NEEDS QC
		},
	},
	hail: {
		name: "Granizo",
		// Official flavor text: "Tormenta de granizo que dura cinco turnos. Hiere a todos los Pokémon excepto a los de tipo Hielo."
		desc: "Durante 5 turnos, cae granizo: al final de cada turno salvo el último, todos los Pokémon en combate pierden 1/16 de sus PS máximos (redondeado hacia abajo), salvo los de tipo Hielo o con las habilidades Gélido, Muro Mágico, Funda, Manto Níveo. Dura 8 turnos con Roca Helada. Falla si ya graniza.", // NEEDS QC
		shortDesc: "5 turnos: cae granizo.", // NEEDS QC
		gen4: {
			desc: "Durante 5 turnos graniza. Al final de cada turno salvo el último, todos los Pokémon activos pierden 1/16 de sus PS máximos (redondeado hacia abajo), salvo los de tipo Hielo o con las habilidades Gélido, Muro Mágico o Manto Níveo. Dura 8 turnos si el usuario lleva Roca Helada. Falla si ya graniza.", // NEEDS QC
		},
		gen3: {
			desc: "Durante 5 turnos graniza. Al final de cada turno salvo el último, todos los Pokémon activos pierden 1/16 de sus PS máximos (redondeado hacia abajo), salvo los de tipo Hielo. Falla si ya graniza.", // NEEDS QC
		},
	},
	hammerarm: {
		name: "Machada",
		// Official flavor text: "Gira con fuerza el puño y da un gran golpe. No obstante, baja la Velocidad."
		desc: "Baja 1 nivel la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Velocidad del usuario.", // NEEDS QC
	},
	happyhour: {
		name: "Paga Extra",
		shortDesc: "Sin uso competitivo.", // NEEDS QC

		activate: "  ¡La felicidad se respira en el aire!",
	},
	harden: {
		name: "Fortaleza",
		// Official flavor text: "Tensa la musculatura del usuario para aumentar la Defensa."
		desc: "Sube 1 nivel la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Defensa del usuario.", // NEEDS QC
	},
	hardpress: {
		name: "Prensa Metálica",
		desc: "La potencia es 100×(PS actuales del objetivo÷PS máximos del objetivo) (redondeado a la baja desde 0,5, mínimo 1).", // NEEDS QC
		shortDesc: "Más potencia cuantos más PS le queden al objetivo.", // NEEDS QC
	},
	haze: {
		name: "Niebla",
		// Official flavor text: "Neblina que elimina los cambios de características de todos los Pokémon en combate."
		desc: "Elimina los cambios de características de todos los Pokémon en combate.", // NEEDS QC
		shortDesc: "Elimina todos los cambios de características.", // NEEDS QC
		gen1: {
			desc: "Restablece a 0 los niveles de características de ambos Pokémon y elimina las reducciones debidas a quemadura y parálisis. Restablece a 0 los contadores de Tóxico y elimina los efectos de la confusión y de Rayo Confuso, Anulación, Foco Energía, Drenadoras, Pantalla de Luz, Neblina, Reflejo de ambos Pokémon. Elimina el problema de estado del rival.", // NEEDS QC
			shortDesc: "Elimina los cambios de stats. Cura el estado rival.", // NEEDS QC
		},

		// Only used in Gen 1
		activate: "  ¡Eliminado TODO cambio de ESTADO!",
	},
	headbutt: {
		name: "Golpe Cabeza",
		// Official flavor text: "Potente cabezazo que puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	headcharge: {
		name: "Ariete",
		// Official flavor text: "Propina un tremendo cabezazo. También daña al usuario un poco."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso de 1/4 del daño.", // NEEDS QC
	},
	headlongrush: {
		name: "Arremetida",
		desc: "Baja 1 nivel la Defensa y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Defensa y Def. Esp. del usuario.", // NEEDS QC
	},
	headsmash: {
		name: "Testarazo",
		// Official flavor text: "El usuario arriesga su vida y lanza un cabezazo con toda su fuerza. El agresor resulta seriamente dañado."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de la mitad del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso de la mitad del daño.", // NEEDS QC
		gen4: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a la mitad de los PS perdidos (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		},
	},
	healbell: {
		name: "Cascabel Cura",
		// Official flavor text: "Tañido que cura los problemas de estado de todos los Pokémon del equipo."
		desc: "Cura los problemas de estado de todo el equipo del usuario. Los Pokémon en combate con la habilidad Insonorizar no se curan, salvo el propio usuario.", // NEEDS QC
		shortDesc: "Cura los estados de todo el equipo del usuario.", // NEEDS QC
		gen7: {
			desc: "Todos los Pokémon del equipo del usuario se curan de sus problemas de estado. Los Pokémon activos con la habilidad Insonorizar no se curan.", // NEEDS QC
		},
		gen5: {
			desc: "Todos los Pokémon del equipo del usuario se curan de sus problemas de estado. Los Pokémon activos con la habilidad Insonorizar también se curan.", // NEEDS QC
		},
		gen4: {
			desc: "Todos los Pokémon del equipo del usuario se curan de sus problemas de estado. Los Pokémon con la habilidad Insonorizar no se curan.", // NEEDS QC
		},
		gen2: {
			desc: "Cura los problemas de estado de todo el equipo del usuario.", // NEEDS QC
		},

		activate: "  Ha repicado un cascabel.",
	},
	healblock: {
		name: "Anticura",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Durante 5 turnos, el objetivo no puede recuperar PS mientras siga en combate. Durante el efecto, no puede usar movimientos curativos ni de drenado, y las habilidades y objetos curativos no lo curan. Si un afectado usa Relevo, el sustituto tampoco puede recuperar PS. Divide Dolor y la habilidad Regeneración no se ven afectados.", // NEEDS QC
		shortDesc: "5 turnos: los rivales no pueden curarse.", // NEEDS QC
		gen8: {
			end: "  ¡Se han pasado los efectos de Anticura en {POKEMON}!",
			cant: "¡{POKEMON} no puede usar {MOVE} debido a Anticura!",
		},
		gen7: {
			desc: "Durante 5 turnos, el objetivo no puede recuperar PS mientras siga en combate. Mientras dura, los movimientos de curación y drenado son inutilizables, y las habilidades y objetos que curan no surten efecto. Si un Pokémon afectado usa Relevo, el sustituto sigue sin poder recuperar PS. Divide Dolor y la habilidad Regeneración no se ven afectados. Los movimientos Z afectados pueden seguir eligiéndose y ejecutándose durante este efecto.", // NEEDS QC
		},
		gen6: {
			desc: "Durante 5 turnos, el objetivo no puede recuperar PS mientras siga en combate. Durante el efecto, no puede usar movimientos curativos ni de drenado, y las habilidades y objetos curativos no lo curan. Si un afectado usa Relevo, el sustituto tampoco puede recuperar PS. Divide Dolor y la habilidad Regeneración no se ven afectados.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 5 turnos, el objetivo no puede recuperar PS mientras siga en combate. Mientras dura, los movimientos de curación son inutilizables y los efectos curativos de los movimientos no actúan, pero las habilidades y objetos siguen curando. Si un Pokémon afectado usa Relevo, el sustituto sigue bajo el efecto. Divide Dolor no se ve afectado.", // NEEDS QC
		},

		start: "  ¡{POKEMON} no puede curarse!",
		end: "  ¡{POKEMON} ya puede curarse!",
		cant: "¡{POKEMON} no puede usar {MOVE} porque se ha anulado la curación!",
		fail: "  Pero no ha afectado a {POKEMON}...",
	},
	healingwish: {
		name: "Deseo Cura",
		// Official flavor text: "El Pokémon cae debilitado, pero su sustituto recupera su estado y los PS."
		desc: "El usuario se debilita y, si el Pokémon que entra en su lugar no tiene todos sus PS o sufre un problema de estado, se cura por completo. El reemplazo entra al final del turno y la curación ocurre antes que las trampas. El efecto continúa hasta que un Pokémon que cumpla las condiciones entre en esa posición o llegue a ella con Cambio de Banda. Falla si el usuario es el último Pokémon sano de su equipo.", // NEEDS QC
		shortDesc: "Se debilita y cura por completo al siguiente dañado.", // NEEDS QC
		gen7: {
			desc: "El usuario se debilita y el Pokémon que lo reemplaza recupera todos sus PS y se cura de su problema de estado. El nuevo Pokémon sale al final del turno, y la curación ocurre antes de que actúen las trampas. Falla si el usuario es el último Pokémon no debilitado de su equipo.", // NEEDS QC
			shortDesc: "El usuario se debilita. El relevo se cura del todo.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario se debilita y el Pokémon que lo reemplaza recupera todos sus PS y se cura de su problema de estado. El nuevo Pokémon sale de inmediato, y la curación ocurre después de que actúen las trampas. Falla si el usuario es el último Pokémon no debilitado de su equipo.", // NEEDS QC
		},

		heal: "  ¡El deseo de curación se ha hecho realidad para {POKEMON}!",
	},
	healorder: {
		name: "Auxilio",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El usuario recupera la mitad de sus PS máximos (redondeado al alza desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		},
	},
	healpulse: {
		name: "Pulso Cura",
		// Official flavor text: "Una onda curativa restaura la mitad de los PS máximos del objetivo."
		desc: "El objetivo recupera la mitad de sus PS máximos (redondeado al alza desde 0,5). Si el usuario tiene la habilidad Megadisparador, recupera 3/4 (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El objetivo recupera la mitad de sus PS máximos.", // NEEDS QC
		gen5: {
			desc: "El objetivo recupera la mitad de sus PS máximos (redondeado al alza desde 0,5).", // NEEDS QC
		},
	},
	heartstamp: {
		name: "Arrumaco",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	heartswap: {
		name: "Cambiaalmas",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El usuario intercambia con el objetivo todos sus cambios de características.", // NEEDS QC
		shortDesc: "Intercambia todos los cambios de características.", // NEEDS QC
	},
	heatcrash: {
		name: "Golpe Calor",
		// Official flavor text: "El usuario ataca con su cuerpo ardiente. Cuanto mayor sea su peso comparado con el del objetivo, más daño causará."
		desc: "La potencia depende de (peso del usuario÷peso del objetivo) (redondeado hacia abajo): 120 si es 5 o más, 100 si es 4, 80 si es 3, 60 si es 2 y 40 si es 1 o menos. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "Más potencia cuanto más pese frente al objetivo.", // NEEDS QC
		gen5: {
			desc: "La potencia depende de (peso del usuario ÷ peso del objetivo), redondeado hacia abajo. Es 120 si el resultado es 5 o más, 100 si es 4, 80 si es 3, 60 si es 2 y 40 si es 1 o menos.", // NEEDS QC
		},
	},
	heatwave: {
		name: "Onda Ígnea",
		// Official flavor text: "Provoca un viento abrasador que puede quemar al objetivo."
		desc: "10% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "10% de quemar al objetivo.", // NEEDS QC
	},
	heavyslam: {
		name: "Cuerpo Pesado",
		// Official flavor text: "El usuario golpea con todo su cuerpo. Cuanto mayor sea su peso comparado con el del objetivo, más daño causará."
		desc: "La potencia depende de (peso del usuario÷peso del objetivo) (redondeado hacia abajo): 120 si es 5 o más, 100 si es 4, 80 si es 3, 60 si es 2 y 40 si es 1 o menos. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "Más potencia cuanto más pese frente al objetivo.", // NEEDS QC
		gen6: {
			desc: "La potencia depende de (peso del usuario ÷ peso del objetivo), redondeado hacia abajo. Es 120 si el resultado es 5 o más, 100 si es 4, 80 si es 3, 60 si es 2 y 40 si es 1 o menos.", // NEEDS QC
		},
	},
	helpinghand: {
		name: "Refuerzo",
		// Official flavor text: "El usuario ayuda a un aliado reforzando la potencia de su ataque."
		desc: "La potencia del ataque del aliado se multiplica por 1,5 este turno (efecto acumulable). Falla si el usuario no tiene un aliado adyacente o si este ya actuó, pero no si el aliado está usando un movimiento de dos turnos.", // NEEDS QC
		shortDesc: "El movimiento de un aliado tiene 1,5x más potencia.", // NEEDS QC

		start: "  ¡{SOURCE} está listo para ayudar a {POKEMON}!",
	},
	hex: {
		name: "Infortunio",
		// Official flavor text: "Ataque que causa un gran daño a los objetivos que sufren problemas de estado."
		desc: "La potencia se duplica si el objetivo tiene un problema de estado.", // NEEDS QC
		shortDesc: "Potencia doble contra objetivos con estado alterado.", // NEEDS QC
	},
	hiddenpower: {
		name: "Poder Oculto",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Su tipo depende de los IV del usuario y puede ser cualquiera salvo Hada y Normal.", // NEEDS QC
		shortDesc: "Su tipo varía según los IV del usuario.", // NEEDS QC
		gen5: {
			desc: "El tipo y la potencia de este movimiento dependen de los IV del usuario. La potencia varía entre 30 y 70, y el tipo puede ser cualquiera salvo Normal.", // NEEDS QC
			shortDesc: "Potencia y tipo varían según los IV.", // NEEDS QC
		},
	},
	hiddenpowerbug: {
		name: "Poder Oculto Bicho", // NEEDS QC
	},
	hiddenpowerdark: {
		name: "Poder Oculto Siniestro", // NEEDS QC
	},
	hiddenpowerdragon: {
		name: "Poder Oculto Dragón", // NEEDS QC
	},
	hiddenpowerelectric: {
		name: "Poder Oculto Eléctrico", // NEEDS QC
	},
	hiddenpowerfighting: {
		name: "Poder Oculto Lucha", // NEEDS QC
	},
	hiddenpowerfire: {
		name: "Poder Oculto Fuego", // NEEDS QC
	},
	hiddenpowerflying: {
		name: "Poder Oculto Volador", // NEEDS QC
	},
	hiddenpowerghost: {
		name: "Poder Oculto Fantasma", // NEEDS QC
	},
	hiddenpowergrass: {
		name: "Poder Oculto Planta", // NEEDS QC
	},
	hiddenpowerground: {
		name: "Poder Oculto Tierra", // NEEDS QC
	},
	hiddenpowerice: {
		name: "Poder Oculto Hielo", // NEEDS QC
	},
	hiddenpowerpoison: {
		name: "Poder Oculto Veneno", // NEEDS QC
	},
	hiddenpowerpsychic: {
		name: "Poder Oculto Psíquico", // NEEDS QC
	},
	hiddenpowerrock: {
		name: "Poder Oculto Roca", // NEEDS QC
	},
	hiddenpowersteel: {
		name: "Poder Oculto Acero", // NEEDS QC
	},
	hiddenpowerwater: {
		name: "Poder Oculto Agua", // NEEDS QC
	},
	highhorsepower: {
		name: "Fuerza Equina",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	highjumpkick: {
		name: "Patada Salto Alta",
		// Official flavor text: "El usuario salta muy alto y da un rodillazo. Si falla, se hará daño."
		desc: "Si el ataque falla, el usuario pierde la mitad de sus PS máximos (redondeado hacia abajo) por el impacto. Los Pokémon con la habilidad Muro Mágico no sufren este daño.", // NEEDS QC
		shortDesc: "Si falla, el usuario pierde la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "Si el ataque falla, el usuario pierde como daño de caída la mitad de los PS máximos del objetivo (redondeado hacia abajo) si este era inmune; si no, la mitad del daño que habría recibido el objetivo (redondeado hacia abajo, mínimo 1 PS y máximo la mitad de los PS máximos del objetivo). Los Pokémon con la habilidad Muro Mágico no sufren daño de caída.", // NEEDS QC
			shortDesc: "Si falla, el usuario sufre 1/2 del daño previsto.", // NEEDS QC
		},
		gen3: {
			desc: "Si el ataque falla y el objetivo no era inmune, el usuario pierde como daño de caída la mitad del daño que habría recibido el objetivo (redondeado hacia abajo, mínimo 1 PS y máximo la mitad de los PS máximos del objetivo).", // NEEDS QC
			shortDesc: "Si falla, el usuario sufre 1/2 del daño previsto.", // NEEDS QC
		},
		gen2: {
			desc: "Si el ataque falla y el objetivo no era inmune, el usuario pierde como daño de caída 1/8 del daño que habría recibido el objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "Si falla, el usuario sufre 1/8 del daño previsto.", // NEEDS QC
		},
		gen1: {
			desc: "Si el ataque no acierta, el usuario sufre 1 PS de daño de caída. Si el usuario tiene un sustituto, ese daño se inflige al sustituto del objetivo si lo tiene; si no, no hay daño de caída.", // NEEDS QC
			shortDesc: "Si falla, el usuario pierde 1 PS.", // NEEDS QC
		},

		damage: "#crash",
	},
	holdback: {
		name: "Clemencia",
		// Official flavor text: "El usuario se contiene a la hora de atacar y deja al objetivo con al menos 1 PS."
		desc: "Deja al objetivo con al menos 1 PS.", // NEEDS QC
		shortDesc: "Siempre deja al objetivo con al menos 1 PS.", // NEEDS QC
	},
	holdhands: {
		name: "Manos Juntas",
		// Official flavor text: "El Pokémon le da la mano a un aliado y ambos se sienten muy felices."
		desc: "Sin uso competitivo. Falla si el usuario no tiene un aliado adyacente.", // NEEDS QC
		shortDesc: "Sin uso competitivo.", // NEEDS QC
	},
	honeclaws: {
		name: "Afilagarras",
		// Official flavor text: "El usuario se afila las garras para aumentar su Ataque y Precisión."
		desc: "Sube 1 nivel el Ataque y la precisión del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Ataque y precisión del usuario.", // NEEDS QC
	},
	hornattack: {
		name: "Cornada",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	horndrill: {
		name: "Perforador",
		// Official flavor text: "Ataque con un cuerno giratorio que fulmina de un solo golpe al objetivo si lo alcanza."
		desc: "Debilita al objetivo de un golpe (daño igual a sus PS máximos). Ignora los cambios de precisión y evasión. Su precisión es (nivel del usuario−nivel del objetivo+30)% y falla si el objetivo tiene mayor nivel. Los Pokémon con la habilidad Robustez son inmunes.", // NEEDS QC
		shortDesc: "Debilita de un golpe. Falla contra niveles mayores.", // NEEDS QC
		gen2: {
			desc: "Inflige 65535 puntos de daño al objetivo. La precisión de este movimiento sobre 256 es el menor de (2 × (nivel del usuario − nivel del objetivo) + 76) y 255, antes de aplicar los modificadores de precisión y evasión. Falla si el objetivo es de nivel superior.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige 65535 puntos de daño al objetivo. Falla si la Velocidad del objetivo es mayor que la del usuario.", // NEEDS QC
			shortDesc: "65535 de daño. Falla si el objetivo es más rápido.", // NEEDS QC
		},
	},
	hornleech: {
		name: "Asta Drenaje",
		// Official flavor text: "Un golpe que drena energía. El Pokémon recupera la mitad de los PS arrebatados al objetivo."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
	},
	howl: {
		name: "Aullido",
		// Official flavor text: "Aullido que sube el ánimo y aumenta el Ataque del equipo."
		desc: "Sube 1 nivel el Ataque del usuario y de todos sus aliados.", // NEEDS QC
		shortDesc: "Sube 1 nivel el Ataque del usuario y su aliado.", // NEEDS QC
		gen7: {
			desc: "Sube 1 nivel el Ataque del usuario.", // NEEDS QC
			shortDesc: "Sube 1 nivel Ataque del usuario.", // NEEDS QC
		},
	},
	hurricane: {
		name: "Vendaval",
		// Official flavor text: "Golpea al objetivo con un fuerte torbellino que envuelve al rival y puede confundirlo."
		desc: "30% de probabilidad de confundir al objetivo. Puede golpear a objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre. No puede fallar si llueve o hay diluvio. Con sol o luz solar extrema, su precisión es del 50%. Contra un objetivo con Parasol Multiuso, sigue siendo del 70%.", // NEEDS QC
		shortDesc: "30% de confundir. No falla con lluvia.", // NEEDS QC
		gen7: {
			desc: "30% de probabilidad de confundir al objetivo. Puede golpear a un objetivo que use Bote, Vuelo o Caída Libre, o bajo el efecto de Caída Libre. Con diluvio o lluvia, no comprueba la precisión. Con sol abrasador o sol, su precisión es del 50%.", // NEEDS QC
		},
		gen5: {
			desc: "30% de probabilidad de confundir al objetivo. Puede golpear a un objetivo que use Bote, Vuelo o Caída Libre, o bajo el efecto de Caída Libre. Con lluvia, no comprueba la precisión. Con sol, su precisión es del 50%.", // NEEDS QC
		},
	},
	hydrocannon: {
		name: "Hidrocañón",
		// Official flavor text: "Disparo de agua. El atacante debe descansar el siguiente turno."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	hydropump: {
		name: "Hidrobomba",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	hydrosteam: {
		name: "Hidrovapor",
		desc: "Si hace sol y el usuario no lleva Parasol Multiuso, el daño se multiplica por 1,5 en lugar de reducirse a la mitad por ser de tipo Agua.", // NEEDS QC
		shortDesc: "Con sol: 1,5x de daño en lugar de la mitad.", // NEEDS QC
	},
	hydrovortex: {
		name: "Hidrovórtice Abisal",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	hyperbeam: {
		name: "Hiperrayo",
		// Official flavor text: "Es eficaz, pero el atacante deberá descansar en el siguiente turno."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
		gen1: {
			desc: "Si acierta, el usuario debe recargar el siguiente turno y no puede elegir movimiento, salvo que el objetivo o su sustituto se hayan debilitado con este movimiento.", // NEEDS QC
			shortDesc: "Descansa el próximo turno si el objetivo no cae.", // NEEDS QC
		},
	},
	hyperdrill: {
		name: "Hipertaladro",
		shortDesc: "Atraviesa las protecciones sin romperlas.", // NEEDS QC
	},
	hyperfang: {
		name: "Hipercolmillo",
		// Official flavor text: "Ataca con agudos colmillos. Puede amedrentar al objetivo."
		desc: "10% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "10% de hacer retroceder al objetivo.", // NEEDS QC
	},
	hyperspacefury: {
		name: "Cerco Dimensión",
		// Official flavor text: "Ataca al objetivo con una ráfaga de golpes que pasan por alto los efectos de movimientos como Protección o Detección. Baja la Defensa del usuario."
		desc: "Baja 1 nivel la Defensa del usuario. Solo puede usarse si la forma actual del usuario (contando Transformación) es Hoopa Desatado. Si acierta, rompe este turno la protección de Búnker, Detección, Escudo Real, Protección, Barrera Espinosa del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad. Si el bando del objetivo está protegido por Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia, esa protección también se rompe este turno.", // NEEDS QC
		shortDesc: "Hoopa Desatado: -1 Defensa; rompe protecciones.", // NEEDS QC
		gen6: {
			desc: "Baja 1 nivel la Defensa del usuario. Solo puede usarse si la forma actual del usuario, considerando Transformación, es Hoopa Desatado. Si acierta, rompe Detección, Escudo Real, Protección, Barrera Espinosa del objetivo este turno, permitiendo a los demás Pokémon atacarlo con normalidad. Si el bando del objetivo está protegido por Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia, esa protección también se rompe este turno.", // NEEDS QC
		},

		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		name: "Paso Dimensional",
		// Official flavor text: "El usuario aparece junto al rival usando un agujero dimensional y le asesta un golpe que movimientos como Protección o Detección no pueden evitar."
		desc: "Si acierta, rompe este turno la protección de Búnker, Detección, Escudo Real, Protección, Barrera Espinosa del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad. Si el bando del objetivo está protegido por Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia, esa protección también se rompe este turno.", // NEEDS QC
		shortDesc: "Rompe la protección del objetivo este turno.", // NEEDS QC
		gen6: {
			desc: "Si acierta, rompe Detección, Escudo Real, Protección o Barrera Espinosa del objetivo este turno, permitiendo a los demás Pokémon atacarlo con normalidad. Si el bando del objetivo está protegido por Truco Defensa, Escudo Tatami, Anticipo o Vasta Guardia, esa protección también se rompe este turno.", // NEEDS QC
		},

		activate: "#shadowforce",
	},
	hypervoice: {
		name: "Vozarrón",
		// Official flavor text: "Grito desgarrador que inflige daño al objetivo."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	hypnosis: {
		name: "Hipnosis",
		shortDesc: "Duerme al objetivo.", // NEEDS QC
	},
	iceball: {
		name: "Bola Hielo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Si acierta, el usuario queda fijado en este movimiento hasta que falle, pasen 5 turnos o no pueda usarse. La potencia se duplica con cada acierto, y otra vez si el usuario usó antes Rizo Defensa. Si lo llama Sonámbulo, se usa durante 1 turno.", // NEEDS QC
		shortDesc: "Potencia doble por golpe. Se repite 5 turnos.", // NEEDS QC
		gen7: {
			desc: "Si acierta, el usuario queda fijado en este movimiento y no puede usar otro hasta que falle, pasen 5 turnos o el ataque no pueda usarse. La potencia se duplica con cada golpe exitoso y se duplica de nuevo si el usuario usó antes Rizo Defensa. Si se usa mediante Sonámbulo, se usa durante un turno. Si golpea un Disfraz activo durante el efecto, el multiplicador de potencia se pausa pero el contador de turnos no, lo que puede permitir aplicar el multiplicador al siguiente movimiento del usuario tras acabar el efecto.", // NEEDS QC
		},
		gen6: {
			desc: "Si acierta, el usuario queda fijado en este movimiento hasta que falle, pasen 5 turnos o no pueda usarse. La potencia se duplica con cada acierto, y otra vez si el usuario usó antes Rizo Defensa. Si lo llama Sonámbulo, se usa durante 1 turno.", // NEEDS QC
		},
	},
	icebeam: {
		name: "Rayo Hielo",
		// Official flavor text: "Rayo de hielo que puede llegar a congelar."
		desc: "10% de probabilidad de congelar al objetivo.", // NEEDS QC
		shortDesc: "10% de congelar al objetivo.", // NEEDS QC
	},
	iceburn: {
		name: "Llama Gélida",
		// Official flavor text: "Ataca al objetivo en el segundo turno rodeándolo de un aire gélido. Puede causar quemaduras."
		desc: "30% de probabilidad de quemar al objetivo. Carga el primer turno y golpea el segundo. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Carga y golpea el turno 2. 30% de quemar.", // NEEDS QC

		prepare: "  ¡Una ráfaga gélida envuelve a {POKEMON}!",
	},
	icefang: {
		name: "Colmillo Hielo",
		// Official flavor text: "El usuario muerde al objetivo con colmillos helados y puede hacer que se amedrente o se congele."
		desc: "10% de probabilidad de congelar al objetivo y 10% de hacerlo retroceder.", // NEEDS QC
		shortDesc: "10% de congelar. 10% de hacer retroceder.", // NEEDS QC
	},
	icehammer: {
		name: "Martillo Hielo",
		// Official flavor text: "Un terrible puño golpea al contrincante, pero la Velocidad del usuario se ve reducida."
		desc: "Baja 1 nivel la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Velocidad del usuario.", // NEEDS QC
	},
	icepunch: {
		name: "Puño Hielo",
		// Official flavor text: "Puñetazo helado que puede llegar a congelar."
		desc: "10% de probabilidad de congelar al objetivo.", // NEEDS QC
		shortDesc: "10% de congelar al objetivo.", // NEEDS QC
	},
	iceshard: {
		name: "Esquirla Helada",
		// Official flavor text: "Crea bolas de hielo y las lanza a gran velocidad. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	icespinner: {
		name: "Pirueta Helada",
		desc: "Termina los efectos de los campos eléctrico, de hierba, de niebla y psíquico.", // NEEDS QC
		shortDesc: "Termina los efectos del campo.", // NEEDS QC
	},
	iciclecrash: {
		name: "Chuzos",
		// Official flavor text: "Lanza grandes carámbanos. Puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	iciclespear: {
		name: "Carámbano",
		// Official flavor text: "Ataca lanzando de dos a cinco ráfagas consecutivas de carámbanos."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
	},
	icywind: {
		name: "Viento Hielo",
		// Official flavor text: "Ataque con aire helado que baja la Velocidad de los rivales."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel la Velocidad de los rivales.", // NEEDS QC
		gen2: {
			shortDesc: "100% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
		},
	},
	imprison: {
		name: "Sellar",
		// Official flavor text: "Impide a los contrincantes usar ataques conocidos por el usuario durante el combate."
		desc: "Mientras el usuario siga en combate, los rivales no pueden usar los movimientos que el usuario también conoce.", // NEEDS QC
		shortDesc: "Los rivales no pueden usar sus mismos movimientos.", // NEEDS QC
		gen7: {
			desc: "Mientras el usuario siga en combate, los rivales no pueden usar los movimientos que el usuario también conoce. Los movimientos potenciados con Poder Z pueden seguir eligiéndose y ejecutándose durante el efecto.", // NEEDS QC
		},
		gen6: {
			desc: "Mientras el usuario siga en combate, los rivales no pueden usar los movimientos que el usuario también conoce.", // NEEDS QC
		},
		gen4: {
			desc: "Mientras el usuario siga en combate, los rivales no pueden usar los movimientos que el usuario también conoce. Falla si ningún rival conoce alguno de los movimientos del usuario.", // NEEDS QC
		},

		start: "  ¡Los movimientos de los rivales que {POKEMON} también conoce han sido sellados!",
		cant: "¡{POKEMON} no puede usar el movimiento {MOVE} porque ha sido sellado!",
	},
	incinerate: {
		name: "Calcinación",
		// Official flavor text: "Llamas que golpean a los objetivos adyacentes. Si estos llevan bayas o ciertos objetos, se quemarán y ya no se podrán usar."
		desc: "El objetivo pierde su objeto si es una baya o una gema. No puede hacer que los Pokémon con la habilidad Viscosidad pierdan su objeto. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		shortDesc: "Destruye la baya o gema de los rivales.", // NEEDS QC
		gen5: {
			desc: "El objetivo pierde su objeto si es una baya. No puede hacer que los Pokémon con la habilidad Viscosidad pierdan su objeto. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
			shortDesc: "Destruye la baya de los rivales.", // NEEDS QC
		},

		removeItem: "  ¡{ITEM:definite:capitalize} de {POKEMON} se ha calcinado!",
	},
	infernalparade: {
		name: "Marcha Espectral",
		desc: "30% de probabilidad de quemar al objetivo. La potencia se duplica si el objetivo tiene un problema de estado.", // NEEDS QC
		shortDesc: "30% de quemar. Doble contra estados alterados.", // NEEDS QC
	},
	inferno: {
		name: "Infierno",
		// Official flavor text: "Ataca con una gran ráfaga de fuego que causa quemaduras."
		desc: "100% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "100% de quemar al objetivo.", // NEEDS QC
	},
	infernooverdrive: {
		name: "Hecatombe Pírica",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	infestation: {
		name: "Acoso",
		// Official flavor text: "Hostiga al objetivo durante cuatro o cinco turnos e impide que pueda huir mientras tanto."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},

		start: "  ¡{POKEMON} es presa del acoso de {SOURCE}!",
	},
	ingrain: {
		name: "Arraigo",
		// Official flavor text: "Echa raíces para recuperar PS en cada turno, pero impide el relevo."
		desc: "El usuario recupera 1/16 de sus PS máximos al final de cada turno, pero no puede cambiarse ni ser obligado a hacerlo por otros Pokémon. Puede cambiarse usando Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. Si deja el campo con Relevo, el sustituto sigue atrapado y con el efecto curativo. Durante el efecto, los ataques de tipo Tierra lo golpean con normalidad y le afectan Púas, Púas Tóxicas, Red Viscosa, aunque sea de tipo Volador o tenga la habilidad Levitación.", // NEEDS QC
		shortDesc: "Se enraíza: +1/16 de PS por turno, no puede cambiarse.", // NEEDS QC
		gen7: {
			desc: "El usuario recupera 1/16 de sus PS máximos al final de cada turno, pero no puede cambiarse y los demás Pokémon no pueden obligarlo a cambiarse. Puede cambiarse igualmente si usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Si deja el campo con Relevo, el sustituto sigue atrapado y sigue recibiendo la curación. Mientras dura el efecto, el usuario puede ser golpeado con normalidad por ataques de tipo Tierra y verse afectado por Púas, Púas Tóxicas y Red Viscosa, aunque sea de tipo Volador o tenga la habilidad Levitación.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario recupera 1/16 de sus PS máximos al final de cada turno, pero no puede cambiarse y los demás Pokémon no pueden obligarlo a cambiarse. Puede cambiarse igualmente si usa Relevo, Ida y Vuelta, Voltiocambio. Si deja el campo con Relevo, el sustituto sigue atrapado y sigue recibiendo la curación. Mientras dura el efecto, el usuario puede ser golpeado con normalidad por ataques de tipo Tierra y verse afectado por Púas y Púas Tóxicas, aunque sea de tipo Volador o tenga la habilidad Levitación.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario recupera 1/16 de sus PS máximos al final de cada turno, pero no puede cambiarse y los demás Pokémon no pueden obligarlo a cambiarse. Puede cambiarse igualmente si usa Relevo, Ida y Vuelta. Si deja el campo con Relevo, el sustituto sigue atrapado y sigue recibiendo la curación. Mientras dura el efecto, el usuario puede ser golpeado con normalidad por ataques de tipo Tierra y verse afectado por Púas y Púas Tóxicas, aunque sea de tipo Volador o tenga la habilidad Levitación.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario recupera 1/16 de sus PS máximos al final de cada turno, pero no puede cambiarse y los demás Pokémon no pueden obligarlo a cambiarse. Puede cambiarse igualmente si usa Relevo; el sustituto sigue atrapado y sigue recibiendo la curación.", // NEEDS QC
			shortDesc: "Recupera 1/16 por turno. No puede cambiarse.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha echado raíces!",
		block: "  ¡{POKEMON} se ha fijado al suelo con sus raíces!",
		heal: "  ¡{POKEMON} ha absorbido nutrientes a través de las raíces!",
	},
	instruct: {
		name: "Mandato",
		// Official flavor text: "Fuerza al objetivo a repetir inmediatamente su último movimiento."
		desc: "El objetivo usa de inmediato su último movimiento. Falla si el objetivo no ha usado ninguno, si el movimiento tiene 0 PP, si el objetivo prepara Pico Cañón, Puño Certero, Coraza Trampa o si el movimiento es Ayuda, Pico Cañón, Eructo, Venganza, Pirochoque, Celebración, Cháchara, Pugnachoque, Copión, Cañón Dinamax, Puño Certero, Manos Juntas, Bola Hielo, Mandato, Escudo Real, Feerichoque, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Ponzochoque, Obstrucción, Enfado, Danza Pétalo, Rodar, Coraza Trampa, Esquema, Sonámbulo, Forcejeo, Saña, Transformación, Alboroto, Ominochoque, un movimiento de dos turnos o uno de recarga.", // NEEDS QC
		shortDesc: "El objetivo repite de inmediato su último movimiento.", // NEEDS QC
		gen8: {
			desc: "El objetivo usa de inmediato su último movimiento. Falla si el objetivo no ha actuado, si el movimiento tiene 0 PP, si el objetivo está dinamaxizado, si está preparando Pico Cañón, Puño Certero o Coraza Trampa, o si el movimiento es Ayuda, Pico Cañón, Eructo, Venganza, Celebración, Cháchara, Copión, Cañón Dinamax, Puño Certero, Manos Juntas, Bola Hielo, Mandato, Escudo Real, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Obstrucción, Enfado, Danza Pétalo, Rodar, Coraza Trampa, Esquema, Sonámbulo, Forcejeo, Saña, Transformación, Alboroto, un movimiento de dos turnos, uno que requiere recarga, o un movimiento Dinamax o Gigamax.", // NEEDS QC
		},
		gen7: {
			desc: "El objetivo usa de inmediato su último movimiento. Falla si el objetivo no ha actuado, si el movimiento tiene 0 PP, si está preparando Pico Cañón, Puño Certero o Coraza Trampa, o si el movimiento es Ayuda, Pico Cañón, Eructo, Venganza, Celebración, Cháchara, Copión, Puño Certero, Manos Juntas, Bola Hielo, Mandato, Escudo Real, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Enfado, Danza Pétalo, Rodar, Coraza Trampa, Esquema, Sonámbulo, Forcejeo, Saña, Transformación, Alboroto, un movimiento de dos turnos, uno que requiere recarga, o un movimiento Z.", // NEEDS QC
		},

		activate: "  ¡{TARGET} sigue el mandato de {POKEMON} y repite su último movimiento!",
	},
	iondeluge: {
		name: "Cortina Plasma",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Los movimientos de tipo Normal pasan a ser de tipo Eléctrico este turno. El efecto se aplica después de otros efectos que cambian el tipo.", // NEEDS QC
		shortDesc: "Los movimientos Normales son Eléctricos este turno.", // NEEDS QC

		activate: "  ¡Una lluvia de electrones cae sobre el terreno de combate!",
	},
	irondefense: {
		name: "Defensa Férrea",
		// Official flavor text: "Fortalece el cuerpo como si fuera de hierro y sube mucho la Defensa."
		desc: "Sube 2 niveles la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Defensa del usuario.", // NEEDS QC
	},
	ironhead: {
		name: "Cabeza de Hierro",
		// Official flavor text: "Ataca con su dura cabeza de hierro. Puede hacer que el objetivo se amedrente."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	irontail: {
		name: "Cola Férrea",
		// Official flavor text: "Ataca con una cola férrea y puede bajar la Defensa del objetivo."
		desc: "30% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "30% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	ivycudgel: {
		name: "Garrote Liana",
		desc: "Alta probabilidad de golpe crítico (índice +1). Si el usuario es un Ogerpon, su tipo cambia según su forma: Agua con la Máscara Fuente, Fuego con la Máscara Horno y Roca con la Máscara Cimiento.", // NEEDS QC
		shortDesc: "Alta prob. de crítico. Tipo según su forma.", // NEEDS QC
	},
	jawlock: {
		name: "Presa Maxilar",
		// Official flavor text: "Impide que tanto el atacante como el defensor puedan ser intercambiados hasta que uno de ellos se debilite o abandone el terreno de combate."
		desc: "Impide que el usuario y el objetivo se cambien. Pueden cambiarse igualmente si llevan Muda Concha o usan Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si alguno deja el campo.", // NEEDS QC
		shortDesc: "Ni el usuario ni el objetivo pueden cambiarse.", // NEEDS QC
	},
	jetpunch: {
		name: "Puño Jet",
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	judgment: {
		name: "Sentencia",
		// Official flavor text: "Emite incontables haces de luz. El tipo del movimiento varía según la tabla que lleve el usuario."
		desc: "Su tipo depende de la tabla que lleve el usuario.", // NEEDS QC
		shortDesc: "Su tipo depende de la tabla que lleve.", // NEEDS QC
	},
	jumpkick: {
		name: "Patada Salto",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Si el ataque falla, el usuario pierde la mitad de sus PS máximos (redondeado hacia abajo) por el impacto. Los Pokémon con la habilidad Muro Mágico no sufren este daño.", // NEEDS QC
		shortDesc: "Si falla, el usuario pierde la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "Si el ataque falla, el usuario pierde como daño de caída la mitad de los PS máximos del objetivo (redondeado hacia abajo) si este era inmune; si no, la mitad del daño que habría recibido el objetivo (redondeado hacia abajo, mínimo 1 PS y máximo la mitad de los PS máximos del objetivo). Los Pokémon con la habilidad Muro Mágico no sufren daño de caída.", // NEEDS QC
			shortDesc: "Si falla, el usuario sufre 1/2 del daño previsto.", // NEEDS QC
		},
		gen3: {
			desc: "Si el ataque falla y el objetivo no era inmune, el usuario pierde como daño de caída la mitad del daño que habría recibido el objetivo (redondeado hacia abajo, mínimo 1 PS y máximo la mitad de los PS máximos del objetivo).", // NEEDS QC
			shortDesc: "Si falla, el usuario sufre 1/2 del daño previsto.", // NEEDS QC
		},
		gen2: {
			desc: "Si el ataque falla y el objetivo no era inmune, el usuario pierde como daño de caída 1/8 del daño que habría recibido el objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "Si falla, el usuario sufre 1/8 del daño previsto.", // NEEDS QC
		},
		gen1: {
			desc: "Si el ataque no acierta, el usuario sufre 1 PS de daño de caída. Si el usuario tiene un sustituto, ese daño se inflige al sustituto del objetivo si lo tiene; si no, no hay daño de caída.", // NEEDS QC
			shortDesc: "Si falla, el usuario pierde 1 PS.", // NEEDS QC
		},

		damage: "#crash",
	},
	junglehealing: {
		name: "Cura Selvática",
		// Official flavor text: "Al entrar en plena armonía con la selva, el usuario cura problemas de estado y restaura PS no solo de sí mismo, sino también de los aliados presentes en el terreno."
		desc: "Cada Pokémon del bando del usuario recupera 1/4 de sus PS máximos (redondeado al alza desde 0,5) y se cura de sus problemas de estado.", // NEEDS QC
		shortDesc: "Usuario y aliados: +1/4 de PS y estados curados.", // NEEDS QC
	},
	karatechop: {
		name: "Golpe Kárate",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	kinesis: {
		name: "Kinético",
		// Official flavor text: "Dobla una cuchara para distraer al objetivo y bajar su nivel de Precisión."
		desc: "Baja 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel precisión del objetivo.", // NEEDS QC
	},
	kingsshield: {
		name: "Escudo Real",
		// Official flavor text: "El usuario adopta una postura defensiva y se protege de cualquier daño. Reduce el Ataque de cualquier Pokémon con el que entre en contacto."
		desc: "Protege al usuario de la mayoría de los movimientos este turno y baja 1 nivel el Ataque de los Pokémon que intenten hacer contacto con él. Los movimientos que no causan daño lo atraviesan. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege de ataques. Contacto: -1 Ataque.", // NEEDS QC
		gen8: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno, y los Pokémon que intenten hacer contacto con él ven su Ataque reducido 1 nivel. Los movimientos de estado atraviesan esta protección. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen7: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno, y los Pokémon que intenten hacer contacto con él ven su Ataque reducido 2 niveles. Los movimientos de estado atraviesan esta protección. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
			shortDesc: "Protege de ataques. Contacto: -2 Ataque.", // NEEDS QC
		},
		gen6: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno, y los Pokémon que intenten hacer contacto con él ven su Ataque reducido 2 niveles. Los movimientos de estado atraviesan esta protección. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
	},
	knockoff: {
		name: "Desarme",
		// Official flavor text: "Impide al objetivo usar el objeto que lleva durante el combate. La potencia del movimiento se multiplica si el objetivo lleva un objeto."
		desc: "La potencia se multiplica por 1,5 si el objetivo lleva objeto, y este lo pierde si el usuario no se ha debilitado. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. La potencia no aumenta ni se pierde el objeto si es Prisma Azul, Prisma Rojo, Gran Diamansfera, Gran Lustresfera, Gran Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada, Escudo Oxidado, Energía Potenciadora o una máscara en poder de Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradoja u Ogerpon, respectivamente, ni si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Aquí, los Pokémon Paradoja son todas las especies con las habilidades Paleosíntesis y Carga Cuark, salvo Flamariete, Electrofuria, Ferromole, Ferrotesta. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		shortDesc: "1,5x si el rival lleva objeto, y se lo quita.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "La potencia se multiplica por 1,5 si el objetivo lleva un objeto, y el objetivo pierde su objeto si el usuario no se ha debilitado. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. La potencia no aumenta ni se pierde el objeto si es Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada o Escudo Oxidado llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen7: {
			desc: "La potencia se multiplica por 1,5 si el objetivo lleva un objeto, y el objetivo pierde su objeto si el usuario no se ha debilitado. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. La potencia no aumenta ni se pierde el objeto si es un Cristal Z, una megapiedra llevada por la especie que puede megaevolucionar con ella, o Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho o un disco llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen6: {
			desc: "La potencia se multiplica por 1,5 si el objetivo lleva un objeto, y el objetivo pierde su objeto si el usuario no se ha debilitado. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. La potencia no aumenta ni se pierde el objeto si es una megapiedra llevada por la especie que puede megaevolucionar con ella, o Prisma Azul, Prisma Rojo, Griseosfera, una tabla o un cartucho llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen5: {
			desc: "Si el usuario no se ha debilitado, el objetivo pierde su objeto. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se pierde si es Griseosfera, una tabla o un cartucho llevados, respectivamente, por Giratina, Arceus o Genesect, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
			shortDesc: "Elimina el objeto del objetivo.", // NEEDS QC
		},
		gen4: {
			desc: "El objetivo pierde su objeto durante el resto del combate, salvo si el objeto es Griseosfera o el objetivo tiene la habilidad Multitipo o Viscosidad. Mientras dura el efecto, el objetivo no puede obtener un objeto nuevo de ninguna forma.", // NEEDS QC
			shortDesc: "El objetivo pierde su objeto y no obtiene otro.", // NEEDS QC
		},
		gen3: {
			desc: "El objetivo pierde su objeto durante el resto del combate, salvo si tiene la habilidad Viscosidad. Mientras dura el efecto, el objetivo no puede obtener un objeto nuevo de ninguna forma.", // NEEDS QC
		},

		removeItem: "  ¡{SOURCE} ha tirado al suelo {ITEM:definite:classified} de {POKEMON}!",
	},
	kowtowcleave: {
		name: "Genufendiente",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	landswrath: {
		name: "Fuerza Telúrica",
		// Official flavor text: "Acumula energía de la corteza terrestre y la concentra contra los oponentes, dañándolos."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	laserfocus: {
		name: "Aguzar",
		// Official flavor text: "El usuario se concentra para que el siguiente ataque propine un golpe crítico."
		desc: "Hasta el final del próximo turno, los ataques del usuario serán golpes críticos.", // NEEDS QC
		shortDesc: "Hasta el fin del próximo turno, sus golpes son críticos.", // NEEDS QC

		start: "  ¡{POKEMON} aguza la mente!",
	},
	lashout: {
		name: "Desahogo",
		// Official flavor text: "Ataca al rival presa de la rabia. Si el usuario ha sufrido una reducción de características en ese turno, la potencia del movimiento se duplica."
		desc: "La potencia se duplica si las características del usuario bajaron este turno.", // NEEDS QC
		shortDesc: "Potencia doble si le bajaron algo este turno.", // NEEDS QC
	},
	lastresort: {
		name: "Última Baza",
		// Official flavor text: "Este movimiento solo puede utilizarse tras haber usado al menos una vez todos los demás conocidos por el Pokémon."
		desc: "Falla salvo que el usuario conozca este movimiento y al menos otro más, y haya usado todos los demás al menos una vez desde que entró en combate o se transformó.", // NEEDS QC
		shortDesc: "Falla si no ha usado ya sus demás movimientos.", // NEEDS QC
	},
	lastrespects: {
		name: "Homenaje Póstumo",
		desc: "La potencia es 50+(X×50), donde X es el número total de veces que un Pokémon del bando del usuario se ha debilitado (máximo 100).", // NEEDS QC
		shortDesc: "+50 de potencia por cada compañero debilitado.", // NEEDS QC
	},
	lavaplume: {
		name: "Humareda",
		// Official flavor text: "Un infierno de llamas daña a los Pokémon adyacentes en combate. Puede quemar."
		desc: "30% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "30% de quemar a los Pokémon adyacentes.", // NEEDS QC
	},
	leafage: {
		name: "Follaje",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	leafblade: {
		name: "Hoja Aguda",
		// Official flavor text: "Acuchilla con una hoja fina. Suele dar un golpe crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	leafstorm: {
		name: "Lluevehojas",
		// Official flavor text: "Envuelve al objetivo con una lluvia de hojas afiladas, pero reduce mucho su Ataque Especial."
		desc: "Baja 2 niveles el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 2 niveles At. Esp. del usuario.", // NEEDS QC
	},
	leaftornado: {
		name: "Ciclón de Hojas",
		// Official flavor text: "Tritura con afiladas hojas y puede bajar la Precisión del objetivo."
		desc: "50% de probabilidad de bajar 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel precisión del objetivo.", // NEEDS QC
	},
	leechlife: {
		name: "Chupavidas",
		// Official flavor text: "Restaura al usuario la mitad del daño causado al objetivo."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja). Si el usuario lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja).", // NEEDS QC
		},
		gen3: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja).", // NEEDS QC
		},
	},
	leechseed: {
		name: "Drenadoras",
		// Official flavor text: "Planta semillas que absorben PS del objetivo en cada turno y que le sirven para recuperarse."
		desc: "Al final de cada turno, el Pokémon en la posición del usuario drena 1/8 de los PS máximos del objetivo (redondeado hacia abajo). Si el receptor lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5). Si el objetivo usa Relevo, el sustituto sigue siendo drenado. El efecto termina si el objetivo se cambia o usa con éxito Giro Mortífero o Giro Rápido. Los Pokémon de tipo Planta son inmunes al movimiento, pero no a su efecto.", // NEEDS QC
		shortDesc: "Drena 1/8 de los PS del objetivo cada turno.", // NEEDS QC
		gen8: {
			desc: "El Pokémon en la posición del usuario roba 1/8 de los PS máximos del objetivo (redondeado hacia abajo) al final de cada turno. Si el receptor lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5). Si el objetivo usa Relevo, el sustituto sigue siendo drenado. Si el objetivo se cambia o usa Giro Rápido con éxito, el efecto termina. Los Pokémon de tipo Planta son inmunes a este movimiento al usarse, pero no a su efecto.", // NEEDS QC
		},
		gen3: {
			desc: "El Pokémon en la posición del usuario roba 1/8 de los PS máximos del objetivo (redondeado hacia abajo) al final de cada turno. Si el objetivo usa Relevo, el sustituto sigue siendo drenado. Si el objetivo se cambia o usa Giro Rápido, el efecto termina. Los Pokémon de tipo Planta son inmunes a este movimiento al usarse, pero no a su efecto.", // NEEDS QC
		},
		gen1: {
			desc: "Al final de cada turno del objetivo, el Pokémon en la posición del usuario roba 1/16 de los PS máximos del objetivo (redondeado hacia abajo y multiplicado por su contador de Tóxico si lo tiene), incluso si el objetivo tiene menos PS restantes. Si el objetivo se cambia o algún Pokémon usa Niebla, el efecto termina. Los Pokémon de tipo Planta son inmunes a este movimiento.", // NEEDS QC
			shortDesc: "Roba 1/16 de los PS del objetivo cada turno.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha sido infectado!",
		end: "  ¡{POKEMON} se ha liberado de Drenadoras!",
		damage: "  ¡Las drenadoras han restado salud a {POKEMON}!",
	},
	leer: {
		name: "Malicioso",
		// Official flavor text: "Intimida a los rivales para bajar su Defensa."
		desc: "Baja 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel la Defensa de los rivales.", // NEEDS QC
		gen2: {
			shortDesc: "Baja 1 nivel la Defensa del objetivo.", // NEEDS QC
		},
	},
	letssnuggleforever: {
		name: "Somanta Amistosa",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	lick: {
		name: "Lengüetazo",
		// Official flavor text: "Una lengua ataca al objetivo. Puede causar parálisis."
		desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "30% de paralizar al objetivo.", // NEEDS QC
	},
	lifedew: {
		name: "Gota Vital",
		// Official flavor text: "Vierte un agua misteriosa y balsámica que restaura tanto sus propios PS como los de aquellos aliados presentes en el terreno de combate."
		desc: "Cada Pokémon del bando del usuario recupera 1/4 de sus PS máximos (redondeado al alza desde 0,5).", // NEEDS QC
		shortDesc: "El usuario y sus aliados recuperan 1/4 de sus PS.", // NEEDS QC
	},
	lightofruin: {
		name: "Luz Aniquiladora",
		// Official flavor text: "El usuario emplea el poder de la Flor Eterna para lanzar un potente rayo de luz, pero sufre bastante daño al hacerlo."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de la mitad del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso de la mitad del daño.", // NEEDS QC
	},
	lightscreen: {
		name: "Pantalla de Luz",
		// Official flavor text: "Pared de luz que reduce durante cinco turnos el daño producido por los ataques especiales."
		desc: "Durante 5 turnos, el usuario y sus aliados reciben 0,5 veces el daño de ataques especiales (0,66 en combates dobles). No se acumula con Velo Aurora. Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición, Psicocolmillo, Despejar. Dura 8 turnos con Refleluz. Falla si ya está activo en su bando.", // NEEDS QC
		shortDesc: "5 turnos: daño especial a los aliados a la mitad.", // NEEDS QC
		gen6: {
			desc: "Durante 5 turnos, el usuario y sus aliados reciben 0,5 veces el daño de ataques especiales (0,66 en combates dobles o triples). Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición o Despejar. Dura 8 turnos con Refleluz. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 5 turnos, el usuario y sus aliados reciben 1/2 del daño de ataques especiales (2/3 si hay varios Pokémon activos en el bando del usuario). Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición o Despejar. Dura 8 turnos con Refleluz. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
		},
		gen3: {
			desc: "Durante 5 turnos, el usuario y sus aliados reciben 1/2 del daño de ataques especiales (2/3 si hay varios Pokémon activos en el bando del usuario). Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 5 turnos, el usuario y sus aliados tienen su Defensa Especial duplicada. Los golpes críticos ignoran este efecto. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
			shortDesc: "5 turnos: duplica la Def. Esp. del equipo.", // NEEDS QC
		},
		gen1: {
			desc: "Mientras el usuario siga en combate, su Especial se duplica al recibir daño. Los golpes críticos ignoran este efecto. Si algún Pokémon usa Niebla, el efecto termina.", // NEEDS QC
			shortDesc: "Mientras está activo, Especial x2 al recibir daño.", // NEEDS QC
			start: "  ¡{POKEMON} está protegido contra ataques especiales!",
		},

		start: "  ¡Pantalla de Luz ha aumentado la resistencia de {TEAM} ante los ataques especiales!",
		end: "  El efecto de Pantalla de Luz en {TEAM} se ha disipado.",
	},
	lightthatburnsthesky: {
		name: "Fotodestrucción Apocalíptica",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Se convierte en ataque físico si el Ataque del usuario es mayor que su Ataque Especial, incluidos los cambios de nivel. Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Físico si Ataque > At. Esp. Ignora habilidades.", // NEEDS QC
	},
	liquidation: {
		name: "Hidroariete",
		// Official flavor text: "Ataca golpeando gracias a la fuerza del agua. También puede reducir la Defensa del objetivo."
		desc: "20% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "20% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	lockon: {
		name: "Fijar Blanco",
		// Official flavor text: "Fija el blanco para que el siguiente ataque no falle."
		desc: "Hasta el final del próximo turno, el objetivo no puede esquivar los movimientos del usuario, ni siquiera en mitad de un movimiento de dos turnos. El efecto termina si alguno deja el campo. Falla si el usuario ya tiene este efecto.", // NEEDS QC
		shortDesc: "Su próximo movimiento no fallará contra el objetivo.", // NEEDS QC
		gen4: {
			desc: "Hasta el final del siguiente turno, el objetivo no puede evitar los movimientos del usuario, ni siquiera en medio de un movimiento de dos turnos. Cuando este efecto empieza contra el objetivo, este efecto y el de Telépata terminan para los demás Pokémon contra ese objetivo. Si el objetivo deja el campo con Relevo, el sustituto sigue afectado. Si el usuario deja el campo con Relevo, el efecto se reinicia contra el mismo objetivo para su sustituto. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		},
		gen2: {
			desc: "El siguiente cálculo de precisión contra el objetivo acierta. El objetivo aún evita Terremoto, Fisura y Magnitud si está usando Vuelo. Si el objetivo deja el campo con Relevo, el sustituto sigue afectado. El efecto termina cuando el objetivo deja el campo o se hace un cálculo de precisión contra él.", // NEEDS QC
			shortDesc: "El próximo movimiento no fallará.", // NEEDS QC
		},

		start: "  ¡{SOURCE} tiene en su punto de mira a {POKEMON}!",
	},
	lovelykiss: {
		name: "Beso Amoroso",
		shortDesc: "Duerme al objetivo.", // NEEDS QC
	},
	lowkick: {
		name: "Patada Baja",
		// Official flavor text: "Patada baja que derriba al oponente. Cuanto más pesa el objetivo, más daño le causa."
		desc: "La potencia depende del peso del objetivo: 20 si pesa menos de 10 kg, 40 si menos de 25 kg, 60 si menos de 50 kg, 80 si menos de 100 kg, 100 si menos de 200 kg y 120 si pesa 200 kg o más.", // NEEDS QC
		shortDesc: "Más potencia cuanto más pese el objetivo.", // NEEDS QC
		gen2: {
			desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
			shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		},
	},
	lowsweep: {
		name: "Puntapié",
		// Official flavor text: "Ataque rápido dirigido a los pies del objetivo que le hace perder Velocidad."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
	},
	luckychant: {
		name: "Conjuro",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Durante 5 turnos, el usuario y sus compañeros no pueden recibir golpes críticos. Falla si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "5 turnos: su equipo no recibe golpes críticos.", // NEEDS QC

		start: "  ¡Conjuro protege a {TEAM} de los golpes críticos!",
		end: "  El efecto de Conjuro en {TEAM} se ha desvanecido.",
	},
	luminacrash: {
		name: "Fotocolisión",
		desc: "100% de probabilidad de bajar 2 niveles la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 2 niveles Def. Esp. del objetivo.", // NEEDS QC
	},
	lunarblessing: {
		name: "Plegaria Lunar",
		desc: "Cada Pokémon del bando del usuario recupera 1/4 de sus PS máximos (redondeado al alza desde 0,5) y se cura de sus problemas de estado.", // NEEDS QC
		shortDesc: "Usuario y aliados: +1/4 de PS y estados curados.", // NEEDS QC
	},
	lunardance: {
		name: "Danza Lunar",
		// Official flavor text: "El usuario se debilita, pero el Pokémon que lo sustituye recupera su estado, los PS y los PP."
		desc: "El usuario se debilita y, si el Pokémon que entra en su lugar no tiene todos sus PS o PP o sufre un problema de estado, se cura por completo (PS y PP incluidos). El reemplazo entra al final del turno y la curación ocurre antes que las trampas. El efecto continúa hasta que un Pokémon que cumpla las condiciones entre en esa posición o llegue a ella con Cambio de Banda. Falla si el usuario es el último Pokémon sano de su equipo.", // NEEDS QC
		shortDesc: "Se debilita; el siguiente dañado se cura del todo.", // NEEDS QC
		gen7: {
			desc: "El usuario se debilita y el Pokémon que lo reemplaza recupera todos sus PS y PP y se cura de su problema de estado. El nuevo Pokémon sale al final del turno, y la curación ocurre antes de que actúen las trampas. Falla si el usuario es el último Pokémon no debilitado de su equipo.", // NEEDS QC
			shortDesc: "Se debilita. El relevo se cura del todo, con PP.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario se debilita y el Pokémon que lo reemplaza recupera todos sus PS y PP y se cura de su problema de estado. El nuevo Pokémon sale de inmediato, y la curación ocurre después de que actúen las trampas. Falla si el usuario es el último Pokémon no debilitado de su equipo.", // NEEDS QC
		},

		heal: "  ¡Un místico halo de luz de luna envuelve a {POKEMON}!",
	},
	lunge: {
		name: "Plancha",
		// Official flavor text: "Ataca al oponente abalanzándose sobre él con todas sus fuerzas y reduce su Ataque."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	lusterpurge: {
		name: "Resplandor",
		// Official flavor text: "Fogonazo de luz que puede bajar la Defensa Especial del objetivo."
		desc: "50% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	machpunch: {
		name: "Ultrapuño",
		// Official flavor text: "Puñetazo de velocidad fulminante. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	magicalleaf: {
		name: "Hoja Mágica",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	magicaltorque: {
		name: "Feerichoque",
		desc: "30% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "30% de confundir al objetivo.", // NEEDS QC
	},
	magiccoat: {
		name: "Capa Mágica",
		// Official flavor text: "Barrera capaz de devolver al agresor movimientos como Drenadoras y otros que alteran el estado o las características."
		desc: "Hasta el final del turno, el usuario no se ve afectado por ciertos movimientos que no causan daño dirigidos a él y los devuelve contra su usuario original. Los movimientos devueltos no pueden volver a devolverse con este efecto ni con la habilidad Espejo Mágico. Púas, Trampa Rocas, Red Viscosa, Púas Tóxicas solo pueden devolverse una vez por bando, por el Pokémon situado más a la izquierda con este efecto. Las habilidades Pararrayos y Colector atraen sus movimientos antes de que actúe este movimiento.", // NEEDS QC
		shortDesc: "Devuelve ciertos movimientos de estado.", // NEEDS QC
		gen5: {
			desc: "Hasta el final del turno, el usuario no se ve afectado por ciertos movimientos de estado dirigidos contra él y los usa en su lugar contra quien los usó. Los movimientos devueltos así no pueden devolverse de nuevo con este efecto ni con el de la habilidad Espejo Mágico. Púas, Trampa Rocas y Púas Tóxicas solo pueden devolverse una vez por bando, por el Pokémon situado más a la izquierda bajo este efecto o el de la habilidad Espejo Mágico. Las habilidades Pararrayos y Colector redirigen sus respectivos movimientos antes de que actúe este movimiento.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario no se ve afectado por ciertos movimientos de estado dirigidos contra él y los usa en su lugar contra quien los usó. Si el movimiento apunta a ambos rivales, el Pokémon bajo este efecto lo devuelve solo contra quien lo usó. El efecto termina en cuanto se devuelve un movimiento o al final del turno. Las habilidades Pararrayos y Colector redirigen sus respectivos movimientos antes de que actúe este movimiento.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario no se ve afectado por ciertos movimientos de estado dirigidos contra él y los usa en su lugar contra quien los usó. Si el movimiento apunta a ambos rivales y el Pokémon bajo este efecto está a la izquierda, lo devuelve apuntando a ambos rivales y su aliado no se ve afectado por el movimiento original; si está a la derecha, su aliado se ve afectado por el movimiento original y este Pokémon lo devuelve solo contra quien lo usó. El efecto termina en cuanto se devuelve un movimiento o al final del turno. Los movimientos devueltos así pueden ser devueltos de nuevo por otro Pokémon bajo este efecto. Si el usuario tiene la habilidad Insonorizar, esta anula los movimientos de sonido antes de que actúe este efecto. La habilidad Pararrayos redirige los movimientos de tipo Eléctrico antes de que actúe este movimiento.", // NEEDS QC
		},

		start: "  ¡{POKEMON} se ha cubierto con Capa Mágica!",
		move: "¡{POKEMON} ha devuelto {MOVE}!",
	},
	magicpowder: {
		name: "Polvo Mágico",
		// Official flavor text: "Cubre al objetivo con unos polvos mágicos que le hacen adquirir el tipo Psíquico."
		desc: "El objetivo pasa a ser de tipo Psíquico. Falla si es un Arceus o un Silvally, si ya es puramente de tipo Psíquico o si está teracristalizado.", // NEEDS QC
		shortDesc: "El objetivo pasa a ser de tipo Psíquico.", // NEEDS QC
		gen8: {
			desc: "El objetivo pasa a ser de tipo Psíquico. Falla si es un Arceus o un Silvally, o si ya es puramente de tipo Psíquico.", // NEEDS QC
		},
	},
	magicroom: {
		name: "Zona Mágica",
		// Official flavor text: "Crea un espacio misterioso que inutiliza todos los objetos de los Pokémon durante cinco turnos."
		desc: "Durante 5 turnos, los objetos de todos los Pokémon en combate no tienen efecto. Los efectos de cambio de forma se mantienen, pero el resto queda anulado. Durante el efecto, nadie puede usar Lanzamiento ni Don Natural. Si se usa durante el efecto, este termina.", // NEEDS QC
		shortDesc: "5 turnos: ningún objeto tiene efecto.", // NEEDS QC
	},
	magmastorm: {
		name: "Lluvia Ígnea",
		// Official flavor text: "El objetivo queda atrapado en una tormenta de fuego que dura de cuatro a cinco turnos."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (1/8 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa Giro Rápido. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos (siempre 5 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
			shortDesc: "Atrapa y daña al objetivo durante 2-5 turnos.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha quedado atrapado en la lluvia ígnea!",
	},
	magnetbomb: {
		name: "Bomba Imán",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	magneticflux: {
		name: "Aura Magnética",
		// Official flavor text: "Manipula el campo magnético y logra aumentar la Defensa y la Defensa Especial de los Pokémon aliados que cuenten con las habilidades Más y Menos."
		desc: "Sube 1 nivel la Defensa y la Defensa Especial de los aliados con las habilidades Más o Menos.", // NEEDS QC
		shortDesc: "+1 Def. y Def. Esp. a aliados con Más o Menos.", // NEEDS QC
	},
	magnetrise: {
		name: "Levitón",
		// Official flavor text: "Levita gracias a un campo magnético generado por electricidad durante cinco turnos."
		desc: "Durante 5 turnos, el usuario es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena mientras siga en combate. Si usa Relevo, el sustituto hereda el efecto. Arraigo, Antiaéreo, Mil Flechas y Bola Férrea tienen prioridad sobre este movimiento. Falla si el usuario ya tiene este efecto o los de Arraigo, Antiaéreo, Mil Flechas.", // NEEDS QC
		shortDesc: "5 turnos: el usuario es inmune al tipo Tierra.", // NEEDS QC
		gen5: {
			desc: "Durante 5 turnos, el usuario es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas y la habilidad Trampa Arena mientras siga en combate. Si usa Relevo, el sustituto hereda el efecto. Arraigo, Antiaéreo y Bola Férrea tienen prioridad sobre este movimiento. Falla si el usuario ya tiene este efecto o los de Arraigo, Antiaéreo.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 5 turnos, el usuario es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas y la habilidad Trampa Arena mientras siga en combate. Si usa Relevo, el sustituto hereda el efecto. Arraigo y Bola Férrea tienen prioridad sobre este movimiento. Falla si el usuario ya tiene este efecto o el de Arraigo.", // NEEDS QC
		},

		start: "  ¡{POKEMON} levita gracias a un campo electromagnético!",
		end: "  ¡El campo electromagnético de {POKEMON} se ha disipado!",
	},
	magnitude: {
		name: "Magnitud",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia varía: 5% de probabilidad de 10 y de 150, 10% de 30 y de 110, 20% de 50 y de 90, y 30% de 70. El daño se duplica contra objetivos usando Excavar.", // NEEDS QC
		shortDesc: "Golpea adyacentes. Potencia varía; doble en Excavar.", // NEEDS QC
		gen4: {
			desc: "La potencia varía: 5% de probabilidad de 10 y de 150, 10% de 30 y de 110, 20% de 50 y de 90, y 30% de 70. La potencia se duplica contra objetivos usando Excavar.", // NEEDS QC
		},

		activate: "  ¡Magnitud {NUMBER}!",
	},
	makeitrain: {
		name: "Fiebre Dorada",
		desc: "Baja 1 nivel el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "-1 At. Esp. del usuario. Golpea a los rivales.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "#payday",
	},
	maliciousmoonsault: {
		name: "Hiperplancha Oscura",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "Daño doble si el objetivo usó Reducción.", // NEEDS QC
	},
	malignantchain: {
		name: "Cadena Virulenta",
		desc: "50% de probabilidad de envenenar gravemente al objetivo.", // NEEDS QC
		shortDesc: "50% de envenenar gravemente al objetivo.", // NEEDS QC
	},
	matblock: {
		name: "Escudo Tatami",
		// Official flavor text: "El usuario usa un tatami para escudarse de los ataques enemigos. Protege también a los aliados. No funciona contra movimientos de estado."
		desc: "El usuario y sus compañeros quedan protegidos de los movimientos que causan daño de otros Pokémon, incluidos aliados, este turno. Falla si no es el primer turno del usuario en combate, si actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "Protege a los aliados de ataques. Solo el turno 1.", // NEEDS QC

		start: "  ¡{POKEMON} va a usar un tatami para bloquear ataques!",
		block: "  ¡Escudo Tatami neutraliza {MOVE}!",
	},
	matchagotcha: {
		name: "Cañón Batidor",
		desc: "20% de probabilidad de quemar al objetivo. El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5); con Raíz Grande, 1,3 veces más (redondeado a la baja desde 0,5). Descongela al objetivo.", // NEEDS QC
		shortDesc: "20% de quemar. Recupera la mitad. Descongela.", // NEEDS QC
	},
	maxairstream: {
		name: "Maxiciclón",
		// Official flavor text: "Ataque de tipo Volador ejecutado por un Pokémon Dinamax. Aumenta la Velocidad de tu bando."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, la Velocidad de los aliados sube 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: +1 Velocidad.", // NEEDS QC
	},
	maxdarkness: {
		name: "Maxisombra",
		// Official flavor text: "Ataque de tipo Siniestro ejecutado por un Pokémon Dinamax. Reduce la Defensa Especial del objetivo."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, la Defensa Especial de los rivales baja 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1 Def. Esp.", // NEEDS QC
	},
	maxflare: {
		name: "Maxignición",
		// Official flavor text: "Ataque de tipo Fuego ejecutado por un Pokémon Dinamax. Hace que se intensifique el efecto del sol durante cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de sol. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Invoca el sol.", // NEEDS QC
	},
	maxflutterby: {
		name: "Maxinsecto",
		// Official flavor text: "Ataque de tipo Bicho ejecutado por un Pokémon Dinamax. Reduce el Ataque Especial del objetivo."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, el Ataque Especial de los rivales baja 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1 At. Esp.", // NEEDS QC
	},
	maxgeyser: {
		name: "Maxichorro",
		// Official flavor text: "Ataque de tipo Agua ejecutado por un Pokémon Dinamax. Desata un aguacero que dura cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de lluvia. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Invoca la lluvia.", // NEEDS QC
	},
	maxguard: {
		name: "Maxibarrera",
		// Official flavor text: "Frena todos los ataques, pero puede fallar si se usa repetidamente."
		desc: "Protege al usuario de casi todos los movimientos este turno, incluidos los Maximovimientos y movimientos Gigamax. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege incluso de los Maximovimientos este turno.", // NEEDS QC

		activate: "  ¡{POKEMON} se ha protegido!",
	},
	maxhailstorm: {
		name: "Maxihelada",
		// Official flavor text: "Ataque de tipo Hielo ejecutado por un Pokémon Dinamax. Crea una tormenta de granizo que dura cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de Granizo. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Invoca el granizo.", // NEEDS QC
	},
	maxknuckle: {
		name: "Maxipuño",
		// Official flavor text: "Ataque de tipo Lucha ejecutado por un Pokémon Dinamax. Aumenta el Ataque de tu bando."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, el Ataque de los aliados sube 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: +1 Ataque.", // NEEDS QC
	},
	maxlightning: {
		name: "Maxitormenta",
		// Official flavor text: "Ataque de tipo Eléctrico ejecutado por un Pokémon Dinamax. Crea un campo eléctrico durante cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de Campo Eléctrico. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Crea campo eléctrico.", // NEEDS QC
	},
	maxmindstorm: {
		name: "Maxionda",
		// Official flavor text: "Ataque de tipo Psíquico ejecutado por un Pokémon Dinamax. Crea un campo psíquico durante cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de Campo Psíquico. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Crea campo psíquico.", // NEEDS QC
	},
	maxooze: {
		name: "Maxiácido",
		// Official flavor text: "Ataque de tipo Veneno ejecutado por un Pokémon Dinamax. Aumenta el Ataque Especial de tu bando."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, el Ataque Especial de los aliados sube 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: +1 At. Esp.", // NEEDS QC
	},
	maxovergrowth: {
		name: "Maxiflora",
		// Official flavor text: "Ataque de tipo Planta ejecutado por un Pokémon Dinamax. Crea un campo de hierba durante cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de Campo de Hierba. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Crea campo de hierba.", // NEEDS QC
	},
	maxphantasm: {
		name: "Maxiespectro",
		// Official flavor text: "Ataque de tipo Fantasma ejecutado por un Pokémon Dinamax. Reduce la Defensa de los rivales."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, la Defensa de los rivales baja 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1 Defensa.", // NEEDS QC
	},
	maxquake: {
		name: "Maxitemblor",
		// Official flavor text: "Ataque de tipo Tierra ejecutado por un Pokémon Dinamax. Aumenta la Defensa Especial de tu bando."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, la Defensa Especial de los aliados sube 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: +1 Def. Esp.", // NEEDS QC
	},
	maxrockfall: {
		name: "Maxilito",
		// Official flavor text: "Ataque de tipo Roca ejecutado por un Pokémon Dinamax. Levanta una tormenta de arena que dura cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de Tormenta de Arena. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Invoca tormenta de arena.", // NEEDS QC
	},
	maxstarfall: {
		name: "Maxiestela",
		// Official flavor text: "Ataque de tipo Hada ejecutado por un Pokémon Dinamax. Crea un campo de niebla durante cinco turnos."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, se activa el efecto de Campo de Niebla. No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Crea campo de niebla.", // NEEDS QC
	},
	maxsteelspike: {
		name: "Maximetal",
		// Official flavor text: "Ataque de tipo Acero ejecutado por un Pokémon Dinamax. Aumenta la Defensa de tu bando."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, la Defensa de los aliados sube 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Aliados: +1 Defensa.", // NEEDS QC
	},
	maxstrike: {
		name: "Maxiataque",
		// Official flavor text: "Ataque de tipo Normal ejecutado por un Pokémon Dinamax. Reduce la Velocidad del objetivo."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, la Velocidad de los rivales baja 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1 Velocidad.", // NEEDS QC
	},
	maxwyrmwind: {
		name: "Maxidraco",
		// Official flavor text: "Ataque de tipo Dragón ejecutado por un Pokémon Dinamax. Reduce el Ataque del objetivo."
		desc: "Su potencia es la del Maximovimiento base. Si acierta, el Ataque de los rivales baja 1 nivel (incluso tras un sustituto). No ocurre si el usuario no está dinamaxeado. Usado como movimiento base, inflige daño con potencia 0.", // NEEDS QC
		shortDesc: "Potencia según mov. base. Rivales: -1 Ataque.", // NEEDS QC
	},
	meanlook: {
		name: "Mal de Ojo",
		// Official flavor text: "Mal de ojo que impide al objetivo huir del combate."
		desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Impide que el objetivo se cambie.", // NEEDS QC
		gen7: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo, salvo que use Relevo: en ese caso el objetivo sigue atrapado.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si usa Relevo. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo, salvo que use Relevo: en ese caso el objetivo sigue atrapado.", // NEEDS QC
		},
	},
	meditate: {
		name: "Meditación",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Sube 1 nivel el Ataque del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Ataque del usuario.", // NEEDS QC
	},
	mefirst: {
		name: "Yo Primero",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El usuario usa contra el objetivo, si es posible, el movimiento que este eligió este turno, con su potencia multiplicada por 1,5. Debe ser un movimiento de daño distinto de Pico Cañón, Eructo, Pirochoque, Pugnachoque, Resarcimiento, Contraataque, Antojo, Puño Certero, Feerichoque, Yo Primero, Represión Metal, Manto Espejo, Ponzochoque, Coraza Trampa, Forcejeo, Ladrón, Ominochoque. Falla si el objetivo actúa antes que el usuario. Ignora el sustituto del objetivo al copiar el movimiento.", // NEEDS QC
		shortDesc: "Copia el movimiento rival a 1,5x. Debe ir más rápido.", // NEEDS QC
		gen8: {
			desc: "El usuario usa contra el objetivo, si es posible, el movimiento que este eligió este turno, con su potencia multiplicada por 1,5. Debe ser un movimiento de daño distinto de Pico Cañón, Eructo, Cháchara, Contraataque, Antojo, Puño Certero, Yo Primero, Represión Metal, Manto Espejo, Coraza Trampa, Forcejeo, Ladrón. Falla si el objetivo actúa antes que el usuario. Ignora el sustituto del objetivo al copiar el movimiento.", // NEEDS QC
		},
		gen7: {
			desc: "El usuario usa contra el objetivo, si es posible, el movimiento que este eligió este turno, con su potencia multiplicada por 1,5. Debe ser un movimiento de daño distinto de Pico Cañón, Eructo, Cháchara, Contraataque, Antojo, Puño Certero, Yo Primero, Represión Metal, Manto Espejo, Coraza Trampa, Forcejeo, Ladrón o cualquier movimiento Z. Falla si el objetivo actúa antes que el usuario. Ignora el sustituto del objetivo al copiar el movimiento.", // NEEDS QC
		},
		gen6: {
			desc: "El usuario usa contra el objetivo, si es posible, el movimiento que este eligió este turno, con su potencia multiplicada por 1,5. Debe ser un movimiento de daño distinto de Eructo, Cháchara, Contraataque, Antojo, Puño Certero, Yo Primero, Represión Metal, Manto Espejo, Forcejeo, Ladrón. Falla si el objetivo actúa antes que el usuario. Ignora el sustituto del objetivo al copiar el movimiento.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario usa contra el objetivo, si es posible, el movimiento que este eligió este turno, con su potencia multiplicada por 1,5. Debe ser un movimiento de daño distinto de Cháchara, Contraataque, Antojo, Puño Certero, Yo Primero, Represión Metal, Manto Espejo, Forcejeo, Ladrón. Falla si el objetivo actúa antes que el usuario. Ignora el sustituto del objetivo al copiar el movimiento.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario usa contra el objetivo, si es posible, el movimiento que este eligió este turno, con su potencia multiplicada por 1,5. Debe ser un movimiento de daño distinto de Cháchara, Contraataque, Antojo, Puño Certero, Yo Primero, Manto Espejo, Forcejeo, Ladrón. Falla si el objetivo actúa antes que el usuario. Ignora el sustituto del objetivo al copiar el movimiento.", // NEEDS QC
		},
	},
	megadrain: {
		name: "Megaagotar",
		// Official flavor text: "Un ataque que absorbe nutrientes. Quien lo usa recupera la mitad de los PS del daño que produce."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja). Si el usuario lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja).", // NEEDS QC
		},
		gen3: {
			desc: "El usuario recupera la mitad del daño infligido (redondeado a la baja).", // NEEDS QC
		},
	},
	megahorn: {
		name: "Megacuerno",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	megakick: {
		name: "Megapatada",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	megapunch: {
		name: "Megapuño",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	memento: {
		name: "Legado",
		// Official flavor text: "El usuario se debilita, pero baja mucho tanto el Ataque como el Ataque Especial del objetivo."
		desc: "Baja 2 niveles el Ataque y el Ataque Especial del objetivo. El usuario se debilita salvo que el movimiento falle o no haya objetivo. Falla por completo si golpea un sustituto, pero no si las características del objetivo no pueden cambiar.", // NEEDS QC
		shortDesc: "-2 Ataque y At. Esp. del rival. El usuario se debilita.", // NEEDS QC
		gen4: {
			desc: "Baja 2 niveles el Ataque y el Ataque Especial del objetivo. El usuario se debilita aunque el movimiento falle. Este movimiento puede golpear a objetivos en medio de un movimiento de dos turnos. Falla por completo si no hay objetivo, pero no si las características del objetivo no pueden cambiar.", // NEEDS QC
		},
		gen3: {
			desc: "Baja 2 niveles el Ataque y el Ataque Especial del objetivo. El usuario se debilita. Este movimiento no comprueba la precisión y puede golpear a objetivos en medio de un movimiento de dos turnos. Falla por completo si los niveles de Ataque y Ataque Especial del objetivo están ambos en -6.", // NEEDS QC
		},

		heal: "  ¡{POKEMON} ha recuperado PS gracias al Poder Z!",
	},
	menacingmoonrazemaelstrom: {
		name: "Deflagración Lunar",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Ignora las habilidades de otros Pokémon.", // NEEDS QC
	},
	metalburst: {
		name: "Represión Metal",
		// Official flavor text: "Devuelve al rival el último ataque recibido, pero con mucha más fuerza."
		desc: "Inflige al último rival que dañó al usuario con un ataque físico o especial este turno 1,5 veces el daño recibido (redondeado hacia abajo); si no perdió PS, inflige 1 PS. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico o especial rival este turno.", // NEEDS QC
		shortDesc: "Si lo golpean, devuelve 1,5 veces el daño.", // NEEDS QC
		gen6: {
			desc: "Inflige al último rival que dañó al usuario con un ataque físico o especial este turno 1,5 veces el daño recibido (redondeado hacia abajo); si no perdió PS, inflige daño con potencia 1. Si esa posición está vacía, daña a un rival al azar dentro del alcance. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico o especial rival este turno.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige al último rival que dañó al usuario con un ataque físico o especial este turno 1,5 veces el daño recibido (redondeado hacia abajo). Si esa posición está vacía y hay otro rival en el campo, lo daña a él. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque físico o especial rival este turno o si no perdió PS con el ataque.", // NEEDS QC
		},
	},
	metalclaw: {
		name: "Garra Metal",
		// Official flavor text: "Ataque con garras de acero que puede aumentar el Ataque del usuario."
		desc: "10% de probabilidad de subir 1 nivel el Ataque del usuario.", // NEEDS QC
		shortDesc: "10% de subir 1 nivel Ataque del usuario.", // NEEDS QC
	},
	metalsound: {
		name: "Eco Metálico",
		// Official flavor text: "Horrible chirrido metálico que baja mucho la Defensa Especial del objetivo."
		desc: "Baja 2 niveles la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles Def. Esp. del objetivo.", // NEEDS QC
	},
	meteorassault: {
		name: "Asalto Estelar",
		// Official flavor text: "El usuario agita violentamente su grueso puerro para atacar, pero el mareo que le provocan las sacudidas le impide moverse en el turno siguiente."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	meteorbeam: {
		name: "Rayo Meteórico",
		// Official flavor text: "El usuario dedica el primer turno a aumentar su Ataque Especial acumulando energía cósmica y lanza su ofensiva contra el objetivo en el segundo."
		desc: "Carga el primer turno y golpea el segundo; al cargar, sube 1 nivel el Ataque Especial del usuario. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "+1 At. Esp. el turno 1 y golpea el turno 2.", // NEEDS QC

		prepare: "¡{POKEMON} rebosa energía cósmica!",
	},
	meteormash: {
		name: "Puño Meteoro",
		// Official flavor text: "Puñetazo que impacta como un meteorito y puede subir el Ataque del agresor."
		desc: "20% de probabilidad de subir 1 nivel el Ataque del usuario.", // NEEDS QC
		shortDesc: "20% de subir 1 nivel Ataque del usuario.", // NEEDS QC
	},
	metronome: {
		name: "Metrónomo",
		// Official flavor text: "Mueve un dedo y estimula su cerebro para usar al azar casi cualquier movimiento."
		desc: "Usa un movimiento al azar, excluyendo Cede Paso, Ácido Málico, Cañón Armadura, Ayuda, Orbes Espectro, Rueda Aural, Búnker, Pico Cañón, Embate Supremo, Tajo Supremo, Eructo, Ofrenda, Pirochoque, Plancha Corporal, Punzada Rama, Vasto Impacto, Celebración, Cháchara, Agua Fría, Fría Acogida, Estruendo Escama, Nitrochoque, Pugnachoque, Resarcimiento, Copión, Contraataque, Antojo, Truco Defensa, Decoración, Mismo Destino, Detección, Tormenta de Diamantes, Decalcomanía, Ferropuño Doble, Electropalmas, Ascenso Draco, Dracoenergía, Batería Asalto, Cañón Dinamax, Electroderrape, Aguante, Rayo Infinito, Irreverencia, Amago, Furia Candente, Deslome, Cañón Floral, Puño Certero, Señuelo, Rayo Gélido, Mirada Heladora, Lanza Glacial, Fuerza G, Refuerzo, Manos Juntas, Hipertaladro, Cerco Dimensión, Paso Dimensional, Llama Gélida, Mandato, Puño Jet, Cura Selvática, Escudo Real, Gota Vital, Luz Aniquiladora, Feerichoque, Fiebre Dorada, Escudo Tatami, Yo Primero, Asalto Estelar, Metrónomo, Mimético, Cabeza Sorpresa, Manto Espejo, Espejo, Rayo Umbrío, Adaptación, Furia Natural, Ponzochoque, Obstrucción, Oído Cocina, Pulso Primigenio, Amplificador, Géiser Fotónico, Puños Plasma, Proliferación, Brinco, Cambiapoder, Filo del Abismo, Protección, Balón Ígneo, Último Lugar, Anticipo, Puño Furia, Polvo Ira, Furia Taurina, Erupción de Ira, Canto Arcaico, Plegaria Vital, Calamidad, Salazón, Sable Místico, Autotomía, Coraza Trampa, Telatrampa, Esquema, Sonámbulo, Cepo, Alarido, Robo, Ronquido, nieve, Robasombra, Extracto Picante, Barrera Espinosa, Choque Anímico, Foco, Ciclón Primavera, Chorro de Vapor, Metaláser, Cautivapor, Forcejeo, Meteoimpacto, Azote Torrencial, Trapicheo, Tecno Shock, Teraclúster, Ladrón, Mil Flechas, Mil Temblores, Electrojaula, Patada Relámpago, Limpieza General, Abrecaminos, Transformación, Truco, Láser Doble, V de Fuego, Golpe Oscuro, Ominochoque, Vasta Guardia.", // NEEDS QC
		shortDesc: "Usa un movimiento al azar.", // NEEDS QC
		gen8: {
			desc: "Usa un movimiento al azar, excluyendo Cede Paso, Ácido Málico, Ayuda, Orbes Espectro, Rueda Aural, Búnker, Pico Cañón, Embate Supremo, Tajo Supremo, Eructo, Ofrenda, Plancha Corporal, Punzada Rama, Vasto Impacto, Celebración, Cháchara, Estruendo Escama, Copión, Contraataque, Antojo, Truco Defensa, Decoración, Mismo Destino, Detección, Tormenta de Diamantes, Ferropuño Doble, Ascenso Draco, Dracoenergía, Martillo Dragón, Batería Asalto, Cañón Dinamax, Aguante, Rayo Infinito, Irreverencia, Amago, Furia Candente, Cañón Floral, Puño Certero, Señuelo, Rayo Gélido, Mirada Heladora, Lanza Glacial, Fuerza G, Refuerzo, Manos Juntas, Cerco Dimensión, Paso Dimensional, Llama Gélida, Mandato, Cura Selvática, Escudo Real, Gota Vital, Luz Aniquiladora, Escudo Tatami, Yo Primero, Asalto Estelar, Metrónomo, Mimético, Cabeza Sorpresa, Manto Espejo, Espejo, Rayo Umbrío, Adaptación, Furia Natural, Obstrucción, Pulso Primigenio, Amplificador, Géiser Fotónico, Puños Plasma, Filo del Abismo, Protección, Balón Ígneo, Último Lugar, Anticipo, Polvo Ira, Canto Arcaico, Sable Místico, Coraza Trampa, Esquema, Sonámbulo, Cepo, Alarido, Robo, Ronquido, Robasombra, Barrera Espinosa, Choque Anímico, Foco, Chorro de Vapor, Metaláser, Cautivapor, Forcejeo, Meteoimpacto, Azote Torrencial, Trapicheo, Tecno Shock, Ladrón, Mil Flechas, Mil Temblores, Electrojaula, Patada Relámpago, Transformación, Truco, V de Fuego, Golpe Oscuro, Vasta Guardia.", // NEEDS QC
		},
		gen7: {
			desc: "Usa un movimiento al azar, excluyendo Cede Paso, Ayuda, Búnker, Pico Cañón, Eructo, Ofrenda, Celebración, Cháchara, Copión, Contraataque, Antojo, Truco Defensa, Mismo Destino, Detección, Tormenta de Diamantes, Ascenso Draco, Aguante, Amago, Cañón Floral, Puño Certero, Señuelo, Rayo Gélido, Refuerzo, Manos Juntas, Cerco Dimensión, Paso Dimensional, Llama Gélida, Mandato, Escudo Real, Luz Aniquiladora, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Cabeza Sorpresa, Manto Espejo, Espejo, Adaptación, Pulso Primigenio, Géiser Fotónico, Puños Plasma, Filo del Abismo, Protección, Último Lugar, Anticipo, Polvo Ira, Canto Arcaico, Sable Místico, Coraza Trampa, Esquema, Sonámbulo, Alarido, Robo, Ronquido, Robasombra, Barrera Espinosa, Foco, Chorro de Vapor, Forcejeo, Trapicheo, Tecno Shock, Ladrón, Mil Flechas, Mil Temblores, Transformación, Truco, V de Fuego, Vasta Guardia.", // NEEDS QC
		},
		gen6: {
			desc: "Usa un movimiento al azar, excluyendo Cede Paso, Ayuda, Eructo, Ofrenda, Celebración, Cháchara, Copión, Contraataque, Antojo, Truco Defensa, Mismo Destino, Detección, Tormenta de Diamantes, Ascenso Draco, Aguante, Amago, Puño Certero, Señuelo, Rayo Gélido, Refuerzo, Manos Juntas, Cerco Dimensión, Paso Dimensional, Llama Gélida, Escudo Real, Luz Aniquiladora, Escudo Tatami, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Pulso Primigenio, Filo del Abismo, Protección, Último Lugar, Anticipo, Polvo Ira, Canto Arcaico, Sable Místico, Esquema, Sonámbulo, Alarido, Robo, Ronquido, Barrera Espinosa, Chorro de Vapor, Forcejeo, Trapicheo, Tecno Shock, Ladrón, Mil Flechas, Mil Temblores, Transformación, Truco, V de Fuego, Vasta Guardia.", // NEEDS QC
		},
		gen5: {
			desc: "Usa un movimiento al azar, excluyendo Cede Paso, Ayuda, Ofrenda, Cháchara, Copión, Contraataque, Antojo, Mismo Destino, Detección, Aguante, Amago, Puño Certero, Señuelo, Rayo Gélido, Refuerzo, Llama Gélida, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Adaptación, Protección, Último Lugar, Anticipo, Polvo Ira, Canto Arcaico, Sable Místico, Esquema, Sonámbulo, Alarido, Robo, Ronquido, Forcejeo, Trapicheo, Tecno Shock, Ladrón, Transformación, Truco, V de Fuego, Vasta Guardia.", // NEEDS QC
		},
		gen4: {
			desc: "Usa un movimiento al azar, excluyendo Ayuda, Cháchara, Copión, Contraataque, Antojo, Mismo Destino, Detección, Aguante, Amago, Puño Certero, Señuelo, Refuerzo, Yo Primero, Metrónomo, Mimético, Manto Espejo, Espejo, Protección, Esquema, Sonámbulo, Robo, Forcejeo, Trapicheo, Ladrón, Truco y los movimientos que el usuario ya conoce.", // NEEDS QC
		},
		gen3: {
			desc: "Usa un movimiento al azar, excluyendo Contraataque, Antojo, Mismo Destino, Detección, Aguante, Puño Certero, Señuelo, Refuerzo, Metrónomo, Mimético, Manto Espejo, Protección, Esquema, Sonámbulo, Robo, Forcejeo, Ladrón, Truco.", // NEEDS QC
		},
		gen2: {
			desc: "Usa un movimiento al azar, excluyendo Contraataque, Mismo Destino, Detección, Aguante, Metrónomo, Mimético, Manto Espejo, Protección, Esquema, Sonámbulo, Forcejeo, Ladrón y los movimientos que el usuario ya conoce.", // NEEDS QC
		},
		gen1: {
			desc: "Usa un movimiento al azar, excluyendo Metrónomo y Forcejeo.", // NEEDS QC
		},

		move: "¡Metrónomo actúa como {MOVE}!",
	},
	mightycleave: {
		name: "Filo Potente",
		shortDesc: "Atraviesa las protecciones sin romperlas.", // NEEDS QC
	},
	milkdrink: {
		name: "Batido",
		// Official flavor text: "Restaura la mitad de los PS máximos del usuario."
		desc: "El usuario recupera la mitad de sus PS máximos (redondeado al alza desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		},
	},
	mimic: {
		name: "Mimético",
		// Official flavor text: "Copia el último movimiento usado por el objetivo, y puede utilizarlo mientras esté en el combate."
		desc: "Mientras el usuario siga en combate, este movimiento se sustituye por el último usado por el objetivo, con sus PP al máximo. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado, si ya lo conoce o si el movimiento es Ayuda, Embate Supremo, Tajo Supremo, Eructo, Pirochoque, Celebración, Cháchara, Pugnachoque, Copión, Cañón Dinamax, Manos Juntas, Feerichoque, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Ponzochoque, Esquema, Sonámbulo, Forcejeo, Teraclúster, Transformación, Ominochoque.", // NEEDS QC
		shortDesc: "Copia el último movimiento del objetivo.", // NEEDS QC
		gen8: {
			desc: "Mientras el usuario siga en combate, este movimiento se sustituye por el último usado por el objetivo, con sus PP al máximo. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado, si ya lo conoce o si el movimiento es Embate Supremo, Tajo Supremo, Cháchara, Cañón Dinamax, Mimético, Esquema, Forcejeo, Transformación o cualquier movimiento Dinamax o Gigamax.", // NEEDS QC
		},
		gen7: {
			desc: "Mientras el usuario siga en combate, este movimiento se sustituye por el último usado por el objetivo, con sus PP al máximo. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado, si ya lo conoce o si el movimiento es Cháchara, Mimético, Esquema, Forcejeo, Transformación o cualquier movimiento Z.", // NEEDS QC
		},
		gen6: {
			desc: "Mientras el usuario siga en combate, este movimiento se sustituye por el último usado por el objetivo, con sus PP al máximo. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado, si ya lo conoce o si el movimiento es Cháchara, Mimético, Esquema, Forcejeo, Transformación.", // NEEDS QC
		},
		gen4: {
			desc: "Mientras el usuario siga en combate, este movimiento se sustituye por el último usado por el objetivo, con 5 PP. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado, si ya lo conoce o si el movimiento es Cháchara, Metrónomo, Mimético, Esquema, Forcejeo.", // NEEDS QC
		},
		gen3: {
			desc: "Mientras el usuario siga en combate, este movimiento se sustituye por el último usado por el objetivo, con 5 PP. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado, si ya lo conoce o si el movimiento es Metrónomo, Mimético, Esquema, Forcejeo.", // NEEDS QC
		},
		gen2: {
			desc: "Mientras el usuario siga en combate, este movimiento se sustituye por el último usado por el objetivo, con 5 PP. Falla si el objetivo no ha usado un movimiento, si el usuario ya lo conoce o si el movimiento es Forcejeo.", // NEEDS QC
		},
		gen1: {
			desc: "Mientras el usuario siga en combate, este movimiento se sustituye por un movimiento al azar que conozca el objetivo, aunque el usuario ya lo conozca. El movimiento copiado conserva los PP restantes de este movimiento, sin importar su máximo de PP. Cada vez que el movimiento copiado gasta 1 PP, este movimiento también gasta 1 PP.", // NEEDS QC
			shortDesc: "Se sustituye por un mov. al azar del objetivo.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha aprendido {MOVE}!",
	},
	mindblown: {
		name: "Cabeza Sorpresa",
		// Official flavor text: "El usuario hace explotar su cabeza para atacar a todos los Pokémon que se hallan a su alrededor, aunque también se hiere a sí mismo."
		desc: "Acierte o no, e incluso si eso lo debilita, el usuario pierde la mitad de sus PS máximos (redondeado hacia arriba), salvo que tenga la habilidad Muro Mágico. No se ejecuta y no pierde PS si algún Pokémon en combate tiene la habilidad Humedad, o si es de tipo Fuego y el usuario está bajo Polvo Explosivo o hay diluvio.", // NEEDS QC
		shortDesc: "Pierde la mitad de sus PS. Golpea a los adyacentes.", // NEEDS QC

		damage: "  (¡{POKEMON} ha sacrificado PS para potenciar su movimiento!)", // NEEDS QC
	},
	mindreader: {
		name: "Telépata",
		// Official flavor text: "El usuario adivina los movimientos del objetivo para hacer que su siguiente ataque no falle."
		desc: "Hasta el final del próximo turno, el objetivo no puede esquivar los movimientos del usuario, ni siquiera en mitad de un movimiento de dos turnos. El efecto termina si alguno deja el campo. Falla si el usuario ya tiene este efecto.", // NEEDS QC
		shortDesc: "Su próximo movimiento no fallará contra el objetivo.", // NEEDS QC
		gen4: {
			desc: "Hasta el final del siguiente turno, el objetivo no puede evitar los movimientos del usuario, ni siquiera en medio de un movimiento de dos turnos. Cuando este efecto empieza contra el objetivo, este efecto y el de Fijar Blanco terminan para los demás Pokémon contra ese objetivo. Si el objetivo deja el campo con Relevo, el sustituto sigue afectado. Si el usuario deja el campo con Relevo, el efecto se reinicia contra el mismo objetivo para su sustituto. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		},
		gen2: {
			desc: "El siguiente cálculo de precisión contra el objetivo acierta. El objetivo aún evita Terremoto, Fisura y Magnitud si está usando Vuelo. Si el objetivo deja el campo con Relevo, el sustituto sigue afectado. El efecto termina cuando el objetivo deja el campo o se hace un cálculo de precisión contra él.", // NEEDS QC
			shortDesc: "El próximo movimiento no fallará.", // NEEDS QC
		},

		start: "#lockon",
	},
	minimize: {
		name: "Reducción",
		// Official flavor text: "El usuario mengua para aumentar mucho la Evasión."
		desc: "Sube 2 niveles la evasión del usuario. Haya cambiado o no su evasión, mientras siga en combate Golpe Cuerpo, Carga Dragón, Plancha Voladora, Golpe Calor, Cuerpo Pesado, Hiperplancha Oscura, Rodillo de Púas, Pisotón, Plancha Voltaica no comprueban la precisión contra él y le hacen el doble de daño.", // NEEDS QC
		shortDesc: "Sube 2 niveles evasión del usuario.", // NEEDS QC
		gen8: {
			desc: "Sube 2 niveles la evasión del usuario. Haya cambiado o no su evasión, mientras siga en combate Golpe Cuerpo, Carga Dragón, Plancha Voladora, Golpe Calor, Cuerpo Pesado, Hiperplancha Oscura, Rodillo de Púas, Pisotón no comprueban la precisión contra él y le hacen el doble de daño.", // NEEDS QC
		},
		gen6: {
			desc: "Sube 2 niveles la evasión del usuario. Haya cambiado o no su evasión, mientras siga en combate Golpe Cuerpo, Carga Dragón, Plancha Voladora, Golpe Calor, Golpe Fantasma, Golpe Umbrío, Rodillo de Púas, Pisotón no comprueban la precisión contra él y le hacen el doble de daño.", // NEEDS QC
		},
		gen5: {
			desc: "Sube 2 niveles la evasión del usuario. Haya cambiado o no su evasión, mientras siga en combate Pisotón y Rodillo de Púas le hacen el doble de daño.", // NEEDS QC
		},
		gen4: {
			desc: "Sube 1 nivel la evasión del usuario. Haya cambiado o no su evasión, mientras siga en combate Pisotón tiene su potencia duplicada contra él.", // NEEDS QC
			shortDesc: "Sube 1 nivel evasión del usuario.", // NEEDS QC
		},
		gen3: {
			desc: "Sube 1 nivel la evasión del usuario. Haya cambiado o no su evasión, mientras siga en combate Impresionar, Paranormal, Brazo Pincho, Pisotón le hacen el doble de daño.", // NEEDS QC
		},
		gen2: {
			desc: "Sube 1 nivel la evasión del usuario. Haya cambiado o no su evasión, mientras siga en combate Pisotón tiene su potencia duplicada contra él. Relevo puede transferir este efecto a un compañero.", // NEEDS QC
		},
		gen1: {
			desc: "Sube 1 nivel la evasión del usuario.", // NEEDS QC
		},
	},
	miracleeye: {
		name: "Gran Ojo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Mientras el objetivo siga en combate, su evasión se ignora en las comprobaciones de precisión si es mayor que 0, y los ataques de tipo Psíquico pueden golpearlo aunque sea de tipo Siniestro. Falla si ya está afectado por este efecto o por Profecía u Rastreo.", // NEEDS QC
		shortDesc: "Psíquico golpea a Siniestro. Ignora evasión.", // NEEDS QC
		gen4: {
			desc: "Mientras el objetivo siga en combate, su evasión se ignora en las comprobaciones de precisión si es mayor que 0, y los ataques de tipo Psíquico pueden golpearlo aunque sea de tipo Siniestro.", // NEEDS QC
		},

		start: "#foresight",
	},
	mirrorcoat: {
		name: "Manto Espejo",
		// Official flavor text: "Responde a un ataque especial ocasionando el doble del daño recibido."
		desc: "Inflige al último rival que dañó al usuario con un ataque especial este turno el doble del daño recibido; si no perdió PS, inflige 1 PS. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque especial rival este turno.", // NEEDS QC
		shortDesc: "Devuelve el doble del daño de un ataque especial.", // NEEDS QC
		gen6: {
			desc: "Inflige al último rival que dañó al usuario con un ataque especial este turno el doble del daño recibido; si no perdió PS, inflige daño con potencia 1. Si esa posición está vacía, daña a un rival al azar dentro del alcance. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque especial rival este turno.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige al último rival que dañó al usuario con un ataque especial este turno el doble del daño recibido. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. De los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque especial rival este turno o si no perdió PS con el ataque.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige al último rival que dañó al usuario con un ataque especial este turno el doble del daño recibido. Si esa posición está vacía y hay otro rival en el campo, lo daña a él. Este movimiento considera Poder Oculto de tipo Normal, y de los multigolpes solo cuenta el último golpe. Falla si el usuario no recibió un ataque especial rival este turno o si no perdió PS con el ataque.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige al rival el doble de los PS que el usuario perdió por un ataque especial este turno. Este movimiento considera Poder Oculto de tipo Normal, y de los multigolpes solo cuenta el último golpe. Falla si el usuario actúa primero, si no recibió un ataque especial este turno o si no perdió PS con el ataque.", // NEEDS QC
		},
	},
	mirrormove: {
		name: "Espejo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El usuario usa el último movimiento usado por el objetivo, contra él si es posible. Falla si el objetivo no ha usado un movimiento o si el último no puede copiarse.", // NEEDS QC
		shortDesc: "Usa el último movimiento del objetivo contra él.", // NEEDS QC
		gen4: {
			desc: "El usuario usa el último movimiento que lo tuvo como objetivo con éxito. El movimiento copiado se usa sin objetivo concreto. Falla si ningún movimiento ha tenido al usuario como objetivo, si el movimiento fue llamado por otro movimiento, si el movimiento es Otra Vez o si no puede copiarse con este movimiento.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario usa el último movimiento que lo tuvo como objetivo con éxito. El movimiento copiado se usa sin objetivo concreto. Falla si ningún movimiento ha tenido al usuario como objetivo, si el movimiento falló, no acertó o no tuvo efecto sobre el usuario, o si no puede copiarse con este movimiento.", // NEEDS QC
		},
		gen2: {
			desc: "El usuario usa el último movimiento usado por el objetivo. Falla si el objetivo no ha usado un movimiento desde que el usuario entró en combate, o si el último movimiento usado es Metrónomo, Mimético, Espejo, Esquema, Sonámbulo, Transformación o un movimiento que el usuario conoce.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario usa el último movimiento usado por el objetivo. Falla si el objetivo no ha usado un movimiento desde que el usuario entró en combate, o si el último movimiento usado es Espejo.", // NEEDS QC
		},
	},
	mirrorshot: {
		name: "Disparo Espejo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de bajar 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "30% de bajar 1 nivel precisión del objetivo.", // NEEDS QC
	},
	mist: {
		name: "Neblina",
		// Official flavor text: "Rodea de fina niebla al usuario y protege las características de su equipo durante cinco turnos."
		desc: "Durante 5 turnos, otros Pokémon no pueden bajar las características del usuario ni de sus compañeros. Falla si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "5 turnos: su equipo no sufre bajadas de caract.", // NEEDS QC
		gen2: {
			desc: "Mientras el usuario siga en combate, otros Pokémon no pueden bajar sus características. Falla si el usuario ya tiene el efecto. Relevo puede transferir este efecto a un compañero.", // NEEDS QC
			shortDesc: "Mientras está activo, sus stats no pueden bajar.", // NEEDS QC
			start: "  ¡{POKEMON} está cubierto por una NEBLINA!",
			block: "  {POKEMON} está protegido por la NEBLINA.",
		},
		gen1: {
			desc: "Mientras el usuario siga en combate, otros Pokémon no pueden bajar sus características, salvo por el efecto secundario de un movimiento. Falla si el usuario ya tiene el efecto. Si algún Pokémon usa Niebla, el efecto termina.", // NEEDS QC
			start: "  ¡{POKEMON} está cubierto por una NEBLINA!",
			block: "  ¡Pero ha fallado!",
		},

		start: "  ¡Una neblina ha cubierto a {TEAM}!",
		end: "  Ha desaparecido el efecto de la neblina en {TEAM}.",
		block: "  ¡{POKEMON} está protegido por la neblina!",
	},
	mistball: {
		name: "Bola Neblina",
		// Official flavor text: "Banco de niebla que puede bajar el Ataque Especial del objetivo."
		desc: "50% de probabilidad de bajar 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel At. Esp. del objetivo.", // NEEDS QC
	},
	mistyexplosion: {
		name: "Bruma Explosiva",
		// Official flavor text: "El usuario ataca a todos a su alrededor, pero se debilita de inmediato. La potencia del movimiento aumenta si el terreno está cubierto por un campo de niebla."
		desc: "Si hay campo de niebla y el usuario está en el suelo, su potencia se multiplica por 1,5. El usuario se debilita tras usarlo, incluso si falla por no haber objetivo. No puede ejecutarse si algún Pokémon en combate tiene la habilidad Humedad.", // NEEDS QC
		shortDesc: "El usuario se debilita. En campo de niebla: 1,5x.", // NEEDS QC
	},
	mistyterrain: {
		name: "Campo de Niebla",
		// Official flavor text: "Durante cinco turnos, los Pokémon que están en el suelo no sufren problemas de estado y se reduce a la mitad el daño de los movimientos de tipo Dragón."
		desc: "Durante 5 turnos, se activa el campo de niebla: la potencia de los ataques de tipo Dragón contra Pokémon en el suelo se multiplica por 0,5 y estos no pueden sufrir problemas de estado ni confusión. Pueden verse afectados por Bostezo, pero no dormirse por su efecto. Camuflaje vuelve al usuario de tipo Hada, Adaptación pasa a ser Fuerza Lunar y Daño Secreto tiene un 30% de bajar 1 nivel el Ataque Especial. Falla si ya hay campo de niebla.", // NEEDS QC
		shortDesc: "5 turnos: sin estados; Dragón debilitado en el suelo.", // NEEDS QC
		gen6: {
			desc: "Durante 5 turnos, se activa el campo de niebla: la potencia de los ataques de tipo Dragón contra Pokémon en el suelo se multiplica por 0,5 y estos no pueden sufrir problemas de estado. Pueden verse afectados por Bostezo, pero no dormirse por su efecto. Camuflaje vuelve al usuario de tipo Hada, Adaptación pasa a ser Fuerza Lunar y Daño Secreto tiene un 30% de bajar 1 nivel el Ataque Especial. Falla si ya hay campo de niebla.", // NEEDS QC
		},
	},
	moonblast: {
		name: "Fuerza Lunar",
		// Official flavor text: "Invoca el poder de la luna para atacar al objetivo. Puede disminuir el Ataque Especial del objetivo."
		desc: "30% de probabilidad de bajar 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "30% de bajar 1 nivel At. Esp. del objetivo.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	moongeistbeam: {
		name: "Rayo Umbrío",
		// Official flavor text: "Ataca con un rayo misterioso que ignora la habilidad del objetivo."
		desc: "Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Ignora las habilidades de otros Pokémon.", // NEEDS QC
	},
	moonlight: {
		name: "Luz Lunar",
		// Official flavor text: "Restaura PS del usuario. La cantidad varía según el tiempo que haga."
		desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima, o si lleva Parasol Multiuso; 2/3 con sol o luz solar extrema; y 1/4 con lluvia, diluvio, tormenta de arena o nieve (todo redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "Cura al usuario según el clima.", // NEEDS QC
		gen8: {
			desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima, o si lleva Parasol Multiuso; 2/3 con sol o luz solar extrema; y 1/4 con Granizo, diluvio, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen7: {
			desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima; 2/3 con sol o luz solar extrema; y 1/4 con Granizo, diluvio, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen5: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; 2/3 con sol; y 1/4 con Granizo, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; 2/3 con sol; y 1/4 con Granizo, lluvia o Tormenta de Arena (todo redondeado hacia abajo).", // NEEDS QC
		},
		gen2: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; todos sus PS con sol; y 1/4 con lluvia o Tormenta de Arena (todo redondeado hacia abajo).", // NEEDS QC
		},
	},
	morningsun: {
		name: "Sol Matinal",
		// Official flavor text: "Restaura PS del usuario. La cantidad varía según el tiempo que haga."
		desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima, o si lleva Parasol Multiuso; 2/3 con sol o luz solar extrema; y 1/4 con lluvia, diluvio, tormenta de arena o nieve (todo redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "Cura al usuario según el clima.", // NEEDS QC
		gen8: {
			desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima, o si lleva Parasol Multiuso; 2/3 con sol o luz solar extrema; y 1/4 con Granizo, diluvio, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen7: {
			desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima; 2/3 con sol o luz solar extrema; y 1/4 con Granizo, diluvio, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen5: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; 2/3 con sol; y 1/4 con Granizo, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; 2/3 con sol; y 1/4 con Granizo, lluvia o Tormenta de Arena (todo redondeado hacia abajo).", // NEEDS QC
		},
		gen2: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; todos sus PS con sol; y 1/4 con lluvia o Tormenta de Arena (todo redondeado hacia abajo).", // NEEDS QC
		},
	},
	mortalspin: {
		name: "Giro Mortífero",
		desc: "Si acierta y el usuario no se ha debilitado, terminan para él los efectos de Drenadoras y de los movimientos de atadura, y se eliminan todas las trampas de su bando. 100% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "Envenena y se libera de trampas y ataduras.", // NEEDS QC
	},
	mountaingale: {
		name: "Viento Carámbano",
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	mudbomb: {
		name: "Bomba Fango",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de bajar 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "30% de bajar 1 nivel precisión del objetivo.", // NEEDS QC
	},
	muddywater: {
		name: "Agua Lodosa",
		// Official flavor text: "Ataque con agua lodosa que puede bajar la Precisión del equipo rival."
		desc: "30% de probabilidad de bajar 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "30% de bajar 1 nivel la precisión de los rivales.", // NEEDS QC
	},
	mudshot: {
		name: "Disparo Lodo",
		// Official flavor text: "El usuario lanza lodo al objetivo y reduce su Velocidad."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
	},
	mudslap: {
		name: "Bofetón Lodo",
		// Official flavor text: "Echa lodo en la cara para bajar la Precisión."
		desc: "100% de probabilidad de bajar 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel precisión del objetivo.", // NEEDS QC
	},
	mudsport: {
		name: "Chapoteo Lodo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Durante 5 turnos, la potencia de los ataques de tipo Eléctrico de todos los Pokémon en combate se multiplica por 0,33. Falla si el efecto ya está activo.", // NEEDS QC
		shortDesc: "5 turnos: los ataques Eléctricos tienen 1/3 de potencia.", // NEEDS QC
		gen5: {
			desc: "Mientras el usuario siga en combate, la potencia de los ataques de tipo Eléctrico de todos los Pokémon en combate se multiplica por 0,33. Falla si el efecto ya está activo para algún Pokémon.", // NEEDS QC
			shortDesc: "Reduce los ataques Eléctricos a 1/3 de potencia.", // NEEDS QC
		},
		gen4: {
			desc: "Mientras el usuario siga en combate, la potencia de los ataques de tipo Eléctrico de todos los Pokémon en combate se reduce a la mitad. Falla si el efecto ya está activo para el usuario. Relevo puede transferir este efecto a un compañero.", // NEEDS QC
			shortDesc: "Reduce los ataques Eléctricos a 1/2 de potencia.", // NEEDS QC
		},
	},
	multiattack: {
		name: "Multiataque",
		// Official flavor text: "El Pokémon se rodea de una potente energía con la que golpea al rival. El tipo del movimiento depende del disco que lleva el usuario."
		desc: "Su tipo depende del disco que lleve el usuario.", // NEEDS QC
		shortDesc: "Su tipo depende del disco que lleve.", // NEEDS QC
	},
	mysticalfire: {
		name: "Llama Embrujada",
		// Official flavor text: "El usuario lanza por la boca una singular llama a gran temperatura con la que ataca a su oponente y baja su Ataque Especial."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel At. Esp. del objetivo.", // NEEDS QC
	},
	mysticalpower: {
		name: "Poder Místico",
		desc: "100% de probabilidad de subir 1 nivel el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "100% de subir 1 nivel At. Esp. del usuario.", // NEEDS QC
	},
	nastyplot: {
		name: "Maquinación",
		// Official flavor text: "Estimula su cerebro pensando en cosas malas. Aumenta mucho el Ataque Especial."
		desc: "Sube 2 niveles el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles At. Esp. del usuario.", // NEEDS QC
	},
	naturalgift: {
		name: "Don Natural",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Su tipo y potencia dependen de la baya del usuario, que se pierde. Falla si el usuario no lleva una baya, si tiene la habilidad Zoquete o si está bajo Embargo o Zona Mágica.", // NEEDS QC
		shortDesc: "Potencia y tipo según la baya del usuario.", // NEEDS QC
		gen4: {
			desc: "Su tipo y potencia dependen de la baya del usuario, que se pierde. Falla si el usuario no lleva una baya, si tiene la habilidad Zoquete o si está bajo Embargo.", // NEEDS QC
		},
	},
	naturepower: {
		name: "Adaptación",
		// Official flavor text: "Usa el poder de la naturaleza para atacar. Su efecto varía según el entorno de combate."
		desc: "Llama a otro movimiento según el campo: Triataque por defecto, Rayo en campo eléctrico, Fuerza Lunar en campo de niebla, Energibola en campo de hierba y Psíquico en campo psíquico.", // NEEDS QC
		shortDesc: "Su ataque depende del campo (Triataque por defecto).", // NEEDS QC
		gen6: {
			desc: "Llama a otro movimiento según el campo: Triataque en el campo Wi-Fi estándar, Rayo en campo eléctrico, Fuerza Lunar en campo de niebla y Energibola en campo de hierba.", // NEEDS QC
		},
		gen5: {
			desc: "Llama a otro movimiento según el campo: Terremoto en el campo Wi-Fi estándar.", // NEEDS QC
			shortDesc: "El ataque depende del campo. (Terremoto)", // NEEDS QC
		},
		gen4: {
			desc: "Llama a otro movimiento según el campo: Triataque en combates Wi-Fi.", // NEEDS QC
			shortDesc: "El ataque depende del campo. (Triataque)", // NEEDS QC
		},
		gen3: {
			desc: "Llama a otro movimiento según el campo: Meteoros en combates Wi-Fi.", // NEEDS QC
			shortDesc: "El ataque depende del campo. (Meteoros)", // NEEDS QC
		},

		move: "¡Adaptación actúa como {MOVE}!",
	},
	naturesmadness: {
		name: "Furia Natural",
		// Official flavor text: "Golpea al objetivo con la furia de la naturaleza y reduce sus PS a la mitad."
		desc: "Inflige un daño igual a la mitad de los PS actuales del objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Inflige la mitad de los PS actuales del objetivo.", // NEEDS QC
	},
	needlearm: {
		name: "Brazo Pincho",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		gen3: {
			desc: "30% de probabilidad de amedrentar al objetivo. El daño se duplica si el objetivo usó Reducción desde que está en combate.", // NEEDS QC
		},
	},
	neverendingnightmare: {
		name: "Presa Espectral",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	nightdaze: {
		name: "Pulso Noche",
		// Official flavor text: "Ataca al objetivo con una onda siniestra. Puede bajar su Precisión."
		desc: "40% de probabilidad de bajar 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "40% de bajar 1 nivel precisión del objetivo.", // NEEDS QC
	},
	nightmare: {
		name: "Pesadilla",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "El objetivo pierde 1/4 de sus PS máximos (redondeado hacia abajo) al final de cada turno mientras esté dormido. Solo afecta a objetivos dormidos. El efecto termina cuando despierta, aunque vuelva a dormirse el mismo turno.", // NEEDS QC
		shortDesc: "Un objetivo dormido pierde 1/4 de sus PS por turno.", // NEEDS QC

		start: "  ¡{POKEMON} se ha sumido en una pesadilla!",
		damage: "  ¡{POKEMON} está inmerso en una pesadilla!",
	},
	nightshade: {
		name: "Tinieblas",
		// Official flavor text: "Produce un espejismo ante el objetivo, que pierde tantos PS como nivel tenga el usuario."
		desc: "Inflige un daño igual al nivel del usuario.", // NEEDS QC
		shortDesc: "Inflige un daño igual al nivel del usuario.", // NEEDS QC
		gen1: {
			desc: "Inflige un daño igual al nivel del usuario. Este movimiento ignora la inmunidad de tipo.", // NEEDS QC
			shortDesc: "Daño = nivel del usuario. Golpea a tipos Normal.", // NEEDS QC
		},
	},
	nightslash: {
		name: "Tajo Umbrío",
		// Official flavor text: "Ataca al objetivo a la primera oportunidad. Suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	nobleroar: {
		name: "Rugido de Guerra",
		// Official flavor text: "Intimida a su oponente con un rugido de guerra, lo que hace que disminuyan tanto su Ataque como su Ataque Especial."
		desc: "Baja 1 nivel el Ataque y el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel Ataque y At. Esp. del objetivo.", // NEEDS QC
	},
	noretreat: {
		name: "Bastión Final",
		// Official flavor text: "El usuario aumenta todas sus características, pero ya no puede huir ni ser cambiado por otro."
		desc: "Sube 1 nivel el Ataque, la Defensa, el Ataque Especial, la Defensa Especial y la Velocidad del usuario, pero este ya no puede cambiarse. Puede cambiarse usando Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. Falla si ya no puede cambiarse por este efecto.", // NEEDS QC
		shortDesc: "+1 a todas sus características, pero queda atrapado.", // NEEDS QC

		start: "  ¡{POKEMON} ya no puede ser cambiado por otro porque ha usado Bastión Final!",
	},
	noxioustorque: {
		name: "Ponzochoque",
		desc: "30% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "30% de envenenar al objetivo.", // NEEDS QC
	},
	nuzzle: {
		name: "Moflete Estático",
		// Official flavor text: "Quien lo usa frota sus mofletes cargados de electricidad contra el objetivo y consigue paralizarlo."
		desc: "100% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "100% de paralizar al objetivo.", // NEEDS QC
	},
	oblivionwing: {
		name: "Ala Mortífera",
		// Official flavor text: "El usuario absorbe energía del objetivo y aumenta sus PS en una cantidad igual o superior a la mitad del daño infligido."
		desc: "El usuario recupera 3/4 del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera 3/4 del daño infligido.", // NEEDS QC
	},
	obstruct: {
		name: "Obstrucción",
		// Official flavor text: "Frena todos los ataques, pero puede fallar si se usa repetidamente. Reduce mucho la Defensa de quien ejecute un movimiento de contacto contra el usuario."
		desc: "Protege al usuario de la mayoría de los movimientos este turno y baja 2 niveles la Defensa de los Pokémon que intenten hacer contacto con él. Los movimientos que no causan daño lo atraviesan. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege de ataques. Contacto: -2 Defensa.", // NEEDS QC
		gen8: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno y baja 2 niveles la Defensa de los Pokémon que intenten hacer contacto con él. Los movimientos que no causan daño lo atraviesan. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
	},
	oceanicoperetta: {
		name: "Sinfonía de la Diva Marina",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	octazooka: {
		name: "Pulpocañón",
		// Official flavor text: "Dispara tinta a la cara. Puede bajar la Precisión."
		desc: "50% de probabilidad de bajar 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel precisión del objetivo.", // NEEDS QC
	},
	octolock: {
		name: "Octopresa",
		// Official flavor text: "Retiene al objetivo para impedir su huida, a la vez que reduce su Defensa y Defensa Especial cada turno."
		desc: "Impide que el objetivo se cambie y baja 1 nivel su Defensa y su Defensa Especial al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Atrapa al objetivo: -1 Def. y Def. Esp. cada turno.", // NEEDS QC

		start: "  ¡Octopresa impide que {POKEMON} huya o sea cambiado por otro!",
	},
	odorsleuth: {
		name: "Rastreo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Mientras el objetivo siga en combate, su evasión se ignora en las comprobaciones de precisión si es mayor que 0, y los ataques de tipo Normal y Lucha pueden golpearlo aunque sea de tipo Fantasma. Falla si ya está afectado por este efecto o por Profecía o Gran Ojo.", // NEEDS QC
		shortDesc: "Lucha y Normal golpean a Fantasma. Ignora evasión.", // NEEDS QC
		gen4: {
			desc: "Mientras el objetivo siga en combate, su nivel de evasión se ignora en los cálculos de precisión contra él si es mayor que 0, y los ataques de tipo Normal y Lucha pueden golpearlo aunque sea de tipo Fantasma.", // NEEDS QC
		},
		gen3: {
			desc: "Mientras el objetivo siga en combate, su nivel de evasión se ignora en los cálculos de precisión contra él, y los ataques de tipo Normal y Lucha pueden golpearlo aunque sea de tipo Fantasma.", // NEEDS QC
		},
	},
	ominouswind: {
		name: "Viento Aciago",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "10% de probabilidad de subir 1 nivel el Ataque, la Defensa, el Ataque Especial, la Defensa Especial y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "10% de subir 1 nivel todas sus características.", // NEEDS QC
	},
	orderup: {
		name: "Oído Cocina",
		desc: "Si la habilidad Comandar de un Tatsugiri aliado se ha activado, sube 1 nivel el Ataque del usuario si es de Forma Curvada, la Defensa si es de Forma Caída o la Velocidad si es de Forma Estirada. Ocurre aunque ese Tatsugiri se haya debilitado.", // NEEDS QC
		shortDesc: "Según el Tatsugiri aliado: +1 Ataque, Def. o Vel.", // NEEDS QC
	},
	originpulse: {
		name: "Pulso Primigenio",
		// Official flavor text: "Ataca al objetivo con una infinidad de rayos de luz azulada."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	outrage: {
		name: "Enfado",
		// Official flavor text: "Ataca de dos a tres turnos y acaba confundiendo al agresor."
		desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla en el primer turno del efecto (o el segundo de un efecto de tres), el efecto termina sin causar confusión. Si lo llama Sonámbulo y el usuario está dormido, se usa 1 turno y no lo confunde.", // NEEDS QC
		shortDesc: "Dura 2-3 turnos y después confunde al usuario.", // NEEDS QC
		gen6: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, si no lo estaba ya. Cada turno elige un rival adyacente al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla en el primer turno del efecto (o el segundo de un efecto de tres), el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso al final del último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla contra el objetivo, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso al final del último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, se duerme, se congela, o el ataque falla contra el objetivo, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen2: {
			desc: "Acierte o no este movimiento, el usuario queda fijado en él durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, aunque ya estuviera confuso. Si el usuario no puede actuar, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
	},
	overdrive: {
		name: "Amplificador",
		// Official flavor text: "El usuario rasguea la guitarra o el bajo para generar enormes vibraciones de intensa reverberación con las que ataca al objetivo."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales.", // NEEDS QC
	},
	overheat: {
		name: "Sofoco",
		// Official flavor text: "Ataque en toda regla que baja mucho el Ataque Especial de quien lo usa."
		desc: "Baja 2 niveles el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 2 niveles At. Esp. del usuario.", // NEEDS QC
	},
	painsplit: {
		name: "Divide Dolor",
		// Official flavor text: "Suma los PS del usuario a los del objetivo y los reparte a partes iguales."
		desc: "Los PS del usuario y del objetivo pasan a ser la media de sus PS actuales (redondeado hacia abajo), sin superar los máximos de cada uno.", // NEEDS QC
		shortDesc: "Reparte a partes iguales los PS con el objetivo.", // NEEDS QC

		activate: "  ¡Los combatientes comparten sus PS!",
	},
	paleowave: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "20% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "20% de bajar 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	paraboliccharge: {
		name: "Carga Parábola",
		// Official flavor text: "Inflige daño a todos los Pokémon a su alrededor. El usuario absorbe la mitad del daño producido para restaurar sus propios PS."
		desc: "El usuario recupera la mitad del daño infligido (redondeado al alza desde 0,5). Si lleva Raíz Grande, recupera 1,3 veces más PS (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad del daño infligido.", // NEEDS QC
	},
	partingshot: {
		name: "Última Palabra",
		// Official flavor text: "El usuario se cambia por otro Pokémon de su equipo, pero antes amedrenta a su oponente y hace que disminuyan su Ataque y Ataque Especial."
		desc: "Baja 1 nivel el Ataque y el Ataque Especial del objetivo. Si acierta, el usuario se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si ninguna de las dos características del objetivo cambió o si no quedan compañeros sanos.", // NEEDS QC
		shortDesc: "-1 Ataque y At. Esp. del rival. El usuario se cambia.", // NEEDS QC
		gen6: {
			desc: "Baja 1 nivel el Ataque y el Ataque Especial del objetivo. Si acierta, el usuario se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos.", // NEEDS QC
		},

		heal: "#memento",
		switchOut: "#uturn",
	},
	payback: {
		name: "Vendetta",
		// Official flavor text: "El usuario contraataca con el doble de fuerza si el objetivo usa un movimiento antes."
		desc: "La potencia se duplica si el usuario actúa después del objetivo este turno, incluidas las acciones por Mandato o la habilidad Pareja de Baile. Entrar en combate no cuenta como acción.", // NEEDS QC
		shortDesc: "Potencia doble si actúa después del objetivo.", // NEEDS QC
		gen6: {
			desc: "La potencia se duplica si el usuario actúa después del objetivo este turno. Entrar en combate no cuenta como acción.", // NEEDS QC
		},
		gen4: {
			desc: "La potencia se duplica si el usuario actúa después del objetivo este turno. Entrar en combate cuenta como acción.", // NEEDS QC
		},
	},
	payday: {
		name: "Día de Pago",
		// Official flavor text: "Arroja monedas al objetivo y las recupera al final del combate."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Esparce monedas.", // NEEDS QC

		activate: "  ¡Hay monedas por todas partes!",
	},
	peck: {
		name: "Picotazo",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	perishsong: {
		name: "Canto Mortal",
		// Official flavor text: "Si un Pokémon escucha este canto y no es cambiado por otro en tres turnos, acaba debilitándose."
		desc: "Cada Pokémon en combate recibe una cuenta atrás de 4 si no la tiene ya. Al final de cada turno, incluido el de uso, la cuenta de todos baja en 1 y los que lleguen a 0 se debilitan. La cuenta desaparece al cambiarse. Si un Pokémon usa Relevo con cuenta atrás, el sustituto la hereda y sigue bajando.", // NEEDS QC
		shortDesc: "Los Pokémon en combate se debilitarán en 3 turnos.", // NEEDS QC

		start: "  ¡Los Pokémon que han oído Canto Mortal se debilitarán dentro de tres turnos!",
		activate: "  ¡La cuenta atrás de Canto Mortal de {POKEMON} ha bajado a {NUMBER}!",
	},
	petalblizzard: {
		name: "Tormenta Floral",
		// Official flavor text: "El usuario desata un intenso vendaval de pétalos que daña a los Pokémon a su alrededor."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los Pokémon adyacentes.", // NEEDS QC
	},
	petaldance: {
		name: "Danza Pétalo",
		// Official flavor text: "Lanza pétalos de dos a tres turnos y acaba confundiendo al atacante."
		desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla en el primer turno del efecto (o el segundo de un efecto de tres), el efecto termina sin causar confusión. Si lo llama Sonámbulo y el usuario está dormido, se usa 1 turno y no lo confunde.", // NEEDS QC
		shortDesc: "Dura 2-3 turnos y después confunde al usuario.", // NEEDS QC
		gen6: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, si no lo estaba ya. Cada turno elige un rival adyacente al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla en el primer turno del efecto (o el segundo de un efecto de tres), el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso al final del último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla contra el objetivo, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso al final del último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, se duerme, se congela, o el ataque falla contra el objetivo, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen2: {
			desc: "Acierte o no este movimiento, el usuario queda fijado en él durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, aunque ya estuviera confuso. Si el usuario no puede actuar, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen1: {
			desc: "Acierte o no este movimiento, el usuario queda fijado en él durante 3 o 4 turnos y queda confuso justo después de actuar en el último turno del efecto, aunque ya estuviera confuso. Si el usuario no puede actuar, el efecto termina sin causar confusión. Mientras dura el efecto, la precisión de este movimiento se sobrescribe cada turno con la precisión actual calculada, incluidos los cambios de niveles, pero sin bajar de 1/256 ni superar 255/256.", // NEEDS QC
			shortDesc: "Dura 3-4 turnos y luego confunde al usuario.", // NEEDS QC
		},
	},
	phantomforce: {
		name: "Golpe Fantasma",
		// Official flavor text: "El usuario desaparece en el primer turno y ataca a su objetivo en el segundo. Permite acertar aunque el objetivo esté protegiéndose."
		desc: "Si acierta, rompe este turno la protección de Búnker, Detección, Escudo Real, Protección, Barrera Espinosa del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad; también rompe Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia del bando del objetivo. Desaparece el primer turno y golpea el segundo; mientras está oculto no recibe ningún ataque. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Desaparece y golpea el turno 2. Rompe protecciones.", // NEEDS QC
		gen6: {
			desc: "Si acierta, rompe este turno la protección de Detección, Escudo Real, Protección, Barrera Espinosa del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad; también rompe Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia del bando del objetivo, y otros Pokémon pueden atacar ese bando con normalidad. Desaparece el primer turno y golpea el segundo; mientras está oculto no recibe ningún ataque. Con Hierba Única, ataca en 1 turno. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		},

		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	photongeyser: {
		name: "Géiser Fotónico",
		// Official flavor text: "El usuario ataca con una gran columna de luz. Compara sus valores de Ataque y Ataque Especial para infligir daño con el más alto de los dos."
		desc: "Se convierte en ataque físico si el Ataque del usuario es mayor que su Ataque Especial, incluidos los cambios de nivel. Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Físico si Ataque > At. Esp. Ignora habilidades.", // NEEDS QC
	},
	pikapapow: {
		name: "Pikatormenta",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia es (amistad del usuario×2/5) (redondeado hacia abajo, mínimo 1).", // NEEDS QC
		shortDesc: "Potencia 102 con amistad máxima. No falla.", // NEEDS QC
	},
	pinmissile: {
		name: "Pin Misil",
		// Official flavor text: "Lanza finas púas que hieren de dos a cinco veces."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. El daño se calcula una sola vez para el primer golpe y se repite en cada golpe. Si un golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	plasmafists: {
		name: "Puños Plasma",
		// Official flavor text: "El usuario ataca con puños cargados de electricidad. Convierte los movimientos de tipo Normal en movimientos de tipo Eléctrico."
		desc: "Si acierta, los movimientos de tipo Normal pasan a ser de tipo Eléctrico este turno.", // NEEDS QC
		shortDesc: "Los movimientos Normales son Eléctricos este turno.", // NEEDS QC
	},
	playnice: {
		name: "Camaradería",
		// Official flavor text: "Se hace amigo de su oponente y consigue que a este se le quiten las ganas de combatir. Además, reduce su Ataque."
		desc: "Baja 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	playrough: {
		name: "Carantoña",
		// Official flavor text: "El Pokémon que lo usa le hace cucamonas al objetivo y lo ataca. Puede disminuir el Ataque del objetivo."
		desc: "10% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	pluck: {
		name: "Picoteo",
		// Official flavor text: "Picotea al objetivo. Si este sostiene una baya, la picotea también y obtiene sus efectos."
		desc: "Si acierta y el usuario no se ha debilitado, roba y come la baya del objetivo, obteniendo su efecto aunque su propio objeto esté anulado. Las bayas perdidas así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		shortDesc: "Roba y se come la baya del objetivo.", // NEEDS QC
		gen4: {
			desc: "Roba y come la baya del objetivo, obteniendo su efecto salvo que su propio objeto esté anulado. Las bayas perdidas así pueden recuperarse con Reciclaje.", // NEEDS QC
		},

		removeItem: "#bugbite",
	},
	poisonfang: {
		name: "Colmillo Veneno",
		// Official flavor text: "Colmillos tóxicos que pueden envenenar gravemente al objetivo."
		desc: "50% de probabilidad de envenenar gravemente al objetivo.", // NEEDS QC
		shortDesc: "50% de envenenar gravemente al objetivo.", // NEEDS QC
		gen5: {
			desc: "30% de probabilidad de envenenar gravemente al objetivo.", // NEEDS QC
			shortDesc: "30% de envenenar gravemente.", // NEEDS QC
		},
	},
	poisongas: {
		name: "Gas Venenoso",
		// Official flavor text: "Lanza una nube de gas tóxico al objetivo. Produce envenenamiento."
		desc: "Envenena al objetivo.", // NEEDS QC
		shortDesc: "Envenena a los rivales.", // NEEDS QC
		gen2: {
			shortDesc: "Envenena al objetivo.", // NEEDS QC
		},
	},
	poisonjab: {
		name: "Puya Nociva",
		// Official flavor text: "Pincha al objetivo con un tentáculo o brazo envenenado. Puede llegar a envenenar al objetivo."
		desc: "30% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "30% de envenenar al objetivo.", // NEEDS QC
	},
	poisonpowder: {
		name: "Polvo Veneno",
		// Official flavor text: "Polvo tóxico que envenena al objetivo."
		desc: "Envenena al objetivo.", // NEEDS QC
		shortDesc: "Envenena al objetivo.", // NEEDS QC
	},
	poisonsting: {
		name: "Picotazo Veneno",
		// Official flavor text: "Lanza un aguijón tóxico que puede envenenar al objetivo."
		desc: "30% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "30% de envenenar al objetivo.", // NEEDS QC
		gen1: {
			desc: "20% de probabilidad de envenenar al objetivo.", // NEEDS QC
			shortDesc: "20% de envenenar al objetivo.", // NEEDS QC
		},
	},
	poisontail: {
		name: "Cola Veneno",
		// Official flavor text: "Puede envenenar y dar un golpe crítico."
		desc: "10% de probabilidad de envenenar al objetivo. Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta prob. de crítico. 10% de envenenar.", // NEEDS QC
	},
	polarflare: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "10% de probabilidad de congelar al objetivo. Este movimiento no puede descongelar. Si acierta al menos a un objetivo y el usuario es un Ramnarok, cambia a la Radiant Forme si está en Dormant Forme, o viceversa. No cambia si tiene la habilidad Potencia Bruta. La Radiant Forme vuelve a la Dormant Forme al dejar el combate.", // NEEDS QC
		shortDesc: "10% de congelar. Ramnarok cambia de forma.", // NEEDS QC
	},
	pollenpuff: {
		name: "Bola de Polen",
		// Official flavor text: "Ataca al oponente con una bola explosiva. Si esta alcanza a un aliado, le hará recuperar PS."
		desc: "Si el objetivo es un aliado, en lugar de dañarlo restaura la mitad de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "A un aliado lo cura la mitad de sus PS máximos.", // NEEDS QC
	},
	poltergeist: {
		name: "Poltergeist",
		shortDesc: "Falla si el objetivo no lleva objeto.", // NEEDS QC

		activate: "  ¡{POKEMON} es atacado por {ITEM:definite:classified}!",
	},
	populationbomb: {
		name: "Proliferación",
		desc: "Golpea 10 veces, comprobando la precisión en cada golpe; el ataque termina si el objetivo esquiva uno. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 10 veces. Con Dado Trucado, golpea de 4 a 10 veces al azar sin comprobar la precisión entre golpes.", // NEEDS QC
		shortDesc: "Golpea 10 veces. Cada golpe puede fallar.", // NEEDS QC
	},
	pounce: {
		name: "Brinco",
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
	},
	pound: {
		name: "Destructor",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	powder: {
		name: "Polvo Explosivo",
		// Official flavor text: "Esparce un polvo sobre el objetivo. Si este usa un movimiento de tipo Fuego en el mismo turno, el polvo explota y le inflige daño."
		desc: "Si el objetivo usa un movimiento de tipo Fuego este turno, este no se ejecuta y el objetivo pierde 1/4 de sus PS máximos (redondeado al alza desde 0,5). No ocurre si el movimiento de Fuego lo impide el diluvio.", // NEEDS QC
		shortDesc: "Si usa un movimiento de Fuego, pierde 1/4 de sus PS.", // NEEDS QC
		gen6: {
			desc: "Si el objetivo usa un movimiento de tipo Fuego este turno, este no se ejecuta y el objetivo pierde 1/4 de sus PS máximos (redondeado al alza desde 0,5). Este efecto ocurre antes de que el diluvio impida el movimiento de tipo Fuego.", // NEEDS QC
		},

		start: "  ¡{POKEMON} está cubierto de polvo!",
		activate: "  ¡El polvo ha reaccionado con el movimiento {MOVE} y ha explotado!",
	},
	powdersnow: {
		name: "Nieve Polvo",
		// Official flavor text: "Lanza nieve que puede llegar a congelar."
		desc: "10% de probabilidad de congelar al objetivo.", // NEEDS QC
		shortDesc: "10% de congelar al objetivo.", // NEEDS QC
		gen2: {
			shortDesc: "10% de congelar al objetivo.", // NEEDS QC
		},
	},
	powergem: {
		name: "Joya de Luz",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	powersplit: {
		name: "Isofuerza",
		// Official flavor text: "El usuario emplea sus poderes para hacer la media de su Ataque y Ataque Especial con los de su objetivo y compartirlos."
		desc: "El Ataque y el Ataque Especial del usuario y del objetivo pasan a ser la media de ambos (redondeado hacia abajo). Los cambios de nivel no se ven afectados.", // NEEDS QC
		shortDesc: "Promedia Ataque y At. Esp. con el objetivo.", // NEEDS QC

		activate: "  ¡{POKEMON} suma su capacidad ofensiva a la del objetivo y la reparte equitativamente!",
	},
	powerswap: {
		name: "Cambiafuerza",
		// Official flavor text: "El usuario emplea su poder mental para intercambiar los cambios en el Ataque y Ataque Especial con el objetivo."
		desc: "El usuario intercambia con el objetivo sus cambios de Ataque y Ataque Especial.", // NEEDS QC
		shortDesc: "Intercambia cambios de Ataque y At. Esp. con el rival.", // NEEDS QC
	},
	powershift: {
		name: "Cambiapoder",
		desc: "El usuario intercambia sus valores de Ataque y Defensa; los cambios de nivel permanecen en cada característica. Puede usarse de nuevo para deshacer el intercambio. Si el usuario usa Relevo con el efecto activo, el sustituto también tiene el Ataque y la Defensa intercambiados. Si sus características se recalculan por un cambio de forma con el intercambio activo, el efecto se ignora pero sigue activo para Relevo.", // NEEDS QC
		shortDesc: "Intercambia el Ataque y la Defensa del usuario.", // NEEDS QC

		start: "  ¡{POKEMON} ha intercambiado los valores de su ofensiva y su defensiva!",
		end: "#.start",
	},
	powertrick: {
		name: "Truco Fuerza",
		// Official flavor text: "Usa sus poderes mentales para intercambiar sus características de Ataque y Defensa."
		desc: "El usuario intercambia sus valores de Ataque y Defensa; los cambios de nivel permanecen en cada característica. Puede usarse de nuevo para deshacer el intercambio. Si el usuario usa Relevo con el efecto activo, el sustituto también tiene el Ataque y la Defensa intercambiados. Si sus características se recalculan por un cambio de forma con el intercambio activo, el efecto se ignora pero sigue activo para Relevo.", // NEEDS QC
		shortDesc: "Intercambia el Ataque y la Defensa del usuario.", // NEEDS QC

		start: "  ¡{POKEMON} ha intercambiado el valor de su Ataque por el de su Defensa!",
		end: "#.start",
	},
	powertrip: {
		name: "Chulería",
		// Official flavor text: "Ataca al oponente presumiendo de su fuerza. Cuanto más hayan subido las características del usuario, mayor será el daño."
		desc: "La potencia es 20+(X×20), donde X es la suma de los niveles positivos de características del usuario.", // NEEDS QC
		shortDesc: "+20 de potencia por cada subida de características.", // NEEDS QC
	},
	poweruppunch: {
		name: "Puño Incremento",
		// Official flavor text: "Cada vez que golpea a un oponente se endurecen sus puños. Si acierta al objetivo, el Ataque del usuario aumenta."
		desc: "100% de probabilidad de subir 1 nivel el Ataque del usuario.", // NEEDS QC
		shortDesc: "100% de subir 1 nivel Ataque del usuario.", // NEEDS QC
	},
	powerwhip: {
		name: "Latigazo",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	precipiceblades: {
		name: "Filo del Abismo",
		// Official flavor text: "Hace que el poder latente de la tierra se manifieste en forma de hojas afiladas y ataca al objetivo con ellas."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Sin efecto adicional. Golpea a los rivales adyacentes.", // NEEDS QC
	},
	present: {
		name: "Presente",
		// Official flavor text: "Quien lo usa ataca al objetivo dándole un regalo con una bomba trampa. Sin embargo, a veces restaura sus PS."
		desc: "Si acierta, daña o cura al objetivo: 40% de probabilidad de potencia 40, 30% de potencia 80, 10% de potencia 120 y 20% de curar al objetivo 1/4 de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "Potencia 40, 80 o 120, o cura 1/4 al objetivo.", // NEEDS QC
		gen2: {
			desc: "Si acierta, daña o cura al objetivo: 102/256 de probabilidad de potencia 40, 76/256 de potencia 80, 26/256 de potencia 120 y 52/256 de curar al objetivo 1/4 de sus PS máximos (redondeado hacia abajo). Si causa daño, usa una versión anómala de la fórmula de daño sustituyendo ciertos valores: el Ataque del usuario se sustituye por 10 veces la eficacia de este movimiento contra el objetivo, la Defensa del objetivo por el número de índice del segundo tipo del usuario, y el nivel del usuario por el número de índice del segundo tipo del objetivo. Si un Pokémon no tiene segundo tipo, se usa su primer tipo. Los números de índice de los tipos son Normal: 0, Lucha: 1, Volador: 2, Veneno: 3, Tierra: 4, Roca: 5, Bicho: 7, Fantasma: 8, Acero: 9, Fuego: 20, Agua: 21, Planta: 22, Eléctrico: 23, Psíquico: 24, Hielo: 25, Dragón: 26, Siniestro: 27. Si en la fórmula se produjera una división entre 0, se divide entre 1 en su lugar.", // NEEDS QC
		},
	},
	prismaticlaser: {
		name: "Láser Prisma",
		// Official flavor text: "El usuario utiliza un prisma para emitir un rayo de gran potencia, pero no puede moverse en el turno siguiente."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	protect: {
		name: "Protección",
		// Official flavor text: "Frena todos los ataques, pero puede fallar si se usa repetidamente."
		desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege al usuario de los movimientos este turno.", // NEEDS QC
		gen8: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen7: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen6: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si el movimiento falla, si el último movimiento usado no fue Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen5: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso. X vuelve a 1 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección, Anticipo, Vasta Guardia. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen4: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso, hasta un máximo de 8. X vuelve a 1 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen3: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno. Tiene X/65536 de probabilidad de éxito: X empieza en 65535 y se reduce a la mitad (redondeado hacia abajo) con cada uso exitoso. Tras el cuarto éxito seguido, X baja a 118 y luego toma valores aparentemente aleatorios entre 0 y 65535. X vuelve a 65535 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen2: {
			desc: "Protege al usuario de los ataques del rival este turno. Tiene X/255 de probabilidad de éxito: X empieza en 255 y se reduce a la mitad (redondeado hacia abajo) con cada uso exitoso. X vuelve a 255 si el movimiento falla o si el último movimiento usado no fue Detección, Aguante, Protección. Falla si el usuario tiene un sustituto o actúa el último este turno.", // NEEDS QC
		},

		start: "  ¡{POKEMON} se está protegiendo!",
		block: "  ¡{POKEMON} se ha protegido!",
	},
	psybeam: {
		name: "Psicorrayo",
		// Official flavor text: "Extraño rayo que puede causar confusión."
		desc: "10% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "10% de confundir al objetivo.", // NEEDS QC
	},
	psyblade: {
		name: "Psicohojas",
		desc: "Si hay campo eléctrico, su potencia se multiplica por 1,5.", // NEEDS QC
		shortDesc: "En campo eléctrico: 1,5x más potencia.", // NEEDS QC
	},
	psychic: {
		name: "Psíquico",
		// Official flavor text: "Fuerte ataque telequinético que puede bajar la Defensa Especial del objetivo."
		desc: "10% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "10% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
		gen1: {
			desc: "33% de probabilidad de bajar 1 nivel el Especial del objetivo.", // NEEDS QC
			shortDesc: "33% de bajar 1 nivel el Especial del objetivo.", // NEEDS QC
		},
	},
	psychicfangs: {
		name: "Psicocolmillo",
		// Official flavor text: "Ataca a sus rivales con poderes psíquicos que además destruyen barreras como Pantalla de Luz y Reflejo."
		desc: "Si el ataque no falla, elimina los efectos de Reflejo, Pantalla de Luz, Velo Aurora del bando del objetivo antes de calcular el daño.", // NEEDS QC
		shortDesc: "Destruye las pantallas, salvo si el objetivo es inmune.", // NEEDS QC
	},
	psychicnoise: {
		name: "Psicorruido",
		desc: "Durante 2 turnos, el objetivo no puede recuperar PS mientras siga en combate. Durante el efecto, no puede usar movimientos curativos ni de drenado, y las habilidades y objetos curativos no lo curan. Si un afectado usa Relevo, el sustituto tampoco puede recuperar PS. Divide Dolor y la habilidad Regeneración no se ven afectados.", // NEEDS QC
		shortDesc: "2 turnos: el objetivo no puede curarse.", // NEEDS QC
	},
	psychicterrain: {
		name: "Campo Psíquico",
		// Official flavor text: "Durante cinco turnos, se potencian los movimientos de tipo Psíquico y los Pokémon que están en el suelo quedan protegidos contra movimientos con prioridad."
		desc: "Durante 5 turnos, se activa el campo psíquico: la potencia de los ataques de tipo Psíquico de los Pokémon en el suelo se multiplica por 1,3 y estos no pueden ser golpeados por movimientos con prioridad mayor que 0, salvo de sus aliados. Camuflaje vuelve al usuario de tipo Psíquico, Adaptación pasa a ser Psíquico y Daño Secreto tiene un 30% de bajar 1 nivel la Velocidad. Falla si ya hay campo psíquico.", // NEEDS QC
		shortDesc: "5 turnos: potencia Psíquico; bloquea prioridad.", // NEEDS QC
		gen7: {
			desc: "Durante 5 turnos, se activa el campo psíquico: la potencia de los ataques de tipo Psíquico de los Pokémon en el suelo se multiplica por 1,5 y estos no pueden ser golpeados por movimientos con prioridad mayor que 0, salvo de sus aliados. Camuflaje vuelve al usuario de tipo Psíquico, Adaptación pasa a ser Psíquico y Daño Secreto tiene un 30% de bajar 1 nivel la Velocidad. Falla si ya hay campo psíquico.", // NEEDS QC
		},
	},
	psychoboost: {
		name: "Psicoataque",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Baja 2 niveles el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 2 niveles At. Esp. del usuario.", // NEEDS QC
	},
	psychocut: {
		name: "Psicocorte",
		// Official flavor text: "Ataca al objetivo con cuchillas formadas por energía psíquica. Suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	psychoshift: {
		name: "Psicocambio",
		// Official flavor text: "Usa su poder mental para transferir al objetivo sus problemas de estado."
		desc: "Transfiere el problema de estado del usuario al objetivo y el usuario se cura. Falla si el usuario no tiene un problema de estado o si el objetivo ya tiene uno.", // NEEDS QC
		shortDesc: "Transfiere su problema de estado al objetivo.", // NEEDS QC
	},
	psychup: {
		name: "Autosugestión",
		// Official flavor text: "Quien lo usa se sume en un trance y copia cualquier cambio que haya en las características de su objetivo."
		desc: "El usuario copia todos los cambios de características actuales del objetivo.", // NEEDS QC
		shortDesc: "Copia los cambios de características del objetivo.", // NEEDS QC
		gen2: {
			desc: "El usuario copia todos los cambios de características actuales del objetivo. Falla si las características del objetivo están todas en 0.", // NEEDS QC
		},
	},
	psyshieldbash: {
		name: "Asalto Barrera",
		desc: "100% de probabilidad de subir 1 nivel la Defensa del usuario.", // NEEDS QC
		shortDesc: "100% de subir 1 nivel Defensa del usuario.", // NEEDS QC
	},
	psyshock: {
		name: "Psicocarga",
		// Official flavor text: "Crea una onda psíquica que causa daño físico al objetivo."
		desc: "El daño se calcula con la Defensa del objetivo en lugar de su Defensa Especial.", // NEEDS QC
		shortDesc: "Daña usando la Defensa del objetivo, no su Def. Esp.", // NEEDS QC
	},
	psystrike: {
		name: "Onda Mental",
		// Official flavor text: "Crea una onda psíquica que causa daño físico al objetivo."
		desc: "El daño se calcula con la Defensa del objetivo en lugar de su Defensa Especial.", // NEEDS QC
		shortDesc: "Daña usando la Defensa del objetivo, no su Def. Esp.", // NEEDS QC
	},
	psywave: {
		name: "Psicoonda",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Inflige un daño igual a (nivel del usuario)×(X+50)÷100, donde X es un número al azar entre 0 y 100, redondeado hacia abajo (mínimo 1 PS).", // NEEDS QC
		shortDesc: "Daño aleatorio entre 0,5x y 1,5x el nivel del usuario.", // NEEDS QC
		gen4: {
			desc: "Inflige un daño igual a (nivel del usuario)×(X×10+50)÷100, donde X es un número al azar entre 0 y 10, redondeado hacia abajo (mínimo 1 PS).", // NEEDS QC
		},
		gen2: {
			desc: "Inflige un daño igual a un número al azar entre 1 y (nivel del usuario×1,5−1), redondeado hacia abajo (mínimo 1 PS).", // NEEDS QC
			shortDesc: "Daño al azar de 1 a (nivel x 1,5 - 1).", // NEEDS QC
		},
	},
	pulverizingpancake: {
		name: "Arrojo Intempestivo",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	punishment: {
		name: "Castigo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia es 60+(X×20), donde X es la suma de los niveles positivos de características del objetivo (máximo 200 de potencia).", // NEEDS QC
		shortDesc: "Potencia 60 +20 por cada subida del objetivo.", // NEEDS QC
	},
	purify: {
		name: "Purificación",
		// Official flavor text: "Cura los problemas de estado del Pokémon rival y a cambio recupera PS propios."
		desc: "Cura el problema de estado del objetivo. Si lo cura, el usuario recupera la mitad de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "Cura el estado del rival; si lo hace, recupera 1/2 PS.", // NEEDS QC
	},
	pursuit: {
		name: "Persecución",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Si un rival va a cambiarse este turno, lo golpea antes de que deje el campo, aunque no fuera el objetivo original. Si el usuario actúa después de un rival que usa Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio (pero no Relevo), también lo golpea antes de que salga. La potencia se duplica y no se comprueba la precisión contra un rival que se cambia, y el turno del usuario termina; si el rival se debilita, el sustituto no entra hasta el final del turno.", // NEEDS QC
		shortDesc: "Golpea con potencia doble a rivales que se cambian.", // NEEDS QC
		gen7: {
			desc: "Si un rival adyacente va a cambiarse este turno, lo golpea antes de que deje el campo, aunque no fuera el objetivo original. Si el usuario actúa después de un rival que usa Última Palabra, Ida y Vuelta, Voltiocambio (pero no Relevo), también lo golpea antes de que salga. La potencia se duplica y no se comprueba la precisión contra un rival que se cambia, y el turno del usuario termina; si el rival se debilita, el sustituto no entra hasta el final del turno.", // NEEDS QC
		},
		gen5: {
			desc: "Si un rival adyacente va a cambiarse este turno, lo golpea antes de que deje el campo, aunque no fuera el objetivo original. Si el usuario actúa después de un rival que usa Ida y Vuelta o Voltiocambio (pero no Relevo), también lo golpea antes de que salga. La potencia se duplica y no se comprueba la precisión contra un rival que se cambia, y el turno del usuario termina; si el rival se debilita, el sustituto no entra hasta el final del turno.", // NEEDS QC
		},
		gen4: {
			desc: "Si un rival va a cambiarse este turno, lo golpea antes de que deje el campo, aunque no fuera el objetivo original. Si el usuario actúa después de un rival que usa Ida y Vuelta (pero no Relevo), también lo golpea antes de que salga. La potencia se duplica y no se comprueba la precisión contra un rival que se cambia, y el turno del usuario termina; si el rival se debilita, el sustituto entra de inmediato.", // NEEDS QC
		},
		gen3: {
			desc: "Si el objetivo es un rival y va a cambiarse este turno, lo golpea antes de que deje el campo. La potencia se duplica y no se comprueba la precisión contra un rival que se cambia, y el turno del usuario termina; si el rival se debilita, el sustituto entra de inmediato.", // NEEDS QC
			shortDesc: "Doble potencia si el objetivo elegido se cambia.", // NEEDS QC
		},
		gen2: {
			desc: "Si el objetivo va a cambiarse este turno, lo golpea con potencia duplicada antes de que deje el campo, y el turno del usuario termina.", // NEEDS QC
			shortDesc: "Doble potencia si el rival se cambia.", // NEEDS QC
		},

		activate: "  ({TARGET} está a punto de ser retirado...)", // NEEDS QC
	},
	pyroball: {
		name: "Balón Ígneo",
		// Official flavor text: "El usuario prende una pequeña piedra para crear una bola de fuego con la que ataca al rival. Puede causar quemaduras."
		desc: "10% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "10% de quemar. Descongela al usuario.", // NEEDS QC
	},
	quash: {
		name: "Último Lugar",
		// Official flavor text: "Consigue que el objetivo sea el último en moverse."
		desc: "El objetivo actúa el último este turno, sin importar la prioridad de su movimiento. Falla si ya actuó este turno.", // NEEDS QC
		shortDesc: "Obliga al objetivo a actuar el último este turno.", // NEEDS QC

		activate: "  ¡{TARGET} ha retrasado su turno!",
	},
	quickattack: {
		name: "Ataque Rápido",
		// Official flavor text: "Ataca al objetivo a gran velocidad. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	quickguard: {
		name: "Anticipo",
		// Official flavor text: "Se protege a sí mismo y a sus aliados de movimientos con prioridad."
		desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos con prioridad mayor que 0 (original o alterada) de otros Pokémon, incluidos aliados. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "Protege a los aliados de movimientos con prioridad.", // NEEDS QC
		gen8: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos con prioridad mayor que 0 (original o alterada) de otros Pokémon, incluidos aliados. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		},
		gen7: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos con prioridad mayor que 0 (original o alterada) de otros Pokémon, incluidos aliados. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		},
		gen6: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos con prioridad mayor que 0 (original o alterada) de otros Pokémon, incluidos aliados. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		},
		gen5: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos con prioridad original mayor que 0 de otros Pokémon, incluidos aliados. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso. X vuelve a 1 si falla o si el último movimiento usado no fue Detección, Aguante, Protección, Anticipo, Vasta Guardia. Si X es 256 o más, tiene 1/(2^32) de probabilidad de éxito. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		},

		start: "  ¡{TEAM} está protegido por Anticipo!",
		block: "  ¡{POKEMON} está protegido por Anticipo!",
	},
	quiverdance: {
		name: "Danza Aleteo",
		// Official flavor text: "Danza mística que sube el Ataque Especial, la Defensa Especial y la Velocidad."
		desc: "Sube 1 nivel el Ataque Especial, la Defensa Especial y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel su At. Esp., Def. Esp. y Velocidad.", // NEEDS QC
	},
	rage: {
		name: "Furia",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Una vez usado con éxito, el Ataque del usuario sube 1 nivel cada vez que otro Pokémon lo golpea, mientras siga eligiendo este movimiento.", // NEEDS QC
		shortDesc: "+1 Ataque si lo golpean mientras lo usa.", // NEEDS QC
		gen3: {
			desc: "Una vez usado este movimiento, y salvo que el objetivo se haya protegido, el Ataque del usuario sube 1 nivel cada vez que otro Pokémon lo golpea, mientras siga eligiendo este movimiento.", // NEEDS QC
		},
		gen2: {
			desc: "Una vez usado con éxito, X empieza en 1. El daño de este movimiento se multiplica por X, y cada vez que el rival golpea al usuario, X aumenta en 1, hasta un máximo de 255. X vuelve a 1 cuando el usuario deja de estar en combate o no elige este movimiento.", // NEEDS QC
			shortDesc: "La próxima Furia aumenta si es golpeado al usarla.", // NEEDS QC
		},
		gen1: {
			desc: "Una vez usado con éxito, el usuario usa automáticamente este movimiento cada turno y ya no puede cambiarse. Mientras dura el efecto, su Ataque sube 1 nivel cada vez que el rival lo golpea, y la precisión de este movimiento se sobrescribe cada turno con la precisión actual calculada, incluidos los cambios de niveles, pero sin bajar de 1/256 ni superar 255/256.", // NEEDS QC
			shortDesc: "Dura para siempre. +1 Ataque al ser golpeado.", // NEEDS QC
		},
	},
	ragefist: {
		name: "Puño Furia",
		desc: "La potencia es 50+(X×50), donde X es el número total de veces que el usuario ha sido golpeado por un ataque que causa daño en el combate, aunque no perdiera PS (máximo 6). No se reinicia al cambiarse ni al debilitarse. Cada golpe de un multigolpe cuenta, pero el daño por confusión no.", // NEEDS QC
		shortDesc: "+50 de potencia por cada golpe recibido (máx. 6).", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	ragepowder: {
		name: "Polvo Ira",
		// Official flavor text: "Usa un polvo que irrita y centra en el usuario la atención y los ataques de los rivales."
		desc: "Hasta el final del turno, los ataques de un solo objetivo del bando rival se redirigen al usuario, antes de que puedan devolverse con Capa Mágica o la habilidad Espejo Mágico, o atraerse con Pararrayos o Colector. Falla si no es un combate doble o una batalla campal. Se ignora mientras el usuario está bajo Caída Libre.", // NEEDS QC
		shortDesc: "Los movimientos rivales apuntan al usuario este turno.", // NEEDS QC
		gen6: {
			desc: "Hasta el final del turno, todos los ataques de un solo objetivo del bando rival se redirigen al usuario si está al alcance. Se redirigen antes de que puedan ser devueltos por Capa Mágica o la habilidad Espejo Mágico, o atraídos por las habilidades Pararrayos o Colector. Falla si no es un combate doble o triple. Este efecto se ignora mientras el usuario esté bajo el efecto de Caída Libre.", // NEEDS QC
		},

		start: "#followme",
		startFromZEffect: "#followme",
	},
	ragingbull: {
		name: "Furia Taurina",
		desc: "Si el ataque no falla, elimina los efectos de Reflejo, Pantalla de Luz, Velo Aurora del bando del objetivo antes de calcular el daño. Si la forma actual del usuario es un Tauros de Paldea, su tipo cambia según la variedad: Lucha (Combatiente), Fuego (Ardiente) o Agua (Acuática).", // NEEDS QC
		shortDesc: "Destruye pantallas. Tipo según su forma.", // NEEDS QC

		activate: "  ¡{POKEMON} ha destrozado las protecciones de {TEAM}!", // NEEDS QC
	},
	ragingfury: {
		name: "Erupción de Ira",
		desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla en el primer turno del efecto (o el segundo de un efecto de tres), el efecto termina sin causar confusión. Si lo llama Sonámbulo y el usuario está dormido, se usa 1 turno y no lo confunde.", // NEEDS QC
		shortDesc: "Dura 2-3 turnos y después confunde al usuario.", // NEEDS QC
	},
	raindance: {
		name: "Danza Lluvia",
		// Official flavor text: "Genera una fuerte lluvia que refuerza los movimientos de tipo Agua durante cinco turnos y debilita los de tipo Fuego."
		desc: "Durante 5 turnos, llueve: el daño de los ataques de tipo Agua se multiplica por 1,5 y el de los de tipo Fuego por 0,5. Dura 8 turnos con Roca Lluvia. Falla si ya llueve.", // NEEDS QC
		shortDesc: "5 turnos: la lluvia potencia los movimientos de Agua.", // NEEDS QC
		gen3: {
			desc: "Durante 5 turnos, llueve: el daño de los ataques de tipo Agua se multiplica por 1,5 y el de los de tipo Fuego por 0,5. Falla si ya llueve.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 5 turnos, llueve, incluso si ya está lloviendo: el daño de los ataques de tipo Agua se multiplica por 1,5 y el de los de tipo Fuego por 0,5.", // NEEDS QC
		},
	},
	rapidspin: {
		name: "Giro Rápido",
		// Official flavor text: "Ataque giratorio que puede eliminar movimientos como Atadura, Constricción y Drenadoras. También aumenta la Velocidad del usuario."
		desc: "Si acierta y el usuario no se ha debilitado, terminan para él los efectos de Drenadoras y de los movimientos de atadura, y se eliminan todas las trampas de su bando. 100% de probabilidad de subir 1 nivel la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Se libera de trampas y ataduras; +1 Velocidad.", // NEEDS QC
		gen7: {
			desc: "Si acierta y el usuario no se ha debilitado, terminan para él los efectos de Drenadoras y de los movimientos de atadura, y se eliminan todas las trampas de su bando.", // NEEDS QC
			shortDesc: "Libera de trampas, ataduras y Drenadoras.", // NEEDS QC
		},
		gen4: {
			desc: "Si acierta, terminan para el usuario los efectos de Drenadoras y de los movimientos de atadura, y se eliminan todas las trampas de su bando.", // NEEDS QC
		},
		gen3: {
			desc: "Si acierta, terminan para el usuario los efectos de Drenadoras y de los movimientos de atadura, y se elimina Púas de su bando.", // NEEDS QC
		},
	},
	razorleaf: {
		name: "Hoja Afilada",
		// Official flavor text: "Corta con hojas afiladas. Un ataque que suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta prob. de crítico. Golpea a los rivales adyacentes.", // NEEDS QC
		gen2: {
			shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
		},
	},
	razorshell: {
		name: "Concha Filo",
		// Official flavor text: "Una afilada vieira ataca al objetivo. También puede hacer disminuir su Defensa."
		desc: "50% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	razorwind: {
		name: "Viento Cortante",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Alta probabilidad de golpe crítico (índice +1). Carga el primer turno y golpea el segundo. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Carga y golpea el turno 2. Alta prob. de crítico.", // NEEDS QC
		gen4: {
			desc: "Alta probabilidad de golpe crítico. Carga el primer turno y golpea el segundo.", // NEEDS QC
		},
		gen3: {
			desc: "Carga el primer turno y golpea el segundo.", // NEEDS QC
			shortDesc: "Carga y golpea a los rivales el 2.º turno.", // NEEDS QC
		},
		gen2: {
			desc: "Alta probabilidad de golpe crítico. Carga el primer turno y golpea el segundo.", // NEEDS QC
			shortDesc: "Carga y golpea el 2.º turno. Alta prob. de crítico.", // NEEDS QC
		},
		gen1: {
			desc: "Carga el primer turno y golpea el segundo.", // NEEDS QC
			shortDesc: "Carga el 1.er turno. Golpea el 2.º.", // NEEDS QC
		},

		prepare: "  ¡{POKEMON} se prepara para lanzar una borrasca!",
	},
	recover: {
		name: "Recuperación",
		// Official flavor text: "Restaura hasta la mitad de los PS máximos."
		desc: "El usuario recupera la mitad de sus PS máximos (redondeado al alza desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		},
		gen1: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo). Falla si (PS máximos del usuario − PS actuales + 1) es divisible entre 256.", // NEEDS QC
		},
	},
	recycle: {
		name: "Reciclaje",
		// Official flavor text: "Recicla y así recupera un objeto equipado de un solo uso que ya haya sido empleado durante el combate."
		desc: "El usuario recupera el último objeto que usó. Falla si lleva objeto, si nunca ha llevado uno, si el objeto fue un Globo Helio explotado, si lo recogió un Pokémon con la habilidad Recogida o si se perdió por Picadura, Gas Corrosivo, Antojo, Calcinación, Desarme, Picoteo, Ladrón. Los objetos lanzados con Lanzamiento sí pueden recuperarse.", // NEEDS QC
		shortDesc: "Recupera el último objeto que usó.", // NEEDS QC
		gen7: {
			desc: "El usuario recupera el último objeto que usó. Falla si lleva objeto, si nunca ha llevado uno, si el objeto fue un Globo Helio explotado, si lo recogió un Pokémon con la habilidad Recogida o si se perdió por Picadura, Antojo, Calcinación, Desarme, Picoteo, Ladrón. Los objetos lanzados con Lanzamiento sí pueden recuperarse.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario recupera el último objeto usado por un Pokémon en su posición actual del campo, aunque ese Pokémon no fuera el usuario. Falla si el usuario lleva objeto, si no se ha usado ningún objeto en su posición o si el objeto se perdió por Antojo, Desarme, Ladrón. Los objetos lanzados con Lanzamiento sí pueden recuperarse.", // NEEDS QC
		},

		addItem: "  ¡{POKEMON} ha reciclado {ITEM}!",
	},
	reflect: {
		name: "Reflejo",
		// Official flavor text: "Pared de luz que reduce durante cinco turnos el daño producido por los ataques físicos."
		desc: "Durante 5 turnos, el usuario y sus aliados reciben 0,5 veces el daño de ataques físicos (0,66 en combates dobles). No se acumula con Velo Aurora. Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición, Psicocolmillo, Despejar. Dura 8 turnos con Refleluz. Falla si ya está activo en su bando.", // NEEDS QC
		shortDesc: "5 turnos: daño físico a los aliados a la mitad.", // NEEDS QC
		gen6: {
			desc: "Durante 5 turnos, el usuario y sus aliados reciben 0,5 veces el daño de ataques físicos (0,66 en combates dobles o triples). Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición o Despejar. Dura 8 turnos con Refleluz. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 5 turnos, el usuario y sus aliados reciben 1/2 del daño de ataques físicos (2/3 si hay varios Pokémon activos en el bando del usuario). Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición o Despejar. Dura 8 turnos con Refleluz. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
		},
		gen3: {
			desc: "Durante 5 turnos, el usuario y sus aliados reciben 1/2 del daño de ataques físicos (2/3 si hay varios Pokémon activos en el bando del usuario). Los golpes críticos ignoran este efecto. Desaparece del bando del usuario si él o un aliado reciben Demolición. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 5 turnos, el usuario y sus aliados tienen su Defensa duplicada. Los golpes críticos ignoran este efecto. Falla si el efecto ya está activo en el bando del usuario.", // NEEDS QC
			shortDesc: "5 turnos: duplica la Defensa del equipo.", // NEEDS QC
		},
		gen1: {
			desc: "Mientras el usuario siga en combate, su Defensa se duplica al recibir daño. Los golpes críticos ignoran esta protección. Este efecto puede eliminarse con Niebla.", // NEEDS QC
			shortDesc: "Mientras está activo, su Defensa se duplica.", // NEEDS QC
			start: "  ¡{POKEMON} ganó blindaje!",
		},

		start: "  ¡Reflejo ha aumentado la resistencia de {TEAM} ante los ataques físicos!",
		end: "  El efecto de Reflejo en {TEAM} se ha disipado.",
	},
	reflecttype: {
		name: "Clonatipo",
		// Official flavor text: "Cambia el tipo del Pokémon al mismo tipo que el del objetivo."
		desc: "Los tipos del usuario pasan a ser los tipos actuales del objetivo. Si estos incluyen el tipo sin definir y un tipo no añadido, el sin definir se ignora; si incluyen el tipo sin definir y uno añadido por Condena Silvana o Halloween, el sin definir se copia como tipo Normal. Falla si el usuario es un Arceus o un Silvally, si está teracristalizado o si el tipo actual del objetivo es solo el tipo sin definir.", // NEEDS QC
		shortDesc: "Copia los tipos del objetivo.", // NEEDS QC
		gen8: {
			desc: "Los tipos del usuario pasan a ser los tipos actuales del objetivo. Si estos incluyen el tipo sin definir y un tipo no añadido, el sin definir se ignora; si incluyen el tipo sin definir y uno añadido por Condena Silvana o Halloween, el sin definir se copia como tipo Normal. Falla si el usuario es un Arceus o un Silvally, o si el tipo actual del objetivo es solo el tipo sin definir.", // NEEDS QC
		},
		gen6: {
			desc: "Los tipos del usuario pasan a ser los tipos actuales del objetivo. Falla si el usuario es un Arceus.", // NEEDS QC
		},

		typeChange: "  ¡{POKEMON} ahora es del mismo tipo que {SOURCE}!",
	},
	refresh: {
		name: "Alivio",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Cura la quemadura, el envenenamiento o la parálisis del usuario. Falla si no sufre ninguno de esos problemas.", // NEEDS QC
		shortDesc: "Cura su quemadura, envenenamiento o parálisis.", // NEEDS QC
	},
	relicsong: {
		name: "Canto Arcaico",
		// Official flavor text: "Ataca conmoviendo a los rivales de alrededor con un antiguo canto. Puede dormirlos."
		desc: "10% de probabilidad de dormir al objetivo. Si acierta al menos a un objetivo y el usuario es un Meloetta, cambia a la Forma Danza si está en Forma Lírica, o a la Forma Lírica si está en Forma Danza. No cambia si tiene la habilidad Potencia Bruta. La Forma Danza vuelve a la Lírica al dejar el combate.", // NEEDS QC
		shortDesc: "10% de dormir. Meloetta cambia de forma.", // NEEDS QC
	},
	rest: {
		name: "Descanso",
		// Official flavor text: "Restaura todos los PS y cura todos los problemas de estado del usuario, que se duerme los dos turnos siguientes."
		desc: "El usuario se duerme durante los 2 turnos siguientes y recupera todos sus PS, curando también sus problemas de estado. Falla si tiene todos sus PS, si ya está dormido o si otro efecto le impide dormir.", // NEEDS QC
		shortDesc: "Duerme 2 turnos y recupera PS y estado.", // NEEDS QC
		gen2: {
			desc: "El usuario se duerme durante los 2 turnos siguientes y recupera todos sus PS, curando también sus problemas de estado, incluso si ya estaba dormido. Falla si tiene todos sus PS.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario se duerme durante los 2 turnos siguientes y recupera todos sus PS, curando también sus problemas de estado. No elimina la penalización de características por quemadura o parálisis. Falla si tiene todos sus PS.", // NEEDS QC
		},
	},
	retaliate: {
		name: "Represalia",
		// Official flavor text: "Venga a los amigos caídos. Si en el turno anterior han derrotado a alguno, la potencia del ataque aumentará."
		desc: "La potencia se duplica si un compañero del usuario se debilitó el turno anterior.", // NEEDS QC
		shortDesc: "Potencia doble si un aliado cayó el turno anterior.", // NEEDS QC
	},
	return: {
		name: "Retribución",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia es (amistad del usuario×2/5) (redondeado hacia abajo, mínimo 1).", // NEEDS QC
		shortDesc: "Potencia máxima (102) con amistad máxima.", // NEEDS QC
	},
	revelationdance: {
		name: "Danza Despertar",
		// Official flavor text: "Ataque que consiste en un baile muy enérgico. El tipo de este ataque se corresponde con el del Pokémon que lo ejecuta."
		desc: "Su tipo depende del primer tipo del usuario. Si este es el tipo sin definir, usa el segundo tipo si lo hay, o el añadido por Condena Silvana o Halloween. Si el usuario solo tiene el tipo sin definir, el movimiento tampoco tiene tipo.", // NEEDS QC
		shortDesc: "Su tipo es el primer tipo del usuario.", // NEEDS QC
	},
	revenge: {
		name: "Desquite",
		// Official flavor text: "Ataque que produce el doble de daño si el usuario resulta herido en el mismo turno."
		desc: "La potencia se duplica si el usuario fue golpeado por el objetivo este turno.", // NEEDS QC
		shortDesc: "Potencia doble si el objetivo lo dañó este turno.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica si el usuario fue golpeado este turno por un Pokémon en la posición actual del objetivo.", // NEEDS QC
		},
		gen3: {
			desc: "El daño se duplica si el usuario fue golpeado este turno por un Pokémon en la posición actual del objetivo, y ese Pokémon fue el último en golpearlo.", // NEEDS QC
			shortDesc: "Doble de daño si el objetivo lo golpeó antes.", // NEEDS QC
		},
	},
	reversal: {
		name: "Inversión",
		// Official flavor text: "Ataque desesperado que causa más daño cuantos menos PS tenga el usuario."
		desc: "La potencia depende de X=(PS actuales del usuario×48÷PS máximos del usuario) (redondeado hacia abajo): 20 si X es 33-48, 40 si es 17-32, 80 si es 10-16, 100 si es 5-9, 150 si es 2-4 y 200 si es 0-1.", // NEEDS QC
		shortDesc: "Más potencia cuantos menos PS le queden al usuario.", // NEEDS QC
		gen4: {
			desc: "La potencia es 20 si X va de 43 a 48, 40 de 22 a 42, 80 de 13 a 21, 100 de 6 a 12, 150 de 2 a 5 y 200 si X es 0 o 1, donde X es (PS actuales del usuario × 64 ÷ PS máximos del usuario), redondeado hacia abajo.", // NEEDS QC
		},
		gen3: {
			desc: "La potencia depende de X=(PS actuales del usuario×48÷PS máximos del usuario) (redondeado hacia abajo): 20 si X es 33-48, 40 si es 17-32, 80 si es 10-16, 100 si es 5-9, 150 si es 2-4 y 200 si es 0-1.", // NEEDS QC
		},
		gen2: {
			desc: "La potencia es 20 si X va de 33 a 48, 40 de 17 a 32, 80 de 10 a 16, 100 de 5 a 9, 150 de 2 a 4 y 200 si X es 0 o 1, donde X es (PS actuales del usuario × 48 ÷ PS máximos del usuario), redondeado hacia abajo. Este movimiento no tiene varianza de daño y no puede ser crítico.", // NEEDS QC
		},
	},
	revivalblessing: {
		name: "Plegaria Vital",
		desc: "Revive a un compañero debilitado elegido con la mitad de sus PS máximos (redondeado hacia abajo). Falla si no hay compañeros debilitados.", // NEEDS QC
		shortDesc: "Revive a un compañero debilitado con la mitad de PS.", // NEEDS QC

		heal: "  ¡{POKEMON} se ha repuesto y está listo para combatir!",
	},
	risingvoltage: {
		name: "Alto Voltaje",
		// Official flavor text: "Ataca con una descarga eléctrica que surge del terreno de combate. La potencia del movimiento se duplica si el rival se ve afectado por un campo eléctrico."
		desc: "Si hay campo eléctrico y el objetivo está en el suelo, su potencia se duplica.", // NEEDS QC
		shortDesc: "Doble contra objetivos en el suelo en campo eléctrico.", // NEEDS QC
	},
	roar: {
		name: "Rugido",
		// Official flavor text: "Se lleva al objetivo, que es cambiado por otro Pokémon. Si es un Pokémon salvaje, acaba el combate."
		desc: "Obliga al objetivo a cambiarse por un aliado sano al azar. Falla si el objetivo es el último Pokémon sano de su equipo, si usó Arraigo o si tiene la habilidad Ventosas.", // NEEDS QC
		shortDesc: "Obliga al objetivo a cambiarse por un aliado al azar.", // NEEDS QC
		gen4: {
			desc: "Obliga al objetivo a cambiarse por un aliado sano al azar. Falla si el objetivo es el último Pokémon sano de su equipo, si usó Arraigo o si tiene la habilidad Ventosas, o si el nivel del usuario es menor que el del objetivo y X×(nivel del usuario+nivel del objetivo)÷256+1 es menor o igual que (nivel del objetivo÷4), redondeado hacia abajo, donde X es un número al azar entre 0 y 255.", // NEEDS QC
		},
		gen2: {
			desc: "Obliga al objetivo a cambiarse por un aliado sano al azar. Falla si el objetivo es el último Pokémon sano de su equipo, o si el usuario actúa antes que el objetivo.", // NEEDS QC
		},
		gen1: {
			desc: "Sin uso competitivo.", // NEEDS QC
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	roaroftime: {
		name: "Distorsión",
		// Official flavor text: "Ataca al objetivo usando tal energía que el tiempo se distorsiona. El usuario descansa el siguiente turno."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	rockblast: {
		name: "Pedrada",
		// Official flavor text: "Lanza pedruscos al objetivo de dos a cinco veces consecutivas."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
	},
	rockclimb: {
		name: "Treparrocas",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "20% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "20% de confundir al objetivo.", // NEEDS QC
	},
	rockpolish: {
		name: "Pulimento",
		// Official flavor text: "Reduce la resistencia puliendo su cuerpo. Aumenta mucho la Velocidad."
		desc: "Sube 2 niveles la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Velocidad del usuario.", // NEEDS QC
	},
	rockslide: {
		name: "Avalancha",
		// Official flavor text: "Lanza grandes pedruscos. Puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		gen1: {
			desc: "Sin efecto adicional.", // NEEDS QC
			shortDesc: "Sin efecto adicional.", // NEEDS QC
		},
		gen2: {
			shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		},
	},
	rocksmash: {
		name: "Golpe Roca",
		// Official flavor text: "Ataque con los puños. Puede bajar la Defensa del objetivo."
		desc: "50% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	rockthrow: {
		name: "Lanzarrocas",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	rocktomb: {
		name: "Tumba Rocas",
		// Official flavor text: "Tira rocas que detienen al objetivo y bajan su Velocidad."
		desc: "100% de probabilidad de bajar 1 nivel la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Velocidad del objetivo.", // NEEDS QC
	},
	rockwrecker: {
		name: "Romperrocas",
		// Official flavor text: "Lanza una piedra enorme contra el objetivo, pero tiene que descansar el siguiente turno."
		desc: "Si acierta, el usuario debe recargar el turno siguiente y no puede seleccionar movimiento.", // NEEDS QC
		shortDesc: "El usuario no puede actuar el próximo turno.", // NEEDS QC
	},
	roleplay: {
		name: "Imitación",
		// Official flavor text: "Imita al objetivo por completo y copia su habilidad."
		desc: "La habilidad del usuario pasa a ser la del objetivo. Falla si la del usuario es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Modo Daruma, Cambio Heroico o ya coincide, o si la del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Don Floral, Predicción, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Reacción Química, Paleosíntesis, Carga Cuark, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Calco, Superguarda, Modo Daruma, Cambio Heroico o Evocarrecuerdos.", // NEEDS QC
		shortDesc: "Copia la habilidad del objetivo.", // NEEDS QC
		gen8: {
			desc: "La habilidad del usuario pasa a ser la del objetivo. Falla si la del usuario es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Modo Daruma o ya coincide, o si la del objetivo es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Tragamisil, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Superguarda, Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "La habilidad del usuario pasa a ser la del objetivo. Falla si la del usuario es Fuerte Afecto, Letargo Perenne, Disfraz, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Modo Daruma o ya coincide, o si la del objetivo es Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Ilusión, Impostor, Multitipo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Superguarda, Modo Daruma.", // NEEDS QC
		},
		gen6: {
			desc: "La habilidad del usuario pasa a ser la del objetivo. Falla si la del usuario es Multitipo, Cambio Táctico o ya coincide, o si la del objetivo es Don Floral, Predicción, Ilusión, Impostor, Multitipo, Cambio Táctico, Calco, Superguarda, Modo Daruma.", // NEEDS QC
		},
		gen5: {
			desc: "La habilidad del usuario pasa a ser la del objetivo. Falla si la del usuario es Multitipo o ya coincide, o si la del objetivo es Don Floral, Predicción, Ilusión, Impostor, Multitipo, Calco, Superguarda, Modo Daruma.", // NEEDS QC
		},
		gen4: {
			desc: "La habilidad del usuario pasa a ser la del objetivo. Falla si la del usuario es Multitipo o ya coincide, si la del objetivo es Multitipo o Superguarda, o si el usuario lleva Griseosfera.", // NEEDS QC
		},
		gen3: {
			desc: "La habilidad del usuario pasa a ser la del objetivo. Falla si la habilidad del objetivo es Superguarda.", // NEEDS QC
		},

		changeAbility: "  ¡{POKEMON} ha copiado la habilidad {ABILITY} de {SOURCE}!",
	},
	rollingkick: {
		name: "Patada Giro",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	rollout: {
		name: "Rodar",
		// Official flavor text: "El atacante rueda contra el objetivo durante cinco turnos, cada vez con mayor fuerza."
		desc: "Si acierta, el usuario queda fijado en este movimiento hasta que falle, pasen 5 turnos o no pueda usarse. La potencia se duplica con cada acierto, y otra vez si el usuario usó antes Rizo Defensa. Si lo llama Sonámbulo, se usa durante 1 turno.", // NEEDS QC
		shortDesc: "Potencia doble por golpe. Se repite 5 turnos.", // NEEDS QC
		gen7: {
			desc: "Si acierta, el usuario queda fijado en este movimiento y no puede usar otro hasta que falle, pasen 5 turnos o el ataque no pueda usarse. La potencia se duplica con cada golpe exitoso y se duplica de nuevo si el usuario usó antes Rizo Defensa. Si se usa mediante Sonámbulo, se usa durante un turno. Si golpea un Disfraz activo durante el efecto, el multiplicador de potencia se pausa pero el contador de turnos no, lo que puede permitir aplicar el multiplicador al siguiente movimiento del usuario tras acabar el efecto.", // NEEDS QC
		},
		gen6: {
			desc: "Si acierta, el usuario queda fijado en este movimiento hasta que falle, pasen 5 turnos o no pueda usarse. La potencia se duplica con cada acierto, y otra vez si el usuario usó antes Rizo Defensa. Si lo llama Sonámbulo, se usa durante 1 turno.", // NEEDS QC
		},
	},
	roost: {
		name: "Respiro",
		// Official flavor text: "Aterriza sobre la superficie para descansar. Recupera hasta la mitad del total de sus PS."
		desc: "El usuario recupera la mitad de sus PS máximos (redondeado al alza desde 0,5). Si no está teracristalizado, hasta el final del turno los usuarios de tipo Volador pierden ese tipo y los puramente Voladores pasan a ser de tipo Normal. No hace nada si tiene todos sus PS.", // NEEDS QC
		shortDesc: "Recupera 1/2 PS. Pierde el tipo Volador este turno.", // NEEDS QC
		gen8: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado al alza desde 0,5). Hasta el final del turno, los usuarios de tipo Volador pierden ese tipo y los puramente Voladores pasan a ser de tipo Normal. No hace nada si tiene todos sus PS.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo). Hasta el final del turno, los usuarios de tipo Volador pierden ese tipo y los puramente Voladores quedan sin tipo. No hace nada si tiene todos sus PS.", // NEEDS QC
		},

		start: "  ({POKEMON} pierde el tipo Volador durante este turno.)", // NEEDS QC
	},
	rototiller: {
		name: "Fertilizante",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Sube 1 nivel el Ataque y el Ataque Especial de todos los Pokémon de tipo Planta en el suelo.", // NEEDS QC
		shortDesc: "+1 Ataque y At. Esp. a los Planta en el suelo.", // NEEDS QC
	},
	round: {
		name: "Canon",
		// Official flavor text: "Un canto que ataca al objetivo. Cuantos más Pokémon lo usan, más aumenta de potencia."
		desc: "Si otros Pokémon en combate eligieron este movimiento este turno, actúan justo después del usuario en orden de Velocidad, y su potencia es 120 para cada uno de ellos.", // NEEDS QC
		shortDesc: "Potencia doble si otros usaron Canon este turno.", // NEEDS QC
	},
	ruination: {
		name: "Calamidad",
		desc: "Inflige un daño igual a la mitad de los PS actuales del objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Inflige la mitad de los PS actuales del objetivo.", // NEEDS QC
	},
	sacredfire: {
		name: "Fuego Sagrado",
		// Official flavor text: "Fuego místico de gran intensidad que puede causar quemaduras."
		desc: "50% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "50% de quemar. Descongela al usuario.", // NEEDS QC
	},
	sacredsword: {
		name: "Espada Santa",
		// Official flavor text: "El usuario ataca con una espada, ignorando cualquier cambio en las características del objetivo."
		desc: "Ignora los cambios de características del objetivo, incluida la evasión.", // NEEDS QC
		shortDesc: "Ignora los cambios de características del objetivo.", // NEEDS QC
	},
	safeguard: {
		name: "Velo Sagrado",
		// Official flavor text: "Un escudo que protege de problemas de estado, como el sueño o la parálisis, durante cinco turnos."
		desc: "Durante 5 turnos, otros Pokémon no pueden infligir problemas de estado ni confusión al usuario ni a sus compañeros. Los Pokémon de su bando no pueden verse afectados por Bostezo, pero sí dormirse por su efecto previo. Desaparece si el usuario o un aliado reciben Despejar. Falla si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "5 turnos: protege a su equipo de los estados.", // NEEDS QC
		gen3: {
			desc: "Durante 5 turnos, otros Pokémon no pueden infligir problemas de estado ni confusión al usuario ni a sus compañeros. Los Pokémon de su bando no pueden verse afectados por Bostezo, pero sí dormirse por su efecto previo. Falla si el efecto ya está activo en su bando.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 5 turnos, otros Pokémon no pueden infligir problemas de estado ni confusión al usuario ni a sus compañeros. Mientras dura el efecto, Enfado, Saña y Danza Pétalo no confunden al usuario. Falla si el efecto ya está activo en su bando.", // NEEDS QC
		},

		start: "  ¡{TEAM:capitalize} se ha protegido con Velo Sagrado!",
		end: "  El efecto de Velo Sagrado en {TEAM} se ha disipado.",
		block: "  ¡{POKEMON} está protegido por Velo Sagrado!",
	},
	saltcure: {
		name: "Salazón",
		desc: "Inflige al objetivo 1/8 de sus PS máximos (1/4 si es de tipo Acero o Agua, redondeado hacia abajo) al final de cada turno mientras dure el efecto. Termina cuando el objetivo deja el combate.", // NEEDS QC
		shortDesc: "Daña 1/8 por turno; 1/4 a Acero y Agua.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  ¡{POKEMON} está en salazón!",
		damage: "  ¡Salazón ha herido a {POKEMON}!",
	},
	sandattack: {
		name: "Ataque Arena",
		// Official flavor text: "Arroja arena a la cara y baja la Precisión."
		desc: "Baja 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel precisión del objetivo.", // NEEDS QC
	},
	sandsearstorm: {
		name: "Simún de Arena",
		desc: "20% de probabilidad de quemar al objetivo. No puede fallar si llueve o hay diluvio. Contra un objetivo con Parasol Multiuso, su precisión sigue siendo del 80%.", // NEEDS QC
		shortDesc: "20% de quemar. No falla con lluvia.", // NEEDS QC
	},
	sandstorm: {
		name: "Tormenta de Arena",
		// Official flavor text: "Tormenta de arena que dura cinco turnos y hiere a todos, excepto a los de tipo Roca, Tierra y Acero, y aumenta la Defensa Especial de los de tipo Roca."
		desc: "Durante 5 turnos, hay tormenta de arena: al final de cada turno salvo el último, todos los Pokémon en combate pierden 1/16 de sus PS máximos (redondeado hacia abajo), salvo los de tipo Tierra, Roca o Acero o con las habilidades Muro Mágico, Funda, Poder Arena, Ímpetu Arena, Velo Arena. Durante el efecto, la Defensa Especial de los Pokémon de tipo Roca se multiplica por 1,5 al recibir ataques especiales. Dura 8 turnos con Roca Suave. Falla si ya hay tormenta de arena.", // NEEDS QC
		shortDesc: "5 turnos: tormenta de arena. Roca: 1,5x Def. Esp.", // NEEDS QC
		gen4: {
			desc: "Durante 5 turnos, hay tormenta de arena: al final de cada turno salvo el último, todos los Pokémon en combate pierden 1/16 de sus PS máximos (redondeado hacia abajo), salvo los de tipo Tierra, Roca o Acero o con las habilidades Muro Mágico o Velo Arena. Durante el efecto, la Defensa Especial de los Pokémon de tipo Roca se multiplica por 1,5 al recibir ataques especiales. Dura 8 turnos con Roca Suave. Falla si ya hay tormenta de arena.", // NEEDS QC
		},
		gen3: {
			desc: "Durante 5 turnos, hay tormenta de arena: al final de cada turno salvo el último, todos los Pokémon en combate pierden 1/16 de sus PS máximos (redondeado hacia abajo), salvo los de tipo Tierra, Roca o Acero o con la habilidad Velo Arena. Falla si ya hay tormenta de arena.", // NEEDS QC
			shortDesc: "Durante 5 turnos hay tormenta de arena.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 5 turnos, hay tormenta de arena: al final de cada turno salvo el último, todos los Pokémon en combate pierden 1/8 de sus PS máximos (redondeado hacia abajo), salvo los de tipo Tierra, Roca o Acero. Falla si ya hay tormenta de arena.", // NEEDS QC
		},
	},
	sandtomb: {
		name: "Bucle Arena",
		// Official flavor text: "Enreda al objetivo en un remolino de arena de cuatro a cinco turnos."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (1/8 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa Giro Rápido. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos (siempre 5 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
			shortDesc: "Atrapa y daña al objetivo durante 2-5 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si usa Relevo. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},

		start: "  ¡Bucle Arena ha atrapado a {POKEMON}!",
	},
	sappyseed: {
		name: "Leafitobombas",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Genera el efecto de Drenadoras sobre el objetivo.", // NEEDS QC
		shortDesc: "Planta el efecto de Drenadoras.", // NEEDS QC
	},
	savagespinout: {
		name: "Guadaña Sedosa",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	scald: {
		name: "Escaldar",
		// Official flavor text: "Ataca arrojando agua hirviendo al objetivo. Puede causar quemaduras."
		desc: "30% de probabilidad de quemar al objetivo. Descongela al objetivo.", // NEEDS QC
		shortDesc: "30% de quemar. Descongela al objetivo.", // NEEDS QC
		gen5: {
			desc: "30% de probabilidad de quemar al objetivo.", // NEEDS QC
			shortDesc: "30% de quemar al objetivo.", // NEEDS QC
		},
	},
	scaleshot: {
		name: "Ráfaga Escamas",
		// Official flavor text: "Lanza escamas al objetivo de dos a cinco veces seguidas. Aumenta la Velocidad del usuario, pero reduce su Defensa."
		desc: "Golpea de 2 a 5 veces; tras el último golpe, baja 1 nivel la Defensa del usuario y sube 1 nivel su Velocidad. 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea 2-5 veces. Después: -1 Def., +1 Vel.", // NEEDS QC
	},
	scaryface: {
		name: "Cara Susto",
		// Official flavor text: "Asusta al objetivo para reducir mucho su Velocidad."
		desc: "Baja 2 niveles la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles Velocidad del objetivo.", // NEEDS QC
	},
	scorchingsands: {
		name: "Arenas Ardientes",
		// Official flavor text: "Ataca al objetivo arrojándole arena a temperaturas muy elevadas. Puede causar quemaduras."
		desc: "30% de probabilidad de quemar al objetivo. Descongela al objetivo.", // NEEDS QC
		shortDesc: "30% de quemar. Descongela al objetivo.", // NEEDS QC
	},
	scratch: {
		name: "Arañazo",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	screech: {
		name: "Chirrido",
		// Official flavor text: "Alarido agudo que reduce mucho la Defensa del objetivo."
		desc: "Baja 2 niveles la Defensa del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles Defensa del objetivo.", // NEEDS QC
	},
	searingshot: {
		name: "Bomba Ígnea",
		// Official flavor text: "Un infierno de llamas daña a los Pokémon adyacentes en combate. Puede quemar."
		desc: "30% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "30% de quemar a los Pokémon adyacentes.", // NEEDS QC
	},
	searingsunrazesmash: {
		name: "Embestida Solar",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Ignora las habilidades de otros Pokémon.", // NEEDS QC
	},
	secretpower: {
		name: "Daño Secreto",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de causar un efecto secundario según el campo: parálisis por defecto y en campo eléctrico, baja 1 nivel el Ataque Especial en campo de niebla, sueño en campo de hierba y baja 1 nivel la Velocidad en campo psíquico.", // NEEDS QC
		shortDesc: "Efecto según el campo (30% de parálisis).", // NEEDS QC
		gen6: {
			desc: "30% de probabilidad de causar un efecto secundario según el campo: parálisis en el campo Wi-Fi estándar y en campo eléctrico, baja 1 nivel el Ataque Especial en campo de niebla y sueño en campo de hierba.", // NEEDS QC
		},
		gen5: {
			desc: "30% de probabilidad de causar un efecto secundario según el campo: baja 1 nivel la precisión en el campo Wi-Fi estándar. La probabilidad del efecto secundario no se ve afectada por la habilidad Dicha.", // NEEDS QC
			shortDesc: "Efecto según el campo. (30% de precisión -1)", // NEEDS QC
		},
		gen4: {
			desc: "30% de probabilidad de causar un efecto secundario según el campo: parálisis en el campo Wi-Fi estándar.", // NEEDS QC
			shortDesc: "Efecto según el campo (30% de parálisis).", // NEEDS QC
		},
	},
	secretsword: {
		name: "Sable Místico",
		// Official flavor text: "Ensarta al objetivo con un largo cuerno dotado de un poder místico que provoca daño físico."
		desc: "El daño se calcula con la Defensa del objetivo en lugar de su Defensa Especial.", // NEEDS QC
		shortDesc: "Daña usando la Defensa del objetivo, no su Def. Esp.", // NEEDS QC
	},
	seedbomb: {
		name: "Bomba Germen",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	seedflare: {
		name: "Fulgor Semilla",
		// Official flavor text: "Una onda de choque se libera del cuerpo. Puede bajar mucho la Defensa Especial del objetivo."
		desc: "40% de probabilidad de bajar 2 niveles la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "40% de bajar 2 niveles Def. Esp. del objetivo.", // NEEDS QC
	},
	seismictoss: {
		name: "Sísmico",
		// Official flavor text: "Aprovecha la gravedad para derribar al objetivo. Le resta tantos PS como nivel tenga el usuario."
		desc: "Inflige un daño igual al nivel del usuario.", // NEEDS QC
		shortDesc: "Inflige un daño igual al nivel del usuario.", // NEEDS QC
		gen1: {
			desc: "Inflige un daño igual al nivel del usuario. Este movimiento ignora la inmunidad de tipo.", // NEEDS QC
			shortDesc: "Daño = nivel del usuario. Golpea a tipos Fantasma.", // NEEDS QC
		},
	},
	selfdestruct: {
		name: "Autodestrucción",
		// Official flavor text: "El atacante explota y hiere a todos a su alrededor. El usuario se debilita de inmediato."
		desc: "El usuario se debilita tras usarlo, incluso si falla por no haber objetivo. No puede ejecutarse si algún Pokémon en combate tiene la habilidad Humedad.", // NEEDS QC
		shortDesc: "Golpea a los adyacentes. El usuario se debilita.", // NEEDS QC
		gen4: {
			desc: "El usuario se debilita tras usar este movimiento, salvo si no tiene objetivo. La Defensa del objetivo se reduce a la mitad durante el cálculo del daño. Este movimiento no se ejecuta si hay en combate un Pokémon con la habilidad Humedad.", // NEEDS QC
			shortDesc: "Mitad de Def. del objetivo al calcular. Se debilita.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario se debilita tras usar este movimiento. La Defensa del objetivo se reduce a la mitad durante el cálculo del daño. Este movimiento no se ejecuta si hay en combate un Pokémon con la habilidad Humedad.", // NEEDS QC
		},
		gen2: {
			desc: "El usuario se debilita tras usar este movimiento. La Defensa del objetivo se reduce a la mitad durante el cálculo del daño.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario se debilita tras usarlo, salvo que el sustituto del objetivo se rompiera con el daño. La Defensa del objetivo se reduce a la mitad durante el cálculo de daño.", // NEEDS QC
		},
	},
	shadowball: {
		name: "Bola Sombra",
		// Official flavor text: "Lanza una bola oscura que puede bajar la Defensa Especial del objetivo."
		desc: "20% de probabilidad de bajar 1 nivel la Defensa Especial del objetivo.", // NEEDS QC
		shortDesc: "20% de bajar 1 nivel Def. Esp. del objetivo.", // NEEDS QC
	},
	shadowbone: {
		name: "Hueso Sombrío",
		// Official flavor text: "Ataca al oponente golpeándole con un hueso poseído por un espíritu. Puede reducir la Defensa del objetivo."
		desc: "20% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "20% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	shadowclaw: {
		name: "Garra Umbría",
		// Official flavor text: "Ataca con una garra afilada hecha de sombras. Suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	shadowforce: {
		name: "Golpe Umbrío",
		// Official flavor text: "En el primer turno, desaparece. En el segundo, golpea al objetivo aunque se esté protegiendo."
		desc: "Si acierta, rompe este turno la protección de Búnker, Detección, Escudo Real, Protección, Barrera Espinosa del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad; también rompe Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia del bando del objetivo. Desaparece el primer turno y golpea el segundo; mientras está oculto no recibe ningún ataque. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Desaparece y golpea el turno 2. Rompe protecciones.", // NEEDS QC
		gen6: {
			desc: "Si acierta, rompe este turno la protección de Detección, Escudo Real, Protección, Barrera Espinosa del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad; también rompe Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia del bando del objetivo, y otros Pokémon pueden atacar ese bando con normalidad. Desaparece el primer turno y golpea el segundo; mientras está oculto no recibe ningún ataque. Con Hierba Única, ataca en 1 turno. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		},
		gen5: {
			desc: "Si acierta, rompe este turno la protección de Detección o Protección del objetivo, permitiendo que otros Pokémon lo ataquen con normalidad. Si el objetivo es un rival y su bando está protegido por Anticipo o Vasta Guardia, esa protección también se rompe este turno y otros Pokémon pueden atacar ese bando con normalidad. Carga el primer turno y golpea el segundo; el primer turno evita todos los ataques. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		},

		activate: "  ¡Se ha atravesado la protección de {TARGET}!",
		prepare: "¡{POKEMON} desaparece en un abrir y cerrar de ojos!",
	},
	shadowpunch: {
		name: "Puño Sombra",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	shadowsneak: {
		name: "Sombra Vil",
		// Official flavor text: "Extiende su sombra y ataca al objetivo por la espalda. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	shadowstrike: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "50% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "50% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	sharpen: {
		name: "Afilar",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Sube 1 nivel el Ataque del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Ataque del usuario.", // NEEDS QC
	},
	shatteredpsyche: {
		name: "Disruptor Psíquico",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	shedtail: {
		name: "Autotomía",
		desc: "El usuario pierde la mitad de sus PS máximos (redondeado hacia arriba) para crear un sustituto con 1/4 de sus PS máximos (redondeado hacia abajo). Después se cambia por otro Pokémon de su equipo, que hereda el sustituto. Falla si el usuario se debilitaría o si no quedan compañeros sanos.", // NEEDS QC
		shortDesc: "Pierde la mitad de sus PS y pasa un sustituto.", // NEEDS QC

		start: "  ¡{POKEMON} se desprende de un segmento de su cuerpo y lo usa como señuelo!",
		alreadyStarted: "#substitute",
		fail: "#substitute",
	},
	sheercold: {
		name: "Frío Polar",
		// Official flavor text: "Debilita al objetivo de un solo golpe. Si lo usa un Pokémon que no sea de tipo Hielo, es difícil que acierte."
		desc: "Debilita al objetivo de un golpe (daño igual a sus PS máximos). Ignora los cambios de precisión y evasión. Su precisión es (nivel del usuario−nivel del objetivo+X)%, donde X es 30 si el usuario es de tipo Hielo y 20 si no, y falla si el objetivo tiene mayor nivel. Los Pokémon de tipo Hielo y los que tienen la habilidad Robustez son inmunes.", // NEEDS QC
		shortDesc: "Debilita de un golpe. No afecta al tipo Hielo.", // NEEDS QC
		gen6: {
			desc: "Debilita al objetivo de un golpe (daño igual a sus PS máximos). Ignora los cambios de precisión y evasión. Su precisión es (nivel del usuario−nivel del objetivo+30)% y falla si el objetivo tiene mayor nivel. Los Pokémon con la habilidad Robustez son inmunes.", // NEEDS QC
			shortDesc: "Debilita de un golpe. Falla contra niveles mayores.", // NEEDS QC
		},
	},
	shellsidearm: {
		name: "Moluscañón",
		// Official flavor text: "El usuario lanza un ataque físico o especial en función de cuál inflija más daño. Puede envenenar al objetivo."
		desc: "20% de probabilidad de envenenar al objetivo. Se convierte en ataque físico con contacto si el valor de ((((2×nivel del usuario÷5+2)×90×X)÷Y)÷50) es mayor con X=Ataque del usuario e Y=Defensa del objetivo que con X=Ataque Especial e Y=Defensa Especial. Solo se consideran los cambios de nivel. Si ambos valores son iguales, elige la categoría al azar.", // NEEDS QC
		shortDesc: "20% de envenenar. Físico si hace más daño así.", // NEEDS QC
	},
	shellsmash: {
		name: "Rompecoraza",
		// Official flavor text: "El usuario rompe su coraza y baja su Defensa y Defensa Especial, pero aumenta mucho su Ataque, Ataque Especial y Velocidad."
		desc: "Baja 1 nivel la Defensa y la Defensa Especial del usuario y sube 2 niveles su Ataque, Ataque Especial y Velocidad.", // NEEDS QC
		shortDesc: "-1 Def. y Def. Esp.; +2 Ataque, At. Esp. y Vel.", // NEEDS QC
	},
	shelltrap: {
		name: "Coraza Trampa",
		// Official flavor text: "El caparazón del Pokémon se convierte en una trampa. Si le alcanza un ataque físico, la trampa estalla y los oponentes sufren daño."
		desc: "Falla salvo que el usuario reciba un ataque físico de un rival este turno antes de ejecutarlo. Si lo recibe y no se ha debilitado, ataca justo después de ser golpeado y el efecto termina. Si el ataque físico del rival perdió su efecto secundario por la habilidad Potencia Bruta, no cuenta para este efecto.", // NEEDS QC
		shortDesc: "Debe recibir daño físico antes de actuar.", // NEEDS QC

		start: "  ¡{POKEMON} ha activado la Coraza Trampa!",
		prepare: "  ¡{POKEMON} ha activado la Coraza Trampa!",
		cant: "¡La Coraza Trampa de {POKEMON} no ha estallado!",
	},
	shelter: {
		name: "Retracción",
		desc: "Sube 2 niveles la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Defensa del usuario.", // NEEDS QC
	},
	shiftgear: {
		name: "Cambio de Marcha",
		// Official flavor text: "Al hacer girar los engranajes, el usuario mejora su Ataque y aumenta mucho su Velocidad."
		desc: "Sube 2 niveles la Velocidad del usuario y 1 nivel su Ataque.", // NEEDS QC
		shortDesc: "Sube 2 niveles su Velocidad y 1 su Ataque.", // NEEDS QC
	},
	shockwave: {
		name: "Onda Voltio",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	shoreup: {
		name: "Recogearena",
		// Official flavor text: "Restaura la mitad de los PS máximos del usuario. Durante las tormentas de arena, restaura aún más PS."
		desc: "El usuario recupera la mitad de sus PS máximos (redondeado a la baja desde 0,5). Con tormenta de arena, recupera 2/3 (redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "Recupera 1/2 PS; 2/3 en tormenta de arena.", // NEEDS QC
	},
	signalbeam: {
		name: "Rayo Señal",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "10% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "10% de confundir al objetivo.", // NEEDS QC
	},
	silktrap: {
		name: "Telatrampa",
		desc: "Protege al usuario de la mayoría de los movimientos este turno y baja 1 nivel la Velocidad de los Pokémon que intenten hacer contacto con él. Los movimientos que no causan daño lo atraviesan. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege de ataques. Contacto: -1 Velocidad.", // NEEDS QC
	},
	silverwind: {
		name: "Viento Plata",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "10% de probabilidad de subir 1 nivel el Ataque, la Defensa, el Ataque Especial, la Defensa Especial y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "10% de subir 1 nivel todas sus características.", // NEEDS QC
	},
	simplebeam: {
		name: "Onda Simple",
		// Official flavor text: "Lanza una onda psíquica que hace que la habilidad del objetivo pase a ser Simple."
		desc: "La habilidad del objetivo pasa a ser Simple. Falla si su habilidad es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Simple, Cambio Táctico, Teracambio, Ausente, Modo Daruma, Cambio Heroico.", // NEEDS QC
		shortDesc: "La habilidad del objetivo pasa a ser Simple.", // NEEDS QC
		gen8: {
			desc: "La habilidad del objetivo pasa a ser Simple. Falla si su habilidad es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Simple, Cambio Táctico, Ausente, Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "La habilidad del objetivo pasa a ser Simple. Falla si su habilidad es Fuerte Afecto, Letargo Perenne, Disfraz, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Simple, Cambio Táctico, Ausente, Modo Daruma.", // NEEDS QC
		},
		gen6: {
			desc: "La habilidad del objetivo pasa a ser Simple. Falla si su habilidad es Multitipo, Simple, Cambio Táctico, Ausente.", // NEEDS QC
		},
		gen5: {
			desc: "La habilidad del objetivo pasa a ser Simple. Falla si su habilidad es Multitipo, Simple, Ausente.", // NEEDS QC
		},
	},
	sing: {
		name: "Canto",
		shortDesc: "Duerme al objetivo.", // NEEDS QC
	},
	sinisterarrowraid: {
		name: "Aluvión de Flechas Sombrías",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	sizzlyslide: {
		name: "Flarembestida",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "100% de probabilidad de quemar al objetivo.", // NEEDS QC
		shortDesc: "100% de quemar al objetivo.", // NEEDS QC
	},
	sketch: {
		name: "Esquema",
		// Official flavor text: "Aprende de forma permanente el último movimiento utilizado por el objetivo. Es de un solo uso."
		desc: "Este movimiento se sustituye permanentemente por el último usado por el objetivo, con sus PP al máximo. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado o si el movimiento es Pirochoque, Pugnachoque, Brecha Negra, Cerco Dimensión, Feerichoque, Ponzochoque, Plegaria Vital, Esquema, Forcejeo, Teraclúster, Ominochoque o uno que el usuario ya conoce.", // NEEDS QC
		shortDesc: "Copia permanentemente el último movimiento rival.", // NEEDS QC
		gen8: {
			desc: "Este movimiento se sustituye permanentemente por el último usado por el objetivo, con sus PP al máximo. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado o si el movimiento es Cháchara, Esquema, Forcejeo o uno que el usuario ya conoce.", // NEEDS QC
		},
		gen3: {
			desc: "Este movimiento se sustituye permanentemente por el último usado por el objetivo, con sus PP al máximo. Falla si el objetivo no ha usado un movimiento, si el usuario está transformado o si el movimiento es Esquema, Forcejeo o uno que el usuario ya conoce.", // NEEDS QC
		},
		gen2: {
			desc: "Falla al usarse en combates por cable.", // NEEDS QC
			shortDesc: "Falla al usarse en combates por cable.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha usado Esquema para copiar {MOVE}!",
	},
	skillswap: {
		name: "Intercambio",
		// Official flavor text: "Usa el poder psíquico para intercambiar habilidades con el objetivo."
		desc: "El usuario intercambia su habilidad con la del objetivo. Falla si la habilidad de cualquiera de los dos es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Mutapetito, Cara de Hielo, Ilusión, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Paleosíntesis, Carga Cuark, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Superguarda, Modo Daruma, Cambio Heroico o Evocarrecuerdos.", // NEEDS QC
		shortDesc: "Intercambia habilidades con el objetivo.", // NEEDS QC
		gen8: {
			desc: "El usuario intercambia su habilidad con la del objetivo. Falla si la habilidad de cualquiera de los dos es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Mutapetito, Cara de Hielo, Ilusión, Multitipo, Gas Reactivo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Superguarda, Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "El usuario intercambia su habilidad con la del objetivo. Falla si la habilidad de cualquiera de los dos es Fuerte Afecto, Letargo Perenne, Disfraz, Ilusión, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Superguarda, Modo Daruma.", // NEEDS QC
		},
		gen6: {
			desc: "El usuario intercambia su habilidad con la del objetivo. Falla si la habilidad de cualquiera de los dos es Ilusión, Multitipo, Cambio Táctico, Superguarda.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario intercambia su habilidad con la del objetivo. Falla si la habilidad de cualquiera de los dos es Ilusión, Multitipo, Superguarda, o si ambos tienen la misma habilidad.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario intercambia su habilidad con la del objetivo. Falla si la habilidad de cualquiera de los dos es Multitipo o Superguarda, si ambos tienen la misma habilidad o si cualquiera de los dos lleva Griseosfera.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario intercambia su habilidad con la del objetivo. Falla si la habilidad de cualquiera de los dos es Superguarda.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha intercambiado su habilidad con la del otro Pokémon!",
	},
	skittersmack: {
		name: "Golpe Rastrero",
		// Official flavor text: "Ataca al objetivo por la espalda de forma subrepticia y además reduce su Ataque Especial."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel el At. Esp. del objetivo.", // NEEDS QC
	},
	skullbash: {
		name: "Cabezazo",
		// Official flavor text: "El usuario se prepara y sube su Defensa en el primer turno y en el segundo arremete con un cabezazo."
		desc: "Carga el primer turno y golpea el segundo; al cargar, sube 1 nivel la Defensa del usuario. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "+1 Defensa el turno 1 y golpea el turno 2.", // NEEDS QC
		gen3: {
			desc: "Carga el primer turno y golpea el segundo. El primer turno sube 1 nivel la Defensa del usuario.", // NEEDS QC
		},
		gen1: {
			desc: "Carga el primer turno y golpea el segundo.", // NEEDS QC
			shortDesc: "Carga el 1.er turno. Golpea el 2.º.", // NEEDS QC
		},

		prepare: "¡{POKEMON} ha agachado la cabeza!",
	},
	skyattack: {
		name: "Ataque Aéreo",
		// Official flavor text: "Ataca durante dos turnos y suele asestar un golpe crítico. También puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo. Alta probabilidad de golpe crítico (índice +1). Carga el primer turno y golpea el segundo. Con Hierba Única, ataca en 1 turno.", // NEEDS QC
		shortDesc: "Carga y golpea el turno 2. 30% retroceso. Crítico alto.", // NEEDS QC
		gen3: {
			desc: "30% de probabilidad de amedrentar al objetivo y alta probabilidad de golpe crítico. Carga el primer turno y golpea el segundo.", // NEEDS QC
		},
		gen2: {
			desc: "Carga el primer turno y golpea el segundo.", // NEEDS QC
			shortDesc: "Carga el 1.er turno. Golpea el 2.º.", // NEEDS QC
		},

		prepare: "¡Un intenso halo rodea a {POKEMON}!",
	},
	skydrop: {
		name: "Caída Libre",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Se lleva al objetivo por los aires el primer turno y golpea el segundo. No puede levantar Pokémon de 200 kg o más. En el aire, ambos solo pueden ser alcanzados por Tornado, Vendaval, Gancho Alto, Antiaéreo, Mil Flechas, Trueno, Ciclón. Ninguno puede actuar entre turnos, aunque el objetivo puede elegir movimiento. No puede dañar a Pokémon de tipo Volador. Falla en el primer turno si el objetivo es un aliado, tiene un sustituto o está usando Bote, Excavar, Buceo, Vuelo, Golpe Fantasma, Golpe Umbrío, Caída Libre.", // NEEDS QC
		shortDesc: "Ambos vuelan el turno 1; daña el turno 2.", // NEEDS QC
		gen5: {
			desc: "Se lleva al objetivo por los aires el primer turno y golpea el segundo. En el aire, ambos solo pueden ser alcanzados por Tornado, Vendaval, Gancho Alto, Antiaéreo, Trueno, Ciclón. Ninguno puede actuar entre turnos, aunque el objetivo puede elegir movimiento. No puede dañar a Pokémon de tipo Volador. Falla en el primer turno si el objetivo es un aliado, tiene un sustituto o está usando Bote, Excavar, Buceo, Vuelo, Golpe Umbrío, Caída Libre. Si el efecto de Gravedad termina este efecto antes del segundo turno, ambos vuelven al suelo; si no, el objetivo sigue bajo este efecto hasta que el usuario deje el campo o ejecute con éxito el segundo turno de un movimiento de dos turnos.", // NEEDS QC
		},

		prepare: "¡{POKEMON} se ha llevado a {TARGET} por los aires!",
		end: "  ¡{POKEMON} se ha liberado de Caída Libre!",
		failSelect: "¡{POKEMON} está bajo los efectos de Caída Libre! No puede actuar libremente.",
		failTooHeavy: "  ¡{POKEMON} pesa demasiado, así que no puede ser levantado por los aires!",
	},
	skyuppercut: {
		name: "Gancho Alto",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Puede golpear a objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre.", // NEEDS QC
		shortDesc: "Golpea incluso a Pokémon en Bote, Vuelo o Caída Libre.", // NEEDS QC
		gen4: {
			desc: "Este movimiento puede golpear a un objetivo que esté usando Bote o Vuelo.", // NEEDS QC
			shortDesc: "Golpea a objetivos usando Bote o Vuelo.", // NEEDS QC
		},
	},
	slackoff: {
		name: "Relajo",
		// Official flavor text: "El usuario se relaja y restaura la mitad de sus PS máximos."
		desc: "El usuario recupera la mitad de sus PS máximos (redondeado al alza desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		},
	},
	slam: {
		name: "Atizar",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	slash: {
		name: "Cuchillada",
		// Official flavor text: "Ataca con cuchillas o con pinzas. Suele asestar un golpe crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	sleeppowder: {
		name: "Somnífero",
		shortDesc: "Duerme al objetivo.", // NEEDS QC
	},
	sleeptalk: {
		name: "Sonámbulo",
		// Official flavor text: "Mientras duerme, usa uno de sus movimientos elegido al azar."
		desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP y puede tener 0 PP. No puede seleccionar Ayuda, Pico Cañón, Eructo, Venganza, Pirochoque, Celebración, Cháchara, Pugnachoque, Copión, Cañón Dinamax, Puño Certero, Manos Juntas, Feerichoque, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Ponzochoque, Coraza Trampa, Esquema, Sonámbulo, Forcejeo, Alboroto, Ominochoque ni movimientos de dos turnos.", // NEEDS QC
		shortDesc: "Debe estar dormido. Usa otro movimiento conocido.", // NEEDS QC
		gen8: {
			desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP y puede tener 0 PP. No puede seleccionar Ayuda, Pico Cañón, Eructo, Venganza, Celebración, Cháchara, Copión, Cañón Dinamax, Puño Certero, Manos Juntas, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Coraza Trampa, Esquema, Sonámbulo, Forcejeo, Alboroto ni movimientos de dos turnos ni movimientos Dinamax.", // NEEDS QC
		},
		gen7: {
			desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP y puede tener 0 PP. No puede seleccionar Ayuda, Pico Cañón, Eructo, Venganza, Celebración, Cháchara, Copión, Puño Certero, Manos Juntas, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Coraza Trampa, Esquema, Sonámbulo, Forcejeo, Alboroto ni movimientos de dos turnos ni movimientos Z.", // NEEDS QC
		},
		gen6: {
			desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP y puede tener 0 PP. No puede seleccionar Ayuda, Eructo, Venganza, Celebración, Cháchara, Copión, Puño Certero, Manos Juntas, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Esquema, Sonámbulo, Forcejeo, Alboroto ni movimientos de dos turnos.", // NEEDS QC
		},
		gen5: {
			desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP y puede tener 0 PP. No puede seleccionar Ayuda, Venganza, Cháchara, Copión, Puño Certero, Yo Primero, Metrónomo, Mimético, Espejo, Adaptación, Esquema, Sonámbulo, Forcejeo, Alboroto ni movimientos de dos turnos.", // NEEDS QC
		},
		gen4: {
			desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP y puede tener 0 PP. No puede seleccionar Ayuda, Venganza, Cháchara, Copión, Puño Certero, Yo Primero, Metrónomo, Espejo, Sonámbulo, Alboroto ni movimientos de dos turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP, pero si tiene 0 PP fallará al usarse. No puede seleccionar Ayuda, Venganza, Puño Certero, Metrónomo, Espejo, Sonámbulo, Alboroto ni movimientos de dos turnos.", // NEEDS QC
		},
		gen2: {
			desc: "Usa al azar uno de los movimientos conocidos del usuario, salvo este. Falla si el usuario no está dormido. El movimiento elegido no gasta PP y puede tener 0 PP. No puede seleccionar Venganza, Sonámbulo ni movimientos de dos turnos.", // NEEDS QC
		},
	},
	sludge: {
		name: "Residuos",
		// Official flavor text: "Arroja residuos al objetivo. Puede llegar a envenenar."
		desc: "30% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "30% de envenenar al objetivo.", // NEEDS QC
		gen1: {
			desc: "40% de probabilidad de envenenar al objetivo.", // NEEDS QC
			shortDesc: "40% de envenenar al objetivo.", // NEEDS QC
		},
	},
	sludgebomb: {
		name: "Bomba Lodo",
		// Official flavor text: "Arroja residuos al objetivo. Puede llegar a envenenar."
		desc: "30% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "30% de envenenar al objetivo.", // NEEDS QC
	},
	sludgewave: {
		name: "Onda Tóxica",
		// Official flavor text: "Una onda tóxica que daña a los Pokémon de alrededor. Puede envenenar."
		desc: "10% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "10% de envenenar a los Pokémon adyacentes.", // NEEDS QC
	},
	smackdown: {
		name: "Antiaéreo",
		// Official flavor text: "Ataca lanzando una piedra o un proyectil. Si el objetivo está en el aire, lo estrella contra el suelo."
		desc: "Puede golpear a objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre. Si golpea a un objetivo bajo Bote, Vuelo, Levitón, Telequinesis, ese efecto termina. Si el objetivo es de tipo Volador y no usó Respiro este turno, o tiene la habilidad Levitación, pierde su inmunidad al tipo Tierra y a Trampa Arena mientras siga en combate. Durante el efecto, Levitón le falla y Telequinesis falla contra él.", // NEEDS QC
		shortDesc: "Elimina la inmunidad al tipo Tierra del objetivo.", // NEEDS QC

		start: "  ¡{POKEMON} ha sido derribado y ha caído al suelo!",
	},
	smartstrike: {
		name: "Cuerno Certero",
		shortDesc: "No comprueba la precisión.", // NEEDS QC
	},
	smellingsalts: {
		name: "Estímulo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia se duplica si el objetivo está paralizado. Si el usuario no se ha debilitado, cura la parálisis del objetivo.", // NEEDS QC
		shortDesc: "Doble contra paralizados, pero los cura.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica si el objetivo está paralizado. Si acierta, cura la parálisis del objetivo.", // NEEDS QC
		},
		gen3: {
			desc: "El daño se duplica si el objetivo está paralizado. Si acierta, cura la parálisis del objetivo.", // NEEDS QC
			shortDesc: "Doble de daño si está paralizado; lo cura.", // NEEDS QC
		},
	},
	smog: {
		name: "Polución",
		// Official flavor text: "Lanza un ataque con gases tóxicos que pueden llegar a envenenar."
		desc: "40% de probabilidad de envenenar al objetivo.", // NEEDS QC
		shortDesc: "40% de envenenar al objetivo.", // NEEDS QC
	},
	smokescreen: {
		name: "Pantalla de Humo",
		// Official flavor text: "Baja la Precisión del objetivo con una nube de humo o tinta."
		desc: "Baja 1 nivel la precisión del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel precisión del objetivo.", // NEEDS QC
	},
	snaptrap: {
		name: "Cepo",
		// Official flavor text: "Cepo que atrapa al objetivo durante cuatro o cinco turnos y le causa daño mientras se encuentra preso."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha quedado atrapado en un cepo!",
	},
	snarl: {
		name: "Alarido",
		// Official flavor text: "Chillido desagradable que baja el Ataque Especial del rival."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel el At. Esp. de los rivales.", // NEEDS QC
	},
	snatch: {
		name: "Robo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Si otro Pokémon usa ciertos movimientos que no causan daño este turno, el usuario se los roba y los usa él. Si varios Pokémon los usan, el primero en orden de turno que usó este movimiento los roba todos. Se ignora mientras el usuario está bajo Caída Libre.", // NEEDS QC
		shortDesc: "Roba ciertos movimientos de apoyo para usarlos.", // NEEDS QC
		gen4: {
			desc: "Si otro Pokémon usa ciertos movimientos que no causan daño este turno, el usuario se los roba y los usa él. Si varios Pokémon usan este movimiento este turno, los movimientos aplicables son robados por cada uno de ellos en orden de turno, y solo el último en orden de turno obtiene los efectos.", // NEEDS QC
		},

		start: "  ¡{POKEMON} está esperando a que se use algún movimiento!",
		activate: "  ¡{POKEMON} le ha robado el movimiento a {TARGET}!",
	},
	snipeshot: {
		name: "Disparo Certero",
		// Official flavor text: "Permite atacar al objetivo seleccionado ignorando las habilidades o movimientos que permiten a un rival centrar la atención sobre sí."
		desc: "Alta probabilidad de golpe crítico (índice +1). Ningún efecto puede redirigirlo a otro objetivo.", // NEEDS QC
		shortDesc: "Alta prob. de crítico. No puede redirigirse.", // NEEDS QC
	},
	snore: {
		name: "Ronquido",
		// Official flavor text: "Fuerte ronquido que solo puede usarse dormido. Puede amedrentar al objetivo."
		desc: "30% de probabilidad de hacer retroceder al objetivo. Falla si el usuario no está dormido.", // NEEDS QC
		shortDesc: "Debe estar dormido. 30% de hacer retroceder.", // NEEDS QC
	},
	snowscape: {
		name: "Paisaje Nevado",
		desc: "Durante 5 turnos, nieva: la Defensa de los Pokémon de tipo Hielo se multiplica por 1,5 al recibir ataques físicos. Dura 8 turnos con Roca Helada. Falla si ya nieva.", // NEEDS QC
		shortDesc: "5 turnos: nieve. Hielo: 1,5x Defensa.", // NEEDS QC
	},
	soak: {
		name: "Empapar",
		// Official flavor text: "Potente lluvia que transforma al objetivo en un Pokémon de tipo Agua."
		desc: "El objetivo pasa a ser de tipo Agua. Falla si es un Arceus o un Silvally, si ya es puramente de tipo Agua o si está teracristalizado.", // NEEDS QC
		shortDesc: "El objetivo pasa a ser de tipo Agua.", // NEEDS QC
		gen8: {
			desc: "El objetivo pasa a ser de tipo Agua. Falla si es un Arceus o un Silvally, o si ya es puramente de tipo Agua.", // NEEDS QC
		},
		gen6: {
			desc: "El objetivo pasa a ser de tipo Agua. Falla si es un Arceus o si ya es puramente de tipo Agua.", // NEEDS QC
		},
		gen5: {
			desc: "El objetivo pasa a ser de tipo Agua. Falla si es un Arceus.", // NEEDS QC
		},
	},
	softboiled: {
		name: "Ovocuración",
		// Official flavor text: "Restaura la mitad de los PS máximos del usuario."
		desc: "El usuario recupera la mitad de sus PS máximos (redondeado al alza desde 0,5).", // NEEDS QC
		shortDesc: "El usuario recupera la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		},
		gen1: {
			desc: "El usuario recupera la mitad de sus PS máximos (redondeado hacia abajo). Falla si (PS máximos del usuario − PS actuales + 1) es divisible entre 256.", // NEEDS QC
		},
	},
	solarbeam: {
		name: "Rayo Solar",
		// Official flavor text: "El usuario absorbe luz en el primer turno y en el segundo lanza un potente rayo de energía."
		desc: "Carga el primer turno y golpea el segundo. La potencia se reduce a la mitad con lluvia, diluvio, tormenta de arena o nieve si el usuario no lleva Parasol Multiuso. Con Hierba Única, o si hace sol o hay luz solar extrema, ataca en 1 turno. Con Parasol Multiuso, necesita el turno de carga aunque haga sol.", // NEEDS QC
		shortDesc: "Carga y golpea el turno 2. Sin carga con sol.", // NEEDS QC
		gen8: {
			desc: "Carga el primer turno y golpea el segundo. La potencia se reduce a la mitad con granizo, lluvia, diluvio o tormenta de arena si el usuario no lleva Parasol Multiuso. Con Hierba Única, o si hace sol o hay luz solar extrema, ataca en 1 turno. Con Parasol Multiuso, necesita el turno de carga aunque haga sol.", // NEEDS QC
		},
		gen7: {
			desc: "Carga el primer turno y golpea el segundo. La potencia se reduce a la mitad con Granizo, diluvio, lluvia o Tormenta de Arena. Con Hierba Única, o si hay sol o luz solar extrema, ataca en 1 turno.", // NEEDS QC
		},
		gen5: {
			desc: "Carga el primer turno y golpea el segundo. La potencia se reduce a la mitad con Granizo, lluvia o Tormenta de Arena. Con Hierba Única o sol, ataca en 1 turno.", // NEEDS QC
		},
		gen4: {
			desc: "Carga el primer turno y golpea el segundo. El daño se reduce a la mitad con Granizo, lluvia o Tormenta de Arena. Con Hierba Única o sol, ataca en 1 turno.", // NEEDS QC
		},
		gen3: {
			desc: "Carga el primer turno y golpea el segundo. El daño se reduce a la mitad con Granizo, lluvia o Tormenta de Arena. Con sol, ataca en 1 turno.", // NEEDS QC
		},
		gen2: {
			desc: "Carga el primer turno y golpea el segundo. El daño se reduce a la mitad con lluvia. Con sol, ataca en 1 turno.", // NEEDS QC
		},
		gen1: {
			desc: "Carga el primer turno y golpea el segundo.", // NEEDS QC
			shortDesc: "Carga el 1.er turno. Golpea el 2.º.", // NEEDS QC
		},

		prepare: "  ¡{POKEMON} ha absorbido la luz solar!",
	},
	solarblade: {
		name: "Cuchilla Solar",
		// Official flavor text: "El usuario dedica un turno a absorber energía lumínica y concentrarla en forma de cuchilla con la que ataca al rival en el siguiente turno."
		desc: "Carga el primer turno y golpea el segundo. La potencia se reduce a la mitad con granizo, lluvia, diluvio o tormenta de arena si el usuario no lleva Parasol Multiuso. Con Hierba Única, o si hace sol o hay luz solar extrema, ataca en 1 turno. Con Parasol Multiuso, necesita el turno de carga aunque haga sol.", // NEEDS QC
		shortDesc: "Carga y golpea el turno 2. Sin carga con sol.", // NEEDS QC
		gen8: {
			desc: "Carga el primer turno y golpea el segundo. La potencia se reduce a la mitad con lluvia, diluvio, tormenta de arena o nieve si el usuario no lleva Parasol Multiuso. Con Hierba Única, o si hace sol o hay luz solar extrema, ataca en 1 turno. Con Parasol Multiuso, necesita el turno de carga aunque haga sol.", // NEEDS QC
		},
		gen7: {
			desc: "Carga el primer turno y golpea el segundo. La potencia se reduce a la mitad con Granizo, diluvio, lluvia o Tormenta de Arena. Con Hierba Única, o si hay sol o luz solar extrema, ataca en 1 turno.", // NEEDS QC
		},

		prepare: "#solarbeam",
	},
	sonicboom: {
		name: "Bomba Sónica",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Inflige 20 PS de daño al objetivo.", // NEEDS QC
		shortDesc: "Inflige siempre 20 PS de daño.", // NEEDS QC
		gen1: {
			desc: "Inflige 20 PS de daño al objetivo. Este movimiento ignora la inmunidad de tipo.", // NEEDS QC
		},
	},
	soulstealing7starstrike: {
		name: "Constelación Robaalmas",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	spacialrend: {
		name: "Corte Vacío",
		// Official flavor text: "Desgarra al objetivo y el espacio a su alrededor. Suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	spark: {
		name: "Chispa",
		// Official flavor text: "Ataque eléctrico que puede llegar a paralizar."
		desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "30% de paralizar al objetivo.", // NEEDS QC
	},
	sparklingaria: {
		name: "Aria Burbuja",
		// Official flavor text: "Libera burbujas al cantar. Este movimiento cura las quemaduras de los Pokémon que reciban daño."
		desc: "Si el usuario no se ha debilitado, cura la quemadura del objetivo.", // NEEDS QC
		shortDesc: "Cura la quemadura del objetivo.", // NEEDS QC
	},
	sparklyswirl: {
		name: "Sylveotornado",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Cura los problemas de estado de todo el equipo del usuario.", // NEEDS QC
		shortDesc: "Cura los estados de todo el equipo del usuario.", // NEEDS QC
	},
	spectralthief: {
		name: "Robasombra",
		// Official flavor text: "El usuario se esconde en la sombra del objetivo y lo ataca tras robarle las mejoras en sus características."
		desc: "Roba los niveles positivos de características del objetivo y se los aplica al usuario antes de infligir el daño.", // NEEDS QC
		shortDesc: "Roba las subidas del objetivo antes de dañar.", // NEEDS QC

		clearBoost: "  ¡{SOURCE} se ha apropiado de las mejoras en las características de su rival!",
	},
	speedswap: {
		name: "Cambiavelocidad",
		// Official flavor text: "Intercambia su Velocidad por la del oponente."
		desc: "El usuario intercambia su valor de Velocidad con el del objetivo. Los cambios de nivel no se ven afectados.", // NEEDS QC
		shortDesc: "Intercambia su Velocidad con la del objetivo.", // NEEDS QC

		activate: "  ¡{POKEMON} cambia su Velocidad por la de su objetivo!",
	},
	spicyextract: {
		name: "Extracto Picante",
		desc: "Sube 2 niveles el Ataque del objetivo y baja 2 niveles su Defensa.", // NEEDS QC
		shortDesc: "+2 Ataque y -2 Defensa del objetivo.", // NEEDS QC
	},
	spiderweb: {
		name: "Telaraña",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Impide que el objetivo se cambie.", // NEEDS QC
		gen7: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo, salvo que use Relevo: en ese caso el objetivo sigue atrapado.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si usa Relevo. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo, salvo que use Relevo: en ese caso el objetivo sigue atrapado.", // NEEDS QC
		},
	},
	spikecannon: {
		name: "Clavo Cañón",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen4: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el objetivo lleva Banda Aguante y tenía todos los PS al empezar el movimiento, no se debilita sea cual sea el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea de 2 a 5 veces: 3/8 de probabilidad de 2 o 3 golpes y 1/8 de 4 o 5. El daño se calcula una sola vez para el primer golpe y se repite en cada golpe. Si un golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	spikes: {
		name: "Púas",
		// Official flavor text: "Esparce púas alrededor del equipo rival que hieren a los Pokémon rivales que entran en combate."
		desc: "Coloca una trampa en el bando rival que daña a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 3 veces: pierden 1/8, 1/6 o 1/4 de sus PS máximos (redondeado hacia abajo) según las capas. Se elimina si algún Pokémon usa Limpieza General o si un rival usa con éxito Giro Mortífero, Giro Rápido, Despejar o recibe Despejar.", // NEEDS QC
		shortDesc: "Daña a los rivales que entren al suelo. Máx. 3 capas.", // NEEDS QC
		gen8: {
			desc: "Coloca una trampa en el bando rival que daña a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 3 veces: pierden 1/8, 1/6 o 1/4 de sus PS máximos (redondeado hacia abajo) según las capas. Se elimina si un rival usa con éxito Giro Rápido o Despejar, o recibe Despejar.", // NEEDS QC
		},
		gen5: {
			desc: "Coloca una trampa en el bando rival que daña a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 3 veces: pierden 1/8, 1/6 o 1/4 de sus PS máximos (redondeado hacia abajo) según las capas. Se elimina si un rival usa con éxito Giro Rápido o recibe Despejar.", // NEEDS QC
		},
		gen3: {
			desc: "Coloca una trampa en el bando rival que daña a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 3 veces: pierden 1/8, 1/6 o 1/4 de sus PS máximos (redondeado hacia abajo) según las capas. Se elimina si un rival usa con éxito Giro Rápido.", // NEEDS QC
		},
		gen2: {
			desc: "Coloca una trampa en el bando rival que hace perder a los rivales que entren en combate 1/8 de sus PS máximos (redondeado hacia abajo), salvo a los de tipo Volador. Falla si el efecto ya está activo en ese bando. Se elimina si un rival usa con éxito Giro Rápido.", // NEEDS QC
			shortDesc: "Daña a los rivales que entran. Máximo 1 capa.", // NEEDS QC
		},

		start: "  ¡{TEAM:capitalize} está rodeado de púas!",
		end: "  Las púas lanzadas a {TEAM} han desaparecido.",
		damage: "  ¡Las púas han herido a {POKEMON}!",
	},
	spikyshield: {
		name: "Barrera Espinosa",
		// Official flavor text: "Protege al usuario de ataques, e inflige daño a quien se los lance si entra en contacto con él."
		desc: "Protege al usuario de la mayoría de los movimientos este turno, y los Pokémon que hagan contacto con él pierden 1/8 de sus PS máximos (redondeado hacia abajo). Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		shortDesc: "Protege de movimientos. Contacto: pierde 1/8 de PS.", // NEEDS QC
		gen8: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno, y los Pokémon que hagan contacto con él pierden 1/8 de sus PS máximos (redondeado hacia abajo). Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen7: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno, y los Pokémon que hagan contacto con él pierden 1/8 de sus PS máximos (redondeado hacia abajo). Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},
		gen6: {
			desc: "Protege al usuario de la mayoría de los movimientos este turno, y los Pokémon que hagan contacto con él pierden 1/8 de sus PS máximos (redondeado hacia abajo). Tiene 1/X de probabilidad de éxito: X empieza en 1 y se triplica con cada uso exitoso. X vuelve a 1 si falla, si el último movimiento usado no fue Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno.", // NEEDS QC
		},

		damage: "  ¡{POKEMON} se ha herido!",
	},
	spinout: {
		name: "Quemarrueda",
		desc: "Baja 2 niveles la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Baja 2 niveles Velocidad del usuario.", // NEEDS QC
	},
	spiritbreak: {
		name: "Choque Anímico",
		// Official flavor text: "El usuario ataca al objetivo con tal ímpetu que acaba minando su moral y, en consecuencia, reduce su Ataque Especial."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel At. Esp. del objetivo.", // NEEDS QC
	},
	spiritshackle: {
		name: "Puntada Sombría",
		// Official flavor text: "Ataca al oponente y, al mismo tiempo, fija su sombra al terreno para impedir su huida."
		desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Impide que el objetivo se cambie.", // NEEDS QC
		gen7: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
	},
	spite: {
		name: "Rencor",
		// Official flavor text: "Da rienda suelta a su rencor para reducir cuatro PP del último movimiento usado por el objetivo."
		desc: "El último movimiento usado por el objetivo pierde 4 PP. Falla si el objetivo no ha usado un movimiento, si este tiene 0 PP o si ya no lo conoce.", // NEEDS QC
		shortDesc: "Resta 4 PP al último movimiento del objetivo.", // NEEDS QC
		gen3: {
			desc: "El último movimiento usado por el objetivo pierde de 2 a 5 PP, al azar. Falla si el objetivo no ha usado un movimiento, si este tiene 0 o 1 PP o si ya no lo conoce.", // NEEDS QC
			shortDesc: "El último mov. del objetivo pierde 2-5 PP.", // NEEDS QC
		},
		gen2: {
			desc: "El último movimiento usado por el objetivo pierde de 2 a 5 PP, al azar. Falla si el objetivo no ha usado un movimiento o si este tiene 0 PP.", // NEEDS QC
		},

		activate: "  ¡El movimiento {MOVE} de {TARGET} ha perdido {NUMBER} PP!",
	},
	spitup: {
		name: "Escupir",
		// Official flavor text: "Libera de una vez la energía acumulada con Reserva. La potencia del ataque será proporcional a la cantidad de energía acumulada."
		desc: "La potencia es 100 por cada uso de Reserva. Falla si el contador de Reserva es 0. Acierte o no, la Defensa y la Defensa Especial del usuario bajan tantos niveles como los que subió Reserva, y el contador vuelve a 0.", // NEEDS QC
		shortDesc: "Más potencia con más usos de Reserva.", // NEEDS QC
		gen4: {
			desc: "La potencia es 100 por cada uso de Reserva. Este movimiento no aplica varianza de daño. Falla si el contador de Reserva es 0. Salvo que no haya objetivo, acierte o no, la Defensa y la Defensa Especial del usuario bajan tantos niveles como los que subió Reserva, y el contador vuelve a 0.", // NEEDS QC
		},
		gen3: {
			desc: "El daño se multiplica por el contador de Reserva del usuario. Este movimiento no aplica varianza de daño y no puede ser golpe crítico. Falla si el contador es 0. Salvo que este movimiento falle, el contador vuelve a 0.", // NEEDS QC
		},
	},
	splash: {
		name: "Salpicadura",
		shortDesc: "Sin uso competitivo.", // NEEDS QC

		activate: "  Pero no ha sucedido nada.",
	},
	splinteredstormshards: {
		name: "Tempestad Rocosa",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Termina los efectos de los campos eléctrico, de hierba, de niebla y psíquico.", // NEEDS QC
		shortDesc: "Termina los efectos del campo.", // NEEDS QC
	},
	splishysplash: {
		name: "Salpikasurf",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "30% de paralizar al objetivo.", // NEEDS QC
	},
	spore: {
		name: "Espora",
		shortDesc: "Duerme al objetivo.", // NEEDS QC
	},
	spotlight: {
		name: "Foco",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Hasta el final del turno, los ataques de un solo objetivo de los rivales del objetivo se redirigen a él, antes de que puedan devolverse con Capa Mágica o la habilidad Espejo Mágico, o atraerse con Pararrayos o Colector. Falla si no es un combate doble o una batalla campal.", // NEEDS QC
		shortDesc: "Los ataques rivales van al objetivo este turno.", // NEEDS QC

		start: "#followme",
		startFromZEffect: "#followme",
	},
	springtidestorm: {
		name: "Ciclón Primavera",
		desc: "30% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "30% de bajar 1 nivel el Ataque de los rivales.", // NEEDS QC
	},
	stealthrock: {
		name: "Trampa Rocas",
		// Official flavor text: "Una trampa de rocas que flota en el aire y daña a los objetivos que entran en combate."
		desc: "Coloca una trampa en el bando rival que daña a los rivales que entren en combate. Falla si el efecto ya está activo en ese bando. El daño depende de su debilidad al tipo Roca: pierden 1/32, 1/16, 1/8, 1/4 o 1/2 de sus PS máximos (redondeado hacia abajo) con eficacia 0,25, 0,5, neutra, 2 o 4, respectivamente. Se elimina si algún Pokémon usa Limpieza General o si un rival usa con éxito Giro Mortífero, Giro Rápido, Despejar o recibe Despejar.", // NEEDS QC
		shortDesc: "Daña a los rivales al entrar según su debilidad a Roca.", // NEEDS QC
		gen8: {
			desc: "Coloca una trampa en el bando rival que daña a los rivales que entren en combate. Falla si el efecto ya está activo en ese bando. El daño depende de su debilidad al tipo Roca: pierden 1/32, 1/16, 1/8, 1/4 o 1/2 de sus PS máximos (redondeado hacia abajo) con eficacia 0,25, 0,5, neutra, 2 o 4, respectivamente. Se elimina si un rival usa con éxito Giro Rápido o Despejar, o recibe Despejar.", // NEEDS QC
		},
		gen5: {
			desc: "Coloca una trampa en el bando rival que daña a los rivales que entren en combate. Falla si el efecto ya está activo en ese bando. El daño depende de su debilidad al tipo Roca: pierden 1/32, 1/16, 1/8, 1/4 o 1/2 de sus PS máximos (redondeado hacia abajo) con eficacia 0,25, 0,5, neutra, 2 o 4, respectivamente. Se elimina si un rival usa con éxito Giro Rápido o recibe Despejar.", // NEEDS QC
		},

		start: "  ¡{TEAM:capitalize} está rodeado de piedras puntiagudas!",
		end: "  Las piedras puntiagudas lanzadas a {TEAM} han desaparecido.",
		damage: "  ¡Unas piedras puntiagudas han dañado a {POKEMON}!",
	},
	steameruption: {
		name: "Chorro de Vapor",
		// Official flavor text: "Envuelve al Pokémon oponente con vapor extremadamente caliente que puede llegar a quemarlo."
		desc: "30% de probabilidad de quemar al objetivo. Descongela al objetivo.", // NEEDS QC
		shortDesc: "30% de quemar. Descongela al objetivo.", // NEEDS QC
	},
	steamroller: {
		name: "Rodillo de Púas",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "30% de probabilidad de hacer retroceder al objetivo. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		gen5: {
			desc: "30% de probabilidad de amedrentar al objetivo. El daño se duplica si el objetivo usó Reducción desde que está en combate.", // NEEDS QC
		},
	},
	steelbeam: {
		name: "Metaláser",
		// Official flavor text: "Utiliza el acero de su cuerpo para disparar un potente rayo. También hiere al agresor."
		desc: "Acierte o no, e incluso si eso lo debilita, el usuario pierde la mitad de sus PS máximos (redondeado hacia arriba), salvo que tenga la habilidad Muro Mágico.", // NEEDS QC
		shortDesc: "El usuario pierde la mitad de sus PS máximos.", // NEEDS QC

		damage: "#mindblown",
	},
	steelroller: {
		name: "Allanador Férreo",
		// Official flavor text: "El usuario lanza su ataque y destruye el campo activo en el terreno de combate, y falla si no hay ninguno en ese momento."
		desc: "Falla si no hay ningún campo activo. Termina los efectos de los campos eléctrico, de hierba, de niebla y psíquico.", // NEEDS QC
		shortDesc: "Falla sin campo activo. Elimina el campo.", // NEEDS QC
	},
	steelwing: {
		name: "Ala de Acero",
		// Official flavor text: "Alas macizas que golpean al objetivo y pueden subir la Defensa del usuario."
		desc: "10% de probabilidad de subir 1 nivel la Defensa del usuario.", // NEEDS QC
		shortDesc: "10% de subir 1 nivel Defensa del usuario.", // NEEDS QC
	},
	stickyweb: {
		name: "Red Viscosa",
		// Official flavor text: "Coloca una red pegajosa alrededor del equipo rival que baja la Velocidad de cualquier adversario que entre a combatir."
		desc: "Coloca una trampa en el bando rival que baja 1 nivel la Velocidad de los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Falla si el efecto ya está activo en ese bando. Se elimina si algún Pokémon usa Limpieza General o si un rival usa con éxito Giro Mortífero, Giro Rápido, Despejar o recibe Despejar.", // NEEDS QC
		shortDesc: "-1 Velocidad a los rivales que entren en el suelo.", // NEEDS QC
		gen8: {
			desc: "Coloca una trampa en el bando rival que baja 1 nivel la Velocidad de los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Falla si el efecto ya está activo en ese bando. Se elimina si un rival usa con éxito Giro Rápido o Despejar, o recibe Despejar.", // NEEDS QC
		},

		start: "  ¡Una red viscosa se extiende a los pies de {TEAM}!",
		end: "  La red viscosa que rodeaba a {TEAM} ha desaparecido.",
		activate: "  ¡{POKEMON} ha caído en una red viscosa!",
	},
	stockpile: {
		name: "Reserva",
		// Official flavor text: "Acumula energía y sube la Defensa y la Defensa Especial. Puede utilizarse hasta tres veces."
		desc: "Sube 1 nivel la Defensa y la Defensa Especial del usuario y su contador de reservas aumenta en 1. Falla si el contador es 3. El contador vuelve a 0 al dejar el combate.", // NEEDS QC
		shortDesc: "+1 Def. y Def. Esp. Se acumula hasta 3 veces.", // NEEDS QC
		gen3: {
			desc: "El contador de Reserva del usuario aumenta en 1. Falla si el contador es 3. El contador vuelve a 0 al dejar el combate.", // NEEDS QC
			shortDesc: "Contador de Reserva +1. Máximo 3 usos.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha reservado energía por {NUMBER}.ª vez!",
		end: "  ¡Han desaparecido los efectos de la reserva acumulada por {POKEMON}!",
	},
	stokedsparksurfer: {
		name: "Surfeo Galvánico",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "100% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "100% de paralizar al objetivo.", // NEEDS QC
	},
	stomp: {
		name: "Pisotón",
		// Official flavor text: "Tremendo pisotón que puede hacer que el objetivo se amedrente."
		desc: "30% de probabilidad de hacer retroceder al objetivo. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
		gen5: {
			desc: "30% de probabilidad de amedrentar al objetivo. El daño se duplica si el objetivo usó Reducción desde que está en combate.", // NEEDS QC
		},
		gen4: {
			desc: "30% de probabilidad de hacer retroceder al objetivo. La potencia se duplica si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		},
		gen3: {
			desc: "30% de probabilidad de amedrentar al objetivo. El daño se duplica si el objetivo usó Reducción desde que está en combate.", // NEEDS QC
		},
		gen2: {
			desc: "30% de probabilidad de hacer retroceder al objetivo. La potencia se duplica si el objetivo está bajo el efecto de Reducción.", // NEEDS QC
		},
		gen1: {
			desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		},
	},
	stompingtantrum: {
		name: "Pataleta",
		// Official flavor text: "Usa la frustración como revulsivo para atacar. La potencia de Pataleta se duplica si el usuario ha fallado el último movimiento usado."
		desc: "La potencia se duplica si el último movimiento del usuario en el turno anterior (incluidos los llamados por otros movimientos o los usados mediante Mandato, Capa Mágica, Robo o las habilidades Pareja de Baile y Espejo Mágico) falló sin producir ninguno de sus efectos normales (sin contar el daño de un Patada Salto Alta, Patada Salto o Cabeza Sorpresa fallidos), o si el usuario no pudo actuar por un efecto distinto de la recarga o Caída Libre. No se duplica si el movimiento fue bloqueado por Búnker, Detección, Escudo Real, Protección, Barrera Espinosa, Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia, ni si Bote o Vuelo se interrumpieron por Gravedad, Antiaéreo o Mil Flechas.", // NEEDS QC
		shortDesc: "Potencia doble si su último movimiento falló.", // NEEDS QC
	},
	stoneaxe: {
		name: "Hachazo Pétreo",
		desc: "Si acierta, coloca una trampa en el bando rival que daña a los rivales que entren en combate según su debilidad al tipo Roca: pierden 1/32, 1/16, 1/8, 1/4 o 1/2 de sus PS máximos (redondeado hacia abajo) con eficacia 0,25, 0,5, neutra, 2 o 4. Se elimina si algún Pokémon usa Limpieza General o si un rival usa con éxito Giro Mortífero, Giro Rápido, Despejar o recibe Despejar.", // NEEDS QC
		shortDesc: "Coloca Trampa Rocas en el bando rival.", // NEEDS QC
	},
	stoneedge: {
		name: "Roca Afilada",
		// Official flavor text: "Clava piedras muy afiladas al objetivo. Suele ser crítico."
		desc: "Alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Alta probabilidad de golpe crítico.", // NEEDS QC
	},
	storedpower: {
		name: "Poder Reserva",
		// Official flavor text: "Acumula poder para golpear. Cuanto más suban las características del usuario, mayor será el daño."
		desc: "La potencia es 20+(X×20), donde X es la suma de los niveles positivos de características del usuario.", // NEEDS QC
		shortDesc: "+20 de potencia por cada subida de características.", // NEEDS QC
	},
	stormthrow: {
		name: "Llave Corsé",
		// Official flavor text: "Lanza un golpe devastador. Siempre asesta un golpe crítico."
		desc: "Siempre asesta un golpe crítico, salvo que el objetivo esté bajo el efecto de Conjuro o tenga las habilidades Armadura Batalla o Caparazón.", // NEEDS QC
		shortDesc: "Siempre asesta un golpe crítico.", // NEEDS QC
	},
	strangesteam: {
		name: "Cautivapor",
		// Official flavor text: "Desprende un humo con el que ataca al objetivo, que puede acabar confundido."
		desc: "20% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "20% de confundir al objetivo.", // NEEDS QC
	},
	strength: {
		name: "Fuerza",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	strengthsap: {
		name: "Absorbefuerza",
		// Official flavor text: "Restaura una cantidad de PS equivalente al valor de Ataque del rival, que además verá reducida esta característica."
		desc: "Baja 1 nivel el Ataque del objetivo y el usuario recupera tantos PS como el Ataque del objetivo calculado con su nivel previo al movimiento. Con Raíz Grande, recupera 1,3 veces más (redondeado a la baja desde 0,5). Falla si el Ataque del objetivo está en -6.", // NEEDS QC
		shortDesc: "Recupera PS igual al Ataque del rival y se lo baja 1.", // NEEDS QC
	},
	stringshot: {
		name: "Disparo Demora",
		// Official flavor text: "Lanza seda a los rivales y reduce mucho su Velocidad."
		desc: "Baja 2 niveles la Velocidad del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles la Velocidad de los rivales.", // NEEDS QC
		gen5: {
			desc: "Baja 1 nivel la Velocidad del objetivo.", // NEEDS QC
			shortDesc: "Baja 1 nivel la Velocidad de los rivales.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Baja 1 nivel la Velocidad del objetivo.", // NEEDS QC
		},
	},
	struggle: {
		name: "Forcejeo",
		// Official flavor text: "Solo se usa como último recurso al acabarse los PP. Hiere un poco al agresor."
		desc: "Inflige daño sin tipo a un rival al azar. Si acierta, el usuario pierde 1/4 de sus PS máximos (redondeado al alza desde 0,5), sin que la habilidad Cabeza Roca lo evite. Se usa automáticamente cuando no puede seleccionarse ningún movimiento conocido.", // NEEDS QC
		shortDesc: "El usuario pierde 1/4 de sus PS máximos.", // NEEDS QC
		gen6: {
			desc: "Inflige daño sin tipo a un rival adyacente al azar. Si acierta, el usuario pierde 1/4 de sus PS máximos (redondeado al alza desde 0,5), sin que la habilidad Cabeza Roca lo evite. Se usa automáticamente cuando no puede seleccionarse ningún movimiento conocido.", // NEEDS QC
		},
		gen4: {
			desc: "Inflige daño sin tipo a un rival al azar. Si acierta, el usuario pierde 1/4 de sus PS máximos (redondeado hacia abajo), sin que la habilidad Cabeza Roca lo evite. Se usa automáticamente cuando no puede seleccionarse ningún movimiento conocido.", // NEEDS QC
		},
		gen3: {
			desc: "Inflige daño sin tipo a un rival al azar. Si acierta, el usuario recibe un daño igual a 1/4 de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS), sin que la habilidad Cabeza Roca lo evite. Se usa automáticamente cuando no puede seleccionarse ningún movimiento conocido.", // NEEDS QC
			shortDesc: "El usuario pierde 1/4 del daño infligido.", // NEEDS QC
		},
		gen2: {
			desc: "Inflige daño sin tipo. Si acierta, el usuario recibe un daño igual a 1/4 de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS). Se usa automáticamente cuando no puede seleccionarse ningún movimiento conocido.", // NEEDS QC
		},
		gen1: {
			desc: "Inflige daño de tipo Normal. Si acierta, el usuario recibe un daño igual a 1/2 de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS). Se usa automáticamente cuando no puede seleccionarse ningún movimiento conocido.", // NEEDS QC
			shortDesc: "El usuario pierde 1/2 del daño infligido.", // NEEDS QC
		},
	},
	strugglebug: {
		name: "Estoicismo",
		// Official flavor text: "El usuario opone resistencia y ataca a los oponentes. También reduce su Ataque Especial."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel el At. Esp. de los rivales.", // NEEDS QC
	},
	stuffcheeks: {
		name: "Atiborramiento",
		// Official flavor text: "El usuario ingiere la baya que lleva equipada para aumentar mucho su Defensa."
		desc: "Solo puede seleccionarse si el usuario lleva una baya. Se la come y sube 2 niveles su Defensa. Este efecto no lo impiden las habilidades Zoquete o Nerviosismo ni los efectos de Embargo o Zona Mágica. Falla si no lleva una baya.", // NEEDS QC
		shortDesc: "Requiere baya: se la come y sube 2 niveles su Defensa.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	stunspore: {
		name: "Paralizador",
		// Official flavor text: "Esparce polvo que paraliza al objetivo."
		desc: "Paraliza al objetivo.", // NEEDS QC
		shortDesc: "Paraliza al objetivo.", // NEEDS QC
		gen3: {
			desc: "Paraliza al objetivo. Este movimiento no ignora las inmunidades de tipo.", // NEEDS QC
		},
		gen1: {
			desc: "Paraliza al objetivo.", // NEEDS QC
		},
	},
	submission: {
		name: "Sumisión",
		// Official flavor text: "El usuario se lanza al suelo con el oponente en brazos y también se hace un poco de daño."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso de 1/4 del daño.", // NEEDS QC
		gen4: {
			desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		},
		gen2: {
			desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS). Si este movimiento golpea un sustituto, el retroceso es siempre de 1 PS.", // NEEDS QC
		},
		gen1: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/4 de los PS perdidos (redondeado hacia abajo, mínimo 1 PS). Si el movimiento rompe el sustituto del objetivo, el usuario no sufre retroceso.", // NEEDS QC
		},
	},
	substitute: {
		name: "Sustituto",
		// Official flavor text: "Utiliza parte de los PS propios para crear un sustituto que actúa como señuelo."
		desc: "El usuario pierde 1/4 de sus PS máximos (redondeado hacia abajo) para crear un sustituto que lo reemplaza en combate. El sustituto desaparece al recibir suficiente daño, si el usuario se cambia o se debilita, o si algún Pokémon usa Limpieza General. Puede transferirse con Relevo conservando sus PS restantes. Hasta romperse, recibe el daño de todos los ataques de otros Pokémon y protege al usuario de los problemas de estado y cambios de características causados por otros. Los movimientos de sonido y los Pokémon con la habilidad Allanamiento lo ignoran. El usuario sigue recibiendo con normalidad el daño del clima y de los estados. Si el sustituto se rompe durante un multigolpe, el usuario recibe los golpes restantes. Si se crea mientras el usuario está atrapado por un movimiento de atadura, ese efecto termina de inmediato. Falla si el usuario no tiene PS suficientes para crearlo sin debilitarse o si ya tiene uno.", // NEEDS QC
		shortDesc: "Gasta 1/4 de sus PS para crear un sustituto.", // NEEDS QC
		gen8: {
			desc: "El usuario pierde 1/4 de sus PS máximos (redondeado hacia abajo) para crear un sustituto que lo reemplaza en combate. El sustituto desaparece al recibir suficiente daño o si el usuario se cambia o se debilita. Puede transferirse con Relevo conservando sus PS restantes. Hasta romperse, recibe el daño de todos los ataques de otros Pokémon y protege al usuario de los problemas de estado y cambios de características causados por otros. Los movimientos de sonido y los Pokémon con la habilidad Allanamiento lo ignoran. El usuario sigue recibiendo con normalidad el daño del clima y de los estados. Si el sustituto se rompe durante un multigolpe, el usuario recibe los golpes restantes. Si se crea mientras el usuario está atrapado por un movimiento de atadura, ese efecto termina de inmediato. Falla si el usuario no tiene PS suficientes para crearlo sin debilitarse o si ya tiene uno.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario pierde 1/4 de sus PS máximos (redondeado hacia abajo) para crear un sustituto que lo reemplaza en combate. El sustituto desaparece al recibir suficiente daño o si el usuario se cambia o se debilita. Puede transferirse con Relevo conservando sus PS restantes. Hasta romperse, recibe el daño de todos los ataques de otros Pokémon y protege al usuario de los problemas de estado y cambios de características causados por otros. El usuario sigue recibiendo con normalidad el daño del clima y de los estados. Si el sustituto se rompe durante un multigolpe, el usuario recibe los golpes restantes. Si se crea mientras el usuario está atrapado por un movimiento de atadura, ese efecto termina de inmediato. Falla si el usuario no tiene PS suficientes para crearlo sin debilitarse o si ya tiene uno.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario pierde 1/4 de sus PS máximos (redondeado hacia abajo) para crear un sustituto que lo reemplaza en combate. El sustituto tiene 1 PS más los PS usados para crearlo, y desaparece al recibir suficiente daño o 255 de daño de una vez, o si el usuario se cambia o se debilita. Hasta romperse, recibe el daño de todos los ataques del rival y protege al usuario de los problemas de estado y cambios de características causados por el rival, salvo que el efecto sea Anulación, Drenadoras, el sueño, la parálisis como efecto principal o la confusión como efecto secundario y el sustituto no se haya roto. El usuario sigue recibiendo con normalidad el daño de los estados, salvo el daño de confusión, que se aplica al sustituto del rival en su lugar. Si el sustituto se rompe durante un multigolpe, el ataque termina. Falla si el usuario no tiene PS suficientes para crearlo o si ya tiene uno. El usuario crea un sustituto y luego se debilita si sus PS actuales son exactamente 1/4 de sus PS máximos.", // NEEDS QC
			shortDesc: "Pierde 1/4 de sus PS máximos para crear un sustituto.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha creado un sustituto!",
		alreadyStarted: "  ¡{POKEMON} ya tiene un sustituto!",
		end: "  ¡El sustituto de {POKEMON} ha desaparecido!",
		fail: "  ¡Está demasiado débil para crear un sustituto!",
		activate: "  ¡El sustituto recibe el ataque en lugar de {POKEMON}!",
	},
	subzeroslammer: {
		name: "Crioaliento Despiadado",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	suckerpunch: {
		name: "Golpe Bajo",
		// Official flavor text: "Permite atacar con prioridad. Falla si el objetivo no está preparando ningún ataque."
		desc: "Falla si el objetivo no eligió un ataque físico, un ataque especial o Yo Primero este turno, o si el objetivo actúa antes que el usuario.", // NEEDS QC
		shortDesc: "Suele actuar primero. Falla si el objetivo no ataca.", // NEEDS QC
		gen4: {
			desc: "Falla si el objetivo no eligió un ataque físico o especial este turno, o si el objetivo actúa antes que el usuario.", // NEEDS QC
		},
	},
	sunnyday: {
		name: "Día Soleado",
		// Official flavor text: "Hace que se intensifique el efecto del sol durante cinco turnos, lo que potencia los movimientos de tipo Fuego y debilita los de tipo Agua."
		desc: "Durante 5 turnos, hace sol: el daño de los ataques de tipo Fuego se multiplica por 1,5 y el de los de tipo Agua por 0,5. Dura 8 turnos con Roca Calor. Falla si ya hace sol.", // NEEDS QC
		shortDesc: "5 turnos: el sol potencia los movimientos de Fuego.", // NEEDS QC
		gen3: {
			desc: "Durante 5 turnos, hace sol: el daño de los ataques de tipo Fuego se multiplica por 1,5 y el de los de tipo Agua por 0,5. Falla si ya hace sol.", // NEEDS QC
		},
		gen2: {
			desc: "Durante 5 turnos, hace sol, incluso si ya hace sol: el daño de los ataques de tipo Fuego se multiplica por 1,5 y el de los de tipo Agua por 0,5.", // NEEDS QC
		},
	},
	sunsteelstrike: {
		name: "Meteoimpacto",
		// Official flavor text: "Ataca al objetivo con la potencia de un meteoro, ignorando su habilidad."
		desc: "Este movimiento y sus efectos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		shortDesc: "Ignora las habilidades de otros Pokémon.", // NEEDS QC
	},
	supercellslam: {
		name: "Plancha Voltaica",
		desc: "Si el ataque falla, el usuario pierde la mitad de sus PS máximos (redondeado hacia abajo) por el impacto. Los Pokémon con la habilidad Muro Mágico no sufren este daño. El daño se duplica y no se comprueba la precisión si el objetivo usó Reducción desde que entró en combate.", // NEEDS QC
		shortDesc: "Si falla, el usuario pierde la mitad de sus PS máximos.", // NEEDS QC

		damage: "#crash",
	},
	superfang: {
		name: "Superdiente",
		// Official flavor text: "Finos colmillos que reducen a la mitad los PS del objetivo."
		desc: "Inflige un daño igual a la mitad de los PS actuales del objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Inflige la mitad de los PS actuales del objetivo.", // NEEDS QC
		gen1: {
			desc: "Inflige un daño igual a la mitad de los PS actuales del objetivo (redondeado hacia abajo, mínimo 1 PS). Este movimiento ignora la inmunidad de tipo.", // NEEDS QC
			shortDesc: "Daño = 1/2 de los PS actuales. Golpea a Fantasmas.", // NEEDS QC
		},
	},
	superpower: {
		name: "Fuerza Bruta",
		// Official flavor text: "Ataque de gran potencia, pero que reduce el Ataque y la Defensa del agresor."
		desc: "Baja 1 nivel el Ataque y la Defensa del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel Ataque y Defensa del usuario.", // NEEDS QC
	},
	supersonic: {
		name: "Supersónico",
		shortDesc: "Confunde al objetivo.", // NEEDS QC
	},
	supersonicskystrike: {
		name: "Picado Supersónico",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	surf: {
		name: "Surf",
		// Official flavor text: "Inunda el terreno de combate con una ola gigante."
		desc: "El daño se duplica contra objetivos usando Buceo.", // NEEDS QC
		shortDesc: "Golpea a los adyacentes. Doble daño contra Buceo.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica contra objetivos usando Buceo.", // NEEDS QC
			shortDesc: "Golpea a los adyacentes. Doble potencia contra Buceo.", // NEEDS QC
		},
		gen2: {
			desc: "Sin efecto adicional.", // NEEDS QC
			shortDesc: "Sin efecto adicional.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Golpea a los rivales. Doble potencia contra Buceo.", // NEEDS QC
		},
	},
	surgingstrikes: {
		name: "Azote Torrencial",
		// Official flavor text: "El usuario, dominador absoluto del líquido elemento, golpea hasta tres veces con movimientos fluidos. Siempre asesta un golpe crítico."
		desc: "Golpea 3 veces. Siempre asesta golpes críticos, salvo que el objetivo esté bajo el efecto de Conjuro o tenga las habilidades Armadura Batalla o Caparazón.", // NEEDS QC
		shortDesc: "Golpea 3 veces. Siempre con golpe crítico.", // NEEDS QC
	},
	swagger: {
		name: "Fanfarronear",
		// Official flavor text: "Provoca confusión en el objetivo, pero también sube mucho su Ataque."
		desc: "Sube 2 niveles el Ataque del objetivo y lo confunde.", // NEEDS QC
		shortDesc: "+2 Ataque del objetivo y lo confunde.", // NEEDS QC
		gen2: {
			desc: "Sube 2 niveles el Ataque del objetivo y lo confunde. Este movimiento falla si el Ataque del objetivo no puede subir.", // NEEDS QC
		},
	},
	swallow: {
		name: "Tragar",
		// Official flavor text: "Absorbe la energía acumulada con Reserva para recobrar salud. Cuanta más se haya acumulado, mayor será el número de PS que se recuperen."
		desc: "El usuario recupera PS según su contador de reservas: 1/4 de sus PS máximos con 1, la mitad con 2 (ambos redondeados a la baja desde 0,5) y todos con 3. Falla si el contador es 0. Su Defensa y Defensa Especial bajan tantos niveles como los que subió Reserva, y el contador vuelve a 0.", // NEEDS QC
		shortDesc: "Se cura según sus usos de Reserva.", // NEEDS QC
		gen4: {
			desc: "El usuario recupera PS según su contador de Reserva: 1/4 de sus PS máximos con 1, la mitad con 2 (ambos redondeados hacia abajo) y todos con 3. Falla si el contador es 0. Su Defensa y Defensa Especial bajan tantos niveles como los que subió Reserva, y el contador vuelve a 0.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario recupera PS según su contador de Reserva: 1/4 de sus PS máximos con 1, la mitad con 2 (ambos redondeados a la baja desde 0,5) y todos con 3. Falla si el contador es 0. El contador vuelve a 0.", // NEEDS QC
		},
	},
	sweetkiss: {
		name: "Beso Dulce",
		shortDesc: "Confunde al objetivo.", // NEEDS QC
	},
	sweetscent: {
		name: "Dulce Aroma",
		// Official flavor text: "Un dulce aroma engatusa al objetivo, por lo que se reduce mucho su Evasión."
		desc: "Baja 2 niveles la evasión del objetivo.", // NEEDS QC
		shortDesc: "Baja 2 niveles la evasión de los rivales.", // NEEDS QC
		gen5: {
			desc: "Baja 1 nivel la evasión del objetivo.", // NEEDS QC
			shortDesc: "Baja 1 nivel la evasión de los rivales.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Baja 1 nivel la evasión del objetivo.", // NEEDS QC
		},
	},
	swift: {
		name: "Meteoros",
		// Official flavor text: "Lanza rayos en forma de estrella que no fallan nunca."
		desc: "No comprueba la precisión.", // NEEDS QC
		shortDesc: "No comprueba la precisión. Golpea a los rivales.", // NEEDS QC
		gen1: {
			desc: "No comprueba la precisión y golpea incluso a objetivos usando Excavar o Vuelo.", // NEEDS QC
			shortDesc: "Nunca falla, ni contra Excavar y Vuelo.", // NEEDS QC
		},
		gen2: {
			shortDesc: "No comprueba la precisión.", // NEEDS QC
		},
	},
	switcheroo: {
		name: "Trapicheo",
		// Official flavor text: "Intercambia con el objetivo los objetos que llevan tan rápido que es imposible verlo a simple vista."
		desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Gran Diamansfera, Gran Lustresfera, Gran Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada, Escudo Oxidado, Energía Potenciadora o una máscara a o de Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradoja u Ogerpon, respectivamente. Aquí, los Pokémon Paradoja son todas las especies con las habilidades Paleosíntesis y Carga Cuark, salvo Flamariete, Electrofuria, Ferromole, Ferrotesta. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		shortDesc: "Intercambia su objeto con el del objetivo.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada o Escudo Oxidado a o de un Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian o Zamazenta, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen7: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si cualquiera de los dos lleva un Cristal Z, si el usuario intenta dar o quitar una megapiedra a o de la especie que puede megaevolucionar con ella, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho o un disco a o de un Kyogre, Groudon, Giratina, Arceus, Genesect o Silvally, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen6: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si el usuario intenta dar o quitar una megapiedra a o de la especie que puede megaevolucionar con ella, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Griseosfera, una tabla o un cartucho a o de un Kyogre, Groudon, Giratina, Arceus o Genesect, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si cualquiera de los dos lleva Carta, o si el usuario intenta dar o quitar Griseosfera, una tabla o un cartucho a o de un Giratina, Arceus o Genesect, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si cualquiera de los dos lleva Carta o Griseosfera, si cualquiera tiene la habilidad Multitipo, si cualquiera está bajo el efecto de Desarme, o si el objetivo tiene la habilidad Viscosidad.", // NEEDS QC
		},

		activate: "#trick",
	},
	swordsdance: {
		name: "Danza Espada",
		// Official flavor text: "Baile frenético que aumenta mucho el Ataque."
		desc: "Sube 2 niveles el Ataque del usuario.", // NEEDS QC
		shortDesc: "Sube 2 niveles Ataque del usuario.", // NEEDS QC
	},
	synchronoise: {
		name: "Sincrorruido",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "No afecta a objetivos que no compartan ningún tipo con el usuario.", // NEEDS QC
		shortDesc: "Golpea a los adyacentes que compartan tipo con él.", // NEEDS QC
	},
	synthesis: {
		name: "Fotosíntesis",
		// Official flavor text: "Restaura PS del usuario. La cantidad varía según el tiempo que haga."
		desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima, o si lleva Parasol Multiuso; 2/3 con sol o luz solar extrema; y 1/4 con lluvia, diluvio, tormenta de arena o nieve (todo redondeado a la baja desde 0,5).", // NEEDS QC
		shortDesc: "Cura al usuario según el clima.", // NEEDS QC
		gen8: {
			desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima, o si lleva Parasol Multiuso; 2/3 con sol o luz solar extrema; y 1/4 con Granizo, diluvio, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen7: {
			desc: "El usuario recupera la mitad de sus PS máximos con turbulencias o sin clima; 2/3 con sol o luz solar extrema; y 1/4 con Granizo, diluvio, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen5: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; 2/3 con sol; y 1/4 con Granizo, lluvia o Tormenta de Arena (todo redondeado a la baja desde 0,5).", // NEEDS QC
		},
		gen4: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; 2/3 con sol; y 1/4 con Granizo, lluvia o Tormenta de Arena (todo redondeado hacia abajo).", // NEEDS QC
		},
		gen2: {
			desc: "El usuario recupera la mitad de sus PS máximos sin clima; todos sus PS con sol; y 1/4 con lluvia o Tormenta de Arena (todo redondeado hacia abajo).", // NEEDS QC
		},
	},
	syrupbomb: {
		name: "Bomba Caramelo",
		desc: "Si acierta, la Velocidad del objetivo baja 1 nivel al final de cada turno durante 3 turnos.", // NEEDS QC
		shortDesc: "-1 Velocidad del objetivo cada turno durante 3 turnos.", // NEEDS QC

		start: "  ¡{POKEMON} está caramelizado!",
	},
	tackle: {
		name: "Placaje",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	tachyoncutter: {
		name: "Tajo Taquión",
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon. No comprueba la precisión.", // NEEDS QC
		shortDesc: "Golpea 2 veces. No comprueba la precisión.", // NEEDS QC
	},
	tailglow: {
		name: "Luminicola",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Sube 3 niveles el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Sube 3 niveles At. Esp. del usuario.", // NEEDS QC
		gen4: {
			desc: "Sube 2 niveles el Ataque Especial del usuario.", // NEEDS QC
			shortDesc: "Sube 2 niveles At. Esp. del usuario.", // NEEDS QC
		},
	},
	tailslap: {
		name: "Plumerazo",
		// Official flavor text: "Golpea con la cola de dos a cinco veces seguidas."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Golpea de 2 a 5 veces en un turno.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
	},
	tailwhip: {
		name: "Agitacola",
		// Official flavor text: "Agita la cola para bajar la Defensa del equipo rival."
		desc: "Baja 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel la Defensa de los rivales.", // NEEDS QC
		gen2: {
			shortDesc: "Baja 1 nivel la Defensa del objetivo.", // NEEDS QC
		},
	},
	tailwind: {
		name: "Viento Afín",
		// Official flavor text: "Crea un fuerte remolino que aumenta la Velocidad de los Pokémon de tu equipo durante cuatro turnos."
		desc: "Durante 4 turnos, la Velocidad del usuario y de sus compañeros se duplica. Falla si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "4 turnos: duplica la Velocidad de su equipo.", // NEEDS QC
		gen4: {
			desc: "Durante 3 turnos, la Velocidad del usuario y de sus compañeros se duplica. Falla si el efecto ya está activo en su bando.", // NEEDS QC
			shortDesc: "3 turnos: duplica la Velocidad de su equipo.", // NEEDS QC
		},

		start: "  ¡El viento sopla a favor de {TEAM}!",
		end: "  Ha dejado de soplar el viento que favorecía a {TEAM}.",
	},
	takedown: {
		name: "Derribo",
		// Official flavor text: "Carga desmedida que también hiere al agresor."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso de 1/4 del daño.", // NEEDS QC
		gen4: {
			desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
		},
		gen2: {
			desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS). Si este movimiento golpea un sustituto, el retroceso es siempre de 1 PS.", // NEEDS QC
		},
		gen1: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/4 de los PS perdidos (redondeado hacia abajo, mínimo 1 PS). Si el movimiento rompe el sustituto del objetivo, el usuario no sufre retroceso.", // NEEDS QC
		},
	},
	takeheart: {
		name: "Bálsamo Osado",
		desc: "Cura el problema de estado del usuario y sube 1 nivel su Ataque Especial y su Defensa Especial.", // NEEDS QC
		shortDesc: "Cura su estado; +1 At. Esp. y Def. Esp.", // NEEDS QC
	},
	tarshot: {
		name: "Alquitranazo",
		// Official flavor text: "Cubre al objetivo de un alquitrán pegajoso que reduce su Velocidad y lo vuelve débil contra el fuego."
		desc: "Baja 1 nivel la Velocidad del objetivo. Hasta que se cambie, la eficacia de los movimientos de tipo Fuego contra él se duplica.", // NEEDS QC
		shortDesc: "-1 Velocidad y lo vuelve débil al Fuego.", // NEEDS QC

		start: "  ¡{POKEMON} se ha vuelto débil ante el fuego!",
	},
	taunt: {
		name: "Mofa",
		// Official flavor text: "Enfurece al objetivo para que solo use movimientos de ataque durante tres turnos."
		desc: "El objetivo no puede usar movimientos que no causen daño durante sus próximos 3 turnos. Los Pokémon con la habilidad Despiste o protegidos por Velo Aroma son inmunes.", // NEEDS QC
		shortDesc: "El objetivo no puede usar mov. de estado 3 turnos.", // NEEDS QC
		gen7: {
			desc: "El objetivo no puede usar movimientos que no causen daño durante sus próximos 3 turnos. Los Pokémon con la habilidad Despiste o protegidos por Velo Aroma son inmunes. Los movimientos potenciados con Poder Z pueden seguir eligiéndose y ejecutándose durante el efecto.", // NEEDS QC
		},
		gen6: {
			desc: "El objetivo no puede usar movimientos que no causen daño durante sus próximos 3 turnos. Los Pokémon con la habilidad Despiste o protegidos por Velo Aroma son inmunes.", // NEEDS QC
		},
		gen5: {
			desc: "El objetivo no puede usar movimientos que no causen daño durante sus próximos 3 turnos.", // NEEDS QC
		},
		gen4: {
			desc: "Durante 3 a 5 turnos, el objetivo no puede usar movimientos que no causen daño.", // NEEDS QC
			shortDesc: "El objetivo no puede usar mov. de estado 3-5 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Durante 2 turnos, el objetivo no puede usar movimientos que no causen daño.", // NEEDS QC
			shortDesc: "El objetivo no puede usar mov. de estado 2 turnos.", // NEEDS QC
		},

		start: "  ¡{POKEMON} se ha dejado provocar por una mofa!",
		end: "  ¡{POKEMON} ya se ha olvidado de la mofa!",
		cant: "¡Se han mofado de {POKEMON}, por lo que no puede usar {MOVE}!",
	},
	tearfullook: {
		name: "Ojos Llorosos",
		// Official flavor text: "Mira al objetivo con ojos llorosos para hacerle perder su espíritu combativo y reduce su Ataque y Ataque Especial."
		desc: "Baja 1 nivel el Ataque y el Ataque Especial del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel Ataque y At. Esp. del objetivo.", // NEEDS QC
	},
	teatime: {
		name: "Hora del Té",
		// Official flavor text: "El usuario invita a tomar el té a todos los presentes en el terreno de combate, lo que hace que ingieran las bayas que lleven equipadas."
		desc: "Todos los Pokémon en combate se comen sus bayas. Este efecto no lo impiden los sustitutos, las habilidades Zoquete o Nerviosismo ni los efectos de Embargo o Zona Mágica. Falla si nadie lleva una baya.", // NEEDS QC
		shortDesc: "Todos los Pokémon en combate comen sus bayas.", // NEEDS QC

		activate: "  ¡Es la hora del té! A comer bayas se ha dicho.",
		fail: "  Pero no ha sucedido nada.",
	},
	technoblast: {
		name: "Tecno Shock",
		// Official flavor text: "Ataca al objetivo con un gran láser. El tipo del ataque lo determina el cartucho que porta el usuario."
		desc: "Su tipo depende del cartucho que lleve el usuario.", // NEEDS QC
		shortDesc: "Su tipo depende del cartucho que lleve.", // NEEDS QC
	},
	tectonicrage: {
		name: "Barrena Telúrica",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	teeterdance: {
		name: "Danza Caos",
		// Official flavor text: "Danza histérica que confunde a los Pokémon que están alrededor del usuario."
		desc: "Confunde al objetivo.", // NEEDS QC
		shortDesc: "Confunde a los Pokémon adyacentes.", // NEEDS QC
	},
	telekinesis: {
		name: "Telequinesis",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Durante 3 turnos, el objetivo no puede esquivar ningún ataque dirigido a él, salvo los fulminantes, mientras siga en combate. Durante el efecto, es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena. Si usa Relevo, el sustituto hereda el efecto. Arraigo, Antiaéreo, Mil Flechas y Bola Férrea tienen prioridad sobre este movimiento. Falla si el objetivo ya tiene este efecto o los de Arraigo, Antiaéreo, Mil Flechas. Es inmune al usarse si su especie es Diglett, Dugtrio, Diglett (Forma de Alola), Dugtrio (Forma de Alola), Sandygast, Palossand o un Gengar megaevolucionado, que no puede quedar bajo este efecto de ninguna forma.", // NEEDS QC
		shortDesc: "3 turnos: el objetivo flota y no puede esquivar.", // NEEDS QC
		gen6: {
			desc: "Durante 3 turnos, el objetivo no puede esquivar ningún ataque dirigido a él, salvo los fulminantes, mientras siga en combate. Durante el efecto, es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena. Si usa Relevo, el sustituto hereda el efecto. Arraigo, Antiaéreo, Mil Flechas y Bola Férrea tienen prioridad sobre este movimiento. Falla si el objetivo ya tiene este efecto o los de Arraigo, Antiaéreo, Mil Flechas. Es inmune al usarse si su especie es Diglett, Dugtrio o un Gengar megaevolucionado, que no puede quedar bajo este efecto de ninguna forma.", // NEEDS QC
		},
		gen5: {
			desc: "Durante 3 turnos, el objetivo no puede esquivar ningún ataque dirigido a él, salvo los fulminantes, mientras siga en combate. Durante el efecto, es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas y la habilidad Trampa Arena. Si usa Relevo, el sustituto hereda el efecto. Arraigo, Antiaéreo y Bola Férrea tienen prioridad sobre este movimiento. Falla si el objetivo ya tiene este efecto o los de Arraigo, Antiaéreo. Es inmune si su especie es Diglett o Dugtrio.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha sido lanzado por los aires!",
		end: "  ¡{POKEMON} se ha liberado de la telequinesis!",
	},
	teleport: {
		name: "Teletransporte",
		// Official flavor text: "Permite al usuario cambiarse por otro Pokémon del equipo, si es posible. Si un Pokémon salvaje usa este movimiento, huye del combate."
		desc: "Si acierta y el usuario no se ha debilitado, se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos.", // NEEDS QC
		shortDesc: "El usuario se cambia.", // NEEDS QC
		gen7: {
			desc: "Falla al usarse.", // NEEDS QC
			shortDesc: "Falla al usarse.", // NEEDS QC
		},
	},
	temperflare: {
		name: "Cólera Ardiente",
		desc: "La potencia se duplica si el último movimiento del usuario en el turno anterior (incluidos los llamados por otros movimientos o los usados mediante Mandato, Capa Mágica, Robo o las habilidades Pareja de Baile y Espejo Mágico) falló sin producir ninguno de sus efectos normales (sin contar el daño de un Patada Salto Alta, Patada Salto o Cabeza Sorpresa fallidos), o si el usuario no pudo actuar por un efecto distinto de la recarga o Caída Libre. No se duplica si el movimiento fue bloqueado por Búnker, Detección, Escudo Real, Protección, Barrera Espinosa, Truco Defensa, Escudo Tatami, Anticipo, Vasta Guardia, ni si Bote o Vuelo se interrumpieron por Gravedad, Antiaéreo o Mil Flechas.", // NEEDS QC
		shortDesc: "Potencia doble si su último movimiento falló.", // NEEDS QC
	},
	terablast: {
		name: "Teraexplosión",
		desc: "Si el usuario está teracristalizado, se convierte en ataque físico si su Ataque es mayor que su Ataque Especial (incluidos los cambios de nivel) y su tipo pasa a ser su teratipo. Además, si el teratipo es Astral, tiene 100 de potencia, es supereficaz contra objetivos teracristalizados y neutro contra los demás, y baja 1 nivel el Ataque y el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Teracristalizado: físico si Ata. > At. Esp.; tipo Tera.", // NEEDS QC
	},
	terastarstorm: {
		name: "Teraclúster",
		desc: "Si el usuario es un Terapagos en Forma Astral, su tipo pasa a ser Astral, golpea a todos los rivales y se convierte en ataque físico si su Ataque es mayor que su Ataque Especial (incluidos los cambios de nivel).", // NEEDS QC
		shortDesc: "Terapagos Astral: tipo Astral, golpea a ambos rivales.", // NEEDS QC
	},
	terrainpulse: {
		name: "Pulso de Campo",
		// Official flavor text: "El usuario ataca aprovechando la energía del campo activo, que determina tanto el tipo como la potencia del movimiento."
		desc: "La potencia se duplica si el usuario está en el suelo y hay un campo activo, y su tipo cambia según este: Eléctrico, Planta, Hada o Psíquico.", // NEEDS QC
		shortDesc: "Con campo: potencia doble y tipo variable.", // NEEDS QC
	},
	thief: {
		name: "Ladrón",
		// Official flavor text: "El agresor ataca y le quita el objeto al objetivo siempre y cuando no lleve ninguno."
		desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. No puede robar Prisma Azul, Prisma Rojo, Gran Diamansfera, Gran Lustresfera, Gran Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada, Escudo Oxidado, Energía Potenciadora o una máscara en poder de Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradoja u Ogerpon, respectivamente, ni si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Aquí, los Pokémon Paradoja son todas las especies con las habilidades Paleosíntesis y Carga Cuark, salvo Flamariete, Electrofuria, Ferromole, Ferrotesta. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		shortDesc: "Si no lleva objeto, roba el del objetivo.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada o Escudo Oxidado llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen7: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es un Cristal Z, una megapiedra llevada por la especie que puede megaevolucionar con ella, o Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho o un disco llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen6: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es una megapiedra llevada por la especie que puede megaevolucionar con ella, o Prisma Azul, Prisma Rojo, Griseosfera, una tabla o un cartucho llevados, respectivamente, por Kyogre, Groudon, Giratina, Arceus, Genesect, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen5: {
			desc: "Si acierta y el usuario no se ha debilitado, roba el objeto del objetivo si él no lleva ninguno. Un objetivo con la habilidad Viscosidad no pierde su objeto si no se ha debilitado. El objeto no se roba si es Carta, o Griseosfera, una tabla o un cartucho llevados, respectivamente, por Giratina, Arceus o Genesect, o si el usuario es una de esas especies y el objetivo lleva el objeto correspondiente. Los objetos perdidos así no pueden recuperarse con Reciclaje ni la habilidad Cosecha.", // NEEDS QC
		},
		gen4: {
			desc: "Si acierta y el usuario no lleva objeto, roba el objeto del objetivo. El objeto no se roba si es Carta o Griseosfera, o si el objetivo tiene la habilidad Multitipo o Viscosidad. Los objetos perdidos así no pueden recuperarse con Reciclaje.", // NEEDS QC
		},
		gen3: {
			desc: "Si acierta y el usuario no lleva objeto, roba el objeto del objetivo. El objeto no se roba si es Carta o Baya Enigma, o si el objetivo tiene la habilidad Viscosidad. Los objetos perdidos así no pueden recuperarse con Reciclaje.", // NEEDS QC
		},
		gen2: {
			desc: "100% de probabilidad de robar el objeto del objetivo si el usuario no lleva ninguno. No puede robar el objeto si es Carta.", // NEEDS QC
		},
	},
	thousandarrows: {
		name: "Mil Flechas",
		// Official flavor text: "Acierta incluso a Pokémon que estén en el aire y los hace caer al suelo."
		desc: "Puede golpear a Pokémon en el aire: los de tipo Volador, los que tienen la habilidad Levitación, los que llevan Globo Helio y los que están bajo Levitón o Telequinesis. Si el objetivo es de tipo Volador y aún no está en el suelo, inflige daño neutro sin importar sus otros tipos. Puede golpear a objetivos usando Bote, Vuelo, Caída Libre. Si golpea a un objetivo bajo Bote, Vuelo, Levitón, Telequinesis, ese efecto termina. Si el objetivo es de tipo Volador y no usó Respiro este turno, o tiene Levitación, pierde su inmunidad al tipo Tierra y a Trampa Arena mientras siga en combate; durante el efecto, Levitón le falla y Telequinesis falla contra él.", // NEEDS QC
		shortDesc: "Derriba a los rivales. Neutro contra Voladores.", // NEEDS QC
	},
	thousandwaves: {
		name: "Mil Temblores",
		// Official flavor text: "El usuario genera ondas sísmicas que se propagan por el suelo y sacuden a los oponentes. Los Pokémon alcanzados no podrán huir del combate."
		desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo.", // NEEDS QC
		shortDesc: "Golpea a los rivales y les impide cambiarse.", // NEEDS QC
		gen7: {
			desc: "Impide que el objetivo se cambie. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. Si el objetivo deja el campo con Relevo, su sustituto sigue atrapado. El efecto termina si el usuario deja el campo.", // NEEDS QC
		},
	},
	thrash: {
		name: "Saña",
		// Official flavor text: "Ataque de dos a tres turnos que acaba confundiendo al agresor."
		desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla en el primer turno del efecto (o el segundo de un efecto de tres), el efecto termina sin causar confusión. Si lo llama Sonámbulo y el usuario está dormido, se usa 1 turno y no lo confunde.", // NEEDS QC
		shortDesc: "Dura 2-3 turnos y después confunde al usuario.", // NEEDS QC
		gen6: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, si no lo estaba ya. Cada turno elige un rival adyacente al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla en el primer turno del efecto (o el segundo de un efecto de tres), el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso al final del último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, está dormido al empezar un turno, o el ataque falla contra el objetivo, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario queda fijado en este movimiento durante 2 o 3 turnos y queda confuso al final del último turno del efecto, si no lo estaba ya. Cada turno elige un rival al azar como objetivo. Si el usuario no puede actuar, se duerme, se congela, o el ataque falla contra el objetivo, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen2: {
			desc: "Acierte o no este movimiento, el usuario queda fijado en él durante 2 o 3 turnos y queda confuso justo después de actuar en el último turno del efecto, aunque ya estuviera confuso. Si el usuario no puede actuar, el efecto termina sin causar confusión. Si lo llama Sonámbulo, se usa 1 turno y no lo confunde.", // NEEDS QC
		},
		gen1: {
			desc: "Acierte o no este movimiento, el usuario queda fijado en él durante 3 o 4 turnos y queda confuso justo después de actuar en el último turno del efecto, aunque ya estuviera confuso. Si el usuario no puede actuar, el efecto termina sin causar confusión. Mientras dura el efecto, la precisión de este movimiento se sobrescribe cada turno con la precisión actual calculada, incluidos los cambios de niveles, pero sin bajar de 1/256 ni superar 255/256.", // NEEDS QC
			shortDesc: "Dura 3-4 turnos y luego confunde al usuario.", // NEEDS QC
		},
	},
	throatchop: {
		name: "Golpe Mordaza",
		// Official flavor text: "Inflige al rival un dolor tan abrumador que le impide utilizar durante dos turnos ataques que se sirven del sonido."
		desc: "Durante 2 turnos, el objetivo no puede usar movimientos de sonido.", // NEEDS QC
		shortDesc: "2 turnos: el objetivo no puede usar sonidos.", // NEEDS QC
		gen7: {
			desc: "Durante 2 turnos, el objetivo no puede usar movimientos de sonido. Los movimientos de sonido potenciados con Poder Z pueden seguir eligiéndose y ejecutándose durante el efecto.", // NEEDS QC
		},

		cant: "¡El efecto de Golpe Mordaza impide a {POKEMON} usar el movimiento!",
	},
	thunder: {
		name: "Trueno",
		// Official flavor text: "Un poderoso rayo que daña al objetivo y puede paralizarlo."
		desc: "30% de probabilidad de paralizar al objetivo. Puede golpear a objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre. No puede fallar si llueve o hay diluvio. Con sol o luz solar extrema, su precisión es del 50%. Contra un objetivo con Parasol Multiuso, sigue siendo del 70%.", // NEEDS QC
		shortDesc: "30% de paralizar. No falla con lluvia.", // NEEDS QC
		gen7: {
			desc: "30% de probabilidad de paralizar al objetivo. Puede golpear a objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre. No puede fallar si llueve o hay diluvio. Con sol o luz solar extrema, su precisión es del 50%.", // NEEDS QC
		},
		gen5: {
			desc: "30% de probabilidad de paralizar al objetivo. Puede golpear a objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre. No puede fallar con lluvia. Con sol, su precisión es del 50%.", // NEEDS QC
		},
		gen4: {
			desc: "30% de probabilidad de paralizar al objetivo. Puede golpear a objetivos usando Bote o Vuelo. No puede fallar con lluvia. Con sol, su precisión es del 50%.", // NEEDS QC
		},
		gen2: {
			desc: "30% de probabilidad de paralizar al objetivo. Puede golpear a objetivos usando Vuelo. No puede fallar con lluvia. Con sol, su precisión es del 50%.", // NEEDS QC
		},
		gen1: {
			desc: "10% de probabilidad de paralizar al objetivo.", // NEEDS QC
			shortDesc: "10% de paralizar al objetivo.", // NEEDS QC
		},
	},
	thunderbolt: {
		name: "Rayo",
		// Official flavor text: "Potente ataque eléctrico que puede paralizar al objetivo."
		desc: "10% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "10% de paralizar al objetivo.", // NEEDS QC
	},
	thundercage: {
		name: "Electrojaula",
		// Official flavor text: "El objetivo queda atrapado en una jaula electrificada que permanece en el terreno de cuatro a cinco turnos."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},

		start: "  ¡{SOURCE} ha enjaulado a {POKEMON}!",
	},
	thunderclap: {
		name: "Relámpago Súbito",
		desc: "Falla si el objetivo no eligió un ataque físico, un ataque especial o Yo Primero este turno, o si el objetivo actúa antes que el usuario.", // NEEDS QC
		shortDesc: "Suele actuar primero. Falla si el objetivo no ataca.", // NEEDS QC
	},
	thunderfang: {
		name: "Colmillo Rayo",
		// Official flavor text: "El usuario muerde al objetivo con colmillos electrificados y puede hacer que se amedrente o se paralice."
		desc: "10% de probabilidad de paralizar al objetivo y 10% de hacerlo retroceder.", // NEEDS QC
		shortDesc: "10% de paralizar. 10% de hacer retroceder.", // NEEDS QC
	},
	thunderouskick: {
		name: "Patada Relámpago",
		// Official flavor text: "El usuario desconcierta al rival con movimientos centelleantes y le propina una patada. Baja la Defensa del objetivo."
		desc: "100% de probabilidad de bajar 1 nivel la Defensa del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Defensa del objetivo.", // NEEDS QC
	},
	thunderpunch: {
		name: "Puño Trueno",
		// Official flavor text: "Puñetazo eléctrico que puede paralizar al adversario."
		desc: "10% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "10% de paralizar al objetivo.", // NEEDS QC
	},
	thundershock: {
		name: "Impactrueno",
		// Official flavor text: "Ataque eléctrico que puede paralizar al objetivo."
		desc: "10% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "10% de paralizar al objetivo.", // NEEDS QC
	},
	thunderwave: {
		name: "Onda Trueno",
		// Official flavor text: "Una ligera descarga que paraliza al objetivo si lo alcanza."
		desc: "Paraliza al objetivo. Este movimiento no ignora las inmunidades de tipo.", // NEEDS QC
		shortDesc: "Paraliza al objetivo.", // NEEDS QC
	},
	tickle: {
		name: "Cosquillas",
		// Official flavor text: "Hace reír al objetivo para bajar su Ataque y Defensa."
		desc: "Baja 1 nivel el Ataque y la Defensa del objetivo.", // NEEDS QC
		shortDesc: "Baja 1 nivel Ataque y Defensa del objetivo.", // NEEDS QC
	},
	tidyup: {
		name: "Limpieza General",
		desc: "Sube 1 nivel el Ataque y la Velocidad del usuario. Elimina los sustitutos de todos los Pokémon en combate y los efectos de Púas, Trampa Rocas, Red Viscosa, Púas Tóxicas de ambos bandos.", // NEEDS QC
		shortDesc: "+1 Ataque y Vel. Elimina sustitutos y trampas.", // NEEDS QC

		activate: "  ¡Limpieza general completada!",
	},
	topsyturvy: {
		name: "Reversión",
		// Official flavor text: "Invierte por completo los cambios en las características del objetivo."
		desc: "Invierte los cambios de características del objetivo: los positivos pasan a negativos y viceversa. Falla si todas sus características están en 0.", // NEEDS QC
		shortDesc: "Invierte los cambios de características del objetivo.", // NEEDS QC
	},
	torchsong: {
		name: "Canto Ardiente",
		desc: "100% de probabilidad de subir 1 nivel el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "100% de subir 1 nivel At. Esp. del usuario.", // NEEDS QC
	},
	torment: {
		name: "Tormento",
		// Official flavor text: "Atormenta y enfurece al objetivo, que no puede usar dos veces seguidas el mismo movimiento."
		desc: "El objetivo no puede seleccionar el mismo movimiento dos turnos seguidos. El efecto termina cuando deja el combate.", // NEEDS QC
		shortDesc: "El objetivo no puede repetir movimiento seguido.", // NEEDS QC

		start: "  ¡{POKEMON} está atormentado!",
		end: "  ¡{POKEMON} ya no está atormentado!",
	},
	toxic: {
		name: "Tóxico",
		// Official flavor text: "Envenena gravemente al objetivo y causa un daño mayor en cada turno."
		desc: "Envenena gravemente al objetivo. Si lo usa un Pokémon de tipo Veneno, el objetivo no puede esquivarlo, ni siquiera en mitad de un movimiento de dos turnos.", // NEEDS QC
		shortDesc: "Envenena gravemente. Veneno no falla al usarlo.", // NEEDS QC
		gen5: {
			desc: "Envenena gravemente al objetivo.", // NEEDS QC
			shortDesc: "Envenena gravemente al objetivo.", // NEEDS QC
		},
	},
	toxicspikes: {
		name: "Púas Tóxicas",
		// Official flavor text: "Lanza una trampa de púas tóxicas a los pies del objetivo. El veneno afecta a los Pokémon oponentes que entran en combate."
		desc: "Coloca una trampa en el bando rival que envenena a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 2 veces: con 1 capa envenena y con 2 envenena gravemente. Se elimina si algún Pokémon usa Limpieza General, si un rival usa con éxito Giro Mortífero, Giro Rápido, Despejar o recibe Despejar, o si un rival de tipo Veneno en el suelo entra en combate. Velo Sagrado evita el envenenamiento al entrar, pero un sustituto no.", // NEEDS QC
		shortDesc: "Envenena a los rivales que entren. Máx. 2 capas.", // NEEDS QC
		gen8: {
			desc: "Coloca una trampa en el bando rival que envenena a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 2 veces: con 1 capa envenena y con 2 envenena gravemente. Se elimina si un rival usa con éxito Giro Rápido o Despejar, recibe Despejar, o si un rival de tipo Veneno en el suelo entra en combate. Velo Sagrado evita el envenenamiento al entrar, pero un sustituto no.", // NEEDS QC
		},
		gen5: {
			desc: "Coloca una trampa en el bando rival que envenena a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 2 veces: con 1 capa envenena y con 2 envenena gravemente. Se elimina si un rival usa con éxito Giro Rápido, recibe Despejar, o si un rival de tipo Veneno en el suelo entra en combate. Velo Sagrado evita el envenenamiento al entrar, pero un sustituto no.", // NEEDS QC
		},
		gen4: {
			desc: "Coloca una trampa en el bando rival que envenena a los rivales que entren en combate, salvo a los de tipo Volador o con la habilidad Levitación. Puede usarse hasta 2 veces: con 1 capa envenena y con 2 envenena gravemente. Se elimina si un rival usa con éxito Giro Rápido, recibe Despejar, o si un rival de tipo Veneno en el suelo entra en combate. Velo Sagrado evita el envenenamiento al entrar, al igual que entrar en combate con un sustituto.", // NEEDS QC
		},

		start: "  ¡{TEAM:capitalize} está rodeado de púas tóxicas!",
		end: "  Las púas tóxicas lanzadas a {TEAM} han desaparecido.",
	},
	toxicthread: {
		name: "Hilo Venenoso",
		// Official flavor text: "Ataca al oponente con hilillos venenosos que reducen su Velocidad y lo envenenan."
		desc: "Baja 1 nivel la Velocidad del objetivo y lo envenena.", // NEEDS QC
		shortDesc: "-1 Velocidad del objetivo y lo envenena.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	trailblaze: {
		name: "Abrecaminos",
		desc: "100% de probabilidad de subir 1 nivel la Velocidad del usuario.", // NEEDS QC
		shortDesc: "100% de subir 1 nivel Velocidad del usuario.", // NEEDS QC
	},
	transform: {
		name: "Transformación",
		// Official flavor text: "El usuario se transforma en una copia del objetivo, con los mismos movimientos."
		desc: "El usuario se transforma en el objetivo, copiando sus características actuales, cambios de nivel, tipos, movimientos, habilidad, peso, sexo y aspecto. Conserva su nivel y sus PS, y cada movimiento copiado recibe solo 5 PP (máximo 5). Ya no puede cambiar de forma aunque pudiera. Falla si golpea un sustituto, si alguno de los dos ya está transformado o si alguno está tras una Ilusión.", // NEEDS QC
		shortDesc: "Copia características, movimientos, tipos y habilidad.", // NEEDS QC
		gen4: {
			desc: "El usuario se transforma en el objetivo, copiando sus características actuales, cambios de nivel, tipos, movimientos, habilidad, peso, IV, especie y aspecto. Conserva su nivel y sus PS, y cada movimiento copiado recibe solo 5 PP. Falla si el objetivo está transformado.", // NEEDS QC
		},
		gen2: {
			desc: "El usuario se transforma en el objetivo, copiando sus características actuales, cambios de nivel, tipos, movimientos, DV, especie y aspecto. Conserva su nivel y sus PS, y cada movimiento copiado recibe solo 5 PP. Falla si el objetivo está transformado.", // NEEDS QC
			shortDesc: "Copia stats, movimientos, tipos y especie.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario se transforma en el objetivo, copiando sus características actuales, cambios de nivel, tipos, movimientos, DV, especie y aspecto. Conserva su nivel y sus PS, y cada movimiento copiado recibe solo 5 PP. Este movimiento puede golpear a objetivos usando Excavar o Vuelo.", // NEEDS QC
		},

		transform: "¡{POKEMON} se ha transformado en {SPECIES}!",
	},
	triattack: {
		name: "Triataque",
		// Official flavor text: "Ataque triple que puede paralizar, quemar o congelar al objetivo."
		desc: "20% de probabilidad de quemar, congelar o paralizar al objetivo.", // NEEDS QC
		shortDesc: "20% de paralizar, quemar o congelar.", // NEEDS QC
		gen2: {
			desc: "Este movimiento elige al azar quemadura, congelación o parálisis, y tiene un 20% de probabilidad de infligir ese estado al objetivo. Si el objetivo está congelado y se eligió la quemadura, se descongela.", // NEEDS QC
		},
		gen1: {
			desc: "Sin efecto adicional.", // NEEDS QC
			shortDesc: "Sin efecto adicional.", // NEEDS QC
		},
	},
	trick: {
		name: "Truco",
		// Official flavor text: "Engaña al objetivo desprevenido e intercambia objetos."
		desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Gran Diamansfera, Gran Lustresfera, Gran Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada, Escudo Oxidado, Energía Potenciadora o una máscara a o de Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradoja u Ogerpon, respectivamente. Aquí, los Pokémon Paradoja son todas las especies con las habilidades Paleosíntesis y Carga Cuark, salvo Flamariete, Electrofuria, Ferromole, Ferrotesta. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		shortDesc: "Intercambia su objeto con el del objetivo.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho, un disco, Espada Oxidada o Escudo Oxidado a o de un Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian o Zamazenta, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen7: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si cualquiera de los dos lleva un Cristal Z, si el usuario intenta dar o quitar una megapiedra a o de la especie que puede megaevolucionar con ella, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Griseosfera, una tabla, un cartucho o un disco a o de un Kyogre, Groudon, Giratina, Arceus, Genesect o Silvally, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen6: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si el usuario intenta dar o quitar una megapiedra a o de la especie que puede megaevolucionar con ella, o si intenta dar o quitar Prisma Azul, Prisma Rojo, Griseosfera, una tabla o un cartucho a o de un Kyogre, Groudon, Giratina, Arceus o Genesect, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen5: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si cualquiera de los dos lleva Carta, o si el usuario intenta dar o quitar Griseosfera, una tabla o un cartucho a o de un Giratina, Arceus o Genesect, respectivamente. El objetivo es inmune si tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si cualquiera de los dos lleva Carta o Griseosfera, si cualquiera tiene la habilidad Multitipo, si cualquiera está bajo el efecto de Desarme, o si el objetivo tiene la habilidad Viscosidad.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario intercambia su objeto con el del objetivo. Falla si ninguno lleva objeto, si cualquiera de los dos lleva Carta, si cualquiera está bajo el efecto de Desarme, o si el objetivo tiene la habilidad Viscosidad.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha intercambiado su objeto con el de su objetivo!",
	},
	trickortreat: {
		name: "Halloween",
		// Official flavor text: "Invita al objetivo a celebrar Halloween, lo que añade el tipo Fantasma a los tipos de este."
		desc: "Añade el tipo Fantasma al objetivo, que pasa a tener 2 o 3 tipos. Falla si ya es de tipo Fantasma. Si Condena Silvana le añade un tipo, sustituye al añadido por este movimiento (y viceversa).", // NEEDS QC
		shortDesc: "Añade el tipo Fantasma al objetivo.", // NEEDS QC
	},
	trickroom: {
		name: "Espacio Raro",
		// Official flavor text: "Crea un espacio extraño en el que los Pokémon lentos se mueven primero durante cinco turnos."
		desc: "Durante 5 turnos, la Velocidad de cada Pokémon se recalcula para el orden de turno: se considera (10000−su Velocidad normal) y, si supera 8191, se le restan 8192. Si se usa durante el efecto, este termina.", // NEEDS QC
		shortDesc: "Va último. 5 turnos: el orden de turno se invierte.", // NEEDS QC
		gen4: {
			desc: "Durante 5 turnos, los Pokemon con menor Velocidad actúan antes que los de mayor Velocidad, dentro de su nivel de prioridad. Si se usa durante el efecto, este termina.", // NEEDS QC
		},
	},
	triplearrows: {
		name: "Triple Flecha",
		desc: "50% de probabilidad de bajar 1 nivel la Defensa del objetivo, 30% de hacerlo retroceder y alta probabilidad de golpe crítico (índice +1).", // NEEDS QC
		shortDesc: "Crítico alto. 50% -1 Defensa, 30% retroceso.", // NEEDS QC
	},
	tripleaxel: {
		name: "Triple Axel",
		// Official flavor text: "Patea hasta tres veces seguidas y cada vez más fuerte."
		desc: "Golpea 3 veces, con potencia 40 en el segundo golpe y 60 en el tercero. Comprueba la precisión en cada golpe y el ataque termina si el objetivo esquiva uno. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 3 veces.", // NEEDS QC
		shortDesc: "Golpea 3 veces; cada golpe puede fallar y sube potencia.", // NEEDS QC
	},
	tripledive: {
		name: "Triple Inmersión",
		desc: "Golpea 3 veces.", // NEEDS QC
		shortDesc: "Golpea 3 veces.", // NEEDS QC
	},
	triplekick: {
		name: "Triple Patada",
		// Official flavor text: "Patea hasta tres veces seguidas y cada vez más fuerte."
		desc: "Golpea 3 veces, con potencia 20 en el segundo golpe y 30 en el tercero. Comprueba la precisión en cada golpe y el ataque termina si el objetivo esquiva uno. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 3 veces.", // NEEDS QC
		shortDesc: "Golpea 3 veces; cada golpe puede fallar y sube potencia.", // NEEDS QC
		gen4: {
			desc: "Golpea 3 veces, con potencia 20 en el segundo golpe y 30 en el tercero. Comprueba la precisión en cada golpe y el ataque termina si el objetivo esquiva uno. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Si el objetivo lleva Banda Aguante y tenía todos sus PS al empezar este movimiento, no se debilita sin importar el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea 3 veces, con potencia 20 en el segundo golpe y 30 en el tercero. Comprueba la precisión en cada golpe y el ataque termina si el objetivo esquiva uno. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon.", // NEEDS QC
		},
		gen2: {
			desc: "Golpea de 1 a 3 veces, al azar, con potencia 20 en el segundo golpe y 30 en el tercero.", // NEEDS QC
			shortDesc: "Golpea 1-3 veces. La potencia sube con cada golpe.", // NEEDS QC
		},
	},
	tropkick: {
		name: "Patada Tropical",
		// Official flavor text: "Lanza una patada con la fuerza del trópico que golpea al rival y reduce su Ataque."
		desc: "100% de probabilidad de bajar 1 nivel el Ataque del objetivo.", // NEEDS QC
		shortDesc: "100% de bajar 1 nivel Ataque del objetivo.", // NEEDS QC
	},
	trumpcard: {
		name: "As Oculto",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia depende de los PP restantes tras la reducción normal y la habilidad Presión: 200 con 0 PP, 80 con 1, 60 con 2, 50 con 3 y 40 con 4 o más.", // NEEDS QC
		shortDesc: "Más potencia cuantos menos PP le queden.", // NEEDS QC
	},
	twinbeam: {
		name: "Láser Doble",
		desc: "Golpea 2 veces. Si el primer golpe rompe el sustituto del objetivo, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces en un turno.", // NEEDS QC
	},
	twineedle: {
		name: "Doble Ataque",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Golpea 2 veces, cada una con un 20% de probabilidad de envenenar al objetivo. Si el primer golpe rompe el sustituto, el segundo daña al Pokémon.", // NEEDS QC
		shortDesc: "Golpea 2 veces. Cada una: 20% de envenenar.", // NEEDS QC
		gen4: {
			desc: "Golpea 2 veces, cada una con un 20% de probabilidad de envenenar al objetivo. Si el primer golpe rompe el sustituto, el segundo daña al Pokémon. Si el objetivo lleva Banda Aguante y tenía todos sus PS al empezar este movimiento, no se debilita sin importar el número de golpes.", // NEEDS QC
		},
		gen3: {
			desc: "Golpea 2 veces, cada una con un 20% de probabilidad de envenenar al objetivo. Si el primer golpe rompe el sustituto, el segundo daña al Pokémon.", // NEEDS QC
		},
		gen2: {
			desc: "Golpea 2 veces, con un 20% de probabilidad de envenenar al objetivo en el segundo golpe. Si el primer golpe rompe el sustituto, el segundo daña al Pokémon, pero no puede envenenarlo.", // NEEDS QC
			shortDesc: "Golpea 2 veces. El segundo envenena un 20%.", // NEEDS QC
		},
		gen1: {
			desc: "Golpea 2 veces, con un 20% de probabilidad de envenenar al objetivo en el segundo golpe. Si el primer golpe rompe el sustituto del objetivo, el movimiento termina.", // NEEDS QC
		},
	},
	twinkletackle: {
		name: "Arrumaco Sideral",
		shortDesc: "Su potencia depende del Poder Z del movimiento base.", // NEEDS QC
	},
	twister: {
		name: "Ciclón",
		// Official flavor text: "Crea un violento tornado para hacer trizas al objetivo. Puede amedrentarlo."
		desc: "20% de probabilidad de hacer retroceder al objetivo. La potencia se duplica contra objetivos usando Bote, Vuelo, Caída Libre o bajo el efecto de Caída Libre.", // NEEDS QC
		shortDesc: "20% de hacer retroceder al objetivo.", // NEEDS QC
		gen4: {
			desc: "20% de probabilidad de hacer retroceder al objetivo. La potencia se duplica contra objetivos usando Bote o Vuelo.", // NEEDS QC
		},
		gen2: {
			desc: "20% de probabilidad de hacer retroceder al objetivo. La potencia se duplica contra objetivos usando Vuelo.", // NEEDS QC
			shortDesc: "20% de hacer retroceder al objetivo.", // NEEDS QC
		},
	},
	upperhand: {
		name: "Palma Rauda",
		desc: "100% de probabilidad de hacer retroceder al objetivo. Falla si el objetivo no eligió un ataque físico o especial con prioridad alterada mayor que 0 este turno, o si actúa antes que el usuario.", // NEEDS QC
		shortDesc: "100% retroceso. Falla si el rival no usa prioridad.", // NEEDS QC
	},
	uproar: {
		name: "Alboroto",
		// Official flavor text: "Ataca de forma alborotada durante tres turnos. Mantiene despiertos a todos."
		desc: "El usuario queda fijado en este movimiento durante 3 turnos, eligiendo un rival al azar cada turno. En el primero, todos los Pokémon dormidos en combate despiertan. Durante los 3 turnos, nadie puede dormirse por ningún medio, y los que entren durante el efecto no despiertan. Si el usuario no puede actuar o el ataque falla, el efecto termina.", // NEEDS QC
		shortDesc: "Dura 3 turnos. Nadie puede dormirse.", // NEEDS QC
		gen6: {
			desc: "El usuario queda fijado en este movimiento durante 3 turnos, eligiendo un rival adyacente al azar cada turno. En el primero, todos los Pokémon dormidos en combate despiertan. Durante los 3 turnos, nadie puede dormirse por ningún medio, y los que entren durante el efecto no despiertan. Si el usuario no puede actuar o el ataque falla, el efecto termina.", // NEEDS QC
		},
		gen4: {
			desc: "El usuario queda fijado en este movimiento durante 3 a 6 turnos, eligiendo un rival al azar cada turno. Mientras dura el efecto, nadie puede dormirse por ningún medio, y los Pokémon ya dormidos despiertan al empezar su turno o al final de cada turno, incluido el último. Si el usuario no puede actuar o el ataque falla, el efecto termina.", // NEEDS QC
			shortDesc: "Dura 3-6 turnos. Nadie puede dormirse.", // NEEDS QC
		},
		gen3: {
			desc: "El usuario queda fijado en este movimiento durante 2 a 5 turnos, eligiendo un rival al azar cada turno. Mientras dura el efecto, nadie puede dormirse por ningún medio, y los Pokémon ya dormidos despiertan al empezar su turno o al final de cada turno, incluido el último. Si el usuario no puede actuar o el ataque falla, el efecto termina.", // NEEDS QC
			shortDesc: "Dura 2-5 turnos. Nadie puede dormirse.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha montado un alboroto!",
		end: "  ¡{POKEMON} se ha tranquilizado!",
		upkeep: "  ¡{POKEMON} está alborotado!",
		block: "  ¡El alboroto ha mantenido despierto a {POKEMON}!",
		blockSelf: "  ¡{POKEMON} no puede dormirse con tanto alboroto!",
	},
	uturn: {
		name: "Ida y Vuelta",
		// Official flavor text: "Tras atacar, el usuario vuelve a toda prisa para dar paso a otro Pokémon del equipo."
		desc: "Si acierta y el usuario no se ha debilitado, se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos o si el objetivo se cambió con Botón Escape o por las habilidades Retirada o Huida.", // NEEDS QC
		shortDesc: "El usuario se cambia tras dañar al objetivo.", // NEEDS QC
		gen6: {
			desc: "Si acierta y el usuario no se ha debilitado, se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos o si el objetivo se cambió con Botón Escape.", // NEEDS QC
		},
		gen4: {
			desc: "Si acierta y el usuario no se ha debilitado, se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos.", // NEEDS QC
		},

		switchOut: "¡{POKEMON} ha vuelto con {TRAINER:definite}!",
	},
	vacuumwave: {
		name: "Onda Vacío",
		// Official flavor text: "Gira los puños y libera una onda de vacío contra el objetivo. Este movimiento tiene prioridad alta."
		desc: "Sin efecto adicional.", // NEEDS QC
		shortDesc: "Suele actuar primero (prioridad +1).", // NEEDS QC
	},
	vcreate: {
		name: "V de Fuego",
		// Official flavor text: "Golpea con una V de llamas al objetivo. Baja la Defensa, la Defensa Especial y la Velocidad de quien lo usa."
		desc: "Baja 1 nivel la Velocidad, la Defensa y la Defensa Especial del usuario.", // NEEDS QC
		shortDesc: "Baja 1 nivel su Defensa, Def. Esp. y Velocidad.", // NEEDS QC
	},
	veeveevolley: {
		name: "Eevimpacto",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia es (amistad del usuario×2/5) (redondeado hacia abajo, mínimo 1).", // NEEDS QC
		shortDesc: "Potencia 102 con amistad máxima. No falla.", // NEEDS QC
	},
	venomdrench: {
		name: "Trampa Venenosa",
		// Official flavor text: "Impregna a su objetivo con un líquido venenoso que disminuye el Ataque, el Ataque Especial y la Velocidad. Solo afecta a Pokémon ya envenenados."
		desc: "Baja 1 nivel el Ataque, el Ataque Especial y la Velocidad del objetivo si está envenenado. Falla si no lo está.", // NEEDS QC
		shortDesc: "-1 Ataque, At. Esp. y Vel. a rivales envenenados.", // NEEDS QC
	},
	venoshock: {
		name: "Carga Tóxica",
		// Official flavor text: "Cubre al objetivo con un líquido venenoso. El daño será doble si este ya está envenenado."
		desc: "La potencia se duplica si el objetivo está envenenado.", // NEEDS QC
		shortDesc: "Potencia doble contra objetivos envenenados.", // NEEDS QC
	},
	victorydance: {
		name: "Danza Triunfal",
		desc: "Sube 1 nivel el Ataque, la Defensa y la Velocidad del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Ataque, Defensa y Velocidad del usuario.", // NEEDS QC
	},
	vinewhip: {
		name: "Látigo Cepa",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	visegrip: {
		name: "Agarre",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	vitalthrow: {
		name: "Llave Vital",
		// Official flavor text: "El usuario ataca el último, pero no falla."
		desc: "No comprueba la precisión.", // NEEDS QC
		shortDesc: "No comprueba la precisión. Actúa al final.", // NEEDS QC
	},
	voltswitch: {
		name: "Voltiocambio",
		// Official flavor text: "Tras atacar, el usuario vuelve a toda prisa para dar paso a otro Pokémon del equipo."
		desc: "Si acierta y el usuario no se ha debilitado, se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos o si el objetivo se cambió con Botón Escape o por las habilidades Retirada o Huida.", // NEEDS QC
		shortDesc: "El usuario se cambia tras dañar al objetivo.", // NEEDS QC
		gen6: {
			desc: "Si acierta y el usuario no se ha debilitado, se cambia aunque esté atrapado, siendo reemplazado de inmediato por el compañero elegido. No se cambia si no quedan compañeros sanos o si el objetivo se cambió con Botón Escape.", // NEEDS QC
		},

		switchOut: "#uturn",
	},
	volttackle: {
		name: "Placaje Eléctrico",
		// Official flavor text: "Quien lo usa electrifica su cuerpo para luego atacar. Se hiere mucho a sí mismo, pero puede paralizar al objetivo."
		desc: "10% de probabilidad de paralizar al objetivo. Si el objetivo pierde PS, el usuario sufre un retroceso del 33% del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso del 33%. 10% de paralizar.", // NEEDS QC
		gen4: {
			desc: "10% de probabilidad de paralizar al objetivo. Si el objetivo pierde PS, el usuario sufre un retroceso de 1/3 del daño infligido (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "1/3 de retroceso. 10% de paralizar.", // NEEDS QC
		},
		gen3: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/3 de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "Tiene 1/3 de retroceso.", // NEEDS QC
		},
	},
	wakeupslap: {
		name: "Espabila",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia se duplica si el objetivo está dormido. Si el usuario no se ha debilitado, el objetivo despierta.", // NEEDS QC
		shortDesc: "Doble contra dormidos, pero los despierta.", // NEEDS QC
		gen4: {
			desc: "La potencia se duplica si el objetivo está dormido. Si acierta, el objetivo despierta.", // NEEDS QC
		},
	},
	waterfall: {
		name: "Cascada",
		// Official flavor text: "Embiste con un gran impulso que puede llegar a amedrentar."
		desc: "20% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "20% de hacer retroceder al objetivo.", // NEEDS QC
		gen3: {
			desc: "Sin efecto adicional.", // NEEDS QC
			shortDesc: "Sin efecto adicional.", // NEEDS QC
		},
	},
	watergun: {
		name: "Pistola Agua",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	waterpledge: {
		name: "Voto Agua",
		// Official flavor text: "Ataca con columnas de agua. Combinado con Voto Fuego, crea un arcoíris y aumenta su potencia."
		desc: "Si un aliado eligió Voto Fuego o Voto Planta este turno y aún no ha actuado, actúa justo después del usuario y el movimiento del usuario no hace nada. Combinado con Voto Fuego, el aliado usa Voto Agua con 150 de potencia y un arcoíris aparece en el bando del usuario durante 4 turnos: duplica la probabilidad de los efectos secundarios (se acumula con la habilidad Dicha, salvo para el retroceso, que solo se duplica una vez). Combinado con Voto Planta, el aliado usa Voto Planta con 150 de potencia y un pantano aparece en el bando rival durante 4 turnos, reduciendo a 1/4 la Velocidad de ese bando. Como movimiento combinado recibe STAB sin importar el tipo del usuario. No consume Gema Agua y la habilidad Colector no puede redirigirlo.", // NEEDS QC
		shortDesc: "Combínalo con los otros votos para efectos extra.", // NEEDS QC

		activate: "  {POKEMON} está esperando a {TARGET}...",
		start: "  ¡Ha aparecido un arcoíris sobre {TEAM}!",
		end: "  El arcoíris sobre {TEAM} ha desaparecido.",
	},
	waterpulse: {
		name: "Hidropulso",
		// Official flavor text: "Ataca con un potente chorro de agua. Puede confundir al objetivo."
		desc: "20% de probabilidad de confundir al objetivo.", // NEEDS QC
		shortDesc: "20% de confundir al objetivo.", // NEEDS QC
	},
	watershuriken: {
		name: "Shuriken de Agua",
		// Official flavor text: "Golpea al oponente de dos a cinco veces con estrellas arrojadizas hechas de mucosidad. Este movimiento tiene prioridad alta."
		desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces. Si el usuario es un Greninja Ash con la habilidad Fuerte Afecto, tiene 20 de potencia y golpea siempre 3 veces. Con Dado Trucado, golpea siempre 4 o 5 veces.", // NEEDS QC
		shortDesc: "Suele actuar primero. Golpea de 2 a 5 veces.", // NEEDS QC
		gen8: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
		gen6: {
			desc: "Golpea de 2 a 5 veces: 35% de probabilidad de 2 o 3 golpes y 15% de 4 o 5. Si un golpe rompe el sustituto del objetivo, los restantes dañan al Pokémon. Con la habilidad Encadenado, golpea siempre 5 veces.", // NEEDS QC
		},
	},
	watersport: {
		name: "Hidrochorro",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "Durante 5 turnos, la potencia de los ataques de tipo Fuego de todos los Pokémon en combate se multiplica por 0,33. Falla si el efecto ya está activo.", // NEEDS QC
		shortDesc: "5 turnos: los ataques de Fuego tienen 1/3 de potencia.", // NEEDS QC
		gen5: {
			desc: "Mientras el usuario siga en combate, la potencia de los ataques de tipo Fuego de todos los Pokémon en combate se multiplica por 0,33. Falla si el efecto ya está activo para algún Pokémon.", // NEEDS QC
			shortDesc: "Reduce los ataques de Fuego a 1/3 de potencia.", // NEEDS QC
		},
		gen4: {
			desc: "Mientras el usuario siga en combate, la potencia de los ataques de tipo Fuego de todos los Pokémon en combate se reduce a la mitad. Falla si el efecto ya está activo para el usuario. Relevo puede transferir este efecto a un compañero.", // NEEDS QC
			shortDesc: "Reduce los ataques de Fuego a 1/2 de potencia.", // NEEDS QC
		},
	},
	waterspout: {
		name: "Salpicar",
		// Official flavor text: "Chorro de agua. Cuantos menos PS tenga el usuario, menos dañino será."
		desc: "La potencia es (PS actuales del usuario×150÷PS máximos del usuario) (redondeado hacia abajo, mínimo 1).", // NEEDS QC
		shortDesc: "Menos potencia con menos PS. Golpea a los rivales.", // NEEDS QC
	},
	wavecrash: {
		name: "Envite Acuático",
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso del 33% del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso del 33% del daño.", // NEEDS QC
	},
	weatherball: {
		name: "Meteorobola",
		// Official flavor text: "El tipo y fuerza del ataque varían según el tiempo que haga."
		desc: "La potencia se duplica si hay un clima activo (salvo turbulencias) y su tipo cambia según este: Hielo con nieve, Agua con lluvia o diluvio, Roca con tormenta de arena y Fuego con sol o luz solar extrema. Si el usuario lleva Parasol Multiuso y lo usa con lluvia, diluvio, sol o luz solar extrema, sigue siendo de tipo Normal y no duplica su potencia.", // NEEDS QC
		shortDesc: "Con clima: potencia doble y tipo variable.", // NEEDS QC
		gen8: {
			desc: "La potencia se duplica si hay un clima activo (salvo turbulencias) y su tipo cambia según este: Hielo con Granizo, Agua con lluvia o diluvio, Roca con Tormenta de Arena y Fuego con sol o luz solar extrema. Si el usuario lleva Parasol Multiuso y lo usa con lluvia, diluvio, sol o luz solar extrema, sigue siendo de tipo Normal y no duplica su potencia.", // NEEDS QC
		},
		gen5: {
			desc: "La potencia se duplica si hay un clima activo y su tipo cambia según este: Hielo con Granizo, Agua con lluvia, Roca con Tormenta de Arena y Fuego con sol.", // NEEDS QC
		},
		gen3: {
			desc: "El daño se duplica si hay un clima activo y su tipo cambia según este: Hielo con Granizo, Agua con lluvia, Roca con Tormenta de Arena y Fuego con sol.", // NEEDS QC
			shortDesc: "Doble de daño y tipo variable según el clima.", // NEEDS QC
		},

		move: "¡Carrera Arrolladora ha cambiado a {MOVE} debido al tiempo!",
	},
	whirlpool: {
		name: "Torbellino",
		// Official flavor text: "Una tromba de agua atrapa al objetivo durante cuatro o cinco turnos."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (1/8 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos (siempre 5 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
			shortDesc: "Atrapa y daña al objetivo durante 2-5 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si usa Relevo. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ha quedado atrapado dentro del torbellino!",
	},
	whirlwind: {
		name: "Remolino",
		// Official flavor text: "Se lleva al objetivo, que es cambiado por otro Pokémon. Si es un Pokémon salvaje, acaba el combate."
		desc: "Obliga al objetivo a cambiarse por un aliado sano al azar. Falla si el objetivo es el último Pokémon sano de su equipo, si usó Arraigo o si tiene la habilidad Ventosas.", // NEEDS QC
		shortDesc: "Obliga al objetivo a cambiarse por un aliado al azar.", // NEEDS QC
		gen4: {
			desc: "Obliga al objetivo a cambiarse por un aliado sano al azar. Falla si el objetivo es el último Pokémon sano de su equipo, si usó Arraigo o si tiene la habilidad Ventosas, o si el nivel del usuario es menor que el del objetivo y X×(nivel del usuario+nivel del objetivo)÷256+1 es menor o igual que (nivel del objetivo÷4), redondeado hacia abajo, donde X es un número al azar entre 0 y 255.", // NEEDS QC
		},
		gen2: {
			desc: "Obliga al objetivo a cambiarse por un aliado sano al azar. Falla si el objetivo es el último Pokémon sano de su equipo, o si el usuario actúa antes que el objetivo.", // NEEDS QC
		},
		gen1: {
			desc: "Sin uso competitivo.", // NEEDS QC
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	wickedblow: {
		name: "Golpe Oscuro",
		// Official flavor text: "Golpe devastador que requiere un absoluto dominio de las artes siniestras. Siempre asesta un golpe crítico."
		desc: "Siempre asesta un golpe crítico, salvo que el objetivo esté bajo el efecto de Conjuro o tenga las habilidades Armadura Batalla o Caparazón.", // NEEDS QC
		shortDesc: "Siempre asesta un golpe crítico.", // NEEDS QC
	},
	wickedtorque: {
		name: "Ominochoque",
		desc: "10% de probabilidad de dormir al objetivo.", // NEEDS QC
		shortDesc: "10% de dormir al objetivo.", // NEEDS QC
	},
	wideguard: {
		name: "Vasta Guardia",
		// Official flavor text: "Bloquea los ataques de objetivo múltiple lanzados contra tu equipo durante un turno."
		desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos de otros Pokémon, incluidos aliados, que tengan como objetivo a todos los rivales adyacentes o a todos los Pokémon adyacentes. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Llama Protectora, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Telatrampa, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		shortDesc: "Protege a los aliados de movimientos múltiples.", // NEEDS QC
		gen8: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos de otros Pokémon, incluidos aliados, que tengan como objetivo a todos los rivales adyacentes o a todos los Pokémon adyacentes. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Maxibarrera, Obstrucción, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		},
		gen7: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los movimientos de otros Pokémon, incluidos aliados, que tengan como objetivo a todos los rivales adyacentes o a todos los Pokémon adyacentes. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Búnker, Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		},
		gen6: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los ataques que causan daño de otros Pokémon, incluidos aliados, que tengan como objetivo a todos los rivales adyacentes o a todos los Pokémon adyacentes. Modifica el mismo contador 1/X que otras protecciones (X empieza en 1 y se triplica con cada uso exitoso), pero no usa esa probabilidad para decidir su éxito. X vuelve a 1 si falla, si el último movimiento usado no fue Detección, Aguante, Escudo Real, Protección, Anticipo, Barrera Espinosa, Vasta Guardia, o si fue uno de ellos y la protección se rompió. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
			shortDesc: "Protege al equipo de ataques multiobjetivo.", // NEEDS QC
		},
		gen5: {
			desc: "Este turno, el usuario y sus compañeros quedan protegidos de los ataques que causan daño de otros Pokémon, incluidos aliados, que tengan como objetivo a todos los rivales adyacentes o a todos los Pokémon adyacentes. Tiene 1/X de probabilidad de éxito: X empieza en 1 y se duplica con cada uso exitoso. X vuelve a 1 si falla o si el último movimiento usado no fue Detección, Aguante, Protección, Anticipo, Vasta Guardia. Si X es 256 o más, tiene 1/(2^32) de probabilidad de éxito. Falla si el usuario actúa el último este turno o si el efecto ya está activo en su bando.", // NEEDS QC
		},

		start: "  ¡{TEAM} está protegido por Vasta Guardia!",
		block: "  ¡{POKEMON} está protegido por Vasta Guardia!",
	},
	wildboltstorm: {
		name: "Electormenta",
		desc: "20% de probabilidad de paralizar al objetivo. No puede fallar si llueve o hay diluvio. Contra un objetivo con Parasol Multiuso, su precisión sigue siendo del 80%.", // NEEDS QC
		shortDesc: "20% de paralizar. No falla con lluvia.", // NEEDS QC
	},
	wildcharge: {
		name: "Voltio Cruel",
		// Official flavor text: "Carga eléctrica muy potente que también hiere ligeramente a quien la usa."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso de 1/4 del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso de 1/4 del daño.", // NEEDS QC
	},
	willowisp: {
		name: "Fuego Fatuo",
		// Official flavor text: "Siniestra llama morada que produce quemaduras."
		desc: "Quema al objetivo.", // NEEDS QC
		shortDesc: "Quema al objetivo.", // NEEDS QC
	},
	wingattack: {
		name: "Ataque Ala",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	wish: {
		name: "Deseo",
		// Official flavor text: "Restaura en el siguiente turno la mitad de los PS máximos del usuario o se los pasa al Pokémon que lo sustituye."
		desc: "Al final del próximo turno, el Pokémon en la posición del usuario recupera la mitad de los PS máximos del usuario (redondeado hacia abajo). Falla si el efecto ya está activo para esa posición.", // NEEDS QC
		shortDesc: "El próximo turno recupera la mitad de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "Al final del próximo turno, el Pokémon en la posición del usuario recupera la mitad de sus propios PS máximos (redondeado hacia abajo). Falla si el efecto ya está activo para esa posición.", // NEEDS QC
			shortDesc: "El próximo turno cura la mitad de los PS del receptor.", // NEEDS QC
		},

		heal: "  ¡El deseo de {NICKNAME} se ha hecho realidad!",
	},
	withdraw: {
		name: "Refugio",
		// Official flavor text: "El usuario se resguarda en su coraza, por lo que le sube la Defensa."
		desc: "Sube 1 nivel la Defensa del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Defensa del usuario.", // NEEDS QC
	},
	wonderroom: {
		name: "Zona Extraña",
		// Official flavor text: "Crea una zona misteriosa donde se intercambian la Defensa y la Defensa Especial de todos los Pokémon durante cinco turnos."
		desc: "Durante 5 turnos, la Defensa y la Defensa Especial de todos los Pokémon en combate se intercambian. Los cambios de nivel no se ven afectados. Si se usa durante el efecto, este termina.", // NEEDS QC
		shortDesc: "5 turnos: se intercambian Defensa y Def. Esp.", // NEEDS QC
	},
	woodhammer: {
		name: "Mazazo",
		// Official flavor text: "Arremete contra el objetivo con su robusto cuerpo. El agresor también sufre bastante daño."
		desc: "Si el objetivo pierde PS, el usuario sufre un retroceso del 33% del daño infligido (redondeado al alza desde 0,5, mínimo 1 PS).", // NEEDS QC
		shortDesc: "Retroceso del 33% del daño.", // NEEDS QC
		gen4: {
			desc: "Si el objetivo perdió PS, el usuario sufre daño de retroceso igual a 1/3 de los PS perdidos por el objetivo (redondeado hacia abajo, mínimo 1 PS).", // NEEDS QC
			shortDesc: "Tiene 1/3 de retroceso.", // NEEDS QC
		},
	},
	workup: {
		name: "Avivar",
		// Official flavor text: "Quien lo usa se concentra y potencia su Ataque y su Ataque Especial."
		desc: "Sube 1 nivel el Ataque y el Ataque Especial del usuario.", // NEEDS QC
		shortDesc: "Sube 1 nivel Ataque y At. Esp. del usuario.", // NEEDS QC
	},
	worryseed: {
		name: "Abatidoras",
		// Official flavor text: "Planta una semilla en el objetivo que le causa pesar. Sustituye la habilidad del objetivo por Insomnio y le impide dormirse."
		desc: "La habilidad del objetivo pasa a ser Insomnio. Falla si su habilidad es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Insomnio, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Ausente, Modo Daruma, Cambio Heroico.", // NEEDS QC
		shortDesc: "La habilidad del objetivo pasa a ser Insomnio.", // NEEDS QC
		gen8: {
			desc: "La habilidad del objetivo pasa a ser Insomnio. Falla si su habilidad es Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Insomnio, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Ausente, Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "La habilidad del objetivo pasa a ser Insomnio. Falla si su habilidad es Fuerte Afecto, Letargo Perenne, Disfraz, Insomnio, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Ausente, Modo Daruma.", // NEEDS QC
		},
		gen6: {
			desc: "La habilidad del objetivo pasa a ser Insomnio. Falla si su habilidad es Insomnio, Multitipo, Cambio Táctico, Ausente.", // NEEDS QC
		},
		gen5: {
			desc: "La habilidad del objetivo pasa a ser Insomnio. Falla si su habilidad es Insomnio, Multitipo, Ausente.", // NEEDS QC
		},
		gen4: {
			desc: "La habilidad del objetivo pasa a ser Insomnio. Falla si su habilidad es Multitipo o Ausente, o si el objetivo lleva Griseosfera.", // NEEDS QC
		},
	},
	wrap: {
		name: "Constricción",
		// Official flavor text: "Oprime al objetivo de cuatro a cinco turnos con ramas o con su cuerpo."
		desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Autotomía, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Mortífero, Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		shortDesc: "Atrapa y daña al objetivo durante 4-5 turnos.", // NEEDS QC
		gen8: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Viraje, Última Palabra, Teletransporte, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen7: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/8 de sus PS máximos (1/6 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Última Palabra, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que el objetivo se cambie durante 4 o 5 turnos (7 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (1/8 con Banda Atadura, redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta, Voltiocambio. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos (siempre 5 si el usuario lleva Garra Garfio) y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si lleva Muda Concha o usa Relevo, Ida y Vuelta. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
			shortDesc: "Atrapa y daña al objetivo durante 2-5 turnos.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que el objetivo se cambie durante 2 a 5 turnos y le inflige 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Puede cambiarse igualmente si usa Relevo. El efecto termina si el usuario o el objetivo dejan el campo, o si el objetivo usa con éxito Giro Rápido, Sustituto. No es acumulable ni se reinicia usando este u otro movimiento de atadura.", // NEEDS QC
		},
		gen1: {
			desc: "El usuario pasa de 2 a 5 turnos usando este movimiento: 3/8 de probabilidad de que dure 2 o 3 turnos y 1/8 de que dure 4 o 5. El daño calculado el primer turno se repite en los demás. El usuario no puede elegir movimiento y el objetivo no puede ejecutar movimientos durante el efecto, pero ambos pueden cambiarse. Si el usuario se cambia, el objetivo sigue sin poder actuar ese turno. Si el objetivo se cambia, el usuario vuelve a usar este movimiento automáticamente, y si entonces tenía 0 PP, pasan a 63. Si alguno se cambia o el usuario no puede actuar, el efecto termina. Este movimiento puede impedir actuar al objetivo aunque tenga inmunidad de tipo, pero entonces no inflige daño.", // NEEDS QC
			shortDesc: "El objetivo no puede actuar durante 2-5 turnos.", // NEEDS QC
		},

		start: "  ¡{SOURCE} ha atrapado a {POKEMON} con Constricción!",
		move: "¡{POKEMON} sigue atacando!",
	},
	wringout: {
		name: "Estrujón",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "La potencia es 120×(PS actuales del objetivo÷PS máximos del objetivo) (redondeado a la baja desde 0,5, mínimo 1).", // NEEDS QC
		shortDesc: "Más potencia cuantos más PS le queden al objetivo.", // NEEDS QC
		gen4: {
			desc: "La potencia es 120 × (PS actuales del objetivo ÷ PS máximos del objetivo) + 1, redondeado hacia abajo.", // NEEDS QC
		},
	},
	xscissor: {
		name: "Tijera X",
		shortDesc: "Sin efecto adicional.", // NEEDS QC
	},
	yawn: {
		name: "Bostezo",
		// Official flavor text: "Gran bostezo que induce al sueño al objetivo en el siguiente turno."
		desc: "Duerme al objetivo al final del próximo turno. Falla al usarse si el objetivo no puede dormirse o ya tiene un problema de estado. Al final del próximo turno, si sigue en combate, sin problemas de estado y puede dormirse, se duerme. Una vez afectado, ni Velo Sagrado ni un sustituto pueden evitarlo, ni tampoco dormirse y despertar durante el efecto.", // NEEDS QC
		shortDesc: "Duerme al objetivo al final del próximo turno.", // NEEDS QC

		start: "  ¡{POKEMON} está somnoliento!",
	},
	zapcannon: {
		name: "Electrocañón",
		// Official flavor text: "Dispara una descarga eléctrica que causa daño y parálisis."
		desc: "100% de probabilidad de paralizar al objetivo.", // NEEDS QC
		shortDesc: "100% de paralizar al objetivo.", // NEEDS QC
	},
	zenheadbutt: {
		name: "Cabezazo Zen",
		// Official flavor text: "Concentra su energía psíquica en la cabeza para golpear. Puede hacer que el objetivo se amedrente."
		desc: "20% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "20% de hacer retroceder al objetivo.", // NEEDS QC
	},
	zingzap: {
		name: "Electropunzada",
		// Official flavor text: "Se lanza contra el objetivo y le suelta una potente descarga eléctrica que puede hacer que se amedrente."
		desc: "30% de probabilidad de hacer retroceder al objetivo.", // NEEDS QC
		shortDesc: "30% de hacer retroceder al objetivo.", // NEEDS QC
	},
	zippyzap: {
		name: "Pikaturbo",
		// Official flavor text: "Este movimiento no se puede usar, por lo que sería mejor olvidarlo, aunque eso implique que no se pueda recordar posteriormente."
		desc: "100% de probabilidad de subir 1 nivel la evasión del usuario.", // NEEDS QC
		shortDesc: "Actúa primero. Sube 1 nivel su evasión.", // NEEDS QC
		gen7: {
			desc: "Siempre asesta un golpe crítico.", // NEEDS QC
			shortDesc: "Casi siempre actúa primero. Siempre es crítico.", // NEEDS QC
		},
	},
};
